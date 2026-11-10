#!/usr/bin/env node
// dt-builtins.mjs - Detranslate robot (plans/archive/detranslate.md step 9c): rewrites DM built-ins in game procs as plain calls.
// Usage (from web/): node tools/dt-builtins.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the columns of the files' rows in game/_dm-lines.json itself.
// Rules (the bundler, translate-tg.mjs lowerBuiltin, turns each back into exactly the old call; tools/proc-calls.mjs DM_BUILTINS):
//   rt.op(f, "Prob", [], [p])                -> prob(p)
//   rt.op(f, "PickUnweighted", [2], [a, b])  -> pick(a, b)     (the operand is the count of the values)
// Never: a name the proc or the file binds, spread values, a call under yield*, one whose head or tail is broken over lines.
import ts from "typescript";
import { callee, runRobot } from "./dt-robot.mjs";
import { DM_BUILTINS } from "./proc-calls.mjs";

const NAMES = Object.fromEntries(Object.entries(DM_BUILTINS).map(([k, v]) => [v, k])); // "Prob" -> "prob"

runRobot("built-ins", (ctx) => {
	const { text, sf, scope, counts, anchors, skip } = ctx;
	for (const k of Object.keys(DM_BUILTINS)) counts[k] = 0;
	return (n) => {
		if (callee(n) !== "rt.op") return null;
		const a = n.arguments;
		if (a.length !== 4 || !ts.isIdentifier(a[0]) || a[0].text !== "f" || !ts.isStringLiteral(a[1]) || !NAMES[a[1].text]) return null;
		const nm = NAMES[a[1].text];
		if (!ts.isArrayLiteralExpression(a[2]) || !ts.isArrayLiteralExpression(a[3])) return skip("not literal lists");
		const vals = a[3].elements;
		if (vals.length === 0 || vals.some(ts.isSpreadElement)) return skip("spread or no values");
		if (a[2].elements.map((x) => x.getText(sf)).join(",") !== (nm === "prob" ? "" : String(vals.length)) || (nm === "prob" && vals.length !== 1)) return skip("operands");
		if (scope.all(n).has(nm)) return skip("the name is bound there");
		if (ts.isYieldExpression(n.parent)) return skip("under yield*");
		const h = [n.getStart(sf), vals[0].getStart(sf), `${nm}(`], t = [vals[vals.length - 1].end, n.end, ")"];
		if (!/^rt\.op\(f, "\w+", \[\d*\], \[$/.test(text.slice(h[0], h[1])) || !/^[ \t]*\]\)$/.test(text.slice(t[0], t[1]))) return skip("split over lines");
		anchors.push([n.getStart(sf) + 3, h, 0, nm.length]);
		counts[nm]++;
		return [h, t];
	};
});
