// Brandingdex — site settings.
//
// Everything that is specific to your business lives in this one file.
// Leave a value as "" (empty) to hide that item on the website until you are ready.
// After changing anything here, rebuild and redeploy the site.
//
// Secrets (API keys) do NOT go in this file. They are set on your hosting
// account as environment variables. See LAUNCH-GUIDE.md.

export default {
  name: "Brandingdex",

  // Your live web address, without a trailing slash.
  // Used for Google, link previews, the sitemap and confirmation emails.
  // On Netlify this follows the site's main address (the custom domain once one is connected).
  url: process.env.URL || "https://brandingdex.com",

  tagline: "Built to mean more. Designed to stand out.",
  description: "Brandingdex is a branding and design agency creating distinctive brand identities, clear strategy, and professional websites.",

  location: {
    city: "",
    region: "",
    country: "",
    countryCode: ""
  },

  contact: {
    email: "",                 // public address shown on the site, e.g. "hello@brandingdex.com"
    phone: "",                 // optional, international format, e.g. "+234 800 000 0000"
    whatsapp: "",              // WhatsApp number in international format, e.g. "+2348000000000"
    whatsappMessage: "Hello Brandingdex, I’d like to talk about a project.",
    bookingUrl: "",            // Calendly / Cal.com link for discovery calls
    responseTime: "within two working days"   // promise shown on the site and in the auto-reply
  },

  // Full profile links, e.g. "https://www.instagram.com/brandingdex"
  social: {
    instagram: "",
    linkedin: "",
    x: "",
    facebook: "",
    behance: "",
    dribbble: "",
    tiktok: "",
    youtube: ""
  },

  newsletter: {
    enabled: true,
    name: "Brand notes",
    pitch: "Practical notes on brand identity and websites for growing businesses. Occasional, useful, easy to leave."
  },

  // Email delivery and newsletter lists (Brevo). The API key itself is a secret
  // and is set on your host as BREVO_API_KEY.
  email: {
    notifyTo: "",              // inbox that receives enquiries (defaults to contact.email)
    fromEmail: "",             // verified sender on your domain (defaults to contact.email)
    fromName: "Brandingdex",
    newsletterListId: 0,       // Brevo list for newsletter subscribers
    leadsListId: 0,            // Brevo list for people who send an enquiry (optional)
    doubleOptInTemplateId: 0   // Brevo double opt-in template; 0 = add subscribers immediately
  },

  forms: {
    turnstileSiteKey: ""       // optional Cloudflare Turnstile site key (spam protection)
  },

  analytics: {
    ga4Id: "",                 // Google Analytics 4, e.g. "G-XXXXXXXXXX"
    metaPixelId: "",           // Meta (Facebook / Instagram) Pixel ID
    cloudflareToken: "",       // Cloudflare Web Analytics token (cookie-free)
    requireConsent: true       // ask visitors before loading Google Analytics / Meta Pixel
  },

  seo: {
    googleSiteVerification: "",   // from Google Search Console
    bingSiteVerification: ""
  },

  // Used in the privacy policy and terms pages.
  legal: {
    entity: "",                // registered business name, if different from "Brandingdex"
    updated: "2026-11-10"      // date the policies were last reviewed (YYYY-MM-DD)
  },

  // Optional founder block on the About page. Hidden while name is empty.
  founder: {
    name: "",
    role: "",
    bio: "",
    photo: ""                  // e.g. "/assets/founder.jpg" (place the file in src/static/assets/)
  }
};
