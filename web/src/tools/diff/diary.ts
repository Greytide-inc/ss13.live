// diff mode and the diary.
//
// enableDiffMode(vm) removes the noise sources that make two runs differ without a bug: a fake clock
// (tick_usage/cpu constant, timeofday/realtime/time2text = fixed start + world.time) and the collector
// running only at tick boundaries. Diary writes one line per tick (log, runtimes and everything sent to players
// count in its hash) plus, every 100 ticks, a check: the hash of the whole game state (state.ts), whose dump goes to
// PREFIX.state/TICK.gz for compare.ts to say where two runs differ. The full log/runtime/output text goes to a side
// file. Nothing here is loaded unless boot.ts is given --diff.
import { closeSync, mkdirSync, openSync, readFileSync, rmSync, unlinkSync, writeSync } from "node:fs";
import { createHash } from "node:crypto";
import type { Frame, VM } from "../../vm/interpreter.js";
import type { DMProc } from "../../vm/objtree.js";
import { clockHook, diffHook } from "../../vm/clockhook.js";
import { DMList, DMObject } from "../../vm/objects.js";
import { DMAtom, Kind } from "../../vm/world.js";
import type { Value } from "../../vm/value.js";
import { StateDump } from "./state.js";

/** 2017-06-15 12:00:00 UTC: a fixed "today"; noon, so +-12 h of world time stays inside one day. */
export const DIFF_START_MS = Date.UTC(2017, 5, 15, 12, 0, 0);
export const FINGERPRINT_EVERY = Number(process.env.DIFF_FP_EVERY ?? 100); // ticks between state checks (~10 s and ~40 MB each on BoxStation) (both runs must use the same value)

/** Default for --diff-vcost: calls per 1 % of tick_usage (picked from measured calls per tick). */
export const VCOST_DEFAULT = 25;

/** `vcostPerPct` > 0 = virtual cost: tick_usage is the DM proc calls made this tick divided by it (so N calls = 1 %). */
export function enableDiffMode(vm: VM, vcostPerPct = 0): void {
	diffHook.fakeUsage = 0;
	diffHook.vcostPerPct = vcostPerPct;
	diffHook.calls = 0;
	diffHook.gcTickOnly = true;
	// world.time is deciseconds: the fake host clock is the start plus that.
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
	fpMs = 0; // wall time spent on state checks (reported by close, not in the diary)
	fpBytes = 0; // their dumps' size on disk
	private readonly state: StateDump;
	private readonly stateDir: string;
	/** Where notes go (boot.ts sets its log). */
	note: (s: string) => void = () => {};
	/** --diff-ref: the other run's diary lines by key ("TICK", "F TICK"), to check this run against as it goes. */
	private ref: Map<string, string> | null = null;
	/** The first tick whose diary line differs from the reference's, or null. */
	firstDiff: number | null = null;
	/** Set at the first check at or after `firstDiff`: the run can stop, that check's dump is kept for compare.ts. */
	stop = false;
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
		this.state = new StateDump(vm);
		vm.allocObject = (type, pinned) => { this.created++; const o = alloc(type, pinned); this.state.created(o); return o; };
		this.stateDir = prefix + ".state";
		rmSync(this.stateDir, { recursive: true, force: true });
		mkdirSync(this.stateDir, { recursive: true });
		// Everything sent to players: one line each, in the tick's hash.
		const send = vm.clients.send.bind(vm.clients);
		vm.clients.send = (ckey, m) => { this.lines.push(`out ${ckey} ${JSON.stringify(m)}`); send(ckey, m); };
		writeSync(this.fd, `# diary v2 fields: tick time draws rng objs sleeping loghash | F tick statehash objects lists\n`);
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

	/** Checks this run against another run's diary (its prefix) as it goes: a check that matches it deletes its dump
	 * (the reference has the same one), the first one after a difference keeps it and sets `stop`. */
	setRef(prefix: string): void {
		const lines = readFileSync(prefix.replace(/\.diary$/, "") + ".diary", "utf8").split("\n").filter((l) => l !== "" && !l.startsWith("#"));
		this.ref = new Map(lines.map((l) => [l.startsWith("F\t") ? "F " + l.split("\t")[1] : l.slice(0, l.indexOf("\t")), l]));
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
		const line = `${t}\t${vm.sched.time}\t${this.draws}\t${this.rngHash()}\t${this.created}\t${vm.sched.sleeping}\t${h}`;
		writeSync(this.fd, line + "\n");
		if (this.ref !== null && this.firstDiff === null && this.ref.get(String(t)) !== line) { this.firstDiff = t; this.note(`[diff] tick ${t} differs from the reference run`); }
		const mark = (globalThis as { dtMark?: string }).dtMark; // dt-diff's own check: a planted fault sets this when it first runs
		if (mark !== undefined) { this.note(`[diff] mark "${mark}" at tick ${t}`); delete (globalThis as { dtMark?: string }).dtMark; }
		if (this.lines.length) writeSync(this.textFd, this.lines.map((l) => `${t}\t${l.length > 2000 ? l.slice(0, 2000) + "..." : l}`).join("\n") + "\n");
		this.lines = [];
		if (this.trace.length) { writeSync(this.traceFd, this.trace.join("\n") + "\n"); this.trace = []; }
		if (t % FINGERPRINT_EVERY === 0) {
			const t0 = performance.now();
			const file = `${this.stateDir}/${t}.gz`, d = this.state.dump(file);
			const fl = `F\t${t}\t${d.hash}\t${d.objects}\t${d.lists}`;
			writeSync(this.fd, fl + "\n");
			this.fpMs += performance.now() - t0;
			if (this.ref !== null && this.ref.get("F " + t) === fl) unlinkSync(file);
			else {
				this.fpBytes += d.bytes;
				if (this.ref !== null) { this.note(`[diff] state at tick ${t} ${this.ref.has("F " + t) ? "differs from" : "isn't in"} the reference run; dump kept`); this.stop = true; }
			}
			if (this.firstDiff !== null) this.stop = true;
		}
	}

	close(): void {
		closeSync(this.fd);
		closeSync(this.textFd);
		if (this.traceFd >= 0) closeSync(this.traceFd);
	}
}
