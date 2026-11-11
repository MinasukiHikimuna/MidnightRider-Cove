// Checks an extension's feature guides the way Cove reads them. Used by each extension's package validator
// and by the documentation site build, so a guide that passes one passes the other.
//
// Cove lists a guide when at least one section has a block it can show and silently drops the rest. This
// check is stricter: it reports every section or block Cove would drop, so nothing an author wrote is lost.
// The block rules follow Cove's normalizer (ui/src/components/featureGuideContent.ts in yourcove/cove).
import fs from "node:fs";
import path from "node:path";

export const MAX_FEATURE_GUIDES = 32;
export const MAX_GUIDE_BYTES = 256 * 1024;

// Cove hides an extension guide whose id belongs to one of its own topics, now or in an earlier version.
const reserved = JSON.parse(fs.readFileSync(new URL("./fixtures/reserved-topic-ids.json", import.meta.url), "utf8"));
const reservedTopicIds = new Set([...reserved.builtinTopicIds, ...reserved.legacyTopicIds]);

const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const isText = value => typeof value === "string" && value.trim() !== "";

/** True when `src` is an image Cove loads from outside the package. */
export function isRemoteImage(src) {
  return /^(?:https:\/\/|data:image\/)/i.test(src);
}

/** True when a package-relative path stays inside the package and names something below its root. */
export function isSafePackagePath(packageRoot, relativePath) {
  if (typeof relativePath !== "string" || !relativePath.trim() || path.isAbsolute(relativePath)) return false;
  const root = path.resolve(packageRoot);
  return path.resolve(root, relativePath).startsWith(`${root}${path.sep}`);
}

/**
 * True when a package-relative path names a regular file inside the package. A symbolic link is refused,
 * even one that points inside the package: the release zip follows links, so it could pull in a file from
 * elsewhere on the build machine.
 */
export function isPackageFile(packageRoot, relativePath) {
  if (!isSafePackagePath(packageRoot, relativePath)) return false;
  const root = path.resolve(packageRoot);
  let current = root;
  for (const segment of path.relative(root, path.resolve(root, relativePath)).split(path.sep)) {
    current = path.join(current, segment);
    let stats;
    try {
      stats = fs.lstatSync(current);
    } catch {
      return false;
    }
    if (stats.isSymbolicLink()) return false;
  }
  return fs.statSync(current).isFile();
}

/**
 * Checks the `featureGuides` list of the extension whose extension.json is in `packageRoot`.
 * Returns the problems found and, for each guide that could be read, its parsed content and the
 * package-relative paths of the images it uses.
 */
export function checkFeatureGuides(packageRoot, featureGuides) {
  const errors = [];
  const guides = [];
  if (featureGuides === undefined) return { errors, guides };
  if (!Array.isArray(featureGuides)) return { errors: ["featureGuides must be an array"], guides };
  // Cove reads only the first 32 listed paths, counting repeats and paths it cannot read.
  if (featureGuides.length > MAX_FEATURE_GUIDES)
    errors.push(`featureGuides lists more than ${MAX_FEATURE_GUIDES} files; Cove ignores the rest`);
  const seenPaths = new Set();
  const seenIds = new Set();
  for (const guidePath of featureGuides) {
    // Cove reads a path listed twice only once, even when it is written differently.
    const normalized = typeof guidePath === "string" ? path.posix.normalize(guidePath) : guidePath;
    if (seenPaths.has(normalized)) {
      errors.push(`featureGuides lists ${guidePath} more than once`);
      continue;
    }
    seenPaths.add(normalized);
    const result = checkFeatureGuide(packageRoot, guidePath);
    errors.push(...result.errors);
    const id = result.guide?.id;
    if (typeof id === "string") {
      if (seenIds.has(id)) errors.push(`feature guide ${guidePath} reuses the id ${id} of an earlier guide, so Cove shows only the first`);
      if (reservedTopicIds.has(id)) errors.push(`feature guide ${guidePath} uses the id ${id}, which Cove keeps for its own User Guide topic, so Cove hides it`);
      seenIds.add(id);
    }
    if (result.guide) guides.push({ path: guidePath, guide: result.guide, images: result.images, valid: result.errors.length === 0 });
  }
  return { errors, guides };
}

function checkFeatureGuide(packageRoot, guidePath) {
  const errors = [];
  const images = [];
  const done = guide => ({ errors, guide, images });
  if (typeof guidePath !== "string" || !guidePath.endsWith(".json")) {
    errors.push(`featureGuides entry must be a .json path: ${guidePath}`);
    return done();
  }
  if (!isSafePackagePath(packageRoot, guidePath)) {
    errors.push(`feature guide ${guidePath} must be a safe relative package path`);
    return done();
  }
  const fullPath = path.join(packageRoot, guidePath);
  if (!isPackageFile(packageRoot, guidePath)) {
    errors.push(`missing declared feature guide ${guidePath}, or it is a symbolic link`);
    return done();
  }
  const fail = message => errors.push(`feature guide ${guidePath} ${message}`);

  let bytes = fs.readFileSync(fullPath);
  if (bytes.length > MAX_GUIDE_BYTES) {
    fail(`is larger than ${MAX_GUIDE_BYTES / 1024} KiB`);
    return done();
  }
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) bytes = bytes.subarray(3);
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    fail("is not valid UTF-8");
    return done();
  }
  let guide;
  try {
    guide = JSON.parse(text);
  } catch (error) {
    fail(`is not valid JSON: ${error.message}`);
    return done();
  }
  if (!guide || typeof guide !== "object" || Array.isArray(guide)) {
    fail("must be a JSON object");
    return done();
  }
  const depth = value => (value && typeof value === "object" ? 1 + Math.max(0, ...Object.values(value).map(depth)) : 0);
  if (depth(guide) > 32) fail("is nested more than 32 levels deep");
  const findMalformed = (value, where) => {
    if (typeof value === "string") {
      if (!value.isWellFormed()) fail(`has an unpaired surrogate escape such as \\ud800 at ${where || "/"}`);
    } else if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) {
        if (!key.isWellFormed()) fail(`has an unpaired surrogate escape such as \\ud800 at ${where}/(key)`);
        findMalformed(child, `${where}/${key}`);
      }
    }
  };
  findMalformed(guide, "");

  if (guide.schemaVersion !== 1) fail("must use schemaVersion 1");
  if (typeof guide.id !== "string" || !slug.test(guide.id)) fail("needs a kebab-case id");
  for (const field of ["title", "description"]) if (!isText(guide[field])) fail(`needs a ${field}`);
  if (!Number.isInteger(guide.order) || guide.order < 0) fail("needs a non-negative integer order");
  if (guide.parentTopicId !== undefined && (typeof guide.parentTopicId !== "string" || !slug.test(guide.parentTopicId)))
    fail("has a parentTopicId that is not a kebab-case topic id, so Cove lists it at the top level");
  if (!Array.isArray(guide.sections) || guide.sections.length === 0) {
    fail("needs at least one section");
    return done();
  }

  const guideDirectory = path.posix.dirname(guidePath);
  // Returns why Cove would drop the block, or null when it renders it.
  const blockProblem = (block, allowRecipes) => {
    if (!block || typeof block !== "object" || Array.isArray(block)) return "is not an object";
    switch (block.type) {
      case "paragraph":
      case "note":
        return isText(block.text) ? null : "has no text";
      case "steps":
      case "list":
        if (!Array.isArray(block.items) || !block.items.some(isText)) return "has no item with text";
        return block.items.every(isText) ? null : "has an item without text, which Cove drops";
      case "heading":
        return (block.level === 3 || block.level === 4) && isText(block.text) ? null : "needs text and level 3 or 4";
      case "links": {
        const items = Array.isArray(block.items) ? block.items : [];
        const valid = item => isText(item?.label) && typeof item?.href === "string" && /^(?:\/docs\/|https?:\/\/)/.test(item.href);
        if (!items.some(valid)) return "has no link with a label and an href starting with /docs/ or https://";
        return items.every(valid) ? null : "has a link without a label or with an href Cove does not open";
      }
      case "image": {
        if (!isText(block.alt)) return "has no alt text";
        if (typeof block.src !== "string" || !block.src) return "has no src";
        if (isRemoteImage(block.src)) return null;
        if (block.src.startsWith("/") || hasScheme.test(block.src)) return "needs an https:// src or a path inside the package";
        const imagePath = path.posix.normalize(path.posix.join(guideDirectory, block.src));
        if (!isSafePackagePath(packageRoot, imagePath)) return "needs an https:// src or a path inside the package";
        if (!isPackageFile(packageRoot, imagePath)) return `uses ${imagePath}, which is not a file in the package`;
        images.push(imagePath);
        return null;
      }
      case "table": {
        const columns = Array.isArray(block.columns) ? block.columns.filter(isText) : [];
        const rows = Array.isArray(block.rows) ? block.rows : [];
        const fits = row => Array.isArray(row) && row.length === columns.length && row.every(cell => typeof cell === "string");
        if (columns.length === 0 || !rows.some(fits)) return "needs columns and a row of text for each column";
        return rows.every(fits) ? null : "has a row Cove drops because it does not have one text cell per column";
      }
      case "code":
        return Array.isArray(block.lines) && block.lines.length > 0 && block.lines.every(line => typeof line === "string")
          ? null
          : "needs one or more lines of text";
      case "recipes": {
        if (!allowRecipes) return "is a recipe list inside a recipe, which Cove does not show";
        const items = Array.isArray(block.items) ? block.items : [];
        if (items.length === 0) return "has no recipes";
        for (const [index, recipe] of items.entries()) {
          if (typeof recipe?.id !== "string" || !slug.test(recipe.id) || !isText(recipe?.title) || !Array.isArray(recipe?.blocks))
            return `has recipe ${index + 1} without a kebab-case id, a title, and blocks`;
          const problems = checkBlocks(recipe.blocks, false);
          if (problems.length) return `has recipe ${recipe.id} whose ${problems.join("; ")}`;
        }
        return null;
      }
      default:
        return `has type ${JSON.stringify(block.type)}, which Cove does not show`;
    }
  };
  const checkBlocks = (blocks, allowRecipes) => {
    if (blocks.length === 0) return ["section has no blocks"];
    return blocks.flatMap((block, index) => {
      const problem = blockProblem(block, allowRecipes);
      return problem ? [`block ${index + 1} (${block?.type ?? "untyped"}) ${problem}`] : [];
    });
  };
  const sectionIds = new Set();
  for (const [index, section] of guide.sections.entries()) {
    if (typeof section?.id !== "string" || !slug.test(section.id) || !isText(section?.title) || !Array.isArray(section?.blocks)) {
      fail(`has section ${index + 1} without a kebab-case id, a title, and blocks`);
      continue;
    }
    if (sectionIds.has(section.id)) fail(`repeats section id ${section.id}, so links to it open the first one`);
    sectionIds.add(section.id);
    for (const problem of checkBlocks(section.blocks, true)) fail(`section ${section.id}: ${problem}`);
  }
  return done(guide);
}
