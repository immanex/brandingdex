import { esc } from "../lib/html.mjs";
import { DEFAULT_OG } from "../lib/layout.mjs";
import { ctaBand } from "../lib/partials.mjs";
import { breadcrumbs, creativeWork } from "../lib/schema.mjs";
import { gallerySlide, projectCard } from "../lib/visuals.mjs";
import { logoMarks } from "../lib/logo-marks.mjs";

const FILTERS = [
  { id: "all", label: "All work" },
  { id: "identity", label: "Brand identity" },
  { id: "website", label: "Website design" },
  { id: "product", label: "Digital product" },
  { id: "combined", label: "Brand & website" },
  { id: "stationery", label: "Stationery" }
];

function caseGalleryMarkup(project, gallery, galleryTitle) {
  const slides = gallery.map((screen, index) => `<div class="case-carousel-slide" data-carousel-slide="${index}" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${gallery.length}"${index ? " hidden" : ""}>
    ${gallerySlide(project, screen, index, gallery.length)}
    <button class="case-carousel-open" type="button" data-gallery-open aria-label="Open ${esc(screen.headline || project.name)} in the full gallery"></button>
  </div>`).join("");
  const overview = gallery.map((screen, index) => {
    const label = screen.label || `Screen ${String(index + 1).padStart(2, "0")}`;
    const headline = screen.headline || project.name;
    return `<article class="gallery-overview-card">
      <div class="gallery-overview-preview">${gallerySlide(project, screen, index, gallery.length)}<button class="gallery-overview-open" type="button" data-gallery-select="${index}" aria-label="View ${esc(headline)}"></button></div>
      <div class="gallery-overview-caption"><div><span>${esc(label)}</span><h3>${esc(headline)}</h3></div><button class="gallery-overview-select" type="button" data-gallery-select="${index}">View screen <span aria-hidden="true">&#8599;</span></button></div>
    </article>`;
  }).join("");
  const viewerSlides = gallery.map((screen, index) => `<div class="gallery-dialog-slide" data-dialog-slide="${index}" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${gallery.length}"${index ? " hidden" : ""}>${gallerySlide(project, screen, index, gallery.length)}</div>`).join("");

  return `<section class="case-gallery-section" aria-labelledby="gallery-title">
  <div class="gallery-title-row">
    <div><div class="eyebrow">${project.cat === "product" ? "PRODUCT INTERFACE" : "AUTO-PLAYING PROJECT VIEWS"}</div><h2 id="gallery-title">${galleryTitle}</h2><p>Preview each screen as it changes. Select the image to browse the full gallery.</p></div>
  </div>
  <div class="case-carousel" data-case-carousel role="region" aria-roledescription="carousel" aria-label="${esc(project.name + " project screens")}">
    <div class="case-carousel-stage">${slides}</div>
    <div class="case-carousel-bar">
      <span class="case-carousel-position" data-carousel-position aria-live="off">01 / ${String(gallery.length).padStart(2, "0")}</span>
      <div class="case-carousel-controls">
        <button type="button" data-carousel-prev aria-label="Previous project screen">&#8592;</button>
        <button type="button" data-carousel-toggle aria-label="Pause automatic slides" aria-pressed="false">Pause</button>
        <button type="button" data-carousel-next aria-label="Next project screen">&#8594;</button>
        <button type="button" class="case-carousel-all" data-gallery-open-all>View all ${gallery.length} screens <span aria-hidden="true">&#8599;</span></button>
      </div>
    </div>
  </div>
  <p class="gallery-hint">${project.inHouse ? "In-house product" : project.concept ? "Illustrative concept" : "Project work"} · Screens advance automatically. Pause or use the arrows at any time.</p>
</section>
<dialog class="case-gallery-dialog" data-case-gallery-dialog aria-labelledby="case-gallery-dialog-title">
  <div class="case-gallery-dialog-shell">
    <header class="case-gallery-dialog-head"><div><div class="eyebrow">PROJECT GALLERY</div><h2 id="case-gallery-dialog-title">${esc(project.name)}</h2></div><button type="button" data-gallery-close aria-label="Close gallery">&#215;</button></header>
    <section class="gallery-overview" data-gallery-overview aria-label="All project screens">${overview}</section>
    <section class="gallery-dialog-viewer" data-gallery-viewer aria-label="Selected project screen" hidden>
      <div class="gallery-dialog-viewer-controls"><button type="button" data-dialog-prev aria-label="Previous gallery screen">&#8592;</button><span data-dialog-position aria-live="polite">01 / ${String(gallery.length).padStart(2, "0")}</span><button type="button" data-dialog-next aria-label="Next gallery screen">&#8594;</button></div>
      <div class="gallery-dialog-slides">${viewerSlides}</div>
      <button type="button" class="gallery-dialog-back" data-gallery-back>&#8592; All screens</button>
    </section>
  </div>
</dialog>`;
}

function index(ctx) {
  const { site, projects } = ctx;
  const count = id => id === "all" ? projects.length : projects.filter(project => project.cat === id).length;
  const filters = FILTERS.filter(filter => count(filter.id)).map(filter =>
    `<button type="button" data-filter="${filter.id}" aria-pressed="${filter.id === "all"}">${filter.label} <span>${String(count(filter.id)).padStart(2, "0")}</span></button>`).join("");
  const hasConcepts = projects.some(project => project.concept);

  const body = `<header class="portfolio-intro">
  <div class="eyebrow">THE PORTFOLIO / BRANDINGDEX</div>
  <h1>Our thinking.<br>Made <em>visible.</em></h1>
  <p>Explore brand identity, website and digital product work for ambitious businesses. Each case study shows the thinking behind the design.</p>
  ${hasConcepts ? '<p class="small">Illustrative concepts are clearly marked. They show our creative direction and do not represent client projects.</p>' : ""}
  <div class="filters" role="group" aria-label="Filter projects">${filters}</div>
  <p class="portfolio-count" role="status" id="count">Showing ${projects.length} project${projects.length === 1 ? "" : "s"}</p>
</header>
<div class="portfolio-grid" id="portfolio-grid" aria-label="Portfolio projects">${projects.map(projectCard).join("")}</div>
<section class="logo-showcase" aria-labelledby="logo-showcase-title">
  <div class="logo-showcase-head">
    <div><div class="eyebrow">SELECTED LOGO &amp; IDENTITY WORK</div><h2 id="logo-showcase-title">Distinct marks.<br>Different worlds.</h2></div>
    <p>A selection of marks and identity applications created for businesses across a range of sectors.</p>
  </div>
  <div class="logo-mark-grid">${logoMarks.map(mark => `<figure class="logo-mark-card"><div class="logo-mark-image"><img src="${esc(mark.image)}" alt="${esc(mark.name)} identity design" loading="lazy"></div><figcaption>${esc(mark.name)}</figcaption></figure>`).join("")}</div>
</section>
${ctaBand({ className: "portfolio-contact" })}`;

  return {
    path: "/portfolio/",
    current: "portfolio",
    title: "Portfolio | Brand identities, websites & digital products | Brandingdex",
    description: "Explore Brandingdex brand identity, website and digital product work, with case studies and selected logo and identity marks.",
    body,
    schema: [breadcrumbs(site, [{ name: "Portfolio", path: "/portfolio/" }])]
  };
}

function caseStudy(ctx, project, position) {
  const { site, projects, ogImages } = ctx;
  const gallery = Array.isArray(project.gallery) && project.gallery.length ? project.gallery : [{
    kind: project.cat === "website" ? "website" : "identity",
    label: "01 / Design exploration",
    headline: project.headline,
    body: project.deliver
  }];
  const next = projects[(position + 1) % projects.length];
  const status = project.inHouse ? "In-house SaaS product" : project.concept ? "Self-initiated concept<br>No client affiliation" : "Client project";
  const galleryTitle = project.cat === "website" ? "Website screens." : project.cat === "stationery" ? "Designs in use." : project.cat === "product" ? "Inside the product." : "Identity, in detail.";
  const path = "/work/" + project.slug + "/";
  const ogImage = ogImages.has(project.slug) ? "/assets/og/" + project.slug + ".png" : (project.cover || DEFAULT_OG);

  const body = `<div id="case-page">
<header class="case-head">
  <a class="back" href="/portfolio/">← All projects</a>
  <div class="eyebrow">${esc(project.type)} / ${project.inHouse ? "IN-HOUSE PRODUCT" : project.concept ? "CONCEPT CASE STUDY" : "CASE STUDY"}</div>
  <h1>${esc(project.name)}<br><em>${esc(project.headline)}</em></h1>
  <div class="case-meta">
    <div><small>Project overview</small><p>${esc(project.tag)}${project.concept ? " An illustrative exploration of " + esc(project.type.toLowerCase()) + "." : ""}</p></div>
    <div><small>Scope</small><p>${esc(project.scope)}</p></div>
    <div><small>Project status</small><p>${status}</p></div>
  </div>
  ${project.liveUrl ? `<p class="case-live-link"><a class="text-link" href="${esc(project.liveUrl)}" target="_blank" rel="noopener">Explore the live product <span aria-hidden="true">&#8599;</span></a></p>` : ""}
</header>
${caseGalleryMarkup(project,gallery,galleryTitle)}
<section class="case-story"><h2>The challenge.</h2><p>${esc(project.challenge)}</p></section>
<section class="case-story approach-story"><h2>The design approach.</h2><div>
  <p>${esc(project.approach)}</p>
  <p><strong>${project.concept ? "Concept deliverables" : "Deliverables"}</strong><br>${esc(project.deliver)}</p>
  ${project.concept ? '<p class="small">This case study illustrates a creative direction. It does not represent a launched client project or measured business results.</p>' : ""}
</div></section>
<section class="case-next"><a class="pill" href="/portfolio/">← Back to portfolio</a><a href="/work/${esc(next.slug)}/"><span class="eyebrow">NEXT PROJECT ↗</span><h2>${esc(next.name + " — " + next.type)}</h2></a></section>
<section class="case-cta"><div><div class="eyebrow">HAVE A PROJECT IN MIND?</div><h2>Let’s make your next chapter count.</h2></div><a class="pill" href="/contact/">Start a conversation ↗</a></section>
</div>`;

  return {
    path,
    current: "portfolio",
    title: `${project.name} — ${project.type}${project.concept ? " concept" : ""} | Brandingdex`,
    description: project.challenge,
    body,
    ogImage,
    schema: [
      breadcrumbs(site, [{ name: "Portfolio", path: "/portfolio/" }, { name: project.name, path }]),
      creativeWork(site, project, ogImage)
    ]
  };
}

export default function portfolio(ctx) {
  return [index(ctx), ...ctx.projects.map((project, position) => caseStudy(ctx, project, position))];
}
