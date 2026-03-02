// ISS Tracker Module for Momentos
export const metadata = {
  id: "iss-tracker",
  name: "ISS Tracker",
  description: "Track the International Space Station in real-time",
  size: "2x1",
  links: [
    { label: "Spot The Station", url: "https://spotthestation.nasa.gov/" },
  ],
};

export async function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  container.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 8px;
      border-radius: 4px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="flex: 1;">
        <div style="font-size: 9px; font-weight: 400; margin-bottom: 4px; margin-right: 12px;">
          🛰️ ISS Location
        </div>
        <div id="iss-coords" style="font-size: 8px; font-weight: 400; opacity: 0.7; margin-bottom: 2px;">
          Loading...
        </div>
        <div id="iss-speed" style="font-size: 8px; font-weight: 400; opacity: 0.7;"></div>
      </div>
      <div style="font-size: 28px;">🌍</div>
    </div>
  `;

  const coordsEl = container.querySelector("#iss-coords");
  const speedEl = container.querySelector("#iss-speed");

  async function fetchISS() {
    try {
      const response = await fetch(
        "https://api.wheretheiss.at/v1/satellites/25544",
      );
      const data = await response.json();

      const lat = parseFloat(data.latitude).toFixed(2);
      const lon = parseFloat(data.longitude).toFixed(2);
      const speed = parseFloat(data.velocity).toFixed(0);
      const altitude = parseFloat(data.altitude).toFixed(0);

      coordsEl.textContent = `Lat: ${lat}°, Lon: ${lon}°`;
      speedEl.textContent = `Speed: ${speed} km/h • Alt: ${altitude} km`;
    } catch (error) {
      coordsEl.textContent = "Unable to track ISS";
      speedEl.textContent = "";
      console.error("Failed to fetch ISS data:", error);
    }
  }

  await fetchISS();
  const interval = setInterval(fetchISS, 5000);

  return () => clearInterval(interval);
}
