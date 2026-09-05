export const DAY_MS = 86_400_000;

export function clamp(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
}

export function readBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

export function dailyKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function stableSeed(...parts) {
  const value = parts.join(":");
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) & 0x7fffffff;
}

export function randomSeed(day, instanceId, scope, revision = 0) {
  return stableSeed(day, instanceId, scope, revision);
}

export function deterministicShuffle(items, seed) {
  const result = [...items];
  let state = seed || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function anniversaryYears(date, historyYears) {
  const month = date.getMonth();
  const day = date.getDate();
  return Array.from({ length: historyYears }, (_, index) => date.getFullYear() - index - 1)
    .filter((year) => {
      const candidate = new Date(year, month, day);
      return candidate.getFullYear() === year && candidate.getMonth() === month && candidate.getDate() === day;
    });
}

export function isEmptyResult(value) {
  return value == null || (Array.isArray(value) && value.length === 0);
}
