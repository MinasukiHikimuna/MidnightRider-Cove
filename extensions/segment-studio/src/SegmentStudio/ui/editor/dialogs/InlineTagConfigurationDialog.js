import { h, useEffect, useRef, useState } from "../../shared/runtime.js";

import { GENDER_HINTS } from "../../shared/constants.js";

import { requestJson } from "../../shared/api.js";

import { handleModalKey, trapModalFocus } from "../../shared/presentation.js";

import { formatGenderHint, performerSlotLabel } from "../model/history.js";

function InlineTagConfigurationDialog({
  tagId,
  tagName,
  performerSlotsEnabled = false,
  onSaved,
  onClose,
}) {
  const [model, setModel] = useState(null);
  const [segmentGroups, setSegmentGroups] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [targetGroupId, setTargetGroupId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busySection, setBusySection] = useState(null);
  const [message, setMessage] = useState("");
  const [confirmedAssignedDeletion, setConfirmedAssignedDeletion] = useState(false);
  const dialogRef = useRef(null);
  const newSlotKeyRef = useRef(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => dialogRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [tagId]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setMessage("");
    Promise.all([
      performerSlotsEnabled
        ? requestJson(`/slot-definitions/${tagId}`, { signal: controller.signal })
        : Promise.resolve(null),
      requestJson("/segment-groups", { signal: controller.signal }),
    ])
      .then(([loadedModel, loadedGroups]) => {
        const currentGroup = loadedGroups.find((group) =>
          (group.tags || []).some((tag) => Number(tag.tagId) === Number(tagId)));
        setModel(loadedModel);
        setSegmentGroups(loadedGroups);
        setCurrentGroupId(currentGroup?.id ?? null);
        setTargetGroupId(currentGroup == null ? "" : String(currentGroup.id));
        setConfirmedAssignedDeletion(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          setMessage(error.message || "Unable to load tag configuration.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [performerSlotsEnabled, tagId]);

  function updateDefinition(index, values) {
    setModel({
      ...model,
      definitions: model.definitions.map((definition, definitionIndex) =>
        definitionIndex === index ? { ...definition, ...values } : definition),
    });
  }

  function moveDefinition(index, offset) {
    const target = index + offset;
    if (target < 0 || target >= model.definitions.length) return;
    const definitions = [...model.definitions];
    [definitions[index], definitions[target]] = [definitions[target], definitions[index]];
    setModel({
      ...model,
      definitions: definitions.map((definition, sortOrder) => ({ ...definition, sortOrder })),
    });
  }

  function deleteDefinition(index) {
    const definition = model.definitions[index];
    const assignments = Number(definition.assignmentCount) || 0;
    const assignmentCopy = assignments === 0
      ? ""
      : ` and its ${assignments} assignment${assignments === 1 ? "" : "s"}`;
    if (!window.confirm(`Delete “${performerSlotLabel(definition)}”${assignmentCopy}?`)) return;
    if (assignments > 0) setConfirmedAssignedDeletion(true);
    setModel({
      ...model,
      definitions: model.definitions
        .filter((_, definitionIndex) => definitionIndex !== index)
        .map((item, sortOrder) => ({ ...item, sortOrder })),
    });
  }

  async function saveSlots() {
    setBusySection("slots");
    setMessage("Saving performer slots…");
    let saved;
    try {
      saved = await requestJson(`/slot-definitions/${tagId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: model.revision,
          allowSamePerformerInMultipleSlots: Boolean(model.allowSamePerformerInMultipleSlots),
          confirmDeleteAssigned: confirmedAssignedDeletion,
          definitions: model.definitions.map((definition, sortOrder) => ({
            id: definition.id || undefined,
            label: definition.label?.trim() || null,
            sortOrder,
            genderHints: definition.genderHints || [],
          })),
        }),
      });
      setModel(saved);
      setConfirmedAssignedDeletion(false);
    } catch (error) {
      if (error.status === 409) {
        setMessage("Performer slots changed elsewhere; current values were reloaded.");
        if (error.payload?.current) {
          setModel(error.payload.current);
          setConfirmedAssignedDeletion(false);
        }
      } else {
        setMessage(error.message || "Unable to save performer slots.");
      }
      setBusySection(null);
      return;
    }
    try {
      await onSaved();
      setMessage("Performer slots saved.");
    } catch {
      setMessage("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      setBusySection(null);
    }
  }

  async function saveGroup() {
    const targetGroup = targetGroupId === "" ? null : Number(targetGroupId);
    if (targetGroup === currentGroupId) return;
    setBusySection("group");
    setMessage("Saving tag group…");
    try {
      await requestJson(`/segment-groups/tags/${tagId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: targetGroup }),
      });
    } catch (error) {
      setMessage(error.message || "Unable to assign the tag group.");
      setBusySection(null);
      return;
    }
    try {
      const [catalogResult, editorResult] = await Promise.allSettled([
        requestJson("/segment-groups"),
        onSaved(),
      ]);
      if (catalogResult.status === "fulfilled") {
        setSegmentGroups(catalogResult.value);
        const assignedGroup = catalogResult.value.find((group) =>
          (group.tags || []).some((tag) => Number(tag.tagId) === Number(tagId)));
        const assignedGroupId = assignedGroup?.id ?? null;
        setCurrentGroupId(assignedGroupId);
        setTargetGroupId(assignedGroupId == null ? "" : String(assignedGroupId));
      }
      setMessage(
        catalogResult.status === "fulfilled" && editorResult.status === "fulfilled"
          ? "Tag group saved."
          : "Tag group saved, but the configuration could not be fully refreshed.",
      );
    } finally {
      setBusySection(null);
    }
  }

  const currentGroup = segmentGroups.find((group) => Number(group.id) === Number(currentGroupId));
  const buttonClass = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return h("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (event) => { if (event.target === event.currentTarget && !busySection) onClose(); },
    onKeyDownCapture: (event) => handleModalKey(event, {
      onCancel: busySection ? undefined : onClose,
    }),
  }, h("section", {
    ref: dialogRef,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: trapModalFocus,
    className: "flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
  }, [
    h("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      h("h2", {
        key: "title",
        id: "segment-studio-inline-tag-configuration-title",
        className: "text-lg font-semibold text-foreground",
      }, `Configure Tag: ${tagName}`),
      h("p", { key: "description", className: "mt-1 text-sm text-secondary" },
        performerSlotsEnabled
          ? "Assign this tag to a Cove tag group and configure its performer roles."
          : "Assign this tag to a Cove tag group."),
    ]),
    h("div", { key: "body", className: "min-h-0 flex-1 space-y-5 overflow-y-auto p-5" }, [
      h("section", { key: "group", className: "space-y-3", "aria-labelledby": "inline-tag-segment-group-heading" }, [
        h("div", { key: "heading" }, [
          h("h3", { key: "title", id: "inline-tag-segment-group-heading", className: "text-sm font-semibold text-foreground" }, "Cove tag group"),
          h("p", { key: "copy", className: "text-xs text-secondary" },
            "Choose where this tag appears in the swimlane hierarchy."),
        ]),
        !loading ? h("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          h("span", { key: "label" }, "Assigned group"),
          h("select", {
            key: "select",
            value: targetGroupId,
            disabled: busySection != null,
            onChange: (event) => setTargetGroupId(event.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
          }, [
            h("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...segmentGroups.map((group) =>
              h("option", { key: group.id, value: String(group.id) }, group.name)),
          ]),
        ]) : null,
        !loading ? h("button", {
          key: "save",
          type: "button",
          disabled: busySection != null || (targetGroupId === "" ? null : Number(targetGroupId)) === currentGroupId,
          onClick: saveGroup,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50",
        }, busySection === "group" ? "Saving…" : "Save tag group") : null,
      ]),
      performerSlotsEnabled ? h("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        h("div", { key: "heading" }, [
          h("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          h("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag."),
        ]),
        loading
          ? h("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…")
          : model ? h("div", { key: "editor", className: "space-y-3" }, [
              h("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
                h("input", {
                  key: "input",
                  type: "checkbox",
                  checked: Boolean(model.allowSamePerformerInMultipleSlots),
                  disabled: busySection != null,
                  onChange: (event) => setModel({ ...model, allowSamePerformerInMultipleSlots: event.target.checked }),
                }),
                h("span", { key: "label" }, "Allow the same performer in multiple slots"),
              ]),
              ...(model.definitions || []).map((definition, index) => h("article", {
                key: definition.id || definition._clientKey,
                className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]",
              }, [
                h("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
                  h("span", { key: "label" }, "Slot label"),
                  h("input", {
                    key: "input",
                    value: definition.label || "",
                    disabled: busySection != null,
                    onChange: (event) => updateDefinition(index, { label: event.target.value }),
                    className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm",
                  }),
                ]),
                h("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
                  h("legend", { key: "label" }, "Gender hints"),
                  h("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, GENDER_HINTS.map((hint) =>
                    h("label", { key: hint, className: "inline-flex items-center gap-1" }, [
                      h("input", {
                        key: "input",
                        type: "checkbox",
                        disabled: busySection != null,
                        checked: (definition.genderHints || []).includes(hint),
                        onChange: (event) => updateDefinition(index, {
                          genderHints: event.target.checked
                            ? [...new Set([...(definition.genderHints || []), hint])]
                            : (definition.genderHints || []).filter((value) => value !== hint),
                        }),
                      }),
                      h("span", { key: "text" }, formatGenderHint(hint)),
                    ]))),
                ]),
                h("div", { key: "actions", className: "flex items-end gap-1" }, [
                  h("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${definition.assignmentCount || 0} assigned`),
                  h("button", { key: "up", type: "button", disabled: busySection != null || index === 0, onClick: () => moveDefinition(index, -1), className: buttonClass, "aria-label": `Move ${performerSlotLabel(definition)} up` }, "↑"),
                  h("button", { key: "down", type: "button", disabled: busySection != null || index === model.definitions.length - 1, onClick: () => moveDefinition(index, 1), className: buttonClass, "aria-label": `Move ${performerSlotLabel(definition)} down` }, "↓"),
                  h("button", { key: "delete", type: "button", disabled: busySection != null, onClick: () => deleteDefinition(index), className: `${buttonClass} text-red-300` }, "Delete"),
                ]),
              ])),
              h("div", { key: "buttons", className: "flex items-center gap-2" }, [
                h("button", {
                  key: "add",
                  type: "button",
                  disabled: busySection != null,
                  onClick: () => setModel({
                    ...model,
                    definitions: [...model.definitions, {
                      _clientKey: `new-${++newSlotKeyRef.current}`,
                      label: "",
                      sortOrder: model.definitions.length,
                      genderHints: [],
                      assignmentCount: 0,
                    }],
                  }),
                  className: buttonClass,
                }, "Add slot"),
                h("button", {
                  key: "save",
                  type: "button",
                  disabled: busySection != null,
                  onClick: saveSlots,
                  className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50",
                }, busySection === "slots" ? "Saving…" : "Save performer slots"),
              ]),
            ]) : null,
      ]) : null,
      message ? h("p", { key: "message", role: "status", className: "text-sm text-secondary" }, message) : null,
    ]),
    h("footer", { key: "footer", className: "flex items-center justify-end border-t border-border px-5 py-4" },
      h("button", {
        type: "button",
        disabled: busySection != null,
        onClick: onClose,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50",
      }, "Close")),
  ]));
}

export { InlineTagConfigurationDialog };
