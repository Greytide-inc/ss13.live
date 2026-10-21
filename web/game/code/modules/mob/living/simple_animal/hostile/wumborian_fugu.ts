// From code/modules/mob/living/simple_animal/hostile/wumborian_fugu.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4999, "/mob/living/simple_animal/hostile/asteroid/fugu", "/mob/living/simple_animal/hostile/asteroid", {
	wumbo: 0,
	inflate_cooldown: 0,
	move_to_delay: 5,
	vision_range: 5,
	aggro_vision_range: 9,
	idle_vision_range: 5,
	name: "wumborian fugu",
	desc: "The wumborian fugu rapidly increases its body mass in order to ward off its prey. Great care should be taken to avoid it while it's in this state as it is nearly invincible, but it cannot maintain its form forever.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "Fugu",
	icon_living: "Fugu",
	icon_aggro: "Fugu",
	icon_dead: "Fugu_dead",
	icon_gib: "syndicate_gib",
	mouse_opacity: 2,
	friendly: "floats near",
	speak_emote: null,
	speed: 0,
	maxHealth: 50,
	health: 50,
	harm_intent_damage: 5,
	obj_damage: 0,
	melee_damage_lower: 0,
	melee_damage_upper: 0,
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	throw_message: "is avoided by the",
	mob_size: 1,
	environment_smash: 0,
	loot: null,
});

// /mob/living/simple_animal/hostile/asteroid/fugu/proc/<init>  (code/modules/mob/living/simple_animal/hostile/wumborian_fugu.dm:14)
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("puffs"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/asteroid/fugu_gland")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/fugu/proc/Life  (code/modules/mob/living/simple_animal/hostile/wumborian_fugu.dm:35)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/Life", function* Life(f: Frame) {
	if (!truthy(rt.sv(f, "wumbo"))) {
		rt.setSv(f, "inflate_cooldown", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "inflate_cooldown"), 1), 0])));
	}
	if ((truthy(rt.sv(f, "target")) && isEqual(rt.sv(f, "AIStatus"), 1))) {
		yield* g.srcCall(f, "Inflate");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/asteroid/fugu/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/wumborian_fugu.dm:42)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((!truthy(live(f.args[2])) && truthy(rt.sv(f, "wumbo")))) {
		return 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/asteroid/fugu/proc/Aggro  (code/modules/mob/living/simple_animal/hostile/wumborian_fugu.dm:47)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/Aggro", function* Aggro(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "Inflate");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/asteroid/fugu/verb/Inflate  (code/modules/mob/living/simple_animal/hostile/wumborian_fugu.dm:55)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/verb/Inflate", function* Inflate(f: Frame) {
	if (truthy(rt.sv(f, "wumbo"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You're already inflated.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "inflate_cooldown"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>We need time to gather our strength.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "buffed"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Something is interfering with our growth.</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "wumbo", 1);
	rt.setSv(f, "icon_state", "Fugu_big");
	rt.setSv(f, "obj_damage", 60);
	rt.setSv(f, "melee_damage_lower", 15);
	rt.setSv(f, "melee_damage_upper", 20);
	rt.setSv(f, "harm_intent_damage", 0);
	rt.setSv(f, "throw_message", "is absorbed by the girth of the");
	rt.setSv(f, "retreat_distance", null);
	rt.setSv(f, "minimum_distance", 1);
	rt.setSv(f, "move_to_delay", 6);
	(rt.modSrcVar(f, "transform", 2, multiply));
	rt.setSv(f, "environment_smash", 2);
	rt.setSv(f, "mob_size", 3);
	rt.setSv(f, "speed", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/asteroid/fugu/proc/Deflate")])), 100]);
	return f.dot;
}, true, { verb: { name: "Inflate", category: "Fugu", desc: "Temporarily increases your size, and makes you significantly more dangerous and tough." } });

// /mob/living/simple_animal/hostile/asteroid/fugu/proc/Deflate  (code/modules/mob/living/simple_animal/hostile/wumborian_fugu.dm:81)
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/Deflate", function Deflate(f: Frame) {
	if (!truthy(rt.sv(f, "wumbo"))) return f.dot;
	rt.call(f, P("/proc/walk"), null, [live(f.src), 0]);
	rt.setSv(f, "wumbo", 0);
	rt.setSv(f, "icon_state", "Fugu");
	rt.setSv(f, "obj_damage", 0);
	rt.setSv(f, "melee_damage_lower", 0);
	rt.setSv(f, "melee_damage_upper", 0);
	rt.setSv(f, "harm_intent_damage", 5);
	rt.setSv(f, "throw_message", "is avoided by the");
	rt.setSv(f, "retreat_distance", 9);
	rt.setSv(f, "minimum_distance", 9);
	rt.setSv(f, "move_to_delay", 2);
	(rt.modSrcVar(f, "transform", 2, divide));
	rt.setSv(f, "inflate_cooldown", 4);
	rt.setSv(f, "environment_smash", 0);
	rt.setSv(f, "mob_size", 1);
	rt.setSv(f, "speed", 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/fugu/proc/death  (code/modules/mob/living/simple_animal/hostile/wumborian_fugu.dm:99)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/fugu/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	yield* g.srcCall(f, "Deflate");
	yield* g.callSuper(f, [live(gibbed)]);
	return f.dot;
}, true);

rt.type(10132, "/obj/item/asteroid/fugu_gland", "/obj/item/asteroid", {
	banned_mobs: null,
	flags: 4,
	w_class: 3,
	origin_tech: "biotech=6",
	name: "wumborian fugu gland",
	desc: "The key to the wumborian fugu's ability to increase its mass arbitrarily, this disgusting remnant can apply the same effect to other creatures, giving them great strength.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "fugu_gland",
	layer: 4,
});

// /obj/item/asteroid/fugu_gland/proc/afterattack  (code/modules/mob/living/simple_animal/hostile/wumborian_fugu.dm:114)  may sleep
rt.def("/obj/item/asteroid/fugu_gland/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let A: Value = null;
	f.vars = () => [target, user, proximity_flag, A];
	if (!(truthy(live(proximity_flag)) && truthy((rt.istype(live(target), T("/mob/living/simple_animal")) ? 1 : 0)))) return f.dot;
	if (((truthy(rt.gv(f, "buffed", (A = live(target)))) || truthy((rt.isIn(f, rt.fv(f, "type", live(A)), rt.sv(f, "banned_mobs")) ? 1 : 0))) || truthy(rt.fv(f, "stat", live(A))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Something's interfering with the ＀'s effects. It's no use.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	rt.incField(f, live(A), "buffed", 1, true);
	(rt.modField(f, live(A), "maxHealth", 1.5, multiply));
	rt.setFv(f, "health", live(A), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "maxHealth", live(A)), multiply(rt.fv(f, "health", live(A)), 1.5)])));
	rt.setFv(f, "melee_damage_lower", live(A), (yield* g.call(f, P("/proc/max"), null, [multiply(rt.fv(f, "melee_damage_lower", live(A)), 2), 10])));
	rt.setFv(f, "melee_damage_upper", live(A), (yield* g.call(f, P("/proc/max"), null, [multiply(rt.fv(f, "melee_damage_upper", live(A)), 2), 10])));
	(rt.modField(f, live(A), "transform", 2, multiply));
	rt.modField(f, live(A), "environment_smash", 2, add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>You increase the size of ＀, giving it a surge of strength!</span>", [live(A)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
