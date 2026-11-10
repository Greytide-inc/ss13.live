#!/usr/bin/env node
// dt-loops.mjs - Detranslate robot (plans/archive/detranslate.md step 9h): rewrites the translator's list loops in game procs as `for (M of each(L, T("/mob")))`.
// Usage (from web/): node tools/dt-loops.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the files' rows in game/_dm-lines.json itself (lines too: this one removes some).
// Rule (the bundler, translate-tg.mjs lowerEach, writes back exactly the old statements, on the loop's first line; tools/proc-calls.mjs isEachLoop):
//   rt.forList(f, K, L, T("/mob"));                      for (M of each(L, T("/mob"))) {
//   while (($e = rt.next(f, K)) !== undefined) {   ->       ...
//   	M = $e;                                           }
//   	...
//   }
//   rt.endFor(f, K);
// and `let $e: any;` goes when no `$e` is left in the proc (the bundler declares it again, where it was: the last declaration).
// Never: a loop whose K isn't eachSlot's, one in a nested function, a proc or file that binds `each`, _dm-lines.json entries on the
// `while` or `M = $e` lines or past the start of the endFor line, anything else on those lines.
import ts from "typescript";
import { callee, runRobot } from "./dt-robot.mjs";
import { eachSlot, nearestFunction, procFunction } from "./proc-calls.mjs";

runRobot("loops", (ctx) => {
	const { text, sf, scope, counts, anchors, skip, dmAt } = ctx;
	counts.loop = 0; counts["let $e"] = 0;
	const at = (n) => n.getStart(sf);
	const lineAt = (p) => sf.getLineAndCharacterOfPosition(p).line;
	const lineStart = (p) => text.lastIndexOf("\n", p - 1) + 1;
	const restOfLine = (p) => { const e = text.indexOf("\n", p); return text.slice(p, e < 0 ? text.length : e); };
	/** the edits for the loop of statements sts[i..i+2], or null */
	const loop = (sts, i) => {
		const [a, w, e] = [sts[i], sts[i + 1], sts[i + 2]];
		if (!w || !e || !ts.isExpressionStatement(a) || callee(a.expression) !== "rt.forList") return null;
		const args = a.expression.arguments;
		if (args.length < 3 || args.length > 4 || args.some(ts.isSpreadElement) || !ts.isNumericLiteral(args[1]) || args[0].getText(sf) !== "f") return skip("forList arguments");
		const k = args[1].text, last = args[args.length - 1];
		if (!ts.isWhileStatement(w) || !ts.isBlock(w.statement) || w.expression.getText(sf) !== `($e = rt.next(f, ${k})) !== undefined`) return skip("not a while (rt.next) loop");
		const first = w.statement.statements[0];
		const m = first && /^([A-Za-z_$][\w$]*) = \$e;$/.exec(first.getText(sf));
		if (!m || m[1] === "$e") return skip("the body doesn't start with `M = $e;`");
		if (e.getText(sf) !== `rt.endFor(f, ${k});`) return skip("no rt.endFor right after");
		if (nearestFunction(a) !== procFunction(a)) return skip("in a nested function");
		if (scope.all(a).has("each")) return skip("each is bound there");
		if (String(eachSlot(w, scope)) !== k) return skip("slot isn't eachSlot's");
		// the layout: the forList statement starts its line, `while` and `M = $e;` lines of their own, endFor alone after the `}`
		if (text.slice(lineStart(at(a)), at(a)).trim() || /\n|\/\/|\/\*/.test(text.slice(at(a), at(args[2])))) return skip("layout");
		if (!/^\);\n[ \t]*while \(\(\$e = rt\.next\(f, \d+\)\) !== undefined\) \{\n[ \t]*[\w$]+ = \$e;$/.test(text.slice(last.end, first.end)) || restOfLine(first.end).trim()) return skip("layout");
		if (!/^\n[ \t]*rt\.endFor\(f, \d+\);$/.test(text.slice(w.statement.end, e.end)) || restOfLine(e.end).trim()) return skip("layout");
		const lw = lineAt(at(w)), le = lineAt(at(e));
		if (dmAt(lw).length || dmAt(lw + 1).length || dmAt(le).some((c) => c !== 0)) return skip("DM line entries on the loop's own lines");
		const head = [at(a), at(args[2]), `for (${m[1]} of each(`];
		anchors.push([at(a) + 3, head, m[1].length + 9, 4]); // an exact column on forList: on each
		counts.loop++;
		return [head, [last.end, first.end, ")) {"], [w.statement.end, e.end, ""]];
	};
	return (n) => {
		const fn = procFunction(n);
		if (!fn || n !== fn.body) return null;
		const edits = [];
		const walk = (x) => {
			if (x !== fn && ts.isFunctionLike(x)) return;
			const sts = ts.isBlock(x) || ts.isCaseClause(x) || ts.isDefaultClause(x) ? x.statements : null;
			if (sts) for (let i = 0; i < sts.length; i++) { const e = loop(sts, i); if (e) edits.push(...e); }
			ts.forEachChild(x, walk);
		};
		walk(fn.body);
		if (!edits.length) return null;
		// `let $e: any;`: dropped when nothing else in the proc uses $e, it's the last top-level declaration, and right after another
		// one or the proc's first statement (the bundler puts it back after the last declaration, before f.vars)
		const sts = fn.body.statements, d = sts.findIndex((st) => st.getText(sf) === "let $e: any;");
		let left = 0;
		const count = (x) => {
			if (ts.isIdentifier(x) && x.text === "$e" && !edits.some(([p, q]) => p <= at(x) && x.end <= q)) left++;
			ts.forEachChild(x, count);
		};
		count(fn.body);
		const decls = sts.filter(ts.isVariableStatement);
		if (d >= 0 && left === 1 && decls[decls.length - 1] === sts[d] && (d === 0 || ts.isVariableStatement(sts[d - 1]))) {
			const s = lineStart(at(sts[d])), eol = text.indexOf("\n", sts[d].end);
			if (text.slice(s, at(sts[d])).trim() || text.slice(sts[d].end, eol).trim() || dmAt(lineAt(s)).length) skip("let $e: any; not alone on its line");
			else { edits.push([s, eol + 1, ""]); counts["let $e"]++; }
		} else if (d >= 0) skip(left > 1 ? "let $e: any; kept: $e used elsewhere" : "let $e: any; kept: not where the bundler would put it");
		return edits;
	};
}, { removesLines: true });
