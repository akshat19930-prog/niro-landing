/**
 * Niro smoke-test — thrice-daily email report (12:00, 18:00, 00:00 IST).
 * Google Apps Script.
 *
 * Lives in the SAME spreadsheet as waitlist.gs. Reads:
 *   - `waitlist` tab  (signups: now carry market / page / geo)
 *   - `events` tab    (funnel + session beacons: exposure, join_initiated,
 *                      email_entered, phone_added, session_end — each now
 *                      carries `page` + `geo`)
 *   - Meta Marketing API (ad-set level: spend / impressions / clicks / leads /
 *                         landing-page views)
 *
 * The email has FOUR blocks:
 *   1-3. One metric×date table per market — North America, Gulf, Gulf (Dual) —
 *        each with the same columns (last N days + MTD) and these rows, in order:
 *          Sessions (unique visitors), Bounce rate, Avg session duration,
 *          Get Early Access clicked, Email entered, Email entered / visitors %,
 *          Phone number submitted, Cost per lead, Spend, Meta CPM, CTR.
 *   4.   Meta ads console — two tables across ALL ad sets:
 *          (a) cost per lead by ad set, (b) cost per visitor by ad set.
 *
 * SEGMENTATION
 *   Funnel/session rows come from our own beacons, split by (page, geo):
 *     - Gulf (Dual) = page starts with "/gulf"
 *     - Gulf        = page "/" and geo "gulf"
 *     - North America = page "/" and geo "na"
 *     (page "/" with geo "other" is rest-of-world; not shown in the 3 sections.)
 *   Spend / CPM / CTR / Cost-per-lead come from Meta, split by AD-SET NAME via
 *   CONFIG.MARKETS[].adset regexes — ADJUST THOSE to your real ad-set names.
 *   The console tables show every ad set with the market each mapped to, so you
 *   can confirm the mapping at a glance.
 *
 * SETUP: fill CONFIG, then run setupTriggers() once (authorize). Meta rows show
 * "n/a" until META_ACCESS_TOKEN + META_AD_ACCOUNT_ID are filled.
 */

// ===================== CONFIG =====================
var CONFIG = {
  RECIPIENTS: "akshat.19930@gmail.com, paarthdhar@gmail.com",
  TIMEZONE: "Asia/Kolkata",

  META_ACCESS_TOKEN: "",            // PASTE your System User token (ads_read). Secret - never commit it.
  META_AD_ACCOUNT_ID: "act_2246578592783321",
  META_API_VERSION: "v19.0",

  BUDGET_INR: 207500,
  TEST_START: "2026-08-07",         // yyyy-mm-dd — start of the window (captures all spend)
  TEST_DAYS: 12,
  DATE_COLS: 5,                     // trailing day columns before MTD

  // Sessions logged before geo tracking (and from visitors still on cached
  // pre-update JS) carry no page/geo. Before /gulf launched, ALL traffic was
  // the North-America-first "/" test, so fold these "untagged" sessions into
  // this market to retain historical numbers. Set to "" to exclude them once
  // browser caches have turned over and every live session is tagged.
  UNTAGGED_MARKET: "na",

  // Ad sets (or campaigns) whose name matches this are dropped from the report
  // entirely — no spend, no leads, no attribution. Used to exclude the Hindi
  // ad-set variants. Set to null to keep everything.
  EXCLUDE_ADSET: /hindi/i,

  // The three report markets, in display order. `pages`/`geos` segment our own
  // beacons; `adset` matches Meta ad-set names for spend/CPM/CTR. Gulf (Dual) is
  // matched BEFORE Gulf so a dual ad set isn't swallowed by the Gulf regex.
  // >>> EDIT the `adset` patterns to match how YOUR ad sets are actually named. <<<
  MARKETS: [
    { key: "na",        label: "North America", adset: /(^|[^a-z])(us|usa|united\s*states|canada|ca|north\s*america|na)([^a-z]|$)/i },
    { key: "gulf",      label: "Gulf",          adset: /(gulf|uae|dubai|abu\s*dhabi|qatar|doha|sharjah|parent)/i },
    { key: "gulf_dual", label: "Gulf (Dual)",   adset: /(dual|two[-\s]?countr|both[-\s]?side|\/gulf|gulf[-_\s]?dual|149)/i }
  ],

  TEST_EMAILS: [
    "john.doe@gmail.com", "johndoe@gmail.com", "jane.doe@gmail.com",
    "test@test.com", "test@gmail.com", "kk@gm",
    "@example.com", "@test.com", "@mailinator.com"
  ],

  GATES: {
    cpl:    { good: 1000, warn: 1850, dir: "lower" },  // ₹
    bounce: { good: 45,   warn: 65,   dir: "lower" },  // %
    e2v:    { good: 8,    warn: 3,    dir: "higher" }  // % email entered / visitors
  }
};
// ==================================================

function setupTriggers() {
  removeTriggers();
  // Three times a day (IST): 12:00 noon, 18:00 evening, and 00:00 midnight
  // (the day-end report, delivered just after midnight).
  [12, 18, 0].forEach(function (hr) {
    ScriptApp.newTrigger("sendReport").timeBased().atHour(hr).everyDays(1)
      .inTimezone(CONFIG.TIMEZONE).create();
  });
}
function removeTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "sendReport") ScriptApp.deleteTrigger(t);
  });
}

function sendReport() {
  var data = readAll_();
  var meta = fetchMeta_();
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
function isTestEmail_(email) {
  var e = String(email || "").trim().toLowerCase();
  if (!e) return false;
  var domain = "@" + (e.split("@")[1] || "");
  var list = CONFIG.TEST_EMAILS || [];
  for (var i = 0; i < list.length; i++) {
    var entry = String(list[i]).trim().toLowerCase();
    if (!entry) continue;
    if (entry.charAt(0) === "@") { if (entry === domain) return true; }
    else if (entry === e) return true;
  }
  return false;
}

// ------------------------------ Meta ------------------------------
function fetchMeta_() {
  if (!CONFIG.META_ACCESS_TOKEN || !CONFIG.META_AD_ACCOUNT_ID) return null;
  try {
    var base = "https://graph.facebook.com/" + CONFIG.META_API_VERSION + "/" +
      CONFIG.META_AD_ACCOUNT_ID + "/insights";
    var until = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd");
    var range = encodeURIComponent(JSON.stringify({ since: CONFIG.TEST_START, until: until }));
    var fields = "adset_id,adset_name,campaign_name,spend,impressions,clicks,actions";

    // Ad-set level, one row per (ad set, day). Everything else is derived from this.
    var rows = metaGetAll_(base + "?level=adset&time_increment=1&time_range=" + range +
      "&fields=" + fields + "&limit=500");

    var adsets = {};          // id -> { name, market, spend, impr, clicks, leads, lpv }
    var marketDate = {};      // marketKey -> { date -> {spend, impr, clicks} }
    var totalSpend = 0, unmappedSpend = 0;

    rows.forEach(function (r) {
      var id = String(r.adset_id || r.adset_name || "?");
      var name = String(r.adset_name || id);
      var campaign = String(r.campaign_name || "");
      // Drop excluded ad sets (e.g. Hindi) entirely — before any accumulation.
      if (CONFIG.EXCLUDE_ADSET && (CONFIG.EXCLUDE_ADSET.test(name) || CONFIG.EXCLUDE_ADSET.test(campaign))) return;

      var date = r.date_start;
      var spend = num_(r.spend), impr = num_(r.impressions), clicks = num_(r.clicks);
      var leads = metaAction_(r.actions, "lead");
      var lpv = metaAction_(r.actions, "landing_page_view");
      totalSpend += spend;

      // Match the market on the ad-set name OR its campaign name.
      var mk = marketForAdset_(name, campaign);
      if (!adsets[id]) adsets[id] = { name: name, market: mk, spend: 0, impr: 0, clicks: 0, leads: 0, lpv: 0 };
      var a = adsets[id];
      a.spend += spend; a.impr += impr; a.clicks += clicks; a.leads += leads; a.lpv += lpv;

      if (mk) {
        var md = marketDate[mk] = marketDate[mk] || {};
        var cell = md[date] = md[date] || { spend: 0, impr: 0, clicks: 0 };
        cell.spend += spend; cell.impr += impr; cell.clicks += clicks;
      } else {
        unmappedSpend += spend;
      }
    });
    return { adsets: adsets, marketDate: marketDate, totalSpend: totalSpend, unmappedSpend: unmappedSpend };
  } catch (err) {
    return { error: String(err) };
  }
}
function metaGetAll_(url) {
  var out = [], guard = 0, next = url;
  while (next && guard < 20) {
    var full = next.indexOf("access_token=") === -1
      ? next + "&access_token=" + encodeURIComponent(CONFIG.META_ACCESS_TOKEN)
      : next;
    var res = UrlFetchApp.fetch(full, { muteHttpExceptions: true });
    var body = JSON.parse(res.getContentText() || "{}");
    if (body.data && body.data.length) out = out.concat(body.data);
    next = (body.paging && body.paging.next) ? body.paging.next : null;
    guard++;
  }
  return out;
}
/** Value for one action_type from an insights actions[] array (0 if absent).
 *  Use canonical single types (e.g. "lead", "landing_page_view") — never sum
 *  Meta's duplicate lead variants, which would multiply the count. */
function metaAction_(actions, type) {
  if (!actions || !actions.length) return 0;
  var v = 0;
  actions.forEach(function (a) { if (String(a.action_type) === type) v = num_(a.value); });
  return v;
}
function marketForAdset_(name, campaign) {
  var hay = String(name || "") + " " + String(campaign || "");
  // Test Gulf (Dual) before Gulf so a dual ad set isn't captured by the Gulf regex.
  var order = ["gulf_dual", "gulf", "na"];
  for (var i = 0; i < order.length; i++) {
    var def = defForKey_(order[i]);
    if (def && def.adset && def.adset.test(hay)) return def.key;
  }
  return "";  // unmapped
}
function defForKey_(key) {
  var list = CONFIG.MARKETS;
  for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
  return null;
}
function num_(x) { return Number(x) || 0; }

// ------------------------------ model ------------------------------
function buildModel_(data, meta) {
  var now = new Date(), tz = CONFIG.TIMEZONE;

  data.signups = data.signups.filter(function (s) {
    var email = String(s.email || "").trim().toLowerCase();
    return email !== "" && !isTestEmail_(email);
  });

  // Date columns: last DATE_COLS days (oldest..today).
  var cols = [];
  for (var i = CONFIG.DATE_COLS - 1; i >= 0; i--) {
    cols.push(Utilities.formatDate(new Date(now.getTime() - i * 86400000), tz, "yyyy-MM-dd"));
  }
  // MTD dates = TEST_START..today
  var mtdDates = [], cur = CONFIG.TEST_START, todayStr = Utilities.formatDate(now, tz, "yyyy-MM-dd"), guard = 0;
  while (cur <= todayStr && guard < 400) { mtdDates.push(cur); cur = nextDay_(cur); guard++; }

  // Bucket events by (market, date).
  var evByMarketDate = {};   // marketKey -> date -> [events]
  data.events.forEach(function (e) {
    var mk = marketForEvent_(e.page, e.geo, e.market);
    if (!mk) return;
    var raw = (e.date !== "" && e.date != null) ? e.date : e.timestamp;
    var d = dateStr_(raw);
    (evByMarketDate[mk] = evByMarketDate[mk] || {});
    (evByMarketDate[mk][d] = evByMarketDate[mk][d] || []).push(e);
  });

  function windowFor(mk, dates) {
    var evs = [];
    dates.forEach(function (d) {
      if (evByMarketDate[mk] && evByMarketDate[mk][d]) evs = evs.concat(evByMarketDate[mk][d]);
    });
    var metaAgg = { spend: 0, impr: 0, clicks: 0 };
    if (meta && meta.marketDate && meta.marketDate[mk]) {
      dates.forEach(function (d) {
        var c = meta.marketDate[mk][d];
        if (c) { metaAgg.spend += c.spend; metaAgg.impr += c.impr; metaAgg.clicks += c.clicks; }
      });
    }
    return computeMarketWindow_(evs, metaAgg);
  }

  var markets = CONFIG.MARKETS.map(function (def) {
    return {
      key: def.key, label: def.label,
      cols: cols.map(function (d) {
        return { label: Utilities.formatDate(new Date(d + "T00:00:00"), tz, "MMM d"), stat: windowFor(def.key, [d]) };
      }),
      mtd: windowFor(def.key, mtdDates)
    };
  });

  // Ad-set console (MTD totals), sorted by spend desc.
  var adsets = [];
  if (meta && meta.adsets) {
    Object.keys(meta.adsets).forEach(function (id) { adsets.push(meta.adsets[id]); });
    adsets.sort(function (a, b) { return b.spend - a.spend; });
  }

  var start = new Date(CONFIG.TEST_START + "T00:00:00");
  var dayNum = Math.max(1, Math.ceil((now - start) / 86400000));
  var prev = loadSnapshot_();

  return {
    now: now,
    meta_ok: !!(meta && !meta.error && meta.adsets),
    meta_err: meta && meta.error,
    markets: markets, adsets: adsets,
    totalSignups: data.signups.length,
    newSignups: prev ? Math.max(0, data.signups.length - prev.totalSignups) : data.signups.length,
    dayNum: dayNum, daysLeft: Math.max(0, CONFIG.TEST_DAYS - dayNum),
    spendMTD: meta && meta.totalSpend ? meta.totalSpend : 0,
    unmappedSpend: meta && meta.unmappedSpend ? meta.unmappedSpend : 0,
    budget: CONFIG.BUDGET_INR
  };
}
function nextDay_(yyyymmdd) {
  var d = new Date(yyyymmdd + "T00:00:00");
  d = new Date(d.getTime() + 86400000);
  return Utilities.formatDate(d, CONFIG.TIMEZONE, "yyyy-MM-dd");
}

/** Which report market an event belongs to, from its page + geo (market wins if
 *  the beacon carried it). Returns "" for rest-of-world (not shown). */
function marketForEvent_(page, geo, market) {
  var p = String(page || ""), g = String(geo || "").toLowerCase(), mk = String(market || "").toLowerCase();
  if (p.indexOf("/gulf") === 0 || mk === "gulf") return "gulf_dual";
  if (g === "gulf") return "gulf";
  if (g === "na") return "na";
  // Fully untagged (no page AND no geo) = legacy / cached-JS session. Attribute
  // to the configured default market so historical numbers are retained.
  if (!p && !g) return CONFIG.UNTAGGED_MARKET || "";
  return "";
}

function computeMarketWindow_(evts, metaAgg) {
  var expo = {}, getAcc = {}, em = {}, ph = {}, engaged = {}, dur = {};
  evts.forEach(function (e) {
    var sid = String(e.sid || ""), ev = String(e.event || "");
    if (ev === "exposure") expo[sid] = 1;
    else if (ev === "join_initiated") { getAcc[sid] = 1; engaged[sid] = 1; }
    else if (ev === "email_entered") em[sid] = 1;
    else if (ev === "phone_added") ph[sid] = 1;
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
  var email = Object.keys(em).length;

  var spend = metaAgg.spend, impr = metaAgg.impr, clicks = metaAgg.clicks;
  return {
    sessions: sessions, bounce: bounce, avgDurSec: avgDurSec,
    getAccess: Object.keys(getAcc).length,
    email: email,
    e2v: sessions ? (email / sessions * 100) : 0,
    phone: Object.keys(ph).length,
    spend: spend, impr: impr, clicks: clicks,
    cpl: email ? spend / email : 0,
    cpm: impr ? spend / impr * 1000 : 0,
    ctr: impr ? clicks / impr * 100 : 0
  };
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
function money_(n) {
  if (!n) return "₹0";
  return "₹" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function pct_(n) { return (Math.round(n * 10) / 10) + "%"; }
function dur_(sec) {
  if (!sec) return "-";
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
function labelTd_(label) {
  return '<td style="padding:6px 9px;border-bottom:1px solid #eee;font:12.5px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;color:#1a2b22">' + label + "</td>";
}

function renderSubject_(m) {
  var ampm = Number(Utilities.formatDate(m.now, CONFIG.TIMEZONE, "H")) < 12 ? "AM" : "PM";
  var spend = m.meta_ok ? (" · " + money_(m.spendMTD) + " spend") : "";
  return "Niro smoke test · " + Utilities.formatDate(m.now, CONFIG.TIMEZONE, "MMM d") + " " + ampm +
    " · " + m.totalSignups + " signups (+" + m.newSignups + ")" + spend;
}

/** One metric×date table for a market. Rows in the exact requested order. */
function renderMarketTable_(m, market) {
  var h = [];
  h.push('<h3 style="font-size:15px;margin:22px 0 6px">' + market.label + '</h3>');
  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push('<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:left;font:12.5px/1.4 -apple-system;color:#5b6b60">Metric</th>');
  market.cols.forEach(function (c) { h.push(th_(c.label)); });
  h.push(th_("MTD", "background:#f6f4ee;color:#1a2b22"));
  h.push('</tr>');

  var C = market.cols.map(function (c) { return c.stat; });
  var M = market.mtd, ok = m.meta_ok;

  function row(label, vals, mtdVal, statusForMtd) {
    var cells = labelTd_(label);
    vals.forEach(function (v) { cells += td_(v, "text-align:right;color:#3a4a40"); });
    cells += td_(statusForMtd ? chip_(mtdVal, statusForMtd) : mtdVal, "text-align:right;font-weight:600;background:#f6f4ee");
    return "<tr>" + cells + "</tr>";
  }

  h.push(row("Sessions (unique visitors)", C.map(function (s) { return s.sessions; }), M.sessions));
  h.push(row("Bounce rate", C.map(function (s) { return pct_(s.bounce); }), pct_(M.bounce), statusOf_(M.bounce, CONFIG.GATES.bounce)));
  h.push(row("Avg session duration", C.map(function (s) { return dur_(s.avgDurSec); }), dur_(M.avgDurSec)));
  h.push(row("Get Early Access clicked", C.map(function (s) { return s.getAccess; }), M.getAccess));
  h.push(row("Email entered", C.map(function (s) { return s.email; }), M.email));
  h.push(row("Email entered / visitors %", C.map(function (s) { return pct_(s.e2v); }), pct_(M.e2v), statusOf_(M.e2v, CONFIG.GATES.e2v)));
  h.push(row("Phone number submitted", C.map(function (s) { return s.phone; }), M.phone));
  h.push(row("Cost per lead", C.map(function (s) { return ok ? money_(s.cpl) : na_(); }), ok ? money_(M.cpl) : na_(), ok ? statusOf_(M.cpl, CONFIG.GATES.cpl) : ""));
  h.push(row("Spend", C.map(function (s) { return ok ? money_(s.spend) : na_(); }), ok ? money_(M.spend) : na_()));
  h.push(row("Meta CPM", C.map(function (s) { return ok ? money_(s.cpm) : na_(); }), ok ? money_(M.cpm) : na_()));
  h.push(row("CTR", C.map(function (s) { return ok ? pct_(s.ctr) : na_(); }), ok ? pct_(M.ctr) : na_()));
  h.push('</table>');
  return h.join("");
}

function marketLabelFor_(key) {
  var d = defForKey_(key);
  return d ? d.label : (key || "Unmapped");
}

function renderHtml_(m) {
  var h = [];
  h.push('<div style="max-width:760px;margin:0 auto;font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#1a2b22">');
  h.push('<h2 style="font-size:18px;margin:0 0 4px">Niro smoke test — ' +
    Utilities.formatDate(m.now, CONFIG.TIMEZONE, "EEE MMM d, HH:mm z") + '</h2>');
  h.push('<p style="color:#5b6b60;margin:0 0 16px">Day ' + m.dayNum + ' of ' + CONFIG.TEST_DAYS +
    ' · ' + m.daysLeft + ' left · ' + m.totalSignups + ' signups (+' + m.newSignups + ') · spend ' +
    (m.meta_ok ? money_(m.spendMTD) : na_()) + ' / ' + money_(m.budget) + '</p>');
  if (!m.meta_ok) {
    h.push('<p style="background:#FBEEC8;border:1px solid #E4C97A;border-radius:6px;padding:8px 12px;color:#7a5b12">' +
      'Meta not connected' + (m.meta_err ? ' (' + m.meta_err + ')' : '') + ' — Cost per lead / Spend / CPM / CTR show n/a. Fill CONFIG.META_ACCESS_TOKEN.</p>');
  } else if (m.unmappedSpend > 0) {
    h.push('<p style="background:#FBEEC8;border:1px solid #E4C97A;border-radius:6px;padding:8px 12px;color:#7a5b12">' +
      money_(m.unmappedSpend) + ' of spend is in ad sets that matched no market, so it is missing from the three sections above (see rows marked <b>Unmapped</b> in the console below). ' +
      'Edit CONFIG.MARKETS[].adset to match your ad-set / campaign names.</p>');
  }

  // ---- Blocks 1-3: one table per market ----
  m.markets.forEach(function (market) { h.push(renderMarketTable_(m, market)); });

  // ---- Block 4: Meta ads console (2 tables across all ad sets) ----
  h.push('<h2 style="font-size:16px;margin:30px 0 4px;padding-top:16px;border-top:2px solid #e6e2d6">Meta ads — all ad sets</h2>');

  // Table A: cost per lead
  h.push('<h3 style="font-size:14px;margin:14px 0 6px">Cost per lead by ad set</h3>');
  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push('<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:left;font:12.5px/1.4 -apple-system;color:#5b6b60">Ad set</th>');
  h.push(th_("Market", "text-align:left")); h.push(th_("Spend")); h.push(th_("Leads")); h.push(th_("Cost / lead"));
  h.push('</tr>');
  if (m.meta_ok && m.adsets.length) {
    var tS = 0, tL = 0;
    m.adsets.forEach(function (a) {
      tS += a.spend; tL += a.leads;
      h.push("<tr>" + labelTd_(a.name) +
        td_(marketLabelFor_(a.market), "text-align:left;color:#5b6b60") +
        td_(money_(a.spend), "text-align:right") +
        td_(a.leads, "text-align:right") +
        td_(a.leads ? money_(a.spend / a.leads) : na_(), "text-align:right;font-weight:600") + "</tr>");
    });
    h.push("<tr>" + labelTd_("<b>Total</b>") + td_("", "") +
      td_(money_(tS), "text-align:right;font-weight:600") +
      td_(tL, "text-align:right;font-weight:600") +
      td_(tL ? money_(tS / tL) : na_(), "text-align:right;font-weight:600;background:#f6f4ee") + "</tr>");
  } else {
    h.push("<tr>" + td_(m.meta_ok ? "No ad-set data in range." : na_(), "text-align:left") + "</tr>");
  }
  h.push('</table>');

  // Table B: cost per visitor (Meta landing-page views)
  h.push('<h3 style="font-size:14px;margin:20px 0 6px">Cost per visitor by ad set</h3>');
  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push('<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:left;font:12.5px/1.4 -apple-system;color:#5b6b60">Ad set</th>');
  h.push(th_("Market", "text-align:left")); h.push(th_("Spend")); h.push(th_("Visitors (LPV)")); h.push(th_("Cost / visitor"));
  h.push('</tr>');
  if (m.meta_ok && m.adsets.length) {
    var sS = 0, sV = 0;
    m.adsets.forEach(function (a) {
      sS += a.spend; sV += a.lpv;
      h.push("<tr>" + labelTd_(a.name) +
        td_(marketLabelFor_(a.market), "text-align:left;color:#5b6b60") +
        td_(money_(a.spend), "text-align:right") +
        td_(Math.round(a.lpv), "text-align:right") +
        td_(a.lpv ? money_(a.spend / a.lpv) : na_(), "text-align:right;font-weight:600") + "</tr>");
    });
    h.push("<tr>" + labelTd_("<b>Total</b>") + td_("", "") +
      td_(money_(sS), "text-align:right;font-weight:600") +
      td_(Math.round(sV), "text-align:right;font-weight:600") +
      td_(sV ? money_(sS / sV) : na_(), "text-align:right;font-weight:600;background:#f6f4ee") + "</tr>");
  } else {
    h.push("<tr>" + td_(m.meta_ok ? "No ad-set data in range." : na_(), "text-align:left") + "</tr>");
  }
  h.push('</table>');

  h.push('<p style="margin:22px 0 0;padding-top:12px;border-top:1px solid #eee;color:#5b6b60;font-size:12px">' +
    'Funnel rows are from our own beacons, split by page + geography: Gulf (Dual) = /gulf; Gulf = "/" from a Gulf time zone; North America = "/" from a US/Canada time zone. ' +
    'Legacy/untagged sessions (logged before geo tracking, or from cached pre-update JS) are counted under ' + (marketLabelFor_(CONFIG.UNTAGGED_MARKET) || 'no market') + ' to retain history; set CONFIG.UNTAGGED_MARKET="" to exclude them. Tagged rest-of-world "/" traffic is not shown. ' +
    'Spend / CPM / CTR / Cost-per-lead are from Meta, mapped to a market by ad-set name (CONFIG.MARKETS) — the console tables show that mapping. ' +
    '"Visitors" in the second console table = Meta landing-page views. Section Cost per lead = Meta spend ÷ emails entered; console Cost per lead = Meta spend ÷ Meta lead conversions. ' +
    'Bounce / duration are approximations (engaged = ≥10s, a scroll/click, or starting the waitlist).</p>');
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
