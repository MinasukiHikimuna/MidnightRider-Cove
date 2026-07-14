import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const [packageRootArg, expectedVersion] = process.argv.slice(2);
if (!packageRootArg || !expectedVersion) {
  console.error("Usage: node scripts/validate-extension-package.mjs <package-root> <expected-version>");
  process.exit(2);
}

const packageRoot = path.resolve(packageRootArg);
const required = ["HashTheCove.dll", "extension.json", "README.md", "LICENSE"];
const requiredUiFile = path.join("ui", "HashTheCove.js");
const forbiddenAssemblyNames = new Set([
  "Cove.Core.dll",
  "Cove.Plugins.dll",
  "Cove.Sdk.dll",
  "Microsoft.EntityFrameworkCore.dll",
  "Microsoft.EntityFrameworkCore.Abstractions.dll",
  "Microsoft.EntityFrameworkCore.Relational.dll",
  "Npgsql.dll",
  "Npgsql.EntityFrameworkCore.PostgreSQL.dll",
  "Pgvector.dll",
  "Pgvector.EntityFrameworkCore.dll",
]);
const errors = [];

if (!fs.existsSync(packageRoot) || !fs.statSync(packageRoot).isDirectory()) {
  console.error(`ERROR: package root does not exist: ${packageRoot}`);
  process.exit(1);
}

const entries = fs.readdirSync(packageRoot, { withFileTypes: true });
for (const requiredFile of required) {
  if (!entries.some(entry => entry.isFile() && entry.name === requiredFile))
    errors.push(`missing required root file ${requiredFile}`);
}

for (const entry of entries) {
  if (entry.isDirectory() && entry.name !== "ui") errors.push(`unexpected root directory ${entry.name}`);
  if (forbiddenAssemblyNames.has(entry.name)) errors.push(`host-provided assembly must not be packaged: ${entry.name}`);
}

if (!fs.existsSync(path.join(packageRoot, requiredUiFile)))
  errors.push(`missing required UI module ${requiredUiFile}`);

const uiPath = path.join(packageRoot, "ui");
if (fs.existsSync(uiPath)) {
  const uiEntries = fs.readdirSync(uiPath, { withFileTypes: true });
  for (const entry of uiEntries) {
    if (!entry.isFile() || entry.name !== "HashTheCove.js")
      errors.push(`unexpected UI package entry ui/${entry.name}`);
  }
}

const manifestPath = path.join(packageRoot, "extension.json");
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.id !== "hash-the-cove") errors.push(`manifest id is ${manifest.id}, expected hash-the-cove`);
  if (manifest.version !== expectedVersion) errors.push(`manifest version is ${manifest.version}, expected ${expectedVersion}`);
  if (manifest.entryDll !== "HashTheCove.dll") errors.push(`manifest entryDll is ${manifest.entryDll}, expected HashTheCove.dll`);
  if (manifest.jsBundle !== requiredUiFile) errors.push(`manifest jsBundle is ${manifest.jsBundle}, expected ${requiredUiFile}`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(`Validated Hash The Cove package ${expectedVersion} at ${packageRoot}.`);
