// Run with: npm test
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { guideTree } from "../src/lib/extensions.mjs";
import { brokenReferences, rendererProblems } from "./check-output.mjs";

const guide = (id, parentTopicId, order = 0) => ({ id, title: id, order, ...(parentTopicId ? { parentTopicId } : {}) });
const shape = tree => tree.map(({ guide: top, children }) => [top.id, children.map(child => child.id)]);

describe("guideTree", () => {
  it("nests a guide under its parent and orders by order", () => {
    assert.deepEqual(shape(guideTree([guide("child-b", "overview", 2), guide("overview"), guide("child-a", "overview", 1)])), [
      ["overview", ["child-a", "child-b"]],
    ]);
  });

  it("lists a guide below a child guide under the top-level guide", () => {
    assert.deepEqual(shape(guideTree([guide("overview"), guide("child", "overview"), guide("grandchild", "child")])), [
      ["overview", ["child", "grandchild"]],
    ]);
  });

  it("lists a guide whose parent is not one of the extension's guides at the top level", () => {
    assert.deepEqual(shape(guideTree([guide("settings", "extensions")])), [["settings", []]]);
  });

  it("lists every guide in a parent loop at the top level, and keeps guides below the loop nested", () => {
    assert.deepEqual(shape(guideTree([guide("a", "b"), guide("b", "a", 1), guide("c", "a", 2)])), [
      ["a", ["c"]],
      ["b", []],
    ]);
  });
});

describe("brokenReferences", () => {
  const exists = relative => ["index.html", "hash-the-cove/index.html", "extensions/a.webp"].includes(relative);

  it("accepts links and images that resolve to built files", () => {
    const html = '<a href="/MidnightRider-Cove/hash-the-cove/">A</a><img src="../extensions/a.webp"><a href="https://example.com/">B</a>';
    assert.deepEqual(brokenReferences(html, "MidnightRider-Cove/data-quality/", exists), []);
  });

  it("reports a missing page and a link outside the base", () => {
    const html = '<a href="/MidnightRider-Cove/missing/">A</a><a href="/hash-the-cove/">B</a>';
    assert.equal(brokenReferences(html, "MidnightRider-Cove/", exists).length, 2);
  });
});

describe("rendererProblems", () => {
  const fixture = {
    cases: [
      { name: "paragraph", renderable: true, block: { type: "paragraph", text: "Hi" } },
      { name: "dropped", renderable: false, block: { type: "video" } },
      { name: "links", renderable: true, block: { type: "links" } },
    ],
  };

  it("accepts a page where each renderable case renders as its element", () => {
    const html =
      '<section aria-labelledby="case-1"><p>Hi</p></section>' +
      '<section aria-labelledby="case-2"><ul><li><a data-feature-guide-link href="https://example.com/">Site</a></li></ul></section>';
    assert.deepEqual(rendererProblems(html, fixture), []);
  });

  it("reports a missing block and a link Cove drops", () => {
    const html =
      '<section aria-labelledby="case-1"></section>' +
      '<section aria-labelledby="case-2"><ul><li><a data-feature-guide-link href="javascript:alert(1)">Bad</a></li></ul></section>';
    assert.equal(rendererProblems(html, fixture).length, 2);
  });
});
