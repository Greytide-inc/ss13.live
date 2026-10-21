// opt-in measurement for the stutter plan (boot.ts --stress-log FILE). Off by default: `stress.on` is false and
// the two call sites (world.ts viewBox, worker/client-view.ts) cost one boolean test. Nothing here changes game behaviour.

export const stress = {
	on: false,
	/** computeLos calls this tick: key (native + DM caller) -> [calls, ms] */
	los: new Map<string, [number, number]>(),
	losCalls: 0,
	losMs: 0,
	/** world.tick_usage reads this tick, and how many read >= 80 (tg's TICK_LIMIT_RUNNING) / >= 100 */
	usageReads: 0,
	usageHi: 0,
	usageOver: 0,
	usageMax: 0,
	/** threads resumed by runTick this tick (vm.run calls) */
	runs: 0,
	gcMs: 0,
	gcCount: 0,
};

let pending: { duration: number; kind: number; start: number }[] = [];
/** GC entries that started before this (performance.now() ms) are dropped: they belong to the boot, delivered late. */
export const gcFrom = { t: 0 };
let obs: unknown = null;
export function stressStart(): void {
	stress.on = true;
	Error.stackTraceLimit = 40;
	try { // Node only (a browser worker has no 'gc' entries)
		const PO = (globalThis as unknown as { PerformanceObserver: typeof PerformanceObserver }).PerformanceObserver;
		// gc entries reach the callback only when the event loop turns: boot.ts awaits a setImmediate after each logged tick
		obs = new PO((list) => { for (const e of list.getEntries()) pending.push({ start: e.startTime, duration: e.duration, kind: (e as unknown as { detail?: { kind?: number } }).detail?.kind ?? -1 }); });
		(obs as InstanceType<typeof PerformanceObserver>).observe({ entryTypes: ["gc"] });
	} catch { /* no GC capture */ }
}

const KIND: Record<number, string> = { 1: "scavenge", 2: "minor-ms", 4: "mark-sweep-compact", 8: "incremental", 16: "weak-cb" };
/** GC pauses delivered since the last call (V8 kinds: 1 scavenge, 4 full mark-compact, 8 incremental marking step, 16 weak callbacks). */
export function stressTakeGc(): { ms: number; n: number; kinds: string } {
	let ms = 0;
	const k: Record<string, number> = {};
	for (const e of pending) { if (e.start < gcFrom.t) continue; ms += e.duration; const nm = KIND[e.kind] ?? String(e.kind); k[nm] = +((k[nm] ?? 0) + e.duration).toFixed(2); }
	const n = pending.filter((e) => e.start >= gcFrom.t).length;
	pending = [];
	return { ms, n, kinds: JSON.stringify(k) };
}

/** Stack-keyed computeLos calls are sampled: one stack per this many calls (TG_STRESS_STACK_EVERY=1 for every call, as before stress2c). */
const STACK_EVERY = Math.max(1, Number((globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env?.TG_STRESS_STACK_EVERY ?? 16));
let held = 0, heldMs = 0;
export function stressNoteLos(ms: number, origin: string): void {
	// the origin is the stack: keep the native/VM frames that name the entry point and the first two translated DM frames
	let key = origin;
	let n = 1;
	if (origin === "stack") {
		// a 40-frame stack per call was ~1.5 s of a 33 s narsie-sing run (and was billed to whichever proc called view()).
		// Take it for one call in STACK_EVERY and credit that caller with all the calls and ms since the last one taken.
		heldMs += ms;
		if (++held < STACK_EVERY) return;
		n = held; ms = heldMs; held = 0; heldMs = 0;
		const lines = (new Error().stack ?? "").split("\n").slice(3);
		const native = lines.find((l) => /natives-world|clients\.js|world\.js.*rangeList|client-view/.test(l) && !/viewBox|losBox/.test(l));
		const dm = lines.filter((l) => l.includes("translated-tg")).slice(0, 2).map((l) => (/translated-tg\.js:(\d+)/.exec(l) ?? [])[1]);
		key = `${(native ?? "?").trim().replace(/^at /, "").replace(/\(?file:\/\/[^)]*\//, "(").slice(0, 70)} | dm@${dm.join(",")}`;
	}
	let e = stress.los.get(key);
	if (!e) stress.los.set(key, (e = [0, 0]));
	e[0] += n; e[1] += ms;
	stress.losCalls += n; stress.losMs += ms;
}

/** The page worker's version (?stress=1): computeLos calls since the last call, by origin, as one log line; clears the counters. */
export function stressLosLine(): string {
	const rows = [...stress.los].sort((a, b) => b[1][1] - a[1][1]).slice(0, 6).map(([k, v]) => `${v[0]} calls ${v[1].toFixed(0)} ms ${k}`);
	const line = `[stress] computeLos ${stress.losCalls} calls ${stress.losMs.toFixed(0)} ms; ${rows.join(" || ")}`;
	stress.los.clear(); stress.losCalls = 0; stress.losMs = 0;
	return line;
}
