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
//                 rsc_png.png (a Uint8Array, null when the render failed) and runtime icons in a view update (blob: URLs made in the worker, valid only on its side of
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

import { DMObject } from "../vm/objects.js";
import { live } from "../vm/objects.js";
import { ScriptPlayer } from "./scenario-script.js";
import { makeTickAids } from "./tick-aids.js";
import { makeRunStats } from "./run-stats.js";
import { startWorld, stopWorld, type WorldStartCtx } from "./world-start.js";
import { makeJoins } from "./run-joins.js";
import { sendViews, type ViewsCtx } from "./run-views.js";
import { loadWorld } from "./load-world.js";
import { installInput, onKey, onStep, onCommand, onTyping, onAnswer, onStat, onTopic, onWinclose, onClick, onMenu, onMenuPick, onMouse, onBugState } from "./input.js";
import type { StartMsg, HotMsg, SnapFetch, ClickMsg, MenuMsg, MenuPickMsg, MouseMsg } from "./messages.js";
import { Joins, ckeyOf } from "./joins.js";
import { parseDmiBytes } from "../dmi/dmi-browser.js";
import { decodePng, pngIdat } from "../dmi/png.js";
import { type IconImage, iconFromSheet } from "../dmi/icon-ops.js";
import { stressStart } from "../vm/stress-log.js";
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
// Chrome's) straight into one buffer of the raw size. ss13.live also has world.snap.zst (23 MB instead of 37 for Box), sent with
// Content-Encoding: zstd (site/worker.js), so the browser unpacks it on arrival: asked for first, and taken only if the reply says
// zstd. Otherwise it's dropped unread: no such file (local servers), or a browser without zstd, which Cloudflare sends the whole
// 195 MB unpacked. Any other bytes the browser already unpacked are taken as they come. Returns why not, instead of throwing: any
// failure here means a normal boot. how: "zstd", "gzip" or the Content-Encoding the browser undid; gz: the bytes downloaded.
// noZstd: the .zst came without its zstd label (a browser without zstd, e.g. Safari 18) and there's no .gz (ss13-deploy keeps the gzip
// only for the newest live builds): the page tells the player why the start is slow.
// one snapshot per map. BoxStation (or no map) is world.snap.gz; another map is world-<short name>.snap.gz, "runtime" and
// "RuntimeStation" both world-runtime (the same rule as snapNames in tools/snapshot-key.mjs).
// ?snap=NAME: world-NAME.snap.gz instead, a snapshot tools/make-snapshot.mjs made (e.g. mid-round; pass its ?map= too).
function snapFiles(map?: string, snap?: string): { gz: string; zst: string; meta: string } {
	if (snap) return { gz: `world-${snap}.snap.gz`, zst: `world-${snap}.snap.zst`, meta: `world-${snap}-snap.json` };
	const slug = (map || "").toLowerCase().replace(/station$/, "").replace(/[^a-z0-9]/g, "");
	const sfx = !slug || slug === "box" ? "" : "-" + slug;
	return { gz: `world${sfx}.snap.gz`, zst: `world${sfx}.snap.zst`, meta: `world${sfx}-snap.json` };
}
async function fetchSnapshot(stage: (text: string) => void, map?: string, snap?: string): Promise<SnapFetch> {
	const t0 = Date.now();
	const nm = snapFiles(map, snap);
	try {
		const mr = await fetch(buildUrl(nm.meta));
		if (!mr.ok) return { why: `no snapshot ${snap ? `"${snap}"` : `for ${map || "BoxStation"}`} in this build (${nm.meta}: HTTP ${mr.status})` };
		const meta = (await mr.json()) as { raw: number; gz: number };
		const rz = await fetch(buildUrl(nm.zst)).catch(() => null);
		const zstd = !!rz?.ok && /\bzstd\b/.test(rz.headers.get("Content-Encoding") ?? "");
		if (!zstd) rz?.body?.cancel().catch(() => {});
		const r = zstd && rz ? rz : await fetch(buildUrl(nm.gz));
		if (!r.ok || !r.body) return { why: `${nm.gz}: HTTP ${r.status}${rz?.ok ? " (and this browser doesn't take the zstd copy)" : ""}`, noZstd: !!rz?.ok };
		const src = r.body.getReader();
		const first = await src.read();
		if (first.done) return { why: `${nm.gz} is empty` };
		let got = first.value.length, lastShown = 0;
		const gzipped = first.value[0] === 0x1f && first.value[1] === 0x8b;
		// unpacked on arrival: the counter counts unpacked bytes, shown scaled to the download's size (Content-Length) when there is one
		const enc = r.headers.get("Content-Encoding") || "none", sent = gzipped ? meta.gz : Number(r.headers.get("Content-Length")) || meta.raw;
		const shown = (n: number) => (gzipped ? n : (n * sent) / meta.raw);
		// the fetched stream again, first chunk included, counting download progress for the loading screen
		const body = new ReadableStream<Uint8Array>({
			start(c) { c.enqueue(first.value); },
			async pull(c) {
				const x = await src.read();
				if (x.done) return c.close();
				got += x.value.length;
				if (got - lastShown > 4e6) { lastShown = got; stage(`Loading the station... ${Math.round(shown(got) / 1e6)} / ${Math.round(sent / 1e6)} MB`); }
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
		return { bytes: out, gz: gzipped ? got : sent, how: zstd ? "zstd" : gzipped ? "gzip" : enc, ms: Date.now() - t0 };
	} catch (e) {
		return { why: `snapshot download failed: ${e}` };
	}
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
// for a moment, which starts Firefox's 5 s idle GC (tick-wait.ts). Suspected after the slow spawn tick.
const yieldPort = new MessageChannel();
let yieldWake: (() => void) | null = null;
yieldPort.port1.onmessage = () => { const w = yieldWake; yieldWake = null; w?.(); };
const yieldNow = () => new Promise<void>((r) => { yieldWake = r; yieldPort.port2.postMessage(0); });

let stopRequested = false;
const resyncRequested = new Set<string>(); // players asked for a full view ("" = the first player)
let freshAsk: { id: string; tgui?: string; tguiSet?: string; tguiWatch?: string } | null = null; // the host asked for a fresh --tgui machine (topic-check --again --fresh), with the scenario's amount, set and watch values as they are now; the tick loop does it
let onHot: ((m: HotMsg) => void) | null = null; // the host replaces game procs in the running world (tools/hot.mjs)
let joins = new Joins("localplayer"); // who comes in and when (joins.ts): {type:"connect", key, job?} / {type:"disconnect", key}, run by the tick loop; a new one per start
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
	else if (m.type === "connect") joins.connect({ key: m.key, job: m.job ?? "Assistant", near: m.near, address: m.address });
	else if (m.type === "disconnect") joins.disconnect(m.key);
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
	else if (m.type === "start") { joins = new Joins(ckeyOf(m.playerKey ?? "LocalPlayer")); void run(m).catch((err) => post({ type: "log", line: `[vm-boot] worker FATAL: ${(err as Error).stack ?? err}` })); }
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
	const { vm, tree, bundle, pixels, scenarioText, scenarioName, stage, snapNote, saveStore, startStore, fixIcons, fixAppIcons } = world;
	let scenarioPlayer = null as ScriptPlayer | null, scenarioStart = -1; // set at the spawn (run-joins.ts, startScenario)
	const joinJob = opts.join ?? "";
	const playerKey = opts.playerKey ?? "LocalPlayer"; // multiplayer: the first player's key (tools/server.mjs passes the first connection's name)
	// ?roundstart=1 (with join): connect in the lobby, set that job to High (the only job), click Ready and start the
	// round at once. tg's DivideOccupations then gives the job and puts you on its station landmark.
	const roundstartJoin = !!joinJob && !!opts.roundstart;
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
	let afterStartLimit: number | null = null;
	let roundStart: { ms: number; ticks: number; } | null = null;
	let ticks = 0;
	// Real-time pacing (after round start, or from the lobby join): see pace.ts.
	const pace: Pace = { wall: 0, tick: 0 };
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
		log(`[vm-boot] ${e.message.startsWith("not implemented:") ? "VM gap" : "runtime"}: ${e.message} | ${e.proc} (${e.source}) | ${e.callStack.slice(1, 6).join(" <- ")}`);
	const hardLimit = t0 + maxSeconds * 1000;
	const deadline = () => (afterStartLimit !== null ? Math.min(hardLimit, afterStartLimit) : hardLimit);

	// Per-10 s cost after round start: VM ms per tick against tick_lag, and snapshot building.
	// slowest tick, ticks over tick_lag, how late the worker woke from its sleep (a blocked thread: JS GC), and how
	// long page input (key/click/mouse messages) waited in the worker before the tick that runs it.
	const stats = makeRunStats({ vm, log, heapMB, secs, t0, get ticks() { return ticks; }, get roundStart() { return roundStart; }, get fatal() { return fatal; } });
	const { live_, lateWakes, liveLine } = stats;

	let fatal: unknown = null;
	const wctx: WorldStartCtx = { opts, vm, tree, bundle, log, post, secs, stage, snapNote, startStore, saveStore, skinText, busyWait, ROUND_START_RE, heapMB, yieldNow, freeBytes, world, setTicks: (n) => { ticks = n; }, setInitDone: () => { initDone = true; }, summary: () => stats.summary(), get fatal() { return fatal; } };
	try {
		if (await startWorld(wctx) === "snapfail") return;
		let lastYield = Date.now();
		const js = makeJoins({ opts, vm, log, post, secs, playerKey, joinJob, lobbyMode, roundstartJoin, wantGender, pace, scenarioText, joins: () => joins,
			get ticks() { return ticks; }, get initDone() { return initDone; }, get roundStart() { return roundStart; },
			startScenario: (mobPath) => { scenarioPlayer = new ScriptPlayer(vm, scenarioText!, log, scenarioName); scenarioStart = ticks + 1; log(`[scenario] ${scenarioName}: spawned as ${mobPath}, world.time ${vm.sched.time}, tick ${ticks}; script tick 0 = tick ${scenarioStart}`); } });
		const { players, early, playerOf, by, firstC, isJoined } = js;
		const aids = makeTickAids({ opts, vm, log, post, firstC, players, get joinAt() { return js.joinAt; }, get ticks() { return ticks; }, get freshAsk() { return freshAsk; }, set freshAsk(v) { freshAsk = v; } });
		const vctx: ViewsCtx = { opts, vm, log, post, players, resyncRequested, fixIcons, fixAppIcons, live_, lastCheck: 0 };
		let idle = false; // netcode 1: between ticks (the VM is not running anything), so a click can run at once
		installInput({ opts, vm, log, post, inLog, cutAt, get logLevel() { return logLevel; }, players, early, playerOf, by, pixels, fetchPixels, normPath, fixAppIcons, resyncRequested, lateWakes, get joined() { return isJoined(); }, get idle() { return idle; } });
		while (ticks < maxTicks && Date.now() < deadline() && !stopRequested) {
			const due = vm.nextDue();
			if (due === null) break;
			if (roundStart !== null || js.lobbyPaced) {
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
			if (isJoined()) vm.clients.runInput(); else vm.clients.runAssetConfirms();
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
			if (opts.endround != null && js.joinAt !== Infinity) { // ?endround=N, N seconds after spawning, through tg's own path
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
			// the world is ready for the first player: read the messages that came during the boot first (the loop has not yielded since),
			// so a player who left or came meanwhile is known before anyone is let in
			if (joins.mode === "waiting" && (lobbyMode ? initDone : !!joinJob && (roundstartJoin ? initDone : roundStart !== null))) await new Promise((r) => setTimeout(r, 1));
			js.step();
			if (isJoined()) {
				// the view's changes since the last tick (a full view first, and after a page resync).
				aids.step(); // the per-tick test aids (tick-aids.ts)
				sendViews(vctx);
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

	await stopWorld(wctx);
}
