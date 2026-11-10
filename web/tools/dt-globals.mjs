#!/usr/bin/env node
// dt-globals.mjs - Detranslate robot (plans/archive/detranslate.md step 9g): rewrites the engine's DM global helpers in game procs as GLOB.name, tg's own spelling.
// Usage (from web/): node tools/dt-globals.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the columns of the files' rows in game/_dm-lines.json itself.
// Rules (the bundler, translate-tg.mjs lowerGlobal and lowerOp, turns each back into exactly the old call; tools/proc-calls.mjs readableGlobal):
//   rt.gl("x") -> GLOB.x        rt.setGl("x", v) -> GLOB.x = v        rt.modGl("x", v, add) -> GLOB.x += v (subtract -=, multiply *=...)
//   rt.incGl("x", 1, true) -> GLOB.x++ (false: ++GLOB.x; -1: --)
// Never: a name that isn't an identifier or not a global of game/_globals.ts, a proc or file that binds GLOB, rt.gl called as a function,
// a write, op= or ++ used as a value, a bit operator's op= (rt.bitOr stays a call), a call broken over lines where its new text would go.
import ts from "typescript";
import { callee, runRobot } from "./dt-robot.mjs";
import { globalKeys } from "./globals-table.mjs";
import { DM_ASSIGN, opFunction, rtAliases } from "./proc-calls.mjs";

const keys = globalKeys().index;
const ASG = Object.fromEntries(Object.entries(DM_ASSIGN).map(([k, fn]) => [fn, ts.tokenToString(+k)])); // "add" -> "+="
const K = ts.SyntaxKind;
const step = (a) => (a && ts.isNumericLiteral(a) && a.text === "1" ? 1 : a && ts.isPrefixUnaryExpression(a) && a.operator === K.MinusToken && ts.isNumericLiteral(a.operand) && a.operand.text === "1" ? -1 : 0);
const bool = (a) => (a && a.kind === K.TrueKeyword ? true : a && a.kind === K.FalseKeyword ? false : null);

runRobot("globals", (ctx) => {
	const { text, sf, scope, counts, skip } = ctx;
	for (const k of ["gl", "setGl", "modGl", "incGl"]) counts[k] = 0;
	const aliases = rtAliases(sf);
	const at = (n) => n.getStart(sf);
	/** text between a and b holds no line break and no comment (an edit's new text goes there) */
	const flat = (a, b) => !/\n|\/\/|\/\*/.test(text.slice(a, b));
	/** the operator function an op argument names, if the bundler would write it that way at n */
	const fnAt = (e, n) => {
		const t = ts.isIdentifier(e) ? e.text : ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression) && e.expression.text === "rt" ? `rt.${e.name.text}` : null;
		return t && opFunction(t.replace(/^rt\.(add|subtract|multiply|divide)$/, "$1"), n, aliases, scope) === t ? t : null;
	};
	/** a statement of its own (`rt.setGl(...);` or `(rt.setGl(...));`): its parentheses, dropped */
	const statement = (n) => ts.isExpressionStatement(n.parent) || (ts.isParenthesizedExpression(n.parent) && ts.isExpressionStatement(n.parent.parent));
	const parens = (n) => (ts.isParenthesizedExpression(n.parent) && at(n.parent) + 1 === at(n) && n.parent.end - 1 === n.end
		? [[at(n.parent), at(n.parent) + 1, ""], [n.parent.end - 1, n.parent.end, ""]] : []);
	return (n) => {
		const c = callee(n);
		if (c !== "rt.gl" && c !== "rt.setGl" && c !== "rt.modGl" && c !== "rt.incGl") return null;
		const a = n.arguments, kind = c.slice(3), name = a[0] && ts.isStringLiteral(a[0]) && /^[A-Za-z_$][\w$]*$/.test(a[0].text) ? a[0].text : null;
		if (!name || !keys.has(name)) return skip("not a global's name");
		if (scope.all(n).has("GLOB")) return skip("GLOB is bound there");
		const done = (e) => { counts[kind]++; return e; };
		if (kind === "gl") {
			if (a.length !== 1) return skip("arguments");
			if (ts.isCallExpression(n.parent) && n.parent.expression === n) return skip("called");
			return done([[at(n), n.end, `GLOB.${name}`]]);
		}
		if (!statement(n)) return skip("a write used as a value");
		if (kind === "setGl") {
			if (a.length !== 2 || !flat(at(n), at(a[1])) || !flat(a[1].end, n.end)) return skip("arguments or split over lines");
			return done([[at(n), at(a[1]), `GLOB.${name} = `], [a[1].end, n.end, ""], ...parens(n)]);
		}
		if (kind === "modGl") {
			const op = a.length === 3 && ASG[fnAt(a[2], n)];
			if (!op) return skip("op= of a bit operator, or arguments");
			if (!flat(at(n), at(a[1])) || !flat(a[1].end, n.end)) return skip("split over lines");
			return done([[at(n), at(a[1]), `GLOB.${name} ${op} `], [a[1].end, n.end, ""], ...parens(n)]);
		}
		const d = step(a[1]), post = bool(a[2]);
		if (a.length !== 3 || !d || post === null || !flat(at(n), n.end)) return skip("arguments or split over lines");
		const op = d > 0 ? "++" : "--";
		return done([[at(n), n.end, post ? `GLOB.${name}${op}` : `${op}GLOB.${name}`], ...parens(n)]);
	};
});
