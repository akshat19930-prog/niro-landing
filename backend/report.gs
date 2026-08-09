/**
 * Niro smoke-test — twice-daily email report (Google Apps Script).
 *
 * Lives in the SAME spreadsheet as waitlist.gs (add as a second file). Reads:
 *   - `waitlist` tab  (signups: arm, pitch, plan, referral)
 *   - `events` tab    (funnel + session beacons: exposure, join_initiated,
 *                      email_entered, reserve_clicked, session_end)
 *   - Meta Marketing API (daily spend / impressions / clicks; per-ad for pitch)
 *
 * Emails two tables at 09:00 and 18:00:
 *   1. Metric × date matrix — last 5 days as columns + an MTD column
 *      (sessions, bounce %, avg session duration, the funnel, spend, CPL).
 *   2. Pricing A/B funnel — arms A and B as columns (traffic, join initiated,
 *      email entered, reserve clicked, LP→reserve %).
 *
 * SETUP: fill CONFIG, then run setupTriggers() once (authorize). Meta rows show
 * "n/a" until META_ACCESS_TOKEN + META_AD_ACCOUNT_ID are filled. Ad-naming for
 * per-pitch CPL: ad name contains P1..P4, URL carries the matching ?v=1..4.
 *
 * Bounce / avg duration are approximations from our own beacons (a session is
 * "engaged" if it lasts >=10s, scrolls/clicks, or starts the waitlist).
 */

// ===================== CONFIG =====================
var CONFIG = {
  RECIPIENTS: "akshat.19930@gmail.com, paarthdhar@gmail.com",
  TIMEZONE: "Asia/Kolkata",

  META_ACCESS_TOKEN: "",            // long-lived token with ads_read
  META_AD_ACCOUNT_ID: "",           // e.g. "act_1234567890"
  META_API_VERSION: "v19.0",

  BUDGET_USD: 2500,
  TEST_START: "2026-08-12",         // yyyy-mm-dd
  TEST_DAYS: 12,
  DATE_COLS: 5,                     // trailing day columns before MTD

  PITCH_LABELS: {
    "1": "P1 · Peace of mind",
    "2": "P2 · Off your plate",
    "3": "P3 · Your India, sorted",
    "4": "P4 · Home manager (control)"
  },

  GATES: {
    cpl:    { good: 12, warn: 22, dir: "lower" },   // $
    bounce: { good: 45, warn: 65, dir: "lower" },   // %
    lp2res: { good: 8,  warn: 3,  dir: "higher" }   // % LP -> reserve
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
  var data = readAll_();
  var meta = fetchMetaDaily_();          // {byDate:{}, byCell:{}} or null
  var model = buildModel_(data, meta);
  MailApp.sendEmail({
    to: CONFIG.RECIPIENTS,
    subject: renderSubject_(model),
    htmlBody: renderHtml_(model),
    noReply: true
  });
  saveSnapshot_(model);
}

// ------------------------------ data ------------------------------
function readAll_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return { signups: readTab_(ss, "waitlist"), events: readTab_(ss, "events") };
}
function readTab_(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var values = sheet.getDataRange().getValues();
  var head = values[0], idx = {};
  head.forEach(function (h, i) { idx[h] = i; });
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r], o = {};
    head.forEach(function (h) { o[h] = row[idx[h]]; });
    rows.push(o);
  }
  return rows;
}
function dateStr_(v) {
  var d = (v instanceof Date) ? v : new Date(v);
  return Utilities.formatDate(d, CONFIG.TIMEZONE, "yyyy-MM-dd");
}

function fetchMetaDaily_() {
  if (!CONFIG.META_ACCESS_TOKEN || !CONFIG.META_AD_ACCOUNT_ID) return null;
  try {
    var base = "https://graph.facebook.com/" + CONFIG.META_API_VERSION + "/" +
      CONFIG.META_AD_ACCOUNT_ID + "/insights";
    var until = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd");
    var range = encodeURIComponent(JSON.stringify({ since: CONFIG.TEST_START, until: until }));
    var f = "spend,impressions,clicks";

    var daily = metaGet_(base + "?level=account&time_increment=1&time_range=" + range + "&fields=" + f + "&limit=500");
    var byDate = {};
    daily.forEach(function (d) {
      byDate[d.date_start] = { spend: num_(d.spend), impr: num_(d.impressions), clicks: num_(d.clicks) };
    });

    var ads = metaGet_(base + "?level=ad&time_range=" + range + "&fields=ad_name," + f + "&limit=500");
    var byCell = {};
    ads.forEach(function (a) {
      var c = cellFromName_(a.ad_name);
      if (!byCell[c]) byCell[c] = { spend: 0 };
      byCell[c].spend += num_(a.spend);
    });
    return { byDate: byDate, byCell: byCell };
  } catch (err) {
    return { error: String(err) };
  }
}
function metaGet_(url) {
  var res = UrlFetchApp.fetch(url + "&access_token=" + encodeURIComponent(CONFIG.META_ACCESS_TOKEN),
    { muteHttpExceptions: true });
  var body = JSON.parse(res.getContentText() || "{}");
  return body.data || [];
}
function cellFromName_(name) {
  var mm = String(name || "").match(/\bP([1-4])\b/i) || String(name).match(/\bv([1-4])\b/i);
  return mm ? mm[1] : "?";
}
function num_(x) { return Number(x) || 0; }

// ------------------------------ model ------------------------------
function buildModel_(data, meta) {
  var now = new Date();
  var tz = CONFIG.TIMEZONE;

  // Column dates: last DATE_COLS days (oldest..today).
  var cols = [];
  for (var i = CONFIG.DATE_COLS - 1; i >= 0; i--) {
    cols.push(Utilities.formatDate(new Date(now.getTime() - i * 86400000), tz, "yyyy-MM-dd"));
  }

  // Bucket events + signups by date.
  var evByDate = {}, suByDate = {};
  data.events.forEach(function (e) {
    var d = e.date || dateStr_(e.timestamp);
    (evByDate[d] = evByDate[d] || []).push(e);
  });
  data.signups.forEach(function (s) {
    var d = dateStr_(s.timestamp);
    suByDate[d] = (suByDate[d] || 0) + 1;
  });

  function windowFor(dates) {
    var evs = [], su = 0;
    dates.forEach(function (d) {
      if (evByDate[d]) evs = evs.concat(evByDate[d]);
      su += (suByDate[d] || 0);
    });
    return computeWindow_(evs, su, meta, dates);
  }

  // MTD dates = TEST_START .. today
  var mtdDates = [];
  var cur = CONFIG.TEST_START, todayStr = Utilities.formatDate(now, tz, "yyyy-MM-dd");
  var guard = 0;
  while (cur <= todayStr && guard < 400) { mtdDates.push(cur); cur = nextDay_(cur); guard++; }

  var colModels = cols.map(function (d) { return { label: Utilities.formatDate(new Date(d + "T00:00:00"), tz, "MMM d"), stat: windowFor([d]) }; });
  var mtd = windowFor(mtdDates);

  // A/B split over MTD
  var ab = { A: computeArm_(data.events, "A", meta), B: computeArm_(data.events, "B", meta) };

  // Pitch leaderboard (signups by pitch, spend from Meta byCell)
  var pitch = ["1", "2", "3", "4"].map(function (c) {
    var su = data.signups.filter(function (s) { return String(s.pitch || "4") === c; }).length;
    var sp = (meta && meta.byCell && meta.byCell[c]) ? meta.byCell[c].spend : 0;
    return { cell: c, label: CONFIG.PITCH_LABELS[c], signups: su, spend: sp, cpl: su ? sp / su : 0 };
  }).sort(function (a, b) { return b.signups - a.signups; });

  var start = new Date(CONFIG.TEST_START + "T00:00:00");
  var dayNum = Math.max(1, Math.ceil((now - start) / 86400000));
  var prev = loadSnapshot_();

  return {
    now: now, meta_ok: !!(meta && !meta.error && meta.byDate), meta_err: meta && meta.error,
    cols: colModels, mtd: mtd, ab: ab, pitch: pitch,
    totalSignups: data.signups.length,
    newSignups: prev ? Math.max(0, data.signups.length - prev.totalSignups) : data.signups.length,
    dayNum: dayNum, daysLeft: Math.max(0, CONFIG.TEST_DAYS - dayNum),
    spendMTD: mtd.spend, budget: CONFIG.BUDGET_USD
  };
}
function nextDay_(yyyymmdd) {
  var d = new Date(yyyymmdd + "T00:00:00");
  d = new Date(d.getTime() + 86400000);
  return Utilities.formatDate(d, CONFIG.TIMEZONE, "yyyy-MM-dd");
}

function computeWindow_(evts, signupCount, meta, dates) {
  var expo = {}, ji = {}, em = {}, rs = {}, engaged = {}, dur = {};
  evts.forEach(function (e) {
    var sid = String(e.sid || "");
    var ev = String(e.event || "");
    if (ev === "exposure") expo[sid] = 1;
    else if (ev === "join_initiated") { ji[sid] = 1; engaged[sid] = 1; }
    else if (ev === "email_entered") em[sid] = 1;
    else if (ev === "reserve_clicked") rs[sid] = 1;
    else if (ev === "session_end") {
      if (num_(e.engaged) === 1) engaged[sid] = 1;
      var d = num_(e.durationMs);
      if (d > (dur[sid] || 0)) dur[sid] = d;
    }
  });
  var sessions = Object.keys(expo).length;
  var engagedCount = 0;
  Object.keys(expo).forEach(function (s) { if (engaged[s]) engagedCount++; });
  var bounce = sessions ? (1 - engagedCount / sessions) * 100 : 0;
  var durList = Object.keys(dur).map(function (s) { return dur[s]; }).filter(function (d) { return d > 0; });
  var avgDurSec = durList.length ? (durList.reduce(function (a, b) { return a + b; }, 0) / durList.length / 1000) : 0;
  var email = Object.keys(em).length || signupCount || 0;

  // Meta spend for these dates
  var spend = 0;
  if (meta && meta.byDate && dates) {
    dates.forEach(function (d) { if (meta.byDate[d]) spend += meta.byDate[d].spend; });
  }

  return {
    sessions: sessions, bounce: bounce, avgDurSec: avgDurSec,
    joinInit: Object.keys(ji).length, email: email, reserve: Object.keys(rs).length,
    spend: spend, cpl: email ? spend / email : 0,
    lp2res: sessions ? (Object.keys(rs).length / sessions * 100) : 0
  };
}

function computeArm_(events, arm, meta) {
  var evs = events.filter(function (e) { return String(e.arm || "") === arm; });
  return computeWindow_(evs, 0, meta, null);
}

// ------------------------------ render ------------------------------
function statusOf_(v, g) {
  if (!g) return "";
  if (g.dir === "lower") return v <= g.good ? "green" : (v <= g.warn ? "yellow" : "red");
  return v >= g.good ? "green" : (v >= g.warn ? "yellow" : "red");
}
function chip_(txt, status) {
  var c = { green: "#1E8E5A", yellow: "#C8871B", red: "#C0392B" }[status];
  if (!c) return txt;
  return '<span style="color:' + c + ';font-weight:600">' + txt + "</span>";
}
function money_(n) { return n ? "$" + (Math.round(n * 100) / 100) : "$0"; }
function pct_(n) { return (Math.round(n * 10) / 10) + "%"; }
function dur_(sec) {
  if (!sec) return "—";
  var m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return m ? (m + "m " + s + "s") : (s + "s");
}
function na_() { return '<span style="color:#9AA79E">n/a</span>'; }

function td_(html, opt) {
  var style = "padding:6px 9px;border-bottom:1px solid #eee;font:12.5px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;" + (opt || "");
  return '<td style="' + style + '">' + html + "</td>";
}
function th_(html, opt) {
  return '<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:right;font:12.5px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;color:#5b6b60;' + (opt || "") + '">' + html + "</th>";
}

function renderSubject_(m) {
  var lead = m.pitch[0] && m.pitch[0].signups ? m.pitch[0].label.split(" ")[0] : "—";
  var ampm = Number(Utilities.formatDate(m.now, CONFIG.TIMEZONE, "H")) < 12 ? "AM" : "PM";
  var cpl = m.meta_ok ? (" · " + money_(m.mtd.cpl) + " CPL") : "";
  return "Niro smoke test · " + Utilities.formatDate(m.now, CONFIG.TIMEZONE, "MMM d") + " " + ampm +
    " · " + m.totalSignups + " signups (+" + m.newSignups + ")" + cpl + " · " + lead + " leading";
}

function metricRow_(label, cols, mtdVal, statusForMtd) {
  var cells = "<td style=\"padding:6px 9px;border-bottom:1px solid #eee;font:12.5px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;color:#1a2b22\">" + label + "</td>";
  cols.forEach(function (c) { cells += td_(c, "text-align:right;color:#3a4a40"); });
  cells += td_(statusForMtd ? chip_(mtdVal, statusForMtd) : mtdVal, "text-align:right;font-weight:600;background:#f6f4ee");
  return "<tr>" + cells + "</tr>";
}

function renderHtml_(m) {
  var h = [];
  h.push('<div style="max-width:720px;margin:0 auto;font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#1a2b22">');
  h.push('<h2 style="font-size:18px;margin:0 0 4px">Niro smoke test — ' +
    Utilities.formatDate(m.now, CONFIG.TIMEZONE, "EEE MMM d, HH:mm z") + '</h2>');
  h.push('<p style="color:#5b6b60;margin:0 0 16px">Day ' + m.dayNum + ' of ' + CONFIG.TEST_DAYS +
    ' · ' + m.daysLeft + ' left · spend ' + (m.meta_ok ? money_(m.spendMTD) : na_()) + ' / ' + money_(m.budget) + '</p>');
  if (!m.meta_ok) {
    h.push('<p style="background:#FBEEC8;border:1px solid #E4C97A;border-radius:6px;padding:8px 12px;color:#7a5b12">' +
      'Meta not connected' + (m.meta_err ? ' (' + m.meta_err + ')' : '') + ' — spend / CPL show n/a. Fill CONFIG.</p>');
  }

  // ---- Table 1: metric x date ----
  h.push('<h3 style="font-size:14px;margin:18px 0 6px">Daily metrics</h3>');
  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push('<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:left;font:12.5px/1.4 -apple-system;color:#5b6b60">Metric</th>');
  m.cols.forEach(function (c) { h.push(th_(c.label)); });
  h.push(th_("MTD", "background:#f6f4ee;color:#1a2b22"));
  h.push('</tr>');

  var C = m.cols.map(function (c) { return c.stat; });
  var M = m.mtd, ok = m.meta_ok;
  h.push(metricRow_("Sessions (LP visits)", C.map(function (s) { return s.sessions; }), M.sessions));
  h.push(metricRow_("Bounce rate", C.map(function (s) { return pct_(s.bounce); }), pct_(M.bounce), statusOf_(M.bounce, CONFIG.GATES.bounce)));
  h.push(metricRow_("Avg session duration", C.map(function (s) { return dur_(s.avgDurSec); }), dur_(M.avgDurSec)));
  h.push(metricRow_("Join waitlist initiated", C.map(function (s) { return s.joinInit; }), M.joinInit));
  h.push(metricRow_("Email entered", C.map(function (s) { return s.email; }), M.email));
  h.push(metricRow_("Reserve spot clicked", C.map(function (s) { return s.reserve; }), M.reserve));
  h.push(metricRow_("LP → reserve", C.map(function (s) { return pct_(s.lp2res); }), pct_(M.lp2res), statusOf_(M.lp2res, CONFIG.GATES.lp2res)));
  h.push(metricRow_("Spend", C.map(function (s) { return ok ? money_(s.spend) : na_(); }), ok ? money_(M.spend) : na_()));
  h.push(metricRow_("CPL", C.map(function (s) { return ok ? money_(s.cpl) : na_(); }), ok ? money_(M.cpl) : na_(), ok ? statusOf_(M.cpl, CONFIG.GATES.cpl) : ""));
  h.push('</table>');

  // ---- Table 2: pricing A/B ----
  h.push('<h3 style="font-size:14px;margin:22px 0 6px">Pricing A/B (since start)</h3>');
  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push('<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:left;font:12.5px/1.4 -apple-system;color:#5b6b60">Step</th>');
  h.push(th_("Arm A (Lite + Prime)"));
  h.push(th_("Arm B (single $99)"));
  h.push('</tr>');
  var A = m.ab.A, B = m.ab.B;
  function abRow(label, a, b) {
    return "<tr>" +
      '<td style="padding:6px 9px;border-bottom:1px solid #eee;font:12.5px/1.4 -apple-system;color:#1a2b22">' + label + "</td>" +
      td_(a, "text-align:right") + td_(b, "text-align:right") + "</tr>";
  }
  h.push(abRow("Traffic (sessions)", A.sessions, B.sessions));
  h.push(abRow("Join waitlist initiated", A.joinInit, B.joinInit));
  h.push(abRow("Email entered", A.email, B.email));
  h.push(abRow("Reserve spot clicked", A.reserve, B.reserve));
  h.push(abRow("LP → reserve %", pct_(A.lp2res), pct_(B.lp2res)));
  h.push('</table>');

  // ---- Pitch leaderboard ----
  h.push('<h3 style="font-size:14px;margin:22px 0 6px">Pitch leaderboard</h3>');
  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push('<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:left;font:12.5px/1.4 -apple-system;color:#5b6b60">Cell</th>');
  h.push(th_("Signups")); h.push(th_("Spend")); h.push(th_("CPL"));
  h.push('</tr>');
  m.pitch.forEach(function (p) {
    h.push("<tr>" +
      '<td style="padding:6px 9px;border-bottom:1px solid #eee;font:12.5px/1.4 -apple-system;color:#1a2b22">' + p.label + "</td>" +
      td_(p.signups, "text-align:right") +
      td_(m.meta_ok ? money_(p.spend) : na_(), "text-align:right") +
      td_(m.meta_ok && p.cpl ? money_(p.cpl) : na_(), "text-align:right") + "</tr>");
  });
  h.push('</table>');

  h.push('<p style="margin:22px 0 0;padding-top:12px;border-top:1px solid #eee;color:#5b6b60;font-size:12px">' +
    'Bounce / duration are from our own beacons (engaged = ≥10s, a scroll/click, or starting the waitlist). ' +
    'Green CPL means acquisition cost is not the killer — not that CAC is validated; waitlist intent is soft (no payment gate).</p>');
  h.push('</div>');
  return h.join("");
}

// ------------------------------ snapshot ------------------------------
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
