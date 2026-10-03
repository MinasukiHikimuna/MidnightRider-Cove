import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

// Renders the widget with just enough of React's hooks to run its data flow: child components are recorded as
// elements but never rendered, effects run after each render, and state updates render again.
function createHooks() {
  let hooks = [];
  let index = 0;
  let pending = [];
  let rerender = () => {};
  const sameDeps = (left, right) => left && right && left.length === right.length && left.every((value, at) => Object.is(value, right[at]));
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props ?? {}, children }),
    useState(initial) {
      const at = index++;
      if (!(at in hooks)) hooks[at] = { value: typeof initial === "function" ? initial() : initial };
      const hook = hooks[at];
      return [hook.value, (next) => {
        const value = typeof next === "function" ? next(hook.value) : next;
        if (Object.is(value, hook.value)) return;
        hook.value = value;
        rerender();
      }];
    },
    useMemo(compute, deps) {
      const at = index++;
      if (!hooks[at] || !sameDeps(hooks[at].deps, deps)) hooks[at] = { value: compute(), deps };
      return hooks[at].value;
    },
    useEffect(effect, deps) {
      const at = index++;
      if (hooks[at] && sameDeps(hooks[at].deps, deps)) return;
      const previous = hooks[at];
      hooks[at] = { deps };
      pending.push(() => {
        previous?.cleanup?.();
        hooks[at].cleanup = effect();
      });
    },
  };
  const mount = (Component, props) => {
    hooks = [];
    pending = [];
    let tree = null;
    let rendering = false;
    let dirty = false;
    const render = () => {
      if (rendering) { dirty = true; return; }
      rendering = true;
      do {
        dirty = false;
        index = 0;
        tree = Component(props);
        const effects = pending;
        pending = [];
        for (const run of effects) run();
      } while (dirty);
      rendering = false;
    };
    rerender = render;
    render();
    return () => tree;
  };
  return { React, mount };
}

function find(node, match) {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = find(child, match);
      if (found) return found;
    }
    return null;
  }
  if (match(node)) return node;
  return find(node.children, match);
}

const { React, mount } = createHooks();
const bundle = await readFile(new URL("../src/BlastFromThePast/assets/ui.mjs", import.meta.url), "utf8");
const runtimeImports = [
  ['import React from "@cove/runtime/react";', "const React = globalThis.__bftpReact;"],
  ['import { extensionFetch } from "@cove/runtime/api";', "const extensionFetch = (...args) => globalThis.__bftpFetch(...args);"],
];
let testable = bundle;
for (const [statement, stub] of runtimeImports) {
  assert.ok(testable.includes(statement), `ui.mjs should import ${statement}`);
  testable = testable.replace(statement, stub);
}
globalThis.__bftpReact = React;
const { default: extension } = await import(`data:text/javascript,${encodeURIComponent(testable)}`);

// Sixty liked videos, each with one moment placed by a pause just before its like.
const at = (seconds) => new Date(Date.UTC(2026, 7, 1, 4, 0, 0) + seconds * 1000).toISOString();
const videoIds = Array.from({ length: 60 }, (_, index) => index + 1);
const history = (id) => ({
  likeHistory: [at(100 + id)],
  sessions: [{ startedAt: at(0), lastSeenAt: at(500), endedAt: null, mediaDurationSec: 2000, lastPositionSec: 880, intervals: [] }],
  events: [{ kind: "pause", at: at(92 + id), meta: { positionSec: 800, playbackRate: 1 } }],
});

function serveLibrary() {
  const historyReads = [];
  const respond = (body) => ({ ok: true, status: 200, json: async () => body });
  globalThis.__bftpFetch = async (url, options = {}) => {
    if (url.endsWith("/candidates")) return respond({ videoIds });
    if (url === "/api/videos/find") {
      const { objectFilter } = JSON.parse(options.body);
      return respond({ items: objectFilter.ids.map((id) => ({ id, title: `Video ${id}` })) });
    }
    const id = Number(url.match(/^\/api\/videos\/(\d+)\/history$/)?.[1]);
    historyReads.push(id);
    return respond(history(id));
  };
  return historyReads;
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
const momentList = (tree) => find(tree, (node) => node.type?.name === "MomentList");
const featured = (tree) => find(tree, (node) => node.type?.name === "MomentPlayer")?.props.moment.id;
const shownIds = (tree) => momentList(tree)?.props.moments.map((moment) => moment.video.id) ?? [];
const shuffleButton = (tree) => find(tree, (node) => node.props?.["aria-label"] === "Shuffle moments");
const mountWidget = async () => {
  const historyReads = serveLibrary();
  const tree = mount(extension.components.BlastFromThePastWidget, { configuration: { count: 6 }, onNavigate() {} });
  await settle();
  return { historyReads, tree };
};

test("shuffle scans the liked videos again instead of reselecting from the moments the page load found", async () => {
  const { historyReads, tree } = await mountWidget();
  const loaded = new Set(historyReads);
  assert.ok(loaded.size < videoIds.length, "the page load should stop before reading every liked video");
  assert.equal(shownIds(tree()).length, 6);

  const seen = new Set();
  for (let shuffle = 0; shuffle < 20; shuffle += 1) {
    const reads = historyReads.length;
    shuffleButton(tree()).props.onClick();
    await settle();
    assert.ok(historyReads.length > reads, "each shuffle reads liked videos again");
    for (const id of shownIds(tree())) seen.add(id);
  }
  assert.ok([...seen].some((id) => !loaded.has(id)), "shuffles reach liked videos the page load never read");
});

test("the current moments and selection stay while a shuffle scans, then the new set opens on its first moment", async () => {
  const { tree } = await mountWidget();
  const list = momentList(tree());
  const chosen = list.props.moments[3].id;
  list.props.onSelect(chosen);
  assert.equal(featured(tree()), chosen);

  const before = shownIds(tree());
  shuffleButton(tree()).props.onClick();
  assert.deepEqual(shownIds(tree()), before);
  assert.equal(featured(tree()), chosen);
  assert.equal(shuffleButton(tree()).props.disabled, true, "shuffle waits for the scan in flight");

  await settle();
  assert.equal(shuffleButton(tree()).props.disabled, false);
  assert.equal(featured(tree()), momentList(tree()).props.moments[0].id);
});
