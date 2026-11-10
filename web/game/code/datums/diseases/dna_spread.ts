// Based on /tg/station's code/datums/diseases/dna_spread.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(952, "/datum/disease/dnaspread", "/datum/disease", {
	original_dna: null,
	transformed: 0,
	name: "Space Retrovirus",
	max_stages: 4,
	spread_text: "On contact",
	spread_flags: 32,
	cure_text: "Mutadone",
	cures: null,
	disease_flags: 7,
	agent: "S4E1 retrovirus",
	desc: "This disease transplants the genetic code of the initial vector into new hosts.",
	severity: "Medium",
	viable_mobtypes: null,
});

// dna_spread.dm:7
rt.def("/datum/disease/dnaspread/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("mutadone");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// dna_spread.dm:18
rt.def("/datum/disease/dnaspread/proc/stage_act", function* stage_act(f: Frame) {
	let transform_dna: Value = null;
	yield* parent_proc();
	if (!this.affected_mob.dna) {
		yield* this.cure();
	}
	if (rt.isIn(f, NOTRANSSTING, this.affected_mob.dna.species.species_traits)) {
		yield* this.cure();
	}
	if (!rt.at(this.strain_data, "dna")) {
		rt.setAt(this.strain_data, "dna", (yield* new_(this.affected_mob.dna.type)));
		yield* this.affected_mob.dna.copy_dna(rt.at(this.strain_data, "dna"));
		this.carrier = 1;
		this.stage = 4;
		return f.dot;
	}
	if (this.stage === 2) {
		if (prob(8)) {
			yield* this.affected_mob.emote("sneeze");
		}
		if (prob(8)) {
			yield* this.affected_mob.emote("cough");
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>Your muscles ache.</span>");
			if (prob(20)) {
				yield* this.affected_mob.take_bodypart_damage(1);
			}
		}
		if (prob(1)) {
			to_chat(this.affected_mob, "<span class='danger'>Your stomach hurts.</span>");
			if (prob(20)) {
				yield* this.affected_mob.adjustToxLoss(2);
				yield* this.affected_mob.updatehealth();
			}
		}
	} else if (this.stage === 4) {
		if (!this.transformed && !this.carrier) {
			this.original_dna = (yield* new_(this.affected_mob.dna.type));
			yield* this.affected_mob.dna.copy_dna(this.original_dna);
			to_chat(this.affected_mob, "<span class='danger'>You don't feel like yourself..</span>");
			yield* (transform_dna = rt.at(this.strain_data, "dna")).transfer_identity(this.affected_mob, { transfer_SE: 1 });
			this.affected_mob.real_name = this.affected_mob.dna.real_name;
			yield* this.affected_mob.updateappearance({ mutcolor_update: 1 });
			yield* this.affected_mob.domutcheck();
			this.transformed = 1;
			this.carrier = 1;
		}
	}
	return f.dot;
}, true);

// dna_spread.dm:67
rt.def("/datum/disease/dnaspread/proc/Destroy", function* Destroy(f: Frame) {
	if (this.original_dna && this.transformed && this.affected_mob) {
		yield* this.original_dna.transfer_identity(this.affected_mob, { transfer_SE: 1 });
		this.affected_mob.real_name = this.affected_mob.dna.real_name;
		yield* this.affected_mob.updateappearance({ mutcolor_update: 1 });
		yield* this.affected_mob.domutcheck();
		to_chat(this.affected_mob, "<span class='notice'>You feel more like yourself.</span>");
	}
	return (yield* parent_proc());
}, true);
