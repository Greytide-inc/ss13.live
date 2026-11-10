#!/usr/bin/env node
// pb-temps.mjs - Phrasebook step 12 robot (plans/phrasebook.md): folds the translator's `$N` scratch values out of web/game procs.
// Usage (from web/): node tools/pb-temps.mjs [--check] [FILE...]      none: every game file. --check changes nothing, prints counts and why a `$N` stayed.
// Three rules, each only where the order of evaluation is provably the old one (the changed JS is checked by dt-diff, gas-diff and a boot):
//   fold     `$0 = E;` then a statement that reads `$0` once, in its head (an expression statement, `if (...)` condition, return, `let` initializer):
//            E goes where `$0` was and the line goes. Everything evaluated before that place must be inert (literals, `this`, locals E does not
//            assign; property reads only when E has no call), no `&&`/`||`/`?:` between, no `yield` in the head, nothing reads `$0` afterwards.
//   subject  `$0 = E;` then an if / else-if chain that compares `$0` in its conditions (conditions with no call but rt.inRange): E a plain
//            local or `this.x` chain: the chain reads E itself; any other E: `const NAME = E;` with NAME from E (rt.index(m, "command") -> command).
//   decl     `let $0: any;` lines for names nothing reads or writes any more.
// "Nothing reads it afterwards" is dominance: every other read of `$0` in the proc comes after a different `$0 = ...;` statement that
// sits in the same block or an enclosing one (so every path to it passes that write). Procs with `$0` in a nested function or updated with
// `+=`/`++` are left. The DM line table (game/_dm-lines.json) follows: a moved E keeps its DM line for its columns and errors, the lines
// after a removed one move up, a removed line's "from here on" value goes to the next line.
// translate-tg's varsCut (f.vars) leaves out a top-level `const` that only its next if-chain reads (a subject), so f.vars keeps its anchor.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { callee } from "./dt-robot.mjs";
import { procNameSets } from "./proc-calls.mjs";
import { colOf, defLine, dmText, encodeCol, parseDm, splitKey } from "./remap-dm-cols.mjs";

const web = resolve(import.meta.dirname, "..");
const TEMP = /^\$\d+$/;
const K = ts.SyntaxKind;

const walkTs = (d, out = []) => {
	for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walkTs(p, out); else if (e.endsWith(".ts") && !e.endsWith(".d.ts")) out.push(p); }
	return out;
};

// ---- names a new const must not take
const RESERVED = new Set("break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield let static implements interface package private protected public await async of type as is any string number boolean symbol undefined arguments eval f g rt T P GLOB live truthy isEqual add subtract multiply divide fmt Frame Value".split(" "));
let globalNames = null;
async function loadGlobalNames() {
	if (globalNames) return globalNames;
	const s = new Set([...RESERVED, ...Object.getOwnPropertyNames(globalThis)]);
	const rtMod = await import(pathToFileURL(resolve(web, "build/dist/src/translate/runtime.js")).href);
	for (const k of Object.keys(rtMod)) s.add(k);
	const { globalProcs } = procNameSets(resolve(web, "game"));
	for (const n of globalProcs) s.add(n);
	for (const m of readFileSync(resolve(web, "game/_defines.d.ts"), "utf8").matchAll(/declare \w+ (\w+)/g)) s.add(m[1]);
	return (globalNames = s);
}

// ---- small syntax helpers
const isFnLike = (n) => ts.isArrowFunction(n) || ts.isFunctionExpression(n) || ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n);
const within = (n, outer) => n.pos >= outer.pos && n.end <= outer.end;
const contains = (n, r) => r.pos >= n.pos && r.end <= n.end;
const isTemp = (n) => ts.isIdentifier(n) && TEMP.test(n.text);
const ASSIGN_OPS = (k) => k >= K.FirstAssignment && k <= K.LastAssignment;
/** `$N = E;` as a statement -> { name, rhs, left }, else null */
const tempWrite = (st) => {
	if (!ts.isExpressionStatement(st)) return null;
	const b = st.expression;
	return ts.isBinaryExpression(b) && b.operatorToken.kind === K.EqualsToken && isTemp(b.left) ? { name: b.left.text, rhs: b.right, left: b.left } : null;
};
const hasKind = (n, pred) => { let f = false; const v = (k) => { if (f) return; if (pred(k)) f = true; else ts.forEachChild(k, v); }; v(n); return f; };
/** no call, new, yield, assignment, update, delete, function: reading it twice or moving it changes nothing but its own value */
const effectFree = (n) => !hasKind(n, (k) => ts.isCallExpression(k) || ts.isNewExpression(k) || ts.isYieldExpression(k) || ts.isAwaitExpression(k) || isFnLike(k) || ts.isTaggedTemplateExpression(k)
	|| ts.isDeleteExpression(k) || ts.isBinaryExpression(k) && ASSIGN_OPS(k.operatorToken.kind)
	|| (ts.isPrefixUnaryExpression(k) || ts.isPostfixUnaryExpression(k)) && (k.operator === K.PlusPlusToken || k.operator === K.MinusMinusToken));
const assignedNames = (n, out = new Set()) => {
	const v = (k) => {
		if (ts.isBinaryExpression(k) && ASSIGN_OPS(k.operatorToken.kind) && ts.isIdentifier(k.left)) out.add(k.left.text);
		if ((ts.isPrefixUnaryExpression(k) || ts.isPostfixUnaryExpression(k)) && ts.isIdentifier(k.operand)) out.add(k.operand.text);
		ts.forEachChild(k, v);
	};
	v(n);
	return out;
};

/** the functions of a game file: rt.def (owner { path, nth }) and rt.tail (owner null, no DM rows) */
function procFunctions(sf) {
	const out = [], nth = new Map();
	for (const st of sf.statements) {
		if (!ts.isExpressionStatement(st) || !ts.isCallExpression(st.expression)) continue;
		const c = st.expression, k = callee(c), [p, fn] = c.arguments;
		if (k === "rt.def" && p && ts.isStringLiteral(p) && fn && ts.isFunctionExpression(fn)) { const n = (nth.get(p.text) ?? 0) + 1; nth.set(p.text, n); out.push({ fn, owner: { path: p.text, nth: n } }); }
		else if (k === "rt.tail" && fn && ts.isFunctionExpression(fn)) out.push({ fn, owner: null });
	}
	return out;
}

// ---- analysing one function
/** per `$N` name: its refs [{ n, role, nested }]; `bad`: names too complex to touch */
function collectRefs(body) {
	const refs = new Map(), bad = new Set();
	const v = (n, nested) => {
		if (isTemp(n)) {
			const p = n.parent;
			let role = "read";
			if (ts.isVariableDeclaration(p) && p.name === n) role = "decl";
			else if (ts.isBinaryExpression(p) && p.left === n && ASSIGN_OPS(p.operatorToken.kind)) role = p.operatorToken.kind === K.EqualsToken && ts.isExpressionStatement(p.parent) ? "write" : "upd";
			else if ((ts.isPrefixUnaryExpression(p) || ts.isPostfixUnaryExpression(p)) && (p.operator === K.PlusPlusToken || p.operator === K.MinusMinusToken)) role = "upd";
			else if (ts.isShorthandPropertyAssignment(p) || (ts.isForOfStatement(p) && p.initializer === n)) role = "upd";
			(refs.get(n.text) ?? refs.set(n.text, []).get(n.text)).push({ n, role, nested });
			if (nested || role === "upd") bad.add(n.text);
		}
		if (ts.isBinaryExpression(n) && n.operatorToken.kind === K.EqualsToken && (ts.isArrayLiteralExpression(n.left) || ts.isObjectLiteralExpression(n.left)))
			hasKind(n.left, (k) => { if (isTemp(k)) bad.add(k.text); return false; });
		ts.forEachChild(n, (c) => v(c, nested || isFnLike(c)));
	};
	ts.forEachChild(body, (c) => v(c, isFnLike(c)));
	return { refs, bad };
}

const isLoop = (n) => ts.isWhileStatement(n) || ts.isForStatement(n) || ts.isForOfStatement(n) || ts.isDoStatement(n);
/** the `name = ...;` statements (other than w) that sit before statement t in its block */
const writesBefore = (p, t, w, name) => (ts.isBlock(p) ? p.statements.slice(0, p.statements.indexOf(t)).filter((st) => st !== w && tempWrite(st)?.name === name) : []);
/**
 * May the value written by statement w reach read r? w's own lifetime ends at endPos (the end of the statement that reads it).
 * After w: no, if a later write (positioned after endPos) sits before r's statement in a block around r: every path into r passes it.
 * Before w (a loop's next round): only when a loop holds both; then no, if such a write sits inside the innermost loop holding both.
 */
function mayReach(r, w, endPos, name) {
	if (within(r, w)) return false; // E's own read sees the old value
	if (r.pos >= w.end) {
		for (let t = r; t.parent && !isFnLike(t.parent); t = t.parent) if (writesBefore(t.parent, t, w, name).some((st) => st.pos >= endPos)) return false;
		return true;
	}
	let loop = null;
	for (let a = w.parent; a && !isFnLike(a); a = a.parent) if (isLoop(a) && contains(a, r)) { loop = a; break; }
	if (!loop) return false;
	for (let t = r; t.parent && t !== loop; t = t.parent) if (contains(loop, t.parent) && writesBefore(t.parent, t, w, name).length) return false;
	return true;
}
/** a read inside s that follows a write inside s (so it does not see w's value) */
function killedInside(r, s, w, name) {
	for (let t = r; t.parent && t !== s; t = t.parent) if (writesBefore(t.parent, t, w, name).some((st) => within(st, s))) return true;
	return false;
}

let SKIP = {}, cur = {};
const skip = (why) => { cur[why] = (cur[why] ?? 0) + 1; return null; };

const parenSafeParent = (r) => {
	const p = r.parent;
	return ts.isCallExpression(p) && p.arguments.includes(r) || ts.isArrayLiteralExpression(p) || ts.isTemplateSpan(p) || ts.isParenthesizedExpression(p) || ts.isIfStatement(p)
		|| ts.isReturnStatement(p) || ts.isVariableDeclaration(p) || ts.isExpressionStatement(p) || ts.isPropertyAssignment(p) || ts.isBinaryExpression(p) && ASSIGN_OPS(p.operatorToken.kind) && p.right === r;
};
const needsParens = (E, r) => {
	if (ts.isIdentifier(E) || ts.isLiteralExpression(E) || ts.isCallExpression(E) || ts.isPropertyAccessExpression(E) || ts.isElementAccessExpression(E) || ts.isTemplateExpression(E)
		|| ts.isParenthesizedExpression(E) || ts.isArrayLiteralExpression(E) || E.kind === K.ThisKeyword || E.kind === K.NullKeyword || E.kind === K.TrueKeyword || E.kind === K.FalseKeyword) return false;
	return !parenSafeParent(r);
};

/** why the fold is not allowed, or null: walk the head of the reading statement in evaluation order up to r */
function foldBlocker(head, r, efree, assigned) {
	if (hasKind(head, (k) => ts.isYieldExpression(k) || ts.isAwaitExpression(k))) return "yield in the reading statement";
	const inert = (n) => {
		if (ts.isIdentifier(n)) return !assigned.has(n.text);
		if (ts.isLiteralExpression(n) || n.kind === K.ThisKeyword || n.kind === K.NullKeyword || n.kind === K.TrueKeyword || n.kind === K.FalseKeyword) return true;
		if (ts.isParenthesizedExpression(n) || ts.isNonNullExpression(n) || ts.isAsExpression(n)) return inert(n.expression);
		if (ts.isPrefixUnaryExpression(n)) return n.operator !== K.PlusPlusToken && n.operator !== K.MinusMinusToken && inert(n.operand);
		if (ts.isBinaryExpression(n)) return !ASSIGN_OPS(n.operatorToken.kind) && n.operatorToken.kind !== K.CommaToken && inert(n.left) && inert(n.right);
		if (ts.isConditionalExpression(n)) return inert(n.condition) && inert(n.whenTrue) && inert(n.whenFalse);
		if (ts.isTemplateExpression(n)) return n.templateSpans.every((s) => inert(s.expression));
		if (ts.isArrayLiteralExpression(n)) return n.elements.every(inert);
		if (ts.isPropertyAccessExpression(n)) return efree && inert(n.expression);
		if (ts.isElementAccessExpression(n)) return efree && inert(n.expression) && inert(n.argumentExpression);
		return false;
	};
	let found = false, why = null;
	const bad = (w) => { if (!found && !why) why = w; };
	const visit = (n) => {
		if (found || why) return;
		if (n === r) { found = true; return; }
		if (!contains(n, r)) { if (!inert(n)) bad("a call or read before it"); return; }
		if (ts.isParenthesizedExpression(n) || ts.isNonNullExpression(n) || ts.isAsExpression(n)) return visit(n.expression);
		if (ts.isPrefixUnaryExpression(n) && n.operator !== K.PlusPlusToken && n.operator !== K.MinusMinusToken) return visit(n.operand);
		if (ts.isBinaryExpression(n)) {
			const op = n.operatorToken.kind;
			if (op === K.AmpersandAmpersandToken || op === K.BarBarToken || op === K.QuestionQuestionToken) { if (contains(n.right, r)) return bad("in a short-circuit"); return visit(n.left); }
			if (op === K.EqualsToken) {
				const l = n.left;
				if (contains(l, r)) return visit(ts.isPropertyAccessExpression(l) ? l.expression : l);
				if (ts.isPropertyAccessExpression(l)) visit(l.expression);
				else if (ts.isElementAccessExpression(l)) { visit(l.expression); visit(l.argumentExpression); }
				else if (!ts.isIdentifier(l)) bad("odd target");
				return visit(n.right);
			}
			if (ASSIGN_OPS(op)) { if (!contains(n.left, r) && !inert(n.left)) return bad("compound target read"); visit(n.left); return visit(n.right); }
			if (op === K.CommaToken) return bad("comma");
			visit(n.left); return visit(n.right);
		}
		if (ts.isConditionalExpression(n)) { if (!contains(n.condition, r)) return bad("in a ?: branch"); return visit(n.condition); }
		if (ts.isCallExpression(n)) {
			const c = n.expression;
			if (ts.isPropertyAccessExpression(c)) visit(c.expression); // the method's name lookup is no state read
			else if (!ts.isIdentifier(c)) visit(c);
			for (const a of n.arguments) visit(a);
			return;
		}
		if (ts.isPropertyAccessExpression(n)) return visit(n.expression);
		if (ts.isElementAccessExpression(n)) { visit(n.expression); return visit(n.argumentExpression); }
		if (ts.isTemplateExpression(n)) { for (const s of n.templateSpans) visit(s.expression); return; }
		if (ts.isArrayLiteralExpression(n)) { for (const e of n.elements) visit(ts.isSpreadElement(e) ? e.expression : e); return; }
		if (ts.isSpreadElement(n)) return visit(n.expression);
		if (ts.isPropertyAssignment(n)) return visit(n.initializer);
		if (ts.isObjectLiteralExpression(n)) { for (const p of n.properties) visit(p); return; }
		bad(`${ts.SyntaxKind[n.kind]} around it`);
	};
	visit(head);
	return why ?? (found ? null : "not found");
}

/** the expression of statement s that is evaluated first, or null if s is no fold target */
function headOf(s) {
	if (ts.isExpressionStatement(s)) return s.expression;
	if (ts.isIfStatement(s)) return s.expression;
	if (ts.isReturnStatement(s)) return s.expression ?? null;
	if (ts.isVariableStatement(s) && s.declarationList.declarations.length === 1 && s.declarationList.declarations[0].initializer) return s.declarationList.declarations[0].initializer;
	return null;
}

// ---- names from expressions
const CALL_NAMES = { rand: "die", pick: "chosen", round: "rounded", copytext: "text", fmt: "text", "rt.len": "length", "rt.at": "item", "rt.bitAnd": "flags", "rt.world": "world", "rt.initial": "initial", "rt.getStep": "step", "rt.op": "result" };
function nameFor(E) {
	let base = "subject";
	const ident = (s) => (/^[A-Za-z_]\w*$/.test(s) ? s : null);
	if (ts.isCallExpression(E)) {
		const c = E.expression.getText();
		if (c === "rt.index") {
			const a = E.arguments[1];
			base = a && ts.isStringLiteral(a) && ident(a.text) ? a.text : "item";
		} else base = CALL_NAMES[c] ?? ident(c.replace(/^.*\./, "").replace(/^get_/, "")) ?? "result";
	} else if (ts.isPropertyAccessExpression(E)) base = ident(E.name.text) ?? "subject";
	else if (ts.isStringLiteral(E) || ts.isTemplateExpression(E) || ts.isNoSubstitutionTemplateLiteral(E)) base = "text";
	else if (ts.isNumericLiteral(E)) base = "value";
	else if (ts.isIdentifier(E)) base = E.text;
	return base;
}

// ---- one pass over a file: the edits
/**
 * phase "fold" | "subject" | "decl". Returns the edits: { owner, kind, lines (touched), reps: [{line, s, e, text}], dels: [line],
 * move: { srcLine, srcS, srcE, dstLine, dstS, parens } | null } (lines and columns of the text as it was).
 */
function planPass(sf, phase, names, counts) {
	const pos = (p) => { const l = sf.getLineAndCharacterOfPosition(p); return [l.line, l.character]; };
	const lines = sf.text.split("\n"), edits = [], touched = new Set();
	const alone = (n) => { const [l, c0] = pos(n.getStart(sf)), [l2, c1] = pos(n.end); return l === l2 && lines[l].slice(0, c0).trim() === "" && lines[l].slice(c1).trim() === ""; };
	const push = (e) => { if (e.lines.some((l) => touched.has(l))) return false; for (const l of e.lines) touched.add(l); edits.push(e); return true; };
	const top = names.top(sf);
	for (const { fn, owner } of procFunctions(sf)) {
		const { refs, bad } = collectRefs(fn.body);
		if (refs.size === 0) continue;
		// a new const's name must be free where it lives (its block) and not hide anything declared above it
		const idsIn = (n, out = new Set()) => { hasKind(n, (k) => { if (ts.isIdentifier(k) && !(ts.isPropertyAccessExpression(k.parent) && k.parent.name === k)) out.add(k.text); return false; }); return out; };
		const declaredAbove = (B) => {
			const out = new Set([fn.name?.text ?? ""]);
			for (let a = B.parent; a; a = a.parent) {
				if (ts.isBlock(a)) for (const st of a.statements) { if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) idsIn(d.name, out); else if (ts.isFunctionDeclaration(st) && st.name) out.add(st.name.text); }
				else if (ts.isFunctionExpression(a) && a === fn) for (const p of a.parameters) idsIn(p.name, out);
				else if (ts.isForOfStatement(a) || ts.isForStatement(a)) idsIn(a.initializer ?? a, out);
				else if (ts.isCatchClause(a) && a.variableDeclaration) idsIn(a.variableDeclaration, out);
			}
			return out;
		};
		const takenName = (nm, B) => idsIn(B).has(nm) || declaredAbove(B).has(nm) || top.has(nm) || names.global.has(nm) || names.pending.some((p) => p.name === nm && (contains(p.block, B) || contains(B, p.block)));
		const hasClosure = hasKind(fn.body, isFnLike);
		const blocks = [fn.body]; // outer blocks first: they get the plain names
		hasKind(fn.body, (k) => { if (ts.isBlock(k)) blocks.push(k); return false; });
		const rd = (name) => refs.get(name) ?? [];
		if (phase === "decl") {
			for (const st of fn.body.statements) {
				if (!ts.isVariableStatement(st) || !(st.declarationList.flags & ts.NodeFlags.Let)) continue;
				const ds = st.declarationList.declarations;
				const drop = ds.filter((d) => ts.isIdentifier(d.name) && TEMP.test(d.name.text) && !d.initializer && !rd(d.name.text).some((r) => r.role !== "decl"));
				if (!drop.length) continue;
				if (!alone(st)) { skip("let line shared / multi-line"); continue; }
				const [line, c0] = pos(st.getStart(sf)), [, c1] = pos(st.end);
				counts.decl += drop.length;
				const keep = ds.filter((d) => !drop.includes(d));
				if (!keep.length) push({ owner, kind: "decl", lines: [line], reps: [], dels: [line], move: null });
				else push({ owner, kind: "decl", lines: [line], reps: [{ line, s: c0, e: c1, text: `let ${keep.map((d) => d.getText(sf)).join(", ")};` }], dels: [], move: null });
			}
			continue;
		}
		if (phase === "dead") { // `$0 = parent_proc();` and friends whose value nothing reads
			for (const B of blocks) for (const wst of B.statements) {
				const w = tempWrite(wst);
				if (!w || bad.has(w.name) || !alone(wst) || rd(w.name).some((r) => r.role === "read" && mayReach(r.n, wst, wst.end, w.name))) continue;
				const [line, c0] = pos(wst.getStart(sf)), [, c1] = pos(wst.end), E = w.rhs;
				if (hasKind(E, (k) => isTemp(k) && k.text === w.name)) continue;
				if (effectFree(E)) { if (push({ owner, kind: "dead", lines: [line], reps: [], dels: [line], move: null })) counts.dead++; continue; }
				const inner = ts.isParenthesizedExpression(E) && (ts.isYieldExpression(E.expression) || ts.isCallExpression(E.expression)) ? E.expression : E;
				const [, i0] = pos(inner.getStart(sf)), [, i1] = pos(inner.end);
				const reps = [{ line, s: c0, e: i0, text: "" }];
				if (inner !== E) reps.push({ line, s: i1, e: c1, text: ";" });
				else if (/^(\{|function\b)/.test(E.getText(sf))) continue;
				if (push({ owner, kind: "dead", lines: [line], reps, dels: [], move: null })) counts.dead++;
			}
			continue;
		}
		if (phase === "phi") { // `if (c) { $2 = a; } else { $2 = b; }` then one reader: `$2 = c ? a : b;` (the fold phase then moves it into the reader), only when that fold will work and the line stays short
			for (const B of blocks) for (let i = 0; i + 1 < B.statements.length; i++) {
				const ist = B.statements[i], s = B.statements[i + 1];
				if (!ts.isIfStatement(ist) || !ist.elseStatement || !ts.isBlock(ist.thenStatement) || !ts.isBlock(ist.elseStatement)) continue;
				if (ist.thenStatement.statements.length !== 1 || ist.elseStatement.statements.length !== 1) continue;
				const wa = tempWrite(ist.thenStatement.statements[0]), wb = tempWrite(ist.elseStatement.statements[0]);
				if (!wa || !wb || wa.name !== wb.name) continue;
				const name = wa.name, a = wa.rhs, b = wb.rhs, c = ist.expression;
				const inS = rd(name).filter((r) => within(r.n, s));
				if (inS.length !== 1 || inS[0].role !== "read") continue;
				if (bad.has(name)) { skip("proc too complex (nested fn / updated)"); continue; }
				if (rd(name).some((r) => within(r.n, ist) && r.n !== wa.left && r.n !== wb.left)) { skip("phi: the if reads its own name"); continue; }
				if (rd(name).some((r) => r.role === "read" && !within(r.n, s) && mayReach(r.n, ist, s.end, name))) { skip("read again further down"); continue; }
				const head = headOf(s), r = inS[0].n;
				if (!head || !contains(head, r)) { skip(`phi: reader is in a ${ts.SyntaxKind[s.kind]} body`); continue; }
				const efree = effectFree(a) && effectFree(b) && effectFree(c), assigned = assignedNames(a, assignedNames(b, assignedNames(c)));
				const why = foldBlocker(head, r, efree, assigned);
				if (why) { skip(`phi: ${why}`); continue; }
				if (hasClosure && !efree) { skip("phi: closures in the proc"); continue; }
				if ([a, b, c].some((x) => hasKind(x, (k) => ts.isConditionalExpression(k)))) { skip("phi: nested ?:"); continue; }
				let nested = false;
				for (let p = r.parent; p && p !== s.parent; p = p.parent) if (ts.isConditionalExpression(p)) nested = true;
				if (nested) { skip("phi: nested ?:"); continue; }
				const [L0, ic] = pos(ist.getStart(sf));
				const ind = lines[L0].slice(0, ic);
				if (ind.trim() !== "") continue;
				const ct = c.getText(sf), at = a.getText(sf), bt = b.getText(sf);
				if ([ct, at, bt].some((t) => t.includes("\n"))) continue;
				const want = [`if (${ct}) {`, `\t${name} = ${at};`, `} else {`, `\t${name} = ${bt};`, `}`];
				if (!want.every((t, k) => lines[L0 + k] === ind + t)) { skip("phi: odd layout"); continue; }
				const cw = ts.isConditionalExpression(c) || ts.isArrowFunction(c) || ts.isYieldExpression(c) || ts.isBinaryExpression(c) && (ASSIGN_OPS(c.operatorToken.kind) || c.operatorToken.kind === K.CommaToken);
				const pre = `${name} = `, ctext = cw ? `(${ct})` : ct;
				const tern = `${ctext} ? ${at} : ${bt}`, text = `${pre}${tern};`;
				const [rL, rC0] = pos(r.getStart(sf)), [, rC1] = pos(r.end);
				const par = !parenSafeParent(r);
				if (lines[rL].length - (rC1 - rC0) + tern.length + (par ? 2 : 0) > 120) { skip("phi: line over 120"); continue; }
				const cs = pos(c.getStart(sf))[1], as = pos(a.getStart(sf))[1], bs = pos(b.getStart(sf))[1];
				const parts = [
					{ srcLine: L0, srcS: cs, srcE: cs + ct.length, dstS: ic + pre.length + (cw ? 1 : 0) },
					{ srcLine: L0 + 1, srcS: as, srcE: as + at.length, dstS: ic + pre.length + ctext.length + 3 },
					{ srcLine: L0 + 3, srcS: bs, srcE: bs + bt.length, dstS: ic + pre.length + ctext.length + 3 + at.length + 3 },
				];
				const rows5 = [L0, L0 + 1, L0 + 2, L0 + 3, L0 + 4], sL = pos(s.getStart(sf))[0];
				if (push({ owner, kind: "phi", lines: [...rows5, sL], reps: [{ line: L0, s: ic, e: lines[L0].length, text }], dels: rows5.slice(1), move: null,
					phi: { line: L0, ic, parts, endCol: ic + text.length, readerLine: sL } })) counts.phi++;
			}
			continue;
		}
		for (const B of blocks) {
			for (let i = 0; i + 1 < B.statements.length; i++) {
				const wst = B.statements[i], w = tempWrite(wst);
				if (!w) continue;
				const name = w.name, s = B.statements[i + 1], E = w.rhs;
				const inS = rd(name).filter((r) => within(r.n, s));
				if (inS.length === 0) continue; // the next statement does not read it: not a fold or subject
				if (bad.has(name)) { skip("proc too complex (nested fn / updated)"); continue; }
				if (!alone(wst)) { skip("write not alone on one line"); continue; }
				if (hasKind(E, (k) => isTemp(k) && k.text === name)) { skip("E reads its own name"); continue; }
				// reads outside w and s must see another write first
				if (rd(name).some((r) => r.role === "read" && !within(r.n, s) && mayReach(r.n, wst, s.end, name))) { skip("read again further down"); continue; }
				const [wLine] = pos(wst.getStart(sf));
				if (phase === "fold") {
					if (inS.length !== 1 || inS[0].role !== "read") continue;
					const head = headOf(s), r = inS[0].n;
					if (!head || !contains(head, r)) { skip(`fold: reader is in a ${ts.SyntaxKind[s.kind]} body`); continue; }
					const why = foldBlocker(head, r, effectFree(E), assignedNames(E));
					if (why) { skip(`fold: ${why}`); continue; }
					if (hasClosure && !effectFree(E)) { skip("fold: closures in the proc"); continue; }
					const [eL, eC0] = pos(E.getStart(sf)), [, eC1] = pos(E.end), [rL, rC0] = pos(r.getStart(sf)), [, rC1] = pos(r.end);
					const par = needsParens(E, r), etext = par ? `(${E.getText(sf)})` : E.getText(sf);
					if (push({ owner, kind: "fold", lines: [wLine, rL], reps: [{ line: rL, s: rC0, e: rC1, text: etext }], dels: [wLine], move: { srcLine: eL, srcS: eC0, srcE: eC1, dstLine: rL, dstS: rC0, parens: par ? 1 : 0 } })) counts.fold++;
					continue;
				}
				// subject: an if / else-if chain comparing the value
				if (!ts.isIfStatement(s)) continue;
				const spine = [];
				for (let c = s; c && ts.isIfStatement(c); c = c.elseStatement) spine.push(c.expression);
				const chainRefs = inS.filter((r) => spine.some((c) => contains(c, r.n)));
				if (!chainRefs.length) continue;
				if (inS.some((r) => !chainRefs.includes(r) && r.role === "read" && !killedInside(r.n, s, wst, name))) { skip("subject also read in a branch"); continue; }
				if (spine.some((c) => hasKind(c, (k) => ts.isCallExpression(k) && callee(k) !== "rt.inRange" || ts.isYieldExpression(k) || ts.isNewExpression(k) || ts.isBinaryExpression(k) && ASSIGN_OPS(k.operatorToken.kind)))) { skip("subject: conditions call something"); continue; }
				const reps = [], rlines = new Set([wLine]);
				const refRep = (r, text) => { const [l, c0] = pos(r.n.getStart(sf)), [, c1] = pos(r.n.end); reps.push({ line: l, s: c0, e: c1, text }); rlines.add(l); };
				const root = (x) => x.kind === K.ThisKeyword || (ts.isIdentifier(x) && !hasClosure) || (ts.isPropertyAccessExpression(x) && root(x.expression));
				if ((ts.isIdentifier(E) && !hasClosure) || (ts.isPropertyAccessExpression(E) && root(E))) {
					for (const r of chainRefs) refRep(r, E.getText(sf));
					if (push({ owner, kind: "alias", lines: [...rlines], reps, dels: [wLine], move: null })) counts.alias++;
					continue;
				}
				let nm = nameFor(E);
				const base = nm;
				for (let k = 2; takenName(nm, B); k++) nm = `${base}_${k}`;
				const [, wc0] = pos(w.left.getStart(sf)), [, wc1] = pos(w.left.end);
				reps.push({ line: wLine, s: wc0, e: wc1, text: `const ${nm}` });
				for (const r of chainRefs) refRep(r, nm);
				if (push({ owner, kind: "const", lines: [...rlines], reps, dels: [], move: null })) { counts.const++; names.pending.push({ name: nm, block: B }); }
			}
		}
	}
	return edits;
}

// ---- applying edits to the text and the DM rows
/** value in effect at (line, col) of a row's entries (error-lines.ts's lookup for the "from here on" kinds) */
function effective(arr, d, line, col) {
	let v = arr[1];
	for (let i = 2; i < arr.length; i += 3) {
		const c = arr[i + 1], l = d + arr[i];
		if (c < 0) continue;
		if (l < line || (l === line && c <= col)) v = arr[i + 2];
	}
	return v;
}

function applyEdits(text, edits, rows) {
	const lines = text.split("\n");
	const dels = new Set(edits.flatMap((e) => e.dels)), repsBy = new Map();
	for (const e of edits) for (const r of e.reps) (repsBy.get(r.line) ?? repsBy.set(r.line, []).get(r.line)).push(r);
	for (const v of repsBy.values()) v.sort((a, b) => a.s - b.s);
	const delBefore = new Array(lines.length + 1).fill(0);
	for (let i = 0; i < lines.length; i++) delBefore[i + 1] = delBefore[i] + (dels.has(i) ? 1 : 0);
	const newLine = (l) => l - delBefore[l];
	/** the new column of old column c on a line (a column inside a replaced range goes to its start) */
	const shiftCol = (line, c) => {
		let out = c;
		for (const r of repsBy.get(line) ?? []) { if (c >= r.e) out += r.text.length - (r.e - r.s); else if (c > r.s) return r.s + (out - c); }
		return out;
	};
	const newText = [];
	for (let i = 0; i < lines.length; i++) {
		if (dels.has(i)) continue;
		let ln = lines[i];
		for (const r of [...(repsBy.get(i) ?? [])].reverse()) ln = ln.slice(0, r.s) + r.text + ln.slice(r.e);
		newText.push(ln);
	}
	const nextLive = (l) => { let n = l + 1; while (n < lines.length && dels.has(n)) n++; return n; };
	for (const { r, d, path, nth } of rows) {
		const arr = r.arr;
		if (arr.length < 3) continue;
		const folds = edits.filter((e) => e.move && e.owner && e.owner.path === path && e.owner.nth === nth);
		const phis = edits.filter((e) => e.phi && e.owner && e.owner.path === path && e.owner.nth === nth);
		const phiAt = new Map();
		for (const e of phis) for (let k = 0; k < 5; k++) phiAt.set(e.phi.line + k, e.phi);
		const bySrc = new Map(folds.map((e) => [e.move.srcLine, e]));
		const entries = [], newD = newLine(d);
		for (let i = 2; i < arr.length; i += 3) {
			const l = d + arr[i], c = arr[i + 1], col = colOf(c), v = arr[i + 2];
			const ph = phiAt.get(l);
			if (ph && (l !== ph.line || (col ?? 0) >= ph.ic)) continue; // the if/else's lines: their entries are rebuilt below
			const f = bySrc.get(l);
			if (f) { // an entry on a line whose text moved into another line
				const m = f.move;
				if (c < 0 && col >= m.srcS && col < m.srcE) {
					const nc = shiftCol(m.dstLine, m.dstS) + m.parens + (col - m.srcS);
					entries.push({ line: newLine(m.dstLine), col: nc, c: -1 - nc, v, add: true });
				}
				continue;
			}
			if (dels.has(l)) { // a removed line: its "from here on" value goes to the next line's start
				if (c < 0) continue;
				const nl = nextLive(l);
				if (nl < lines.length) entries.push({ line: newLine(nl), col: 0, c: 0, v, add: true, before: true });
				continue;
			}
			const nc = col === null ? 0 : shiftCol(l, col);
			entries.push({ line: newLine(l), col: nc, c: col === null ? 0 : encodeCol(c, nc), v });
		}
		for (const e of phis) { // `$2 = c ? a : b;` on the if's first line: each part keeps its DM line, then the reader's value is back
			const p = e.phi, nl = newLine(p.line);
			let run = effective(arr, d, p.line, p.ic - 1);
			const add = (col, v) => { if (v !== run) { entries.push({ line: nl, col, c: col, v, add: true }); run = v; } };
			add(p.ic, effective(arr, d, p.line, p.ic));
			for (const m of p.parts) {
				const start = m.dstS;
				add(start, effective(arr, d, m.srcLine, m.srcS));
				for (let i = 2; i < arr.length; i += 3) {
					const c = arr[i + 1], col = colOf(c);
					if (d + arr[i] !== m.srcLine || col === null || col < m.srcS || col >= m.srcE) continue;
					if (c < 0) { const nc = start + col - m.srcS; entries.push({ line: nl, col: nc, c: -1 - nc, v: arr[i + 2], add: true }); }
					else if (col > m.srcS) add(start + col - m.srcS, arr[i + 2]);
				}
			}
			add(p.endCol, effective(arr, d, p.readerLine, 0));
		}
		const fix = []; // the reader's line start must keep the value it had: the removed lines may have been what gave it
		for (const e of folds) {
			const m = e.move, X = effective(arr, d, m.srcLine, m.srcS), Y = effective(arr, d, m.dstLine, m.dstS);
			const start = shiftCol(m.dstLine, m.dstS) + m.parens, nl = newLine(m.dstLine);
			let run = Y;
			const add = (col, v) => { if (v !== run) { entries.push({ line: nl, col, c: col, v, add: true }); run = v; } };
			add(start, X);
			for (let i = 2; i < arr.length; i += 3) {
				const c = arr[i + 1];
				if (d + arr[i] === m.srcLine && c >= 0 && colOf(c) !== null && colOf(c) > m.srcS && colOf(c) < m.srcE) add(start + colOf(c) - m.srcS, arr[i + 2]);
			}
			add(start + (m.srcE - m.srcS), Y);
			fix.push({ nl, v: effective(arr, d, m.dstLine, 0) });
		}
		// the row keeps its array order (exact entries are not in position order); a new "from here on" entry goes in among the old ones by position
		const out = [arr[0], arr[1]], placed = entries.filter((en) => !en.add), adds = entries.filter((en) => en.add);
		const posOf = (en) => en.line * 1e5 + en.col;
		for (const en of adds) {
			if (en.c < 0) { placed.push(en); continue; }
			let at = placed.length;
			for (let k = 0; k < placed.length; k++) if (placed[k].c >= 0 && (en.before ? posOf(placed[k]) >= posOf(en) : posOf(placed[k]) > posOf(en))) { at = k; break; }
			placed.splice(at, 0, en);
		}
		for (const f of fix) {
			let v = arr[1];
			for (const en of placed) if (en.c >= 0 && (en.line < f.nl || (en.line === f.nl && en.col <= 0))) v = en.v;
			if (v === f.v) continue;
			const en = { line: f.nl, col: 0, c: 0, v: f.v, add: true, before: true };
			let at = placed.length;
			for (let k = 0; k < placed.length; k++) if (placed[k].c >= 0 && posOf(placed[k]) >= posOf(en)) { at = k; break; }
			placed.splice(at, 0, en);
		}
		for (const en of placed) out.push(en.line - newD, en.c, en.v);
		r.arr = out;
	}
	return newText.join("\n");
}

// ---- driver
function topNames(sf) {
	const s = new Set();
	for (const st of sf.statements) {
		if (ts.isExpressionStatement(st) && ts.isCallExpression(st.expression) && /^rt\.(def|tail)$/.test(st.expression.expression.getText(sf))) continue;
		hasKind(st, (k) => { if (ts.isIdentifier(k)) s.add(k.text); return false; });
	}
	return s;
}

/** the file's new text (its DM rows in dmRows are changed in place) */
export async function rewriteFile(file, text, dmRows, counts) {
	const dmFile = relative(resolve(web, "game"), file);
	const names = { global: await loadGlobalNames(), pending: [], top: (() => { let sf0 = null, v = null; return (sf) => (sf0 === sf ? v : ((sf0 = sf), (v = topNames(sf)))); })() };
	const rowsOf = (t) => {
		const ls = t.split("\n"), out = [];
		for (const r of dmRows) {
			const { file: kf, path, nth } = splitKey(r.key);
			if (kf !== dmFile) continue;
			const d = defLine(ls, path, nth);
			if (d >= 0) out.push({ r, d, path, nth });
		}
		return out;
	};
	for (const phase of ["dead", "fold", "phi", "fold", "phi", "fold", "subject", "decl"]) {
		for (let guard = 0; guard < 60; guard++) {
			const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
			names.pending = [];
			cur = {};
			const edits = planPass(sf, phase, names, counts);
			if (!edits.length) { for (const [k, v] of Object.entries(cur)) SKIP[k] = (SKIP[k] ?? 0) + v; break; }
			text = applyEdits(text, edits, rowsOf(text));
		}
	}
	return text;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	const check = process.argv.includes("--check");
	const targets = process.argv.slice(2).filter((a) => a !== "--check").map((a) => resolve(a));
	const files = (targets.length ? targets : walkTs(resolve(web, "game"))).filter((p) => !p.endsWith("_globals.ts")).sort();
	const dmPath = resolve(web, "game/_dm-lines.json"), dmRows = parseDm(readFileSync(dmPath, "utf8"));
	const counts = { dead: 0, phi: 0, fold: 0, alias: 0, const: 0, decl: 0 };
	let changedFiles = 0, before = 0, after = 0;
	for (const f of files) {
		const text = readFileSync(f, "utf8"), n0 = (text.match(/\$\d+\b/g) ?? []).length;
		const out = await rewriteFile(f, text, dmRows, counts);
		before += n0; after += (out.match(/\$\d+\b/g) ?? []).length;
		if (out !== text) { changedFiles++; if (!check) writeFileSync(f, out); }
	}
	console.log(`pb-temps: ${files.length} files, ${changedFiles} changed; dead stores ${counts.dead}, if/else to ?: ${counts.phi}, folded ${counts.fold}, aliased ${counts.alias}, const subjects ${counts.const}, declarations dropped ${counts.decl}; \`$N\` ${before} -> ${after}${check ? " (--check: nothing written)" : ""}`);
	console.log(`left as they were: ${Object.entries(SKIP).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join("; ") || "none"}`);
	if (!check) writeFileSync(dmPath, dmText(dmRows));
}
