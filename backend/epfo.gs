/**
 * Niro POC report: the EPFO campaign table (Oct 2026).
 *
 * A separate file in the same Apps Script project as report.gs. Apps Script
 * loads every file, so report.gs uses these with two one-line edits:
 *   - buildModel_ return object:  epfo: epfoStats_(data, todayStr),
 *   - renderHtml_, after the rollup:  h.push(renderEpfoTable_(m));
 *
 * Same shape as the master table: the trailing day columns, then a running
 * column from EPFO_START. Definitions match the master table so the two can
 * be read side by side: a session is an `exposure` beacon, bounce is
 * sessions with no engagement signal, leads are unique phone numbers in the
 * sign-up sheet.
 *
 * Scope: sessions and button clicks are the /pf page (and its old address,
 * /pfmoneytasks). Leads are every free EPF audit request (intent pf_audit),
 * split into /pf and the home page's EPF section. Spend is every Meta
 * campaign whose name contains EPF, EPFO or PF.
 *
 * The step-2 answers are read from taskText ("Free EPF audit: Balance: ...
 * Audit by: video call. Needs recovery help"), which the form writes on every
 * finished request, so this needs no extra sheet columns.
 *
 * Uses the report's own helpers: CONFIG, metaToken_, metaGetAll_, num_,
 * leadKey_, dateStr_, th_, td_, labelTd_, money_, pct_, dur_, na_.
 * Run epfoSelfTest() once after pasting: it checks those exist and logs the
 * table's numbers without sending an email.
 */

var EPFO = {
  START: "2026-10-24",
  // Any campaign whose name contains PF, which covers EPF and EPFO ("EPF
  // Gulf", "Niro PF test", "NiroEPFO_v2"). The founders name every EPFO
  // campaign this way; the email lists which campaigns matched, so a stray
  // match is visible.
  CAMPAIGN: /pf/i,
  PAGE: /^\/pf/  // /pf/ and the old /pfmoneytasks/
};

function epfoStats_(data, todayStr) {
  var tz = CONFIG.TIMEZONE;
  var cols = [];
  var n = CONFIG.DATE_COLS || 5;
  var today = new Date(todayStr + "T00:00:00");
  for (var i = n - 1; i >= 0; i--) {
    cols.push(Utilities.formatDate(new Date(today.getTime() - i * 86400000), tz, "yyyy-MM-dd"));
  }
  var runDates = [];
  for (var d = new Date(EPFO.START + "T00:00:00"); Utilities.formatDate(d, tz, "yyyy-MM-dd") <= todayStr; d = new Date(d.getTime() + 86400000)) {
    runDates.push(Utilities.formatDate(d, tz, "yyyy-MM-dd"));
  }

  // ---- page sessions from the events tab, bucketed by date
  var evByDate = {};
  (data.events || []).forEach(function (e) {
    var page = String(e.page || "");
    if (!EPFO.PAGE.test(page)) return;
    var raw = (e.date !== "" && e.date != null) ? e.date : e.timestamp;
    if (raw === "" || raw == null) return;
    var day = dateStr_(raw);
    (evByDate[day] = evByDate[day] || []).push(e);
  });

  // ---- leads from the sheet, one per phone, bucketed by date
  var leadByDate = {}, seen = {};
  (data.signups || []).forEach(function (s) {
    if (String(s.intent || "").trim() !== "pf_audit") return;
    var k = leadKey_(s);
    if (!k || seen[k]) return;
    seen[k] = 1;
    var raw = (s.date !== "" && s.date != null) ? s.date : s.timestamp;
    if (raw === "" || raw == null) return;
    var day = dateStr_(raw);
    (leadByDate[day] = leadByDate[day] || []).push(s);
  });

  var meta = epfoMeta_(cols.concat(runDates));

  function windowFor(dates) {
    var expo = {}, engaged = {}, dur = {}, clicked = {};
    dates.forEach(function (day) {
      (evByDate[day] || []).forEach(function (e) {
        var sid = String(e.sid || ""), ev = String(e.event || "");
        if (!sid) return;
        if (ev === "exposure") expo[sid] = 1;
        else if (ev === "pf_cta_click") { clicked[sid] = 1; engaged[sid] = 1; }
        else if (ev === "signup_step1_completed" || ev === "scroll_50" || ev === "reached_pricing") engaged[sid] = 1;
        else if (ev === "session_end") {
          if (num_(e.engaged) === 1) engaged[sid] = 1;
          var ms = num_(e.durationMs);
          if (ms > (dur[sid] || 0)) dur[sid] = ms;
        }
      });
    });
    var sessions = Object.keys(expo).length, eng = 0;
    Object.keys(expo).forEach(function (s) { if (engaged[s]) eng++; });
    var durs = Object.keys(dur).map(function (s) { return dur[s]; }).filter(function (x) { return x > 0; });

    var w = {
      sessions: sessions,
      bounce: sessions ? (1 - eng / sessions) * 100 : 0,
      avgDurSec: durs.length ? durs.reduce(function (a, b) { return a + b; }, 0) / durs.length / 1000 : 0,
      clicked: Object.keys(clicked).length,
      leads: 0, leadsPf: 0, leadsHome: 0,
      step2: 0, step2Pf: 0, whatsapp: 0, rescue: 0,
      method: { screenshots: 0, readonly: 0, video: 0 },
      spend: 0, impr: 0, linkClicks: 0
    };
    dates.forEach(function (day) {
      (leadByDate[day] || []).forEach(function (s) {
        var fromHome = String(s.page || "").trim() === "/";
        var text = String(s.taskText || "");
        var finished = /Audit by:/.test(text);
        w.leads++;
        if (fromHome) w.leadsHome++; else w.leadsPf++;
        if (finished) {
          w.step2++;
          if (!fromHome) w.step2Pf++;
          if (/Needs recovery help/.test(text)) w.rescue++;
          if (/Audit by: screenshots/.test(text)) w.method.screenshots++;
          else if (/Audit by: read-only access/.test(text)) w.method.readonly++;
          else if (/Audit by: video call/.test(text)) w.method.video++;
        }
        if (String(s.taskHandoff || "").trim() === "assistant") w.whatsapp++;
      });
      var m = meta.byDate[day];
      if (m) { w.spend += m.spend; w.impr += m.impr; w.linkClicks += m.linkClicks; }
    });
    w.leadRate = w.sessions ? w.leadsPf / w.sessions * 100 : 0;
    w.cpm = w.impr ? w.spend / w.impr * 1000 : 0;
    w.ctr = w.impr ? w.linkClicks / w.impr * 100 : 0;
    // Spend buys /pf traffic, so cost per lead is over /pf leads only.
    w.cpl = w.leadsPf ? w.spend / w.leadsPf : 0;
    w.cpFinished = w.step2Pf ? w.spend / w.step2Pf : 0;
    return w;
  }

  return {
    cols: cols.map(function (day) {
      return { label: Utilities.formatDate(new Date(day + "T00:00:00"), tz, "MMM d"), w: windowFor([day]) };
    }),
    run: windowFor(runDates),
    runLabel: "Since launch (" + runDates.length + "d)",
    metaOk: meta.ok,
    metaErr: meta.error,
    campaigns: meta.campaigns
  };
}

/** Spend, impressions and link clicks for EPF campaigns, by day. */
function epfoMeta_(dates) {
  var out = { ok: false, byDate: {}, campaigns: [] };
  if (!metaToken_() || !CONFIG.META_AD_ACCOUNT_ID) return out;
  try {
    var sorted = dates.slice().sort();
    var range = encodeURIComponent(JSON.stringify({ since: sorted[0], until: sorted[sorted.length - 1] }));
    var url = "https://graph.facebook.com/" + CONFIG.META_API_VERSION + "/" + CONFIG.META_AD_ACCOUNT_ID +
      "/insights?level=campaign&time_increment=1&time_range=" + range +
      "&fields=campaign_name,spend,impressions,inline_link_clicks&limit=500";
    var names = {};
    metaGetAll_(url).forEach(function (r) {
      var name = String(r.campaign_name || "");
      if (!EPFO.CAMPAIGN.test(name)) return;
      names[name] = 1;
      var c = out.byDate[r.date_start] = out.byDate[r.date_start] || { spend: 0, impr: 0, linkClicks: 0 };
      c.spend += num_(r.spend); c.impr += num_(r.impressions); c.linkClicks += num_(r.inline_link_clicks);
    });
    out.campaigns = Object.keys(names);
    out.ok = true;
  } catch (err) {
    out.error = String(err);
  }
  return out;
}

function renderEpfoTable_(m) {
  var t = m.epfo, h = [];
  if (!t) return "";
  var muted = "color:#5b6b60";
  h.push('<h3 style="font-size:14px;margin:22px 0 6px">EPFO campaign ' +
    '<span style="font-weight:400;' + muted + '">(free EPF audit, since ' + EPFO.START + ')</span></h3>');
  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push(th_("Metric", "text-align:left"));
  t.cols.forEach(function (c) { h.push(th_(c.label)); });
  h.push(th_(t.runLabel, "background:#f6f4ee"));
  h.push('</tr>');

  var all = t.cols.map(function (c) { return c.w; }).concat([t.run]);
  function row(label, fmt, bold) {
    var cells = all.map(function (w, i) {
      var last = i === all.length - 1;
      return td_(fmt(w), "text-align:right;" + (bold ? "font-weight:600;" : "") + (last ? "background:#f6f4ee;" : ""));
    });
    return "<tr>" + labelTd_(label) + cells.join("") + "</tr>";
  }
  var sub = function (s) { return "&nbsp;&nbsp;↳ " + s; };
  var money = function (v) { return t.metaOk ? money_(v) : na_(); };
  var ratio = function (n, d) { return d ? pct_(n / d * 100) : "-"; };

  h.push(row("Sessions on /pf (unique visitors)", function (w) { return w.sessions; }, true));
  h.push(row("Bounce rate", function (w) { return w.sessions ? pct_(w.bounce) : "-"; }));
  h.push(row("Avg session duration", function (w) { return dur_(w.avgDurSec); }));
  h.push(row("Audit button clicked", function (w) { return w.clicked; }));
  h.push(row("EPF audit leads (step 1)", function (w) { return w.leads; }, true));
  h.push(row(sub("from /pf"), function (w) { return w.leadsPf; }));
  h.push(row(sub("from the home EPF section"), function (w) { return w.leadsHome; }));
  h.push(row("Lead rate (/pf leads / sessions)", function (w) { return ratio(w.leadsPf, w.sessions); }, true));
  h.push(row("Finished the form (step 2)", function (w) { return w.step2; }, true));
  h.push(row(sub("step 1 to 2"), function (w) { return ratio(w.step2, w.leads); }));
  h.push(row("Opened WhatsApp", function (w) { return w.whatsapp; }));
  h.push(row("Needs recovery help", function (w) { return w.step2 ? w.rescue + ' <span style="' + muted + '">(' + pct_(w.rescue / w.step2 * 100) + ")</span>" : "-"; }));
  h.push(row("Audit by: screenshots", function (w) { return w.method.screenshots; }));
  h.push(row("Audit by: read-only access", function (w) { return w.method.readonly; }));
  h.push(row("Audit by: video call", function (w) { return w.method.video; }));
  h.push(row("Spend (EPF campaigns)", function (w) { return money(w.spend); }));
  h.push(row("Meta CPM", function (w) { return t.metaOk ? money_(w.cpm) : na_(); }));
  h.push(row("Link CTR", function (w) { return t.metaOk ? pct_(w.ctr) : na_(); }));
  h.push(row("Cost per lead (/pf)", function (w) { return t.metaOk && w.leadsPf ? money_(w.cpl) : na_(); }, true));
  h.push(row("Cost per finished form (/pf)", function (w) { return t.metaOk && w.step2Pf ? money_(w.cpFinished) : na_(); }));
  h.push('</table>');

  var notes = [];
  notes.push("Sessions, bounce and duration count /pf (and the old /pfmoneytasks) the same way the master table does. " +
    "Leads are unique phone numbers in the sign-up sheet with intent pf_audit; " +
    "'from the home EPF section' is the pop-up on tellniro.com. Finished, WhatsApp, recovery help and audit method are read from taskText and taskHandoff. " +
    "Cost per lead uses /pf leads only, since EPF spend buys /pf traffic.");
  if (t.metaOk) {
    notes.push(t.campaigns.length
      ? "Spend from: " + t.campaigns.map(function (c) { return String(c).replace(/</g, "&lt;"); }).join(", ") + "."
      : "<b>No Meta campaign with EPF or PF in its name has spend in this window.</b>");
  } else {
    notes.push("Meta spend unavailable" + (t.metaErr ? " (" + String(t.metaErr).replace(/</g, "&lt;") + ")" : "") + ".");
  }
  h.push('<p style="' + muted + ';margin:6px 0 0;font-size:12px">' + notes.join(" ") + "</p>");
  return h.join("");
}

/** Run once from the editor after pasting: checks the helpers this file
 *  uses exist in the live script, then logs the table's numbers. Sends no
 *  email and writes nothing. */
function epfoSelfTest() {
  var need = ["metaToken_", "metaGetAll_", "num_", "leadKey_", "dateStr_", "th_", "td_", "labelTd_", "money_", "pct_", "dur_", "na_", "readAll_"];
  var missing = need.filter(function (f) { return typeof globalThis[f] !== "function"; });
  if (missing.length) { Logger.log("MISSING helpers: " + missing.join(", ") + ". Tell Claude which ones."); return; }
  var todayStr = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd");
  var t = epfoStats_(readAll_(), todayStr);
  Logger.log("Meta ok: " + t.metaOk + (t.metaErr ? " (" + t.metaErr + ")" : "") + " | EPF campaigns: " + (t.campaigns.join(", ") || "none yet"));
  t.cols.concat([{ label: t.runLabel, w: t.run }]).forEach(function (c) {
    var w = c.w;
    Logger.log(c.label + ": sessions " + w.sessions + ", clicks " + w.clicked + ", leads " + w.leads +
      " (/pf " + w.leadsPf + ", home " + w.leadsHome + "), finished " + w.step2 + ", WhatsApp " + w.whatsapp +
      ", spend " + Math.round(w.spend));
  });
  Logger.log("Self-test OK. renderEpfoTable_ is ready to add to renderHtml_.");
}
