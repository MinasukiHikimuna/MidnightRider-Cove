import test from "node:test";
import { assert, sourceByModule } from "../SegmentStudioUiHarness.mjs";

test("the active swimlane title glows with the selected segment", () => {
  const timeline = sourceByModule["editor/SwimlaneTimeline.js"];
  const presentation = sourceByModule["shared/presentation.js"];
  assert.match(timeline, /const activeLane = lane\.markers\.some/);
  assert.match(timeline, /data-active-swimlane/);
  assert.match(timeline, /activeSwimlaneLabelStyle\(activeLane, stripeBackground\)/);
  assert.match(presentation, /boxShadow: "inset 3px 0 0 var\(--color-accent\), inset 0 0 16px/);
});
