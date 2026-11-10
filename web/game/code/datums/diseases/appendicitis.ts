// Based on /tg/station's code/datums/diseases/appendicitis.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(947, "/datum/disease/appendicitis", "/datum/disease", {
	form: "Condition",
	name: "Appendicitis",
	max_stages: 3,
	cure_text: "Surgery",
	agent: "Shitty Appendix",
	permeability_mod: 1,
	desc: "If left untreated the subject will become very weak, and may vomit often.",
	severity: "Dangerous!",
	longevity: 1000,
	disease_flags: 6,
	spread_flags: 2,
	visibility_flags: 2,
	viable_mobtypes: null,
	required_organs: null,
});

// appendicitis.dm:7
rt.def("/datum/disease/appendicitis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.viable_mobtypes = list(T("/mob/living/carbon/human"));

	this.required_organs = list(T("/obj/item/organ/appendix"));
	return f.dot;
});

// appendicitis.dm:18
rt.def("/datum/disease/appendicitis/proc/stage_act", function* stage_act(f: Frame) {
	let A: Value = null;
	yield* parent_proc();
	if (this.stage === 1) {
		if (prob(5)) {
			yield* this.affected_mob.emote("cough");
		}
	} else if (this.stage === 2) {
		if (A = this.affected_mob.getorgan(T("/obj/item/organ/appendix"))) {
			A.inflamed = 1;
			yield* A.update_icon();
		}
		if (prob(3)) {
			to_chat(this.affected_mob, "<span class='warning'>You feel a stabbing pain in your abdomen!</span>");
			yield* this.affected_mob.Stun(rand(40, 60));
			yield* this.affected_mob.adjustToxLoss(1);
		}
	} else if (this.stage === 3) {
		if (!prob(1)) return f.dot;
		yield* this.affected_mob.vomit(95);
	}
	return f.dot;
}, true);
