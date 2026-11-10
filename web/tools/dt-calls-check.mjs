#!/usr/bin/env node
// dt-calls-check.mjs - Proof for a dt-calls run (detranslate step 8): the bundle the rewritten game files make is the old bundle, call for call.
// Usage (from web/): node tools/dt-calls-check.mjs OLD_GAME_JS OLD_LINES_JSON   (after node tools/translate-tg.mjs on the new source)
//   OLD_GAME_JS: a copy of build/game-js and OLD_LINES_JSON of build/translated-tg.lines.json, both made by translate-tg.mjs from the
//   source before the robot ran. Compares them with build/game-js and build/translated-tg.lines.json.
// Code: each file's JS as tokens, with every cached call site written one way (`$.sK` / `$M.sK` by its methodSite kind: g.srcCall's
// spread values and g.callSrc's array are the same call, and so are callName on this and callSrc), parentheses around a call's
// receiver dropped. Any other difference is printed and fails.
// DM lines: every column in a changed file's rows of the line table must sit on (or just before) the same token of that list in
// both bundles (a call site counts as sitting on its sK, where V8 reports it); a row that differs is printed and fails. Where a
// robot removed lines (dt-loops), an entry's line may differ: a line-start entry whose line moved is compared by its token too.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";
import { selfAssignment } from "./proc-calls.mjs";

const web = resolve(import.meta.dirname, "..");
const [oldDir, oldLines] = process.argv.slice(2);
if (!oldLines) { console.error("usage: node tools/dt-calls-check.mjs OLD_GAME_JS OLD_LINES_JSON"); process.exit(2); }
const newDir = resolve(web, "build/game-js");
const files = [];
const walk = (d) => { for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walk(p); else if (e.endsWith(".js")) files.push(relative(newDir, p)); } };
walk(newDir);

/** The site kinds of a file's `const $ = {s0: rt.methodSite("n"), ...}` and `$M` tables. */
const siteKinds = (text) => {
	const out = { $: [], $M: [] };
	for (const m of text.matchAll(/const (\$M?) = \{([^}]*)\};/g)) out[m[1]] = [...m[2].matchAll(/s(\d+): rt\.methodSite\("(\w)"\)/g)].map((x) => x[2]);
	return out;
};
/** the file's tokens, call sites written one way, the site tables left out; at[i] = token i's position (-1: one written here) */
function canon(text) {
	const sf = ts.createSourceFile("x.js", text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS), kinds = siteKinds(text), toks = [], at = [];
	const out = { push: (...s) => { for (const x of s) { toks.push(x); at.push(-1); } } };
	const unparen = (n) => { while (ts.isParenthesizedExpression(n)) n = n.expression; return n; };
	const optional = (n) => { for (; n; n = n.expression) { if (n.questionDotToken) return true; if (!ts.isCallExpression(n) && !ts.isPropertyAccessExpression(n) && !ts.isElementAccessExpression(n)) return false; } return false; };
	const assigns = (e) => ts.isBinaryExpression(e) && e.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && e.operatorToken.kind <= ts.SyntaxKind.LastAssignment;
	/** parentheses that change nothing (dt-ops writes some and drops others): around a whole call argument (not a comma list), around
	 * a call (not new's callee, not an optional chain), around an assignment that is a statement of its own */
	const redundant = (n) => {
		const p = n.parent, e = n.expression;
		if ((ts.isCallExpression(p) || ts.isNewExpression(p)) && p.arguments?.includes(n)) return !(ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.CommaToken);
		if (ts.isCallExpression(e)) return !optional(e) && !(ts.isNewExpression(p) && p.expression === n);
		// yield* in a slot that takes any expression but a comma list (the bundle adds parentheses around a yield* it writes, dt-yields)
		if (ts.isYieldExpression(e) && (ts.isReturnStatement(p) || ts.isVariableDeclaration(p) || ts.isArrayLiteralExpression(p) || ts.isPropertyAssignment(p)
			|| ts.isExpressionStatement(p) || ts.isIfStatement(p) || ts.isWhileStatement(p) || ts.isDoStatement(p) || ts.isSwitchStatement(p) || ts.isCaseClause(p)
			|| ts.isForStatement(p) || ts.isForOfStatement(p) || ts.isThrowStatement(p) || ts.isTemplateSpan(p) || ts.isSpreadElement(p)
			|| (ts.isElementAccessExpression(p) && p.argumentExpression === n) || (ts.isConditionalExpression(p) && p.condition !== n)
			|| (ts.isArrowFunction(p) && p.body === n) || (ts.isBinaryExpression(p) && p.right === n && p.operatorToken.kind >= ts.SyntaxKind.FirstAssignment
				&& p.operatorToken.kind <= ts.SyntaxKind.LastAssignment))) return true;
		return ts.isExpressionStatement(p) && assigns(e) && !ts.isObjectLiteralExpression(e.left) && !ts.isArrayLiteralExpression(e.left);
	};
	const emit = (n) => {
		if (ts.isParenthesizedExpression(n) && redundant(n)) return emit(n.expression);
		if (selfAssignment(n)) return; // `$0 = $0;`, a no-op dt-filler drops

		if (ts.isVariableStatement(n) && n.declarationList.declarations.every((d) => ts.isIdentifier(d.name) && (d.name.text === "$" || d.name.text === "$M"))) return;
		if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && ts.isIdentifier(n.expression.expression)
			&& (n.expression.expression.text === "$" || n.expression.expression.text === "$M") && /^s\d+$/.test(n.expression.name.text)) {
			const k = kinds[n.expression.expression.text][+n.expression.name.text.slice(1)], a = n.arguments;
			let recv, name, vals;
			if (k === "n" || k === "N") { recv = unparen(a[1]); name = a[2]; vals = a[3]; }
			else { recv = null; name = a[1]; vals = k === "t" ? a.slice(2) : a[2]; }
			if (recv && recv.kind === ts.SyntaxKind.ThisKeyword) recv = null;
			toks.push(`CALL:${k === k.toLowerCase() ? "g" : "rt"}(`); at.push(n.expression.name.getStart(sf));
			emit(a[0]);
			out.push(",");
			if (recv) emit(recv); else out.push("SRC");
			out.push(",");
			toks.push(name.getText(sf)); at.push(name.getStart(sf));
			out.push(",[");
			if (Array.isArray(vals)) vals.forEach((v, i) => { if (i) out.push(","); emit(v); });
			else if (vals && ts.isArrayLiteralExpression(vals)) vals.elements.forEach((v, i) => { if (i) out.push(","); emit(v); });
			else if (vals) { out.push("..."); emit(vals); }
			out.push("])");
			return;
		}
		const kids = n.getChildren(sf);
		// a string by its value (dt-text writes fmt's text with JSON's escapes, the translator may have used others)
		if (ts.isStringLiteral(n)) { toks.push(`S:${JSON.stringify(n.text)}`); at.push(n.getStart(sf)); return; }
		if (kids.length === 0) { if (n.kind !== ts.SyntaxKind.EndOfFileToken && n.kind !== ts.SyntaxKind.SyntaxList) { toks.push(n.getText(sf)); at.push(n.getStart(sf)); } return; }
		for (const k of kids) emit(k);
	};
	emit(sf);
	return { toks, at };
}
/** for the canon c of text: the index of the first written token at or after (line, col) (line 1-based) */
function tokenAt(c, text, line, col) {
	if (!c.lines) { c.lines = [0]; for (let i = 0; i < text.length; i++) if (text[i] === "\n") c.lines.push(i + 1); }
	const p = c.lines[line - 1] + col;
	const real = c.real ??= c.at.map((x, i) => [x, i]).filter(([x]) => x >= 0);
	let lo = 0, hi = real.length;
	while (lo < hi) { const m = (lo + hi) >> 1; if (real[m][0] < p) lo = m + 1; else hi = m; }
	return lo < real.length ? real[lo][1] : c.toks.length;
}

let changed = 0, bad = 0;
const changedFiles = new Map(); // game file -> { a, b, x, y }: old and new text and canon
for (const rel of files) {
	const a = readFileSync(resolve(oldDir, rel), "utf8"), b = readFileSync(resolve(newDir, rel), "utf8");
	if (a === b) continue;
	changed++;
	const cx = canon(a), cy = canon(b), x = cx.toks, y = cy.toks;
	changedFiles.set(rel.replace(/\.js$/, ".ts"), { a, b, cx, cy });
	let i = 0;
	while (i < x.length && i < y.length && x[i] === y[i]) i++;
	if (i === x.length && i === y.length) continue;
	bad++;
	console.log(`${rel}: differs at token ${i}: old ...${x.slice(Math.max(0, i - 8), i + 8).join(" ")}\n    new ...${y.slice(Math.max(0, i - 8), i + 8).join(" ")}`);
}
console.log(`code: ${changed} files changed, ${changed - bad} the same call for call, ${bad} not`);

const L0 = JSON.parse(readFileSync(oldLines, "utf8")), L1 = JSON.parse(readFileSync(resolve(web, "build/translated-tg.lines.json"), "utf8"));
// files whose code is the same but whose DM line rows moved (a robot whose spelling lowers to the same text) are compared too
for (const [key, e1] of Object.entries(L1.dm)) {
	const file = key.split("|")[0];
	if (changedFiles.has(file) || JSON.stringify(L0.dm[key]) === JSON.stringify(e1)) continue;
	const a = readFileSync(resolve(oldDir, file.replace(/\.ts$/, ".js")), "utf8"), cx = canon(a);
	changedFiles.set(file, { a, b: a, cx, cy: cx });
}
const defsOf = (L, file) => L.defs[L.files.indexOf(file)];
let rows = 0, cols = 0, badRows = 0, stale = 0;
/** the token of `line` that starts at column col (comments and spaces aren't tokens), or null */
const rawToken = (line, col) => {
	const sc = ts.createScanner(ts.ScriptTarget.ES2022, true, ts.LanguageVariant.Standard, line);
	for (let k = sc.scan(); k !== ts.SyntaxKind.EndOfFileToken; k = sc.scan()) {
		if (sc.getTokenStart() === col) return sc.getTokenText();
		if (sc.getTokenStart() > col) return null;
	}
	return null;
};
for (const [key, e1] of Object.entries(L1.dm)) {
	const [file, rest] = key.split("|");
	if (!changedFiles.has(file)) continue;
	const e0 = L0.dm[key];
	rows++;
	const path = rest.replace(/#\d+$/, ""), nth = +(rest.match(/#(\d+)$/)?.[1] ?? 1);
	const defLine = (defs) => { let c = 0; for (let i = 0; i < defs.length; i += 2) if (defs[i + 1] === path && ++c === nth) return defs[i]; return -1; };
	const d0 = defLine(defsOf(L0, file)), d1 = defLine(defsOf(L1, file)), { a, b, cx, cy } = changedFiles.get(file);
	const why = [];
	if (!e0 || e0.length !== e1.length || (d0 < 0) !== (d1 < 0)) why.push("rows differ in shape");
	else for (let i = 2; i < e1.length; i += 3) {
		if (e0[i + 2] !== e1[i + 2]) { why.push(`entry ${i} DM lines differ`); continue; }
		const c0 = e0[i + 1], c1 = e1[i + 1];
		if (c0 === 0 && c1 === 0 && d0 + e0[i] === d1 + e1[i]) continue;
		cols++;
		const p0 = c0 < 0 ? -1 - c0 : c0, p1 = c1 < 0 ? -1 - c1 : c1;
		const n0 = tokenAt(cx, a, d0 + e0[i], p0), n1 = tokenAt(cy, b, d1 + e1[i], p1);
		// a column that moved within one call's head (`$M.sK(f, this, ` -> `$M.sK(f, `: the dropped `this` it sat after)
		const head = (lo, hi) => cx.toks[lo]?.startsWith("CALL:") && cx.toks.slice(lo + 1, hi).every((x) => x === "f" || x === "," || x === "SRC");
		if ((c0 < 0) === (c1 < 0) && n0 !== n1 && head(Math.min(n0, n1), Math.max(n0, n1))) continue;
		// on a call's `)` before, on its `]` now: dt-calls writes both as the `)` of `x(a)`, and the bundle's `])` puts that on the `]`
		if (c0 > 0 && c1 > 0 && n1 === n0 - 1 && cx.toks[n0] === ")" && cx.toks[n1] === "]") continue;
		// a line boundary moved across brackets, commas, `yield*` and an operator passed as a value only (dt-ops: on an operator call's
		// `)` or its `, add)` tail, which the source no longer has, before; at its edge now): no error is reported on those, so it finds
		// the same DM line; likewise across `!isEqual(` (dt-ops 9i: isEqual never throws)
		if (c0 > 0 && c1 > 0 && n0 !== n1 && cx.toks.slice(Math.min(n0, n1), Math.max(n0, n1)).every((x) => /^[()\],.*!]+$|^(rt|add|subtract|multiply|divide|modulus|yield|isEqual)$/.test(x))) continue;
		// stale columns of procs edited by hand (past the line's end, mid-token, on a comment or space: no token to keep), and exact
		// columns on no name in either bundle (punctuation: they can't match an error's position in either): only counted
		if ((c0 < 0) === (c1 < 0) && n0 !== n1 && c0 !== 0) {
			const l0 = a.split("\n")[d0 + e0[i] - 1] ?? "", l1 = b.split("\n")[d1 + e1[i] - 1] ?? "";
			// any name but an object before a method's `.` (V8 reports g.new_() at new_, $.s0() at s0): $g (a var read), add... are calls
			const isCall = (x) => x !== null && /^[A-Za-z_$][\w$]*$/.test(x) && !/^(rt|g|\$|\$M)$/.test(x);
			if (c0 > 0 ? rawToken(l0, p0) === null : !isCall(rawToken(l0, p0)) && !isCall(rawToken(l1, p1))) { stale++; continue; }
		}
		if ((c0 < 0) !== (c1 < 0) || n0 !== n1) {
			const l0 = a.split("\n")[d0 + e0[i] - 1] ?? "", l1 = b.split("\n")[d1 + e1[i] - 1] ?? "";
			why.push(`line +${e1[i]}: old col ${p0} (token ${n0}) |${l0.slice(p0, p0 + 24)}| new col ${p1} (${n1}) |${l1.slice(p1, p1 + 24)}|`);
		}
	}
	if (why.length) { badRows++; if (badRows <= 20) console.log(`${key}: ${why.join("; ")}`); }
}
console.log(`DM lines: ${rows} rows of changed files (code or rows), ${cols} columns, ${badRows} rows not on the same tokens (${stale} stale columns moved, not compared)`);
if (bad || badRows) { console.log("dt-calls-check: FAILED"); process.exit(1); }
console.log("dt-calls-check: OK");
