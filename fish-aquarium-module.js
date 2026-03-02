// Fish Aquarium Module for Momentos
export const metadata = {
  id: "fish-aquarium",
  name: "Fish Aquarium",
  description: "Relaxing animated fish tank",
  size: "2x2",
  links: [],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  const fishEmojis = ["🐠", "🐟", "🐡", "🦈", "🐙", "🦑", "🦞", "🦀"];
  const fish = [];

  container.innerHTML = `
    <div id="aquarium" style="
      position: relative;
      height: 100%;
      padding: 6px;
      border-radius: 4px;
      background: ${
        isDark
          ? "linear-gradient(to bottom, #001a33, #003d5c)"
          : "linear-gradient(to bottom, #4dd0e1, #0097a7)"
      };
      overflow: hidden;
    ">
      <!-- Bubbles -->
      ${Array.from(
        { length: 8 },
        (_, i) => `
        <div class="bubble" style="
          position: absolute;
          bottom: -20px;
          left: ${Math.random() * 100}%;
          width: ${4 + Math.random() * 8}px;
          height: ${4 + Math.random() * 8}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: rise ${3 + Math.random() * 4}s linear infinite;
          animation-delay: ${Math.random() * 3}s;
        "></div>
      `,
      ).join("")}
      
      <!-- Seaweed -->
      <div style="
        position: absolute;
        bottom: 0;
        left: 10%;
        font-size: 40px;
        opacity: 0.6;
        animation: sway 3s ease-in-out infinite;
      ">🌿</div>
      <div style="
        position: absolute;
        bottom: 0;
        right: 15%;
        font-size: 35px;
        opacity: 0.6;
        animation: sway 2.5s ease-in-out infinite reverse;
      ">🌿</div>
      
      <style>
        @keyframes rise {
          to {
            bottom: 110%;
            opacity: 0;
          }
        }
        
        @keyframes sway {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        
        @keyframes swim {
          0% {
            transform: translateX(0) scaleX(-1);
          }
          100% {
            transform: translateX(var(--swim-distance)) scaleX(-1);
          }
        }
        
        @keyframes swim-reverse {
          0% {
            transform: translateX(0) scaleX(1);
          }
          100% {
            transform: translateX(var(--swim-distance)) scaleX(1);
          }
        }
      </style>
    </div>
  `;

  const aquarium = container.querySelector("#aquarium");

  // Create swimming fish
  function createFish() {
    const fishEl = document.createElement("div");
    const emoji = fishEmojis[Math.floor(Math.random() * fishEmojis.length)];
    const size = 24 + Math.random() * 20;
    const duration = 8 + Math.random() * 12;
    const startY = 10 + Math.random() * 60;
    const direction = Math.random() > 0.5 ? 1 : -1;

    fishEl.textContent = emoji;
    fishEl.style.cssText = `
      position: absolute;
      top: ${startY}%;
      left: ${direction > 0 ? "-10%" : "110%"};
      font-size: ${size}px;
      --swim-distance: ${direction * (container.clientWidth + 100)}px;
      animation: ${direction > 0 ? "swim" : "swim-reverse"} ${duration}s linear;
    `;

    aquarium.appendChild(fishEl);

    setTimeout(() => {
      fishEl.remove();
    }, duration * 1000);
  }

  // Create fish periodically
  const fishInterval = setInterval(() => {
    if (Math.random() > 0.3) {
      createFish();
    }
  }, 2000);

  // Create initial fish
  for (let i = 0; i < 4; i++) {
    setTimeout(() => createFish(), i * 500);
  }

  return () => {
    clearInterval(fishInterval);
  };
}
