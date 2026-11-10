import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import site from "../site.config.mjs";
import { page as renderPage } from "../src/lib/layout.mjs";
import { markdown, readingMinutes } from "../src/lib/markdown.mjs";
import { contentPage } from "../src/lib/content-pages.mjs";
import { rss } from "../src/lib/feed.mjs";
import { robots, sitemap } from "../src/lib/sitemap.mjs";
import home from "../src/pages/home.mjs";
import portfolio from "../src/pages/portfolio.mjs";
import pricing from "../src/pages/pricing.mjs";
import servicesPage from "../src/pages/services.mjs";
import about from "../src/pages/about.mjs";
import contact from "../src/pages/contact.mjs";
import insights from "../src/pages/insights.mjs";
import scorecardPage from "../src/pages/scorecard.mjs";
import legal from "../src/pages/legal.mjs";
import notFound from "../src/pages/not-found.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");

async function readJson(relativePath, fallback) {
  try {
    return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

function yamlScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try { return JSON.parse(trimmed); } catch { return trimmed.slice(1, -1); }
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).replace(/''/g, "'");
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  return trimmed;
}

function articleSource(source) {
  const match = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(source);
  if (!match) return { fields: {}, body: source };
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = /^([\w-]+):\s*(.*)$/.exec(line);
    if (item) fields[item[1]] = yamlScalar(item[2]);
  }
  return { fields, body: source.slice(match[0].length) };
}

async function loadPosts() {
  const directory = path.join(root, "content/insights");
  let files = [];
  try { files = await readdir(directory, { withFileTypes: true }); } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const posts = [];
  for (const entry of files.filter(item => item.isFile() && item.name.endsWith(".md"))) {
    const source = await readFile(path.join(directory, entry.name), "utf8");
    const { fields, body } = articleSource(source);
    posts.push({
      ...fields,
      slug: path.basename(entry.name, ".md"),
      body,
      html: markdown(body),
      minutes: readingMinutes(body)
    });
  }
  return posts.sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.title.localeCompare(b.title));
}

async function loadOgImages() {
  const directory = path.join(root, "src/static/assets/og");
  try {
    const files = await readdir(directory, { withFileTypes: true });
    return new Set(files.filter(entry => entry.isFile() && entry.name.endsWith(".png"))
      .map(entry => path.basename(entry.name, ".png")));
  } catch (error) {
    if (error.code === "ENOENT") return new Set();
    throw error;
  }
}

async function loadCustomPages(ctx) {
  const directory = path.join(root, "content/pages");
  let files = [];
  try { files = await readdir(directory, { withFileTypes: true }); } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const pages = [];
  for (const entry of files.filter(item => item.isFile() && item.name.endsWith(".json"))) {
    const slug = path.basename(entry.name, ".json");
    const data = JSON.parse(await readFile(path.join(directory, entry.name), "utf8"));
    const options = contentPage(ctx, data, slug);
    if (!options) throw new Error(`Invalid CMS page: content/pages/${entry.name}`);
    pages.push(options);
  }
  return pages;
}

async function writePage(ctx, options) {
  const route = options.path || "/";
  if (!route.startsWith("/") || route.includes("..")) throw new Error(`Unsafe page route: ${route}`);
  const directory = path.join(output, ...route.split("/").filter(Boolean));
  // Routes ending in .html (such as /404.html) are written as that exact file.
  const target = route === "/" ? path.join(output, "index.html")
    : route.endsWith(".html") ? directory
    : path.join(directory, "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, renderPage(ctx, options), "utf8");
}

async function main() {
  const [packages, projects, services, scorecard, navigation, testimonials, posts, ogImages] = await Promise.all([
    readJson("content/packages.json", { currency: "USD", categories: [], packages: [] }),
    readJson("content/projects.json", []),
    readJson("content/services.json", []),
    readJson("content/scorecard.json", { answers: [], areas: [], bands: [] }),
    readJson("content/navigation.json", {}),
    readJson("content/testimonials.json", { items: [] }),
    loadPosts(),
    loadOgImages()
  ]);
  const ctx = {
    site,
    packages,
    projects,
    services,
    scorecard,
    posts,
    testimonials: Array.isArray(testimonials.items) ? testimonials.items : [],
    navigation,
    ogImages,
    year: new Date().getUTCFullYear(),
    assets: { css: "/assets/site.css", js: "/assets/site.js", scorecard: "/assets/scorecard.js" }
  };

  await mkdir(path.join(output, "assets"), { recursive: true });
  const [baseCss, overridesCss] = await Promise.all([
    readFile(path.join(root, "src/styles/base.css"), "utf8"),
    readFile(path.join(root, "src/styles/overrides.css"), "utf8")
  ]);
  await writeFile(path.join(output, "assets/site.css"), `${baseCss}\n${overridesCss}`, "utf8");
  await cp(path.join(root, "src/brand/brandingdex-logo-original.png"), path.join(output, "assets/brandingdex-logo.png"));
  await cp(path.join(root, "content/scorecard.json"), path.join(output, "assets/scorecard.json"));
  await cp(path.join(root, "src/static"), output, { recursive: true, force: true });

  const templates = [home, portfolio, pricing, servicesPage, about, contact, insights, scorecardPage, legal, notFound];
  const options = templates.flatMap(template => {
    const result = template(ctx);
    return result ? (Array.isArray(result) ? result : [result]) : [];
  });
  options.push(...await loadCustomPages(ctx));

  const paths = new Set();
  for (const pageOptions of options) {
    if (paths.has(pageOptions.path)) throw new Error(`Duplicate page route: ${pageOptions.path}`);
    paths.add(pageOptions.path);
    await writePage(ctx, pageOptions);
  }
  await writeFile(path.join(output, "feed.xml"), rss(ctx), "utf8");
  await writeFile(path.join(output, "sitemap.xml"), sitemap(site, options), "utf8");
  await writeFile(path.join(output, "robots.txt"), robots(site), "utf8");

  console.log(`Built ${options.length} pages into dist/`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
