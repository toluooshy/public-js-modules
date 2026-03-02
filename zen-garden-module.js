// Zen Garden Module for Momentos
export const metadata = {
  id: "zen-garden",
  name: "Zen Garden",
  description: "Interactive sand garden for relaxation",
  size: "2x2",
  links: [],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

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
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      ">
        <div style="font-size: 10px; font-weight: 400;">🧿 Zen Garden</div>
        <button id="clear-btn" style="
          background: none;
          border: none;
          color: ${isDark ? "#ffffff" : "#1a1a1a"};
          cursor: pointer;
          font-size: 9px;
          font-weight: 700;
          padding: 0;
        ">
          Clear
        </button>
      </div>
      <canvas id="zen-canvas" style="
        flex: 1;
        background: ${isDark ? "#3a3a2a" : "#e8d5b7"};
        border-radius: 6px;
        cursor: crosshair;
      "></canvas>
      <div style="
        text-align: center;
        margin-top: 4px;
        font-size: 7px;
        font-weight: 400;
        opacity: 0.6;
      ">
        Click and drag to create patterns
      </div>
    </div>
  `;

  const canvas = container.querySelector("#zen-canvas");
  const ctx = canvas.getContext("2d");
  const clearBtn = container.querySelector("#clear-btn");

  // Set canvas size
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Add some rocks
  function drawRock(x, y, size) {
    ctx.fillStyle = isDark ? "#666666" : "#8b7355";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  function initGarden() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add decorative rocks
    const rocks = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, size: 15 },
      { x: canvas.width * 0.7, y: canvas.height * 0.6, size: 20 },
      { x: canvas.width * 0.5, y: canvas.height * 0.7, size: 12 },
    ];

    rocks.forEach((rock) => drawRock(rock.x, rock.y, rock.size));
  }

  function draw(x, y) {
    if (!isDrawing) return;

    ctx.strokeStyle = isDark
      ? "rgba(200, 200, 180, 0.3)"
      : "rgba(139, 115, 85, 0.3)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Create zen pattern effect
    const angle = Math.atan2(y - lastY, x - lastX);
    const perpAngle1 = angle + Math.PI / 2;
    const perpAngle2 = angle - Math.PI / 2;
    const offset = 4;

    ctx.beginPath();
    ctx.moveTo(
      lastX + Math.cos(perpAngle1) * offset,
      lastY + Math.sin(perpAngle1) * offset,
    );
    ctx.lineTo(
      x + Math.cos(perpAngle1) * offset,
      y + Math.sin(perpAngle1) * offset,
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(
      lastX + Math.cos(perpAngle2) * offset,
      lastY + Math.sin(perpAngle2) * offset,
    );
    ctx.lineTo(
      x + Math.cos(perpAngle2) * offset,
      y + Math.sin(perpAngle2) * offset,
    );
    ctx.stroke();

    lastX = x;
    lastY = y;
  }

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    draw(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
  });

  clearBtn.addEventListener("click", initGarden);

  initGarden();
}
