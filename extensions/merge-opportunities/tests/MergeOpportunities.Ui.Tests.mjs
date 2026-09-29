import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const js = readFileSync(
  join(root, "src", "MergeOpportunities", "ui", "MergeOpportunities.js"),
  "utf8",
);
const css = readFileSync(
  join(root, "src", "MergeOpportunities", "ui", "MergeOpportunities.css"),
  "utf8",
);
const manifest = JSON.parse(
  readFileSync(
    join(root, "src", "MergeOpportunities", "extension.json"),
    "utf8",
  ),
);
const extensionSource = readFileSync(
  join(root, "src", "MergeOpportunities", "MergeOpportunitiesExtension.cs"),
  "utf8",
);
const catalogSource = readFileSync(
  join(root, "src", "MergeOpportunities", "MergeOpportunityCatalog.cs"),
  "utf8",
);
const slnx = readFileSync(join(root, "MergeOpportunities.slnx"), "utf8");
const release = JSON.parse(readFileSync(join(root, "release.json"), "utf8"));

test("extension manifest matches release.json and pins version", () => {
  assert.equal(manifest.id, "com.midnightrider.merge-opportunities");
  assert.equal(manifest.version, "0.1.1");
  assert.equal(release.id, "com.midnightrider.merge-opportunities");
  assert.equal(
    manifest.jsBundle,
    "ui/MergeOpportunities.js",
    "jsBundle should point at the hand-written UI",
  );
});

test("UI bundle is plain ESM served statically by the host", () => {
  assert.match(js, /import React from "@cove\/runtime\/react"/);
  assert.match(js, /export default \{\s*components/);
  assert.doesNotMatch(js, /import\.meta\.url/);
  assert.match(js, /MergeOpportunitiesPage/);
  assert.match(js, /MergeOpportunityDetailPage/);
});

test("API helpers always route through the host authed fetch", () => {
  assert.match(js, /const response = await extensionFetch\(url/);
  assert.doesNotMatch(js, /\bfetch\(\s*"/);
  assert.match(js, /\/api\/plugins\/com\.midnightrider\.merge-opportunities/);
});

test("UI talks to core merge/delete endpoints with a long timeout", () => {
  assert.match(js, /"\/api\/studios"/);
  assert.match(js, /"\/api\/performers"/);
  assert.match(js, /`\$\{coreBase\}\/merge`/);
  assert.match(js, /`\$\{coreBase\}\/\$\{memberId\}`/);
  assert.match(js, /method: "POST"/);
  assert.match(js, /method: "DELETE"/);
  assert.match(js, /CORE_MERGE_TIMEOUT_MS\s*=\s*600_000/);
  assert.match(js, /timeoutMs: CORE_MERGE_TIMEOUT_MS/);
  assert.match(js, /targetId: target, sourceIds/);
});

test("UI wires user decisions and keeps surviving groups open", () => {
  assert.match(js, /\/decision/);
  assert.match(js, /recordDecision\("merged"/);
  assert.match(js, /recordDecision\("dismissed"/);
  assert.match(js, /recordDecision\("deleted"/);
  // partial merge / partial delete must clear the decision so the group reappears
  assert.match(js, /clearDecision/);
  assert.match(js, /members\.length - sourceIds\.length > 1/);
  assert.match(js, /members\.length - 1 > 1/);
});

test("detail page supports selecting a target and excluding sources", () => {
  assert.match(js, /setExcluded/);
  assert.match(js, /m\.entityId !== target && !excluded\[m\.entityId\]/);
  assert.match(js, /Merge this record/);
});

test("list page supports row dismiss/reopen, filters, and accept-all", () => {
  assert.match(js, /doDismissRow/);
  assert.match(js, /doReopenRow/);
  assert.match(js, /doAcceptAll/);
  assert.match(js, /Accept all \(/);
  assert.match(js, /c\.kind === kind/);
  assert.match(js, /c\.key\.toLowerCase\(\)\.includes\(search\)/);
  assert.match(js, /e\.stopPropagation\(\)/);
});

test("extension exposes exactly the endpoints the UI calls", () => {
  assert.match(
    extensionSource,
    /MapGet\(ApiBase \+ "\/candidates"/,
  );
  assert.match(extensionSource, /MapGet\(ApiBase \+ "\/candidates\/\{key\}"/);
  assert.match(extensionSource, /MapPost\(ApiBase \+ "\/candidates\/\{key\}\/decision"/);
  assert.match(extensionSource, /MapDelete\(ApiBase \+ "\/candidates\/\{key\}\/decision"/);
  assert.match(extensionSource, /MapPost\(ApiBase \+ "\/attach"/);
  assert.match(extensionSource, /UIPageDefinition\("merge-opportunities"/);
  assert.match(extensionSource, /UIPageDefinition\("merge-opportunity"/);
});

test("candidate detection is normalized and idempotent", () => {
  assert.match(catalogSource, /endpoint\.Split\('\?'\)\[0\]/);
  assert.match(catalogSource, /Trim\(\)\.ToLowerInvariant\(\)/);
  assert.match(catalogSource, /members\.Count > 1/);
  assert.match(catalogSource, /providers\.Count > 1/);
  assert.match(catalogSource, /existing\.Contains\(\(NormalizeProvider\(r\.Endpoint\), r\.RemoteId\)\)/);
});

test("UI css is scoped to merge-opportunities classes", () => {
  const selectorBlock = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/@media[^{]*\{[\s\S]*\}/g, "");
  const selectors = selectorBlock
    .match(/[^{}]+\{/g)
    ?.map((block) => block.slice(0, -1))
    .flatMap((s) => s.split(","))
    .map((s) => s.trim())
    .filter(Boolean);
  assert.ok(selectors.length > 0, "expected at least one css selector");
  for (const selector of selectors) {
    assert.match(selector, /^\.merge-opportunities-/);
  }
});

test("slnx and release.json reference the same projects", () => {
  assert.match(slnx, /src\/MergeOpportunities\/MergeOpportunities\.csproj/);
  assert.match(slnx, /tests\/MergeOpportunities\.Tests\/MergeOpportunities\.Tests\.csproj/);
  assert.equal(release.project, "src/MergeOpportunities/MergeOpportunities.csproj");
  assert.equal(release.manifest, "src/MergeOpportunities/extension.json");
  assert.equal(release.ui, "src/MergeOpportunities/ui");
});
