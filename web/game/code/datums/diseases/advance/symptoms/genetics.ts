// From code/datums/diseases/advance/symptoms/genetics.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/symptom/genetic_mutation/proc/Activate  (code/datums/diseases/advance/symptoms/genetics.dm:31)  may sleep
rt.def("/datum/symptom/genetic_mutation/proc/Activate", function* Activate(f: Frame) {
	let C: Value = null;
	let $0: any;
	f.vars = () => [C, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [multiply(rt.gl("SYMPTOM_ACTIVATION_PROB"), 3)]))) {
		if (!truthy((yield* g.callName(f, (C = rt.fv(f, "affected_mob", live(f.args[0]))), "has_dna", [])))) {
			return live(f.dot);
		}
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 4 || $0 === 5) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(C), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["Your skin feels itchy.", "You feel light headed."])])]);
			yield* g.callName(f, rt.fv(f, "dna", live(C)), "remove_mutation_group", [rt.sv(f, "possible_mutations")]);
			yield* g.callName(f, live(C), "randmut", [rt.sv(f, "possible_mutations")]);
		}
	}
	return live(f.dot);
}, true, { args: ["A"] });

// /datum/symptom/genetic_mutation/proc/Start  (code/datums/diseases/advance/symptoms/genetics.dm:45)
rt.def("/datum/symptom/genetic_mutation/proc/Start", function Start(f: Frame, A: Value) {
	let M: Value = null;
	f.vars = () => [M];
	rt.setSv(f, "possible_mutations", subtract(rt.bitOr(rt.gl("bad_mutations"), rt.gl("not_good_mutations")), rt.at(rt.gl("mutations_list"), "Monkified")));
	if (!truthy((M = rt.fv(f, "affected_mob", live(A))))) return f.dot;
	if (!truthy(rt.callName(f, live(M), "has_dna", []))) {
		return live(f.dot);
	}
	rt.setSv(f, "archived_dna", rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(M))));
	return f.dot;
});

// /datum/symptom/genetic_mutation/proc/End  (code/datums/diseases/advance/symptoms/genetics.dm:55)  may sleep
rt.def("/datum/symptom/genetic_mutation/proc/End", function* End(f: Frame, A: Value) {
	let M: Value = null;
	f.vars = () => [A, M];
	if (!(truthy((M = rt.fv(f, "affected_mob", live(A)))) && truthy(rt.sv(f, "archived_dna")))) return f.dot;
	if (!truthy((yield* g.callName(f, live(M), "has_dna", [])))) {
		return live(f.dot);
	}
	rt.setFv(f, "struc_enzymes", rt.fv(f, "dna", live(M)), rt.sv(f, "archived_dna"));
	yield* g.callName(f, live(M), "domutcheck", []);
	return f.dot;
}, true);
