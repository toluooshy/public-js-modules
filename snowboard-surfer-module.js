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
      padding: 6px;
      border-radius: 4px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
    ">
      <div style="
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        z-index: 10;
      ">
        <div style="font-size: 10px; font-weight: 400;">🏂 Snowboard Surfer</div>
        <div style="font-size: 10px; font-weight: 400;">Score: <span id="score">0</span></div>
      </div>
      
      <div id="game-container" style="
        flex: 1;
        position: relative;
        background: linear-gradient(to bottom, #87ceeb 0%, #e0f6ff 100%);
        border-radius: 6px;
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
          top: 80px;
          left: 50%;
          transform: translateX(-50%) rotate(180deg);
          font-size: 40px;
          z-index: 5;
          transition: left 0.05s ease, top 0.3s ease;
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
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          z-index: 20;
        ">
          <div style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">Game Over!</div>
          <div style="font-size: 9px; font-weight: 400; margin-bottom: 6px;">Score: <span id="final-score">0</span></div>
          <button id="restart-btn" style="
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 10px;
            font-weight: 700;
            padding: 0;
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
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          z-index: 20;
        ">
          <div style="font-size: 12px; font-weight: bold; margin-bottom: 6px;">Snowboard Surfer</div>
          <div style="font-size: 8px; font-weight: 400; margin-bottom: 6px; opacity: 0.8;">
            Swipe left/right to switch lanes<br>
            Swipe up to jump<br>
            Avoid obstacles!
          </div>
          <button id="start-btn" style="
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 10px;
            font-weight: 700;
            padding: 0;
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

  const lanes = [16.67, 50, 83.33]; // exact 1/3 positioning for each lane
  const obstacleTypes = ["🌲", "🪨", "⛰️"];

  function updatePlayerPosition() {
    playerEl.style.left = `${lanes[playerLane]}%`;
    playerEl.style.top = isJumping ? "20px" : "80px";
  }

  function createObstacle() {
    const lane = Math.floor(Math.random() * 3);
    const type =
      obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

    const obstacle = document.createElement("div");
    const containerHeight = gameContainer.clientHeight;
    obstacle.style.cssText = `
      position: absolute;
      bottom: -50px;
      left: ${lanes[lane]}%;
      transform: translateX(-50%) rotate(180deg);
      font-size: 40px;
      z-index: 4;
      text-align: center;
    `;
    obstacle.textContent = type;
    obstacle.dataset.lane = lane;

    obstaclesEl.appendChild(obstacle);
    obstacles.push({ el: obstacle, lane, y: containerHeight + 50 });
  }

  function gameLoop() {
    if (!gameRunning) return;

    // Move obstacles upward (downhill feel)
    obstacles.forEach((obs, index) => {
      obs.y -= gameSpeed;
      obs.el.style.bottom = `${gameContainer.clientHeight - obs.y}px`;

      // Check collision
      const playerTop = isJumping ? 20 : 80;
      const playerBottom = playerTop + 40;
      const obsTop = obs.y - 40;
      const obsBottom = obs.y;

      if (
        obs.lane === playerLane &&
        obsBottom > playerTop &&
        obsTop < playerBottom
      ) {
        endGame();
        return;
      }

      // Score when passing obstacle
      if (obs.y < 0 && !obs.scored) {
        obs.scored = true;
        score += 10;
        scoreEl.textContent = score;

        // Increase difficulty
        if (score % 100 === 0) {
          gameSpeed += 0.5;
        }
      }

      // Remove off-screen obstacles
      if (obs.y < -50) {
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

  // Mouse swipe controls
  let mouseStartX = 0;

  gameContainer.addEventListener("mousedown", (e) => {
    if (!gameRunning) return;
    mouseStartX = e.clientX;
  });

  gameContainer.addEventListener("mousemove", (e) => {
    if (!gameRunning || mouseStartX === 0) return;

    const dx = e.clientX - mouseStartX;

    // Instant lane switching on any horizontal movement
    if (dx > 5 && playerLane < 2) {
      playerLane++;
      updatePlayerPosition();
      mouseStartX = e.clientX; // Reset for continuous swipes
    } else if (dx < -5 && playerLane > 0) {
      playerLane--;
      updatePlayerPosition();
      mouseStartX = e.clientX; // Reset for continuous swipes
    }
  });

  gameContainer.addEventListener("mouseup", () => {
    mouseStartX = 0;
  });

  gameContainer.addEventListener("mouseleave", () => {
    mouseStartX = 0;
  });

  // Touch controls
  let touchStartX = 0;

  gameContainer.addEventListener("touchstart", (e) => {
    if (!gameRunning) return;
    touchStartX = e.touches[0].clientX;
  });

  gameContainer.addEventListener("touchmove", (e) => {
    if (!gameRunning || touchStartX === 0) return;

    const dx = e.touches[0].clientX - touchStartX;

    // Instant lane switching on any horizontal movement
    if (dx > 5 && playerLane < 2) {
      playerLane++;
      updatePlayerPosition();
      touchStartX = e.touches[0].clientX;
    } else if (dx < -5 && playerLane > 0) {
      playerLane--;
      updatePlayerPosition();
      touchStartX = e.touches[0].clientX;
    }
  });

  gameContainer.addEventListener("touchend", () => {
    touchStartX = 0;
  });

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);

  updatePlayerPosition();
}
