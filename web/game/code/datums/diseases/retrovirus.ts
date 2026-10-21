// From code/datums/diseases/retrovirus.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/disease/dna_retrovirus/proc/<init>  (code/datums/diseases/retrovirus.dm:9)
rt.def("/datum/disease/dna_retrovirus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/disease/dna_retrovirus/proc/New  (code/datums/diseases/retrovirus.dm:20)  may sleep
rt.def("/datum/disease/dna_retrovirus/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "agent", fmt("Virus class ＀＀-＀", [rt.op(f, "PickUnweighted", [6], ["A", "B", "C", "D", "E", "F"]), rt.op(f, "PickUnweighted", [6], ["A", "B", "C", "D", "E", "F"]), (yield* g.call(f, P("/proc/rand"), null, [50, 300]))]));
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		rt.setSv(f, "cures", rt.list("mutadone"));
	} else {
		rt.setSv(f, "restcure", 1);
	}
	return f.dot;
}, true);

// /datum/disease/dna_retrovirus/proc/stage_act  (code/datums/diseases/retrovirus.dm:29)  may sleep
rt.def("/datum/disease/dna_retrovirus/proc/stage_act", function* stage_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "stage");
	if ($0 === 1) {
		if (truthy(rt.sv(f, "restcure"))) {
			if ((truthy(rt.fv(f, "lying", rt.sv(f, "affected_mob"))) && truthy(rt.op(f, "Prob", [], [30])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel better.</span>"]);
				yield* g.srcCall(f, "cure");
				return live(f.dot);
			}
		}
		if (truthy(rt.op(f, "Prob", [], [8]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your head hurts.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [9]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "You feel a tingling sensation in your chest."]);
		}
		if (truthy(rt.op(f, "Prob", [], [9]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel angry.</span>"]);
		}
	} else if ($0 === 2) {
		if (truthy(rt.sv(f, "restcure"))) {
			if ((truthy(rt.fv(f, "lying", rt.sv(f, "affected_mob"))) && truthy(rt.op(f, "Prob", [], [20])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel better.</span>"]);
				yield* g.srcCall(f, "cure");
				return live(f.dot);
			}
		}
		if (truthy(rt.op(f, "Prob", [], [8]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your skin feels loose.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "You feel very strange."]);
		}
		if (truthy(rt.op(f, "Prob", [], [4]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You feel a stabbing pain in your head!</span>"]);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "Unconscious", [40]);
		}
		if (truthy(rt.op(f, "Prob", [], [4]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your stomach churns.</span>"]);
		}
	} else if ($0 === 3) {
		if (truthy(rt.sv(f, "restcure"))) {
			if ((truthy(rt.fv(f, "lying", rt.sv(f, "affected_mob"))) && truthy(rt.op(f, "Prob", [], [20])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel better.</span>"]);
				yield* g.srcCall(f, "cure");
				return live(f.dot);
			}
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your entire body vibrates.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [35]))) {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.call(f, P("/proc/scramble_dna"), null, [rt.sv(f, "affected_mob"), 1, 0, (yield* g.call(f, P("/proc/rand"), null, [15, 45]))]);
			} else {
				yield* g.call(f, P("/proc/scramble_dna"), null, [rt.sv(f, "affected_mob"), 0, 1, (yield* g.call(f, P("/proc/rand"), null, [15, 45]))]);
			}
		}
	} else if ($0 === 4) {
		if (truthy(rt.sv(f, "restcure"))) {
			if ((truthy(rt.fv(f, "lying", rt.sv(f, "affected_mob"))) && truthy(rt.op(f, "Prob", [], [5])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel better.</span>"]);
				yield* g.srcCall(f, "cure");
				return live(f.dot);
			}
		}
		if (!truthy(rt.op(f, "Prob", [], [60]))) return f.dot;
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.call(f, P("/proc/scramble_dna"), null, [rt.sv(f, "affected_mob"), 1, 0, (yield* g.call(f, P("/proc/rand"), null, [50, 75]))]);
		} else {
			yield* g.call(f, P("/proc/scramble_dna"), null, [rt.sv(f, "affected_mob"), 0, 1, (yield* g.call(f, P("/proc/rand"), null, [50, 75]))]);
		}
	}
	return f.dot;
}, true);
