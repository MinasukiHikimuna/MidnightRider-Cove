import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const [packageRootArg, expectedVersion, expectedExtensionId] = process.argv.slice(2);
if (!packageRootArg || !expectedVersion) {
  console.error("Usage: node scripts/validate-extension-package.mjs <package-root> <expected-version> [expected-extension-id]");
  process.exit(2);
}

const packageRoot = path.resolve(packageRootArg);
const required = ["extension.json", "README.md", "LICENSE"];
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

function isSafePackagePath(relativePath) {
  if (typeof relativePath !== "string" || !relativePath.trim() || path.isAbsolute(relativePath)) return false;
  const resolved = path.resolve(packageRoot, relativePath);
  return resolved === packageRoot || resolved.startsWith(`${packageRoot}${path.sep}`);
}

function validateDeclaredFile(label, relativePath) {
  if (!isSafePackagePath(relativePath)) {
    errors.push(`${label} must be a safe relative package path`);
    return;
  }
  if (!fs.existsSync(path.join(packageRoot, relativePath))) errors.push(`missing declared ${label} ${relativePath}`);
}

function validateModuleImports(relativePath) {
  if (!isSafePackagePath(relativePath)) return;
  const modulePath = path.join(packageRoot, relativePath);
  if (!fs.existsSync(modulePath)) return;
  const source = fs.readFileSync(modulePath, "utf8");
  const importPattern = /\b(?:import|export)\b(?:[^"'`;]*?\bfrom\b)?\s*["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1] ?? match[2];
    if (!specifier.startsWith(".")) continue;
    const importedPath = path.resolve(path.dirname(modulePath), specifier);
    const importedRelativePath = path.relative(packageRoot, importedPath);
    if (!isSafePackagePath(importedRelativePath) || !fs.existsSync(importedPath)) {
      errors.push(`jsBundle imports missing package module ${specifier}`);
    }
  }
}

function walkFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(entryPath));
    else if (entry.isFile()) files.push(entryPath);
  }
  return files;
}

if (!fs.existsSync(packageRoot) || !fs.statSync(packageRoot).isDirectory()) {
  console.error(`ERROR: package root does not exist: ${packageRoot}`);
  process.exit(1);
}

const entries = fs.readdirSync(packageRoot, { withFileTypes: true });
for (const requiredFile of required) {
  if (!entries.some(entry => entry.isFile() && entry.name === requiredFile))
    errors.push(`missing required root file ${requiredFile}`);
}

for (const filePath of walkFiles(packageRoot)) {
  const fileName = path.basename(filePath);
  if (forbiddenAssemblyNames.has(fileName)) errors.push(`host-provided assembly must not be packaged: ${fileName}`);
}

const manifestPath = path.join(packageRoot, "extension.json");
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!manifest.id) errors.push("manifest id is missing");
  if (expectedExtensionId && manifest.id !== expectedExtensionId) {
    errors.push(`manifest id is ${manifest.id}, expected ${expectedExtensionId}`);
  }
  if (manifest.version !== expectedVersion) errors.push(`manifest version is ${manifest.version}, expected ${expectedVersion}`);
  if (manifest.entryDll) validateDeclaredFile("entryDll", manifest.entryDll);
  if (manifest.jsBundle) {
    validateDeclaredFile("jsBundle", manifest.jsBundle);
    validateModuleImports(manifest.jsBundle);
  }
  if (manifest.cssBundle) validateDeclaredFile("cssBundle", manifest.cssBundle);
}

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(`Validated extension package ${expectedExtensionId ?? "from manifest"} ${expectedVersion} at ${packageRoot}.`);
