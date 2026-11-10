// Based on /tg/station's code/datums/diseases/parrotpossession.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(958, "/datum/disease/parrot_possession", "/datum/disease", {
	parrot: null,
	name: "Parrot Possession",
	max_stages: 1,
	spread_text: "Paranormal",
	spread_flags: 1,
	disease_flags: 1,
	cure_text: "Holy Water.",
	cures: null,
	cure_chance: 20,
	agent: "Avian Vengence",
	desc: "Subject is possesed by the vengeful spirit of a parrot. Call the priest.",
	severity: "Medium",
	viable_mobtypes: null,
});

// parrotpossession.dm:8
rt.def("/datum/disease/parrot_possession/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("holywater");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// parrotpossession.dm:17
rt.def("/datum/disease/parrot_possession/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (!this.parrot || this.parrot.loc != this.affected_mob) {
		yield* this.cure();
	} else {
		if (!prob(this.parrot.speak_chance)) return f.dot;
		yield* this.affected_mob.say(pick(this.parrot.speech_buffer));
	}
	return f.dot;
}, true);

// parrotpossession.dm:24
rt.def("/datum/disease/parrot_possession/proc/cure", function* cure(f: Frame) {
	if (this.parrot && this.parrot.loc == this.affected_mob) {
		this.parrot.loc = this.affected_mob.loc;
		this.affected_mob.visible_message(`<span class='danger'>${this.parrot} is violently driven out of ${this.affected_mob}!</span>`, `<span class='userdanger'>${this.parrot} bursts out of your chest!</span>`);
	}
	yield* parent_proc();
	return f.dot;
}, true);
