// Based on /tg/station's code/datums/diseases/tuberculosis.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(970, "/datum/disease/tuberculosis", "/datum/disease", {
	name: "Fungal tuberculosis",
	max_stages: 5,
	spread_text: "Airborne",
	cure_text: "Spaceacillin & salbutamol",
	cures: null,
	agent: "Fungal Tubercle bacillus Cosmosis",
	cure_chance: 5,
	desc: "A rare highly transmittable virulent virus. Few samples exist, rumoured to be carefully grown and cultured by clandestine bio-weapon specialists. Causes fever, blood vomiting, lung damage, weight loss, and fatigue.",
	severity: "Dangerous!",
	viable_mobtypes: null,
	required_organs: null,
});

// tuberculosis.dm:8
rt.def("/datum/disease/tuberculosis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("spaceacillin", "salbutamol");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));

	this.required_organs = list(T("/obj/item/bodypart/head"));
	return f.dot;
});

// tuberculosis.dm:15
rt.def("/datum/disease/tuberculosis/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 2) {
		if (prob(2)) {
			yield* this.affected_mob.emote("cough");
			to_chat(this.affected_mob, "<span class='danger'>Your chest hurts.</span>");
		}
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='danger'>Your stomach violently rumbles!</span>");
		}
		if (prob(5)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel a cold sweat form.</span>");
		}
	} else if (this.stage === 4) {
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='userdanger'>You see four of everything</span>");
			this.affected_mob.Dizzy(5);
		}
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel a sharp pain from your lower chest!</span>");
			yield* this.affected_mob.adjustOxyLoss(5);
			yield* this.affected_mob.emote("gasp");
		}
		if (prob(10)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel air escape from your lungs painfully.</span>");
			yield* this.affected_mob.adjustOxyLoss(25);
			yield* this.affected_mob.emote("gasp");
		}
	} else if (this.stage === 5) {
		if (prob(2)) {
			to_chat(this.affected_mob, `<span class='userdanger'>${pick("You feel your heart slowing...", "You relax and slow your heartbeat.")}</span>`);
			yield* this.affected_mob.adjustStaminaLoss(70);
		}
		if (prob(10)) {
			yield* this.affected_mob.adjustStaminaLoss(100);
			this.affected_mob.visible_message(`<span class='warning'>${this.affected_mob} faints!</span>`, "<span class='userdanger'>You surrender yourself and feel at peace...</span>");
			yield* this.affected_mob.AdjustSleeping(100);
		}
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='userdanger'>You feel your mind relax and your thoughts drift!</span>");
			this.affected_mob.confused = min(100, this.affected_mob.confused + 8);
		}
		if (prob(10)) {
			yield* this.affected_mob.vomit(20);
		}
		if (prob(3)) {
			to_chat(this.affected_mob, `<span class='warning'><i>${pick("Your stomach silently rumbles...", "Your stomach seizes up and falls limp, muscles dead and lifeless.", "You could eat a crayon")}</i></span>`);
			this.affected_mob.overeatduration = max(this.affected_mob.overeatduration - 100, 0);
			this.affected_mob.nutrition = max(this.affected_mob.nutrition - 100, 0);
		}
		if (prob(15)) {
			to_chat(this.affected_mob, `<span class='danger'>${pick("You feel uncomfortably hot...", "You feel like unzipping your jumpsuit", "You feel like taking off some clothes...")}</span>`);
			this.affected_mob.bodytemperature += 40;
		}
	}
	return f.dot;
}, true);
