const EDITOR_LAYOUT_STORAGE_KEY = "segment-studio.layout.v1";

const REVIEW_FILTER_STORAGE_KEY = "segment-studio.review-filters.v1";

const OPERATION_STORAGE_KEY = "segment-studio.operations.v1";

const COLLAPSED_SEGMENT_GROUPS_STORAGE_KEY = "segment-studio.collapsed-segment-groups.v1";

const PLAYBACK_SHORTCUTS_STORAGE_KEY = "segment-studio.playback-shortcuts.v1";

const SHORTCUT_BINDINGS_STORAGE_KEY = "segment-studio.shortcut-bindings.v1";

const TIMING_CLIPBOARD_STORAGE_KEY = "segment-studio.timing-clipboard.v1";

const HIDE_DERIVED_SEGMENTS_STORAGE_KEY = "segment-studio.hide-derived-segments.v1";

const MERGE_CONFIRMATION_STORAGE_KEY = "segment-studio.merge-confirmation.v1";

const REVIEW_STATES = ["unreviewed", "approved", "rejected"];

const GENDER_HINTS = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"];

const WIDE_EDITOR_QUERY = "(min-width: 1024px) and (min-height: 640px)";

const SPLIT_EDITOR_QUERY = "(min-width: 1024px) and (min-height: 900px)";

const PLAYHEAD_ROUNDING_TOLERANCE_SECONDS = 0.001;

const PLAYHEAD_NAVIGATION_WINDOW_SECONDS = 15;

const OPEN_SEGMENT_NAVIGATION_DURATION_SECONDS = 30;

const TIMELINE_END_MARGIN_PX = 12;

const DEFAULT_EDITOR_LAYOUT = {
  timelineRatio: 0.45,
  markerRailOpen: true,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256,
};

const DEFAULT_PLAYBACK_SHORTCUT_CONFIG = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30,
};

const EMPTY_EDITOR_HISTORY = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: [],
};

export { EDITOR_LAYOUT_STORAGE_KEY, REVIEW_FILTER_STORAGE_KEY, OPERATION_STORAGE_KEY, COLLAPSED_SEGMENT_GROUPS_STORAGE_KEY, PLAYBACK_SHORTCUTS_STORAGE_KEY, SHORTCUT_BINDINGS_STORAGE_KEY, TIMING_CLIPBOARD_STORAGE_KEY, HIDE_DERIVED_SEGMENTS_STORAGE_KEY, MERGE_CONFIRMATION_STORAGE_KEY, REVIEW_STATES, GENDER_HINTS, WIDE_EDITOR_QUERY, SPLIT_EDITOR_QUERY, PLAYHEAD_ROUNDING_TOLERANCE_SECONDS, PLAYHEAD_NAVIGATION_WINDOW_SECONDS, OPEN_SEGMENT_NAVIGATION_DURATION_SECONDS, TIMELINE_END_MARGIN_PX, DEFAULT_EDITOR_LAYOUT, DEFAULT_PLAYBACK_SHORTCUT_CONFIG, EMPTY_EDITOR_HISTORY };
