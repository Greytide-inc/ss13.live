// Based on /tg/station's code/modules/vehicles/bicycle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13062, "/obj/vehicle/bicycle", "/obj/vehicle", {
	easter_egg_chance: 1,
	name: "bicycle",
	desc: "Keep away from electricity.",
	icon_state: "bicycle",
}, { global: { bike_music: 810 } });

// bicycle.dm:11
rt.def("/obj/vehicle/bicycle/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	this.riding_datum = new_(T("/datum/riding/bicycle"));
	return f.dot;
});

// bicycle.dm:15
rt.def("/obj/vehicle/bicycle/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (prob(this.easter_egg_chance) || GLOB.SSevents.holidays && rt.index(GLOB.SSevents.holidays, "April Fool's Day")) {
		rt.op(f, "Output", [], [f.args[0], (yield* sound(pick(GLOB.bike_music), { repeat: 1, wait: 0, volume: 80, channel: 42 }))], false);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// bicycle.dm:21
rt.def("/obj/vehicle/bicycle/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[0]) {
		rt.op(f, "Output", [], [f.args[0], (yield* sound(null, { repeat: 0, wait: 0, volume: 80, channel: 42 }))], false);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["buckled_mob", "force"] });

// bicycle.dm:25
rt.def("/obj/vehicle/bicycle/proc/tesla_act", function* tesla_act(f: Frame) {
	let m: Value = null;
	this.name = "fried bicycle";
	this.desc = "Well spent.";
	this.riding_datum = null;
	this.color = "#3f1704";
	for (m of each(this.buckled_mobs)) {
		yield* this.unbuckle_mob(m, 1);
	}
	return f.dot;
}, true);
