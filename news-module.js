// News Module for Momentos (Local news with images)
export const metadata = {
  id: "news",
  name: "Local News",
  description: "Headlines with images based on user location",
  size: "2x2",
  intendedSize: { width: 240, height: 240 }, // Dev-intended size for 2x2
};

export async function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  // Calculate zoom scale based on container vs intended size
  const intendedWidth = metadata.intendedSize?.width || 240;
  const intendedHeight = metadata.intendedSize?.height || 240;
  const scaleX = container.clientWidth / intendedWidth;
  const scaleY = container.clientHeight / intendedHeight;
  const scale = Math.min(scaleX, scaleY);

  container.innerHTML = `
    <div style="
      padding: 12px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      font-size: ${Math.max(11, 12 * scale)}px;
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
        // Try to extract image from thumbnail, enclosure, or media:content
        let imageUrl =
          item.thumbnail || (item.enclosure && item.enclosure.link) || null;
        // Try to extract from media:content if available (rss2json puts it in media object)
        if (
          !imageUrl &&
          item.media &&
          item.media.content &&
          item.media.content.url
        ) {
          imageUrl = item.media.content.url;
        }
        // Fallback placeholder if no image
        if (!imageUrl) {
          imageUrl = "https://via.placeholder.com/100x60?text=No+Image";
        }
        return `
          <div style="
            margin-bottom: ${Math.max(3, 4 * scale)}px;
            padding-bottom: ${Math.max(3, 4 * scale)}px;
            border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(128,128,128,0.3)"};
            display: flex;
            align-items: flex-start;
            gap: ${Math.max(6, 8 * scale)}px;
          ">
            <img src="${imageUrl}" alt="" style="width: 100px; height: 60px; object-fit: contain; border-radius: 4px; flex-shrink: 0;">
            <div style="flex: 1; min-width: 0;">
              <a href="${item.link}" target="_blank" style="
                font-size: ${Math.max(6, 7 * scale)}px;
                font-weight: 400;
                margin-bottom: ${Math.max(2, 2.5 * scale)}px;
                color: ${isDark ? "#ffffff" : "#1a1a1a"};
                text-decoration: none;
                display: block;
                line-height: 1.2;
                white-space: normal;
                overflow-wrap: break-word;
                max-width: 240px;
              ">
                ${item.title}
              </a>
              <div style="font-size: ${Math.max(5, 5.5 * scale)}px; opacity: 0.7;">
                ${(() => {
                  const d = new Date(item.pubDate);
                  const dateStr = d.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const timeStr = d.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return `${dateStr} ${timeStr}`;
                })()}
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    container.innerHTML = `
      <div style="
        padding: ${Math.max(5, 6 * scale)}px;
        overflow-y: auto;
        height: 100%;
        width: 100%;
        color: ${isDark ? "#ffffff" : "#1a1a1a"};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="font-size: ${Math.max(7, 8 * scale)}px; font-weight: 400; margin-bottom: ${Math.max(5, 6 * scale)}px;">📰 News for ${city}</div>
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
