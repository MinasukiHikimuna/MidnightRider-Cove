import test from "node:test";
import { assert, ui } from "../SegmentStudioUiHarness.mjs";

function gate() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

function recorder() {
  const events = [];
  const task = (name, work = null) => () => {
    events.push(`start:${name}`);
    return Promise.resolve(work?.()).then((value) => {
      events.push(`end:${name}`);
      return value;
    });
  };
  return { events, task };
}

test("save queue runs tasks one at a time in request order", async () => {
  const queue = ui.createSaveQueue();
  const { events, task } = recorder();
  const first = gate();
  queue.enqueue({ kind: "timing", lockId: 1, run: task("a", () => first.promise) });
  queue.enqueue({ kind: "review", lockId: 2, whenBusy: "enqueue", run: task("b") });
  queue.enqueue({ kind: "review", lockId: 3, whenBusy: "enqueue", run: task("c") });

  assert.deepEqual(events, ["start:a"]);
  assert.equal(ui.savingSegmentIdFrom(queue.getSnapshot()), 1);
  assert.deepEqual(queue.getSnapshot().queued.map((entry) => entry.lockId), [2, 3]);
  first.resolve();
  await queue.whenIdle();
  assert.deepEqual(events, ["start:a", "end:a", "start:b", "end:b", "start:c", "end:c"]);
  assert.equal(ui.savingSegmentIdFrom(queue.getSnapshot()), null);
});

test("save queue starts an idle task synchronously and rejects a second request in the same tick", async () => {
  const queue = ui.createSaveQueue();
  let started = false;
  const pending = gate();
  const first = queue.enqueue({ kind: "create", lockId: -1, run: () => { started = true; return pending.promise; } });
  assert.equal(started, true);
  assert.equal(queue.enqueue({ kind: "create", lockId: -1, run: () => assert.fail("must not run") }), null);
  pending.resolve("created");
  assert.deepEqual(await first.done, { status: "fulfilled", value: "created" });
});

test("save queue never lets a ready task overtake an earlier request for the same segment", async () => {
  const queue = ui.createSaveQueue();
  const { events, task } = recorder();
  let heldReady = false;
  const running = gate();
  queue.enqueue({ kind: "create", lockId: -1, run: task("create", () => running.promise) });
  queue.enqueue({ kind: "tag", whenBusy: "enqueue", targets: [{ id: 5 }], ready: () => heldReady, run: task("held-tag") });
  queue.enqueue({ kind: "review", whenBusy: "enqueue", targets: [{ id: 5 }], run: task("same-segment-review") });
  queue.enqueue({ kind: "review", whenBusy: "enqueue", targets: [{ id: 6 }], run: task("other-segment-review") });
  running.resolve();
  await flush();

  // The parked tag blocks later work on its segment, but not work on other segments.
  assert.deepEqual(events, ["start:create", "end:create", "start:other-segment-review", "end:other-segment-review"]);
  heldReady = true;
  queue.poke();
  await queue.whenIdle();
  assert.deepEqual(events.slice(4), ["start:held-tag", "end:held-tag", "start:same-segment-review", "end:same-segment-review"]);
});

test("save queue parked tasks do not make the editor busy", () => {
  const queue = ui.createSaveQueue();
  queue.enqueue({ kind: "tag", whenBusy: "enqueue", targets: [{ id: 5 }], ready: () => false, run: () => {} });
  assert.equal(ui.savingSegmentIdFrom(queue.getSnapshot()), null);
  assert.equal(ui.isSaveQueueBusy(queue.getSnapshot()), true);
  const timing = queue.enqueue({ kind: "timing", lockId: 9, targets: [{ id: 9 }], run: () => new Promise(() => {}) });
  assert.ok(timing);
  assert.equal(ui.savingSegmentIdFrom(queue.getSnapshot()), 9);
});

test("save queue drops dependants of a failed task and keeps draining", async () => {
  const queue = ui.createSaveQueue();
  const create = queue.enqueue({ kind: "create", lockId: -1, run: async () => { throw new Error("create failed"); } });
  const tag = queue.enqueue({ kind: "tag", whenBusy: "enqueue", dependsOn: create.id, run: () => assert.fail("must not run") });
  const review = queue.enqueue({ kind: "review", whenBusy: "enqueue", run: async () => "reviewed" });

  assert.equal((await create.done).status, "rejected");
  assert.deepEqual(await tag.done, { status: "dropped", reason: "dependency-failed" });
  assert.deepEqual(await review.done, { status: "fulfilled", value: "reviewed" });
  assert.equal(queue.getSnapshot().lastFailure.kind, "create");
  assert.equal(queue.getSnapshot().lastFailure.error.message, "create failed");
});

test("save queue runs dependants once their dependency succeeds", async () => {
  const queue = ui.createSaveQueue();
  const { events, task } = recorder();
  const create = queue.enqueue({ kind: "create", lockId: -1, run: task("create") });
  const tag = queue.enqueue({ kind: "tag", whenBusy: "enqueue", dependsOn: create.id, run: task("tag") });
  assert.equal((await tag.done).status, "fulfilled");
  assert.deepEqual(events, ["start:create", "end:create", "start:tag", "end:tag"]);
});

test("save queue cancels queued work by segment identity across a draft approval", async () => {
  const queue = ui.createSaveQueue();
  const running = gate();
  queue.enqueue({ kind: "slots", lockId: 1, run: () => running.promise });
  const review = queue.enqueue({
    kind: "review",
    whenBusy: "enqueue",
    targets: [{ id: -55, itemId: 55, nativeSegmentId: null }],
    run: () => assert.fail("must not run"),
  });
  const other = queue.enqueue({ kind: "review", whenBusy: "enqueue", targets: [{ id: 8, itemId: null, nativeSegmentId: 8 }], run: async () => "kept" });
  // The approved draft now has a native id but keeps its item id.
  const approved = { id: 900, itemId: 55, nativeSegmentId: 900 };
  const count = queue.cancel((entry) => entry.kind === "review" && ui.targetsOverlap(entry.targets, [approved]));

  assert.equal(count, 1);
  assert.deepEqual(await review.done, { status: "cancelled" });
  running.resolve();
  assert.deepEqual(await other.done, { status: "fulfilled", value: "kept" });
});

test("save queue exclusive tasks run alone: refused behind other work and blocking new work while they run", async () => {
  const queue = ui.createSaveQueue();
  const { events, task } = recorder();
  const running = gate();
  queue.enqueue({ kind: "timing", lockId: 1, run: task("timing", () => running.promise) });
  assert.equal(queue.enqueue({ kind: "history", exclusive: true, run: task("refused") }), null);
  running.resolve();
  await queue.whenIdle();

  // A parked task would keep an exclusive task waiting forever, so it is refused as well.
  const parked = queue.enqueue({ kind: "tag", whenBusy: "enqueue", targets: [{ id: 5 }], ready: () => false, run: task("parked") });
  assert.equal(queue.enqueue({ kind: "history", exclusive: true, run: task("refused") }), null);
  queue.cancel((entry) => entry.id === parked.id);

  const restoreGate = gate();
  const restore = queue.enqueue({ kind: "history", lockId: -1, exclusive: true, run: task("restore", () => restoreGate.promise) });
  assert.ok(restore);
  assert.equal(queue.enqueue({ kind: "review", whenBusy: "enqueue", run: task("late") }), null);
  restoreGate.resolve();
  await restore.done;
  assert.deepEqual(events, ["start:timing", "end:timing", "start:restore", "end:restore"]);
  assert.ok(queue.enqueue({ kind: "review", run: task("after") }));
});

test("save queue waiting for a render starts nothing until poked, even from a lock request", async () => {
  let context = { version: 1 };
  const queue = ui.createSaveQueue({ getContext: () => context, drainAfterSettle: false });
  const running = gate();
  queue.enqueue({ kind: "timing", lockId: 1, run: () => running.promise });
  const review = queue.enqueue({ kind: "review", whenBusy: "enqueue", run: (ctx) => ctx.version });
  running.resolve();
  await flush();

  // The settled save has not rendered yet: a lock request must not start the queued review early.
  assert.equal(queue.acquire({ kind: "slots", lockId: 2 }), null);
  assert.equal(queue.getSnapshot().running, null);
  context = { version: 2 };
  queue.poke();
  assert.equal(queue.getSnapshot().running, null);
  // Only a commit whose render saw the settle lets the queued review start.
  queue.markCommitted(queue.settledCount() - 1);
  queue.poke();
  assert.equal(queue.getSnapshot().running, null);
  queue.markCommitted(queue.settledCount());
  queue.poke();
  assert.deepEqual(await review.done, { status: "fulfilled", value: 2 });
});

test("save queue maps work requested for a saved temporary segment to its saved identity", async () => {
  const queue = ui.createSaveQueue();
  queue.retarget(-3, { id: 205, itemId: null, nativeSegmentId: 205 });
  assert.deepEqual(queue.stableIdentity({ id: -3, itemId: null, nativeSegmentId: null }), { id: 205, itemId: null, nativeSegmentId: 205 });
  assert.deepEqual(queue.stableIdentity({ id: 7, itemId: null, nativeSegmentId: 7 }), { id: 7, itemId: null, nativeSegmentId: 7 });
  const task = queue.enqueue({ kind: "tag", targets: [{ id: -3, itemId: null, nativeSegmentId: null }], run: (ctx) => ctx.targets });
  assert.deepEqual((await task.done).value, [{ id: 205, itemId: null, nativeSegmentId: 205 }]);
});

test("save queue reads editor context when a task starts, not when it was requested", async () => {
  let context = { revision: 1 };
  const queue = ui.createSaveQueue({ getContext: () => context });
  const running = gate();
  queue.enqueue({ kind: "timing", lockId: 1, run: () => running.promise });
  const review = queue.enqueue({ kind: "review", whenBusy: "enqueue", run: (ctx) => ctx.revision });
  context = { revision: 2 };
  running.resolve();
  assert.deepEqual(await review.done, { status: "fulfilled", value: 2 });
});

test("save queue resolves task targets against the context segments", async () => {
  const segments = [{ id: 900, itemId: 55, nativeSegmentId: 900 }, { id: 3, itemId: null, nativeSegmentId: 3 }];
  const queue = ui.createSaveQueue({ getContext: () => ({ segments }) });
  const task = queue.enqueue({
    kind: "review",
    targets: [{ id: -55, itemId: 55, nativeSegmentId: null }, { id: 4, itemId: null, nativeSegmentId: 4 }],
    run: (ctx) => ctx.resolveTargets(),
  });
  assert.deepEqual((await task.done).value, [segments[0]]);
});

test("save queue snapshots are stable between changes and notify subscribers", async () => {
  const queue = ui.createSaveQueue();
  let notifications = 0;
  const unsubscribe = queue.subscribe(() => { notifications += 1; });
  const idle = queue.getSnapshot();
  assert.equal(queue.getSnapshot(), idle);
  const running = gate();
  queue.enqueue({ kind: "timing", lockId: 1, run: () => running.promise });
  const busy = queue.getSnapshot();
  assert.notEqual(busy, idle);
  assert.equal(queue.getSnapshot(), busy);
  assert.ok(notifications > 0);
  running.resolve();
  await queue.whenIdle();
  assert.equal(queue.getSnapshot(), idle);
  const seen = notifications;
  unsubscribe();
  queue.enqueue({ kind: "timing", lockId: 1, run: () => {} });
  assert.equal(notifications, seen);
});

test("save queue disposal cancels queued work and ignores late results", async () => {
  const queue = ui.createSaveQueue();
  let notifications = 0;
  queue.subscribe(() => { notifications += 1; });
  const running = gate();
  const first = queue.enqueue({ kind: "timing", lockId: 1, run: () => running.promise });
  const second = queue.enqueue({ kind: "review", whenBusy: "enqueue", run: () => assert.fail("must not run") });
  queue.dispose();
  const seen = notifications;
  assert.deepEqual(await second.done, { status: "cancelled" });
  running.resolve("late");
  assert.deepEqual(await first.done, { status: "fulfilled", value: "late" });
  assert.equal(notifications, seen);
  assert.equal(queue.enqueue({ kind: "timing", run: () => {} }), null);
});

test("save queue locks can be acquired and released for component-owned saves", async () => {
  const queue = ui.createSaveQueue();
  const release = queue.acquire({ kind: "slots", lockId: 12 });
  assert.equal(typeof release, "function");
  assert.equal(ui.savingSegmentIdFrom(queue.getSnapshot()), 12);
  assert.equal(queue.acquire({ kind: "slots", lockId: 13 }), null);
  const review = queue.enqueue({ kind: "review", whenBusy: "enqueue", run: async () => "after" });
  release();
  release();
  assert.deepEqual(await review.done, { status: "fulfilled", value: "after" });
  assert.equal(ui.savingSegmentIdFrom(queue.getSnapshot()), null);
});

test("save queue refuses a lock that would park behind an earlier request for the segment", () => {
  const queue = ui.createSaveQueue();
  queue.enqueue({ kind: "tag", whenBusy: "enqueue", targets: [{ id: 5 }], ready: () => false, run: () => {} });
  assert.equal(queue.acquire({ kind: "slots", lockId: 5, targets: [{ id: 5 }] }), null);
  assert.equal(queue.getSnapshot().queued.length, 1);
  assert.ok(queue.acquire({ kind: "slots", lockId: 6, targets: [{ id: 6 }] }));
});

test("save queue keeps draining after a task throws synchronously", async () => {
  const queue = ui.createSaveQueue();
  const broken = queue.enqueue({ kind: "timing", run: () => { throw new Error("boom"); } });
  const next = queue.enqueue({ kind: "review", whenBusy: "enqueue", run: async () => "ok" });
  assert.equal((await broken.done).status, "rejected");
  assert.equal((await next.done).status, "fulfilled");
});

test("save queue locks are free again as soon as they are released", () => {
  const queue = ui.createSaveQueue();
  const release = queue.acquire({ kind: "preview", lockId: 1 });
  release();
  assert.equal(ui.savingSegmentIdFrom(queue.getSnapshot()), null);
  const next = queue.acquire({ kind: "execute", lockId: 1 });
  assert.equal(typeof next, "function");
  next();
});
