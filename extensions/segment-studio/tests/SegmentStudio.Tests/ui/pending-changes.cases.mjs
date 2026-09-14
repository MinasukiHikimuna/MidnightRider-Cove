import test from "node:test";
import { assert, ui } from "../SegmentStudioUiHarness.mjs";

const native = (id, startSec, overrides = {}) => ({
  id, itemId: null, nativeSegmentId: id, published: true, tagId: 1, tagName: "Tag", startSec, endSec: startSec + 5,
  reviewState: "unreviewed", ...overrides,
});
const draft = (itemId, startSec, overrides = {}) => ({
  id: -itemId, itemId, nativeSegmentId: null, published: false, tagId: 1, tagName: "Tag", startSec, endSec: startSec + 5,
  reviewState: "unreviewed", ...overrides,
});
const identity = (segment) => ({ id: segment.id, itemId: segment.itemId, nativeSegmentId: segment.nativeSegmentId });

test("pending changes leave the server segments untouched and reuse them when nothing is pending", () => {
  const segments = [native(1, 10), native(2, 20)];
  assert.equal(ui.applyPendingChanges(segments, []), segments);
  assert.equal(ui.applyPendingChanges(segments, null), segments);
  const list = ui.addPendingChange([], { op: "patch", targets: [identity(segments[0])], values: { startSec: 30 } });
  const displayed = ui.applyPendingChanges(segments, list);
  assert.deepEqual(displayed.map((segment) => segment.id), [2, 1]);
  assert.equal(segments[0].startSec, 10);
});

test("pending changes display the same segments as the projection helpers they replace", () => {
  const segments = [native(10, 5), native(11, 15), draft(12, 25), native(13, 35)];
  const detail = { segments };
  const byIds = (ids) => segments.filter((segment) => ids.includes(segment.id)).map(identity);

  assert.deepEqual(
    ui.applyPendingChanges(segments, ui.addPendingChange([], { op: "patch", targets: byIds([10, -12]), values: { reviewState: "rejected", startSec: 40 } })),
    ui.patchSegmentProjection(detail, [10, -12], { reviewState: "rejected", startSec: 40 }).segments,
  );
  const temporary = { ...native(-1, 0), nativeSegmentId: null };
  assert.deepEqual(
    ui.applyPendingChanges(segments, ui.addPendingChange([], { op: "insert", segment: temporary })),
    ui.insertSegmentProjection(detail, temporary).segments,
  );
  assert.deepEqual(
    ui.applyPendingChanges(segments, ui.addPendingChange([], { op: "remove", targets: byIds([11, 13]) })),
    ui.removeSegmentsProjection(detail, [11, 13]).segments,
  );
  const merged = ui.mergeSegmentsProjection(detail, [segments[0], segments[1]]).segments;
  const survivor = merged.find((segment) => segment.id === 10);
  const { id: _id, itemId: _itemId, nativeSegmentId: _native, ...mergeValues } = survivor;
  assert.deepEqual(
    ui.applyPendingChanges(segments, ui.addPendingChange([], { op: "merge", targets: byIds([10, 11]), values: mergeValues })),
    merged,
  );
});

test("pending changes still apply after a draft approval changes the segment id", () => {
  const pendingDraft = draft(55, 10);
  const list = ui.addPendingChange([], { op: "patch", targets: [identity(pendingDraft)], values: { tagId: 9 } });
  const approved = { ...pendingDraft, id: 900, nativeSegmentId: 900, published: true };
  assert.equal(ui.applyPendingChanges([approved], list)[0].tagId, 9);
  assert.equal(ui.prunePendingChanges(list, { segments: [approved] }), list);
});

test("pending changes follow a created segment from its temporary id to its saved identity", () => {
  const temporary = { ...native(-3, 0), nativeSegmentId: null };
  let list = ui.addPendingChange([], { op: "insert", taskId: 1, segment: temporary });
  list = ui.addPendingChange(list, { op: "patch", taskId: 2, targets: [{ id: -3 }], values: { tagId: 7 } });
  assert.equal(ui.applyPendingChanges([], list)[0].tagId, 7);

  const saved = native(205, 0);
  list = ui.settlePendingChange(list, 1);
  list = ui.retargetPendingChanges(list, -3, identity(saved));
  const reloaded = { segments: [saved] };
  list = ui.prunePendingChanges(ui.prunePendingChanges(list, reloaded), { segments: [saved] });
  assert.deepEqual(list.map((entry) => entry.taskId), [2]);
  assert.deepEqual(ui.applyPendingChanges([saved], list), [{ ...saved, tagId: 7 }]);
  // Retargeting leaves unrelated lists untouched.
  assert.equal(ui.retargetPendingChanges(list, -99, identity(saved)), list);
});

test("pending changes are discarded by entry or task and settled entries are pruned", () => {
  const segments = [native(1, 10)];
  let list = ui.addPendingChange([], { id: "a", taskId: 4, op: "patch", targets: [identity(segments[0])], values: { startSec: 12 } });
  list = ui.addPendingChange(list, { id: "b", taskId: 5, op: "patch", targets: [identity(segments[0])], values: { reviewState: "approved" } });
  assert.deepEqual(ui.discardPendingChange(list, 4).map((entry) => entry.id), ["b"]);
  assert.deepEqual(ui.discardPendingChange(list, "b").map((entry) => entry.id), ["a"]);
  assert.equal(ui.discardPendingChange(list, "missing"), list);

  const settled = ui.settlePendingChange(list, 5);
  assert.equal(ui.settlePendingChange(settled, 5), settled);
  // A confirmed change records the projection it was confirmed on and keeps showing until that changes,
  // so a reload that fails or is superseded does not flash back to the unconfirmed value.
  const confirmedOn = { segments };
  const recorded = ui.prunePendingChanges(settled, confirmedOn);
  assert.deepEqual(recorded.map((entry) => entry.id), ["a", "b"]);
  assert.equal(ui.prunePendingChanges(recorded, confirmedOn), recorded);
  assert.equal(ui.applyPendingChanges(segments, recorded)[0].reviewState, "approved");
  assert.deepEqual(ui.prunePendingChanges(recorded, { segments: [...segments] }).map((entry) => entry.id), ["a"]);
});

test("pending changes for segments that no longer exist are pruned", () => {
  const kept = native(1, 10);
  const removed = native(2, 20);
  let list = ui.addPendingChange([], { op: "patch", targets: [identity(kept)], values: { startSec: 11 } });
  list = ui.addPendingChange(list, { op: "patch", targets: [identity(removed)], values: { startSec: 21 } });
  list = ui.addPendingChange(list, { op: "insert", segment: { ...native(-1, 0), nativeSegmentId: null } });
  list = ui.addPendingChange(list, { op: "patch", targets: [{ id: -1 }], values: { tagId: 3 } });
  assert.deepEqual(ui.prunePendingChanges(list, { segments: [kept] }).map((entry) => entry.op), ["patch", "insert", "patch"]);
});

test("discarding a failed change does not overwrite newer data from a reload", () => {
  const original = native(1, 10, { reviewState: "unreviewed" });
  const list = ui.addPendingChange([], { taskId: 8, op: "patch", targets: [identity(original)], values: { reviewState: "approved" } });
  // Another save reloaded the segment with a newer start time while this review was in flight.
  const reloaded = [{ ...original, startSec: 14 }];
  const displayed = ui.applyPendingChanges(reloaded, ui.discardPendingChange(list, 8));
  assert.equal(displayed, reloaded);
  assert.equal(displayed[0].startSec, 14);
  // The projection helper this replaces restores the stale value instead.
  const restored = ui.restoreSegmentFieldsProjection({ segments: [{ ...reloaded[0], reviewState: "approved", startSec: 14 }] }, [original], ["reviewState", "startSec"]);
  assert.equal(restored.segments[0].startSec, 10);
});

test("pending changes reducer routes every action", () => {
  const segment = native(1, 10);
  let list = ui.pendingChangesReducer([], { type: "add", entry: { id: "x", taskId: 1, op: "patch", targets: [identity(segment)], values: { tagId: 2 } } });
  assert.equal(list.length, 1);
  list = ui.pendingChangesReducer(list, { type: "settle", key: 1 });
  assert.equal(list[0].settled, true);
  const marked = ui.pendingChangesReducer(list, { type: "prune", detail: { segments: [segment] } });
  assert.equal(marked.length, 1);
  assert.deepEqual(ui.pendingChangesReducer(marked, { type: "prune", detail: { segments: [segment] } }), []);
  assert.deepEqual(ui.pendingChangesReducer(list, { type: "discard", key: "x" }), []);
  assert.deepEqual(ui.pendingChangesReducer(list, { type: "reset" }), []);
  assert.equal(ui.pendingChangesReducer(list, { type: "unknown" }), list);
});
