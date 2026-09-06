import { describe, expect, it } from "vitest";
import {
  presentCustomFieldCriteria,
  preserveCustomFieldCriteria,
  stripCustomFieldPresentation,
  unresolvedCustomFieldTagIds,
} from "../CustomFieldPresentation";

describe("custom field filter presentation", () => {
  it("resolves missing tag display values into Cove-style chip text", () => {
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
      .toMatchObject({
        customFieldCriteria: [
          { label: "Confirmed absent tags Excludes Example tag" },
        ],
      });
  });

  it("omits values for null checks and includes both range bounds", () => {
    const presented = presentCustomFieldCriteria(
      {
        customFieldCriteria: [
          {
            key: "review_status",
            type: "text",
            value: "stale",
            modifier: "IS_NULL",
          },
          {
            key: "score",
            type: "number",
            value: "1",
            value2: "5",
            modifier: "BETWEEN",
          },
        ],
      },
      {},
    );

    expect(presented).toMatchObject({
      customFieldCriteria: [
        { label: "Review status Is Null" },
        { label: "Score Between 1 and 5" },
      ],
    });
  });

  it("preserves all custom rows through dialog applies but allows explicit removal", () => {
    const customFieldCriteria = [
      { key: "first", value: "1" },
      { key: "first", value: "2" },
      { key: "second", modifier: "IS_NULL", value: "" },
    ];
    const current = { customFieldCriteria, organized: true };

    expect(preserveCustomFieldCriteria(current, { organized: false }, false))
      .toEqual({ organized: false, customFieldCriteria });
    expect(preserveCustomFieldCriteria(current, { organized: false }, true))
      .toEqual({ organized: false });
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
    expect(presentCustomFieldCriteria(objectFilter, { "21": "Ignored" }))
      .toMatchObject({
        customFieldCriteria: [
          { label: "Review status Includes Ready" },
        ],
      });
  });

  it("removes presentation labels before applying a filter change", () => {
    const presented = presentCustomFieldCriteria(
      {
        customFieldCriteria: [
          {
            key: "confirmed_absent_tags",
            type: "tag",
            value: "17",
            modifier: "EXCLUDES",
          },
        ],
      },
      { "17": "Example tag" },
    );

    expect(stripCustomFieldPresentation(presented)).toEqual({
      customFieldCriteria: [
        {
          key: "confirmed_absent_tags",
          type: "tag",
          value: "17",
          modifier: "EXCLUDES",
        },
      ],
    });
  });
});
