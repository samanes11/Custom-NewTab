// Copies the files Vite doesn't know about (manifest.json, icons) into
// dist/ after the app bundle is built, so `npm run build` alone produces
// a folder that's ready for "Load unpacked".
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");

if (!existsSync(dist)) {
  mkdirSync(dist, { recursive: true });
}

cpSync(path.join(root, "manifest.json"), path.join(dist, "manifest.json"));
cpSync(path.join(root, "public", "icons"), path.join(dist, "icons"), { recursive: true });

console.log("Copied manifest.json and icons/ into dist/");
