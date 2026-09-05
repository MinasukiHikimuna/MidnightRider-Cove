import fs from "node:fs";
import path from "node:path";

const [packageRoot, version, extensionId] = process.argv.slice(2);
const fail = (message) => {
  throw new Error(message);
};

if (!packageRoot || !version || extensionId !== "com.midnightrider.data-quality") {
  fail("expected package path, version, and Data Quality extension id");
}

const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, "extension.json"), "utf8"));
if (manifest.id !== extensionId || manifest.version !== version) {
  fail("package manifest identity does not match packaging arguments");
}
if (manifest.minCoveVersion !== "1.3.2-dev.244") {
  fail("package must declare the required Cove extension-runtime compatibility floor");
}

for (const file of [manifest.entryDll, manifest.jsBundle, manifest.cssBundle, "README.md", "LICENSE"]) {
  if (!file || !fs.existsSync(path.join(packageRoot, file))) {
    fail(`missing package file: ${file}`);
  }
}
