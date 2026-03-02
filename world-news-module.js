// World News Module for Momentos
export const metadata = {
  id: "world-news",
  name: "World News",
  description: "Latest global news headlines",
  size: "2x2",
  links: [{ label: "BBC News", url: "https://www.bbc.com/news" }],
};

export async function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 16px;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"};
      border-radius: 8px;
      overflow: hidden;
    ">
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px; opacity: 0.9;">
        🌍 World News
      </div>
      <div id="news-container" style="
        flex: 1;
        overflow-y: auto;
        font-size: 13px;
        line-height: 1.5;
      ">
        Loading headlines...
      </div>
    </div>
  `;

  const newsContainer = container.querySelector("#news-container");

  async function fetchNews() {
    try {
      // Using RSS2JSON service to convert BBC RSS feed to JSON
      const response = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/world/rss.xml",
      );
      const data = await response.json();

      if (data.status === "ok" && data.items) {
        const headlines = data.items
          .slice(0, 8)
          .map((item, index) => {
            const pubDate = new Date(item.pubDate);
            const timeAgo = getTimeAgo(pubDate);

            return `
            <div style="
              margin-bottom: 12px;
              padding-bottom: 12px;
              border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
            ">
              <a href="${item.link}" target="_blank" style="
                color: ${isDark ? "#60a5fa" : "#2563eb"};
                text-decoration: none;
                font-weight: 500;
                display: block;
                margin-bottom: 4px;
              ">
                ${item.title}
              </a>
              <div style="font-size: 11px; opacity: 0.6;">
                ${timeAgo}
              </div>
            </div>
          `;
          })
          .join("");

        newsContainer.innerHTML = headlines;
      } else {
        newsContainer.textContent = "Unable to load news";
      }
    } catch (error) {
      newsContainer.textContent = "Error loading news";
      console.error("Failed to fetch news:", error);
    }
  }

  function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  await fetchNews();
  const interval = setInterval(fetchNews, 300000); // Update every 5 minutes

  return () => clearInterval(interval);
}
