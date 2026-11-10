// Based on /tg/station's code/modules/spells/spell_types/wizard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11367, "/obj/effect/proc_holder/spell/aoe_turf/conjure/timestop", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_amt: 1,
	name: "Stop Time",
	desc: "This spell stops time for everyone except for you, allowing you to move freely while your enemies and even projectiles are frozen.",
	charge_max: 500,
	clothes_req: 1,
	invocation: "TOKI WO TOMARE",
	invocation_type: "shout",
	range: 0,
	cooldown_min: 100,
	action_icon_state: "time",
	summon_type: null,
});

// wizard.dm:166
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/timestop/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/obj/effect/timestop/wizard"));
	return f.dot;
});

rt.type(11368, "/obj/effect/proc_holder/spell/aoe_turf/conjure/carp", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_type: null,
	cast_sound: rt.rsc("sound/magic/summon_karp.ogg"),
	name: "Summon Carp",
	desc: "This spell conjures a simple carp.",
	school: "conjuration",
	charge_max: 1200,
	clothes_req: 1,
	invocation: "NOUK FHUNMM SACP RISSKA",
	invocation_type: "shout",
	range: 1,
});

// wizard.dm:179
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/carp/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/mob/living/simple_animal/hostile/carp"));
	return f.dot;
});

rt.type(11354, "/obj/effect/proc_holder/spell/aoe_turf/conjure/construct", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	cast_sound: rt.rsc("sound/magic/summonitems_generic.ogg"),
	name: "Artificer",
	desc: "This spell conjures a construct which may be controlled by Shades",
	school: "conjuration",
	charge_max: 600,
	clothes_req: 0,
	invocation: "none",
	invocation_type: "none",
	range: 0,
	summon_type: null,
	action_icon_state: "artificer",
});

// wizard.dm:194
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/construct/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/obj/structure/constructshell"));
	return f.dot;
});

rt.type(11369, "/obj/effect/proc_holder/spell/aoe_turf/conjure/creature", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_amt: 10,
	summon_type: null,
	cast_sound: rt.rsc("sound/magic/summonitems_generic.ogg"),
	name: "Summon Creature Swarm",
	desc: "This spell tears the fabric of reality, allowing horrific daemons to spill forth",
	school: "conjuration",
	charge_max: 1200,
	clothes_req: 0,
	invocation: "IA IA",
	invocation_type: "shout",
	range: 3,
});

// wizard.dm:212
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/creature/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/mob/living/simple_animal/hostile/creature"));
	return f.dot;
});

rt.type(11318, "/obj/effect/proc_holder/spell/targeted/genetic/blind", "/obj/effect/proc_holder/spell/targeted/genetic", {
	mutations: null,
	duration: 300,
	sound: rt.rsc("sound/magic/blind.ogg"),
});

// wizard.dm:245
rt.def("/obj/effect/proc_holder/spell/targeted/genetic/blind/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutations = list("Blindness");
	return f.dot;
});

rt.type(11373, "/obj/effect/proc_holder/spell/aoe_turf/repulse", "/obj/effect/proc_holder/spell/aoe_turf", {
	maxthrow: 5,
	sparkle_path: rt.typePath("/obj/effect/temp_visual/gravpush"),
	name: "Repulse",
	desc: "This spell throws everything around the user away.",
	charge_max: 400,
	clothes_req: 1,
	invocation: "GITTAH WEIGH",
	invocation_type: "shout",
	range: 5,
	cooldown_min: 150,
	selection_type: "view",
	sound: rt.rsc("sound/magic/repulse.ogg"),
	action_icon_state: "repulse",
});

// wizard.dm:265
rt.def("/obj/effect/proc_holder/spell/aoe_turf/repulse/proc/cast", function* cast(f: Frame, targets: Value, user: Value, stun_amt: Value) {
	let throwtarget: Value = null, distfromcaster: Value = null, _T: Value = null, AM: Value = null, am: Value = null, M: Value = null;
	user ??= f.usr;
	stun_amt ??= 40;
	let thrownatoms: Value = list();
	this.playMagSound();
	for (_T of each(targets, T("/turf"))) {
		AM = null;
		for (AM of each(_T, T("/atom/movable"))) {
			thrownatoms += AM;
		}
	}
	for (am of each(thrownatoms)) {
		if ((AM = am) == user || AM.anchored) {
			continue;
		}
		throwtarget = get_edge_target_turf(user, rt.getDir(f, user, get_step_away(AM, user)));
		if ((distfromcaster = get_dist(user, AM)) == 0) {
			if (rt.istype(AM, T("/mob/living"))) {
				yield* (M = AM).Knockdown(100);
				yield* M.adjustBruteLoss(5);
				to_chat(M, `<span class='userdanger'>You're slammed into the floor by ${user}!</span>`);
			}
		} else {
			yield* new_(this.sparkle_path, rt.getStep(f, AM, 0), rt.getDir(f, user, AM));
			if (rt.istype(AM, T("/mob/living"))) {
				yield* (M = AM).Knockdown(stun_amt);
				to_chat(M, `<span class='userdanger'>You're thrown back by ${user}!</span>`);
			}
			yield* AM.throw_at(throwtarget, max(3, min(this.maxthrow - max(0, min(distfromcaster - 2, distfromcaster)), this.maxthrow)), 1, user);
		}
	}
	return f.dot;
}, true);

rt.type(11374, "/obj/effect/proc_holder/spell/aoe_turf/repulse/xeno", "/obj/effect/proc_holder/spell/aoe_turf/repulse", {
	name: "Tail Sweep",
	desc: "Throw back attackers with a sweep of your tail.",
	sound: rt.rsc("sound/magic/tail_swing.ogg"),
	charge_max: 150,
	clothes_req: 0,
	range: 2,
	cooldown_min: 150,
	invocation_type: "none",
	sparkle_path: rt.typePath("/obj/effect/temp_visual/dir_setting/tailsweep"),
	action_icon_state: "tailsweep",
	action_background_icon_state: "bg_alien",
});

// wizard.dm:308
rt.def("/obj/effect/proc_holder/spell/aoe_turf/repulse/xeno/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null;
	user ??= f.usr;
	if (rt.istype(user, T("/mob/living/carbon"))) {
		playsound((C = user).loc, rt.rsc("sound/voice/hiss5.ogg"), 80, 1, 1);
		yield* C.spin(6, 1);
	}
	yield* parent_proc(targets, user, 60);
	return f.dot;
}, true);

rt.type(11343, "/obj/effect/proc_holder/spell/targeted/sacred_flame", "/obj/effect/proc_holder/spell/targeted", {
	max_targets: 0,
	include_user: 1,
	name: "Sacred Flame",
	desc: "Makes everyone around you more flammable, and lights yourself on fire.",
	charge_max: 60,
	clothes_req: 0,
	invocation: "FI'RAN DADISKO",
	invocation_type: "shout",
	range: 6,
	selection_type: "view",
	action_icon_state: "sacredflame",
	sound: rt.rsc("sound/magic/fireball.ogg"),
});

// wizard.dm:329
rt.def("/obj/effect/proc_holder/spell/targeted/sacred_flame/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let L: Value = null, U: Value = null;
	user ??= f.usr;
	for (L of each(targets, T("/mob/living"))) {
		yield* L.adjust_fire_stacks(20);
	}
	if (!rt.istype(user, T("/mob/living"))) return f.dot;
	yield* (U = user).IgniteMob();
	return f.dot;
}, true);

rt.type(11290, "/obj/effect/proc_holder/spell/targeted/conjure_item/spellpacket", "/obj/effect/proc_holder/spell/targeted/conjure_item", {
	item_type: rt.typePath("/obj/item/spellpacket/lightningbolt"),
	name: "Thrown Lightning",
	desc: "Forged from eldrich energies, a packet of pure power, known as a spell packet will appear in your hand, that when thrown will stun the target.",
	clothes_req: 1,
	charge_max: 10,
});

// wizard.dm:343
rt.def("/obj/effect/proc_holder/spell/targeted/conjure_item/spellpacket/proc/cast", function* cast(f: Frame) {
	let C: Value = null;
	if (f.args[1] === null) {
		f.args[1] = f.usr;
	}
	yield* parent_proc();
	for (C of each(f.args[0], T("/mob/living/carbon"))) {
		C.throw_mode_on();
	}
	return f.dot;
}, true, { args: ["targets", "user"] });

rt.type(10164, "/obj/item/spellpacket/lightningbolt", "/obj/item/spellpacket", {
	w_class: 1,
	name: "１Lightning bolt Spell Packet",
	desc: "Some birdseed wrapped in cloth that somehow crackles with electricity.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "snappop",
});

// wizard.dm:355
rt.def("/obj/item/spellpacket/lightningbolt/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let M: Value = null;
	if (yield* parent_proc()) return f.dot;
	if (rt.istype(hit_atom, T("/mob/living"))) {
		yield* (M = hit_atom).electrocute_act(80, this, { illusion: 1 });
	}
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// wizard.dm:362
rt.def("/obj/item/spellpacket/lightningbolt/proc/throw_at", function* throw_at(f: Frame) {
	let H: Value = null;
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (f.args[5] === null) {
		f.args[5] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!rt.istype(f.args[3], T("/mob/living/carbon/human"))) return f.dot;
	yield* (H = f.args[3]).say("LIGHTNINGBOLT!!");
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });
