// From code/game/turfs/simulated/river.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/spawn_rivers  (code/game/turfs/simulated/river.dm:8)  may sleep
rt.def("/proc/spawn_rivers", function* spawn_rivers(f: Frame, target_z: Value, nodes: Value, turf_type: Value, whitelist_area: Value, min_x: Value, min_y: Value, max_x: Value, max_y: Value) {
	let river_nodes: Value = null, num_spawned: Value = null, F: Value = null, A: Value = null, W: Value = null, cur_turf: Value = null, target_turf: Value = null, detouring: Value = null, cur_dir: Value = null, new_area: Value = null, river_turf: Value = null, WP: Value = null;
	let $e: any;
	f.vars = () => [target_z, nodes, turf_type, whitelist_area, min_x, min_y, max_x, max_y, river_nodes, num_spawned, F, A, W, cur_turf, target_turf, detouring, cur_dir, new_area, river_turf, WP, $e];
	if (live(target_z) === null) {
		target_z = 5;
	}
	if (live(nodes) === null) {
		nodes = 4;
	}
	if (live(turf_type) === null) {
		turf_type = T("/turf/open/floor/plating/lava/smooth/lava_land_surface");
	}
	if (live(whitelist_area) === null) {
		whitelist_area = T("/area/lavaland/surface/outdoors");
	}
	if (live(min_x) === null) {
		min_x = 50;
	}
	if (live(min_y) === null) {
		min_y = 50;
	}
	if (live(max_x) === null) {
		max_x = 200;
	}
	if (live(max_y) === null) {
		max_y = 200;
	}
	river_nodes = rt.list();
	num_spawned = 0;
	while (rt.lt(live(num_spawned), live(nodes))) {
		river_nodes = rt.modify(live(river_nodes), (yield* g.new_(f, T("/obj/effect/landmark/river_waypoint"), [(F = rt.locate((yield* g.call(f, P("/proc/rand"), null, [live(min_x), live(max_x)])), (yield* g.call(f, P("/proc/rand"), null, [live(min_y), live(max_y)])), live(target_z)))])), add);
		num_spawned = rt.inc(live(num_spawned), 1);
	}
	A = null;
	rt.forList(f, 0, live(river_nodes));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((!isEqual(rt.gv(f, "z", (W = live(A))), live(target_z)) || truthy(rt.fv(f, "connected", live(W))))) {
			continue;
		}
		rt.setFv(f, "connected", live(W), 1);
		yield* g.callName(f, (cur_turf = rt.getStep(f, live(W), 0)), "ChangeTurf", [live(turf_type), 0, 1]);
		if (!truthy((target_turf = rt.getStep(f, rt.op(f, "PickUnweighted", [1], [subtract(live(river_nodes), live(W))]), 0)))) {
			break;
		}
		detouring = 0;
		cur_dir = rt.getDir(f, live(cur_turf), live(target_turf));
		while (!isEqual(live(cur_turf), live(target_turf))) {
			if (truthy(live(detouring))) {
				if (truthy(rt.op(f, "Prob", [], [20]))) {
					detouring = 0;
					cur_dir = rt.getDir(f, live(cur_turf), live(target_turf));
				}
			} else {
				if (truthy(rt.op(f, "Prob", [], [20]))) {
					detouring = 1;
					if (truthy(rt.op(f, "Prob", [], [50]))) {
						cur_dir = (yield* g.call(f, P("/proc/turn"), null, [live(cur_dir), 45]));
					} else {
						cur_dir = (yield* g.call(f, P("/proc/turn"), null, [live(cur_dir), -45]));
					}
				} else {
					cur_dir = rt.getDir(f, live(cur_turf), live(target_turf));
				}
			}
			cur_turf = rt.getStep(f, live(cur_turf), live(cur_dir));
			if (!truthy(rt.op(f, "IsType", [], [(new_area = (yield* g.call(f, P("/proc/get_area"), null, [live(cur_turf)]))), live(whitelist_area)]))) {
				detouring = 0;
				cur_dir = rt.getDir(f, live(cur_turf), live(target_turf));
				cur_turf = rt.getStep(f, live(cur_turf), live(cur_dir));
				continue;
			}
			yield* g.callName(f, (river_turf = (yield* g.callName(f, live(cur_turf), "ChangeTurf", [live(turf_type), 0, 1]))), "Spread", [25, 11, live(whitelist_area)]);
		}
	}
	rt.endFor(f, 0);
	WP = null;
	rt.forList(f, 0, live(river_nodes));
	while (($e = rt.next(f, 0)) !== undefined) {
		WP = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(WP)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/proc/Spread  (code/game/turfs/simulated/river.dm:66)  may sleep
rt.def("/turf/proc/Spread", function* Spread(f: Frame, probability: Value, prob_loss: Value, whitelisted_area: Value) {
	let cardinal_turfs: Value = null, diagonal_turfs: Value = null, logged_turf_type: Value = null, F: Value = null, _T: Value = null, new_area: Value = null, M: Value = null, M_5: Value = null;
	let $e: any;
	f.vars = () => [probability, prob_loss, whitelisted_area, cardinal_turfs, diagonal_turfs, logged_turf_type, F, _T, new_area, M, M_5, $e];
	if (live(probability) === null) {
		probability = 30;
	}
	if (live(prob_loss) === null) {
		prob_loss = 25;
	}
	if (rt.le(live(probability), 0)) {
		return live(f.dot);
	}
	cardinal_turfs = rt.list();
	diagonal_turfs = rt.list();
	logged_turf_type = null;
	F = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(f.src)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(f.src)), 1), 1])), rt.fv(f, "z", live(f.src))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(f.src)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(f.src)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(f.src)))])), live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		_T = live(F);
		new_area = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]));
		if ((((!truthy(live(_T)) || (truthy(rt.fv(f, "density", live(_T))) && !truthy((rt.istype(live(_T), T("/turf/closed/mineral")) ? 1 : 0)))) || truthy((rt.istype(live(_T), T("/turf/open/indestructible")) ? 1 : 0))) || (truthy(live(whitelisted_area)) && !truthy(rt.op(f, "IsType", [], [live(new_area), live(whitelisted_area)]))))) {
			continue;
		}
		if ((!truthy(live(logged_turf_type)) && truthy((rt.istype(live(_T), T("/turf/closed/mineral")) ? 1 : 0)))) {
			logged_turf_type = rt.gv(f, "turf_type", (M = live(_T)));
		}
		if (truthy((rt.isIn(f, rt.getDir(f, live(f.src), live(F)), rt.gl("cardinal")) ? 1 : 0))) {
			cardinal_turfs = rt.modify(live(cardinal_turfs), live(F), add);
		} else {
			diagonal_turfs = rt.modify(live(diagonal_turfs), live(F), add);
		}
	}
	rt.endFor(f, 0);
	F = null;
	rt.forList(f, 0, live(cardinal_turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if (((!truthy(rt.op(f, "IsType", [], [(_T = live(F)), live(logged_turf_type)])) && truthy((yield* g.callName(f, live(_T), "ChangeTurf", [rt.sv(f, "type"), 0, 1])))) && truthy(rt.op(f, "Prob", [], [live(probability)])))) {
			yield* g.callName(f, live(_T), "Spread", [subtract(live(probability), live(prob_loss)), live(prob_loss), live(whitelisted_area)]);
		}
	}
	rt.endFor(f, 0);
	F = null;
	rt.forList(f, 0, live(diagonal_turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if (((!truthy(rt.op(f, "IsType", [], [(_T = live(F)), live(logged_turf_type)])) && truthy(rt.op(f, "Prob", [], [live(probability)]))) && truthy((yield* g.callName(f, live(_T), "ChangeTurf", [rt.sv(f, "type"), 0, 1]))))) {
			yield* g.callName(f, live(_T), "Spread", [subtract(live(probability), live(prob_loss)), live(prob_loss), live(whitelisted_area)]);
		} else {
			if (truthy((rt.istype(live(_T), T("/turf/closed/mineral")) ? 1 : 0))) {
				yield* g.callName(f, (M_5 = live(_T)), "ChangeTurf", [rt.fv(f, "turf_type", live(M_5)), 0, 1]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
