// sitemap.xml and robots.txt, so search engines can find every public page.

import { esc } from "./html.mjs";

// Pages marked noindex (thank-you pages, the 404 page, hidden admin pages) are left out.
export function sitemap(site, pages) {
  const urls = pages
    .filter(page => !page.noindex)
    .map(page => {
      const lastmod = /^\d{4}-\d{2}-\d{2}/.exec(String(page.lastmod || ""));
      return `  <url><loc>${esc(site.url + page.path)}</loc>${lastmod ? `<lastmod>${lastmod[0]}</lastmod>` : ""}</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export const robots = site => `User-agent: *
Disallow: /admin/

Sitemap: ${site.url}/sitemap.xml
`;
