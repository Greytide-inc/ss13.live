#!/usr/bin/env node
// dt-props.mjs - Detranslate robot (plans/archive/detranslate.md): rewrites src var reads and writes in game procs as properties.
// Usage (from web/, after `npx tsc -p .`): node tools/dt-props.mjs [--check] TARGET...
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (/obj/machinery/proc/use_power: that rt.def,
//   in whichever file has it). --check changes nothing, prints what it would do. Afterwards: node tools/remap-dm-cols.mjs HEAD.
// Rules (each gives exactly what the old text did; the engine side is runtime.ts installVarProps and invoke's `this`):
//   live(f.src)              -> this        a proc's code never runs with its src deleted (the proc ends: checkSrc, dt-life 3)
//   rt.sv(f, "n")            -> this.n      reads through the same VM.readIC as srcVarI
//   rt.setSv(f, "n", v)      -> this.n = v  (in parentheses unless it is the whole statement)
//   rt.fv/rt.gv(f, "n", live(f.src)) -> this.n,  rt.setFv(f, "n", live(f.src), v) -> this.n = v
// Never: a name in runtime NOT_PROPS (rt.fv stays), a proc or tail that assigns f.src (procMovesSrc, proc-calls.mjs) (`src = null` and friends: there `this` and
// rt.sv's bound src part ways), code inside a nested non-arrow function (its own `this`), _globals.ts. Other receivers
// (`o.n` for rt.fv(f, "n", o)) wait for proof that o is always an object or null (detranslate step 9).
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { procMovesSrc } from "./proc-calls.mjs";

const web = resolve(import.meta.dirname, "..");
const { NOT_PROPS } = await import(pathToFileURL(resolve(web, "build/dist/src/translate/runtime.js")).href);
const check = process.argv.includes("--check");
const targets = process.argv.slice(2).filter((a) => a !== "--check");
if (targets.length === 0) { console.error("usage: node tools/dt-props.mjs [--check] FILE|/proc/path ..."); process.exit(2); }

const gameFiles = () => {
	const out = [];
	const walk = (d) => { for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walk(p); else if (e.endsWith(".ts")) out.push(p); } };
	walk(resolve(web, "game/code"));
	return out;
};
// file -> set of proc paths (null: the whole file)
const work = new Map();
let all = null;
for (const t of targets) {
	if (t.startsWith("/")) {
		all ??= gameFiles();
		const needle = `rt.def("${t}",`;
		const hits = all.filter((p) => readFileSync(p, "utf8").includes(needle));
		if (hits.length !== 1) { console.error(`${t}: ${hits.length} files define it`); process.exit(1); }
		const s = work.get(hits[0]);
		if (s !== null) work.set(hits[0], (s ?? new Set()).add(t));
	} else work.set(resolve(t), null);
}

const isRt = (n, name) => ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && ts.isIdentifier(n.expression.expression)
	&& n.expression.expression.text === "rt" && n.expression.name.text === name;
const isF = (n) => ts.isIdentifier(n) && n.text === "f";
const isSrc = (n) => ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "live" && n.arguments.length === 1
	&& ts.isPropertyAccessExpression(n.arguments[0]) && isF(n.arguments[0].expression) && n.arguments[0].name.text === "src";
const propName = (a) => (a && ts.isStringLiteral(a) && /^[A-Za-z_$][\w$]*$/.test(a.text) && !NOT_PROPS.has(a.text) ? a.text : null);

let total = 0;
for (const [file, procs] of work) {
	const rel = relative(web, file);
	if (rel.endsWith("_globals.ts")) { console.log(`${rel}: skipped (global init)`); continue; }
	const text = readFileSync(file, "utf8");
	const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
	const edits = []; // [start, end, text], never overlapping: an edit's inner text is rebuilt by `render`
	let kept = 0;
	const counts = { src: 0, sv: 0, setSv: 0, fv: 0, setFv: 0 };
	// the text of node n with the rewrites below applied inside it
	const render = (n) => {
		const inner = [];
		const collect = (k) => { const r = rewrite(k); if (r !== null) inner.push([k.getStart(sf), k.end, r]); else ts.forEachChild(k, collect); };
		ts.forEachChild(n, collect);
		let s = text.slice(n.getStart(sf), n.end), base = n.getStart(sf);
		for (const [a, b, r] of inner.sort((x, y) => y[0] - x[0])) s = s.slice(0, a - base) + r + s.slice(b - base);
		return s;
	};
	const assign = (n, lhs, value) => {
		const s = `${lhs} = ${render(value)}`;
		return ts.isExpressionStatement(n.parent) || ts.isParenthesizedExpression(n.parent) ? s : `(${s})`;
	};
	// the replacement text of n, or null if no rule applies to n itself
	const rewrite = (n) => {
		if (!ts.isCallExpression(n)) return null;
		if (isSrc(n)) { counts.src++; return "this"; }
		const a = n.arguments;
		if (isRt(n, "sv") && a.length === 2 && isF(a[0]) && propName(a[1])) { counts.sv++; return `this.${a[1].text}`; }
		if (isRt(n, "setSv") && a.length === 3 && isF(a[0]) && propName(a[1])) { counts.setSv++; return assign(n, `this.${a[1].text}`, a[2]); }
		if ((isRt(n, "fv") || isRt(n, "gv")) && a.length === 3 && isF(a[0]) && propName(a[1]) && isSrc(a[2])) { counts.fv++; return `this.${a[1].text}`; }
		if (isRt(n, "setFv") && a.length === 4 && isF(a[0]) && propName(a[1]) && isSrc(a[2])) { counts.setFv++; return assign(n, `this.${a[1].text}`, a[3]); }
		return null;
	};
	// a proc's (or tail's) own code: not inside a nested non-arrow function
	const own = (body) => {
		if (procMovesSrc(body)) { kept++; return; }
		const visit = (k) => {
			if ((ts.isFunctionExpression(k) || ts.isFunctionDeclaration(k) || ts.isMethodDeclaration(k)) && k !== body) return;
			const r = rewrite(k);
			if (r !== null) edits.push([k.getStart(sf), k.end, r]);
			else ts.forEachChild(k, visit);
		};
		visit(body);
	};
	for (const st of sf.statements) {
		if (!ts.isExpressionStatement(st) || !ts.isCallExpression(st.expression)) continue;
		const c = st.expression, [p, fn] = c.arguments;
		if (isRt(c, "def") && p && ts.isStringLiteral(p) && fn && ts.isFunctionExpression(fn) && (procs === null || procs.has(p.text))) own(fn);
		else if (isRt(c, "tail") && procs === null && fn && ts.isFunctionExpression(fn)) own(fn);
	}
	const n = Object.values(counts).reduce((x, y) => x + y, 0);
	total += n;
	console.log(`${rel}: ${n} rewrites (live(f.src) ${counts.src}, rt.sv ${counts.sv}, rt.setSv ${counts.setSv}, src rt.fv/gv ${counts.fv}, src rt.setFv ${counts.setFv})${kept ? `, ${kept} procs assign f.src: left` : ""}`);
	if (check || n === 0) continue;
	let out = text;
	for (const [a, b, r] of edits.sort((x, y) => y[0] - x[0])) out = out.slice(0, a) + r + out.slice(b);
	writeFileSync(file, out);
}
console.log(`${total} rewrites${check ? " (--check: nothing written)" : ""}`);
