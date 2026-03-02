// S&P 500 Index Module for Momentos
export const metadata = {
  id: "sp500-index",
  name: "S&P 500",
  description: "Real-time S&P 500 index price",
  size: "1x1",
  links: [{ label: "Yahoo Finance", url: "https://finance.yahoo.com" }],
};

export async function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 6px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="font-size: 8px; font-weight: 400; opacity: 0.6; margin-bottom: 4px;">
        S&P 500
      </div>
      <div id="sp500-price" style="font-size: 14px; font-weight: 400; margin-bottom: 2px;">
        Loading...
      </div>
      <div id="sp500-change" style="font-size: 8px; font-weight: 400;"></div>
    </div>
  `;

  const priceEl = container.querySelector("#sp500-price");
  const changeEl = container.querySelector("#sp500-change");

  async function fetchSP500() {
    try {
      // Using Yahoo Finance API - ^GSPC is the S&P 500 ticker
      const response = await fetch(
        "https://query1.finance.yahoo.com/v8/finance/chart/^GSPC?interval=1d&range=1d",
      );
      const data = await response.json();

      const quote = data.chart.result[0];
      const meta = quote.meta;
      const price = meta.regularMarketPrice;
      const previousClose = meta.chartPreviousClose || meta.previousClose;
      const change = price - previousClose;
      const changePercent = (change / previousClose) * 100;

      priceEl.textContent = `$${price.toFixed(2)}`;

      const isPositive = change >= 0;
      changeEl.innerHTML = `
        <span style="color: ${isPositive ? "#10b981" : "#ef4444"};">
          ${isPositive ? "▲" : "▼"} ${Math.abs(change).toFixed(2)} (${changePercent.toFixed(2)}%)
        </span>
      `;
    } catch (error) {
      priceEl.textContent = "Error";
      changeEl.textContent = "Unable to fetch data";
      console.error("Failed to fetch S&P 500 data:", error);
    }
  }

  await fetchSP500();
  const interval = setInterval(fetchSP500, 60000); // Update every minute

  return () => clearInterval(interval);
}
