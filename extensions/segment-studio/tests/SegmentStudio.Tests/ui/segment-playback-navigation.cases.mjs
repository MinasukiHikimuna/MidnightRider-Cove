import test from "node:test";
import { assert, sourceByModule, ui } from "../SegmentStudioUiHarness.mjs";

const event = (key) => ({ key, shiftKey: true, ctrlKey: false, altKey: false, metaKey: false });

test("Shift+J and Shift+L select adjacent timestamps in one swimlane and start playback", () => {
  assert.equal(ui.findEditorShortcut(event("J"), false)?.id, "video.playPreviousSegment");
  assert.equal(ui.findEditorShortcut(event("L"), false)?.id, "video.playNextSegment");
  assert.equal(ui.findEditorShortcut(event("K"), false), null);

  const actions = sourceByModule["editor/actions/shortcuts.js"];
  assert.match(actions, /findSwimlaneSelection\([\s\S]{0,120}video\.playPreviousSegment[\s\S]{0,40}"left" : "right"/);
  assert.match(actions, /selectSegment\(target, \{ focusEditor: true, seekToSegment: false \}\)/);
  assert.match(actions, /seekRef\.current\?\.\(target\.startSec, true\)/);
});
