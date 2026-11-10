// dt-props.test.mjs - DM var names as properties (plans/archive/detranslate.md step 4, runtime.ts installVarProps): no name that the
// engine's object and list classes use themselves (a field, a method, also one set only on some objects) or that JS gives a
// meaning of its own becomes a property (runtime NOT_PROPS covers them all), and every other DM var name is one.
// The classes are read from src/ (every class that extends GCNode, at any depth), so a new engine field with a DM var's
// name fails here. Usage (from web/, env loaded, after `npx tsc -p .` and `node tools/translate-tg.mjs`): node tests/dt-props.test.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const web = resolve(import.meta.dirname, "..");
const imp = (p) => import(pathToFileURL(resolve(web, p)).href);
const { loadGame } = await imp("build/dist/src/tools/game-tree.js");
const { VM } = await imp("build/dist/src/vm/interpreter.js");
const { GCNode } = await imp("build/dist/src/vm/gc.js");
const rt = await imp("build/dist/src/translate/runtime.js");
const { tree, install } = await loadGame();
install(new VM(tree));

let failures = 0;
const fail = (m) => { failures++; console.log(`FAIL ${m}`); };

// member names of every GCNode class in src/: declared members, constructor parameter properties, `this.x =` writes
const classes = new Map();
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (p.endsWith(".ts")) scan(p); } };
function scan(file) {
	const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
	const visit = (n) => {
		if (ts.isClassDeclaration(n) && n.name) {
			const ext = n.heritageClauses?.find((h) => h.token === ts.SyntaxKind.ExtendsKeyword)?.types[0]?.expression.getText(sf) ?? null;
			const members = new Set();
			for (const m of n.members) {
				if (m.name && (ts.isIdentifier(m.name) || ts.isStringLiteral(m.name))) members.add(m.name.text);
				if (ts.isConstructorDeclaration(m)) for (const p of m.parameters) if (p.modifiers?.length && ts.isIdentifier(p.name)) members.add(p.name.text);
			}
			const writes = (k) => {
				if (ts.isPropertyAccessExpression(k) && k.expression.kind === ts.SyntaxKind.ThisKeyword && ts.isBinaryExpression(k.parent) && k.parent.left === k) members.add(k.name.text);
				ts.forEachChild(k, writes);
			};
			writes(n);
			classes.set(n.name.text, { ext, members });
		}
		ts.forEachChild(n, visit);
	};
	visit(sf);
}
walk(resolve(web, "src"));
const isNode = (c) => { for (let k = c, i = 0; k && i < 20; k = classes.get(k)?.ext, i++) if (k === "GCNode") return true; return false; };
const engine = new Set();
for (const [name, c] of classes) if (isNode(name)) for (const m of c.members) engine.add(m);
if (engine.size < 50) fail(`only ${engine.size} engine member names found: the class scan is broken`);
// what JS (or code duck-typing an unknown value) reads on any object
const js = ["length", "size", "next", "value", "message", "stack", "caller", "arguments", "prototype", "then", "toJSON", "constructor", ...Object.getOwnPropertyNames(Object.prototype)];

const names = new Set();
for (const t of tree.types) for (const k of t.vars.keys()) names.add(k);
for (const n of names) {
	if ((engine.has(n) || js.includes(n)) && !rt.NOT_PROPS.has(n)) fail(`DM var ${n} clashes with ${engine.has(n) ? "an engine member" : "JS"}: add it to runtime.ts NOT_PROPS`);
}
// every other name is a property (an accessor above GCNode.prototype), NOT_PROPS ones aren't
const accessor = (n) => { for (let p = Object.getPrototypeOf(GCNode.prototype); p; p = Object.getPrototypeOf(p)) { const d = Object.getOwnPropertyDescriptor(p, n); if (d) return !!d.get; } return false; };
let props = 0;
for (const n of names) {
	if (rt.NOT_PROPS.has(n)) { if (accessor(n)) fail(`${n} is in NOT_PROPS but has a property`); }
	else if (!accessor(n)) fail(`${n} has no property`);
	else props++;
}
// the bundler's copy (tools/proc-calls.mjs): JS_VARS stay JS reads, SRC_FIELDS' `this.x` is lowered to rt.sv; together they are NOT_PROPS
const { JS_VARS, SRC_FIELDS } = await import("../tools/proc-calls.mjs");
const copy = [...JS_VARS, ...SRC_FIELDS].sort().join(), real = [...rt.NOT_PROPS].sort().join();
if (copy !== real) fail(`tools/proc-calls.mjs JS_VARS + SRC_FIELDS (${copy}) != runtime NOT_PROPS (${real})`);
// the robot's f.src rule is the proc's: a proc that assigns f.src keeps rt.sv, its neighbour in the same file gets this.x
{
	const { mkdtempSync, writeFileSync } = await import("node:fs");
	const { tmpdir } = await import("node:os");
	const { execFileSync } = await import("node:child_process");
	const dir = mkdtempSync(join(tmpdir(), "dtprops-")), file = join(dir, "x.ts");
	writeFileSync(file, `rt.def("/obj/zz/proc/a", function a(f: Frame) {\n\tf.src = null;\n\treturn rt.sv(f, "health");\n});\n`
		+ `rt.def("/obj/zz/proc/b", function b(f: Frame) {\n\treturn rt.sv(f, "health");\n});\n`
		+ `rt.tail("/obj/zz/proc/a: spawn at x.dm:1", function* (f: Frame) {\n\treturn rt.sv(f, "health");\n});\n`);
	const out = execFileSync("node", [resolve(web, "tools/dt-props.mjs"), "--check", "x.ts"], { encoding: "utf8", cwd: dir });
	if (!out.includes("1 rewrites") || !out.includes("rt.sv 1")) fail(`dt-props --check on a proc that assigns f.src and its neighbour: ${out.trim()}`);
	if (!out.includes("2 procs assign f.src: left")) fail(`dt-props --check counted the kept procs wrong (a and its tail): ${out.trim()}`);
}
console.log(failures ? `dt-props: ${failures} FAILED` : `dt-props: OK (${props} var names are properties, ${names.size - props} are not)`);
process.exit(failures ? 1 : 0);
