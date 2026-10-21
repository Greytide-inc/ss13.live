// station-dump - Node script that boots tgstation in the VM to the end of init (so
// SSatoms' Initialize()/LateInitialize() -- smoothing, overlay rebuilds, spawner resolution -- have
// all run, the same "postinit" point the map check dumps at) and writes every turf/obj/mob
// appearance on Box Station (z2) to web/build/2g/station.json, in appearance-dump's per-tile format, for the
// station view in web/draw/index.html?scene=station.
//
// Reuses boot.ts's exact VM setup (the game program + new VM + vfs bundle + iconSize + debugInfo +
// lenient mode) and buildAppearance(). Unlike boot.ts this
// keeps the VM alive after the run to walk vm.map, instead of just writing a log and exiting.
//
// Stopping point: runs ticks until the "Game start took ...s" world.log line (printed by
// code/controllers/subsystem/ticker.dm right before "Welcome to ...", the same marker boot.ts's
// --after-start watches). Master.Initialize() -- every subsystem's Initialize(), including SSatoms
// -- has fully finished by then (round start is the very next thing that happens), so this is a
// real, no-shortcuts stopping point, not a fixed tick count.
//
// Usage: npm run station-dump (needs web/build/game-types.js and translated-tg.js from node tools/translate-tg.mjs, and
// web/build/vfs-bundle.json; no tgstation.json any more). Takes a couple of minutes (VM boot to round start).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { VM } from "../vm/interpreter.js";
import { ObjectTree } from "../vm/objtree.js";
import { gameProgram } from "../vm/typedefs.js";
import { Vfs } from "../vfs/vfs.js";
import type { VfsBundle } from "../vfs/bundle-format.js";
import { iconSizeReader } from "./dmi-size.js";
import { buildTile, type Tile } from "./tile-dump.js";

// build/dist/src/tools/station-dump.js -> up 4 to web/
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
const repoRoot = dirname(webDir);
const bundlePath = resolve(repoRoot, "web/build/vfs-bundle.json");
const outDir = resolve(repoRoot, "web/build/2g");
const outPath = resolve(outDir, "station.json");

const argv = process.argv.slice(2);
const opt = (name: string, dflt: string) => {
	const i = argv.indexOf(name);
	return i >= 0 && i + 1 < argv.length ? argv[i + 1] : dflt;
};
const maxTicks = Number(opt("--ticks", "20000"));
const maxSeconds = Number(opt("--seconds", "400"));
// --z 2 (Box Station, the default) or a list like 2,1,5: the first goes to station.json, the others to station-z<N>.json.
const zLevels = opt("--z", "2").split(",").map(Number);

for (const f of [bundlePath]) {
	if (!existsSync(f)) {
		console.error(`missing ${f}: run npm run bundle-vfs first`);
		process.exit(1);
	}
}

// Same tree as boot.ts: everything from web/game (build/game-types.js, made by tools/translate-tg.mjs); the procs run
// as build/translated-tg.js (there's no bytecode).
await import(pathToFileURL(resolve(repoRoot, "web/build/game-types.js")).href);
const tree = new ObjectTree(gameProgram());
const bundle = JSON.parse(readFileSync(bundlePath, "utf8")) as VfsBundle;
const cfg = bundle.files["config/config.txt"];
if (cfg) bundle.files["config/config.txt"] = cfg.replace(/^GUEST_BAN/m, "#GUEST_BAN"); // same one-line change boot.ts/the BYOND reference boot use

const vm = new VM(tree);
{
	const rt = await import("../translate/runtime.js");
	await import(pathToFileURL(resolve(repoRoot, "web/build/translated-tg.js")).href);
	rt.install(vm);
}
// --diff: test:diff's fake clock (src/tools/diff/diary.ts), so two dumps with the same --seed can be compared byte for byte.
if (argv.includes("--diff")) (await import("./diff/diary.js")).enableDiffMode(vm, 0);
vm.vfs = new Vfs(bundle);
vm.lenient = true; // log gaps and runtime errors, don't stop the boot over them (matches boot.ts's default)
vm.debugInfo = true; // tgstation.dme defines DEBUG
vm.iconSize = iconSizeReader([repoRoot]);

const t0 = Date.now();
const secs = () => ((Date.now() - t0) / 1000).toFixed(1);
const ROUND_START_RE = /^Game start took [\d.]+s$/;
let roundStarted = false;
let rtErrors = 0, gaps = 0;
vm.worldLog = (s) => {
	if (ROUND_START_RE.test(s)) roundStarted = true;
};
vm.onRuntimeError = (e) => {
	if (e.message.startsWith("not implemented:")) gaps++;
	else rtErrors++;
};
const hardLimit = t0 + maxSeconds * 1000;
vm.onStopCheck = () => { if (roundStarted) throw new Error("station-dump: round start reached"); if (Date.now() >= hardLimit) throw new Error("station-dump: --seconds limit reached inside a tick"); };

console.error(`[station-dump] booting (global init + compiled maps + world/New) at ${secs()}s`);
let ticks = 0;
try {
	if (opt("--seed", "")) vm.rng.seed(Number(opt("--seed", ""))); // the world is random (spawners, lavaland caves): seed it to compare two dumps
	vm.boot();
	console.error(`[station-dump] compile-time maps ${vm.mapReadMs < 0 ? "from the program's Maps" : `read from the .dmm files in ${vm.mapReadMs.toFixed(0)} ms`}`);
	while (!roundStarted && ticks < maxTicks && Date.now() < hardLimit) {
		const due = vm.nextDue();
		if (due === null) break;
		vm.sched.skipTicks(due - vm.sched.tick - 1);
		vm.runTick();
		ticks++;
	}
} catch (e) {
	if (!(roundStarted && (e as Error).message === "station-dump: round start reached")) {
		console.error(`[station-dump] FATAL: ${(e as Error).stack ?? e}`);
		process.exit(1);
	}
}
if (!roundStarted) {
	console.error(`[station-dump] FATAL: round start not reached within ${ticks} ticks / ${maxSeconds}s (increase --ticks/--seconds)`);
	process.exit(1);
}
console.error(`[station-dump] round start reached at ${secs()}s wall, ${ticks} ticks, world.time ${vm.sched.time}, ${rtErrors} runtime errors, ${gaps} VM gaps`);

for (const [zi, zLevel] of zLevels.entries()) {
	const zOut = zi === 0 ? outPath : resolve(outDir, `station-z${zLevel}.json`);
	// ---- walk z=zLevel and build one BuiltAppearance list per tile (tile-dump.ts: turf + visible
	// contents, invisibility > SEE_INVISIBLE_LIVING left out) ----
	const maxx = vm.map.maxx, maxy = vm.map.maxy, maxz = vm.map.maxz;
	if (zLevel > maxz) {
		console.error(`[station-dump] FATAL: z=${zLevel} requested but world.maxz=${maxz}`);
		process.exit(1);
	}
	console.error(`[station-dump] walking z=${zLevel}, ${maxx}x${maxy} = ${maxx * maxy} tiles`);

	const tiles: Tile[] = [];
	const counts = { drawn: 0, hidden: 0 };
	for (let y = 1; y <= maxy; y++) {
		for (let x = 1; x <= maxx; x++) {
			const t = buildTile(vm, x, y, zLevel, counts);
			if (t) tiles.push(t);
		}
	}
	const objCount = counts.drawn, hiddenCount = counts.hidden;
	console.error(`[station-dump] built ${tiles.length} tiles, ${objCount} objs/mobs drawn, ${hiddenCount} hidden by invisibility`);

	// Areas are deliberately left out: /area/Initialize() (code/game/area/areas.dm) sets every real
	// area's icon_state = "" once init has run (the point this dump runs at), so they have no visible
	// sprite in-game; only turfs/objs/mobs are ever drawn on the map.

	mkdirSync(outDir, { recursive: true });
	const dump = {
		builtAt: new Date().toISOString(),
		z: zLevel,
		width: maxx,
		height: maxy,
		tiles,
	};
	writeFileSync(zOut, JSON.stringify(dump));
	console.error(`[station-dump] wrote ${tiles.length} tiles to ${zOut}`);
	console.log(`wrote ${tiles.length} tiles (${objCount} objs/mobs) to ${zOut}`);
}
