// run-stats - the tick statistics of the boot worker (the 10 s live lines, the totals) and the end-of-run summary, moved out of run().
// makeRunStats(ctx) returns the objects the tick loop writes every tick (live_, lateWakes) plus liveLine() and summary().

import type { VM, RuntimeErrorRecord } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { stringify } from "../vm/value.js";
import { stress, stressLosLine } from "../vm/stress-log.js";

/** What run() shares with the stats. */
export interface RunStatsCtx {
	vm: VM;
	log: (line: string) => void;
	heapMB: () => string | number;
	secs: () => string;
	t0: number;
	readonly ticks: number;
	readonly roundStart: { ms: number; ticks: number } | null;
	readonly fatal: unknown;
}

export function makeRunStats(ctx: RunStatsCtx) {
	const { vm, log, heapMB, secs, t0 } = ctx;
	const live_ = { since: 0, ticks: 0, vmMs: 0, snaps: 0, snapMs: 0, rebased: 0, buildMs: 0, postMs: 0, bytes: 0, maxTick: 0, slow: 0, lateMax: 0, late50: 0, inN: 0, inWait: 0, inMax: 0, ms: [] as number[], maxAt: 0 };
	const total = { ticks: 0, vmMs: 0, snaps: 0, snapMs: 0, rebased: 0, buildMs: 0, postMs: 0, bytes: 0, maxTick: 0, slow: 0, lateMax: 0, late50: 0, inN: 0, inWait: 0, inMax: 0 };
	const lateWakes: string[] = []; // the last 10 wake-ups over 200 ms late, for the F9 report
	const latText = (l: typeof total) => `; slowest tick ${l.maxTick.toFixed(0)} ms, ${l.slow} over tick_lag; woke late >50 ms ${l.late50}x (max ${l.lateMax.toFixed(0)}); input waited ${l.inN ? (l.inWait / l.inN).toFixed(0) : "-"} ms avg, ${l.inMax.toFixed(0)} max (${l.inN})`;
	const pct3 = (a: number[]) => { if (!a.length) return "-"; const b = [...a].sort((x, y) => x - y), g = (q: number) => b[Math.min(b.length - 1, Math.floor(b.length * q))].toFixed(1); return `${g(0.5)}/${g(0.95)}/${g(0.99)}`; };
	// once per perf line, the MC's own per-subsystem averages (cost ms, tick_overrun %), the 6 biggest, and SSair's cost_* parts. Read-only.
	const mcCosts = () => {
		try {
			const num = (o: DMObject, k: string) => { const v = Number(live(o.getVar(k))); return Number.isFinite(v) ? v : 0; };
			const mc = live(vm.globals[vm.tree.globalNames.indexOf("Master")]);
			const list = mc instanceof DMObject ? live(mc.getVar("subsystems")) : null;
			if (!(list instanceof DMList)) return;
			const rows: { n: string; c: number; o: number; o2: DMObject }[] = [];
			for (const x of list.items) { const o = live(x); if (o instanceof DMObject) rows.push({ n: String(stringify(o.getVar("name"))).replace(/^"|"$/g, ""), c: num(o, "cost"), o: num(o, "tick_overrun"), o2: o }); }
			rows.sort((a, b) => b.c - a.c);
			const air = rows.find((r) => r.n === "Atmospherics");
			const parts = air ? ["turfs", "groups", "highpressure", "hotspots", "superconductivity", "pipenets", "atmos_machinery"].map((k) => `${k} ${num(air.o2, "cost_" + k).toFixed(1)}`).join(", ") : "";
			log(`[vm-boot] MC cost (avg ms, overrun %): ${rows.slice(0, 6).map((r) => `${r.n} ${r.c.toFixed(1)} (${r.o.toFixed(0)}%)`).join(", ")}${parts ? `; SSair ${parts}` : ""}`);
		} catch (e) { log(`[vm-boot] MC cost read failed: ${(e as Error).message}`); }
	};
	const liveLine = () => {
		if (live_.since && live_.ticks) {
			if (stress.on) log(stressLosLine()); // ?stress=1
			log(`[vm-boot] live: ${live_.ticks} ticks in ${((Date.now() - live_.since) / 1000).toFixed(1)} s, VM ${(live_.vmMs / live_.ticks).toFixed(2)} ms/tick (tick_lag ${vm.sched.tickLag * 100} ms), ${live_.snaps} view updates at ${live_.snaps ? (live_.snapMs / live_.snaps).toFixed(1) : "-"} ms each (build ${(live_.buildMs / (live_.snaps || 1)).toFixed(2)}, post ${(live_.postMs / (live_.snaps || 1)).toFixed(2)}, ${(live_.bytes / (live_.snaps || 1) / 1024).toFixed(1)} KB JSON), fell behind >200 ms ${live_.rebased}x${latText(live_)}; tick ms p50/p95/p99 ${pct3(live_.ms)}; slowest tick at world.time ${live_.maxAt}`);
			mcCosts();
			for (const k of ["ticks", "vmMs", "snaps", "snapMs", "rebased", "buildMs", "postMs", "bytes", "slow", "late50", "inN", "inWait"] as const) total[k] += live_[k];
			for (const k of ["maxTick", "lateMax", "inMax"] as const) total[k] = Math.max(total[k], live_[k]);
		}
		Object.assign(live_, { since: Date.now(), ticks: 0, vmMs: 0, snaps: 0, snapMs: 0, rebased: 0, buildMs: 0, postMs: 0, bytes: 0, maxTick: 0, slow: 0, lateMax: 0, late50: 0, inN: 0, inWait: 0, inMax: 0, ms: [], maxAt: 0 });
	};

	/** The end summary lines (run() logs them and sends them with the done / reboot message). */
	const summary = (): string[] => {
		const { ticks, roundStart, fatal } = ctx;
		const summary: string[] = [];
		summary.push(`[vm-boot] stopped after ${ticks} ticks, world.time ${vm.sched.time}, ${secs()} s wall, ${vm.runtimeErrors.length - vm.notImplemented.length} runtime errors, ${vm.notImplemented.length} not-implemented hits${fatal ? ", FATAL" : ""}`);
		if (roundStart !== null) {
			const rs = roundStart as { ms: number; ticks: number; };
			const n = ticks - rs.ticks, sec = (Date.now() - rs.ms) / 1000;
			summary.push(`[vm-boot] after round start (at ${((rs.ms - t0) / 1000).toFixed(1)} s, tick ${rs.ticks}): ${n} ticks in ${sec.toFixed(1)} s = ${n > 0 ? ((sec * 1000) / n).toFixed(2) : "?"} ms/tick`);
		}
		if (total.ticks)
			summary.push(`[vm-boot] live (paced) after round start: ${total.ticks} ticks, VM ${(total.vmMs / total.ticks).toFixed(2)} ms/tick against tick_lag ${vm.sched.tickLag * 100} ms; ${total.snaps} view updates at ${total.snaps ? (total.snapMs / total.snaps).toFixed(1) : "-"} ms each (build ${(total.buildMs / (total.snaps || 1)).toFixed(2)}, post ${(total.postMs / (total.snaps || 1)).toFixed(2)}, ${(total.bytes / (total.snaps || 1) / 1024).toFixed(1)} KB JSON); fell behind >200 ms ${total.rebased}x${latText(total)}`);
		const gi = vm.tree.globalNames.indexOf("SSgarbage");
		const ss = gi >= 0 ? vm.globals[gi] : null;
		if (ss instanceof DMObject) {
			const len = (k: string) => { const l = ss.getVar(k); return l instanceof DMList ? l.len : "?"; };
			summary.push(`[vm-boot] SSgarbage: totalgcs ${ss.getVar("totalgcs")}, totaldels ${ss.getVar("totaldels")}, queue ${len("queue")}, tobequeued ${len("tobequeued")}`);
			const didnt = ss.getVar("didntgc");
			if (didnt instanceof DMList && didnt.len) {
				const rows = didnt.items.map((k) => [String(k), Number(didnt.get(k))] as const).sort((a, b) => b[1] - a[1]);
				summary.push(`[vm-boot] SSgarbage failed to GC (${rows.length} types): ${rows.slice(0, 15).map(([k, c]) => `${k} x${c}`).join(", ")}`);
			}
		}
		const g = vm.gcStats;
		summary.push(`[vm-boot] VM collector: ${g.freed} objects freed at ${g.safePoints} safe points, ${(g.ms / 1000).toFixed(1)} s; ${vm.map.atoms.size} atoms`);
		summary.push(`[vm-boot] heap at end ${heapMB()} MB`);
		const firstSeen = new Map<string, { count: number; rec: RuntimeErrorRecord }>();
		for (const r of vm.notImplemented) {
			const e = firstSeen.get(r.message);
			if (e) e.count++;
			else firstSeen.set(r.message, { count: 1, rec: r });
		}
		summary.push(`[vm-boot] missing features, in the order first hit:`);
		let i = 0;
		for (const [k, { count, rec }] of firstSeen) summary.push(`  ${++i}. ${k}  x${count}  (first in ${rec.proc}, ${rec.source})`);
		return summary;
	};

	return { live_, total, lateWakes, liveLine, summary };
}
