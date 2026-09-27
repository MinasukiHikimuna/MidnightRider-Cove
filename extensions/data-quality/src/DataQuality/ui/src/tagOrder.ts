/**
 * Cove's display order for tags, as its video page lists them (OrderForDisplay in Cove's API),
 * with the natural string order it uses.
 */
import type { TagInfo } from "./api";

const isDigit = (char: string) => char >= "0" && char <= "9";

/** Upper case per UTF-16 unit, as .NET's char.ToUpperInvariant; units without one stay as they are. */
function upper(char: string): string {
  const result = char.toUpperCase();
  return result.length === 1 ? result : char;
}

/**
 * Cove's natural string order (NaturalStringComparer): digit runs compare by value, letters
 * ignore case, and ordinal order breaks ties; null sorts first.
 */
export function naturalCompare(
  x: string | null | undefined,
  y: string | null | undefined,
): number {
  if (x == null) return y == null ? 0 : -1;
  if (y == null) return 1;
  if (x === y) return 0;
  let i = 0;
  let j = 0;
  while (i < x.length && j < y.length) {
    if (isDigit(x[i]) && isDigit(y[j])) {
      const startX = i;
      const startY = j;
      while (i < x.length && isDigit(x[i])) i++;
      while (j < y.length && isDigit(y[j])) j++;
      const digitsX = x.slice(startX, i).replace(/^0+/, "");
      const digitsY = y.slice(startY, j).replace(/^0+/, "");
      if (digitsX.length !== digitsY.length) return digitsX.length < digitsY.length ? -1 : 1;
      if (digitsX !== digitsY) return digitsX < digitsY ? -1 : 1;
      continue;
    }
    const left = upper(x[i]);
    const right = upper(y[j]);
    if (left !== right) return left < right ? -1 : 1;
    i++;
    j++;
  }
  const remaining = x.length - i - (y.length - j);
  if (remaining !== 0) return remaining < 0 ? -1 : 1;
  return x < y ? -1 : x > y ? 1 : 0;
}

type Ordered = Pick<
  TagInfo,
  "id" | "name" | "sortName" | "tagGroupId" | "tagGroupName" | "tagGroupSortOrder"
>;

/**
 * Cove's display order for an item's tags (OrderForDisplay): tags in a group first, then by the
 * group's sort order (groups without one last), group name, the tag's sort name or else its name,
 * and id.
 */
export function compareTagsForDisplay(a: Ordered, b: Ordered): number {
  const grouped = (tag: Ordered) => (tag.tagGroupId != null ? 0 : 1);
  const order = (tag: Ordered) => tag.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return (
    grouped(a) - grouped(b) ||
    Math.sign(order(a) - order(b)) ||
    naturalCompare(a.tagGroupName, b.tagGroupName) ||
    naturalCompare(a.sortName ?? a.name, b.sortName ?? b.name) ||
    Math.sign(a.id - b.id)
  );
}

export function sortTagsForDisplay<T extends Ordered>(tags: readonly T[]): T[] {
  return [...tags].sort(compareTagsForDisplay);
}
