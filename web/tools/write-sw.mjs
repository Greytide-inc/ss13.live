// write-sw - writes <dist>/sw.js: the service worker (worker/sw-template.js) with a manifest of every file in dist and a
// version = hash of all names + contents. Used by build-static.mjs and by tests/static/sw.test.mjs. Re-run after changing any file in dist.
import { readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
export function writeSw(out) {
	rmSync(join(out, "sw.js"), { force: true });
	const files = [];
	(function walk(d) { for (const e of readdirSync(d, { withFileTypes: true })) { const f = join(d, e.name); if (e.isDirectory()) walk(f); else files.push(f); } })(out);
	files.sort();
	const hash = createHash("sha256"), manifest = [];
	for (const f of files) { const rel = f.slice(out.length + 1), buf = readFileSync(f); hash.update(rel + "\0"); hash.update(buf); manifest.push([rel, buf.length]); }
	const version = hash.digest("hex").slice(0, 12);
	writeFileSync(join(out, "sw.js"), readFileSync(join(web, "worker/sw-template.js"), "utf8").replace("__VERSION__", version).replace("__MANIFEST__", () => JSON.stringify(manifest)));
	console.log(`wrote ${relative(join(web, ".."), out)} (service worker ${version}, ${manifest.length} files, ${(manifest.reduce((a, m) => a + m[1], 0) / 1e6).toFixed(1)} MB)`);
	return version;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeSw(process.argv[2] ?? join(web, "dist"));
