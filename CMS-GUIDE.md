# Content admin

The admin is served at `/admin/` after a site build. It uses Sveltia CMS and stores content as files in this repository.

## What editors can change

- Create, edit and remove pages in **Pages**. A page slug becomes its URL, such as `launch-checklist` → `/launch-checklist/`.
- Add text, image, button and approved third-party embed sections. Drag the section handles to reorder them.
- Add, rename and reorder header and footer links in **Website menus**.
- Add and edit the homepage **Testimonials**. The current quotes and portrait are clearly marked sample content; replace them with approved client feedback before presenting them as real.
- Write articles in **Insights**. Articles appear on the insights listing after the next build.

The embed section accepts HTTPS links for Calendly, Typeform, Tally, YouTube and Vimeo. It renders those providers in an iframe; it does not run pasted JavaScript or provide a general plugin store. Add a provider to `src/lib/content-pages.mjs` if the site needs another trusted embed host.

## Local editing

Sveltia can edit a local checkout without remote authentication. Its local repository workflow requires the project to be a Git repository and a local static server. Open `/admin/index.html` in a Chromium-based browser, choose **Work with Local Repository**, and select the project folder. Rebuild the site after editing to preview the generated pages.

## Live editing

The admin is connected to the `immanex/brandingdex` repository in `src/static/admin/config.yml`; change it there if the repository moves. Give editors write access to the repository. On Vercel, each saved content change commits to `main` and triggers a new production deployment. The admin uses Sveltia CMS's GitHub token sign-in.

At `/admin/`, choose **Sign In with Token** and create a GitHub token with the repository access requested by Sveltia CMS. Keep the token private. Editors can also use the local repository workflow without a token.

## Form submissions

Vercel builds send project briefs and newsletter sign-ups through the API routes in `api/`, which use Brevo. Set these variables in the Vercel project before enabling the production domain:

- `BREVO_API_KEY`: private Brevo API key.
- `BREVO_FROM_EMAIL`: verified sender address in Brevo.
- `CONTACT_NOTIFY_TO`: inbox for project briefs; defaults to the public contact email in `site.config.mjs`.
- `BREVO_NEWSLETTER_LIST_ID`: Brevo contact list ID. Newsletter forms stay hidden on Vercel until this is configured.
- `BREVO_DOUBLE_OPT_IN_TEMPLATE_ID`: optional Brevo double opt-in template ID. Without it, a visitor is added to the list after submitting.
- `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`: optional Cloudflare Turnstile site and secret keys. Configure both together.

All builds use the Vercel API routes for form submissions. The production build command is `npm run build:vercel`; it writes the static site to `dist/` and deploys the functions in `api/`.

The site build writes static files to `dist/`. Use `npm run build` for a local build; Vercel runs `npm run build:vercel`.

## Editing files directly

The source is plain text and can also be edited with VS Code, Notepad, or another code editor. Edit the source files rather than `dist/`, because each build recreates `dist/`.

- `site.config.mjs`: site name, contact details, social profiles, and response-time wording.
- `content/navigation.json`: header and footer links.
- `content/packages.json`, `content/services.json`, and `content/projects.json`: packages, service descriptions, and portfolio projects.
- `content/testimonials.json`: homepage testimonial quotes, client details, and profile image paths.
- `content/insights/*.md`: insight articles.
- `src/pages/*.mjs`: page copy and page structure.
- `src/styles/base.css` and `src/styles/overrides.css`: site styling and responsive layouts.
- `src/static/assets/`: images, scripts, and other static files.

After editing, run `npm run build` and `npm run preview` to review the changes locally.
