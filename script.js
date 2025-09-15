document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const moneyDisplay = document.getElementById('moneyDisplay');
    const dropButton = document.getElementById('dropBallBtn');
    const messageDisplay = document.getElementById('message');

    let currentMoney = 100;
    const dropCost = 10;
    const multipliers = [0.5, 1, 2, 5, 2, 1, 0.5];

    // Generate pins
    function generatePins() {
        const rows = 8;
        const pinsPerRow = [2, 3, 4, 5, 6, 7, 8, 9];
        const startY = 30;
        const pinSpacingY = 40;
        const pinSpacingX = 35;

        gameBoard.innerHTML = ''; // Clear board
        
        for (let i = 0; i < rows; i++) {
            const numPins = pinsPerRow[i];
            const rowWidth = (numPins - 1) * pinSpacingX;
            const startX = (gameBoard.offsetWidth - rowWidth) / 2;

            for (let j = 0; j < numPins; j++) {
                const pin = document.createElement('div');
                pin.classList.add('pin');
                pin.style.top = `${startY + i * pinSpacingY}px`;
                pin.style.left = `${startX + j * pinSpacingX}px`;
                gameBoard.appendChild(pin);
            }
        }
    }

    // Generate multiplier slots
    function generateMultipliers() {
        const slotContainer = document.createElement('div');
        slotContainer.style.display = 'flex';
        slotContainer.style.justifyContent = 'space-around';
        slotContainer.style.position = 'absolute';
        slotContainer.style.bottom = '10px';
        slotContainer.style.width = '100%';

        multipliers.forEach(mult => {
            const slot = document.createElement('div');
            slot.textContent = `x${mult}`;
            slot.style.textAlign = 'center';
            slot.style.fontSize = '1em';
            slot.style.width = '14%';
            slot.style.color = mult > 1 ? 'green' : 'red';
            slotContainer.appendChild(slot);
        });
        gameBoard.appendChild(slotContainer);
    }

    generatePins();
    generateMultipliers();

    // Drop the ball
    dropButton.addEventListener('click', () => {
        if (currentMoney < dropCost) {
            messageDisplay.textContent = "Not enough money!";
            return;
        }

        currentMoney -= dropCost;
        moneyDisplay.textContent = currentMoney;
        messageDisplay.textContent = "";

        const ball = document.createElement('div');
        ball.classList.add('ball');
        gameBoard.appendChild(ball);

        // Simulate ball drop
        let currentX = gameBoard.offsetWidth / 2;
        let currentY = 0;
        const totalRows = 8;

        const interval = setInterval(() => {
            if (currentY >= gameBoard.offsetHeight - 20) {
                clearInterval(interval);
                handleLanding(currentX);
                ball.remove();
                return;
            }

            // Simple physics simulation: randomly go left or right
            const direction = Math.random() > 0.5 ? 1 : -1;
            currentX += direction * 25; // Small horizontal movement

            // Ensure the ball stays within bounds
            if (currentX < 0) currentX = 0;
            if (currentX > gameBoard.offsetWidth - 15) currentX = gameBoard.offsetWidth - 15;

            currentY += 20; // Move down

            ball.style.top = `${currentY}px`;
            ball.style.left = `${currentX}px`;

        }, 100);
    });

    function handleLanding(landingX) {
        const slotWidth = gameBoard.offsetWidth / multipliers.length;
        const landingSlotIndex = Math.floor(landingX / slotWidth);
        const finalMultiplier = multipliers[landingSlotIndex];

        const winnings = dropCost * finalMultiplier;
        currentMoney += winnings;
        moneyDisplay.textContent = currentMoney;

        messageDisplay.textContent = `You landed on x${finalMultiplier}! You won $${winnings.toFixed(2)}.`;
    }
});
