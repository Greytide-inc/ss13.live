// From code/modules/station_goals/dna_vault.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4203, "/datum/station_goal/dna_vault", "/datum/station_goal", {
	animal_count: null,
	human_count: null,
	plant_count: null,
	name: "DNA Vault",
});

// /datum/station_goal/dna_vault/proc/New  (code/modules/station_goals/dna_vault.dm:21)
rt.def("/datum/station_goal/dna_vault/proc/New", function New(f: Frame) {
	let non_standard_plants: Value = null;
	f.vars = () => [non_standard_plants];
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "animal_count", rt.call(f, P("/proc/rand"), null, [15, 20]));
	rt.setSv(f, "human_count", rt.call(f, P("/proc/rand"), null, [rt.call(f, P("/proc/round"), null, [multiply(0.75, rt.fv(f, "totalPlayersReady", rt.gl("SSticker")))]), rt.fv(f, "totalPlayersReady", rt.gl("SSticker"))]));
	non_standard_plants = rt.callSrc(f, "non_standard_plants_count", []);
	rt.setSv(f, "plant_count", rt.call(f, P("/proc/rand"), null, [rt.call(f, P("/proc/round"), null, [multiply(0.5, live(non_standard_plants))]), rt.call(f, P("/proc/round"), null, [multiply(0.699999988079071, live(non_standard_plants))])]));
	return f.dot;
});

// /datum/station_goal/dna_vault/proc/non_standard_plants_count  (code/modules/station_goals/dna_vault.dm:29)
rt.def("/datum/station_goal/dna_vault/proc/non_standard_plants_count", function non_standard_plants_count(f: Frame) {
	let _T: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [_T, S, $e];
	f.dot = 0;
	_T = null;
	rt.forList(f, 0, subtract(rt.call(f, P("/proc/typesof"), null, [T("/obj/item/seeds")]), T("/obj/item/seeds")));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (rt.gt(rt.initial(f, (S = live(_T)), "rarity"), 0)) {
			f.dot = rt.inc(live(f.dot), 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/station_goal/dna_vault/proc/get_report  (code/modules/station_goals/dna_vault.dm:35)
rt.def("/datum/station_goal/dna_vault/proc/get_report", function get_report(f: Frame) {
	return fmt("Our long term prediction systems indicate a 99% chance of system-wide cataclysm in the near future.\n\t We need you to construct a DNA Vault aboard your station.\n\n\t The DNA Vault needs to contain samples of:\n\t ＀ unique animal data\n\t ＀ unique non-standard plant data\n\t ＀ unique sapient humanoid DNA data\n\n\t Base vault parts are available for shipping via cargo.", [rt.sv(f, "animal_count"), rt.sv(f, "plant_count"), rt.sv(f, "human_count")]);
});

// /datum/station_goal/dna_vault/proc/on_report  (code/modules/station_goals/dna_vault.dm:47)
rt.def("/datum/station_goal/dna_vault/proc/on_report", function on_report(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	rt.setFv(f, "special_enabled", (_P = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), T("/datum/supply_pack/misc/dna_vault"))), 1);
	rt.setFv(f, "special_enabled", (_P = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), T("/datum/supply_pack/misc/dna_probes"))), 1);
	return f.dot;
});

// /datum/station_goal/dna_vault/proc/check_completion  (code/modules/station_goals/dna_vault.dm:54)
rt.def("/datum/station_goal/dna_vault/proc/check_completion", function check_completion(f: Frame) {
	let V: Value = null;
	let $e: any;
	f.vars = () => [V, $e];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 1;
	}
	V = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/dna_vault"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (((rt.ge(rt.getLen(f, rt.fv(f, "animals", live(V))), rt.sv(f, "animal_count")) && rt.ge(rt.getLen(f, rt.fv(f, "plants", live(V))), rt.sv(f, "plant_count"))) && rt.ge(rt.getLen(f, rt.fv(f, "dna", live(V))), rt.sv(f, "human_count")))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

rt.type(9430, "/obj/item/device/dna_probe", "/obj/item/device", {
	animals: null,
	plants: null,
	dna: null,
	flags: 4,
	name: "DNA Sampler",
	desc: "Can be used to take chemical and genetic samples of pretty much anything.",
	icon: rt.rsc("icons/obj/syringe.dmi"),
	item_state: "hypo",
	icon_state: "hypo",
});

// /obj/item/device/dna_probe/proc/<init>  (code/modules/station_goals/dna_vault.dm:69)
rt.def("/obj/item/device/dna_probe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "animals", rt.list());
	$0 = $0;
	rt.setSv(f, "plants", rt.list());
	$0 = $0;
	rt.setSv(f, "dna", rt.list());
	return f.dot;
});

// /obj/item/device/dna_probe/proc/clear_data  (code/modules/station_goals/dna_vault.dm:74)
rt.def("/obj/item/device/dna_probe/proc/clear_data", function clear_data(f: Frame) {
	rt.setSv(f, "animals", rt.list());
	rt.setSv(f, "plants", rt.list());
	rt.setSv(f, "dna", rt.list());
	return f.dot;
});

// /obj/item/device/dna_probe/proc/afterattack  (code/modules/station_goals/dna_vault.dm:79)
rt.def("/obj/item/device/dna_probe/proc/afterattack", function afterattack(f: Frame) {
	let H: Value = null, A: Value = null;
	f.vars = () => [H, A];
	rt.callSuper(f, [], rt.Args.Same);
	if ((!truthy(live(f.args[2])) || !truthy(live(f.args[0])))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/machinery/hydroponics")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "myseed", (H = live(f.args[0]))))) {
			return live(f.dot);
		}
		if (!truthy(rt.fv(f, "harvest", live(H)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span clas='warning'>Plant needs to be ready to harvest to perform full data scan.</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.index(rt.sv(f, "plants"), rt.gv(f, "type", rt.fv(f, "myseed", live(H)))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Plant data already present in local storage.<span>"]);
			return live(f.dot);
		}
		rt.setAt(rt.sv(f, "plants"), rt.gv(f, "type", rt.fv(f, "myseed", live(H))), 1);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Plant data added to local storage.<span>"]);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal")) ? 1 : 0)) || truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.gl("non_simple_animals")])))) {
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "healable", (A = live(f.args[0]))))) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>No compatible DNA detected</span>"]);
				return live(f.dot);
			}
		}
		if (truthy(rt.index(rt.sv(f, "animals"), rt.fv(f, "type", live(f.args[0]))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Animal data already present in local storage.<span>"]);
			return live(f.dot);
		}
		rt.setAt(rt.sv(f, "animals"), rt.fv(f, "type", live(f.args[0])), 1);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Animal data added to local storage.<span>"]);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	H = live(f.args[0]);
	if (truthy(rt.index(rt.sv(f, "dna"), rt.gv(f, "uni_identity", rt.fv(f, "dna", live(H)))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Humanoid data already present in local storage.<span>"]);
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "dna"), rt.gv(f, "uni_identity", rt.fv(f, "dna", live(H))), 1);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Humanoid data added to local storage.<span>"]);
	return f.dot;
}, false, { args: ["target", "user", "proximity"] });

rt.type(6788, "/obj/item/weapon/circuitboard/machine/dna_vault", "/obj/item/weapon/circuitboard/machine", {
	name: "DNA Vault (Machine Board)",
	build_path: rt.typePath("/obj/machinery/dna_vault"),
	origin_tech: "engineering=2;combat=2;bluespace=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/dna_vault/proc/<init>  (code/modules/station_goals/dna_vault.dm:124)
rt.def("/obj/item/weapon/circuitboard/machine/dna_vault/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor/super"), 5, T("/obj/item/weapon/stock_parts/manipulator/pico"), 5, T("/obj/item/stack/cable_coil"), 2]));
	return f.dot;
});

rt.type(10995, "/obj/machinery/dna_vault", "/obj/machinery", {
	animals_max: 100,
	plants_max: 100,
	dna_max: 100,
	animals: null,
	plants: null,
	dna: null,
	completed: 0,
	power_lottery: null,
	fillers: null,
	anchored: 1,
	idle_power_usage: 5000,
	light_range: 1,
	name: "DNA Vault",
	desc: "Break glass in case of apocalypse.",
	icon: rt.rsc("icons/obj/machines/dna_vault.dmi"),
	icon_state: "vault",
	density: 1,
	pixel_x: -32,
	pixel_y: -64,
});

// /obj/machinery/dna_vault/proc/<init>  (code/modules/station_goals/dna_vault.dm:145)
rt.def("/obj/machinery/dna_vault/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "animals", rt.list());
	$0 = $0;
	rt.setSv(f, "plants", rt.list());
	$0 = $0;
	rt.setSv(f, "dna", rt.list());
	$0 = $0;
	rt.setSv(f, "power_lottery", rt.list());
	$0 = $0;
	rt.setSv(f, "fillers", rt.list());
	return f.dot;
});

// /obj/machinery/dna_vault/proc/Initialize  (code/modules/station_goals/dna_vault.dm:156)  may sleep
rt.def("/obj/machinery/dna_vault/proc/Initialize", function* Initialize(f: Frame) {
	let occupied: Value = null, direct: Value = null, _T: Value = null, F: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [occupied, direct, _T, F, G, $e];
	occupied = rt.list();
	direct = null;
	rt.forList(f, 0, rt.list(4, 8, 6, 10));
	while (($e = rt.next(f, 0)) !== undefined) {
		direct = $e;
		occupied = rt.modify(live(occupied), rt.getStep(f, live(f.src), live(direct)), add);
	}
	rt.endFor(f, 0);
	occupied = rt.modify(live(occupied), rt.locate(add(rt.sv(f, "x"), 1), subtract(rt.sv(f, "y"), 2), rt.sv(f, "z")), add);
	occupied = rt.modify(live(occupied), rt.locate(subtract(rt.sv(f, "x"), 1), subtract(rt.sv(f, "y"), 2), rt.sv(f, "z")), add);
	_T = null;
	rt.forList(f, 0, live(occupied));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.setFv(f, "parent", (F = (yield* g.new_(f, T("/obj/structure/filler"), [live(_T)]))), live(f.src));
		rt.modSrcVar(f, "fillers", live(F), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.fv(f, "mode", rt.gl("SSticker")))) {
		G = null;
		rt.forList(f, 0, rt.gv(f, "station_goals", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/station_goal/dna_vault"));
		if (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			rt.setSv(f, "animals_max", rt.fv(f, "animal_count", live(G)));
			rt.setSv(f, "plants_max", rt.fv(f, "plant_count", live(G)));
			rt.setSv(f, "dna_max", rt.fv(f, "human_count", live(G)));
		}
		rt.endFor(f, 0);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/dna_vault/proc/Destroy  (code/modules/station_goals/dna_vault.dm:176)  may sleep
rt.def("/obj/machinery/dna_vault/proc/Destroy", function* Destroy(f: Frame) {
	let V: Value = null, filler: Value = null;
	let $e: any;
	f.vars = () => [V, filler, $e];
	V = null;
	rt.forList(f, 0, rt.sv(f, "fillers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		rt.setFv(f, "parent", (filler = live(V)), null);
		yield* g.call(f, P("/proc/qdel"), null, [live(filler)]);
	}
	rt.endFor(f, 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/dna_vault/proc/ui_interact  (code/modules/station_goals/dna_vault.dm:184)  may sleep
rt.def("/obj/machinery/dna_vault/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("physical_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.srcCall(f, "roll_powers", live(user));
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "dna_vault", rt.sv(f, "name"), 350, 400, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/dna_vault/proc/roll_powers  (code/modules/station_goals/dna_vault.dm:192)
rt.def("/obj/machinery/dna_vault/proc/roll_powers", function roll_powers(f: Frame, user: Value) {
	let L: Value = null, possible_powers: Value = null;
	f.vars = () => [L, possible_powers];
	if (truthy((rt.isIn(f, live(user), rt.sv(f, "power_lottery")) ? 1 : 0))) {
		return live(f.dot);
	}
	L = rt.list();
	L = rt.modify(live(L), rt.call(f, P("/proc/pick_n_take"), null, [(possible_powers = rt.list("Toxin Adaptation", "Lung Enhancement", "Thermal Regulation", "Neural Repathing", "Bone Reinforcement", "Leg Muscle Stimulus", "Arm Muscle Stimulus"))]), add);
	L = rt.modify(live(L), rt.call(f, P("/proc/pick_n_take"), null, [live(possible_powers)]), add);
	rt.setAt(rt.sv(f, "power_lottery"), live(user), live(L));
	return f.dot;
});

// /obj/machinery/dna_vault/proc/ui_data  (code/modules/station_goals/dna_vault.dm:201)
rt.def("/obj/machinery/dna_vault/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, L: Value = null;
	f.vars = () => [data, L];
	rt.setAt((data = rt.list()), "plants", rt.len(f, rt.sv(f, "plants")));
	rt.setAt(live(data), "plants_max", rt.sv(f, "plants_max"));
	rt.setAt(live(data), "animals", rt.len(f, rt.sv(f, "animals")));
	rt.setAt(live(data), "animals_max", rt.sv(f, "animals_max"));
	rt.setAt(live(data), "dna", rt.len(f, rt.sv(f, "dna")));
	rt.setAt(live(data), "dna_max", rt.sv(f, "dna_max"));
	rt.setAt(live(data), "completed", rt.sv(f, "completed"));
	rt.setAt(live(data), "used", 1);
	rt.setAt(live(data), "choiceA", "");
	rt.setAt(live(data), "choiceB", "");
	if ((truthy(live(user)) && truthy(rt.sv(f, "completed")))) {
		if ((truthy((L = rt.index(rt.sv(f, "power_lottery"), live(user)))) && truthy(rt.len(f, live(L))))) {
			rt.setAt(live(data), "used", 0);
			rt.setAt(live(data), "choiceA", rt.index(live(L), 1));
			rt.setAt(live(data), "choiceB", rt.index(live(L), 2));
		}
	}
	return live(data);
});

// /obj/machinery/dna_vault/proc/ui_act  (code/modules/station_goals/dna_vault.dm:221)  may sleep
rt.def("/obj/machinery/dna_vault/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "gene") {
		yield* g.srcCall(f, "upgrade", live(f.usr), rt.at(live(f.args[1]), "choice"));
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/dna_vault/proc/check_goal  (code/modules/station_goals/dna_vault.dm:229)
rt.def("/obj/machinery/dna_vault/proc/check_goal", function check_goal(f: Frame) {
	if (!((rt.ge(rt.len(f, rt.sv(f, "plants")), rt.sv(f, "plants_max")) && rt.ge(rt.len(f, rt.sv(f, "animals")), rt.sv(f, "animals_max"))) && rt.ge(rt.len(f, rt.sv(f, "dna")), rt.sv(f, "dna_max")))) return f.dot;
	rt.setSv(f, "completed", 1);
	return f.dot;
});

// /obj/machinery/dna_vault/proc/attackby  (code/modules/station_goals/dna_vault.dm:234)  may sleep
rt.def("/obj/machinery/dna_vault/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null, uploaded: Value = null, plant: Value = null, animal: Value = null, ui: Value = null;
	let $e: any;
	f.vars = () => [_P, uploaded, plant, animal, ui, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/dna_probe")) ? 1 : 0))) {
		_P = live(f.args[0]);
		uploaded = 0;
		plant = null;
		rt.forList(f, 0, rt.fv(f, "plants", live(_P)));
		while (($e = rt.next(f, 0)) !== undefined) {
			plant = $e;
			if (!truthy(rt.index(rt.sv(f, "plants"), live(plant)))) {
				uploaded = rt.inc(live(uploaded), 1);
				rt.setAt(rt.sv(f, "plants"), live(plant), 1);
			}
		}
		rt.endFor(f, 0);
		animal = null;
		rt.forList(f, 0, rt.fv(f, "animals", live(_P)));
		while (($e = rt.next(f, 0)) !== undefined) {
			animal = $e;
			if (!truthy(rt.index(rt.sv(f, "animals"), live(animal)))) {
				uploaded = rt.inc(live(uploaded), 1);
				rt.setAt(rt.sv(f, "animals"), live(animal), 1);
			}
		}
		rt.endFor(f, 0);
		ui = null;
		rt.forList(f, 0, rt.fv(f, "dna", live(_P)));
		while (($e = rt.next(f, 0)) !== undefined) {
			ui = $e;
			if (!truthy(rt.index(rt.sv(f, "dna"), live(ui)))) {
				uploaded = rt.inc(live(uploaded), 1);
				rt.setAt(rt.sv(f, "dna"), live(ui), 1);
			}
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "check_goal");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ new datapoints uploaded.</span>", [live(uploaded)])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/dna_vault/proc/upgrade  (code/modules/station_goals/dna_vault.dm:257)
rt.def("/obj/machinery/dna_vault/proc/upgrade", function upgrade(f: Frame, H: Value, upgrade_type: Value) {
	let S: Value = null, L: Value = null;
	let $0: any;
	f.vars = () => [S, L, $0];
	if (!truthy((rt.isIn(f, live(upgrade_type), rt.index(rt.sv(f, "power_lottery"), live(H))) ? 1 : 0))) {
		return live(f.dot);
	}
	S = rt.gv(f, "species", rt.fv(f, "dna", live(H)));
	$0 = live(upgrade_type);
	if ($0 === "Toxin Adaptation") {
		rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel resistant to airborne toxins.</span>"]);
		if (truthy(rt.locateIn(f, T("/obj/item/organ/lungs"), rt.fv(f, "internal_organs", live(H))))) {
			rt.setFv(f, "tox_breath_dam_min", (L = rt.index(rt.fv(f, "internal_organs_slot", live(H)), "lungs")), 0);
			rt.setFv(f, "tox_breath_dam_max", live(L), 0);
		}
		(rt.modField(f, live(S), "species_traits", 14, rt.bitOr));
	} else if ($0 === "Lung Enhancement") {
		rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Your lungs feel great.</span>"]);
		(rt.modField(f, live(S), "species_traits", 10, rt.bitOr));
	} else if ($0 === "Thermal Regulation") {
		rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel fireproof.</span>"]);
		rt.setFv(f, "burnmod", live(S), 0.5);
		rt.setFv(f, "heatmod", live(S), 0);
	} else if ($0 === "Neural Repathing") {
		rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Nothing can keep you down for long.</span>"]);
		rt.setFv(f, "stunmod", live(S), 0.5);
	} else if ($0 === "Bone Reinforcement") {
		rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel tough.</span>"]);
		rt.setFv(f, "armor", live(S), 30);
	} else if ($0 === "Leg Muscle Stimulus") {
		rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Your legs feel faster.</span>"]);
		rt.setFv(f, "speedmod", live(S), -1);
	} else if ($0 === "Arm Muscle Stimulus") {
		rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Your arms move as fast as lightning.</span>"]);
		rt.setFv(f, "next_move_modifier", live(H), 0.5);
	}
	rt.setAt(rt.sv(f, "power_lottery"), live(H), rt.list());
	return f.dot;
});
