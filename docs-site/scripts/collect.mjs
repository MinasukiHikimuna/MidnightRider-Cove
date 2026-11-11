// Collects what the site publishes for each extension into .generated/extensions.json and copies the
// images its guides use into public/extensions/. By default every extension is read from its newest stable
// release tag, so the site shows what users can install.
//
//   node scripts/collect.mjs                          newest stable release tag of each extension
//   node scripts/collect.mjs --published-tags FILE    only tags listed in FILE, one per line (CI passes the
//                                                     tags that have a published GitHub release)
//   node scripts/collect.mjs --working-tree           the files as they are now, for pull requests and dev
//   node scripts/collect.mjs --renderer-fixture       also add a page with every block Cove renders, which
//                                                     scripts/check-output.mjs checks
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { checkFeatureGuides, isRemoteImage } from "../../scripts/feature-guides/check-feature-guides.mjs";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(siteRoot, "..");
const generatedDir = path.join(siteRoot, ".generated");
const publicDir = path.join(siteRoot, "public", "extensions");
const config = JSON.parse(fs.readFileSync(path.join(siteRoot, "site.config.json"), "utf8"));

const args = process.argv.slice(2);
const workingTree = args.includes("--working-tree");
const rendererFixture = args.includes("--renderer-fixture");
const publishedTagsIndex = args.indexOf("--published-tags");
if (publishedTagsIndex >= 0 && !args[publishedTagsIndex + 1]) {
  console.error("ERROR: --published-tags needs a file listing one tag per line");
  process.exit(2);
}
const publishedTags =
  publishedTagsIndex >= 0
    ? new Set(fs.readFileSync(args[publishedTagsIndex + 1], "utf8").split(/\r?\n/).map(line => line.trim()).filter(Boolean))
    : undefined;

const git = (...gitArgs) => execFileSync("git", gitArgs, { cwd: repoRoot, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });

function compareVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let index = 0; index < 3; index++) if (pa[index] !== pb[index]) return pa[index] - pb[index];
  return 0;
}

/** The newest stable release tag for a tag prefix, such as com.midnightrider.hash-the-cove/v1.1.0. */
function latestTag(tagPrefix) {
  const versions = git("tag", "--list", `${tagPrefix}v*`)
    .split("\n")
    .filter(Boolean)
    .filter(tag => !publishedTags || publishedTags.has(tag))
    .map(tag => ({ tag, version: tag.slice(tagPrefix.length + 1) }))
    .filter(({ version }) => /^\d+\.\d+\.\d+$/.test(version));
  versions.sort((a, b) => compareVersions(b.version, a.version));
  return versions[0]?.tag;
}

const existsAtTag = (tag, repoPath) => {
  try {
    execFileSync("git", ["cat-file", "-e", `${tag}:${repoPath}`], { cwd: repoRoot, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

/**
 * The extension's files as its release package lays them out (see "Assemble package" in
 * .github/workflows/build.yml): the manifest as extension.json, and the release.json `docs` folder as docs/.
 * Read from `tag`, or from the working tree when there is no tag.
 */
function packageView(directory, descriptor, tag) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "docs-site-collect-"));
  const view = path.join(root, "package");
  fs.mkdirSync(view);
  const sources = [
    [descriptor.manifest, "extension.json"],
    ...(descriptor.docs ? [[descriptor.docs, "docs"]] : []),
  ].map(([source, target]) => [path.posix.join("extensions", directory, source), target]);
  let sourceRoot = repoRoot;
  if (tag) {
    const present = sources.map(([source]) => source).filter(source => existsAtTag(tag, source));
    sourceRoot = path.join(root, "tag");
    fs.mkdirSync(sourceRoot);
    if (present.length > 0) {
      const archive = execFileSync("git", ["archive", "--format=tar", tag, "--", ...present], { cwd: repoRoot, maxBuffer: 256 * 1024 * 1024 });
      execFileSync("tar", ["-x", "-C", sourceRoot], { input: archive });
    }
  }
  for (const [source, target] of sources) {
    const from = path.join(sourceRoot, source);
    // Symbolic links stay links, so the guide check refuses them instead of following them.
    if (fs.existsSync(from)) fs.cpSync(from, path.join(view, target), { recursive: true, verbatimSymlinks: true });
  }
  return { root, view };
}

/** The release descriptor as it was at the tag, so a later rename on main does not break older releases. */
function descriptorAt(directory, tag, current) {
  const repoPath = `extensions/${directory}/release.json`;
  if (!tag || !existsAtTag(tag, repoPath)) return current;
  return { ...JSON.parse(git("show", `${tag}:${repoPath}`)), tagPrefix: current.tagPrefix };
}

/** Points package images at the copies under public/extensions/<slug>/, relative to the site's base. */
function rewriteImages(blocks, guideDirectory, slug) {
  for (const block of blocks) {
    if (block?.type === "image" && typeof block.src === "string" && !isRemoteImage(block.src))
      block.src = imageUrl(slug, path.posix.normalize(path.posix.join(guideDirectory, block.src)));
    if (block?.type === "recipes") for (const recipe of block.items ?? []) rewriteImages(recipe.blocks ?? [], guideDirectory, slug);
  }
}

// Each path segment is encoded, as Cove does, so a file named "step#1.webp" or "100%.webp" still loads.
const imageUrl = (slug, packagePath) => `extensions/${slug}/${packagePath.split("/").map(encodeURIComponent).join("/")}`;

fs.rmSync(generatedDir, { recursive: true, force: true });
fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(generatedDir, { recursive: true });

const errors = [];
const extensions = [];
for (const directory of fs.readdirSync(path.join(repoRoot, "extensions")).sort()) {
  const descriptorPath = path.join(repoRoot, "extensions", directory, "release.json");
  if (!fs.existsSync(descriptorPath)) continue;
  const tag = workingTree ? undefined : latestTag(JSON.parse(fs.readFileSync(descriptorPath, "utf8")).tagPrefix);
  if (!workingTree && !tag) continue; // Not released yet.
  const descriptor = descriptorAt(directory, tag, JSON.parse(fs.readFileSync(descriptorPath, "utf8")));
  const { root, view } = packageView(directory, descriptor, tag);
  try {
    const where = `${directory}${tag ? ` at ${tag}` : ""}`;
    if (!fs.existsSync(path.join(view, "extension.json"))) {
      errors.push(`${where}: has no manifest at ${descriptor.manifest}`);
      continue;
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(view, "extension.json"), "utf8"));
    const result = checkFeatureGuides(view, manifest.featureGuides);
    errors.push(...result.errors.map(error => `${where}: ${error}`));

    const guides = [];
    // A guide with problems fails the build below; its content is not used.
    for (const { path: guidePath, guide, images } of result.guides.filter(guide => guide.valid)) {
      for (const image of images) {
        const target = path.join(publicDir, directory, image);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(path.join(view, image), target);
      }
      const guideDirectory = path.posix.dirname(guidePath);
      for (const section of guide.sections) rewriteImages(section.blocks, guideDirectory, directory);
      guides.push(guide);
    }

    extensions.push({
      slug: directory,
      id: manifest.id,
      name: manifest.name,
      description: manifest.description ?? "",
      version: manifest.version,
      minCoveVersion: manifest.minCoveVersion ?? null,
      tag: tag ?? null,
      readmeUrl: `${config.repository}/blob/${tag ?? "main"}/extensions/${directory}/${descriptor.readme}`,
      developerTool: config.developerTools.includes(manifest.id),
      guides,
    });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

if (!workingTree && extensions.length === 0) errors.push("found no released extension; publishing would empty the site");

if (rendererFixture) extensions.push(rendererFixtureExtension());

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

extensions.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(path.join(generatedDir, "extensions.json"), `${JSON.stringify(extensions, null, 2)}\n`);
const guideCount = extensions.reduce((count, extension) => count + extension.guides.length, 0);
console.log(`Collected ${extensions.length} extensions and ${guideCount} guides${workingTree ? " from the working tree" : " from release tags"}.`);

// One section per block Cove renders, from Cove's own list of block cases. scripts/check-output.mjs checks
// that each one is on the page.
function rendererFixtureExtension() {
  const fixture = JSON.parse(fs.readFileSync(path.join(repoRoot, "scripts", "feature-guides", "fixtures", "extension-guide-blocks.json"), "utf8"));
  // A 1×1 transparent PNG, standing in for each packaged image.
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
  const slug = "renderer-fixture";
  const guideDirectory = path.posix.dirname(fixture.guidePath);
  const sections = fixture.cases
    .filter(blockCase => blockCase.renderable)
    .map((blockCase, index) => {
      const block = structuredClone(blockCase.block);
      if (block.type === "image" && !isRemoteImage(block.src)) {
        const image = path.posix.normalize(path.posix.join(guideDirectory, block.src));
        const target = path.join(publicDir, slug, image);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, png);
      }
      rewriteImages([block], guideDirectory, slug);
      return { id: `case-${index + 1}`, title: blockCase.name, blocks: [block] };
    });
  return {
    slug,
    id: "renderer-fixture",
    name: "Renderer fixture",
    description: "Every block Cove renders, for scripts/check-output.mjs.",
    version: "0.0.0",
    minCoveVersion: null,
    tag: null,
    readmeUrl: config.repository,
    developerTool: true,
    guides: [{ schemaVersion: 1, id: "every-block", title: "Every block", description: "Every block Cove renders.", order: 0, sections }],
  };
}
