// From code/game/gamemodes/blob/blobs/core.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12141, "/obj/structure/blob/core", "/obj/structure/blob", {
	core_regen: 2,
	overmind_get_delay: 0,
	resource_delay: 0,
	point_rate: 2,
	explosion_block: 6,
	point_return: -1,
	health_regen: 0,
	name: "blob core",
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "blank_blob",
	desc: "A huge, pulsating yellow mass.",
	obj_integrity: 400,
	max_integrity: 400,
	armor: null,
});

// /obj/structure/blob/core/proc/<init>  (code/game/gamemodes/blob/blobs/core.dm:8)
rt.def("/obj/structure/blob/core/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 75, "acid", 90]));
	return f.dot;
});

// /obj/structure/blob/core/proc/Initialize  (code/game/gamemodes/blob/blobs/core.dm:19)  may sleep
rt.def("/obj/structure/blob/core/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 2;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	rt.modGl("blob_cores", live(f.src), add);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	yield* g.srcCall(f, "update_icon");
	if ((!truthy(live(f.args[3])) && !truthy(rt.sv(f, "overmind")))) {
		yield* g.srcCall(f, "create_overmind", live(f.args[1]));
	}
	if (truthy(rt.sv(f, "overmind"))) {
		yield* g.srcCall(f, "update_icon");
	}
	rt.setSv(f, "point_rate", live(f.args[2]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "new_overmind", "new_rate", "placed"] });

// /obj/structure/blob/core/proc/scannerreport  (code/game/gamemodes/blob/blobs/core.dm:31)
rt.def("/obj/structure/blob/core/proc/scannerreport", function scannerreport(f: Frame) {
	return "Directs the blob's expansion, gradually expands, and sustains nearby blob spores and blobbernauts.";
});

// /obj/structure/blob/core/proc/update_icon  (code/game/gamemodes/blob/blobs/core.dm:34)
rt.def("/obj/structure/blob/core/proc/update_icon", function update_icon(f: Frame) {
	let blob_overlay: Value = null;
	f.vars = () => [blob_overlay];
	rt.callSrc(f, "cut_overlays", []);
	rt.setSv(f, "color", null);
	blob_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/blob.dmi"), "blob"]);
	if (truthy(rt.sv(f, "overmind"))) {
		rt.setFv(f, "color", live(blob_overlay), rt.gv(f, "color", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))));
	}
	rt.callSrc(f, "add_overlay", [live(blob_overlay)]);
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/blob.dmi"), "blob_core_overlay"])]);
	return f.dot;
});

// /obj/structure/blob/core/proc/Destroy  (code/game/gamemodes/blob/blobs/core.dm:43)  may sleep
rt.def("/obj/structure/blob/core/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("blob_cores", live(f.src), subtract));
	if (truthy(rt.sv(f, "overmind"))) {
		rt.setFv(f, "blob_core", rt.sv(f, "overmind"), null);
	}
	rt.setSv(f, "overmind", null);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	(rt.modGl("poi_list", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/blob/core/proc/ex_act  (code/game/gamemodes/blob/blobs/core.dm:52)  may sleep
rt.def("/obj/structure/blob/core/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let damage: Value = null;
	f.vars = () => [severity, target, damage];
	yield* g.srcCall(f, "take_damage", (damage = subtract(50, multiply(10, live(severity)))), "brute", "bomb", 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/blob/core/proc/take_damage  (code/game/gamemodes/blob/blobs/core.dm:56)  may sleep
rt.def("/obj/structure/blob/core/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!rt.gt(rt.sv(f, "obj_integrity"), 0)) return f.dot;
	if (!truthy(rt.sv(f, "overmind"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "overmind"), "update_health_hud", []);
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir", "overmind_reagent_trigger"] });

// /obj/structure/blob/core/proc/Life  (code/game/gamemodes/blob/blobs/core.dm:62)  may sleep
rt.def("/obj/structure/blob/core/proc/Life", function* Life(f: Frame) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [B, $e];
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "overmind"))) {
		yield* g.srcCall(f, "create_overmind");
	} else {
		if (rt.le(rt.sv(f, "resource_delay"), rt.worldTime(f))) {
			rt.setSv(f, "resource_delay", add(rt.worldTime(f), 10));
			yield* g.callName(f, rt.sv(f, "overmind"), "add_points", [rt.sv(f, "point_rate")]);
		}
	}
	rt.setSv(f, "obj_integrity", (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "max_integrity"), add(rt.sv(f, "obj_integrity"), rt.sv(f, "core_regen"))])));
	if (truthy(rt.sv(f, "overmind"))) {
		yield* g.callName(f, rt.sv(f, "overmind"), "update_health_hud", []);
	}
	yield* g.srcCall(f, "Pulse_Area", rt.sv(f, "overmind"), 12, 4, 3);
	B = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/obj/structure/blob/normal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.callName(f, live(B), "change_to", [T("/obj/structure/blob/shield/core"), rt.sv(f, "overmind")]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/blob/core/proc/create_overmind  (code/game/gamemodes/blob/blobs/core.dm:81)  may sleep
rt.def("/obj/structure/blob/core/proc/create_overmind", function* create_overmind(f: Frame, new_overmind: Value, override_delay: Value) {
	let C: Value = null, candidates: Value = null, B: Value = null;
	f.vars = () => [new_overmind, override_delay, C, candidates, B];
	if ((rt.gt(rt.sv(f, "overmind_get_delay"), rt.worldTime(f)) && !truthy(live(override_delay)))) {
		return live(f.dot);
	}
	rt.setSv(f, "overmind_get_delay", add(rt.worldTime(f), 150));
	if (truthy(rt.sv(f, "overmind"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "overmind")]);
	}
	C = null;
	candidates = rt.list();
	if (!truthy(live(new_overmind))) {
		if (truthy(rt.getLen(f, (candidates = (yield* g.call(f, P("/proc/pollCandidatesForMob"), null, ["Do you want to play as a blob overmind?", "blob", null, "blob", 50, live(f.src)])))))) {
			C = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
		}
	} else {
		C = live(new_overmind);
	}
	if (truthy(live(C))) {
		rt.setFv(f, "key", (B = (yield* g.new_(f, T("/mob/camera/blob"), [rt.fv(f, "loc", live(f.src)), 1]))), rt.fv(f, "key", live(C)));
		rt.setFv(f, "blob_core", live(B), live(f.src));
		rt.setFv(f, "overmind", live(f.src), live(B));
		yield* g.srcCall(f, "update_icon");
		if ((truthy(rt.fv(f, "mind", live(B))) && !truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(B)))))) {
			rt.setFv(f, "special_role", rt.fv(f, "mind", live(B)), "Blob Overmind");
		}
		return 1;
	}
	return 0;
}, true);
