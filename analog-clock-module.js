// Analog Clock Module for Momentos
export const metadata = {
  id: "analog-clock",
  name: "Analog Clock",
  description: "Classic analog clock with smooth animation",
  size: "1x1",
  links: [],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  container.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 16px;
      border-radius: 4px;
    ">
      <svg id="clock-svg" width="100%" height="100%" viewBox="0 0 200 200">
        <!-- Clock face -->
        <circle cx="100" cy="100" r="90" fill="none" 
          stroke="${isDark ? "#ffffff" : "#1a1a1a"}" 
          stroke-width="3" 
          opacity="0.2"/>
        
        <!-- Hour markers -->
        ${Array.from({ length: 12 }, (_, i) => {
          const angle = ((i * 30 - 90) * Math.PI) / 180;
          const x1 = 100 + 75 * Math.cos(angle);
          const y1 = 100 + 75 * Math.sin(angle);
          const x2 = 100 + 85 * Math.cos(angle);
          const y2 = 100 + 85 * Math.sin(angle);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
            stroke="${isDark ? "#ffffff" : "#1a1a1a"}" 
            stroke-width="3" 
            opacity="0.3"/>`;
        }).join("")}
        
        <!-- Hour hand -->
        <line id="hour-hand" x1="100" y1="100" x2="100" y2="55" 
          stroke="${isDark ? "#60a5fa" : "#2563eb"}" 
          stroke-width="6" 
          stroke-linecap="round"/>
        
        <!-- Minute hand -->
        <line id="minute-hand" x1="100" y1="100" x2="100" y2="40" 
          stroke="${isDark ? "#34d399" : "#059669"}" 
          stroke-width="4" 
          stroke-linecap="round"/>
        
        <!-- Second hand -->
        <line id="second-hand" x1="100" y1="100" x2="100" y2="30" 
          stroke="${isDark ? "#f87171" : "#dc2626"}" 
          stroke-width="2" 
          stroke-linecap="round"/>
        
        <!-- Center dot -->
        <circle cx="100" cy="100" r="6" 
          fill="${isDark ? "#ffffff" : "#1a1a1a"}"/>
      </svg>
    </div>
  `;

  const hourHand = container.querySelector("#hour-hand");
  const minuteHand = container.querySelector("#minute-hand");
  const secondHand = container.querySelector("#second-hand");

  function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Calculate angles (0 degrees is 12 o'clock)
    const secondAngle = seconds * 6; // 360/60
    const minuteAngle = minutes * 6 + seconds * 0.1; // 360/60 + smooth transition
    const hourAngle = hours * 30 + minutes * 0.5; // 360/12 + smooth transition

    // Update hand rotations
    secondHand.style.transform = `rotate(${secondAngle}deg)`;
    secondHand.style.transformOrigin = "100px 100px";

    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    minuteHand.style.transformOrigin = "100px 100px";

    hourHand.style.transform = `rotate(${hourAngle}deg)`;
    hourHand.style.transformOrigin = "100px 100px";
  }

  updateClock();
  const interval = setInterval(updateClock, 1000);

  return () => clearInterval(interval);
}
