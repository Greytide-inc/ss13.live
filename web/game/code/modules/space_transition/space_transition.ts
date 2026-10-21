// From code/modules/space_transition/space_transition.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalz_levels_list  (code/modules/space_transition/space_transition.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalz_levels_list", function InitGlobalz_levels_list(f: Frame) {
	rt.setGl("z_levels_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "z_levels_list", add);
	return f.dot;
});

rt.type(4199, "/datum/space_level", "/datum", {
	name: "Your config settings failed, you need to fix this for the datum space levels to work",
	neigbours: null,
	z_value: 1,
	linked: 1,
	xi: null,
	yi: null,
});

// /datum/space_level/proc/<init>  (code/modules/space_transition/space_transition.dm:12)
rt.def("/datum/space_level/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "neigbours", rt.list());
	return f.dot;
});

// /datum/space_level/proc/New  (code/modules/space_transition/space_transition.dm:19)
rt.def("/datum/space_level/proc/New", function New(f: Frame, transition_type: Value) {
	let L: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [L, A, $e];
	rt.setSv(f, "linked", live(transition_type));
	if (!isEqual(rt.sv(f, "linked"), 1)) return f.dot;
	rt.setSv(f, "neigbours", rt.list());
	L = rt.list("1", "2", "4", "8");
	A = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.setAt(rt.sv(f, "neigbours"), live(A), live(f.src));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/space_level/proc/set_neigbours  (code/modules/space_transition/space_transition.dm:27)
rt.def("/datum/space_level/proc/set_neigbours", function set_neigbours(f: Frame, L: Value) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	_P = null;
	rt.forList(f, 0, live(L), T("/datum/point"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if (isEqual(rt.fv(f, "x", live(_P)), rt.sv(f, "xi"))) {
			if (isEqual(rt.fv(f, "y", live(_P)), add(rt.sv(f, "yi"), 1))) {
				rt.setAt(rt.sv(f, "neigbours"), "1", rt.fv(f, "spl", live(_P)));
				rt.setAt(rt.gv(f, "neigbours", rt.fv(f, "spl", live(_P))), "2", live(f.src));
			} else {
				if (isEqual(rt.fv(f, "y", live(_P)), subtract(rt.sv(f, "yi"), 1))) {
					rt.setAt(rt.sv(f, "neigbours"), "2", rt.fv(f, "spl", live(_P)));
					rt.setAt(rt.gv(f, "neigbours", rt.fv(f, "spl", live(_P))), "1", live(f.src));
				}
			}
		} else {
			if (isEqual(rt.fv(f, "y", live(_P)), rt.sv(f, "yi"))) {
				if (isEqual(rt.fv(f, "x", live(_P)), add(rt.sv(f, "xi"), 1))) {
					rt.setAt(rt.sv(f, "neigbours"), "4", rt.fv(f, "spl", live(_P)));
					rt.setAt(rt.gv(f, "neigbours", rt.fv(f, "spl", live(_P))), "8", live(f.src));
				} else {
					if (isEqual(rt.fv(f, "x", live(_P)), subtract(rt.sv(f, "xi"), 1))) {
						rt.setAt(rt.sv(f, "neigbours"), "8", rt.fv(f, "spl", live(_P)));
						rt.setAt(rt.gv(f, "neigbours", rt.fv(f, "spl", live(_P))), "4", live(f.src));
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(4200, "/datum/point", "/datum", {
	neigbours: null,
	x: null,
	y: null,
	spl: null,
});

// /datum/point/proc/<init>  (code/modules/space_transition/space_transition.dm:44)
rt.def("/datum/point/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "neigbours", rt.list());
	return f.dot;
});

// /datum/point/proc/New  (code/modules/space_transition/space_transition.dm:50)  may sleep
rt.def("/datum/point/proc/New", function* New(f: Frame, nx: Value, ny: Value, point_grid: Value) {
	let L: Value = null;
	f.vars = () => [nx, ny, point_grid, L];
	if (!truthy(live(point_grid))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	L = rt.index(live(point_grid), 1);
	if ((rt.gt(live(nx), rt.len(f, live(point_grid))) || rt.gt(live(ny), rt.len(f, live(L))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	rt.setSv(f, "x", live(nx));
	rt.setSv(f, "y", live(ny));
	if (truthy(rt.index(rt.index(live(point_grid), rt.sv(f, "x")), rt.sv(f, "y")))) {
		return live(f.dot);
	}
	rt.setAt(rt.index(live(point_grid), rt.sv(f, "x")), rt.sv(f, "y"), live(f.src));
	return f.dot;
}, true);

// /datum/point/proc/set_neigbours  (code/modules/space_transition/space_transition.dm:65)
rt.def("/datum/point/proc/set_neigbours", function set_neigbours(f: Frame, grid: Value) {
	let max_X: Value = null, max_Y: Value = null;
	f.vars = () => [max_X, max_Y];
	max_X = rt.len(f, live(grid));
	max_Y = rt.getLen(f, (max_Y = rt.index(live(grid), 1)));
	rt.callName(f, rt.sv(f, "neigbours"), "Cut", []);
	if (rt.le(add(rt.sv(f, "x"), 1), live(max_X))) {
		(rt.modSrcVar(f, "neigbours", rt.index(rt.index(live(grid), add(rt.sv(f, "x"), 1)), rt.sv(f, "y")), rt.bitOr));
	}
	if (rt.ge(subtract(rt.sv(f, "x"), 1), 1)) {
		(rt.modSrcVar(f, "neigbours", rt.index(rt.index(live(grid), subtract(rt.sv(f, "x"), 1)), rt.sv(f, "y")), rt.bitOr));
	}
	if (rt.le(add(rt.sv(f, "y"), 1), live(max_Y))) {
		(rt.modSrcVar(f, "neigbours", rt.index(rt.index(live(grid), rt.sv(f, "x")), add(rt.sv(f, "y"), 1)), rt.bitOr));
	}
	if (!rt.ge(subtract(rt.sv(f, "y"), 1), 1)) return f.dot;
	(rt.modSrcVar(f, "neigbours", rt.index(rt.index(live(grid), rt.sv(f, "x")), subtract(rt.sv(f, "y"), 1)), rt.bitOr));
	return f.dot;
});

// /proc/setup_map_transitions  (code/modules/space_transition/space_transition.dm:78)  may sleep
rt.def("/proc/setup_map_transitions", function* setup_map_transitions(f: Frame) {
	let SLS: Value = null, D: Value = null, cached_transitions: Value = null, conf_set_len: Value = null, k: Value = null, A: Value = null, point_grid: Value = null, grid: Value = null, _P: Value = null, i: Value = null, j: Value = null, pnt: Value = null, possible_points: Value = null, used_points: Value = null, A_10: Value = null, x_pos_beginning: Value = null, y_pos_beginning: Value = null, x_pos_ending: Value = null, y_pos_ending: Value = null, x_pos_transition: Value = null, y_pos_transition: Value = null, zlevelnumber: Value = null, side: Value = null, beginning: Value = null, ending: Value = null, turfblock: Value = null, dirside: Value = null, zdestination: Value = null, S: Value = null, A_16: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [SLS, D, cached_transitions, conf_set_len, k, A, point_grid, grid, _P, i, j, pnt, possible_points, used_points, A_10, x_pos_beginning, y_pos_beginning, x_pos_ending, y_pos_ending, x_pos_transition, y_pos_transition, zlevelnumber, side, beginning, ending, turfblock, dirside, zdestination, S, A_16, $0, $1, $e];
	SLS = rt.list();
	D = null;
	cached_transitions = rt.gv(f, "transition_config", rt.fv(f, "config", rt.gl("SSmapping")));
	conf_set_len = rt.len(f, live(cached_transitions));
	k = 1;
	A = null;
	rt.forList(f, 0, live(cached_transitions));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.setFv(f, "name", (D = (yield* g.new_(f, T("/datum/space_level"), [rt.index(live(cached_transitions), live(A))]))), live(A));
		rt.setFv(f, "z_value", live(D), live(k));
		if (!isEqual(rt.fv(f, "linked", live(D)), 2)) {
			rt.setAt(rt.gl("z_levels_list"), fmt("＀", [rt.fv(f, "z_value", live(D))]), live(D));
		} else {
			yield* g.callName(f, live(SLS), "Add", [live(D)]);
		}
		k = rt.inc(live(k), 1);
	}
	rt.endFor(f, 0);
	point_grid = rt.op(f, "CreateMultidimensionalList", [2], [add(multiply(live(conf_set_len), 2), 1), add(multiply(live(conf_set_len), 2), 1)]);
	grid = rt.list();
	_P = null;
	i = null;
	i = 1;
	while (rt.le(live(i), add(multiply(live(conf_set_len), 2), 1))) {
		j = null;
		j = 1;
		while (rt.le(live(j), add(multiply(live(conf_set_len), 2), 1))) {
			_P = (yield* g.new_(f, T("/datum/point"), [live(i), live(j), live(point_grid)]));
			rt.setAt(rt.index(live(point_grid), live(i)), live(j), live(_P));
			yield* g.callName(f, live(grid), "Add", [live(_P)]);
			j = rt.inc(live(j), 1);
		}
		i = rt.inc(live(i), 1);
	}
	pnt = null;
	rt.forList(f, 0, live(grid), T("/datum/point"));
	while (($e = rt.next(f, 0)) !== undefined) {
		pnt = $e;
		yield* g.callName(f, live(pnt), "set_neigbours", [live(point_grid)]);
	}
	rt.endFor(f, 0);
	_P = rt.index(rt.index(live(point_grid), add(live(conf_set_len), 1)), add(live(conf_set_len), 1));
	possible_points = rt.list();
	used_points = rt.list();
	yield* g.callName(f, live(grid), "Cut", []);
	while (truthy(rt.len(f, live(SLS)))) {
		rt.setFv(f, "xi", (D = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(SLS)]))), rt.fv(f, "x", live(_P)));
		rt.setFv(f, "yi", live(D), rt.fv(f, "y", live(_P)));
		rt.setFv(f, "spl", live(_P), live(D));
		(possible_points = rt.modify(live(possible_points), rt.fv(f, "neigbours", live(_P)), rt.bitOr));
		(used_points = rt.modify(live(used_points), live(_P), rt.bitOr));
		yield* g.callName(f, live(possible_points), "Remove", [live(used_points)]);
		yield* g.callName(f, live(D), "set_neigbours", [live(used_points)]);
		_P = rt.op(f, "PickUnweighted", [1], [live(possible_points)]);
		rt.setAt(live(grid), fmt("＀", [rt.fv(f, "z_value", live(D))]), live(D));
	}
	A_10 = null;
	rt.forList(f, 0, rt.gl("z_levels_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A_10 = $e;
		rt.setAt(live(grid), live(A_10), rt.index(rt.gl("z_levels_list"), live(A_10)));
	}
	rt.endFor(f, 0);
	x_pos_beginning = rt.list(1, 1, subtract(rt.fv(f, "maxx", rt.world()), 7), 1);
	y_pos_beginning = rt.list(subtract(rt.fv(f, "maxy", rt.world()), 7), 1, 7, 7);
	x_pos_ending = rt.list(rt.fv(f, "maxx", rt.world()), rt.fv(f, "maxx", rt.world()), rt.fv(f, "maxx", rt.world()), 7);
	y_pos_ending = rt.list(rt.fv(f, "maxy", rt.world()), 7, subtract(rt.fv(f, "maxy", rt.world()), 7), subtract(rt.fv(f, "maxy", rt.world()), 7));
	x_pos_transition = rt.list(1, 1, 9, subtract(subtract(rt.fv(f, "maxx", rt.world()), 7), 2));
	y_pos_transition = rt.list(9, subtract(subtract(rt.fv(f, "maxy", rt.world()), 7), 2), 1, 1);
	zlevelnumber = null;
	zlevelnumber = 1;
	while (rt.le(live(zlevelnumber), rt.len(f, live(grid)))) {
		if (!truthy((D = rt.index(live(grid), fmt("＀", [live(zlevelnumber)]))))) {
			yield* g.call(f, P("/proc/CRASH"), null, [fmt("＀ position has no space level datum.", [live(zlevelnumber)])]);
		}
		if (truthy(rt.getLen(f, rt.fv(f, "neigbours", live(D))))) {
			side = null;
			side = 1;
			while (rt.lt(live(side), 5)) {
				beginning = rt.locate(rt.index(live(x_pos_beginning), live(side)), rt.index(live(y_pos_beginning), live(side)), live(zlevelnumber));
				ending = rt.locate(rt.index(live(x_pos_ending), live(side)), rt.index(live(y_pos_ending), live(side)), live(zlevelnumber));
				turfblock = (yield* g.call(f, P("/proc/block"), null, [live(beginning), live(ending)]));
				dirside = rt.power(2, subtract(live(side), 1));
				zdestination = live(zlevelnumber);
				if ((truthy(rt.index(rt.fv(f, "neigbours", live(D)), fmt("＀", [live(dirside)]))) && !isEqual(rt.index(rt.fv(f, "neigbours", live(D)), fmt("＀", [live(dirside)])), live(D)))) {
					zdestination = rt.gv(f, "z_value", (D = rt.index(rt.fv(f, "neigbours", live(D)), fmt("＀", [live(dirside)]))));
				} else {
					dirside = (yield* g.call(f, P("/proc/turn"), null, [live(dirside), 180]));
					while (truthy(rt.index(rt.fv(f, "neigbours", live(D)), fmt("＀", [live(dirside)]))) && !isEqual(rt.index(rt.fv(f, "neigbours", live(D)), fmt("＀", [live(dirside)])), live(D))) {
						D = rt.index(rt.fv(f, "neigbours", live(D)), fmt("＀", [live(dirside)]));
					}
					zdestination = rt.fv(f, "z_value", live(D));
				}
				D = rt.index(live(grid), fmt("＀", [live(zlevelnumber)]));
				S = null;
				rt.forList(f, 0, live(turfblock), T("/turf/open/space"));
				while (($e = rt.next(f, 0)) !== undefined) {
					S = $e;
					$0 = live(S);
					if (isEqual(rt.index(live(x_pos_transition), live(side)), 1)) {
						$1 = rt.fv(f, "x", live(S));
					} else {
						$1 = rt.index(live(x_pos_transition), live(side));
					}
					rt.setFv(f, "destination_x", $0, $1);
					$0 = live(S);
					if (isEqual(rt.index(live(y_pos_transition), live(side)), 1)) {
						$1 = rt.fv(f, "y", live(S));
					} else {
						$1 = rt.index(live(y_pos_transition), live(side));
					}
					rt.setFv(f, "destination_y", $0, $1);
					rt.setFv(f, "destination_z", live(S), live(zdestination));
				}
				rt.endFor(f, 0);
				side = rt.inc(live(side), 1);
			}
		}
		zlevelnumber = rt.inc(live(zlevelnumber), 1);
	}
	A_16 = null;
	rt.forList(f, 0, live(grid));
	while (($e = rt.next(f, 0)) !== undefined) {
		A_16 = $e;
		rt.setAt(rt.gl("z_levels_list"), live(A_16), rt.index(live(grid), live(A_16)));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
