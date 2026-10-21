// check-static - serves web/dist with python http.server on a spare port, GETs every startup URL
// (page, css, importmap target, transitive ES imports of the page + worker, data files, sample assets) and expects 200.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = 8493, base = `http://127.0.0.1:${port}/`;
const srv = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: dist, stdio: "ignore" });
await new Promise((r) => setTimeout(r, 1000));
const seen = new Set(), bad = [];
const get = async (u) => { const r = await fetch(u); if (r.status !== 200) bad.push(`${r.status} ${u}`); return r; };
async function crawl(u) { // follow static `import ... from "./x.js"` / `import("...")` chains
	if (seen.has(u)) return; seen.add(u);
	const r = await get(u); if (r.status !== 200 || !u.endsWith(".js")) return;
	for (const m of (await r.text()).matchAll(/(?:from|import\()\s*["'](\.{1,2}\/[^"']+)["']/g)) await crawl(new URL(m[1], u).href);
}
try {
	const html = readFileSync(join(dist, "index.html"), "utf8");
	await get(base);
	for (const m of html.matchAll(/(?:href|src)="(\.\/[^"]+)"/g)) await get(new URL(m[1], base).href);
	for (const m of html.matchAll(/from "(\.\/[^"]+)"/g)) await crawl(new URL(m[1], base).href);
	await get(new URL(html.match(/"pixi.js":\s*"([^"]+)"/)[1], base).href);
	await crawl(new URL(html.match(/new Worker\("([^"]+)"/)[1], base).href);
	for (const f of ["vfs-bundle.json", "icon-sizes.json"]) await get(`${base}web/build/${f}`);
	for (const f of ["interface/skin.dmf", "icons/mob/uniform.dmi", "icons/mob/underwear.dmi", "tgui/assets/tgui.js", "tgui/assets/tgui.css", "sound/ambience/ambigen1.ogg", "config/title_screens/images/default.dmi", "config/title_screens/images/blank.png"]) await get(base + f);
	// the worker's own relative fetches (5 levels up from src/worker) must land on the same files
	const w = new URL("web/build/dist/src/worker/boot-worker.js", base);
	for (const f of ["interface/skin.dmf", "icons/mob/uniform.dmi"]) await get(new URL("../../../../../" + f, w).href);
	console.log(`${seen.size} modules crawled; ${bad.length} failures`);
	for (const b of bad) console.log(b);
} finally { srv.kill(); }
process.exit(bad.length ? 1 : 0);
