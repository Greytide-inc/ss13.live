// site-pages - turns a static build (build/site-dist, from build-static) into what ss13.live's Cloudflare deploy uploads (plans/site.md):
// build/site-pages/ for Pages (with site/worker.js as _worker.js) and build/site-r2/BUILD/... for the R2 bucket: the files over
// Pages' 25 MiB limit, served by the worker at their usual paths. No test scenarios. Prints BUILD. The deploy script runs it.
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, renameSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeSw } from "./write-sw.mjs";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(web, "build/site-dist"), pages = join(web, "build/site-pages"), r2 = join(web, "build/site-r2");
const LIMIT = 24 * 1048576; // Pages refuses files over 25 MiB: a margin below it
if (!existsSync(join(dist, "index.html"))) throw new Error("no build/site-dist: npm run build:static -- --dist build/site-dist");
for (const d of [pages, r2]) rmSync(d, { recursive: true, force: true });
cpSync(dist, pages, { recursive: true, filter: (f) => !f.startsWith(join(dist, "web/scenarios")) });
const build = writeSw(pages); // the manifest again, without the scenarios; its hash names the build
const big = [];
(function walk(d) {
	for (const e of readdirSync(d, { withFileTypes: true })) {
		const f = join(d, e.name);
		if (e.isDirectory()) walk(f);
		else if (statSync(f).size > LIMIT) big.push("/" + f.slice(pages.length + 1));
	}
})(pages);
for (const p of big) { mkdirSync(dirname(join(r2, build + p)), { recursive: true }); renameSync(join(pages, p), join(r2, build + p)); }
writeFileSync(join(pages, "_worker.js"), readFileSync(join(web, "site/worker.js"), "utf8").replace("__BUILD__", build).replace("__BIG__", JSON.stringify(big)));
console.log(`site build ${build}: ${big.length} files for R2 (${big.join(", ")})`);
console.log(`BUILD=${build}`);
