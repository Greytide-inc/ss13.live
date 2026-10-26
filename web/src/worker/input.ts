// input - what the page's input messages do in the boot worker (key, step, click, menu, mouse, command, topic, ...), moved out of run().
// installInput(ctx) assigns the on* handlers below (self.onmessage in boot-worker.ts calls them) and vm.clients.onMessage.

import type { VM, AnimEvent } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { refTable } from "../vm/refs.js";
import { heap } from "../vm/gc.js";
import { stringify } from "../vm/value.js";
import type { ViewDiffer, ViewUpdate } from "./client-view.js";
import { type IconImage, evalRecipe, recipePaths } from "../dmi/icon-ops.js";
import { encodePng } from "../dmi/png.js";
import type { StartMsg } from "./boot-worker.js";
import { linkCommandOk } from "./input-check.js";

export type ClickMsg = { type: "click"; player?: string; id: number | null; x: number | null; y: number | null; dbl: boolean; control: string; params: string };
export type MenuMsg = { type: "menu"; player?: string; one?: number; x: number; y: number; sx: number; sy: number; click: ClickMsg };
export type MenuPickMsg = { type: "menupick"; player?: string; id: number; a: number; v: number };
export type MouseMsg = {
	type: "mouse";
	player?: string;
	proc: "MouseDown" | "MouseUp" | "MouseDrop" | "MouseDrag" | "MouseMove" | "MouseEntered" | "MouseExited" | "MouseWheel";
	dx?: number;
	dy?: number;
	id: number | null;
	x: number | null;
	y: number | null;
	over?: number | null;
	ox?: number | null;
	oy?: number | null;
	control: string;
	params: string;
};
export const mouseSeen: Record<string, number> = {};

export let onKey: ((key: string, down: boolean, player?: string) => void) | null = null;
export let onStep: ((dir: number, player?: string) => void) | null = null;
export let onMouse: ((m: MouseMsg) => void) | null = null;
export let onClick: ((m: ClickMsg) => void) | null = null;
export let onMenu: ((m: MenuMsg) => void) | null = null;
export let onMenuPick: ((m: MenuPickMsg) => void) | null = null;
export let onStat: ((name: string | null, idx: number, player?: string) => void) | null = null; // statpanel tab switch / stat line click
export let onCommand: ((text: string, speech?: string, player?: string) => void) | null = null;
export let onTyping: ((on: boolean, player?: string) => void) | null = null;
export let onTopic: ((href: string, player?: string) => void) | null = null;
export let onWinclose: ((name: string, player?: string) => void) | null = null;
export let onAnswer: ((id: number, value: string | number | null, player?: string) => void) | null = null;
export let onBugState: ((player?: string) => void) | null = null; // F9 on the page asks for a snapshot of the player's state

/** One record per connected player. Input names its player by ckey (none = the first); output is routed by the ckey the engine tags it with. */
export interface Player { ckey: string; key: string; client: DMObject; differ: ViewDiffer; outLines: string[]; joined: boolean; views: number; outCount: number; animSeen?: Set<AnimEvent> } // animSeen: animLog events an at-once view (netcode 1) already gave it

/** What run() shares with the handlers. The getters read run()'s live variables. */
export interface InputCtx {
	opts: StartMsg;
	vm: VM;
	log: (line: string) => void;
	post: (m: unknown) => void;
	inLog: (line: string) => void;
	cutAt: (n: number) => number;
	readonly logLevel: string;
	players: Player[];
	early: Map<string, string[]>;
	playerOf: (ck?: string) => Player | undefined;
	by: (ck?: string) => string;
	pixels: Map<string, IconImage | null>;
	fetchPixels: (path: string) => Promise<IconImage | null>;
	normPath: (path: string) => string;
	fixAppIcons: (apps: ViewUpdate["apps"]) => void;
	resyncRequested: Set<string>;
	lateWakes: string[];
	readonly joined: boolean;
	readonly idle: boolean;
}

export function installInput(ctx: InputCtx): void {
	const { opts, vm, log, post, inLog, cutAt, players, early, playerOf, by, pixels, fetchPixels, normPath, fixAppIcons, resyncRequested, lateWakes } = ctx;
onStep = (dir, player) => {
	const c = playerOf(player)?.client;
	if (c && playerOf(player)!.joined) vm.clients.step(c, dir);
};
onKey = (key, down, player) => {
	const P = playerOf(player), c = P?.client;
	if (!P || !c || !P.joined) return;
	if (!down) return vm.clients.keyUp(c, key);
	const cmd = vm.clients.keyDown(c, key);
	inLog(`[vm-boot] key ${key}${cmd ? ` -> ${cmd}` : " (no macro)"} at world.time ${vm.sched.time}${by(P.ckey)}`);
};
// a click names the object by the differ's view id. The tg replies it causes (examine text, ...) are logged for the
// next 2 s of world time, so a driven run can see what a click did.
let clickLogUntil = -1;
// text for the output pane (`<<` and output(msg, "output")) is batched and posted once per tick with the view.
vm.clients.onMessage = (m) => {
	const MP = playerOf(String(m.client)); // the player this message is for
	// Not every type is exclusive: "text" is queued and then maybe logged, "browse_rsc" may start a PNG and is then forwarded like "browse".
	const queueText = () => { const ol = MP ? MP.outLines : (early.get(String(m.client)) ?? (early.set(String(m.client), []), early.get(String(m.client))!)); ol.push(String(m.text)); if (MP) MP.outCount++; if (ol.length > 500) ol.shift(); }
	const forward = () => { post({ ...m, player: m.client }); inLog(`[vm-boot] ${m.type} ${JSON.stringify({ ...m, html: typeof m.html === "string" ? m.html.length + " chars" : m.html }).slice(0, cutAt(300))}${by(MP?.ckey ?? String(m.client))}`); } // popups and their files for the page
	switch (m.type) {
		case "text":
			queueText();
			if (vm.sched.time <= clickLogUntil || ctx.logLevel === "chatty") inLog(`[vm-boot] to client: ${JSON.stringify(m.text).slice(0, cutAt(400))}${by(MP?.ckey ?? String(m.client))}`);
			break;
		case "output":
			if (m.control === "output") queueText();
			else if (/:\w+$/.test(String(m.control))) post({ type: "popout", player: m.client, control: m.control, text: String(m.text) }); // output(msg, "win.browser:fn") -> that popup's JS function
			break;
		case "browse_rsc":
			if (typeof m.file === "string" && vm.runtimeIcons.has(m.file)) { // a runtime icon (tg's character preview): the page waits for its PNG (first state, south, frame 0)
				const recipe = vm.runtimeIcons.get(m.file)!, file = String(m.file), name = m.name === null ? file : String(m.name);
				m.pendingPng = true;
				void (async () => { // the recipe's source files may not be decoded yet (only PIXEL_FILES are): fetch what's missing, then render
					const need = recipePaths(recipe).map(normPath).filter((p) => !pixels.has(p));
					await Promise.all(need.map(async (p) => pixels.set(p, await fetchPixels(p))));
					const img = evalRecipe(recipe, (p) => vm.loadIcon!(p)), px = img.states[0]?.px[0]?.[0];
					let opaque = 0; if (px) for (let i = 3; i < px.length; i += 4) if (px[i]) opaque++;
					log(`[vm-boot] rsc icon ${file} as ${name}: ${img.width}x${img.height}, ${img.states.length} states, ${opaque} visible pixels (fetched ${need.length} icon files)`);
					post({ type: "rsc_png", player: m.client, name, png: encodePng(img.width, img.height, px ?? new Uint8Array(img.width * img.height * 4)) });
				})();
			}
			forward();
			break;
		case "browse":
			if (!m.embedded) forward();
			break;
		case "link": // link(): tg's Github, wiki and forum verbs; the page opens the web address (worker/index.html, openLink)
			forward();
			break;
		case "winset":
			post({ type: "popwinset", player: m.client, id: m.id, params: String(m.params) }); // page applies it if it names a popup
			break;
		case "sound":
			post({ ...m, player: m.client });
			inLog(`[vm-boot] sound ${JSON.stringify(m).slice(0, cutAt(300))}${by(MP?.ckey ?? String(m.client))}`); // the page plays it (worker/sound.js)
			break;
		case "stat":
			post({ ...m, player: m.client });
			inLog(`[vm-boot] stat ${JSON.stringify(m).slice(0, cutAt(400))}${by(MP?.ckey ?? String(m.client))}`); // statpanel tabs and lines
			break;
		case "refused":
			{ // IsBanned said no: tools/server.mjs shows the player why and closes the connection
				const r = m.reason as unknown;
				const why = typeof r === "string" ? r : r && typeof r === "object" ? String((r as Record<string, unknown>).desc ?? "") : "";
				post({ type: "refused", player: m.client, reason: ("You are banned from this server. " + why).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() });
			}
			break;
		case "disconnect":
			post({ type: "disconnect", player: m.client }); // del(client), tg's kick: the server closes that connection
			break;
		case "dialog":
			post({ ...m, player: m.client });
			inLog(`[vm-boot] dialog ${JSON.stringify(m).slice(0, cutAt(300))}${by(MP?.ckey ?? String(m.client))}`); // input()/alert() for the page
			break;
	}
};
// a link/form in a popup or the output pane. `byond://winset?...` runs winset; anything else is Topic (href without the "byond://" and "?").
onTopic = (href, player) => {
	const P = playerOf(player), c = P?.client;
	if (!P || !c || !P.joined) return;
	href = href.replace(/^byond:\/\//i, "");
	inLog(`[vm-boot] topic ${JSON.stringify(href).slice(0, cutAt(300))} at world.time ${vm.sched.time}${by(P.ckey)}`);
	clickLogUntil = vm.sched.time + 20;
	if (/^winset\?/i.test(href)) { // winset?id=win&param=value&command=text (values url-encoded)
		const q = new URLSearchParams(href.slice(7)), id = q.get("id");
		q.delete("id");
		vm.clients.winset(c, id, [...q].map(([k, v]) => `${k}=${v.includes(";") || v.includes(" ") ? `"${v.replace(/"/g, '\\"')}"` : v}`).join(";"), true);
		const cmd = q.get("command");
		if (cmd && linkCommandOk(cmd)) vm.clients.typeLine(c, cmd);
		return;
	}
	if (href.startsWith("?")) href = href.slice(1);
	vm.clients.topic(c, href);
};
onBugState = (player) => { // the player's state for an F9 bug report (things that silence or block a player without an error)
	const out: string[] = [`world.time ${vm.sched.time}, tick ${vm.sched.tick}, ${vm.sched.sleeping} sleeping threads, joined ${ctx.joined}`];
	const show = (v: unknown): string => { const l = live(v as never) as unknown; return l instanceof DMObject ? l.type.path : l instanceof DMList ? `list(${l.len})` : JSON.stringify(l); };
	const vars = (o: DMObject, names: string[]) => names.filter((n) => o.hasVar(n)).map((n) => `${n}=${show(o.getVar(n))}`).join(" ");
	try {
		const c = playerOf(player)?.client;
		if (!c) out.push("no client");
		else {
			out.push("client: " + vars(c, ["key", "ambience_playing", "played", "eye", "view"]));
			const prefs = live(c.getVar("prefs") as never) as unknown;
			if (prefs instanceof DMObject) out.push("prefs: " + vars(prefs, ["toggles", "chat_toggles"]));
			const mob = live(c.getVar("mob") as never) as unknown;
			if (mob instanceof DMObject) {
				type Loc = DMObject & { loc?: Loc | null; x?: number; y?: number; z?: number };
				const chain: string[] = []; let t = (mob as Loc).loc ?? null;
				while (t && t.loc && !t.type.path.startsWith("/turf")) { chain.push(t.type.path); t = t.loc; } // inside a locker, pipe, mech...: walk out to the turf
				out.push(`mob: ${mob.type.path} on ${t ? `${t.type.path} ${t.x},${t.y},${t.z}` : "no turf (nullspace)"}${chain.length ? " inside " + chain.join(" < ") : ""} ` + vars(mob, ["name", "stat", "ear_deaf", "disabilities", "sleeping", "health", "ears", "status_flags"]));
				const io = mob.hasVar("internal_organs") ? live(mob.getVar("internal_organs") as never) as unknown : null;
				if (io instanceof DMList) for (const q of io.items) { const e = live(q as never) as unknown; if (e instanceof DMObject && e.type.path.startsWith("/obj/item/organ/ears")) out.push(`ears organ: ${e.type.path} ` + vars(e, ["deaf", "ear_damage", "bang_protect"])); }
				const eh = mob.hasVar("ears") ? live(mob.getVar("ears") as never) as unknown : null;
				if (eh instanceof DMObject) { const sf = live(eh.getVar("secondary_flags") as never) as unknown; out.push(`ear slot: ${eh.type.path} secondary_flags=${sf instanceof DMList ? JSON.stringify(sf.items.map((x) => show(x))) : show(sf)}`); }
			} else out.push("mob: " + show(mob));
		}
		// memory, to tell a growing heap (longer browser GC pauses) from a one-off. Firefox gives a worker no
		// JS heap size, so these are the game's own object counts; performance.memory is Chrome-only.
		const pm = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
		out.push(`memory: ${vm.map.atoms.size} atoms, ${refTable().size} refs, ${heap.zct.length} awaiting free${pm ? `, JS heap ${(pm.usedJSHeapSize / 1048576).toFixed(0)} MB` : ""}`);
		out.push(`late wake-ups >200 ms (last 10): ${lateWakes.length ? lateWakes.join("; ") : "none"}`);
	} catch (err) { out.push("state read failed: " + (err as Error).message); }
	post({ type: "bugstate", player: playerOf(player)?.ckey ?? player, text: out.join("\n") }); // never undefined for a sender the game doesn't know yet: the server sends those to all
};
onWinclose = (name, player) => { const P = playerOf(player), c = P?.client; if (c && P.joined) { inLog(`[vm-boot] window ${name} closed${by(P.ckey)}`); vm.clients.closeWindow(c, name); } };
onStat = (name, idx, player) => { const P = playerOf(player), c = P?.client; if (!P || !c || !P.joined)
	return; if (name !== null)
	vm.clients.setStatPanel(c, name);
else {
	clickLogUntil = vm.sched.time + 20;
	inLog(`[vm-boot] stat line ${idx} clicked: ${vm.clients.statClick(c, idx)} at world.time ${vm.sched.time}${by(P.ckey)}`);
} };
onAnswer = (id, value, player) => { const P = playerOf(player); if (!P) return; inLog(`[vm-boot] dialog ${id} answered ${JSON.stringify(value).slice(0, cutAt(300))}${by(P.ckey)}`); vm.clients.answer(id, value, P.ckey); }; // ps-security: only the asked player's answer counts
onCommand = (text, speech, player) => { // a line from the page's input box
	const P = playerOf(player), c = P?.client;
	if (!P || !c || !P.joined) return;
	if (speech !== undefined && !vm.clients.isVerbLine(c, text)) text = speech; // the say box: a line that starts with a verb runs as typed, anything else is the speech
	inLog(`[vm-boot] command ${JSON.stringify(text).slice(0, cutAt(300))} at world.time ${vm.sched.time}${by(P.ckey)}`);
	clickLogUntil = vm.sched.time + 20;
	vm.clients.typeLine(c, text);
};
// the page says the player started/stopped typing in a say/me/whisper/radio channel: tg's hidden client verb adds/removes the bubble.
onTyping = (on, player) => {
	const P = playerOf(player), c = P?.client;
	if (!P || !c || !P.joined) return;
	inLog(`[vm-boot] typing ${on ? "started" : "stopped"} at world.time ${vm.sched.time}${by(P.ckey)}`);
	vm.clients.typeLine(c, `typing-indicator ${on ? 1 : 0}`);
};
const HUD_TOGGLE = /^\/obj\/screen\/(throw_catch|mov_intent|act_intent|swap_hand|inventory\/hand)/;
const MIDDLE = /(^|;)middle=1(;|$)/; // a plain middle click swaps hands (MiddleClickOn)
onClick = (m) => {
	const P = playerOf(m.player), c = P?.client;
	if (!P || !c || !P.joined) return;
	const object = m.id === null ? null : P.differ.objectOf(m.id);
	inLog(`[vm-boot] ${m.dbl ? "DblClick" : "Click"} ${object ? `${object.type.path} "${stringify(object.getVar("name"))}"` : "(no object: stale id " + m.id + ")"} at tile ${m.x},${m.y} params ${m.params} at world.time ${vm.sched.time}${by(P.ckey)}`);
	if (object && (MIDDLE.test(m.params) || (HUD_TOGGLE.test(object.type.path) && P.differ.isScreen(object)))) P.differ.resendScreen((o) => HUD_TOGGLE.test(o.type.path)); // netcode 2: the page guessed the toggle; the answer carries the real look (a refused click puts it back)
	const mob = live(c.getVar("mob") as never) as unknown;
	if (object && !P.differ.isScreen(object) && mob instanceof DMObject && mob.hasVar("in_throw_mode") && live(mob.getVar("in_throw_mode") as never)) P.differ.resendScreen((o) => HUD_TOGGLE.test(o.type.path) || !o.type.path.startsWith("/obj/screen")); // netcode 3: the page hid the held item and flipped throw mode off; a refused throw sends both back
	const pick = object && P.differ.isPick(object) ? object : null; // predicted pick-up: the page may have put it in your hand; the answer carries its look, so a refused one shows back on the floor
	const put = object ? P.differ.putFor(object) : null; // predicted put-down: the page may have put the held item on this table; the answer carries its look, so a refused one shows back in the hand
	const after = pick ? () => { P.differ.resendObj(pick); compileQueued(mob); } : put ? () => { P.differ.resendScreen((o) => o === put); compileQueued(mob); } : null;
	if (object) vm.clients.click(c, { object, x: m.x, y: m.y, dbl: m.dbl, control: m.control, params: m.params, ...(after ? { after } : {}) });
	clickLogUntil = vm.sched.time + 20;
	if (object && ctx.idle && opts.clickNow !== false) clickAtOnce(P); // server.mjs --no-click-now: at the next tick, as before
};
// netcode 1: a click that arrives between ticks runs at once, and its player gets a view straight after, marked now: 1 (the page
// shows it without the jitter buffer's hold), so the answer doesn't wait up to a tick. The others see its effects with the next tick's view.
/** An object's overlays queued for SSoverlays (OVERLAY_QUEUED, flags 256), compiled now: a pick-up's in-hand sprite is in the click's answer, not a tick later. */
const compileQueued = (o: unknown) => {
	if (o instanceof DMObject && (Number(o.getVar("flags")) & 256)) { const co = o.type.procs.get("compile_overlays"); if (co) vm.call(co, [], o, null); }
};
const clickAtOnce = (P: Player) => {
	if (P.views === 0 || resyncRequested.has(P.ckey) || (P === players[0] && resyncRequested.has("")) || !vm.clients.runClicks(P.client)) return;
	// tg changes overlays through SSoverlays' queue (OVERLAY_QUEUED, flag 256), compiled at its next fire: a hand swap's hand_active outline
	// would only show a tick later, so this answer would carry the old look and the page's guess would flicker. Compile the HUD toggles now (the fire does it again, the same).
	const scr = live(P.client.getVar("screen"));
	if (scr instanceof DMList) for (const o of scr.items) {
		const s = live(o);
		if (s instanceof DMObject && HUD_TOGGLE.test(s.type.path) && (Number(s.getVar("flags")) & 256)) { const co = s.type.procs.get("compile_overlays"); if (co) vm.call(co, [], s, null); }
	}
	const evs = vm.animLog?.length ? vm.animLog.slice() : null;
	const update = P.differ.update(vm, false, P.client);
	if (evs) { vm.animLog!.push(...evs); P.animSeen ??= new Set(); for (const e of evs) P.animSeen.add(e); } // kept for the other players' next views, not given to this one twice
	if (vm.runtimeIcons.size) fixAppIcons(update.apps);
	if (P.outLines.length) { post({ type: "output", player: P.ckey, lines: P.outLines }); P.outLines = []; }
	post({ type: "view", player: P.ckey, update: { ...update, now: 1 } });
	P.views++;
};
// a right-click on a map tile. With client.show_popup_menus on and some verb to list, the page gets the menu and
// the click is not sent (BYOND); with it off, or nothing to list, it is an ordinary Click with right=1.
onMenu = (m) => {
	const P = playerOf(m.player), c = P?.client;
	if (!P || !c || !P.joined) return;
	const differ = P.differ;
	const one = m.one === undefined ? null : differ.objectOf(m.one); // a screen object: just that one
	const objs = m.one !== undefined ? (one ? [one] : []) : differ.tileObjects(m.x, m.y);
	const on = c.getVar("show_popup_menus");
	const menu = on === 0 ? null : vm.clients.popupMenu(c, objs);
	inLog(`[vm-boot] right-click menu at ${m.one !== undefined ? `screen object ${m.one}` : `tile ${m.x},${m.y}`}: ${menu ? menu.items.map((i) => `${i.name} (${i.verbs.length})`).join(", ") || "(nothing to list)" : "(show_popup_menus off)"}${by(P.ckey)}`);
	if (menu && menu.items.length) post({ type: "menu", player: P.ckey, id: menu.id, sx: m.sx, sy: m.sy, items: menu.items });
	else onClick?.({ ...m.click, player: m.player });
};
onMenuPick = (m) => {
	const P = playerOf(m.player), c = P?.client;
	if (!P || !c || !P.joined) return;
	inLog(`[vm-boot] right-click menu pick: ${vm.clients.popupPick(c, m.id, m.a, m.v)} at world.time ${vm.sched.time}${by(P.ckey)}`);
	clickLogUntil = vm.sched.time + 20;
};
// MouseDown/MouseUp/MouseDrop. Logged only when the game has the proc (client's or the object's), so plain presses stay quiet.
onMouse = (m) => {
	const P = playerOf(m.player), c = P?.client;
	if (!P || !c || !P.joined || m.id === null) return;
	const object = P.differ.objectOf(m.id);
	const over = m.over == null ? null : P.differ.objectOf(m.over);
	if (!object) return;
	if (m.proc === "MouseDrop" || c.type.procs.has(m.proc) || object.type.procs.has(m.proc)) {
		// the new kinds log their first few (a move stream would flood the log), all are counted.
		if (m.proc !== "MouseDown" && m.proc !== "MouseUp" && m.proc !== "MouseDrop" && (mouseSeen[m.proc] = (mouseSeen[m.proc] ?? 0) + 1) <= 6)
			inLog(`[vm-boot] ${m.proc} ${object.type.path} "${stringify(object.getVar("name"))}"${over ? ` over ${over.type.path}` : ""} at tile ${m.x},${m.y}${m.dx !== undefined ? ` delta ${m.dx},${m.dy}` : ""} params ${m.params} at world.time ${vm.sched.time}${by(P.ckey)}`);
		if (m.proc === "MouseDrop") inLog(`[vm-boot] MouseDrop ${object.type.path} "${stringify(object.getVar("name"))}" onto ${over ? `${over.type.path} "${stringify(over.getVar("name"))}"` : "(nothing)"} at tile ${m.ox},${m.oy} params ${m.params} at world.time ${vm.sched.time}${by(P.ckey)}`);
		vm.clients.click(c, { object, x: m.x, y: m.y, dbl: false, control: m.control, params: m.params, proc: m.proc, over, ox: m.ox, oy: m.oy, dx: m.dx, dy: m.dy });
		if (m.proc === "MouseDrop") clickLogUntil = vm.sched.time + 20;
	}
};
}
