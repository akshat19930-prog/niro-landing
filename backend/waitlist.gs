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
  "priceArm",
  // Sales/CRM columns (W, X, Y) - filled by hand or by applyLeadNotes() from
  // the WhatsApp outreach. Never written by doPost, so signups can't clobber them.
  "leadStatus", "detailsShared", "leadNotes"
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
  // Everything else - legacy pre-tracking rows and tagged rest-of-world alike -
  // falls back to the default market. There is no "other" cluster: every lead
  // lands in na | gulf | gulf_dual, matching the report's three sections.
  return LEGACY_MARKET;
}
/** Fallback cluster for anything we can't place (the early funnel, and all
 *  untagged traffic, was overwhelmingly North America). Mirror of the report's
 *  CONFIG.UNTAGGED_MARKET - keep the two in sync. */
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

/* =====================================================================
   LEAD NOTES from the founder's WhatsApp outreach (24 Aug 2026, 11 leads).
   Fills columns W (leadStatus), X (detailsShared), Y (leadNotes), matched on
   email. Status is one of: "Engaged/Details Shared" | "Interested" |
   "Dropped off".

   RUN IT: select applyLeadNotesDryRun and press Run, read the Execution log
   (it reports matches AND anything it could not find), then run
   applyLeadNotes to write. Only writes cells that actually change, so it is
   safe to re-run after editing an entry below.
   ===================================================================== */
var LEAD_NOTES = [
  { email: "yashishan@gmail.com", status: "Engaged/Details Shared",
    details: "Self 35, Toronto, Canada. Parents in Bangalore and Kolkata (ages not shared).",
    notes: "Wants an emergency safety net for parents, plus health tasks (tests, consults, fitness) and home repairs/upkeep. Key concerns: how Niro chooses and vets the partners who interact with parents (trust), and whether tasks cost extra on top of $99 or whether $99 is platform access only. NEXT: answer the vetting and what's-included-in-$99 questions." },

  { email: "sparshgarg56@gmail.com", status: "Engaged/Details Shared",
    details: "Self 33, California, US. Parents in Ghaziabad, UP (ages not shared).",
    notes: "Needs help with parents' doctor visits and emergencies. Key question: how it actually works - does the point of contact come themselves or send someone? Akshat explained the emergency protocol and on-demand concierge. NEXT: confirm beta interest." },

  { email: "wadhwani.rahul@gmail.com", status: "Engaged/Details Shared",
    details: "Self 37, Dubai, UAE. Parents and in-laws both in Mumbai (ages not shared).",
    notes: "Signed up from an Instagram ad, exploring. No immediate task. Main needs: house repairs/technical support, and travel support for health appointments. Key question: what are the interview/qualifying criteria for the people providing the service. Offered to send more questions in real time." },

  { email: "sharad.yadav@outlook.com", status: "Interested",
    details: "Self 38, Campbell River, Vancouver Island, Canada. Father 72, Gwalior MP. Mother 70.",
    notes: "SOFT-COMMITTED - picked Niro Prime ($99). Immediate task: father's periodic medical appointments across Gwalior and New Delhi, needs someone to run them and accompany him; Delhi confirmed covered, family has own car and driver. Asked about charges and whether the same person can help his mother if a medical situation arises. NEXT: send onboarding confirmation - he said he'll 'have to fix things fast' and is waiting. NOTE: tagged 'Niro Gulf' in contacts but is actually in Canada." },

  { email: "rturumella@gmail.com", status: "Dropped off",
    details: "Self 35, SF Bay Area, US. Parents/family in Hyderabad; aging grandparents. Has a 2-year-old; is a solo founder.",
    notes: "DECLINED the monthly subscription - 'I don't think I'd have enough use to pay for this monthly compared to per task.' Own need: Aadhaar-linked Airtel number deactivated, so he can't receive HDFC OTPs from the US; lost most of a 1L Yes Bank balance to minimum-balance fees. Wants a PACK OF 8-10 TASKS usable over 6 months, and said it would be good to gift. NEXT: come back with task-pack pricing. Warm contact - knows Rajesh from GSF." },

  { email: "kusum.bhatia@gmail.com", status: "Engaged/Details Shared",
    details: "Lives in Qatar. Mother in Bombay, father-in-law in Lavasa. Ages not shared. Travelling in the USA until end September.",
    notes: "'I love the concept of Niro.' Agreed to answer questions async on WhatsApp; wants a call once back, end of September, and asked to be re-contacted then 'lest I forget'. NEXT: send the parked questions (parents' ages, whether they live alone) and diarise a follow-up for end September." },

  { email: "sunandita@outlook.com", status: "Interested",
    details: "Self 43, Nova Scotia, Canada. Parents in Asansol, West Bengal (ages not shared).",
    notes: "COMMITTED TO BETA - 'Sure you can count us in.' Trigger: supporting parents with their daily needs. Key concern: 'Is this a real service or is this just an experiment to do the feasibility?' Asked what to expect during the beta. NEXT: book the 15-min clarity call, then onboard." },

  { email: "sarfarazdj@gmail.com", status: "Dropped off",
    details: "Self 34, Doha, Qatar. Parents in Chennai (ages not shared).",
    notes: "Task-only interest: wants his EPF claim expedited (his own need, not a parent need). Said plainly that his parents 'don't have any specific need to be taken care of now' - no subscription intent. NEXT: decide whether to serve the one-off EPF task as a paid pack or a lead-in." },

  { email: "mansi23gulati@gmail.com", status: "Engaged/Details Shared",
    details: "Self age not shared, US. Parents in early 60s, Delhi. Mother volunteers at the family NGO and doesn't drive.",
    notes: "Asked for beta pricing; Lite $55 / Prime $99 shared, awaiting her choice. Five concerns: (1) is it AI-driven, and what data is needed to file payments/ITR, (2) do parents pay for cab rides and maids or is it all covered, (3) how are the people who show up vetted - do you meet them, what are the hiring criteria, (4) continuity - will the same person keep showing up for her mother, (5) BIGGEST: privacy protection. NEXT: answer privacy, vetting and continuity, then close on a plan." },

  { email: "rituarangaden@outlook.com", status: "Engaged/Details Shared",
    details: "Based in the Gulf, does not currently live in India. Parents both in their 70s, will be based in New Delhi over the next few months.",
    notes: "Main need: a first point of contact in case of emergencies, rather than day-to-day help. Asked for the services to be elaborated before she can form a clear picture. Task-scope card shared and a 15-min call proposed. NEXT: get the call scheduled, or elaborate the services in writing." },

  { email: "digitalsijit@gmail.com", status: "Interested",
    details: "Based in the UAE. Parents 68 and 63, Kozhikode, Kerala - they live by themselves.",
    notes: "'Yes I am interested' - open to beta and to the dual offering. Trigger: saw that Niro could help with PF. No questions at the moment. IMPORTANT SIGNAL: after reading /gulf he said 'I am more concerned about back home. For everything else in UAE it is manageable' - the Gulf-side value proposition did not land. NEXT: confirm beta enrolment." }
];

function applyLeadNotesDryRun() { return applyLeadNotes_(true); }
function applyLeadNotes() { return applyLeadNotes_(false); }

function applyLeadNotes_(dryRun) {
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) { Logger.log("Sheet is empty."); return; }

  var values = sheet.getRange(1, 1, last, HEADER.length).getValues();
  var head = values[0], idx = {};
  head.forEach(function (h, i) { idx[String(h)] = i; });
  var cEmail = idx["email"], cS = idx["leadStatus"], cD = idx["detailsShared"], cN = idx["leadNotes"];
  if (cS == null || cD == null || cN == null) {
    Logger.log("Columns W/X/Y missing - paste the latest HEADER and re-run."); return;
  }

  var byEmail = {};
  LEAD_NOTES.forEach(function (n) { byEmail[n.email.toLowerCase()] = n; });

  var wrote = 0, matched = {}, rowsTouched = [];
  for (var r = 1; r < values.length; r++) {
    var em = String(values[r][cEmail] || "").trim().toLowerCase();
    var n = byEmail[em];
    if (!n) continue;
    matched[em] = true;
    var cur = [values[r][cS], values[r][cD], values[r][cN]].map(function (v) { return String(v || ""); });
    var next = [n.status, n.details, n.notes];
    if (cur[0] === next[0] && cur[1] === next[1] && cur[2] === next[2]) continue;
    wrote++;
    rowsTouched.push("  row " + (r + 1) + "  " + em + "  -> " + n.status);
    if (!dryRun) sheet.getRange(r + 1, cS + 1, 1, 3).setValues([next]);
  }

  Logger.log((dryRun ? "DRY RUN - nothing written.\n" : "APPLIED.\n") +
    "Leads in list: " + LEAD_NOTES.length + " | rows updated: " + wrote);
  rowsTouched.forEach(function (l) { Logger.log(l); });
  LEAD_NOTES.forEach(function (n) {
    if (!matched[n.email.toLowerCase()]) Logger.log("  NOT FOUND in sheet: " + n.email);
  });
  return { listed: LEAD_NOTES.length, updated: wrote };
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
