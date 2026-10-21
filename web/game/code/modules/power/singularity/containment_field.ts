// From code/modules/power/singularity/containment_field.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10633, "/obj/machinery/field/containment", "/obj/machinery/field", {
	FG1: null,
	FG2: null,
	anchored: 1,
	name: "containment field",
	desc: "An energy field.",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "Contain_F",
	density: 0,
	resistance_flags: 115,
	use_power: 0,
	luminosity: 4,
	layer: 3.2,
});

// /obj/machinery/field/containment/proc/Destroy  (code/modules/power/singularity/containment_field.dm:18)  may sleep
rt.def("/obj/machinery/field/containment/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.sv(f, "FG1"), "fields", live(f.src), subtract));
	(rt.modField(f, rt.sv(f, "FG2"), "fields", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/field/containment/proc/attack_hand  (code/modules/power/singularity/containment_field.dm:23)  may sleep
rt.def("/obj/machinery/field/containment/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) {
		return 0;
	} else {
		yield* g.srcCall(f, "shock", live(user));
		return 1;
	}
	return f.dot;
}, true);

// /obj/machinery/field/containment/proc/attackby  (code/modules/power/singularity/containment_field.dm:30)  may sleep
rt.def("/obj/machinery/field/containment/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.vars = () => [W, user, params];
	yield* g.srcCall(f, "shock", live(user));
	return 1;
}, true);

// /obj/machinery/field/containment/proc/play_attack_sound  (code/modules/power/singularity/containment_field.dm:34)
rt.def("/obj/machinery/field/containment/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/empulse.ogg"), 75, 1]);
	} else if ($0 === "brute") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/empulse.ogg"), 75, 1]);
	}
	return f.dot;
});

// /obj/machinery/field/containment/proc/attack_animal  (code/modules/power/singularity/containment_field.dm:47)  may sleep
rt.def("/obj/machinery/field/containment/proc/attack_animal", function* attack_animal(f: Frame) {
	if ((!truthy(rt.sv(f, "FG1")) || !truthy(rt.sv(f, "FG2")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ glows fiercely as the containment field flickers out!</span>", [live(f.args[0])])]);
		yield* g.callName(f, rt.sv(f, "FG1"), "calc_power", [9.999999848243207e+30]);
		yield* g.callName(f, live(f.args[0]), "adjustHealth", [rt.neg(rt.fv(f, "obj_damage", live(f.args[0])))]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M"] });

// /obj/machinery/field/containment/proc/Crossed  (code/modules/power/singularity/containment_field.dm:58)  may sleep
rt.def("/obj/machinery/field/containment/proc/Crossed", function* Crossed(f: Frame, mover: Value) {
	f.vars = () => [mover];
	if (!truthy((rt.istype(live(mover), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "shock", live(mover));
	return f.dot;
}, true);

// /obj/machinery/field/containment/proc/Crossed  (code/modules/power/singularity/containment_field.dm:62)  may sleep
rt.def("/obj/machinery/field/containment/proc/Crossed", function* Crossed(f: Frame, mover: Value) {
	f.vars = () => [mover];
	if (!((truthy((rt.istype(live(mover), T("/obj/machinery")) ? 1 : 0)) || truthy((rt.istype(live(mover), T("/obj/structure")) ? 1 : 0))) || truthy((rt.istype(live(mover), T("/obj/mecha")) ? 1 : 0)))) return f.dot;
	yield* g.srcCall(f, "bump_field", live(mover));
	return f.dot;
}, true);

// /obj/machinery/field/containment/proc/set_master  (code/modules/power/singularity/containment_field.dm:66)
rt.def("/obj/machinery/field/containment/proc/set_master", function set_master(f: Frame, master1: Value, master2: Value) {
	if ((!truthy(live(master1)) || !truthy(live(master2)))) {
		return 0;
	}
	rt.setSv(f, "FG1", live(master1));
	rt.setSv(f, "FG2", live(master2));
	return 1;
});

// /obj/machinery/field/containment/proc/shock  (code/modules/power/singularity/containment_field.dm:73)  may sleep
rt.def("/obj/machinery/field/containment/proc/shock", function* shock(f: Frame) {
	if ((!truthy(rt.sv(f, "FG1")) || !truthy(rt.sv(f, "FG2")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/field/containment/proc/Move  (code/modules/power/singularity/containment_field.dm:79)  may sleep
rt.def("/obj/machinery/field/containment/proc/Move", function* Move(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10631, "/obj/machinery/field", "/obj/machinery", {
	hasShocked: 0,
});

// /obj/machinery/field/proc/CanPass  (code/modules/power/singularity/containment_field.dm:92)  may sleep
rt.def("/obj/machinery/field/proc/CanPass", function* CanPass(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (truthy(rt.sv(f, "hasShocked"))) {
		return 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		yield* g.srcCall(f, "shock", live(f.args[0]));
		return 0;
	}
	if (((truthy((rt.istype(live(f.args[0]), T("/obj/machinery")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/structure")) ? 1 : 0))) || truthy((rt.istype(live(f.args[0]), T("/obj/mecha")) ? 1 : 0)))) {
		yield* g.srcCall(f, "bump_field", live(f.args[0]));
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mover", "target", "height"] });

// /obj/machinery/field/proc/shock  (code/modules/power/singularity/containment_field.dm:101)  may sleep
rt.def("/obj/machinery/field/proc/shock", function* shock(f: Frame, user: Value) {
	let shock_damage: Value = null;
	f.vars = () => [user, shock_damage];
	shock_damage = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/rand"), null, [30, 40])), (yield* g.call(f, P("/proc/rand"), null, [30, 40]))]));
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, live(user), "Knockdown", [300]);
		yield* g.callName(f, live(user), "electrocute_act", [live(shock_damage), live(f.src), 1]);
	} else {
		if (truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, live(user), "Stun", [40]);
			}
			yield* g.callName(f, live(user), "take_overall_damage", [0, live(shock_damage)]);
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ was shocked by the ＀!</span>", [rt.fv(f, "name", live(user)), rt.fv(f, "name", live(f.src))]), "<span class='userdanger'>Energy pulse detected, system damaged!</span>", "<span class='italics'>You hear an electrical crack.</span>"]);
		}
	}
	yield* g.callName(f, live(user), "updatehealth", []);
	yield* g.srcCall(f, "bump_field", live(user));
	return f.dot;
}, true);

// /obj/machinery/field/proc/bump_field  (code/modules/power/singularity/containment_field.dm:125)  may sleep
rt.def("/obj/machinery/field/proc/bump_field", function* bump_field(f: Frame, AM: Value) {
	let target: Value = null;
	f.vars = () => [AM, target];
	if (truthy(rt.sv(f, "hasShocked"))) {
		return 0;
	}
	rt.setSv(f, "hasShocked", 1);
	yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, rt.fv(f, "loc", live(AM))]);
	target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(AM), rt.getDir(f, live(f.src), (yield* g.call(f, P("/proc/get_step_away"), null, [live(AM), live(f.src)])))]));
	yield* g.callName(f, live(AM), "throw_at", [live(target), 200, 4]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/field/proc/clear_shock")])), 5]);
	return f.dot;
}, true);
