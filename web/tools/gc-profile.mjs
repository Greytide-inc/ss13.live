// gc-profile - Sums up the game worker's GCs in a Firefox profile (firefox-perf.mjs with MOZ_PROFILER_SHUTDOWN, see its gc notes).
// Usage (from web/): node --max-old-space-size=6000 tools/gc-profile.mjs PROFILE.json [FROM_S TO_S]  (default 60 330: in the round)
// Prints each major GC (a solo freeze: seconds, pause, which heap set it off) and, in the window, the bytes promoted by minor GCs
// and the cells born old (pretenured: never promoted, so promotion alone misses them), per minute and by reason.
// Firefox GCs the worker once its object heap or its malloc heap outgrows the last GC's survivors (plans/less-garbage.md).
// Compare runs of the same length; Firefox resizes its nursery, so check a change in Firefox, not only in Node.
import { readFileSync } from "node:fs";
const [file, a = "60", b = "330"] = process.argv.slice(2);
const p = JSON.parse(readFileSync(file, "utf8")), from = Number(a) * 1000, to = Number(b) * 1000;
let best = null;
for (const proc of [p, ...(p.processes ?? [])]) for (const t of proc.threads ?? []) {
	if (!/Worker/.test(t.name)) continue;
	const m = t.markers, S = m.schema, st = t.stringTable;
	let tenured = 0;
	for (const r of m.data) if (st[r[S.name]] === "GCMinor") tenured += r[S.data].nursery?.bytes_tenured ?? 0;
	if (!best || tenured > best.tenured) best = { t, tenured }; // the game's worker: the most promoted (a quiet run may have no major GC in it)
}
if (!best) { console.log("no worker thread in the profile"); process.exit(1); }
const { t } = best, m = t.markers, S = m.schema, st = t.stringTable, by = new Map(), mb = (n) => (n / 1e6).toFixed(0);
let total = 0, born = 0, firstMinor = Infinity;
for (const r of m.data) {
	const name = st[r[S.name]], d = r[S.data], s = r[S.startTime] ?? r[S.endTime];
	if (name === "GCSlice" && d.timings.slice === 0 && d.timings.trigger_amount) by.trigger ??= new Map(), by.trigger.set(d.timings.major_gc_number, d.timings.trigger_amount);
	if (name === "GCMajor") {
		const g = d.timings, amt = by.trigger?.get(g.major_gc_number);
		if (g.reason === "WORKER_SHUTDOWN") continue; // the worker closing, not a freeze
		// which heap set it off: the one whose size the trigger amount matches (object heap = allocated_bytes, malloc = pre_malloc_heap_size)
		const heap = amt === undefined ? (g.reason === "DOM_WORKER" ? "worker's idle timer (DOM_WORKER)" : g.reason) : Math.abs(amt - g.allocated_bytes) < Math.abs(amt - g.pre_malloc_heap_size) ? "object heap" : "malloc heap";
		console.log(`major GC at ${(s / 1000).toFixed(1)} s: ${g.max_pause.toFixed(0)} ms, set off by the ${heap}` +
			` (objects ${mb(g.allocated_bytes)} -> ${mb(g.post_heap_size)} MB, malloc ${mb(g.pre_malloc_heap_size)} -> ${mb(g.post_malloc_heap_size)} MB)`);
	}
	if (name !== "GCMinor" || d.nursery?.bytes_tenured === undefined) continue;
	firstMinor = Math.min(firstMinor, s);
	if (!(s > from && s < to)) continue;
	const e = by.get(d.nursery.reason) ?? { n: 0, b: 0, used: 0, born: 0 };
	e.n++; e.b += d.nursery.bytes_tenured; e.used += d.nursery.bytes_used ?? 0; e.born += d.nursery.cells_allocated_tenured ?? 0;
	total += d.nursery.bytes_tenured; born += d.nursery.cells_allocated_tenured ?? 0;
	by.set(d.nursery.reason, e);
}
if (firstMinor > from) console.log(`WARNING: the worker's GC markers start at ${(firstMinor / 1000).toFixed(0)} s, after FROM (${a} s): the profile's ring dropped the start; move FROM up`);
const min = (to - from) / 60000;
console.log(`${a}-${b} s: promoted ${(total / 1e6).toFixed(1)} MB = ${(total / 1e6 / min).toFixed(1)} MB a minute; born old ${(born / 1e3).toFixed(0)}k cells = ${(born / 1e3 / min).toFixed(0)}k a minute`);
for (const [k, e] of by) console.log(`  ${k.padEnd(26)} ${String(e.n).padStart(5)}x, ${(e.b / 1e6).toFixed(1).padStart(5)} MB promoted, ${(e.born / 1e3).toFixed(0).padStart(5)}k born old (nursery used ${(e.used / e.n / 1e6).toFixed(1)} MB)`);
