// From code/modules/reagents/chemistry/reagents/other_reagents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3599, "/datum/reagent/blood", "/datum/reagent", {
	data: null,
	name: "Blood",
	id: "blood",
	color: "#C80000",
	metabolization_rate: 5,
	taste_description: "iron",
	taste_mult: 1.3,
	glass_icon_state: "glass_red",
	glass_name: "glass of tomato juice",
	glass_desc: "Are you sure this is tomato juice?",
	shot_glass_icon_state: "shotglassred",
});

// /datum/reagent/blood/proc/<init>  (code/modules/reagents/chemistry/reagents/other_reagents.dm:2)
rt.def("/datum/reagent/blood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "data", rt.alist(f, ["donor", null, "viruses", null, "blood_DNA", null, "blood_type", null, "resistances", null, "trace_chem", null, "mind", null, "ckey", null, "gender", null, "real_name", null, "cloneable", null, "factions", null]));
	return f.dot;
});

// /datum/reagent/blood/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:15)  may sleep
rt.def("/datum/reagent/blood/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let D: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [M, method, reac_volume, D, C, $e];
	if (live(method) === null) {
		method = 1;
	}
	if ((truthy(rt.sv(f, "data")) && truthy(rt.at(rt.sv(f, "data"), "viruses")))) {
		D = null;
		rt.forList(f, 0, rt.at(rt.sv(f, "data"), "viruses"), T("/datum/disease"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			if ((truthy(rt.bitAnd(rt.fv(f, "spread_flags", live(D)), 1)) || truthy(rt.bitAnd(rt.fv(f, "spread_flags", live(D)), 2)))) {
				continue;
			}
			if ((isEqual(live(method), 1) || isEqual(live(method), 3))) {
				yield* g.callName(f, live(M), "ContractDisease", [live(D)]);
			} else {
				yield* g.callName(f, live(M), "ForceContractDisease", [live(D)]);
			}
		}
		rt.endFor(f, 0);
	}
	if (!(isEqual(live(method), 5) && truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0)))) return f.dot;
	if (!isEqual((yield* g.callName(f, (C = live(M)), "get_blood_id", [])), "blood")) return f.dot;
	if ((!truthy(rt.sv(f, "data")) || !truthy((rt.isIn(f, rt.at(rt.sv(f, "data"), "blood_type"), (yield* g.call(f, P("/proc/get_safe_blood"), null, [rt.gv(f, "blood_type", rt.fv(f, "dna", live(C)))]))) ? 1 : 0)))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(C)), "add_reagent", ["toxin", multiply(live(reac_volume), 0.5)]);
	} else {
		rt.setFv(f, "blood_volume", live(C), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "blood_volume", live(C)), (yield* g.call(f, P("/proc/round"), null, [live(reac_volume), 0.10000000149011612]))), 2000])));
	}
	return f.dot;
}, true);

// /datum/reagent/blood/proc/on_new  (code/modules/reagents/chemistry/reagents/other_reagents.dm:36)  may sleep
rt.def("/datum/reagent/blood/proc/on_new", function* on_new(f: Frame, data: Value) {
	f.vars = () => [data];
	if (!truthy((rt.istype(live(data), T("/list")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/SetViruses"), null, [live(f.src), live(data)]);
	return f.dot;
}, true);

// /datum/reagent/blood/proc/on_merge  (code/modules/reagents/chemistry/reagents/other_reagents.dm:40)  may sleep
rt.def("/datum/reagent/blood/proc/on_merge", function* on_merge(f: Frame, mix_data: Value) {
	let mix1: Value = null, mix2: Value = null, to_mix: Value = null, AD: Value = null, preserve: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [mix_data, mix1, mix2, to_mix, AD, preserve, D, $e];
	if ((truthy(rt.sv(f, "data")) && truthy(live(mix_data)))) {
		rt.setAt(rt.sv(f, "data"), "cloneable", 0);
		if ((truthy(rt.at(rt.sv(f, "data"), "viruses")) || truthy(rt.at(live(mix_data), "viruses")))) {
			mix1 = rt.at(rt.sv(f, "data"), "viruses");
			mix2 = rt.at(live(mix_data), "viruses");
			to_mix = rt.list();
			AD = null;
			rt.forList(f, 0, live(mix1), T("/datum/disease/advance"));
			while (($e = rt.next(f, 0)) !== undefined) {
				AD = $e;
				to_mix = rt.modify(live(to_mix), live(AD), add);
			}
			rt.endFor(f, 0);
			AD = null;
			rt.forList(f, 0, live(mix2), T("/datum/disease/advance"));
			while (($e = rt.next(f, 0)) !== undefined) {
				AD = $e;
				to_mix = rt.modify(live(to_mix), live(AD), add);
			}
			rt.endFor(f, 0);
			if (truthy((AD = (yield* g.call(f, P("/proc/Advance_Mix"), null, [live(to_mix)]))))) {
				preserve = rt.list(live(AD));
				D = null;
				rt.forList(f, 0, rt.at(rt.sv(f, "data"), "viruses"));
				while (($e = rt.next(f, 0)) !== undefined) {
					D = $e;
					if (!truthy((rt.istype(live(D), T("/datum/disease/advance")) ? 1 : 0))) {
						preserve = rt.modify(live(preserve), live(D), add);
					}
				}
				rt.endFor(f, 0);
				rt.setAt(rt.sv(f, "data"), "viruses", live(preserve));
			}
		}
	}
	return 1;
}, true);

// /datum/reagent/blood/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:65)  may sleep
rt.def("/datum/reagent/blood/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let B: Value = null, D: Value = null, newVirus: Value = null;
	let $e: any;
	f.vars = () => [_T, reac_volume, B, D, newVirus, $e];
	if (!truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (rt.lt(live(reac_volume), 3)) {
		return live(f.dot);
	}
	if (!truthy((B = rt.locateIn(f, T("/obj/effect/decal/cleanable/blood"), live(_T))))) {
		B = (yield* g.new_(f, T("/obj/effect/decal/cleanable/blood"), [live(_T)]));
	}
	if (truthy(rt.at(rt.sv(f, "data"), "blood_DNA"))) {
		rt.setAt(rt.fv(f, "blood_DNA", live(B)), rt.at(rt.sv(f, "data"), "blood_DNA"), rt.at(rt.sv(f, "data"), "blood_type"));
	}
	D = null;
	rt.forList(f, 0, rt.at(rt.sv(f, "data"), "viruses"), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		newVirus = (yield* g.callName(f, live(D), "Copy", [1]));
		rt.modField(f, live(B), "viruses", live(newVirus), add);
		rt.setFv(f, "holder", live(newVirus), live(B));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(3601, "/datum/reagent/vaccine", "/datum/reagent", {
	name: "Vaccine",
	id: "vaccine",
	color: "#C81040",
	taste_description: "slime",
});

// /datum/reagent/vaccine/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:98)  may sleep
rt.def("/datum/reagent/vaccine/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [M, method, reac_volume, D, $e];
	if (live(method) === null) {
		method = 1;
	}
	if (!(truthy((rt.istype(rt.sv(f, "data"), T("/list")) ? 1 : 0)) && (isEqual(live(method), 2) || isEqual(live(method), 5)))) return f.dot;
	D = null;
	rt.forList(f, 0, rt.fv(f, "viruses", live(M)), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (truthy((rt.isIn(f, (yield* g.callName(f, live(D), "GetDiseaseID", [])), rt.sv(f, "data")) ? 1 : 0))) {
			yield* g.callName(f, live(D), "cure", []);
		}
	}
	rt.endFor(f, 0);
	(rt.modField(f, live(M), "resistances", rt.sv(f, "data"), rt.bitOr));
	return f.dot;
}, true);

// /datum/reagent/vaccine/proc/on_merge  (code/modules/reagents/chemistry/reagents/other_reagents.dm:105)
rt.def("/datum/reagent/vaccine/proc/on_merge", function on_merge(f: Frame, data: Value) {
	if (!truthy((rt.istype(live(data), T("/list")) ? 1 : 0))) return f.dot;
	(rt.modField(f, live(f.src), "data", rt.callName(f, live(data), "Copy", []), rt.bitOr));
	return f.dot;
});

rt.type(3602, "/datum/reagent/water", "/datum/reagent", {
	cooling_temperature: 2,
	name: "Water",
	id: "water",
	description: "A ubiquitous chemical substance that is composed of hydrogen and oxygen.",
	color: "#AAAAAA77",
	taste_description: "water",
	glass_icon_state: "glass_clear",
	glass_name: "glass of Water",
	glass_desc: "The father of all refreshments.",
	shot_glass_icon_state: "shotglassclear",
});

// /datum/reagent/water/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:125)  may sleep
rt.def("/datum/reagent/water/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let CT: Value = null, M: Value = null, hotspot: Value = null, G: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [_T, reac_volume, CT, M, hotspot, G, A, $e];
	if (!truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) {
		return live(f.dot);
	}
	CT = rt.sv(f, "cooling_temperature");
	if (rt.ge(live(reac_volume), 5)) {
		yield* g.callName(f, live(_T), "MakeSlippery", ["min_wet_time", 10, "wet_time_to_add", (yield* g.call(f, P("/proc/min"), null, [multiply(live(reac_volume), 1.5), 60]))], rt.Args.Named);
	}
	M = null;
	rt.forList(f, 0, live(_T), T("/mob/living/simple_animal/slime"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "apply_water", []);
	}
	rt.endFor(f, 0);
	if ((truthy((hotspot = rt.locateIn(f, T("/obj/effect/hotspot"), live(_T)))) && !truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)))) {
		if (truthy(rt.fv(f, "air", live(_T)))) {
			rt.setFv(f, "temperature", (G = rt.fv(f, "air", live(_T))), (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/min"), null, [subtract(rt.fv(f, "temperature", live(G)), multiply(live(CT), 1000)), divide(rt.fv(f, "temperature", live(G)), live(CT))])), 0])));
			yield* g.callName(f, live(G), "react", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(hotspot)]);
		}
	}
	if (!truthy((A = rt.locateIn(f, T("/obj/effect/acid"), live(_T))))) return f.dot;
	rt.setFv(f, "acid_level", live(A), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "acid_level", live(A)), multiply(live(reac_volume), 50)), 0])));
	return f.dot;
}, true);

// /datum/reagent/water/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/other_reagents.dm:151)  may sleep
rt.def("/datum/reagent/water/proc/reaction_obj", function* reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	let cube: Value = null, dehy: Value = null, HH: Value = null, WL: Value = null;
	f.vars = () => [O, reac_volume, cube, dehy, HH, WL];
	yield* g.callName(f, live(O), "extinguish", []);
	rt.setFv(f, "acid_level", live(O), 0);
	if (truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube")) ? 1 : 0))) {
		yield* g.callName(f, (cube = live(O)), "Expand", []);
	} else {
		if (truthy((rt.istype(live(O), T("/obj/item/toy/carpplushie/dehy_carp")) ? 1 : 0))) {
			yield* g.callName(f, (dehy = live(O)), "Swell", []);
		} else {
			if (!truthy((rt.istype(live(O), T("/obj/item/stack/sheet/hairlesshide")) ? 1 : 0))) return f.dot;
			HH = live(O);
			rt.setFv(f, "amount", (WL = (yield* g.new_(f, T("/obj/item/stack/sheet/wetleather"), [rt.getStep(f, live(HH), 0)]))), rt.fv(f, "amount", live(HH)));
			yield* g.call(f, P("/proc/qdel"), null, [live(HH)]);
		}
	}
	return f.dot;
}, true);

// /datum/reagent/water/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:174)  may sleep
rt.def("/datum/reagent/water/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(live(f.args[1]), 1)) {
		yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [rt.neg(divide(live(f.args[2]), 10))]);
		yield* g.callName(f, live(f.args[0]), "ExtinguishMob", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3603, "/datum/reagent/water/holywater", "/datum/reagent/water", {
	name: "Holy Water",
	id: "holywater",
	description: "Water blessed by some deity.",
	color: "#E0E8EF",
	glass_icon_state: "glass_clear",
	glass_name: "glass of Holy Water",
	glass_desc: "A glass of holy water.",
});

// /datum/reagent/water/holywater/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:191)  may sleep
rt.def("/datum/reagent/water/holywater/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>A darkness begins to spread its unholy tendrils through your mind, purging the Justiciar's influence!</span>"]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// /datum/reagent/water/holywater/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:196)  may sleep
rt.def("/datum/reagent/water/holywater/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let $0: any;
	f.vars = () => [M, $0];
	if (!truthy(rt.sv(f, "data"))) {
		rt.setSv(f, "data", 1);
	}
	rt.incSrcVar(f, "data", 1, true);
	rt.setFv(f, "jitteriness", live(M), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "jitteriness", live(M)), 4), 10])));
	if (rt.ge(rt.sv(f, "data"), 30)) {
		if (!truthy(rt.fv(f, "stuttering", live(M)))) {
			rt.setFv(f, "stuttering", live(M), 1);
		}
		rt.setFv(f, "stuttering", live(M), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "stuttering", live(M)), 4), 10])));
		yield* g.callName(f, live(M), "Dizzy", [5]);
		if ((truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(M)]))) && truthy(rt.op(f, "Prob", [], [5])))) {
			yield* g.callName(f, live(M), "say", [rt.op(f, "PickUnweighted", [8], ["Av'te Nar'sie", "Pa'lid Mors", "INO INO ORA ANA", "SAT ANA!", "Daim'niodeis Arc'iai Le'eones", "R'ge Na'sie", "Diabo us Vo'iscum", "Eld' Mon Nobis"])]);
		} else {
			if ((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)]))) && truthy(rt.op(f, "Prob", [], [8])))) {
				$0 = rt.op(f, "PickUnweighted", [3], ["speech", "message", "emote"]);
				if ($0 === "speech") {
					yield* g.call(f, P("/proc/clockwork_say"), null, [live(M), fmt("...＀", [(yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [4], ["Engine... your light grows dark...", "Where are you, master?", "He lies rusting in Error...", "Purge all untruths and... and... something..."])]))])]);
				} else if ($0 === "message") {
					yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='boldwarning'>＀.</span>", [rt.op(f, "PickUnweighted", [4], ["Ratvar's illumination of your mind has begun to flicker", "He lies rusting in Reebe, derelict and forgotten. And there he shall stay", "You can't save him. Nothing can save him now", "It seems that Nar-Sie will triumph after all"])])]);
				} else if ($0 === "emote") {
					yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ ＀.</span>", [live(M), rt.op(f, "PickUnweighted", [3], ["whimpers quietly", "shivers as though cold", "glances around in paranoia"])])]);
				}
			}
		}
	}
	if (rt.ge(rt.sv(f, "data"), 75)) {
		if ((truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(M)]))) || truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)]))))) {
			if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(M)])))) {
				yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_cultist", [rt.fv(f, "mind", live(M)), 1, 1]);
			} else {
				if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)])))) {
					yield* g.call(f, P("/proc/remove_servant_of_ratvar"), null, [live(M)]);
				}
			}
			rt.setFv(f, "jitteriness", live(M), 0);
			rt.setFv(f, "stuttering", live(M), 0);
			yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", [rt.sv(f, "id"), rt.sv(f, "volume")]);
			return live(f.dot);
		}
	}
	yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", [rt.sv(f, "id"), 0.4000000059604645]);
	return f.dot;
}, true);

// /datum/reagent/water/holywater/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:228)  may sleep
rt.def("/datum/reagent/water/holywater/proc/reaction_turf", function* reaction_turf(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/turf")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (rt.ge(live(f.args[1]), 10)) {
		R = null;
		rt.forList(f, 0, live(f.args[0]), T("/obj/effect/rune"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, live(f.args[0]), "Bless", []);
	return f.dot;
}, true, { args: ["T", "reac_volume"] });

rt.type(3605, "/datum/reagent/fuel/unholywater", "/datum/reagent/fuel", {
	name: "Unholy Water",
	id: "unholywater",
	description: "Something that shouldn't exist on this plane of existence.",
	taste_description: "suffering",
});

// /datum/reagent/fuel/unholywater/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:242)  may sleep
rt.def("/datum/reagent/fuel/unholywater/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if ((isEqual(live(f.args[1]), 1) || isEqual(live(f.args[1]), 3))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["unholywater", divide(live(f.args[2]), 4)]);
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "method", "reac_volume"] });

// /datum/reagent/fuel/unholywater/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:248)  may sleep
rt.def("/datum/reagent/fuel/unholywater/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	f.vars = () => [M];
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(M)])))) {
		rt.setFv(f, "drowsyness", live(M), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "drowsyness", live(M)), 5), 0])));
		yield* g.callName(f, live(M), "AdjustUnconscious", [-20, 0]);
		yield* g.callName(f, live(M), "AdjustStun", [-40, 0]);
		yield* g.callName(f, live(M), "AdjustKnockdown", [-40, 0]);
		yield* g.callName(f, live(M), "adjustToxLoss", [-2, 0]);
		yield* g.callName(f, live(M), "adjustOxyLoss", [-2, 0]);
		yield* g.callName(f, live(M), "adjustBruteLoss", [-2, 0]);
		yield* g.callName(f, live(M), "adjustFireLoss", [-2, 0]);
	} else {
		yield* g.callName(f, live(M), "adjustBrainLoss", [3]);
		yield* g.callName(f, live(M), "adjustToxLoss", [1, 0]);
		yield* g.callName(f, live(M), "adjustFireLoss", [2, 0]);
		yield* g.callName(f, live(M), "adjustOxyLoss", [2, 0]);
		yield* g.callName(f, live(M), "adjustBruteLoss", [2, 0]);
	}
	yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", [rt.fv(f, "id", live(f.src)), 1]);
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3606, "/datum/reagent/hellwater", "/datum/reagent", {
	name: "Hell Water",
	id: "hell_water",
	description: "YOUR FLESH! IT BURNS!",
	taste_description: "burning",
});

// /datum/reagent/hellwater/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:273)  may sleep
rt.def("/datum/reagent/hellwater/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	f.vars = () => [M];
	rt.setFv(f, "fire_stacks", live(M), (yield* g.call(f, P("/proc/min"), null, [5, add(rt.fv(f, "fire_stacks", live(M)), 3)])));
	yield* g.callName(f, live(M), "IgniteMob", []);
	yield* g.callName(f, live(M), "adjustToxLoss", [1, 0]);
	yield* g.callName(f, live(M), "adjustFireLoss", [1, 0]);
	yield* g.callName(f, live(M), "adjustBrainLoss", [5]);
	yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", [rt.fv(f, "id", live(f.src)), 1]);
	return f.dot;
}, true);

rt.type(3607, "/datum/reagent/lube", "/datum/reagent", {
	name: "Space Lube",
	id: "lube",
	description: "Lubricant is a substance introduced between two moving surfaces to reduce the friction and wear between them. giggity.",
	color: "#009CA8",
	taste_description: "cherry",
});

// /datum/reagent/lube/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:294)  may sleep
rt.def("/datum/reagent/lube/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	f.vars = () => [_T, reac_volume];
	if (!truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!rt.ge(live(reac_volume), 1)) return f.dot;
	yield* g.callName(f, live(_T), "MakeSlippery", [2, 15, (yield* g.call(f, P("/proc/min"), null, [multiply(live(reac_volume), 2), 120]))]);
	return f.dot;
}, true);

rt.type(3608, "/datum/reagent/spraytan", "/datum/reagent", {
	name: "Spray Tan",
	id: "spraytan",
	description: "A substance applied to the skin to darken the skin.",
	color: "#FFC080",
	metabolization_rate: 4,
	overdose_threshold: 11,
	taste_description: "sour oranges",
});

// /datum/reagent/spraytan/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:309)  may sleep
rt.def("/datum/reagent/spraytan/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let N: Value = null, newcolor: Value = null, len: Value = null, i: Value = null, ascii: Value = null;
	let $0: any;
	f.vars = () => [N, newcolor, len, i, ascii, $0];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((isEqual(live(f.args[1]), 4) || isEqual(live(f.args[1]), 3))) {
			if (isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.gv(f, "dna", (N = live(f.args[0]))))), "human")) {
				$0 = rt.fv(f, "skin_tone", live(N));
				if ($0 === "african1") {
					rt.setFv(f, "skin_tone", live(N), "african2");
				} else if ($0 === "indian") {
					rt.setFv(f, "skin_tone", live(N), "african1");
				} else if ($0 === "arab") {
					rt.setFv(f, "skin_tone", live(N), "indian");
				} else if ($0 === "asian2") {
					rt.setFv(f, "skin_tone", live(N), "arab");
				} else if ($0 === "asian1") {
					rt.setFv(f, "skin_tone", live(N), "asian2");
				} else if ($0 === "mediterranean") {
					rt.setFv(f, "skin_tone", live(N), "african1");
				} else if ($0 === "latino") {
					rt.setFv(f, "skin_tone", live(N), "mediterranean");
				} else if ($0 === "caucasian3") {
					rt.setFv(f, "skin_tone", live(N), "mediterranean");
				} else if ($0 === "caucasian2") {
					rt.setFv(f, "skin_tone", live(N), rt.op(f, "PickUnweighted", [2], ["caucasian3", "latino"]));
				} else if ($0 === "caucasian1") {
					rt.setFv(f, "skin_tone", live(N), "caucasian2");
				} else if ($0 === "albino") {
					rt.setFv(f, "skin_tone", live(N), "caucasian1");
				}
			}
			if (truthy((rt.isIn(f, 1, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(N))))) ? 1 : 0))) {
				newcolor = "";
				len = rt.length(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(N))), "mcolor"));
				i = null;
				i = 1;
				while (rt.le(live(i), live(len))) {
					$0 = (ascii = (yield* g.call(f, P("/proc/text2ascii"), null, [rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(N))), "mcolor"), live(i)])));
					if ($0 === 48) {
						newcolor = rt.modify(live(newcolor), "0", add);
					} else if (rt.inRange($0, 49, 57)) {
						newcolor = rt.modify(live(newcolor), (yield* g.call(f, P("/proc/ascii2text"), null, [subtract(live(ascii), 1)])), add);
					} else if ($0 === 97) {
						newcolor = rt.modify(live(newcolor), "9", add);
					} else if (rt.inRange($0, 98, 102)) {
						newcolor = rt.modify(live(newcolor), (yield* g.call(f, P("/proc/ascii2text"), null, [subtract(live(ascii), 1)])), add);
					} else if ($0 === 65) {
						newcolor = rt.modify(live(newcolor), "9", add);
					} else if (rt.inRange($0, 66, 70)) {
						newcolor = rt.modify(live(newcolor), (yield* g.call(f, P("/proc/ascii2text"), null, [add(live(ascii), 31)])), add);
					} else {
						break;
					}
					i = rt.modify(live(i), 1, add);
				}
				if (rt.ge(rt.index((yield* g.call(f, P("/proc/ReadHSV"), null, [live(newcolor)])), 3), rt.index((yield* g.call(f, P("/proc/ReadHSV"), null, ["#7F7F7F"])), 3))) {
					rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(N))), "mcolor", live(newcolor));
				}
			}
			yield* g.callName(f, live(N), "regenerate_icons", []);
		}
		if (isEqual(live(f.args[1]), 2)) {
			if (truthy(live(f.args[3]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>That tasted horrible.</span>"]);
			}
			yield* g.callName(f, live(f.args[0]), "AdjustStun", [40]);
			yield* g.callName(f, live(f.args[0]), "AdjustKnockdown", [40]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

// /datum/reagent/spraytan/proc/overdose_process  (code/modules/reagents/chemistry/reagents/other_reagents.dm:374)  may sleep
rt.def("/datum/reagent/spraytan/proc/overdose_process", function* overdose_process(f: Frame) {
	let N: Value = null;
	f.vars = () => [N];
	rt.setSv(f, "metabolization_rate", 0.4000000059604645);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.setFv(f, "hair_style", (N = live(f.args[0])), "Spiky");
		rt.setFv(f, "facial_hair_style", live(N), "Shaved");
		rt.setFv(f, "facial_hair_color", live(N), "000");
		rt.setFv(f, "hair_color", live(N), "000");
		if (!truthy((rt.isIn(f, 2, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(N))))) ? 1 : 0))) {
			rt.modField(f, rt.gv(f, "species", rt.fv(f, "dna", live(N))), "species_traits", 2, add);
		}
		if (truthy(rt.gv(f, "use_skintones", rt.gv(f, "species", rt.fv(f, "dna", live(N)))))) {
			rt.setFv(f, "skin_tone", live(N), "orange");
		} else {
			if (truthy((rt.isIn(f, 1, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(N))))) ? 1 : 0))) {
				rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(N))), "mcolor", "f80");
			}
		}
		yield* g.callName(f, live(N), "regenerate_icons", []);
		if (truthy(rt.op(f, "Prob", [], [7]))) {
			if (truthy(rt.fv(f, "w_uniform", live(N)))) {
				yield* g.callName(f, live(f.args[0]), "visible_message", [rt.op(f, "PickUnweighted", [2], [fmt("<b>＀</b>'s collar pops up without warning.</span>", [live(f.args[0])]), fmt("<b>＀</b> flexes ＀ arms.", [live(f.args[0]), (yield* g.callName(f, live(f.args[0]), "p_their", []))])])]);
			} else {
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<b>＀</b> flexes ＀ arms.", [live(f.args[0]), (yield* g.callName(f, live(f.args[0]), "p_their", []))])]);
			}
		}
	}
	if (truthy(rt.op(f, "Prob", [], [10]))) {
		yield* g.callName(f, live(f.args[0]), "say", [rt.op(f, "PickUnweighted", [5], ["Shit was SO cash.", "You are everything bad in the world.", "What sports do you play, other than 'jack off to naked drawn Japanese people?'", "Don’t be a stranger. Just hit me with your best shot.", "My name is John and I hate every single one of you."])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true, { args: ["M"] });

rt.type(3609, "/datum/reagent/stableslimetoxin", "/datum/reagent", {
	mutationtext: "<span class='danger'>The pain subsides. You feel... human.</span>",
	race: rt.typePath("/datum/species/human"),
	name: "Stable Mutation Toxin",
	id: "stablemutationtoxin",
	description: "A humanizing toxin produced by slimes.",
	color: "#5EFF3B",
	metabolization_rate: 1e+31,
	taste_description: "slime",
});

// /datum/reagent/stableslimetoxin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:408)  may sleep
rt.def("/datum/reagent/stableslimetoxin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'><b>You crumple in agony as your flesh wildly morphs into new forms!</b></span>"]);
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<b>＀</b> falls to the ground and screams as ＀ skin bubbles and froths!", [live(f.args[0]), (yield* g.callName(f, live(f.args[0]), "p_their", []))])]);
	yield* g.callName(f, live(f.args[0]), "Knockdown", [60, 0]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/reagent/stableslimetoxin/proc/mutate"), live(f.args[0])])), 30]);
	return live(f.dot);
}, true, { args: ["H"] });

// /datum/reagent/stableslimetoxin/proc/mutate  (code/modules/reagents/chemistry/reagents/other_reagents.dm:418)  may sleep
rt.def("/datum/reagent/stableslimetoxin/proc/mutate", function* mutate(f: Frame, H: Value) {
	let current_species: Value = null, mutation: Value = null;
	f.vars = () => [H, current_species, mutation];
	if ((!truthy(live(H)) || truthy(rt.fv(f, "gc_destroyed", live(H))))) {
		return live(f.dot);
	}
	current_species = rt.gv(f, "type", rt.gv(f, "species", rt.fv(f, "dna", live(H))));
	if ((truthy((mutation = rt.sv(f, "race"))) && !isEqual(live(mutation), live(current_species)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), rt.sv(f, "mutationtext")]);
		yield* g.callName(f, live(H), "set_species", [live(mutation)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>The pain vanishes suddenly. You feel no different.</span>"]);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }] });

rt.type(3623, "/datum/reagent/stableslimetoxin/unstable", "/datum/reagent/stableslimetoxin", {
	name: "Unstable Mutation Toxin",
	id: "unstablemutationtoxin",
	description: "An unstable and unpredictable corruptive toxin produced by slimes.",
	color: "#5EFF3B",
	mutationtext: "<span class='danger'>The pain subsides. You feel... different.</span>",
});

// /datum/reagent/stableslimetoxin/unstable/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:544)  may sleep
rt.def("/datum/reagent/stableslimetoxin/unstable/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let possible_morphs: Value = null, type: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [possible_morphs, type, S, $e];
	possible_morphs = rt.list();
	type = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/species")])), T("/datum/species")));
	while (($e = rt.next(f, 0)) !== undefined) {
		type = $e;
		if (truthy(rt.initial(f, (S = live(type)), "blacklisted"))) {
			continue;
		}
		possible_morphs = rt.modify(live(possible_morphs), live(S), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "race", rt.op(f, "PickUnweighted", [1], [live(possible_morphs)]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H"] });

rt.type(3624, "/datum/reagent/mulligan", "/datum/reagent", {
	name: "Mulligan Toxin",
	id: "mulligan",
	description: "This toxin will rapidly change the DNA of human beings. Commonly used by Syndicate spies and assassins in need of an emergency ID change.",
	color: "#5EFF3B",
	metabolization_rate: 1e+31,
	taste_description: "slime",
});

// /datum/reagent/mulligan/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:562)  may sleep
rt.def("/datum/reagent/mulligan/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'><b>You grit your teeth in pain as your body rapidly mutates!</b></span>"]);
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<b>＀</b> suddenly transforms!", [live(f.args[0])])]);
	yield* g.call(f, P("/proc/randomize_human"), null, [live(f.args[0])]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H"] });

rt.type(3625, "/datum/reagent/aslimetoxin", "/datum/reagent", {
	name: "Advanced Mutation Toxin",
	id: "amutationtoxin",
	description: "An advanced corruptive toxin produced by slimes.",
	color: "#13BC5E",
	taste_description: "slime",
});

// /datum/reagent/aslimetoxin/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:575)  may sleep
rt.def("/datum/reagent/aslimetoxin/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	f.vars = () => [M, method, reac_volume];
	if (live(method) === null) {
		method = 1;
	}
	if (isEqual(live(method), 1)) return f.dot;
	yield* g.callName(f, live(M), "ForceContractDisease", [(yield* g.new_(f, T("/datum/disease/transformation/slime"), [0]))]);
	return f.dot;
}, true);

rt.type(3626, "/datum/reagent/gluttonytoxin", "/datum/reagent", {
	name: "Gluttony's Blessing",
	id: "gluttonytoxin",
	description: "An advanced corruptive toxin produced by something terrible.",
	color: "#5EFF3B",
	can_synth: 0,
	taste_description: "decay",
});

// /datum/reagent/gluttonytoxin/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:587)  may sleep
rt.def("/datum/reagent/gluttonytoxin/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	f.vars = () => [M, method, reac_volume];
	if (live(method) === null) {
		method = 1;
	}
	yield* g.callName(f, live(M), "ForceContractDisease", [(yield* g.new_(f, T("/datum/disease/transformation/morph"), [0]))]);
	return f.dot;
}, true);

rt.type(3627, "/datum/reagent/serotrotium", "/datum/reagent", {
	name: "Serotrotium",
	id: "serotrotium",
	description: "A chemical compound that promotes concentrated production of the serotonin neurotransmitter in humans.",
	color: "#202040",
	metabolization_rate: 0.1,
	taste_description: "bitterness",
});

// /datum/reagent/serotrotium/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:598)  may sleep
rt.def("/datum/reagent/serotrotium/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(rt.op(f, "Prob", [], [7]))) {
			yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [4], ["twitch", "drool", "moan", "gasp"])]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3628, "/datum/reagent/oxygen", "/datum/reagent", {
	name: "Oxygen",
	id: "oxygen",
	description: "A colorless, odorless gas. Grows on trees but is still pretty valuable.",
	reagent_state: 3,
	color: "#808080",
	taste_mult: 0,
});

// /datum/reagent/oxygen/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/other_reagents.dm:612)
rt.def("/datum/reagent/oxygen/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if ((!truthy(live(O)) || !truthy(live(reac_volume)))) {
		return 0;
	}
	rt.callName(f, live(O), "atmos_spawn_air", [fmt("o2=＀;TEMP=＀", [divide(live(reac_volume), 2), 293.1499938964844])]);
	return f.dot;
});

// /datum/reagent/oxygen/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:617)
rt.def("/datum/reagent/oxygen/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) {
		rt.callName(f, live(_T), "atmos_spawn_air", [fmt("o2=＀;TEMP=＀", [divide(live(reac_volume), 2), 293.1499938964844])]);
	}
	return live(f.dot);
});

rt.type(3630, "/datum/reagent/nitrogen", "/datum/reagent", {
	name: "Nitrogen",
	id: "nitrogen",
	description: "A colorless, odorless, tasteless gas. A simple asphyxiant that can silently displace vital oxygen.",
	reagent_state: 3,
	color: "#808080",
	taste_mult: 0,
});

// /datum/reagent/nitrogen/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/other_reagents.dm:638)
rt.def("/datum/reagent/nitrogen/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if ((!truthy(live(O)) || !truthy(live(reac_volume)))) {
		return 0;
	}
	rt.callName(f, live(O), "atmos_spawn_air", [fmt("n2=＀;TEMP=＀", [divide(live(reac_volume), 2), 293.1499938964844])]);
	return f.dot;
});

// /datum/reagent/nitrogen/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:643)
rt.def("/datum/reagent/nitrogen/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) {
		rt.callName(f, live(_T), "atmos_spawn_air", [fmt("n2=＀;TEMP=＀", [divide(live(reac_volume), 2), 293.1499938964844])]);
	}
	return live(f.dot);
});

rt.type(3633, "/datum/reagent/mercury", "/datum/reagent", {
	name: "Mercury",
	id: "mercury",
	description: "A curious metal that's a liquid at room temperature. Neurodegenerative and very bad for the mind.",
	color: "#484848",
	taste_mult: 0,
});

// /datum/reagent/mercury/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:671)  may sleep
rt.def("/datum/reagent/mercury/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy(rt.fv(f, "canmove", live(f.args[0]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/turf/open/space")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
	}
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [3], ["twitch", "drool", "moan"])]);
	}
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [2]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3635, "/datum/reagent/carbon", "/datum/reagent", {
	name: "Carbon",
	id: "carbon",
	description: "A crumbly black solid that, while unexciting on an physical level, forms the base of all known life. Kind of a big deal.",
	reagent_state: 1,
	color: "#1C1300",
	taste_description: "sour chalk",
});

// /datum/reagent/carbon/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:695)  may sleep
rt.def("/datum/reagent/carbon/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let D: Value = null;
	f.vars = () => [_T, reac_volume, D];
	if (truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) return f.dot;
	if (truthy((D = rt.locateIn(f, T("/obj/effect/decal/cleanable/dirt"), rt.fv(f, "contents", live(_T)))))) return f.dot;
	yield* g.new_(f, T("/obj/effect/decal/cleanable/dirt"), [live(_T)]);
	return f.dot;
}, true);

rt.type(3636, "/datum/reagent/chlorine", "/datum/reagent", {
	name: "Chlorine",
	id: "chlorine",
	description: "A pale yellow gas that's well known as an oxidizer. While it forms many harmless molecules in its elemental form it is far from harmless.",
	reagent_state: 3,
	color: "#808080",
	taste_description: "chlorine",
});

// /datum/reagent/chlorine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:709)  may sleep
rt.def("/datum/reagent/chlorine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "take_bodypart_damage", [1, 0, 0]);
	f.dot = 1;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3637, "/datum/reagent/fluorine", "/datum/reagent", {
	name: "Fluorine",
	id: "fluorine",
	description: "A comically-reactive chemical element. The universe does not want this stuff to exist in this form in the slightest.",
	reagent_state: 3,
	color: "#808080",
	taste_description: "acid",
});

// /datum/reagent/fluorine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:722)  may sleep
rt.def("/datum/reagent/fluorine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
	f.dot = 1;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3640, "/datum/reagent/lithium", "/datum/reagent", {
	name: "Lithium",
	id: "lithium",
	description: "A silver metal, its claim to fame is its remarkably low density. Using it is a bit too effective in calming oneself down.",
	reagent_state: 1,
	color: "#808080",
	taste_description: "metal",
});

// /datum/reagent/lithium/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:751)  may sleep
rt.def("/datum/reagent/lithium/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy(rt.fv(f, "canmove", live(f.args[0]))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.args[0])), T("/turf/open/space")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
	}
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [3], ["twitch", "drool", "moan"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3642, "/datum/reagent/radium", "/datum/reagent", {
	name: "Radium",
	id: "radium",
	description: "Radium is an alkaline earth metal. It is extremely radioactive.",
	reagent_state: 1,
	color: "#C7C7C7",
	taste_description: "the colour blue and regret",
});

// /datum/reagent/radium/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:773)  may sleep
rt.def("/datum/reagent/radium/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "apply_effect", [divide(2, rt.fv(f, "metabolism_efficiency", live(f.args[0]))), "irradiate", 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/radium/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:777)  may sleep
rt.def("/datum/reagent/radium/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let GG: Value = null;
	f.vars = () => [_T, reac_volume, GG];
	if (!rt.ge(live(reac_volume), 3)) return f.dot;
	if (truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) return f.dot;
	if (!truthy((GG = rt.locateIn(f, T("/obj/effect/decal/cleanable/greenglow"), rt.fv(f, "contents", live(_T)))))) {
		GG = (yield* g.new_(f, T("/obj/effect/decal/cleanable/greenglow"), [live(_T)]));
	}
	yield* g.callName(f, rt.fv(f, "reagents", live(GG)), "add_reagent", ["radium", live(reac_volume)]);
	return f.dot;
}, true);

rt.type(3644, "/datum/reagent/space_cleaner/sterilizine", "/datum/reagent/space_cleaner", {
	name: "Sterilizine",
	id: "sterilizine",
	description: "Sterilizes wounds in preparation for surgery.",
	color: "#C8A5DC",
	taste_description: "bitterness",
});

// /datum/reagent/space_cleaner/sterilizine/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:792)  may sleep
rt.def("/datum/reagent/space_cleaner/sterilizine/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let C: Value = null, s: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [C, s, S, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)) && truthy((rt.isIn(f, live(f.args[1]), rt.list(1, 3, 4)) ? 1 : 0)))) {
		C = live(f.args[0]);
		s = null;
		rt.forList(f, 0, rt.fv(f, "surgeries", live(C)));
		while (($e = rt.next(f, 0)) !== undefined) {
			s = $e;
			rt.setFv(f, "success_multiplier", (S = live(s)), (yield* g.call(f, P("/proc/max"), null, [0.20000000298023224, rt.fv(f, "success_multiplier", live(S))])));
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3646, "/datum/reagent/iron", "/datum/reagent", {
	name: "Iron",
	id: "iron",
	description: "Pure iron is a metal.",
	reagent_state: 1,
	taste_description: "iron",
	color: "#C8A5DC",
});

// /datum/reagent/iron/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:810)  may sleep
rt.def("/datum/reagent/iron/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		if (rt.lt(rt.gv(f, "blood_volume", (C = live(f.args[0]))), 560)) {
			rt.modField(f, live(C), "blood_volume", 0.5, add);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/iron/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:817)  may sleep
rt.def("/datum/reagent/iron/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "has_bane", ["iron"])))) {
		if ((truthy(rt.sv(f, "holder")) && rt.lt(rt.fv(f, "chem_temp", rt.sv(f, "holder")), 100))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["toxin", live(f.args[2])]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3648, "/datum/reagent/silver", "/datum/reagent", {
	name: "Silver",
	id: "silver",
	description: "A soft, white, lustrous transition metal, it has the highest electrical conductivity of any element and the highest thermal conductivity of any metal.",
	reagent_state: 1,
	color: "#D0D0D0",
	taste_description: "expensive yet reasonable metal",
});

// /datum/reagent/silver/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:841)  may sleep
rt.def("/datum/reagent/silver/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "has_bane", ["silver"])))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["toxin", live(f.args[2])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3649, "/datum/reagent/uranium", "/datum/reagent", {
	name: "Uranium",
	id: "uranium",
	description: "A silvery-white metallic chemical element in the actinide series, weakly radioactive.",
	reagent_state: 1,
	color: "#B8B8C0",
	taste_description: "the inside of a reactor",
});

// /datum/reagent/uranium/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:856)  may sleep
rt.def("/datum/reagent/uranium/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "apply_effect", [divide(1, rt.fv(f, "metabolism_efficiency", live(f.args[0]))), "irradiate", 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/uranium/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:860)  may sleep
rt.def("/datum/reagent/uranium/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let GG: Value = null;
	f.vars = () => [_T, reac_volume, GG];
	if (!rt.ge(live(reac_volume), 3)) return f.dot;
	if (truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) return f.dot;
	if (!truthy((GG = rt.locateIn(f, T("/obj/effect/decal/cleanable/greenglow"), rt.fv(f, "contents", live(_T)))))) {
		GG = (yield* g.new_(f, T("/obj/effect/decal/cleanable/greenglow"), [live(_T)]));
	}
	yield* g.callName(f, rt.fv(f, "reagents", live(GG)), "add_reagent", ["uranium", live(reac_volume)]);
	return f.dot;
}, true);

rt.type(3653, "/datum/reagent/bluespace", "/datum/reagent", {
	name: "Bluespace Dust",
	id: "bluespace",
	description: "A dust composed of microscopic bluespace crystals, with minor space-warping properties.",
	reagent_state: 1,
	color: "#0000CC",
	taste_description: "fizzling blue",
});

// /datum/reagent/bluespace/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:876)  may sleep
rt.def("/datum/reagent/bluespace/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if ((isEqual(live(f.args[1]), 1) || isEqual(live(f.args[1]), 3))) {
		yield* g.call(f, P("/proc/do_teleport"), null, [null, live(f.args[0]), null, rt.getStep(f, live(f.args[0]), 0), null, divide(live(f.args[2]), 5), "asoundin", rt.rsc("sound/effects/phasein.ogg")], rt.Args.Named);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// /datum/reagent/bluespace/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:881)  may sleep
rt.def("/datum/reagent/bluespace/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((rt.gt(rt.sv(f, "current_cycle"), 10) && truthy(rt.op(f, "Prob", [], [15])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You feel unstable...</span>"]);
		yield* g.callName(f, live(f.args[0]), "Jitter", [2]);
		rt.setSv(f, "current_cycle", 1);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/do_teleport"), live(f.args[0]), rt.getStep(f, live(f.args[0]), 0), 5, null, null, null, rt.rsc("sound/effects/phasein.ogg")])), 30]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3604, "/datum/reagent/fuel", "/datum/reagent", {
	name: "Welding fuel",
	id: "welding_fuel",
	description: "Required for welders. Flamable.",
	color: "#660000",
	taste_description: "gross metal",
	glass_icon_state: "dr_gibb_glass",
	glass_name: "glass of welder fuel",
	glass_desc: "Unless you're an industrial tool, this is probably not safe for consumption.",
});

// /datum/reagent/fuel/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:915)  may sleep
rt.def("/datum/reagent/fuel/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((isEqual(live(f.args[1]), 1) || isEqual(live(f.args[1]), 3))) {
		yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [divide(live(f.args[2]), 10)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// /datum/reagent/fuel/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:923)  may sleep
rt.def("/datum/reagent/fuel/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
	f.dot = 1;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3643, "/datum/reagent/space_cleaner", "/datum/reagent", {
	name: "Space cleaner",
	id: "cleaner",
	description: "A compound used to clean things. Now with 50% more sodium hypochlorite!",
	color: "#A5F0EE",
	taste_description: "sourness",
});

// /datum/reagent/space_cleaner/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/other_reagents.dm:935)  may sleep
rt.def("/datum/reagent/space_cleaner/proc/reaction_obj", function* reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	f.vars = () => [O, reac_volume];
	if (truthy((rt.istype(live(O), T("/obj/effect/decal/cleanable")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	} else {
		if (!truthy(live(O))) return f.dot;
		yield* g.callName(f, live(O), "remove_atom_colour", [3]);
		yield* g.callName(f, live(O), "clean_blood", []);
	}
	return f.dot;
}, true);

// /datum/reagent/space_cleaner/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:943)  may sleep
rt.def("/datum/reagent/space_cleaner/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let C: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [_T, reac_volume, C, M, $e];
	if (!rt.ge(live(reac_volume), 1)) return f.dot;
	yield* g.callName(f, live(_T), "remove_atom_colour", [3]);
	yield* g.callName(f, live(_T), "clean_blood", []);
	C = null;
	rt.forList(f, 0, live(_T), T("/obj/effect/decal/cleanable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(_T), T("/mob/living/simple_animal/slime"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "adjustToxLoss", [(yield* g.call(f, P("/proc/rand"), null, [5, 10]))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/reagent/space_cleaner/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:953)  may sleep
rt.def("/datum/reagent/space_cleaner/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let C: Value = null, H: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [M, method, reac_volume, C, H, I, $e];
	if (live(method) === null) {
		method = 1;
	}
	if (!(isEqual(live(method), 1) || isEqual(live(method), 3))) return f.dot;
	yield* g.callName(f, live(M), "remove_atom_colour", [3]);
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	C = live(M);
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "lip_style", (H = live(M))))) {
			rt.setFv(f, "lip_style", live(H), null);
			yield* g.callName(f, live(H), "update_body", []);
		}
	}
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(C)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(I), "clean_blood", []);
	}
	rt.endFor(f, 0);
	if (truthy(rt.fv(f, "wear_mask", live(C)))) {
		if (truthy((yield* g.callName(f, rt.fv(f, "wear_mask", live(C)), "clean_blood", [])))) {
			yield* g.callName(f, live(C), "update_inv_wear_mask", []);
		}
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "head", (H = live(C))))) {
			if (truthy((yield* g.callName(f, rt.fv(f, "head", live(H)), "clean_blood", [])))) {
				yield* g.callName(f, live(H), "update_inv_head", []);
			}
		}
		if (truthy(rt.fv(f, "wear_suit", live(H)))) {
			if (truthy((yield* g.callName(f, rt.fv(f, "wear_suit", live(H)), "clean_blood", [])))) {
				yield* g.callName(f, live(H), "update_inv_wear_suit", []);
			}
		} else {
			if (truthy(rt.fv(f, "w_uniform", live(H)))) {
				if (truthy((yield* g.callName(f, rt.fv(f, "w_uniform", live(H)), "clean_blood", [])))) {
					yield* g.callName(f, live(H), "update_inv_w_uniform", []);
				}
			}
		}
		if (truthy(rt.fv(f, "shoes", live(H)))) {
			if (truthy((yield* g.callName(f, rt.fv(f, "shoes", live(H)), "clean_blood", [])))) {
				yield* g.callName(f, live(H), "update_inv_shoes", []);
			}
		}
		yield* g.callName(f, live(H), "wash_cream", []);
	}
	yield* g.callName(f, live(M), "clean_blood", []);
	return f.dot;
}, true);

rt.type(3645, "/datum/reagent/space_cleaner/ez_clean", "/datum/reagent/space_cleaner", {
	name: "EZ Clean",
	id: "ez_clean",
	description: "A powerful, acidic cleaner sold by Waffle Co. Affects organic matter while leaving other objects unaffected.",
	metabolization_rate: 0.6,
	taste_description: "acid",
});

// /datum/reagent/space_cleaner/ez_clean/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:992)  may sleep
rt.def("/datum/reagent/space_cleaner/ez_clean/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [3.3299999237060547]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [3.3299999237060547]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [3.3299999237060547]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/space_cleaner/ez_clean/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:998)  may sleep
rt.def("/datum/reagent/space_cleaner/ez_clean/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((isEqual(live(f.args[1]), 1) || isEqual(live(f.args[1]), 3)) && !truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [1]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [1]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3656, "/datum/reagent/cryptobiolin", "/datum/reagent", {
	name: "Cryptobiolin",
	id: "cryptobiolin",
	description: "Cryptobiolin causes confusion and dizziness.",
	color: "#C8A5DC",
	metabolization_rate: 0.6,
	taste_description: "sourness",
});

// /datum/reagent/cryptobiolin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1012)  may sleep
rt.def("/datum/reagent/cryptobiolin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "Dizzy", [1]);
	if (!truthy(rt.fv(f, "confused", live(f.args[0])))) {
		rt.setFv(f, "confused", live(f.args[0]), 1);
	}
	rt.setFv(f, "confused", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "confused", live(f.args[0])), 20])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3657, "/datum/reagent/impedrezene", "/datum/reagent", {
	name: "Impedrezene",
	id: "impedrezene",
	description: "Impedrezene is a narcotic that impedes one's ability by slowing down the higher brain cell functions.",
	color: "#C8A5DC",
	taste_description: "numbness",
});

// /datum/reagent/impedrezene/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1026)  may sleep
rt.def("/datum/reagent/impedrezene/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "jitteriness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "jitteriness", live(f.args[0])), 5), 0])));
	if (truthy(rt.op(f, "Prob", [], [80]))) {
		yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [1]);
	}
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "drowsyness", live(f.args[0])), 3])));
	}
	if (truthy(rt.op(f, "Prob", [], [10]))) {
		yield* g.callName(f, live(f.args[0]), "emote", ["drool"]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3658, "/datum/reagent/nanites", "/datum/reagent", {
	name: "Nanomachines",
	id: "nanomachines",
	description: "Microscopic construction robots.",
	color: "#535E66",
	can_synth: 0,
	taste_description: "sludge",
});

// /datum/reagent/nanites/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1044)  may sleep
rt.def("/datum/reagent/nanites/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value) {
	f.vars = () => [M, method, reac_volume, show_message, touch_protection];
	if (live(method) === null) {
		method = 1;
	}
	if (live(show_message) === null) {
		show_message = 1;
	}
	if (live(touch_protection) === null) {
		touch_protection = 0;
	}
	if (!(((isEqual(live(method), 4) || isEqual(live(method), 2)) || isEqual(live(method), 5)) || (isEqual(live(method), 3) && truthy(rt.op(f, "Prob", [], [multiply((yield* g.call(f, P("/proc/min"), null, [live(reac_volume), 100])), subtract(1, live(touch_protection)))]))))) return f.dot;
	yield* g.callName(f, live(M), "ForceContractDisease", [(yield* g.new_(f, T("/datum/disease/transformation/robot"), [0]))]);
	return f.dot;
}, true);

rt.type(3659, "/datum/reagent/xenomicrobes", "/datum/reagent", {
	name: "Xenomicrobes",
	id: "xenomicrobes",
	description: "Microbes with an entirely alien cellular structure.",
	color: "#535E66",
	can_synth: 0,
	taste_description: "sludge",
});

// /datum/reagent/xenomicrobes/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1056)  may sleep
rt.def("/datum/reagent/xenomicrobes/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value) {
	f.vars = () => [M, method, reac_volume, show_message, touch_protection];
	if (live(method) === null) {
		method = 1;
	}
	if (live(show_message) === null) {
		show_message = 1;
	}
	if (live(touch_protection) === null) {
		touch_protection = 0;
	}
	if (!(((isEqual(live(method), 4) || isEqual(live(method), 2)) || isEqual(live(method), 5)) || (isEqual(live(method), 3) && truthy(rt.op(f, "Prob", [], [multiply((yield* g.call(f, P("/proc/min"), null, [live(reac_volume), 100])), subtract(1, live(touch_protection)))]))))) return f.dot;
	yield* g.callName(f, live(M), "ContractDisease", [(yield* g.new_(f, T("/datum/disease/transformation/xeno"), [0]))]);
	return f.dot;
}, true);

rt.type(3660, "/datum/reagent/fungalspores", "/datum/reagent", {
	name: "Tubercle bacillus Cosmosis microbes",
	id: "fungalspores",
	description: "Active fungal spores.",
	color: "#92D17D",
	taste_description: "slime",
});

// /datum/reagent/fungalspores/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1067)  may sleep
rt.def("/datum/reagent/fungalspores/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value) {
	f.vars = () => [M, method, reac_volume, show_message, touch_protection];
	if (live(method) === null) {
		method = 1;
	}
	if (live(show_message) === null) {
		show_message = 1;
	}
	if (live(touch_protection) === null) {
		touch_protection = 0;
	}
	if (!(((isEqual(live(method), 4) || isEqual(live(method), 2)) || isEqual(live(method), 5)) || (isEqual(live(method), 3) && truthy(rt.op(f, "Prob", [], [multiply((yield* g.call(f, P("/proc/min"), null, [live(reac_volume), 100])), subtract(1, live(touch_protection)))]))))) return f.dot;
	yield* g.callName(f, live(M), "ForceContractDisease", [(yield* g.new_(f, T("/datum/disease/tuberculosis"), [0]))]);
	return f.dot;
}, true);

rt.type(3665, "/datum/reagent/carbondioxide", "/datum/reagent", {
	name: "Carbon Dioxide",
	id: "co2",
	reagent_state: 3,
	description: "A gas commonly produced by burning carbon fuels. You're constantly producing this in your lungs.",
	color: "#B0B0B0",
	taste_description: "something unknowable",
});

// /datum/reagent/carbondioxide/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1109)
rt.def("/datum/reagent/carbondioxide/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if ((!truthy(live(O)) || !truthy(live(reac_volume)))) {
		return 0;
	}
	rt.callName(f, live(O), "atmos_spawn_air", [fmt("co2=＀;TEMP=＀", [divide(live(reac_volume), 5), 293.1499938964844])]);
	return f.dot;
});

// /datum/reagent/carbondioxide/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1114)
rt.def("/datum/reagent/carbondioxide/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) {
		rt.callName(f, live(_T), "atmos_spawn_air", [fmt("co2=＀;TEMP=＀", [divide(live(reac_volume), 5), 293.1499938964844])]);
	}
	return live(f.dot);
});

rt.type(3666, "/datum/reagent/nitrous_oxide", "/datum/reagent", {
	name: "Nitrous Oxide",
	id: "nitrous_oxide",
	description: "A potent oxidizer used as fuel in rockets and as an anaesthetic during surgery.",
	reagent_state: 2,
	metabolization_rate: 0.6,
	color: "#808080",
	taste_description: "sweetness",
});

// /datum/reagent/nitrous_oxide/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1128)
rt.def("/datum/reagent/nitrous_oxide/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if ((!truthy(live(O)) || !truthy(live(reac_volume)))) {
		return 0;
	}
	rt.callName(f, live(O), "atmos_spawn_air", [fmt("n2o=＀;TEMP=＀", [divide(live(reac_volume), 5), 293.1499938964844])]);
	return f.dot;
});

// /datum/reagent/nitrous_oxide/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1133)
rt.def("/datum/reagent/nitrous_oxide/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (!truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) return f.dot;
	rt.callName(f, live(_T), "atmos_spawn_air", [fmt("n2o=＀;TEMP=＀", [divide(live(reac_volume), 5), 293.1499938964844])]);
	return f.dot;
});

// /datum/reagent/nitrous_oxide/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1137)
rt.def("/datum/reagent/nitrous_oxide/proc/reaction_mob", function reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	f.vars = () => [method];
	if (live(method) === null) {
		method = 1;
	}
	if (!isEqual(live(method), 3)) return f.dot;
	rt.modField(f, live(M), "drowsyness", rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/round"), null, [live(reac_volume), 1]), 2]), add);
	return f.dot;
});

// /datum/reagent/nitrous_oxide/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1141)  may sleep
rt.def("/datum/reagent/nitrous_oxide/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	rt.modField(f, live(f.args[0]), "drowsyness", 2, add);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.setFv(f, "blood_volume", (H = live(f.args[0])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "blood_volume", live(H)), 2.5), 0])));
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		rt.modField(f, live(f.args[0]), "losebreath", 2, add);
		rt.setFv(f, "confused", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "confused", live(f.args[0])), 2), 5])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3668, "/datum/reagent/colorful_reagent/crayonpowder", "/datum/reagent/colorful_reagent", {
	colorname: "none",
	name: "Crayon Powder",
	id: "crayon powder",
	description: "A powder made by grinding down crayons, good for colouring chemical reagents.",
	reagent_state: 1,
	color: "#FFFFFF",
	taste_description: "the back of class",
});

// /datum/reagent/colorful_reagent/crayonpowder/proc/New  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1164)
rt.def("/datum/reagent/colorful_reagent/crayonpowder/proc/New", function New(f: Frame) {
	rt.setSv(f, "description", fmt("＇！ powder made by grinding down crayons, good for colouring chemical reagents.", [rt.sv(f, "colorname")]));
	return f.dot;
});

rt.type(3669, "/datum/reagent/colorful_reagent/crayonpowder/red", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Red Crayon Powder",
	id: "redcrayonpowder",
	colorname: "red",
	color: "#DA0000",
	random_color_list: null,
});

// /datum/reagent/colorful_reagent/crayonpowder/red/proc/<init>  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1172)
rt.def("/datum/reagent/colorful_reagent/crayonpowder/red/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_color_list", rt.list("#DA0000"));
	return f.dot;
});

rt.type(3670, "/datum/reagent/colorful_reagent/crayonpowder/orange", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Orange Crayon Powder",
	id: "orangecrayonpowder",
	colorname: "orange",
	color: "#FF9300",
	random_color_list: null,
});

// /datum/reagent/colorful_reagent/crayonpowder/orange/proc/<init>  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1179)
rt.def("/datum/reagent/colorful_reagent/crayonpowder/orange/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_color_list", rt.list("#FF9300"));
	return f.dot;
});

rt.type(3671, "/datum/reagent/colorful_reagent/crayonpowder/yellow", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Yellow Crayon Powder",
	id: "yellowcrayonpowder",
	colorname: "yellow",
	color: "#FFF200",
	random_color_list: null,
});

// /datum/reagent/colorful_reagent/crayonpowder/yellow/proc/<init>  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1186)
rt.def("/datum/reagent/colorful_reagent/crayonpowder/yellow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_color_list", rt.list("#FFF200"));
	return f.dot;
});

rt.type(3672, "/datum/reagent/colorful_reagent/crayonpowder/green", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Green Crayon Powder",
	id: "greencrayonpowder",
	colorname: "green",
	color: "#A8E61D",
	random_color_list: null,
});

// /datum/reagent/colorful_reagent/crayonpowder/green/proc/<init>  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1193)
rt.def("/datum/reagent/colorful_reagent/crayonpowder/green/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_color_list", rt.list("#A8E61D"));
	return f.dot;
});

rt.type(3673, "/datum/reagent/colorful_reagent/crayonpowder/blue", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Blue Crayon Powder",
	id: "bluecrayonpowder",
	colorname: "blue",
	color: "#00B7EF",
	random_color_list: null,
});

// /datum/reagent/colorful_reagent/crayonpowder/blue/proc/<init>  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1200)
rt.def("/datum/reagent/colorful_reagent/crayonpowder/blue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_color_list", rt.list("#00B7EF"));
	return f.dot;
});

rt.type(3674, "/datum/reagent/colorful_reagent/crayonpowder/purple", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Purple Crayon Powder",
	id: "purplecrayonpowder",
	colorname: "purple",
	color: "#DA00FF",
	random_color_list: null,
});

// /datum/reagent/colorful_reagent/crayonpowder/purple/proc/<init>  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1207)
rt.def("/datum/reagent/colorful_reagent/crayonpowder/purple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_color_list", rt.list("#DA00FF"));
	return f.dot;
});

rt.type(3675, "/datum/reagent/colorful_reagent/crayonpowder/invisible", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Invisible Crayon Powder",
	id: "invisiblecrayonpowder",
	colorname: "invisible",
	color: "#FFFFFF00",
	random_color_list: null,
});

// /datum/reagent/colorful_reagent/crayonpowder/invisible/proc/<init>  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1214)
rt.def("/datum/reagent/colorful_reagent/crayonpowder/invisible/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_color_list", rt.list(null));
	return f.dot;
});

rt.type(3676, "/datum/reagent/colorful_reagent/crayonpowder/black", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Black Crayon Powder",
	id: "blackcrayonpowder",
	colorname: "black",
	color: "#1C1C1C",
	random_color_list: null,
});

// /datum/reagent/colorful_reagent/crayonpowder/black/proc/<init>  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1221)
rt.def("/datum/reagent/colorful_reagent/crayonpowder/black/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_color_list", rt.list("#404040"));
	return f.dot;
});

rt.type(3677, "/datum/reagent/colorful_reagent/crayonpowder/white", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "White Crayon Powder",
	id: "whitecrayonpowder",
	colorname: "white",
	color: "#FFFFFF",
	random_color_list: null,
});

// /datum/reagent/colorful_reagent/crayonpowder/white/proc/<init>  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1228)
rt.def("/datum/reagent/colorful_reagent/crayonpowder/white/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_color_list", rt.list("#FFFFFF"));
	return f.dot;
});

rt.type(3678, "/datum/reagent/plantnutriment", "/datum/reagent", {
	tox_prob: 0,
	name: "Generic nutriment",
	id: "plantnutriment",
	description: "Some kind of nutriment. You can't really tell what it is. You should probably report it, along with how you obtained it.",
	color: "#000000",
	taste_description: "plant food",
});

// /datum/reagent/plantnutriment/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1244)  may sleep
rt.def("/datum/reagent/plantnutriment/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "tox_prob")]))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3683, "/datum/reagent/stable_plasma", "/datum/reagent", {
	name: "Stable Plasma",
	id: "stable_plasma",
	description: "Non-flammable plasma locked into a liquid form that cannot ignite or become gaseous/solid.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "bitterness",
	taste_mult: 1.5,
});

// /datum/reagent/stable_plasma/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1298)  may sleep
rt.def("/datum/reagent/stable_plasma/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C = live(f.args[0])), "adjustPlasma", [10]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true, { args: ["M"] });

rt.type(3685, "/datum/reagent/carpet", "/datum/reagent", {
	name: "Carpet",
	id: "carpet",
	description: "For those that need a more creative way to roll out a red carpet.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "carpet",
});

// /datum/reagent/carpet/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1321)  may sleep
rt.def("/datum/reagent/carpet/proc/reaction_turf", function* reaction_turf(f: Frame) {
	let F: Value = null;
	f.vars = () => [F];
	if ((truthy((rt.istype(live(f.args[0]), T("/turf/open/floor/plating")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/turf/open/floor/plasteel")) ? 1 : 0)))) {
		yield* g.callName(f, (F = live(f.args[0])), "ChangeTurf", [T("/turf/open/floor/carpet")]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true, { args: ["T", "reac_volume"] });

rt.type(3667, "/datum/reagent/colorful_reagent", "/datum/reagent", {
	random_color_list: null,
	name: "Colorful Reagent",
	id: "colorful_reagent",
	description: "Thoroughly sample the rainbow.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "rainbows",
});

// /datum/reagent/colorful_reagent/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1370)  may sleep
rt.def("/datum/reagent/colorful_reagent/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy(live(f.args[0])) && truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)))) {
		yield* g.callName(f, live(f.args[0]), "add_atom_colour", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "random_color_list")]), 3]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/colorful_reagent/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1375)  may sleep
rt.def("/datum/reagent/colorful_reagent/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if ((truthy(live(f.args[0])) && truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)))) {
		yield* g.callName(f, live(f.args[0]), "add_atom_colour", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "random_color_list")]), 3]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "reac_volume"] });

// /datum/reagent/colorful_reagent/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1381)
rt.def("/datum/reagent/colorful_reagent/proc/reaction_obj", function reaction_obj(f: Frame) {
	if (truthy(live(f.args[0]))) {
		rt.callName(f, live(f.args[0]), "add_atom_colour", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "random_color_list")]), 3]);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["O", "reac_volume"] });

// /datum/reagent/colorful_reagent/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1386)
rt.def("/datum/reagent/colorful_reagent/proc/reaction_turf", function reaction_turf(f: Frame) {
	if (truthy(live(f.args[0]))) {
		rt.callName(f, live(f.args[0]), "add_atom_colour", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "random_color_list")]), 3]);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["T", "reac_volume"] });

rt.type(3690, "/datum/reagent/hair_dye", "/datum/reagent", {
	potential_colors: null,
	name: "Quantum Hair Dye",
	id: "hair_dye",
	description: "Has a high chance of making you look like a mad scientist.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "sourness",
});

// /datum/reagent/hair_dye/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1399)  may sleep
rt.def("/datum/reagent/hair_dye/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let H: Value = null;
	f.vars = () => [M, method, reac_volume, H];
	if (live(method) === null) {
		method = 1;
	}
	if (!(isEqual(live(method), 1) || isEqual(live(method), 3))) return f.dot;
	if (!(truthy(live(M)) && truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	rt.setFv(f, "hair_color", (H = live(M)), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "potential_colors")]));
	rt.setFv(f, "facial_hair_color", live(H), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "potential_colors")]));
	yield* g.callName(f, live(H), "update_hair", []);
	return f.dot;
}, true);

rt.type(3691, "/datum/reagent/barbers_aid", "/datum/reagent", {
	name: "Barber's Aid",
	id: "barbers_aid",
	description: "A solution to hair loss across the world.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "sourness",
});

// /datum/reagent/barbers_aid/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1415)  may sleep
rt.def("/datum/reagent/barbers_aid/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let H: Value = null, picked_hair: Value = null, picked_beard: Value = null;
	f.vars = () => [M, method, reac_volume, H, picked_hair, picked_beard];
	if (live(method) === null) {
		method = 1;
	}
	if (!(isEqual(live(method), 1) || isEqual(live(method), 3))) return f.dot;
	if (!(truthy(live(M)) && truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	H = live(M);
	picked_hair = rt.op(f, "PickUnweighted", [1], [rt.gl("hair_styles_list")]);
	picked_beard = rt.op(f, "PickUnweighted", [1], [rt.gl("facial_hair_styles_list")]);
	rt.setFv(f, "hair_style", live(H), live(picked_hair));
	rt.setFv(f, "facial_hair_style", live(H), live(picked_beard));
	yield* g.callName(f, live(H), "update_hair", []);
	return f.dot;
}, true);

rt.type(3692, "/datum/reagent/concentrated_barbers_aid", "/datum/reagent", {
	name: "Concentrated Barber's Aid",
	id: "concentrated_barbers_aid",
	description: "A concentrated solution to hair loss across the world.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "sourness",
});

// /datum/reagent/concentrated_barbers_aid/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1433)  may sleep
rt.def("/datum/reagent/concentrated_barbers_aid/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let H: Value = null;
	f.vars = () => [M, method, reac_volume, H];
	if (live(method) === null) {
		method = 1;
	}
	if (!(isEqual(live(method), 1) || isEqual(live(method), 3))) return f.dot;
	if (!(truthy(live(M)) && truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	rt.setFv(f, "hair_style", (H = live(M)), "Very Long Hair");
	rt.setFv(f, "facial_hair_style", live(H), "Very Long Beard");
	yield* g.callName(f, live(H), "update_hair", []);
	return f.dot;
}, true);

rt.type(3695, "/datum/reagent/drying_agent", "/datum/reagent", {
	name: "Drying agent",
	id: "drying_agent",
	description: "A desiccant. Can be used to dry things.",
	reagent_state: 2,
	color: "#A70FFF",
	taste_description: "dryness",
});

// /datum/reagent/drying_agent/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1465)  may sleep
rt.def("/datum/reagent/drying_agent/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	f.vars = () => [_T, reac_volume];
	if (!(truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0)) && truthy(rt.fv(f, "wet", live(_T))))) return f.dot;
	rt.setFv(f, "wet_time", live(_T), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "wet_time", live(_T)), multiply(live(reac_volume), 5))])));
	yield* g.callName(f, live(_T), "HandleWet", []);
	return f.dot;
}, true);

// /datum/reagent/drying_agent/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1470)  may sleep
rt.def("/datum/reagent/drying_agent/proc/reaction_obj", function* reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	let t_loc: Value = null;
	f.vars = () => [O, reac_volume, t_loc];
	if (!isEqual(rt.fv(f, "type", live(O)), T("/obj/item/clothing/shoes/galoshes"))) return f.dot;
	t_loc = rt.getStep(f, live(O), 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/galoshes/dry"), [live(t_loc)]);
	return f.dot;
}, true);

rt.type(3750, "/datum/reagent/royal_bee_jelly", "/datum/reagent", {
	name: "royal bee jelly",
	id: "royal_bee_jelly",
	description: "Royal Bee Jelly, if injected into a Queen Space Bee said bee will split into two bees.",
	color: "#00ff80",
	taste_description: "strange honey",
});

// /datum/reagent/royal_bee_jelly/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1537)  may sleep
rt.def("/datum/reagent/royal_bee_jelly/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [2]))) {
		yield* g.callName(f, live(f.args[0]), "say", [rt.op(f, "PickUnweighted", [3], ["Bzzz...", "BZZ BZZ", "Bzzzzzzzzzzz..."])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3751, "/datum/reagent/romerol", "/datum/reagent", {
	name: "Romerol",
	id: "romerol",
	description: "Romerol is a highly experimental bioterror agent which causes dormant nodules to be etched into the grey matter of the subject. These nodules only become active upon death of the host, upon which, the secondary structures activate and take control of the host body.",
	color: "#123524",
	metabolization_rate: 1e+31,
	can_synth: 0,
	taste_description: "brains",
});

// /datum/reagent/romerol/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1559)  may sleep
rt.def("/datum/reagent/romerol/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let ZI: Value = null;
	f.vars = () => [ZI];
	if (!truthy((yield* g.callName(f, live(f.args[0]), "getorganslot", ["zombie_infection"])))) {
		yield* g.callName(f, (ZI = (yield* g.new_(f, T("/obj/item/organ/zombie_infection"), []))), "Insert", [live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H"] });

rt.type(3752, "/datum/reagent/growthserum", "/datum/reagent", {
	current_size: 1,
	name: "Growth Serum",
	id: "growthserum",
	description: "A commercial chemical designed to help older men in the bedroom.",
	color: "#ff0000",
	taste_description: "bitterness",
});

// /datum/reagent/growthserum/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1573)  may sleep
rt.def("/datum/reagent/growthserum/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let newsize: Value = null;
	let $0: any;
	f.vars = () => [newsize, $0];
	newsize = rt.sv(f, "current_size");
	$0 = rt.sv(f, "volume");
	if (rt.inRange($0, 0, 19)) {
		newsize = 1.25;
	} else if (rt.inRange($0, 20, 49)) {
		newsize = 1.5;
	} else if (rt.inRange($0, 50, 99)) {
		newsize = 2;
	} else if (rt.inRange($0, 100, 199)) {
		newsize = 2.5;
	} else if (rt.inRange($0, 200, 9.999999848243207e+30)) {
		newsize = 3.5;
	}
	rt.setFv(f, "resize", live(f.args[0]), divide(live(newsize), rt.sv(f, "current_size")));
	rt.setSv(f, "current_size", live(newsize));
	yield* g.callName(f, live(f.args[0]), "update_transform", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H"] });

// /datum/reagent/growthserum/proc/on_mob_delete  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1592)  may sleep
rt.def("/datum/reagent/growthserum/proc/on_mob_delete", function* on_mob_delete(f: Frame) {
	rt.setFv(f, "resize", live(f.args[0]), divide(1, rt.sv(f, "current_size")));
	yield* g.callName(f, live(f.args[0]), "update_transform", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3754, "/datum/reagent/glitter", "/datum/reagent", {
	glitter_type: rt.typePath("/obj/effect/decal/cleanable/glitter"),
	name: "generic glitter",
	id: "glitter",
	description: "if you can see this description, contact a coder.",
	color: "#FFFFFF",
	taste_description: "plastic",
	reagent_state: 1,
});

// /datum/reagent/glitter/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/other_reagents.dm:1613)  may sleep
rt.def("/datum/reagent/glitter/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	f.vars = () => [_T, reac_volume];
	if (!truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.new_(f, rt.sv(f, "glitter_type"), [live(_T)]);
	return f.dot;
}, true);
