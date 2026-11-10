// Based on /tg/station's code/datums/diseases/pierrot_throat.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(959, "/datum/disease/pierrot_throat", "/datum/disease", {
	name: "Pierrot's Throat",
	max_stages: 4,
	spread_text: "Airborne",
	cure_text: "Banana products, especially banana bread.",
	cures: null,
	cure_chance: 75,
	agent: "H0NI<42 Virus",
	permeability_mod: 0.75,
	desc: "If left untreated the subject will probably drive others to insanity.",
	severity: "Medium",
	longevity: 400,
	viable_mobtypes: null,
});

// pierrot_throat.dm:6
rt.def("/datum/disease/pierrot_throat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("banana");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// pierrot_throat.dm:16
rt.def("/datum/disease/pierrot_throat/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 1) {
		if (prob(10)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel a little silly.</span>");
		}
	} else if (this.stage === 2) {
		if (prob(10)) {
			to_chat(this.affected_mob, "<span class='danger'>You start seeing rainbows.</span>");
		}
	} else if (this.stage === 3) {
		if (prob(10)) {
			to_chat(this.affected_mob, "<span class='danger'>Your thoughts are interrupted by a loud <b>HONK!</b></span>");
		}
	} else if (this.stage === 4) {
		if (!prob(5)) return f.dot;
		yield* this.affected_mob.say(pick(list("HONK!", "Honk!", "Honk.", "Honk?", "Honk!!", "Honk?!", "Honk...")));
	}
	return f.dot;
}, true);
