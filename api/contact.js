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
import { esc } from "../src/lib/html.mjs";

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

  const customerBriefFields = [
    ["Name", name],
    ["Email address", email],
    ["Business or brand name", company],
    ["Service", service],
    ["Package in mind", packageName],
    ["Budget range", budget],
    ["Timeline", timeline],
    ["Project details", project]
  ].filter(([, fieldValue]) => fieldValue);

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

  let receiptSent = false;
  const customerBriefText = customerBriefFields
    .map(([label, fieldValue]) => `${label}:\n${fieldValue}`)
    .join("\n\n");
  const customerBriefHtml = customerBriefFields.map(([label, fieldValue]) =>
    `<tr><th align="left" valign="top" style="width:170px;padding:13px 14px;border-bottom:1px solid #e3e4db;color:#666b60;font-size:12px;font-weight:600;text-align:left">${esc(label)}</th><td valign="top" style="padding:13px 14px;border-bottom:1px solid #e3e4db;color:#252923;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(fieldValue)}</td></tr>`
  ).join("");

  try {
    await brevoRequest("/smtp/email", {
      sender: { email: senderEmail, name: site.email.fromName || site.name },
      to: [{ email, name }],
      replyTo: { email: notifyTo, name: site.name },
      subject: "We’ve received your project brief — Brandingdex",
      textContent: `Hi ${name},\n\nThanks for getting in touch. We’ve received your project brief and will reply ${site.contact.responseTime}. This email includes a copy of the answers you sent.\n\n${customerBriefText}\n\nIf you need to add anything, reply to this email and it will reach our team.\n\nBrandingdex\n${site.url}`,
      htmlContent: `<!doctype html><html lang="en"><body style="margin:0;background:#f3f1e9;color:#252923;font-family:Arial,sans-serif"><div style="max-width:680px;margin:0 auto;padding:28px 16px"><div style="overflow:hidden;border:1px solid #e3e4db;border-radius:18px;background:#fffefa"><div style="padding:30px 32px;background:#252923;color:#f3f1e9"><p style="margin:0 0 12px;color:#ff795a;font-size:11px;letter-spacing:2px;text-transform:uppercase">BRANDINGDEX / PROJECT ENQUIRY</p><h1 style="margin:0;font-size:32px;line-height:1.1;letter-spacing:-1px">We’ve got your brief.</h1></div><div style="padding:28px 32px"><p style="margin:0 0 12px;font-size:16px">Hi ${esc(name)},</p><p style="margin:0 0 18px;color:#55594f;font-size:15px;line-height:1.7">Thanks for getting in touch. We’ve received your project brief and will reply ${esc(site.contact.responseTime)}. Here’s a copy of what you sent.</p><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border-top:1px solid #e3e4db">${customerBriefHtml}</table><p style="margin:20px 0 0;color:#55594f;font-size:14px;line-height:1.7">Need to add anything? Reply to this email and it will reach our team.</p><p style="margin:22px 0 0;color:#252923;font-size:14px;font-weight:700">Brandingdex</p><p style="margin:5px 0 0;font-size:12px"><a href="${esc(site.url)}" style="color:#c9472b">${esc(site.url.replace(/^https?:\/\//, ""))}</a></p></div></div></div></body></html>`
    });
    receiptSent = true;
  } catch (error) {
    console.error("Customer receipt delivery failed:", error.message);
  }

  if (wantsNewsletter && site.newsletter.enabled) {
    try {
      await subscribeToNewsletter(email);
    } catch (error) {
      console.error("Newsletter opt-in from project form failed:", error.message);
      return reply(req, res, {
        message: "Your project brief was sent. We could not finish the newsletter sign-up, so please subscribe from the Insights page."
      });
    }
  }

  return reply(req, res, { redirect: `/thanks/?receipt=${receiptSent ? "sent" : "not-sent"}` });
}
