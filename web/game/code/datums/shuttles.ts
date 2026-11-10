// Based on /tg/station's code/datums/shuttles.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// shuttles.dm:20
rt.def("/datum/map_template/shuttle/proc/New", function* New(f: Frame) {
	this.shuttle_id = `${this.port_id}_${this.suffix}`;
	this.mappath = `${this.prefix}${this.shuttle_id}.dmm`;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(824, "/datum/map_template/shuttle/emergency/airless", "/datum/map_template/shuttle/emergency", {
	suffix: "airless",
	description: "Save money by building your own shuttle! The chassis will dock upon purchase, but launch will have to be authorized as usual via shuttle call. Interior and atmosphere not included.",
	admin_notes: "No brig, no medical facilities, no air.",
	credit_cost: -7500,
	name: "Build your own shuttle kit",
});

// shuttles.dm:54
rt.def("/datum/map_template/shuttle/emergency/airless/proc/prerequisites_met", function prerequisites_met(f: Frame) {
	return (rt.worldTime(f) - GLOB.SSticker.round_start_time < 6000 ? 1 : 0);
});

// shuttles.dm:58
rt.def("/datum/map_template/shuttle/emergency/airless/proc/on_bought", function on_bought(f: Frame) {
	let _P: Value = null;
	(_P = rt.index(GLOB.SSshuttle.supply_packs, T("/datum/supply_pack/engineering/shuttle_engine"))).special_enabled = 1;
	return f.dot;
});

rt.type(830, "/datum/map_template/shuttle/emergency/arena", "/datum/map_template/shuttle/emergency", {
	suffix: "arena",
	description: "The crew must pass through an otherworldy arena to board this shuttle. Expect massive casualties. The source of the Bloody Signal must be tracked down and eliminated to unlock this shuttle.",
	admin_notes: "RIP AND TEAR.",
	credit_cost: 10000,
	name: "The Arena",
});

// shuttles.dm:106
rt.def("/datum/map_template/shuttle/emergency/arena/proc/prerequisites_met", function prerequisites_met(f: Frame) {
	if (rt.isIn(f, "bubblegum", GLOB.SSshuttle.shuttle_purchase_requirements_met)) {
		return 1;
	}
	return 0;
});
