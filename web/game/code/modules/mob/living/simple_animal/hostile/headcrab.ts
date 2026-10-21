// From code/modules/mob/living/simple_animal/hostile/headcrab.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4957, "/mob/living/simple_animal/hostile/headcrab", "/mob/living/simple_animal/hostile", {
	origin: null,
	egg_lain: 0,
	name: "headslug",
	desc: "Absolutely not de-beaked or harmless. Keep away from corpses.",
	icon_state: "headcrab",
	icon_living: "headcrab",
	icon_dead: "headcrab_dead",
	gender: "neuter",
	health: 50,
	maxHealth: 50,
	melee_damage_lower: 5,
	melee_damage_upper: 5,
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	faction: null,
	robust_searching: 1,
	stat_attack: 2,
	obj_damage: 0,
	environment_smash: 0,
	speak_emote: null,
	ventcrawler: 2,
	gold_core_spawnable: 1,
});

// /mob/living/simple_animal/hostile/headcrab/proc/<init>  (code/modules/mob/living/simple_animal/hostile/headcrab.dm:16)
rt.def("/mob/living/simple_animal/hostile/headcrab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("creature"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("squeaks"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/headcrab/proc/Infect  (code/modules/mob/living/simple_animal/hostile/headcrab.dm:28)  may sleep
rt.def("/mob/living/simple_animal/hostile/headcrab/proc/Infect", function* Infect(f: Frame, victim: Value) {
	let egg: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [victim, egg, I, $e];
	yield* g.callName(f, (egg = (yield* g.new_(f, T("/obj/item/organ/body_egg/changeling_egg"), [live(victim)]))), "Insert", [live(victim)]);
	if (truthy(rt.sv(f, "origin"))) {
		rt.setFv(f, "origin", live(egg), rt.sv(f, "origin"));
	} else {
		if (truthy(rt.sv(f, "mind"))) {
			rt.setFv(f, "origin", live(egg), rt.sv(f, "mind"));
		}
	}
	I = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/organ"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.setFv(f, "loc", live(I), live(egg));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ plants something in ＀'s flesh!</span>", [live(f.src), live(victim)]), fmt("<span class='danger'>We inject our egg into ＀'s body!</span>", [live(victim)]));
	rt.setSv(f, "egg_lain", 1);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/headcrab/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/headcrab.dm:41)  may sleep
rt.def("/mob/living/simple_animal/hostile/headcrab/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(((truthy(live(f.dot)) && !truthy(rt.sv(f, "egg_lain"))) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon")) ? 1 : 0))) && !truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon/monkey")) ? 1 : 0)))) return f.dot;
	if (!isEqual(rt.gv(f, "stat", (C = rt.sv(f, "target"))), 2)) return f.dot;
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(C)), 32768))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>A foreign presence repels us from this body. Perhaps we should try to infest another?</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "Infect", rt.sv(f, "target"));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>With our egg laid, our death approaches rapidly...</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/proc/death")])), 100]);
	return f.dot;
}, true);

rt.type(9459, "/obj/item/organ/body_egg/changeling_egg", "/obj/item/organ/body_egg", {
	origin: null,
	time: null,
	name: "changeling egg",
	desc: "Twitching and disgusting.",
	origin_tech: "biotech=7",
});

// /obj/item/organ/body_egg/changeling_egg/proc/egg_process  (code/modules/mob/living/simple_animal/hostile/headcrab.dm:62)  may sleep
rt.def("/obj/item/organ/body_egg/changeling_egg/proc/egg_process", function* egg_process(f: Frame) {
	rt.incSrcVar(f, "time", 1, true);
	if (!rt.ge(rt.sv(f, "time"), 120)) return f.dot;
	yield* g.srcCall(f, "Pop");
	yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/organ/body_egg/changeling_egg/proc/Pop  (code/modules/mob/living/simple_animal/hostile/headcrab.dm:69)  may sleep
rt.def("/obj/item/organ/body_egg/changeling_egg/proc/Pop", function* Pop(f: Frame) {
	let M: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [M, I, $e];
	M = (yield* g.new_(f, T("/mob/living/carbon/monkey"), [rt.sv(f, "owner")]));
	rt.modField(f, rt.sv(f, "owner"), "stomach_contents", live(M), add);
	I = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/organ"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(I), "Insert", [live(M), 1]);
	}
	rt.endFor(f, 0);
	if (((truthy(rt.sv(f, "origin")) && truthy(rt.fv(f, "current", rt.sv(f, "origin")))) && isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "origin"))), 2))) {
		yield* g.callName(f, rt.sv(f, "origin"), "transfer_to", [live(M)]);
		if (!truthy(rt.fv(f, "changeling", rt.sv(f, "origin")))) {
			yield* g.callName(f, live(M), "make_changeling", []);
		}
		if (truthy((yield* g.callName(f, rt.fv(f, "changeling", rt.sv(f, "origin")), "can_absorb_dna", [live(M), rt.sv(f, "owner")])))) {
			yield* g.callName(f, rt.fv(f, "changeling", rt.sv(f, "origin")), "add_new_profile", [rt.sv(f, "owner"), live(M)]);
		}
		rt.modField(f, rt.fv(f, "changeling", rt.sv(f, "origin")), "purchasedpowers", (yield* g.new_(f, T("/obj/effect/proc_holder/changeling/humanform"), [null])), add);
		rt.setFv(f, "key", live(M), rt.fv(f, "key", rt.sv(f, "origin")));
	}
	yield* g.callName(f, rt.sv(f, "owner"), "gib", []);
	return f.dot;
}, true);
