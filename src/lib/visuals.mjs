// Portfolio cards and case-study gallery visuals, rendered at build time.
// Ported from the preview's portfolio.js and case-study.js so the markup (and style.css) stay the same.

import { esc } from "./html.mjs";

const color = value => /^#[\da-f]{6}$/i.test(value || "") ? value : "#d8d8d0";
const uploaded = path => typeof path === "string" && path.indexOf("/assets/portfolio/") === 0;

function cardVisual(project) {
  const bg = color(project.bg);
  const fg = color(project.fg);
  if (uploaded(project.cover)) {
    return '<div class="art portfolio-art cover-art" style="--bg:' + bg + ";--fg:" + fg + '">' +
      '<img src="' + esc(project.cover) + '" alt="' + esc(project.name + " — " + project.type) + '" loading="lazy"></div>';
  }
  if (project.cat === "website" || project.cat === "combined") {
    return '<div class="art portfolio-art portfolio-web-art" style="--bg:' + bg + ";--fg:" + fg + '" role="img" aria-label="' + esc(project.name + " website design concept") + '">' +
      '<div class="portfolio-web-preview"><div class="portfolio-web-bar"><i></i><i></i><i></i><b>' + esc(project.name.toLowerCase()) + ".</b></div>" +
      '<div class="portfolio-web-content"><small>WEBSITE CONCEPT</small><strong>' + esc(project.tag) + "</strong><span>Explore more ↗</span><i></i></div></div></div>";
  }
  if (project.cat === "stationery") {
    return '<div class="art stationery-art portfolio-art" style="--bg:' + bg + ";--fg:" + fg + '" role="img" aria-label="' + esc(project.name + " stationery concept") + '">' +
      '<div class="stationery-id"><span>TEAM</span><b>' + esc(initials(project.name)) + "</b><i></i><strong>STAFF ID</strong></div>" +
      '<div class="stationery-cards"><b>' + esc(project.name) + "</b><span>BUSINESS CARD</span><i></i><i></i></div>" +
      '<div class="stationery-invoice"><b>INVOICE</b><i></i><i></i><i></i><span>01—05</span></div></div>';
  }
  return '<div class="art portfolio-art" style="--bg:' + bg + ";--fg:" + fg + '" role="img" aria-label="' + esc(project.name + " brand identity concept") + '">' +
    '<span class="ring"></span><span class="brand">' + esc(project.name.toLowerCase()) + ".</span></div>";
}

const initials = name => name.split(/\s+/).map(word => word.slice(0, 1)).join("").slice(0, 2).toUpperCase();

export function projectCard(project) {
  const label = project.concept ? "Illustrative concept" : "Project";
  return '<a class="project-card" data-category="' + esc(project.cat) + '" href="/work/' + esc(project.slug) + '/">' +
    cardVisual(project) +
    '<div class="project-title"><span>' + esc(project.name + " — " + project.type) + "</span><span>↗</span></div>" +
    '<div class="tags">' + esc(project.tag) + "</div>" +
    '<div class="concept-label">' + label + " / View case study</div></a>";
}

export function heroProjectTile(project, clone = false) {
  return '<a class="hero-project-tile" href="/work/' + esc(project.slug) + '/"' +
    (clone ? ' tabindex="-1" aria-hidden="true"' : "") + '>' +
    '<div class="hero-tile-art">' + cardVisual(project) + '</div>' +
    '<div class="hero-tile-label"><strong>' + esc(project.name) + '</strong><span>' + esc(project.type) + '</span></div></a>';
}

function websiteVisual(project, screen, index) {
  const bg = color(project.bg);
  const fg = color(project.fg);
  const action = screen.button || "Discover more";
  return '<div class="website-screen" style="--bg:' + bg + ";--fg:" + fg + '">' +
    '<div class="website-nav"><strong>' + esc(project.name.toLowerCase()) + ".</strong><span>ABOUT</span><span>SERVICES</span><span>WORK</span><b>CONTACT ↗</b></div>" +
    '<div class="website-hero website-hero-' + (index % 3) + '">' +
      '<div class="website-copy"><small>' + esc(screen.label) + "</small><h4>" + esc(screen.headline) + "</h4><p>" + esc(screen.body) + '</p><span class="website-action">' + esc(action) + " ↗</span></div>" +
      '<div class="website-shape" aria-hidden="true"><i></i><b>' + esc(project.name.slice(0, 1).toUpperCase()) + "</b></div>" +
    "</div>" +
    '<div class="website-bottom"><span>01 &nbsp; BRAND STRATEGY</span><span>02 &nbsp; VISUAL IDENTITY</span><span>03 &nbsp; DIGITAL EXPERIENCE</span></div>' +
  "</div>";
}

function identityVisual(project, screen) {
  const bg = color(project.bg);
  const fg = color(project.fg);
  const asset = screen.asset || "brand-mark";
  if (asset === "typography") {
    return '<div class="identity-board typography-board" style="--bg:' + bg + ";--fg:" + fg + '">' +
      '<div class="identity-board-top"><span>' + esc(project.name.toUpperCase()) + " / TYPOGRAPHY</span><span>BRAND SYSTEM — 02</span></div>" +
      '<div class="type-display"><span>Aa</span><strong>' + esc(project.name) + ".</strong><small>ABCDEFGHIJKLM<br>NOPQRSTUVWXYZ<br>0123456789</small></div>" +
      '<div class="identity-palette"><i style="background:' + bg + '"></i><i style="background:' + fg + '"></i><i style="background:#f3f1e9"></i><span>COLOUR / TYPE / TONE</span></div>' +
    "</div>";
  }
  return '<div class="identity-board mark-board" style="--bg:' + bg + ";--fg:" + fg + '">' +
    '<div class="identity-board-top"><span>' + esc(project.name.toUpperCase()) + " / IDENTITY</span><span>BRAND SYSTEM — 01</span></div>" +
    '<div class="identity-signature"><span class="identity-orbit"><i></i></span><div><strong>' + esc(project.name.toLowerCase()) + ".</strong><small>BRAND SIGNATURE</small></div></div>" +
    '<div class="identity-board-bottom"><b>' + esc(screen.headline) + "</b><span>" + esc(screen.body) + "</span></div>" +
  "</div>";
}

function stationeryVisual(project, screen) {
  const bg = color(project.bg);
  const fg = color(project.fg);
  const name = esc(project.name);
  const asset = screen.asset || "business-card";
  const stage = '<div class="stationery-stage" style="--bg:' + bg + ";--fg:" + fg + '">';
  if (asset === "id-card") {
    return stage +
      '<div class="id-card-design"><div class="id-card-brand">' + name + '<span>TEAM</span></div><div class="id-portrait"><b>' + esc(project.name.slice(0, 1).toUpperCase()) + '</b></div><div class="id-person"><strong>TEAM MEMBER</strong><span>GUEST EXPERIENCE</span><i></i><small>STAFF ID / 001</small></div></div>' +
      '<div class="stationery-note"><small>STAFF ID CARD</small><span>Clear details. Easy to wear.</span></div></div>';
  }
  if (asset === "letterhead") {
    return stage +
      '<div class="paper-document letterhead-design"><div class="paper-brand">' + name + '<small>HOSPITALITY / THOUGHTFULLY YOURS</small></div><div class="document-date">STUDIO NOTE &nbsp; / &nbsp; 2026</div><div class="document-lines"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="paper-foot">A PLACE TO FEEL AT HOME</div></div>' +
      '<div class="stationery-note"><small>LETTERHEAD</small><span>A quiet frame for a clear message.</span></div></div>';
  }
  if (asset === "invoice") {
    return stage +
      '<div class="paper-document invoice-design"><div class="invoice-top"><div class="paper-brand">' + name + '<small>INVOICE / 001</small></div><b>INVOICE</b></div><div class="invoice-details"><span>PREPARED FOR<br>CLIENT NAME</span><span>DATE<br>26 OCT 2026</span></div><div class="invoice-row"><span>DESCRIPTION</span><span>AMOUNT</span></div><div class="document-lines"><i></i><i></i><i></i></div><div class="invoice-total"><span>TOTAL DUE</span><b>$000.00</b></div></div>' +
      '<div class="stationery-note"><small>INVOICE TEMPLATE</small><span>Organised for everyday business.</span></div></div>';
  }
  if (asset === "envelope") {
    return stage +
      '<div class="envelope-design"><div class="envelope-flap"></div><strong>' + name + "</strong><span>WELCOME, ALWAYS.</span><i></i></div>" +
      '<div class="stationery-note"><small>ENVELOPE</small><span>A considered first impression.</span></div></div>';
  }
  return stage +
    '<div class="business-card-pair"><div class="business-card-front"><strong>' + name + '</strong><small>HOSPITALITY / THOUGHTFULLY YOURS</small><i></i></div><div class="business-card-back"><b>' + esc(project.name.slice(0, 1)) + "</b><span>NAME SURNAME<br>GUEST RELATIONS</span><small>hello@example.com</small></div></div>" +
    '<div class="stationery-note"><small>BUSINESS CARD</small><span>Two sides. One consistent identity.</span></div></div>';
}

function screenVisual(project, screen, index) {
  if (uploaded(screen.image)) {
    return '<div class="uploaded-screen"><img src="' + esc(screen.image) + '" alt="' + esc(screen.headline || project.name + " project screen") + '" loading="lazy"></div>';
  }
  if (screen.kind === "website") return websiteVisual(project, screen, index);
  if (screen.kind === "stationery") return stationeryVisual(project, screen);
  return identityVisual(project, screen);
}

export function gallerySlide(project, screen, index, total) {
  const label = screen.label || ("SCREEN " + String(index + 1).padStart(2, "0"));
  return '<article class="gallery-slide" role="group" aria-roledescription="slide" aria-label="' + (index + 1) + " of " + total + '">' +
    '<div class="gallery-slide-head"><span class="eyebrow">' + esc(label) + "</span><h3>" + esc(screen.headline || project.name) + "</h3><p>" + esc(screen.body || "") + "</p></div>" +
    '<div class="gallery-art" role="img" aria-label="' + esc(project.name + " — " + (screen.label || "design screen")) + '">' + screenVisual(project, screen, index) + "</div>" +
  "</article>";
}
