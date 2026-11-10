// Based on /tg/station's code/datums/diseases/flu.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(954, "/datum/disease/flu", "/datum/disease", {
	name: "The Flu",
	max_stages: 3,
	spread_text: "Airborne",
	cure_text: "Spaceacillin",
	cures: null,
	cure_chance: 10,
	agent: "H13N1 flu virion",
	permeability_mod: 0.75,
	desc: "If left untreated the subject will feel quite unwell.",
	severity: "Medium",
	viable_mobtypes: null,
});

// flu.dm:6
rt.def("/datum/disease/flu/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("spaceacillin");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

// flu.dm:15
rt.def("/datum/disease/flu/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 2) {
		if (this.affected_mob.lying && prob(20)) {
			to_chat(this.affected_mob, "<span class='notice'>You feel better.</span>");
			this.stage--;
			return f.dot;
		}
		if (prob(1)) {
			yield* this.affected_mob.emote("sneeze");
		}
		if (prob(1)) {
			yield* this.affected_mob.emote("cough");
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>Your muscles ache.</span>");
			if (prob(20)) {
				yield* this.affected_mob.take_bodypart_damage(1);
			}
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>Your stomach hurts.</span>");
			if (prob(20)) {
				yield* this.affected_mob.adjustToxLoss(1);
				yield* this.affected_mob.updatehealth();
			}
		}
	} else if (this.stage === 3) {
		if (this.affected_mob.lying && prob(15)) {
			to_chat(this.affected_mob, "<span class='notice'>You feel better.</span>");
			this.stage--;
			return f.dot;
		}
		if (prob(1)) {
			yield* this.affected_mob.emote("sneeze");
		}
		if (prob(1)) {
			yield* this.affected_mob.emote("cough");
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>Your muscles ache.</span>");
			if (prob(20)) {
				yield* this.affected_mob.take_bodypart_damage(1);
			}
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>Your stomach hurts.</span>");
			if (prob(20)) {
				yield* this.affected_mob.adjustToxLoss(1);
				yield* this.affected_mob.updatehealth();
			}
		}
	}
	return f.dot;
}, true);
