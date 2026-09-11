/**
 * コインの手引き - 簡易ナビゲーション「何が出てきましたか？」
 *
 * これは鑑定・査定機能ではありません。
 * 金額・価値・レア度・売却推奨などは一切判定せず、
 * 関連する情報ページへの案内のみを行います。
 *
 * すべての処理はこのブラウザの中だけで完結し、
 * 入力内容や選択結果を外部に送信することはありません。
 * localStorage 等への保存も行いません（ページを離れると結果は消えます）。
 */
(function () {
  "use strict";

  var container = document.getElementById("coin-finder");
  if (!container) {
    return;
  }

  var START = {
    question: "何が出てきましたか？",
    options: [
      { id: "jp-coin", label: "日本の硬貨" },
      { id: "banknote", label: "紙幣（お札）" },
      { id: "foreign", label: "外国のコイン" },
      { id: "gold-silver", label: "金色・銀色で厚みのあるコイン" },
      { id: "commemorative", label: "記念硬貨だと思う" },
      { id: "inherited", label: "遺品の中から出てきた" },
      { id: "unknown", label: "わからない" }
    ]
  };

  var BRANCHES = {
    "jp-coin": {
      question2: "発行年や絵柄の文字は読めますか？",
      note: "日本の硬貨は、まず種類を確認したうえで、必要に応じて銀行や専門家に確認する流れがおすすめです。",
      links: [
        { href: "guide/first-check.html", label: "昔のお金を目の前に置いて確認する5ステップ" },
        { href: "types/coin-types-overview.html", label: "古銭・記念硬貨・古紙幣の違い" }
      ]
    },
    banknote: {
      question2: null,
      note: "古紙幣専用の記事は準備中です。まずは全体の確認手順から見ていただくのがおすすめです。",
      links: [
        { href: "guide/first-check.html", label: "昔のお金を目の前に置いて確認する5ステップ" },
        { href: "types/coin-types-overview.html", label: "古銭・記念硬貨・古紙幣の違い" }
      ]
    },
    foreign: {
      question2: "発行国は分かりますか？",
      note: "外国コイン専用の記事は準備中です。まずは全体の確認手順から見ていただくのがおすすめです。",
      links: [
        { href: "guide/first-check.html", label: "昔のお金を目の前に置いて確認する5ステップ" }
      ]
    },
    "gold-silver": {
      question2: "記念硬貨や金貨・銀貨だと思いますか？",
      note: "金色・銀色のコインは、記念硬貨である場合とそうでない場合があります。まず種類を確認してみてください。",
      links: [
        { href: "types/commemorative-coins.html", label: "記念硬貨は使える？ 額面と収集価値の考え方" },
        { href: "guide/first-check.html", label: "昔のお金を目の前に置いて確認する5ステップ" }
      ]
    },
    commemorative: {
      question2: "ケースや証明書がありますか？",
      note: "記念硬貨は、額面としての扱いと収集価値の考え方が分かれます。次のページで整理しています。",
      links: [
        { href: "types/commemorative-coins.html", label: "記念硬貨は使える？ 額面と収集価値の考え方" },
        { href: "guide/bank-or-specialist.html", label: "古いお金は銀行に持っていける？ 旧紙幣・記念硬貨・古銭の違い" }
      ]
    },
    inherited: {
      question2: null,
      note: "遺品の中から出てきた場合は、無理に急いで判断する必要はありません。整理の進め方をまとめています。",
      links: [
        { href: "guide/inherited-coins.html", label: "実家の片付けで昔のお金が出てきたら最初にすること" },
        { href: "guide/first-check.html", label: "昔のお金を目の前に置いて確認する5ステップ" }
      ]
    },
    unknown: {
      question2: null,
      note: "何であるか分からない場合は、まず基本の確認手順から始めてみてください。",
      links: [
        { href: "guide/first-check.html", label: "昔のお金を目の前に置いて確認する5ステップ" }
      ]
    }
  };

  function clear(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  function renderStart() {
    clear(container);

    var step = document.createElement("div");
    step.className = "finder-step";

    var question = document.createElement("p");
    question.className = "finder-question";
    question.textContent = START.question;
    step.appendChild(question);

    var list = document.createElement("ul");
    list.className = "finder-options";

    START.options.forEach(function (option) {
      var li = document.createElement("li");
      var button = document.createElement("button");
      button.type = "button";
      button.className = "finder-btn";
      button.textContent = option.label;
      button.addEventListener("click", function () {
        renderBranch(option.id);
      });
      li.appendChild(button);
      list.appendChild(li);
    });

    step.appendChild(list);
    container.appendChild(step);
  }

  function renderBranch(branchId) {
    var branch = BRANCHES[branchId];
    if (!branch) {
      renderStart();
      return;
    }

    if (branch.question2) {
      clear(container);

      var step = document.createElement("div");
      step.className = "finder-step";

      var question = document.createElement("p");
      question.className = "finder-question";
      question.textContent = branch.question2;
      step.appendChild(question);

      var list = document.createElement("ul");
      list.className = "finder-options";

      ["はい", "いいえ"].forEach(function (label) {
        var li = document.createElement("li");
        var button = document.createElement("button");
        button.type = "button";
        button.className = "finder-btn";
        button.textContent = label;
        button.addEventListener("click", function () {
          renderResult(branch);
        });
        li.appendChild(button);
        list.appendChild(li);
      });

      step.appendChild(list);
      container.appendChild(step);
    } else {
      renderResult(branch);
    }
  }

  function renderResult(branch) {
    clear(container);

    var result = document.createElement("div");
    result.className = "finder-result";

    var heading = document.createElement("p");
    heading.className = "finder-question";
    heading.textContent = "まずこちらのページを確認してください";
    result.appendChild(heading);

    var note = document.createElement("p");
    note.textContent = branch.note;
    result.appendChild(note);

    var links = document.createElement("ul");
    branch.links.forEach(function (link) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.label;
      li.appendChild(a);
      links.appendChild(li);
    });
    result.appendChild(links);

    var disclaimerNote = document.createElement("p");
    disclaimerNote.className = "finder-note";
    disclaimerNote.textContent =
      "この案内は金額・価値・レア度を判定するものではありません。内容の確認には、記事内でご案内する銀行・専門家などへの確認もあわせてご検討ください。";
    result.appendChild(disclaimerNote);

    var reset = document.createElement("button");
    reset.type = "button";
    reset.className = "finder-reset";
    reset.textContent = "はじめからやり直す";
    reset.addEventListener("click", renderStart);
    result.appendChild(reset);

    container.appendChild(result);
  }

  renderStart();
})();
