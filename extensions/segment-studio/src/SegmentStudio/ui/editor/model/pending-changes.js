// Local changes the editor shows before the server confirms them. Server data is never rewritten:
// the displayed segments are derived from it plus this list, so rolling back a failed save only
// removes its entry and cannot overwrite newer data a reload brought in meanwhile.
//
// Entry shape:
//   { id, taskId, op: "patch" | "insert" | "remove" | "merge", targets: identity[], values?, segment?, settled }
//   patch  - applies `values` to every target
//   insert - adds `segment` (a temporary segment until its create is saved)
//   remove - hides every target
//   merge  - applies `values` to the first target (the survivor) and hides the rest
import { sameSegmentIdentity } from "./save-queue.js";

let nextPendingChangeId = 1;

export function createPendingChangeId() {
  return `pending-${nextPendingChangeId++}`;
}

function orderSegments(segments) {
  return segments.sort((left, right) => left.startSec - right.startSec || left.id - right.id);
}

function matchesAny(segment, targets) {
  return (targets || []).some((target) => sameSegmentIdentity(target, segment));
}

export function addPendingChange(list, entry) {
  return [...(list || []), {
    id: entry.id ?? createPendingChangeId(),
    taskId: entry.taskId ?? null,
    op: entry.op,
    targets: entry.targets || (entry.segment ? [{ id: entry.segment.id }] : []),
    values: entry.values || null,
    segment: entry.segment || null,
    settled: false,
  }];
}

function matchesKey(entry, key) {
  return entry.id === key || (entry.taskId != null && entry.taskId === key);
}

export function discardPendingChange(list, key) {
  const next = (list || []).filter((entry) => !matchesKey(entry, key));
  return next.length === (list || []).length ? list : next;
}

// The server confirmed the change; it stays applied until the render that shows the confirmed data.
export function settlePendingChange(list, key) {
  let changed = false;
  const next = (list || []).map((entry) => {
    if (entry.settled || !matchesKey(entry, key)) return entry;
    changed = true;
    return { ...entry, settled: true };
  });
  return changed ? next : list;
}

// A created segment received its saved identity: changes aimed at the temporary id follow it.
export function retargetPendingChanges(list, temporaryId, identity) {
  let changed = false;
  const next = (list || []).map((entry) => {
    if (!entry.targets.some((target) => target.id === temporaryId && target.itemId == null && target.nativeSegmentId == null))
      return entry;
    changed = true;
    return {
      ...entry,
      targets: entry.targets.map((target) => target.id === temporaryId ? { ...identity } : target),
    };
  });
  return changed ? next : list;
}

export function applyPendingChanges(segments, list) {
  if (!list || list.length === 0) return segments;
  let result = [...(segments || [])];
  for (const entry of list) {
    if (entry.op === "insert") {
      if (!result.some((segment) => sameSegmentIdentity(entry.segment, segment))) result.push(entry.segment);
    } else if (entry.op === "patch") {
      result = result.map((segment) => matchesAny(segment, entry.targets) ? { ...segment, ...entry.values } : segment);
    } else if (entry.op === "remove") {
      result = result.filter((segment) => !matchesAny(segment, entry.targets));
    } else if (entry.op === "merge") {
      const [survivor, ...consumed] = entry.targets;
      result = result
        .filter((segment) => !matchesAny(segment, consumed))
        .map((segment) => sameSegmentIdentity(survivor, segment) ? { ...segment, ...entry.values } : segment);
    }
  }
  return orderSegments(result);
}

// Drops confirmed entries and entries whose segments no longer exist (for example after an undo).
export function prunePendingChanges(list, detail) {
  if (!list || list.length === 0) return list;
  const available = [
    ...(detail?.segments || []),
    ...list.filter((entry) => entry.op === "insert" && !entry.settled).map((entry) => entry.segment),
  ];
  const next = list.filter((entry) => {
    if (entry.settled) return false;
    if (entry.op === "insert") return true;
    return entry.targets.some((target) => available.some((segment) => sameSegmentIdentity(target, segment)));
  });
  return next.length === list.length ? list : next;
}

export function pendingChangesReducer(list, action) {
  switch (action.type) {
    case "add": return addPendingChange(list, action.entry);
    case "discard": return discardPendingChange(list, action.key);
    case "settle": return settlePendingChange(list, action.key);
    case "retarget": return retargetPendingChanges(list, action.temporaryId, action.identity);
    case "prune": return prunePendingChanges(list, action.detail);
    case "reset": return [];
    default: return list;
  }
}
