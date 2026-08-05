import fs from "node:fs";
import path from "node:path";

const [packageRoot, version, extensionId] = process.argv.slice(2);
const fail = (message) => { throw new Error(message); };
if (!packageRoot || !version || extensionId !== "com.midnightrider.api-fault-simulator") fail("expected package path, version, and API fault simulator id");
const read = (file) => fs.readFileSync(path.join(packageRoot, file), "utf8");
const manifest = JSON.parse(read("extension.json"));
if (manifest.id !== extensionId || manifest.version !== version) fail("package manifest identity does not match packaging arguments");
if (manifest.minCoveVersion !== "1.1.1-dev.81") fail("package must declare the floating UI host compatibility floor");
for (const file of [manifest.entryDll, manifest.jsBundle, manifest.cssBundle, "README.md", "LICENSE"]) {
  if (!file || !fs.existsSync(path.join(packageRoot, file))) fail(`missing package file: ${file}`);
}
const ui = read(manifest.jsBundle);
if (!ui.includes("cove-api-fault-tools") || !ui.includes("cove-dev-api-fault")) fail("UI bundle does not provide the browser-local fault control");
if (!ui.includes("unavailable-preset") || !ui.includes("applyUnavailablePreset")) fail("UI bundle does not provide the one-click unavailable preset");
