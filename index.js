///// グローバル変数
 // getElem~idメソッドを短絡化
 var byId = function(id){ return document.getElementById(id); };

 // textareaのIDを指定
 const textarea = document.getElementById('URL');

 // 動画URLの配列 再代入ありのためvar
 var inBoxStr = [];
 // 変更履歴の配列 再代入ありのためvar
 var changeText = [];

///// 変換
function btnGo() {
  // テキストの内容を取得
  var text = textarea.value;

  /// サムネ欄 (1回でいいからループ外で設定しとく)
    //画像を表示するプレビュー欄取得
    const pre = document.querySelector('#previewColumn');
    // 説明文を消す
    pre.innerHTML = "";
    // 左寄せにする
    pre.style.textAlign = "left";

  // matchは第2引数なし  gはグローバル(全文)検索
  // []内でのエスケープは[]内で意味を持つものに付ける→ [ ] - ^ $

  // PC版クエリ始まりeyJ0e ~ 終わり9fQ fX0 n19 まだある？集める　ケタが決まってないから法則性でマッチさせる
  const match = text.match(
  // ニコニコにマッチ
    // URL全体
    new RegExp("((?:https?:\\/\\/)?(?:nico\\.ms|(?:(?:www|sp)?\\.)?nicovideo\\.jp)?\\/)?(?:watch\\/)?(?:(?:sm|nm|so)[0-9]+|[0-9]{10,})|"
    // 要らないと思うけど誤判定したら↑の|の前に入れる→(?:[?&][a-z_]+=(?:[a-zA-Z0-9_\\-]+|eyJ0e[a-zA-Z]+(?:9fQ|fX0|n19)))
    // sm???
    + "(?:sm|nm|so)[0-9]+|"
    // &nicovideo()
    + "\\&nicovideo\\((?:sm|nm|so)[0-9]+\\)|"
  // ようつべにマッチ
    // URL全体
    + "(?:https?:\\/\\/)?(?:(?:www|m)?\\.)?youtu\\.?be(?:\\.com)?\\/(?:watch\\?v=)?(?:[a-zA-Z0-9_\\-]{11})(?:\\&[a-z]+=[a-zA-Z0-9]+)?|"
    // v=11桁
    + "v=[a-zA-Z0-9_\\-]{11}|"
    // &youtube()
    + "\\&youtube\\(https?:\\/\\/www\\.youtube\\.com\\/watch\\?v=[a-zA-Z0-9_\\-]{11}\\)(?:\\{[0-9]{2,4}\\,[0-9]{2,4}\\})?"
    , "g")
  );

  try{ // try...catch文 : length null(テキストない時)エラー回避
    for( let i=0; i < match.length; i++){
      // 個々でIDを取り出す
      const nicoID = match[i].match(/(?:sm|nm|so)[0-9]+/);
      const ytID = match[i].match(/[a-zA-Z0-9_\-]{11}/);

      // 記法に整えて配列に格納
      if( nicoID && !ytID ){
        let nicoStr = "\&nicovideo\(" + nicoID + "\)";
        inBoxStr.push(nicoStr);
      }else if( ytID && !nicoID ){
        let ytStr = "\&youtube\(https:\/\/www\.youtube\.com\/watch\?v=" + ytID + "\)\{342\,187\}";
        inBoxStr.push(ytStr);
      }

  ///サムネ表示
    /// ニコニコ
    if( nicoID && !ytID ){
      // 動画情報
      let thumbnail = document.createElement("iframe");
      // サムネ let thumbnail = document.createElement("img");
      thumbnail.src = "https:\/\/ext\.nicovideo\.jp\/thumb\/" + nicoID;
      thumbnail.scrolling="no";
      // サムネ thumbnail.src = "https:\/\/nicovideo\.cdn\.nimg\.jp\/thumbnails\/" + nicoID + "\/" + nicoID + "\.12345678"; //←8ケタのランダム数字が付く
      // プレビュー欄の子要素として最後に追加していく
      pre.appendChild(thumbnail);
    /// ようつべ
    } else if( ytID  && !nicoID) {
      let thumbnail = document.createElement("img");
      thumbnail.src = "https:\/\/img\.youtube\.com\/vi\/" + ytID + "\/mqdefault\.jpg";
      pre.appendChild(thumbnail);
    }

    } //for終わり
  } catch (err) {return;}

  // 2つずつ
  const all = [];
  for( let i=0; i < inBoxStr.length; i+=2 ){
    // 1つ目、2つ目
    const one = inBoxStr[i];
    const two = inBoxStr[i+1];

    // 2つ目が無い場合
    if( two === undefined){
      all.push("\|" + one + "\|\|\n");
    } else {
     // 通常の場合
      all.push("\|" + one + "\|" + two + "\|\n");
    }
    textarea.value = all.join("");
  }

  // 配列を空にする
  all.length = 0; inBoxStr.length = 0;
  return;
} // 変換終わり





///// テキストエリアでのUndo/Redo

 const btnClear = byId('clear');
 var undo = byId('undo');
 var redo = byId('redo');

// 消去
 btnClear.addEventListener('click', function() {
   //execCommand('insertText')
   textarea.focus();
  // 全選択・削除コマンド
   document.execCommand('selectAll'); 
   document.execCommand('delete');
});



// テキストエリア・ボタン操作を配列に記録
// push:配列の末尾に追加 pop:末尾を削除 concat()メソッド:配列を結合



///// コピペ
 /// コピー
 function copy(){
   var text = textarea.value;
     navigator.clipboard.writeText(text);
     alert('クリップボードにコピーしました。');
 }

 /// ペースト
 function paste(){
   // クリップボードから読み取り
   navigator.clipboard.readText()
     .then((clipText) =>
       {textarea.innerHTML += "\n" + clipText},
     () => {alert('貼り付けに失敗しました。\n' + 'クリップボードへのアクセス権限を許可しているか確認してください。')},
     );
 }



///// プレビュー表示
function check() {
 // チェックボックス取得
 const spCheckbox = byId('sp');
 // クラスpreviewを取得
 const previewStyle = byId("preview");
 // クラスtypeとその幅を取得
 const type = byId('type');
 const typeWidth = type.querySelector("#window-innerWidth");

 // チェックONならプレビューを表示
 if (spCheckbox.checked === true) {
  previewStyle.style.display = "";
  // クラスtypeの幅を戻す
  type.style.width = typeWidth;
 } else {
  // チェックOFFならプレビューを非表示
  previewStyle.style.display = "none";
  // 編集枠の幅100%
  type.style.width = "100%";
 }
};
