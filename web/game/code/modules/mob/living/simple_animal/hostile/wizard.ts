// From code/modules/mob/living/simple_animal/hostile/wizard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4997, "/mob/living/simple_animal/hostile/wizard", "/mob/living/simple_animal/hostile", {
	fireball: null,
	blink: null,
	mm: null,
	next_cast: 0,
	retreat_distance: 3,
	minimum_distance: 3,
	name: "Space Wizard",
	desc: "EI NATH?",
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "wizard",
	icon_living: "wizard",
	icon_dead: "wizard_dead",
	speak_chance: 0,
	turns_per_move: 3,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "hits",
	speed: 0,
	maxHealth: 100,
	health: 100,
	harm_intent_damage: 5,
	melee_damage_lower: 5,
	melee_damage_upper: 5,
	attacktext: "punches",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	a_intent: "harm",
	atmos_requirements: null,
	unsuitable_atmos_damage: 15,
	faction: null,
	status_flags: 8,
	del_on_death: 1,
	loot: null,
});

// /mob/living/simple_animal/hostile/wizard/proc/<init>  (code/modules/mob/living/simple_animal/hostile/wizard.dm:22)
rt.def("/mob/living/simple_animal/hostile/wizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("wizard"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/mob_spawn/human/corpse/wizard"), T("/obj/item/weapon/staff")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/wizard/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/wizard.dm:40)  may sleep
rt.def("/mob/living/simple_animal/hostile/wizard/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "fireball", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/aimed/fireball"), [])));
	rt.setFv(f, "clothes_req", rt.sv(f, "fireball"), 0);
	rt.setFv(f, "human_req", rt.sv(f, "fireball"), 0);
	rt.setFv(f, "player_lock", rt.sv(f, "fireball"), 0);
	yield* g.srcCall(f, "AddSpell", rt.sv(f, "fireball"));
	rt.modSrcVar(f, "implants", (yield* g.new_(f, T("/obj/item/weapon/implant/exile"), [live(f.src)])), add);
	rt.setSv(f, "mm", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile"), [])));
	rt.setFv(f, "clothes_req", rt.sv(f, "mm"), 0);
	rt.setFv(f, "human_req", rt.sv(f, "mm"), 0);
	rt.setFv(f, "player_lock", rt.sv(f, "mm"), 0);
	yield* g.srcCall(f, "AddSpell", rt.sv(f, "mm"));
	rt.setSv(f, "blink", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/turf_teleport/blink"), [])));
	rt.setFv(f, "clothes_req", rt.sv(f, "blink"), 0);
	rt.setFv(f, "human_req", rt.sv(f, "blink"), 0);
	rt.setFv(f, "player_lock", rt.sv(f, "blink"), 0);
	rt.setFv(f, "outer_tele_radius", rt.sv(f, "blink"), 3);
	yield* g.srcCall(f, "AddSpell", rt.sv(f, "blink"));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/wizard/proc/handle_automated_action  (code/modules/mob/living/simple_animal/hostile/wizard.dm:62)  may sleep
rt.def("/mob/living/simple_animal/hostile/wizard/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.sv(f, "target")) && rt.lt(rt.sv(f, "next_cast"), rt.worldTime(f)))) return f.dot;
	if ((truthy((rt.isIn(f, rt.getDir(f, live(f.src), rt.sv(f, "target")), rt.list(2, 4, 8, 1)) ? 1 : 0)) && truthy((yield* g.callName(f, rt.sv(f, "fireball"), "cast_check", [0, live(f.src)]))))) {
		yield* g.callName(f, live(f.src), "setDir", [rt.getDir(f, live(f.src), rt.sv(f, "target"))]);
		yield* g.callName(f, rt.sv(f, "fireball"), "perform", [null, rt.list(rt.sv(f, "target")), "user", live(f.src)], rt.Args.Named);
		rt.setSv(f, "next_cast", add(rt.worldTime(f), 10));
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "mm"), "cast_check", [0, live(f.src)])))) {
		yield* g.callName(f, rt.sv(f, "mm"), "choose_targets", [live(f.src)]);
		rt.setSv(f, "next_cast", add(rt.worldTime(f), 10));
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, rt.sv(f, "blink"), "cast_check", [0, live(f.src)])))) return f.dot;
	yield* g.callName(f, rt.sv(f, "blink"), "choose_targets", [live(f.src)]);
	rt.setSv(f, "next_cast", add(rt.worldTime(f), 10));
	return live(f.dot);
}, true, { waitfor: false });
