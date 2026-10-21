// From code/datums/shuttles.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(822, "/datum/map_template/shuttle", "/datum/map_template", {
	prefix: "_maps/shuttles/",
	suffix: null,
	port_id: null,
	shuttle_id: null,
	description: null,
	prerequisites: null,
	admin_notes: null,
	credit_cost: 1e+31,
	can_be_bought: 1,
	name: "Base Shuttle Template",
});

// /datum/map_template/shuttle/proc/New  (code/datums/shuttles.dm:20)  may sleep
rt.def("/datum/map_template/shuttle/proc/New", function* New(f: Frame) {
	rt.setSv(f, "shuttle_id", fmt("＀_＀", [rt.sv(f, "port_id"), rt.sv(f, "suffix")]));
	rt.setSv(f, "mappath", fmt("＀＀.dmm", [rt.sv(f, "prefix"), rt.sv(f, "shuttle_id")]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(824, "/datum/map_template/shuttle/emergency/airless", "/datum/map_template/shuttle/emergency", {
	suffix: "airless",
	description: "Save money by building your own shuttle! The chassis will dock upon purchase, but launch will have to be authorized as usual via shuttle call. Interior and atmosphere not included.",
	admin_notes: "No brig, no medical facilities, no air.",
	credit_cost: -7500,
	name: "Build your own shuttle kit",
});

// /datum/map_template/shuttle/emergency/airless/proc/prerequisites_met  (code/datums/shuttles.dm:54)
rt.def("/datum/map_template/shuttle/emergency/airless/proc/prerequisites_met", function prerequisites_met(f: Frame) {
	return (rt.lt(subtract(rt.worldTime(f), rt.fv(f, "round_start_time", rt.gl("SSticker"))), 6000) ? 1 : 0);
});

// /datum/map_template/shuttle/emergency/airless/proc/on_bought  (code/datums/shuttles.dm:58)
rt.def("/datum/map_template/shuttle/emergency/airless/proc/on_bought", function on_bought(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	rt.setFv(f, "special_enabled", (_P = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), T("/datum/supply_pack/engineering/shuttle_engine"))), 1);
	return f.dot;
});

rt.type(830, "/datum/map_template/shuttle/emergency/arena", "/datum/map_template/shuttle/emergency", {
	suffix: "arena",
	description: "The crew must pass through an otherworldy arena to board this shuttle. Expect massive casualties. The source of the Bloody Signal must be tracked down and eliminated to unlock this shuttle.",
	admin_notes: "RIP AND TEAR.",
	credit_cost: 10000,
	name: "The Arena",
});

// /datum/map_template/shuttle/emergency/arena/proc/prerequisites_met  (code/datums/shuttles.dm:106)
rt.def("/datum/map_template/shuttle/emergency/arena/proc/prerequisites_met", function prerequisites_met(f: Frame) {
	if (truthy((rt.isIn(f, "bubblegum", rt.fv(f, "shuttle_purchase_requirements_met", rt.gl("SSshuttle"))) ? 1 : 0))) {
		return 1;
	}
	return 0;
});
