// dt-vars.test.mjs - translate-tg writes each proc's `f.vars` list (plans/archive/detranslate.md step 7b, tools/translate-tg.mjs varsCut):
// the arguments the body assigns and every top-level declaration, right after the last declaration, lines and columns kept;
// nothing when there is nothing to list; a hand-written `f.vars` in game code stops the bundle (it would hide a forgotten local).
// Usage (from web/, env loaded): node tests/dt-vars.test.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const web = resolve(import.meta.dirname, ".."), dir = mkdtempSync(join(tmpdir(), "dt-vars-"));
let failures = 0;
const check = (name, ok, got) => { if (!ok) { failures++; console.log(`FAIL ${name}: ${got}`); } };
const head = `import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { g } = rt;
`;
const bundle = (src) => {
	writeFileSync(join(dir, "in.ts"), head + src);
	execFileSync(process.execPath, ["tools/translate-tg.mjs", "--hot", join(dir, "out.json"), `code/zz_dtvars.ts=${join(dir, "in.ts")}`], { cwd: web, stdio: "pipe" });
	return JSON.parse(readFileSync(join(dir, "out.json"), "utf8"))[0].body.split("\n").slice(3);
};

const lines = bundle(`rt.def("/obj/zz/proc/a", function* a(f: Frame, keep: Value, M: Value) {
	let x: Value = null, $e: any;
	if (M === null) M = 1;
	yield* g.srcCall(f, "b", keep, M, x);
	for ($e of [1]) x = $e;
	if (x) { const inner = 1; x = inner; }
}, true);
rt.def("/obj/zz/proc/b", function b(f: Frame, n: Value) {
	return n;
});
rt.def("/obj/zz/proc/c", function c(f: Frame, n: Value) {
	n = 2;
	const late = n;
	return late;
});
rt.tail("zz.d", function* (f: Frame, n: Value) {
	n++;
	return n;
});`);
check("locals and assigned args, after the last declaration", lines[1] === "\tlet x        = null, $e     ; f.vars = () => [M, x, $e];", JSON.stringify(lines[1]));
check("nothing to list: no f.vars", !lines.slice(7, 10).join("\n").includes("f.vars"), lines.slice(7, 10).join(" | "));
check("a declaration after a statement: the list goes after it", lines[12] === "\tconst late = n; f.vars = () => [n, late];" && lines[11] === "\tn = 2;", JSON.stringify(lines.slice(11, 13)));
check("no declarations: after the first line", lines[15] === "rt.tail(\"zz.d\", function* (f       , n       ) { f.vars = () => [n];", JSON.stringify(lines[15]));
check("same line count", lines.length === 19, lines.length);

let stopped = "";
try { bundle(`rt.def("/obj/zz/proc/e", function e(f: Frame, n: Value) {\n\tf.vars = () => [n];\n\treturn n;\n});`); } catch (e) { stopped = String(e.stderr); }
check("a hand-written f.vars stops the bundle", /zz_dtvars\.ts:5: .*f\.vars/.test(stopped), stopped.split("\n").find((l) => l.includes("Error")) ?? stopped.slice(0, 200));

rmSync(dir, { recursive: true, force: true });
console.log(failures ? `dt-vars: ${failures} FAILED` : "dt-vars: OK");
process.exit(failures ? 1 : 0);
