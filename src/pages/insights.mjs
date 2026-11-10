import { esc, longDate } from "../lib/html.mjs";
import { subscribeForm } from "../lib/layout.mjs";
import { crumbs, ctaBand, postCard, postCover } from "../lib/partials.mjs";
import { article, breadcrumbs } from "../lib/schema.mjs";

function index(ctx) {
  const { site, posts } = ctx;
  const news = site.newsletter.enabled ? `<aside class="price-banner news-banner">
  <div><div class="eyebrow">${esc(site.newsletter.name)}</div><h2>Get new notes by email.</h2><p>${esc(site.newsletter.pitch)}</p></div>
  ${subscribeForm(ctx, "insights")}
</aside>` : "";

  const body = `<header class="portfolio-intro">
  <div class="eyebrow">INSIGHTS / BRAND NOTES</div>
  <h1>Notes on building<br>a clearer <em>brand.</em></h1>
  <p class="pricing-lead">Practical thinking on brand identity and websites, written for founders and growing businesses.</p>
</header>
<section class="insights-list">
  <div class="post-grid">${posts.map(postCard).join("")}</div>
</section>
${news}
${ctaBand()}`;

  return {
    path: "/insights/",
    current: "insights",
    title: "Insights — Notes on brand identity & websites | Brandingdex",
    description: "Practical notes on brand identity, website projects, and building a clearer brand—written for founders and growing businesses.",
    body,
    schema: [breadcrumbs(site, [{ name: "Insights", path: "/insights/" }])]
  };
}

function post(ctx, item) {
  const { site, posts } = ctx;
  const path = "/insights/" + item.slug + "/";
  const others = posts.filter(entry => entry.slug !== item.slug).slice(0, 2);
  const news = site.newsletter.enabled
    ? `<section class="article-news"><div class="eyebrow">${esc(site.newsletter.name)}</div><p>${esc(site.newsletter.pitch)}</p>${subscribeForm(ctx, "article")}</section>`
    : "";

  const body = `<article class="insight-article">
<header class="article-head">
  <div class="article-head-copy">
    ${crumbs([{ name: "Insights", path: "/insights/" }, { name: item.title, path }])}
    <div class="eyebrow">${esc(item.tag)}</div>
    <h1>${esc(item.title)}</h1>
    <p class="pricing-lead">${esc(item.description)}</p>
    <p class="post-meta">By ${esc(site.name)} <span aria-hidden="true">&middot;</span> <time datetime="${esc(item.date)}">${longDate(item.date)}</time> <span aria-hidden="true">&middot;</span> ${item.minutes} min read</p>
  </div>
  ${postCover(item, "post-cover-article")}
</header>
<div class="article-body">
  <div class="prose">
${item.html}
  </div>
  <aside class="article-aside">
    ${news}
    <section class="article-aside-card">
      <div class="eyebrow">WORKING ON YOUR BRAND?</div>
      <p>Tell us where your business is heading. We will reply with clear next steps.</p>
      <a class="pill" href="/contact/">Start a project <span aria-hidden="true">&rarr;</span></a>
      <a class="text-link" href="/brand-scorecard/">Or take the Brand Scorecard &rarr;</a>
    </section>
  </aside>
</div>
</article>
${others.length ? `<section class="insights-preview tint">
  <div class="section-top"><div><div class="eyebrow">KEEP READING</div><h2>More notes.</h2></div><a class="pill ghost" href="/insights/">All insights &rarr;</a></div>
  <div class="post-grid">${others.map(postCard).join("")}</div>
</section>` : ""}
${ctaBand()}`;

  return {
    path,
    current: "insights",
    title: item.title + " | Brandingdex",
    description: item.description,
    body,
    ogType: "article",
    lastmod: item.updated || item.date,
    schema: [
      breadcrumbs(site, [{ name: "Insights", path: "/insights/" }, { name: item.title, path }]),
      article(site, item)
    ]
  };
}

export default function insights(ctx) {
  if (!ctx.posts.length) return [];
  return [index(ctx), ...ctx.posts.map(item => post(ctx, item))];
}
