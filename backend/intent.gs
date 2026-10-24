/**
 * Niro POC report: what leads ask for, last 7 days.
 *
 * A separate file in the same Apps Script project as report.gs. Apps Script
 * loads every file, so these functions are visible to report.gs without an
 * import. report.gs uses them in two places:
 *   - buildModel_ return object:  intent: intentStats_(data.signups, todayStr),
 *   - renderHtml_, after the rollup table:  h.push(renderIntentTable_(m));
 *
 * Two questions, both from the sign-ups sheet (one count per lead, keyed on
 * phone like every other table in the report):
 *   1. The routing question on the join form ("I want to understand how Niro
 *      works" and its three siblings), read from the `intent` column. The ids
 *      and labels are INTENT_OPTIONS in lib/content.ts.
 *   2. Which first-task option was picked from the drop-down, read from the
 *      `tasks` column (the label), with typed-in tasks (`taskText` only)
 *      grouped as "In their own words".
 *
 * Last 7 days = today and the six days before it, in CONFIG.TIMEZONE. The
 * previous 7 days sit beside it so a move up or down is visible, and the
 * per-day figure is the 7-day count divided by 7.
 *
 * Uses the report's own helpers: leadKey_, dateStr_, th_, td_, labelTd_,
 * esc_, pct_.
 */

/** INTENT_OPTIONS in lib/content.ts, in the order the form shows them. */
var INTENT_LABELS = [
  { id: "how", label: "I want to understand how Niro works" },
  { id: "pricing", label: "I want to understand pricing and plans" },
  { id: "membership", label: "I'm ready to start a membership" },
  { id: "task", label: "I have something specific that needs doing" }
];

function intentStats_(signups, todayStr) {
  var today = new Date(todayStr + "T00:00:00");
  function daysAgo(n) {
    return Utilities.formatDate(new Date(today.getTime() - n * 86400000), CONFIG.TIMEZONE, "yyyy-MM-dd");
  }
  var curFrom = daysAgo(6), prevFrom = daysAgo(13), prevTo = daysAgo(7);

  var out = {
    from: curFrom, to: todayStr,
    intent: { cur: {}, prev: {}, curTotal: 0, prevTotal: 0 },
    tasks: { cur: {}, prev: {}, curTotal: 0, prevTotal: 0 }
  };
  INTENT_LABELS.forEach(function (o) { out.intent.cur[o.id] = 0; out.intent.prev[o.id] = 0; });

  var seen = {};
  signups.forEach(function (s) {
    var k = leadKey_(s);
    if (!k || seen[k]) return;
    var raw = (s.date !== "" && s.date != null) ? s.date : s.timestamp;
    if (raw === "" || raw == null) return;
    var d = dateStr_(raw);
    var win = (d >= curFrom && d <= todayStr) ? "cur" : (d >= prevFrom && d <= prevTo) ? "prev" : "";
    if (!win) return;
    seen[k] = 1;

    // Only the four routing answers count. The column also carries other
    // values (pf_audit from /pf, older channel tags), and those
    // leads never saw this question.
    var intent = String(s.intent || "").trim().toLowerCase();
    if (out.intent[win].hasOwnProperty(intent)) {
      out.intent[win][intent]++;
      out.intent[win + "Total"]++;
    }

    var label = String(s.tasks || "").trim();
    var text = String(s.taskText || "").trim();
    var key = label || (text ? "In their own words" : "");
    if (key) {
      out.tasks[win][key] = (out.tasks[win][key] || 0) + 1;
      out.tasks[win + "Total"]++;
    }
  });
  return out;
}

function renderIntentTable_(m) {
  var t = m.intent, h = [];
  if (!t) return "";
  var muted = "color:#5b6b60";
  function perDay(n) { return Math.round(n / 7 * 10) / 10; }

  h.push('<h3 style="font-size:14px;margin:22px 0 6px">What leads ask for ' +
    '<span style="font-weight:400;' + muted + '">(last 7 days, ' + t.from + ' to ' + t.to + ')</span></h3>');

  // ---- 1. the routing question ----
  h.push('<table style="border-collapse:collapse;width:100%"><tr>');
  h.push(th_("Join form answer", "text-align:left"));
  h.push(th_("Last 7 days")); h.push(th_("Per day")); h.push(th_("Share"));
  h.push(th_("Previous 7 days", muted));
  h.push('</tr>');
  INTENT_LABELS.forEach(function (o) {
    var n = t.intent.cur[o.id], p = t.intent.prev[o.id];
    h.push("<tr>" + labelTd_(esc_(o.label)) +
      td_(n, "text-align:right;font-weight:600") +
      td_(perDay(n), "text-align:right") +
      td_(t.intent.curTotal ? pct_(n / t.intent.curTotal * 100) : "-", "text-align:right;" + muted) +
      td_(p, "text-align:right;" + muted) + "</tr>");
  });
  h.push("<tr>" + labelTd_("<b>Answered</b>") +
    td_(t.intent.curTotal, "text-align:right;font-weight:600;background:#f6f4ee") +
    td_(perDay(t.intent.curTotal), "text-align:right;font-weight:600") +
    td_("", "") +
    td_(t.intent.prevTotal, "text-align:right;" + muted) + "</tr>");
  h.push('</table>');

  // ---- 2. the first-task drop-down ----
  var keys = {};
  Object.keys(t.tasks.cur).forEach(function (k) { keys[k] = 1; });
  Object.keys(t.tasks.prev).forEach(function (k) { keys[k] = 1; });
  var rows = Object.keys(keys).sort(function (a, b) {
    return (t.tasks.cur[b] || 0) - (t.tasks.cur[a] || 0) ||
      (t.tasks.prev[b] || 0) - (t.tasks.prev[a] || 0);
  });

  h.push('<table style="border-collapse:collapse;width:100%;margin-top:14px"><tr>');
  h.push(th_("First free task picked", "text-align:left"));
  h.push(th_("Last 7 days")); h.push(th_("Per day")); h.push(th_("Share"));
  h.push(th_("Previous 7 days", muted));
  h.push('</tr>');
  if (!rows.length) {
    h.push("<tr>" + td_("No first-task picks in the last 14 days.", "text-align:left;" + muted) + "</tr>");
  }
  rows.forEach(function (k) {
    var n = t.tasks.cur[k] || 0, p = t.tasks.prev[k] || 0;
    h.push("<tr>" + labelTd_(esc_(k)) +
      td_(n, "text-align:right;font-weight:600") +
      td_(perDay(n), "text-align:right") +
      td_(t.tasks.curTotal ? pct_(n / t.tasks.curTotal * 100) : "-", "text-align:right;" + muted) +
      td_(p, "text-align:right;" + muted) + "</tr>");
  });
  if (rows.length) {
    h.push("<tr>" + labelTd_("<b>Picked a task</b>") +
      td_(t.tasks.curTotal, "text-align:right;font-weight:600;background:#f6f4ee") +
      td_(perDay(t.tasks.curTotal), "text-align:right;font-weight:600") +
      td_("", "") +
      td_(t.tasks.prevTotal, "text-align:right;" + muted) + "</tr>");
  }
  h.push('</table>');

  h.push('<p style="' + muted + ';margin:6px 0 0;font-size:12px">' +
    'Unique leads from the sign-ups sheet, one per phone number. <b>Per day</b> is the ' +
    '7-day count divided by 7. The join form answer comes from the intent column; ' +
    'leads who never saw that question (the Gulf page, the PF audit page) are not in it. ' +
    'The task table reads the tasks column, and a task typed in rather than picked from ' +
    'the drop-down shows as "In their own words".</p>');
  return h.join("");
}
