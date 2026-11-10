// Based on /tg/station's code/datums/diseases/retrovirus.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(960, "/datum/disease/dna_retrovirus", "/datum/disease", {
	SE: null,
	UI: null,
	restcure: 0,
	name: "Retrovirus",
	max_stages: 4,
	spread_text: "Contact",
	spread_flags: 32,
	cure_text: "Rest or an injection of mutadone",
	cure_chance: 6,
	agent: "",
	desc: "A DNA-altering retrovirus that scrambles the structural and unique enzymes of a host constantly.",
	severity: "Dangerous!",
	permeability_mod: 0.4,
	stage_prob: 2,
	viable_mobtypes: null,
});

// retrovirus.dm:9
rt.def("/datum/disease/dna_retrovirus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.viable_mobtypes = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// retrovirus.dm:20
rt.def("/datum/disease/dna_retrovirus/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.agent = `Virus class ${pick("A", "B", "C", "D", "E", "F")}${pick("A", "B", "C", "D", "E", "F")}-${rand(50, 300)}`;
	if (prob(40)) {
		this.cures = list("mutadone");
	} else {
		this.restcure = 1;
	}
	return f.dot;
}, true);

// retrovirus.dm:29
rt.def("/datum/disease/dna_retrovirus/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 1) {
		if (this.restcure) {
			if (this.affected_mob.lying && prob(30)) {
				to_chat(this.affected_mob, "<span class='notice'>You feel better.</span>");
				yield* this.cure();
				return f.dot;
			}
		}
		if (prob(8)) {
			to_chat(this.affected_mob, "<span class='danger'>Your head hurts.</span>");
		}
		if (prob(9)) {
			to_chat(this.affected_mob, "You feel a tingling sensation in your chest.");
		}
		if (prob(9)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel angry.</span>");
		}
	} else if (this.stage === 2) {
		if (this.restcure) {
			if (this.affected_mob.lying && prob(20)) {
				to_chat(this.affected_mob, "<span class='notice'>You feel better.</span>");
				yield* this.cure();
				return f.dot;
			}
		}
		if (prob(8)) {
			to_chat(this.affected_mob, "<span class='danger'>Your skin feels loose.</span>");
		}
		if (prob(10)) {
			to_chat(this.affected_mob, "You feel very strange.");
		}
		if (prob(4)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel a stabbing pain in your head!</span>");
			yield* this.affected_mob.Unconscious(40);
		}
		if (prob(4)) {
			to_chat(this.affected_mob, "<span class='danger'>Your stomach churns.</span>");
		}
	} else if (this.stage === 3) {
		if (this.restcure) {
			if (this.affected_mob.lying && prob(20)) {
				to_chat(this.affected_mob, "<span class='notice'>You feel better.</span>");
				yield* this.cure();
				return f.dot;
			}
		}
		if (prob(10)) {
			to_chat(this.affected_mob, "<span class='danger'>Your entire body vibrates.</span>");
		}
		if (prob(35)) {
			if (prob(50)) {
				yield* scramble_dna(this.affected_mob, 1, 0, rand(15, 45));
			} else {
				yield* scramble_dna(this.affected_mob, 0, 1, rand(15, 45));
			}
		}
	} else if (this.stage === 4) {
		if (this.restcure) {
			if (this.affected_mob.lying && prob(5)) {
				to_chat(this.affected_mob, "<span class='notice'>You feel better.</span>");
				yield* this.cure();
				return f.dot;
			}
		}
		if (!prob(60)) return f.dot;
		if (prob(50)) {
			yield* scramble_dna(this.affected_mob, 1, 0, rand(50, 75));
		} else {
			yield* scramble_dna(this.affected_mob, 0, 1, rand(50, 75));
		}
	}
	return f.dot;
}, true);
