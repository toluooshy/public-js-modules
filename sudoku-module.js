// Sudoku Game Module for Momentos
export const metadata = {
  id: "sudoku-game",
  name: "Sudoku",
  description: "Classic number puzzle game",
  size: "2x2",
  links: [],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  let board = [];
  let solution = [];
  let selected = null;

  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 6px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"};
      border-radius: 6px;
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      ">
        <div style="font-size: 10px; font-weight: bold;">Sudoku</div>
        <button id="new-game-btn" style="
          padding: 2px 4px;
          background: ${isDark ? "#4a9eff" : "#2563eb"};
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 7px;
          font-weight: 400;
        ">
          New Game
        </button>
      </div>
      <div id="sudoku-board" style="
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        gap: 0.5px;
        background: ${isDark ? "#666" : "#ccc"};
        border: 1px solid ${isDark ? "#666" : "#333"};
        margin-bottom: 4px;
        aspect-ratio: 1;
      "></div>
      <div style="
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        gap: 4px;
      " id="number-pad"></div>
    </div>
  `;

  const boardEl = container.querySelector("#sudoku-board");
  const padEl = container.querySelector("#number-pad");
  const newGameBtn = container.querySelector("#new-game-btn");

  function generateSudoku() {
    // Create a simple valid sudoku (for demo - using a template)
    const template = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ];

    const solutionTemplate = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];

    board = template.map((row) => [...row]);
    solution = solutionTemplate.map((row) => [...row]);
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = document.createElement("div");
        const value = board[i][j];
        const isFixed = value !== 0;
        const isSelected = selected && selected.i === i && selected.j === j;

        cell.style.cssText = `
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${isSelected ? (isDark ? "#4a9eff" : "#93c5fd") : isDark ? "#2a2a2a" : "#fff"};
          color: ${isFixed ? (isDark ? "#60a5fa" : "#2563eb") : isDark ? "#fff" : "#000"};
          font-size: 14px;
          font-weight: 400;
          cursor: ${isFixed ? "default" : "pointer"};
          ${(j + 1) % 3 === 0 && j < 8 ? `border-right: 2px solid ${isDark ? "#666" : "#333"};` : ""}
          ${(i + 1) % 3 === 0 && i < 8 ? `border-bottom: 2px solid ${isDark ? "#666" : "#333"};` : ""}
        `;

        cell.textContent = value || "";

        if (!isFixed) {
          cell.addEventListener("click", () => {
            selected = { i, j };
            renderBoard();
          });
        }

        boardEl.appendChild(cell);
      }
    }
  }

  function createNumberPad() {
    for (let num = 1; num <= 9; num++) {
      const btn = document.createElement("button");
      btn.textContent = num;
      btn.style.cssText = `
        aspect-ratio: 1;
        background: ${isDark ? "#4a9eff" : "#2563eb"};
        color: white;
        border: none;
        border-radius: 2px;
        cursor: pointer;
        font-size: 9px;
        font-weight: 400;
      `;

      btn.addEventListener("click", () => {
        if (selected) {
          board[selected.i][selected.j] = num;

          // Check if correct
          if (num === solution[selected.i][selected.j]) {
            // Check if puzzle is complete
            if (
              board.every((row, i) =>
                row.every((val, j) => val === solution[i][j]),
              )
            ) {
              setTimeout(() => alert("Congratulations! You solved it!"), 100);
            }
          }

          renderBoard();
        }
      });

      padEl.appendChild(btn);
    }
  }

  newGameBtn.addEventListener("click", () => {
    generateSudoku();
    selected = null;
    renderBoard();
  });

  generateSudoku();
  renderBoard();
  createNumberPad();
}
