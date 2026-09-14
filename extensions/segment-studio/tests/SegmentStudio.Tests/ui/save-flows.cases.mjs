import test from "node:test";
import { assert } from "../SegmentStudioUiHarness.mjs";
import { createFakeApi, createFakeEditor, reply, segment, withEditorGlobals } from "../SegmentStudioSaveFlowHarness.mjs";

const actionsRoot = new URL("../../../src/SegmentStudio/ui/editor/actions/", import.meta.url);
// Dynamic imports run after the harness registers the Cove runtime loader.
const { createPrimarySegmentActions } = await import(new URL("primary.js", actionsRoot));
const { createReviewActions } = await import(new URL("review.js", actionsRoot));

function actionsFor(editor, extra = {}) {
  const primary = createPrimarySegmentActions(editor.context(extra));
  const review = createReviewActions(editor.context({
    ...extra,
    acceptHistory: primary.acceptHistory,
    recordHistoryAction: primary.recordHistoryAction,
    selectedGroups: [],
  }));
  return { ...primary, ...review };
}

const historyReply = { revision: 1, cursorSequence: 1, baselineSequence: 0, actions: [] };

test("save flow: a native timing save sends the changed fields and records history", { timeout: 5000 }, async () => {
  const api = createFakeApi()
    .on("PUT", "/videos/7/segments/101", (request) => ({ ...segment(), ...request.body, updatedAt: "2026-01-02T00:00:00Z" }))
    .on("POST", "/videos/7/history/actions", historyReply);
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const actions = actionsFor(editor);
    const saved = await actions.mutateSegment(editor.segments[0], { startSec: 12, endSec: 20, tagId: 1 }, true, null, true);

    assert.equal(saved.startSec, 12);
    const [put] = api.sent("PUT", "/videos/7/segments/101");
    assert.equal(put.body.startSec, 12);
    assert.equal(put.body.expectedUpdatedAt, "2026-01-01T00:00:00Z");
    assert.equal(typeof put.body.historyReceiptId, "string");
    assert.equal(api.sent("POST", "/videos/7/history/actions")[0].body.receiptId, put.body.historyReceiptId);
    assert.equal(editor.segments[0].startSec, 12);
    assert.equal(editor.savingSegmentId, null);
    assert.equal(editor.state.saveMessage, "Saved to Cove");
  });
});

test("save flow: Full-mode drafts save through the draft endpoint with their revision", { timeout: 5000 }, async () => {
  const draft = segment({ id: -55, itemId: 55, nativeSegmentId: null, published: false, revision: 3 });
  const api = createFakeApi()
    .on("PUT", "/videos/7/drafts/55", (request) => ({ draft: { ...draft, ...request.body, revision: 4 } }))
    .on("POST", "/videos/7/history/actions", historyReply);
  const editor = createFakeEditor({ segments: [draft], compatibilityMode: true });
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).mutateSegment(draft, { startSec: 11, endSec: 20, tagId: 1 }, true, null, true);

    const [put] = api.sent("PUT", "/videos/7/drafts/55");
    assert.equal(put.body.expectedRevision, 3);
    assert.equal(typeof put.body.operationId, "string");
    assert.equal(api.sent("PUT", /\/segments\//).length, 0);
    assert.equal(editor.segments[0].revision, 4);
    assert.equal(editor.state.saveMessage, "Draft saved");
  });
});

test("save flow: a busy editor refuses another segment save without sending it", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const editor = createFakeEditor();
  editor.saveQueue.acquire({ kind: "timing", lockId: 999 });
  await withEditorGlobals(api, async () => {
    const result = await actionsFor(editor).mutateSegment(editor.segments[0], { startSec: 12, endSec: 20, tagId: 1 }, true, null, true);

    assert.equal(result, null);
    assert.equal(api.requests.length, 0);
  });
});

test("save flow: a failed timing save rolls the projection back and restores the selection", { timeout: 5000 }, async () => {
  const first = segment();
  const second = segment({ id: 102, nativeSegmentId: 102, startSec: 40, endSec: 50 });
  const api = createFakeApi();
  const put = api.hold("PUT", "/videos/7/segments/101");
  const editor = createFakeEditor({ segments: [first, second] });
  await withEditorGlobals(api, async () => {
    const saving = actionsFor(editor).mutateSegment(first, { startSec: 15, endSec: 20, tagId: 1 }, true, null, true);
    await put.arrived();
    assert.equal(editor.displayedSegments.find((item) => item.id === 101).startSec, 15);
    assert.equal(editor.segments.find((item) => item.id === 101).startSec, 10);
    assert.equal(editor.savingSegmentId, 101);

    editor.select([102]);
    put.fail(500, { error: "Storage unavailable." });
    assert.equal(await saving, null);

    assert.equal(editor.displayedSegments.find((item) => item.id === 101).startSec, 10);
    assert.deepEqual(editor.state.pendingChanges, []);
    assert.deepEqual(editor.state.selectedSegmentIds, [101]);
    assert.equal(editor.state.selectedSegmentId, 101);
    assert.equal(editor.state.saveMessage, "Storage unavailable.");
    assert.equal(editor.savingSegmentId, null);
  });
});

test("save flow: a review requested while another segment saves is queued instead of sent", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const editor = createFakeEditor();
  editor.saveQueue.acquire({ kind: "timing", lockId: 101 });
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).saveSelectedReviewState("approved");

    assert.equal(api.requests.length, 0);
    assert.equal(editor.refs.pendingReviewStateRef.current.length, 1);
    assert.equal(editor.refs.pendingReviewStateRef.current[0].requestedState, "approved");
    assert.equal(editor.state.saveMessage, "Approval queued…");
  });
});

test("save flow: a review requested while a review saves is dropped today", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const editor = createFakeEditor();
  editor.saveQueue.acquire({ kind: "review", lockId: 101 });
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).saveSelectedReviewState("approved");

    assert.equal(api.requests.length, 0);
    assert.equal(editor.refs.pendingReviewStateRef.current.length, 0);
  });
});

test("save flow: a native create selects the saved segment after the reload", { timeout: 5000 }, async () => {
  const existing = segment();
  const created = segment({ id: 205, nativeSegmentId: 205, startSec: 0, endSec: 20 });
  let serverSegments = [existing];
  const api = createFakeApi()
    .on("POST", "/videos/7/segments", () => {
      serverSegments = [created, existing];
      return { id: 205 };
    })
    .on("POST", "/videos/7/history/actions", historyReply);
  const editor = createFakeEditor({
    segments: [existing],
    server: () => ({ ...editor.state.detail, segments: serverSegments }),
  });
  await withEditorGlobals(api, async () => {
    const creating = actionsFor(editor).createSegment();
    // The temporary segment is inserted and selected before the request settles.
    assert.equal(editor.state.selectedSegmentId, -1);
    assert.equal(editor.savingSegmentId, -1);
    assert.equal(editor.state.creatingSegmentId, -1);
    await creating;

    assert.deepEqual(api.sent("POST", "/videos/7/segments")[0].body, {
      tagId: 1,
      startSec: 0,
      endSec: 20,
      historyReceiptId: api.sent("POST", "/videos/7/history/actions")[0].body.receiptId,
    });
    assert.deepEqual(editor.segments.map((item) => item.id), [205, 101]);
    assert.equal(editor.state.selectedSegmentId, 205);
    assert.deepEqual(editor.state.selectedSegmentIds, [205]);
    assert.equal(editor.savingSegmentId, null);
    assert.equal(editor.state.creatingSegmentId, null);
  });
});

test("save flow: a failed create removes the temporary segment and restores the selection", { timeout: 5000 }, async () => {
  const api = createFakeApi().on("POST", "/videos/7/segments", reply(422, { error: "Tag is not allowed." }));
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).createSegment();

    assert.deepEqual(editor.segments.map((item) => item.id), [101]);
    assert.equal(editor.state.selectedSegmentId, 101);
    assert.equal(editor.state.saveMessage, "Tag is not allowed.");
    assert.equal(editor.savingSegmentId, null);
  });
});

test("save flow: a timing save keeps editor changes that landed while it was in flight", { timeout: 5000 }, async () => {
  const api = createFakeApi().on("POST", "/videos/7/history/actions", historyReply);
  const put = api.hold("PUT", "/videos/7/segments/101");
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const saving = actionsFor(editor).mutateSegment(editor.segments[0], { startSec: 12, endSec: 20, tagId: 1 }, true, null, true);
    await put.arrived();
    // A performer slot save finished meanwhile.
    const slot = { segmentId: 101, slotDefinitionId: "giver", performerId: 3 };
    editor.context().onDetailChange((current) => ({ ...current, performerSlots: [slot] }), 7);
    put.release({ ...segment(), startSec: 12, updatedAt: "2026-01-02T00:00:00Z" });
    await saving;

    assert.deepEqual(editor.state.detail.performerSlots, [slot]);
    assert.equal(editor.segments[0].startSec, 12);
    assert.equal(editor.segments[0].updatedAt, "2026-01-02T00:00:00Z");
  });
});

test("save flow: an approval keeps editor changes that landed while it was in flight", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const put = api.hold("PUT", "/videos/7/segments/review-state");
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const reviewing = actionsFor(editor).saveSelectedReviewState("approved");
    const request = await put.arrived();
    assert.equal(request.body.reviewState, "approved");
    assert.equal(editor.segments[0].reviewState, "approved");
    const slot = { segmentId: 101, slotDefinitionId: "giver", performerId: 3 };
    editor.context().onDetailChange((current) => ({ ...current, performerSlots: [slot] }), 7);
    put.release({
      updatedCount: 1,
      items: [{ requestedNativeSegmentId: 101, nativeSegmentId: 101, itemId: null, updatedAt: "2026-01-02T00:00:00Z" }],
    });
    await reviewing;

    assert.deepEqual(editor.state.detail.performerSlots, [slot]);
    assert.equal(editor.segments[0].reviewState, "approved");
    assert.equal(editor.segments[0].updatedAt, "2026-01-02T00:00:00Z");
    assert.equal(editor.state.selectedSegmentId, 101);
    assert.equal(editor.state.saveMessage, "1 selected segment approved.");
  });
});

test("save flow: two creates started before a re-render send only one request", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const post = api.hold("POST", "/videos/7/segments");
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    // Both calls come from the same render, so both see the editor as idle.
    const actions = actionsFor(editor);
    const first = actions.createSegment();
    const second = actions.createSegment();
    await post.arrived();
    await second;

    assert.equal(api.sent("POST", "/videos/7/segments").length, 1);
    assert.equal(editor.segments.filter((item) => item.id < 0).length, 1);
    assert.equal(editor.savingSegmentId, -1);
    post.fail(500, { error: "stop" });
    await first;
    assert.equal(editor.savingSegmentId, null);
  });
});

test("save flow: a review from the same render as another save is queued, not dropped", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const put = api.hold("PUT", "/videos/7/segments/101");
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const actions = actionsFor(editor);
    const saving = actions.mutateSegment(editor.segments[0], { startSec: 12, endSec: 20, tagId: 1 }, true, null, true);
    await actions.saveSelectedReviewState("approved");

    assert.equal(api.sent("PUT", "/videos/7/segments/review-state").length, 0);
    assert.equal(editor.refs.pendingReviewStateRef.current.length, 1);
    assert.equal(editor.state.saveMessage, "Approval queued…");
    put.fail(500, { error: "stop" });
    await saving;
  });
});

test("save flow: the save lock is released when a save fails", { timeout: 5000 }, async () => {
  const api = createFakeApi().on("PUT", "/videos/7/segments/101", reply(500, { error: "Unavailable." }));
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).mutateSegment(editor.segments[0], { startSec: 12, endSec: 20, tagId: 1 }, true, null, true);
    assert.equal(editor.savingSegmentId, null);
    assert.ok(editor.saveQueue.acquire({ kind: "timing", lockId: 101 }));
  });
});

test("save flow: a confirmed timing edit stays displayed until the confirmed data renders", { timeout: 5000 }, async () => {
  const api = createFakeApi().on("POST", "/videos/7/history/actions", historyReply);
  const put = api.hold("PUT", "/videos/7/segments/101");
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const saving = actionsFor(editor).mutateSegment(editor.segments[0], { startSec: 12, endSec: 20, tagId: 1 }, true, null, true);
    await put.arrived();
    const displayedDuringSave = editor.displayedSegments[0];
    put.release({ ...segment(), startSec: 12, updatedAt: "2026-01-02T00:00:00Z" });
    await saving;

    assert.equal(displayedDuringSave.startSec, 12);
    // Before the prune the settled entry is still applied, so no frame shows the old timing.
    assert.equal(editor.state.pendingChanges.length, 1);
    assert.equal(editor.state.pendingChanges[0].settled, true);
    assert.equal(editor.displayedSegments[0].startSec, 12);
    editor.render();
    assert.deepEqual(editor.state.pendingChanges, []);
    assert.equal(editor.displayedSegments[0].startSec, 12);
    assert.equal(editor.displayedSegments[0].updatedAt, "2026-01-02T00:00:00Z");
  });
});

test("save flow: a timing conflict discards the edit and loads the latest segment", { timeout: 5000 }, async () => {
  const api = createFakeApi().on("PUT", "/videos/7/segments/101", reply(409, { error: "Segment changed." }));
  const editor = createFakeEditor({
    server: () => ({ ...editor.state.detail, segments: [segment({ startSec: 30, endSec: 40, updatedAt: "2026-01-03T00:00:00Z" })] }),
  });
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).mutateSegment(editor.segments[0], { startSec: 12, endSec: 20, tagId: 1 }, true, null, true);

    assert.deepEqual(editor.state.pendingChanges, []);
    assert.equal(editor.displayedSegments[0].startSec, 30);
    assert.equal(editor.state.saveMessage, "Conflict — loading the latest segment…");
    assert.equal(editor.savingSegmentId, null);
  });
});

test("save flow: a failed timing edit leaves newer reloaded values in place", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const put = api.hold("PUT", "/videos/7/segments/101");
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const saving = actionsFor(editor).mutateSegment(editor.segments[0], { startSec: 12, endSec: 20, tagId: 1 }, true, null, true);
    await put.arrived();
    // A reload during the save brought a new tag for the same segment.
    editor.context().onDetailChange((current) => ({ ...current, segments: [{ ...current.segments[0], tagId: 5, tagName: "Newer" }] }), 7);
    put.fail(500, { error: "Unavailable." });
    await saving;

    assert.equal(editor.displayedSegments[0].tagId, 5);
    assert.equal(editor.displayedSegments[0].startSec, 10);
  });
});
