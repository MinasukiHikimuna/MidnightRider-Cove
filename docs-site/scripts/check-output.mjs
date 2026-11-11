// Checks the built site in dist/: every link and image that points into the site resolves to a built file,
// and, when the build included the renderer fixture (collect --renderer-fixture), every block Cove renders
// appears on the fixture page as the element it should be.
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(siteRoot, "dist");
const config = JSON.parse(fs.readFileSync(path.join(siteRoot, "site.config.json"), "utf8"));
const base = process.env.DOCS_SITE_BASE ?? config.base;

export function walk(node, visit) {
  visit(node);
  for (const child of node.childNodes ?? []) walk(child, visit);
  if (node.content) walk(node.content, visit);
}

export const attribute = (node, name) => node.attrs?.find(attr => attr.name === name)?.value;

export function textOf(node) {
  let text = "";
  walk(node, child => {
    if (child.nodeName === "#text") text += child.value;
  });
  return text;
}

/** Problems with links and images in one page that point into the site but match no built file. */
export function brokenReferences(html, page, exists) {
  const problems = [];
  walk(parse(html), node => {
    const reference = node.tagName === "a" ? attribute(node, "href") : node.tagName === "img" ? attribute(node, "src") : undefined;
    if (!reference || /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(reference)) return;
    const url = new URL(reference, `https://site.invalid/${page}`);
    if (!url.pathname.startsWith(base)) {
      problems.push(`${page}: ${reference} is outside the site's base ${base}`);
      return;
    }
    let relative;
    try {
      relative = decodeURIComponent(url.pathname.slice(base.length));
    } catch {
      problems.push(`${page}: ${reference} is not a valid URL`);
      return;
    }
    if (!exists(relative) && !exists(path.posix.join(relative, "index.html"))) problems.push(`${page}: ${reference} does not exist`);
  });
  return problems;
}

// The element each fixture block must render as, found inside its section.
const expectedElement = {
  paragraph: section => find(section, "p"),
  note: section => find(section, "aside"),
  steps: section => find(section, "li", node => node.parentNode?.tagName === "ol"),
  list: section => find(section, "li", node => node.parentNode?.tagName === "ul"),
  heading: section => find(section, "h3") ?? find(section, "h4"),
  links: section => find(section, "a", node => attribute(node, "data-feature-guide-link") !== undefined),
  image: section => find(section, "img"),
  // Every row has one cell per column, as Cove shows it; a short row is one Cove drops.
  table: section => {
    const columns = collect(section, "th").length;
    const rows = collect(section, "tr").filter(row => collect(row, "td").length > 0);
    return rows.length > 0 && rows.every(row => collect(row, "td").length === columns) ? rows[0] : undefined;
  },
  code: section => find(section, "code"),
  recipes: section => find(section, "details"),
};

function find(root, tagName, predicate = () => true) {
  let found;
  walk(root, node => {
    if (!found && node.tagName === tagName && predicate(node)) found = node;
  });
  return found;
}

/** Problems with the renderer fixture page: a block Cove renders that is missing, or a dropped part shown. */
export function rendererProblems(html, fixture) {
  const problems = [];
  const sections = new Map();
  walk(parse(html), node => {
    if (node.tagName === "section" && attribute(node, "aria-labelledby")?.startsWith("case-")) sections.set(attribute(node, "aria-labelledby"), node);
  });
  fixture.cases
    .filter(blockCase => blockCase.renderable)
    .forEach((blockCase, index) => {
      const section = sections.get(`case-${index + 1}`);
      if (!section) {
        problems.push(`renderer fixture: "${blockCase.name}" has no section`);
        return;
      }
      const element = expectedElement[blockCase.block.type]?.(section);
      if (!element) problems.push(`renderer fixture: "${blockCase.name}" did not render as a ${blockCase.block.type} block`);
      for (const link of collect(section, "a")) {
        const href = attribute(link, "href") ?? "";
        if (!/^https?:\/\//.test(href)) problems.push(`renderer fixture: "${blockCase.name}" shows a link Cove drops: ${href}`);
      }
      if (blockCase.block.type === "steps" || blockCase.block.type === "list")
        for (const item of collect(section, "li")) if (!textOf(item).trim()) problems.push(`renderer fixture: "${blockCase.name}" shows an empty item`);
    });
  return problems;
}

function collect(root, tagName) {
  const found = [];
  walk(root, node => {
    if (node.tagName === tagName) found.push(node);
  });
  return found;
}

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(fullPath);
    return entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const exists = relative => fs.existsSync(path.join(distDir, relative)) && fs.statSync(path.join(distDir, relative)).isFile();
  const problems = [];
  const files = htmlFiles(distDir);
  for (const file of files) {
    const page = path.relative(distDir, file).split(path.sep).join("/");
    const pageUrl = `${base.replace(/^\//, "")}${page.replace(/index\.html$/, "")}`;
    problems.push(...brokenReferences(fs.readFileSync(file, "utf8"), pageUrl, exists));
  }
  const fixturePage = path.join(distDir, "renderer-fixture", "every-block", "index.html");
  if (fs.existsSync(fixturePage)) {
    const fixture = JSON.parse(fs.readFileSync(path.join(siteRoot, "..", "scripts", "feature-guides", "fixtures", "extension-guide-blocks.json"), "utf8"));
    problems.push(...rendererProblems(fs.readFileSync(fixturePage, "utf8"), fixture));
  }
  if (problems.length > 0) {
    for (const problem of problems) console.error(`ERROR: ${problem}`);
    process.exit(1);
  }
  console.log(`Checked ${files.length} pages${fs.existsSync(fixturePage) ? " and the renderer fixture" : ""}.`);
}
