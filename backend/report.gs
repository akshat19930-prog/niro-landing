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
  // Bump on every paste. The report prints this, so "which version is actually
  // deployed" is answerable from the email instead of by guesswork.
  BUILD: "2026-10-05a",

  // Launch. The running window starts here, so the report never mixes POC
  // numbers with smoke-test numbers in one column.
  LAUNCH_DATE: "2026-09-25",
  // The day the first-task flow replaced the categories question on the last
  // step of the join form. Before this date no row can carry a taskHandoff, so
  // folding that history in would drag the rate toward zero for reasons that
  // have nothing to do with how the flow performs.
  TRIAL_START: "2026-10-05",
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

  // ---- Positioning A/B (Oct 2026): arm A is tellniro.com, arm B2 is /start.
  // Spend is attributed to an arm by CAMPAIGN NAME, so these must match what
  // the campaigns are actually called in Ads Manager. Everything that matches
  // neither is left out of the comparison rather than guessed at.
  ARM_CAMPAIGN: {
    A:  /pos[_\s-]*test[_\s-]*a\b/i,
    B2: /pos[_\s-]*test[_\s-]*b/i
  },
  // The answer to "How do you see yourself using Niro?" that counts as CWP:
  // the family using Niro directly, rather than the member relaying for them.
  CWP_ANSWER: /using\s+niro\s+directly/i,

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
    // Positioning A/B spend, keyed off the campaign name.
    var armSpend = { A: 0, B2: 0, unmatched: 0 };

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

      if (CONFIG.ARM_CAMPAIGN.A.test(campaign)) armSpend.A += spend;
      else if (CONFIG.ARM_CAMPAIGN.B2.test(campaign)) armSpend.B2 += spend;
      else armSpend.unmatched += spend;
    });
    return { adsets: adsets, marketDate: marketDate, totalSpend: totalSpend,
             unmappedSpend: unmappedSpend, armSpend: armSpend };
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

  // Row counts as READ, before any filter. When a number in this report looks
  // wrong, the first question is always whether the data arrived at all, and
  // this is the cheapest way to answer it.
  var rawSignupRows = data.signups.length, rawEventRows = data.events.length;
  var rowsWithPhone = 0;
  data.signups.forEach(function (s) {
    if (String(s.phone || "").replace(/[^\d]/g, "").length >= 8) rowsWithPhone++;
  });

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

  /**
   * The rolled-up funnel for a set of dates.
   *
   * Sessions, bounce and the modal-open step come from the beacons, because
   * only the beacons see people who never submitted. Everything from the phone
   * onwards comes from the SHEET, so the funnel's lead count, the conversion
   * table and cost per lead are all the same number.
   */
  function rollupFor(dates) {
    var evs = [];
    dates.forEach(function (d) { if (evByDate[d]) evs = evs.concat(evByDate[d]); });
    var st = computeMarketWindow_(evs, metaForDates(dates));
    var sheet = sheetCounts_(data.signups, dates);
    st.phoneSessions = st.phone;          // kept for the diagnostic row
    st.phone = sheet.leads;
    st.completed = sheet.complete;
    st.p2v = st.sessions ? (sheet.leads / st.sessions * 100) : 0;
    st.cpl = sheet.leads ? st.spend / sheet.leads : 0;
    return st;
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
    trial: trialStats_(data.signups, runDates, todayStr),
    arms: armStats_(data.signups, data.events, meta),
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
    diag: {
      signupRows: rawSignupRows,
      eventRows: rawEventRows,
      rowsWithPhone: rowsWithPhone,
      afterFilter: data.signups.length,
      uniqueLeads: uniqueLeads
    },
    totalSignups: uniqueLeads,
    newSignups: prev ? Math.max(0, uniqueLeads - prev.totalSignups) : uniqueLeads,
    dayNum: dayNum,
    spendMTD: meta && meta.totalSpend ? meta.totalSpend : 0,
    unmappedSpend: meta && meta.unmappedSpend ? meta.unmappedSpend : 0,
    budget: CONFIG.BUDGET_INR
  };
}

/**
 * Unique leads in a window, straight from the sign-ups sheet.
 *
 * This is what "a lead" means everywhere else in the business: one row per
 * person, keyed on phone. The event beacons cannot answer this, because a
 * beacon is keyed on `sid`, `sid` lives in sessionStorage, and sessionStorage
 * is PER TAB. One person in two tabs is two sessions and one lead. Counting
 * the funnel step from events made "Phone number entered" read 4 against 1
 * real lead.
 */
function sheetCounts_(signups, dates) {
  var inWindow = {};
  dates.forEach(function (d) { inWindow[d] = 1; });
  var seen = {}, leads = 0, complete = 0;
  signups.forEach(function (s) {
    var raw = (s.date !== "" && s.date != null) ? s.date : s.timestamp;
    if (!inWindow[dateStr_(raw)]) return;
    var k = leadKey_(s);
    if (!k || seen[k]) return;
    seen[k] = 1;
    leads++;
    // "All details submitted" = we got past the phone screen to name + city.
    if (String(s.name || "").trim() && String(s.city || "").trim()) complete++;
  });
  return { leads: leads, complete: complete };
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

/* =====================================================================
   POSITIONING A/B: arm A (/) vs arm B2 (/start), since the test began.
   -----------------------------------------------------------------------
   Arm B2 sells Niro as the NRI's own 1:1 assistant, so they can start
   without asking their parents for sign-off. Arm A is the family-group
   pitch. Price, offer and scope are identical, so anything that differs
   below is the positioning and not the product.

   Rows are counted ONLY where lpVariant is explicitly "A" or "B2". Blank
   means the row predates the test, and folding that history into arm A
   would bury the comparison under months of traffic the test never ran.
   ===================================================================== */
function armStats_(signups, events, meta) {
  var ARMS = ["A", "B2"];
  var out = {};
  ARMS.forEach(function (a) {
    out[a] = {
      sessions: 0, bounce: 0, leads: 0, cpl: 0, spend: 0,
      phoneSessions: 0, p2v: 0, serviceable: 0,
      cwp: 0, cwpPct: 0, cwpDropped: 0, cwpDropPct: 0, answered: 0,
      freeSigned: 0, freeTrialPct: 0, paid: 0, subPct: 0
    };
  });

  // ---- sessions and bounce, from the events tab
  var expo = { A: {}, B2: {} }, engaged = { A: {}, B2: {} }, phone = { A: {}, B2: {} };
  (events || []).forEach(function (e) {
    var arm = String(e.lpVariant || "").trim();
    if (arm !== "A" && arm !== "B2") return;
    var sid = String(e.sid || ""), ev = String(e.event || "");
    if (!sid) return;
    if (ev === "exposure") expo[arm][sid] = 1;
    // Same engagement rule as the market funnel above, so the two bounce
    // numbers in this email mean the same thing.
    else if (ev === "join_initiated" || ev === "scroll_50" ||
             ev === "reached_pricing" || ev === "whatsapp_click") engaged[arm][sid] = 1;
    else if (ev === "phone_captured" || ev === "phone_added" || ev === "lead_captured") {
      phone[arm][sid] = 1;
      engaged[arm][sid] = 1;
    }
    else if (ev === "session_end" && num_(e.engaged) === 1) engaged[arm][sid] = 1;
  });
  ARMS.forEach(function (a) {
    var o = out[a];
    o.sessions = Object.keys(expo[a]).length;
    var eng = 0;
    Object.keys(expo[a]).forEach(function (sid) { if (engaged[a][sid]) eng++; });
    o.bounce = o.sessions ? (1 - eng / o.sessions) * 100 : 0;
    o.phoneSessions = Object.keys(phone[a]).length;
    o.p2v = o.sessions ? (o.phoneSessions / o.sessions * 100) : 0;
  });

  // ---- leads and everything read off the lead row
  var seen = {};
  (signups || []).forEach(function (sg) {
    var arm = String(sg.lpVariant || "").trim();
    if (arm !== "A" && arm !== "B2") return;
    var k = leadKey_(sg);
    if (!k || seen[k]) return;
    seen[k] = 1;
    // A lead is someone we can actually contact, which means a phone number.
    if (String(sg.phone || "").replace(/[^\d]/g, "").length < 8) return;
    var o = out[arm];
    o.leads++;
    // Serviceable: cityServed carries the canonical launch city when we cover
    // the family's city, and is blank when we do not.
    if (String(sg.cityServed || "").trim()) o.serviceable++;
    // CWP: they expect the family to use Niro directly, rather than relaying
    // through them. The segment arm B2 is trying to grow.
    var who = String(sg.whoFor || "").trim();
    if (who) o.answered++;
    var isCwp = who && CONFIG.CWP_ANSWER.test(who);
    if (isCwp) o.cwp++;
    var st = stageOf_(sg.leadStatus);
    if (isCwp && st === "dropped") o.cwpDropped++;
    if (st === "freeSigned" || st === "freeDone" || st === "paid") o.freeSigned++;
    if (st === "paid") o.paid++;
  });

  var armSpend = (meta && meta.armSpend) || { A: 0, B2: 0, unmatched: 0 };
  ARMS.forEach(function (a) {
    var o = out[a];
    o.spend = armSpend[a] || 0;
    o.cpl = o.leads ? o.spend / o.leads : 0;
    o.cwpPct = o.answered ? (o.cwp / o.answered * 100) : 0;
    o.cwpDropPct = o.cwp ? (o.cwpDropped / o.cwp * 100) : 0;
    // Free trial counts anyone who got at least as far as signing up for the
    // free task, so a lead who has already paid is not missing from it.
    o.freeTrialPct = o.leads ? (o.freeSigned / o.leads * 100) : 0;
    o.subPct = o.leads ? (o.paid / o.leads * 100) : 0;
  });
  out.unmatchedSpend = armSpend.unmatched || 0;
  return out;
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



/* =====================================================================
   FREE FIRST TASK: did the lead start one, on the day they signed up?
   -----------------------------------------------------------------------
   The headline number here is "task started", read from the taskHandoff
   column, which the page writes at the moment the lead taps through to
   WhatsApp. That makes it automatic, and same-session for everyone except
   a visitor who comes back on a later day and enriches their own row - so
   it reads as a day-0 rate in practice without anyone having to maintain
   it by hand.

   It deliberately does NOT use leadStatus for this. leadStatus is the
   right column for where a lead ENDED UP, but it carries no timestamp:
   the sheet records that a lead is "engaged", never when they became so.
   A true 24-hour rate cannot be computed from it, and a rate that silently
   means "at some point since" would be worse than not having one.
   So leadStatus gets its own row below, honestly labelled.

   The gap between "named a task" and "started one" is the useful list:
   those leads told us what they wanted and then did not press send.
   ===================================================================== */
function trialStats_(signups, runDates, todayStr) {
  var w = { today: blankTrial_(), run: blankTrial_(), since: blankTrial_() };
  var inRun = {};
  runDates.forEach(function (d) { inRun[d] = 1; });
  var byTask = {}, seen = {};

  signups.forEach(function (s) {
    var k = leadKey_(s);
    if (!k || seen[k]) return;
    seen[k] = 1;
    var raw = (s.date !== "" && s.date != null) ? s.date : s.timestamp;
    var d = dateStr_(raw);
    if (d < CONFIG.TRIAL_START) return;

    var handoff = String(s.taskHandoff || "").trim().toLowerCase();
    var label = String(s.tasks || "").trim();
    var text = String(s.taskText || "").trim();
    var named = !!(label || text);
    var st = stageOf_(s.leadStatus);

    var buckets = [w.since];
    if (inRun[d]) buckets.push(w.run);
    if (d === todayStr) buckets.push(w.today);

    buckets.forEach(function (b) {
      b.leads++;
      if (handoff === "assistant") { b.started++; b.assistant++; }
      else if (handoff === "membership") { b.started++; b.membership++; }
      else if (named) b.namedOnly++;
      else b.silent++;
      // Anything past first contact. stageOf_ returns "" for both a blank
      // status and a bare "contacted", since neither is a LEAD_STAGES match,
      // so a truthy stage IS the "anything except contacted" test. Note that
      // "dropped off" counts here: they did reply before going cold.
      if (st) b.beyondContact++;
    });

    if (label) byTask[label] = (byTask[label] || 0) + 1;
    else if (text) byTask["(their own words)"] = (byTask["(their own words)"] || 0) + 1;
  });

  var top = Object.keys(byTask).map(function (t) {
    return { label: t, n: byTask[t] };
  }).sort(function (a, b) { return b.n - a.n; });

  return { today: w.today, run: w.run, since: w.since, top: top };
}

function blankTrial_() {
  return {
    leads: 0, started: 0, assistant: 0, membership: 0,
    namedOnly: 0, silent: 0, beyondContact: 0
  };
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
  h.push(row("&#8627; sessions that submitted a phone",
    C.map(function (x) { return x.phoneSessions; }), W.phoneSessions, S.phoneSessions));
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
    'Link CTR counts link clicks only, not reactions, comments, shares or post expands.<br>' +
    '<b>Phone number entered</b> counts unique leads in the sign-ups sheet, so it reconciles ' +
    'with the conversion table and with cost per lead. The indented row below it counts ' +
    'browser sessions that submitted a phone, which is always higher: a session is one tab, ' +
    'so the same person in two tabs, or testing the form twice, is two sessions and one lead.</p>');
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


/** Free first task: the day-0 rate, and the gap between naming a task and
 *  actually sending it. Three windows, because a daily number on 8-10 leads
 *  is noisy enough that the running total has to sit next to it. */
function renderTrialTable_(m) {
  var t = m.trial, h = [];
  h.push('<h3 style="font-size:14px;margin:22px 0 6px">Free first task ' +
    '<span style="font-weight:400;color:#5b6b60">(since ' + CONFIG.TRIAL_START + ')</span></h3>');

  if (!t.since.leads) {
    h.push('<p style="color:#5b6b60;margin:0;font-size:12.5px">' +
      'No leads yet since the first-task flow went live.</p>');
    return h.join("");
  }

  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push('<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:left;font:12.5px/1.4 -apple-system;color:#5b6b60"></th>');
  h.push(th_("Today")); h.push(th_(m.runLabel)); h.push(th_("Since live"));
  h.push('</tr>');

  function row(label, pick, asPct, emphasis) {
    var cells = ["today", "run", "since"].map(function (k) {
      var w = t[k], n = pick(w);
      if (!asPct) return td_(n, "text-align:right;font-weight:" + (emphasis ? "600" : "400"));
      if (!w.leads) return na_dash_();
      return td_(n + ' <span style="color:#5b6b60">(' + pct_(n / w.leads * 100) + ')</span>',
        "text-align:right;font-weight:" + (emphasis ? "600" : "400"));
    });
    return "<tr>" + labelTd_(label) + cells.join("") + "</tr>";
  }

  h.push(row("Leads", function (w) { return w.leads; }, false, true));
  h.push(row("Task started", function (w) { return w.started; }, true, true));
  h.push(row("&nbsp;&nbsp;to the assistant", function (w) { return w.assistant; }, true));
  h.push(row("&nbsp;&nbsp;to sales (membership)", function (w) { return w.membership; }, true));
  h.push(row("Named a task, never sent it", function (w) { return w.namedOnly; }, true));
  h.push(row("Left without naming one", function (w) { return w.silent; }, true));
  h.push(row("Past first contact (leadStatus)", function (w) { return w.beyondContact; }, true));
  h.push('</table>');

  h.push('<p style="color:#5b6b60;margin:6px 0 0;font-size:12px">' +
    '<b>Task started</b> is written by the page the moment a lead taps through to WhatsApp, ' +
    'so it needs nobody to maintain it and is same-session for everyone except a visitor who ' +
    'returns on a later day: read it as the day-0 rate. ' +
    '<b>Named a task, never sent it</b> is the follow-up list worth working: they told us what ' +
    'they wanted and then stopped. ' +
    '<b>Past first contact</b> comes from leadStatus, which carries no timestamp, so it is ' +
    '"at some point since", not within 24 hours.</p>');

  if (t.top.length) {
    h.push('<p style="margin:10px 0 4px;font-size:12.5px;color:#5b6b60"><b>Most asked for</b></p>');
    h.push('<table style="border-collapse:collapse;width:100%">');
    t.top.slice(0, 8).forEach(function (x) {
      h.push("<tr>" + labelTd_(esc_(x.label)) +
        td_(x.n, "text-align:right") +
        td_(pct_(x.n / t.since.leads * 100), "text-align:right;color:#5b6b60") + "</tr>");
    });
    h.push('</table>');
  }
  return h.join("");
}

/** A "no data" cell for the trial table's percentage columns. */
function na_dash_() { return td_(na_(), "text-align:right"); }

/** The task label is a sheet value, and sales can edit that column by hand, so
 *  it is escaped before it goes into the email's HTML. Every other value in
 *  this report is a number or a string we generated. */
function esc_(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Arm A vs arm B2, since the positioning test began. Till-date, not windowed:
 *  the test needs a cumulative read, and the stages below move slowly. */
function renderArmTable_(m) {
  var a = m.arms.A, b = m.arms.B2, h = [];
  var live = a.sessions + b.sessions > 0;

  h.push('<h2 style="font-size:16px;margin:30px 0 4px;padding-top:16px;' +
    'border-top:2px solid #e6e2d6">Positioning A/B ' +
    '<span style="font-weight:400;color:#5b6b60">(till date)</span></h2>');
  h.push('<p style="color:#5b6b60;margin:0 0 10px;font-size:12.5px">' +
    '<b>A</b> = tellniro.com, the family-group pitch. ' +
    '<b>B2</b> = tellniro.com/start, Niro as your own 1:1 assistant. ' +
    'Same price, same offer, same scope.</p>');

  if (!live) {
    h.push('<p style="background:#FBEEC8;border:1px solid #E4C97A;border-radius:6px;' +
      'padding:8px 12px;color:#7a5b12">No tagged traffic yet. Rows only count once ' +
      'lpVariant is set, which starts with the first visit after the arms went live.</p>');
    return h.join("");
  }

  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push('<th style="padding:6px 9px;border-bottom:2px solid #ddd;text-align:left;' +
    'font:12.5px/1.4 -apple-system;color:#5b6b60">Metric</th>');
  h.push(th_("A &middot; control"));
  h.push(th_("B2 &middot; /start", "background:#f6f4ee;color:#1a2b22"));
  h.push(th_("Diff", "color:#5b6b60"));
  h.push('</tr>');

  // `better` says which direction is good, so the diff is coloured honestly:
  // 1 = higher is better, -1 = lower is better, 0 = no judgement.
  function row(label, av, bv, fmt, better, rawA, rawB) {
    var diff = "";
    if (better !== 0 && rawA != null && rawB != null) {
      var d = rawB - rawA;
      if (Math.abs(d) > 0.0001) {
        var good = (better > 0) ? (d > 0) : (d < 0);
        // Sign outside the formatter, so money reads "-$100" and not "$-100".
        var sign = d > 0 ? "+" : "-";
        diff = '<span style="color:' + (good ? "#1f7a4d" : "#b4432c") + '">' +
          sign + fmt(Math.abs(d)) + "</span>";
      } else {
        diff = '<span style="color:#9AA79E">same</span>';
      }
    }
    return "<tr>" + labelTd_(label) +
      td_(av, "text-align:right;color:#3a4a40") +
      td_(bv, "text-align:right;font-weight:600;background:#f6f4ee") +
      td_(diff || na_(), "text-align:right;font-size:12px") + "</tr>";
  }
  function n_(x) { return String(Math.round(x)); }
  function p_(x) { return pct_(x); }

  h.push(row("Sessions", a.sessions, b.sessions, n_, 1, a.sessions, b.sessions));
  h.push(row("Bounce rate", pct_(a.bounce), pct_(b.bounce), p_, -1, a.bounce, b.bounce));
  h.push(row("Leads", a.leads, b.leads, n_, 1, a.leads, b.leads));
  h.push(row("Cost per lead",
    a.cpl ? money_(a.cpl) : na_(), b.cpl ? money_(b.cpl) : na_(),
    money_, -1,
    (a.cpl && b.cpl) ? a.cpl : null, (a.cpl && b.cpl) ? b.cpl : null));
  h.push(row("Phone entered / visitors %", pct_(a.p2v), pct_(b.p2v), p_, 1, a.p2v, b.p2v));
  h.push(row("Serviceable leads", a.serviceable, b.serviceable, n_, 1, a.serviceable, b.serviceable));
  h.push(row("% CWP", pct_(a.cwpPct), pct_(b.cwpPct), p_, 1, a.cwpPct, b.cwpPct));
  h.push(row("&#8627; % CWP drop-offs", pct_(a.cwpDropPct), pct_(b.cwpDropPct), p_, -1,
    a.cwpDropPct, b.cwpDropPct));
  h.push(row("Lead to free trial %", pct_(a.freeTrialPct), pct_(b.freeTrialPct), p_, 1,
    a.freeTrialPct, b.freeTrialPct));
  h.push(row("Lead to subscription %", pct_(a.subPct), pct_(b.subPct), p_, 1, a.subPct, b.subPct));
  h.push('</table>');

  var notes = [];
  notes.push('<b>CWP</b> is the share of leads who answered "How do you see yourself ' +
    'using Niro?" with the family using Niro directly, out of those who answered at ' +
    'all (A ' + a.cwp + '/' + a.answered + ', B2 ' + b.cwp + '/' + b.answered + '). ' +
    'Its drop-off line is how many of that group sales then lost.');
  notes.push('<b>Serviceable</b> means we cover the family\'s city.');
  notes.push('<b>Leads</b> counts unique people we hold a phone number for, so it ' +
    'agrees with the conversion table above.');
  notes.push('Free trial and subscription come from the leadStatus column, so they ' +
    'are only as current as sales keeps it.');
  if (m.arms.unmatchedSpend > 0) {
    notes.push('<b style="color:#b4432c">' + money_(m.arms.unmatchedSpend) + ' of spend ' +
      'matched neither arm</b> and is excluded from cost per lead. Check the campaign ' +
      'names against CONFIG.ARM_CAMPAIGN.');
  }
  notes.push('Rows count only where lpVariant is set, so traffic from before the test ' +
    'is not folded into arm A.');
  h.push('<p style="color:#5b6b60;margin:6px 0 0;font-size:12px">' + notes.join(" ") + '</p>');
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
  h.push(renderTrialTable_(m));
  h.push(renderConversionTable_(m));
  h.push(renderArmTable_(m));

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
  // ---- data provenance, so a wrong number can be diagnosed from the email ----
  var d = m.diag;
  h.push('<p style="margin:26px 0 0;padding-top:12px;border-top:1px solid #e6e2d6;' +
    'color:#8b978f;font-size:11.5px">Build <b>' + CONFIG.BUILD + '</b> ' + '\u00b7' + ' read ' +
    d.signupRows + ' waitlist rows and ' + d.eventRows + ' event rows ' + '\u00b7' + ' ' +
    d.rowsWithPhone + ' rows carry a phone ' + '\u00b7' + ' ' + d.afterFilter +
    ' kept after filtering ' + '\u00b7' + ' ' + d.uniqueLeads + ' unique leads ' + '\u00b7' + ' window ' +
    CONFIG.LAUNCH_DATE + ' onwards.' +
    (d.signupRows === 0 ? ' <b style="color:#C0392B">The waitlist tab read as EMPTY, which is a wiring fault, not a lead drought.</b>' : '') +
    '</p>');
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
