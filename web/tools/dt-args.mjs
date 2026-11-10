#!/usr/bin/env node
// dt-args.mjs - Detranslate robot (plans/archive/detranslate.md step 7b): a proc that reads its arguments as `f.args[0]` gets them as named parameters.
// Usage (from web/): node tools/dt-args.mjs [--check] [FILE...]   (no FILE: every .ts under game/). Afterwards: node tools/remap-dm-cols.mjs HEAD.
// What it does, per rt.def whose meta lists `args: [...]` and whose function takes only f:
//   function* x(f: Frame) { ... f.args[0] ... }, true, { args: ["M"] }   ->   function* x(f: Frame, M: Value) { ... M ... }, true
// Same values: the VM pads f.args to the DM argument count and passes the same array's items as the parameters (runtime
// invoke), so an argument nothing writes is f.args[i] for the whole call; rt.Args.Same passes a copy of f.args (unchanged).
// Never: a proc that writes f.args[i] or uses f.args any other way (f.argsList, DM's `args`, shares the array), reads it inside
// a nested `function` (its own f), tails, a DM name that is a JS reserved word or is already a name in the function (a local,
// a helper such as P or T, a nested function's parameter; property names like `this.target` don't count).
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";

const web = resolve(import.meta.dirname, ".."), game = resolve(web, "game");
const check = process.argv.includes("--check"), named = process.argv.slice(2).filter((a) => a !== "--check");
const walk = (d, out = []) => { for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walk(p, out); else if (e.endsWith(".ts")) out.push(p); } return out; };
const files = named.length ? named.map((p) => resolve(p)) : walk(game);
const reserved = (x) => { try { new Function(`let ${x};`); return false; } catch { return true; } };
/** an identifier that names something (not `o.NAME`, `{ NAME: v }`, a method or property declaration name) */
const isNameUse = (n) => {
	const p = n.parent;
	return !((ts.isPropertyAccessExpression(p) && p.name === n) || (ts.isPropertyAssignment(p) && p.name === n) || (ts.isMethodDeclaration(p) && p.name === n) || (ts.isPropertyDeclaration(p) && p.name === n));
};
const skipped = {};
let nProcs = 0, nSites = 0, nFiles = 0;
for (const p of files) {
	const text = readFileSync(p, "utf8");
	if (!text.includes("args: [")) continue;
	const sf = ts.createSourceFile(p, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS), cuts = [];
	for (const st of sf.statements) {
		const e = ts.isExpressionStatement(st) ? st.expression : null;
		if (!e || !ts.isCallExpression(e) || e.expression.getText(sf) !== "rt.def") continue;
		const fn = e.arguments[1], meta = e.arguments[3];
		if (!fn || !ts.isFunctionExpression(fn) || !meta || !ts.isObjectLiteralExpression(meta)) continue;
		const argsProp = meta.properties.find((q) => ts.isPropertyAssignment(q) && q.name.getText(sf) === "args");
		if (!argsProp || !ts.isArrayLiteralExpression(argsProp.initializer) || !argsProp.initializer.elements.every(ts.isStringLiteral)) continue;
		const why = (k) => { skipped[k] = (skipped[k] ?? 0) + 1; };
		if (fn.parameters.length !== 1) { why("has parameters"); continue; }
		const dm = argsProp.initializer.elements.map((x) => x.text);
		if (dm.some(reserved)) { why("reserved name"); continue; }
		const reads = [], names = new Set(fn.name ? [fn.name.text] : []);
		let bad = null;
		const visit = (n, inFn) => {
			if (ts.isIdentifier(n) && isNameUse(n)) names.add(n.text);
			if (ts.isPropertyAccessExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "f" && (n.name.text === "args" || n.name.text === "argsList")) {
				const par = n.parent, gp = par.parent;
				if (n.name.text === "argsList" || !ts.isElementAccessExpression(par) || par.expression !== n || !ts.isNumericLiteral(par.argumentExpression)) bad ??= "other f.args use";
				else if ((ts.isBinaryExpression(gp) && gp.left === par && gp.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && gp.operatorToken.kind <= ts.SyntaxKind.LastAssignment)
					|| ((ts.isPrefixUnaryExpression(gp) || ts.isPostfixUnaryExpression(gp)) && (gp.operator === ts.SyntaxKind.PlusPlusToken || gp.operator === ts.SyntaxKind.MinusMinusToken))) bad ??= "writes f.args[i]";
				else if (inFn) bad ??= "inside a nested function";
				else if (+par.argumentExpression.text >= dm.length) bad ??= "past the DM arguments";
				else reads.push(par);
			}
			const nested = n !== fn && ts.isFunctionLike(n) && !ts.isArrowFunction(n);
			ts.forEachChild(n, (c) => visit(c, inFn || nested));
		};
		visit(fn, false);
		if (bad) { why(bad); continue; }
		if (dm.some((x) => names.has(x))) { why("name already used"); continue; }
		const i = meta.properties.indexOf(argsProp), next = meta.properties[i + 1];
		const drop = meta.properties.length === 1 ? [e.arguments[2].end, meta.end, ""] : next ? [argsProp.getStart(sf), next.getStart(sf), ""] : [meta.properties[i - 1].end, argsProp.end, ""];
		if (text.slice(drop[0], drop[1]).includes("\n")) { why("meta over several lines"); continue; } // lines must stay
		// the edits: parameters after f, each read, the meta's args entry (the whole 4th argument when it is the only entry)
		cuts.push([fn.parameters[0].end, fn.parameters[0].end, dm.map((x) => `, ${x}: Value`).join("")]);
		for (const r of reads) cuts.push([r.getStart(sf), r.end, dm[+r.argumentExpression.text]]);
		cuts.push(drop);
		nProcs++; nSites += reads.length;
	}
	if (!cuts.length) continue;
	cuts.sort((a, b) => a[0] - b[0]);
	let out = "", at = 0;
	for (const [a, b, rep] of cuts) { out += text.slice(at, a) + rep; at = b; }
	out += text.slice(at);
	if (!check) writeFileSync(p, out);
	nFiles++;
}
console.log(`dt-args: ${nProcs} procs, ${nSites} f.args reads named, in ${nFiles} files${check ? " (--check: nothing written)" : ""}; skipped: ${JSON.stringify(skipped)}`);
