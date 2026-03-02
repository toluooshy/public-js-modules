// Nyan Cat Module for Momentos
export const metadata = {
  id: "nyancat",
  name: "Nyan Cat",
  description: "Rainbow-riding pop-tart cat animation",
  size: "2x1",
  links: [{ label: "Nyan.cat", url: "https://www.nyan.cat/" }],
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
      background: ${isDark ? "#001a33" : "#0033cc"};
      background: linear-gradient(
        ${isDark ? "180deg, #001a33, #003366" : "180deg, #0033cc, #0066ff"}
      );
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    ">
      <div id="nyan-container" style="
        display: flex;
        align-items: center;
        position: relative;
        width: 100%;
        height: 100%;
      ">
        <!-- Rainbow trail -->
        <div id="rainbow" style="
          position: absolute;
          left: 0;
          height: 40px;
          width: 0;
          background: linear-gradient(to bottom,
            #ff0000 0%, #ff0000 16.67%,
            #ff9900 16.67%, #ff9900 33.33%,
            #ffff00 33.33%, #ffff00 50%,
            #33ff00 50%, #33ff00 66.67%,
            #0099ff 66.67%, #0099ff 83.33%,
            #9933ff 83.33%, #9933ff 100%
          );
          z-index: 1;
        "></div>
        
        <!-- Nyan Cat -->
        <div id="nyan" style="
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 48px;
          z-index: 2;
          animation: float 0.5s ease-in-out infinite alternate;
        ">
          🐱🌈
        </div>
        
        <!-- Stars -->
        ${Array.from(
          { length: 15 },
          (_, i) => `
          <div style="
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            font-size: ${12 + Math.random() * 12}px;
            opacity: ${0.3 + Math.random() * 0.7};
            animation: twinkle ${1 + Math.random() * 2}s ease-in-out infinite alternate;
          ">⭐</div>
        `,
        ).join("")}
      </div>
      
      <style>
        @keyframes float {
          from {
            transform: translateX(-50%) translateY(0px);
          }
          to {
            transform: translateX(-50%) translateY(-5px);
          }
        }
        
        @keyframes twinkle {
          from {
            opacity: 0.3;
          }
          to {
            opacity: 1;
          }
        }
      </style>
    </div>
  `;

  const rainbow = container.querySelector("#rainbow");
  let width = 0;
  let growing = true;

  const interval = setInterval(() => {
    if (growing) {
      width += 2;
      if (width >= container.clientWidth * 0.6) {
        growing = false;
      }
    } else {
      width -= 2;
      if (width <= 0) {
        growing = true;
      }
    }
    rainbow.style.width = `${width}px`;
  }, 50);

  return () => clearInterval(interval);
}
