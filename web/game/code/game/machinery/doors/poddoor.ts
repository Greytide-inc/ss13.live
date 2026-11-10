// Based on /tg/station's code/game/machinery/doors/poddoor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


rt.type(10292, "/obj/machinery/door/poddoor", "/obj/machinery/door", {
	id: 1,
	sub_door: 1,
	explosion_block: 3,
	heat_proof: 1,
	safe: 0,
	damage_deflection: 70,
	name: "blast door",
	desc: "A heavy duty blast door that opens mechanically.",
	icon: rt.rsc("icons/obj/doors/blastdoor.dmi"),
	icon_state: "closed",
	obj_integrity: 600,
	max_integrity: 600,
	armor: null,
	resistance_flags: 2,
});

// poddoor.dm:13
rt.def("/obj/machinery/door/poddoor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 100, "laser", 100, "energy", 100, "bomb", 50, "bio", 100, "rad", 100, "fire", 100, "acid", 70]);
	return f.dot;
});

rt.type(10295, "/obj/machinery/door/poddoor/shuttledock", "/obj/machinery/door/poddoor", {
	checkdir: 4,
	turftype: rt.typePath("/turf/open/space"),
});

// poddoor.dm:31
rt.def("/obj/machinery/door/poddoor/shuttledock/proc/check", function check(f: Frame) {
	let _T: Value = null;
	if (!rt.op(f, "IsType", [], [(_T = rt.getStep(f, this, this.checkdir)), this.turftype])) {
		ImmediateInvokeAsync(this, P("/obj/machinery/door/proc/open"));
	} else {
		ImmediateInvokeAsync(this, P("/obj/machinery/door/proc/close"));
	}
	return f.dot;
});

// poddoor.dm:39
rt.def("/obj/machinery/door/poddoor/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	if (this.density) {
		return 0;
	} else {
		return (yield* parent_proc());
	}
}, true);

// poddoor.dm:45
rt.def("/obj/machinery/door/poddoor/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	if (severity == 3) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// poddoor.dm:50
rt.def("/obj/machinery/door/poddoor/proc/do_animate", function do_animate(f: Frame, animation: Value) {
	if (animation === "opening") {
		flick("opening", this);
	} else if (animation === "closing") {
		flick("closing", this);
	}
	return f.dot;
});

// poddoor.dm:58
rt.def("/obj/machinery/door/poddoor/proc/update_icon", function update_icon(f: Frame) {
	if (this.density) {
		this.icon_state = "closed";
	} else {
		this.icon_state = "open";
	}
	return f.dot;
});

// poddoor.dm:66
rt.def("/obj/machinery/door/poddoor/proc/try_to_crowbar", function* try_to_crowbar(f: Frame, I: Value, user: Value) {
	if (!rt.bitAnd(this.stat, 2)) return f.dot;
	yield* this.open(1);
	return f.dot;
}, true);
