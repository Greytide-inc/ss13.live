// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/cockroach.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5079, "/mob/living/simple_animal/cockroach", "/mob/living/simple_animal", {
	squish_chance: 50,
	icon_dead: "cockroach",
	turns_per_move: 5,
	atmos_requirements: null,
	minbodytemp: 270,
	maxbodytemp: 1e+31,
	pass_flags: 21,
	response_help: "pokes",
	response_disarm: "shoos",
	response_harm: "splats",
	speak_emote: null,
	gold_core_spawnable: 2,
	verb_say: "chitters",
	verb_ask: "chitters inquisitively",
	verb_exclaim: "chitters loudly",
	verb_yell: "chitters loudly",
	del_on_death: 1,
	name: "cockroach",
	desc: "This station is just crawling with bugs.",
	icon_state: "cockroach",
	health: 1,
	maxHealth: 1,
	loot: null,
	mob_size: 0,
	density: 0,
	ventcrawler: 2,
});

// cockroach.dm:10
rt.def("/mob/living/simple_animal/cockroach/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.speak_emote = list("chitters");

	this.loot = list(T("/obj/effect/decal/cleanable/deadcockroach"));
	return f.dot;
});

// cockroach.dm:30
rt.def("/mob/living/simple_animal/cockroach/proc/death", function* death(f: Frame, gibbed: Value) {
	if (GLOB.SSticker.cinematic) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// cockroach.dm:35
rt.def("/mob/living/simple_animal/cockroach/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let A: Value = null;
	if (ismob(AM)) {
		if (rt.istype(AM, T("/mob/living"))) {
			if ((A = AM).mob_size > MOB_SIZE_SMALL && !rt.bitAnd(A.movement_type, 2)) {
				if (prob(this.squish_chance)) {
					A.visible_message(`<span class='notice'>${A} squashed ${this}.</span>`, `<span class='notice'>You squashed ${this}.</span>`);
					yield* this.adjustBruteLoss(1);
				} else {
					this.visible_message(`<span class='notice'>${this} avoids getting crushed.</span>`);
				}
			}
		}
	} else {
		if (!rt.istype(AM, T("/obj/structure"))) return f.dot;
		if (prob(this.squish_chance)) {
			AM.visible_message(`<span class='notice'>${this} was crushed under ${AM}.</span>`);
			yield* this.adjustBruteLoss(1);
		} else {
			this.visible_message(`<span class='notice'>${this} avoids getting crushed.</span>`);
		}
	}
	return f.dot;
}, true);
