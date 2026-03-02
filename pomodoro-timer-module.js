// Pomodoro Timer Module for Momentos
export const metadata = {
  id: "pomodoro-timer",
  name: "Pomodoro Timer",
  description: "25-minute productivity timer",
  size: "1x1",
  links: [
    {
      label: "Pomodoro Technique",
      url: "https://en.wikipedia.org/wiki/Pomodoro_Technique",
    },
  ],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  let timeLeft = 25 * 60; // 25 minutes in seconds
  let isRunning = false;
  let interval = null;

  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 16px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"};
      border-radius: 8px;
    ">
      <div style="font-size: 12px; opacity: 0.6; margin-bottom: 8px;">
        🍅 Pomodoro
      </div>
      <div id="timer-display" style="
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 12px;
        font-family: 'Monaco', 'Courier New', monospace;
      ">
        25:00
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="start-btn" style="
          padding: 6px 12px;
          background: ${isDark ? "#10b981" : "#059669"};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        ">
          Start
        </button>
        <button id="reset-btn" style="
          padding: 6px 12px;
          background: ${isDark ? "#ef4444" : "#dc2626"};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        ">
          Reset
        </button>
      </div>
    </div>
  `;

  const displayEl = container.querySelector("#timer-display");
  const startBtn = container.querySelector("#start-btn");
  const resetBtn = container.querySelector("#reset-btn");

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    displayEl.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function startTimer() {
    if (isRunning) {
      // Pause
      clearInterval(interval);
      isRunning = false;
      startBtn.textContent = "Start";
    } else {
      // Start
      isRunning = true;
      startBtn.textContent = "Pause";
      interval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
          clearInterval(interval);
          isRunning = false;
          startBtn.textContent = "Start";
          timeLeft = 25 * 60;
          displayEl.textContent = "Done! 🎉";
          setTimeout(() => updateDisplay(), 2000);
        }
      }, 1000);
    }
  }

  function resetTimer() {
    clearInterval(interval);
    isRunning = false;
    timeLeft = 25 * 60;
    startBtn.textContent = "Start";
    updateDisplay();
  }

  startBtn.addEventListener("click", startTimer);
  resetBtn.addEventListener("click", resetTimer);

  return () => {
    if (interval) clearInterval(interval);
  };
}
