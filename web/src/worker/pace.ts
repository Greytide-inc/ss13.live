// Real-time pacing of the worker's tick loop (boot-worker.ts): when each tick should start on the wall clock.

/** Tick `tick` was due at wall time `wall` (ms). */
export interface Pace {
	wall: number;
	tick: number;
}

/**
 * past this far behind (ms) the lost time is dropped, not caught up. After a stall (a Firefox GC of the worker,
 * a long tick) the world pauses with it and goes on at normal speed, instead of running the missed ticks back to back
 * (the world jumping). Up to this much lateness is still caught up, so small jitter doesn't slow the world down.
 */
export const CATCHUP_MAX_MS = 200;

/** The wall time (ms) tick `due` should start at (at or before now: at once). Moves `p` on to `due`. */
export function paceStep(p: Pace, due: number, lagMs: number): number {
	p.wall += (due - p.tick) * lagMs;
	p.tick = due;
	return p.wall;
}

/** Called as the tick starts (after the wait): more than CATCHUP_MAX_MS late drops the lost time (true). */
export function paceStart(p: Pace, now: number): boolean {
	if (now - p.wall <= CATCHUP_MAX_MS) return false;
	p.wall = now;
	return true;
}
