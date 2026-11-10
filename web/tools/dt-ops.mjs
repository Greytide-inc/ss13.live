#!/usr/bin/env node
// dt-ops.mjs - Detranslate robot (plans/archive/detranslate.md step 9b): rewrites DM's operator calls in game procs as plain operators.
// Usage (from web/): node tools/dt-ops.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the columns of the files' rows in game/_dm-lines.json itself.
// Rules (the bundler, translate-tg.mjs lowerOp, turns each back into exactly the old call; tools/proc-calls.mjs DM_BINARY has the table):
//   add(a, b) -> a + b   (subtract -, multiply *, divide /, rt.modulus %, rt.power **, rt.lt <, rt.le <=, rt.gt >, rt.ge >=)   rt.neg(a) -> -a
//   isEqual(a, b) -> a == b      !isEqual(a, b) -> a != b   (step 9i)
//   x = rt.modify(x, v, add) -> x += v       rt.modSrcVar(f, "x", v, add) -> this.x += v      rt.modField(f, o, "x", v, add) -> o.x += v
//   x = rt.inc(x, 1); -> x++;   (x = rt.inc(x, 1)) -> ++x   rt.incSrcVar(f, "x", 1, true) -> this.x++ (false: ++this.x)   rt.incField(f, o, "x", -1, true) -> o.x--
// Parentheses go in where JS's precedence needs them, and around a comparison inside a comparison. Never: an alias its proc shadows,
// a spread argument, rt.neg of a number (`-1` is a constant), an op call as a statement of its own, a call broken over lines where
// its new text would go, this.x where this isn't src or in a file that assigns f.src, an object rooted at a name its proc doesn't bind.
import { resolve } from "node:path";
import ts from "typescript";
import { bare, callee, runRobot } from "./dt-robot.mjs";
import { DM_ASSIGN, DM_BINARY, jsReceiver, opFunction, plainTarget, procFunction, procMovesSrc, rtAliases, thisFunction, varNameSet } from "./proc-calls.mjs";

const varNames = varNameSet(resolve(import.meta.dirname, "../game"));
const K = ts.SyntaxKind;
const PREC = { "+": 13, "-": 13, "*": 14, "/": 14, "%": 14, "**": 15, "<": 11, "<=": 11, ">": 11, ">=": 11, "==": 10, "!=": 10 };
const isRel = (p) => p === 11 || p === 10; // a comparison or an equality: one inside another gets parentheses, to read
const BIN = Object.fromEntries(Object.entries(DM_BINARY).map(([k, fn]) => [fn, ts.tokenToString(+k)])); // "add" -> "+"
const ASG = Object.fromEntries(Object.entries(DM_ASSIGN).map(([k, fn]) => [fn, ts.tokenToString(+k)])); // "add" -> "+="
const isF = (n) => n && ts.isIdentifier(n) && n.text === "f";
const name = (a, declared) => (a && ts.isStringLiteral(a) && /^[A-Za-z_$][\w$]*$/.test(a.text) && (!declared || varNames.has(a.text)) ? a.text : null);
const step = (a) => (a && ts.isNumericLiteral(a) && a.text === "1" ? 1 : a && ts.isPrefixUnaryExpression(a) && a.operator === K.MinusToken && ts.isNumericLiteral(a.operand) && a.operand.text === "1" ? -1 : 0);
const bool = (a) => (a && a.kind === K.TrueKeyword ? true : a && a.kind === K.FalseKeyword ? false : null);

runRobot("operators", (ctx) => {
	const { text, sf, scope, counts, anchors, skip } = ctx;
	for (const k of ["binary", "ne", "neg", "modify", "modSrcVar", "modField", "inc", "incSrcVar", "incField"]) counts[k] = 0;
	const aliases = rtAliases(sf);
	const at = (n) => n.getStart(sf);
	/** text between a and b holds no line break and no comment (an edit's new text goes there) */
	const flat = (a, b) => !/\n|\/\/|\/\*/.test(text.slice(a, b));
	/** the operator function a call's callee or an op argument names, if the bundler would write it that way at n */
	const fnAt = (e, n) => {
		const t = ts.isIdentifier(e) ? e.text : ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression) && e.expression.text === "rt" ? `rt.${e.name.text}` : null;
		return t && opFunction(t.replace(/^rt\.(add|subtract|multiply|divide)$/, "$1"), n, aliases, scope) === t ? t : null;
	};
	const thisOk = (n) => thisFunction(n) === procFunction(n) && !procMovesSrc(n);
	const objOk = (o, n) => bare(o) && o.kind !== K.ThisKeyword && !isF(o) && !jsReceiver(o, n, scope) && !kind(o);
	const memo = new Map();
	/** what n becomes (context aside), or null: { k, prec, op } */
	const kind = (n) => {
		if (!memo.has(n)) memo.set(n, kindOf(n));
		return memo.get(n);
	};
	const kindOf = (n) => {
		if (ts.isBinaryExpression(n) && n.operatorToken.kind === K.EqualsToken && ts.isCallExpression(n.right) && plainTarget(n.left)) {
			const c = callee(n.right), a = n.right.arguments, x = n.left.getText(sf);
			if (c === "rt.modify" && a.length === 3 && a[0].getText(sf) === x && ASG[fnAt(a[2], n)] && flat(n.left.end, at(a[1])) && flat(a[1].end, n.end))
				return { k: "modify", prec: 3, op: ASG[fnAt(a[2], n)] };
			if (c === "rt.inc" && a.length === 2 && a[0].getText(sf) === x && step(a[1]) && flat(at(n), n.end)
				&& (ts.isExpressionStatement(n.parent) || (ts.isParenthesizedExpression(n.parent) && at(n.parent) + 1 === at(n) && n.parent.end - 1 === n.end)))
				return { k: "inc", prec: ts.isExpressionStatement(n.parent) || ts.isExpressionStatement(n.parent.parent) ? 17 : 16, op: step(a[1]) > 0 ? "++" : "--" };
			return null;
		}
		const two = (c) => {
			const a = c.arguments;
			if (a.length !== 2 || a.some(ts.isSpreadElement)) return false;
			const head = text.slice(at(c), at(a[0])), mid = text.slice(a[0].end, at(a[1])), tail = text.slice(a[1].end, c.end);
			return /^[\w.]+\([ \t]*$/.test(head) && /^[ \t]*,\s*$/.test(mid) && /^[ \t]*\)$/.test(tail);
		};
		// !isEqual(a, b): the `!` and its call are one `!=`
		if (ts.isPrefixUnaryExpression(n) && n.operator === K.ExclamationToken && ts.isCallExpression(n.operand) && BIN[fnAt(n.operand.expression, n)] === "==")
			return two(n.operand) ? { k: "ne", prec: 10, op: "!=" } : null;
		if (!ts.isCallExpression(n) || n.arguments.some(ts.isSpreadElement)) return null;
		const a = n.arguments, fn = fnAt(n.expression, n), c = callee(n);
		if (fn && BIN[fn] && a.length === 2) {
			if (BIN[fn] === "==" && ts.isPrefixUnaryExpression(n.parent) && n.parent.operator === K.ExclamationToken) return null; // the `!`'s
			return two(n) ? { k: "binary", prec: PREC[BIN[fn]], op: BIN[fn] } : null;
		}
		if (c === "rt.neg" && a.length === 1 && !ts.isNumericLiteral(a[0]) && !(ts.isIdentifier(a[0]) && a[0].text === "Infinity")
			&& flat(at(n), at(a[0])) && flat(a[0].end, n.end)) return { k: "neg", prec: 16, op: "-" };
		if (c === "rt.modSrcVar" && a.length === 4 && isF(a[0]) && name(a[1]) && ASG[fnAt(a[3], n)] && thisOk(n) && flat(at(n), at(a[2])) && flat(a[2].end, n.end))
			return { k: "modSrcVar", prec: 3, op: ASG[fnAt(a[3], n)] };
		if (c === "rt.modField" && a.length === 5 && isF(a[0]) && name(a[2], true) && ASG[fnAt(a[4], n)] && objOk(a[1], n)
			&& flat(at(n), at(a[1])) && flat(a[1].end, at(a[3])) && flat(a[3].end, n.end)) return { k: "modField", prec: 3, op: ASG[fnAt(a[4], n)] };
		if (c === "rt.incSrcVar" && a.length === 4 && isF(a[0]) && name(a[1]) && step(a[2]) && bool(a[3]) !== null && thisOk(n) && flat(at(n), n.end))
			return { k: "incSrcVar", prec: bool(a[3]) ? 17 : 16, op: step(a[2]) > 0 ? "++" : "--" };
		if (c === "rt.incField" && a.length === 5 && isF(a[0]) && name(a[2], true) && step(a[3]) && bool(a[4]) !== null && objOk(a[1], n)
			&& flat(at(n), at(a[1])) && flat(a[1].end, n.end)) return { k: "incField", prec: bool(a[4]) ? 17 : 16, op: step(a[3]) > 0 ? "++" : "--" };
		return null;
	};
	/** n's precedence once rewritten */
	const prec = (n) => {
		const k = kind(n);
		if (k) return k.prec;
		if (ts.isArrowFunction(n) || ts.isYieldExpression(n)) return 2;
		return ts.getExpressionPrecedence(n);
	};
	const handles = (p, n) => {
		const k = ts.isCallExpression(p) && (kind(p) || (ts.isPrefixUnaryExpression(p.parent) && kind(p.parent)));
		return !!k && (k.k === "binary" || k.k === "neg" || k.k === "ne") && p.arguments.includes(n);
	};
	/** the lowest precedence that stands at n without parentheses (-1: its parent, an operator being rewritten, decides) */
	const slot = (n, mine) => {
		const p = n.parent;
		if (handles(p, n)) return -1;
		if (ts.isParenthesizedExpression(p)) return 0;
		if (ts.isCallExpression(p) || ts.isNewExpression(p)) return p.expression === n ? 19 : 3;
		if (ts.isPropertyAccessExpression(p) || (ts.isElementAccessExpression(p) && p.expression === n) || ts.isTaggedTemplateExpression(p)) return 19;
		if (ts.isConditionalExpression(p)) return p.condition === n ? 5 : 3;
		if (ts.isPrefixUnaryExpression(p) || ts.isTypeOfExpression(p) || ts.isVoidExpression(p) || ts.isDeleteExpression(p) || ts.isAwaitExpression(p)) return 16;
		if (ts.isPostfixUnaryExpression(p)) return 17;
		if (ts.isBinaryExpression(p)) {
			const k = p.operatorToken.kind, q = ts.getOperatorPrecedence(K.BinaryExpression, k);
			if (k >= K.FirstAssignment && k <= K.LastAssignment) return p.right === n ? 3 : 20;
			if (k === K.CommaToken) return 1;
			if (isRel(q) && isRel(mine)) return 12; // a comparison in a comparison: parentheses, to read
			return p.left === n ? q : q + 1;
		}
		if (ts.isArrayLiteralExpression(p) || ts.isSpreadElement(p) || ts.isPropertyAssignment(p) || ts.isVariableDeclaration(p) || ts.isReturnStatement(p)
			|| ts.isThrowStatement(p) || ts.isIfStatement(p) || ts.isWhileStatement(p) || ts.isDoStatement(p) || ts.isForStatement(p) || ts.isForOfStatement(p)
			|| ts.isSwitchStatement(p) || ts.isCaseClause(p) || ts.isTemplateSpan(p) || ts.isElementAccessExpression(p) || ts.isArrowFunction(p)
			|| ts.isYieldExpression(p) || ts.isExpressionStatement(p)) return 3;
		return 20;
	};
	const wrap = (n) => { const k = kind(n), s = slot(n, k.prec); return s >= 0 && k.prec < s; };
	/** the parentheses around a rewritten assignment that is a statement of its own: dropped */
	const statementParens = (n) => {
		const p = n.parent;
		return ts.isParenthesizedExpression(p) && ts.isExpressionStatement(p.parent) && at(p) + 1 === at(n) && p.end - 1 === n.end
			? [[at(p), at(p) + 1, ""], [p.end - 1, p.end, ""]] : [];
	};
	const rewrite = (n) => {
		const k = kind(n);
		if (!k) return null;
		const a = ts.isCallExpression(n) ? n.arguments : null;
		if (k.k === "binary" || k.k === "ne") {
			if (ts.isExpressionStatement(n.parent)) return skip("an operator as a statement");
			const c = k.k === "ne" ? n.operand : n, a = c.arguments;
			const w = wrap(n), p = k.prec, l = prec(a[0]), r = prec(a[1]), rel = isRel(p);
			const wl = l < p || (k.op === "**" && l <= 16) || (rel && isRel(l)), wr = k.op === "**" ? r < p : r <= p || (rel && isRel(r));
			const mid = text.slice(a[0].end, at(a[1])), after = mid.slice(mid.indexOf(",") + 1) || " ";
			const m = [a[0].end, at(a[1]), `${wl ? ")" : ""} ${k.op}${after}${wr ? "(" : ""}`];
			anchors.push([at(c) + (c.expression.getText(sf).startsWith("rt.") ? 3 : 0), m, wl ? 2 : 1, k.op.length]);
			counts[k.k]++;
			return [[at(n), at(a[0]), `${w ? "(" : ""}${wl ? "(" : ""}`], m, [a[1].end, n.end, `${wr ? ")" : ""}${w ? ")" : ""}`]];
		}
		if (k.k === "neg") {
			const w = wrap(n), x = a[0], xk = kind(x);
			const wx = prec(x) < 16 || /^[-+]/.test(xk ? xk.op : x.getText(sf)) || (xk && xk.k === "binary" && xk.op === "**");
			const h = [at(n), at(x), `${w ? "(" : ""}-${wx ? "(" : ""}`];
			anchors.push([at(n) + 3, h, w ? 1 : 0, 1]);
			counts.neg++;
			return [h, [x.end, n.end, `${wx ? ")" : ""}${w ? ")" : ""}`]];
		}
		if (k.k === "modify") {
			const c = n.right, e = [n.left.end, at(c.arguments[1]), ` ${k.op} `];
			anchors.push([at(c) + 3, e, 1, k.op.length]);
			counts.modify++;
			return [e, [c.arguments[1].end, n.end, ""], ...statementParens(n)];
		}
		if (k.k === "inc") {
			const x = n.left.getText(sf), p = n.parent, own = ts.isExpressionStatement(p);
			if (!own && !ts.isExpressionStatement(p.parent) && slot(p, 16) > 16) return skip("++x where it can't stand");
			const e = own || ts.isExpressionStatement(p.parent) ? [own ? at(n) : at(p), own ? n.end : p.end, `${x}${k.op}`] : [at(p), p.end, `${k.op}${x}`];
			anchors.push([at(n.right) + 3, e, own || ts.isExpressionStatement(p.parent) ? x.length : 0, 2]);
			counts.inc++;
			return [e];
		}
		const w = wrap(n), o = k.k === "modField" || k.k === "incField" ? a[1] : null, nm = (k.k === "modField" || k.k === "incField" ? a[2] : a[1]).text;
		const open = w ? "(" : "", close = w ? ")" : "", par = w ? [] : statementParens(n);
		if (k.k === "modSrcVar") {
			const h = [at(n), at(a[2]), `${open}this.${nm} ${k.op} `];
			anchors.push([at(n) + 3, h, open.length + nm.length + 6, k.op.length]);
			counts.modSrcVar++;
			return [h, [a[2].end, n.end, close], ...par];
		}
		if (k.k === "modField") {
			const m = [o.end, at(a[3]), `.${nm} ${k.op} `];
			anchors.push([at(n) + 3, m, nm.length + 2, k.op.length]);
			counts.modField++;
			return [[at(n), at(o), open], m, [a[3].end, n.end, close], ...par];
		}
		const post = bool(k.k === "incSrcVar" ? a[3] : a[4]);
		if (k.k === "incSrcVar") {
			const e = [at(n), n.end, `${open}${post ? `this.${nm}${k.op}` : `${k.op}this.${nm}`}${close}`];
			anchors.push([at(n) + 3, e, open.length + (post ? nm.length + 5 : 0), 2]);
			counts.incSrcVar++;
			return [e, ...par];
		}
		const h = [at(n), at(o), `${open}${post ? "" : k.op}`], t = [o.end, n.end, `${post ? `.${nm}${k.op}` : `.${nm}`}${close}`];
		if (post) anchors.push([at(n) + 3, t, nm.length + 1, 2]); else anchors.push([at(n) + 3, h, open.length, 2]);
		counts.incField++;
		return [h, t, ...par];
	};
	return rewrite;
});
