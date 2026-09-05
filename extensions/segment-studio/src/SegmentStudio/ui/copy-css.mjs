import { copyFile } from "node:fs/promises";

await copyFile(new URL("SegmentStudio.css", import.meta.url), new URL("../dist/ui.css", import.meta.url));
