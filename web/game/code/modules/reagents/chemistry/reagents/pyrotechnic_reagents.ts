// From code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3758, "/datum/reagent/thermite", "/datum/reagent", {
	name: "Thermite",
	id: "thermite",
	description: "Thermite produces an aluminothermic reaction known as a thermite reaction. Can be used to melt walls.",
	reagent_state: 1,
	color: "#550000",
	taste_description: "sweet tasting metal",
});

// /datum/reagent/thermite/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:11)
rt.def("/datum/reagent/thermite/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let Wall: Value = null;
	f.vars = () => [Wall];
	if (!(rt.ge(live(reac_volume), 1) && truthy((rt.istype(live(_T), T("/turf/closed/wall")) ? 1 : 0)))) return f.dot;
	if (truthy((rt.istype((Wall = live(_T)), T("/turf/closed/wall/r_wall")) ? 1 : 0))) {
		rt.setFv(f, "thermite", live(Wall), add(rt.fv(f, "thermite", live(Wall)), multiply(live(reac_volume), 2.5)));
	} else {
		rt.setFv(f, "thermite", live(Wall), add(rt.fv(f, "thermite", live(Wall)), multiply(live(reac_volume), 10)));
	}
	rt.setFv(f, "overlays", live(Wall), rt.list());
	rt.callName(f, live(Wall), "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/effects.dmi"), "thermite"])]);
	return f.dot;
});

// /datum/reagent/thermite/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:21)  may sleep
rt.def("/datum/reagent/thermite/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [1, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3761, "/datum/reagent/clf3", "/datum/reagent", {
	name: "Chlorine Trifluoride",
	id: "clf3",
	description: "Makes a temporary 3x3 fireball when it comes into existence, so be careful when mixing. ClF3 applied to a surface burns things that wouldn't otherwise burn, sometimes through the very floors of the station and exposing it to the vacuum of space.",
	reagent_state: 2,
	color: "#FFC8C8",
	metabolization_rate: 4,
	taste_description: "burning",
});

// /datum/reagent/clf3/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:50)  may sleep
rt.def("/datum/reagent/clf3/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let burndmg: Value = null;
	f.vars = () => [burndmg];
	yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [2]);
	burndmg = (yield* g.call(f, P("/proc/max"), null, [multiply(0.30000001192092896, rt.fv(f, "fire_stacks", live(f.args[0]))), 0.30000001192092896]));
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [live(burndmg), 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/clf3/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:57)  may sleep
rt.def("/datum/reagent/clf3/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let F: Value = null, turf: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [_T, reac_volume, F, turf, W, $e];
	if (truthy((rt.istype(live(_T), T("/turf/open/floor/plating")) ? 1 : 0))) {
		F = live(_T);
		if (truthy(rt.op(f, "Prob", [], [add(add(10, rt.fv(f, "burnt", live(F))), multiply(5, rt.fv(f, "broken", live(F))))]))) {
			yield* g.callName(f, live(F), "ChangeTurf", [rt.fv(f, "baseturf", live(F))]);
		}
	}
	if (truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0))) {
		F = live(_T);
		if (truthy(rt.op(f, "Prob", [], [live(reac_volume)]))) {
			yield* g.callName(f, live(F), "make_plating", []);
		} else {
			if (truthy(rt.op(f, "Prob", [], [live(reac_volume)]))) {
				yield* g.callName(f, live(F), "burn_tile", []);
			}
		}
		if (truthy((rt.istype(live(F), T("/turf/open/floor")) ? 1 : 0))) {
			turf = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(F)])), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				turf = $e;
				if (!truthy(rt.locateIn(f, T("/obj/effect/hotspot"), live(turf)))) {
					yield* g.new_(f, T("/obj/effect/hotspot"), [live(F)]);
				}
			}
			rt.endFor(f, 0);
		}
	}
	if (!truthy((rt.istype(live(_T), T("/turf/closed/wall")) ? 1 : 0))) return f.dot;
	W = live(_T);
	if (!truthy(rt.op(f, "Prob", [], [live(reac_volume)]))) return f.dot;
	yield* g.callName(f, live(W), "ChangeTurf", [T("/turf/open/floor/plating")]);
	return f.dot;
}, true);

// /datum/reagent/clf3/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:77)  may sleep
rt.def("/datum/reagent/clf3/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	f.vars = () => [M, method, reac_volume];
	if (live(method) === null) {
		method = 1;
	}
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) return f.dot;
	if (!(!isEqual(live(method), 2) && !isEqual(live(method), 5))) return f.dot;
	yield* g.callName(f, live(M), "adjust_fire_stacks", [(yield* g.call(f, P("/proc/min"), null, [divide(live(reac_volume), 5), 10]))]);
	yield* g.callName(f, live(M), "IgniteMob", []);
	if (truthy(rt.locateIn(f, T("/obj/effect/hotspot"), rt.fv(f, "loc", live(M))))) return f.dot;
	yield* g.new_(f, T("/obj/effect/hotspot"), [rt.fv(f, "loc", live(M))]);
	return f.dot;
}, true);

rt.type(3764, "/datum/reagent/blackpowder", "/datum/reagent", {
	name: "Black Powder",
	id: "blackpowder",
	description: "Explodes. Violently.",
	reagent_state: 2,
	color: "#000000",
	metabolization_rate: 0.05,
	taste_description: "salt",
});

// /datum/reagent/blackpowder/proc/on_ex_act  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:110)  may sleep
rt.def("/datum/reagent/blackpowder/proc/on_ex_act", function* on_ex_act(f: Frame) {
	let location: Value = null, e: Value = null;
	f.vars = () => [location, e];
	location = rt.getStep(f, rt.fv(f, "my_atom", rt.sv(f, "holder")), 0);
	yield* g.callName(f, (e = (yield* g.new_(f, T("/datum/effect_system/reagents_explosion"), []))), "set_up", [null, add(1, (yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "volume"), 6), 1]))), null, live(location), null, 0, null, 0, "message", 0], rt.Args.Named);
	yield* g.callName(f, live(e), "start", []);
	yield* g.callName(f, rt.sv(f, "holder"), "clear_reagents", []);
	return f.dot;
}, true);

rt.type(3768, "/datum/reagent/phlogiston", "/datum/reagent", {
	name: "Phlogiston",
	id: "phlogiston",
	description: "Catches you on fire and makes you ignite.",
	reagent_state: 2,
	color: "#FA00AF",
	taste_description: "burning",
});

// /datum/reagent/phlogiston/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:149)  may sleep
rt.def("/datum/reagent/phlogiston/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let burndmg: Value = null;
	f.vars = () => [burndmg];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [1]);
	burndmg = (yield* g.call(f, P("/proc/max"), null, [multiply(0.30000001192092896, rt.fv(f, "fire_stacks", live(f.args[0]))), 0.30000001192092896]));
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [live(burndmg), 0]);
	yield* g.callName(f, live(f.args[0]), "IgniteMob", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// /datum/reagent/phlogiston/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:156)  may sleep
rt.def("/datum/reagent/phlogiston/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let burndmg: Value = null;
	f.vars = () => [burndmg];
	yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [1]);
	burndmg = (yield* g.call(f, P("/proc/max"), null, [multiply(0.30000001192092896, rt.fv(f, "fire_stacks", live(f.args[0]))), 0.30000001192092896]));
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [live(burndmg), 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3769, "/datum/reagent/napalm", "/datum/reagent", {
	name: "Napalm",
	id: "napalm",
	description: "Very flammable.",
	reagent_state: 2,
	color: "#FA00AF",
	taste_description: "burning",
});

// /datum/reagent/napalm/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:171)  may sleep
rt.def("/datum/reagent/napalm/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [1]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/napalm/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:175)  may sleep
rt.def("/datum/reagent/napalm/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	f.vars = () => [M, method, reac_volume];
	if (live(method) === null) {
		method = 1;
	}
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) return f.dot;
	if (!(!isEqual(live(method), 2) && !isEqual(live(method), 5))) return f.dot;
	yield* g.callName(f, live(M), "adjust_fire_stacks", [(yield* g.call(f, P("/proc/min"), null, [divide(live(reac_volume), 4), 20]))]);
	return f.dot;
}, true);

rt.type(3770, "/datum/reagent/cryostylane", "/datum/reagent", {
	name: "Cryostylane",
	id: "cryostylane",
	description: "Comes into existence at 20K. As long as there is sufficient oxygen for it to react with, Cryostylane slowly cools all other reagents in the container 0K.",
	color: "#0000DC",
	metabolization_rate: 0.2,
	taste_description: "bitterness",
});

// /datum/reagent/cryostylane/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:189)  may sleep
rt.def("/datum/reagent/cryostylane/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy((yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "has_reagent", ["oxygen"])))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", ["oxygen", 0.5]);
		(rt.modField(f, live(f.args[0]), "bodytemperature", 15, subtract));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/cryostylane/proc/on_tick  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:195)  may sleep
rt.def("/datum/reagent/cryostylane/proc/on_tick", function* on_tick(f: Frame) {
	if (truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["oxygen"])))) {
		yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["oxygen", 1]);
		(rt.modField(f, rt.sv(f, "holder"), "chem_temp", 10, subtract));
		yield* g.callName(f, rt.sv(f, "holder"), "handle_reactions", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/reagent/cryostylane/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:202)  may sleep
rt.def("/datum/reagent/cryostylane/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [_T, reac_volume, M, $e];
	if (!rt.ge(live(reac_volume), 5)) return f.dot;
	M = null;
	rt.forList(f, 0, live(_T), T("/mob/living/simple_animal/slime"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "adjustToxLoss", [(yield* g.call(f, P("/proc/rand"), null, [15, 30]))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(3771, "/datum/reagent/pyrosium", "/datum/reagent", {
	name: "Pyrosium",
	id: "pyrosium",
	description: "Comes into existence at 20K. As long as there is sufficient oxygen for it to react with, Pyrosium slowly heats all other reagents in the container.",
	color: "#64FAC8",
	metabolization_rate: 0.2,
	taste_description: "bitterness",
});

// /datum/reagent/pyrosium/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:215)  may sleep
rt.def("/datum/reagent/pyrosium/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy((yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "has_reagent", ["oxygen"])))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "remove_reagent", ["oxygen", 0.5]);
		rt.modField(f, live(f.args[0]), "bodytemperature", 15, add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/pyrosium/proc/on_tick  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:221)  may sleep
rt.def("/datum/reagent/pyrosium/proc/on_tick", function* on_tick(f: Frame) {
	if (truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["oxygen"])))) {
		yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["oxygen", 1]);
		rt.modField(f, rt.sv(f, "holder"), "chem_temp", 10, add);
		yield* g.callName(f, rt.sv(f, "holder"), "handle_reactions", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(3772, "/datum/reagent/teslium", "/datum/reagent", {
	shock_timer: 0,
	name: "Teslium",
	id: "teslium",
	description: "An unstable, electrically-charged metallic slurry. Periodically electrocutes its victim, and makes electrocutions against them more deadly. Excessively heating teslium results in dangerous destabilization. Do not allow to come into contact with water.",
	reagent_state: 2,
	color: "#20324D",
	metabolization_rate: 0.2,
	taste_description: "charged metal",
});

// /datum/reagent/teslium/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm:238)  may sleep
rt.def("/datum/reagent/teslium/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.incSrcVar(f, "shock_timer", 1, true);
	if (rt.ge(rt.sv(f, "shock_timer"), (yield* g.call(f, P("/proc/rand"), null, [5, 30])))) {
		rt.setSv(f, "shock_timer", 0);
		yield* g.callName(f, live(f.args[0]), "electrocute_act", [(yield* g.call(f, P("/proc/rand"), null, [5, 20])), "Teslium in their body", 1, 1]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[0]), "sparks", 50, 1]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });
