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

The admin is connected to the `immanex/brandingdex` repository in `src/static/admin/config.yml`; change it there if the repository moves. GitHub sign-in also needs an OAuth client configured for the chosen hosting provider, or editors can use GitHub access tokens. Give editors write access to the repository. Each saved content change is a repository commit and should trigger the site's normal deployment build.

The site build writes static files to `dist/`; run it with `npm run build`.

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
