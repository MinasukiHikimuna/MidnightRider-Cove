import test from "node:test";
import { assert, fs, manifest, repositoryRoot, source, sourceByModule, TestElement, ui } from "../SegmentStudioUiHarness.mjs";

test("feature profiles fail closed when the server schema is missing or unknown", () => {
  assert.deepEqual(ui.normalizeSegmentStudioFeatureProfile(null), {
    schemaVersion: 0,
    requestedMode: "basic",
    effectiveMode: "basic",
    legacyCompatibilityRequired: false,
    capabilities: [],
  });
  assert.deepEqual(ui.normalizeSegmentStudioFeatureProfile({
    schemaVersion: 1,
    requestedMode: "future",
    effectiveMode: "future",
    capabilities: [ui.SEGMENT_STUDIO_CAPABILITIES.segmentReview],
  }), {
    schemaVersion: 0,
    requestedMode: "basic",
    effectiveMode: "basic",
    legacyCompatibilityRequired: false,
    capabilities: [],
  });
  assert.deepEqual(ui.normalizeSegmentStudioFeatureProfile({
    schemaVersion: 2,
    requestedMode: "full",
    effectiveMode: "full",
    capabilities: [ui.SEGMENT_STUDIO_CAPABILITIES.segmentReview],
  }), {
    schemaVersion: 0,
    requestedMode: "basic",
    effectiveMode: "basic",
    legacyCompatibilityRequired: false,
    capabilities: [],
  });
});

test("mode-switch confirmations explain hidden and permanently removed data", () => {
  assert.equal(
    ui.extensionOwnedSegmentsModeSwitchPrompt(1),
    "You have 1 extension-owned segment. Basic mode only shows Cove's native segments. If you proceed, this segment will be hidden.\n\nFull-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden segment and metadata will reappear when you return to Full mode.",
  );
  assert.equal(
    ui.extensionOwnedSegmentsModeSwitchPrompt(12),
    "You have 12 extension-owned segments. Basic mode only shows Cove's native segments. If you proceed, these segments will be hidden.\n\nFull-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden segments and metadata will reappear when you return to Full mode.",
  );
  assert.equal(
    ui.extensionOwnedSegmentsModeSwitchPrompt(0),
    "Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.\n\nNothing will be deleted. Hidden metadata will reappear when you return to Full mode.",
  );
  assert.match(
    ui.recyclingBinModeSwitchPrompt(3),
    /contains 3 unprotected segments[\s\S]*permanently removed[\s\S]*undo history[\s\S]*cannot be undone/i,
  );
  assert.match(
    ui.recyclingBinModeSwitchPrompt(0, 2),
    /2 collected incorrect examples remain protected and manageable[\s\S]*switch to Full mode/i,
  );
  assert.match(
    ui.recyclingBinModeSwitchPrompt(0),
    /clears Basic undo history[\s\S]*switch to Full mode/i,
  );
  const settings = sourceByModule["settings/SegmentStudioSettingsPage.js"];
  assert.doesNotMatch(settings, /requestJson\("\/bin(?:\/empty)?"\)/);
  assert.match(settings, /emptyRecyclingBin/);
  assert.match(settings, /confirmBasicHistoryCleanup/);
  assert.match(settings, /expectedRecyclingBinFingerprint/);
  assert.match(settings, /requestJson\("\/preferences", \{[\s\S]*method: "PUT"/);
});

test("Browse defaults to every review state and drops slots without an activity", () => {
  assert.deepEqual(ui.selectedBrowseStates(""), ["unreviewed", "approved", "rejected"]);
  assert.deepEqual(ui.selectedBrowseStates("approved,rejected,approved"), ["approved", "rejected"]);
  assert.deepEqual(ui.parseBrowseSlotFilters('{"slot-a":12,"bad":0}'), { "slot-a": 12 });
  assert.deepEqual(ui.parseBrowseSlotFilters("not-json"), {});
  assert.deepEqual(ui.buildBrowseRequest(
    { q: " example ", page: 2, perPage: 12 },
    { states: "rejected", slots: '{"slot-a":12}' },
  ), {
    query: "example",
    activityTagId: null,
    reviewStates: ["rejected"],
    slotAssignments: [],
    page: 2,
    perPage: 12,
    sort: "default",
    direction: "desc",
  });
});

test("Browse sends activity-scoped slot filters and restores editor deep links", () => {
  const request = ui.buildBrowseRequest(
    { page: 1, perPage: 24, sort: "default", direction: "desc" },
    { activityId: 7, performerId: 33, slots: '{"slot-b":22,"slot-a":11}' },
  );
  assert.equal(request.performerId, 33);
  assert.deepEqual(request.slotAssignments, [
    { slotDefinitionId: "slot-b", performerId: 22 },
    { slotDefinitionId: "slot-a", performerId: 11 },
  ]);
  assert.equal(ui.browseEditorHref({ videoId: 5, segmentId: 9 }), "/segment-studio/5?segment=9");
  assert.equal(ui.browseEditorHref({ videoId: 5, itemId: 12, published: false }), "/segment-studio/5?item=12");
  assert.equal(ui.requestedSegmentId("?segment=9"), 9);
  assert.equal(ui.requestedSegmentId("?segment=invalid"), null);
  const seeks = [];
  assert.equal(ui.performInitialSegmentSeek(9, [{ id: 9, startSec: 12.75 }], (...args) => seeks.push(args)), true);
  assert.deepEqual(seeks, [[12.75, false]]);
  assert.equal(ui.performInitialSegmentSeek(8, [{ id: 9, startSec: 12.75 }], (seconds) => seeks.push(seconds)), false);
  assert.deepEqual(seeks, [[12.75, false]]);
  assert.match(source, /pendingInitialSeekRef = useRef\(initialSegmentId\)/);
  assert.match(source, /performInitialSegmentSeek\(pendingInitialSeekRef\.current, segments, seek\)/);
  assert.match(source, /seekRef\.current\?\.\(segment\.startSec, false\)/);
  assert.match(source, /pendingInitialSeekRef\.current = null/);
  assert.match(source, /clip: \{ start: item\.startSec, end: browseClipEnd\(item\)/);
  assert.match(source, /slug === "segments"/);
  assert.match(source, /active: "videos"/);
  assert.match(source, /active: "segments"/);
});

test("Browse selects tags and any-slot performers with Cove autocompletes", () => {
  const browsePage = sourceByModule["browse/SegmentStudioBrowsePage.js"];
  assert.match(browsePage, /h\(EntityReferenceSelector, \{[\s\S]*entityType: "tag"/);
  assert.match(browsePage, /"Tag"/);
  assert.match(browsePage, /entityType: "performer"/);
  assert.match(browsePage, /"Performer \(any slot\)"/);
  assert.match(browsePage, /requestError\.message\.includes\("unrestricted performer read access"\)/);
  assert.match(browsePage, /performerSlotsAvailable: false/);
  assert.match(browsePage, /setObjectFilter\(\{ \.\.\.objectFilter, performerId: undefined, slots: undefined \}\)/);
  assert.doesNotMatch(browsePage, /Find activity|"Activity"/);
});

test("workspace tabs and routes are derived from the server feature profile", () => {
  const tabs = source.slice(source.indexOf("function SegmentStudioTabs"), source.indexOf("function SegmentStudioModeSelector"));
  const browsePage = source.slice(source.indexOf("function SegmentStudioBrowsePage"), source.indexOf("function createOperationId"));
  const discoveryPage = source.slice(source.indexOf("function SegmentStudioDiscoveryPage"), source.indexOf("function SegmentStudioEditorPage"));
  const editorPage = source.slice(source.indexOf("function SegmentStudioEditorPage"), source.indexOf("function SegmentStudioRoutes"));
  const routes = source.slice(source.indexOf("function SegmentStudioRoutes"), source.indexOf("function SegmentStudioPage"));

  const basic = ui.normalizeSegmentStudioFeatureProfile({
    schemaVersion: 1,
    requestedMode: "basic",
    effectiveMode: "basic",
    legacyCompatibilityRequired: false,
    capabilities: [
      ui.SEGMENT_STUDIO_CAPABILITIES.navigationVideos,
      ui.SEGMENT_STUDIO_CAPABILITIES.recyclingBinView,
    ],
  });
  const full = ui.normalizeSegmentStudioFeatureProfile({
    ...basic,
    requestedMode: "full",
    effectiveMode: "full",
    capabilities: [
      ...basic.capabilities,
      ui.SEGMENT_STUDIO_CAPABILITIES.navigationSegmentInventory,
    ],
  });
  assert.deepEqual(ui.visibleSegmentStudioTabs(basic).map((tab) => tab.key), ["videos"]);
  assert.deepEqual(ui.visibleSegmentStudioTabs(full).map((tab) => tab.key), ["videos", "segments"]);
  assert.equal(ui.isSegmentStudioSegmentsRoute(null, "review", "/segment-studio"), true);
  assert.equal(ui.isSegmentStudioSegmentsRoute(null, null, "/segment-studio/review"), true);
  assert.equal(ui.resolveSegmentStudioRoute("segments", basic), "videos");
  assert.equal(ui.resolveSegmentStudioRoute("segments", full), "segments");
  assert.match(tabs, /visibleSegmentStudioTabs\(profile\)/);
  assert.match(tabs, /href: "\/segment-studio\/settings"[\s\S]*"Settings"/);
  assert.doesNotMatch(tabs, /label: "Editor"|label: "Browse"|key: "bin", label: "Recycling bin"/);
  assert.match(tabs, /function SegmentStudioBinAction/);
  assert.equal(ui.recyclingBinActionText(null), "Recycling bin");
  assert.equal(ui.recyclingBinActionText(0), "Recycling bin (0)");
  assert.equal(ui.recyclingBinActionText(12), "Recycling bin (12)");
  assert.match(tabs, /requestJson\("\/bin"\)/);
  assert.match(tabs, /segment-studio:recycling-bin-changed/);
  assert.match(source, /notifyRecyclingBinChanged\(\)/);
  assert.doesNotMatch(browsePage, /href: "\/segment-studio\/settings"/);
  assert.doesNotMatch(discoveryPage, /\/review\/segments|Change mode in Settings/);
  assert.doesNotMatch(discoveryPage, /h\(SegmentStudioModeSelector/);
  assert.doesNotMatch(editorPage, /h\(SegmentStudioTabs/);
  assert.doesNotMatch(editorPage, /Back to (editor|discovery|videos)/);
  assert.match(editorPage, /height: "calc\(100dvh - 3\.25rem\)"/);
  assert.match(source, /aria-label": "Go back"/);
  assert.match(routes, /resolveSegmentStudioRoute\(requestedRoute, profile\)/);
});

test("Segment Studio back links follow browser history with a discovery fallback", () => {
  const originalWindow = globalThis.window;
  const route = { page: "segment-studio" };
  const navigated = [];
  let backCount = 0;
  const event = {
    defaultPrevented: false,
    button: 0,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    preventDefault() { this.defaultPrevented = true; },
  };
  try {
    globalThis.window = {
      history: { length: 2, back: () => { backCount += 1; } },
    };
    ui.setBackLinkNavigation(event, (next) => navigated.push(next), route);
    assert.equal(backCount, 1);
    assert.deepEqual(navigated, []);

    for (const nativeEvent of [
      { ...event, defaultPrevented: false, button: 1 },
      { ...event, defaultPrevented: false, ctrlKey: true },
      { ...event, defaultPrevented: false, metaKey: true },
      { ...event, defaultPrevented: false, altKey: true },
      { ...event, defaultPrevented: false, shiftKey: true },
    ]) {
      ui.setBackLinkNavigation(nativeEvent, (next) => navigated.push(next), route);
      assert.equal(nativeEvent.defaultPrevented, false);
    }
    assert.equal(backCount, 1);
    assert.deepEqual(navigated, []);

    globalThis.window = {
      history: { length: 1, back: () => { backCount += 1; } },
    };
    ui.setBackLinkNavigation(
      { ...event, defaultPrevented: false },
      (next) => navigated.push(next),
      route,
    );
    assert.deepEqual(navigated, [route]);
  } finally {
    globalThis.window = originalWindow;
  }

  const editorView = sourceByModule["editor/SegmentEditorView.js"];
  const settingsPage = sourceByModule["settings/SegmentStudioSettingsPage.js"];
  assert.match(editorView, /setBackLinkNavigation/);
  assert.match(settingsPage, /setBackLinkNavigation/);
});

test("Segments routes exclusively to the card-like browse interface", () => {
  const routes = source.slice(source.indexOf("function SegmentStudioRoutes"), source.indexOf("function SegmentStudioPage"));
  assert.equal(ui.isSegmentStudioSegmentsRoute(null, "segments", "/segment-studio"), true);
  assert.equal(ui.isSegmentStudioSegmentsRoute("segments", null, "/segment-studio"), true);
  assert.equal(ui.isSegmentStudioSegmentsRoute(null, null, "/segment-studio/segments/"), true);
  assert.equal(ui.isSegmentStudioSegmentsRoute("17981", null, "/segment-studio/segments"), false);
  assert.equal(ui.isSegmentStudioSegmentsRoute(null, "settings", "/segment-studio/segments"), false);
  assert.match(routes, /isSegmentStudioSegmentsRoute\(id, slug, window\.location\.pathname\)/);
  assert.doesNotMatch(routes, /return h\((?:SegmentStudioReviewPage|UnroutedLegacySegmentReviewList)/);
});

test("recycling bin routes survive in-app navigation and hard reloads", () => {
  const routes = source.slice(source.indexOf("function SegmentStudioRoutes"), source.indexOf("function SegmentStudioPage"));
  assert.equal(ui.isSegmentStudioBinRoute(null, "bin", "/segment-studio"), true);
  assert.equal(ui.isSegmentStudioBinRoute("bin", null, "/segment-studio"), true);
  assert.equal(ui.isSegmentStudioBinRoute(null, null, "/segment-studio/bin/"), true);
  assert.equal(ui.isSegmentStudioBinRoute("17981", null, "/segment-studio/bin"), false);
  assert.match(routes, /isSegmentStudioBinRoute\(id, slug, window\.location\.pathname\)/);
  assert.match(routes, /binRoute[\s\S]*SegmentStudioBinPage/);
});

test("list views use Cove native numbered pagination", () => {
  assert.match(source, /DetailListPagination,/);
  assert.doesNotMatch(source, /\bPager,/);
  assert.equal((source.match(/h\(DetailListPagination/g) || []).length, 3);
  assert.match(source, /h\(ListPage/);
  assert.match(source, /ariaLabel: "Segments pagination above results"/);
  assert.match(source, /ariaLabel: "Segments pagination below results"/);
  assert.match(source, /pageKey: "segment-studio-videos"/);
  assert.doesNotMatch(source, /`Page \$\{filter\.page\}`/);
});

test("settings expose only sections present in the server feature profile", () => {
  const settings = source.slice(
    source.indexOf("function SegmentStudioSettingsPage"),
    source.indexOf("function SegmentStudioTabs"),
  );

  assert.match(settings, /useState\("general"\)/);
  assert.match(settings, /"aria-label": "Settings sections"/);
  const basicProfile = {
    capabilities: [
      ui.SEGMENT_STUDIO_CAPABILITIES.settingsGeneral,
      ui.SEGMENT_STUDIO_CAPABILITIES.settingsShortcuts,
      ui.SEGMENT_STUDIO_CAPABILITIES.settingsOrganization,
    ],
  };
  const fullProfile = {
    capabilities: [
      ...basicProfile.capabilities,
      ui.SEGMENT_STUDIO_CAPABILITIES.settingsPerformerSlots,
      ui.SEGMENT_STUDIO_CAPABILITIES.settingsDerivation,
    ],
  };
  assert.deepEqual(
    ui.visibleSegmentStudioSettingsTabs(basicProfile).map(([key]) => key),
    ["general", "shortcuts", "organization"],
  );
  assert.deepEqual(
    ui.visibleSegmentStudioSettingsTabs(fullProfile).map(([key]) => key),
    ["general", "shortcuts", "organization", "performer-slots", "derivation"],
  );
  assert.match(settings, /visibleSegmentStudioSettingsTabs\(profile\)/);
  assert.match(settings, /Analysis service/);
  assert.match(settings, /Server URL/);
  assert.match(settings, /requestJson\("\/analysis\/settings"/);
  assert.match(settings, /method: "PUT"/);
  assert.match(settings, /error\.status === 403/);
  assert.match(settings, /!analysisCanManage/);
  assert.match(settings, /hidden: activeSettingsTab !== "shortcuts" \},\s+h\(PlaybackShortcutSettings/);
  assert.match(settings, /hidden: activeSettingsTab !== "performer-slots" \},\s+h\(PerformerSlotOverviewSettings/);
  assert.match(settings, /hidden: activeSettingsTab !== "derivation" \},\s+h\(DerivedSegmentRuleSettings/);
  assert.match(settings, /onSegmentGroupsChanged: \(\) => loadGroups\(\)/);
  assert.doesNotMatch(settings, /SlotDefinitionSettings/);
  assert.doesNotMatch(settings, /Find (?:canonical|Segment) tags to add/);
  assert.match(settings, /"aria-current": activeSettingsTab === key \? "page"/);
  assert.match(settings, /className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"/);
});

test("General settings order workflow, confirmations, then Full-only analysis", () => {
  const settings = source.slice(
    source.indexOf("function SegmentStudioSettingsPage"),
    source.indexOf("function SegmentStudioTabs"),
  );
  const workflow = settings.indexOf('key: "mode"');
  const confirmations = settings.indexOf('key: "confirmations"');
  const analysis = settings.indexOf('key: "analysis"');

  assert.ok(workflow >= 0 && workflow < confirmations);
  assert.ok(confirmations < analysis);
  assert.match(settings, /if \(profile\.effectiveMode !== "full"\)/);
  assert.match(settings, /setAnalysisMessage\(""\);\s*setAnalysisLoading\(true\);/);
  assert.match(settings, /\.then\(\(\[settings, status\]\) => \{\s*setAnalysisCanManage\(true\);/);
  assert.match(settings, /profile\.effectiveMode === "full"\s*\? h\("section", \{ key: "analysis"/);
});

test("Organization settings use a drag-first card organizer with on-demand tag pickers", () => {
  const card = source.slice(
    source.indexOf("function SegmentGroupCard"),
    source.indexOf("function SlotDefinitionSettings"),
  );
  const settings = source.slice(
    source.indexOf("function SegmentStudioSettingsPage"),
    source.indexOf("function SegmentStudioTabs"),
  );

  assert.match(card, /draggable: !busy/);
  assert.match(card, /data-segment-group-drag-handle/);
  assert.match(card, /data-segment-tag-drag-handle/);
  assert.match(card, /Add tags to \$\{group\.name\}/);
  assert.match(card, /Rename group/);
  assert.match(card, /Delete group/);
  assert.match(card, /selectedTagIds/);
  assert.doesNotMatch(card, /Move .* up|Move .* down|Add or move Segment tag/);
  assert.doesNotMatch(card, /renderTagDropLine|group\.tags\.flatMap/);
  assert.match(card, /data-segment-tag-drop-indicator/);
  assert.match(card, /pointer-events-none absolute left-0 right-0/);
  assert.doesNotMatch(card, /-left-px|-right-px|-top-1|-bottom-1/);
  assert.match(card, /groupIndex === groups\.length - 1[\s\S]*dropTarget\.index === groups\.length/);
  assert.match(settings, /Create group/);
  assert.match(settings, /showCreateGroup/);
  assert.doesNotMatch(settings, /tagSearch|Find Segment tags to add/);
});

test("Organization reorder helpers preserve ordering and move tags between groups", () => {
  const groups = [
    {
      id: 1,
      name: "First",
      sortOrder: 0,
      tags: [
        { tagId: 11, tagName: "Alpha", sortOrder: 0 },
        { tagId: 12, tagName: "Beta", sortOrder: 1 },
      ],
    },
    {
      id: 2,
      name: "Second",
      sortOrder: 1,
      tags: [{ tagId: 13, tagName: "Gamma", sortOrder: 0 }],
    },
    { id: 3, name: "Empty", sortOrder: 2, tags: [] },
  ];

  const reordered = ui.reorderSegmentGroups(groups, 3, 0);
  assert.deepEqual(reordered.map((group) => group.id), [3, 1, 2]);
  assert.deepEqual(reordered.map((group) => group.sortOrder), [0, 1, 2]);

  const withinGroup = ui.moveSegmentGroupTag(groups, 12, 1, 0);
  assert.deepEqual(withinGroup[0].tags.map((tag) => tag.tagId), [12, 11]);
  assert.deepEqual(withinGroup[0].tags.map((tag) => tag.sortOrder), [0, 1]);

  const acrossGroups = ui.moveSegmentGroupTag(groups, 12, 2, 1);
  assert.deepEqual(acrossGroups[0].tags.map((tag) => tag.tagId), [11]);
  assert.deepEqual(acrossGroups[1].tags.map((tag) => tag.tagId), [13, 12]);
  assert.deepEqual(acrossGroups[1].tags.map((tag) => tag.sortOrder), [0, 1]);

  const intoEmpty = ui.moveSegmentGroupTag(groups, 11, 3, 0);
  assert.deepEqual(intoEmpty[0].tags.map((tag) => tag.tagId), [12]);
  assert.deepEqual(intoEmpty[2].tags.map((tag) => tag.tagId), [11]);
  assert.equal(ui.moveSegmentGroupTag(groups, 999, 3, 0), groups);
  assert.equal(ui.reorderSegmentGroups(groups, 999, 0), groups);
});

test("performer slot overview groups tags and appends slot-bearing ungrouped tags", () => {
  const groups = [
    {
      id: 2,
      name: "Second",
      sortOrder: 1,
      tags: [{ tagId: 30, tagName: "No slots", sortOrder: 0 }],
    },
    {
      id: 1,
      name: "First",
      sortOrder: 0,
      tags: [
        { tagId: 20, tagName: "Receiver activity", sortOrder: 1 },
        { tagId: 10, tagName: "Giver activity", sortOrder: 0 },
      ],
    },
  ];
  const summaries = [
    {
      tagId: 40,
      tagName: "Zulu ungrouped",
      allowSamePerformerInMultipleSlots: false,
      definitions: [{ id: "z", label: "Observer", sortOrder: 0, genderHints: [] }],
    },
    {
      tagId: 10,
      tagName: "Giver activity",
      allowSamePerformerInMultipleSlots: true,
      definitions: [
        { id: "b", label: null, sortOrder: 1, genderHints: [] },
        { id: "a", label: "Giver", sortOrder: 0, genderHints: ["FEMALE"] },
      ],
    },
    {
      tagId: 50,
      tagName: "Alpha ungrouped",
      allowSamePerformerInMultipleSlots: false,
      definitions: [{ id: "c", label: "Target", sortOrder: 0, genderHints: [] }],
    },
    {
      tagId: 60,
      tagName: "Empty ungrouped",
      allowSamePerformerInMultipleSlots: false,
      definitions: [],
    },
  ];

  const overview = ui.buildPerformerSlotOverview(groups, summaries);

  assert.deepEqual(overview.map((group) => group.name), ["First", "Second", "Ungrouped"]);
  assert.deepEqual(overview[0].tags.map((tag) => tag.tagId), [10, 20]);
  assert.deepEqual(overview[0].tags[0].definitions.map((slot) => slot.id), ["a", "b"]);
  assert.deepEqual(overview[1].tags.map((tag) => tag.tagId), [30]);
  assert.deepEqual(overview[2].tags.map((tag) => tag.tagName), ["Alpha ungrouped", "Zulu ungrouped"]);
});

test("performer slot overview filters coverage and searches tag and slot labels", () => {
  const groups = ui.buildPerformerSlotOverview(
    [{
      id: 1,
      name: "Activities",
      sortOrder: 0,
      tags: [
        { tagId: 10, tagName: "Alpha", sortOrder: 0 },
        { tagId: 20, tagName: "Beta", sortOrder: 1 },
      ],
    }],
    [{
      tagId: 10,
      tagName: "Alpha",
      allowSamePerformerInMultipleSlots: false,
      definitions: [{ id: "a", label: "Receiver", sortOrder: 0, genderHints: [] }],
    }],
  );

  assert.deepEqual(ui.filterPerformerSlotOverview(groups, "", "with")
    .flatMap((group) => group.tags.map((tag) => tag.tagId)), [10]);
  assert.deepEqual(ui.filterPerformerSlotOverview(groups, "", "without")
    .flatMap((group) => group.tags.map((tag) => tag.tagId)), [20]);
  assert.deepEqual(ui.filterPerformerSlotOverview(groups, "receiver", "all")
    .flatMap((group) => group.tags.map((tag) => tag.tagId)), [10]);
  assert.deepEqual(ui.filterPerformerSlotOverview(groups, "beta", "all")
    .flatMap((group) => group.tags.map((tag) => tag.tagId)), [20]);
  assert.deepEqual(ui.filterPerformerSlotOverview(groups, "missing", "all"), []);
});

test("performer slot settings use one bulk summary request and keep slot details inline", () => {
  const overview = source.slice(
    source.indexOf("function PerformerSlotOverviewSettings"),
    source.indexOf("function SegmentStudioSettingsPage"),
  );

  assert.match(overview, /requestJson\("\/slot-definitions"/);
  assert.doesNotMatch(overview, /slot-definitions\/\$\{/);
  assert.match(overview, /Search tags and performer slots/);
  assert.match(overview, /With slots/);
  assert.match(overview, /Without slots/);
  assert.match(overview, /No performer slots/);
  assert.match(overview, /Allow same performer/);
  assert.match(overview, /h\("ul", \{\s+key: "slots",[\s\S]*?className: "grid min-w-0 gap-2"/);
  assert.match(overview, /tag\.definitions\.map\(\(definition\) => h\("li"/);
  assert.match(overview, /key: "tag",[\s\S]*?style: \{ width: "14rem", flexShrink: 0 \}/);
  assert.match(overview, /key: "slots",[\s\S]*?style: \{ width: "100%", maxWidth: "32rem", flexShrink: 1 \}/);
  assert.match(overview, /key: "edit",[\s\S]*?style: \{ marginLeft: "auto", flexShrink: 0 \}/);
  assert.match(overview, /aria-expanded/);
  assert.match(overview, /h\(InlineTagConfigurationDialog/);
});

test("in-editor slot configuration retains assignment-aware deletion", () => {
  assert.match(source, /function SlotDefinitionSettings/);
  assert.match(source, /\/slot-definitions\/\$\{tagId\}/);
  assert.match(source, /id: definition\.id \|\| undefined/);
  assert.match(source, /definition\.assignmentCount/);
  assert.match(source, /window\.confirm/);
  assert.match(source, /confirmDeleteAssigned: confirmedAssignedDeletion/);
  assert.match(source, /error\.payload\?\.current/);
  assert.doesNotMatch(source, /confirmDeleteAssigned: true/);
  assert.match(source, /Allow the same performer in multiple slots/);
  const settings = source.slice(
    source.indexOf("function SegmentStudioSettingsPage"),
    source.indexOf("function SegmentStudioTabs"),
  );
  assert.doesNotMatch(settings, /Performer slot definitions/);
});

test("inline swimlane tag configuration preserves complete off-video group membership", () => {
  const groups = [
    {
      id: 1,
      name: "Acts",
      tags: [
        { tagId: 10, tagName: "Alpha", sortOrder: 0 },
        { tagId: 20, tagName: "Beta", sortOrder: 1 },
      ],
    },
    {
      id: 2,
      name: "Finishes",
      tags: [
        { tagId: 30, tagName: "Off-video tag", sortOrder: 0 },
        { tagId: 40, tagName: "Another off-video tag", sortOrder: 1 },
      ],
    },
    { id: 3, name: "Empty group", tags: [] },
  ];

  assert.deepEqual(ui.segmentGroupAssignmentMutation(groups, 20, 2), {
    groupId: 2,
    name: "Finishes",
    tagIds: [30, 40, 20],
  });
  assert.deepEqual(ui.segmentGroupAssignmentMutation(groups, 20, null), {
    groupId: 1,
    name: "Acts",
    tagIds: [10],
  });
  assert.deepEqual(ui.segmentGroupAssignmentMutation(groups, 20, 3), {
    groupId: 3,
    name: "Empty group",
    tagIds: [20],
  });
  assert.equal(ui.segmentGroupAssignmentMutation(groups, 20, 1), null);
  assert.equal(ui.segmentGroupAssignmentMutation(groups, 99, null), null);
});

test("swimlane titles open inline tag configuration for groups and performer slots", () => {
  const timeline = source.slice(
    source.indexOf("function SwimlaneTimeline"),
    source.indexOf("function SegmentRail"),
  );
  const dialog = source.slice(
    source.indexOf("function InlineTagConfigurationDialog"),
    source.indexOf("function SegmentEditor"),
  );

  assert.match(timeline, /onConfigureTag/);
  assert.match(timeline, /aria-label": `Configure \$\{lane\.label\}`/);
  assert.match(timeline, /title: "Configure tag"/);
  assert.match(timeline, /key: "configure"[\s\S]*key: "name"[\s\S]*lane\.label/);
  assert.match(timeline, /onMouseEnter: \(\) => setHoveredLaneKey\(lane\.key\)/);
  assert.match(timeline, /onMouseLeave: \(\) => setHoveredLaneKey\(\(current\) => current === lane\.key \? null : current\)/);
  assert.match(timeline, /border-border px-3 pl-5/);
  assert.doesNotMatch(timeline, /showHeaders \? "pl-5"/);
  assert.match(timeline, /absolute left-0\.5[\s\S]*opacity-0/);
  assert.match(timeline, /style: \{ width: "1\.125rem", height: "1\.125rem", fontSize: "1rem", lineHeight: 1, opacity: hoveredLaneKey === lane\.key \? 1 : undefined \}/);
  assert.match(dialog, /Configure Tag: \$\{tagName\}/);
  assert.match(dialog, /Segment group/);
  assert.match(dialog, /Ungrouped/);
  assert.match(dialog, /requestJson\("\/segment-groups"/);
  assert.match(dialog, /h\("select"[\s\S]*segmentGroups\.map\(\(group\)/);
  assert.doesNotMatch(dialog, /name: "inline-tag-segment-group"/);
  assert.match(dialog, /Performer slots/);
  assert.match(dialog, /Allow the same performer in multiple slots/);
  assert.match(dialog, /requestJson\(`\/slot-definitions\/\$\{tagId\}`/);
  assert.match(dialog, /requestJson\(`\/segment-groups\/\$\{mutation\.groupId\}`/);
  assert.match(dialog, /confirmDeleteAssigned: confirmedAssignedDeletion/);
  assert.match(dialog, /saved, but the configuration could not be fully refreshed/);
  assert.match(dialog, /definition\._clientKey/);
  assert.match(source, /h\(InlineTagConfigurationDialog/);
  assert.match(source, /trigger: event\.currentTarget/);
  assert.match(source, /const trigger = configuringTag\.trigger[\s\S]*trigger\?\.isConnected/);
});

test("settings manage derived segment rule lifecycles with tag autocomplete and slot mappings", () => {
  const settings = source.slice(
    source.indexOf("function DerivedSegmentRuleSettings"),
    source.indexOf("function PlaybackShortcutSettings"),
  );

  assert.match(settings, /requestJson\("\/derivation-rules"/);
  assert.match(settings, /h\(EntityReferenceSelector/);
  assert.match(settings, /Source tag \(specific\)/);
  assert.match(settings, /Derived tag \(general\)/);
  assert.match(settings, /sourceSlotDefinitionId/);
  assert.match(settings, /derivedSlotDefinitionId/);
  assert.match(settings, /Complete or remove every performer slot mapping before saving\./);
  assert.doesNotMatch(settings, /slotMappings:\s*draft\.slotMappings\.filter/);
  assert.match(settings, /onChange: \(tagId, option\) => updateTag\("source", tagId, option\?\.label\)/);
  assert.match(settings, /onChange: \(tagId, option\) => updateTag\("derived", tagId, option\?\.label\)/);
  assert.match(settings, /draft\.ruleId == null && draft\.sourceTagId && !sourceSlotsLoading && sourceSlots\.length === 0/);
  assert.match(settings, /draft\.ruleId == null && draft\.derivedTagId && !derivedSlotsLoading && derivedSlots\.length === 0/);
  assert.match(settings, /No performer slots configured\./);
  assert.match(settings, /Configure source tag/);
  assert.match(settings, /Configure derived tag/);
  assert.match(settings, /refreshConfiguredTag\(configuringTag\)/);
  assert.match(settings, /cleanupFingerprint/);
  assert.match(settings, /Materialize now/);
  assert.match(settings, /Delete/);
  assert.match(source, /key: "derivation-rules-panel"[\s\S]*h\(DerivedSegmentRuleSettings, \{[\s\S]*segmentGroups: groups,[\s\S]*onSegmentGroupsChanged/);
  assert.match(settings, /draft \? renderRuleEditor\(\) : renderSelectionDetails\(\)/);
  assert.match(settings, /editorRef\.current\?\.scrollIntoView\(\{ block: "nearest" \}\)/);
});

test("new derivation rules suggest matching performer slot mappings", () => {
  const sourceSlots = [
    { id: "source-receiver", label: "Receiver", sortOrder: 0 },
    { id: "source-giver-2", label: "Giver", sortOrder: 2 },
    { id: "source-giver-1", label: "Giver", sortOrder: 1 },
    { id: "source-unmatched", label: "Observer", sortOrder: 3 },
  ];
  const derivedSlots = [
    { id: "derived-giver-1", label: " giver ", sortOrder: 0 },
    { id: "derived-receiver", label: "RECEIVER", sortOrder: 1 },
    { id: "derived-giver-2", label: "Giver", sortOrder: 2 },
  ];

  assert.deepEqual(
    ui.suggestDerivationRuleSlotMappings(sourceSlots, derivedSlots),
    [
      {
        sourceSlotDefinitionId: "source-receiver",
        derivedSlotDefinitionId: "derived-receiver",
      },
      {
        sourceSlotDefinitionId: "source-giver-1",
        derivedSlotDefinitionId: "derived-giver-1",
      },
      {
        sourceSlotDefinitionId: "source-giver-2",
        derivedSlotDefinitionId: "derived-giver-2",
      },
    ],
  );
  assert.deepEqual(
    ui.suggestDerivationRuleSlotMappings(
      sourceSlots.filter((slot) => slot.label === "Giver"),
      derivedSlots.filter((slot) => slot.id === "derived-giver-1"),
    ),
    [],
  );
  const existingMapping = {
    sourceSlotDefinitionId: "chosen-source",
    derivedSlotDefinitionId: "chosen-derived",
  };
  const editedDraft = { ruleId: "existing-rule", slotMappings: [] };
  const customizedDraft = { ruleId: null, slotMappings: [existingMapping] };
  assert.equal(
    ui.applyDerivationRuleSlotSuggestions(editedDraft, sourceSlots, derivedSlots),
    editedDraft,
  );
  assert.equal(
    ui.applyDerivationRuleSlotSuggestions(customizedDraft, sourceSlots, derivedSlots),
    customizedDraft,
  );

  const settings = source.slice(
    source.indexOf("function DerivedSegmentRuleSettings"),
    source.indexOf("function PlaybackShortcutSettings"),
  );
  assert.match(settings, /applyDerivationRuleSlotSuggestions\(current, sourceSlots, derivedSlots\)/);
  assert.match(settings, /draft\.ruleId != null/);
  assert.match(settings, /Matching performer slots were suggested automatically\./);
});

test("derivation rule graphs preserve fan-in, branching, and components", () => {
  const rules = [
    { id: "a", sourceTagId: 1, sourceTagName: "Specific A", derivedTagId: 4, derivedTagName: "Shared" },
    { id: "b", sourceTagId: 2, sourceTagName: "Specific B", derivedTagId: 4, derivedTagName: "Shared" },
    { id: "c", sourceTagId: 3, sourceTagName: "Specific C", derivedTagId: 4, derivedTagName: "Shared" },
    { id: "d", sourceTagId: 4, sourceTagName: "Shared", derivedTagId: 5, derivedTagName: "General" },
    { id: "e", sourceTagId: 3, sourceTagName: "Specific C", derivedTagId: 6, derivedTagName: "Alternate" },
    { id: "g", sourceTagId: 20, sourceTagName: "Other source", derivedTagId: 21, derivedTagName: "Other target" },
  ];
  const segmentGroups = [
    {
      id: 10,
      name: "Primary group",
      sortOrder: 0,
      tags: [
        { tagId: 1, sortOrder: 0 },
        { tagId: 4, sortOrder: 1 },
        { tagId: 5, sortOrder: 2 },
      ],
    },
    {
      id: 11,
      name: "Related group",
      sortOrder: 1,
      tags: [
        { tagId: 2, sortOrder: 0 },
        { tagId: 3, sortOrder: 1 },
        { tagId: 6, sortOrder: 2 },
      ],
    },
  ];

  const graph = ui.buildDerivationRuleGraph(rules, segmentGroups);
  assert.equal(graph.components.length, 2);
  assert.equal(graph.nodes.length, 8);
  assert.deepEqual(graph.segmentGroups.map((group) => group.name), [
    "Primary group",
    "Related group",
    "Ungrouped",
  ]);

  const primary = graph.components.find((component) => component.nodes.some((node) => node.tagId === 4));
  const shared = primary.nodes.find((node) => node.tagId === 4);
  const branching = primary.nodes.find((node) => node.tagId === 3);
  assert.equal(shared.incomingRuleCount, 3);
  assert.equal(shared.outgoingRuleCount, 1);
  assert.equal(shared.segmentGroupName, "Primary group");
  assert.equal(branching.outgoingRuleCount, 2);

  const bundled = primary.connections.find((connection) =>
    connection.sourceTagId === 1 && connection.derivedTagId === 4);
  assert.deepEqual(bundled.rules.map((rule) => rule.id), ["a"]);

  const layout = ui.layoutDerivationRuleComponent(primary);
  const positions = new Map(layout.nodes.map((node) => [node.tagId, node]));
  assert.ok(positions.get(1).x < positions.get(4).x);
  assert.ok(positions.get(4).x < positions.get(5).x);
  assert.deepEqual(layout.groups.map((group) => group.name), ["Primary group", "Related group"]);
  assert.ok(layout.width >= 720);
  assert.ok(layout.height >= 420);

  const combined = ui.layoutDerivationRuleComponents(graph.components);
  assert.equal(combined.nodes.length, graph.nodes.length);
  assert.equal(combined.connections.length, graph.connections.length);
  const primaryBottom = Math.max(...combined.nodes
    .filter((node) => primary.nodes.some((candidate) => candidate.tagId === node.tagId))
    .map((node) => node.y + node.height));
  const secondaryTop = Math.min(...combined.nodes
    .filter((node) => !primary.nodes.some((candidate) => candidate.tagId === node.tagId))
    .map((node) => node.y));
  assert.ok(primaryBottom < secondaryTop);
});

test("derivation settings expose every rule island in graph and list views", () => {
  const settings = source.slice(
    source.indexOf("function DerivedSegmentRuleSettings"),
    source.indexOf("function PlaybackShortcutSettings"),
  );

  assert.match(settings, /Derivation rules/);
  assert.match(settings, /Segment groups/);
  assert.doesNotMatch(settings, /Connected components/);
  assert.doesNotMatch(settings, /connected component/);
  assert.doesNotMatch(settings, /const \[componentId/);
  assert.match(settings, /"aria-label": "Search derivation rules"/);
  assert.match(settings, /"aria-label": "Derivation rule graph"/);
  assert.match(settings, /Specific/);
  assert.match(settings, /General/);
  assert.match(settings, /Rule details/);
  assert.match(settings, /\["graph", "Graph"\],\s+\["list", "List"\]/);
  assert.match(settings, /Relationship/);
  assert.match(settings, /Materialized/);
  assert.match(settings, /Materialize pending/);
  assert.match(settings, /Materialize outgoing/);
  assert.match(settings, /Edit rule/);
  assert.match(settings, /deletion\/preview/);
  assert.match(settings, /Deleted segments/);
  assert.match(settings, /key: "source",\s+value: mapping\.sourceSlotDefinitionId,\s+disabled: busy/);
  assert.match(settings, /key: "derived",\s+value: mapping\.derivedSlotDefinitionId,\s+disabled: busy/);
  assert.doesNotMatch(settings, /historicalRules/);
  assert.doesNotMatch(settings, /Historical rule versions/);
});

test("derivation search does not auto-select an unrelated contextual rule", () => {
  const rules = [
    { id: "unrelated", sourceTagName: "Other source", derivedTagName: "Shared target" },
    { id: "matching", sourceTagName: "Matching source", derivedTagName: "Shared target" },
  ];

  assert.equal(ui.resolveSelectedDerivationRule(null, rules, false), rules[0]);
  assert.equal(ui.resolveSelectedDerivationRule(null, rules, true), null);
  assert.equal(
    ui.resolveSelectedDerivationRule({ type: "rule", id: "matching" }, rules, true),
    rules[1],
  );
});

test("derivation rule drafts reject duplicate relationships and cycles before saving", () => {
  const rules = [
    { id: "a", sourceTagId: 1, derivedTagId: 2 },
    { id: "b", sourceTagId: 2, derivedTagId: 3 },
  ];

  assert.equal(
    ui.validateDerivationRuleDraft(
      { ruleId: null, sourceTagId: 1, derivedTagId: 2 },
      rules,
    ).code,
    "LINEAGE_RULE_DUPLICATE",
  );
  assert.equal(
    ui.validateDerivationRuleDraft(
      { ruleId: null, sourceTagId: 3, derivedTagId: 1 },
      rules,
    ).code,
    "LINEAGE_CYCLE",
  );
  assert.equal(
    ui.validateDerivationRuleDraft(
      { ruleId: "a", sourceTagId: 1, derivedTagId: 2 },
      rules,
    ),
    null,
  );
});

test("derivation graph and list share a persistent two-pane rule editor", () => {
  const settings = source.slice(
    source.indexOf("function DerivedSegmentRuleSettings"),
    source.indexOf("function PlaybackShortcutSettings"),
  );
  const graphView = settings.slice(
    settings.indexOf("function renderGraph()"),
    settings.indexOf("function renderList()"),
  );
  const listViewStart = settings.indexOf("function renderList()");
  const listView = settings.slice(
    listViewStart,
    settings.indexOf('\n  return h("section", {', listViewStart),
  );
  const nodeDetails = settings.slice(
    settings.indexOf("if (selectedNode)"),
    settings.indexOf("if (!selectedRule)"),
  );

  assert.match(settings, /gridTemplateColumns: "minmax\(38rem, 1fr\) 22rem"/);
  assert.match(settings, /"aria-label": "Segment group"/);
  assert.match(settings, /value: segmentGroupKey,\s+disabled: draft != null/);
  assert.doesNotMatch(settings, /componentOptions/);
  assert.match(settings, /draftIssue/);
  assert.match(settings, /draft \? renderRuleEditor\(\) : renderSelectionDetails\(\)/);
  assert.doesNotMatch(settings, /"aria-label": "Segment groups"/);
  assert.doesNotMatch(settings, /gridTemplateColumns: "13rem minmax\(38rem, 1fr\) 20rem"/);
  assert.equal(
    (settings.match(/gridTemplateColumns: "minmax\(15rem, 1fr\) 7rem 7rem"/g) || []).length,
    2,
  );
  assert.match(graphView, /setSelection\(\{ type: "node", id: node\.tagId \}\)/);
  assert.doesNotMatch(graphView, /setSelection\(\{ type: "rule"/);
  assert.match(listView, /setSelection\(\{ type: "rule", id: rule\.id \}\)/);
  assert.match(settings, /const selectedRule = view === "list"/);
  assert.match(settings, /view === "graph"\s+\? \{ type: "node", id: Number\(saved\.sourceTagId\) \}/);
  assert.match(settings, /function DerivedSegmentRuleSettings\(\{ segmentGroups = \[\], onSegmentGroupsChanged \}\)/);
  assert.match(settings, /"Configure tag"/);
  assert.match(settings, /h\(InlineTagConfigurationDialog/);
  assert.match(settings, /onSaved: \(\) => refreshConfiguredTag\(configuringTag\)/);
  assert.ok(
    nodeDetails.indexOf('key: "outgoing"') < nodeDetails.indexOf('key: "incoming"'),
  );
  assert.match(nodeDetails, /h\("details", \{\s+key: "incoming"/);
  assert.doesNotMatch(nodeDetails, /h\("details", \{\s+key: "incoming",\s+open:/);
  assert.equal(
    (settings.match(/onClick: \(\) => deleteRule\(/g) || []).length,
    2,
  );
});

test("performer slot choices are restricted to video performers", () => {
  const all = [
    { id: 3, name: "Una", gender: "female" },
    { id: 2, name: "Zed", gender: "male" },
    { id: 4, name: "Alex", gender: "non_binary" },
  ];
  const video = [{ id: 2, name: "Zed", gender: "male" }];
  assert.deepEqual(ui.rankPerformerOptions(all, video, ["female"]).map((performer) => performer.id), [2, 3, 4]);
  assert.deepEqual(ui.rankPerformerOptions(all, [], ["female"]).map((performer) => performer.id), [3, 4, 2]);
  const projected = [
    { performerId: 8, name: "Existing", gender: "Male", isVideoPerformer: false },
    { performerId: 9, name: "Video", gender: "Male", isVideoPerformer: true },
    { performerId: 10, name: "Hint", gender: "Female", isVideoPerformer: false },
  ];
  assert.deepEqual(ui.rankPerformerOptions(projected, [], ["FEMALE"]).map(ui.performerOptionId), [9, 10, 8]);
  assert.deepEqual(ui.videoPerformerOptions(projected).map(ui.performerOptionId), [9]);
  assert.deepEqual(ui.videoPerformerSlotAssignments([
    { slotDefinitionId: "kept", performerId: 9 },
    { slotDefinitionId: "cleared", performerId: 10 },
  ], projected), { kept: "9", cleared: "" });
  const slotEditor = source.slice(
    source.indexOf("function PerformerSlotAssignmentEditor"),
    source.indexOf("function SwimlaneTimeline"),
  );
  assert.doesNotMatch(slotEditor, /Find a performer|Search authorized performers|\/api\/performers|remotePerformers/);
  assert.match(slotEditor, /rankPerformerOptions\(videoPerformers, videoPerformers, slot\.genderHints\)/);
  assert.match(slotEditor, /videoPerformerIdentity/);
  assert.match(slotEditor, /const sanitizedAssignments = videoPerformerSlotAssignments/);
  assert.match(slotEditor, /\[segmentId, itemId, slotIdentity, videoPerformerIdentity\]/);
  assert.doesNotMatch(source, /slot\.performerCandidates/);
});

test("performer slot recommendations mirror Marker Studio number-key assignments", () => {
  const slots = [
    { slotDefinitionId: "giver", label: "Giver", genderHints: ["FEMALE"], allowSamePerformerInMultipleSlots: false },
    { slotDefinitionId: "receiver", label: "Receiver", genderHints: ["MALE"], allowSamePerformerInMultipleSlots: false },
  ];
  const performers = [
    { performerId: 1, name: "Alexis", gender: "Female", isVideoPerformer: true },
    { performerId: 2, name: "Caprice", gender: "Female", isVideoPerformer: true },
    { performerId: 3, name: "Marcello", gender: "Male", isVideoPerformer: true },
  ];
  const recommendations = ui.generatePerformerSlotAssignmentRecommendations(slots, performers);
  assert.deepEqual(recommendations.map((recommendation) => recommendation.description), [
    "Giver: Alexis, Receiver: Marcello",
    "Giver: Caprice, Receiver: Marcello",
  ]);
  assert.deepEqual(recommendations[1].assignments, { giver: "2", receiver: "3" });

  const interchangeableSlots = Array.from({ length: 6 }, (_, index) => ({
    slotDefinitionId: `slot-${index}`,
    label: null,
    genderHints: [],
    allowSamePerformerInMultipleSlots: false,
  }));
  const interchangeablePerformers = Array.from({ length: 9 }, (_, index) => ({
    performerId: index + 1,
    name: `Performer ${index + 1}`,
    isVideoPerformer: true,
  }));
  const capped = ui.generatePerformerSlotAssignmentRecommendations(interchangeableSlots, interchangeablePerformers);
  assert.equal(capped.length, 9);
  assert.ok(capped.every((recommendation) => {
    const ids = Object.values(recommendation.assignments).map(Number);
    return ids.every((id, index) => index === 0 || ids[index - 1] < id);
  }));
  assert.deepEqual(ui.generatePerformerSlotAssignmentRecommendations(
    [{ ...slots[0] }, { ...slots[1], label: null }],
    performers,
  ), []);
  assert.deepEqual(ui.generatePerformerSlotAssignmentRecommendations(
    slots,
    performers.filter((performer) => performer.name === "Alexis"),
  ), [{
    assignments: { giver: "1", receiver: "" },
    description: "Giver: Alexis, Receiver: Unassigned",
  }]);

  const ambiguousPartial = ui.generatePerformerSlotAssignmentRecommendations([
    { slotDefinitionId: "first", label: "First", genderHints: ["FEMALE"], allowSamePerformerInMultipleSlots: false },
    { slotDefinitionId: "second", label: "Second", genderHints: ["FEMALE"], allowSamePerformerInMultipleSlots: false },
    { slotDefinitionId: "missing", label: "Missing", genderHints: ["MALE"], allowSamePerformerInMultipleSlots: false },
  ], performers.filter((performer) => performer.gender === "Female"));
  assert.deepEqual(ambiguousPartial.map((recommendation) => recommendation.description), [
    "First: Alexis, Second: Caprice, Missing: Unassigned",
    "First: Caprice, Second: Alexis, Missing: Unassigned",
  ]);
  assert.ok(ambiguousPartial.every((recommendation) => recommendation.assignments.missing === ""));

  const cappedPartial = ui.generatePerformerSlotAssignmentRecommendations([
    ...Array.from({ length: 5 }, (_, index) => ({
      slotDefinitionId: `female-${index}`,
      label: `Female ${index}`,
      genderHints: ["FEMALE"],
      allowSamePerformerInMultipleSlots: false,
    })),
    ...Array.from({ length: 5 }, (_, index) => ({
      slotDefinitionId: `male-${index}`,
      label: `Male ${index}`,
      genderHints: ["MALE"],
      allowSamePerformerInMultipleSlots: false,
    })),
  ], Array.from({ length: 10 }, (_, index) => ({
    performerId: index + 1,
    name: `Female ${index}`,
    gender: "Female",
    isVideoPerformer: true,
  })));
  assert.equal(cappedPartial.length, 9);
  assert.ok(cappedPartial.every((recommendation) =>
    Object.values(recommendation.assignments).filter(Boolean).length === 5));

  const overlappingPartial = ui.generatePerformerSlotAssignmentRecommendations([
    ...Array.from({ length: 5 }, (_, index) => ({
      slotDefinitionId: `flexible-${index}`,
      label: `Flexible ${index}`,
      genderHints: ["FEMALE", "MALE"],
      allowSamePerformerInMultipleSlots: false,
    })),
    ...Array.from({ length: 5 }, (_, index) => ({
      slotDefinitionId: `female-only-${index}`,
      label: `Female only ${index}`,
      genderHints: ["FEMALE"],
      allowSamePerformerInMultipleSlots: false,
    })),
    {
      slotDefinitionId: "unavailable",
      label: "Unavailable",
      genderHints: ["NON_BINARY"],
      allowSamePerformerInMultipleSlots: false,
    },
  ], [
    ...Array.from({ length: 5 }, (_, index) => ({ performerId: index + 1, name: `Female ${index}`, gender: "Female" })),
    ...Array.from({ length: 5 }, (_, index) => ({ performerId: index + 6, name: `Male ${index}`, gender: "Male" })),
  ]);
  assert.equal(overlappingPartial.length, 9);
  assert.ok(overlappingPartial.every((recommendation) =>
    recommendation.assignments.unavailable === ""
    && Object.values(recommendation.assignments).filter(Boolean).length === 10));

  assert.deepEqual(ui.generatePerformerSlotAssignmentRecommendations(
    slots,
    [{ performerId: 4, name: "No Match", gender: "NonBinary", isVideoPerformer: true }],
  ), []);

  const slotEditor = source.slice(
    source.indexOf("function PerformerSlotAssignmentEditor"),
    source.indexOf("function SwimlaneTimeline"),
  );
  assert.match(slotEditor, /Auto-assignment options/);
  assert.match(slotEditor, /Press number keys 1-/);
  assert.match(slotEditor, /applyAndSaveRecommendation/);
  assert.match(slotEditor, /Apply option \$\{index \+ 1\}/);
  assert.match(slotEditor, /Option \$\{index \+ 1\} applied; save to confirm\./);
  assert.match(source, /interchangeableSlotKey/);
  assert.match(source, /recommendationShortcutRef/);
  assert.match(source, /event\.target\.closest\("input, textarea, select, \[contenteditable='true'\]"\)/);
  assert.match(source, /!event\.repeat/);
});

test("every supported performer gender hint normalizes", () => {
  assert.deepEqual([
    ["Male", "MALE"],
    ["Female", "FEMALE"],
    ["TransgenderMale", "TRANSGENDER_MALE"],
    ["TransgenderFemale", "TRANSGENDER_FEMALE"],
  ].map(([gender, hint]) => ui.normalizeGender(gender) === ui.normalizeGender(hint)), [true, true, true, true]);
});

test("open-ended Browse segments play through the video duration and have a clear range label", () => {
  assert.equal(ui.browseClipEnd({ startSec: 12, endSec: null, videoFile: { duration: 90 } }), 90);
  assert.equal(ui.browseClipEnd({ startSec: 12, endSec: 20, videoFile: { duration: 90 } }), 20);
  assert.equal(ui.browseClipEnd({ startSec: 12, endSec: null, videoFile: null }), 12.001);
  assert.match(source, /item\.endSec == null \? `\$\{formatTime\(item\.startSec\)\} → end`/);
  assert.match(source, /item\.endSec == null \? "end of video"/);
  assert.doesNotMatch(source, /end: item\.endSec \?\? item\.startSec/);
});

test("settings constrain gender hints to backend-supported enum values", () => {
  assert.match(source, /const GENDER_HINTS = \["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"\]/);
  assert.match(source, /GENDER_HINTS\.map\(\(hint\)/);
  assert.match(source, /\(definition\.genderHints \|\| \[\]\)\.includes\(hint\)/);
  assert.doesNotMatch(source, /Gender hints \(comma separated\)/);
});

test("editor mode gates compatibility approval and performer-slot workflow", () => {
  const editor = source.slice(source.indexOf("function SegmentActiveEditor"), source.indexOf("const DISCOVERY_SORT_OPTIONS"));
  assert.doesNotMatch(editor, /compatibilityMode \? h\("div", \{ key: "review"/);
  assert.doesNotMatch(editor, /approve\/unapprove/);
  assert.match(editor, /slotsOpen && compatibilityMode && selectedSegment/);
  assert.match(editor, /h\(PerformerSlotAssignmentEditor/);
  assert.doesNotMatch(editor, /Move to bin/);
  assert.doesNotMatch(editor, /onMoveToBin/);
});

test("clicking a marker preserves button focus while keyboard navigation can return focus to the editor", () => {
  assert.match(source, /onClick: \(event\) => selectSegment\(segment, \{ additive: event\.metaKey \|\| event\.ctrlKey \}\)/);
  assert.match(source, /selectSegment\(target, \{ focusEditor: true, seekToSegment: false \}\)/);
  assert.doesNotMatch(source, /onClick: \(\) => selectSegment\(segment, \{ focusEditor: true \}\)/);
});
