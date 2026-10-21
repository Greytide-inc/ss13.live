// diff mode and the diary.
//
// enableDiffMode(vm) removes the noise sources that make two runs differ without a bug: a fake clock
// (tick_usage/cpu constant, timeofday/realtime/time2text = fixed start + world.time) and the collector
// running only at tick boundaries. Diary writes one line per tick plus a world fingerprint every 50 ticks;
// the full log/runtime text goes to a side file. Nothing here is loaded unless boot.ts is given --diff.
import { closeSync, openSync, writeSync } from "node:fs";
import { createHash } from "node:crypto";
import type { Frame, VM } from "../../vm/interpreter.js";
import type { DMProc } from "../../vm/objtree.js";
import { clockHook, diffHook } from "../../vm/clockhook.js";
import { DMObject, live } from "../../vm/objects.js";
import { DMAtom, Kind } from "../../vm/world.js";
import { DMList } from "../../vm/objects.js";
import type { Value } from "../../vm/value.js";

/** 2017-06-15 12:00:00 UTC: a fixed "today"; noon, so +-12 h of world time stays inside one day. */
export const DIFF_START_MS = Date.UTC(2017, 5, 15, 12, 0, 0);
export const FINGERPRINT_EVERY = Number(process.env.DIFF_FP_EVERY ?? 50); // ~1 s each on the station map; raise it for long soaks (both runs must use the same value)

/** Default for --diff-vcost: calls per 1 % of tick_usage (picked from measured calls per tick). */
export const VCOST_DEFAULT = 25;

/** `vcostPerPct` > 0 = virtual cost: tick_usage is the DM proc calls made this tick divided by it (so N calls = 1 %). */
export function enableDiffMode(vm: VM, vcostPerPct = 0): void {
	diffHook.fakeUsage = 0;
	diffHook.vcostPerPct = vcostPerPct;
	diffHook.calls = 0;
	diffHook.gcTickOnly = true;
	// world.time is deciseconds (a float32): the fake host clock is the start plus that.
	clockHook.nowMs = () => DIFF_START_MS + Math.round(vm.sched.time * 100);
}

const sha = (s: string): string => createHash("sha1").update(s).digest("hex").slice(0, 12);

/** a value for the trace hash, without side effects (no \\ref numbers: those are handed out on first use). */
function desc(v: Value): string {
	if (v === null || v === undefined) return "null";
	if (typeof v === "number" || typeof v === "string") return typeof v === "string" ? JSON.stringify(v.length > 200 ? v.slice(0, 200) : v) : String(v);
	if (v instanceof DMList) return `list(${v.len})`;
	if (v instanceof DMObject) {
		if (v.deleted) return `<deleted ${v.type.path}>`;
		let where = "";
		if (v instanceof DMAtom) { let a: DMAtom | null = v, d = 0; while (a !== null && a.kind !== Kind.Turf && d++ < 8) a = a.loc; if (a !== null && a.kind === Kind.Turf) where = `@${a.x},${a.y},${a.z}`; }
		const n = v.getVar("name");
		return `<${v.type.path}${typeof n === "string" ? " " + n : ""}${where}>`;
	}
	return typeof v === "object" ? (v as object).constructor?.name ?? "?" : String(v);
}

export class Diary {
	private readonly fd: number;
	private readonly textFd: number;
	fpMs = 0; // wall time spent on fingerprints (reported by close, not in the diary)
	private draws = 0;
	private created = 0;
	private lines: string[] = [];
	/** Tick at which "Game start took" was logged (round start), or null. */
	roundStartTick: number | null = null;

	// ---- virtual cost: count DM proc entries (VM.enter and, on translated, the runtime's enterHook) -----------------
	private enterFn: ((proc: DMProc, src: Value, args: Value[]) => void) | null = null;
	/** Stats for the report: stoplag entries (CHECK_TICK sleeps), ticks whose count reached 100 %, the biggest tick. */
	vcostStats = { stoplags: 0, ticksOver100: 0, ticksOver60: 0, ticksOver30: 0, ticksOver10: 0, maxCalls: 0, totalCalls: 0, ticks: 0 };

	/** Installs the proc-entry hooks once (vcost and trace share them). `setTrEnter` = translated runtime's setEnterHook or null. */
	private hookEnter(setTrEnter: ((h: ((proc: DMProc, src: Value, args: Value[]) => void) | null) => void) | null): void {
		if (this.enterFn !== null) return;
		const enter = (proc: DMProc, src: Value, args: Value[]): void => {
			if (diffHook.vcostPerPct > 0) { diffHook.calls++; if (proc.path === "/proc/stoplag") this.vcostStats.stoplags++; }
			if (this.tracing) this.trace.push(`${this.curTick}\tE\t${proc.id}\t${proc.path}\t${sha(desc(src) + "(" + args.map(desc).join(",") + ")")}\t${this.where()}`); // where() = the caller (the new frame isn't pushed yet)
		};
		this.enterFn = enter;
		// VM.enter is private and called as this.enter, so an instance override sees every interpreter call (diff runs only).
		const v = this.vm as unknown as { enter: (thread: unknown, proc: DMProc, args: Value[], src: Value, usr: Value, mode?: number) => Value | undefined };
		const orig = v.enter.bind(this.vm);
		v.enter = (thread, proc, args, src, usr, mode) => {
			if (!proc.isNative && (this.tracing || diffHook.vcostPerPct > 0)) { if (this.tracing) while (args.length < proc.argNames.length) args.push(null); enter(proc, src, args); }
			return orig(thread, proc, args, src, usr, mode);
		};
		if (setTrEnter) setTrEnter(enter);
	}

	constructor(private readonly vm: VM, prefix: string, setTrEnter: ((h: ((proc: DMProc, src: Value, args: Value[]) => void) | null) => void) | null = null) {
		if (diffHook.vcostPerPct > 0) this.hookEnter(setTrEnter);
		this.fd = openSync(prefix + ".diary", "w");
		this.textFd = openSync(prefix + ".diary.log", "w");
		// Counters through instance overrides: the VM classes stay untouched (and free) when diff mode is off.
		const rng = vm.rng;
		const nextU32 = rng.nextU32.bind(rng);
		rng.nextU32 = () => { this.draws++; if (this.tracing) this.traceDraw(); return nextU32(); };
		const alloc = vm.allocObject.bind(vm);
		vm.allocObject = (type, pinned) => { this.created++; return alloc(type, pinned); };
		writeSync(this.fd, `# diary v1 fields: tick time draws rng objs sleeping loghash | F tick worldhash mobhash\n`);
	}

	// ---- detail mode (--diff-trace FROM-TO) ------------------------------------------------------------------------
	private traceFd = -1;
	private traceFrom = 0;
	private traceTo = -1;
	private tracing = false;
	private trace: string[] = [];
	private curTick = 0;

	/** Detail mode for ticks FROM..TO (diary tick numbers): every RNG draw with its caller (proc path + source line) and
	 * every DM proc entry (path + hash of src and args) go to PREFIX.trace. `setTrEnter` is the translated runtime's
	 * setEnterHook (proc entries that don't go through VM.enter), or null on the VM. */
	startTrace(prefix: string, from: number, to: number, setTrEnter: ((h: ((proc: DMProc, src: Value, args: Value[]) => void) | null) => void) | null): void {
		this.traceFd = openSync(prefix + ".trace", "w");
		this.traceFrom = from;
		this.traceTo = to;
		writeSync(this.traceFd, `# trace v1: tick R draw# proc file:line | tick E proc-id proc args-hash caller file:line\n`);
		this.hookEnter(setTrEnter);
	}

	/** Before each vm.runTick(): the tick about to run. */
	beginTick(t: number): void {
		this.curTick = t;
		this.tracing = this.traceFd >= 0 && t >= this.traceFrom && t <= this.traceTo;
	}

	/** The innermost DM frame: path and source line (its proc's first line). */
	private where(): string {
		const vm = this.vm;
		let f: Frame | undefined;
		if (vm.stackOf !== null) { const st = vm.stackOf(); f = st[st.length - 1]; }
		else { const th = vm.running[vm.running.length - 1]; f = th?.frames[th.frames.length - 1]; }
		if (!f) return "(no frame)";
		const src = f.proc.sourceStart(); // its proc's first line (no per-statement position)
		return `${f.proc.path}\t${src.slice(src.lastIndexOf("/") + 1)}`;
	}

	private traceDraw(): void {
		this.trace.push(`${this.curTick}\tR\t${this.draws}\t${this.where()}`);
	}

	/** One world.log line or runtime record (full text goes to the side file). */
	line(kind: "log" | "runtime", text: string): void {
		if (this.roundStartTick === null && kind === "log" && /^Game start took [\d.]+s$/.test(text)) this.roundStartTick = this.vm.sched.tick;
		this.lines.push(`${kind} ${text}`);
	}

	private rngHash(): string {
		const r = this.vm.rng as unknown as { s0: number; s1: number; s2: number; s3: number };
		return ((r.s0 ^ Math.imul(r.s1, 31) ^ Math.imul(r.s2, 961) ^ Math.imul(r.s3, 29791)) >>> 0).toString(16).padStart(8, "0") + "-" + (r.s0 >>> 0).toString(16);
	}

	/** Call after each vm.runTick(). */
	tick(): void {
		const vm = this.vm, t = vm.sched.tick;
		if (diffHook.vcostPerPct > 0) { // vm.sched.lastTickUsage = the tick that just ended (advance() computed it before zeroing the count)
			const st = this.vcostStats, c = Math.round(vm.sched.lastTickUsage * diffHook.vcostPerPct);
			st.ticks++; st.totalCalls += c; if (c > st.maxCalls) st.maxCalls = c;
			if (vm.sched.lastTickUsage >= 100) st.ticksOver100++;
			if (vm.sched.lastTickUsage >= 60) st.ticksOver60++;
			if (vm.sched.lastTickUsage >= 30) st.ticksOver30++;
			if (vm.sched.lastTickUsage >= 10) st.ticksOver10++;
		}
		const h = this.lines.length ? sha(this.lines.join("\n")) : "-";
		writeSync(this.fd, `${t}\t${vm.sched.time}\t${this.draws}\t${this.rngHash()}\t${this.created}\t${vm.sched.sleeping}\t${h}\n`);
		if (this.lines.length) writeSync(this.textFd, this.lines.map((l) => `${t}\t${l}`).join("\n") + "\n");
		this.lines = [];
		if (this.trace.length) { writeSync(this.traceFd, this.trace.join("\n") + "\n"); this.trace = []; }
		if (t % FINGERPRINT_EVERY === 0) {
			const t0 = performance.now();
			writeSync(this.fd, `F\t${t}\t${this.worldHash()}\t${sha(this.mobDump())}\n`);
			this.fpMs += performance.now() - t0;
		}
	}

	/** dk1-dump-style turf dump (type, colour, area, flags, opacity, atmos neighbours, air, contents), hashed as it goes:
	 * no sorting (list order is deterministic and a different order is a finding too) and no giant string. */
	worldHash(): string {
		const vm = this.vm, m = vm.map;
		const h = createHash("sha1");
		const s = (v: Value): string => (v === null || v === undefined ? "" : v instanceof DMList ? "[" + v.items.map((q) => (q instanceof DMObject ? `<${q.type.path}>` : String(q)) + (v.assoc ? "=" + String(v.get(q)) : "")).join(",") + "]" : v instanceof DMObject ? `<${v.type.path}>` : String(v));
		let buf: string[] = [];
		for (let z = 1; z <= m.maxz; z++) for (let y = 1; y <= m.maxy; y++) for (let x = 1; x <= m.maxx; x++) {
			const t = m.turfAt(x, y, z);
			if (!t) continue;
			const adj = live(t.getVar("atmos_adjacent_turfs"));
			const air = live(t.getVar("air"));
			buf.push(`${x},${y},${z}|${t.type.path}|${s(t.getVar("color"))}|${t.loc?.type.path ?? ""}|${s(t.getVar("flags"))}|${s(t.getVar("opacity"))}|${adj instanceof DMList ? adj.items.map((a) => { const q = live(a) as DMAtom; return `${q.x},${q.y}`; }).join(" ") : ""}|${s(t.getVar("baseturf"))}|${s(t.getVar("dir"))}|${s(t.getVar("icon_state"))}|${air instanceof DMObject ? `${s(air.getVar("temperature"))} ${s(air.getVar("gases"))}` : ""}`);
			for (const c of t.contents) if (c.kind !== Kind.Mob) buf.push(`${c.type.path}:${s(c.getVar("name"))}:${s(c.getVar("dir"))}:${s(c.getVar("icon_state"))}:${s(c.getVar("color"))}`);
			if (buf.length > 2000) { h.update(buf.join("\n")); buf = []; }
		}
		h.update(buf.join("\n"));
		return h.digest("hex").slice(0, 12);
	}

	mobDump(): string {
		const vm = this.vm;
		const s = (v: Value): string => (v === null || v === undefined ? "" : v instanceof DMObject ? `<${v.type.path}>` : String(v));
		const out: string[] = [];
		for (const m of vm.map.atomsOfKind(Kind.Mob)) {
			let loc: DMAtom | null = m.loc, where = "null", depth = 0;
			while (loc !== null && depth++ < 8) {
				if (loc.kind === Kind.Turf) { where = `${loc.x},${loc.y},${loc.z}`; break; }
				where = `in ${loc.type.path}`;
				loc = loc.loc;
			}
			out.push(`${m.type.path}|${where}|${s(m.getVar("stat"))}|${s(m.getVar("health"))}`);
		}
		return out.join("\n");
	}

	close(): void {
		closeSync(this.fd);
		closeSync(this.textFd);
		if (this.traceFd >= 0) closeSync(this.traceFd);
	}
}
