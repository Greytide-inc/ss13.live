// From code/game/gamemodes/blob/theblob.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12139, "/obj/structure/blob", "/obj/structure", {
	point_return: 0,
	health_regen: 2,
	pulse_timestamp: 0,
	heal_timestamp: 0,
	brute_resist: 0.5,
	fire_resist: 1,
	atmosblock: 0,
	overmind: null,
	light_range: 2,
	anchored: 1,
	name: "blob",
	icon: rt.rsc("icons/mob/blob.dmi"),
	desc: "A thick wall of writhing tendrils.",
	density: 0,
	opacity: 0,
	layer: 3.7,
	obj_integrity: 30,
	max_integrity: 30,
	armor: null,
});

// /obj/structure/blob/proc/<init>  (code/game/gamemodes/blob/theblob.dm:14)
rt.def("/obj/structure/blob/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 70]));
	return f.dot;
});

// /obj/structure/blob/proc/Initialize  (code/game/gamemodes/blob/theblob.dm:25)  may sleep
rt.def("/obj/structure/blob/proc/Initialize", function* Initialize(f: Frame) {
	let Ablob: Value = null;
	f.vars = () => [Ablob];
	if (truthy(rt.gv(f, "blob_allowed", (Ablob = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "loc")])))))) {
		rt.modGl("blobs_legit", live(f.src), add);
	}
	rt.modGl("blobs", live(f.src), add);
	yield* g.srcCall(f, "setDir", rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]));
	yield* g.srcCall(f, "update_icon");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "ConsumeTile");
	if (!truthy(rt.sv(f, "atmosblock"))) return f.dot;
	rt.setSv(f, "CanAtmosPass", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	return f.dot;
}, true);

// /obj/structure/blob/proc/Destroy  (code/game/gamemodes/blob/theblob.dm:43)  may sleep
rt.def("/obj/structure/blob/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "atmosblock"))) {
		rt.setSv(f, "atmosblock", 0);
		yield* g.srcCall(f, "air_update_turf", 1);
	}
	(rt.modGl("blobs_legit", live(f.src), subtract));
	(rt.modGl("blobs", live(f.src), subtract));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/blob/proc/Adjacent  (code/game/gamemodes/blob/theblob.dm:53)
rt.def("/obj/structure/blob/proc/Adjacent", function Adjacent(f: Frame) {
	let result: Value = null, direction: Value = null, dirs: Value = null, A: Value = null, B: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [result, direction, dirs, A, B, C, $e];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	result = 0;
	direction = rt.getDir(f, live(f.src), live(f.args[0]));
	dirs = rt.alist(f, [fmt("＀", [9]), rt.list(1, 8), fmt("＀", [5]), rt.list(1, 4), fmt("＀", [6]), rt.list(2, 4), fmt("＀", [10]), rt.list(2, 8)]);
	A = null;
	rt.forList(f, 0, live(dirs));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(live(direction), rt.call(f, P("/proc/text2num"), null, [live(A)]))) {
			B = null;
			rt.forList(f, 1, rt.index(live(dirs), live(A)));
			while (($e = rt.next(f, 1)) !== undefined) {
				B = $e;
				if (truthy((C = rt.locateIn(f, T("/obj/structure/blob"), rt.getStep(f, live(f.src), live(B)))))) {
					result = rt.inc(live(result), 1);
				}
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	(f.dot = rt.modify(live(f.dot), subtract(live(result), 1), subtract));
	return f.dot;
}, false, { args: ["neighbour"] });

// /obj/structure/blob/proc/CanPass  (code/game/gamemodes/blob/theblob.dm:70)
rt.def("/obj/structure/blob/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [8])))) {
		return 1;
	}
	return 0;
});

// /obj/structure/blob/proc/CanAStarPass  (code/game/gamemodes/blob/theblob.dm:78)
rt.def("/obj/structure/blob/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	let mover: Value = null;
	f.vars = () => [mover];
	f.dot = 0;
	if (!truthy((rt.istype(live(caller), T("/atom/movable")) ? 1 : 0))) return f.dot;
	mover = live(caller);
	f.dot = (live(f.dot) || rt.callName(f, live(mover), "checkpass", [8]));
	return f.dot;
});

// /obj/structure/blob/proc/update_icon  (code/game/gamemodes/blob/theblob.dm:84)
rt.def("/obj/structure/blob/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "overmind"))) {
		rt.callSrc(f, "add_atom_colour", [rt.gv(f, "color", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))), 4]);
	} else {
		rt.callSrc(f, "remove_atom_colour", [4]);
	}
	return f.dot;
});

// /obj/structure/blob/proc/process  (code/game/gamemodes/blob/theblob.dm:89)  may sleep
rt.def("/obj/structure/blob/proc/process", function* process(f: Frame) {
	yield* g.srcCall(f, "Life");
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/blob/proc/Pulse_Area  (code/game/gamemodes/blob/theblob.dm:95)  may sleep
rt.def("/obj/structure/blob/proc/Pulse_Area", function* Pulse_Area(f: Frame, pulsing_overmind: Value, claim_range: Value, pulse_range: Value, expand_range: Value) {
	let expanded: Value = null, blobs_to_affect: Value = null, B: Value = null, L: Value = null, B_3: Value = null, distance: Value = null, expand_probablity: Value = null, can_expand: Value = null, newB: Value = null;
	let $e: any;
	f.vars = () => [pulsing_overmind, claim_range, pulse_range, expand_range, expanded, blobs_to_affect, B, L, B_3, distance, expand_probablity, can_expand, newB, $e];
	if (live(pulsing_overmind) === null) {
		pulsing_overmind = rt.sv(f, "overmind");
	}
	if (live(claim_range) === null) {
		claim_range = 10;
	}
	if (live(pulse_range) === null) {
		pulse_range = 3;
	}
	if (live(expand_range) === null) {
		expand_range = 2;
	}
	yield* g.callName(f, live(f.src), "Be_Pulsed", []);
	expanded = 0;
	if ((truthy(rt.op(f, "Prob", [], [70])) && truthy((yield* g.srcCall(f, "expand"))))) {
		expanded = 1;
	}
	blobs_to_affect = rt.list();
	B = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [live(claim_range), live(f.src), 1])), T("/obj/structure/blob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		blobs_to_affect = rt.modify(live(blobs_to_affect), live(B), add);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/shuffle_inplace"), null, [live(blobs_to_affect)]);
	L = null;
	rt.forList(f, 0, live(blobs_to_affect));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (((!truthy(rt.gv(f, "overmind", (B_3 = live(L)))) && !truthy((rt.istype(live(B_3), T("/obj/structure/blob/core")) ? 1 : 0))) && truthy(rt.op(f, "Prob", [], [30])))) {
			rt.setFv(f, "overmind", live(B_3), live(pulsing_overmind));
			yield* g.callName(f, live(B_3), "update_icon", []);
		}
		distance = (yield* g.call(f, P("/proc/get_dist"), null, [rt.getStep(f, live(f.src), 0), rt.getStep(f, live(B_3), 0)]));
		expand_probablity = (yield* g.call(f, P("/proc/max"), null, [subtract(20, multiply(live(distance), 8)), 1]));
		if (truthy((yield* g.callName(f, live(B_3), "Adjacent", [live(f.src)])))) {
			expand_probablity = 20;
		}
		if (rt.le(live(distance), live(expand_range))) {
			can_expand = 1;
			if ((rt.ge(rt.len(f, live(blobs_to_affect)), 120) && rt.gt(rt.fv(f, "heal_timestamp", live(B_3)), rt.worldTime(f)))) {
				can_expand = 0;
			}
			if (((truthy(live(can_expand)) && rt.le(rt.fv(f, "pulse_timestamp", live(B_3)), rt.worldTime(f))) && truthy(rt.op(f, "Prob", [], [live(expand_probablity)])))) {
				if (truthy((newB = (yield* g.callName(f, live(B_3), "expand", [null, null, (!truthy(live(expanded)) ? 1 : 0)]))))) {
					if (truthy(live(expanded))) {
						yield* g.call(f, P("/proc/qdel"), null, [live(newB)]);
					}
					expanded = 1;
				}
			}
		}
		if (rt.le(live(distance), live(pulse_range))) {
			yield* g.callName(f, live(B_3), "Be_Pulsed", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/blob/proc/Be_Pulsed  (code/game/gamemodes/blob/theblob.dm:126)  may sleep
rt.def("/obj/structure/blob/proc/Be_Pulsed", function* Be_Pulsed(f: Frame) {
	if (rt.le(rt.sv(f, "pulse_timestamp"), rt.worldTime(f))) {
		yield* g.srcCall(f, "ConsumeTile");
		if (rt.le(rt.sv(f, "heal_timestamp"), rt.worldTime(f))) {
			rt.setSv(f, "obj_integrity", (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "max_integrity"), add(rt.sv(f, "obj_integrity"), rt.sv(f, "health_regen"))])));
			rt.setSv(f, "heal_timestamp", add(rt.worldTime(f), 20));
		}
		yield* g.srcCall(f, "update_icon");
		rt.setSv(f, "pulse_timestamp", add(rt.worldTime(f), 10));
		return 1;
	}
	return 0;
}, true);

// /obj/structure/blob/proc/ConsumeTile  (code/game/gamemodes/blob/theblob.dm:137)  may sleep
rt.def("/obj/structure/blob/proc/ConsumeTile", function* ConsumeTile(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "blob_act", [live(f.src)]);
	}
	rt.endFor(f, 0);
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/turf/closed/wall")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, rt.sv(f, "loc"), "blob_act", [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/blob/proc/blob_attack_animation  (code/game/gamemodes/blob/theblob.dm:143)  may sleep
rt.def("/obj/structure/blob/proc/blob_attack_animation", function* blob_attack_animation(f: Frame, A: Value, controller: Value) {
	let O: Value = null, BO: Value = null;
	f.vars = () => [A, controller, O, BO];
	if (live(A) === null) {
		A = null;
	}
	yield* g.callName(f, (O = (yield* g.new_(f, T("/obj/effect/temp_visual/blob"), [rt.fv(f, "loc", live(f.src))]))), "setDir", [rt.sv(f, "dir")]);
	if (truthy(live(controller))) {
		BO = live(controller);
		rt.setFv(f, "color", live(O), rt.gv(f, "color", rt.fv(f, "blob_reagent_datum", live(BO))));
		rt.setFv(f, "alpha", live(O), 200);
	} else {
		if (truthy(rt.sv(f, "overmind"))) {
			rt.setFv(f, "color", live(O), rt.gv(f, "color", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))));
		}
	}
	if (truthy(live(A))) {
		yield* g.callName(f, live(O), "do_attack_animation", [live(A)]);
	}
	return live(O);
}, true);

// /obj/structure/blob/proc/expand  (code/game/gamemodes/blob/theblob.dm:156)  may sleep
rt.def("/obj/structure/blob/proc/expand", function* expand(f: Frame, _T: Value, controller: Value, expand_reaction: Value) {
	let dirs: Value = null, i: Value = null, dirn: Value = null, make_blob: Value = null, A: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [_T, controller, expand_reaction, dirs, i, dirn, make_blob, A, B, $e];
	if (live(_T) === null) {
		_T = null;
	}
	if (live(controller) === null) {
		controller = null;
	}
	if (live(expand_reaction) === null) {
		expand_reaction = 1;
	}
	if (!truthy(live(_T))) {
		dirs = rt.list(1, 2, 4, 8);
		i = null;
		rt.forRange(f, 0, 1, 4, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			dirn = rt.op(f, "PickUnweighted", [1], [live(dirs)]);
			yield* g.callName(f, live(dirs), "Remove", [live(dirn)]);
			_T = rt.getStep(f, live(f.src), live(dirn));
			if (!truthy(rt.locateIn(f, T("/obj/structure/blob"), live(_T)))) {
				break;
			}
			_T = null;
		}
		rt.endFor(f, 0);
	}
	if (!truthy(live(_T))) {
		return 0;
	}
	make_blob = 1;
	if (((truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)) && !truthy(rt.locateIn(f, T("/obj/structure/lattice"), live(_T)))) && truthy(rt.op(f, "Prob", [], [80])))) {
		make_blob = 0;
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
	}
	yield* g.srcCall(f, "ConsumeTile");
	if (!truthy((yield* g.callName(f, live(_T), "CanPass", [live(f.src), live(_T), 5])))) {
		make_blob = 0;
		yield* g.callName(f, live(_T), "blob_act", [live(f.src)]);
	}
	A = null;
	rt.forList(f, 0, live(_T), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!truthy((yield* g.callName(f, live(A), "CanPass", [live(f.src), live(_T), 5])))) {
			make_blob = 0;
		}
		yield* g.callName(f, live(A), "blob_act", [live(f.src)]);
	}
	rt.endFor(f, 0);
	if (truthy(live(make_blob))) {
		B = (yield* g.new_(f, T("/obj/structure/blob/normal"), [rt.fv(f, "loc", live(f.src))]));
		if (truthy(live(controller))) {
			rt.setFv(f, "overmind", live(B), live(controller));
		} else {
			rt.setFv(f, "overmind", live(B), rt.sv(f, "overmind"));
		}
		rt.setFv(f, "density", live(B), 1);
		if (truthy((yield* g.callName(f, live(_T), "Enter", [live(B), live(f.src)])))) {
			rt.setFv(f, "density", live(B), rt.initial(f, live(B), "density"));
			rt.setFv(f, "loc", live(B), live(_T));
			yield* g.callName(f, live(B), "update_icon", []);
			if ((truthy(rt.fv(f, "overmind", live(B))) && truthy(live(expand_reaction)))) {
				yield* g.callName(f, rt.gv(f, "blob_reagent_datum", rt.fv(f, "overmind", live(B))), "expand_reaction", [live(f.src), live(B), live(_T), live(controller)]);
			}
			return live(B);
		} else {
			yield* g.srcCall(f, "blob_attack_animation", live(_T), live(controller));
			yield* g.callName(f, live(_T), "blob_act", [live(f.src)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(B)]);
			return null;
		}
	} else {
		yield* g.srcCall(f, "blob_attack_animation", live(_T), live(controller));
	}
	return null;
}, true);

// /obj/structure/blob/proc/emp_act  (code/game/gamemodes/blob/theblob.dm:207)  may sleep
rt.def("/obj/structure/blob/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (!rt.gt(live(severity), 0)) return f.dot;
	if (truthy(rt.sv(f, "overmind"))) {
		yield* g.callName(f, rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind")), "emp_reaction", [live(f.src), live(severity)]);
	}
	if (!truthy(rt.op(f, "Prob", [], [subtract(100, multiply(live(severity), 30))]))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/emp"), [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true);

// /obj/structure/blob/proc/tesla_act  (code/game/gamemodes/blob/theblob.dm:214)  may sleep
rt.def("/obj/structure/blob/proc/tesla_act", function* tesla_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "overmind"))) {
		if (truthy((yield* g.callName(f, rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind")), "tesla_reaction", [live(f.src), live(f.args[0])])))) {
			yield* g.srcCall(f, "take_damage", divide(live(f.args[0]), 400), "fire", "energy");
		}
	} else {
		yield* g.srcCall(f, "take_damage", divide(live(f.args[0]), 400), "fire", "energy");
	}
	return f.dot;
}, true, { args: ["power"] });

// /obj/structure/blob/proc/extinguish  (code/game/gamemodes/blob/theblob.dm:222)  may sleep
rt.def("/obj/structure/blob/proc/extinguish", function* extinguish(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "overmind"))) return f.dot;
	yield* g.callName(f, rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind")), "extinguish_reaction", [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/blob/proc/attackby  (code/game/gamemodes/blob/theblob.dm:230)  may sleep
rt.def("/obj/structure/blob/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/analyzer")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<b>The analyzer beeps once, then reports:</b><br>"]);
		rt.op(f, "Output", [], [live(f.args[1]), rt.rsc("sound/machines/ping.ogg")], false);
		yield* g.srcCall(f, "chemeffectreport", live(f.args[1]));
		yield* g.srcCall(f, "typereport", live(f.args[1]));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/blob/proc/chemeffectreport  (code/game/gamemodes/blob/theblob.dm:241)
rt.def("/obj/structure/blob/proc/chemeffectreport", function chemeffectreport(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "overmind"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<b>Material: <font color=\"＀\">＀</font><span class='notice'>.</span></b>", [rt.gv(f, "color", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))), rt.gv(f, "name", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind")))])]);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<b>Material Effects:</b> <span class='notice'>＀</span>", [rt.gv(f, "analyzerdescdamage", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind")))])]);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<b>Material Properties:</b> <span class='notice'>＀</span><br>", [rt.gv(f, "analyzerdesceffect", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind")))])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<b>No Material Detected!</b><br>"]);
	}
	return f.dot;
});

// /obj/structure/blob/proc/typereport  (code/game/gamemodes/blob/theblob.dm:248)
rt.def("/obj/structure/blob/proc/typereport", function typereport(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<b>Blob Type:</b> <span class='notice'>＀</span>", [rt.call(f, P("/proc/uppertext"), null, [rt.initial(f, live(f.src), "name")])])]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<b>Health:</b> <span class='notice'>＀/＀</span>", [rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")])]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<b>Effects:</b> <span class='notice'>＀</span>", [rt.callSrc(f, "scannerreport", [])])]);
	return f.dot;
});

// /obj/structure/blob/proc/attack_animal  (code/game/gamemodes/blob/theblob.dm:253)  may sleep
rt.def("/obj/structure/blob/proc/attack_animal", function* attack_animal(f: Frame) {
	if (truthy((rt.isIn(f, "blob", rt.fv(f, "faction", live(f.args[0]))) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /obj/structure/blob/proc/play_attack_sound  (code/game/gamemodes/blob/theblob.dm:258)
rt.def("/obj/structure/blob/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(live(damage_amount))) {
			rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/attackblob.ogg"), 50, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/structure/blob/proc/run_obj_armor  (code/game/gamemodes/blob/theblob.dm:268)  may sleep
rt.def("/obj/structure/blob/proc/run_obj_armor", function* run_obj_armor(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, attack_dir: Value) {
	let armor_protection: Value = null;
	let $0: any;
	f.vars = () => [damage_amount, damage_type, damage_flag, attack_dir, armor_protection, $0];
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		(damage_amount = rt.modify(live(damage_amount), rt.sv(f, "brute_resist"), multiply));
	} else if ($0 === "fire") {
		(damage_amount = rt.modify(live(damage_amount), rt.sv(f, "fire_resist"), multiply));
	} else if ($0 === "clone") {
	} else {
		return 0;
	}
	armor_protection = 0;
	if (truthy(live(damage_flag))) {
		armor_protection = rt.index(rt.sv(f, "armor"), live(damage_flag));
	}
	damage_amount = (yield* g.call(f, P("/proc/round"), null, [multiply(multiply(live(damage_amount), subtract(100, live(armor_protection))), 0.009999999776482582), 0.10000000149011612]));
	if ((truthy(rt.sv(f, "overmind")) && truthy(live(damage_flag)))) {
		damage_amount = (yield* g.callName(f, rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind")), "damage_reaction", [live(f.src), live(damage_amount), live(damage_type), live(damage_flag)]));
	}
	return live(damage_amount);
}, true);

// /obj/structure/blob/proc/take_damage  (code/game/gamemodes/blob/theblob.dm:285)  may sleep
rt.def("/obj/structure/blob/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && rt.gt(rt.sv(f, "obj_integrity"), 0))) return f.dot;
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// /obj/structure/blob/proc/obj_destruction  (code/game/gamemodes/blob/theblob.dm:291)  may sleep
rt.def("/obj/structure/blob/proc/obj_destruction", function* obj_destruction(f: Frame) {
	if (truthy(rt.sv(f, "overmind"))) {
		yield* g.callName(f, rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind")), "death_reaction", [live(f.src), live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["damage_flag"] });

// /obj/structure/blob/proc/change_to  (code/game/gamemodes/blob/theblob.dm:295)  may sleep
rt.def("/obj/structure/blob/proc/change_to", function* change_to(f: Frame, type: Value, controller: Value) {
	let B: Value = null;
	f.vars = () => [type, controller, B];
	if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(type)])))) {
		rt.throw_(f, (yield* g.new_(f, T("/exception"), ["change_to(): invalid type for blob", "code/game/gamemodes/blob/theblob.dm", 296])));
		return live(f.dot);
	}
	B = (yield* g.new_(f, live(type), [rt.fv(f, "loc", live(f.src))]));
	if (truthy(live(controller))) {
		rt.setFv(f, "overmind", live(B), live(controller));
	}
	yield* g.callName(f, live(B), "creation_action", []);
	yield* g.callName(f, live(B), "update_icon", []);
	yield* g.callName(f, live(B), "setDir", [rt.sv(f, "dir")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(B);
}, true);

// /obj/structure/blob/proc/examine  (code/game/gamemodes/blob/theblob.dm:308)
rt.def("/obj/structure/blob/proc/examine", function examine(f: Frame) {
	let hud_to_check: Value = null;
	f.vars = () => [hud_to_check];
	rt.callSuper(f, [], rt.Args.Same);
	hud_to_check = rt.index(rt.gl("huds"), 4);
	if ((truthy(rt.fv(f, "research_scanner", live(f.args[0]))) || truthy(rt.index(rt.fv(f, "hudusers", live(hud_to_check)), live(f.args[0]))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<b>Your HUD displays an extensive report...</b><br>"]);
		rt.callSrc(f, "chemeffectreport", [live(f.args[0])]);
		rt.callSrc(f, "typereport", [live(f.args[0])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("It seems to be made of ＀.", [rt.callSrc(f, "get_chem_name", [])])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/blob/proc/scannerreport  (code/game/gamemodes/blob/theblob.dm:318)
rt.def("/obj/structure/blob/proc/scannerreport", function scannerreport(f: Frame) {
	return "A generic blob. Looks like someone forgot to override this proc, adminhelp this.";
});

// /obj/structure/blob/proc/get_chem_name  (code/game/gamemodes/blob/theblob.dm:322)
rt.def("/obj/structure/blob/proc/get_chem_name", function get_chem_name(f: Frame) {
	if (truthy(rt.sv(f, "overmind"))) {
		return rt.gv(f, "name", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind")));
	}
	return "an unknown variant";
});

rt.type(12140, "/obj/structure/blob/normal", "/obj/structure/blob", {
	light_range: 0,
	health_regen: 1,
	brute_resist: 0.25,
	name: "normal blob",
	icon_state: "blob",
	obj_integrity: 21,
	max_integrity: 25,
});

// /obj/structure/blob/normal/proc/scannerreport  (code/game/gamemodes/blob/theblob.dm:335)
rt.def("/obj/structure/blob/normal/proc/scannerreport", function scannerreport(f: Frame) {
	if (rt.le(rt.sv(f, "obj_integrity"), 15)) {
		return "Currently weak to brute damage.";
	}
	return "N/A";
});

// /obj/structure/blob/normal/proc/update_icon  (code/game/gamemodes/blob/theblob.dm:340)
rt.def("/obj/structure/blob/normal/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.le(rt.sv(f, "obj_integrity"), 15)) {
		rt.setSv(f, "icon_state", "blob_damaged");
		rt.setSv(f, "name", "fragile blob");
		rt.setSv(f, "desc", "A thin lattice of slightly twitching tendrils.");
		rt.setSv(f, "brute_resist", 0.5);
	} else {
		rt.setSv(f, "icon_state", "blob");
		rt.setSv(f, "name", "blob");
		rt.setSv(f, "desc", "A thick wall of writhing tendrils.");
		rt.setSv(f, "brute_resist", 0.25);
	}
	return f.dot;
});
