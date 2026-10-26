// boot-worker - Boots tgstation in the VM inside a browser Web Worker (the worker plays the server).
// The browser twin of src/tools/boot.ts: same VM setup and tick loop, but the compiled game, the VFS
// bundle and the icon-size table come over fetch, and everything it would log goes to the page as
// messages. The boundary is message-only (structured-clone data, no shared objects), so the page
// could later sit on the other side of a network instead.
//
// Page -> worker: { type: "start", ticks?, seconds?, afterStart?, join?, gender?, check?, dirty? }
//                   ticks/seconds/afterStart: boot.ts's flags. join: a job, e.g. "Assistant": at round
//                   start connect "LocalPlayer" and 20 ticks later join as that job, as gender (default "male";
//                   boot.ts's --connect LocalPlayer --join JOB --gender G), then post a view update after every tick.
//                 { type: "stop" }                                    (stop at the next tick)
//                 { type: "resync" }                                  make the next view update a full one
//                 { type: "click", id, x, y, dbl, control, params }   a mouse click: the view id of the object hit (ViewDiffer's
//                                                ids), the tile under the pointer, BYOND's params text; runs client/Click or DblClick next tick
//                 { type: "answer", id, value }   the answer to a { type: "dialog" } the worker posted (text, number, list index; null = Cancel)
//                 { type: "statpanel", name } / { type: "statclick", idx }   switch statpanel tab / click a stat line
//                 { type: "typing", on }       (sb1) the player started/stopped typing in a say channel (queues the hidden typing-indicator verb)
//                 { type: "command", text }    a line typed into the input box (verb + arguments)
//                 { type: "key", key, down }     a key press/release on the page, as a BYOND key name
//                                                ("NORTH", "W", "CTRL+B"); runs the client's macro (Clients.keyDown)
//                 { type: "step", dir }          (movement prediction) one step from a page that predicts movement (Clients.step)
// mp1 (multiplayer): the worker keeps one record per connected player (client, ViewDiffer, output batch). Every page -> worker input
//                 message below may carry `player` (a ckey, "localplayer" for the page's own); none = the first player, so the current page
//                 sends none. Every worker -> page message for one player (view, output, dialog, menu, stat, sound, browse, browse_rsc,
//                 rsc_png, popout, popwinset) carries `player` too; log/milestone/done/reboot/file are for everyone. All plain JSON except
//                 rsc_png.png (a Uint8Array) and runtime icons in a view update (blob: URLs made in the worker, valid only on its side of
//                 the wire: a network version has to send the .dmi bytes). Test aid: start.second = "KEY" (+ secondJob) adds a second client.
// Worker -> page: { type: "log", line }         one world.log / [vm-boot] line, as boot.ts writes them
//                 { type: "milestone", name, s } "loaded", "world-new", "round-start", "stopped" (s = wall seconds)
//                 { type: "view", update }       after each tick once joined: client-view.ts's ViewUpdate, the changes
//                                                since the last one (the first, and the one after a "resync", is full)
//                 { type: "viewcheck", view }    (start.check) every 2 s, right after an update: a full buildClientView
//                                                snapshot of the same tick, so the page can check its updates add up to it
//                 { type: "file", path, text }   each file tg wrote under data/ (game.log, runtime.log...), at the end
//                 { type: "done", summary }      the summary lines boot.ts prints
//                 { type: "reboot", reason, summary } tg called world.Reboot(): this world is over. Sent after the
//                                                last output lines, the data/ files and the savefile store's final save. The page
//                                                ends this worker and starts a new one (the next world), as a BYOND client reconnects.
// Round-restart start options: endround (seconds after the player spawns: SSticker.force_ending = 1, what the admin "End Round" verb
// does), rounddelay (seconds: config.round_end_countdown, tg's "Rebooting World in N seconds"; config.txt has 90), round
// (which world this is in the tab: 1, 2, ...; only for the log), autojoin (test aid: in the lobby, once the round has
// started, click the late-join link for this job), roundstart (with join: get the job at round start, as a Ready player
// does, so you spawn on the station instead of late-joining on the arrivals shuttle).
// Needs web/build/game-types.js, translated-tg.js (no tgstation.json any more), web/build/vfs-bundle.json and web/build/icon-sizes.json (npm run icon-sizes).
// After round start the ticks are paced to real time (world.tick_lag); before it they run flat out.
// Icons: Width()/Height() and icon_states() come from icon-sizes.json. Pixels (vm.loadIcon: GetPixel,
// and drawing runtime-built icons) come from PIXEL_FILES, fetched and decoded before boot, because the hook
// is synchronous and the browser only inflates asynchronously. A runtime icon in a view update is sent as
// a blob: URL of a real .dmi (png.ts encodeDmi), which the page loads like any other sheet.

import { VM, type AnimEvent, type RuntimeErrorRecord } from "../vm/interpreter.js";
import { DMList, DMObject } from "../vm/objects.js";
import { refOf, refTable } from "../vm/refs.js";
import { heap } from "../vm/gc.js";
import { loadSnapshot, resumeWorld } from "../vm/snapshot.js";
import { snapshotMapOk } from "../vm/persist-replay.js";
import { isTruthy, stringify, type Value } from "../vm/value.js";
import { live } from "../vm/objects.js";
import { ViewDiffer, buildClientView, zIconsMs } from "./client-view.js";
import { ScriptPlayer } from "./scenario-script.js";
import { makeTickAids } from "./tick-aids.js";
import { makeRunStats } from "./run-stats.js";
import { loadWorld } from "./load-world.js";
import { installInput, mouseSeen, onKey, onStep, onCommand, onTyping, onAnswer, onStat, onTopic, onWinclose, onClick, onMenu, onMenuPick, onMouse, onBugState, type Player, type ClickMsg, type MenuMsg, type MenuPickMsg, type MouseMsg } from "./input.js";
import { holdLobby, readyAtRoundStart, restoreJobPrefs } from "./test-aids.js";
import { parseDmiBytes } from "../dmi/dmi-browser.js";
import { decodePng, encodePng, pngIdat } from "../dmi/png.js";
import { type IconImage, iconFromSheet, recipePaths } from "../dmi/icon-ops.js";
import { stress, stressStart, stressLosLine } from "../vm/stress-log.js";
import { type Pace, paceStart, paceStep } from "./pace.js";
import { inputOk } from "./input-check.js";
import { waitUntil, type WaitMode } from "./tick-wait.js";

// The icon files whose pixels a boot + join reads (measured: tg's generate_female_clothing on the
// jumpsuit and the undershirt, update_icons.dm / species.dm). Anything else is a logged miss.
const PIXEL_FILES = ["icons/mob/uniform.dmi", "icons/mob/underwear.dmi"];
const inflate = async (z: Uint8Array) =>
	new Uint8Array(await new Response(new Blob([z as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate"))).arrayBuffer());
async function fetchPixels(path: string): Promise<IconImage | null> {
	const r = await fetch(new URL("/" + path, import.meta.url));
	if (!r.ok) return null;
	const bytes = new Uint8Array(await r.arrayBuffer());
	const [dmi, raw] = await Promise.all([parseDmiBytes(bytes), inflate(pngIdat(bytes))]);
	const png = decodePng(bytes, () => raw);
	return dmi && png ? iconFromSheet(dmi, png.rgba, png.width) : null;
}
const normPath = (path: string) => path.replace(/\\/g, "/").replace(/^\.\//, "");

// the pre-started world (vm/snapshot.ts), made by `npm run build:static` into dist only: web/build/world-snap.json
// ({ raw, gz }: sizes) next to web/build/world.snap.gz. Streamed and gunzipped (DecompressionStream; brotli isn't in
// Chrome's) straight into one buffer of the raw size. If the host already undid the gzip (Content-Encoding), the bytes
// are taken as they come. Returns why not, instead of throwing: any failure here means a normal boot.
export type SnapFetch = { bytes: Uint8Array; gz: number; ms: number } | { why: string };
// one snapshot per map. BoxStation (or no map) is world.snap.gz; another map is world-<short name>.snap.gz, "runtime" and
// "RuntimeStation" both world-runtime (the same rule as snapNames in tools/snapshot-key.mjs).
// ?snap=NAME: world-NAME.snap.gz instead, a snapshot tools/make-snapshot.mjs made (e.g. mid-round; pass its ?map= too).
function snapFiles(map?: string, snap?: string): { gz: string; meta: string } {
	if (snap) return { gz: `world-${snap}.snap.gz`, meta: `world-${snap}-snap.json` };
	const slug = (map || "").toLowerCase().replace(/station$/, "").replace(/[^a-z0-9]/g, "");
	const sfx = !slug || slug === "box" ? "" : "-" + slug;
	return { gz: `world${sfx}.snap.gz`, meta: `world${sfx}-snap.json` };
}
async function fetchSnapshot(stage: (text: string) => void, map?: string, snap?: string): Promise<SnapFetch> {
	const t0 = Date.now();
	const nm = snapFiles(map, snap);
	try {
		const mr = await fetch(buildUrl(nm.meta));
		if (!mr.ok) return { why: `no snapshot ${snap ? `"${snap}"` : `for ${map || "BoxStation"}`} in this build (${nm.meta}: HTTP ${mr.status})` };
		const meta = (await mr.json()) as { raw: number; gz: number };
		const r = await fetch(buildUrl(nm.gz));
		if (!r.ok || !r.body) return { why: `${nm.gz}: HTTP ${r.status}` };
		const src = r.body.getReader();
		const first = await src.read();
		if (first.done) return { why: `${nm.gz} is empty` };
		let got = first.value.length, lastShown = 0;
		const gzipped = first.value[0] === 0x1f && first.value[1] === 0x8b;
		// the fetched stream again, first chunk included, counting download progress for the loading screen
		const body = new ReadableStream<Uint8Array>({
			start(c) { c.enqueue(first.value); },
			async pull(c) {
				const x = await src.read();
				if (x.done) return c.close();
				got += x.value.length;
				if (got - lastShown > 4e6) { lastShown = got; stage(`Loading the station... ${Math.round(got / 1e6)} / ${Math.round(meta.gz / 1e6)} MB`); }
				c.enqueue(x.value);
			},
		});
		const out = new Uint8Array(meta.raw);
		let at = 0;
		const rd = (gzipped ? body.pipeThrough(new DecompressionStream("gzip") as unknown as ReadableWritablePair<Uint8Array, Uint8Array>) : body).getReader();
		for (;;) {
			const x = await rd.read();
			if (x.done) break;
			if (at + x.value.length > out.length) return { why: `${nm.gz} unpacks to more than the ${meta.raw} bytes ${nm.meta} says` };
			out.set(x.value, at);
			at += x.value.length;
		}
		if (at !== out.length) return { why: `${nm.gz} unpacked to ${at} bytes, ${nm.meta} says ${meta.raw}` };
		return { bytes: out, gz: got, ms: Date.now() - t0 };
	} catch (e) {
		return { why: `snapshot download failed: ${e}` };
	}
}

export interface StartMsg {
	type: "start";
	snapshot?: boolean;
	ticks?: number;
	seconds?: number;
	afterStart?: number | null;
	join?: string;
	gender?: string;
	check?: boolean;
	dirty?: boolean;
	lie?: boolean;
	goto?: string;
	seed?: number;
	lobby?: boolean;
	lobbySeconds?: number;
	map?: string;
	snap?: string;
	autojoin?: string;
	roundstart?: boolean;
	endround?: number;
	ssoff?: string;
	setup?: string;
	rounddelay?: number;
	round?: number;
	ride?: boolean;
	shoot?: boolean;
	shake?: boolean;
	crew?: boolean;
	tgui?: string;
	tguiWatch?: string;
	tguiSet?: string;
	busyWait?: boolean;
	hot?: boolean;
	translated?: boolean;
	fastAir?: boolean;
	scenario?: { name: string; text?: string; error?: string };
	stress?: boolean;
	playerKey?: string;
	playerAddress?: string;
	second?: string;
	secondJob?: string;
	clickNow?: boolean;
	log?: string;
}

const post = (m: unknown) => (self as unknown as Worker).postMessage(m);
// Log level: quiet = no per-input lines; normal; chatty = every "to client:" line and no length cuts on them.
// Set by the start message (?log=, server.mjs --log-level) and, from the server only, a {type:"loglevel"} message.
type LogLevel = "quiet" | "normal" | "chatty";
let logLevel: LogLevel = "normal";
const asLevel = (v: unknown): LogLevel | null => (v === "quiet" || v === "normal" || v === "chatty" ? v : null);
const cutAt = (n: number): number => (logLevel === "chatty" ? Infinity : n);
const inLog = (line: string): void => { if (logLevel !== "quiet") post({ type: "log", line }); }; // every per-input line goes through here
// web/build/dist/src/worker/boot-worker.js -> web/build/. On ss13.live the page starts this worker with ?b=BUILD (tools/site-pages.mjs), passed
// on here: Cloudflare's cache kept a big file (the saved world, translated-tg.js) at its old address for 4 h after a deploy, and the new
// build rejected the old build's world and did a full boot (F9 2026-10-23 18:50). A new address each build can't be stale.
const BUILD_ID = new URL(import.meta.url).searchParams.get("b");
const buildUrl = (name: string) => { const u = new URL(`../../../${name}`, import.meta.url); if (BUILD_ID) u.searchParams.set("b", BUILD_ID); return u; };
const fetchJson = async <T>(name: string): Promise<T> => {
	const r = await fetch(buildUrl(name));
	if (!r.ok) throw new Error(`${name}: HTTP ${r.status}`);
	return (await r.json()) as T;
};
// performance.memory is Chrome-only and non-standard; "?" elsewhere.
const heapMB = () => {
	const m = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
	return m ? String(Math.round(m.usedJSHeapSize / 1048576)) : "?";
};
/** Frees a big buffer now rather than at the next full GC, which Firefox puts off for long with a heap this size: the
 * ~205 MB unpacked snapshot was still there a minute into the round (memory work). loadSnapshot copies what it keeps. */
const freeBytes = (b: Uint8Array) => {
	try {
		(b.buffer as ArrayBuffer & { transfer?: (n: number) => ArrayBuffer }).transfer?.(0);
	} catch { /* already detached, or no ArrayBuffer.transfer (older browsers): the GC frees it later */ }
};
// One channel for good: a new MessageChannel's first message may wait on another thread, leaving the worker's queue empty
// for a moment, which starts Firefox's 5 s idle GC (tick-wait.ts). Suspected after the slow spawn tick (plans/less-garbage.md step 4).
const yieldPort = new MessageChannel();
let yieldWake: (() => void) | null = null;
yieldPort.port1.onmessage = () => { const w = yieldWake; yieldWake = null; w?.(); };
const yieldNow = () => new Promise<void>((r) => { yieldWake = r; yieldPort.port2.postMessage(0); });

let stopRequested = false;
const resyncRequested = new Set<string>(); // players asked for a full view ("" = the first player)
let lastMouseVars = "", mouseVarLogs = 0;
let freshAsk: { id: string; tgui?: string; tguiSet?: string; tguiWatch?: string } | null = null; // the host asked for a fresh --tgui machine (topic-check --again --fresh), with the scenario's amount, set and watch values as they are now; the tick loop does it
let onHot: ((m: HotMsg) => void) | null = null; // the host replaces game procs in the running world (tools/hot.mjs)
export interface HotMsg { type: "hot"; id: string; fresh?: boolean; tgui?: string; tguiSet?: string; tguiWatch?: string; files: { file: string; js: string; firstId: number; paths: string[] }[] }
const connectQ: { key: string; job: string; near?: boolean; address?: string }[] = [], disconnectQ: string[] = []; // multiplayer: {type:"connect", key, job?} / {type:"disconnect", key}: run by the tick loop
let inputAt: number | null = null; // when the oldest page input not yet run by a tick arrived (performance.now())
type InMsg =
	| StartMsg
	| HotMsg
	| { type: "stop" }
	| { type: "resync" }
	| { type: "key"; key: string; down: boolean }
	| { type: "step"; dir: number }
	| { type: "command"; text: string; speech?: string }
	| { type: "typing"; on: boolean }
	| { type: "answer"; id: number; value: string | number | null }
	| { type: "topic"; href: string }
	| { type: "winclose"; name: string }
	| { type: "statpanel"; name: string }
	| { type: "statclick"; idx: number }
	| ClickMsg
	| MouseMsg
	| MenuMsg
	| MenuPickMsg
	| { type: "bugstate" }
	| { type: "connect"; key: string; job?: string; near?: boolean; address?: string }
	| { type: "disconnect"; key: string }
	| { type: "loglevel"; level: string };
self.onmessage = (e: MessageEvent) => {
	const m = e.data as InMsg;
	// ps-security: only the host's own messages skip the shape check; a player's message that doesn't fit is dropped, and a handler
	// that throws must not take the whole worker (every player's round) down with it.
	const t = (m as { type?: unknown } | null)?.type;
	if (t !== "start" && t !== "stop" && t !== "connect" && t !== "disconnect" && t !== "hot" && t !== "loglevel" && !inputOk(m)) return;
	try { handleMessage(m); } catch (err) { post({ type: "log", line: `[vm-boot] input message ${String(t)} failed: ${String((err as Error).stack ?? err).slice(0, 600)}` }); }
};
function handleMessage(m: InMsg): void {
	const pl = (m as { player?: string }).player; // which player sent it (a ckey); none = the first
	if (inputAt === null && (m.type === "key" || m.type === "step" || m.type === "click" || m.type === "mouse" || m.type === "command")) inputAt = performance.now();
	if (m.type === "stop") stopRequested = true;
	else if (m.type === "loglevel") { const l = asLevel(m.level); if (l) { logLevel = l; post({ type: "log", line: `[vm-boot] log level now ${l}` }); } }
	else if (m.type === "resync") resyncRequested.add(((m as { player?: string }).player ?? "").toLowerCase());
	else if (m.type === "connect") connectQ.push({ key: m.key, job: m.job ?? "Assistant", near: m.near, address: m.address });
	else if (m.type === "disconnect") disconnectQ.push(m.key);
	else if (m.type === "key") onKey?.(m.key, m.down, pl);
	else if (m.type === "step") onStep?.(m.dir, pl);
	else if (m.type === "command") onCommand?.(m.text, m.speech, pl);
	else if (m.type === "typing") onTyping?.(m.on, pl);
	else if (m.type === "answer") onAnswer?.(m.id, m.value, pl);
	else if (m.type === "statpanel") onStat?.(m.name, -1, pl);
	else if (m.type === "statclick") onStat?.(null, m.idx, pl);
	else if (m.type === "topic") onTopic?.(m.href, pl);
	else if (m.type === "winclose") onWinclose?.(m.name, pl);
	else if (m.type === "click") onClick?.(m);
	else if (m.type === "menu") onMenu?.(m);
	else if (m.type === "menupick") onMenuPick?.(m);
	else if (m.type === "mouse") onMouse?.(m);
	else if (m.type === "bugstate") onBugState?.(pl);
	else if (m.type === "hot") { if (onHot) onHot(m); else post({ type: "hotResult", id: m.id, ok: false, lines: ["the world isn't up yet (or the server wasn't started with --hot)"] }); }
	else if (m.type === "start") void run(m).catch((err) => post({ type: "log", line: `[vm-boot] worker FATAL: ${(err as Error).stack ?? err}` }));
};

async function run(opts: StartMsg): Promise<void> {
	logLevel = asLevel(opts.log) ?? logLevel;
	if (opts.stress) stressStart(); // ?stress=1 logs computeLos calls by origin every 10 s
	const maxTicks = opts.ticks ?? 400;
	const afterStartSeconds = opts.afterStart ?? null;
	const maxSeconds = opts.seconds ?? (afterStartSeconds !== null ? 900 : 300);
	const t0 = Date.now();
	const busyWait = opts.busyWait ?? (typeof navigator !== "undefined" && /Firefox\//.test(navigator.userAgent)); // see tick-wait.ts
	const waitMode: WaitMode = busyWait ? "firefox" : (globalThis as { tgjsServer?: boolean }).tgjsServer ? "server" : "browser";
	const secs = () => ((Date.now() - t0) / 1000).toFixed(1);
	const log = (line: string) => post({ type: "log", line });
	const world = await loadWorld({ opts, log, secs, post, buildUrl, fetchJson, fetchPixels, fetchSnapshot, normPath, PIXEL_FILES, setOnHot: (f) => { onHot = f; }, setFreshAsk: (a) => { freshAsk = a; } });
	opts = world.opts;
	const { vm, tree, bundle, pixels, scenarioText, scenarioName, stage, snapNote, saveStore, startStore, fixIcons } = world;
	let scenarioPlayer: ScriptPlayer | null = null, scenarioStart = -1;
	const joinJob = opts.join ?? "";
	const playerKey = opts.playerKey ?? "LocalPlayer"; // multiplayer: the first player's key (tools/server.mjs passes the first connection's name)
	// ?roundstart=1 (with join): connect in the lobby, set that job to High (the only job), click Ready and start the
	// round at once. tg's DivideOccupations then gives the job and puts you on its station landmark.
	const roundstartJoin = !!joinJob && !!opts.roundstart;
	let savedJobPrefs: Record<string, Value> | null = null;
	const wantGender = opts.gender || "male";
	// without `join` the page is the real game: connect a player when init finishes and leave them in tg's lobby.
	// ?nolobby=1 (the boot checks) keeps the old client-less boot; ?lobby=SECONDS shortens the pregame countdown.
	const lobbyMode = !joinJob && opts.lobby !== false;
	if (opts.round && opts.round > 1) log(`[vm-boot] world ${opts.round} in this tab (the previous world called world.Reboot())`);
	let initDone = false, skinText: string | null = null;
	if (joinJob || lobbyMode) {
		const r = await fetch(new URL("/interface/skin.dmf", import.meta.url));
		if (!r.ok) throw new Error(`interface/skin.dmf: HTTP ${r.status}`);
		skinText = await r.text();
		vm.clients.setSkin(skinText);
	}

	const ROUND_START_RE = /^Game start took [\d.]+s$/;
	let afterStartLimit: number | null = null, lobbyPaced = false, spawned = false;
	let roundStart: { ms: number; ticks: number; } | null = null;
	let ticks = 0;
	// Real-time pacing (after round start, or from the lobby join): see pace.ts.
	const pace: Pace = { wall: 0, tick: 0 };
	let autojoined = false;
	let endRoundAt: number | null = null; // world.time to end the round at (-1: done)
	vm.worldLog = (s: string) => {
		log(s);
		if (/^Initializations complete/.test(s)) initDone = true;
		if (roundStart === null && ROUND_START_RE.test(s)) {
			roundStart = { ms: Date.now(), ticks };
			pace.wall = Date.now();
			pace.tick = vm.sched.tick;
			post({ type: "milestone", name: "round-start", s: Number(secs()) });
			if (opts.rounddelay != null) { // config.txt's ROUND_END_COUNTDOWN, for quick round-end checks
				const cfg = live(vm.globals[vm.tree.globalNames.indexOf("config")]);
				if (cfg instanceof DMObject) { cfg.setVar("round_end_countdown", opts.rounddelay); log(`[vm-boot] rounddelay: config.round_end_countdown = ${opts.rounddelay} (config.txt: 90)`); }
			}
			if (afterStartSeconds !== null) {
				afterStartLimit = Date.now() + afterStartSeconds * 1000;
				log(`[vm-boot] round start detected at ${secs()} s wall; stopping ${afterStartSeconds} s after this (--after-start)`);
			}
		}
	};
	vm.onRuntimeError = (e) =>
		log(`[vm-boot] ${e.message.startsWith("not implemented:") ? "VM gap" : "runtime"}: ${e.message} | ${e.proc} (${e.game ? `${e.game}, DM ` : ""}${e.source}) | ${e.callStack.slice(1, 6).join(" <- ")}`);
	const hardLimit = t0 + maxSeconds * 1000;
	const deadline = () => (afterStartLimit !== null ? Math.min(hardLimit, afterStartLimit) : hardLimit);

	// Per-10 s cost after round start: VM ms per tick against tick_lag, and snapshot building.
	// slowest tick, ticks over tick_lag, how late the worker woke from its sleep (a blocked thread: JS GC), and how
	// long page input (key/click/mouse messages) waited in the worker before the tick that runs it.
	const stats = makeRunStats({ vm, log, heapMB, secs, t0, get ticks() { return ticks; }, get roundStart() { return roundStart; }, get fatal() { return fatal; } });
	const { live_, lateWakes, liveLine } = stats;

	let fatal: unknown = null;
	try {
		let snapLoaded = false;
		const snapMapFile = (() => { // the snapshot's map file, from the _maps json of the map the snapshot was made for
			try { const mj = bundle.files[`_maps/${opts.map}station.json`] ?? bundle.files[`_maps/${opts.map}.json`] ?? bundle.files["_maps/boxstation.json"]; return (JSON.parse(String(mj)) as { map_file?: string }).map_file ?? "BoxStation.dmm"; } catch { return "BoxStation.dmm"; }
		})();
		if (world.snapP) {
			let snap: SnapFetch | null = await world.snapP;
			world.snapP = null;
			if (!("why" in snap) && !snapshotMapOk(world.storeFiles, snapMapFile)) snap = { why: `your saves pick another map for this round (data/next_map.json); the snapshot is ${opts.map || "Box Station"}` };
			if ("why" in snap) snapNote(snap.why);
			else {
				stage("Unpacking the station...");
				await yieldNow(); // let the page show it
				const rawMB = (snap.bytes.length / 1048576).toFixed(1), gzMB = (snap.gz / 1048576).toFixed(1), fetchS = (snap.ms / 1000).toFixed(1);
				try {
					const r = loadSnapshot(vm, snap.bytes);
					freeBytes(snap.bytes);
					snap = null;
					snapLoaded = true;
					const host = r.host as { log: string[]; ticks: number; wall: number };
					ticks = host.ticks;
					// the saved boot's log up to the lobby, so the combined log has every milestone. A mid-round snapshot's
					// "Game start took" line goes through worldLog, so the worker knows the round has started (late join, pacing).
					for (const l of host.log) if (ROUND_START_RE.test(l)) vm.worldLog(l); else log(l);
					initDone = true;
					const seed = opts.seed ?? Math.floor(Math.random() * 0x7fffffff);
					const reset = resumeWorld(vm, seed);
					if (skinText !== null) vm.clients.setSkin(skinText); // the saved world had no client, hence no skin
					log(`[vm-boot] snapshot loaded (${gzMB} MB gzip, ${rawMB} MB raw, fetched and unpacked in ${fetchS} s; ${r.objects} objects in ${(r.ms / 1000).toFixed(1)} s) at ${secs()} s wall (the saved boot took ${host.wall.toFixed(1)} s to get here); world.time ${vm.sched.time}, tick ${vm.sched.tick}, ${vm.sched.sleeping} sleeping threads; RNG seed ${seed}; reset ${reset.join(", ") || "nothing"}; heap ${heapMB()} MB`);
					post({ type: "milestone", name: "snapshot", s: Number(secs()) });
					startStore(true); // after the load: the snapshot replaced the file layer
					// Memory: free the load's garbage now, behind the loading screen. Without a GC here the first full GC came ~85 s in,
					// at a ~0.9 GB higher peak. It used to let Firefox's worker go idle once (its idle GC, see tick-wait.ts), but that GC
					// came 5 s later, just after a quick join's spawn: a ~0.9 s freeze (plans/less-garbage.md step 4). A big buffer that
					// is never touched (no memory used) puts the malloc heap over its limit, so SpiderMonkey runs one ~0.5 s GC at once.
					if (busyWait) try { new ArrayBuffer(512 * 1048576); } catch { /* no room: the GC comes later instead */ }
				} catch (e) {
					if (snap && !("why" in snap)) freeBytes(snap.bytes);
					snap = null;
					const msg = String((e as Error).message ?? e);
					// These are thrown before loadSnapshot touches the VM: a normal boot can carry on in this worker.
					if (/not a world snapshot|snapshot version|different build|unknown to this build/.test(msg)) snapNote(`the snapshot doesn't fit this build: ${msg}`);
					else { // half loaded: only a fresh worker can boot now. The page reloads itself with ?nosnap=1.
						const t = `[vm-boot] snapshot load failed part-way, reloading with ?nosnap=1: ${(e as Error).stack ?? e}`;
						log(t); console.warn(t);
						post({ type: "snapfail", error: msg });
						return;
					}
				}
			}
		}
		if (!snapLoaded) {
			startStore(false);
			log(`[vm-boot] global init + compiled maps + world/New at ${secs()} s${busyWait ? " (waits between ticks by busy-waiting: Firefox idle-GC workaround)" : ""}`);
			const thread = vm.boot();
			log(`[vm-boot] compile-time maps ${vm.mapReadMs < 0 ? "from the program's Maps" : `read from ${tree.json.MapFiles!.length} .dmm files in ${vm.mapReadMs.toFixed(0)} ms`}`);
			log(`[vm-boot] world/New ${thread?.done ? "returned" : "is sleeping"} at ${secs()} s, world.time ${vm.sched.time}`);
			post({ type: "milestone", name: "world-new", s: Number(secs()) });
		}
		let lastYield = Date.now();
				let joinAt = Infinity, joinTick: number | null = null, genderClickAt = -1, joined = false, connected = false, lastPos = "", lastState = "";
		// one record per connected player. Input names its player by ckey (none = the first); output is routed by the ckey the engine tags it with.
		const players: Player[] = [];
		const early = new Map<string, string[]>(); // text sent to a client while it connects, before its record exists
		const addPlayer = (key: string, client: DMObject): Player => {
			const differ = new ViewDiffer({ dirty: opts.dirty !== false }); // ?dirty=0: the old full scan every update
			differ.logView = (m) => log(m);
			differ.logAnim = (m) => log(`[vm-boot] anim ${m}`);
			const p: Player = { ckey: stringify(client.getVar("ckey")), key, client, differ, outLines: early.get(stringify(client.getVar("ckey"))) ?? [], joined: false, views: 0, outCount: 0 };
			players.push(p);
			return p;
		};
		const playerOf = (ck?: string): Player | undefined => (ck ? players.find((p) => p.ckey === ck.toLowerCase().replace(/[^a-z0-9@]/g, "")) : players[0]);
		const by = (ck?: string) => (ck ? ` by ${ck}` : ""); // the end of every per-input log line: whose input it was
		const lateJoin: { P: Player; job: string; near?: boolean; at: number }[] = [];
		let secondAt = -1, secondJoinTick = -1, secondP: Player | null = null, lastPlayersLog = Date.now(); // mp1 test aid (?second=KEY[&secondjob=JOB]): a second client
		const firstC = (): DMObject => players[0]?.client as DMObject; // the test aids below act on the first player
				const aids = makeTickAids({ opts, vm, log, post, firstC, players, get joinAt() { return joinAt; }, get ticks() { return ticks; }, get freshAsk() { return freshAsk; }, set freshAsk(v) { freshAsk = v; } });
		let lastCheck = 0;
		let idle = false; // netcode 1: between ticks (the VM is not running anything), so a click can run at once
		installInput({ opts, vm, log, post, inLog, cutAt, get logLevel() { return logLevel; }, players, early, playerOf, by, pixels, fetchPixels, normPath, fixIcons, resyncRequested, lateWakes, get joined() { return joined; }, get idle() { return idle; } });
		while (ticks < maxTicks && Date.now() < deadline() && !stopRequested) {
			const due = vm.nextDue();
			if (due === null) break;
			if (roundStart !== null || lobbyPaced) {
				// Wait until the due tick's wall time; more than CATCHUP_MAX_MS behind (a GC stall, a long tick) drops the
				// lost time instead of running the missed ticks back to back (pace.ts).
				const target = paceStep(pace, due, vm.sched.tickLag * 100);
				const wait = target - Date.now();
				if (wait > 0) { await waitUntil(target, waitMode); const late = Date.now() - target; if (roundStart !== null) { live_.lateMax = Math.max(live_.lateMax, late); if (late > 50) live_.late50++; if (late > 200) { lateWakes.push(`${late.toFixed(0)} ms at world.time ${vm.sched.time}`); if (lateWakes.length > 10) lateWakes.shift(); log(`[vm-boot] woke ${late.toFixed(0)} ms late at world.time ${vm.sched.time} (stalled between ticks, not in game code: usually a Firefox full GC of the worker)`); } } }
				if (paceStart(pace, Date.now())) live_.rebased++;
				lastYield = Date.now();
			}
			idle = false;
			const tt = performance.now();
			vm.sched.skipTicks(due - vm.sched.tick - 1);
			if (inputAt !== null) { const w = tt - inputAt; inputAt = null; live_.inN++; live_.inWait += w; live_.inMax = Math.max(live_.inMax, w); }
			if (joined) vm.clients.runInput(); else vm.clients.runAssetConfirms();
			if (scenarioPlayer && scenarioStart >= 0) { try { scenarioPlayer.step(ticks - scenarioStart); } catch (e) { log(`[scenario] ${scenarioName}: script stopped: ${(e as Error).message}`); scenarioPlayer = null; } }
			vm.runTick();
			ticks++;
			if (vm.rebootRequested) { // this world is over (after the loop: the page starts the next one)
				for (const p of players) if (p.outLines.length) { post({ type: "output", player: p.ckey, lines: p.outLines }); p.outLines = []; } // "Rebooting world..."
				log(`[vm-boot] world.Reboot(${JSON.stringify(vm.rebootRequested.reason)}) at world.time ${vm.rebootRequested.time}, ${secs()} s wall: this world is over, the page starts the next one`);
				break;
			}
			if (opts.ssoff && roundStart !== null) { // ?ssoff=air,machines (test aid): stop those subsystems once, at round start
				for (const n of opts.ssoff.split(",")) {
					const ss = live(vm.globals[vm.tree.globalNames.indexOf(`SS${n}`)]);
					if (ss instanceof DMObject) ss.setVar("can_fire", 0);
					log(`[vm-boot] ssoff: SS${n} ${ss instanceof DMObject ? "stopped" : "not found"} at world.time ${vm.sched.time}`);
				}
				opts.ssoff = undefined;
			}
			if (opts.endround != null && joinAt !== Infinity) { // ?endround=N, N seconds after spawning, through tg's own path
				if (endRoundAt === null) endRoundAt = vm.sched.time + opts.endround * 10;
				else if (endRoundAt >= 0 && vm.sched.time >= endRoundAt) {
					endRoundAt = -1;
					const tk = live(vm.globals[vm.tree.globalNames.indexOf("SSticker")]);
					if (tk instanceof DMObject) tk.setVar("force_ending", 1);
					log(`[vm-boot] endround: SSticker.force_ending = 1 (the admin "End Round" verb) at world.time ${vm.sched.time}, ${secs()} s wall`);
				}
			}
			if (roundStart !== null) {
				const ms = performance.now() - tt;
				live_.ticks++; live_.vmMs += ms; if (ms > live_.maxTick) live_.maxAt = vm.sched.time; live_.maxTick = Math.max(live_.maxTick, ms); live_.ms.push(ms);
				if (ms > vm.sched.tickLag * 100) { live_.slow++; if (ms > 200) log(`[vm-boot] long tick ${ms.toFixed(0)} ms at world.time ${vm.sched.time}, heap ${heapMB()} MB`); }
			}
			if (lobbyMode && !connected && initDone) { // the player arrives in the lobby; real time runs from here
				connected = true;
				vm.animLog = [];
				const c = vm.clients.connect(playerKey, { address: opts.playerAddress });
				log(`[vm-boot] client ${playerKey} ${c ? `connected, mob ${(c.getVar("mob") as DMObject | null)?.type?.path ?? "null"}` : "refused"} at ${secs()} s wall, world.time ${vm.sched.time} (lobby)`);
				if (c) {
					addPlayer(playerKey, c).joined = true;
					joined = true; lobbyPaced = true; pace.wall = Date.now(); pace.tick = vm.sched.tick;
					const gi = vm.tree.globalNames.indexOf("SSticker"), tk = gi >= 0 ? live(vm.globals[gi]) : null;
					if (tk instanceof DMObject && opts.lobbySeconds) { tk.setVar("start_at", vm.sched.time + opts.lobbySeconds * 10); if (tk.getVar("timeLeft") != null) tk.setVar("timeLeft", opts.lobbySeconds * 10); }
					post({ type: "milestone", name: "lobby", s: Number(secs()) });
				}
			}
			if (opts.autojoin && lobbyMode && connected && !spawned && !autojoined && roundStart !== null && ticks >= (roundStart as { ticks: number }).ticks + 20) {
				// Test aid: ?autojoin=JOB clicks the lobby's late-join link for JOB (the Topic the "Join Game!" window's job link sends)
				autojoined = true;
				const c = firstC();
				if (c) { vm.clients.topic(c, `src=${refOf(c.getVar("mob"))};SelectedJob=${opts.autojoin}`); log(`[vm-boot] autojoin: late-join link for ${opts.autojoin} clicked at world.time ${vm.sched.time}`); }
			}
			if (joinJob && !connected && (roundstartJoin ? initDone : roundStart !== null)) {
				connected = true;
				if (roundstartJoin) holdLobby(vm); // hold the lobby countdown until the player is Ready
				vm.animLog = []; // record animate()/flick() from now on (the view differ drains it)
				const c = vm.clients.connect(playerKey, { address: opts.playerAddress });
				log(`[vm-boot] client ${playerKey} ${c ? `connected, mob ${(c.getVar("mob") as DMObject | null)?.type?.path ?? "null"}` : "refused"} at ${secs()} s wall, world.time ${vm.sched.time}`);
				if (c) { addPlayer(playerKey, c); joinTick = ticks + 20; }
			}
			if (joinTick !== null && ticks >= joinTick) {
				const c = firstC();
				const prefs = live(c.getVar("prefs"));
				if (genderClickAt < 0 && prefs instanceof DMObject && prefs.getVar("gender") !== wantGender) {
					genderClickAt = ticks;
					vm.clients.topic(c, "_src_=prefs;preference=gender");
					log(`[vm-boot] gender link clicked: now ${String(prefs.getVar("gender"))}`);
				}
				// the gender click's ShowChoices can sleep in CHECK_TICK (update_preview_icon). Joining
				// before it finishes hard-deletes the new_player (mob/Destroy: QDEL_HINT_HARDDEL), so the resumed
				// ShowChoices reads user.key on null. Wait for client/Topic to clear `inprefs` (at most 200 ticks).
				if (genderClickAt >= 0 && isTruthy(c.getVar("inprefs")) && ticks < genderClickAt + 200) joinTick = ticks + 1;
				else {
					if (genderClickAt >= 0) log(`[vm-boot] gender topic finished after ${ticks - genderClickAt} ticks`);
					joinTick = null;
					if (roundstartJoin && prefs instanceof DMObject) {
						savedJobPrefs = readyAtRoundStart(vm, c, joinJob); // the saved choices come back once you've spawned
						log(`[vm-boot] ready as ${joinJob} (round start join) at ${secs()} s wall, world.time ${vm.sched.time}`);
					} else {
						joinAt = ticks;
						vm.clients.topic(c, `src=${refOf(c.getVar("mob"))};SelectedJob=${joinJob}`);
						const mob = live(c.getVar("mob"));
						log(`[vm-boot] joined as ${joinJob}: mob ${mob instanceof DMObject ? mob.type.path : "null"} gender ${mob instanceof DMObject ? String(mob.getVar("gender")) : "?"} at ${secs()} s wall, world.time ${vm.sched.time}`);
						post({ type: "milestone", name: "joined", s: Number(secs()) });
					}
					joined = true; players[0]!.joined = true;
				}
			}
			// Multiplayer: players that connect and leave while the round runs (tools/server.mjs sends connect / disconnect per WebSocket)
			while (disconnectQ.length) {
				const ck = disconnectQ.shift()!.toLowerCase().replace(/[^a-z0-9@]/g, ""), P = players.find((x) => x.ckey === ck);
				if (P) { players.splice(players.indexOf(P), 1); vm.clients.drop(P.client); log(`[vm-boot] client ${P.key} disconnected (mob stays), ${players.length} players left`); }
			}
			if (connected && joined) while (connectQ.length) {
				const { key, job, near, address } = connectQ.shift()!, ck = key.toLowerCase().replace(/[^a-z0-9@]/g, "");
				if (players.some((x) => x.ckey === ck)) { log(`[vm-boot] client ${key} refused: already connected`); continue; }
				const c2 = vm.clients.connect(key, { address });
				log(`[vm-boot] client ${key} ${c2 ? `connected, mob ${(c2.getVar("mob") as DMObject | null)?.type?.path ?? "null"}` : "refused"} at ${secs()} s wall, world.time ${vm.sched.time}`);
				// no job (server --lobby): stays in the lobby; a player back in their old body (client/New finds the mob with their key) doesn't join again
				if (c2) { const P = addPlayer(key, c2), m = live(c2.getVar("mob")); P.joined = true; if (job && m instanceof DMObject && m.type.path === "/mob/dead/new_player") lateJoin.push({ P, job, near, at: ticks + 20 }); }
			}
			for (let i = lateJoin.length - 1; i >= 0; i--) { // the late-join link of tg's Join Game window, once the round runs
				const { P, job, near, at } = lateJoin[i]!;
				if (roundStart === null || ticks < at) continue;
				lateJoin.splice(i, 1);
				if (!players.includes(P)) continue;
				vm.clients.topic(P.client, `src=${refOf(P.client.getVar("mob"))};SelectedJob=${job}`);
				const mob = live(P.client.getVar("mob"));
				if (near && mob instanceof DMObject && players[0] && players[0] !== P) { // test aid (server --spawn-near): put the new mob on the first player's tile
					const fm = mob.type.procs.get("forceMove"), tl = live(vm.getField(live(players[0].client.getVar("mob")) as DMObject, "loc"));
					if (fm && tl) vm.call(fm, [tl], mob, mob);
				}
				log(`[vm-boot] client ${P.key} late-joined as ${job}: mob ${mob instanceof DMObject ? mob.type.path : "null"} at ${secs()} s wall, world.time ${vm.sched.time}`);
			}
			if (opts.second) { // mp1 test aid: ?second=KEY connects a second client 60 ticks after the first one joined, which late-joins as ?secondjob (default Assistant) 20 ticks later
				if (joined && secondAt < 0) secondAt = ticks + 60;
				if (secondAt >= 0 && !secondP && ticks >= secondAt) {
					const c2 = vm.clients.connect(opts.second);
					log(`[vm-boot] second client ${opts.second} ${c2 ? `connected, mob ${(c2.getVar("mob") as DMObject | null)?.type?.path ?? "null"}` : "refused"} at ${secs()} s wall, world.time ${vm.sched.time}`);
					if (c2) { secondP = addPlayer(opts.second, c2); secondP.joined = true; secondJoinTick = ticks + 20; } else secondAt = Infinity;
				}
				if (secondP && secondJoinTick >= 0 && ticks >= secondJoinTick) {
					secondJoinTick = -1;
					const c2 = secondP.client, job = opts.secondJob ?? "Assistant";
					vm.clients.topic(c2, `src=${refOf(c2.getVar("mob"))};SelectedJob=${job}`);
					const mob2 = live(c2.getVar("mob"));
					log(`[vm-boot] second client ${opts.second} late-joined as ${job}: mob ${mob2 instanceof DMObject ? mob2.type.path : "null"} at ${secs()} s wall, world.time ${vm.sched.time}`);
				}
				if (Date.now() - lastPlayersLog >= 5000) {
					lastPlayersLog = Date.now();
					log(`[vm-boot] players: ${players.map((p) => `${p.ckey} mob ${(live(p.client.getVar("mob")) as DMObject | null)?.type?.path ?? "null"} views ${p.views} output ${p.outCount}`).join(" | ")}`);
				}
			}
			if (joined && players.length && Object.keys(mouseSeen).length) { // what tg's client/MouseMove and MouseDrag stored (autoclick.dm), the first few changes
				const cl = firstC(), mo = live(cl?.getVar("mouseObject")), ml = live(cl?.getVar("mouseLocation"));
				const ms = `mouseParams ${stringify(cl?.getVar("mouseParams"))} mouseObject ${mo instanceof DMObject ? mo.type.path : "-"} mouseLocation ${ml instanceof DMObject ? ml.type.path : "-"}`;
				if (ms !== lastMouseVars && mouseVarLogs++ < 8) log(`[vm-boot] client ${(lastMouseVars = ms)}, world.time ${vm.sched.time}`);
			}
			if (joined) {
				// Where the player is, whenever it changes (the walking check reads these lines).
				const mob = live(firstC()?.getVar("mob"));
				if ((lobbyMode || roundstartJoin) && !spawned && mob instanceof DMObject && !mob.type.path.includes("new_player")) {
					spawned = true; joinAt = ticks; post({ type: "milestone", name: "joined", s: Number(secs()) }); log(`[vm-boot] spawned: mob ${mob.type.path} at ${secs()} s wall, world.time ${vm.sched.time}`);
					if (savedJobPrefs) { restoreJobPrefs(firstC(), savedJobPrefs); savedJobPrefs = null; }
					if (scenarioText) { scenarioPlayer = new ScriptPlayer(vm, scenarioText, log, scenarioName); scenarioStart = ticks + 1; log(`[scenario] ${scenarioName}: spawned as ${mob.type.path}, world.time ${vm.sched.time}, tick ${ticks}; script tick 0 = tick ${scenarioStart}`); }
				}
				if (mob instanceof DMObject) {
					const pos = `${vm.getField(mob, "x")},${vm.getField(mob, "y")},${vm.getField(mob, "z")} dir ${vm.getField(mob, "dir")}${live(vm.getField(mob, "buckled")) ? " buckled" : ""}`;
					if (pos !== lastPos) log(`[vm-boot] player at ${(lastPos = pos)}, world.time ${vm.sched.time}`);
					// intent and active hand, where a HUD click shows up.
					const st = `a_intent ${String(vm.getField(mob, "a_intent"))}, active hand ${String(vm.getField(mob, "active_hand_index"))}${(() => { const h = live(mob.getVar("held_items")); return h instanceof DMList ? `, hands [${h.items.map((i) => { const o = live(i); return o instanceof DMObject ? stringify(o.getVar("name")) : "-"; }).join(", ")}]` : ""; })()}`;
					if (st !== lastState) log(`[vm-boot] player state ${(lastState = st)}, world.time ${vm.sched.time}`);
				}
			}
			if (joined) {
				// the view's changes since the last tick (a full view first, and after a page resync).
				aids.step(); // the per-tick test aids (tick-aids.ts)
				const evs = vm.animLog ? vm.animLog.slice() : null; // each player's differ drains the animation log: give each the same events
				for (const P of players) {
				if (!P.joined) continue;
				const ts = performance.now(); // per player: the live line's "view updates at X ms each" is one player's view
				if (evs) { vm.animLog!.length = 0; for (const e of evs) if (!P.animSeen?.has(e)) vm.animLog!.push(e); }
				P.animSeen = undefined;
				const differ = P.differ, isFirst = P === players[0];
				const rs = resyncRequested.has(P.ckey) || (isFirst && resyncRequested.has(""));
				const update = differ.update(vm, rs, P.client);
				if (update.full && update.seq > 1) log(`[vm-boot] full view resent (page resync) at world.time ${vm.sched.time}`);
				resyncRequested.delete(P.ckey); if (isFirst) resyncRequested.delete("");
				const first = update.seq === 1;
				const rtUses = first && vm.runtimeIcons.size ? [...JSON.stringify(update.apps).matchAll(/"icon":"([^"]+)"/g)].map((m) => m[1]).filter((i) => vm.runtimeIcons.has(i)) : [];
				if (vm.runtimeIcons.size) fixIcons(update.apps as unknown as Record<string, unknown>);
				const tb = performance.now();
				if (P.outLines.length) { post({ type: "output", player: P.ckey, lines: P.outLines }); P.outLines = []; }
				post({ type: "view", player: P.ckey, update });
				P.views++;
				const tp = performance.now();
				live_.snaps++;
				live_.snapMs += tp - ts;
				live_.buildMs += tb - ts;
				live_.postMs += tp - tb;
				if (live_.snaps % 20 === 1) live_.bytes += JSON.stringify(update).length * 20; // measurement only: 1 update in 20, scaled (the average stays meaningful)
				if (opts.check && tp - lastCheck >= 2000) {
					lastCheck = tp;
					const view = buildClientView(vm);
					if (vm.runtimeIcons.size) fixIcons(view as unknown as Record<string, unknown>);
					post({ type: "viewcheck", view });
				}
				if (first)
					log(`[vm-boot] first view update (full, ${update.apps.length} appearances, ${update.tiles.length} tiles): ${rtUses.length} runtime-built icon uses${update.icons ? `; ${update.icons.length} icon sheets on the z level listed for preload in ${zIconsMs} ms` : ""}${rtUses.length ? ` (${[...new Set(rtUses)].join(", ")}; sent as blob: .dmi URLs)` : ""}`);
				}
			}
			if (roundStart !== null && Date.now() - live_.since >= 10000) liveLine();
			idle = true; // until the next tick starts: the awaits below and in the pacing wait are where page input arrives
			if (Date.now() - lastYield > 100) {
				await yieldNow();
				lastYield = Date.now();
			}
		}
		if (afterStartLimit !== null && Date.now() >= afterStartLimit)
			log(`[vm-boot] --after-start ${afterStartSeconds} s elapsed since round start at ${secs()} s wall; stopping`);
	} catch (e) {
		fatal = e;
		log(`[vm-boot] FATAL: ${(e as Error).stack ?? e}`);
	}
	post({ type: "milestone", name: "stopped", s: Number(secs()) });
	if (roundStart !== null) liveLine();

	const summary = stats.summary();
	for (const s of summary) log(s);

	const sendFiles = (dir: string): void => {
		for (const name of vm.vfs.list(dir)) {
			if (name.endsWith("/")) sendFiles(dir + name);
			else post({ type: "file", path: dir + name, text: vm.vfs.readText(dir + name) ?? "" });
		}
	};
	sendFiles("data/");
	if (vm.rebootRequested && !fatal) { // the round-end saves (Ian, Poly, satchels...) must be in IndexedDB before the next world reads them
		const t = Date.now();
		await saveStore();
		log(`[vm-boot] savefile store saved for the next world in ${Date.now() - t} ms`);
		post({ type: "reboot", reason: vm.rebootRequested.reason, summary });
	} else post({ type: "done", summary });
}
