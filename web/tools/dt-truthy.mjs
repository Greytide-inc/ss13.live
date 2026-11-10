#!/usr/bin/env node
// dt-truthy.mjs - Detranslate robot (plans/archive/detranslate.md step 5): drops truthy() wherever only true/false is used.
// Usage (from web/): node tools/dt-truthy.mjs [--check] [FILE...]   (no FILE: every .ts under game/, plus src/translate/fast-air.ts)
//   --check changes nothing, prints what it would do. Afterwards: node tools/remap-dm-cols.mjs HEAD.
// truthy(x) is !!x (value.ts isTruthy, since step 3), so wherever a value is only tested, x tests the same: no proof needed.
// Tested places: the condition of if/while/do/for and of `c ? a : b`, the operand of `!`, the argument of truthy() itself, and
// both sides of && / || when the && / || is itself tested. In one:
//   truthy(x)    -> x
//   (c ? 1 : 0)  -> c     (how the translator wrote DM's istype(), in, ...)
//   (x)          -> x     parentheses are dropped, then put back where JS precedence needs them (always around `??` next to &&/||)
// Elsewhere truthy stays (its value is a real true/false, `a = truthy(b)`), but its argument is a tested place.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";

const web = resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const targets = process.argv.slice(2).filter((a) => a !== "--check");
const files = [];
if (targets.length) files.push(...targets.map((t) => resolve(t)));
else {
	const walk = (d) => { for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walk(p); else if (e.endsWith(".ts")) files.push(p); } };
	walk(resolve(web, "game"));
	files.push(resolve(web, "src/translate/fast-air.ts"));
}

const K = ts.SyntaxKind;
const BIN = new Map([
	[K.AsteriskAsteriskToken, 14], [K.AsteriskToken, 13], [K.SlashToken, 13], [K.PercentToken, 13], [K.PlusToken, 12], [K.MinusToken, 12],
	[K.LessThanLessThanToken, 11], [K.GreaterThanGreaterThanToken, 11], [K.GreaterThanGreaterThanGreaterThanToken, 11],
	[K.LessThanToken, 10], [K.GreaterThanToken, 10], [K.LessThanEqualsToken, 10], [K.GreaterThanEqualsToken, 10], [K.InstanceOfKeyword, 10], [K.InKeyword, 10],
	[K.EqualsEqualsToken, 9], [K.ExclamationEqualsToken, 9], [K.EqualsEqualsEqualsToken, 9], [K.ExclamationEqualsEqualsToken, 9],
	[K.AmpersandToken, 8], [K.CaretToken, 7], [K.BarToken, 6], [K.AmpersandAmpersandToken, 5], [K.BarBarToken, 4], [K.QuestionQuestionToken, 4],
	[K.CommaToken, 1],
]);
const TIGHT = new Set([K.ParenthesizedExpression, K.Identifier, K.ThisKeyword, K.SuperKeyword, K.NumericLiteral, K.BigIntLiteral, K.StringLiteral,
	K.NoSubstitutionTemplateLiteral, K.TemplateExpression, K.RegularExpressionLiteral, K.TrueKeyword, K.FalseKeyword, K.NullKeyword,
	K.PropertyAccessExpression, K.ElementAccessExpression, K.CallExpression, K.NewExpression, K.ArrayLiteralExpression, K.ObjectLiteralExpression,
	K.NonNullExpression, K.TaggedTemplateExpression]);
const UNARY = new Set([K.PrefixUnaryExpression, K.TypeOfExpression, K.VoidExpression, K.DeleteExpression, K.AwaitExpression]);
// how tightly n binds (higher = tighter); assignment, yield, arrows and anything unknown: 2
const prec = (n) => TIGHT.has(n.kind) ? 20 : n.kind === K.PostfixUnaryExpression ? 16 : UNARY.has(n.kind) ? 15
	: n.kind === K.AsExpression || n.kind === K.SatisfiesExpression ? 10 : ts.isBinaryExpression(n) ? BIN.get(n.operatorToken.kind) ?? 2
	: n.kind === K.ConditionalExpression ? 3 : 2;
const opOf = (n) => (ts.isBinaryExpression(n) ? n.operatorToken.kind : null);
// a tested result t ({text, prec, op}) as the text for a place: "cond" (statement condition, call argument), "tern" (c of c ? a : b),
// "not" (operand of !), "and"/"or" (a side of && / ||)
const fit = (t, place) => {
	const ok = place === "cond" ? t.prec >= 2 : place === "tern" ? t.prec >= 4 : place === "not" ? t.prec >= 15
		: place === "and" ? t.prec > 5 || t.op === K.AmpersandAmpersandToken : t.prec > 4 || t.op === K.BarBarToken;
	return ok ? t.text : `(${t.text})`;
};
const isTruthy = (n) => ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "truthy" && !n.questionDotToken
	&& n.arguments.length === 1 && !ts.isSpreadElement(n.arguments[0]);
const isNum = (n, v) => ts.isNumericLiteral(n) && n.text === v;
const isBool01 = (n) => ts.isConditionalExpression(n) && isNum(n.whenTrue, "1") && isNum(n.whenFalse, "0");
const isNot = (n) => ts.isPrefixUnaryExpression(n) && n.operator === K.ExclamationToken;
const isAndOr = (n) => ts.isBinaryExpression(n) && (n.operatorToken.kind === K.AmpersandAmpersandToken || n.operatorToken.kind === K.BarBarToken);
// the place child k fills in n when only its true/false is used there, else null
const placeOf = (n, k) => ((ts.isIfStatement(n) || ts.isWhileStatement(n) || ts.isDoStatement(n)) && k === n.expression)
	|| (ts.isForStatement(n) && k === n.condition) || (isTruthy(n) && k === n.arguments[0]) ? "cond"
	: ts.isConditionalExpression(n) && k === n.condition ? "tern" : isNot(n) ? "not" : null;

let total = { truthy: 0, bool01: 0, files: 0 };
for (const file of files) {
	const rel = relative(web, file);
	const text = readFileSync(file, "utf8");
	if (!text.includes("truthy(") && !text.includes("? 1 : 0")) continue;
	const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
	const counts = { truthy: 0, bool01: 0 };
	const slice = (n) => text.slice(n.getStart(sf), n.end);
	const splice = (s, base, edits) => { for (const [a, b, r] of edits.sort((x, y) => y[0] - x[0])) s = s.slice(0, a - base) + r + s.slice(b - base); return s; };
	// [start, end, text] for each child of n that changed
	const editsIn = (n) => {
		const out = [];
		ts.forEachChild(n, (k) => {
			const place = placeOf(n, k);
			let r;
			if (place) { const t = tested(k); r = t.changed ? fit(t, place) : null; if (r === slice(k)) r = null; } else r = render(k);
			if (r !== null) out.push([k.getStart(sf), k.end, r]);
		});
		return out;
	};
	// n's text with the rewrites inside it, or null if there are none
	const render = (n) => { const e = editsIn(n); return e.length ? splice(slice(n), n.getStart(sf), e) : null; };
	// n where only its true/false is used: {text, prec, op, changed}
	const tested = (n) => {
		if (isTruthy(n)) { counts.truthy++; return { ...tested(n.arguments[0]), changed: true }; }
		if (ts.isParenthesizedExpression(n)) return { ...tested(n.expression), changed: true };
		if (isBool01(n)) { counts.bool01++; return { ...tested(n.condition), changed: true }; }
		if (isNot(n)) {
			const t = tested(n.operand);
			return t.changed ? { text: "!" + fit(t, "not"), prec: 15, op: null, changed: true } : { text: slice(n), prec: 15, op: null, changed: false };
		}
		if (isAndOr(n)) {
			const place = n.operatorToken.kind === K.AmpersandAmpersandToken ? "and" : "or", l = tested(n.left), r = tested(n.right);
			const text1 = !l.changed && !r.changed ? slice(n)
				: (l.changed ? fit(l, place) : slice(n.left)) + text.slice(n.left.end, n.right.getStart(sf)) + (r.changed ? fit(r, place) : slice(n.right));
			return { text: text1, prec: prec(n), op: opOf(n), changed: l.changed || r.changed };
		}
		const r = render(n);
		return { text: r ?? slice(n), prec: prec(n), op: opOf(n), changed: r !== null };
	};
	const edits = editsIn(sf);
	if (edits.length === 0) continue;
	total.truthy += counts.truthy; total.bool01 += counts.bool01; total.files++;
	if (targets.length) console.log(`${rel}: truthy(x) -> x ${counts.truthy}, (c ? 1 : 0) -> c ${counts.bool01}`);
	if (check) continue;
	writeFileSync(file, splice(text, 0, edits));
}
console.log(`${total.files} files: truthy(x) -> x ${total.truthy}, (c ? 1 : 0) -> c ${total.bool01}${check ? " (--check: nothing written)" : ""}`);
