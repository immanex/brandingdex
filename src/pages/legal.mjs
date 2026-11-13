// Privacy policy and terms. The wording adapts to what is switched on in site.config.mjs,
// so the pages only describe tools the website actually uses.

import { esc, longDate, slugify } from "../lib/html.mjs";
import { markdown } from "../lib/markdown.mjs";
import { crumbs } from "../lib/partials.mjs";
import { breadcrumbs } from "../lib/schema.mjs";

const META_POLICY = "https://www.facebook.com/privacy/policy/";

function privacy(site) {
  const entity = site.legal.entity || site.name;
  const email = site.contact.email;
  const reach = email
    ? `email us at [${email}](mailto:${email})`
    : "write to us through our [contact page](/contact/)";
  const place = [site.location.city, site.location.region, site.location.country].filter(Boolean).join(", ");
  const tracking = site.analytics.ga4Id || site.analytics.metaPixelId;
  const newsletter = site.newsletter.enabled;
  const social = Object.entries(site.social).filter(([, link]) => link).map(([key]) => key);

  // Direct channels only appear once they are filled in on the site.
  const directChannels = [
    "- **Email**, when you write to us directly.",
    site.contact.phone && "- **Phone**, when you call us or ask us to call you.",
    site.contact.whatsapp && "- **WhatsApp**, when you message us using the WhatsApp link on this website.",
    site.contact.bookingUrl && "- **Discovery-call bookings**, when you book a call through the scheduling link on this website. The scheduling service we use processes the details you enter under its own privacy policy."
  ].filter(Boolean);

  const analytics = [];
  if (site.analytics.ga4Id) analytics.push("- **Google Analytics** (Google) helps us understand how visitors find and use the website. It sets cookies and is only loaded after you accept analytics cookies.");
  if (site.analytics.metaPixelId) analytics.push("- **Meta Pixel** (Meta) helps us measure whether our Facebook and Instagram advertising leads to enquiries, and to show our ads to people who have visited this website. It sets cookies and is only loaded after you accept advertising cookies.");
  if (site.analytics.cloudflareToken) analytics.push("- **Cloudflare Web Analytics** counts page views without cookies and without identifying individual visitors.");

  const providers = [
    "- **Vercel** hosts this website and runs the code that receives form submissions. It processes technical data such as your IP address when you visit a page or send a form.",
    `- **Brevo** delivers our email. When you send a project brief, Brevo sends it to our inbox and sends you a copy${newsletter ? ", and it stores your email address when you subscribe to the newsletter" : ""}.`,
    "- **Meta Platforms** (Facebook, Instagram, Messenger) processes information you submit through our lead ads and the messages you send us on those platforms, under its own terms and privacy policy.",
    "- **Our business email provider**, which stores the email conversations we have with you."
  ];
  if (site.analytics.ga4Id) providers.push("- **Google**, for Google Analytics, if you accept analytics cookies.");
  if (site.analytics.metaPixelId) providers.push("- **Meta**, for the Meta Pixel, if you accept advertising cookies.");
  if (site.analytics.cloudflareToken || site.forms.turnstileSiteKey) providers.push("- **Cloudflare**, for " + [site.analytics.cloudflareToken && "cookie-free analytics", site.forms.turnstileSiteKey && "spam protection on our forms"].filter(Boolean).join(" and ") + ".");

  return `
This privacy policy explains what personal information ${entity} ("Brandingdex", "we", "us") collects, how we use it, who we share it with, and the choices and rights you have. It covers this website, our contact forms, the lead forms and messages we receive through Facebook and Instagram, and the emails and conversations we have with you about your project.

## Who we are

Brandingdex is an independent brand strategy and design studio${place ? ` based in ${place}` : ""}. We design logos, brand identities, graphics and websites for startups, entrepreneurs, small businesses, established companies and organisations, and most of our clients are outside Nigeria, including in the United States, the United Kingdom, Canada and Australia.

We are responsible for the personal information described in this policy (in data protection terms, we are the "data controller"). To ask us anything about it, ${reach}.

We take the responsibility seriously. We collect only what we need to respond to you and do our work, we do not sell personal information, and we do not send marketing emails to people who have not asked for them.

## Information we collect

### Information you give us

- **Contact details**: your name, email address, and, when you choose to share it, your phone number.
- **Business details**: your business or brand name, website, industry, and what your business does.
- **Project details**: the service you are interested in, the package you have in mind, the design requirements and goals you describe, and your budget range and estimated timeline if you share them.
- **Messages**: what you write in our contact forms, lead forms, emails, Messenger and Instagram messages, and in project discussions and calls.
- **Lead ad answers**: the answers you give in a Facebook or Instagram lead form, which usually include your name and email address and may include your phone number, business name and answers to a few short questions about your project.${newsletter ? `\n- **Newsletter sign-up**: your email address when you subscribe to ${site.newsletter.name}.` : ""}
- **Project files**: during a project, the content, images and brand material you give us so we can do the work.

Please do not send us sensitive personal information (such as health, religious, financial-account or government-ID details) unless we ask for it for a specific reason.

### Information collected automatically

- **Technical data from your visit**: when you open a page or send a form, our hosting provider records technical details such as your IP address, browser and device type, the page requested and the time of the request, in server logs used to deliver the website and protect it from abuse.
- **Spam signals**: our forms include a hidden field that automated bots tend to fill in. It helps us discard spam and collects nothing from genuine visitors.${site.forms.turnstileSiteKey ? "\n- **Spam check**: our forms use Cloudflare Turnstile, which checks technical signals from your browser to tell real visitors from bots. It does not use advertising cookies." : ""}${tracking ? "\n- **Analytics and advertising data**, described under Cookies, analytics and advertising below, but only after you have agreed to it." : "\n- **No analytics or advertising tracking**: this website does not currently run analytics or advertising scripts, so we do not track your browsing across pages or other websites."}
- **Information from Meta**: when you interact with our ads or pages on Facebook or Instagram, Meta shows us aggregated statistics about how the ad or page is performing. These statistics do not identify you to us, but Meta's processing is governed by its own [privacy policy](${META_POLICY}).

### The Brand Scorecard

Your answers to the Brand Scorecard are scored in your browser. They are not sent to us unless you choose to mention your result when you contact us.

## How we collect information

- **Forms on this website**: the project-brief form on the contact page and the shorter version on the homepage${newsletter ? ", and the newsletter sign-up form" : ""}.
- **Facebook and Instagram lead ads**: lead forms attached to our advertising on Facebook and Instagram.
- **Facebook Messenger and Instagram Direct Messages**, when you message our business pages${social.length ? "" : " (where we have them)"}.
${directChannels.join("\n")}
- **Project discussions**: calls, meetings, emails and messages during an enquiry or project.

## How we use personal information

We use the information described above to:

- respond to your enquiry and answer your questions
- prepare a quotation or written proposal for your project
- understand and discuss your branding, design and website requirements
- deliver the services you have asked for and manage the project
- keep in touch with you about your enquiry or project, and keep a record of our conversations
- issue invoices, take payment and keep the business records the law requires us to keep
- keep this website working, secure and free from spam
- understand how well our advertising is working, using aggregated statistics provided by the advertising platform${tracking ? " and the measurement tools described under Cookies, analytics and advertising" : ""}
- send you marketing communications **only** where you have agreed to receive them and the law allows it

**Sending us an enquiry is not consent to marketing.** When you send a project brief or lead form, we use your details to reply to you about that enquiry. We do not add you to a marketing list or send you promotional emails unless you have separately agreed to it, for example by ticking an optional marketing box or subscribing to our newsletter. You can withdraw that agreement at any time using the unsubscribe link in any marketing email, or by contacting us.

## Facebook and Instagram lead ads

We advertise on Facebook and Instagram, and some of our ads include a lead form that lets you ask about our services without leaving the app. This section explains how we handle what you submit there.

**What we collect.** The fields in the form you complete. These usually include your name and email address, and may include your phone number, your business name and short answers about the service you need, your budget or your timeline. Meta may pre-fill some fields from your profile; you can edit them before you submit.

**Why we collect it.** To respond to your enquiry, understand what you are looking for, and send you a quotation or proposal if you want one. We process it because you asked us to get in touch, and because we have a legitimate interest in responding to people who ask about our services.

**How we receive it.** Meta makes your submission available to us through its advertising tools. We retrieve it from there and keep it with our other enquiries. Meta also keeps a copy under its own [privacy policy](${META_POLICY}) and terms, and we have no control over that copy.

**How we contact you.** We normally reply by email using the address you gave. If you provide a phone number, we may call or message you about your enquiry when it is the quickest way to answer your questions.

**How we handle your enquiry.** We read your submission, reply with questions or next steps, and, if you would like to go ahead, send a written proposal. If you do not reply to us, we may follow up a small number of times about the same enquiry, and we then stop.

**Marketing preferences.** Submitting a lead form is an enquiry, not a marketing sign-up. We do not add you to a newsletter or marketing list on the basis of a lead form unless the form includes a separate, optional marketing question and you choose yes. You can change your mind at any time by contacting us or using the unsubscribe link in any marketing email we send.

**Correction and deletion.** You can ask us to correct or delete the details you submitted at any time; ${reach}. We will delete the copy we hold, subject to the retention explained below. To remove the copy Meta holds, use the tools in your Facebook or Instagram account settings or contact Meta.

**Third parties.** Your submission is processed by Meta (which collects it) and by the service providers listed under Who we share it with (which host and deliver our email). We do not sell lead information to anyone.

## Cookies, analytics and advertising

${analytics.length ? analytics.join("\n") : "This website does not currently use analytics cookies, advertising cookies or tracking pixels. We do not run Google Analytics, the Meta Pixel or similar tools on it. If that changes, we will update this policy and, where the law requires it, ask for your consent before any such tool is loaded."}
${site.forms.turnstileSiteKey ? "\nOur forms use Cloudflare Turnstile to tell real visitors from automated spam. It checks technical signals from your browser and does not use advertising cookies.\n" : ""}
${tracking ? "**Your choices.** We ask for your consent before loading analytics or advertising tools, and we store your choice in your browser so we do not ask you again on every page. You can change your choice at any time using the Cookie settings link in the footer of every page, or by clearing cookies in your browser.\n\n" : ""}**Essential storage.** The website works without cookies. It does not set login or tracking cookies, and it stores nothing in your browser other than what your browser itself keeps as part of normal use.

**Embedded content.** If a page on this website embeds content from another service (for example a scheduling tool, a form provider or a video player), that service may set its own cookies when you interact with it. We will name any such service here when we use one.

**Advertising on Facebook and Instagram.** Our ads on Meta's platforms are targeted using Meta's own tools and data under Meta's terms. ${site.analytics.metaPixelId ? "With your consent, the Meta Pixel on this website lets us measure those ads and show them to people who have visited this website." : "We do not currently send Meta any data about your visits to this website."} You can control the ads you see in your Facebook and Instagram ad preferences.

## Legal bases for using your information

Where data protection law requires us to have a legal basis, we rely on:

- **Taking steps at your request before a contract, and performing a contract**, when we respond to your enquiry, prepare a proposal and deliver a project.
- **Legitimate interests**, when we respond to enquiries, keep business records, follow up on a conversation you started, keep the website secure and understand how our advertising performs. We balance these interests against your rights and do not use this basis where your interests override ours.
- **Consent**, for marketing emails${tracking ? ", analytics and advertising cookies" : " and any non-essential cookies we may use in future"}. You can withdraw consent at any time.
- **Legal obligation**, when we keep invoices and accounting records that tax and company law require.

## Which privacy laws apply

We are based in Nigeria, and the **Nigeria Data Protection Act 2023** applies to everything we do with personal information.

Because we offer our services to people in other countries, other laws may also apply depending on where you are:

- If you are in the **European Union or European Economic Area**, the **GDPR** may apply to our processing of your information, and you have the rights it provides.
- If you are in the **United Kingdom**, the **UK GDPR** and the **Data Protection Act 2018** may apply, and you have the rights they provide.
- If you are in the **United States**, state privacy laws such as the California Consumer Privacy Act generally apply only to businesses above certain revenue or data-volume thresholds, which we do not currently meet. We nonetheless extend the rights described below to everyone, wherever they live.
- If you are in **Canada** or **Australia**, we handle your information in a way that is consistent with the principles of **PIPEDA** and the **Australian Privacy Principles**, and we honour the rights described below.

This policy does not claim that every one of these laws applies to us in every case; which laws apply depends on where you are and how you interact with us. If you believe a specific law gives you a right we have not honoured, please tell us.

## Your rights and choices

Wherever you are, you can ask us to:

- **Access**: give you a copy of the personal information we hold about you.
- **Correct**: fix information that is inaccurate or incomplete.
- **Delete**: erase your information, unless we need to keep it for a legal reason such as accounting records.
- **Restrict or object**: stop using your information, or use it only in a more limited way, where the law gives you that right.
- **Withdraw consent**: at any time, for anything that relies on your consent, such as marketing emails${tracking ? " or cookies" : ""}.
- **Stop marketing**: at any time, using the unsubscribe link in any marketing email or by contacting us.
- **Port**: receive the information you gave us in a commonly used electronic format, where that right applies to you.

To make a request, ${reach}. We may need to confirm your identity before acting on it. We aim to respond within one month, and we do not charge for reasonable requests.

If you are not satisfied with our response, you can complain to the **Nigeria Data Protection Commission**. If you are in the EU, EEA or UK, you can also complain to your local data protection authority (in the UK, the Information Commissioner's Office).

## How we protect your information

We use reasonable technical and organisational measures that fit the size of our studio:

- This website is served over HTTPS, so what you type into our forms is encrypted in transit between your browser and our hosting provider, and between our hosting provider and our email service.
- This website does not keep a database of form submissions. Your submission is sent to our business inbox and a copy is sent to you; nothing is stored on the website itself.
- Access to our inbox, email service, advertising accounts and hosting account is limited to the people who need it to respond to you and run the business, and is protected by passwords and the security features those services provide.
- Our forms filter automated spam so that we only handle genuine enquiries.

No website or email system can be guaranteed completely secure. If we become aware of a security incident affecting your personal information, we will tell you and the relevant authority where the law requires it.

## How long we keep your information

We keep personal information only for as long as we need it for the purposes described above, using these criteria:

- **Enquiries and lead-form submissions** are kept while we are in conversation with you about your enquiry and for a reasonable period afterwards, so that we can pick up the conversation if you come back to us. Enquiries that do not lead to a project are then deleted.
- **Client and project records**, including proposals, contracts, project files and correspondence, are kept for the duration of the project and afterwards for as long as we need them to support the work, resolve any questions and meet our legal and accounting obligations.
- **Invoices and payment records** are kept for the period required by tax and company law.${newsletter ? "\n- **Newsletter subscriptions** are kept until you unsubscribe." : ""}
- **Server logs** held by our hosting provider are kept for the short period that provider uses for operational and security purposes.

If you ask us to delete your information, we do so unless we need to keep it for one of the legal reasons above.

## Who we share it with

We do not sell personal information, and we do not share it with advertisers or data brokers. We share it only with service providers who help us run the website, communicate with you and do our work, and only to the extent they need it:

${providers.join("\n")}
- **Professional advisers, payment providers and authorities**, where we need to issue invoices or take payment, obtain professional advice, or comply with the law or a lawful request.

These providers act on our behalf and are not permitted to use your information for their own purposes, except where they are independent services (such as Meta) that process your information under their own terms.

## International transfers

We work from Nigeria, and the service providers listed above process information in other countries, including the United States and the European Union. That means your information may be stored and processed outside the country you live in. Where a law that applies to you restricts international transfers, we rely on the safeguards our providers offer, such as the standard contractual clauses and data processing terms they publish, and we take reasonable steps to make sure your information is protected in line with this policy wherever it is processed.

## Children

Our services are for businesses and adults. This website and our advertising are not directed at children under 18, and we do not knowingly collect personal information from them. If we learn that we have received personal information from a child, we will delete it. If you believe a child has given us personal information, please contact us.

## Changes to this policy

We may update this policy when our services, our website or the tools we use change, or when the law requires it. The date at the top of this page shows when it was last updated. If we make a significant change to how we use your personal information, we will highlight it on this page and, where appropriate, tell you directly.

## Contact us

If you have a question about this policy, want to exercise any of your rights, or want to tell us about a concern, please ${reach}${place ? `. We are based in ${place}` : ""}. We aim to reply ${site.contact.responseTime}.
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

Our [privacy policy](/privacy-policy/) explains how we handle personal information.

## Governing law

These terms are governed by the laws of the Federal Republic of Nigeria.

## Changes to these terms

We may update these terms from time to time. The date at the top of the page shows when they were last updated.

## Contact

Questions about these terms? Please ${reach}.
`;
}

// An "on this page" list built from the second-level headings, using the same ids the Markdown reader gives them.
function contents(source) {
  const headings = source.split("\n").map(line => /^## (.+)$/.exec(line)?.[1]).filter(Boolean);
  if (!headings.length) return "";
  return `<aside class="article-aside legal-aside">
    <nav class="article-aside-card legal-contents" aria-label="On this page">
      <div class="eyebrow">ON THIS PAGE</div>
      <ol>${headings.map(text => `<li><a href="#${slugify(text)}">${esc(text)}</a></li>`).join("")}</ol>
    </nav>
  </aside>`;
}

const legalPage = (site, path, name, headline, description, source, lead = "") => ({
  path,
  title: name + " | Brandingdex",
  description,
  body: `<header class="article-head legal-head">
  <div class="article-head-copy">
  ${crumbs([{ name, path }])}
  <div class="eyebrow">LEGAL</div>
  <h1>${headline}</h1>
  ${lead ? `<p class="pricing-lead">${esc(lead)}</p>` : ""}
  <p class="post-meta">Last updated ${longDate(site.legal.updated)}</p>
  </div>
</header>
<div class="article-body legal">
  <div class="prose">
${markdown(source)}
  </div>
  ${contents(source)}
</div>`,
  schema: [breadcrumbs(site, [{ name, path }])]
});

export default function legal(ctx) {
  const { site } = ctx;
  return [
    legalPage(
      site,
      "/privacy-policy/",
      "Privacy Policy",
      "Privacy policy",
      "How Brandingdex collects, uses, shares and protects personal information from its website, contact forms, and Facebook and Instagram lead ads, and the rights you have.",
      privacy(site),
      "How we handle the personal information you share with us through this website, our Facebook and Instagram ads, and our conversations with you."
    ),
    legalPage(site, "/terms/", "Terms of use", "Terms of use", "The terms that apply when you use the Brandingdex website.", terms(site))
  ];
}
