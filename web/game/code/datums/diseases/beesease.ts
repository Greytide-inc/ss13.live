// Based on /tg/station's code/datums/diseases/beesease.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(948, "/datum/disease/beesease", "/datum/disease", {
	name: "Beesease",
	form: "Infection",
	max_stages: 4,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Sugar",
	cures: null,
	agent: "Apidae Infection",
	desc: "If left untreated subject will regurgitate bees.",
	severity: "Dangerous!",
	viable_mobtypes: null,
});

// beesease.dm:8
rt.def("/datum/disease/beesease/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("sugar");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

// beesease.dm:15
rt.def("/datum/disease/beesease/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 2) {
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='notice'>You taste honey in your mouth.</span>");
		}
	} else if (this.stage === 3) {
		if (prob(10)) {
			to_chat(this.affected_mob, "<span class='notice'>Your stomach rumbles.</span>");
		}
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='danger'>Your stomach stings painfully.</span>");
			if (prob(20)) {
				yield* this.affected_mob.adjustToxLoss(2);
				yield* this.affected_mob.updatehealth();
			}
		}
	} else if (this.stage === 4) {
		if (prob(10)) {
			this.affected_mob.visible_message(`<span class='danger'>${this.affected_mob} buzzes.</span>`, "<span class='userdanger'>Your stomach buzzes violently!</span>");
		}
		if (prob(5)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel something moving in your throat.</span>");
		}
		if (prob(1)) {
			this.affected_mob.visible_message(`<span class='danger'>${this.affected_mob} coughs up a swarm of bees!</span>`, "<span class='userdanger'>You cough up a swarm of bees!</span>");
			yield* new_(T("/mob/living/simple_animal/hostile/poison/bees"), this.affected_mob.loc);
		}
	}
	return f.dot;
}, true);
