import { describe, expect, it } from "vitest";
import {
  presentCustomFieldCriteria,
  stripCustomFieldPresentation,
  unresolvedCustomFieldTagIds,
} from "../CustomFieldPresentation";

describe("custom field filter presentation", () => {
  it("resolves missing tag display values so Cove's chips show the tag name", () => {
    const objectFilter = {
      customFieldCriteria: [
        {
          key: "confirmed_absent_tags",
          type: "tag",
          value: "17",
          modifier: "EXCLUDES",
        },
      ],
    };

    expect(unresolvedCustomFieldTagIds(objectFilter)).toEqual([17]);
    expect(presentCustomFieldCriteria(objectFilter, { "17": "Example tag" }))
      .toEqual({
        customFieldCriteria: [
          {
            key: "confirmed_absent_tags",
            type: "tag",
            value: "17",
            modifier: "EXCLUDES",
            displayValue: "Example tag",
          },
        ],
      });
  });

  it("resolves both range bounds and leaves non-tag criteria untouched", () => {
    const objectFilter = {
      organized: true,
      customFieldCriteria: [
        { key: "review_status", type: "text", value: "stale", modifier: "EQUALS" },
        { key: "related_tags", type: "tag", value: "1", value2: "5", modifier: "BETWEEN" },
      ],
    };

    expect(unresolvedCustomFieldTagIds(objectFilter)).toEqual([1, 5]);
    expect(presentCustomFieldCriteria(objectFilter, { "1": "First", "5": "Fifth" }))
      .toEqual({
        organized: true,
        customFieldCriteria: [
          { key: "review_status", type: "text", value: "stale", modifier: "EQUALS" },
          {
            key: "related_tags",
            type: "tag",
            value: "1",
            value2: "5",
            modifier: "BETWEEN",
            displayValue: "First",
            displayValue2: "Fifth",
          },
        ],
      });
  });

  it("prefers a persisted display value and does not resolve it again", () => {
    const objectFilter = {
      customFieldCriteria: [
        {
          key: "review_status",
          type: "tag",
          value: "21",
          modifier: "INCLUDES",
          displayValue: "Ready",
        },
      ],
    };

    expect(unresolvedCustomFieldTagIds(objectFilter)).toEqual([]);
    expect(presentCustomFieldCriteria(objectFilter, { "21": "Ignored" })).toBe(objectFilter);
  });

  it("returns the same filter when nothing needs presenting", () => {
    const objectFilter = { organized: true };
    expect(presentCustomFieldCriteria(objectFilter, { "1": "One" })).toBe(objectFilter);
    expect(stripCustomFieldPresentation(objectFilter, { "1": "One" }, objectFilter)).toBe(objectFilter);
  });

  it("removes only resolved display values before applying a filter change", () => {
    const tagNames = { "17": "Example tag" };
    const original = {
      customFieldCriteria: [
        { key: "confirmed_absent_tags", type: "tag", value: "17", modifier: "EXCLUDES" },
        { key: "confirmed_absent_tags", type: "tag", value: "18", modifier: "EXCLUDES", displayValue: "Chosen" },
      ],
    };
    const presented = presentCustomFieldCriteria(original, tagNames);

    expect(stripCustomFieldPresentation(presented, tagNames, original)).toEqual({
      customFieldCriteria: [
        { key: "confirmed_absent_tags", type: "tag", value: "17", modifier: "EXCLUDES" },
        { key: "confirmed_absent_tags", type: "tag", value: "18", modifier: "EXCLUDES", displayValue: "Chosen" },
      ],
    });
  });

  it("keeps a display value the user chose in the dialog for a tag that was never resolved", () => {
    const stripped = stripCustomFieldPresentation(
      {
        customFieldCriteria: [
          { key: "confirmed_absent_tags", type: "tag", value: "40", modifier: "EXCLUDES", displayValue: "New tag" },
        ],
      },
      { "17": "Example tag" },
      { customFieldCriteria: [] },
    );

    expect(stripped.customFieldCriteria).toEqual([
      { key: "confirmed_absent_tags", type: "tag", value: "40", modifier: "EXCLUDES", displayValue: "New tag" },
    ]);
  });

  it("keeps a persisted display value when another criterion resolved the same tag", () => {
    const tagNames = { "17": "Example tag" };
    const original = {
      customFieldCriteria: [
        { key: "confirmed_absent_tags", type: "tag", value: "17", modifier: "EXCLUDES", displayValue: "Example tag" },
        { key: "confirmed_absent_tags", type: "tag", value: "17", modifier: "INCLUDES" },
      ],
    };

    const presented = presentCustomFieldCriteria(original, tagNames);
    expect(stripCustomFieldPresentation(presented, tagNames, original)).toEqual(original);
  });
});
