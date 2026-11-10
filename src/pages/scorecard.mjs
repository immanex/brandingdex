import { dataBlock, esc } from "../lib/html.mjs";
import { subscribeForm } from "../lib/layout.mjs";
import { breadcrumbs } from "../lib/schema.mjs";

export default function scorecard(ctx) {
  const { site, scorecard: card, assets } = ctx;
  const total = card.areas.reduce((sum, area) => sum + area.questions.length, 0);

  const areas = card.areas.map((area, position) => `<fieldset class="score-area">
    <legend class="eyebrow">0${position + 1} / ${esc(area.name)}</legend>
    ${area.questions.map((question, number) => {
      const name = area.id + "-" + number;
      const questionNumber = card.areas.slice(0, position).reduce((count, item) => count + item.questions.length, 0) + number + 1;
      return `<div class="score-q" data-score-question role="radiogroup" aria-labelledby="q-${name}">
      <p id="q-${name}"><span class="score-question-number">${String(questionNumber).padStart(2, "0")}</span>${esc(question)}</p>
      <div class="choices">${card.answers.map(answer =>
        `<label class="choice"><input type="radio" name="${name}" value="${answer.value}" data-area="${esc(area.id)}"><span>${esc(answer.label)}</span></label>`).join("")}</div>
    </div>`;
    }).join("\n    ")}
  </fieldset>`).join("\n  ");

  const news = site.newsletter.enabled ? `<div class="score-news">
      <div class="eyebrow">${esc(site.newsletter.name)}</div>
      <p>${esc(site.newsletter.pitch)}</p>
      ${subscribeForm(ctx, "scorecard")}
    </div>` : "";

  const body = `<header class="scorecard-intro">
  <div class="eyebrow">FREE TOOL / 2 MINUTES</div>
  <h1>The Brand<br><em>Scorecard.</em></h1>
  <p class="pricing-lead">Twelve quick questions to see how clearly your brand shows up—and where to focus first. No email required.</p>
  <noscript><p class="small">The scorecard needs JavaScript to calculate your result. You can also <a class="text-link" href="/contact/">tell us about your brand</a> and we’ll take a look.</p></noscript>
</header>
<form class="score-form" id="scorecard" novalidate>
  <p class="score-form-note">Choose one answer for each question.</p>
  <div class="score-progress">
    <p id="score-progress" role="status">0 of ${total} answered</p>
    <div class="score-progress-track" role="progressbar" aria-label="Questions answered" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="0"><span></span></div>
  </div>
  ${areas}
  <div class="score-actions">
    <p class="score-privacy-note">Your answers are only used to calculate your score.</p>
    <button class="pill" type="submit">See my score <span>↗</span></button>
  </div>
  <p class="form-status error" id="score-missing" role="alert" hidden></p>
</form>
<section class="score-result" id="score-result" tabindex="-1" aria-labelledby="score-title" aria-live="polite" hidden>
  <div class="score-result-summary">
    <div class="eyebrow">YOUR BRAND SCORE</div>
    <div class="score-number"><span id="score-value">0</span><small> / 100</small></div>
    <h2 id="score-title"></h2>
    <p id="score-text"></p>
    <div class="score-result-actions">
      <a class="pill" id="score-cta" href="/contact/" data-track="scorecard_contact">Talk through my results <span>↗</span></a>
      <button class="pill ghost" type="button" id="score-reset">Start again</button>
    </div>
  </div>
  <div class="score-result-details">
    <div class="score-bars" id="score-bars" aria-label="Scores by area"></div>
    <div class="score-focus">
      <div class="eyebrow">WHERE TO FOCUS FIRST</div>
      <h3 id="score-focus-title"></h3>
      <p id="score-focus-text"></p>
      <a class="text-link" id="score-focus-link" href="/services/"></a>
    </div>
    ${news}
  </div>
</section>
<section class="intro scorecard-how">
  <div class="eyebrow">HOW IT WORKS</div>
  <div>
    <h2>An honest starting point.</h2>
    <p>The scorecard looks at four areas: how clearly you can describe the business, how complete your visual identity is, how well your website works, and how consistent everything looks together.</p>
    <p>It is a quick self-assessment, not an audit. Your answers stay in your browser—they are only shared with us if you choose to send us your result.</p>
  </div>
</section>
<script type="application/json" id="scorecard-data">${dataBlock({ areas: card.areas.map(area => ({ id: area.id, name: area.name, questions: area.questions.length, advice: area.advice, linkLabel: area.linkLabel, link: area.link })), bands: card.bands, max: Math.max(...card.answers.map(answer => answer.value)) })}</script>`;

  return [{
    path: "/brand-scorecard/",
    title: "Brand Scorecard — How clear is your brand? | Brandingdex",
    description: "A free 2-minute self-assessment. Twelve questions on clarity, identity, website, and consistency—with a score and a clear place to focus first.",
    body,
    schema: [breadcrumbs(site, [{ name: "Brand Scorecard", path: "/brand-scorecard/" }])],
    scripts: [assets.scorecard]
  }];
}
