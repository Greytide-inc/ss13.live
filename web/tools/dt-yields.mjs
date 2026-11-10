#!/usr/bin/env node
// dt-yields.mjs - Detranslate robot (plans/archive/detranslate.md step 9f): drops `yield*` before proc calls in game procs that can never pause.
// Usage (from web/): node tools/dt-yields.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the columns of the files' rows in game/_dm-lines.json itself.
// Rule (the bundler, translate-tg.mjs lowerCall, adds it back: `yield* x()` as a statement, `(yield* x())` elsewhere):
//   yield* to_chat(user, "Hi");  ->  to_chat(user, "Hi");        f.dot = (yield* get_dist(A, B));  ->  f.dot = get_dist(A, B);
// A call can pause (tools/proc-calls.mjs callCanWait) when it's `..()`, a method some proc of that name is a function* of, or a global
// proc that is one or a pausing built-in (sleep, alert, winget, winexists): those keep theirs. Only the proc call spellings of step 8.
import { resolve } from "node:path";
import ts from "typescript";
import { runRobot } from "./dt-robot.mjs";
import { callCanWait, procNameSets, readableCall } from "./proc-calls.mjs";

const sets = procNameSets(resolve(import.meta.dirname, "../game"));

runRobot("yields", (ctx) => {
	const { text, sf, scope, counts, skip } = ctx;
	counts.yield = 0;
	const names = { ...sets, scope };
	return (n) => {
		if (!ts.isYieldExpression(n) || !n.asteriskToken || !n.expression || !ts.isCallExpression(n.expression)) return null;
		const c = n.expression, rc = readableCall(c, names);
		if (!rc) return null;
		if (callCanWait(rc, names)) return skip("can pause");
		const p = n.parent, tight = ts.isParenthesizedExpression(p) && p.getStart(sf) + 1 === n.getStart(sf) && p.end - 1 === n.end;
		const a = tight ? p.getStart(sf) : n.getStart(sf);
		if (/\n|\/\/|\/\*/.test(text.slice(a, c.getStart(sf)))) return skip("split over lines");
		counts.yield++;
		const e = [a, c.getStart(sf), ""];
		// an exact column on `yield*` (dead: V8 reports the call at its name) stays dead: past a global call's name, not on it
		if (rc.kind === "global") ctx.dead.push([e, rc.name.length]);
		return tight ? [e, [c.end, p.end, ""]] : [e];
	};
});
