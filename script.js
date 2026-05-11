document.addEventListener('DOMContentLoaded', () => {
    const imgEl = document.querySelector('.card-image');
    const nameEl = document.querySelector('.card-name');
    const yomiEl = document.querySelector('.card-yomi');
    const imageTextEl = document.querySelector('.target-text');
    const inputEl = document.querySelector('.typing-input');
    const feedbackEl = document.querySelector('.feedback-msg');

    let cardData = [];
    let currentCard = null;

    fetch('./shinennooverforce.json')
        .then(response => response.json())
        .then(data => {
            cardData = data;
            displayRandomCard();
        })
        .catch(error => console.error('データの読み込みに失敗しました:', error));

    function displayRandomCard() {
        // --- 終了判定 ---
        if (cardData.length === 0) {
            showGameClear();
            return;
        }

        feedbackEl.classList.remove('show');

        // --- 重複排除のロジック ---
        // 1. 現在の配列の長さからランダムなインデックスを決定
        const randomIndex = Math.floor(Math.random() * cardData.length);

        // 2. spliceを使って、配列からその要素を削除しつつ取得する
        // spliceは配列を返すので、その[0]番目を取り出す
        currentCard = cardData.splice(randomIndex, 1)[0];

        console.log(`残り枚数: ${cardData.length}枚`);

        // HTML要素の更新
        imgEl.src = `./images/${currentCard.image}.jpg`;
        imgEl.alt = currentCard.card_name;
        nameEl.textContent = currentCard.card_name;
        yomiEl.textContent = currentCard.card_yomi;
        imageTextEl.textContent = currentCard.image;
        inputEl.placeholder = currentCard.card_yomi;

        inputEl.value = '';
        inputEl.focus();
    }

    // 全クリア時の処理
    function showGameClear() {
        // ゲーム画面を非表示にするか、クリアメッセージを出す
        imgEl.style.display = 'none';
        nameEl.textContent = "Congratulations!";
        yomiEl.textContent = "すべてのカードをマスターしました！";
        imageTextEl.textContent = "";
        inputEl.style.display = 'none';

        feedbackEl.textContent = "ALL CLEAR!";
        feedbackEl.className = "feedback-msg is-good show";
    }

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const userInput = inputEl.value.trim();

            if (userInput === currentCard.card_yomi) {
                feedbackEl.textContent = "Good!";
                feedbackEl.className = "feedback-msg is-good show";

                setTimeout(() => {
                    displayRandomCard();
                }, 500);
            } else {
                feedbackEl.textContent = "Miss!";
                feedbackEl.className = "feedback-msg is-miss show";
                inputEl.value = '';
            }
        }
    });

    inputEl.addEventListener('input', () => {
        if (feedbackEl.classList.contains('is-miss')) {
            feedbackEl.classList.remove('show');
        }
    });
});