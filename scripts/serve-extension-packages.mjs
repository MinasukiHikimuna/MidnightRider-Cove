import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function parseArgs(args) {
  const options = { host: "127.0.0.1", port: 4174, directory: "artifacts/packages" };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (!["--host", "--port", "--directory"].includes(argument)) fail(`unknown argument ${argument}`);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) fail(`${argument} requires a value`);
    options[argument.slice(2)] = value;
    index += 1;
  }
  options.port = Number.parseInt(options.port, 10);
  if (!Number.isInteger(options.port) || options.port < 1 || options.port > 65535) fail("--port must be between 1 and 65535");
  return options;
}

const options = parseArgs(process.argv.slice(2));
const root = path.resolve(import.meta.dirname, "..");
const packageRoot = path.resolve(root, options.directory);
fs.mkdirSync(packageRoot, { recursive: true });

const server = http.createServer((request, response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");

  if (request.url === "/healthz") {
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("ok\n");
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  let fileName;
  try {
    fileName = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname).replace(/^\/+/, "");
  } catch {
    response.writeHead(400);
    response.end("Invalid URL\n");
    return;
  }

  if (!fileName || path.basename(fileName) !== fileName || !fileName.endsWith(".zip")) {
    response.writeHead(404);
    response.end("Not found\n");
    return;
  }

  const filePath = path.join(packageRoot, fileName);
  let stats;
  try {
    stats = fs.statSync(filePath);
  } catch {
    response.writeHead(404);
    response.end("Package has not been built yet\n");
    return;
  }
  if (!stats.isFile()) {
    response.writeHead(404);
    response.end("Not found\n");
    return;
  }

  response.writeHead(200, {
    "Content-Type": "application/zip",
    "Content-Length": stats.size,
  });
  if (request.method === "HEAD") response.end();
  else fs.createReadStream(filePath).pipe(response);
});

server.on("error", (error) => fail(`package server failed: ${error.message}`));

server.listen(options.port, options.host, () => {
  console.log(`Serving extension packages from ${packageRoot}`);
  console.log(`Health check: http://${options.host}:${options.port}/healthz`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
