// Example remote ES module for Momentos
// This file demonstrates the expected format for remote modules

/**
 * Module metadata - contains info displayed in the drawer
 */
export const metadata = {
  id: "remote-counter",
  name: "Remote Counter",
  description: "Counter loaded from remote ES module",
  size: "1x1",
  links: [
    {
      label: "Module Source",
      url: "https://github.com/example/counter-module",
    },
  ],
};

/**
 * Main render function - called when the module is loaded
 * @param {HTMLElement} container - The container div to render into
 * @param {Object} options - Options including theme
 */
export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  // Create a simple counter example
  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 20px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="font-size: 14px; opacity: 0.7; margin-bottom: 10px;">
        Remote Module Example
      </div>
      <div style="font-size: 48px; font-weight: bold; margin-bottom: 20px;" id="counter">
        0
      </div>
      <button id="increment-btn" style="
        padding: 8px 16px;
        background: ${isDark ? "#4a9eff" : "#2563eb"};
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      ">
        Increment
      </button>
    </div>
  `;

  // Add interactivity
  let count = 0;
  const counterEl = container.querySelector("#counter");
  const btn = container.querySelector("#increment-btn");

  btn.addEventListener("click", () => {
    count++;
    counterEl.textContent = count;
  });

  // Cleanup function (optional)
  return () => {
    console.log("Module cleaned up");
  };
}

// Alternative: export as default
export default render;
