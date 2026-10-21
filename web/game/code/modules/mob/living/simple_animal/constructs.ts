// From code/modules/mob/living/simple_animal/constructs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4863, "/mob/living/simple_animal/hostile/construct", "/mob/living/simple_animal/hostile", {
	construct_spells: null,
	playstyle_string: "<b>You are a generic construct! Your job is to not exist, and you should probably adminhelp this.</b>",
	master: null,
	seeking: 0,
	can_repair_constructs: 0,
	can_repair_self: 0,
	pressure_resistance: 100,
	initial_language_holder: rt.typePath("/datum/language_holder/construct"),
	name: "Construct",
	real_name: "Construct",
	desc: "",
	gender: "neuter",
	speak_emote: null,
	response_help: "thinks better of touching",
	response_disarm: "flails at",
	response_harm: "punches",
	speak_chance: 1,
	icon: rt.rsc("icons/mob/mob.dmi"),
	speed: 0,
	a_intent: "harm",
	stop_automated_movement: 1,
	status_flags: 8,
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	see_in_dark: 7,
	lighting_alpha: 128,
	damage_coeff: null,
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	healable: 0,
	faction: null,
	movement_type: 2,
	unique_name: 1,
	AIStatus: 3,
	loot: null,
	del_on_death: 1,
	deathmessage: "collapses in a shattered heap.",
});

// /mob/living/simple_animal/hostile/construct/proc/<init>  (code/modules/mob/living/simple_animal/constructs.dm:33)
rt.def("/mob/living/simple_animal/hostile/construct/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "construct_spells", rt.list());
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("hisses"));
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("cult"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/weapon/ectoplasm")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/construct/proc/Initialize  (code/modules/mob/living/simple_animal/constructs.dm:41)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/proc/Initialize", function* Initialize(f: Frame) {
	let spell: Value = null;
	let $e: any;
	f.vars = () => [spell, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_health_hud");
	spell = null;
	rt.forList(f, 0, rt.sv(f, "construct_spells"));
	while (($e = rt.next(f, 0)) !== undefined) {
		spell = $e;
		yield* g.srcCall(f, "AddSpell", (yield* g.new_(f, live(spell), [null])));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/construct/proc/Login  (code/modules/mob/living/simple_animal/constructs.dm:47)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/proc/Login", function* Login(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), rt.sv(f, "playstyle_string")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/construct/proc/examine  (code/modules/mob/living/simple_animal/constructs.dm:51)
rt.def("/mob/living/simple_animal/hostile/construct/proc/examine", function examine(f: Frame, user: Value) {
	let t_He: Value = null, t_s: Value = null, msg: Value = null;
	f.vars = () => [t_He, t_s, msg];
	t_He = rt.callSrc(f, "p_they", [1]);
	t_s = rt.callSrc(f, "p_s", []);
	msg = fmt("<span class='cult'>*---------*\nThis is ＀ ＇<b>！</b>!\n", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(f.src)]);
	msg = rt.modify(live(msg), fmt("＀\n", [rt.sv(f, "desc")]), add);
	if (rt.lt(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
		msg = rt.modify(live(msg), "<span class='warning'>", add);
		if (rt.ge(rt.sv(f, "health"), divide(rt.sv(f, "maxHealth"), 2))) {
			msg = rt.modify(live(msg), fmt("＀ look＀ slightly dented.\n", [live(t_He), live(t_s)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("<b>＀ look＀ severely dented!</b>\n", [live(t_He), live(t_s)]), add);
		}
		msg = rt.modify(live(msg), "</span>", add);
	}
	msg = rt.modify(live(msg), "*---------*</span>", add);
	rt.call(f, P("/proc/to_chat"), null, [live(user), live(msg)]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/construct/proc/attack_animal  (code/modules/mob/living/simple_animal/constructs.dm:67)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/proc/attack_animal", function* attack_animal(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/construct")) ? 1 : 0))) {
		if ((!truthy(rt.gv(f, "can_repair_constructs", (C = live(f.args[0])))) || (isEqual(live(C), live(f.src)) && !truthy(rt.fv(f, "can_repair_self", live(C)))))) {
			return live(f.dot);
		}
		if (rt.lt(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
			yield* g.srcCall(f, "adjustHealth", -5);
			if (!isEqual(live(f.src), live(f.args[0]))) {
				yield* g.callSrc(f, "Beam", [null, live(f.args[0]), "icon_state", "sendbeam", "time", 4], rt.Args.Named);
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ repairs some of ％<b>！'s</b> dents.</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='cult'>You repair some of <b>＀'s</b> dents, leaving <b>＀</b> at <b>＀/＀</b> health.</span>", [live(f.src), live(f.src), rt.sv(f, "health"), rt.sv(f, "maxHealth")])]);
			} else {
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ repairs some of ＀ own dents.</span>", [live(f.args[0]), (yield* g.srcCall(f, "p_their"))]), fmt("<span class='cult'>You repair some of your own dents, leaving you at <b>＀/＀</b> health.</span>", [rt.fv(f, "health", live(f.args[0])), rt.fv(f, "maxHealth", live(f.args[0]))])]);
			}
		} else {
			if (!isEqual(live(f.src), live(f.args[0]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cult'>You cannot repair <b>＀'s</b> dents, as ＀ ＀ none!</span>", [live(f.src), (yield* g.srcCall(f, "p_they")), (yield* g.srcCall(f, "p_have"))])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>You cannot repair your own dents, as you have none!</span>"]);
			}
		}
	} else {
		if (isEqual(live(f.src), live(f.args[0]))) return f.dot;
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/hostile/construct/proc/adjustHealth  (code/modules/mob/living/simple_animal/constructs.dm:98)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.args[1]))) return f.dot;
	yield* g.srcCall(f, "update_health_hud");
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

rt.type(4864, "/mob/living/simple_animal/hostile/construct/armored", "/mob/living/simple_animal/hostile/construct", {
	playstyle_string: "<b>You are a Juggernaut. Though slow, your shell can withstand extreme punishment, create shield walls, rip apart enemies and walls alike, and even deflect energy weapons.</b>",
	name: "Juggernaut",
	real_name: "Juggernaut",
	desc: "A massive, armored construct built to spearhead attacks and soak up enemy fire.",
	icon_state: "behemoth",
	icon_living: "behemoth",
	maxHealth: 250,
	health: 250,
	response_harm: "harmlessly punches",
	harm_intent_damage: 0,
	obj_damage: 90,
	melee_damage_lower: 30,
	melee_damage_upper: 30,
	attacktext: "smashes their armored gauntlet into",
	speed: 3,
	environment_smash: 2,
	attack_sound: rt.rsc("sound/weapons/punch3.ogg"),
	status_flags: 0,
	mob_size: 3,
	force_threshold: 11,
	construct_spells: null,
});

// /mob/living/simple_animal/hostile/construct/armored/proc/<init>  (code/modules/mob/living/simple_animal/constructs.dm:123)
rt.def("/mob/living/simple_animal/hostile/construct/armored/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "construct_spells", rt.list(T("/obj/effect/proc_holder/spell/aoe_turf/conjure/lesserforcewall")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/construct/armored/proc/bullet_act  (code/modules/mob/living/simple_animal/constructs.dm:132)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/armored/proc/bullet_act", function* bullet_act(f: Frame, _P: Value) {
	let reflectchance: Value = null, new_x: Value = null, new_y: Value = null, curloc: Value = null;
	f.vars = () => [_P, reflectchance, new_x, new_y, curloc];
	if ((truthy((rt.istype(live(_P), T("/obj/item/projectile/energy")) ? 1 : 0)) || truthy((rt.istype(live(_P), T("/obj/item/projectile/beam")) ? 1 : 0)))) {
		if (truthy(rt.op(f, "Prob", [], [(reflectchance = subtract(80, (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "damage", live(_P)), 3)]))))]))) {
			yield* g.srcCall(f, "apply_damage", multiply(rt.fv(f, "damage", live(_P)), 0.5), rt.fv(f, "damage_type", live(_P)));
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The ＀ is reflected by ＀'s armored shell!</span>", [rt.fv(f, "name", live(_P)), live(f.src)]), fmt("<span class='userdanger'>The ＀ is reflected by your armored shell!</span>", [rt.fv(f, "name", live(_P))]));
			if (truthy(rt.fv(f, "starting", live(_P)))) {
				new_x = add(rt.gv(f, "x", rt.fv(f, "starting", live(_P))), rt.op(f, "PickUnweighted", [14], [0, 0, -1, 1, -2, 2, -2, 2, -2, 2, -3, 3, -3, 3]));
				new_y = add(rt.gv(f, "y", rt.fv(f, "starting", live(_P))), rt.op(f, "PickUnweighted", [14], [0, 0, -1, 1, -2, 2, -2, 2, -2, 2, -3, 3, -3, 3]));
				curloc = rt.getStep(f, live(f.src), 0);
				rt.setFv(f, "original", live(_P), rt.locate(live(new_x), live(new_y), rt.fv(f, "z", live(_P))));
				rt.setFv(f, "starting", live(_P), live(curloc));
				rt.setFv(f, "current", live(_P), live(curloc));
				rt.setFv(f, "firer", live(_P), live(f.src));
				rt.setFv(f, "yo", live(_P), subtract(live(new_y), rt.fv(f, "y", live(curloc))));
				rt.setFv(f, "xo", live(_P), subtract(live(new_x), rt.fv(f, "x", live(curloc))));
			}
			return -1;
		}
	}
	return (yield* g.callSuper(f, [live(_P)]));
}, true);

rt.type(4866, "/mob/living/simple_animal/hostile/construct/wraith", "/mob/living/simple_animal/hostile/construct", {
	attack_refund: 10,
	crit_refund: 50,
	kill_refund: 250,
	playstyle_string: "<b>You are a Wraith. Though relatively fragile, you are fast, deadly, can phase through walls, and your attacks will lower the cooldown on phasing.</b>",
	name: "Wraith",
	real_name: "Wraith",
	desc: "A wicked, clawed shell constructed to assassinate enemies and sow chaos behind enemy lines.",
	icon_state: "floating",
	icon_living: "floating",
	maxHealth: 75,
	health: 75,
	melee_damage_lower: 25,
	melee_damage_upper: 25,
	retreat_distance: 2,
	attacktext: "slashes",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	construct_spells: null,
});

// /mob/living/simple_animal/hostile/construct/wraith/proc/<init>  (code/modules/mob/living/simple_animal/constructs.dm:173)
rt.def("/mob/living/simple_animal/hostile/construct/wraith/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "construct_spells", rt.list(T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/shift")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/construct/wraith/proc/AttackingTarget  (code/modules/mob/living/simple_animal/constructs.dm:181)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/wraith/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let prev_stat: Value = null, L: Value = null, refund: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [prev_stat, L, refund, S, $e];
	prev_stat = null;
	if ((truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/iscultist"), null, [rt.sv(f, "target")]))))) {
		prev_stat = rt.gv(f, "stat", (L = rt.sv(f, "target")));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((yield* g.call(f, P("/proc/isnum"), null, [live(prev_stat)]))))) return f.dot;
	L = rt.sv(f, "target");
	refund = 0;
	if (((!truthy(live(L)) || truthy(rt.fv(f, "gc_destroyed", live(L)))) || (isEqual(rt.fv(f, "stat", live(L)), 2) && !isEqual(live(prev_stat), 2)))) {
		refund = rt.modify(live(refund), rt.sv(f, "kill_refund"), add);
	} else {
		if ((truthy((yield* g.callName(f, live(L), "InCritical", []))) && isEqual(live(prev_stat), 0))) {
			refund = rt.modify(live(refund), rt.sv(f, "crit_refund"), add);
		}
	}
	if ((!isEqual(rt.fv(f, "stat", live(L)), 2) && !isEqual(live(prev_stat), 2))) {
		refund = rt.modify(live(refund), rt.sv(f, "attack_refund"), add);
	}
	S = null;
	rt.forList(f, 0, rt.sv(f, "mob_spell_list"), T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/shift"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.setFv(f, "charge_counter", live(S), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "charge_counter", live(S)), live(refund)), rt.fv(f, "charge_max", live(S))])));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(4868, "/mob/living/simple_animal/hostile/construct/builder", "/mob/living/simple_animal/hostile/construct", {
	playstyle_string: "<b>You are an Artificer. You are incredibly weak and fragile, but you are able to construct fortifications, use magic missile, repair allied constructs, shades, and yourself (by clicking on them), <i>and, most important of all,</i> create new constructs by producing soulstones to capture souls, and shells to place those soulstones into.</b>",
	can_repair_constructs: 1,
	can_repair_self: 1,
	name: "Artificer",
	real_name: "Artificer",
	desc: "A bulbous construct dedicated to building and maintaining the Cult of Nar-Sie's armies.",
	icon_state: "artificer",
	icon_living: "artificer",
	maxHealth: 50,
	health: 50,
	response_harm: "viciously beats",
	harm_intent_damage: 5,
	obj_damage: 60,
	melee_damage_lower: 5,
	melee_damage_upper: 5,
	retreat_distance: 10,
	minimum_distance: 10,
	attacktext: "rams",
	environment_smash: 2,
	attack_sound: rt.rsc("sound/weapons/punch2.ogg"),
	construct_spells: null,
});

// /mob/living/simple_animal/hostile/construct/builder/proc/<init>  (code/modules/mob/living/simple_animal/constructs.dm:223)
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "construct_spells", rt.list(T("/obj/effect/proc_holder/spell/aoe_turf/conjure/wall"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/floor"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/construct/lesser"), T("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile/lesser")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/construct/builder/proc/Found  (code/modules/mob/living/simple_animal/constructs.dm:236)
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/Found", function Found(f: Frame, A: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(A), T("/mob/living/simple_animal/hostile/construct")) ? 1 : 0))) {
		if (rt.lt(rt.gv(f, "health", (C = live(A))), rt.fv(f, "maxHealth", live(C)))) {
			return 1;
		} else {
			return 0;
		}
	} else {
		return 0;
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/construct/builder/proc/CanAttack  (code/modules/mob/living/simple_animal/constructs.dm:246)
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/CanAttack", function CanAttack(f: Frame) {
	if (rt.lt(rt.sv(f, "see_invisible"), rt.fv(f, "invisibility", live(f.args[0])))) {
		return 0;
	}
	if (!(truthy(rt.callSrc(f, "Found", [live(f.args[0])])) || truthy(rt.callSuper(f, [], rt.Args.Same)))) return f.dot;
	return 1;
}, false, { args: ["the_target"] });

// /mob/living/simple_animal/hostile/construct/builder/proc/MoveToTarget  (code/modules/mob/living/simple_animal/constructs.dm:252)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/MoveToTarget", function* MoveToTarget(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) return f.dot;
	if ((truthy((rt.istype((L = rt.sv(f, "target")), T("/mob/living/simple_animal/hostile/construct")) ? 1 : 0)) && rt.ge(rt.fv(f, "health", live(L)), rt.fv(f, "maxHealth", live(L))))) {
		yield* g.srcCall(f, "LoseTarget");
		return 0;
	}
	if (!rt.le(rt.fv(f, "health", live(L)), add(rt.sv(f, "melee_damage_lower"), rt.sv(f, "melee_damage_upper")))) return f.dot;
	rt.setSv(f, "retreat_distance", null);
	rt.setSv(f, "minimum_distance", 1);
	return f.dot;
}, true, { args: ["possible_targets"] });

// /mob/living/simple_animal/hostile/construct/builder/proc/Aggro  (code/modules/mob/living/simple_animal/constructs.dm:263)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/Aggro", function* Aggro(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/simple_animal/hostile/construct")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "retreat_distance", null);
	rt.setSv(f, "minimum_distance", 1);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/construct/builder/proc/LoseAggro  (code/modules/mob/living/simple_animal/constructs.dm:269)
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/LoseAggro", function LoseAggro(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "retreat_distance", rt.initial(f, live(f.src), "retreat_distance"));
	rt.setSv(f, "minimum_distance", rt.initial(f, live(f.src), "minimum_distance"));
	return f.dot;
});

rt.type(4870, "/mob/living/simple_animal/hostile/construct/builder/noncult", "/mob/living/simple_animal/hostile/construct/builder", {
	construct_spells: null,
});

// /mob/living/simple_animal/hostile/construct/builder/noncult/proc/<init>  (code/modules/mob/living/simple_animal/constructs.dm:279)
rt.def("/mob/living/simple_animal/hostile/construct/builder/noncult/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "construct_spells", rt.list(T("/obj/effect/proc_holder/spell/aoe_turf/conjure/wall"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/floor"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone/noncult"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/construct/lesser"), T("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile/lesser")));
	return f.dot;
});

rt.type(4871, "/mob/living/simple_animal/hostile/construct/harvester", "/mob/living/simple_animal/hostile/construct", {
	playstyle_string: "<B>You are a Harvester. You are incapable of directly killing humans, but your attacks will remove their limbs: Bring those who still cling to this world of illusion back to the Geometer so they may know Truth. Your form and any you are pulling can pass through runed walls effortlessly.</B>",
	can_repair_constructs: 1,
	name: "Harvester",
	real_name: "Harvester",
	desc: "A long, thin construct built to herald Nar-Sie's rise. It'll be all over soon.",
	icon_state: "chosen",
	icon_living: "chosen",
	maxHealth: 60,
	health: 60,
	sight: 4,
	melee_damage_lower: 15,
	melee_damage_upper: 20,
	attacktext: "butchers",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	construct_spells: null,
});

// /mob/living/simple_animal/hostile/construct/harvester/proc/<init>  (code/modules/mob/living/simple_animal/constructs.dm:300)
rt.def("/mob/living/simple_animal/hostile/construct/harvester/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "construct_spells", rt.list(T("/obj/effect/proc_holder/spell/aoe_turf/area_conversion"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/lesserforcewall")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/construct/harvester/proc/Bump  (code/modules/mob/living/simple_animal/constructs.dm:308)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/harvester/proc/Bump", function* Bump(f: Frame) {
	let stored_pulling: Value = null;
	f.vars = () => [stored_pulling];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy((rt.istype(live(f.args[0]), T("/turf/closed/wall/mineral/cult")) ? 1 : 0)) && !isEqual(live(f.args[0]), rt.sv(f, "loc")))) return f.dot;
	if (truthy((stored_pulling = rt.sv(f, "pulling")))) {
		yield* g.callName(f, live(stored_pulling), "setDir", [rt.getDir(f, rt.fv(f, "loc", live(stored_pulling)), rt.sv(f, "loc"))]);
		yield* g.callName(f, live(stored_pulling), "forceMove", [rt.sv(f, "loc")]);
	}
	yield* g.srcCall(f, "forceMove", live(f.args[0]));
	if (!truthy(live(stored_pulling))) return f.dot;
	yield* g.srcCall(f, "start_pulling", live(stored_pulling), 1);
	return f.dot;
}, true, { args: ["AM"] });

// /mob/living/simple_animal/hostile/construct/harvester/proc/AttackingTarget  (code/modules/mob/living/simple_animal/constructs.dm:319)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/harvester/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null, parts: Value = null, undismembermerable_limbs: Value = null, X: Value = null, BP: Value = null, BP_3: Value = null;
	let $e: any;
	f.vars = () => [C, parts, undismembermerable_limbs, X, BP, BP_3, $e];
	if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon")) ? 1 : 0))) {
		C = rt.sv(f, "target");
		parts = rt.list();
		undismembermerable_limbs = 0;
		X = null;
		rt.forList(f, 0, rt.fv(f, "bodyparts", live(C)));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			if ((!isEqual(rt.gv(f, "body_part", (BP = live(X))), 1) && !isEqual(rt.fv(f, "body_part", live(BP)), 2))) {
				if (truthy(rt.fv(f, "dismemberable", live(BP)))) {
					parts = rt.modify(live(parts), live(BP), add);
				} else {
					undismembermerable_limbs = rt.inc(live(undismembermerable_limbs), 1);
				}
			}
		}
		rt.endFor(f, 0);
		if (!truthy(rt.length(live(parts)))) {
			if (truthy(live(undismembermerable_limbs))) {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
			yield* g.callName(f, live(C), "Knockdown", [60]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ knocks ＀ down!</span>", [live(f.src), live(C)]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='cultlarge'>\"Bring ＀ to me.\"</span>", [(yield* g.callName(f, live(C), "p_them", []))])]);
			return 0;
		}
		yield* g.srcCall(f, "do_attack_animation", live(C));
		yield* g.callName(f, (BP_3 = rt.op(f, "PickUnweighted", [1], [live(parts)])), "dismember", []);
		return 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/construct/harvester/proc/Initialize  (code/modules/mob/living/simple_animal/constructs.dm:344)  may sleep
rt.def("/mob/living/simple_animal/hostile/construct/harvester/proc/Initialize", function* Initialize(f: Frame) {
	let seek: Value = null;
	f.vars = () => [seek];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (seek = (yield* g.new_(f, T("/datum/action/innate/seek_prey"), []))), "Grant", [live(f.src)]);
	yield* g.callName(f, live(seek), "Activate", []);
	return f.dot;
}, true);

rt.type(163, "/datum/action/innate/seek_master", "/datum/action/innate", {
	tracking: 0,
	the_construct: null,
	name: "Seek your Master",
	desc: "You and your master share a soul-link that informs you of their location",
	background_icon_state: "bg_demon",
	buttontooltipstyle: "cult",
	button_icon_state: "cult_mark",
});

// /datum/action/innate/seek_master/proc/Grant  (code/modules/mob/living/simple_animal/constructs.dm:362)  may sleep
rt.def("/datum/action/innate/seek_master/proc/Grant", function* Grant(f: Frame) {
	rt.setSv(f, "the_construct", live(f.args[0]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C"] });

// /datum/action/innate/seek_master/proc/Activate  (code/modules/mob/living/simple_animal/constructs.dm:366)
rt.def("/datum/action/innate/seek_master/proc/Activate", function Activate(f: Frame) {
	if (!truthy(rt.gv(f, "eldergod", rt.fv(f, "mode", rt.gl("SSticker"))))) {
		rt.setFv(f, "master", rt.sv(f, "the_construct"), rt.gl("blood_target"));
	}
	if (!truthy(rt.fv(f, "master", rt.sv(f, "the_construct")))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "the_construct"), "<span class='cultitalic'>You have no master to seek!</span>"]);
		rt.setFv(f, "seeking", rt.sv(f, "the_construct"), 0);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "tracking"))) {
		rt.setSv(f, "tracking", 0);
		rt.setFv(f, "seeking", rt.sv(f, "the_construct"), 0);
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "the_construct"), "<span class='cultitalic'>You are no longer tracking your master.</span>"]);
		return live(f.dot);
	} else {
		rt.setSv(f, "tracking", 1);
		rt.setFv(f, "seeking", rt.sv(f, "the_construct"), 1);
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "the_construct"), "<span class='cultitalic'>You are now tracking your master.</span>"]);
	}
	return f.dot;
});

rt.type(164, "/datum/action/innate/seek_prey", "/datum/action/innate", {
	the_construct: null,
	name: "Seek the Harvest",
	desc: "None can hide from Nar'Sie, activate to track a survivor attempting to flee the red harvest!",
	background_icon_state: "bg_demon",
	buttontooltipstyle: "cult",
	button_icon_state: "cult_mark",
});

// /datum/action/innate/seek_prey/proc/Grant  (code/modules/mob/living/simple_animal/constructs.dm:392)  may sleep
rt.def("/datum/action/innate/seek_prey/proc/Grant", function* Grant(f: Frame) {
	rt.setSv(f, "the_construct", live(f.args[0]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C"] });

// /datum/action/innate/seek_prey/proc/Activate  (code/modules/mob/living/simple_animal/constructs.dm:396)
rt.def("/datum/action/innate/seek_prey/proc/Activate", function Activate(f: Frame) {
	if (rt.gl("cult_narsie") === null) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "seeking", rt.sv(f, "the_construct")))) {
		rt.setSv(f, "desc", "None can hide from Nar'Sie, activate to track a survivor attempting to flee the red harvest!");
		rt.setSv(f, "button_icon_state", "cult_mark");
		rt.setFv(f, "seeking", rt.sv(f, "the_construct"), 0);
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "the_construct"), "<span class='cultitalic'>You are now tracking Nar'Sie, return to reap the harvest!</span>"]);
		return live(f.dot);
	} else {
		if (truthy(rt.length(rt.fv(f, "souls_needed", rt.gl("cult_narsie"))))) {
			rt.setFv(f, "master", rt.sv(f, "the_construct"), rt.op(f, "PickUnweighted", [1], [rt.fv(f, "souls_needed", rt.gl("cult_narsie"))]));
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "the_construct"), fmt("<span class='cultitalic'>You are now tracking your prey, ＀ - harvest them!</span>", [rt.fv(f, "master", rt.sv(f, "the_construct"))])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "the_construct"), "<span class='cultitalic'>Nar'Sie has completed her harvest!</span>"]);
			return live(f.dot);
		}
		rt.setSv(f, "desc", "Activate to track Nar'Sie!");
		rt.setSv(f, "button_icon_state", "sintouch");
		rt.setFv(f, "seeking", rt.sv(f, "the_construct"), 1);
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/construct/proc/update_health_hud  (code/modules/mob/living/simple_animal/constructs.dm:420)
rt.def("/mob/living/simple_animal/hostile/construct/proc/update_health_hud", function update_health_hud(f: Frame) {
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	if (rt.ge(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
		rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), fmt("＀_health0", [rt.sv(f, "icon_state")]));
	} else {
		if (rt.gt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.800000011920929))) {
			rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), fmt("＀_health2", [rt.sv(f, "icon_state")]));
		} else {
			if (rt.gt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.6000000238418579))) {
				rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), fmt("＀_health3", [rt.sv(f, "icon_state")]));
			} else {
				if (rt.gt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.4000000059604645))) {
					rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), fmt("＀_health4", [rt.sv(f, "icon_state")]));
				} else {
					if (rt.gt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.20000000298023224))) {
						rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), fmt("＀_health5", [rt.sv(f, "icon_state")]));
					} else {
						rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), fmt("＀_health6", [rt.sv(f, "icon_state")]));
					}
				}
			}
		}
	}
	return f.dot;
});
