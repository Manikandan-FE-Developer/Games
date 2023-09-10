const gameContainer = document.getElementById("game-container");
const player = document.getElementById("player");
const hearts = document.querySelectorAll(".heart");
const scoreElement = document.getElementById("score");
const obstacles = [];
let playerBottom = 0;
let isJumping = false;
let lives = 3;
let score = 0;

document.addEventListener("keydown", jump);

function jump(event) {
  if (event.keyCode === 32 && !isJumping) {
    isJumping = true;
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
      playerBottom += 10;
      player.style.bottom = playerBottom + "px";
      jumpCount++;
      if (jumpCount >= 10) {
        clearInterval(jumpInterval);
        fall();
      }
    }, 30);
  }
}

function fall() {
  const fallInterval = setInterval(() => {
    if (playerBottom > 0) {
      playerBottom -= 10;
      player.style.bottom = playerBottom + "px";
    } else {
      clearInterval(fallInterval);
      isJumping = false;
    }
  }, 30);
}

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.left = gameContainer.clientWidth + "px";
  obstacle.style.bottom = "0px";
  gameContainer.appendChild(obstacle);
  obstacles.push(obstacle);

  const obstacleMoveInterval = setInterval(() => {
    const obstacleLeft = parseInt(obstacle.style.left);
    if (obstacleLeft > 0) {
      obstacle.style.left = (obstacleLeft - 10) + "px";

      if (obstacleLeft < 60 && obstacleLeft > 10 && playerBottom < 60) {
        obstacleHit(obstacle);
      }
    } else {
      clearInterval(obstacleMoveInterval);
      gameContainer.removeChild(obstacle);
      obstacles.shift();
    }
  }, 30);
}

function obstacleHit(obstacle) {
  lives--;
  if (lives === 0) {
    gameOver();
  } else {
    hearts[lives].style.backgroundColor = "transparent";
  }
}

function gameOver() {
  alert("Game Over! Your score: " + score);
  location.reload();
}

setInterval(createObstacle, 2000);

function updateScore() {
  scoreElement.textContent = "Score: " + score;
}

setInterval(() => {
  score += 10;
  updateScore();
}, 1000);
