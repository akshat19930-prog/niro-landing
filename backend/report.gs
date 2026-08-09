/**
 * Niro smoke-test — twice-daily email report (Google Apps Script).
 *
 * Data sources:
 *   1. The waitlist Google Sheet (this script must live in the SAME spreadsheet
 *      as waitlist.gs — Extensions -> Apps Script, add this as a second file).
 *   2. Meta Marketing API (spend / impressions / CTR / CPC / shares), pulled live.
 *
 * It computes the scorecard + gates from the smoke-test doc, a pitch-cell
 * leaderboard, the pricing-arm read, age/gender segments, and referral K, then
 * emails an HTML report to RECIPIENTS. Deltas vs the previous run are stored in
 * Script Properties.
 *
 * SETUP:
 *   1. Fill CONFIG below (recipients, Meta token + ad-account id, budget, dates).
 *   2. Ad-naming convention (REQUIRED for per-pitch CPL): each ad's name must
 *      contain its pitch cell token P1..P4, AND its destination URL must carry
 *      the matching ?v=1..4 (so Sheet signups and Meta spend join on the cell).
 *   3. Run setupTriggers() once (authorize when prompted) — installs 09:00 and
 *      18:00 daily triggers. Run sendReport() once manually to test.
 *
 * The report degrades gracefully: with no Meta token it still sends the full
 * Sheet-side report (signups, pitch mix, arm, plan, referral) and marks the
 * Meta-derived rows as "n/a — Meta not connected".
 */

// ===================== CONFIG =====================
var CONFIG = {
  RECIPIENTS: "akshat.19930@gmail.com, paarthdhar@gmail.com",
  TIMEZONE: "Asia/Kolkata",

  // Meta Marketing API
  META_ACCESS_TOKEN: "",            // long-lived token with ads_read
  META_AD_ACCOUNT_ID: "",           // e.g. "act_1234567890"
  META_API_VERSION: "v19.0",

  // Test parameters (from the smoke-test doc)
  BUDGET_USD: 2500,
  TEST_START: "2026-08-12",         // yyyy-mm-dd, account timezone
  TEST_DAYS: 12,

  // Pitch cell labels (v1..v4)
  PITCH_LABELS: {
    "1": "P1 · Peace of mind",
    "2": "P2 · Off your plate",
    "3": "P3 · Your India, sorted",
    "4": "P4 · Home manager (control)"
  },

  // Gates from doc §6 / §8  [green_max_or_min]
  GATES: {
    cpc_us:   { good: 1.5,  warn: 2.5,  dir: "lower" },
    ctr:      { good: 1.2,  warn: 0.7,  dir: "higher" }, // %
    lp2wl:    { good: 30,   warn: 18,   dir: "higher" }, // %
    cpl:      { good: 12,   warn: 22,   dir: "lower" },  // $
    spread:   { good: 2.0,  warn: 1.3,  dir: "higher" }, // x
    shares1k: { good: 5,    warn: 2,    dir: "higher" },
    kfactor:  { good: 0.3,  warn: 0.1,  dir: "higher" }
  }
};
// ==================================================

function setupTriggers() {
  removeTriggers();
  ScriptApp.newTrigger("sendReport").timeBased().atHour(9).everyDays(1)
    .inTimezone(CONFIG.TIMEZONE).create();
  ScriptApp.newTrigger("sendReport").timeBased().atHour(18).everyDays(1)
    .inTimezone(CONFIG.TIMEZONE).create();
}
function removeTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "sendReport") ScriptApp.deleteTrigger(t);
  });
}

function sendReport() {
  var signups = readSignups_();
  var meta = fetchMeta_();                 // null if not connected
  var m = buildMetrics_(signups, meta);
  var html = renderHtml_(m);
  var subject = renderSubject_(m);
  MailApp.sendEmail({
    to: CONFIG.RECIPIENTS,
    subject: subject,
    htmlBody: html,
    noReply: true
  });
  saveSnapshot_(m); // for next run's deltas
}

// ---------- data ----------
function readSignups_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("waitlist");
  if (!sheet || sheet.getLastRow() < 2) return [];
  var values = sheet.getDataRange().getValues();
  var head = values[0];
  var idx = {};
  head.forEach(function (h, i) { idx[h] = i; });
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    rows.push({
      ts: row[idx.timestamp],
      email: String(row[idx.email] || ""),
      arm: String(row[idx.arm] || ""),
      pitch: String(row[idx.pitch] || "4"),
      ref: String(row[idx.ref] || ""),
      planId: String(row[idx.planId] || "")
    });
  }
  return rows;
}

function fetchMeta_() {
  if (!CONFIG.META_ACCESS_TOKEN || !CONFIG.META_AD_ACCOUNT_ID) return null;
  try {
    var base = "https://graph.facebook.com/" + CONFIG.META_API_VERSION + "/" +
      CONFIG.META_AD_ACCOUNT_ID + "/insights";
    var fields = "spend,impressions,clicks,ctr,cpc,actions";
    var since = CONFIG.TEST_START;
    var until = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd");
    var range = encodeURIComponent(JSON.stringify({ since: since, until: until }));

    // Per-ad (for pitch-cell mapping) and account-total.
    var byAd = metaGet_(base + "?level=ad&time_range=" + range +
      "&fields=ad_name," + fields + "&limit=500");
    var byAgeGender = metaGet_(base + "?level=account&time_range=" + range +
      "&breakdowns=age,gender&fields=" + fields + "&limit=500");
    return { byAd: byAd, byAgeGender: byAgeGender };
  } catch (err) {
    return { error: String(err) };
  }
}
function metaGet_(url) {
  var full = url + "&access_token=" + encodeURIComponent(CONFIG.META_ACCESS_TOKEN);
  var res = UrlFetchApp.fetch(full, { muteHttpExceptions: true });
  var body = JSON.parse(res.getContentText() || "{}");
  return body.data || [];
}
function cellFromName_(name) {
  var mm = String(name || "").match(/\bP([1-4])\b/i) || String(name).match(/\bv([1-4])\b/i);
  return mm ? mm[1] : "?";
}
function actionValue_(actions, type) {
  if (!actions) return 0;
  for (var i = 0; i < actions.length; i++) {
    if (actions[i].action_type === type) return Number(actions[i].value) || 0;
  }
  return 0;
}

// ---------- metrics ----------
function buildMetrics_(signups, meta) {
  var now = new Date();
  var prev = loadSnapshot_();
  var totalSignups = signups.length;

  // Per-pitch signups
  var pitchSignups = { "1": 0, "2": 0, "3": 0, "4": 0 };
  var armSignups = { A: 0, B: 0 };
  var planMix = { lite: 0, prime: 0, none: 0 };
  var referred = 0;
  signups.forEach(function (s) {
    if (pitchSignups[s.pitch] === undefined) pitchSignups[s.pitch] = 0;
    pitchSignups[s.pitch]++;
    if (s.arm === "A" || s.arm === "B") armSignups[s.arm]++;
    if (s.planId === "lite") planMix.lite++;
    else if (s.planId === "prime") planMix.prime++;
    else planMix.none++;
    if (s.ref) referred++;
  });

  // Meta aggregation
  var meta_ok = meta && !meta.error && meta.byAd;
  var pitchSpend = { "1": 0, "2": 0, "3": 0, "4": 0 };
  var totalSpend = 0, totalImpr = 0, totalClicks = 0, shares = 0, comments = 0, saves = 0, lpViews = 0;
  if (meta_ok) {
    meta.byAd.forEach(function (a) {
      var c = cellFromName_(a.ad_name);
      var sp = Number(a.spend) || 0;
      if (pitchSpend[c] === undefined) pitchSpend[c] = 0;
      pitchSpend[c] += sp;
      totalSpend += sp;
      totalImpr += Number(a.impressions) || 0;
      totalClicks += Number(a.clicks) || 0;
      shares += actionValue_(a.actions, "post");
      comments += actionValue_(a.actions, "comment");
      saves += actionValue_(a.actions, "onsite_conversion.post_save");
      lpViews += actionValue_(a.actions, "landing_page_view");
    });
  }

  var blendedCpl = totalSignups ? (totalSpend / totalSignups) : 0;
  var ctr = totalImpr ? (totalClicks / totalImpr * 100) : 0;
  var cpc = totalClicks ? (totalSpend / totalClicks) : 0;
  var lp2wl = lpViews ? (totalSignups / lpViews * 100) : 0;
  var shares1k = totalImpr ? (shares / totalImpr * 1000) : 0;

  // Per-pitch CPL + spread
  var pitchRows = [];
  var cpls = [];
  ["1", "2", "3", "4"].forEach(function (c) {
    var su = pitchSignups[c] || 0;
    var sp = pitchSpend[c] || 0;
    var cpl = su ? sp / su : 0;
    if (su && meta_ok) cpls.push(cpl);
    pitchRows.push({ cell: c, label: CONFIG.PITCH_LABELS[c], signups: su, spend: sp, cpl: cpl });
  });
  pitchRows.sort(function (a, b) { return b.signups - a.signups; });
  var spread = (meta_ok && cpls.length >= 2)
    ? (Math.max.apply(null, cpls) / Math.min.apply(null, cpls)) : 0;

  var kfactor = totalSignups ? (referred / totalSignups) : 0; // proxy (referred share)

  // Pacing
  var start = new Date(CONFIG.TEST_START + "T00:00:00");
  var dayNum = Math.max(1, Math.ceil((now - start) / 86400000));
  var daysLeft = Math.max(0, CONFIG.TEST_DAYS - dayNum);

  return {
    now: now, meta_ok: !!meta_ok, meta_err: meta && meta.error,
    totalSignups: totalSignups,
    newSignups: prev ? Math.max(0, totalSignups - prev.totalSignups) : totalSignups,
    totalSpend: totalSpend, blendedCpl: blendedCpl, ctr: ctr, cpc: cpc,
    lp2wl: lp2wl, shares1k: shares1k, spread: spread, kfactor: kfactor,
    referred: referred, pitchRows: pitchRows, armSignups: armSignups,
    planMix: planMix, dayNum: dayNum, daysLeft: daysLeft,
    budget: CONFIG.BUDGET_USD, byAgeGender: (meta_ok ? meta.byAgeGender : [])
  };
}

// ---------- rendering ----------
function statusOf_(value, gate) {
  if (!gate) return "";
  if (gate.dir === "lower") {
    if (value <= gate.good) return "green";
    if (value <= gate.warn) return "yellow";
    return "red";
  } else {
    if (value >= gate.good) return "green";
    if (value >= gate.warn) return "yellow";
    return "red";
  }
}
function dot_(status) {
  var c = { green: "#1E8E5A", yellow: "#C8871B", red: "#C0392B", "": "#9AA79E" }[status] || "#9AA79E";
  return '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + c + '"></span>';
}
function money_(n) { return "$" + (Math.round(n * 100) / 100).toLocaleString(); }
function pct_(n) { return (Math.round(n * 10) / 10) + "%"; }

function renderSubject_(m) {
  var lead = m.pitchRows.slice().sort(function (a, b) { return b.signups - a.signups; })[0];
  var winner = lead && lead.signups ? lead.label.split(" ")[0] : "—";
  var cplTxt = m.meta_ok ? (money_(m.blendedCpl) + " CPL") : "CPL n/a";
  var ampm = Number(Utilities.formatDate(m.now, CONFIG.TIMEZONE, "H")) < 12 ? "AM" : "PM";
  var date = Utilities.formatDate(m.now, CONFIG.TIMEZONE, "MMM d");
  return "Niro smoke test · " + date + " " + ampm + " · " +
    m.totalSignups + " signups (+" + m.newSignups + ") · " + cplTxt +
    " · " + winner + " leading";
}

function row_(cells) {
  return "<tr>" + cells.map(function (c) {
    return '<td style="padding:6px 10px;border-bottom:1px solid #eee;font:13px/1.4 -apple-system,Segoe UI,Roboto,sans-serif">' + c + "</td>";
  }).join("") + "</tr>";
}

function renderHtml_(m) {
  var h = [];
  h.push('<div style="max-width:640px;margin:0 auto;font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#1a2b22">');
  h.push('<h2 style="font-size:18px;margin:0 0 4px">Niro smoke test — ' +
    Utilities.formatDate(m.now, CONFIG.TIMEZONE, "EEE MMM d, HH:mm z") + '</h2>');
  h.push('<p style="color:#5b6b60;margin:0 0 18px">Day ' + m.dayNum + ' of ' + CONFIG.TEST_DAYS +
    ' · ' + m.daysLeft + ' left · spend ' + money_(m.totalSpend) + ' / ' + money_(m.budget) + '</p>');

  if (!m.meta_ok) {
    h.push('<p style="background:#FBEEC8;border:1px solid #E4C97A;border-radius:6px;padding:8px 12px;color:#7a5b12">' +
      'Meta not connected' + (m.meta_err ? ' (' + m.meta_err + ')' : '') +
      ' — CPC / CTR / CPL / spend / shares below show n/a. Fill META_ACCESS_TOKEN + META_AD_ACCOUNT_ID in CONFIG.</p>');
  }

  // Scorecard
  var na = '<span style="color:#9AA79E">n/a</span>';
  h.push('<h3 style="font-size:14px;margin:16px 0 6px">Scorecard</h3><table style="border-collapse:collapse;width:100%">');
  h.push(row_(["<b>Metric</b>", "<b>Value</b>", "<b>Gate</b>", "<b>Status</b>"]));
  h.push(row_(["CPC (US)", m.meta_ok ? money_(m.cpc) : na, "≤$1.50", m.meta_ok ? dot_(statusOf_(m.cpc, CONFIG.GATES.cpc_us)) : ""]));
  h.push(row_(["CTR", m.meta_ok ? pct_(m.ctr) : na, "≥1.2%", m.meta_ok ? dot_(statusOf_(m.ctr, CONFIG.GATES.ctr)) : ""]));
  h.push(row_(["LP → waitlist", m.meta_ok ? pct_(m.lp2wl) : na, "≥30%", m.meta_ok ? dot_(statusOf_(m.lp2wl, CONFIG.GATES.lp2wl)) : ""]));
  h.push(row_(["CPL (blended)", m.meta_ok ? money_(m.blendedCpl) : na, "≤$12", m.meta_ok ? dot_(statusOf_(m.blendedCpl, CONFIG.GATES.cpl)) : ""]));
  h.push(row_(["Pitch spread", m.meta_ok && m.spread ? (Math.round(m.spread * 10) / 10) + "×" : na, "≥2×", m.meta_ok && m.spread ? dot_(statusOf_(m.spread, CONFIG.GATES.spread)) : ""]));
  h.push('</table>');

  // Pitch leaderboard
  h.push('<h3 style="font-size:14px;margin:20px 0 6px">Pitch leaderboard (signups)</h3><table style="border-collapse:collapse;width:100%">');
  h.push(row_(["<b>Cell</b>", "<b>Signups</b>", "<b>Spend</b>", "<b>CPL</b>"]));
  m.pitchRows.forEach(function (p) {
    h.push(row_([p.label, String(p.signups), m.meta_ok ? money_(p.spend) : na, (m.meta_ok && p.cpl) ? money_(p.cpl) : na]));
  });
  h.push('</table><p style="color:#5b6b60;font-size:12px;margin:6px 0 0">Rank on CPL × downstream quality, not signups alone — a cheap cell that skews low-intent is a trap.</p>');

  // Pricing arm
  h.push('<h3 style="font-size:14px;margin:20px 0 6px">Pricing arm</h3><table style="border-collapse:collapse;width:100%">');
  h.push(row_(["Arm A (Lite + Prime)", String(m.armSignups.A) + " signups"]));
  h.push(row_(["Arm B (single $99)", String(m.armSignups.B) + " signups"]));
  h.push(row_(["Plan chosen", "Lite " + m.planMix.lite + " · Prime " + m.planMix.prime + " · decide-later " + m.planMix.none]));
  h.push('</table>');

  // Virality / K
  h.push('<h3 style="font-size:14px;margin:20px 0 6px">Virality / K-factor</h3><table style="border-collapse:collapse;width:100%">');
  h.push(row_(["Shares / 1K impr", m.meta_ok ? (Math.round(m.shares1k * 10) / 10) : na, "≥5", m.meta_ok ? dot_(statusOf_(m.shares1k, CONFIG.GATES.shares1k)) : ""]));
  h.push(row_(["Referred signups", String(m.referred), "", ""]));
  h.push(row_(["K (referred share, proxy)", (Math.round(m.kfactor * 100) / 100), "≥0.3", dot_(statusOf_(m.kfactor, CONFIG.GATES.kfactor))]));
  h.push('</table><p style="color:#5b6b60;font-size:12px;margin:6px 0 0">K here is a proxy (referred ÷ total). True K needs referral-link click tracking (invites-sent term) — not yet instrumented.</p>');

  // Segments
  if (m.meta_ok && m.byAgeGender && m.byAgeGender.length) {
    h.push('<h3 style="font-size:14px;margin:20px 0 6px">Segment spend (age × gender)</h3><table style="border-collapse:collapse;width:100%">');
    h.push(row_(["<b>Age</b>", "<b>Gender</b>", "<b>Spend</b>", "<b>CTR</b>"]));
    m.byAgeGender.slice(0, 12).forEach(function (s) {
      h.push(row_([s.age, s.gender, money_(Number(s.spend) || 0), pct_(Number(s.ctr) || 0)]));
    });
    h.push('</table>');
  }

  h.push('<p style="margin:22px 0 0;padding-top:12px;border-top:1px solid #eee;color:#5b6b60;font-size:12px">' +
    'Honesty line: a green CPL means acquisition cost is not the killer — not that CAC is validated. ' +
    'Waitlist intent is soft by design (no payment gate); waitlist→paid must still land ≥8% at launch.</p>');
  h.push('</div>');
  return h.join("");
}

// ---------- snapshot (deltas) ----------
function saveSnapshot_(m) {
  PropertiesService.getScriptProperties().setProperty("last_snapshot",
    JSON.stringify({ totalSignups: m.totalSignups, at: m.now.getTime() }));
}
function loadSnapshot_() {
  try {
    var s = PropertiesService.getScriptProperties().getProperty("last_snapshot");
    return s ? JSON.parse(s) : null;
  } catch (e) { return null; }
}
