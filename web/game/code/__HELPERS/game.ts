// From code/__HELPERS/game.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/get_area  (code/__HELPERS/game.dm:12)
rt.def("/proc/get_area", function get_area(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy((rt.istype(live(A), T("/atom")) ? 1 : 0))) {
		return live(f.dot);
	}
	live(A);
	while (truthy(live(A)) && !truthy(rt.call(f, P("/proc/isarea"), null, [live(A)]))) {
		A = rt.fv(f, "loc", live(A));
	}
	return live(A);
});

// /proc/get_area_name  (code/__HELPERS/game.dm:18)
rt.def("/proc/get_area_name", function get_area_name(f: Frame, X: Value) {
	let Y: Value = null;
	f.vars = () => [Y];
	return rt.gv(f, "name", (Y = rt.call(f, P("/proc/get_area"), null, [live(X)])));
});

// /proc/get_area_by_name  (code/__HELPERS/game.dm:22)
rt.def("/proc/get_area_by_name", function get_area_by_name(f: Frame, N: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.world(), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.fv(f, "name", live(A)), live(N))) {
			return live(A);
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /proc/get_areas_in_range  (code/__HELPERS/game.dm:28)
rt.def("/proc/get_areas_in_range", function get_areas_in_range(f: Frame, dist: Value, center: Value) {
	let _T: Value = null, turfs: Value = null, areas: Value = null, V: Value = null, _T_3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [dist, center, _T, turfs, areas, V, _T_3, $0, $e];
	if (live(dist) === null) {
		dist = 0;
	}
	if (live(center) === null) {
		center = live(f.usr);
	}
	if (!truthy(live(dist))) {
		if (truthy((_T = rt.getStep(f, live(center), 0)))) {
			$0 = rt.list(rt.fv(f, "loc", live(_T)));
		} else {
			$0 = rt.list();
		}
		return $0;
	}
	if (!truthy(live(center))) {
		return rt.list();
	}
	turfs = rt.call(f, P("/proc/block"), null, [rt.locate(rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(center)), live(dist)), 1]), rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(center)), live(dist)), 1]), rt.fv(f, "z", live(center))), rt.locate(rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(center)), live(dist)), rt.fv(f, "maxx", rt.world())]), rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(center)), live(dist)), rt.fv(f, "maxy", rt.world())]), rt.fv(f, "z", live(center)))]);
	areas = rt.list();
	V = null;
	rt.forList(f, 0, live(turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		(areas = rt.modify(live(areas), rt.gv(f, "loc", (_T_3 = live(V))), rt.bitOr));
	}
	rt.endFor(f, 0);
	return live(areas);
});

// /proc/get_adjacent_areas  (code/__HELPERS/game.dm:42)
rt.def("/proc/get_adjacent_areas", function get_adjacent_areas(f: Frame, center: Value) {
	f.dot = rt.list(rt.call(f, P("/proc/get_area"), null, [rt.call(f, P("/proc/get_ranged_target_turf"), null, [live(center), 1, 1])]), rt.call(f, P("/proc/get_area"), null, [rt.call(f, P("/proc/get_ranged_target_turf"), null, [live(center), 2, 1])]), rt.call(f, P("/proc/get_area"), null, [rt.call(f, P("/proc/get_ranged_target_turf"), null, [live(center), 4, 1])]), rt.call(f, P("/proc/get_area"), null, [rt.call(f, P("/proc/get_ranged_target_turf"), null, [live(center), 8, 1])]));
	rt.call(f, P("/proc/listclearnulls"), null, [live(f.dot)]);
	return f.dot;
});

// /proc/get_open_turf_in_dir  (code/__HELPERS/game.dm:49)
rt.def("/proc/get_open_turf_in_dir", function get_open_turf_in_dir(f: Frame, center: Value, dir: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((rt.istype((_T = rt.call(f, P("/proc/get_ranged_target_turf"), null, [live(center), live(dir), 1])), T("/turf/open")) ? 1 : 0))) return f.dot;
	return live(_T);
});

// /proc/get_adjacent_open_turfs  (code/__HELPERS/game.dm:54)
rt.def("/proc/get_adjacent_open_turfs", function get_adjacent_open_turfs(f: Frame, center: Value) {
	f.dot = rt.list(rt.call(f, P("/proc/get_open_turf_in_dir"), null, [live(center), 1]), rt.call(f, P("/proc/get_open_turf_in_dir"), null, [live(center), 2]), rt.call(f, P("/proc/get_open_turf_in_dir"), null, [live(center), 4]), rt.call(f, P("/proc/get_open_turf_in_dir"), null, [live(center), 8]));
	rt.call(f, P("/proc/listclearnulls"), null, [live(f.dot)]);
	return f.dot;
});

// /proc/get_adjacent_open_areas  (code/__HELPERS/game.dm:61)
rt.def("/proc/get_adjacent_open_areas", function get_adjacent_open_areas(f: Frame, center: Value) {
	let adjacent_turfs: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [adjacent_turfs, I, $e];
	f.dot = rt.list();
	adjacent_turfs = rt.call(f, P("/proc/get_adjacent_open_turfs"), null, [live(center)]);
	I = null;
	rt.forList(f, 0, live(adjacent_turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		(f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/get_area"), null, [live(I)]), rt.bitOr));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/get_hear  (code/__HELPERS/game.dm:71)
rt.def("/proc/get_hear", function get_hear(f: Frame, range: Value, source: Value) {
	let lum: Value = null, heard: Value = null;
	f.vars = () => [lum, heard];
	lum = rt.fv(f, "luminosity", live(source));
	rt.setFv(f, "luminosity", live(source), 6);
	heard = rt.call(f, P("/proc/view"), null, [live(range), live(source)]);
	rt.setFv(f, "luminosity", live(source), live(lum));
	return live(heard);
});

// /proc/alone_in_area  (code/__HELPERS/game.dm:79)
rt.def("/proc/alone_in_area", function alone_in_area(f: Frame, the_area: Value, must_be_alone: Value, check_type: Value) {
	let our_area: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [check_type, our_area, C, $e];
	if (live(check_type) === null) {
		check_type = T("/mob/living/carbon");
	}
	our_area = rt.call(f, P("/proc/get_area"), null, [live(the_area)]);
	C = null;
	rt.forList(f, 0, rt.gl("living_mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (!truthy(rt.op(f, "IsType", [], [live(C), live(check_type)]))) {
			continue;
		}
		if (isEqual(live(C), live(must_be_alone))) {
			continue;
		}
		if (isEqual(live(our_area), rt.call(f, P("/proc/get_area"), null, [live(C)]))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /proc/cheap_hypotenuse  (code/__HELPERS/game.dm:92)
rt.def("/proc/cheap_hypotenuse", function cheap_hypotenuse(f: Frame, Ax: Value, Ay: Value, Bx: Value, By: Value) {
	return rt.op(f, "Sqrt", [], [add(rt.power(rt.op(f, "Abs", [], [subtract(live(Ax), live(Bx))]), 2), rt.power(rt.op(f, "Abs", [], [subtract(live(Ay), live(By))]), 2))]);
});

// /proc/circlerange  (code/__HELPERS/game.dm:96)
rt.def("/proc/circlerange", function circlerange(f: Frame, center: Value, radius: Value) {
	let centerturf: Value = null, turfs: Value = null, rsq: Value = null, _T: Value = null, dx: Value = null, dy: Value = null;
	let $e: any;
	f.vars = () => [center, radius, centerturf, turfs, rsq, _T, dx, dy, $e];
	if (live(center) === null) {
		center = live(f.usr);
	}
	if (live(radius) === null) {
		radius = 3;
	}
	centerturf = rt.getStep(f, live(center), 0);
	turfs = rt.new_(f, T("/list"), []);
	rsq = multiply(live(radius), add(live(radius), 0.5));
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [live(radius), live(centerturf)]), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		dx = subtract(rt.fv(f, "x", live(_T)), rt.fv(f, "x", live(centerturf)));
		dy = subtract(rt.fv(f, "y", live(_T)), rt.fv(f, "y", live(centerturf)));
		if (rt.le(add(multiply(live(dx), live(dx)), multiply(live(dy), live(dy))), live(rsq))) {
			turfs = rt.modify(live(turfs), live(_T), add);
		}
	}
	rt.endFor(f, 0);
	return live(turfs);
});

// /proc/circleview  (code/__HELPERS/game.dm:111)
rt.def("/proc/circleview", function circleview(f: Frame, center: Value, radius: Value) {
	let centerturf: Value = null, atoms: Value = null, rsq: Value = null, A: Value = null, dx: Value = null, dy: Value = null;
	let $e: any;
	f.vars = () => [center, radius, centerturf, atoms, rsq, A, dx, dy, $e];
	if (live(center) === null) {
		center = live(f.usr);
	}
	if (live(radius) === null) {
		radius = 3;
	}
	centerturf = rt.getStep(f, live(center), 0);
	atoms = rt.new_(f, T("/list"), []);
	rsq = multiply(live(radius), add(live(radius), 0.5));
	A = null;
	rt.forList(f, 0, rt.call(f, P("/proc/view"), null, [live(radius), live(centerturf)]), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		dx = subtract(rt.fv(f, "x", live(A)), rt.fv(f, "x", live(centerturf)));
		dy = subtract(rt.fv(f, "y", live(A)), rt.fv(f, "y", live(centerturf)));
		if (rt.le(add(multiply(live(dx), live(dx)), multiply(live(dy), live(dy))), live(rsq))) {
			atoms = rt.modify(live(atoms), live(A), add);
		}
	}
	rt.endFor(f, 0);
	return live(atoms);
});

// /proc/get_dist_euclidian  (code/__HELPERS/game.dm:125)
rt.def("/proc/get_dist_euclidian", function get_dist_euclidian(f: Frame, Loc1: Value, Loc2: Value) {
	let dx: Value = null, dy: Value = null, dist: Value = null;
	f.vars = () => [dx, dy, dist];
	dx = subtract(rt.fv(f, "x", live(Loc1)), rt.fv(f, "x", live(Loc2)));
	dy = subtract(rt.fv(f, "y", live(Loc1)), rt.fv(f, "y", live(Loc2)));
	return (dist = rt.op(f, "Sqrt", [], [add(rt.power(live(dx), 2), rt.power(live(dy), 2))]));
});

// /proc/circlerangeturfs  (code/__HELPERS/game.dm:134)
rt.def("/proc/circlerangeturfs", function circlerangeturfs(f: Frame, center: Value, radius: Value) {
	let centerturf: Value = null, turfs: Value = null, rsq: Value = null, _T: Value = null, dx: Value = null, dy: Value = null;
	let $e: any;
	f.vars = () => [center, radius, centerturf, turfs, rsq, _T, dx, dy, $e];
	if (live(center) === null) {
		center = live(f.usr);
	}
	if (live(radius) === null) {
		radius = 3;
	}
	centerturf = rt.getStep(f, live(center), 0);
	turfs = rt.new_(f, T("/list"), []);
	rsq = multiply(live(radius), add(live(radius), 0.5));
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [live(radius), live(centerturf)]), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		dx = subtract(rt.fv(f, "x", live(_T)), rt.fv(f, "x", live(centerturf)));
		dy = subtract(rt.fv(f, "y", live(_T)), rt.fv(f, "y", live(centerturf)));
		if (rt.le(add(multiply(live(dx), live(dx)), multiply(live(dy), live(dy))), live(rsq))) {
			turfs = rt.modify(live(turfs), live(_T), add);
		}
	}
	rt.endFor(f, 0);
	return live(turfs);
});

// /proc/circleviewturfs  (code/__HELPERS/game.dm:147)
rt.def("/proc/circleviewturfs", function circleviewturfs(f: Frame, center: Value, radius: Value) {
	let centerturf: Value = null, turfs: Value = null, rsq: Value = null, _T: Value = null, dx: Value = null, dy: Value = null;
	let $e: any;
	f.vars = () => [center, radius, centerturf, turfs, rsq, _T, dx, dy, $e];
	if (live(center) === null) {
		center = live(f.usr);
	}
	if (live(radius) === null) {
		radius = 3;
	}
	centerturf = rt.getStep(f, live(center), 0);
	turfs = rt.new_(f, T("/list"), []);
	rsq = multiply(live(radius), add(live(radius), 0.5));
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/view"), null, [live(radius), live(centerturf)]), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		dx = subtract(rt.fv(f, "x", live(_T)), rt.fv(f, "x", live(centerturf)));
		dy = subtract(rt.fv(f, "y", live(_T)), rt.fv(f, "y", live(centerturf)));
		if (rt.le(add(multiply(live(dx), live(dx)), multiply(live(dy), live(dy))), live(rsq))) {
			turfs = rt.modify(live(turfs), live(_T), add);
		}
	}
	rt.endFor(f, 0);
	return live(turfs);
});

// /proc/recursive_hear_check  (code/__HELPERS/game.dm:163)
rt.def("/proc/recursive_hear_check", function recursive_hear_check(f: Frame, O: Value) {
	let processing_list: Value = null, i: Value = null, A: Value = null;
	let $t: any;
	f.vars = () => [processing_list, i, A, $t];
	processing_list = rt.list(live(O));
	f.dot = rt.list();
	i = 1;
	while (rt.le(live(i), rt.len(f, live(processing_list)))) {
		if (truthy(rt.bitAnd(rt.gv(f, "flags", (A = rt.index(live(processing_list), ($t = live(i), i = rt.inc($t, 1), $t)))), 16))) {
			f.dot = rt.modify(live(f.dot), live(A), add);
		}
		processing_list = rt.modify(live(processing_list), rt.fv(f, "contents", live(A)), add);
	}
	return f.dot;
});

// /proc/recursive_mob_check  (code/__HELPERS/game.dm:177)
rt.def("/proc/recursive_mob_check", function recursive_mob_check(f: Frame, O: Value, client_check: Value, sight_check: Value, include_radio: Value) {
	let processing_list: Value = null, processed_list: Value = null, found_mobs: Value = null, A: Value = null, passed: Value = null, A_tmp: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [client_check, sight_check, include_radio, processing_list, processed_list, found_mobs, A, passed, A_tmp, B, $e];
	if (live(client_check) === null) {
		client_check = 1;
	}
	if (live(sight_check) === null) {
		sight_check = 1;
	}
	if (live(include_radio) === null) {
		include_radio = 1;
	}
	processing_list = rt.list(live(O));
	processed_list = rt.list();
	found_mobs = rt.list();
	while (truthy(rt.len(f, live(processing_list)))) {
		A = rt.index(live(processing_list), 1);
		passed = 0;
		if (truthy(rt.call(f, P("/proc/ismob"), null, [live(A)]))) {
			A_tmp = live(A);
			passed = 1;
			if ((truthy(live(client_check)) && !truthy(rt.fv(f, "client", live(A_tmp))))) {
				passed = 0;
			}
			if ((truthy(live(sight_check)) && !truthy(rt.call(f, P("/proc/isInSight"), null, [live(A_tmp), live(O)])))) {
				passed = 0;
			}
		} else {
			if ((truthy(live(include_radio)) && truthy((rt.istype(live(A), T("/obj/item/device/radio")) ? 1 : 0)))) {
				passed = 1;
				if ((truthy(live(sight_check)) && !truthy(rt.call(f, P("/proc/isInSight"), null, [live(A), live(O)])))) {
					passed = 0;
				}
			}
		}
		if (truthy(live(passed))) {
			(found_mobs = rt.modify(live(found_mobs), live(A), rt.bitOr));
		}
		B = null;
		rt.forList(f, 0, live(A), T("/atom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			if (!truthy(rt.index(live(processed_list), live(B)))) {
				(processing_list = rt.modify(live(processing_list), live(B), rt.bitOr));
			}
		}
		rt.endFor(f, 0);
		rt.callName(f, live(processing_list), "Cut", [1, 2]);
		rt.setAt(live(processed_list), live(A), live(A));
	}
	return live(found_mobs);
});

// /proc/get_hearers_in_view  (code/__HELPERS/game.dm:217)
rt.def("/proc/get_hearers_in_view", function get_hearers_in_view(f: Frame, R: Value, source: Value) {
	let _T: Value = null, hear: Value = null, range: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [_T, hear, range, A, $e];
	_T = rt.getStep(f, live(source), 0);
	hear = rt.list();
	if (!truthy(live(_T))) {
		return live(hear);
	}
	range = rt.call(f, P("/proc/get_hear"), null, [live(R), live(_T)]);
	// stress2b: the per-atom recursive_hear_check + list union loop is one native pass (collect_hearers, same order);
	// with the TG_CHECK_HEAR env flag the old loop also runs and every call is compared.
	hear = rt.call(f, P("/proc/collect_hearers"), null, [live(range)]);
	if (truthy(rt.call(f, P("/proc/hear_check_mode"), null, []))) {
		let old: Value = rt.list();
		A = null;
		rt.forList(f, 0, live(range), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			(old = rt.modify(live(old), rt.call(f, P("/proc/recursive_hear_check"), null, [live(A)]), rt.bitOr));
		}
		rt.endFor(f, 0);
		rt.call(f, P("/proc/hear_check_compare"), null, [live(hear), live(old)]);
	}
	return live(hear);
});

// /proc/get_mobs_in_radio_ranges  (code/__HELPERS/game.dm:234)
rt.def("/proc/get_mobs_in_radio_ranges", function get_mobs_in_radio_ranges(f: Frame, radios: Value) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	f.dot = rt.list();
	R = null;
	rt.forList(f, 0, live(radios), T("/obj/item/device/radio"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (truthy(live(R))) {
			(f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/get_hearers_in_view"), null, [rt.fv(f, "canhear_range", live(R)), live(R)]), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/inLineOfSight  (code/__HELPERS/game.dm:245)
rt.def("/proc/inLineOfSight", function inLineOfSight(f: Frame, X1: Value, Y1: Value, X2: Value, Y2: Value, Z: Value, PX1: Value, PY1: Value, PX2: Value, PY2: Value) {
	let _T: Value = null, s: Value = null, m: Value = null, b: Value = null, signX: Value = null, signY: Value = null;
	let $0: any;
	f.vars = () => [X1, Y1, Z, PX1, PY1, PX2, PY2, _T, s, m, b, signX, signY, $0];
	if (live(Z) === null) {
		Z = 1;
	}
	if (live(PX1) === null) {
		PX1 = 16.5;
	}
	if (live(PY1) === null) {
		PY1 = 16.5;
	}
	if (live(PX2) === null) {
		PX2 = 16.5;
	}
	if (live(PY2) === null) {
		PY2 = 16.5;
	}
	_T = null;
	if (isEqual(live(X1), live(X2))) {
		if (isEqual(live(Y1), live(Y2))) {
			return 1;
		} else {
			if (rt.lt(subtract(live(Y2), live(Y1)), 0)) {
				$0 = -1;
			} else {
				$0 = 1;
			}
			Y1 = rt.modify(live(Y1), (s = $0), add);
			while (!isEqual(live(Y1), live(Y2))) {
				if (truthy(rt.gv(f, "opacity", (_T = rt.locate(live(X1), live(Y1), live(Z)))))) {
					return 0;
				}
				Y1 = rt.modify(live(Y1), live(s), add);
			}
		}
	} else {
		m = divide(add(multiply(32, subtract(live(Y2), live(Y1))), subtract(live(PY2), live(PY1))), add(multiply(32, subtract(live(X2), live(X1))), subtract(live(PX2), live(PX1))));
		b = subtract(subtract(add(live(Y1), divide(live(PY1), 32)), 0.015625), multiply(live(m), subtract(add(live(X1), divide(live(PX1), 32)), 0.015625)));
		if (rt.lt(subtract(live(X2), live(X1)), 0)) {
			$0 = -1;
		} else {
			$0 = 1;
		}
		signX = $0;
		if (rt.lt(subtract(live(Y2), live(Y1)), 0)) {
			$0 = -1;
		} else {
			$0 = 1;
		}
		signY = $0;
		if (rt.lt(live(X1), live(X2))) {
			b = rt.modify(live(b), live(m), add);
		}
		while (!isEqual(live(X1), live(X2)) || !isEqual(live(Y1), live(Y2))) {
			if (truthy(rt.call(f, P("/proc/round"), null, [subtract(add(multiply(live(m), live(X1)), live(b)), live(Y1))]))) {
				Y1 = rt.modify(live(Y1), live(signY), add);
			} else {
				X1 = rt.modify(live(X1), live(signX), add);
			}
			if (truthy(rt.gv(f, "opacity", (_T = rt.locate(live(X1), live(Y1), live(Z)))))) {
				return 0;
			}
		}
	}
	return 1;
});

// /proc/isInSight  (code/__HELPERS/game.dm:276)
rt.def("/proc/isInSight", function isInSight(f: Frame, A: Value, B: Value) {
	let Aturf: Value = null, Bturf: Value = null;
	f.vars = () => [Aturf, Bturf];
	Aturf = rt.getStep(f, live(A), 0);
	Bturf = rt.getStep(f, live(B), 0);
	if ((!truthy(live(Aturf)) || !truthy(live(Bturf)))) {
		return 0;
	}
	if (truthy(rt.call(f, P("/proc/inLineOfSight"), null, [rt.fv(f, "x", live(Aturf)), rt.fv(f, "y", live(Aturf)), rt.fv(f, "x", live(Bturf)), rt.fv(f, "y", live(Bturf)), rt.fv(f, "z", live(Aturf))]))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /proc/get_cardinal_step_away  (code/__HELPERS/game.dm:291)
rt.def("/proc/get_cardinal_step_away", function get_cardinal_step_away(f: Frame, start: Value, finish: Value) {
	let dx: Value = null, dy: Value = null;
	f.vars = () => [dx, dy];
	dx = subtract(rt.fv(f, "x", live(finish)), rt.fv(f, "x", live(start)));
	if (rt.gt(rt.op(f, "Abs", [], [(dy = subtract(rt.fv(f, "y", live(finish)), rt.fv(f, "y", live(start))))]), rt.op(f, "Abs", [], [live(dx)]))) {
		if (rt.gt(live(dy), 0)) {
			return rt.getStep(f, live(start), 2);
		}
		return rt.getStep(f, live(start), 1);
	} else {
		if (rt.gt(live(dx), 0)) {
			return rt.getStep(f, live(start), 8);
		}
		return rt.getStep(f, live(start), 4);
	}
	return f.dot;
});

// /proc/try_move_adjacent  (code/__HELPERS/game.dm:305)  may sleep
rt.def("/proc/try_move_adjacent", function* try_move_adjacent(f: Frame, AM: Value) {
	let _T: Value = null, direction: Value = null;
	let $e: any;
	f.vars = () => [AM, _T, direction, $e];
	_T = rt.getStep(f, live(AM), 0);
	direction = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (truthy((yield* g.callName(f, live(AM), "Move", [rt.getStep(f, live(_T), live(direction))])))) {
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/get_mob_by_key  (code/__HELPERS/game.dm:311)
rt.def("/proc/get_mob_by_key", function get_mob_by_key(f: Frame, key: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "ckey", live(M)), rt.call(f, P("/proc/lowertext"), null, [live(key)]))) {
			return live(M);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /proc/get_candidates  (code/__HELPERS/game.dm:319)
rt.def("/proc/get_candidates", function get_candidates(f: Frame, be_special_type: Value, afk_bracket: Value, jobbanType: Value) {
	let candidates: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [afk_bracket, candidates, G, $e];
	if (live(afk_bracket) === null) {
		afk_bracket = rt.fv(f, "inactivity_period", rt.gl("config"));
	}
	candidates = rt.list();
	while (!truthy(rt.len(f, live(candidates))) && rt.lt(live(afk_bracket), rt.fv(f, "afk_period", rt.gl("config")))) {
		G = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			if (rt.fv(f, "client", live(G)) !== null) {
				if (!((truthy(rt.fv(f, "mind", live(G))) && truthy(rt.gv(f, "current", rt.fv(f, "mind", live(G))))) && !isEqual(rt.gv(f, "stat", rt.gv(f, "current", rt.fv(f, "mind", live(G)))), 2))) {
					if ((!truthy(rt.callName(f, rt.fv(f, "client", live(G)), "is_afk", [live(afk_bracket)])) && truthy((rt.isIn(f, live(be_special_type), rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(G))))) ? 1 : 0)))) {
						if (truthy(live(jobbanType))) {
							if (!(truthy(rt.call(f, P("/proc/jobban_isbanned"), null, [live(G), live(jobbanType)])) || truthy(rt.call(f, P("/proc/jobban_isbanned"), null, [live(G), "Syndicate"])))) {
								candidates = rt.modify(live(candidates), rt.fv(f, "client", live(G)), add);
							}
						} else {
							candidates = rt.modify(live(candidates), rt.fv(f, "client", live(G)), add);
						}
					}
				}
			}
		}
		rt.endFor(f, 0);
		afk_bracket = rt.modify(live(afk_bracket), 600, add);
	}
	return live(candidates);
});

// /proc/ScreenText  (code/__HELPERS/game.dm:335)  may sleep
rt.def("/proc/ScreenText", function* ScreenText(f: Frame, O: Value, maptext: Value, screen_loc: Value, maptext_height: Value, maptext_width: Value) {
	f.vars = () => [O, maptext, screen_loc, maptext_height, maptext_width];
	if (live(maptext) === null) {
		maptext = "";
	}
	if (live(screen_loc) === null) {
		screen_loc = "CENTER-7,CENTER-7";
	}
	if (live(maptext_height) === null) {
		maptext_height = 480;
	}
	if (live(maptext_width) === null) {
		maptext_width = 480;
	}
	if (!truthy((rt.istype(live(O), T("/obj")) ? 1 : 0))) {
		O = (yield* g.new_(f, T("/obj/screen/text"), []));
	}
	rt.setFv(f, "maptext", live(O), live(maptext));
	rt.setFv(f, "maptext_height", live(O), live(maptext_height));
	rt.setFv(f, "maptext_width", live(O), live(maptext_width));
	rt.setFv(f, "screen_loc", live(O), live(screen_loc));
	return live(O);
}, true);

// /proc/remove_images_from_clients  (code/__HELPERS/game.dm:344)
rt.def("/proc/remove_images_from_clients", function remove_images_from_clients(f: Frame, I: Value, show_to: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	C = null;
	rt.forList(f, 0, live(show_to), T("/client"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		(rt.modField(f, live(C), "images", live(I), subtract));
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { argTypes: [{ path: "/image" }, { path: "/list" }] });

// /proc/flick_overlay  (code/__HELPERS/game.dm:348)  may sleep
rt.def("/proc/flick_overlay", function* flick_overlay(f: Frame, I: Value, show_to: Value, duration: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [I, show_to, duration, C, $e];
	C = null;
	rt.forList(f, 0, live(show_to), T("/client"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		rt.modField(f, live(C), "images", live(I), add);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/remove_images_from_clients"), live(I), live(show_to)])), live(duration)]);
	return f.dot;
}, true);

// /proc/flick_overlay_view  (code/__HELPERS/game.dm:353)  may sleep
rt.def("/proc/flick_overlay_view", function* flick_overlay_view(f: Frame, I: Value, target: Value, duration: Value) {
	let viewing: Value = null, m: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [I, target, duration, viewing, m, M, $e];
	viewing = rt.list();
	m = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [live(target)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		if (truthy(rt.gv(f, "client", (M = live(m))))) {
			viewing = rt.modify(live(viewing), rt.fv(f, "client", live(M)), add);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/flick_overlay"), null, [live(I), live(viewing), live(duration)]);
	return f.dot;
}, true);

// /proc/get_active_player_count  (code/__HELPERS/game.dm:363)
rt.def("/proc/get_active_player_count", function get_active_player_count(f: Frame, alive_check: Value, afk_check: Value, human_check: Value) {
	let active_players: Value = null, i: Value = null, M: Value = null, O: Value = null;
	f.vars = () => [alive_check, afk_check, human_check, active_players, i, M, O];
	if (live(alive_check) === null) {
		alive_check = 0;
	}
	if (live(afk_check) === null) {
		afk_check = 0;
	}
	if (live(human_check) === null) {
		human_check = 0;
	}
	active_players = 0;
	i = null;
	i = 1;
	while (rt.le(live(i), rt.len(f, rt.gl("player_list")))) {
		blk57: {
			if ((truthy((M = rt.index(rt.gl("player_list"), live(i)))) && truthy(rt.fv(f, "client", live(M))))) {
				if (!(truthy(live(alive_check)) && truthy(rt.fv(f, "stat", live(M))))) {
					if (!(truthy(live(afk_check)) && truthy(rt.callName(f, rt.fv(f, "client", live(M)), "is_afk", [])))) {
						if (!(truthy(live(human_check)) && !truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)))) {
							if (!truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0))) {
								if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
									if (truthy(rt.gv(f, "started_as_observer", (O = live(M))))) {
										break blk57;
									}
								}
								active_players = rt.inc(live(active_players), 1);
							}
						}
					}
				}
			}
		}
		i = rt.inc(live(i), 1);
	}
	return live(active_players);
});

// /proc/projectile_trajectory  (code/__HELPERS/game.dm:408)
rt.def("/proc/projectile_trajectory", function projectile_trajectory(f: Frame, src_x: Value, src_y: Value, rotation: Value, angle: Value, power: Value) {
	let power_x: Value = null, power_y: Value = null, time: Value = null, distance: Value = null, dest_x: Value = null, dest_y: Value = null;
	f.vars = () => [power_x, power_y, time, distance, dest_x, dest_y];
	power_x = multiply(live(power), rt.op(f, "Cos", [], [live(angle)]));
	power_y = multiply(live(power), rt.op(f, "Sin", [], [live(angle)]));
	time = divide(multiply(2, live(power_y)), 10);
	distance = multiply(live(time), live(power_x));
	dest_x = add(live(src_x), multiply(live(distance), rt.op(f, "Sin", [], [live(rotation)])));
	dest_y = add(live(src_y), multiply(live(distance), rt.op(f, "Cos", [], [live(rotation)])));
	return rt.new_(f, T("/datum/projectile_data"), [live(src_x), live(src_y), live(time), live(distance), live(power_x), live(power_y), live(dest_x), live(dest_y)]);
});

// /proc/showCandidatePollWindow  (code/__HELPERS/game.dm:422)  may sleep
rt.def("/proc/showCandidatePollWindow", function* showCandidatePollWindow(f: Frame, M: Value, poll_time: Value, Question: Value, candidates: Value, ignore_category: Value, time_passed: Value, flashwindow: Value) {
	let L: Value = null;
	let $0: any;
	f.vars = () => [M, poll_time, Question, candidates, ignore_category, time_passed, flashwindow, L, $0];
	if (live(flashwindow) === null) {
		flashwindow = 1;
	}
	rt.op(f, "Output", [], [live(M), rt.rsc("sound/misc/notice2.ogg")], false);
	if (truthy(live(flashwindow))) {
		yield* g.call(f, P("/proc/window_flash"), null, [rt.fv(f, "client", live(M))]);
	}
	if (truthy(live(ignore_category))) {
		$0 = (yield* g.call(f, P("/proc/askuser"), null, [null, live(M), null, live(Question), null, fmt("Please answer in ＀ seconds!", [divide(live(poll_time), 10)]), null, "Yes", null, "No", null, "Never for this round", "StealFocus", 0, "Timeout", live(poll_time)], rt.Args.Named));
	} else {
		$0 = (yield* g.call(f, P("/proc/askuser"), null, [null, live(M), null, live(Question), null, fmt("Please answer in ＀ seconds!", [divide(live(poll_time), 10)]), null, "Yes", null, "No", "StealFocus", 0, "Timeout", live(poll_time)], rt.Args.Named));
	}
	if ($0 === 1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>Choice registered: Yes.</span>"]);
		if (rt.le(add(live(time_passed), live(poll_time)), rt.worldTime(f))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>Sorry, you answered too late to be considered!</span>"]);
			rt.op(f, "Output", [], [live(M), rt.rsc("sound/machines/buzz-sigh.ogg")], false);
			(candidates = rt.modify(live(candidates), live(M), subtract));
		} else {
			candidates = rt.modify(live(candidates), live(M), add);
		}
	} else if ($0 === 2) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>Choice registered: No.</span>"]);
		(candidates = rt.modify(live(candidates), live(M), subtract));
	} else if ($0 === 3) {
		if (!truthy((L = rt.index(rt.gl("poll_ignore"), live(ignore_category))))) {
			rt.setAt(rt.gl("poll_ignore"), live(ignore_category), rt.list());
		}
		rt.modAt(rt.gl("poll_ignore"), live(ignore_category), rt.fv(f, "ckey", live(M)), add);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>Choice registered: Never for this round.</span>"]);
		(candidates = rt.modify(live(candidates), live(M), subtract));
	} else {
		(candidates = rt.modify(live(candidates), live(M), subtract));
	}
	return f.dot;
}, true, { waitfor: false });

// /proc/pollGhostCandidates  (code/__HELPERS/game.dm:448)  may sleep
rt.def("/proc/pollGhostCandidates", function* pollGhostCandidates(f: Frame, Question: Value, jobbanType: Value, gametypeCheck: Value, be_special_flag: Value, poll_time: Value, ignore_category: Value, flashwindow: Value) {
	let candidates: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [Question, jobbanType, gametypeCheck, be_special_flag, poll_time, ignore_category, flashwindow, candidates, G, $e];
	if (live(be_special_flag) === null) {
		be_special_flag = 0;
	}
	if (live(poll_time) === null) {
		poll_time = 300;
	}
	if (live(ignore_category) === null) {
		ignore_category = null;
	}
	if (live(flashwindow) === null) {
		flashwindow = 1;
	}
	candidates = rt.list();
	G = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		candidates = rt.modify(live(candidates), live(G), add);
	}
	rt.endFor(f, 0);
	return (yield* g.call(f, P("/proc/pollCandidates"), null, [live(Question), live(jobbanType), live(gametypeCheck), live(be_special_flag), live(poll_time), live(ignore_category), live(flashwindow), live(candidates)]));
}, true);

// /proc/pollCandidates  (code/__HELPERS/game.dm:457)  may sleep
rt.def("/proc/pollCandidates", function* pollCandidates(f: Frame, Question: Value, jobbanType: Value, gametypeCheck: Value, be_special_flag: Value, poll_time: Value, ignore_category: Value, flashwindow: Value, group: Value) {
	let time_passed: Value = null, result: Value = null, m: Value = null, M: Value = null, M_2: Value = null;
	let $e: any;
	f.vars = () => [Question, jobbanType, gametypeCheck, be_special_flag, poll_time, ignore_category, flashwindow, group, time_passed, result, m, M, M_2, $e];
	if (live(be_special_flag) === null) {
		be_special_flag = 0;
	}
	if (live(poll_time) === null) {
		poll_time = 300;
	}
	if (live(ignore_category) === null) {
		ignore_category = null;
	}
	if (live(flashwindow) === null) {
		flashwindow = 1;
	}
	if (live(group) === null) {
		group = null;
	}
	time_passed = rt.worldTime(f);
	if (!truthy(live(Question))) {
		Question = "Would you like to be a special role?";
	}
	result = rt.list();
	m = null;
	rt.forList(f, 0, live(group));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		if (((!truthy(rt.gv(f, "key", (M = live(m)))) || !truthy(rt.fv(f, "client", live(M)))) || truthy((rt.isIn(f, ((live(ignore_category) && rt.index(rt.gl("poll_ignore"), live(ignore_category))) && rt.fv(f, "ckey", live(M))), rt.index(rt.gl("poll_ignore"), live(ignore_category))) ? 1 : 0)))) {
			continue;
		}
		if (truthy(live(be_special_flag))) {
			if ((!truthy(rt.gv(f, "prefs", rt.fv(f, "client", live(M)))) || !truthy((rt.isIn(f, live(be_special_flag), rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(M))))) ? 1 : 0)))) {
				continue;
			}
		}
		if (truthy(live(gametypeCheck))) {
		}
		if (truthy(live(jobbanType))) {
			if ((truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(M), live(jobbanType)]))) || truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(M), "Syndicate"]))))) {
				continue;
			}
		}
		yield* g.call(f, P("/proc/showCandidatePollWindow"), null, [live(M), live(poll_time), live(Question), live(result), live(ignore_category), live(time_passed), live(flashwindow)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [live(poll_time)]);
	M_2 = null;
	rt.forList(f, 0, live(result), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M_2 = $e;
		if ((!truthy(rt.fv(f, "key", live(M_2))) || !truthy(rt.fv(f, "client", live(M_2))))) {
			(result = rt.modify(live(result), live(M_2), subtract));
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/listclearnulls"), null, [live(result)]);
	return live(result);
}, true);

// /proc/pollCandidatesForMob  (code/__HELPERS/game.dm:487)  may sleep
rt.def("/proc/pollCandidatesForMob", function* pollCandidatesForMob(f: Frame, Question: Value, jobbanType: Value, gametypeCheck: Value, be_special_flag: Value, poll_time: Value, M: Value, ignore_category: Value) {
	let L: Value = null;
	f.vars = () => [Question, jobbanType, gametypeCheck, be_special_flag, poll_time, M, ignore_category, L];
	if (live(be_special_flag) === null) {
		be_special_flag = 0;
	}
	if (live(poll_time) === null) {
		poll_time = 300;
	}
	if (live(ignore_category) === null) {
		ignore_category = null;
	}
	L = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, [live(Question), live(jobbanType), live(gametypeCheck), live(be_special_flag), live(poll_time), live(ignore_category)]));
	if (((!truthy(live(M)) || (!truthy(live(M)) || truthy(rt.fv(f, "gc_destroyed", live(M))))) || !truthy(rt.fv(f, "loc", live(M))))) {
		return rt.list();
	}
	return live(L);
}, true);

// /proc/pollCandidatesForMobs  (code/__HELPERS/game.dm:493)  may sleep
rt.def("/proc/pollCandidatesForMobs", function* pollCandidatesForMobs(f: Frame, Question: Value, jobbanType: Value, gametypeCheck: Value, be_special_flag: Value, poll_time: Value, mobs: Value, ignore_category: Value) {
	let L: Value = null, i: Value = null, v: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [Question, jobbanType, gametypeCheck, be_special_flag, poll_time, mobs, ignore_category, L, i, v, A, $e];
	if (live(be_special_flag) === null) {
		be_special_flag = 0;
	}
	if (live(poll_time) === null) {
		poll_time = 300;
	}
	if (live(ignore_category) === null) {
		ignore_category = null;
	}
	L = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, [live(Question), live(jobbanType), live(gametypeCheck), live(be_special_flag), live(poll_time), live(ignore_category)]));
	i = 1;
	v = null;
	rt.forList(f, 0, live(mobs));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		if (((!truthy((A = live(v))) || (!truthy(live(A)) || truthy(rt.fv(f, "gc_destroyed", live(A))))) || !truthy(rt.fv(f, "loc", live(A))))) {
			yield* g.callName(f, live(mobs), "Cut", [live(i), add(live(i), 1)]);
		} else {
			i = rt.inc(live(i), 1);
		}
	}
	rt.endFor(f, 0);
	return live(L);
}, true);

// /proc/makeBody  (code/__HELPERS/game.dm:506)  may sleep
rt.def("/proc/makeBody", function* makeBody(f: Frame, G_found: Value) {
	let new_character: Value = null;
	f.vars = () => [G_found, new_character];
	if ((!truthy(live(G_found)) || !truthy(rt.fv(f, "key", live(G_found))))) {
		return live(f.dot);
	}
	new_character = (yield* g.new_(f, T("/mob/living/carbon/human"), []));
	yield* g.callName(f, rt.gl("SSjob"), "SendToLateJoin", [live(new_character)]);
	yield* g.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(G_found))), "copy_to", [live(new_character)]);
	yield* g.callName(f, rt.fv(f, "dna", live(new_character)), "update_dna_identity", []);
	rt.setFv(f, "key", live(new_character), rt.fv(f, "key", live(G_found)));
	return live(new_character);
}, true);

// /proc/send_to_playing_players  (code/__HELPERS/game.dm:520)
rt.def("/proc/send_to_playing_players", function send_to_playing_players(f: Frame, thing: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.gl("player_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(live(M)) && !truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), live(thing)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/window_flash  (code/__HELPERS/game.dm:525)
rt.def("/proc/window_flash", function window_flash(f: Frame, C: Value, ignorepref: Value) {
	let M: Value = null;
	f.vars = () => [C, ignorepref, M];
	if (live(ignorepref) === null) {
		ignorepref = 0;
	}
	if (truthy(rt.call(f, P("/proc/ismob"), null, [live(C)]))) {
		if (truthy(rt.gv(f, "client", (M = live(C))))) {
			C = rt.fv(f, "client", live(M));
		}
	}
	if ((!truthy(live(C)) || (!truthy(rt.gv(f, "windowflashing", rt.fv(f, "prefs", live(C)))) && !truthy(live(ignorepref))))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/winset"), null, [live(C), "mainwindow", "flash=5"]);
	return f.dot;
});

// /proc/AnnounceArrival  (code/__HELPERS/game.dm:534)  may sleep
rt.def("/proc/AnnounceArrival", function* AnnounceArrival(f: Frame, character: Value, rank: Value) {
	let A: Value = null, message: Value = null, announcer: Value = null;
	f.vars = () => [character, rank, A, message, announcer];
	if ((!truthy((yield* g.callName(f, rt.gl("SSticker"), "IsRoundInProgress", []))) || !truthy(live(character)))) {
		return live(f.dot);
	}
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(character)]));
	message = fmt("<span class='game deadsay'><span class='name'>＀</span> (＀) has arrived at the station at <span class='name'>＀</span>.</span>", [rt.fv(f, "real_name", live(character)), live(rank), rt.fv(f, "name", live(A))]);
	yield* g.call(f, P("/proc/deadchat_broadcast"), null, [null, live(message), "follow_target", live(character), "message_type", "arrivalrattle"], rt.Args.Named);
	if ((!truthy(rt.len(f, rt.gl("announcement_systems"))) || !truthy(rt.fv(f, "mind", live(character))))) {
		return live(f.dot);
	}
	if ((isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(character))), "Cyborg") || isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(character))), rt.gv(f, "special_role", rt.fv(f, "mind", live(character)))))) {
		return live(f.dot);
	}
	yield* g.callName(f, (announcer = rt.op(f, "PickUnweighted", [1], [rt.gl("announcement_systems")])), "announce", ["ARRIVAL", rt.fv(f, "real_name", live(character)), live(rank), rt.list()]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, {  }] });

// /proc/GetRedPart  (code/__HELPERS/game.dm:550)
rt.def("/proc/GetRedPart", function GetRedPart(f: Frame, hexa: Value) {
	return rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(hexa), 2, 4])]);
});

// /proc/GetGreenPart  (code/__HELPERS/game.dm:553)
rt.def("/proc/GetGreenPart", function GetGreenPart(f: Frame, hexa: Value) {
	return rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(hexa), 4, 6])]);
});

// /proc/GetBluePart  (code/__HELPERS/game.dm:556)
rt.def("/proc/GetBluePart", function GetBluePart(f: Frame, hexa: Value) {
	return rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(hexa), 6, 8])]);
});
