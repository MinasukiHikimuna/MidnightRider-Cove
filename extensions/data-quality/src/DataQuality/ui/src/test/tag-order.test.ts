import { describe, expect, it } from "vitest";
import { compareTagsForDisplay, naturalCompare, sortTagsForDisplay } from "../tagOrder";

describe("naturalCompare", () => {
  it("orders digit runs by value and ignores case, as Cove's natural order does", () => {
    const sorted = ["item 10", "Item 9", "item 1", "item 01", "Item", "item b", "item A"].sort(
      naturalCompare,
    );
    expect(sorted).toEqual(["Item", "item 01", "item 1", "Item 9", "item 10", "item A", "item b"]);
  });

  it("breaks ties ordinally and sorts null first", () => {
    expect(naturalCompare("a", "A")).toBeGreaterThan(0);
    expect(naturalCompare("A", "a")).toBeLessThan(0);
    expect(naturalCompare("same", "same")).toBe(0);
    expect(naturalCompare(null, "a")).toBeLessThan(0);
    expect(naturalCompare("a", undefined)).toBeGreaterThan(0);
    expect(naturalCompare(null, undefined)).toBe(0);
  });

  it("keeps letters without a one-letter upper case as they are", () => {
    // ß has no single upper-case letter; .NET compares it unchanged, after every ASCII letter.
    expect(naturalCompare("ß", "Z")).toBeGreaterThan(0);
    expect(naturalCompare("ä", "Ä")).toBeGreaterThan(0);
    expect(naturalCompare("ä", "b")).toBeGreaterThan(0);
  });
});

describe("compareTagsForDisplay", () => {
  const tag = (
    id: number,
    name: string,
    group?: { id: number; name: string; order?: number | null },
    sortName?: string | null,
  ) => ({
    id,
    name,
    sortName,
    tagGroupId: group?.id ?? null,
    tagGroupName: group?.name ?? null,
    tagGroupSortOrder: group?.order ?? null,
  });

  it("orders grouped tags first, by group order (missing last), group name, sort name, id", () => {
    const early = { id: 1, name: "Zulu group", order: 1 };
    const late = { id: 2, name: "Alpha group", order: 5 };
    const unordered = { id: 3, name: "Beta group" };
    const alsoUnordered = { id: 4, name: "Alpha unordered" };
    const tags = [
      tag(1, "Loose"),
      tag(2, "Second", late),
      tag(3, "B", unordered),
      tag(4, "A", alsoUnordered),
      tag(5, "Zed", early, "Aa"),
      tag(6, "First", early),
      tag(7, "Loose"),
      tag(8, "Another"),
    ];
    expect(sortTagsForDisplay(tags).map((item) => item.id)).toEqual([5, 6, 2, 4, 3, 8, 1, 7]);
  });

  it("uses the sort name before the name, in natural order", () => {
    expect(
      compareTagsForDisplay(tag(1, "Tag 10", undefined, null), tag(2, "Tag 9", undefined, null)),
    ).toBeGreaterThan(0);
    expect(
      compareTagsForDisplay(tag(1, "Tag 10", undefined, "A"), tag(2, "Tag 9", undefined, null)),
    ).toBeLessThan(0);
  });

  it("does not change the list it is given", () => {
    const tags = [tag(2, "B"), tag(1, "A")];
    expect(sortTagsForDisplay(tags).map((item) => item.id)).toEqual([1, 2]);
    expect(tags.map((item) => item.id)).toEqual([2, 1]);
  });
});
