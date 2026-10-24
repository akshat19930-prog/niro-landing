/**
 * Free PF audit form, step 2 fields (Oct 2026).
 *
 * A separate file in the same Apps Script project as waitlist.gs. doPost
 * calls writeAuditFields_() once, after the row is created or found:
 *
 *   writeAuditFields_(sheet, rowIndex === -1 ? sheet.getLastRow() : rowIndex, data);
 *
 * Columns are found BY HEADER NAME and created at the far right when missing.
 * Never by position: the live waitlist tab carries columns past the end of
 * HEADER (channel and others the report reads), and getSheet_() rewrites the
 * first HEADER.length titles on every POST. Appending by name is the only way
 * to add fields without clobbering either.
 *
 * Fields (all optional; a value is written only when the payload carries it):
 *   signup_step          1 = name and number only, 2 = finished the form
 *   amount_bucket        the balance range they picked
 *   india_sim_active     yes | no | not_sure
 *   has_uan              TRUE | FALSE
 *   uan                  12 digits, stored as text, or blank
 *   audit_method         screenshots | readonly_credentials | video_call
 *   needs_recovery_help  TRUE when has_uan is FALSE or india_sim_active is no
 *
 * No password or credential is ever sent by the form, so none is stored.
 */
var AUDIT_FIELDS = [
  "signup_step", "amount_bucket", "india_sim_active", "has_uan", "uan",
  "audit_method", "needs_recovery_help"
];

function writeAuditFields_(sheet, rowIndex, data) {
  if (!rowIndex || rowIndex < 2) return;
  var present = AUDIT_FIELDS.filter(function (k) {
    return data[k] !== undefined && data[k] !== null && data[k] !== "";
  });
  if (!present.length) return;

  var lastCol = sheet.getLastColumn();
  var head = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  present.forEach(function (k) {
    var col = head.indexOf(k) + 1;
    if (!col) {
      lastCol += 1;
      sheet.getRange(1, lastCol).setValue(k);
      head.push(k);
      col = lastCol;
    }
    var v = data[k];
    if (k === "uan") v = asText_(v);              // keep all 12 digits as text
    if (k === "signup_step") {
      // Only ever moves forward: a late step-1 POST must not undo step 2.
      var cur = Number(sheet.getRange(rowIndex, col).getValue()) || 0;
      if (Number(v) <= cur) return;
    }
    sheet.getRange(rowIndex, col).setValue(v);
  });
}
