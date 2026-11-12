// Building blocks shared by several pages: forms, package cards, FAQs and call-to-action bands.

import { esc, longDate, money } from "./html.mjs";
import { BUDGETS, SERVICES, TIMELINES } from "./form-options.mjs";

const options = (values, selected) => values.map(value =>
  `<option${value === selected ? " selected" : ""}>${esc(value)}</option>`).join("");

export const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js";
export const formScripts = site => site.forms.turnstileSiteKey ? [TURNSTILE_SCRIPT] : [];

// The project brief form. `compact` is the short version used on the home page.
export function contactForm(ctx, { compact = false, context = "" } = {}) {
  const { site, packages } = ctx;
  const packageOptions = packages.packages.map(item =>
    `<option value="${esc(item.name)}" data-service="${esc(item.service)}">${esc(item.name)} — from ${money(item.price)}${item.per ? " / " + item.per : ""}</option>`).join("");
  const details = compact ? "" : `
  <div class="field-row">
    <label><span class="field-label">Business or brand name <span class="field-optional">Optional</span></span><input name="company" autocomplete="organization" maxlength="120" placeholder="e.g. Northstar Studio"></label>
    <label><span class="field-label">Package in mind <span class="field-optional">Optional</span></span>
      <select name="package"><option value="">Not sure yet — help me choose</option>${packageOptions}</select>
    </label>
  </div>
  <div class="field-row">
    <label><span class="field-label">Budget range <span class="field-optional">Optional</span></span>
      <select name="budget"><option value="">Select a range (optional)</option>${options(BUDGETS)}</select>
    </label>
    <label><span class="field-label">Timeline <span class="field-optional">Optional</span></span>
      <select name="timeline"><option value="">Select a timeline (optional)</option>${options(TIMELINES)}</select>
    </label>
  </div>`;
  const newsletter = site.newsletter.enabled
    ? `<label class="check"><input type="checkbox" name="newsletter" value="yes"><span>Also send me ${esc(site.newsletter.name)}—occasional notes on brand identity and websites.</span></label>`
    : "";
  const turnstile = site.forms.turnstileSiteKey
    ? `<div class="cf-turnstile" data-sitekey="${esc(site.forms.turnstileSiteKey)}" data-theme="auto"></div>`
    : "";

  const formAttrs = 'action="/api/contact" data-ajax="true"';
  return `<form id="${compact ? "quick-brief-form" : "project-brief-form"}" class="brief-form" data-form="contact" name="${compact ? "quick-brief" : "project-brief"}" ${formAttrs} method="post">
  ${compact ? "" : `<div class="brief-form-intro"><div class="brief-form-kicker"><span>PROJECT BRIEF</span><span>ABOUT 2 MINUTES</span></div><h2>Tell us what you’re planning.</h2><p>Fields marked * are required. Review and edit every answer before you send it.</p></div>`}
  <div class="package-choice" hidden></div>
  ${compact ? "" : '<div class="field-row">'}
    <label><span class="field-label">Your name <span class="field-required" aria-hidden="true">*</span></span><input name="name" required autocomplete="name" maxlength="100" placeholder="How should we call you?"></label>
    <label><span class="field-label">Email address <span class="field-required" aria-hidden="true">*</span></span><input name="email" type="email" required autocomplete="email" maxlength="254" placeholder="you@company.com"></label>
  ${compact ? "" : "</div>"}
  <label><span class="field-label">What are you looking for? <span class="field-required" aria-hidden="true">*</span></span>
    <select name="service" required><option value="">Select a service</option>${options(SERVICES)}</select>
  </label>${details}
  <label><span class="field-label">A little about your project <span class="field-required" aria-hidden="true">*</span></span><textarea name="project" required rows="${compact ? 3 : 5}" maxlength="5000" placeholder="Your business, your ambition, your next big step..."></textarea></label>
  ${newsletter}
  <input type="hidden" name="context" value="${esc(context)}">
  <input type="hidden" name="form_path" value="${compact ? "/" : "/contact/"}">
  <div class="hp" aria-hidden="true"><label>Leave this field empty<input name="company_url" tabindex="-1" autocomplete="off"></label></div>
  ${turnstile}
  <button class="submit" type="submit">Send my project brief <span aria-hidden="true">↗</span></button>
  <p class="notice">We’ll email you a copy of your brief and use your details to respond. See our <a href="/privacy/">privacy policy</a>.</p>
  <p class="form-status" role="status" aria-live="polite" hidden></p>
  <div class="form-fallback" hidden></div>
</form>`;
}

export function faqList(items) {
  return '<div class="faq">' + items.map((item, index) =>
    `<details${index === 0 ? " open" : ""}><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`).join("") + "</div>";
}

export function packageCard(item, currency, heading = "h2") {
  return `<article class="price-card${item.featured ? " featured" : ""}" data-package-category="${esc(item.category)}">
  <div class="price-kicker">${item.featured ? "RECOMMENDED STARTING POINT" : "BUILT AROUND YOUR NEXT STEP"}</div>
  <${heading}>${esc(item.name)}</${heading}>
  <p class="package-desc">${esc(item.description)}</p>
  <div class="amount"><small>From</small> ${money(item.price)}<span> ${esc(currency)}${item.per ? " / " + esc(item.per) : ""}</span></div>
  <p class="timeline">${esc(item.timelineLabel)} / ${esc(item.timeline)}</p>
  <ul>${item.features.map(feature => `<li>${esc(feature)}</li>`).join("")}</ul>
  <a class="pill" href="/contact/?package=${encodeURIComponent(item.name)}" data-track="package_select">Discuss this package <span>↗</span></a>
</article>`;
}

// Lowest listed price for each kind of work, so the numbers shown around the site always match packages.json.
export function startingPrices(packages) {
  const lowest = category => Math.min(...packages.packages.filter(item => item.category === category).map(item => item.price));
  const price = slug => (packages.packages.find(item => item.slug === slug) || {}).price;
  return {
    brand: money(lowest("brand")),
    web: money(lowest("web")),
    bundle: money(price("brand-website")),
    partner: money(price("creative-partner"))
  };
}

export function priceBanner(packages) {
  const from = startingPrices(packages);
  return `<aside class="price-banner package-starting-prices" aria-labelledby="starting-prices-title">
  <div class="package-pricing-copy">
    <div class="eyebrow">A CLEAR PLACE TO START</div>
    <h2 id="starting-prices-title">Clear scope.<br>Clear starting prices.</h2>
    <p>Choose the kind of support you need. We will confirm the full scope and total in a written proposal before work begins.</p>
    <div class="starting-price-grid">
      <div class="starting-price-item"><span>Brand identity</span><strong>${from.brand}</strong><small>one-time · ${esc(packages.currency)}</small></div>
      <div class="starting-price-item"><span>Professional website</span><strong>${from.web}</strong><small>one-time · ${esc(packages.currency)}</small></div>
      <div class="starting-price-item"><span>Brand + website</span><strong>${from.bundle}</strong><small>one-time · ${esc(packages.currency)}</small></div>
      <div class="starting-price-item"><span>Ongoing creative support</span><strong>${from.partner}</strong><small>per month · ${esc(packages.currency)}</small></div>
    </div>
    <span class="small">Stationery is included in selected brand packages. Logo animation is included in Brand Signature.</span>
  </div>
  <div class="package-pricing-action"><a class="pill" href="/pricing/">Compare all packages <span aria-hidden="true">&#8599;</span></a></div>
</aside>`;
}

export const processSteps = `<div class="steps">
  <article><h3>01 — Get to the heart of it.</h3><p>We start with your business, audience, and ambitions. Together, we define the problem worth solving.</p></article>
  <article><h3>02 — Explore with intention.</h3><p>We connect strategic thinking with creative exploration, building a direction with a clear reason behind it.</p></article>
  <article><h3>03 — Bring it into the world.</h3><p>We refine the details and equip you with the assets and guidance to launch with confidence.</p></article>
</div>`;

// The dark closing band that invites a conversation.
export function ctaBand({
  eyebrow = "LET’S MAKE YOUR NEXT CHAPTER COUNT.",
  title = "A stronger brand.<br>A better website.",
  text = "Tell us where your business is heading. We’ll reply with clear next steps.",
  href = "/contact/",
  label = "Start a conversation",
  secondary = { href: "/pricing/", label: "See packages" },
  className = ""
} = {}) {
  return `<section class="contact cta-band${className ? " " + className : ""}">
  <div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2></div>
  <div>
    <p>${text}</p>
    <div class="button-row"><a class="pill" href="${href}">${label} <span>↗</span></a>${secondary ? `<a class="pill ghost" href="${secondary.href}">${secondary.label}</a>` : ""}</div>
  </div>
</section>`;
}

export function crumbs(trail) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return '<div role="navigation" aria-label="Breadcrumb"><ol class="crumbs">' + items.map((item, index) =>
    index === items.length - 1
      ? `<li aria-current="page">${esc(item.name)}</li>`
      : `<li><a href="${item.path}">${esc(item.name)}</a></li>`).join("") + "</ol></div>";
}

export function postCover(post, variant = "") {
  const fallback = `<div class="post-cover-placeholder" aria-hidden="true">
  <span class="post-cover-topic">${esc(post.tag || "Brand notes")}</span>
  <strong>${esc(String(post.title || "B").trim().slice(0, 1).toUpperCase())}</strong>
  <span class="post-cover-signature">Brand notes / Brandingdex</span>
</div>`;
  const image = post.cover
    ? `<img src="${esc(post.cover)}" alt="${esc(post.coverAlt || post.title || "Article cover")}" loading="lazy">`
    : fallback;
  return `<div class="post-cover${variant ? ` ${variant}` : ""}${post.cover ? " has-image" : " is-placeholder"}">${image}</div>`;
}

export function postCard(post) {
  return `<a class="post-card" href="/insights/${esc(post.slug)}/">
  ${postCover(post)}
  <div class="post-card-body">
    <span class="eyebrow">${esc(post.tag)}</span>
    <h3>${esc(post.title)}</h3>
    <p>${esc(post.description)}</p>
    <span class="post-meta">${longDate(post.date)} &middot; ${post.minutes} min read</span>
  </div>
</a>`;
}
