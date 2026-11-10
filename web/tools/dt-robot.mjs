// dt-robot.mjs - The shared half of the detranslate robots (dt-calls.mjs, dt-vars.mjs): which procs to work on, writing each file's edits, moving its _dm-lines.json columns.
// A robot calls runRobot(name, makeRewrite): makeRewrite(ctx) is called once per file and returns rewrite(node), which gives the
// node's edits ([start, end, new text], small and never overlapping another node's) or null. ctx: { rel, text, sf, scope, counts (kind -> how many, the robot's own keys), anchors (exact DM columns that move with a rewritten
// call: [old column position, edit, offset in its text, name length]), dead (exact columns that sat inside an edit's old text, where no
// error is reported: [edit, n] puts them n past its new start, so they don't land on a call's name), skip(why) (counts a node left as it
// was, returns null), dmAt(line) (the column codes of _dm-lines.json entries on a 0-based line of the file) }.
// Edits keep every line unless the robot passes { removesLines: true }: then an entry moves to the line its text went to (a removed
// line's start: "from here on" where the edit's new text ends), and its row's line numbers follow.
// Command line: [--check] [TARGET...]; TARGET a game file (every proc and tail in it) or a proc path (that rt.def); none: all of game/.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";
import { scopeNames } from "./proc-calls.mjs";
import { colOf, defLine, dmText, encodeCol, parseDm, splitKey } from "./remap-dm-cols.mjs";

const web = resolve(import.meta.dirname, "..");
/** the dotted name of a call to an rt.* or g.* helper (`rt.callName`), or null */
export const callee = (n) => ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && ts.isIdentifier(n.expression.expression)
	&& (n.expression.expression.text === "rt" || n.expression.expression.text === "g") ? `${n.expression.expression.text}.${n.expression.name.text}` : null;
/** a receiver that can stand before `.x` as it is */
export const bare = (r) => ts.isIdentifier(r) || ts.isPropertyAccessExpression(r) || ts.isElementAccessExpression(r) || ts.isCallExpression(r)
	|| ts.isParenthesizedExpression(r) || r.kind === ts.SyntaxKind.NullKeyword || r.kind === ts.SyntaxKind.ThisKeyword || ts.isStringLiteral(r);

const gameFiles = () => {
	const out = [];
	const walk = (d) => { for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walk(p); else if (e.endsWith(".ts")) out.push(p); } };
	walk(resolve(web, "game"));
	return out.sort();
};

export function runRobot(name, makeRewrite, { removesLines = false } = {}) {
	const check = process.argv.includes("--check");
	const targets = process.argv.slice(2).filter((a) => a !== "--check");
	const work = new Map(); // file -> set of proc paths (null: the whole file)
	let all = null;
	if (targets.length === 0) for (const p of gameFiles()) work.set(p, null);
	for (const t of targets) {
		if (t.startsWith("/")) {
			all ??= gameFiles();
			const needle = `rt.def("${t}",`;
			const hits = all.filter((p) => readFileSync(p, "utf8").includes(needle));
			if (hits.length !== 1) { console.error(`${t}: ${hits.length} files define it`); process.exit(1); }
			const s = work.get(hits[0]);
			if (s !== null) work.set(hits[0], (s ?? new Set()).add(t));
		} else work.set(resolve(t), null);
	}

	const dmPath = resolve(web, "game/_dm-lines.json"), dmRows = parseDm(readFileSync(dmPath, "utf8"));
	let total = 0, dmMoved = 0;
	const skipped = {};
	for (const [file, procs] of work) {
		const rel = relative(web, file);
		if (rel.endsWith("_globals.ts")) { console.log(`${rel}: skipped (global init)`); continue; }
		const text = readFileSync(file, "utf8"), oldLines = text.split("\n");
		const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
		const dmFile = relative(resolve(web, "game"), file), rows = [], onLine = new Map();
		for (const r of dmRows) {
			const { file: kf, path, nth } = splitKey(r.key);
			if (kf !== dmFile || r.arr.length < 3) continue;
			const d = defLine(oldLines, path, nth);
			if (d < 0) continue;
			rows.push({ r, d, path, nth });
			for (let i = 2; i < r.arr.length; i += 3) { const l = d + r.arr[i]; if (!onLine.has(l)) onLine.set(l, []); onLine.get(l).push(r.arr[i + 1]); }
		}
		const edits = [], anchors = [], dead = [], counts = {};
		const ctx = { rel, text, sf, scope: scopeNames(sf), counts, anchors, dead,
			skip: (why) => { skipped[why] = (skipped[why] ?? 0) + 1; return null; }, dmAt: (l) => onLine.get(l) ?? [] };
		const rewrite = makeRewrite(ctx);
		const visit = (k) => {
			const e = rewrite(k);
			if (e) edits.push(...e);
			ts.forEachChild(k, visit);
		};
		for (const st of sf.statements) {
			if (!ts.isExpressionStatement(st) || !ts.isCallExpression(st.expression)) continue;
			const c = st.expression, [p, fn] = c.arguments, k = callee(c);
			if (k === "rt.def" && p && ts.isStringLiteral(p) && fn && ts.isFunctionExpression(fn) && (procs === null || procs.has(p.text))) visit(fn.body);
			else if (k === "rt.tail" && procs === null && fn && ts.isFunctionExpression(fn)) visit(fn.body);
		}
		const n = Object.values(counts).reduce((x, y) => x + y, 0);
		total += n;
		console.log(`${rel}: ${n} ${name} (${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")})`);
		if (check || n === 0) continue;
		// the new text, and where each old position went (an edit's start or inside it: the start of its new text)
		edits.sort((x, y) => x[0] - y[0]);
		let out = "", at = 0;
		const newStart = new Map();
		for (const ed of edits) { out += text.slice(at, ed[0]); newStart.set(ed, out.length); out += ed[2]; at = ed[1]; }
		out += text.slice(at);
		const moved = new Map(anchors.map(([p, ed, off]) => [p, newStart.get(ed) + off]));
		const newAnchors = new Map(anchors.map(([, ed, off, len]) => [newStart.get(ed) + off, newStart.get(ed) + off + len]));
		const toNew = (p) => {
			let lo = 0, hi = edits.length;
			while (lo < hi) { const m = (lo + hi) >> 1; if (edits[m][0] < p) lo = m + 1; else hi = m; }
			if (lo < edits.length && edits[lo][0] === p) return newStart.get(edits[lo]);
			const ed = edits[lo - 1];
			if (!ed) return p;
			if (p >= ed[1]) return p - ed[1] + newStart.get(ed) + ed[2].length;
			// inside an edit: its common ending with the old text keeps its place (`])` -> `)`: the `)`), anything else goes to its start
			const old = text.slice(ed[0], ed[1]), back = ed[1] - p;
			let k = 0;
			while (k < old.length && k < ed[2].length && old[old.length - 1 - k] === ed[2][ed[2].length - 1 - k]) k++;
			return newStart.get(ed) + (back <= k ? ed[2].length - back : 0);
		};
		const oldStart = [0], newLineStart = [0];
		for (let i = 0; i < text.length; i++) if (text[i] === "\n") oldStart.push(i + 1);
		for (let i = 0; i < out.length; i++) if (out[i] === "\n") newLineStart.push(i + 1);
		if (oldStart.length !== newLineStart.length && !removesLines) throw new Error(`${rel}: the rewrite changed the line count`);
		const newLines = removesLines ? out.split("\n") : null;
		const lineOf = (q) => { let lo = 0, hi = newLineStart.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (newLineStart[m] <= q) lo = m; else hi = m - 1; } return lo; };
		for (const { r, d, path, nth } of rows) {
			const d1 = removesLines ? defLine(newLines, path, nth) : d;
			for (let i = 2; i < r.arr.length; i += 3) {
				const c = r.arr[i + 1], col = colOf(c), line = d + r.arr[i];
				if (col === null) {
					if (!removesLines) continue;
					// a line start: where its first character went (a removed line's: past the edit's new text, from here on)
					const q = toNew(oldStart[line]), nl = lineOf(q);
					if (nl - d1 !== r.arr[i]) { r.arr[i] = nl - d1; dmMoved++; }
					if (q !== newLineStart[nl]) { r.arr[i + 1] = q - newLineStart[nl]; dmMoved++; }
					continue;
				}
				const p = oldStart[line] + col;
				let q = c < 0 && moved.has(p) ? moved.get(p) : toNew(p);
				// an exact column that sat inside an old call's head but not on its name was dead (V8 reports a call at its name): it
				// stays dead, on the `(` after the new name, rather than becoming the new call's
				if (c < 0 && !moved.has(p) && newAnchors.has(q)) q = newAnchors.get(q);
				if (c < 0) for (const [ed, k] of dead) if (ed[0] <= p && p < ed[1]) { q = newStart.get(ed) + k; break; }
				const nl = removesLines ? lineOf(q) : line, nc = q - newLineStart[nl];
				if (nl - d1 !== r.arr[i]) { r.arr[i] = nl - d1; dmMoved++; }
				if (nc !== col) { r.arr[i + 1] = encodeCol(c, nc); dmMoved++; }
			}
		}
		writeFileSync(file, out);
	}
	console.log(`${total} ${name} rewritten${check ? " (--check: nothing written)" : `, ${dmMoved} _dm-lines.json columns moved`}`);
	console.log(`left as they were: ${Object.entries(skipped).map(([k, v]) => `${k} ${v}`).join(", ") || "none"}`);
	if (!check && dmMoved) writeFileSync(dmPath, dmText(dmRows));
}
