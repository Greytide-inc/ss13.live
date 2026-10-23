// site-pages - turns a static build (build/site-dist, from build-static) into what ss13.live's Cloudflare deploy uploads (plans/site.md):
// build/site-pages/ for Pages (with site/worker.js as _worker.js, the front page site/index.html, the game as play.html) and build/site-r2/BUILD/... for the R2 bucket: the files over
// Pages' 25 MiB limit, served by the worker at their usual paths. No test scenarios. Prints BUILD. The deploy script runs it.
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, renameSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeSw } from "./write-sw.mjs";
import { fixCsp } from "./csp.mjs";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(web, "build/site-dist"), pages = join(web, "build/site-pages"), r2 = join(web, "build/site-r2");
const LIMIT = 24 * 1048576; // Pages refuses files over 25 MiB: a margin below it
if (!existsSync(join(dist, "index.html"))) throw new Error("no build/site-dist: npm run build:static -- --dist build/site-dist");
for (const d of [pages, r2]) rmSync(d, { recursive: true, force: true });
cpSync(dist, pages, { recursive: true, filter: (f) => !f.startsWith(join(dist, "web/scenarios")) });
// step 4: the game page moves to /play (play.html, next to index.html, so its relative paths still resolve); the front page takes its place
renameSync(join(pages, "index.html"), join(pages, "play.html"));
for (const f of ["index.html", "landing.js"]) cpSync(join(web, "site", f), join(pages, f));
// Pages never uploads a folder named node_modules (2026-10-23: pixi was missing, the game hung on "Starting..."): pixi moves to web/lib
renameSync(join(pages, "web/node_modules"), join(pages, "web/lib"));
const play = readFileSync(join(pages, "play.html"), "utf8"), play2 = play.replace("./web/node_modules/", "./web/lib/");
if (play2 === play) throw new Error("site-pages: play.html's pixi import map not found");
writeFileSync(join(pages, "play.html"), fixCsp(play2));
const build = writeSw(pages); // the manifest again, without the scenarios; its hash names the build
// the game worker gets the build in its address and adds it to every build file's (boot-worker.ts buildUrl): Cloudflare caches those for 4 h
// at their address, so after a deploy an unchanged address served the last build's saved world (rejected: a full boot).
const play3 = readFileSync(join(pages, "play.html"), "utf8"), play4 = play3.replace('/boot-worker.js"', `/boot-worker.js?b=${build}"`);
if (play4 === play3) throw new Error("site-pages: play.html's boot-worker.js not found");
writeFileSync(join(pages, "play.html"), play4);
const big = [];
(function walk(d) {
	for (const e of readdirSync(d, { withFileTypes: true })) {
		const f = join(d, e.name);
		if (e.isDirectory() && e.name === "node_modules") throw new Error(`site-pages: Pages would skip ${f}`);
		if (e.isDirectory()) walk(f);
		else if (statSync(f).size > LIMIT) big.push("/" + f.slice(pages.length + 1));
	}
})(pages);
for (const p of big) { mkdirSync(dirname(join(r2, build + p)), { recursive: true }); renameSync(join(pages, p), join(r2, build + p)); }
writeFileSync(join(pages, "_worker.js"), readFileSync(join(web, "site/worker.js"), "utf8").replace("__BUILD__", build).replace("__BIG__", JSON.stringify(big)));
console.log(`site build ${build}: ${big.length} files for R2 (${big.join(", ")})`);
console.log(`BUILD=${build}`);
