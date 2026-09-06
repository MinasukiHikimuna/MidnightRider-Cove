const MODIFIER_LABELS: Record<string, string> = {
  EQUALS: "Equals",
  NOT_EQUALS: "Does Not Equal",
  GREATER_THAN: ">",
  LESS_THAN: "<",
  INCLUDES: "Includes",
  EXCLUDES: "Excludes",
  INCLUDES_ALL: "Includes All",
  EXCLUDES_ALL: "Excludes All",
  IS_NULL: "Is Null",
  NOT_NULL: "Not Null",
  BETWEEN: "Between",
  NOT_BETWEEN: "Not Between",
  MATCHES_REGEX: "Regex",
  NOT_MATCHES_REGEX: "Not Regex",
  UNDER_PATH: "Under",
  NOT_UNDER_PATH: "Not Under",
};

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

function fieldLabel(key: string) {
  const words = key.replaceAll("_", " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : "Custom field";
}

export function unresolvedCustomFieldTagIds(
  objectFilter: Record<string, unknown>,
): number[] {
  return [
    ...new Set(
      criteria(objectFilter.customFieldCriteria)
        .filter(
          (criterion) => String(criterion.type).toLowerCase() === "tag",
        )
        .flatMap((criterion) => [
          [criterion.value, criterion.displayValue],
          [criterion.value2, criterion.displayValue2],
        ])
        .filter(([, displayValue]) => !String(displayValue ?? "").trim())
        .map(([value]) => value)
        .map(Number)
        .filter((id) => Number.isSafeInteger(id) && id > 0),
    ),
  ];
}

export function presentCustomFieldCriteria(
  objectFilter: Record<string, unknown>,
  tagNames: Record<string, string>,
): Record<string, unknown> {
  const customFieldCriteria = criteria(objectFilter.customFieldCriteria);
  if (!customFieldCriteria.length) return objectFilter;
  return {
    ...objectFilter,
    customFieldCriteria: customFieldCriteria.map((criterion) => {
      const key = String(criterion.key ?? "");
      const modifier = MODIFIER_LABELS[String(criterion.modifier ?? "EQUALS")];
      const display = (value: unknown, persisted: unknown) =>
        String(persisted ?? "").trim() ||
        tagNames[String(value)] ||
        String(value ?? "");
      const displayValue = display(
        criterion.value,
        criterion.displayValue,
      );
      const displayValue2 = display(
        criterion.value2,
        criterion.displayValue2,
      );
      const modifierKey = String(criterion.modifier ?? "EQUALS");
      const values =
        modifierKey === "IS_NULL" || modifierKey === "NOT_NULL"
          ? []
          : modifierKey === "BETWEEN" || modifierKey === "NOT_BETWEEN"
            ? [displayValue, "and", displayValue2]
            : [displayValue];
      return {
        ...criterion,
        label: [fieldLabel(key), modifier, ...values]
          .filter(Boolean)
          .join(" "),
      };
    }),
  };
}

export function stripCustomFieldPresentation(
  objectFilter: Record<string, unknown>,
): Record<string, unknown> {
  const customFieldCriteria = criteria(objectFilter.customFieldCriteria);
  if (!customFieldCriteria.length) return objectFilter;
  return {
    ...objectFilter,
    customFieldCriteria: customFieldCriteria.map(({ label: _label, ...criterion }) =>
      criterion,
    ),
  };
}

export function preserveCustomFieldCriteria(
  current: Record<string, unknown>,
  next: Record<string, unknown>,
  allowRemoval: boolean,
): Record<string, unknown> {
  if (
    allowRemoval ||
    "customFieldCriteria" in next ||
    !Array.isArray(current.customFieldCriteria)
  )
    return next;
  return { ...next, customFieldCriteria: current.customFieldCriteria };
}
