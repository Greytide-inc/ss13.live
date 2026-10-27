// build-static - writes web/dist/ (or `--dist DIR`): everything worker/index.html needs, laid out like the repo root
// (index.html, web/..., icons/, sound/, ...), with the absolute "/..." URLs rewritten to relative ones.
// Serve it with any static server: `cd web/dist && python3 -m http.server 8080`. (file:// can't run workers/fetch.)
// also boots the world once in Node up to the lobby and ships it as web/build/world.snap.gz + world-snap.json (the page
// loads it instead of running the ~1 min world start; vm/snapshot.ts). ~2 min, ~3 GB RAM; reused from build/snapshot-cache when nothing it
// depends on changed (see below). `--no-snapshot` skips it (the page
// then boots normally, with a console note). The boot's log: web/build/snapshot-build.log.
// the snapshot boots with the translated game code, always: the
// page can only load a translated snapshot (its sleeping procs wait as translated tails), and there is no bytecode any more.
import { logRebuild } from "./rebuild-log.mjs";
import { snapshotKey, snapNames } from "./snapshot-key.mjs";
import { existsSync, cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, createReadStream, createWriteStream } from "node:fs";
import { spawnSync } from "node:child_process";
import { createGzip } from "node:zlib";
import { createHash } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { writeSw } from "./write-sw.mjs";
import { fixCsp } from "./csp.mjs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(web, "..");
const distAt = process.argv.indexOf("--dist"); // --dist DIR: write there instead of web/dist (the played copy is web/dist)
const buildWarnings = [];
const out = distAt > 0 ? resolve(process.argv[distAt + 1] ?? "") : join(web, "dist");
// out is deleted first: only web/dist or a web/build/NAME-dist folder, so a typo (`--dist build`) can't wipe the generated files
if (out !== join(web, "dist") && !(dirname(out) === join(web, "build") && /.-dist$/.test(out))) throw new Error(`--dist must be web/dist or web/build/NAME-dist, not ${out}`);
rmSync(out, { recursive: true, force: true });
const cp = (from, to, filter) => { mkdirSync(dirname(join(out, to)), { recursive: true }); cpSync(join(repo, from), join(out, to), { recursive: true, filter }); };

// game data + code the page and worker load. the VFS bundle (config/, strings/, _maps/ with the compile-time
// .dmm maps, ...) is rebuilt from the folders on disk first (0.3 s), so an edited map or config file reaches the page.
{
	const r = spawnSync(process.execPath, ["build/dist/src/tools/bundle-vfs.js"], { cwd: web, stdio: ["ignore", "ignore", "inherit"] });
	if (r.status !== 0) throw new Error(`bundle-vfs failed (exit ${r.status})`);
}
for (const f of ["vfs-bundle.json", "icon-sizes.json"]) cp(`web/build/${f}`, `web/build/${f}`);
// web/game bundled as one module (~33 MB) plus its type declarations (game-types.js, ~6 MB, every load).
// Re-bundled when a file in web/game is newer than the bundle.
{
	const made = Math.min(...["translated-tg.js", "game-types.js", "translated-tg.lines.json"].map((f) => statSync(join(web, "build", f), { throwIfNoEntry: false })?.mtimeMs ?? 0));
	const newest = (d) => readdirSync(d, { withFileTypes: true }).reduce((m, e) => Math.max(m, e.isDirectory() ? newest(join(d, e.name)) : statSync(join(d, e.name)).mtimeMs), 0);
	if (newest(join(web, "game")) > made || statSync(join(web, "tools/translate-tg.mjs")).mtimeMs > made) {
		console.log("bundling web/game (~30 s)...");
		const r = spawnSync(process.execPath, ["tools/translate-tg.mjs"], { cwd: web, stdio: ["ignore", "ignore", "inherit"] });
		if (r.status !== 0) throw new Error(`tools/translate-tg.mjs failed (exit ${r.status})`);
	}
	cp("web/build/translated-tg.js", "web/build/translated-tg.js");
	cp("web/build/translated-tg.lines.json", "web/build/translated-tg.lines.json"); // read on the first runtime error (src/translate/error-lines.ts)
	cp("web/build/game-types.js", "web/build/game-types.js"); // step 3: the type tree, globals and strings (every page load)
}
cp("web/build/dist/src", "web/build/dist/src");
cp("web/node_modules/pixi.js/dist/pixi.mjs", "web/node_modules/pixi.js/dist/pixi.mjs");
for (const f of ["output.css", "popups.js", "ctxmenu.js", "sound.js", "menubar.js", "splitter.js", "saybox.js", "join.js", "chatfilter.js", "chathtml.js", "lobby-art", "lobby-menu.js", "view-pack.js", "jitter-buffer.js", "pixi-no-eval.js", "screens.css", "img"]) cp(`web/worker/${f}`, `web/worker/${f}`);
cp("web/worker/about.html", "about.html"); // hosting: privacy note, licence and source (linked from the loading screen)
cp("web/worker/popup.html", "popup.html"); // tsh-chat: popup frames load it, next to the page (popups.js)
if (existsSync(join(repo, "web/scenarios"))) cp("web/scenarios", "web/scenarios"); // ?scenario=NAME fetches /web/scenarios/NAME.txt (the public copy has none)
// files the game names at runtime (browse_rsc, sound, icons, skin)
for (const d of ["icons", "sound", "html", "tgui/assets", "interface/skin.dmf", "config/title_screens/images"]) cp(d, d); // the lobby splash turf's icon (SStitle) lives in config/
// browse_rsc'd from code/ (html_interface windows like the crew monitor, tooltips): everything but the .dm source
const notDm = (f) => !f.endsWith(".dm");
for (const d of ["code/modules/html_interface", "code/modules/tooltip"]) cp(d, d, notDm);
for (const f of ["crew.js", "crew.css"]) cp(`code/game/machinery/computer/${f}`, `code/game/machinery/computer/${f}`);

// rewrite root-absolute URLs. Page is dist/index.html; fetch()/Image resolve against it, the worker resolves against its own file.
const sub = (file, pairs) => {
	let t = readFileSync(join(out, file), "utf8");
	for (const [a, b] of pairs) { if (!t.includes(a)) throw new Error(`${file}: pattern not found: ${a}`); t = t.split(a).join(b); }
	writeFileSync(join(out, file), t);
};
cp("web/worker/index.html", "index.html");
sub("index.html", [['"/web/', '"./web/'], ["/*SW_GATE*/", readFileSync(join(web, "worker/sw-gate.js"), "utf8")]]);
writeFileSync(join(out, "index.html"), fixCsp(readFileSync(join(out, "index.html"), "utf8"))); // tsh-chat: the edits above change the inline scripts' hashes
sub("web/worker/sound.js", [['fetch("/" +', 'fetch("./" +']]);
sub("web/worker/popups.js", [['fetch("/" +', 'fetch("./" +']]);
const up = "../../../../../"; // web/build/dist/src/worker -> dist root
sub("web/build/dist/src/worker/boot-worker.js", [['new URL("/" + path,', `new URL("${up}" + path,`], ['new URL("/interface/skin.dmf",', `new URL("${up}interface/skin.dmf",`]]);
sub("web/build/dist/src/render/station-client.js", [['"/" + iconPath', '"./" + iconPath']]);
sub("web/build/dist/src/render/draw-client.js", [['"/" + iconPath', '"./" + iconPath']]);

// Snapshot reuse: the saved world depends only on what runs up to the lobby: the game bundle, the type tree, the VFS bundle
// (maps, config), the .dmi icons (the boot reads sizes, states and pixels from them) and the engine plus Node tools (everything
// in src/ but render/ and worker/, which are page side, plus any render/ file the engine imports, e.g. render/inherit.js).
// If none of those changed since the last snapshot (same content hash), the cached one is copied in (~1 s) instead of booting
// again (~1 min). Page/worker/render/tgui edits keep it. `--fresh-snapshot` forces a new one.
const snapCache = join(web, "build/snapshot-cache"), snapKey = snapshotKey(web);
// one snapshot per map: BoxStation, runtime, and every map a web/scenarios/*.txt header names. Each has its own cache files
// (names from snapNames) and the same key.
const snapMaps = [""];
if (!process.argv.includes("--no-snapshot")) {
	const wanted = new Set(["runtime"]);
	const sdir = join(web, "scenarios");
	if (existsSync(sdir)) for (const f of readdirSync(sdir)) if (f.endsWith(".txt")) { const m = readFileSync(join(sdir, f), "utf8").match(/^\s*map\s*:\s*(\S+)/im); if (m) wanted.add(m[1]); }
	const seen = new Set(["box"]);
	for (const m of wanted) { const n = snapNames(m); if (!seen.has(n.slug)) { seen.add(n.slug); snapMaps.push(m); } }
}
for (const map of process.argv.includes("--no-snapshot") ? [] : snapMaps) {
	const nm = snapNames(map), label = map || "BoxStation";
	const cachedKey = (() => { try { return readFileSync(join(snapCache, nm.key), "utf8"); } catch { return ""; } })();
	if (!process.argv.includes("--fresh-snapshot") && cachedKey === snapKey && existsSync(join(snapCache, nm.gz)) && existsSync(join(snapCache, nm.meta))) {
		for (const f of [nm.gz, nm.meta]) cpSync(join(snapCache, f), join(out, "web/build", f));
		console.log(`snapshot ${label}: reused (nothing that runs before the lobby changed; --fresh-snapshot to force a new one)`);
		continue;
	}
	// the pre-started world. Same game build + vfs-bundle.json as copied above (the snapshot only loads with its own build).
	// booted translated, always (the page can only load a translated snapshot).
	const raw = join(web, `build/world-${nm.slug}.snap`), logFile = join(web, `build/snapshot-build-${nm.slug}.log`), t0 = Date.now();
	rmSync(raw, { force: true });
	console.log(`booting ${label} to the lobby for the snapshot (~2 min)...`);
	const r = spawnSync(process.execPath, ["--max-old-space-size=4096", "build/dist/src/tools/boot.js", ...(map ? ["--map", map] : []), "--ticks", "100000", "--seconds", "600", "--snapshot-save", raw, "--snapshot-exit",
		"--log", logFile, "--data-out", join(web, `build/snapshot-build-data-${nm.slug}`)], { cwd: web, stdio: ["ignore", "ignore", "inherit"] });
	const log = readFileSync(logFile, "utf8");
	if (r.status !== 0 || !log.includes("[vm-boot] snapshot saved")) throw new Error(`snapshot boot of ${label} failed (exit ${r.status}); see ${logFile}`);
	const bootS = (Date.now() - t0) / 1000, runtimes = (log.match(/^\[vm-boot\] runtime:/gm) ?? []).length;
	if (runtimes) console.log(`WARNING: ${runtimes} runtime errors before the lobby in the ${label} snapshot boot (every load starts with them); see ${logFile}`);
	if (runtimes) buildWarnings.push(`${runtimes} runtime errors in the ${label} load (${logFile.replace(/.*\/web\//, "web/")})`); // for REBUILDS.log
	const t1 = Date.now(), gz = join(out, "web/build", nm.gz);
	await pipeline(createReadStream(raw), createGzip({ level: 6 }), createWriteStream(gz));
	const rawBytes = statSync(raw).size, gzBytes = statSync(gz).size;
	writeFileSync(join(out, "web/build", nm.meta), JSON.stringify({ raw: rawBytes, gz: gzBytes, made: new Date().toISOString() }) + "\n");
	console.log(`snapshot ${label}: ${(rawBytes / 1048576).toFixed(1)} MB raw, ${(gzBytes / 1048576).toFixed(1)} MB gzip; boot+save ${bootS.toFixed(0)} s, gzip ${((Date.now() - t1) / 1000).toFixed(0)} s; ${log.match(/^\[vm-boot\] snapshot saved.*$/m)?.[0].replace(/.* at /, "saved at ").slice(0, 60)}`);
	rmSync(raw, { force: true });
	mkdirSync(snapCache, { recursive: true });
	for (const f of [nm.gz, nm.meta]) cpSync(join(out, "web/build", f), join(snapCache, f));
	writeFileSync(join(snapCache, nm.key), snapKey);
}
// make-snapshot.mjs's own snapshots (world-NAME.snap.gz, key-NAME in the cache): shipped while they still match this build.
for (const f of process.argv.includes("--no-snapshot") || !existsSync(snapCache) ? [] : readdirSync(snapCache)) {
	const m = f.match(/^key-(.+)$/);
	if (!m || snapMaps.some((x) => snapNames(x).key === f)) continue;
	const nm = { gz: `world-${m[1]}.snap.gz`, meta: `world-${m[1]}-snap.json` };
	if (!existsSync(join(snapCache, nm.gz)) || !existsSync(join(snapCache, nm.meta))) continue;
	if (readFileSync(join(snapCache, f), "utf8") !== snapKey) { console.log(`snapshot ${m[1]}: out of date (the game changed since), not shipped; remake it with tools/make-snapshot.mjs`); continue; }
	for (const x of [nm.gz, nm.meta]) cpSync(join(snapCache, x), join(out, "web/build", x));
	console.log(`snapshot ${m[1]}: shipped (made by make-snapshot)`);
}

writeSw(out);
if (out === join(web, "dist")) logRebuild(process.argv.includes("--no-snapshot") ? "game (web/dist), quick" : "game (web/dist)", buildWarnings); // REBUILDS.log: only the playable copy, not teammates' own copies
