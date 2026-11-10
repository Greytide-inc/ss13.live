// Based on /tg/station's code/datums/diseases/anxiety.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(946, "/datum/disease/anxiety", "/datum/disease", {
	name: "Severe Anxiety",
	form: "Infection",
	max_stages: 4,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Ethanol",
	cures: null,
	agent: "Excess Lepidopticides",
	desc: "If left untreated subject will regurgitate butterflies.",
	severity: "Medium",
	viable_mobtypes: null,
});

// anxiety.dm:8
rt.def("/datum/disease/anxiety/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("ethanol");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

// anxiety.dm:15
rt.def("/datum/disease/anxiety/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 2) {
		if (prob(5)) {
			to_chat(this.affected_mob, "<span class='notice'>You feel anxious.</span>");
		}
	} else if (this.stage === 3) {
		if (prob(10)) {
			to_chat(this.affected_mob, "<span class='notice'>Your stomach flutters.</span>");
		}
		if (prob(5)) {
			to_chat(this.affected_mob, "<span class='notice'>You feel panicky.</span>");
		}
		if (prob(2)) {
			to_chat(this.affected_mob, "<span class='danger'>You're overtaken with panic!</span>");
			this.affected_mob.confused += rand(2, 3);
		}
	} else if (this.stage === 4) {
		if (prob(10)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel butterflies in your stomach.</span>");
		}
		if (prob(5)) {
			this.affected_mob.visible_message(`<span class='danger'>${this.affected_mob} stumbles around in a panic.</span>`, "<span class='userdanger'>You have a panic attack!</span>");
			this.affected_mob.confused += rand(6, 8);
			this.affected_mob.jitteriness += rand(6, 8);
		}
		if (prob(2)) {
			this.affected_mob.visible_message(`<span class='danger'>${this.affected_mob} coughs up butterflies!</span>`, "<span class='userdanger'>You cough up butterflies!</span>");
			yield* new_(T("/mob/living/simple_animal/butterfly"), this.affected_mob.loc);
			yield* new_(T("/mob/living/simple_animal/butterfly"), this.affected_mob.loc);
		}
	}
	return f.dot;
}, true);
