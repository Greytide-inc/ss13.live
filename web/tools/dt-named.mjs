#!/usr/bin/env node
// dt-named.mjs - Detranslate robot (plans/archive/detranslate.md step 10a): rewrites calls with rt.Args.Named as plain calls with an object literal last.
// Usage (from web/): node tools/dt-named.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the columns of the files' rows in game/_dm-lines.json itself.
// Rules (the bundler, translate-tg.mjs lowerCall / lowerNamed, writes back the old call; the name rules are dt-calls.mjs's, new_'s dt-new.mjs's):
//   rt.callName(f, A, "x", [null, a, "k", v], rt.Args.Named) -> A.x(a, { k: v })     (g.callName under yield*; callSrc this.x(...);
//   rt.call(f, P("/proc/x"), null, [...], rt.Args.Named) -> x(a, { k: v })             callSuper parent_proc(a, { k: v }))
//   rt.new_(f, T("/obj/x"), [null, a, "k", v], rt.Args.Named) -> new_(T("/obj/x"), a, { k: v })
// Only when the values are `null, value` pairs for the positional ones, then `"name", value` pairs to the end: every name a string literal
// that is a valid JS identifier (reserved words are fine), none twice, not __proto__. Never: what dt-calls / dt-new never do, a list
// broken over lines, an rt.op (not a proc call) or a call with a non-literal name.
import { resolve } from "node:path";
import ts from "typescript";
import { bare, callee, runRobot } from "./dt-robot.mjs";
import { JS_NAMES, jsReceiver, nearestFunction, procFunction, procMovesSrc, procNameSets, thisFunction } from "./proc-calls.mjs";

const { procNames, globalProcs } = procNameSets(resolve(import.meta.dirname, "../game"));
const isNamed = (n) => n && ts.isPropertyAccessExpression(n) && n.getText() === "rt.Args.Named";
const values = (n) => n && ts.isArrayLiteralExpression(n) && !n.elements.some(ts.isSpreadElement) ? n : null;
const procName = (a) => (a && ts.isStringLiteral(a) && /^[A-Za-z_$][\w$]*$/.test(a.text) && procNames.has(a.text) && !JS_NAMES.has(a.text) ? a.text : null);
const IDENT = /^[A-Za-z_$][\w$]*$/;
runRobot("named", (ctx) => {
	const { text, sf, scope, counts, anchors, skip } = ctx;
	for (const k of ["name", "src", "global", "super", "new_"]) counts[k] = 0;
	/** the edits that turn the list v ([null, a, "k", v], rt.Args.Named) into `a, { k: v })`, starting after the head's edit at `from`: or null (counted) */
	const body = (v, n, from) => {
		const els = v.elements, pos = [];
		let i = 0;
		while (i + 1 < els.length && els[i].kind === ts.SyntaxKind.NullKeyword) { pos.push(els[i + 1]); i += 2; }
		const names = els.slice(i);
		if (names.length < 2 || names.length % 2) return skip("named: a positional value after a name, or an odd list");
		const keys = new Set();
		for (let j = 0; j < names.length; j += 2) {
			const k = names[j];
			if (!ts.isStringLiteral(k) || !IDENT.test(k.text) || k.text === "__proto__" || keys.has(k.text)) return skip("named: a name that isn't a unique plain identifier");
			keys.add(k.text);
		}
		const e = [], gap = (x, y, re) => re.test(text.slice(x, y)) && !/\n/.test(text.slice(x, y));
		for (let j = 0; j < pos.length; j++) {
			if (!gap(els[2 * j].getStart(sf), pos[j].getStart(sf), /^null,\s*$/)) return skip("split over lines");
			e.push([els[2 * j].getStart(sf), pos[j].getStart(sf), ""]);
		}
		const first = names[0].getStart(sf), prev = pos.length ? pos[pos.length - 1].end : from;
		if (pos.length ? !gap(prev, first, /^,\s*$/) : !gap(prev, first, /^\s*$/)) return skip("split over lines");
		e.push([prev, first, pos.length ? ", { " : "{ "]);
		for (let j = 0; j < names.length; j += 2) {
			if (!gap(names[j].getStart(sf), names[j + 1].getStart(sf), /^"[^"]*",\s*$/)) return skip("split over lines");
			e.push([names[j].getStart(sf), names[j + 1].getStart(sf), `${names[j].text}: `]);
		}
		const last = names[names.length - 1];
		if (!gap(last.end, n.end, /^,?\s*\],\s*rt\.Args\.Named\)$/)) return skip("split over lines");
		e.push([last.end, n.end, " })"]);
		return e;
	};
	const rewrite = (n) => {
		const c = callee(n);
		if (c === null || !n.arguments.length || !isNamed(n.arguments[n.arguments.length - 1])) return null;
		const a = n.arguments, gen = !!nearestFunction(n).asteriskToken, yielded = ts.isYieldExpression(n.parent) && !!n.parent.asteriskToken;
		const s = n.getStart(sf), at = n.expression.name.getStart(sf);
		const kindOk = c.startsWith("g.") ? gen && yielded : !gen;
		if (c === "rt.new_" || c === "g.new_") {
			if (a.length !== 4 || !values(a[2])) return skip("new_: kind or values");
			if ((c === "g.new_") !== yielded) return skip("g.new_ without yield* or rt.new_ under one");
			if (scope.all(n).has("new_")) return skip("new_ is bound there");
			if (!/^(g|rt)\.new_\(f, $/.test(text.slice(s, a[1].getStart(sf)))) return skip("split over lines");
			const v = a[2], head = [s, a[1].getStart(sf), "new_("], b = body(v, n, v.getStart(sf) + 1);
			if (!b) return null;
			if (!/^,\s*\[$/.test(text.slice(a[1].end, v.getStart(sf) + 1))) return skip("split over lines");
			b.unshift(head, [a[1].end, v.getStart(sf) + 1, ", "]);
			anchors.push([s + c.length - 4, head, 0, 4]);
			counts.new_++;
			return b;
		}
		const wrap = (k, head, ai, off, len, v) => {
			if (!kindOk) return skip(c.startsWith("g.") ? "g.* not under yield*" : "rt.* in a function*");
			const b = body(v, n, v.getStart(sf) + 1);
			if (!b) return null;
			const e = [...head, ...b];
			for (const [x, y] of head) if (/\n/.test(text.slice(x, y))) return skip("split over lines");
			counts[k]++;
			anchors.push([at, e[ai], off, len]);
			return e;
		};
		if (c === "rt.callName" || c === "g.callName") {
			const name = procName(a[2]), v = values(a[3]);
			if (a.length !== 5 || !name || !v) return skip("callName: name or values");
			const r = a[1];
			if (r.kind === ts.SyntaxKind.ThisKeyword) {
				if (procMovesSrc(n)) return skip("this.x() in a proc that assigns f.src");
				if (thisFunction(n) !== procFunction(n)) return skip("this.x() in a nested function");
				return wrap("src", [[s, v.getStart(sf) + 1, `this.${name}(`]], 0, 5, name.length, v);
			}
			if (jsReceiver(r, n, scope)) return skip("callName on a name its proc doesn't bind");
			const p = !bare(r);
			return wrap("name", [[s, r.getStart(sf), p ? "(" : ""], [r.end, v.getStart(sf) + 1, `${p ? ")" : ""}.${name}(`]], 1, p ? 2 : 1, name.length, v);
		}
		if (c === "rt.callSrc" || c === "g.callSrc") {
			const name = procName(a[1]), v = values(a[2]);
			if (a.length !== 4 || !name || !v) return skip("callSrc: name or values");
			if (procMovesSrc(n)) return skip("this.x() in a proc that assigns f.src");
			if (thisFunction(n) !== procFunction(n)) return skip("this.x() in a nested function");
			return wrap("src", [[s, v.getStart(sf) + 1, `this.${name}(`]], 0, 5, name.length, v);
		}
		if (c === "rt.call" || c === "g.call") {
			const P = a[1], v = values(a[3]);
			const m = P && ts.isCallExpression(P) && ts.isIdentifier(P.expression) && P.expression.text === "P" && P.arguments.length === 1
				&& ts.isStringLiteral(P.arguments[0]) ? /^\/proc\/([A-Za-z_$][\w$]*)$/.exec(P.arguments[0].text) : null;
			if (a.length !== 5 || !m || a[2].kind !== ts.SyntaxKind.NullKeyword || !v) return skip("call: not a global proc by P()");
			if (!globalProcs.has(m[1])) return skip("call: not a global proc name");
			if (scope.all(n).has(m[1])) return skip("call: its proc or the file declares the name");
			return wrap("global", [[s, v.getStart(sf) + 1, `${m[1]}(`]], 0, 0, m[1].length, v);
		}
		if (c === "rt.callSuper" || c === "g.callSuper") {
			const v = values(a[1]);
			if (a.length !== 3 || !v || scope.all(n).has("parent_proc")) return skip("callSuper: values");
			return wrap("super", [[s, v.getStart(sf) + 1, "parent_proc("]], 0, 0, "parent_proc".length, v);
		}
		return null;
	};
	return (n) => (ts.isCallExpression(n) ? rewrite(n) : null);
});
