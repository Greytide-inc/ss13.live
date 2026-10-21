// From code/game/mecha/mecha.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12102, "/obj/mecha", "/obj", {
	can_move: 1,
	occupant: null,
	step_in: 10,
	dir_in: 2,
	step_energy_drain: 10,
	melee_energy_drain: 15,
	deflect_chance: 10,
	facing_modifiers: null,
	cell: null,
	state: 0,
	last_message: 0,
	add_req_access: 1,
	maint_access: 0,
	dna_lock: null,
	proc_res: null,
	spark_system: null,
	lights: 0,
	lights_power: 6,
	last_user_hud: 1,
	bumpsmash: 0,
	use_internal_tank: 0,
	internal_tank_valve: 101.325,
	internal_tank: null,
	cabin_air: null,
	connected_port: null,
	radio: null,
	trackers: null,
	max_temperature: 25000,
	internal_damage_threshold: 50,
	internal_damage: 0,
	operation_req_access: null,
	wreckage: null,
	selected: null,
	max_equip: 3,
	events: null,
	stepsound: rt.rsc("sound/mecha/mechstep.ogg"),
	turnsound: rt.rsc("sound/mecha/mechturn.ogg"),
	melee_cooldown: 10,
	melee_can_hit: 1,
	eject_action: null,
	internals_action: null,
	cycle_action: null,
	lights_action: null,
	stats_action: null,
	thrusters_action: null,
	defense_action: null,
	overload_action: null,
	smoke_system: null,
	smoke_action: null,
	zoom_action: null,
	switch_damtype_action: null,
	phasing_action: null,
	strafing_action: null,
	thrusters_active: 0,
	defence_mode: 0,
	defence_mode_deflect_chance: 35,
	leg_overload_mode: 0,
	leg_overload_coeff: 100,
	zoom_mode: 0,
	smoke: 5,
	smoke_ready: 1,
	smoke_cooldown: 100,
	phasing: 0,
	phasing_energy_drain: 200,
	phase_state: "",
	strafe: 0,
	nextsmash: 0,
	smashcooldown: 3,
	occupant_sight_flags: 0,
	log: null,
	internals_req_access: null,
	equipment: null,
	anchored: 1,
	flags: 16,
	hud_possible: null,
	name: "mecha",
	desc: "Exosuit",
	icon: rt.rsc("icons/mecha/mecha.dmi"),
	density: 1,
	opacity: 1,
	resistance_flags: 34,
	layer: 3.7,
	infra_luminosity: 15,
	force: 5,
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
});

// /obj/mecha/proc/<init>  (code/game/mecha/mecha.dm:37)  may sleep
rt.def("/obj/mecha/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "facing_modifiers", rt.alist(f, [1, 1.5, 2, 1, 3, 0.5]));
	$0 = $0;
	rt.setSv(f, "proc_res", rt.list());
	$0 = $0;
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	$0 = $0;
	rt.setSv(f, "trackers", rt.list());
	$0 = $0;
	rt.setSv(f, "operation_req_access", rt.list());
	$0 = $0;
	rt.setSv(f, "eject_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_eject"), [])));
	$0 = $0;
	rt.setSv(f, "internals_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_toggle_internals"), [])));
	$0 = $0;
	rt.setSv(f, "cycle_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_cycle_equip"), [])));
	$0 = $0;
	rt.setSv(f, "lights_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_toggle_lights"), [])));
	$0 = $0;
	rt.setSv(f, "stats_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_view_stats"), [])));
	$0 = $0;
	rt.setSv(f, "thrusters_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_toggle_thrusters"), [])));
	$0 = $0;
	rt.setSv(f, "defense_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_defence_mode"), [])));
	$0 = $0;
	rt.setSv(f, "overload_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_overload_mode"), [])));
	$0 = $0;
	rt.setSv(f, "smoke_system", (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), [])));
	$0 = $0;
	rt.setSv(f, "smoke_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_smoke"), [])));
	$0 = $0;
	rt.setSv(f, "zoom_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_zoom"), [])));
	$0 = $0;
	rt.setSv(f, "switch_damtype_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_switch_damtype"), [])));
	$0 = $0;
	rt.setSv(f, "phasing_action", (yield* g.new_(f, T("/datum/action/innate/mecha/mech_toggle_phasing"), [])));
	$0 = $0;
	rt.setSv(f, "strafing_action", (yield* g.new_(f, T("/datum/action/innate/mecha/strafe"), [])));
	rt.setSv(f, "hud_possible", rt.list("8", "10", "11", "13"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 10, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "log", (yield* g.new_(f, T("/list"), [])));
	rt.setSv(f, "internals_req_access", rt.list(10, 29));
	$0 = $0;
	rt.setSv(f, "equipment", (yield* g.new_(f, T("/list"), [])));
	return f.dot;
}, true);

// /obj/mecha/proc/Initialize  (code/game/mecha/mecha.dm:123)  may sleep
rt.def("/obj/mecha/proc/Initialize", function* Initialize(f: Frame) {
	let diag_hud: Value = null;
	f.vars = () => [diag_hud];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "events", (yield* g.new_(f, T("/datum/events"), [])));
	rt.modSrcVar(f, "icon_state", "-open", add);
	yield* g.srcCall(f, "add_radio");
	yield* g.srcCall(f, "add_cabin");
	yield* g.srcCall(f, "add_airtank");
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [2, 0, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "spark_system"), "attach", [live(f.src)]);
	yield* g.callName(f, rt.sv(f, "smoke_system"), "set_up", [3, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "smoke_system"), "attach", [live(f.src)]);
	yield* g.srcCall(f, "add_cell");
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	yield* g.srcCall(f, "log_message", fmt("＀ created.", [rt.fv(f, "name", live(f.src))]));
	rt.modGl("mechas_list", live(f.src), add);
	yield* g.srcCall(f, "prepare_huds");
	yield* g.callName(f, (diag_hud = rt.index(rt.gl("huds"), 5)), "add_to_hud", [live(f.src)]);
	yield* g.srcCall(f, "diag_hud_set_mechhealth");
	yield* g.srcCall(f, "diag_hud_set_mechcell");
	yield* g.srcCall(f, "diag_hud_set_mechstat");
	yield* g.srcCall(f, "diag_hud_set_mechtracking");
	return f.dot;
}, true);

// /obj/mecha/proc/Destroy  (code/game/mecha/mecha.dm:150)  may sleep
rt.def("/obj/mecha/proc/Destroy", function* Destroy(f: Frame) {
	let AI: Value = null, M: Value = null, WR: Value = null, E: Value = null, E_1: Value = null;
	let $e: any;
	f.vars = () => [AI, M, WR, E, E_1, $e];
	yield* g.srcCall(f, "go_out");
	AI = null;
	M = null;
	rt.forList(f, 0, live(f.src), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			rt.setSv(f, "occupant", null);
			AI = live(M);
		} else {
			yield* g.callName(f, live(M), "forceMove", [rt.sv(f, "loc")]);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "wreckage"))) {
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			yield* g.call(f, P("/proc/explosion"), null, [rt.getStep(f, live(f.src), 0), 0, 0, 1, 3]);
		}
		WR = (yield* g.new_(f, rt.sv(f, "wreckage"), [rt.sv(f, "loc"), live(AI)]));
		E = null;
		rt.forList(f, 0, rt.sv(f, "equipment"), T("/obj/item/mecha_parts/mecha_equipment"));
		while (($e = rt.next(f, 0)) !== undefined) {
			E = $e;
			if ((truthy(rt.fv(f, "salvageable", live(E))) && truthy(rt.op(f, "Prob", [], [30])))) {
				rt.modField(f, live(WR), "crowbar_salvage", live(E), add);
				yield* g.callName(f, live(E), "detach", [live(WR)]);
				rt.setFv(f, "equip_ready", live(E), 1);
			} else {
				yield* g.callName(f, live(E), "detach", [rt.sv(f, "loc")]);
				yield* g.call(f, P("/proc/qdel"), null, [live(E)]);
			}
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "cell"))) {
			rt.modField(f, live(WR), "crowbar_salvage", rt.sv(f, "cell"), add);
			yield* g.callName(f, rt.sv(f, "cell"), "forceMove", [live(WR)]);
			rt.setFv(f, "charge", rt.sv(f, "cell"), (yield* g.call(f, P("/proc/rand"), null, [0, rt.fv(f, "charge", rt.sv(f, "cell"))])));
		}
		if (truthy(rt.sv(f, "internal_tank"))) {
			rt.modField(f, live(WR), "crowbar_salvage", rt.sv(f, "internal_tank"), add);
			yield* g.callName(f, rt.sv(f, "internal_tank"), "forceMove", [live(WR)]);
		}
	} else {
		E_1 = null;
		rt.forList(f, 0, rt.sv(f, "equipment"), T("/obj/item/mecha_parts/mecha_equipment"));
		while (($e = rt.next(f, 0)) !== undefined) {
			E_1 = $e;
			yield* g.callName(f, live(E_1), "detach", [rt.sv(f, "loc")]);
			yield* g.call(f, P("/proc/qdel"), null, [live(E_1)]);
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "cell"))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cell")]);
		}
		if (truthy(rt.sv(f, "internal_tank"))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "internal_tank")]);
		}
		if (truthy(live(AI))) {
			yield* g.callName(f, live(AI), "gib", []);
		}
	}
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.callName(f, rt.gl("poi_list"), "Remove", [live(f.src)]);
	yield* g.callName(f, rt.sv(f, "equipment"), "Cut", []);
	rt.setSv(f, "cell", null);
	rt.setSv(f, "internal_tank", null);
	if (truthy(rt.sv(f, "loc"))) {
		yield* g.callName(f, rt.sv(f, "loc"), "assume_air", [rt.sv(f, "cabin_air")]);
		yield* g.srcCall(f, "air_update_turf");
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cabin_air")]);
	}
	rt.setSv(f, "cabin_air", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "spark_system")]);
	rt.setSv(f, "spark_system", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "smoke_system")]);
	rt.setSv(f, "smoke_system", null);
	(rt.modGl("mechas_list", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/mecha/proc/add_airtank  (code/game/mecha/mecha.dm:211)  may sleep
rt.def("/obj/mecha/proc/add_airtank", function* add_airtank(f: Frame) {
	rt.setSv(f, "internal_tank", (yield* g.new_(f, T("/obj/machinery/portable_atmospherics/canister/air"), [live(f.src)])));
	return rt.sv(f, "internal_tank");
}, true);

// /obj/mecha/proc/add_cell  (code/game/mecha/mecha.dm:216)  may sleep
rt.def("/obj/mecha/proc/add_cell", function* add_cell(f: Frame, C: Value) {
	f.vars = () => [C];
	if (live(C) === null) {
		C = null;
	}
	if (truthy(live(C))) {
		yield* g.callName(f, live(C), "forceMove", [live(f.src)]);
		rt.setSv(f, "cell", live(C));
		return live(f.dot);
	}
	rt.setSv(f, "cell", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell"), [live(f.src)])));
	rt.setFv(f, "charge", rt.sv(f, "cell"), 15000);
	rt.setFv(f, "maxcharge", rt.sv(f, "cell"), 15000);
	return f.dot;
}, true);

// /obj/mecha/proc/add_cabin  (code/game/mecha/mecha.dm:224)
rt.def("/obj/mecha/proc/add_cabin", function add_cabin(f: Frame) {
	rt.setSv(f, "cabin_air", rt.new_(f, T("/datum/gas_mixture"), []));
	rt.setFv(f, "temperature", rt.sv(f, "cabin_air"), 293.1499938964844);
	rt.setFv(f, "volume", rt.sv(f, "cabin_air"), 200);
	rt.callName(f, rt.sv(f, "cabin_air"), "assert_gases", ["o2", "n2"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "cabin_air")), "o2"), 1, divide(multiply(0.20999999344348907, rt.fv(f, "volume", rt.sv(f, "cabin_air"))), multiply(8.3100004196167, rt.fv(f, "temperature", rt.sv(f, "cabin_air")))));
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "cabin_air")), "n2"), 1, divide(multiply(0.7900000214576721, rt.fv(f, "volume", rt.sv(f, "cabin_air"))), multiply(8.3100004196167, rt.fv(f, "temperature", rt.sv(f, "cabin_air")))));
	return rt.sv(f, "cabin_air");
});

// /obj/mecha/proc/add_radio  (code/game/mecha/mecha.dm:233)  may sleep
rt.def("/obj/mecha/proc/add_radio", function* add_radio(f: Frame) {
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/device/radio/mech"), [live(f.src)])));
	rt.setFv(f, "name", rt.sv(f, "radio"), fmt("＀ radio", [live(f.src)]));
	rt.setFv(f, "icon", rt.sv(f, "radio"), rt.sv(f, "icon"));
	rt.setFv(f, "icon_state", rt.sv(f, "radio"), rt.sv(f, "icon_state"));
	rt.setFv(f, "subspace_transmission", rt.sv(f, "radio"), 1);
	return f.dot;
}, true);

// /obj/mecha/proc/can_use  (code/game/mecha/mecha.dm:240)
rt.def("/obj/mecha/proc/can_use", function can_use(f: Frame, user: Value) {
	if (!isEqual(live(user), rt.sv(f, "occupant"))) {
		return 0;
	}
	if ((truthy(live(user)) && truthy(rt.call(f, P("/proc/ismob"), null, [live(user)])))) {
		if (!truthy(rt.callName(f, live(user), "incapacitated", []))) {
			return 1;
		}
	}
	return 0;
});

// /obj/mecha/proc/examine  (code/game/mecha/mecha.dm:250)
rt.def("/obj/mecha/proc/examine", function examine(f: Frame) {
	let integrity: Value = null, ME: Value = null;
	let $0: any, $e: any;
	f.vars = () => [integrity, ME, $0, $e];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = (integrity = divide(multiply(rt.sv(f, "obj_integrity"), 100), rt.sv(f, "max_integrity")));
	if (rt.inRange($0, 85, 100)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's fully intact."]);
	} else if (rt.inRange($0, 65, 85)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's slightly damaged."]);
	} else if (rt.inRange($0, 45, 65)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's badly damaged."]);
	} else if (rt.inRange($0, 25, 45)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's heavily damaged."]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's falling apart."]);
	}
	if (!(truthy(rt.sv(f, "equipment")) && truthy(rt.len(f, rt.sv(f, "equipment"))))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's equipped with:"]);
	ME = null;
	rt.forList(f, 0, rt.sv(f, "equipment"), T("/obj/item/mecha_parts/mecha_equipment"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ME = $e;
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ ＀", [rt.call(f, P("/proc/bicon"), null, [live(ME)]), live(ME)])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["user"] });

// /obj/mecha/proc/process  (code/game/mecha/mecha.dm:273)  may sleep
rt.def("/obj/mecha/proc/process", function* process(f: Frame) {
	let internal_temp_regulation: Value = null, int_tank_air: Value = null, leaked_gas: Value = null, delta: Value = null, tank_air: Value = null, release_pressure: Value = null, cabin_pressure: Value = null, pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null, t_air: Value = null, removed_7: Value = null, cellcharge: Value = null, integrity: Value = null, actual_loc: Value = null, M: Value = null, lights_energy_drain: Value = null;
	let $0: any;
	f.vars = () => [internal_temp_regulation, int_tank_air, leaked_gas, delta, tank_air, release_pressure, cabin_pressure, pressure_delta, transfer_moles, removed, t_air, removed_7, cellcharge, integrity, actual_loc, M, lights_energy_drain, $0];
	internal_temp_regulation = 1;
	if (truthy(rt.sv(f, "internal_damage"))) {
		if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 1))) {
			if ((!truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 2)) && truthy(rt.op(f, "Prob", [], [5])))) {
				yield* g.srcCall(f, "clearInternalDamage", 1);
			}
			if (truthy(rt.sv(f, "internal_tank"))) {
				if ((rt.gt((yield* g.callName(f, (int_tank_air = (yield* g.callName(f, rt.sv(f, "internal_tank"), "return_air", []))), "return_pressure", [])), rt.fv(f, "maximum_pressure", rt.sv(f, "internal_tank"))) && !truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 8)))) {
					yield* g.srcCall(f, "setInternalDamage", 8);
				}
				if ((truthy(live(int_tank_air)) && rt.gt((yield* g.callName(f, live(int_tank_air), "return_volume", [])), 0))) {
					rt.setFv(f, "temperature", live(int_tank_air), (yield* g.call(f, P("/proc/min"), null, [6273.14990234375, add(rt.fv(f, "temperature", live(int_tank_air)), (yield* g.call(f, P("/proc/rand"), null, [10, 15])))])));
				}
			}
			if ((truthy(rt.sv(f, "cabin_air")) && rt.gt((yield* g.callName(f, rt.sv(f, "cabin_air"), "return_volume", [])), 0))) {
				rt.setFv(f, "temperature", rt.sv(f, "cabin_air"), (yield* g.call(f, P("/proc/min"), null, [6273.14990234375, add((yield* g.callName(f, rt.sv(f, "cabin_air"), "return_temperature", [])), (yield* g.call(f, P("/proc/rand"), null, [10, 15])))])));
				if (rt.gt((yield* g.callName(f, rt.sv(f, "cabin_air"), "return_temperature", [])), divide(rt.sv(f, "max_temperature"), 2))) {
					yield* g.srcCall(f, "take_damage", divide(4, (yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "max_temperature"), (yield* g.callName(f, rt.sv(f, "cabin_air"), "return_temperature", []))), 0.10000000149011612]))), "fire", 0, 0);
				}
			}
		}
		if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 2))) {
			internal_temp_regulation = 0;
		}
		if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 8))) {
			if (truthy(rt.sv(f, "internal_tank"))) {
				int_tank_air = (yield* g.callName(f, rt.sv(f, "internal_tank"), "return_air", []));
				leaked_gas = (yield* g.callName(f, live(int_tank_air), "remove_ratio", [0.10000000149011612]));
				if (truthy(rt.sv(f, "loc"))) {
					yield* g.callName(f, rt.sv(f, "loc"), "assume_air", [live(leaked_gas)]);
					yield* g.srcCall(f, "air_update_turf");
				} else {
					yield* g.call(f, P("/proc/qdel"), null, [live(leaked_gas)]);
				}
			}
		}
		if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 4))) {
			if (truthy((yield* g.srcCall(f, "get_charge")))) {
				yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
				(rt.modField(f, rt.sv(f, "cell"), "charge", (yield* g.call(f, P("/proc/min"), null, [20, rt.fv(f, "charge", rt.sv(f, "cell"))])), subtract));
				(rt.modField(f, rt.sv(f, "cell"), "maxcharge", (yield* g.call(f, P("/proc/min"), null, [20, rt.fv(f, "maxcharge", rt.sv(f, "cell"))])), subtract));
			}
		}
	}
	if (truthy(live(internal_temp_regulation))) {
		if ((truthy(rt.sv(f, "cabin_air")) && rt.gt((yield* g.callName(f, rt.sv(f, "cabin_air"), "return_volume", [])), 0))) {
			delta = subtract(rt.fv(f, "temperature", rt.sv(f, "cabin_air")), 293.1499938964844);
			(rt.modField(f, rt.sv(f, "cabin_air"), "temperature", (yield* g.call(f, P("/proc/max"), null, [-10, (yield* g.call(f, P("/proc/min"), null, [10, (yield* g.call(f, P("/proc/round"), null, [divide(live(delta), 4), 0.10000000149011612]))]))])), subtract));
		}
	}
	if (truthy(rt.sv(f, "internal_tank"))) {
		tank_air = (yield* g.callName(f, rt.sv(f, "internal_tank"), "return_air", []));
		release_pressure = rt.sv(f, "internal_tank_valve");
		cabin_pressure = (yield* g.callName(f, rt.sv(f, "cabin_air"), "return_pressure", []));
		pressure_delta = (yield* g.call(f, P("/proc/min"), null, [subtract(live(release_pressure), live(cabin_pressure)), divide(subtract((yield* g.callName(f, live(tank_air), "return_pressure", [])), live(cabin_pressure)), 2)]));
		transfer_moles = 0;
		if (rt.gt(live(pressure_delta), 0)) {
			if (rt.gt((yield* g.callName(f, live(tank_air), "return_temperature", [])), 0)) {
				transfer_moles = divide(multiply(live(pressure_delta), (yield* g.callName(f, rt.sv(f, "cabin_air"), "return_volume", []))), multiply((yield* g.callName(f, rt.sv(f, "cabin_air"), "return_temperature", [])), 8.3100004196167));
				removed = (yield* g.callName(f, live(tank_air), "remove", [live(transfer_moles)]));
				yield* g.callName(f, rt.sv(f, "cabin_air"), "merge", [live(removed)]);
			}
		} else {
			if (rt.lt(live(pressure_delta), 0)) {
				t_air = (yield* g.srcCall(f, "return_air"));
				pressure_delta = subtract(live(cabin_pressure), live(release_pressure));
				if (truthy(live(t_air))) {
					pressure_delta = (yield* g.call(f, P("/proc/min"), null, [subtract(live(cabin_pressure), (yield* g.callName(f, live(t_air), "return_pressure", []))), live(pressure_delta)]));
				}
				if (rt.gt(live(pressure_delta), 0)) {
					transfer_moles = divide(multiply(live(pressure_delta), (yield* g.callName(f, rt.sv(f, "cabin_air"), "return_volume", []))), multiply((yield* g.callName(f, rt.sv(f, "cabin_air"), "return_temperature", [])), 8.3100004196167));
					removed_7 = (yield* g.callName(f, rt.sv(f, "cabin_air"), "remove", [live(transfer_moles)]));
					if (truthy(live(t_air))) {
						yield* g.callName(f, live(t_air), "merge", [live(removed_7)]);
					} else {
						yield* g.call(f, P("/proc/qdel"), null, [live(removed_7)]);
					}
				}
			}
		}
	}
	if (truthy(rt.sv(f, "occupant"))) {
		if (truthy(rt.sv(f, "cell"))) {
			$0 = (cellcharge = divide(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "maxcharge", rt.sv(f, "cell"))));
			if (rt.inRange($0, 0.75, 9.999999848243207e+30)) {
				yield* g.callName(f, rt.sv(f, "occupant"), "clear_alert", ["charge"]);
			} else if (rt.inRange($0, 0.5, 0.75)) {
				yield* g.callName(f, rt.sv(f, "occupant"), "throw_alert", ["charge", T("/obj/screen/alert/lowcell"), 1]);
			} else if (rt.inRange($0, 0.25, 0.5)) {
				yield* g.callName(f, rt.sv(f, "occupant"), "throw_alert", ["charge", T("/obj/screen/alert/lowcell"), 2]);
			} else if (rt.inRange($0, 0.009999999776482582, 0.25)) {
				yield* g.callName(f, rt.sv(f, "occupant"), "throw_alert", ["charge", T("/obj/screen/alert/lowcell"), 3]);
			} else {
				yield* g.callName(f, rt.sv(f, "occupant"), "throw_alert", ["charge", T("/obj/screen/alert/emptycell")]);
			}
		}
		$0 = (integrity = multiply(divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")), 100));
		if (rt.inRange($0, 30, 45)) {
			yield* g.callName(f, rt.sv(f, "occupant"), "throw_alert", ["mech damage", T("/obj/screen/alert/low_mech_integrity"), 1]);
		} else if (rt.inRange($0, 15, 35)) {
			yield* g.callName(f, rt.sv(f, "occupant"), "throw_alert", ["mech damage", T("/obj/screen/alert/low_mech_integrity"), 2]);
		} else if (rt.inRange($0, -9.999999848243207e+30, 15)) {
			yield* g.callName(f, rt.sv(f, "occupant"), "throw_alert", ["mech damage", T("/obj/screen/alert/low_mech_integrity"), 3]);
		} else {
			yield* g.callName(f, rt.sv(f, "occupant"), "clear_alert", ["mech damage"]);
		}
		if (truthy((rt.istype((actual_loc = rt.fv(f, "loc", rt.sv(f, "occupant"))), T("/obj/item/device/mmi")) ? 1 : 0))) {
			actual_loc = rt.gv(f, "mecha", (M = live(actual_loc)));
		}
		if (!isEqual(live(actual_loc), live(f.src))) {
			yield* g.callName(f, rt.sv(f, "occupant"), "clear_alert", ["charge"]);
			yield* g.callName(f, rt.sv(f, "occupant"), "clear_alert", ["mech damage"]);
			yield* g.callSrc(f, "RemoveActions", [null, rt.sv(f, "occupant"), "human_occupant", 1], rt.Args.Named);
			rt.setSv(f, "occupant", null);
		}
	}
	if (truthy(rt.sv(f, "lights"))) {
		yield* g.srcCall(f, "use_power", (lights_energy_drain = 2));
	}
	yield* g.srcCall(f, "diag_hud_set_mechhealth");
	yield* g.srcCall(f, "diag_hud_set_mechcell");
	yield* g.srcCall(f, "diag_hud_set_mechstat");
	yield* g.srcCall(f, "diag_hud_set_mechtracking");
	return f.dot;
}, true, { waitfor: false });

// /obj/mecha/proc/Hear  (code/game/mecha/mecha.dm:386)  may sleep
rt.def("/obj/mecha/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	f.vars = () => [message, speaker, message_language, raw_message, radio_freq, spans, message_mode];
	if (!isEqual(live(speaker), rt.sv(f, "occupant"))) return f.dot;
	if (!truthy(rt.fv(f, "broadcasting", rt.sv(f, "radio")))) return f.dot;
	yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(speaker), rt.sv(f, "text"), null, live(spans), live(message_language)]);
	return f.dot;
}, true);

// /obj/mecha/proc/click_action  (code/game/mecha/mecha.dm:397)  may sleep
rt.def("/obj/mecha/proc/click_action", function* click_action(f: Frame, target: Value, user: Value, params: Value) {
	let dir_to_target: Value = null;
	f.vars = () => [target, user, params, dir_to_target];
	if ((!truthy(rt.sv(f, "occupant")) || !isEqual(rt.sv(f, "occupant"), live(user)))) {
		return live(f.dot);
	}
	if (!truthy(rt.locateIn(f, T("/turf"), rt.list(live(target), rt.fv(f, "loc", live(target)))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "phasing"))) {
		yield* g.srcCall(f, "occupant_message", "Unable to interact with objects while phasing");
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(user), "incapacitated", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "state"))) {
		yield* g.srcCall(f, "occupant_message", "<span class='warning'>Maintenance protocols in effect.</span>");
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "get_charge")))) {
		return live(f.dot);
	}
	if (isEqual(live(f.src), live(target))) {
		return live(f.dot);
	}
	if ((truthy((dir_to_target = rt.getDir(f, live(f.src), live(target)))) && !truthy(rt.bitAnd(live(dir_to_target), rt.sv(f, "dir"))))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 16))) {
		if (!truthy((target = (yield* g.call(f, P("/proc/safepick"), null, [(yield* g.call(f, P("/proc/view"), null, [3, live(target)]))]))))) {
			return live(f.dot);
		}
	}
	if (!truthy((yield* g.callName(f, live(target), "Adjacent", [live(f.src)])))) {
		if ((truthy(rt.sv(f, "selected")) && truthy((yield* g.callName(f, rt.sv(f, "selected"), "is_ranged", []))))) {
			if (truthy((yield* g.callName(f, rt.sv(f, "selected"), "action", [live(target), live(params)])))) {
				yield* g.callName(f, rt.sv(f, "selected"), "start_cooldown", []);
			}
		}
	} else {
		if ((truthy(rt.sv(f, "selected")) && truthy((yield* g.callName(f, rt.sv(f, "selected"), "is_melee", []))))) {
			if (truthy((yield* g.callName(f, rt.sv(f, "selected"), "action", [live(target), live(params)])))) {
				yield* g.callName(f, rt.sv(f, "selected"), "start_cooldown", []);
			}
		} else {
			if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 16))) {
				target = (yield* g.call(f, P("/proc/safepick"), null, [(yield* g.call(f, P("/proc/oview"), null, [1, live(f.src)]))]));
			}
			if ((!truthy(rt.sv(f, "melee_can_hit")) || !truthy((rt.istype(live(target), T("/atom")) ? 1 : 0)))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(target), "mech_melee_attack", [live(f.src)]);
			rt.setSv(f, "melee_can_hit", 0);
			rt.spawnTail(f, rt.sv(f, "melee_cooldown"), "/obj/mecha/proc/click_action: spawn at game/mecha/mecha.dm:434", target, user, params, dir_to_target);
		}
	}
	return f.dot;
}, true);

// a spawn(rt.srcVarI(f, $ic[211])) body of /obj/mecha/proc/click_action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/mecha/proc/click_action: spawn at game/mecha/mecha.dm:434", function* (f: Frame, target: Value, user: Value, params: Value, dir_to_target: Value) {
	f.vars = () => [target, user, params, dir_to_target];
	rt.setSv(f, "melee_can_hit", 1);
	return null;
});

// /obj/mecha/proc/Move  (code/game/mecha/mecha.dm:447)  may sleep
rt.def("/obj/mecha/proc/Move", function* Move(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.callName(f, rt.sv(f, "events"), "fireEvent", ["onMove", rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true, { args: ["newloc", "direct"] });

// /obj/mecha/proc/Process_Spacemove  (code/game/mecha/mecha.dm:452)  may sleep
rt.def("/obj/mecha/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	let backup: Value = null;
	f.vars = () => [backup];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return 1;
	}
	if (((truthy(rt.sv(f, "thrusters_active")) && truthy(live(f.args[0]))) && truthy((yield* g.srcCall(f, "use_power", rt.sv(f, "step_energy_drain")))))) {
		return 1;
	}
	if (!truthy((backup = (yield* g.srcCall(f, "get_spacemove_backup"))))) return f.dot;
	if (((truthy((rt.istype(live(backup), T("/atom/movable")) ? 1 : 0)) && truthy(live(f.args[0]))) && !truthy(rt.fv(f, "anchored", live(backup))))) {
		if (truthy((yield* g.callName(f, live(backup), "newtonian_move", [(yield* g.call(f, P("/proc/turn"), null, [live(f.args[0]), 180]))])))) {
			if (truthy(rt.sv(f, "occupant"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupant"), fmt("<span class='info'>You push off of ＀ to propel yourself.</span>", [live(backup)])]);
			}
		}
	}
	return 1;
}, true, { args: ["movement_dir"] });

// /obj/mecha/proc/relaymove  (code/game/mecha/mecha.dm:467)  may sleep
rt.def("/obj/mecha/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	f.vars = () => [user, direction];
	if (!truthy(live(direction))) {
		return live(f.dot);
	}
	if (!isEqual(live(user), rt.sv(f, "occupant"))) {
		yield* g.callName(f, live(user), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You climb out from ＀.</span>", [live(f.src)])]);
		return 0;
	}
	if (truthy(rt.sv(f, "connected_port"))) {
		if (rt.gt(subtract(rt.worldTime(f), rt.sv(f, "last_message")), 20)) {
			yield* g.srcCall(f, "occupant_message", "<span class='warning'>Unable to move while connected to the air system port!</span>");
			rt.setSv(f, "last_message", rt.worldTime(f));
		}
		return 0;
	}
	if (truthy(rt.sv(f, "state"))) {
		yield* g.srcCall(f, "occupant_message", "<span class='danger'>Maintenance protocols in effect.</span>");
		return live(f.dot);
	}
	return (yield* g.srcCall(f, "domove", live(direction)));
}, true);

// /obj/mecha/proc/domove  (code/game/mecha/mecha.dm:484)  may sleep
rt.def("/obj/mecha/proc/domove", function* domove(f: Frame, direction: Value) {
	let move_result: Value = null;
	f.vars = () => [direction, move_result];
	if (!truthy(rt.sv(f, "can_move"))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "Process_Spacemove", live(direction))))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "has_charge", rt.sv(f, "step_energy_drain"))))) {
		return 0;
	}
	if (truthy(rt.sv(f, "defence_mode"))) {
		if (rt.gt(subtract(rt.worldTime(f), rt.sv(f, "last_message")), 20)) {
			yield* g.srcCall(f, "occupant_message", "<span class='danger'>Unable to move while in defence mode</span>");
			rt.setSv(f, "last_message", rt.worldTime(f));
		}
		return 0;
	}
	if (truthy(rt.sv(f, "zoom_mode"))) {
		if (rt.gt(subtract(rt.worldTime(f), rt.sv(f, "last_message")), 20)) {
			yield* g.srcCall(f, "occupant_message", "Unable to move while in zoom mode.");
			rt.setSv(f, "last_message", rt.worldTime(f));
		}
		return 0;
	}
	move_result = 0;
	rt.setSv(f, "glide_size", (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [divide(32, (yield* g.call(f, P("/proc/max"), null, [divide(rt.sv(f, "step_in"), rt.fv(f, "tick_lag", rt.world())), 1]))), 32]))])));
	if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 16))) {
		move_result = (yield* g.srcCall(f, "mechsteprand"));
	} else {
		if ((!isEqual(rt.sv(f, "dir"), live(direction)) && !truthy(rt.sv(f, "strafe")))) {
			move_result = (yield* g.srcCall(f, "mechturn", live(direction)));
		} else {
			move_result = (yield* g.srcCall(f, "mechstep", live(direction)));
		}
	}
	if (truthy(live(move_result))) {
		yield* g.srcCall(f, "use_power", rt.sv(f, "step_energy_drain"));
		rt.setSv(f, "can_move", 0);
		rt.spawnTail(f, rt.sv(f, "step_in"), "/obj/mecha/proc/domove: spawn at game/mecha/mecha.dm:512", direction, move_result);
		return 1;
	}
	return 0;
}, true);

// a spawn(rt.srcVarI(f, $ic[246])) body of /obj/mecha/proc/domove, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/mecha/proc/domove: spawn at game/mecha/mecha.dm:512", function* (f: Frame, direction: Value, move_result: Value) {
	f.vars = () => [direction, move_result];
	rt.setSv(f, "can_move", 1);
	return null;
});

// /obj/mecha/proc/mechturn  (code/game/mecha/mecha.dm:519)
rt.def("/obj/mecha/proc/mechturn", function mechturn(f: Frame, direction: Value) {
	rt.callSrc(f, "setDir", [live(direction)]);
	if (truthy(rt.sv(f, "turnsound"))) {
		rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "turnsound"), 40, 1]);
	}
	return 1;
});

// /obj/mecha/proc/mechstep  (code/game/mecha/mecha.dm:525)  may sleep
rt.def("/obj/mecha/proc/mechstep", function* mechstep(f: Frame, direction: Value) {
	let current_dir: Value = null, result: Value = null;
	f.vars = () => [direction, current_dir, result];
	current_dir = rt.sv(f, "dir");
	result = (yield* g.call(f, P("/proc/step"), null, [live(f.src), live(direction)]));
	if (truthy(rt.sv(f, "strafe"))) {
		yield* g.srcCall(f, "setDir", live(current_dir));
	}
	if ((truthy(live(result)) && truthy(rt.sv(f, "stepsound")))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "stepsound"), 40, 1]);
	}
	return live(result);
}, true);

// /obj/mecha/proc/mechsteprand  (code/game/mecha/mecha.dm:534)  may sleep
rt.def("/obj/mecha/proc/mechsteprand", function* mechsteprand(f: Frame) {
	let result: Value = null;
	f.vars = () => [result];
	if ((truthy((result = (yield* g.call(f, P("/proc/step_rand"), null, [live(f.src)])))) && truthy(rt.sv(f, "stepsound")))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "stepsound"), 40, 1]);
	}
	return live(result);
}, true);

// /obj/mecha/proc/Bump  (code/game/mecha/mecha.dm:540)  may sleep
rt.def("/obj/mecha/proc/Bump", function* Bump(f: Frame) {
	let O: Value = null, M: Value = null;
	f.vars = () => [O, M];
	if (((truthy(rt.sv(f, "phasing")) && rt.ge((yield* g.srcCall(f, "get_charge")), rt.sv(f, "phasing_energy_drain"))) && !truthy(rt.sv(f, "throwing")))) {
		rt.spawnTail(f, 0, "/obj/mecha/proc/Bump: spawn at game/mecha/mecha.dm:541", O, M);
	} else {
		if (!truthy(live(f.args[1]))) return f.dot;
		if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
			return live(f.dot);
		}
		if ((truthy(rt.sv(f, "bumpsmash")) && truthy(rt.sv(f, "occupant")))) {
			if (rt.lt(rt.sv(f, "nextsmash"), rt.worldTime(f))) {
				yield* g.callName(f, live(f.args[0]), "mech_melee_attack", [live(f.src)]);
				if ((!truthy(live(f.args[0])) || !truthy(rt.fv(f, "density", live(f.args[0]))))) {
					yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.sv(f, "dir")]);
				}
				rt.setSv(f, "nextsmash", add(rt.worldTime(f), rt.sv(f, "smashcooldown")));
			}
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "anchored", (O = live(f.args[0]))))) {
				yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.sv(f, "dir")]);
			}
		} else {
			if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) return f.dot;
			if (truthy(rt.gv(f, "anchored", (M = live(f.args[0]))))) return f.dot;
			yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.sv(f, "dir")]);
		}
	}
	return f.dot;
}, true, { args: ["obstacle", "yes"] });

// a spawn(0) body of /obj/mecha/proc/Bump, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/mecha/proc/Bump: spawn at game/mecha/mecha.dm:541", function* (f: Frame, O: Value, M: Value) {
	f.vars = () => [O, M];
	if (truthy(rt.sv(f, "can_move"))) {
		rt.setSv(f, "can_move", 0);
		if (truthy(rt.sv(f, "phase_state"))) {
			yield* g.call(f, P("/proc/flick"), null, [rt.sv(f, "phase_state"), live(f.src)]);
		}
		yield* g.srcCall(f, "forceMove", rt.getStep(f, live(f.src), rt.sv(f, "dir")));
		yield* g.srcCall(f, "use_power", rt.sv(f, "phasing_energy_drain"));
		yield* g.call(f, P("/proc/sleep"), null, [multiply(rt.sv(f, "step_in"), 3)]);
		rt.setSv(f, "can_move", 1);
	}
	return null;
});

// /obj/mecha/proc/check_for_internal_damage  (code/game/mecha/mecha.dm:578)  may sleep
rt.def("/obj/mecha/proc/check_for_internal_damage", function* check_for_internal_damage(f: Frame, possible_int_damage: Value, ignore_threshold: Value) {
	let _T: Value = null, int_dam_flag: Value = null, ME: Value = null;
	let $e: any;
	f.vars = () => [possible_int_damage, ignore_threshold, _T, int_dam_flag, ME, $e];
	if (live(ignore_threshold) === null) {
		ignore_threshold = null;
	}
	if ((!truthy((rt.istype(live(possible_int_damage), T("/list")) ? 1 : 0)) || truthy((yield* g.call(f, P("/proc/isemptylist"), null, [live(possible_int_damage)]))))) {
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		if ((truthy(live(ignore_threshold)) || rt.lt(divide(multiply(rt.sv(f, "obj_integrity"), 100), rt.sv(f, "max_integrity")), rt.sv(f, "internal_damage_threshold")))) {
			_T = null;
			rt.forList(f, 0, live(possible_int_damage));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), live(_T)))) {
					(possible_int_damage = rt.modify(live(possible_int_damage), live(_T), subtract));
				}
			}
			rt.endFor(f, 0);
			if (truthy((int_dam_flag = (yield* g.call(f, P("/proc/safepick"), null, [live(possible_int_damage)]))))) {
				yield* g.srcCall(f, "setInternalDamage", live(int_dam_flag));
			}
		}
	}
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		if ((truthy(live(ignore_threshold)) || rt.lt(divide(multiply(rt.sv(f, "obj_integrity"), 100), rt.sv(f, "max_integrity")), rt.sv(f, "internal_damage_threshold")))) {
			if (truthy((ME = (yield* g.call(f, P("/proc/safepick"), null, [rt.sv(f, "equipment")]))))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(ME)]);
			}
		}
	}
	return live(f.dot);
}, true);

// /obj/mecha/proc/setInternalDamage  (code/game/mecha/mecha.dm:595)
rt.def("/obj/mecha/proc/setInternalDamage", function setInternalDamage(f: Frame, int_dam_flag: Value) {
	(rt.modSrcVar(f, "internal_damage", live(int_dam_flag), rt.bitOr));
	rt.callSrc(f, "log_append_to_last", [fmt("Internal damage of type ＀.", [live(int_dam_flag)]), 1]);
	rt.op(f, "OutputReference", [rt.R.srcVar("occupant")], [rt.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/machines/warning-buzzer.ogg"), "wait", 0], rt.Args.Named)], false);
	rt.callSrc(f, "diag_hud_set_mechstat", []);
	return live(f.dot);
});

// /obj/mecha/proc/clearInternalDamage  (code/game/mecha/mecha.dm:602)
rt.def("/obj/mecha/proc/clearInternalDamage", function clearInternalDamage(f: Frame, int_dam_flag: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), live(int_dam_flag)))) {
		$0 = live(int_dam_flag);
		if ($0 === 2) {
			rt.callSrc(f, "occupant_message", ["<span class='boldnotice'>Life support system reactivated.</span>"]);
		} else if ($0 === 1) {
			rt.callSrc(f, "occupant_message", ["<span class='boldnotice'>Internal fire extinquished.</span>"]);
		} else if ($0 === 8) {
			rt.callSrc(f, "occupant_message", ["<span class='boldnotice'>Damaged internal tank has been sealed.</span>"]);
		}
	}
	(rt.modSrcVar(f, "internal_damage", rt.op(f, "BitNot", [], [live(int_dam_flag)]), rt.bitAnd));
	rt.callSrc(f, "diag_hud_set_mechstat", []);
	return f.dot;
});

// /obj/mecha/proc/attack_ai  (code/game/mecha/mecha.dm:618)
rt.def("/obj/mecha/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	let B: Value = null, can_control_mech: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [B, can_control_mech, A, $e];
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "can_dominate_mechs", live(user)))) {
		rt.callSrc(f, "examine", [live(user)]);
		B = null;
		rt.forList(f, 0, rt.sv(f, "trackers"), T("/obj/item/mecha_parts/mecha_tracking"));
		if (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Warning: Tracking Beacon detected. Enter at your own risk. Beacon Data:"]);
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀", [rt.callName(f, live(B), "get_mecha_info", [])])]);
		}
		rt.endFor(f, 0);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<a href='?src=＃;ai_take_control=＃'><span class='userdanger'>ASSUME DIRECT CONTROL?</span></a><br>", [live(user), live(f.src)])]);
	} else {
		rt.callSrc(f, "examine", [live(user)]);
		if (truthy(rt.sv(f, "occupant"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This exosuit has a pilot and cannot be controlled.</span>"]);
			return live(f.dot);
		}
		can_control_mech = 0;
		A = null;
		rt.forList(f, 0, rt.sv(f, "trackers"), T("/obj/item/mecha_parts/mecha_tracking/ai_control"));
		if (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			can_control_mech = 1;
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ Status of ＀:</span>\n＀", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), rt.sv(f, "name"), rt.callName(f, live(A), "get_mecha_info", [])])]);
		}
		rt.endFor(f, 0);
		if (!truthy(live(can_control_mech))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You cannot control exosuits without AI control beacons installed.</span>"]);
			return live(f.dot);
		}
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<a href='?src=＃;ai_take_control=＃'><span class='boldnotice'>Take control of exosuit?</span></a><br>", [live(user), live(f.src)])]);
	}
	return f.dot;
});

// /obj/mecha/proc/transfer_ai  (code/game/mecha/mecha.dm:645)  may sleep
rt.def("/obj/mecha/proc/transfer_ai", function* transfer_ai(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === 1) {
		if (!truthy(rt.sv(f, "state"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ must have maintenance protocols active in order to allow a transfer.</span>", [rt.sv(f, "name")])]);
			return live(f.dot);
		}
		if ((!truthy((f.args[2] = rt.sv(f, "occupant"))) || !truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>No AI detected in the ＀ onboard computer.</span>", [rt.sv(f, "name")])]);
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[2]), "ai_restore_power", []);
		rt.setFv(f, "control_disabled", live(f.args[2]), 1);
		rt.setFv(f, "radio_enabled", live(f.args[2]), 0);
		yield* g.callName(f, live(f.args[2]), "disconnect_shell", []);
		yield* g.srcCall(f, "RemoveActions", live(f.args[2]), 1);
		rt.setSv(f, "occupant", null);
		yield* g.callName(f, live(f.args[2]), "forceMove", [live(f.args[3])]);
		rt.setFv(f, "AI", live(f.args[3]), live(f.args[2]));
		rt.setFv(f, "controlled_mech", live(f.args[2]), null);
		rt.setFv(f, "remote_control", live(f.args[2]), null);
		rt.setSv(f, "icon_state", add(rt.initial(f, live(f.src), "icon_state"), "-open"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[2]), "You have been downloaded to a mobile storage device. Wireless connection offline."]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='boldnotice'>Transfer successful</span>: ＀ (＀.exe) removed from ＀ and stored within local memory.", [rt.fv(f, "name", live(f.args[2])), (yield* g.call(f, P("/proc/rand"), null, [1000, 9999])), rt.sv(f, "name")])]);
	} else if ($0 === 3) {
		rt.setFv(f, "linked_core", live(f.args[2]), (yield* g.new_(f, T("/obj/structure/AIcore/deactivated"), [rt.fv(f, "loc", live(f.args[2]))])));
		if (truthy(rt.fv(f, "can_dominate_mechs", live(f.args[2])))) {
			if (truthy(rt.sv(f, "occupant"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[2]), "<span class='warning'>Pilot detected! Forced ejection initiated!"]);
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupant"), "<span class='danger'>You have been forcibly ejected!</span>"]);
				yield* g.srcCall(f, "go_out", 1);
			}
		}
		yield* g.srcCall(f, "ai_enter_mech", live(f.args[2]), live(f.args[0]));
	} else if ($0 === 2) {
		if (!truthy((f.args[2] = rt.fv(f, "AI", live(f.args[3]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is no AI currently installed on this device.</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "deployed_shell", live(f.args[2])))) {
			yield* g.callName(f, live(f.args[2]), "disconnect_shell", []);
		}
		if ((truthy(rt.fv(f, "stat", live(f.args[2]))) || !truthy(rt.fv(f, "client", live(f.args[2]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is currently unresponsive, and cannot be uploaded.</span>", [rt.fv(f, "name", live(f.args[2]))])]);
			return live(f.dot);
		}
		if ((truthy(rt.sv(f, "occupant")) || truthy(rt.sv(f, "dna_lock")))) {
			$0 = live(f.args[1]);
			$1 = rt.sv(f, "name");
			if (truthy(rt.sv(f, "occupant"))) {
				$1 = $1;
				$2 = "currently occupied";
			} else {
				$2 = "secured with a DNA lock";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>Access denied. ＀ is ＀.", [$1, $2])]);
			return live(f.dot);
		}
		rt.setFv(f, "control_disabled", live(f.args[2]), 0);
		rt.setFv(f, "radio_enabled", live(f.args[2]), 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='boldnotice'>Transfer successful</span>: ＀ (＀.exe) installed and executed successfully. Local copy has been removed.", [rt.fv(f, "name", live(f.args[2])), (yield* g.call(f, P("/proc/rand"), null, [1000, 9999]))])]);
		rt.setFv(f, "AI", live(f.args[3]), null);
		yield* g.srcCall(f, "ai_enter_mech", live(f.args[2]), live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["interaction", "user", "AI", "card"] });

// /obj/mecha/proc/ai_enter_mech  (code/game/mecha/mecha.dm:702)  may sleep
rt.def("/obj/mecha/proc/ai_enter_mech", function* ai_enter_mech(f: Frame, AI: Value, interaction: Value) {
	let $0: any, $1: any;
	f.vars = () => [AI, interaction, $0, $1];
	yield* g.callName(f, live(AI), "ai_restore_power", []);
	yield* g.callName(f, live(AI), "forceMove", [live(f.src)]);
	rt.setSv(f, "occupant", live(AI));
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/windowdoor.ogg"), 50, 1]);
	if (!truthy(rt.sv(f, "internal_damage"))) {
		rt.op(f, "OutputReference", [rt.R.srcVar("occupant")], [(yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/mecha/nominal.ogg"), "volume", 50], rt.Args.Named))], false);
	}
	yield* g.callName(f, live(AI), "cancel_camera", []);
	rt.setFv(f, "controlled_mech", live(AI), live(f.src));
	rt.setFv(f, "remote_control", live(AI), live(f.src));
	rt.setFv(f, "canmove", live(AI), 1);
	rt.setFv(f, "can_shunt", live(AI), 0);
	$0 = live(AI);
	if (truthy(rt.fv(f, "can_dominate_mechs", live(AI)))) {
		$1 = fmt("<span class='announce'>Takeover of ＀ complete! You are now loaded onto the onboard computer. Do not attempt to leave the station sector!</span>", [rt.sv(f, "name")]);
	} else {
		$1 = "<span class='notice'>You have been uploaded to a mech's onboard computer.";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("＀", [$1])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(AI), "<span class='reallybig boldnotice'>Use Middle-Mouse to activate mech functions and equipment. Click normally for AI interactions.</span>"]);
	if (isEqual(live(interaction), 2)) {
		yield* g.srcCall(f, "GrantActions", live(AI), 0);
	} else {
		yield* g.srcCall(f, "GrantActions", live(AI), (!truthy(rt.fv(f, "can_dominate_mechs", live(AI))) ? 1 : 0));
	}
	return f.dot;
}, true);

// /obj/mecha/proc/aimob_enter_mech  (code/game/mecha/mecha.dm:725)  may sleep
rt.def("/obj/mecha/proc/aimob_enter_mech", function* aimob_enter_mech(f: Frame, pilot_mob: Value) {
	f.vars = () => [pilot_mob];
	if (!(truthy(live(pilot_mob)) && truthy((yield* g.callName(f, live(pilot_mob), "Adjacent", [live(f.src)]))))) return f.dot;
	if (truthy(rt.sv(f, "occupant"))) {
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	rt.setSv(f, "occupant", live(pilot_mob));
	rt.setFv(f, "mecha", live(pilot_mob), live(f.src));
	rt.setFv(f, "loc", live(pilot_mob), live(f.src));
	yield* g.srcCall(f, "GrantActions", live(pilot_mob));
	return f.dot;
}, true);

// /obj/mecha/proc/aimob_exit_mech  (code/game/mecha/mecha.dm:735)  may sleep
rt.def("/obj/mecha/proc/aimob_exit_mech", function* aimob_exit_mech(f: Frame, pilot_mob: Value) {
	f.vars = () => [pilot_mob];
	if (isEqual(rt.sv(f, "occupant"), live(pilot_mob))) {
		rt.setSv(f, "occupant", null);
	}
	if (isEqual(rt.fv(f, "mecha", live(pilot_mob)), live(f.src))) {
		rt.setFv(f, "mecha", live(pilot_mob), null);
	}
	rt.setSv(f, "icon_state", fmt("＀-open", [rt.initial(f, live(f.src), "icon_state")]));
	yield* g.callName(f, live(pilot_mob), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	yield* g.srcCall(f, "RemoveActions", live(pilot_mob));
	return f.dot;
}, true);

// /obj/mecha/proc/remove_air  (code/game/mecha/mecha.dm:750)  may sleep
rt.def("/obj/mecha/proc/remove_air", function* remove_air(f: Frame) {
	if (truthy(rt.sv(f, "use_internal_tank"))) {
		return (yield* g.callName(f, rt.sv(f, "cabin_air"), "remove", [live(f.args[0])]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["amount"] });

// /obj/mecha/proc/return_air  (code/game/mecha/mecha.dm:756)
rt.def("/obj/mecha/proc/return_air", function return_air(f: Frame) {
	if (truthy(rt.sv(f, "use_internal_tank"))) {
		return rt.sv(f, "cabin_air");
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/mecha/proc/return_pressure  (code/game/mecha/mecha.dm:759)
rt.def("/obj/mecha/proc/return_pressure", function return_pressure(f: Frame) {
	let t_air: Value = null;
	f.vars = () => [t_air];
	if (truthy((t_air = rt.callSrc(f, "return_air", [])))) {
		f.dot = rt.callName(f, live(t_air), "return_pressure", []);
	}
	return live(f.dot);
});

// /obj/mecha/proc/return_temperature  (code/game/mecha/mecha.dm:766)
rt.def("/obj/mecha/proc/return_temperature", function return_temperature(f: Frame) {
	let t_air: Value = null;
	f.vars = () => [t_air];
	if (truthy((t_air = rt.callSrc(f, "return_air", [])))) {
		f.dot = rt.callName(f, live(t_air), "return_temperature", []);
	}
	return live(f.dot);
});

// /obj/mecha/proc/connect  (code/game/mecha/mecha.dm:773)
rt.def("/obj/mecha/proc/connect", function connect(f: Frame, new_port: Value) {
	let connected_port_parent: Value = null;
	f.vars = () => [connected_port_parent];
	if (((truthy(rt.sv(f, "connected_port")) || !truthy(live(new_port))) || truthy(rt.fv(f, "connected_device", live(new_port))))) {
		return 0;
	}
	if (!isEqual(rt.fv(f, "loc", live(new_port)), rt.sv(f, "loc"))) {
		return 0;
	}
	rt.setSv(f, "connected_port", live(new_port));
	rt.setFv(f, "connected_device", rt.sv(f, "connected_port"), live(f.src));
	rt.callName(f, (connected_port_parent = rt.index(rt.fv(f, "parents", rt.sv(f, "connected_port")), 1)), "reconcile_air", []);
	rt.callSrc(f, "log_message", ["Connected to gas port."]);
	return 1;
});

// /obj/mecha/proc/disconnect  (code/game/mecha/mecha.dm:790)
rt.def("/obj/mecha/proc/disconnect", function disconnect(f: Frame) {
	if (!truthy(rt.sv(f, "connected_port"))) {
		return 0;
	}
	rt.setFv(f, "connected_device", rt.sv(f, "connected_port"), null);
	rt.setSv(f, "connected_port", null);
	rt.callSrc(f, "log_message", ["Disconnected from gas port."]);
	return 1;
});

// /obj/mecha/proc/portableConnectorReturnAir  (code/game/mecha/mecha.dm:799)
rt.def("/obj/mecha/proc/portableConnectorReturnAir", function portableConnectorReturnAir(f: Frame) {
	return rt.callName(f, rt.sv(f, "internal_tank"), "return_air", []);
});

// /obj/mecha/proc/MouseDrop_T  (code/game/mecha/mecha.dm:803)  may sleep
rt.def("/obj/mecha/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, M: Value, user: Value) {
	let passed: Value = null, C: Value = null;
	f.vars = () => [M, user, passed, C];
	if ((!truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src)]))) || !isEqual(live(user), live(M)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "log_message", fmt("＀ tries to move in.", [live(user)]));
	if (truthy(rt.sv(f, "occupant"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>The ＀ is already occupied!</span>", [rt.sv(f, "name")])]);
		yield* g.srcCall(f, "log_append_to_last", "Permission denied.");
		return live(f.dot);
	}
	passed = null;
	if (truthy(rt.sv(f, "dna_lock"))) {
		if (truthy((yield* g.callName(f, live(user), "has_dna", [])))) {
			if (isEqual(rt.gv(f, "unique_enzymes", rt.gv(f, "dna", (C = live(user)))), rt.sv(f, "dna_lock"))) {
				passed = 1;
			}
		}
	} else {
		if (truthy((yield* g.srcCall(f, "operation_allowed", live(user))))) {
			passed = 1;
		}
	}
	if (!truthy(live(passed))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Access denied.</span>"]);
		yield* g.srcCall(f, "log_append_to_last", "Permission denied.");
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "buckled", live(user)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You are currently buckled and cannot move.</span>"]);
		yield* g.srcCall(f, "log_append_to_last", "Permission denied.");
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(user), "has_buckled_mobs", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't enter the exosuit with other creatures attached to you!</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("＀ starts to climb into ＀.", [live(user), rt.sv(f, "name")]));
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 40, "target", live(f.src)], rt.Args.Named)))) {
		if (rt.le(rt.sv(f, "obj_integrity"), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot get in the ＀, it has been destroyed!</span>", [rt.sv(f, "name")])]);
		} else {
			if (truthy(rt.sv(f, "occupant"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ was faster! Try better next time, loser.</span>", [rt.sv(f, "occupant")])]);
			} else {
				if (truthy(rt.fv(f, "buckled", live(user)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't enter the exosuit while buckled.</span>"]);
				} else {
					if (truthy((yield* g.callName(f, live(user), "has_buckled_mobs", [])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't enter the exosuit with other creatures attached to you!</span>"]);
					} else {
						yield* g.srcCall(f, "moved_inside", live(user));
					}
				}
			}
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You stop entering the exosuit!</span>"]);
	}
	return live(f.dot);
}, true);

// /obj/mecha/proc/moved_inside  (code/game/mecha/mecha.dm:850)  may sleep
rt.def("/obj/mecha/proc/moved_inside", function* moved_inside(f: Frame, H: Value) {
	f.vars = () => [H];
	if (truthy((rt.isIn(f, ((live(H) && rt.fv(f, "client", live(H))) && live(H)), (yield* g.call(f, P("/proc/range"), null, [1]))) ? 1 : 0))) {
		rt.setSv(f, "occupant", live(H));
		yield* g.callName(f, live(H), "forceMove", [live(f.src)]);
		yield* g.srcCall(f, "add_fingerprint", live(H));
		yield* g.callSrc(f, "GrantActions", [null, live(H), "human_occupant", 1], rt.Args.Named);
		yield* g.srcCall(f, "forceMove", rt.sv(f, "loc"));
		yield* g.srcCall(f, "log_append_to_last", fmt("＀ moved in as pilot.", [live(H)]));
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		yield* g.srcCall(f, "setDir", rt.sv(f, "dir_in"));
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/windowdoor.ogg"), 50, 1]);
		if (!truthy(rt.sv(f, "internal_damage"))) {
			rt.op(f, "OutputReference", [rt.R.srcVar("occupant")], [(yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/mecha/nominal.ogg"), "volume", 50], rt.Args.Named))], false);
		}
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /obj/mecha/proc/mmi_move_inside  (code/game/mecha/mecha.dm:867)  may sleep
rt.def("/obj/mecha/proc/mmi_move_inside", function* mmi_move_inside(f: Frame, mmi_as_oc: Value, user: Value) {
	f.vars = () => [mmi_as_oc, user];
	if ((!truthy(rt.fv(f, "brainmob", live(mmi_as_oc))) || !truthy(rt.gv(f, "client", rt.fv(f, "brainmob", live(mmi_as_oc)))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Consciousness matrix not detected!</span>"]);
		return 0;
	} else {
		if (truthy(rt.gv(f, "stat", rt.fv(f, "brainmob", live(mmi_as_oc))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Beta-rhythm below acceptable level!</span>"]);
			return 0;
		} else {
			if (truthy(rt.sv(f, "occupant"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Occupant detected!</span>"]);
				return 0;
			} else {
				if ((truthy(rt.sv(f, "dna_lock")) && (!truthy(rt.gv(f, "stored_dna", rt.fv(f, "brainmob", live(mmi_as_oc)))) || !isEqual(rt.sv(f, "dna_lock"), rt.gv(f, "unique_enzymes", rt.gv(f, "stored_dna", rt.fv(f, "brainmob", live(mmi_as_oc)))))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Access denied. ＀ is secured with a DNA lock.</span>", [rt.sv(f, "name")])]);
					return 0;
				}
			}
		}
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ starts to insert an MMI into ＀.</span>", [live(user), rt.sv(f, "name")]));
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 40, "target", live(f.src)], rt.Args.Named)))) {
		if (!truthy(rt.sv(f, "occupant"))) {
			return (yield* g.srcCall(f, "mmi_moved_inside", live(mmi_as_oc), live(user)));
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Occupant detected!</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You stop inserting the MMI.</span>"]);
	}
	return 0;
}, true);

// /obj/mecha/proc/mmi_moved_inside  (code/game/mecha/mecha.dm:892)  may sleep
rt.def("/obj/mecha/proc/mmi_moved_inside", function* mmi_moved_inside(f: Frame, mmi_as_oc: Value, user: Value) {
	let brainmob: Value = null;
	f.vars = () => [mmi_as_oc, user, brainmob];
	if (!(truthy((yield* g.srcCall(f, "Adjacent", live(mmi_as_oc)))) && truthy((yield* g.srcCall(f, "Adjacent", live(user)))))) {
		return 0;
	}
	if ((!truthy(rt.fv(f, "brainmob", live(mmi_as_oc))) || !truthy(rt.gv(f, "client", rt.fv(f, "brainmob", live(mmi_as_oc)))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Consciousness matrix not detected!</span>"]);
		return 0;
	} else {
		if (truthy(rt.gv(f, "stat", rt.fv(f, "brainmob", live(mmi_as_oc))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Beta-rhythm below acceptable level!</span>"]);
			return 0;
		}
	}
	if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(mmi_as_oc), live(f.src)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [live(mmi_as_oc), live(f.src)])]);
		return 0;
	}
	brainmob = rt.fv(f, "brainmob", live(mmi_as_oc));
	rt.setFv(f, "mecha", live(mmi_as_oc), live(f.src));
	rt.setSv(f, "occupant", live(brainmob));
	yield* g.callName(f, live(brainmob), "forceMove", [live(f.src)]);
	yield* g.callName(f, live(brainmob), "reset_perspective", [live(f.src)]);
	rt.setFv(f, "remote_control", live(brainmob), live(f.src));
	yield* g.callName(f, live(brainmob), "update_canmove", []);
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "setDir", rt.sv(f, "dir_in"));
	yield* g.srcCall(f, "log_message", fmt("＀ moved in as pilot.", [live(mmi_as_oc)]));
	if (!truthy(rt.sv(f, "internal_damage"))) {
		rt.op(f, "OutputReference", [rt.R.srcVar("occupant")], [(yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/mecha/nominal.ogg"), "volume", 50], rt.Args.Named))], false);
	}
	yield* g.srcCall(f, "GrantActions", live(brainmob));
	return 1;
}, true);

// /obj/mecha/proc/container_resist  (code/game/mecha/mecha.dm:920)  may sleep
rt.def("/obj/mecha/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "go_out");
	return f.dot;
}, true);

// /obj/mecha/proc/Exited  (code/game/mecha/mecha.dm:924)  may sleep
rt.def("/obj/mecha/proc/Exited", function* Exited(f: Frame, M: Value, newloc: Value) {
	f.vars = () => [M, newloc];
	if (!(truthy(rt.sv(f, "occupant")) && isEqual(rt.sv(f, "occupant"), live(M)))) return f.dot;
	yield* g.srcCall(f, "go_out", 1, live(newloc));
	return f.dot;
}, true);

// /obj/mecha/proc/go_out  (code/game/mecha/mecha.dm:928)  may sleep
rt.def("/obj/mecha/proc/go_out", function* go_out(f: Frame, forced: Value, newloc: Value) {
	let mob_container: Value = null, brain: Value = null, AI: Value = null, L: Value = null, mmi: Value = null;
	f.vars = () => [forced, newloc, mob_container, brain, AI, L, mmi];
	if (live(newloc) === null) {
		newloc = rt.sv(f, "loc");
	}
	if (!truthy(rt.sv(f, "occupant"))) {
		return live(f.dot);
	}
	mob_container = null;
	yield* g.callName(f, rt.sv(f, "occupant"), "clear_alert", ["charge"]);
	yield* g.callName(f, rt.sv(f, "occupant"), "clear_alert", ["mech damage"]);
	if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		mob_container = rt.sv(f, "occupant");
		yield* g.callSrc(f, "RemoveActions", [null, rt.sv(f, "occupant"), "human_occupant", 1], rt.Args.Named);
	} else {
		if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/brain")) ? 1 : 0))) {
			yield* g.srcCall(f, "RemoveActions", (brain = rt.sv(f, "occupant")));
			mob_container = rt.fv(f, "container", live(brain));
		} else {
			if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/silicon/ai")) ? 1 : 0))) {
				AI = rt.sv(f, "occupant");
				if (truthy(live(forced))) {
					yield* g.srcCall(f, "RemoveActions", rt.sv(f, "occupant"));
					yield* g.callName(f, rt.sv(f, "occupant"), "gib", []);
					rt.setSv(f, "occupant", null);
					return live(f.dot);
				} else {
					if (!truthy(rt.fv(f, "linked_core", live(AI)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(AI), "<span class='userdanger'>Inactive core destroyed. Unable to return.</span>"]);
						rt.setFv(f, "linked_core", live(AI), null);
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(AI), "<span class='notice'>Returning to core...</span>"]);
					rt.setFv(f, "controlled_mech", live(AI), null);
					rt.setFv(f, "remote_control", live(AI), null);
					yield* g.srcCall(f, "RemoveActions", rt.sv(f, "occupant"), 1);
					mob_container = live(AI);
					newloc = rt.getStep(f, rt.fv(f, "linked_core", live(AI)), 0);
					yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "linked_core", live(AI))]);
				}
			} else {
				return live(f.dot);
			}
		}
	}
	L = rt.sv(f, "occupant");
	rt.setSv(f, "occupant", null);
	if (truthy((yield* g.callName(f, live(mob_container), "forceMove", [live(newloc)])))) {
		yield* g.srcCall(f, "log_message", fmt("＀ moved out.", [live(mob_container)]));
		rt.op(f, "Browse", [], [live(L), null, "window=exosuit"], false);
		if (truthy((rt.istype(live(mob_container), T("/obj/item/device/mmi")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "brainmob", (mmi = live(mob_container))))) {
				rt.setFv(f, "loc", live(L), live(mmi));
				yield* g.callName(f, live(L), "reset_perspective", []);
			}
			rt.setFv(f, "mecha", live(mmi), null);
			yield* g.callName(f, live(mmi), "update_icon", []);
			rt.setFv(f, "canmove", live(L), 0);
		}
		rt.setSv(f, "icon_state", add(rt.initial(f, live(f.src), "icon_state"), "-open"));
		yield* g.srcCall(f, "setDir", rt.sv(f, "dir_in"));
	}
	if (!(truthy(live(L)) && truthy(rt.fv(f, "client", live(L))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "client", live(L)), "change_view", [(yield* g.callName(f, rt.fv(f, "client", live(L)), "default_view", []))]);
	rt.setSv(f, "zoom_mode", 0);
	return f.dot;
}, true);

// /obj/mecha/proc/operation_allowed  (code/game/mecha/mecha.dm:987)
rt.def("/obj/mecha/proc/operation_allowed", function operation_allowed(f: Frame, M: Value) {
	rt.setSv(f, "req_access", rt.sv(f, "operation_req_access"));
	rt.setSv(f, "req_one_access", rt.list());
	return rt.callSrc(f, "allowed", [live(M)]);
});

// /obj/mecha/proc/internals_access_allowed  (code/game/mecha/mecha.dm:992)
rt.def("/obj/mecha/proc/internals_access_allowed", function internals_access_allowed(f: Frame, M: Value) {
	rt.setSv(f, "req_one_access", rt.sv(f, "internals_req_access"));
	rt.setSv(f, "req_access", rt.list());
	return rt.callSrc(f, "allowed", [live(M)]);
});

// /obj/mecha/proc/occupant_message  (code/game/mecha/mecha.dm:1004)
rt.def("/obj/mecha/proc/occupant_message", function occupant_message(f: Frame, message: Value) {
	if (truthy(live(message))) {
		if ((truthy(rt.sv(f, "occupant")) && truthy(rt.fv(f, "client", rt.sv(f, "occupant"))))) {
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupant"), fmt("＀ ＀", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(message)])]);
		}
	}
	return live(f.dot);
});

// /obj/mecha/proc/log_message  (code/game/mecha/mecha.dm:1009)
rt.def("/obj/mecha/proc/log_message", function log_message(f: Frame, message: Value, red: Value) {
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $9: any, $10: any, $11: any;
	f.vars = () => [red, $0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11];
	if (live(red) === null) {
		red = null;
	}
	rt.incField(f, rt.sv(f, "log"), "len", 1, true);
	$0 = rt.sv(f, "log");
	$1 = rt.len(f, rt.sv(f, "log"));
	$2 = "time";
	$3 = fmt("＀", [rt.call(f, P("/proc/worldtime2text"), null, [])]);
	$4 = null;
	$5 = "date";
	$6 = "year";
	$7 = fmt("＀", [add(rt.gl("year_integer"), 540)]);
	$8 = "message";
	if (truthy(live(red))) {
		$9 = "<font color='red'>";
	} else {
		$9 = null;
	}
	$10 = live(message);
	if (truthy(live(red))) {
		$11 = "</font>";
	} else {
		$11 = null;
	}
	rt.setAt($0, $1, rt.alist(f, [$2, $3, $4, $5, $6, $7, $8, fmt("＀＀＀", [$9, $10, $11])]));
	return rt.len(f, rt.sv(f, "log"));
});

// /obj/mecha/proc/log_append_to_last  (code/game/mecha/mecha.dm:1014)
rt.def("/obj/mecha/proc/log_append_to_last", function log_append_to_last(f: Frame, message: Value, red: Value) {
	let last_entry: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	f.vars = () => [red, last_entry, $0, $1, $2, $3, $4];
	if (live(red) === null) {
		red = null;
	}
	$0 = (last_entry = rt.index(rt.sv(f, "log"), rt.len(f, rt.sv(f, "log"))));
	$1 = "message";
	if (truthy(live(red))) {
		$2 = "<font color='red'>";
	} else {
		$2 = null;
	}
	$3 = live(message);
	if (truthy(live(red))) {
		$4 = "</font>";
	} else {
		$4 = null;
	}
	rt.modAt($0, $1, fmt("<br>＀＀＀", [$2, $3, $4]), add);
	return live(f.dot);
});

// /datum/controller/global_vars/proc/InitGlobalyear  (code/game/mecha/mecha.dm:1018)
rt.def("/datum/controller/global_vars/proc/InitGlobalyear", function InitGlobalyear(f: Frame) {
	rt.setGl("year", rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "YYYY"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "year", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalyear_integer  (code/game/mecha/mecha.dm:1019)
rt.def("/datum/controller/global_vars/proc/InitGlobalyear_integer", function InitGlobalyear_integer(f: Frame) {
	rt.setGl("year_integer", rt.call(f, P("/proc/text2num"), null, [rt.gl("year")]));
	rt.modSrcVar(f, "gvars_datum_init_order", "year_integer", add);
	return f.dot;
});

// /obj/mecha/proc/has_charge  (code/game/mecha/mecha.dm:1026)
rt.def("/obj/mecha/proc/has_charge", function has_charge(f: Frame, amount: Value) {
	return (rt.ge(rt.callSrc(f, "get_charge", []), live(amount)) ? 1 : 0);
});

// /obj/mecha/proc/get_charge  (code/game/mecha/mecha.dm:1029)
rt.def("/obj/mecha/proc/get_charge", function get_charge(f: Frame) {
	let R: Value = null, relay_charge: Value = null;
	let $e: any;
	f.vars = () => [R, relay_charge, $e];
	R = null;
	rt.forList(f, 0, rt.sv(f, "equipment"), T("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (truthy((relay_charge = rt.callName(f, live(R), "get_charge", [])))) {
			return live(relay_charge);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "cell"))) return f.dot;
	return rt.call(f, P("/proc/max"), null, [0, rt.fv(f, "charge", rt.sv(f, "cell"))]);
});

// /obj/mecha/proc/use_power  (code/game/mecha/mecha.dm:1037)  may sleep
rt.def("/obj/mecha/proc/use_power", function* use_power(f: Frame, amount: Value) {
	f.vars = () => [amount];
	if (truthy((yield* g.srcCall(f, "get_charge")))) {
		yield* g.callName(f, rt.sv(f, "cell"), "use", [live(amount)]);
		return 1;
	}
	return 0;
}, true);

// /obj/mecha/proc/give_power  (code/game/mecha/mecha.dm:1043)  may sleep
rt.def("/obj/mecha/proc/give_power", function* give_power(f: Frame, amount: Value) {
	f.vars = () => [amount];
	if ((yield* g.srcCall(f, "get_charge")) !== null) {
		yield* g.callName(f, rt.sv(f, "cell"), "give", [live(amount)]);
		return 1;
	}
	return 0;
}, true);

// /obj/mecha/proc/update_remote_sight  (code/game/mecha/mecha.dm:1053)
rt.def("/obj/mecha/proc/update_remote_sight", function update_remote_sight(f: Frame, user: Value) {
	if (!truthy(rt.sv(f, "occupant_sight_flags"))) return f.dot;
	if (!isEqual(live(user), rt.sv(f, "occupant"))) return f.dot;
	(rt.modField(f, live(user), "sight", rt.sv(f, "occupant_sight_flags"), rt.bitOr));
	return f.dot;
});
