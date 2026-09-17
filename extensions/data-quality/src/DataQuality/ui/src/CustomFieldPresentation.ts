type CustomFieldCriterion = Record<string, unknown> & {
  key?: unknown;
  type?: unknown;
  value?: unknown;
  modifier?: unknown;
  displayValue?: unknown;
  value2?: unknown;
  displayValue2?: unknown;
};

function criteria(value: unknown): CustomFieldCriterion[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is CustomFieldCriterion =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item),
      )
    : [];
}

function isTagCriterion(criterion: CustomFieldCriterion) {
  return String(criterion.type).toLowerCase() === "tag";
}

function hasDisplayValue(value: unknown) {
  return Boolean(String(value ?? "").trim());
}

/**
 * Tag ids referenced by custom field criteria that carry no persisted display value. Cove's filter
 * chips would otherwise describe them as an anonymous selected tag, so the workspace resolves their
 * names once per query and presents them through {@link presentCustomFieldCriteria}.
 */
export function unresolvedCustomFieldTagIds(
  objectFilter: Record<string, unknown>,
): number[] {
  return [
    ...new Set(
      criteria(objectFilter.customFieldCriteria)
        .filter(isTagCriterion)
        .flatMap((criterion) => [
          [criterion.value, criterion.displayValue],
          [criterion.value2, criterion.displayValue2],
        ])
        .filter(([, displayValue]) => !hasDisplayValue(displayValue))
        .map(([value]) => value)
        .map(Number)
        .filter((id) => Number.isSafeInteger(id) && id > 0),
    ),
  ];
}

/**
 * Fills the display value of tag criteria from resolved names so Cove's toolbar summarizes them by
 * name. Persisted display values win and criteria without a resolved name are left untouched.
 */
export function presentCustomFieldCriteria(
  objectFilter: Record<string, unknown>,
  tagNames: Record<string, string>,
): Record<string, unknown> {
  const customFieldCriteria = criteria(objectFilter.customFieldCriteria);
  if (!customFieldCriteria.length) return objectFilter;
  let changed = false;
  const presented = customFieldCriteria.map((criterion) => {
    if (!isTagCriterion(criterion)) return criterion;
    const next = { ...criterion };
    for (const [valueKey, displayKey] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"],
    ] as const) {
      const name = tagNames[String(criterion[valueKey] ?? "")];
      if (name && !hasDisplayValue(criterion[displayKey])) {
        next[displayKey] = name;
        changed = true;
      }
    }
    return next;
  });
  return changed
    ? { ...objectFilter, customFieldCriteria: presented }
    : objectFilter;
}

/**
 * Reverses {@link presentCustomFieldCriteria} on a filter the toolbar hands back, so a name resolved
 * only for display is not written into the review query or the URL. A display value is removed only
 * when it equals the resolved name and the matching criterion in `original` carried none, so a value
 * the user persisted stays even when another criterion referenced the same tag.
 */
export function stripCustomFieldPresentation(
  objectFilter: Record<string, unknown>,
  tagNames: Record<string, string>,
  original: Record<string, unknown>,
): Record<string, unknown> {
  const customFieldCriteria = criteria(objectFilter.customFieldCriteria);
  if (!customFieldCriteria.length) return objectFilter;
  const originals = criteria(original.customFieldCriteria);
  const same = (left: CustomFieldCriterion, right: CustomFieldCriterion) =>
    (["key", "jsonPath", "modifier", "value", "value2"] as const).every(
      (field) => (left[field] ?? undefined) === (right[field] ?? undefined),
    );
  let changed = false;
  const stripped = customFieldCriteria.map((criterion) => {
    if (!isTagCriterion(criterion)) return criterion;
    const source = originals.find((candidate) => same(candidate, criterion));
    if (!source) return criterion;
    const next = { ...criterion };
    for (const [valueKey, displayKey] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"],
    ] as const) {
      const name = tagNames[String(criterion[valueKey] ?? "")];
      if (
        name &&
        criterion[displayKey] === name &&
        !hasDisplayValue(source[displayKey])
      ) {
        delete next[displayKey];
        changed = true;
      }
    }
    return next;
  });
  return changed
    ? { ...objectFilter, customFieldCriteria: stripped }
    : objectFilter;
}
