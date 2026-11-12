import { esc } from "../lib/html.mjs";
import { contactForm, formScripts, postCard, priceBanner, processSteps } from "../lib/partials.mjs";
import { organization, website } from "../lib/schema.mjs";
import { heroProjectTile, projectCard } from "../lib/visuals.mjs";

export default function home(ctx) {
  const { site, services, projects, packages, posts } = ctx;
  const hasConcepts = projects.some(project => project.concept);
  const heroWork = projects.length ? `<aside class="hero-work" aria-label="Selected portfolio work">
  <div class="hero-marquee">
    ${[0, 1, 2].map(column => {
      const picks = Array.from({ length: 4 }, (_, index) => projects[(column * 2 + index) % projects.length]);
      const direction = column === 1 ? "is-up" : "is-down";
      return `<div class="hero-marquee-column ${direction}" aria-label="Portfolio column ${column + 1}">
        <div class="hero-marquee-track">
          <div class="hero-marquee-group">${picks.map(project => heroProjectTile(project)).join("")}</div>
          <div class="hero-marquee-group" aria-hidden="true">${picks.map(project => heroProjectTile(project, true)).join("")}</div>
        </div>
      </div>`;
    }).join("")}
  </div>
  <div class="hero-work-caption"><span>Selected brand and website work</span><a href="/portfolio/">Explore all projects <span aria-hidden="true">&#8599;</span></a></div>
</aside>` : "";

  const serviceRows = services.map((item, index) => `<a class="service" href="/services/${item.slug}/">
    <span class="num">0${index + 1}</span><h3>${esc(item.homeTitle)}</h3><p>${esc(item.summary)}</p><span class="arrow">↗</span>
  </a>`).join("\n  ");

  const insights = posts.length ? `<section class="insights-preview">
  <div class="section-top">
    <div><div class="eyebrow">05 / INSIGHTS</div><h2>Notes on building<br>a clearer brand.</h2></div>
    <a class="pill" href="/insights/">Read all insights ↗</a>
  </div>
  <div class="post-grid">${posts.slice(0, 3).map(postCard).join("")}</div>
</section>` : "";

  const testimonialRows = (ctx.testimonials || []).map((item, index) => `<article class="testimonial-slide" data-testimonial-slide="${index}" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${ctx.testimonials.length}" aria-hidden="${index !== 0}"${index ? " inert" : ""}>
    <img class="testimonial-avatar" src="${esc(item.portrait || "/assets/testimonial-portrait.jpg")}" alt="${esc(item.portraitAlt || "Illustrative profile portrait")}" loading="lazy">
    <div class="testimonial-body">
      <blockquote>“${esc(item.quote)}”</blockquote>
      <div class="testimonial-attribution"><div><strong>${esc(item.name || "Sample client")}</strong><span>${esc(item.role || "Illustrative placeholder")} · ${esc(item.service || "Client feedback")}</span></div><span class="testimonial-sample-label">SAMPLE</span></div>
      <p class="testimonial-disclosure">Illustrative sample quote and profile. Replace with approved client feedback.</p>
    </div>
  </article>`).join("");
  const testimonialSection = testimonialRows ? `<section class="testimonials" data-testimonial-carousel aria-labelledby="testimonials-title">
  <div class="testimonials-heading"><div><div class="eyebrow">CLIENT FEEDBACK / SAMPLE PREVIEW</div><h2 id="testimonials-title">Good partnerships.<br>Better work.</h2></div>
    <div class="testimonial-controls"><span data-testimonial-position aria-live="off">01 / ${String(ctx.testimonials.length).padStart(2, "0")}</span><button type="button" data-testimonial-prev aria-label="Previous testimonial">&#8592;</button><button type="button" data-testimonial-toggle aria-label="Pause testimonial rotation" aria-pressed="false">Pause</button><button type="button" data-testimonial-next aria-label="Next testimonial">&#8594;</button></div>
  </div>
  <div class="testimonial-stage"><div class="testimonial-track" data-testimonial-track>${testimonialRows}</div></div>
  <div class="testimonial-dots" role="group" aria-label="Choose a testimonial">${ctx.testimonials.map((item, index) => `<button type="button" data-testimonial-target="${index}" aria-label="Show testimonial ${index + 1}" aria-pressed="${index === 0}"></button>`).join("")}</div>
</section>` : "";

const body = `<header class="hero hero-with-work">
  <div class="hero-copy">
  <div class="eyebrow"><span class="dot"></span>Independent thinking. Lasting impressions.</div>
  <h1>Built to mean more.<br>Designed to <em>stand out.</em></h1>
  <div class="hero-bottom">
    <p>Brand strategy, identity and digital design for ambitious businesses in Europe, the UK and beyond. An independent studio based in Nigeria, built to work across borders.</p>
    <a class="pill" href="/portfolio/">Explore the portfolio <span>↘</span></a>
    <div class="small">INDEPENDENT BRANDING & DESIGN AGENCY<br>STRATEGY · IDENTITY · DIGITAL</div>
  </div>
  </div>
  ${heroWork}
</header>
<section class="studio-feature" id="studio" aria-labelledby="studio-heading">
  <a class="studio-image-card" href="/about/" aria-label="Meet the Brandingdex studio">
    <img src="/assets/studio-home-editorial.jpg" alt="A sunlit branding studio desk with colour studies, paper proofs, and a laptop" loading="lazy">
    <span class="studio-image-shade" aria-hidden="true"></span>
    <span class="eyebrow">01 / THE STUDIO</span>
    <span class="studio-image-title">Ideas, made<br><em>distinctive.</em></span>
    <span class="studio-image-link">Meet the studio <span aria-hidden="true">&#8599;</span></span>
  </a>
  <div class="studio-feature-copy">
    <div class="eyebrow">STRATEGY / IDENTITY / DIGITAL</div>
    <h2 id="studio-heading">Good design gets noticed.<br>A clear brand gets chosen.</h2>
    <p>Your business has something worth bringing into the world. We help you articulate it, give it a distinctive identity, and build the digital experience that carries it forward.</p>
    <p>Brandingdex partners with ambitious founders and established teams to connect strategy, design, and execution—from the first big question to the smallest meaningful detail.</p>
    <p><a class="text-link" href="/about/">More about the studio &#8599;</a></p>
  </div>
</section>

<section class="services" id="services">
  <div class="eyebrow" style="margin-bottom:30px">02 / WHAT WE DO</div>
  ${serviceRows}
</section>

<section class="work" id="work">
  <div class="section-top">
    <div><div class="eyebrow">03 / EXPLORE THE PORTFOLIO</div><h2>Brand identities.<br>Websites. Complete stories.</h2></div>
    <a class="pill" href="/portfolio/">View all ${projects.length} projects ↗</a>
  </div>
  ${hasConcepts ? '<p class="small">A preview of our creative direction. Illustrative concepts are clearly marked.</p>' : ""}
  <div class="grid" id="home-work-grid" aria-label="Selected work">${projects.slice(0, 4).map(projectCard).join("")}</div>
  <div style="margin-top:35px"><a class="pill" href="/portfolio/">Explore brand identity & website projects ↗</a></div>
</section>

${priceBanner(packages)}

${testimonialSection}

<section class="process">
  <div><div class="eyebrow">04 / HOW WE WORK</div><h2>Close collaboration.<br>Clear direction.</h2></div>
  ${processSteps}
</section>

<aside class="price-banner scorecard-banner">
  <div>
    <div class="eyebrow">FREE TOOL / 2 MINUTES</div>
    <h2>How clear is your brand today?</h2>
    <p>Twelve quick questions. An honest score. A clear place to focus first.</p>
  </div>
  <a class="pill" href="/brand-scorecard/" data-track="scorecard_open">Take the Brand Scorecard ↗</a>
</aside>

${insights}

<section class="contact" id="contact">
  <div>
    <div class="eyebrow">${posts.length ? "06" : "05"} / YOUR NEXT CHAPTER</div>
    <h2>Something good<br>starts with a<br><em>conversation.</em></h2>
    <p>Launching, evolving, or ready for a new direction?<br>Tell us what you have in mind. We reply ${esc(site.contact.responseTime)}.</p>
  </div>
  ${contactForm(ctx, { compact: true })}
</section>`;

  return [{
    path: "/",
    title: "Brandingdex — Brand identity & website design agency",
    description: "An independent brand strategy and design studio for ambitious businesses in Europe, the UK, and beyond. Based in Nigeria, Brandingdex creates distinctive identities and considered digital experiences.",
    body,
    current: "home",
    schema: [organization(site), website(site)],
    scripts: formScripts(site)
  }];
}
