// dt-calls.test.mjs - Proc calls, DM vars, operators, built-ins, text, yield*, globals, list loops, equality, list(), new_() and named arguments written by hand (plans/archive/detranslate.md steps 8, 9a-k, 10a): the bundler (tools/translate-tg.mjs
// lowerCall, lowerVar, lowerOp, lowerBuiltin, lowerTemplate, lowerGlobal, lowerEach) turns each into the engine call the translator wrote, leaves JS ones alone, and stops on one it can't make right.
// Usage (from web/, env loaded): node tests/dt-calls.test.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const web = resolve(import.meta.dirname, ".."), tmp = mkdtempSync(join(tmpdir(), "dt-calls-"));
let failures = 0;
const fail = (m) => { failures++; console.log(`FAIL ${m}`); };
const HEAD = 'import * as rt from "../../build/dist/src/translate/runtime.js";\nimport type { Value, Frame } from "../../build/dist/src/translate/runtime.js";\nconst { T, P, g } = rt;\n'; // (Value, Frame: not the standard head, so the file's own short name list counts, not the full one)
/** the bundle text of a fixture game file (null and the error if the bundler stopped) */
function lower(body) {
	const file = join(tmp, "fixture.ts"), out = join(tmp, "out.json");
	writeFileSync(file, HEAD + body);
	try {
		execFileSync(process.execPath, ["tools/translate-tg.mjs", "--hot", out, `code/zz_dt_calls.ts=${file}`], { cwd: web, stdio: ["ignore", "pipe", "pipe"] });
	} catch (e) {
		return { text: null, err: String(e.stderr) };
	}
	return { text: JSON.parse(readFileSync(out, "utf8"))[0].body, err: null, lines: (HEAD + body).replace(/\n$/, "").split("\n").length };
}

// 1. each kind, plain and generator, as the translator spelled it (the sites' and $P tables go on the import line)
const ok = lower(`
const TOP = { powered: () => 1 };
rt.def("/obj/zz/proc/plain", function plain(f: Frame, A: Value) {
	A.powered(1, A.use_power());
	this.powered(2);
	get_area(this);
	parent_proc();
	parent_proc(3);
	rt.fv(f, "loc", A).powered();
	(A || this).powered();
	return f.dot;
});
rt.def("/obj/zz/proc/gen", function* gen(f: Frame, A: Value) {
	yield* A.powered(1);
	yield* this.powered();
	yield* this.powered(2, 3);
	f.dot = (yield* get_dist(A, this));
	return (yield* parent_proc());
}, true);
rt.def("/obj/zz/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	return f.dot;
});
rt.def("/obj/zz/proc/js", function js(f: Frame, L: Value) {
	let ckey: Value = null;
	ckey(1);
	return L.notAProcName();
});
rt.def("/obj/zz/proc/js2", function js2(f: Frame, L: Value) {
	ckey(L);
	L.slice(0);
	Math.floor(2.5);
	rt.R.glob(1);
	TOP.powered();
	return L.notAProcName();
});
`);
const want = [
	'$M.s0(f, A, "powered", [1, $M.s1(f, A, "use_power", [])]);',
	'$M.s2(f, "powered", [2]);',
	"rt.call(f, $P[0], null, [this]);",
	"rt.callSuper(f, [], rt.Args.Same);",
	"rt.callSuper(f, [3]);",
	'$M.s3(f, $g(f,$q[0],     A), "powered", []);',
	'$M.s4(f, (A || this), "powered", []);',
	'yield* $.s0(f, A, "powered", [1]);',
	'yield* $.s1(f, "powered");',
	'yield* $.s2(f, "powered", 2, 3);',
	"f.dot = (yield* g.call(f, $P[1], null, [A, this]));",
	"return (yield* g.callSuper(f, [], rt.Args.Same));",
	"\trt.callSuper(f, []);",
	"\tckey(1);", "rt.call(f, $P[2], null, [L]);", "\tL.slice(0);", "\tMath.floor(2.5);", "\trt.R.glob(1);", "\tTOP.powered();", "\treturn L.notAProcName();",
	'const $P = rt.procTable("code/zz_dt_calls.ts", ["/proc/get_area","/proc/get_dist","/proc/ckey"]);',
	'const $ = {s0: rt.methodSite("n"), s1: rt.methodSite("t"), s2: rt.methodSite("t")};',
	'const $M = {s0: rt.methodSite("N"), s1: rt.methodSite("N"), s2: rt.methodSite("S"), s3: rt.methodSite("N"), s4: rt.methodSite("N")};',
];
if (ok.err) fail(`the bundler stopped on good calls: ${ok.err}`);
else for (const w of want) if (!ok.text.includes(w)) fail(`missing from the bundle: ${w}`);
// lines stay where they were (errors find their game line by it)
if (ok.text && ok.text.split("\n").length !== ok.lines) fail(`line count changed: ${ok.text.split("\n").length} lines, not ${ok.lines}`);

// 2. calls it must refuse
const bad = [
	["a call that can pause, in a function* without yield*", 'rt.def("/obj/zz/proc/x", function* x(f: Frame, A: Value) {\n\tA.attack_hand();\n}, true);\n', "can pause"],
	["this.x() in a nested function", 'rt.def("/obj/zz/proc/x", function x(f: Frame) {\n\tconst h = function () { return this.powered(); };\n\treturn h;\n});\n', "nested function"],
	["a call outside a proc", "const q = (A) => A.powered();\n", "outside rt.def"],
	["a name split from its receiver", 'rt.def("/obj/zz/proc/x", function x(f: Frame, A: Value) {\n\treturn A\n\t\t.powered();\n});\n', "receiver's line"],
];
for (const [what, body, msg] of bad) {
	const r = lower(body);
	if (r.err === null) fail(`${what}: bundled without an error`);
	else if (!r.err.includes(msg)) fail(`${what}: stopped with another error: ${r.err.slice(0, 200)}`);
}
// 3. DM vars (step 9a): reads and `=` on an object, this.loc (a DM var that isn't a property), on a call's receiver, on f.usr; JS ones stay
const vars = lower(`
const TOP = { health: 1 };
rt.def("/obj/zz/proc/vars", function vars(f: Frame, A: Value) {
	A.health = A.loc.name;
	this.loc = A.loc;
	f.dot = this.loc;
	A.loc.powered();
	f.usr.health = 1;
	TOP.health = A.length;
	return A.contents;
});
rt.def("/obj/zz/proc/vgen", function* vgen(f: Frame, A: Value) {
	(yield* A.powered()).charge = 2;
	return this.health;
}, true);
`);
const wantVars = [
	"\t$F(f,$q[0],A, $g(f,$q[1],$g(f,$q[2],A)));", "\t$s(f,$q[3],$g(f,$q[4],A));", "\tf.dot = $v(f,$q[5]);", '\t$M.s0(f, $g(f,$q[6],A), "powered", []);',
	"\t$F(f,$q[7],f.usr, 1);", "\tTOP.health = A.length;", "\treturn $g(f,$q[8],A);", '\t$F(f,$q[9],(yield* $.s0(f, A, "powered", [])), 2);', "\treturn this.health;",
	'$q = rt.fieldICs(["health", "name", "loc", "loc", "loc", "loc", "loc", "health", "contents", "charge"]);',
];
if (vars.err) fail(`the bundler stopped on good vars: ${vars.err}`);
else for (const w of wantVars) if (!vars.text.includes(w)) fail(`missing from the bundle: ${w}`);
if (vars.text && vars.text.split("\n").length !== vars.lines) fail(`vars: line count changed: ${vars.text.split("\n").length} lines, not ${vars.lines}`);

// 4. var uses it must refuse
const proc = (b) => `rt.def("/obj/zz/proc/x", function x(f: Frame, A: Value) {\n\t${b}\n});\n`;
const badVars = [
	["a DM var's &&=", proc("A.health &&= 1;"), "other than by `=`"],
	["delete of a DM var", proc("delete A.health;"), "other than by `=`"],
	["this.loc in a nested function", proc("const h = function () { return this.loc; };"), "nested function"],
	["this.loc in a file that assigns f.src", proc("f.src = A;\n\treturn this.loc;"), "assigns f.src"],
];
// the f.src rule is the proc's (or its tails'), not the file's: a neighbour that assigns f.src doesn't stop this.loc here
{
	const two = lower(proc("f.src = A;\n\treturn A.loc;") + proc("return this.loc;").replace("/proc/x", "/proc/y").replace("function x", "function y"));
	if (two.err) fail(`this.loc beside a proc that assigns f.src: stopped: ${two.err.slice(0, 200)}`);
	const tl = (owner) => proc(owner) + `rt.tail("/obj/zz/proc/x: spawn at x.dm:1", function* (f: Frame) {\n\treturn this.loc;\n});\n`;
	const own = lower(tl("f.src = A;\n\treturn null;"));
	if (own.err === null || !own.err.includes("assigns f.src")) fail(`this.loc in a tail whose proc assigns f.src: ${own.err}`);
	const ok = lower(tl("return null;"));
	if (ok.err) fail(`this.loc in a tail whose proc keeps src: stopped: ${ok.err.slice(0, 200)}`);
}
for (const [what, body, msg] of badVars) {
	const r = lower(body);
	if (r.err === null) fail(`${what}: bundled without an error`);
	else if (!r.err.includes(msg)) fail(`${what}: stopped with another error: ${r.err.slice(0, 200)}`);
}
// 5. DM operators (step 9b): in a proc every arithmetic and comparison operator, -x, op= and ++ are DM's calls (the file's bare
// alias where it has one the proc doesn't shadow); constants and a file helper's operators stay JS
const ops = lower(`
const { add, subtract, multiply, divide } = rt;
const half = (x) => x / 2 + 1;
rt.def("/obj/zz/proc/ops", function ops(f: Frame, A: Value, B: Value) {
	let i = 0;
	f.dot = (A + B) * 2 - -B / 3 % 4;
	if (A < B && A <= 1 || A > -1 && B >= -Infinity) i++;
	i += A ** 2;
	this.health -= 1;
	A.health *= 2;
	this.health++;
	--A.health;
	f.dot = [++i, this.health--];
	for (let j = 0; j < 3; j++) i /= 2;
	return f.dot;
});
rt.def("/obj/zz/proc/shadow", function shadow(f: Frame, i: Value) {
	const add = 5;
	return add + i;
});
`);
const wantOps = [
	"const half = (x) => x / 2 + 1;",
	"\tf.dot = subtract(multiply((add(A , B)) , 2) , rt.modulus(divide(rt.neg(B) , 3) , 4));",
	"\tif (rt.lt(A , B) && rt.le(A , 1) || rt.gt(A , -1) && rt.ge(B , -Infinity)) i = rt.inc(i, 1);",
	"\ti = rt.modify(i, rt.power(A , 2), add);", '\trt.modSrcVar(f, "health", 1, subtract);', '\trt.modField(f, A, "health", 2, multiply);',
	'\trt.incSrcVar(f, "health", 1, true);', '\trt.incField(f, A, "health", -1, false);', '\tf.dot = [(i = rt.inc(i, 1)), rt.incSrcVar(f, "health", -1, true)];',
	"\tfor (let j = 0; rt.lt(j , 3); j = rt.inc(j, 1)) i = rt.modify(i, 2, divide);", "\treturn rt.add(add , i);",
];
if (ops.err) fail(`the bundler stopped on good operators: ${ops.err}`);
else for (const w of wantOps) if (!ops.text.includes(w)) fail(`missing from the bundle: ${w}`);
if (ops.text && ops.text.split("\n").length !== ops.lines) fail(`ops: line count changed: ${ops.text.split("\n").length} lines, not ${ops.lines}`);
// 6. operators it must refuse
const badOps = [
	["a plain bit operator", proc("return A | 1;"), "plain bit operator"],
	["a plain ~", proc("return ~A;"), "plain ~"],
	["a local's x++ used as a value", proc("let i = 0;\n\treturn i++;"), "used as a value"],
	["op= on a JS element", proc("const L = [1];\n\tL[0] += 1;"), "other than a local"],
	["this.x += in a nested function", proc("const h = function () { this.health += 1; };"), "nested function"],
	["this.x++ in a file that assigns f.src", proc("f.src = A;\n\tthis.health++;"), "assigns f.src"],
];
for (const [what, body, msg] of badOps) {
	const r = lower(body);
	if (r.err === null) fail(`${what}: bundled without an error`);
	else if (!r.err.includes(msg)) fail(`${what}: stopped with another error: ${r.err.slice(0, 200)}`);
}
// 7. DM built-ins (step 9c): prob() and pick() in a proc are rt.op's; a name the file binds stays JS
const bi = lower(`
const pick = (L) => L[0];
rt.def("/obj/zz/proc/bi", function bi(f: Frame, A: Value, B: Value) {
	if (prob(50 + A)) return pick([A]);
	return f.dot;
});
`);
const bi2 = lower(`
rt.def("/obj/zz/proc/bi2", function* bi2(f: Frame, A: Value, B: Value) {
	return pick(A, (yield* B.powered()), prob(5));
}, true);
`);
const wantBi = [[bi, '\tif (rt.op(f, "Prob", [], [rt.add(50 , A)])) return pick([A]);'], [bi2, '\treturn rt.op(f, "PickUnweighted", [3], [A, (yield* $.s0(f, B, "powered", [])), rt.op(f, "Prob", [], [5])]);']];
for (const [r, w] of wantBi) {
	if (r.err) fail(`the bundler stopped on good built-ins: ${r.err}`);
	else if (!r.text.includes(w)) fail(`missing from the bundle: ${w}`);
}
const badBi = [
	["prob() under yield*", 'rt.def("/obj/zz/proc/x", function* x(f: Frame) {\n\treturn yield* prob(5);\n}, true);\n', "never waits"],
	["pick() with a spread", proc("return pick(...A);"), "spread"],
	["prob() outside a proc", "const q = (A) => prob(A);\n", "outside rt.def"],
	["prob() with two arguments", proc("return prob(1, 2);"), "2 arguments"],
];
for (const [what, body, msg] of badBi) {
	const r = lower(body);
	if (r.err === null) fail(`${what}: bundled without an error`);
	else if (!r.err.includes(msg)) fail(`${what}: stopped with another error: ${r.err.slice(0, 200)}`);
}
// 8. DM text (step 9d): a template string in a proc is fmt's; a file helper's and a tagged one stay JS; line breaks stay
const tx = lower(`
const { fmt } = rt;
const label = (a) => \`\${a}!\`;
rt.def("/obj/zz/proc/tx", function tx(f: Frame, A: Value, B: Value) {
	f.dot = \`<b>\${A}</b> "hits" \${B + 1}\\n\`;
	f.dot = String.raw\`a\${A}\`;
	return \`\${A}
\${B}\`;
});
`);
// (the bundle writes characters above U+00FF as \u escapes)
const wantTx = ["const label = (a) => `${a}!`;", '\tf.dot = fmt("<b>\\uff00</b> \\"hits\\" \\uff00\\n", [A, rt.add(B , 1)]);', "\tf.dot = String.raw`a${A}`;", '\treturn fmt("\\uff00\\n\\uff00", [A, \n', "B]);"];
if (tx.err) fail(`the bundler stopped on good text: ${tx.err}`);
else for (const w of wantTx) if (!tx.text.includes(w)) fail(`missing from the bundle: ${w}`);
if (tx.text && tx.text.split("\n").length !== tx.lines) fail(`text: line count changed: ${tx.text.split("\n").length} lines, not ${tx.lines}`);
const badTx = [["a macro character in a template", proc("return `${A}％`;"), "macro character"]];
for (const [what, body, msg] of badTx) {
	const r = lower(body);
	if (r.err === null) fail(`${what}: bundled without an error`);
	else if (!r.err.includes(msg)) fail(`${what}: stopped with another error: ${r.err.slice(0, 200)}`);
}
// 9. yield* (step 9f): in a function* a call that can't pause needs none; the bundle adds it (parenthesized but as a statement)
const yl = lower(`
rt.def("/obj/zz/proc/yl", function* yl(f: Frame, A: Value) {
	A.powered(1);
	f.dot = get_dist(A, this);
	return A.powered() + 1;
}, true);
`);
const wantYl = ['\tyield* $.s0(f, A, "powered", [1]);', "\tf.dot = (yield* g.call(f, $P[0], null, [A, this]));", '\treturn rt.add((yield* $.s1(f, A, "powered", [])) , 1);'];
if (yl.err) fail(`the bundler stopped on calls that can't pause: ${yl.err}`);
else for (const w of wantYl) if (!yl.text.includes(w)) fail(`missing from the bundle: ${w}`);
// the built-ins that can pause are the ones whose native requests a sleep or a prompt
{
	const { NATIVE_WAITS } = await import("../tools/proc-calls.mjs");
	const found = new Set();
	for (const f of ["natives.ts", "natives-io.ts", "natives-misc.ts", "natives-text.ts", "natives-world.ts", "clients.ts"]) {
		const t = readFileSync(join(web, "src/vm", f), "utf8"), at = [...t.matchAll(/def\("([^"]+)"/g)];
		at.forEach((m, i) => { if (/requestSleep|roundTrip\(\)|this\.alert\(/.test(t.slice(m.index, at[i + 1]?.index ?? m.index + 3000))) found.add(m[1]); });
	}
	const want = [...found].sort().join(", "), have = [...NATIVE_WAITS].sort().join(", ");
	if (want !== have) fail(`NATIVE_WAITS in tools/proc-calls.mjs is ${have}, but the natives that pause are ${want}`);
}
// 10. DM globals (step 9g): GLOB.name in a proc is the global's rt.gl / setGl / modGl / incGl lowering; a GLOB the proc binds is its own
const { globalKeys } = await import("../tools/globals-table.mjs");
const gk = (n) => globalKeys().index.get(n);
const gl = lower(`
rt.def("/obj/zz/proc/gl", function gl(f: Frame, A: Value) {
	GLOB.player_list = A;
	GLOB.player_list += A;
	GLOB.player_list -= A;
	GLOB.round_id++;
	--GLOB.round_id;
	GLOB.SSair.add_to_active(A);
	f.dot = GLOB.config.githuburl;
	return GLOB.player_list;
});
rt.def("/obj/zz/proc/glown", function glown(f: Frame, GLOB: Value) {
	return GLOB.player_list;
});
`);
const [pl, ri] = [gk("player_list"), gk("round_id")];
const wantGl = [`\t$sl(${pl}, A);`, `\t$ml(${pl}, A, rt.add);`, `\t$ml(${pl}, A, rt.subtract);`, `\t$il(${ri}, 1, true);`, `\t$il(${ri}, -1, false);`,
	`\t$M.s0(f, $gl(${gk("SSair")}), "add_to_active", [A]);`, `\tf.dot = $g(f,$q[0],$gl(${gk("config")}));`, `\treturn $gl(${pl});`, "const $gl = rt.glob, $sl = rt.setGlob"];
if (gl.err) fail(`the bundler stopped on good globals: ${gl.err}`);
else {
	for (const w of wantGl) if (!gl.text.includes(w)) fail(`missing from the bundle: ${w}`);
	if (gl.text.split("\n").length !== gl.lines) fail(`globals: line count changed: ${gl.text.split("\n").length} lines, not ${gl.lines}`);
	if (/glown[^]*\$gl\(/.test(gl.text)) fail("a GLOB the proc binds was lowered as DM's globals");
}
const badGl = [
	["delete of a global", proc("delete GLOB.player_list;"), "other than by `=`"],
	["a global's &&=", proc("GLOB.player_list &&= 1;"), "other than by `=`"],
	["no such global", proc("return GLOB.zz_no_such_global;"), "no such global"],
	["GLOB outside a proc", "const q = () => GLOB.player_list;\n", "outside rt.def"],
];
for (const [what, body, msg] of badGl) {
	const r = lower(body);
	if (r.err === null) fail(`${what}: bundled without an error`);
	else if (!r.err.includes(msg)) fail(`${what}: stopped with another error: ${r.err.slice(0, 200)}`);
}
// 11. list loops (step 9h): for (M of each(L, T)) in a proc is the translator's forList / next / endFor on its lines; its slot is one
// past the loops around it (plain or translated); the proc gets `let $e;` before f.vars unless it declares one
const lp = lower(`
rt.def("/obj/zz/proc/loops", function loops(f: Frame, L: Value) {
	let M: Value = null, O: Value = null;
	for (M of each(L, T("/mob"))) {
		for (O of each(M.contents)) {
			O.powered();
		}
	}
	return f.dot;
});
rt.def("/obj/zz/proc/loopsown", function loopsown(f: Frame, L: Value) {
	let M: Value = null, O: Value = null;
	let $e: any;
	rt.forList(f, 0, L);
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		for (O of each(M.contents)) {
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
`);
const wantLp = ["\tlet M = null, O = null; let $e; f.vars = () => [M, O, $e];", '\trt.forList(f, 0, L, T("/mob")); while (($e = rt.next(f, 0)) !== undefined) { M = $e;',
	"\t\trt.forList(f, 1, $g(f,$q[0],M)); while (($e = rt.next(f, 1)) !== undefined) { O = $e;", "\t\t} rt.endFor(f, 1);", "\t} rt.endFor(f, 0);",
	"\tlet $e ; f.vars = () => [M, O, $e];", "\t\trt.forList(f, 1, $g(f,$q[1],M)); while (($e = rt.next(f, 1)) !== undefined) { O = $e;"];
if (lp.err) fail(`the bundler stopped on good loops: ${lp.err}`);
else {
	const flat = lp.text.replace(/[ \t]+/g, " ").replace(/^ /gm, "\t");
	for (const w of wantLp) if (!flat.includes(w.replace(/[ \t]+/g, " ").replace(/^ /gm, "\t"))) fail(`missing from the bundle: ${w}`);
	if (lp.text.split("\n").length !== lp.lines) fail(`loops: line count changed: ${lp.text.split("\n").length} lines, not ${lp.lines}`);
	if ((lp.text.split("function loopsown")[1].match(/let \$e/g) ?? []).length !== 1) fail("a proc that declares $e got another one");
}
const lproc = (b) => `rt.def("/obj/zz/proc/x", function x(f: Frame, L: Value) {\n\tlet M: Value = null;\n\t${b}\n});\n`;
const badLp = [
	["a const loop variable", lproc("for (const N of each(L)) {\n\t}"), "declared at the top"],
	["a loop in a nested function", lproc("const h = () => { for (M of each(L)) {} };"), "nested function"],
	["each() not as a loop's list", lproc("return each(L);"), "for...of loop's list"],
	["a loop body that isn't a block", lproc("for (M of each(L)) M.powered();"), "{ block }"],
];
for (const [what, body, msg] of badLp) {
	const r = lower(body);
	if (r.err === null) fail(`${what}: bundled without an error`);
	else if (!r.err.includes(msg)) fail(`${what}: stopped with another error: ${r.err.slice(0, 200)}`);
}
// 12. equality (step 9i): in a proc `==` is isEqual(a, b), `!=` is !isEqual(a, b); `===` and `!==` stay JavaScript's
const eq = lower(`
rt.def("/obj/zz/proc/eq", function eq(f: Frame, A: Value) {
	if (A.loc == this.loc) return 1;
	if (A != null && A === this) return 2;
	return (A == 1) == (A != 2);
});
`);
const wantEq = ["\tif (rt.isEqual($g(f,$q[0],A) , $v(f,$q[1]))) return 1;", "\tif (!rt.isEqual(A , null) && A === this) return 2;", "\treturn rt.isEqual((rt.isEqual(A , 1)) , (!rt.isEqual(A , 2)));"];
if (eq.err) fail(`the bundler stopped on good equality: ${eq.err}`);
else for (const w of wantEq) if (!eq.text.includes(w)) fail(`missing from the bundle: ${w}`);
// 13. list() (step 9j): in a proc list(a, b) is rt.list(a, b); a parameter named list stays the proc's own
const ls = lower(`
rt.def("/obj/zz/proc/ls", function ls(f: Frame, A: Value) {
	return list(1, list(A));
});
rt.def("/obj/zz/proc/lsown", function lsown(f: Frame, list: Value) {
	return list(2);
});
`);
const wantLs = ["\treturn rt.list(1, rt.list(A));", "\treturn list(2);"];
if (ls.err) fail(`the bundler stopped on good lists: ${ls.err}`);
else for (const w of wantLs) if (!ls.text.includes(w)) fail(`missing from the bundle: ${w}`);
// 14. new_ (step 9k): new_(T, a, b) in a proc is rt.new_(f, T, [a, b]); under yield* g.new_
const nw = lower(`
rt.def("/obj/zz/proc/nw", function nw(f: Frame, A: Value) {
	A = new_(T("/obj/item"), this.loc, 2);
	return new_(A);
});
rt.def("/obj/zz/proc/nwgen", function* nwgen(f: Frame, A: Value) {
	return (yield* new_(T("/obj/item"), A));
}, true);
`);
const wantNw = ['\tA = rt.new_(f, T("/obj/item"), [ $v(f,$q[0]), 2]);', "\treturn rt.new_(f, A, []);", '\treturn (yield* g.new_(f, T("/obj/item"), [ A]));'];
if (nw.err) fail(`the bundler stopped on good new_ calls: ${nw.err}`);
else for (const w of wantNw) if (!nw.text.includes(w)) fail(`missing from the bundle: ${w}`);
if (!lower(proc("return new_(T(\"/obj/item\"), ...A);")).err?.includes("without ...spread")) fail("new_ with ...spread: bundled without the error");
// 15. named arguments (step 10a): a last `{ key: value }` is the old call's `"key", value` pairs and rt.Args.Named
const nm = lower(`
rt.def("/obj/zz/proc/nm", function nm(f: Frame, A: Value) {
	A.powered(1, { dir: 2, "icon_state": "x" });
	this.powered({ forced: 1 });
	get_dist(A, { k: this });
	parent_proc(3, { k: 4 });
	A = new_(T("/obj/item"), this.loc, { name: "x" });
	return f.dot;
});
rt.def("/obj/zz/proc/nmgen", function* nmgen(f: Frame, A: Value) {
	yield* A.powered({ k: 1 });
	yield* this.powered(2, { k: 1 });
	return (yield* get_dist(A, { k: this }));
}, true);
`);
const wantNm = ['"powered", [null, 1, "dir", 2, "icon_state", "x"], rt.Args.Named);', '"powered", ["forced", 1], rt.Args.Named);', "null, [null, A, \"k\", this], rt.Args.Named);",
	"rt.callSuper(f, [null, 3, \"k\", 4], rt.Args.Named);", '[ null, $v(f,$q[0]), "name", "x"], rt.Args.Named);', 'yield* $.s0(f, A, "powered", ["k", 1], rt.Args.Named);',
	'yield* $.s1(f, "powered", [null, 2, "k", 1], rt.Args.Named);', "return (yield* g.call(f, $P[0], null, [null, A, \"k\", this], rt.Args.Named)"];
if (nm.err) fail(`the bundler stopped on good named arguments: ${nm.err}`);
else {
	for (const w of wantNm) if (!nm.text.includes(w)) fail(`missing from the bundle: ${w}`);
	if (nm.text.split("\n").length !== nm.lines) fail("named arguments: line count changed");
}
const badNm = [
	["a spread in the object", "return A.powered({ ...A });", "plain `key: value`"],
	["a computed key", "return A.powered({ [A]: 1 });", "plain `key: value`"],
	["a shorthand key", "return A.powered({ A });", "plain `key: value`"],
	["a method", "return A.powered({ k() { return 1; } });", "plain `key: value`"],
	["an empty object", "return A.powered({});", "plain `key: value`"],
	["an object that isn't last", "return A.powered({ k: 1 }, 2);", "must be the last"],
	["an object in new_ first", 'return new_({ k: 1 });', "new_(type"],
];
for (const [what, b, msg] of badNm) {
	const r = lower(proc(b));
	if (r.err === null) fail(`${what}: bundled without an error`);
	else if (!r.err.includes(msg)) fail(`${what}: stopped with another error: ${r.err.slice(0, 200)}`);
}
// 16. argument defaults (step 10c): `x ??= v;` is `if (x === null) { x = v; }` on the same line
const df = lower(`
rt.def("/obj/zz/proc/df", function df(f: Frame, A: Value, B: Value) {
	A ??= 20;
	switch (B) {
		case 1:
			B ??= A.size;
	}
	if (B) { A ??= 5; }
	return f.dot;
});
`);
const wantDf = ["\tif (A === null) { A = 20; }", "\t\t\tif (B === null) { B = A.size; }", "if (B) { if (A === null) { A = 5; } }"];
if (df.err) fail(`the bundler stopped on good argument defaults: ${df.err}`);
else {
	for (const w of wantDf) if (!df.text.includes(w)) fail(`missing from the bundle: ${w}`);
	if (df.text.split("\n").length !== df.lines) fail("argument defaults: line count changed");
}
const badDf = [
	["a property on the left", "this.x ??= 1;", "bare name"],
	["an element on the left", "A[1] ??= 1;", "bare name"],
	["used as a value", "return (A ??= 1);", "statement of its own"],
	["in a condition", "if (A ??= 1) return 1;", "statement of its own"],
	["the body of an if", "if (A) B ??= 1;", "in a block of its own"],
];
for (const [what, b, msg] of badDf) {
	const r = lower(proc(b));
	if (r.err === null) fail(`${what}: bundled without an error`);
	else if (!r.err.includes(msg)) fail(`${what}: stopped with another error: ${r.err.slice(0, 200)}`);
}
rmSync(tmp, { recursive: true, force: true });
if (failures) { console.log(`dt-calls: ${failures} failed`); process.exit(1); }
console.log(`dt-calls: ${want.length + wantVars.length + wantOps.length + wantBi.length + wantTx.length + wantYl.length + wantGl.length + wantLp.length + wantEq.length + wantLs.length + wantNw.length + wantNm.length + wantDf.length} lowered spellings, ${bad.length + badVars.length + badOps.length + badBi.length + badTx.length + badGl.length + badLp.length + badNm.length + badDf.length} refusals ok`);
