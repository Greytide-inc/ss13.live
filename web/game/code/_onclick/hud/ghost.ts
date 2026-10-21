// From code/_onclick/hud/ghost.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11115, "/obj/screen/ghost", "/obj/screen", {
	icon: rt.rsc("icons/mob/screen_ghost.dmi"),
});

// /obj/screen/ghost/proc/MouseEntered  (code/_onclick/hud/ghost.dm:5)
rt.def("/obj/screen/ghost/proc/MouseEntered", function MouseEntered(f: Frame) {
	rt.call(f, P("/proc/flick"), null, [add(rt.sv(f, "icon_state"), "_anim"), live(f.src)]);
	return f.dot;
});

rt.type(11116, "/obj/screen/ghost/jumptomob", "/obj/screen/ghost", {
	name: "Jump to mob",
	icon_state: "jumptomob",
});

// /obj/screen/ghost/jumptomob/proc/Click  (code/_onclick/hud/ghost.dm:12)  may sleep
rt.def("/obj/screen/ghost/jumptomob/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	yield* g.callName(f, (G = live(f.usr)), "jumptomob", []);
	return f.dot;
}, true);

rt.type(11117, "/obj/screen/ghost/orbit", "/obj/screen/ghost", {
	name: "Orbit",
	icon_state: "orbit",
});

// /obj/screen/ghost/orbit/proc/Click  (code/_onclick/hud/ghost.dm:20)  may sleep
rt.def("/obj/screen/ghost/orbit/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	yield* g.callName(f, (G = live(f.usr)), "follow", []);
	return f.dot;
}, true);

rt.type(11118, "/obj/screen/ghost/reenter_corpse", "/obj/screen/ghost", {
	name: "Reenter corpse",
	icon_state: "reenter_corpse",
});

// /obj/screen/ghost/reenter_corpse/proc/Click  (code/_onclick/hud/ghost.dm:28)  may sleep
rt.def("/obj/screen/ghost/reenter_corpse/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	yield* g.callName(f, (G = live(f.usr)), "reenter_corpse", []);
	return f.dot;
}, true);

rt.type(11119, "/obj/screen/ghost/teleport", "/obj/screen/ghost", {
	name: "Teleport",
	icon_state: "teleport",
});

// /obj/screen/ghost/teleport/proc/Click  (code/_onclick/hud/ghost.dm:36)  may sleep
rt.def("/obj/screen/ghost/teleport/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	yield* g.callName(f, (G = live(f.usr)), "dead_tele", []);
	return f.dot;
}, true);

rt.type(11120, "/obj/screen/ghost/pai", "/obj/screen/ghost", {
	name: "pAI Candidate",
	icon_state: "pai",
});

// /obj/screen/ghost/pai/proc/Click  (code/_onclick/hud/ghost.dm:44)
rt.def("/obj/screen/ghost/pai/proc/Click", function Click(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	rt.callName(f, (G = live(f.usr)), "register_pai", []);
	return f.dot;
});

// tg_js: zoom buttons (same effect as the admin Debug > Zoom In / Zoom Out / Reset Zoom verbs; per client).
// Sprites: icons/mob/screen_ghost.dmi states zoom_in, zoom_out, zoom_reset ("+", "-", "1x").
rt.type("/obj/screen/ghost/zoom_in", "/obj/screen/ghost", {
	name: "Zoom In",
	icon_state: "zoom_in",
});
rt.def("/obj/screen/ghost/zoom_in/proc/Click", function* Click(f: Frame) {
	const c = rt.fv(f, "client", live(f.usr));
	if (truthy(c)) yield* g.callName(f, c, "zoom_view", [-1, 0]);
	return f.dot;
}, true);

rt.type("/obj/screen/ghost/zoom_out", "/obj/screen/ghost", {
	name: "Zoom Out",
	icon_state: "zoom_out",
});
rt.def("/obj/screen/ghost/zoom_out/proc/Click", function* Click(f: Frame) {
	const c = rt.fv(f, "client", live(f.usr));
	if (truthy(c)) yield* g.callName(f, c, "zoom_view", [1, 0]);
	return f.dot;
}, true);

rt.type("/obj/screen/ghost/zoom_reset", "/obj/screen/ghost", {
	name: "Reset Zoom",
	icon_state: "zoom_reset",
});
rt.def("/obj/screen/ghost/zoom_reset/proc/Click", function* Click(f: Frame) {
	const c = rt.fv(f, "client", live(f.usr));
	if (truthy(c)) yield* g.callName(f, c, "zoom_view", [0, 0]);
	return f.dot;
}, true);

rt.type(72, "/datum/hud/ghost", "/datum/hud", {});

// /datum/hud/ghost/proc/New  (code/_onclick/hud/ghost.dm:48)  may sleep
rt.def("/datum/hud/ghost/proc/New", function* New(f: Frame) {
	let using: Value = null;
	f.vars = () => [using];
	if (live(f.args[1]) === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	using = null;
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ghost/jumptomob"), []))), "SOUTH:6,CENTER-2:24");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ghost/orbit"), []))), "SOUTH:6,CENTER-1:24");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ghost/reenter_corpse"), []))), "SOUTH:6,CENTER:24");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ghost/teleport"), []))), "SOUTH:6,CENTER+1:24");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ghost/pai"), []))), "SOUTH: 6, CENTER+2:24");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	if (!rt.onServer()) { // tg_js: zoom is single-player only
		rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ghost/zoom_in"), []))), "SOUTH:6,CENTER+4:24");
		rt.modSrcVar(f, "static_inventory", live(using), add);
		rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ghost/zoom_out"), []))), "SOUTH:6,CENTER+5:24");
		rt.modSrcVar(f, "static_inventory", live(using), add);
		rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ghost/zoom_reset"), []))), "SOUTH:6,CENTER+6:24");
		rt.modSrcVar(f, "static_inventory", live(using), add);
	}
	rt.setFv(f, "icon", (using = (yield* g.new_(f, T("/obj/screen/language_menu"), []))), live(f.args[1]));
	rt.setFv(f, "screen_loc", live(using), "EAST:-4,SOUTH:4"); // tg_js: bottom-right corner, out of the zoom buttons' way
	rt.modSrcVar(f, "static_inventory", live(using), add);
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// /datum/hud/ghost/proc/show_hud  (code/_onclick/hud/ghost.dm:76)  may sleep
rt.def("/datum/hud/ghost/proc/show_hud", function* show_hud(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.gv(f, "ghost_hud", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "mymob")))))) {
		(rt.modField(f, rt.fv(f, "client", rt.sv(f, "mymob")), "screen", rt.sv(f, "static_inventory"), subtract));
	} else {
		rt.modField(f, rt.fv(f, "client", rt.sv(f, "mymob")), "screen", rt.sv(f, "static_inventory"), add);
	}
	return f.dot;
}, true, { args: ["version", "viewmob"] });

// /mob/dead/observer/proc/create_mob_hud  (code/_onclick/hud/ghost.dm:83)  may sleep
rt.def("/mob/dead/observer/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/ghost"), [live(f.src), (yield* g.call(f, P("/proc/ui_style2icon"), null, [rt.gv(f, "UI_style", rt.fv(f, "prefs", rt.sv(f, "client")))]))])));
	return f.dot;
}, true);
