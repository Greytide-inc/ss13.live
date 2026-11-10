#!/usr/bin/env node
// dt-vars.mjs - Detranslate robot (plans/archive/detranslate.md step 9a): rewrites the engine's var helpers in game procs as plain reads and writes.
// Usage (from web/): node tools/dt-vars.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the columns of the files' rows in game/_dm-lines.json itself.
// Rules (the bundler, translate-tg.mjs lowerVar, turns each back into exactly the old call; tools/proc-calls.mjs readableVar has the names):
//   rt.fv(f, "x", A)          -> A.x                rt.setFv(f, "x", A, v)  -> A.x = v      (a statement of its own)
//   rt.sv(f, "loc")           -> this.loc           rt.setSv(f, "loc", v)   -> this.loc = v (SRC_FIELDS names only: the rest are properties)
// Never: a name that isn't a literal or isn't a declared var (JS_VARS: `length`...), a receiver that would need parentheses, the
// frame `f` as rt.fv's object (`this` only in a proc that doesn't assign f.src, not in a nested function, and a NOT_PROPS name stays), a receiver rooted at a name its proc doesn't bind, a write used as a value, this.x in a proc (or tail) that assigns
// f.src or inside a nested non-arrow function, a call split over lines.
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { bare, callee, runRobot } from "./dt-robot.mjs";
import { jsReceiver, procFunction, procMovesSrc, SRC_FIELDS, thisFunction, varNameSet } from "./proc-calls.mjs";

const { NOT_PROPS } = await import(pathToFileURL(resolve(import.meta.dirname, "../build/dist/src/translate/runtime.js")).href);
const varNames = varNameSet(resolve(import.meta.dirname, "../game"));
const isF = (n) => n && ts.isIdentifier(n) && n.text === "f";
const varName = (a) => (a && ts.isStringLiteral(a) && /^[A-Za-z_$][\w$]*$/.test(a.text) && varNames.has(a.text) ? a.text : null);
/** a write that is a statement of its own (`rt.setFv(...);` or `(rt.setFv(...));`): `A.x = v` means the same there */
const statement = (n) => ts.isExpressionStatement(n.parent) || (ts.isParenthesizedExpression(n.parent) && ts.isExpressionStatement(n.parent.parent));

runRobot("vars", (ctx) => {
	const { text, sf, scope, counts, skip } = ctx;
	for (const k of ["fv", "setFv", "sv", "setSv"]) counts[k] = 0;
	const rewrite = (n) => {
		const c = callee(n);
		if (c !== "rt.fv" && c !== "rt.setFv" && c !== "rt.sv" && c !== "rt.setSv") return null;
		const a = n.arguments, kind = c.slice(3), name = varName(a[1]), s = n.getStart(sf);
		if (!isF(a[0]) || !name) return skip("not a literal declared var name");
		if (ts.isCallExpression(n.parent) && n.parent.expression === n) return skip("called");
		const write = kind === "setFv" || kind === "setSv";
		if (write && !statement(n)) return skip("a write used as a value");
		const done = (e) => {
			for (const [x, y] of e) if (/\n/.test(text.slice(x, y))) return skip("split over lines");
			counts[kind]++;
			return e;
		};
		if (kind === "sv" || kind === "setSv") {
			if (a.length !== (write ? 3 : 2)) return skip("arguments");
			if (!SRC_FIELDS.has(name)) return skip("rt.sv of a property name (this.x is a property)");
			if (procMovesSrc(n)) return skip("this.x in a proc that assigns f.src");
			if (thisFunction(n) !== procFunction(n)) return skip("this.x in a nested function");
			return done(write ? [[s, a[2].getStart(sf), `this.${name} = `], [a[2].end, n.end, ""]] : [[s, n.end, `this.${name}`]]);
		}
		if (a.length !== (write ? 4 : 3)) return skip("arguments");
		const r = a[2];
		if (r.kind === ts.SyntaxKind.ThisKeyword) { // src's own var: this.loc (lowered back to rt.sv) or a property
			if (procMovesSrc(n)) return skip("this.x in a proc that assigns f.src");
			if (thisFunction(n) !== procFunction(n)) return skip("this.x in a nested function");
			if (NOT_PROPS.has(name) && !SRC_FIELDS.has(name)) return skip("rt.fv on this of a NOT_PROPS name");
		}
		if (isF(r)) return skip("rt.fv on f");
		if (!bare(r)) return skip("receiver needs parentheses");
		if (jsReceiver(r, n, scope)) return skip("receiver rooted at a name its proc doesn't bind");
		return done(write ? [[s, r.getStart(sf), ""], [r.end, a[3].getStart(sf), `.${name} = `], [a[3].end, n.end, ""]]
			: [[s, r.getStart(sf), ""], [r.end, n.end, `.${name}`]]);
	};
	return rewrite;
});
