document.addEventListener('DOMContentLoaded', () => {
    const themes = {
        animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🐵'],
        numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '0️⃣', '🔟', '#️⃣', '*️⃣', '⏺️', '⏹️', '⏸️']
    };

    let cards = [];
    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;
    let startTime;
    let timerInterval;

    const memoryGame = document.getElementById('memory-game');
    const startButton = document.getElementById('start-button');
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    const gameContainer = document.getElementById('game-container');

    startButton.addEventListener('click', startGame);

    function startGame() {
        resetGame();
        gameContainer.style.display = 'flex';

        const selectedTheme = themes.animals; // Change theme as needed
        cards = [...selectedTheme, ...selectedTheme];
        cards.sort(() => Math.random() - 0.5);

        updateMoves();
        createCards(5, 5); // Adjusting for a 7x7 grid
        startTime = new Date().getTime();
        startTimer();
    }

    function resetGame() {
        moves = 0;
        flippedCards = [];
        matchedCards = [];
        movesElement.textContent = 'Moves: 0';
        timerElement.textContent = 'Time: 0s';
        clearInterval(timerInterval);
        memoryGame.innerHTML = '';
    }

    function createCards(rows, columns) {
        memoryGame.style.gridTemplateColumns = `repeat(${columns}, 80px)`;
        memoryGame.innerHTML = '';

        for (let i = 0; i < rows * columns; i++) {
            const cardElement = createCardElement(cards[i], i);
            memoryGame.appendChild(cardElement);
        }
    }

    function createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.card = card;
        cardElement.dataset.index = index;
        cardElement.innerHTML = '<span class="card-content">?</span>';
        cardElement.addEventListener('click', flipCard);
        return cardElement;
    }

    function flipCard() {
        const selectedCard = this;

        if (canFlipCard(selectedCard)) {
            revealCard(selectedCard);

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 500);
            }
        }
    }

    function canFlipCard(card) {
        return (
            flippedCards.length < 2 &&
            !flippedCards.includes(card) &&
            !card.classList.contains('matched')
        );
    }

    function revealCard(card) {
        card.innerHTML = `<span class="card-content">${card.dataset.card}</span>`;
        card.classList.add('flipped');
        flippedCards.push(card);
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.card === card2.dataset.card) {
            markMatchedCards();
            if (isGameComplete()) {
                endGame();
            }
        } else {
            hideFlippedCards();
        }

        resetFlippedCards();
        incrementMoves();
    }

    function markMatchedCards() {
        flippedCards.forEach(card => card.classList.add('matched'));
        matchedCards.push(...flippedCards);
    }

    function hideFlippedCards() {
        flippedCards.forEach(card => {
            card.innerHTML = '<span class="card-content">?</span>';
            card.classList.remove('flipped');
        });
    }

    function resetFlippedCards() {
        flippedCards = [];
    }

    function incrementMoves() {
        moves++;
        updateMoves();
    }

    function updateMoves() {
        movesElement.textContent = `Moves: ${moves}`;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const elapsedTime = (currentTime - startTime) / 1000;
            timerElement.textContent = `Time: ${elapsedTime.toFixed(1)}s`;
        }, 100);
    }

    function isGameComplete() {
        return matchedCards.length === cards.length;
    }

    function endGame() {
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;

        alert(`Congratulations! You completed the game in ${moves} moves and ${elapsedTime.toFixed(2)} seconds.`);

        // Reset the game
        gameContainer.style.display = 'none';
        const startScreen = document.getElementById('start-screen');
        startScreen.style.display = 'flex';
        resetGame();
    }
});
