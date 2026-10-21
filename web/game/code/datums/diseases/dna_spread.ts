// From code/datums/diseases/dna_spread.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/disease/dnaspread/proc/<init>  (code/datums/diseases/dna_spread.dm:7)
rt.def("/datum/disease/dnaspread/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("mutadone"));
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/disease/dnaspread/proc/stage_act  (code/datums/diseases/dna_spread.dm:18)  may sleep
rt.def("/datum/disease/dnaspread/proc/stage_act", function* stage_act(f: Frame) {
	let transform_dna: Value = null;
	let $0: any;
	f.vars = () => [transform_dna, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "dna", rt.sv(f, "affected_mob")))) {
		yield* g.srcCall(f, "cure");
	}
	if (truthy((rt.isIn(f, 16, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", rt.sv(f, "affected_mob"))))) ? 1 : 0))) {
		yield* g.srcCall(f, "cure");
	}
	if (!truthy(rt.at(rt.sv(f, "strain_data"), "dna"))) {
		rt.setAt(rt.sv(f, "strain_data"), "dna", (yield* g.new_(f, rt.gv(f, "type", rt.fv(f, "dna", rt.sv(f, "affected_mob"))), [])));
		yield* g.callName(f, rt.fv(f, "dna", rt.sv(f, "affected_mob")), "copy_dna", [rt.at(rt.sv(f, "strain_data"), "dna")]);
		rt.setFv(f, "carrier", live(f.src), 1);
		rt.setFv(f, "stage", live(f.src), 4);
		return live(f.dot);
	}
	$0 = rt.sv(f, "stage");
	if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [8]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["sneeze"]);
		}
		if (truthy(rt.op(f, "Prob", [], [8]))) {
			yield* g.callName(f, rt.sv(f, "affected_mob"), "emote", ["cough"]);
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your muscles ache.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, rt.sv(f, "affected_mob"), "take_bodypart_damage", [1]);
			}
		}
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>Your stomach hurts.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, rt.sv(f, "affected_mob"), "adjustToxLoss", [2]);
				yield* g.callName(f, rt.sv(f, "affected_mob"), "updatehealth", []);
			}
		}
	} else if ($0 === 4) {
		if ((!truthy(rt.sv(f, "transformed")) && !truthy(rt.sv(f, "carrier")))) {
			rt.setSv(f, "original_dna", (yield* g.new_(f, rt.gv(f, "type", rt.fv(f, "dna", rt.sv(f, "affected_mob"))), [])));
			yield* g.callName(f, rt.fv(f, "dna", rt.sv(f, "affected_mob")), "copy_dna", [rt.sv(f, "original_dna")]);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='danger'>You don't feel like yourself..</span>"]);
			yield* g.callName(f, (transform_dna = rt.at(rt.sv(f, "strain_data"), "dna")), "transfer_identity", [null, rt.sv(f, "affected_mob"), "transfer_SE", 1], rt.Args.Named);
			rt.setFv(f, "real_name", rt.sv(f, "affected_mob"), rt.gv(f, "real_name", rt.fv(f, "dna", rt.sv(f, "affected_mob"))));
			yield* g.callName(f, rt.sv(f, "affected_mob"), "updateappearance", ["mutcolor_update", 1], rt.Args.Named);
			yield* g.callName(f, rt.sv(f, "affected_mob"), "domutcheck", []);
			rt.setSv(f, "transformed", 1);
			rt.setSv(f, "carrier", 1);
		}
	}
	return live(f.dot);
}, true);

// /datum/disease/dnaspread/proc/Destroy  (code/datums/diseases/dna_spread.dm:67)  may sleep
rt.def("/datum/disease/dnaspread/proc/Destroy", function* Destroy(f: Frame) {
	if (((truthy(rt.sv(f, "original_dna")) && truthy(rt.sv(f, "transformed"))) && truthy(rt.sv(f, "affected_mob")))) {
		yield* g.callName(f, rt.sv(f, "original_dna"), "transfer_identity", [null, rt.sv(f, "affected_mob"), "transfer_SE", 1], rt.Args.Named);
		rt.setFv(f, "real_name", rt.sv(f, "affected_mob"), rt.gv(f, "real_name", rt.fv(f, "dna", rt.sv(f, "affected_mob"))));
		yield* g.callName(f, rt.sv(f, "affected_mob"), "updateappearance", ["mutcolor_update", 1], rt.Args.Named);
		yield* g.callName(f, rt.sv(f, "affected_mob"), "domutcheck", []);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "affected_mob"), "<span class='notice'>You feel more like yourself.</span>"]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
