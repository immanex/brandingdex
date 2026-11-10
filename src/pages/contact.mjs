import { esc } from "../lib/html.mjs";
import { contactLinks, linkTag } from "../lib/layout.mjs";
import { contactForm, formScripts } from "../lib/partials.mjs";
import { breadcrumbs } from "../lib/schema.mjs";

function contact(ctx) {
  const { site } = ctx;
  const direct = contactLinks(site);
  const body = `<section class="contact contact-page">
  <div>
    <div class="eyebrow">CONTACT US / YOUR NEXT CHAPTER</div>
    <h1>Something good<br>starts with a<br><em>conversation.</em></h1>
    <p>Launching, evolving, or ready for a new direction? Tell us what you have in mind.</p>
    <ol class="next-steps">
      <li><strong>Send your brief.</strong> A few lines about your business and what you need is enough.</li>
      <li><strong>We reply ${esc(site.contact.responseTime)}.</strong> With questions, first thoughts, or a time to talk.</li>
      <li><strong>You receive a written proposal.</strong> Scope, timeline, and total—confirmed before any work begins.</li>
    </ol>
    ${direct.length ? `<div class="direct"><div class="eyebrow">PREFER TO REACH US DIRECTLY?</div><ul>${direct.map(link => "<li>" + linkTag(link) + "</li>").join("")}</ul></div>` : ""}
  </div>
  ${contactForm(ctx)}
</section>
<section class="included">
  <div class="eyebrow">NOT READY TO TALK YET?</div>
  <h2>Take a look around first.</h2>
  <div class="feature-grid">
    <article><h3><a href="/pricing/">Packages & pricing ↗</a></h3><p>Transparent starting prices for brand identity, websites, and ongoing support.</p></article>
    <article><h3><a href="/brand-scorecard/">The Brand Scorecard ↗</a></h3><p>Twelve quick questions to see where your brand stands and what to focus on first.</p></article>
    <article><h3><a href="/portfolio/">The portfolio ↗</a></h3><p>Brand identities, websites, and stationery—each with a full design gallery.</p></article>
  </div>
</section>`;

  return {
    path: "/contact/",
    current: "contact",
    title: "Contact — Start a brand or website project | Brandingdex",
    description: `Tell Brandingdex about your brand identity or website project. We reply ${site.contact.responseTime} with clear next steps and a written proposal.`,
    body,
    schema: [breadcrumbs(site, [{ name: "Contact", path: "/contact/" }])],
    scripts: formScripts(site)
  };
}

function thanks(ctx) {
  const { site } = ctx;
  const body = `<header class="portfolio-intro">
  <div class="eyebrow">THANK YOU</div>
  <h1>Your brief is<br><em>with us.</em></h1>
  <p class="pricing-lead">Thank you for getting in touch. We’ll read it properly and reply ${esc(site.contact.responseTime)}.</p>
  <p class="small">You should receive a confirmation email shortly. If it doesn’t arrive, check your spam folder.</p>
</header>
<section class="process">
  <div><div class="eyebrow">WHAT HAPPENS NEXT</div><h2>Three simple steps.</h2></div>
  <div class="steps">
    <article><h3>01 — We review your brief.</h3><p>We look at your business, what you need, and where we can help most.</p></article>
    <article><h3>02 — We reply with next steps.</h3><p>Questions, first thoughts, or a time to talk it through.</p></article>
    <article><h3>03 — You receive a proposal.</h3><p>Scope, timeline, and total, confirmed in writing before any work begins.</p></article>
  </div>
</section>
<aside class="price-banner">
  <div><div class="eyebrow">WHILE YOU WAIT</div><h2>See how we think.</h2><p>Explore the portfolio, or read our notes on building a clearer brand.</p></div>
  <div class="button-row"><a class="pill" href="/portfolio/">Explore the portfolio ↗</a><a class="pill ghost" href="/insights/">Read insights</a></div>
</aside>`;

  return { path: "/thanks/", title: "Thank you | Brandingdex", description: "Your project brief has been received.", body, noindex: true };
}

const simple = (path, title, eyebrow, headline, text) => ({
  path,
  title: title + " | Brandingdex",
  description: text,
  noindex: true,
  body: `<header class="portfolio-intro simple-page">
  <div class="eyebrow">${eyebrow}</div>
  <h1>${headline}</h1>
  <p class="pricing-lead">${esc(text)}</p>
  <div class="button-row"><a class="pill" href="/insights/">Read our insights ↗</a><a class="pill ghost" href="/">Back to home</a></div>
</header>`
});

export default function contactPages(ctx) {
  const name = ctx.site.newsletter.name;
  return [
    contact(ctx),
    thanks(ctx),
    simple("/newsletter/confirmed/", "Subscription confirmed", "NEWSLETTER", "You’re <em>in.</em>", `Your subscription to ${name} is confirmed. Thank you for reading.`),
    simple("/newsletter/pending/", "Confirm your subscription", "NEWSLETTER", "One more <em>step.</em>", `Check your inbox and confirm your email address to finish subscribing to ${name}.`)
  ];
}
