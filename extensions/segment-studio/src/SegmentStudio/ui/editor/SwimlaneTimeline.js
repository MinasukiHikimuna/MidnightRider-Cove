import { h, useEffect, useMemo, useRef, useState } from "../shared/runtime.js";

import { DEFAULT_EDITOR_LAYOUT, TIMELINE_END_MARGIN_PX } from "../shared/constants.js";

import { formatTime } from "../shared/api.js";

import { SLOT_STATUS_PRESENTATION, basicSegmentTimelineStyle, segmentGroupHeaderBackground, segmentTimelineStyle, swimlaneMarkerTop, swimlaneStripeBackground, timelineSegmentWidth } from "../shared/presentation.js";

import { PerformerSublaneAvatars, buildTimelineRows, groupSegmentsIntoSwimlanes, groupSwimlanesBySegmentGroup, swimlaneDisplayLabel, visibleVirtualRows } from "./model/swimlanes.js";

import { buildMinuteTimelineTicks, calculateCenteredTimelineScroll, calculateMinuteLabelStride, calculateSwimlaneTitleMaximum, calculateTimelinePlayheadPosition, clampSwimlaneTitleWidth, clampTimelineZoom, timelineContentStyle, timelinePlayheadHorizontalStyle, timelineTickAlignment, timelineTickPosition, timelineTimePercent } from "./model/timeline.js";

import { indexPerformerSlotsBySegment, performerSlotStatusFromSegmentSlots } from "./model/history.js";

import { LaneReviewCounts } from "./PerformerSlotEditors.js";

function SwimlaneTimeline({ segments, shotBoundaries = [], segmentGroups, performerSlots = [], collapsedGroupKeys = [], selectedGroupKey, selectedSegmentId, selectedSegmentIds = [], duration, currentTime, zoom, onZoomChange, onSelectGroup, onToggleGroup, onSelect, onSelectSegments, onSelectAll, onConfigureTag, onSeekTime, centerRef, showReviewState = true, swimlaneTitleWidth, onSwimlaneTitleWidthChange }) {
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewport, setViewport] = useState({ scrollTop: 0, height: 320 });
  const [hoveredLaneKey, setHoveredLaneKey] = useState(null);
  const lanes = useMemo(
    () => groupSegmentsIntoSwimlanes(segments, segmentGroups, performerSlots),
    [segments, segmentGroups, performerSlots],
  );
  const performerSlotsBySegment = useMemo(
    () => indexPerformerSlotsBySegment(performerSlots),
    [performerSlots],
  );
  const groupedLanes = useMemo(() => groupSwimlanesBySegmentGroup(lanes), [lanes]);
  const timelineLayout = useMemo(
    () => buildTimelineRows(groupedLanes, collapsedGroupKeys, segmentGroups.length > 0),
    [groupedLanes, collapsedGroupKeys, segmentGroups.length],
  );
  const visibleTimelineRows = useMemo(
    () => visibleVirtualRows(timelineLayout.rows, Math.max(0, viewport.scrollTop - 24), viewport.height),
    [timelineLayout, viewport],
  );
  const safeDuration = Math.max(0, Number(duration) || 0);
  const labelWidthMaximum = calculateSwimlaneTitleMaximum(viewportWidth);
  const labelWidthPx = clampSwimlaneTitleWidth(swimlaneTitleWidth, labelWidthMaximum);
  const labelWidthRem = labelWidthPx / 16;
  const playhead = calculateTimelinePlayheadPosition(currentTime, safeDuration, labelWidthRem);
  const ticks = buildMinuteTimelineTicks(safeDuration);
  const minuteLabelStride = calculateMinuteLabelStride(safeDuration, Math.max(1, viewportWidth - labelWidthRem * 16), zoom);
  const labeledTicks = ticks.filter((_, index) => index === 0 || index % minuteLabelStride === 0);
  const timelineGeometry = useMemo(() => lanes.map((lane) => `${lane.key}:${lane.trackCount}:${lane.markers
    .map(({ segment, track }) => `${segment.id}:${segment.startSec}:${segment.endSec ?? ""}:${track}`)
    .join(",")}`).join("|"), [lanes]);

  function centerPlayhead() {
    const element = scrollRef.current;
    if (!element) return;
    const track = element.querySelector("[data-timeline-track]");
    const content = element.firstElementChild;
    const trackBounds = track?.getBoundingClientRect();
    const contentBounds = content?.getBoundingClientRect();
    const labelWidth = trackBounds && contentBounds ? Math.max(0, trackBounds.left - contentBounds.left) : labelWidthRem * 16;
    const contentWidth = contentBounds?.width ?? element.scrollWidth;
    element.scrollTo({
      left: calculateCenteredTimelineScroll(currentTime, safeDuration, contentWidth, element.clientWidth, labelWidth, TIMELINE_END_MARGIN_PX),
      behavior: "smooth",
    });
  }

  useEffect(() => {
    centerRef.current = centerPlayhead;
    return () => {
      if (centerRef.current === centerPlayhead) centerRef.current = null;
    };
  });

  useEffect(() => {
    centerPlayhead();
  }, [zoom]);

  function revealSelectedMarker() {
    const container = scrollRef.current;
    const row = timelineLayout.rows.find((candidate) =>
      candidate.kind === "lane"
      && candidate.lane.markers.some(({ segment }) => segment.id === selectedSegmentId));
    if (!container || !row) return;
    const axisHeight = 24;
    const rowTop = row.top + axisHeight;
    const rowBottom = rowTop + row.height;
    let nextScrollTop = container.scrollTop;
    if (rowTop < container.scrollTop + axisHeight)
      nextScrollTop = Math.max(0, rowTop - axisHeight);
    else if (rowBottom > container.scrollTop + container.clientHeight)
      nextScrollTop = Math.max(0, rowBottom - container.clientHeight);
    if (nextScrollTop !== container.scrollTop)
      container.scrollTop = nextScrollTop;
    setViewport({ scrollTop: nextScrollTop, height: container.clientHeight });
  }

  useEffect(() => {
    revealSelectedMarker();
  }, [selectedSegmentId, timelineGeometry, timelineLayout]);

  useEffect(() => {
    const container = scrollRef.current;
    const row = timelineLayout.rows.find((candidate) =>
      candidate.kind === "group" && candidate.group.key === selectedGroupKey);
    if (!container || !row) return;
    const axisHeight = 24;
    const rowTop = row.top + axisHeight;
    const rowBottom = rowTop + row.height;
    let nextScrollTop = container.scrollTop;
    if (rowTop < container.scrollTop + axisHeight)
      nextScrollTop = Math.max(0, rowTop - axisHeight);
    else if (rowBottom > container.scrollTop + container.clientHeight)
      nextScrollTop = Math.max(0, rowBottom - container.clientHeight);
    if (nextScrollTop !== container.scrollTop)
      container.scrollTop = nextScrollTop;
    setViewport({ scrollTop: nextScrollTop, height: container.clientHeight });
  }, [selectedGroupKey, timelineLayout]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || typeof ResizeObserver === "undefined") return undefined;
    const update = () => {
      setViewportWidth(container.clientWidth);
      setViewport({ scrollTop: container.scrollTop, height: container.clientHeight });
      revealSelectedMarker();
    };
    const observer = new ResizeObserver(update);
    observer.observe(container);
    update();
    return () => observer.disconnect();
  }, [selectedSegmentId, timelineGeometry, timelineLayout]);

  function seekFromPointer(event) {
    if (!(safeDuration > 0)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    onSeekTime(ratio * safeDuration);
  }

  function seekFromKeyboard(event) {
    const steps = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10,
    };
    let nextTime = null;
    if (Object.hasOwn(steps, event.key)) nextTime = currentTime + steps[event.key];
    if (event.key === "Home") nextTime = 0;
    if (event.key === "End") nextTime = safeDuration;
    if (nextTime == null) return;
    event.preventDefault();
    event.stopPropagation();
    onSeekTime(Math.min(safeDuration, Math.max(0, nextTime)));
  }

  function updateSwimlaneTitleWidthFromPointer(event) {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;
    onSwimlaneTitleWidthChange(clampSwimlaneTitleWidth(event.clientX - bounds.left, labelWidthMaximum));
  }

  function handleSwimlaneTitleSeparatorKeyDown(event) {
    const step = event.shiftKey ? 40 : 16;
    let nextWidth = null;
    if (event.key === "ArrowLeft") nextWidth = labelWidthPx - step;
    if (event.key === "ArrowRight") nextWidth = labelWidthPx + step;
    if (event.key === "Home") nextWidth = 160;
    if (event.key === "End") nextWidth = labelWidthMaximum;
    if (nextWidth == null) return;
    event.preventDefault();
    event.stopPropagation();
    onSwimlaneTitleWidthChange(clampSwimlaneTitleWidth(nextWidth, labelWidthMaximum));
  }

  const controlClass = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return h("section", {
    ref: sectionRef,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface",
  }, [
    h("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      h("button", {
        key: "title",
        type: "button",
        onClick: (event) => {
          if (!(event.metaKey || event.ctrlKey)) return;
          event.preventDefault();
          onSelectAll?.();
        },
        onKeyDown: (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onSelectAll?.();
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline",
      }, "Swimlanes"),
      h("button", { key: "out", type: "button", className: controlClass, disabled: zoom <= 1, onClick: () => onZoomChange(clampTimelineZoom(zoom - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      h("button", { key: "fit", type: "button", className: controlClass, disabled: zoom === 1, onClick: () => onZoomChange(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(zoom * 100)}%`),
      h("button", { key: "in", type: "button", className: controlClass, disabled: zoom >= 8, onClick: () => onZoomChange(clampTimelineZoom(zoom + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      h("button", { key: "center", type: "button", className: controlClass, onClick: centerPlayhead, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎"),
    ]),
    h("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(labelWidthMaximum),
      "aria-valuenow": Math.round(labelWidthPx),
      "aria-valuetext": `${Math.round(labelWidthPx)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        updateSwimlaneTitleWidthFromPointer(event);
      },
      onPointerMove: (event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) updateSwimlaneTitleWidthFromPointer(event);
      },
      onKeyDown: handleSwimlaneTitleSeparatorKeyDown,
      onDoubleClick: () => onSwimlaneTitleWidthChange(DEFAULT_EDITOR_LAYOUT.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${labelWidthPx - 4}px`, touchAction: "none", cursor: "col-resize" },
    }, h("span", { className: "h-16 w-1 rounded-full bg-border" })),
    h("div", {
      key: "scroll",
      ref: scrollRef,
      onScroll: (event) => setViewport({
        scrollTop: event.currentTarget.scrollTop,
        height: event.currentTarget.clientHeight,
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto",
    }, h("div", { style: timelineContentStyle(zoom) }, [
      h("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${labelWidthRem}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        h("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        h("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": safeDuration,
          "aria-valuenow": Math.min(safeDuration, Math.max(0, currentTime)),
          "aria-valuetext": formatTime(currentTime),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: seekFromPointer,
          onKeyDown: seekFromKeyboard,
        }, labeledTicks.map((tick, index) => h("span", {
          key: tick,
          className: `absolute top-0 ${timelineTickAlignment(index, labeledTicks.length, safeDuration > 0 ? tick / safeDuration * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: timelineTickPosition(index, labeledTicks.length, safeDuration > 0 ? tick / safeDuration * 100 : 0),
        }, formatTime(tick))).concat(shotBoundaries.map((shot) => {
          const start = safeDuration > 0 ? shot.startSec / safeDuration * 100 : 0;
          return h("button", {
            key: `shot-boundary:${shot.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${formatTime(shot.startSec)} – ${formatTime(shot.endSec)}`,
            title: `Shot boundary · ${shot.source || "manual"} · ${formatTime(shot.startSec)} – ${formatTime(shot.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${start}%`, width: "2px" },
            onClick: (event) => {
              event.stopPropagation();
              onSeekTime(shot.startSec);
            },
          }, [
            h("span", {
              key: "line",
              "aria-hidden": "true",
              className: "block h-full w-full bg-orange-400 opacity-60 transition-opacity group-hover:opacity-100",
            }),
            h("span", {
              key: "indicator",
              "aria-hidden": "true",
              className: "absolute bottom-0 left-0 h-1 w-1 -translate-x-1/2 rounded-full bg-orange-400 opacity-80",
            }),
          ]);
        }), h("span", {
          key: "playhead",
          "data-timeline-playhead": "axis",
          "aria-hidden": "true",
          className: "pointer-events-none absolute top-0 z-20",
          style: {
            ...timelinePlayheadHorizontalStyle(playhead),
            width: "2px",
            height: "calc(100% + 2px)",
            backgroundColor: "var(--color-accent)",
          },
        }))),
      ]),
      h("div", {
        key: "body",
        "data-timeline-body": "true",
        className: "relative",
        style: lanes.length > 0 ? { height: timelineLayout.height } : undefined,
      }, [
        lanes.length > 0 ? h("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...timelinePlayheadHorizontalStyle(playhead, true),
            width: "2px",
            backgroundColor: "var(--color-accent)",
          },
        }) : null,
        lanes.length === 0
          ? h("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.")
          : visibleTimelineRows.map((row) => {
            const group = row.group;
            const collapsed = collapsedGroupKeys.includes(group.key);
            const groupSelected = selectedGroupKey === group.key;
            const groupHeaderBackground = segmentGroupHeaderBackground(groupSelected);
            if (row.kind === "group") return h("div", {
              key: row.key,
              "data-segment-group": group.key,
              "data-segment-group-collapsed": collapsed ? "true" : "false",
              className: "absolute left-0 right-0 grid border-b border-border",
              style: {
                gridTemplateColumns: `${labelWidthRem}rem minmax(0,1fr)`,
                backgroundColor: groupHeaderBackground,
                top: row.top,
                height: row.height,
              },
            }, [
              h("button", {
                key: "name",
                type: "button",
                onClick: (event) => {
                  if (event.metaKey || event.ctrlKey) {
                    onSelectSegments(group.lanes.flatMap((lane) =>
                      lane.markers.map((marker) => marker.segment.id)));
                    return;
                  }
                  onSelectGroup(group.key);
                  onToggleGroup(group.key);
                },
                "aria-expanded": !collapsed,
                "aria-current": groupSelected ? "true" : undefined,
                "data-selected-timeline-group": groupSelected ? "true" : "false",
                className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
                style: {
                  borderLeftColor: group.id == null ? "var(--color-border)" : "var(--color-accent)",
                  backgroundColor: groupHeaderBackground,
                },
                title: `${collapsed ? "Expand" : "Collapse"} ${group.name}`,
              }, [
                h("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, collapsed ? "▶" : "▼"),
                h("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, group.name),
              ]),
              h("div", { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
                collapsed ? [
                  h("span", { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                    `${group.lanes.length} swimlane${group.lanes.length === 1 ? "" : "s"} hidden`),
                  showReviewState ? h(LaneReviewCounts, { key: "states", counts: group.counts }) : null,
                ] : null),
            ]);
            const lane = row.lane;
            const stripeBackground = swimlaneStripeBackground(row.laneIndex);
            return h("div", {
              key: row.key,
              "data-grouped-swimlane": group.key,
              className: "absolute left-0 right-0 grid border-b border-border",
              style: {
                gridTemplateColumns: `${labelWidthRem}rem minmax(0,1fr)`,
                top: row.top,
                height: row.height,
                backgroundColor: stripeBackground,
              },
            }, [
              h("div", {
                key: "label",
                "data-timeline-label-gutter": "true",
                className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
                style: { backgroundColor: stripeBackground },
                title: `${swimlaneDisplayLabel(lane)} · Cmd/Ctrl+click to toggle all segments`,
                "aria-label": swimlaneDisplayLabel(lane),
                onClick: (event) => {
                  if (event.metaKey || event.ctrlKey)
                    onSelectSegments(lane.markers.map((marker) => marker.segment.id));
                },
                onMouseEnter: () => setHoveredLaneKey(lane.key),
                onMouseLeave: () => setHoveredLaneKey((current) => current === lane.key ? null : current),
              }, [
                lane.tagId != null ? h("button", {
                  key: "configure",
                  type: "button",
                  onClick: (event) => {
                    event.stopPropagation();
                    onConfigureTag({ tagId: lane.tagId, tagName: lane.label, trigger: event.currentTarget });
                  },
                  "aria-label": `Configure ${lane.label}`,
                  title: "Configure tag",
                  className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                  style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: hoveredLaneKey === lane.key ? 1 : undefined },
                }, "⚙") : null,
                h("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, lane.label),
                lane.performers?.length
                  ? h(PerformerSublaneAvatars, {
                      key: "performers",
                      performers: lane.performers,
                      performerAssignments: lane.performerAssignments,
                    })
                  : null,
                showReviewState ? h(LaneReviewCounts, { key: "counts", counts: lane.counts }) : null,
              ]),
              h("div", { key: "track", className: "relative" }, lane.markers.map(({ segment, track }) => {
                  const startPercent = timelineTimePercent(segment.startSec, safeDuration);
                  const end = segment.endSec == null ? segment.startSec : Math.max(segment.startSec, segment.endSec);
                  const widthPercent = Math.max(0, timelineTimePercent(end, safeDuration) - startPercent);
                  const selected = selectedSegmentIds.includes(segment.id);
                  const active = segment.id === selectedSegmentId;
                  const slotStatus = performerSlotStatusFromSegmentSlots(performerSlotsBySegment.get(segment.id));
                  const timeLabel = segment.endSec == null ? formatTime(segment.startSec) : `${formatTime(segment.startSec)} – ${formatTime(segment.endSec)}`;
                  const slotLabel = SLOT_STATUS_PRESENTATION[slotStatus]?.label;
                  return h("button", {
                    key: segment.id,
                    type: "button",
                    onClick: (event) => {
                      event.stopPropagation();
                      onSelect(segment, {
                        additive: event.metaKey || event.ctrlKey,
                        rangeSegmentIds: event.shiftKey ? lane.markers.map((marker) => marker.segment.id) : null,
                      });
                    },
                    "aria-pressed": selected,
                    "aria-current": active ? "true" : undefined,
                    "data-selected-timeline-marker": active ? "true" : undefined,
                    "data-selected-segment-shortcut-target": active ? "true" : undefined,
                    "aria-label": showReviewState ? `${segment.tagName || "Tag segment"}${lane.performerLabel ? `, ${lane.performerLabel}` : ""}, ${segment.reviewState}${slotLabel ? `, ${slotLabel}` : ""}, ${timeLabel}` : `${segment.tagName || "Tag segment"}${lane.performerLabel ? `, ${lane.performerLabel}` : ""}, ${timeLabel}`,
                    title: showReviewState ? `${segment.tagName || "Tag segment"}${lane.performerLabel ? ` · ${lane.performerLabel}` : ""} · ${segment.reviewState}${slotLabel ? ` · ${slotLabel}` : ""} · ${timeLabel}` : `${segment.tagName || "Tag segment"}${lane.performerLabel ? ` · ${lane.performerLabel}` : ""} · ${timeLabel}`,
                    className: "absolute rounded-sm border",
                    style: {
                      borderColor: "var(--color-border)",
                      ...(showReviewState
                        ? segmentTimelineStyle(segment.reviewState, selected, slotStatus, active)
                        : basicSegmentTimelineStyle(selected, active)),
                      left: `${startPercent}%`,
                      top: `${swimlaneMarkerTop(track)}rem`,
                      width: timelineSegmentWidth(segment.endSec, widthPercent),
                      height: "1rem",
                    },
                  });
                })),
            ]);
          }),
      ]),
    ])),
  ]);
}

export { SwimlaneTimeline };
