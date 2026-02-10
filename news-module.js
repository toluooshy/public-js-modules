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
    console.log("Initial API news feed response:", rssData);

    // Helper to fetch first Google Images result for a query
    async function fetchFirstGoogleImage(query) {
      try {
        // Use a public CORS proxy for demo purposes (not for production)
        const proxy = "https://corsproxy.io/?";
        const url =
          proxy +
          encodeURIComponent(
            `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`,
          );
        const res = await fetch(url);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const imgs = doc.querySelectorAll("img");
        // Google puts its logo as the first image, so use the second or third
        if (imgs.length > 2) {
          return imgs[1].src || imgs[2].src;
        }
      } catch (e) {}
      return null;
    }

    // For each news item, fetch images in parallel
    const newsWithImages = await Promise.all(
      rssData.items.map(async (item) => {
        // Headline image
        let articleImage = await fetchFirstGoogleImage(item.title);
        if (!articleImage) {
          articleImage =
            item.thumbnail || (item.enclosure && item.enclosure.link) || null;
        }
        if (!articleImage) {
          articleImage = "https://via.placeholder.com/240x120?text=No+Image";
        }

        // Outlet logo
        let outletName =
          item.source && item.source.title
            ? item.source.title
            : item.author || "Unknown";
        let outletLogo = await fetchFirstGoogleImage(
          outletName + " current logo wikipedia",
        );
        if (!outletLogo) {
          // fallback to favicon
          let outletLink =
            item.source && item.source.url ? item.source.url : null;
          if (outletLink) {
            try {
              const urlObj = new URL(outletLink);
              outletLogo = urlObj.origin + "/favicon.ico";
            } catch {}
          }
        }

        return { ...item, articleImage, outletLogo, outletName };
      }),
    );

    // Build HTML for headlines with fetched images
    const newsHtml = newsWithImages
      .map(
        (item) => `
        <div style="
          margin-bottom: ${Math.max(6, 10 * scale)}px;
          padding-bottom: ${Math.max(6, 10 * scale)}px;
          border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(128,128,128,0.3)"};
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: ${Math.max(6, 8 * scale)}px;
        ">
          <div style="display: flex; align-items: center; gap: ${Math.max(6, 8 * scale)}px; margin-bottom: ${Math.max(2, 3 * scale)}px;">
            ${
              item.outletLogo
                ? `<img src="${item.outletLogo}" alt="${item.outletName}" style="width: 20px; height: 20px; object-fit: contain; border-radius: 3px; background: #fff; border: 1px solid #ccc;">`
                : `<span style="font-size: ${Math.max(7, 10 * scale)}px; font-weight: 500; opacity: 0.7;">${item.outletName}</span>`
            }
            <span style="font-size: ${Math.max(6, 8 * scale)}px; opacity: 0.7;">${(() => {
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
            })()}</span>
          </div>
          <a href="${item.link}" target="_blank" style="
            font-size: ${Math.max(12, 16 * scale)}px;
            font-weight: 500;
            margin-bottom: ${Math.max(2, 3 * scale)}px;
            color: ${isDark ? "#ffffff" : "#1a1a1a"};
            text-decoration: none;
            display: block;
            line-height: 1.3;
            white-space: normal;
            overflow-wrap: break-word;
            max-width: 100%;
          ">
            ${item.title}
          </a>
          <img src="${item.articleImage}" alt="" style="width: 100%; max-width: 220px; height: auto; object-fit: contain; border-radius: 4px; margin-top: 2px; align-self: center;">
        </div>
      `,
      )
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
        <div style="font-size: ${Math.max(10, 12 * scale)}px; font-weight: 400; margin-bottom: ${Math.max(5, 6 * scale)}px;">📰 News for ${city}</div>
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
