import "@testing-library/jest-dom/vitest";

// Tag names are cached in module state shared by every component, and tests may replace the
// keyboard bindings Cove would resolve; each test starts from a clean cache and the defaults.
// Imported lazily so the test file's module mocks already apply to them.
beforeEach(async () => {
  (await import("../tagNames")).clearTagNameCache();
  const keyboard = await import("./runtime-components");
  keyboard.resetTestKeyboardBindings();
  keyboard.testKeyboardConflicts.length = 0;
});
