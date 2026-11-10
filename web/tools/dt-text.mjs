#!/usr/bin/env node
// dt-text.mjs - Detranslate robot (plans/archive/detranslate.md step 9d): rewrites DM text with embedded values in game procs as template strings.
// Usage (from web/): node tools/dt-text.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the columns of the files' rows in game/_dm-lines.json itself.
// Rule (the bundler, translate-tg.mjs lowerTemplate, turns it back into exactly the old call):
//   fmt("＀-punch", [x])  ->  `${x}-punch`
// Never: a text with DM's macro characters (U+FF01-U+FFFF: \the, \ref, \s...: `${}` can only be a plain `[x]`), a text whose `＀`
// count isn't its values', no values, spread values, an alias its proc shadows, a call broken over lines where its new text goes.
import ts from "typescript";
import { runRobot } from "./dt-robot.mjs";
import { opFunction, rtAliases } from "./proc-calls.mjs";

/** text as a template string's raw text: backslashes, backticks and `${` escaped, control characters as escapes */
const raw = (t) => t.replace(/[\\`\n\r\t\u2028\u2029\x00-\x1f]|\$(?=\{)/g, (c) => ({ "\\": "\\\\", "`": "\\`", $: "\\$", "\n": "\\n", "\r": "\\r", "\t": "\\t" })[c]
	?? `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);

runRobot("texts", (ctx) => {
	const { text, sf, scope, counts, anchors, skip } = ctx;
	counts.text = 0;
	const aliases = rtAliases(sf);
	return (n) => {
		if (!ts.isCallExpression(n) || !ts.isIdentifier(n.expression) || n.expression.text !== "fmt") return null;
		const [s, l] = n.arguments;
		if (n.arguments.length !== 2 || !ts.isStringLiteral(s) || !l || !ts.isArrayLiteralExpression(l)) return skip("not fmt(literal, [values])");
		if (opFunction("fmt", n, aliases, scope) !== "fmt") return skip("fmt shadowed");
		if (/[！-￿]/.test(s.text)) return skip("DM text macros");
		const parts = s.text.split("＀"), vals = l.elements;
		if (vals.length === 0 || parts.length !== vals.length + 1 || vals.some((v) => ts.isSpreadElement(v) || ts.isOmittedExpression(v))) return skip("values");
		const at = (x) => x.getStart(sf), spans = [[at(n), at(vals[0])], ...vals.slice(1).map((v, i) => [vals[i].end, at(v)]), [vals[vals.length - 1].end, n.end]];
		if (spans.some(([a, b]) => /\n|\/\/|\/\*/.test(text.slice(a, b)))) return skip("split over lines");
		const edits = spans.map(([a, b], i) => [a, b, `${i ? "}" : "`"}${raw(parts[i])}${i < vals.length ? "${" : "`"}`]);
		anchors.push([at(n), edits[0], 0, 1]);
		counts.text++;
		return edits;
	};
});
