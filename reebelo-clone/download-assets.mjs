import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const summary = JSON.parse(await readFile("evidence/source-summary.json", "utf8"));
const out = path.resolve("public/assets");
await mkdir(out, { recursive: true });

const wanted = new Map();
for (const group of [...summary.desktop, ...summary.mobile]) {
  for (const img of group.data?.imgs || []) {
    if (!img.src || wanted.size >= 80) continue;
    if (img.src.includes("trustpilot")) continue;
    const key = `${img.alt || "asset"}-${wanted.size}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    wanted.set(key, img.src);
  }
}

const manifest = {};
for (const [name, url] of wanted) {
  try {
    const res = await fetch(url);
    if (!res.ok) continue;
    const type = res.headers.get("content-type") || "";
    const ext = type.includes("png") ? "png" : type.includes("svg") ? "svg" : "jpg";
    const filename = `${name}.${ext}`;
    await writeFile(path.join(out, filename), Buffer.from(await res.arrayBuffer()));
    manifest[name] = `/assets/${filename}`;
  } catch {
    // Skip assets that the browser captured but the server refuses outside the page.
  }
}

await writeFile(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`saved ${Object.keys(manifest).length} assets`);
