import test from "node:test";
import { assert, fs, manifest, repositoryRoot, source, sourceByModule, TestElement, ui } from "../SegmentStudioUiHarness.mjs";
test("tag segments form stable swimlanes with overlap tracks and review counts", () => {
  const lanes = ui.groupSegmentsIntoSwimlanes([
    { id: 4, tagId: 20, tagName: "Beta", startSec: 8, endSec: 12, reviewState: "rejected" },
    { id: 2, tagId: 10, tagName: "Alpha", startSec: 3, endSec: 7, reviewState: "approved" },
    { id: 1, tagId: 10, tagName: "Alpha", startSec: 1, endSec: 5, reviewState: "unreviewed" },
    { id: 3, tagId: 10, tagName: "Alpha", startSec: 7, endSec: null, reviewState: "approved" },
  ]);

  assert.deepEqual(lanes.map((lane) => lane.label), ["Alpha", "Beta"]);
  assert.equal(lanes[0].trackCount, 2);
  assert.deepEqual(lanes[0].markers.map((marker) => [marker.segment.id, marker.track]), [[1, 0], [2, 1], [3, 0]]);
  assert.deepEqual(lanes[0].counts, { unreviewed: 1, approved: 2, rejected: 0 });
});

test("distinct performer assignments split a tag into stable performer sublanes", () => {
  const segments = [
    { id: 1, tagId: 10, tagName: "Blowjob", startSec: 4, endSec: 8, reviewState: "approved" },
    { id: 2, tagId: 10, tagName: "Blowjob", startSec: 4, endSec: 8, reviewState: "approved" },
    { id: 3, tagId: 10, tagName: "Blowjob", startSec: 9, endSec: 10, reviewState: "unreviewed" },
    { id: 4, tagId: 10, tagName: "Blowjob", startSec: 11, endSec: 12, reviewState: "unreviewed" },
  ];
  const slots = [
    { segmentId: 1, slotDefinitionId: "giver", label: "Giver", sortOrder: 0, performerId: 101, performerName: "Performer Alpha" },
    { segmentId: 1, slotDefinitionId: "receiver", label: "Receiver", sortOrder: 1, performerId: 201, performerName: "Performer Shared" },
    { segmentId: 2, slotDefinitionId: "giver", label: "Giver", sortOrder: 0, performerId: 102, performerName: "Performer Beta" },
    { segmentId: 2, slotDefinitionId: "receiver", label: "Receiver", sortOrder: 1, performerId: 201, performerName: "Performer Shared" },
    { segmentId: 3, slotDefinitionId: "giver", label: "Giver", sortOrder: 0, performerId: 101, performerName: "Performer Alpha" },
    { segmentId: 3, slotDefinitionId: "receiver", label: "Receiver", sortOrder: 1, performerId: 201, performerName: "Performer Shared" },
    { segmentId: 4, slotDefinitionId: "giver", label: "Giver", sortOrder: 0, performerId: null, performerName: null },
    { segmentId: 4, slotDefinitionId: "receiver", label: "Receiver", sortOrder: 1, performerId: 201, performerName: "Performer Shared" },
  ];

  const lanes = ui.groupSegmentsIntoSwimlanes(segments, [], slots);
  assert.deepEqual(lanes.map((lane) => [lane.label, lane.performerLabel, lane.markers.map(({ segment }) => segment.id)]), [
    ["Blowjob", "Giver · Performer Alpha", [1, 3]],
    ["Blowjob", "Giver · Performer Beta", [2]],
    ["Blowjob", "Unfilled performer slots", [4]],
  ]);
  assert.deepEqual(lanes[0].performers, [{ id: 101, name: "Performer Alpha" }]);
  assert.deepEqual(lanes[1].performers, [{ id: 102, name: "Performer Beta" }]);
  assert.deepEqual(lanes[2].performers, []);
  assert.deepEqual(lanes[0].performerAssignments, [
    { slotDefinitionId: "giver", label: "Giver", performer: { id: 101, name: "Performer Alpha" } },
    { slotDefinitionId: "receiver", label: "Receiver", performer: { id: 201, name: "Performer Shared" } },
  ]);
  assert.equal(lanes[0].trackCount, 1);
  assert.doesNotMatch(lanes[0].performerLabel, /Performer Shared/);
  assert.equal(ui.swimlaneDisplayLabel(lanes[2]), "Blowjob");
  assert.match(source, /\/api\/performers\/\$\{performer\.id\}\/image\?max=64/);
  assert.match(source, /function PerformerSublaneAvatars\(\{ performers, performerAssignments, interactive = true \}\)/);
  assert.match(source, /role: "tooltip"/);
  assert.match(source, /createPortal\(/);
  assert.match(source, /style: \{ \.\.\.popoverPosition, maxHeight: "calc\(100vh - 1rem\)" \}/);
  assert.match(source, /pointer-events-none fixed z-\[100\]/);
  assert.match(source, /const tooltipId = `performer-slots-\$\{useId\(\)\}`/);
  assert.doesNotMatch(source, /title: performerLabel/);
  assert.doesNotMatch(source, /title: performer\.name/);
});

test("identical complete performer assignments retain one lane with all performer avatars", () => {
  const segments = [
    { id: 1, tagId: 10, tagName: "Blowjob", startSec: 4, endSec: 8, reviewState: "approved" },
    { id: 2, tagId: 10, tagName: "Blowjob", startSec: 5, endSec: 7, reviewState: "approved" },
  ];
  const slots = [1, 2].flatMap((segmentId) => [
    { segmentId, slotDefinitionId: "giver", label: "Giver", sortOrder: 0, performerId: 101, performerName: "Performer Alpha" },
    { segmentId, slotDefinitionId: "receiver", label: "Receiver", sortOrder: 1, performerId: 201, performerName: "Performer Shared" },
  ]);

  const [lane] = ui.groupSegmentsIntoSwimlanes(segments, [], slots);
  assert.equal(lane.performerLabel, "Giver · Performer Alpha · Receiver · Performer Shared");
  assert.deepEqual(lane.performers, [
    { id: 101, name: "Performer Alpha" },
    { id: 201, name: "Performer Shared" },
  ]);
  assert.deepEqual(lane.performerAssignments, [
    { slotDefinitionId: "giver", label: "Giver", performer: { id: 101, name: "Performer Alpha" } },
    { slotDefinitionId: "receiver", label: "Receiver", performer: { id: 201, name: "Performer Shared" } },
  ]);
  assert.equal(lane.trackCount, 2);
  assert.deepEqual(lane.markers.map(({ segment }) => segment.id), [1, 2]);
});

test("filled and unfilled assignments form separate lanes even with one complete signature", () => {
  const segments = [
    { id: 1, tagId: 10, tagName: "Missionary", startSec: 4, endSec: 8, reviewState: "approved" },
    { id: 2, tagId: 10, tagName: "Missionary", startSec: 9, endSec: 12, reviewState: "unreviewed" },
  ];
  const slots = [
    { segmentId: 1, slotDefinitionId: "giver", label: "Giver", sortOrder: 0, performerId: 101, performerName: "Performer Alpha" },
    { segmentId: 1, slotDefinitionId: "receiver", label: "Receiver", sortOrder: 1, performerId: 201, performerName: "Performer Beta" },
    { segmentId: 2, slotDefinitionId: "giver", label: "Giver", sortOrder: 0, performerId: null, performerName: null },
    { segmentId: 2, slotDefinitionId: "receiver", label: "Receiver", sortOrder: 1, performerId: 201, performerName: "Performer Beta" },
  ];

  const lanes = ui.groupSegmentsIntoSwimlanes(segments, [], slots);
  assert.deepEqual(lanes.map((lane) => [
    lane.performerLabel,
    lane.performers.map((performer) => performer.id),
    lane.markers.map(({ segment }) => segment.id),
  ]), [
    ["Giver · Performer Alpha · Receiver · Performer Beta", [101, 201], [1]],
    ["Unfilled performer slots", [], [2]],
  ]);
});

test("Segment groups order tag lanes independently from Cove tag groups", () => {
  const groups = [
    {
      id: 8,
      name: "Primary group",
      sortOrder: 0,
      tags: [
        { tagId: 20, tagName: "Beta", sortOrder: 0 },
        { tagId: 10, tagName: "Alpha", sortOrder: 1 },
      ],
    },
  ];
  const lanes = ui.groupSegmentsIntoSwimlanes([
    { id: 1, tagId: 10, tagName: "Alpha", startSec: 1, endSec: 2, reviewState: "unreviewed" },
    { id: 2, tagId: 20, tagName: "Beta", startSec: 2, endSec: 3, reviewState: "approved" },
    { id: 3, tagId: 30, tagName: "Gamma", startSec: 3, endSec: 4, reviewState: "rejected" },
  ], groups);

  assert.deepEqual(lanes.map((lane) => lane.label), ["Beta", "Alpha", "Gamma"]);
  assert.deepEqual(lanes.map((lane) => lane.segmentGroupName), ["Primary group", "Primary group", null]);
  const grouped = ui.groupSwimlanesBySegmentGroup(lanes);
  assert.deepEqual(grouped.map((group) => [group.name, group.lanes.map((lane) => lane.label)]), [
    ["Primary group", ["Beta", "Alpha"]],
    ["Ungrouped", ["Gamma"]],
  ]);
  assert.deepEqual(grouped.map((group) => group.counts), [
    { unreviewed: 1, approved: 1, rejected: 0 },
    { unreviewed: 0, approved: 0, rejected: 1 },
  ]);
  assert.equal(ui.swimlaneStripeBackground(0), "var(--color-surface)");
  assert.match(ui.swimlaneStripeBackground(1), /color-mix.*--color-muted.*--color-surface/);
  assert.match(ui.swimlaneStripeBackground(1), /14%/);
  assert.equal(ui.swimlaneMarkerTop(0), 0.34375);
  assert.equal(ui.swimlaneMarkerTop(2), 2.84375);
  assert.match(source, /backgroundColor: stripeBackground/);
  assert.match(source, /top: `\$\{swimlaneMarkerTop\(track\)\}rem`/);
});

test("Segment groups can collapse their swimlanes without losing segment state", () => {
  const lanes = ui.groupSegmentsIntoSwimlanes([
    { id: 1, tagId: 10, tagName: "Alpha", startSec: 1, endSec: 2, reviewState: "unreviewed" },
    { id: 2, tagId: 20, tagName: "Beta", startSec: 3, endSec: 4, reviewState: "approved" },
  ], [
    { id: 7, name: "First", sortOrder: 0, tags: [{ tagId: 10, sortOrder: 0 }] },
  ]);
  assert.deepEqual(ui.normalizeCollapsedSegmentGroups(["group:7", "group:7", "bad", "ungrouped"]), ["group:7", "ungrouped"]);
  assert.deepEqual(ui.expandedSwimlanes(lanes, ["group:7"]).map((lane) => lane.key), ["tag:20"]);
  assert.deepEqual(ui.expandedSwimlanes(lanes, []).map((lane) => lane.key), ["tag:10", "tag:20"]);
  assert.match(source, /aria-expanded": !collapsed/);
  assert.match(source, /data-segment-group-collapsed/);
  assert.match(source, /COLLAPSED_SEGMENT_GROUPS_STORAGE_KEY/);
  assert.match(source, /onToggleGroup\(group\.key\)/);
  assert.match(source, /collapsed \? \[[\s\S]*swimlane\$\{group\.lanes\.length === 1 \? "" : "s"\} hidden[\s\S]*LaneReviewCounts/);
  assert.match(source, /compatibilityMode && collapsed[\s\S]{0,100}LaneReviewCounts/);
  assert.match(source, /filter: counts\[state\] > 0 \? "saturate\(1\)" : "saturate\(0\.25\)"/);
  assert.match(source, /truncate text-xs font-semibold capitalize text-foreground/);
  assert.doesNotMatch(source, /truncate text-xs font-semibold uppercase tracking-wide text-foreground/);
});

test("Segment group headers use a subtle hierarchy surface outside swimlane striping", () => {
  assert.match(ui.segmentGroupHeaderBackground(false), /color-mix.*--color-accent.*8%.*--color-surface/);
  assert.match(ui.segmentGroupHeaderBackground(true), /color-mix.*--color-accent.*14%.*--color-surface/);
  assert.match(source, /className: "absolute left-0 right-0 grid border-b border-border"/);
  assert.match(source, /const groupHeaderBackground = segmentGroupHeaderBackground\(groupSelected\)/);
  assert.equal(source.match(/backgroundColor: groupHeaderBackground/g)?.length, 2);
  assert.doesNotMatch(source, /className: "grid h-8 border-b border-border bg-muted\/50"/);
  assert.doesNotMatch(source, /data-selected-timeline-group[\s\S]{0,300}bg-transparent/);
  assert.doesNotMatch(source, /data-selected-timeline-group[\s\S]{0,300}hover:opacity/);
  assert.doesNotMatch(source, /className: "grid h-8 border-y border-border"/);
});

test("initial and deep-linked selections reveal a persisted collapsed group", () => {
  assert.deepEqual(ui.revealCollapsedSegmentGroup(["group:7", "ungrouped"], "group:7"), ["ungrouped"]);
  assert.deepEqual(ui.revealCollapsedSegmentGroup(["group:7"], "group:8"), ["group:7"]);
  assert.match(source, /revealCollapsedSegmentGroup\(current, selectedSegmentGroupForSegment\)/);
  assert.match(source, /\[video\.id, initialSegmentId, selectedSegmentGroupForSegment\]/);
});

test("B toggles the selected segment group like Stash Marker Studio", () => {
  const event = { key: "b", shiftKey: false, ctrlKey: false, altKey: false, metaKey: false };
  assert.equal(ui.findEditorShortcut(event, false)?.id, "markerGroup.toggleCollapse");
  assert.match(source, /shortcut\.id === "markerGroup\.toggleCollapse"/);
  assert.match(source, /toggleSegmentGroup\(selectedSegmentGroupKey\)/);
  const lanes = ui.groupSegmentsIntoSwimlanes(
    [{ id: 11, tagId: 10, tagName: "Alpha", startSec: 1, endSec: 2, reviewState: "unreviewed" }],
    [{ id: 7, name: "First", sortOrder: 0, tags: [{ tagId: 10, sortOrder: 0 }] }],
  );
  assert.equal(ui.segmentGroupKeyForSegment(lanes, 11), "group:7");
  assert.match(source, /function revealSegmentGroupForSelection\(segmentId\)/);
  assert.match(source, /revealSegmentGroupForSelection\(segment\.id\)/);
  assert.match(source, /current\.filter\(\(key\) => key !== groupKey\)/);
});

test("Shift+B collapses or expands every swimlane group", () => {
  const event = { key: "b", shiftKey: true, ctrlKey: false, altKey: false, metaKey: false };
  assert.equal(ui.findEditorShortcut(event, false)?.id, "markerGroup.toggleAll");
  assert.deepEqual(ui.toggleAllCollapsedSegmentGroups(["group:7"], ["group:7", "group:8", "ungrouped"]),
    ["group:7", "group:8", "ungrouped"]);
  assert.deepEqual(ui.toggleAllCollapsedSegmentGroups(["group:7", "group:8"], ["group:7", "group:8"]), []);
  assert.match(source, /shortcut\.id === "markerGroup\.toggleAll"/);
});

test("Shift+Up and Shift+Down select collapsible swimlane groups for B", () => {
  const shortcutEvent = (key) => ({ key, shiftKey: true, ctrlKey: false, altKey: false, metaKey: false });
  assert.equal(ui.findEditorShortcut(shortcutEvent("ArrowUp"), false)?.id, "navigation.segmentGroupUp");
  assert.equal(ui.findEditorShortcut(shortcutEvent("ArrowDown"), false)?.id, "navigation.segmentGroupDown");
  assert.equal(ui.findAdjacentSegmentGroupKey(["group:1", "group:2", "ungrouped"], "group:2", -1), "group:1");
  assert.equal(ui.findAdjacentSegmentGroupKey(["group:1", "group:2", "ungrouped"], "group:2", 1), "ungrouped");
  assert.equal(ui.findAdjacentSegmentGroupKey(["group:1", "group:2"], "group:1", -1), "group:1");
  assert.equal(ui.findAdjacentSegmentGroupKey(["group:1", "group:2"], null, 1), "group:1");
  assert.equal(ui.reconcileSegmentGroupKey(["group:1", "group:2"], "group:2", "group:1"), "group:2");
  assert.equal(ui.reconcileSegmentGroupKey(["group:1", "group:2"], "missing", "group:2"), "group:2");
  assert.equal(ui.reconcileSegmentGroupKey(["group:1"], "missing", "also-missing"), "group:1");
  assert.equal(ui.reconcileSegmentGroupKey([], "group:1", "group:1"), null);
  assert.match(source, /setSelectedSegmentGroupKey\(targetKey\)/);
  assert.match(source, /toggleSegmentGroup\(selectedSegmentGroupKey\)/);
  assert.match(source, /aria-current": selectedSegmentGroupKey === row\.group\.key/);
  assert.match(source, /selectedGroupKey: selectedSegmentGroupKey/);
  assert.match(source, /onSelectGroup: setSelectedSegmentGroupKey/);
  assert.match(source, /onSelectGroup\(group\.key\)/);
  assert.match(source, /reconcileSegmentGroupKey\(segmentGroupKeys, current, selectedSegmentGroupForSegment\)/);
  assert.match(source, /data-selected-timeline-group/);
});

test("settings route and editor consume extension-owned Segment groups", () => {
  const settings = source.slice(source.indexOf("function SegmentStudioSettingsPage"), source.indexOf("function SegmentStudioTabs"));
  assert.equal(ui.isSegmentStudioSettingsRoute(null, "settings", "/segment-studio"), true);
  assert.equal(ui.isSegmentStudioSettingsRoute("settings", null, "/segment-studio"), true);
  assert.equal(ui.isSegmentStudioSettingsRoute(null, null, "/segment-studio/settings/"), true);
  assert.equal(ui.isSegmentStudioSettingsRoute("17981", null, "/segment-studio/settings"), false);
  assert.equal(ui.isSegmentStudioSettingsRoute(null, "segments", "/segment-studio/settings"), false);
  assert.match(source, /setPlainLinkNavigation\(event, onNavigate, \{ page: "segment-studio", slug: "settings" \}\)/);
  assert.match(source, /isSegmentStudioSettingsRoute\(id, slug, window\.location\.pathname\)/);
  assert.match(source, /function SegmentStudioSettingsPage/);
  assert.match(source, /\/segment-groups/);
  assert.match(source, /Segment groups/);
  assert.match(source, /groupSegmentsIntoSwimlanes\(segments, segmentGroups, performerSlots\)/);
  assert.doesNotMatch(source, /\/api\/tag-groups/);
  assert.doesNotMatch(settings, /Lineage maintenance/);
  assert.doesNotMatch(settings, /reviewButtonClass/);
});

test("individual video action opens exactly one video in Segment Studio", () => {
  assert.equal(ui.segmentStudioActionTarget({ selectedIds: [30208] }), "/segment-studio/30208");
  assert.equal(ui.segmentStudioActionTarget({ entityIds: [30208] }), "/segment-studio/30208");
  assert.equal(ui.segmentStudioActionTarget({ selectedIds: [] }), null);
  assert.equal(ui.segmentStudioActionTarget({ selectedIds: [1, 2] }), null);
  assert.equal(ui.segmentStudioActionTarget({ selectedIds: ["invalid"] }), null);
  assert.match(source, /actionHandlers: \{ openSegmentStudio \}/);
});

test("Full mode offers explicit native segment import states only when work remains", () => {
  const editor = source.slice(source.indexOf("function SegmentEditor"), source.indexOf("function DiscoveryFilters"));
  assert.match(editor, /compatibilityMode && detail\.nativeImportCount > 0/);
  assert.match(editor, /Import for review/);
  assert.match(editor, /Import as approved/);
  assert.match(editor, /Importing for review…/);
  assert.match(editor, /Importing as approved…/);
  assert.match(editor, /nativeImportState\.busy \? h\("span"/);
  assert.match(editor, /importNativeSegments\("unreviewed"\)/);
  assert.match(editor, /importNativeSegments\("approved"\)/);
  assert.match(editor, /\/native-segments\/import/);
});

test("coincident point markers use separate tracks while later markers reuse free tracks", () => {
  const [lane] = ui.groupSegmentsIntoSwimlanes([
    { id: 1, tagId: 10, tagName: "Alpha", startSec: 5.12345, endSec: null, reviewState: "unreviewed" },
    { id: 2, tagId: 10, tagName: "Alpha", startSec: 5.12345, endSec: 5.12345, reviewState: "approved" },
    { id: 3, tagId: 10, tagName: "Alpha", startSec: 6.12345, endSec: null, reviewState: "rejected" },
  ]);

  assert.equal(lane.trackCount, 2);
  assert.deepEqual(lane.markers.map((marker) => [marker.segment.id, marker.track]), [[1, 0], [2, 1], [3, 0]]);
});

test("swimlane navigation stays within lanes horizontally and chooses nearest time vertically", () => {
  const lanes = ui.groupSegmentsIntoSwimlanes([
    { id: 1, tagId: 10, tagName: "Alpha", startSec: 2, endSec: 3, reviewState: "unreviewed" },
    { id: 2, tagId: 10, tagName: "Alpha", startSec: 9, endSec: 10, reviewState: "unreviewed" },
    { id: 3, tagId: 20, tagName: "Beta", startSec: 1, endSec: 2, reviewState: "approved" },
    { id: 4, tagId: 20, tagName: "Beta", startSec: 8, endSec: 9, reviewState: "approved" },
    { id: 5, tagId: 20, tagName: "Beta", startSec: 7, endSec: 11, reviewState: "approved" },
    { id: 6, tagId: 20, tagName: "Beta", startSec: 1, endSec: 20, reviewState: "approved" },
  ]);

  assert.equal(ui.findSwimlaneSelection(lanes, 1, "right")?.id, 2);
  assert.equal(ui.findSwimlaneSelection(lanes, 1, "left")?.id, 1);
  assert.equal(ui.findSwimlaneSelection(lanes, 2, "down")?.id, 4);
  assert.equal(ui.findSwimlaneSelection(lanes, 4, "up")?.id, 2);
  assert.equal(ui.findSwimlaneSelection(lanes, 2, "down", 8.5)?.id, 6);
  assert.equal(ui.findSwimlaneSelection(lanes, 2, "down", 10.5)?.id, 6);
  assert.equal(ui.findSwimlaneSelection(lanes, 2, "down", 30)?.id, 6);
  const navigationLanes = (candidates) => [
    { markers: [{ segment: { id: 100, startSec: 5, endSec: 6 } }] },
    { markers: candidates.map((segment) => ({ segment })) },
  ];
  assert.equal(ui.findSwimlaneSelection(navigationLanes([
    { id: 101, startSec: 0, endSec: 7 },
    { id: 102, startSec: 7.9, endSec: 8.1 },
  ]), 100, "down", 8)?.id, 102);
  assert.equal(ui.findSwimlaneSelection(navigationLanes([
    { id: 103, startSec: 7, endSec: 11 },
    { id: 104, startSec: 1, endSec: 20 },
  ]), 100, "down", 8.5)?.id, 104);
  assert.equal(ui.findSwimlaneSelection(navigationLanes([
    { id: 105, startSec: 0, endSec: 10 },
    { id: 106, startSec: 18, endSec: 19 },
  ]), 100, "down", 20)?.id, 106);
  assert.deepEqual(ui.findSwimlaneRangeSelection(lanes, 1, "right"), {
    segment: lanes[0].markers[1].segment,
    segmentIds: [1, 2],
  });
  assert.deepEqual(ui.findSwimlaneRangeSelection(lanes, 2, "left"), {
    segment: lanes[0].markers[0].segment,
    segmentIds: [1, 2],
  });
  assert.match(source, /findSwimlaneSelection\(swimlanes, selectedSegment\?\.id, direction, currentTime\)/);
  assert.match(source, /findSegmentNearPlayhead\(swimlanes, currentTime/);
});

test("arrow and Tab navigation exclude filtered segments and collapsed groups", () => {
  const segments = [
    { id: 1, tagId: 10, tagName: "One", startSec: 5, endSec: 6, reviewState: "approved" },
    { id: 2, tagId: 20, tagName: "Two", startSec: 5, endSec: 6, reviewState: "rejected" },
    { id: 3, tagId: 20, tagName: "Two", startSec: 5, endSec: 6, reviewState: "approved" },
    { id: 4, tagId: 30, tagName: "Three", startSec: 5, endSec: 6, reviewState: "approved" },
  ];
  const groups = [
    { id: 1, name: "First", sortOrder: 0, tags: [{ tagId: 10, sortOrder: 0 }] },
    { id: 2, name: "Collapsed", sortOrder: 1, tags: [{ tagId: 20, sortOrder: 0 }] },
    { id: 3, name: "Last", sortOrder: 2, tags: [{ tagId: 30, sortOrder: 0 }] },
  ];
  const filtered = ui.filterEditorSegments(segments, [], { reviewStates: ["approved"] });
  const lanes = ui.groupSegmentsIntoSwimlanes(filtered, groups, []);
  const expanded = ui.expandedSwimlanes(lanes, ["group:2"]);
  assert.deepEqual(expanded.flatMap((lane) => lane.markers.map(({ segment }) => segment.id)), [1, 4]);
  assert.equal(ui.findSwimlaneSelection(expanded, 1, "down", 5.5)?.id, 4);
  assert.equal(ui.findSegmentNearPlayhead(expanded, 5.5, 1, 1)?.id, 4);
});

test("review navigation finds unreviewed segments without wrapping", () => {
  const shortcutEvent = (key, shiftKey = false) => ({ key, shiftKey, ctrlKey: false, altKey: false, metaKey: false });
  assert.equal(ui.findEditorShortcut(shortcutEvent("n"), false), null);
  assert.equal(ui.findEditorShortcut(shortcutEvent("n"), true)?.id, "navigation.previousUnreviewedInSwimlane");
  assert.equal(ui.findEditorShortcut(shortcutEvent("m", true), true)?.id, "navigation.nextUnreviewedGlobal");
  const segment = (id, startSec, reviewState = "approved") => ({ id, startSec, endSec: startSec + 3, reviewState });
  const lanes = [
    { key: "one", markers: [segment(1, 1), segment(2, 5, "unreviewed"), segment(3, 9, "unreviewed")].map((item) => ({ segment: item })) },
    { key: "two", markers: [segment(4, 2, "unreviewed"), segment(5, 8)].map((item) => ({ segment: item })) },
  ];
  assert.equal(ui.findUnreviewedSelection(lanes, 2, 1, false)?.id, 3);
  assert.equal(ui.findUnreviewedSelection(lanes, 3, 1, false), null);
  assert.equal(ui.findUnreviewedSelection(lanes, 3, 1, true)?.id, 4);
  assert.equal(ui.findUnreviewedSelection(lanes, 4, -1, true)?.id, 3);
  assert.equal(ui.findUnreviewedSelection(lanes, 2, -1, true), null);
  assert.equal(ui.findUnreviewedSelection(lanes, null, 1, true)?.id, 2);
  assert.equal(ui.findUnreviewedSelection(lanes, null, -1, true)?.id, 4);
});

test("Tab cycles through swimlanes whose segments are near the playhead", () => {
  const nextShortcut = ui.findEditorShortcut({ key: "Tab", shiftKey: false, ctrlKey: false, altKey: false, metaKey: false }, false);
  assert.equal(nextShortcut?.id, "navigation.nextTouchingPlayhead");
  assert.match(nextShortcut?.description || "", /near the playhead/);
  const lanes = [
    { key: "one", markers: [{ segment: { id: 1, startSec: 1, endSec: 6 } }, { segment: { id: 2, startSec: 8, endSec: 10 } }] },
    { key: "two", markers: [{ segment: { id: 3, startSec: 4, endSec: 7 } }] },
    { key: "three", markers: [{ segment: { id: 4, startSec: 5, endSec: 5 } }] },
  ];
  assert.equal(ui.findSegmentNearPlayhead(lanes, 5, 1, 1)?.id, 3);
  assert.equal(ui.findSegmentNearPlayhead(lanes, 5, 1, 3)?.id, 4);
  assert.equal(ui.findSegmentNearPlayhead(lanes, 5, 1, 4)?.id, 2);
  assert.equal(ui.findSegmentNearPlayhead(lanes, 5, -1, 1)?.id, 4);

  const closedLane = [{ key: "closed", markers: [{ segment: { id: 5, startSec: 1, endSec: 6 } }] }];
  assert.equal(ui.findSegmentNearPlayhead(closedLane, -14, 1, null)?.id, 5);
  assert.equal(ui.findSegmentNearPlayhead(closedLane, -14.002, 1, null), null);
  assert.equal(ui.findSegmentNearPlayhead(closedLane, 21, 1, null)?.id, 5);
  assert.equal(ui.findSegmentNearPlayhead(closedLane, 21.002, 1, null), null);

  const openLane = [{ key: "open", markers: [{ segment: { id: 6, startSec: 40, endSec: null } }] }];
  assert.equal(ui.findSegmentNearPlayhead(openLane, 85, 1, null)?.id, 6);
  assert.equal(ui.findSegmentNearPlayhead(openLane, 85.002, 1, null), null);

  const invertedLane = [{ key: "invalid", markers: [{ segment: { id: 7, startSec: 10, endSec: 5 } }] }];
  assert.equal(ui.findSegmentNearPlayhead(invertedLane, 7, 1, null), null);
});

test("F opens fuzzy segment quick search inside the editor", () => {
  const event = { key: "f", shiftKey: false, ctrlKey: false, altKey: false, metaKey: false };
  assert.equal(ui.findEditorShortcut(event, false)?.id, "navigation.quickSearch");
  assert.deepEqual(ui.filterSegmentQuickSearch([
    { id: 1, tagName: "Kissing", startSec: 20 },
    { id: 2, tagName: "Deep Kissing", startSec: 10 },
    { id: 3, tagName: "Kitchen", startSec: 5 },
    { id: 4, tagName: "Unrelated", startSec: 1 },
  ], "kiss").map((segment) => segment.id), [1, 2]);
  assert.deepEqual(ui.filterSegmentQuickSearch([
    { id: 1, tagName: "Kissing", startSec: 20 },
    { id: 2, tagName: "Kiss", startSec: 10 },
  ], "ks").map((segment) => segment.id), [1, 2]);
  const orderedLanes = ui.groupSegmentsIntoSwimlanes([
    { id: 3, tagId: 30, tagName: "Anal Sex", startSec: 1, reviewState: "unreviewed" },
    { id: 4, tagId: 20, tagName: "Vaginal Sex", startSec: 50, reviewState: "approved" },
    { id: 5, tagId: 20, tagName: "Vaginal Sex", startSec: 10, reviewState: "approved" },
  ], [{
    id: 1,
    name: "Activity",
    sortOrder: 0,
    tags: [{ tagId: 20, sortOrder: 0 }, { tagId: 30, sortOrder: 1 }],
  }]);
  const orderedSegments = orderedLanes.flatMap((lane) =>
    lane.markers.map((marker) => marker.segment));
  assert.deepEqual(ui.filterSegmentQuickSearch(orderedSegments, "sex").map((segment) => segment.id), [5, 4, 3]);
  assert.deepEqual(ui.filterSegmentQuickSearch(orderedSegments, "sex", 2).map((segment) => segment.id), [5, 4]);
  const entries = ui.buildSegmentQuickSearchEntries([
    {
      key: "lane:one",
      segmentGroupId: 7,
      segmentGroupName: "Activity",
      performers: [{ id: 9, name: "Performer" }],
      performerAssignments: [{ slotDefinitionId: "giver", label: "Giver", performer: { id: 9, name: "Performer" } }],
      markers: [{ segment: { id: 6, tagName: "Kissing", startSec: 1 } }],
    },
    {
      key: "lane:two",
      segmentGroupId: null,
      segmentGroupName: null,
      markers: [{ segment: { id: 7, tagName: "Kissing", startSec: 2 } }],
    },
  ]);
  assert.deepEqual(entries.map((entry) => [entry.segment.id, entry.groupKey, entry.groupName]), [
    [6, "group:7", "Activity"],
    [7, "ungrouped", "Ungrouped"],
  ]);
  assert.deepEqual(entries[0].performers, [{ id: 9, name: "Performer" }]);
  assert.equal(ui.shouldShowQuickSearchGroups(entries.slice(0, 1)), false);
  assert.equal(ui.shouldShowQuickSearchGroups(entries), true);
  assert.match(source, /function SegmentQuickSearchDialog/);
  assert.match(source, /role: "listbox"/);
  assert.match(source, /role: "option"/);
  assert.match(source, /if \(event\.key === "Tab"\) \{\s*trapModalFocus\(event\)/);
  assert.match(source, /activeOptionRef\.current\?\.scrollIntoView\(\{ block: "nearest" \}\)/);
  assert.match(source, /event\.key === "ArrowDown" \|\| event\.key === "ArrowUp"/);
  assert.match(source, /event\.key === "Enter" && !event\.nativeEvent\?\.isComposing/);
  assert.match(source, /shortcut\.id === "navigation\.quickSearch".*setQuickSearchOpen\(true\)/);
  assert.match(source, /segments: buildSegmentQuickSearchEntries\(allSwimlanes\)/);
  assert.match(source, /showGroups && result\.groupKey !== previousGroupKey/);
  assert.match(source, /showGroups \? h\("span", \{ key: "group", className: "sr-only" \}, `\$\{result\.groupName\} group`\)/);
  assert.match(source, /result\.performers\?\.length \? h\(PerformerSublaneAvatars/);
  assert.match(source, /selectSegment\(segment, \{ focusEditor: true, seekToSegment: false \}\)/);
});

test("timeline geometry clamps zoom, builds ticks, and centers the playhead", () => {
  assert.equal(ui.clampTimelineZoom(0.5), 1);
  assert.equal(ui.clampTimelineZoom(12), 8);
  assert.equal(ui.clampTimelineZoom(2.26), 2.25);
  assert.deepEqual(ui.buildTimelineTicks(100, 5), [0, 25, 50, 75, 100]);
  assert.equal(ui.calculateCenteredTimelineScroll(50, 100, 2000, 800, 160), 680);
  assert.equal(ui.calculateCenteredTimelineScroll(50, 100, 2000, 800, 160, 12), 674);
  assert.equal(ui.calculateCenteredTimelineScroll(0, 100, 2000, 800, 160), 0);
  assert.match(source, /trackBounds\.left - contentBounds\.left/);
  assert.match(source, /contentBounds\?\.width/);
});

test("canonical timeline ruler uses exact minute ticks", () => {
  assert.deepEqual(ui.buildMinuteTimelineTicks(0), [0]);
  assert.deepEqual(ui.buildMinuteTimelineTicks(179.5), [0, 60, 120]);
  assert.deepEqual(ui.buildMinuteTimelineTicks(180), [0, 60, 120, 180]);
  assert.equal(ui.calculateMinuteTimelineWidth(179.5, 1), 144);
  assert.equal(ui.calculateMinuteTimelineWidth(180, 2), 288);
  assert.equal(ui.calculateMinuteLabelStride(1800, 944, 1), 2);
  assert.equal(ui.calculateMinuteLabelStride(1800, 944, 2), 1);
  assert.equal(ui.calculateMinuteLabelStride(180, 944, 1), 1);
  assert.match(source, /width: `\$\{zoom \* 100\}%`/);
  assert.doesNotMatch(source, /width: `max\(\$\{zoom \* 100\}%/);
});

test("timeline uses one continuous playhead across grouped lanes", () => {
  const start = ui.calculateTimelinePlayheadPosition(0, 100);
  const quarter = ui.calculateTimelinePlayheadPosition(25, 100);
  const end = ui.calculateTimelinePlayheadPosition(100, 100);
  assert.deepEqual(start, { percent: 0, labelOffsetRem: 10 });
  assert.deepEqual(quarter, { percent: 25, labelOffsetRem: 7.5 });
  assert.deepEqual(end, { percent: 100, labelOffsetRem: 0 });
  assert.deepEqual(ui.calculateTimelinePlayheadPosition(200, 100), end);
  assert.deepEqual(ui.calculateTimelinePlayheadPosition(10, 0), start);
  assert.deepEqual(ui.calculateTimelinePlayheadPosition("invalid", 100), start);
  assert.deepEqual(ui.timelinePlayheadHorizontalStyle(start), { left: "0%", transform: "translateX(-50%)" });
  assert.deepEqual(ui.timelinePlayheadHorizontalStyle(quarter), { left: "25%", transform: "translateX(-50%)" });
  assert.deepEqual(ui.timelinePlayheadHorizontalStyle(quarter, true), { left: "calc(7.5rem + 25%)", transform: "translateX(-50%)" });
  assert.deepEqual(ui.timelinePlayheadHorizontalStyle(end), { left: "100%", transform: "translateX(-50%)" });
  assert.deepEqual(ui.timelinePlayheadHorizontalStyle(end, true), { left: "calc(0rem + 100%)", transform: "translateX(-50%)" });
  assert.deepEqual(ui.timelineContentStyle(1), {
    width: "100%",
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: "12px",
  });
  assert.deepEqual(ui.timelineContentStyle(1.5), {
    width: "150%",
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: "12px",
  });
  assert.equal(source.match(/"data-timeline-playhead":/g)?.length, 2);
  assert.match(source, /"data-timeline-playhead": "axis"/);
  assert.match(source, /"data-timeline-playhead": "body"/);
  assert.equal(source.match(/"data-timeline-label-gutter":/g)?.length, 2);
  assert.equal(source.match(/"data-timeline-label-gutter": "true"[\s\S]{0,160}z-40/g)?.length, 2);
});

test("playhead-relative selection is directional and swimlane controls remain read-only", () => {
  const segments = [
    { id: 3, startSec: 9 },
    { id: 1, startSec: 2 },
    { id: 2, startSec: 6 },
  ];
  assert.equal(ui.findSegmentFromPlayhead(segments, 5, 1)?.id, 2);
  assert.equal(ui.findSegmentFromPlayhead(segments, 7, -1)?.id, 2);
  assert.equal(ui.findSegmentFromPlayhead(segments, 6, 1)?.id, 3);
  assert.equal(ui.findSegmentFromPlayhead(segments, 6, -1)?.id, 1);
  assert.equal(ui.findSegmentFromPlayhead(segments, 9, 1), null);
  const fractional = [
    { id: 11, startSec: 1.23456 },
    { id: 12, startSec: 1.23457 },
    { id: 13, startSec: 2.34567 },
  ];
  assert.equal(ui.findSegmentFromPlayhead(fractional, 1.235, 1, 11)?.id, 12);
  assert.equal(ui.findSegmentFromPlayhead(fractional, 1.235, 1, 12)?.id, 13);
  assert.equal(ui.findSegmentFromPlayhead(fractional, 1.235, -1, 12)?.id, 11);
  assert.match(source, /findSegmentFromPlayhead\(visibleSegments, currentTime, shortcut\.id === "navigation\.previousAtPlayhead" \? -1 : 1, selectedSegment\?\.id\)/);
  assert.match(source, /aria-label": "Segment swimlane timeline"/);
  assert.match(source, /Zoom out|Fit timeline|Zoom in|Center playhead/);
  assert.match(source, /role: "slider"/);
  assert.match(source, /data-timeline-seeker/);
  assert.match(source, /focus:outline-none focus:ring-2 focus:ring-accent/);
  assert.doesNotMatch(source, /focus-visible:ring/);
  assert.match(source, /unreviewed,.*approved,.*rejected/);
  assert.doesNotMatch(source, /New marker|Split marker|Duplicate marker|Delete swimlane/);
});
