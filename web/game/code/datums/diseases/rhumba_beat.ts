// Based on /tg/station's code/datums/diseases/rhumba_beat.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(961, "/datum/disease/rhumba_beat", "/datum/disease", {
	name: "The Rhumba Beat",
	max_stages: 5,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Chick Chicky Boom!",
	cures: null,
	agent: "Unknown",
	permeability_mod: 1,
	severity: "BIOHAZARD THREAT!",
	viable_mobtypes: null,
});

// rhumba_beat.dm:7
rt.def("/datum/disease/rhumba_beat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("plasma");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// rhumba_beat.dm:14
rt.def("/datum/disease/rhumba_beat/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.affected_mob.ckey == "rosham") {
		yield* this.cure();
		return f.dot;
	}
	if (this.stage === 2) {
		if (prob(45)) {
			yield* this.affected_mob.adjustToxLoss(5);
			yield* this.affected_mob.updatehealth();
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel strange...</span>");
		}
	} else if (this.stage === 3) {
		if (prob(5)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel the urge to dance...</span>");
		} else if (prob(5)) {
			yield* this.affected_mob.emote("gasp");
		} else if (prob(10)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel the need to chick chicky boom...</span>");
		}
	} else if (this.stage === 4) {
		if (prob(10)) {
			yield* this.affected_mob.emote("gasp");
			to_chat(this.affected_mob, "<span class='danger'>You feel a burning beat inside...</span>");
		}
		if (prob(20)) {
			yield* this.affected_mob.adjustToxLoss(5);
			yield* this.affected_mob.updatehealth();
		}
	} else if (this.stage === 5) {
		to_chat(this.affected_mob, "<span class='danger'>Your body is unable to contain the Rhumba Beat...</span>");
		if (!prob(50)) return f.dot;
		yield* this.affected_mob.gib();
	} else {
		return f.dot;
	}
	return f.dot;
}, true);
