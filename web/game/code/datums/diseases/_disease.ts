// From code/datums/diseases/_disease.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(945, "/datum/disease", "/datum", {
	visibility_flags: 0,
	disease_flags: 7,
	spread_flags: 64,
	form: "Virus",
	name: "No disease",
	desc: "",
	agent: "some microbes",
	spread_text: "",
	cure_text: "",
	stage: 1,
	max_stages: 0,
	stage_prob: 4,
	longevity: 150,
	viable_mobtypes: null,
	affected_mob: null,
	holder: null,
	cures: null,
	infectivity: 65,
	cure_chance: 8,
	carrier: 0,
	permeability_mod: 1,
	severity: "No threat",
	required_organs: null,
	needs_all_cures: 1,
	strain_data: null,
});

// /datum/disease/proc/<init>  (code/datums/diseases/_disease.dm:50)
rt.def("/datum/disease/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "viable_mobtypes", rt.list());
	$0 = $0;
	rt.setSv(f, "cures", rt.list());
	$0 = $0;
	rt.setSv(f, "required_organs", rt.list());
	$0 = $0;
	rt.setSv(f, "strain_data", rt.list());
	return f.dot;
});

// /datum/disease/proc/stage_act  (code/datums/diseases/_disease.dm:66)  may sleep
rt.def("/datum/disease/proc/stage_act", function* stage_act(f: Frame) {
	let cure: Value = null;
	f.vars = () => [cure];
	cure = (yield* g.srcCall(f, "has_cure"));
	if ((truthy(rt.sv(f, "carrier")) && !truthy(live(cure)))) {
		return live(f.dot);
	}
	rt.setSv(f, "stage", (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "stage"), rt.sv(f, "max_stages")])));
	if (!truthy(live(cure))) {
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "stage_prob")]))) {
			rt.setSv(f, "stage", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "stage"), 1), rt.sv(f, "max_stages")])));
		}
	} else {
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "cure_chance")]))) {
			rt.setSv(f, "stage", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "stage"), 1), 1])));
		}
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "disease_flags"), 1))) return f.dot;
	if (!(truthy(live(cure)) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "cure_chance")])))) return f.dot;
	yield* g.srcCall(f, "cure");
	return f.dot;
}, true);

// /datum/disease/proc/has_cure  (code/datums/diseases/_disease.dm:86)
rt.def("/datum/disease/proc/has_cure", function has_cure(f: Frame) {
	let C_id: Value = null;
	let $e: any;
	f.vars = () => [C_id, $e];
	if (!truthy(rt.bitAnd(rt.sv(f, "disease_flags"), 1))) {
		return 0;
	}
	f.dot = rt.len(f, rt.sv(f, "cures"));
	C_id = null;
	rt.forList(f, 0, rt.sv(f, "cures"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C_id = $e;
		if (!truthy(rt.callName(f, rt.fv(f, "reagents", rt.sv(f, "affected_mob")), "has_reagent", [live(C_id)]))) {
			f.dot = rt.inc(live(f.dot), -1);
		}
	}
	rt.endFor(f, 0);
	if (!(!truthy(live(f.dot)) || (truthy(rt.sv(f, "needs_all_cures")) && rt.lt(live(f.dot), rt.len(f, rt.sv(f, "cures")))))) return f.dot;
	return 0;
});

// /datum/disease/proc/spread  (code/datums/diseases/_disease.dm:97)  may sleep
rt.def("/datum/disease/proc/spread", function* spread(f: Frame, source: Value, force_spread: Value) {
	let spread_range: Value = null, _T: Value = null, C: Value = null, V: Value = null, Temp: Value = null;
	let $0: any, $e: any;
	f.vars = () => [source, force_spread, spread_range, _T, C, V, Temp, $0, $e];
	if (live(force_spread) === null) {
		force_spread = 0;
	}
	if ((((truthy(rt.bitAnd(rt.sv(f, "spread_flags"), 1)) || truthy(rt.bitAnd(rt.sv(f, "spread_flags"), 2))) || truthy(rt.bitAnd(rt.sv(f, "spread_flags"), 4))) && !truthy(live(force_spread)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "affected_mob"))) {
		if ((truthy((yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "affected_mob")), "has_reagent", ["spaceacillin"]))) || (rt.gt(rt.fv(f, "satiety", rt.sv(f, "affected_mob")), 0) && truthy(rt.op(f, "Prob", [], [divide(rt.fv(f, "satiety", rt.sv(f, "affected_mob")), 10)]))))) {
			return live(f.dot);
		}
	}
	spread_range = 1;
	if (truthy(live(force_spread))) {
		spread_range = live(force_spread);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "spread_flags"), 64))) {
		spread_range = rt.inc(live(spread_range), 1);
	}
	if (!truthy(live(source))) {
		if (truthy(rt.sv(f, "affected_mob"))) {
			source = rt.sv(f, "affected_mob");
		} else {
			return live(f.dot);
		}
	}
	if (!truthy((rt.istype((_T = rt.fv(f, "loc", live(source))), T("/turf")) ? 1 : 0))) return f.dot;
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [live(spread_range), live(source)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy((V = rt.getStep(f, live(C), 0)))) {
			while (true) {
				if (isEqual(live(V), live(_T))) {
					yield* g.callName(f, live(C), "ContractDisease", [live(f.src)]);
					break;
				}
				Temp = (yield* g.call(f, P("/proc/get_step_towards"), null, [live(V), live(_T)]));
				if (isEqual(rt.fv(f, "CanAtmosPass", live(V)), -1)) {
					$0 = (yield* g.callName(f, live(V), "CanAtmosPass", [live(Temp)]));
				} else {
					if (isEqual(rt.fv(f, "CanAtmosPass", live(V)), -2)) {
						$0 = (!truthy(rt.fv(f, "density", live(V))) ? 1 : 0);
					} else {
						$0 = rt.fv(f, "CanAtmosPass", live(V));
					}
				}
				if (!truthy($0)) {
					break;
				}
				V = live(Temp);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/disease/proc/process  (code/datums/diseases/_disease.dm:133)  may sleep
rt.def("/datum/disease/proc/process", function* process(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		(rt.modField(f, rt.gl("SSdisease"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "infectivity")]))) {
		yield* g.srcCall(f, "spread", rt.sv(f, "holder"));
	}
	if (truthy(rt.sv(f, "affected_mob"))) {
		D = null;
		rt.forList(f, 0, rt.fv(f, "viruses", rt.sv(f, "affected_mob")), T("/datum/disease"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			if (!isEqual(live(D), live(f.src))) {
				if (truthy((yield* g.srcCall(f, "IsSame", live(D))))) {
					yield* g.call(f, P("/proc/qdel"), null, [live(D)]);
				}
			}
		}
		rt.endFor(f, 0);
		if (isEqual(rt.sv(f, "holder"), rt.sv(f, "affected_mob"))) {
			if (!isEqual(rt.fv(f, "stat", rt.sv(f, "affected_mob")), 2)) {
				yield* g.srcCall(f, "stage_act");
			}
		}
	}
	if (truthy(rt.sv(f, "affected_mob"))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [70]))) return f.dot;
	if (!rt.le(rt.incSrcVar(f, "longevity", -1, false), 0)) return f.dot;
	yield* g.srcCall(f, "cure");
	return f.dot;
}, true, { waitfor: false });

// /datum/disease/proc/cure  (code/datums/diseases/_disease.dm:158)  may sleep
rt.def("/datum/disease/proc/cure", function* cure(f: Frame) {
	if (truthy(rt.sv(f, "affected_mob"))) {
		if (truthy(rt.bitAnd(rt.sv(f, "disease_flags"), 4))) {
			if (!truthy((rt.isIn(f, rt.sv(f, "type"), rt.fv(f, "resistances", rt.sv(f, "affected_mob"))) ? 1 : 0))) {
				rt.modField(f, rt.sv(f, "affected_mob"), "resistances", rt.sv(f, "type"), add);
			}
		}
		yield* g.srcCall(f, "remove_virus");
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/disease/proc/New  (code/datums/diseases/_disease.dm:166)  may sleep
rt.def("/datum/disease/proc/New", function* New(f: Frame) {
	let H: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [H, O, $e];
	if ((truthy(rt.sv(f, "required_organs")) && truthy(rt.len(f, rt.sv(f, "required_organs"))))) {
		if (truthy((rt.istype(rt.sv(f, "affected_mob"), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = rt.sv(f, "affected_mob");
			O = null;
			rt.forList(f, 0, rt.sv(f, "required_organs"), T("/obj/item/organ"));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				if (!truthy(rt.locateIn(f, live(O), rt.fv(f, "bodyparts", live(H))))) {
					if (!truthy(rt.locateIn(f, live(O), rt.fv(f, "internal_organs", live(H))))) {
						yield* g.srcCall(f, "cure");
						return live(f.dot);
					}
				}
			}
			rt.endFor(f, 0);
		}
	}
	rt.modField(f, rt.gl("SSdisease"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /datum/disease/proc/IsSame  (code/datums/diseases/_disease.dm:179)
rt.def("/datum/disease/proc/IsSame", function IsSame(f: Frame, D: Value) {
	if (truthy(rt.op(f, "IsType", [], [live(f.src), rt.fv(f, "type", live(D))]))) {
		return 1;
	}
	return 0;
});

// /datum/disease/proc/Copy  (code/datums/diseases/_disease.dm:185)  may sleep
rt.def("/datum/disease/proc/Copy", function* Copy(f: Frame) {
	let D: Value = null;
	f.vars = () => [D];
	rt.setFv(f, "strain_data", (D = (yield* g.new_(f, rt.sv(f, "type"), []))), (yield* g.callName(f, rt.sv(f, "strain_data"), "Copy", [])));
	return live(D);
}, true);

// /datum/disease/proc/Destroy  (code/datums/diseases/_disease.dm:195)  may sleep
rt.def("/datum/disease/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.fv(f, "processing", rt.gl("SSdisease")), "Remove", [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/disease/proc/IsSpreadByTouch  (code/datums/diseases/_disease.dm:200)
rt.def("/datum/disease/proc/IsSpreadByTouch", function IsSpreadByTouch(f: Frame) {
	if (((truthy(rt.bitAnd(rt.sv(f, "spread_flags"), 8)) || truthy(rt.bitAnd(rt.sv(f, "spread_flags"), 16))) || truthy(rt.bitAnd(rt.sv(f, "spread_flags"), 32)))) {
		return 1;
	}
	return 0;
});

// /datum/disease/proc/remove_virus  (code/datums/diseases/_disease.dm:206)
rt.def("/datum/disease/proc/remove_virus", function remove_virus(f: Frame) {
	(rt.modField(f, rt.sv(f, "affected_mob"), "viruses", live(f.src), subtract));
	rt.callName(f, rt.sv(f, "affected_mob"), "med_hud_set_status", []);
	return f.dot;
});
