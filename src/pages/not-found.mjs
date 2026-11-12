// The page shown for any address that does not exist. It is written to dist/404.html.

export default function notFound() {
  const body = `<header class="portfolio-intro simple-page">
  <div class="eyebrow">404 / PAGE NOT FOUND</div>
  <h1>This page has<br><em>moved on.</em></h1>
  <p class="pricing-lead">The link may be out of date, or the address may have a typo. Here are a few good places to pick up from.</p>
  <div class="button-row"><a class="pill" href="/">Back to home ↗</a><a class="pill ghost" href="/portfolio/">See the portfolio</a><a class="pill ghost" href="/contact/">Contact us</a></div>
</header>`;

  return {
    path: "/404.html",
    title: "Page not found | Brandingdex",
    description: "The page you were looking for could not be found.",
    body,
    noindex: true
  };
}
