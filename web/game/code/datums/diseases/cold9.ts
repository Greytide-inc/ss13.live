// Based on /tg/station's code/datums/diseases/cold9.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(951, "/datum/disease/cold9", "/datum/disease", {
	name: "The Cold",
	max_stages: 3,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Common Cold Anti-bodies & Spaceacillin",
	cures: null,
	agent: "ICE9-rhinovirus",
	desc: "If left untreated the subject will slow, as if partly frozen.",
	severity: "Medium",
	viable_mobtypes: null,
});

// cold9.dm:7
rt.def("/datum/disease/cold9/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("spaceacillin");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// cold9.dm:14
rt.def("/datum/disease/cold9/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 2) {
		this.affected_mob.bodytemperature -= 10;
		if (prob(1) && prob(10)) {
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
		if (prob(5)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel stiff.</span>");
		}
	} else if (this.stage === 3) {
		this.affected_mob.bodytemperature -= 20;
		if (prob(1)) {
			yield* this.affected_mob.emote("sneeze");
		}
		if (prob(1)) {
			yield* this.affected_mob.emote("cough");
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>Your throat feels sore.</span>");
		}
		if (!prob(10)) return f.dot;
		to_chat(this.affected_mob, "<span class='danger'>You feel stiff.</span>");
	}
	return f.dot;
}, true);
