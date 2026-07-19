import { describe, expect, it } from "vitest";
import { clampTiming, cropRectFromRecipe, moveCropByPixels, resizeCropByPixels } from "../cropGeometry";

const contentRect = { left: 100, top: 50, width: 800, height: 450 };

describe("crop geometry", () => {
  it.each([
    [1920, 1080, { left: 100, top: 50, width: 800, height: 450 }, { left: 275, top: 50, width: 450, height: 450 }],
    [1080, 1920, { left: 373.4375, top: 50, width: 253.125, height: 450 }, { left: 373.4375, top: 148.4375, width: 253.125, height: 253.125 }],
    [1080, 1080, { left: 275, top: 50, width: 450, height: 450 }, { left: 275, top: 50, width: 450, height: 450 }],
  ])("keeps a square aligned inside %sx%s media", (intrinsicWidth, intrinsicHeight, displayedRect, expected) => {
    expect(cropRectFromRecipe({ anchorX: 0.5, anchorY: 0.5, zoom: 1 }, displayedRect, intrinsicWidth, intrinsicHeight)).toEqual(expected);
  });

  it("uses the displayed content rectangle rather than the letterboxed player container", () => {
    expect(cropRectFromRecipe({ anchorX: 0, anchorY: 0, zoom: 2 }, contentRect, 1920, 1080)).toEqual({ left: 100, top: 50, width: 225, height: 225 });
  });

  it.each([
    ["4:3" as const, { left: 200, top: 50, width: 600, height: 450 }],
    ["16:9" as const, { left: 100, top: 50, width: 800, height: 450 }],
  ])("keeps a %s crop aligned in widescreen media", (aspectRatio, expected) => {
    expect(cropRectFromRecipe({ anchorX: 0.5, anchorY: 0.5, zoom: 1 }, contentRect, 1920, 1080, aspectRatio)).toEqual(expected);
  });

  it("clamps pointer movement and resizing to valid normalized values", () => {
    expect(moveCropByPixels({ anchorX: 0.5, anchorY: 0.5, zoom: 2 }, contentRect, 10_000, -10_000)).toMatchObject({ anchorX: 1, anchorY: 0 });
    expect(resizeCropByPixels({ anchorX: 0.5, anchorY: 0.5, zoom: 2 }, contentRect, 10_000).zoom).toBe(1);
    expect(resizeCropByPixels({ anchorX: 0.5, anchorY: 0.5, zoom: 2 }, contentRect, -10_000).zoom).toBe(8);
  });

  it("bounds start nudges and duration to the remaining source", () => {
    expect(clampTiming(-2, 7, 10)).toEqual({ startSeconds: 0, durationSeconds: 7 });
    expect(clampTiming(9, 7, 10)).toEqual({ startSeconds: 9, durationSeconds: 1 });
    expect(clampTiming(10, 7, 10)).toEqual({ startSeconds: 9.75, durationSeconds: 0.25 });
  });
});
