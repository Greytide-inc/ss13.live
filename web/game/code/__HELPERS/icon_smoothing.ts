// Based on /tg/station's code/__HELPERS/icon_smoothing.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// icon_smoothing.dm:58
rt.def("/proc/calculate_adjacencies", function calculate_adjacencies(f: Frame, A: Value) {
	let AM: Value = null, direction: Value = null;
	if (!A.loc) {
		return 0;
	}
	let adjacencies: Value = 0;
	if (rt.istype(A, T("/atom/movable"))) {
		if ((AM = A).can_be_unanchored && !AM.anchored) {
			return 0;
		}
	}
	for (direction of each(GLOB.cardinal)) {
		if ((AM = find_type_in_direction(A, direction)) == 123456792) {
			if (rt.bitAnd(A.smooth, SMOOTH_BORDER)) {
				(adjacencies = rt.modify(adjacencies, rt.shiftLeft(1, direction), rt.bitOr));
			}
		} else if (AM && !rt.istype(AM, T("/atom/movable")) || rt.istype(AM, T("/atom/movable")) && AM.anchored) {
			(adjacencies = rt.modify(adjacencies, rt.shiftLeft(1, direction), rt.bitOr));
		}
	}
	if (rt.bitAnd(adjacencies, N_NORTH)) {
		if (rt.bitAnd(adjacencies, N_WEST)) {
			if ((AM = find_type_in_direction(A, 9)) == 123456792) {
				if (rt.bitAnd(A.smooth, SMOOTH_BORDER)) {
					(adjacencies = rt.modify(adjacencies, N_NORTHWEST, rt.bitOr));
				}
			} else if (AM && !rt.istype(AM, T("/atom/movable")) || rt.istype(AM, T("/atom/movable")) && AM.anchored) {
				(adjacencies = rt.modify(adjacencies, N_NORTHWEST, rt.bitOr));
			}
		}
		if (rt.bitAnd(adjacencies, N_EAST)) {
			if ((AM = find_type_in_direction(A, 5)) == 123456792) {
				if (rt.bitAnd(A.smooth, SMOOTH_BORDER)) {
					(adjacencies = rt.modify(adjacencies, N_NORTHEAST, rt.bitOr));
				}
			} else if (AM && !rt.istype(AM, T("/atom/movable")) || rt.istype(AM, T("/atom/movable")) && AM.anchored) {
				(adjacencies = rt.modify(adjacencies, N_NORTHEAST, rt.bitOr));
			}
		}
	}
	if (rt.bitAnd(adjacencies, N_SOUTH)) {
		if (rt.bitAnd(adjacencies, N_WEST)) {
			if ((AM = find_type_in_direction(A, 10)) == 123456792) {
				if (rt.bitAnd(A.smooth, SMOOTH_BORDER)) {
					(adjacencies = rt.modify(adjacencies, N_SOUTHWEST, rt.bitOr));
				}
			} else if (AM && !rt.istype(AM, T("/atom/movable")) || rt.istype(AM, T("/atom/movable")) && AM.anchored) {
				(adjacencies = rt.modify(adjacencies, N_SOUTHWEST, rt.bitOr));
			}
		}
		if (rt.bitAnd(adjacencies, N_EAST)) {
			if ((AM = find_type_in_direction(A, 6)) == 123456792) {
				if (rt.bitAnd(A.smooth, SMOOTH_BORDER)) {
					(adjacencies = rt.modify(adjacencies, N_SOUTHEAST, rt.bitOr));
				}
			} else if (AM && !rt.istype(AM, T("/atom/movable")) || rt.istype(AM, T("/atom/movable")) && AM.anchored) {
				(adjacencies = rt.modify(adjacencies, N_SOUTHEAST, rt.bitOr));
			}
		}
	}
	return adjacencies;
});

// icon_smoothing.dm:113
rt.def("/proc/smooth_icon", function smooth_icon(f: Frame, A: Value) {
	if (!A || !A.smooth) {
		return f.dot;
	}
	(rt.modField(f, A, "smooth", 16777199, rt.bitAnd));
	if (!A.z) {
		return f.dot;
	}
	if (!A || A.gc_destroyed) {
		return f.dot;
	}
	if (!(rt.bitAnd(A.smooth, SMOOTH_TRUE) || rt.bitAnd(A.smooth, SMOOTH_MORE))) return f.dot;
	let adjacencies: Value = calculate_adjacencies(A);
	if (rt.bitAnd(A.smooth, SMOOTH_DIAGONAL)) {
		A.diagonal_smooth(adjacencies);
	} else {
		cardinal_smooth(A, adjacencies);
	}
	return f.dot;
});

// icon_smoothing.dm:129
rt.def("/atom/proc/diagonal_smooth", function diagonal_smooth(f: Frame, adjacencies: Value) {
	if (adjacencies === 258) {
		this.replace_smooth_overlays("d-se", "d-se-0");
	} else if (adjacencies === 18) {
		this.replace_smooth_overlays("d-sw", "d-sw-0");
	} else if (adjacencies === 260) {
		this.replace_smooth_overlays("d-ne", "d-ne-0");
	} else if (adjacencies === 20) {
		this.replace_smooth_overlays("d-nw", "d-nw-0");
	} else if (adjacencies === 770) {
		this.replace_smooth_overlays("d-se", "d-se-1");
	} else if (adjacencies === 50) {
		this.replace_smooth_overlays("d-sw", "d-sw-1");
	} else if (adjacencies === 1284) {
		this.replace_smooth_overlays("d-ne", "d-ne-1");
	} else if (adjacencies === 84) {
		this.replace_smooth_overlays("d-nw", "d-nw-1");
	} else {
		cardinal_smooth(this, adjacencies);
		return f.dot;
	}
	this.icon_state = "";
	return adjacencies;
});

// icon_smoothing.dm:157
rt.def("/turf/closed/wall/proc/diagonal_smooth", function diagonal_smooth(f: Frame) {
	let turned_adjacency: Value = null, _T: Value = null;
	if (!(f.args[0] = reverse_ndir(parent_proc()))) return f.dot;
	let underlay_appearance: Value = mutable_appearance({ layer: 2 });
	let U: Value = list(underlay_appearance);
	if (this.fixed_underlay) {
		if (rt.at(this.fixed_underlay, "space")) {
			underlay_appearance.icon = rt.rsc("icons/turf/space.dmi");
			underlay_appearance.icon_state = `${rt.bitXor(this.x + this.y, rt.op(f, "BitNot", [], [this.x * this.y]) + this.z) % 25}`;
			underlay_appearance.plane = PLANE_SPACE;
		} else {
			underlay_appearance.icon = rt.at(this.fixed_underlay, "icon");
			underlay_appearance.icon_state = rt.at(this.fixed_underlay, "icon_state");
		}
	} else {
		turned_adjacency = turn(f.args[0], 180);
		if (!(_T = rt.getStep(f, this, turned_adjacency)).get_smooth_underlay_icon(underlay_appearance, this, turned_adjacency)) {
			if (!(_T = rt.getStep(f, this, turn(f.args[0], 135))).get_smooth_underlay_icon(underlay_appearance, this, turned_adjacency)) {
				_T = rt.getStep(f, this, turn(f.args[0], 225));
			}
		}
		if (!_T.get_smooth_underlay_icon(underlay_appearance, this, turned_adjacency) && !this.get_smooth_underlay_icon(underlay_appearance, this, turned_adjacency)) {
			underlay_appearance.icon = rt.rsc("icons/turf/floors.dmi");
			underlay_appearance.icon_state = "plating";
		}
	}
	this.underlays = U;
	return f.dot;
}, false, { args: ["adjacencies"] });

// icon_smoothing.dm:185
rt.def("/proc/cardinal_smooth", function cardinal_smooth(f: Frame, A: Value, adjacencies: Value) {
	let New: Value = null;
	let nw: Value = "1-i";
	if (rt.bitAnd(adjacencies, N_NORTH) && rt.bitAnd(adjacencies, N_WEST)) {
		if (rt.bitAnd(adjacencies, N_NORTHWEST)) {
			nw = "1-f";
		} else {
			nw = "1-nw";
		}
	} else if (rt.bitAnd(adjacencies, N_NORTH)) {
		nw = "1-n";
	} else if (rt.bitAnd(adjacencies, N_WEST)) {
		nw = "1-w";
	}
	let ne: Value = "2-i";
	if (rt.bitAnd(adjacencies, N_NORTH) && rt.bitAnd(adjacencies, N_EAST)) {
		if (rt.bitAnd(adjacencies, N_NORTHEAST)) {
			ne = "2-f";
		} else {
			ne = "2-ne";
		}
	} else if (rt.bitAnd(adjacencies, N_NORTH)) {
		ne = "2-n";
	} else if (rt.bitAnd(adjacencies, N_EAST)) {
		ne = "2-e";
	}
	let sw: Value = "3-i";
	if (rt.bitAnd(adjacencies, N_SOUTH) && rt.bitAnd(adjacencies, N_WEST)) {
		if (rt.bitAnd(adjacencies, N_SOUTHWEST)) {
			sw = "3-f";
		} else {
			sw = "3-sw";
		}
	} else if (rt.bitAnd(adjacencies, N_SOUTH)) {
		sw = "3-s";
	} else if (rt.bitAnd(adjacencies, N_WEST)) {
		sw = "3-w";
	}
	let se: Value = "4-i";
	if (rt.bitAnd(adjacencies, N_SOUTH) && rt.bitAnd(adjacencies, N_EAST)) {
		if (rt.bitAnd(adjacencies, N_SOUTHEAST)) {
			se = "4-f";
		} else {
			se = "4-se";
		}
	} else if (rt.bitAnd(adjacencies, N_SOUTH)) {
		se = "4-s";
	} else if (rt.bitAnd(adjacencies, N_EAST)) {
		se = "4-e";
	}
	if (A.top_left_corner != nw) {
		A.cut_overlay(A.top_left_corner);
		A.top_left_corner = nw;
		if (!New) {
			New = list();
		}
		New += nw;
	}
	if (A.top_right_corner != ne) {
		A.cut_overlay(A.top_right_corner);
		A.top_right_corner = ne;
		if (!New) {
			New = list();
		}
		New += ne;
	}
	if (A.bottom_right_corner != sw) {
		A.cut_overlay(A.bottom_right_corner);
		A.bottom_right_corner = sw;
		if (!New) {
			New = list();
		}
		New += sw;
	}
	if (A.bottom_left_corner != se) {
		A.cut_overlay(A.bottom_left_corner);
		A.bottom_left_corner = se;
		if (!New) {
			New = list();
		}
		New += se;
	}
	if (!New) return f.dot;
	A.add_overlay(New);
	return f.dot;
});

// icon_smoothing.dm:262
rt.def("/proc/find_type_in_direction", function find_type_in_direction(f: Frame, source: Value, direction: Value) {
	let target_turf: Value = null, A: Value = null, a_type: Value = null;
	let $e: any;
	if (!(target_turf = rt.getStep(f, source, direction))) {
		return 123456792;
	}
	if (source.canSmoothWith) {
		if (rt.bitAnd(source.smooth, SMOOTH_MORE)) {
			for (a_type of each(source.canSmoothWith)) {
				if (rt.op(f, "IsType", [], [target_turf, a_type])) {
					return target_turf;
				}
				if (A = rt.locateIn(f, a_type, target_turf)) {
					return A;
				}
			}
			return null;
		}
		a_type = null;
		for (a_type of each(source.canSmoothWith)) {
			if (a_type == target_turf.type) {
				return target_turf;
			}
			if ((A = rt.locateIn(f, a_type, target_turf)) && A.type == a_type) {
				return A;
			}
		}
		return null;
	} else {
		if (isturf(source)) {
			return source.type == target_turf.type ? target_turf : null;
		}
		return (A = rt.locateIn(f, source.type, target_turf)) && A.type == source.type ? A : null;
	}
});

// icon_smoothing.dm:292
rt.def("/proc/smooth_zlevel", function smooth_zlevel(f: Frame, zlevel: Value, now: Value) {
	let V: Value = null, _T: Value = null, R: Value = null, A: Value = null;
	now ??= 0;
	let away_turfs: Value = block(rt.locate(1, 1, zlevel), rt.locate(rt.world().maxx, rt.world().maxy, zlevel));
	for (V of each(away_turfs)) {
		if ((_T = V).smooth) {
			if (now) {
				smooth_icon(_T);
			} else {
				queue_smooth(_T);
			}
		}
		R = null;
		for (R of each(_T)) {
			if ((A = R).smooth) {
				if (now) {
					smooth_icon(A);
				} else {
					queue_smooth(A);
				}
			}
		}
	}
	return f.dot;
});

// icon_smoothing.dm:309
rt.def("/atom/proc/clear_smooth_overlays", function clear_smooth_overlays(f: Frame) {
	this.cut_overlay(this.top_left_corner);
	this.top_left_corner = null;
	this.cut_overlay(this.top_right_corner);
	this.top_right_corner = null;
	this.cut_overlay(this.bottom_right_corner);
	this.bottom_right_corner = null;
	this.cut_overlay(this.bottom_left_corner);
	this.bottom_left_corner = null;
	return f.dot;
});

// icon_smoothing.dm:319
rt.def("/atom/proc/replace_smooth_overlays", function replace_smooth_overlays(f: Frame, nw: Value, ne: Value, sw: Value, se: Value) {
	this.clear_smooth_overlays();
	let O: Value = list();
	this.top_left_corner = nw;
	O += nw;
	this.top_right_corner = ne;
	O += ne;
	this.bottom_left_corner = sw;
	O += sw;
	this.bottom_right_corner = se;
	this.add_overlay((O += se));
	return f.dot;
});

// icon_smoothing.dm:332
rt.def("/proc/reverse_ndir", function reverse_ndir(f: Frame, ndir: Value) {
	if (ndir === N_NORTH) {
		return 1;
	} else if (ndir === N_SOUTH) {
		return N_NORTH;
	} else if (ndir === N_WEST) {
		return 8;
	} else if (ndir === N_EAST) {
		return N_SOUTH;
	} else if (ndir === N_NORTHWEST) {
		return 9;
	} else if (ndir === N_NORTHEAST) {
		return 5;
	} else if (ndir === N_SOUTHEAST) {
		return 6;
	} else if (ndir === N_SOUTHWEST) {
		return 10;
	} else if (ndir === 258) {
		return 9;
	} else if (ndir === 18) {
		return 5;
	} else if (ndir === 260) {
		return 10;
	} else if (ndir === 20) {
		return 6;
	} else if (ndir === 770) {
		return 9;
	} else if (ndir === 50) {
		return 5;
	} else if (ndir === 1284) {
		return 10;
	} else if (ndir === 84) {
		return 6;
	} else {
		return 0;
	}
});

// icon_smoothing.dm:370
rt.def("/proc/queue_smooth_neighbors", function queue_smooth_neighbors(f: Frame, A: Value) {
	let V: Value = null, _T: Value = null;
	for (V of each(orange(1, A))) {
		if ((_T = V).smooth) {
			queue_smooth(_T);
		}
	}
	return f.dot;
});

// icon_smoothing.dm:377
rt.def("/proc/queue_smooth", function queue_smooth(f: Frame, A: Value) {
	if (!A.smooth || rt.bitAnd(A.smooth, SMOOTH_QUEUED)) {
		return f.dot;
	}
	GLOB.SSicon_smooth.smooth_queue += A;
	GLOB.SSicon_smooth.can_fire = 1;
	(rt.modField(f, A, "smooth", SMOOTH_QUEUED, rt.bitOr));
	return f.dot;
}, false, { argTypes: [{ path: "/atom" }] });

rt.type(4415, "/turf/closed/wall/smooth", "/turf/closed/wall", {
	name: "smooth wall",
	icon: rt.rsc("icons/turf/smooth_wall.dmi"),
	icon_state: "smooth",
	smooth: 13,
	canSmoothWith: null,
});

// icon_smoothing.dm:391
rt.def("/turf/closed/wall/smooth/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = null;
	return f.dot;
});
