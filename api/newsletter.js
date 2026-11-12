import {
  methodNotAllowed,
  readForm,
  reply,
  safeReturnPath,
  subscribeToNewsletter,
  validEmail,
  verifyTurnstile
} from "../server/forms.mjs";

const value = (form, key, max = 500) =>
  typeof form[key] === "string" ? form[key].trim().slice(0, max) : "";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(req, res);

  const form = readForm(req);
  const returnPath = safeReturnPath(value(form, "form_path", 80), "/insights/");
  const fail = (status, error) => reply(req, res, {
    status,
    error,
    redirect: `${returnPath}?form-error=1`
  });

  if (value(form, "company_url", 200)) return reply(req, res, { redirect: "/newsletter/confirmed/" });
  if (!await verifyTurnstile(form)) return fail(400, "Please complete the spam check and try again.");

  const email = value(form, "email", 254).toLowerCase();
  if (!validEmail(email)) return fail(400, "Enter a valid email address and try again.");

  try {
    const redirect = await subscribeToNewsletter(email);
    return reply(req, res, { redirect });
  } catch (error) {
    console.error("Newsletter subscription failed:", error.message);
    return fail(502, "We could not complete the subscription just now. Please try again later.");
  }
}
