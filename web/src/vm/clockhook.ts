// the wall clock the VM reads for world.timeofday, world.realtime and time2text's "today".
// Normally the host clock; diff mode (src/tools/diff/) swaps in a fixed start + world.time so two
// runs can't differ by when they ran.
// vcostPerPct > 0 turns on the virtual cost: world.tick_usage = DM proc calls made this tick / vcostPerPct (diary.ts counts them
// in `calls` and zeroes it each tick); world.cpu is the previous tick's value by the scheduler's usual rule.
export const diffHook: { fakeUsage: number | null; gcTickOnly: boolean; atTick: boolean; vcostPerPct: number; calls: number } = { fakeUsage: null, gcTickOnly: false, atTick: false, vcostPerPct: 0, calls: 0 };
export const clockHook: { nowMs: (() => number) | null } = { nowMs: null };

export function wallNow(): number {
	const f = clockHook.nowMs;
	return f === null ? Date.now() : f();
}
