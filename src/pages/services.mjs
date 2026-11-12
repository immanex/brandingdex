import { accent, esc, money } from "../lib/html.mjs";
import { SERVICE_FOR_PAGE } from "../lib/form-options.mjs";
import { crumbs, ctaBand, faqList, packageCard, priceBanner, processSteps } from "../lib/partials.mjs";
import { breadcrumbs, faqPage, service as serviceSchema } from "../lib/schema.mjs";
import { projectCard } from "../lib/visuals.mjs";

const packagesFor = (packages, item) => item.packages
  .map(slug => packages.packages.find(entry => entry.slug === slug))
  .filter(Boolean);

function fromLabel(packages, item) {
  const list = packagesFor(packages, item);
  if (!list.length) return "";
  const lowest = list.reduce((a, b) => a.price <= b.price ? a : b);
  return "Packages from " + money(lowest.price) + (lowest.per ? " / " + lowest.per : "");
}

function index(ctx) {
  const { site, services, packages } = ctx;
  const rows = services.map((item, position) => `<a class="service" href="/services/${item.slug}/">
    <span class="num">0${position + 1}</span><h3>${esc(item.name)}</h3><p>${esc(item.summary)}<span class="service-from">${esc(fromLabel(packages, item))}</span></p><span class="arrow">↗</span>
  </a>`).join("\n  ");

  const body = `<header class="portfolio-intro">
  <div class="eyebrow">SERVICES / WHAT WE DO</div>
  <h1>From first question<br>to final <em>detail.</em></h1>
  <p class="pricing-lead">Strategy, identity, website, and ongoing support. Each is available on its own, and designed to work together.</p>
</header>
<section class="services services-index">
  ${rows}
</section>
${priceBanner(packages)}
<section class="process">
  <div><div class="eyebrow">HOW WE WORK</div><h2>Close collaboration.<br>Clear direction.</h2></div>
  ${processSteps}
</section>
${ctaBand({ eyebrow: "NOT SURE WHERE TO START?", title: "Tell us where<br>you are heading.", text: "Share a little about your business. We’ll recommend the right starting point—and confirm scope, timeline, and total in a written proposal." })}`;

  return {
    path: "/services/",
    current: "services",
    title: "Services — Brand strategy, identity & website design | Brandingdex",
    description: "Brand strategy, brand identity, and professional website design for ambitious businesses in Europe, the UK, and beyond. Based in Nigeria, with clear scopes and transparent starting prices.",
    body,
    schema: [breadcrumbs(site, [{ name: "Services", path: "/services/" }])]
  };
}

function detail(ctx, item) {
  const { site, packages, projects } = ctx;
  const path = "/services/" + item.slug + "/";
  const list = packagesFor(packages, item);
  const related = item.portfolioCategory
    ? projects.filter(project => project.cat === item.portfolioCategory || project.cat === "combined").slice(0, 3)
    : [];
  const contactHref = "/contact/?service=" + encodeURIComponent(SERVICE_FOR_PAGE[item.slug] || "");

  const packageSection = list.length ? `<section class="service-packages tint">
  <div class="section-top">
    <div><div class="eyebrow">PACKAGES</div><h2>A clear place to start.</h2></div>
    <a class="pill ghost" href="/pricing/?category=${esc(item.pricingCategory)}">Compare all packages ↗</a>
  </div>
  <div class="price-grid${list.length === 1 ? " single" : ""}">
    ${list.map(entry => packageCard(entry, packages.currency, "h3")).join("\n")}
    ${list.length === 1 && item.packagesNote ? `<p class="package-note">${esc(item.packagesNote)}</p>` : ""}
  </div>
  ${list.length > 1 && item.packagesNote ? `<p class="package-note">${esc(item.packagesNote)}</p>` : ""}
  <p class="small">Starting prices in ${esc(packages.currency)}. A written proposal confirms your exact scope, timeline, and total before work begins.</p>
</section>` : "";

  const workSection = related.length ? `<section class="related-work">
  <div class="section-top">
    <div><div class="eyebrow">FROM THE PORTFOLIO</div><h2>See the thinking.</h2></div>
    <a class="pill ghost" href="/portfolio/?category=${esc(item.portfolioCategory)}">View more work ↗</a>
  </div>
  <div class="card-grid">${related.map(projectCard).join("")}</div>
</section>` : "";

  const body = `<header class="portfolio-intro service-head">
  ${crumbs([{ name: "Services", path: "/services/" }, { name: item.name, path }])}
  <div class="eyebrow">${esc(item.eyebrow)}</div>
  <h1>${accent(item.headline)}</h1>
  <p class="pricing-lead">${esc(item.lead)}</p>
  <div class="button-row"><a class="pill" href="${contactHref}">Start a project <span>↗</span></a>${list.length ? '<a class="pill ghost" href="#packages">See packages</a>' : ""}</div>
</header>
<section class="process">
  <div><div class="eyebrow">WHO IT’S FOR</div><h2>${esc(item.forTitle)}</h2></div>
  <div class="steps">${item.for.map(entry => `<article><h3>${esc(entry.title)}</h3><p>${esc(entry.text)}</p></article>`).join("")}</div>
</section>
<section class="included">
  <div class="eyebrow">WHAT’S INCLUDED</div>
  <h2>${esc(item.includedTitle)}</h2>
  <div class="feature-grid">${item.included.map(entry => `<article><h3>${esc(entry.title)}</h3><p>${esc(entry.text)}</p></article>`).join("")}</div>
</section>
<div id="packages">${packageSection}</div>
${workSection}
<section class="pricing-notes service-faq">
  <div>
    <div class="eyebrow">GOOD TO KNOW</div>
    <h2>Questions,<br>answered.</h2>
    <p>Something else on your mind? Ask in your project brief and we’ll answer it in our reply.</p>
  </div>
  ${faqList(item.faq)}
</section>
${ctaBand({ eyebrow: "READY WHEN YOU ARE.", title: "Let’s make your<br>next chapter count.", href: contactHref, label: "Start a project", secondary: { href: "/brand-scorecard/", label: "Take the Brand Scorecard" } })}`;

  return {
    path,
    current: "services",
    title: item.metaTitle + " | Brandingdex",
    description: item.metaDescription,
    body,
    schema: [
      breadcrumbs(site, [{ name: "Services", path: "/services/" }, { name: item.name, path }]),
      serviceSchema(site, item),
      faqPage(item.faq)
    ]
  };
}

export default function services(ctx) {
  return [index(ctx), ...ctx.services.map(item => detail(ctx, item))];
}
