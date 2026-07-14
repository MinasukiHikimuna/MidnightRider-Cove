import React from "@cove/runtime/react";

const { useEffect, useState } = React;
const h = React.createElement;
const CONFIG_URL = "/api/plugins/hash-the-cove/config";

const choices = [
  {
    key: "xxhash",
    label: "xxHash64",
    description: "Calculate fast xxHash64 whole-file fingerprints.",
    defaultValue: false,
    group: "algorithms",
  },
  {
    key: "sha256",
    label: "SHA-256",
    description: "Calculate SHA-256 whole-file fingerprints.",
    defaultValue: false,
    group: "algorithms",
  },
  {
    key: "sha1",
    label: "SHA-1",
    description: "Calculate SHA-1 whole-file fingerprints for compatibility with existing libraries.",
    defaultValue: false,
    group: "algorithms",
  },
  {
    key: "hash_videos",
    label: "Videos",
    description: "Include Cove video files when calculating missing fingerprints.",
    defaultValue: true,
    group: "media",
  },
  {
    key: "hash_galleries",
    label: "Galleries",
    description: "Include Cove gallery archive files when calculating missing fingerprints.",
    defaultValue: true,
    group: "media",
  },
];

function normalizeConfig(config) {
  const normalized = { ...(config || {}) };
  for (const choice of choices) {
    normalized[choice.key] = typeof normalized[choice.key] === "boolean"
      ? normalized[choice.key]
      : choice.defaultValue;
  }
  return normalized;
}

async function requestConfig(options) {
  const response = await fetch(CONFIG_URL, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || response.statusText || "Request failed.");
  }
  if (response.status === 204 || options?.method === "POST") return null;
  return response.json();
}

function Choice({ choice, checked, disabled, onChange }) {
  return h("label", {
    className: "flex items-start gap-3 rounded-md border border-border bg-surface px-3 py-3",
  }, [
    h("input", {
      key: "input",
      type: "checkbox",
      checked,
      disabled,
      onChange: (event) => onChange(event.target.checked),
      className: "mt-0.5 h-4 w-4 rounded border-border bg-card text-accent focus:ring-0 disabled:opacity-60",
    }),
    h("span", { key: "copy", className: "min-w-0" }, [
      h("span", { key: "label", className: "block text-sm font-medium text-foreground" }, choice.label),
      h("span", { key: "description", className: "mt-0.5 block text-xs text-secondary" }, choice.description),
    ]),
  ]);
}

function ChoiceGroup({ title, description, group, config, disabled, onChange }) {
  return h("section", { className: "space-y-2" }, [
    h("div", { key: "heading" }, [
      h("h3", { key: "title", className: "text-base font-semibold text-foreground" }, title),
      h("p", { key: "description", className: "text-sm text-secondary" }, description),
    ]),
    h("div", { key: "choices", className: "grid gap-2" }, choices
      .filter((choice) => choice.group === group)
      .map((choice) => h(Choice, {
        key: choice.key,
        choice,
        checked: Boolean(config[choice.key]),
        disabled,
        onChange: (value) => onChange(choice.key, value),
      }))),
  ]);
}

function HashTheCoveSettings() {
  const [config, setConfig] = useState(normalizeConfig(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await requestConfig();
        if (!cancelled) setConfig(normalizeConfig(loaded));
      } catch (error) {
        if (!cancelled) setMessage(error.message || "Failed to load Hash The Cove settings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function update(key, value) {
    setConfig((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      await requestConfig({ method: "POST", body: JSON.stringify(config) });
      setMessage("Settings saved.");
    } catch (error) {
      setMessage(error.message || "Failed to save Hash The Cove settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return h("p", { className: "text-sm text-secondary" }, "Loading Hash The Cove settings...");
  }

  const hasAlgorithm = config.xxhash || config.sha256 || config.sha1;
  return h("div", { className: "space-y-5" }, [
    h(ChoiceGroup, {
      key: "algorithms",
      title: "Hash algorithms",
      description: "Only enabled algorithms are checked and calculated. Existing fingerprints are left unchanged.",
      group: "algorithms",
      config,
      disabled: saving,
      onChange: update,
    }),
    !hasAlgorithm
      ? h("p", {
          key: "algorithm-warning",
          className: "rounded-md border border-border bg-muted/30 p-3 text-sm text-secondary",
        }, "No hash algorithm is enabled. Running Hash The Cove will not process any files.")
      : null,
    h(ChoiceGroup, {
      key: "media",
      title: "File types",
      description: "Choose which Cove file records are included in the preflight count and hashing job.",
      group: "media",
      config,
      disabled: saving,
      onChange: update,
    }),
    h("div", { key: "actions", className: "flex items-center justify-end gap-3" }, [
      message ? h("span", { key: "message", className: "text-sm text-secondary" }, message) : null,
      h("button", {
        key: "save",
        type: "button",
        disabled: saving,
        onClick: save,
        className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60",
      }, saving ? "Saving..." : "Save settings"),
    ]),
  ]);
}

export default {
  components: {
    HashTheCoveSettings,
  },
};
