// News Module for Momentos (Local news with images)
export const metadata = {
  id: "news",
  name: "Local News",
  description: "Headlines with images based on user location",
  size: "2x2",
};

export async function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  container.innerHTML = `
    <div style="
      padding: 15px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
    ">Detecting your location and loading news...</div>
  `;

  const fetchJSON = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  try {
    // 1️⃣ Get user geolocation
    const position = await new Promise((resolve, reject) => {
      if (!navigator.geolocation)
        reject(new Error("Geolocation not supported"));
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    // 2️⃣ Reverse geocode to get city
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const locationData = await fetchJSON(nominatimUrl);
    const city =
      locationData.address.city ||
      locationData.address.town ||
      locationData.address.village ||
      "Your area";

    // 3️⃣ Fetch Google News RSS for this city via rss2json
    const rssUrl = `https://news.google.com/rss/headlines/section/geo/${encodeURIComponent(city)}?hl=en-US&gl=US&ceid=US:en`;
    const rssData = await fetchJSON(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
    );

    // Build HTML for headlines with images
    const newsHtml = rssData.items
      .map((item) => {
        const imageUrl =
          item.thumbnail || (item.enclosure && item.enclosure.link) || null;
        return `
          <div style="
            margin-bottom: 10px; 
            padding-bottom: 10px; 
            border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(128,128,128,0.3)"};
            display: flex;
            align-items: flex-start;
            gap: 10px;
          ">
            ${
              imageUrl
                ? `<img src="${imageUrl}" alt="" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">`
                : ""
            }
            <div style="flex: 1;">
              <a href="${item.link}" target="_blank" style="
                font-size: 14px; 
                font-weight: 600; 
                margin-bottom: 5px; 
                color: ${isDark ? "#ffffff" : "#1a1a1a"};
                text-decoration: none;
                display: block;
              ">
                ${item.title}
              </a>
              <div style="font-size: 12px; opacity: 0.7;">
                ${new Date(item.pubDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    container.innerHTML = `
      <div style="
        padding: 15px; 
        overflow-y: auto; 
        height: 100%; 
        width: 100%;
        color: ${isDark ? "#ffffff" : "#1a1a1a"};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">📰 News for ${city}</div>
        ${newsHtml || "<div>No local news found.</div>"}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div style="color:red;">Failed to load local news: ${err.message}</div>`;
  }

  return () => {
    console.log("News module cleaned up");
  };
}

export default render;
