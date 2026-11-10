// dt-rules.test.mjs - the number and error rules game code runs on since detranslate step 3:
// numbers are plain JS doubles (no float32 rounding, in the maths, the natives, var defaults or text2num), true/false is
// JS's (NaN is false), and a JS error from game code (`o.health` with o null) is a tg runtime error: logged, that proc
// ends with its `.`, the caller goes on. No boot: the game's types, procs taken over with hand-written bodies.
// Usage (from web/, env loaded, after `npx tsc -p .` and `node tools/translate-tg.mjs`): node tests/dt-rules.test.mjs
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const web = resolve(import.meta.dirname, "..");
const imp = (p) => import(pathToFileURL(resolve(web, p)).href);
const { loadGame } = await imp("build/dist/src/tools/game-tree.js");
const { VM } = await imp("build/dist/src/vm/interpreter.js");
const rt = await imp("build/dist/src/translate/runtime.js");
const { g, P } = rt;
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
const same = (what, got, want) => ok(what, Object.is(got, want), `got ${got}, want ${want}`);

// ---- 1. numbers are doubles --------------------------------------------------------------------------
same("0.1 + 0.2", rt.add(0.1, 0.2), 0.1 + 0.2);
same("1 - 0.9", rt.subtract(1, 0.9), 1 - 0.9);
same("null - 0.1", rt.subtract(null, 0.1), -0.1);
same("0.1 * 3", rt.multiply(0.1, 3), 0.1 * 3);
same("1 / 3", rt.divide(1, 3), 1 / 3);
same("2 ** 0.5", rt.power(2, 0.5), Math.SQRT2);
same("-0.1", rt.neg(0.1), -0.1);
same("0.1++", rt.inc(0.1, 1), 1.1);
same("16777217 (past float32's whole numbers)", rt.add(16777216, 1), 16777217);
same("a var default 0.1", tree.getType("/obj/item/clothing/mask/breath").vars.get("gas_transfer_coefficient"), 0.1);

// ---- 2. true/false is JavaScript's ---------------------------------------------------------------------
for (const [v, want] of [[NaN, false], [0, false], [-0, false], [null, false], ["", false], [0.1, true], [-1, true], ["0", true], [Infinity, true]])
	same(`truthy(${typeof v === "string" ? JSON.stringify(v) : v})`, rt.truthy(v), want);

// ---- 3. the natives, and a JS error in game code is a tg runtime error ------------------------------------
const used = new Set();
const proc = (gen, body) => {
	for (const p of tree.procs) {
		if (p.isNative || p.argNames.length !== 0 || used.has(p) || !p.path.startsWith("/obj/") || p.attributes & (1 << 5)) continue; // 1 << 5: waitfor = 0
		try { rt.override(p, body, gen); used.add(p); return p; } catch { /* other kind */ }
	}
	throw new Error("no proc to take over");
};
const C = vm.newObject(tree.getType("/datum/callback"));
{
	const seen = {};
	vm.call(proc(false, function (f) {
		seen.sqrt = rt.op(f, "Sqrt", [], [2]);
		seen.sin = rt.op(f, "Sin", [], [30]);
		seen.text2num = rt.call(f, P("/proc/text2num"), null, ["0.1"]);
		seen.round = rt.call(f, P("/proc/round"), null, [0.35, 0.1]);
		return 1;
	}), [], C);
	same("sqrt(2)", seen.sqrt, Math.SQRT2);
	same("sin(30)", seen.sin, Math.sin(Math.PI / 6));
	same("text2num(\"0.1\")", seen.text2num, 0.1);
	same("round(0.35, 0.1)", seen.round, Math.floor(0.35 / 0.1 + 0.5) * 0.1);
}
{
	const seen = {};
	const nothing = () => null; // what an empty var gives
	const readPlain = proc(false, function (f) { f.dot = 3; seen.x = nothing().health; seen.afterRead = true; return 4; });
	const writePlain = proc(false, function (f) { f.dot = 5; nothing().health = 1; seen.afterWrite = true; return 6; });
	const callPlain = proc(false, function (f) { f.dot = 7; nothing()(); seen.afterCall = true; return 8; });
	const readGen = proc(true, function* (f) { f.dot = 9; yield* g.call(f, P("/proc/sleep"), null, [0]); seen.y = nothing().health; seen.afterGen = true; return 10; });
	const outer = proc(true, function* (f) {
		seen.read = rt.call(f, readPlain, C, []);
		seen.write = rt.call(f, writePlain, C, []);
		seen.call = rt.call(f, callPlain, C, []);
		seen.gen = yield* g.call(f, readGen, C, []);
		seen.outerReached = true;
		return 11;
	});
	vm.call(outer, [], C);
	for (let i = 0; i < 5 && !seen.outerReached; i++) vm.runTick(); // the sleep(0)
	for (const [k, want] of Object.entries({ read: 3, write: 5, call: 7, gen: 9, outerReached: true }))
		same(`JS error: ${k}`, seen[k], want);
	for (const k of ["afterRead", "afterWrite", "afterCall", "afterGen"]) ok(`JS error: ${k} never runs`, !(k in seen));
	const want = ["Cannot read null.health", "Cannot modify null.health", "nothing(...) is not a function", "Cannot read null.health"];
	ok("JS error: logged as runtimes", errors.join("; ") === want.join("; "), `got [${errors.join("; ")}]`);
	errors.length = 0;
}

console.log(failures ? `dt-rules: ${failures} of ${checks} FAILED` : `dt-rules: OK (${checks} checks)`);
process.exit(failures ? 1 : 0);
