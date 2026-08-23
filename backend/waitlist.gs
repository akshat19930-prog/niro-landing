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
var EVENTS_HEADER = ["timestamp", "date", "event", "arm", "pitch", "sid", "durationMs", "engaged", "page", "geo", "market", "priceArm", "campaign"];

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
    var C_MARKET = 19, C_PAGE = 20, C_GEO = 21, C_PRICEARM = 22;
    var tasksStr = (data.tasks && data.tasks.length) ? data.tasks.join(" | ") : "";
    // Geography: prefer the market the page declared ("gulf" on /gulf), else the
    // coarse region the client inferred from its time zone ("gulf"/"na"/"other").
    var market = String(data.market || "");
    var pagePath = String(data.page || "");
    var geo = String(data.geo || "");
    // /gulf price A/B arm ("149" | "99"); blank for non-gulf leads.
    var priceArm = String(data.priceArm || "");

    if (rowIndex === -1) {
      // New signup. Order must match HEADER.
      referralCode = slugFromEmail_(email);
      position = BASE_POSITION + Math.max(0, sheet.getLastRow()); // header = 1
      sheet.appendRow([
        new Date(), eventId, email, data.arm || "",
        data.pitch || "", data.ref || "", data.planId || "",
        utm.utm_source || "", utm.utm_medium || "", utm.utm_campaign || "",
        utm.utm_content || "", utm.fbclid || "", referralCode, position,
        tasksStr, data.whoFor || "", data.urgency || "", data.phone || "",
        market, pagePath, geo, priceArm
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
      // Attribution is first-touch: only fill these if still blank, so a later
      // enrich POST can't overwrite the geography captured at email entry.
      if (market && !row[C_MARKET - 1]) sheet.getRange(rowIndex, C_MARKET).setValue(market);
      if (pagePath && !row[C_PAGE - 1]) sheet.getRange(rowIndex, C_PAGE).setValue(pagePath);
      if (geo && !row[C_GEO - 1]) sheet.getRange(rowIndex, C_GEO).setValue(geo);
      if (priceArm && !row[C_PRICEARM - 1]) sheet.getRange(rowIndex, C_PRICEARM).setValue(priceArm);
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
  "tasks", "whoFor", "urgency", "phone",
  // Attribution: which page/market the lead came from, and coarse geography
  // ("gulf"/"na"/"other").
  "market", "page", "geo",
  // /gulf price A/B arm ("149" | "99"); blank for non-gulf leads.
  "priceArm"
];

/* =====================================================================
   RETRO-BACKFILL: resolve the `market` column for every existing lead.
   -----------------------------------------------------------------------
   Older rows were only tagged with a coarse time-zone `geo`, so anyone
   outside the Gulf / North America zones landed as "other" — including real
   Gulf leads whose phone is set to IST. This rewrites `market` for every row
   using the strongest signal available, in order:

       1. page          (/gulf  -> gulf_dual)
       2. utm_campaign  (…gulf_dual / …gulf / Smoketest -> na)
       3. geo           (gulf | na)
       4. phone country code (+971/+974/… -> gulf, +1 -> na, +91 -> other)

   RUN IT:  select backfillMarketDryRun (preview, writes nothing) and press
   Run, read the Execution log, then run backfillMarket to apply.
   Safe to re-run — it only writes cells whose value actually changes.
   ===================================================================== */
function backfillMarketDryRun() { return backfillMarket_(true); }
function backfillMarket() { return backfillMarket_(false); }

function resolveMarket_(page, campaign, geo, phone) {
  var p = String(page || "");
  var c = String(campaign || "").toLowerCase();
  var g = String(geo || "").toLowerCase();
  var ph = String(phone || "").replace(/[^\d+]/g, "");

  if (p.indexOf("/gulf") === 0) return "gulf_dual";
  if (c) {
    if (c.indexOf("gulf_dual") !== -1 || c.indexOf("gulf dual") !== -1) return "gulf_dual";
    if (c.indexOf("gulf") !== -1) return "gulf";
    if (c.indexOf("smoketest") !== -1) return "na";
  }
  if (g === "gulf") return "gulf";
  if (g === "na") return "na";
  // Next: the phone number's country code.
  var digits = ph.replace(/^\+/, "");
  if (/^(971|974|973|966|965|968)/.test(digits)) return "gulf";
  if (/^1\d{10}$/.test(digits)) return "na";
  if (/^91/.test(digits)) return "other";
  // Fully untagged legacy row (logged before geo/campaign tracking existed).
  // Matches the report's CONFIG.UNTAGGED_MARKET so history stays consistent.
  if (!p && !c && !g) return LEGACY_MARKET;
  return "other";
}
/** Where pre-tracking rows belong (the early funnel was entirely North America). */
var LEGACY_MARKET = "na";

function backfillMarket_(dryRun) {
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) { Logger.log("Nothing to backfill."); return; }

  var values = sheet.getRange(1, 1, last, HEADER.length).getValues();
  var head = values[0], idx = {};
  head.forEach(function (h, i) { idx[String(h)] = i; });
  var cMarket = idx["market"], cPage = idx["page"], cGeo = idx["geo"];
  var cCamp = idx["utm_campaign"], cPhone = idx["phone"], cEmail = idx["email"];
  if (cMarket == null) { Logger.log("No 'market' column — paste the latest HEADER first."); return; }

  var changes = [], tally = {}, moved = 0;
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (!String(row[cEmail] || "").trim()) continue;      // skip blank rows
    var before = String(row[cMarket] || "");
    var after = resolveMarket_(row[cPage], row[cCamp], row[cGeo], row[cPhone]);
    tally[after] = (tally[after] || 0) + 1;
    if (before !== after) {
      moved++;
      changes.push({ rowNum: r + 1, email: row[cEmail], geo: row[cGeo], campaign: row[cCamp], from: before || "(blank)", to: after });
      if (!dryRun) sheet.getRange(r + 1, cMarket + 1).setValue(after);
    }
  }

  Logger.log((dryRun ? "DRY RUN — nothing written.\n" : "APPLIED.\n") +
    "Rows scanned: " + (values.length - 1) + " | rows changed: " + moved);
  Logger.log("Resulting market split: " + JSON.stringify(tally));
  changes.slice(0, 60).forEach(function (c) {
    Logger.log("  row " + c.rowNum + "  " + c.email + "  geo=" + (c.geo || "-") +
      "  campaign=" + (c.campaign || "-") + "   " + c.from + " -> " + c.to);
  });
  if (changes.length > 60) Logger.log("  …and " + (changes.length - 60) + " more.");
  return { scanned: values.length - 1, changed: moved, split: tally };
}

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
    // Keep the header in sync so older events sheets gain the page/geo/market
    // columns (added for the per-market report). Existing rows stay blank there.
    if (sheet.getLastRow() === 0) sheet.appendRow(EVENTS_HEADER);
    else if (sheet.getLastColumn() < EVENTS_HEADER.length) {
      sheet.getRange(1, 1, 1, EVENTS_HEADER.length).setValues([EVENTS_HEADER]);
    }
    var when = data.ts ? new Date(Number(data.ts)) : new Date();
    var date = Utilities.formatDate(when, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
    sheet.appendRow([
      when, date, String(data.event || ""), String(data.arm || ""),
      String(data.pitch || ""), String(data.sid || ""),
      data.durationMs != null ? Number(data.durationMs) : "",
      data.engaged != null ? Number(data.engaged) : "",
      String(data.page || ""), String(data.geo || ""), String(data.market || ""),
      String(data.priceArm || ""), String(data.campaign || "")
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
