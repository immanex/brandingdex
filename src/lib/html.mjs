export const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

export const slugify = value => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Headline text from content files: *word* becomes the orange serif accent, a new line becomes a break.
export const accent = value => esc(value).replace(/\*([^*\n]+)\*/g, "<em>$1</em>").replace(/\r?\n/g, "<br>");

// JSON that is safe to place inside a <script> data block.
export const dataBlock = value => JSON.stringify(value).replace(/</g, "\\u003c");

export const money = (value, symbol = "$") => symbol + Number(value || 0).toLocaleString("en-US");

export const longDate = value => {
  const date = new Date(String(value).slice(0, 10) + "T00:00:00Z");
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
  });
};

// Content edited in the admin can come back as "", null, [] or be missing altogether.
// These two helpers let templates treat all of those the same way.
export const list = value => Array.isArray(value) ? value.filter(item => item !== null && item !== undefined && item !== "") : [];
export const has = value => Array.isArray(value)
  ? list(value).length > 0
  : value !== undefined && value !== null && String(value).trim() !== "";

export const isExternal = link => /^https?:\/\//i.test(link);

// Turns whatever was typed into a link box into a usable address:
// "contact" → "/contact", "www.site.com" → "https://www.site.com", "me@site.com" → "mailto:me@site.com".
export function href(value) {
  const link = String(value ?? "").trim();
  if (!link) return "";
  if (/^(\/|#|\?|https?:\/\/|mailto:|tel:)/i.test(link)) return link;
  if (/^[a-z][a-z0-9+.-]*:/i.test(link)) return "";
  if (/^[^@\s/]+@[^@\s/]+\.[^@\s/]+$/.test(link)) return "mailto:" + link;
  if (/^www\./i.test(link) || /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(link)) return "https://" + link;
  return "/" + link;
}

// Full web address for a path or an uploaded file, for search engines and link previews.
export const absolute = (site, path) => isExternal(path) ? path : site.url + (String(path).startsWith("/") ? path : "/" + path);
