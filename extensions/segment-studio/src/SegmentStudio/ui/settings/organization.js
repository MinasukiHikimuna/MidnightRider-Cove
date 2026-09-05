import { h, useEffect, useState } from "../shared/runtime.js";

import { GENDER_HINTS } from "../shared/constants.js";

import { requestJson } from "../shared/api.js";

import { formatGenderHint, performerSlotLabel } from "../editor/model/history.js";

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

export { SlotDefinitionSettings };
