import { h, useEffect, useRef, useState } from "../shared/runtime.js";

import { REVIEW_STATES } from "../shared/constants.js";

import { requestJson } from "../shared/api.js";

import { generatePerformerSlotAssignmentRecommendations, performerOptionId, rankPerformerOptions, videoPerformerOptions, videoPerformerSlotAssignments } from "../discovery/model.js";

import { SEGMENT_STATE_PRESENTATION, SLOT_STATUS_PRESENTATION, segmentBadgeStyle } from "../shared/presentation.js";

import { formatGenderHint, performerSlotHistoryState, performerSlotLabel } from "./model/history.js";

function ReviewButton({ state, active, disabled, onClick }) {
  const labels = { approved: "Approve", rejected: "Reject", unreviewed: "Unreview" };
  return h("button", {
    type: "button",
    disabled,
    onClick,
    "aria-pressed": active,
    className: `rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${active ? "" : "border-border bg-card text-foreground hover:bg-muted/40"}`,
    style: active ? segmentBadgeStyle(state) : undefined,
  }, labels[state]);
}

function PerformerSlotStatusBadge({ status }) {
  const presentation = SLOT_STATUS_PRESENTATION[status];
  if (!presentation) return null;
  return h("span", {
    "aria-label": `Slot status: ${status}`,
    className: "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: {
      borderColor: presentation.color,
      backgroundColor: presentation.backgroundColor,
      color: "var(--color-foreground)",
    },
  }, "Slots unfilled");
}

function LaneReviewCounts({ counts }) {
  return h("span", {
    role: "img",
    "aria-label": `${counts.unreviewed} unreviewed, ${counts.approved} approved, ${counts.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]",
  }, REVIEW_STATES.map((state) => h("span", {
    key: state,
    className: "rounded px-1 py-0.5",
    style: {
      ...segmentBadgeStyle(state),
      filter: counts[state] > 0 ? "saturate(1)" : "saturate(0.25)",
    },
    title: `${counts[state]} ${state}`,
  }, `${SEGMENT_STATE_PRESENTATION[state].symbol}${counts[state]}`)));
}

function PerformerSlotAssignmentEditor({ videoId, segmentId, itemId, slots, revision, performerCandidates, onSaved, onConflict, confirmRef, shortcutRef }) {
  const videoPerformers = videoPerformerOptions(performerCandidates);
  const [assignments, setAssignments] = useState(() => videoPerformerSlotAssignments(slots, videoPerformers));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const savingRef = useRef(false);
  const slotIdentity = slots.map((slot) => `${slot.slotDefinitionId}:${slot.performerId || ""}`).join("|");
  const videoPerformerIdentity = videoPerformers.map((performer) => performerOptionId(performer)).join("|");
  const recommendations = generatePerformerSlotAssignmentRecommendations(
    slots,
    videoPerformers,
  );

  useEffect(() => {
    setAssignments(videoPerformerSlotAssignments(slots, videoPerformers));
    setMessage("");
  }, [segmentId, itemId, slotIdentity, videoPerformerIdentity]);

  async function save(nextAssignments = assignments) {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setMessage("Saving performer slots…");
    try {
      const sanitizedAssignments = videoPerformerSlotAssignments(slots.map((slot) => ({
        ...slot,
        performerId: nextAssignments[slot.slotDefinitionId] || null,
      })), videoPerformers);
      const saved = await requestJson(itemId != null
        ? `/videos/${videoId}/drafts/${itemId}/slots`
        : `/videos/${videoId}/segments/${segmentId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision,
          assignments: slots.map((slot) => ({ slotDefinitionId: slot.slotDefinitionId, performerId: sanitizedAssignments[slot.slotDefinitionId] ? Number(sanitizedAssignments[slot.slotDefinitionId]) : null })),
        }),
      });
      setMessage("Performer slots saved.");
      onSaved(saved, {
        beforeState: performerSlotHistoryState([{
          segmentId,
          itemId,
          revision,
          slots,
        }]),
        afterState: performerSlotHistoryState([{
          segmentId,
          itemId,
          revision: saved.revision,
          slots: saved.slots || [],
        }]),
      });
    } catch (error) {
      if (error.status === 409) { setMessage("Slot definitions or assignments changed; current values were reloaded."); onConflict(); }
      else setMessage(error.message || "Unable to save performer slots.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  function applyRecommendation(recommendation, index) {
    setMessage(`Option ${index + 1} applied; save to confirm.`);
    setAssignments({ ...assignments, ...recommendation.assignments });
  }

  async function applyAndSaveRecommendation(recommendation) {
    const nextAssignments = { ...assignments, ...recommendation.assignments };
    setAssignments(nextAssignments);
    await save(nextAssignments);
  }

  useEffect(() => {
    if (!shortcutRef) return undefined;
    shortcutRef.current = (index) => {
      if (savingRef.current || !recommendations[index]) return false;
      void applyAndSaveRecommendation(recommendations[index]);
      return true;
    };
    return () => { shortcutRef.current = null; };
  });

  return h("div", { className: "space-y-2" }, [
    recommendations.length ? h("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      h("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      h("div", { key: "options", className: "space-y-2" }, recommendations.map((recommendation, index) =>
        h("button", {
          key: index,
          type: "button",
          disabled: saving,
          onClick: () => applyRecommendation(recommendation, index),
          className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
          "aria-label": `Apply option ${index + 1}: ${recommendation.description}`,
        }, [
          h("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, index + 1),
          h("span", { key: "description" }, recommendation.description),
        ]))),
      h("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${recommendations.length} to apply and save`),
    ]) : null,
    h("div", { key: "slots", className: "grid gap-2" }, slots.map((slot) => h("label", { key: slot.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      h("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, performerSlotLabel(slot)),
      (slot.genderHints || []).length ? h("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(slot.genderHints || []).map(formatGenderHint).join(" · ")}`) : null,
      h("select", { key: "select", value: assignments[slot.slotDefinitionId] || "", disabled: saving, onChange: (event) => setAssignments({ ...assignments, [slot.slotDefinitionId]: event.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        h("option", { key: "clear", value: "" }, "No performer assigned"),
        ...rankPerformerOptions(videoPerformers, videoPerformers, slot.genderHints)
          .map((performer) => h("option", { key: performerOptionId(performer), value: performerOptionId(performer) }, performer.name)),
      ]),
    ]))),
    h("div", { key: "actions", className: "flex items-center gap-3" }, [h("button", { key: "save", ref: confirmRef, type: "button", disabled: saving, onClick: () => save(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), h("span", { key: "message", role: "status", className: "text-xs text-secondary" }, message)]),
  ]);
}

function MultiPerformerSlotAssignmentEditor({ videoId, targets, performerCandidates, onSaved, onConflict }) {
  const commonSlots = targets[0]?.slots || [];
  const videoPerformers = videoPerformerOptions(performerCandidates);
  const mixedValue = "__mixed__";
  const initialAssignments = () => Object.fromEntries(commonSlots.map((slot, index) => {
    const performerIds = targets.map((target) => String(target.slots[index]?.performerId || ""));
    return [slot.slotDefinitionId, performerIds.every((id) => id === performerIds[0]) ? performerIds[0] : mixedValue];
  }));
  const [assignments, setAssignments] = useState(initialAssignments);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const savingRef = useRef(false);
  const targetIdentity = targets.map((target) =>
    `${target.itemId ?? `native:${target.segmentId}`}:${target.revision}:${target.slots.map((slot) => `${slot.slotDefinitionId}:${slot.performerId || ""}`).join(",")}`)
    .join("|");

  useEffect(() => {
    setAssignments(initialAssignments());
  }, [targetIdentity]);

  async function save() {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setMessage(`Saving performer slots for ${targets.length} segments…`);
    const savedTargets = [];
    try {
      for (const target of targets) {
        const targetAssignments = target.slots.map((slot, index) => {
          const selected = assignments[commonSlots[index].slotDefinitionId];
          return {
            slotDefinitionId: slot.slotDefinitionId,
            performerId: selected === mixedValue
              ? slot.performerId || null
              : selected ? Number(selected) : null,
          };
        });
        const saved = await requestJson(target.itemId != null
          ? `/videos/${videoId}/drafts/${target.itemId}/slots`
          : `/videos/${videoId}/segments/${target.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: target.revision, assignments: targetAssignments }),
        });
        savedTargets.push({
          segmentId: target.segmentId,
          itemId: target.itemId,
          revision: saved.revision,
          slots: saved.slots || [],
        });
      }
      setMessage("Performer slots saved.");
      onSaved({
        beforeState: performerSlotHistoryState(targets),
        afterState: performerSlotHistoryState(savedTargets),
      });
    } catch (error) {
      const reloaded = await onConflict();
      if (error.status === 409) {
        setMessage(reloaded
          ? "Slot definitions or assignments changed; current values were reloaded."
          : "Slot definitions or assignments changed, but the latest values could not be reloaded.");
      } else {
        setMessage(error.message || (reloaded
          ? "The completed assignments were reloaded after a partial save."
          : "Some assignments may have saved, but the latest values could not be reloaded."));
      }
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return h("div", { className: "space-y-3" }, [
    h("p", { key: "scope", className: "text-xs text-secondary" },
      `Changes apply to all ${targets.length} selected segments. Mixed values remain unchanged unless replaced.`),
    h("div", { key: "slots", className: "grid gap-2" }, commonSlots.map((slot) => h("label", {
      key: slot.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary",
    }, [
      h("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, performerSlotLabel(slot)),
      h("select", {
        key: "select",
        value: assignments[slot.slotDefinitionId] || "",
        disabled: saving,
        onChange: (event) => setAssignments({ ...assignments, [slot.slotDefinitionId]: event.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground",
      }, [
        assignments[slot.slotDefinitionId] === mixedValue
          ? h("option", { key: "mixed", value: mixedValue }, "Mixed — leave unchanged") : null,
        h("option", { key: "clear", value: "" }, "No performer assigned"),
        ...rankPerformerOptions(videoPerformers, videoPerformers, slot.genderHints)
          .map((performer) => h("option", {
            key: performerOptionId(performer),
            value: performerOptionId(performer),
          }, performer.name)),
      ]),
    ]))),
    h("div", { key: "actions", className: "flex items-center gap-3" }, [
      h("button", {
        key: "save",
        type: "button",
        disabled: saving,
        onClick: save,
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50",
      }, "Save performer slots"),
      h("span", { key: "message", role: "status", className: "text-xs text-secondary" }, message),
    ]),
  ]);
}

export { ReviewButton, PerformerSlotStatusBadge, LaneReviewCounts, PerformerSlotAssignmentEditor, MultiPerformerSlotAssignmentEditor };
