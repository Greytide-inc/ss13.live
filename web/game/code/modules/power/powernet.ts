// Based on /tg/station's code/modules/power/powernet.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4177, "/datum/powernet", "/datum", {
	number: null,
	cables: null,
	nodes: null,
	load: 0,
	newavail: 0,
	avail: 0,
	viewavail: 0,
	viewload: 0,
	netexcess: 0,
});

// powernet.dm:7
rt.def("/datum/powernet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cables = list();

	this.nodes = list();
	return f.dot;
});

// powernet.dm:22
rt.def("/datum/powernet/proc/Destroy", function* Destroy(f: Frame) {
	let C: Value = null, M: Value = null;
	for (C of each(this.cables, T("/obj/structure/cable"))) {
		this.cables -= C;
		C.powernet = null;
	}
	for (M of each(this.nodes, T("/obj/machinery/power"))) {
		this.nodes -= M;
		M.powernet = null;
	}
	GLOB.SSmachines.powernets -= this;
	return (yield* parent_proc());
}, true);

// powernet.dm:33
rt.def("/datum/powernet/proc/is_empty", function is_empty(f: Frame) {
	return ((!rt.len(f, this.cables) ? 1 : 0) && (!rt.len(f, this.nodes) ? 1 : 0));
});

// powernet.dm:39
rt.def("/datum/powernet/proc/remove_cable", function* remove_cable(f: Frame, C: Value) {
	this.cables -= C;
	C.powernet = null;
	if (!this.is_empty()) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// powernet.dm:47
rt.def("/datum/powernet/proc/add_cable", function* add_cable(f: Frame, C: Value) {
	if (C.powernet) {
		if (C.powernet == this) {
			return f.dot;
		} else {
			yield* C.powernet.remove_cable(C);
		}
	}
	C.powernet = this;
	this.cables += C;
	return f.dot;
}, true);

// powernet.dm:59
rt.def("/datum/powernet/proc/remove_machine", function* remove_machine(f: Frame, M: Value) {
	this.nodes -= M;
	M.powernet = null;
	if (!this.is_empty()) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// powernet.dm:68
rt.def("/datum/powernet/proc/add_machine", function* add_machine(f: Frame, M: Value) {
	if (M.powernet) {
		if (M.powernet == this) {
			return f.dot;
		} else {
			yield* M.disconnect_from_network();
		}
	}
	M.powernet = this;
	rt.setAt(this.nodes, M, M);
	return f.dot;
}, true);

// powernet.dm:80
rt.def("/datum/powernet/proc/reset", function reset(f: Frame) {
	let S: Value = null;
	this.netexcess = this.avail - this.load;
	if (this.netexcess > 100 && this.nodes && rt.len(f, this.nodes)) {
		for (S of each(this.nodes, T("/obj/machinery/power/smes"))) {
			S.restore();
		}
	}
	this.viewavail = round(0.8 * this.viewavail + 0.2 * this.avail);
	this.viewload = round(0.8 * this.viewload + 0.2 * this.load);
	this.load = 0;
	this.avail = this.newavail;
	this.newavail = 0;
	return f.dot;
});

// powernet.dm:96
rt.def("/datum/powernet/proc/get_electrocute_damage", function get_electrocute_damage(f: Frame) {
	if (this.avail >= 1000) {
		return max(10, min(round(this.avail / 10000), 90)) + rand(-5, 5);
	}
	return 0;
});
