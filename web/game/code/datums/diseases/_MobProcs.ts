// From code/datums/diseases/_MobProcs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/proc/HasDisease  (code/datums/diseases/_MobProcs.dm:3)  may sleep
rt.def("/mob/proc/HasDisease", function* HasDisease(f: Frame, D: Value) {
	let DD: Value = null;
	let $e: any;
	f.vars = () => [D, DD, $e];
	DD = null;
	rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		DD = $e;
		if (truthy((yield* g.callName(f, live(D), "IsSame", [live(DD)])))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /mob/proc/CanContractDisease  (code/datums/diseases/_MobProcs.dm:10)  may sleep
rt.def("/mob/proc/CanContractDisease", function* CanContractDisease(f: Frame, D: Value) {
	f.vars = () => [D];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return 0;
	}
	if (truthy((rt.isIn(f, (yield* g.callName(f, live(D), "GetDiseaseID", [])), rt.sv(f, "resistances")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((yield* g.srcCall(f, "HasDisease", live(D))))) {
		return 0;
	}
	if (!truthy((rt.isIn(f, rt.sv(f, "type"), rt.fv(f, "viable_mobtypes", live(D))) ? 1 : 0))) {
		return 0;
	}
	return 1;
}, true);

// /mob/proc/ContractDisease  (code/datums/diseases/_MobProcs.dm:26)  may sleep
rt.def("/mob/proc/ContractDisease", function* ContractDisease(f: Frame, D: Value) {
	f.vars = () => [D];
	if (!truthy((yield* g.srcCall(f, "CanContractDisease", live(D))))) {
		return 0;
	}
	yield* g.srcCall(f, "AddDisease", live(D));
	return f.dot;
}, true);

// /mob/proc/AddDisease  (code/datums/diseases/_MobProcs.dm:32)  may sleep
rt.def("/mob/proc/AddDisease", function* AddDisease(f: Frame, D: Value) {
	let _P: Value = null, DD: Value = null, DD_0: Value = null, skipped: Value = null, V: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [D, _P, DD, DD_0, skipped, V, L, $e];
	_P = null;
	rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease/advance"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if (truthy((rt.istype(live(D), T("/datum/disease/advance")) ? 1 : 0))) {
			DD = live(D);
			if (rt.lt((yield* g.callName(f, live(_P), "totalResistance", [])), (yield* g.callName(f, live(DD), "totalTransmittable", [])))) {
				yield* g.callName(f, live(_P), "remove_virus", []);
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, rt.sv(f, "viruses")))) return f.dot;
	rt.modSrcVar(f, "viruses", (DD_0 = (yield* g.new_(f, rt.fv(f, "type", live(D)), [1, live(D), 0]))), add);
	rt.setFv(f, "affected_mob", live(DD_0), live(f.src));
	rt.setFv(f, "holder", live(DD_0), live(f.src));
	skipped = rt.list("affected_mob", "holder", "carrier", "stage", "type", "parent_type", "vars", "transformed");
	V = null;
	rt.forList(f, 0, rt.fv(f, "vars", live(DD_0)));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy((rt.isIn(f, live(V), live(skipped)) ? 1 : 0))) {
			continue;
		}
		if (truthy((rt.istype(rt.index(rt.fv(f, "vars", live(DD_0)), live(V)), T("/list")) ? 1 : 0))) {
			L = rt.index(rt.fv(f, "vars", live(D)), live(V));
			rt.setAt(rt.fv(f, "vars", live(DD_0)), live(V), (yield* g.callName(f, live(L), "Copy", [])));
		} else {
			rt.setAt(rt.fv(f, "vars", live(DD_0)), live(V), rt.index(rt.fv(f, "vars", live(D)), live(V)));
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.fv(f, "affected_mob", live(DD_0)), "med_hud_set_status", []);
	return f.dot;
}, true);

// /mob/living/carbon/proc/ContractDisease  (code/datums/diseases/_MobProcs.dm:59)  may sleep
rt.def("/mob/living/carbon/proc/ContractDisease", function* ContractDisease(f: Frame, D: Value) {
	let Cl: Value = null, passed: Value = null, head_ch: Value = null, body_ch: Value = null, hands_ch: Value = null, feet_ch: Value = null, target_zone: Value = null, H: Value = null, M: Value = null;
	let $0: any;
	f.vars = () => [D, Cl, passed, head_ch, body_ch, hands_ch, feet_ch, target_zone, H, M, $0];
	if (!truthy((yield* g.srcCall(f, "CanContractDisease", live(D))))) {
		return 0;
	}
	Cl = null;
	passed = 1;
	head_ch = 100;
	body_ch = 100;
	hands_ch = 25;
	feet_ch = 25;
	if (truthy(rt.bitAnd(rt.fv(f, "spread_flags", live(D)), 16))) {
		head_ch = 0;
		body_ch = 0;
		hands_ch = 100;
		feet_ch = 0;
	}
	if (truthy(rt.bitAnd(rt.fv(f, "spread_flags", live(D)), 8))) {
		head_ch = 0;
		body_ch = 0;
		hands_ch = 0;
		feet_ch = 100;
	}
	if (truthy(rt.op(f, "Prob", [], [divide(15, rt.fv(f, "permeability_mod", live(D)))]))) {
		return live(f.dot);
	}
	if ((rt.gt(rt.sv(f, "satiety"), 0) && truthy(rt.op(f, "Prob", [], [divide(rt.sv(f, "satiety"), 10)])))) {
		return live(f.dot);
	}
	target_zone = rt.op(f, "PickWeighted", [4], [live(head_ch), 1, live(body_ch), 2, live(hands_ch), 3, live(feet_ch), 4]);
	if (truthy((rt.istype(live(f.src), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(f.src);
		$0 = live(target_zone);
		if ($0 === 1) {
			if ((truthy((rt.istype(rt.fv(f, "head", live(H)), T("/obj")) ? 1 : 0)) && !truthy((rt.istype(rt.fv(f, "head", live(H)), T("/obj/item/weapon/paper")) ? 1 : 0)))) {
				passed = rt.op(f, "Prob", [], [subtract(multiply(rt.gv(f, "permeability_coefficient", (Cl = rt.fv(f, "head", live(H)))), 100), 1)]);
			}
			if ((truthy(live(passed)) && truthy((rt.istype(rt.fv(f, "wear_mask", live(H)), T("/obj")) ? 1 : 0)))) {
				passed = rt.op(f, "Prob", [], [subtract(multiply(rt.gv(f, "permeability_coefficient", (Cl = rt.fv(f, "wear_mask", live(H)))), 100), 1)]);
			}
			if ((truthy(live(passed)) && truthy((rt.istype(rt.fv(f, "wear_neck", live(H)), T("/obj")) ? 1 : 0)))) {
				passed = rt.op(f, "Prob", [], [subtract(multiply(rt.gv(f, "permeability_coefficient", (Cl = rt.fv(f, "wear_neck", live(H)))), 100), 1)]);
			}
		} else if ($0 === 2) {
			if (truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj")) ? 1 : 0))) {
				passed = rt.op(f, "Prob", [], [subtract(multiply(rt.gv(f, "permeability_coefficient", (Cl = rt.fv(f, "wear_suit", live(H)))), 100), 1)]);
			}
			if ((truthy(live(passed)) && truthy((rt.istype(14, T("/obj")) ? 1 : 0)))) {
				passed = rt.op(f, "Prob", [], [subtract(multiply(rt.gv(f, "permeability_coefficient", (Cl = 14)), 100), 1)]);
			}
		} else if ($0 === 3) {
			if ((truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj")) ? 1 : 0)) && truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "wear_suit", live(H))), 1536)))) {
				passed = rt.op(f, "Prob", [], [subtract(multiply(rt.gv(f, "permeability_coefficient", (Cl = rt.fv(f, "wear_suit", live(H)))), 100), 1)]);
			}
			if ((truthy(live(passed)) && truthy((rt.istype(rt.fv(f, "gloves", live(H)), T("/obj")) ? 1 : 0)))) {
				passed = rt.op(f, "Prob", [], [subtract(multiply(rt.gv(f, "permeability_coefficient", (Cl = rt.fv(f, "gloves", live(H)))), 100), 1)]);
			}
		} else if ($0 === 4) {
			if ((truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj")) ? 1 : 0)) && truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "wear_suit", live(H))), 96)))) {
				passed = rt.op(f, "Prob", [], [subtract(multiply(rt.gv(f, "permeability_coefficient", (Cl = rt.fv(f, "wear_suit", live(H)))), 100), 1)]);
			}
			if ((truthy(live(passed)) && truthy((rt.istype(rt.fv(f, "shoes", live(H)), T("/obj")) ? 1 : 0)))) {
				passed = rt.op(f, "Prob", [], [subtract(multiply(rt.gv(f, "permeability_coefficient", (Cl = rt.fv(f, "shoes", live(H)))), 100), 1)]);
			}
		}
	} else {
		if (truthy((rt.istype(live(f.src), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
			M = live(f.src);
			$0 = live(target_zone);
			if ($0 === 1) {
				if ((truthy(rt.fv(f, "wear_mask", live(M))) && truthy((rt.istype(rt.fv(f, "wear_mask", live(M)), T("/obj")) ? 1 : 0)))) {
					passed = rt.op(f, "Prob", [], [subtract(multiply(rt.gv(f, "permeability_coefficient", (Cl = rt.fv(f, "wear_mask", live(M)))), 100), 1)]);
				}
			}
		}
	}
	if (((!truthy(live(passed)) && truthy(rt.bitAnd(rt.fv(f, "spread_flags", live(D)), 64))) && !truthy(rt.sv(f, "internal")))) {
		passed = rt.op(f, "Prob", [], [subtract(multiply(50, rt.fv(f, "permeability_mod", live(D))), 1)]);
	}
	if (!truthy(live(passed))) return f.dot;
	yield* g.srcCall(f, "AddDisease", live(D));
	return f.dot;
}, true);

// /mob/proc/ForceContractDisease  (code/datums/diseases/_MobProcs.dm:144)  may sleep
rt.def("/mob/proc/ForceContractDisease", function* ForceContractDisease(f: Frame, D: Value) {
	f.vars = () => [D];
	if (!truthy((yield* g.srcCall(f, "CanContractDisease", live(D))))) {
		return 0;
	}
	yield* g.srcCall(f, "AddDisease", live(D));
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/CanContractDisease  (code/datums/diseases/_MobProcs.dm:150)  may sleep
rt.def("/mob/living/carbon/human/proc/CanContractDisease", function* CanContractDisease(f: Frame) {
	if ((truthy(rt.sv(f, "dna")) && truthy((rt.isIn(f, 14, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0)))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["D"] });
