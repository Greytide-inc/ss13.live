// boot - Boot tgstation in the VM, headless, and write everything it logs to web/build/vm-boot.log.
// Usage (from web/): npm run boot -- [--ticks N] [--seconds S] [--after-start S] [--strict] [--log file] [--data-out DIR]
//   --ticks N       game ticks to run after world/New() returns or sleeps (default 400 = 20 s of game time at fps 20)
//   --seconds S     wall-clock limit for the whole run (default 300, or 900 if --after-start is given and
//                   --seconds isn't). Also enforced inside a long or stuck proc: the boot then stops with
//                   "[vm-boot] FATAL: boot timeout" and the running call stack.
//   --after-start S stop S wall-clock seconds after round start ("Game start took ...s" in the log, the
//                   same line tg's ticker prints right before "Welcome to ..."), instead of running the
//                   full --seconds budget. Whichever of --seconds/--after-start elapses first wins; use
//                   this to boot far enough for compare-logs without paying for the rest of the round.
//   --strict     stop at the first missing feature instead of logging it and carrying on
//   --stop-at RE    stop as soon as a world.log line matches the regex RE (used by the map check)
//   --connect KEY   at round start, connect a player with this key (DreamSeeker on localhost, see
//                   vm/clients.ts); at the end, write what it would see to --client-out
//   --client-out F  where --connect's dump goes (default web/build/2i/client.json)
//   --join JOB      with --connect: 20 ticks after connecting, join the round as JOB (e.g. Assistant) the
//                   way the lobby's late-join window does (a Topic "SelectedJob=JOB" click on the
//                   new_player), so tg spawns the mob. The lobby view is dumped just before, to
//                   --client-out with ".json" replaced by "-lobby.json".
//   --snapshot-save F  at the first tick boundary after "Initializations complete" (the lobby),
//                   save the whole world to F (vm/snapshot.ts), then carry on booting (or stop, with
//                   --snapshot-exit). Prints the size (raw and gzipped) and the save time.
//   --snapshot-after-start S  with --snapshot-save: save S seconds of game time after round start instead (a mid-round
//                   world with no players; the page's ?snap=NAME loads it and you late-join). tools/make-snapshot.mjs uses it.
//   --snapshot-load F  instead of booting, load the world saved in F and carry on from there. The
//                   log starts with the saved boot's log up to the snapshot, so compare-logs still
//                   sees every milestone. The RNG is reseeded (--seed N, else a random seed), so each
//                   load plays a different round.
//   --endround S    S seconds of game time after round start, end the round through tg's own path (what the
//                   admin "End Round" verb does: SSticker.force_ending = 1), then declare_completion, the round-end
//                   report and SSticker.Reboot -> world.Reboot(). The boot stops when world.Reboot() is called.
//   --translated    no-op now (kept so scripts work): the game always runs as web/build/translated-tg.js.
//   --gender G      with --join: just before joining, if the character's gender isn't G (male/female),
//                   click the character setup window's Gender link (a Topic "_src_=prefs;preference=gender")
//   --scenario NAME reads web/scenarios/NAME.txt (header map/job/seed/length + script lines, see src/worker/scenario-script.ts): connects in the
//                   lobby, readies as the job (round-start join, like the page's ?join=JOB&roundstart=1), starts the script's tick 0 when the mob
//                   spawns, stops `length` seconds (20 ticks each) later. Loads the map's build/snapshot-cache snapshot (world.snap.gz for BoxStation) when the
//                   cache matches this build (else boots normally). Fake clock on (same seed = same run); --real-clock turns that off; --no-snapshot.
// Needs web/build/game-types.js and translated-tg.js (node tools/translate-tg.mjs) and web/build/vfs-bundle.json
// (npm run bundle-vfs). no tgstation.json any more; the program is the game files.
//
// The log is one stream: world.log output as-is, BYOND-style "runtime error:" blocks for runtime
// errors, and "not implemented:" blocks for VM gaps (lenient mode). A summary of the gaps, in the
// order they were first hit, goes to the end of the log and to stdout.

import { closeSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, writeSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { dirname } from "node:path";
import { resolve } from "node:path";
import { repoRoot } from "./repo-root.js";
import { VM, type RuntimeErrorRecord } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { refOf } from "../vm/refs.js";
import { isTruthy } from "../vm/value.js";
import { Kind } from "../vm/world.js";
import { ObjectTree } from "../vm/objtree.js";
import { gameProgram } from "../vm/typedefs.js";
import { Vfs } from "../vfs/vfs.js";
import { iconLoader, iconStatesReader } from "../dmi/dmi-node.js";
import { iconSizeReader } from "./dmi-size.js";
import { dumpClients } from "./client-dump.js";
import { loadSnapshot, resumeWorld, saveSnapshot } from "../vm/snapshot.js";
import { TAIL_MARK } from "../vm/scheduler.js";
import { gzipSync } from "node:zlib";
import { Session } from "node:inspector";
import { dumpWorld } from "./dk1-dump.js";
import { ScriptPlayer, parseHeader, TICKS_PER_SECOND } from "../worker/scenario-script.js";
import { holdLobby, readyAtRoundStart, restoreJobPrefs } from "../worker/test-aids.js";
import { gunzipSync } from "node:zlib";
import { BombProbe } from "./bomb1-probe.js";
import { stress, stressStart, stressTakeGc, gcFrom } from "../vm/stress-log.js";
import { diffHook } from "../vm/clockhook.js";
import { randomInt } from "node:crypto";
import type { VfsBundle } from "../vfs/bundle-format.js";

const argv = process.argv.slice(2);
const opt = (name: string, dflt: string) => {
	const i = argv.indexOf(name);
	return i >= 0 && i + 1 < argv.length ? argv[i + 1] : dflt;
};
// --scenario NAME: web/scenarios/NAME.txt (header: map, job, seed, length) is the script AND the setup: map, seed, round-start join as the job, run length.
const scenarioName = opt("--scenario", "");
const scenarioText = scenarioName ? readFileSync(resolve(repoRoot, "web/scenarios", `${scenarioName}.txt`), "utf8") : "";
const scen = scenarioName ? parseHeader(scenarioText) : null;
if (scen && (!scen.job || !scen.length)) throw new Error(`scenario ${scenarioName}: header needs job: and length:`);
const maxTicks = Number(opt("--ticks", scen ? "10000000" : "400"));
const afterStartArg = argv.includes("--after-start") ? opt("--after-start", "") : null;
const afterStartSeconds = afterStartArg !== null ? Number(afterStartArg) : null;
// Safety-cap default: 300 s normally, but 900 s when only --after-start is given (round start alone
// can take a few minutes of init first).
const maxSeconds = Number(opt("--seconds", scen ? "1800" : afterStartSeconds !== null ? "900" : "300"));
const strict = argv.includes("--strict");
const logFile = resolve(opt("--log", resolve(repoRoot, "web/build/vm-boot.log")));

const stopAtArg = opt("--stop-at", "");
const stopAtRe = stopAtArg ? new RegExp(stopAtArg) : null;
let stopAtHit = false;
const connectKey = opt("--connect", scen ? "LocalPlayer" : "");
const clientOut = resolve(opt("--client-out", resolve(repoRoot, "web/build/2i/client.json")));
let connected = false;
const joinJob = opt("--join", scen?.job ?? "");
const wantGender = opt("--gender", "");
let joinTick: number | null = null;
let savedJobPrefs: Record<string, import("../vm/value.js").Value> | null = null;
let genderClickAt = -1;
const endRoundArg = opt("--endround", "");
let endRoundAt: number | null = null; // world.time to set SSticker.force_ending
const bundleFile = resolve(repoRoot, "web/build/vfs-bundle.json");
for (const f of [bundleFile]) if (!existsSync(f)) throw new Error(`${f} missing (see the usage comment)`);

// Synchronous writes: the boot runs without yielding to the event loop, so a stream would only flush at the end.
const fd = openSync(logFile, "w");
const snapSave = opt("--snapshot-save", "");
let snapLoad = opt("--snapshot-load", "");
const snapAfterStart = argv.includes("--snapshot-after-start") ? Number(opt("--snapshot-after-start", "0")) : null;
/** --snapshot-after-start: mid-round, a proc can be asleep inside a generator (a moving transit tube pod, a do_after), which
 *  saveSnapshot can't hold; only tails (rt.sleepThen/sleepKeep/spawnTail) can. Wait tick by tick until none is, at most 2 min of
 *  game time, logging what is in the way (the same test as saveSnapshot's). */
let snapWaitFrom = -1, snapWaitLast = "";
const saveableNow = (): boolean => {
	const busy: string[] = [];
	for (const t of vm.sched.sleepers()) t.frames.forEach((f, i) => {
		if (f.gen !== null && (f.pendingError !== null || f.locals[0] !== TAIL_MARK || (i > 0 && t.frames[i - 1].gen === f.gen))) busy.push(f.proc.path);
	});
	if (!busy.length) { if (snapWaitFrom >= 0) log(`[vm-boot] snapshot: waited ${((vm.sched.time - snapWaitFrom) / 10).toFixed(1)} s of game time for sleeping procs to finish`); return true; }
	if (snapWaitFrom < 0) snapWaitFrom = vm.sched.time;
	const now = [...new Set(busy)].join(", ");
	if (now !== snapWaitLast) log(`[vm-boot] snapshot: waiting, asleep where it can't be saved: ${(snapWaitLast = now)}, world.time ${vm.sched.time}`);
	if (vm.sched.time - snapWaitFrom > 1200) throw new Error(`snapshot: still can't save after 2 min of game time; asleep: ${now} (make their sleeps tails, see web/game/README.md)`);
	return false;
};
const isBoxStation = (m?: string) => !m || /^box(station)?$/i.test(m);
/** the log so far, kept until the snapshot is saved (it goes into the snapshot). */
let logLines: string[] | null = snapSave ? [] : null;
const scenLog: string[] = []; // every line, for the scenario's expect: / expect-not: lines at the end of the run
const log = (s: string) => {
	writeSync(fd, s + "\n");
	logLines?.push(s);
	if (scen?.expect || scen?.expectNot) scenLog.push(s);
};
const t0 = Date.now();
const secs = () => ((Date.now() - t0) / 1000).toFixed(1);

// web/game declares the type tree, globals and string table (rt.type etc.), bundled as build/game-types.js by
// tools/translate-tg.mjs; it is imported before the tree is built (procs too, ids = rt.def order).
const tTree = Date.now();
await import(pathToFileURL(resolve(repoRoot, "web/build/game-types.js")).href);
const tree = new ObjectTree(gameProgram());
log(`[vm-boot] type tree from web/game (build/game-types.js) built in ${((Date.now() - tTree) / 1000).toFixed(2)} s`);
const bundle = JSON.parse(readFileSync(bundleFile, "utf8")) as VfsBundle;
// Same one-line config change as the BYOND reference boot (web/reference/boot-byond.sh).
const cfg = bundle.files["config/config.txt"];
if (cfg) bundle.files["config/config.txt"] = cfg.replace(/^GUEST_BAN/m, "#GUEST_BAN");

const vm = new VM(tree);
vm.vfs = new Vfs(bundle);
const mapOpt = opt("--map", scen && !isBoxStation(scen.map) ? scen.map! : ""); // --map runtime boots Runtime Station (data/next_map.json from _maps/runtimestation.json)
if (mapOpt) { const mj = bundle.files[`_maps/${mapOpt}station.json`] ?? bundle.files[`_maps/${mapOpt}.json`]; if (!mj) throw new Error(`no _maps json for --map ${mapOpt}`); vm.vfs.writeText("data/next_map.json", mj); }
// --diff (or DIFF=1): fake clock, collector at tick boundaries, one diary line per tick (src/tools/diff/diary.ts).
// --diff-out PREFIX (default: the --log path without .log) names PREFIX.diary and PREFIX.diary.log; --diff-after-start N stops N ticks after round start.
const diffOn = argv.includes("--diff") || process.env.DIFF === "1";
const diffTicks = argv.includes("--diff-ticks") ? Number(opt("--diff-ticks", "0")) : -1; // run this many ticks from the start of the loop (after a snapshot load too)
const diffAfterStart = argv.includes("--diff-after-start") ? Number(opt("--diff-after-start", "0")) : -1;
let diary = null as import("./diff/diary.js").Diary | null;
let startDiary: () => void = () => {};
const dkCounts = new Map<string, number>(); // DK_COUNT tallies
let trSetEnter: typeof import("../translate/runtime.js").setEnterHook | null = null; // set when the bundle loads
if (diffOn) {
	const dm = await import("./diff/diary.js");
	// --diff-vcost [N] (or DIFF_VCOST=1|N): tick_usage = DM proc calls this tick / N (N calls = 1 %), so CHECK_TICK sleeps sometimes.
	const vi = argv.indexOf("--diff-vcost");
	const vArg = vi >= 0 && vi + 1 < argv.length && /^\d+$/.test(argv[vi + 1]) ? Number(argv[vi + 1]) : vi >= 0 ? 1 : process.env.DIFF_VCOST ? Number(process.env.DIFF_VCOST) : 0;
	dm.enableDiffMode(vm, vArg === 1 ? dm.VCOST_DEFAULT : vArg);
	startDiary = () => { // after a snapshot load: that load rewrites the VM's fields
		const prefix = opt("--diff-out", logFile.replace(/\.log$/, ""));
		diary = new dm.Diary(vm, prefix, trSetEnter);
		const tr = opt("--diff-trace", ""); // diff detail mode: --diff-trace FROM-TO (diary tick numbers)
		if (tr) { const m = /^(\d+)-(\d+)$/.exec(tr); if (!m) throw new Error(`--diff-trace FROM-TO, got ${tr}`); diary.startTrace(prefix, Number(m[1]), Number(m[2]), trSetEnter); }
	};
}
if (scen && !diffOn && !argv.includes("--real-clock")) { // a scenario runs on the fake clock (world.timeofday, tick_usage fixed at 0), so the same seed gives the same run; --real-clock for the host's clock and real CHECK_TICK sleeps
	(await import("./diff/diary.js")).enableDiffMode(vm, 0);
	log("[scenario] fake clock on (deterministic; --real-clock to turn off)");
}
vm.lenient = !strict;
vm.debugInfo = true; // tgstation.dme defines DEBUG
vm.iconSize = iconSizeReader([repoRoot]); // icon Width()/Height() (tg's get_turf_pixel uses them)
vm.loadIcon = iconLoader([repoRoot]); // runtime icon pixels (GetPixel), read only when asked for
vm.iconStates = iconStatesReader([repoRoot]); // icon_states(): read from the file header only when asked for
{ // translated tg (tools/translate-tg.mjs); the one-module bundle the page loads too. always (no bytecode)
	const bundleJs = resolve(repoRoot, "web/build/translated-tg.js");
	const rt = await import("../translate/runtime.js");
	const tl = Date.now();
	await import(pathToFileURL(bundleJs).href);
	const n = rt.install(vm);
	trSetEnter = rt.setEnterHook;
	if (process.env.DK_COUNT) { // DK_COUNT=REGEX counts calls of translated procs whose path matches, inside the DK_PROF window (or the whole run without one); listed at the end
		const re = new RegExp(process.env.DK_COUNT), hit = new Map<unknown, boolean>();
		rt.setEnterHook((proc) => { if (dkProfTime >= 0 || dkProfTick >= 0 ? dkSession === null : false) return; let m = hit.get(proc); if (m === undefined) hit.set(proc, m = re.test(proc.path)); if (m) dkCounts.set(proc.path, (dkCounts.get(proc.path) ?? 0) + 1); });
	}
	log(`[vm-boot] translated: ${n} procs installed from ${bundleJs.slice(repoRoot.length + 1)} in ${((Date.now() - tl) / 1000).toFixed(1)} s`);
}
const scriptFile = opt("--script", scen ? `web/scenarios/${scenarioName}.txt` : ""); // dt-in: tick-scripted player (src/worker/scenario-script.ts); needs --connect, usually --join
const scriptPlayer = scriptFile ? new ScriptPlayer(vm, scen ? scenarioText : readFileSync(resolve(scriptFile), "utf8"), log, resolve(scriptFile)) : null;
const bombProbe = process.env.BOMB_TL ? new BombProbe(vm, log) : null; // bomb1
let scriptStart = -1; // the tick the player got its mob (join click, or connect without --join)
if (connectKey) vm.clients.setSkin(readFileSync(resolve(repoRoot, "interface/skin.dmf"), "utf8"));
// Detect round start ("Game start took ...s", printed right before "Welcome to ..." in
// code/controllers/subsystem/ticker.dm) to drive --after-start, without changing what gets logged.
const ROUND_START_RE = /^Game start took [\d.]+s$/;
const INIT_DONE_RE = /^Initializations complete within /;
let initDone = false;
let afterStartLimit: number | null = null; // wall-clock ms deadline once round start is seen
const azProbe = !!process.env.AZ_PROBE; // log area z counts and num_territories 200 ticks after round start
let roundStart: { ms: number; ticks: number; } | null = null; // for the ms/tick-after-round-start line
let roundStartTime = -1; // world.time at round start (--snapshot-after-start)
vm.worldLog = (s: string) => {
	log(s);
	diary?.line("log", s);
	if (!initDone && INIT_DONE_RE.test(s)) initDone = true;
	if (stopAtRe && !stopAtHit && stopAtRe.test(s)) stopAtHit = true;
	if (roundStart === null && ROUND_START_RE.test(s)) {
		roundStart = { ms: Date.now(), ticks };
		roundStartTime = vm.sched.time;
		if (endRoundArg) endRoundAt = vm.sched.time + Number(endRoundArg) * 10;
	}
	if (afterStartSeconds !== null && afterStartLimit === null && ROUND_START_RE.test(s)) {
		afterStartLimit = Date.now() + afterStartSeconds * 1000;
		log(`[vm-boot] round start detected at ${secs()} s wall; stopping ${afterStartSeconds} s after this (--after-start)`);
	}
};
const effectiveDeadline = () => (afterStartLimit !== null ? Math.min(hardLimit, afterStartLimit) : hardLimit);
// Every runtime error also gets a one-line [vm-boot] note (tg's world/Error prints its own dump).
vm.onRuntimeError = (e) => {
	diary?.line("runtime", `${e.message} | ${e.proc}`);
	log(`[vm-boot] ${e.message.startsWith("not implemented:") ? "VM gap" : "runtime"}: ${e.message} | ${e.proc} (${e.game ? `${e.game}, DM ` : ""}${e.source}) | ${e.callStack.slice(1, 6).join(" <- ")}`);
};

// The time limits: checked between ticks, and inside a long tick by vm.onStopCheck below.
const hardLimit = t0 + maxSeconds * 1000;
// Inside a long tick the VM calls this about every 4096 generator steps; past the deadline it throws to stop the run.
vm.onStopCheck = () => { if (Date.now() >= effectiveDeadline()) throw new Error("wall-clock stop"); };

// --stress-log FILE (or STRESS_LOG=FILE): one JSON line per tick after the spawn + FILE.cpuprofile + a summary line (see web/tools/stress-report.mjs). Off = nothing here runs.
const stressFile = opt("--stress-log", process.env.STRESS_LOG ?? "");
const stressLines: string[] = [];
const stressAll = new Map<string, [number, number]>(), stressSlow = new Map<string, [number, number]>();
let stressSession: Session | null = null, stressPerf0 = 0, stressLag = 0, stressWall0 = 0, stressTime0 = 0, stressTick0 = 0;
if (stressFile) stressStart();
let fatal: unknown = null;
let ticks = 0;
const dkProfTick = Number(process.env.DK_PROF_TICK ?? -1); // DK_PROF_TICK=N (+ DK_PROF_OUT=file) writes a cpuprofile of just tick N (0-based count before it runs)
let dkSession: Session | null = null;
const dkSpan = Number(process.env.DK_PROF_SPAN ?? 6); // ticks the DK_PROF_TIME profile covers
const dkProfTime = Number(process.env.DK_PROF_TIME ?? -1); // DK_PROF_TIME=T profiles the 4 ticks from world.time T instead
let dkDumped = false, dkProfDone = false, dkProfStop = 0;
const dkSlow = Number(process.env.DK_SLOW ?? 0); // DK_SLOW=MS logs every tick that took at least MS
if (scen && !snapLoad && !argv.includes("--no-snapshot")) { // the cached world of the scenario's map, if it matches this build (same key and file names build-static.mjs uses)
	const { snapshotKey, snapNames } = await import(pathToFileURL(resolve(repoRoot, "web/tools/snapshot-key.mjs")).href) as { snapshotKey: (web: string) => string; snapNames: (m?: string) => { gz: string; key: string } };
	const nm = snapNames(scen.map), snapGz = resolve(repoRoot, "web/build/snapshot-cache", nm.gz), keyFile = resolve(repoRoot, "web/build/snapshot-cache", nm.key);
	let why = `no cached snapshot for ${scen.map ?? "BoxStation"}`;
	if (existsSync(snapGz) && existsSync(keyFile)) {
		if (snapshotKey(resolve(repoRoot, "web")) === readFileSync(keyFile, "utf8")) { snapLoad = snapGz; why = ""; } else why = "cached snapshot is from a different build (run build:static to refresh it)";
	}
	if (why) log(`[scenario] booting normally: ${why}`);
}
if (scen) log(`[scenario] ${scenarioName}: map ${scen.map ?? "BoxStation"}, job ${scen.job}, seed ${scen.seed ?? "default"}, length ${scen.length} s after the spawn; ${snapLoad ? "from snapshot" : "full boot"}`);
try {
	if (snapLoad) {
		const raw0 = readFileSync(snapLoad), raw = snapLoad.endsWith(".gz") ? gunzipSync(raw0) : raw0;
		const r = loadSnapshot(vm, raw);
		const host = r.host as { log: string[]; ticks: number; wall: number; seed?: number };
		for (const l of host.log) writeSync(fd, l + "\n");
		ticks = host.ticks;
		if (host.log.some((l) => ROUND_START_RE.test(l))) roundStart = { ms: Date.now(), ticks }; // a mid-round snapshot: the round has started
		initDone = true;
		// --seed keep: carry on with the saved RNG state (for snapshot-diff's save/load/save check).
		const seedOpt = opt("--seed", scen?.seed !== undefined ? String(scen.seed) : "");
		const seed = seedOpt === "keep" ? "kept" : seedOpt ? Number(seedOpt) : randomInt(0x7fffffff);
		const reset = resumeWorld(vm, typeof seed === "number" ? seed : null);
		if (connectKey) vm.clients.setSkin(readFileSync(resolve(repoRoot, "interface/skin.dmf"), "utf8")); // dt-in: the snapshot's world has no skin (worker does the same)
		log(`[vm-boot] snapshot loaded from ${snapLoad} (${(raw.length / 1048576).toFixed(1)} MB, ${r.objects} objects) in ${(r.ms / 1000).toFixed(1)} s (${r.deletes} property deletes) at ${secs()} s wall (the saved boot took ${host.wall.toFixed(1)} s to get here); world.time ${vm.sched.time}, tick ${vm.sched.tick}, ${vm.sched.sleeping} sleeping threads; RNG seed ${seed}; reset ${reset.join(", ") || "nothing"}; heap ${Math.round(process.memoryUsage().heapUsed / 1048576)} MB`);
		startDiary();
	} else {
		startDiary();
		if (opt("--seed", scen?.seed !== undefined ? String(scen.seed) : "")) vm.rng.seed(Number(opt("--seed", String(scen?.seed)))); // fresh boots take --seed too
		log(`[vm-boot] global init + compiled maps + world/New at ${secs()} s`);
		const thread = vm.boot();
		log(`[vm-boot] compile-time maps ${vm.mapReadMs < 0 ? "from the program's Maps" : `read from ${tree.json.MapFiles!.length} .dmm files in ${vm.mapReadMs.toFixed(0)} ms`}`);
		log(`[vm-boot] world/New ${thread?.done ? "returned" : "is sleeping"} at ${secs()} s, world.time ${vm.sched.time}`);
	}
	const diffTicks0 = ticks;
	while (ticks < maxTicks && Date.now() < effectiveDeadline() && !stopAtHit) {
		if (snapSave && initDone && logLines && (snapAfterStart === null || (roundStartTime >= 0 && vm.sched.time >= roundStartTime + snapAfterStart * 10 && saveableNow()))) {
			const heapBefore = process.memoryUsage().heapUsed;
			const lines = logLines;
			logLines = null;
			for (const th of vm.sched.sleepers()) log(`[vm-boot] snapshot: sleeping thread, ${th.frames.length} frames: ${th.frames.map((f) => { const at = f.gen !== null ? vm.translatedSource?.(f, null) : null; return f.proc.path + (at ? ` (${at.dm ?? at.game})` : ""); }).reverse().join(" <- ")}`);
			const { bytes, stats } = saveSnapshot(vm, { log: lines, ticks, wall: (Date.now() - t0) / 1000 });
			const tw = Date.now();
			writeFileSync(snapSave, bytes);
			const tz = Date.now();
			const gz = gzipSync(bytes, { level: 6 });
			const tzEnd = Date.now();
			log(`[vm-boot] snapshot saved to ${snapSave} at ${secs()} s wall: ${stats.objects} objects, ${(stats.bytes / 1048576).toFixed(1)} MB raw, ${(gz.length / 1048576).toFixed(1)} MB gzipped (gzip ${((tzEnd - tz) / 1000).toFixed(1)} s); save ${(stats.ms / 1000).toFixed(1)} s, write ${((tz - tw) / 1000).toFixed(1)} s; ${stats.strings} strings, ${stats.shapes} shapes; heap ${Math.round(heapBefore / 1048576)} MB before; world.time ${vm.sched.time}, tick ${vm.sched.tick}, ${vm.sched.sleeping} sleeping threads`);
			log(`[vm-boot] snapshot objects by class: ${stats.byClass.slice(0, 25).map(([k, c]) => `${k} ${c}`).join(", ")}; side tables ${JSON.stringify(stats.sideEntries)}`);
			if (argv.includes("--snapshot-exit")) break;
		}
		const due = vm.nextDue();
		if (due === null) break;
		vm.sched.skipTicks(due - vm.sched.tick - 1);
		if (dkProfTime >= 0 && !dkSession && vm.sched.time >= dkProfTime && !dkProfDone) { dkProfDone = true; dkProfStop = ticks + dkSpan; }
		if ((dkProfTick >= 0 && ticks === dkProfTick) || (dkProfTime >= 0 && dkProfDone && ticks === dkProfStop - dkSpan)) {
			dkSession = new Session();
			dkSession.connect();
			dkSession.post("Profiler.enable");
			dkSession.post("Profiler.setSamplingInterval", { interval: 50 });
			dkSession.post("Profiler.start");
		}
		if (process.env.DK_DUMP && !dkDumped && vm.sched.time >= Number(process.env.DK_DUMP_AT ?? 0)) { dkDumped = true; writeFileSync(process.env.DK_DUMP, dumpWorld(vm)); log(`[dk1] world dump written at world.time ${vm.sched.time}`); }
		if (process.env.MC_COST && ticks % 1000 === 0) {
			try {
				const mc = live(vm.globals[vm.tree.globalNames.indexOf("SSnpcpool")]);
				if (mc instanceof DMObject)
					log(`[npc1] tick ${ticks} NPC Pool cost ${Number(live(mc.getVar("cost"))).toFixed(2)} ms`);
			}
			catch (e) {
				log(`[npc1] cost read failed: ${(e as Error).message}`);
			}
		}
		if (process.env.DK_STAT && ticks % 1000 === 0) {
			const gi = vm.tree.globalNames.indexOf("SSair"), a = gi >= 0 ? live(vm.globals[gi]) : null;
			if (a instanceof DMObject) {
				const at = live(a.getVar("active_turfs")), eg = live(a.getVar("excited_groups"));
				log(`[dk1] stat tick ${ticks} world.time ${vm.sched.time}: active_turfs ${at instanceof DMList ? at.len : "?"}, excited_groups ${eg instanceof DMList ? eg.len : "?"}`);
				if (at instanceof DMList && process.env.DK_STAT === "xy")
					log(`[dk1] active ${ticks}: ${at.items.map((q) => { const t = live(q) as unknown as {
						x: number;
						y: number;
						z: number;
					}; return `${t.x},${t.y},${t.z}`; }).sort().join(" ")}`);
			}
		}
		const rs = roundStart as { ticks: number } | null;
		if (azProbe && rs && ticks === rs.ticks + 200) { // area x/y/z after round start
			let n = 0; const perZ: Record<string, number> = {};
			for (const a of vm.map.atomsOfKind(Kind.Area)) { n++; const z = String(vm.getField(a, "z")); perZ[z] = (perZ[z] ?? 0) + 1; }
			const g = live(vm.globals[vm.tree.globalNames.indexOf("GLOB")]), ss = g instanceof DMObject ? live(vm.getField(g, "start_state")) : null;
			log(`[az1] world.time ${vm.sched.time}: ${n} areas by z ${JSON.stringify(perZ)}; GLOB.start_state.num_territories ${ss instanceof DMObject ? vm.getField(ss, "num_territories") : "?"}`);
		}
		const dkT = dkSlow > 0 ? performance.now() : 0;
		const bombOn = bombProbe && scriptStart >= 0;
		if (bombOn) bombProbe.before(ticks - scriptStart); // times the script's own actions (the explosion starts inside them) plus the tick
		const stressOn = stressFile !== "" && scriptStart >= 0;
		if (stressOn) {
			if (!stressSession) {
				stressSession = new Session();
				stressSession.connect();
				stressSession.post("Profiler.enable");
				stressSession.post("Profiler.setSamplingInterval", { interval: 250 });
				stressSession.post("Profiler.start");
				stressPerf0 = performance.now();
				stressWall0 = Date.now();
				stressTime0 = vm.sched.time;
				stressTick0 = ticks;
				await new Promise((r) => setImmediate(r));
				stressTakeGc();
				stressPerf0 = performance.now();
				gcFrom.t = stressPerf0;
			}
			stress.los.clear(); stress.losCalls = 0; stress.losMs = 0; stress.usageReads = 0; stress.usageHi = 0; stress.usageOver = 0; stress.usageMax = 0; stress.runs = 0;
		}
		const stressT = stressOn ? performance.now() : 0;
		if (scriptPlayer && scriptStart >= 0) scriptPlayer.step(ticks - scriptStart);
		const stressStep = stressOn ? performance.now() - stressT : 0;
		if (diary) diary.beginTick(vm.sched.tick + 1);
		vm.clients.runAssetConfirms(); // send_asset's arrival check, as the page's client would answer it
		vm.runTick();
		if (stressOn) {
			const ms = performance.now() - stressT;
			await new Promise((r) => setImmediate(r)); // lets the GC observer deliver (after the tick's own timing)
			const gc = stressTakeGc();
			stressLag = Math.max(0, stressLag + ms - 50); // modelled as the page's worker paces it: a tick is 50 ms, a longer one makes the world fall behind (idle ticks bank nothing)
			const slow = ms > 100;
			const rec: Record<string, unknown> = { tick: ticks - stressTick0, wtick: vm.sched.tick, wtime: vm.sched.time, t: +(stressT - stressPerf0).toFixed(2), ms: +ms.toFixed(2), stepMs: +stressStep.toFixed(2), lag: +stressLag.toFixed(1), wallBehind: +(((Date.now() - stressWall0) - (vm.sched.time - stressTime0) * 100)).toFixed(0), los: stress.losCalls, losMs: +stress.losMs.toFixed(2), gcMs: +gc.ms.toFixed(2), gcN: gc.n, gcKinds: gc.n ? gc.kinds : undefined, threads: stress.runs, uReads: stress.usageReads, uHi: stress.usageHi, uOver: stress.usageOver, uMax: +stress.usageMax.toFixed(0), sleeping: vm.sched.sleeping };
			if (slow) rec.losBy = Object.fromEntries([...stress.los].sort((a, b) => b[1][1] - a[1][1]).slice(0, 12));
			for (const [k, v] of stress.los) for (const m of slow ? [stressAll, stressSlow] : [stressAll]) { const e = m.get(k); if (e) { e[0] += v[0]; e[1] += v[1]; } else m.set(k, [v[0], v[1]]); }
			stressLines.push(JSON.stringify(rec));
		}
		if (bombOn) bombProbe.after(ticks - scriptStart);
		ticks++;
		if (diary) {
			diary.tick();
			if (diffTicks >= 0 && ticks - diffTicks0 >= diffTicks) { log(`[vm-boot] --diff-ticks ${diffTicks} done at tick ${vm.sched.tick}; stopping`); break; }
			if (diffAfterStart >= 0 && diary.roundStartTick !== null && vm.sched.tick >= diary.roundStartTick + diffAfterStart) { log(`[vm-boot] --diff-after-start ${diffAfterStart} ticks done at tick ${vm.sched.tick}; stopping`); break; }
		}
		if (dkSession && (dkProfTime < 0 || ticks >= dkProfStop)) { const ses = dkSession; dkSession = null; ses.post("Profiler.stop", (_e, r) => { writeFileSync(process.env.DK_PROF_OUT ?? "dk1.cpuprofile", JSON.stringify(r.profile)); }); }
		if (dkSlow > 0) { const ms = performance.now() - dkT; if (ms >= dkSlow) log(`[dk1] slow tick ${ms.toFixed(0)} ms at world.time ${vm.sched.time} (tick ${ticks})`); }
		if (vm.rebootRequested) { // the browser worker starts the next world here; the Node boot just stops
			log(`[vm-boot] world.Reboot(${JSON.stringify(vm.rebootRequested.reason)}) at world.time ${vm.rebootRequested.time}, ${secs()} s wall: this world is over; stopping`);
			break;
		}
		if (endRoundAt !== null && vm.sched.time >= endRoundAt) {
			endRoundAt = null;
			const gi = vm.tree.globalNames.indexOf("SSticker"), tk = gi >= 0 ? live(vm.globals[gi]) : null;
			if (tk instanceof DMObject) tk.setVar("force_ending", 1);
			log(`[vm-boot] endround: SSticker.force_ending = 1 at world.time ${vm.sched.time}, ${secs()} s wall`);
		}
		if (scen && savedJobPrefs && scriptStart < 0) { // scenario: the script's tick 0 is the tick the player's mob left the lobby
			const c = vm.clients.list[0], mob = live(c.getVar("mob"));
			if (mob instanceof DMObject && !mob.type.path.includes("new_player")) {
				restoreJobPrefs(c, savedJobPrefs); savedJobPrefs = null;
				scriptStart = ticks + 1;
				const t = vm.map.outerTurf(mob as never);
				log(`[scenario] spawned as ${mob.type.path} at ${t ? `${t.x},${t.y},${t.z}` : "?"}, world.time ${vm.sched.time}, tick ${ticks}, ${secs()} s wall; script tick 0 = tick ${scriptStart}`);
			}
		}
		if (scen && scriptStart >= 0 && ticks - scriptStart >= scen.length! * TICKS_PER_SECOND) { log(`[scenario] ${scenarioName}: ${scen.length} s after the spawn (script tick ${ticks - scriptStart}) done at ${secs()} s wall; stopping`); break; }
		if (connectKey && !connected && (scen ? initDone : roundStart !== null)) {
			connected = true;
			if (scen) holdLobby(vm); // scenario: hold the lobby countdown until the player is Ready, then start the round at once
			log(`[vm-boot] connecting client ${connectKey} at ${secs()} s wall, world.time ${vm.sched.time}`);
			const c = vm.clients.connect(connectKey);
			const mob = c?.getVar("mob");
			log(`[vm-boot] client ${connectKey} ${c ? `connected, mob ${mob instanceof DMObject ? mob.type.path : "null"}` : "refused"} at ${secs()} s wall`);
			if (c && joinJob) joinTick = ticks + 20;
			else if (c) scriptStart = ticks + 1;
		}
		if (joinTick !== null && ticks >= joinTick) {
			const c = vm.clients.list[0];
			const prefs = live(c.getVar("prefs"));
			if (genderClickAt < 0 && wantGender && prefs instanceof DMObject && prefs.getVar("gender") !== wantGender) {
				genderClickAt = ticks;
				vm.clients.topic(c, "_src_=prefs;preference=gender");
				log(`[vm-boot] gender link clicked: now ${String(prefs.getVar("gender"))}`);
			}
			// the gender click's ShowChoices can sleep in CHECK_TICK (update_preview_icon); joining before it
			// finishes hard-deletes the new_player (mob/Destroy: QDEL_HINT_HARDDEL) and the resumed ShowChoices reads
			// user.key on null. Wait for client/Topic to clear `inprefs` (at most 200 ticks).
			if (genderClickAt >= 0 && isTruthy(c.getVar("inprefs")) && ticks < genderClickAt + 200) joinTick = ticks + 1;
			else {
				if (genderClickAt >= 0) log(`[vm-boot] gender topic finished after ${ticks - genderClickAt} ticks`);
				joinTick = null;
				const lobbyOut = clientOut.replace(/\.json$/, "") + "-lobby.json";
				if (scen) { // round-start join (the page's ?join=JOB&roundstart=1): Ready as the job; the script starts when the mob spawns on the station
					savedJobPrefs = readyAtRoundStart(vm, c, joinJob);
					log(`[vm-boot] ready as ${joinJob} (round start join) at ${secs()} s wall, world.time ${vm.sched.time}`);
					continue;
				}
				dumpClients(vm, lobbyOut);
				log(`[vm-boot] wrote lobby view to ${lobbyOut}; joining as ${joinJob} at ${secs()} s wall, world.time ${vm.sched.time}`);
				vm.clients.topic(c, `src=${refOf(c.getVar("mob"))};SelectedJob=${joinJob}`);
				const mob = live(c.getVar("mob"));
				log(`[vm-boot] after join: mob ${mob instanceof DMObject ? mob.type.path : "null"} at ${secs()} s wall`);
				if (scriptPlayer) scriptStart = ticks + 1;
			}
		}
	}
	if (afterStartLimit !== null && Date.now() >= afterStartLimit && !fatal)
		log(`[vm-boot] --after-start ${afterStartSeconds} s elapsed since round start at ${secs()} s wall; stopping`);
} catch (e) {
	if (stopAtHit && (e as Error).message === "stop-at matched") log(`[vm-boot] --stop-at matched at ${secs()} s wall; stopping`);
	else if ((e as Error).message === "wall-clock stop") log(`[vm-boot] wall-clock limit reached inside a tick at ${secs()} s wall; stopping`);
	else {
		fatal = e;
		log(`[vm-boot] FATAL: ${(e as Error).stack ?? e}`);
	}
}

if (diary) { if (diary.vcostStats.ticks > 0) log(`[vm-boot] vcost: ${JSON.stringify(diary.vcostStats)} (calls per percent ${diffHook.vcostPerPct})`); log(`[vm-boot] diary: fingerprints took ${(diary.fpMs / 1000).toFixed(1)} s of the run`); diary.close(); }
const summary: string[] = [];
summary.push(`[vm-boot] stopped after ${ticks} ticks, world.time ${vm.sched.time}, ${secs()} s wall, ${vm.runtimeErrors.length - vm.notImplemented.length} runtime errors, ${vm.notImplemented.length} not-implemented hits${fatal ? ", FATAL" : ""}`);
if (roundStart !== null) {
	const rs = roundStart as { ms: number; ticks: number; };
	const n = ticks - rs.ticks, sec = (Date.now() - rs.ms) / 1000;
	summary.push(`[vm-boot] after round start (at ${((rs.ms - t0) / 1000).toFixed(1)} s, tick ${rs.ticks}): ${n} ticks in ${sec.toFixed(1)} s = ${n > 0 ? ((sec * 1000) / n).toFixed(2) : "?"} ms/tick`);
}
// tg's own GC bookkeeping (code/controllers/subsystem/garbage.dm): soft deletes that were collected
// (totalgcs) vs ones still referenced after collection_timeout and hard-deleted (totaldels), by type.
{
	const gi = vm.tree.globalNames.indexOf("SSgarbage");
	const ss = gi >= 0 ? vm.globals[gi] : null;
	if (ss instanceof DMObject) {
		const n = (k: string) => ss.getVar(k);
		const len = (k: string) => { const l = ss.getVar(k); return l instanceof DMList ? l.len : "?"; };
		summary.push(`[vm-boot] SSgarbage: totalgcs ${n("totalgcs")}, totaldels ${n("totaldels")}, queue ${len("queue")}, tobequeued ${len("tobequeued")}`);
		const didnt = ss.getVar("didntgc");
		if (didnt instanceof DMList && didnt.len) {
			const rows = didnt.items.map((k) => [String(k), Number(didnt.get(k))] as const).sort((a, b) => b[1] - a[1]);
			summary.push(`[vm-boot] SSgarbage failed to GC (${rows.length} types): ${rows.slice(0, 15).map(([k, c]) => `${k} x${c}`).join(", ")}`);
		}
	}
	const g = vm.gcStats;
	summary.push(`[vm-boot] VM collector: ${g.freed} objects freed at ${g.safePoints} safe points, ${(g.ms / 1000).toFixed(1)} s; ${vm.map.atoms.size} atoms`);
	if (process.env.VM_GC_VERIFY) summary.push(`[vm-boot] reference count check: ${vm.gcVerify().join("; ") || "ok"}`);
	if (dkCounts.size) summary.push(`[pf1] call counts: ${[...dkCounts].sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${v}`).join(", ")}`);
	summary.push(`[vm-boot] heap at end ${Math.round(process.memoryUsage().heapUsed / 1048576)} MB`);
}
if (connectKey) {
	try {
		const d = dumpClients(vm, clientOut) as { clients: { ckey: string; mob: { type: string } | null; screenCount: number; imagesCount: number; outbox: { total: number; counts: Record<string, number> } }[] };
		for (const c of d.clients)
			summary.push(`[vm-boot] client ${c.ckey}: mob ${c.mob?.type ?? "null"}, screen ${c.screenCount}, images ${c.imagesCount}, ${c.outbox.total} messages ${JSON.stringify(c.outbox.counts)}; wrote ${clientOut}`);
		if (!d.clients.length) summary.push(`[vm-boot] no client connected (--connect ${connectKey}); wrote ${clientOut}`);
	} catch (e) {
		summary.push(`[vm-boot] client dump failed: ${(e as Error).stack ?? e}`);
	}
}
const firstSeen = new Map<string, { count: number; rec: RuntimeErrorRecord }>();
for (const r of vm.notImplemented) {
	const k = r.message;
	const e = firstSeen.get(k);
	if (e) e.count++;
	else firstSeen.set(k, { count: 1, rec: r });
}
summary.push(`[vm-boot] missing features, in the order first hit:`);
let i = 0;
for (const [k, { count, rec }] of firstSeen) summary.push(`  ${++i}. ${k}  x${count}  (first in ${rec.proc}, ${rec.source})`);
for (const s of summary) log(s);
if (scen && (scen.expect || scen.expectNot)) { // the scenario's own pass/fail: `expect: RE` needs a matching log line, `expect-not: RE` needs none
	const lines = scenLog.filter((l) => !l.startsWith("[scenario] expect"));
	const verdicts: string[] = [];
	for (const [list, want] of [[scen.expect ?? [], true], [scen.expectNot ?? [], false]] as const) {
		for (const src of list) {
			const re = new RegExp(src), found = lines.some((l) => re.test(l));
			const ok = found === want;
			if (!ok) process.exitCode = 1;
			verdicts.push(`[scenario] expect${want ? "" : "-not"} ${ok ? "ok" : "FAIL"} /${src}/`);
		}
	}
	for (const v of verdicts) { log(v); console.log(v); }
}
if (stressFile) { // write the per-tick lines, the profile of the run, the computeLos totals
	const sess = stressSession as Session | null;
	const prof = sess ? await new Promise<unknown>((res) => sess.post("Profiler.stop", (_e, r) => res(r.profile))) : null;
	if (prof) writeFileSync(stressFile + ".cpuprofile", JSON.stringify(prof));
	const tot = (m: Map<string, [number, number]>) => Object.fromEntries([...m].sort((a, b) => b[1][1] - a[1][1]));
	stressLines.push(JSON.stringify({ summary: true, perf0: stressPerf0, losAll: tot(stressAll), losSlow: tot(stressSlow) }));
	writeFileSync(stressFile, stressLines.join("\n") + "\n");
	log(`[stress] ${stressLines.length - 1} ticks logged to ${stressFile} (+ .cpuprofile); report: node tools/stress-report.mjs ${stressFile}`);
}
closeSync(fd);
// What the game wrote under data/ (its own logs: config_error.log, game.log, runtime.log...) goes to
// web/build/vm-boot-data/, to compare with web/reference/byond-data-logs/.
const dataOut = resolve(opt("--data-out", resolve(repoRoot, "web/build/vm-boot-data"))); // --data-out: own folder, so parallel boots don't clash
rmSync(dataOut, { recursive: true, force: true });
const dump = (dir: string): void => {
	for (const name of vm.vfs.list(dir)) {
		if (name.endsWith("/")) dump(dir + name);
		else {
			const target = resolve(dataOut, (dir + name).slice("data/".length));
			mkdirSync(dirname(target), { recursive: true });
			writeFileSync(target, vm.vfs.readText(dir + name) ?? "");
		}
	}
};
dump("data/");
{
	for (const s of summary.slice(0, 40)) console.log(s);
	if (fatal) console.log(`FATAL: ${(fatal as Error).message}`);
	console.log(`log: ${logFile}`);
}
