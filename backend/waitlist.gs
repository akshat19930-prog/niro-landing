/**
 * Niro waitlist backend — Google Apps Script Web App writing to a Google Sheet.
 *
 * Receives the signup payload POSTed by the landing page's join flow and:
 *   - upserts one row per signup, keyed by eventId (the flow POSTs up to 3 times
 *     as the visitor progresses email -> tasks -> plan; we enrich the same row),
 *   - returns { position, referralCode } as JSON.
 *
 * DEPLOY (2 minutes):
 *   1. Create a new Google Sheet (this stores the signups).
 *   2. Extensions -> Apps Script. Select ALL existing code, delete it, paste
 *      this whole file. Save (disk icon / Ctrl-S).
 *   3. Deploy -> New deployment -> type "Web app".
 *        Execute as: Me.   Who has access: Anyone.
 *      Authorize when prompted. Copy the Web app URL (ends in /exec).
 *   4. In the GitHub repo: Settings -> Secrets and variables -> Actions ->
 *      Variables -> add NEXT_PUBLIC_WAITLIST_ENDPOINT = that /exec URL.
 *
 * (Meta CAPI server-side events were removed for simplicity; email capture does
 * not need them. Ask if you want them back later.)
 */

// ---- Config -----------------------------------------------------------------
var SHEET_NAME = "waitlist";
// Starting position for the Sheet's internal "position" column; grows with each
// signup. (The site's confirmation shows its own number, so this is cosmetic for
// the Sheet — no need to redeploy the script just to change it.)
var BASE_POSITION = 320;

var EVENTS_SHEET = "events";
var EVENTS_HEADER = ["timestamp", "date", "event", "arm", "pitch", "sid", "durationMs", "engaged"];

// ---- Entry points -----------------------------------------------------------
function doPost(e) {
  var data = {};
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (parseErr) {
    data = {};
  }

  // Funnel/session beacons go to the events tab (no lock — high volume, append
  // is fine, and we never read them back in the same request).
  if (data.type === "event") {
    return logEventRow_(data);
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // serialize writes so positions/dedupe stay consistent
  try {
    var sheet = getSheet_();
    var eventId = String(data.eventId || "");
    var email = String(data.email || "").trim().toLowerCase();
    var utm = data.utm || {};

    var values = sheet.getDataRange().getValues();
    var rowIndex = -1; // 1-based sheet row
    if (eventId) {
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][1]) === eventId) {
          rowIndex = i + 1;
          break;
        }
      }
    }

    // Never create a blank row: a genuine signup always carries an email. This
    // also protects against stray/bot POSTs and any beacon reaching this path.
    if (rowIndex === -1 && !email) {
      return json_({ ignored: true });
    }

    var referralCode;
    var position;
    // Column indexes (1-based) matching HEADER.
    var C_REFCODE = 13, C_POSITION = 14;
    var C_TASKS = 15, C_WHOFOR = 16, C_URGENCY = 17, C_PHONE = 18;
    var tasksStr = (data.tasks && data.tasks.length) ? data.tasks.join(" | ") : "";

    if (rowIndex === -1) {
      // New signup. Order must match HEADER.
      referralCode = slugFromEmail_(email);
      position = BASE_POSITION + Math.max(0, sheet.getLastRow()); // header = 1
      sheet.appendRow([
        new Date(), eventId, email, data.arm || "",
        data.pitch || "", data.ref || "", data.planId || "",
        utm.utm_source || "", utm.utm_medium || "", utm.utm_campaign || "",
        utm.utm_content || "", utm.fbclid || "", referralCode, position,
        tasksStr, data.whoFor || "", data.urgency || "", data.phone || ""
      ]);
    } else {
      // Existing signup - enrich the row, keep its position/referralCode.
      var row = values[rowIndex - 1];
      referralCode = row[C_REFCODE - 1] || slugFromEmail_(email);
      position = row[C_POSITION - 1] || (BASE_POSITION + rowIndex);
      if (email) sheet.getRange(rowIndex, 3).setValue(email);
      if (data.arm) sheet.getRange(rowIndex, 4).setValue(data.arm);
      if (data.pitch) sheet.getRange(rowIndex, 5).setValue(data.pitch);
      if (data.ref) sheet.getRange(rowIndex, 6).setValue(data.ref);
      if (data.planId) sheet.getRange(rowIndex, 7).setValue(data.planId);
      if (tasksStr) sheet.getRange(rowIndex, C_TASKS).setValue(tasksStr);
      if (data.whoFor) sheet.getRange(rowIndex, C_WHOFOR).setValue(data.whoFor);
      if (data.urgency) sheet.getRange(rowIndex, C_URGENCY).setValue(data.urgency);
      if (data.phone) sheet.getRange(rowIndex, C_PHONE).setValue(data.phone);
    }

    return json_({ position: position, referralCode: referralCode });
  } catch (err) {
    return json_({ error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: "niro-waitlist" });
}

// ---- Helpers ----------------------------------------------------------------
var HEADER = [
  "timestamp", "eventId", "email", "arm", "pitch", "ref",
  "planId", "utm_source", "utm_medium", "utm_campaign", "utm_content",
  "fbclid", "referralCode", "position",
  // Lead-quality qualifiers (appended so existing column indexes never shift).
  "tasks", "whoFor", "urgency", "phone"
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  // Always keep the header row in sync (migrates older sheets that predate the
  // pitch/ref columns; trailing new columns just stay blank for old rows).
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
  } else {
    sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);
  }
  return sheet;
}

function logEventRow_(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(EVENTS_SHEET);
    if (!sheet) {
      sheet = ss.insertSheet(EVENTS_SHEET);
      sheet.appendRow(EVENTS_HEADER);
    }
    var when = data.ts ? new Date(Number(data.ts)) : new Date();
    var date = Utilities.formatDate(when, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
    sheet.appendRow([
      when, date, String(data.event || ""), String(data.arm || ""),
      String(data.pitch || ""), String(data.sid || ""),
      data.durationMs != null ? Number(data.durationMs) : "",
      data.engaged != null ? Number(data.engaged) : ""
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ error: String(err) });
  }
}

function slugFromEmail_(email) {
  var s = String(email).split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
  return s || "friend";
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
