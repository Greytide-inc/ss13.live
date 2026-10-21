// compare-logs.test - part of `npm test` (from web/). Exercises web/src/tools/compare-logs.ts
// against the real reference log plus two small fixtures in this folder:
//   truncated.log          - the reference log cut off partway through boot (missing milestones)
//   injected-runtime.log   - the full reference log plus one fabricated "Runtime in fakebug.dm,42" line
//
// 1. Reference vs itself must pass completely (0 missing/out-of-order milestones, 0 new runtimes).
// 2. Truncated log must report the milestones that were cut off as missing, and fail overall.
// 3. Injected-runtime log must flag fakebug.dm,42 as new and fail overall, while every milestone
//    (all of which are still present, unchanged) still passes.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { compareLogs, repoRoot } from "../../src/tools/compare-logs.js";

let failures = 0;
const fail = (msg: string) => {
	failures++;
	console.log(`FAIL ${msg}`);
};
const ok = (cond: boolean, msg: string) => (cond ? console.log(`ok   ${msg}`) : fail(msg));

const referenceText = readFileSync(resolve(repoRoot, "web/reference/byond-boot.log"), "utf8");
const gameLogText = readFileSync(resolve(repoRoot, "web/reference/byond-data-logs/game.log"), "utf8");
const runtimeLogText = readFileSync(resolve(repoRoot, "web/reference/byond-data-logs/runtime.log"), "utf8");
const truncatedText = readFileSync(resolve(repoRoot, "web/tests/compare-logs/truncated.log"), "utf8");
const injectedText = readFileSync(resolve(repoRoot, "web/tests/compare-logs/injected-runtime.log"), "utf8");
// The reference with decimal durations ("Loaded station in 50.6s!", "Game start took 0.4s"), as tg prints them.
const decimalText = readFileSync(resolve(repoRoot, "web/tests/compare-logs/decimal-seconds.log"), "utf8");
// The two runtimes (with their stacks) from a real VM boot where a null-air lavaland cave's west
// neighbour reached it first in setup_allturfs (see TG_BUG_VARIANTS in compare-logs.ts).
const caveText = readFileSync(resolve(repoRoot, "web/tests/compare-logs/cave-null-air.log"), "utf8");
// The real orch-600-combined.log block: same cave bug, but both the east AND north neighbours
// (visited after the cave in setup_allturfs) crash, with the cave's own open.dm,103 line FIRST.
const caveEastNorthText = readFileSync(resolve(repoRoot, "web/tests/compare-logs/cave-null-air-eastnorth.log"), "utf8");
// The portable_turret.dm,317 runtime (with its stack) from a real VM boot: take_damage's ..()
// synchronously qdels the turret and nulls spark_system, then take_damage's own prob(30) tail
// calls spark_system.start() (see RNG_TG_BUGS in compare-logs.ts).
const turretText = readFileSync(resolve(repoRoot, "web/tests/compare-logs/turret-null-start.log"), "utf8");

// A real VM boot log is expected to be one combined stream (world.log + game.log content), unlike
// BYOND which splits them into separate files. Simulate that by concatenating the two reference
// files, since that's what "the reference against itself" means for a single-log VM.
const combinedReferenceText = `${referenceText}\n${gameLogText}`;

// ---- 1. reference against itself --------------------------------------------------------------
{
	const r = compareLogs(combinedReferenceText, referenceText, gameLogText, runtimeLogText);
	ok(r.ok, `reference vs itself: ok (milestones ${r.passed}/${r.total}, new runtimes ${r.newRuntimes})`);
	ok(r.passed === r.total, `reference vs itself: all milestones pass (${r.passed}/${r.total})`);
	ok(r.newRuntimes === 0, `reference vs itself: 0 new runtimes (got ${r.newRuntimes})`);
	ok(r.total >= 15, `reference vs itself: found a plausible number of milestones (${r.total}, expect >=15 incl. 9 subsystems)`);
	const knownGetrev = r.runtimes.find((x) => x.signature === "getrev.dm,27");
	ok(!!knownGetrev?.known, "reference vs itself: getrev.dm,27 recognised as a known reference runtime");
}

// ---- 2. truncated log: missing milestones -------------------------------------------------------
{
	const r = compareLogs(truncatedText, referenceText, gameLogText, runtimeLogText);
	ok(!r.ok, "truncated log: overall fail");
	ok(r.passed < r.total, `truncated log: some milestones missing (${r.passed}/${r.total})`);
	const missing = r.milestoneChecks.filter((c) => c.status === "missing").map((c) => c.milestone.kind);
	ok(missing.includes("init_complete"), "truncated log: 'Initializations complete' reported missing");
	ok(missing.includes("game_start"), "truncated log: 'Game start took' reported missing");
	ok(missing.includes("subsystem:Atmospherics"), "truncated log: Atmospherics subsystem reported missing");
}

// ---- 3. injected runtime: new runtime detected, milestones unaffected --------------------------
{
	const r = compareLogs(injectedText, referenceText, gameLogText, runtimeLogText);
	ok(!r.ok, "injected-runtime log: overall fail");
	ok(r.newRuntimes === 1, `injected-runtime log: exactly 1 new runtime (got ${r.newRuntimes})`);
	const fake = r.runtimes.find((x) => x.signature === "fakebug.dm,42");
	ok(!!fake && !fake.known, "injected-runtime log: fakebug.dm,42 flagged as new");
	ok(r.passed === r.total, `injected-runtime log: milestones unaffected (${r.passed}/${r.total})`);
}

// ---- 4. decimal seconds: "Loaded station in 50.6s!" still counts ------------------------------------
{
	const r = compareLogs(`${decimalText}\n${gameLogText}`, referenceText, gameLogText, runtimeLogText);
	const st = (k: string) => r.milestoneChecks.find((c) => c.milestone.kind === k)?.status;
	ok(st("loaded_station") === "pass", `decimal-seconds log: 'Loaded station in 50.6s!' passes (${st("loaded_station")})`);
	ok(st("game_start") === "pass", `decimal-seconds log: 'Game start took 0.4s' passes (${st("game_start")})`);
	ok(r.passed === r.total, `decimal-seconds log: all milestones pass (${r.passed}/${r.total})`);
}

// ---- 5. no networking: "World opened on network port" is n/a, not missing ----------------------
// A VM log never has this line (DreamDaemon's own networking banner, not tg game code); simulate
// that by stripping it out of the combined reference, the way a real VM boot log looks.
{
	const noNetworkText = combinedReferenceText
		.split("\n")
		.filter((l) => !/^World opened on network port \d+\.$/.test(l))
		.join("\n");
	const r = compareLogs(noNetworkText, referenceText, gameLogText, runtimeLogText);
	const worldOpened = r.milestoneChecks.find((c) => c.milestone.kind === "world_opened");
	ok(worldOpened?.status === "n/a", `no-networking log: 'World opened on network port' is n/a (got ${worldOpened?.status})`);
	ok(r.ok, `no-networking log: overall ok despite the missing host-only line (milestones ${r.passed}/${r.total})`);
	ok(r.passed === r.total, `no-networking log: n/a milestone excluded from the pass/total tally (${r.passed}/${r.total})`);
}

// ---- 6. known tg timing race: reported, not counted; a different message at that line still is ---
{
	const race = `${combinedReferenceText}\n[03:58:23] Runtime in npcpool.dm,48: Cannot read null.ckey\n`;
	const r = compareLogs(race, referenceText, gameLogText, runtimeLogText);
	const hit = r.runtimes.find((x) => x.signature === "npcpool.dm,48");
	ok(!!hit?.race, "timing-race log: npcpool.dm,48 null.ckey tagged as a tg timing race");
	ok(r.ok && r.newRuntimes === 0, `timing-race log: overall ok, 0 new runtimes (got ${r.newRuntimes})`);
	const other = compareLogs(`${combinedReferenceText}\nRuntime in npcpool.dm,48: Cannot read null.stat\n`, referenceText, gameLogText, runtimeLogText);
	ok(!other.ok && other.newRuntimes === 1, "timing-race log: same line with a different message is still NEW");
}

// ---- 7. tg-bug variant: gas_mixture.dm,395 counted only when tied to its open.dm,103 cave sibling ---
{
	const r = compareLogs(`${combinedReferenceText}\n${caveText}`, referenceText, gameLogText, runtimeLogText);
	const hit = r.runtimes.find((x) => x.signature === "gas_mixture.dm,395");
	ok(!!hit?.variant, "cave-variant log: gas_mixture.dm,395 tagged as a variant of the reference's cave runtime");
	ok(r.ok && r.newRuntimes === 0, `cave-variant log: overall ok, 0 new runtimes (got ${r.newRuntimes})`);
	// Without the sibling open.dm,103 runtime the same line is NEW.
	const alone = caveText.split("\n").slice(0, 10).join("\n");
	const a = compareLogs(`${combinedReferenceText}\n${alone}\n`, referenceText, gameLogText, runtimeLogText);
	ok(!a.ok && a.newRuntimes === 1, `cave-variant log: without its cave sibling it is NEW (got ${a.newRuntimes})`);
	// A sibling that isn't the east/north neighbour doesn't count.
	const far = caveText.replace(/\(20,36,5\)/g, "(22,36,5)");
	const f = compareLogs(`${combinedReferenceText}\n${far}`, referenceText, gameLogText, runtimeLogText);
	ok(!f.ok && f.newRuntimes === 1, `cave-variant log: sibling not adjacent -> still NEW (got ${f.newRuntimes})`);
	// Called from anywhere but setup_allturfs (e.g. process_cell during play) is NEW.
	const play = caveText.replace("setup allturfs()", "process active turfs(0)");
	const p = compareLogs(`${combinedReferenceText}\n${play}`, referenceText, gameLogText, runtimeLogText);
	ok(!p.ok && p.newRuntimes === 1, `cave-variant log: outside setup_allturfs -> still NEW (got ${p.newRuntimes})`);
	// A different message on the same line is NEW.
	const msg = caveText.replace("Cannot read null.gases", "Cannot read null.temperature");
	const m = compareLogs(`${combinedReferenceText}\n${msg}`, referenceText, gameLogText, runtimeLogText);
	ok(!m.ok && m.newRuntimes === 1, `cave-variant log: different message -> still NEW (got ${m.newRuntimes})`);
}

// ---- 7b. tg-bug variant: east/north neighbours, cave's open.dm,103 line comes BEFORE them --------
{
	const r = compareLogs(`${combinedReferenceText}\n${caveEastNorthText}`, referenceText, gameLogText, runtimeLogText);
	const hits = r.runtimes.filter((x) => x.signature === "gas_mixture.dm,395" && x.line > combinedReferenceText.split("\n").length);
	ok(hits.length === 2, `east/north cave log: both neighbour runtimes reported (got ${hits.length})`);
	ok(
		hits.every((h) => !!h.variant),
		"east/north cave log: both tagged as variants of the reference's cave runtime",
	);
	ok(r.ok && r.newRuntimes === 0, `east/north cave log: overall ok, 0 new runtimes (got ${r.newRuntimes})`);
	// Without the cave's own open.dm,103 line, both are NEW.
	const noCave = caveEastNorthText.split("\n").slice(8).join("\n");
	const nc = compareLogs(`${combinedReferenceText}\n${noCave}`, referenceText, gameLogText, runtimeLogText);
	ok(!nc.ok && nc.newRuntimes === 2, `east/north cave log: without the cave sibling both are NEW (got ${nc.newRuntimes})`);
}

// ---- 8. RNG tg bug: portable_turret.dm,317 counted only when the stack is take_damage's own ----
{
	const r = compareLogs(`${combinedReferenceText}\n${turretText}`, referenceText, gameLogText, runtimeLogText);
	const hit = r.runtimes.find((x) => x.signature === "portable_turret.dm,317");
	ok(!!hit?.rngBug, "turret log: portable_turret.dm,317 tagged as an RNG-triggered tg bug");
	ok(r.ok && r.newRuntimes === 0, `turret log: overall ok, 0 new runtimes (got ${r.newRuntimes})`);
	// Near-miss: same signature and message, but from some other proc (not take_damage) -- still NEW.
	const elsewhere = turretText.replace(
		"proc name: take damage (/obj/machinery/porta_turret/take_damage)",
		"proc name: process (/obj/machinery/porta_turret/process)",
	);
	const e = compareLogs(`${combinedReferenceText}\n${elsewhere}`, referenceText, gameLogText, runtimeLogText);
	ok(!e.ok && e.newRuntimes === 1, `turret log: same line from a different proc -> still NEW (got ${e.newRuntimes})`);
}

if (failures) {
	console.log(`\n${failures} failure(s)`);
	process.exitCode = 1;
} else {
	console.log("\nall compare-logs tests passed");
}
