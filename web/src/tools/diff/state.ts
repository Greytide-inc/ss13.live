// dt-diff: what the game *means* at one moment, as text two builds can compare record by record.
//
// Every object reachable from the game's roots (world, globals, the map, every atom, sleeping procs, tagged datums,
// clients), each with its type and its written vars by name (a var equal to its type's default is left out: the
// header hashes every type's defaults, so the two forms say the same), atoms' loc and contents order; every list
// with its order and associations; sleeping procs (due tick, proc stack, src/usr/args); the clock, RNG, ref counter
// and collector count. A deleted object reads as null, as it does in game code. Engine storage (shapes, caches,
// how a value is kept) never shows.
//
// Objects are numbered in creation order (Diary's allocObject hook); ones made before the diary started (a snapshot
// load) get the next number when first met. A list has no number: it is written out inside the first record that
// names it (records in a fixed order: globals, sleepers, then objects by number; vars by name), and anywhere else
// as ^PATH, the place it was written (`^#68.hud_icons`, `^G.mob_list`, `^#5.gases[2]`). So one changed list doesn't
// renumber anything else.
//
// Records, one per line, tab-separated fields (JSON strings never hold a raw tab): H header, T type defaults hash,
// G global, S sleeper, O object. Within a section the key (2nd field) only grows, so state-compare.ts merges two
// dumps in one pass.
import { closeSync, openSync, writeSync } from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import type { Frame, VM } from "../../vm/interpreter.js";
import { DMProc, DMType, ListLiteral, Resource } from "../../vm/objtree.js";
import { DMList, DMObject, taggedDatums, type VarShape } from "../../vm/objects.js";
import { GCFlag, heap } from "../../vm/gc.js";
import { refNext } from "../../vm/refs.js";
import { DMAtom, Kind } from "../../vm/world.js";
import type { Thread } from "../../vm/scheduler.js";
import type { Value } from "../../vm/value.js";

const sha = (s: string): string => createHash("sha1").update(s).digest("hex").slice(0, 12);
/** atoms' vars kept outside `vals` (written out from the atom's own fields) or derived from the type. */
const SKIP = new Set(["type", "parent_type", "vars", "loc", "x", "y", "z", "contents"]);

/** An object's or list's number, kept on it (diff runs only): a WeakMap of millions of entries took ~30 s a check. */
type Numbered = { dtId?: number };
const idOf = (x: DMObject | DMList): number => (x as Numbered).dtId!;
const live = <T extends Value | undefined>(x: T): T | null => (x instanceof DMObject && x.deleted ? null : x);

/** Which numbers this dump has met (numbers are dense, so a byte per number). */
class Seen {
	private a = new Uint8Array(1 << 20);
	/** true the first time `id` is met. */
	first(id: number): boolean {
		if (id >= this.a.length) { const b = new Uint8Array(Math.max(id + 1, this.a.length * 2)); b.set(this.a); this.a = b; }
		if (this.a[id]) return false;
		this.a[id] = 1;
		return true;
	}
}

export class StateDump {
	private nextId = 1;
	/** lists' own numbers: only for `seenLists` and `homes`, never written out. */
	private nextList = 1;
	private readonly sorted = new WeakMap<VarShape, number[]>();
	/** Every object the walk found (find()). */
	private objs: DMObject[] = [];
	private seenObjs = new Seen();
	private seenLists = new Seen();
	private readonly work: (DMObject | DMList)[] = [];
	/** Where each list was written out in this dump, by its own number. */
	private homes: string[] = [];
	private listCount = 0;

	constructor(private readonly vm: VM) {}

	/** A new object (Diary's allocObject hook): its number is its place in creation order. */
	created(o: DMObject): void {
		(o as Numbered).dtId = this.nextId++;
	}

	private add(y: Value | undefined): void {
		if (y instanceof DMObject) {
			if (y.deleted) return;
			const id = ((y as Numbered).dtId ??= this.nextId++);
			if (this.seenObjs.first(id)) { this.objs.push(y); this.work.push(y); }
		} else if (y instanceof DMList) {
			if (y.gcFlags & GCFlag.View) { this.add(y.viewTarget as Value); return; }
			if (this.seenLists.first(((y as Numbered).dtId ??= this.nextList++))) this.work.push(y);
		}
	}

	/** Pass 1: everything reachable from `x` (objects and lists, through vars, locs, contents, items and associations). */
	private find(x: Value | undefined): void {
		const work = this.work;
		this.add(x);
		while (work.length) {
			const o = work.pop()!;
			if (o instanceof DMObject) {
				if (o instanceof DMAtom) { this.add(o.loc); for (const c of o.contents) this.add(c); }
				if (o.vals !== null) for (const y of o.vals) this.add(y);
			} else {
				for (const y of o.items) this.add(y);
				if (o.assoc !== null) for (const y of o.items) this.add(o.assocOf(y));
			}
		}
	}

	/** Pass 2: a value as text at `path` (where a list first met is written out in full). */
	private v(x: Value | undefined, path: string): string {
		if (x === null) return "null";
		if (x === undefined) return "undef";
		if (typeof x === "number") return Object.is(x, -0) ? "-0" : String(x);
		if (typeof x === "string") return x.length <= 120 ? JSON.stringify(x) : `${JSON.stringify(x.slice(0, 60))}...${sha(x)}/${x.length}`;
		if (x instanceof DMObject) return x.deleted ? "null" : "#" + idOf(x);
		if (x instanceof DMList) {
			if (x.gcFlags & GCFlag.View) {
				const t = x.viewTarget;
				return `view:${x.constructor.name}(${t instanceof DMObject ? (t.deleted ? "null" : "#" + idOf(t)) : t instanceof DMList ? this.v(t, path) : "-"})`;
			}
			const id = idOf(x), home = this.homes[id];
			if (home !== undefined) return "^" + home;
			this.homes[id] = path;
			this.listCount++;
			const a = x.assoc !== null;
			const items = x.items.map((y, i) => {
				let s = this.v(live(y), y instanceof DMList ? `${path}[${i + 1}]` : ""); // paths only for lists (the rest never need one)
				if (a) { const w = x.assocOf(y); if (w !== undefined) s += "=>" + this.v(live(w), w instanceof DMList ? `${path}{${i + 1}}` : ""); }
				return s;
			});
			return `${x.constructor === DMList ? "" : x.constructor.name}[${items.join(", ")}]`;
		}
		if (x instanceof DMType) return x.path;
		if (x instanceof DMProc) return "proc:" + x.path;
		if (x instanceof Resource) return `'${x.path}'`;
		if (x instanceof ListLiteral) return "lit:" + JSON.stringify(x.json);
		return "?" + ((x as object).constructor?.name ?? typeof x);
	}

	/** The written vars' indexes in name order (shapes are shared, so this is cached per shape). */
	private order(s: VarShape): number[] {
		let o = this.sorted.get(s);
		if (o === undefined) {
			o = s.names.map((_, i) => i).filter((i) => !SKIP.has(s.names[i])).sort((a, b) => (s.names[a] < s.names[b] ? -1 : 1));
			this.sorted.set(s, o);
		}
		return o;
	}

	private objLine(o: DMObject): string {
		const id = idOf(o), f: string[] = ["O", String(id), o.type.path];
		if (o instanceof DMAtom) {
			if (o.kind === Kind.Turf) f.push(`@${o.x},${o.y},${o.z}`);
			f.push("loc=" + this.v(o.loc, ""));
			if (o.contents.length) f.push("contents=[" + o.contents.map((c) => this.v(c, "")).join(",") + "]");
		}
		const s = o.shape, vals = o.vals, defs = o.type.vars;
		if (vals !== null) for (const i of this.order(s)) {
			const k = s.names[i], x = live(vals[i]), d = defs.get(k);
			if (d !== undefined && (typeof x === "number" ? Object.is(x, d) : x === d)) continue; // the default: reads the same
			f.push(`${k}=${this.v(x, x instanceof DMList ? `#${id}.${k}` : "")}`);
		}
		return f.join("\t");
	}

	private frameText(f: Frame, at: string): string {
		const p = [f.proc.path, `src=${this.v(f.src, at + ".src")}`, `usr=${this.v(f.usr, at + ".usr")}`, `args=[${f.args.map((x, i) => this.v(live(x), `${at}.args[${i + 1}]`)).join(",")}]`];
		if (f.dot !== null) p.push(`dot=${this.v(live(f.dot), at + ".dot")}`);
		if (f.locals.length) p.push(`locals=[${f.locals.map((x, i) => this.v(live(x), `${at}.locals[${i + 1}]`)).join(",")}]`);
		if (f.resume !== undefined) p.push(`resume=${this.v(live(f.resume), at + ".resume")}`);
		return p.join(" ");
	}

	private types: string | null = null;
	/** Every type's defaults (left-out vars read these), once a run: they don't change while it runs. */
	private typesHash(): string {
		if (this.types !== null) return this.types;
		const h = createHash("sha1");
		for (const t of [...this.vm.tree.types].sort((a, b) => (a.path < b.path ? -1 : 1))) {
			const vs = [...t.vars].sort((a, b) => (a[0] < b[0] ? -1 : 1));
			h.update(t.path + "{" + vs.map(([k, d]) => k + "=" + (d instanceof DMObject || d instanceof DMList ? "?" : this.v(d, ""))).join(",") + "}\n");
		}
		return (this.types = h.digest("hex").slice(0, 12));
	}

	/**
	 * Walks the world and writes the dump to `file` (gzip, several members) unless null. Returns its hash and counts.
	 * Pass 1 finds every reachable object; pass 2 writes the records in a fixed order (objects by number).
	 */
	dump(file: string | null): { hash: string; objects: number; lists: number; bytes: number } {
		const vm = this.vm, sched = vm.sched, m = vm.map;
		this.seenObjs = new Seen();
		this.seenLists = new Seen();
		this.objs = [];
		this.homes = new Array<string>(this.nextList + 1);
		this.listCount = 0;
		const queue = (sched as unknown as { queue: { thread: Thread; due: number }[] }).queue;
		const frames = (th: Thread) => { for (const f of th.frames) { this.find(f.src); this.find(f.usr); for (const a of f.args) this.find(a); this.find(f.dot); for (const a of f.locals) this.find(a); this.find(f.resume); } };

		this.find(vm.world);
		for (const g of vm.globals) this.find(g);
		for (const s of queue) frames(s.thread);
		for (const th of sched.parked) frames(th);
		for (let z = 1; z <= m.maxz; z++) for (let y = 1; y <= m.maxy; y++) for (let x = 1; x <= m.maxx; x++) this.find(m.turfAt(x, y, z));
		for (const a of m.atomsOfKind(0)) this.find(a);
		for (const o of taggedDatums) this.find(o);
		for (const c of vm.clients.list) this.find(c);

		const h = createHash("sha1");
		const fd = file !== null ? openSync(file, "w") : -1;
		let bytes = 0, buf: string[] = [], size = 0;
		const flush = () => {
			const text = buf.join("");
			h.update(text);
			if (fd >= 0) { const z = gzipSync(text, { level: 1 }); writeSync(fd, z); bytes += z.length; }
			buf = []; size = 0;
		};
		const put = (line: string) => { buf.push(line, "\n"); size += line.length; if (size > 4 << 20) flush(); };
		const r = vm.rng as unknown as { s0: number; s1: number; s2: number; s3: number };
		put(["H", "0", `tick=${sched.tick}`, `time=${sched.time}`, `tick_lag=${sched.tickLag}`, `rng=${[r.s0, r.s1, r.s2, r.s3].map((n) => (n >>> 0).toString(16)).join(",")}`, `refnext=${refNext()}`, `freed=${heap.freed}`].join("\t"));
		put(`T\t0\t${this.typesHash()}`);
		put(`G\t0\tworld\t${this.v(vm.world, "G.world")}`);
		const names = vm.tree.globalNames;
		for (let i = 0; i < vm.globals.length; i++) put(`G\t${i + 1}\t${names[i] ?? "?"}\t${this.v(live(vm.globals[i]), `G.${names[i] ?? i}`)}`);
		const thread = (th: Thread, at: string) => th.frames.map((f, j) => this.frameText(f, `${at}.f${j + 1}`)).join(" | ");
		queue.forEach((s, i) => put(`S\t${i}\tdue+${s.due - sched.tick}\t${thread(s.thread, `S${i}`)}`));
		let pi = queue.length;
		for (const th of sched.parked) { put(`S\t${pi}\tparked\t${thread(th, `S${pi}`)}`); pi++; }
		const objs = this.objs.sort((a, b) => idOf(a) - idOf(b));
		for (const o of objs) put(this.objLine(o));
		flush();
		if (fd >= 0) closeSync(fd);
		const out = { hash: h.digest("hex").slice(0, 12), objects: objs.length, lists: this.listCount, bytes };
		this.objs = [];
		this.homes = [];
		return out;
	}
}
