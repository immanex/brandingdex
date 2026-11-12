import site from "../site.config.mjs";

const BREVO_API = "https://api.brevo.com/v3";

export function readForm(req) {
  const body = req.body;
  if (body && typeof body === "object" && !Buffer.isBuffer(body)) return body;
  if (Buffer.isBuffer(body)) return Object.fromEntries(new URLSearchParams(body.toString("utf8")));
  if (typeof body === "string") return Object.fromEntries(new URLSearchParams(body));
  return {};
}

export function reply(req, res, { status = 200, redirect, message, error } = {}) {
  if (String(req.headers.accept || "").includes("application/json")) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: status < 400, redirect, message, error }));
    return;
  }
  res.statusCode = 303;
  res.setHeader("Location", redirect || "/contact/?form-error=1");
  res.end();
}

export function methodNotAllowed(req, res) {
  res.setHeader("Allow", "POST");
  reply(req, res, { status: 405, error: "Use the form to send this request." });
}

export function safeReturnPath(value, fallback = "/contact/") {
  const allowed = new Set(["/", "/contact/", "/insights/", "/brand-scorecard/"]);
  return allowed.has(value) ? value : fallback;
}

export async function verifyTurnstile(form) {
  if (!site.forms.turnstileSiteKey) return true;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const token = String(form["cf-turnstile-response"] || "");
  if (!secret || !token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });
    const result = await response.json();
    return response.ok && result.success === true;
  } catch {
    return false;
  }
}

export function requiredSecret() {
  const secret = process.env.BREVO_API_KEY;
  if (!secret) throw new Error("Brevo API key is not configured.");
  return secret;
}

export async function brevoRequest(endpoint, payload) {
  const response = await fetch(`${BREVO_API}${endpoint}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": requiredSecret(),
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Brevo request failed with status ${response.status}.`);
  }
  return response.status === 204 ? {} : response.json();
}

export async function subscribeToNewsletter(email) {
  const listId = Number(site.email.newsletterListId || process.env.BREVO_NEWSLETTER_LIST_ID || 0);
  if (!Number.isInteger(listId) || listId <= 0) throw new Error("Brevo newsletter list is not configured.");

  const templateId = Number(site.email.doubleOptInTemplateId || process.env.BREVO_DOUBLE_OPT_IN_TEMPLATE_ID || 0);
  if (templateId > 0) {
    await brevoRequest("/contacts/doubleOptinConfirmation", {
      email,
      includeListIds: [listId],
      templateId,
      redirectionUrl: `${site.url}/newsletter/confirmed/`
    });
    return "/newsletter/pending/";
  }

  await brevoRequest("/contacts", {
    email,
    listIds: [listId],
    updateEnabled: true
  });
  return "/newsletter/confirmed/";
}

export function validEmail(value) {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export { site };
