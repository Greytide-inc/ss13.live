// Based on /tg/station's code/datums/diseases/fluspanish.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(955, "/datum/disease/fluspanish", "/datum/disease", {
	name: "Spanish inquisition Flu",
	max_stages: 3,
	spread_text: "Airborne",
	cure_text: "Spaceacillin & Anti-bodies to the common flu",
	cures: null,
	cure_chance: 10,
	agent: "1nqu1s1t10n flu virion",
	permeability_mod: 0.75,
	desc: "If left untreated the subject will burn to death for being a heretic.",
	severity: "Dangerous!",
	viable_mobtypes: null,
});

// fluspanish.dm:6
rt.def("/datum/disease/fluspanish/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("spaceacillin");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// fluspanish.dm:15
rt.def("/datum/disease/fluspanish/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 2) {
		this.affected_mob.bodytemperature += 10;
		if (prob(5)) {
			yield* this.affected_mob.emote("sneeze");
		}
		if (prob(5)) {
			yield* this.affected_mob.emote("cough");
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>You're burning in your own skin!</span>");
			yield* this.affected_mob.take_bodypart_damage(0, 5);
		}
	} else if (this.stage === 3) {
		this.affected_mob.bodytemperature += 20;
		if (prob(5)) {
			yield* this.affected_mob.emote("sneeze");
		}
		if (prob(5)) {
			yield* this.affected_mob.emote("cough");
		}
		if (prob(5)) {
			to_chat(this.affected_mob, "<span class='danger'>You're burning in your own skin!</span>");
			yield* this.affected_mob.take_bodypart_damage(0, 5);
		}
	}
	return f.dot;
}, true);
