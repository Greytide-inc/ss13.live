#!/usr/bin/env node
// dt-filler.mjs - Detranslate robot (plans/archive/detranslate.md step 9e): blanks the translator's `$0 = $0;` lines in game procs (a name assigned to itself).
// Usage (from web/): node tools/dt-filler.mjs [--check] [TARGET...]
//   TARGET: a game file (game/code/...ts: every proc and tail in it) or a proc path (that rt.def, in whichever file has it); none: all of game/.
//   --check changes nothing, prints what it would do.
// The line stays, empty, so every later line keeps its number (errors find their game line by it). Only a statement alone on its line,
// whose name is declared before it (tools/proc-calls.mjs selfAssignment). The bundle loses only those statements (tools/dt-calls-check.mjs).
import { runRobot } from "./dt-robot.mjs";
import { selfAssignment } from "./proc-calls.mjs";

runRobot("fillers", (ctx) => {
	const { text, sf, counts, skip } = ctx;
	counts.filler = 0;
	return (n) => {
		if (!selfAssignment(n)) return null;
		const a = text.lastIndexOf("\n", n.getStart(sf) - 1) + 1, b = text.indexOf("\n", n.end);
		if (text.slice(a, n.getStart(sf)).trim() || text.slice(n.end, b < 0 ? text.length : b).trim()) return skip("not alone on its line");
		counts.filler++;
		return [[a, b < 0 ? text.length : b, ""]];
	};
});
