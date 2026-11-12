import { esc } from "../lib/html.mjs";
import { ctaBand, processSteps } from "../lib/partials.mjs";
import { breadcrumbs, organization } from "../lib/schema.mjs";

const PRINCIPLES = [
  { title: "Strategy before style.", text: "Every design decision should have a reason behind it. We start with your business, your audience, and your ambitions." },
  { title: "A system, not just a logo.", text: "A brand is recognised through consistency. We design marks, colour, type, and templates that work together." },
  { title: "Clear scope. No guesswork.", text: "Transparent starting prices, and a written proposal that confirms scope, timeline, and total before work begins." },
  { title: "Close collaboration.", text: "You are part of the process, with structured feedback rounds and a clear handover at the end." }
];

export default function about(ctx) {
  const { site } = ctx;
  const founder = site.founder.name ? `<section class="founder tint">
  ${site.founder.photo ? `<img src="${esc(site.founder.photo)}" alt="${esc(site.founder.name)}" loading="lazy">` : ""}
  <div>
    <div class="eyebrow">WHO YOU’LL WORK WITH</div>
    <h2>${esc(site.founder.name)}</h2>
    ${site.founder.role ? `<p class="founder-role">${esc(site.founder.role)}</p>` : ""}
    ${site.founder.bio ? `<p>${esc(site.founder.bio)}</p>` : ""}
  </div>
</section>` : "";

  const body = `<header class="portfolio-intro">
  <div class="eyebrow">ABOUT / THE STUDIO</div>
  <h1>Independent thinking.<br>Lasting <em>impressions.</em></h1>
  <p class="pricing-lead">Brandingdex is an independent brand strategy and design studio. We help ambitious businesses express their value with clarity, build distinctive identities, and create digital experiences that carry their brand forward.</p>
</header>
<section class="about-story" aria-labelledby="about-story-title">
  <div class="about-story-image">
    <img src="/assets/about-editorial.jpg" alt="A designer arranging colour and paper studies on a warm studio worktable" loading="lazy">
    <span class="about-story-shade" aria-hidden="true"></span>
    <div class="eyebrow">01 / WHY WE EXIST</div>
    <h2 id="about-story-title">Good design<br>gets noticed.<br>A clear brand<br><em>gets chosen.</em></h2>
    <span class="about-story-caption">Clarity comes first. Then the design.</span>
  </div>
  <div class="about-story-copy">
    <div class="eyebrow">A CLEAR STARTING POINT</div>
    <p>Most businesses do not have a design problem first. They have a clarity problem: what they offer, who it is for, and why it matters is not yet easy to see. We start there.</p>
    <p>From that foundation we design complete brand identities and professional websites—then stay close enough to keep everything consistent as you grow.</p>
  </div>
</section>
<section class="about-principles tint" aria-labelledby="principles-title">
  <div class="about-principles-heading">
    <div class="eyebrow">02 / WHAT WE BELIEVE</div>
    <h2 id="principles-title">Four things<br>we hold to.</h2>
    <p>A few principles guide every decision, from the first conversation to the final handover.</p>
  </div>
  <div class="about-principle-grid">${PRINCIPLES.map((item, index) => `<article class="about-principle-card"><span class="about-principle-number">0${index + 1}</span><h3>${item.title}</h3><p>${item.text}</p><span class="about-principle-mark" aria-hidden="true">&#8599;</span></article>`).join("")}</div>
</section>
<section class="process">
  <div><div class="eyebrow">03 / HOW WE WORK</div><h2>Close collaboration.<br>Clear direction.</h2></div>
  ${processSteps}
</section>
${founder}
<section class="intro">
  <div class="eyebrow">04 / HOW WE WORK WITH YOU</div>
  <div>
    <h2>Clear direction.<br>Considered work.</h2>
    <p>Every project begins with a clear brief, shared goals, and a written proposal. We work closely with you through each decision, then hand over the tools and files you need to move forward.</p>
    <div class="button-row"><a class="pill" href="/services/">Explore our services ↗</a><a class="pill ghost" href="/portfolio/">See the portfolio</a></div>
  </div>
</section>
${ctaBand()}`;

  return [{
    path: "/about/",
    current: "about",
    title: "About — Branding and design agency | Brandingdex",
    description: "Meet Brandingdex, an independent brand strategy and design studio helping businesses build clear positioning, distinctive identities, and thoughtful digital experiences.",
    body,
    schema: [breadcrumbs(site, [{ name: "About", path: "/about/" }]), organization(site)]
  }];
}
