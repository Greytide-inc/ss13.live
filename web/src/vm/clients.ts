// Players. The host connects a client with a key; the VM does what BYOND does on
// connect: world/IsBanned(), then a /client with key/ckey/address/..., then client/New(), whose
// default (DMStandard's DM code) finds or makes a world.mob and sets client.mob, which runs Login().
//
// Everything the game sends a player (text with <<, browse(), browse_rsc(), output(), link(),
// sounds, winset(), ...) is recorded as plain data in `outbox`. That list becomes the worker->page
// message stream later, so it only ever holds JSON-able values.
//
// What BYOND does here was read from the DM reference (help/ref/info.html in the Windows BYOND
// install) and OpenDream's DreamConnection; items marked "guess" were not measured.

import type { NativeProc, PromptReq, VM } from "./interpreter.js";
import { stripMarkers } from "./markers.js";
import { pin } from "./gc.js";
import { fromRef } from "./refs.js";
import { DMList, DMObject, ScreenList, live } from "./objects.js";
import { DMProc, DMType, Resource } from "./objtree.js";
import { ProcAttr } from "./json.js";
import { cloneSkin, parseSkin, parseWinsetParams, type Skin } from "./skin.js";
import { urlEncode } from "./natives-text.js";
import { DMRuntimeError, NotImplementedError, isTruthy, stringify, type Value } from "./value.js";
import { DMAtom, Kind, normalizeViewSize, viewHalfSize } from "./world.js";
import { ArgType, nextToken, parseArgs, pickByName } from "./command-line.js";

/** One message for a player's client. `client` is its ckey. */
export interface OutMsg {
	client: string;
	type: string;
	[k: string]: unknown;
}

/** What a fresh DreamSeeker 511 on this machine reports. address/computer_id: guesses, see connect(). */
export interface ConnectOptions {
	address?: string;
	computerId?: string;
	byondVersion?: number;
	byondBuild?: number;
}

/** VerbSrc (DMCompiler): the `set src in view()/oview()/range()/orange()/world/usr` forms, where the source is named on the command line. */
const TYPED = "\u0001"; // queue entries starting with it came from the input box
const DIAG = "\u0002"; // queue entries starting with it are a diagonal step made by mergeMoves: DIAG + the direction number

const STRAIGHT: Record<string, number> = { ".moveup": 1, ".movedown": 2, ".moveright": 4, ".moveleft": 8 }; // tg's WASD/arrow verbs -> NORTH/SOUTH/EAST/WEST

/**
 * diagonal walking. Of the commands one client runs this tick, the straight-step ones (`.moveup` ...) are combined: opposite
 * ones cancel, and one vertical plus one horizontal become a single diagonal step (DIAG + dir), so holding W+D walks NORTHEAST
 * instead of alternating. Everything else keeps its order. Same array back when fewer than two straight steps are present.
 */
export function mergeMoves(cmds: string[]): string[] {
	let n = 0, dirs = 0;
	for (const c of cmds) if (c in STRAIGHT) { n++; dirs |= STRAIGHT[c]; }
	if (n < 2) return cmds;
	let v = dirs & 3, h = dirs & 12;
	if (v === 3) v = 0;
	if (h === 12) h = 0;
	const d = v | h;
	const one = d && !(v && h) ? Object.keys(STRAIGHT).find((k) => STRAIGHT[k] === d)! : "";
	const out: string[] = [];
	let placed = false;
	for (const c of cmds) {
		if (!(c in STRAIGHT)) { out.push(c); continue; }
		if (placed) continue;
		placed = true;
		if (v && h) out.push(DIAG + d); else if (one) out.push(one);
	}
	return out;
}
const IN_KINDS = new Set([1, 3, 5, 7, 9, 11]);
const verbDef = (p: DMProc, pick: (q: DMProc) => unknown): DMProc | null => { for (let q: DMProc | null = p; q; q = q.superProc) if (pick(q) !== undefined) return q; return null; };
const verbSrc = (p: DMProc): number | undefined => verbDef(p, (q) => q.verb?.src)?.verb!.src;
/**
 * The proc a verb command runs: the `verbs` list holds the verb's first definition, but BYOND calls the most
 * derived override of it (tg's `/client/Northwest()` overrides the built-in `.northwest` verb of the same name).
 */
export const overrideOf = (src: DMObject, verb: DMProc): DMProc => {
	const top = src.type.procs.get(verb.name);
	if (!top || top === verb) return verb;
	for (let q: DMProc | null = top.superProc; q; q = q.superProc) if (q === verb) return top;
	return verb;
};

interface PopupVerb { name: string; owner: DMObject; proc: DMProc; pre: Value[] }
interface PopupEntry { atom: DMObject; name: string; verbs: PopupVerb[] }

/** A verb's command name: `set name` (from the first definition that has one), else the proc name; lowercase, spaces as dashes. */
const commandNames = new WeakMap<DMProc, string>();
const verbCommand = (p: DMProc): string => {
	let n = commandNames.get(p);
	if (n === undefined) commandNames.set(p, (n = ((verbDef(p, (q) => q.verb?.name)?.verb!.name ?? p.name) as string).toLowerCase().replace(/ /g, "-")));
	return n;
};

const READ_ONLY = new Set(["key", "ckey", "address", "computer_id", "connection", "byond_version", "byond_build"]);

/** A value as plain JSON data (objects by type and name, files by path). */
export function plain(v: Value, depth = 0): unknown {
	v = live(v);
	if (v === null || typeof v === "number" || typeof v === "string") return v;
	if (v instanceof Resource) return { file: v.path };
	if (v instanceof DMType) return { path: v.path };
	if (v instanceof DMList) return depth > 2 ? "/list" : v.items.map((x) => plain(x, depth + 1));
	if (v instanceof DMObject) return { object: v.type.path, name: stringify(v) };
	return String(v);
}

/** A mouse click from the page. */
export interface ClickReq {
	/** What was clicked (a map atom or a screen object), null if the page had no object for it. */
	object: DMObject | null;
	/** The map tile under the pointer, or null. */
	x: number | null;
	y: number | null;
	dbl: boolean;
	control: string;
	params: string;
	/** Click (default), DblClick is dbl; or MouseDown / MouseUp / MouseDrop. */
	proc?: "MouseDown" | "MouseUp" | "MouseDrop" | "MouseDrag" | "MouseMove" | "MouseEntered" | "MouseExited" | "MouseWheel";
	/** a popup-menu verb: run this at the click's turn instead of a click proc. */
	run?: () => void;
	/** MouseWheel: delta_x, delta_y (positive = right/up). */
	dx?: number;
	dy?: number;
	/** MouseDrop: what it was dropped on (null = empty space) and the tile there. */
	over?: DMObject | null;
	ox?: number | null;
	oy?: number | null;
	/** called once the click has run (predicted pick-up: the answer then carries the clicked item's look). */
	after?: () => void;
	/** set by click(): the steps (Clients.step) the page sent before this click; it runs once those are done, so a click on an item just
	 *  reached runs after the step that reached it. */
	afterSteps?: number;
}

/** Which dialog an input type gets: a list box if there are choices, else by type (null = no picker: icon/file/sound/color). Default is text. */
export function inputKind(types: number, hasList: boolean): "list" | "num" | "message" | "text" | "color" | null {
	const kinds = types & ~ArgType.Null;
	const textual = (kinds & (ArgType.Text | ArgType.Message | ArgType.CommandText)) !== 0;
	if (hasList) return "list";
	if ((kinds & ArgType.Num) && !textual) return "num";
	if (kinds & ArgType.Message) return "message";
	if (textual || kinds === 0) return "text";
	if (kinds === ArgType.Color) return "color"; // the page's colour picker; answers "#rrggbb"
	return (kinds & ~(ArgType.Color | ArgType.File | ArgType.Sound | ArgType.Icon)) === 0 ? null : "text";
}

export class Clients {
	readonly list: DMObject[] = [];
	readonly outbox: OutMsg[] = [];
	/** Called for each message as it is recorded (the worker will post it to the page). */
	onMessage: ((m: OutMsg) => void) | null = null;
	private skin: Skin | null = null;
	private readonly skins = new WeakMap<DMObject, Skin>();
	private readonly clientType: DMType | null;
	private readonly imageType: DMType | null;
	private readonly soundType: DMType | null;

	constructor(private readonly vm: VM) {
		this.clientType = vm.tree.getType("/client") ?? null;
		this.imageType = vm.tree.getType("/image") ?? null;
		this.soundType = vm.tree.getType("/sound") ?? null;
		const ct = this.clientType;
		if (ct) {
			const hooks = {
				get: () => undefined,
				set: (o: DMObject, name: string, v: Value) => this.setClientVar(o, name, v),
				index: () => { throw new DMRuntimeError("bad index"); },
				setIndex: () => { throw new DMRuntimeError("bad index"); },
				output: (o: DMObject, v: Value) => this.deliver(o, v),
				input: (): Value => { throw new NotImplementedError(">> from a client"); },
			};
			for (const t of vm.tree.types) if (t.isSubtypeOf(ct)) {
				t.special = hooks;
				t.textVar = "key"; // "[client]" is its key (BYOND; guess for a null key)
			}
		}
		this.installNatives();
		this.statNatives();
	}

	setSkin(dmfText: string): void {
		this.skin = parseSkin(dmfText);
	}

	// ---- connecting --------------------------------------------------------------------------

	/**
	 * Connects a player with this key, as DreamDaemon does when DreamSeeker joins: world/IsBanned
	 * (key, address, computer_id), then client/New(). Returns the client, or null if refused.
	 * Defaults: a DreamSeeker 511.1385 on the same machine as the server (address "127.0.0.1", so tg
	 * makes it a localhost admin); computer_id is a made-up 10-digit id (guess), a different one per player.
	 */
	connect(key: string, opts: ConnectOptions = {}): DMObject | null {
		const vm = this.vm;
		if (!this.clientType) throw new Error("no /client type");
		const ckey = ckeyOf(key);
		const address = opts.address ?? "127.0.0.1";
		// Each player its own id (tg's client/New warns "logged in already with another key" when two clients share one): the first
		// client keeps the fixed one, later ones get a 10-digit id made from the ckey (same name, same id).
		const cid = opts.computerId ?? (this.list.length ? String(1e9 + ([...ckey].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % 9e9)) : "1234567890");
		const world = vm.world;
		const banned = world?.type.procs.get("IsBanned");
		if (world && banned && !banned.isNative) {
			const r = vm.call(banned, [key, address, cid], world);
			if (isTruthy(r)) {
				this.send(ckey, { type: "refused", reason: plain(r) });
				return null;
			}
		}
		const c = vm.allocObject(this.clientType, true); // pinned: a connected client is never garbage
		c.setVar("key", key);
		c.setVar("ckey", ckey);
		c.setVar("address", address);
		c.setVar("computer_id", cid);
		c.setVar("connection", "seeker");
		c.setVar("byond_version", opts.byondVersion ?? 511);
		c.setVar("byond_build", opts.byondBuild ?? 1385);
		// Measured-by-docs: client.view starts as world.view.
		if (world) c.setVar("view", vm.getField(world, "view"));
		if (this.skin) this.skins.set(c, cloneSkin(this.skin));
		this.list.push(c);
		this.send(ckey, { type: "connect", key });
		if (c.type.initProc) vm.call(c.type.initProc, [], c);
		const newProc = c.type.procs.get("New");
		const r = newProc ? vm.call(newProc, [null], c) : null;
		// client/New returning null refuses the connection. A sleeping New returns its `.` so far
		// (tg's sets `. = ..()`, the mob, before its first sleep).
		if (r === null && !c.getVar("mob")) {
			this.disconnect(c);
			return null;
		}
		return c;
	}

	/**
	 * A link click (`byond://?href`): client.Topic(href, params2list(href), hsrc) with usr = the
	 * client's mob, where hsrc is the object `src=` names (DM reference, client/Topic). Returns
	 * what Topic returned (or its `.` so far if it slept).
	 */
	topic(c: DMObject, href: string): Value {
		const vm = this.vm;
		const hrefList = vm.callGlobal("params2list", [href]);
		const s = hrefList instanceof DMList ? hrefList.get("src") : null;
		// ponytail: refs only; BYOND's locate() also finds a tag here. Add when a Topic link uses one.
		const r = typeof s === "string" ? fromRef(s) : null;
		// ps-client: a datum, atom or client, never a list (no Topic: a runtime) or the world (world/Topic is for server links, not players)
		const hsrc = r instanceof DMObject && r !== vm.world ? r : null;
		const proc = c.type.procs.get("Topic");
		if (!proc) return null;
		return this.asCommand(() => vm.call(proc, [href, hrefList, hsrc], c, live(c.getVar("mob"))));
	}

	/** A player's connection closed: as BYOND, the client is deleted (its Del() runs: tg's takes it off GLOB.clients, directory, admins). */
	drop(c: DMObject): void {
		if (!this.list.includes(c)) return;
		const d = c.type.procs.get("Del");
		try {
			if (d && !d.isNative) this.vm.call(d, [], c);
		} finally {
			this.vm.markDeleted(c); // calls disconnect
		}
	}

	/** Takes a client off the list; its mob loses it (keeps its key, as BYOND's) and runs Logout() (tg's takes it off GLOB.player_list). */
	disconnect(c: DMObject): void {
		const i = this.list.indexOf(c);
		if (i < 0) return;
		this.list.splice(i, 1);
		const m = live(c.getVar("mob"));
		if (m instanceof DMObject && m.getVar("client") === c) {
			m.setVar("client", null);
			const lo = m.type.procs.get("Logout");
			if (lo && !lo.isNative && !m.deleted) this.vm.call(lo, [], m, m);
		}
		this.send(ckeyText(c), { type: "disconnect" });
	}

	/** The client a mob or client value means, or null. */
	clientOf(v: Value): DMObject | null {
		v = live(v);
		if (!(v instanceof DMObject)) return null;
		if (v.type.special && this.clientType && v.type.isSubtypeOf(this.clientType)) return this.list.includes(v) ? v : null;
		if (v instanceof DMAtom && v.kind === Kind.Mob) {
			const c = live(v.getVar("client"));
			return c instanceof DMObject ? c : null;
		}
		return null;
	}

	/** Every client a `<<`/browse receiver reaches: the world is everyone, a list is its mobs/clients. */
	private receivers(target: Value): DMObject[] {
		target = live(target);
		if (target !== null && target === this.vm.world) return this.list.slice();
		if (target instanceof DMList) {
			const out: DMObject[] = [];
			for (const x of target.items) {
				const c = this.clientOf(x);
				if (c) out.push(c);
			}
			return out;
		}
		const c = this.clientOf(target);
		return c ? [c] : [];
	}

	// ---- client and mob vars -----------------------------------------------------------------

	private setClientVar(c: DMObject, name: string, v: Value): boolean {
		if (name === "mob") {
			v = live(v);
			if (v !== null && !(v instanceof DMAtom && v.kind === Kind.Mob)) return true; // guess: ignored
			this.setMob(c, v as DMAtom | null);
			return true;
		}
		if (READ_ONLY.has(name)) return true; // guess: BYOND ignores writes to these
		if (name === "view") { c.setVar("view", normalizeViewSize(v)); return true; } // "15x15" reads back as 7, "19x15" stays text
		if (name === "screen" || name === "images") {
			// These lists belong to the client: assigning copies the items in (guess).
			const l = name === "screen" ? new ScreenList() : new DMList();
			v = live(v);
			if (v instanceof DMList) for (const x of v.items) l.add(live(x));
			else if (v !== null) l.add(v);
			c.setVar(name, l);
			return true;
		}
		return false;
	}

	/**
	 * client.mob = M (also reached by M.key = key). The old mob loses the client and its key, M gets
	 * both, the eye and stat panel follow M, then old.Logout() and M.Login() run (usr = that mob).
	 * Docs: "Any other mob with the same key will lose it". Guess: eye/statobj reset here, and
	 * Logout before Login.
	 */
	setMob(c: DMObject, m: DMAtom | null): void {
		const vm = this.vm;
		const old = live(c.getVar("mob"));
		if (old === m) return;
		if (m) {
			const other = live(m.getVar("client"));
			if (other instanceof DMObject && other !== c) {
				other.setVar("mob", null);
				this.send(ckeyText(other), { type: "mob", mob: null });
			}
		}
		if (old instanceof DMAtom) {
			old.setVar("client", null);
			old.setVar("key", null);
			old.setVar("ckey", null);
		}
		c.setVar("mob", m);
		if (m) {
			m.setVar("client", c);
			m.setVar("key", c.getVar("key"));
			m.setVar("ckey", c.getVar("ckey"));
			c.setVar("eye", m);
			c.setVar("statobj", m);
		}
		this.send(ckeyText(c), { type: "mob", mob: m ? plain(m) : null });
		if (old instanceof DMAtom && !old.deleted) {
			const lo = old.type.procs.get("Logout");
			if (lo && !lo.isNative) vm.call(lo, [], old, old);
		}
		if (m && !m.deleted) {
			const li = m.type.procs.get("Login");
			if (li && !li.isNative) vm.call(li, [], m, m);
		}
	}

	/** mob.key = k / mob.ckey = k: the client with that key moves to this mob. False: store it normally. */
	setMobKey(m: DMAtom, name: string, v: Value): boolean {
		if (this.list.length === 0 || typeof v !== "string") return false;
		const ck = ckeyOf(v);
		const c = this.list.find((x) => x.getVar("ckey") === ck);
		if (!c) return false;
		if (live(c.getVar("mob")) !== m) this.setMob(c, m);
		return true;
	}

	// ---- messages ----------------------------------------------------------------------------

	send(ckey: string, m: { type: string; [k: string]: unknown }): void {
		const msg = { client: ckey, ...m } as OutMsg;
		this.outbox.push(msg);
		this.onMessage?.(msg);
	}

	/** `client << v`. */
	deliver(c: DMObject, v: Value): void {
		v = live(v);
		const ck = ckeyText(c);
		if (v instanceof DMObject && this.soundType && v.type.isSubtypeOf(this.soundType)) this.send(ck, { type: "sound", ...soundData(v, this.vm.vfs) });
		else if (v instanceof Resource) this.send(ck, { type: "sound", file: this.vm.vfs.resolve(v.path) }); // `<< 'x.ogg'` plays it
		// Unverified (no client measured): \proper / \improper markers aren't shown, as in world.log.
		else this.send(ck, { type: "text", text: stripMarkers(stringify(v)), ...(v instanceof DMObject ? { value: plain(v) } : {}) });
	}

	/** `target << v` where target is the world, a mob or a list (clients go through their hooks). */
	output(target: Value, v: Value): void {
		for (const c of this.receivers(target)) this.deliver(c, v);
	}

	/** Popup windows browse() made (so winexists sees them and onclose()'s winset has a control to hold on-close). */
	private popups = new WeakSet<object>();

	browse(target: Value, body: Value, options: Value): void {
		const cs = this.receivers(target);
		if (cs.length === 0) return;
		const b = live(body);
		const html = b === null ? { html: null } : b instanceof Resource ? { file: b.path } : { html: stripMarkers(stringify(b)) }; // \proper / \improper markers aren't shown (as in chat; else the PDA showed "ÿValue-PAK")
		const opts = options === null ? null : stringify(options);
		const win = (opts && /(?:^|;)\s*window\s*=\s*([^;]*)/.exec(opts)?.[1]?.trim()) || "default"; // no window=: BYOND's default browser pane (guess: a popup named "default")
		for (const c of cs) {
			const skin = this.skins.get(c);
			const embedded = this.control(skin, win, false)?.type === "BROWSER"; // a browser control in the skin (goonchat's, asset_cache_browser): not a popup
			const ctl = skin && !embedded && (b === null ? skin.controls.get(win) : this.control(skin, win, true));
			if (ctl && b !== null && !ctl.type) { ctl.type = "WINDOW"; this.popups.add(ctl); }
			if (ctl && b === null && this.popups.has(ctl)) skin!.controls.delete(win);
			this.send(ckeyText(c), { type: "browse", ...html, window: win, options: opts, embedded });
			// send_asset's arrival check: the real client loaded the page, which followed ?asset_cache_confirm_arrival=JOB.
			// Answer it at the start of the next tick (runInput), once per browse, never from inside browse() itself.
			if (embedded && win === "asset_cache_browser" && "html" in html && html.html) {
				const m = /asset_cache_confirm_arrival=([^"'<>&\s]+)/.exec(html.html);
				if (m) this.assetConfirms.push({ c, job: m[1] });
			}
		}
	}

	/** The player closed popup `name` with its close button: BYOND runs the window's on-close command (onclose() sets it). */
	closeWindow(c: DMObject, name: string): void {
		const skin = this.skins.get(c), ctl = skin?.controls.get(name);
		if (!ctl || !this.popups.has(ctl)) return;
		skin!.controls.delete(name);
		const cmd = ctl.params.get("on-close");
		if (cmd) this.typeLine(c, cmd);
	}

	/** Runs a player's verb/topic: until it first sleeps, the tick counts as busy (scheduler.inCommand). */
	private asCommand<T>(fn: () => T): T {
		const sched = this.vm.sched, was = sched.inCommand;
		sched.inCommand = true;
		try { return fn(); } finally { sched.inCommand = was; }
	}

	browseRsc(target: Value, file: Value, name: Value): void {
		const c = this.clientOf(target);
		if (!c) return;
		let f = live(file);
		// a runtime /icon (tg's character preview) is cached like fcopy_rsc does; the page gets its rsc/ path and asks for the PNG.
		if (f instanceof DMObject) f = live(this.vm.natives.get("/proc/fcopy_rsc")!(this.vm, [f], null, null));
		this.send(ckeyText(c), { type: "browse_rsc", file: f instanceof Resource ? f.path : plain(f), name: name === null ? null : stringify(name) });
	}

	/** Windows made by winclone() (html_interface's "browser_<ref>"): their browser control is drawn as a popup, unlike the skin's own browsers. */
	private clones = new WeakSet<object>();

	outputControl(target: Value, msg: Value, control: Value): void {
		const ctlName = stringify(control);
		for (const c of this.receivers(target)) {
			// output(html, "browser_X.browser") on a cloned window's browser control shows the html in that window, as a popup.
			const skin = this.skins.get(c), dot = ctlName.lastIndexOf("."), win = dot > 0 && !ctlName.includes(":") ? this.control(skin, ctlName.slice(0, dot), false) : undefined;
			if (win && this.clones.has(win) && this.control(skin, ctlName, false)?.type.toUpperCase() === "BROWSER") {
				const size = win.params.get("size"), title = win.params.get("title");
				this.send(ckeyText(c), { type: "browse", html: stripMarkers(stringify(msg)), window: win.id, options: `${size ? `size=${size};` : ""}${title ? `title=${title};` : ""}`, embedded: false });
			} else this.send(ckeyText(c), { type: "output", control: ctlName, text: stripMarkers(stringify(msg)) });
		}
	}

	link(target: Value, url: Value): void {
		const c = this.clientOf(target);
		if (c && typeof url === "string" && url.trim()) this.send(ckeyText(c), { type: "link", url });
	}

	ftp(target: Value, file: Value, name: Value): void {
		const c = this.clientOf(target);
		if (c) this.send(ckeyText(c), { type: "ftp", file: plain(file), name: plain(name) });
	}

	// ---- keyboard: macros and client commands ---------------------------------------------
	//
	// The page sends key presses and releases (BYOND key names: "NORTH", "W", "TAB", with "CTRL+",
	// "SHIFT+", "ALT+" in front). As DreamSeeker does, the key is looked up in the client's active
	// macro set (the skin's mainwindow.macro, which tg winsets at login and TAB toggles) and the
	// macro's command runs. A "+REP" macro repeats while the key is held; a "+UP" one runs on release.
	// Commands run at the start of the next tick (runInput), with usr = the client's mob.
	// Movement is plain tg code from there: `.moveup` is tg's /client/verb/moveup -> client/Move(),
	// which checks move_delay, buckling (relaymove), and so on.
	// Guesses: repeats fire once per tick (DreamSeeker's own rate wasn't measured; tg's move_delay
	// is what paces walking either way); a key with no exact modifier match does nothing.

	/** Presses a key; returns what it ran, for the host's log ("" if no macro matched). */
	keyDown(c: DMObject, name: string): string {
		const k = parseKey(name);
		const st = this.inputState(c);
		if (st.held.has(k.key)) return ""; // already down (the page's own autorepeat)
		if (st.held.size >= MAX_HELD || st.queue.length + st.keyWait.length >= MAX_QUEUE) return ""; // ps-security: more than a keyboard can hold / a flood
		const press = this.findMacro(c, k.mods, k.key, false);
		const up = this.findMacro(c, k.mods, k.key, true);
		st.held.set(k.key, { repeat: press?.rep ? press.command : null, fresh: true, up: up?.command ?? null });
		// a press runs after the steps the page sent before it, as a click does: the drop key drops where the page drew you
		if (press) { if (st.steps.length || st.keyWait.length) st.keyWait.push({ cmd: press.command, after: st.stepsDone + st.steps.length }); else st.queue.push(press.command); }
		return press ? press.command : "";
	}

	keyUp(c: DMObject, name: string): void {
		const st = this.inputState(c);
		const k = parseKey(name).key;
		const h = st.held.get(k);
		st.held.delete(k);
		if (h?.up) st.queue.push(h.up);
	}

	/** one step the page asked for (a direction, diagonals too), from a page that predicts movement and so sends steps, not
	 *  held direction keys: a released key can't add an old-direction step the page never drew. It is taken by runInput as soon as client/Move
	 *  would take it (move_delay passed); one that waited STEP_WAIT ds is dropped. At most eight wait (the page's QUEUE_MAX): it sends at the walking pace, so more wait only after a stall. */
	step(c: DMObject, dir: number): void {
		const st = this.inputState(c);
		st.predicts = true;
		if (st.steps.length < 8) st.steps.push({ dir, at: -1 }); else st.stepsDone++;
	}
	/** True once the client's page has sent a step (it predicts movement): its view is sent with a wider ring (client-view.ts clientSeen). */
	predicts(c: DMObject): boolean { return this.input.get(c)?.predicts ?? false; }
	/** How many step() calls are finished (taken, or dropped): the view tells the page, which counts what it sent. */
	stepsDone(c: DMObject): number { return this.input.get(c)?.stepsDone ?? 0; }

	/** A line typed into the input box: runs at the next tick like a macro's command. */
	typeLine(c: DMObject, text: string): void {
		const q = this.inputState(c).queue;
		if (q.length < MAX_QUEUE) q.push(TYPED + text); // ps-security: a flood between two ticks is dropped
	}

	/** Pending asset_cache_confirm_arrival answers (queued by browse(), sent by runInput). */
	assetConfirms: { c: DMObject; job: string }[] = [];

	/** Runs every client's queued commands and held-key repeats. The host calls it before each tick. */
	runInput(): void {
		this.runAssetConfirms();
		for (const c of this.list) {
			this.statTick(c);
			const st = this.input.get(c);
			if (!st) continue;
			let cmds = st.queue.splice(0);
			for (const h of st.held.values()) {
				if (h.repeat && !h.fresh) cmds.push(h.repeat);
				h.fresh = false;
			}
			if (cmds.length > 1) cmds = mergeMoves(cmds);
			for (const cmd of cmds) { if (cmd[0] === DIAG) this.diagStep(c, +cmd.slice(1)); else if (cmd[0] === TYPED) this.command(c, cmd.slice(1), true); else this.command(c, cmd); }
			const s0 = st.steps[0], now = this.vm.sched.time;
			if (s0) {
				if (s0.at < 0) s0.at = now;
				const md = c.getVar("move_delay");
				const mw = moverWait(c, now);
				if ((typeof md !== "number" || now >= md) && !mw) { st.steps.shift(); st.stepsDone++; this.diagStep(c, s0.dir); }
				else if (now - s0.at > (mw ? MOVER_WAIT : STEP_WAIT)) { st.steps.shift(); st.stepsDone++; }
			}
			while (st.keyWait.length && st.keyWait[0].after <= st.stepsDone) this.command(c, st.keyWait.shift()!.cmd);
			this.runReady(c, st);
		}
	}
	/** Runs the queued clicks in order, up to one waiting for a step the page sent before it. */
	private runReady(c: DMObject, st: { clicks: ClickReq[]; stepsDone: number }): void {
		let n = 0;
		while (n < st.clicks.length && (st.clicks[n].afterSteps ?? 0) <= st.stepsDone) n++;
		for (const q of st.clicks.splice(0, n)) this.clickNow(c, q);
	}

	/** Delivers the queued asset_cache_confirm_arrival links as client Topic calls. */
	runAssetConfirms(): void {
		if (this.assetConfirms.length === 0) return;
		for (const { c, job } of this.assetConfirms.splice(0)) if (this.list.includes(c)) this.topic(c, `asset_cache_confirm_arrival=${job}`);
	}

	/** One diagonal step: what tg's `.moveup` verbs do, client/Move(get_step(mob, dir), dir), with a diagonal dir. */
	private diagStep(c: DMObject, dir: number): void {
		const mob = live(c.getVar("mob"));
		const move = c.type.procs.get("Move");
		if (!(mob instanceof DMObject) || !move?.hasBody) return;
		this.asCommand(() => this.vm.call(move, [this.vm.map.getStep(mob, dir), dir], c, mob));
	}

	// ---- statpanel -----------------------------------------------------------------------------
	//
	// Stat() runs for each client at most once a second (guess: the BYOND reference wasn't readable here; DreamSeeker
	// refreshes the panel about that often). `statpanel("X")` records tab X and says whether X is the one shown
	// (client.statpanel); stat() lines are kept only for the shown panel. Verb categories are extra tabs after those
	// (default category "Commands"; `set category = null` and `set hidden` verbs are skipped). A stat tab appears only
	// once statpanel() named it; the first one seen becomes client.statpanel if it was empty.
	// Not modelled: icons next to atoms, Stat() sleeping, per-tab refresh rates.

	private readonly statState = new WeakMap<DMObject, { next: number; last: string; refs: DMObject[]; cmds: string[] }>();
	private statCtx: { tabs: string[]; cur: string | null; active: string; lines: [string, string, number][]; refs: DMObject[] } | null = null;

	private statTick(c: DMObject): void {
		let st = this.statState.get(c);
		if (!st) this.statState.set(c, (st = { next: 0, last: "", refs: [], cmds: [] }));
		if (this.vm.sched.time < st.next) return;
		st.next = this.vm.sched.time + 10;
		const mob = live(c.getVar("mob"));
		const usr = mob instanceof DMObject ? mob : null;
		const run = () => {
			const active = stringify(c.getVar("statpanel") ?? "");
			const ctx: NonNullable<Clients["statCtx"]> = (this.statCtx = { tabs: [], cur: null, active, lines: [], refs: [] });
			try {
				const own = c.type.procs.get("Stat");
				if (own?.hasBody) this.vm.call(own, [], c, usr);
				else {
					const obj = live(c.getVar("statobj"));
					if (usr) this.callStat(usr, usr);
					if (obj instanceof DMObject && obj !== usr) this.callStat(obj, usr);
				}
			} finally { this.statCtx = null; }
			return ctx;
		};
		let ctx = run();
		if (!ctx.active && ctx.tabs.length) { c.setVar("statpanel", ctx.tabs[0]); ctx = run(); }
		const verbTabs = new Map<string, { name: string; cmd: string }[]>();
		for (const src of [usr, c]) if (src) for (const p of this.runtimeVerbs(src)) {
			const cat = p.verb?.category;
			if (cat === "" || p.attributes & ProcAttr.Hidden) continue;
			const k = cat ?? "Commands", cmd = verbCommand(p);
			let l = verbTabs.get(k);
			if (!l) verbTabs.set(k, (l = []));
			if (!l.some((x) => x.cmd === cmd)) l.push({ name: String(verbDef(p, (q) => q.verb?.name)?.verb!.name ?? p.name).replace(/_/g, " "), cmd });
		}
		const tabs = [...ctx.tabs, ...[...verbTabs.keys()].filter((k) => !ctx.tabs.includes(k)).sort()];
		const panel = ctx.active;
		let lines: [string, string, number][] = ctx.lines;
		st.refs = ctx.refs;
		st.cmds = [];
		if (panel && verbTabs.has(panel) && !ctx.tabs.includes(panel)) {
			const vs = verbTabs.get(panel)!.sort((a, b) => (a.name < b.name ? -1 : 1));
			lines = vs.map((v): [string, string, number] => ["", v.name, -1]);
			st.cmds = vs.map((v) => v.cmd);
		}
		const json = JSON.stringify([tabs, panel, lines]);
		if (json === st.last) return;
		st.last = json;
		this.send(ckeyText(c), { type: "stat", tabs, panel, lines, verb: st.cmds.length > 0 });
	}

	private callStat(o: DMObject, usr: DMObject | null): void {
		const p = o.type.procs.get("Stat");
		if (p?.hasBody) this.vm.call(p, [], o, usr);
	}

	/** A click on a stat line from the page: an atom line is Click()ed, a verb line runs the verb (like typing it). */
	statClick(c: DMObject, idx: number): string | null {
		const st = this.statState.get(c);
		if (!st) return null;
		if (st.cmds.length) { if (st.cmds[idx]) { this.typeLine(c, st.cmds[idx]); return `verb ${st.cmds[idx]}`; } return null; }
		const o = st.refs[idx];
		if (!o) return null;
		this.click(c, { object: o, x: null, y: null, dbl: false, control: "statwindow.stat", params: "" });
		return `click ${o.type.path}`;
	}

	/** The page switched tab. */
	setStatPanel(c: DMObject, name: string): void {
		c.setVar("statpanel", name);
		const st = this.statState.get(c);
		if (st) st.next = 0;
	}

	private statNatives(): void {
		const add = (name: string, v: Value | undefined) => {
			const x = this.statCtx;
			if (!x || x.cur === null || x.cur !== x.active) return;
			const one = (n: string, val: Value) => {
				val = live(val);
				x.lines.push([n, stripMarkers(stringify(val)), val instanceof DMObject ? x.refs.push(val) - 1 : -1]);
			};
			const val = live(v ?? null);
			if (val instanceof DMList) { let first = true; for (const i of val.items) { one(first ? name : "", i); first = false; } }
			else one(name, val);
		};
		const nm = (v: Value | undefined) => (v === null || v === undefined ? "" : stringify(v));
		this.vm.natives.set("/proc/statpanel", (_vm, args) => {
			const x = this.statCtx;
			if (!x || args[0] == null) return 0;
			const panel = stringify(args[0]);
			if (!x.tabs.includes(panel)) x.tabs.push(panel);
			x.cur = panel;
			if (args.length > 1) add(nm(args[1]), args[2]);
			return panel === x.active ? 1 : 0;
		});
		this.vm.natives.set("/proc/stat", (_vm, args) => {
			if (args.length <= 1) add("", args[0] ?? null);
			else add(nm(args[0]), args[1]);
			return null;
		});
	}

	// ---- mouse: Click / DblClick ------------------------------------------------------------
	//
	// The page works out what is under the pointer (render/hit-test.ts) and sends the object, the tile and the
	// params text (render/click-params.ts). As DreamSeeker's default does, client.Click(object, location, control,
	// params) is the client's own proc if the game defines one, else the default: object.Click(location, control,
	// params). It runs at the start of the next tick with usr = the client's mob, like a verb; netcode 1: a click from the page
	// runs as soon as it arrives between ticks (runClicks, called by the host), so its answer needn't wait for the tick.
	// location = the turf under the pointer (DM reference: "for the map, the turf where the mouse action happened");
	// assumed the same for screen objects (HUD), unmeasured.

	/** Queues a click; runs at the next runInput(). */
	click(c: DMObject, req: ClickReq): void {
		// ps-client: an /image on the map is drawn on the atom it's attached to, so a click on it is a click on that atom
		// (tg's images have no Click: it was an undefined-proc runtime). An image with no atom to stand for is not clickable.
		const unimage = (o: DMObject | null | undefined) => { if (!o || !this.imageType || !o.type.isSubtypeOf(this.imageType)) return o; const l = live(o.getVar("loc")); return l instanceof DMAtom ? l : null; };
		if (req.object !== null) { const o = unimage(req.object); if (!o) return; req.object = o; }
		if (req.over) req.over = unimage(req.over) ?? null;
		const st = this.inputState(c), q = st.clicks;
		if (st.steps.length) req.afterSteps = st.stepsDone + st.steps.length;
		// a move/drag not yet run is replaced by the newest, so a busy tick sees one, not a backlog.
		if (req.proc === "MouseMove" || req.proc === "MouseDrag") { const i = q.findIndex((r) => r.proc === req.proc); if (i >= 0) q.splice(i, 1); }
		if (q.length < MAX_QUEUE) q.push(req); // ps-security: a flood between two ticks is dropped
	}

	/** netcode 1: runs this client's queued clicks now, between ticks, instead of at the next runInput. Not while a typed or macro command
	 *  waits (it would run after the click it came before); false if nothing ran. */
	runClicks(c: DMObject): boolean {
		const st = this.input.get(c);
		if (!st || !st.clicks.length || st.queue.length || st.keyWait.length) return false;
		const n = st.clicks.length;
		this.runReady(c, st);
		return st.clicks.length < n;
	}

	/** Runs one click now. */
	private clickNow(c: DMObject, q: ClickReq): void {
		try { this.clickRun(c, q); } finally { q.after?.(); }
	}
	private clickRun(c: DMObject, q: ClickReq): void {
		if (q.run) { q.run(); return; }
		const name = q.proc ?? (q.dbl ? "DblClick" : "Click");
		const mob = live(c.getVar("mob"));
		const eyeT = this.vm.map.outerTurf(live(c.getVar("eye")) as never); // the eye's outermost turf
		const z = eyeT ? eyeT.z : null;
		const turf2 = (x?: number | null, y?: number | null) => (x != null && y != null && typeof z === "number" ? this.vm.map.turfAt(x, y, z) : null);
		const turf = turf2(q.x, q.y);
		const mine = c.type.procs.get(name);
		if (name === "MouseWheel") { // client/MouseWheel(object, delta_x, delta_y, location, control, params)
			if (mine) this.vm.call(mine, [q.object, q.dx ?? 0, q.dy ?? 0, turf, q.control, q.params], c, mob);
			else { const d = q.object?.type.procs.get(name); if (d) this.vm.call(d, [q.dx ?? 0, q.dy ?? 0, turf, q.control, q.params], q.object, mob); }
			return;
		}
		if (name === "MouseDrop" || name === "MouseDrag") { // client/MouseDrop(src_object, over_object, src_location, over_location, src_control, over_control, params)
			const over = turf2(q.ox, q.oy);
			if (mine) { this.vm.call(mine, [q.object, q.over ?? null, turf, over, q.control, q.control, q.params], c, mob); return; }
			const d = q.object?.type.procs.get(name);
			if (d) this.vm.call(d, [q.over ?? null, turf, over, q.control, q.control, q.params], q.object, mob);
			return;
		}
		if (mine) { this.vm.call(mine, [q.object, turf, q.control, q.params], c, mob); return; }
		const p = q.object?.type.procs.get(name);
		if (p) this.vm.call(p, [turf, q.control, q.params], q.object, mob);
	}

	/**
	 * Runs one command line: `.winset "..."`, or a verb by command name (lowercase, spaces as dashes) with its arguments
	 * parsed by command-line.ts. Verbs come from the runtime `verbs` lists of the client and its mob (so `verbs +=` shows
	 * up) and, for `set src in view()/oview()/range()/orange()/usr`, from the atoms around: the object's name is the
	 * first word after the verb. Returns false if nothing ran. `typed`: the line came from the input box, so an unknown
	 * verb goes to client/Command or prints BYOND's complaint; macros stay silent.
	 * Not modelled: `set src in world`, `set src = usr.group`, `set instant`, invisibility, verb-name completion
	 * (a unique prefix), `as file/sound/icon/area/color` and `in list` arguments, dialogs for missing arguments.
	 */
	/** does this line start with a verb the player has (or `.winset`)? The say box sends such lines as typed, not as speech. */
	isVerbLine(c: DMObject, text: string): boolean {
		const name = text.trim().split(/\s/, 1)[0].toLowerCase();
		if (name === ".winset") return true;
		const mob = live(c.getVar("mob"));
		for (const src of [mob instanceof DMObject ? mob : null, c]) {
			if (!src) continue;
			for (const p of this.runtimeVerbs(src)) { const k = verbSrc(p); if (verbCommand(p) === name && !(k !== undefined && IN_KINDS.has(k))) return true; }
		}
		return false;
	}

	command(c: DMObject, text: string, typed = false): boolean {
		text = text.trim();
		const sp = text.indexOf(" ");
		const name = (sp < 0 ? text : text.slice(0, sp)).toLowerCase();
		let rest = sp < 0 ? "" : text.slice(sp + 1).trim();
		if (name === ".winset") {
			this.winset(c, null, rest.startsWith('"') ? rest.slice(1, -1).replace(/\\(.)/g, "$1") : rest, true);
			return true;
		}
		const say = (t: string) => this.send(ckeyText(c), { type: "text", text: t });
		const mob = live(c.getVar("mob"));
		const usr = mob instanceof DMObject ? mob : null;
		let found: { src: DMObject; proc: DMProc } | null = null;
		for (const src of [usr, c]) {
			if (!src) continue;
			for (const p of this.runtimeVerbs(src)) {
				const k = verbSrc(p);
				if (verbCommand(p) === name && !(k !== undefined && IN_KINDS.has(k))) { found = { src, proc: p }; break; }
			}
			if (found) break;
		}
		if (!found && usr instanceof DMAtom) {
			// `set src in ...`: the first word names the object among the candidates that have this verb.
			const cands = this.verbSources(usr, name);
			const tok = nextToken(rest, 0);
			if (cands.length) {
				if (!tok) { say("(needs an argument)"); return true; }
				const hit = pickByName(cands, (x) => stringify(x.src.getVar("name")), tok.text);
				if (hit) { found = hit; rest = rest.slice(tok.end); }
			}
		}
		if (!found) {
			if (!typed) return false;
			const cmd = c.type.procs.get("Command");
			if (cmd?.hasBody) this.asCommand(() => this.vm.call(cmd, [text], c, usr)); // the game's own Command(); the built-in one is a stub
			else say(`Sorry, the following is not valid: ${text}`); // guess: wording not verified in BYOND
			return false;
		}
		this.runVerb(c, usr, found, rest, []);
		return true;
	}

	/**
	 * Runs a found verb with the rest of a command line as its arguments after `pre` (already-known leading
	 * arguments: the atom a right-click menu was opened on). Missing arguments are asked for in dialogs.
	 */
	private runVerb(c: DMObject, usr: DMObject | null, found: { src: DMObject; proc: DMProc }, rest: string, pre: Value[]): void {
		const say = (t: string) => this.send(ckeyText(c), { type: "text", text: t });
		const view = usr instanceof DMAtom ? () => this.vm.map.rangeList(7, usr, false, true).items : () => [];
		const match = (t: string, mask: number) => {
			const cand = view().filter((o) => o instanceof DMAtom && ((mask & ArgType.Mob && o.kind === Kind.Mob) || (mask & ArgType.Obj && o.kind === Kind.Obj) || (mask & ArgType.Turf && o.kind === Kind.Turf) || (mask & ArgType.Area && o.kind === Kind.Area)));
			return pickByName(cand as DMAtom[], (o) => stringify(o.getVar("name")), t);
		};
		const allSpecs = found.proc.argSpecs;
		const r = parseArgs<Value>(rest, allSpecs.slice(pre.length), match);
		if (!r.ok && r.reason === "missing") {
			// BYOND asks for each missing argument in a dialog, then runs the verb.
			const specs = allSpecs, at = r.arg + pre.length;
			const first = parseArgs<Value>(rest, specs.slice(pre.length, at), match);
			if (!first.ok) { say("(needs an argument)"); return; }
			const { src, proc } = found, args: Value[] = [...pre, ...(first.args as Value[])];
			const ask = (i: number): void => {
				if (i >= specs.length) { this.asCommand(() => this.vm.call(overrideOf(src, proc), args, src, usr)); return; }
				const mask = specs[i].Type ?? 0;
				let items: Value[] | undefined;
				if (mask & (ArgType.Mob | ArgType.Obj | ArgType.Turf | ArgType.Area))
					items = view().filter((o) => o instanceof DMAtom && ((mask & ArgType.Mob && o.kind === Kind.Mob) || (mask & ArgType.Obj && o.kind === Kind.Obj) || (mask & ArgType.Turf && o.kind === Kind.Turf) || (mask & ArgType.Area && o.kind === Kind.Area)));
				const d = inputKind(mask, items !== undefined);
				if (!d) { args.push(null); ask(i + 1); return; }
				this.openDialog(c, { kind: "input", input: d, message: (specs[i] as { Name?: string }).Name ?? "", title: verbCommand(proc), default: "", nullOk: true, ...(items ? { items: items.map((x) => stripMarkers(stringify(x))) } : {}) }, items, d === "num", (v) => {
					if (v === null) return; // Cancel: the verb doesn't run
					args.push(v); ask(i + 1);
				});
			};
			ask(at);
			return;
		}
		if (!r.ok) {
			say(`Sorry, the following is not valid: ${r.text}`);
			return;
		}
		this.asCommand(() => this.vm.call(overrideOf(found.src, found.proc), [...pre, ...r.args], found.src, usr));
	}

	// ---- right-click popup menu (rc1) ----------------------------------------------------------------
	//
	// BYOND (client.show_popup_menus, default on): a right-click on the map lists the atoms on that tile, each with a submenu of
	// the verbs the player can use on it; nothing is sent as a Click. Rules used (DM reference, "verb" settings; not measured in
	// a real DreamSeeker, the popup is GUI-only):
	//  - an atom's own verbs (its `verbs` list) count when `set src` allows it for usr: `in view(R)` / `in oview(R)` / `in range(R)` /
	//    `in orange(R)` (R = the setting's range, else the view), `in world`, `in usr` (usr.contents), `= usr` (only usr itself),
	//    `= usr.loc`; a mob's verbs with no `set src` are `src = usr`, so they show when the mob itself is right-clicked.
	//  - the mob's (and client's) verbs whose first argument is an atom (`atom/A as mob|obj|turf in view()`, tg's Examine and
	//    Point To) show on each atom that fits the argument's type and `in` source, and run with that atom as the argument.
	//  - `set hidden` and `set popup_menu = 0` verbs never show; `set invisibility` above the mob's see_invisible hides one.
	//  - the entries are the turf, objs and mobs the client sees on the tile, top of the draw order first (plane, then layer);
	//    atoms with no verbs are left out; the area is not listed (assumed). Verbs are sorted by name.
	// Not modelled: `set src = usr.group`, the verb's own `set category` (the popup is flat), icons in the menu.

	private readonly menus = new WeakMap<DMObject, { id: number; entries: PopupEntry[] }>();
	private menuId = 0;

	/** The menu for a right-click on a tile whose visible atoms are `objs`. No items = show nothing and send the click instead. */
	popupMenu(c: DMObject, objs: DMObject[]): { id: number; items: { name: string; verbs: string[] }[] } {
		const mob = live(c.getVar("mob"));
		const usr = mob instanceof DMAtom ? mob : null;
		const entries: PopupEntry[] = [];
		const num = (o: DMObject, k: string) => { const v = o.getVar(k); return typeof v === "number" ? v : 0; };
		const order = objs.map((o, i) => ({ o, i })).sort((a, b) => num(b.o, "plane") - num(a.o, "plane") || num(b.o, "layer") - num(a.o, "layer") || b.i - a.i).map((x) => x.o);
		if (usr) {
			const cache = new Map<string, Set<DMObject>>();
			const view = live(c.getVar("view"));
			const [vrx, vry] = viewHalfSize(view) ?? [7, 7]; // a "WxH" client.view is a rectangle
			const around = (fn: string, r: number | undefined): Set<DMObject> => { // view/oview/range/orange from usr
				const key = fn + ":" + (r ?? vrx + "x" + vry);
				let set = cache.get(key);
				if (!set) cache.set(key, (set = new Set(this.vm.map.rangeList(r ?? vrx, usr, fn.startsWith("o"), fn.endsWith("view"), false, r ?? vry).items.map(live) as DMObject[])));
				return set;
			};
			const seeInv = num(usr, "see_invisible");
			for (const x of order) {
				if (!(x instanceof DMAtom) || x.kind === Kind.Area) continue;
				const verbs = this.popupVerbs(c, usr, x, around, seeInv);
				if (verbs.length) entries.push({ atom: x, name: stripMarkers(stringify(x.getVar("name"))), verbs });
			}
		}
		const id = ++this.menuId;
		this.menus.set(c, { id, entries });
		return { id, items: entries.map((e) => ({ name: e.name, verbs: e.verbs.map((v) => v.name) })) };
	}

	private popupVerbs(c: DMObject, usr: DMAtom, x: DMAtom, around: (fn: string, r: number | undefined) => Set<DMObject>, seeInv: number): PopupVerb[] {
		const out: PopupVerb[] = [];
		const seen = new Set<string>();
		const hidden = (src: DMObject, p: DMProc): boolean => {
			for (const q of [p, overrideOf(src, p)]) for (let z: DMProc | null = q; z; z = z.superProc) if (z.attributes & (ProcAttr.Hidden | ProcAttr.HidePopupMenu)) return true;
			const inv = verbDef(p, (q) => q.verb?.invisibility)?.verb!.invisibility;
			return typeof inv === "number" && inv > seeInv;
		};
		const nameOf = (p: DMProc) => String(verbDef(p, (q) => q.verb?.name)?.verb!.name ?? p.name).replace(/_/g, " ");
		const add = (owner: DMObject, p: DMProc, pre: Value[]) => {
			const cmd = verbCommand(p);
			if (seen.has(cmd)) return;
			seen.add(cmd);
			out.push({ name: nameOf(p), owner, proc: p, pre });
		};
		const takesAtom = (p: DMProc): boolean => ((p.argSpecs[0]?.Type ?? 0) & (ArgType.Mob | ArgType.Obj | ArgType.Turf)) !== 0;
		const firstAtomArg = (p: DMProc): boolean => {
			const a = p.argSpecs[0];
			const mask = a?.Type ?? 0;
			const kind = (x.kind === Kind.Mob && mask & ArgType.Mob) || (x.kind === Kind.Obj && mask & ArgType.Obj) || (x.kind === Kind.Turf && mask & ArgType.Turf);
			if (!a || !kind) return false;
			const t = a.TypePath ? this.vm.tree.getType(a.TypePath) : undefined;
			if (t && !x.type.isSubtypeOf(t)) return false;
			const m = /^(o?view|o?range)(?::(\d+))?$/.exec(a.Source ?? "");
			if (m) return around(m[1], m[2] === undefined ? undefined : Number(m[2])).has(x);
			return true; // in world / a list expression we don't evaluate / no `in`: any atom of that type
		};
		// (1) the atom's own verbs
		for (const p of this.runtimeVerbs(x)) {
			if (hidden(x, p)) continue;
			const k = verbSrc(p);
			let ok: boolean;
			if (k === undefined || k === 10) ok = x === usr && !takesAtom(p); // `src = usr` (the default for a mob's verbs)
			else if (k === 8 || k === 9) ok = true;
			else if (k === 11) ok = x.loc === usr;
			else if (k === 12) ok = x === usr.loc;
			else if (k >= 0 && k <= 7) ok = around(["view", "view", "oview", "oview", "range", "range", "orange", "orange"][k], verbDef(p, (q) => q.verb?.range)?.verb!.range as number | undefined).has(x);
			else ok = false;
			if (ok) add(x, p, []);
		}
		// (2) the player's own verbs that take this atom as their first argument
		for (const owner of [usr, c]) {
			for (const p of this.runtimeVerbs(owner)) {
				const k = verbSrc(p);
				if ((k !== undefined && k !== 10) || hidden(owner, p) || !firstAtomArg(p)) continue;
				add(owner, p, [x]);
			}
		}
		return out.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0));
	}

	/** The player chose verb `v` of entry `a` in menu `id`: runs it like the command line would (missing arguments asked for in dialogs). */
	popupPick(c: DMObject, id: number, a: number, v: number): string | null {
		const m = this.menus.get(c);
		const pv = m && m.id === id ? m.entries[a]?.verbs[v] : undefined;
		if (!m || !pv) return null;
		this.menus.delete(c);
		const mob = live(c.getVar("mob"));
		this.click(c, { object: null, x: null, y: null, dbl: false, control: "mapwindow.map", params: "", run: () => this.runVerb(c, mob instanceof DMObject ? mob : null, { src: pv.owner, proc: pv.proc }, "", pv.pre) }); // next tick, like a verb typed in
		return `${m.entries[a].atom.type.path} -> ${verbCommand(pv.proc)}`;
	}

	// ---- input() and alert() ------------------------------------------------------------------
	//
	// BYOND 511 reference: both sleep the proc until the player answers. "If the target of the input prompt is not a
	// player, the result will be the default value. If no default value is specified and null is allowed by the input
	// type, that will be returned. Otherwise, an error will result, crashing the proc that called input()."
	// Measured (tests/dm/prompt.dm): alert() to a non-player returns Button1; input() with no default and no null: runtime error "bad client". Not documented: the empty-number-box answer (0, guess),
	// a text box answering "" (returned as "", guess). Dialogs stack on the page; each parks only its own thread.

	private readonly prompts = new Map<number, { req: PromptReq; items?: Value[]; num?: boolean; buttons?: string[]; ckey: string; then?: (v: Value) => void }>();
	private promptId = 0;

	/** `input(...)`: the arguments as the Prompt opcode pops them. Returns the answer, or null while a dialog is open (the VM parks the thread). */
	prompt(types: number, list: Value, a1: Value, a2: Value, a3: Value, a4: Value, usr: Value): Value {
		const who = this.isWho(a1);
		const [message, title, dflt] = who ? [a2, a3, a4] : [a1, a2, a3];
		const c = this.clientOf(who ? a1 : usr);
		const items = live(list) instanceof DMList ? (live(list) as DMList).items.map(live) : undefined;
		const nullOk = (types & ArgType.Null) !== 0;
		if (!c) {
			if (dflt !== null || nullOk) return dflt;
			throw new DMRuntimeError("bad client"); // measured: BYOND 511, tests/dm/prompt.dm
		}
		const d = inputKind(types, items !== undefined);
		if (!d) return null; // as icon/file/sound/color alone: no picker here
		return this.openDialog(c, { kind: "input", input: d, message: stringify(message), title: stringify(title ?? ""), default: dflt === null ? "" : stringify(dflt), nullOk, ...(items ? { items: items.map((x) => stripMarkers(stringify(x))) } : {}) }, items, d === "num");
	}

	/** A first argument that names the player to ask (a mob or a client), rather than being the message. */
	private isWho(v: Value): boolean {
		v = live(v);
		return v instanceof DMAtom ? v.kind === Kind.Mob : v instanceof DMObject && this.clientOf(v) !== null;
	}

	/** `alert(Usr, Message, Title, Button1="Ok", Button2, Button3)`. */
	private alert(args: Value[], usr: Value): Value {
		const who = this.isWho(args[0] ?? null);
		const [message, title, b1, b2, b3] = who ? args.slice(1) : args;
		const c = this.clientOf(who ? args[0] : usr);
		const buttons = [b1 ?? "Ok", b2 ?? null, b3 ?? null].filter((b) => b !== null).map((b) => stringify(b));
		if (!c) return buttons[0]; // measured: BYOND 511 answers the first button when nobody is there
		return this.openDialog(c, { kind: "alert", message: stringify(message ?? null), title: stringify(title ?? ""), buttons });
	}

	private openDialog(c: DMObject, d: Record<string, unknown>, items?: Value[], num?: boolean, then?: (v: Value) => void): Value {
		const req: PromptReq = {};
		const id = ++this.promptId;
		const ckey = ckeyText(c);
		// ps-security: a player's open dialogs are capped (each parks a thread until answered): past the cap the oldest is cancelled.
		const mine = [...this.prompts].filter(([, p]) => p.ckey === ckey);
		if (mine.length >= MAX_DIALOGS) this.answer(mine[0][0], null);
		this.prompts.set(id, { req, items, num, buttons: d.kind === "alert" ? (d.buttons as string[]) : undefined, ckey, then });
		this.send(ckey, { type: "dialog", id, ...d });
		if (!then) this.vm.park(req);
		return null;
	}

	/** The page's answer to dialog `id`: `value` is the text, number, or list index; null = Cancel; an alert answers its button's text. */
	answer(id: number, value: string | number | null, ckey?: string): void {
		const p = this.prompts.get(id);
		if (!p) return;
		// ps-security: only the player who was asked may answer, and only with something the dialog offers (a list row, one of the
		// alert's buttons); anything else leaves the dialog open.
		if (ckey !== undefined && p.ckey !== ckey) return;
		if (value !== null && p.items && !(typeof value === "number" && Number.isInteger(value) && value >= 0 && value < p.items.length)) return;
		if (value !== null && p.buttons && !(typeof value === "string" && p.buttons.includes(value))) return;
		this.prompts.delete(id);
		let v: Value = null;
		if (p.items) v = typeof value === "number" ? p.items[value] ?? null : null;
		else if (value !== null) v = p.num ? Number(value) || 0 : value;
		if (p.then) p.then(v);
		else this.vm.answerPrompt(p.req, v);
	}

	/** The verbs an object has right now: its runtime `verbs` list if it has one, else its type's. */
	private runtimeVerbs(o: DMObject): DMProc[] {
		const l = live(o.getVar("verbs"));
		return l instanceof DMList ? (l.items.map(live).filter((p) => p instanceof DMProc) as DMProc[]) : [...this.verbs(o.type).values()];
	}

	/** Atoms that have a `set src in ...` verb of this command name and are in that list for `usr`. */
	private verbSources(usr: DMAtom, name: string): { src: DMObject; proc: DMProc }[] {
		const out: { src: DMObject; proc: DMProc }[] = [];
		const seen = new Set<DMObject>();
		for (const k of [1, 3, 5, 7, 11]) {
			const items = k === 11 ? usr.contents.slice() : this.vm.map.rangeList(7, usr, k === 3 || k === 7, k === 1 || k === 3).items;
			for (const o of items) {
				if (!(o instanceof DMAtom) || seen.has(o)) continue;
				for (const p of this.runtimeVerbs(o)) if (verbCommand(p) === name && verbSrc(p) === k) { out.push({ src: o, proc: p }); seen.add(o); break; }
			}
		}
		return out;
	}

	private readonly input = new WeakMap<DMObject, { queue: string[]; clicks: ClickReq[]; held: Map<string, { repeat: string | null; fresh: boolean; up: string | null }>; steps: { dir: number; at: number }[]; stepsDone: number; keyWait: { cmd: string; after: number }[]; predicts?: boolean }>();
	private readonly verbCache = new Map<DMType, Map<string, DMProc>>();

	private inputState(c: DMObject) {
		let st = this.input.get(c);
		if (!st) this.input.set(c, (st = { queue: [], clicks: [], held: new Map(), steps: [], stepsDone: 0, keyWait: [] }));
		return st;
	}

	private findMacro(c: DMObject, mods: string, key: string, up: boolean) {
		const skin = this.skins.get(c);
		return skin ? findMacro(skin, skin.controls.get("mainwindow")?.params.get("macro") ?? "", mods, key, up) : null;
	}
	/** The keys (as the page names them: "CTRL+Q") whose press runs `command` in the client's active macro set; cached per skin and set. */
	keysFor(c: DMObject, command: string): string[] {
		const skin = this.skins.get(c), set = skin?.controls.get("mainwindow")?.params.get("macro") ?? "";
		if (!skin) return [];
		const k = `${set}|${command}`;
		let byKey = this.keysCache.get(skin);
		if (!byKey) this.keysCache.set(skin, (byKey = new Map()));
		let l = byKey.get(k);
		if (!l) {
			l = [];
			for (const ctl of skin.controls.values()) {
				if (ctl.type !== "MACRO" || ctl.parent !== set || ctl.params.get("is-disabled") === "true" || (ctl.params.get("command") ?? "").toLowerCase() !== command) continue;
				const p = parseKey(ctl.params.get("name") ?? "");
				if (!p.up) l.push(p.mods ? `${p.mods}+${p.key}` : p.key);
			}
			byKey.set(k, l);
		}
		return l;
	}
	private keysCache = new WeakMap<object, Map<string, string[]>>();

	/** A type's verbs by command name. An override without `set name` keeps its parent's verb name. */
	verbs(t: DMType): Map<string, DMProc> {
		let m = this.verbCache.get(t);
		if (!m) {
			m = new Map();
			for (const p of t.procs.values()) {
				for (let q: DMProc | null = p; q; q = q.superProc) {
					if (!q.isVerb) continue;
					m.set((q.verb?.name ?? q.name).toLowerCase().replace(/ /g, "-"), p);
					break;
				}
			}
			this.verbCache.set(t, m);
		}
		return m;
	}

	// ---- winset/winget/winexists ---------------------------------------------------------------

	private installNatives(): void {
		const vm = this.vm;
		const def = (path: string, fn: NativeProc) => vm.natives.set(path, fn);
		// Docs: winget and winexists wait for the client's answer, so the calling proc sleeps. The
		// answer is known here at once; the sleep is one tick (guess: DreamDaemon hears back from a
		// local client within a tick).
		const roundTrip = () => vm.requestSleep(vm.sched.tickLag);

		def("/proc/alert", (_vm, args, _src, usr) => this.alert(args, usr));
		def("/proc/winset", (_vm, [player = null, id = null, params = null]) => {
			const c = this.clientOf(player);
			if (c) this.winset(c, id === null ? null : stringify(id), stringify(params));
			return null;
		});

		def("/proc/winget", (_vm, [player = null, id = null, params = null]) => {
			const c = this.clientOf(player);
			if (!c) return null;
			const skin = this.skins.get(c);
			const ids = id === null ? [null] : stringify(id).split(";");
			const names = stringify(params).split(";");
			const pairs: [string, string][] = [];
			for (const cid of ids) {
				for (const p of names) {
					const v = cid === null ? this.programParam(skin, p) : this.control(skin, cid, false)?.params.get(p);
					if (v !== undefined) pairs.push([cid === null || ids.length === 1 ? p : `${cid}.${p}`, v]);
				}
			}
			const single = ids.length === 1 && names.length === 1;
			const r = single ? (pairs[0]?.[1] ?? "") : pairs.map(([k, v]) => `${k}=${urlEncode(v)}`).join(";");
			this.send(ckeyText(c), { type: "winget", id: id === null ? null : stringify(id), params: stringify(params), result: r });
			roundTrip();
			return r;
		});

		def("/proc/winexists", (_vm, [player = null, id = null]) => {
			const c = this.clientOf(player);
			if (!c) return "";
			const ctl = this.control(this.skins.get(c), stringify(id), false);
			const r = ctl ? ctl.type : "";
			this.send(ckeyText(c), { type: "winexists", id: stringify(id), result: r });
			roundTrip();
			return r;
		});

		def("/proc/winclone", (_vm, [player = null, name = null, clone = null]) => {
			const c = this.clientOf(player);
			if (!c) return null;
			this.send(ckeyText(c), { type: "winclone", window: stringify(name), clone: stringify(clone) });
			const skin = this.skins.get(c);
			const src = this.control(skin, stringify(name), false); // "window" is BYOND's built-in template, not in the skin: then a bare window
			if (skin) { const cl = src ? { ...src, id: stringify(clone), params: new Map(src.params) } : { id: stringify(clone), type: "MAIN", parent: "", params: new Map<string, string>() }; skin.controls.set(stringify(clone), cl); this.clones.add(cl); }
			return null;
		});

		def("/proc/winshow", (_vm, [player = null, win = null, show = null]) => {
			const c = this.clientOf(player);
			if (!c) return null;
			const on = show === null || isTruthy(show);
			this.send(ckeyText(c), { type: "winset", id: stringify(win), params: `is-visible=${on}` });
			this.control(this.skins.get(c), stringify(win), false)?.params.set("is-visible", on ? "true" : "false");
			return null;
		});
	}

	/**
	 * winset(c, id, text), also reached by the `.winset "..."` client command (macros). `player`: the text came from the player
	 * (a typed or macro `.winset`, a byond://winset link), not the game. ps-client: the server keeps each player's copy of the
	 * skin (winget/winexists read it), so a player's winsets only change controls that exist, add at most MAX_PLAYER_PARAMS
	 * params to one, and set values of at most MAX_PLAYER_VALUE characters: without that, one player could grow the server's
	 * memory without end. Their own page gets what they sent either way.
	 */
	winset(c: DMObject, id: string | null, text: string, player = false): void {
		this.send(ckeyText(c), { type: "winset", id, params: text });
		const skin = this.skins.get(c);
		if (!skin) return;
		for (const [k, v] of parseWinsetParams(text)) {
			let ctl = id, param = k;
			if (ctl === null) {
				const dot = k.lastIndexOf(".");
				if (dot < 0) continue; // command=..., reset=true: client-side actions, recorded above
				ctl = k.slice(0, dot);
				param = k.slice(dot + 1);
			}
			const ctrl = this.control(skin, ctl, !player);
			if (!ctrl || (player && (v.length > MAX_PLAYER_VALUE || (!ctrl.params.has(param) && ctrl.params.size >= MAX_PLAYER_PARAMS)))) continue;
			ctrl.params.set(param, v);
			if (param === "type") ctrl.type = v;
			if (param === "parent" && v === "none" && this.clones.has(ctrl)) { skin.controls.delete(ctrl.id); for (const [k, o] of skin.controls) if (o.params.get("parent") === ctrl.id) skin.controls.delete(k); } // a cloned window let go: gone for winexists
		}
	}

	/** A control by "id" or "window.id"; with `create`, a missing one is made (winset can add controls). */
	private control(skin: Skin | undefined, id: string, create: boolean) {
		if (!skin) return undefined;
		let ctl = skin.controls.get(id);
		if (!ctl) {
			const dot = id.lastIndexOf(".");
			if (dot >= 0) ctl = skin.controls.get(id.slice(dot + 1));
		}
		if (!ctl && create) {
			ctl = { id, type: "", parent: "", params: new Map() };
			skin.controls.set(id, ctl);
		}
		return ctl;
	}

	/** winget(player, null, p): values that belong to the whole client (skin reference). */
	private programParam(skin: Skin | undefined, p: string): string | undefined {
		switch (p) {
			case "url": return "127.0.0.1:25001"; // guess: DreamDaemon's port in the BYOND reference runs
			case "focus": return ""; // guess
			case "sound": return "true";
			case "hwmode": return "true"; // guess (tg winsets .configure graphics-hwmode on)
			case "windows": return skin?.windows.join(";") ?? "";
			case "menus": return skin?.menus.join(";") ?? "";
			case "macros": return skin?.macros.join(";") ?? "";
			case "panes": return skin ? [...skin.controls.values()].filter((c) => c.type === "MAIN" && c.params.get("is-pane") === "true").map((c) => c.id).join(";") : "";
		}
		return undefined;
	}
}

/** A macro set's entry for these modifiers + key (a press, or with `up` a release). */
export function findMacro(skin: Skin, set: string, mods: string, key: string, up: boolean): { command: string; rep: boolean } | null {
	for (const ctl of skin.controls.values()) {
		if (ctl.type !== "MACRO" || ctl.parent !== set) continue;
		const k = parseKey(ctl.params.get("name") ?? "");
		if (k.key === key && k.mods === mods && k.up === up && ctl.params.get("is-disabled") !== "true")
			return { command: ctl.params.get("command") ?? "", rep: k.rep };
	}
	return null;
}

/** "CTRL+SHIFT+W+REP" -> mods "CTRL+SHIFT" (fixed order), key "W", rep, up. */
export function parseKey(name: string): { mods: string; key: string; rep: boolean; up: boolean } {
	const parts = name.toUpperCase().split("+");
	const has = (x: string) => parts.includes(x);
	// A lone modifier ("ALT" in tg's skin) is the key itself.
	const rest = parts.filter((p) => p !== "REP" && p !== "UP" && !MODS.includes(p));
	const key = rest.length ? rest[rest.length - 1] : parts.filter((p) => MODS.includes(p)).pop() ?? "";
	const mods = MODS.filter((m) => has(m) && m !== key).join("+");
	return { mods, key, rep: has("REP"), up: has("UP") };
}
const MODS = ["SHIFT", "CTRL", "ALT"];
// ps-security: caps on what one player can have waiting (commands and clicks not yet run by a tick, keys held, dialogs open).
const MAX_QUEUE = 100, MAX_HELD = 24, MAX_DIALOGS = 20;
/** The mover's own cooldown, which a held key waits out (it repeats every tick) but a single step() would lose: a jaunt's dummy has canmove
 *  off for 0.2 s after each step, a ridden vehicle waits vehicle_move_delay. */
function moverWait(c: DMObject, now: number): boolean {
	const m = live(c.getVar("mob")), l = m instanceof DMAtom ? m.loc : null;
	if (l !== null && l.type.path.startsWith("/obj/effect/dummy/spell_jaunt")) return !isTruthy(live(l.getVar("canmove")));
	if (l !== null && l.type.path.startsWith("/obj/mecha")) return !isTruthy(live(l.getVar("can_move"))); // a mech: step_in after each step or turn
	const b = m instanceof DMAtom && m.hasVar("buckled") ? live(m.getVar("buckled")) : null, rd = b instanceof DMObject && b.hasVar("riding_datum") ? live(b.getVar("riding_datum")) : null;
	return rd instanceof DMObject && Number(live(rd.getVar("next_vehicle_move"))) > now; // a vehicle: one step per vehicle_move_delay
}
const MOVER_WAIT = 10; // ds a step() may wait for moverWait (a marauder's step_in is 5)
const STEP_WAIT = 4; // ds a step() may wait for move_delay (a stun sets it a second ahead): then it is dropped, as a released key would be
// ps-client: what a player's own winsets may do to the server's copy of their skin (winset()).
const MAX_PLAYER_PARAMS = 64, MAX_PLAYER_VALUE = 1024;

const ckeyOf = (k: string) => k.toLowerCase().replace(/[^a-z0-9@]/g, "");
const ckeyText = (c: DMObject) => stringify(c.getVar("ckey"));

// The page fetches the file case-sensitively: send the real on-disk name (tg asks for Windows-style "Ab1.ogg").
function soundData(s: DMObject, vfs: { resolve(p: string): string }): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const k of ["file", "repeat", "wait", "channel", "volume", "frequency", "pan", "priority", "status", "x", "y", "z", "falloff", "environment", "echo"]) {
		if (!s.hasVar(k)) continue;
		const v = s.getVar(k);
		if (v !== null && v !== 0) out[k] = k === "file" && v instanceof Resource ? vfs.resolve(v.path) : plain(v);
	}
	return out;
}
