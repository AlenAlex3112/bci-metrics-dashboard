/**
 * Bird Count India — Metrics Dashboard connector
 * Paste this into your Google Sheet: Extensions ▸ Apps Script (replace everything).
 * Then: Deploy ▸ New deployment ▸ Web app
 *        Execute as: Me   |   Who has access: Anyone
 * Copy the Web app URL (ends in /exec) and paste it into the dashboard.
 *
 * Returns every tab named  MMM-YY-IN / -ST / -DT  as raw rows, in one request.
 * Nothing is written or changed in your sheet — it only reads.
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var re = /^[A-Za-z]{3}-\d{2}-(IN|ST|DT)$/;
  var tabs = {};
  ss.getSheets().forEach(function (sh) {
    var name = sh.getName();
    if (re.test(name)) {
      tabs[name] = sh.getDataRange().getValues();
    }
  });
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, count: Object.keys(tabs).length, tabs: tabs }))
    .setMimeType(ContentService.MimeType.JSON);
}
