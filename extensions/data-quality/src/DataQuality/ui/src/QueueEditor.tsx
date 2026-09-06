import { useEffect, useMemo, useState } from "react";
import {
  FilterDialog,
  VIDEO_CRITERIA,
  VIDEO_SORT_OPTIONS,
  EntityReferenceMultiSelector,
} from "@cove/runtime/components";
import { request } from "./api";
import type { VideoReview } from "./model";

type FilterCriterion = {
  id: string;
  label: string;
  type?: string;
  entityType?: string;
  filterKey: string;
  secondaryFilterKey?: string;
  auxiliaryToggleKey?: string;
  options?: Array<{ value: string; label: string }>;
  relatedCriteria?: () => FilterCriterion[];
  relatedContextCriteria?: FilterCriterion[];
  supportsDistinctSiblingMatches?: boolean;
};

type FilterSummary = { key: string; label: string; value: string };
type EntityNames = Map<string, string>;

function hasFilterValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function findCriterion(criteria: FilterCriterion[], key: string) {
  return criteria.find(
    (item) =>
      item.id === key ||
      item.filterKey === key ||
      item.secondaryFilterKey === key ||
      item.auxiliaryToggleKey === key,
  );
}

function filterLabel(key: string, criteria: FilterCriterion[]) {
  const criterion = findCriterion(criteria, key);
  if (criterion) return criterion.label;
  if (key === "_filterExpression") return "Combined filters";
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

const modifierLabels: Record<string, string> = {
  EQUALS: "is",
  NOT_EQUALS: "is not",
  INCLUDES: "includes",
  INCLUDES_ALL: "includes all",
  EXCLUDES: "excludes",
  GREATER_THAN: "greater than",
  LESS_THAN: "less than",
  BETWEEN: "between",
  NOT_BETWEEN: "not between",
  IS_NULL: "is empty",
  NOT_NULL: "is set",
  MATCHES_REGEX: "matches",
  NOT_MATCHES_REGEX: "does not match",
};

function entityName(
  entityType: string | undefined,
  id: unknown,
  names: EntityNames,
  embeddedNames?: Record<string, unknown>,
) {
  if (typeof id !== "number") return String(id ?? "");
  const embedded = embeddedNames?.[String(id)];
  if (typeof embedded === "string" && embedded) return embedded;
  return names.get(`${entityType}:${id}`) ?? `Item ${id}`;
}

function naturalList(values: string[], conjunction: "and" | "or" | "nor") {
  if (values.length < 2) return values[0] ?? "";
  if (values.length === 2) return `${values[0]} ${conjunction} ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, ${conjunction} ${values.at(-1)}`;
}

function excludedList(values: string[]) {
  if (values.length === 1) return `not ${values[0]}`;
  if (values.length === 2) return `neither ${naturalList(values, "nor")}`;
  return values.length ? `none of ${naturalList(values, "or")}` : "";
}

function filterValueSummary(
  value: unknown,
  criterion: FilterCriterion | undefined,
  names: EntityNames,
): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => entityName(criterion?.entityType, item, names))
      .join(", ");
  }
  if (!value || typeof value !== "object") return "Configured";
  const record = value as Record<string, unknown>;
  const embeddedNames =
    record._names && typeof record._names === "object"
      ? (record._names as Record<string, unknown>)
      : undefined;
  if (criterion?.type === "multiId") {
    const selected = Array.isArray(record.value)
      ? record.value.map((id) =>
          entityName(criterion.entityType, id, names, embeddedNames),
        )
      : [];
    const excluded = Array.isArray(record.excludes)
      ? record.excludes.map((id) =>
          entityName(criterion.entityType, id, names, embeddedNames),
        )
      : [];
    const modifier = String(record.modifier ?? "INCLUDES_ALL");
    const selectedSummary =
      modifier === "EXCLUDES_ALL"
        ? selected.length
          ? `not all of ${naturalList(selected, "and")}`
          : ""
        : modifier === "EXCLUDES"
          ? excludedList(selected)
          : naturalList(selected, modifier === "INCLUDES_ALL" ? "and" : "or");
    const excludedSummary = excludedList(excluded);
    const selection =
      selectedSummary && excludedSummary
        ? `${selectedSummary} but ${excludedSummary}`
        : selectedSummary || excludedSummary;
    if (selection) {
      return `${selection}${record.depth === -1 ? " with sub-tags" : ""}`;
    }
  }
  if (criterion?.type === "hash") {
    const algorithm =
      criterion.options?.find((item) => item.value === String(record.type))
        ?.label ?? String(record.type ?? "Hash");
    const modifier =
      typeof record.modifier === "string"
        ? (modifierLabels[record.modifier] ?? record.modifier.toLowerCase())
        : "";
    if (record.modifier === "IS_NULL" || record.modifier === "NOT_NULL") {
      return `${algorithm} ${modifier}`;
    }
    return [algorithm, modifier, record.value].filter(hasFilterValue).join(" ");
  }
  if (criterion?.type === "enum" && hasFilterValue(record.value)) {
    const option = criterion.options?.find(
      (item) => item.value === String(record.value),
    );
    const modifier =
      typeof record.modifier === "string"
        ? (modifierLabels[record.modifier] ?? record.modifier.toLowerCase())
        : "";
    return [modifier, option?.label ?? String(record.value)]
      .filter(Boolean)
      .join(" ");
  }
  if (criterion?.type === "tagDuration") {
    const clauses = Array.isArray(record.clauses) ? record.clauses : [record];
    const summaries = clauses.flatMap((clause) => {
      if (!clause || typeof clause !== "object") return [];
      const entry = clause as Record<string, unknown>;
      const tag = entityName("tags", entry.tagId, names, embeddedNames);
      const modifier =
        typeof entry.modifier === "string"
          ? (modifierLabels[entry.modifier] ?? entry.modifier.toLowerCase())
          : "";
      const formatDurationValue = (value: unknown) => {
        if (typeof value !== "number") return "";
        if (entry.unit === "percent") return `${value}%`;
        return `${value} ${entry.unit === "seconds" || !entry.unit ? "seconds" : String(entry.unit)}`;
      };
      const primary = formatDurationValue(entry.value);
      const secondary = formatDurationValue(entry.value2);
      return [
        [tag, modifier, secondary ? `${primary} and ${secondary}` : primary]
          .filter(hasFilterValue)
          .join(" "),
      ];
    });
    if (summaries.length) return summaries.join(" · ");
  }
  if (record.modifier === "IS_NULL" || record.modifier === "NOT_NULL") {
    return modifierLabels[String(record.modifier)];
  }
  if (hasFilterValue(record.value)) {
    const modifier =
      typeof record.modifier === "string"
        ? `${modifierLabels[record.modifier] ?? record.modifier.toLowerCase().replaceAll("_", " ")} `
        : "";
    const primary = filterValueSummary(record.value, criterion, names);
    const secondary = hasFilterValue(record.value2)
      ? ` and ${filterValueSummary(record.value2, criterion, names)}`
      : "";
    return `${modifier}${primary}${secondary}`;
  }
  return "Configured";
}

function expressionSummaries(
  expression: Record<string, unknown>,
  criteria: FilterCriterion[],
  names: EntityNames,
  path = "expression",
  ancestors: string[] = [],
): FilterSummary[] {
  const operator =
    expression._semanticNone || expression.operator === "NONE"
      ? "None"
      : expression.operator === "OR"
        ? "Any"
        : expression.operator === "JUST_ONE"
          ? "Just One"
          : expression.operator === "NOT"
            ? "Exclude"
            : "All";
  const children = Array.isArray(expression.children)
    ? expression.children
    : [];
  const relatedScope =
    expression.relatedScope && typeof expression.relatedScope === "object"
      ? (expression.relatedScope as Record<string, unknown>)
      : undefined;
  const explicitRelatedCriterion =
    typeof relatedScope?.filterKey === "string"
      ? findCriterion(criteria, relatedScope.filterKey)
      : undefined;
  const eligibleForScope = (child: unknown, filterKey: string) => {
    if (!child || typeof child !== "object") return false;
    const filter = (child as Record<string, unknown>).filter;
    if (!filter || typeof filter !== "object") return false;
    const related = (filter as Record<string, unknown>)[filterKey];
    if (!related || typeof related !== "object") return false;
    const value = related as Record<string, unknown>;
    return (
      value.exclude !== true &&
      (value.mode === undefined || value.mode === "atLeastOne")
    );
  };
  const legacyRelatedCriterion =
    !relatedScope && expression.operator === "AND"
      ? criteria.find(
          (criterion) =>
            criterion.type === "related" &&
            criterion.supportsDistinctSiblingMatches &&
            children.filter((child) =>
              eligibleForScope(child, criterion.filterKey),
            ).length >= 2,
        )
      : undefined;
  const legacyEligibleIndexes = new Set(
    legacyRelatedCriterion
      ? children.flatMap((child, index) =>
          eligibleForScope(child, legacyRelatedCriterion.filterKey)
            ? [index]
            : [],
        )
      : [],
  );
  const legacyHasOtherChildren =
    legacyEligibleIndexes.size > 0 &&
    legacyEligibleIndexes.size < children.length;
  const matchLabel = (mode: unknown) =>
    mode === "distinct" ? "Separate matches" : "Matches may overlap";
  const defaultScope = [...ancestors, operator];
  const explicitScope = explicitRelatedCriterion
    ? [
        ...ancestors,
        `${explicitRelatedCriterion.label} · ${operator} · ${matchLabel(relatedScope?.matchMode)}`,
      ]
    : undefined;
  const legacyScope = legacyRelatedCriterion
    ? [
        ...ancestors,
        ...(legacyHasOtherChildren ? [operator] : []),
        `${legacyRelatedCriterion.label} · All · ${matchLabel(expression.distinctRelatedMatches ? "distinct" : "reuse")}`,
      ]
    : undefined;
  return children.flatMap((child, index) => {
    if (!child || typeof child !== "object") return [];
    const node = child as Record<string, unknown>;
    const scope =
      explicitScope ??
      (legacyScope && legacyEligibleIndexes.has(index)
        ? legacyScope
        : defaultScope);
    if (node.filter && typeof node.filter === "object") {
      return activeFilterSummaries(
        node.filter as Record<string, unknown>,
        criteria,
        names,
        `${path}-${index}`,
      ).map((summary) => ({
        ...summary,
        label: `${scope.join(" › ")} · ${summary.label}`,
      }));
    }
    if (node.group && typeof node.group === "object") {
      return expressionSummaries(
        node.group as Record<string, unknown>,
        criteria,
        names,
        `${path}-${index}`,
        scope,
      );
    }
    return [];
  });
}

function relatedSummary(
  value: Record<string, unknown>,
  criterion: FilterCriterion,
  names: EntityNames,
) {
  const mode =
    value.mode === "every"
      ? "Every match"
      : value.mode === "none" || value.exclude
        ? "No matches"
        : "At least one match";
  const search =
    value.findFilter && typeof value.findFilter === "object"
      ? (value.findFilter as Record<string, unknown>).q
      : undefined;
  const nestedCriteria = [
    ...(criterion.relatedContextCriteria ?? []),
    ...(criterion.relatedCriteria?.() ?? []),
  ];
  const contextFilter = Object.fromEntries(
    nestedCriteria.flatMap((nested) =>
      Object.hasOwn(value, nested.filterKey)
        ? [[nested.filterKey, value[nested.filterKey]]]
        : [],
    ),
  );
  const nestedObject =
    value.objectFilter && typeof value.objectFilter === "object"
      ? (value.objectFilter as Record<string, unknown>)
      : {};
  const nested = activeFilterSummaries(
    { ...contextFilter, ...nestedObject },
    nestedCriteria,
    names,
    criterion.id,
  );
  return [
    mode,
    nested.length
      ? value.conditionOperator === "or"
        ? "Any condition"
        : "All conditions"
      : "",
    typeof search === "string" && search.trim()
      ? `search “${search.trim()}”`
      : "",
    ...nested.map((summary) => `${summary.label}: ${summary.value}`),
  ]
    .filter(Boolean)
    .join(" · ");
}

function remoteIdSummary(
  value: unknown,
  endpointValue: unknown,
  criterion: FilterCriterion,
  names: EntityNames,
) {
  const endpointRecord =
    endpointValue && typeof endpointValue === "object"
      ? (endpointValue as Record<string, unknown>)
      : undefined;
  const endpoint = endpointRecord?.value;
  const service =
    typeof endpoint === "string" && endpoint.trim()
      ? endpoint.trim()
      : "Any metadata service";
  if (!hasFilterValue(value)) {
    const modifier =
      typeof endpointRecord?.modifier === "string"
        ? (modifierLabels[endpointRecord.modifier] ??
          endpointRecord.modifier.toLowerCase().replaceAll("_", " "))
        : "configured";
    return `${service} · ${modifier}`;
  }
  return `${service} · ${filterValueSummary(value, criterion, names)}`;
}

function activeFilterSummaries(
  objectFilter: Record<string, unknown>,
  criteria: FilterCriterion[],
  names: EntityNames,
  keyPrefix = "filter",
): FilterSummary[] {
  const processed = new Set<string>();
  return Object.entries(objectFilter).flatMap(([key, value], index) => {
    if (key === "_criterionId" || processed.has(key) || !hasFilterValue(value))
      return [];
    if (key === "_filterExpression" && value && typeof value === "object") {
      return expressionSummaries(
        value as Record<string, unknown>,
        criteria,
        names,
        `${keyPrefix}-${index}`,
      );
    }
    const criterion = findCriterion(criteria, key);
    if (criterion?.secondaryFilterKey) {
      processed.add(criterion.filterKey);
      processed.add(criterion.secondaryFilterKey);
      return [
        {
          key: `${keyPrefix}-${criterion.filterKey}`,
          label: criterion.label,
          value: remoteIdSummary(
            objectFilter[criterion.filterKey],
            objectFilter[criterion.secondaryFilterKey],
            criterion,
            names,
          ),
        },
      ];
    }
    if (criterion?.type === "related" && value && typeof value === "object") {
      return [
        {
          key: `${keyPrefix}-${key}`,
          label: criterion.label,
          value: relatedSummary(
            value as Record<string, unknown>,
            criterion,
            names,
          ),
        },
      ];
    }
    return [
      {
        key: `${keyPrefix}-${key}`,
        label: filterLabel(key, criteria),
        value: filterValueSummary(value, criterion, names),
      },
    ];
  });
}

type EntityReference = { entityType: string; id: number };

function collectEntityReferences(
  objectFilter: Record<string, unknown>,
  criteria: FilterCriterion[],
  references: Map<string, EntityReference>,
) {
  for (const [key, value] of Object.entries(objectFilter)) {
    if (!value || typeof value !== "object") continue;
    if (key === "_filterExpression") {
      const children = (value as Record<string, unknown>).children;
      if (!Array.isArray(children)) continue;
      for (const child of children) {
        if (!child || typeof child !== "object") continue;
        const node = child as Record<string, unknown>;
        if (node.filter && typeof node.filter === "object") {
          collectEntityReferences(
            node.filter as Record<string, unknown>,
            criteria,
            references,
          );
        }
        if (node.group && typeof node.group === "object") {
          collectEntityReferences(
            { _filterExpression: node.group },
            criteria,
            references,
          );
        }
      }
      continue;
    }
    const criterion = findCriterion(criteria, key);
    if (!criterion) continue;
    const record = value as Record<string, unknown>;
    const embeddedNames =
      record._names && typeof record._names === "object"
        ? (record._names as Record<string, unknown>)
        : undefined;
    const addIds = (entityType: string | undefined, values: unknown) => {
      if (!entityType || !Array.isArray(values)) return;
      for (const id of values) {
        if (
          typeof id === "number" &&
          typeof embeddedNames?.[String(id)] !== "string"
        ) {
          references.set(`${entityType}:${id}`, { entityType, id });
        }
      }
    };
    if (criterion.type === "multiId") {
      addIds(criterion.entityType, record.value);
      addIds(criterion.entityType, record.excludes);
    }
    if (criterion.type === "tagDuration") {
      const clauses = Array.isArray(record.clauses) ? record.clauses : [record];
      for (const clause of clauses) {
        const tagId =
          clause && typeof clause === "object"
            ? (clause as Record<string, unknown>).tagId
            : undefined;
        if (
          typeof tagId === "number" &&
          typeof embeddedNames?.[String(tagId)] !== "string"
        ) {
          references.set(`tags:${tagId}`, { entityType: "tags", id: tagId });
        }
      }
    }
    if (criterion.type === "related") {
      const nestedCriteria = [
        ...(criterion.relatedContextCriteria ?? []),
        ...(criterion.relatedCriteria?.() ?? []),
      ];
      const contextFilter = Object.fromEntries(
        nestedCriteria.flatMap((nested) =>
          Object.hasOwn(record, nested.filterKey)
            ? [[nested.filterKey, record[nested.filterKey]]]
            : [],
        ),
      );
      const nestedObject =
        record.objectFilter && typeof record.objectFilter === "object"
          ? (record.objectFilter as Record<string, unknown>)
          : {};
      collectEntityReferences(
        { ...contextFilter, ...nestedObject },
        nestedCriteria,
        references,
      );
    }
  }
}

function useFilterEntityNames(
  objectFilter: Record<string, unknown>,
  criteria: FilterCriterion[],
  enabled: boolean,
) {
  const [names, setNames] = useState<EntityNames>(new Map());
  const signature = JSON.stringify(objectFilter);
  useEffect(() => {
    if (!enabled) return;
    const references = new Map<string, EntityReference>();
    collectEntityReferences(objectFilter, criteria, references);
    if (!references.size) return;
    let active = true;
    void Promise.all(
      [...references.entries()].map(async ([key, reference]) => {
        try {
          const entity = await request<Record<string, unknown>>(
            `/api/${reference.entityType}/${reference.id}`,
          );
          const label = [
            entity.name,
            entity.title,
            entity.label,
            entity.basename,
          ].find((value) => typeof value === "string" && value.trim());
          return [
            key,
            typeof label === "string" ? label : `Item ${reference.id}`,
          ] as const;
        } catch {
          return [key, `Item ${reference.id}`] as const;
        }
      }),
    ).then((resolved) => {
      if (active) setNames(new Map(resolved));
    });
    return () => {
      active = false;
    };
  }, [criteria, enabled, objectFilter, signature]);
  return names;
}

export function QueueFilterPanel({
  objectFilter,
  overridden,
  disabled,
  onAdjustQueue,
  onApply,
  onReset,
}: {
  objectFilter: Record<string, unknown>;
  overridden: boolean;
  disabled: boolean;
  onAdjustQueue(): void;
  onApply(objectFilter: Record<string, unknown>): void;
  onReset(): void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const criteria = VIDEO_CRITERIA as unknown as FilterCriterion[];
  const entityNames = useFilterEntityNames(objectFilter, criteria, expanded);
  const activeFilters = useMemo(
    () => activeFilterSummaries(objectFilter, criteria, entityNames),
    [criteria, entityNames, objectFilter],
  );
  const activeCount = activeFilters.length;
  return (
    <section
      className="dq-filter-panel"
      aria-label="Queue filters and settings"
    >
      <div className="dq-filter-toolbar">
        <button
          type="button"
          className="dq-filter-disclosure"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          <span aria-hidden="true">›</span>
          Current filters
          {overridden && <em>Adjusted</em>}
        </button>
        <button
          type="button"
          className="dq-button"
          disabled={disabled}
          onClick={onAdjustQueue}
        >
          Adjust queue
        </button>
        <button
          type="button"
          className={`dq-filter-button${activeCount ? " active" : ""}`}
          aria-label={
            activeCount ? `Filters, ${activeCount} active` : "Filters"
          }
          disabled={disabled}
          onClick={() => setFiltersOpen(true)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 4h18v3l-7 7v4l-4 3v-7L3 7V4z" />
          </svg>
          Filters
          {activeCount > 0 && <span aria-hidden="true">{activeCount}</span>}
        </button>
      </div>
      {expanded && (
        <div className="dq-filter-panel-body">
          {activeCount ? (
            <div
              className={`dq-current-filter-chips${disabled ? " dq-filter-chips-disabled" : ""}`}
              role="region"
              aria-label="Current queue filters"
              aria-disabled={disabled || undefined}
              inert={disabled ? true : undefined}
            >
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  aria-label={`Edit filter: ${filter.label}`}
                  onClick={() => {
                    if (!disabled) setFiltersOpen(true);
                  }}
                >
                  <strong>{filter.label}:</strong> {filter.value}
                </button>
              ))}
            </div>
          ) : (
            <p>No video filters. All videos can enter the queue.</p>
          )}
          <div className="dq-filter-panel-actions">
            {overridden && (
              <button
                type="button"
                className="dq-button"
                disabled={disabled}
                onClick={onReset}
              >
                Reset filters to review defaults
              </button>
            )}
          </div>
        </div>
      )}
      {filtersOpen && (
        <div onKeyDown={(event) => event.stopPropagation()}>
          <FilterDialog
            open
            onClose={() => setFiltersOpen(false)}
            criteria={VIDEO_CRITERIA}
            activeFilter={objectFilter}
            supportsFilterExpressions
            subjectLabel="videos"
            onApply={(nextFilter) => {
              if (disabled) return;
              onApply(nextFilter);
              setFiltersOpen(false);
            }}
          />
        </div>
      )}
    </section>
  );
}

export function QueueEditor({
  draft,
  onChange,
  presentation = true,
  queue = true,
}: {
  draft: VideoReview;
  onChange(review: VideoReview): void;
  presentation?: boolean;
  queue?: boolean;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filter = draft.view.filter;
  const updateFilter = (change: Record<string, unknown>) =>
    onChange({
      ...draft,
      view: { ...draft.view, filter: { ...filter, ...change } },
    });
  const settings = draft.presentation ?? {};
  const updatePresentation = (
    change: NonNullable<VideoReview["presentation"]>,
  ) => onChange({ ...draft, presentation: { ...settings, ...change } });
  return (
    <>
      {queue && (
        <fieldset className="dq-queue-fields">
          <legend>Queue</legend>
          <label>
            Search
            <input
              value={String(filter.q ?? "")}
              onChange={(e) => updateFilter({ q: e.target.value })}
            />
          </label>
          <div className="dq-field-grid">
            <label>
              Sort
              <select
                aria-label="Sort"
                value={String(filter.sort ?? "date")}
                onChange={(e) =>
                  updateFilter({ sort: e.target.value, sorts: undefined })
                }
              >
                {!VIDEO_SORT_OPTIONS.some((o) => o.value === filter.sort) &&
                  filter.sort != null && (
                    <option value={String(filter.sort)}>
                      {String(filter.sort)}
                    </option>
                  )}
                {VIDEO_SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Direction
              <select
                aria-label="Direction"
                value={String(filter.direction ?? "desc")}
                onChange={(e) => updateFilter({ direction: e.target.value })}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
            <label>
              Videos per page
              <input
                type="number"
                min="1"
                max="100"
                value={Number(filter.perPage) || 40}
                onChange={(e) =>
                  updateFilter({
                    perPage: Math.max(
                      1,
                      Math.min(100, Number(e.target.value) || 40),
                    ),
                  })
                }
              />
            </label>
          </div>
          <button
            type="button"
            className="dq-button"
            onClick={() => setFiltersOpen(true)}
          >
            Edit video filters
          </button>
          <p>
            {Object.keys(draft.view.objectFilter).length
              ? "Video filters configured"
              : "No video filters"}
            . Choose which videos enter the queue.
          </p>
          {filtersOpen && (
            <div onKeyDown={(e) => e.stopPropagation()}>
              <FilterDialog
                open
                onClose={() => setFiltersOpen(false)}
                criteria={VIDEO_CRITERIA}
                activeFilter={draft.view.objectFilter}
                supportsFilterExpressions
                subjectLabel="videos"
                onApply={(objectFilter) => {
                  onChange({ ...draft, view: { ...draft.view, objectFilter } });
                  setFiltersOpen(false);
                }}
              />
            </div>
          )}
        </fieldset>
      )}
      {presentation && (
        <>
          <h3>Appearance</h3>
          <p className="dq-editor-note">
            Choose how videos and tags appear while reviewing.
          </p>
          <div className="dq-field-grid">
            <label>
              Preferred view
              <select
                value={draft.view.displayMode === "wall" ? "wall" : "grid"}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    view: {
                      ...draft.view,
                      displayMode: e.target.value as "grid" | "wall",
                    },
                  })
                }
              >
                {["grid", "wall"].map((mode) => (
                  <option key={mode}>{mode}</option>
                ))}
              </select>
            </label>
          </div>
          <h4>Card annotations</h4>
          <div className="dq-annotation-options">
            {(["date", "studio", "performers", "tags"] as const).map((name) => {
              const selected = settings.annotations ?? [];
              return (
                <label key={name} className="dq-checkbox">
                  <input
                    type="checkbox"
                    checked={selected.includes(name)}
                    onChange={(e) =>
                      updatePresentation({
                        annotations: e.target.checked
                          ? [...selected, name]
                          : selected.filter((x) => x !== name),
                      })
                    }
                  />
                  {name}
                </label>
              );
            })}
          </div>
          {(settings.annotations ?? []).includes("tags") && (
            <>
              <p>
                Choose parent tags. Only their descendant tags appear on the
                card; no tags appear until a parent is selected.
              </p>
              <EntityReferenceMultiSelector
                entityType="tag"
                values={settings.annotationParents ?? []}
                placeholder="Search annotation parent tags..."
                onChange={(annotationParents) =>
                  updatePresentation({ annotationParents })
                }
                allowCreate={false}
              />
            </>
          )}
          <h4>Tag bins</h4>
          <p>
            Choose parent tags. Their descendants become temporary queue
            filters. Counts describe the loaded page.
          </p>
          <EntityReferenceMultiSelector
            entityType="tag"
            values={settings.binParents ?? []}
            placeholder="Search tag-bin parent tags..."
            onChange={(binParents) => updatePresentation({ binParents })}
            allowCreate={false}
          />
        </>
      )}
    </>
  );
}
