// Random Dog Module for Momentos
export const metadata = {
  id: "random-dog",
  name: "Random Dog",
  description: "Random cute dog pictures",
  size: "2x2",
  links: [{ label: "Dog API", url: "https://dog.ceo/" }],
};

export async function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 6px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"};
      border-radius: 6px;
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      ">
        <div style="font-size: 10px; font-weight: bold;">🐕 Random Dog</div>
        <button id="new-dog-btn" style="
          padding: 2px 4px;
          background: ${isDark ? "#4a9eff" : "#2563eb"};
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 8px;
          font-weight: 400;
        ">
          New Dog
        </button>
      </div>
      <div style="
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.5)"};
        border-radius: 6px;
        overflow: hidden;
      ">
        <img id="dog-img" style="
          width: 100%;
          height: 100%;
          object-fit: cover;
        " alt="Random dog"/>
      </div>
      <div id="dog-breed" style="
        text-align: center;
        margin-top: 4px;
        font-size: 8px;
        font-weight: 400;
        opacity: 0.7;
      "></div>
    </div>
  `;

  const imgEl = container.querySelector("#dog-img");
  const breedEl = container.querySelector("#dog-breed");
  const btn = container.querySelector("#new-dog-btn");

  async function fetchDog() {
    try {
      imgEl.src = "";
      breedEl.textContent = "Loading...";

      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();

      imgEl.src = data.message;

      // Extract breed from URL
      const breed = data.message.split("/")[4].split("-").join(" ");
      breedEl.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
    } catch (error) {
      breedEl.textContent = "Unable to fetch dog";
      console.error("Failed to fetch dog:", error);
    }
  }

  btn.addEventListener("click", fetchDog);
  await fetchDog();
}
