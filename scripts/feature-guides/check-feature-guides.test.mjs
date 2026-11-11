// Run with: node --test scripts/feature-guides/
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";
import { checkFeatureGuides, isRemoteImage } from "./check-feature-guides.mjs";

const fixture = JSON.parse(fs.readFileSync(new URL("./fixtures/extension-guide-blocks.json", import.meta.url), "utf8"));

// Blocks Cove shows but this check reports anyway, because Cove would silently drop part of them.
const stricterThanCove = new Map([
  ["https link beside an invalid one", "Cove drops the invalid link"],
  ["table", "Cove drops the row without a cell per column"],
  ["steps", "Cove drops the blank step"],
]);

const roots = [];
after(() => {
  for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
});

function packageWith(guide, files = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "feature-guide-check-"));
  roots.push(root);
  const write = (relativePath, content) => {
    const fullPath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  };
  write(fixture.guidePath, typeof guide === "string" || Buffer.isBuffer(guide) ? guide : JSON.stringify(guide));
  for (const [relativePath, content] of Object.entries(files)) write(relativePath, content);
  return root;
}

function guideWithBlocks(blocks, sectionId = "start") {
  return {
    schemaVersion: 1,
    id: "example-guide",
    title: "Example",
    description: "What the guide is for.",
    order: 10,
    sections: [{ id: sectionId, title: "Start", blocks }],
  };
}

describe("checkFeatureGuides against Cove's block fixture", () => {
  for (const blockCase of fixture.cases) {
    it(blockCase.name, () => {
      const src = blockCase.block?.type === "image" ? blockCase.block.src : undefined;
      const files = {};
      // A package image that exists, so only the block itself is being judged.
      if (blockCase.renderable && typeof src === "string" && !isRemoteImage(src))
        files[path.posix.normalize(path.posix.join(path.posix.dirname(fixture.guidePath), src))] = "image";
      const root = packageWith(guideWithBlocks([blockCase.block]), files);

      const { errors } = checkFeatureGuides(root, [fixture.guidePath]);

      if (!blockCase.renderable) assert.notEqual(errors.length, 0, "Cove would not show this block");
      else if (stricterThanCove.has(blockCase.name)) assert.equal(errors.length, 1, stricterThanCove.get(blockCase.name));
      else assert.deepEqual(errors, []);
    });
  }

  for (const sectionCase of fixture.sectionIdCases) {
    it(`section id ${JSON.stringify(sectionCase.id)}`, () => {
      const root = packageWith(guideWithBlocks([{ type: "paragraph", text: "Read this." }], sectionCase.id));
      const { errors } = checkFeatureGuides(root, [fixture.guidePath]);
      assert.equal(errors.length === 0, sectionCase.valid);
    });
  }
});

describe("checkFeatureGuides file checks", () => {
  const valid = guideWithBlocks([{ type: "paragraph", text: "Read this." }]);

  it("returns each readable guide with the package images it uses", () => {
    const guide = guideWithBlocks([{ type: "image", src: "../images/a.webp", alt: "A" }]);
    const root = packageWith(guide, { "docs/images/a.webp": "image" });
    const { errors, guides } = checkFeatureGuides(root, [fixture.guidePath]);
    assert.deepEqual(errors, []);
    assert.equal(guides[0].guide.id, "example-guide");
    assert.deepEqual(guides[0].images, ["docs/images/a.webp"]);
  });

  it("accepts a byte order mark", () => {
    const root = packageWith(Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(JSON.stringify(valid))]));
    assert.deepEqual(checkFeatureGuides(root, [fixture.guidePath]).errors, []);
  });

  it("reports a file that is not UTF-8", () => {
    // A Windows-1252 curly apostrophe is the byte 0x92.
    const [before, rest] = JSON.stringify(valid).split("Read this.");
    const root = packageWith(Buffer.concat([Buffer.from(`${before}It`), Buffer.from([0x92]), Buffer.from(`s here.${rest}`)]));
    assert.match(checkFeatureGuides(root, [fixture.guidePath]).errors.join("\n"), /not valid UTF-8/);
  });

  it("reports an unpaired surrogate escape", () => {
    const root = packageWith(JSON.stringify(valid).replace("Read this.", "Read \\ud800this."));
    assert.match(checkFeatureGuides(root, [fixture.guidePath]).errors.join("\n"), /unpaired surrogate/);
  });

  it("reports a missing guide and a path outside the package", () => {
    const root = packageWith(valid);
    const { errors } = checkFeatureGuides(root, ["docs/guides/missing.json", "../outside.json"]);
    assert.equal(errors.length, 2);
  });

  it("reports more listed guides than Cove reads", () => {
    const root = packageWith(valid);
    const { errors } = checkFeatureGuides(root, Array(33).fill(fixture.guidePath));
    assert.match(errors.join("\n"), /more than 32/);
  });

  it("reports repeated section ids", () => {
    const guide = guideWithBlocks([{ type: "paragraph", text: "One." }]);
    guide.sections.push({ ...guide.sections[0] });
    assert.match(checkFeatureGuides(packageWith(guide), [fixture.guidePath]).errors.join("\n"), /repeats section id/);
  });

  it("reports a path listed twice, even when written differently", () => {
    const root = packageWith(valid);
    assert.match(checkFeatureGuides(root, [fixture.guidePath, `./${fixture.guidePath}`]).errors.join("\n"), /more than once/);
  });

  it("reports two guides with the same id", () => {
    const root = packageWith(valid, { "docs/guides/other.json": JSON.stringify(valid) });
    assert.match(checkFeatureGuides(root, [fixture.guidePath, "docs/guides/other.json"]).errors.join("\n"), /reuses the id/);
  });

  for (const id of ["search", "segments", "extensions"]) {
    it(`reports the id ${id}, which Cove keeps for its own topic`, () => {
      const root = packageWith({ ...valid, id });
      assert.match(checkFeatureGuides(root, [fixture.guidePath]).errors.join("\n"), /keeps for its own User Guide topic/);
    });
  }

  it("refuses symbolic links for guides and images", () => {
    const guide = guideWithBlocks([{ type: "image", src: "../images/link.webp", alt: "Link" }]);
    const root = packageWith(guide, { "docs/images/real.webp": "image" });
    fs.symlinkSync(path.join(root, "docs/images/real.webp"), path.join(root, "docs/images/link.webp"));
    fs.symlinkSync(path.join(root, fixture.guidePath), path.join(root, "docs/guides/link.json"));
    const { errors } = checkFeatureGuides(root, [fixture.guidePath, "docs/guides/link.json"]);
    assert.match(errors.join("\n"), /link\.webp, which is not a file in the package/);
    assert.match(errors.join("\n"), /link\.json, or it is a symbolic link/);
  });

  const guideLevelCases = [
    ["schemaVersion 2", { schemaVersion: 2 }, /schemaVersion 1/],
    ["an id that is not kebab-case", { id: "Example Guide" }, /kebab-case id/],
    ["a blank title", { title: " " }, /needs a title/],
    ["no description", { description: undefined }, /needs a description/],
    ["a negative order", { order: -1 }, /non-negative integer order/],
    ["a decimal order", { order: 1.5 }, /non-negative integer order/],
    ["a dotted parentTopicId", { parentTopicId: "com.example.topic" }, /parentTopicId/],
    ["no sections", { sections: [] }, /at least one section/],
    ["a section without a title", { sections: [{ id: "start", blocks: [{ type: "paragraph", text: "Hi" }] }] }, /without a kebab-case id, a title/],
  ];
  for (const [name, change, expected] of guideLevelCases) {
    it(`reports a guide with ${name}`, () => {
      const root = packageWith({ ...valid, ...change });
      assert.match(checkFeatureGuides(root, [fixture.guidePath]).errors.join("\n"), expected);
    });
  }

  it("accepts a whole-number order written as a decimal and a kebab-case parent", () => {
    const root = packageWith(JSON.stringify({ ...valid, parentTopicId: "extensions" }).replace('"order":10', '"order":10.0'));
    assert.deepEqual(checkFeatureGuides(root, [fixture.guidePath]).errors, []);
  });

  it("reports nesting deeper than 32 levels", () => {
    let deep = "x";
    for (let level = 0; level < 33; level++) deep = { deep };
    const root = packageWith({ ...valid, extra: deep });
    assert.match(checkFeatureGuides(root, [fixture.guidePath]).errors.join("\n"), /32 levels/);
  });

  it("reports a file larger than 256 KiB", () => {
    const root = packageWith({ ...valid, padding: "x".repeat(256 * 1024) });
    assert.match(checkFeatureGuides(root, [fixture.guidePath]).errors.join("\n"), /larger than 256 KiB/);
  });
});
