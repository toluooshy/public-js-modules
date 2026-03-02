// Random Joke Module for Momentos
export const metadata = {
  id: "random-joke",
  name: "Random Joke",
  description: "Dad jokes and programming humor",
  size: "2x1",
  links: [{ label: "JokeAPI", url: "https://jokeapi.dev/" }],
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
        😂 Random Joke
      </div>
      <div id="joke-content" style="
        font-size: 9px;
        font-weight: 400;
        line-height: 1.3;
        margin-bottom: 6px;
        flex: 1;
      ">
        Loading...
      </div>
      <button id="new-joke-btn" style="
        background: none;
        border: none;
        color: ${isDark ? "#ffffff" : "#1a1a1a"};
        cursor: pointer;
        font-size: 9px;
        font-weight: 700;
        padding: 0;
        align-self: flex-start;
      ">
        New Joke
      </button>
    </div>
  `;

  const jokeEl = container.querySelector("#joke-content");
  const btn = container.querySelector("#new-joke-btn");

  async function fetchJoke() {
    try {
      const response = await fetch(
        "https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single",
      );
      const data = await response.json();

      if (data.joke) {
        jokeEl.textContent = data.joke;
      } else if (data.setup && data.delivery) {
        jokeEl.innerHTML = `${data.setup}<br><br><strong>${data.delivery}</strong>`;
      }
    } catch (error) {
      jokeEl.textContent = "Unable to fetch joke";
      console.error("Failed to fetch joke:", error);
    }
  }

  btn.addEventListener("click", fetchJoke);
  await fetchJoke();
}
