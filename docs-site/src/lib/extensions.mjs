// The extensions scripts/collect.mjs gathered, shared by astro.config.mjs (for the sidebar) and the pages.
import fs from "node:fs";
import path from "node:path";

// Resolved from the working directory, not this file, because Astro bundles the pages elsewhere before
// rendering them. The npm scripts run in docs-site/.
const generated = path.resolve(process.cwd(), ".generated", "extensions.json");

/** Every collected extension, sorted by name. Run `npm run collect` first. */
export function loadExtensions() {
  if (!fs.existsSync(generated)) throw new Error("Run `npm run collect` (or `npm run dev`) before building the site.");
  return JSON.parse(fs.readFileSync(generated, "utf8"));
}

/**
 * An extension's guides as a two-level tree, nested by parentTopicId the way Cove's User Guide nests them.
 * A guide whose parent is not one of the extension's guides (such as a built-in Cove topic), or whose parent
 * chain loops back to it, is listed at the top level. A guide below a child guide is listed under that
 * child's top-level guide.
 */
export function guideTree(guides) {
  const byId = new Map(guides.map(guide => [guide.id, guide]));
  const parentOf = guide => byId.get(guide.parentTopicId);
  // Find every guide in a loop before detaching any, so detaching one does not hide another.
  const inLoop = new Set(
    guides.filter(guide => {
      const seen = new Set();
      for (let current = parentOf(guide); current && !seen.has(current.id); current = parentOf(current)) {
        if (current === guide) return true;
        seen.add(current.id);
      }
      return false;
    }),
  );
  const effectiveParent = guide => (inLoop.has(guide) ? undefined : parentOf(guide));
  const topLevelOf = guide => {
    let current = guide;
    while (effectiveParent(current)) current = effectiveParent(current);
    return current;
  };
  const byOrder = (a, b) => a.order - b.order || a.title.localeCompare(b.title);
  const topLevel = [];
  const children = new Map();
  for (const guide of guides) {
    const top = topLevelOf(guide);
    if (top === guide) topLevel.push(guide);
    else children.set(top.id, [...(children.get(top.id) ?? []), guide]);
  }
  return topLevel.sort(byOrder).map(guide => ({ guide, children: (children.get(guide.id) ?? []).sort(byOrder) }));
}

export const extensionPath = extension => `${extension.slug}/`;
export const guidePath = (extension, guide) => `${extension.slug}/${guide.id}/`;
