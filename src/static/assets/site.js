// Small site-wide interactions that keep the static pages usable without a framework.

const receiptStatus = document.querySelector("[data-receipt-status] span:last-child");
const receiptResult = new URLSearchParams(window.location.search).get("receipt");
if (receiptStatus && receiptResult === "sent") {
  receiptStatus.textContent = "A copy of your brief has been sent to the email address you provided.";
} else if (receiptStatus && receiptResult === "not-sent") {
  receiptStatus.textContent = "Your brief reached our team, but we could not send the email copy this time. We’ll still reply by email.";
}

const requestedPackage = new URLSearchParams(window.location.search).get("package");
if (requestedPackage) {
  const packageSelect = document.querySelector('form[data-form="contact"] select[name="package"]');
  const selectedOption = [...(packageSelect?.options || [])].find(option => option.value === requestedPackage);
  if (packageSelect && selectedOption) {
    packageSelect.value = selectedOption.value;
    const serviceSelect = packageSelect.form?.querySelector('select[name="service"]');
    if (serviceSelect && selectedOption.dataset.service) serviceSelect.value = selectedOption.dataset.service;
  }
}

for (const form of document.querySelectorAll("form[data-ajax]")) {
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    const button = form.querySelector('button[type="submit"]');
    const originalText = button?.textContent;
    if (status) {
      status.hidden = false;
      status.classList.remove("is-error");
      status.textContent = "Sending…";
    }
    if (button) button.disabled = true;

    try {
      const body = new URLSearchParams();
      for (const [key, value] of new FormData(form)) {
        if (typeof value === "string") body.append(key, value);
      }
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || "We could not send that just now. Please try again.");
      if (result.redirect) {
        window.location.assign(result.redirect);
        return;
      }
      if (status) status.textContent = result.message || "Thank you. Your message has been received.";
      form.reset();
    } catch (error) {
      if (status) {
        status.classList.add("is-error");
        status.textContent = error.message || "We could not send that just now. Please try again.";
      }
    } finally {
      if (button) {
        button.disabled = false;
        if (originalText) button.textContent = originalText;
      }
    }
  });

  form.addEventListener("input", () => {
    const status = form.querySelector(".form-status");
    if (status?.classList.contains("is-error")) status.hidden = true;
  });
}

if (new URLSearchParams(window.location.search).has("form-error")) {
  const status = document.querySelector("form[data-ajax] .form-status");
  if (status) {
    status.hidden = false;
    status.classList.add("is-error");
    status.textContent = "We could not send that just now. Please try again, or email hello@brandingdex.com.";
  }
}

const priceTabs = [...document.querySelectorAll("[data-price-filter]")];
const priceGrid = document.querySelector(".price-grid[data-tabs]");
const priceCards = [...document.querySelectorAll("[data-package-category]")];

if (priceTabs.length && priceGrid && priceCards.length) {
  const activatePriceTab = category => {
    priceGrid.dataset.tabs = category;
    priceTabs.forEach(tab => {
      tab.setAttribute("aria-pressed", String(tab.dataset.priceFilter === category));
    });
    priceCards.forEach(card => {
      card.hidden = card.dataset.packageCategory !== category;
    });
  };
  priceTabs.forEach(tab => tab.addEventListener("click", () => activatePriceTab(tab.dataset.priceFilter)));
  activatePriceTab(priceTabs.find(tab => tab.getAttribute("aria-pressed") === "true")?.dataset.priceFilter || priceTabs[0].dataset.priceFilter);
}

const portfolioTabs = [...document.querySelectorAll("[data-filter]")];
const portfolioCards = [...document.querySelectorAll("#portfolio-grid [data-category]")];

if (portfolioTabs.length && portfolioCards.length) {
  const heading = document.querySelector("#portfolio-heading");
  const description = document.querySelector("#portfolio-description");
  const defaultHeading = "Our thinking.<br>Made <em>visible.</em>";
  const updatePortfolioMetadata = tab => {
    if (!tab) return;
    const title = tab.dataset.title;
    const summary = tab.dataset.description;
    const image = tab.dataset.ogImage;
    if (title) {
      document.title = title;
      const openGraphTitle = document.querySelector('meta[property="og:title"]');
      if (openGraphTitle) openGraphTitle.content = title;
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) twitterTitle.content = title;
    }
    if (summary) {
      const metaDescription = document.querySelector('meta[name="description"]');
      const openGraphDescription = document.querySelector('meta[property="og:description"]');
      if (metaDescription) metaDescription.content = summary;
      if (openGraphDescription) openGraphDescription.content = summary;
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) twitterDescription.content = summary;
      if (description) description.textContent = summary;
    }
    if (image) {
      const openGraphImage = document.querySelector('meta[property="og:image"]');
      if (openGraphImage) openGraphImage.content = new URL(image, location.origin).href;
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (twitterImage) twitterImage.content = new URL(image, location.origin).href;
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    const openGraphUrl = document.querySelector('meta[property="og:url"]');
    if (canonical) canonical.href = new URL(tab.href, location.origin).href;
    if (openGraphUrl) openGraphUrl.content = new URL(tab.href, location.origin).href;
  };
  const activatePortfolioTab = (category, { updateUrl = false, replaceUrl = false } = {}) => {
    const activeTab = portfolioTabs.find(tab => tab.dataset.filter === category) || portfolioTabs[0];
    category = activeTab.dataset.filter;
    portfolioTabs.forEach(tab => {
      if (tab.dataset.filter === category) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });
    portfolioCards.forEach(card => {
      card.hidden = category !== "all" && card.dataset.category !== category;
    });
    const count = portfolioCards.filter(card => !card.hidden).length;
    const status = document.querySelector("#count");
    if (status) status.textContent = `Showing ${count} project${count === 1 ? "" : "s"}`;
    if (heading) heading.innerHTML = category === "all" ? defaultHeading : activeTab.dataset.heading;
    updatePortfolioMetadata(activeTab);
    if (updateUrl || replaceUrl) {
      history[replaceUrl ? "replaceState" : "pushState"]({ portfolioCategory: category }, "", activeTab.href);
    }
  };
  const categoryFromLocation = () => {
    const requested = new URLSearchParams(location.search).get("category");
    if (location.pathname === "/portfolio/" && portfolioTabs.some(tab => tab.dataset.filter === requested)) return requested;
    const routeTab = portfolioTabs.find(tab => new URL(tab.href).pathname === location.pathname);
    if (routeTab) return routeTab.dataset.filter;
    return portfolioTabs.some(tab => tab.dataset.filter === requested) ? requested : "all";
  };
  const requested = new URLSearchParams(location.search).get("category");
  const initial = categoryFromLocation();
  portfolioTabs.forEach(tab => tab.addEventListener("click", event => {
    event.preventDefault();
    activatePortfolioTab(tab.dataset.filter, { updateUrl: true });
  }));
  activatePortfolioTab(initial, { replaceUrl: Boolean(requested) });
  window.addEventListener("popstate", () => activatePortfolioTab(categoryFromLocation()));

  const copyCategoryButton = document.querySelector("[data-copy-portfolio-link]");
  copyCategoryButton?.addEventListener("click", async () => {
    const activeTab = portfolioTabs.find(tab => tab.getAttribute("aria-current") === "page") || portfolioTabs[0];
    const status = document.querySelector("[data-portfolio-copy-status]");
    const copied = await copyLink(activeTab.href);
    if (status) status.textContent = copied ? "Link copied" : "Copy unavailable — share the address in your browser bar.";
    copyCategoryButton.classList.toggle("is-copied", copied);
    window.setTimeout(() => {
      if (status) status.textContent = "";
      copyCategoryButton.classList.remove("is-copied");
    }, 2400);
  });
}

async function copyLink(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {}
  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  let copied = false;
  try { copied = document.execCommand("copy"); } catch {}
  field.remove();
  return copied;
}

document.querySelectorAll("[data-copy-project-link]").forEach(button => {
  button.addEventListener("click", async () => {
    const copied = await copyLink(location.href);
    button.textContent = copied ? "Project link copied" : "Copy unavailable — use the browser address bar.";
    window.setTimeout(() => {
      button.innerHTML = 'Copy project link <span aria-hidden="true">&#8599;</span>';
    }, 2400);
  });
});

const siteNav = document.querySelector(".site-nav");
const navToggle = siteNav?.querySelector(".nav-toggle");
if (siteNav && navToggle) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(expanded));
    siteNav.classList.toggle("is-open", expanded);
  });
  const closeSiteMenu = () => {
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  };
  siteNav.querySelectorAll(".links a").forEach(link => link.addEventListener("click", closeSiteMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
      closeSiteMenu();
      navToggle.focus();
    }
  });
  document.addEventListener("click", event => {
    if (siteNav.classList.contains("is-open") && !siteNav.contains(event.target)) closeSiteMenu();
  });
  const desktopMenuQuery = window.matchMedia("(min-width: 961px)");
  if (desktopMenuQuery.addEventListener) desktopMenuQuery.addEventListener("change", closeSiteMenu);
  else desktopMenuQuery.addListener(closeSiteMenu);
}

document.querySelectorAll("[data-case-carousel]").forEach(carousel => {
  const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const toggle = carousel.querySelector("[data-carousel-toggle]");
  const position = carousel.querySelector("[data-carousel-position]");
  const dialog = document.querySelector("[data-case-gallery-dialog]");
  if (!slides.length || !dialog) return;

  const overview = dialog.querySelector("[data-gallery-overview]");
  const viewer = dialog.querySelector("[data-gallery-viewer]");
  const dialogSlides = [...dialog.querySelectorAll("[data-dialog-slide]")];
  const dialogPosition = dialog.querySelector("[data-dialog-position]");
  const closeButton = dialog.querySelector("[data-gallery-close]");
  let current = 0;
  let dialogCurrent = 0;
  let timer = 0;
  let manualPause = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hoverPause = false;
  let focusPause = false;
  let inViewport = true;
  let touchStartX = null;

  const formatPosition = index => `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  const canAutoPlay = () => slides.length > 1 && !manualPause && !hoverPause && !focusPause && inViewport && !document.hidden && !dialog.open;
  const updateSlide = (index, announce = true) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.hidden = !active;
      slide.setAttribute("aria-hidden", String(!active));
    });
    if (position) {
      position.textContent = formatPosition(current);
      position.setAttribute("aria-live", announce ? "polite" : "off");
    }
    if (previous) previous.disabled = slides.length < 2;
    if (next) next.disabled = slides.length < 2;
  };
  const updateToggle = () => {
    if (!toggle) return;
    toggle.textContent = manualPause ? "Play" : "Pause";
    toggle.setAttribute("aria-pressed", String(manualPause));
    toggle.setAttribute("aria-label", manualPause ? "Resume automatic slides" : "Pause automatic slides");
    toggle.disabled = slides.length < 2;
  };
  const schedule = () => {
    window.clearTimeout(timer);
    if (!canAutoPlay()) return;
    timer = window.setTimeout(() => {
      updateSlide(current + 1, false);
      schedule();
    }, 5200);
  };
  const openOverview = () => {
    overview.hidden = false;
    viewer.hidden = true;
    overview.querySelectorAll("[data-gallery-select]").forEach(button => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.gallerySelect) === current));
    });
    if (!dialog.open) dialog.showModal();
    closeButton?.focus({ preventScroll: true });
    schedule();
  };
  const updateDialogSlide = index => {
    dialogCurrent = (index + dialogSlides.length) % dialogSlides.length;
    dialogSlides.forEach((slide, slideIndex) => {
      const active = slideIndex === dialogCurrent;
      slide.hidden = !active;
      slide.setAttribute("aria-hidden", String(!active));
    });
    if (dialogPosition) dialogPosition.textContent = formatPosition(dialogCurrent);
  };
  const showDialogSlide = index => {
    updateDialogSlide(index);
    overview.hidden = true;
    viewer.hidden = false;
    viewer.querySelector("[data-dialog-prev]")?.focus({ preventScroll: true });
  };

  updateSlide(0, false);
  updateToggle();
  schedule();
  previous?.addEventListener("click", () => { updateSlide(current - 1); schedule(); });
  next?.addEventListener("click", () => { updateSlide(current + 1); schedule(); });
  toggle?.addEventListener("click", () => { manualPause = !manualPause; updateToggle(); schedule(); });
  carousel.querySelectorAll("[data-gallery-open]").forEach(button => button.addEventListener("click", openOverview));
  carousel.querySelector("[data-gallery-open-all]")?.addEventListener("click", openOverview);
  carousel.addEventListener("mouseenter", () => { hoverPause = true; schedule(); });
  carousel.addEventListener("mouseleave", () => { hoverPause = false; schedule(); });
  carousel.addEventListener("focusin", () => { focusPause = true; schedule(); });
  carousel.addEventListener("focusout", event => {
    if (!carousel.contains(event.relatedTarget)) { focusPause = false; schedule(); }
  });
  carousel.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); updateSlide(current - 1); schedule(); }
    if (event.key === "ArrowRight") { event.preventDefault(); updateSlide(current + 1); schedule(); }
  });

  overview.addEventListener("click", event => {
    const button = event.target.closest("[data-gallery-select]");
    if (button) showDialogSlide(Number(button.dataset.gallerySelect));
  });
  dialog.querySelector("[data-dialog-prev]")?.addEventListener("click", () => updateDialogSlide(dialogCurrent - 1));
  dialog.querySelector("[data-dialog-next]")?.addEventListener("click", () => updateDialogSlide(dialogCurrent + 1));
  dialog.querySelector("[data-gallery-back]")?.addEventListener("click", () => {
    viewer.hidden = true;
    overview.hidden = false;
    overview.querySelector(`[data-gallery-select="${dialogCurrent}"]`)?.focus({ preventScroll: true });
  });
  closeButton?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", schedule);
  dialog.querySelector(".gallery-dialog-slides")?.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0]?.screenX ?? null;
  }, { passive: true });
  dialog.querySelector(".gallery-dialog-slides")?.addEventListener("touchend", event => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) > 45) updateDialogSlide(dialogCurrent + (distance < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
  dialog.addEventListener("keydown", event => {
    if (viewer.hidden) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); updateDialogSlide(dialogCurrent - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); updateDialogSlide(dialogCurrent + 1); }
  });
  document.addEventListener("visibilitychange", schedule);
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMotionChange = event => {
    manualPause = event.matches;
    updateToggle();
    schedule();
  };
  if (motionQuery.addEventListener) motionQuery.addEventListener("change", onMotionChange);
  else motionQuery.addListener(onMotionChange);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      inViewport = entries[0]?.isIntersecting ?? true;
      schedule();
    });
    observer.observe(carousel);
  }
});

function initializeTestimonialCarousel(testimonialCarousel) {
  if (!testimonialCarousel) return;
  const track = testimonialCarousel.querySelector("[data-testimonial-track]");
  const testimonialSlides = [...testimonialCarousel.querySelectorAll("[data-testimonial-slide]")];
  const testimonialDots = [...testimonialCarousel.querySelectorAll("[data-testimonial-target]")];
  const testimonialPrevious = testimonialCarousel.querySelector("[data-testimonial-prev]");
  const testimonialNext = testimonialCarousel.querySelector("[data-testimonial-next]");
  const testimonialToggle = testimonialCarousel.querySelector("[data-testimonial-toggle]");
  const testimonialPosition = testimonialCarousel.querySelector("[data-testimonial-position]");
  const stage = testimonialCarousel.querySelector(".testimonial-stage");
  if (!track || !stage || !testimonialSlides.length) return;

  let currentTestimonial = 0;
  let testimonialTimer = 0;
  let testimonialPaused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let testimonialHover = false;
  let testimonialFocus = false;
  let testimonialVisible = true;
  let resetPhysicalPosition = null;

  const formatTestimonialPosition = index => `${String(index + 1).padStart(2, "0")} / ${String(testimonialSlides.length).padStart(2, "0")}`;
  const canRotateTestimonials = () => testimonialSlides.length > 1 && !testimonialPaused && !testimonialHover && !testimonialFocus && testimonialVisible && !document.hidden;
  const setPhysicalPosition = (position, animate = true) => {
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translate3d(0, -${position * stage.clientHeight}px, 0)`;
    if (!animate) {
      track.getBoundingClientRect();
      track.style.transition = "";
    }
  };
  const updateTestimonialState = (announce = true) => {
    testimonialSlides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentTestimonial;
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
    });
    testimonialDots.forEach((dot, dotIndex) => dot.setAttribute("aria-pressed", String(dotIndex === currentTestimonial)));
    if (testimonialPosition) {
      testimonialPosition.textContent = formatTestimonialPosition(currentTestimonial);
      testimonialPosition.setAttribute("aria-live", announce ? "polite" : "off");
    }
  };
  const updateTestimonialToggle = () => {
    if (!testimonialToggle) return;
    testimonialToggle.textContent = testimonialPaused ? "Play" : "Pause";
    testimonialToggle.setAttribute("aria-pressed", String(testimonialPaused));
    testimonialToggle.setAttribute("aria-label", testimonialPaused ? "Resume testimonial rotation" : "Pause testimonial rotation");
    testimonialToggle.disabled = testimonialSlides.length < 2;
  };
  const scheduleTestimonials = () => {
    window.clearTimeout(testimonialTimer);
    if (!canRotateTestimonials()) return;
    testimonialTimer = window.setTimeout(() => {
      moveTestimonial(1, false);
      scheduleTestimonials();
    }, 6800);
  };
  const moveTestimonial = (direction, announce = true, requestedIndex = null) => {
    const previous = currentTestimonial;
    const target = requestedIndex === null
      ? (currentTestimonial + direction + testimonialSlides.length) % testimonialSlides.length
      : ((requestedIndex % testimonialSlides.length) + testimonialSlides.length) % testimonialSlides.length;
    if (target === previous) return;
    currentTestimonial = target;
    updateTestimonialState(announce);

    let physicalPosition = currentTestimonial + 1;
    resetPhysicalPosition = null;
    if (direction > 0 && previous === testimonialSlides.length - 1 && currentTestimonial === 0) {
      physicalPosition = testimonialSlides.length + 1;
      resetPhysicalPosition = 1;
    } else if (direction < 0 && previous === 0 && currentTestimonial === testimonialSlides.length - 1) {
      physicalPosition = 0;
      resetPhysicalPosition = testimonialSlides.length;
    }
    setPhysicalPosition(physicalPosition);
  };

  if (testimonialSlides.length > 1) {
    const lastClone = testimonialSlides[testimonialSlides.length - 1].cloneNode(true);
    const firstClone = testimonialSlides[0].cloneNode(true);
    [lastClone, firstClone].forEach(clone => {
      clone.removeAttribute("data-testimonial-slide");
      clone.setAttribute("aria-hidden", "true");
      clone.inert = true;
    });
    track.prepend(lastClone);
    track.append(firstClone);
  }
  updateTestimonialState(false);
  setPhysicalPosition(testimonialSlides.length > 1 ? 1 : 0, false);
  updateTestimonialToggle();
  scheduleTestimonials();
  track.addEventListener("transitionend", event => {
    if (event.target !== track || event.propertyName !== "transform" || resetPhysicalPosition === null) return;
    const reset = resetPhysicalPosition;
    resetPhysicalPosition = null;
    setPhysicalPosition(reset, false);
  });
  testimonialPrevious?.addEventListener("click", () => { moveTestimonial(-1); scheduleTestimonials(); });
  testimonialNext?.addEventListener("click", () => { moveTestimonial(1); scheduleTestimonials(); });
  testimonialToggle?.addEventListener("click", () => { testimonialPaused = !testimonialPaused; updateTestimonialToggle(); scheduleTestimonials(); });
  testimonialDots.forEach(dot => dot.addEventListener("click", () => {
    const target = Number(dot.dataset.testimonialTarget);
    const direction = target >= currentTestimonial ? 1 : -1;
    moveTestimonial(direction, true, target);
    scheduleTestimonials();
  }));
  testimonialCarousel.addEventListener("mouseenter", () => { testimonialHover = true; scheduleTestimonials(); });
  testimonialCarousel.addEventListener("mouseleave", () => { testimonialHover = false; scheduleTestimonials(); });
  testimonialCarousel.addEventListener("focusin", () => { testimonialFocus = true; scheduleTestimonials(); });
  testimonialCarousel.addEventListener("focusout", event => {
    if (!testimonialCarousel.contains(event.relatedTarget)) { testimonialFocus = false; scheduleTestimonials(); }
  });
  const testimonialMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onTestimonialMotionChange = event => {
    testimonialPaused = event.matches;
    updateTestimonialToggle();
    scheduleTestimonials();
  };
  if (testimonialMotionQuery.addEventListener) testimonialMotionQuery.addEventListener("change", onTestimonialMotionChange);
  else testimonialMotionQuery.addListener(onTestimonialMotionChange);
  document.addEventListener("visibilitychange", scheduleTestimonials);
  const repositionTestimonials = () => setPhysicalPosition(testimonialSlides.length > 1 ? currentTestimonial + 1 : 0, false);
  if ("ResizeObserver" in window) new ResizeObserver(repositionTestimonials).observe(stage);
  else window.addEventListener("resize", repositionTestimonials);
  if ("IntersectionObserver" in window) {
    const testimonialObserver = new IntersectionObserver(entries => {
      testimonialVisible = entries[0]?.isIntersecting ?? true;
      scheduleTestimonials();
    });
    testimonialObserver.observe(testimonialCarousel);
  }
}

initializeTestimonialCarousel(document.querySelector("[data-testimonial-carousel]"));
