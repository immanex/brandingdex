import { esc, href, slugify } from "./html.mjs";
import { markdown } from "./markdown.mjs";

const allowedEmbedHosts = {
  calendly: host => host === "calendly.com" || host.endsWith(".calendly.com"),
  typeform: host => host === "typeform.com" || host.endsWith(".typeform.com"),
  tally: host => host === "tally.so" || host.endsWith(".tally.so"),
  youtube: host => ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com"].includes(host),
  vimeo: host => host === "vimeo.com" || host === "www.vimeo.com" || host === "player.vimeo.com"
};
const reservedSlugs = new Set([
  "admin", "assets", "api", "portfolio", "services", "pricing", "insights", "about",
  "contact", "thanks", "newsletter", "privacy", "privacy-policy", "terms", "brand-scorecard"
]);

function embedUrl(provider, value) {
  try {
    const url = new URL(String(value ?? ""));
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || !allowedEmbedHosts[provider]?.(host)) return "";

    if (provider === "youtube") {
      let id = "";
      if (host === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] || "";
      else if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
      else if (url.pathname.startsWith("/embed/")) id = url.pathname.split("/")[2] || "";
      return /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : "";
    }

    if (provider === "vimeo") {
      const id = url.pathname.match(/(?:^|\/)(\d{6,12})(?:\/|$)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : (host === "player.vimeo.com" && /^\/video\/\d{6,12}$/.test(url.pathname) ? url.href : "");
    }

    if (provider === "tally") {
      return url.pathname.startsWith("/embed/") ? url.href : `https://tally.so/embed${url.pathname}${url.search}`;
    }

    return url.href;
  } catch {
    return "";
  }
}

function imageUrl(value) {
  const url = String(value ?? "").trim();
  return /^(https:\/\/[^\s]+|\/(?!\/)[^\s]*)$/i.test(url) ? url : "";
}

function sectionHtml(section) {
  const type = section?.type;
  const heading = section.heading ? `<h2>${esc(section.heading)}</h2>` : "";

  if (type === "text") {
    return `<section class="custom-section custom-text">${heading}<div class="prose">${markdown(section.body || "")}</div></section>`;
  }

  if (type === "image") {
    const src = imageUrl(section.src);
    if (!src) return "";
    return `<figure class="custom-section custom-image"><img src="${esc(src)}" alt="${esc(section.alt || "")}" loading="lazy">${section.caption ? `<figcaption>${esc(section.caption)}</figcaption>` : ""}</figure>`;
  }

  if (type === "embed") {
    const src = embedUrl(section.provider, section.url);
    if (!src) return "";
    const label = section.title || `${section.provider || "External"} embed`;
    return `<section class="custom-section custom-embed">${heading}<div class="embed-frame embed-${esc(section.provider)}"><iframe src="${esc(src)}" title="${esc(label)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="camera; microphone; autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe></div></section>`;
  }

  if (type === "button") {
    const target = href(section.href);
    if (!target || !section.label) return "";
    const external = /^https:\/\//i.test(target);
    return `<section class="custom-section custom-button"><a class="pill" href="${esc(target)}"${external ? ' target="_blank" rel="noopener"' : ""}>${esc(section.label)} <span aria-hidden="true">→</span></a></section>`;
  }

  return "";
}

export function contentPage(ctx, entry, fileSlug) {
  const slug = slugify(fileSlug);
  if (!slug || slug !== fileSlug || reservedSlugs.has(slug) || !entry?.title) return null;
  const path = `/${slug}/`;
  const sections = Array.isArray(entry.sections) ? entry.sections.map(sectionHtml).filter(Boolean).join("\n") : "";
  const body = `<article class="custom-page"><header class="portfolio-intro"><h1>${esc(entry.title)}</h1>${entry.description ? `<p class="pricing-lead">${esc(entry.description)}</p>` : ""}</header><div class="custom-page-content">${sections}</div></article>`;
  return {
    path,
    current: slug,
    title: `${entry.title} | ${ctx.site.name}`,
    description: entry.description || entry.title,
    body,
    noindex: entry.noindex === true
  };
}
