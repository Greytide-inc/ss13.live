// Based on /tg/station's code/modules/power/singularity/containment_field.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// containment_field.dm:18
rt.def("/obj/machinery/field/containment/proc/Destroy", function* Destroy(f: Frame) {
	this.FG1.fields -= this;
	this.FG2.fields -= this;
	return (yield* parent_proc());
}, true);

// containment_field.dm:23
rt.def("/obj/machinery/field/containment/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (get_dist(this, user) > 1) {
		return 0;
	} else {
		yield* this.shock(user);
		return 1;
	}
}, true);

// containment_field.dm:30
rt.def("/obj/machinery/field/containment/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* this.shock(user);
	return 1;
}, true);

// containment_field.dm:34
rt.def("/obj/machinery/field/containment/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/effects/empulse.ogg"), 75, 1);
	} else if (damage_type === "brute") {
		playsound(this.loc, rt.rsc("sound/effects/empulse.ogg"), 75, 1);
	}
	return f.dot;
});

// containment_field.dm:47
rt.def("/obj/machinery/field/containment/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	if (!this.FG1 || !this.FG2) {
		yield* qdel(this);
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/simple_animal/hostile/megafauna"))) {
		M.visible_message(`<span class='warning'>${M} glows fiercely as the containment field flickers out!</span>`);
		this.FG1.calc_power(1e+31);
		yield* M.adjustHealth(-M.obj_damage);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// containment_field.dm:58
rt.def("/obj/machinery/field/containment/proc/Crossed", function* Crossed(f: Frame, mover: Value) {
	if (!rt.istype(mover, T("/mob/living"))) return f.dot;
	yield* this.shock(mover);
	return f.dot;
}, true);

// containment_field.dm:62
rt.def("/obj/machinery/field/containment/proc/Crossed", function* Crossed(f: Frame, mover: Value) {
	if (!(rt.istype(mover, T("/obj/machinery")) || rt.istype(mover, T("/obj/structure")) || rt.istype(mover, T("/obj/mecha")))) return f.dot;
	yield* this.bump_field(mover);
	return f.dot;
}, true);

// containment_field.dm:66
rt.def("/obj/machinery/field/containment/proc/set_master", function set_master(f: Frame, master1: Value, master2: Value) {
	if (!master1 || !master2) {
		return 0;
	}
	this.FG1 = master1;
	this.FG2 = master2;
	return 1;
});

// containment_field.dm:73
rt.def("/obj/machinery/field/containment/proc/shock", function* shock(f: Frame, user: Value) {
	if (!this.FG1 || !this.FG2) {
		yield* qdel(this);
		return 0;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// containment_field.dm:79
rt.def("/obj/machinery/field/containment/proc/Move", function* Move(f: Frame) {
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10631, "/obj/machinery/field", "/obj/machinery", {
	hasShocked: 0,
});

// containment_field.dm:92
rt.def("/obj/machinery/field/proc/CanPass", function* CanPass(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (this.hasShocked) {
		return 0;
	}
	if (rt.istype(f.args[0], T("/mob/living"))) {
		yield* this.shock(f.args[0]);
		return 0;
	}
	if (rt.istype(f.args[0], T("/obj/machinery")) || rt.istype(f.args[0], T("/obj/structure")) || rt.istype(f.args[0], T("/obj/mecha"))) {
		yield* this.bump_field(f.args[0]);
		return 0;
	}
	return (yield* parent_proc());
}, true, { args: ["mover", "target", "height"] });

// containment_field.dm:101
rt.def("/obj/machinery/field/proc/shock", function* shock(f: Frame, user: Value) {
	let shock_damage: Value = min(rand(30, 40), rand(30, 40));
	if (rt.istype(user, T("/mob/living/carbon"))) {
		yield* user.Knockdown(300);
		yield* user.electrocute_act(shock_damage, this, 1);
	} else if (rt.istype(user, T("/mob/living/silicon"))) {
		if (prob(20)) {
			yield* user.Stun(40);
		}
		yield* user.take_overall_damage(0, shock_damage);
		user.visible_message(`<span class='danger'>${user.name} was shocked by the ${this.name}!</span>`, "<span class='userdanger'>Energy pulse detected, system damaged!</span>", "<span class='italics'>You hear an electrical crack.</span>");
	}
	yield* user.updatehealth();
	yield* this.bump_field(user);
	return f.dot;
}, true);

// containment_field.dm:125
rt.def("/obj/machinery/field/proc/bump_field", function* bump_field(f: Frame, AM: Value) {
	if (this.hasShocked) {
		return 0;
	}
	this.hasShocked = 1;
	yield* do_sparks(5, 1, AM.loc);
	let target: Value = get_edge_target_turf(AM, rt.getDir(f, this, get_step_away(AM, this)));
	yield* AM.throw_at(target, 200, 4);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/field/proc/clear_shock"))), 5);
	return f.dot;
}, true);
