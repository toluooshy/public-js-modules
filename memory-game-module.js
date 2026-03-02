// Memory Game Module for Momentos
export const metadata = {
  id: "memory-game",
  name: "Memory Game",
  description: "Match the emoji pairs",
  size: "2x2",
  links: [],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  const emojis = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍉", "🥝", "🍒"];
  let cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  let flipped = [];
  let matched = [];

  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 6px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      ">
        <div style="font-size: 10px; font-weight: bold;">🧠 Memory</div>
        <button id="restart-btn" style="
          padding: 2px 4px;
          background: ${isDark ? "#4a9eff" : "#2563eb"};
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 7px;
          font-weight: 400;
        ">
          Restart
        </button>
      </div>
      <div id="game-grid" style="
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
        flex: 1;
      "></div>
      <div id="status" style="
        text-align: center;
        margin-top: 4px;
        font-size: 8px;
        font-weight: 400;
        opacity: 0.7;
      ">
        Match all pairs!
      </div>
    </div>
  `;

  const grid = container.querySelector("#game-grid");
  const status = container.querySelector("#status");
  const restartBtn = container.querySelector("#restart-btn");

  function createCard(emoji, index) {
    const card = document.createElement("div");
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.style.cssText = `
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s;
    `;
    card.textContent = "?";

    card.addEventListener("click", () => {
      if (
        flipped.length < 2 &&
        !flipped.includes(index) &&
        !matched.includes(index)
      ) {
        card.textContent = emoji;
        card.style.background = isDark
          ? "rgba(74,158,255,0.3)"
          : "rgba(37,99,235,0.3)";
        flipped.push(index);

        if (flipped.length === 2) {
          const [first, second] = flipped;
          if (cards[first] === cards[second]) {
            matched.push(first, second);
            flipped = [];

            if (matched.length === cards.length) {
              status.textContent = "🎉 You won!";
            }
          } else {
            setTimeout(() => {
              grid.children[first].textContent = "?";
              grid.children[first].style.background = isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)";
              grid.children[second].textContent = "?";
              grid.children[second].style.background = isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)";
              flipped = [];
            }, 800);
          }
        }
      }
    });

    return card;
  }

  function initGame() {
    cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    flipped = [];
    matched = [];
    grid.innerHTML = "";
    status.textContent = "Match all pairs!";

    cards.forEach((emoji, index) => {
      grid.appendChild(createCard(emoji, index));
    });
  }

  restartBtn.addEventListener("click", initGame);
  initGame();
}
