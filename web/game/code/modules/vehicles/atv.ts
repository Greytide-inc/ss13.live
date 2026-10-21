// From code/modules/vehicles/atv.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13060, "/obj/vehicle/atv", "/obj/vehicle", {
	name: "all-terrain vehicle",
	desc: "An all-terrain vehicle built for traversing rough terrain with ease. One of the few old-earth technologies that are still relevant on most planet-bound outposts.",
	icon_state: "atv",
}, { global: { atvcover: 809 } });

// /obj/vehicle/atv/proc/buckle_mob  (code/modules/vehicles/atv.dm:9)  may sleep
rt.def("/obj/vehicle/atv/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/atv"), [])));
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });

// /obj/vehicle/atv/proc/Initialize  (code/modules/vehicles/atv.dm:13)
rt.def("/obj/vehicle/atv/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setGl("atvcover", (rt.gl("atvcover") || rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "atvcover", 4.099999904632568])));
	return f.dot;
});

// /obj/vehicle/atv/proc/post_buckle_mob  (code/modules/vehicles/atv.dm:18)
rt.def("/obj/vehicle/atv/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	if (truthy(rt.callSrc(f, "has_buckled_mobs", []))) {
		rt.callSrc(f, "add_overlay", [rt.gl("atvcover")]);
	} else {
		rt.callSrc(f, "cut_overlay", [rt.gl("atvcover")]);
	}
	return f.dot;
});

rt.type(13061, "/obj/vehicle/atv/turret", "/obj/vehicle/atv", {
	turret: null,
});

// /obj/vehicle/atv/turret/proc/Initialize  (code/modules/vehicles/atv.dm:38)  may sleep
rt.def("/obj/vehicle/atv/turret/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "turret", (yield* g.new_(f, T("/obj/machinery/porta_turret/syndicate/vehicle_turret"), [rt.sv(f, "loc")])));
	rt.setFv(f, "base", rt.sv(f, "turret"), live(f.src));
	return f.dot;
}, true);

// /obj/vehicle/atv/turret/proc/buckle_mob  (code/modules/vehicles/atv.dm:43)  may sleep
rt.def("/obj/vehicle/atv/turret/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/atv/turret"), [])));
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });
