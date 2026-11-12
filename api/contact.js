import {
  brevoRequest,
  methodNotAllowed,
  readForm,
  reply,
  safeReturnPath,
  site,
  subscribeToNewsletter,
  validEmail,
  verifyTurnstile
} from "../server/forms.mjs";

const value = (form, key, max = 5000) =>
  typeof form[key] === "string" ? form[key].trim().slice(0, max) : "";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(req, res);

  const form = readForm(req);
  const returnPath = safeReturnPath(value(form, "form_path", 80));
  const fail = (status, error) => reply(req, res, {
    status,
    error,
    redirect: `${returnPath}?form-error=1`
  });

  if (value(form, "company_url", 200)) return reply(req, res, { redirect: "/thanks/" });
  if (!await verifyTurnstile(form)) return fail(400, "Please complete the spam check and try again.");

  const name = value(form, "name", 100);
  const email = value(form, "email", 254).toLowerCase();
  const service = value(form, "service", 120);
  const project = value(form, "project", 5000);
  const company = value(form, "company", 120);
  const packageName = value(form, "package", 120);
  const budget = value(form, "budget", 80);
  const timeline = value(form, "timeline", 80);
  const context = value(form, "context", 120);
  const wantsNewsletter = value(form, "newsletter", 10) === "yes";

  if (!name || !validEmail(email) || !service || !project) {
    return fail(400, "Please complete the required fields with a valid email address.");
  }

  const notifyTo = site.email.notifyTo || site.contact.email;
  const senderEmail = site.email.fromEmail || site.contact.email;
  if (!process.env.BREVO_API_KEY || !notifyTo || !senderEmail) {
    return fail(503, "The form is temporarily unavailable. Please email hello@brandingdex.com.");
  }

  const details = [
    `Name: ${name}`,
    `Email: ${email}`,
    company && `Business: ${company}`,
    `Service: ${service}`,
    packageName && `Package: ${packageName}`,
    budget && `Budget: ${budget}`,
    timeline && `Timeline: ${timeline}`,
    context && `Page context: ${context}`,
    `Newsletter opt-in: ${wantsNewsletter ? "Yes" : "No"}`,
    "",
    "Project details:",
    project
  ].filter(line => line !== false && line !== undefined).join("\n");

  try {
    await brevoRequest("/smtp/email", {
      sender: { email: senderEmail, name: site.email.fromName || site.name },
      to: [{ email: notifyTo, name: site.name }],
      replyTo: { email, name },
      subject: `New project enquiry from ${name}`,
      textContent: details
    });
  } catch (error) {
    console.error("Project form delivery failed:", error.message);
    return fail(502, "We could not send your brief just now. Please try again or email hello@brandingdex.com.");
  }

  if (wantsNewsletter) {
    try {
      await subscribeToNewsletter(email);
    } catch (error) {
      console.error("Newsletter opt-in from project form failed:", error.message);
      return reply(req, res, {
        message: "Your project brief was sent. We could not finish the newsletter sign-up, so please subscribe from the Insights page."
      });
    }
  }

  return reply(req, res, { redirect: "/thanks/" });
}
