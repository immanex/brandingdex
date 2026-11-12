import { esc } from "../lib/html.mjs";
import { contactLinks, linkTag } from "../lib/layout.mjs";
import { contactForm, formScripts } from "../lib/partials.mjs";
import { breadcrumbs } from "../lib/schema.mjs";

function contact(ctx) {
  const { site } = ctx;
  const direct = contactLinks(site);
  const body = `<section class="contact contact-page">
  <div class="contact-intro">
    <div class="eyebrow"><span class="dot"></span>LET’S TALK / YOUR NEXT CHAPTER</div>
    <h1>Make your next move <em>mean more.</em></h1>
    <p class="contact-lead">Tell us where your business is heading and what you need help with. A few clear lines are plenty to get the conversation started.</p>
    <div class="contact-promise">
      <span class="contact-promise-index">01</span>
      <div><strong>A thoughtful reply, ${esc(site.contact.responseTime)}.</strong><span>We’ll read your brief and follow up with useful next steps.</span></div>
    </div>
    <div class="contact-promise">
      <span class="contact-promise-index">02</span>
      <div><strong>Your answers stay editable.</strong><span>Nothing is sent until you choose “Send my project brief”.</span></div>
    </div>
    ${direct.length ? `<div class="direct contact-direct"><div class="eyebrow">PREFER TO REACH US DIRECTLY?</div><ul>${direct.map(link => "<li>" + linkTag(link) + "</li>").join("")}</ul></div>` : ""}
  </div>
  <div class="contact-form-wrap">
    ${contactForm(ctx)}
  </div>
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
  const body = `<section class="thanks-page">
  <div class="thanks-topline"><div class="eyebrow"><span class="thanks-check" aria-hidden="true">✓</span>BRIEF RECEIVED</div><span class="thanks-reference">BRANDINGDEX / PROJECT ENQUIRY</span></div>
  <div class="thanks-main">
    <div class="thanks-copy">
      <h1>Your brief is<br><em>with us.</em></h1>
      <p class="thanks-lead">Thank you for sharing what you’re working on. We’ll read it properly and reply ${esc(site.contact.responseTime)}.</p>
      <div class="receipt-notice" data-receipt-status aria-live="polite"><span class="receipt-symbol" aria-hidden="true">✉</span><span>We’re sending a copy of your brief to the email address you provided.</span></div>
      <div class="thanks-actions">
        <a class="pill" href="/pricing/">Explore packages <span aria-hidden="true">↗</span></a>
        <a class="pill ghost" href="/">Back to homepage</a>
        <a class="thanks-secondary" href="/contact/">Start another brief</a>
      </div>
    </div>
    <aside class="thanks-next">
      <div class="eyebrow">WHAT HAPPENS NEXT</div>
      <article><span>01</span><div><h2>We review your brief.</h2><p>We look at your business, what you need, and where we can help most.</p></div></article>
      <article><span>02</span><div><h2>We reply with next steps.</h2><p>Expect questions, first thoughts, or a time to talk it through.</p></div></article>
      <article><span>03</span><div><h2>You receive a proposal.</h2><p>We confirm scope, timeline, and total in writing before any work begins.</p></div></article>
    </aside>
  </div>
</section>`;

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
