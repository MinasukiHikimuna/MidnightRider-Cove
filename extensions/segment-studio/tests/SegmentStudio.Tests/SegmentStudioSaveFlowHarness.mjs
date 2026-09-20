// Drives the real editor action factories against a scripted API and an in-memory editor state,
// so save ordering, rollback and selection behaviour can be tested without rendering React.
import { EMPTY_EDITOR_HISTORY } from "../../src/SegmentStudio/ui/shared/constants.js";
import { createSaveQueue, savingSegmentIdFrom } from "../../src/SegmentStudio/ui/editor/model/save-queue.js";
import { applyPendingChanges, pendingChangesReducer } from "../../src/SegmentStudio/ui/editor/model/pending-changes.js";
// Loaded dynamically: swimlanes.js reaches the Cove runtime, which the UI harness registers first.
const { groupSegmentsIntoSwimlanes } = await import("../../src/SegmentStudio/ui/editor/model/swimlanes.js");

const API_ROOT = "/api/plugins/segment-studio";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function jsonResponse(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => null },
    text: async () => (body === undefined ? "" : JSON.stringify(body)),
    json: async () => body,
  };
}

// Routes are matched in registration order. A handler returns a body (200), a `{ status, body }`
// reply via `reply()`, or a promise of either. `hold()` parks matching requests until released.
export function createFakeApi() {
  const routes = [];
  const requests = [];

  function matches(route, method, path) {
    if (route.method !== method) return null;
    if (typeof route.path === "string") return route.path === path ? [] : null;
    return route.path.exec(path);
  }

  async function fetch(url, options = {}) {
    const method = String(options.method || "GET").toUpperCase();
    const path = String(url).startsWith(API_ROOT) ? String(url).slice(API_ROOT.length) : String(url);
    const body = options.body == null ? null : JSON.parse(options.body);
    const request = { method, path, body };
    requests.push(request);
    const route = routes.find((candidate) => matches(candidate, method, path));
    if (!route) return jsonResponse(404, { error: `No fake route for ${method} ${path}` });
    const result = await route.handler(request, matches(route, method, path));
    if (result?.__reply) return jsonResponse(result.status, result.body);
    return result === undefined ? jsonResponse(204) : jsonResponse(200, result);
  }

  return {
    requests,
    fetch,
    on(method, path, handler) {
      routes.push({ method, path, handler: typeof handler === "function" ? handler : () => handler });
      return this;
    },
    hold(method, path) {
      const pending = [];
      const arrivals = [];
      routes.push({
        method,
        path,
        handler: (request) => {
          const gate = deferred();
          pending.push({ request, gate });
          arrivals.shift()?.resolve(request);
          return gate.promise;
        },
      });
      return {
        get pending() { return pending.map((entry) => entry.request); },
        arrived() {
          if (pending.length > arrivals.length) return Promise.resolve(pending[arrivals.length].request);
          const arrival = deferred();
          arrivals.push(arrival);
          return arrival.promise;
        },
        release(result) { pending.shift().gate.resolve(result); },
        fail(status, body) { pending.shift().gate.resolve(reply(status, body)); },
      };
    },
    sent(method, path) {
      return requests.filter((request) => request.method === method
        && (typeof path === "string" ? request.path === path : path.test(request.path)));
    },
  };
}

export function reply(status, body) {
  return { __reply: true, status, body };
}

// Installs the scripted fetch plus the browser globals actions touch, restoring them afterwards.
export async function withEditorGlobals(api, run) {
  const saved = {
    fetch: globalThis.__segmentStudioFetch,
    window: globalThis.window,
    requestAnimationFrame: globalThis.requestAnimationFrame,
  };
  const storage = new Map();
  const dispatched = [];
  globalThis.__segmentStudioFetch = api.fetch;
  globalThis.window = {
    dispatchedEvents: dispatched,
    dispatchEvent: (event) => { dispatched.push(event); return true; },
    addEventListener: () => {},
    removeEventListener: () => {},
    localStorage: {
      getItem: (key) => (storage.has(key) ? storage.get(key) : null),
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
    },
  };
  globalThis.requestAnimationFrame = (callback) => { callback(); return 0; };
  try {
    return await run();
  } finally {
    globalThis.__segmentStudioFetch = saved.fetch;
    globalThis.window = saved.window;
    globalThis.requestAnimationFrame = saved.requestAnimationFrame;
  }
}

export function segment(overrides = {}) {
  return {
    id: 101,
    itemId: null,
    nativeSegmentId: 101,
    published: true,
    tagId: 1,
    tagName: "Example tag",
    tagSortName: null,
    startSec: 10,
    endSec: 20,
    reviewState: "unreviewed",
    revision: 1,
    updatedAt: "2026-01-01T00:00:00Z",
    sourceKey: "user",
    confidence: null,
    isDerived: false,
    ...overrides,
  };
}

// An in-memory stand-in for SegmentEditor and its page: state, refs and setters live here, and
// `context()` snapshots them the way a render would. Build actions again after state changes to
// model a re-render; keep an old action object to model a stale closure.
export function createFakeEditor({ segments = [segment()], compatibilityMode = false, server } = {}) {
  const video = { id: 7, videoFile: { duration: 600 } };
  const state = {
    detail: { video, segments, segmentGroups: [], performerSlots: [], shotBoundaries: [] },
    selectedSegmentId: segments[0]?.id ?? null,
    selectedSegmentIds: segments[0] ? [segments[0].id] : [],
    creatingSegmentId: null,
    pendingChanges: [],
    tagEditing: false,
    saveMessage: "",
    editorFilters: {},
    hideDerivedSegments: false,
    history: EMPTY_EDITOR_HISTORY,
    startInput: "",
    endInput: "",
  };
  const refs = {
    historyRef: { current: EMPTY_EDITOR_HISTORY },
    selectedSegmentIdRef: { current: state.selectedSegmentId },
    selectionAnchorIdRef: { current: state.selectedSegmentId },
    selectionRangeBaseIdsRef: { current: [] },
    optimisticSegmentIdRef: { current: -1 },
    pendingDuplicateRef: { current: null },
    pendingFirstSegmentStartSecRef: { current: null },
    pendingTagEditSegmentIdRef: { current: null },
    tagEditingRef: { current: false },
    pendingReviewStateRef: { current: [] },
    detailPanelRef: { current: null },
    editorRef: { current: null },
  };
  const detailChanges = [];
  const apply = (key) => (value) => {
    state[key] = typeof value === "function" ? value(state[key]) : value;
  };
  const serverDetail = server || (() => state.detail);

  // Like the editor, queued saves wait for a render (`render()`) before reading context.
  let committedContext = null;
  const saveQueue = createSaveQueue({ getContext: () => committedContext, drainAfterSettle: false });
  const editor = {
    state,
    refs,
    saveQueue,
    get savingSegmentId() { return savingSegmentIdFrom(saveQueue.getSnapshot()); },
    detailChanges,
    get segments() { return state.detail.segments; },
    // What the editor shows: server segments plus unconfirmed changes.
    get displayedSegments() { return applyPendingChanges(state.detail.segments, state.pendingChanges); },
    // Models the layout effect that prunes confirmed changes after a render.
    // Models a commit: prune confirmed changes, capture the save context, then let queued saves start.
    render(extra = {}) {
      state.pendingChanges = pendingChangesReducer(state.pendingChanges, { type: "prune", detail: state.detail });
      committedContext = editor.context(extra);
      saveQueue.markCommitted();
      saveQueue.poke();
    },
    select(ids, activeId = ids[0] ?? null) {
      state.selectedSegmentIds = ids;
      state.selectedSegmentId = activeId;
      refs.selectedSegmentIdRef.current = activeId;
    },
    context(extra = {}) {
      const segmentsNow = state.detail.segments;
      // Like the editor, actions see temporary segments that exist only as pending inserts.
      const inserted = state.pendingChanges.filter((entry) => entry.op === "insert" && !entry.settled).map((entry) => entry.segment);
      const byId = new Map([...segmentsNow, ...inserted].map((item) => [item.id, item]));
      const selectedSegment = byId.get(state.selectedSegmentId) || null;
      // Actions pick their next selection from the lanes, so the harness builds them like a render.
      // Nothing is collapsed here, so the expanded lanes are the whole set.
      const allSwimlanes = groupSegmentsIntoSwimlanes(
        editor.displayedSegments, state.detail.segmentGroups, state.detail.performerSlots);
      refs.selectedSegmentIdRef.current = selectedSegment?.id ?? null;
      const setSelectedSegmentId = apply("selectedSegmentId");
      const setSelectedSegmentIds = apply("selectedSegmentIds");
      return {
        ...refs,
        compatibilityMode,
        currentTime: 0,
        detail: state.detail,
        video,
        segments: segmentsNow,
        segmentGroups: state.detail.segmentGroups,
        allSwimlanes,
        swimlanes: allSwimlanes,
        performerSlots: state.detail.performerSlots,
        selectedSegment,
        selectedSegments: state.selectedSegmentIds.map((id) => byId.get(id)).filter(Boolean),
        savingSegmentId: savingSegmentIdFrom(saveQueue.getSnapshot()),
        acquireSaveLock: (kind, lockId) => saveQueue.acquire({ kind, lockId }),
        enqueueSave: (spec) => saveQueue.enqueue(spec),
        stableSaveIdentity: (identity) => saveQueue.stableIdentity(identity),
        cancelSaveTasks: (predicate) => saveQueue.cancel(predicate),
        retargetSaveTasks: (temporaryId, identity) => saveQueue.retarget(temporaryId, identity),
        dispatchPendingChanges(action) {
          state.pendingChanges = pendingChangesReducer(state.pendingChanges, action);
        },
        getSaveQueueSnapshot: saveQueue.getSnapshot,
        creatingSegmentId: state.creatingSegmentId,
        pendingChanges: state.pendingChanges,
        tagEditing: state.tagEditing,
        selectedSegmentIds: state.selectedSegmentIds,
        activeSegmentId: selectedSegment?.id ?? null,
        editorFilters: state.editorFilters,
        hideDerivedSegments: state.hideDerivedSegments,
        startInput: state.startInput,
        endInput: state.endInput,
        mediaDuration: video.videoFile.duration,
        timelineDuration: video.videoFile.duration,
        onDetailChange(next, videoId) {
          detailChanges.push({ next, videoId });
          state.detail = typeof next === "function" ? next(state.detail) : next;
        },
        async onReload() {
          state.detail = serverDetail();
          return state.detail;
        },
        async onConflict() {
          state.detail = serverDetail();
          return state.detail;
        },
        replaceSegmentSelection(segmentId) {
          setSelectedSegmentId(segmentId);
          setSelectedSegmentIds(segmentId == null ? [] : [segmentId]);
          refs.selectionAnchorIdRef.current = segmentId;
          refs.selectionRangeBaseIdsRef.current = [];
        },
        revealSegmentGroupForSelection: () => {},
        closeTagEditing: () => { state.tagEditing = false; },
        setSelectedSegmentId,
        setSelectedSegmentIds,
        setCreatingSegmentId: apply("creatingSegmentId"),
        setSaveMessage: apply("saveMessage"),
        setTagEditing: (value) => { apply("tagEditing")(value); refs.tagEditingRef.current = state.tagEditing; },
        setEditorFilters: apply("editorFilters"),
        setHideDerivedSegments: apply("hideDerivedSegments"),
        setHistory: apply("history"),
        setHistoryOpen: () => {},
        setFirstSegmentTagOpen: () => {},
        setPublishApprovedError: () => {},
        setSelectedSegmentGroupKey: () => {},
        setMergeConfirmation: () => {},
        ...extra,
      };
    },
  };
  committedContext = editor.context();
  return editor;
}
