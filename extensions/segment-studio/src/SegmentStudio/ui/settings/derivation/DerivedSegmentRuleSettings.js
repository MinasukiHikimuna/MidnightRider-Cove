import { h, useEffect, useId, useMemo, useRef, useState } from "../../shared/runtime.js";

import { completeOperation, operationIdFor, requestJson } from "../../shared/api.js";

import { applyDerivationRuleSlotSuggestions } from "../../editor/model/history.js";

import { buildDerivationRuleGraph, derivationRuleNameCompare, layoutDerivationRuleComponents, resolveSelectedDerivationRule, validateDerivationRuleDraft } from "./model.js";

import { DerivedSegmentRuleSettingsView } from "./DerivedSegmentRuleSettingsView.js";

function DerivedSegmentRuleSettings({ segmentGroups = [], onSegmentGroupsChanged }) {
  const emptyDraft = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: false,
  });
  const [rules, setRules] = useState([]);
  const [draft, setDraft] = useState(null);
  const [sourceSlots, setSourceSlots] = useState([]);
  const [derivedSlots, setDerivedSlots] = useState([]);
  const [sourceSlotsLoading, setSourceSlotsLoading] = useState(false);
  const [derivedSlotsLoading, setDerivedSlotsLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("graph");
  const [segmentGroupKey, setSegmentGroupKey] = useState("all");
  const [selection, setSelection] = useState(null);
  const [listSort, setListSort] = useState("relationship");
  const [materializationOffer, setMaterializationOffer] = useState(null);
  const [configuringTag, setConfiguringTag] = useState(null);
  const editorRef = useRef(null);
  const suggestedSlotPairRef = useRef(null);
  const arrowMarkerId = useId().replace(/:/g, "");

  function revealEditor() {
    requestAnimationFrame(() => editorRef.current?.scrollIntoView({ block: "nearest" }));
  }

  async function loadRules(signal) {
    const loaded = await requestJson("/derivation-rules", signal ? { signal } : undefined);
    setRules(loaded || []);
  }

  useEffect(() => {
    const controller = new AbortController();
    loadRules(controller.signal)
      .catch((error) => { if (error.name !== "AbortError") setMessage(error.message || "Unable to load derived segment rules."); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (!draft?.sourceTagId) {
      setSourceSlots([]);
      setSourceSlotsLoading(false);
    } else {
      setSourceSlotsLoading(true);
      requestJson(`/slot-definitions/${draft.sourceTagId}`, { signal: controller.signal })
        .then((model) => setSourceSlots(model.definitions || []))
        .catch((error) => { if (error.name !== "AbortError") setSourceSlots([]); })
        .finally(() => { if (!controller.signal.aborted) setSourceSlotsLoading(false); });
    }
    if (!draft?.derivedTagId) {
      setDerivedSlots([]);
      setDerivedSlotsLoading(false);
    } else {
      setDerivedSlotsLoading(true);
      requestJson(`/slot-definitions/${draft.derivedTagId}`, { signal: controller.signal })
        .then((model) => setDerivedSlots(model.definitions || []))
        .catch((error) => { if (error.name !== "AbortError") setDerivedSlots([]); })
        .finally(() => { if (!controller.signal.aborted) setDerivedSlotsLoading(false); });
    }
    return () => controller.abort();
  }, [draft?.sourceTagId, draft?.derivedTagId]);

  useEffect(() => {
    if (!draft?.sourceTagId || !draft?.derivedTagId || draft.ruleId != null
        || sourceSlotsLoading || derivedSlotsLoading)
      return;
    const pairKey = `${draft.sourceTagId}:${draft.derivedTagId}`;
    if (suggestedSlotPairRef.current === pairKey) return;
    suggestedSlotPairRef.current = pairKey;
    setDraft((current) => {
      if (!current
          || Number(current.sourceTagId) !== Number(draft.sourceTagId)
          || Number(current.derivedTagId) !== Number(draft.derivedTagId))
        return current;
      return applyDerivationRuleSlotSuggestions(current, sourceSlots, derivedSlots);
    });
  }, [
    draft?.ruleId,
    draft?.sourceTagId,
    draft?.derivedTagId,
    sourceSlots,
    derivedSlots,
    sourceSlotsLoading,
    derivedSlotsLoading,
  ]);

  function editRule(rule, preserveSelection = false) {
    if (!preserveSelection) setSelection({ type: "rule", id: rule.id });
    suggestedSlotPairRef.current = null;
    setDraft({
      ruleId: rule.id,
      sourceTagId: rule.sourceTagId,
      sourceTagName: rule.sourceTagName,
      derivedTagId: rule.derivedTagId,
      derivedTagName: rule.derivedTagName,
      slotMappings: rule.slotMappings.map((mapping) => ({
        sourceSlotDefinitionId: mapping.sourceSlotDefinitionId,
        derivedSlotDefinitionId: mapping.derivedSlotDefinitionId,
      })),
      slotMappingsSuggested: false,
    });
    setMessage("");
    revealEditor();
  }

  function updateTag(kind, tagId, tagName = "") {
    suggestedSlotPairRef.current = null;
    if (kind === "source") {
      setSourceSlots([]);
      setSourceSlotsLoading(tagId != null);
    } else {
      setDerivedSlots([]);
      setDerivedSlotsLoading(tagId != null);
    }
    setDraft((current) => ({
      ...current,
      [`${kind}TagId`]: tagId == null ? null : Number(tagId),
      [`${kind}TagName`]: tagName || "",
      slotMappings: [],
      slotMappingsSuggested: false,
    }));
  }

  async function refreshConfiguredTag(configuredTag) {
    if (draft?.ruleId == null) suggestedSlotPairRef.current = null;
    const tasks = [loadRules(), onSegmentGroupsChanged?.()];
    if (configuredTag.draftKind === "source") {
      setSourceSlotsLoading(true);
      tasks.push(requestJson(`/slot-definitions/${configuredTag.tagId}`)
        .then((model) => setSourceSlots(model.definitions || []))
        .finally(() => setSourceSlotsLoading(false)));
    } else if (configuredTag.draftKind === "derived") {
      setDerivedSlotsLoading(true);
      tasks.push(requestJson(`/slot-definitions/${configuredTag.tagId}`)
        .then((model) => setDerivedSlots(model.definitions || []))
        .finally(() => setDerivedSlotsLoading(false)));
    }
    return Promise.all(tasks);
  }

  function updateMapping(index, key, value) {
    setDraft((current) => ({
      ...current,
      slotMappings: current.slotMappings.map((mapping, mappingIndex) =>
        mappingIndex === index ? { ...mapping, [key]: value } : mapping),
    }));
  }

  async function save() {
    if (!draft?.sourceTagId || !draft?.derivedTagId) return;
    const issue = validateDerivationRuleDraft(draft, rules);
    if (issue) {
      setMessage(issue.message);
      return;
    }
    if (draft.slotMappings.some((mapping) =>
      !mapping.sourceSlotDefinitionId || !mapping.derivedSlotDefinitionId)) {
      setMessage("Complete or remove every performer slot mapping before saving.");
      return;
    }
    setBusy(true);
    setMessage(draft.ruleId == null
      ? "Saving derived segment rule…"
      : "Previewing materializations that must be removed…");
    try {
      let cleanupFingerprint = null;
      if (draft.ruleId != null) {
        const cleanup = await requestJson(
          `/derivation-rules/${draft.ruleId}/deletion/preview`,
          { method: "POST" },
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.\n\n`
          + `Deleted segments: ${cleanup.deletedSegmentCount}\n`
          + `Removed lineage edges: ${cleanup.removedEdgeCount}\n`
          + `Shared derived segments retained: ${cleanup.retainedSharedSegmentCount}\n\n`
          + "Continue saving?",
        )) return;
        cleanupFingerprint = cleanup.fingerprint;
      }
      setMessage("Saving derived segment rule…");
      const saved = await requestJson("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: draft.ruleId,
          sourceTagId: draft.sourceTagId,
          derivedTagId: draft.derivedTagId,
          slotMappings: draft.slotMappings,
          cleanupFingerprint,
        }),
      });
      await loadRules();
      setSelection(view === "graph"
        ? { type: "node", id: Number(saved.sourceTagId) }
        : { type: "rule", id: saved.id });
      setDraft(null);
      if (draft.ruleId == null) {
        try {
          const preview = await requestJson(
            `/derivation-rules/${saved.id}/materialization/preview`,
            { method: "POST" },
          );
          setMaterializationOffer(
            preview.createCount + preview.linkCount > 0 ? preview : null);
          setMessage(preview.createCount + preview.linkCount > 0
            ? "Rule saved. Its pending derivations can be materialized now or later."
            : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          setMaterializationOffer(null);
          setMessage("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      } else {
        setMaterializationOffer(null);
        setMessage("Derived segment rule saved. Previous materializations were removed.");
      }
    } catch (error) {
      setMessage(error.message || "Unable to save derived segment rule.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteRule(rule) {
    setBusy(true);
    setMessage("Previewing rule deletion…");
    try {
      const preview = await requestJson(
        `/derivation-rules/${rule.id}/deletion/preview`,
        { method: "POST" },
      );
      if (!window.confirm(
        `Delete ${rule.sourceTagName} → ${rule.derivedTagName}?\n\n`
        + `Deleted segments: ${preview.deletedSegmentCount}\n`
        + `Removed lineage edges: ${preview.removedEdgeCount}\n`
        + `Shared derived segments retained: ${preview.retainedSharedSegmentCount}\n\n`
        + "This cannot be undone.",
      )) return;
      const operationKey = `derivation-rule-delete:${rule.id}:${preview.fingerprint}`;
      await requestJson(`/derivation-rules/${rule.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: operationIdFor(operationKey),
          fingerprint: preview.fingerprint,
        }),
      });
      completeOperation(operationKey);
      await loadRules();
      if (draft?.ruleId === rule.id) setDraft(null);
      if (selection?.type === "rule" && selection.id === rule.id) setSelection(null);
      if (materializationOffer?.ruleId === rule.id) setMaterializationOffer(null);
      setMessage(`Rule deleted with ${preview.deletedSegmentCount} exclusively derived segment${preview.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (error) {
      setMessage(error.message || "Unable to delete derived segment rule.");
    } finally {
      setBusy(false);
    }
  }

  async function executeRuleMaterialization(rule, offeredPreview = null) {
    const preview = offeredPreview || await requestJson(
      `/derivation-rules/${rule.id}/materialization/preview`,
      { method: "POST" },
    );
    if (preview.createCount + preview.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };

    const operationKey = `derivation-rule-materialize:${rule.id}:${preview.fingerprint}`;
    const result = await requestJson(`/derivation-rules/${rule.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: operationIdFor(operationKey),
        fingerprint: preview.fingerprint,
      }),
    });
    completeOperation(operationKey);
    return result;
  }

  async function materializeRule(rule, offeredPreview = null) {
    setBusy(true);
    setMessage("Finding pending derivations…");
    try {
      const result = await executeRuleMaterialization(rule, offeredPreview);
      setMaterializationOffer(null);
      await loadRules();
      if (result.createdCount + result.linkedCount === 0) {
        setMessage("Every applicable derivation is already materialized.");
        return;
      }
      setMessage(
        `${result.createdCount} derived segment${result.createdCount === 1 ? "" : "s"} created`
        + ` and ${result.linkedCount} existing segment${result.linkedCount === 1 ? "" : "s"} linked.`,
      );
    } catch (error) {
      setMessage(error.message || "Unable to materialize pending derivations.");
    } finally {
      setBusy(false);
    }
  }

  async function materializeOutgoingRules(node, outgoingRules) {
    if (outgoingRules.length === 0) return;
    setBusy(true);
    setMessage(`Finding pending derivations from ${node.name}…`);
    let createdCount = 0;
    let linkedCount = 0;
    try {
      for (const rule of outgoingRules) {
        const result = await executeRuleMaterialization(rule);
        createdCount += result.createdCount;
        linkedCount += result.linkedCount;
      }
      setMaterializationOffer(null);
      await loadRules();
      setMessage(createdCount + linkedCount === 0
        ? `Every outgoing derivation from ${node.name} is already materialized.`
        : `${createdCount} derived segment${createdCount === 1 ? "" : "s"} created`
          + ` and ${linkedCount} existing segment${linkedCount === 1 ? "" : "s"} linked`
          + ` from ${node.name}.`);
    } catch (error) {
      await loadRules().catch(() => {});
      setMessage(error.message || `Unable to materialize derivations from ${node.name}.`);
    } finally {
      setBusy(false);
    }
  }

  const draftIssue = validateDerivationRuleDraft(draft, rules);
  const graph = useMemo(
    () => buildDerivationRuleGraph(rules, segmentGroups),
    [rules, segmentGroups],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const groupFilteredComponents = graph.components.filter((component) =>
    segmentGroupKey === "all" || component.segmentGroupKeys.includes(segmentGroupKey));
  const visibleComponents = groupFilteredComponents.filter((component) =>
    !normalizedQuery || component.nodes.some((node) =>
      node.name.toLocaleLowerCase().includes(normalizedQuery)));
  const visibleRules = visibleComponents.flatMap((component) => component.rules);
  const visibleTagIds = new Set(
    visibleComponents.flatMap((component) => component.nodes.map((node) => node.tagId)),
  );
  const layout = useMemo(
    () => layoutDerivationRuleComponents(visibleComponents),
    [visibleComponents],
  );
  const selectedRule = view === "list"
    ? resolveSelectedDerivationRule(
        selection,
        visibleRules,
        normalizedQuery.length > 0,
      )
    : null;
  const selectedNode = selection?.type === "node"
    ? graph.nodes.find((node) =>
      node.tagId === selection.id && visibleTagIds.has(node.tagId)) || null
    : null;
  const sortedVisibleRules = [...visibleRules].sort((left, right) => {
    if (listSort === "source")
      return derivationRuleNameCompare(left.sourceTagName, right.sourceTagName)
        || derivationRuleNameCompare(left.derivedTagName, right.derivedTagName);
    if (listSort === "target")
      return derivationRuleNameCompare(left.derivedTagName, right.derivedTagName)
        || derivationRuleNameCompare(left.sourceTagName, right.sourceTagName);
    if (listSort === "materialized")
      return (Number(right.edgeCount) || 0) - (Number(left.edgeCount) || 0)
        || derivationRuleNameCompare(left.sourceTagName, right.sourceTagName);
    return derivationRuleNameCompare(
      `${left.sourceTagName} ${left.derivedTagName}`,
      `${right.sourceTagName} ${right.derivedTagName}`,
    );
  });
  const buttonClass = "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50";
  return h(DerivedSegmentRuleSettingsView, {
    arrowMarkerId,
    busy,
    buttonClass,
    configuringTag,
    deleteRule,
    derivedSlots,
    derivedSlotsLoading,
    draft,
    draftIssue,
    editRule,
    editorRef,
    emptyDraft,
    graph,
    layout,
    listSort,
    materializationOffer,
    materializeOutgoingRules,
    materializeRule,
    message,
    normalizedQuery,
    query,
    refreshConfiguredTag,
    revealEditor,
    rules,
    save,
    segmentGroupKey,
    selectedNode,
    selectedRule,
    selection,
    setConfiguringTag,
    setDraft,
    setListSort,
    setMaterializationOffer,
    setQuery,
    setSegmentGroupKey,
    setSelection,
    setView,
    sortedVisibleRules,
    sourceSlots,
    sourceSlotsLoading,
    updateMapping,
    updateTag,
    view,
    visibleComponents,
    visibleRules,
  });
}

export { DerivedSegmentRuleSettings };
