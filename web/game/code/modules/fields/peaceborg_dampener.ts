// From code/modules/fields/peaceborg_dampener.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1509, "/datum/proximity_monitor/advanced/peaceborg_dampener", "/datum/proximity_monitor/advanced", {
	projector: null,
	tracked: null,
	staging: null,
	name: "１Hyperkinetic Dampener Field",
	setup_edge_turfs: 1,
	setup_field_turfs: 1,
	field_shape: 1,
	use_host_turf: 1,
}, { global: { edgeturf_south: 962, edgeturf_north: 963, edgeturf_west: 964, edgeturf_east: 965, northwest_corner: 966, southwest_corner: 967, northeast_corner: 968, southeast_corner: 969, generic_edge: 970 } });

// /datum/proximity_monitor/advanced/peaceborg_dampener/proc/New  (code/modules/fields/peaceborg_dampener.dm:24)  may sleep
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/New", function* New(f: Frame) {
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSfields"), "processing", live(f.src), add);
	}
	rt.setSv(f, "tracked", rt.list());
	rt.setSv(f, "staging", rt.list());
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/proximity_monitor/advanced/peaceborg_dampener/proc/Destroy  (code/modules/fields/peaceborg_dampener.dm:30)  may sleep
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfields"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/proximity_monitor/advanced/peaceborg_dampener/proc/process  (code/modules/fields/peaceborg_dampener.dm:34)  may sleep
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/process", function* process(f: Frame) {
	let ranged: Value = null, _P: Value = null, R: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [ranged, _P, R, L, $e];
	if (!truthy((rt.istype(rt.sv(f, "projector"), T("/obj/item/borg/projectile_dampen")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	ranged = rt.list();
	_P = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "current_range"), rt.getStep(f, rt.sv(f, "host"), 0)])), T("/obj/item/projectile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		ranged = rt.modify(live(ranged), live(_P), add);
	}
	rt.endFor(f, 0);
	_P = null;
	rt.forList(f, 0, rt.sv(f, "tracked"), T("/obj/item/projectile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if ((!truthy((rt.isIn(f, live(_P), live(ranged)) ? 1 : 0)) || !truthy(rt.fv(f, "loc", live(_P))))) {
			yield* g.srcCall(f, "release_projectile", live(_P));
		}
	}
	rt.endFor(f, 0);
	R = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "current_range"), rt.getStep(f, rt.sv(f, "host"), 0)])), T("/mob/living/silicon/robot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (truthy((yield* g.callName(f, live(R), "has_buckled_mobs", [])))) {
			L = null;
			rt.forList(f, 1, rt.fv(f, "buckled_mobs", live(R)), T("/mob/living"));
			while (($e = rt.next(f, 1)) !== undefined) {
				L = $e;
				yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀ is knocked off of ＀ by the charge in ＀'s chassis induced by ＀!</span>", [live(L), live(R), live(R), rt.sv(f, "name")])]);
				yield* g.callName(f, live(L), "Knockdown", [60]);
				yield* g.callName(f, live(R), "unbuckle_mob", [live(L)]);
				yield* g.call(f, P("/proc/do_sparks"), null, [5, 0, live(L)]);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

// /datum/proximity_monitor/advanced/peaceborg_dampener/proc/setup_edge_turf  (code/modules/fields/peaceborg_dampener.dm:52)  may sleep
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/setup_edge_turf", function* setup_edge_turf(f: Frame) {
	let I: Value = null, F: Value = null;
	f.vars = () => [I, F];
	yield* g.callSuper(f, [], rt.Args.Same);
	I = (yield* g.srcCall(f, "get_edgeturf_overlay", (yield* g.srcCall(f, "get_edgeturf_direction", live(f.args[0])))));
	rt.setFv(f, "appearance", (F = rt.index(rt.sv(f, "edge_turfs"), live(f.args[0]))), rt.fv(f, "appearance", live(I)));
	rt.setFv(f, "invisibility", live(F), 0);
	rt.setFv(f, "mouse_opacity", live(F), 0);
	rt.setFv(f, "layer", live(F), 5);
	return f.dot;
}, true, { args: ["T"] });

// /datum/proximity_monitor/advanced/peaceborg_dampener/proc/cleanup_edge_turf  (code/modules/fields/peaceborg_dampener.dm:61)  may sleep
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/cleanup_edge_turf", function* cleanup_edge_turf(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["T"] });

// /datum/proximity_monitor/advanced/peaceborg_dampener/proc/get_edgeturf_overlay  (code/modules/fields/peaceborg_dampener.dm:64)
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/get_edgeturf_overlay", function get_edgeturf_overlay(f: Frame, direction: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(direction);
	if ($0 === 1) {
		return rt.gl("edgeturf_north");
	} else if ($0 === 2) {
		return rt.gl("edgeturf_south");
	} else if ($0 === 4) {
		return rt.gl("edgeturf_east");
	} else if ($0 === 8) {
		return rt.gl("edgeturf_west");
	} else if ($0 === 5) {
		return rt.gl("northeast_corner");
	} else if ($0 === 9) {
		return rt.gl("northwest_corner");
	} else if ($0 === 6) {
		return rt.gl("southeast_corner");
	} else if ($0 === 10) {
		return rt.gl("southwest_corner");
	} else {
		return rt.gl("generic_edge");
	}
	return f.dot;
});

// /datum/proximity_monitor/advanced/peaceborg_dampener/proc/capture_projectile  (code/modules/fields/peaceborg_dampener.dm:85)
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/capture_projectile", function capture_projectile(f: Frame, _P: Value, track_projectile: Value) {
	f.vars = () => [track_projectile];
	if (live(track_projectile) === null) {
		track_projectile = 1;
	}
	if (truthy((rt.isIn(f, live(_P), rt.sv(f, "tracked")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "projector"), "dampen_projectile", [live(_P), live(track_projectile)]);
	if (!truthy(live(track_projectile))) return f.dot;
	rt.modSrcVar(f, "tracked", live(_P), add);
	return f.dot;
});

// /datum/proximity_monitor/advanced/peaceborg_dampener/proc/release_projectile  (code/modules/fields/peaceborg_dampener.dm:92)
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/release_projectile", function release_projectile(f: Frame, _P: Value) {
	rt.callName(f, rt.sv(f, "projector"), "restore_projectile", [live(_P)]);
	(rt.modSrcVar(f, "tracked", live(_P), subtract));
	return f.dot;
});

// /datum/proximity_monitor/advanced/peaceborg_dampener/proc/field_edge_uncrossed  (code/modules/fields/peaceborg_dampener.dm:96)
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/field_edge_uncrossed", function field_edge_uncrossed(f: Frame) {
	if (!truthy(rt.call(f, P("/proc/is_turf_in_field"), null, [rt.getStep(f, live(f.args[0]), 0), live(f.src)]))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile")) ? 1 : 0))) {
			if (truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "tracked")) ? 1 : 0))) {
				rt.callSrc(f, "release_projectile", [live(f.args[0])]);
			} else {
				rt.callSrc(f, "capture_projectile", [live(f.args[0]), 0]);
			}
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["AM", "F"] });

// /datum/proximity_monitor/advanced/peaceborg_dampener/proc/field_edge_crossed  (code/modules/fields/peaceborg_dampener.dm:105)
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/field_edge_crossed", function field_edge_crossed(f: Frame) {
	if ((((truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile")) ? 1 : 0)) && !truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "tracked")) ? 1 : 0))) && truthy(rt.index(rt.sv(f, "staging"), live(f.args[0])))) && !truthy(rt.call(f, P("/proc/is_turf_in_field"), null, [rt.index(rt.sv(f, "staging"), live(f.args[0])), live(f.src)])))) {
		rt.callSrc(f, "capture_projectile", [live(f.args[0])]);
	}
	(rt.modSrcVar(f, "staging", live(f.args[0]), subtract));
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["AM", "F"] });

// /datum/proximity_monitor/advanced/peaceborg_dampener/proc/field_edge_canpass  (code/modules/fields/peaceborg_dampener.dm:111)
rt.def("/datum/proximity_monitor/advanced/peaceborg_dampener/proc/field_edge_canpass", function field_edge_canpass(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile")) ? 1 : 0))) {
		rt.setAt(rt.sv(f, "staging"), live(f.args[0]), rt.getStep(f, live(f.args[0]), 0));
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.dot))) return f.dot;
	(rt.modSrcVar(f, "staging", live(f.args[0]), subtract));
	return f.dot;
}, false, { args: ["AM", "F", "entering"] });
