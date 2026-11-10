// Based on /tg/station's code/modules/reagents/chemistry/reagents/pyrotechnic_reagents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(3758, "/datum/reagent/thermite", "/datum/reagent", {
	name: "Thermite",
	id: "thermite",
	description: "Thermite produces an aluminothermic reaction known as a thermite reaction. Can be used to melt walls.",
	reagent_state: 1,
	color: "#550000",
	taste_description: "sweet tasting metal",
});

// pyrotechnic_reagents.dm:11
rt.def("/datum/reagent/thermite/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let Wall: Value = null;
	if (!(reac_volume >= 1 && rt.istype(_T, T("/turf/closed/wall")))) return f.dot;
	if (rt.istype((Wall = _T), T("/turf/closed/wall/r_wall"))) {
		Wall.thermite = Wall.thermite + reac_volume * 2.5;
	} else {
		Wall.thermite = Wall.thermite + reac_volume * 10;
	}
	Wall.overlays = list();
	Wall.add_overlay(mutable_appearance(rt.rsc("icons/effects/effects.dmi"), "thermite"));
	return f.dot;
});

// pyrotechnic_reagents.dm:21
rt.def("/datum/reagent/thermite/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustFireLoss(1, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3761, "/datum/reagent/clf3", "/datum/reagent", {
	name: "Chlorine Trifluoride",
	id: "clf3",
	description: "Makes a temporary 3x3 fireball when it comes into existence, so be careful when mixing. ClF3 applied to a surface burns things that wouldn't otherwise burn, sometimes through the very floors of the station and exposing it to the vacuum of space.",
	reagent_state: 2,
	color: "#FFC8C8",
	metabolization_rate: 4,
	taste_description: "burning",
});

// pyrotechnic_reagents.dm:50
rt.def("/datum/reagent/clf3/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjust_fire_stacks(2);
	let burndmg: Value = max(0.3 * M.fire_stacks, 0.3);
	yield* M.adjustFireLoss(burndmg, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// pyrotechnic_reagents.dm:57
rt.def("/datum/reagent/clf3/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let F: Value = null, turf: Value = null;
	if (rt.istype(_T, T("/turf/open/floor/plating"))) {
		F = _T;
		if (prob(10 + F.burnt + 5 * F.broken)) {
			yield* F.ChangeTurf(F.baseturf);
		}
	}
	if (rt.istype(_T, T("/turf/open/floor"))) {
		F = _T;
		if (prob(reac_volume)) {
			yield* F.make_plating();
		} else if (prob(reac_volume)) {
			yield* F.burn_tile();
		}
		if (rt.istype(F, T("/turf/open/floor"))) {
			for (turf of each(range(1, F), T("/turf"))) {
				if (!rt.locateIn(f, T("/obj/effect/hotspot"), turf)) {
					yield* new_(T("/obj/effect/hotspot"), F);
				}
			}
		}
	}
	if (!rt.istype(_T, T("/turf/closed/wall"))) return f.dot;
	let W: Value = _T;
	if (!prob(reac_volume)) return f.dot;
	yield* W.ChangeTurf(T("/turf/open/floor/plating"));
	return f.dot;
}, true);

// pyrotechnic_reagents.dm:77
rt.def("/datum/reagent/clf3/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	method ??= TOUCH;
	if (!rt.istype(M, T("/mob/living"))) return f.dot;
	if (!(method != INGEST && method != INJECT)) return f.dot;
	yield* M.adjust_fire_stacks(min(reac_volume / 5, 10));
	yield* M.IgniteMob();
	if (rt.locateIn(f, T("/obj/effect/hotspot"), M.loc)) return f.dot;
	yield* new_(T("/obj/effect/hotspot"), M.loc);
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

// pyrotechnic_reagents.dm:110
rt.def("/datum/reagent/blackpowder/proc/on_ex_act", function* on_ex_act(f: Frame) {
	let e: Value = null;
	let location: Value = rt.getStep(f, this.holder.my_atom, 0);
	yield* (e = (yield* new_(T("/datum/effect_system/reagents_explosion")))).set_up(1 + round(this.volume / 6, 1), location, 0, 0, { message: 0 });
	yield* e.start();
	yield* this.holder.clear_reagents();
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

// pyrotechnic_reagents.dm:149
rt.def("/datum/reagent/phlogiston/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	yield* f.args[0].adjust_fire_stacks(1);
	let burndmg: Value = max(0.3 * f.args[0].fire_stacks, 0.3);
	yield* f.args[0].adjustFireLoss(burndmg, 0);
	yield* f.args[0].IgniteMob();
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// pyrotechnic_reagents.dm:156
rt.def("/datum/reagent/phlogiston/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjust_fire_stacks(1);
	let burndmg: Value = max(0.3 * M.fire_stacks, 0.3);
	yield* M.adjustFireLoss(burndmg, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3769, "/datum/reagent/napalm", "/datum/reagent", {
	name: "Napalm",
	id: "napalm",
	description: "Very flammable.",
	reagent_state: 2,
	color: "#FA00AF",
	taste_description: "burning",
});

// pyrotechnic_reagents.dm:171
rt.def("/datum/reagent/napalm/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjust_fire_stacks(1);
	yield* parent_proc();
	return f.dot;
}, true);

// pyrotechnic_reagents.dm:175
rt.def("/datum/reagent/napalm/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	method ??= TOUCH;
	if (!rt.istype(M, T("/mob/living"))) return f.dot;
	if (!(method != INGEST && method != INJECT)) return f.dot;
	yield* M.adjust_fire_stacks(min(reac_volume / 4, 20));
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

// pyrotechnic_reagents.dm:189
rt.def("/datum/reagent/cryostylane/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.reagents.has_reagent("oxygen")) {
		yield* M.reagents.remove_reagent("oxygen", 0.5);
		M.bodytemperature -= 15;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// pyrotechnic_reagents.dm:195
rt.def("/datum/reagent/cryostylane/proc/on_tick", function* on_tick(f: Frame) {
	if (this.holder.has_reagent("oxygen")) {
		yield* this.holder.remove_reagent("oxygen", 1);
		this.holder.chem_temp -= 10;
		yield* this.holder.handle_reactions();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// pyrotechnic_reagents.dm:202
rt.def("/datum/reagent/cryostylane/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let M: Value = null;
	if (!(reac_volume >= 5)) return f.dot;
	for (M of each(_T, T("/mob/living/simple_animal/slime"))) {
		yield* M.adjustToxLoss(rand(15, 30));
	}
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

// pyrotechnic_reagents.dm:215
rt.def("/datum/reagent/pyrosium/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.reagents.has_reagent("oxygen")) {
		yield* M.reagents.remove_reagent("oxygen", 0.5);
		M.bodytemperature += 15;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// pyrotechnic_reagents.dm:221
rt.def("/datum/reagent/pyrosium/proc/on_tick", function* on_tick(f: Frame) {
	if (this.holder.has_reagent("oxygen")) {
		yield* this.holder.remove_reagent("oxygen", 1);
		this.holder.chem_temp += 10;
		yield* this.holder.handle_reactions();
	}
	yield* parent_proc();
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

// pyrotechnic_reagents.dm:238
rt.def("/datum/reagent/teslium/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	this.shock_timer++;
	if (this.shock_timer >= rand(5, 30)) {
		this.shock_timer = 0;
		yield* M.electrocute_act(rand(5, 20), "Teslium in their body", 1, 1);
		playsound(M, "sparks", 50, 1);
	}
	yield* parent_proc();
	return f.dot;
}, true);
