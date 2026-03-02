// Minesweeper Game Module for Momentos
export const metadata = {
  id: "minesweeper-game",
  name: "Minesweeper",
  description: "Classic mine detection game",
  size: "2x2",
  links: [],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  const ROWS = 10;
  const COLS = 10;
  const MINES = 15;

  let board = [];
  let revealed = [];
  let flagged = [];
  let gameOver = false;
  let firstClick = true;

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
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      ">
        <div style="font-size: 14px; font-weight: bold;">💣 Minesweeper</div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <div style="font-size: 12px;">Mines: ${MINES}</div>
          <button id="restart-btn" style="
            padding: 4px 8px;
            background: ${isDark ? "#4a9eff" : "#2563eb"};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
          ">
            New Game
          </button>
        </div>
      </div>
      <div id="game-board" style="
        flex: 1;
        display: grid;
        grid-template-columns: repeat(${COLS}, 1fr);
        gap: 2px;
        background: ${isDark ? "#333" : "#999"};
        padding: 2px;
        border-radius: 4px;
      "></div>
      <div style="font-size: 10px; opacity: 0.6; margin-top: 4px; text-align: center;">
        Click to reveal • Right-click to flag
      </div>
    </div>
  `;

  const boardEl = container.querySelector("#game-board");
  const restartBtn = container.querySelector("#restart-btn");

  function initGame() {
    board = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0));
    revealed = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(false));
    flagged = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(false));
    gameOver = false;
    firstClick = true;
    renderBoard();
  }

  function placeMines(avoidRow, avoidCol) {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);

      // Don't place mine on first click or adjacent cells
      const isSafe =
        Math.abs(row - avoidRow) <= 1 && Math.abs(col - avoidCol) <= 1;

      if (board[row][col] !== -1 && !isSafe) {
        board[row][col] = -1;
        minesPlaced++;
      }
    }

    // Calculate numbers
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (board[i][j] !== -1) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (
                ni >= 0 &&
                ni < ROWS &&
                nj >= 0 &&
                nj < COLS &&
                board[ni][nj] === -1
              ) {
                count++;
              }
            }
          }
          board[i][j] = count;
        }
      }
    }
  }

  function revealCell(row, col) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
    if (revealed[row][col] || flagged[row][col]) return;

    if (firstClick) {
      placeMines(row, col);
      firstClick = false;
    }

    revealed[row][col] = true;

    if (board[row][col] === -1) {
      gameOver = true;
      revealAll();
      renderBoard();
      setTimeout(() => alert("Game Over! You hit a mine! 💥"), 100);
      return;
    }

    if (board[row][col] === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          revealCell(row + di, col + dj);
        }
      }
    }

    renderBoard();
    checkWin();
  }

  function revealAll() {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        revealed[i][j] = true;
      }
    }
  }

  function checkWin() {
    let unrevealed = 0;
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (!revealed[i][j] && board[i][j] !== -1) unrevealed++;
      }
    }

    if (unrevealed === 0) {
      gameOver = true;
      setTimeout(() => alert("Congratulations! You won! 🎉"), 100);
    }
  }

  function renderBoard() {
    boardEl.innerHTML = "";

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const cell = document.createElement("div");
        const isRevealed = revealed[i][j];
        const isFlagged = flagged[i][j];
        const value = board[i][j];

        const numberColors = {
          1: "#0000ff",
          2: "#008000",
          3: "#ff0000",
          4: "#000080",
          5: "#800000",
          6: "#008080",
          7: "#000000",
          8: "#808080",
        };

        cell.style.cssText = `
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${
            isRevealed
              ? isDark
                ? "#1a1a1a"
                : "#ddd"
              : isDark
                ? "#444"
                : "#bbb"
          };
          color: ${numberColors[value] || "#000"};
          font-size: 12px;
          font-weight: bold;
          cursor: ${gameOver || isRevealed ? "default" : "pointer"};
          border-radius: 2px;
        `;

        if (isFlagged) {
          cell.textContent = "🚩";
        } else if (isRevealed) {
          if (value === -1) {
            cell.textContent = "💣";
            cell.style.background = "#ff0000";
          } else if (value > 0) {
            cell.textContent = value;
          }
        }

        cell.addEventListener("click", () => {
          if (!gameOver && !isFlagged) {
            revealCell(i, j);
          }
        });

        cell.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          if (!gameOver && !isRevealed) {
            flagged[i][j] = !flagged[i][j];
            renderBoard();
          }
        });

        boardEl.appendChild(cell);
      }
    }
  }

  restartBtn.addEventListener("click", initGame);
  initGame();
}
