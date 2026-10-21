// How the worker's paced tick loop (boot-worker.ts) waits for the next tick's wall time. Three hosts, three ways.

/** "firefox": spin the whole wait; "browser" (Chrome): sleep, spin the last 16 ms; "server" (Node): the same on setImmediate. */
export type WaitMode = "firefox" | "browser" | "server";

// Lets queued messages (a "stop") in without the 4 ms clamp of nested setTimeout.
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
// Firefox runs a full non-incremental "idle" GC of the worker 5 s after its event queue first goes empty, and activity
// doesn't cancel that timer (dom/workers/WorkerPrivate.cpp SetGCTimerMode: "If the idle timer is running, don't cancel it").
// With a ~1.3 GB heap each one froze the game ~1.4 s, every ~6.5 s. So in Firefox the paced loop waits for the next tick by
// posting itself messages on one MessageChannel (the queue is never empty, so the idle GC is never scheduled) instead of
// setTimeout. Costs one busy core while waiting; SpiderMonkey's own allocation-triggered GC still runs.
const spinPort = new MessageChannel();
let spinWake: (() => void) | null = null;
// the loop used to turn a Promise + closure + MessagePort message ~195,000 times/s (the main allocator in Firefox).
// Now the handler busy-waits up to 2 ms (never past the target) before resuming, ~430 turns/s. Still a spin, never a sleep.
let spinTarget = 0;
spinPort.port1.onmessage = () => { const w = spinWake; spinWake = null; const end = Math.min(Date.now() + 2, spinTarget); while (Date.now() < end); w?.(); };
const spinUntil = async (wallMs: number): Promise<void> => { spinTarget = wallMs; while (Date.now() < wallMs) await new Promise<void>((r) => { spinWake = r; spinPort.port2.postMessage(0); }); };
// In Node the spin's port starves the worker's own message port: a player's input arriving while it spun ran only after
// that tick (missed it, +50 ms; ~40% of steps). There the spin turns on setImmediate, which lets messages in between turns.
// The spin keeps the core warm: with less of it ticks got slower though Node's setTimeout is ~1 ms accurate (2026-10-16
// probe, VM ms/tick: 16 ms spin 4.8, 8 ms 5.9, 3 ms 6.3, none 6.7).
const setImm = (globalThis as { setImmediate?: (f: () => void) => void }).setImmediate;
const spinNode = async (wallMs: number): Promise<void> => { while (Date.now() < wallMs) await new Promise<void>((r) => setImm!(r)); };
const SPIN_MS = 16; // and Chrome's setTimeout can be ~15 ms coarse (Windows battery)

/** Waits until wall time `target` (Date.now() ms). */
export function waitUntil(target: number, mode: WaitMode): Promise<void> {
	if (mode === "firefox") return spinUntil(target);
	const spin = mode === "server" ? spinNode : spinUntil, wait = target - Date.now() - SPIN_MS;
	return wait > 0 ? sleep(wait).then(() => spin(target)) : spin(target);
}
