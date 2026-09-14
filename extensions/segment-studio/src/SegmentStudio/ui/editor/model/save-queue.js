// A framework-free queue that runs editor mutations one at a time. Tasks read editor context when
// they start rather than when they were requested, so a queued save sees the data left by the saves
// before it. React subscribes through `subscribe`/`getSnapshot`.

// Segments change `id` when a draft is approved, so identities compare by item, then native segment,
// then the local id (temporary segments have no stable identity yet).
export function sameSegmentIdentity(left, right) {
  if (!left || !right) return false;
  if (left.itemId != null && left.itemId === right.itemId) return true;
  if (left.nativeSegmentId != null && left.nativeSegmentId === right.nativeSegmentId) return true;
  return left.id != null && left.id === right.id;
}

export function targetsOverlap(left, right) {
  return (left || []).some((target) => (right || []).some((candidate) => sameSegmentIdentity(target, candidate)));
}

export function segmentIdentity(segment) {
  return { id: segment.id, itemId: segment.itemId ?? null, nativeSegmentId: segment.nativeSegmentId ?? null };
}

export function resolveSegmentTarget(segments, target) {
  return (segments || []).find((segment) => sameSegmentIdentity(target, segment)) || null;
}

export function savingSegmentIdFrom(snapshot) {
  return snapshot.running?.lockId ?? null;
}

export function isKindRunning(snapshot, kind) {
  return snapshot.running?.kind === kind;
}

export function isSaveQueueBusy(snapshot) {
  return snapshot.running != null || snapshot.queued.length > 0;
}

const IDLE_SNAPSHOT = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });

function describe(task) {
  return Object.freeze({
    id: task.id,
    kind: task.kind,
    lockId: task.lockId,
    targets: task.targets,
    exclusive: task.exclusive,
  });
}

// `drainAfterSettle: false` leaves queued tasks waiting for `poke()` after a task settles, so a host
// such as React can render the settled task's results before the next task reads its context.
export function createSaveQueue({ getContext = () => ({}), drainAfterSettle = true } = {}) {
  let nextId = 1;
  let running = null;
  let queued = [];
  let lastFailure = null;
  let disposed = false;
  let snapshot = IDLE_SNAPSHOT;
  const outcomes = new Map();
  const listeners = new Set();
  let idleWaiters = [];

  function publish() {
    snapshot = running == null && queued.length === 0 && lastFailure == null
      ? IDLE_SNAPSHOT
      : Object.freeze({
        running: running ? describe(running) : null,
        queued: Object.freeze(queued.map(describe)),
        lastFailure,
      });
    for (const listener of [...listeners]) listener();
    if (running == null && queued.length === 0) {
      const waiters = idleWaiters;
      idleWaiters = [];
      for (const resolve of waiters) resolve();
    }
  }

  function finish(task, outcome) {
    outcomes.set(task.id, outcome.status);
    task.resolve(outcome);
  }

  function dependencyState(task) {
    if (task.dependsOn == null) return "met";
    const status = outcomes.get(task.dependsOn);
    if (status === "fulfilled") return "met";
    if (status != null) return "failed";
    return "pending";
  }

  function start(task) {
    running = task;
    const context = { ...getContext(), taskId: task.id };
    context.resolveTargets = () => task.targets
      .map((target) => resolveSegmentTarget(context.segments, target))
      .filter(Boolean);
    publish();
    let result;
    try {
      result = task.run(context);
    } catch (error) {
      result = Promise.reject(error);
    }
    Promise.resolve(result).then(
      (value) => settle(task, { status: "fulfilled", value }),
      (error) => settle(task, { status: "rejected", error }),
    );
  }

  function settle(task, outcome) {
    finish(task, outcome);
    if (disposed) return;
    running = null;
    if (outcome.status === "rejected") lastFailure = Object.freeze({ id: task.id, kind: task.kind, error: outcome.error });
    publish();
    if (drainAfterSettle) pump();
  }

  function pump() {
    if (disposed || running != null) return;
    let changed = false;
    for (let index = 0; index < queued.length; index += 1) {
      const task = queued[index];
      const dependency = dependencyState(task);
      if (dependency === "failed") {
        queued = queued.filter((candidate) => candidate !== task);
        finish(task, { status: "dropped", reason: "dependency-failed" });
        changed = true;
        index -= 1;
        continue;
      }
      if (dependency === "pending") continue;
      // An exclusive task waits until everything queued before it has run.
      if (task.exclusive && index > 0) continue;
      // Never overtake an earlier request for the same segment.
      if (queued.slice(0, index).some((earlier) => targetsOverlap(earlier.targets, task.targets))) continue;
      if (task.ready && !task.ready(getContext())) continue;
      queued = queued.filter((candidate) => candidate !== task);
      start(task);
      return;
    }
    if (changed) publish();
  }

  function enqueue(spec) {
    if (disposed) return null;
    const blockedByExclusive = running?.exclusive || queued.some((task) => task.exclusive);
    // Tasks parked on `ready` or a dependency do not make the editor busy; only a running save does.
    if (blockedByExclusive || (running != null && spec.whenBusy !== "enqueue")) return null;
    let resolve;
    const done = new Promise((resolvePromise) => { resolve = resolvePromise; });
    const task = {
      id: nextId++,
      kind: spec.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: spec.lockId ?? -1,
      targets: Object.freeze([...(spec.targets || [])]),
      exclusive: spec.exclusive === true,
      dependsOn: spec.dependsOn ?? null,
      ready: spec.ready || null,
      run: spec.run,
      resolve,
    };
    queued = [...queued, task];
    publish();
    pump();
    return { id: task.id, done };
  }

  // Holds the queue for work that is not yet expressed as a task, such as component-owned saves.
  function acquire(meta = {}) {
    let release = null;
    const handle = enqueue({
      ...meta,
      whenBusy: "reject",
      run: () => new Promise((resolvePromise) => { release = resolvePromise; }),
    });
    if (!handle) return null;
    // A lock is only useful if it is held now; do not leave it parked behind an earlier request.
    if (release == null) {
      cancel((task) => task.id === handle.id);
      return null;
    }
    let released = false;
    return () => {
      if (released) return;
      released = true;
      release();
    };
  }

  function cancel(predicate) {
    const cancelled = queued.filter((task) => predicate(describe(task)));
    if (cancelled.length === 0) return 0;
    queued = queued.filter((task) => !cancelled.includes(task));
    for (const task of cancelled) finish(task, { status: "cancelled" });
    publish();
    pump();
    return cancelled.length;
  }

  return {
    enqueue,
    acquire,
    cancel,
    poke: pump,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
    whenIdle() {
      if (running == null && queued.length === 0) return Promise.resolve();
      return new Promise((resolve) => idleWaiters.push(resolve));
    },
    dispose() {
      if (disposed) return;
      const cancelled = queued;
      queued = [];
      disposed = true;
      for (const task of cancelled) finish(task, { status: "cancelled" });
      listeners.clear();
      const waiters = idleWaiters;
      idleWaiters = [];
      for (const resolve of waiters) resolve();
    },
  };
}
