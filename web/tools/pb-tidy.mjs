#!/usr/bin/env node
// pb-tidy.mjs - Phrasebook step 13, first half (plans/phrasebook.md): tidies the leftovers in web/game procs. Three kinds:
// Usage (from web/): node tools/pb-tidy.mjs [--check] [FILE...]      none: every game file. --check changes nothing, prints counts.
//   null    `x = null;` where x provably still holds its initial null (it is declared `= null` at the top of the proc, every other write to it comes
//           later in the text, and no loop around the store holds another write): the line goes. This is the `R = null;` before `for (R of each(...))`.
//   dead    `x = E1;` (E1 literal / local / `this`, nothing to run) straight followed by `x = E2;` (E2 never reads x, no yield): the first line goes.
//   unused  a local (`let x: Value = null`, `let $e: any`) nothing else in the proc names: dropped from its `let` line. `$e` stays in a proc that has an
//           each() loop (translate-tg adds the one the loops use).
//   elseif  `else {` whose block holds only one `if` -> `else if (...) {` (the inner lines move out one tab; a DM column on them moves with the text).
// Procs with the name in a nested function, destructured or otherwise odd are left. The DM line table (game/_dm-lines.json) follows.
// Idempotent: a second run changes 0.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";
import { callee } from "./dt-robot.mjs";
import { colOf, defLine, dmText, encodeCol, parseDm, splitKey } from "./remap-dm-cols.mjs";

const web = resolve(import.meta.dirname, "..");
const K = ts.SyntaxKind;
export const walkTs = (d, out = []) => {
	for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walkTs(p, out); else if (e.endsWith(".ts") && !e.endsWith(".d.ts")) out.push(p); }
	return out;
};
const isFnLike = (n) => ts.isArrowFunction(n) || ts.isFunctionExpression(n) || ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n);
const within = (n, outer) => n.pos >= outer.pos && n.end <= outer.end;
const ASSIGN_OPS = (k) => k >= K.FirstAssignment && k <= K.LastAssignment;
export const hasKind = (n, pred) => { let f = false; const v = (k) => { if (f) return; if (pred(k)) f = true; else ts.forEachChild(k, v); }; v(n); return f; };
const isLoop = (n) => ts.isWhileStatement(n) || ts.isForStatement(n) || ts.isForOfStatement(n) || ts.isDoStatement(n);
/** nothing to run: literals, locals, `this`, property reads, operators on those */
const plainValue = (n) => {
	if (ts.isIdentifier(n) || ts.isLiteralExpression(n) || n.kind === K.ThisKeyword || n.kind === K.NullKeyword || n.kind === K.TrueKeyword || n.kind === K.FalseKeyword) return true;
	if (ts.isPrefixUnaryExpression(n)) return n.operator !== K.PlusPlusToken && n.operator !== K.MinusMinusToken && plainValue(n.operand);
	if (ts.isParenthesizedExpression(n)) return plainValue(n.expression);
	return false;
};

export function procFunctions(sf) {
	const out = [], nth = new Map();
	for (const st of sf.statements) {
		if (!ts.isExpressionStatement(st) || !ts.isCallExpression(st.expression)) continue;
		const c = st.expression, k = callee(c), [p, fn] = c.arguments;
		if (k === "rt.def" && p && ts.isStringLiteral(p) && fn && ts.isFunctionExpression(fn)) { const n = (nth.get(p.text) ?? 0) + 1; nth.set(p.text, n); out.push({ fn, owner: { path: p.text, nth: n } }); }
		else if (k === "rt.tail" && fn && ts.isFunctionExpression(fn)) out.push({ fn, owner: null });
	}
	return out;
}

/** every reference to the identifier `name` in body: { n, role: read | write | rw | decl, nested }; `bad`: names with a second binding or odd use */
export function collectRefs(body) {
	const refs = new Map(), bad = new Set(), bound = new Map();
	const add = (name, r) => (refs.get(name) ?? refs.set(name, []).get(name)).push(r);
	const v = (n, nested) => {
		if (ts.isIdentifier(n)) {
			const p = n.parent;
			const isMember = (ts.isPropertyAccessExpression(p) && p.name === n) || (ts.isPropertyAssignment(p) && p.name === n) || (ts.isMethodDeclaration(p) && p.name === n) || (ts.isBindingElement(p) && p.propertyName === n) || ts.isLabeledStatement(p) || ts.isBreakOrContinueStatement(p);
			if (!isMember) {
				let role = "read";
				if ((ts.isVariableDeclaration(p) && p.name === n) || (ts.isParameter(p) && p.name === n)) role = "decl";
				else if (ts.isBinaryExpression(p) && p.left === n && ASSIGN_OPS(p.operatorToken.kind)) role = p.operatorToken.kind === K.EqualsToken ? "write" : "rw";
				else if ((ts.isPrefixUnaryExpression(p) || ts.isPostfixUnaryExpression(p)) && (p.operator === K.PlusPlusToken || p.operator === K.MinusMinusToken)) role = "rw";
				else if (ts.isForOfStatement(p) && p.initializer === n) role = "write";
				else if (ts.isShorthandPropertyAssignment(p) || ts.isBindingElement(p) || ts.isCatchClause(p.parent ?? p)) role = "odd";
				add(n.text, { n, role, nested });
				if (role === "decl") bound.set(n.text, (bound.get(n.text) ?? 0) + 1);
				if (nested || role === "odd") bad.add(n.text);
			}
		}
		if (ts.isBinaryExpression(n) && n.operatorToken.kind === K.EqualsToken && (ts.isArrayLiteralExpression(n.left) || ts.isObjectLiteralExpression(n.left)))
			hasKind(n.left, (k) => { if (ts.isIdentifier(k)) bad.add(k.text); return false; });
		if (ts.isForOfStatement(n) || ts.isForInStatement(n)) { const i = n.initializer; if (!ts.isIdentifier(i) && !ts.isVariableDeclarationList(i)) hasKind(i, (k) => { if (ts.isIdentifier(k)) bad.add(k.text); return false; }); }
		if (ts.isCatchClause(n) && n.variableDeclaration) hasKind(n.variableDeclaration, (k) => { if (ts.isIdentifier(k)) bad.add(k.text); return false; });
		ts.forEachChild(n, (c) => v(c, nested || isFnLike(c)));
	};
	ts.forEachChild(body, (c) => v(c, isFnLike(c)));
	for (const [k, c] of bound) if (c > 1) bad.add(k); // two bindings of one name: a shadow somewhere
	return { refs, bad };
}

const exprStmt = (st) => (ts.isExpressionStatement(st) && ts.isBinaryExpression(st.expression) && st.expression.operatorToken.kind === K.EqualsToken && ts.isIdentifier(st.expression.left) ? { name: st.expression.left.text, rhs: st.expression.right } : null);

/** the edits for one pass over a file: { owner, kind, lines, reps [{line,s,e,text}], dels [line], merge } (lines/cols of the text as it was) */
function planPass(sf, phase, counts) {
	const pos = (p) => { const l = sf.getLineAndCharacterOfPosition(p); return [l.line, l.character]; };
	const lines = sf.text.split("\n"), edits = [], touched = new Set();
	const alone = (n) => { const [l, c0] = pos(n.getStart(sf)), [l2, c1] = pos(n.end); return l === l2 && lines[l].slice(0, c0).trim() === "" && lines[l].slice(c1).trim() === ""; };
	const push = (e) => { if (e.lines.some((l) => touched.has(l))) return false; for (const l of e.lines) touched.add(l); edits.push(e); return true; };
	// lines that start inside a multi-line template: a tab there is text
	const inTemplate = new Set();
	if (phase === "elseif") {
		const t = (n) => { if (ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateExpression(n) || ts.isStringLiteral(n) || ts.isRegularExpressionLiteral(n)) { const [a] = pos(n.getStart(sf)), [b] = pos(n.end); for (let l = a + 1; l <= b; l++) inTemplate.add(l); } ts.forEachChild(n, t); };
		t(sf);
	}
	for (const { fn, owner } of procFunctions(sf)) {
		if (phase === "elseif") {
			const visit = (n) => {
				if (ts.isIfStatement(n) && n.elseStatement && ts.isBlock(n.elseStatement) && n.elseStatement.statements.length === 1 && ts.isIfStatement(n.elseStatement.statements[0])) {
					const B = n.elseStatement, I = B.statements[0];
					const [l1, bc] = pos(B.getStart(sf)), [l2, ic] = pos(I.getStart(sf)), [le, ec] = pos(I.end), [l3, cc] = pos(B.end - 1), [l3b] = pos(B.end);
					const L1 = lines[l1];
					const ok = l2 === l1 + 1 && le + 1 === l3 && l3b === l3 && L1.slice(bc + 1).trim() === "" && L1.slice(0, bc).trimEnd().endsWith("else")
						&& lines[l2].slice(0, ic).trim() === "" && lines[le].slice(ec).trim() === "" && lines[l3].trim() === "}" && /^\t*/.exec(lines[l2])[0].length === ic
						&& lines[l2].trimEnd().endsWith("{");
					if (ok) {
						const inner = []; let bad = false;
						for (let l = l2 + 1; l <= le; l++) { if (inTemplate.has(l) || (lines[l].trim() !== "" && !lines[l].startsWith("\t"))) bad = true; inner.push(l); }
						if (inTemplate.has(l2)) bad = true;
						if (!bad) {
							const reps = [{ line: l1, s: bc, e: L1.length, text: lines[l2].slice(ic).trimEnd() }];
							for (const l of inner) if (lines[l] !== "") reps.push({ line: l, s: 0, e: 1, text: "" });
							if (push({ owner, kind: "elseif", lines: [l1, l2, ...inner, l3], reps, dels: [l2, l3], merge: { srcLine: l2, srcIndent: ic, dstLine: l1, dstCol: bc } })) { counts.elseif++; return; }
						}
					}
				}
				ts.forEachChild(n, visit);
			};
			// visit finds the outermost fitting one in each branch; touched lines make nested ones wait for the next pass
			const visitAll = (n) => {
				if (ts.isIfStatement(n) && n.elseStatement && ts.isBlock(n.elseStatement) && n.elseStatement.statements.length === 1 && ts.isIfStatement(n.elseStatement.statements[0])) { visit(n); }
				ts.forEachChild(n, visitAll);
			};
			visitAll(fn.body);
			continue;
		}
		const { refs, bad } = collectRefs(fn.body);
		const decls = new Map(); // top-level let declarators: name -> { d, st }
		for (const st of fn.body.statements) if (ts.isVariableStatement(st) && st.declarationList.flags & ts.NodeFlags.Let) for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) decls.set(d.name.text, { d, st });
		const rd = (name) => refs.get(name) ?? [];
		if (phase === "unused") {
			const hasEach = /\bof each\(/.test(fn.body.getText(sf));
			for (const st of fn.body.statements) {
				if (!ts.isVariableStatement(st) || !(st.declarationList.flags & ts.NodeFlags.Let)) continue;
				const ds = st.declarationList.declarations;
				const drop = ds.filter((d) => ts.isIdentifier(d.name) && !bad.has(d.name.text) && rd(d.name.text).every((r) => r.role === "decl") && (!d.initializer || d.initializer.kind === K.NullKeyword) && !(d.name.text === "$e" && hasEach));
				if (!drop.length || !alone(st)) continue;
				const [line, c0] = pos(st.getStart(sf)), [, c1] = pos(st.end);
				const keep = ds.filter((d) => !drop.includes(d));
				const e = keep.length ? { owner, kind: "unused", lines: [line], reps: [{ line, s: c0, e: c1, text: `let ${keep.map((d) => d.getText(sf)).join(", ")};` }], dels: [] } : { owner, kind: "unused", lines: [line], reps: [], dels: [line] };
				if (push(e)) counts.unused += drop.length;
			}
			continue;
		}
		// null / dead: statement lists of every block
		const blocks = [fn.body];
		hasKind(fn.body, (k) => { if (ts.isBlock(k) || ts.isCaseClause(k) || ts.isDefaultClause(k)) blocks.push(k); return false; });
		for (const B of blocks) {
			const sts = B.statements;
			for (let i = 0; i < sts.length; i++) {
				const w = exprStmt(sts[i]);
				if (!w || bad.has(w.name) || !alone(sts[i])) continue;
				const dec = decls.get(w.name);
				if (!dec) continue;
				const [line] = pos(sts[i].getStart(sf));
				if (phase === "null") {
					if (w.rhs.kind !== K.NullKeyword || !dec.d.initializer || dec.d.initializer.kind !== K.NullKeyword) continue;
					const others = rd(w.name).filter((r) => r.role !== "decl" && r.n !== sts[i].expression.left);
					const wst = sts[i];
					// every other write comes later; no loop around the store holds another write
					if (others.some((r) => r.role !== "read" && r.n.pos < wst.end)) continue;
					let loopBad = false;
					for (let a = wst.parent; a && a !== fn.body; a = a.parent) if (isLoop(a) && others.some((r) => r.role !== "read" && within(r.n, a))) loopBad = true;
					if (loopBad) continue;
					// a read between the declaration and the store sees null either way: fine
					if (push({ owner, kind: "null", lines: [line], reps: [], dels: [line] })) counts.null++;
				} else if (phase === "dead") {
					const nx = sts[i + 1] && exprStmt(sts[i + 1]);
					if (!nx || nx.name !== w.name || !plainValue(w.rhs)) continue;
					if (hasKind(nx.rhs, (k) => ts.isYieldExpression(k) || (ts.isIdentifier(k) && k.text === w.name)) || hasKind(nx.rhs, ts.isAwaitExpression)) continue;
					if (plainValue(w.rhs) && hasKind(w.rhs, (k) => ts.isIdentifier(k) && k.text === w.name)) continue;
					if (push({ owner, kind: "dead", lines: [line], reps: [], dels: [line] })) counts.dead++;
				}
			}
		}
	}
	return edits;
}

// ---- applying edits to the text and the DM rows (pb-temps's applyEdits, plus the elseif merge)
export function applyEdits(text, edits, rows) {
	const lines = text.split("\n");
	const dels = new Set(edits.flatMap((e) => e.dels)), repsBy = new Map();
	for (const e of edits) for (const r of e.reps) (repsBy.get(r.line) ?? repsBy.set(r.line, []).get(r.line)).push(r);
	for (const v of repsBy.values()) v.sort((a, b) => a.s - b.s);
	const delBefore = new Array(lines.length + 1).fill(0);
	for (let i = 0; i < lines.length; i++) delBefore[i + 1] = delBefore[i] + (dels.has(i) ? 1 : 0);
	const newLine = (l) => l - delBefore[l];
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
	const merges = new Map(edits.filter((e) => e.merge).map((e) => [e.merge.srcLine, e.merge]));
	for (const { r, d, path, nth } of rows) {
		const arr = r.arr;
		if (arr.length < 3) continue;
		const own = edits.filter((e) => e.owner && e.owner.path === path && e.owner.nth === nth);
		const entries = [], newD = newLine(d);
		for (let i = 2; i < arr.length; i += 3) {
			const l = d + arr[i], c = arr[i + 1], col = colOf(c), v = arr[i + 2];
			const m = merges.get(l);
			if (m && own.some((e) => e.merge === m)) { // a line whose text moved to the end of the line above
				const nc = col === null || col < m.srcIndent ? m.dstCol : m.dstCol + (col - m.srcIndent);
				entries.push({ line: newLine(m.dstLine), col: nc, c: c < 0 ? -1 - nc : nc, v, add: true });
				continue;
			}
			if (dels.has(l)) {
				if (c < 0) continue;
				const nl = nextLive(l);
				if (nl < lines.length) entries.push({ line: newLine(nl), col: 0, c: 0, v, add: true, before: true });
				continue;
			}
			const nc = col === null ? 0 : shiftCol(l, col);
			entries.push({ line: newLine(l), col: nc, c: col === null ? 0 : encodeCol(c, nc), v });
		}
		const out = [arr[0], arr[1]], placed = entries.filter((en) => !en.add), adds = entries.filter((en) => en.add);
		const posOf = (en) => en.line * 1e5 + en.col;
		for (const en of adds) {
			if (en.c < 0) { placed.push(en); continue; }
			let at = placed.length;
			for (let k = 0; k < placed.length; k++) if (placed[k].c >= 0 && (en.before ? posOf(placed[k]) >= posOf(en) : posOf(placed[k]) > posOf(en))) { at = k; break; }
			placed.splice(at, 0, en);
		}
		for (const en of placed) out.push(en.line - newD, en.c, en.v);
		r.arr = out;
	}
	return newText.join("\n");
}

export function rewriteFile(file, text, dmRows, counts) {
	const dmFile = relative(resolve(web, "game"), file);
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
	for (const phase of ["null", "dead", "unused", "elseif"]) {
		for (let guard = 0; guard < 600; guard++) {
			const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
			const edits = planPass(sf, phase, counts);
			if (!edits.length) break;
			text = applyEdits(text, edits, rowsOf(text));
		}
	}
	return text;
}

if (process.argv[1] && import.meta.url === new URL(`file://${resolve(process.argv[1])}`).href) {
	const check = process.argv.includes("--check");
	const targets = process.argv.slice(2).filter((a) => a !== "--check").map((a) => resolve(a));
	const files = (targets.length ? targets : walkTs(resolve(web, "game"))).filter((p) => !p.endsWith("_globals.ts")).sort();
	const dmPath = resolve(web, "game/_dm-lines.json"), dmRows = parseDm(readFileSync(dmPath, "utf8"));
	const counts = { null: 0, dead: 0, unused: 0, elseif: 0 };
	let changedFiles = 0;
	for (const f of files) {
		const text = readFileSync(f, "utf8");
		const out = rewriteFile(f, text, dmRows, counts);
		if (out !== text) { changedFiles++; if (!check) writeFileSync(f, out); }
	}
	console.log(`pb-tidy: ${files.length} files, ${changedFiles} changed; redundant null stores ${counts.null}, dead stores ${counts.dead}, unused locals ${counts.unused}, else-ifs ${counts.elseif}${check ? " (--check: nothing written)" : ""}`);
	if (!check) writeFileSync(dmPath, dmText(dmRows));
}
