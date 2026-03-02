// Word of the Day Module for Momentos
export const metadata = {
  id: "word-of-day",
  name: "Word of the Day",
  description: "Learn a new word every day",
  size: "2x2",
  links: [
    { label: "Random Word API", url: "https://random-word-api.herokuapp.com/" },
  ],
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
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="font-size: 10px; font-weight: 400; margin-bottom: 4px;">
        📚 Word of the Day
      </div>
      <div id="word" style="
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 4px;
        color: ${isDark ? "#60a5fa" : "#2563eb"};
      ">
        Loading...
      </div>
      <div id="definition" style="
        font-size: 8px;
        font-weight: 400;
        line-height: 1.3;
        opacity: 0.8;
      "></div>
      <button id="new-word-btn" style="
        margin-top: 4px;
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
        New Word
      </button>
    </div>
  `;

  const wordEl = container.querySelector("#word");
  const defEl = container.querySelector("#definition");
  const btn = container.querySelector("#new-word-btn");

  async function fetchWord() {
    try {
      // Get random word
      const wordResponse = await fetch(
        "https://random-word-api.herokuapp.com/word",
      );
      const words = await wordResponse.json();
      const word = words[0];

      wordEl.textContent = word.charAt(0).toUpperCase() + word.slice(1);

      // Try to get definition from Free Dictionary API
      try {
        const defResponse = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
        );
        const defData = await defResponse.json();

        if (defData[0] && defData[0].meanings[0]) {
          const meaning = defData[0].meanings[0];
          const partOfSpeech = meaning.partOfSpeech;
          const definition = meaning.definitions[0].definition;
          defEl.innerHTML = `<em>${partOfSpeech}</em> - ${definition}`;
        } else {
          defEl.textContent = "A randomly selected word for you to explore!";
        }
      } catch {
        defEl.textContent = "A randomly selected word for you to explore!";
      }
    } catch (error) {
      wordEl.textContent = "Error";
      defEl.textContent = "Unable to fetch word";
      console.error("Failed to fetch word:", error);
    }
  }

  btn.addEventListener("click", fetchWord);
  await fetchWord();
}
