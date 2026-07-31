import { EntityReferenceSelector, h } from "../../shared/runtime.js";
import { performerSlotLabel } from "../../editor/model/history.js";
import { InlineTagConfigurationDialog } from "../../editor/dialogs/InlineTagConfigurationDialog.js";

function DerivedSegmentRuleSettingsView(props) {
  const { arrowMarkerId, busy, buttonClass, configuringTag, deleteRule, derivedSlots, derivedSlotsLoading, draft, draftIssue, editRule, editorRef, emptyDraft, graph, layout, listSort, materializationOffer, materializeOutgoingRules, materializeRule, message, normalizedQuery, query, refreshConfiguredTag, revealEditor, rules, save, segmentGroupKey, selectedNode, selectedRule, selection, setConfiguringTag, setDraft, setListSort, setMaterializationOffer, setQuery, setSegmentGroupKey, setSelection, setView, sortedVisibleRules, sourceSlots, sourceSlotsLoading, updateMapping, updateTag, view, visibleComponents, visibleRules } = props;

  function ruleGroupKey(rule) {
      const source = graph.nodes.find((node) => node.tagId === Number(rule.sourceTagId));
      const derived = graph.nodes.find((node) => node.tagId === Number(rule.derivedTagId));
      return source?.segmentGroupKey === derived?.segmentGroupKey
        ? source.segmentGroupKey
        : "cross-group";
    }

    function renderRuleEditor() {
      return h("div", { key: "editor", ref: editorRef, className: "space-y-4 p-4" }, [
        h("div", { key: "heading", className: "flex items-center justify-between gap-2" }, [
          h("div", { key: "copy" }, [
            h("h3", { key: "title", className: "font-semibold text-foreground" },
              draft.ruleId == null ? "Add derivation rule" : "Edit derivation rule"),
            h("p", { key: "description", className: "mt-1 text-xs text-secondary" },
              "Connect a specific tag to a more general tag."),
          ]),
          h("button", {
            key: "close",
            type: "button",
            disabled: busy,
            onClick: () => setDraft(null),
            className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
            "aria-label": "Close rule editor",
          }, "×"),
        ]),
        h("div", { key: "tags", className: "space-y-3" }, [
          h("div", { key: "source", className: "space-y-2" }, [
            h("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            h("span", { key: "label" }, "Source tag (specific)"),
            h(EntityReferenceSelector, {
              key: "selector",
              entityType: "tag",
              value: draft.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: draft.sourceTagName || undefined,
              onChange: (tagId, option) => updateTag("source", tagId, option?.label),
              disabled: busy,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: false,
              allowCreate: false,
            }),
            ]),
            draft.ruleId == null && draft.sourceTagId && !sourceSlotsLoading && sourceSlots.length === 0
              ? h("div", {
                  key: "missing-slots",
                  className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2",
                }, [
                  h("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
                  h("button", {
                    key: "configure",
                    type: "button",
                    disabled: busy,
                    onClick: (event) => setConfiguringTag({
                      tagId: draft.sourceTagId,
                      tagName: draft.sourceTagName || "Source tag",
                      draftKind: "source",
                      trigger: event.currentTarget,
                    }),
                    className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
                  }, "Configure source tag"),
                ])
              : null,
          ]),
          h("div", { key: "derived", className: "space-y-2" }, [
            h("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            h("span", { key: "label" }, "Derived tag (general)"),
            h(EntityReferenceSelector, {
              key: "selector",
              entityType: "tag",
              value: draft.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: draft.derivedTagName || undefined,
              onChange: (tagId, option) => updateTag("derived", tagId, option?.label),
              disabled: busy,
              placeholder: "Find a derived tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: false,
              allowCreate: false,
            }),
            ]),
            draft.ruleId == null && draft.derivedTagId && !derivedSlotsLoading && derivedSlots.length === 0
              ? h("div", {
                  key: "missing-slots",
                  className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2",
                }, [
                  h("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
                  h("button", {
                    key: "configure",
                    type: "button",
                    disabled: busy,
                    onClick: (event) => setConfiguringTag({
                      tagId: draft.derivedTagId,
                      tagName: draft.derivedTagName || "Derived tag",
                      draftKind: "derived",
                      trigger: event.currentTarget,
                    }),
                    className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
                  }, "Configure derived tag"),
                ])
              : null,
          ]),
        ]),
        draftIssue
          ? h("p", {
              key: "integrity",
              role: "alert",
              className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200",
            }, draftIssue.message)
          : null,
        h("div", { key: "mappings", className: "space-y-2" }, [
          h("div", { key: "heading", className: "flex items-center justify-between gap-2" }, [
            h("h3", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
            h("button", {
              key: "add",
              type: "button",
              disabled: busy || sourceSlots.length === 0 || derivedSlots.length === 0,
              onClick: () => setDraft((current) => ({
                ...current,
                slotMappings: [...current.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }],
              })),
              className: buttonClass,
            }, "Add mapping"),
          ]),
          draft.slotMappings.length === 0
            ? h("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots will be copied.")
            : h("div", { key: "configured", className: "space-y-2" }, [
              draft.slotMappingsSuggested
                ? h("p", { key: "suggested", className: "text-xs text-secondary" },
                    "Matching performer slots were suggested automatically.")
                : null,
              ...draft.slotMappings.map((mapping, index) => h("div", { key: index, className: "flex items-center gap-2" }, [
                h("select", {
                  key: "source",
                  value: mapping.sourceSlotDefinitionId,
                  disabled: busy,
                  onChange: (event) => updateMapping(index, "sourceSlotDefinitionId", event.target.value),
                  className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
                  "aria-label": `Source slot mapping ${index + 1}`,
                }, [h("option", { key: "none", value: "" }, "Source slot…"), ...sourceSlots.map((slot) =>
                  h("option", { key: slot.id, value: slot.id }, performerSlotLabel(slot)))]),
                h("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
                h("select", {
                  key: "derived",
                  value: mapping.derivedSlotDefinitionId,
                  disabled: busy,
                  onChange: (event) => updateMapping(index, "derivedSlotDefinitionId", event.target.value),
                  className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
                  "aria-label": `Derived slot mapping ${index + 1}`,
                }, [h("option", { key: "none", value: "" }, "Derived slot…"), ...derivedSlots.map((slot) =>
                  h("option", { key: slot.id, value: slot.id }, performerSlotLabel(slot)))]),
                h("button", {
                  key: "remove",
                  type: "button",
                  disabled: busy,
                  onClick: () => setDraft((current) => ({
                    ...current,
                    slotMappings: current.slotMappings.filter((_, mappingIndex) => mappingIndex !== index),
                  })),
                  className: `${buttonClass} shrink-0 text-red-300`,
                  "aria-label": `Remove performer slot mapping ${index + 1}`,
                  title: "Remove mapping",
                }, "🗑"),
              ])),
            ]),
        ]),
        h("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          h("button", {
            key: "save",
            type: "button",
            disabled: busy || !draft.sourceTagId || !draft.derivedTagId
              || draftIssue != null
              || draft.slotMappings.some((mapping) =>
                !mapping.sourceSlotDefinitionId || !mapping.derivedSlotDefinitionId),
            onClick: save,
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50",
          }, "Save rule"),
          h("button", { key: "cancel", type: "button", disabled: busy, onClick: () => setDraft(null), className: buttonClass }, "Cancel"),
        ]),
      ]);
    }

    function renderSelectionDetails() {
      if (selectedNode) {
        const incomingRules = visibleRules.filter((rule) =>
          Number(rule.derivedTagId) === selectedNode.tagId);
        const outgoingRules = visibleRules.filter((rule) =>
          Number(rule.sourceTagId) === selectedNode.tagId);
        const relationshipRow = (rule, direction, canMaterialize) => h("div", {
          key: rule.id,
          className: "space-y-2 rounded-md border border-border bg-card p-2",
        }, [
          h("div", {
            key: "relationship",
            className: "text-xs",
          }, [
            h("span", { key: "direction", className: "block text-secondary" }, direction),
            h("span", { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
              `${rule.sourceTagName} → ${rule.derivedTagName}`),
          ]),
          h("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
            canMaterialize ? h("button", {
              key: "materialize",
              type: "button",
              disabled: busy || draft != null,
              onClick: () => materializeRule(rule),
              className: buttonClass,
            }, "Materialize") : null,
            h("button", {
              key: "edit",
              type: "button",
              disabled: busy || draft != null,
              onClick: () => editRule(rule, true),
              className: buttonClass,
            }, "Edit rule"),
            h("button", {
              key: "delete",
              type: "button",
              disabled: busy || draft != null,
              onClick: () => deleteRule(rule),
              className: `${buttonClass} text-red-300`,
            }, "Delete"),
          ]),
        ]);
        return h("div", { key: "node-details", className: "space-y-4 p-4" }, [
          h("div", { key: "identity" }, [
            h("div", { key: "group", className: "text-xs font-medium text-accent" }, selectedNode.segmentGroupName),
            h("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, selectedNode.name),
            h("p", { key: "counts", className: "mt-1 text-xs text-secondary" },
              `${selectedNode.incomingRuleCount} incoming · ${selectedNode.outgoingRuleCount} outgoing`),
          ]),
          h("button", {
            key: "configure-tag",
            type: "button",
            disabled: busy || draft != null,
            onClick: (event) => setConfiguringTag({
              tagId: selectedNode.tagId,
              tagName: selectedNode.name,
              trigger: event.currentTarget,
            }),
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50",
          }, "Configure tag"),
          outgoingRules.length ? h("button", {
            key: "materialize-outgoing",
            type: "button",
            disabled: busy || draft != null,
            onClick: () => materializeOutgoingRules(selectedNode, outgoingRules),
            className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50",
          }, `Materialize outgoing (${outgoingRules.length})`) : null,
          outgoingRules.length ? h("div", { key: "outgoing", className: "space-y-2" }, [
            h("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
            ...outgoingRules.map((rule) => relationshipRow(rule, "Derives", true)),
          ]) : null,
          incomingRules.length ? h("details", {
            key: "incoming",
            className: "group rounded-md border border-border bg-card/40",
          }, [
            h("summary", {
              key: "summary",
              className: "flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-secondary hover:text-foreground",
            }, [
              h("span", { key: "title" }, "Incoming rules"),
              h("span", { key: "count", className: "rounded-full border border-border px-2 py-0.5 font-medium normal-case tracking-normal" },
                incomingRules.length),
            ]),
            h("div", { key: "rules", className: "space-y-2 border-t border-border p-2" },
              incomingRules.map((rule) => relationshipRow(rule, "Derived by", false))),
          ]) : null,
        ]);
      }
      if (!selectedRule) {
        return h("div", { key: "empty-details", className: "p-5 text-sm text-secondary" },
          "Select a tag or relationship to inspect it.");
      }
      const sourceNode = graph.nodes.find((node) => node.tagId === Number(selectedRule.sourceTagId));
      const derivedNode = graph.nodes.find((node) => node.tagId === Number(selectedRule.derivedTagId));
      return h("div", { key: "rule-details", className: "space-y-4 p-4" }, [
        h("div", { key: "identity" }, [
          h("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
            h("span", { key: "source" }, sourceNode?.segmentGroupName || "Ungrouped"),
            sourceNode?.segmentGroupKey !== derivedNode?.segmentGroupKey
              ? h("span", { key: "derived" }, `→ ${derivedNode?.segmentGroupName || "Ungrouped"}`)
              : null,
          ]),
          h("h3", { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
            `${selectedRule.sourceTagName} → ${selectedRule.derivedTagName}`),
          h("p", { key: "edges", className: "mt-2 text-sm text-secondary" },
            `${selectedRule.edgeCount} materialized lineage edge${selectedRule.edgeCount === 1 ? "" : "s"}`),
        ]),
        materializationOffer?.ruleId === selectedRule.id
          ? h("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
              h("p", { key: "summary", className: "text-sm font-medium text-foreground" },
                `${materializationOffer.createCount + materializationOffer.linkCount} pending derivation${materializationOffer.createCount + materializationOffer.linkCount === 1 ? "" : "s"}`),
              h("p", { key: "details", className: "text-xs text-secondary" },
                `${materializationOffer.createCount} new segments · ${materializationOffer.linkCount} existing segments to link`),
              h("div", { key: "actions", className: "flex gap-2" }, [
                h("button", {
                  key: "materialize",
                  type: "button",
                  disabled: busy,
                  onClick: () => materializeRule(selectedRule, materializationOffer),
                  className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50",
                }, "Materialize now"),
                h("button", {
                  key: "later",
                  type: "button",
                  disabled: busy,
                  onClick: () => setMaterializationOffer(null),
                  className: buttonClass,
                }, "Later"),
              ]),
            ])
          : null,
        h("div", { key: "mappings", className: "space-y-2" }, [
          h("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
          selectedRule.slotMappings.length === 0
            ? h("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.")
            : selectedRule.slotMappings.map((mapping, index) => h("div", {
                key: `${mapping.sourceSlotDefinitionId}:${mapping.derivedSlotDefinitionId}`,
                className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs",
              }, [
                h("span", { key: "source", className: "truncate text-foreground", title: mapping.sourceSlotLabel || "Unnamed slot" },
                  mapping.sourceSlotLabel || "Unnamed slot"),
                h("span", { key: "arrow", className: "text-secondary" }, "→"),
                h("span", { key: "derived", className: "truncate text-foreground", title: mapping.derivedSlotLabel || "Unnamed slot" },
                  mapping.derivedSlotLabel || "Unnamed slot"),
              ])),
        ]),
        h("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
          h("dt", { key: "created-label", className: "text-secondary" }, "Created"),
          h("dd", { key: "created", className: "text-right text-foreground" },
            selectedRule.createdAt ? new Date(selectedRule.createdAt).toLocaleDateString() : "Unknown"),
          h("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
          h("dd", { key: "updated", className: "text-right text-foreground" },
            selectedRule.updatedAt ? new Date(selectedRule.updatedAt).toLocaleDateString() : "Unknown"),
        ]),
        h("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          h("button", {
            key: "materialize",
            type: "button",
            disabled: busy || draft != null,
            onClick: () => materializeRule(selectedRule),
            className: buttonClass,
          }, "Materialize pending"),
          h("button", {
            key: "edit",
            type: "button",
            disabled: busy || draft != null,
            onClick: () => editRule(selectedRule),
            className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50",
          }, "Edit rule"),
          h("button", {
            key: "delete",
            type: "button",
            disabled: busy,
            onClick: () => deleteRule(selectedRule),
            className: `${buttonClass} text-red-300`,
          }, "Delete"),
        ]),
      ]);
    }

    function renderGraph() {
      if (visibleComponents.length === 0) {
        return h("p", {
          className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
          role: "status",
        }, normalizedQuery ? "No derivation relationships match your search." : "No derivation rules.");
      }
      const selectedNodeId = selectedNode?.tagId;
      const connectedTagIds = new Set();
      if (selectedNode) {
        connectedTagIds.add(selectedNode.tagId);
        layout.connections.forEach((connection) => {
          if (connection.sourceTagId === selectedNode.tagId || connection.derivedTagId === selectedNode.tagId) {
            connectedTagIds.add(connection.sourceTagId);
            connectedTagIds.add(connection.derivedTagId);
          }
        });
      }
      return h("div", {
        className: "min-h-[26rem] overflow-auto",
        style: {
          backgroundImage: "radial-gradient(circle at center, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maxHeight: "42rem",
        },
      }, [
        h("div", { key: "direction", className: "sticky left-0 top-0 z-30 flex min-w-[42rem] items-center gap-3 border-b border-border bg-surface/95 px-4 py-2 text-xs font-medium text-secondary backdrop-blur" }, [
          h("span", { key: "specific" }, "Specific"),
          h("span", { key: "line", className: "h-px flex-1 bg-border" }),
          h("span", { key: "arrow", "aria-hidden": "true" }, "→"),
          h("span", { key: "general" }, "General"),
        ]),
        h("div", {
          key: "canvas",
          className: "relative",
          style: { width: `${layout.width}px`, height: `${layout.height}px` },
          "aria-label": "Derivation rule graph",
        }, [
          ...layout.groups.map((group) => h("div", {
            key: `group:${group.componentId}:${group.key}`,
            className: `absolute rounded-xl border ${
              segmentGroupKey === group.key
                ? "border-accent/60 bg-accent/5"
                : "border-border bg-surface/75"}`,
            style: {
              left: `${group.x}px`,
              top: `${group.y}px`,
              width: `${group.width}px`,
              height: `${group.height}px`,
            },
          }, h("div", {
            className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
            title: group.name,
          }, group.name))),
          h("svg", {
            key: "edges",
            className: "pointer-events-none absolute inset-0 overflow-visible",
            width: layout.width,
            height: layout.height,
            "aria-hidden": "true",
          }, [
            h("defs", { key: "defs" }, h("marker", {
              id: arrowMarkerId,
              viewBox: "0 0 10 10",
              refX: "9",
              refY: "5",
              markerWidth: "7",
              markerHeight: "7",
              orient: "auto-start-reverse",
            }, h("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "context-stroke" }))),
            ...layout.connections.map((connection) => {
              const connectionSelected = selectedNodeId === connection.sourceTagId
                || selectedNodeId === connection.derivedTagId;
              const hasSelection = selectedNode != null;
              const stroke = connectionSelected ? "var(--color-accent)" : "var(--color-secondary)";
              return h("path", {
                key: `${connection.id}:visible`,
                d: connection.path,
                fill: "none",
                stroke,
                strokeWidth: connectionSelected ? 2.5 : 1.5,
                opacity: hasSelection && !connectionSelected ? 0.2 : 0.7,
                markerEnd: `url(#${arrowMarkerId})`,
              });
            }),
          ]),
          ...layout.nodes.map((node) => {
            const matchesSearch = !normalizedQuery || node.name.toLocaleLowerCase().includes(normalizedQuery);
            const hasSelection = selectedNode != null;
            const connected = connectedTagIds.has(node.tagId);
            const active = selectedNode?.tagId === node.tagId;
            return h("button", {
              key: `node:${node.tagId}`,
              type: "button",
              onClick: () => setSelection({ type: "node", id: node.tagId }),
              className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${
                active
                  ? "border-accent bg-accent/15 ring-2 ring-accent/25"
                  : connected
                    ? "border-accent/70 bg-card"
                    : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
              style: {
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${node.width}px`,
                height: `${node.height}px`,
                opacity: (!matchesSearch || (hasSelection && !connected)) ? 0.62 : 1,
              },
              title: `${node.name} — ${node.segmentGroupName}`,
              "aria-label": `${node.name}, ${node.incomingRuleCount} incoming and ${node.outgoingRuleCount} outgoing derivation rules`,
            }, [
              h("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, node.name),
              h("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
                h("span", { key: "in" }, `${node.incomingRuleCount} in`),
                h("span", { key: "arrow", "aria-hidden": "true" }, "→"),
                h("span", { key: "out" }, `${node.outgoingRuleCount} out`),
              ]),
            ]);
          }),
          ...layout.connections.filter((connection) => connection.rules.length > 1).map((connection) => {
            const source = layout.nodes.find((node) => node.tagId === connection.sourceTagId);
            const derived = layout.nodes.find((node) => node.tagId === connection.derivedTagId);
            return h("div", {
              key: `bundle:${connection.id}`,
              className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
              style: {
                left: `${(source.x + source.width + derived.x) / 2 - 24}px`,
                top: `${(source.y + source.height / 2 + derived.y + derived.height / 2) / 2 - 10}px`,
              },
              "aria-label": `${connection.rules.length} rules connect ${
                connection.rules[0].sourceTagName} to ${connection.rules[0].derivedTagName}`,
            }, `${connection.rules.length} rules`);
          }),
        ]),
      ]);
    }

    function renderList() {
      if (visibleComponents.length === 0) {
        return h("p", { className: "p-8 text-center text-sm text-secondary", role: "status" },
          normalizedQuery ? "No derivation relationships match your search." : "No derivation rules.");
      }
      const bucketMap = new Map();
      sortedVisibleRules.forEach((rule) => {
        const key = ruleGroupKey(rule);
        if (!bucketMap.has(key)) bucketMap.set(key, []);
        bucketMap.get(key).push(rule);
      });
      const orderedKeys = [
        ...graph.segmentGroups.map((group) => group.key),
        "cross-group",
      ].filter((key) => bucketMap.has(key));
      return h("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, orderedKeys.map((key) => {
        const group = graph.segmentGroups.find((candidate) => candidate.key === key);
        const label = key === "cross-group" ? "Cross-group relationships" : group?.name || "Ungrouped";
        const bucketRules = bucketMap.get(key);
        return h("section", { key, "aria-label": label }, [
          h("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
            h("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, label),
            h("span", { key: "count", className: "text-xs text-secondary" },
              `${bucketRules.length} rule${bucketRules.length === 1 ? "" : "s"}`),
          ]),
          h("div", { key: "table", role: "table", "aria-label": `${label} derivation rules` }, [
            h("div", {
              key: "header",
              role: "row",
              className: "grid gap-3 border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-secondary",
              style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" },
            }, [
              h("span", { key: "relationship", role: "columnheader" }, "Relationship"),
              h("span", { key: "mappings", role: "columnheader" }, "Slot mappings"),
              h("span", { key: "materialized", role: "columnheader", className: "text-right" }, "Materialized"),
            ]),
            ...bucketRules.map((rule) => h("button", {
              key: rule.id,
              type: "button",
              role: "row",
              onClick: () => setSelection({ type: "rule", id: rule.id }),
              className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${
                selectedRule?.id === rule.id ? "bg-accent/10" : ""}`,
              style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" },
            }, [
              h("span", { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${rule.sourceTagName} → ${rule.derivedTagName}` },
                `${rule.sourceTagName} → ${rule.derivedTagName}`),
              h("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(rule.slotMappings.length)),
              h("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(rule.edgeCount)),
            ])),
          ]),
        ]);
      }));
    }

    return h("section", {
      className: "overflow-hidden rounded-xl border border-border bg-surface",
      "aria-label": "Derived segment rules",
    }, [
      h("div", { key: "heading", className: "flex flex-wrap items-start justify-between gap-3 border-b border-border p-4" }, [
        h("div", { key: "copy" }, [
          h("h2", { key: "title", className: "text-xl font-semibold text-foreground" }, "Derivation rules"),
          h("p", { key: "description", className: "mt-1 max-w-3xl text-sm text-secondary" },
            "Map how more specific segments are materialized as more general, derived segments."),
          h("p", { key: "summary", className: "mt-2 text-xs text-secondary" },
            `${rules.length} rules · ${graph.nodes.length} tags`),
        ]),
        h("button", {
          key: "add",
          type: "button",
          disabled: busy || draft != null,
          onClick: () => {
            setDraft(emptyDraft());
            setSelection(null);
            revealEditor();
          },
          className: "rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50",
        }, "Add rule"),
      ]),
      h("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 border-b border-border bg-card/40 p-3" }, [
        h("label", { key: "search", className: "min-w-[13rem] flex-1 space-y-1 text-xs text-secondary" }, [
          h("span", { key: "label" }, "Search"),
          h("input", {
            key: "input",
            type: "search",
            value: query,
            onChange: (event) => {
              setQuery(event.target.value);
              setSelection(null);
            },
            placeholder: "Find a tag or relationship…",
            "aria-label": "Search derivation rules",
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
          }),
        ]),
        h("label", { key: "group", className: "min-w-[12rem] space-y-1 text-xs text-secondary" }, [
          h("span", { key: "label" }, "Segment group"),
          h("select", {
            key: "select",
            value: segmentGroupKey,
            disabled: draft != null,
            onChange: (event) => {
              setSegmentGroupKey(event.target.value);
              setSelection(null);
              setDraft(null);
            },
            "aria-label": "Segment group",
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50",
          }, [
            h("option", { key: "all", value: "all" }, "All Segment groups"),
            ...graph.segmentGroups.map((group) =>
              h("option", { key: group.key, value: group.key }, group.name)),
          ]),
        ]),
        view === "list" ? h("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
          h("span", { key: "label" }, "Sort"),
          h("select", {
            key: "select",
            value: listSort,
            onChange: (event) => setListSort(event.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
          }, [
            h("option", { key: "relationship", value: "relationship" }, "Relationship"),
            h("option", { key: "source", value: "source" }, "Source tag"),
            h("option", { key: "target", value: "target" }, "Derived tag"),
            h("option", { key: "materialized", value: "materialized" }, "Most materialized"),
          ]),
        ]) : null,
        h("div", { key: "view", className: "ml-auto inline-flex rounded-md border border-border bg-surface p-0.5", "aria-label": "Derivation rule view" },
          [
            ["graph", "Graph"],
            ["list", "List"],
          ].map(([key, label]) => h("button", {
            key,
            type: "button",
            onClick: () => {
              setView(key);
              if (key === "graph" && selection?.type === "rule") setSelection(null);
            },
            "aria-pressed": view === key,
            className: `rounded px-3 py-1.5 text-sm font-medium ${
              view === key ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`,
          }, label))),
      ]),
      h("div", {
        key: "workspace-scroll",
        className: "overflow-x-auto",
      }, h("div", {
        key: "workspace",
        className: "grid",
        style: {
          gridTemplateColumns: "minmax(38rem, 1fr) 22rem",
          minWidth: "60rem",
        },
      }, [
        h("div", { key: "visualization", className: "min-w-0 border-r border-border" },
          view === "graph" ? renderGraph() : renderList()),
        h("aside", {
          key: "details",
          className: "min-w-0 overflow-auto bg-surface",
          style: { maxHeight: "42rem" },
          "aria-label": "Rule details",
        }, [
          h("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
          draft ? renderRuleEditor() : renderSelectionDetails(),
        ]),
      ])),
      h("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
        message ? h("p", { key: "message", role: "status", className: "text-sm text-secondary" }, message) : null,
      ]),
      configuringTag ? h(InlineTagConfigurationDialog, {
        key: `derivation-configure-tag:${configuringTag.tagId}`,
        tagId: configuringTag.tagId,
        tagName: configuringTag.tagName,
        onSaved: () => refreshConfiguredTag(configuringTag),
        onClose: () => {
          const trigger = configuringTag.trigger;
          setConfiguringTag(null);
          requestAnimationFrame(() => {
            if (trigger?.isConnected) trigger.focus();
          });
        },
      }) : null,
    ]);
}

export { DerivedSegmentRuleSettingsView };
