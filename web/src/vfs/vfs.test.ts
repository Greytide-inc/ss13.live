// vfs.test.ts - Node tests for the VFS module, run against the real bundle.
// Usage: part of npm test (builds web/build/vfs-bundle.json first if missing)
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Vfs } from "./vfs.js";
import type { VfsBundle } from "./bundle-format.js";

// build/dist/src/vfs/vfs.test.js -> up 4 to web/
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
const bundlePath = join(webDir, "build/vfs-bundle.json");

let failures = 0;
function check(name: string, got: unknown, want: unknown) {
	const g = JSON.stringify(got);
	const w = JSON.stringify(want);
	if (g === w) {
		console.log(`ok   ${name}`);
	} else {
		failures++;
		console.log(`FAIL ${name}: got ${g} want ${w}`);
	}
}

if (!existsSync(bundlePath)) {
	console.log("bundle missing, building it...");
	execFileSync("node", [join(webDir, "build/dist/src/tools/bundle-vfs.js"), bundlePath], { stdio: "inherit" });
}
const bundle: VfsBundle = JSON.parse(readFileSync(bundlePath, "utf8"));
console.log(`loaded bundle: ${Object.keys(bundle.files).length} files, ${bundle.dirs.length} dirs`);

// ---- reads against the real bundle ----
{
	const vfs = new Vfs(bundle);
	const cfg = vfs.readText("config/config.txt");
	check("readText config/config.txt is non-null", cfg !== null, true);
	check("readText config/config.txt looks right", cfg!.includes("SERVERNAME"), true);

	// flist("config/") in slash mode: immediate children, dirs suffixed "/".
	const l = vfs.list("config/");
	check("flist(config/) includes config.txt", l.includes("config.txt"), true);
	check("flist(config/) includes title_screens/ as a dir", l.includes("title_screens/"), true);
	check("flist(config/) excludes nested images", l.includes("images/"), false);

	// flist prefix-filter mode (measured BYOND quirk: no trailing slash matches the parent).
	const rootMatch = vfs.list("config");
	check("flist(config) [no slash] == ['config/']", rootMatch, ["config/"]);

	// a .dmm file exists and has content.
	const dmm = vfs.readText("_maps/map_files/BoxStation/BoxStation.dmm");
	check("BoxStation.dmm non-null", dmm !== null, true);
	check("BoxStation.dmm looks like a dmm", dmm!.startsWith("//MAP CONVERTED"), true);

	// fexists on dir with/without trailing slash, and on a missing path.
	check("exists(_maps) dir, no slash", vfs.exists("_maps"), true);
	check("exists(_maps/) dir, slash", vfs.exists("_maps/"), true);
	check("exists(nope.txt) missing", vfs.exists("nope.txt"), false);
	check("readText(nope.txt) missing -> null", vfs.readText("nope.txt"), null);
	check("readText(_maps) dir -> ''", vfs.readText("_maps"), "");

	// backslash / "./" path handling.
	check("backslash path == forward slash", vfs.readText("config\\config.txt") === cfg, true);
	check("./ prefix stripped", vfs.readText("./config/config.txt") === cfg, true);
}

// ---- write-then-read in the overlay (fresh Vfs each time so tests are independent) ----
{
	const vfs = new Vfs(bundle);
	check("overlay file doesn't exist yet", vfs.exists("data/logs/round.txt"), false);
	vfs.appendText("data/logs/round.txt", "line one");
	check("overlay dir auto-created", vfs.exists("data/logs"), true);
	check("overlay dir listed by parent", vfs.list("data/").includes("logs/"), true);
	check("overlay file readable", vfs.readText("data/logs/round.txt"), "line one\n");
	vfs.appendText("data/logs/round.txt", "line two");
	check("text2file appends, doesn't overwrite", vfs.readText("data/logs/round.txt"), "line one\nline two\n");

	vfs.copy("data/logs/round.txt", "data/logs/copy.txt");
	check("fcopy copies content", vfs.readText("data/logs/copy.txt"), "line one\nline two\n");

	check("fdel file returns true", vfs.delete("data/logs/copy.txt"), true);
	check("fdel'd file gone", vfs.exists("data/logs/copy.txt"), false);

	check("fdel dir returns true", vfs.delete("data/logs/"), true);
	check("fdel'd dir gone", vfs.exists("data/logs"), false);
	check("fdel'd dir's parent survives", vfs.exists("data"), true);

	// deleting a base file (config/ is read-only content, but nothing stops a write attempt at
	// this layer -- DM code never writes into config/, this just checks overlay-over-base works).
	check("base file exists before delete", vfs.exists("config/motd.txt"), true);
	vfs.delete("config/motd.txt");
	check("base file gone after overlay delete", vfs.exists("config/motd.txt"), false);
	check("base file absent from parent listing", vfs.list("config/").includes("motd.txt"), false);
}

// overlay export/import: what the worker keeps in IndexedDB
{
	const a = new Vfs({ generatedAt: "", files: { "config/x.txt": "base" }, dirs: ["", "config/"] });
	const r0 = a.revision;
	a.writeText("data/player_saves/a/anon/preferences.sav", "h\u00e9llo");
	a.appendText("data/logs/game.log", "line");
	a.writeText("config/x.txt", "changed");
	a.delete("data/logs/game.log");
	check("revision moves on writes", a.revision > r0, true);
	const all = a.exportOverlay();
	check("export lists live overlay files, not deleted ones", Object.keys(all).sort(), ["config/x.txt", "data/player_saves/a/anon/preferences.sav"]);
	const saves = a.exportOverlay((p) => p.startsWith("data/"));
	check("export filter", Object.keys(saves), ["data/player_saves/a/anon/preferences.sav"]);
	check("export is UTF-8 bytes", saves["data/player_saves/a/anon/preferences.sav"] instanceof Uint8Array, true);
	const b = new Vfs({ generatedAt: "", files: { "config/x.txt": "base" }, dirs: ["", "config/"] });
	b.importOverlay(saves);
	check("import restores the file", b.readText("data/player_saves/a/anon/preferences.sav"), "h\u00e9llo");
	check("import creates the directories", b.list("data/player_saves/a/"), ["anon/"]);
	check("import leaves the base alone", b.readText("config/x.txt"), "base");
}

{
	const v = new Vfs({ generatedAt: "", files: { "sound/piano/ab1.ogg": "x", "Code/Foo.txt": "y" }, dirs: ["", "sound/", "sound/piano/", "Code/"] });
	check("case: exact path unchanged", v.resolve("sound/piano/ab1.ogg"), "sound/piano/ab1.ogg");
	check("case: Windows-style name resolves to the real one", v.resolve("sound/piano/Ab1.ogg"), "sound/piano/ab1.ogg");
	check("case: fexists ignores case", v.exists("SOUND/piano/AB1.OGG"), true);
	check("case: file2text ignores case", v.readText("code/foo.txt"), "y");
	check("case: directory", v.isDir("Sound/Piano/"), true);
	check("case: missing stays missing", [v.exists("sound/piano/zz.ogg"), v.resolve("a/B.ogg")], [false, "a/B.ogg"]);
	const real = new Vfs(bundle);
	check("case: real bundle, musician.dm's Ab1.ogg", [real.exists("sound/piano/Ab1.ogg"), real.resolve("sound/piano/Ab1.ogg")], [true, "sound/piano/ab1.ogg"]);
	check("case: real bundle, guitar dir listed", real.list("sound/guitar/").length > 10, true);
	v.writeText("data/New.txt", "z");
	check("case: overlay exact still wins", v.readText("data/New.txt"), "z");
}

console.log(failures === 0 ? "all vfs tests passed" : `${failures} vfs test(s) FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
