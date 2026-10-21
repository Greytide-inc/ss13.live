// From code/__HELPERS/icon_smoothing.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/calculate_adjacencies  (code/__HELPERS/icon_smoothing.dm:58)
rt.def("/proc/calculate_adjacencies", function calculate_adjacencies(f: Frame, A: Value) {
	let adjacencies: Value = null, AM: Value = null, direction: Value = null;
	let $e: any;
	f.vars = () => [adjacencies, AM, direction, $e];
	if (!truthy(rt.fv(f, "loc", live(A)))) {
		return 0;
	}
	adjacencies = 0;
	AM = null;
	if (truthy((rt.istype(live(A), T("/atom/movable")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "can_be_unanchored", (AM = live(A)))) && !truthy(rt.fv(f, "anchored", live(AM))))) {
			return 0;
		}
	}
	direction = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (isEqual((AM = rt.call(f, P("/proc/find_type_in_direction"), null, [live(A), live(direction)])), 123456792)) {
			if (truthy(rt.bitAnd(rt.fv(f, "smooth", live(A)), 8))) {
				(adjacencies = rt.modify(live(adjacencies), rt.shiftLeft(1, live(direction)), rt.bitOr));
			}
		} else {
			if (((truthy(live(AM)) && !truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0))) || (truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0)) && truthy(rt.fv(f, "anchored", live(AM)))))) {
				(adjacencies = rt.modify(live(adjacencies), rt.shiftLeft(1, live(direction)), rt.bitOr));
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.bitAnd(live(adjacencies), 2))) {
		if (truthy(rt.bitAnd(live(adjacencies), 256))) {
			if (isEqual((AM = rt.call(f, P("/proc/find_type_in_direction"), null, [live(A), 9])), 123456792)) {
				if (truthy(rt.bitAnd(rt.fv(f, "smooth", live(A)), 8))) {
					(adjacencies = rt.modify(live(adjacencies), 512, rt.bitOr));
				}
			} else {
				if (((truthy(live(AM)) && !truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0))) || (truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0)) && truthy(rt.fv(f, "anchored", live(AM)))))) {
					(adjacencies = rt.modify(live(adjacencies), 512, rt.bitOr));
				}
			}
		}
		if (truthy(rt.bitAnd(live(adjacencies), 16))) {
			if (isEqual((AM = rt.call(f, P("/proc/find_type_in_direction"), null, [live(A), 5])), 123456792)) {
				if (truthy(rt.bitAnd(rt.fv(f, "smooth", live(A)), 8))) {
					(adjacencies = rt.modify(live(adjacencies), 32, rt.bitOr));
				}
			} else {
				if (((truthy(live(AM)) && !truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0))) || (truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0)) && truthy(rt.fv(f, "anchored", live(AM)))))) {
					(adjacencies = rt.modify(live(adjacencies), 32, rt.bitOr));
				}
			}
		}
	}
	if (truthy(rt.bitAnd(live(adjacencies), 4))) {
		if (truthy(rt.bitAnd(live(adjacencies), 256))) {
			if (isEqual((AM = rt.call(f, P("/proc/find_type_in_direction"), null, [live(A), 10])), 123456792)) {
				if (truthy(rt.bitAnd(rt.fv(f, "smooth", live(A)), 8))) {
					(adjacencies = rt.modify(live(adjacencies), 1024, rt.bitOr));
				}
			} else {
				if (((truthy(live(AM)) && !truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0))) || (truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0)) && truthy(rt.fv(f, "anchored", live(AM)))))) {
					(adjacencies = rt.modify(live(adjacencies), 1024, rt.bitOr));
				}
			}
		}
		if (truthy(rt.bitAnd(live(adjacencies), 16))) {
			if (isEqual((AM = rt.call(f, P("/proc/find_type_in_direction"), null, [live(A), 6])), 123456792)) {
				if (truthy(rt.bitAnd(rt.fv(f, "smooth", live(A)), 8))) {
					(adjacencies = rt.modify(live(adjacencies), 64, rt.bitOr));
				}
			} else {
				if (((truthy(live(AM)) && !truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0))) || (truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0)) && truthy(rt.fv(f, "anchored", live(AM)))))) {
					(adjacencies = rt.modify(live(adjacencies), 64, rt.bitOr));
				}
			}
		}
	}
	return live(adjacencies);
});

// /proc/smooth_icon  (code/__HELPERS/icon_smoothing.dm:113)
rt.def("/proc/smooth_icon", function smooth_icon(f: Frame, A: Value) {
	let adjacencies: Value = null;
	f.vars = () => [adjacencies];
	if ((!truthy(live(A)) || !truthy(rt.fv(f, "smooth", live(A))))) {
		return live(f.dot);
	}
	(rt.modField(f, live(A), "smooth", 16777199, rt.bitAnd));
	if (!truthy(rt.fv(f, "z", live(A)))) {
		return live(f.dot);
	}
	if ((!truthy(live(A)) || truthy(rt.fv(f, "gc_destroyed", live(A))))) {
		return live(f.dot);
	}
	if (!(truthy(rt.bitAnd(rt.fv(f, "smooth", live(A)), 1)) || truthy(rt.bitAnd(rt.fv(f, "smooth", live(A)), 2)))) return f.dot;
	adjacencies = rt.call(f, P("/proc/calculate_adjacencies"), null, [live(A)]);
	if (truthy(rt.bitAnd(rt.fv(f, "smooth", live(A)), 4))) {
		rt.callName(f, live(A), "diagonal_smooth", [live(adjacencies)]);
	} else {
		rt.call(f, P("/proc/cardinal_smooth"), null, [live(A), live(adjacencies)]);
	}
	return f.dot;
});

// /atom/proc/diagonal_smooth  (code/__HELPERS/icon_smoothing.dm:129)
rt.def("/atom/proc/diagonal_smooth", function diagonal_smooth(f: Frame, adjacencies: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(adjacencies);
	if ($0 === 258) {
		rt.callSrc(f, "replace_smooth_overlays", ["d-se", "d-se-0"]);
	} else if ($0 === 18) {
		rt.callSrc(f, "replace_smooth_overlays", ["d-sw", "d-sw-0"]);
	} else if ($0 === 260) {
		rt.callSrc(f, "replace_smooth_overlays", ["d-ne", "d-ne-0"]);
	} else if ($0 === 20) {
		rt.callSrc(f, "replace_smooth_overlays", ["d-nw", "d-nw-0"]);
	} else if ($0 === 770) {
		rt.callSrc(f, "replace_smooth_overlays", ["d-se", "d-se-1"]);
	} else if ($0 === 50) {
		rt.callSrc(f, "replace_smooth_overlays", ["d-sw", "d-sw-1"]);
	} else if ($0 === 1284) {
		rt.callSrc(f, "replace_smooth_overlays", ["d-ne", "d-ne-1"]);
	} else if ($0 === 84) {
		rt.callSrc(f, "replace_smooth_overlays", ["d-nw", "d-nw-1"]);
	} else {
		rt.call(f, P("/proc/cardinal_smooth"), null, [live(f.src), live(adjacencies)]);
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", "");
	return live(adjacencies);
});

// /turf/closed/wall/proc/diagonal_smooth  (code/__HELPERS/icon_smoothing.dm:157)
rt.def("/turf/closed/wall/proc/diagonal_smooth", function diagonal_smooth(f: Frame) {
	let underlay_appearance: Value = null, U: Value = null, turned_adjacency: Value = null, _T: Value = null;
	f.vars = () => [underlay_appearance, U, turned_adjacency, _T];
	if (!truthy((f.args[0] = rt.call(f, P("/proc/reverse_ndir"), null, [rt.callSuper(f, [], rt.Args.Same)])))) return f.dot;
	underlay_appearance = rt.call(f, P("/proc/mutable_appearance"), null, ["layer", 2], rt.Args.Named);
	U = rt.list(live(underlay_appearance));
	if (truthy(rt.sv(f, "fixed_underlay"))) {
		if (truthy(rt.at(rt.sv(f, "fixed_underlay"), "space"))) {
			rt.setFv(f, "icon", live(underlay_appearance), rt.rsc("icons/turf/space.dmi"));
			rt.setFv(f, "icon_state", live(underlay_appearance), fmt("＀", [rt.modulus(rt.bitXor(add(rt.sv(f, "x"), rt.sv(f, "y")), add(rt.op(f, "BitNot", [], [multiply(rt.sv(f, "x"), rt.sv(f, "y"))]), rt.sv(f, "z"))), 25)]));
			rt.setFv(f, "plane", live(underlay_appearance), -95);
		} else {
			rt.setFv(f, "icon", live(underlay_appearance), rt.at(rt.sv(f, "fixed_underlay"), "icon"));
			rt.setFv(f, "icon_state", live(underlay_appearance), rt.at(rt.sv(f, "fixed_underlay"), "icon_state"));
		}
	} else {
		turned_adjacency = rt.call(f, P("/proc/turn"), null, [live(f.args[0]), 180]);
		if (!truthy(rt.callName(f, (_T = rt.getStep(f, live(f.src), live(turned_adjacency))), "get_smooth_underlay_icon", [live(underlay_appearance), live(f.src), live(turned_adjacency)]))) {
			if (!truthy(rt.callName(f, (_T = rt.getStep(f, live(f.src), rt.call(f, P("/proc/turn"), null, [live(f.args[0]), 135]))), "get_smooth_underlay_icon", [live(underlay_appearance), live(f.src), live(turned_adjacency)]))) {
				_T = rt.getStep(f, live(f.src), rt.call(f, P("/proc/turn"), null, [live(f.args[0]), 225]));
			}
		}
		if ((!truthy(rt.callName(f, live(_T), "get_smooth_underlay_icon", [live(underlay_appearance), live(f.src), live(turned_adjacency)])) && !truthy(rt.callSrc(f, "get_smooth_underlay_icon", [live(underlay_appearance), live(f.src), live(turned_adjacency)])))) {
			rt.setFv(f, "icon", live(underlay_appearance), rt.rsc("icons/turf/floors.dmi"));
			rt.setFv(f, "icon_state", live(underlay_appearance), "plating");
		}
	}
	rt.setSv(f, "underlays", live(U));
	return f.dot;
}, false, { args: ["adjacencies"] });

// /proc/cardinal_smooth  (code/__HELPERS/icon_smoothing.dm:185)
rt.def("/proc/cardinal_smooth", function cardinal_smooth(f: Frame, A: Value, adjacencies: Value) {
	let nw: Value = null, ne: Value = null, sw: Value = null, se: Value = null, New: Value = null;
	f.vars = () => [nw, ne, sw, se, New];
	nw = "1-i";
	if ((truthy(rt.bitAnd(live(adjacencies), 2)) && truthy(rt.bitAnd(live(adjacencies), 256)))) {
		if (truthy(rt.bitAnd(live(adjacencies), 512))) {
			nw = "1-f";
		} else {
			nw = "1-nw";
		}
	} else {
		if (truthy(rt.bitAnd(live(adjacencies), 2))) {
			nw = "1-n";
		} else {
			if (truthy(rt.bitAnd(live(adjacencies), 256))) {
				nw = "1-w";
			}
		}
	}
	ne = "2-i";
	if ((truthy(rt.bitAnd(live(adjacencies), 2)) && truthy(rt.bitAnd(live(adjacencies), 16)))) {
		if (truthy(rt.bitAnd(live(adjacencies), 32))) {
			ne = "2-f";
		} else {
			ne = "2-ne";
		}
	} else {
		if (truthy(rt.bitAnd(live(adjacencies), 2))) {
			ne = "2-n";
		} else {
			if (truthy(rt.bitAnd(live(adjacencies), 16))) {
				ne = "2-e";
			}
		}
	}
	sw = "3-i";
	if ((truthy(rt.bitAnd(live(adjacencies), 4)) && truthy(rt.bitAnd(live(adjacencies), 256)))) {
		if (truthy(rt.bitAnd(live(adjacencies), 1024))) {
			sw = "3-f";
		} else {
			sw = "3-sw";
		}
	} else {
		if (truthy(rt.bitAnd(live(adjacencies), 4))) {
			sw = "3-s";
		} else {
			if (truthy(rt.bitAnd(live(adjacencies), 256))) {
				sw = "3-w";
			}
		}
	}
	se = "4-i";
	if ((truthy(rt.bitAnd(live(adjacencies), 4)) && truthy(rt.bitAnd(live(adjacencies), 16)))) {
		if (truthy(rt.bitAnd(live(adjacencies), 64))) {
			se = "4-f";
		} else {
			se = "4-se";
		}
	} else {
		if (truthy(rt.bitAnd(live(adjacencies), 4))) {
			se = "4-s";
		} else {
			if (truthy(rt.bitAnd(live(adjacencies), 16))) {
				se = "4-e";
			}
		}
	}
	New = null;
	if (!isEqual(rt.fv(f, "top_left_corner", live(A)), live(nw))) {
		rt.callName(f, live(A), "cut_overlay", [rt.fv(f, "top_left_corner", live(A))]);
		rt.setFv(f, "top_left_corner", live(A), live(nw));
		if (!truthy(live(New))) {
			New = rt.list();
		}
		New = rt.modify(live(New), live(nw), add);
	}
	if (!isEqual(rt.fv(f, "top_right_corner", live(A)), live(ne))) {
		rt.callName(f, live(A), "cut_overlay", [rt.fv(f, "top_right_corner", live(A))]);
		rt.setFv(f, "top_right_corner", live(A), live(ne));
		if (!truthy(live(New))) {
			New = rt.list();
		}
		New = rt.modify(live(New), live(ne), add);
	}
	if (!isEqual(rt.fv(f, "bottom_right_corner", live(A)), live(sw))) {
		rt.callName(f, live(A), "cut_overlay", [rt.fv(f, "bottom_right_corner", live(A))]);
		rt.setFv(f, "bottom_right_corner", live(A), live(sw));
		if (!truthy(live(New))) {
			New = rt.list();
		}
		New = rt.modify(live(New), live(sw), add);
	}
	if (!isEqual(rt.fv(f, "bottom_left_corner", live(A)), live(se))) {
		rt.callName(f, live(A), "cut_overlay", [rt.fv(f, "bottom_left_corner", live(A))]);
		rt.setFv(f, "bottom_left_corner", live(A), live(se));
		if (!truthy(live(New))) {
			New = rt.list();
		}
		New = rt.modify(live(New), live(se), add);
	}
	if (!truthy(live(New))) return f.dot;
	rt.callName(f, live(A), "add_overlay", [live(New)]);
	return f.dot;
});

// /proc/find_type_in_direction  (code/__HELPERS/icon_smoothing.dm:262)
rt.def("/proc/find_type_in_direction", function find_type_in_direction(f: Frame, source: Value, direction: Value) {
	let target_turf: Value = null, A: Value = null, a_type: Value = null;
	let $0: any, $e: any;
	f.vars = () => [target_turf, A, a_type, $0, $e];
	if (!truthy((target_turf = rt.getStep(f, live(source), live(direction))))) {
		return 123456792;
	}
	if (truthy(rt.fv(f, "canSmoothWith", live(source)))) {
		A = null;
		if (truthy(rt.bitAnd(rt.fv(f, "smooth", live(source)), 2))) {
			a_type = null;
			rt.forList(f, 0, rt.fv(f, "canSmoothWith", live(source)));
			while (($e = rt.next(f, 0)) !== undefined) {
				a_type = $e;
				if (truthy(rt.op(f, "IsType", [], [live(target_turf), live(a_type)]))) {
					return live(target_turf);
				}
				if (truthy((A = rt.locateIn(f, live(a_type), live(target_turf))))) {
					return live(A);
				}
			}
			rt.endFor(f, 0);
			return null;
		}
		a_type = null;
		rt.forList(f, 0, rt.fv(f, "canSmoothWith", live(source)));
		while (($e = rt.next(f, 0)) !== undefined) {
			a_type = $e;
			if (isEqual(live(a_type), rt.fv(f, "type", live(target_turf)))) {
				return live(target_turf);
			}
			if ((truthy((A = rt.locateIn(f, live(a_type), live(target_turf)))) && isEqual(rt.fv(f, "type", live(A)), live(a_type)))) {
				return live(A);
			}
		}
		rt.endFor(f, 0);
		return null;
	} else {
		if (truthy(rt.call(f, P("/proc/isturf"), null, [live(source)]))) {
			if (isEqual(rt.fv(f, "type", live(source)), rt.fv(f, "type", live(target_turf)))) {
				$0 = live(target_turf);
			} else {
				$0 = null;
			}
			return $0;
		}
		if ((truthy((A = rt.locateIn(f, rt.fv(f, "type", live(source)), live(target_turf)))) && isEqual(rt.fv(f, "type", live(A)), rt.fv(f, "type", live(source))))) {
			$0 = live(A);
		} else {
			$0 = null;
		}
		return $0;
	}
	return f.dot;
});

// /proc/smooth_zlevel  (code/__HELPERS/icon_smoothing.dm:292)
rt.def("/proc/smooth_zlevel", function smooth_zlevel(f: Frame, zlevel: Value, now: Value) {
	let away_turfs: Value = null, V: Value = null, _T: Value = null, R: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [now, away_turfs, V, _T, R, A, $e];
	if (live(now) === null) {
		now = 0;
	}
	away_turfs = rt.call(f, P("/proc/block"), null, [rt.locate(1, 1, live(zlevel)), rt.locate(rt.fv(f, "maxx", rt.world()), rt.fv(f, "maxy", rt.world()), live(zlevel))]);
	V = null;
	rt.forList(f, 0, live(away_turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy(rt.gv(f, "smooth", (_T = live(V))))) {
			if (truthy(live(now))) {
				rt.call(f, P("/proc/smooth_icon"), null, [live(_T)]);
			} else {
				rt.call(f, P("/proc/queue_smooth"), null, [live(_T)]);
			}
		}
		R = null;
		rt.forList(f, 1, live(_T));
		while (($e = rt.next(f, 1)) !== undefined) {
			R = $e;
			if (truthy(rt.gv(f, "smooth", (A = live(R))))) {
				if (truthy(live(now))) {
					rt.call(f, P("/proc/smooth_icon"), null, [live(A)]);
				} else {
					rt.call(f, P("/proc/queue_smooth"), null, [live(A)]);
				}
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /atom/proc/clear_smooth_overlays  (code/__HELPERS/icon_smoothing.dm:309)
rt.def("/atom/proc/clear_smooth_overlays", function clear_smooth_overlays(f: Frame) {
	rt.callSrc(f, "cut_overlay", [rt.sv(f, "top_left_corner")]);
	rt.setSv(f, "top_left_corner", null);
	rt.callSrc(f, "cut_overlay", [rt.sv(f, "top_right_corner")]);
	rt.setSv(f, "top_right_corner", null);
	rt.callSrc(f, "cut_overlay", [rt.sv(f, "bottom_right_corner")]);
	rt.setSv(f, "bottom_right_corner", null);
	rt.callSrc(f, "cut_overlay", [rt.sv(f, "bottom_left_corner")]);
	rt.setSv(f, "bottom_left_corner", null);
	return f.dot;
});

// /atom/proc/replace_smooth_overlays  (code/__HELPERS/icon_smoothing.dm:319)
rt.def("/atom/proc/replace_smooth_overlays", function replace_smooth_overlays(f: Frame, nw: Value, ne: Value, sw: Value, se: Value) {
	let O: Value = null;
	f.vars = () => [O];
	rt.callSrc(f, "clear_smooth_overlays", []);
	O = rt.list();
	rt.setSv(f, "top_left_corner", live(nw));
	O = rt.modify(live(O), live(nw), add);
	rt.setSv(f, "top_right_corner", live(ne));
	O = rt.modify(live(O), live(ne), add);
	rt.setSv(f, "bottom_left_corner", live(sw));
	O = rt.modify(live(O), live(sw), add);
	rt.setSv(f, "bottom_right_corner", live(se));
	rt.callSrc(f, "add_overlay", [(O = rt.modify(live(O), live(se), add))]);
	return f.dot;
});

// /proc/reverse_ndir  (code/__HELPERS/icon_smoothing.dm:332)
rt.def("/proc/reverse_ndir", function reverse_ndir(f: Frame, ndir: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(ndir);
	if ($0 === 2) {
		return 1;
	} else if ($0 === 4) {
		return 2;
	} else if ($0 === 256) {
		return 8;
	} else if ($0 === 16) {
		return 4;
	} else if ($0 === 512) {
		return 9;
	} else if ($0 === 32) {
		return 5;
	} else if ($0 === 64) {
		return 6;
	} else if ($0 === 1024) {
		return 10;
	} else if ($0 === 258) {
		return 9;
	} else if ($0 === 18) {
		return 5;
	} else if ($0 === 260) {
		return 10;
	} else if ($0 === 20) {
		return 6;
	} else if ($0 === 770) {
		return 9;
	} else if ($0 === 50) {
		return 5;
	} else if ($0 === 1284) {
		return 10;
	} else if ($0 === 84) {
		return 6;
	} else {
		return 0;
	}
	return f.dot;
});

// /proc/queue_smooth_neighbors  (code/__HELPERS/icon_smoothing.dm:370)
rt.def("/proc/queue_smooth_neighbors", function queue_smooth_neighbors(f: Frame, A: Value) {
	let V: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [V, _T, $e];
	V = null;
	rt.forList(f, 0, rt.call(f, P("/proc/orange"), null, [1, live(A)]));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy(rt.gv(f, "smooth", (_T = live(V))))) {
			rt.call(f, P("/proc/queue_smooth"), null, [live(_T)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/queue_smooth  (code/__HELPERS/icon_smoothing.dm:377)
rt.def("/proc/queue_smooth", function queue_smooth(f: Frame, A: Value) {
	if ((!truthy(rt.fv(f, "smooth", live(A))) || truthy(rt.bitAnd(rt.fv(f, "smooth", live(A)), 16)))) {
		return live(f.dot);
	}
	rt.modField(f, rt.gl("SSicon_smooth"), "smooth_queue", live(A), add);
	rt.setFv(f, "can_fire", rt.gl("SSicon_smooth"), 1);
	(rt.modField(f, live(A), "smooth", 16, rt.bitOr));
	return f.dot;
}, false, { argTypes: [{ path: "/atom" }] });

rt.type(4415, "/turf/closed/wall/smooth", "/turf/closed/wall", {
	name: "smooth wall",
	icon: rt.rsc("icons/turf/smooth_wall.dmi"),
	icon_state: "smooth",
	smooth: 13,
	canSmoothWith: null,
});

// /turf/closed/wall/smooth/proc/<init>  (code/__HELPERS/icon_smoothing.dm:391)
rt.def("/turf/closed/wall/smooth/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", null);
	return f.dot;
});
