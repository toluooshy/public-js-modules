// News Module for Momentos

export const metadata = {
  id: "news",
  name: "News",
  description: "Headlines",
  size: "2x2",
  links: [
    { label: "News Source", url: "https://news.example.com" },
    { label: "RSS Feed", url: "https://news.example.com/rss" },
    { label: "Submit Story", url: "https://news.example.com/submit" },
  ],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  // Create news display
  container.innerHTML = `
    <div style="
      padding: 15px; 
      overflow-y: auto; 
      height: 100%; 
      width: 100%;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">📰 Top Headlines</div>
      <div style="
        margin-bottom: 10px; 
        padding-bottom: 10px; 
        border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(128,128,128,0.3)"};
      ">
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 5px;">Breaking: New Discovery</div>
        <div style="font-size: 12px; opacity: 0.7;">2 hours ago</div>
      </div>
      <div style="
        margin-bottom: 10px; 
        padding-bottom: 10px; 
        border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(128,128,128,0.3)"};
      ">
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 5px;">Tech Innovation Unveiled</div>
        <div style="font-size: 12px; opacity: 0.7;">4 hours ago</div>
      </div>
      <div style="margin-bottom: 10px;">
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 5px;">Markets Rally Today</div>
        <div style="font-size: 12px; opacity: 0.7;">6 hours ago</div>
      </div>
    </div>
  `;

  // No cleanup needed for static content
  return () => {
    console.log("News module cleaned up");
  };
}

export default render;
