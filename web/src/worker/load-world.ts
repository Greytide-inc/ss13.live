// load-world - what run() does before the world starts, moved out of it: the scenario header, the downloads (snapshot,
// translated code, type tree, bundle, icon sizes/pixels), the VM with its icon hooks, and the savefile store.
// loadWorld(ctx) returns what run() and the tick loop use afterwards.

import { VM } from "../vm/interpreter.js";
import { ObjectTree } from "../vm/objtree.js";
import { gameProgram } from "../vm/typedefs.js";
import { Vfs } from "../vfs/vfs.js";
import { openStore, isSavedPath, type FileStore } from "../vfs/persist.js";
import type { VfsBundle } from "../vfs/bundle-format.js";
import { restoreSaves } from "../vm/persist-replay.js";
import { parseHeader, parseScript } from "./scenario-script.js";
import { encodeDmi } from "../dmi/png.js";
import { type IconImage, evalRecipe } from "../dmi/icon-ops.js";
import type { DmiState } from "../dmi/dmi.js";
import type { StartMsg, HotMsg, SnapFetch } from "./boot-worker.js";

/** What run() shares with the loading: the start message, and the helpers that live in boot-worker.ts (a value import from there would be a cycle). */
export interface LoadWorldCtx {
	opts: StartMsg;
	log: (line: string) => void;
	secs: () => string;
	post: (m: unknown) => void;
	buildUrl: (name: string) => URL;
	fetchJson: <T>(name: string) => Promise<T>;
	fetchPixels: (path: string) => Promise<IconImage | null>;
	fetchSnapshot: (stage: (text: string) => void, map?: string, snap?: string) => Promise<SnapFetch>;
	normPath: (path: string) => string;
	PIXEL_FILES: string[];
	setOnHot: (f: (m: HotMsg) => void) => void;
	setFreshAsk: (a: { id: string; tgui?: string; tguiSet?: string; tguiWatch?: string }) => void;
}

export async function loadWorld(ctx: LoadWorldCtx) {
	const { log, secs, post, buildUrl, fetchJson, fetchPixels, fetchSnapshot, normPath, PIXEL_FILES, setOnHot, setFreshAsk } = ctx;
	let opts = ctx.opts;
	// ?scenario=NAME. The page fetched web/scenarios/NAME.txt; its header sets the job (round-start join), seed and map, its
	// lines are the script (src/worker/scenario-script.ts, as boot.js --scenario). `length` is ignored: the game carries on. Any problem: logged, game carries on.
	let scenarioText = "", scenarioName = "";
	if (opts.scenario) {
		scenarioName = opts.scenario.name;
		try {
			if (opts.scenario.error || opts.scenario.text === undefined) throw new Error(opts.scenario.error ?? "no text");
			const h = parseHeader(opts.scenario.text);
			if (!h.job) throw new Error("the header needs a job: line");
			parseScript(opts.scenario.text);
			opts = { ...opts, join: h.job, roundstart: true };
			if (h.seed !== undefined && Number.isFinite(h.seed)) opts.seed = h.seed;
			if (h.map && !/^box(station)?$/i.test(h.map)) opts.map = h.map;
			scenarioText = opts.scenario!.text!;
			log(`[scenario] ${scenarioName}: map ${h.map ?? "BoxStation"}, job ${h.job}, seed ${h.seed ?? "random"}, length ${h.length ?? "?"} s (ignored in the page); starts when the player spawns`);
		} catch (e) {
			log(`[scenario] cannot run '${scenarioName}': ${(e as Error).message}; carrying on without it`);
		}
	}
	const pixels = new Map<string, IconImage | null>();
	// the snapshot downloads alongside the game code. Not for ?map= (the snapshot is the default map) or ?nosnap=1.
	const stage = (text: string) => post({ type: "stage", text });
	const snapNote = (why: string) => { const t = `[vm-boot] snapshot not used, normal boot: ${why}`; log(t); console.warn(t); };
	let snapP: Promise<SnapFetch> | null = null;
	if (opts.snapshot === false) snapNote("?nosnap=1");
	else { snapP = fetchSnapshot(stage, opts.map, opts.snap); stage("Loading the station..."); }
	// tg's procs run as the translated JavaScript (web/build/translated-tg.js, made by tools/translate-tg.mjs; one ~32 MB module).
	// Downloaded and compiled alongside the game data; installed once the VM exists.
	const tl = Date.now();
	const trP: Promise<{ rt: typeof import("../translate/runtime.js"); ms: number }> = (async () => {
		const rt = await import("../translate/runtime.js");
		await import(buildUrl("translated-tg.js").href);
		return { rt, ms: Date.now() - tl };
	})();
	trP.catch(() => {}); // awaited below; this only stops an "unhandled rejection" before then
	// web/game's type tree, globals and string table (src/vm/typedefs.ts), bundled by tools/translate-tg.mjs.
	const typesP = (async () => {
		const tl = Date.now();
		await import(buildUrl("game-types.js").href);
		return Date.now() - tl;
	})();
	typesP.catch(() => {});
	const [bundle, sizes] = await Promise.all([
		fetchJson<VfsBundle>("vfs-bundle.json"),
		fetchJson<Record<string, [number, number, [string, number, number, number][]]>>("icon-sizes.json"),
		...PIXEL_FILES.map(async (p) => pixels.set(p, await fetchPixels(p))),
	]);
	post({ type: "milestone", name: "loaded", s: Number(secs()) });
	log(`[vm-boot] worker: fetched game, VFS bundle, icon sizes/states and ${PIXEL_FILES.length} icon files' pixels in ${secs()} s`);
	const typesMs = await typesP;
	const tTree = Date.now();
	const tree = new ObjectTree(gameProgram()); // types and procs from the game files, no tgstation.json
	log(`[vm-boot] type tree: game-types.js downloaded and run in ${(typesMs / 1000).toFixed(1)} s (from the start), built in ${((Date.now() - tTree) / 1000).toFixed(2)} s, at ${secs()} s`);
	// Same one-line config change as the BYOND reference boot (web/reference/boot-byond.sh) and boot.ts.
	const cfg = bundle.files["config/config.txt"];
	if (cfg) bundle.files["config/config.txt"] = cfg.replace(/^GUEST_BAN/m, "#GUEST_BAN");

	const vm = new VM(tree);
	if (opts.seed !== undefined) vm.rng.seed(opts.seed);
	{ // before the snapshot load or boot, as boot.ts does
		const { rt, ms } = await trP;
		if (opts.fastAir === false) (globalThis as { FAST_AIR?: boolean }).FAST_AIR = false; // ?fastair=0, the atmos procs as translated (src/translate/fast-air.ts)
		const n = rt.install(vm);
		if (opts.hot) setOnHot((m) => { // only a host that asked for it at start (server.mjs --hot); players' messages never get here
			if (m.fresh) { setFreshAsk({ id: m.id, tgui: m.tgui, tguiSet: m.tguiSet, tguiWatch: m.tguiWatch }); return; }
			const lines: string[] = [];
			let ok = true;
			for (const h of m.files) {
				try {
					const r = rt.hotSwap(rt, h.file, h.js, h.firstId, h.paths);
					lines.push(`${h.file}: ${r.procs} procs reloaded, ${r.changed.length} changed${r.changed.length ? ` (${r.changed.join(", ")})` : ""}${r.left.length ? `; left alone: ${r.left.join(", ")}` : ""}`);
				} catch (err) { ok = false; lines.push(`${h.file}: NOT swapped: ${String((err as Error).message ?? err).slice(0, 400)}`); }
			}
			for (const l of lines) log(`[vm-boot] hot: ${l} (world.time ${vm.sched.time})`);
			post({ type: "hotResult", id: m.id, ok, lines });
		});
		log(`[vm-boot] translated: ${n} procs installed from translated-tg.js (downloaded and compiled in ${(ms / 1000).toFixed(1)} s) at ${secs()} s`);
		post({ type: "milestone", name: "translated", s: Number(secs()) });
	}
	vm.vfs = new Vfs(bundle);
	if (opts.map) { // ?map=runtime boots tg's map the way the game does: data/next_map.json holds that map's _maps/<name>.json
		const mj = bundle.files[`_maps/${opts.map}station.json`] ?? bundle.files[`_maps/${opts.map}.json`];
		if (mj) { vm.vfs.writeText("data/next_map.json", mj); log(`[vm-boot] map option '${opts.map}': data/next_map.json written`); } else log(`[vm-boot] map option '${opts.map}': no _maps json found, using the default`);
	}
	// savefiles persist in IndexedDB: restore before the world starts, write back debounced (3 s).
	// with a snapshot, only after loading it (the snapshot replaces the whole file layer).
	const store = (globalThis as { tgjsFileStore?: FileStore }).tgjsFileStore ?? openStore(); // tools/server-prelude.mjs with --saves: a file
	let storeFiles: Record<string, Uint8Array> = {};
	try { storeFiles = await store.load(); } catch (e) { log(`[vm-boot] savefile store load failed: ${e}`); }
	delete storeFiles["data/next_map.json"]; // older saves kept the ?map= choice; it is per-load now (isSavedPath)
	let storeSaving: Promise<void> = Promise.resolve();
	let storeSaved = -1;
	/** Writes the savefiles and, if anything changed, the whole data/ overlay to IndexedDB. Resolves when it is stored. */
	const saveStore = (): Promise<void> => {
		vm.flushSavefiles();
		if (vm.vfs.revision === storeSaved) return storeSaving;
		storeSaved = vm.vfs.revision;
		const files = vm.vfs.exportOverlay(isSavedPath);
		return (storeSaving = storeSaving.then(() => store.save(files)).catch((e) => log(`[vm-boot] savefile store save failed: ${e}`)));
	};
	/** snapshotLoaded: the files go in with restoreSaves, which also redoes the init steps that read them. */
	const startStore = (snapshotLoaded: boolean) => {
		const n = Object.keys(storeFiles).length;
		if (snapshotLoaded) for (const l of restoreSaves(vm, storeFiles)) log(l);
		else vm.vfs.importOverlay(storeFiles);
		log(`[vm-boot] savefile store: loaded ${n} files`);
		storeFiles = {};
		storeSaved = vm.vfs.revision;
		setInterval(() => void saveStore(), 3000);
	};
	vm.lenient = true;
	vm.debugInfo = true; // tgstation.dme defines DEBUG
	vm.iconSize = (path) => { const e = sizes[normPath(path)]; return e ? [e[0], e[1]] : null; };
	const states = new Map<string, Omit<DmiState, "cells">[] | null>();
	vm.iconStates = (path) => {
		const p = normPath(path);
		if (!states.has(p))
			states.set(p, sizes[p]?.[2]?.map(([name, dirs, frames, movement]) => ({ name, dirs: dirs as DmiState["dirs"], frames, movement: !!movement, delay: [], loop: 0, rewind: false, hotspot: null })) ?? null);
		return states.get(p)!;
	};
	const pixelsUsed = new Set<string>();
	vm.loadIcon = (path) => {
		const p = normPath(path);
		if (!pixelsUsed.has(p)) {
			pixelsUsed.add(p);
			log(`[vm-boot] icon pixels ${pixels.has(p) ? "used" : "MISS (not in PIXEL_FILES; loading for next time)"}: ${p} at world.time ${vm.sched.time}`);
			// ponytail: a miss answers null once (GetPixel/drawing sees no pixels) while it loads; add the file to PIXEL_FILES.
			if (!pixels.has(p)) void fetchPixels(p).then((i) => pixels.set(p, i));
		}
		return pixels.get(p) ?? null;
	};
	// Runtime icons (fcopy_rsc'd /icons) -> blob: URLs of real .dmi files, made once each, by the page: the worker sends the
	// bytes under a made-up blob: name (rtIcon) and the page makes the real URL. URL.createObjectURL in a Firefox worker waits
	// on the main thread with the worker's queue empty, which starts its 5 s idle GC: a ~1 s freeze 5 s after a spawn that
	// drew one (plans/less-garbage.md step 4). The name ends in ")" so no name is the start of another (the page's server
	// path swaps them by text), and carries this world's start time so a later world's icon isn't the page's cached one.
	const runtimeUrls = new Map<string, string>(), rtTag = Date.now().toString(36);
	const runtimeUrl = (path: string): string | null => {
		const recipe = vm.runtimeIcons.get(path);
		if (!recipe) return null;
		let url = runtimeUrls.get(path);
		if (!url) {
			const dmi = encodeDmi(evalRecipe(recipe, (p) => vm.loadIcon!(p)));
			runtimeUrls.set(path, (url = `blob:rticon(${rtTag}:${path})`));
			post({ type: "rtIcon", url, path, dmi }); // before the view that uses the URL
			log(`[vm-boot] runtime icon ${path} sent to the page as a ${dmi.length}-byte .dmi (${url})`);
		}
		return url;
	};
	const fixIcons = (o: Record<string, unknown>): void => {
		for (const k in o) {
			const v = o[k];
			if (typeof v === "string") { if (k === "icon" && v.startsWith("rsc/")) { const u = runtimeUrl(v); if (u) o[k] = u; } }
			else if (v !== null && typeof v === "object") fixIcons(v as Record<string, unknown>);
		}
	};

	return {
		opts, vm, tree, bundle, pixels, scenarioText, scenarioName, stage, snapNote, saveStore, startStore, fixIcons,
		get snapP() { return snapP; }, set snapP(v) { snapP = v; },
		get storeFiles() { return storeFiles; },
	};
}
