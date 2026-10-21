// Threads and the tick clock: what `sleep`, `spawn` and `world.time` run on.
//
// A Thread is a stack of DM frames. It runs until it finishes or sleeps. A sleeping thread keeps its
// frames and waits in a queue ordered by (due tick, order of scheduling), and the host wakes it by
// calling `vm.runTick()`. BYOND 511 behaviour measured in web/tests/dm/sched.dm:
//
// - Delays count in whole ticks: a positive delay is floor(delay / tick_lag) ticks, but at least 1
//   (sleep(0.3) and sleep(1.9) both take 1 tick at tick_lag 1; sleep(0.7) takes 1 tick at tick_lag 0.5).
// - A delay of 0 (sleep(0), sleep(), spawn(0), spawn()) runs later in the *same* tick, after
//   everything already queued for this tick (FIFO), so world.time doesn't change.
// - Threads due in the same tick run in the order they were scheduled, whichever tick that happened in.
// - sleep(-1) doesn't yield (while the tick isn't overrun). spawn(<0) runs the spawned block at once,
//   and the caller carries on when it finishes or sleeps.

import type { Frame } from "./interpreter.js";
import { fround, type Value } from "./value.js";
import { stress } from "./stress-log.js";
import { diffHook, wallNow } from "./clockhook.js";

export class Thread {
	readonly frames: Frame[];
	/** The bottom frame's return value, once the thread has finished. */
	result: Value = null;
	done = false;
	/** started by translated code (translate/runtime.ts) that keeps every value it holds in GC roots (VM.extraFrames), so safe points may run inside it. */
	rootsKnown = false;
	/** `frames` may be given (an exact-size array: `[]` takes 17 slots at its first push). */
	constructor(frames: Frame[] = []) {
		this.frames = frames;
	}
}

/**
 * `frame.locals[0]` of a translated frame that waits to start a named tail (translate/runtime.ts rt.tail, rt.sleepThen,
 * rt.spawnTail): locals = [TAIL_MARK, name, ...values]. Such a frame is plain data, so a world snapshot can hold it
 * (vm/snapshot.ts drops its generator on save and starts the tail again after save and load).
 */
export const TAIL_MARK = "\u0000tail";

interface Sleeper {
	thread: Thread;
	due: number;
	seq: number;
}

const now: () => number = typeof performance !== "undefined" ? () => performance.now() : () => Date.now();

/** The world clock plus the queue of sleeping threads. Owned by the VM (`vm.sched`). */
export class Scheduler {
	/** Ticks elapsed since the world started. */
	tick = 0;
	/** `world.time`, in deciseconds: tick_lag is added once per tick (so it follows tick_lag changes). */
	time = 0;
	/** `world.tick_lag`, deciseconds per tick. tg sets it through `world.fps = config.fps`. */
	tickLag = 1;
	/** Real time (ms) when the current tick started: `world.tick_usage` is measured from here. */
	tickStart = now();
	/** How much of the tick the last full tick used (percent), for `world.cpu`. */
	lastTickUsage = 0;
	/** true while a player's verb/topic runs up to its first sleep. BYOND handles commands after the sleeping procs (the MC) have used their share of the tick, so tg's CHECK_TICK
	 *  sleeps early there; our ticks are cheap and would never sleep, so the tick reads as already COMMAND_TICK_USAGE % used. tg's character preview needs that sleep: it relies on
	 *  SSoverlays compiling the mannequin's overlays during one (measured in our VM: without it the preview is blank). */
	inCommand = false;
	private readonly queue: Sleeper[] = [];
	/** Threads waiting for an input()/alert() answer from the page: not in the queue, so they never wake by themselves. */
	readonly parked = new Set<Thread>();
	private seq = 0;

	/** Ticks a delay (in deciseconds) waits for. 0 means later in this tick. Negative delays are the caller's business. */
	ticksFor(delay: number): number {
		if (!(delay > 0)) return 0;
		return Math.max(1, Math.floor(delay / this.tickLag + 1e-5));
	}

	/** Queues `thread` to resume after `delay` deciseconds. */
	schedule(thread: Thread, delay: number): void {
		const s: Sleeper = { thread, due: this.tick + this.ticksFor(delay), seq: this.seq++ };
		// Insert after every sleeper due at or before s.due (seq only grows, so FIFO within a tick).
		const q = this.queue;
		let lo = 0;
		let hi = q.length;
		while (lo < hi) {
			const mid = (lo + hi) >> 1;
			if (q[mid].due <= s.due) lo = mid + 1;
			else hi = mid;
		}
		q.splice(lo, 0, s);
	}

	/** The next thread due in the current tick, removed from the queue, or null. */
	takeDue(): Thread | null {
		const q = this.queue;
		if (q.length === 0 || q[0].due > this.tick) return null;
		return q.shift()!.thread;
	}

	/** The tick the earliest sleeper is due in, or null if nothing sleeps. */
	nextDue(): number | null {
		return this.queue.length ? this.queue[0].due : null;
	}

	/** Every sleeping thread (for the collector's scan of proc frames). */
	*sleepers(): Iterable<Thread> {
		for (const s of this.queue) yield s.thread;
		yield* this.parked;
	}

	get sleeping(): number {
		return this.queue.length;
	}

	/** Moves the clock to the next tick, which starts now (for tick_usage). */
	advance(): void {
		this.lastTickUsage = this.tickUsage();
		if (diffHook.vcostPerPct > 0) diffHook.calls = 0; // diff mode virtual cost: a new tick starts counting from zero
		this.tick++;
		this.time = fround(this.time + this.tickLag);
		this.tickStart = now();
	}

	/** Skips `n` idle ticks without running anything (headless fast mode). */
	skipTicks(n: number): void {
		for (let i = 0; i < n; i++) {
			this.tick++;
			this.time = fround(this.time + this.tickLag);
		}
	}

	/** `world.tick_usage`: percent of the tick's real-time budget (tick_lag) used so far. */
	tickUsage(): number {
		let fake = diffHook.fakeUsage;
		if (fake !== null && diffHook.vcostPerPct > 0) fake = diffHook.calls / diffHook.vcostPerPct;
		if (fake !== null) return this.inCommand && fake < COMMAND_TICK_USAGE ? COMMAND_TICK_USAGE : fake;
		const used = fround(((now() - this.tickStart) / (this.tickLag * 100)) * 100);
		if (stress.on) { stress.usageReads++; if (used >= 80) stress.usageHi++; if (used >= 100) stress.usageOver++; if (used > stress.usageMax) stress.usageMax = used; }
		return this.inCommand && used < COMMAND_TICK_USAGE ? COMMAND_TICK_USAGE : used;
	}

	get fps(): number {
		return fround(10 / this.tickLag);
	}
}

/** Percent of the tick a player's command sees as used already (above tg's TICK_LIMIT_RUNNING 80 % minus the MC's reserve, so CHECK_TICK yields). Not measured in BYOND. */
const COMMAND_TICK_USAGE = 70;

// Measured in 511.1385 (UK host, BST): both clocks are UTC, not local time.

/** `world.timeofday`: deciseconds since midnight UTC. */
export function timeOfDay(): number {
	return Math.floor((wallNow() % 86400000) / 100);
}

/** `world.realtime`: deciseconds since 2000-01-01 00:00 UTC, as a 32-bit float (so it moves in ~100 s steps). */
export function realTime(): number {
	return fround(Math.floor((wallNow() - Date.UTC(2000, 0, 1)) / 100));
}
