// 2048 Game Module for Momentos
export const metadata = {
  id: "2048-game",
  name: "2048",
  description: "Combine tiles to reach 2048",
  size: "2x2",
  links: [],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  let grid = [];
  let score = 0;
  let gameOver = false;

  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 6px;
      border-radius: 4px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      ">
        <div style="font-size: 11px; font-weight: 400;">2048</div>
        <div style="display: flex; gap: 4px; align-items: center;">
          <div style="font-size: 9px; font-weight: 400;">Score: <span id="score">0</span></div>
          <button id="restart-btn" style="
            padding: 2px 4px;
            margin-right: 12px;
            background: transparent;
            color: ${isDark ? "#ffffff" : "#1a1a1a"};
            border: 1px solid ${isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"};
            border-radius: 3px;
            cursor: pointer;
            font-size: 7px;
            font-weight: 400;
          ">
            New Game
          </button>
        </div>
      </div>
      <div id="game-board" style="
        flex: 1;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
        background: ${isDark ? "rgba(0,0,0,0.2)" : "rgba(187,173,160,0.4)"};
        padding: 4px;
        border-radius: 4px;
      "></div>
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
      ">
        <div style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">Game Over!</div>
        <div style="font-size: 9px; font-weight: 400;">Final Score: <span id="final-score">0</span></div>
      </div>
    </div>
  `;

  const boardEl = container.querySelector("#game-board");
  const scoreEl = container.querySelector("#score");
  const gameOverEl = container.querySelector("#game-over");
  const finalScoreEl = container.querySelector("#final-score");
  const restartBtn = container.querySelector("#restart-btn");

  const tileColors = {
    2: { bg: "#eee4da", color: "#776e65" },
    4: { bg: "#ede0c8", color: "#776e65" },
    8: { bg: "#f2b179", color: "#f9f6f2" },
    16: { bg: "#f59563", color: "#f9f6f2" },
    32: { bg: "#f67c5f", color: "#f9f6f2" },
    64: { bg: "#f65e3b", color: "#f9f6f2" },
    128: { bg: "#edcf72", color: "#f9f6f2" },
    256: { bg: "#edcc61", color: "#f9f6f2" },
    512: { bg: "#edc850", color: "#f9f6f2" },
    1024: { bg: "#edc53f", color: "#f9f6f2" },
    2048: { bg: "#edc22e", color: "#f9f6f2" },
  };

  function initGrid() {
    grid = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    score = 0;
    gameOver = false;
    scoreEl.textContent = "0";
    gameOverEl.style.display = "none";
    addNewTile();
    addNewTile();
    renderGrid();
  }

  function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) emptyCells.push({ i, j });
      }
    }
    if (emptyCells.length > 0) {
      const { i, j } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function renderGrid() {
    boardEl.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const value = grid[i][j];
        const tile = document.createElement("div");
        const colors = tileColors[value] || { bg: "#3c3a32", color: "#f9f6f2" };

        tile.style.cssText = `
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${value ? colors.bg : isDark ? "rgba(255,255,255,0.1)" : "rgba(238,228,218,0.35)"};
          color: ${colors.color};
          font-size: ${value > 512 ? "18px" : "24px"};
          font-weight: 400;
          border-radius: 4px;
          transition: all 0.15s;
        `;
        tile.textContent = value || "";
        boardEl.appendChild(tile);
      }
    }
  }

  function move(direction) {
    let moved = false;
    const newGrid = grid.map((row) => [...row]);

    if (direction === "left" || direction === "right") {
      for (let i = 0; i < 4; i++) {
        const row = direction === "left" ? newGrid[i] : newGrid[i].reverse();
        const merged = mergeLine(row);
        if (direction === "right") merged.reverse();
        if (JSON.stringify(merged) !== JSON.stringify(grid[i])) moved = true;
        newGrid[i] = merged;
      }
    } else {
      for (let j = 0; j < 4; j++) {
        const col = newGrid.map((row) => row[j]);
        const merged =
          direction === "up"
            ? mergeLine(col)
            : mergeLine(col.reverse()).reverse();
        if (
          JSON.stringify(merged) !== JSON.stringify(grid.map((row) => row[j]))
        )
          moved = true;
        for (let i = 0; i < 4; i++) newGrid[i][j] = merged[i];
      }
    }

    if (moved) {
      grid = newGrid;
      addNewTile();
      renderGrid();
      if (checkGameOver()) {
        gameOver = true;
        finalScoreEl.textContent = score;
        gameOverEl.style.display = "block";
      }
    }
  }

  function mergeLine(line) {
    const filtered = line.filter((x) => x !== 0);
    const merged = [];
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        score += filtered[i] * 2;
        scoreEl.textContent = score;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }
    while (merged.length < 4) merged.push(0);
    return merged;
  }

  function checkGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return false;
        if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
        if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
      }
    }
    return true;
  }

  // Mouse swipe controls
  let mouseStartX = 0;
  let mouseStartY = 0;
  let isMouseDown = false;

  boardEl.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
  });

  boardEl.addEventListener("mouseup", (e) => {
    if (!isMouseDown || gameOver) return;
    isMouseDown = false;

    const mouseEndX = e.clientX;
    const mouseEndY = e.clientY;
    const dx = mouseEndX - mouseStartX;
    const dy = mouseEndY - mouseStartY;

    // Minimum swipe distance
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? "right" : "left");
      } else {
        move(dy > 0 ? "down" : "up");
      }
    }
  });

  boardEl.addEventListener("mouseleave", () => {
    isMouseDown = false;
  });

  // Touch controls
  let touchStartX = 0;
  let touchStartY = 0;

  boardEl.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  boardEl.addEventListener("touchend", (e) => {
    if (gameOver) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? "right" : "left");
    } else {
      move(dy > 0 ? "down" : "up");
    }
  });

  restartBtn.addEventListener("click", initGrid);

  initGrid();
}
