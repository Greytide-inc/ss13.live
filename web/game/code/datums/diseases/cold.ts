// Based on /tg/station's code/datums/diseases/cold.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(950, "/datum/disease/cold", "/datum/disease", {
	name: "The Cold",
	max_stages: 3,
	spread_flags: 64,
	cure_text: "Rest & Spaceacillin",
	cures: null,
	agent: "XY-rhinovirus",
	permeability_mod: 0.5,
	desc: "If left untreated the subject will contract the flu.",
	severity: "Minor",
	viable_mobtypes: null,
});

// cold.dm:6
rt.def("/datum/disease/cold/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("spaceacillin");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

// cold.dm:14
rt.def("/datum/disease/cold/proc/stage_act", function* stage_act(f: Frame) {
	let Flu: Value = null;
	yield* parent_proc();
	if (this.stage === 2) {
		if (this.affected_mob.lying && prob(40)) {
			to_chat(this.affected_mob, "<span class='notice'>You feel better.</span>");
			yield* this.cure();
			return f.dot;
		}
		if (prob(1) && prob(5)) {
			to_chat(this.affected_mob, "<span class='notice'>You feel better.</span>");
			yield* this.cure();
			return f.dot;
		}
		if (prob(1)) {
			yield* this.affected_mob.emote("sneeze");
		}
		if (prob(1)) {
			yield* this.affected_mob.emote("cough");
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>Your throat feels sore.</span>");
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>Mucous runs down the back of your throat.</span>");
		}
	} else if (this.stage === 3) {
		if (this.affected_mob.lying && prob(25)) {
			to_chat(this.affected_mob, "<span class='notice'>You feel better.</span>");
			yield* this.cure();
			return f.dot;
		}
		if (prob(1) && prob(1)) {
			to_chat(this.affected_mob, "<span class='notice'>You feel better.</span>");
			yield* this.cure();
			return f.dot;
		}
		if (prob(1)) {
			yield* this.affected_mob.emote("sneeze");
		}
		if (prob(1)) {
			yield* this.affected_mob.emote("cough");
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>Your throat feels sore.</span>");
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>Mucous runs down the back of your throat.</span>");
		}
		if (!(prob(1) && prob(50))) return f.dot;
		if (this.affected_mob.resistances.Find(T("/datum/disease/flu"))) return f.dot;
		Flu = (yield* new_(T("/datum/disease/flu"), 0));
		yield* this.affected_mob.ContractDisease(Flu);
		yield* this.cure();
	}
	return f.dot;
}, true);
