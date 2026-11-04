import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const [packageRootArg, expectedVersion, expectedExtensionId] = process.argv.slice(2);
if (!packageRootArg || !expectedVersion) {
  console.error("Usage: node scripts/validate-extension-package.mjs <package-root> <expected-version> [expected-extension-id]");
  process.exit(2);
}

const packageRoot = path.resolve(packageRootArg);
const required = ["extension.json", "README.md", "LICENSE"];
const forbiddenAssemblyNames = new Set([
  "Cove.Core.dll",
  "Cove.Plugins.dll",
  "Cove.Sdk.dll",
  "Microsoft.EntityFrameworkCore.dll",
  "Microsoft.EntityFrameworkCore.Abstractions.dll",
  "Microsoft.EntityFrameworkCore.Relational.dll",
  "Npgsql.dll",
  "Npgsql.EntityFrameworkCore.PostgreSQL.dll",
  "Pgvector.dll",
  "Pgvector.EntityFrameworkCore.dll",
]);
const errors = [];

function isSafePackagePath(relativePath) {
  if (typeof relativePath !== "string" || !relativePath.trim() || path.isAbsolute(relativePath)) return false;
  const resolved = path.resolve(packageRoot, relativePath);
  return resolved === packageRoot || resolved.startsWith(`${packageRoot}${path.sep}`);
}

function validateDeclaredFile(label, relativePath) {
  if (!isSafePackagePath(relativePath)) {
    errors.push(`${label} must be a safe relative package path`);
    return;
  }
  if (!fs.existsSync(path.join(packageRoot, relativePath))) errors.push(`missing declared ${label} ${relativePath}`);
}

function walkFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(entryPath));
    else if (entry.isFile()) files.push(entryPath);
  }
  return files;
}

if (!fs.existsSync(packageRoot) || !fs.statSync(packageRoot).isDirectory()) {
  console.error(`ERROR: package root does not exist: ${packageRoot}`);
  process.exit(1);
}

const entries = fs.readdirSync(packageRoot, { withFileTypes: true });
for (const requiredFile of required) {
  if (!entries.some(entry => entry.isFile() && entry.name === requiredFile))
    errors.push(`missing required root file ${requiredFile}`);
}

for (const filePath of walkFiles(packageRoot)) {
  const fileName = path.basename(filePath);
  if (forbiddenAssemblyNames.has(fileName)) errors.push(`host-provided assembly must not be packaged: ${fileName}`);
}

const manifestPath = path.join(packageRoot, "extension.json");
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!manifest.id) errors.push("manifest id is missing");
  if (expectedExtensionId && manifest.id !== expectedExtensionId) {
    errors.push(`manifest id is ${manifest.id}, expected ${expectedExtensionId}`);
  }
  if (manifest.version !== expectedVersion) errors.push(`manifest version is ${manifest.version}, expected ${expectedVersion}`);
  if (manifest.entryDll) validateDeclaredFile("entryDll", manifest.entryDll);
  if (manifest.jsBundle) validateDeclaredFile("jsBundle", manifest.jsBundle);
  if (manifest.cssBundle) validateDeclaredFile("cssBundle", manifest.cssBundle);
  if (manifest.featureGuides !== undefined && !Array.isArray(manifest.featureGuides)) errors.push("featureGuides must be an array");
  // Cove reads only the first 32 listed paths, counting repeats and paths it cannot read.
  if (Array.isArray(manifest.featureGuides) && manifest.featureGuides.length > 32) errors.push("featureGuides lists more than 32 files; Cove ignores the rest");
  for (const guidePath of Array.isArray(manifest.featureGuides) ? manifest.featureGuides : []) {
    validateFeatureGuide(guidePath);
  }
}

// Mirrors what Cove requires before it shows a feature guide, and checks that every packaged image exists.
// Cove lists a guide when at least one section has a block it can show and silently drops the rest; this
// check is stricter and reports every section or block Cove would drop, so nothing an author wrote is lost.
function validateFeatureGuide(guidePath) {
  if (typeof guidePath !== "string" || !guidePath.endsWith(".json")) {
    errors.push(`featureGuides entry must be a .json path: ${guidePath}`);
    return;
  }
  validateDeclaredFile("feature guide", guidePath);
  const fullPath = path.join(packageRoot, guidePath);
  if (!isSafePackagePath(guidePath) || !fs.existsSync(fullPath)) return;
  const fail = message => errors.push(`feature guide ${guidePath} ${message}`);

  let bytes = fs.readFileSync(fullPath);
  if (bytes.length > 256 * 1024) {
    fail("is larger than 256 KiB");
    return;
  }
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) bytes = bytes.subarray(3);
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    fail("is not valid UTF-8");
    return;
  }
  let guide;
  try {
    guide = JSON.parse(text);
  } catch (error) {
    fail(`is not valid JSON: ${error.message}`);
    return;
  }
  if (!guide || typeof guide !== "object" || Array.isArray(guide)) {
    fail("must be a JSON object");
    return;
  }
  const depth = value => (value && typeof value === "object" ? 1 + Math.max(0, ...Object.values(value).map(depth)) : 0);
  if (depth(guide) > 32) fail("is nested more than 32 levels deep");
  const malformed = [];
  const findMalformed = (value, where) => {
    if (typeof value === "string") {
      if (!value.isWellFormed()) malformed.push(where);
    } else if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) {
        if (!key.isWellFormed()) malformed.push(`${where}/(key)`);
        findMalformed(child, `${where}/${key}`);
      }
    }
  };
  findMalformed(guide, "");
  for (const where of malformed) fail(`has an unpaired surrogate escape such as \\ud800 at ${where || "/"}`);

  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const isText = value => typeof value === "string" && value.trim() !== "";
  if (guide.schemaVersion !== 1) fail("must use schemaVersion 1");
  if (typeof guide.id !== "string" || !slug.test(guide.id)) fail("needs a kebab-case id");
  for (const field of ["title", "description"]) if (!isText(guide[field])) fail(`needs a ${field}`);
  if (!Number.isInteger(guide.order) || guide.order < 0) fail("needs a non-negative integer order");
  if (guide.parentTopicId !== undefined && (typeof guide.parentTopicId !== "string" || !slug.test(guide.parentTopicId)))
    fail("has a parentTopicId that is not a kebab-case topic id, so Cove lists it at the top level");
  if (!Array.isArray(guide.sections) || guide.sections.length === 0) {
    fail("needs at least one section");
    return;
  }

  const guideDirectory = path.posix.dirname(guidePath);
  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
  const isRemoteImage = src => /^(?:https:\/\/|data:image\/)/i.test(src);
  // Returns why Cove would drop the block, or null when it renders it.
  const blockProblem = (block, allowRecipes) => {
    if (!block || typeof block !== "object" || Array.isArray(block)) return "is not an object";
    switch (block.type) {
      case "paragraph":
      case "note":
        return isText(block.text) ? null : "has no text";
      case "steps":
      case "list":
        return Array.isArray(block.items) && block.items.some(isText) ? null : "has no item with text";
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
        validateDeclaredFile(`feature guide image in ${guidePath}`, path.posix.normalize(path.posix.join(guideDirectory, block.src)));
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
}

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(`Validated extension package ${expectedExtensionId ?? "from manifest"} ${expectedVersion} at ${packageRoot}.`);
