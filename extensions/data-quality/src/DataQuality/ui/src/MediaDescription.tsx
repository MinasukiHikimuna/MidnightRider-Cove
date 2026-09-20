import { useCallback, useState } from "react";
import { NarrativeText } from "@cove/runtime/components";

const COLLAPSED_KEY = "data-quality.description-collapsed.v1";

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "true";
  } catch {
    // A browser without accessible storage simply starts expanded each time.
    return false;
  }
}

/**
 * The description beneath the player. Audios carry no picture, so their details usually hold
 * what a video shows: it stays visible while the audio plays instead of living behind a tab.
 * The collapsed choice is a per-browser convenience, deliberately not part of the saved review.
 */
export function MediaDescription({
  details,
  label,
}: {
  details?: string;
  label: string;
}) {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const toggle = useCallback(() => {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next));
      } catch {
        // The choice applies to this page view when it cannot be stored.
      }
      return next;
    });
  }, []);
  return (
    <section className="dq-review-description" aria-label={`${label} description`}>
      <button
        type="button"
        className="dq-button dq-description-toggle"
        aria-expanded={!collapsed}
        onClick={toggle}
      >
        Description
      </button>
      {!collapsed &&
        (details?.trim() ? (
          <NarrativeText className="dq-description-body">{details}</NarrativeText>
        ) : (
          <p className="dq-description-body dq-description-empty">
            No description.
          </p>
        ))}
    </section>
  );
}
