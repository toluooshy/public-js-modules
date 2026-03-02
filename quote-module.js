// Daily Quote Module for Momentos
export const metadata = {
  id: "daily-quote",
  name: "Daily Quote",
  description: "Inspirational quote of the day",
  size: "2x1",
  links: [{ label: "Quotable", url: "https://github.com/lukePeavey/quotable" }],
};

export async function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 20px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"};
      border-radius: 8px;
      text-align: center;
    ">
      <div id="quote-text" style="
        font-size: 16px;
        font-style: italic;
        margin-bottom: 12px;
        line-height: 1.5;
      ">
        Loading quote...
      </div>
      <div id="quote-author" style="
        font-size: 13px;
        opacity: 0.7;
        font-weight: 500;
      "></div>
      <button id="new-quote-btn" style="
        margin-top: 12px;
        padding: 6px 12px;
        background: ${isDark ? "#4a9eff" : "#2563eb"};
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        opacity: 0.8;
        transition: opacity 0.2s;
      ">
        New Quote
      </button>
    </div>
  `;

  const quoteText = container.querySelector("#quote-text");
  const quoteAuthor = container.querySelector("#quote-author");
  const newQuoteBtn = container.querySelector("#new-quote-btn");

  async function fetchQuote() {
    try {
      const response = await fetch(
        "https://api.quotable.io/random?maxLength=150",
      );
      const data = await response.json();

      quoteText.textContent = `"${data.content}"`;
      quoteAuthor.textContent = `— ${data.author}`;
    } catch (error) {
      quoteText.textContent = "Unable to load quote";
      quoteAuthor.textContent = "";
      console.error("Failed to fetch quote:", error);
    }
  }

  newQuoteBtn.addEventListener("click", fetchQuote);
  newQuoteBtn.addEventListener("mouseenter", () => {
    newQuoteBtn.style.opacity = "1";
  });
  newQuoteBtn.addEventListener("mouseleave", () => {
    newQuoteBtn.style.opacity = "0.8";
  });

  await fetchQuote();
}
