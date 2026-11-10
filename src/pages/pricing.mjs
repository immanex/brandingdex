import { esc } from "../lib/html.mjs";
import { faqList, packageCard, startingPrices } from "../lib/partials.mjs";
import { breadcrumbs, faqPage } from "../lib/schema.mjs";

export default function pricing(ctx) {
  const { site, packages } = ctx;
  const from = startingPrices(packages);
  const tabs = packages.categories.map((category, index) =>
    `<button type="button" data-price-filter="${esc(category.id)}" aria-pressed="${index === 0}">${esc(category.label)}</button>`).join("");

  const body = `<header class="portfolio-intro">
  <div class="eyebrow">PACKAGES / BUILT FOR YOUR NEXT CHAPTER</div>
  <h1>A clear investment.<br>A stronger <em>presence.</em></h1>
  <p class="pricing-lead">Start with what your business needs today. Build on it when you’re ready.</p>
  <p class="small">Transparent starting prices in ${esc(packages.currency)}. A written proposal confirms your exact scope, timeline, and total before work begins.</p>
  <div class="filters" role="group" aria-label="Choose package category">${tabs}</div>
</header>
<div class="price-grid" data-tabs="${esc(packages.categories[0].id)}">
${packages.packages.map(item => packageCard(item, packages.currency)).join("\n")}
</div>
<section class="pricing-notes">
  <div>
    <div class="eyebrow">A FEW USEFUL DETAILS</div>
    <h2>Clear scope.<br>No guesswork.</h2>
    <p>${esc(packages.note)}</p>
    <div class="button-row"><a class="pill" href="/contact/">Need a tailored scope? Let’s talk ↗</a></div>
    <p>Not sure which package fits? <a class="text-link" href="/brand-scorecard/">Take the 2-minute Brand Scorecard ↗</a></p>
  </div>
  ${faqList(packages.faq)}
</section>`;

  return [{
    path: "/pricing/",
    current: "pricing",
    title: "Packages & pricing — Brand identity & website design | Brandingdex",
    description: `Clear packages with transparent starting prices: brand identity from ${from.brand}, professional websites from ${from.web}, brand + website from ${from.bundle}. Final scope confirmed by proposal.`,
    body,
    schema: [breadcrumbs(site, [{ name: "Packages & pricing", path: "/pricing/" }]), faqPage(packages.faq)]
  }];
}
