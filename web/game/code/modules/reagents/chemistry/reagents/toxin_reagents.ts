// From code/modules/reagents/chemistry/reagents/toxin_reagents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3696, "/datum/reagent/toxin", "/datum/reagent", {
	toxpwr: 1.5,
	name: "Toxin",
	id: "toxin",
	description: "A toxic chemical.",
	color: "#CF3600",
	taste_description: "bitterness",
	taste_mult: 1.2,
});

// /datum/reagent/toxin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:15)  may sleep
rt.def("/datum/reagent/toxin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.sv(f, "toxpwr"))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [multiply(rt.sv(f, "toxpwr"), 1), 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3697, "/datum/reagent/toxin/mutagen", "/datum/reagent/toxin", {
	name: "Unstable mutagen",
	id: "mutagen",
	description: "Might cause unpredictable mutations. Keep away from children.",
	color: "#00FF00",
	taste_description: "slime",
	taste_mult: 0.9,
	toxpwr: 0,
});

// /datum/reagent/toxin/mutagen/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:37)  may sleep
rt.def("/datum/reagent/toxin/mutagen/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.args[0]), "has_dna", [])))) {
		return live(f.dot);
	}
	if (((((isEqual(live(f.args[1]), 3) && truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/min"), null, [33, live(f.args[2])]))]))) || isEqual(live(f.args[1]), 2)) || isEqual(live(f.args[1]), 4)) || isEqual(live(f.args[1]), 5))) {
		yield* g.callName(f, live(f.args[0]), "randmuti", []);
		if (truthy(rt.op(f, "Prob", [], [98]))) {
			yield* g.callName(f, live(f.args[0]), "randmutb", []);
		} else {
			yield* g.callName(f, live(f.args[0]), "randmutg", []);
		}
		yield* g.callName(f, live(f.args[0]), "updateappearance", []);
		yield* g.callName(f, live(f.args[0]), "domutcheck", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// /datum/reagent/toxin/mutagen/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:52)  may sleep
rt.def("/datum/reagent/toxin/mutagen/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[0]), "apply_effect", [5, "irradiate", 0]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3700, "/datum/reagent/toxin/plasma", "/datum/reagent/toxin", {
	name: "Plasma",
	id: "plasma",
	description: "Plasma in its liquid form.",
	taste_description: "bitterness",
	taste_mult: 1.5,
	color: "#8228A0",
	toxpwr: 3,
});

// /datum/reagent/toxin/plasma/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:66)  may sleep
rt.def("/datum/reagent/toxin/plasma/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["epinephrine"])))) {
		yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["epinephrine", 2]);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C = live(f.args[0])), "adjustPlasma", [20]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

// /datum/reagent/toxin/plasma/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:74)
rt.def("/datum/reagent/toxin/plasma/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if ((!truthy(live(O)) || !truthy(live(reac_volume)))) {
		return 0;
	}
	rt.callName(f, live(O), "atmos_spawn_air", [fmt("plasma=＀;TEMP=＀", [live(reac_volume), 293.1499938964844])]);
	return f.dot;
});

// /datum/reagent/toxin/plasma/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:79)
rt.def("/datum/reagent/toxin/plasma/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) {
		rt.callName(f, live(_T), "atmos_spawn_air", [fmt("plasma=＀;TEMP=＀", [live(reac_volume), 293.1499938964844])]);
	}
	return live(f.dot);
});

// /datum/reagent/toxin/plasma/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:84)  may sleep
rt.def("/datum/reagent/toxin/plasma/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((isEqual(live(f.args[1]), 1) || isEqual(live(f.args[1]), 3))) {
		yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [divide(live(f.args[2]), 5)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3704, "/datum/reagent/toxin/lexorin", "/datum/reagent/toxin", {
	name: "Lexorin",
	id: "lexorin",
	description: "A powerful poison used to stop respiration.",
	color: "#7DC3A0",
	toxpwr: 0,
	taste_description: "acid",
});

// /datum/reagent/toxin/lexorin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:102)  may sleep
rt.def("/datum/reagent/toxin/lexorin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = 1;
	C = null;
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		if ((!truthy(rt.gv(f, "dna", (C = live(f.args[0])))) || !truthy(rt.gv(f, "species", rt.fv(f, "dna", live(C)))))) {
			return live(f.dot);
		}
		if (truthy((rt.isIn(f, 10, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(C))))) ? 1 : 0))) {
			f.dot = 0;
		}
	}
	if (truthy(live(f.dot))) {
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [5, 0]);
		if (truthy(live(C))) {
			rt.modField(f, live(C), "losebreath", 2, add);
		}
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			yield* g.callName(f, live(f.args[0]), "emote", ["gasp"]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3705, "/datum/reagent/toxin/slimejelly", "/datum/reagent/toxin", {
	name: "Slime Jelly",
	id: "slimejelly",
	description: "A gooey semi-liquid produced from one of the deadliest lifeforms in existence. SO REAL.",
	color: "#801E28",
	toxpwr: 0,
	taste_description: "slime",
	taste_mult: 1.3,
});

// /datum/reagent/toxin/slimejelly/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:126)  may sleep
rt.def("/datum/reagent/toxin/slimejelly/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [10]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>Your insides are burning!</span>"]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [multiply((yield* g.call(f, P("/proc/rand"), null, [20, 60])), 1), 0]);
		f.dot = 1;
	} else {
		if (truthy(rt.op(f, "Prob", [], [40]))) {
			yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [5, 0, 0]);
			f.dot = 1;
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3706, "/datum/reagent/toxin/minttoxin", "/datum/reagent/toxin", {
	name: "Mint Toxin",
	id: "minttoxin",
	description: "Useful for dealing with undesirable customers.",
	color: "#CF3600",
	toxpwr: 0,
	taste_description: "mint",
});

// /datum/reagent/toxin/minttoxin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:144)  may sleep
rt.def("/datum/reagent/toxin/minttoxin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[0])), 32))) {
		yield* g.callName(f, live(f.args[0]), "gib", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3708, "/datum/reagent/toxin/zombiepowder", "/datum/reagent/toxin", {
	name: "Zombie Powder",
	id: "zombiepowder",
	description: "A strong neurotoxin that puts the subject into a death-like state.",
	reagent_state: 1,
	color: "#669900",
	toxpwr: 0.5,
	taste_description: "death",
});

// /datum/reagent/toxin/zombiepowder/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:166)  may sleep
rt.def("/datum/reagent/toxin/zombiepowder/proc/on_mob_life", function* on_mob_life(f: Frame) {
	(rt.modField(f, live(f.args[0]), "status_flags", 8192, rt.bitOr));
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [0.5, 0]);
	yield* g.callName(f, live(f.args[0]), "Knockdown", [100, 0]);
	rt.setFv(f, "silent", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "silent", live(f.args[0])), 5])));
	rt.setFv(f, "tod", live(f.args[0]), (yield* g.call(f, P("/proc/worldtime2text"), null, [])));
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/toxin/zombiepowder/proc/on_mob_delete  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:175)
rt.def("/datum/reagent/toxin/zombiepowder/proc/on_mob_delete", function on_mob_delete(f: Frame) {
	(rt.modField(f, live(f.args[0]), "status_flags", 16769023, rt.bitAnd));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M"] });

rt.type(3709, "/datum/reagent/toxin/mindbreaker", "/datum/reagent/toxin", {
	name: "Mindbreaker Toxin",
	id: "mindbreaker",
	description: "A powerful hallucinogen. Not a thing to be messed with.",
	color: "#B31008",
	toxpwr: 0,
	taste_description: "sourness",
});

// /datum/reagent/toxin/mindbreaker/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:187)  may sleep
rt.def("/datum/reagent/toxin/mindbreaker/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.modField(f, live(f.args[0]), "hallucination", 10, add);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3710, "/datum/reagent/toxin/plantbgone", "/datum/reagent/toxin", {
	name: "Plant-B-Gone",
	id: "plantbgone",
	description: "A harmful toxic mixture to kill plantlife. Do not ingest!",
	color: "#49002E",
	toxpwr: 1,
	taste_mult: 1,
});

// /datum/reagent/toxin/plantbgone/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:199)  may sleep
rt.def("/datum/reagent/toxin/plantbgone/proc/reaction_obj", function* reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	let alien_weeds: Value = null, SV: Value = null;
	f.vars = () => [O, reac_volume, alien_weeds, SV];
	if (truthy((rt.istype(live(O), T("/obj/structure/alien/weeds")) ? 1 : 0))) {
		yield* g.callName(f, (alien_weeds = live(O)), "take_damage", [(yield* g.call(f, P("/proc/rand"), null, [15, 35])), "brute", 0]);
	} else {
		if (truthy((rt.istype(live(O), T("/obj/structure/glowshroom")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		} else {
			if (!truthy((rt.istype(live(O), T("/obj/structure/spacevine")) ? 1 : 0))) return f.dot;
			yield* g.callName(f, (SV = live(O)), "on_chem_effect", [live(f.src)]);
		}
	}
	return f.dot;
}, true);

// /datum/reagent/toxin/plantbgone/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:209)  may sleep
rt.def("/datum/reagent/toxin/plantbgone/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let C: Value = null, damage: Value = null;
	f.vars = () => [M, method, reac_volume, C, damage];
	if (live(method) === null) {
		method = 1;
	}
	if (!isEqual(live(method), 3)) return f.dot;
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	if (truthy(rt.gv(f, "wear_mask", (C = live(M))))) return f.dot;
	damage = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(0.4000000059604645, live(reac_volume)), 0.10000000149011612])), 10]));
	yield* g.callName(f, live(C), "adjustToxLoss", [live(damage)]);
	return f.dot;
}, true);

rt.type(3712, "/datum/reagent/toxin/pestkiller", "/datum/reagent/toxin", {
	name: "Pest Killer",
	id: "pestkiller",
	description: "A harmful toxic mixture to kill pests. Do not ingest!",
	color: "#4B004B",
	toxpwr: 1,
});

// /datum/reagent/toxin/pestkiller/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:230)  may sleep
rt.def("/datum/reagent/toxin/pestkiller/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let C: Value = null, damage: Value = null;
	f.vars = () => [M, method, reac_volume, C, damage];
	if (live(method) === null) {
		method = 1;
	}
	if (!isEqual(live(method), 3)) return f.dot;
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	if (truthy(rt.gv(f, "wear_mask", (C = live(M))))) return f.dot;
	damage = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(0.4000000059604645, live(reac_volume)), 0.10000000149011612])), 10]));
	yield* g.callName(f, live(C), "adjustToxLoss", [live(damage)]);
	return f.dot;
}, true);

rt.type(3713, "/datum/reagent/toxin/spore", "/datum/reagent/toxin", {
	name: "Spore Toxin",
	id: "spore",
	description: "A natural toxin produced by blob spores that inhibits vision when ingested.",
	color: "#9ACD32",
	toxpwr: 1,
});

// /datum/reagent/toxin/spore/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:245)  may sleep
rt.def("/datum/reagent/toxin/spore/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "damageoverlaytemp", live(f.args[0]), 60);
	yield* g.callName(f, live(f.args[0]), "update_damage_hud", []);
	yield* g.callName(f, live(f.args[0]), "blur_eyes", [3]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3714, "/datum/reagent/toxin/spore_burning", "/datum/reagent/toxin", {
	name: "Burning Spore Toxin",
	id: "spore_burning",
	description: "A natural toxin produced by blob spores that induces combustion in its victim.",
	color: "#9ACD32",
	toxpwr: 0.5,
	taste_description: "burning",
});

// /datum/reagent/toxin/spore_burning/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:259)  may sleep
rt.def("/datum/reagent/toxin/spore_burning/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [2]);
	yield* g.callName(f, live(f.args[0]), "IgniteMob", []);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3715, "/datum/reagent/toxin/chloralhydrate", "/datum/reagent/toxin", {
	name: "Chloral Hydrate",
	id: "chloralhydrate",
	description: "A powerful sedative that induces confusion and drowsiness before putting its target to sleep.",
	reagent_state: 1,
	color: "#000067",
	toxpwr: 0,
	metabolization_rate: 0.6,
});

// /datum/reagent/toxin/chloralhydrate/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:273)  may sleep
rt.def("/datum/reagent/toxin/chloralhydrate/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "current_cycle");
	if (rt.inRange($0, 1, 10)) {
		rt.modField(f, live(f.args[0]), "confused", 2, add);
		rt.modField(f, live(f.args[0]), "drowsyness", 2, add);
	} else if (rt.inRange($0, 10, 50)) {
		yield* g.callName(f, live(f.args[0]), "Sleeping", [40, 0]);
		f.dot = 1;
	} else if (rt.inRange($0, 51, 9.999999848243207e+30)) {
		yield* g.callName(f, live(f.args[0]), "Sleeping", [40, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [multiply(subtract(rt.sv(f, "current_cycle"), 50), 1), 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3716, "/datum/reagent/toxin/chloralhydrate/delayed", "/datum/reagent/toxin/chloralhydrate", {
	id: "chloralhydrate2",
});

// /datum/reagent/toxin/chloralhydrate/delayed/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:290)  may sleep
rt.def("/datum/reagent/toxin/chloralhydrate/delayed/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "current_cycle");
	if (rt.inRange($0, 1, 10)) {
		return live(f.dot);
	} else if (rt.inRange($0, 10, 20)) {
		rt.modField(f, live(f.args[0]), "confused", 1, add);
		rt.modField(f, live(f.args[0]), "drowsyness", 1, add);
	} else if (rt.inRange($0, 20, 9.999999848243207e+30)) {
		yield* g.callName(f, live(f.args[0]), "Sleeping", [40, 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3717, "/datum/reagent/toxin/beer2", "/datum/reagent/toxin", {
	name: "Beer",
	id: "beer2",
	description: "A specially-engineered sedative disguised as beer. It induces instant sleep in its target.",
	color: "#664300",
	metabolization_rate: 0.6,
	taste_description: "piss water",
	glass_icon_state: "beerglass",
	glass_name: "glass of beer",
	glass_desc: "A freezing pint of beer.",
});

// /datum/reagent/toxin/beer2/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:312)  may sleep
rt.def("/datum/reagent/toxin/beer2/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "current_cycle");
	if (rt.inRange($0, 1, 50)) {
		yield* g.callName(f, live(f.args[0]), "Sleeping", [40, 0]);
	} else if (rt.inRange($0, 51, 9.999999848243207e+30)) {
		yield* g.callName(f, live(f.args[0]), "Sleeping", [40, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [multiply(subtract(rt.sv(f, "current_cycle"), 50), 1), 0]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3720, "/datum/reagent/toxin/mutetoxin", "/datum/reagent/toxin", {
	name: "Mute Toxin",
	id: "mutetoxin",
	description: "A nonlethal poison that inhibits speech in its victim.",
	color: "#F0F8FF",
	toxpwr: 0,
	taste_description: "silence",
});

// /datum/reagent/toxin/mutetoxin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:345)  may sleep
rt.def("/datum/reagent/toxin/mutetoxin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "silent", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "silent", live(f.args[0])), 3])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3721, "/datum/reagent/toxin/staminatoxin", "/datum/reagent/toxin", {
	name: "Tirizene",
	id: "tirizene",
	description: "A nonlethal poison that causes extreme fatigue and weakness in its victim.",
	color: "#6E2828",
	data: 13,
	toxpwr: 0,
});

// /datum/reagent/toxin/staminatoxin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:357)  may sleep
rt.def("/datum/reagent/toxin/staminatoxin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [multiply(1, rt.sv(f, "data")), 0]);
	rt.setSv(f, "data", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "data"), 1), 3])));
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3722, "/datum/reagent/toxin/polonium", "/datum/reagent/toxin", {
	name: "Polonium",
	id: "polonium",
	description: "An extremely radioactive material in liquid form. Ingestion results in fatal irradiation.",
	reagent_state: 2,
	color: "#787878",
	metabolization_rate: 0.05,
	toxpwr: 0,
});

// /datum/reagent/toxin/polonium/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:372)  may sleep
rt.def("/datum/reagent/toxin/polonium/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.modField(f, live(f.args[0]), "radiation", 4, add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3723, "/datum/reagent/toxin/histamine", "/datum/reagent/toxin", {
	name: "Histamine",
	id: "histamine",
	description: "Histamine's effects become more dangerous depending on the dosage amount. They range from mildly annoying to incredibly lethal.",
	reagent_state: 2,
	color: "#FA6464",
	metabolization_rate: 0.1,
	overdose_threshold: 30,
	toxpwr: 0,
});

// /datum/reagent/toxin/histamine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:386)  may sleep
rt.def("/datum/reagent/toxin/histamine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		$0 = rt.op(f, "PickUnweighted", [4], [1, 2, 3, 4]);
		if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>You can barely see!</span>"]);
			yield* g.callName(f, live(f.args[0]), "blur_eyes", [3]);
		} else if ($0 === 2) {
			yield* g.callName(f, live(f.args[0]), "emote", ["cough"]);
		} else if ($0 === 3) {
			yield* g.callName(f, live(f.args[0]), "emote", ["sneeze"]);
		} else if ($0 === 4) {
			if (truthy(rt.op(f, "Prob", [], [75]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You scratch at an itch."]);
				yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [2, 0]);
				f.dot = 1;
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/toxin/histamine/proc/overdose_process  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:403)  may sleep
rt.def("/datum/reagent/toxin/histamine/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [2, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [2, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3724, "/datum/reagent/toxin/formaldehyde", "/datum/reagent/toxin", {
	name: "Formaldehyde",
	id: "formaldehyde",
	description: "Formaldehyde, on its own, is a fairly weak toxin. It contains trace amounts of Histamine, very rarely making it decay into Histamine..",
	reagent_state: 2,
	color: "#B4004B",
	metabolization_rate: 0.2,
	toxpwr: 1,
});

// /datum/reagent/toxin/formaldehyde/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:419)  may sleep
rt.def("/datum/reagent/toxin/formaldehyde/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.callName(f, rt.sv(f, "holder"), "add_reagent", ["histamine", rt.op(f, "PickUnweighted", [2], [5, 15])]);
		yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["formaldehyde", 1.2000000476837158]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["M"] });

rt.type(3725, "/datum/reagent/toxin/venom", "/datum/reagent/toxin", {
	name: "Venom",
	id: "venom",
	description: "An exotic poison extracted from highly toxic fauna. Causes scaling amounts of toxin damage and bruising depending and dosage. Often decays into Histamine.",
	reagent_state: 2,
	color: "#F0FFF0",
	metabolization_rate: 0.1,
	toxpwr: 0,
});

// /datum/reagent/toxin/venom/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:435)  may sleep
rt.def("/datum/reagent/toxin/venom/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setSv(f, "toxpwr", multiply(0.20000000298023224, rt.sv(f, "volume")));
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [multiply(multiply(0.30000001192092896, rt.sv(f, "volume")), 1), 0]);
	f.dot = 1;
	if (truthy(rt.op(f, "Prob", [], [15]))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["histamine", rt.op(f, "PickUnweighted", [2], [5, 10])]);
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", ["venom", 1.100000023841858]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M"] });

rt.type(3726, "/datum/reagent/toxin/neurotoxin2", "/datum/reagent/toxin", {
	name: "Neurotoxin",
	id: "neurotoxin2",
	description: "Neurotoxin will inhibit brain function and cause toxin damage before eventually knocking out its victim.",
	reagent_state: 2,
	color: "#64916E",
	metabolization_rate: 0.2,
	toxpwr: 0,
});

// /datum/reagent/toxin/neurotoxin2/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:454)  may sleep
rt.def("/datum/reagent/toxin/neurotoxin2/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.le(add(rt.fv(f, "brainloss", live(f.args[0])), rt.fv(f, "toxloss", live(f.args[0]))), 60)) {
		yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [1]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
		f.dot = 1;
	}
	if (rt.ge(rt.sv(f, "current_cycle"), 18)) {
		yield* g.callName(f, live(f.args[0]), "Sleeping", [40, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3727, "/datum/reagent/toxin/cyanide", "/datum/reagent/toxin", {
	name: "Cyanide",
	id: "cyanide",
	description: "An infamous poison known for its use in assassination. Causes small amounts of toxin damage with a small chance of oxygen damage or a stun.",
	reagent_state: 2,
	color: "#00B4FF",
	metabolization_rate: 0.05,
	toxpwr: 1.25,
});

// /datum/reagent/toxin/cyanide/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:473)  may sleep
rt.def("/datum/reagent/toxin/cyanide/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		rt.modField(f, live(f.args[0]), "losebreath", 1, add);
	}
	if (truthy(rt.op(f, "Prob", [], [8]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You feel horrendously weak!"]);
		yield* g.callName(f, live(f.args[0]), "Stun", [40, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3729, "/datum/reagent/toxin/itching_powder", "/datum/reagent/toxin", {
	name: "Itching Powder",
	id: "itching_powder",
	description: "A powder that induces itching upon contact with the skin. Causes the victim to scratch at their itches and has a very low chance to decay into Histamine.",
	reagent_state: 2,
	color: "#C8C8C8",
	metabolization_rate: 0.16000001,
	toxpwr: 0,
});

// /datum/reagent/toxin/itching_powder/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:501)  may sleep
rt.def("/datum/reagent/toxin/itching_powder/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	f.vars = () => [M, method, reac_volume];
	if (live(method) === null) {
		method = 1;
	}
	if (!(isEqual(live(method), 1) || isEqual(live(method), 3))) return f.dot;
	yield* g.callName(f, rt.fv(f, "reagents", live(M)), "add_reagent", ["itching_powder", live(reac_volume)]);
	return f.dot;
}, true);

// /datum/reagent/toxin/itching_powder/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:505)  may sleep
rt.def("/datum/reagent/toxin/itching_powder/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [15]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You scratch at your head."]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [0.20000000298023224, 0]);
		f.dot = 1;
	}
	if (truthy(rt.op(f, "Prob", [], [15]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You scratch at your leg."]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [0.20000000298023224, 0]);
		f.dot = 1;
	}
	if (truthy(rt.op(f, "Prob", [], [15]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You scratch at your arm."]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [0.20000000298023224, 0]);
		f.dot = 1;
	}
	if (truthy(rt.op(f, "Prob", [], [3]))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["histamine", (yield* g.call(f, P("/proc/rand"), null, [1, 3]))]);
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", ["itching_powder", 1.2000000476837158]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3730, "/datum/reagent/toxin/initropidril", "/datum/reagent/toxin", {
	name: "Initropidril",
	id: "initropidril",
	description: "A powerful poison with insidious effects. It can cause stuns, lethal breathing failure, and cardiac arrest.",
	reagent_state: 2,
	color: "#7F10C0",
	metabolization_rate: 0.2,
	toxpwr: 2.5,
});

// /datum/reagent/toxin/initropidril/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:533)  may sleep
rt.def("/datum/reagent/toxin/initropidril/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let picked_option: Value = null, H: Value = null;
	let $0: any;
	f.vars = () => [picked_option, H, $0];
	if (truthy(rt.op(f, "Prob", [], [25]))) {
		$0 = (picked_option = (yield* g.call(f, P("/proc/rand"), null, [1, 3])));
		if ($0 === 1) {
			yield* g.callName(f, live(f.args[0]), "Knockdown", [60, 0]);
			f.dot = 1;
		} else if ($0 === 2) {
			rt.modField(f, live(f.args[0]), "losebreath", 10, add);
			yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [(yield* g.call(f, P("/proc/rand"), null, [5, 25])), 0]);
			f.dot = 1;
		} else if ($0 === 3) {
			if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
				if ((!truthy((yield* g.callName(f, (H = live(f.args[0])), "undergoing_cardiac_arrest", []))) && truthy((yield* g.callName(f, live(H), "can_heartattack", []))))) {
					yield* g.callName(f, live(H), "set_heartattack", [1]);
					if (isEqual(rt.fv(f, "stat", live(H)), 0)) {
						yield* g.callName(f, live(H), "visible_message", [fmt("<span class='userdanger'>＀ clutches at ＀ chest as if ＀ heart stopped!</span>", [live(H), (yield* g.callName(f, live(H), "p_their", [])), (yield* g.callName(f, live(H), "p_their", []))])]);
					}
				} else {
					rt.modField(f, live(H), "losebreath", 10, add);
					yield* g.callName(f, live(H), "adjustOxyLoss", [(yield* g.call(f, P("/proc/rand"), null, [5, 25])), 0]);
					f.dot = 1;
				}
			}
		}
	}
	return ((yield* g.callSuper(f, [], rt.Args.Same)) || live(f.dot));
}, true, { args: ["M"] });

rt.type(3731, "/datum/reagent/toxin/pancuronium", "/datum/reagent/toxin", {
	name: "Pancuronium",
	id: "pancuronium",
	description: "An undetectable toxin that swiftly incapacitates its victim. May also cause breathing failure.",
	reagent_state: 2,
	color: "#195096",
	metabolization_rate: 0.1,
	toxpwr: 0,
	taste_mult: 0,
});

// /datum/reagent/toxin/pancuronium/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:567)  may sleep
rt.def("/datum/reagent/toxin/pancuronium/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.ge(rt.sv(f, "current_cycle"), 10)) {
		yield* g.callName(f, live(f.args[0]), "Stun", [40, 0]);
		f.dot = 1;
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		rt.modField(f, live(f.args[0]), "losebreath", 4, add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3732, "/datum/reagent/toxin/sodium_thiopental", "/datum/reagent/toxin", {
	name: "Sodium Thiopental",
	id: "sodium_thiopental",
	description: "Sodium Thiopental induces heavy weakness in its target as well as unconsciousness.",
	reagent_state: 2,
	color: "#6496FA",
	metabolization_rate: 0.3,
	toxpwr: 0,
});

// /datum/reagent/toxin/sodium_thiopental/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:584)  may sleep
rt.def("/datum/reagent/toxin/sodium_thiopental/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.ge(rt.sv(f, "current_cycle"), 10)) {
		yield* g.callName(f, live(f.args[0]), "Sleeping", [40, 0]);
	}
	yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [10, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3733, "/datum/reagent/toxin/sulfonal", "/datum/reagent/toxin", {
	name: "Sulfonal",
	id: "sulfonal",
	description: "A stealthy poison that deals minor toxin damage and eventually puts the target to sleep.",
	reagent_state: 2,
	color: "#7DC3A0",
	metabolization_rate: 0.05,
	toxpwr: 0.5,
});

// /datum/reagent/toxin/sulfonal/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:600)  may sleep
rt.def("/datum/reagent/toxin/sulfonal/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.ge(rt.sv(f, "current_cycle"), 22)) {
		yield* g.callName(f, live(f.args[0]), "Sleeping", [40, 0]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3734, "/datum/reagent/toxin/amanitin", "/datum/reagent/toxin", {
	name: "Amanitin",
	id: "amanitin",
	description: "A very powerful delayed toxin. Upon full metabolization, a massive amount of toxin damage will be dealt depending on how long it has been in the victim's bloodstream.",
	reagent_state: 2,
	color: "#FFFFFF",
	toxpwr: 0,
	metabolization_rate: 0.2,
});

// /datum/reagent/toxin/amanitin/proc/on_mob_delete  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:614)  may sleep
rt.def("/datum/reagent/toxin/amanitin/proc/on_mob_delete", function* on_mob_delete(f: Frame) {
	let toxdamage: Value = null;
	f.vars = () => [toxdamage];
	toxdamage = multiply(multiply(rt.sv(f, "current_cycle"), 3), 1);
	yield* g.callName(f, live(f.args[0]), "log_message", [fmt("has taken ＀ toxin damage from amanitin toxin", [live(toxdamage)]), "Attack log"]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [live(toxdamage)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3735, "/datum/reagent/toxin/lipolicide", "/datum/reagent/toxin", {
	name: "Lipolicide",
	id: "lipolicide",
	description: "A powerful toxin that will destroy fat cells, massively reducing body weight in a short time. More deadly to those without nutriment in their body.",
	taste_description: "mothballs",
	reagent_state: 2,
	color: "#F0FFF0",
	metabolization_rate: 0.2,
	toxpwr: 0.5,
});

// /datum/reagent/toxin/lipolicide/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:630)  may sleep
rt.def("/datum/reagent/toxin/lipolicide/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.le(rt.fv(f, "nutrition", live(f.args[0])), 150)) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [0.5, 0]);
	}
	rt.setFv(f, "nutrition", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "nutrition", live(f.args[0])), 3), 0])));
	rt.setFv(f, "overeatduration", live(f.args[0]), 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3736, "/datum/reagent/toxin/coniine", "/datum/reagent/toxin", {
	name: "Coniine",
	id: "coniine",
	description: "Coniine metabolizes extremely slowly, but deals high amounts of toxin damage and stops breathing.",
	reagent_state: 2,
	color: "#7DC3A0",
	metabolization_rate: 0.024,
	toxpwr: 1.75,
});

// /datum/reagent/toxin/coniine/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:646)  may sleep
rt.def("/datum/reagent/toxin/coniine/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.modField(f, live(f.args[0]), "losebreath", 5, add);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3737, "/datum/reagent/toxin/spewium", "/datum/reagent/toxin", {
	name: "Spewium",
	id: "spewium",
	description: "A powerful emetic, causes uncontrollable vomiting.  May result in vomiting organs at high doses.",
	reagent_state: 2,
	color: "#2f6617",
	metabolization_rate: 0.4,
	overdose_threshold: 29,
	toxpwr: 0,
	taste_description: "vomit",
});

// /datum/reagent/toxin/spewium/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:661)  may sleep
rt.def("/datum/reagent/toxin/spewium/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let H: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [H, R, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((rt.ge(rt.sv(f, "current_cycle"), 11) && truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/min"), null, [50, rt.sv(f, "current_cycle")]))]))) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (H = live(f.args[0])), "vomit", [10, rt.op(f, "Prob", [], [10]), rt.op(f, "Prob", [], [50]), (yield* g.call(f, P("/proc/rand"), null, [0, 4])), 1, rt.op(f, "Prob", [], [30])]);
	R = null;
	rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(f.args[0]))), T("/datum/reagent/toxin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (!isEqual(live(R), live(f.src))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(H)), "remove_reagent", [rt.fv(f, "id", live(R)), 1]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/toxin/spewium/proc/overdose_process  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:670)  may sleep
rt.def("/datum/reagent/toxin/spewium/proc/overdose_process", function* overdose_process(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((rt.ge(rt.sv(f, "current_cycle"), 33) && truthy(rt.op(f, "Prob", [], [15]))) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (H = live(f.args[0])), "spew_organ", []);
	yield* g.callName(f, live(H), "vomit", [0, 1, 1, 4]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='userdanger'>You feel something lumpy come up as you vomit.</span>"]);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3738, "/datum/reagent/toxin/curare", "/datum/reagent/toxin", {
	name: "Curare",
	id: "curare",
	description: "Causes slight toxin damage followed by chain-stunning and oxygen damage.",
	reagent_state: 2,
	color: "#191919",
	metabolization_rate: 0.05,
	toxpwr: 1,
});

// /datum/reagent/toxin/curare/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:687)  may sleep
rt.def("/datum/reagent/toxin/curare/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.ge(rt.sv(f, "current_cycle"), 11)) {
		yield* g.callName(f, live(f.args[0]), "Knockdown", [60, 0]);
	}
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [1, 0]);
	f.dot = 1;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3739, "/datum/reagent/toxin/heparin", "/datum/reagent/toxin", {
	name: "Heparin",
	id: "heparin",
	description: "A powerful anticoagulant. Victims will bleed uncontrollably and suffer scaling bruising.",
	reagent_state: 2,
	color: "#C8C8C8",
	metabolization_rate: 0.080000006,
	toxpwr: 0,
});

// /datum/reagent/toxin/heparin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:703)  may sleep
rt.def("/datum/reagent/toxin/heparin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.setFv(f, "bleed_rate", (H = live(f.args[0])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "bleed_rate", live(H)), 2), 8])));
		yield* g.callName(f, live(H), "adjustBruteLoss", [1, 0]);
		f.dot = 1;
	}
	return ((yield* g.callSuper(f, [], rt.Args.Same)) || live(f.dot));
}, true, { args: ["M"] });

rt.type(3740, "/datum/reagent/toxin/rotatium", "/datum/reagent/toxin", {
	name: "Rotatium",
	id: "rotatium",
	description: "A constantly swirling, oddly colourful fluid. Causes the consumer's sense of direction and hand-eye coordination to become wild.",
	reagent_state: 2,
	color: "#AC88CA",
	metabolization_rate: 0.24000001,
	toxpwr: 0.5,
	taste_description: "spinning",
});

// /datum/reagent/toxin/rotatium/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:722)  may sleep
rt.def("/datum/reagent/toxin/rotatium/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let screens: Value = null, rotation: Value = null, whole_screen: Value = null;
	let $e: any;
	f.vars = () => [screens, rotation, whole_screen, $e];
	if (truthy(rt.fv(f, "hud_used", live(f.args[0])))) {
		if ((rt.ge(rt.sv(f, "current_cycle"), 20) && isEqual(rt.modulus(rt.sv(f, "current_cycle"), 20), 0))) {
			screens = rt.list(rt.index(rt.gv(f, "plane_masters", rt.fv(f, "hud_used", live(f.args[0]))), fmt("＀", [0])), rt.index(rt.gv(f, "plane_masters", rt.fv(f, "hud_used", live(f.args[0]))), fmt("＀", [15])));
			rotation = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "current_cycle"), 20)])), 89]));
			whole_screen = null;
			rt.forList(f, 0, live(screens));
			while (($e = rt.next(f, 0)) !== undefined) {
				whole_screen = $e;
				rt.op(f, "Animate", [2, 10], [null, live(whole_screen), "transform", (yield* g.call(f, P("/proc/matrix"), null, [live(rotation), 5])), "time", 5, "easing", 7, "loop", -1]);
				rt.op(f, "Animate", [2, 6], ["transform", (yield* g.call(f, P("/proc/matrix"), null, [rt.neg(live(rotation)), 5])), "time", 5, "easing", 7]);
			}
			rt.endFor(f, 0);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

// /datum/reagent/toxin/rotatium/proc/on_mob_delete  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:732)
rt.def("/datum/reagent/toxin/rotatium/proc/on_mob_delete", function on_mob_delete(f: Frame) {
	let screens: Value = null, whole_screen: Value = null;
	let $e: any;
	f.vars = () => [screens, whole_screen, $e];
	if ((truthy(live(f.args[0])) && truthy(rt.fv(f, "hud_used", live(f.args[0]))))) {
		screens = rt.list(rt.index(rt.gv(f, "plane_masters", rt.fv(f, "hud_used", live(f.args[0]))), fmt("＀", [0])), rt.index(rt.gv(f, "plane_masters", rt.fv(f, "hud_used", live(f.args[0]))), fmt("＀", [15])));
		whole_screen = null;
		rt.forList(f, 0, live(screens));
		while (($e = rt.next(f, 0)) !== undefined) {
			whole_screen = $e;
			rt.op(f, "Animate", [2, 8], [null, live(whole_screen), "transform", rt.call(f, P("/proc/matrix"), null, []), "time", 5, "easing", 7]);
		}
		rt.endFor(f, 0);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M"] });

rt.type(3741, "/datum/reagent/toxin/skewium", "/datum/reagent/toxin", {
	name: "Skewium",
	id: "skewium",
	description: "A strange, dull coloured liquid that appears to warp back and forth inside its container. Causes any consumer to experience a visual phenomena similar to said warping.",
	reagent_state: 2,
	color: "#ADBDCD",
	metabolization_rate: 0.32000002,
	toxpwr: 0.25,
	taste_description: "skewing",
});

// /datum/reagent/toxin/skewium/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:749)  may sleep
rt.def("/datum/reagent/toxin/skewium/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let screens: Value = null, skew: Value = null, intensity: Value = null, newmatrix: Value = null, PM: Value = null, whole_screen: Value = null;
	let $e: any;
	f.vars = () => [screens, skew, intensity, newmatrix, PM, whole_screen, $e];
	if (truthy(rt.fv(f, "hud_used", live(f.args[0])))) {
		if ((rt.ge(rt.sv(f, "current_cycle"), 5) && isEqual(rt.modulus(rt.sv(f, "current_cycle"), 3), 0))) {
			screens = rt.list(rt.index(rt.gv(f, "plane_masters", rt.fv(f, "hud_used", live(f.args[0]))), fmt("＀", [0])), rt.index(rt.gv(f, "plane_masters", rt.fv(f, "hud_used", live(f.args[0]))), fmt("＀", [15])));
			skew = (yield* g.call(f, P("/proc/matrix"), null, []));
			intensity = 8;
			yield* g.callName(f, live(skew), "set_skew", [(yield* g.call(f, P("/proc/rand"), null, [rt.neg(live(intensity)), live(intensity)])), (yield* g.call(f, P("/proc/rand"), null, [rt.neg(live(intensity)), live(intensity)]))]);
			newmatrix = live(skew);
			if (truthy(rt.op(f, "Prob", [], [33]))) {
				PM = rt.index(rt.gv(f, "plane_masters", rt.fv(f, "hud_used", live(f.args[0]))), fmt("＀", [0]));
				newmatrix = multiply(live(skew), rt.fv(f, "transform", live(PM)));
			}
			whole_screen = null;
			rt.forList(f, 0, live(screens));
			while (($e = rt.next(f, 0)) !== undefined) {
				whole_screen = $e;
				rt.op(f, "Animate", [2, 10], [null, live(whole_screen), "transform", live(newmatrix), "time", 5, "easing", 7, "loop", -1]);
				rt.op(f, "Animate", [2, 6], ["transform", rt.neg(live(newmatrix)), "time", 5, "easing", 7]);
			}
			rt.endFor(f, 0);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

// /datum/reagent/toxin/skewium/proc/on_mob_delete  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:767)
rt.def("/datum/reagent/toxin/skewium/proc/on_mob_delete", function on_mob_delete(f: Frame) {
	let screens: Value = null, whole_screen: Value = null;
	let $e: any;
	f.vars = () => [screens, whole_screen, $e];
	if ((truthy(live(f.args[0])) && truthy(rt.fv(f, "hud_used", live(f.args[0]))))) {
		screens = rt.list(rt.index(rt.gv(f, "plane_masters", rt.fv(f, "hud_used", live(f.args[0]))), fmt("＀", [0])), rt.index(rt.gv(f, "plane_masters", rt.fv(f, "hud_used", live(f.args[0]))), fmt("＀", [15])));
		whole_screen = null;
		rt.forList(f, 0, live(screens));
		while (($e = rt.next(f, 0)) !== undefined) {
			whole_screen = $e;
			rt.op(f, "Animate", [2, 8], [null, live(whole_screen), "transform", rt.call(f, P("/proc/matrix"), null, []), "time", 5, "easing", 7]);
		}
		rt.endFor(f, 0);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M"] });

rt.type(3742, "/datum/reagent/toxin/anacea", "/datum/reagent/toxin", {
	name: "Anacea",
	id: "anacea",
	description: "A toxin that quickly purges medicines and metabolizes very slowly.",
	reagent_state: 2,
	color: "#3C5133",
	metabolization_rate: 0.032,
	toxpwr: 0.15,
});

// /datum/reagent/toxin/anacea/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:785)  may sleep
rt.def("/datum/reagent/toxin/anacea/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let remove_amt: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [remove_amt, R, $e];
	remove_amt = 5;
	if ((truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["calomel"]))) || truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["pen_acid"]))))) {
		remove_amt = 0.5;
	}
	R = null;
	rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(f.args[0]))), T("/datum/reagent/medicine"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", [rt.fv(f, "id", live(R)), live(remove_amt)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3743, "/datum/reagent/toxin/acid", "/datum/reagent/toxin", {
	acidpwr: 10,
	name: "Sulphuric acid",
	id: "sacid",
	description: "A strong mineral acid with the molecular formula H2SO4.",
	color: "#00FF32",
	toxpwr: 1,
	taste_description: "acid",
});

// /datum/reagent/toxin/acid/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:804)  may sleep
rt.def("/datum/reagent/toxin/acid/proc/reaction_mob", function* reaction_mob(f: Frame, C: Value, method: Value, reac_volume: Value) {
	f.vars = () => [C, method, reac_volume];
	if (live(method) === null) {
		method = 1;
	}
	if (!truthy((rt.istype(live(C), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	reac_volume = (yield* g.call(f, P("/proc/round"), null, [live(reac_volume), 0.10000000149011612]));
	if (isEqual(live(method), 2)) {
		yield* g.callName(f, live(C), "adjustBruteLoss", [(yield* g.call(f, P("/proc/min"), null, [multiply(6, rt.sv(f, "toxpwr")), multiply(live(reac_volume), rt.sv(f, "toxpwr"))]))]);
		return live(f.dot);
	}
	if (isEqual(live(method), 5)) {
		yield* g.callName(f, live(C), "adjustBruteLoss", [multiply(1.5, (yield* g.call(f, P("/proc/min"), null, [multiply(6, rt.sv(f, "toxpwr")), multiply(live(reac_volume), rt.sv(f, "toxpwr"))])))]);
		return live(f.dot);
	}
	yield* g.callName(f, live(C), "acid_act", [rt.sv(f, "acidpwr"), live(reac_volume)]);
	return f.dot;
}, true);

// /datum/reagent/toxin/acid/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:816)  may sleep
rt.def("/datum/reagent/toxin/acid/proc/reaction_obj", function* reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	f.vars = () => [O, reac_volume];
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(O))])))) {
		return live(f.dot);
	}
	reac_volume = (yield* g.call(f, P("/proc/round"), null, [live(reac_volume), 0.10000000149011612]));
	yield* g.callName(f, live(O), "acid_act", [rt.sv(f, "acidpwr"), live(reac_volume)]);
	return f.dot;
}, true);

// /datum/reagent/toxin/acid/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:822)  may sleep
rt.def("/datum/reagent/toxin/acid/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	f.vars = () => [_T, reac_volume];
	if (!truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0))) {
		return live(f.dot);
	}
	reac_volume = (yield* g.call(f, P("/proc/round"), null, [live(reac_volume), 0.10000000149011612]));
	yield* g.callName(f, live(_T), "acid_act", [rt.sv(f, "acidpwr"), live(reac_volume)]);
	return f.dot;
}, true);

rt.type(3744, "/datum/reagent/toxin/acid/fluacid", "/datum/reagent/toxin/acid", {
	name: "Fluorosulfuric acid",
	id: "facid",
	description: "Fluorosulfuric acid is a an extremely corrosive chemical substance.",
	color: "#5050FF",
	toxpwr: 2,
	acidpwr: 42,
});

// /datum/reagent/toxin/acid/fluacid/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:836)  may sleep
rt.def("/datum/reagent/toxin/acid/fluacid/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [divide(rt.sv(f, "current_cycle"), 10), 0]);
	f.dot = 1;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3746, "/datum/reagent/toxin/peaceborg/confuse", "/datum/reagent/toxin/peaceborg", {
	name: "Dizzying Solution",
	id: "dizzysolution",
	description: "Makes the target off balance and dizzy",
	toxpwr: 0,
	metabolization_rate: 0.6,
	taste_description: "dizziness",
});

// /datum/reagent/toxin/peaceborg/confuse/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:849)  may sleep
rt.def("/datum/reagent/toxin/peaceborg/confuse/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.lt(rt.fv(f, "confused", live(f.args[0])), 6)) {
		rt.setFv(f, "confused", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "confused", live(f.args[0])), 3), 5]))])));
	}
	if (rt.lt(rt.fv(f, "dizziness", live(f.args[0])), 6)) {
		rt.setFv(f, "dizziness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "dizziness", live(f.args[0])), 3), 5]))])));
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You feel confused and disorientated."]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3747, "/datum/reagent/toxin/peaceborg/tire", "/datum/reagent/toxin/peaceborg", {
	name: "Tiring Solution",
	id: "tiresolution",
	description: "An extremely weak stamina-toxin that tires out the target. Completely harmless.",
	toxpwr: 0,
	metabolization_rate: 0.6,
	taste_description: "tiredness",
});

// /datum/reagent/toxin/peaceborg/tire/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:866)  may sleep
rt.def("/datum/reagent/toxin/peaceborg/tire/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let healthcomp: Value = null;
	f.vars = () => [healthcomp];
	healthcomp = subtract(100, rt.fv(f, "health", live(f.args[0])));
	if (rt.lt(rt.fv(f, "staminaloss", live(f.args[0])), subtract(45, live(healthcomp)))) {
		yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [10]);
	}
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You should sit down and take a rest..."]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3748, "/datum/reagent/toxin/delayed", "/datum/reagent/toxin", {
	actual_metaboliztion_rate: 0.4,
	actual_toxpwr: 5,
	delay: 30,
	name: "Toxin Microcapsules",
	id: "delayed_toxin",
	description: "Causes heavy toxin damage after a brief time of inactivity.",
	reagent_state: 2,
	metabolization_rate: 0,
	toxpwr: 0,
});

// /datum/reagent/toxin/delayed/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/toxin_reagents.dm:885)  may sleep
rt.def("/datum/reagent/toxin/delayed/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.gt(rt.sv(f, "current_cycle"), rt.sv(f, "delay"))) {
		yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", [rt.sv(f, "id"), multiply(rt.sv(f, "actual_metaboliztion_rate"), rt.fv(f, "metabolism_efficiency", live(f.args[0])))]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [multiply(rt.sv(f, "actual_toxpwr"), 1), 0]);
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.callName(f, live(f.args[0]), "Knockdown", [20, 0]);
		}
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });
