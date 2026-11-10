// Based on /tg/station's code/modules/vehicles/atv.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13060, "/obj/vehicle/atv", "/obj/vehicle", {
	name: "all-terrain vehicle",
	desc: "An all-terrain vehicle built for traversing rough terrain with ease. One of the few old-earth technologies that are still relevant on most planet-bound outposts.",
	icon_state: "atv",
}, { global: { atvcover: 809 } });

// atv.dm:9
rt.def("/obj/vehicle/atv/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* parent_proc());
	this.riding_datum = (yield* new_(T("/datum/riding/atv")));
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });

// atv.dm:13
rt.def("/obj/vehicle/atv/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	GLOB.atvcover = (GLOB.atvcover || mutable_appearance(this.icon, "atvcover", ABOVE_MOB_LAYER));
	return f.dot;
});

// atv.dm:18
rt.def("/obj/vehicle/atv/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	if (this.has_buckled_mobs()) {
		this.add_overlay(GLOB.atvcover);
	} else {
		this.cut_overlay(GLOB.atvcover);
	}
	return f.dot;
});

rt.type(13061, "/obj/vehicle/atv/turret", "/obj/vehicle/atv", {
	turret: null,
});

// atv.dm:38
rt.def("/obj/vehicle/atv/turret/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.turret = (yield* new_(T("/obj/machinery/porta_turret/syndicate/vehicle_turret"), this.loc));
	this.turret.base = this;
	return f.dot;
}, true);

// atv.dm:43
rt.def("/obj/vehicle/atv/turret/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* parent_proc());
	this.riding_datum = (yield* new_(T("/datum/riding/atv/turret")));
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });
