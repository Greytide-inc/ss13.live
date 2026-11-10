#!/usr/bin/env node
// dt-list.mjs - Detranslate robot (plans/archive/detranslate.md step 9j): rewrites rt.list(a, b) in game procs as DM's plain list(a, b).
// Usage (from web/): node tools/dt-list.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do. Moves the columns of the files' rows in game/_dm-lines.json itself.
// Rule (the bundler, translate-tg.mjs, puts the `rt.` back; tools/proc-calls.mjs isListCall): rt.list(a, b) -> list(a, b).
// Never: a proc or file that binds `list` (a parameter of that name), `rt . list` spelled with spaces.
import { callee, runRobot } from "./dt-robot.mjs";

runRobot("lists", (ctx) => {
	const { text, sf, scope, counts, skip } = ctx;
	counts.list = 0;
	return (n) => {
		if (callee(n) !== "rt.list") return null;
		const s = n.getStart(sf);
		if (scope.all(n).has("list")) return skip("list is bound there");
		if (text.slice(s, s + 8) !== "rt.list(") return skip("spelling");
		counts.list++;
		return [[s, s + 3, ""]];
	};
});
