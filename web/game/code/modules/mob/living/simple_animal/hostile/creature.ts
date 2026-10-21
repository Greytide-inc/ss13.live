// From code/modules/mob/living/simple_animal/hostile/creature.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4955, "/mob/living/simple_animal/hostile/creature", "/mob/living/simple_animal/hostile", {
	name: "creature",
	desc: "A sanity-destroying otherthing.",
	icon_state: "otherthing",
	icon_living: "otherthing",
	icon_dead: "otherthing-dead",
	health: 80,
	maxHealth: 80,
	obj_damage: 100,
	melee_damage_lower: 25,
	melee_damage_upper: 50,
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	faction: null,
	speak_emote: null,
	gold_core_spawnable: 1,
	atmos_requirements: null,
	minbodytemp: 0,
});

// /mob/living/simple_animal/hostile/creature/proc/<init>  (code/modules/mob/living/simple_animal/hostile/creature.dm:14)
rt.def("/mob/living/simple_animal/hostile/creature/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("creature"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("screams"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});
