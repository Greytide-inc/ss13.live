#!/usr/bin/env node
// dt-calls.mjs - Detranslate robot (plans/archive/detranslate.md step 8): rewrites the engine's proc call helpers in game procs as plain calls.
// Usage (from web/): node tools/dt-calls.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the columns of the files' rows in game/_dm-lines.json itself.
// Rules (the bundler, translate-tg.mjs lowerCall, turns each back into exactly the old call; tools/proc-calls.mjs has the names):
//   rt.callName(f, A, "x", [a, b])          -> A.x(a, b)         yield* g.callName(...)  -> yield* A.x(a, b)
//   rt.callSrc(f, "x", [a])                 -> this.x(a)         yield* g.callSrc / g.srcCall(f, "x", a) -> yield* this.x(a)
//   rt.call(f, P("/proc/x"), null, [a])     -> x(a)              yield* g.call(...)      -> yield* x(a)
//   callSuper(f, [], rt.Args.Same)          -> parent_proc()     (`callSuper(f, [])` in an <init>; with values: parent_proc(a, b))
//   rt.callName(f, this, "x", [a])          -> this.x(a)         (comes back as callSrc: the same call, as this is src and live)
// Never: a named or list argument kind (rt.Args.Named/List), a name that isn't a literal, a JS_NAMES name, a plain rt.* call in a
// function* (or a g.* one not under yield*), this.x() in a file that assigns f.src or inside a nested non-arrow function, a
// global proc whose name its proc or the file's top level declares, a call split over lines.
import { resolve } from "node:path";
import ts from "typescript";
import { bare, callee, runRobot } from "./dt-robot.mjs";
import { JS_NAMES, jsReceiver, nearestFunction, procFunction, procMovesSrc, procNameSets, thisFunction } from "./proc-calls.mjs";

const { procNames, globalProcs } = procNameSets(resolve(import.meta.dirname, "../game"));
const isF = (n) => n && ts.isIdentifier(n) && n.text === "f";
const isSame = (n) => n && ts.isPropertyAccessExpression(n) && n.getText() === "rt.Args.Same";
const values = (n) => n && ts.isArrayLiteralExpression(n) && !n.elements.some(ts.isSpreadElement) ? n : null;
const procName = (a) => (a && ts.isStringLiteral(a) && /^[A-Za-z_$][\w$]*$/.test(a.text) && procNames.has(a.text) && !JS_NAMES.has(a.text) ? a.text : null);
runRobot("calls", (ctx) => {
	const { text, sf, scope, counts, anchors, skip } = ctx;
	for (const k of ["name", "src", "global", "super"]) counts[k] = 0;
	// the edits for call n, or null (counted in skipped) if no rule applies
	const rewrite = (n) => {
		const c = callee(n);
		if (c === null || !isF(n.arguments[0])) return null;
		const a = n.arguments, gen = !!nearestFunction(n).asteriskToken, yielded = ts.isYieldExpression(n.parent) && !!n.parent.asteriskToken;
		const kindOk = c.startsWith("g.") ? gen && yielded : !gen;
		const at = n.expression.name.getStart(sf), s = n.getStart(sf);
		const wrap = (k, e, ai, off, len) => { // e: the edits for a call of kind k; its name (len characters) goes at offset off of edit e[ai]'s text
			for (const [x, y] of e) if (/\n/.test(text.slice(x, y))) return skip("split over lines");
			if (!kindOk) return skip(c.startsWith("g.") ? "g.* not under yield*" : "rt.* in a function*");
			counts[k]++;
			anchors.push([at, e[ai], off, len]);
			return e;
		};
		if (c === "rt.callName" || c === "g.callName") {
			const name = procName(a[2]), v = values(a[3]);
			if (a.length !== 4 || !name || !v) return skip("callName: kind, name or values");
			const r = a[1];
			if (r.kind === ts.SyntaxKind.ThisKeyword) { // src.x(): the same as a bare x() (this is src, and live: a proc ends when its src goes)
				if (procMovesSrc(n)) return skip("this.x() in a proc that assigns f.src");
				if (thisFunction(n) !== procFunction(n)) return skip("this.x() in a nested function");
				return wrap("src", [[s, v.getStart(sf) + 1, `this.${name}(`], [v.end - 1, n.end, ")"]], 0, 5, name.length);
			}
			if (jsReceiver(r, n, scope)) return skip("callName on a name its proc doesn't bind");
			const p = !bare(r);
			const e = [[s, r.getStart(sf), p ? "(" : ""], [r.end, v.getStart(sf) + 1, `${p ? ")" : ""}.${name}(`], [v.end - 1, n.end, ")"]];
			return wrap("name", e, 1, p ? 2 : 1, name.length);
		}
		if (c === "rt.callSrc" || c === "g.callSrc" || c === "g.srcCall") {
			const name = procName(a[1]);
			if (!name) return skip("callSrc: name");
			if (procMovesSrc(n)) return skip("this.x() in a proc that assigns f.src");
			if (thisFunction(n) !== procFunction(n)) return skip("this.x() in a nested function");
			let e;
			if (c === "g.srcCall") e = a.length === 2 ? [[s, n.end, `this.${name}()`]] : [[s, a[2].getStart(sf), `this.${name}(`]];
			else {
				const v = values(a[2]);
				if (a.length !== 3 || !v) return skip("callSrc: kind or values");
				e = [[s, v.getStart(sf) + 1, `this.${name}(`], [v.end - 1, n.end, ")"]];
			}
			return wrap("src", e, 0, 5, name.length);
		}
		if (c === "rt.call" || c === "g.call") {
			const P = a[1], v = values(a[3]);
			const m = P && ts.isCallExpression(P) && ts.isIdentifier(P.expression) && P.expression.text === "P" && P.arguments.length === 1
				&& ts.isStringLiteral(P.arguments[0]) ? /^\/proc\/([A-Za-z_$][\w$]*)$/.exec(P.arguments[0].text) : null;
			if (a.length !== 4 || !m || a[2].kind !== ts.SyntaxKind.NullKeyword || !v) return skip("call: not a global proc by P()");
			if (!globalProcs.has(m[1])) return skip("call: not a global proc name");
			if (scope.all(n).has(m[1])) return skip("call: its proc or the file declares the name");
			const e = [[s, v.getStart(sf) + 1, `${m[1]}(`], [v.end - 1, n.end, ")"]];
			return wrap("global", e, 0, 0, m[1].length);
		}
		if (c === "rt.callSuper" || c === "g.callSuper") {
			const v = values(a[1]), init = procFunction(n)?.parent.arguments[0].text.endsWith("/<init>");
			if (!v || scope.all(n).has("parent_proc")) return skip("callSuper: values");
			let e;
			if (v.elements.length === 0 && a.length === 3 && isSame(a[2]) && !init) e = [[s, n.end, "parent_proc()"]];
			else if (v.elements.length === 0 && a.length === 2 && init) e = [[s, n.end, "parent_proc()"]];
			else if (v.elements.length > 0 && a.length === 2) e = [[s, v.getStart(sf) + 1, "parent_proc("], [v.end - 1, n.end, ")"]];
			else return skip("callSuper: kind");
			return wrap("super", e, 0, 0, "parent_proc".length);
		}
		return null;
	};
	return (n) => (ts.isCallExpression(n) ? rewrite(n) : null);
});
