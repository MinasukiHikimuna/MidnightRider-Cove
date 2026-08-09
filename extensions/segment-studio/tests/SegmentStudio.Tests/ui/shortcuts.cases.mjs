import test from "node:test";
import { assert, fs, manifest, repositoryRoot, source, sourceByModule, TestElement, ui } from "../SegmentStudioUiHarness.mjs";
test("Segment Studio tag terminology stays current in source, tests, and maintained docs", () => {
  const forbidden = new RegExp([
    "canonical",
    "(?:[- ]segment)?",
    "[- ]tags?",
    "|canonical",
    "Tag",
  ].join(""), "i");
  const roots = [
    new URL("README.md", repositoryRoot),
    new URL("src/SegmentStudio/", repositoryRoot),
    new URL("tests/SegmentStudio.Tests/", repositoryRoot),
  ];
  const supported = new Set([".cs", ".js", ".json", ".md", ".mjs", ".py"]);
  const files = [];
  const visit = (url) => {
    const path = url.pathname;
    const stat = fs.statSync(path);
    if (stat.isFile()) {
      if (supported.has(path.slice(path.lastIndexOf(".")))) files.push(path);
      return;
    }
    for (const entry of fs.readdirSync(path, { withFileTypes: true })) {
      if (["bin", "obj", "__pycache__"].includes(entry.name)) continue;
      visit(new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, url));
    }
  };
  roots.forEach(visit);

  const violations = files.flatMap((path) => {
    const contents = fs.readFileSync(path, "utf8");
    return forbidden.test(contents.replace(/\s+/g, " "))
      ? [{ path }]
      : [];
  });
  assert.deepEqual(violations, []);
});

test("editor request guards reject stale video responses", () => {
  assert.equal(ui.isCurrentEditorRequest(4, 4, 20, 20), true);
  assert.equal(ui.isCurrentEditorRequest(3, 4, 20, 20), false);
  assert.equal(ui.isCurrentEditorRequest(4, 4, 19, 20), false);
});

test("JSON response parsing identifies HTML fallbacks without leaking parser errors", () => {
  assert.deepEqual(ui.tryParseJsonResponseText('{"items":[1]}'), {
    parsed: true,
    value: { items: [1] },
  });
  assert.deepEqual(ui.tryParseJsonResponseText("<!DOCTYPE html><html></html>"), {
    parsed: false,
    value: null,
  });
  assert.match(source, /method === "GET" && attempt < 2/);
  assert.match(source, /Segment Studio received an unexpected response\. Reload and try again\./);
  assert.doesNotMatch(source, /return response\.status === 204 \? null : response\.json\(\)/);
});

test("editor shortcuts ignore editable controls, overlays, and modified keys", () => {
  const base = { key: "j", target: new TestElement(), defaultPrevented: false, ctrlKey: false, metaKey: false, altKey: false, shiftKey: false };

  assert.equal(ui.shouldHandleEditorShortcut(base, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, target: new TestElement("input") }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, ctrlKey: true }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, shiftKey: true }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "Tab" }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "Tab", shiftKey: true }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "+", shiftKey: true }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "[" }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "]" }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowDown" }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowDown", target: new TestElement("input") }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "Enter", target: new TestElement("button") }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "Enter", target: new TestElement(["button", "[data-selected-segment-shortcut-target='true']"]) }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: " ", target: new TestElement(["button", "[data-selected-segment-shortcut-target='true']"]) }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut(
    { ...base, key: "Enter", target: new TestElement(["button", "[data-selected-segment-shortcut-target='true']"]) },
    { querySelector: () => ({ role: "dialog" }) },
  ), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: " ", target: new TestElement("a[href]") }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "Tab", target: new TestElement("button") }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowDown", target: new TestElement("[role='slider']") }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "Enter", target: new TestElement(["button", "[data-segment-player]"]) }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "Tab", target: new TestElement(["[role='slider']", "[data-segment-player]"]) }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowLeft", target: new TestElement(["[role='slider']", "[data-segment-player]"]) }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowDown", target: new TestElement(["[role='slider']", "[data-segment-player]"]) }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowLeft", target: new TestElement(["video", "[data-segment-player]"]) }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowDown", target: new TestElement(["video", "[data-segment-player]"]) }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowRight", target: new TestElement("[data-timeline-seeker]") }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "z", target: new TestElement("[data-timeline-seeker]") }, { querySelector: () => null }, true), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "Enter", target: new TestElement(["button", "[data-timeline-seeker]"]) }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: " ", target: new TestElement(["button", "[data-timeline-seeker]"]) }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowLeft", target: new TestElement("[role='separator']", { "aria-orientation": "vertical" }) }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "Tab", target: new TestElement("[role='separator']", { "aria-orientation": "vertical" }) }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowDown", target: new TestElement("[role='separator']", { "aria-orientation": "vertical" }) }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowDown", target: new TestElement("[role='separator']", { "aria-orientation": "horizontal" }) }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "ArrowLeft", target: new TestElement("[role='separator']", { "aria-orientation": "horizontal" }) }, { querySelector: () => null }), true);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "z", target: new TestElement("[role='separator']") }, { querySelector: () => null }, true), true);
  assert.equal(ui.shouldHandleEditorShortcut(base, { querySelector: () => ({ role: "dialog" }) }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "z" }, { querySelector: () => null }), false);
  assert.equal(ui.shouldHandleEditorShortcut({ ...base, key: "a" }, { querySelector: () => null }), true);
});

test("the editor shortcut registry drives both dispatch and visible help", () => {
  const ids = ui.SEGMENT_STUDIO_SHORTCUTS.map((shortcut) => shortcut.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.includes("navigation.swimlaneRight"));
  assert.ok(ids.includes("navigation.extendSwimlaneLeft"));
  assert.ok(ids.includes("navigation.extendSwimlaneRight"));
  assert.ok(ids.includes("navigation.centerPlayhead"));
  assert.ok(ids.includes("marker.confirm"));
  assert.ok(ids.includes("marker.reject"));
  assert.ok(ids.includes("marker.moveToBin"));
  assert.ok(ids.includes("system.emptyBin"));
  assert.ok(!ids.includes("marker.approveLegacy"));
  assert.ok(!ids.includes("marker.unreviewLegacy"));
  assert.equal(ui.findEditorShortcut({ key: "ArrowRight", shiftKey: false, ctrlKey: false, altKey: false, metaKey: false }, false)?.id, "navigation.swimlaneRight");
  assert.equal(ui.findEditorShortcut({ key: "ArrowLeft", shiftKey: true, ctrlKey: false, altKey: false, metaKey: false }, false)?.id, "navigation.extendSwimlaneLeft");
  assert.equal(ui.findEditorShortcut({ key: "ArrowRight", shiftKey: true, ctrlKey: false, altKey: false, metaKey: false }, false)?.id, "navigation.extendSwimlaneRight");
  assert.equal(ui.findEditorShortcut({ key: "a", shiftKey: false, ctrlKey: false, altKey: false, metaKey: false }, false)?.id, "marker.create");
  assert.equal(ui.findEditorShortcut({ key: "x", shiftKey: false, ctrlKey: false, altKey: false, metaKey: false }, false)?.id, "marker.moveToBin");
  assert.equal(ui.findEditorShortcut({ key: "x", shiftKey: true, ctrlKey: false, altKey: false, metaKey: false }, false)?.id, "system.emptyBin");
  assert.equal(ui.findEditorShortcut({ key: "z", shiftKey: false, ctrlKey: false, altKey: false, metaKey: false }, true)?.id, "marker.confirm");
  assert.equal(ui.findEditorShortcut({ key: "x", shiftKey: false, ctrlKey: false, altKey: false, metaKey: false }, true)?.id, "marker.reject");
  assert.equal(ui.findEditorShortcut({ key: "x", shiftKey: true, ctrlKey: false, altKey: false, metaKey: false }, true)?.id, "system.deleteRejected");
  assert.equal(ui.findEditorShortcut({ key: "u", shiftKey: false, ctrlKey: false, altKey: false, metaKey: false }, true)?.id, "navigation.nextShot");
  assert.match(source, /function KeyboardShortcutsDialog/);
  assert.match(source, /Keyboard shortcuts/);
  assert.match(source, /resolveSegmentStudioShortcuts\(overrides\)/);
  assert.match(source, /findEditorShortcut\(event, compatibilityMode, shortcutOverrides\)/);
  assert.match(source, /saveSelectedReviewState\("approved"\)/);
  assert.match(source, /saveSelectedReviewState\("rejected"\)/);
  assert.match(source.slice(0, source.indexOf("const DISCOVERY_URL_OPTIONS")), /system\.deleteRejected/);
});

test("keyboard shortcut help balances whole sections into responsive Marker Studio columns", () => {
  const columns = ui.splitShortcutCategoriesIntoColumns(ui.SEGMENT_STUDIO_SHORTCUTS);
  const categoryOrder = [...new Set(ui.SEGMENT_STUDIO_SHORTCUTS.map((shortcut) => shortcut.category))];
  assert.equal(columns.length, 2);
  assert.deepEqual(columns.flatMap((column) => column.map((group) => group.category)).sort(), categoryOrder.sort());
  const weights = columns.map((column) => column.reduce((total, group) => total + group.shortcuts.length + 2, 0));
  const largestWholeSection = Math.max(...columns.flatMap((column) => column.map((group) => group.shortcuts.length + 2)));
  assert.ok(Math.abs(weights[0] - weights[1]) <= largestWholeSection);
  assert.deepEqual(
    ui.splitShortcutCategoriesIntoColumns(ui.SEGMENT_STUDIO_SHORTCUTS, 1)[0].map((group) => group.category),
    [...new Set(ui.SEGMENT_STUDIO_SHORTCUTS.map((shortcut) => shortcut.category))],
  );

  const dialog = source.slice(
    source.indexOf("function KeyboardShortcutsDialog"),
    source.indexOf("function IncorrectExamplesDialog"),
  );
  assert.match(dialog, /max-w-5xl/);
  assert.match(dialog, /space-y-6 lg:hidden/);
  assert.match(dialog, /hidden items-start gap-6 lg:grid lg:grid-cols-2/);
  assert.match(dialog, /categoryColumns/);
});

test("keyboard binding search matches actions, categories, and resolved key labels", () => {
  const resolved = ui.resolveSegmentStudioShortcuts({
    "video.seekMediumBackward": [{ key: "g", ctrl: true }],
  });
  const customized = resolved.find((shortcut) => shortcut.id === "video.seekMediumBackward");
  const unassigned = resolved.find((shortcut) => shortcut.id === "video.seekMediumForward");

  assert.deepEqual(ui.filterSegmentStudioShortcuts(resolved, ""), resolved);
  assert.equal(ui.shortcutBindingDisplayText(customized), "Ctrl+g");
  assert.equal(ui.shortcutBindingDisplayText(unassigned), "Unassigned");
  assert.equal(ui.shortcutBindingDisplayText(customized, true), "Press keys…");
  const playbackMatches = ui.filterSegmentStudioShortcuts(resolved, "playback");
  assert.ok(playbackMatches.length > 0);
  assert.ok(playbackMatches.every((shortcut) => shortcut.category === "Playback"));
  assert.deepEqual(
    ui.filterSegmentStudioShortcuts(resolved, "seek backward by the medium").map((shortcut) => shortcut.id),
    ["video.seekMediumBackward"],
  );
  assert.deepEqual(
    ui.filterSegmentStudioShortcuts(resolved, "ctrl+g").map((shortcut) => shortcut.id),
    ["video.seekMediumBackward"],
  );
  assert.ok(ui.filterSegmentStudioShortcuts(resolved, "unassigned").some((shortcut) => shortcut.bindings.length === 0));
  assert.deepEqual(ui.filterSegmentStudioShortcuts(resolved, "not a shortcut"), []);
});

test("timeline shortcuts include alternate zoom keys and platform resize bindings", () => {
  const event = (key, overrides = {}) => ({ key, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false, ...overrides });
  assert.equal(ui.findEditorShortcut(event("="), false)?.id, "navigation.zoomIn");
  assert.equal(ui.findEditorShortcut(event("_", { shiftKey: true }), false)?.id, "navigation.zoomOut");
  assert.equal(ui.findEditorShortcut(event("ArrowUp", { ctrlKey: true }), false)?.id, "layout.growSwimlanes");
  assert.equal(ui.findEditorShortcut(event("ArrowDown", { metaKey: true }), false)?.id, "layout.shrinkSwimlanes");
  assert.equal(ui.findEditorShortcut(event("ArrowUp", { ctrlKey: true, metaKey: true }), false), null);
  assert.match(source, /shortcut\.id === "layout\.growSwimlanes"/);
  assert.match(source, /updateTimelineRatio\(editorLayout\.timelineRatio \+ 0\.05\)/);
  assert.match(source, /binding\.platform \? "Ctrl\/Cmd"/);
});

test("number shortcuts seek to exact video percentages through the shared registry", () => {
  const event = (key) => ({ key, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false });
  for (let digit = 1; digit <= 9; digit += 1) {
    const shortcut = ui.findEditorShortcut(event(String(digit)), false);
    assert.equal(shortcut?.id, `video.seekPercent${digit * 10}`);
    assert.equal(shortcut?.description, `Seek to ${digit * 10}% of the video`);
    assert.equal(ui.percentageSeekTime(200, digit), digit * 20);
  }
  assert.equal(ui.percentageSeekTime(0, 5), 0);
  assert.equal(ui.percentageSeekTime(100, 0), 0);
  assert.match(source, /shortcut\.id\.startsWith\("video\.seekPercent"\)/);
  assert.match(source, /seekRef\.current\?\.\(percentageSeekTime\(mediaDuration \?\? timelineDuration, digit\), false\)/);
});

test("playback shortcut intervals use bounded browser-local settings", () => {
  assert.deepEqual(ui.parsePlaybackShortcutConfig(null), {
    smallSeekTime: 5,
    mediumSeekTime: 10,
    longSeekTime: 30,
    smallFrameStep: 1,
    mediumFrameStep: 10,
    longFrameStep: 30,
  });
  assert.deepEqual(ui.parsePlaybackShortcutConfig('{"smallSeekTime":2.5,"mediumSeekTime":999,"longSeekTime":0,"smallFrameStep":3,"mediumFrameStep":"bad","longFrameStep":60}'), {
    smallSeekTime: 2.5,
    mediumSeekTime: 120,
    longSeekTime: 1,
    smallFrameStep: 3,
    mediumFrameStep: 10,
    longFrameStep: 60,
  });
  assert.deepEqual(ui.parsePlaybackShortcutConfig("not-json"), ui.parsePlaybackShortcutConfig(null));
  assert.match(source, /segment-studio\.playback-shortcuts\.v1/);
  assert.match(source, /function PlaybackShortcutSettings/);
  assert.match(source, /Small seek \(seconds\)/);
  assert.match(source, /Small frame step \(frames\)/);
});

test("medium seek actions match Stash defaults and remain customizable", () => {
  const mediumBackward = ui.SEGMENT_STUDIO_SHORTCUTS.find((shortcut) => shortcut.id === "video.seekMediumBackward");
  const mediumForward = ui.SEGMENT_STUDIO_SHORTCUTS.find((shortcut) => shortcut.id === "video.seekMediumForward");
  assert.deepEqual(mediumBackward.bindings, []);
  assert.deepEqual(mediumForward.bindings, []);
  assert.equal(ui.findEditorShortcut({ key: "g", ctrlKey: true, altKey: false, shiftKey: false, metaKey: false }, false, {
    "video.seekMediumBackward": [{ key: "g", ctrl: true }],
  })?.id, "video.seekMediumBackward");
  assert.match(source, /seekBy\(-playbackShortcutConfig\.mediumSeekTime\)/);
  assert.match(source, /seekBy\(playbackShortcutConfig\.mediumSeekTime\)/);
});

test("playback shortcuts replace temporary J and K segment selection", () => {
  const event = (key, overrides = {}) => ({ key, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false, ...overrides });
  assert.equal(ui.findEditorShortcut(event(" "), false)?.id, "video.playPause");
  assert.equal(ui.findEditorShortcut(event("k"), false)?.id, "video.playPause");
  assert.equal(ui.findEditorShortcut(event("j"), false)?.id, "video.seekSmallBackward");
  assert.equal(ui.findEditorShortcut(event("l"), false)?.id, "video.seekSmallForward");
  assert.equal(ui.findEditorShortcut(event("j", { ctrlKey: true, shiftKey: true }), false)?.id, "video.seekLongBackward");
  assert.equal(ui.findEditorShortcut(event("Enter"), false)?.id, "video.playSelected");
  assert.ok(!ui.SEGMENT_STUDIO_SHORTCUTS.some((shortcut) => shortcut.id.endsWith("SegmentLegacy")));
  assert.match(source, /onPlaybackControlRegister/);
  assert.match(source, /playbackControlsRef\.current\?\.toggle\(\)/);
  assert.match(source, /playbackShortcutConfig\.smallSeekTime/);
  assert.match(source, /seekRef\.current\?\.\(selectedSegment\.startSec, true\)/);
  assert.doesNotMatch(source, /Previous \(K\)|Next \(J\)/);
});

test("frame stepping pauses playback and uses configured frame counts", () => {
  const event = (key, overrides = {}) => ({ key, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false, ...overrides });
  assert.equal(ui.frameStepSeconds(1), 1 / 30);
  assert.equal(ui.frameStepSeconds(10, 25), 0.4);
  assert.equal(ui.frameStepSeconds(-30, 0), -1);
  assert.equal(ui.findEditorShortcut(event(","), false)?.id, "video.frameSmallBackward");
  assert.equal(ui.findEditorShortcut(event(",", { code: "Comma", shiftKey: true }), false)?.id, "video.frameMediumBackward");
  assert.equal(ui.findEditorShortcut(event("<", { code: "Comma", shiftKey: true }), false)?.id, "video.frameMediumBackward");
  assert.equal(ui.findEditorShortcut(event(".", { code: "Period", shiftKey: true }), false)?.id, "video.frameMediumForward");
  assert.equal(ui.findEditorShortcut(event(">", { code: "Period", shiftKey: true }), false)?.id, "video.frameMediumForward");
  assert.deepEqual(
    ui.SEGMENT_STUDIO_SHORTCUTS.find((shortcut) => shortcut.id === "video.frameMediumBackward")?.bindings[0],
    { key: ",", code: "Comma", shift: true, label: "Shift+," },
  );
  assert.deepEqual(
    ui.SEGMENT_STUDIO_SHORTCUTS.find((shortcut) => shortcut.id === "video.frameMediumForward")?.bindings[0],
    { key: ".", code: "Period", shift: true, label: "Shift+." },
  );
  assert.equal(ui.findEditorShortcut(event(";"), false)?.id, "video.frameMediumBackward");
  assert.equal(ui.findEditorShortcut(event(":", { shiftKey: true }), false)?.id, "video.frameMediumForward");
  assert.equal(ui.findEditorShortcut(event(";", { ctrlKey: true }), false)?.id, "video.frameLongBackward");
  assert.equal(ui.findEditorShortcut(event(":", { ctrlKey: true, shiftKey: true }), false)?.id, "video.frameLongForward");
  assert.match(source, /playbackControlsRef\.current\?\.pause\(\)/);
  assert.match(source, /frameStepSeconds\(frameCount, videoFrameRate\)/);
  assert.match(source, /const videoFrameRate = Number\(video\.videoFile\?\.frameRate\) > 0/);
});

test("keyboard ownership stays with the mounted editor when player controls take focus", () => {
  const editor = new TestElement();
  const editorChild = new TestElement();
  const playerControl = new TestElement("[data-segment-player]");
  const outsideControl = new TestElement("button");
  const body = new TestElement("body");
  editor.children.add(editorChild);
  editor.children.add(playerControl);

  assert.equal(ui.isEditorShortcutOwner({ target: editorChild }, editor), true);
  assert.equal(ui.isEditorShortcutOwner({ target: playerControl }, editor), true);
  assert.equal(ui.isEditorShortcutOwner({ target: body, view: { document: { activeElement: body, body } } }, editor), true);
  assert.equal(ui.isEditorShortcutOwner({ target: body, view: { document: { activeElement: outsideControl, body } } }, editor), false);
  assert.equal(ui.isEditorShortcutOwner({ target: outsideControl }, editor), false);
  assert.equal(ui.isEditorShortcutOwner({ target: outsideControl, view: { document: { activeElement: editorChild } } }, editor), true);
  assert.equal(ui.isEditorShortcutOwner({ target: outsideControl, view: { document: { activeElement: outsideControl } } }, editor), false);
  assert.equal(ui.shouldHandleEditorShortcut(
    { key: "Enter", target: body, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
    { querySelector: () => ({ role: "dialog" }) },
  ), false);
  assert.match(source, /ownerDocument\.addEventListener\("keydown", listener, true\)/);
  assert.match(source, /ownerDocument\.removeEventListener\("keydown", listener, true\)/);
  assert.match(source, /if \(!isEditorShortcutOwner\(event, editorRef\.current\)\) return/);
  assert.match(source, /shortcutHandlerRef\.current = handleShortcut/);
  assert.match(source, /\}, \[\]\);/);
  assert.doesNotMatch(source, /onKeyDownCapture: handleShortcut/);
  assert.match(source, /shortcut\.id === "video\.playSelected"[\s\S]*requestAnimationFrame\(\(\) => editorRef\.current\?\.focus/);
});

test("segment selection does not move or autoplay the playhead", () => {
  assert.match(source, /function selectSegment\(segment, \{[\s\S]*focusEditor = false,[\s\S]*seekToSegment = false,[\s\S]*additive = false,[\s\S]*rangeSegmentIds = null,[\s\S]*\} = \{\}\)/);
  assert.match(source, /if \(seekToSegment\) seekRef\.current\?\.\(segment\.startSec, false\)/);
  const keyboardSelections = source.match(/selectSegment\(target, \{ focusEditor: true, seekToSegment: false \}\)/g) || [];
  assert.equal(keyboardSelections.length, 6);
  assert.match(source, /onClick: \(event\) => selectSegment\(segment, \{ additive: event\.metaKey \|\| event\.ctrlKey \}\)/);
  assert.match(source, /onSelect: \(segment, options\) => selectSegment\(segment, options\)/);
  assert.match(source, /seekRef\.current\?\.\(selectedSegment\.startSec, true\)/);
});
