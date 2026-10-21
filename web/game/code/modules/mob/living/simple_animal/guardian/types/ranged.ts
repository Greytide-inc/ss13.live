// From code/modules/mob/living/simple_animal/guardian/types/ranged.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4880, "/mob/living/simple_animal/hostile/guardian/ranged", "/mob/living/simple_animal/hostile/guardian", {
	snares: null,
	toggle: 0,
	range: 13,
	playstyle_string: "<span class='holoparasite'>As a <b>ranged</b> type, you have only light damage resistance, but are capable of spraying shards of crystal at incredibly high speed. You can also deploy surveillance snares to monitor enemy movement. Finally, you can switch to scout mode, in which you can't attack, but can move without limit.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Sentinel, an alien master of ranged combat.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Ranged combat modules active. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! Caught one, it's a ranged carp. This fishy can watch people pee in the ocean.</span>",
	a_intent: "help",
	friendly: "quietly assesses",
	melee_damage_lower: 10,
	melee_damage_upper: 10,
	damage_coeff: null,
	projectiletype: rt.typePath("/obj/item/projectile/guardian"),
	ranged_cooldown_time: 1,
	projectilesound: rt.rsc("sound/effects/hit_on_shattered_glass.ogg"),
	ranged: 1,
	see_invisible: 25,
	see_in_dark: 8,
	toggle_button_type: rt.typePath("/obj/screen/guardian/ToggleMode"),
});

// /mob/living/simple_animal/hostile/guardian/ranged/proc/<init>  (code/modules/mob/living/simple_animal/guardian/types/ranged.dm:27)
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "snares", rt.list());
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.8999999761581421, "fire", 0.8999999761581421, "tox", 0.8999999761581421, "clone", 0.8999999761581421, "stamina", 0, "oxy", 0.8999999761581421]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/ranged/proc/ToggleMode  (code/modules/mob/living/simple_animal/guardian/types/ranged.dm:31)
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/proc/ToggleMode", function ToggleMode(f: Frame) {
	if (isEqual(rt.fv(f, "loc", live(f.src)), rt.sv(f, "summoner"))) {
		if (truthy(rt.sv(f, "toggle"))) {
			rt.setSv(f, "ranged", rt.initial(f, live(f.src), "ranged"));
			rt.setSv(f, "melee_damage_lower", rt.initial(f, live(f.src), "melee_damage_lower"));
			rt.setSv(f, "melee_damage_upper", rt.initial(f, live(f.src), "melee_damage_upper"));
			rt.setSv(f, "obj_damage", rt.initial(f, live(f.src), "obj_damage"));
			rt.setSv(f, "environment_smash", rt.initial(f, live(f.src), "environment_smash"));
			rt.setSv(f, "alpha", 255);
			rt.setSv(f, "range", rt.initial(f, live(f.src), "range"));
			rt.setSv(f, "incorporeal_move", 0);
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You switch to combat mode.</span></B>"]);
			rt.setSv(f, "toggle", 0);
		} else {
			rt.setSv(f, "ranged", 0);
			rt.setSv(f, "melee_damage_lower", 0);
			rt.setSv(f, "melee_damage_upper", 0);
			rt.setSv(f, "obj_damage", 0);
			rt.setSv(f, "environment_smash", 0);
			rt.setSv(f, "alpha", 45);
			rt.setSv(f, "range", 255);
			rt.setSv(f, "incorporeal_move", 1);
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You switch to scout mode.</span></B>"]);
			rt.setSv(f, "toggle", 1);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You have to be recalled to toggle modes!</span></B>"]);
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/ranged/proc/Shoot  (code/modules/mob/living/simple_animal/guardian/types/ranged.dm:58)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/proc/Shoot", function* Shoot(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.dot), T("/obj/item/projectile")) ? 1 : 0))) return f.dot;
	_P = live(f.dot);
	if (!truthy(rt.sv(f, "namedatum"))) return f.dot;
	rt.setFv(f, "color", live(_P), rt.fv(f, "colour", rt.sv(f, "namedatum")));
	return f.dot;
}, true, { args: ["targeted_atom"] });

// /mob/living/simple_animal/hostile/guardian/ranged/proc/ToggleLight  (code/modules/mob/living/simple_animal/guardian/types/ranged.dm:66)
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/proc/ToggleLight", function ToggleLight(f: Frame) {
	let msg: Value = null;
	let $0: any;
	f.vars = () => [msg, $0];
	msg = null;
	$0 = rt.sv(f, "lighting_alpha");
	if ($0 === 255) {
		rt.setSv(f, "lighting_alpha", 192);
		msg = "You activate your night vision.";
	} else if ($0 === 192) {
		rt.setSv(f, "lighting_alpha", 128);
		msg = "You increase your night vision.";
	} else if ($0 === 128) {
		rt.setSv(f, "lighting_alpha", 0);
		msg = "You maximize your night vision.";
	} else {
		rt.setSv(f, "lighting_alpha", 255);
		msg = "You deactivate your night vision.";
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>＀</span>", [live(msg)])]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/ranged/verb/Snare  (code/modules/mob/living/simple_animal/guardian/types/ranged.dm:87)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/verb/Snare", function* Snare(f: Frame) {
	let snare_loc: Value = null, S: Value = null;
	f.vars = () => [snare_loc, S];
	if (rt.lt(rt.getLen(f, rt.fv(f, "snares", live(f.src))), 6)) {
		snare_loc = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0);
		rt.setFv(f, "spawner", (S = (yield* g.new_(f, T("/obj/effect/snare"), [live(snare_loc)]))), live(f.src));
		rt.setFv(f, "name", live(S), fmt("＀ snare (＀)", [(yield* g.call(f, P("/proc/get_area"), null, [live(snare_loc)])), (yield* g.call(f, P("/proc/rand"), null, [1, 1000]))]));
		(rt.modField(f, live(f.src), "snares", live(S), rt.bitOr));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>Surveillance snare deployed!</span></B>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You have too many snares deployed. Remove some first.</span></B>"]);
	}
	return f.dot;
}, true, { verb: { name: "Set Surveillance Snare", category: "Guardian", desc: "Set an invisible snare that will alert you when living creatures walk over it. Max of 5" } });

// /mob/living/simple_animal/hostile/guardian/ranged/verb/DisarmSnare  (code/modules/mob/living/simple_animal/guardian/types/ranged.dm:101)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/verb/DisarmSnare", function* DisarmSnare(f: Frame) {
	let picked_snare: Value = null;
	f.vars = () => [picked_snare];
	if (!truthy((picked_snare = (yield* g.op(f, "Prompt", [1], [null, "Remove Snare", "Pick which snare to remove", live(f.src), rt.fv(f, "snares", live(f.src))]))))) return f.dot;
	(rt.modField(f, live(f.src), "snares", live(picked_snare), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [live(picked_snare)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>Snare disarmed.</span></B>"]);
	return f.dot;
}, true, { verb: { name: "Remove Surveillance Snare", category: "Guardian", desc: "Disarm unwanted surveillance snares." } });

rt.type(12085, "/obj/effect/snare", "/obj/effect", {
	spawner: null,
	name: "snare",
	desc: "You shouldn't be seeing this!",
	invisibility: 101,
});

// /obj/effect/snare/proc/Crossed  (code/modules/mob/living/simple_animal/guardian/types/ranged.dm:115)
rt.def("/obj/effect/snare/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	let guardians: Value = null, para: Value = null;
	let $e: any;
	f.vars = () => [guardians, para, $e];
	if (!((((truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0)) && truthy(rt.sv(f, "spawner"))) && truthy(rt.fv(f, "summoner", rt.sv(f, "spawner")))) && !isEqual(live(AM), rt.sv(f, "spawner"))) && !truthy(rt.callName(f, rt.sv(f, "spawner"), "hasmatchingsummoner", [live(AM)])))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "summoner", rt.sv(f, "spawner")), fmt("<span class='danger'><B>＀ has crossed surveillance snare, ＀.</span></B>", [live(AM), rt.sv(f, "name")])]);
	guardians = rt.callName(f, rt.fv(f, "summoner", rt.sv(f, "spawner")), "hasparasites", []);
	para = null;
	rt.forList(f, 0, live(guardians));
	while (($e = rt.next(f, 0)) !== undefined) {
		para = $e;
		rt.call(f, P("/proc/to_chat"), null, [live(para), fmt("<span class='danger'><B>＀ has crossed surveillance snare, ＀.</span></B>", [live(AM), rt.sv(f, "name")])]);
	}
	rt.endFor(f, 0);
	return f.dot;
});
