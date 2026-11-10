// RSS feed of the insight articles, written to dist/feed.xml and linked from every page.

import { esc } from "./html.mjs";

const rfc822 = value => {
  const date = new Date(String(value).slice(0, 10) + "T00:00:00Z");
  return Number.isNaN(date.getTime()) ? "" : date.toUTCString();
};

// Feed readers show articles away from the site, so links and images need full addresses.
const absoluteLinks = (site, html) => html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${site.url}/`);

export function rss(ctx) {
  const { site, posts } = ctx;
  const items = posts.map(post => {
    const link = `${site.url}/insights/${post.slug}/`;
    const published = rfc822(post.date);
    return `  <item>
    <title>${esc(post.title)}</title>
    <link>${esc(link)}</link>
    <guid isPermaLink="true">${esc(link)}</guid>
    ${published ? `<pubDate>${published}</pubDate>` : ""}
    ${post.tag ? `<category>${esc(post.tag)}</category>` : ""}
    <description>${esc(post.description)}</description>
    <content:encoded>${esc(absoluteLinks(site, post.html))}</content:encoded>
  </item>`;
  }).join("\n");
  const updated = posts.length ? rfc822(posts[0].updated || posts[0].date) : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>${esc(site.name)} Insights</title>
  <link>${esc(site.url)}/insights/</link>
  <description>${esc(site.newsletter.pitch || site.description)}</description>
  <language>en</language>
  <atom:link href="${esc(site.url)}/feed.xml" rel="self" type="application/rss+xml"/>
  ${updated ? `<lastBuildDate>${updated}</lastBuildDate>` : ""}
${items}
</channel>
</rss>
`;
}
