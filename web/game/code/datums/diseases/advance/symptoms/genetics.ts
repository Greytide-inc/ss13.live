// Based on /tg/station's code/datums/diseases/advance/symptoms/genetics.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(994, "/datum/symptom/genetic_mutation", "/datum/symptom", {
	possible_mutations: null,
	archived_dna: null,
	name: "Deoxyribonucleic Acid Saboteur",
	stealth: -2,
	resistance: -3,
	stage_speed: 0,
	transmittable: -3,
	level: 6,
	severity: 3,
});

// genetics.dm:31
rt.def("/datum/symptom/genetic_mutation/proc/Activate", function* Activate(f: Frame, A: Value) {
	let C: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB * 3)) {
		if (!(C = A.affected_mob).has_dna()) {
			return f.dot;
		}
		if (A.stage === 4 || A.stage === 5) {
			to_chat(C, `<span class='warning'>${pick("Your skin feels itchy.", "You feel light headed.")}</span>`);
			yield* C.dna.remove_mutation_group(this.possible_mutations);
			yield* C.randmut(this.possible_mutations);
		}
	}
	return f.dot;
}, true);

// genetics.dm:45
rt.def("/datum/symptom/genetic_mutation/proc/Start", function Start(f: Frame, A: Value) {
	let M: Value = null;
	this.possible_mutations = rt.bitOr(GLOB.bad_mutations, GLOB.not_good_mutations) - rt.at(GLOB.mutations_list, "Monkified");
	if (!(M = A.affected_mob)) return f.dot;
	if (!M.has_dna()) {
		return f.dot;
	}
	this.archived_dna = M.dna.struc_enzymes;
	return f.dot;
});

// genetics.dm:55
rt.def("/datum/symptom/genetic_mutation/proc/End", function* End(f: Frame, A: Value) {
	let M: Value = null;
	if (!((M = A.affected_mob) && this.archived_dna)) return f.dot;
	if (!M.has_dna()) {
		return f.dot;
	}
	M.dna.struc_enzymes = this.archived_dna;
	yield* M.domutcheck();
	return f.dot;
}, true);
