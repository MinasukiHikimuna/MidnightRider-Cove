import React from "@cove/runtime/react";
import { extensionFetch } from "@cove/runtime/api";

const h = React.createElement;
const CONNECTIONS_ENDPOINT = "/api/plugins/com.midnightrider.six-degrees/performer-connections";
const PICKER_PAGE_SIZE = 12;
const SEARCH_DELAY_MS = 200;
const SWIPE_DISTANCE = 48;

// Pure model helpers, exported for tests/six-degrees-model.test.mjs.

export function clamp(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
}

export function readPerformerId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function readSettings(configuration) {
  return {
    mode: configuration?.mode === "selected" ? "selected" : "random",
    startPerformerId: readPerformerId(configuration?.startPerformerId),
    endPerformerId: readPerformerId(configuration?.endPerformerId),
    maxDegrees: clamp(configuration?.maxDegrees, 1, 6, 6),
  };
}

// A search runs only for two different performers; anything less waits for the viewer to finish choosing.
export function pairRequest(startId, endId) {
  return startId && endId && startId !== endId
    ? { kind: "pair", startId, endId }
    : { kind: "idle", startId: startId ?? null, endId: endId ?? null };
}

export function initialRequest(settings) {
  return settings.mode === "random" ? { kind: "random" } : pairRequest(settings.startPerformerId, settings.endPerformerId);
}

export function connectionQuery(request, maxDegrees, seed) {
  const params = new URLSearchParams({ maxDegrees: String(maxDegrees) });
  if (request.kind === "pair") {
    params.set("startPerformerId", String(request.startId));
    params.set("endPerformerId", String(request.endId));
  } else {
    params.set("seed", String(seed));
  }
  return `${CONNECTIONS_ENDPOINT}?${params}`;
}

// Every page load and every shuffle draws a fresh pair, so reloading never replays pairs already seen.
export function randomSeed(random = Math.random) {
  return Math.floor(random() * 0x80000000) & 0x7fffffff;
}

export function pathPerformers(chain) {
  return chain ? [chain.start, ...(chain.steps ?? []).map((step) => step.to)] : [];
}

export function clampSelection(index, degrees) {
  return Math.min(Math.max(0, index), Math.max(0, degrees - 1));
}

// Performers sit at the centres of equal rail columns, and each shared video spans the gap between two of them.
// Values are percentages of the rail's width.
export function railGeometry(degrees, selected) {
  const column = 100 / (degrees + 1);
  return {
    inset: column / 2,
    segmentLeft: column * (clampSelection(selected, degrees) + 0.5),
    segmentWidth: column,
  };
}

export function degreeLabel(degrees) {
  return degrees === 1 ? "1 degree" : `${degrees} degrees`;
}

export function countLabel(count) {
  const value = Number(count) || 0;
  return value === 1 ? "1 video" : `${value.toLocaleString()} videos`;
}

export function personMeta(index, degrees, performer) {
  const role = index === 0 ? "Start · " : index === degrees ? "Finish · " : "";
  return `${role}${countLabel(performer.videoCount)}`;
}

export function videoYear(date) {
  return /^\d{4}-/.test(date ?? "") ? date.slice(0, 4) : "";
}

export function formatVideoDate(date) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date ?? "");
  if (!match) return "";
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    .toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export function performerSummary(performer) {
  return {
    id: performer.id,
    name: performer.name,
    disambiguation: performer.disambiguation || null,
    imageUrl: performer.imagePath || null,
    videoCount: performer.videoCount ?? 0,
  };
}

export function emptyCopy(reason, maxDegrees, startName, endName) {
  switch (reason) {
    case "noPath":
      return {
        title: `No Connection Within ${maxDegrees} ${maxDegrees === 1 ? "Degree" : "Degrees"}`,
        body: `${startName || "These performers"} and ${endName || "this performer"} don’t share a path through the videos you can see.`,
      };
    case "performerUnavailable":
      return {
        title: "Performer Unavailable",
        body: "One or both of these performers are unavailable or have no videos you can see.",
      };
    case "notEnoughConnections":
      return {
        title: "No Connections Yet",
        body: "Six Degrees needs at least one video you can see with two or more performers in it.",
      };
    default:
      return {
        title: "Choose Two Performers",
        body: "The path appears as soon as both are chosen. Or shuffle for a random pair.",
      };
  }
}

export function footerText(value) {
  const pair = value.chain?.isRandom ? "Random pair" : "Chosen pair";
  return `${pair} · shortest path within ${degreeLabel(value.maxDegrees)} · searched ${Number(value.performerCount).toLocaleString()} performers and ${Number(value.videoCount).toLocaleString()} shared videos`;
}

// Widget runtime.

async function fetchJson(path, options = {}) {
  const response = await extensionFetch(path, options);
  if (!response.ok) {
    let detail = "";
    try {
      const problem = await response.json();
      detail = problem?.detail || problem?.title || problem?.message || "";
    } catch {}
    throw new Error(detail || `Cove returned ${response.status}.`);
  }
  return response.json();
}

// Keeps the previous path on screen while the next one loads, so the widget dims instead of collapsing.
function useConnection(request, maxDegrees, seed) {
  const [attempt, setAttempt] = React.useState(0);
  const [state, setState] = React.useState({ loading: request.kind !== "idle", value: null, error: null });
  const key = request.kind === "pair"
    ? `pair:${request.startId}:${request.endId}`
    : request.kind === "random" ? `random:${seed}` : "idle";
  React.useEffect(() => {
    if (request.kind === "idle") {
      setState({ loading: false, value: null, error: null });
      return undefined;
    }
    const controller = new AbortController();
    setState((previous) => ({ loading: true, value: previous.value, error: null }));
    fetchJson(connectionQuery(request, maxDegrees, seed), { signal: controller.signal })
      .then((value) => setState({ loading: false, value, error: null }))
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setState({ loading: false, value: null, error: error instanceof Error ? error : new Error("Unable to search connections.") });
      });
    return () => controller.abort();
  }, [key, maxDegrees, attempt]);
  return { ...state, retry: () => setAttempt((value) => value + 1) };
}

// Names and portraits for chosen performers that no loaded path has described yet.
function usePerformerDirectory(ids) {
  const [known, setKnown] = React.useState({});
  const remember = React.useCallback((performers) => setKnown((previous) => {
    let next = previous;
    for (const performer of performers) {
      if (!performer?.id || previous[performer.id] === performer) continue;
      if (next === previous) next = { ...previous };
      next[performer.id] = performer;
    }
    return next;
  }), []);
  const missing = ids.filter((id) => id && !known[id]).join(",");
  React.useEffect(() => {
    if (!missing) return undefined;
    const controller = new AbortController();
    Promise.all(missing.split(",").map((id) => fetchJson(`/api/performers/${id}`, { signal: controller.signal })
      .then(performerSummary)
      .catch(() => ({ id: Number(id), name: "Unavailable performer", imageUrl: null, videoCount: 0 }))))
      .then((performers) => {
        if (!controller.signal.aborted) remember(performers);
      });
    return () => controller.abort();
  }, [missing, remember]);
  return { known, remember };
}

function Icon({ size = 18, strokeWidth = 2, children, fill = "none" }) {
  return h("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill,
    stroke: fill === "none" ? "currentColor" : "none",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: "false",
  }, children);
}

function ShuffleIcon() {
  return h(Icon, null, h("path", { d: "M16 3h5v5" }), h("path", { d: "M4 20 21 3" }), h("path", { d: "M21 16v5h-5" }),
    h("path", { d: "m15 15 6 6" }), h("path", { d: "M4 4l5 5" }));
}

function ChevronIcon({ direction }) {
  const paths = { down: "m6 9 6 6 6-6", left: "m15 18-6-6 6-6", right: "m9 18 6-6-6-6" };
  return h(Icon, { size: direction === "down" ? 16 : 20 }, h("path", { d: paths[direction] }));
}

function PlayIcon({ size = 14 }) {
  return h(Icon, { size, fill: "currentColor" }, h("path", { d: "M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" }));
}

function PersonIcon({ size = 24 }) {
  return h(Icon, { size, strokeWidth: 1.5 }, h("circle", { cx: 12, cy: 8, r: 4 }), h("path", { d: "M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" }));
}

function PlusIcon() {
  return h(Icon, null, h("path", { d: "M12 5v14" }), h("path", { d: "M5 12h14" }));
}

function SearchIcon() {
  return h(Icon, null, h("circle", { cx: 11, cy: 11, r: 7 }), h("path", { d: "m20 20-3.5-3.5" }));
}

function LinkIcon() {
  return h(Icon, { size: 18, strokeWidth: 2.2 },
    h("path", { d: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" }),
    h("path", { d: "M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" }));
}

function NetworkIcon() {
  return h(Icon, { size: 40, strokeWidth: 1.5 }, h("circle", { cx: 5, cy: 12, r: 2.5 }), h("circle", { cx: 19, cy: 12, r: 2.5 }),
    h("path", { d: "M7.5 12h3" }), h("path", { d: "M13.5 12h3" }));
}

function WarningIcon() {
  return h(Icon, { size: 40, strokeWidth: 1.5 }, h("path", { d: "M12 3 2.5 20h19L12 3Z" }), h("path", { d: "M12 10v4.5" }), h("path", { d: "M12 17.5h.01" }));
}

function Portrait({ performer, className, iconSize = 24 }) {
  const [failed, setFailed] = React.useState(false);
  const source = performer?.imageUrl;
  React.useEffect(() => setFailed(false), [source]);
  return h("span", { className: `sd-portrait ${className}` },
    source && !failed
      ? h("img", { src: source, alt: "", loading: "lazy", decoding: "async", onError: () => setFailed(true) })
      : h(PersonIcon, { size: iconSize }));
}

function Still({ video, className }) {
  const [failed, setFailed] = React.useState(false);
  const source = video?.imageUrl;
  React.useEffect(() => setFailed(false), [source]);
  return h("span", { className: `sd-still ${className}` },
    source && !failed ? h("img", { src: source, alt: "", loading: "lazy", decoding: "async", onError: () => setFailed(true) }) : null);
}

function EndpointChip({ label, id, performer, onClick }) {
  const name = performer?.name ?? (id ? "Loading…" : "Choose a performer");
  return h("button", {
    type: "button",
    className: `sd-chip${id ? "" : " sd-chip--empty"}`,
    onClick,
    "aria-haspopup": "dialog",
    "aria-label": `${label}: ${id ? name : "no performer chosen"}. Choose a different performer`,
  },
  id ? h(Portrait, { performer, className: "sd-chip__avatar", iconSize: 20 }) : h("span", { className: "sd-chip__avatar sd-chip__add" }, h(PlusIcon)),
  h("span", { className: "sd-chip__text" },
    h("span", { className: "sd-chip__label" }, label),
    h("span", { className: "sd-chip__name" }, name)),
  h("span", { className: "sd-chip__chevron" }, h(ChevronIcon, { direction: "down" })));
}

function StepButton({ direction, disabled, onClick }) {
  // aria-disabled rather than disabled, so keyboard focus stays on the button at either end of the chain.
  return h("button", {
    type: "button",
    className: "sd-round",
    onClick: disabled ? undefined : onClick,
    "aria-disabled": disabled,
    "aria-label": direction === "left" ? "Previous link" : "Next link",
  }, h(ChevronIcon, { direction }));
}

function PersonLink({ performer, onNavigate }) {
  return h("button", {
    type: "button",
    className: "sd-person-link",
    onClick: () => onNavigate({ page: "performer", id: performer.id }),
  }, h(Portrait, { performer, className: "sd-person-link__avatar", iconSize: 16 }), performer.name);
}

// Wide layout: the whole path on one rail, with the chosen link described underneath.
function LineView({ chain, index, onSelect, onNavigate }) {
  const degrees = chain.steps.length;
  const people = pathPerformers(chain);
  const geometry = railGeometry(degrees, index);
  const step = chain.steps[index];
  const openVideo = () => onNavigate({ page: "video", id: step.video.id });
  const date = formatVideoDate(step.video.date);
  return h("div", { className: "sd-line" },
    h("div", { className: "sd-line__stage" },
      h("ol", {
        className: "sd-line__videos",
        "aria-label": "Shared videos",
        style: { gridTemplateColumns: `repeat(${degrees}, minmax(0, 1fr))`, paddingInline: `${geometry.inset}%` },
      }, chain.steps.map((link, linkIndex) => h("li", { key: `${linkIndex}-${link.video.id}`, className: "sd-line__video" },
        h("button", {
          type: "button",
          className: "sd-link",
          "aria-current": linkIndex === index ? "true" : undefined,
          "aria-label": `Link ${linkIndex + 1}: ${link.from.name} and ${link.to.name} in ${link.video.title}`,
          onClick: () => onSelect(linkIndex),
        },
        h("span", { className: "sd-link__media" },
          h(Still, { video: link.video, className: "sd-link__still" }),
          h("span", { className: "sd-badge" }, linkIndex + 1)),
        h("span", { className: "sd-link__title" }, link.video.title),
        h("span", { className: "sd-link__year" }, videoYear(link.video.date) || "\u00a0")),
        h("span", { className: "sd-line__tick", "aria-hidden": true })))),
      h("div", { className: "sd-line__rail" },
        h("span", { className: "sd-line__track", "aria-hidden": true, style: { left: `${geometry.inset}%`, right: `${geometry.inset}%` } }),
        h("span", { className: "sd-line__segment", "aria-hidden": true, style: { left: `${geometry.segmentLeft}%`, width: `${geometry.segmentWidth}%` } }),
        h("ol", {
          className: "sd-line__people",
          "aria-label": "Performers along the path",
          style: { gridTemplateColumns: `repeat(${degrees + 1}, minmax(0, 1fr))` },
        }, people.map((performer, personIndex) => h("li", {
          key: `${personIndex}-${performer.id}`,
          className: "sd-person",
          "data-active": personIndex === index || personIndex === index + 1 ? "true" : "false",
        },
        h("button", {
          type: "button",
          className: "sd-person__button",
          onClick: () => onNavigate({ page: "performer", id: performer.id }),
          "aria-label": `Open ${performer.name}`,
        }, h(Portrait, { performer, className: "sd-person__portrait", iconSize: 44 })),
        h("span", { className: "sd-person__name" }, performer.name),
        h("span", { className: "sd-person__meta" }, personMeta(personIndex, degrees, performer))))))),
    h("div", { className: "sd-detail" },
      h("button", { type: "button", className: "sd-detail__media", onClick: openVideo, "aria-label": `Play ${step.video.title}` },
        h(Still, { video: step.video, className: "sd-detail__still" }),
        h("span", { className: "sd-detail__play", "aria-hidden": true }, h(PlayIcon, { size: 22 }))),
      h("div", { className: "sd-detail__text", "aria-live": "polite" },
        h("span", { className: "sd-detail__eyebrow" }, `Link ${index + 1} of ${degrees}`),
        h("h3", { className: "sd-detail__title" }, step.video.title),
        date ? h("span", { className: "sd-detail__date" }, date) : null,
        h("p", { className: "sd-detail__cast" },
          h(PersonLink, { performer: step.from, onNavigate }), " and ",
          h(PersonLink, { performer: step.to, onNavigate }), " both appear in this video."),
        h("div", { className: "sd-detail__actions" },
          h("button", { type: "button", className: "sd-primary", onClick: openVideo }, h(PlayIcon), "Open Video"),
          h(StepButton, { direction: "left", disabled: index === 0, onClick: () => onSelect(index - 1) }),
          h(StepButton, { direction: "right", disabled: index === degrees - 1, onClick: () => onSelect(index + 1) })))));
}

function PersonCard({ performer, align, onNavigate }) {
  return h("button", {
    type: "button",
    className: `sd-card sd-card--${align}`,
    onClick: () => onNavigate({ page: "performer", id: performer.id }),
  },
  h(Portrait, { performer, className: "sd-card__portrait", iconSize: 48 }),
  h("span", { className: "sd-card__name" }, performer.name),
  h("span", { className: "sd-card__meta" }, countLabel(performer.videoCount)));
}

// Narrow layout: one link at a time, stepped with the bar, the arrows, or a swipe across the video.
function StepsView({ chain, index, onSelect, onNavigate }) {
  const degrees = chain.steps.length;
  const step = chain.steps[index];
  const touch = React.useRef(null);
  const swiped = React.useRef(false);
  const openVideo = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    onNavigate({ page: "video", id: step.video.id });
  };
  const onTouchStart = (event) => {
    touch.current = event.touches[0]?.clientX ?? null;
    swiped.current = false;
  };
  const onTouchEnd = (event) => {
    const start = touch.current;
    const end = event.changedTouches[0]?.clientX;
    touch.current = null;
    if (start == null || end == null || Math.abs(end - start) < SWIPE_DISTANCE) return;
    swiped.current = true;
    onSelect(clampSelection(index + (end < start ? 1 : -1), degrees));
  };
  const year = videoYear(step.video.date);
  return h("div", { className: "sd-steps" },
    h("div", { className: "sd-steps__progress" },
      h("div", { className: "sd-steps__labels" },
        h("span", { className: "sd-steps__current" }, `Link ${index + 1} of ${degrees}`),
        h("span", null, `${degreeLabel(degrees)} apart`)),
      h("ol", { className: "sd-steps__bars", style: { gridTemplateColumns: `repeat(${degrees}, minmax(0, 1fr))` } },
        chain.steps.map((link, linkIndex) => h("li", { key: `${linkIndex}-${link.video.id}` },
          h("button", {
            type: "button",
            className: "sd-steps__bar",
            "data-state": linkIndex < index ? "done" : linkIndex === index ? "current" : "next",
            "aria-current": linkIndex === index ? "step" : undefined,
            "aria-label": `Show link ${linkIndex + 1}: ${link.video.title}`,
            onClick: () => onSelect(linkIndex),
          }, h("span", null)))))),
    h("div", { className: "sd-steps__pair" },
      h(PersonCard, { performer: step.from, align: "start", onNavigate }),
      h(PersonCard, { performer: step.to, align: "end", onNavigate }),
      h("span", { className: "sd-steps__joint", "aria-hidden": true }, h(LinkIcon))),
    h("button", {
      type: "button",
      className: "sd-steps__video",
      onClick: openVideo,
      onTouchStart,
      onTouchEnd,
      "aria-label": `Play ${step.video.title}`,
    },
    h(Still, { video: step.video, className: "sd-steps__still" }),
    h("span", { className: "sd-steps__scrim", "aria-hidden": true }),
    h("span", { className: "sd-steps__caption" },
      h("span", { className: "sd-steps__when" }, year ? `Both appear in · ${year}` : "Both appear in"),
      h("span", { className: "sd-steps__title" }, step.video.title))),
    h("div", { className: "sd-steps__nav" },
      h(StepButton, { direction: "left", disabled: index === 0, onClick: () => onSelect(index - 1) }),
      h("button", { type: "button", className: "sd-primary", onClick: () => onNavigate({ page: "video", id: step.video.id }) }, h(PlayIcon), "Open Video"),
      h(StepButton, { direction: "right", disabled: index === degrees - 1, onClick: () => onSelect(index + 1) })));
}

function Message({ icon, tone, title, children, actions }) {
  return h("div", { className: `sd-message sd-message--${tone}`, role: tone === "error" ? "alert" : undefined },
    h("span", { className: "sd-message__icon" }, icon),
    h("strong", null, title),
    h("p", null, children),
    actions ? h("div", { className: "sd-message__actions" }, actions) : null);
}

function Skeleton() {
  return h("div", { className: "sd-skeleton", role: "status", "aria-label": "Finding the shortest path" },
    h("span", { className: "sd-skeleton__title" }, "Finding the Shortest Path…"),
    h("span", { className: "sd-skeleton__rail", "aria-hidden": true },
      [0, 1, 2, 3].map((node) => h(React.Fragment, { key: node },
        node > 0 ? h("span", { className: "sd-skeleton__line" }) : null,
        h("span", { className: "sd-skeleton__node" })))));
}

function PerformerPicker({ open, title, excludeId, onPick, onClose }) {
  const dialogRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const pressedOutside = React.useRef(false);
  const titleId = React.useId();
  const inputId = React.useId();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState({ loading: true, items: [], error: null });

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery("");
      setResults({ loading: true, items: [], error: null });
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return undefined;
    const controller = new AbortController();
    const search = query.trim();
    setResults((previous) => ({ ...previous, loading: true, error: null }));
    const timer = setTimeout(() => {
      fetchJson("/api/performers/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          findFilter: { q: search || undefined, page: 1, perPage: PICKER_PAGE_SIZE, sort: "video_count", direction: "desc" },
        }),
        signal: controller.signal,
      })
        .then((response) => setResults({ loading: false, items: (response.items ?? []).map(performerSummary), error: null }))
        .catch((error) => {
          if (error?.name !== "AbortError") setResults({ loading: false, items: [], error });
        });
    }, search ? SEARCH_DELAY_MS : 0);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  const items = results.items.filter((performer) => performer.id !== excludeId);
  const search = query.trim();
  let list;
  if (results.error) {
    list = h("p", { className: "sd-picker__note", role: "alert" }, results.error.message);
  } else if (!results.loading && items.length === 0) {
    list = h("p", { className: "sd-picker__note" }, search ? `No performers match “${search}”.` : "No performers yet.");
  } else {
    list = h("ul", { className: "sd-picker__list", "aria-busy": results.loading, "aria-labelledby": titleId },
      items.map((performer) => h("li", { key: performer.id },
        h("button", { type: "button", className: "sd-picker__option", onClick: () => onPick(performer) },
          h(Portrait, { performer, className: "sd-picker__avatar", iconSize: 20 }),
          h("span", { className: "sd-picker__text" },
            h("span", { className: "sd-picker__name" }, performer.name),
            h("span", { className: "sd-picker__meta" }, [performer.disambiguation, countLabel(performer.videoCount)].filter(Boolean).join(" · ")))))));
  }

  const outside = (event) => {
    const dialog = dialogRef.current;
    if (event.target !== dialog) return false;
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };

  // The picker is a native modal dialog. Key and click events still bubble through React to any host dialog
  // it is rendered inside (the widget settings), so they stop here instead of closing the host too. aria-modal
  // lets Cove's global keyboard shortcuts see that a dialog is open.
  return h("dialog", {
    ref: dialogRef,
    className: "sd-picker",
    "aria-modal": "true",
    "aria-labelledby": titleId,
    onCancel: (event) => {
      event.preventDefault();
      onClose();
    },
    onClose: () => {
      if (open) onClose();
    },
    onKeyDown: (event) => event.stopPropagation(),
    // Only a press that starts and ends on the backdrop closes the picker, so a text selection dragged out of the
    // search field does not.
    onPointerDown: (event) => {
      pressedOutside.current = outside(event);
    },
    onClick: (event) => {
      event.stopPropagation();
      if (pressedOutside.current && outside(event)) onClose();
      pressedOutside.current = false;
    },
  },
  open ? h("div", { className: "sd-picker__body" },
    h("span", { className: "sd-picker__grabber", "aria-hidden": true }),
    h("div", { className: "sd-picker__header" },
      h("h3", { id: titleId }, title),
      h("button", { type: "button", className: "sd-picker__cancel", onClick: onClose }, "Cancel")),
    h("label", { className: "sd-picker__search", htmlFor: inputId },
      h(SearchIcon),
      h("span", { className: "sd-visually-hidden" }, "Search performers"),
      h("input", {
        ref: inputRef,
        id: inputId,
        type: "search",
        value: query,
        placeholder: "Search performers",
        autoComplete: "off",
        spellCheck: false,
        onChange: (event) => setQuery(event.target.value),
      })),
    h("span", { className: "sd-picker__heading" }, search ? "Results" : "Most videos"),
    list) : null);
}

function SixDegreesWidget({ configuration, onNavigate }) {
  const settings = readSettings(configuration);
  const { mode, startPerformerId, endPerformerId, maxDegrees } = settings;
  const [seed, setSeed] = React.useState(() => randomSeed());
  const [request, setRequest] = React.useState(() => initialRequest(settings));
  // Follow settings changes; the settings the widget opened with are already in the initial state.
  const settingsKey = `${mode}:${startPerformerId}:${endPerformerId}`;
  const appliedSettings = React.useRef(settingsKey);
  React.useEffect(() => {
    if (appliedSettings.current === settingsKey) return;
    appliedSettings.current = settingsKey;
    if (mode === "random") setSeed(randomSeed());
    setRequest(initialRequest({ mode, startPerformerId, endPerformerId, maxDegrees }));
  }, [settingsKey]);

  const state = useConnection(request, maxDegrees, seed);
  const value = state.value;
  const chain = request.kind === "idle" ? null : value?.chain ?? null;
  const degrees = chain?.steps?.length ?? 0;

  const startId = request.kind === "random" ? chain?.start.id ?? null : request.startId;
  const endId = request.kind === "random" ? chain?.end.id ?? null : request.endId;
  const fromChain = (id) => (chain?.start.id === id ? chain.start : chain?.end.id === id ? chain.end : null);
  const { known, remember } = usePerformerDirectory([startId, endId].filter((id) => id && !fromChain(id)));
  const performerFor = (id) => (id ? fromChain(id) ?? known[id] ?? null : null);
  const start = performerFor(startId);
  const end = performerFor(endId);

  React.useEffect(() => {
    if (chain) remember([chain.start, chain.end]);
  }, [chain, remember]);

  // The selection belongs to the chain it was made on, so a new chain starts at its first link without a stale frame.
  const [selection, setSelection] = React.useState({ chain: null, index: 0 });
  const index = selection.chain === chain ? clampSelection(selection.index, degrees) : 0;
  const select = (next) => setSelection({ chain, index: clampSelection(next, degrees) });

  const [picking, setPicking] = React.useState(null);
  const choose = (performer) => {
    remember([performer]);
    setRequest(picking === "end" ? pairRequest(startId, performer.id) : pairRequest(performer.id, endId));
    setPicking(null);
  };
  const shuffle = () => {
    setSeed(randomSeed());
    setRequest({ kind: "random" });
  };

  let body;
  if (state.error) {
    body = h(Message, {
      icon: h(WarningIcon),
      tone: "error",
      title: "Couldn’t Search Connections",
      actions: h("button", { type: "button", className: "sd-pill-button", onClick: state.retry }, "Try Again"),
    }, state.error.message);
  } else if (request.kind === "idle") {
    const copy = emptyCopy("choosePerformers", maxDegrees);
    body = h(Message, {
      icon: h(NetworkIcon),
      tone: "empty",
      title: copy.title,
      actions: h("button", { type: "button", className: "sd-pill-button", onClick: shuffle }, h(ShuffleIcon), "Shuffle"),
    }, copy.body);
  } else if (!value) {
    body = h(Skeleton);
  } else if (!chain || degrees === 0) {
    const copy = emptyCopy(value.emptyReason, value.maxDegrees ?? maxDegrees, start?.name, end?.name);
    body = h("div", { className: "sd-body", "aria-busy": state.loading },
      h(Message, {
        icon: h(NetworkIcon),
        tone: "empty",
        title: copy.title,
        actions: request.kind === "pair" && value.emptyReason === "noPath"
          ? [
              h("button", { key: "change", type: "button", className: "sd-pill-button", onClick: () => setPicking("end") }, "Change Finish"),
              h("button", { key: "shuffle", type: "button", className: "sd-pill-button", onClick: shuffle }, h(ShuffleIcon), "Shuffle"),
            ]
          : null,
      }, copy.body));
  } else {
    body = h("div", { className: "sd-body", "aria-busy": state.loading },
      h(LineView, { chain, index, onSelect: select, onNavigate }),
      h(StepsView, { chain, index, onSelect: select, onNavigate }),
      h("p", { className: "sd-footer" }, footerText(value)));
  }

  return h("section", { className: "sd", "aria-label": "Six Degrees of Johnny Sins" },
    h("div", { className: "sd-card-frame" },
      h("header", { className: "sd-header" },
        h("div", { className: "sd-heading" },
          h("span", { className: "sd-eyebrow" }, "Performer connections"),
          h("h2", null, "Six Degrees of Johnny Sins")),
        h("div", { className: "sd-pair" },
          h(EndpointChip, { label: "From", id: startId, performer: start, onClick: () => setPicking("start") }),
          h("span", { className: "sd-degrees" }, chain && !state.loading ? degreeLabel(degrees) : ""),
          h(EndpointChip, { label: "To", id: endId, performer: end, onClick: () => setPicking("end") })),
        h("button", {
          type: "button",
          className: "sd-shuffle",
          onClick: shuffle,
          "aria-label": "Shuffle a random pair",
        }, h(ShuffleIcon), h("span", { className: "sd-shuffle__label", "aria-hidden": true }, "Shuffle"))),
      body),
    h(PerformerPicker, {
      open: picking !== null,
      title: picking === "end" ? "Choose Finish" : "Choose Start",
      excludeId: picking === "end" ? startId : endId,
      onPick: choose,
      onClose: () => setPicking(null),
    }));
}

function EditorPerformerField({ label, id, performer, onClick }) {
  return h("div", { className: "sd-editor__field" },
    h("span", { className: "sd-editor__label" }, label),
    h("button", { type: "button", className: "sd-editor__performer", onClick, "aria-haspopup": "dialog", "aria-label": `${label}: ${performer?.name ?? "no performer chosen"}. Choose a performer` },
      id ? h(Portrait, { performer, className: "sd-editor__avatar", iconSize: 18 }) : h("span", { className: "sd-editor__avatar sd-chip__add" }, h(PlusIcon)),
      h("span", { className: "sd-editor__name" }, performer?.name ?? (id ? "Loading…" : "Choose a performer"))));
}

function SixDegreesEditor({ configuration, onChange, onValidityChange }) {
  const settings = readSettings(configuration);
  const { mode, startPerformerId, endPerformerId, maxDegrees } = settings;
  const { known, remember } = usePerformerDirectory(mode === "selected" ? [startPerformerId, endPerformerId] : []);
  const [picking, setPicking] = React.useState(null);
  const modeLabelId = React.useId();
  const degreesLabelId = React.useId();
  const valid = mode === "random" || (!!startPerformerId && !!endPerformerId && startPerformerId !== endPerformerId);
  React.useEffect(() => onValidityChange(valid, valid ? undefined : "Choose two different performers."), [valid, onValidityChange]);
  const update = (patch) => onChange({ ...(configuration || {}), ...patch });

  return h("fieldset", { className: "sd-editor" },
    h("legend", null, "Six Degrees of Johnny Sins"),
    h("div", { className: "sd-editor__section" },
      h("span", { id: modeLabelId, className: "sd-editor__heading" }, "Opens with"),
      h("div", { className: "sd-segmented", role: "group", "aria-labelledby": modeLabelId },
        h("button", { type: "button", "aria-pressed": mode === "random", onClick: () => update({ mode: "random" }) }, "A random pair"),
        h("button", { type: "button", "aria-pressed": mode === "selected", onClick: () => update({ mode: "selected" }) }, "A chosen pair")),
      h("p", { className: "sd-editor__note" }, mode === "random"
        ? "A new random pair each time the dashboard opens and whenever someone shuffles."
        : "The dashboard always opens on this pair. Viewers can still change it or shuffle.")),
    mode === "selected" ? h("div", { className: "sd-editor__pair" },
      h(EditorPerformerField, { label: "From", id: startPerformerId, performer: known[startPerformerId], onClick: () => setPicking("start") }),
      h(EditorPerformerField, { label: "To", id: endPerformerId, performer: known[endPerformerId], onClick: () => setPicking("end") })) : null,
    h("div", { className: "sd-editor__section" },
      h("div", { className: "sd-editor__row" },
        h("span", { id: degreesLabelId, className: "sd-editor__heading" }, "Search up to"),
        h("div", { className: "sd-stepper", role: "group", "aria-labelledby": degreesLabelId },
          h("button", { type: "button", onClick: () => update({ maxDegrees: maxDegrees - 1 }), disabled: maxDegrees <= 1, "aria-label": "Fewer degrees" }, "−"),
          h("output", { "aria-live": "polite" }, degreeLabel(maxDegrees)),
          h("button", { type: "button", onClick: () => update({ maxDegrees: maxDegrees + 1 }), disabled: maxDegrees >= 6, "aria-label": "More degrees" }, "+"))),
      h("p", { className: "sd-editor__note" }, "Pairs further apart than this show No Connection. Random pairs are any two performers linked within this many degrees.")),
    h(PerformerPicker, {
      open: picking !== null,
      title: picking === "end" ? "Choose Finish" : "Choose Start",
      excludeId: picking === "end" ? startPerformerId : endPerformerId,
      onClose: () => setPicking(null),
      onPick: (performer) => {
        remember([performer]);
        update({ [picking === "end" ? "endPerformerId" : "startPerformerId"]: performer.id });
        setPicking(null);
      },
    }));
}

export default {
  components: {
    SixDegreesWidget,
    SixDegreesEditor,
  },
};
