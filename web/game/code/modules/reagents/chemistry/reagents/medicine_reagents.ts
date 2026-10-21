// From code/modules/reagents/chemistry/reagents/medicine_reagents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3547, "/datum/reagent/medicine", "/datum/reagent", {
	name: "Medicine",
	id: "medicine",
	taste_description: "bitterness",
});

// /datum/reagent/medicine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:14)  may sleep
rt.def("/datum/reagent/medicine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	f.vars = () => [M];
	rt.incSrcVar(f, "current_cycle", 1, true);
	yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", [rt.fv(f, "id", live(f.src)), divide(rt.sv(f, "metabolization_rate"), rt.fv(f, "metabolism_efficiency", live(M)))]);
	return f.dot;
}, true);

rt.type(3548, "/datum/reagent/medicine/leporazine", "/datum/reagent/medicine", {
	name: "Leporazine",
	id: "leporazine",
	description: "Leporazine will effectively regulate a patient's body temperature, ensuring it never leaves safe levels.",
	color: "#C8A5DC",
});

// /datum/reagent/medicine/leporazine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:24)  may sleep
rt.def("/datum/reagent/medicine/leporazine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 60)])));
	} else {
		if (rt.lt(rt.fv(f, "bodytemperature", live(f.args[0])), 311)) {
			rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [310, add(rt.fv(f, "bodytemperature", live(f.args[0])), 60)])));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3549, "/datum/reagent/medicine/adminordrazine", "/datum/reagent/medicine", {
	name: "Adminordrazine",
	id: "adminordrazine",
	description: "It's magic. We don't have to explain it.",
	color: "#C8A5DC",
	can_synth: 0,
	taste_description: "badmins",
});

// /datum/reagent/medicine/adminordrazine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:39)  may sleep
rt.def("/datum/reagent/medicine/adminordrazine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_all_type", [T("/datum/reagent/toxin"), 5, 0, 1]);
	yield* g.callName(f, live(f.args[0]), "setCloneLoss", [0, 0]);
	yield* g.callName(f, live(f.args[0]), "setOxyLoss", [0, 0]);
	rt.setFv(f, "radiation", live(f.args[0]), 0);
	yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [5, 5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-5, 0]);
	rt.setFv(f, "hallucination", live(f.args[0]), 0);
	yield* g.callName(f, live(f.args[0]), "setBrainLoss", [0]);
	rt.setFv(f, "disabilities", live(f.args[0]), 0);
	yield* g.callName(f, live(f.args[0]), "set_blurriness", [0]);
	yield* g.callName(f, live(f.args[0]), "set_blindness", [0]);
	yield* g.callName(f, live(f.args[0]), "SetKnockdown", [0, 0]);
	yield* g.callName(f, live(f.args[0]), "SetStun", [0, 0]);
	yield* g.callName(f, live(f.args[0]), "SetUnconscious", [0, 0]);
	rt.setFv(f, "silent", live(f.args[0]), 0);
	rt.setFv(f, "dizziness", live(f.args[0]), 0);
	rt.setFv(f, "drowsyness", live(f.args[0]), 0);
	rt.setFv(f, "stuttering", live(f.args[0]), 0);
	rt.setFv(f, "slurring", live(f.args[0]), 0);
	rt.setFv(f, "confused", live(f.args[0]), 0);
	yield* g.callName(f, live(f.args[0]), "SetSleeping", [0, 0]);
	rt.setFv(f, "jitteriness", live(f.args[0]), 0);
	D = null;
	rt.forList(f, 0, rt.fv(f, "viruses", live(f.args[0])), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (isEqual(rt.fv(f, "severity", live(D)), "No threat")) {
			continue;
		}
		rt.setFv(f, "spread_text", live(D), "Remissive");
		rt.incField(f, live(D), "stage", -1, true);
		if (rt.lt(rt.fv(f, "stage", live(D)), 1)) {
			yield* g.callName(f, live(D), "cure", []);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3551, "/datum/reagent/medicine/synaptizine", "/datum/reagent/medicine", {
	name: "Synaptizine",
	id: "synaptizine",
	description: "Increases resistance to stuns as well as reducing drowsiness and hallucinations.",
	color: "#FF00FF",
});

// /datum/reagent/medicine/synaptizine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:84)  may sleep
rt.def("/datum/reagent/medicine/synaptizine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "drowsyness", live(f.args[0])), 5), 0])));
	yield* g.callName(f, live(f.args[0]), "AdjustStun", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustKnockdown", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustUnconscious", [-20, 0]);
	if (truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["mindbreaker"])))) {
		yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["mindbreaker", 5]);
	}
	rt.setFv(f, "hallucination", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "hallucination", live(f.args[0])), 10)])));
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3553, "/datum/reagent/medicine/synaphydramine", "/datum/reagent/medicine", {
	name: "Diphen-Synaptizine",
	id: "synaphydramine",
	description: "Reduces drowsiness, hallucinations, and Histamine from body.",
	color: "#EC536D",
});

// /datum/reagent/medicine/synaphydramine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:103)  may sleep
rt.def("/datum/reagent/medicine/synaphydramine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "drowsyness", live(f.args[0])), 5), 0])));
	if (truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["mindbreaker"])))) {
		yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["mindbreaker", 5]);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["histamine"])))) {
		yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["histamine", 5]);
	}
	rt.setFv(f, "hallucination", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "hallucination", live(f.args[0])), 10)])));
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3554, "/datum/reagent/medicine/inacusiate", "/datum/reagent/medicine", {
	name: "Inacusiate",
	id: "inacusiate",
	description: "Instantly restores all hearing to the patient, but does not cure deafness.",
	color: "#6600FF",
});

// /datum/reagent/medicine/inacusiate/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:121)  may sleep
rt.def("/datum/reagent/medicine/inacusiate/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "restoreEars", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3555, "/datum/reagent/medicine/cryoxadone", "/datum/reagent/medicine", {
	name: "Cryoxadone",
	id: "cryoxadone",
	description: "A chemical mixture with almost magical healing powers. Its main limitation is that the patient's body temperature must be under 270K for it to metabolise correctly.",
	color: "#0000C8",
	taste_description: "sludge",
});

// /datum/reagent/medicine/cryoxadone/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:132)  may sleep
rt.def("/datum/reagent/medicine/cryoxadone/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "bodytemperature", live(f.args[0]));
	if (rt.inRange($0, 0, 100)) {
		(rt.modField(f, live(f.args[0]), "status_flags", 16760831, rt.bitAnd));
		yield* g.callName(f, live(f.args[0]), "adjustCloneLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-9, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-5, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-5, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-5, 0]);
		f.dot = 1;
	} else if (rt.inRange($0, 100, 225)) {
		(rt.modField(f, live(f.args[0]), "status_flags", 16760831, rt.bitAnd));
		yield* g.callName(f, live(f.args[0]), "adjustCloneLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-7, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-3, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-3, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-3, 0]);
		f.dot = 1;
	} else if (rt.inRange($0, 225, 273.1499938964844)) {
		(rt.modField(f, live(f.args[0]), "status_flags", 16760831, rt.bitAnd));
		yield* g.callName(f, live(f.args[0]), "adjustCloneLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-5, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3556, "/datum/reagent/medicine/clonexadone", "/datum/reagent/medicine", {
	name: "Clonexadone",
	id: "clonexadone",
	description: "A chemical that derives from Cryoxadone. It specializes in healing clone damage, but nothing else. Requires very cold temperatures to properly metabolize, and metabolizes quicker than cryoxadone.",
	color: "#0000C8",
	taste_description: "muscle",
	metabolization_rate: 0.6,
});

// /datum/reagent/medicine/clonexadone/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:168)  may sleep
rt.def("/datum/reagent/medicine/clonexadone/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "bodytemperature", live(f.args[0]));
	if (rt.inRange($0, 0, 100)) {
		(rt.modField(f, live(f.args[0]), "status_flags", 16760831, rt.bitAnd));
		yield* g.callName(f, live(f.args[0]), "adjustCloneLoss", [-7, 0]);
		f.dot = 1;
	} else if (rt.inRange($0, 100, 225)) {
		(rt.modField(f, live(f.args[0]), "status_flags", 16760831, rt.bitAnd));
		yield* g.callName(f, live(f.args[0]), "adjustCloneLoss", [-3, 0]);
		f.dot = 1;
	} else if (rt.inRange($0, 225, 273.1499938964844)) {
		(rt.modField(f, live(f.args[0]), "status_flags", 16760831, rt.bitAnd));
		yield* g.callName(f, live(f.args[0]), "adjustCloneLoss", [-2, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3557, "/datum/reagent/medicine/rezadone", "/datum/reagent/medicine", {
	name: "Rezadone",
	id: "rezadone",
	description: "A powder derived from fish toxin, Rezadone can effectively treat genetic damage as well as restoring minor wounds. Overdose will cause intense nausea and minor toxin damage.",
	reagent_state: 1,
	color: "#669900",
	overdose_threshold: 30,
	taste_description: "fish",
});

// /datum/reagent/medicine/rezadone/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:193)  may sleep
rt.def("/datum/reagent/medicine/rezadone/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "setCloneLoss", [0]);
	yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 1, 0]);
	(rt.modField(f, live(f.args[0]), "status_flags", 16760831, rt.bitAnd));
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/rezadone/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:200)  may sleep
rt.def("/datum/reagent/medicine/rezadone/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
	yield* g.callName(f, live(f.args[0]), "Dizzy", [5]);
	yield* g.callName(f, live(f.args[0]), "Jitter", [5]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3559, "/datum/reagent/medicine/silver_sulfadiazine", "/datum/reagent/medicine", {
	name: "Silver Sulfadiazine",
	id: "silver_sulfadiazine",
	description: "If used in touch-based applications, immediately restores burn wounds as well as restoring more over time. If ingested through other means, deals minor toxin damage.",
	reagent_state: 2,
	color: "#C8A5DC",
});

// /datum/reagent/medicine/silver_sulfadiazine/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:222)  may sleep
rt.def("/datum/reagent/medicine/silver_sulfadiazine/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)) && !isEqual(rt.fv(f, "stat", live(f.args[0])), 2))) {
		if (truthy((rt.isIn(f, live(f.args[1]), rt.list(2, 3, 5)) ? 1 : 0))) {
			yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [multiply(0.5, live(f.args[2]))]);
			if (truthy(live(f.args[3]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You don't feel so good...</span>"]);
			}
		} else {
			if (truthy((yield* g.callName(f, live(f.args[0]), "getFireLoss", [])))) {
				yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [rt.neg(live(f.args[2]))]);
				if (truthy(live(f.args[3]))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>You feel your burns healing! It stings like hell!</span>"]);
				}
				yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

// /datum/reagent/medicine/silver_sulfadiazine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:235)  may sleep
rt.def("/datum/reagent/medicine/silver_sulfadiazine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-2, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3560, "/datum/reagent/medicine/oxandrolone", "/datum/reagent/medicine", {
	name: "Oxandrolone",
	id: "oxandrolone",
	description: "Stimulates the healing of severe burns. Extremely rapidly heals severe burns and slowly heals minor ones. Overdose will worsen existing burns.",
	reagent_state: 2,
	color: "#f7ffa5",
	metabolization_rate: 0.2,
	overdose_threshold: 25,
});

// /datum/reagent/medicine/oxandrolone/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:249)  may sleep
rt.def("/datum/reagent/medicine/oxandrolone/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.gt((yield* g.callName(f, live(f.args[0]), "getFireLoss", [])), 50)) {
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-4, 0]);
	} else {
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-0.5, 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/oxandrolone/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:257)  may sleep
rt.def("/datum/reagent/medicine/oxandrolone/proc/overdose_process", function* overdose_process(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[0]), "getFireLoss", [])))) {
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [4.5, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3561, "/datum/reagent/medicine/styptic_powder", "/datum/reagent/medicine", {
	name: "Styptic Powder",
	id: "styptic_powder",
	description: "If used in touch-based applications, immediately restores bruising as well as restoring more over time. If ingested through other means, deals minor toxin damage.",
	reagent_state: 2,
	color: "#FF9696",
});

// /datum/reagent/medicine/styptic_powder/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:270)  may sleep
rt.def("/datum/reagent/medicine/styptic_powder/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)) && !isEqual(rt.fv(f, "stat", live(f.args[0])), 2))) {
		if (truthy((rt.isIn(f, live(f.args[1]), rt.list(2, 3, 5)) ? 1 : 0))) {
			yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [multiply(0.5, live(f.args[2]))]);
			if (truthy(live(f.args[3]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You don't feel so good...</span>"]);
			}
		} else {
			if (truthy((yield* g.callName(f, live(f.args[0]), "getBruteLoss", [])))) {
				yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [rt.neg(live(f.args[2]))]);
				if (truthy(live(f.args[3]))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>You feel your bruises healing! It stings like hell!</span>"]);
				}
				yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

// /datum/reagent/medicine/styptic_powder/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:284)  may sleep
rt.def("/datum/reagent/medicine/styptic_powder/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-2, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3562, "/datum/reagent/medicine/salglu_solution", "/datum/reagent/medicine", {
	last_added: 0,
	maximum_reachable: 550,
	name: "Saline-Glucose Solution",
	id: "salglu_solution",
	description: "Has a 33% chance per metabolism cycle to heal brute and burn damage. Can be used as a temporary blood substitute.",
	reagent_state: 2,
	color: "#DCDCDC",
	metabolization_rate: 0.2,
	overdose_threshold: 60,
	taste_description: "sweetness and salt",
});

// /datum/reagent/medicine/salglu_solution/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:302)  may sleep
rt.def("/datum/reagent/medicine/salglu_solution/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let amount_to_add: Value = null, new_blood_level: Value = null;
	f.vars = () => [amount_to_add, new_blood_level];
	if (truthy(rt.sv(f, "last_added"))) {
		(rt.modField(f, live(f.args[0]), "blood_volume", rt.sv(f, "last_added"), subtract));
		rt.setSv(f, "last_added", 0);
	}
	if (rt.lt(rt.fv(f, "blood_volume", live(f.args[0])), rt.sv(f, "maximum_reachable"))) {
		amount_to_add = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "blood_volume", live(f.args[0])), multiply(rt.sv(f, "volume"), 5)]));
		rt.setSv(f, "last_added", subtract((new_blood_level = (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "blood_volume", live(f.args[0])), live(amount_to_add)), rt.sv(f, "maximum_reachable")]))), rt.fv(f, "blood_volume", live(f.args[0]))));
		rt.setFv(f, "blood_volume", live(f.args[0]), live(new_blood_level));
	}
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-0.5, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-0.5, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/salglu_solution/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:316)  may sleep
rt.def("/datum/reagent/medicine/salglu_solution/proc/overdose_process", function* overdose_process(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [3]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class = 'warning'>You feel salty.</span>"]);
		yield* g.callName(f, rt.sv(f, "holder"), "add_reagent", ["sodiumchloride", 1]);
		yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["salglu_solution", 0.5]);
	} else {
		if (truthy(rt.op(f, "Prob", [], [3]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class = 'warning'>You feel sweet.</span>"]);
			yield* g.callName(f, rt.sv(f, "holder"), "add_reagent", ["sugar", 1]);
			yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["salglu_solution", 0.5]);
		}
	}
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [0.5, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [0.5, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3563, "/datum/reagent/medicine/mine_salve", "/datum/reagent/medicine", {
	name: "Miner's Salve",
	id: "mine_salve",
	description: "A powerful painkiller. Restores bruising and burns in addition to making the patient believe they are fully healed.",
	reagent_state: 2,
	color: "#6D6374",
	metabolization_rate: 0.16000001,
});

// /datum/reagent/medicine/mine_salve/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:339)  may sleep
rt.def("/datum/reagent/medicine/mine_salve/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let N: Value = null;
	f.vars = () => [N];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.setFv(f, "hal_screwyhud", (N = live(f.args[0])), 3);
	}
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-0.25, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-0.25, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/mine_salve/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:348)  may sleep
rt.def("/datum/reagent/medicine/mine_salve/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let C: Value = null, s: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [C, s, S, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)) && !isEqual(rt.fv(f, "stat", live(f.args[0])), 2))) {
		if (truthy((rt.isIn(f, live(f.args[1]), rt.list(2, 3, 5)) ? 1 : 0))) {
			(rt.modField(f, live(f.args[0]), "nutrition", 5, subtract));
			if (truthy(live(f.args[3]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Your stomach feels empty and cramps!</span>"]);
			}
		} else {
			C = live(f.args[0]);
			s = null;
			rt.forList(f, 0, rt.fv(f, "surgeries", live(C)));
			while (($e = rt.next(f, 0)) !== undefined) {
				s = $e;
				rt.setFv(f, "success_multiplier", (S = live(s)), (yield* g.call(f, P("/proc/max"), null, [0.10000000149011612, rt.fv(f, "success_multiplier", live(S))])));
			}
			rt.endFor(f, 0);
			if (truthy(live(f.args[3]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>You feel your wounds fade away to nothing!</span>"]);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

// /datum/reagent/medicine/mine_salve/proc/on_mob_delete  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:365)
rt.def("/datum/reagent/medicine/mine_salve/proc/on_mob_delete", function on_mob_delete(f: Frame) {
	let N: Value = null;
	f.vars = () => [N];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.setFv(f, "hal_screwyhud", (N = live(f.args[0])), 0);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M"] });

rt.type(3564, "/datum/reagent/medicine/synthflesh", "/datum/reagent/medicine", {
	name: "Synthflesh",
	id: "synthflesh",
	description: "Has a 100% chance of instantly healing brute and burn damage. One unit of the chemical will heal one point of damage. Touch application only.",
	reagent_state: 2,
	color: "#FFEBEB",
});

// /datum/reagent/medicine/synthflesh/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:378)  may sleep
rt.def("/datum/reagent/medicine/synthflesh/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		if (isEqual(rt.fv(f, "stat", live(f.args[0])), 2)) {
			f.args[3] = 0;
		}
		if (truthy((rt.isIn(f, live(f.args[1]), rt.list(4, 1)) ? 1 : 0))) {
			yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [multiply(-1.25, live(f.args[2]))]);
			yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [multiply(-1.25, live(f.args[2]))]);
			if (truthy(live(f.args[3]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>You feel your burns and bruises healing! It stings like hell!</span>"]);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

rt.type(3565, "/datum/reagent/medicine/charcoal", "/datum/reagent/medicine", {
	name: "Charcoal",
	id: "charcoal",
	description: "Heals toxin damage as well as slowly removing any other chemicals the patient has in their bloodstream.",
	reagent_state: 2,
	color: "#000000",
	metabolization_rate: 0.2,
	taste_description: "ash",
});

// /datum/reagent/medicine/charcoal/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:398)  may sleep
rt.def("/datum/reagent/medicine/charcoal/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-2, 0]);
	f.dot = 1;
	R = null;
	rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(f.args[0]))), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (!isEqual(live(R), live(f.src))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", [rt.fv(f, "id", live(R)), 1]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3566, "/datum/reagent/medicine/omnizine", "/datum/reagent/medicine", {
	name: "Omnizine",
	id: "omnizine",
	description: "Slowly heals all damage types. Overdose will cause damage in all types instead.",
	reagent_state: 2,
	color: "#DCDCDC",
	metabolization_rate: 0.1,
	overdose_threshold: 30,
});

// /datum/reagent/medicine/omnizine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:415)  may sleep
rt.def("/datum/reagent/medicine/omnizine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-0.5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-0.5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-0.5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-0.5, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/omnizine/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:423)  may sleep
rt.def("/datum/reagent/medicine/omnizine/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1.5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [1.5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [1.5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [1.5, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3568, "/datum/reagent/medicine/calomel", "/datum/reagent/medicine", {
	name: "Calomel",
	id: "calomel",
	description: "Quickly purges the body of all chemicals. Toxin damage is dealt if the patient is in good condition.",
	reagent_state: 2,
	color: "#19C832",
	metabolization_rate: 0.2,
	taste_description: "acid",
});

// /datum/reagent/medicine/calomel/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:440)  may sleep
rt.def("/datum/reagent/medicine/calomel/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	R = null;
	rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(f.args[0]))), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (!isEqual(live(R), live(f.src))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", [rt.fv(f, "id", live(R)), 2.5]);
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.fv(f, "health", live(f.args[0])), 20)) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2.5, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3569, "/datum/reagent/medicine/potass_iodide", "/datum/reagent/medicine", {
	name: "Potassium Iodide",
	id: "potass_iodide",
	description: "Efficiently restores low radiation damage.",
	reagent_state: 2,
	color: "#14FF3C",
	metabolization_rate: 0.8,
});

// /datum/reagent/medicine/potass_iodide/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:457)  may sleep
rt.def("/datum/reagent/medicine/potass_iodide/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.gt(rt.fv(f, "radiation", live(f.args[0])), 0)) {
		rt.incField(f, live(f.args[0]), "radiation", -1, true);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3570, "/datum/reagent/medicine/pen_acid", "/datum/reagent/medicine", {
	name: "Pentetic Acid",
	id: "pen_acid",
	description: "Reduces massive amounts of radiation and toxin damage while purging other chemicals from the body.",
	reagent_state: 2,
	color: "#E6FFF0",
	metabolization_rate: 0.2,
});

// /datum/reagent/medicine/pen_acid/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:470)  may sleep
rt.def("/datum/reagent/medicine/pen_acid/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	if (rt.gt(rt.fv(f, "radiation", live(f.args[0])), 0)) {
		(rt.modField(f, live(f.args[0]), "radiation", 4, subtract));
	}
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-2, 0]);
	if (rt.lt(rt.fv(f, "radiation", live(f.args[0])), 0)) {
		rt.setFv(f, "radiation", live(f.args[0]), 0);
	}
	R = null;
	rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(f.args[0]))), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (!isEqual(live(R), live(f.src))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", [rt.fv(f, "id", live(R)), 2]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3571, "/datum/reagent/medicine/sal_acid", "/datum/reagent/medicine", {
	name: "Salicyclic Acid",
	id: "sal_acid",
	description: "Stimulates the healing of severe bruises. Extremely rapidly heals severe bruising and slowly heals minor ones. Overdose will worsen existing bruising.",
	reagent_state: 2,
	color: "#D2D2D2",
	metabolization_rate: 0.2,
	overdose_threshold: 25,
});

// /datum/reagent/medicine/sal_acid/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:492)  may sleep
rt.def("/datum/reagent/medicine/sal_acid/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.gt((yield* g.callName(f, live(f.args[0]), "getBruteLoss", [])), 50)) {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-4, 0]);
	} else {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-0.5, 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/sal_acid/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:500)  may sleep
rt.def("/datum/reagent/medicine/sal_acid/proc/overdose_process", function* overdose_process(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[0]), "getBruteLoss", [])))) {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [4.5, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3572, "/datum/reagent/medicine/salbutamol", "/datum/reagent/medicine", {
	name: "Salbutamol",
	id: "salbutamol",
	description: "Rapidly restores oxygen deprivation as well as preventing more of it to an extent.",
	reagent_state: 2,
	color: "#00FFFF",
	metabolization_rate: 0.1,
});

// /datum/reagent/medicine/salbutamol/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:514)  may sleep
rt.def("/datum/reagent/medicine/salbutamol/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-3, 0]);
	if (rt.ge(rt.fv(f, "losebreath", live(f.args[0])), 4)) {
		(rt.modField(f, live(f.args[0]), "losebreath", 2, subtract));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3573, "/datum/reagent/medicine/perfluorodecalin", "/datum/reagent/medicine", {
	name: "Perfluorodecalin",
	id: "perfluorodecalin",
	description: "Extremely rapidly restores oxygen deprivation, but inhibits speech. May also heal small amounts of bruising and burns.",
	reagent_state: 2,
	color: "#FF6464",
	metabolization_rate: 0.1,
});

// /datum/reagent/medicine/perfluorodecalin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:529)  may sleep
rt.def("/datum/reagent/medicine/perfluorodecalin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-12, 0]);
	rt.setFv(f, "silent", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "silent", live(f.args[0])), 5])));
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-0.5, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-0.5, 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3574, "/datum/reagent/medicine/ephedrine", "/datum/reagent/medicine", {
	name: "Ephedrine",
	id: "ephedrine",
	description: "Increases stun resistance and movement speed. Overdose deals toxin damage and inhibits breathing.",
	reagent_state: 2,
	color: "#D2FFFA",
	metabolization_rate: 0.2,
	overdose_threshold: 45,
	addiction_threshold: 30,
});

// /datum/reagent/medicine/ephedrine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:548)  may sleep
rt.def("/datum/reagent/medicine/ephedrine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	(rt.modField(f, live(f.args[0]), "status_flags", 32, rt.bitOr));
	yield* g.callName(f, live(f.args[0]), "AdjustStun", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustKnockdown", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustUnconscious", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [-1, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/ephedrine/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:557)  may sleep
rt.def("/datum/reagent/medicine/ephedrine/proc/overdose_process", function* overdose_process(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [0.5, 0]);
		rt.incField(f, live(f.args[0]), "losebreath", 1, true);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/ephedrine/proc/addiction_act_stage1  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:564)  may sleep
rt.def("/datum/reagent/medicine/ephedrine/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
		rt.modField(f, live(f.args[0]), "losebreath", 2, add);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/ephedrine/proc/addiction_act_stage2  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:571)  may sleep
rt.def("/datum/reagent/medicine/ephedrine/proc/addiction_act_stage2", function* addiction_act_stage2(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [3, 0]);
		rt.modField(f, live(f.args[0]), "losebreath", 3, add);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/ephedrine/proc/addiction_act_stage3  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:578)  may sleep
rt.def("/datum/reagent/medicine/ephedrine/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [4, 0]);
		rt.modField(f, live(f.args[0]), "losebreath", 4, add);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/ephedrine/proc/addiction_act_stage4  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:585)  may sleep
rt.def("/datum/reagent/medicine/ephedrine/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [5, 0]);
		rt.modField(f, live(f.args[0]), "losebreath", 5, add);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3575, "/datum/reagent/medicine/diphenhydramine", "/datum/reagent/medicine", {
	name: "Diphenhydramine",
	id: "diphenhydramine",
	description: "Rapidly purges the body of Histamine and reduces jitteriness. Slight chance of causing drowsiness.",
	reagent_state: 2,
	color: "#64FFE6",
	metabolization_rate: 0.2,
});

// /datum/reagent/medicine/diphenhydramine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:600)  may sleep
rt.def("/datum/reagent/medicine/diphenhydramine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [10]))) {
		rt.modField(f, live(f.args[0]), "drowsyness", 1, add);
	}
	(rt.modField(f, live(f.args[0]), "jitteriness", 1, subtract));
	yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", ["histamine", 3]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3576, "/datum/reagent/medicine/morphine", "/datum/reagent/medicine", {
	name: "Morphine",
	id: "morphine",
	description: "A painkiller that allows the patient to move at full speed even in bulky objects. Causes drowsiness and eventually unconsciousness in high doses. Overdose will cause a variety of effects, ranging from minor to lethal.",
	reagent_state: 2,
	color: "#A9FBFB",
	metabolization_rate: 0.2,
	overdose_threshold: 30,
	addiction_threshold: 25,
});

// /datum/reagent/medicine/morphine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:617)  may sleep
rt.def("/datum/reagent/medicine/morphine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	(rt.modField(f, live(f.args[0]), "status_flags", 16, rt.bitOr));
	$0 = rt.sv(f, "current_cycle");
	if ($0 === 11) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You start to feel tired...</span>"]);
	} else if (rt.inRange($0, 12, 24)) {
		rt.modField(f, live(f.args[0]), "drowsyness", 1, add);
	} else if (rt.inRange($0, 24, 9.999999848243207e+30)) {
		yield* g.callName(f, live(f.args[0]), "Sleeping", [40, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/morphine/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:629)  may sleep
rt.def("/datum/reagent/medicine/morphine/proc/overdose_process", function* overdose_process(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		if (truthy((I = (yield* g.callName(f, live(f.args[0]), "get_active_held_item", []))))) {
			yield* g.callName(f, live(f.args[0]), "drop_item", []);
		}
		yield* g.callName(f, live(f.args[0]), "Dizzy", [2]);
		yield* g.callName(f, live(f.args[0]), "Jitter", [2]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/morphine/proc/addiction_act_stage1  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:638)  may sleep
rt.def("/datum/reagent/medicine/morphine/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		if (truthy((I = (yield* g.callName(f, live(f.args[0]), "get_active_held_item", []))))) {
			yield* g.callName(f, live(f.args[0]), "drop_item", []);
		}
		yield* g.callName(f, live(f.args[0]), "Dizzy", [2]);
		yield* g.callName(f, live(f.args[0]), "Jitter", [2]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/morphine/proc/addiction_act_stage2  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:647)  may sleep
rt.def("/datum/reagent/medicine/morphine/proc/addiction_act_stage2", function* addiction_act_stage2(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		if (truthy((I = (yield* g.callName(f, live(f.args[0]), "get_active_held_item", []))))) {
			yield* g.callName(f, live(f.args[0]), "drop_item", []);
		}
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
		f.dot = 1;
		yield* g.callName(f, live(f.args[0]), "Dizzy", [3]);
		yield* g.callName(f, live(f.args[0]), "Jitter", [3]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/morphine/proc/addiction_act_stage3  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:658)  may sleep
rt.def("/datum/reagent/medicine/morphine/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		if (truthy((I = (yield* g.callName(f, live(f.args[0]), "get_active_held_item", []))))) {
			yield* g.callName(f, live(f.args[0]), "drop_item", []);
		}
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
		f.dot = 1;
		yield* g.callName(f, live(f.args[0]), "Dizzy", [4]);
		yield* g.callName(f, live(f.args[0]), "Jitter", [4]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/morphine/proc/addiction_act_stage4  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:669)  may sleep
rt.def("/datum/reagent/medicine/morphine/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		if (truthy((I = (yield* g.callName(f, live(f.args[0]), "get_active_held_item", []))))) {
			yield* g.callName(f, live(f.args[0]), "drop_item", []);
		}
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [3, 0]);
		f.dot = 1;
		yield* g.callName(f, live(f.args[0]), "Dizzy", [5]);
		yield* g.callName(f, live(f.args[0]), "Jitter", [5]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3577, "/datum/reagent/medicine/oculine", "/datum/reagent/medicine", {
	name: "Oculine",
	id: "oculine",
	description: "Quickly restores eye damage, cures nearsightedness, and has a chance to restore vision to the blind.",
	reagent_state: 2,
	color: "#FFFFFF",
	metabolization_rate: 0.1,
	taste_description: "dull toxin",
});

// /datum/reagent/medicine/oculine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:689)  may sleep
rt.def("/datum/reagent/medicine/oculine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let eyes: Value = null;
	f.vars = () => [eyes];
	if (!truthy((eyes = (yield* g.callName(f, live(f.args[0]), "getorganslot", ["eyes_sight"]))))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[0])), 1))) {
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Your vision slowly returns...</span>"]);
			yield* g.callName(f, live(f.args[0]), "cure_blind", []);
			yield* g.callName(f, live(f.args[0]), "cure_nearsighted", []);
			yield* g.callName(f, live(f.args[0]), "blur_eyes", [35]);
		}
	} else {
		if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[0])), 8))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The blackness in your peripheral vision fades.</span>"]);
			yield* g.callName(f, live(f.args[0]), "cure_nearsighted", []);
			yield* g.callName(f, live(f.args[0]), "blur_eyes", [10]);
		} else {
			if ((truthy(rt.fv(f, "eye_blind", live(f.args[0]))) || truthy(rt.fv(f, "eye_blurry", live(f.args[0]))))) {
				yield* g.callName(f, live(f.args[0]), "set_blindness", [0]);
				yield* g.callName(f, live(f.args[0]), "set_blurriness", [0]);
			} else {
				if (rt.gt(rt.fv(f, "eye_damage", live(eyes)), 0)) {
					yield* g.callName(f, live(f.args[0]), "adjust_eye_damage", [-1]);
				}
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3578, "/datum/reagent/medicine/atropine", "/datum/reagent/medicine", {
	name: "Atropine",
	id: "atropine",
	description: "If a patient is in critical condition, rapidly heals all damage types as well as regulating oxygen in the body. Excellent for stabilizing wounded patients.",
	reagent_state: 2,
	color: "#000000",
	metabolization_rate: 0.1,
	overdose_threshold: 35,
});

// /datum/reagent/medicine/atropine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:720)  may sleep
rt.def("/datum/reagent/medicine/atropine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.lt(rt.fv(f, "health", live(f.args[0])), 0)) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-2, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-2, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-2, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-5, 0]);
		f.dot = 1;
	}
	rt.setFv(f, "losebreath", live(f.args[0]), 0);
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.callName(f, live(f.args[0]), "Dizzy", [5]);
		yield* g.callName(f, live(f.args[0]), "Jitter", [5]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/atropine/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:733)  may sleep
rt.def("/datum/reagent/medicine/atropine/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [0.5, 0]);
	f.dot = 1;
	yield* g.callName(f, live(f.args[0]), "Dizzy", [1]);
	yield* g.callName(f, live(f.args[0]), "Jitter", [1]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3579, "/datum/reagent/medicine/epinephrine", "/datum/reagent/medicine", {
	name: "Epinephrine",
	id: "epinephrine",
	description: "Minor boost to stun resistance. Slowly heals damage if a patient is in critical condition, as well as regulating oxygen loss. Overdose causes weakness and toxin damage.",
	reagent_state: 2,
	color: "#D2FFFA",
	metabolization_rate: 0.1,
	overdose_threshold: 30,
});

// /datum/reagent/medicine/epinephrine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:749)  may sleep
rt.def("/datum/reagent/medicine/epinephrine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.lt(rt.fv(f, "health", live(f.args[0])), 0)) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-0.5, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-0.5, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-0.5, 0]);
	}
	if (rt.gt(rt.fv(f, "oxyloss", live(f.args[0])), 35)) {
		yield* g.callName(f, live(f.args[0]), "setOxyLoss", [35, 0]);
	}
	if (rt.ge(rt.fv(f, "losebreath", live(f.args[0])), 4)) {
		(rt.modField(f, live(f.args[0]), "losebreath", 2, subtract));
	}
	if (rt.lt(rt.fv(f, "losebreath", live(f.args[0])), 0)) {
		rt.setFv(f, "losebreath", live(f.args[0]), 0);
	}
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [-0.5, 0]);
	f.dot = 1;
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.callName(f, live(f.args[0]), "AdjustStun", [-20, 0]);
		yield* g.callName(f, live(f.args[0]), "AdjustKnockdown", [-20, 0]);
		yield* g.callName(f, live(f.args[0]), "AdjustUnconscious", [-20, 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/epinephrine/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:768)  may sleep
rt.def("/datum/reagent/medicine/epinephrine/proc/overdose_process", function* overdose_process(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [2.5, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
		rt.incField(f, live(f.args[0]), "losebreath", 1, true);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3580, "/datum/reagent/medicine/strange_reagent", "/datum/reagent/medicine", {
	name: "Strange Reagent",
	id: "strange_reagent",
	description: "A miracle drug capable of bringing the dead back to life. Only functions if the target has less than 100 brute and burn damage (independent of one another), and causes slight damage to the living.",
	reagent_state: 2,
	color: "#A0E85E",
	metabolization_rate: 0.2,
	taste_description: "magnets",
});

// /datum/reagent/medicine/strange_reagent/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:785)  may sleep
rt.def("/datum/reagent/medicine/strange_reagent/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (isEqual(rt.fv(f, "stat", live(f.args[0])), 2)) {
		if ((rt.ge((yield* g.callName(f, live(f.args[0]), "getBruteLoss", [])), 100) || rt.ge((yield* g.callName(f, live(f.args[0]), "getFireLoss", [])), 100))) {
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀'s body convulses a bit, and then falls still once more.</span>", [live(f.args[0])])]);
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀'s body convulses a bit.</span>", [live(f.args[0])])]);
		if (((!truthy(rt.fv(f, "suiciding", live(f.args[0]))) && !truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[0])), 128))) && !truthy(rt.fv(f, "hellbound", live(f.args[0]))))) {
			if (!truthy(live(f.args[0]))) {
				return live(f.dot);
			}
			if (truthy((yield* g.callName(f, live(f.args[0]), "notify_ghost_cloning", ["source", live(f.args[0])], rt.Args.Named)))) {
				rt.spawnTail(f, 100, "/datum/reagent/medicine/strange_reagent/proc/reaction_mob: spawn at modules/reagents/chemistry/reagents/medicine_reagents.dm:794");
			} else {
				yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-20, 0]);
				yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-20, 0]);
				yield* g.callName(f, live(f.args[0]), "updatehealth", []);
				if (truthy((yield* g.callName(f, live(f.args[0]), "revive", [])))) {
					yield* g.callName(f, live(f.args[0]), "emote", ["gasp"]);
					yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.args[0]), "revived", live(f.src)]);
				}
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// a spawn(100) body of /datum/reagent/medicine/strange_reagent/proc/reaction_mob, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/reagent/medicine/strange_reagent/proc/reaction_mob: spawn at modules/reagents/chemistry/reagents/medicine_reagents.dm:794", function* (f: Frame) {
	return live(f.dot);
	return null;
});

// /datum/reagent/medicine/strange_reagent/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:806)  may sleep
rt.def("/datum/reagent/medicine/strange_reagent/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [0.5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [0.5, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3581, "/datum/reagent/medicine/mannitol", "/datum/reagent/medicine", {
	name: "Mannitol",
	id: "mannitol",
	description: "Efficiently restores brain damage.",
	color: "#DCDCFF",
});

// /datum/reagent/medicine/mannitol/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:818)  may sleep
rt.def("/datum/reagent/medicine/mannitol/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [-3]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3582, "/datum/reagent/medicine/mutadone", "/datum/reagent/medicine", {
	name: "Mutadone",
	id: "mutadone",
	description: "Removes jitteriness and restores genetic defects.",
	color: "#5096C8",
	taste_description: "acid",
});

// /datum/reagent/medicine/mutadone/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:829)  may sleep
rt.def("/datum/reagent/medicine/mutadone/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "jitteriness", live(f.args[0]), 0);
	if (truthy((yield* g.callName(f, live(f.args[0]), "has_dna", [])))) {
		yield* g.callName(f, rt.fv(f, "dna", live(f.args[0])), "remove_all_mutations", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3583, "/datum/reagent/medicine/antihol", "/datum/reagent/medicine", {
	name: "Antihol",
	id: "antihol",
	description: "Purges alcoholic substance from the patient's body and eliminates its side effects.",
	color: "#00B4C8",
	taste_description: "raw egg",
});

// /datum/reagent/medicine/antihol/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:842)  may sleep
rt.def("/datum/reagent/medicine/antihol/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	rt.setFv(f, "dizziness", live(f.args[0]), 0);
	rt.setFv(f, "drowsyness", live(f.args[0]), 0);
	rt.setFv(f, "slurring", live(f.args[0]), 0);
	rt.setFv(f, "confused", live(f.args[0]), 0);
	yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_all_type", [T("/datum/reagent/consumable/ethanol"), 3, 0, 1]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-0.20000000298023224, 0]);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.setFv(f, "drunkenness", (H = live(f.args[0])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "drunkenness", live(H)), 10), 0])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3584, "/datum/reagent/medicine/stimulants", "/datum/reagent/medicine", {
	name: "Stimulants",
	id: "stimulants",
	description: "Increases stun resistance and movement speed in addition to restoring minor damage and weakness. Overdose causes weakness and toxin damage.",
	color: "#78008C",
	metabolization_rate: 0.2,
	overdose_threshold: 60,
});

// /datum/reagent/medicine/stimulants/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:863)  may sleep
rt.def("/datum/reagent/medicine/stimulants/proc/on_mob_life", function* on_mob_life(f: Frame) {
	(rt.modField(f, live(f.args[0]), "status_flags", 32, rt.bitOr));
	if ((rt.lt(rt.fv(f, "health", live(f.args[0])), 50) && rt.gt(rt.fv(f, "health", live(f.args[0])), 0))) {
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-1, 0]);
	}
	yield* g.callName(f, live(f.args[0]), "AdjustStun", [-60, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustKnockdown", [-60, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustUnconscious", [-60, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [-5, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/stimulants/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:877)  may sleep
rt.def("/datum/reagent/medicine/stimulants/proc/overdose_process", function* overdose_process(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [2.5, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
		rt.incField(f, live(f.args[0]), "losebreath", 1, true);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3585, "/datum/reagent/medicine/insulin", "/datum/reagent/medicine", {
	name: "Insulin",
	id: "insulin",
	description: "Increases sugar depletion rates.",
	reagent_state: 2,
	color: "#FFFFF0",
	metabolization_rate: 0.2,
});

// /datum/reagent/medicine/insulin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:893)  may sleep
rt.def("/datum/reagent/medicine/insulin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [-20, 0])))) {
		f.dot = 1;
	}
	yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", ["sugar", 3]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3586, "/datum/reagent/medicine/bicaridine", "/datum/reagent/medicine", {
	name: "Bicaridine",
	id: "bicaridine",
	description: "Restores bruising. Overdose causes it instead.",
	reagent_state: 2,
	color: "#C8A5DC",
	overdose_threshold: 30,
});

// /datum/reagent/medicine/bicaridine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:908)  may sleep
rt.def("/datum/reagent/medicine/bicaridine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-2, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/bicaridine/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:913)  may sleep
rt.def("/datum/reagent/medicine/bicaridine/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [4, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3587, "/datum/reagent/medicine/dexalin", "/datum/reagent/medicine", {
	name: "Dexalin",
	id: "dexalin",
	description: "Restores oxygen loss. Overdose causes it instead.",
	reagent_state: 2,
	color: "#C8A5DC",
	overdose_threshold: 30,
});

// /datum/reagent/medicine/dexalin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:926)  may sleep
rt.def("/datum/reagent/medicine/dexalin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-2, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/dexalin/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:931)  may sleep
rt.def("/datum/reagent/medicine/dexalin/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [4, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3588, "/datum/reagent/medicine/kelotane", "/datum/reagent/medicine", {
	name: "Kelotane",
	id: "kelotane",
	description: "Restores fire damage. Overdose causes it instead.",
	reagent_state: 2,
	color: "#C8A5DC",
	overdose_threshold: 30,
});

// /datum/reagent/medicine/kelotane/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:944)  may sleep
rt.def("/datum/reagent/medicine/kelotane/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-2, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/kelotane/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:949)  may sleep
rt.def("/datum/reagent/medicine/kelotane/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [4, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3589, "/datum/reagent/medicine/antitoxin", "/datum/reagent/medicine", {
	name: "Anti-Toxin",
	id: "antitoxin",
	description: "Heals toxin damage and removes toxins in the bloodstream. Overdose causes toxin damage.",
	reagent_state: 2,
	color: "#C8A5DC",
	overdose_threshold: 30,
	taste_description: "a roll of gauze",
});

// /datum/reagent/medicine/antitoxin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:963)  may sleep
rt.def("/datum/reagent/medicine/antitoxin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-2, 0]);
	R = null;
	rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(f.args[0]))), T("/datum/reagent/toxin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", [rt.fv(f, "id", live(R)), 1]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/antitoxin/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:970)  may sleep
rt.def("/datum/reagent/medicine/antitoxin/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [4, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3590, "/datum/reagent/medicine/inaprovaline", "/datum/reagent/medicine", {
	name: "Inaprovaline",
	id: "inaprovaline",
	description: "Stabilizes the breathing of patients. Good for those in critical condition.",
	reagent_state: 2,
	color: "#C8A5DC",
});

// /datum/reagent/medicine/inaprovaline/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:982)  may sleep
rt.def("/datum/reagent/medicine/inaprovaline/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.ge(rt.fv(f, "losebreath", live(f.args[0])), 5)) {
		(rt.modField(f, live(f.args[0]), "losebreath", 5, subtract));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3591, "/datum/reagent/medicine/tricordrazine", "/datum/reagent/medicine", {
	name: "Tricordrazine",
	id: "tricordrazine",
	description: "Has a high chance to heal all types of damage. Overdose instead causes it.",
	reagent_state: 2,
	color: "#C8A5DC",
	overdose_threshold: 30,
	taste_description: "grossness",
});

// /datum/reagent/medicine/tricordrazine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:996)  may sleep
rt.def("/datum/reagent/medicine/tricordrazine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [80]))) {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/tricordrazine/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:1005)  may sleep
rt.def("/datum/reagent/medicine/tricordrazine/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [2, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [2, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [2, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3592, "/datum/reagent/medicine/syndicate_nanites", "/datum/reagent/medicine", {
	name: "Restorative Nanites",
	id: "syndicate_nanites",
	description: "Miniature medical robots that swiftly restore bodily damage.",
	reagent_state: 1,
	color: "#555555",
});

// /datum/reagent/medicine/syndicate_nanites/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:1020)  may sleep
rt.def("/datum/reagent/medicine/syndicate_nanites/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-15, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [-15]);
	yield* g.callName(f, live(f.args[0]), "adjustCloneLoss", [-3, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3593, "/datum/reagent/medicine/earthsblood", "/datum/reagent/medicine", {
	name: "Earthsblood",
	id: "earthsblood",
	description: "Ichor from an extremely powerful plant. Great for restoring wounds, but it's a little heavy on the brain.",
	color: "#ffaf00",
	overdose_threshold: 25,
});

// /datum/reagent/medicine/earthsblood/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:1037)  may sleep
rt.def("/datum/reagent/medicine/earthsblood/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-3, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-3, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-15, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-3, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [2]);
	yield* g.callName(f, live(f.args[0]), "adjustCloneLoss", [-1, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [-30, 0]);
	rt.setFv(f, "jitteriness", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [0, add(rt.fv(f, "jitteriness", live(f.args[0])), 3)])), 30])));
	rt.setFv(f, "druggy", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [0, add(rt.fv(f, "druggy", live(f.args[0])), 10)])), 15])));
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/earthsblood/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:1050)  may sleep
rt.def("/datum/reagent/medicine/earthsblood/proc/overdose_process", function* overdose_process(f: Frame) {
	rt.setFv(f, "hallucination", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [0, add(rt.fv(f, "hallucination", live(f.args[0])), 10)])), 50])));
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [5, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3594, "/datum/reagent/medicine/haloperidol", "/datum/reagent/medicine", {
	name: "Haloperidol",
	id: "haloperidol",
	description: "Increases depletion rates for most stimulating/hallucinogenic drugs. Reduces druggy effects and jitteriness. Severe stamina regeneration penalty, causes drowsiness. Small chance of brain damage.",
	reagent_state: 2,
	color: "#27870a",
	metabolization_rate: 0.16000001,
});

// /datum/reagent/medicine/haloperidol/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:1064)  may sleep
rt.def("/datum/reagent/medicine/haloperidol/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	R = null;
	rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(f.args[0]))), T("/datum/reagent/drug"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", [rt.fv(f, "id", live(R)), 5]);
	}
	rt.endFor(f, 0);
	rt.modField(f, live(f.args[0]), "drowsyness", 2, add);
	if (rt.ge(rt.fv(f, "jitteriness", live(f.args[0])), 3)) {
		(rt.modField(f, live(f.args[0]), "jitteriness", 3, subtract));
	}
	if (rt.ge(rt.fv(f, "hallucination", live(f.args[0])), 5)) {
		(rt.modField(f, live(f.args[0]), "hallucination", 5, subtract));
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [1]);
	}
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [2.5, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3595, "/datum/reagent/medicine/miningnanites", "/datum/reagent/medicine", {
	name: "Nanites",
	id: "miningnanites",
	description: "It's mining magic. We don't have to explain it.",
	color: "#C8A5DC",
	overdose_threshold: 3,
	can_synth: 0,
});

// /datum/reagent/medicine/miningnanites/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:1086)  may sleep
rt.def("/datum/reagent/medicine/miningnanites/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [5, 5, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/miningnanites/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:1091)  may sleep
rt.def("/datum/reagent/medicine/miningnanites/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [3, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [3, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [3, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3596, "/datum/reagent/medicine/changelingAdrenaline", "/datum/reagent/medicine", {
	name: "Adrenaline",
	id: "changelingAdrenaline",
	description: "Reduces stun times. Also deals toxin damage at high amounts.",
	color: "#C8A5DC",
	overdose_threshold: 30,
});

// /datum/reagent/medicine/changelingAdrenaline/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:1106)  may sleep
rt.def("/datum/reagent/medicine/changelingAdrenaline/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "AdjustUnconscious", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustStun", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "AdjustKnockdown", [-20, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [-1, 0]);
	f.dot = 1;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/medicine/changelingAdrenaline/proc/overdose_process  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:1114)  may sleep
rt.def("/datum/reagent/medicine/changelingAdrenaline/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
	f.dot = 1;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3597, "/datum/reagent/medicine/changelingAdrenaline2", "/datum/reagent/medicine", {
	name: "Adrenaline",
	id: "changelingAdrenaline2",
	description: "Drastically increases movement speed.",
	color: "#C8A5DC",
	metabolization_rate: 1,
});

// /datum/reagent/medicine/changelingAdrenaline2/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/medicine_reagents.dm:1126)  may sleep
rt.def("/datum/reagent/medicine/changelingAdrenaline2/proc/on_mob_life", function* on_mob_life(f: Frame) {
	(rt.modField(f, live(f.args[0]), "status_flags", 64, rt.bitOr));
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
	f.dot = 1;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });
