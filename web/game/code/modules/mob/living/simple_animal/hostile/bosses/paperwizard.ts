// From code/modules/mob/living/simple_animal/hostile/bosses/paperwizard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5019, "/mob/living/simple_animal/hostile/boss/paper_wizard", "/mob/living/simple_animal/hostile/boss", {
	copies: null,
	boss_abilities: null,
	ranged: 1,
	minimum_distance: 3,
	retreat_distance: 3,
	projectilesound: rt.rsc("sound/weapons/emitter.ogg"),
	name: "Mjor the Creative",
	desc: "A wizard with a taste for the arts.",
	faction: null,
	del_on_death: 1,
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "paperwizard",
	environment_smash: 0,
	obj_damage: 0,
	melee_damage_lower: 10,
	melee_damage_upper: 20,
	health: 1000,
	maxHealth: 1000,
	loot: null,
	projectiletype: rt.typePath("/obj/item/projectile/temp"),
	attack_sound: rt.rsc("sound/hallucinations/growl1.ogg"),
});

// /mob/living/simple_animal/hostile/boss/paper_wizard/proc/<init>  (code/modules/mob/living/simple_animal/hostile/bosses/paperwizard.dm:5)
rt.def("/mob/living/simple_animal/hostile/boss/paper_wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "boss_abilities", rt.list(T("/datum/action/boss/wizard_summon_minions"), T("/datum/action/boss/wizard_mimic")));
	$0 = $0;
	rt.setSv(f, "copies", rt.list());
	rt.setSv(f, "faction", rt.list("hostile", "stickman"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/temp_visual/paperwiz_dying")));
	return f.dot;
});

rt.type(268, "/datum/action/boss/wizard_summon_minions", "/datum/action/boss", {
	name: "Summon Minions",
	button_icon_state: "art_summon",
	usage_probability: 40,
	boss_cost: 30,
	needs_target: 0,
	say_when_triggered: "Rise, my creations! Jump off your pages and into this realm!",
	boss_type: rt.typePath("/mob/living/simple_animal/hostile/boss/paper_wizard"),
}, { global: { summoned_minions: 628 } });

// /datum/action/boss/wizard_summon_minions/proc/Trigger  (code/modules/mob/living/simple_animal/hostile/bosses/paperwizard.dm:39)  may sleep
rt.def("/datum/action/boss/wizard_summon_minions/proc/Trigger", function* Trigger(f: Frame) {
	let minions: Value = null, directions: Value = null, i: Value = null, minions_chosen: Value = null;
	let $e: any;
	f.vars = () => [minions, directions, i, minions_chosen, $e];
	if (!(rt.le(rt.gl("summoned_minions"), 6) && truthy((yield* g.callSuper(f, [], rt.Args.Same))))) return f.dot;
	minions = rt.list(T("/mob/living/simple_animal/hostile/stickman"), T("/mob/living/simple_animal/hostile/stickman/ranged"), T("/mob/living/simple_animal/hostile/stickman/dog"));
	directions = (yield* g.callName(f, rt.gl("cardinal"), "Copy", []));
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		minions_chosen = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(minions)]));
		yield* g.new_(f, live(minions_chosen), [rt.getStep(f, rt.sv(f, "boss"), (yield* g.call(f, P("/proc/pick_n_take"), null, [live(directions)]))), 1]);
	}
	rt.endFor(f, 0);
	rt.modGl("summoned_minions", 3, add);
	return f.dot;
}, true);

rt.type(269, "/datum/action/boss/wizard_mimic", "/datum/action/boss", {
	name: "Craft Mimicry",
	button_icon_state: "mimic_summon",
	usage_probability: 30,
	boss_cost: 40,
	say_when_triggered: "",
	boss_type: rt.typePath("/mob/living/simple_animal/hostile/boss/paper_wizard"),
});

// /datum/action/boss/wizard_mimic/proc/Trigger  (code/modules/mob/living/simple_animal/hostile/bosses/paperwizard.dm:64)  may sleep
rt.def("/datum/action/boss/wizard_mimic/proc/Trigger", function* Trigger(f: Frame) {
	let target: Value = null, threats: Value = null, wiz: Value = null, directions: Value = null, i: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [target, threats, wiz, directions, i, C, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	target = null;
	if (!truthy(rt.fv(f, "client", rt.sv(f, "boss")))) {
		target = rt.fv(f, "target", rt.sv(f, "boss"));
	} else {
		if (truthy(rt.getLen(f, (threats = (yield* g.callName(f, rt.sv(f, "boss"), "PossibleThreats", [])))))) {
			target = rt.op(f, "PickUnweighted", [1], [live(threats)]);
		}
	}
	if (truthy(live(target))) {
		wiz = rt.sv(f, "boss");
		directions = (yield* g.callName(f, rt.gl("cardinal"), "Copy", []));
		i = null;
		rt.forRange(f, 0, 1, 3, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			C = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/boss/paper_wizard/copy"), [rt.getStep(f, live(target), (yield* g.call(f, P("/proc/pick_n_take"), null, [live(directions)])))]));
			rt.modField(f, live(wiz), "copies", live(C), add);
			rt.setFv(f, "original", live(C), live(wiz));
			yield* g.callName(f, live(C), "say", ["My craft defines me, you could even say it IS me!"]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(wiz), "say", ["My craft defines me, you could even say it IS me!"]);
		yield* g.callName(f, live(wiz), "forceMove", [rt.getStep(f, live(target), (yield* g.call(f, P("/proc/pick_n_take"), null, [live(directions)])))]);
		rt.setFv(f, "minimum_distance", live(wiz), 1);
		rt.setFv(f, "retreat_distance", live(wiz), 0);
	} else {
		yield* g.callName(f, rt.fv(f, "atb", rt.sv(f, "boss")), "refund", [rt.sv(f, "boss_cost")]);
	}
	return f.dot;
}, true);

rt.type(5020, "/mob/living/simple_animal/hostile/boss/paper_wizard/copy", "/mob/living/simple_animal/hostile/boss/paper_wizard", {
	original: null,
	boss_abilities: null,
	minimum_distance: 0,
	retreat_distance: 0,
	ranged: 0,
	desc: "tis a ruse!",
	health: 1,
	maxHealth: 1,
	alpha: 200,
	melee_damage_lower: 1,
	melee_damage_upper: 5,
	loot: null,
});

// /mob/living/simple_animal/hostile/boss/paper_wizard/copy/proc/<init>  (code/modules/mob/living/simple_animal/hostile/bosses/paperwizard.dm:92)
rt.def("/mob/living/simple_animal/hostile/boss/paper_wizard/copy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "boss_abilities", rt.list());
	$0 = $0;
	rt.setSv(f, "loot", rt.list());
	return f.dot;
});

// /mob/living/simple_animal/hostile/boss/paper_wizard/copy/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/bosses/paperwizard.dm:103)  may sleep
rt.def("/mob/living/simple_animal/hostile/boss/paper_wizard/copy/proc/adjustHealth", function* adjustHealth(f: Frame) {
	let c: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [c, L, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (rt.gt(live(f.args[0]), 0)) {
		if (truthy(rt.sv(f, "original"))) {
			rt.setFv(f, "minimum_distance", rt.sv(f, "original"), 3);
			rt.setFv(f, "retreat_distance", rt.sv(f, "original"), 3);
			(rt.modField(f, rt.sv(f, "original"), "copies", live(f.src), subtract));
			c = null;
			rt.forList(f, 0, rt.fv(f, "copies", rt.sv(f, "original")));
			while (($e = rt.next(f, 0)) !== undefined) {
				c = $e;
				yield* g.call(f, P("/proc/qdel"), null, [live(c)]);
			}
			rt.endFor(f, 0);
		}
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [5, live(f.src)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if ((isEqual(live(L), rt.sv(f, "original")) || truthy(rt.op(f, "IsType", [], [live(L), rt.sv(f, "type")])))) {
				continue;
			}
			yield* g.callName(f, live(L), "adjustBruteLoss", [50]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/boss/paper_wizard/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/bosses/paperwizard.dm:120)  may sleep
rt.def("/mob/living/simple_animal/hostile/boss/paper_wizard/proc/adjustHealth", function* adjustHealth(f: Frame) {
	let copy: Value = null;
	let $e: any;
	f.vars = () => [copy, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!rt.gt(live(f.dot), 0)) return f.dot;
	rt.setSv(f, "minimum_distance", 3);
	rt.setSv(f, "retreat_distance", 3);
	copy = null;
	rt.forList(f, 0, rt.sv(f, "copies"));
	while (($e = rt.next(f, 0)) !== undefined) {
		copy = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(copy)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/boss/paper_wizard/copy/proc/examine  (code/modules/mob/living/simple_animal/hostile/bosses/paperwizard.dm:128)  may sleep
rt.def("/mob/living/simple_animal/hostile/boss/paper_wizard/copy/proc/examine", function* examine(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(11676, "/obj/effect/temp_visual/paperwiz_dying", "/obj/effect/temp_visual", {
	anchored: 1,
	duration: 18,
	randomdir: 0,
	name: "craft portal",
	desc: "A wormhole sucking the wizard into the void. Neat.",
	layer: 2.04,
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "paperwiz_poof",
});

// /obj/effect/temp_visual/paperwiz_dying/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/bosses/paperwizard.dm:153)  may sleep
rt.def("/obj/effect/temp_visual/paperwiz_dying/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "visible_message", "<span class='boldannounce'>The wizard cries out in pain as a gate appears behind him, sucking him in!</span>");
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/mandswap.ogg"), 50, 1, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/hallucinations/wail.ogg"), 50, 1, 1]);
	return f.dot;
}, true);

// /obj/effect/temp_visual/paperwiz_dying/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/bosses/paperwizard.dm:159)  may sleep
rt.def("/obj/effect/temp_visual/paperwiz_dying/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [M, _T, $e];
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [7, live(f.src)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/shake_camera"), null, [live(M), 7, 1]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/playsound"), null, [(_T = rt.getStep(f, live(f.src), 0)), rt.rsc("sound/magic/summon_magic.ogg"), 50, 1, 1]);
	yield* g.new_(f, T("/obj/effect/temp_visual/paper_scatter"), [live(_T)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/wizrobe/paper"), [live(_T)]);
	yield* g.new_(f, T("/obj/item/clothing/head/collectable/paper"), [live(_T)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
