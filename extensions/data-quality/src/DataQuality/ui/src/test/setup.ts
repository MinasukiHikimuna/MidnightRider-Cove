import "@testing-library/jest-dom/vitest";

// Tag names are cached in module state shared by every component, and the keyboard stand-in
// records Cove's conflict notices and its player and global shortcuts; each test starts from a
// clean cache and no recorded keys. Imported lazily so the test file's module mocks already apply
// to them.
beforeEach(async () => {
  (await import("../tagNames")).clearTagNameCache();
  const keyboard = await import("./runtime-components");
  keyboard.testKeyboardConflicts.length = 0;
  keyboard.testPlayerShortcuts.fullscreen.mockReset();
  keyboard.testPlayerShortcuts.mute.mockReset();
  keyboard.testGlobalShortcuts.goTo.mockReset();
});
