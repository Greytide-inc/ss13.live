// Based on /tg/station's code/datums/diseases/gbs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(956, "/datum/disease/gbs", "/datum/disease", {
	name: "GBS",
	max_stages: 5,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Synaptizine & Sulfur",
	cures: null,
	cure_chance: 15,
	agent: "Gravitokinetic Bipotential SADS+",
	disease_flags: 7,
	permeability_mod: 1,
	severity: "BIOHAZARD THREAT!",
	viable_mobtypes: null,
});

// gbs.dm:10
rt.def("/datum/disease/gbs/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("synaptizine", "sulfur");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// gbs.dm:16
rt.def("/datum/disease/gbs/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 2) {
		if (prob(45)) {
			yield* this.affected_mob.adjustToxLoss(5);
			yield* this.affected_mob.updatehealth();
		}
		if (prob(1)) {
			yield* this.affected_mob.emote("sneeze");
		}
	} else if (this.stage === 3) {
		if (prob(5)) {
			yield* this.affected_mob.emote("cough");
		} else if (prob(5)) {
			yield* this.affected_mob.emote("gasp");
		}
		if (prob(10)) {
			to_chat(this.affected_mob, "<span class='danger'>You're starting to feel very weak...</span>");
		}
	} else if (this.stage === 4) {
		if (prob(10)) {
			yield* this.affected_mob.emote("cough");
		}
		yield* this.affected_mob.adjustToxLoss(5);
		yield* this.affected_mob.updatehealth();
	} else if (this.stage === 5) {
		to_chat(this.affected_mob, "<span class='danger'>Your body feels as if it's trying to rip itself open...</span>");
		if (!prob(50)) return f.dot;
		yield* this.affected_mob.gib();
	} else {
		return f.dot;
	}
	return f.dot;
}, true);
