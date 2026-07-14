import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function parseArgs(args) {
  const options = { configuration: "Debug" };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (!["--extension", "--configuration", "--version"].includes(argument)) {
      fail(`unknown argument ${argument}`);
    }
    const value = args[index + 1];
    if (!value || value.startsWith("--")) fail(`${argument} requires a value`);
    options[argument.slice(2)] = value;
    index += 1;
  }
  if (!options.extension) {
    console.error("Usage: node scripts/package-extension.mjs --extension <id> [--configuration <name>] [--version <semver>]");
    process.exit(2);
  }
  return options;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit", ...options });
  if (result.error) fail(`${command} could not start: ${result.error.message}`);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const options = parseArgs(process.argv.slice(2));
const catalog = JSON.parse(fs.readFileSync(path.join(root, "extensions", "catalog.json"), "utf8"));
const extension = catalog.extensions.find((entry) => entry.id === options.extension);
if (!extension) fail(`extension '${options.extension}' is not present in extensions/catalog.json`);
if (extension.manifestOnly) fail(`manifest-only extension '${options.extension}' is not supported by this development packager`);

const extensionRoot = path.join(root, extension.path);
const projectPath = path.join(extensionRoot, `${extension.name}.csproj`);
const manifestPath = path.join(extensionRoot, "extension.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const version = options.version ?? manifest.version;
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
  fail(`version '${version}' is not a semantic version`);
}

const artifactsRoot = path.join(root, "artifacts");
const publishRoot = path.join(artifactsRoot, "publish", `${extension.name}-dev`);
const packageRoot = path.join(artifactsRoot, "packages", extension.name);
const archivePath = path.join(artifactsRoot, "packages", `${extension.id}-dev.zip`);
fs.rmSync(publishRoot, { recursive: true, force: true });
fs.rmSync(packageRoot, { recursive: true, force: true });
fs.mkdirSync(publishRoot, { recursive: true });
fs.mkdirSync(packageRoot, { recursive: true });

const sourceRoot = process.env.COVE_SOURCE_ROOT?.trim();
const sourceProperties = sourceRoot
  ? ["--property:UseLocalCoveSource=true", "--property:UseLocalCoveCore=true", `--property:CoveSourceRoot=${sourceRoot}`]
  : [];

run("dotnet", ["restore", projectPath, ...sourceProperties]);
run("dotnet", [
  "publish",
  projectPath,
  "--configuration",
  options.configuration,
  "--output",
  publishRoot,
  "--no-restore",
  `--property:Version=${version}`,
  ...sourceProperties,
]);

if (!manifest.entryDll) fail(`extension '${extension.id}' does not declare entryDll`);
const assemblyPath = path.join(publishRoot, path.basename(manifest.entryDll));
if (!fs.existsSync(assemblyPath)) fail(`publish output is missing ${path.basename(manifest.entryDll)}`);
const packagedAssemblyPath = path.join(packageRoot, manifest.entryDll);
fs.mkdirSync(path.dirname(packagedAssemblyPath), { recursive: true });
fs.copyFileSync(assemblyPath, packagedAssemblyPath);
fs.copyFileSync(path.join(root, "README.md"), path.join(packageRoot, "README.md"));
fs.copyFileSync(path.join(root, "LICENSE"), path.join(packageRoot, "LICENSE"));

for (const declaredAsset of [manifest.jsBundle, manifest.cssBundle].filter(Boolean)) {
  const sourcePath = path.resolve(extensionRoot, declaredAsset);
  const relativePath = path.relative(extensionRoot, sourcePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) fail(`declared asset escapes extension root: ${declaredAsset}`);
  if (!fs.existsSync(sourcePath)) fail(`declared asset does not exist: ${declaredAsset}`);
  const destinationPath = path.join(packageRoot, relativePath);
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
}

const packagedManifest = { ...manifest, version };
fs.writeFileSync(path.join(packageRoot, "extension.json"), `${JSON.stringify(packagedManifest, null, 2)}\n`);

run("node", [path.join(root, "scripts", "validate-extension-package.mjs"), packageRoot, version, extension.id]);
fs.rmSync(archivePath, { force: true });
run("zip", ["--recurse-paths", "--quiet", archivePath, "."], { cwd: packageRoot });

console.log(`Created ${archivePath}`);
console.log(`Install from http://127.0.0.1:4174/${path.basename(archivePath)}`);
