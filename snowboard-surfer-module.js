// Snowboard Surfer Game Module for Momentos
export const metadata = {
  id: "snowboard-surfer",
  name: "Snowboard Surfer",
  description: "Dodge obstacles while snowboarding downhill",
  size: "2x2",
  links: [],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  let gameRunning = false;
  let score = 0;
  let playerLane = 1; // 0 = left, 1 = middle, 2 = right
  let isJumping = false;
  let obstacles = [];
  let gameSpeed = 5;
  let animationFrame;

  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 12px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"};
      border-radius: 8px;
      position: relative;
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        z-index: 10;
      ">
        <div style="font-size: 14px; font-weight: bold;">🏂 Snowboard</div>
        <div style="font-size: 14px;">Score: <span id="score">0</span></div>
      </div>
      
      <div id="game-container" style="
        flex: 1;
        position: relative;
        background: linear-gradient(to bottom, #87ceeb 0%, #e0f6ff 100%);
        border-radius: 8px;
        overflow: hidden;
      ">
        <!-- Ski slope lanes -->
        <div style="
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-around;
          padding: 0 20%;
        ">
          <div style="width: 2px; height: 100%; background: rgba(255,255,255,0.3);"></div>
          <div style="width: 2px; height: 100%; background: rgba(255,255,255,0.3);"></div>
        </div>
        
        <!-- Player -->
        <div id="player" style="
          position: absolute;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 32px;
          z-index: 5;
          transition: left 0.2s ease, bottom 0.3s ease;
        ">🏂</div>
        
        <!-- Obstacles container -->
        <div id="obstacles"></div>
        
        <!-- Game Over Screen -->
        <div id="game-over" style="
          display: none;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.9);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          z-index: 20;
        ">
          <div style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">Game Over!</div>
          <div style="font-size: 14px; margin-bottom: 12px;">Score: <span id="final-score">0</span></div>
          <button id="restart-btn" style="
            padding: 8px 16px;
            background: #4a9eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          ">Play Again</button>
        </div>
        
        <!-- Start Screen -->
        <div id="start-screen" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          z-index: 20;
        ">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">Snowboard Surfer</div>
          <div style="font-size: 12px; margin-bottom: 12px; opacity: 0.8;">
            ← → to switch lanes<br>
            ↑ to jump<br>
            Avoid obstacles!
          </div>
          <button id="start-btn" style="
            padding: 8px 16px;
            background: #4a9eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          ">Start Game</button>
        </div>
      </div>
    </div>
  `;

  const gameContainer = container.querySelector("#game-container");
  const playerEl = container.querySelector("#player");
  const obstaclesEl = container.querySelector("#obstacles");
  const scoreEl = container.querySelector("#score");
  const gameOverEl = container.querySelector("#game-over");
  const finalScoreEl = container.querySelector("#final-score");
  const startScreen = container.querySelector("#start-screen");
  const startBtn = container.querySelector("#start-btn");
  const restartBtn = container.querySelector("#restart-btn");

  const lanes = [30, 50, 70]; // percentage positions
  const obstacleTypes = ["🌲", "🪨", "⛰️"];

  function updatePlayerPosition() {
    playerEl.style.left = `${lanes[playerLane]}%`;
    playerEl.style.bottom = isJumping ? "140px" : "80px";
  }

  function createObstacle() {
    const lane = Math.floor(Math.random() * 3);
    const type =
      obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

    const obstacle = document.createElement("div");
    obstacle.style.cssText = `
      position: absolute;
      top: -50px;
      left: ${lanes[lane]}%;
      transform: translateX(-50%);
      font-size: 28px;
      z-index: 4;
    `;
    obstacle.textContent = type;
    obstacle.dataset.lane = lane;

    obstaclesEl.appendChild(obstacle);
    obstacles.push({ el: obstacle, lane, y: -50 });
  }

  function gameLoop() {
    if (!gameRunning) return;

    // Move obstacles
    obstacles.forEach((obs, index) => {
      obs.y += gameSpeed;
      obs.el.style.top = `${obs.y}px`;

      // Check collision
      const playerBottom = isJumping ? 140 : 80;
      const playerTop = playerBottom + 40;
      const obsBottom = obs.y;
      const obsTop = obs.y + 40;

      if (
        obs.lane === playerLane &&
        obsBottom < playerTop &&
        obsTop > playerBottom
      ) {
        endGame();
        return;
      }

      // Score when passing obstacle
      if (obs.y > gameContainer.clientHeight && !obs.scored) {
        obs.scored = true;
        score += 10;
        scoreEl.textContent = score;

        // Increase difficulty
        if (score % 100 === 0) {
          gameSpeed += 0.5;
        }
      }

      // Remove off-screen obstacles
      if (obs.y > gameContainer.clientHeight + 50) {
        obs.el.remove();
        obstacles.splice(index, 1);
      }
    });

    // Create new obstacles
    if (Math.random() < 0.02) {
      createObstacle();
    }

    animationFrame = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    gameRunning = true;
    score = 0;
    playerLane = 1;
    isJumping = false;
    obstacles = [];
    gameSpeed = 5;
    scoreEl.textContent = "0";
    obstaclesEl.innerHTML = "";
    startScreen.style.display = "none";
    gameOverEl.style.display = "none";
    updatePlayerPosition();
    gameLoop();
  }

  function endGame() {
    gameRunning = false;
    cancelAnimationFrame(animationFrame);
    finalScoreEl.textContent = score;
    gameOverEl.style.display = "block";
  }

  function handleKey(e) {
    if (!gameRunning) return;

    if (e.key === "ArrowLeft" && playerLane > 0) {
      playerLane--;
      updatePlayerPosition();
    } else if (e.key === "ArrowRight" && playerLane < 2) {
      playerLane++;
      updatePlayerPosition();
    } else if (e.key === "ArrowUp" && !isJumping) {
      isJumping = true;
      updatePlayerPosition();
      setTimeout(() => {
        isJumping = false;
        updatePlayerPosition();
      }, 400);
    }
  }

  // Touch controls
  let touchStartX = 0;
  let touchStartY = 0;

  gameContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  gameContainer.addEventListener("touchend", (e) => {
    if (!gameRunning) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 30 && playerLane < 2) {
        playerLane++;
        updatePlayerPosition();
      } else if (dx < -30 && playerLane > 0) {
        playerLane--;
        updatePlayerPosition();
      }
    } else if (dy < -30 && !isJumping) {
      // Swipe up to jump
      isJumping = true;
      updatePlayerPosition();
      setTimeout(() => {
        isJumping = false;
        updatePlayerPosition();
      }, 400);
    }
  });

  document.addEventListener("keydown", handleKey);
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);

  updatePlayerPosition();

  return () => {
    document.removeEventListener("keydown", handleKey);
    if (animationFrame) cancelAnimationFrame(animationFrame);
  };
}
