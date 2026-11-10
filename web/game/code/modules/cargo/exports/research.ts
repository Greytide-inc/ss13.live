// Based on /tg/station's code/modules/cargo/exports/research.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2045, "/datum/export/tech", "/datum/export", {
	techLevels: null,
	cost: 500,
	unit_name: "technology data disk",
	export_types: null,
});

// research.dm:6
rt.def("/datum/export/tech/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.techLevels = list();

	this.export_types = list(T("/obj/item/weapon/disk/tech_disk"));
	return f.dot;
});

// research.dm:9
rt.def("/datum/export/tech/proc/get_cost", function get_cost(f: Frame, O: Value) {
	let V: Value = null, tech: Value = null;
	let D: Value = O;
	let cost: Value = 0;
	for (V of each(D.tech_stored)) {
		if (!V) {
			continue;
		}
		cost += (tech = V).getCost(rt.index(this.techLevels, tech.id));
	}
	return parent_proc() * cost;
}, false);

// research.dm:19
rt.def("/datum/export/tech/proc/sell_object", function sell_object(f: Frame, O: Value) {
	let V: Value = null, tech: Value = null;
	parent_proc();
	let D: Value = O;
	for (V of each(D.tech_stored)) {
		if (!V) {
			continue;
		}
		tech = V;
		rt.setAt(this.techLevels, tech.id, max(rt.index(this.techLevels, tech.id), tech.level));
	}
	return f.dot;
}, false);
