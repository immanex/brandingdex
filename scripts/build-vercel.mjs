// Vercel build entry point. Keep the normal build on Netlify Forms until
// production DNS is moved; Vercel uses the Brevo-backed API routes.
process.env.FORM_PROVIDER = "brevo";
await import("./build.mjs");
