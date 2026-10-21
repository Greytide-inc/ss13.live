// animation.test.ts - Node tests for src/dmi/animation.ts's frameAtTime()/buildAnimationSteps().
// Pure arithmetic, no DOM/canvas, no fixture files -- every value here is hand-worked in the comment
// next to it. Usage: part of `npm test` (tests/all.mjs).

import { animationElapsed, buildAnimationSteps, frameAtTime } from "../../src/dmi/animation.js";

let failures = 0;
function check(name: string, got: unknown, want: unknown) {
	const g = JSON.stringify(got);
	const w = JSON.stringify(want);
	if (g === w) {
		console.log(`ok   ${name}`);
	} else {
		failures++;
		console.log(`FAIL ${name}: got ${g} want ${w}`);
	}
}

// ---- single-frame state: always frame 0, whatever loop/rewind/t say ----
check("single-frame frame0 t=0", frameAtTime(1, [], 0, false, 0), 0);
check("single-frame frame0 t=100", frameAtTime(1, [], 5, true, 100), 0);

// ---- buildAnimationSteps expansion ----
// frames=3, no rewind: just the 3 forward steps, own delays.
check("steps plain", buildAnimationSteps(3, [3, 4, 3], false), [
	{ frame: 0, delay: 3 },
	{ frame: 1, delay: 4 },
	{ frame: 2, delay: 3 },
]);
// frames=4, rewind: forward 0,1,2,3 then backward excluding both ends: 2,1.
check("steps rewind frames=4", buildAnimationSteps(4, [1, 1, 1, 1], true), [
	{ frame: 0, delay: 1 },
	{ frame: 1, delay: 1 },
	{ frame: 2, delay: 1 },
	{ frame: 3, delay: 1 },
	{ frame: 2, delay: 1 },
	{ frame: 1, delay: 1 },
]);

// ---- plain (non-rewind) loop=0 (forever): real "carp" delays from animal.dmi, [3,4,3] ----
// cumulative boundaries: frame0 covers [0,3), frame1 covers [3,7), frame2 covers [7,10), then wraps.
// total = 10.
{
	const delay = [3, 4, 3];
	check("plain t=0", frameAtTime(3, delay, 0, false, 0), 0);
	check("plain t=2.9", frameAtTime(3, delay, 0, false, 2.9), 0);
	check("plain t=3 (boundary -> next frame)", frameAtTime(3, delay, 0, false, 3), 1);
	check("plain t=6.9", frameAtTime(3, delay, 0, false, 6.9), 1);
	check("plain t=7", frameAtTime(3, delay, 0, false, 7), 2);
	check("plain t=9.9", frameAtTime(3, delay, 0, false, 9.9), 2);
	check("plain t=10 (wraps to frame0)", frameAtTime(3, delay, 0, false, 10), 0);
	check("plain t=13 (same as t=3, one lap later)", frameAtTime(3, delay, 0, false, 13), 1);
	check("plain t=1003 (100 laps + 3)", frameAtTime(3, delay, 0, false, 1003), 1);
}

// ---- loop count reached: frames=2, delay=[1,1], loop=2 -> plays twice (total 4 deciseconds), then
//      freezes on the LAST step of the sequence (frame 1), not frame 0. ----
{
	const delay = [1, 1];
	check("loop=2 t=0.5 (mid first play)", frameAtTime(2, delay, 2, false, 0.5), 0);
	check("loop=2 t=1.5 (mid second half of first play)", frameAtTime(2, delay, 2, false, 1.5), 1);
	check("loop=2 t=3.5 (mid second play)", frameAtTime(2, delay, 2, false, 3.5), 1);
	check("loop=2 t=4 (exactly played out -> freeze last)", frameAtTime(2, delay, 2, false, 4), 1);
	check("loop=2 t=100 (long after -> still frozen last)", frameAtTime(2, delay, 2, false, 100), 1);
}

// ---- rewind + loop=0 (forever): frames=3, delay=[1,1,1] -> steps 0,1,2,1 (total=4) ----
{
	const delay = [1, 1, 1];
	check("rewind t=0.5 (forward, frame0)", frameAtTime(3, delay, 0, true, 0.5), 0);
	check("rewind t=1.5 (forward, frame1)", frameAtTime(3, delay, 0, true, 1.5), 1);
	check("rewind t=2.5 (forward, frame2 -- the turning point)", frameAtTime(3, delay, 0, true, 2.5), 2);
	check("rewind t=3.5 (backward, frame1 again)", frameAtTime(3, delay, 0, true, 3.5), 1);
	check("rewind t=4.0 (wraps, back to frame0)", frameAtTime(3, delay, 0, true, 4.0), 0);
	check("rewind t=4.5 (next lap, frame0)", frameAtTime(3, delay, 0, true, 4.5), 0);
}

// ---- rewind + loop=2, from BYOND 511 (video): 4 frames delay 5 play 0123210123210, stop on 0 ----
{
	const delay = [5, 5, 5, 5];
	check("rewind loop=2 t=57 (second lap, backward frame1)", frameAtTime(4, delay, 2, true, 57), 1);
	check("rewind loop=2 t=60 (played out -> frame 0)", frameAtTime(4, delay, 2, true, 60), 0);
	check("rewind loop=2 t=500 (still frame 0)", frameAtTime(4, delay, 2, true, 500), 0);
}

// ---- all-zero delay (degenerate; shouldn't hang or throw): show frame 0 ----
check("all-zero delay", frameAtTime(3, [0, 0, 0], 0, false, 5), 0);

// ---- animationElapsed: loop=0 shares the scene's clock, loop>0 uses the object's own ----
check("animationElapsed loop=0 picks shared", animationElapsed(0, 12, 3), 12);
check("animationElapsed loop missing (0) picks shared", animationElapsed(0, 0, 999), 0);
check("animationElapsed loop>0 picks object's own", animationElapsed(2, 12, 3), 3);
// A loop>0 object that just appeared (objectElapsed=0) starts fresh at frame 0, regardless of how
// long the shared/page clock has been running -- this is the whole point of the per-object start.
check(
	"loop>0 object appearing fresh (objectElapsed=0) shows frame 0 no matter the shared clock",
	frameAtTime(3, [1, 1, 1], 2, false, animationElapsed(2, /* shared */ 500, /* object */ 0)),
	0,
);
// Same object 1 decisecond after it appeared: progresses from ITS OWN start, not the shared clock.
check(
	"loop>0 object 1ds after appearing shows frame 1, independent of a huge shared clock",
	frameAtTime(3, [1, 1, 1], 2, false, animationElapsed(2, /* shared */ 500, /* object */ 1)),
	1,
);

if (failures > 0) {
	console.log(`\n${failures} FAILURE(S)`);
	process.exit(1);
} else {
	console.log("\nALL ANIMATION TESTS PASSED");
}
