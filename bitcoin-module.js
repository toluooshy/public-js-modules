// Bitcoin Price Module for Momentos
export const metadata = {
  id: "bitcoin-price",
  name: "Bitcoin",
  description: "Live Bitcoin price in USD",
  size: "1x1",
  links: [{ label: "CoinGecko", url: "https://www.coingecko.com" }],
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
      background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"};
      border-radius: 6px;
    ">
      <div style="font-size: 8px; font-weight: 400; opacity: 0.6; margin-bottom: 4px;">
        ₿ Bitcoin
      </div>
      <div id="btc-price" style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">
        Loading...
      </div>
      <div id="btc-change" style="font-size: 8px; font-weight: 400;"></div>
    </div>
  `;

  const priceEl = container.querySelector("#btc-price");
  const changeEl = container.querySelector("#btc-change");

  async function fetchBitcoin() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
      );
      const data = await response.json();

      const price = data.bitcoin.usd;
      const change24h = data.bitcoin.usd_24h_change;

      priceEl.textContent = `$${price.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;

      const isPositive = change24h >= 0;
      changeEl.innerHTML = `
        <span style="color: ${isPositive ? "#10b981" : "#ef4444"};">
          ${isPositive ? "▲" : "▼"} ${Math.abs(change24h).toFixed(2)}%
        </span>
      `;
    } catch (error) {
      priceEl.textContent = "Error";
      changeEl.textContent = "Unable to fetch data";
      console.error("Failed to fetch Bitcoin data:", error);
    }
  }

  await fetchBitcoin();
  const interval = setInterval(fetchBitcoin, 60000); // Update every minute

  return () => clearInterval(interval);
}
