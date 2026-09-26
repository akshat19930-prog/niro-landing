/**
 * Niro POC - email report, every 3 hours (see CONFIG.REPORT_EVERY_HOURS).
 * Google Apps Script.
 *
 * Lives in the SAME spreadsheet as waitlist.gs. Reads:
 *   - `waitlist` tab  (signups: phone-first since Sept 2026; a lead is keyed
 *                      on its phone number, with email only as a fallback for
 *                      smoke-test rows that predate the switch)
 *   - `events` tab    (funnel + session beacons: exposure, join_initiated,
 *                      phone_captured, signup_completed, session_end - each now
 *                      carries `page` + `geo`)
 *   - Meta Marketing API (ad-set level: spend / impressions / clicks / leads /
 *                         landing-page views)
 *
 * The email has FOUR blocks:
 *   1. One rolled-up metric x date table across ALL geographies, with the
 *      trailing day columns, then the running window, then a smoke-test
 *      benchmark column. Rows, in order: Sessions (unique visitors), Bounce
 *      rate, Avg session duration, Get beta access clicked, Phone number
 *      entered, Phone entered / visitors %, All details submitted, Cost per
 *      lead, Spend, Meta CPM, Link CTR.
 *   2. A conversion table, read from the leadStatus column of the sign-ups
 *      sheet: leads today, since launch, overall, then the lifecycle stages.
 *   3. Meta ads console: cost per lead by market (US, Gulf, rest of world)
 *      and cost per visitor by ad set.
 *
 * SEGMENTATION
 *   Funnel/session rows come from our own beacons. Every session lands in
 *   exactly one of three clusters - resolved by page, then ad campaign, then
 *   time zone (see marketForEvent_):
 *     - Gulf        = a *_gulf campaign, or geo "gulf"
 *     - North America = a Smoketest campaign, geo "na", or anything unplaced
 *   There is no rest-of-world bucket: untagged and tagged-"other" traffic both
 *   fall back to CONFIG.UNTAGGED_MARKET, so the sections reconcile to the sheet.
 *   Spend / CPM / CTR / Cost-per-lead come from Meta, split by AD-SET NAME via
 *   CONFIG.MARKETS[].adset regexes - ADJUST THOSE to your real ad-set names.
 *   The console tables show every ad set with the market each mapped to, so you
 *   can confirm the mapping at a glance.
 *
 * SETUP: fill CONFIG, then run setupTriggers() once (authorize). Meta rows show
 * "n/a" until META_ACCESS_TOKEN + META_AD_ACCOUNT_ID are filled.
 */

// ===================== CONFIG =====================
var CONFIG = {
  RECIPIENTS: "akshat@tellniro.com, paarth@tellniro.com",
  TIMEZONE: "Asia/Kolkata",
  REPORT_TITLE: "Niro POC",

  // Launch. The running window starts here, so the report never mixes POC
  // numbers with smoke-test numbers in one column.
  LAUNCH_DATE: "2026-09-25",
  REPORT_EVERY_HOURS: 3,            // 8 reports a day, round the clock
  RUNNING_DAYS: 30,                 // L30D once 30 days have passed; shorter until then

  // The smoke-test benchmark column. 15-26 Aug is the ANALYSABLE window: it is
  // what the smoke-test readout reports on, it matches TEST_DAYS below, and the
  // readout's own source line says "act_2246578592783321, 15-26 Aug 2026".
  // TEST_START is earlier on purpose - that is the Meta FETCH window, set wide
  // so no spend is missed, and it is not the window to benchmark against.
  SMOKE_START: "2026-08-15",
  SMOKE_END:   "2026-08-26",

  META_ACCESS_TOKEN: "",            // PASTE your System User token (ads_read). Secret - never commit it.
  META_AD_ACCOUNT_ID: "act_2246578592783321",
  META_API_VERSION: "v19.0",

  BUDGET_INR: 207500,
  TEST_START: "2026-08-07",         // yyyy-mm-dd - start of the window (captures all spend)
  TEST_DAYS: 12,
  DATE_COLS: 5,                     // trailing day columns before MTD

  // Sessions logged before geo tracking (and from visitors still on cached
  // pre-update JS) carry no page/geo. Before /gulf launched, ALL traffic was
  // the North-America-first "/" test, so fold these "untagged" sessions into
  // this market to retain historical numbers. Set to "" to exclude them once
  // browser caches have turned over and every live session is tagged.
  UNTAGGED_MARKET: "na",

  // Ad sets (or campaigns) whose name matches this are dropped from the report
  // entirely - no spend, no leads, no attribution. Used to exclude the Hindi
  // ad-set variants. Set to null to keep everything.
  EXCLUDE_ADSET: /hindi/i,

  // The three report markets, in display order. Meta spend/CPM/CTR/leads are
  // attributed by EXACT campaign name (`campaigns`) - ad-set names collide
  // across markets (a "P3 English" ad set exists in both the US-CA and the Gulf
  // campaigns), so only the campaign disambiguates. `adset` is a fuzzy fallback
  // for any NEW campaign not yet listed here. Add new campaign names as you make
  // them. (Funnel rows are split separately, by page + geo, from our beacons.)
  MARKETS: [
    {
      key: "na", label: "US",
      campaigns: [
        "Niro Test P1-5 US CA",
        "Niro Test P1", "Niro Test P2", "Niro Test P3", "Niro Test P4", "Niro Test P5"
      ],
      adset: /(^|[^a-z])(us|usa|united\s*states|canada|na)([^a-z]|$)/i
    },
    {
      key: "gulf", label: "Gulf",
      campaigns: ["Niro Test P3-P4 Gulf"],
      adset: /gulf/i
    },
    // Rest of world is the CATCH-ALL and must stay last. Anything matching no
    // campaign name and no ad-set regex lands here instead of vanishing - which
    // is what used to happen: a new campaign matched nothing, its spend went to
    // `unmappedSpend`, and the market tables read zero.
    { key: "row", label: "Rest of world", campaigns: [], adset: null, catchAll: true }
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
  // Every REPORT_EVERY_HOURS hours, round the clock. Apps Script anchors an
  // everyHours trigger to the moment it is created, so the slots land at
  // whatever time you run this, not on the clock hour. Re-run setupTriggers()
  // at a sensible hour if you want the schedule to sit somewhere specific.
  //
  // Note this changes what "new" means in the header and subject: newSignups
  // is the delta since the LAST report, so at a 3 hour cadence it reads as
  // leads in the last 3 hours, not leads today.
  ScriptApp.newTrigger("sendReport").timeBased()
    .everyHours(CONFIG.REPORT_EVERY_HOURS).create();
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
/** The Meta token, preferring an inline CONFIG value but falling back to a
 *  Script Property named META_ACCESS_TOKEN. Set it once under Project Settings
 *  → Script Properties and re-pasting this file will never wipe it again. */
function metaToken_() {
  if (CONFIG.META_ACCESS_TOKEN) return CONFIG.META_ACCESS_TOKEN;
  try {
    return PropertiesService.getScriptProperties().getProperty("META_ACCESS_TOKEN") || "";
  } catch (e) {
    return "";
  }
}

function fetchMeta_() {
  if (!metaToken_() || !CONFIG.META_AD_ACCOUNT_ID) return null;
  try {
    var base = "https://graph.facebook.com/" + CONFIG.META_API_VERSION + "/" +
      CONFIG.META_AD_ACCOUNT_ID + "/insights";
    var until = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd");
    var range = encodeURIComponent(JSON.stringify({ since: CONFIG.TEST_START, until: until }));
    var fields = "adset_id,adset_name,campaign_name,spend,impressions,clicks,inline_link_clicks,actions";

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
      // Drop excluded ad sets (e.g. Hindi) entirely - before any accumulation.
      if (CONFIG.EXCLUDE_ADSET && (CONFIG.EXCLUDE_ADSET.test(name) || CONFIG.EXCLUDE_ADSET.test(campaign))) return;

      var date = r.date_start;
      var spend = num_(r.spend), impr = num_(r.impressions), clicks = num_(r.clicks);
      // Link clicks only. All-clicks counts reactions, comments, shares and post
      // expands, and overstated CTR by roughly 1.5x through the smoke test
      // (3.76% all-clicks against 2.53% link). The link figure is the one that
      // corresponds to people actually arriving.
      var linkClicks = num_(r.inline_link_clicks);
      var leads = metaAction_(r.actions, "lead");
      var lpv = metaAction_(r.actions, "landing_page_view");
      totalSpend += spend;

      // Match the market on the ad-set name OR its campaign name.
      var mk = marketForAdset_(name, campaign);
      if (!adsets[id]) adsets[id] = { name: name, market: mk, spend: 0, impr: 0, clicks: 0, linkClicks: 0, leads: 0, lpv: 0 };
      var a = adsets[id];
      a.spend += spend; a.impr += impr; a.clicks += clicks; a.linkClicks += linkClicks; a.leads += leads; a.lpv += lpv;

      if (mk) {
        var md = marketDate[mk] = marketDate[mk] || {};
        var cell = md[date] = md[date] || { spend: 0, impr: 0, clicks: 0, linkClicks: 0 };
        cell.spend += spend; cell.impr += impr; cell.clicks += clicks; cell.linkClicks += linkClicks;
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
      ? next + "&access_token=" + encodeURIComponent(metaToken_())
      : next;
    var res = UrlFetchApp.fetch(full, { muteHttpExceptions: true });
    var body = JSON.parse(res.getContentText() || "{}");
    // Surface API errors (expired/invalid token, wrong account, rate limit)
    // instead of swallowing them into silent zeros.
    if (body.error) throw new Error("Meta API: " + (body.error.message || JSON.stringify(body.error)));
    if (body.data && body.data.length) out = out.concat(body.data);
    next = (body.paging && body.paging.next) ? body.paging.next : null;
    guard++;
  }
  return out;
}
/** Value for one action_type from an insights actions[] array (0 if absent).
 *  Use canonical single types (e.g. "lead", "landing_page_view") - never sum
 *  Meta's duplicate lead variants, which would multiply the count. */
function metaAction_(actions, type) {
  if (!actions || !actions.length) return 0;
  var v = 0;
  actions.forEach(function (a) { if (String(a.action_type) === type) v = num_(a.value); });
  return v;
}
function marketForAdset_(name, campaign) {
  // 1) Primary: exact campaign-name match (unambiguous - ad-set names collide).
  var n = String(name || "");
  var camp = String(campaign || "").trim().toLowerCase();
  if (camp) {
    for (var i = 0; i < CONFIG.MARKETS.length; i++) {
      var list = CONFIG.MARKETS[i].campaigns || [];
      for (var j0 = 0; j0 < list.length; j0++) {
        if (String(list[j0]).trim().toLowerCase() === camp) return CONFIG.MARKETS[i].key;
      }
    }
  }
  // 2. fuzzy ad-set / campaign regex, for campaigns not yet listed.
  for (var j = 0; j < CONFIG.MARKETS.length; j++) {
    var d2 = CONFIG.MARKETS[j];
    if (d2.adset && (d2.adset.test(n) || d2.adset.test(camp))) return d2.key;
  }
  // 3. catch-all. Never return null: unattributed spend belongs in a visible
  //    row, not in a footnote nobody reads.
  for (var k = 0; k < CONFIG.MARKETS.length; k++) {
    if (CONFIG.MARKETS[k].catchAll) return CONFIG.MARKETS[k].key;
  }
  return null;
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

  // A lead is now identified by PHONE. The funnel stopped collecting email in
  // Sept 2026, so the old "must have an email" filter silently dropped every
  // POC signup and the report read zero. Keep anything with a phone or an
  // email; drop only obvious test addresses.
  data.signups = data.signups.filter(function (s) {
    var email = String(s.email || "").trim().toLowerCase();
    if (email && isTestEmail_(email)) return false;
    return leadKey_(s) !== "";
  });

  var todayStr = Utilities.formatDate(now, tz, "yyyy-MM-dd");

  // Trailing day columns (oldest..today).
  var cols = [];
  for (var i = CONFIG.DATE_COLS - 1; i >= 0; i--) {
    cols.push(Utilities.formatDate(new Date(now.getTime() - i * 86400000), tz, "yyyy-MM-dd"));
  }

  // The running window: launch..today, capped at RUNNING_DAYS so it becomes a
  // true rolling L30D once 30 days have passed. It never reaches back before
  // launch, so POC numbers are never mixed with smoke-test numbers.
  var runStart = CONFIG.LAUNCH_DATE;
  var floorStr = Utilities.formatDate(
    new Date(now.getTime() - (CONFIG.RUNNING_DAYS - 1) * 86400000), tz, "yyyy-MM-dd");
  if (floorStr > runStart) runStart = floorStr;
  var runDates = datesBetween_(runStart, todayStr);
  var smokeDates = datesBetween_(CONFIG.SMOKE_START, CONFIG.SMOKE_END);

  // Bucket events by date, and separately by (market, date). The headline table
  // is rolled up across all geographies, so it reads the first of these.
  var evByDate = {}, evByMarketDate = {};
  data.events.forEach(function (e) {
    var raw = (e.date !== "" && e.date != null) ? e.date : e.timestamp;
    var d = dateStr_(raw);
    (evByDate[d] = evByDate[d] || []).push(e);
    var mk = marketForEvent_(e.page, e.geo, e.market, e.campaign);
    if (!mk) return;
    (evByMarketDate[mk] = evByMarketDate[mk] || {});
    (evByMarketDate[mk][d] = evByMarketDate[mk][d] || []).push(e);
  });

  /** Meta totals for a set of dates, across every ad set (no market filter). */
  function metaForDates(dates) {
    var agg = { spend: 0, impr: 0, clicks: 0, linkClicks: 0 };
    if (!meta || !meta.marketDate) return agg;
    Object.keys(meta.marketDate).forEach(function (mk) {
      dates.forEach(function (d) {
        var c = meta.marketDate[mk][d];
        if (c) {
          agg.spend += c.spend; agg.impr += c.impr;
          agg.clicks += c.clicks; agg.linkClicks += (c.linkClicks || 0);
        }
      });
    });
    return agg;
  }

  /** The rolled-up funnel for a set of dates. */
  function rollupFor(dates) {
    var evs = [];
    dates.forEach(function (d) { if (evByDate[d]) evs = evs.concat(evByDate[d]); });
    return computeMarketWindow_(evs, metaForDates(dates));
  }

  var rollup = {
    cols: cols.map(function (d) {
      return { label: Utilities.formatDate(new Date(d + "T00:00:00"), tz, "MMM d"), stat: rollupFor([d]) };
    }),
    running: rollupFor(runDates),
    smoke: rollupFor(smokeDates)
  };

  // Ad-set console, sorted by spend desc.
  var adsets = [];
  if (meta && meta.adsets) {
    Object.keys(meta.adsets).forEach(function (id) { adsets.push(meta.adsets[id]); });
    adsets.sort(function (a, b) { return b.spend - a.spend; });
  }

  var prev = loadSnapshot_();
  var uniqueLeads = (function () {
    var seen = {}, n = 0;
    data.signups.forEach(function (x) {
      var k = leadKey_(x);
      if (k && !seen[k]) { seen[k] = 1; n++; }
    });
    return n;
  })();
  var dayNum = Math.max(1, Math.ceil(
    (new Date(todayStr + "T00:00:00") - new Date(CONFIG.LAUNCH_DATE + "T00:00:00")) / 86400000) + 1);

  return {
    now: now,
    meta_ok: !!(meta && !meta.error && meta.adsets),
    meta_err: meta && meta.error,
    rollup: rollup,
    runLabel: runDates.length >= CONFIG.RUNNING_DAYS
      ? ("L" + CONFIG.RUNNING_DAYS + "D")
      : ("Since launch (" + runDates.length + "d)"),
    smokeLabel: "Smoke test",
    conv: conversionStats_(data.signups, CONFIG.LAUNCH_DATE, todayStr),
    adsets: adsets,
    realLeads: realLeadsByMarket_(data.signups, runDates),
    metaSpendByMarket: (function () {
      var out = {};
      CONFIG.MARKETS.forEach(function (def) {
        var sum = 0;
        if (meta && meta.marketDate && meta.marketDate[def.key]) {
          runDates.forEach(function (d) {
            var c = meta.marketDate[def.key][d];
            if (c) sum += c.spend;
          });
        }
        out[def.key] = sum;
      });
      return out;
    })(),
    metaLeadsByMarket: (function () {
      var out = {};
      if (meta && meta.adsets) {
        Object.keys(meta.adsets).forEach(function (id) {
          var a = meta.adsets[id];
          if (a.market) out[a.market] = (out[a.market] || 0) + a.leads;
        });
      }
      return out;
    })(),
    // Unique leads, not sheet rows, so this agrees with the conversion table
    // instead of double counting anyone who submitted twice.
    totalSignups: uniqueLeads,
    newSignups: prev ? Math.max(0, uniqueLeads - prev.totalSignups) : uniqueLeads,
    dayNum: dayNum,
    spendMTD: meta && meta.totalSpend ? meta.totalSpend : 0,
    unmappedSpend: meta && meta.unmappedSpend ? meta.unmappedSpend : 0,
    budget: CONFIG.BUDGET_INR
  };
}

/** Inclusive list of yyyy-mm-dd between two dates. */
function datesBetween_(from, to) {
  var out = [], cur = from, guard = 0;
  while (cur <= to && guard < 400) { out.push(cur); cur = nextDay_(cur); guard++; }
  return out;
}

function nextDay_(yyyymmdd) {
  var d = new Date(yyyymmdd + "T00:00:00");
  d = new Date(d.getTime() + 86400000);
  return Utilities.formatDate(d, CONFIG.TIMEZONE, "yyyy-MM-dd");
}

/** Which report market an event belongs to - always one of the three clusters
 *  (na | gulf | gulf_dual). There is no rest-of-world bucket.
 *
 *  Order matters: the /gulf page and the ad CAMPAIGN are hard facts, the
 *  browser time zone is only a guess. A Gulf visitor whose phone is set to IST
 *  reports geo "other" - before campaign tagging those leads were dropped from
 *  every section (the "sheet says 11, report says 7" gap). Anything still
 *  unplaced falls back to CONFIG.UNTAGGED_MARKET, so every session lands in a
 *  section and the three sections always reconcile to the sheet. */
function marketForEvent_(page, geo, market, campaign) {
  var p = String(page || ""), g = String(geo || "").toLowerCase();
  var mk = String(market || "").toLowerCase(), c = String(campaign || "").toLowerCase();
  // 1. The page itself / an explicit market tag. Dual is settled and gone, so
  //    /gulf and /us are simply Gulf and US traffic.
  if (p.indexOf("/gulf") === 0 || mk === "gulf") return "gulf";
  if (p.indexOf("/us") === 0) return "na";
  // 2. The ad campaign that brought them (reliable; beats time zone).
  if (c) {
    if (c.indexOf("gulf") !== -1) return "gulf";
    if (c.indexOf("smoketest") !== -1) return "na";
  }
  // 3. Coarse time-zone geography.
  if (g === "gulf") return "gulf";
  if (g === "na") return "na";
  // 4. Everything else is genuinely rest-of-world (India, UK, Europe, SE Asia)
  //    or an untagged legacy session. It gets its own market rather than being
  //    folded into US, which used to flatter the US numbers.
  return "row";
}

/** Which market a SIGNUP row belongs to. Mirrors marketForEvent_ but reads the
 *  waitlist columns (page / utm_campaign / geo / phone). Kept in sync with
 *  resolveMarket_ in waitlist.gs so the sheet and the report agree. */
function resolveLeadMarket_(s) {
  var p = String(s.page || "");
  var c = String(s.utm_campaign || "").toLowerCase();
  var g = String(s.geo || "").toLowerCase();
  var ph = String(s.phone || "").replace(/[^\d]/g, "");
  if (p.indexOf("/gulf") === 0) return "gulf";
  if (p.indexOf("/us") === 0) return "na";
  if (c.indexOf("gulf") !== -1) return "gulf";
  if (c.indexOf("smoketest") !== -1) return "na";
  if (g === "gulf") return "gulf";
  if (g === "na") return "na";
  if (/^(971|974|973|966|965|968)/.test(ph)) return "gulf";
  return "row";
}

/** Real signups per market, from the waitlist sheet, de-duplicated by email and
 *  limited to the report window. This is the honest lead count - Meta's own
 *  `lead` action over-reports it by ~3x, which made the console's cost-per-lead
 *  far too flattering. */
function realLeadsByMarket_(signups, dates) {
  var inWindow = {};
  dates.forEach(function (d) { inWindow[d] = 1; });
  var seen = {}, out = {};
  signups.forEach(function (s) {
    var raw = (s.date !== "" && s.date != null) ? s.date : s.timestamp;
    var d = dateStr_(raw);
    if (!inWindow[d]) return;
    var k = leadKey_(s);
    if (!k || seen[k]) return;
    seen[k] = 1;
    var mk = resolveLeadMarket_(s);
    out[mk] = (out[mk] || 0) + 1;
  });
  return out;
}

/** The identity of a lead. Phone first - it is what the funnel collects now -
 *  falling back to email for the smoke-test rows that predate the switch.
 *  Digits only, so "+91 98…" and "919 8…" are one person, not two. */
function leadKey_(s) {
  var ph = String(s.phone || "").replace(/[^\d]/g, "");
  if (ph.length >= 8) return "p:" + ph;
  var em = String(s.email || "").trim().toLowerCase();
  return em ? "e:" + em : "";
}

/** Lead lifecycle, read from the waitlist sheet's leadStatus column (W).
 *  Matching is deliberately loose: the column is typed by hand by sales, so it
 *  is matched on a normalised substring rather than an exact string. */
var LEAD_STAGES = [
  { key: "engaged",   label: "Engaged",            match: /engaged|details\s*shared/ },
  { key: "interested", label: "Interested",        match: /interested/ },
  { key: "dropped",   label: "Dropped off",        match: /dropped|drop\s*off|lost/ },
  { key: "freeSigned", label: "Free task signed up", match: /free\s*task\s*(signed|sign|taken|started)/ },
  { key: "freeDone",  label: "Free task completed", match: /free\s*task\s*(complete|done|delivered)/ },
  { key: "paid",      label: "Converted & paid",   match: /converted|paid|subscrib/ }
];

function stageOf_(status) {
  var v = String(status || "").toLowerCase().trim();
  if (!v) return "";
  // Most specific first: "free task completed" also contains "free task".
  for (var i = LEAD_STAGES.length - 1; i >= 0; i--) {
    if (LEAD_STAGES[i].match.test(v)) return LEAD_STAGES[i].key;
  }
  return "";
}

/** The conversion table. Counts unique leads, not sheet rows. */
function conversionStats_(signups, launchDate, todayStr) {
  var seen = {}, out = {
    today: 0, sincelaunch: 0, overall: 0,
    engaged: 0, interested: 0, dropped: 0,
    freeSigned: 0, freeDone: 0, paid: 0
  };
  signups.forEach(function (s) {
    var k = leadKey_(s);
    if (!k || seen[k]) return;
    seen[k] = 1;
    var raw = (s.date !== "" && s.date != null) ? s.date : s.timestamp;
    var d = dateStr_(raw);
    // "Overall" counts every lead we can actually reach, smoke test included -
    // which is why it is keyed on phone: the email-only smoke-test rows we
    // never got a number for are not leads we can call.
    var hasPhone = String(s.phone || "").replace(/[^\d]/g, "").length >= 8;
    if (hasPhone) out.overall++;
    if (d >= launchDate) out.sincelaunch++;
    if (d === todayStr) out.today++;
    var st = stageOf_(s.leadStatus);
    if (st && out[st] !== undefined) out[st]++;
  });
  return out;
}

/** Split dual-side events into the two price arms and return the funnel for
 *  each, plus whether any arm was tagged at all (older data has none). */
function computeMarketWindow_(evts, metaAgg) {
  var expo = {}, getAcc = {}, em = {}, ph = {}, done = {}, engaged = {}, dur = {};
  var sc50 = {}, scPrice = {}, sc100 = {};
  var wa = {}, waBy = {};
  evts.forEach(function (e) {
    var sid = String(e.sid || ""), ev = String(e.event || "");
    if (ev === "exposure") expo[sid] = 1;
    else if (ev === "join_initiated") { getAcc[sid] = 1; engaged[sid] = 1; }
    else if (ev === "email_entered") em[sid] = 1;
    // Phone entered. phone_captured is the phone-first screen (Sept 2026 on);
    // phone_added and lead_captured are the older paths, still live on /us and
    // /gulf. Any of the three means we hold a number.
    else if (ev === "phone_captured" || ev === "phone_added" || ev === "lead_captured") ph[sid] = 1;
    else if (ev === "signup_completed") done[sid] = 1;
    else if (ev === "scroll_50") { sc50[sid] = 1; engaged[sid] = 1; }
    else if (ev === "reached_pricing") { scPrice[sid] = 1; engaged[sid] = 1; }
    else if (ev === "scroll_100") sc100[sid] = 1;
    else if (ev === "whatsapp_click") {
      // A visitor who asks on WhatsApp instead of joining never reaches
      // email_entered, so without counting them here they read as a bounce.
      wa[sid] = 1;
      engaged[sid] = 1;
      var pl = String(e.placement || "unknown");
      waBy[pl] = (waBy[pl] || 0) + 1;
    }
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

  var completed = Object.keys(done).length;
  var spend = metaAgg.spend, impr = metaAgg.impr, clicks = metaAgg.clicks;
  return {
    sessions: sessions, bounce: bounce, avgDurSec: avgDurSec,
    scroll50: Object.keys(sc50).length,
    reachedPricing: Object.keys(scPrice).length,
    scroll100: Object.keys(sc100).length,
    // Sessions that clicked through to WhatsApp, and the same broken down by
    // where on the page they clicked. These do NOT appear in the signup sheet,
    // so they are demand the funnel metrics cannot see.
    whatsapp: Object.keys(wa).length,
    whatsappBy: waBy,
    getAccess: Object.keys(getAcc).length,
    email: email,
    e2v: sessions ? (email / sessions * 100) : 0,
    phone: Object.keys(ph).length,
    p2v: sessions ? (Object.keys(ph).length / sessions * 100) : 0,
    completed: completed,
    spend: spend, impr: impr, clicks: clicks,
    // Cost per lead is per PHONE captured, not per email: the phone is the
    // lead now, and email is no longer collected at all.
    cpl: Object.keys(ph).length ? spend / Object.keys(ph).length : 0,
    cpm: impr ? spend / impr * 1000 : 0,
    // Link CTR. All-clicks CTR (reactions, comments, shares, post expands)
    // overstated this by roughly 1.5x through the smoke test.
    ctr: impr ? (metaAgg.linkClicks || 0) / impr * 100 : 0
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
/** Price-arm conversion cell: "9.1% (1/11)" - the e2v % with email/visitors
 *  behind it. Dash when the arm had no visitors in the window. */
/** Scroll-funnel cell: absolute count with % of sessions in muted parens, e.g.
 *  "43 (27%)". Dash when there were no sessions. */
function scrollCell_(count, sessions) {
  var c = num_(count);
  if (!sessions) return c ? String(c) : "-";
  return c + ' <span style="color:#9AA79E">(' + Math.round(c / sessions * 100) + '%)</span>';
}

/** "pricing 4 · faq 2 · footer 1", biggest first. Tells us which entry point is
 *  doing the work, and so whether the placement is worth keeping. */
function waPlacements_(by) {
  var keys = Object.keys(by || {});
  if (!keys.length) return "-";
  keys.sort(function (a, b) { return by[b] - by[a]; });
  return '<span style="color:#9AA79E">' + keys.map(function (k) {
    return k + " " + by[k];
  }).join(" · ") + "</span>";
}

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

/* =====================================================================
   ON-DEMAND: pricing-fold -> CTA-click funnel, by market and by price arm.
   Answers "of the people who actually saw the price, how many went on to
   click Get Early Access?" - which the emailed report does not break out.

   RUN IT: select pricingFoldFunnel and press Run, then read the Execution log.
   Counts unique sessions. Two conversion columns:
     click (any)  - session reached pricing AND clicked at some point
     click (after)- session clicked AFTER first seeing the price (stricter;
                    excludes people who clicked the hero CTA on the way down)
   ===================================================================== */
function pricingFoldFunnel() {
  var data = readAll_();
  var byMarket = {};

  function slot(store, key) {
    if (!store[key]) store[key] = { priced: {}, pricedAt: {}, clicked: {}, clickedAt: {}, sessions: {} };
    return store[key];
  }
  function note(s, e, ev, sid, ts) {
    s.sessions[sid] = 1;
    if (ev === "reached_pricing") {
      if (!s.pricedAt[sid] || ts < s.pricedAt[sid]) s.pricedAt[sid] = ts;
      s.priced[sid] = 1;
    } else if (ev === "join_initiated") {
      if (!s.clickedAt[sid] || ts < s.clickedAt[sid]) s.clickedAt[sid] = ts;
      s.clicked[sid] = 1;
    }
  }

  data.events.forEach(function (e) {
    var sid = String(e.sid || ""); if (!sid) return;
    var ev = String(e.event || "");
    if (ev !== "reached_pricing" && ev !== "join_initiated" && ev !== "exposure") return;
    var ts = (e.timestamp instanceof Date) ? e.timestamp.getTime() : Number(new Date(e.timestamp));
    var mk = marketForEvent_(e.page, e.geo, e.market, e.campaign);
    note(slot(byMarket, mk), e, ev, sid, ts);
  });

  function report(title, store, keys) {
    Logger.log("\n" + title);
    Logger.log(pad_("segment", 16) + pad_("sessions", 10) + pad_("reached $", 11) +
      pad_("click(any)", 12) + pad_("click(after)", 14) + "rate(after)");
    keys.forEach(function (k) {
      var s = store[k]; if (!s) { Logger.log(pad_(k, 16) + "no data"); return; }
      var sess = Object.keys(s.sessions).length;
      var priced = Object.keys(s.priced);
      var any = 0, after = 0;
      priced.forEach(function (sid) {
        if (s.clicked[sid]) {
          any++;
          if (s.clickedAt[sid] >= s.pricedAt[sid]) after++;
        }
      });
      var rate = priced.length ? (100 * after / priced.length).toFixed(1) + "%" : "-";
      Logger.log(pad_(k, 16) + pad_(sess, 10) + pad_(priced.length, 11) +
        pad_(any, 12) + pad_(after, 14) + rate);
    });
  }

  report("BY MARKET", byMarket, ["na", "gulf", "row"]);
  Logger.log("\nreached $ = unique sessions that scrolled the pricing section into view.");
  Logger.log("If 'reached $' is 0 everywhere, the scroll beacons have not reached this sheet yet.");
}
function pad_(v, n) {
  var s = String(v);
  while (s.length < n) s += " ";
  return s;
}

function renderSubject_(m) {
  // Include the run time (HH:mm). Two runs in the same hour used to produce a
  // byte-identical subject, so Gmail collapsed them into one thread and a
  // re-run looked like "no new report arrived".
  var stamp = Utilities.formatDate(m.now, CONFIG.TIMEZONE, "MMM d, HH:mm");
  var spend = m.meta_ok ? (" · " + money_(m.spendMTD) + " spend") : "";
  return CONFIG.REPORT_TITLE + " · " + stamp +
    " · " + m.conv.overall + " leads (+" + m.newSignups + ")" + spend;
}

/** The headline table: the funnel rolled up across every geography, with the
 *  running window and the smoke-test benchmark as the two right-hand columns. */
function renderRollupTable_(m) {
  var h = [], R = m.rollup;
  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push('<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:left;font:12.5px/1.4 -apple-system;color:#5b6b60">Metric</th>');
  R.cols.forEach(function (c) { h.push(th_(c.label)); });
  h.push(th_(m.runLabel, "background:#f6f4ee;color:#1a2b22"));
  h.push(th_(m.smokeLabel, "background:#eef2ef;color:#5b6b60"));
  h.push('</tr>');

  var C = R.cols.map(function (c) { return c.stat; });
  var W = R.running, S = R.smoke, ok = m.meta_ok;

  function row(label, vals, runVal, smokeVal, statusForRun) {
    var cells = labelTd_(label);
    vals.forEach(function (v) { cells += td_(v, "text-align:right;color:#3a4a40"); });
    cells += td_(statusForRun ? chip_(runVal, statusForRun) : runVal,
      "text-align:right;font-weight:600;background:#f6f4ee");
    cells += td_(smokeVal, "text-align:right;color:#5b6b60;background:#eef2ef");
    return "<tr>" + cells + "</tr>";
  }

  h.push(row("Sessions (unique visitors)",
    C.map(function (x) { return x.sessions; }), W.sessions, S.sessions));
  h.push(row("Bounce rate",
    C.map(function (x) { return pct_(x.bounce); }), pct_(W.bounce), pct_(S.bounce),
    statusOf_(W.bounce, CONFIG.GATES.bounce)));
  h.push(row("Avg session duration",
    C.map(function (x) { return dur_(x.avgDurSec); }), dur_(W.avgDurSec), dur_(S.avgDurSec)));
  h.push(row("Get beta access clicked",
    C.map(function (x) { return x.getAccess; }), W.getAccess, S.getAccess));
  h.push(row("Phone number entered",
    C.map(function (x) { return x.phone; }), W.phone, S.phone));
  h.push(row("Phone entered / visitors %",
    C.map(function (x) { return pct_(x.p2v); }), pct_(W.p2v), pct_(S.p2v),
    statusOf_(W.p2v, CONFIG.GATES.e2v)));
  h.push(row("All details submitted",
    C.map(function (x) { return x.completed; }), W.completed, S.completed));
  h.push(row("Cost per lead",
    C.map(function (x) { return ok ? money_(x.cpl) : na_(); }),
    ok ? money_(W.cpl) : na_(), ok ? money_(S.cpl) : na_(),
    ok ? statusOf_(W.cpl, CONFIG.GATES.cpl) : ""));
  h.push(row("Spend",
    C.map(function (x) { return ok ? money_(x.spend) : na_(); }),
    ok ? money_(W.spend) : na_(), ok ? money_(S.spend) : na_()));
  h.push(row("Meta CPM",
    C.map(function (x) { return ok ? money_(x.cpm) : na_(); }),
    ok ? money_(W.cpm) : na_(), ok ? money_(S.cpm) : na_()));
  h.push(row("Link CTR",
    C.map(function (x) { return ok ? pct_(x.ctr) : na_(); }),
    ok ? pct_(W.ctr) : na_(), ok ? pct_(S.ctr) : na_()));
  h.push('</table>');
  h.push('<p style="color:#5b6b60;margin:6px 0 0;font-size:12px">' +
    'Rolled up across every geography. <b>' + m.smokeLabel + '</b> is ' +
    CONFIG.SMOKE_START + " to " + CONFIG.SMOKE_END + ', the analysable smoke-test window. ' +
    'Link CTR counts link clicks only, not reactions, comments, shares or post expands.</p>');
  return h.join("");
}

/** Where the leads actually got to. Read from leadStatus (column W) in the
 *  sign-ups sheet, which sales types by hand. */
function renderConversionTable_(m) {
  var c = m.conv, h = [];
  var denom = c.overall;
  h.push('<h3 style="font-size:14px;margin:22px 0 6px">Conversion ' +
    '<span style="font-weight:400;color:#5b6b60">(from the sign-ups sheet)</span></h3>');
  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push('<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:left;font:12.5px/1.4 -apple-system;color:#5b6b60">Stage</th>');
  h.push(th_("Leads")); h.push(th_("% of reachable"));
  h.push('</tr>');

  function line(label, n, showPct, emphasis) {
    return "<tr>" + labelTd_(label) +
      td_(n, "text-align:right;font-weight:" + (emphasis ? "600" : "400")) +
      td_(showPct && denom ? pct_(n / denom * 100) : na_(), "text-align:right;color:#5b6b60") +
      "</tr>";
  }

  h.push(line("New leads today", c.today, false, true));
  h.push(line("Leads so far (POC, excl smoke test)", c.sincelaunch, false, true));
  h.push(line("Leads overall (reachable, incl smoke test)", c.overall, false, true));
  LEAD_STAGES.forEach(function (st) {
    h.push(line(st.label, c[st.key], true, st.key === "paid"));
  });
  h.push('</table>');
  h.push('<p style="color:#5b6b60;margin:6px 0 0;font-size:12px">' +
    '<b>Reachable</b> means we hold a phone number, which is what makes a lead workable; ' +
    'smoke-test rows we only ever had an email for are excluded from that denominator. ' +
    'Stages come from the leadStatus column and are only as current as sales keeps it.</p>');
  return h.join("");
}

function marketLabelFor_(key) {
  var d = defForKey_(key);
  return d ? d.label : (key || "Unmapped");
}

function renderHtml_(m) {
  var h = [];
  h.push('<div style="max-width:760px;margin:0 auto;font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#1a2b22">');
  h.push('<h2 style="font-size:18px;margin:0 0 4px">' + CONFIG.REPORT_TITLE + ' · ' +
    Utilities.formatDate(m.now, CONFIG.TIMEZONE, "EEE MMM d, HH:mm z") + '</h2>');
  h.push('<p style="color:#5b6b60;margin:0 0 16px">Day ' + m.dayNum + ' since launch ' +
    '· ' + m.conv.overall + ' leads (+' + m.newSignups + ' new) ' +
    '· spend ' + (m.meta_ok ? money_(m.spendMTD) : na_()) + '</p>');
  if (!m.meta_ok) {
    h.push('<p style="background:#FBEEC8;border:1px solid #E4C97A;border-radius:6px;padding:8px 12px;color:#7a5b12">' +
      'Meta not connected' + (m.meta_err ? ' (' + m.meta_err + ')' : '') + ' - Cost per lead / Spend / CPM / CTR show n/a. Set META_ACCESS_TOKEN (Project Settings → Script Properties, or CONFIG).</p>');
  } else if (m.unmappedSpend > 0) {
    h.push('<p style="background:#FBEEC8;border:1px solid #E4C97A;border-radius:6px;padding:8px 12px;color:#7a5b12">' +
      money_(m.unmappedSpend) + ' of spend is in ad sets that matched no market, so it is missing from the three sections above (see rows marked <b>Unmapped</b> in the console below). ' +
      'Edit CONFIG.MARKETS[].adset to match your ad-set / campaign names.</p>');
  }

  // ---- Block 1: the rolled-up funnel, then where those leads got to ----
  h.push(renderRollupTable_(m));
  h.push(renderConversionTable_(m));

  // ---- Block 4: Meta ads console (2 tables across all ad sets) ----
  h.push('<h2 style="font-size:16px;margin:30px 0 4px;padding-top:16px;border-top:2px solid #e6e2d6">Meta ads - all ad sets</h2>');

  // Table A: cost per lead
  // Cost per lead is computed from REAL signups in the sheet, not from Meta's
  // `lead` action, which over-reports by roughly 3x. Attribution is at market
  // level: a signup's campaign/page/geo places it reliably, whereas ad-set
  // level cannot be resolved (several ad sets carry the same pitch, e.g. both
  // "P3 English" and "P1 & P3 English" exist).
  h.push('<h3 style="font-size:14px;margin:14px 0 6px">Cost per lead by market <span style="font-weight:400;color:#5b6b60">(real signups)</span></h3>');
  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push('<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:left;font:12.5px/1.4 -apple-system;color:#5b6b60">Market</th>');
  h.push(th_("Spend")); h.push(th_("Real leads")); h.push(th_("Cost / lead"));
  h.push(th_("Meta claims", "color:#9AA79E")); h.push(th_("Inflation", "color:#9AA79E"));
  h.push('</tr>');
  if (m.meta_ok) {
    var tS2 = 0, tR = 0, tM = 0;
    CONFIG.MARKETS.forEach(function (def) {
      var spend = m.metaSpendByMarket[def.key] || 0;
      var real = m.realLeads[def.key] || 0;
      var mLeads = m.metaLeadsByMarket[def.key] || 0;
      tS2 += spend; tR += real; tM += mLeads;
      h.push("<tr>" + labelTd_(def.label) +
        td_(money_(spend), "text-align:right") +
        td_(real, "text-align:right") +
        td_(real ? money_(spend / real) : na_(), "text-align:right;font-weight:600") +
        td_(mLeads, "text-align:right;color:#9AA79E") +
        td_(real ? (Math.round(mLeads / real * 10) / 10) + "x" : na_(), "text-align:right;color:#9AA79E") + "</tr>");
    });
    h.push("<tr>" + labelTd_("<b>Total</b>") +
      td_(money_(tS2), "text-align:right;font-weight:600") +
      td_(tR, "text-align:right;font-weight:600") +
      td_(tR ? money_(tS2 / tR) : na_(), "text-align:right;font-weight:600;background:#f6f4ee") +
      td_(tM, "text-align:right;color:#9AA79E") +
      td_(tR ? (Math.round(tM / tR * 10) / 10) + "x" : na_(), "text-align:right;color:#9AA79E") + "</tr>");
  } else {
    h.push("<tr>" + td_(na_(), "text-align:left") + "</tr>");
  }
  h.push('</table>');
  h.push('<p style="color:#5b6b60;margin:6px 0 0;font-size:12px">Real leads = unique phone numbers in the sign-ups sheet for the window (test rows excluded). ' +
    '"Meta claims" is Meta\'s own lead count, shown only to expose how far it over-reports - never use it for cost per lead.</p>');

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
    'Funnel rows are from our own beacons. The headline table is rolled up across every geography; this table splits spend and real leads into US, Gulf and rest of world. ' +
    'Legacy/untagged sessions (logged before geo tracking, or from cached pre-update JS) are counted under ' + (marketLabelFor_(CONFIG.UNTAGGED_MARKET) || 'no market') + ' to retain history. Every session is placed in one of the three sections - by page, then ad campaign, then time zone - and anything still unplaced (India, UK, Europe, …) falls back to ' + (marketLabelFor_(CONFIG.UNTAGGED_MARKET) || 'North America') + ', so the three sections always add up to the sheet. ' +
    'Spend / CPM / CTR / Cost-per-lead are from Meta, mapped to a market by ad-set name (CONFIG.MARKETS) - the console tables show that mapping. ' +
    '"Visitors" in the second console table = Meta landing-page views. Section Cost per lead = Meta spend ÷ emails entered (from our beacons); console Cost per lead = Meta spend ÷ real signups in the sheet. Meta\'s own lead count over-reports by roughly 3x and is shown greyed, for contrast only. ' +
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
