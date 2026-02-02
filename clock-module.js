// Clock Module for Momentos

export const metadata = {
  id: "clock",
  name: "Clock",
  description: "Local time",
  size: "1x1",
  links: [
    { label: "Source Code", url: "https://github.com/example/clock-module" },
    { label: "Documentation", url: "https://docs.example.com/clock" },
  ],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  // Create clock display
  container.innerHTML = `
    <div 
      id="clock" 
      style="
        font-size: 24px; 
        font-weight: bold; 
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: ${isDark ? "#ffffff" : "#1a1a1a"};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      "
    ></div>
  `;

  const clockEl = container.querySelector("#clock");

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;
  }

  updateClock();
  const interval = setInterval(updateClock, 1000);

  // Cleanup function
  return () => {
    clearInterval(interval);
  };
}

export default render;
