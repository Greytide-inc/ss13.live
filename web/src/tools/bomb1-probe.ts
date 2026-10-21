// Node-side timeline probe for the explosion measurements. Off unless BOMB_TL is set; never touches the game.
//   BOMB_TL=N        every N ticks (counted from the script start) log ms/tick (avg p50 p95 p99 max, ticks over 50 ms) plus the MC's own
//                    per-subsystem cost, SSair's lists, SSgarbage's counters, timers, atom count
//   BOMB_CSV=FILE    also write "scriptTick,ms" per tick
//   BOMB_PROF=T:SPAN:NAME,...   a CPU profile (50 us) of SPAN ticks starting at script tick T, written to build/bomb1/NAME.cpuprofile
import { Session } from "node:inspector";
import { writeFileSync, appendFileSync } from "node:fs";
import { DMList, DMObject, live } from "../vm/objects.js";
import { stringify } from "../vm/value.js";
import type { VM } from "../vm/interpreter.js";

export class BombProbe {
	private win: number[] = [];
	private winStart = 0;
	private ses: Session | null = null;
	private t0 = 0;
	private profs: { t: number; span: number; name: string }[] = [];
	private prof: { stop: number; name: string } | null = null;
	private every = Number(process.env.BOMB_TL ?? 600);
	private csv = process.env.BOMB_CSV ?? "";
	constructor(private vm: VM, private log: (s: string) => void) {
		for (const p of (process.env.BOMB_PROF ?? "").split(",").filter(Boolean)) { const [t, span, name] = p.split(":"); this.profs.push({ t: Number(t), span: Number(span), name }); }
		if (this.csv) writeFileSync(this.csv, "tick,ms\n");
	}
	before(st: number): void {
		this.t0 = performance.now();
		const p = this.profs.find((q) => q.t === st);
		if (p) { this.ses = new Session(); this.ses.connect(); this.ses.post("Profiler.enable"); this.ses.post("Profiler.setSamplingInterval", { interval: 50 }); this.ses.post("Profiler.start"); this.prof = { stop: st + p.span, name: p.name }; }
	}
	after(st: number): void { // st = script tick of the tick that just ran
		const ms = performance.now() - this.t0;
		this.win.push(ms);
		if (this.csv) appendFileSync(this.csv, `${st},${ms.toFixed(2)}\n`);
		if (this.prof && st + 1 >= this.prof.stop && this.ses) { const ses = this.ses, name = this.prof.name; this.ses = null; this.prof = null; ses.post("Profiler.stop", (_e, r) => { writeFileSync(`build/bomb1/${name}.cpuprofile`, JSON.stringify(r.profile)); }); }
		if (st + 1 - this.winStart >= this.every) { this.report(st + 1); this.winStart = st + 1; this.win = []; }
	}
	private report(end: number): void {
		const b = [...this.win].sort((x, y) => x - y), g = (q: number) => b[Math.min(b.length - 1, Math.floor(b.length * q))].toFixed(1);
		const avg = b.reduce((s, x) => s + x, 0) / b.length;
		this.log(`[bomb1] ticks ${this.winStart}-${end} (world.time ${this.vm.sched.time}): ${avg.toFixed(2)} ms/tick avg, p50 ${g(0.5)} p95 ${g(0.95)} p99 ${g(0.99)} max ${b[b.length - 1].toFixed(0)}; ${b.filter((x) => x > 50).length} ticks over 50 ms; ${this.stats()}`);
	}
	private stats(): string {
		const vm = this.vm;
		const num = (o: DMObject, k: string) => { const v = Number(live(o.getVar(k))); return Number.isFinite(v) ? v : 0; };
		const glob = (n: string) => { const gi = vm.tree.globalNames.indexOf(n); const o = gi >= 0 ? live(vm.globals[gi]) : null; return o instanceof DMObject ? o : null; };
		const len = (o: DMObject | null, k: string) => { const l = o ? live(o.getVar(k)) : null; return l instanceof DMList ? l.len : -1; };
		const out: string[] = [];
		try {
			const mc = glob("Master"), list = mc ? live(mc.getVar("subsystems")) : null;
			if (list instanceof DMList) {
				const rows: { n: string; c: number }[] = [];
				for (const x of list.items) { const o = live(x); if (o instanceof DMObject) rows.push({ n: String(stringify(o.getVar("name"))).replace(/^"|"$/g, ""), c: num(o, "cost") }); }
				rows.sort((a, b) => b.c - a.c);
				out.push(`MC cost ${rows.slice(0, 7).map((r) => `${r.n} ${r.c.toFixed(1)}`).join(", ")}`);
			}
			const air = glob("SSair");
			if (air)
				out.push(`SSair active ${len(air, "active_turfs")} groups ${len(air, "excited_groups")} hotspots ${len(air, "hotspots")} pipenets ${len(air, "networks")} highpressure ${len(air, "high_pressure_delta")}; ${["turfs", "groups", "highpressure", "hotspots", "superconductivity", "pipenets", "atmos_machinery"].map((k) => `${k} ${num(air, "cost_" + k).toFixed(1)}`).join(" ")}`);
			const gc = glob("SSgarbage");
			if (gc) out.push(`SSgarbage gcs ${num(gc, "totalgcs")} dels ${num(gc, "totaldels")} queue ${len(gc, "queue")}`);
			const tm = glob("SStimer");
			if (tm) out.push(`SStimer timers ${len(tm, "timer_id_dict")} hashes ${len(tm, "hashes")}`);
		} catch (e) { out.push(`stats failed: ${(e as Error).message}`); }
		return out.join("; ");
	}
}
