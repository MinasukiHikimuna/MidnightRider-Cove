import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const [packageRootArg, expectedVersion, expectedExtensionId] = process.argv.slice(2);
const minimumCoveVersion = "1.1.1-dev.141";
if (!packageRootArg || !expectedVersion || expectedExtensionId !== "com.midnightrider.external-sign-in") {
  console.error("Usage: node scripts/validate-extension-package.mjs <package-root> <expected-version> com.midnightrider.external-sign-in");
  process.exit(2);
}

const packageRoot = path.resolve(packageRootArg);
const errors = [];
const required = ["extension.json", "README.md", "LICENSE", "ExternalSignIn.dll", "dist/ui.mjs", "dist/ui.css"];
const forbiddenAssemblies = ["Cove.Core.dll", "Cove.Plugins.dll", "Cove.Sdk.dll"];

for (const relativePath of required) {
  if (!fs.existsSync(path.join(packageRoot, relativePath))) errors.push(`missing package file: ${relativePath}`);
}

for (const assembly of forbiddenAssemblies) {
  if (fs.existsSync(path.join(packageRoot, assembly))) errors.push(`host-provided assembly must not be packaged: ${assembly}`);
}

const manifestPath = path.join(packageRoot, "extension.json");
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.id !== expectedExtensionId) errors.push(`manifest id is ${manifest.id}, expected ${expectedExtensionId}`);
  if (manifest.version !== expectedVersion) errors.push(`manifest version is ${manifest.version}, expected ${expectedVersion}`);
  if (manifest.minCoveVersion !== minimumCoveVersion) {
    errors.push(`manifest minCoveVersion is ${manifest.minCoveVersion}, expected ${minimumCoveVersion}`);
  }
  if (manifest.entryDll !== "ExternalSignIn.dll") errors.push("manifest entryDll is incorrect");
  if (manifest.jsBundle !== "dist/ui.mjs" || manifest.cssBundle !== "dist/ui.css") errors.push("manifest UI bundle paths are incorrect");
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(`Validated ${expectedExtensionId} ${expectedVersion} at ${packageRoot}.`);
