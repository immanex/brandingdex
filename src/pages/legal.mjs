// Privacy policy and terms. The wording adapts to what is switched on in site.config.mjs,
// so the pages only describe tools the website actually uses.

import { longDate } from "../lib/html.mjs";
import { markdown } from "../lib/markdown.mjs";
import { crumbs } from "../lib/partials.mjs";
import { breadcrumbs } from "../lib/schema.mjs";

function privacy(site) {
  const entity = site.legal.entity || site.name;
  const reach = site.contact.email
    ? `email [${site.contact.email}](mailto:${site.contact.email})`
    : "write to us through our [contact page](/contact/)";
  const tracking = site.analytics.ga4Id || site.analytics.metaPixelId;
  const place = [site.location.city, site.location.region, site.location.country].filter(Boolean).join(", ");
  const analytics = [];
  if (site.analytics.ga4Id) analytics.push("- **Google Analytics** (Google) helps us understand how visitors find and use the website. It sets cookies and is only loaded if you accept analytics cookies.");
  if (site.analytics.metaPixelId) analytics.push("- **Meta Pixel** (Meta) helps us measure and improve our advertising on Facebook and Instagram. It sets cookies and is only loaded if you accept analytics cookies.");
  if (site.analytics.cloudflareToken) analytics.push("- **Cloudflare Web Analytics** counts page views without cookies and without identifying individual visitors.");
  if (!analytics.length) analytics.push("We do not currently use analytics or advertising cookies on this website.");
  const newsletterPrivacy = site.newsletter.enabled
    ? `### When you subscribe to our newsletter\n\nWe collect your email address so we can send you ${site.newsletter.name}. We only send it with your consent, and every email includes an unsubscribe link.`
    : "";
  const retention = site.newsletter.enabled
    ? "We keep enquiry details for as long as we need them to respond to you and to maintain our business records, and delete them when they are no longer needed. We keep your newsletter subscription until you unsubscribe."
    : "We keep enquiry details for as long as we need them to respond to you and to maintain our business records, and delete them when they are no longer needed.";
  const providers = [
    "- **Vercel** hosts the website and processes technical data such as your IP address when you visit or submit a form.",
    `- **Brevo** receives project briefs so we can reply to you and send a copy to the email address you provided${site.newsletter.enabled ? ", and stores your email address when you subscribe to the newsletter" : ""}.`
  ];
  if (site.analytics.ga4Id) providers.push("- **Google**, for Google Analytics, if you accept analytics cookies.");
  if (site.analytics.metaPixelId) providers.push("- **Meta**, for the Meta Pixel, if you accept analytics cookies.");
  if (site.analytics.cloudflareToken || site.forms.turnstileSiteKey) providers.push("- **Cloudflare**, for " + [site.analytics.cloudflareToken && "cookie-free analytics", site.forms.turnstileSiteKey && "spam protection on our forms"].filter(Boolean).join(" and ") + ".");

  return `
This policy explains what personal information ${entity} ("we", "us") collects through this website, why we collect it, and the choices you have.

## Who we are

${entity} is a branding and design studio${place ? ` based in ${place}` : ""}. We are responsible for the personal information collected through this website. To contact us about it, ${reach}.

## What we collect and why

### When you send a project brief

We collect the details you give us: your name, email address, business name, the service or package you are interested in, your budget range and timeline if you share them, and what you tell us about your project. Our form provider also records technical details with each submission, such as your IP address, to help filter spam.

We use this information to reply to you, prepare a proposal, and keep a record of our conversation. We process it because you asked us to get in touch, and because we have a legitimate interest in responding to enquiries.

We also send a receipt of your brief to the email address you provide, so you can review the details you submitted.

${newsletterPrivacy}

### When you use the Brand Scorecard

Your answers are scored in your browser. They are not sent to us unless you choose to share your result when you contact us.

### Analytics and cookies

${analytics.join("\n")}

${site.forms.turnstileSiteKey ? "Our forms use Cloudflare Turnstile to tell real visitors from automated spam. It checks technical signals from your browser and does not use advertising cookies.\n" : ""}
${tracking ? "### Information stored on your device\n\nWe store your cookie choice in your browser so we do not ask you again on every page.\n" : ""}
## Who we share it with

We do not sell your personal information. We share it only with service providers who help us run the website and reply to you:

${providers.join("\n")}

Some of these providers process information outside Nigeria. Where they do, we rely on the safeguards they provide for international transfers.

## How long we keep it

${retention}

## Your rights

Under the Nigeria Data Protection Act 2023—and, where it applies to you, the GDPR—you can ask us to:

- give you a copy of the personal information we hold about you
- correct information that is inaccurate
- delete your information
- stop using your information, or use it in a more limited way
- stop sending you marketing emails, at any time

To make a request, ${reach}. If you are not satisfied with our response, you can complain to the Nigeria Data Protection Commission or to your local data protection authority.

## Children

This website is for businesses and is not directed at children. We do not knowingly collect personal information from children.

## Changes to this policy

We may update this policy when our website or the tools we use change. The date at the top of the page shows when it was last updated.

## Contact

Questions about this policy or your information? Please ${reach}.
`;
}

function terms(site) {
  const entity = site.legal.entity || site.name;
  const reach = site.contact.email
    ? `email [${site.contact.email}](mailto:${site.contact.email})`
    : "write to us through our [contact page](/contact/)";
  return `
These terms apply to your use of this website, which is operated by ${entity} ("we", "us"). By using the website, you agree to them.

## Our services and pricing

The packages and prices shown on this website are a guide. They are starting prices for the listed scope. They are not a binding offer.

Every project is confirmed in a written proposal that sets out the scope, deliverables, timeline, price, and payment terms. If anything on this website differs from your proposal, the proposal applies.

## Enquiries

Sending us a project brief does not create a contract between us. A project begins only when we have both agreed to a written proposal.

## Portfolio and illustrative concepts

Projects marked "Illustrative concept" are self-initiated design explorations. They show our creative direction. They are not client projects, they do not report business results, and no affiliation with any real business of the same or a similar name is intended or implied.

## Insights and the Brand Scorecard

Our articles and the Brand Scorecard offer general information to help you think about your brand. They are not professional advice for your specific situation, and you should not rely on them as such.

## Intellectual property

Unless stated otherwise, the content of this website—including text, designs, graphics, and the ${site.name} name and logo—belongs to us. You may view and share links to it. Please do not copy, reproduce, or reuse it without our written permission.

## Links to other websites

This website may link to websites we do not control. We are not responsible for their content or their privacy practices.

## Availability and liability

We work to keep this website accurate and available, but we provide it "as is", without guarantees that it will always be available or free of errors. To the extent the law allows, we are not liable for any loss arising from your use of the website or from relying on its content.

## Privacy

Our [privacy policy](/privacy/) explains how we handle personal information.

## Governing law

These terms are governed by the laws of the Federal Republic of Nigeria.

## Changes to these terms

We may update these terms from time to time. The date at the top of the page shows when they were last updated.

## Contact

Questions about these terms? Please ${reach}.
`;
}

const legalPage = (site, path, name, headline, description, source) => ({
  path,
  title: name + " | Brandingdex",
  description,
  body: `<header class="article-head">
  ${crumbs([{ name, path }])}
  <div class="eyebrow">LEGAL</div>
  <h1>${headline}</h1>
  <p class="post-meta">Last updated ${longDate(site.legal.updated)}</p>
</header>
<div class="article-body legal">
  <div class="prose">
${markdown(source)}
  </div>
</div>`,
  schema: [breadcrumbs(site, [{ name, path }])]
});

export default function legal(ctx) {
  const { site } = ctx;
  return [
    legalPage(site, "/privacy/", "Privacy policy", "Privacy policy", "How Brandingdex collects, uses, and protects personal information from this website.", privacy(site)),
    legalPage(site, "/terms/", "Terms of use", "Terms of use", "The terms that apply when you use the Brandingdex website.", terms(site))
  ];
}
