// From code/game/objects/effects/portals.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/create_portal_pair  (code/game/objects/effects/portals.dm:3)  may sleep
rt.def("/proc/create_portal_pair", function* create_portal_pair(f: Frame, source: Value, destination: Value, _creator: Value, _lifespan: Value, accuracy: Value, newtype: Value) {
	let actual_destination: Value = null, P1: Value = null, P2: Value = null;
	f.vars = () => [source, destination, _creator, _lifespan, accuracy, newtype, actual_destination, P1, P2];
	if (live(_creator) === null) {
		_creator = null;
	}
	if (live(_lifespan) === null) {
		_lifespan = 300;
	}
	if (live(accuracy) === null) {
		accuracy = 0;
	}
	if (live(newtype) === null) {
		newtype = T("/obj/effect/portal");
	}
	if ((!truthy((rt.istype(live(source), T("/turf")) ? 1 : 0)) || !truthy((rt.istype(live(destination), T("/turf")) ? 1 : 0)))) {
		return live(f.dot);
	}
	actual_destination = (yield* g.call(f, P("/proc/get_teleport_turf"), null, [live(destination), live(accuracy)]));
	P1 = (yield* g.new_(f, live(newtype), [live(source), live(_creator), live(_lifespan), null, 0]));
	P2 = (yield* g.new_(f, live(newtype), [live(actual_destination), live(_creator), live(_lifespan), live(P1), 1]));
	if ((!truthy((rt.istype(live(P1), T("/obj/effect/portal")) ? 1 : 0)) || !truthy((rt.istype(live(P2), T("/obj/effect/portal")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(P1), "link_portal", [live(P2)]);
	rt.setFv(f, "hardlinked", live(P1), 1);
	return rt.list(live(P1), live(P2));
}, true);

rt.type(11208, "/obj/effect/portal", "/obj/effect", {
	mech_sized: 0,
	linked: null,
	hardlinked: 1,
	creator: null,
	hard_target: null,
	atmos_link: 0,
	atmos_source: null,
	atmos_destination: null,
	anchored: 1,
	name: "portal",
	desc: "Looks unstable. Best to test it with the clown.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "portal",
});

// /obj/effect/portal/proc/Move  (code/game/objects/effects/portals.dm:36)  may sleep
rt.def("/obj/effect/portal/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	_T = null;
	rt.forList(f, 0, live(f.args[0]));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((rt.istype(live(_T), T("/obj/effect/portal")) ? 1 : 0))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["newloc"] });

// /obj/effect/portal/proc/attackby  (code/game/objects/effects/portals.dm:42)  may sleep
rt.def("/obj/effect/portal/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.vars = () => [W, user, params];
	if (!(truthy(live(user)) && truthy((yield* g.srcCall(f, "Adjacent", live(user)))))) return f.dot;
	yield* g.srcCall(f, "teleport", live(user));
	return f.dot;
}, true);

// /obj/effect/portal/proc/Crossed  (code/game/objects/effects/portals.dm:49)  may sleep
rt.def("/obj/effect/portal/proc/Crossed", function* Crossed(f: Frame) {
	if (isEqual(rt.getStep(f, live(f.args[1]), 0), rt.getStep(f, rt.sv(f, "linked"), 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((yield* g.srcCall(f, "teleport", live(f.args[0]))))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["AM", "oldloc"] });

// /obj/effect/portal/proc/attack_hand  (code/game/objects/effects/portals.dm:58)  may sleep
rt.def("/obj/effect/portal/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(user))))) return f.dot;
	yield* g.srcCall(f, "teleport", live(user));
	return f.dot;
}, true);

// /obj/effect/portal/proc/Initialize  (code/game/objects/effects/portals.dm:62)  may sleep
rt.def("/obj/effect/portal/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modGl("portals", live(f.src), add);
	if ((!truthy((rt.istype(live(f.args[3]), T("/obj/effect/portal")) ? 1 : 0)) && truthy(live(f.args[4])))) {
		f.dot = 2;
		yield* g.call(f, P("/proc/CRASH"), null, ["Somebody fucked up."]);
	}
	if (rt.gt(live(f.args[2]), 0)) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), live(f.args[2]), 8]);
	}
	if (live(f.args[6]) !== null) {
		rt.setSv(f, "atmos_link", live(f.args[6]));
	}
	yield* g.srcCall(f, "link_portal", live(f.args[3]));
	rt.setSv(f, "hardlinked", live(f.args[4]));
	rt.setSv(f, "creator", live(f.args[1]));
	return f.dot;
}, true, { args: ["mapload", "_creator", "_lifespan", "_linked", "automatic_link", "hard_target_override", "atmos_link_override"] });

// /obj/effect/portal/proc/link_portal  (code/game/objects/effects/portals.dm:76)
rt.def("/obj/effect/portal/proc/link_portal", function link_portal(f: Frame, newlink: Value) {
	rt.setSv(f, "linked", live(newlink));
	if (!truthy(rt.sv(f, "atmos_link"))) return f.dot;
	rt.callSrc(f, "link_atmos", []);
	return f.dot;
});

// /obj/effect/portal/proc/link_atmos  (code/game/objects/effects/portals.dm:81)
rt.def("/obj/effect/portal/proc/link_atmos", function link_atmos(f: Frame) {
	if ((truthy(rt.sv(f, "atmos_source")) || truthy(rt.sv(f, "atmos_destination")))) {
		rt.callSrc(f, "unlink_atmos", []);
	}
	if (!truthy((rt.istype(rt.getStep(f, live(f.src), 0), T("/turf/open")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.sv(f, "linked"))) {
		if (truthy((rt.istype(rt.getStep(f, rt.sv(f, "linked"), 0), T("/turf/open")) ? 1 : 0))) {
			rt.setSv(f, "atmos_source", rt.getStep(f, live(f.src), 0));
			rt.setSv(f, "atmos_destination", rt.getStep(f, rt.sv(f, "linked"), 0));
		}
	} else {
		if (truthy(rt.sv(f, "hard_target"))) {
			if (truthy((rt.istype(rt.sv(f, "hard_target"), T("/turf/open")) ? 1 : 0))) {
				rt.setSv(f, "atmos_source", rt.getStep(f, live(f.src), 0));
				rt.setSv(f, "atmos_destination", rt.sv(f, "hard_target"));
			}
		} else {
			return 0;
		}
	}
	if ((!truthy((rt.istype(rt.sv(f, "atmos_source"), T("/turf/open")) ? 1 : 0)) || !truthy((rt.istype(rt.sv(f, "atmos_destination"), T("/turf/open")) ? 1 : 0)))) {
		return 0;
	}
	if (!truthy(rt.fv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_source")))) {
		rt.setFv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_source"), rt.list());
	}
	if (!truthy(rt.fv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_destination")))) {
		rt.setFv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_destination"), rt.list());
	}
	if ((truthy(rt.index(rt.fv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_source")), rt.sv(f, "atmos_destination"))) || truthy(rt.index(rt.fv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_destination")), rt.sv(f, "atmos_source"))))) {
		return 0;
	}
	rt.setAt(rt.fv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_source")), rt.sv(f, "atmos_destination"), 1);
	rt.setAt(rt.fv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_destination")), rt.sv(f, "atmos_source"), 1);
	rt.callName(f, rt.sv(f, "atmos_source"), "air_update_turf", [0]);
	rt.callName(f, rt.sv(f, "atmos_destination"), "air_update_turf", [0]);
	return f.dot;
});

// /obj/effect/portal/proc/unlink_atmos  (code/game/objects/effects/portals.dm:107)
rt.def("/obj/effect/portal/proc/unlink_atmos", function unlink_atmos(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((rt.istype(rt.sv(f, "atmos_source"), T("/turf/open")) ? 1 : 0))) {
		$0 = ((rt.istype(rt.sv(f, "atmos_destination"), T("/turf/open")) ? 1 : 0) && (!truthy(rt.callName(f, rt.sv(f, "atmos_source"), "Adjacent", [rt.sv(f, "atmos_destination")])) ? 1 : 0));
		if (truthy($0)) {
			if (isEqual(rt.fv(f, "CanAtmosPass", rt.sv(f, "atmos_destination")), -1)) {
				$0 = rt.callName(f, rt.sv(f, "atmos_destination"), "CanAtmosPass", [rt.sv(f, "atmos_source")]);
			} else {
				if (isEqual(rt.fv(f, "CanAtmosPass", rt.sv(f, "atmos_destination")), -2)) {
					$0 = (!truthy(rt.fv(f, "density", rt.sv(f, "atmos_destination"))) ? 1 : 0);
				} else {
					$0 = rt.fv(f, "CanAtmosPass", rt.sv(f, "atmos_destination"));
				}
			}
			$0 = (!truthy($0) ? 1 : 0);
		}
		if (truthy($0)) {
			if (truthy(rt.fv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_source")))) {
				(rt.modField(f, rt.sv(f, "atmos_source"), "atmos_adjacent_turfs", rt.sv(f, "atmos_destination"), subtract));
				if (!truthy(rt.getLen(f, rt.fv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_source"))))) {
					rt.setFv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_source"), null);
				}
			}
		}
		rt.setSv(f, "atmos_source", null);
	}
	if (!truthy((rt.istype(rt.sv(f, "atmos_destination"), T("/turf/open")) ? 1 : 0))) return f.dot;
	$0 = ((rt.istype(rt.sv(f, "atmos_source"), T("/turf/open")) ? 1 : 0) && (!truthy(rt.callName(f, rt.sv(f, "atmos_destination"), "Adjacent", [rt.sv(f, "atmos_source")])) ? 1 : 0));
	if (truthy($0)) {
		if (isEqual(rt.fv(f, "CanAtmosPass", rt.sv(f, "atmos_source")), -1)) {
			$0 = rt.callName(f, rt.sv(f, "atmos_source"), "CanAtmosPass", [rt.sv(f, "atmos_destination")]);
		} else {
			if (isEqual(rt.fv(f, "CanAtmosPass", rt.sv(f, "atmos_source")), -2)) {
				$0 = (!truthy(rt.fv(f, "density", rt.sv(f, "atmos_source"))) ? 1 : 0);
			} else {
				$0 = rt.fv(f, "CanAtmosPass", rt.sv(f, "atmos_source"));
			}
		}
		$0 = (!truthy($0) ? 1 : 0);
	}
	if (truthy($0)) {
		if (truthy(rt.fv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_destination")))) {
			(rt.modField(f, rt.sv(f, "atmos_destination"), "atmos_adjacent_turfs", rt.sv(f, "atmos_source"), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_destination"))))) {
				rt.setFv(f, "atmos_adjacent_turfs", rt.sv(f, "atmos_destination"), null);
			}
		}
	}
	rt.setSv(f, "atmos_destination", null);
	return f.dot;
});

// /obj/effect/portal/proc/Destroy  (code/game/objects/effects/portals.dm:117)  may sleep
rt.def("/obj/effect/portal/proc/Destroy", function* Destroy(f: Frame) {
	if ((truthy(rt.sv(f, "creator")) && truthy((yield* g.call(f, P("/proc/hascall"), null, [rt.sv(f, "creator"), "on_portal_destroy"]))))) {
		yield* g.callDyn(f, rt.sv(f, "creator"), "on_portal_destroy", [live(f.src), rt.fv(f, "loc", live(f.src))]);
	}
	rt.setSv(f, "creator", null);
	(rt.modGl("portals", live(f.src), subtract));
	yield* g.srcCall(f, "unlink_atmos");
	if ((truthy(rt.sv(f, "hardlinked")) && !(!truthy(rt.sv(f, "linked")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "linked")))))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "linked")]);
		rt.setSv(f, "linked", null);
	} else {
		rt.setSv(f, "linked", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/portal/proc/teleport  (code/game/objects/effects/portals.dm:129)  may sleep
rt.def("/obj/effect/portal/proc/teleport", function* teleport(f: Frame, M: Value) {
	let real_target: Value = null, _P: Value = null;
	let $0: any, $1: any;
	f.vars = () => [M, real_target, _P, $0, $1];
	if ((((!truthy((rt.istype(live(M), T("/atom/movable")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/obj/effect")) ? 1 : 0))) || (truthy((rt.istype(live(M), T("/obj/mecha")) ? 1 : 0)) && !truthy(rt.sv(f, "mech_sized")))) || (!truthy((rt.istype(live(M), T("/obj")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(M)])))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((real_target = (yield* g.srcCall(f, "get_link_target_turf"))), T("/turf")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0))) {
		$0 = live(M);
		if (truthy(live(f.src))) {
			$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
		} else {
			$1 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has used a portal at ＀ made by ＀.", [$0, fmt("＀", [$1]), live(f.usr)])]);
	}
	if (truthy((yield* g.call(f, P("/proc/do_teleport"), null, [live(M), live(real_target), 0])))) {
		if (truthy((rt.istype(live(M), T("/obj/item/projectile")) ? 1 : 0))) {
			rt.setFv(f, "ignore_source_check", (_P = live(M)), 1);
		}
		return 1;
	}
	return 0;
}, true);

// /obj/effect/portal/proc/get_link_target_turf  (code/game/objects/effects/portals.dm:145)  may sleep
rt.def("/obj/effect/portal/proc/get_link_target_turf", function* get_link_target_turf(f: Frame) {
	let real_target: Value = null;
	f.vars = () => [real_target];
	real_target = null;
	if ((!truthy((rt.istype(rt.sv(f, "linked"), T("/obj/effect/portal")) ? 1 : 0)) || (!truthy(rt.sv(f, "linked")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "linked")))))) {
		if (truthy(rt.sv(f, "hardlinked"))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
		if ((!truthy((rt.istype(rt.sv(f, "hard_target"), T("/turf")) ? 1 : 0)) || (!truthy(rt.sv(f, "hard_target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "hard_target")))))) {
			rt.setSv(f, "hard_target", null);
			return live(f.dot);
		} else {
			real_target = rt.sv(f, "hard_target");
			rt.setSv(f, "linked", null);
		}
	} else {
		real_target = rt.getStep(f, rt.sv(f, "linked"), 0);
	}
	return live(real_target);
}, true);
