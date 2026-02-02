// Weather Module for Momentos

export const metadata = {
  id: "weather",
  name: "Weather",
  description: "Forecast",
  size: "2x1",
  links: [
    { label: "Weather.com", url: "https://weather.com" },
    { label: "API Documentation", url: "https://docs.example.com/weather-api" },
  ],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  // Create weather display
  container.innerHTML = `
    <div style="
      padding: 20px; 
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="font-size: 48px; margin-bottom: 10px;">☀️</div>
      <div style="font-size: 24px; font-weight: bold;">72°F</div>
      <div style="font-size: 14px; opacity: 0.7; margin-top: 5px;">Sunny</div>
    </div>
  `;

  // No cleanup needed for static content
  return () => {
    console.log("Weather module cleaned up");
  };
}

export default render;
