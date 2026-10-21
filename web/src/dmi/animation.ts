// animation - "which frame of a DMI state is showing at time t", pure and framework-free (no DOM,
// no canvas) so it can be unit tested and shared by any drawing page. Built on the loop/rewind/delay
// fields dmi.ts already parses; this module is the missing piece that turns them into an
// actual frame index over time.
//
// BYOND semantics this follows (matches the gallery preview's own animation timeline,
// gallery-client.ts, which was written by the same teammate who verified the frame-major cell
// layout against real files -- this module is the same rule, pulled out into a pure/testable form):
//  - `delay` is deciseconds (1/10 s) per frame; a multi-frame state with no delay line defaults to
//    1 decisecond per frame (dmi.ts already fills that in).
//  - `rewind` plays forward through every frame, then BACKWARD excluding both ends (the first and
//    last frame are each shown once per full cycle, not twice), then repeats. E.g. frames 0..3
//    becomes the step sequence 0,1,2,3,2,1 (cycle length 6 steps for 4 frames), not 0,1,2,3,3,2,1,0.
//  - `loop` is BYOND's own field: 0 or missing plays forever; N plays the full step sequence N
//    times, then stops on its last frame (plain) or on frame 0 (rewind); BYOND 511 video.
//  - A single-frame state (frames <= 1) always shows frame 0; loop/rewind don't apply.
//
// Not modeled (out of scope for this chunk, same as everywhere else in this project's renderer):
// BYOND's actual animation start time is when an appearance is first shown to a client, not a fixed
// moment -- this project uses page load as a stand-in for every atom showing a given state (see
// client-scene.ts). Also not modeled: `movement`-flagged state switching (that's about which STATE
// is showing, not which frame of one).

/** One step in the flat played sequence: which sheet frame to show, and for how many deciseconds. */
export interface AnimationStep {
	frame: number;
	delay: number;
}

/** Expands frames+delay+rewind into the flat sequence of steps BYOND actually plays. Exported mainly
 *  so tests can check the expansion itself independent of the time math in frameAtTime(). */
export function buildAnimationSteps(frames: number, delay: readonly number[], rewind: boolean): AnimationStep[] {
	const d = (i: number) => delay[i] ?? 1; // dmi.ts already backfills 1s, but stay defensive
	if (frames <= 1) return [{ frame: 0, delay: d(0) }];
	const steps: AnimationStep[] = [];
	for (let f = 0; f < frames; f++) steps.push({ frame: f, delay: d(f) });
	if (rewind) {
		// backward pass excludes both endpoints (0 and frames-1) -- they're each shown once per cycle
		for (let f = frames - 2; f >= 1; f--) steps.push({ frame: f, delay: d(f) });
	}
	return steps;
}

/**
 * Which sheet-frame index (0-based, matches DmiState.cells[dir][frame]) is showing at
 * `elapsedDeciseconds` since the animation started. Pure function of (frames, delay, loop, rewind,
 * t) -- no wall-clock reads, no DOM -- so every caller (client-scene.ts's redraw loop, tests) just
 * feeds it `(now - animationStartMs) / 100`.
 */
export function frameAtTime(
	frames: number,
	delay: readonly number[],
	loop: number,
	rewind: boolean,
	elapsedDeciseconds: number,
): number {
	const steps = buildAnimationSteps(frames, delay, rewind);
	if (steps.length <= 1) return steps[0]?.frame ?? 0;
	const total = steps.reduce((sum, s) => sum + s.delay, 0);
	if (!(total > 0)) return steps[0].frame; // all-zero delays: nothing to animate, show first frame
	const t = Math.max(0, elapsedDeciseconds);
	if (loop > 0) {
		const cap = total * loop;
		if (t >= cap) return rewind ? 0 : steps[steps.length - 1].frame; // played out: rewind ends on frame 0
	}
	let pos = t % total;
	for (const step of steps) {
		pos -= step.delay;
		if (pos < 0) return step.frame;
	}
	return steps[steps.length - 1].frame; // floating-point edge: pos landed exactly on `total`
}

/**
 * Picks which clock a state's animation runs on (BYOND 511 video): loop=0 (or missing)
 * states share ONE clock across every atom showing that icon_state -- two copies made 2.5s apart
 * still show the same frame as each other. loop>0 states instead start their OWN clock the moment
 * the object appears, always beginning at frame 0 -- two such copies made 2.5s apart are 2.5s out of
 * step with each other.
 *
 * This is the one place that decision is made; callers (station-client.ts's frameForState) just feed
 * it two already-computed elapsed readings and this picks the right one, rather than every call site
 * re-deriving the loop>0 check itself.
 *
 * `sharedElapsed`/`objectElapsed` are both deciseconds, typically `(nowMs - someStartMs) / 100`:
 * `sharedElapsed` from one clock start shared by the whole scene (e.g. page load), `objectElapsed`
 * from the moment this particular object appeared (for a static dump, "appeared" = page draw time,
 * same moment as the shared clock -- a live renderer needs to
 * track instead: an actual per-atom first-shown timestamp).
 */
export function animationElapsed(loop: number, sharedElapsed: number, objectElapsed: number): number {
	return loop > 0 ? objectElapsed : sharedElapsed;
}
