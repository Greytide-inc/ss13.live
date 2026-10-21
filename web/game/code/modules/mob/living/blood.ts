// From code/modules/mob/living/blood.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/suppress_bloodloss  (code/modules/mob/living/blood.dm:7)  may sleep
rt.def("/mob/living/carbon/human/proc/suppress_bloodloss", function* suppress_bloodloss(f: Frame, amount: Value) {
	f.vars = () => [amount];
	if (truthy(rt.sv(f, "bleedsuppress"))) {
		return live(f.dot);
	} else {
		rt.setSv(f, "bleedsuppress", 1);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/carbon/human/proc/resume_bleeding")])), live(amount)]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/resume_bleeding  (code/modules/mob/living/blood.dm:14)
rt.def("/mob/living/carbon/human/proc/resume_bleeding", function resume_bleeding(f: Frame) {
	rt.setSv(f, "bleedsuppress", 0);
	if (!(!isEqual(rt.sv(f, "stat"), 2) && truthy(rt.sv(f, "bleed_rate")))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>The blood soaks through your bandage.</span>"]);
	return f.dot;
});

// /mob/living/carbon/monkey/proc/handle_blood  (code/modules/mob/living/blood.dm:19)
rt.def("/mob/living/carbon/monkey/proc/handle_blood", function handle_blood(f: Frame) {
	if (!(rt.ge(rt.sv(f, "bodytemperature"), 225) && !truthy(rt.bitAnd(rt.sv(f, "disabilities"), 128)))) return f.dot;
	if (!rt.lt(rt.sv(f, "blood_volume"), 560)) return f.dot;
	rt.modSrcVar(f, "blood_volume", 0.10000000149011612, add);
	return f.dot;
});

// /mob/living/carbon/human/proc/handle_blood  (code/modules/mob/living/blood.dm:27)  may sleep
rt.def("/mob/living/carbon/human/proc/handle_blood", function* handle_blood(f: Frame) {
	let nutrition_ratio: Value = null, word: Value = null, temp_bleed: Value = null, X: Value = null, BP: Value = null, brutedamage: Value = null;
	let $0: any, $e: any;
	f.vars = () => [nutrition_ratio, word, temp_bleed, X, BP, brutedamage, $0, $e];
	if (truthy((rt.isIn(f, 12, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		rt.setSv(f, "bleed_rate", 0);
		return live(f.dot);
	}
	if (!(rt.ge(rt.sv(f, "bodytemperature"), 225) && !truthy(rt.bitAnd(rt.sv(f, "disabilities"), 128)))) return f.dot;
	if ((rt.lt(rt.sv(f, "blood_volume"), 560) && !truthy((rt.isIn(f, 19, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0)))) {
		nutrition_ratio = 0;
		$0 = rt.sv(f, "nutrition");
		if (rt.inRange($0, 0, 150)) {
			nutrition_ratio = 0.20000000298023224;
		} else if (rt.inRange($0, 150, 250)) {
			nutrition_ratio = 0.4000000059604645;
		} else if (rt.inRange($0, 250, 350)) {
			nutrition_ratio = 0.6000000238418579;
		} else if (rt.inRange($0, 350, 450)) {
			nutrition_ratio = 0.800000011920929;
		} else {
			nutrition_ratio = 1;
		}
		if (rt.gt(rt.sv(f, "satiety"), 80)) {
			(nutrition_ratio = rt.modify(live(nutrition_ratio), 1.25, multiply));
		}
		rt.setSv(f, "nutrition", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "nutrition"), multiply(live(nutrition_ratio), 0.10000000149011612))])));
		rt.setSv(f, "blood_volume", (yield* g.call(f, P("/proc/min"), null, [560, add(rt.sv(f, "blood_volume"), multiply(0.5, live(nutrition_ratio)))])));
	}
	word = rt.op(f, "PickUnweighted", [3], ["dizzy", "woozy", "faint"]);
	$0 = rt.sv(f, "blood_volume");
	if (rt.inRange($0, 336, 475)) {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You feel ＀.</span>", [live(word)])]);
		}
		yield* g.srcCall(f, "adjustOxyLoss", (yield* g.call(f, P("/proc/round"), null, [multiply(subtract(560, rt.sv(f, "blood_volume")), 0.009999999776482582), 1])));
	} else if (rt.inRange($0, 224, 336)) {
		yield* g.srcCall(f, "adjustOxyLoss", (yield* g.call(f, P("/proc/round"), null, [multiply(subtract(560, rt.sv(f, "blood_volume")), 0.019999999552965164), 1])));
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.srcCall(f, "blur_eyes", 6);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You feel very ＀.</span>", [live(word)])]);
		}
	} else if (rt.inRange($0, 122, 224)) {
		yield* g.srcCall(f, "adjustOxyLoss", 5);
		if (truthy(rt.op(f, "Prob", [], [15]))) {
			yield* g.srcCall(f, "Unconscious", (yield* g.call(f, P("/proc/rand"), null, [20, 60])));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You feel extremely ＀.</span>", [live(word)])]);
		}
	} else if (rt.inRange($0, 0, 122)) {
		yield* g.srcCall(f, "death");
	}
	temp_bleed = 0;
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		BP = live(X);
		brutedamage = rt.fv(f, "brute_dam", live(BP));
		yield* g.call(f, P("/proc/listclearnulls"), null, [rt.fv(f, "embedded_objects", live(BP))]);
		temp_bleed = rt.modify(live(temp_bleed), multiply(0.5, rt.getLen(f, rt.fv(f, "embedded_objects", live(BP)))), add);
		if (rt.ge(live(brutedamage), 20)) {
			temp_bleed = rt.modify(live(temp_bleed), multiply(live(brutedamage), 0.013000000268220901), add);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "bleed_rate", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "bleed_rate"), 0.5), live(temp_bleed)])));
	if (!((truthy(rt.sv(f, "bleed_rate")) && !truthy(rt.sv(f, "bleedsuppress"))) && !truthy(rt.bitAnd(rt.sv(f, "status_flags"), 8192)))) return f.dot;
	yield* g.srcCall(f, "bleed", rt.sv(f, "bleed_rate"));
	return f.dot;
}, true);

// /mob/living/carbon/proc/bleed  (code/modules/mob/living/blood.dm:93)  may sleep
rt.def("/mob/living/carbon/proc/bleed", function* bleed(f: Frame, amt: Value) {
	f.vars = () => [amt];
	if (!truthy(rt.sv(f, "blood_volume"))) return f.dot;
	rt.setSv(f, "blood_volume", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "blood_volume"), live(amt)), 0])));
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))])))) return f.dot;
	if (rt.ge(live(amt), 10)) {
		yield* g.srcCall(f, "add_splatter_floor", rt.fv(f, "loc", live(f.src)));
	} else {
		yield* g.srcCall(f, "add_splatter_floor", rt.fv(f, "loc", live(f.src)), 1);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/bleed  (code/modules/mob/living/blood.dm:101)  may sleep
rt.def("/mob/living/carbon/human/proc/bleed", function* bleed(f: Frame) {
	if (truthy((rt.isIn(f, 12, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["amt"] });

// /mob/living/proc/restore_blood  (code/modules/mob/living/blood.dm:107)
rt.def("/mob/living/proc/restore_blood", function restore_blood(f: Frame) {
	rt.setSv(f, "blood_volume", rt.initial(f, live(f.src), "blood_volume"));
	return f.dot;
});

// /mob/living/proc/transfer_blood_to  (code/modules/mob/living/blood.dm:119)  may sleep
rt.def("/mob/living/proc/transfer_blood_to", function* transfer_blood_to(f: Frame, AM: Value, amount: Value, forced: Value) {
	let blood_id: Value = null, blood_data: Value = null, C: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [AM, amount, forced, blood_id, blood_data, C, D, $e];
	if ((!truthy(rt.sv(f, "blood_volume")) || !truthy(rt.fv(f, "reagents", live(AM))))) {
		return 0;
	}
	if ((rt.lt(rt.sv(f, "blood_volume"), 224) && !truthy(live(forced)))) {
		return 0;
	}
	if (rt.lt(rt.sv(f, "blood_volume"), live(amount))) {
		amount = rt.sv(f, "blood_volume");
	}
	if (!truthy((blood_id = (yield* g.srcCall(f, "get_blood_id"))))) {
		return 0;
	}
	(rt.modSrcVar(f, "blood_volume", live(amount), subtract));
	blood_data = (yield* g.srcCall(f, "get_blood_data", live(blood_id)));
	if (truthy((rt.istype(live(AM), T("/mob/living/carbon")) ? 1 : 0))) {
		C = live(AM);
		if (isEqual(live(blood_id), (yield* g.callName(f, live(C), "get_blood_id", [])))) {
			if (isEqual(live(blood_id), "blood")) {
				if (truthy(rt.at(live(blood_data), "viruses"))) {
					D = null;
					rt.forList(f, 0, rt.at(live(blood_data), "viruses"), T("/datum/disease"));
					while (($e = rt.next(f, 0)) !== undefined) {
						D = $e;
						if ((truthy(rt.bitAnd(rt.fv(f, "spread_flags", live(D)), 1)) || truthy(rt.bitAnd(rt.fv(f, "spread_flags", live(D)), 2)))) {
							continue;
						}
						yield* g.callName(f, live(C), "ForceContractDisease", [live(D)]);
					}
					rt.endFor(f, 0);
				}
				if (!truthy((rt.isIn(f, rt.at(live(blood_data), "blood_type"), (yield* g.call(f, P("/proc/get_safe_blood"), null, [rt.gv(f, "blood_type", rt.fv(f, "dna", live(C)))]))) ? 1 : 0))) {
					yield* g.callName(f, rt.fv(f, "reagents", live(C)), "add_reagent", ["toxin", multiply(live(amount), 0.5)]);
					return 1;
				}
			}
			rt.setFv(f, "blood_volume", live(C), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "blood_volume", live(C)), (yield* g.call(f, P("/proc/round"), null, [live(amount), 0.10000000149011612]))), 2000])));
			return 1;
		}
	}
	yield* g.callName(f, rt.fv(f, "reagents", live(AM)), "add_reagent", [live(blood_id), live(amount), live(blood_data), rt.sv(f, "bodytemperature")]);
	return 1;
}, true);

// /mob/living/carbon/proc/get_blood_data  (code/modules/mob/living/blood.dm:159)  may sleep
rt.def("/mob/living/carbon/proc/get_blood_data", function* get_blood_data(f: Frame, blood_id: Value) {
	let blood_data: Value = null, D: Value = null, temp_chem: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [blood_id, blood_data, D, temp_chem, R, $e];
	if (!isEqual(live(blood_id), "blood")) return f.dot;
	rt.setAt((blood_data = rt.list()), "donor", live(f.src));
	rt.setAt(live(blood_data), "viruses", rt.list());
	D = null;
	rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		rt.modAt(live(blood_data), "viruses", (yield* g.callName(f, live(D), "Copy", [])), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(blood_data), "blood_DNA", (yield* g.call(f, P("/proc/copytext"), null, [rt.fv(f, "unique_enzymes", rt.sv(f, "dna")), 1, 0])));
	if ((truthy(rt.sv(f, "resistances")) && truthy(rt.len(f, rt.sv(f, "resistances"))))) {
		rt.setAt(live(blood_data), "resistances", (yield* g.callName(f, rt.sv(f, "resistances"), "Copy", [])));
	}
	temp_chem = rt.list();
	R = null;
	rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		rt.setAt(live(temp_chem), rt.fv(f, "id", live(R)), rt.fv(f, "volume", live(R)));
	}
	rt.endFor(f, 0);
	rt.setAt(live(blood_data), "trace_chem", (yield* g.call(f, P("/proc/list2params"), null, [live(temp_chem)])));
	if (truthy(rt.sv(f, "mind"))) {
		rt.setAt(live(blood_data), "mind", rt.sv(f, "mind"));
	} else {
		if (truthy(rt.sv(f, "last_mind"))) {
			rt.setAt(live(blood_data), "mind", rt.sv(f, "last_mind"));
		}
	}
	if (truthy(rt.sv(f, "ckey"))) {
		rt.setAt(live(blood_data), "ckey", rt.sv(f, "ckey"));
	} else {
		if (truthy(rt.sv(f, "last_mind"))) {
			rt.setAt(live(blood_data), "ckey", (yield* g.call(f, P("/proc/ckey"), null, [rt.fv(f, "key", rt.sv(f, "last_mind"))])));
		}
	}
	if (!truthy(rt.sv(f, "suiciding"))) {
		rt.setAt(live(blood_data), "cloneable", 1);
	}
	rt.setAt(live(blood_data), "blood_type", (yield* g.call(f, P("/proc/copytext"), null, [rt.fv(f, "blood_type", rt.sv(f, "dna")), 1, 0])));
	rt.setAt(live(blood_data), "gender", rt.sv(f, "gender"));
	rt.setAt(live(blood_data), "real_name", rt.sv(f, "real_name"));
	rt.setAt(live(blood_data), "features", rt.fv(f, "features", rt.sv(f, "dna")));
	rt.setAt(live(blood_data), "factions", rt.sv(f, "faction"));
	return live(blood_data);
}, true);

// /mob/living/simple_animal/proc/get_blood_id  (code/modules/mob/living/blood.dm:199)
rt.def("/mob/living/simple_animal/proc/get_blood_id", function get_blood_id(f: Frame) {
	if (!truthy(rt.sv(f, "blood_volume"))) return f.dot;
	return "blood";
});

// /mob/living/carbon/monkey/proc/get_blood_id  (code/modules/mob/living/blood.dm:202)
rt.def("/mob/living/carbon/monkey/proc/get_blood_id", function get_blood_id(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "disabilities"), 128))) return f.dot;
	return "blood";
});

// /mob/living/carbon/human/proc/get_blood_id  (code/modules/mob/living/blood.dm:206)
rt.def("/mob/living/carbon/human/proc/get_blood_id", function get_blood_id(f: Frame) {
	if (truthy(rt.gv(f, "exotic_blood", rt.fv(f, "species", rt.sv(f, "dna"))))) {
		return rt.gv(f, "exotic_blood", rt.fv(f, "species", rt.sv(f, "dna")));
	}
	if ((truthy((rt.isIn(f, 12, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0)) || truthy(rt.bitAnd(rt.sv(f, "disabilities"), 128)))) {
		return live(f.dot);
	}
	return "blood";
});

// /proc/get_safe_blood  (code/modules/mob/living/blood.dm:214)
rt.def("/proc/get_safe_blood", function get_safe_blood(f: Frame, bloodtype: Value) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = rt.list();
	if (!truthy(live(bloodtype))) {
		return live(f.dot);
	}
	$0 = live(bloodtype);
	if ($0 === "A-") {
		return rt.list("A-", "O-");
	} else if ($0 === "A+") {
		return rt.list("A-", "A+", "O-", "O+");
	} else if ($0 === "B-") {
		return rt.list("B-", "O-");
	} else if ($0 === "B+") {
		return rt.list("B-", "B+", "O-", "O+");
	} else if ($0 === "AB-") {
		return rt.list("A-", "B-", "O-", "AB-");
	} else if ($0 === "AB+") {
		return rt.list("A-", "A+", "B-", "B+", "O-", "O+", "AB-", "AB+");
	} else if ($0 === "O-") {
		return rt.list("O-");
	} else if ($0 === "O+") {
		return rt.list("O-", "O+");
	} else if ($0 === "L") {
		return rt.list("L");
	}
	return f.dot;
});

// /mob/living/proc/add_splatter_floor  (code/modules/mob/living/blood.dm:239)  may sleep
rt.def("/mob/living/proc/add_splatter_floor", function* add_splatter_floor(f: Frame, _T: Value, small_drip: Value) {
	let temp_blood_DNA: Value = null, drop: Value = null, B: Value = null;
	f.vars = () => [_T, small_drip, temp_blood_DNA, drop, B];
	if (!isEqual((yield* g.srcCall(f, "get_blood_id")), "blood")) {
		return live(f.dot);
	}
	if (!truthy(live(_T))) {
		_T = rt.getStep(f, live(f.src), 0);
	}
	temp_blood_DNA = null;
	if (truthy(live(small_drip))) {
		if (truthy((drop = rt.locateIn(f, T("/obj/effect/decal/cleanable/blood/drip"), live(_T))))) {
			if (rt.lt(rt.fv(f, "drips", live(drop)), 3)) {
				rt.incField(f, live(drop), "drips", 1, true);
				yield* g.callName(f, live(drop), "add_overlay", [rt.op(f, "PickUnweighted", [1], [rt.fv(f, "random_icon_states", live(drop))])]);
				yield* g.callName(f, live(drop), "transfer_mob_blood_dna", [live(f.src)]);
				return live(f.dot);
			} else {
				temp_blood_DNA = rt.list();
				(temp_blood_DNA = rt.modify(live(temp_blood_DNA), (yield* g.callName(f, rt.fv(f, "blood_DNA", live(drop)), "Copy", [])), rt.bitOr));
				yield* g.call(f, P("/proc/qdel"), null, [live(drop)]);
			}
		} else {
			yield* g.callName(f, (drop = (yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/drip"), [live(_T)]))), "transfer_mob_blood_dna", [live(f.src)]);
			return live(f.dot);
		}
	}
	if (!truthy((B = rt.locateIn(f, T("/obj/effect/decal/cleanable/blood"), live(_T))))) {
		B = (yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/splatter"), [live(_T)]));
	}
	yield* g.callName(f, live(B), "transfer_mob_blood_dna", [live(f.src)]);
	if (!truthy(live(temp_blood_DNA))) return f.dot;
	(rt.modField(f, live(B), "blood_DNA", live(temp_blood_DNA), rt.bitOr));
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/add_splatter_floor  (code/modules/mob/living/blood.dm:272)  may sleep
rt.def("/mob/living/carbon/human/proc/add_splatter_floor", function* add_splatter_floor(f: Frame) {
	if (truthy((rt.isIn(f, 12, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["T", "small_drip"] });

// /mob/living/carbon/alien/proc/add_splatter_floor  (code/modules/mob/living/blood.dm:276)  may sleep
rt.def("/mob/living/carbon/alien/proc/add_splatter_floor", function* add_splatter_floor(f: Frame, _T: Value, small_drip: Value) {
	let B: Value = null;
	f.vars = () => [_T, small_drip, B];
	if (!truthy(live(_T))) {
		_T = rt.getStep(f, live(f.src), 0);
	}
	if (!truthy((B = rt.locateIn(f, T("/obj/effect/decal/cleanable/xenoblood"), rt.fv(f, "contents", live(_T)))))) {
		B = (yield* g.new_(f, T("/obj/effect/decal/cleanable/xenoblood"), [live(_T)]));
	}
	rt.setAt(rt.fv(f, "blood_DNA", live(B)), "UNKNOWN DNA", "X*");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/add_splatter_floor  (code/modules/mob/living/blood.dm:284)  may sleep
rt.def("/mob/living/silicon/robot/proc/add_splatter_floor", function* add_splatter_floor(f: Frame, _T: Value, small_drip: Value) {
	let B: Value = null;
	f.vars = () => [_T, small_drip, B];
	if (!truthy(live(_T))) {
		_T = rt.getStep(f, live(f.src), 0);
	}
	if (truthy((B = rt.locateIn(f, T("/obj/effect/decal/cleanable/oil"), rt.fv(f, "contents", live(_T)))))) return f.dot;
	B = (yield* g.new_(f, T("/obj/effect/decal/cleanable/oil"), [live(_T)]));
	return f.dot;
}, true);
