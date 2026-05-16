document.addEventListener('DOMContentLoaded', () => {
    // 1. querySelectorAll で「すべての」要素を取得する
    const imgEls = document.querySelectorAll('.card-image');
    const rubyEls = document.querySelectorAll('.card-ruby');
    const nameEls = document.querySelectorAll('.card-name');
    const attributeEls = document.querySelectorAll('.card-attribute');
    const levelEls = document.querySelectorAll('.card-level');
    const infoEls = document.querySelectorAll('.card-info');
    const atkEls = document.querySelectorAll('.card-atk');
    const defEls = document.querySelectorAll('.card-def');
    const textEls = document.querySelectorAll('.card-text');
    const romajiEls = document.querySelectorAll('.card-romaji');
    const inputEl = document.querySelector('.typing-input'); // 入力欄は1つを想定
    const feedbackEl = document.querySelector('.feedback-msg');

    let cardData = [];
    let currentCard = null;

    fetch('./carddata.json')
        .then(response => response.json())
        .then(data => {
            cardData = data;
            displayRandomCard();
        })
        .catch(error => console.error('データの読み込みに失敗しました:', error));

    function displayRandomCard() {
        if (cardData.length === 0) {
            showGameClear();
            return;
        }

        feedbackEl.classList.remove('show');

        const randomIndex = Math.floor(Math.random() * cardData.length);
        currentCard = cardData.splice(randomIndex, 1)[0];

        console.log(`残り枚数: ${cardData.length}枚`);

        // 2. forEach を使ってすべての該当要素を更新する関数を作成すると楽です
        const updateText = (elements, text) => {
            elements.forEach(el => { el.textContent = text; });
        };

        // 各要素を更新
        imgEls.forEach(el => {
            el.src = `./images/${currentCard.card_romaji}.jpg`;
            el.alt = currentCard.card_name;
        });

        nameEls.forEach(el => {
            el.innerHTML = `<ruby>${currentCard.card_name}<rt>${currentCard.card_ruby}</rt></ruby>`;
        });

        updateText(rubyEls, currentCard.card_ruby);
        // updateText(nameEls, currentCard.card_name);
        updateText(attributeEls, currentCard.box_card_attribute);
        updateText(levelEls, currentCard.box_card_level_rank);
        updateText(infoEls, currentCard.card_info_species_and_other_item);
        updateText(atkEls, currentCard.atk_power);
        updateText(defEls, currentCard.def_power);
        updateText(textEls, currentCard.box_card_text);
        updateText(romajiEls, currentCard.card_romaji);

        inputEl.placeholder = currentCard.card_ruby;
        inputEl.value = '';
        inputEl.focus();
    }

    function showGameClear() {
        imgEls.forEach(el => el.style.display = 'none');
        updateText(nameEls, "Congratulations!");
        // もともとのコードで yomiEl となっていた箇所を rubyEls に合わせています
        updateText(rubyEls, "すべてのカードをマスターしました！");
        updateText(romajiEls, "");
        inputEl.style.display = 'none';

        feedbackEl.textContent = "ALL CLEAR!";
        feedbackEl.className = "feedback-msg is-good show";
    }

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const userInput = inputEl.value.trim();
            // JSONのキー名が card_ruby なのか card_yomi なのか、
            // placeholderと一致させるのが良いでしょう。ここでは ruby に合わせています。
            if (userInput === currentCard.card_ruby) {
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