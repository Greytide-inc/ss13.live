// Based on /tg/station's code/modules/space_transition/space_transition.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// space_transition.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalz_levels_list", function InitGlobalz_levels_list(f: Frame) {
	GLOB.z_levels_list = list();
	this.gvars_datum_init_order += "z_levels_list";
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

// space_transition.dm:12
rt.def("/datum/space_level/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.neigbours = list();
	return f.dot;
});

// space_transition.dm:19
rt.def("/datum/space_level/proc/New", function New(f: Frame, transition_type: Value) {
	let A: Value = null;
	this.linked = transition_type;
	if (this.linked != SELFLOOPING) return f.dot;
	this.neigbours = list();
	let L: Value = list("1", "2", "4", "8");
	for (A of each(L)) {
		rt.setAt(this.neigbours, A, this);
	}
	return f.dot;
});

// space_transition.dm:27
rt.def("/datum/space_level/proc/set_neigbours", function set_neigbours(f: Frame, L: Value) {
	let _P: Value = null;
	for (_P of each(L, T("/datum/point"))) {
		if (_P.x == this.xi) {
			if (_P.y == this.yi + 1) {
				rt.setAt(this.neigbours, "1", _P.spl);
				rt.setAt(_P.spl.neigbours, "2", this);
			} else if (_P.y == this.yi - 1) {
				rt.setAt(this.neigbours, "2", _P.spl);
				rt.setAt(_P.spl.neigbours, "1", this);
			}
		} else if (_P.y == this.yi) {
			if (_P.x == this.xi + 1) {
				rt.setAt(this.neigbours, "4", _P.spl);
				rt.setAt(_P.spl.neigbours, "8", this);
			} else if (_P.x == this.xi - 1) {
				rt.setAt(this.neigbours, "8", _P.spl);
				rt.setAt(_P.spl.neigbours, "4", this);
			}
		}
	}
	return f.dot;
});

rt.type(4200, "/datum/point", "/datum", {
	neigbours: null,
	x: null,
	y: null,
	spl: null,
});

// space_transition.dm:44
rt.def("/datum/point/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.neigbours = list();
	return f.dot;
});

// space_transition.dm:50
rt.def("/datum/point/proc/New", function* New(f: Frame, nx: Value, ny: Value, point_grid: Value) {
	if (!point_grid) {
		yield* qdel(this);
		return f.dot;
	}
	let L: Value = rt.index(point_grid, 1);
	if (nx > rt.len(f, point_grid) || ny > rt.len(f, L)) {
		yield* qdel(this);
		return f.dot;
	}
	this.x = nx;
	this.y = ny;
	if (rt.index(rt.index(point_grid, this.x), this.y)) {
		return f.dot;
	}
	rt.setAt(rt.index(point_grid, this.x), this.y, this);
	return f.dot;
}, true);

// space_transition.dm:65
rt.def("/datum/point/proc/set_neigbours", function set_neigbours(f: Frame, grid: Value) {
	let max_Y: Value = null;
	let max_X: Value = rt.len(f, grid);
	max_Y = rt.len(f, (max_Y = rt.index(grid, 1)));
	this.neigbours.Cut();
	if (this.x + 1 <= max_X) {
		(rt.modSrcVar(f, "neigbours", rt.index(rt.index(grid, this.x + 1), this.y), rt.bitOr));
	}
	if (this.x - 1 >= 1) {
		(rt.modSrcVar(f, "neigbours", rt.index(rt.index(grid, this.x - 1), this.y), rt.bitOr));
	}
	if (this.y + 1 <= max_Y) {
		(rt.modSrcVar(f, "neigbours", rt.index(rt.index(grid, this.x), this.y + 1), rt.bitOr));
	}
	if (!(this.y - 1 >= 1)) return f.dot;
	(rt.modSrcVar(f, "neigbours", rt.index(rt.index(grid, this.x), this.y - 1), rt.bitOr));
	return f.dot;
});

// space_transition.dm:78
rt.def("/proc/setup_map_transitions", function* setup_map_transitions(f: Frame) {
	let D: Value = null, A: Value = null, _P: Value = null, j: Value = null, pnt: Value = null, A_10: Value = null, side: Value = null, beginning: Value = null, ending: Value = null, turfblock: Value = null, dirside: Value = null, zdestination: Value = null, S: Value = null, A_16: Value = null;
	let $0: any, $1: any, $e: any;
	let SLS: Value = list();
	let cached_transitions: Value = GLOB.SSmapping.config.transition_config;
	let conf_set_len: Value = rt.len(f, cached_transitions);
	let k: Value = 1;
	for (A of each(cached_transitions)) {
		(D = (yield* new_(T("/datum/space_level"), rt.index(cached_transitions, A)))).name = A;
		D.z_value = k;
		if (D.linked != 2) {
			rt.setAt(GLOB.z_levels_list, `${D.z_value}`, D);
		} else {
			SLS.Add(D);
		}
		k++;
	}
	let point_grid: Value = rt.op(f, "CreateMultidimensionalList", [2], [conf_set_len * 2 + 1, conf_set_len * 2 + 1]);
	let grid: Value = list();
	let i: Value = 1;
	while (i <= conf_set_len * 2 + 1) {
		j = 1;
		while (j <= conf_set_len * 2 + 1) {
			_P = (yield* new_(T("/datum/point"), i, j, point_grid));
			rt.setAt(rt.index(point_grid, i), j, _P);
			grid.Add(_P);
			j++;
		}
		i++;
	}
	for (pnt of each(grid, T("/datum/point"))) {
		pnt.set_neigbours(point_grid);
	}
	_P = rt.index(rt.index(point_grid, conf_set_len + 1), conf_set_len + 1);
	let possible_points: Value = list();
	let used_points: Value = list();
	grid.Cut();
	while (rt.len(f, SLS)) {
		(D = pick_n_take(SLS)).xi = _P.x;
		D.yi = _P.y;
		_P.spl = D;
		(possible_points = rt.modify(possible_points, _P.neigbours, rt.bitOr));
		(used_points = rt.modify(used_points, _P, rt.bitOr));
		yield* possible_points.Remove(used_points);
		D.set_neigbours(used_points);
		_P = pick(possible_points);
		rt.setAt(grid, `${D.z_value}`, D);
	}
	for (A_10 of each(GLOB.z_levels_list)) {
		rt.setAt(grid, A_10, rt.index(GLOB.z_levels_list, A_10));
	}
	let x_pos_beginning: Value = list(1, 1, rt.world().maxx - TRANSITIONEDGE, 1);
	let y_pos_beginning: Value = list(rt.world().maxy - TRANSITIONEDGE, 1, TRANSITIONEDGE, TRANSITIONEDGE);
	let x_pos_ending: Value = list(rt.world().maxx, rt.world().maxx, rt.world().maxx, TRANSITIONEDGE);
	let y_pos_ending: Value = list(rt.world().maxy, TRANSITIONEDGE, rt.world().maxy - TRANSITIONEDGE, rt.world().maxy - TRANSITIONEDGE);
	let x_pos_transition: Value = list(1, 1, 9, rt.world().maxx - TRANSITIONEDGE - 2);
	let y_pos_transition: Value = list(9, rt.world().maxy - TRANSITIONEDGE - 2, 1, 1);
	let zlevelnumber: Value = 1;
	while (zlevelnumber <= rt.len(f, grid)) {
		if (!(D = rt.index(grid, `${zlevelnumber}`))) {
			CRASH(`${zlevelnumber} position has no space level datum.`);
		}
		if (rt.len(f, D.neigbours)) {
			side = 1;
			while (side < 5) {
				beginning = rt.locate(rt.index(x_pos_beginning, side), rt.index(y_pos_beginning, side), zlevelnumber);
				ending = rt.locate(rt.index(x_pos_ending, side), rt.index(y_pos_ending, side), zlevelnumber);
				turfblock = block(beginning, ending);
				dirside = 2 ** (side - 1);
				zdestination = zlevelnumber;
				if (rt.index(D.neigbours, `${dirside}`) && rt.index(D.neigbours, `${dirside}`) != D) {
					zdestination = (D = rt.index(D.neigbours, `${dirside}`)).z_value;
				} else {
					dirside = turn(dirside, 180);
					while (rt.index(D.neigbours, `${dirside}`) && rt.index(D.neigbours, `${dirside}`) != D) {
						D = rt.index(D.neigbours, `${dirside}`);
					}
					zdestination = D.z_value;
				}
				D = rt.index(grid, `${zlevelnumber}`);
				S = null;
				for (S of each(turfblock, T("/turf/open/space"))) {
					$0 = S;
					if (rt.index(x_pos_transition, side) == 1) {
						$1 = S.x;
					} else {
						$1 = rt.index(x_pos_transition, side);
					}
					$0.destination_x = $1;
					$0 = S;
					if (rt.index(y_pos_transition, side) == 1) {
						$1 = S.y;
					} else {
						$1 = rt.index(y_pos_transition, side);
					}
					$0.destination_y = $1;
					S.destination_z = zdestination;
				}
				side++;
			}
		}
		zlevelnumber++;
	}
	for (A_16 of each(grid)) {
		rt.setAt(GLOB.z_levels_list, A_16, rt.index(grid, A_16));
	}
	return f.dot;
}, true);
