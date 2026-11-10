// Based on /tg/station's code/datums/diseases/brainrot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(949, "/datum/disease/brainrot", "/datum/disease", {
	name: "Brainrot",
	max_stages: 4,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Mannitol",
	cures: null,
	agent: "Cryptococcus Cosmosis",
	cure_chance: 15,
	desc: "This disease destroys the braincells, causing brain fever, brain necrosis and general intoxication.",
	severity: "Dangerous!",
	viable_mobtypes: null,
	required_organs: null,
});

// brainrot.dm:7
rt.def("/datum/disease/brainrot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("mannitol");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));

	this.required_organs = list(T("/obj/item/bodypart/head"));
	return f.dot;
});

// brainrot.dm:16
rt.def("/datum/disease/brainrot/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 2) {
		if (prob(2)) {
			yield* this.affected_mob.emote("blink");
		}
		if (prob(2)) {
			yield* this.affected_mob.emote("yawn");
		}
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='danger'>You don't feel like yourself.</span>");
		}
		if (prob(5)) {
			yield* this.affected_mob.adjustBrainLoss(1);
			yield* this.affected_mob.updatehealth();
		}
	} else if (this.stage === 3) {
		if (prob(2)) {
			yield* this.affected_mob.emote("stare");
		}
		if (prob(2)) {
			yield* this.affected_mob.emote("drool");
		}
		if (prob(10) && this.affected_mob.getBrainLoss() <= 98) {
			yield* this.affected_mob.adjustBrainLoss(2);
			yield* this.affected_mob.updatehealth();
			if (prob(2)) {
				to_chat(this.affected_mob, "<span class='danger'>Your try to remember something important...but can't.</span>");
			}
		}
	} else if (this.stage === 4) {
		if (prob(2)) {
			yield* this.affected_mob.emote("stare");
		}
		if (prob(2)) {
			yield* this.affected_mob.emote("drool");
		}
		if (prob(15) && this.affected_mob.getBrainLoss() <= 98) {
			yield* this.affected_mob.adjustBrainLoss(3);
			yield* this.affected_mob.updatehealth();
			if (prob(2)) {
				to_chat(this.affected_mob, "<span class='danger'>Strange buzzing fills your head, removing all thoughts.</span>");
			}
		}
		if (prob(3)) {
			to_chat(this.affected_mob, "<span class='danger'>You lose consciousness...</span>");
			this.affected_mob.visible_message(`<span class='warning'>${this.affected_mob} suddenly collapses</span>`);
			yield* this.affected_mob.Unconscious(rand(100, 200));
			if (prob(1)) {
				yield* this.affected_mob.emote("snore");
			}
		}
		if (prob(15)) {
			this.affected_mob.stuttering += 3;
		}
	}
	return f.dot;
}, true);
