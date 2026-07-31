import { h, useEffect, useMemo, useState } from "../shared/runtime.js";

import { requestJson } from "../shared/api.js";

import { formatGenderHint, performerSlotLabel } from "../editor/model/history.js";

import { InlineTagConfigurationDialog } from "../editor/dialogs/InlineTagConfigurationDialog.js";

import { buildPerformerSlotOverview, filterPerformerSlotOverview } from "./organization.js";

function PerformerSlotOverviewSettings({ active, segmentGroups, onSegmentGroupsChanged }) {
  const [summaries, setSummaries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [coverage, setCoverage] = useState("all");
  const [collapsedGroupKeys, setCollapsedGroupKeys] = useState(() => new Set());
  const [configuringTag, setConfiguringTag] = useState(null);

  useEffect(() => {
    if (!active || loaded) return undefined;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    requestJson("/slot-definitions", { signal: controller.signal })
      .then((result) => {
        setSummaries(result || []);
        setLoaded(true);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError")
          setError(requestError.message || "Unable to load performer slot definitions.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [active, loaded]);

  async function reloadSummaries() {
    setLoading(true);
    setError("");
    try {
      const result = await requestJson("/slot-definitions");
      setSummaries(result || []);
      setLoaded(true);
    } catch (requestError) {
      setError(requestError.message || "Unable to load performer slot definitions.");
    } finally {
      setLoading(false);
    }
  }

  async function refreshAfterEdit() {
    const [result] = await Promise.all([
      requestJson("/slot-definitions"),
      onSegmentGroupsChanged?.(),
    ]);
    setSummaries(result || []);
    setLoaded(true);
    setError("");
  }

  function closeConfiguration() {
    const trigger = configuringTag?.trigger;
    setConfiguringTag(null);
    requestAnimationFrame(() => {
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    });
  }

  function toggleGroup(groupKey) {
    setCollapsedGroupKeys((current) => {
      const next = new Set(current);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  }

  const overview = useMemo(
    () => buildPerformerSlotOverview(segmentGroups, summaries),
    [segmentGroups, summaries],
  );
  const filteredGroups = useMemo(
    () => filterPerformerSlotOverview(overview, query, coverage),
    [overview, query, coverage],
  );
  const tags = overview.flatMap((group) => group.tags);
  const withSlotsCount = tags.filter((tag) => tag.definitions.length > 0).length;
  const withoutSlotsCount = tags.length - withSlotsCount;
  const coverageOptions = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"],
  ];
  const buttonClass = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";

  return h("section", {
    className: "space-y-4",
    "aria-label": "Performer slot overview",
  }, [
    h("div", { key: "heading", className: "rounded-lg border border-border bg-surface p-4" }, [
      h("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Performer slots"),
      h("p", { key: "description", className: "mt-1 max-w-3xl text-sm text-secondary" },
        "Review performer roles for every Segment tag without opening tags one at a time."),
      loaded ? h("p", { key: "summary", className: "mt-2 text-xs text-secondary" },
        `${tags.length} tags · ${withSlotsCount} with slots · ${withoutSlotsCount} without slots`) : null,
    ]),
    h("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      h("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        h("span", { key: "label" }, "Search"),
        h("input", {
          key: "input",
          type: "search",
          value: query,
          onChange: (event) => setQuery(event.target.value),
          "aria-label": "Search tags and performer slots",
          placeholder: "Search tags or slot labels…",
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground",
        }),
      ]),
      h("div", { key: "coverage", className: "space-y-1" }, [
        h("span", { key: "label", className: "block text-xs text-secondary" }, "Coverage"),
        h("div", { key: "choices", role: "group", "aria-label": "Performer slot coverage", className: "inline-flex rounded-md border border-border bg-card p-0.5" },
          coverageOptions.map(([key, label]) => h("button", {
            key,
            type: "button",
            onClick: () => setCoverage(key),
            "aria-pressed": coverage === key,
            className: `rounded px-3 py-1.5 text-xs font-medium ${
              coverage === key ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`,
          }, label))),
      ]),
      h("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        h("button", {
          key: "expand",
          type: "button",
          onClick: () => setCollapsedGroupKeys(new Set()),
          className: buttonClass,
        }, "Expand all"),
        h("button", {
          key: "collapse",
          type: "button",
          onClick: () => setCollapsedGroupKeys(new Set(overview.map((group) => group.overviewKey))),
          className: buttonClass,
        }, "Collapse all"),
      ]),
    ]),
    loading && !loaded
      ? h("p", { key: "loading", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
          "Loading performer slots…")
      : null,
    error ? h("div", { key: "error", role: "alert", className: "flex flex-wrap items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive" }, [
      h("span", { key: "message", className: "min-w-0 flex-1" }, error),
      h("button", {
        key: "retry",
        type: "button",
        disabled: loading,
        onClick: reloadSummaries,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50",
      }, "Retry"),
    ]) : null,
    loaded && filteredGroups.length === 0
      ? h("p", { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
          "No tags match the current search and coverage filter.")
      : null,
    loaded ? h("div", { key: "groups", className: "space-y-3" }, filteredGroups.map((group) => {
      const collapsed = collapsedGroupKeys.has(group.overviewKey);
      const groupWithSlots = group.tags.filter((tag) => tag.definitions.length > 0).length;
      return h("article", {
        key: group.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface",
      }, [
        h("button", {
          key: "header",
          type: "button",
          onClick: () => toggleGroup(group.overviewKey),
          "aria-expanded": !collapsed,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30",
        }, [
          h("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, collapsed ? "▸" : "▾"),
          h("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, group.name),
          h("span", { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${group.tags.length} tag${group.tags.length === 1 ? "" : "s"} · ${groupWithSlots} with slots`),
        ]),
        collapsed ? null : h("ul", { key: "tags", className: "divide-y divide-border" },
          group.tags.map((tag) => h("li", {
            key: tag.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start",
          }, [
            h("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 },
            }, [
              h("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: tag.tagName }, tag.tagName),
              tag.allowSamePerformerInMultipleSlots
                ? h("span", { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                    "Allow same performer")
                : null,
            ]),
            tag.definitions.length === 0
              ? h("span", {
                  key: "empty",
                  className: "text-sm text-secondary",
                  style: { width: "100%", maxWidth: "32rem", flexShrink: 1 },
                }, "No performer slots")
              : h("ul", {
                  key: "slots",
                  "aria-label": `Performer slots for ${tag.tagName}`,
                  className: "grid min-w-0 gap-2",
                  style: { width: "100%", maxWidth: "32rem", flexShrink: 1 },
                }, tag.definitions.map((definition) => h("li", {
                    key: definition.id,
                    className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs",
                  }, [
                    h("span", { key: "label", className: "font-medium text-foreground" }, performerSlotLabel(definition)),
                    ...(definition.genderHints || []).map((hint) => h("span", {
                      key: hint,
                      className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary",
                    }, formatGenderHint(hint))),
                  ]))),
            h("button", {
              key: "edit",
              type: "button",
              onClick: (event) => setConfiguringTag({
                tagId: tag.tagId,
                tagName: tag.tagName,
                trigger: event.currentTarget,
              }),
              "aria-label": `Edit performer slots for ${tag.tagName}`,
              className: `${buttonClass} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 },
            }, "Edit"),
          ]))),
      ]);
    })) : null,
    configuringTag ? h(InlineTagConfigurationDialog, {
      key: `performer-slots-configure:${configuringTag.tagId}`,
      tagId: configuringTag.tagId,
      tagName: configuringTag.tagName,
      onSaved: refreshAfterEdit,
      onClose: closeConfiguration,
    }) : null,
  ]);
}

export { PerformerSlotOverviewSettings };
