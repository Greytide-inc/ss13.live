// Test runner: `npm test` (from web/). Runs every check and exits non-zero if any fail.
//
// 1. The real game: loads the game files (build/game-types.js + translated-tg.js) and checks the tree.
// 2. (retired) DM behaviour vs BYOND 511: ran on the bytecode interpreter, deleted with it.
// 3. Real tg code (smoke): runs a few of tgstation's own list/text helpers (including the TimSort
//    datum behind sortList) in the VM and checks the results against plain JS.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { repoRoot } from "../src/tools/repo-root.js";
import { loadGame } from "../src/tools/game-tree.js";
import { VM } from "../src/vm/interpreter.js";
import { findMacro, overrideOf, parseKey } from "../src/vm/clients.js";
import { clickParams, screenLoc } from "../src/render/click-params.js";
import { ArgType as A, parseArgs, pickByName } from "../src/vm/command-line.js";
import { parseSkin } from "../src/vm/skin.js";
import { DMList, listAnd, listAndInPlace, listAssignFrom, live } from "../src/vm/objects.js";
import { ListLiteral, ObjectTree, Resource } from "../src/vm/objtree.js";
import { isEqual, stringify, type Value } from "../src/vm/value.js";

let failures = 0;
const fail = (msg: string) => {
	failures++;
	console.log(`FAIL ${msg}`);
};

// ---- 1. the game files -------------------------------------------------------------------------
// the real tg game is the program in build/game-types.js + build/translated-tg.js (npm run boot-check builds them).
let gameTree: ObjectTree | null = null;
let gameInstall: ((vm: VM) => number) | null = null;

async function loadGameTree(): Promise<void> {
	if (!existsSync(resolve(repoRoot, "web/build/game-types.js")) || !existsSync(resolve(repoRoot, "web/build/translated-tg.js"))) {
		console.log("skip game files (build/game-types.js, translated-tg.js missing: run a boot-check or build:static first)");
		return;
	}
	const t0 = Date.now();
	const { tree, install } = await loadGame();
	gameTree = tree;
	gameInstall = install;
	const master = tree.getType("/datum/controller/master");
	const ok = master !== undefined && master.procs.has("Initialize") && tree.globalProcs.size > 0;
	console.log(`${ok ? "ok  " : "FAIL"} game files: ${tree.types.length} types, ${tree.procs.length} procs (${Date.now() - t0} ms)`);
	if (!ok) failures++;
}

// ---- 2. DM tests vs BYOND (retired) ----------------------------------------------------------
// the 51 DM test files (/proc/test_*() vs BYOND 511's expected.txt, 508/508 at 14d59ad) ran on the bytecode
// interpreter and went with it. The project it came from keeps the same files in web/tests/dm/.

// ---- 3. tg helpers ----------------------------------------------------------------------------
function runTgSmoke(): void {
	if (!gameTree) return;
	const tree = gameTree;
	const vm = new VM(tree);
	gameInstall?.(vm);
	const errors: string[] = [];
	vm.onRuntimeError = (e) => errors.push(`${e.message} in ${e.proc}`);
	// GLOB.sortInstance normally comes from the global initialiser, which needs typesof() (not built yet).
	vm.setGlobal(tree.globalNames.indexOf("sortInstance"), vm.newObject(tree.getType("/datum/sortInstance")!));
	const L = (...a: (number | string)[]) => new DMList(a);
	const items = (v: unknown) => (v instanceof DMList ? v.items : v);
	const nums: number[] = [];
	for (let i = 0; i < 300; i++) nums.push((i * 7919) % 211);
	const cases: [string, () => unknown, unknown][] = [
		["english_list", () => vm.callGlobal("english_list", [L("a", "b", "c")]), "a, b and c"],
		["uniqueList", () => items(vm.callGlobal("uniqueList", [L(1, 2, 1, 3, 2)])), [1, 2, 3]],
		["difflist", () => items(vm.callGlobal("difflist", [L(1, 2, 3), L(2)])), [1, 3]],
		["reverseRange", () => items(vm.callGlobal("reverseRange", [L(1, 2, 3, 4)])), [4, 3, 2, 1]],
		["capitalize", () => vm.callGlobal("capitalize", ["hello"]), "Hello"],
		// stoplag() with no Master: sleep(world.tick_lag) and return 1 (the scheduler).
		["stoplag (sleeps one tick)", () => {
			const t0 = vm.sched.time;
			const r = vm.callAndWait("stoplag");
			return [r, vm.sched.time - t0];
		}, [1, 1]],
		// key -> tg's skin macro -> verb, as Clients.keyDown/command resolve them.
		// Memory: a list keeps up to 16 associated values in a flat array, more in a Map. Both
		// forms must answer alike: random sets/removes/cuts on lists of up to 40 keys, checked against a Map
		// model (DM's rules: a key's value goes with its last copy removed), then copied.
		["associated values, small and Map forms", () => {
			let seed = 7;
			const rnd = (n: number) => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) % n);
			const keys = Array.from({ length: 40 }, (_, i) => `k${i}`);
			let bad = 0, maps = 0, smalls = 0;
			for (let round = 0; round < 200; round++) {
				const l = new DMList(), model = new Map<string, number>(), items: string[] = [];
				for (let op = 0; op < 120; op++) {
					const r = rnd(10), k = keys[rnd(5 + round % 36)];
					if (r < 6) {
						const v = rnd(1000);
						l.set(k, v);
						if (!items.includes(k)) items.push(k);
						model.set(k, v);
					} else if (r < 8 && items.length) {
						const i = rnd(items.length);
						l.cut(i, i + 1);
						const [gone] = items.splice(i, 1);
						model.delete(gone);
					} else if (items.length) {
						const v = rnd(1000);
						l.setItem(0, items[0]);
						l.set(items[0], v);
						model.set(items[0], v);
					}
				}
				const check = (x: DMList) => {
					if (x.items.join() !== items.join()) bad++;
					for (const k of keys) if ((x.assocOf(k) ?? "none") !== (model.get(k) ?? "none") || x.get(k) !== (model.get(k) ?? null)) bad++;
					if (x.hasAssoc !== model.size > 0) bad++;
				};
				check(l);
				check(l.copy());
				if (l.assoc instanceof Map) maps++;
				else if (l.assoc) smalls++;
			}
			return [bad, maps > 20, smalls > 20];
		}, [0, true, true]],
		["movement macros (skin.dmf)", () => {
			const skin = parseSkin(readFileSync(resolve(repoRoot, "interface/skin.dmf"), "utf8"));
			const m = (set: string, name: string, up = false) => { const k = parseKey(name); return findMacro(skin, set, k.mods, k.key, up); };
			return [m("default", "NORTH"), m("default", "W"), m("default", "CTRL+W"), m("hotkeys", "D"), m("default", "CTRL+B"), m("default", "TAB")?.command,
				m("robot-hotkeys", "W")?.command, m("robot-hotkeys", "S")?.command, m("hotkeys", "W")?.command];
		}, [{ command: ".moveup", rep: true }, null, { command: ".moveup", rep: true }, { command: ".moveright", rep: true }, { command: "resist", rep: false },
			undefined, ".moveup", ".movedown", ".moveup"]],
		["movement verbs", () => {
			const v = (type: string, cmd: string) => vm.clients.verbs(tree.getType(type)!).get(cmd)?.path ?? null;
			return [v("/client", ".moveup"), v("/client", ".northeast"), v("/client", ".center"), v("/mob/living/carbon/human", "resist"), v("/client", "nope")];
		}, ["/client/verb/moveup", "/client/proc/Northeast", "/client/proc/Center", "/mob/living/verb/resist", null]],
		// pt-a: a verb command runs the most derived override (tg's client/Northwest(), not the built-in .northwest that steps the mob);
		// a verb with no override (.north, .moveup) is unchanged. `verbs` list entries are the first definition, like a client's own list.
		["verb commands run overrides", () => {
			const t = tree.getType("/client")!, fake = { type: t } as never;
			const listed = (n: string) => { for (const p of t.procs.values()) for (let q: typeof p | null = p; q; q = q.superProc) if (q.name === n && q.superProc === null) return q; return null; };
			const run = (n: string) => { const b = listed(n); return b ? overrideOf(fake, b).path : null; };
			return [run("Northwest"), run("Southwest"), run("Northeast"), run("Southeast"), run("North"), run("moveup")];
		}, ["/client/proc/Northwest", "/client/proc/Southwest", "/client/proc/Northeast", "/client/proc/Southeast", "/client/verb/North", "/client/verb/moveup"]],
		// the params text of a click (icon-x/icon-y from 1 at the icon's lower-left, screen-loc tile:pixel both 1-based).
		["click params", () => [
			clickParams({ px: 240, py: 240, canvasH: 480, iconX: 17, iconY: 16, button: "left", shift: true, ctrl: false, alt: false }),
			screenLoc(0, 479, 480), screenLoc(479, 0, 480),
			clickParams({ px: 5, py: 5, canvasH: 480, iconX: null, iconY: null, button: "middle", shift: false, ctrl: true, alt: true }),
			screenLoc(607, 0, 480), screenLoc(304, 240, 480), // a 19x15 (608x480) canvas: the top-right tile is 19,15, the centre 10,8
		], ["icon-x=17;icon-y=16;shift=1;left=1;screen-loc=8:17,8:16", "1:1,1:1", "15:32,15:32", "ctrl=1;alt=1;middle=1;screen-loc=1:6,15:27", "19:32,15:32", "10:17,8:16"]],
		// command-line argument parsing (verb arguments by declared type).
		["command-line args", () => {
			const m = (t: string) => pickByName(["Bob the Assistant", "floor", "Bobby"], (x) => x, t);
			const r = (rest: string, ...types: (number | undefined)[]) => JSON.stringify(parseArgs<string>(rest, types.map((Type) => ({ Type })), (t) => m(t)));
			return [r('"hello there" x', A.Text), r("hello there world", A.Text), r('say "unterminated', A.Text), r("12 abc", A.Num, A.Text), r("abc", A.Num), r("", A.Text),
				r("", A.Null | A.Text), r("fl", A.Mob | A.Obj | A.Turf), r("nobody", A.Mob), r('"Bob the" hi', A.Mob, A.Text), r("7 x", undefined, undefined), r("a  b   c d", A.Text, A.CommandText)];
		}, [
			'{"ok":true,"args":["hello there"]}', '{"ok":true,"args":["hello there world"]}', '{"ok":true,"args":["say \\"unterminated"]}',
			'{"ok":true,"args":[12,"abc"]}', '{"ok":false,"reason":"invalid","arg":0,"text":"abc"}', '{"ok":false,"reason":"missing","arg":0,"text":""}',
			'{"ok":true,"args":[null]}', '{"ok":true,"args":["floor"]}', '{"ok":false,"reason":"invalid","arg":0,"text":"nobody"}',
			'{"ok":true,"args":["Bob the Assistant","hi"]}', '{"ok":true,"args":[7,"x"]}', '{"ok":true,"args":["a","b   c d"]}']],
		// world.Export is stubbed (no network); tg's callers treat null as "request failed".
		["world.Export stub", () => vm.natives.get("/world/proc/Export")?.(vm, ["http://example.com/"], null, null), null],
		["sortList (TimSort, 300 numbers)", () => items(vm.callGlobal("sortList", [new DMList(nums.slice()), tree.globalProcs.get("cmp_numeric_asc")!])), nums.slice().sort((a, b) => a - b)],
	];
	let passed = 0;
	for (const [name, run, want] of cases) {
		let got: unknown;
		try {
			got = run();
		} catch (e) {
			got = `!crash: ${(e as Error).message}`;
		}
		if (JSON.stringify(got) === JSON.stringify(want) && errors.length === 0) passed++;
		else fail(`tg ${name}: got ${JSON.stringify(got)} ${errors.join("; ")}`);
		errors.length = 0;
	}
	console.log(`${passed === cases.length ? "ok  " : "FAIL"} tg helpers in the VM: ${passed}/${cases.length}`);
}

// ---- 5. big-list search index ---------------------------------------------------------------
// DMList keeps a count index for big, often-searched lists (see DMList.index). Random edits and
// searches on a big list must give the same answers as plain array scans, and the index must match a
// recount of the items after every step.
function runListIndexCheck(): void {
	let seed = 12345;
	const rnd = (n: number) => ((seed = (seed * 1103515245 + 12345) >>> 0) >>> 8) % n;
	const pool: Value[] = [];
	for (let i = 0; i < 40; i++) pool.push(i, `s${i}`, new DMList(), new ListLiteral(null, false));
	pool.push(NaN, null, new Resource("a.dmi"), new Resource("a.dmi"));
	for (let i = 0; i < 600; i++) pool.push(new DMList()); // mostly single occurrences (DMList.findOnly)
	const pick = () => pool[rnd(pool.length)];
	const l = new DMList();
	for (let i = 0; i < 700; i++) l.push(pick());
	let problems = 0;
	const note = (m: string) => { if (problems++ < 5) console.log(`  ${m}`); };
	for (let step = 0; step < 20000; step++) {
		const v = pick();
		switch (rnd(9)) {
			case 0: l.push(v); break;
			case 1: l.add(v); break;
			case 2: l.remove(v); break;
			case 3: if (l.len) l.setItem(rnd(l.len), v); break;
			case 4: if (typeof v === "string") l.set(v, 1); break;
			case 5: l.setLen(Math.max(0, l.len + rnd(5) - 2)); break;
			case 6: if (l.len > 600) l.cut(rnd(l.len - 3), l.len - 2); break;
			case 7: l.insert(rnd(l.len + 1), [v, pick()]); break;
			default: {
				const same = (x: Value) => isEqual(live(x), v);
				const want = l.items.findIndex(same);
				let wantLast = l.items.length - 1;
				while (wantLast >= 0 && !same(l.items[wantLast])) wantLast--;
				if (l.indexOf(v) !== want || l.lastIndexOf(v) !== wantLast || l.contains(v) !== want >= 0)
					note(`step ${step}: search for ${String(v)} gave ${l.indexOf(v)}/${l.lastIndexOf(v)}, want ${want}/${wantLast}`);
			}
		}
		if (l.index !== null && step % 50 === 0) {
			const count = new Map<unknown, number>();
			for (const x of l.items) count.set(x, (count.get(x) ?? 0) + 1);
			if (count.size !== l.index.size || [...count].some(([k, c]) => l.index!.get(k as never) !== c)) note(`step ${step}: index != recount`);
		}
	}
	const built = l.index !== null;
	const ok = problems === 0 && built;
	console.log(`${ok ? "ok  " : "FAIL"} big-list search index: ${problems} problems, index ${built ? "built" : "never built"}`);
	if (!ok) failures++;
}

// `A &= B` in place (listAndInPlace) against the old A - (A - B) copy-and-reassign, on small lists
// with duplicates, nulls, resources and associated values.
function runListAndInPlaceCheck(): void {
	let seed = 777;
	const rnd = (n: number) => ((seed = (seed * 1103515245 + 12345) >>> 0) >>> 8) % n;
	const pool: Value[] = ["a", "b", "c", "d", "e", 1, 2, NaN, null, new Resource("a.dmi"), new DMList(), new DMList()];
	const pick = () => pool[rnd(pool.length)];
	const make = () => {
		const l = new DMList();
		const n = rnd(9);
		for (let i = 0; i < n; i++) {
			const x = pick();
			if (rnd(3) === 0 || l.contains(x)) l.push(x);
			else l.push(x, rnd(2) ? pick() : rnd(100));
		}
		if (rnd(3) === 0 && l.len) l.setItem(rnd(l.len), pick()); // may leave an assoc on a replaced key
		return l;
	};
	const dump = (l: DMList) => l.items.map((x) => `${stringify(x)}=${stringify(l.assocOf(x) ?? "-")}`).join(",");
	let problems = 0;
	for (let step = 0; step < 20000; step++) {
		const a = make(), b = rnd(10) ? make() : pick();
		const a2 = a.copy();
		const want = listAssignFrom(a2, listAnd(a2, b));
		const got = listAndInPlace(a, b);
		if (got !== a || dump(got) !== dump(want)) if (problems++ < 5) console.log(`  step ${step}: got ${dump(got)} want ${dump(want)}`);
	}
	const self = new DMList(["x", "y"]);
	self.setAssoc("x", 5);
	if (listAndInPlace(self, self) !== self || dump(self) !== "x=5,y=-") problems++;
	console.log(`${problems ? "FAIL" : "ok  "} list &= in place: ${problems} problems`);
	if (problems) failures++;
}

// ---- 4. engine feature sections on the TS fixture ------------------------------------------------------------
// tests/engine-sections.ts runs in its own process (the fixture's types register in the runtime's one global table, which
// the game bundle also uses) as build/dist/tests/engine-sections-ts.js on the TS fixture (tests/fixtures/). It must exit 0
// and print "failures 0". (It once also ran on the DM test program and both had to print the same lines.)
function runEngineSectionsTs(): void {
	const script = resolve(repoRoot, "web/build/dist/tests/engine-sections-ts.js");
	const r = spawnSync("node", [script], { encoding: "utf8", maxBuffer: 1 << 26 });
	const out = (r.stdout ?? "").split("\n").filter((l) => l.length > 0);
	const lines = out.filter((l) => !/^failures \d+$/.test(l));
	for (const l of lines) console.log(l);
	const failed = r.status !== 0 || !out.some((l) => l === "failures 0");
	if (failed) fail(`engine sections on the TS fixture: exit ${r.status}, ${lines.filter((l) => l.startsWith("FAIL")).join("; ") || (r.stderr ?? "").slice(0, 500)}`);
	console.log(`${failed ? "FAIL" : "ok  "} engine sections on the TS fixture: ${lines.length} lines`);
}

await loadGameTree();
runListIndexCheck();
runListAndInPlaceCheck();
runTgSmoke();
runEngineSectionsTs();
if (failures) {
	console.log(`\n${failures} failure(s)`);
	process.exitCode = 1;
} else {
	console.log("\nall tests passed");
}
