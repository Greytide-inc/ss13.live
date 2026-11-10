// Based on /tg/station's code/_onclick/hud/ghost.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11115, "/obj/screen/ghost", "/obj/screen", {
	icon: rt.rsc("icons/mob/screen_ghost.dmi"),
});

// ghost.dm:5
rt.def("/obj/screen/ghost/proc/MouseEntered", function MouseEntered(f: Frame) {
	flick(this.icon_state + "_anim", this);
	return f.dot;
});

rt.type(11116, "/obj/screen/ghost/jumptomob", "/obj/screen/ghost", {
	name: "Jump to mob",
	icon_state: "jumptomob",
});

// ghost.dm:12
rt.def("/obj/screen/ghost/jumptomob/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	yield* (G = f.usr).jumptomob();
	return f.dot;
}, true);

rt.type(11117, "/obj/screen/ghost/orbit", "/obj/screen/ghost", {
	name: "Orbit",
	icon_state: "orbit",
});

// ghost.dm:20
rt.def("/obj/screen/ghost/orbit/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	yield* (G = f.usr).follow();
	return f.dot;
}, true);

rt.type(11118, "/obj/screen/ghost/reenter_corpse", "/obj/screen/ghost", {
	name: "Reenter corpse",
	icon_state: "reenter_corpse",
});

// ghost.dm:28
rt.def("/obj/screen/ghost/reenter_corpse/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	G = f.usr;
	if (is_creative()) yield* G.become_human(); // tg_js: on the Creative map it's Become human (modules/creative/creative.ts)
	else yield* G.reenter_corpse();
	return f.dot;
}, true);

rt.type(11119, "/obj/screen/ghost/teleport", "/obj/screen/ghost", {
	name: "Teleport",
	icon_state: "teleport",
});

// ghost.dm:36
rt.def("/obj/screen/ghost/teleport/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	yield* (G = f.usr).dead_tele();
	return f.dot;
}, true);

rt.type(11120, "/obj/screen/ghost/pai", "/obj/screen/ghost", {
	name: "pAI Candidate",
	icon_state: "pai",
});

// ghost.dm:44
rt.def("/obj/screen/ghost/pai/proc/Click", function Click(f: Frame) {
	let G: Value = null;
	(G = f.usr).register_pai();
	return f.dot;
});

// tg_js: zoom buttons (same effect as the admin Debug > Zoom In / Zoom Out / Reset Zoom verbs; per client).
// Sprites: icons/mob/screen_ghost.dmi states zoom_in, zoom_out, zoom_reset ("+", "-", "1x").
rt.type("/obj/screen/ghost/zoom_in", "/obj/screen/ghost", {
	name: "Zoom In",
	icon_state: "zoom_in",
});
rt.def("/obj/screen/ghost/zoom_in/proc/Click", function* Click(f: Frame) {
	const c = f.usr.client;
	if (c) yield* c.zoom_view(-1, 0);
	return f.dot;
}, true);

rt.type("/obj/screen/ghost/zoom_out", "/obj/screen/ghost", {
	name: "Zoom Out",
	icon_state: "zoom_out",
});
rt.def("/obj/screen/ghost/zoom_out/proc/Click", function* Click(f: Frame) {
	const c = f.usr.client;
	if (c) yield* c.zoom_view(1, 0);
	return f.dot;
}, true);

rt.type("/obj/screen/ghost/zoom_reset", "/obj/screen/ghost", {
	name: "Reset Zoom",
	icon_state: "zoom_reset",
});
rt.def("/obj/screen/ghost/zoom_reset/proc/Click", function* Click(f: Frame) {
	const c = f.usr.client;
	if (c) yield* c.zoom_view(0, 0);
	return f.dot;
}, true);

rt.type(72, "/datum/hud/ghost", "/datum/hud", {});

// ghost.dm:48
rt.def("/datum/hud/ghost/proc/New", function* New(f: Frame) {
	let using: Value = null;
	if (f.args[1] === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* parent_proc();
	(using = (yield* new_(T("/obj/screen/ghost/jumptomob")))).screen_loc = "SOUTH:6,CENTER-2:24";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ghost/orbit")))).screen_loc = "SOUTH:6,CENTER-1:24";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ghost/reenter_corpse")))).screen_loc = "SOUTH:6,CENTER:24";
	this.static_inventory += using;
	if (is_creative()) yield* this.add_creative_buttons(using); // tg_js: modules/creative/creative.ts
	(using = (yield* new_(T("/obj/screen/ghost/teleport")))).screen_loc = "SOUTH:6,CENTER+1:24";
	this.static_inventory += using;
	if (!is_creative()) { // tg_js: no pAI Recruit button on Creative
		(using = (yield* new_(T("/obj/screen/ghost/pai")))).screen_loc = "SOUTH: 6, CENTER+2:24";
		this.static_inventory += using;
	}
	if (!rt.onServer()) { // tg_js: zoom is single-player only
		(using = (yield* new_(T("/obj/screen/ghost/zoom_in")))).screen_loc = "SOUTH:6,CENTER+4:24";
		this.static_inventory += using;
		(using = (yield* new_(T("/obj/screen/ghost/zoom_out")))).screen_loc = "SOUTH:6,CENTER+5:24";
		this.static_inventory += using;
		(using = (yield* new_(T("/obj/screen/ghost/zoom_reset")))).screen_loc = "SOUTH:6,CENTER+6:24";
		this.static_inventory += using;
	}
	(using = (yield* new_(T("/obj/screen/language_menu")))).icon = f.args[1];
	using.screen_loc = "EAST:-4,SOUTH:4"; // tg_js: bottom-right corner, out of the zoom buttons' way
	this.static_inventory += using;
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// ghost.dm:76
rt.def("/datum/hud/ghost/proc/show_hud", function* show_hud(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	yield* parent_proc();
	if (!this.mymob.client.prefs.ghost_hud) {
		this.mymob.client.screen -= this.static_inventory;
	} else {
		this.mymob.client.screen += this.static_inventory;
	}
	return f.dot;
}, true, { args: ["version", "viewmob"] });

// ghost.dm:83
rt.def("/mob/dead/observer/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/ghost"), this, ui_style2icon(this.client.prefs.UI_style)));
	return f.dot;
}, true);
