/*
* 課題をためているスプレットシートを読み込んでJOSN形式に変換するGASスクリプト
*
*　@created 2018/04/07 MasahikoHyodo
*/

// スプレットシートのURLを読み込む
var url = 'https://docs.google.com/spreadsheets/d/1uR-H_1X1sDGW4KNRTsi2ksGdJmDy6fNPL7o5UoSmXtg/pubhtml';
var book = SpreadsheetApp.openByUrl(url);

// シート名の取得
var sheet = book.getSheetByName('test');

function doGet(e) {
  var json = convertSheet2Json(sheet);
  Logger.log(JSON.stringify(json));
  return ContentService.createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}

function convertSheet2Json(sheet) {
  // カラム名を読み込む(１行目)
  var firstRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  var firstRowValues = firstRange.getValues();
  var titleColumns = firstRowValues[0];

  // データを読み込む(２行目以降)
  var lastRow = sheet.getLastRow();
  var rowValues = [];
  for(var rowIndex=2; rowIndex<=lastRow; rowIndex++) {
    var colStartIndex = 1;
    var rowNum = 1;
    var range = sheet.getRange(rowIndex, colStartIndex, rowNum, sheet.getLastColumn());
    var values = range.getValues();
    rowValues.push(values[0]);
  }

  // JOSNデータ作成
  var jsonArray = [];
  for(var i=0; i<rowValues.length; i++) {
    var line = rowValues[i];
    var json = new Object();
    for(var j=0; j<titleColumns.length; j++) {
      json[titleColumns[j]] = line[j];
    }
    jsonArray.push(json);
  }
}
