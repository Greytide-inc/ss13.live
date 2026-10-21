// engine-sections.ts - the engine feature checks that need a program (a type tree with procs) to run on: real-time pacing,
// savefiles, snapshots, round restart, client.screen / images / view / right-click menu / Topic. They test engine features, not
// BYOND parity. Each runs on whatever program `make()` gives: the TS fixture (tests/fixtures/, through
// `node build/dist/tests/engine-sections-ts.js`, which run.ts starts). They once also ran on the DM test program.

import { VM } from "../src/vm/interpreter.js";
import { ViewDiffer, eyeTileOf } from "../src/worker/client-view.js";
import type { BuiltAppearance } from "../src/appearance/appearance.js";
import { DMAtom } from "../src/vm/world.js";
import { DMList, DMObject, live } from "../src/vm/objects.js";
import { refOf } from "../src/vm/refs.js";
import { loadSnapshot, saveSnapshot } from "../src/vm/snapshot.js";
import { restoreSaves, type ReplayRule } from "../src/vm/persist-replay.js";
import { isSavedPath } from "../src/vfs/persist.js";
import { stringify, type Value } from "../src/vm/value.js";


let failures = 0;
const lines: string[] = [];
const fail = (msg: string) => {
	failures++;
	lines.push(`FAIL ${msg}`);
};

// ---- 4. real-time pacing --------------------------------------------------------------------
// The same sleeping DM test, driven by the wall-clock tick loop at tick_lag 0.5 (50 ms a tick):
// it sleeps 4 deciseconds (8 ticks), so it should take about 400 ms and give the same answer as in fast mode.
async function runRealtimeCheck(make: () => VM): Promise<void> {
	const want = "tick 1;tick 2;spawn3 at 3;tick 3;"; // test_world_time's line in the old DM tests' expected.txt (BYOND's)
	const vm = make();
	vm.runGlobalInit();
	vm.sched.tickLag = 0.5;
	const p = vm.tree.globalProcs.get("test_world_time")!;
	const t0 = Date.now();
	const thread = vm.start(p, []);
	const stop = vm.runRealtime();
	while (!thread.done && Date.now() - t0 < 3000) await new Promise((r) => setTimeout(r, 10));
	stop();
	const ms = Date.now() - t0;
	const got = stringify(thread.result);
	const ok = thread.done && got === want && ms >= 300 && ms < 2000;
	lines.push(`${ok ? "ok  " : "FAIL"} real-time tick loop: ${thread.done ? `"${got}"` : "not finished"} in ${ms} ms (want ~400)`);
	if (!ok) failures++;
}

// ---- 4b. savefiles across a VFS overlay export/import (what the worker keeps in IndexedDB) ------
function runSavefileOverlayCheck(make: () => VM): void {
	const fresh = () => {
		const vm = make();
		vm.runGlobalInit();
		return vm;
	};
	const a = fresh();
	const path = "data/player_saves/x/xx/preferences.sav";
	a.callAndWait("sp_hold", [path]);
	const before = a.vfs.readText(path);
	a.flushSavefiles(); // the handle is still held, so only this writes it out
	const after = a.vfs.readText(path);
	const files = a.vfs.exportOverlay((p) => p.startsWith("data/"));
	const b = fresh();
	b.vfs.importOverlay(files);
	const got = stringify(b.callAndWait("sp_peek", [path]));
	const ok = before === "" && !!after && Object.keys(files).join() === path && got === "2 v 5 deep";
	lines.push(`${ok ? "ok  " : "FAIL"} savefile through VFS export/import: "${got}"`);
	if (!ok) failures++;
}

// ---- 4c. a world snapshot taken mid-run finishes the same as the run that was never saved ----
function runSnapshotCheck(make: () => VM): void {
	const fresh = () => {
		const vm = make();
		vm.runGlobalInit();
		return vm;
	};
	const result = (vm: VM) => stringify(vm.globals[vm.tree.globalNames.indexOf("snap_result")] ?? null);
	const finish = (vm: VM) => {
		for (let i = 0; i < 200 && result(vm) === ""; i++) vm.runTick();
		return result(vm);
	};
	const a = fresh();
	a.start(a.tree.globalProcs.get("snap_run")!, []);
	for (let i = 0; i < 4; i++) a.runTick();
	const { bytes } = saveSnapshot(a, { note: "test" });
	const want = finish(a);
	const b = make();
	const hook = () => []; // translated's rt.install sets vm.stackOf before the load; the load must keep it
	b.stackOf = hook;
	const { host } = loadSnapshot(b, bytes);
	const hookKept = b.stackOf === hook;
	b.stackOf = a.stackOf; // what a had (null on the DM program; the fixture is installed, which sets a hook), so the re-save compares like with like
	const again = saveSnapshot(b, { note: "test" }).bytes;
	const same = again.length === bytes.length && again.every((x, i) => x === bytes[i]);
	const got = finish(b);
	const ok = want !== "" && got === want && same && hookKept && (host as { note: string }).note === "test";
	lines.push(`${ok ? "ok  " : "FAIL"} world snapshot mid-run: ${ok ? `"${got.slice(0, 60)}..."` : `want "${want}" got "${got}", resave identical ${same}, stackOf hook kept ${hookKept}`}`);
	if (!ok) failures++;
}

// ---- 4d. round end -> world.Reboot() -> the next world from the snapshot reads what the round saved ----
function runRestartCheck(make: () => VM): void {
	const fresh = () => {
		const vm = make();
		vm.runGlobalInit();
		vm.loadCompiledMaps();
		return vm;
	};
	const g = (vm: VM, name: string) => stringify(vm.globals[vm.tree.globalNames.indexOf(name)] ?? null);
	const a = fresh();
	a.callAndWait("rs_init", []);
	const { bytes } = saveSnapshot(a, null); // the "build": the pre-started world
	a.callAndWait("rs_round_end", []);
	const reboot = a.rebootRequested;
	a.callAndWait("rs_player_keep", []);
	a.flushSavefiles();
	const store = a.vfs.exportOverlay(isSavedPath); // what the worker puts in IndexedDB before the page starts the next world
	const b = make();
	loadSnapshot(b, bytes);
	const before = stringify(b.callAndWait("rs_pets", []));
	const rules: ReplayRule[] = [{ file: "data/npc_saves/RsPet.sav", recreate: [{ find: "/obj/rs_pet" }], report: (_vm, made) => made.map((m) => `age ${stringify(m.getVar("age"))}`).join() }];
	const logLines = restoreSaves(b, store, rules);
	b.flushSavefiles(); // the build's stale rs_keep handle must not write "build" over the player's file now
	const after = stringify(b.callAndWait("rs_pets", [])), keep = stringify(b.callAndWait("rs_keep_who", []));
	const ok = reboot?.reason === "Round ended." && g(a, "rs_after_reboot") === "1" && before === "2,2:0" && after === "2,2:1" && keep === "player" && logLines.length === 1 && /age 1/.test(logLines[0]);
	lines.push(`${ok ? "ok  " : "FAIL"} round end restart: reboot ${JSON.stringify(reboot)}, pet before "${before}" after "${after}", kept file "${keep}"; ${logLines.join(" | ")}`);
	if (!ok) failures++;
}
// ---- 4. client.screen -= list reaches the page (playtest 2026-09-29: container sprites stayed drawn) ----
function runScreenCheck(make: () => VM): void {
	const vm = make();
	vm.onRuntimeError = () => {};
	vm.runGlobalInit();
	vm.loadCompiledMaps();
	const c = vm.clients.connect("ScreenTester");
	const bad: string[] = [];
	if (!c) { fail("screen check: connect refused"); return; }
	const differ = new ViewDiffer();
	// The page's model of the update stream (as client-scene.ts: apps by id, the last screen list, ids in `gone` dropped).
	const apps = new Set<number>();
	let screen: [number, string, unknown][] = [];
	const feed = (full = false): number => {
		const u = differ.update(vm, full);
		if (u.full) { apps.clear(); screen = []; }
		for (const id of u.gone) apps.delete(id);
		for (const [id] of u.apps) apps.add(id);
		if (u.screen) screen = u.screen;
		return screen.filter(([id]) => apps.has(id)).length;
	};
	const things = vm.callGlobal("screen_make", [3]);
	const base = feed(true);
	vm.callGlobal("screen_open", [c, things]);
	const opened = feed();
	vm.callGlobal("screen_close", [c, things]);
	const closed = feed();
	const len = vm.callGlobal("screen_len", [c]);
	if (opened !== base + 3) bad.push(`after open the page draws ${opened}, want ${base + 3}`);
	if (closed !== base) bad.push(`after close the page draws ${closed}, want ${base} (client.screen.len ${String(len)})`);
	const dup = vm.callGlobal("screen_dup", [c]);
	if (dup !== "1,0,0,2,0,0,1P") bad.push(`screen += twice: got ${String(dup)}, BYOND gives 1,0,0,2,0,0,1P`);
	lines.push(`${bad.length ? "FAIL" : "ok  "} client.screen open/close reaches the page: ${bad.length ? bad.join("; ") : `${base} -> ${opened} -> ${closed}`}`);
	if (bad.length) failures++;
}

// ---- 4b. the page gets only what the client sees (tiles behind walls come empty, drawn black) ----
function runLosCheck(make: () => VM): void {
	const vm = make();
	vm.onRuntimeError = (e) => { fail(`los check runtime: ${String(e)}`); };
	vm.runGlobalInit();
	vm.loadCompiledMaps();
	const c = vm.clients.connect("LosTester");
	if (!c) { fail("los check: connect refused"); return; }
	const M = vm.callGlobal("vlc_setup", [c]);
	const differ = new ViewDiffer();
	const tiles = new Map<string, number[]>();
	const feed = (full = false) => { const u = differ.update(vm, full); if (u.full) tiles.clear(); for (const [x, y, ids] of u.tiles) tiles.set(`${x},${y}`, ids); };
	const bad: string[] = [];
	// Every tile in the view: drawn (ids) exactly when view(7, mob) has its turf (view() is checked against BYOND).
	const same = (what: string) => {
		const inView = new Set<string>();
		const L = live(vm.callGlobal("vlc_view", [M]));
		if (L instanceof DMList) for (const t of L.items) if (t instanceof DMAtom) inView.add(`${t.x},${t.y}`);
		let n = 0;
		for (let x = 1; x <= 15; x++) for (let y = 1; y <= 15; y++) {
			const ids = tiles.get(`${x},${y}`);
			if (!ids) { bad.push(`${what}: ${x},${y} not sent`); continue; }
			if ((ids.length > 0) !== inView.has(`${x},${y}`)) { if (n++ < 3) bad.push(`${what}: ${x},${y} sent ${ids.length} ids, in view() ${inView.has(`${x},${y}`)}`); }
		}
		return inView.size;
	};
	feed(true);
	const closed = same("door shut");
	const hidden = (tiles.get("12,8") ?? [1]).length === 0 && (tiles.get("13,11") ?? [1]).length === 0;
	if (!hidden) bad.push("things behind the shut door were sent");
	vm.callGlobal("vlc_door", [1]);
	feed();
	const open = same("door open");
	if ((tiles.get("12,8") ?? []).length < 2) bad.push("the thing past the open door was not sent");
	vm.callGlobal("vlc_door", [0]);
	feed();
	same("door shut again");
	(M as DMAtom).setVar("sight", 4 | 8 | 16); // a ghost's sight: everything in range
	feed();
	if ((tiles.get("13,11") ?? []).length < 2) bad.push("SEE_TURFS|SEE_OBJS|SEE_MOBS: the thing behind the wall was not sent");
	// mob in a box in a box on (4,5): the view centres on (4,5) (eye = mob, then eye = the inner box).
	const nested = vm.callGlobal("vlc_nest", [c]) as DMAtom;
	const et = eyeTileOf(vm, nested);
	if (!et || et.x !== 4 || et.y !== 5 || et.z !== 1) bad.push(`eye tile of a nested mob is ${JSON.stringify(et)}, want 4,5,1`);
	const box = nested.loc as DMAtom;
	c.setVar("eye", box);
	const et2 = eyeTileOf(vm, box);
	if (!et2 || et2.x !== 4 || et2.y !== 5) bad.push(`eye = inner box: eye tile ${JSON.stringify(et2)}, want 4,5`);
	c.setVar("eye", nested);
	const u = differ.update(vm, true);
	if (u.eyeTile?.x !== 4 || u.eyeTile?.y !== 5) bad.push(`view update eyeTile ${JSON.stringify(u.eyeTile)}, want 4,5`);
	if (!u.tiles.some(([x, y]) => x === 4 && y === 5)) bad.push("view update has no tile at the container's turf");
	vm.callGlobal("vlc_nest_undo", [M]);
	vm.callGlobal("vlc_end", [M]);
	lines.push(`${bad.length ? "FAIL" : "ok  "} client line of sight (page tiles = view()): ${bad.length ? bad.join("; ") : `${closed} turfs seen with the door shut, ${open} open`}`);
	if (bad.length) failures++;
}


// ---- 4b1w. a non-square client.view ("19x15", widescreen): client.view reads back like BYOND's, view()/range() with a "WxH" size give the rectangle, the page gets 19x15 tiles ----
function runWidescreenCheck(make: () => VM): void {
	const vm = make();
	vm.onRuntimeError = (e) => { fail(`widescreen check runtime: ${String(e)}`); };
	vm.runGlobalInit();
	vm.loadCompiledMaps();
	const c = vm.clients.connect("WideTester");
	if (!c) { fail("widescreen check: connect refused"); return; }
	const M = vm.callGlobal("ws_setup", [c]);
	const bad: string[] = [];
	const v15 = vm.callGlobal("ws_set_view", [c, "15x15"]), v19 = vm.callGlobal("ws_set_view", [c, "19x15"]);
	if (v15 !== 7) bad.push(`client.view = "15x15" reads ${JSON.stringify(v15)}, want 7`);
	if (v19 !== "19x15") bad.push(`client.view = "19x15" reads ${JSON.stringify(v19)}, want "19x15"`);
	const box = (d: Value, kind: string) => {
		const L = live(vm.callGlobal("ws_turfs", [M, d, kind]));
		const ts = L instanceof DMList ? L.items.filter((t): t is DMAtom => t instanceof DMAtom) : [];
		const xs = ts.map((t) => t.x), ys = ts.map((t) => t.y);
		return { n: ts.length, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys), centre: ts.some((t) => t.x === 16 && t.y === 11) };
	};
	const want = (what: string, got: ReturnType<typeof box>, n: number, x0: number, x1: number, y0: number, y1: number, centre: boolean) => {
		if (got.n !== n || got.x0 !== x0 || got.x1 !== x1 || got.y0 !== y0 || got.y1 !== y1 || got.centre !== centre) bad.push(`${what}: ${JSON.stringify(got)}, want ${n} turfs x ${x0}..${x1} y ${y0}..${y1}${centre ? "" : " without the centre"}`);
	};
	want('view("19x15")', box("19x15", "view"), 285, 7, 25, 4, 18, true);
	want('range("19x15")', box("19x15", "range"), 285, 7, 25, 4, 18, true);
	want('oview("19x15")', box("19x15", "oview"), 285, 7, 25, 4, 18, true); // a mob centre's own turf stays in oview()
	want("view(7)", box(7, "view"), 225, 9, 23, 4, 18, true);
	want('view("15x15")', box("15x15", "view"), 225, 9, 23, 4, 18, true);
	// The page's view: client.view "19x15" -> the 19x15 tiles around the eye plus the one-tile ring held for the camera glide.
	const u = new ViewDiffer().update(vm, true);
	const xs = u.tiles.map(([x]) => x), ys = u.tiles.map(([, y]) => y), drawn = u.tiles.filter(([, , ids]) => ids.length > 0).length;
	if (u.view !== "19x15") bad.push(`view update view ${JSON.stringify(u.view)}, want "19x15"`);
	if (Math.min(...xs) !== 6 || Math.max(...xs) !== 26 || Math.min(...ys) !== 3 || Math.max(...ys) !== 19) bad.push(`view update tiles x ${Math.min(...xs)}..${Math.max(...xs)} y ${Math.min(...ys)}..${Math.max(...ys)}, want x 6..26 y 3..19`);
	if (drawn !== 21 * 17) bad.push(`view update: ${drawn} tiles with something on them, want ${21 * 17}`);
	vm.callGlobal("ws_end", [M]);
	lines.push(`${bad.length ? "FAIL" : "ok  "} widescreen client.view "19x15" (view()/range() rectangles, page tiles): ${bad.length ? bad.join("; ") : "285 turfs in view(\"19x15\"), 21x17 page tiles"}`);
	if (bad.length) failures++;
}

// ---- 4b2. client.images (tg's pickup / alert images) reach the page, with their animate() steps; pixel_z/pixel_w are in the appearance ----
function runImagesCheck(make: () => VM): void {
	const vm = make();
	vm.onRuntimeError = (e) => { fail(`images check runtime: ${String(e)}`); };
	vm.runGlobalInit();
	vm.loadCompiledMaps();
	const c = vm.clients.connect("ImageTester");
	if (!c) { fail("images check: connect refused"); return; }
	const M = vm.callGlobal("vlc_setup", [c]) as DMAtom;
	const differ = new ViewDiffer();
	const apps = new Map<number, BuiltAppearance>();
	const tiles = new Map<string, number[]>();
	const bad: string[] = [];
	const feed = (full = false) => {
		const u = differ.update(vm, full);
		if (u.full) { tiles.clear(); apps.clear(); }
		for (const id of u.gone) apps.delete(id);
		for (const [id, a] of u.apps) apps.set(id, a);
		for (const [x, y, ids] of u.tiles) tiles.set(`${x},${y}`, ids);
		return u;
	};
	feed(true);
	const before = (tiles.get("8,8") ?? []).length;
	const I = vm.callGlobal("img_add", [c, M]) as DMObject;
	const u = feed();
	const ids = tiles.get("8,8") ?? [];
	if (ids.length !== before + 1) bad.push(`image not on its atom's tile (${before} -> ${ids.length} ids)`);
	const id = ids[ids.length - 1];
	const ap = apps.get(id);
	if (!ap || ap.iconState !== "cardboard_special") bad.push(`image appearance ${JSON.stringify(ap?.iconState)}`);
	else {
		if (ap.mouseOpacity !== 0) bad.push("image is clickable");
		if (ap.pixelY !== 32 || ap.pixelZ !== 32) bad.push(`pixel_z not in the appearance: pixelY ${ap.pixelY} pixelZ ${ap.pixelZ}`);
	}
	const ev = (u.anims ?? []).find((e) => e[0] === "a" && e[1] === id);
	if (!ev || ev[0] !== "a") bad.push("no animate step for the image");
	else {
		const vars = ev[7].map((v) => `${v[0]}:${String(v[1])}>${String(v[2])}`).sort().join(",");
		if (vars !== "alpha:0>255,pixel_z:0>32" || ev[3] !== 5 || ev[5] !== 5) bad.push(`image animate step ${vars} time ${ev[3]} easing ${ev[5]}`);
	}
	if (differ.tileObjects(8, 8).some((o) => o === I)) bad.push("image offered to the right-click menu");
	vm.callGlobal("img_remove", [c, I]);
	const u2 = feed();
	if ((tiles.get("8,8") ?? []).length !== before || !u2.gone.includes(id)) bad.push("image not dropped after client.images -=");
	// an image on a mob that steps glides as the mob does (a moved entry with the mob's tiles, glide_size and animate_movement)
	const I2 = vm.callGlobal("img_add", [c, M]) as DMObject;
	feed();
	vm.callGlobal("img_step", [M]);
	const u3 = feed();
	const imgId = (tiles.get("8,7") ?? []).find((i) => apps.get(i)?.iconState === "cardboard_special");
	const mv = (u3.moved ?? []).filter((m) => m[1] === 8 && m[2] === 8 && m[3] === 8 && m[4] === 7);
	const imv = mv.find((m) => m[0] === imgId);
	const mmv = mv.find((m) => m[0] !== imgId);
	if (!imv || !mmv) bad.push(`image glide: moved entries ${JSON.stringify(u3.moved)}`);
	else if (imv[5] !== mmv[5] || imv[6] !== mmv[6]) bad.push("image glide params differ from the mob's");
	vm.callGlobal("img_remove", [c, I2]);
	feed();
	vm.callGlobal("img_fly", [M]);
	feed();
	const mid = (tiles.get("8,7") ?? []).find((i) => apps.get(i)?.pixelZ !== undefined);
	const fa = mid === undefined ? undefined : apps.get(mid);
	if (!fa || fa.pixelY !== 14 || fa.pixelX !== -3 || fa.pixelW !== -3 || fa.pixelZ !== 12) bad.push(`flying mob appearance ${JSON.stringify(fa && [fa.pixelX, fa.pixelY, fa.pixelW, fa.pixelZ])}`);
	vm.callGlobal("vlc_end", [M]);
	lines.push(`${bad.length ? "FAIL" : "ok  "} client.images and pixel_z/pixel_w reach the page: ${bad.length ? bad.join("; ") : "image on its tile with its animate step, gone when removed, pixel_z folded into pixelY"}`);
	if (bad.length) failures++;
}

// ---- 4c. the right-click menu lists the atoms on a tile with the verbs BYOND would offer ----
function runPopupMenuCheck(make: () => VM): void {
	const vm = make();
	vm.onRuntimeError = (e) => { fail(`popup menu runtime: ${String(e)}`); };
	vm.runGlobalInit();
	vm.loadCompiledMaps();
	const c = vm.clients.connect("PopupTester");
	if (!c) { fail("popup menu: connect refused"); return; }
	const L = live(vm.callGlobal("pm_setup", [c]));
	const [M, item, plain, bob, far, held] = (L as DMList).items as DMAtom[];
	const differ = new ViewDiffer();
	differ.update(vm, true);
	const bad: string[] = [];
	const show = (objs: DMObject[]) => {
		const m = vm.clients.popupMenu(c, objs);
		return { id: m.id, text: m.items.map((i) => `${i.name}: ${i.verbs.join(", ")}`) };
	};
	const check = (what: string, got: string[], want: string[]) => { if (JSON.stringify(got) !== JSON.stringify(want)) bad.push(`${what}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`); };
	// The tile with a turf, an item, a plain obj and a mob, top of the draw order first (mob layer 4, plain 3.5, item 3, turf 2).
	const tile = differ.tileObjects(9, 8);
	const first = show(tile); // (a client has one open menu: the next show() replaces it)
	check("tile (9,8)", first.text, [
		"bob: Examine, Pull",
		"plain: Examine, Pull",
		"item: Examine, Far, Pick up, Pull, Use, World verb",
		"turf: Examine",
	]);
	check("tile (12,8), 4 away", show(differ.tileObjects(12, 8)).text, ["item: Examine, World verb", "turf: Examine"]);
	// Choosing runs the verb like BYOND: at the next tick, with the atom as the first argument (Examine/Pull) or as src (Use).
	const pick = (menu: { id: number; text: string[] }, entry: number, verb: number) => vm.clients.popupPick(c, menu.id, entry, verb);
	pick(show(tile), 0, 0); // bob -> Examine (a menu is good until the next one opens)
	vm.clients.runInput();
	let log = String(vm.callGlobal("pm_getlog", []));
	if (log !== "examine:bob;") bad.push(`picking Examine on bob logged ${JSON.stringify(log)}`);
	check("the player's own tile", show(differ.tileObjects(8, 8)).text, [`${stringify(M.getVar("name"))}: Examine, Say`, "turf: Examine"]);
	check("an item in the player's hands", show([held]).text, ["item: Examine, Far, Mine, Use, World verb"]);
	const second = show(tile);
	pick(second, 2, 4); // item -> Use
	vm.clients.runInput();
	log = String(vm.callGlobal("pm_getlog", []));
	if (log !== "examine:bob;use:item;") bad.push(`picking Use on the item logged ${JSON.stringify(log)}`);
	if (pick(second, 2, 4) !== null) bad.push("a menu answered twice");
	vm.callGlobal("pm_end", [M]);
	lines.push(`${bad.length ? "FAIL" : "ok  "} right-click menu (verbs per atom on a tile, choosing runs one): ${bad.length ? "\n     " + bad.join("\n     ") : "4 tiles, 2 picks"}`);
	if (bad.length) failures++;
}

// ---- a link click (page popup, chat link, tgui action) runs client/Topic with usr = the client's mob ----
function runTopicCheck(make: () => VM): void {
	const vm = make();
	vm.onRuntimeError = (e) => { fail(`topic runtime: ${String(e)}`); };
	vm.runGlobalInit();
	vm.loadCompiledMaps();
	const c = vm.clients.connect("TopicTester");
	if (!c) { fail("topic: connect refused"); return; }
	const mob = live(c.getVar("mob"));
	const name = mob instanceof DMObject ? stringify(mob.getVar("name")) : "?";
	const target = live(vm.callGlobal("tp_new_target", []));
	const bad: string[] = [];
	vm.clients.topic(c, `src=${refOf(target)};tp=1`);
	let log = String(vm.callGlobal("tp_getlog", []));
	if (log !== `client:usr=mob:hsrc;datum:usr=${name};`) bad.push(`link click logged ${JSON.stringify(log)}`);
	// A Topic that sleeps keeps its usr when it wakes up.
	vm.clients.topic(c, `src=${refOf(target)};tp=1;sleep=1`);
	for (let i = 0; i < 3; i++) vm.runTick();
	log = String(vm.callGlobal("tp_getlog", []));
	if (log !== `client:usr=mob:hsrc;datum:usr=${name};after_sleep:usr=${name};`) bad.push(`sleeping Topic logged ${JSON.stringify(log)}`);
	lines.push(`${bad.length ? "FAIL" : "ok  "} link topics run with usr = the client's mob: ${bad.length ? bad.join("; ") : "2 clicks"}`);
	if (bad.length) failures++;
}

/** Runs every section on `make()`'s program; returns the report lines and the failure count. */
export async function runEngineSections(make: () => VM): Promise<{ lines: string[]; failures: number }> {
	const only = process.env.ENGINE_ONLY?.split(","); // development: run just these (Screen, Los, ...)
	const on = (k: string) => !only || only.includes(k);
	failures = 0;
	lines.length = 0;
	if (on("Screen")) runScreenCheck(make);
	if (on("Los")) runLosCheck(make);
	if (on("Widescreen")) runWidescreenCheck(make);
	if (on("Images")) runImagesCheck(make);
	if (on("PopupMenu")) runPopupMenuCheck(make);
	if (on("Topic")) runTopicCheck(make);
	if (on("SavefileOverlay")) runSavefileOverlayCheck(make);
	if (on("Snapshot")) runSnapshotCheck(make);
	if (on("Restart")) runRestartCheck(make);
	if (on("Realtime")) await runRealtimeCheck(make);
	return { lines: [...lines], failures };
}
