document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const section = document.querySelector('section');
    const imgEl = section.querySelector('img');
    const nameEl = section.querySelectorAll('p')[0];
    const yomiEl = section.querySelectorAll('p')[1];
    const imageTextEl = section.querySelectorAll('p')[2];
    const inputEl = section.querySelector('input');

    let cardData = [];
    let currentCard = null;

    // 1. JSONデータの読み込み
    fetch('./shinennooverforce.json')
        .then(response => response.json())
        .then(data => {
            cardData = data;
            displayRandomCard(); // 最初のカードを表示
        })
        .catch(error => console.error('データの読み込みに失敗しました:', error));

    // 2. ランダムなカードを表示する関数
    function displayRandomCard() {
        if (cardData.length === 0) return;

        // ランダムに1つ選択
        const randomIndex = Math.floor(Math.random() * cardData.length);
        currentCard = cardData[randomIndex];

        // HTML要素の更新
        imgEl.src = `./images/${currentCard.image}.jpg`;
        imgEl.alt = currentCard.card_name;
        nameEl.textContent = currentCard.card_name;
        yomiEl.textContent = currentCard.card_yomi;
        imageTextEl.textContent = currentCard.image;
        inputEl.placeholder = currentCard.card_yomi;


        // 入力欄をリセットしてフォーカスを当てる
        inputEl.value = '';
        inputEl.focus();
    }

    // 3. 入力判定（Enterキー）
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const userInput = inputEl.value.trim();

            // 判定（imageの文字列と一致するか）
            if (userInput === currentCard.card_yomi) {
                console.log('正解！');
                displayRandomCard(); // 次のカードへ
            } else {
                console.log('不正解です');
                // 不正解時の演出（赤く光らせるなど）をここに追加可能
                inputEl.value = ''; // 間違えたらクリアする場合
            }
        }
    });
});