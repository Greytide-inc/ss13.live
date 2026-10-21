// From code/datums/diseases/advance/advance.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(972, "/datum/disease/advance", "/datum/disease", {
	properties: null,
	symptoms: null,
	id: "",
	processing: 0,
	name: "Unknown",
	desc: "An engineered disease which can contain a multitude of symptoms.",
	form: "Advance Disease",
	agent: "advance microbes",
	max_stages: 5,
	spread_text: "Unknown",
	viable_mobtypes: null,
}, { global: { advance_cures: 641 } });

// /datum/disease/advance/proc/<init>  (code/datums/diseases/advance/advance.dm:31)
rt.def("/datum/disease/advance/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "properties", rt.list());
	$0 = $0;
	rt.setSv(f, "symptoms", rt.list());
	$0 = $0;
	rt.setSv(f, "viable_mobtypes", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

// /datum/disease/advance/proc/New  (code/datums/diseases/advance/advance.dm:51)  may sleep
rt.def("/datum/disease/advance/proc/New", function* New(f: Frame, process: Value, D: Value) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [process, D, S, $e];
	if (live(process) === null) {
		process = 1;
	}
	if (!truthy((rt.istype(live(D), T("/datum/disease/advance")) ? 1 : 0))) {
		D = null;
	}
	if ((!truthy(rt.sv(f, "symptoms")) || !truthy(rt.len(f, rt.sv(f, "symptoms"))))) {
		if (((!truthy(live(D)) || !truthy(rt.fv(f, "symptoms", live(D)))) || !truthy(rt.getLen(f, rt.fv(f, "symptoms", live(D)))))) {
			rt.setSv(f, "symptoms", (yield* g.srcCall(f, "GenerateSymptoms", 0, 2)));
		} else {
			S = null;
			rt.forList(f, 0, rt.fv(f, "symptoms", live(D)), T("/datum/symptom"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				rt.modSrcVar(f, "symptoms", (yield* g.new_(f, rt.fv(f, "type", live(S)), [])), add);
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.srcCall(f, "Refresh");
	yield* g.callSuper(f, [live(process), live(D)]);
	return live(f.dot);
}, true);

// /datum/disease/advance/proc/Destroy  (code/datums/diseases/advance/advance.dm:69)  may sleep
rt.def("/datum/disease/advance/proc/Destroy", function* Destroy(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	if (truthy(rt.sv(f, "processing"))) {
		S = null;
		rt.forList(f, 0, rt.sv(f, "symptoms"), T("/datum/symptom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			yield* g.callName(f, live(S), "End", [live(f.src)]);
		}
		rt.endFor(f, 0);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/disease/advance/proc/stage_act  (code/datums/diseases/advance/advance.dm:75)  may sleep
rt.def("/datum/disease/advance/proc/stage_act", function* stage_act(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "symptoms")) && truthy(rt.len(f, rt.sv(f, "symptoms"))))) {
		if (!truthy(rt.sv(f, "processing"))) {
			rt.setSv(f, "processing", 1);
			S = null;
			rt.forList(f, 0, rt.sv(f, "symptoms"), T("/datum/symptom"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				yield* g.callName(f, live(S), "Start", [live(f.src)]);
			}
			rt.endFor(f, 0);
		}
		S = null;
		rt.forList(f, 0, rt.sv(f, "symptoms"), T("/datum/symptom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			yield* g.callName(f, live(S), "Activate", [live(f.src)]);
		}
		rt.endFor(f, 0);
	} else {
		yield* g.call(f, P("/proc/CRASH"), null, ["We do not have any symptoms during stage_act()!"]);
	}
	return f.dot;
}, true);

// /datum/disease/advance/proc/IsSame  (code/datums/diseases/advance/advance.dm:91)  may sleep
rt.def("/datum/disease/advance/proc/IsSame", function* IsSame(f: Frame, D: Value) {
	f.vars = () => [D];
	if (!truthy((rt.istype(live(D), T("/datum/disease/advance")) ? 1 : 0))) {
		return 0;
	}
	if (!isEqual((yield* g.callName(f, live(f.src), "GetDiseaseID", [])), (yield* g.callName(f, live(D), "GetDiseaseID", [])))) {
		return 0;
	}
	return 1;
}, true);

// /datum/disease/advance/proc/cure  (code/datums/diseases/advance/advance.dm:101)  may sleep
rt.def("/datum/disease/advance/proc/cure", function* cure(f: Frame, resistance: Value) {
	let id: Value = null;
	f.vars = () => [resistance, id];
	if (live(resistance) === null) {
		resistance = 1;
	}
	if (truthy(rt.sv(f, "affected_mob"))) {
		id = fmt("＀", [(yield* g.srcCall(f, "GetDiseaseID"))]);
		if ((truthy(live(resistance)) && !truthy((rt.isIn(f, live(id), rt.fv(f, "resistances", rt.sv(f, "affected_mob"))) ? 1 : 0)))) {
			rt.setAt(rt.fv(f, "resistances", rt.sv(f, "affected_mob")), live(id), live(id));
		}
		yield* g.srcCall(f, "remove_virus");
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/disease/advance/proc/Copy  (code/datums/diseases/advance/advance.dm:109)  may sleep
rt.def("/datum/disease/advance/proc/Copy", function* Copy(f: Frame, process: Value) {
	f.vars = () => [process];
	if (live(process) === null) {
		process = 0;
	}
	return (yield* g.new_(f, T("/datum/disease/advance"), [live(process), live(f.src), 1]));
}, true);

// /datum/disease/advance/proc/Mix  (code/datums/diseases/advance/advance.dm:119)  may sleep
rt.def("/datum/disease/advance/proc/Mix", function* Mix(f: Frame, D: Value) {
	let possible_symptoms: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [D, possible_symptoms, S, $e];
	if (truthy((yield* g.callName(f, live(f.src), "IsSame", [live(D)])))) return f.dot;
	possible_symptoms = (yield* g.call(f, P("/proc/shuffle"), null, [rt.fv(f, "symptoms", live(D))]));
	S = null;
	rt.forList(f, 0, live(possible_symptoms), T("/datum/symptom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		yield* g.srcCall(f, "AddSymptom", (yield* g.new_(f, rt.fv(f, "type", live(S)), [])));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/disease/advance/proc/HasSymptom  (code/datums/diseases/advance/advance.dm:125)
rt.def("/datum/disease/advance/proc/HasSymptom", function HasSymptom(f: Frame, S: Value) {
	let symp: Value = null;
	let $e: any;
	f.vars = () => [symp, $e];
	symp = null;
	rt.forList(f, 0, rt.sv(f, "symptoms"), T("/datum/symptom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		symp = $e;
		if (isEqual(rt.fv(f, "id", live(symp)), rt.fv(f, "id", live(S)))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /datum/disease/advance/proc/GenerateSymptoms  (code/datums/diseases/advance/advance.dm:133)  may sleep
rt.def("/datum/disease/advance/proc/GenerateSymptoms", function* GenerateSymptoms(f: Frame, level_min: Value, level_max: Value, amount_get: Value) {
	let generated: Value = null, possible_symptoms: Value = null, symp: Value = null, S: Value = null, number_of: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [level_min, level_max, amount_get, generated, possible_symptoms, symp, S, number_of, i, $e];
	if (live(amount_get) === null) {
		amount_get = 0;
	}
	generated = rt.list();
	possible_symptoms = rt.list();
	symp = null;
	rt.forList(f, 0, rt.gl("list_symptoms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		symp = $e;
		if ((rt.ge(rt.gv(f, "level", (S = (yield* g.new_(f, live(symp), [])))), live(level_min)) && rt.le(rt.fv(f, "level", live(S)), live(level_max)))) {
			if (!truthy((yield* g.srcCall(f, "HasSymptom", live(S))))) {
				possible_symptoms = rt.modify(live(possible_symptoms), live(S), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(possible_symptoms)))) {
		return live(generated);
	}
	number_of = live(amount_get);
	if (!truthy(live(amount_get))) {
		number_of = 1;
		while (truthy(rt.op(f, "Prob", [], [20]))) {
			number_of = rt.modify(live(number_of), 1, add);
		}
	}
	i = null;
	i = 1;
	while (rt.ge(live(number_of), live(i)) && truthy(rt.len(f, live(possible_symptoms)))) {
		generated = rt.modify(live(generated), (yield* g.call(f, P("/proc/pick_n_take"), null, [live(possible_symptoms)])), add);
		i = rt.inc(live(i), 1);
	}
	return live(generated);
}, true);

// /datum/disease/advance/proc/Refresh  (code/datums/diseases/advance/advance.dm:160)  may sleep
rt.def("/datum/disease/advance/proc/Refresh", function* Refresh(f: Frame, new_name: Value) {
	let A: Value = null;
	f.vars = () => [new_name, A];
	if (live(new_name) === null) {
		new_name = 0;
	}
	yield* g.srcCall(f, "GenerateProperties");
	yield* g.srcCall(f, "AssignProperties");
	rt.setSv(f, "id", null);
	if (!truthy(rt.index(rt.fv(f, "archive_diseases", rt.gl("SSdisease")), (yield* g.srcCall(f, "GetDiseaseID"))))) {
		if (truthy(live(new_name))) {
			yield* g.srcCall(f, "AssignName");
		}
		rt.setAt(rt.fv(f, "archive_diseases", rt.gl("SSdisease")), (yield* g.srcCall(f, "GetDiseaseID")), live(f.src));
		rt.setAt(rt.fv(f, "archive_diseases", rt.gl("SSdisease")), (yield* g.srcCall(f, "GetDiseaseID")), (yield* g.new_(f, T("/datum/disease/advance"), [0, live(f.src), 1])));
	}
	yield* g.srcCall(f, "AssignName", rt.gv(f, "name", (A = rt.index(rt.fv(f, "archive_diseases", rt.gl("SSdisease")), (yield* g.srcCall(f, "GetDiseaseID"))))));
	return f.dot;
}, true);

// /datum/disease/advance/proc/GenerateProperties  (code/datums/diseases/advance/advance.dm:176)
rt.def("/datum/disease/advance/proc/GenerateProperties", function GenerateProperties(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	if ((!truthy(rt.sv(f, "symptoms")) || !truthy(rt.len(f, rt.sv(f, "symptoms"))))) {
		rt.call(f, P("/proc/CRASH"), null, ["We did not have any symptoms before generating properties."]);
		return live(f.dot);
	}
	rt.setSv(f, "properties", rt.alist(f, ["resistance", 0, "stealth", 0, "stage_rate", 0, "transmittable", 0, "severity", 0]));
	S = null;
	rt.forList(f, 0, rt.sv(f, "symptoms"), T("/datum/symptom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.modAt(rt.sv(f, "properties"), "resistance", rt.fv(f, "resistance", live(S)), add);
		rt.modAt(rt.sv(f, "properties"), "stealth", rt.fv(f, "stealth", live(S)), add);
		rt.modAt(rt.sv(f, "properties"), "stage_rate", rt.fv(f, "stage_speed", live(S)), add);
		rt.modAt(rt.sv(f, "properties"), "transmittable", rt.fv(f, "transmittable", live(S)), add);
		rt.setAt(rt.sv(f, "properties"), "severity", rt.call(f, P("/proc/max"), null, [rt.at(rt.sv(f, "properties"), "severity"), rt.fv(f, "severity", live(S))]));
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /datum/disease/advance/proc/AssignProperties  (code/datums/diseases/advance/advance.dm:193)
rt.def("/datum/disease/advance/proc/AssignProperties", function AssignProperties(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if ((truthy(rt.sv(f, "properties")) && truthy(rt.len(f, rt.sv(f, "properties"))))) {
		$0 = rt.at(rt.sv(f, "properties"), "stealth");
		if ($0 === 2 || $0 === 3) {
			rt.setSv(f, "visibility_flags", 1);
		} else if (rt.inRange($0, 4, 9.999999848243207e+30)) {
			rt.setSv(f, "visibility_flags", 3);
		}
		rt.callSrc(f, "SetSpread", [rt.call(f, P("/proc/max"), null, [4, rt.call(f, P("/proc/min"), null, [rt.power(2, subtract(rt.at(rt.sv(f, "properties"), "transmittable"), rt.len(f, rt.sv(f, "symptoms")))), 64])])]);
		rt.setSv(f, "permeability_mod", rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/Ceiling"), null, [multiply(0.4000000059604645, rt.at(rt.sv(f, "properties"), "transmittable"))]), 1]));
		rt.setSv(f, "cure_chance", subtract(15, rt.call(f, P("/proc/max"), null, [-5, rt.call(f, P("/proc/min"), null, [rt.at(rt.sv(f, "properties"), "resistance"), 5])])));
		rt.setSv(f, "stage_prob", rt.call(f, P("/proc/max"), null, [rt.at(rt.sv(f, "properties"), "stage_rate"), 2]));
		rt.callSrc(f, "SetSeverity", [rt.at(rt.sv(f, "properties"), "severity")]);
		rt.callSrc(f, "GenerateCure", [rt.sv(f, "properties")]);
	} else {
		rt.call(f, P("/proc/CRASH"), null, ["Our properties were empty or null!"]);
	}
	return f.dot;
});

// /datum/disease/advance/proc/SetSpread  (code/datums/diseases/advance/advance.dm:213)
rt.def("/datum/disease/advance/proc/SetSpread", function SetSpread(f: Frame, spread_id: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(spread_id);
	if ($0 === 2) {
		rt.setSv(f, "spread_text", "None");
	} else if ($0 === 1) {
		rt.setSv(f, "spread_text", "None");
	} else if ($0 === 32 || $0 === 16 || $0 === 8) {
		rt.setSv(f, "spread_text", "On contact");
	} else if ($0 === 64) {
		rt.setSv(f, "spread_text", "Airborne");
	} else if ($0 === 4) {
		rt.setSv(f, "spread_text", "Blood");
	}
	rt.setSv(f, "spread_flags", live(spread_id));
	return f.dot;
});

// /datum/disease/advance/proc/SetSeverity  (code/datums/diseases/advance/advance.dm:229)
rt.def("/datum/disease/advance/proc/SetSeverity", function SetSeverity(f: Frame, level_sev: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(level_sev);
	if (rt.inRange($0, -9.999999848243207e+30, 0)) {
		rt.setSv(f, "severity", "No threat");
	} else if ($0 === 1) {
		rt.setSv(f, "severity", "Minor");
	} else if ($0 === 2) {
		rt.setSv(f, "severity", "Medium");
	} else if ($0 === 3) {
		rt.setSv(f, "severity", "Harmful");
	} else if ($0 === 4) {
		rt.setSv(f, "severity", "Dangerous!");
	} else if (rt.inRange($0, 5, 9.999999848243207e+30)) {
		rt.setSv(f, "severity", "BIOHAZARD THREAT!");
	} else {
		rt.setSv(f, "severity", "Unknown");
	}
	return f.dot;
});

// /datum/disease/advance/proc/GenerateCure  (code/datums/diseases/advance/advance.dm:249)
rt.def("/datum/disease/advance/proc/GenerateCure", function GenerateCure(f: Frame) {
	let res: Value = null, D: Value = null;
	f.vars = () => [res, D];
	if ((truthy(rt.sv(f, "properties")) && truthy(rt.len(f, rt.sv(f, "properties"))))) {
		res = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [subtract(rt.at(rt.sv(f, "properties"), "resistance"), divide(rt.len(f, rt.sv(f, "symptoms")), 2)), rt.len(f, rt.gl("advance_cures"))])]);
		rt.setSv(f, "cures", rt.list(rt.index(rt.gl("advance_cures"), live(res))));
		rt.setSv(f, "cure_text", rt.gv(f, "name", (D = rt.index(rt.gl("chemical_reagents_list"), rt.index(rt.sv(f, "cures"), 1)))));
	}
	return live(f.dot);
});

// /datum/disease/advance/proc/Evolve  (code/datums/diseases/advance/advance.dm:263)  may sleep
rt.def("/datum/disease/advance/proc/Evolve", function* Evolve(f: Frame, min_level: Value, max_level: Value) {
	let s: Value = null;
	f.vars = () => [min_level, max_level, s];
	if (truthy((s = (yield* g.call(f, P("/proc/safepick"), null, [(yield* g.srcCall(f, "GenerateSymptoms", live(min_level), live(max_level), 1))]))))) {
		yield* g.srcCall(f, "AddSymptom", live(s));
		yield* g.srcCall(f, "Refresh", 1);
	}
	return live(f.dot);
}, true);

// /datum/disease/advance/proc/Devolve  (code/datums/diseases/advance/advance.dm:271)  may sleep
rt.def("/datum/disease/advance/proc/Devolve", function* Devolve(f: Frame) {
	let s: Value = null;
	f.vars = () => [s];
	if (rt.gt(rt.len(f, rt.sv(f, "symptoms")), 1)) {
		if (truthy((s = (yield* g.call(f, P("/proc/safepick"), null, [rt.sv(f, "symptoms")]))))) {
			yield* g.srcCall(f, "RemoveSymptom", live(s));
			yield* g.srcCall(f, "Refresh", 1);
		}
	}
	return live(f.dot);
}, true);

// /datum/disease/advance/proc/GetDiseaseID  (code/datums/diseases/advance/advance.dm:285)  may sleep
rt.def("/datum/disease/advance/proc/GetDiseaseID", function* GetDiseaseID(f: Frame) {
	let L: Value = null, S: Value = null, result: Value = null;
	let $e: any;
	f.vars = () => [L, S, result, $e];
	if (!truthy(rt.sv(f, "id"))) {
		L = rt.list();
		S = null;
		rt.forList(f, 0, rt.sv(f, "symptoms"), T("/datum/symptom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			L = rt.modify(live(L), rt.fv(f, "id", live(S)), add);
		}
		rt.endFor(f, 0);
		L = (yield* g.call(f, P("/proc/sortList"), null, [live(L)]));
		rt.setSv(f, "id", (result = (yield* g.call(f, P("/proc/jointext"), null, [live(L), ":"]))));
	}
	return rt.sv(f, "id");
}, true);

// /datum/disease/advance/proc/AddSymptom  (code/datums/diseases/advance/advance.dm:299)
rt.def("/datum/disease/advance/proc/AddSymptom", function AddSymptom(f: Frame, S: Value) {
	if (truthy(rt.callSrc(f, "HasSymptom", [live(S)]))) {
		return live(f.dot);
	}
	if (rt.lt(rt.len(f, rt.sv(f, "symptoms")), add(7, rt.call(f, P("/proc/rand"), null, [-1, 1])))) {
		rt.modSrcVar(f, "symptoms", live(S), add);
	} else {
		rt.callSrc(f, "RemoveSymptom", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "symptoms")])]);
		rt.modSrcVar(f, "symptoms", live(S), add);
	}
	return live(f.dot);
});

// /datum/disease/advance/proc/RemoveSymptom  (code/datums/diseases/advance/advance.dm:311)
rt.def("/datum/disease/advance/proc/RemoveSymptom", function RemoveSymptom(f: Frame, S: Value) {
	(rt.modSrcVar(f, "symptoms", live(S), subtract));
	return live(f.dot);
});

// /proc/Advance_Mix  (code/datums/diseases/advance/advance.dm:325)  may sleep
rt.def("/proc/Advance_Mix", function* Advance_Mix(f: Frame, D_list: Value) {
	let diseases: Value = null, A: Value = null, i: Value = null, D1: Value = null, D2: Value = null, to_return: Value = null;
	let $e: any;
	f.vars = () => [D_list, diseases, A, i, D1, D2, to_return, $e];
	diseases = rt.list();
	A = null;
	rt.forList(f, 0, live(D_list), T("/datum/disease/advance"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		diseases = rt.modify(live(diseases), (yield* g.callName(f, live(A), "Copy", [])), add);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(diseases)))) {
		return null;
	}
	if (rt.le(rt.len(f, live(diseases)), 1)) {
		return rt.op(f, "PickUnweighted", [1], [live(diseases)]);
	}
	i = 0;
	while (rt.lt(live(i), 20) && rt.gt(rt.len(f, live(diseases)), 1)) {
		i = rt.inc(live(i), 1);
		(diseases = rt.modify(live(diseases), (D1 = rt.op(f, "PickUnweighted", [1], [live(diseases)])), subtract));
		yield* g.callName(f, (D2 = rt.op(f, "PickUnweighted", [1], [live(diseases)])), "Mix", [live(D1)]);
	}
	yield* g.callName(f, (to_return = rt.op(f, "PickUnweighted", [1], [live(diseases)])), "Refresh", [1]);
	return live(to_return);
}, true);

// /proc/SetViruses  (code/datums/diseases/advance/advance.dm:355)  may sleep
rt.def("/proc/SetViruses", function* SetViruses(f: Frame, R: Value, data: Value) {
	let preserve: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [R, data, preserve, A, $e];
	if (!truthy(live(data))) return f.dot;
	preserve = rt.list();
	if ((truthy((rt.istype(live(data), T("/list")) ? 1 : 0)) && truthy(rt.at(live(data), "viruses")))) {
		A = null;
		rt.forList(f, 0, rt.at(live(data), "viruses"), T("/datum/disease"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			preserve = rt.modify(live(preserve), (yield* g.callName(f, live(A), "Copy", [])), add);
		}
		rt.endFor(f, 0);
		rt.setFv(f, "data", live(R), (yield* g.callName(f, live(data), "Copy", [])));
	}
	if (!truthy(rt.len(f, live(preserve)))) return f.dot;
	rt.setAt(rt.fv(f, "data", live(R)), "viruses", live(preserve));
	return f.dot;
}, true);

// /proc/AdminCreateVirus  (code/datums/diseases/advance/advance.dm:365)  may sleep
rt.def("/proc/AdminCreateVirus", function* AdminCreateVirus(f: Frame, user: Value) {
	let i: Value = null, D: Value = null, symptoms: Value = null, symptom: Value = null, S: Value = null, new_name: Value = null, AD: Value = null, H: Value = null, name_symptoms: Value = null, S_5: Value = null;
	let $e: any;
	f.vars = () => [user, i, D, symptoms, symptom, S, new_name, AD, H, name_symptoms, S_5, $e];
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	i = 8;
	rt.setFv(f, "symptoms", (D = (yield* g.new_(f, T("/datum/disease/advance"), [0, null]))), rt.list());
	symptoms = rt.list();
	symptoms = rt.modify(live(symptoms), "Done", add);
	symptoms = rt.modify(live(symptoms), (yield* g.callName(f, rt.gl("list_symptoms"), "Copy", [])), add);
	while (true) {
		if (truthy(live(user))) {
			if ((symptom = (yield* g.op(f, "Prompt", [0], [null, "Choose a Symptom", fmt("Choose a symptom to add (＀ remaining)", [live(i)]), live(user), live(symptoms)]))) === null) {
				return live(f.dot);
			} else {
				if (truthy((yield* g.call(f, P("/proc/istext"), null, [live(symptom)])))) {
					i = 0;
				} else {
					if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(symptom)])))) {
						S = (yield* g.new_(f, live(symptom), []));
						if (!truthy((yield* g.callName(f, live(D), "HasSymptom", [live(S)])))) {
							rt.modField(f, live(D), "symptoms", live(S), add);
							(i = rt.modify(live(i), 1, subtract));
						}
					}
				}
			}
		}
		if (!rt.gt(live(i), 0)) break;
	}
	if (!rt.gt(rt.getLen(f, rt.fv(f, "symptoms", live(D))), 0)) return f.dot;
	if (!truthy((new_name = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "Name your new disease.", "New Name"]))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(D), "AssignName", [live(new_name)]);
	yield* g.callName(f, live(D), "Refresh", []);
	AD = null;
	rt.forList(f, 0, rt.fv(f, "processing", rt.gl("SSdisease")), T("/datum/disease/advance"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AD = $e;
		yield* g.callName(f, live(AD), "Refresh", []);
	}
	rt.endFor(f, 0);
	H = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/shuffle"), null, [rt.gl("living_mob_list")])), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (!isEqual(rt.fv(f, "z", live(H)), 2)) {
			continue;
		}
		if (!truthy((yield* g.callName(f, live(H), "HasDisease", [live(D)])))) {
			yield* g.callName(f, live(H), "ForceContractDisease", [live(D)]);
			break;
		}
	}
	rt.endFor(f, 0);
	name_symptoms = rt.list();
	S_5 = null;
	rt.forList(f, 0, rt.fv(f, "symptoms", live(D)), T("/datum/symptom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S_5 = $e;
		name_symptoms = rt.modify(live(name_symptoms), rt.fv(f, "name", live(S_5)), add);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has triggered a custom virus outbreak of ＀! It has these symptoms: ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), rt.fv(f, "name", live(D)), (yield* g.call(f, P("/proc/english_list"), null, [live(name_symptoms)]))])]);
	return f.dot;
}, true);

// /datum/disease/advance/proc/totalStageSpeed  (code/datums/diseases/advance/advance.dm:422)
rt.def("/datum/disease/advance/proc/totalStageSpeed", function totalStageSpeed(f: Frame) {
	return rt.at(rt.sv(f, "properties"), "stage_rate");
});

// /datum/disease/advance/proc/totalStealth  (code/datums/diseases/advance/advance.dm:425)
rt.def("/datum/disease/advance/proc/totalStealth", function totalStealth(f: Frame) {
	return rt.at(rt.sv(f, "properties"), "stealth");
});

// /datum/disease/advance/proc/totalResistance  (code/datums/diseases/advance/advance.dm:428)
rt.def("/datum/disease/advance/proc/totalResistance", function totalResistance(f: Frame) {
	return rt.at(rt.sv(f, "properties"), "resistance");
});

// /datum/disease/advance/proc/totalTransmittable  (code/datums/diseases/advance/advance.dm:431)
rt.def("/datum/disease/advance/proc/totalTransmittable", function totalTransmittable(f: Frame) {
	return rt.at(rt.sv(f, "properties"), "transmittable");
});
