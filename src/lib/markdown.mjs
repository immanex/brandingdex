// A small Markdown reader for articles, legal pages and text sections.
// It understands what the admin's text editor writes: headings, paragraphs, bullet and numbered
// lists (including nested ones), quotes, images, tables, code, rules, **bold**, *italic* / _italic_,
// ~~strikethrough~~ and [links](url).

import { esc, slugify } from "./html.mjs";

const safeLink = link => /^(\/|#|\?|https?:\/\/|mailto:|tel:)/i.test(link);
const external = link => /^https?:\/\//i.test(link);

export function inline(text) {
  const stash = [];
  const keep = html => "\u0000" + (stash.push(html) - 1) + "\u0000";
  const linkOpen = link => keep('<a href="' + link + '"' + (external(link) ? ' target="_blank" rel="noopener"' : "") + ">");

  let out = String(text ?? "")
    .replace(/\\([\\`*_{}[\]()#+\-.!~|<>])/g, (whole, char) => keep(esc(char)))
    .replace(/`([^`]+)`/g, (whole, code) => keep("<code>" + esc(code) + "</code>"));

  out = esc(out)
    .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;(.*?)&quot;)?\)/g, (whole, alt, src) =>
      safeLink(src) ? keep('<img src="' + src + '" alt="' + alt + '" loading="lazy">') : alt)
    .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;.*?&quot;)?\)/g, (whole, label, link) =>
      safeLink(link) ? linkOpen(link) + label + keep("</a>") : label)
    .replace(/&lt;(https?:\/\/[^\s<>]+?)&gt;/g, (whole, link) => linkOpen(link) + keep(link) + keep("</a>"))
    .replace(/\*\*(?!\s)(.+?)(?<!\s)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<![A-Za-z0-9_])__(?!\s)(.+?)(?<!\s)__(?![A-Za-z0-9_])/g, "<strong>$1</strong>")
    .replace(/(?<![*\\])\*(?![\s*])(.+?)(?<![\s*])\*(?!\*)/g, "<em>$1</em>")
    .replace(/(?<![A-Za-z0-9_])_(?![\s_])(.+?)(?<![\s_])_(?![A-Za-z0-9_])/g, "<em>$1</em>")
    .replace(/~~(?!\s)(.+?)(?<!\s)~~/g, "<del>$1</del>");

  return out.replace(/\u0000(\d+)\u0000/g, (whole, index) => stash[Number(index)]);
}

const lines = text => inline(text).replace(/ *\\?\n/g, "<br>\n");

// Short text boxes: a blank line starts a new paragraph, a single new line becomes a line break.
export function paragraphs(text) {
  return String(text ?? "").replace(/\r\n/g, "\n").split(/\n\s*\n/).map(part => part.trim()).filter(Boolean)
    .map(part => "<p>" + lines(part) + "</p>").join("\n");
}

// The same text with the Markdown symbols removed, for search-engine data and email.
export function plain(text) {
  return String(text ?? "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|~~|`)/g, "")
    .replace(/(?<![A-Za-z0-9])[*_](?=\S)|(?<=\S)[*_](?![A-Za-z0-9])/g, "")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+[.)])\s+/gm, "")
    .replace(/\s+/g, " ").trim();
}

const RULE = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/;
const HEADING = /^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const FENCE = /^ {0,3}(```+|~~~+)\s*([\w-]*)\s*$/;
const QUOTE = /^ {0,3}>\s?/;
const ITEM = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/;
const TABLE_DIVIDER = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;
const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"(.*?)")?\)$/;

const indentOf = line => /^\s*/.exec(line)[0].replace(/\t/g, "    ").length;
const cells = row => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(cell => cell.trim());

function blocks(source, state) {
  const rows = source;
  const out = [];
  let i = 0;

  const startsBlock = line => HEADING.test(line) || RULE.test(line) || FENCE.test(line) || QUOTE.test(line) || ITEM.test(line);

  while (i < rows.length) {
    const line = rows[i];
    if (!line.trim()) { i++; continue; }

    const fence = FENCE.exec(line);
    if (fence) {
      const code = [];
      i++;
      while (i < rows.length && !new RegExp("^ {0,3}" + fence[1][0] + "{" + fence[1].length + ",}\\s*$").test(rows[i])) code.push(rows[i++]);
      i++;
      out.push("<pre><code>" + esc(code.join("\n")) + "</code></pre>");
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      // The page already has its one main heading, so "#" in an article starts at the second level.
      const level = Math.max(2, heading[1].length);
      let id = slugify(heading[2]) || "section";
      const seen = state.ids.get(id) || 0;
      state.ids.set(id, seen + 1);
      if (seen) id += "-" + (seen + 1);
      out.push("<h" + level + ' id="' + id + '">' + inline(heading[2]) + "</h" + level + ">");
      i++;
      continue;
    }

    if (RULE.test(line)) { out.push("<hr>"); i++; continue; }

    if (QUOTE.test(line)) {
      const inner = [];
      while (i < rows.length && rows[i].trim() && (QUOTE.test(rows[i]) || !startsBlock(rows[i]))) inner.push(rows[i++].replace(QUOTE, ""));
      out.push("<blockquote>" + blocks(inner, state) + "</blockquote>");
      continue;
    }

    if (ITEM.test(line)) {
      out.push(listBlock());
      continue;
    }

    if (line.includes("|") && i + 1 < rows.length && TABLE_DIVIDER.test(rows[i + 1]) && rows[i + 1].includes("-")) {
      const head = cells(line);
      i += 2;
      const body = [];
      while (i < rows.length && rows[i].trim() && rows[i].includes("|")) body.push(cells(rows[i++]));
      out.push('<div class="table-wrap"><table><thead><tr>' + head.map(cell => "<th>" + inline(cell) + "</th>").join("") + "</tr></thead><tbody>" +
        body.map(row => "<tr>" + head.map((cell, column) => "<td>" + inline(row[column] || "") + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>");
      continue;
    }

    const image = IMAGE_LINE.exec(line.trim());
    if (image && safeLink(image[2])) {
      out.push('<figure><img src="' + esc(image[2]) + '" alt="' + esc(image[1]) + '" loading="lazy">' + (image[3] ? "<figcaption>" + inline(image[3]) + "</figcaption>" : "") + "</figure>");
      i++;
      continue;
    }

    const text = [];
    while (i < rows.length && rows[i].trim() && (text.length === 0 || !startsBlock(rows[i]))) text.push(rows[i++].trim().replace(/\s{2,}$/, ""));
    out.push("<p>" + lines(text.join("\n")) + "</p>");
  }
  return out.join("\n");

  function listBlock() {
    const base = indentOf(rows[i]);
    const ordered = /\d/.test(ITEM.exec(rows[i])[2]);
    const start = ordered ? Number(/\d+/.exec(ITEM.exec(rows[i])[2])[0]) : 1;
    const items = [];

    while (i < rows.length) {
      const match = ITEM.exec(rows[i]);
      if (!match || indentOf(rows[i]) !== base || /\d/.test(match[2]) !== ordered) break;
      const first = match[3];
      const rest = [];
      i++;
      while (i < rows.length) {
        const blank = !rows[i].trim();
        if (blank) {
          // A blank line only stays inside the item when more indented text follows it.
          let next = i + 1;
          while (next < rows.length && !rows[next].trim()) next++;
          if (next >= rows.length || indentOf(rows[next]) <= base) break;
          rest.push("");
          i++;
        } else if (indentOf(rows[i]) > base) {
          rest.push(rows[i++]);
        } else {
          break;
        }
      }
      const filled = rest.filter(row => row.trim());
      const dedent = filled.length ? Math.min(...filled.map(indentOf)) : 0;
      const inner = rest.map(row => row.replace(/\t/g, "    ").slice(Math.min(dedent, indentOf(row))));
      // Plain follow-on lines belong to the item's own sentence; anything else is nested content.
      let lead = first;
      while (inner.length && inner[0].trim() && !startsBlock(inner[0])) lead += "\n" + inner.shift().trim();
      const nested = inner.some(row => row.trim()) ? "\n" + blocks(inner, state) : "";
      items.push("<li>" + lines(lead) + nested + "</li>");
      while (i < rows.length && !rows[i].trim()) {
        let next = i + 1;
        while (next < rows.length && !rows[next].trim()) next++;
        if (next < rows.length && ITEM.test(rows[next]) && indentOf(rows[next]) === base) i = next; else break;
      }
    }
    const tag = ordered ? "ol" : "ul";
    return "<" + tag + (ordered && start !== 1 ? ' start="' + start + '"' : "") + ">" + items.join("") + "</" + tag + ">";
  }
}

export function markdown(source) {
  return blocks(String(source ?? "").replace(/\r\n?/g, "\n").split("\n"), { ids: new Map() });
}

export const readingMinutes = text => Math.max(1, Math.round(String(text ?? "").split(/\s+/).filter(Boolean).length / 220));
