// Based on /tg/station's code/game/turfs/simulated/river.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// river.dm:8
rt.def("/proc/spawn_rivers", function* spawn_rivers(f: Frame, target_z: Value, nodes: Value, turf_type: Value, whitelist_area: Value, min_x: Value, min_y: Value, max_x: Value, max_y: Value) {
	let F: Value = null, A: Value = null, W: Value = null, cur_turf: Value = null, target_turf: Value = null, detouring: Value = null, cur_dir: Value = null, new_area: Value = null, river_turf: Value = null, WP: Value = null;
	target_z ??= 5;
	nodes ??= 4;
	turf_type ??= T("/turf/open/floor/plating/lava/smooth/lava_land_surface");
	whitelist_area ??= T("/area/lavaland/surface/outdoors");
	min_x ??= RANDOM_LOWER_X;
	min_y ??= RANDOM_LOWER_Y;
	max_x ??= RANDOM_UPPER_X;
	max_y ??= RANDOM_UPPER_Y;
	let river_nodes: Value = list();
	let num_spawned: Value = 0;
	while (num_spawned < nodes) {
		river_nodes += (yield* new_(T("/obj/effect/landmark/river_waypoint"), (F = rt.locate(rand(min_x, max_x), rand(min_y, max_y), target_z))));
		num_spawned++;
	}
	for (A of each(river_nodes)) {
		if ((W = A).z != target_z || W.connected) {
			continue;
		}
		W.connected = 1;
		yield* (cur_turf = rt.getStep(f, W, 0)).ChangeTurf(turf_type, 0, 1);
		if (!(target_turf = rt.getStep(f, pick(river_nodes - W), 0))) {
			break;
		}
		detouring = 0;
		cur_dir = rt.getDir(f, cur_turf, target_turf);
		while (cur_turf != target_turf) {
			if (detouring) {
				if (prob(20)) {
					detouring = 0;
					cur_dir = rt.getDir(f, cur_turf, target_turf);
				}
			} else if (prob(20)) {
				detouring = 1;
				if (prob(50)) {
					cur_dir = turn(cur_dir, 45);
				} else {
					cur_dir = turn(cur_dir, -45);
				}
			} else {
				cur_dir = rt.getDir(f, cur_turf, target_turf);
			}
			cur_turf = rt.getStep(f, cur_turf, cur_dir);
			if (!rt.op(f, "IsType", [], [(new_area = get_area(cur_turf)), whitelist_area])) {
				detouring = 0;
				cur_dir = rt.getDir(f, cur_turf, target_turf);
				cur_turf = rt.getStep(f, cur_turf, cur_dir);
				continue;
			}
			yield* (river_turf = (yield* cur_turf.ChangeTurf(turf_type, 0, 1))).Spread(25, 11, whitelist_area);
		}
	}
	for (WP of each(river_nodes)) {
		yield* qdel(WP);
	}
	return f.dot;
}, true);

// river.dm:66
rt.def("/turf/proc/Spread", function* Spread(f: Frame, probability: Value, prob_loss: Value, whitelisted_area: Value) {
	let logged_turf_type: Value = null, F: Value = null, _T: Value = null, new_area: Value = null, M: Value = null, M_5: Value = null;
	probability ??= 30;
	prob_loss ??= 25;
	if (probability <= 0) {
		return f.dot;
	}
	let cardinal_turfs: Value = list();
	let diagonal_turfs: Value = list();
	for (F of each(block(rt.locate(max(this.x - 1, 1), max(this.y - 1, 1), this.z), rt.locate(min(this.x + 1, rt.world().maxx), min(this.y + 1, rt.world().maxy), this.z)) - this)) {
		_T = F;
		new_area = get_area(_T);
		if (!_T || _T.density && !rt.istype(_T, T("/turf/closed/mineral")) || rt.istype(_T, T("/turf/open/indestructible")) || whitelisted_area && !rt.op(f, "IsType", [], [new_area, whitelisted_area])) {
			continue;
		}
		if (!logged_turf_type && rt.istype(_T, T("/turf/closed/mineral"))) {
			logged_turf_type = (M = _T).turf_type;
		}
		if (rt.isIn(f, rt.getDir(f, this, F), GLOB.cardinal)) {
			cardinal_turfs += F;
		} else {
			diagonal_turfs += F;
		}
	}
	F = null;
	for (F of each(cardinal_turfs)) {
		if (!rt.op(f, "IsType", [], [(_T = F), logged_turf_type]) && (yield* _T.ChangeTurf(this.type, 0, 1)) && prob(probability)) {
			yield* _T.Spread(probability - prob_loss, prob_loss, whitelisted_area);
		}
	}
	F = null;
	for (F of each(diagonal_turfs)) {
		if (!rt.op(f, "IsType", [], [(_T = F), logged_turf_type]) && prob(probability) && (yield* _T.ChangeTurf(this.type, 0, 1))) {
			yield* _T.Spread(probability - prob_loss, prob_loss, whitelisted_area);
		} else if (rt.istype(_T, T("/turf/closed/mineral"))) {
			yield* (M_5 = _T).ChangeTurf(M_5.turf_type, 0, 1);
		}
	}
	return f.dot;
}, true);
