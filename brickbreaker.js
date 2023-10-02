const paddle = document.querySelector('.paddle');
const ball = document.querySelector('.ball');
const blocksContainer = document.querySelector('.blocks');
const lifeCountElement = document.getElementById('life-count');
const scoreCountElement = document.getElementById('score-count');
const nextLevelButton = document.getElementById('next-level');

const gameContainer = document.querySelector('.game-container');
const containerRect = gameContainer.getBoundingClientRect();

let ballX = containerRect.width / 2;
let ballY = containerRect.height - 50;
let ballSpeedX = 5;
let ballSpeedY = -5;
let paddleX = (containerRect.width - 80) / 2;
let lives = 3;
let score = 0;
let currentLevel = 0;
let nextLevelUnlocked = false;
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
    if (event.key === 'Left' || event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'Right' || event.key === 'ArrowRight') {
        rightPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === 'Left' || event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'Right' || event.key === 'ArrowRight') {
        rightPressed = false;
    }
}

function isColliding(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return (
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top &&
        rect1.left < rect2.right &&
        rect1.right > rect2.left
    );
}

function loadLevel(level) {
    const levelLayout = levels[level];
    blocksContainer.innerHTML = '';

    for (let row = 0; row < levelLayout.length; row++) {
        for (let col = 0; col < levelLayout[row].length; col++) {
            const blockType = levelLayout[row][col];
            if (blockType === 1) {
                const block = document.createElement('div');
                block.classList.add('block');
                block.style.left = col * (blockWidth + 10) + 'px';
                block.style.top = row * (blockHeight + 10) + 'px';
                blocksContainer.appendChild(block);
            } else if (blockType === 2) {
                const block = document.createElement('div');
                block.classList.add('block', 'bomb');
                block.style.left = col * (blockWidth + 10) + 'px';
                block.style.top = row * (blockHeight + 10) + 'px';
                blocksContainer.appendChild(block);
            }
        }
    }
}

function update() {
    if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    } else if (rightPressed && paddleX < containerRect.width - 80) {
        paddleX += 7;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collision with walls
    if (ballX <= 0 || ballX >= containerRect.width - 20) {
        ballSpeedX *= -1;
    }

    if (ballY <= 0) {
        ballSpeedY *= -1;
    }

    // Collision with paddle
    if (
        ballY >= containerRect.height - 40 && ballY <= containerRect.height - 30 &&
        ballX >= paddleX && ballX <= paddleX + 80
    ) {
        ballSpeedY *= -1;
    }

    // Collision with blocks
    const blocks = document.querySelectorAll('.block');
    blocks.forEach(block => {
        if (block.style.display !== 'none' && isColliding(ball, block)) {
            if (block.classList.contains('bomb')) {
                lives--;
                lifeCountElement.textContent = lives;
            } else {
                ballSpeedY *= -1;
                block.style.display = 'none';
                score += 10;
                scoreCountElement.textContent = score;
            }
        }
    });

    // Ball out of bounds
    if (ballY >= containerRect.height - 20) {
        lives--;
        lifeCountElement.textContent = lives;
        if (lives > 0) {
            resetBall();
        } else {
            alert('Game Over');
            document.location.reload();
        }
    }

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    paddle.style.left = paddleX + 'px';

    const remainingBlocks = document.querySelectorAll('.block:not(.bomb):not([style="display: none;"])');
    if (remainingBlocks.length === 0) {
        unlockNextLevel();
    }

    requestAnimationFrame(update);
}

function resetBall() {
    ballX = containerRect.width / 2;
    ballY = containerRect.height - 50;
    ballSpeedX = 5;
    ballSpeedY = -5;
    paddleX = (containerRect.width - 80) / 2;
}

ball.addEventListener('animationend', () => {
    ball.style.animation = 'none';
});

function unlockNextLevel() {
    nextLevelButton.style.display = 'block';
    nextLevelUnlocked = true;
}

nextLevelButton.addEventListener('click', () => {
    if (nextLevelUnlocked) {
        currentLevel++;
        if (currentLevel < levels.length) {
            loadLevel(currentLevel);
            resetBall();
            nextLevelButton.style.display = 'none';
            nextLevelUnlocked = false;
        } else {
            alert('Congratulations! You completed all levels.');
            document.location.reload();
        }
    }
});

// Load levels
const levels = [
    [
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 2, 1, 2, 1, 2],
        [2, 1, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 2],
        [2, 1, 2, 1, 2, 1]
    ]
    // Add more levels as needed
];

const blockWidth = 54;
const blockHeight = 25;

loadLevel(currentLevel);
update();