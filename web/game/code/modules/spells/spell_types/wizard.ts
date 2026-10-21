// From code/modules/spells/spell_types/wizard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/effect/proc_holder/spell/aoe_turf/conjure/timestop/proc/<init>  (code/modules/spells/spell_types/wizard.dm:166)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/timestop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/obj/effect/timestop/wizard")));
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

// /obj/effect/proc_holder/spell/aoe_turf/conjure/carp/proc/<init>  (code/modules/spells/spell_types/wizard.dm:179)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/carp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/mob/living/simple_animal/hostile/carp")));
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

// /obj/effect/proc_holder/spell/aoe_turf/conjure/construct/proc/<init>  (code/modules/spells/spell_types/wizard.dm:194)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/construct/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/obj/structure/constructshell")));
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

// /obj/effect/proc_holder/spell/aoe_turf/conjure/creature/proc/<init>  (code/modules/spells/spell_types/wizard.dm:212)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/creature/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/mob/living/simple_animal/hostile/creature")));
	return f.dot;
});

rt.type(11318, "/obj/effect/proc_holder/spell/targeted/genetic/blind", "/obj/effect/proc_holder/spell/targeted/genetic", {
	mutations: null,
	duration: 300,
	sound: rt.rsc("sound/magic/blind.ogg"),
});

// /obj/effect/proc_holder/spell/targeted/genetic/blind/proc/<init>  (code/modules/spells/spell_types/wizard.dm:245)
rt.def("/obj/effect/proc_holder/spell/targeted/genetic/blind/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutations", rt.list("Blindness"));
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

// /obj/effect/proc_holder/spell/aoe_turf/repulse/proc/cast  (code/modules/spells/spell_types/wizard.dm:265)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/repulse/proc/cast", function* cast(f: Frame, targets: Value, user: Value, stun_amt: Value) {
	let thrownatoms: Value = null, throwtarget: Value = null, distfromcaster: Value = null, _T: Value = null, AM: Value = null, am: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [targets, user, stun_amt, thrownatoms, throwtarget, distfromcaster, _T, AM, am, M, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (live(stun_amt) === null) {
		stun_amt = 40;
	}
	thrownatoms = rt.list();
	throwtarget = null;
	distfromcaster = null;
	yield* g.srcCall(f, "playMagSound");
	_T = null;
	rt.forList(f, 0, live(targets), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		AM = null;
		rt.forList(f, 1, live(_T), T("/atom/movable"));
		while (($e = rt.next(f, 1)) !== undefined) {
			AM = $e;
			thrownatoms = rt.modify(live(thrownatoms), live(AM), add);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	am = null;
	rt.forList(f, 0, live(thrownatoms));
	while (($e = rt.next(f, 0)) !== undefined) {
		am = $e;
		if ((isEqual((AM = live(am)), live(user)) || truthy(rt.fv(f, "anchored", live(AM))))) {
			continue;
		}
		throwtarget = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(user), rt.getDir(f, live(user), (yield* g.call(f, P("/proc/get_step_away"), null, [live(AM), live(user)])))]));
		if (isEqual((distfromcaster = (yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(AM)]))), 0)) {
			if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
				yield* g.callName(f, (M = live(AM)), "Knockdown", [100]);
				yield* g.callName(f, live(M), "adjustBruteLoss", [5]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>You're slammed into the floor by ＀!</span>", [live(user)])]);
			}
		} else {
			yield* g.new_(f, rt.sv(f, "sparkle_path"), [rt.getStep(f, live(AM), 0), rt.getDir(f, live(user), live(AM))]);
			if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
				yield* g.callName(f, (M = live(AM)), "Knockdown", [live(stun_amt)]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>You're thrown back by ＀!</span>", [live(user)])]);
			}
			yield* g.callName(f, live(AM), "throw_at", [live(throwtarget), (yield* g.call(f, P("/proc/max"), null, [3, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "maxthrow"), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(live(distfromcaster), 2), live(distfromcaster)]))]))), rt.sv(f, "maxthrow")]))])), 1, live(user)]);
		}
	}
	rt.endFor(f, 0);
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

// /obj/effect/proc_holder/spell/aoe_turf/repulse/xeno/proc/cast  (code/modules/spells/spell_types/wizard.dm:308)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/repulse/xeno/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null;
	f.vars = () => [targets, user, C];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.gv(f, "loc", (C = live(user))), rt.rsc("sound/voice/hiss5.ogg"), 80, 1, 1]);
		yield* g.callName(f, live(C), "spin", [6, 1]);
	}
	yield* g.callSuper(f, [live(targets), live(user), 60]);
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

// /obj/effect/proc_holder/spell/targeted/sacred_flame/proc/cast  (code/modules/spells/spell_types/wizard.dm:329)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/sacred_flame/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let L: Value = null, U: Value = null;
	let $e: any;
	f.vars = () => [targets, user, L, U, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	L = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.callName(f, live(L), "adjust_fire_stacks", [20]);
	}
	rt.endFor(f, 0);
	if (!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (U = live(user)), "IgniteMob", []);
	return f.dot;
}, true);

rt.type(11290, "/obj/effect/proc_holder/spell/targeted/conjure_item/spellpacket", "/obj/effect/proc_holder/spell/targeted/conjure_item", {
	item_type: rt.typePath("/obj/item/spellpacket/lightningbolt"),
	name: "Thrown Lightning",
	desc: "Forged from eldrich energies, a packet of pure power, known as a spell packet will appear in your hand, that when thrown will stun the target.",
	clothes_req: 1,
	charge_max: 10,
});

// /obj/effect/proc_holder/spell/targeted/conjure_item/spellpacket/proc/cast  (code/modules/spells/spell_types/wizard.dm:343)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/conjure_item/spellpacket/proc/cast", function* cast(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = live(f.usr);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	C = null;
	rt.forList(f, 0, live(f.args[0]), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "throw_mode_on", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["targets", "user"] });

rt.type(10164, "/obj/item/spellpacket/lightningbolt", "/obj/item/spellpacket", {
	w_class: 1,
	name: "１Lightning bolt Spell Packet",
	desc: "Some birdseed wrapped in cloth that somehow crackles with electricity.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "snappop",
});

// /obj/item/spellpacket/lightningbolt/proc/throw_impact  (code/modules/spells/spell_types/wizard.dm:355)  may sleep
rt.def("/obj/item/spellpacket/lightningbolt/proc/throw_impact", function* throw_impact(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, (M = live(f.args[0])), "electrocute_act", [null, 80, null, live(f.src), "illusion", 1], rt.Args.Named);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

// /obj/item/spellpacket/lightningbolt/proc/throw_at  (code/modules/spells/spell_types/wizard.dm:362)  may sleep
rt.def("/obj/item/spellpacket/lightningbolt/proc/throw_at", function* throw_at(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[3]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (H = live(f.args[3])), "say", ["LIGHTNINGBOLT!!"]);
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });
