#!/usr/bin/env node
// dt-defaults.mjs - Detranslate robot (plans/archive/detranslate.md step 10c): rewrites DM's argument defaults, the translator's three-line
// `if (x === null) { x = 20; }`, as `x ??= 20;`.
// Usage (from web/): node tools/dt-defaults.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the files' rows in game/_dm-lines.json itself (lines too: this removes some).
// Rule (the bundler, translate-tg.mjs, writes back exactly the old statement, on one line):
//   if (x === null) {          ->   x ??= 20;
//   	x = 20;
//   }
// Only that: a bare name tested `=== null`, no else, braces holding the one statement `x = value;` for the same name, no comment
// in the block, directly in a block (not the body of another if), in the proc itself (not a nested function).
// Left as they were (and counted): an else, more than the one assignment, another name assigned, `== null` / `!== null`, a comment.
import ts from "typescript";
import { runRobot } from "./dt-robot.mjs";
import { nearestFunction, procFunction } from "./proc-calls.mjs";

const NULL_TESTS = new Set([ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken]);

runRobot("defaults", (ctx) => {
	const { text, sf, counts, skip, dmAt } = ctx;
	counts.default = 0;
	return (n) => {
		if (!ts.isIfStatement(n)) return null;
		const t = n.expression;
		if (!ts.isBinaryExpression(t) || !NULL_TESTS.has(t.operatorToken.kind) || !ts.isIdentifier(t.left) || t.right.kind !== ts.SyntaxKind.NullKeyword) return null;
		if (t.operatorToken.kind !== ts.SyntaxKind.EqualsEqualsEqualsToken) return skip("== null or !== null");
		if (!ts.isBlock(n.thenStatement)) return skip("body isn't in braces");
		const body = n.thenStatement.statements;
		if (body.length !== 1) return skip(body.length ? "a body with more than the one assignment" : "an empty body");
		const st = body[0], a = ts.isExpressionStatement(st) ? st.expression : null;
		if (!a || !ts.isBinaryExpression(a) || a.operatorToken.kind !== ts.SyntaxKind.EqualsToken || !ts.isIdentifier(a.left)) return skip("the body isn't a plain `name = value;`");
		if (n.elseStatement) return skip("an else");
		if (a.left.text !== t.left.text) return skip("another name assigned than tested");
		if (/\/\/|\/\*/.test(text.slice(n.getStart(sf), n.end))) return skip("a comment in the block");
		if (!(ts.isBlock(n.parent) || ts.isCaseClause(n.parent) || ts.isDefaultClause(n.parent))) return skip("not directly in a block");
		if (nearestFunction(n) !== procFunction(n)) return skip("in a nested function");
		if (!new RegExp(`^if \\(${a.left.text} === null\\) \\{\\s*$`).test(text.slice(n.getStart(sf), a.left.getStart(sf)).replace(/\s*$/, "")) || !/^\s*\}$/.test(text.slice(st.end, n.end))) return skip("layout");
		// a DM line entry on the assignment's line or the `}` line would land on the `if` (the proof compares tokens): those stay
		const first = sf.getLineAndCharacterOfPosition(n.getStart(sf)).line, last = sf.getLineAndCharacterOfPosition(n.end).line;
		for (let l = first + 1; l <= last; l++) if (dmAt(l).length) return skip("DM line entries on the block's own lines");
		counts.default++;
		const op = a.operatorToken.getStart(sf);
		return [[n.getStart(sf), a.left.getStart(sf), ""], [op, op, "??"], [st.end, n.end, ""]];
	};
}, { removesLines: true });
