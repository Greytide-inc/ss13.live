// dt-life.test.mjs - today's rules for deleted and freed objects, pinned before detranslate changes how game code reads
// and writes vars: every later step must still pass this. Deleting through an alias in a
// var, a list and a local; reading a var of a deleted object (a tg runtime error that ends only that proc); deleting a
// proc's src in a nested call (that proc ends, its caller goes on); references kept by a sleeping proc; locate(tag) after
// tag writes and after deletion; an object freed once its last reference is overwritten; the same through properties
// and `this` (step 4). No boot: the game's types, procs taken over with hand-written bodies in the style of translated
// code (rt.fv, rt.setFv, live, g.del...).
// Usage (from web/, env loaded, after `npx tsc -p .` and `node tools/translate-tg.mjs`): node tests/dt-life.test.mjs
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const web = resolve(import.meta.dirname, "..");
const imp = (p) => import(pathToFileURL(resolve(web, p)).href);
const { loadGame } = await imp("build/dist/src/tools/game-tree.js");
const { VM } = await imp("build/dist/src/vm/interpreter.js");
const rt = await imp("build/dist/src/translate/runtime.js");
const { pin } = await imp("build/dist/src/vm/gc.js");
const { refOf } = await imp("build/dist/src/vm/refs.js");
const { g, live } = rt;
const { tree, install } = await loadGame();
const vm = new VM(tree);
const errors = [];
vm.onRuntimeError = (e) => errors.push(e.message);
install(vm);
vm.runGlobalInit();
errors.length = 0;

let failures = 0, checks = 0;
const ok = (what, cond, detail = "") => {
	checks++;
	if (!cond) { failures++; console.log(`FAIL ${what}${detail ? ` (${detail})` : ""}`); }
};
const shown = (v) => (v === null ? "null" : v === undefined ? "never set" : typeof v === "object" ? v.type?.path ?? "list" : String(v));
// Each key of want must be in seen with the same value (missing from seen: that line never ran); seen has nothing else.
const expect = (what, seen, want) => {
	for (const [k, v] of Object.entries(want)) ok(`${what}: ${k}`, seen[k] === v, `got ${shown(seen[k])}, want ${shown(v)}`);
	for (const k of Object.keys(seen)) if (!(k in want)) ok(`${what}: ${k}`, false, "a line that must not run ran");
};
const expectErrors = (what, want) => {
	ok(`${what}: runtime errors`, errors.join("; ") === want.join("; "), `got [${errors.join("; ")}], want [${want.join("; ")}]`);
	errors.length = 0;
};

// Procs with no args, taken over with hand-written bodies (rt.override checks the kind and arg count).
const used = new Set();
const proc = (gen, body) => {
	for (const p of tree.procs) {
		if (p.isNative || p.argNames.length !== 0 || used.has(p) || !p.path.startsWith("/obj/") || p.attributes & (1 << 5)) continue; // 1 << 5: waitfor = 0
		try { rt.override(p, body, gen); used.add(p); return p; } catch { /* other kind */ }
	}
	throw new Error("no proc to take over");
};
const SLEEP = rt.P("/proc/sleep");
const sleep = (f, ds) => g.call(f, SLEEP, null, [ds]);
const CB = tree.getType("/datum/callback"); // vars object, delegate, arguments: any value
const mk = () => vm.newObject(CB);
const COLLECTED = 2; // GCFlag.Collected (a const enum: not in the built JS)
const freed = (o) => (o.gcFlags & COLLECTED) !== 0;
const found = (text) => vm.locateIn(text, rt.world()); // locate("\ref" or "tag"), as rt.locateIn does it
// Callers and holders that outlive every safe point (pinned, like turfs).
const kept = () => { const o = mk(); pin(o); return o; };
const H = kept(), C = kept(), D = kept();

// ---- 1. delete through an alias in a var, a list and a local: every alias reads null --------------
for (const via of ["var", "list", "local"]) {
	const B = mk(), seen = {};
	H.setVar("delegate", B);
	H.setVar("arguments", rt.list(B, 5));
	const p = proc(false, function (f) {
		let x = rt.fv(f, "delegate", H);
		f.vars = () => [x];
		if (via === "var") rt.del(f, rt.fv(f, "delegate", H));
		else if (via === "list") rt.del(f, rt.at(rt.fv(f, "arguments", H), 1));
		else rt.del(f, live(x));
		seen.deleted = B.deleted;
		seen.fv = rt.fv(f, "delegate", H);
		seen.at = rt.at(rt.fv(f, "arguments", H), 1);
		seen.index = rt.index(rt.fv(f, "arguments", H), 1);
		seen.len = rt.len(f, rt.fv(f, "arguments", H)); // the item stays, reading as null
		seen.second = rt.at(rt.fv(f, "arguments", H), 2);
		seen.isIn = rt.isIn(f, B, rt.fv(f, "arguments", H));
		seen.liveLocal = live(x);
		seen.rawLocal = x === B; // the local's slot keeps the object: every read goes through live()
		seen.istype = rt.istype(x, CB);
		seen.truthy = rt.truthy(live(x));
		seen.reached = true; // src wasn't deleted: the proc goes on
		return 1;
	});
	seen.ret = vm.call(p, [], C);
	expect(`alias (del via ${via})`, seen, { deleted: true, fv: null, at: null, index: null, len: 2, second: 5, isIn: false, liveLocal: null, rawLocal: true, istype: false, truthy: false, reached: true, ret: 1 });
	expectErrors(`alias (del via ${via})`, []);
}

// ---- 2. a var of a deleted object: a runtime error, logged, that ends that proc only ---------------
{
	const seen = {};
	const inner = proc(false, function (f) {
		const B = mk();
		H.setVar("delegate", B);
		let x = rt.fv(f, "delegate", H);
		f.vars = () => [x];
		rt.del(f, x);
		f.dot = 3;
		seen.read = rt.fv(f, "object", live(x));
		return 4;
	});
	const innerGen = proc(true, function* (f) {
		const B = mk();
		H.setVar("delegate", B);
		let x = rt.fv(f, "delegate", H);
		f.vars = () => [x];
		yield* g.del(f, x);
		f.dot = 5;
		seen.readGen = rt.fv(f, "object", x);
		return 6;
	});
	const outer = proc(true, function* (f) {
		seen.plain = rt.call(f, inner, D, []); // the callee's `.` at the error
		seen.gen = yield* g.call(f, innerGen, D, []);
		seen.outerReached = true;
		return 7;
	});
	seen.ret = vm.call(outer, [], C);
	expect("null var read", seen, { plain: 3, gen: 5, outerReached: true, ret: 7 });
	expectErrors("null var read", ["Cannot read null.object", "Cannot read null.object"]);
}

// ---- 3. deleting a proc's src in a nested call: that proc ends at once, its caller goes on ---------
{
	const seen = {};
	const B = Array.from({ length: 6 }, mk);
	H.setVar("arguments", rt.list(...B)); // alive until deleted
	// `del src`
	const delSrcPlain = proc(false, function (f) { f.dot = 11; rt.del(f, live(f.src)); seen.afterDelPlain = true; return 12; });
	const delSrcGen = proc(true, function* (f) { f.dot = 13; yield* g.del(f, live(f.src)); seen.afterDelGen = true; return 14; });
	// deeper: a helper on another object deletes the caller's src through an alias and goes on itself; the caller ends when it returns
	const helper = proc(false, function (f) { rt.del(f, rt.fv(f, "object", H)); seen.helperWentOn = true; return 15; });
	const helperGen = proc(true, function* (f) { yield* g.del(f, rt.fv(f, "object", H)); seen.helperGenWentOn = true; return 16; });
	const midPlain = proc(false, function (f) {
		H.setVar("object", live(f.src));
		f.dot = 17;
		seen.helperGot = rt.call(f, helper, D, []);
		return 18;
	});
	const midGen = proc(true, function* (f) {
		H.setVar("object", live(f.src));
		f.dot = 19;
		seen.helperGenGot = yield* g.call(f, helperGen, D, []);
		return 20;
	});
	const plainOuter = proc(false, function (f) {
		seen.plainToGen = rt.call(f, delSrcGen, B[4], []); // a plain caller gets null, not `.` (as tests/plain-gen-calls)
		seen.plainOuterReached = true;
		return 21;
	});
	const outer = proc(true, function* (f) {
		seen.plainToPlain = rt.call(f, delSrcPlain, B[0], []); // the caller gets the callee's `.`
		seen.genToGen = yield* g.call(f, delSrcGen, B[1], []);
		seen.deeperPlain = rt.call(f, midPlain, B[2], []);
		seen.deeperGen = yield* g.call(f, midGen, B[3], []);
		seen.plainOuter = rt.call(f, plainOuter, D, []);
		seen.onDeleted = rt.call(f, delSrcPlain, B[0], []); // a proc called on a deleted src doesn't run
		seen.onDeletedGen = yield* g.call(f, delSrcGen, B[5], []); // B[5] isn't deleted: control
		seen.outerReached = true;
		return 22;
	});
	seen.ret = vm.call(outer, [], C);
	seen.allDeleted = B.every((b) => b.deleted);
	expect("nested del", seen, {
		plainToPlain: 11, genToGen: 13, helperWentOn: true, deeperPlain: 17, helperGenWentOn: true, deeperGen: 19, plainToGen: null, plainOuterReached: true,
		plainOuter: 21, onDeleted: null, onDeletedGen: 13, outerReached: true, ret: 22, allDeleted: true,
	});
	expectErrors("nested del", []);
}

// ---- 4. references kept by a sleeping proc ---------------------------------------------------------
{
	const seen = {};
	let x0 = null, y0 = null;
	const sleeper = proc(true, function* (f) {
		let x = mk(), y = mk(); // nothing else refers to either
		f.vars = () => [x, y];
		x0 = x; y0 = y;
		seen.xRef = refOf(x);
		yield* sleep(f, 1);
		seen.xFreed = freed(x);
		seen.xFound = found(seen.xRef) === x;
		seen.xLive = live(x) === x;
		seen.yLive = live(y); // deleted while it slept
		seen.yRaw = y === y0;
		return 1;
	});
	const srcSleeper = proc(true, function* (f) { yield* sleep(f, 1); seen.srcGoneWoke = true; return 2; });
	const killer = proc(false, function (f) { rt.del(f, live(y0)); rt.del(f, rt.fv(f, "object", H)); return 3; });
	const E = mk();
	H.setVar("object", E);
	vm.call(sleeper, [], C);
	vm.call(srcSleeper, [], E); // its src is deleted while it sleeps: it never wakes
	vm.gcSafePoint();
	seen.xFreedAsleep = freed(x0);
	vm.call(killer, [], D);
	for (let i = 0; i < 3; i++) vm.runTick();
	expect("sleep", seen, { xRef: seen.xRef, xFreedAsleep: false, xFreed: false, xFound: true, xLive: true, yLive: null, yRaw: true });
	expectErrors("sleep", []);
}

// ---- 5. locate(tag) after a tag write and after deletion -------------------------------------------
{
	const seen = {};
	const T1 = mk(), T2 = mk(), r2 = refOf(T2);
	const p = proc(false, function (f) {
		rt.setFv(f, "tag", T1, "dtlife-a");
		seen.a = rt.locateIn(f, "dtlife-a", rt.world()) === T1;
		rt.setFv(f, "tag", T1, "dtlife-b");
		seen.aAfterRetag = rt.locateIn(f, "dtlife-a", rt.world());
		seen.b = rt.locateIn(f, "dtlife-b", rt.world()) === T1;
		rt.setFv(f, "tag", T2, "dtlife-c");
		return 1;
	});
	vm.call(p, [], C);
	vm.gcSafePoint(); // only its tag refers to T1, only its tag to T2
	seen.taggedKept = !freed(T1) && !freed(T2) && found("dtlife-b") === T1;
	const q = proc(false, function (f) {
		rt.setFv(f, "tag", T2, null);
		seen.cAfterUntag = rt.locateIn(f, "dtlife-c", rt.world());
		rt.del(f, T1);
		seen.bAfterDel = rt.locateIn(f, "dtlife-b", rt.world());
		return 1;
	});
	vm.call(q, [], C);
	seen.untaggedNotYet = !freed(T2);
	vm.gcSafePoint();
	seen.untaggedFreed = freed(T2) && found(r2) === null;
	expect("tag", seen, { a: true, aAfterRetag: null, b: true, taggedKept: true, cAfterUntag: null, bAfterDel: null, untaggedNotYet: true, untaggedFreed: true });
	expectErrors("tag", []);
}

// ---- 6. an object freed once its last reference is overwritten -------------------------------------
{
	const seen = {};
	const D1 = mk(), D2 = mk(), D3 = mk(), D4 = mk(), D5 = mk();
	const refs = [D1, D2, D3, D4, D5].map(refOf);
	const p = proc(false, function (f) {
		rt.setFv(f, "delegate", H, D1);
		rt.setFv(f, "object", H, rt.list(D3));
		rt.setFv(f, "delegate", D4, D5); // D5: only D4 holds it
		rt.setFv(f, "arguments", H, D4);
		return 1; // D2: never stored
	});
	vm.call(p, [], C);
	vm.gcSafePoint();
	seen.heldKept = [D1, D3, D4, D5].every((o) => !freed(o)) && found(refs[0]) === D1;
	seen.unheldFreed = freed(D2) && found(refs[1]) === null;
	const q = proc(false, function (f) {
		rt.setFv(f, "delegate", H, null); // D1
		rt.setAt(rt.fv(f, "object", H), 1, null); // D3: its list item overwritten
		rt.setFv(f, "arguments", H, 0); // D4, and with it D5
		return 1;
	});
	vm.call(q, [], C);
	seen.notAtWrite = !freed(D1) && !freed(D3) && !freed(D4); // freed at the next safe point, not at the write
	vm.gcSafePoint();
	seen.d1 = freed(D1) && found(refs[0]) === null;
	seen.d3 = freed(D3) && found(refs[2]) === null;
	seen.d4d5 = freed(D4) && freed(D5) && found(refs[3]) === null && found(refs[4]) === null;
	seen.notDeleted = !D1.deleted && !D5.deleted; // freeing isn't del
	expect("free", seen, { heldKept: true, unheldFreed: true, notAtWrite: true, d1: true, d3: true, d4d5: true, notDeleted: true });
	expectErrors("free", []);
}

// ---- 7. the same through properties (`o.delegate`, `this.object`: detranslate step 4) ----------------
{
	// a deleted object read through an alias in a var or a list is null; writes keep references and tags
	const seen = {};
	const B = mk(), T1 = mk(), E = mk();
	H.setVar("delegate", B);
	H.setVar("arguments", rt.list(B, 5));
	const p = proc(false, function (f) {
		rt.del(f, H.delegate);
		seen.prop = H.delegate;
		seen.item = rt.at(rt.fv(f, "arguments", H), 1); // `arguments` is no property (runtime NOT_PROPS)
		seen.len = rt.len(f, rt.fv(f, "arguments", H));
		H.object = E; // only H refers to E
		T1.tag = "dtlife-p";
		seen.tagFound = rt.locateIn(f, "dtlife-p", rt.world()) === T1;
		seen.isThis = this === C; // a proc's `this` is its src
		seen.thisVar = this.delegate === null; // C's delegate: never written
		return 1;
	});
	seen.ret = vm.call(p, [], C);
	vm.gcSafePoint();
	seen.heldKept = !freed(E) && H.getVar("object") === E && !freed(T1);
	expect("properties", seen, { prop: null, item: null, len: 2, tagFound: true, isThis: true, thisVar: true, ret: 1, heldKept: true });
	expectErrors("properties", []);
}
{
	// a var of a deleted or null object: a runtime error that ends only that proc
	const seen = {};
	const inner = proc(false, function (f) {
		const x = mk();
		f.vars = () => [x];
		rt.del(f, x);
		f.dot = 3;
		seen.read = x.object; // the deleted object itself
		return 4;
	});
	const innerNull = proc(false, function (f) { f.dot = 5; seen.readNull = live(null).object; return 6; });
	const innerGen = proc(true, function* (f) {
		const x = mk();
		f.vars = () => [x];
		yield* g.del(f, x);
		f.dot = 7;
		x.object = 1; // a write
		return 8;
	});
	const outer = proc(true, function* (f) {
		seen.plain = rt.call(f, inner, D, []);
		seen.plainNull = rt.call(f, innerNull, D, []);
		seen.gen = yield* g.call(f, innerGen, D, []);
		seen.outerReached = true;
		return 9;
	});
	const used = vm.deletedUses;
	seen.ret = vm.call(outer, [], C);
	expect("null property", seen, { plain: 3, plainNull: 5, gen: 7, outerReached: true, ret: 9 });
	// detranslate 6b: a local keeps the deleted object (no live()); each use of it is counted for the boot logs, null's aren't
	ok("null property: deleted uses counted", vm.deletedUses - used === 2 && vm.deletedUseNames.has("/datum/callback.object")
		&& vm.deletedUseNames.has("/datum/callback.object ="), `${vm.deletedUses - used}: ${[...(vm.deletedUseNames ?? [])].join(", ")}`);
	expectErrors("null property", ["Cannot read null.object", "Cannot read null.object", "Cannot modify null.object."]);
}
{
	// `this` after a nested call deleted src: the proc has ended, no line after it runs; a tail's `this` is its src too
	const seen = {};
	const B = mk(), B2 = mk();
	const helper = proc(false, function (f) { rt.del(f, rt.fv(f, "object", H)); return 1; });
	const victim = proc(false, function (f) {
		H.setVar("object", this);
		f.dot = 2;
		rt.call(f, helper, D, []);
		seen.afterHelper = this.delegate;
		return 3;
	});
	rt.tail("dt-life-this", function* (f) { seen.tailThis = this === B2; return 4; });
	const sleeper = proc(true, function* (f) { return yield* rt.sleepThen(f, 1, "dt-life-this", []); });
	seen.ret = vm.call(victim, [], B);
	vm.call(sleeper, [], B2);
	for (let i = 0; i < 3; i++) vm.runTick();
	expect("this", seen, { ret: 2, tailThis: true });
	expectErrors("this", []);
}

console.log(failures ? `dt-life: ${failures} of ${checks} FAILED` : `dt-life: OK (${checks} checks)`);
process.exit(failures ? 1 : 0);
