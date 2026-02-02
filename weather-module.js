// Weather Module for Momentos (Dynamic, location-based, no API key)
export const metadata = {
  id: "weather",
  name: "Weather",
  description: "Current weather based on user location (no API key)",
  size: "2x1",
  links: [
    { label: "Weather.com", url: "https://weather.com" },
    { label: "Open-Meteo API", url: "https://open-meteo.com" },
  ],
};

// Map Open-Meteo weather codes to emoji + description
const weatherCodeMap = {
  0: { icon: "☀️", desc: "Clear sky" },
  1: { icon: "🌤️", desc: "Mainly clear" },
  2: { icon: "⛅", desc: "Partly cloudy" },
  3: { icon: "☁️", desc: "Overcast" },
  45: { icon: "🌫️", desc: "Fog" },
  48: { icon: "🌫️", desc: "Depositing rime fog" },
  51: { icon: "🌦️", desc: "Light drizzle" },
  53: { icon: "🌦️", desc: "Moderate drizzle" },
  55: { icon: "🌦️", desc: "Dense drizzle" },
  61: { icon: "🌧️", desc: "Slight rain" },
  63: { icon: "🌧️", desc: "Moderate rain" },
  65: { icon: "🌧️", desc: "Heavy rain" },
  71: { icon: "🌨️", desc: "Slight snow" },
  73: { icon: "🌨️", desc: "Moderate snow" },
  75: { icon: "🌨️", desc: "Heavy snow" },
  80: { icon: "🌧️", desc: "Rain showers" },
  81: { icon: "🌧️", desc: "Moderate showers" },
  82: { icon: "🌧️", desc: "Violent showers" },
  95: { icon: "⛈️", desc: "Thunderstorm" },
  99: { icon: "⛈️", desc: "Severe thunderstorm" },
};

export async function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  // Initial loading display
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
    ">Detecting your location and fetching weather...</div>
  `;

  try {
    // 1️⃣ Get user geolocation
    const position = await new Promise((resolve, reject) => {
      if (!navigator.geolocation)
        reject(new Error("Geolocation not supported"));
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    // 2️⃣ Fetch weather from Open-Meteo
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
    );
    if (!weatherRes.ok)
      throw new Error(`Weather API error: ${weatherRes.status}`);
    const data = await weatherRes.json();

    const temp = Math.round(data.current_weather.temperature);
    const code = data.current_weather.weathercode;
    const weather = weatherCodeMap[code] || { icon: "❓", desc: "Unknown" };

    // 3️⃣ Render weather display
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
        <div style="font-size: 48px; margin-bottom: 10px;">${weather.icon}</div>
        <div style="font-size: 24px; font-weight: bold;">${temp}°C</div>
        <div style="font-size: 14px; opacity: 0.7; margin-top: 5px;">${weather.desc}</div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div style="color:red; text-align:center;">Failed to load weather: ${err.message}</div>`;
  }

  return () => {
    console.log("Weather module cleaned up");
  };
}

export default render;
