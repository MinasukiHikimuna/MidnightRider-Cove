import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sourceUrl = new URL("../src/StashFilterImporter/ui/StashFilterImporter.js", import.meta.url);
const analyzerUrl = new URL("../src/StashFilterImporter/StashFilterAnalyzer.cs", import.meta.url);
const manifestUrl = new URL("../src/StashFilterImporter/extension.json", import.meta.url);

test("declares the compiled package and scoped UI assets", async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  const css = await readFile(new URL("../src/StashFilterImporter/ui/StashFilterImporter.css", import.meta.url), "utf8");
  assert.equal(manifest.id, "com.midnightrider.stash-filter-importer");
  assert.equal(manifest.version, "1.0.0");
  assert.equal(manifest.minCoveVersion, "1.1.1-dev.0");
  assert.equal(manifest.entryDll, "StashFilterImporter.dll");
  assert.equal(manifest.jsBundle, "ui/StashFilterImporter.js");
  assert.equal(manifest.cssBundle, "ui/StashFilterImporter.css");
  assert.ok(css.split("\n").filter((line) => line.trim().endsWith("{") && !line.trim().startsWith("@media"))
    .every((line) => line.trim().startsWith(".stash-filter-importer-")));
  assert.doesNotMatch(css, /--color-text-secondary/);
  assert.match(css, /color:\s*var\(--color-secondary\)/);
});

test("does not run a full SQLite quick check during normal analysis", async () => {
  const analyzer = await readFile(analyzerUrl, "utf8");
  assert.doesNotMatch(analyzer, /quick_check/i);
});

test("presents a page heading and explains adapter-assisted review", async () => {
  const source = await readFile(sourceUrl, "utf8");
  const css = await readFile(new URL("../src/StashFilterImporter/ui/StashFilterImporter.css", import.meta.url), "utf8");
  assert.match(source, /h\("h1", \{ key: "title" \}, "Stash Filter Importer"\)/);
  assert.match(source, /Cove and Stash use different filter models/);
  assert.match(source, /cannot be migrated one-to-one/);
  assert.match(source, /adds adapters for compatible criteria/);
  assert.match(source, /review potential mismatches before importing/);
  assert.match(css, /\.stash-filter-importer-page > header\s*\{/);
  assert.match(css, /\.stash-filter-importer-page > header h1\s*\{[\s\S]*?font-size:\s*1\.75rem/);
});

test("uses authenticated APIs and browser-persisted path state", async () => {
  const source = await readFile(sourceUrl, "utf8");
  assert.match(source, /import \{ extensionFetch \} from "@cove\/runtime\/api"/);
  assert.match(source, /request\(`\$\{API\}\/analyze`/);
  assert.match(source, /request\(`\/api\/savedfilters\?mode=\$\{encodeURIComponent\(mode\)\}`\)/);
  const declarations = source.match(/function loadRememberedPath[\s\S]*?(?=\nasync function request)/)?.[0];
  const helpers = Function("localStorage",
    `"use strict"; const PATH_STORAGE_KEY = "test"; ${declarations}; return { loadRememberedPath, rememberPath };`);
  let stored = "";
  const working = helpers({
    getItem: () => "remembered",
    setItem: (_key, value) => { stored = value; },
  });
  assert.equal(working.loadRememberedPath(), "remembered");
  working.rememberPath("next");
  assert.equal(stored, "next");
  const denied = helpers({
    getItem: () => { throw new Error("denied"); },
    setItem: () => { throw new Error("denied"); },
  });
  assert.equal(denied.loadRememberedPath(), "");
  assert.doesNotThrow(() => denied.rememberPath("in-memory"));
  assert.doesNotMatch(source, /sessionStorage|document\.cookie/);
});

test("renders direct, adapted, and unsupported statuses and starts with no selections", async () => {
  const source = await readFile(sourceUrl, "utf8");
  assert.match(source, /direct:\s*"Direct"/);
  assert.match(source, /adapted:\s*"Adapted"/);
  assert.match(source, /unsupported:\s*"Unsupported"/);
  assert.match(source, /May not match Stash 100%/);
  assert.match(source, /useState\(new Set\(\)\)/);
  assert.match(source, /aria-expanded/);
  assert.match(source, /"aria-controls": rulesId/);
  assert.match(source, /Show"\s*:\s*"Hide"|"Hide"\s*:\s*"Show"/);
  const declaration = source.match(/function isTerminalResult[\s\S]*?(?=\n\nconst ENTITY_TYPES)/)?.[0];
  const helpers = Function(`"use strict"; ${declaration}; return { isRowDisabled, isTerminalResult };`)();
  const { isRowDisabled, isTerminalResult } = helpers;
  assert.equal(isRowDisabled({ importable: false }, false, false, null), true);
  assert.equal(isRowDisabled({ importable: true }, true, false, null), true);
  assert.equal(isRowDisabled({ importable: true }, false, { status: "success" }), true);
  assert.equal(isRowDisabled({ importable: true }, false, { status: "exists" }), true);
  assert.equal(isRowDisabled({ importable: true }, false, { status: "failure" }), false);
  assert.equal(isTerminalResult({ status: "success" }), true);
  assert.equal(isTerminalResult({ status: "exists" }), true);
  assert.equal(isTerminalResult({ status: "failure" }), false);
  assert.equal(isRowDisabled({ importable: true }, false, false, null), false);
});

test("shows every entity type in Cove navigation order and uses Cove terminology", async () => {
  const source = await readFile(sourceUrl, "utf8");
  const declarations = source.match(/const ENTITY_TYPES[\s\S]*?(?=\n\nasync function importReadyFilters)/)?.[0];
  const helpers = Function(`"use strict"; ${declarations}; return { formatMode, groupFilters, summarizeFilters, importSummaryText };`)();
  const groups = helpers.groupFilters([
    { sourceMode: "SCENES", sourceId: "3", name: "zeta" },
    { sourceMode: "PERFORMERS", sourceId: "2", name: "Bravo" },
    { sourceMode: "SCENES", sourceId: "1", name: "Alpha" },
    { sourceMode: "PERFORMERS", sourceId: "1", name: "alpha" },
  ]);

  assert.deepEqual(groups.map((group) => group.mode), [
    "SCENES", "IMAGES", "GALLERIES", "SCENE_MARKERS", "PERFORMERS", "TAGS", "STUDIOS",
  ]);
  assert.deepEqual(groups.map((group) => group.label), [
    "Videos", "Images", "Galleries", "Segments", "Performers", "Tags", "Studios",
  ]);
  assert.deepEqual(groups[0].filters.map((filter) => filter.name), ["Alpha", "zeta"]);
  assert.deepEqual(groups[4].filters.map((filter) => filter.name), ["alpha", "Bravo"]);
  assert.equal(helpers.formatMode("SCENES"), "Videos");
  assert.equal(helpers.formatMode("SCENE_MARKERS"), "Segments");
  assert.doesNotMatch(source, /h\("span"[^\n]*filter\.sourceMode/, "rows must not display raw Stash mode names");
  assert.deepEqual(helpers.summarizeFilters([
    { status: "direct", importable: true },
    { status: "adapted", importable: true },
    { status: "unsupported", importable: false },
  ]), { direct: 1, adapted: 1, unsupported: 1, importable: 2 });
  assert.deepEqual(helpers.importSummaryText({ direct: 1, adapted: 2, unsupported: 1, importable: 3 }), {
    primary: "3 of 4 filters are importable.",
    adapted: "2 importable filters are adapted and may not match Stash 100%.",
    unsupported: "1 filter is unsupported.",
  });
  assert.doesNotMatch(source, /\.toSorted\(/);
  assert.doesNotMatch(source, /role: "tab(list|panel)?"/);
  assert.match(source, /stash-filter-importer-entity-section/);
  assert.match(source, /No saved filters found\./);
  assert.doesNotMatch(source, /\$\{group\.filters\.length\} filters/);
});

test("filters the review list by direct, adapted, and unsupported status", async () => {
  const source = await readFile(sourceUrl, "utf8");
  const declarations = source.match(/function filterFiltersByStatus[\s\S]*?(?=\n\nfunction summarizeFilters)/)?.[0];
  const helpers = Function(`"use strict"; ${declarations}; return { filterFiltersByStatus, clearSelectionForStatus, emptyGroupMessage };`)();
  const filters = [{ status: "direct" }, { status: "adapted" }, { status: "unsupported" }];
  assert.deepEqual(helpers.filterFiltersByStatus(filters, new Set(["adapted"])), [filters[1]]);
  const selected = new Set(["direct", "adapted", "unsupported"]);
  assert.deepEqual([...helpers.clearSelectionForStatus(selected, filters.map((filter, index) => ({
    ...filter, sourceId: filter.status,
  })), "adapted")].sort(), ["direct", "unsupported"]);
  assert.equal(helpers.emptyGroupMessage([{ sourceMode: "SCENES" }], "SCENES"),
    "No filters match the selected statuses.");
  assert.equal(helpers.emptyGroupMessage([], "SCENES"), "No saved filters found.");
  assert.match(source, /Filter by status/);
  assert.match(source, /Show \$\{label\}/);
});

test("select all targets only eligible filters globally or within one entity type", async () => {
  const source = await readFile(sourceUrl, "utf8");
  const declarations = source.match(/function isTerminalResult[\s\S]*?(?=\n\nasync function importReadyFilters)/)?.[0];
  const helpers = Function(`"use strict"; ${declarations}; return { selectionState, toggleFilterSelection };`)();
  const filters = [
    { sourceId: "ready-one", importable: true },
    { sourceId: "ready-two", importable: true },
    { sourceId: "unsupported", importable: false },
    { sourceId: "conflict", importable: true },
    { sourceId: "exists", importable: true },
    { sourceId: "complete", importable: true },
  ];
  const alreadyInCove = new Set(["conflict", "exists"]);
  const results = { complete: { status: "success" }, retry: { status: "failure", message: "Temporary failure" } };
  filters.push({ sourceId: "retry", importable: true });

  let selected = helpers.toggleFilterSelection(new Set(["other-entity"]), filters, alreadyInCove, results);
  assert.deepEqual([...selected].sort(), ["other-entity", "ready-one", "ready-two", "retry"]);
  assert.deepEqual(helpers.selectionState(filters, selected, alreadyInCove, results), {
    all: true, some: true, selected: 3, total: 3,
  });
  selected = helpers.toggleFilterSelection(selected, filters, alreadyInCove, results);
  assert.deepEqual([...selected], ["other-entity"], "clearing one entity type must preserve other selections");
  assert.match(source, /Select all importable filters/);
  assert.match(source, /Select all in \$\{group\.label\}/);
  assert.doesNotMatch(source, /\$\{state\.selected\}\/\$\{state\.total\}/);
});

test("submits exact ready payloads sequentially and records per-filter outcomes", async () => {
  const source = await readFile(sourceUrl, "utf8");
  const declarations = source.match(/function normalizeName[\s\S]*?(?=\n\nfunction StatusBadge)/)?.[0];
  const importReadyFilters = Function(`"use strict"; ${declarations}; return importReadyFilters;`)();
  const payloads = [
    { mode: "Videos", name: "First", findFilter: "{}", objectFilter: "{}", uiOptions: "{}" },
    { mode: "Videos", name: "Second", findFilter: "{\"sort\":\"title\"}", objectFilter: "{\"playCountCriterion\":{\"value\":1,\"modifier\":\"EQUALS\"}}", uiOptions: "{}" },
  ];
  const filters = payloads.map((payload, index) => ({ sourceId: String(index), name: payload.name, importable: true, payload }));
  const calls = [];
  const progress = [];
  const result = await importReadyFilters(filters, new Set(["0", "1"]), [], {}, async (payload) => {
    calls.push(payload);
    if (payload.name === "Second") throw Object.assign(new Error("duplicate"), { status: 409 });
  }, (value) => progress.push(value));
  assert.deepEqual(calls, payloads, "ready payload objects must be submitted unchanged and in inventory order");
  assert.equal(result["0"].status, "success");
  assert.equal(result["1"].status, "exists");
  assert.equal(result["1"].message, "Already in Cove");
  assert.equal(progress.length, 2);
});

test("keeps failed imports selectable and retries them", async () => {
  const source = await readFile(sourceUrl, "utf8");
  const declarations = source.match(/function normalizeName[\s\S]*?(?=\n\nfunction StatusBadge)/)?.[0];
  const helpers = Function(`"use strict"; ${declarations}; return { isRowDisabled, selectionState, importReadyFilters };`)();
  const payload = { mode: "Videos", name: "Retry", findFilter: "{}", objectFilter: "{}", uiOptions: "{}" };
  const filter = { sourceId: "retry", name: "Retry", importable: true, payload };
  const priorResults = { retry: { status: "failure", message: "Temporary failure" } };

  assert.equal(helpers.isRowDisabled(filter, false, priorResults.retry), false);
  assert.deepEqual(helpers.selectionState([filter], new Set(["retry"]), new Set(), priorResults),
    { all: true, some: true, selected: 1, total: 1 });
  const progress = [];
  const result = await helpers.importReadyFilters([filter], new Set(["retry"]), [], priorResults,
    async (value) => assert.equal(value, payload), (value) => progress.push(value));
  assert.deepEqual(result.retry, { status: "success", message: "Imported" });
  assert.equal(progress.length, 1);
});

test("retries only failed prior results while preserving terminal outcomes", async () => {
  const source = await readFile(sourceUrl, "utf8");
  const declarations = source.match(/function normalizeName[\s\S]*?(?=\n\nfunction StatusBadge)/)?.[0];
  const importReadyFilters = Function(`"use strict"; ${declarations}; return importReadyFilters;`)();
  const filters = ["success", "exists", "failure"].map((sourceId) => ({
    sourceId,
    name: sourceId,
    importable: true,
    payload: { mode: "Videos", name: sourceId, findFilter: "{}", objectFilter: "{}", uiOptions: "{}" },
  }));
  const priorResults = {
    success: { status: "success", message: "Imported" },
    exists: { status: "exists", message: "Already in Cove" },
    failure: { status: "failure", message: "Temporary failure" },
  };
  const calls = [];
  const progress = [];
  const result = await importReadyFilters(filters, new Set(["success", "exists", "failure"]), [], priorResults,
    async (payload) => calls.push(payload.name), (value) => progress.push(value));

  assert.deepEqual(calls, ["failure"]);
  assert.deepEqual(result.success, priorResults.success);
  assert.deepEqual(result.exists, priorResults.exists);
  assert.deepEqual(result.failure, { status: "success", message: "Imported" });
  assert.equal(progress.length, 1);
});

test("loads and marks existing filters independently by target mode", async () => {
  const source = await readFile(sourceUrl, "utf8");
  const declarations = source.match(/function normalizeName[\s\S]*?(?=\n\nfunction StatusBadge)/)?.[0];
  const helpers = Function("request",
    `"use strict"; ${declarations}; return { classifyExistingFilters, loadExistingFilters };`,
  );
  const calls = [];
  const { classifyExistingFilters, loadExistingFilters } = helpers(async (url) => {
    calls.push(url);
    return url.endsWith("Images")
      ? [{ mode: "Images", name: "Shared", findFilter: "{}", objectFilter: "{}" }]
      : [{ mode: "Videos", name: "Shared", findFilter: "{}", objectFilter: "{}" }];
  });
  const filters = [
    { sourceId: "image", name: "Shared", payload: { mode: "Images", name: "Shared", findFilter: "{}", objectFilter: "{}" } },
    { sourceId: "video", name: "Shared", payload: { mode: "Videos", name: "Shared", findFilter: "{}", objectFilter: "{}" } },
  ];
  const existing = await loadExistingFilters(filters);
  assert.deepEqual(calls.sort(), ["/api/savedfilters?mode=Images", "/api/savedfilters?mode=Videos"]);
  assert.deepEqual([...classifyExistingFilters(filters, existing)].sort(), ["image", "video"]);
});

test("folds equivalent and different same-name filters into one existing state", async () => {
  const source = await readFile(sourceUrl, "utf8");
  const css = await readFile(new URL("../src/StashFilterImporter/ui/StashFilterImporter.css", import.meta.url), "utf8");
  const declarations = source.match(/function normalizeName[\s\S]*?(?=\n\nfunction groupFilters)/)?.[0];
  const classifyExistingFilters = Function(
    `"use strict"; ${declarations}; return classifyExistingFilters;`,
  )();
  const payload = {
    mode: "Videos",
    name: "Imported",
    findFilter: "{\"sort\":\"title\",\"direction\":\"asc\"}",
    objectFilter: "{\"tagsCriterion\":{\"value\":[2,1],\"modifier\":\"INCLUDES_ALL\"}}",
    uiOptions: "{\"display_mode\":1}",
  };
  const filters = [
    { sourceId: "same", name: "Imported", payload },
    { sourceId: "different", name: "Changed", payload: { ...payload, name: "Changed" } },
  ];
  const existing = [
    {
      ...payload,
      name: "imported",
      findFilter: "{\"direction\":\"asc\",\"page\":1,\"q\":\"\",\"sort\":\"title\"}",
      objectFilter: "{\"tagsCriterion\":{\"_names\":{\"2\":\"two\",\"1\":\"one\"},\"modifier\":\"INCLUDES_ALL\",\"value\":[1,2]}}",
      uiOptions: "{\"displayMode\":\"grid\"}",
    },
    { ...payload, name: "changed", objectFilter: "{}" },
  ];

  const classified = classifyExistingFilters(filters, existing);
  assert.deepEqual([...classified].sort(), ["different", "same"]);
  assert.match(source, /const completion = alreadyInCove \|\| isTerminalResult\(result\)/);
  assert.match(source, /completion \? h\("span", \{[\s\S]*?key: "completion"/);
  assert.match(source, /: h\("input", \{/);
  assert.match(source, /stash-filter-importer-completion/);
  assert.match(source, /"✅"/);
  assert.doesNotMatch(source, /key: "label" \}, "Already in Cove"/);
  assert.doesNotMatch(css, /\.stash-filter-importer-completion\s*\{[\s\S]*?background:/);
  assert.doesNotMatch(source, /"Exists"/);
});

test("compares names case-insensitively and never overwrites or renames", async () => {
  const source = await readFile(sourceUrl, "utf8");
  assert.match(source, /value\.trim\(\)\.toLowerCase\(\)/);
  assert.match(source, /Already in Cove/);
  assert.doesNotMatch(source, /Name conflict/);
  assert.doesNotMatch(source, /\/api\/savedfilters\/\$\{|method: "PUT"|overwrite|automatic rename/i);
});
