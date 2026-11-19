// world-start - the start and the end of run() in boot-worker.ts, moved out of it: startWorld loads the saved world (the snapshot)
// or boots a fresh one; stopWorld sends the summary and tg's data/ files, and saves the savefile store when tg rebooted the world.

import type { VM } from "../vm/interpreter.js";
import type { ObjectTree } from "../vm/objtree.js";
import type { VfsBundle } from "../vfs/bundle-format.js";
import { loadSnapshot, resumeWorld } from "../vm/snapshot.js";
import { snapshotMapOk } from "../vm/persist-replay.js";
import type { StartMsg, SnapFetch } from "./boot-worker.js";
import type { loadWorld } from "./load-world.js";

/** What run() shares with the start and the end. setTicks and setInitDone write run()'s variables; fatal reads one. */
export interface WorldStartCtx {
	opts: StartMsg;
	vm: VM;
	tree: ObjectTree;
	bundle: VfsBundle;
	world: Awaited<ReturnType<typeof loadWorld>>;
	log: (line: string) => void;
	post: (m: unknown) => void;
	secs: () => string;
	stage: (text: string) => void;
	snapNote: (why: string) => void;
	startStore: (fromSnapshot: boolean) => void;
	saveStore: () => Promise<void>;
	skinText: string | null;
	busyWait: boolean;
	ROUND_START_RE: RegExp;
	heapMB: () => string;
	yieldNow: () => Promise<void>;
	freeBytes: (b: Uint8Array) => void;
	setTicks: (n: number) => void;
	setInitDone: () => void;
	summary: () => string[];
	readonly fatal: unknown;
}

/** Loads the snapshot or boots the world. "snapfail": the snapshot broke part-way, the page reloads (run() must return). */
export async function startWorld(ctx: WorldStartCtx): Promise<"snapfail" | void> {
	const { opts, vm, tree, bundle, world, log, post, secs, stage, snapNote, startStore, skinText, busyWait, ROUND_START_RE, heapMB, yieldNow, freeBytes } = ctx;
	let snapLoaded = false;
	const snapMapFile = (() => { // the snapshot's map file, from the _maps json of the map the snapshot was made for
		try { const mj = bundle.files[`_maps/${opts.map}station.json`] ?? bundle.files[`_maps/${opts.map}.json`] ?? bundle.files["_maps/boxstation.json"]; return (JSON.parse(String(mj)) as { map_file?: string }).map_file ?? "BoxStation.dmm"; } catch { return "BoxStation.dmm"; }
	})();
	if (world.snapP) {
		let snap: SnapFetch | null = await world.snapP;
		world.snapP = null;
		if (!("why" in snap) && !snapshotMapOk(world.storeFiles, snapMapFile)) snap = { why: `your saves pick another map for this round (data/next_map.json); the snapshot is ${opts.map || "Box Station"}` };
		if ("why" in snap) {
			snapNote(snap.why);
			if (snap.noZstd) post({ type: "loadnote", text: "This browser can't unpack this build's quick station download (zstd: Safari can't yet), so the station is being set up from scratch, which takes about a minute. Firefox or Chrome start in seconds." });
		}
		else {
			stage("Unpacking the station...");
			await yieldNow(); // let the page show it
			const rawMB = (snap.bytes.length / 1048576).toFixed(1), gzMB = (snap.gz / 1048576).toFixed(1), fetchS = (snap.ms / 1000).toFixed(1), snapHow = snap.how;
			try {
				const r = loadSnapshot(vm, snap.bytes);
				freeBytes(snap.bytes);
				snap = null;
				snapLoaded = true;
				const host = r.host as { log: string[]; ticks: number; wall: number };
				ctx.setTicks(host.ticks);
				// the saved boot's log up to the lobby, so the combined log has every milestone. A mid-round snapshot's
				// "Game start took" line goes through worldLog, so the worker knows the round has started (late join, pacing).
				for (const l of host.log) if (ROUND_START_RE.test(l)) vm.worldLog(l); else log(l);
				ctx.setInitDone();
				const seed = opts.seed ?? Math.floor(Math.random() * 0x7fffffff);
				const reset = resumeWorld(vm, seed);
				if (skinText !== null) vm.clients.setSkin(skinText); // the saved world had no client, hence no skin
				log(`[vm-boot] snapshot loaded (${gzMB} MB ${snapHow}, ${rawMB} MB raw, fetched and unpacked in ${fetchS} s; ${r.objects} objects in ${(r.ms / 1000).toFixed(1)} s) at ${secs()} s wall (the saved boot took ${host.wall.toFixed(1)} s to get here); world.time ${vm.sched.time}, tick ${vm.sched.tick}, ${vm.sched.sleeping} sleeping threads; RNG seed ${seed}; reset ${reset.join(", ") || "nothing"}; heap ${heapMB()} MB`);
				post({ type: "milestone", name: "snapshot", s: Number(secs()) });
				startStore(true); // after the load: the snapshot replaced the file layer
				// Memory: free the load's garbage now, behind the loading screen. Without a GC here the first full GC came ~85 s in,
				// at a ~0.9 GB higher peak. It used to let Firefox's worker go idle once (its idle GC, see tick-wait.ts), but that GC
				// came 5 s later, just after a quick join's spawn: a ~0.9 s freeze. A big buffer that
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
					return "snapfail";
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
}

/** After the tick loop: the summary, tg's data/ files, and the store's save before the next world. */
export async function stopWorld(ctx: WorldStartCtx): Promise<void> {
	const { vm, log, post, saveStore, fatal } = ctx;
	const summary = ctx.summary();
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
