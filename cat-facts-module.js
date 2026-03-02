// Cat Facts Module for Momentos
export const metadata = {
  id: "cat-facts",
  name: "Cat Facts",
  description: "Random interesting facts about cats",
  size: "2x1",
  links: [{ label: "Cat Facts API", url: "https://catfact.ninja/" }],
};

export async function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      padding: 8px;
      border-radius: 4px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="font-size: 10px; font-weight: 400; margin-bottom: 4px;">
        🐱 Cat Fact
      </div>
      <div id="cat-fact" style="
        font-size: 9px;
        font-weight: 400;
        line-height: 1.3;
        margin-bottom: 6px;
        flex: 1;
      ">
        Loading...
      </div>
      <button id="new-fact-btn" style="
        padding: 3px 6px;
        background: transparent;
        color: ${isDark ? "#ffffff" : "#1a1a1a"};
        border: 1px solid ${isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"};
        border-radius: 3px;
        cursor: pointer;
        font-size: 8px;
        font-weight: 400;
        align-self: flex-start;
      ">
        New Fact
      </button>
    </div>
  `;

  const factEl = container.querySelector("#cat-fact");
  const btn = container.querySelector("#new-fact-btn");

  async function fetchFact() {
    try {
      const response = await fetch("https://catfact.ninja/fact");
      const data = await response.json();
      factEl.textContent = data.fact;
    } catch (error) {
      factEl.textContent = "Unable to fetch cat fact";
      console.error("Failed to fetch cat fact:", error);
    }
  }

  btn.addEventListener("click", fetchFact);
  await fetchFact();
}
