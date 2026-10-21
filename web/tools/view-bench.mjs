// view-bench - Times the per-tick view update (ViewDiffer.update) on the lobby snapshot, as a mob and as an aghost, normal view and zoomed out.
// Usage (from web/, after npm run build): node --max-old-space-size=6000 tools/view-bench.mjs [SNAP=build/snapshot-cache/world.snap.gz]
//        [--ticks N=200] [--prof-ticks N=60] [--views "normal,325x257"] [--marks off|on|ab] [--dirty 1|0] [--job Assistant]
// Loads the snapshot (as snap-load.mjs), connects LocalPlayer, readies them as JOB and starts the round (src/worker/test-aids.ts, the
// boot-worker's own aids), lets the round run 100 ticks, then for each view, first as the mob and then after Aghost: a full update,
// N ticks each followed by a timed update, then --prof-ticks more under the CPU profiler, which splits the update time into LOS
// (clientSight), seenOn, refreshSig, buildAppearance and the rest. "normal" is the client's view at join.
// --dirty 0: the old full-scan differ (default 1: the differ turns marks on itself and visits only marked tiles; --marks then does nothing).
// --marks (view-dirty): on sets vm.viewMarks to a Set while ticking (cleared after each update), ab alternates off/on per tick and
// prints the tick ms of each; does nothing until the VM has viewMarks. Node's numbers aren't the page's: compare runs of this bench only.
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { pathToFileURL, fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { Session } from "node:inspector/promises";
const argv = process.argv.slice(2);
const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const snapFile = resolve(argv.find((a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1].startsWith("--"))) ?? web + "/build/snapshot-cache/world.snap.gz");
const N = Number(opt("--ticks", "200")), NP = Number(opt("--prof-ticks", "60")), views = opt("--views", "normal,325x257").split(","), marks = opt("--marks", "off"), job = opt("--job", "Assistant"), dirtyOn = opt("--dirty", "1") !== "0";

const S = pathToFileURL(web + "/build/dist/src/").href;
const { VM } = await import(S + "vm/interpreter.js");
const { ObjectTree } = await import(S + "vm/objtree.js");
const { gameProgram } = await import(S + "vm/typedefs.js");
const { Vfs } = await import(S + "vfs/vfs.js");
const { iconLoader, iconStatesReader } = await import(S + "dmi/dmi-node.js");
const { iconSizeReader } = await import(S + "tools/dmi-size.js");
const { loadSnapshot, resumeWorld } = await import(S + "vm/snapshot.js");
const { ViewDiffer } = await import(S + "worker/client-view.js");
const { DMObject, live } = await import(S + "vm/objects.js");
const aids = await import(S + "worker/test-aids.js");
const root = resolve(web, "..");
await import(pathToFileURL(web + "/build/game-types.js").href);
const vm = new VM(new ObjectTree(gameProgram()));
const bundle = JSON.parse(readFileSync(web + "/build/vfs-bundle.json", "utf8"));
const cfg = bundle.files["config/config.txt"];
if (cfg) bundle.files["config/config.txt"] = cfg.replace(/^GUEST_BAN/m, "#GUEST_BAN");
vm.vfs = new Vfs(bundle);
vm.lenient = true; vm.debugInfo = true;
vm.iconSize = iconSizeReader([root]); vm.loadIcon = iconLoader([root]); vm.iconStates = iconStatesReader([root]);
await import(pathToFileURL(web + "/build/translated-tg.js").href);
(await import(S + "translate/runtime.js")).install(vm);
const runtimes = [];
vm.onRuntimeError = (e) => { if (runtimes.length < 5) runtimes.push(`${e.message} | ${e.proc}`); };
const t0 = performance.now();
const r = loadSnapshot(vm, gunzipSync(readFileSync(snapFile)));
resumeWorld(vm, 1);
vm.clients.setSkin(readFileSync(root + "/interface/skin.dmf", "utf8"));
console.log(`snapshot ${snapFile}: ${r.objects} objects, loaded in ${((performance.now() - t0) / 1000).toFixed(1)} s`);

const hasMarks = "viewMarks" in vm;
let tickN = 0;
/** One game tick (input, then the tick); returns its ms. */
const step = () => {
	const due = vm.nextDue();
	vm.sched.skipTicks(due - vm.sched.tick - 1);
	if (!dirtyOn && hasMarks && marks !== "off") vm.viewMarks = marks === "on" || tickN % 2 ? (vm.viewMarks ?? new Set()) : null;
	const t = performance.now();
	vm.clients.runInput();
	vm.runTick();
	tickN++;
	return performance.now() - t;
};
const mobOf = (c) => { const m = live(c.getVar("mob")); return m instanceof DMObject ? m : null; };

// Lobby -> round start, as the page's ?join=JOB&roundstart=1.
aids.holdLobby(vm);
vm.animLog = [];
const c = vm.clients.connect("LocalPlayer");
if (!c) throw new Error("LocalPlayer refused");
for (let i = 0; i < 20; i++) step();
const saved = aids.readyAtRoundStart(vm, c, job);
let spawnTicks = 0;
while (mobOf(c)?.type.path.includes("new_player") && spawnTicks < 3000) { step(); spawnTicks++; }
if (saved) aids.restoreJobPrefs(c, saved);
const mob0 = mobOf(c);
if (!mob0 || mob0.type.path.includes("new_player")) throw new Error(`not spawned after ${spawnTicks} ticks`);
for (let i = 0; i < 100; i++) step();
const normal = live(c.getVar("view"));
console.log(`spawned as ${mob0.type.path} at ${vm.getField(mob0, "x")},${vm.getField(mob0, "y")},${vm.getField(mob0, "z")} after ${spawnTicks} ticks; view ${normal}; world.time ${vm.sched.time}${hasMarks ? `; marks ${marks}` : ""}`);

// CPU profile -> ms per category inside ViewDiffer.update (innermost category on the stack wins).
const CATS = { clientSight: "los", computeLos: "los", losBox: "los", cropLosBox: "los", seenOn: "seenOn", refreshSig: "refreshSig", buildAppearance: "buildAppearance" };
function split(profile) {
	const byId = new Map(profile.nodes.map((n) => [n.id, n])), parent = new Map();
	for (const n of profile.nodes) for (const k of n.children ?? []) parent.set(k, n.id);
	const isUpdate = (n) => n.callFrame.functionName === "update" && n.callFrame.url.endsWith("client-view.js");
	const memo = new Map(); // node id -> category or null (not in update)
	const catOf = (id) => {
		if (memo.has(id)) return memo.get(id);
		let cat = null, inUpdate = false;
		for (let at = id; at !== undefined; at = parent.get(at)) {
			const n = byId.get(at);
			if (!cat && CATS[n.callFrame.functionName] && /client-view|view-los|world\.js|appearance/.test(n.callFrame.url)) cat = CATS[n.callFrame.functionName];
			if (isUpdate(n)) { inUpdate = true; break; }
		}
		const r = inUpdate ? cat ?? "rest" : null;
		memo.set(id, r);
		return r;
	};
	const ms = { los: 0, seenOn: 0, refreshSig: 0, buildAppearance: 0, rest: 0 };
	for (let i = 0; i < profile.samples.length; i++) { const k = catOf(profile.samples[i]); if (k) ms[k] += profile.timeDeltas[i] / 1000; }
	return ms;
}

const med = (a) => [...a].sort((x, y) => x - y)[a.length >> 1];
const avg = (a) => a.reduce((s, x) => s + x, 0) / (a.length || 1);
const rows = [];
async function bench(who, view) {
	c.setVar("view", view === "normal" ? normal : view);
	const d = new ViewDiffer({ dirty: dirtyOn });
	let t = performance.now();
	const f = d.update(vm, true);
	const fullMs = performance.now() - t;
	const ups = [], ticksMs = [], ticksOn = [], ticksOff = [];
	let tiles = 0, apps = 0;
	for (let i = 0; i < N; i++) {
		const tm = step();
		ticksMs.push(tm);
		(hasMarks && marks === "ab" && tickN % 2 === 0 ? ticksOn : ticksOff).push(tm);
		t = performance.now();
		const u = d.update(vm);
		ups.push(performance.now() - t);
		tiles += u.tiles.length; apps += u.apps.length;
		if (vm.viewMarks) vm.viewMarks.clear();
	}
	const ses = new Session(); ses.connect();
	await ses.post("Profiler.enable"); await ses.post("Profiler.setSamplingInterval", { interval: 100 }); await ses.post("Profiler.start");
	for (let i = 0; i < NP; i++) { step(); d.update(vm); if (vm.viewMarks) vm.viewMarks.clear(); }
	const { profile } = await ses.post("Profiler.stop"); ses.disconnect();
	const sp = split(profile), spT = Object.values(sp).reduce((s, x) => s + x, 0) || 1;
	const row = { who, view: String(view === "normal" ? normal : view), boxTiles: f.tiles.length, fullMs: +fullMs.toFixed(1), updMed: +med(ups).toFixed(2), updAvg: +avg(ups).toFixed(2), tickAvg: +avg(ticksMs).toFixed(2), tilesPerUpd: +(tiles / N).toFixed(1), appsPerUpd: +(apps / N).toFixed(1),
		split: Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Math.round((100 * v) / spT) + "%"])) };
	if (marks === "ab" && hasMarks) Object.assign(row, { tickMarksOff: +avg(ticksOff).toFixed(2), tickMarksOn: +avg(ticksOn).toFixed(2) });
	rows.push(row);
	console.log(JSON.stringify(row));
}

for (const v of views) await bench("mob", v);
if (!aids.aghost(vm, c)) throw new Error(`aghost failed: mob is ${mobOf(c)?.type.path}`);
for (let i = 0; i < 20; i++) step();
for (const v of views) await bench("aghost", v);
console.log(`\n${"who".padEnd(7)} ${"view".padEnd(8)} ${"tiles".padStart(6)} ${"full ms".padStart(8)} ${"upd med".padStart(8)} ${"upd avg".padStart(8)} ${"tick avg".padStart(8)}  split (los / seenOn / refreshSig / buildAppearance / rest)`);
for (const r of rows) console.log(`${r.who.padEnd(7)} ${r.view.padEnd(8)} ${String(r.boxTiles).padStart(6)} ${String(r.fullMs).padStart(8)} ${String(r.updMed).padStart(8)} ${String(r.updAvg).padStart(8)} ${String(r.tickAvg).padStart(8)}  ${Object.values(r.split).join(" / ")}${r.tickMarksOn !== undefined ? `  marks off/on ${r.tickMarksOff}/${r.tickMarksOn} ms/tick` : ""}`);
if (runtimes.length) console.log(`runtimes (first ${runtimes.length}): ${runtimes.join("; ")}`);
