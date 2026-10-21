// script - dt-in: the scripted player. Reads a script file of `TICK: ACTION ARGS` lines and feeds each action to the
// connected client at that tick, through the same Clients calls the browser worker's message handlers make
// (src/worker/boot-worker.ts: onKey, onClick, onTopic, onCommand). It only counts ticks, never real time, so the same
// script on the same seed issues the same inputs at the same ticks on any engine.
//
// TICK is a tick number, or `Ns` (seconds, 20 ticks a second, e.g. `5s:` or `2.5s:`).
// A scenario file (web/scenarios/NAME.txt) is a script with header lines `map: NAME`, `job: JOB`, `seed: N`, `length: SECONDS`
// (parseHeader reads them; parseScript skips them), plus optional, repeatable `expect: REGEX` (some log line must match) and
// `expect-not: REGEX` (no log line may match): boot.ts --scenario NAME runs it and prints ok/FAIL per line (the page ignores them). No Node imports here: the page worker uses this file too.
//
// Script format (one action per line; `#` starts a comment; ticks are counted from the tick the script starts,
// which boot.ts sets to the tick the --join click was made (or, for --scenario, the tick the player spawned); lines may be in any order):
//   TICK: key down|up|press KEY          BYOND key name ("W", "NORTH", "TAB", "CTRL+W"); press = down then up at once
//   TICK: click SEL [shift|ctrl|alt|right ...] [icon-x=N;icon-y=N]   a left click on the atom SEL names (modifiers go into the params; icon-x/y default 16)
//   TICK: drag SEL OVER                  drags SEL onto OVER (MouseDrop: SEL.MouseDrop(OVER), e.g. `drag self near:/obj/vehicle/secway` buckles onto it)
//   TICK: topic SEL k=v;k=v              Clients.topic with `src=<ref of SEL>;` in front; any `@SEL` in the text becomes that atom's ref
//   TICK: spawn /type [SEL]              creates one at SEL's tile (default: the tile east of the mob); for a target the map doesn't put nearby
//   TICK: spawn /type xN rR [SEL]        N copies on random free tiles (not space, not blocked) within R tiles (default 5) of SEL (default self), picked with the
//                                        seeded RNG (vm.rng), every free tile used once before any gets a second copy; logs every position
//   TICK: call SEL PROC [args]           SEL.PROC(args) with usr = the mob; args are numbers, "text", null or a SEL; logs the return value
//   TICK: tp SEL                         moves the mob onto SEL's tile, unbuckled
//   TICK: hand /type                     a new item in the mob's active hand (put_in_hands), as the page's ?setup=hand:
//   TICK: say TEXT                       the `say` verb (typed line)        TICK: verb LINE   any typed line
//   TICK: probe [SEL] [var,var,...]      logs the mob (loc, hands, health, stat, cuffs...) and SEL, so a run can be checked
//   TICK: step DIR                       one step as a predicting page sends it (Clients.step; NORTH, SOUTH, EAST, WEST)
//   TICK: pick                           logs the items the page may show picked up at a click (pickOf), as type@dx,dy(in-hand icon:state), or "none"
//   TICK: put                            logs what the page may guess the held item does (putOf): the item, "floor L/P" (its layer/plane put down), and each table/rack a click puts it on as type@dx,dy (c = centred on the click), or "none"
//   TICK: moved                          logs the movers a player's view update has since the last moved line (ViewDiffer's moved list), as type from->to
//   TICK: pred                           logs how many tiles around the mob (the AI: its eye, "(eye)") the page may predict a step onto (0 = none)
//   TICK: look [R] [REGEX]               logs every atom within R tiles (default 3) whose type matches, as type@dx,dy (for writing scripts)
//   TICK: map [R]                        logs a character map of the R tiles around the mob (default 8), rows joined with "/"
//   TICK: goto SEL [MAXTICKS]            walks the mob to within 1 tile of SEL (an arrow key press per tick, a plain breadth-first path over
//                                        open tiles, doors count as open); the rest of the script waits until it arrives or gives up (default 300 ticks), keeping its spacing
//   TICK: explode DEV HEAVY LIGHT FLASH [SEL]   explosion() at SEL's turf (default own turf), ignorecap like the admin Drop Bomb
//   TICK: powernets                      logs each powernet as a sorted signature (cables, nodes) and a hash, to compare grids
//   TICK: airdump                        logs SSair's active turfs with their air (temperature, moles per gas) and a hash, to compare air
//   TICK: gasdump [NAME]                airdump plus every pipeline (air + other_airs, keyed by its sorted member coords) and every 3rd air turf on z 1, as JSON to $GASDUMP_DIR (default build/gasdump)/NAME.json; compare two dirs with tools/gas-diff.mjs
//   TICK: anim [SEL]                     logs (and drains) the animate()/flick() events since the last anim line, for SEL's object or all (a script needs an anim line to turn the recording on)
//   TICK: wait                           does nothing (a marker line in the log)
// SEL (an atom to act on), resolved at the tick it is used:
//   self | held | hand:N | near:/type/path[@R][#N] | inv:/type/path[#N] | turf:DX,DY | at:X,Y,Z | client | glob:NAME (a global var)
//     near:  the Nth (0-based, default 0) atom of that type (or a subtype) within R tiles (default 4) of the mob's turf,
//            nearest first (then y, x, then the turf's contents order); the turf itself counts, the mob does not.
//     inv:   the Nth atom of that type anywhere inside the mob (hands, belt, bag...).
//   then optionally `.var` (read a var), `[i]` (0-based list index) and `["key"]` (an associative list's value), repeated: near:/obj/machinery/vending.product_records[0]
// A SEL that finds nothing logs "no target" and the script carries on.
// Log: one `[script] ...` line per action, "tick T world.time W: ACTION -> what it found/did".

import { DMList, DMObject, live } from "../vm/objects.js";
import { DMAtom, Kind } from "../vm/world.js";
import { refOf } from "../vm/refs.js";
import { stringify } from "../vm/value.js";
import type { VM } from "../vm/interpreter.js";
import { carriedLightOf, pickOf, predMover, predOf, predTurnOf, putOf, ViewDiffer } from "./client-view.js";
import { lessLight, parseLight } from "../render/carried-light.js";
import { shadowStrength, type Opq } from "../render/sight-shadow.js";

// No Node imports: the page worker imports this file too. Env switches read through here (empty in a worker).
const env: Record<string, string | undefined> = typeof process !== "undefined" && process.env ? process.env : {};

/** A small pure-JS hash (cyrb53, 14 hex digits) for the powernets/airdump lines. Not sha1: the printed values differ from before the move. */
export function hashText(str: string): string {
	let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
	for (let i = 0; i < str.length; i++) {
		const ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, "0");
}

export const TICKS_PER_SECOND = 20;

/** The header of a scenario file: `map: NAME`, `job: JOB`, `seed: N`, `length: SECONDS` (after the spawn), `expect:` / `expect-not:` regexes
 *  (repeatable, in file order). Unset keys are absent. */
export interface ScenarioHeader { map?: string; job?: string; seed?: number; length?: number; expect?: string[]; expectNot?: string[] }

const HEADER_RE = /^(map|job|seed|length|expect-not|expect)\s*:\s*(.*)$/i;

/** Reads the header lines of a scenario file (comment lines `# job: X` as in the diff scripts don't count). */
export function parseHeader(src: string): ScenarioHeader {
	const h: ScenarioHeader = {};
	for (const raw of src.split("\n")) {
		const m = HEADER_RE.exec(raw.trim());
		if (!m) continue;
		const k = m[1].toLowerCase(), v = m[2].trim();
		if (k === "map") h.map = v; else if (k === "job") h.job = v;
		else if (k === "expect") (h.expect ??= []).push(v);
		else if (k === "expect-not") (h.expectNot ??= []).push(v);
		else h[k as "seed" | "length"] = Number(v);
	}
	return h;
}

export interface ScriptAction { tick: number; line: number; text: string; verb: string; args: string }

export function parseScript(src: string): ScriptAction[] {
	const out: ScriptAction[] = [];
	src.split("\n").forEach((raw, i) => {
		const l = raw.replace(/^\s*#.*$/, "").trim();
		if (!l || HEADER_RE.test(l)) return;
		const m = /^(\d+(?:\.\d+)?s?)\s*:\s*(\S+)\s*(.*)$/.exec(l);
		if (!m) throw new Error(`script line ${i + 1}: expected "TICK: action args" or "Ns: action args", got ${JSON.stringify(raw)}`);
		const tick = m[1].endsWith("s") ? Math.round(Number(m[1].slice(0, -1)) * TICKS_PER_SECOND) : Number(m[1]);
		out.push({ tick, line: i + 1, text: l, verb: m[2].toLowerCase(), args: m[3] });
	});
	return out.sort((a, b) => a.tick - b.tick || a.line - b.line);
}

export class ScriptPlayer {
	readonly actions: ScriptAction[];
	private next = 0;
	/** An active `goto`: walks one step per tick until within 1 tile of the goal (later actions wait for it). */
	private differ: ViewDiffer | null = null;
	private walk: { sel: string; since: number; stuck: number; last: string } | null = null;
	/** Counts for the end-of-run summary. */
	ran = 0;
	missed = 0;
	/** `src` is the script's text (the caller reads the file); `file` is only the name the first log line shows. */
	constructor(private vm: VM, src: string, private log: (s: string) => void, file = "script") {
		this.actions = parseScript(src);
		if (this.actions.some((x) => x.verb === "anim") && this.vm.animLog === null) this.vm.animLog = [];
		log(`[script] ${file}: ${this.actions.length} actions, last at tick ${this.actions.at(-1)?.tick ?? 0}`);
	}
	get done(): boolean { return this.next >= this.actions.length && !this.walk; }
	get lastTick(): number { return this.actions.at(-1)?.tick ?? 0; }

	/** Runs every action due at this script tick (call before vm.runTick()). */
	private hooked: unknown = null;
	/** Hooks the client's outgoing messages into the log (lazily: loading a snapshot replaces vm.clients). */
	private hookMessages(): void {
		const cl = this.vm.clients;
		if (this.hooked === cl) return;
		this.hooked = cl;
		const prev = cl.onMessage;
		cl.onMessage = (m) => { // what tg tells the player ("You pick up..."), one line each, so a run's log shows what the actions did
			prev?.(m);
			if (env.DTIN_DEBUG) this.log(`[script] msg ${JSON.stringify(m).slice(0, 200)}`);
			if (m.type === "browse" && m.window !== "asset_cache_browser") this.log(`[script] tick ${this.cur} browse window ${JSON.stringify(m.window)}: ${String(m.html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)}`);
			if (m.type === "text" || (m.type === "output" && m.control === "output")) this.log(`[script] tick ${this.cur} to client: ${String(m.text).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 200)}`);
		};
	}
	private cur = 0;
	/** Ticks the script has been pushed back by gotos that took longer than the script's own spacing allowed for. */
	private shift = 0;
	private walkLimit = 300;
	/** gl2 (GLIDE_LOG=1): atoms named by `watch SEL`, plus the mob and what it pulls, log their glide_size on every tile they change. */
	private watched = new Map<DMAtom, string>();
	private carrySaved: { t: DMAtom; m: number[] }[] = [];
	private glideLog(c: DMObject | undefined): void {
		const mob = c ? live(c.getVar("mob")) : null;
		const list: DMAtom[] = [...this.watched.keys()];
		if (mob instanceof DMAtom) { list.push(mob); const p = live(mob.getVar("pulling")); if (p instanceof DMAtom) list.push(p); }
		for (const o of list) {
			const t = this.vm.map.outerTurf(o);
			const where = t ? `${t.x},${t.y}` : "-";
			if (this.watched.get(o) === where) continue;
			this.watched.set(o, where);
			this.log(`[glide] world.time ${this.vm.sched.time} ${o.type.path} at ${where} glide_size=${this.show(o.getVar("glide_size"))} throwing=${o.hasVar("throwing") ? (live(o.getVar("throwing")) ? 1 : 0) : "-"}`);
		}
	}
	step(tick: number): void {
		this.cur = tick;
		this.hookMessages();
		const c = this.vm.clients.list[0];
		if (env.GLIDE_LOG2) this.glideLog(c);
		if (this.walk && c) {
			this.walkStep(c, tick);
			// a goto that ends makes the rest of the script wait: the remaining actions keep their spacing, starting from the next tick
			if (!this.walk && this.next < this.actions.length) this.shift = Math.max(this.shift, tick + 1 - this.actions[this.next].tick);
		}
		while (!this.walk && this.next < this.actions.length && this.actions[this.next].tick + this.shift <= tick) {
			const a = this.actions[this.next++];
			let res: string;
			try { res = c ? this.run(c, a) : "no client"; } catch (e) { res = `ERROR ${(e as Error).message}`; }
			if (/^(no target|no client|no mob|ERROR)/.test(res)) this.missed++; else this.ran++;
			this.log(`[script] tick ${tick} world.time ${this.vm.sched.time}: ${a.verb} ${a.args} -> ${res}`);
		}
		if (c) this.vm.clients.runInput(); // boot.ts's loop doesn't call it (the worker does, just before runTick): queued commands, held keys, clicks
	}

	private run(c: DMObject, a: ScriptAction): string {
		const cl = this.vm.clients;
		const mob = live(c.getVar("mob"));
		switch (a.verb) {
			case "wait": return "ok";
			case "anim": { // anim [SEL]: the animate()/flick() events since the last anim line (all objects, or only SEL's), as object: var(s)->after time loop; drains them
				const log = this.vm.animLog ?? [], want = a.args.trim() && mob instanceof DMAtom ? this.resolve(c, mob, a.args.trim()) : null;
				const mine = log.filter((e) => !want || e.o === want);
				this.vm.animLog = log.filter((e) => want && e.o !== want);
				const row = (e: (typeof log)[number]) => e.flick ? `flick ${e.flick}` : `${e.fresh ? "new" : "chain"} ${(e.vars ?? []).map((v) => v[0]).join("+")} time ${e.time} loop ${e.loop}`;
				return `${mine.length} events${want ? " on " + this.desc(want) : ""}: ${mine.slice(0, 6).map(row).join(" ; ")}${mine.length > 6 ? " ; ..." : ""}`;
			}
			case "step": {
				const dir = ({ NORTH: 1, SOUTH: 2, EAST: 4, WEST: 8 } as Record<string, number>)[a.args.trim().toUpperCase()];
				if (!dir) return `ERROR bad dir ${a.args}`;
				cl.step(c, dir);
				return "sent";
			}
			case "moved": {
				const first = !this.differ;
				this.differ ??= new ViewDiffer();
				const u = this.differ.update(this.vm, first, c);
				if (first) return "view started";
				const rows = u.moved.map(([id, x0, y0, x1, y1]) => `${this.differ!.objectOf(id)?.type.path ?? id} ${x0},${y0}->${x1},${y1}`);
				return `moved ${rows.length ? rows.join(" ; ") : "none"}`;
			}
			case "pick": {
				const l = pickOf(this.vm, mob);
				return `pick ${l.length ? l.map(([o, dx, dy, f, st]) => `${o.type.path}@${dx},${dy}(${f}:${st})`).join(" ") : "none"}`;
			}
			case "put": {
				const p = putOf(this.vm, mob);
				return `put ${p ? `${p.item.type.path} floor ${p.layer}/${p.plane} in-hand ${p.icon}:${p.state} on ${p.on.map(([o, dx, dy, ctr]) => `${o.type.path}@${dx},${dy}${ctr ? "c" : ""}`).join(" ") || "nothing"}` : "none"}`;
			}
			case "pred": {
				const mover = predMover(this.vm, c), t = mover?.loc; // the AI's eye, not the AI
				const free = t instanceof DMAtom ? predOf(this.vm, mover, { x: t.x, y: t.y, z: t.z }) : 0;
				let n = 0;
				for (let b = free; b >= 1; b = Math.floor(b / 2)) n += b % 2; // 49 bits: no >> or &
				return `pred free tiles ${n}${mover && mover !== mob ? " (eye)" : ""}${mover && t instanceof DMAtom ? ` ${mover.type.path}@${t.x},${t.y}` : ""}${mover && predTurnOf(mover) ? ` turn first, facing ${String(live(mover.getVar("dir")))}` : ""}`; // what moves, its tile
			}
			case "shadow": { // shadow: how the page would draw the sight shadow from a fresh full view update (render/sight-shadow.ts shadowStrength):
				// full / dim / none, the mob's sight flags, and the tile the opacity box is centred on (the eye: a camera console's, the blob's)
				const u = new ViewDiffer().update(this.vm, true, c), sight = Number(u.sight?.sight ?? 0), box = u.opq && u.opq.length ? u.opq as Opq : null;
				const k = shadowStrength(sight, box !== null), e = live(c.getVar("eye")), t = e instanceof DMAtom ? e.loc : null;
				return `shadow ${k === 1 ? "full" : k > 0 ? "dim" : "none"} sight ${sight}${box ? ` box centre ${box[0] + (box[2] - 1) / 2},${box[1] + (box[3] - 1) / 2}` : ""} eye ${e instanceof DMAtom ? e.type.path : "none"}${t instanceof DMAtom ? `@${t.x},${t.y}` : ""}`;
			}
			case "carrylight": { // carrylight save: the lighting round the mob with its carried light taken out, as the page does it (carried-light.ts);
				// carrylight compare (after the light is off): the most any colour of those tiles differs from the server's own lighting now
				if (!(mob instanceof DMAtom) || !(mob.loc instanceof DMAtom)) return "no mob";
				const mt = mob.loc;
				const look = (t: DMAtom): number[] | null => { // a turf's lighting object's matrix (dark: 0s, transparent: 1s)
					const lo = live(t.getVar("lighting_object"));
					if (!(lo instanceof DMObject)) return null;
					const col = live(lo.getVar("color")), st = live(lo.getVar("icon_state"));
					if (col instanceof DMList) return col.items.map((v) => Number(live(v)));
					const k = st === "transparent" ? 1 : 0;
					return [k, k, k, 0, k, k, k, 0, k, k, k, 0, k, k, k, 0, 0, 0, 0, 1];
				};
				if (a.args.trim() === "save") {
					const l = parseLight(carriedLightOf(mob, 0));
					if (!l) return "no carried light";
					this.carrySaved = [];
					for (const [tx, ty] of l.tiles) {
						const t = this.vm.map.turfAt(mt.x + l.ax + tx, mt.y + l.ay + ty, mt.z), m = t ? look(t) : null;
						if (t && m) this.carrySaved.push({ t, m: lessLight("", m, l, tx, ty) ?? m });
					}
					return `carried light saved ${this.carrySaved.length} tiles`;
				}
				let worst = 0;
				for (const { t, m } of this.carrySaved) { const n = look(t); if (n) for (let i = 0; i < 16; i++) worst = Math.max(worst, Math.abs(n[i] - m[i])); }
				return `carried light compared ${this.carrySaved.length} tiles, max diff ${worst.toFixed(3)}${worst <= 0.03 ? " MATCH" : " DIFFER"}`;
			}
			case "key": {
				const [mode, key] = a.args.split(/\s+/);
				if (mode === "up") { cl.keyUp(c, key); return "released"; }
				if (mode !== "down" && mode !== "press") return `ERROR bad key mode ${mode}`;
				const cmd = cl.keyDown(c, key);
				if (mode === "press") cl.keyUp(c, key);
				return cmd ? `ran ${cmd}` : "no macro";
			}
			case "goto": {
				const [sel, lim] = a.args.split(/\s+/);
				if (!(mob instanceof DMAtom)) return "no mob";
				const goal = this.resolve(c, mob, sel);
				if (!goal) return `no target for ${sel}`;
				this.walk = { sel, since: this.cur, stuck: 0, last: "" };
				this.walkLimit = Number(lim || 300);
				return `walking to ${this.desc(goal)}`;
			}
			case "spawn": { // spawn /type/path [SEL] [xN] [rR]: `new /type(turf of SEL)` (default: the tile east of the mob), like an admin's Spawn; with xN, N copies on random free tiles within R (default 5) of SEL (default self)
				const toks = a.args.split(/\s+/).filter(Boolean);
				const path = toks[0];
				const nTok = toks.find((x, i) => i > 0 && /^x\d+$/.test(x)), rTok = toks.find((x, i) => i > 0 && /^r\d+$/.test(x));
				const sel = toks.slice(1).find((x) => x !== nTok && x !== rTok);
				const ty = this.vm.tree.getType(path);
				if (!ty) return `ERROR unknown type ${path}`;
				if (!(mob instanceof DMAtom)) return "no mob";
				if (nTok === undefined && rTok === undefined) {
					const at = this.resolve(c, mob, sel || "turf:1,0");
					const t = at instanceof DMAtom ? this.vm.map.outerTurf(at) : null;
					if (!t) return `no target for ${sel || "turf:1,0"}`;
					const o = this.vm.newObject(ty, [t], mob);
					return `spawned ${this.desc(o)}`;
				}
				const n = nTok ? Number(nTok.slice(1)) : 1, r = rTok ? Number(rTok.slice(1)) : 5;
				const at = this.resolve(c, mob, sel || "self");
				const t0 = at instanceof DMAtom ? this.vm.map.outerTurf(at) : null;
				if (!t0) return `no target for ${sel || "self"}`;
				const pool: DMAtom[] = [];
				for (let y = t0.y - r; y <= t0.y + r; y++) for (let x = t0.x - r; x <= t0.x + r; x++) {
					const q = this.vm.map.turfAt(x, y, t0.z);
					if (q && !q.type.path.startsWith("/turf/open/space") && !this.blocked(q)) pool.push(q);
				}
				if (!pool.length) return `no free tile within ${r} of ${t0.x},${t0.y},${t0.z}`;
				const spots: string[] = [];
				let bag: DMAtom[] = [];
				for (let i = 0; i < n; i++) {
					if (!bag.length) bag = pool.slice(); // each free tile gets used once before any gets a second copy
					const q = bag.splice(this.vm.rng.int(0, bag.length - 1), 1)[0];
					this.vm.newObject(ty, [q], mob);
					spots.push(`${q.x},${q.y}`);
				}
				return `spawned ${n} x ${path} within ${r} of ${t0.x},${t0.y},${t0.z} (${pool.length} free tiles) at ${spots.join(" ")}`;
			}
			case "call": { // call SEL PROC [args]: SEL.PROC(args), usr = the mob. Args: numbers, "text", null, or a SEL (as for click); the result is logged
				const toks = a.args.match(/"[^"]*"|\S+/g) ?? [];
				if (toks.length < 2) return "ERROR call needs SEL PROC";
				if (!(mob instanceof DMAtom)) return "no mob";
				const o = this.resolve(c, mob, toks[0]!);
				if (!o) return `no target for ${toks[0]}`;
				const proc = o.type.procs.get(toks[1]!);
				if (!proc) return `ERROR no proc ${toks[1]!} on ${o.type.path}`;
				const args = toks.slice(2).map((x) => x.startsWith('"') ? x.slice(1, -1) : x === "null" ? null : /^-?\d+(\.\d+)?$/.test(x) ? Number(x) : (this.resolve(c, mob, x) ?? x));
				const v = this.vm.call(proc, args as never, o, mob);
				return `called ${toks[1]!} on ${this.desc(o)} -> ${this.show(v)}`;
			}
			case "tp": { // tp SEL: moves the mob onto the tile of SEL, unbuckled
				if (!(mob instanceof DMAtom)) return "no mob";
				const o = this.resolve(c, mob, a.args.trim());
				const t = o instanceof DMAtom ? this.vm.map.outerTurf(o) : null;
				if (!t) return `no target for ${a.args.trim()}`;
				const ch = live(mob.getVar("buckled"));
				if (ch instanceof DMObject) this.vm.call(ch.type.procs.get("unbuckle_mob")!, [mob, 1], ch, mob);
				this.vm.setField(mob, "loc", t);
				const n = this.vm.map.outerTurf(mob);
				return `player now at ${n ? `${n.x},${n.y},${n.z}` : "nullspace"}`;
			}
			case "hand": { // hand /type: a new item in the mob's active hand (as the page's ?setup=hand:)
				const ty = this.vm.tree.getType(a.args.trim());
				if (!ty) return `ERROR unknown type ${a.args.trim()}`;
				if (!(mob instanceof DMAtom)) return "no mob";
				const o = this.vm.newObject(ty, [this.vm.getField(mob, "loc")], mob);
				const ok = this.vm.call(mob.type.procs.get("put_in_hands")!, [o], mob, mob);
				return `${ty.path} put in hands (${String(ok)})`;
			}
			case "explode": { // explode DEV HEAVY LIGHT FLASH [SEL]: explosion(turf of SEL, ..., adminlog, ignorecap=TRUE) like the admin Drop Bomb verb (default SEL: the mob's own turf)
				const [d, h, l, f, sel] = a.args.split(/\s+/);
				if (!(mob instanceof DMAtom)) return "no mob";
				const at = this.resolve(c, mob, sel || "turf:0,0");
				const t = at instanceof DMAtom ? this.vm.map.outerTurf(at) : null;
				if (!t) return `no target for ${sel || "turf:0,0"}`;
				this.vm.callGlobal("explosion", [t, Number(d), Number(h), Number(l), Number(f), 1, 1]);
				return `explosion ${d},${h},${l},${f} at ${t.x},${t.y},${t.z}`;
			}
			case "census": { // census R SEL: counts of turfs / space / machines / lights / structures / items / mobs within R tiles of SEL
				const [r, sel] = a.args.split(/\s+/);
				if (!(mob instanceof DMAtom)) return "no mob";
				const at = this.resolve(c, mob, sel || "turf:0,0");
				const t = at instanceof DMAtom ? this.vm.map.outerTurf(at) : null;
				if (!t) return `no target for ${sel}`;
				const R = Number(r || 7), n: Record<string, number> = { turfs: 0, space: 0, walls: 0, machinery: 0, lights: 0, structures: 0, items: 0, mobs: 0 };
				const ty = (p: string) => this.vm.tree.getType(p)!;
				const [tSpace, tWall, tMach, tLight, tStr, tItem, tMob] = ["/turf/open/space", "/turf/closed/wall", "/obj/machinery", "/obj/machinery/light", "/obj/structure", "/obj/item", "/mob"].map(ty);
				for (let x = t.x - R; x <= t.x + R; x++) for (let y = t.y - R; y <= t.y + R; y++) {
					const q = this.vm.map.turfAt(x, y, t.z); if (!q) continue;
					n.turfs++; if (q.type.isSubtypeOf(tSpace)) n.space++; if (q.type.isSubtypeOf(tWall)) n.walls++;
					for (const o of q.contents) { if (o.type.isSubtypeOf(tLight)) n.lights++; else if (o.type.isSubtypeOf(tMach)) n.machinery++; else if (o.type.isSubtypeOf(tStr)) n.structures++; else if (o.type.isSubtypeOf(tItem)) n.items++; else if (o.type.isSubtypeOf(tMob)) n.mobs++; }
				}
				return `census R=${R} at ${t.x},${t.y},${t.z} ${this.desc(t)}: ${JSON.stringify(n)}`;
			}
			case "powernets": { // powernets: one sorted signature line per powernet (cables by x,y,z,d1-d2, nodes by type@x,y,z) + a hash of all, to compare grids across code versions
				const g = live(this.vm.globals[this.vm.tree.globalNames.indexOf("GLOB")]) as DMObject;
				const items = (v: unknown) => { const l = live(v as never); return l instanceof DMList ? (l.items as unknown[]).map((x) => live(x as never)) : []; };
				const at = (o: unknown) => { const q = o as DMAtom; const t = this.vm.map.outerTurf(q); return t ? `${t.x},${t.y},${t.z}` : "null"; };
				const nets = new Map<unknown, { cables: string[]; nodes: string[] }>();
				const net = (pn: unknown) => { let e = nets.get(pn); if (!e) nets.set(pn, e = { cables: [], nodes: [] }); return e; };
				let nonet = 0;
				for (const cb of items(this.vm.getField(g, "cable_list"))) {
					const pn = live(this.vm.getField(cb as DMObject, "powernet"));
					if (!pn) { nonet++; continue; }
					const e = net(pn);
					e.cables.push(`${at(cb)}/${this.vm.getField(cb as DMObject, "d1")}-${this.vm.getField(cb as DMObject, "d2")}`);
					for (const m of items(this.vm.getField(pn as DMObject, "nodes"))) e.nodes.push(`${(m as DMObject).type.path}@${at(m)}`);
				}
				const lines = [...nets.values()].map((e) => `cables=${e.cables.length} nodes=${e.nodes.length} ${e.cables.sort().join(";")} | ${[...new Set(e.nodes)].sort().join(";")}`).sort();
				return `powernets ${nets.size} nets, ${nonet} cables with no net, hash ${hashText(lines.join("\n"))}; ` + lines.map((l) => l.slice(0, 40)).join(" / ") + "\n[powernets-full] " + lines.join("\n[powernets-full] ");
			}
			case "airdump": { // SSair's active turfs, each with its air (temperature, moles per gas, full precision), sorted, + a hash: compares air across code versions
				const ss = live(this.vm.globals[this.vm.tree.globalNames.indexOf("SSair")]) as DMObject;
				const items = (v: unknown) => { const l = live(v as never); return l instanceof DMList ? (l.items as unknown[]).map((x) => live(x as never)) : []; };
				const lines: string[] = [];
				for (const t of items(this.vm.getField(ss, "active_turfs"))) {
					const q = t as DMAtom, air = live(this.vm.getField(q, "air")) as DMObject | null;
					const gases = air ? live(this.vm.getField(air, "gases")) : null;
					const gs = gases instanceof DMList ? gases.items.map((id) => `${id}=${(this.vm.getIndex(this.vm.getIndex(gases, id), 1))}`).sort().join(",") : "";
					lines.push(`${q.x},${q.y},${q.z} T=${air ? this.vm.getField(air, "temperature") : "null"} ${gs}`);
				}
				lines.sort();
				return `airdump ${lines.length} active turfs, hash ${hashText(lines.join("\n"))}\n[airdump-full] ` + lines.join("\n[airdump-full] ");
			}
			case "gasdump": { // gasdump [FILE]: exact gas state (active turfs, pipelines, a turf sample) as JSON for tools/gas-diff.mjs
				const ss = live(this.vm.globals[this.vm.tree.globalNames.indexOf("SSair")]) as DMObject;
				const items = (v: unknown) => { const l = live(v as never); return l instanceof DMList ? (l.items as unknown[]).map((x) => live(x as never)) : []; };
				const mix = (air: DMObject | null) => {
					if (!air) return null;
					const gases = live(this.vm.getField(air, "gases")), g: Record<string, number> = {};
					if (gases instanceof DMList) for (const id of gases.items) g[String(id)] = Number(this.vm.getIndex(this.vm.getIndex(gases, id), 1));
					const sorted: Record<string, number> = {}; for (const k of Object.keys(g).sort()) sorted[k] = g[k];
					return { T: Number(this.vm.getField(air, "temperature")), gases: sorted };
				};
				const out: { active: Record<string, unknown>; pipelines: Record<string, unknown>; turfs: Record<string, unknown> } = { active: {}, pipelines: {}, turfs: {} };
				for (const t of items(this.vm.getField(ss, "active_turfs"))) {
					const q = t as DMAtom; out.active[`${q.x},${q.y},${q.z}`] = mix(live(this.vm.getField(q, "air")) as DMObject | null);
				}
				const pls: [string, unknown][] = []; // same key (empty pipelines): ordered by content, not by list order
				for (const pn of items(this.vm.getField(ss, "networks"))) {
					const p = pn as DMObject, coords: string[] = [];
					for (const m of items(this.vm.getField(p, "members"))) { const t = this.vm.map.outerTurf(m as DMAtom); coords.push(t ? `${t.x},${t.y},${t.z}` : "null"); }
					coords.sort();
					pls.push([`${coords[0]}#${coords.length}`, { air: mix(live(this.vm.getField(p, "air")) as DMObject | null), other: items(this.vm.getField(p, "other_airs")).map((o) => mix(o as DMObject)) }]);
				}
				pls.sort((x, y) => (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : JSON.stringify(x[1]) < JSON.stringify(y[1]) ? -1 : 1));
				for (const [k, v] of pls) { let key = k, n = 1; while (key in out.pipelines) key = `${k}#${n++}`; out.pipelines[key] = v; }
				let i = 0;
				const tOpen = this.vm.tree.getType("/turf/open")!;
				for (let y = 1; y <= 255; y++) for (let x = 1; x <= 255; x++) {
					const q = this.vm.map.turfAt(x, y, 1); if (!q || !q.type.isSubtypeOf(tOpen)) continue;
					const air = live(this.vm.getField(q, "air")) as DMObject | null; if (!air) continue;
					if (i++ % 3 === 0) out.turfs[`${x},${y},1`] = mix(air);
				}
				const text = JSON.stringify(out), dir = env.GASDUMP_DIR || "build/gasdump", file = `${dir}/${a.args.trim() || "dump"}.json`;
				const fs = typeof process !== "undefined" && process.getBuiltinModule ? process.getBuiltinModule("node:fs") : null;
				if (fs) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(file, text); }
				return `gasdump ${Object.keys(out.active).length} active, ${Object.keys(out.pipelines).length} pipelines, ${Object.keys(out.turfs).length} sampled turfs, hash ${hashText(text)}, file ${fs ? file : "(none: no fs)"}`;
			}
			case "watch": { // watch SEL: with GLIDE_LOG2=1 log that atom's glide_size on every tile it changes
				if (!(mob instanceof DMAtom)) return "no mob";
				const o = this.resolve(c, mob, a.args);
				if (!(o instanceof DMAtom)) return `no target for ${a.args}`;
				this.watched.set(o, "");
				return `watching ${this.desc(o)}`;
			}
			case "say": cl.typeLine(c, `say ${JSON.stringify(a.args)}`); return `said ${JSON.stringify(a.args)}`;
			case "verb": cl.typeLine(c, a.args); return `typed ${JSON.stringify(a.args)}`;
			case "click": {
				const [sel, ...mods] = a.args.split(/\s+/);
				if (!(mob instanceof DMAtom)) return "no mob";
				const o = this.resolve(c, mob, sel);
				if (!o) return `no target for ${sel}`;
				const set = new Map(mods.filter((m) => m.includes("=")).flatMap((m) => m.split(";")).map((kv) => kv.split("=") as [string, string]));
				const p = ["icon-x", "icon-y"].map((k) => `${k}=${set.get(k) ?? 16}`).concat("screen-loc=8:16,8:16");
				for (const m of mods) if (!m.includes("=")) p.push(m === "right" ? "right=1" : `${m}=1`);
				if (!mods.includes("right")) p.push("left=1");
				const t = this.vm.map.outerTurf(o);
				cl.click(c, { object: o, x: t?.x ?? null, y: t?.y ?? null, dbl: false, control: "mapwindow.map", params: p.join(";") });
				return `clicked ${this.desc(o)}${mods.length ? " " + mods.join("+") : ""}`;
			}
			case "drag": {
				const [s1, s2] = a.args.split(/\s+/);
				if (!(mob instanceof DMAtom)) return "no mob";
				const o = this.resolve(c, mob, s1), ov = this.resolve(c, mob, s2);
				if (!o || !ov) return `no target for ${o ? s2 : s1}`;
				const t = this.vm.map.outerTurf(o), t2 = this.vm.map.outerTurf(ov);
				cl.click(c, { object: o, over: ov, x: t?.x ?? null, y: t?.y ?? null, ox: t2?.x ?? null, oy: t2?.y ?? null, dbl: false, control: "mapwindow.map", params: "icon-x=16;icon-y=16;screen-loc=8:16,8:16", proc: "MouseDrop" });
				return `dragged ${this.desc(o)} onto ${this.desc(ov)}`;
			}
			case "topic": {
				const sp = a.args.search(/\s/);
				const sel = sp < 0 ? a.args : a.args.slice(0, sp), rest = sp < 0 ? "" : a.args.slice(sp).trim();
				if (!(mob instanceof DMAtom)) return "no mob";
				const o = this.resolve(c, mob, sel);
				if (!o) return `no target for ${sel}`;
				let bad: string | null = null;
				const text = rest.replace(/@(\S+?)(?=;|$)/g, (_m, s: string) => { const r = this.resolve(c, mob, s); if (!r) { bad = s; return ""; } return refOf(r); });
				if (bad) return `no target for @${bad}`;
				const href = `src=${refOf(o)}${text ? ";" + text : ""}`;
				cl.topic(c, href);
				return `topic ${href} on ${this.desc(o)}`;
			}
			case "probe": {
				if (!(mob instanceof DMAtom)) return "no mob";
				const [sel, vars] = a.args.split(/\s+/);
				const parts = [this.probeMob(mob)];
				if (sel) {
					const o = this.resolve(c, mob, sel);
					parts.push(o ? `${sel}=${this.desc(o)}${vars ? " " + this.vars(o, vars.split(",")) : ""}` : `no target for ${sel}`);
				}
				return parts.join(" | ");
			}
			case "map": { // map [R]: a character map of the R tiles around the mob (default 8), north at the top, rows joined with "/": # wall, + door, . floor, space ' ', m machine, s structure, i item, M mob, @ you
				if (!(mob instanceof DMAtom)) return "no mob";
				const t = this.vm.map.outerTurf(mob);
				if (!t) return "no target (mob in nullspace)";
				const r = Number(a.args || 8), rows: string[] = [];
				for (let y = t.y + r; y >= t.y - r; y--) {
					let row = "";
					for (let x = t.x - r; x <= t.x + r; x++) {
						const q = this.vm.map.turfAt(x, y, t.z);
						if (!q) { row += "?"; continue; }
						const ps = [q, ...q.contents].map((o) => o.type.path);
						row += (x === t.x && y === t.y) ? "@" : ps.some((p) => p.startsWith("/mob/")) ? "M" : ps.some((p) => p.startsWith("/obj/machinery/door")) ? "+" : ps.some((p) => p.startsWith("/obj/machinery")) ? "m" : ps.some((p) => p.startsWith("/obj/structure")) ? "s" : ps.some((p) => p.startsWith("/obj/item")) ? "i" : ps[0].startsWith("/turf/closed") ? "#" : ps[0].startsWith("/turf/open/space") ? " " : ".";
					}
					rows.push(row);
				}
				return `at ${t.x},${t.y},${t.z} (x ${t.x - r}..${t.x + r}, y ${t.y + r} down to ${t.y - r}): ${rows.join("/")}`;
			}
			case "look": { // look [R] [filter-regex]: every non-turf atom within R tiles (default 3), nearest first: type@dx,dy
				if (!(mob instanceof DMAtom)) return "no mob";
				const t = this.vm.map.outerTurf(mob);
				if (!t) return "no target (mob in nullspace)";
				const [rs, f] = a.args.split(/\s+/), r = Number(rs || 3), re = f ? new RegExp(f) : null;
				const rows: string[] = [];
				for (let d = 0; d <= r; d++) for (let y = t.y + d; y >= t.y - d; y--) for (let x = t.x - d; x <= t.x + d; x++) {
					if (Math.max(Math.abs(x - t.x), Math.abs(y - t.y)) !== d) continue;
					const q = this.vm.map.turfAt(x, y, t.z);
					if (!q) continue;
					for (const o of [q, ...q.contents]) if (o !== mob && (!re || re.test(o.type.path))) rows.push(`${o.type.path.replace(/^\/(obj|turf|mob)\//, "$1/")}@${x - t.x},${y - t.y}`);
				}
				return `at ${t.x},${t.y},${t.z}: ${rows.join(" ")}`;
			}
			default: return `ERROR unknown action ${a.verb}`;
		}
	}

	/** One tick of a goto: breadth-first over the open tiles (doors count as open: walking into one opens it) to a tile within 1 of the goal. */
	private walkStep(c: DMObject, tick: number): void {
		const w = this.walk!, mob = live(c.getVar("mob"));
		const end = (why: string) => { this.log(`[script] tick ${tick} world.time ${this.vm.sched.time}: goto ${w.sel} -> ${why} after ${tick - w.since} ticks`); this.walk = null; this.ran++; };
		if (!(mob instanceof DMAtom)) return end("no mob");
		const goal = this.resolve(c, mob, w.sel), from = this.vm.map.outerTurf(mob), gt = goal ? this.vm.map.outerTurf(goal) : null;
		if (!goal || !from || !gt || gt.z !== from.z) { this.missed++; return end("no target, gave up"); }
		const where = `${from.x},${from.y}`;
		if (Math.max(Math.abs(from.x - gt.x), Math.abs(from.y - gt.y)) <= 1 && (goal instanceof DMAtom && goal.kind === Kind.Turf && !this.blocked(gt) ? from === gt : true)) return end(`arrived at ${where}`);
		if (tick - w.since >= this.walkLimit) { this.missed++; return end(`gave up at ${where}`); }
		if (where !== w.last) for (const o of from.contents) if (o.type.path.startsWith("/obj/machinery/door")) this.log(`[script] tick ${tick}: goto ${w.sel} -> in doorway ${o.type.path} ${refOf(o)} at ${where} ${this.vars(o, ["density", "operating", "locked", "welded"])}`);
		if (env.GLIDE_LOG && where !== w.last) this.log(`[glide] world.time ${this.vm.sched.time} ${mob.type.path} at ${where} glide_size=${this.show(mob.getVar("glide_size"))} m_intent=${mob.hasVar("m_intent") ? this.show(mob.getVar("m_intent")) : "-"}`); // step times vs glide_size (GLIDE_LOG=1)
		w.stuck = where === w.last ? w.stuck + 1 : 0;
		w.last = where;
		const open = (t: DMAtom) => !this.blocked(t);
		const key = (t: DMAtom) => `${t.x},${t.y}`;
		const prev = new Map<string, DMAtom>([[key(from), from]]);
		const q: DMAtom[] = [from];
		let found: DMAtom | null = null;
		const exact = goal instanceof DMAtom && goal.kind === Kind.Turf && open(gt); // a wall or a closed door tile: get next to it
		const reached = (t: DMAtom) => (exact ? t === gt : Math.max(Math.abs(t.x - gt.x), Math.abs(t.y - gt.y)) <= 1);
		for (let i = 0; i < q.length && !found; i++) {
			const t = q[i];
			for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
				const n = this.vm.map.turfAt(t.x + dx, t.y + dy, t.z);
				if (!n || prev.has(key(n)) || Math.abs(n.x - from.x) > 40 || Math.abs(n.y - from.y) > 40 || (!open(n) && n !== gt)) continue;
				prev.set(key(n), t);
				if (reached(n)) { found = n; break; }
				q.push(n);
			}
		}
		if (!found) { if (w.stuck > 20) { this.missed++; end(`no path from ${where}`); } return; }
		let step = found;
		while (prev.get(key(step)) !== from) step = prev.get(key(step))!;
		const dir = step.y > from.y ? "NORTH" : step.y < from.y ? "SOUTH" : step.x > from.x ? "EAST" : "WEST";
		const cmd = this.vm.clients.keyDown(c, dir);
		this.vm.clients.keyUp(c, dir);
		if (tick === w.since + 1 || w.stuck === 10) this.log(`[script] tick ${tick}: goto ${w.sel} step ${dir} from ${where} -> ${cmd || "no macro"}${w.stuck ? ` (stuck ${w.stuck})` : ""}`);
	}

	/** A tile you can't walk onto: a wall, or a dense object that isn't a mob or a door (doors open when bumped). */
	private blocked(t: DMAtom): boolean {
		if (t.type.path.startsWith("/turf/closed") || t.getVar("density")) return true;
		return t.contents.some((o) => !!o.getVar("density") && !o.type.path.startsWith("/mob/") && !o.type.path.startsWith("/obj/machinery/door"));
	}

	private desc(o: DMObject): string {
		const t = o instanceof DMAtom ? this.vm.map.outerTurf(o) : null;
		const l = o instanceof DMAtom ? o.loc : null;
		return `${o.type.path} "${stringify(o.getVar("name"))}" ${refOf(o)}${t ? ` at ${t.x},${t.y},${t.z}` : ""}${l ? ` in ${l.type.path}` : ""}`;
	}
	private show(v: unknown): string {
		const l = live(v as never) as unknown;
		if (l instanceof DMObject) return l.type.path;
		if (l instanceof DMList) return l.len <= 6 ? `[${l.items.map((i) => { const x = live(i as never) as unknown; return x instanceof DMObject ? x.type.path : JSON.stringify(x); }).join("|")}]` : `list(${l.len})`;
		return JSON.stringify(l);
	}
	private vars(o: DMObject, names: string[]): string {
		return names.filter((n) => o.hasVar(n)).map((n) => `${n}=${this.show(o.getVar(n))}`).join(" ");
	}
	private probeMob(m: DMAtom): string {
		const t = this.vm.map.outerTurf(m);
		const held = live(m.getVar("held_items")) as unknown;
		const hands = held instanceof DMList ? held.items.map((i) => { const h = live(i); return h instanceof DMObject ? h.type.path : "-"; }).join(",") : "?";
		const cuffed = m.hasVar("handcuffed") ? live(m.getVar("handcuffed")) : null;
		return `mob ${m.type.path} at ${t ? `${t.x},${t.y},${t.z}` : "nullspace"} in ${m.loc ? m.loc.type.path : "null"} hands[${hands}] ${this.vars(m, ["a_intent", "stat", "health", "stunned", "weakened", "m_intent", "in_throw_mode", "buckled", "pulling", "status_effects", "lying"])}${cuffed instanceof DMObject ? ` handcuffed=${cuffed.type.path}` : ""}`;
	}

	// ---- selectors ----------------------------------------------------------------------------------------------------

	resolve(c: DMObject, mob: DMAtom, sel: string): DMObject | null {
		const m = /^([^.[]+)((?:\.[A-Za-z_]\w*|\[\d+\]|\["[^"\]]*"\])*)$/.exec(sel);
		if (!m) return null;
		let cur: unknown = this.base(c, mob, m[1]);
		for (const acc of m[2].match(/\.[A-Za-z_]\w*|\[\d+\]|\["[^"\]]*"\]/g) ?? []) {
			cur = live(cur as never);
			if (acc[0] === ".") { if (!(cur instanceof DMObject) || !cur.hasVar(acc.slice(1))) return null; cur = cur.getVar(acc.slice(1)); }
			else if (!(cur instanceof DMList)) return null;
			else cur = acc[1] === '"' ? cur.get(acc.slice(2, -2)) : cur.items[Number(acc.slice(1, -1))]; // ["key"]: an associative list's value
		}
		const r = live(cur as never) as unknown;
		return r instanceof DMObject ? r : null;
	}

	private base(c: DMObject, mob: DMAtom, b: string): DMObject | null {
		const colon = b.indexOf(":");
		const kind = colon < 0 ? b : b.slice(0, colon), arg = colon < 0 ? "" : b.slice(colon + 1);
		const pick = (list: Iterable<DMAtom>, pathArg: string): DMAtom | null => {
			const m = /^([^@#]+)(?:@(\d+))?(?:#(\d+))?$/.exec(pathArg);
			if (!m) return null;
			const ty = this.vm.tree.getType(m[1]);
			if (!ty) return null;
			let n = Number(m[3] ?? 0);
			for (const a of list) if (a !== mob && a.type.isSubtypeOf(ty) && n-- === 0) return a;
			return null;
		};
		switch (kind) {
			case "self": return mob;
			case "client": return c;
			case "held": return this.hand(mob, Number(live(mob.getVar("active_hand_index")) ?? 1));
			case "hand": return this.hand(mob, Number(arg));
			case "turf": {
				const t = this.vm.map.outerTurf(mob), [dx, dy] = arg.split(",").map(Number);
				return t ? this.vm.map.turfAt(t.x + dx, t.y + dy, t.z) : null;
			}
			case "at": { const [x, y, z] = arg.split(",").map(Number); return this.vm.map.turfAt(x, y, z); } // an absolute turf
			case "glob": { const gi = this.vm.tree.globalNames.indexOf(arg); return gi < 0 ? null : live(this.vm.globals[gi] as never) as unknown as DMAtom; } // a global var, e.g. glob:SSshuttle.arrivals
			case "inv": return pick(this.inside(mob), arg);
			case "near": {
				const t = this.vm.map.outerTurf(mob);
				if (!t) return null;
				const r = Number(/@(\d+)/.exec(arg)?.[1] ?? 4);
				const turfs: DMAtom[] = [];
				for (let x = t.x - r; x <= t.x + r; x++) for (let y = t.y - r; y <= t.y + r; y++) { const q = this.vm.map.turfAt(x, y, t.z); if (q) turfs.push(q); }
				const d = (q: DMAtom) => Math.max(Math.abs(q.x - t.x), Math.abs(q.y - t.y)) * 1000 + (q.x - t.x) ** 2 + (q.y - t.y) ** 2;
				turfs.sort((p, q) => d(p) - d(q) || p.y - q.y || p.x - q.x);
				const all = function* () { for (const q of turfs) { yield q; yield* q.contents; } };
				return pick(all(), arg);
			}
			default: return null;
		}
	}

	private hand(mob: DMAtom, n: number): DMObject | null {
		const l = live(mob.getVar("held_items")) as unknown;
		const h = l instanceof DMList ? live(l.items[n - 1] as never) as unknown : null;
		return h instanceof DMObject ? h : null;
	}

	private *inside(a: DMAtom): Generator<DMAtom> {
		for (const m of a.contents) { yield m; yield* this.inside(m); }
	}
}

