import assert from "node:assert/strict";

import fs from "node:fs";

import { register } from "node:module";

const bundlePath = new URL("../../src/SegmentStudio/ui/SegmentStudio.js", import.meta.url);

const uiRoot = new URL("../../src/SegmentStudio/ui/", import.meta.url);

const sourceOrder = JSON.parse(fs.readFileSync(new URL("SegmentStudioUiSourceOrder.json", import.meta.url), "utf8"));

const sourceByModule = Object.fromEntries(sourceOrder.map((relativePath) => [
  relativePath,
  fs.readFileSync(new URL(relativePath, uiRoot), "utf8"),
]));

const source = sourceOrder.map((relativePath) => sourceByModule[relativePath]).join("\n");

const manifest = JSON.parse(fs.readFileSync(new URL("../../src/SegmentStudio/extension.json", import.meta.url), "utf8"));

const repositoryRoot = new URL("../../", import.meta.url);

class TestElement {
  constructor(selector = null, attributes = {}) {
    this.selectors = Array.isArray(selector) ? selector : [selector].filter(Boolean);
    this.attributes = attributes;
    this.children = new Set();
  }

  closest(selector) {
    return this.selectors.some((candidate) => selector.includes(candidate)) ? this : null;
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  contains(element) {
    return element === this || this.children.has(element);
  }
}

globalThis.Element = TestElement;

globalThis.document = { querySelector: () => null };

globalThis.__segmentStudioReact = {
  createElement: () => null,
  useEffect: () => {},
  useId: () => "test-id",
  useMemo: (factory) => factory(),
  useRef: (value) => ({ current: value }),
  useState: (value) => [value, () => {}],
};

register(new URL("./SegmentStudioRuntimeLoader.mjs", import.meta.url));

const ui = await import(bundlePath);



export { assert, fs, manifest, repositoryRoot, source, sourceByModule, TestElement, ui };
