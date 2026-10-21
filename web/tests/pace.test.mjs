// pace.test.mjs - after a stall (an ~800 ms GC of the worker, or one ~800 ms tick) the paced tick loop doesn't fire
// the missed ticks back to back; a short lateness (150 ms) is still caught up. Simulates boot-worker.ts's loop on a fake clock.
// Usage (from web/, after `npx tsc -p .`): node tests/pace.test.mjs
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const web = resolve(import.meta.dirname, "..");
const { paceStep, paceStart, CATCHUP_MAX_MS } = await import(pathToFileURL(resolve(web, "build/dist/src/worker/pace.js")).href);

const LAG = 50, TICK_MS = 3;
/** Runs 60 ticks; `stall(i)` = extra ms lost before tick i (in the wait) or inside it. Returns each tick's start time. */
function run(stallBefore, stallIn) {
	const pace = { wall: 0, tick: 0 };
	let now = 0;
	const starts = [];
	for (let due = 1; due <= 60; due++) {
		const target = paceStep(pace, due, LAG);
		if (target > now) now = target; // the loop waits until target
		now += stallBefore(due); // woke late (GC between ticks)
		paceStart(pace, now);
		starts.push(now);
		now += TICK_MS + stallIn(due); // the tick itself
	}
	return starts;
}
const gaps = (s) => s.slice(1).map((t, i) => t - s[i]);
let failed = 0;
const check = (name, ok, detail) => { console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok ? "" : ": " + detail}`); if (!ok) failed++; };

for (const [name, before, inside] of [
	["800 ms GC between ticks", (d) => (d === 20 ? 800 : 0), () => 0],
	["800 ms tick", () => 0, (d) => (d === 20 ? 800 : 0)],
]) {
	const g = gaps(run(before, inside));
	const burst = g.filter((x) => x < LAG - 1);
	console.log(`  ${name}: tick spacing ${g.slice(17, 25).join(", ")} ms`);
	check(`${name}: no burst after the stall`, burst.length === 0, `${burst.length} ticks closer than ${LAG} ms: ${g.join(",")}`);
}
{
	const g = gaps(run((d) => (d === 20 ? 150 : 0), () => 0));
	const fast = g.filter((x) => x < LAG - 1).length;
	console.log(`  150 ms late: tick spacing ${g.slice(17, 25).join(", ")} ms`);
	check(`under CATCHUP_MAX_MS (${CATCHUP_MAX_MS}) is caught up`, fast >= 2, g.join(","));
}
if (failed) { console.log(`${failed} pace test(s) failed`); process.exit(1); }
console.log("pace tests passed");
