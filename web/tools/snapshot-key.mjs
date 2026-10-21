// snapshot-key - the content hash that says whether a saved world (build/snapshot-cache) still matches the current build.
// Used by build-static.mjs (reuse the cached snapshot) and by boot.js --scenario (load it only if it matches).
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** `web` is the web/ folder. Call after the build (it hashes build/dist). */
export function snapshotKey(web) {
	const h = createHash("sha1"), files = ["build/translated-tg.js", "build/game-types.js", "build/vfs-bundle.json"];
	const walk = (d, ext) => { for (const e of readdirSync(join(web, d), { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) { const f = `${d}/${e.name}`; if (e.isDirectory()) walk(f, ext); else if (f.endsWith(ext)) files.push(f); } };
	for (const d of readdirSync(join(web, "build/dist/src")).sort()) if (d !== "render" && d !== "worker") walk(`build/dist/src/${d}`, ".js"); // all engine + Node tool code; the page side (render/, worker/) doesn't run in the snapshot boot
	for (let i = 0; i < files.length; i++) { // render/ files the engine imports (and what those import), so they count too
		if (!files[i].startsWith("build/dist/src/")) continue;
		const inRender = files[i].startsWith("build/dist/src/render/");
		for (const [, rel] of readFileSync(join(web, files[i]), "utf8").matchAll(/from "(\.\.\/render\/[\w.-]+\.js|\.\/[\w.-]+\.js)"/g)) {
			if (!inRender && rel.startsWith("./")) continue;
			const f = `build/dist/src/render/${rel.replace(/^\.\.\/render\/|^\.\//, "")}`;
			if (!files.includes(f)) files.push(f);
		}
	}
	for (const d of ["icons", "config"]) walk(`../${d}`, ".dmi");
	for (const f of files) { h.update(f); h.update(f.endsWith("vfs-bundle.json") ? readFileSync(join(web, f), "utf8").replace(/"generatedAt":"[^"]*"/, "") : readFileSync(join(web, f))); } // generatedAt: a build timestamp nothing reads
	return h.digest("hex");
}

/** The snapshot files of a map. BoxStation (or no map) keeps the original names; others get the map's short name in them:
 *  "runtime" and "RuntimeStation" both give world-runtime.snap.gz. Same rule in boot-worker.ts and boot.ts. */
export function snapNames(map) {
	const slug = (map || "").toLowerCase().replace(/station$/, "").replace(/[^a-z0-9]/g, "");
	const sfx = !slug || slug === "box" ? "" : "-" + slug;
	return { slug: sfx.slice(1) || "box", gz: `world${sfx}.snap.gz`, meta: `world${sfx}-snap.json`, key: `key${sfx}` };
}
