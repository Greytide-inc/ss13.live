#!/usr/bin/env node
// dt-new.mjs - Detranslate robot (plans/archive/detranslate.md step 9k): rewrites the engine's new_ calls in game procs as new_(T("/obj/x"), a, b).
// Usage (from web/): node tools/dt-new.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the columns of the files' rows in game/_dm-lines.json itself.
// Rules (the bundler, translate-tg.mjs, writes back the old call; tools/proc-calls.mjs isNewCall):
//   rt.new_(f, T("/obj/x"), [a, b]) -> new_(T("/obj/x"), a, b)        yield* g.new_(f, X, []) -> yield* new_(X)
// Never: named arguments or a values list that isn't written out ([...] with no spread), g.new_ not under yield* or rt.new_ under one,
// a proc or file that binds new_, a head or tail broken over lines.
import ts from "typescript";
import { callee, runRobot } from "./dt-robot.mjs";

runRobot("news", (ctx) => {
	const { text, sf, scope, counts, anchors, skip } = ctx;
	counts.new_ = 0;
	return (n) => {
		const c = callee(n);
		if (c !== "rt.new_" && c !== "g.new_") return null;
		const a = n.arguments, s = n.getStart(sf), yielded = ts.isYieldExpression(n.parent) && !!n.parent.asteriskToken;
		if (a.length !== 3 || !ts.isArrayLiteralExpression(a[2]) || a[2].elements.some(ts.isSpreadElement)) return skip("named arguments or a values list");
		if ((c === "g.new_") !== yielded) return skip("g.new_ without yield* or rt.new_ under one");
		if (scope.all(n).has("new_")) return skip("new_ is bound there");
		const vals = a[2].elements, head = [s, a[1].getStart(sf), "new_("];
		if (!/^(g|rt)\.new_\(f, $/.test(text.slice(s, a[1].getStart(sf)))) return skip("split over lines");
		anchors.push([s + c.length - 4, head, 0, 4]); // an exact column on new_: on the new name
		counts.new_++;
		if (!vals.length) {
			if (!/^, \[\]\)$/.test(text.slice(a[1].end, n.end))) return skip("split over lines");
			return [head, [a[1].end, n.end, ")"]];
		}
		if (!/^, \[$/.test(text.slice(a[1].end, vals[0].getStart(sf))) || !/^\]\)$/.test(text.slice(vals[vals.length - 1].end, n.end))) return skip("split over lines");
		return [head, [a[1].end, vals[0].getStart(sf), ", "], [vals[vals.length - 1].end, n.end, ")"]];
	};
});
