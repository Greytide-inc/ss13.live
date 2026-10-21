// From code/game/turfs/simulated/floor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4506, "/turf/open/floor", "/turf/open", {
	icon_regular_floor: "floor",
	icon_plating: "plating",
	broken: 0,
	burnt: 0,
	floor_tile: null,
	broken_states: null,
	burnt_states: null,
	name: "floor",
	icon: rt.rsc("icons/turf/floors.dmi"),
	thermal_conductivity: 0.04,
	heat_capacity: 10000,
	intact: 1,
});

// /turf/open/floor/proc/Initialize  (code/game/turfs/simulated/floor.dm:20)  may sleep
rt.def("/turf/open/floor/proc/Initialize", function* Initialize(f: Frame) {
	if (!truthy(rt.sv(f, "broken_states"))) {
		rt.setSv(f, "broken_states", rt.list("damaged1", "damaged2", "damaged3", "damaged4", "damaged5"));
	}
	if (!truthy(rt.sv(f, "burnt_states"))) {
		rt.setSv(f, "burnt_states", rt.list());
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.isIn(f, rt.sv(f, "icon_state"), rt.gl("icons_to_ignore_at_floor_init")) ? 1 : 0))) {
		rt.setSv(f, "icon_regular_floor", "floor");
	} else {
		rt.setSv(f, "icon_regular_floor", rt.sv(f, "icon_state"));
	}
	if (!truthy(live(f.args[0]))) return f.dot;
	yield* g.srcCall(f, "MakeDirty");
	return f.dot;
}, true, { args: ["mapload"] });

// /turf/open/floor/proc/ex_act  (code/game/turfs/simulated/floor.dm:49)  may sleep
rt.def("/turf/open/floor/proc/ex_act", function* ex_act(f: Frame) {
	let shielded: Value = null;
	let $0: any;
	f.vars = () => [shielded, $0];
	shielded = (yield* g.srcCall(f, "is_shielded"));
	yield* g.callSuper(f, [], rt.Args.Same);
	if (((!isEqual(live(f.args[0]), 1) && truthy(live(shielded))) && !isEqual(live(f.args[1]), live(f.src)))) {
		return live(f.dot);
	}
	if (isEqual(live(f.args[1]), live(f.src))) {
		yield* g.callName(f, live(f.src), "ChangeTurf", [rt.fv(f, "baseturf", live(f.src))]);
	}
	if (live(f.args[1]) !== null) {
		f.args[0] = 3;
	}
	$0 = live(f.args[0]);
	if ($0 === 1) {
		yield* g.callName(f, live(f.src), "ChangeTurf", [rt.fv(f, "baseturf", live(f.src))]);
	} else if ($0 === 2) {
		$0 = rt.op(f, "PickWeighted", [3], [100, 1, 2, 75, 100, 3]);
		if ($0 === 1) {
			yield* g.callName(f, live(f.src), "ReplaceWithLattice", []);
			if (truthy(rt.op(f, "Prob", [], [33]))) {
				yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [live(f.src)]);
			}
		} else if ($0 === 2) {
			yield* g.callName(f, live(f.src), "ChangeTurf", [rt.fv(f, "baseturf", live(f.src))]);
		} else if ($0 === 3) {
			if (truthy(rt.op(f, "Prob", [], [80]))) {
				yield* g.callName(f, live(f.src), "break_tile_to_plating", []);
			} else {
				yield* g.callName(f, live(f.src), "break_tile", []);
			}
			yield* g.callName(f, live(f.src), "hotspot_expose", [1000, 2500]);
			if (truthy(rt.op(f, "Prob", [], [33]))) {
				yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [live(f.src)]);
			}
		}
	} else if ($0 === 3) {
		if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
		yield* g.callName(f, live(f.src), "break_tile", []);
		yield* g.callName(f, live(f.src), "hotspot_expose", [1000, 2500]);
	}
	return f.dot;
}, true, { args: ["severity", "target"], waitfor: false });

// /turf/open/floor/proc/is_shielded  (code/game/turfs/simulated/floor.dm:81)
rt.def("/turf/open/floor/proc/is_shielded", function is_shielded(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/structure"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.fv(f, "level", live(A)), 3)) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /turf/open/floor/proc/update_icon  (code/game/turfs/simulated/floor.dm:89)
rt.def("/turf/open/floor/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "update_visuals", []);
	return 1;
});

// /turf/open/floor/proc/attack_paw  (code/game/turfs/simulated/floor.dm:93)  may sleep
rt.def("/turf/open/floor/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /turf/open/floor/proc/break_tile_to_plating  (code/game/turfs/simulated/floor.dm:99)  may sleep
rt.def("/turf/open/floor/proc/break_tile_to_plating", function* break_tile_to_plating(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callName(f, (_T = (yield* g.srcCall(f, "make_plating"))), "break_tile", []);
	return f.dot;
}, true);

// /turf/open/floor/proc/break_tile  (code/game/turfs/simulated/floor.dm:105)
rt.def("/turf/open/floor/proc/break_tile", function break_tile(f: Frame) {
	if (truthy(rt.sv(f, "broken"))) {
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "broken_states")]));
	rt.setSv(f, "broken", 1);
	return f.dot;
});

// /turf/open/floor/proc/burn_tile  (code/game/turfs/simulated/floor.dm:109)
rt.def("/turf/open/floor/proc/burn_tile", function burn_tile(f: Frame) {
	if ((truthy(rt.sv(f, "broken")) || truthy(rt.sv(f, "burnt")))) {
		return live(f.dot);
	}
	if (truthy(rt.len(f, rt.sv(f, "burnt_states")))) {
		rt.setSv(f, "icon_state", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "burnt_states")]));
	} else {
		rt.setSv(f, "icon_state", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "broken_states")]));
	}
	rt.setSv(f, "burnt", 1);
	return f.dot;
});

// /turf/open/floor/proc/make_plating  (code/game/turfs/simulated/floor.dm:118)  may sleep
rt.def("/turf/open/floor/proc/make_plating", function* make_plating(f: Frame) {
	return (yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/plating")));
}, true);

// /turf/open/floor/proc/ChangeTurf  (code/game/turfs/simulated/floor.dm:121)  may sleep
rt.def("/turf/open/floor/proc/ChangeTurf", function* ChangeTurf(f: Frame) {
	let old_icon: Value = null, old_dir: Value = null, W: Value = null;
	f.vars = () => [old_icon, old_dir, W];
	if (!truthy((rt.istype(live(f.src), T("/turf/open/floor")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(f.args[0]), T("/turf/open/floor")])))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	old_icon = rt.sv(f, "icon_regular_floor");
	old_dir = rt.sv(f, "dir");
	rt.setFv(f, "icon_regular_floor", (W = (yield* g.callSuper(f, [], rt.Args.Same))), live(old_icon));
	yield* g.callName(f, live(W), "setDir", [live(old_dir)]);
	yield* g.callName(f, live(W), "update_icon", []);
	return live(W);
}, true, { args: ["new_path"] });

// /turf/open/floor/proc/attackby  (code/game/turfs/simulated/floor.dm:134)  may sleep
rt.def("/turf/open/floor/proc/attackby", function* attackby(f: Frame) {
	if ((!truthy(live(f.args[0])) || !truthy(live(f.args[1])))) {
		return 1;
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if ((truthy(rt.sv(f, "intact")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)))) {
		return (yield* g.srcCall(f, "pry_tile", live(f.args[0]), live(f.args[1])));
	}
	if ((truthy(rt.sv(f, "intact")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile")) ? 1 : 0)))) {
		yield* g.srcCall(f, "try_replace_tile", live(f.args[0]), live(f.args[1]), live(f.args[2]));
	}
	return 0;
}, true, { args: ["C", "user", "params"] });

// /turf/open/floor/proc/try_replace_tile  (code/game/turfs/simulated/floor.dm:145)  may sleep
rt.def("/turf/open/floor/proc/try_replace_tile", function* try_replace_tile(f: Frame, _T: Value, user: Value, params: Value) {
	let CB: Value = null, _P: Value = null;
	f.vars = () => [_T, user, params, CB, _P];
	if (isEqual(rt.fv(f, "turf_type", live(_T)), rt.sv(f, "type"))) {
		return live(f.dot);
	}
	if (!truthy((CB = (yield* g.callName(f, live(user), "is_holding_item_of_type", [T("/obj/item/weapon/crowbar")]))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((_P = (yield* g.srcCall(f, "pry_tile", live(CB), live(user), 1))), T("/turf/open/floor/plating")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(_P), "attackby", [live(_T), live(user), live(params)]);
	return f.dot;
}, true);

// /turf/open/floor/proc/pry_tile  (code/game/turfs/simulated/floor.dm:156)  may sleep
rt.def("/turf/open/floor/proc/pry_tile", function* pry_tile(f: Frame, C: Value, user: Value, silent: Value) {
	f.vars = () => [C, user, silent];
	if (live(silent) === null) {
		silent = 0;
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(C)), 80, 1]);
	return (yield* g.srcCall(f, "remove_tile", live(user), live(silent)));
}, true);

// /turf/open/floor/proc/remove_tile  (code/game/turfs/simulated/floor.dm:160)  may sleep
rt.def("/turf/open/floor/proc/remove_tile", function* remove_tile(f: Frame, user: Value, silent: Value, make_tile: Value) {
	f.vars = () => [user, silent, make_tile];
	if (live(silent) === null) {
		silent = 0;
	}
	if (live(make_tile) === null) {
		make_tile = 1;
	}
	if ((truthy(rt.sv(f, "broken")) || truthy(rt.sv(f, "burnt")))) {
		rt.setSv(f, "broken", 0);
		rt.setSv(f, "burnt", 0);
		if ((truthy(live(user)) && !truthy(live(silent)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You remove the broken plating.</span>"]);
		}
	} else {
		if ((truthy(live(user)) && !truthy(live(silent)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You remove the floor tile.</span>"]);
		}
		if ((truthy(rt.sv(f, "floor_tile")) && truthy(live(make_tile)))) {
			yield* g.new_(f, rt.sv(f, "floor_tile"), [live(f.src)]);
		}
	}
	return (yield* g.srcCall(f, "make_plating"));
}, true);

// /turf/open/floor/proc/singularity_pull  (code/game/turfs/simulated/floor.dm:173)  may sleep
rt.def("/turf/open/floor/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (isEqual(live(current_size), 5)) {
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			if (truthy(rt.sv(f, "floor_tile"))) {
				yield* g.new_(f, rt.sv(f, "floor_tile"), [live(f.src)]);
				yield* g.srcCall(f, "make_plating");
			}
		}
	} else {
		if (isEqual(live(current_size), 7)) {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				if (truthy(rt.sv(f, "floor_tile"))) {
					yield* g.new_(f, rt.sv(f, "floor_tile"), [live(f.src)]);
					yield* g.srcCall(f, "make_plating");
				}
			}
		} else {
			if (!rt.ge(live(current_size), 9)) return f.dot;
			if (truthy(rt.sv(f, "floor_tile"))) {
				if (truthy(rt.op(f, "Prob", [], [70]))) {
					yield* g.new_(f, rt.sv(f, "floor_tile"), [live(f.src)]);
					yield* g.srcCall(f, "make_plating");
				}
			} else {
				if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
				yield* g.srcCall(f, "ReplaceWithLattice");
			}
		}
	}
	return f.dot;
}, true);

// /turf/open/floor/proc/narsie_act  (code/game/turfs/simulated/floor.dm:192)  may sleep
rt.def("/turf/open/floor/proc/narsie_act", function* narsie_act(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/engine/cult"));
	return f.dot;
}, true, { args: ["force", "ignore_mobs", "probability"] });

// /turf/open/floor/proc/ratvar_act  (code/game/turfs/simulated/floor.dm:197)  may sleep
rt.def("/turf/open/floor/proc/ratvar_act", function* ratvar_act(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/clockwork"));
	return f.dot;
}, true, { args: ["force", "ignore_mobs"] });

// /turf/open/floor/proc/acid_melt  (code/game/turfs/simulated/floor.dm:202)  may sleep
rt.def("/turf/open/floor/proc/acid_melt", function* acid_melt(f: Frame) {
	yield* g.srcCall(f, "ChangeTurf", rt.sv(f, "baseturf"));
	return f.dot;
}, true);

// /turf/open/floor/proc/rcd_vals  (code/game/turfs/simulated/floor.dm:205)
rt.def("/turf/open/floor/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "mode", live(the_rcd));
	if ($0 === 1) {
		return rt.alist(f, ["mode", 1, "delay", 20, "cost", 16]);
	} else if ($0 === 2) {
		if (truthy(rt.fv(f, "airlock_glass", live(the_rcd)))) {
			return rt.alist(f, ["mode", 2, "delay", 50, "cost", 20]);
		}
		return rt.alist(f, ["mode", 2, "delay", 50, "cost", 16]);
	} else if ($0 === 3) {
		return rt.alist(f, ["mode", 3, "delay", 50, "cost", 33]);
	} else if ($0 === 4) {
		return rt.alist(f, ["mode", 4, "delay", 10, "cost", 4]);
	}
	return 0;
});

// /turf/open/floor/proc/rcd_act  (code/game/turfs/simulated/floor.dm:219)  may sleep
rt.def("/turf/open/floor/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	let A: Value = null, G: Value = null;
	let $0: any;
	f.vars = () => [user, the_rcd, passed_mode, A, G, $0];
	$0 = live(passed_mode);
	if ($0 === 1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You build a wall.</span>"]);
		yield* g.srcCall(f, "ChangeTurf", T("/turf/closed/wall"));
		return 1;
	} else if ($0 === 2) {
		if (truthy(rt.locateIn(f, T("/obj/machinery/door/airlock"), live(f.src)))) {
			return 0;
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You build an airlock.</span>"]);
		rt.setFv(f, "electronics", (A = (yield* g.new_(f, rt.fv(f, "airlock_type", live(the_rcd)), [live(f.src)]))), (yield* g.new_(f, T("/obj/item/weapon/electronics/airlock"), [live(A)])));
		if (truthy(rt.fv(f, "conf_access", live(the_rcd)))) {
			rt.setFv(f, "accesses", rt.fv(f, "electronics", live(A)), (yield* g.callName(f, rt.fv(f, "conf_access", live(the_rcd)), "Copy", [])));
		}
		rt.setFv(f, "one_access", rt.fv(f, "electronics", live(A)), rt.fv(f, "use_one_access", live(the_rcd)));
		if (truthy(rt.gv(f, "one_access", rt.fv(f, "electronics", live(A))))) {
			rt.setFv(f, "req_one_access", live(A), rt.gv(f, "accesses", rt.fv(f, "electronics", live(A))));
		} else {
			rt.setFv(f, "req_access", live(A), rt.gv(f, "accesses", rt.fv(f, "electronics", live(A))));
		}
		rt.setFv(f, "autoclose", live(A), 1);
		return 1;
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "IsType", [], [live(f.src), rt.sv(f, "baseturf")]))) {
			return 0;
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You deconstruct ＀.</span>", [live(f.src)])]);
		yield* g.srcCall(f, "ChangeTurf", rt.sv(f, "baseturf"));
		return 1;
	} else if ($0 === 4) {
		if (truthy(rt.locateIn(f, T("/obj/structure/grille"), live(f.src)))) {
			return 0;
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You construct the grille.</span>"]);
		rt.setFv(f, "anchored", (G = (yield* g.new_(f, T("/obj/structure/grille"), [live(f.src)]))), 1);
		return 1;
	}
	return 0;
}, true);
