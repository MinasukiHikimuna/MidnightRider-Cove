import test from "node:test";
import { assert, ui } from "../SegmentStudioUiHarness.mjs";
import { createFakeApi, createFakeEditor, reply, segment, withEditorGlobals } from "../SegmentStudioSaveFlowHarness.mjs";

const actionsRoot = new URL("../../../src/SegmentStudio/ui/editor/actions/", import.meta.url);
// Dynamic imports run after the harness registers the Cove runtime loader.
const { createPrimarySegmentActions } = await import(new URL("primary.js", actionsRoot));
const { createReviewActions } = await import(new URL("review.js", actionsRoot));
const { createWorkflowActions } = await import(new URL("workflow.js", actionsRoot));
const { createHistoryAndLayoutActions } = await import(new URL("history-and-layout.js", actionsRoot));

function historyActionsFor(editor, actions) {
  return createHistoryAndLayoutActions(editor.context({
    acceptHistory: actions.acceptHistory,
    recordHistoryAction: actions.recordHistoryAction,
    history: editor.state.history,
    historySaving: false,
    setHistorySaving: () => {},
    editorLayout: {},
    shotBoundaries: editor.state.detail.shotBoundaries,
  }));
}

function actionsFor(editor, extra = {}) {
  const primary = createPrimarySegmentActions(editor.context(extra));
  const review = createReviewActions(editor.context({
    selectedGroups: [],
    ...extra,
    acceptHistory: primary.acceptHistory,
    recordHistoryAction: primary.recordHistoryAction,
  }));
  const workflow = createWorkflowActions(editor.context({
    lineage: { data: null },
    ...extra,
    acceptHistory: primary.acceptHistory,
    recordHistoryAction: primary.recordHistoryAction,
    mutateSegment: primary.mutateSegment,
    runSegmentMutation: primary.runSegmentMutation,
  }));
  return { ...primary, ...review, ...workflow };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

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
  // Build the actions first so their render still sees an idle editor and must be stopped by the lock.
  const actions = actionsFor(editor);
  editor.saveQueue.acquire({ kind: "timing", lockId: 999 });
  await withEditorGlobals(api, async () => {
    const result = await actions.mutateSegment(editor.segments[0], { startSec: 12, endSec: 20, tagId: 1 }, true, null, true);

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

test("save flow: a review requested while another segment saves waits and then runs", { timeout: 5000 }, async () => {
  const api = createFakeApi().on("PUT", "/videos/7/segments/review-state", { updatedCount: 1, items: [{ requestedNativeSegmentId: 101, nativeSegmentId: 101, itemId: null, updatedAt: "2026-01-02T00:00:00Z" }] });
  const editor = createFakeEditor();
  const releaseTiming = editor.saveQueue.acquire({ kind: "timing", lockId: 101 });
  await withEditorGlobals(api, async () => {
    const reviewing = actionsFor(editor).saveSelectedReviewState("approved");

    assert.equal(api.requests.length, 0);
    assert.equal(editor.state.saveMessage, "Approval queued…");
    assert.deepEqual(editor.saveQueue.getSnapshot().queued.map((task) => task.kind), ["review"]);
    releaseTiming();
    await new Promise((resolve) => setImmediate(resolve));
    // The queued review starts only once the finished save has rendered.
    assert.equal(api.requests.length, 0);
    editor.render();
    assert.equal((await reviewing).status, "fulfilled");
    assert.equal(api.sent("PUT", "/videos/7/segments/review-state")[0].body.reviewState, "approved");
    assert.equal(editor.segments[0].reviewState, "approved");
  });
});

test("save flow: a second decision during a review is queued and toggles against the saved result", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const put = api.hold("PUT", "/videos/7/segments/review-state");
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const actions = actionsFor(editor);
    const first = actions.saveSelectedReviewState("approved");
    await put.arrived();
    const second = actions.saveSelectedReviewState("approved");
    assert.equal(editor.state.saveMessage, "Approval queued…");
    put.release({ updatedCount: 1, items: [{ requestedNativeSegmentId: 101, nativeSegmentId: 101, itemId: null, updatedAt: "2026-01-02T00:00:00Z" }] });
    await first;
    editor.render();
    const secondRequest = await put.arrived();
    // Pressing approve again on an approved segment resets it, as a toggle.
    assert.equal(secondRequest.body.reviewState, "unreviewed");
    assert.equal(secondRequest.body.segments[0].expectedUpdatedAt, "2026-01-02T00:00:00Z");
    put.release({ updatedCount: 1, items: [{ requestedNativeSegmentId: 101, nativeSegmentId: 101, itemId: null, updatedAt: "2026-01-03T00:00:00Z" }] });
    await second;
    assert.equal(editor.segments[0].reviewState, "unreviewed");
  });
});

test("save flow: a queued review still finds a draft whose id changed while it waited", { timeout: 5000 }, async () => {
  const pendingDraft = segment({ id: -55, itemId: 55, nativeSegmentId: null, published: false, revision: 2 });
  const api = createFakeApi().on("PUT", "/videos/7/segments/review-state", (request) => ({
    updatedCount: 1,
    items: [{ requestedItemId: 55, itemId: 55, nativeSegmentId: null, revision: 4, updatedAt: null }],
  }));
  const editor = createFakeEditor({ segments: [pendingDraft], compatibilityMode: true });
  const releaseTiming = editor.saveQueue.acquire({ kind: "timing", lockId: -55 });
  await withEditorGlobals(api, async () => {
    const reviewing = actionsFor(editor).saveSelectedReviewState("rejected");
    // The running save reloaded the draft with a new local id and revision.
    editor.context().onDetailChange((current) => ({ ...current, segments: [{ ...pendingDraft, id: -56, revision: 3 }] }), 7);
    editor.select([-56]);
    releaseTiming();
    await new Promise((resolve) => setImmediate(resolve));
    editor.render();
    await reviewing;
    const [request] = api.sent("PUT", "/videos/7/segments/review-state");
    assert.deepEqual(request.body.segments, [{ itemId: 55, expectedRevision: 3 }]);
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

function duplicateServer(editor, duplicated) {
  let segments = null;
  return {
    serve: () => ({ ...editor.state.detail, segments: segments || editor.state.detail.segments }),
    duplicate: () => { segments = [...editor.state.detail.segments, duplicated]; },
  };
}

test("save flow: an in-place duplicate opens the tag editor on the copy like a new segment", { timeout: 5000 }, async () => {
  const existing = segment();
  const duplicated = segment({ id: 206, nativeSegmentId: 206, updatedAt: "2026-01-05T00:00:00Z" });
  let server;
  const api = createFakeApi()
    .on("POST", "/videos/7/segments/101/duplicate", () => {
      server.duplicate();
      return { id: 206 };
    })
    .on("POST", "/videos/7/history/actions", historyReply);
  const editor = createFakeEditor({ segments: [existing], server: () => server.serve() });
  server = duplicateServer(editor, duplicated);
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).duplicateSegment(false);

    assert.equal(editor.state.selectedSegmentId, 206);
    // The editor opens the tag field when the selection lands on the id held here.
    assert.equal(editor.refs.pendingTagEditSegmentIdRef.current, 206);
    assert.equal(editor.state.saveMessage, "Duplicate created in place.");
  });
});

test("save flow: a duplicate at the playhead keeps the tag editor closed", { timeout: 5000 }, async () => {
  const existing = segment();
  const duplicated = segment({ id: 206, nativeSegmentId: 206, startSec: 0, updatedAt: "2026-01-05T00:00:00Z" });
  let server;
  const api = createFakeApi()
    .on("POST", "/videos/7/segments/101/duplicate", () => {
      server.duplicate();
      return { id: 206 };
    })
    .on("POST", "/videos/7/history/actions", historyReply);
  const editor = createFakeEditor({ segments: [existing], server: () => server.serve() });
  server = duplicateServer(editor, duplicated);
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).duplicateSegment(true);

    assert.equal(editor.state.selectedSegmentId, 206);
    assert.equal(editor.refs.pendingTagEditSegmentIdRef.current, null);
    assert.equal(editor.state.saveMessage, "Duplicate created at the playhead.");
  });
});

test("save flow: a create whose reload fails drops the slots shown on the temporary segment", { timeout: 5000 }, async () => {
  const api = createFakeApi()
    .on("POST", "/videos/7/drafts", () => ({ draft: { itemId: 55, tagId: 1, startSec: 0, endSec: 20, reviewState: "approved", revision: 1 }, performerSlots: [slotFor(-55, 17, "Alpha")] }));
  const editor = createFakeEditor({ compatibilityMode: true });
  // The create runs as a queued task, so the failing reload has to be in the committed save context.
  editor.render({ onReload: async () => null });
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).createSegment();

    assert.deepEqual(editor.state.detail.performerSlots, []);
    assert.equal(editor.displayedSegments.some((item) => item.id === -1), false);
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
    assert.equal(editor.displayedSegments[0].reviewState, "approved");
    assert.equal(editor.segments[0].reviewState, "unreviewed");
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
    assert.equal(editor.displayedSegments.filter((item) => item.id < 0).length, 1);
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
    void actions.saveSelectedReviewState("approved");

    assert.equal(api.sent("PUT", "/videos/7/segments/review-state").length, 0);
    assert.deepEqual(editor.saveQueue.getSnapshot().queued.map((task) => task.kind), ["review"]);
    assert.equal(editor.state.saveMessage, "Approval queued…");
    editor.saveQueue.cancel(() => true);
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
    editor.render();
    assert.ok(editor.saveQueue.acquire({ kind: "timing", lockId: 101 }));
  });
});

test("save flow: a confirmed timing edit is replaced by the saved segment in the same update", { timeout: 5000 }, async () => {
  const api = createFakeApi().on("POST", "/videos/7/history/actions", historyReply);
  const put = api.hold("PUT", "/videos/7/segments/101");
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const saving = actionsFor(editor).mutateSegment(editor.segments[0], { startSec: 12, endSec: 20, tagId: 1 }, true, null, true);
    await put.arrived();
    assert.equal(editor.displayedSegments[0].startSec, 12);
    put.release({ ...segment(), startSec: 12, updatedAt: "2026-01-02T00:00:00Z" });
    await saving;

    // The saved segment and the removal of the pending edit land together, so the display never falls back.
    assert.deepEqual(editor.state.pendingChanges, []);
    assert.equal(editor.displayedSegments[0].startSec, 12);
    assert.equal(editor.displayedSegments[0].updatedAt, "2026-01-02T00:00:00Z");
  });
});

test("save flow: a reload that confirms a tag change shows the server's values, not the local guess", { timeout: 5000 }, async () => {
  const first = segment();
  const second = segment({ id: 102, nativeSegmentId: 102, startSec: 40, endSec: 50 });
  let serverSegments = [first, second];
  const api = createFakeApi()
    .on("POST", "/videos/7/history/actions", historyReply)
    .on("PUT", "/videos/7/segments/tag", () => {
      serverSegments = serverSegments.map((item) => ({ ...item, tagId: 9, tagName: "Bulk tag", tagSortName: "bulk" }));
    });
  const editor = createFakeEditor({ segments: [first, second], server: () => ({ ...editor.state.detail, segments: serverSegments }) });
  editor.select([101, 102], 101);
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).saveTag(9, "Bulk tag");
    editor.render();
    assert.deepEqual(editor.displayedSegments.map((item) => item.tagSortName), ["bulk", "bulk"]);
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

test("save flow: a mixed review sends published and draft segments with the history revision", { timeout: 5000 }, async () => {
  const published = segment();
  const pendingDraft = segment({ id: -55, itemId: 55, nativeSegmentId: null, published: false, revision: 2, startSec: 30, endSec: 35 });
  const nextHistory = { revision: 4, cursorSequence: 4, baselineSequence: 0, actions: [] };
  const api = createFakeApi().on("PUT", "/videos/7/segments/review-state", {
    updatedCount: 2,
    approvedSetVersion: "v2",
    history: nextHistory,
    items: [
      { requestedNativeSegmentId: 101, nativeSegmentId: 101, itemId: null, updatedAt: "2026-01-02T00:00:00Z" },
      { requestedItemId: 55, itemId: 55, nativeSegmentId: null, revision: 3, updatedAt: null },
    ],
  });
  const editor = createFakeEditor({ segments: [published, pendingDraft], compatibilityMode: true });
  editor.refs.historyRef.current = { ...editor.refs.historyRef.current, revision: 3 };
  editor.select([101, -55], 101);
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).saveSelectedReviewState("approved");

    const [request] = api.sent("PUT", "/videos/7/segments/review-state");
    assert.equal(request.body.expectedHistoryRevision, 3);
    assert.deepEqual(request.body.segments, [
      { nativeSegmentId: 101, expectedUpdatedAt: "2026-01-01T00:00:00Z" },
      { itemId: 55, expectedRevision: 2 },
    ]);
    assert.deepEqual(editor.refs.historyRef.current, nextHistory);
    assert.equal(editor.state.detail.approvedSetVersion, "v2");
    assert.deepEqual(editor.segments.map((item) => [item.id, item.reviewState, item.revision]), [[101, "approved", 1], [-55, "approved", 3]]);
    assert.deepEqual(editor.state.selectedSegmentIds, [101, -55]);
    assert.equal(editor.state.saveMessage, "2 selected segments approved.");
  });
});

test("save flow: a rejection reloads the projection and keeps the selection on the reloaded segment", { timeout: 5000 }, async () => {
  let serverSegments = [segment()];
  const api = createFakeApi().on("PUT", "/videos/7/segments/review-state", () => {
    serverSegments = [segment({ id: 900, nativeSegmentId: 900, reviewState: "rejected" })];
    return { updatedCount: 1, items: [{ requestedNativeSegmentId: 101, nativeSegmentId: 900, itemId: null, updatedAt: null }] };
  });
  const editor = createFakeEditor({ server: () => ({ ...editor.state.detail, segments: serverSegments }) });
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).saveSelectedReviewState("rejected");

    assert.deepEqual(editor.segments.map((item) => [item.id, item.reviewState]), [[900, "rejected"]]);
    assert.equal(editor.state.selectedSegmentId, 900);
    assert.equal(editor.state.saveMessage, "1 selected segment rejected.");
    editor.render();
    // The reloaded projection no longer has the reviewed segment's old identity, so its decision is retired.
    assert.deepEqual(editor.state.pendingChanges, []);
  });
});

test("save flow: a failed review discards its decision and restores the selection", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const put = api.hold("PUT", "/videos/7/segments/review-state");
  const editor = createFakeEditor({ segments: [segment(), segment({ id: 102, nativeSegmentId: 102, startSec: 40, endSec: 50 })] });
  await withEditorGlobals(api, async () => {
    const reviewing = actionsFor(editor).saveSelectedReviewState("approved");
    await put.arrived();
    editor.select([102]);
    put.fail(500, { error: "Review failed." });
    await reviewing;

    assert.deepEqual(editor.state.pendingChanges, []);
    assert.equal(editor.displayedSegments.find((item) => item.id === 101).reviewState, "unreviewed");
    assert.equal(editor.state.selectedSegmentId, 101);
    assert.equal(editor.state.saveMessage, "Review failed.");
  });
});

test("save flow: a tag change to a tag with no lane yet shows the segment in its group before the reload", { timeout: 5000 }, async () => {
  const api = createFakeApi().on("POST", "/videos/7/history/actions", historyReply);
  const put = api.hold("PUT", "/videos/7/segments/101");
  let serverSegments = [segment()];
  const editor = createFakeEditor({ server: () => ({ ...editor.state.detail, segments: serverSegments }) });
  // The editor response carries the whole tag group catalog, including tags without segments in this video.
  editor.state.detail = {
    ...editor.state.detail,
    segmentGroups: [{ id: 5, name: "Orgasm", sortOrder: 0, tags: [{ tagId: 9, tagName: "Facial", tagSortName: "facial", sortOrder: 0 }] }],
  };
  const groupOf = (segmentId) => ui.segmentGroupKeyForSegment(
    ui.groupSegmentsIntoSwimlanes(editor.displayedSegments, editor.state.detail.segmentGroups, editor.state.detail.performerSlots),
    segmentId,
  );
  assert.equal(groupOf(101), "ungrouped");
  await withEditorGlobals(api, async () => {
    const saving = actionsFor(editor).saveTag(9, "Facial");
    await put.arrived();
    // While the save is in flight the segment already sits in its catalog group, never under Ungrouped.
    assert.equal(groupOf(101), "group:5");
    serverSegments = [{ ...segment(), tagId: 9, tagName: "Facial", tagSortName: "facial", updatedAt: "2026-01-02T00:00:00Z" }];
    put.release(serverSegments[0]);
    await saving;
    editor.render();
    assert.equal(groupOf(101), "group:5");
    assert.equal(editor.segments[0].tagId, 9);
  });
});

test("save flow: a saved tag change keeps showing when the reload after it fails", { timeout: 5000 }, async () => {
  const api = createFakeApi()
    .on("PUT", "/videos/7/segments/101", (request) => ({ ...segment(), ...request.body, updatedAt: "2026-01-02T00:00:00Z" }))
    .on("POST", "/videos/7/history/actions", historyReply);
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const actions = actionsFor(editor, { onReload: async () => null });
    await actions.mutateSegment(editor.segments[0], { startSec: 10, endSec: 20, tagId: 9 }, true, null, true, { tagId: 9, tagName: "Saved tag" });
    editor.render();
    editor.render();

    assert.equal(editor.segments[0].tagId, 1);
    assert.equal(editor.displayedSegments[0].tagId, 9);
    assert.equal(editor.displayedSegments[0].tagName, "Saved tag");
  });
});

test("save flow: a native swimlane merge collapses the selection and applies the returned survivor", { timeout: 5000 }, async () => {
  const first = segment({ startSec: 10, endSec: 14 });
  const second = segment({ id: 102, nativeSegmentId: 102, startSec: 20, endSec: 26, updatedAt: "2026-01-01T00:01:00Z" });
  const api = createFakeApi()
    .on("POST", "/videos/7/segments/merge-selection", {
      survivor: { ...first, endSec: 26, updatedAt: "2026-01-02T00:00:00Z" },
      removedSegmentIds: [102],
    })
    .on("POST", "/videos/7/history/actions", historyReply);
  const editor = createFakeEditor({ segments: [first, second] });
  editor.select([101, 102], 101);
  await withEditorGlobals(api, async () => {
    const lane = { key: "tag:1", tagId: 1, markers: [{ segment: first }, { segment: second }] };
    const actions = actionsFor(editor, { selectedGroups: [{ key: "group:1", lanes: [lane] }] });
    await actions.mergeSelectedSwimlane(true);

    const [request] = api.sent("POST", "/videos/7/segments/merge-selection");
    assert.equal(request.body.survivorSegmentId, 101);
    assert.deepEqual(request.body.consumedSegments.map((consumed) => consumed.segmentId), [102]);
    assert.equal(api.sent("POST", "/videos/7/history/actions")[0].body.receiptId, request.body.historyReceiptId);
    assert.deepEqual(editor.segments.map((item) => [item.id, item.startSec, item.endSec]), [[101, 10, 26]]);
    assert.deepEqual(editor.state.selectedSegmentIds, [101]);
    assert.equal(editor.savingSegmentId, null);
  });
});

function createdSegmentServer(editor, created) {
  let segments = null;
  return {
    serve: () => ({ ...editor.state.detail, segments: segments || editor.state.detail.segments }),
    create: () => { segments = [created, ...editor.state.detail.segments]; },
    set: (next) => { segments = next; },
  };
}

test("save flow: a tag picked while a new segment saves is shown and then saved to the created segment", { timeout: 5000 }, async () => {
  const created = segment({ id: 205, nativeSegmentId: 205, startSec: 0, endSec: 20, updatedAt: "2026-01-05T00:00:00Z" });
  const api = createFakeApi()
    .on("POST", "/videos/7/history/actions", historyReply)
    .on("PUT", "/videos/7/segments/205", (request) => ({ ...created, ...request.body, updatedAt: "2026-01-06T00:00:00Z" }));
  const post = api.hold("POST", "/videos/7/segments");
  let server;
  const editor = createFakeEditor({ server: () => server.serve() });
  server = createdSegmentServer(editor, created);
  await withEditorGlobals(api, async () => {
    const creating = actionsFor(editor).createSegment();
    await post.arrived();
    assert.equal(editor.state.tagEditing, true);
    assert.equal(editor.state.creatingSegmentId, -1);

    // The user picks a tag on the temporary segment while its create is still saving.
    await actionsFor(editor).saveTag(9, "Held tag");
    assert.equal(editor.state.saveMessage, "Tag change queued…");
    assert.equal(editor.displayedSegments.find((item) => item.id === -1).tagId, 9);
    assert.equal(api.sent("PUT", /\/segments\/\d+$/).length, 0);

    server.create();
    post.release({ id: 205 });
    await creating;
    // The reloaded segment shows the held tag straight away.
    assert.equal(editor.displayedSegments.find((item) => item.id === 205).tagId, 9);
    assert.equal(editor.displayedSegments.some((item) => item.id === -1), false);
    editor.render();
    await editor.saveQueue.whenIdle();

    const [put] = api.sent("PUT", "/videos/7/segments/205");
    assert.equal(put.body.tagId, 9);
    assert.equal(put.body.expectedUpdatedAt, "2026-01-05T00:00:00Z");
    assert.equal(editor.state.selectedSegmentId, 205);
  });
});

test("save flow: a held tag waits while its tag field is reopened and saves once the user moves on", { timeout: 5000 }, async () => {
  const other = segment();
  const created = segment({ id: 205, nativeSegmentId: 205, startSec: 0, endSec: 20 });
  const api = createFakeApi()
    .on("POST", "/videos/7/history/actions", historyReply)
    .on("PUT", "/videos/7/segments/205", (request) => ({ ...created, ...request.body }));
  const post = api.hold("POST", "/videos/7/segments");
  let server;
  const editor = createFakeEditor({ segments: [other], server: () => server.serve() });
  server = createdSegmentServer(editor, created);
  await withEditorGlobals(api, async () => {
    const creating = actionsFor(editor).createSegment();
    await post.arrived();
    await actionsFor(editor).saveTag(9, "Held tag");
    // The user reopens the tag field on the new segment before the create finishes.
    editor.state.tagEditing = true;
    server.create();
    post.release({ id: 205 });
    await creating;
    editor.render();
    await settle();
    assert.equal(api.sent("PUT", "/videos/7/segments/205").length, 0);

    editor.state.tagEditing = false;
    editor.select([101]);
    editor.render();
    await editor.saveQueue.whenIdle();
    assert.equal(api.sent("PUT", "/videos/7/segments/205")[0].body.tagId, 9);
    // Saving in the background does not move the selection the user chose.
    assert.equal(editor.state.selectedSegmentId, 101);
  });
});

test("save flow: re-picking the original tag drops the held choice", { timeout: 5000 }, async () => {
  const api = createFakeApi().on("POST", "/videos/7/history/actions", historyReply);
  const post = api.hold("POST", "/videos/7/segments");
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const creating = actionsFor(editor).createSegment();
    await post.arrived();
    await actionsFor(editor).saveTag(9, "Held tag");
    await actionsFor(editor).saveTag(1, "Example tag");

    assert.equal(editor.state.saveMessage, "");
    assert.equal(editor.state.pendingChanges.filter((entry) => entry.meta?.kind === "held-tag").length, 0);
    assert.equal(editor.saveQueue.getSnapshot().queued.length, 0);
    post.fail(500, { error: "stop" });
    await creating;
  });
});

test("save flow: a failed create drops the tag held for it", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const post = api.hold("POST", "/videos/7/segments");
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const creating = actionsFor(editor).createSegment();
    await post.arrived();
    await actionsFor(editor).saveTag(9, "Held tag");
    post.fail(422, { error: "Tag is not allowed." });
    await creating;
    editor.render();
    await settle();
    editor.render();

    assert.equal(editor.state.saveMessage, "Tag is not allowed.");
    assert.deepEqual(editor.displayedSegments.map((item) => item.id), [101]);
    assert.deepEqual(editor.state.pendingChanges, []);
    assert.equal(api.sent("PUT", /\/segments\/\d+$/).length, 0);
    assert.equal(editor.state.selectedSegmentId, 101);
  });
});

test("save flow: an approval requested while a new segment saves applies to the created segment", { timeout: 5000 }, async () => {
  const created = segment({ id: 205, nativeSegmentId: 205, startSec: 0, endSec: 20 });
  const api = createFakeApi()
    .on("POST", "/videos/7/history/actions", historyReply)
    .on("PUT", "/videos/7/segments/review-state", { updatedCount: 1, items: [{ requestedNativeSegmentId: 205, nativeSegmentId: 205, itemId: null, updatedAt: null }] });
  const post = api.hold("POST", "/videos/7/segments");
  let server;
  const editor = createFakeEditor({ server: () => server.serve() });
  server = createdSegmentServer(editor, created);
  await withEditorGlobals(api, async () => {
    const creating = actionsFor(editor).createSegment();
    await post.arrived();
    editor.state.tagEditing = false;
    const reviewing = actionsFor(editor).saveSelectedReviewState("approved");
    assert.equal(editor.state.saveMessage, "Approval queued…");
    server.create();
    post.release({ id: 205 });
    await creating;
    editor.render();
    assert.equal((await reviewing).status, "fulfilled");

    const [request] = api.sent("PUT", "/videos/7/segments/review-state");
    assert.deepEqual(request.body.segments, [{ nativeSegmentId: 205, expectedUpdatedAt: "2026-01-01T00:00:00Z" }]);
    assert.notEqual(editor.state.saveMessage, "The queued review could not find its segment after refreshing.");
  });
});

function slotFor(segmentId, performerId, performerName) {
  return { segmentId, slotDefinitionId: "slot-1", label: null, sortOrder: 0, genderHints: [], performerId, performerName, allowSamePerformerInMultipleSlots: false };
}

test("save flow: a created draft shows the performer slots the server assigned before the reload", { timeout: 5000 }, async () => {
  const existing = segment({ id: -50, itemId: 50, nativeSegmentId: null, published: false, revision: 1 });
  const created = { ...existing, id: -55, itemId: 55, startSec: 0, endSec: 20 };
  let serverSegments = [existing];
  let serverSlots = [];
  let slotsSeenByReload = null;
  let revisionsSeenByReload = null;
  const api = createFakeApi()
    .on("POST", "/videos/7/drafts", () => {
      serverSegments = [created, existing];
      serverSlots = [slotFor(-55, 17, "Alpha")];
      return { draft: { itemId: 55, tagId: 1, startSec: 0, endSec: 20, reviewState: "approved", revision: 1 }, performerSlots: serverSlots, performerSlotRevision: "rev-a" };
    });
  const editor = createFakeEditor({
    segments: [existing],
    compatibilityMode: true,
    server: () => {
      slotsSeenByReload = editor.state.detail.performerSlots;
      revisionsSeenByReload = editor.state.detail.performerSlotRevisions;
      return { ...editor.state.detail, segments: serverSegments, performerSlots: serverSlots };
    },
  });
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).createSegment();

    // The temporary segment carried the assignment from the create response while the reload was pending.
    assert.deepEqual(slotsSeenByReload, [slotFor(-1, 17, "Alpha")]);
    assert.equal(revisionsSeenByReload?.[-1], "rev-a");
    assert.deepEqual(editor.state.detail.performerSlots, [slotFor(-55, 17, "Alpha")]);
    assert.equal(editor.state.selectedSegmentId, -55);
  });
});

test("save flow: a draft tag change shows the remapped performer slots before the reload", { timeout: 5000 }, async () => {
  const draft = segment({ id: -55, itemId: 55, nativeSegmentId: null, published: false, revision: 3 });
  let serverSegments = [draft];
  let serverSlots = [];
  let slotsSeenByReload = null;
  const api = createFakeApi()
    .on("PUT", "/videos/7/drafts/55", (request) => {
      serverSegments = [{ ...draft, tagId: 9, tagName: "Retagged", revision: 4 }];
      serverSlots = [slotFor(-55, 23, "Beta")];
      return { draft: { ...draft, ...request.body, revision: 4 }, performerSlots: serverSlots, performerSlotRevision: "rev-b" };
    });
  const editor = createFakeEditor({
    segments: [draft],
    compatibilityMode: true,
    server: () => {
      slotsSeenByReload = editor.state.detail.performerSlots;
      return { ...editor.state.detail, segments: serverSegments, performerSlots: serverSlots };
    },
  });
  await withEditorGlobals(api, async () => {
    await actionsFor(editor).mutateSegment(draft, { startSec: 10, endSec: 20, tagId: 9 }, true, null, true);

    assert.deepEqual(slotsSeenByReload, [slotFor(-55, 23, "Beta")]);
    assert.deepEqual(editor.state.detail.performerSlots, [slotFor(-55, 23, "Beta")]);
    // Slot edits made before the reload save against the remapped revision, not the stale one.
    assert.equal(editor.state.detail.performerSlotRevisions?.[-55], "rev-b");
    assert.equal(editor.segments[0].tagId, 9);
  });
});

test("save flow: a Full-mode draft being created shows the approved state the server gives it", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const post = api.hold("POST", "/videos/7/drafts");
  const editor = createFakeEditor({ compatibilityMode: true });
  await withEditorGlobals(api, async () => {
    const creating = actionsFor(editor).createSegment();
    await post.arrived();
    assert.equal(editor.displayedSegments.find((item) => item.id < 0).reviewState, "approved");
    post.fail(500, { error: "stop" });
    await creating;
  });
});

test("editor reloads replaced by a newer reload resolve with the newer result instead of failing", { timeout: 5000 }, async () => {
  let requestCounter = 0;
  let currentVideo = 7;
  const gates = [];
  const applied = [];
  const reload = ui.createEditorReloader({
    beginRequest: () => ({ requestId: ++requestCounter, videoId: currentVideo }),
    fetchDetail: (request) => new Promise((resolve, reject) => gates.push({ request, resolve, reject })),
    isCurrent: (request) => request.requestId === requestCounter && request.videoId === currentVideo,
    isSameVideo: (request) => request.videoId === currentVideo,
  });
  const callbacks = { onLoaded: (loaded) => applied.push(loaded), onError: (error) => applied.push(error.message) };

  const first = reload(callbacks);
  const second = reload(callbacks);
  gates[0].resolve({ version: 1 });
  gates[1].resolve({ version: 2 });
  assert.deepEqual(await first, { version: 2 });
  assert.deepEqual(await second, { version: 2 });
  // Only the newest reload applies its data.
  assert.deepEqual(applied, [{ version: 2 }]);

  const failing = reload(callbacks);
  gates[2].reject(new Error("offline"));
  assert.equal(await failing, null);
  assert.deepEqual(applied.at(-1), "offline");

  const stale = reload(callbacks);
  currentVideo = 8;
  requestCounter += 1;
  gates[3].resolve({ version: 3 });
  assert.equal(await stale, null);
});

test("save flow: a shot edit requested during a segment save waits and records history against the saved revision", { timeout: 5000 }, async () => {
  const api = createFakeApi()
    .on("POST", "/videos/7/history/actions", (request) => ({ ...historyReply, revision: request.body.expectedRevision + 1 }))
    .on("POST", "/videos/7/shot-boundaries/split", [{ timeSec: 0 }, { timeSec: 30 }]);
  const put = api.hold("PUT", "/videos/7/segments/101");
  const editor = createFakeEditor();
  editor.state.detail = { ...editor.state.detail, shotBoundaries: [{ timeSec: 0 }] };
  await withEditorGlobals(api, async () => {
    const actions = actionsFor(editor);
    const saving = actions.mutateSegment(editor.segments[0], { startSec: 12, endSec: 20, tagId: 1 }, true, null, true);
    await put.arrived();
    const splitting = historyActionsFor(editor, actions).mutateShotBoundary("split", true, 30);
    assert.equal(editor.state.saveMessage, "Shot boundary queued…");
    assert.equal(api.sent("POST", "/videos/7/shot-boundaries/split").length, 0);

    put.release({ ...segment(), startSec: 12 });
    await saving;
    editor.render();
    assert.deepEqual(await splitting, [{ timeSec: 0 }, { timeSec: 30 }]);

    const history = api.sent("POST", "/videos/7/history/actions");
    assert.deepEqual(history.map((request) => [request.body.kind, request.body.expectedRevision]), [["segment.update", 0], ["shots.update", 1]]);
    assert.deepEqual(history[1].body.beforeState.boundaries, [{ timeSec: 0 }]);
    assert.deepEqual(editor.state.detail.shotBoundaries, [{ timeSec: 0 }, { timeSec: 30 }]);
    assert.equal(editor.state.saveMessage, "Shot boundary added.");
  });
});

test("save flow: work outside segment saves waits for the lock instead of racing a save", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const editor = createFakeEditor();
  const errors = {};
  const actions = actionsFor(editor, {
    autoAssignCandidates: [segment()],
    materializePreview: { createCount: 1, linkCount: 0, fingerprint: "f1" },
    incorrectExamples: [],
    setAutoAssignError: (message) => { errors.autoAssign = message; },
    setMaterializeError: (message) => { errors.materialize = message; },
    setAutoAssigning: () => {},
    setMaterializing: () => {},
    setRemovingExampleId: () => {},
  });
  editor.saveQueue.acquire({ kind: "timing", lockId: 101 });
  await withEditorGlobals(api, async () => {
    await actions.autoAssignPerformers();
    await actions.materializeDerivedSegments();
    await actions.removeIncorrectExample({ id: 3, itemId: 55, revision: 1, representationRevision: 1 });

    assert.equal(api.requests.length, 0);
    assert.equal(errors.autoAssign, "Wait for the current save to finish before assigning performers.");
    assert.equal(errors.materialize, "Wait for the current save to finish before materializing derived segments.");
    assert.equal(editor.state.saveMessage, "Wait for the current save to finish before removing the incorrect example.");
  });
});

test("save flow: auto-assign holds the save lock until its reload finishes", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const post = api.hold("POST", "/videos/7/segments/auto-assign-performer-slots");
  const editor = createFakeEditor();
  const actions = actionsFor(editor, {
    autoAssignCandidates: [segment()],
    setAutoAssignError: () => {},
    setAutoAssigning: () => {},
    setAutoAssignOpen: () => {},
  });
  await withEditorGlobals(api, async () => {
    const assigning = actions.autoAssignPerformers();
    await post.arrived();
    assert.equal(editor.savingSegmentId, -1);
    post.release({ assignedSegmentCount: 1, assignedSlotCount: 2 });
    await assigning;
    assert.equal(editor.savingSegmentId, null);
    assert.equal(editor.state.saveMessage, "1 segment received 2 performer-slot assignments.");
  });
});

test("save flow: deleting rejected segments hides them until the deletion is confirmed", { timeout: 5000 }, async () => {
  const kept = segment({ id: 102, nativeSegmentId: 102, startSec: 40, endSec: 50 });
  const rejected = segment({ reviewState: "rejected" });
  let serverSegments = [rejected, kept];
  const api = createFakeApi();
  const execute = api.hold("POST", "/videos/7/rejected/deletion/execute");
  const editor = createFakeEditor({ segments: [rejected, kept], server: () => ({ ...editor.state.detail, segments: serverSegments }) });
  const preview = { fingerprint: "fp", deletedSegmentCount: 1, deferredRejectedSegmentCount: 0 };
  await withEditorGlobals(api, async () => {
    const actions = actionsFor(editor, { incorrectExamples: [], setRejectedDeletionPreview: () => {} });
    const deleting = actions.deleteRejectedSegments(preview);
    await execute.arrived();
    assert.deepEqual(editor.displayedSegments.map((item) => item.id), [102]);
    assert.deepEqual(editor.segments.map((item) => item.id), [101, 102]);
    assert.equal(editor.state.selectedSegmentId, 102);

    serverSegments = [kept];
    execute.release({ deletedSegmentCount: 1 });
    await deleting;
    editor.render();
    assert.deepEqual(editor.displayedSegments.map((item) => item.id), [102]);
    assert.deepEqual(editor.state.pendingChanges, []);
    assert.equal(editor.state.saveMessage, "1 segment permanently deleted.");
  });
});

test("save flow: a failed rejected-segment deletion shows the segments again", { timeout: 5000 }, async () => {
  const kept = segment({ id: 102, nativeSegmentId: 102, startSec: 40, endSec: 50 });
  const rejected = segment({ reviewState: "rejected" });
  const api = createFakeApi().on("POST", "/videos/7/rejected/deletion/execute", reply(409, { error: "Deletion changed." }));
  const editor = createFakeEditor({ segments: [rejected, kept] });
  const preview = { fingerprint: "fp", deletedSegmentCount: 1, deferredRejectedSegmentCount: 0 };
  await withEditorGlobals(api, async () => {
    await actionsFor(editor, { incorrectExamples: [], setRejectedDeletionPreview: () => {} }).deleteRejectedSegments(preview);

    assert.deepEqual(editor.displayedSegments.map((item) => item.id), [101, 102]);
    assert.equal(editor.state.selectedSegmentId, 101);
    assert.equal(editor.state.saveMessage, "Deletion changed.");
    assert.equal(editor.savingSegmentId, null);
  });
});

test("save flow: a bulk tag change is shown until the reload confirms it and records history", { timeout: 5000 }, async () => {
  const first = segment();
  const second = segment({ id: 102, nativeSegmentId: 102, startSec: 40, endSec: 50 });
  let serverSegments = [first, second];
  const api = createFakeApi().on("POST", "/videos/7/history/actions", historyReply);
  const put = api.hold("PUT", "/videos/7/segments/tag");
  const editor = createFakeEditor({ segments: [first, second], server: () => ({ ...editor.state.detail, segments: serverSegments }) });
  editor.select([101, 102], 101);
  await withEditorGlobals(api, async () => {
    const saving = actionsFor(editor).saveTag(9, "Bulk tag");
    const request = await put.arrived();
    assert.deepEqual(request.body.segments.map((item) => item.nativeSegmentId), [101, 102]);
    assert.deepEqual(editor.displayedSegments.map((item) => item.tagId), [9, 9]);
    assert.deepEqual(editor.segments.map((item) => item.tagId), [1, 1]);

    serverSegments = serverSegments.map((item) => ({ ...item, tagId: 9, tagName: "Bulk tag" }));
    put.release(undefined);
    await saving;
    editor.render();
    assert.deepEqual(editor.displayedSegments.map((item) => item.tagId), [9, 9]);
    const [history] = api.sent("POST", "/videos/7/history/actions");
    assert.equal(history.body.kind, "segments.tag");
    assert.equal(history.body.receiptId, request.body.historyReceiptId);
    assert.deepEqual(editor.state.selectedSegmentIds, [101, 102]);
    assert.equal(editor.state.saveMessage, "2 selected segments retagged.");
  });
});

test("save flow: a failed bulk tag change leaves newer reloaded values in place", { timeout: 5000 }, async () => {
  const first = segment();
  const second = segment({ id: 102, nativeSegmentId: 102, startSec: 40, endSec: 50 });
  const api = createFakeApi();
  const put = api.hold("PUT", "/videos/7/segments/tag");
  const editor = createFakeEditor({ segments: [first, second] });
  editor.select([101, 102], 101);
  await withEditorGlobals(api, async () => {
    const saving = actionsFor(editor).saveTag(9, "Bulk tag");
    await put.arrived();
    editor.context().onDetailChange((current) => ({ ...current, segments: current.segments.map((item) => ({ ...item, startSec: item.startSec + 1 })) }), 7);
    put.fail(500, { error: "Retag failed." });
    await saving;

    assert.deepEqual(editor.displayedSegments.map((item) => [item.tagId, item.startSec]), [[1, 11], [1, 41]]);
    assert.equal(editor.state.saveMessage, "Retag failed.");
  });
});

function lineageEditor(extraSegments = []) {
  const owned = segment({ id: -55, itemId: 55, nativeSegmentId: null, published: false, revision: 3 });
  const editor = createFakeEditor({ segments: [owned, ...extraSegments], compatibilityMode: true });
  return { owned, editor, extra: { lineage: { data: { children: [{ itemId: 56 }] } } } };
}

test("save flow: a lineage tag change holds the save lock through its confirmation", { timeout: 5000 }, async () => {
  const { editor, extra } = lineageEditor();
  let lockedDuringConfirm = null;
  const api = createFakeApi()
    .on("POST", "/items/55/tag-change/preview", { deletedItemIds: [56], removedEdgeIds: [7], componentFingerprint: "c1" })
    .on("POST", "/items/55/tag-change/execute", { ok: true });
  await withEditorGlobals(api, async () => {
    globalThis.window.confirm = () => {
      lockedDuringConfirm = editor.savingSegmentId;
      return true;
    };
    await actionsFor(editor, extra).saveTag(9, "Lineage tag");

    // The confirmation blocks the page, so keeping the lock lets nothing else take it in between.
    assert.equal(lockedDuringConfirm, -55);
    const [execute] = api.sent("POST", "/items/55/tag-change/execute");
    assert.equal(execute.body.expectedRevision, 3);
    assert.equal(execute.body.componentFingerprint, "c1");
    assert.equal(execute.body.tagId, 9);
    assert.equal(editor.state.saveMessage, "Tag changed and lineage reconciled.");
    assert.equal(editor.savingSegmentId, null);
  });
});

test("save flow: a lineage conflict discards the pending tag and loads the latest segments", { timeout: 5000 }, async () => {
  const { editor, extra } = lineageEditor();
  const api = createFakeApi()
    .on("POST", "/items/55/tag-change/preview", { deletedItemIds: [], removedEdgeIds: [7], componentFingerprint: "c1" })
    .on("POST", "/items/55/tag-change/execute", reply(409, { error: "Lineage changed." }));
  const reloads = [];
  await withEditorGlobals(api, async () => {
    globalThis.window.confirm = () => true;
    await actionsFor(editor, { ...extra, onConflict: async () => { reloads.push("conflict"); return editor.state.detail; } }).saveTag(9, "Lineage tag");

    assert.deepEqual(reloads, ["conflict"]);
    assert.deepEqual(editor.state.pendingChanges, []);
    assert.equal(editor.displayedSegments[0].tagId, 1);
    assert.equal(editor.state.saveMessage, "Lineage changed — loading the latest segments…");
    assert.equal(editor.savingSegmentId, null);
  });
});

test("save flow: cancelling a destructive lineage change sends nothing and leaves the tag", { timeout: 5000 }, async () => {
  const { editor, extra } = lineageEditor();
  const api = createFakeApi()
    .on("POST", "/items/55/tag-change/preview", { deletedItemIds: [56], removedEdgeIds: [], componentFingerprint: "c1" });
  await withEditorGlobals(api, async () => {
    globalThis.window.confirm = () => false;
    await actionsFor(editor, extra).saveTag(9, "Lineage tag");

    assert.equal(api.sent("POST", "/items/55/tag-change/execute").length, 0);
    assert.deepEqual(editor.state.pendingChanges, []);
    assert.equal(editor.state.saveMessage, "Tag change canceled.");
    assert.equal(editor.savingSegmentId, null);
  });
});

test("save flow: a merge shows the merged span until confirmed and a failure restores both segments", { timeout: 5000 }, async () => {
  const first = segment({ startSec: 10, endSec: 14 });
  const second = segment({ id: 102, nativeSegmentId: 102, startSec: 20, endSec: 26 });
  const api = createFakeApi();
  const post = api.hold("POST", "/videos/7/segments/merge-selection");
  const editor = createFakeEditor({ segments: [first, second] });
  editor.select([101, 102], 101);
  const lane = { key: "tag:1", tagId: 1, markers: [{ segment: first }, { segment: second }] };
  await withEditorGlobals(api, async () => {
    const merging = actionsFor(editor, { selectedGroups: [{ key: "group:1", lanes: [lane] }] }).mergeSelectedSwimlane(true);
    await post.arrived();
    assert.deepEqual(editor.displayedSegments.map((item) => [item.id, item.startSec, item.endSec]), [[101, 10, 26]]);
    assert.deepEqual(editor.segments.map((item) => item.id), [101, 102]);
    assert.deepEqual(editor.state.selectedSegmentIds, [101]);

    post.fail(500, { error: "Merge failed." });
    await merging;
    assert.deepEqual(editor.displayedSegments.map((item) => [item.id, item.startSec, item.endSec]), [[101, 10, 14], [102, 20, 26]]);
    assert.deepEqual(editor.state.selectedSegmentIds, [101, 102]);
    assert.equal(editor.state.saveMessage, "Merge failed.");
    assert.equal(editor.savingSegmentId, null);
  });
});

test("save flow: a history restore runs alone and refuses new saves until it finishes", { timeout: 5000 }, async () => {
  const api = createFakeApi().on("PUT", "/videos/7/segments/review-state", { updatedCount: 1, items: [] });
  const restore = api.hold("POST", "/videos/7/history/native-state");
  const editor = createFakeEditor();
  const history = {
    revision: 2,
    cursorSequence: 2,
    baselineSequence: 0,
    actions: [{ sequence: 2, kind: "segment.update", beforeState: { type: "segment" }, afterState: { type: "segment" } }],
  };
  editor.state.history = history;
  editor.refs.historyRef.current = history;
  await withEditorGlobals(api, async () => {
    const actions = actionsFor(editor);
    const restoring = historyActionsFor(editor, actions).restoreHistoryTarget(1);
    const request = await restore.arrived();
    assert.equal(request.body.expectedHistoryRevision, 2);
    assert.equal(editor.savingSegmentId, -1);

    // Neither a queued review nor a shot edit can be added behind a running restore.
    assert.equal(await actionsFor(editor).saveSelectedReviewState("approved"), null);
    assert.equal(editor.state.saveMessage, "Wait for the history restore to finish.");
    assert.equal(editor.saveQueue.getSnapshot().queued.length, 0);

    restore.release({ history: { ...history, cursorSequence: 1 } });
    await restoring;
    assert.equal(editor.savingSegmentId, null);
    assert.equal(editor.state.saveMessage, "History restored.");
    assert.equal(api.sent("PUT", "/videos/7/segments/review-state").length, 0);
  });
});

test("save flow: a history restore is refused while a held tag waits for its tag field", { timeout: 5000 }, async () => {
  const created = segment({ id: 205, nativeSegmentId: 205, startSec: 0, endSec: 20 });
  const api = createFakeApi().on("POST", "/videos/7/history/actions", historyReply);
  const post = api.hold("POST", "/videos/7/segments");
  let server;
  const editor = createFakeEditor({ server: () => server.serve() });
  server = createdSegmentServer(editor, created);
  const history = {
    revision: 2,
    cursorSequence: 2,
    baselineSequence: 0,
    actions: [{ sequence: 2, kind: "segment.update", beforeState: { type: "segment" }, afterState: { type: "segment" } }],
  };
  await withEditorGlobals(api, async () => {
    const creating = actionsFor(editor).createSegment();
    await post.arrived();
    await actionsFor(editor).saveTag(9, "Held tag");
    editor.state.tagEditing = true;
    server.create();
    post.release({ id: 205 });
    await creating;
    editor.render();
    editor.state.history = history;
    editor.refs.historyRef.current = history;

    const actions = actionsFor(editor);
    await historyActionsFor(editor, actions).restoreHistoryTarget(1);
    assert.equal(editor.state.saveMessage, "Finish the pending saves before restoring history.");
    assert.equal(api.sent("POST", "/videos/7/history/native-state").length, 0);
    // The held choice is still waiting and still shown.
    assert.equal(editor.displayedSegments.find((item) => item.id === 205).tagId, 9);
    assert.equal(editor.saveQueue.getSnapshot().queued.map((task) => task.kind).join(), "held-tag");
  });
});

test("save flow: a tag picked from a render that still shows the temporary segment is saved to the created segment", { timeout: 5000 }, async () => {
  const created = segment({ id: 205, nativeSegmentId: 205, startSec: 0, endSec: 20 });
  const api = createFakeApi()
    .on("POST", "/videos/7/history/actions", historyReply)
    .on("PUT", "/videos/7/segments/205", (request) => ({ ...created, ...request.body }));
  const post = api.hold("POST", "/videos/7/segments");
  let server;
  const editor = createFakeEditor({ server: () => server.serve() });
  server = createdSegmentServer(editor, created);
  await withEditorGlobals(api, async () => {
    const creating = actionsFor(editor).createSegment();
    await post.arrived();
    // Actions from the render that still shows the temporary segment.
    const staleActions = actionsFor(editor);
    server.create();
    post.release({ id: 205 });
    await creating;
    editor.state.tagEditing = false;

    await staleActions.saveTag(9, "Late tag");
    editor.render();
    await editor.saveQueue.whenIdle();
    assert.equal(api.sent("PUT", "/videos/7/segments/205")[0]?.body.tagId, 9);
  });
});

test("editor reloads never resolve with a reload for another video", { timeout: 5000 }, async () => {
  let requestCounter = 0;
  let currentVideo = 7;
  const gates = [];
  const reload = ui.createEditorReloader({
    beginRequest: () => ({ requestId: ++requestCounter, videoId: currentVideo }),
    fetchDetail: (request) => new Promise((resolve) => gates.push({ request, resolve })),
    isCurrent: (request) => request.requestId === requestCounter && request.videoId === currentVideo,
    isSameVideo: (request) => request.videoId === currentVideo,
  });
  const callbacks = { onLoaded: () => {}, onError: () => {} };
  const onA = reload(callbacks);
  currentVideo = 8;
  const onB = reload(callbacks);
  gates[1].resolve({ video: 8 });
  assert.deepEqual(await onB, { video: 8 });
  // The editor went back to the first video before its reload finished.
  currentVideo = 7;
  gates[0].resolve({ video: 7 });
  assert.equal(await onA, null);
});

test("save flow: re-picking a held tag keeps the earlier choice when the new one is refused", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const post = api.hold("POST", "/videos/7/segments");
  const editor = createFakeEditor();
  await withEditorGlobals(api, async () => {
    const creating = actionsFor(editor).createSegment();
    await post.arrived();
    await actionsFor(editor).saveTag(9, "First choice");
    // Nothing new can be queued (as during a history restore), so the second choice is refused.
    const refusing = actionsFor(editor, { enqueueSave: () => null });
    await refusing.saveTag(12, "Second choice");

    assert.equal(editor.state.saveMessage, "Wait for the history restore to finish.");
    assert.equal(editor.displayedSegments.find((item) => item.id === -1).tagId, 9);
    assert.equal(editor.saveQueue.getSnapshot().queued.map((task) => task.kind).join(), "held-tag");
    post.fail(500, { error: "stop" });
    await creating;
  });
});

test("save flow: a held tag whose segment disappeared says it was not saved", { timeout: 5000 }, async () => {
  const created = segment({ id: 205, nativeSegmentId: 205, startSec: 0, endSec: 20 });
  const api = createFakeApi().on("POST", "/videos/7/history/actions", historyReply);
  const post = api.hold("POST", "/videos/7/segments");
  let server;
  const editor = createFakeEditor({ server: () => server.serve() });
  server = createdSegmentServer(editor, created);
  await withEditorGlobals(api, async () => {
    const creating = actionsFor(editor).createSegment();
    await post.arrived();
    await actionsFor(editor).saveTag(9, "Held tag");
    server.create();
    post.release({ id: 205 });
    await creating;
    // The created segment was removed (for example undone elsewhere) before the held tag could save.
    editor.context().onDetailChange((current) => ({ ...current, segments: current.segments.filter((item) => item.id !== 205) }), 7);
    editor.state.tagEditing = false;
    editor.render();
    await editor.saveQueue.whenIdle();

    assert.equal(editor.state.saveMessage, "The new segment was not retagged to Held tag. Choose its tag again.");
    assert.equal(api.sent("PUT", /\/segments\/\d+$/).length, 0);
  });
});

test("save flow: a history restore replays the history current when it starts", { timeout: 5000 }, async () => {
  const api = createFakeApi();
  const restore = api.hold("POST", "/videos/7/history/native-state");
  const editor = createFakeEditor();
  const older = {
    revision: 2,
    cursorSequence: 2,
    baselineSequence: 0,
    actions: [{ sequence: 2, kind: "segment.update", beforeState: { type: "segment" }, afterState: { type: "segment" } }],
  };
  editor.state.history = older;
  editor.refs.historyRef.current = older;
  await withEditorGlobals(api, async () => {
    const historyActions = historyActionsFor(editor, actionsFor(editor));
    // A save recorded one more action after the dialog rendered.
    editor.refs.historyRef.current = {
      ...older,
      revision: 3,
      cursorSequence: 3,
      actions: [...older.actions, { sequence: 3, kind: "segment.update", beforeState: { type: "segment" }, afterState: { type: "segment" } }],
    };
    const restoring = historyActions.restoreHistoryTarget(1);
    const first = await restore.arrived();
    assert.equal(first.body.actionSequence, 3);
    restore.release({ history: { ...editor.refs.historyRef.current, cursorSequence: 2 } });
    const second = await restore.arrived();
    assert.equal(second.body.actionSequence, 2);
    restore.release({ history: { ...editor.refs.historyRef.current, cursorSequence: 1 } });
    await restoring;
  });
});
