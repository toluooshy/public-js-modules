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
      padding: 8px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      text-align: center;
    ">
      <div id="quote-text" style="
        font-size: 9px;
        font-weight: 400;
        font-style: italic;
        margin-bottom: 4px;
        line-height: 1.3;
      ">
        Loading quote...
      </div>
      <div id="quote-author" style="
        font-size: 8px;
        font-weight: 400;
        opacity: 0.7;
      "></div>
      <button id="new-quote-btn" style="
        margin-top: 4px;
        padding: 3px 6px;
        background: transparent;
        color: ${isDark ? "#ffffff" : "#1a1a1a"};
        border: 1px solid ${isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"};
        border-radius: 3px;
        cursor: pointer;
        font-size: 8px;
        font-weight: 400;
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
