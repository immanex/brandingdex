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
  { id: "stationery", label: "Stationery" },
  { id: "merchandise", label: "Merchandise" }
];

const CATEGORY_DETAILS = {
  identity: {
    heading: "Brand identities with a point of view",
    description: "Explore distinctive identity systems shaped around each business, from the first mark to practical brand applications."
  },
  website: {
    heading: "Website design, made clear",
    description: "Explore responsive website concepts that pair clear structure with thoughtful visual design and a useful path forward.",
    ogImage: "/assets/og/portfolio-website.png"
  },
  product: {
    heading: "Digital products, made useful",
    description: "Explore digital product design for clear workflows, useful tools and more confident customer experiences."
  },
  combined: {
    heading: "Brand and website, working together",
    description: "Explore connected brand and website work, designed to carry one clear story across every touchpoint."
  },
  stationery: {
    heading: "Stationery & business documents",
    description: "A collection of business cards, letterheads and invoices, each shaped by the visual language of its brand.",
    ogImage: "/assets/og/portfolio-stationery.png"
  },
  merchandise: {
    heading: "Branded merchandise",
    description: "Apparel and everyday products shaped by distinct brand identities, from coordinated teamwear to customer-facing pieces.",
    ogImage: "/assets/og/portfolio-merchandise.png"
  }
};

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

function collectionGalleryMarkup(project, { compact = false } = {}) {
  const gallery = project.gallery || [];
  if (!gallery.length) return "";
  const titleId = `${project.slug}-collection-title`;
  const dialogTitleId = `${project.slug}-viewer-headline`;
  const tiles = gallery.map((screen, index) => {
    const label = screen.label || `Design ${String(index + 1).padStart(2, "0")}`;
    const headline = screen.headline || project.name;
    const image = screen.image || project.cover;
    return `<figure class="portfolio-collection-tile">
      <a class="portfolio-collection-preview" href="${esc(image)}" data-collection-open="${index}" data-collection-label="${esc(label)}" data-collection-headline="${esc(headline)}" data-collection-body="${esc(screen.body || "")}" aria-label="Open ${esc(headline)}">
        <img src="${esc(image)}" alt="${esc(headline)}" loading="eager" decoding="async">
        <span>View design <span aria-hidden="true">&#8599;</span></span>
      </a>
      <figcaption><small>${esc(label)}</small><h3>${esc(headline)}</h3></figcaption>
    </figure>`;
  }).join("");
  const first = gallery[0];

  return `<section class="portfolio-collection" data-collection-gallery data-collection-project aria-labelledby="${titleId}" data-collection-size="${gallery.length}">
  ${compact ? `<h2 class="visually-hidden" id="${titleId}">${esc(project.name)} designs</h2>` : `<header class="portfolio-collection-heading"><div><div class="eyebrow">${esc(project.type)} / ${gallery.length} DESIGNS</div><h2 id="${titleId}">${esc(project.name)}</h2><p>${esc(project.tag)}</p></div></header>`}
  <div class="portfolio-collection-grid" data-category="${esc(project.cat)}">${tiles}</div>
  <dialog class="portfolio-collection-dialog" data-collection-dialog aria-labelledby="${dialogTitleId}">
    <div class="portfolio-collection-dialog-shell">
      <header class="portfolio-collection-dialog-head"><div><span data-collection-label>${esc(first.label || "")}</span><h2 id="${dialogTitleId}" data-collection-headline>${esc(first.headline || project.name)}</h2></div><button type="button" data-collection-close aria-label="Close design preview">&#215;</button></header>
      <div class="portfolio-collection-viewer"><img src="${esc(first.image || project.cover)}" alt="${esc(first.headline || project.name)}" data-collection-image><p data-collection-body>${esc(first.body || "")}</p></div>
      <footer class="portfolio-collection-controls"><button type="button" data-collection-prev aria-label="Previous design">&#8592;</button><span data-collection-position aria-live="polite">01 / ${String(gallery.length).padStart(2, "0")}</span><button type="button" data-collection-next aria-label="Next design">&#8594;</button></footer>
    </div>
  </dialog>
</section>`;
}

function index(ctx, category = "all") {
  const { site, projects } = ctx;
  const count = id => id === "all" ? projects.length : projects.filter(project => project.cat === id)
    .reduce((total, project) => total + (project.collection ? (project.gallery?.length || 0) : 1), 0);
  const selected = FILTERS.find(filter => filter.id === category) || FILTERS[0];
  const categoryDetails = CATEGORY_DETAILS[category];
  const categoryPath = id => id === "all" ? "/portfolio/" : `/portfolio/${id}/`;
  const defaultTitle = "Portfolio | Brand identities, websites & digital products | Brandingdex";
  const defaultDescription = "Explore Brandingdex brand identity, website and digital product work, with case studies and selected logo and identity marks.";
  const pageTitle = categoryDetails ? `${selected.label} Portfolio | Brandingdex` : defaultTitle;
  const pageDescription = categoryDetails?.description || defaultDescription;
  const categoryProjects = projects.filter(project => project.cat === category);
  const collectionProjects = category === "all" ? [] : categoryProjects.filter(project => project.collection);
  const cardProjects = category === "all" ? projects : categoryProjects.filter(project => !project.collection);
  const collectionSections = collectionProjects.map(project => collectionGalleryMarkup(project, { compact: true })).join("");
  const projectCards = cardProjects.length
    ? `<div class="portfolio-grid" id="portfolio-grid" aria-label="Portfolio projects">${cardProjects.map(project => projectCard(project)).join("")}</div>`
    : "";
  const imageFor = id => {
    const details = CATEGORY_DETAILS[id];
    const items = projects.filter(project => project.cat === id);
    return details?.ogImage || items.find(project => project.cover)?.cover || items.find(project => project.gallery?.some(screen => screen.image))?.gallery.find(screen => screen.image)?.image || DEFAULT_OG;
  };
  const ogImage = categoryDetails ? imageFor(category) : DEFAULT_OG;
  const filters = FILTERS.filter(filter => count(filter.id)).map(filter => {
    const details = CATEGORY_DETAILS[filter.id];
    const title = details ? `${filter.label} Portfolio | Brandingdex` : defaultTitle;
    const description = details?.description || defaultDescription;
    return `<a href="${categoryPath(filter.id)}" data-filter="${filter.id}" data-heading="${esc(details?.heading || "Our thinking. Made visible.")}" data-title="${esc(title)}" data-description="${esc(description)}" data-og-image="${esc(imageFor(filter.id))}"${filter.id === category ? ' aria-current="page"' : ""}>${filter.label} <span>${String(count(filter.id)).padStart(2, "0")}</span></a>`;
  }).join("");
  const hasConcepts = (category === "all" ? projects : categoryProjects).some(project => project.concept);
  const visibleCount = category === "all" ? projects.length : count(category);
  const visibleUnit = collectionProjects.length && !cardProjects.length ? "designs" : "projects";
  const logoShowcase = category === "all" ? `<section class="logo-showcase" aria-labelledby="logo-showcase-title">
  <div class="logo-showcase-head">
    <div><div class="eyebrow">SELECTED LOGO &amp; IDENTITY WORK</div><h2 id="logo-showcase-title">Distinct marks.<br>Different worlds.</h2></div>
    <p>A selection of marks and identity applications created for businesses across a range of sectors.</p>
  </div>
  <div class="logo-mark-grid">${logoMarks.map(mark => `<figure class="logo-mark-card"><div class="logo-mark-image"><img src="${esc(mark.image)}" alt="${esc(mark.name)} identity design" loading="lazy"></div><figcaption>${esc(mark.name)}</figcaption></figure>`).join("")}</div>
</section>` : "";

  const body = `<header class="portfolio-intro" data-category-page="${esc(category)}">
  <div class="eyebrow">${categoryDetails ? `SELECTED WORK / ${esc(selected.label.toUpperCase())}` : "THE PORTFOLIO / BRANDINGDEX"}</div>
  <h1 id="portfolio-heading">${categoryDetails ? esc(categoryDetails.heading) : "Our thinking.<br>Made <em>visible.</em>"}</h1>
  <p id="portfolio-description">${categoryDetails ? esc(categoryDetails.description) : "Explore brand identity, website and digital product work for ambitious businesses. Each case study shows the thinking behind the design."}</p>
  ${hasConcepts ? '<p class="small">Illustrative concepts are clearly marked. They show our creative direction and do not represent client projects.</p>' : ""}
  <div class="filters" role="group" aria-label="Filter projects">${filters}</div>
  <div class="portfolio-filter-footer"><p class="portfolio-count" role="status" id="count">Showing ${visibleCount} ${visibleUnit}</p><button type="button" class="portfolio-share-button" data-copy-portfolio-link>Copy this view's link <span aria-hidden="true">&#8599;</span></button><span class="portfolio-copy-status" data-portfolio-copy-status role="status" aria-live="polite"></span></div>
</header>
${collectionSections}
${projectCards}
${logoShowcase}
${ctaBand({ className: "portfolio-contact" })}`;

  return {
    path: categoryPath(category),
    current: "portfolio",
    title: pageTitle,
    description: pageDescription,
    ogImage,
    body,
    schema: [breadcrumbs(site, categoryDetails
      ? [{ name: "Portfolio", path: "/portfolio/" }, { name: selected.label, path: categoryPath(category) }]
      : [{ name: "Portfolio", path: "/portfolio/" }])]
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
  const status = project.collection ? "Selected portfolio collection" : project.inHouse ? "In-house SaaS product" : project.concept ? "Self-initiated concept<br>No client affiliation" : "Client project";
  const galleryTitle = project.cat === "website" ? "Website screens." : project.cat === "stationery" ? "Stationery designs." : project.cat === "merchandise" ? "Branded merchandise." : project.cat === "product" ? "Inside the product." : "Identity, in detail.";
  const path = "/work/" + project.slug + "/";
  const ogImage = ogImages.has(project.slug) ? "/assets/og/" + project.slug + ".png" : (project.cover || DEFAULT_OG);

  const body = `<div id="case-page">
<header class="case-head">
  <div class="case-head-actions">
  <a class="back" href="/portfolio/">← All projects</a>
  <button type="button" class="portfolio-share-button" data-copy-project-link>Copy project link <span aria-hidden="true">&#8599;</span></button>
  </div>
  <div class="eyebrow">${esc(project.type)} / ${project.collection ? "SELECTED COLLECTION" : project.inHouse ? "IN-HOUSE PRODUCT" : project.concept ? "CONCEPT CASE STUDY" : "CASE STUDY"}</div>
  <h1>${esc(project.name)}<br><em>${esc(project.headline)}</em></h1>
  <div class="case-meta">
    <div><small>Project overview</small><p>${esc(project.tag)}${project.concept ? " An illustrative exploration of " + esc(project.type.toLowerCase()) + "." : ""}</p></div>
    <div><small>Scope</small><p>${esc(project.scope)}</p></div>
    <div><small>Project status</small><p>${status}</p></div>
  </div>
  ${project.liveUrl ? `<p class="case-live-link"><a class="text-link" href="${esc(project.liveUrl)}" target="_blank" rel="noopener">Explore the live product <span aria-hidden="true">&#8599;</span></a></p>` : ""}
</header>
${project.collection ? collectionGalleryMarkup(project) : caseGalleryMarkup(project,gallery,galleryTitle)}
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
  const categoryPages = FILTERS
    .filter(filter => filter.id !== "all" && CATEGORY_DETAILS[filter.id] && ctx.projects.some(project => project.cat === filter.id))
    .map(filter => index(ctx, filter.id));
  return [index(ctx), ...categoryPages, ...ctx.projects.map((project, position) => caseStudy(ctx, project, position))];
}
