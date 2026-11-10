// compare-logs.test - part of `npm test` (from web/). Exercises web/src/tools/compare-logs.ts on two
// fixtures in this folder:
//   clean-boot.log         - the start of a real clean VM boot (world.log then game.log, as boot-check joins them)
//   turret-null-start.log  - a real VM runtime (with its stack): the turret tg bug, fixed in web/game
// The other cases are made from clean-boot.log: cut short, a line moved, a runtime added, the mode changed.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { compareLogs, MILESTONES, repoRoot } from "../../src/tools/compare-logs.js";

let failures = 0;
const fail = (msg: string) => {
	failures++;
	console.log(`FAIL ${msg}`);
};
const ok = (cond: boolean, msg: string) => (cond ? console.log(`ok   ${msg}`) : fail(msg));

const here = (f: string) => readFileSync(resolve(repoRoot, "web/tests/compare-logs", f), "utf8");
const clean = here("clean-boot.log");
const turret = here("turret-null-start.log");
const status = (r: ReturnType<typeof compareLogs>, kind: string) => r.milestoneChecks.find((c) => c.milestone.kind === kind)?.status;

// ---- 1. a clean boot passes ----------------------------------------------------------------------
{
	const r = compareLogs(clean);
	ok(r.ok, `clean boot: ok (milestones ${r.passed}/${r.total}, runtimes ${r.newRuntimes})`);
	ok(r.total === 26 && MILESTONES.length === 26, `clean boot: 26 milestones (got ${r.total})`);
	ok(status(r, "loaded_station") === "pass", "clean boot: decimal 'Loaded station in 1.7s!' passes");
}

// ---- 2. cut short before init completes: the rest is missing -----------------------------------------
{
	const cut = clean.slice(0, clean.indexOf("Initialized Atmospherics"));
	const r = compareLogs(cut);
	ok(!r.ok, "cut-short log: overall fail");
	for (const k of ["subsystem:Atmospherics", "init_complete", "game_start", "mode"]) ok(status(r, k) === "missing", `cut-short log: ${k} missing (${status(r, k)})`);
	ok(status(r, "subsystem:Weather") === "pass", "cut-short log: Weather (before the cut) passes");
}

// ---- 3. a subsystem out of order --------------------------------------------------------------------
{
	const lines = clean.split("\n");
	const i = lines.findIndex((l) => l.startsWith("Initialized Lighting subsystem"));
	const [moved] = lines.splice(i, 1);
	lines.splice(lines.findIndex((l) => l.startsWith("Initialized Jobs subsystem")), 0, moved);
	const r = compareLogs(lines.join("\n"));
	ok(!r.ok && status(r, "subsystem:Lighting") === "out-of-order", `moved Lighting: out of order (${status(r, "subsystem:Lighting")})`);
}

// ---- 4. the wrong mode -------------------------------------------------------------------------------
{
	const r = compareLogs(clean.replace("Saved mode is 'extended'", "Saved mode is 'traitor'"));
	ok(!r.ok && status(r, "mode") === "wrong-value", `mode 'traitor': wrong value (${status(r, "mode")})`);
}

// ---- 5. any runtime fails, milestones unaffected ---------------------------------------------------------
{
	const r = compareLogs(`${clean}\n${turret}`);
	ok(!r.ok && r.newRuntimes === 1, `turret runtime: counts (got ${r.newRuntimes})`);
	ok(r.runtimes[0]?.signature === "/obj/machinery/porta_turret/take_damage", `turret runtime: named by its proc (${r.runtimes[0]?.signature})`);
	ok(r.passed === r.total, `turret runtime: milestones unaffected (${r.passed}/${r.total})`);
}

if (failures) {
	console.log(`\n${failures} failure(s)`);
	process.exitCode = 1;
} else {
	console.log("\nall compare-logs tests passed");
}
