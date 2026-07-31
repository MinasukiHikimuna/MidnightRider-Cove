import { h, useEffect, useState } from "../shared/runtime.js";

import { GENDER_HINTS } from "../shared/constants.js";

import { requestJson } from "../shared/api.js";

import { formatGenderHint, performerSlotLabel } from "../editor/model/history.js";

export function reorderSegmentGroups(groups = [], draggedGroupId, targetIndex) {
  const sourceIndex = groups.findIndex((group) => group.id === draggedGroupId);
  if (sourceIndex < 0) return groups;
  const reordered = [...groups];
  const [dragged] = reordered.splice(sourceIndex, 1);
  const insertionIndex = Math.max(0, Math.min(Number(targetIndex) || 0, reordered.length));
  reordered.splice(insertionIndex, 0, dragged);
  return reordered.map((group, sortOrder) => ({ ...group, sortOrder }));
}

export function moveSegmentGroupTag(groups = [], tagId, targetGroupId, targetIndex) {
  const sourceGroup = groups.find((group) => group.tags.some((tag) => tag.tagId === tagId));
  const targetGroup = groups.find((group) => group.id === targetGroupId);
  if (!sourceGroup || !targetGroup) return groups;
  const tag = sourceGroup.tags.find((candidate) => candidate.tagId === tagId);
  const withoutTag = groups.map((group) => ({
    ...group,
    tags: group.tags
      .filter((candidate) => candidate.tagId !== tagId)
      .map((candidate, sortOrder) => ({ ...candidate, sortOrder })),
  }));
  const target = withoutTag.find((group) => group.id === targetGroupId);
  const insertionIndex = Math.max(0, Math.min(Number(targetIndex) || 0, target.tags.length));
  target.tags.splice(insertionIndex, 0, { ...tag, sortOrder: insertionIndex });
  target.tags = target.tags.map((candidate, sortOrder) => ({ ...candidate, sortOrder }));
  return withoutTag;
}

export function buildPerformerSlotOverview(groups = [], summaries = []) {
  const summariesByTag = new Map((summaries || []).map((summary) => [
    Number(summary.tagId),
    {
      ...summary,
      tagId: Number(summary.tagId),
      definitions: [...(summary.definitions || [])]
        .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0)
          || String(left.id).localeCompare(String(right.id))),
    },
  ]));
  const groupedTagIds = new Set();
  const grouped = [...(groups || [])]
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0)
      || Number(left.id) - Number(right.id))
    .map((group) => ({
      ...group,
      overviewKey: `group:${group.id}`,
      tags: [...(group.tags || [])]
        .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0)
          || Number(left.tagId) - Number(right.tagId))
        .map((tag) => {
          const tagId = Number(tag.tagId);
          groupedTagIds.add(tagId);
          const summary = summariesByTag.get(tagId);
          return {
            ...tag,
            tagId,
            tagName: tag.tagName || summary?.tagName || `Tag ${tagId}`,
            allowSamePerformerInMultipleSlots: Boolean(summary?.allowSamePerformerInMultipleSlots),
            definitions: summary?.definitions || [],
          };
        }),
    }));
  const ungroupedTags = [...summariesByTag.values()]
    .filter((summary) => !groupedTagIds.has(summary.tagId) && summary.definitions.length > 0)
    .map((summary) => ({
      tagId: summary.tagId,
      tagName: summary.tagName || `Tag ${summary.tagId}`,
      sortOrder: 0,
      allowSamePerformerInMultipleSlots: Boolean(summary.allowSamePerformerInMultipleSlots),
      definitions: summary.definitions,
    }))
    .sort((left, right) => String(left.tagName).localeCompare(String(right.tagName), undefined, {
      numeric: true,
      sensitivity: "base",
    }) || left.tagId - right.tagId);
  if (ungroupedTags.length > 0) {
    grouped.push({
      id: "ungrouped",
      overviewKey: "ungrouped",
      name: "Ungrouped",
      sortOrder: grouped.length,
      synthetic: true,
      tags: ungroupedTags,
    });
  }
  return grouped;
}

export function filterPerformerSlotOverview(groups = [], query = "", coverage = "all") {
  const normalizedQuery = String(query || "").trim().toLocaleLowerCase();
  return groups
    .map((group) => ({
      ...group,
      tags: (group.tags || []).filter((tag) => {
        const hasSlots = (tag.definitions || []).length > 0;
        if (coverage === "with" && !hasSlots) return false;
        if (coverage === "without" && hasSlots) return false;
        if (!normalizedQuery) return true;
        return [
          tag.tagName,
          ...(tag.definitions || []).map((definition) => definition.label),
        ].some((value) => String(value || "").toLocaleLowerCase().includes(normalizedQuery));
      }),
    }))
    .filter((group) => group.tags.length > 0);
}

function SegmentGroupCard({
  group, groups, groupIndex, busy, pickerOpen, pickerQuery, pickerOptions,
  pickerLoading, selectedTagIds, dragState, dropTarget, onTogglePicker,
  onPickerQueryChange, onToggleTagSelection, onAddTags, onCancelPicker,
  onUpdate, onDelete, onRemoveTag, onGroupDragStart, onTagDragStart,
  onDragEnd, onGroupDragOver, onGroupDrop, onTagDragOver, onTagDrop,
}) {
  const [name, setName] = useState(group.name);
  const [renaming, setRenaming] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tagIds = group.tags.map((tag) => tag.tagId);
  const ownership = new Map(groups.flatMap((candidate) => candidate.tags.map((tag) => [tag.tagId, candidate.name])));
  const groupDropBefore = dropTarget?.kind === "group" && dropTarget.index === groupIndex;
  const groupDropAfter = groupIndex === groups.length - 1
    && dropTarget?.kind === "group"
    && dropTarget.index === groups.length;

  useEffect(() => setName(group.name), [group.name]);

  async function saveName(event) {
    event?.preventDefault();
    const saved = await onUpdate(group, { name, tagIds });
    if (saved) {
      setRenaming(false);
      setMenuOpen(false);
    }
  }

  function cancelRename() {
    setName(group.name);
    setRenaming(false);
  }

  const iconButtonClass = "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-sm text-secondary hover:border-accent/60 hover:bg-muted/40 hover:text-foreground disabled:opacity-50";
  return h("article", {
    className: `relative rounded-lg border bg-surface transition ${
      dragState?.kind === "group" && dragState.groupId === group.id
        ? "border-accent/50 opacity-60"
        : "border-border"}`,
    onDragOver: (event) => {
      if (dragState?.kind !== "group") return;
      event.preventDefault();
      const bounds = event.currentTarget.getBoundingClientRect();
      onGroupDragOver(groupIndex + (event.clientY >= bounds.top + bounds.height / 2 ? 1 : 0));
    },
    onDrop: (event) => {
      if (dragState?.kind !== "group") return;
      event.preventDefault();
      onGroupDrop();
    },
  }, [
    groupDropBefore ? h("div", { key: "drop-before", className: "pointer-events-none absolute left-0 right-0 top-0 z-10 h-1 rounded-full bg-accent" }) : null,
    groupDropAfter ? h("div", { key: "drop-after", className: "pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-1 rounded-full bg-accent" }) : null,
    h("header", { key: "header", className: "flex items-center gap-2 border-b border-border p-3" }, [
      h("span", {
        key: "drag",
        draggable: !busy,
        onDragStart: (event) => onGroupDragStart(event, group.id),
        onDragEnd,
        "data-segment-group-drag-handle": "true",
        title: "Drag to reorder group",
        className: "cursor-grab select-none px-1 text-lg leading-none text-secondary active:cursor-grabbing",
      }, "⠿"),
      renaming
        ? h("form", { key: "rename", onSubmit: saveName, className: "flex min-w-0 flex-1 items-center gap-2" }, [
            h("input", {
              key: "input",
              value: name,
              maxLength: 200,
              autoFocus: true,
              onChange: (event) => setName(event.target.value),
              onKeyDown: (event) => { if (event.key === "Escape") cancelRename(); },
              "aria-label": `Group name for ${group.name}`,
              className: "min-w-0 flex-1 rounded-md border border-accent bg-card px-3 py-1.5 text-sm text-foreground",
            }),
            h("button", { key: "save", type: "submit", disabled: busy || !name.trim() || name.trim() === group.name, className: "rounded-md border border-accent bg-accent/15 px-2.5 py-1.5 text-xs font-medium disabled:opacity-50" }, "Save"),
            h("button", { key: "cancel", type: "button", disabled: busy, onClick: cancelRename, className: "rounded-md border border-border px-2.5 py-1.5 text-xs font-medium" }, "Cancel"),
          ])
        : h("h2", { key: "name", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, group.name),
      h("span", { key: "count", className: "shrink-0 rounded-full border border-border bg-card px-2 py-0.5 text-xs text-secondary" },
        `${group.tags.length} tag${group.tags.length === 1 ? "" : "s"}`),
      h("button", {
        key: "add",
        type: "button",
        disabled: busy,
        onClick: () => { setMenuOpen(false); onTogglePicker(group.id); },
        "aria-expanded": pickerOpen,
        "aria-label": `Add tags to ${group.name}`,
        title: `Add tags to ${group.name}`,
        className: iconButtonClass,
      }, h("span", { "aria-hidden": "true", className: "text-lg leading-none" }, "+")),
      h("div", { key: "menu-wrap", className: "relative" }, [
        h("button", {
          key: "menu",
          type: "button",
          disabled: busy,
          onClick: () => setMenuOpen((open) => !open),
          "aria-expanded": menuOpen,
          "aria-label": `More actions for ${group.name}`,
          className: iconButtonClass,
        }, h("span", { "aria-hidden": "true" }, "…")),
        menuOpen ? h("div", {
          key: "popover",
          className: "absolute right-0 top-9 z-20 min-w-36 overflow-hidden rounded-md border border-border bg-card p-1 shadow-xl",
        }, [
          h("button", {
            key: "rename",
            type: "button",
            onClick: () => { setRenaming(true); setMenuOpen(false); },
            className: "block w-full rounded px-3 py-2 text-left text-sm text-foreground hover:bg-muted/40",
          }, "Rename group"),
          h("button", {
            key: "delete",
            type: "button",
            onClick: () => { setMenuOpen(false); onDelete(group); },
            className: "block w-full rounded px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10",
          }, "Delete group"),
        ]) : null,
      ]),
    ]),
    h("div", {
      key: "members",
      className: "space-y-1 p-3",
      onDragOver: (event) => {
        if (dragState?.kind !== "tag" || group.tags.length !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        onTagDragOver(group.id, 0);
      },
      onDrop: (event) => {
        if (dragState?.kind !== "tag") return;
        event.preventDefault();
        event.stopPropagation();
        onTagDrop();
      },
    }, [
      group.tags.length === 0
        ? h("p", { key: "empty", className: "rounded-md border border-dashed border-border p-4 text-center text-xs text-secondary" },
            dragState?.kind === "tag" ? "Drop tag here" : "No tags in this Segment group yet.")
        : h("ol", {
            key: "list",
            className: "space-y-1",
            onDragOver: (event) => {
              if (dragState?.kind !== "tag") return;
              event.preventDefault();
              event.stopPropagation();
              const rows = [...event.currentTarget.querySelectorAll("[data-segment-tag-row]")];
              const insertionIndex = rows.findIndex((row) => {
                const bounds = row.getBoundingClientRect();
                return event.clientY < bounds.top + bounds.height / 2;
              });
              onTagDragOver(group.id, insertionIndex < 0 ? rows.length : insertionIndex);
            },
            onDrop: (event) => {
              if (dragState?.kind !== "tag") return;
              event.preventDefault();
              event.stopPropagation();
              onTagDrop();
            },
          }, group.tags.map((tag, index) => {
            const dropBefore = dropTarget?.kind === "tag"
              && dropTarget.groupId === group.id
              && dropTarget.index === index;
            const dropAfter = index === group.tags.length - 1
              && dropTarget?.kind === "tag"
              && dropTarget.groupId === group.id
              && dropTarget.index === group.tags.length;
            return h("li", {
              key: tag.tagId,
              "data-segment-tag-row": "true",
              className: `relative flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 ${
                dragState?.kind === "tag" && dragState.tagId === tag.tagId ? "opacity-50" : ""}`,
            }, [
              dropBefore || dropAfter ? h("div", {
                key: "drop-indicator",
                "data-segment-tag-drop-indicator": "true",
                className: `pointer-events-none absolute left-0 right-0 z-10 h-1 rounded-full bg-accent ${
                  dropAfter ? "bottom-0" : "top-0"}`,
              }) : null,
              h("span", {
                key: "drag",
                draggable: !busy,
                onDragStart: (event) => onTagDragStart(event, tag.tagId, group.id),
                onDragEnd,
                "data-segment-tag-drag-handle": "true",
                title: `Drag ${tag.tagName || "tag"}`,
                className: "cursor-grab select-none px-1 text-base leading-none text-secondary active:cursor-grabbing",
              }, "⠿"),
              h("span", { key: "order", className: "w-6 text-right font-mono text-xs text-secondary" }, index + 1),
              h("span", { key: "name", className: "min-w-0 flex-1 truncate text-sm text-foreground" }, tag.tagName || `Tag ${tag.tagId}`),
              h("button", {
                key: "remove",
                type: "button",
                disabled: busy,
                onClick: () => onRemoveTag(group, tag.tagId),
                "aria-label": `Remove ${tag.tagName || "tag"} from ${group.name}`,
                title: "Remove from group",
                className: "inline-flex h-7 w-7 items-center justify-center rounded text-secondary hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50",
              }, h("span", { "aria-hidden": "true" }, "×")),
            ]);
          })),
      pickerOpen ? h("section", { key: "picker", className: "mt-3 space-y-3 border-t border-border pt-3", "aria-label": `Add tags to ${group.name}` }, [
        h("input", {
          key: "search",
          type: "search",
          value: pickerQuery,
          autoFocus: true,
          onChange: (event) => onPickerQueryChange(event.target.value),
          placeholder: "Search tags…",
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground",
        }),
        pickerLoading
          ? h("p", { key: "loading", role: "status", className: "text-xs text-secondary" }, "Loading tags…")
          : h("div", { key: "results", className: "max-h-52 overflow-y-auto rounded-md border border-border bg-card" },
              pickerOptions.filter((tag) => !tagIds.includes(tag.id)).length === 0
                ? h("p", { className: "p-3 text-sm text-secondary" }, "No available tags match your search.")
                : pickerOptions.filter((tag) => !tagIds.includes(tag.id)).map((tag) => h("label", {
                    key: tag.id,
                    className: "flex cursor-pointer items-start gap-2 border-b border-border px-3 py-2 last:border-b-0 hover:bg-muted/30",
                  }, [
                    h("input", {
                      key: "input",
                      type: "checkbox",
                      checked: selectedTagIds.includes(tag.id),
                      onChange: () => onToggleTagSelection(tag.id),
                      className: "mt-0.5",
                    }),
                    h("span", { key: "copy", className: "min-w-0" }, [
                      h("span", { key: "name", className: "block truncate text-sm text-foreground" }, tag.name),
                      ownership.has(tag.id)
                        ? h("span", { key: "move", className: "block text-xs text-secondary" }, `Moves from ${ownership.get(tag.id)}`)
                        : null,
                    ]),
                  ]))),
        h("div", { key: "actions", className: "flex items-center justify-end gap-2" }, [
          h("span", { key: "count", className: "mr-auto text-xs text-secondary" },
            `${selectedTagIds.length} selected`),
          h("button", { key: "cancel", type: "button", disabled: busy, onClick: onCancelPicker, className: "rounded-md border border-border px-3 py-1.5 text-xs font-medium" }, "Cancel"),
          h("button", { key: "add", type: "button", disabled: busy || selectedTagIds.length === 0, onClick: () => onAddTags(group), className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium disabled:opacity-50" }, "Add"),
        ]),
      ]) : null,
    ]),
  ]);
}

function SlotDefinitionSettings({ tagOptions }) {
  const [tagId, setTagId] = useState("");
  const [model, setModel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmedAssignedDeletion, setConfirmedAssignedDeletion] = useState(false);

  async function load(selectedTagId) {
    if (!selectedTagId) { setModel(null); return; }
    setMessage("");
    try { setModel(await requestJson(`/slot-definitions/${selectedTagId}`)); setConfirmedAssignedDeletion(false); }
    catch (error) { setMessage(error.message || "Unable to load performer slot definitions."); }
  }

  function updateDefinition(index, values) {
    setModel({ ...model, definitions: model.definitions.map((definition, definitionIndex) => definitionIndex === index ? { ...definition, ...values } : definition) });
  }

  function moveDefinition(index, offset) {
    const target = index + offset;
    if (target < 0 || target >= model.definitions.length) return;
    const definitions = [...model.definitions];
    [definitions[index], definitions[target]] = [definitions[target], definitions[index]];
    setModel({ ...model, definitions: definitions.map((definition, sortOrder) => ({ ...definition, sortOrder })) });
  }

  function deleteDefinition(index) {
    const definition = model.definitions[index];
    const assignments = Number(definition.assignmentCount) || 0;
    if (assignments > 0 && !window.confirm(`Delete “${performerSlotLabel(definition)}” and its ${assignments} assignment${assignments === 1 ? "" : "s"}?`)) return;
    if (assignments === 0 && !window.confirm(`Delete “${performerSlotLabel(definition)}”?`)) return;
    if (assignments > 0) setConfirmedAssignedDeletion(true);
    setModel({ ...model, definitions: model.definitions.filter((_, definitionIndex) => definitionIndex !== index).map((item, sortOrder) => ({ ...item, sortOrder })) });
  }

  async function save() {
    setBusy(true);
    setMessage("Saving slot definitions…");
    try {
      const saved = await requestJson(`/slot-definitions/${tagId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: model.revision,
          allowSamePerformerInMultipleSlots: Boolean(model.allowSamePerformerInMultipleSlots),
          confirmDeleteAssigned: confirmedAssignedDeletion,
          definitions: model.definitions.map((definition, sortOrder) => ({ id: definition.id || undefined, label: definition.label?.trim() || null, sortOrder, genderHints: definition.genderHints || [] })),
        }),
      });
      setModel(saved);
      setConfirmedAssignedDeletion(false);
      setMessage("Slot definitions saved.");
    } catch (error) {
      if (error.status === 409) {
        setMessage("Slot definitions changed elsewhere; current values were reloaded.");
        if (error.payload?.current) { setModel(error.payload.current); setConfirmedAssignedDeletion(false); }
        else await load(tagId);
      }
      else setMessage(error.message || "Unable to save slot definitions.");
    } finally { setBusy(false); }
  }

  const buttonClass = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium disabled:opacity-50";
  return h("section", { className: "space-y-3 rounded-lg border border-border bg-surface p-4", "aria-label": "Performer slot definitions" }, [
    h("div", { key: "heading" }, [h("h2", { key: "title", className: "text-lg font-semibold" }, "Performer slot definitions"), h("p", { key: "copy", className: "text-sm text-secondary" }, "Configure stable activity-specific roles used by Browse and the segment editor.")]),
    h("label", { key: "activity", className: "block space-y-1 text-xs text-secondary" }, [h("span", { key: "label" }, "Activity tag"), h("select", { key: "select", value: tagId, onChange: (event) => { setTagId(event.target.value); load(event.target.value); }, className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm" }, [h("option", { key: "none", value: "" }, "Choose an activity…"), ...tagOptions.map((tag) => h("option", { key: tag.id, value: tag.id }, tag.name))])]),
    model ? h("div", { key: "editor", className: "space-y-3" }, [
      h("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [h("input", { key: "input", type: "checkbox", checked: Boolean(model.allowSamePerformerInMultipleSlots), onChange: (event) => setModel({ ...model, allowSamePerformerInMultipleSlots: event.target.checked }) }), h("span", { key: "label" }, "Allow the same performer in multiple slots")]),
      ...(model.definitions || []).map((definition, index) => h("article", { key: definition.id || `new-${index}`, className: "grid gap-2 rounded-md border border-border bg-card p-3 sm:grid-cols-[1fr_1fr_auto]" }, [
        h("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [h("span", { key: "label" }, "Slot label"), h("input", { key: "input", value: definition.label || "", onChange: (event) => updateDefinition(index, { label: event.target.value }), className: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm" })]),
        h("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
          h("legend", { key: "label" }, "Gender hints"),
          h("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, GENDER_HINTS.map((hint) => h("label", { key: hint, className: "inline-flex items-center gap-1" }, [
            h("input", {
              key: "input",
              type: "checkbox",
              checked: (definition.genderHints || []).includes(hint),
              onChange: (event) => updateDefinition(index, { genderHints: event.target.checked
                ? [...new Set([...(definition.genderHints || []), hint])]
                : (definition.genderHints || []).filter((value) => value !== hint) }),
            }),
            h("span", { key: "text" }, formatGenderHint(hint)),
          ]))),
        ]),
        h("div", { key: "actions", className: "flex items-end gap-1" }, [h("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${definition.assignmentCount || 0} assigned`), h("button", { key: "up", type: "button", disabled: busy || index === 0, onClick: () => moveDefinition(index, -1), className: buttonClass, "aria-label": `Move ${performerSlotLabel(definition)} up` }, "↑"), h("button", { key: "down", type: "button", disabled: busy || index === model.definitions.length - 1, onClick: () => moveDefinition(index, 1), className: buttonClass, "aria-label": `Move ${performerSlotLabel(definition)} down` }, "↓"), h("button", { key: "delete", type: "button", disabled: busy, onClick: () => deleteDefinition(index), className: `${buttonClass} text-red-300` }, "Delete")]),
      ])),
      h("div", { key: "buttons", className: "flex items-center gap-2" }, [h("button", { key: "add", type: "button", disabled: busy, onClick: () => setModel({ ...model, definitions: [...model.definitions, { label: "", sortOrder: model.definitions.length, genderHints: [], assignmentCount: 0 }] }), className: buttonClass }, "Add slot"), h("button", { key: "save", type: "button", disabled: busy, onClick: save, className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save slot definitions")]),
    ]) : null,
    message ? h("p", { key: "message", role: "status", className: "text-sm text-secondary" }, message) : null,
  ]);
}

export { SegmentGroupCard, SlotDefinitionSettings };
