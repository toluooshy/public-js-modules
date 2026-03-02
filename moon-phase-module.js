// Moon Phase Module for Momentos
export const metadata = {
  id: "moon-phase",
  name: "Moon Phase",
  description: "Current moon phase and illumination",
  size: "1x1",
  links: [{ label: "NASA Moon", url: "https://moon.nasa.gov/" }],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  // Calculate moon phase
  function getMoonPhase() {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDate();

    let c = 0,
      e = 0,
      jd = 0,
      b = 0;

    if (month < 3) {
      year--;
      month += 12;
    }

    ++month;
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    b = parseInt(jd);
    jd -= b;
    b = Math.round(jd * 8);

    if (b >= 8) b = 0;

    const phases = [
      { emoji: "🌑", name: "New Moon" },
      { emoji: "🌒", name: "Waxing Crescent" },
      { emoji: "🌓", name: "First Quarter" },
      { emoji: "🌔", name: "Waxing Gibbous" },
      { emoji: "🌕", name: "Full Moon" },
      { emoji: "🌖", name: "Waning Gibbous" },
      { emoji: "🌗", name: "Last Quarter" },
      { emoji: "🌘", name: "Waning Crescent" },
    ];

    return phases[b];
  }

  const phase = getMoonPhase();

  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 4px;
      border-radius: 4px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="font-size: 7px; font-weight: 400; opacity: 0.6; margin-bottom: 2px;">
        Moon Phase
      </div>
      <div style="font-size: 28px; margin-bottom: 2px;">
        ${phase.emoji}
      </div>
      <div style="font-size: 7px; font-weight: 400; opacity: 0.8; text-align: center;">
        ${phase.name}
      </div>
    </div>
  `;
}
