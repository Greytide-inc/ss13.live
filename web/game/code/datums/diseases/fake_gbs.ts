// Based on /tg/station's code/datums/diseases/fake_gbs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(953, "/datum/disease/fake_gbs", "/datum/disease", {
	name: "GBS",
	max_stages: 5,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Synaptizine & Sulfur",
	cures: null,
	agent: "Gravitokinetic Bipotential SADS-",
	desc: "If left untreated death will occur.",
	severity: "BIOHAZARD THREAT!",
	viable_mobtypes: null,
});

// fake_gbs.dm:9
rt.def("/datum/disease/fake_gbs/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("synaptizine", "sulfur");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

// fake_gbs.dm:14
rt.def("/datum/disease/fake_gbs/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 2) {
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
	} else if (this.stage === 5) {
		if (!prob(10)) return f.dot;
		yield* this.affected_mob.emote("cough");
	}
	return f.dot;
}, true);
