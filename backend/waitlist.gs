/**
 * Niro waitlist backend — Google Apps Script Web App writing to a Google Sheet.
 *
 * Receives the signup payload POSTed by the landing page's join flow and:
 *   - upserts one row per signup, keyed by eventId (the flow POSTs 3 times as
 *     the visitor progresses email → tasks → plan; we enrich the same row),
 *   - returns { position, referralCode } as JSON,
 *   - (optional) forwards a Meta CAPI "Lead" event using the same eventId so it
 *     de-dupes against the browser pixel.
 *
 * DEPLOY (2 minutes):
 *   1. Create a new Google Sheet (this will store the signups).
 *   2. Extensions → Apps Script. Delete the default code, paste this whole file.
 *   3. (Optional) fill META_PIXEL_ID + META_CAPI_TOKEN below to enable CAPI.
 *   4. Deploy → New deployment → type "Web app".
 *        Execute as: Me.   Who has access: Anyone.
 *      Authorize when prompted. Copy the Web app URL (ends in /exec).
 *   5. In the GitHub repo: Settings → Secrets and variables → Actions →
 *      Variables → add NEXT_PUBLIC_WAITLIST_ENDPOINT = that /exec URL.
 *      Re-run the "Deploy to GitHub Pages" workflow (or push any commit).
 *
 * After that, every waitlist signup lands as a row in the Sheet.
 */

// ---- Config -----------------------------------------------------------------
var SHEET_NAME = "waitlist";
// Vanity starting position shown to the first signup; grows with each signup.
var BASE_POSITION = 1800;
// Optional Meta Conversions API (leave blank to skip server-side events).
var META_PIXEL_ID = "";
var META_CAPI_TOKEN = "";

// ---- Entry points -----------------------------------------------------------
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // serialize writes so positions/dedupe stay consistent
  try {
    var data = {};
    try { data = JSON.parse((e && e.postData && e.postData.contents) || "{}"); }
    catch (_) { data = {}; }

    var sheet = getSheet_();
    var eventId = String(data.eventId || "");
    var email = String(data.email || "").trim().toLowerCase();
    var utm = data.utm || {};

    var values = sheet.getDataRange().getValues();
    var rowIndex = -1; // 1-based sheet row
    if (eventId) {
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][1]) === eventId) { rowIndex = i + 1; break; }
      }
    }

    var referralCode, position;
    var interests = (data.alsoInterestedIds || []).join("|");

    if (rowIndex === -1) {
      // New signup.
      referralCode = slugFromEmail_(email);
      position = BASE_POSITION + Math.max(0, sheet.getLastRow()); // header = 1
      sheet.appendRow([
        new Date(), eventId, email, data.arm || "",
        data.primaryTaskId || "", interests, data.planId || "",
        utm.utm_source || "", utm.utm_medium || "", utm.utm_campaign || "",
        utm.utm_content || "", utm.fbclid || "", referralCode, position,
      ]);
      maybeSendCapi_(email, eventId, utm);
    } else {
      // Existing signup — enrich the row, keep its position/referralCode.
      var row = values[rowIndex - 1];
      referralCode = row[12] || slugFromEmail_(email);
      position = row[13] || (BASE_POSITION + rowIndex);
      if (email) sheet.getRange(rowIndex, 3).setValue(email);
      if (data.arm) sheet.getRange(rowIndex, 4).setValue(data.arm);
      if (data.primaryTaskId) sheet.getRange(rowIndex, 5).setValue(data.primaryTaskId);
      if (data.alsoInterestedIds) sheet.getRange(rowIndex, 6).setValue(interests);
      if (data.planId) sheet.getRange(rowIndex, 7).setValue(data.planId);
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
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "timestamp", "eventId", "email", "arm", "primaryTaskId",
      "alsoInterestedIds", "planId", "utm_source", "utm_medium",
      "utm_campaign", "utm_content", "fbclid", "referralCode", "position",
    ]);
  }
  return sheet;
}

function slugFromEmail_(email) {
  var s = String(email).split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
  return s || "friend";
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sha256Hex_(value) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8);
  return bytes.map(function (b) {
    return ("0" + (b & 0xff).toString(16)).slice(-2);
  }).join("");
}

function maybeSendCapi_(email, eventId, utm) {
  if (!META_PIXEL_ID || !META_CAPI_TOKEN || !email) return;
  try {
    var payload = {
      data: [{
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: eventId,
        event_source_url: "https://tellniro.com/",
        user_data: {
          em: [sha256Hex_(email)],
          fbc: utm.fbclid ? "fb.1." + Math.floor(Date.now() / 1000) + "." + utm.fbclid : undefined,
        },
      }],
    };
    UrlFetchApp.fetch(
      "https://graph.facebook.com/v19.0/" + META_PIXEL_ID + "/events?access_token=" +
        encodeURIComponent(META_CAPI_TOKEN),
      { method: "post", contentType: "application/json",
        payload: JSON.stringify(payload), muteHttpExceptions: true });
  } catch (_) { /* never let CAPI failure break the signup */ }
}
