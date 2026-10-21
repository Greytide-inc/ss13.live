// plain-gen-calls.test.mjs - a plain proc calling a generator proc (runtime.ts callGenFromPlain, driven in place)
// returns, throws, sleeps, deletes src and nests as expected (the list of lines in `want` below); and `new` of a type
// whose New() sleeps, from a plain proc, fails loudly. Runs this file once in a child process and checks what it saw.
// Usage (from web/, env loaded, after `npx tsc -p .` and `node tools/translate-tg.mjs`): node tests/plain-gen-calls.test.mjs
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const web = resolve(import.meta.dirname, "..");
if (process.argv[2] !== "--child") {
	// One child run (a fresh VM), checked against what the results must be (the old callViaTemp path this once compared with is gone).
	const out = execFileSync(process.execPath, [import.meta.filename, "--child"], { encoding: "utf8", maxBuffer: 1 << 26 });
	const lb = out.split("\n").filter((l) => /^[RE] /.test(l));
	let fail = 0;
	const want = ["ret:42", "sleep:null", "caught:Cannot execute null.boom()", "uncaught:9", "del:null", "nested:null", "inner-throw-caught:Cannot execute null.boom()", "woke:sleeper", "woke:nested", "after-del-src:1", "new-sleep-throws:1"];
	for (const w of want) if (!lb.some((l) => l.startsWith("R " + w))) { fail++; console.log(`FAIL missing ${w}`); }
	console.log(lb.join("\n"));
	console.log(fail ? `plain-gen-calls: ${fail} FAILED` : `plain-gen-calls: OK (${lb.length} lines)`);
	process.exit(fail ? 1 : 0);
}

const imp = (p) => import(pathToFileURL(resolve(web, p)).href);
const { loadGame } = await imp("build/dist/src/tools/game-tree.js");
const { VM } = await imp("build/dist/src/vm/interpreter.js");
const rt = await imp("build/dist/src/translate/runtime.js");
const { g } = rt;
const { tree, install } = await loadGame();
const vm = new VM(tree);
vm.debugInfo = true;
const out = [];
vm.onRuntimeError = (e) => out.push(`E ${e.message} | ${e.proc} | ${e.callStack.join(" < ")}`);
install(vm);
vm.runGlobalInit();
out.length = 0;

// Procs with no args on an obscure type, taken over with hand-written bodies (rt.override checks the kind and arg count).
const pick = (gen) => {
	for (const p of tree.procs) {
		if (p.isNative || p.argNames.length !== 0 || used.has(p) || !p.path.startsWith("/obj/")) continue;
		try { rt.override(p, gen ? function* (f) { return null; } : function (f) { return null; }, gen); used.add(p); return p; } catch { /* other kind */ }
	}
	throw new Error("no proc to take over");
};
const used = new Set();
const R = (s) => out.push("R " + s);
const SLEEP = rt.P("/proc/sleep");
const G = {};
for (const k of ["ret", "sleep", "throw", "del", "nested", "innerThrow"]) G[k] = pick(true);
const caller = pick(false);
const src = vm.newObject(tree.getType("/datum"));
const victim = vm.newObject(tree.getType("/datum"));
rt.override(G.ret, function* (f) { return 42; }, true);
rt.override(G.sleep, function* (f) { yield* g.call(f, SLEEP, null, [1]); R("woke:sleeper"); return 7; }, true);
rt.override(G.throw, function* (f) { f.dot = 3; rt.callName(f, null, "boom", []); return 1; }, true);
rt.override(G.del, function* (f) { f.dot = 5; yield* g.del(f, rt.live(f.src)); R("not reached"); return 6; }, true);
rt.override(G.nested, function* (f) { const v = yield* g.call(f, G.sleep, null, []); R("woke:nested " + v); return 8; }, true);
rt.override(G.innerThrow, function* (f) { yield* g.call(f, G.throw, null, []); return 2; }, true);
rt.override(caller, function (f) {
	R("ret:" + rt.call(f, G.ret, null, []));
	R("sleep:" + rt.call(f, G.sleep, null, []));
	rt.tryOpen(f);
	try {
		rt.call(f, G.throw, null, []);
		rt.tryClose(f);
		R("no throw");
	} catch (e) {
		const v = rt.catchValue(f, e);
		R("caught:" + (v?.getVar?.("name") ?? v));
	}
	R("uncaught:" + (rt.call(f, G.throw, null, []) + 6));
	R("del:" + rt.call(f, G.del, victim, []));
	R("after-del-src:" + (victim.deleted ? 1 : 0));
	R("nested:" + rt.call(f, G.nested, null, []));
	rt.tryOpen(f);
	try {
		R("inner-throw:" + rt.call(f, G.innerThrow, null, []));
		rt.tryClose(f);
	} catch (e) {
		const v = rt.catchValue(f, e);
		R("inner-throw-caught:" + (v?.getVar?.("name") ?? v));
	}
	return 1;
}, false);
// A New() that sleeps, called by `new` from a plain proc (translated callers of such a New are generators): must throw, not run on silently.
const newType = (() => { for (const t of tree.types.values?.() ?? []) { const n = t.procs.get("New"); if (n && !n.isNative && n.argNames.length === 0 && n.path.startsWith("/obj/") && !used.has(n)) return { t, n }; } return null; })();
if (!newType) throw new Error("no type with a 0-arg New to take over");
used.add(newType.n);
rt.override(newType.n, function* (f) { yield* g.call(f, SLEEP, null, [1]); return null; }, true);
const newCaller = pick(false);
rt.override(newCaller, function (f) {
	rt.new_(f, newType.t, []);
	return 1;
}, false);
vm.call(caller, [], src);
try { vm.call(newCaller, [], src); R("new-sleep-throws:0"); } catch (e) { R("new-sleep-throws:" + (/slept under a plain proc's new/.test(e.message) ? 1 : "other " + e.message)); }
for (let i = 0; i < 5; i++) vm.runTick();
for (const l of out) console.log(l);
