import React from "@cove/runtime/react";
import { ConfirmDialog } from "@cove/runtime/components";
import { extensionFetch } from "@cove/runtime/api";
import { Merge, Users, Building2, Loader2, AlertTriangle, ArrowLeft, Trash2, Check } from "@cove/runtime/lucide-react";

const h = React.createElement;
const { useEffect, useMemo, useState } = React;
const API = "/api/plugins/com.midnightrider.merge-opportunities";
/** Core merge/delete can take a while; the host default fetch timeout is 15 s. */
const CORE_MERGE_TIMEOUT_MS = 600_000;

function providerLabel(endpoint) {
  const host = (() => { try { return new URL(endpoint).hostname.toLocaleLowerCase(); } catch { return endpoint || ""; } })();
  if (host.includes("stashdb.org")) return "StashDB";
  if (host.includes("theporndb.net")) return "TPDB";
  return host.replace(/^api\.|^www\./, "") || "Metadata server";
}

async function request(url, options) {
  const response = await extensionFetch(url, { headers: { "Content-Type": "application/json", ...(options?.headers || {}) }, ...options });
  if (!response.ok) {
    let message = response.statusText || "Request failed.";
    try { const body = await response.json(); message = body.message || body.detail || message; } catch { /* ignore */ }
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function formatDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Invalid Date" : `${date.toISOString().slice(0, 19).replace("T", " ")} UTC`;
}

const enc = (key) => encodeURIComponent(key);

const DECISION_LABELS = {
  merged: "Merged",
  attached: "Attached",
  deleted: "Deleted",
  dismissed: "Dismissed",
};

function KindBadge({ kind }) {
  return h("span", {
    className: kind === "remote-id" ? "merge-opportunities-kind kind-remote" : "merge-opportunities-kind kind-name",
  }, kind === "remote-id" ? "same remote id" : "name match");
}

function EntityIcon({ entityType, className }) {
  return entityType === "studio" ? h(Building2, { className }) : h(Users, { className });
}

// ---------------------------------------------------------------- list page

function MergeOpportunitiesPage({ onNavigate }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [entityType, setEntityType] = useState("");
  const [kind, setKind] = useState("");
  const [search, setSearch] = useState("");
  const [showDecided, setShowDecided] = useState(false);
  const [bulkBusy, setBulkBusy] = useState("");
  const [bulkResult, setBulkResult] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setItems(null);
    setError("");
    request(`${API}/candidates`).then(
      (data) => setItems(data.candidates),
      (e) => setError(e.message),
    );
  };

  useEffect(() => { load(); /* eslint-disable-line react-hooks/exhaustive-deps */ }, []);

  const visible = useMemo(() => (items ?? []).filter((c) =>
    (!entityType || c.entityType === entityType) &&
    (!kind || c.kind === kind) &&
    (!search || (c.label || "").toLowerCase().includes(search) || c.key.toLowerCase().includes(search)) &&
    (showDecided || !c.decision)), [items, entityType, kind, search, showDecided]);
  const openCount = useMemo(() => (items ?? []).filter((c) => !c.decision).length, [items]);
  const acceptable = useMemo(() => visible.filter((c) => !c.decision), [visible]);

  const doDismissRow = async (c) => {
    try {
      await request(`${API}/candidates/${enc(c.key)}/decision`, {
        method: "POST",
        body: JSON.stringify({ decision: "dismissed" }),
      });
      load();
    } catch (e) { setError(e.message); }
  };

  const doReopenRow = async (c) => {
    try {
      await request(`${API}/candidates/${enc(c.key)}/decision`, { method: "DELETE" })
        .catch((e) => { if (e.status !== 404) throw e; });
      load();
    } catch (e) { setError(e.message); }
  };

  const doAcceptAll = async () => {
    const targets = acceptable;
    setBulkBusy(`0/${targets.length}`);
    setBulkResult("");
    let done = 0;
    const failures = [];
    for (let i = 0; i < targets.length; i++) {
      const c = targets[i];
      try {
        const detail = await request(`${API}/candidates/${enc(c.key)}`);
        const members = detail.summary.members;
        const targetId = members[0]?.entityId;
        const sourceIds = members.slice(1).map((m) => m.entityId);
        if (targetId && sourceIds.length > 0) {
          const coreBase = detail.summary.entityType === "studio" ? "/api/studios" : "/api/performers";
          await request(`${coreBase}/merge`, {
            method: "POST",
            body: JSON.stringify({ targetId, sourceIds }),
            timeoutMs: CORE_MERGE_TIMEOUT_MS,
          });
          await request(`${API}/candidates/${enc(c.key)}/decision`, {
            method: "POST",
            body: JSON.stringify({ decision: "merged", targetEntityId: targetId }),
          });
          done++;
        }
      } catch (e) {
        if (e.status !== 404) failures.push(`${c.label || c.key}: ${e.message}`);
      }
      setBulkBusy(`${i + 1}/${targets.length}`);
    }
    setBulkBusy("");
    setBulkResult(
      failures.length > 0
        ? `Merged ${done}, ${failures.length} failed: ${failures.slice(0, 5).join(" · ")}${failures.length > 5 ? " …" : ""}`
        : `Merged ${done} candidate${done === 1 ? "" : "s"}.`,
    );
    load();
  };

  return h("div", { className: "merge-opportunities-page" },
    h("div", { className: "merge-opportunities-toolbar" },
      h(EntityIcon, { entityType: "", className: "merge-opportunities-title-icon" }),
      h("h1", { className: "merge-opportunities-title" }, "Merge Opportunities"),
      h("select", {
        className: "merge-opportunities-select",
        value: entityType,
        onChange: (e) => setEntityType(e.target.value),
      },
        h("option", { value: "" }, "All entity types"),
        h("option", { value: "performer" }, "Performers"),
        h("option", { value: "studio" }, "Studios")),
      h("select", {
        className: "merge-opportunities-select",
        value: kind,
        onChange: (e) => setKind(e.target.value),
      },
        h("option", { value: "" }, "All match types"),
        h("option", { value: "name" }, "Name matches"),
        h("option", { value: "remote-id" }, "Remote-id matches")),
      h("input", {
        className: "merge-opportunities-search",
        type: "search",
        placeholder: "Filter by name or provider…",
        value: search,
        onChange: (e) => setSearch(e.target.value),
      }),
      h("label", { className: "merge-opportunities-checkbox" },
        h("input", { type: "checkbox", checked: showDecided, onChange: (e) => setShowDecided(e.target.checked) }),
        "Show decided"),
      h("button", {
        className: "merge-opportunities-bulk-btn",
        disabled: bulkBusy !== "" || acceptable.length === 0,
        onClick: () => setConfirm({ kind: "accept-all" }),
      },
        bulkBusy !== "" ? h(Loader2, { className: "w-4 h-4 animate-spin" }) : null,
        bulkBusy ? `Merging ${bulkBusy}` : `Accept all (${acceptable.length})`),
      h("span", { className: "merge-opportunities-count" },
        items ? `${visible.length} shown · ${openCount} open` : "")),
    error
      ? h("div", { className: "merge-opportunities-error" }, h(AlertTriangle, { className: "w-4 h-4" }), error)
      : null,
    bulkResult
      ? h("div", { className: "merge-opportunities-bulk-result" }, bulkResult)
      : null,
    items === null && !error
      ? h("div", { className: "merge-opportunities-state" }, h(Loader2, { className: "w-4 h-4 animate-spin" }), "Scanning for duplicate entities…")
      : visible.length === 0
        ? h("div", { className: "merge-opportunities-state" },
            items.length === 0 ? "No duplicate candidates found." : "No candidates match the current filters.")
        : h("div", { className: "merge-opportunities-list" },
            visible.map((c) => h("div", {
              key: c.key,
              className: `merge-opportunities-row${c.decision ? " decided" : ""}`,
              onClick: () => onNavigate({ page: "merge-opportunity", slug: c.key }),
            },
              h(EntityIcon, { entityType: c.entityType, className: "merge-opportunities-row-icon" }),
              h("div", { className: "merge-opportunities-row-main" },
                h("div", { className: "merge-opportunities-row-title" },
                  h("span", { className: "merge-opportunities-label" }, c.label || c.key),
                  h(KindBadge, { kind: c.kind })),
                h("div", { className: "merge-opportunities-members" },
                  c.members.map((m) => h("span", {
                    key: m.entityId,
                    className: `merge-opportunities-member-chip${m.videoCount === 0 ? " orphan" : ""}`,
                  },
                    m.name || `#${m.entityId}`,
                    h("span", { className: "merge-opportunities-chip-meta" },
                      `${m.videoCount} vid${m.videoCount === 1 ? "" : "s"}`)),
                  )),
                h("div", { className: "merge-opportunities-row-meta" },
                  `${c.memberCount} ${c.entityType}${c.memberCount === 1 ? "" : "s"} · ${c.totalVideoCount} videos total`)),
              c.decision
                ? h("div", { className: "merge-opportunities-row-actions" },
                    h("span", { className: `merge-opportunities-decision d-${c.decision.decision}` },
                      DECISION_LABELS[c.decision.decision] || c.decision.decision),
                    h("button", {
                      className: "merge-opportunities-row-btn",
                      onClick: (e) => { e.stopPropagation(); doReopenRow(c); },
                    }, "Reopen"))
                : h("div", { className: "merge-opportunities-row-actions" },
                    h("span", { className: "merge-opportunities-review" }, "Review"),
                    h("button", {
                      className: "merge-opportunities-row-btn",
                      onClick: (e) => { e.stopPropagation(); doDismissRow(c); },
                    }, "Dismiss"))))),
    h(ConfirmDialog, {
      key: "confirm",
      open: Boolean(confirm),
      title: `Accept all ${acceptable.length} candidates?`,
      message: `Each candidate is merged into its most-credited record, then marked merged. ${acceptable.slice(0, 8).map((c) => c.label || c.key).join(", ")}${acceptable.length > 8 ? ` and ${acceptable.length - 8} more` : ""}.`,
      confirmLabel: "Merge all",
      onConfirm: doAcceptAll,
      onCancel: () => { if (bulkBusy === "") setConfirm(null); },
      isPending: bulkBusy !== "",
    }));
};

// ---------------------------------------------------------------- detail page

function MergeOpportunityDetailPage({ slug, onNavigate }) {
  const key = slug;
  const [detail, setDetail] = useState(null);
  const [resolved, setResolved] = useState(false);
  const [error, setError] = useState("");
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState("");
  const [actionError, setActionError] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [excluded, setExcluded] = useState({});

  const load = () => {
    setDetail(null);
    setResolved(false);
    setError("");
    setActionError("");
    setExcluded({});
    request(`${API}/candidates/${enc(key)}`).then(
      (data) => {
        setDetail(data);
        setTarget((prev) => (
          prev && data.summary.members.some((m) => m.entityId === prev)
            ? prev : (data.summary.members[0]?.entityId ?? null)));
      },
      (e) => { if (e.status === 404) setResolved(true); else setError(e.message); },
    );
  };

  useEffect(() => { load(); /* eslint-disable-line react-hooks/exhaustive-deps */ }, [key]);

  if (!key) return h("div", { className: "merge-opportunities-state" }, "No candidate selected.");

  const entity = detail?.summary.entityType;
  const coreBase = entity === "studio" ? "/api/studios" : "/api/performers";
  const members = detail?.summary.members ?? [];
  const decision = detail?.summary.decision;
  const sourceIds = members
    .filter((m) => m.entityId !== target && !excluded[m.entityId])
    .map((m) => m.entityId);
  const targetMember = members.find((m) => m.entityId === target);
  const keyParts = (key || "").split("|");

  const recordDecision = (decisionValue, targetEntityId) =>
    request(`${API}/candidates/${enc(key)}/decision`, {
      method: "POST",
      body: JSON.stringify({ decision: decisionValue, targetEntityId }),
    });

  // If the group still has 2+ members after the action, a stored decision would hide it
  // from the open list — clear it so the remaining group stays open for review.
  const clearDecision = () =>
    request(`${API}/candidates/${enc(key)}/decision`, { method: "DELETE" })
      .catch((e) => { if (e.status !== 404) throw e; });

  const doMerge = async () => {
    setBusy("merge");
    setActionError("");
    try {
      await request(`${coreBase}/merge`, {
        method: "POST",
        body: JSON.stringify({ targetId: target, sourceIds }),
        timeoutMs: CORE_MERGE_TIMEOUT_MS,
      });
      if (members.length - sourceIds.length > 1) await clearDecision();
      else await recordDecision("merged", target);
      load();
    } catch (e) { setActionError(e.message); }
    finally { setBusy(""); setConfirm(null); }
  };

  const doDelete = async (memberId) => {
    setBusy(`delete-${memberId}`);
    setActionError("");
    try {
      await request(`${coreBase}/${memberId}`, { method: "DELETE", timeoutMs: CORE_MERGE_TIMEOUT_MS });
      if (members.length - 1 > 1) await clearDecision();
      else await recordDecision("deleted", memberId);
      load();
    } catch (e) { setActionError(e.message); }
    finally { setBusy(""); setConfirm(null); }
  };

  const doDismiss = async () => {
    setBusy("dismiss");
    setActionError("");
    try {
      await recordDecision("dismissed", null);
      load();
    } catch (e) { setActionError(e.message); }
    finally { setBusy(""); }
  };

  const doReopen = async () => {
    setBusy("reopen");
    setActionError("");
    try {
      await request(`${API}/candidates/${enc(key)}/decision`, { method: "DELETE" });
      load();
    } catch (e) { if (e.status !== 404) setActionError(e.message); }
    finally { setBusy(""); }
  };

  return h("div", { className: "merge-opportunities-page" },
    h("div", { className: "merge-opportunities-back" },
      h("button", { className: "merge-opportunities-back-btn", onClick: () => onNavigate({ page: "merge-opportunities" }) },
        h(ArrowLeft, { className: "w-4 h-4" }), "All candidates")),
    error
      ? h("div", { className: "merge-opportunities-error" }, h(AlertTriangle, { className: "w-4 h-4" }), error)
      : resolved
        ? h("div", { className: "merge-opportunities-state" },
            h(Check, { className: "w-4 h-4" }),
            "This candidate no longer exists — it was resolved or the underlying data changed.")
        : detail === null
          ? h("div", { className: "merge-opportunities-state" }, h(Loader2, { className: "w-4 h-4 animate-spin" }), "Loading candidate…")
          : h(React.Fragment, null,
              h("div", { className: "merge-opportunities-detail-header" },
                h("h1", { className: "merge-opportunities-title" }, detail.summary.label || key),
                h(KindBadge, { kind: detail.summary.kind }),
                h("span", { className: "merge-opportunities-row-meta" },
                  `${detail.summary.memberCount} ${entity}s · ${detail.summary.totalVideoCount} videos total`)),
              decision
                ? h("div", { className: `merge-opportunities-decision-banner d-${decision.decision}` },
                    h("span", null,
                      `${DECISION_LABELS[decision.decision] || decision.decision}`,
                      decision.targetEntityId ? ` (target #${decision.targetEntityId})` : "",
                      ` · ${formatDateTime(decision.decidedAt)}`),
                    h("button", { className: "merge-opportunities-btn secondary", disabled: busy !== "", onClick: doReopen },
                      "Reopen"))
                : null,
               h("div", { className: "merge-opportunities-members-grid" },
                members.map((m) => h("div", {
                  key: m.entityId,
                  className: `merge-opportunities-member-card${m.entityId === target ? " selected" : ""}`,
                },
                  h("label", { className: "merge-opportunities-target-pick" },
                    h("input", {
                      type: "radio",
                      name: "merge-target",
                      checked: m.entityId === target,
                      onChange: () => setTarget(m.entityId),
                      disabled: Boolean(decision),
                    }),
                     "Keep as target"),
                   !decision && m.entityId !== target
                     ? h("label", { className: "merge-opportunities-source-pick" },
                         h("input", {
                           type: "checkbox",
                           checked: !excluded[m.entityId],
                           onChange: () => setExcluded((prev) => ({ ...prev, [m.entityId]: !prev[m.entityId] })),
                         }),
                         "Merge this record")
                     : null,
                   h("img", {
                    src: m.imageUrl,
                    alt: "",
                    className: "merge-opportunities-member-img",
                    onError: (e) => { e.currentTarget.style.display = "none"; },
                  }),
                  h("button", {
                    className: "merge-opportunities-member-name",
                    onClick: () => onNavigate({ page: entity === "studio" ? "studio" : "performer", id: m.entityId }),
                  }, m.name || `#${m.entityId}`),
                  h("div", { className: "merge-opportunities-member-meta" },
                    h("span", { className: m.videoCount === 0 ? "merge-opportunities-orphan-flag" : null },
                      m.videoCount === 0 ? "0 videos (orphan)" : `${m.videoCount} videos`)),
                  m.remoteIds.length > 0
                    ? h("div", { className: "merge-opportunities-remote-ids" },
                        m.remoteIds.map((r, i) => h("span", { key: i, className: "merge-opportunities-remote-id" },
                          `${providerLabel(r.provider)}: ${r.remoteId}`)))
                    : h("div", { className: "merge-opportunities-remote-ids empty" }, "no remote ids"),
                  m.videoCount === 0 && !decision
                    ? h("button", {
                        className: "merge-opportunities-delete-btn",
                        disabled: busy !== "",
                        onClick: () => setConfirm({ kind: "delete", memberId: m.entityId, name: m.name || `#${m.entityId}` }),
                      },
                        h(Trash2, { className: "w-3.5 h-3.5" }), "Delete orphan")
                    : null))),
              detail.summary.kind === "remote-id"
                ? h("div", { className: "merge-opportunities-evidence" },
                    h("h2", null, "Evidence"),
                    h("p", { className: "merge-opportunities-evidence-line" },
                      "All members share remote id ",
                      h("code", null, keyParts[3] || ""),
                      " on ",
                      h("strong", null, providerLabel(keyParts[2] || "")),
                      ". The same upstream record is tracked under ",
                      `${detail.summary.memberCount} ${entity}s`,
                      "."))
                : null,
              detail.summary.kind === "name" && detail.sharedScenes.length > 0
                ? h("div", { className: "merge-opportunities-evidence" },
                    h("h2", null, "Shared scenes"),
                    h("p", { className: "merge-opportunities-evidence-line" },
                      `${detail.sharedScenes.length} scene${detail.sharedScenes.length === 1 ? " is" : "s are"} credited to 2+ of these ${entity}s:`),
                    h("div", { className: "merge-opportunities-scenes" },
                      detail.sharedScenes.map((s, i) => h("div", { key: i, className: "merge-opportunities-scene" },
                        h("span", { className: "merge-opportunities-scene-title" }, s.title),
                        s.studioName
                          ? h("span", { className: "merge-opportunities-scene-studio" }, s.studioName)
                          : null,
                        h("span", { className: "merge-opportunities-scene-meta" },
                          `shared by ${s.memberCount}/${detail.summary.memberCount}`)))))
                : null,
              actionError
                ? h("div", { className: "merge-opportunities-error" },
                    h(AlertTriangle, { className: "w-4 h-4" }), actionError)
                : null,
              !decision
                ? h("div", { className: "merge-opportunities-actions" },
                    h("button", {
                      className: "merge-opportunities-btn primary",
                      disabled: busy !== "" || target == null || sourceIds.length === 0,
                      onClick: () => setConfirm({ kind: "merge" }),
                    },
                      busy === "merge"
                        ? h(Loader2, { className: "w-4 h-4 animate-spin" })
                        : h(Merge, { className: "w-4 h-4" }),
                       `Merge ${sourceIds.length} into ${targetMember?.name || `#${target}`}`),
                    h("button", {
                      className: "merge-opportunities-btn secondary",
                      disabled: busy !== "",
                      onClick: doDismiss,
                    },
                      busy === "dismiss" ? h(Loader2, { className: "w-4 h-4 animate-spin" }) : null,
                      "Not a duplicate"))
                : null,
              h(ConfirmDialog, {
                key: "confirm",
                open: Boolean(confirm),
                title: confirm?.kind === "delete"
                  ? `Delete ${confirm.name}?`
                  : `Merge into ${targetMember?.name || `#${target}`}?`,
                message: confirm?.kind === "delete"
                  ? "The orphaned record has no videos. This uses the host delete and cannot be undone from here."
                  : `${sourceIds.length} record${sourceIds.length === 1 ? " is" : "s are"} merged into the target and then removed. Its videos, tags, and remote ids are folded into the target.${
                      members.length - sourceIds.length > 1
                        ? ` The ${members.length - sourceIds.length - 1} unchecked record${members.length - sourceIds.length - 1 === 1 ? "" : "s"} stay as-is, and this candidate reopens for review.`
                        : ""}`,
                confirmLabel: confirm?.kind === "delete" ? "Delete" : "Merge",
                onConfirm: () => (confirm?.kind === "delete" ? doDelete(confirm.memberId) : doMerge()),
                onCancel: () => { if (!busy) setConfirm(null); },
                isPending: busy !== "",
              })));
};

export default {
  components: {
    MergeOpportunitiesPage,
    MergeOpportunityDetailPage,
  },
};
