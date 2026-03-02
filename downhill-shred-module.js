// Downhill Shred Game Module for Momentos
export const metadata = {
  id: "downhill-shred",
  name: "Downhill Shred",
  description: "Shred downhill and dodge obstacles",
  size: "2x2",
  links: [],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  let gameRunning = false;
  let score = 0;
  let playerLane = 1; // 0 = left, 1 = middle, 2 = right
  let playerDirection = 0; // -1 = left, 0 = center/neutral, 1 = right
  let playerEmoji = "⛷️"; // randomly chosen each game
  let isJumping = false;
  let obstacles = [];
  let gameSpeed = 2; // start slower
  let gameTime = 0; // track time for gradual speed increase
  let lastSpawnFrame = 0; // track when we last spawned
  let lastPattern = null; // track last obstacle pattern
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
        <div style="font-size: 10px; font-weight: 400;">🏂 Downhill Shred</div>
        <div style="font-size: 10px; font-weight: 400;">Score: <span id="score">0</span></div>
      </div>
      
      <div id="game-container" style="
        flex: 1;
        position: relative;
        background: linear-gradient(to bottom, #e7e7e7 0%, #cccccc 100%);
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
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 40px;
          z-index: 5;
          transition: left 0.05s ease, top 0.3s ease, transform 0.05s ease;
        ">⛷️</div>
        
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
          <div style="font-size: 12px; font-weight: bold; margin-bottom: 6px;">Downhill Shred</div>
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
    playerEl.style.top = isJumping ? "5px" : "20px";
    playerEl.textContent = playerEmoji;

    // Flip emoji based on direction
    if (playerDirection === 1) {
      playerEl.style.transform = "translateX(-50%) scaleX(-1)";
    } else {
      playerEl.style.transform = "translateX(-50%)";
    }
  }

  // Valid obstacle patterns (never all 3 lanes)
  const validPatterns = [
    [0, 0, 1], // only right
    [0, 1, 0], // only middle
    [1, 0, 0], // only left
    [1, 0, 1], // left and right
    [1, 1, 0], // left and middle
    [0, 1, 1], // middle and right
  ];

  function createObstacleWave(pattern) {
    const containerHeight = gameContainer.clientHeight;
    const spawnY = containerHeight + 50;

    pattern.forEach((hasObstacle, laneIndex) => {
      if (hasObstacle === 1) {
        const type =
          obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

        const obstacle = document.createElement("div");
        obstacle.style.cssText = `
          position: absolute;
          bottom: -50px;
          left: ${lanes[laneIndex]}%;
          transform: translateX(-50%);
          font-size: 40px;
          z-index: 4;
          text-align: center;
        `;
        obstacle.textContent = type;
        obstacle.dataset.lane = laneIndex;

        obstaclesEl.appendChild(obstacle);
        obstacles.push({ el: obstacle, lane: laneIndex, y: spawnY });
      }
    });

    lastPattern = pattern;
  }

  function getNextPattern() {
    // Get patterns that leave at least one lane open with previous pattern
    let availablePatterns = validPatterns.filter((pattern) => {
      if (!lastPattern) return true;

      // Check if at least one lane is clear in both patterns
      let hasCommonClearLane = false;
      for (let i = 0; i < 3; i++) {
        if (lastPattern[i] === 0 && pattern[i] === 0) {
          hasCommonClearLane = true;
          break;
        }
      }

      return hasCommonClearLane;
    });

    // Fallback to all patterns if none available
    if (availablePatterns.length === 0) {
      availablePatterns = validPatterns;
    }

    return availablePatterns[
      Math.floor(Math.random() * availablePatterns.length)
    ];
  }

  function gameLoop() {
    if (!gameRunning) return;

    // Gradually increase speed over time
    gameTime++;
    if (gameTime % 100 === 0) {
      gameSpeed += 0.15;
    }

    // Move obstacles upward (downhill feel)
    obstacles.forEach((obs, index) => {
      obs.y -= gameSpeed;
      obs.el.style.bottom = `${gameContainer.clientHeight - obs.y}px`;

      // Check collision
      const playerTop = isJumping ? 5 : 20;
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
      }

      // Remove off-screen obstacles
      if (obs.y < -50) {
        obs.el.remove();
        obstacles.splice(index, 1);
      }
    });

    // Create new obstacle waves at consistent intervals
    const framesBetweenWaves = 50; // frames between spawning new waves
    if (gameTime - lastSpawnFrame > framesBetweenWaves) {
      const pattern = getNextPattern();
      createObstacleWave(pattern);
      lastSpawnFrame = gameTime;
    }

    animationFrame = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    gameRunning = true;
    score = 0;
    playerLane = 1;
    playerDirection = 0;
    playerEmoji = Math.random() < 0.5 ? "⛷️" : "🏂"; // randomly choose skier or snowboarder
    isJumping = false;
    obstacles = [];
    gameSpeed = 2; // start slow
    gameTime = 0;
    lastSpawnFrame = 0;
    lastPattern = null;
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
  let swipeLocked = false;

  gameContainer.addEventListener("mousedown", (e) => {
    if (!gameRunning) return;
    mouseStartX = e.clientX;
    swipeLocked = false;
  });

  gameContainer.addEventListener("mousemove", (e) => {
    if (!gameRunning || mouseStartX === 0 || swipeLocked) return;

    const dx = e.clientX - mouseStartX;

    // One lane switch per swipe
    if (dx > 30 && playerLane < 2) {
      playerLane++;
      playerDirection = 1; // moving right
      updatePlayerPosition();
      swipeLocked = true;
    } else if (dx < -30 && playerLane > 0) {
      playerLane--;
      playerDirection = -1; // moving left
      updatePlayerPosition();
      swipeLocked = true;
    }
  });

  gameContainer.addEventListener("mouseup", () => {
    mouseStartX = 0;
    swipeLocked = false;
  });

  gameContainer.addEventListener("mouseleave", () => {
    mouseStartX = 0;
    swipeLocked = false;
  });

  // Touch controls
  let touchStartX = 0;
  let touchSwipeLocked = false;

  gameContainer.addEventListener("touchstart", (e) => {
    if (!gameRunning) return;
    touchStartX = e.touches[0].clientX;
    touchSwipeLocked = false;
  });

  gameContainer.addEventListener("touchmove", (e) => {
    if (!gameRunning || touchStartX === 0 || touchSwipeLocked) return;

    const dx = e.touches[0].clientX - touchStartX;

    // One lane switch per swipe
    if (dx > 30 && playerLane < 2) {
      playerLane++;
      playerDirection = 1; // moving right
      updatePlayerPosition();
      touchSwipeLocked = true;
    } else if (dx < -30 && playerLane > 0) {
      playerLane--;
      playerDirection = -1; // moving left
      updatePlayerPosition();
      touchSwipeLocked = true;
    }
  });

  gameContainer.addEventListener("touchend", () => {
    touchStartX = 0;
    touchSwipeLocked = false;
  });

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);

  updatePlayerPosition();
}
