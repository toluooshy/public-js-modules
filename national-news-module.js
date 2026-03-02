// National News Module for Momentos
export const metadata = {
  id: "national-news",
  name: "National News",
  description: "Latest news headlines from your country with images",
  size: "2x2",
  intendedSize: { width: 240, height: 240 },
};

export async function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

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

  // Country code to flag emoji mapping
  const countryFlags = {
    AD: "🇦🇩",
    AE: "🇦🇪",
    AF: "🇦🇫",
    AG: "🇦🇬",
    AI: "🇦🇮",
    AL: "🇦🇱",
    AM: "🇦🇲",
    AO: "🇦🇴",
    AQ: "🇦🇶",
    AR: "🇦🇷",
    AS: "🇦🇸",
    AT: "🇦🇹",
    AU: "🇦🇺",
    AW: "🇦🇼",
    AX: "🇦🇽",
    AZ: "🇦🇿",
    BA: "🇧🇦",
    BB: "🇧🇧",
    BD: "🇧🇩",
    BE: "🇧🇪",
    BF: "🇧🇫",
    BG: "🇧🇬",
    BH: "🇧🇭",
    BI: "🇧🇮",
    BJ: "🇧🇯",
    BL: "🇧🇱",
    BM: "🇧🇲",
    BN: "🇧🇳",
    BO: "🇧🇴",
    BQ: "🇧🇶",
    BR: "🇧🇷",
    BS: "🇧🇸",
    BT: "🇧🇹",
    BV: "🇧🇻",
    BW: "🇧🇼",
    BY: "🇧🇾",
    BZ: "🇧🇿",
    CA: "🇨🇦",
    CC: "🇨🇨",
    CD: "🇨🇩",
    CF: "🇨🇫",
    CG: "🇨🇬",
    CH: "🇨🇭",
    CI: "🇨🇮",
    CK: "🇨🇰",
    CL: "🇨🇱",
    CM: "🇨🇲",
    CN: "🇨🇳",
    CO: "🇨🇴",
    CR: "🇨🇷",
    CU: "🇨🇺",
    CV: "🇨🇻",
    CW: "🇨🇼",
    CX: "🇨🇽",
    CY: "🇨🇾",
    CZ: "🇨🇿",
    DE: "🇩🇪",
    DJ: "🇩🇯",
    DK: "🇩🇰",
    DM: "🇩🇲",
    DO: "🇩🇴",
    DZ: "🇩🇿",
    EC: "🇪🇨",
    EE: "🇪🇪",
    EG: "🇪🇬",
    EH: "🇪🇭",
    ER: "🇪🇷",
    ES: "🇪🇸",
    ET: "🇪🇹",
    FI: "🇫🇮",
    FJ: "🇫🇯",
    FK: "🇫🇰",
    FM: "🇫🇲",
    FO: "🇫🇴",
    FR: "🇫🇷",
    GA: "🇬🇦",
    GB: "🇬🇧",
    GD: "🇬🇩",
    GE: "🇬🇪",
    GF: "🇬🇫",
    GG: "🇬🇬",
    GH: "🇬🇭",
    GI: "🇬🇮",
    GL: "🇬🇱",
    GM: "🇬🇲",
    GN: "🇬🇳",
    GP: "🇬🇵",
    GQ: "🇬🇶",
    GR: "🇬🇷",
    GS: "🇬🇸",
    GT: "🇬🇹",
    GU: "🇬🇺",
    GW: "🇬🇼",
    GY: "🇬🇾",
    HK: "🇭🇰",
    HM: "🇭🇲",
    HN: "🇭🇳",
    HR: "🇭🇷",
    HT: "🇭🇹",
    HU: "🇭🇺",
    ID: "🇮🇩",
    IE: "🇮🇪",
    IL: "🇮🇱",
    IM: "🇮🇲",
    IN: "🇮🇳",
    IO: "🇮🇴",
    IQ: "🇮🇶",
    IR: "🇮🇷",
    IS: "🇮🇸",
    IT: "🇮🇹",
    JE: "🇯🇪",
    JM: "🇯🇲",
    JO: "🇯🇴",
    JP: "🇯🇵",
    KE: "🇰🇪",
    KG: "🇰🇬",
    KH: "🇰🇭",
    KI: "🇰🇮",
    KM: "🇰🇲",
    KN: "🇰🇳",
    KP: "🇰🇵",
    KR: "🇰🇷",
    KW: "🇰🇼",
    KY: "🇰🇾",
    KZ: "🇰🇿",
    LA: "🇱🇦",
    LB: "🇱🇧",
    LC: "🇱🇨",
    LI: "🇱🇮",
    LK: "🇱🇰",
    LR: "🇱🇷",
    LS: "🇱🇸",
    LT: "🇱🇹",
    LU: "🇱🇺",
    LV: "🇱🇻",
    LY: "🇱🇾",
    MA: "🇲🇦",
    MC: "🇲🇨",
    MD: "🇲🇩",
    ME: "🇲🇪",
    MF: "🇲🇫",
    MG: "🇲🇬",
    MH: "🇲🇭",
    MK: "🇲🇰",
    ML: "🇲🇱",
    MM: "🇲🇲",
    MN: "🇲🇳",
    MO: "🇲🇴",
    MP: "🇲🇵",
    MQ: "🇲🇶",
    MR: "🇲🇷",
    MS: "🇲🇸",
    MT: "🇲🇹",
    MU: "🇲🇺",
    MV: "🇲🇻",
    MW: "🇲🇼",
    MX: "🇲🇽",
    MY: "🇲🇾",
    MZ: "🇲🇿",
    NA: "🇳🇦",
    NC: "🇳🇨",
    NE: "🇳🇪",
    NF: "🇳🇫",
    NG: "🇳🇬",
    NI: "🇳🇮",
    NL: "🇳🇱",
    NO: "🇳🇴",
    NP: "🇳🇵",
    NR: "🇳🇷",
    NU: "🇳🇺",
    NZ: "🇳🇿",
    OM: "🇴🇲",
    PA: "🇵🇦",
    PE: "🇵🇪",
    PF: "🇵🇫",
    PG: "🇵🇬",
    PH: "🇵🇭",
    PK: "🇵🇰",
    PL: "🇵🇱",
    PM: "🇵🇲",
    PN: "🇵🇳",
    PR: "🇵🇷",
    PS: "🇵🇸",
    PT: "🇵🇹",
    PW: "🇵🇼",
    PY: "🇵🇾",
    QA: "🇶🇦",
    RE: "🇷🇪",
    RO: "🇷🇴",
    RS: "🇷🇸",
    RU: "🇷🇺",
    RW: "🇷🇼",
    SA: "🇸🇦",
    SB: "🇸🇧",
    SC: "🇸🇨",
    SD: "🇸🇩",
    SE: "🇸🇪",
    SG: "🇸🇬",
    SH: "🇸🇭",
    SI: "🇸🇮",
    SJ: "🇸🇯",
    SK: "🇸🇰",
    SL: "🇸🇱",
    SM: "🇸🇲",
    SN: "🇸🇳",
    SO: "🇸🇴",
    SR: "🇸🇷",
    SS: "🇸🇸",
    ST: "🇸🇹",
    SV: "🇸🇻",
    SX: "🇸🇽",
    SY: "🇸🇾",
    SZ: "🇸🇿",
    TC: "🇹🇨",
    TD: "🇹🇩",
    TF: "🇹🇫",
    TG: "🇹🇬",
    TH: "🇹🇭",
    TJ: "🇹🇯",
    TK: "🇹🇰",
    TL: "🇹🇱",
    TM: "🇹🇲",
    TN: "🇹🇳",
    TO: "🇹🇴",
    TR: "🇹🇷",
    TT: "🇹🇹",
    TV: "🇹🇻",
    TW: "🇹🇼",
    TZ: "🇹🇿",
    UA: "🇺🇦",
    UG: "🇺🇬",
    UM: "🇺🇲",
    US: "🇺🇸",
    UY: "🇺🇾",
    UZ: "🇺🇿",
    VA: "🇻🇦",
    VC: "🇻🇨",
    VE: "🇻🇪",
    VG: "🇻🇬",
    VI: "🇻🇮",
    VN: "🇻🇳",
    VU: "🇻🇺",
    WF: "🇼🇫",
    WS: "🇼🇸",
    XK: "🇽🇰",
    YE: "🇾🇪",
    YT: "🇾🇹",
    ZA: "🇿🇦",
    ZM: "🇿🇲",
    ZW: "🇿🇼",
  };

  try {
    // Get user geolocation
    const position = await new Promise((resolve, reject) => {
      if (!navigator.geolocation)
        reject(new Error("Geolocation not supported"));
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    // Reverse geocode to get country
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const locationData = await fetchJSON(nominatimUrl);
    const countryCode =
      locationData.address.country_code?.toUpperCase() || "US";
    const countryName = locationData.address.country || "your country";
    const countryFlag = countryFlags[countryCode] || "🌍";

    // Fetch Google News RSS for this country
    const rssUrl = `https://news.google.com/rss/headlines/section/geo/${encodeURIComponent(countryName)}?hl=en&gl=${countryCode}&ceid=${countryCode}:en`;
    const rssData = await fetchJSON(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
    );

    async function fetchFirstGoogleImage(query) {
      try {
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
        if (imgs.length > 2) {
          return imgs[1].src || imgs[2].src;
        }
      } catch (e) {}
      return null;
    }

    const newsWithImages = await Promise.all(
      rssData.items.map(async (item) => {
        const titleForQuery = item.title.replace(/\s+/g, "+");
        let articleImage = await fetchFirstGoogleImage(titleForQuery);
        if (!articleImage) {
          articleImage =
            item.thumbnail || (item.enclosure && item.enclosure.link) || null;
        }
        if (!articleImage) {
          articleImage = "https://via.placeholder.com/240x120?text=No+Image";
        }

        let outletName = "Unknown";
        let sourceQuery = null;
        if (item.title.includes("-")) {
          sourceQuery = item.title.split("-").pop().trim().replace(/\s+/g, "+");
          outletName = item.title.split("-").pop().trim();
        } else if (item.source && item.source.title) {
          outletName = item.source.title;
          sourceQuery = item.source.title.replace(/\s+/g, "+");
        } else if (item.author) {
          outletName = item.author;
          sourceQuery = item.author.replace(/\s+/g, "+");
        }

        let outletLogo = null;
        if (sourceQuery && outletName !== "Unknown") {
          outletLogo = await fetchFirstGoogleImage(sourceQuery);
        }
        if (!outletLogo) {
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
          <img src="${item.articleImage}" alt="" style="width: 100%; max-width: 200px; height: auto; object-fit: contain; border-radius: 4px; margin-top: 2px; align-self: center;">
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
        <div style="font-size: ${Math.max(10, 12 * scale)}px; font-weight: 400; margin-bottom: ${Math.max(5, 6 * scale)}px;">${countryFlag} News</div>
        ${newsHtml || "<div>No national news found.</div>"}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div style="color:red;">Failed to load national news: ${err.message}</div>`;
  }

  return () => {
    console.log("National News module cleaned up");
  };
}

export default render;
