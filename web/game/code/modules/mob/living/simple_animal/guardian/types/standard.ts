// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/types/standard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4881, "/mob/living/simple_animal/hostile/guardian/punch", "/mob/living/simple_animal/hostile/guardian", {
	battlecry: "AT",
	playstyle_string: "<span class='holoparasite'>As a <b>standard</b> type you have no special abilities, but have a high damage resistance and a powerful attack capable of smashing through walls.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Assistant, faceless and generic, but never to be underestimated.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Standard combat modules loaded. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! You caught one! It's really boring and standard. Better punch some walls to ease the tension.</span>",
	melee_damage_lower: 20,
	melee_damage_upper: 20,
	obj_damage: 80,
	next_move_modifier: 0.8,
	environment_smash: 2,
});

// standard.dm:18
rt.def("/mob/living/simple_animal/hostile/guardian/punch/verb/Battlecry", function* Battlecry(f: Frame) {
	let input: Value = null;
	if (!(input = (yield* stripped_input(this, "What do you want your battlecry to be? Max length of 6 characters.", null, "", 7)))) return f.dot;
	this.battlecry = input;
	return f.dot;
}, true, { verb: { name: "Set Battlecry", category: "Guardian", desc: "Choose what you shout as you punch people." } });

// standard.dm:25
rt.def("/mob/living/simple_animal/hostile/guardian/punch/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!rt.istype(this.target, T("/mob/living"))) return f.dot;
	yield* this.say(`${this.battlecry}${this.battlecry}${this.battlecry}${this.battlecry}${this.battlecry}${this.battlecry}${this.battlecry}${this.battlecry}${this.battlecry}${this.battlecry}!!`);
	playsound(this.loc, this.attack_sound, 50, 1, 1);
	playsound(this.loc, this.attack_sound, 50, 1, 1);
	playsound(this.loc, this.attack_sound, 50, 1, 1);
	playsound(this.loc, this.attack_sound, 50, 1, 1);
	return f.dot;
}, true);
