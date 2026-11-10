// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/crab.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5080, "/mob/living/simple_animal/crab", "/mob/living/simple_animal", {
	inventory_head: null,
	inventory_mask: null,
	icon_living: "crab",
	icon_dead: "crab_dead",
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "stomps",
	stop_automated_movement: 1,
	friendly: "pinches",
	gold_core_spawnable: 2,
	name: "crab",
	desc: "Free crabs!",
	icon_state: "crab",
	butcher_results: null,
	ventcrawler: 2,
});

// crab.dm:8
rt.def("/mob/living/simple_animal/crab/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("clicks");

	this.emote_hear = list("clicks.");

	this.emote_see = list("clacks.");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 1]);
	return f.dot;
});

// crab.dm:25
rt.def("/mob/living/simple_animal/crab/proc/Life", function* Life(f: Frame) {
	let east_vs_west: Value = null;
	yield* parent_proc();
	if (!this.ckey && !this.stat) {
		if (isturf(this.loc) && !this.resting && !this.buckled) {
			this.turns_since_move++;
			if (this.turns_since_move >= this.turns_per_move) {
				if (yield* this.Process_Spacemove((east_vs_west = pick(4, 8)))) {
					yield* this.Move(rt.getStep(f, this, east_vs_west), east_vs_west);
					this.turns_since_move = 0;
				}
			}
		}
	}
	yield* this.regenerate_icons();
	return f.dot;
}, true, { waitfor: false });
