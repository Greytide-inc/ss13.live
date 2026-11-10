// Based on /tg/station's code/game/turfs/simulated/floor/light_floor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4564, "/turf/open/floor/light", "/turf/open/floor", {
	on: 1,
	state: 0,
	coloredlights: null,
	currentcolor: 1,
	can_modify_colour: 1,
	broken_states: null,
	name: "light floor",
	desc: "A wired glass tile embedded into the floor.",
	light_range: 5,
	icon_state: "light_on",
	floor_tile: rt.typePath("/obj/item/stack/tile/light"),
});

// light_floor.dm:7
rt.def("/turf/open/floor/light/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.broken_states = list("light_broken");
	this.coloredlights = list("g", "r", "y", "b", "p", "w", "s", "o", "g");
	return f.dot;
});

// light_floor.dm:16
rt.def("/turf/open/floor/light/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// light_floor.dm:20
rt.def("/turf/open/floor/light/proc/break_tile", function break_tile(f: Frame) {
	parent_proc();
	this.light_range = 0;
	this.update_light();
	return f.dot;
});

// light_floor.dm:25
rt.def("/turf/open/floor/light/proc/update_icon", function update_icon(f: Frame) {
	let num: Value = null;
	parent_proc();
	if (this.on) {
		if (this.state === 0) {
			this.icon_state = `light_on-${rt.index(this.coloredlights, this.currentcolor)}`;
			this.set_light(1);
		} else if (this.state === 1) {
			this.icon_state = `light_on_flicker${(num = pick("1", "2", "3", "4"))}`;
			this.set_light(1);
		} else if (this.state === 2) {
			this.icon_state = "light_on_broken";
			this.set_light(1);
		} else if (this.state === 3) {
			this.icon_state = "light_off";
			this.set_light(0);
		}
	} else {
		this.set_light(0);
		this.icon_state = "light_off";
	}
	return f.dot;
});

// light_floor.dm:47
rt.def("/turf/open/floor/light/proc/ChangeTurf", function* ChangeTurf(f: Frame, T: Value) {
	this.set_light(0);
	return (yield* parent_proc());
}, true);

// light_floor.dm:51
rt.def("/turf/open/floor/light/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.can_modify_colour) {
		return f.dot;
	}
	if (!this.on) {
		this.on = 1;
		this.currentcolor = 1;
		return f.dot;
	} else {
		this.currentcolor++;
	}
	if (this.currentcolor > rt.len(f, this.coloredlights)) {
		this.on = 0;
	}
	yield* this.update_icon();
	yield* parent_proc();
	return f.dot;
}, true);

// light_floor.dm:65
rt.def("/turf/open/floor/light/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// light_floor.dm:68
rt.def("/turf/open/floor/light/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!rt.istype(C, T("/obj/item/weapon/light/bulb"))) return f.dot;
	if (this.state && (yield* user.drop_item())) {
		yield* qdel(C);
		this.state = 0;
		yield* this.update_icon();
		to_chat(user, "<span class='notice'>You replace the light bulb.</span>");
	} else {
		to_chat(user, "<span class='notice'>The lightbulb seems fine, no need to replace it.</span>");
	}
	return f.dot;
}, true);

rt.type(4565, "/turf/open/floor/light/colour_cycle", "/turf/open/floor/light", {
	coloredlights: null,
	can_modify_colour: 0,
});

// light_floor.dm:82
rt.def("/turf/open/floor/light/colour_cycle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.coloredlights = list("cycle_all");
	return f.dot;
});

rt.type(4566, "/turf/open/floor/light/colour_cycle/dancefloor_a", "/turf/open/floor/light/colour_cycle", {
	coloredlights: null,
	name: "dancefloor",
	desc: "Funky floor.",
});

// light_floor.dm:92
rt.def("/turf/open/floor/light/colour_cycle/dancefloor_a/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.coloredlights = list("dancefloor_A");
	return f.dot;
});

rt.type(4567, "/turf/open/floor/light/colour_cycle/dancefloor_b", "/turf/open/floor/light/colour_cycle", {
	coloredlights: null,
	name: "dancefloor",
	desc: "Funky floor.",
});

// light_floor.dm:97
rt.def("/turf/open/floor/light/colour_cycle/dancefloor_b/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.coloredlights = list("dancefloor_B");
	return f.dot;
});
