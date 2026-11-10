// The shared page shell: <head>, navigation, footer and the pieces every page uses.

import { dataBlock, esc } from "./html.mjs";

const DEFAULT_NAV = [
  { href: "/", label: "Home", key: "home" },
  { href: "/portfolio/", label: "Portfolio", key: "portfolio" },
  { href: "/services/", label: "Services", key: "services" },
  { href: "/pricing/", label: "Packages", key: "pricing", className: "nav-package" },
  { href: "/insights/", label: "Insights", key: "insights" },
  { href: "/about/", label: "About", key: "about" },
  { href: "/contact/", label: "Contact", key: "contact" }
];

const SOCIAL_LABELS = {
  instagram: "Instagram", linkedin: "LinkedIn", x: "X", facebook: "Facebook",
  behance: "Behance", dribbble: "Dribbble", tiktok: "TikTok", youtube: "YouTube"
};

export const DEFAULT_OG = "/assets/og/default.png";

export const whatsappNumber = site => String(site.contact.whatsapp || "").replace(/\D/g, "");
export const whatsappLink = (site, message) =>
  "https://wa.me/" + whatsappNumber(site) + "?text=" + encodeURIComponent(message || site.contact.whatsappMessage || "");

const logo = site =>
  `<a class="logo" href="/" aria-label="${esc(site.name)} home"><img src="/assets/brandingdex-logo.png" alt="${esc(site.name)}" width="640" height="213"></a>`;

// Direct ways to reach the studio. Only the ones filled in site.config.mjs are shown.
export function contactLinks(site) {
  const links = [];
  if (site.contact.email) links.push({ label: site.contact.email, href: "mailto:" + site.contact.email, track: "email_click" });
  if (site.contact.phone) links.push({ label: site.contact.phone, href: "tel:" + site.contact.phone.replace(/[^\d+]/g, ""), track: "phone_click" });
  if (whatsappNumber(site)) links.push({ label: "Chat on WhatsApp", href: whatsappLink(site), track: "whatsapp_click", external: true });
  if (site.contact.bookingUrl) links.push({ label: "Book a discovery call", href: site.contact.bookingUrl, track: "booking_click", external: true });
  return links;
}

export const linkTag = link =>
  `<a href="${esc(link.href)}"${link.external ? ' target="_blank" rel="noopener"' : ""}${link.track ? ` data-track="${link.track}"` : ""}>${esc(link.label)}${link.external ? " ↗" : ""}</a>`;

export function subscribeForm(ctx, source) {
  return `<form class="subscribe" data-form="subscribe" action="/api/subscribe" method="post">
  <div class="subscribe-row">
    <label class="visually-hidden" for="subscribe-${source}">Email address</label>
    <input id="subscribe-${source}" name="email" type="email" required autocomplete="email" placeholder="you@company.com">
    <button type="submit">Subscribe <span>↗</span></button>
  </div>
  <div class="hp" aria-hidden="true"><label>Leave this field empty<input name="company_url" tabindex="-1" autocomplete="off"></label></div>
  <input type="hidden" name="source" value="${source}">
  <p class="form-note">No spam. Unsubscribe anytime. See our <a href="/privacy/">privacy policy</a>.</p>
  <p class="form-status" role="status" hidden></p>
</form>`;
}

function menuHref(value) {
  const link = String(value ?? "").trim();
  return /^(\/|#|\?|https:\/\/|mailto:|tel:)/i.test(link) && !/^\/\//.test(link) ? link : "";
}

function isCurrent(item, current) {
  if (!current) return false;
  if (item.key === current) return true;
  const href = menuHref(item.href || item.url);
  const key = String(current).replace(/^\/+|\/+$/g, "");
  const target = href.replace(/^\/+|\/+$/g, "");
  return !!target && !/^(https?:|mailto:|tel:)/i.test(target) && (target === key || target.startsWith(key + "/"));
}

function nav(site, current, ctx) {
  const items = ctx.navigation?.header?.length ? ctx.navigation.header : DEFAULT_NAV;
  const links = items.map(item => {
    const href = menuHref(item.href || item.url);
    if (!href || !item.label) return "";
    const external = /^https:\/\//i.test(href);
    const className = item.className || (href === "/pricing/" ? "nav-package" : "");
    return `<a${className ? ` class="${esc(className)}"` : ""} href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ""}${isCurrent(item, current) ? ' aria-current="page"' : ""}>${esc(item.label)}</a>`;
  }).join("");
  return `<nav class="site-nav" aria-label="Main">
  ${logo(site)}
  <div class="links" id="nav-links">${links}</div>
  <div class="nav-actions">
    <a class="pill" href="/contact/">Let’s talk <span>↗</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links"><i aria-hidden="true"></i><span>Menu</span></button>
  </div>
</nav>`;
}

function footer(ctx) {
  const { site, year } = ctx;
  const menu = ctx.navigation?.footer?.length ? ctx.navigation.footer : [
    ...DEFAULT_NAV.map(({ href, label }) => ({ href, label })),
    { href: "/brand-scorecard/", label: "Brand Scorecard" }
  ];
  const links = menu.map(item => {
    const href = menuHref(item.href || item.url);
    if (!href || !item.label) return "";
    const external = /^https:\/\//i.test(href);
    return `<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ""}>${esc(item.label)} <span aria-hidden="true">&#8599;</span></a>`;
  }).filter(Boolean);

  return `<footer class="site-footer">
  ${logo(site)}
  <nav class="footer-menu" aria-label="Footer">${links.join("")}</nav>
  <div class="footer-meta">
    <span>&copy; ${year} ${esc(site.name)} &middot; Brand identity / Digital design</span>
    <span class="footer-legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a>${site.analytics.ga4Id || site.analytics.metaPixelId ? '<button type="button" class="link-button" data-consent-open>Cookie settings</button>' : ""}</span>
  </div>
</footer>`;
}

// The small set of settings the browser scripts need. Nothing private goes in here.
const clientConfig = site => ({
  email: site.contact.email,
  whatsapp: whatsappNumber(site),
  analytics: {
    ga4Id: site.analytics.ga4Id,
    metaPixelId: site.analytics.metaPixelId,
    requireConsent: site.analytics.requireConsent !== false
  }
});

export function page(ctx, options) {
  const { site, assets } = ctx;
  const {
    path, title, description, body,
    current = "", ogImage = DEFAULT_OG, ogType = "website",
    schema = [], noindex = false, scripts = []
  } = options;
  const canonical = site.url + path;
  const verification = [
    site.seo.googleSiteVerification && `<meta name="google-site-verification" content="${esc(site.seo.googleSiteVerification)}">`,
    site.seo.bingSiteVerification && `<meta name="msvalidate.01" content="${esc(site.seo.bingSiteVerification)}">`
  ].filter(Boolean).join("\n");
  const whatsapp = whatsappNumber(site)
    ? `<a class="wa-float" href="${esc(whatsappLink(site))}" target="_blank" rel="noopener" data-track="whatsapp_click" aria-label="Chat with ${esc(site.name)} on WhatsApp"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5z"/></svg><span>WhatsApp</span></a>`
    : "";
  const beacon = site.analytics.cloudflareToken
    ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${esc(JSON.stringify({ token: site.analytics.cloudflareToken }))}'></script>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${esc(canonical)}">`}
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(site.url + ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f3f1e9">
${verification}
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/icon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/icons/icon-192.png">
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="${esc(site.name)} Insights" href="/feed.xml">
<link rel="stylesheet" href="${assets.css}">
<script>document.documentElement.classList.add("js")</script>
${schema.map(item => `<script type="application/ld+json">${dataBlock(item)}</script>`).join("\n")}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${nav(site, current, ctx)}
<main id="main">
${body}
</main>
${footer(ctx)}
${whatsapp}
<script type="application/json" id="site-config">${dataBlock(clientConfig(site))}</script>
${assets.js ? `<script src="${assets.js}" defer></script>` : ""}
${scripts.filter(Boolean).map(src => `<script src="${esc(src)}" defer></script>`).join("\n")}
${beacon}
</body>
</html>
`;
}
