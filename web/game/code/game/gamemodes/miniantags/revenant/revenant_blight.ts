// Based on /tg/station's code/game/gamemodes/miniantags/revenant/revenant_blight.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(980, "/datum/disease/revblight", "/datum/disease", {
	stagedamage: 0,
	finalstage: 0,
	name: "Unnatural Wasting",
	max_stages: 5,
	stage_prob: 10,
	spread_flags: 2,
	cure_text: "Holy water or extensive rest.",
	spread_text: "A burst of unholy energy",
	cures: null,
	cure_chance: 50,
	agent: "Unholy Forces",
	disease_flags: 1,
	permeability_mod: 1,
	severity: "BIOHAZARD THREAT!",
	viable_mobtypes: null,
});

// revenant_blight.dm:8
rt.def("/datum/disease/revblight/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("holywater");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// revenant_blight.dm:20
rt.def("/datum/disease/revblight/proc/cure", function* cure(f: Frame) {
	if (this.affected_mob) {
		this.affected_mob.remove_atom_colour(TEMPORARY_COLOUR_PRIORITY, "#1d2953");
		if (this.affected_mob.dna && this.affected_mob.dna.species) {
			yield* this.affected_mob.dna.species.handle_mutant_bodyparts(this.affected_mob);
			yield* this.affected_mob.dna.species.handle_hair(this.affected_mob);
		}
		to_chat(this.affected_mob, "<span class='notice'>You feel better.</span>");
	}
	yield* parent_proc();
	return f.dot;
}, true);

// revenant_blight.dm:28
rt.def("/datum/disease/revblight/proc/stage_act", function* stage_act(f: Frame) {
	if (!this.finalstage) {
		if (this.affected_mob.lying && prob(this.stage * 6)) {
			yield* this.cure();
			return f.dot;
		}
		if (prob(this.stage * 3)) {
			to_chat(this.affected_mob, `<span class='revennotice'>You suddenly feel ${pick("sick and tired", "disoriented", "tired and confused", "nauseated", "faint", "dizzy")}...</span>`);
			this.affected_mob.confused += 8;
			yield* this.affected_mob.adjustStaminaLoss(8);
			yield* new_(T("/obj/effect/temp_visual/revenant"), this.affected_mob.loc);
		}
		if (this.stagedamage < this.stage) {
			this.stagedamage++;
			yield* this.affected_mob.adjustToxLoss(this.stage * 2);
			yield* new_(T("/obj/effect/temp_visual/revenant"), this.affected_mob.loc);
		}
		if (prob(45)) {
			yield* this.affected_mob.adjustStaminaLoss(this.stage);
		}
	}
	yield* parent_proc();
	if (this.stage === 2) {
		if (prob(5)) {
			yield* this.affected_mob.emote("pale");
		}
	} else if (this.stage === 3) {
		if (prob(10)) {
			yield* this.affected_mob.emote(pick("pale", "shiver"));
		}
	} else if (this.stage === 4) {
		if (prob(15)) {
			yield* this.affected_mob.emote(pick("pale", "shiver", "cries"));
		}
	} else if (this.stage === 5) {
		if (this.finalstage) return f.dot;
		this.finalstage = 1;
		to_chat(this.affected_mob, `<span class='revenbignotice'>You feel like ${pick("nothing's worth it anymore", "nobody ever needed your help", "nothing you did mattered", "everything you tried to do was worthless")}.</span>`);
		yield* this.affected_mob.adjustStaminaLoss(45);
		yield* new_(T("/obj/effect/temp_visual/revenant"), this.affected_mob.loc);
		if (this.affected_mob.dna && this.affected_mob.dna.species) {
			yield* this.affected_mob.dna.species.handle_mutant_bodyparts(this.affected_mob, "#1d2953");
			yield* this.affected_mob.dna.species.handle_hair(this.affected_mob, "#1d2953");
		}
		this.affected_mob.visible_message(`<span class='warning'>${this.affected_mob} looks terrifyingly gaunt...</span>`, "<span class='revennotice'>You suddenly feel like your skin is <i>wrong</i>...</span>");
		this.affected_mob.add_atom_colour("#1d2953", TEMPORARY_COLOUR_PRIORITY);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/disease/revblight/proc/cure"))), 100);
	} else {
		return f.dot;
	}
	return f.dot;
}, true);
