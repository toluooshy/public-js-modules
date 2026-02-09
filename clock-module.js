// Clock Module for Momentos

export const metadata = {
  id: "clock",
  name: "Clock",
  description: "Local time",
  size: "1x1",
  intendedSize: { width: 120, height: 120 }, // Dev-intended size for 1x1
  links: [
    { label: "Source Code", url: "https://github.com/example/clock-module" },
    { label: "Documentation", url: "https://docs.example.com/clock" },
  ],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  // Calculate zoom scale based on container vs intended size
  const intendedWidth = metadata.intendedSize?.width || 120;
  const intendedHeight = metadata.intendedSize?.height || 120;
  const scaleX = container.clientWidth / intendedWidth;
  const scaleY = container.clientHeight / intendedHeight;
  const scale = Math.min(scaleX, scaleY);

  // Create clock display
  container.innerHTML = `
    <div 
      id="clock" 
      style="
        font-size: ${Math.max(16, 20 * scale)}px; 
        font-weight: 400; 
        text-align: center;
        display: flex;
        flex-direction: column;
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
    // Format: Feb 9, 2026 7:30:12 PM
    const dateStr = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    clockEl.textContent = dateStr;
  }

  updateClock();
  const interval = setInterval(updateClock, 1000);

  // Cleanup function
  return () => {
    clearInterval(interval);
  };
}

export default render;
