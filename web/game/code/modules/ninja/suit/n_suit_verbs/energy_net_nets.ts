// From code/modules/ninja/suit/n_suit_verbs/energy_net_nets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12967, "/obj/structure/energy_net", "/obj/structure", {
	affecting: null,
	master: null,
	anchored: 1,
	name: "energy net",
	desc: "It's a net made of green energy.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "energynet",
	density: 1,
	opacity: 0,
	mouse_opacity: 1,
	layer: 4.5,
	obj_integrity: 25,
	max_integrity: 25,
});

// /obj/structure/energy_net/proc/play_attack_sound  (code/modules/ninja/suit/n_suit_verbs/energy_net_nets.dm:25)
rt.def("/obj/structure/energy_net/proc/play_attack_sound", function play_attack_sound(f: Frame, damage: Value, damage_type: Value, damage_flag: Value) {
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
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/slash.ogg"), 80, 1]);
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/slash.ogg"), 80, 1]);
	}
	return f.dot;
});

// /obj/structure/energy_net/proc/Destroy  (code/modules/ninja/suit/n_suit_verbs/energy_net_nets.dm:33)  may sleep
rt.def("/obj/structure/energy_net/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [M, O, $e];
	if (truthy(rt.sv(f, "affecting"))) {
		rt.setFv(f, "anchored", (M = rt.sv(f, "affecting")), 0);
		O = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [live(f.src), 3])), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			yield* g.callName(f, live(O), "show_message", [fmt("＀ was recovered from the energy net!", [rt.fv(f, "name", live(M))]), 1, "<span class='italics'>You hear a grunt.</span>", 2]);
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "master"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "master"), "<span class='userdanger'>ERROR</span>: unable to initiate transport protocol. Procedure terminated."]);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/energy_net/proc/process  (code/modules/ninja/suit/n_suit_verbs/energy_net_nets.dm:46)  may sleep
rt.def("/obj/structure/energy_net/proc/process", function* process(f: Frame, M: Value) {
	let check: Value = null, mob_name: Value = null, W: Value = null, H: Value = null, spark_system: Value = null;
	let $e: any;
	f.vars = () => [M, check, mob_name, W, H, spark_system, $e];
	check = 30;
	mob_name = rt.fv(f, "name", rt.sv(f, "affecting"));
	rt.setFv(f, "notransform", live(M), 1);
	while ((live(M) !== null && live(f.src) !== null) && rt.gt(live(check), 0)) {
		check = rt.inc(live(check), -1);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
	}
	if ((live(M) === null || !isEqual(rt.fv(f, "loc", live(M)), rt.sv(f, "loc")))) {
		if (rt.sv(f, "master") !== null) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "master"), fmt("<span class='userdanger'>ERROR</span>: unable to locate ％！. Procedure terminated.", [live(mob_name)])]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		rt.setFv(f, "notransform", live(M), 0);
		return live(f.dot);
	}
	if (live(f.src) !== null) {
		rt.setSv(f, "density", 0);
		rt.setSv(f, "invisibility", 101);
		(rt.modSrcVar(f, "resistance_flags", 64, rt.bitOr));
		W = null;
		rt.forList(f, 0, live(M), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			W = $e;
			if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
				H = live(M);
				if (isEqual(live(W), rt.fv(f, "w_uniform", live(H)))) {
					continue;
				}
				if (isEqual(live(W), rt.fv(f, "shoes", live(H)))) {
					continue;
				}
			}
			yield* g.callName(f, live(M), "dropItemToGround", [live(W)]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(M)), rt.rsc("sound/effects/sparks4.ogg"), 50, 1]);
		yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/ninja/phase/out"), [rt.getStep(f, live(M), 0), rt.fv(f, "dir", live(M))]);
		yield* g.srcCall(f, "visible_message", fmt("＀ suddenly vanishes!", [live(M)]));
		yield* g.callName(f, live(M), "forceMove", [rt.op(f, "PickUnweighted", [1], [rt.gl("holdingfacility")])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>You appear in a strange place!</span>"]);
		if (rt.sv(f, "master") !== null) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "master"), fmt("<span class='notice'><b>SUCCESS</b>: transport procedure of ％！ complete.</span>", [rt.sv(f, "affecting")])]);
		}
		rt.setFv(f, "notransform", live(M), 0);
		yield* g.callName(f, (spark_system = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [5, 0, rt.fv(f, "loc", live(M))]);
		yield* g.callName(f, live(spark_system), "start", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(M)), rt.rsc("sound/effects/phasein.ogg"), 25, 1]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(M)), rt.rsc("sound/effects/sparks2.ogg"), 50, 1]);
		yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/ninja/phase"), [rt.getStep(f, live(M), 0), rt.fv(f, "dir", live(M))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>You are free of the net!</span>"]);
		rt.setFv(f, "notransform", live(M), 0);
	}
	return live(f.dot);
}, true, { waitfor: false });

// /obj/structure/energy_net/proc/attack_paw  (code/modules/ninja/suit/n_suit_verbs/energy_net_nets.dm:100)  may sleep
rt.def("/obj/structure/energy_net/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand"));
}, true);
