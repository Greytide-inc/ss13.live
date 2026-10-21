// From code/modules/mob/living/simple_animal/hostile/bear.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4950, "/mob/living/simple_animal/hostile/bear", "/mob/living/simple_animal/hostile", {
	armored: 0,
	name: "space bear",
	desc: "You don't need to be faster than a space bear, you just need to outrun your crewmates.",
	icon_state: "bear",
	icon_living: "bear",
	icon_dead: "bear_dead",
	icon_gib: "bear_gib",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_taunt: null,
	speak_chance: 1,
	taunt_chance: 25,
	turns_per_move: 5,
	see_in_dark: 6,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "hits",
	maxHealth: 60,
	health: 60,
	obj_damage: 60,
	melee_damage_lower: 20,
	melee_damage_upper: 30,
	attacktext: "claws",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	friendly: "bear hugs",
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	faction: null,
	gold_core_spawnable: 1,
});

// /mob/living/simple_animal/hostile/bear/proc/<init>  (code/modules/mob/living/simple_animal/hostile/bear.dm:17)
rt.def("/mob/living/simple_animal/hostile/bear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("RAWR!", "Rawr!", "GRR!", "Growl!"));
	rt.setSv(f, "speak_emote", rt.list("growls", "roars"));
	rt.setSv(f, "emote_hear", rt.list("rawrs.", "grumbles.", "grawls."));
	rt.setSv(f, "emote_taunt", rt.list("stares ferociously", "stomps"));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/bear"), 5, T("/obj/item/clothing/head/bearpelt"), 1]));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("russian"));
	return f.dot;
});

rt.type(4953, "/mob/living/simple_animal/hostile/bear/russian", "/mob/living/simple_animal/hostile/bear", {
	armored: 1,
	name: "combat bear",
	desc: "A ferocious brown bear decked out in armor plating, a red star with yellow outlining details the shoulder plating.",
	icon_state: "combatbear",
	icon_living: "combatbear",
	icon_dead: "combatbear_dead",
	faction: null,
	butcher_results: null,
	melee_damage_lower: 25,
	melee_damage_upper: 35,
	armour_penetration: 20,
	health: 120,
	maxHealth: 120,
});

// /mob/living/simple_animal/hostile/bear/russian/proc/<init>  (code/modules/mob/living/simple_animal/hostile/bear.dm:59)
rt.def("/mob/living/simple_animal/hostile/bear/russian/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("russian"));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/bear"), 5, T("/obj/item/clothing/head/bearpelt"), 1, T("/obj/item/bear_armor"), 1]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/bear/proc/update_icons  (code/modules/mob/living/simple_animal/hostile/bear.dm:72)
rt.def("/mob/living/simple_animal/hostile/bear/proc/update_icons", function update_icons(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "armored"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["armor_bear"]);
	return f.dot;
});

rt.type(10128, "/obj/item/bear_armor", "/obj/item", {
	name: "pile of bear armor",
	desc: "A scattered pile of various shaped armor pieces fitted for a bear, some duct tape, and a nail filer. Crude instructions are written on the back of one of the plates in russian. This seems like an awful idea.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "bear_armor_upgrade",
});

// /obj/item/bear_armor/proc/afterattack  (code/modules/mob/living/simple_animal/hostile/bear.dm:84)  may sleep
rt.def("/obj/item/bear_armor/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let A: Value = null;
	f.vars = () => [target, user, proximity_flag, A];
	if (!(truthy((rt.istype(live(target), T("/mob/living/simple_animal/hostile/bear")) ? 1 : 0)) && truthy(live(proximity_flag)))) return f.dot;
	if (truthy(rt.gv(f, "armored", (A = live(target))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ has already been armored up!</span>", [live(A)])]);
		return live(f.dot);
	}
	rt.setFv(f, "armored", live(A), 1);
	rt.modField(f, live(A), "maxHealth", 60, add);
	rt.modField(f, live(A), "health", 60, add);
	rt.modField(f, live(A), "armour_penetration", 20, add);
	rt.modField(f, live(A), "melee_damage_lower", 5, add);
	rt.modField(f, live(A), "melee_damage_upper", 5, add);
	yield* g.callName(f, live(A), "update_icons", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>You strap the armor plating to ＀ and sharpen ＀ claws with the nail filer. This was a great idea.</span>", [live(A), (yield* g.callName(f, live(A), "p_their", []))])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
