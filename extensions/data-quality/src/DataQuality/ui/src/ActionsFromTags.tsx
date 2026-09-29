import { EntityReferenceMultiSelector } from "@cove/runtime/components";
import { useEffect, useRef, useState } from "react";
import { mediaLabel } from "./api";
import {
  actionsByAddedTag,
  childTagAction,
  distinctChildGroups,
  loadChildTagGroup,
  parentGroupName,
  parentsOfChildren,
  type ChildTagGroup,
} from "./childTagActions";
import {
  isOccurrenceReview,
  reviewMediaKind,
  type MediaReview,
  type MediaReviewAction,
} from "./model";

type GroupState =
  | { status: "loading" }
  | { status: "ready"; group: ChildTagGroup }
  | { status: "failed"; message: string };

const errorText = (error: unknown) =>
  error instanceof Error ? error.message : "Request failed.";

/**
 * Generates one action per direct child of the chosen parent tags, in the answer group named
 * after the parent the child is listed under. The actions are ordinary actions once added:
 * nothing stays linked to the parents, and running this again pre-ticks only the children no
 * action adds yet.
 */
export function ActionsFromTags({
  id,
  review,
  disabled,
  onAdd,
  onCancel,
}: {
  id?: string;
  review: MediaReview;
  disabled: boolean;
  onAdd(actions: MediaReviewAction[]): void;
  onCancel(): void;
}) {
  const [parentIds, setParentIds] = useState<number[]>([]);
  const [groups, setGroups] = useState<Record<number, GroupState>>({});
  // Keyed by child alone: where a shared child is listed depends on which parents have loaded.
  const [choices, setChoices] = useState<Record<number, boolean>>({});
  const [onlyOne, setOnlyOne] = useState<Record<number, boolean>>({});
  const loads = useRef(new Map<number, AbortController>());
  useEffect(
    () => () => {
      for (const controller of loads.current.values()) controller.abort();
    },
    [],
  );
  const labels = mediaLabel(reviewMediaKind(review));
  const occurrences = isOccurrenceReview(review);
  const subject = occurrences ? "performer" : labels.one;

  function load(parentId: number) {
    loads.current.get(parentId)?.abort();
    const controller = new AbortController();
    loads.current.set(parentId, controller);
    setGroups((current) => ({ ...current, [parentId]: { status: "loading" } }));
    loadChildTagGroup(review, parentId, controller.signal).then(
      (group) => {
        if (!controller.signal.aborted)
          setGroups((current) => ({
            ...current,
            [parentId]: { status: "ready", group },
          }));
      },
      (error: unknown) => {
        if (!controller.signal.aborted)
          setGroups((current) => ({
            ...current,
            [parentId]: { status: "failed", message: errorText(error) },
          }));
      },
    );
  }

  function choose(ids: number[]) {
    const removed = parentIds.filter((parentId) => !ids.includes(parentId));
    for (const parentId of removed) {
      loads.current.get(parentId)?.abort();
      loads.current.delete(parentId);
    }
    // A removed parent is forgotten: choices about children no remaining parent lists go too.
    const childrenOf = (parentId: number) => {
      const state = groups[parentId];
      return state?.status === "ready" ? state.group.children.map((child) => child.id) : [];
    };
    const kept = new Set(ids.flatMap(childrenOf));
    const forgotten = removed.flatMap(childrenOf).filter((childId) => !kept.has(childId));
    setChoices((current) =>
      Object.fromEntries(
        Object.entries(current).filter(([childId]) => !forgotten.includes(Number(childId))),
      ),
    );
    setOnlyOne((current) =>
      Object.fromEntries(
        Object.entries(current).filter(([parentId]) => ids.includes(Number(parentId))),
      ),
    );
    setGroups((current) =>
      Object.fromEntries(
        Object.entries(current).filter(([parentId]) => ids.includes(Number(parentId))),
      ),
    );
    setParentIds(ids);
    for (const parentId of ids) if (!parentIds.includes(parentId)) load(parentId);
  }

  const loaded = parentIds.flatMap((parentId) => {
    const state = groups[parentId];
    return state?.status === "ready" ? [state.group] : [];
  });
  // Where a child is listed depends on every earlier parent, so nothing is added until all load.
  const complete = loaded.length === parentIds.length;
  const loading = parentIds.some(
    (parentId) => (groups[parentId]?.status ?? "loading") === "loading",
  );
  const offered = new Map(
    distinctChildGroups(loaded).map((group) => [group.parent.id, group]),
  );
  const parentsOf = parentsOfChildren(loaded);
  const parentNames = new Map(loaded.map((group) => [group.parent.id, group.parent.name]));
  const adding = actionsByAddedTag(review.actions);
  const checked = (childId: number) => choices[childId] ?? !adding.has(childId);
  // Each ticked child with the answer group of the parent it is listed under.
  const chosen = complete
    ? [...offered.values()].flatMap((group) => {
        const answerGroup = parentGroupName(group.parent.name, review.actions);
        return group.children
          .filter((child) => checked(child.id))
          .map((child) => ({ child, answerGroup }));
      })
    : [];
  const setAll = (group: ChildTagGroup, value: boolean) =>
    setChoices((current) => ({
      ...current,
      ...Object.fromEntries(group.children.map((child) => [child.id, value])),
    }));

  return (
    <fieldset id={id} className="dq-actions-from-tags">
      <legend>Add actions from parent tags</legend>
      <p className="dq-drawer-note">
        Each ticked child tag becomes an action that adds it, most used{" "}
        {occurrences ? "on performers " : ""}first, in a group named after its
        parent. Tags an action already adds start unticked. The new actions go
        at the end, ready to reorder and edit.
      </p>
      <EntityReferenceMultiSelector
        entityType="tag"
        values={parentIds}
        onChange={choose}
        placeholder="Search parent tags..."
        allowCreate={false}
        disabled={disabled}
      />
      {parentIds.map((parentId) => {
        const state = groups[parentId];
        if (!state || state.status === "loading")
          return (
            <p key={parentId} className="dq-drawer-note">
              Loading child tags…
            </p>
          );
        if (state.status === "failed")
          return (
            <div key={parentId} role="alert" className="dq-row">
              <span>Child tags could not be loaded. {state.message}</span>
              <button
                type="button"
                className="dq-button"
                disabled={disabled}
                onClick={() => load(parentId)}
              >
                Retry
              </button>
            </div>
          );
        const group = offered.get(parentId);
        if (!group) return null;
        const parentName = group.parent.name;
        return (
          <fieldset key={parentId} className="dq-child-tag-group">
            <legend>{parentName}</legend>
            {state.group.children.length === 0 ? (
              <p className="dq-drawer-note">This tag has no child tags.</p>
            ) : (
              <>
                <label className="dq-checkbox">
                  <input
                    type="checkbox"
                    checked={onlyOne[parentId] ?? false}
                    disabled={disabled}
                    onChange={(event) =>
                      setOnlyOne((current) => ({
                        ...current,
                        [parentId]: event.target.checked,
                      }))
                    }
                  />
                  Only one per {subject}: each action removes every other tag
                  in the {parentName} tree
                </label>
                {group.children.length === 0 ? (
                  <p className="dq-drawer-note">
                    Every child tag is already listed under an earlier parent.
                  </p>
                ) : (
                  <>
                    <div className="dq-row">
                      <button
                        type="button"
                        disabled={disabled}
                        aria-label={`Select all child tags of ${parentName}`}
                        onClick={() => setAll(group, true)}
                      >
                        Select all
                      </button>
                      <button
                        type="button"
                        disabled={disabled}
                        aria-label={`Select none of the child tags of ${parentName}`}
                        onClick={() => setAll(group, false)}
                      >
                        Select none
                      </button>
                    </div>
                    <div className="dq-child-tags">
                      {group.children.map((child) => {
                        const existing = adding.get(child.id) ?? [];
                        const otherParents = (parentsOf.get(child.id) ?? [])
                          .filter((other) => other !== parentId)
                          .map((other) => `“${parentNames.get(other)}”`);
                        return (
                          <label key={child.id} className="dq-checkbox dq-child-tag">
                            <input
                              type="checkbox"
                              checked={checked(child.id)}
                              disabled={disabled}
                              onChange={(event) =>
                                setChoices((current) => ({
                                  ...current,
                                  [child.id]: event.target.checked,
                                }))
                              }
                            />
                            <span>
                              {child.name}{" "}
                              <small>
                                {child.uses.toLocaleString()}{" "}
                                {child.uses === 1 ? labels.one : labels.many}
                              </small>
                              {otherParents.length > 0 && (
                                <small> · Also under {otherParents.join(", ")}</small>
                              )}
                              {existing.length > 0 && (
                                <small>
                                  {" "}
                                  · Already in “{existing[0].label || "New action"}”
                                  {existing.length > 1
                                    ? ` and ${existing.length - 1} more`
                                    : ""}
                                </small>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}
          </fieldset>
        );
      })}
      <div className="dq-row">
        <button
          type="button"
          className="dq-button primary"
          disabled={disabled || !chosen.length}
          onClick={() =>
            onAdd(
              chosen.map(({ child, answerGroup }) =>
                childTagAction(
                  child,
                  (parentsOf.get(child.id) ?? []).filter(
                    (parentId) => onlyOne[parentId],
                  ),
                  answerGroup,
                ),
              ),
            )
          }
        >
          {chosen.length
            ? `Add ${chosen.length} action${chosen.length === 1 ? "" : "s"}`
            : "Add actions"}
        </button>
        <button type="button" className="dq-button" onClick={onCancel}>
          Cancel
        </button>
        <span role="status" className="dq-sr-only">
          {loading ? "Loading child tags…" : ""}
        </span>
      </div>
    </fieldset>
  );
}
