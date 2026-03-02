// Color Palette Module for Momentos
export const metadata = {
  id: "color-palette",
  name: "Color Palette",
  description: "Random color palette generator",
  size: "2x1",
  links: [{ label: "Coolors", url: "https://coolors.co/" }],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  function generateColor() {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  }

  function generatePalette() {
    return Array.from({ length: 5 }, generateColor);
  }

  let palette = generatePalette();

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
        <div style="font-size: 10px; font-weight: bold;">🎨 Color Palette</div>
        <button id="generate-btn" style="
          padding: 2px 4px;
          background: ${isDark ? "#4a9eff" : "#2563eb"};
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 8px;
          font-weight: 400;
        ">
          Generate
        </button>
      </div>
      <div id="palette-container" style="
        display: flex;
        gap: 4px;
        flex: 1;
      "></div>
    </div>
  `;

  const paletteContainer = container.querySelector("#palette-container");
  const generateBtn = container.querySelector("#generate-btn");

  function renderPalette() {
    paletteContainer.innerHTML = palette
      .map(
        (color) => `
      <div style="
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: ${color};
        border-radius: 6px;
        cursor: pointer;
        transition: transform 0.2s;
      " 
      onclick="navigator.clipboard.writeText('${color}')"
      title="Click to copy ${color}">
        <div style="
          margin-top: auto;
          padding: 2px 3px;
          background: rgba(0,0,0,0.5);
          color: white;
          font-size: 7px;
          font-weight: 400;
          border-radius: 2px;
          margin-bottom: 2px;
          font-family: 'Monaco', 'Courier New', monospace;
        ">
          ${color}
        </div>
      </div>
    `,
      )
      .join("");
  }

  generateBtn.addEventListener("click", () => {
    palette = generatePalette();
    renderPalette();
  });

  renderPalette();
}
