// From code/game/turfs/space/transit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4500, "/turf/open/space/transit", "/turf/open/space", {
	icon_state: "black",
	dir: 2,
	baseturf: rt.typePath("/turf/open/space/transit"),
	flags: 1,
});

// /turf/open/space/transit/proc/get_smooth_underlay_icon  (code/game/turfs/space/transit.dm:8)
rt.def("/turf/open/space/transit/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "icon_state", live(f.args[0]), fmt("speedspace_ns_＀", [rt.call(f, P("/proc/get_transit_state"), null, [live(f.args[1])])]));
	rt.setFv(f, "transform", live(f.args[0]), rt.call(f, P("/proc/turn"), null, [rt.call(f, P("/proc/matrix"), null, []), rt.call(f, P("/proc/get_transit_angle"), null, [live(f.args[1])])]));
	return f.dot;
}, false, { args: ["underlay_appearance", "asking_turf", "adjacency_dir"] });

// /turf/open/space/transit/proc/Entered  (code/game/turfs/space/transit.dm:28)  may sleep
rt.def("/turf/open/space/transit/proc/Entered", function* Entered(f: Frame, AM: Value, OldLoc: Value) {
	f.vars = () => [AM, OldLoc];
	yield* g.srcCall(f, "throw_atom", live(AM));
	return f.dot;
}, true);

// /turf/open/space/transit/proc/throw_atom  (code/game/turfs/space/transit.dm:31)  may sleep
rt.def("/turf/open/space/transit/proc/throw_atom", function* throw_atom(f: Frame, AM: Value) {
	let max: Value = null, min: Value = null, possible_transtitons: Value = null, k: Value = null, config_list: Value = null, a: Value = null, _z: Value = null, _x: Value = null, _y: Value = null, _T: Value = null;
	let $0: any, $e: any;
	f.vars = () => [AM, max, min, possible_transtitons, k, config_list, a, _z, _x, _y, _T, $0, $e];
	if ((!truthy(live(AM)) || truthy((rt.istype(live(AM), T("/obj/docking_port")) ? 1 : 0)))) {
		return live(f.dot);
	}
	max = subtract(rt.fv(f, "maxx", rt.world()), 7);
	min = 8;
	possible_transtitons = rt.list();
	k = 1;
	config_list = rt.gv(f, "transition_config", rt.fv(f, "config", rt.gl("SSmapping")));
	a = null;
	rt.forList(f, 0, live(config_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		if (isEqual(rt.index(live(config_list), live(a)), 2)) {
			possible_transtitons = rt.modify(live(possible_transtitons), live(k), add);
		}
		k = rt.inc(live(k), 1);
	}
	rt.endFor(f, 0);
	_z = rt.op(f, "PickUnweighted", [1], [live(possible_transtitons)]);
	_x = null;
	_y = null;
	$0 = rt.sv(f, "dir");
	if ($0 === 2) {
		_x = (yield* g.call(f, P("/proc/rand"), null, [live(min), live(max)]));
		_y = live(max);
	} else if ($0 === 8) {
		_x = live(max);
		_y = (yield* g.call(f, P("/proc/rand"), null, [live(min), live(max)]));
	} else if ($0 === 4) {
		_x = live(min);
		_y = (yield* g.call(f, P("/proc/rand"), null, [live(min), live(max)]));
	} else {
		_x = (yield* g.call(f, P("/proc/rand"), null, [live(min), live(max)]));
		_y = live(min);
	}
	_T = rt.locate(live(_x), live(_y), live(_z));
	rt.setFv(f, "loc", live(AM), live(_T));
	yield* g.callName(f, live(AM), "newtonian_move", [rt.sv(f, "dir")]);
	return f.dot;
}, true);

// /turf/open/space/transit/proc/CanBuildHere  (code/game/turfs/space/transit.dm:67)
rt.def("/turf/open/space/transit/proc/CanBuildHere", function CanBuildHere(f: Frame) {
	return rt.callName(f, rt.gl("SSshuttle"), "is_in_shuttle_bounds", [live(f.src)]);
});

// /turf/open/space/transit/proc/Initialize  (code/game/turfs/space/transit.dm:71)  may sleep
rt.def("/turf/open/space/transit/proc/Initialize", function* Initialize(f: Frame) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.srcCall(f, "throw_atom", live(AM));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/open/space/transit/proc/update_icon  (code/game/turfs/space/transit.dm:77)
rt.def("/turf/open/space/transit/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("speedspace_ns_＀", [rt.call(f, P("/proc/get_transit_state"), null, [live(f.src)])]));
	rt.setSv(f, "transform", rt.call(f, P("/proc/turn"), null, [rt.call(f, P("/proc/matrix"), null, []), rt.call(f, P("/proc/get_transit_angle"), null, [live(f.src)])]));
	return f.dot;
});

// /proc/get_transit_state  (code/game/turfs/space/transit.dm:83)
rt.def("/proc/get_transit_state", function get_transit_state(f: Frame, _T: Value) {
	let p: Value = null;
	let $0: any;
	f.vars = () => [p, $0];
	p = 9;
	f.dot = 1;
	$0 = rt.fv(f, "dir", live(_T));
	if ($0 === 1) {
		f.dot = add(rt.modulus(add(multiply(rt.neg(live(p)), rt.fv(f, "x", live(_T))), rt.fv(f, "y", live(_T))), 15), 1);
		if (rt.lt(live(f.dot), 1)) {
			f.dot = rt.modify(live(f.dot), 15, add);
		}
	} else if ($0 === 4) {
		f.dot = add(rt.modulus(add(rt.fv(f, "x", live(_T)), multiply(live(p), rt.fv(f, "y", live(_T)))), 15), 1);
	} else if ($0 === 8) {
		f.dot = add(rt.modulus(subtract(rt.fv(f, "x", live(_T)), multiply(live(p), rt.fv(f, "y", live(_T)))), 15), 1);
		if (!rt.lt(live(f.dot), 1)) return f.dot;
		f.dot = rt.modify(live(f.dot), 15, add);
	} else {
		f.dot = add(rt.modulus(add(multiply(live(p), rt.fv(f, "x", live(_T))), rt.fv(f, "y", live(_T))), 15), 1);
	}
	return f.dot;
});

// /proc/get_transit_angle  (code/game/turfs/space/transit.dm:99)
rt.def("/proc/get_transit_angle", function get_transit_angle(f: Frame, _T: Value) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = 0;
	$0 = rt.fv(f, "dir", live(_T));
	if ($0 === 1) {
		f.dot = 180;
	} else if ($0 === 4) {
		f.dot = 90;
	} else if ($0 === 8) {
		f.dot = -90;
	}
	return f.dot;
});
