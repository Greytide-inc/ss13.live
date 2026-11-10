#!/usr/bin/env node
// pb-tidy2.mjs - Phrasebook step 13b (plans/phrasebook.md): the translator's hoisted lets and its `_N` names in web/game procs. Two kinds:
// Usage (from web/): node tools/pb-tidy2.mjs [--check] [FILE...]      none: every game file. --check changes nothing, prints counts.
//   move    `let M: Value = null, ...;` at the head of a proc: M's declarator leaves the head and its first write becomes `let M: Value = x;` when that
//           write is a plain statement at the proc's top level (so the new `let` is in the proc's own scope, never in a loop or block), is the first
//           mention of M in the text (nothing reads M before it, and a top-level statement runs once, in text order), x does not mention M, and M is
//           named by no nested function (a spawn/inline closure would copy or capture it). translate-tg's varsCut then lists M in f.vars only after
//           its `let` (see there): before the write M held null, which was no GC root either.
//   rename  a top-level local `M_3` back to tg's `M` when nothing in the proc (or the file's top level, or a global/helper name the build gives
//           meaning to) is called M, and tg's DM proc declares a `var/.../M`. Parameters are never renamed (their names are the DM argument names).
// A second run changes 0. The DM line table (game/_dm-lines.json) follows the text as in pb-tidy.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { homedir } from "node:os";
import ts from "typescript";
import { applyEdits, collectRefs, hasKind, procFunctions, walkTs } from "./pb-tidy.mjs";
import { declaredNames, procNameSets } from "./proc-calls.mjs";
import { RESERVED } from "./js-names.mjs";
import { defLine, dmText, parseDm, splitKey } from "./remap-dm-cols.mjs";

const web = resolve(import.meta.dirname, "..");
const tgRoot = resolve(homedir(), "Desktop/projects/tgstation");
const K = ts.SyntaxKind;
const within = (n, outer) => n.pos >= outer.pos && n.end <= outer.end;

// ---- names a renamed local must not take: anything the build or the file gives a meaning to
let forbidden = null;
function forbiddenNames() {
	if (forbidden) return forbidden;
	forbidden = new Set([...RESERVED, "GLOB", "$e", "arguments", ...Object.getOwnPropertyNames(globalThis)]);
	const sets = procNameSets(resolve(web, "game"));
	for (const s of Object.values(sets)) if (s instanceof Set) for (const x of s) forbidden.add(x);
	for (const p of walkTs(resolve(web, "game"))) {
		const t = readFileSync(p, "utf8");
		for (const m of t.matchAll(/(?<![.\w$])([A-Za-z_][\w$]*)\(/g)) forbidden.add(m[1]);
		if (p.endsWith("_globals.ts")) for (const m of t.matchAll(/[A-Za-z_][\w$]*/g)) forbidden.add(m[0]);
	}
	for (const m of readFileSync(resolve(web, "game/_defines.d.ts"), "utf8").matchAll(/[A-Za-z_][\w$]*/g)) forbidden.add(m[0]);
	return forbidden;
}

// ---- tg's DM text of a proc: from the `// x.dm:N` comment and the proc's name (the line number is near, not exact)
const dmCache = new Map();
function dmProcText(file, text, defStartLine, procName) {
	const lines = text.split("\n");
	const head = /^\/\/ Based on \/tg\/station's (code\/\S+\.dm)\./.exec(lines[0]);
	const cm = defStartLine > 0 ? /^\/\/ \S+\.dm:(\d+)$/.exec(lines[defStartLine - 1]) : null;
	if (!head || !cm) return null;
	let dm = dmCache.get(head[1]);
	if (dm === undefined) { const p = resolve(tgRoot, head[1]); dm = existsSync(p) ? readFileSync(p, "utf8").split("\n") : null; dmCache.set(head[1], dm); }
	if (!dm) return null;
	const n = Number(cm[1]) - 1, re = new RegExp(`(^|[/\\s])${procName.replace(/\$/g, "\\$")}\\(`);
	for (let d = 0; d <= 12; d++) for (const i of d ? [n - d, n + d] : [n]) {
		if (i < 0 || i >= dm.length || !re.test(dm[i]) || /^\s*(\/\/|#)/.test(dm[i])) continue;
		const ind = /^\t*/.exec(dm[i])[0].length, out = [dm[i]];
		for (let j = i + 1; j < dm.length; j++) { if (dm[j].trim() !== "" && !(/^\t*/.exec(dm[j])[0].length > ind)) break; out.push(dm[j]); }
		return out.join("\n");
	}
	return null;
}

/** the edits of one file, both kinds: { owner, kind, lines, reps, dels } (as pb-tidy) */
function planPass(sf, text, phase, counts) {
	const pos = (p) => { const l = sf.getLineAndCharacterOfPosition(p); return [l.line, l.character]; };
	const lines = text.split("\n"), edits = [], touched = new Set();
	const push = (e) => { if (e.lines.some((l) => touched.has(l))) return false; for (const l of e.lines) touched.add(l); edits.push(e); return true; };
	const fileTop = new Set();
	for (const st of sf.statements) {
		const c = ts.isExpressionStatement(st) && ts.isCallExpression(st.expression) ? st.expression.expression.getText(sf) : "";
		if (c !== "rt.def" && c !== "rt.tail") for (const x of declaredNames(st)) fileTop.add(x);
	}
	for (const { fn, owner } of procFunctions(sf)) {
		const { refs, bad } = collectRefs(fn.body);
		const lets = []; // top-level let statements
		for (const st of fn.body.statements) if (ts.isVariableStatement(st) && st.declarationList.flags & ts.NodeFlags.Let) lets.push(st);
		const rd = (name) => (refs.get(name) ?? []).filter((r) => r.role !== "decl").sort((a, b) => a.n.pos - b.n.pos);

		if (phase === "move") {
			for (const st of lets) {
				const [sl, sc0] = pos(st.getStart(sf)), [sle, sc1] = pos(st.end);
				if (sl !== sle || lines[sl].slice(0, sc0).trim() !== "" || lines[sl].slice(sc1).trim() !== "") continue;
				const moved = [], reps = [], eLines = [sl];
				for (const d of st.declarationList.declarations) {
					if (!ts.isIdentifier(d.name) || (d.initializer && d.initializer.kind !== K.NullKeyword) || bad.has(d.name.text)) continue;
					const name = d.name.text, rs = rd(name);
					if (!rs.length || rs[0].role !== "write") continue;
					const left = rs[0].n, bin = left.parent, es = bin.parent;
					if (!ts.isBinaryExpression(bin) || bin.left !== left || !ts.isExpressionStatement(es) || es.parent !== fn.body || es.pos < st.end) continue;
					if (rs.some((r, i) => i > 0 && r.n.pos < es.end)) continue; // M inside its own first value
					const [wl, wc] = pos(es.getStart(sf)), [, ec] = pos(left.end);
					if (lines[wl].slice(0, wc).trim() !== "") continue;
					const endLine = pos(es.end)[0];
					if (lines[endLine].slice(pos(es.end)[1]).replace(/\/\/.*$/, "").trim() !== "") continue; // varsCut needs the line's end
					if (eLines.includes(wl) || touched.has(wl)) continue;
					const ty = d.type ? d.type.getText(sf) : null;
					reps.push({ line: wl, s: wc, e: wc, text: "let " }, { line: wl, s: ec, e: ec, text: ty ? `: ${ty}` : "" });
					eLines.push(wl); moved.push(d);
				}
				if (!moved.length) continue;
				const keep = st.declarationList.declarations.filter((d) => !moved.includes(d));
				const head = keep.length ? { line: sl, s: sc0, e: sc1, text: `let ${keep.map((d) => d.getText(sf)).join(", ")};` } : null;
				if (push({ owner, kind: "move", lines: eLines, reps: head ? [head, ...reps] : reps, dels: head ? [] : [sl] })) counts.move += moved.length;
			}
			continue;
		}

		// rename
		const startLine = pos(fn.parent.getStart(sf))[0];
		const procName = owner ? owner.path.slice(owner.path.lastIndexOf("/") + 1) : null;
		let dmBody;
		const decls = [];
		for (const st of fn.body.statements) if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) decls.push(d);
		const taken = new Set(refs.keys());
		for (const d of decls) {
			const m = /^([A-Za-z][\w]*?)_(\d+)$/.exec(d.name.text);
			if (!m || (refs.get(d.name.text) ?? []).filter((r) => r.role === "decl").length !== 1) continue;
			const X = m[1];
			if (!procName || taken.has(X) || fileTop.has(X) || forbiddenNames().has(X)) continue;
			if ((refs.get(d.name.text) ?? []).some((r) => r.role === "odd")) continue;
			dmBody ??= dmProcText(null, text, startLine, procName) ?? "";
			if (!new RegExp(`\\bvar/(?:[\\w./]*/)?${X}\\b`).test(dmBody)) continue;
			const rs = refs.get(d.name.text), rep = rs.map((r) => { const [l, c] = pos(r.n.getStart(sf)); return { line: l, s: c, e: c + d.name.text.length, text: X }; });
			if (rep.some((r) => touched.has(r.line))) continue;
			if (push({ owner, kind: "rename", lines: [...new Set(rep.map((r) => r.line))], reps: rep, dels: [] })) { counts.rename++; taken.add(X); }
		}
	}
	return edits;
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
	for (const phase of ["move", "rename"]) {
		for (let guard = 0; guard < 50; guard++) {
			const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
			const edits = planPass(sf, text, phase, counts);
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
	const counts = { move: 0, rename: 0 };
	let changedFiles = 0;
	for (const f of files) {
		const text = readFileSync(f, "utf8");
		const out = rewriteFile(f, text, dmRows, counts);
		if (out !== text) { changedFiles++; if (!check) writeFileSync(f, out); }
	}
	console.log(`pb-tidy2: ${files.length} files, ${changedFiles} changed; lets moved to first use ${counts.move}, names given back ${counts.rename}${check ? " (--check: nothing written)" : ""}`);
	if (!check) writeFileSync(dmPath, dmText(dmRows));
}
