// waitfor0.test.mjs - generator procs calling `set waitfor = 0` procs, the hooks Move() calls, sleeps, input(), new and del
// whose procs sleep, call() and error stacks, all without a VM request per call. Checks the results, the order of events
// (by tick) and the runtime errors against tests/waitfor0.expected.txt, which the pre-6d build (instruction requests run
// by the VM) wrote. No boot.
// Usage (from web/, env loaded, after `npx tsc -p .` and `node tools/translate-tg.mjs`):
//   node tests/waitfor0.test.mjs            compare this build with the expected file
//   node tests/waitfor0.test.mjs --web DIR  print what the build in DIR (a web/ with build/dist) sees (to write the expected file)
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const here = resolve(import.meta.dirname, "..");
if (process.argv[2] !== "--child") {
	const web = process.argv[2] === "--web" ? resolve(process.argv[3]) : here;
	const got = execFileSync(process.execPath, [import.meta.filename, "--child", web], { encoding: "utf8", maxBuffer: 1 << 26 })
		.split("\n").filter((l) => /^[RE] /.test(l));
	if (process.argv[2] === "--web") { console.log(got.join("\n")); process.exit(0); }
	const want = readFileSync(resolve(here, "tests/waitfor0.expected.txt"), "utf8").split("\n").filter((l) => /^[RE] /.test(l));
	let fail = 0;
	for (let i = 0; i < Math.max(want.length, got.length); i++) {
		if (want[i] !== got[i]) { fail++; console.log(`FAIL line ${i + 1}\n  old: ${want[i]}\n  new: ${got[i]}`); }
	}
	console.log(fail ? `waitfor0: ${fail} FAILED` : `waitfor0: OK (${got.length} lines identical to the pre-6d build)`);
	process.exit(fail ? 1 : 0);
}

const web = process.argv[3];
const imp = (p) => import(pathToFileURL(resolve(web, p)).href);
const { loadGame } = await imp("build/dist/src/tools/game-tree.js");
const { VM } = await imp("build/dist/src/vm/interpreter.js");
const rt = await imp("build/dist/src/translate/runtime.js");
const { g } = rt;
const { tree, install } = await loadGame();
const vm = new VM(tree);
vm.debugInfo = true;
const out = [];
let tick = 0;
const R = (s) => out.push(`R t${tick} ${s}`);
vm.onRuntimeError = (e) => out.push(`E t${tick} ${e.message} | ${e.proc} | ${e.callStack.join(" < ")}`);
install(vm);
vm.runGlobalInit();
out.length = 0;

const NOWAIT = 1 << 5; // ProcAttr.DisableWaitfor
const used = new Set();
// A translated proc with no args, taken over with a hand-written body (rt.override checks the kind and arg count).
const pick = (gen, nowait = false, pred = (p) => p.argNames.length === 0 && p.path.startsWith("/obj/")) => {
	for (const p of tree.procs) {
		if (p.isNative || used.has(p) || !pred(p)) continue;
		if (nowait !== ((p.attributes & NOWAIT) !== 0)) continue;
		try { rt.override(p, gen ? function* (f) { return null; } : function (f) { return null; }, gen); used.add(p); return p; } catch { /* other kind */ }
	}
	if (nowait) { // few real waitfor = 0 procs have no args: make one
		const p = pick(gen, false, pred);
		p.attributes |= NOWAIT;
		return p;
	}
	throw new Error("no proc to take over");
};
const name = (o) => (o === null || o === undefined ? "null" : o.getVar?.("name") ?? String(o));
const SLEEP = rt.P("/proc/sleep");
const sleep = (f, d) => g.call(f, SLEEP, null, [d]);

const W = {}; // waitfor = 0 callees
for (const k of ["ret", "sleep", "nested", "throwEarly", "throwLate", "outer", "inner", "delSrc", "srcGone", "prompt", "dyn", "spawned"]) W[k] = pick(true, true);
const G = {}; // ordinary generator procs
for (const k of ["sleepy", "drive", "drive2", "delDrive", "thrower", "newDrive", "srcDrive", "delProc"]) G[k] = pick(true);
const plainCaller = pick(false);

rt.override(W.ret, function* (f) { f.dot = 1; return 11; }, true);
rt.override(W.sleep, function* (f) { f.dot = 2; yield* sleep(f, 1); R("W.sleep woke"); return 22; }, true);
rt.override(G.sleepy, function* (f) { f.dot = 30; yield* sleep(f, 2); R("G.sleepy woke"); return 33; }, true);
rt.override(W.nested, function* (f) { f.dot = 3; const v = yield* g.call(f, G.sleepy, null, []); R("W.nested got " + v); return 34; }, true);
rt.override(W.throwEarly, function* (f) { f.dot = 4; rt.callName(f, null, "boom", []); return 44; }, true);
rt.override(W.throwLate, function* (f) { f.dot = 5; yield* sleep(f, 1); R("W.throwLate woke"); rt.callName(f, null, "bang", []); return 55; }, true);
rt.override(W.inner, function* (f) { f.dot = 6; yield* sleep(f, 3); R("W.inner woke"); return 66; }, true);
rt.override(W.outer, function* (f) { f.dot = 7; const v = yield* g.call(f, W.inner, null, []); R("W.outer got " + v); f.dot = 70; yield* sleep(f, 1); R("W.outer woke"); return 77; }, true);
rt.override(W.delSrc, function* (f) { f.dot = 8; yield* g.del(f, rt.live(f.src)); R("not reached (W.delSrc)"); return 88; }, true);
rt.override(W.srcGone, function* (f) { f.dot = 9; yield* sleep(f, 2); R("not reached (W.srcGone woke with its src deleted)"); return 99; }, true);
let promptReq = null;
rt.override(W.prompt, function* (f) {
	f.dot = 10;
	const v = yield* g.op(f, "Prompt", [1], [null, "dflt", "Message", "Title", null]);
	R("W.prompt got " + v);
	return v;
}, true);
rt.override(W.dyn, function* (f) { f.dot = 12; yield* sleep(f, 1); R("W.dyn woke src " + name(f.src)); return 121; }, true);
rt.override(W.spawned, function* (f) { f.dot = 13; yield* sleep(f, 1); R("W.spawned woke"); return 131; }, true);
rt.override(G.thrower, function* (f) { f.dot = 14; rt.callName(f, null, "zap", []); return 141; }, true);

const a = vm.newObject(tree.getType("/datum")), b = vm.newObject(tree.getType("/datum")), c = vm.newObject(tree.getType("/datum"));
a.setVar?.("name", "A");
// A prompt that parks the thread until the test answers it (the VM's own input() needs a player).
vm.clients.prompt = (types, list, a1, a2, a3, a4, usr) => {
	R(`prompt types=${types} a1=${a1} a2=${a2} a3=${a3} a4=${a4}`);
	promptReq = {};
	vm.park(promptReq);
	return null;
};

rt.override(G.drive, function* (f) {
	R("ret " + (yield* g.call(f, W.ret, null, [])));
	R("sleep " + (yield* g.call(f, W.sleep, null, [])));
	R("nested " + (yield* g.call(f, W.nested, null, [])));
	rt.tryOpen(f);
	try {
		R("throwEarly " + (yield* g.call(f, W.throwEarly, null, [])));
		rt.tryClose(f);
	} catch (e) {
		R("throwEarly caught " + name(rt.catchValue(f, e)));
	}
	R("throwEarly uncaught " + (yield* g.call(f, W.throwEarly, null, [])));
	R("throwLate " + (yield* g.call(f, W.throwLate, null, [])));
	R("outer " + (yield* g.call(f, W.outer, null, [])));
	R("prompt " + (yield* g.call(f, W.prompt, null, [])));
	R("dyn " + (yield* g.callDyn(f, a, W.dyn.name, [])));
	R("dyn proc " + (yield* g.callDyn(f, W.dyn, undefined, [])));
	rt.spawn(f, 0, function* (f2) { R("spawn body"); R("spawn got " + (yield* g.call(f2, W.spawned, null, []))); R("spawn after"); });
	R("after spawn");
	R("plain " + rt.call(f, plainCaller, null, []));
	yield* sleep(f, 1);
	R("drive woke");
	R("sleepy " + (yield* g.call(f, G.sleepy, null, [])));
	R("thrower " + (yield* g.call(f, G.thrower, null, [])));
	return 1;
}, true);
rt.override(plainCaller, function (f) {
	R("plain->W.sleep " + rt.call(f, W.sleep, null, []));
	R("plain->drive2 " + rt.call(f, G.drive2, null, []));
	return 5;
}, false);
rt.override(G.drive2, function* (f) {
	f.dot = 50;
	R("drive2 W.ret " + (yield* g.call(f, W.ret, null, [])));
	R("drive2 W.sleep " + (yield* g.call(f, W.sleep, null, [])));
	yield* sleep(f, 2);
	R("drive2 woke");
	return 51;
}, true);
// A waitfor = 0 callee whose src is deleted while it sleeps: it ends when it wakes.
rt.override(G.srcDrive, function* (f) {
	R("srcGone " + (yield* g.callDyn(f, W.srcGone, undefined, [])));
	R("deleting b");
	yield* g.del(f, f.src);
	R("not reached (srcDrive after deleting its src)");
	return 1;
}, true);
// The caller's src deleted by a waitfor = 0 callee before it sleeps: the caller ends at once (checkSrc / deliver).
rt.override(G.delDrive, function* (f) {
	f.dot = 60;
	R("delDrive W.delSrc " + (yield* g.callDyn(f, W.delSrc, undefined, [])));
	R("not reached (delDrive after its src was deleted)");
	return 61;
}, true);

// The built-in Move() (a plain proc here) calling a hook that sleeps: Move carries on with the hook's `.` (VM.enter's MOVE_HOOKS rule).
const move = tree.procs.find((p) => p.path === "/atom/movable/proc/Move" && !p.superProc);
let hook = null;
for (const p of tree.procs) {
	if (hook !== null) break;
	if (!["Entered", "Crossed", "Uncrossed", "Exited", "Bump"].includes(p.name) || p.isNative || used.has(p) || (p.attributes & NOWAIT) !== 0) continue;
	const body = function* (f) { f.dot = 15; yield* sleep(f, 1); R("hook " + p.name + " woke"); return 151; };
	const fn = [function* (f) { return yield* body(f); }, function* (f, x) { return yield* body(f); }, function* (f, x, y) { return yield* body(f); }, function* (f, x, y, z) { return yield* body(f); }][p.argNames.length];
	if (fn === undefined) continue;
	try { rt.override(p, fn, true); used.add(p); hook = p; } catch { /* plain */ }
}
rt.override(move, function (f, NewLoc, Dir) { R("Move calls " + hook.name); R("Move got " + rt.call(f, hook, f.src, [])); return 1; }, false);
R("hook " + hook.path);

// new and del whose New()/Del() sleep (waitfor = 0 New: `new` is the object at once; a Del() that waits holds up its caller).
let newType = null;
for (const t of tree.types) {
	if (!t.path.startsWith("/obj/")) continue;
	const np = t.procs.get("New");
	if (newType === null && np && !np.isNative && np.owner === t && !used.has(np) && np.argNames.length <= 1) {
		const fn = np.argNames.length === 0 ? function* (f) { f.dot = 16; yield* sleep(f, 1); R("New woke"); return 161; } : function* (f, loc) { f.dot = 16; yield* sleep(f, 1); R("New woke"); return 161; };
		try { rt.override(np, fn, true); used.add(np); np.attributes |= NOWAIT; newType = t; } catch { /* plain */ }
	}
}
// No tg type has a Del() of its own: give one to a datum type nobody else uses here.
const delType = tree.types.find((t) => t.path.startsWith("/datum/") && !t.procs.get("New")?.hasBody && t !== newType && !t.path.includes("controller"));
rt.override(G.delProc, function* (f) { f.dot = 17; yield* sleep(f, 2); R("Del woke"); return 171; }, true);
delType.procs.set("Del", G.delProc);
R("new type " + (newType?.path ?? "none") + " del type " + delType.path);
rt.override(G.newDrive, function* (f) {
	if (newType !== null) {
		const o = yield* g.new_(f, newType, []);
		R("new got " + (o?.type?.path ?? o));
	}
	const o = vm.newObject(delType);
	R("del " + (yield* g.del(f, o)));
	R("del done, deleted " + (o.deleted ? 1 : 0));
	return 1;
}, true);

const run = (label, proc, src, args = []) => {
	const t = vm.start(proc, args, src);
	R(`${label} started, done ${t.done ? 1 : 0}`);
};
run("drive", G.drive, a);
run("srcDrive", G.srcDrive, b);
run("delDrive", G.delDrive, c);
R("b deleted " + (b.deleted ? 1 : 0) + " c deleted " + (c.deleted ? 1 : 0));
run("Move", move, vm.newObject(tree.getType("/datum")), [null, null]);
run("newDrive", G.newDrive, null);
for (tick = 1; tick <= 12; tick++) {
	vm.runTick();
	if (tick === 3 && promptReq !== null) { R("answering"); vm.answerPrompt(promptReq, "yes"); }
}
for (const l of out) console.log(l);
