// From code/modules/clothing/spacesuits/flightsuit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9389, "/obj/item/device/flightpack", "/obj/item/device", {
	icon_state_active: "flightpack_on",
	item_state_active: "flightpack_on",
	icon_state_boost: "flightpack_boost",
	item_state_boost: "flightpack_boost",
	processing_mode: 1,
	suit: null,
	wearer: null,
	slowdown_ground: 1,
	slowdown_air: 0,
	slowdown_brake: 1,
	flight: 0,
	flight_passflags: 1,
	powersetting: 1,
	powersetting_high: 3,
	powersetting_low: 1,
	override_safe: 0,
	boost: 0,
	boost_maxcharge: 30,
	boost_charge: 30,
	boost_speed: 2,
	boost_power: 50,
	boost_chargerate: 0.3,
	boost_drain: 6,
	momentum_x: 0,
	momentum_y: 0,
	momentum_max: 500,
	momentum_impact_coeff: 0.5,
	momentum_impact_loss: 50,
	momentum_crash_coeff: 0.8,
	momentum_drift_coeff: 0.04,
	momentum_speed: 0,
	momentum_speed_x: 0,
	momentum_speed_y: 0,
	momentum_passive_loss: 4,
	momentum_gain: 20,
	drift_tolerance: 2,
	stabilizer: 1,
	stabilizer_decay_amount: 11,
	gravity: 1,
	gravity_decay_amount: 3,
	pressure: 1,
	pressure_decay_amount: 3,
	pressure_threshold: 30,
	brake: 0,
	airbrake_decay_amount: 30,
	resync: 0,
	disabled: 0,
	crash_disable_message: 0,
	emp_disable_message: 0,
	emp_damage: 0,
	emp_strong_damage: 1.5,
	emp_weak_damage: 1,
	emp_heal_amount: 0.06,
	emp_disable_threshold: 3,
	emp_disabled: 0,
	crash_damage: 0,
	crash_damage_low: 1,
	crash_damage_high: 2.5,
	crash_disable_threshold: 5,
	crash_heal_amount: 0.06,
	crash_disabled: 0,
	crash_dampening: 0,
	ion_trail: null,
	assembled: 0,
	part_manip: null,
	part_scan: null,
	part_cap: null,
	part_laser: null,
	part_bin: null,
	crashing: 0,
	dragging_through: 0,
	name: "flight pack",
	desc: "An advanced back-worn system that has dual ion engines powerful enough to grant a humanoid flight. Contains an internal self-recharging high-current capacitor for short, powerful boosts.",
	icon_state: "flightpack_off",
	item_state: "flightpack_off",
	actions_types: null,
	armor: null,
	w_class: 4,
	slot_flags: 1024,
	resistance_flags: 2,
});

// /obj/item/device/flightpack/proc/<init>  (code/modules/clothing/spacesuits/flightsuit.dm:20)
rt.def("/obj/item/device/flightpack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/flightpack/toggle_flight"), T("/datum/action/item_action/flightpack/engage_boosters"), T("/datum/action/item_action/flightpack/toggle_stabilizers"), T("/datum/action/item_action/flightpack/change_power"), T("/datum/action/item_action/flightpack/toggle_airbrake")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 20, "laser", 20, "energy", 10, "bomb", 30, "bio", 100, "rad", 75, "fire", 100, "acid", 75]));
	return f.dot;
});

// /obj/item/device/flightpack/proc/Initialize  (code/modules/clothing/spacesuits/flightsuit.dm:110)  may sleep
rt.def("/obj/item/device/flightpack/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "ion_trail", (yield* g.new_(f, T("/datum/effect_system/trail_follow/ion/flight"), [])));
	yield* g.callName(f, rt.sv(f, "ion_trail"), "set_up", [live(f.src)]);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSflightpacks"), "processing", live(f.src), add);
	}
	yield* g.srcCall(f, "update_parts");
	yield* g.srcCall(f, "sync_processing", rt.gl("SSflightpacks"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(9390, "/obj/item/device/flightpack/full", "/obj/item/device/flightpack", {});

// /obj/item/device/flightpack/full/proc/Initialize  (code/modules/clothing/spacesuits/flightsuit.dm:118)  may sleep
rt.def("/obj/item/device/flightpack/full/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "part_manip", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/manipulator/pico"), [live(f.src)])));
	rt.setSv(f, "part_scan", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/scanning_module/phasic"), [live(f.src)])));
	rt.setSv(f, "part_cap", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/capacitor/super"), [live(f.src)])));
	rt.setSv(f, "part_laser", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/micro_laser/ultra"), [live(f.src)])));
	rt.setSv(f, "part_bin", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/matter_bin/super"), [live(f.src)])));
	rt.setSv(f, "assembled", 1);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/sync_processing  (code/modules/clothing/spacesuits/flightsuit.dm:128)
rt.def("/obj/item/device/flightpack/proc/sync_processing", function sync_processing(f: Frame, FPS: Value) {
	rt.setSv(f, "processing_mode", rt.fv(f, "flightsuit_processing", live(FPS)));
	if (!isEqual(rt.sv(f, "processing_mode"), 0)) return f.dot;
	rt.setSv(f, "momentum_x", 0);
	rt.setSv(f, "momentum_y", 0);
	rt.setSv(f, "momentum_speed_x", 0);
	rt.setSv(f, "momentum_speed_y", 0);
	rt.setSv(f, "momentum_speed", 0);
	rt.setSv(f, "boost_charge", 0);
	rt.setSv(f, "boost", 0);
	rt.callSrc(f, "update_slowdown", []);
	return f.dot;
});

// /obj/item/device/flightpack/proc/update_parts  (code/modules/clothing/spacesuits/flightsuit.dm:139)
rt.def("/obj/item/device/flightpack/proc/update_parts", function update_parts(f: Frame) {
	let manip: Value = null, scan: Value = null, cap: Value = null, laser: Value = null, bin: Value = null;
	f.vars = () => [manip, scan, cap, laser, bin];
	rt.setSv(f, "boost_chargerate", rt.initial(f, live(f.src), "boost_chargerate"));
	rt.setSv(f, "boost_drain", rt.initial(f, live(f.src), "boost_drain"));
	rt.setSv(f, "powersetting_high", rt.initial(f, live(f.src), "powersetting_high"));
	rt.setSv(f, "emp_disable_threshold", rt.initial(f, live(f.src), "emp_disable_threshold"));
	rt.setSv(f, "crash_disable_threshold", rt.initial(f, live(f.src), "crash_disable_threshold"));
	rt.setSv(f, "stabilizer_decay_amount", rt.initial(f, live(f.src), "stabilizer_decay_amount"));
	rt.setSv(f, "airbrake_decay_amount", rt.initial(f, live(f.src), "airbrake_decay_amount"));
	manip = 0;
	scan = 0;
	cap = 0;
	laser = 0;
	bin = 0;
	rt.setSv(f, "assembled", 0);
	if (((((truthy(rt.sv(f, "part_manip")) && truthy(rt.sv(f, "part_scan"))) && truthy(rt.sv(f, "part_cap"))) && truthy(rt.sv(f, "part_laser"))) && truthy(rt.sv(f, "part_bin")))) {
		manip = rt.fv(f, "rating", rt.sv(f, "part_manip"));
		scan = rt.fv(f, "rating", rt.sv(f, "part_scan"));
		cap = rt.fv(f, "rating", rt.sv(f, "part_cap"));
		laser = rt.fv(f, "rating", rt.sv(f, "part_laser"));
		bin = rt.fv(f, "rating", rt.sv(f, "part_bin"));
		rt.setSv(f, "assembled", 1);
	}
	(rt.modSrcVar(f, "boost_chargerate", live(cap), multiply));
	(rt.modSrcVar(f, "boost_drain", live(manip), subtract));
	rt.setSv(f, "powersetting_high", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [live(laser), 3])]));
	rt.setSv(f, "emp_disable_threshold", multiply(live(bin), 1.25));
	rt.setSv(f, "crash_disable_threshold", multiply(live(bin), 2));
	rt.setSv(f, "stabilizer_decay_amount", multiply(live(scan), 3.5));
	rt.setSv(f, "airbrake_decay_amount", multiply(live(manip), 8));
	rt.setSv(f, "crash_dampening", live(bin));
	return f.dot;
});

// /obj/item/device/flightpack/proc/Destroy  (code/modules/clothing/spacesuits/flightsuit.dm:170)  may sleep
rt.def("/obj/item/device/flightpack/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "suit"))) {
		yield* g.srcCall(f, "delink_suit");
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "part_manip")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "part_scan")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "part_cap")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "part_laser")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "part_bin")]);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSflightpacks"), "processing", live(f.src), subtract));
	rt.setSv(f, "part_manip", null);
	rt.setSv(f, "part_scan", null);
	rt.setSv(f, "part_cap", null);
	rt.setSv(f, "part_laser", null);
	rt.setSv(f, "part_bin", null);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/emp_act  (code/modules/clothing/spacesuits/flightsuit.dm:186)
rt.def("/obj/item/device/flightpack/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	let damage: Value = null;
	f.vars = () => [damage];
	damage = 0;
	if (isEqual(live(severity), 1)) {
		damage = rt.sv(f, "emp_strong_damage");
	} else {
		damage = rt.sv(f, "emp_weak_damage");
	}
	if (rt.le(rt.sv(f, "emp_damage"), multiply(rt.sv(f, "emp_disable_threshold"), 1.5))) {
		rt.modSrcVar(f, "emp_damage", live(damage), add);
	}
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "wearer"), "<span class='userdanger'>Flightpack: BZZZZZZZZZZZT</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "wearer"), fmt("<span class='warning'>Flightpack: WARNING: Class ＀ EMP detected! Circuit damage at ＀!</span>", [live(severity), multiply(divide(100, rt.sv(f, "emp_disable_threshold")), rt.sv(f, "emp_damage"))])]);
	return f.dot;
});

// /obj/item/device/flightpack/proc/ui_action_click  (code/modules/clothing/spacesuits/flightsuit.dm:197)  may sleep
rt.def("/obj/item/device/flightpack/proc/ui_action_click", function* ui_action_click(f: Frame, owner: Value, action: Value) {
	f.vars = () => [owner, action];
	if (!isEqual(rt.sv(f, "wearer"), live(owner))) {
		rt.setSv(f, "wearer", live(owner));
	}
	if (!truthy(rt.sv(f, "suit"))) {
		yield* g.srcCall(f, "usermessage", "The flightpack will not work without being attached to a suit first!");
		return 0;
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/flightpack/toggle_flight")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "flight"))) {
			yield* g.srcCall(f, "enable_flight");
		} else {
			yield* g.srcCall(f, "disable_flight");
		}
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/flightpack/engage_boosters")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "boost"))) {
			yield* g.srcCall(f, "activate_booster");
		} else {
			yield* g.srcCall(f, "deactivate_booster");
		}
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/flightpack/toggle_stabilizers")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "stabilizer"))) {
			yield* g.srcCall(f, "enable_stabilizers");
		} else {
			yield* g.srcCall(f, "disable_stabilizers");
		}
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/flightpack/change_power")) ? 1 : 0))) {
		yield* g.srcCall(f, "cycle_power");
	}
	if (!truthy((rt.istype(live(action), T("/datum/action/item_action/flightpack/toggle_airbrake")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.sv(f, "brake"))) {
		yield* g.srcCall(f, "enable_airbrake");
	} else {
		yield* g.srcCall(f, "disable_airbrake");
	}
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/adjust_momentum  (code/modules/clothing/spacesuits/flightsuit.dm:227)
rt.def("/obj/item/device/flightpack/proc/adjust_momentum", function adjust_momentum(f: Frame, amountx: Value, amounty: Value, reduce_amount_total: Value) {
	f.vars = () => [reduce_amount_total];
	if (live(reduce_amount_total) === null) {
		reduce_amount_total = 0;
	}
	if (!isEqual(live(reduce_amount_total), 0)) {
		if (rt.gt(rt.sv(f, "momentum_x"), 0)) {
			rt.setSv(f, "momentum_x", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "momentum_x"), live(reduce_amount_total)), rt.sv(f, "momentum_max")])]));
		} else {
			if (rt.lt(rt.sv(f, "momentum_x"), 0)) {
				rt.setSv(f, "momentum_x", rt.call(f, P("/proc/max"), null, [rt.neg(rt.sv(f, "momentum_max")), rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "momentum_x"), live(reduce_amount_total)), 0])]));
			}
		}
		if (rt.gt(rt.sv(f, "momentum_y"), 0)) {
			rt.setSv(f, "momentum_y", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "momentum_y"), live(reduce_amount_total)), rt.sv(f, "momentum_max")])]));
		} else {
			if (rt.lt(rt.sv(f, "momentum_y"), 0)) {
				rt.setSv(f, "momentum_y", rt.call(f, P("/proc/max"), null, [rt.neg(rt.sv(f, "momentum_max")), rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "momentum_y"), live(reduce_amount_total)), 0])]));
			}
		}
	}
	rt.setSv(f, "momentum_x", rt.call(f, P("/proc/max"), null, [rt.neg(rt.sv(f, "momentum_max")), rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "momentum_x"), live(amountx)), rt.sv(f, "momentum_max")])]));
	rt.setSv(f, "momentum_y", rt.call(f, P("/proc/max"), null, [rt.neg(rt.sv(f, "momentum_max")), rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "momentum_y"), live(amounty)), rt.sv(f, "momentum_max")])]));
	rt.callSrc(f, "calculate_momentum_speed", []);
	return f.dot;
});

// /obj/item/device/flightpack/proc/wearer_movement  (code/modules/clothing/spacesuits/flightsuit.dm:242)
rt.def("/obj/item/device/flightpack/proc/wearer_movement", function wearer_movement(f: Frame, dir: Value) {
	let momentum_increment: Value = null;
	let $0: any;
	f.vars = () => [momentum_increment, $0];
	if (!truthy(rt.sv(f, "flight"))) {
		return live(f.dot);
	}
	momentum_increment = rt.sv(f, "momentum_gain");
	if (truthy(rt.sv(f, "boost"))) {
		momentum_increment = rt.sv(f, "boost_power");
	}
	if (truthy(rt.sv(f, "brake"))) {
		momentum_increment = 0;
	}
	if ((!truthy(rt.sv(f, "gravity")) && !truthy(rt.sv(f, "pressure")))) {
		(momentum_increment = rt.modify(live(momentum_increment), 10, subtract));
	}
	$0 = live(dir);
	if ($0 === 1) {
		rt.callSrc(f, "adjust_momentum", [0, live(momentum_increment)]);
	} else if ($0 === 2) {
		rt.callSrc(f, "adjust_momentum", [0, rt.neg(live(momentum_increment))]);
	} else if ($0 === 4) {
		rt.callSrc(f, "adjust_momentum", [live(momentum_increment), 0]);
	} else if ($0 === 8) {
		rt.callSrc(f, "adjust_momentum", [rt.neg(live(momentum_increment)), 0]);
	}
	return f.dot;
});

// /obj/item/device/flightpack/proc/momentum_drift  (code/modules/clothing/spacesuits/flightsuit.dm:263)  may sleep
rt.def("/obj/item/device/flightpack/proc/momentum_drift", function* momentum_drift(f: Frame) {
	let drift_dir_x: Value = null, drift_dir_y: Value = null, i: Value = null, oldturf: Value = null;
	let $e: any;
	f.vars = () => [drift_dir_x, drift_dir_y, i, oldturf, $e];
	if (!truthy(rt.sv(f, "flight"))) {
		return 0;
	}
	if (truthy(rt.fv(f, "pulling", rt.sv(f, "wearer")))) {
		rt.setSv(f, "dragging_through", rt.fv(f, "pulling", rt.sv(f, "wearer")));
	} else {
		if (truthy(rt.sv(f, "dragging_through"))) {
			rt.setSv(f, "dragging_through", null);
		}
	}
	drift_dir_x = 0;
	drift_dir_y = 0;
	if (rt.gt(rt.sv(f, "momentum_x"), 0)) {
		drift_dir_x = 4;
	}
	if (rt.lt(rt.sv(f, "momentum_x"), 0)) {
		drift_dir_x = 8;
	}
	if (rt.gt(rt.sv(f, "momentum_y"), 0)) {
		drift_dir_y = 1;
	}
	if (rt.lt(rt.sv(f, "momentum_y"), 0)) {
		drift_dir_y = 2;
	}
	if (isEqual(rt.sv(f, "momentum_speed"), 0)) {
		return 0;
	}
	if (!truthy(rt.sv(f, "suit"))) return f.dot;
	if (!truthy(rt.sv(f, "wearer"))) return f.dot;
	if (!truthy(rt.fv(f, "canmove", rt.sv(f, "wearer")))) {
		yield* g.srcCall(f, "losecontrol");
	}
	yield* g.srcCall(f, "momentum_decay");
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "momentum_speed"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		oldturf = rt.getStep(f, rt.sv(f, "wearer"), 0);
		if (rt.ge(rt.sv(f, "momentum_speed_x"), live(i))) {
			yield* g.call(f, P("/proc/step"), null, [rt.sv(f, "wearer"), live(drift_dir_x)]);
		}
		if (rt.ge(rt.sv(f, "momentum_speed_y"), live(i))) {
			yield* g.call(f, P("/proc/step"), null, [rt.sv(f, "wearer"), live(drift_dir_y)]);
		}
		if ((truthy(rt.sv(f, "dragging_through")) && truthy(live(oldturf)))) {
			yield* g.callName(f, rt.sv(f, "dragging_through"), "forceMove", [live(oldturf)]);
			rt.setFv(f, "pulling", rt.sv(f, "wearer"), rt.sv(f, "dragging_through"));
		}
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/momentum_decay  (code/modules/clothing/spacesuits/flightsuit.dm:300)
rt.def("/obj/item/device/flightpack/proc/momentum_decay", function momentum_decay(f: Frame) {
	if (truthy(rt.sv(f, "brake"))) {
		rt.callSrc(f, "adjust_momentum", [0, 0, rt.sv(f, "airbrake_decay_amount")]);
	}
	if (truthy(rt.sv(f, "gravity"))) {
		rt.callSrc(f, "adjust_momentum", [0, 0, rt.sv(f, "gravity_decay_amount")]);
	}
	if (truthy(rt.sv(f, "stabilizer"))) {
		rt.callSrc(f, "adjust_momentum", [0, 0, rt.sv(f, "stabilizer_decay_amount")]);
	}
	if (truthy(rt.sv(f, "pressure"))) {
		rt.callSrc(f, "adjust_momentum", [0, 0, rt.sv(f, "pressure_decay_amount")]);
	}
	rt.callSrc(f, "adjust_momentum", [0, 0, rt.sv(f, "momentum_passive_loss")]);
	return f.dot;
});

// /obj/item/device/flightpack/proc/check_conditions  (code/modules/clothing/spacesuits/flightsuit.dm:313)  may sleep
rt.def("/obj/item/device/flightpack/proc/check_conditions", function* check_conditions(f: Frame) {
	let _T: Value = null, gas: Value = null, envpressure: Value = null;
	f.vars = () => [_T, gas, envpressure];
	if (truthy(rt.sv(f, "suit"))) {
		if (truthy(rt.sv(f, "wearer"))) {
			if (truthy((yield* g.callName(f, rt.sv(f, "wearer"), "has_gravity", [])))) {
				rt.setSv(f, "gravity", 1);
			} else {
				rt.setSv(f, "gravity", 0);
			}
			_T = rt.getStep(f, rt.sv(f, "wearer"), 0);
			gas = (yield* g.callName(f, live(_T), "return_air", []));
			if (rt.ge((envpressure = (yield* g.callName(f, live(gas), "return_pressure", []))), rt.sv(f, "pressure_threshold"))) {
				rt.setSv(f, "pressure", 1);
			} else {
				rt.setSv(f, "pressure", 0);
			}
		}
	}
	if (truthy(rt.sv(f, "flight"))) {
		if (!truthy(rt.sv(f, "assembled"))) {
			yield* g.srcCall(f, "disable_flight", 1);
		}
		if (!truthy(rt.sv(f, "suit"))) {
			yield* g.srcCall(f, "disable_flight", 1);
		}
		if (!truthy(rt.sv(f, "wearer"))) {
			yield* g.srcCall(f, "disable_flight", 1);
		}
	}
	if ((!truthy(rt.sv(f, "pressure")) && truthy(rt.sv(f, "brake")))) {
		rt.setSv(f, "brake", 0);
		yield* g.srcCall(f, "usermessage", "Airbrakes deactivated due to lack of pressure!", 2);
	}
	if (truthy(rt.fv(f, "deployedshoes", rt.sv(f, "suit")))) return f.dot;
	if (!(truthy(rt.sv(f, "brake")) || truthy(rt.sv(f, "stabilizer")))) return f.dot;
	rt.setSv(f, "brake", 0);
	rt.setSv(f, "stabilizer", 0);
	yield* g.srcCall(f, "usermessage", "Warning: Sensor data is not being received from flight shoes. Stabilizers and airbrake modules OFFLINE!", 2);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/update_slowdown  (code/modules/clothing/spacesuits/flightsuit.dm:341)
rt.def("/obj/item/device/flightpack/proc/update_slowdown", function update_slowdown(f: Frame) {
	if (!truthy(rt.sv(f, "flight"))) {
		rt.setFv(f, "slowdown", rt.sv(f, "suit"), rt.sv(f, "slowdown_ground"));
		return live(f.dot);
	} else {
		rt.setFv(f, "slowdown", rt.sv(f, "suit"), rt.sv(f, "slowdown_air"));
	}
	return f.dot;
});

// /obj/item/device/flightpack/proc/process  (code/modules/clothing/spacesuits/flightsuit.dm:348)  may sleep
rt.def("/obj/item/device/flightpack/proc/process", function* process(f: Frame) {
	if ((!truthy(rt.sv(f, "suit")) || isEqual(rt.sv(f, "processing_mode"), 0))) {
		return 0;
	}
	yield* g.srcCall(f, "check_conditions");
	yield* g.srcCall(f, "calculate_momentum_speed");
	yield* g.srcCall(f, "momentum_drift");
	yield* g.srcCall(f, "handle_boost");
	yield* g.srcCall(f, "handle_damage");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/device/flightpack/proc/handle_damage  (code/modules/clothing/spacesuits/flightsuit.dm:358)  may sleep
rt.def("/obj/item/device/flightpack/proc/handle_damage", function* handle_damage(f: Frame) {
	if (truthy(rt.sv(f, "crash_damage"))) {
		rt.setSv(f, "crash_damage", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "crash_damage"), rt.sv(f, "crash_heal_amount")), multiply(rt.sv(f, "crash_disable_threshold"), 10)]))])));
		if (rt.ge(rt.sv(f, "crash_damage"), rt.sv(f, "crash_disable_threshold"))) {
			rt.setSv(f, "crash_disabled", 1);
		}
		if ((truthy(rt.sv(f, "crash_disabled")) && rt.le(rt.sv(f, "crash_damage"), 1))) {
			rt.setSv(f, "crash_disabled", 0);
			rt.setSv(f, "crash_disable_message", 0);
			yield* g.srcCall(f, "usermessage", "Gyroscopic sensors recalibrated. Flight systems re-enabled.");
		}
	}
	if (truthy(rt.sv(f, "emp_damage"))) {
		rt.setSv(f, "emp_damage", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "emp_damage"), rt.sv(f, "emp_heal_amount")), multiply(rt.sv(f, "emp_disable_threshold"), 10)]))])));
		if (rt.ge(rt.sv(f, "emp_damage"), rt.sv(f, "emp_disable_threshold"))) {
			rt.setSv(f, "emp_disabled", 1);
		}
		if ((truthy(rt.sv(f, "emp_disabled")) && rt.le(rt.sv(f, "emp_damage"), 0.5))) {
			rt.setSv(f, "emp_disabled", 0);
			rt.setSv(f, "emp_disable_message", 0);
			yield* g.srcCall(f, "usermessage", "Electromagnetic deflection system re-activated. Flight systems re-enabled.");
		}
	}
	rt.setSv(f, "disabled", add(rt.sv(f, "crash_disabled"), rt.sv(f, "emp_disabled")));
	if (!truthy(rt.sv(f, "disabled"))) return f.dot;
	if ((truthy(rt.sv(f, "crash_disabled")) && !truthy(rt.sv(f, "crash_disable_message")))) {
		yield* g.srcCall(f, "usermessage", "Internal gyroscopes scrambled from excessive impacts.", 2);
		yield* g.srcCall(f, "usermessage", "Deactivating to recalibrate flight systems!", 2);
		rt.setSv(f, "crash_disable_message", 1);
	}
	if ((truthy(rt.sv(f, "emp_disabled")) && !truthy(rt.sv(f, "emp_disable_message")))) {
		yield* g.srcCall(f, "usermessage", "Electromagnetic deflectors overloaded. Short circuit detected in internal systems!", 1);
		yield* g.srcCall(f, "usermessage", "Deactivating to prevent fatal power overload!", 2);
		rt.setSv(f, "emp_disable_message", 1);
	}
	if (!truthy(rt.sv(f, "flight"))) return f.dot;
	yield* g.srcCall(f, "disable_flight", 1);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/update_icon  (code/modules/clothing/spacesuits/flightsuit.dm:387)  may sleep
rt.def("/obj/item/device/flightpack/proc/update_icon", function* update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "flight"))) {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		rt.setSv(f, "item_state", rt.initial(f, live(f.src), "item_state"));
	}
	if (truthy(rt.sv(f, "flight"))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_active"));
		rt.setSv(f, "item_state", rt.sv(f, "item_state_active"));
		if (truthy(rt.sv(f, "boost"))) {
			rt.setSv(f, "icon_state", rt.sv(f, "icon_state_boost"));
			rt.setSv(f, "item_state", rt.sv(f, "item_state_boost"));
		}
	}
	if (truthy(rt.sv(f, "wearer"))) {
		yield* g.callName(f, rt.sv(f, "wearer"), "update_inv_wear_suit", []);
		yield* g.callName(f, rt.sv(f, "wearer"), "update_inv_back", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/handle_boost  (code/modules/clothing/spacesuits/flightsuit.dm:403)  may sleep
rt.def("/obj/item/device/flightpack/proc/handle_boost", function* handle_boost(f: Frame) {
	if (truthy(rt.sv(f, "boost"))) {
		rt.setSv(f, "boost_charge", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "boost_charge"), rt.sv(f, "boost_drain")), rt.sv(f, "boost_maxcharge")]))])));
		if (rt.lt(rt.sv(f, "boost_charge"), 1)) {
			yield* g.srcCall(f, "deactivate_booster");
		}
	}
	if (!rt.lt(rt.sv(f, "boost_charge"), rt.sv(f, "boost_maxcharge"))) return f.dot;
	rt.setSv(f, "boost_charge", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "boost_charge"), rt.sv(f, "boost_chargerate")), rt.sv(f, "boost_maxcharge")]))])));
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/cycle_power  (code/modules/clothing/spacesuits/flightsuit.dm:410)
rt.def("/obj/item/device/flightpack/proc/cycle_power", function cycle_power(f: Frame) {
	if (rt.lt(rt.sv(f, "powersetting"), rt.sv(f, "powersetting_high"))) {
		rt.incSrcVar(f, "powersetting", 1, true);
	} else {
		rt.setSv(f, "powersetting", 1);
	}
	rt.setSv(f, "momentum_gain", multiply(rt.sv(f, "powersetting"), 10));
	rt.callSrc(f, "usermessage", [fmt("Engine output set to ＀.", [rt.sv(f, "momentum_gain")])]);
	rt.setSv(f, "momentum_drift_coeff", divide(multiply(rt.sv(f, "momentum_gain"), multiply(rt.sv(f, "drift_tolerance"), 1.100000023841858)), rt.sv(f, "momentum_max")));
	return f.dot;
});

// /obj/item/device/flightpack/proc/crash_damage  (code/modules/clothing/spacesuits/flightsuit.dm:419)  may sleep
rt.def("/obj/item/device/flightpack/proc/crash_damage", function* crash_damage(f: Frame, density: Value, anchored: Value, speed: Value, victim_name: Value) {
	let crashmessagesrc: Value = null, userdamage: Value = null;
	f.vars = () => [density, anchored, speed, victim_name, crashmessagesrc, userdamage];
	crashmessagesrc = fmt("<span class='userdanger'>＀ violently crashes into ＀, ", [rt.sv(f, "wearer"), live(victim_name)]);
	userdamage = 10;
	(userdamage = rt.modify(live(userdamage), multiply(rt.sv(f, "stabilizer"), 3), subtract));
	(userdamage = rt.modify(live(userdamage), rt.fv(f, "rating", rt.sv(f, "part_bin")), subtract));
	(userdamage = rt.modify(live(userdamage), rt.fv(f, "rating", rt.sv(f, "part_scan")), subtract));
	(userdamage = rt.modify(live(userdamage), rt.fv(f, "rating", rt.sv(f, "part_manip")), subtract));
	userdamage = rt.modify(live(userdamage), multiply(live(anchored), 2), add);
	userdamage = rt.modify(live(userdamage), multiply(rt.sv(f, "boost"), 2), add);
	if (rt.lt((userdamage = rt.modify(live(userdamage), multiply(live(speed), 2), add)), 0)) {
		userdamage = 0;
	}
	if (truthy(live(userdamage))) {
		crashmessagesrc = rt.modify(live(crashmessagesrc), "that really must have hurt!", add);
	} else {
		crashmessagesrc = rt.modify(live(crashmessagesrc), fmt("but luckily ＀'s impact was absorbed by their suit's stabilizers!</span>", [rt.sv(f, "wearer")]), add);
	}
	yield* g.callName(f, rt.sv(f, "wearer"), "adjustBruteLoss", [live(userdamage)]);
	yield* g.srcCall(f, "usermessage", "WARNING: Stabilizers taking damage!", 2);
	yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [live(crashmessagesrc)]);
	rt.setSv(f, "crash_damage", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "crash_damage"), rt.sv(f, "crash_damage_high")), multiply(rt.sv(f, "crash_disable_threshold"), 1.5)]))])));
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/userknockback  (code/modules/clothing/spacesuits/flightsuit.dm:440)  may sleep
rt.def("/obj/item/device/flightpack/proc/userknockback", function* userknockback(f: Frame, density: Value, anchored: Value, speed: Value, dir: Value) {
	let angle: Value = null, target: Value = null;
	f.vars = () => [density, anchored, speed, dir, angle, target];
	angle = (yield* g.call(f, P("/proc/dir2angle"), null, [live(dir)]));
	if (rt.gt((angle = rt.modify(live(angle), 180, add)), 360)) {
		(angle = rt.modify(live(angle), 360, subtract));
	}
	dir = (yield* g.call(f, P("/proc/angle2dir"), null, [live(angle)]));
	target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [rt.getStep(f, rt.sv(f, "wearer"), 0), live(dir)]));
	yield* g.callName(f, rt.sv(f, "wearer"), "throw_at", [live(target), add(add(live(speed), live(density)), live(anchored)), 2, rt.sv(f, "wearer")]);
	yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [fmt("＀ is knocked flying by the impact!", [rt.sv(f, "wearer")])]);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/flight_impact  (code/modules/clothing/spacesuits/flightsuit.dm:450)  may sleep
rt.def("/obj/item/device/flightpack/proc/flight_impact", function* flight_impact(f: Frame, unmovablevictim: Value, crashdir: Value) {
	let crashpower: Value = null, density: Value = null, anchored: Value = null, damage: Value = null, L: Value = null, S: Value = null, D: Value = null, victim: Value = null;
	f.vars = () => [unmovablevictim, crashdir, crashpower, density, anchored, damage, L, S, D, victim];
	if (((isEqual(live(unmovablevictim), rt.sv(f, "wearer")) || truthy(rt.sv(f, "crashing"))) || isEqual(rt.sv(f, "processing_mode"), 0))) {
		return 0;
	}
	rt.setSv(f, "crashing", 1);
	crashpower = 0;
	if ((isEqual(live(crashdir), 1) || isEqual(live(crashdir), 2))) {
		crashpower = rt.sv(f, "momentum_speed_y");
	} else {
		if ((isEqual(live(crashdir), 4) || isEqual(live(crashdir), 8))) {
			crashpower = rt.sv(f, "momentum_speed_x");
		}
	}
	if (!truthy(rt.sv(f, "flight"))) {
		rt.setSv(f, "crashing", 0);
		return 0;
	}
	if (truthy(rt.sv(f, "boost"))) {
		crashpower = 3;
	}
	if (!truthy(live(crashpower))) {
		rt.setSv(f, "crashing", 0);
		return 0;
	}
	density = 0;
	anchored = 1;
	damage = 0;
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(unmovablevictim)])))) {
		if ((truthy(rt.gv(f, "throwing", (L = live(unmovablevictim)))) || isEqual(rt.fv(f, "pulledby", live(L)), rt.sv(f, "wearer")))) {
			rt.setSv(f, "crashing", 0);
			return 0;
		}
		if (truthy(rt.fv(f, "buckled", live(L)))) {
			yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [fmt("<span class='warning'>＀ reflexively flies over ＀!</span>", [rt.sv(f, "wearer"), live(L)])]);
			yield* g.callName(f, rt.sv(f, "wearer"), "forceMove", [rt.getStep(f, live(L), 0)]);
			rt.setSv(f, "crashing", 0);
			return 0;
		}
		yield* g.callName(f, rt.fv(f, "user", rt.sv(f, "suit")), "forceMove", [rt.getStep(f, live(unmovablevictim), 0)]);
		rt.setSv(f, "crashing", 0);
		yield* g.srcCall(f, "mobknockback", live(L), live(crashpower), live(crashdir));
		damage = 0;
		density = 1;
		anchored = 0;
	} else {
		if (truthy((rt.istype(live(unmovablevictim), T("/obj/structure/grille")) ? 1 : 0))) {
			if (rt.gt(live(crashpower), 1)) {
				yield* g.srcCall(f, "crash_grille", (S = live(unmovablevictim)));
			}
			rt.setSv(f, "crashing", 0);
			return 0;
		} else {
			if ((truthy((rt.istype(live(unmovablevictim), T("/obj/machinery/door")) ? 1 : 0)) && !truthy((rt.istype(live(unmovablevictim), T("/obj/machinery/door/poddoor")) ? 1 : 0)))) {
				if (!truthy((yield* g.srcCall(f, "airlock_hit", (D = live(unmovablevictim)))))) {
					rt.setSv(f, "crashing", 0);
					return 0;
				} else {
					if (rt.lt(rt.sv(f, "momentum_speed"), 3)) {
						rt.setSv(f, "crashing", 0);
						return 0;
					}
				}
				damage = 1;
				anchored = 1;
				density = 0;
			} else {
				if (truthy((rt.istype(live(unmovablevictim), T("/obj/structure/mineral_door")) ? 1 : 0))) {
					yield* g.srcCall(f, "door_hit", (D = live(unmovablevictim)));
					rt.setSv(f, "crashing", 0);
					return 0;
				} else {
					if (truthy((rt.istype(live(unmovablevictim), T("/turf/closed")) ? 1 : 0))) {
						if (rt.lt(live(crashpower), 3)) {
							rt.setSv(f, "crashing", 0);
							return 0;
						}
						damage = 1;
						density = 1;
						anchored = 1;
					} else {
						if (truthy((rt.istype(live(unmovablevictim), T("/atom/movable")) ? 1 : 0))) {
							victim = live(unmovablevictim);
							if ((rt.lt(live(crashpower), 3) || truthy(rt.fv(f, "throwing", live(victim))))) {
								rt.setSv(f, "crashing", 0);
								return 0;
							}
							density = rt.fv(f, "density", live(victim));
							anchored = rt.fv(f, "anchored", live(victim));
							yield* g.srcCall(f, "victimknockback", live(victim), live(crashpower), live(crashdir));
							if (truthy(live(anchored))) {
								damage = 1;
							}
						}
					}
				}
			}
		}
	}
	if (truthy(live(damage))) {
		yield* g.srcCall(f, "crash_damage", live(density), live(anchored), rt.sv(f, "momentum_speed"), rt.fv(f, "name", live(unmovablevictim)));
		yield* g.srcCall(f, "userknockback", live(density), live(anchored), rt.sv(f, "momentum_speed"), rt.sv(f, "dir"));
		yield* g.callSrc(f, "losecontrol", ["knockdown", 0, "move", 0], rt.Args.Named);
	}
	rt.setSv(f, "crashing", 0);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/door_hit  (code/modules/clothing/spacesuits/flightsuit.dm:532)  may sleep
rt.def("/obj/item/device/flightpack/proc/door_hit", function* door_hit(f: Frame, door: Value) {
	f.vars = () => [door];
	rt.spawnTail(f, 0, "/obj/item/device/flightpack/proc/door_hit: spawn at modules/clothing/spacesuits/flightsuit.dm:532", door);
	yield* g.callName(f, rt.sv(f, "wearer"), "forceMove", [rt.getStep(f, live(door), 0)]);
	if (truthy(rt.sv(f, "dragging_through"))) {
		yield* g.callName(f, rt.sv(f, "dragging_through"), "forceMove", [rt.getStep(f, live(door), 0)]);
		rt.setFv(f, "pulling", rt.sv(f, "wearer"), rt.sv(f, "dragging_through"));
	}
	yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [fmt("<span class='boldnotice'>＀ rolls to their sides and slips past ＀!</span>", [rt.sv(f, "wearer"), live(door)])]);
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/device/flightpack/proc/door_hit, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/flightpack/proc/door_hit: spawn at modules/clothing/spacesuits/flightsuit.dm:532", function* (f: Frame, door: Value) {
	f.vars = () => [door];
	yield* g.callName(f, live(door), "Open", []);
	return null;
});

// /obj/item/device/flightpack/proc/crash_grille  (code/modules/clothing/spacesuits/flightsuit.dm:541)  may sleep
rt.def("/obj/item/device/flightpack/proc/crash_grille", function* crash_grille(f: Frame, target: Value) {
	f.vars = () => [target];
	yield* g.callName(f, live(target), "hitby", [rt.sv(f, "wearer")]);
	yield* g.callName(f, live(target), "take_damage", [60, "brute", "melee", 1]);
	if (!truthy((yield* g.callName(f, rt.sv(f, "wearer"), "Move", [rt.fv(f, "loc", live(target))])))) return f.dot;
	yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [fmt("<span class='warning'>＀ smashes straight past ＀!</span>", [rt.sv(f, "wearer"), live(target)])]);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/airlock_hit  (code/modules/clothing/spacesuits/flightsuit.dm:548)  may sleep
rt.def("/obj/item/device/flightpack/proc/airlock_hit", function* airlock_hit(f: Frame, A: Value) {
	let pass: Value = null, target: Value = null;
	f.vars = () => [A, pass, target];
	pass = 0;
	if (truthy(rt.fv(f, "density", live(A)))) {
		pass = rt.modify(live(pass), rt.fv(f, "locked", live(A)), add);
		pass = rt.modify(live(pass), rt.fv(f, "stat", live(A)), add);
		pass = rt.modify(live(pass), rt.fv(f, "emagged", live(A)), add);
		pass = rt.modify(live(pass), rt.fv(f, "welded", live(A)), add);
		if (truthy((yield* g.callName(f, live(A), "requiresID", [])))) {
			if ((!truthy((yield* g.callName(f, live(A), "allowed", [rt.sv(f, "wearer")]))) && !truthy(rt.fv(f, "emergency", live(A))))) {
				pass = rt.modify(live(pass), 1, add);
			}
		}
	} else {
		return live(pass);
	}
	if (!truthy(live(pass))) {
		rt.spawnTail(f, 0, "/obj/item/device/flightpack/proc/airlock_hit: spawn at modules/clothing/spacesuits/flightsuit.dm:559", A, pass, target);
		yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [fmt("<span class='warning'>＀ rolls sideways and slips past ＀</span>", [rt.sv(f, "wearer"), live(A)])]);
		target = rt.getStep(f, live(A), 0);
		if ((truthy((rt.istype(live(A), T("/obj/machinery/door/window")) ? 1 : 0)) && isEqual(rt.getStep(f, rt.sv(f, "wearer"), 0), rt.getStep(f, live(A), 0)))) {
			target = rt.getStep(f, live(A), rt.fv(f, "dir", live(A)));
		}
		yield* g.callName(f, rt.sv(f, "wearer"), "forceMove", [live(target)]);
		if (truthy(rt.sv(f, "dragging_through"))) {
			yield* g.callName(f, rt.sv(f, "dragging_through"), "forceMove", [live(target)]);
			rt.setFv(f, "pulling", rt.sv(f, "wearer"), rt.sv(f, "dragging_through"));
		}
	}
	return live(pass);
}, true);

// a spawn(0) body of /obj/item/device/flightpack/proc/airlock_hit, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/flightpack/proc/airlock_hit: spawn at modules/clothing/spacesuits/flightsuit.dm:559", function* (f: Frame, A: Value, pass: Value, target: Value) {
	f.vars = () => [A, pass, target];
	yield* g.callName(f, live(A), "open", []);
	return null;
});

// /obj/item/device/flightpack/proc/mobknockback  (code/modules/clothing/spacesuits/flightsuit.dm:573)  may sleep
rt.def("/obj/item/device/flightpack/proc/mobknockback", function* mobknockback(f: Frame, victim: Value, power: Value, direction: Value) {
	f.vars = () => [victim, power, direction];
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(victim)])))) {
		return 0;
	}
	yield* g.callName(f, rt.sv(f, "wearer"), "forceMove", [rt.getStep(f, live(victim), 0)]);
	yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [fmt("<span class='notice'>＀ flies over ＀!</span>", [rt.sv(f, "wearer"), live(victim)])]);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/victimknockback  (code/modules/clothing/spacesuits/flightsuit.dm:579)  may sleep
rt.def("/obj/item/device/flightpack/proc/victimknockback", function* victimknockback(f: Frame, victim: Value, power: Value, direction: Value) {
	let knockback: Value = null, damage: Value = null, target: Value = null, i: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [victim, power, direction, knockback, damage, target, i, O, $e];
	if (!truthy(live(victim))) {
		return 0;
	}
	knockback = 0;
	damage = 0;
	(knockback = rt.modify(live(knockback), multiply(rt.sv(f, "density"), 2), subtract));
	knockback = rt.modify(live(knockback), live(power), add);
	knockback = rt.modify(live(knockback), divide(rt.fv(f, "rating", rt.sv(f, "part_manip")), 2), add);
	knockback = rt.modify(live(knockback), divide(rt.fv(f, "rating", rt.sv(f, "part_bin")), 2), add);
	(knockback = rt.modify(live(knockback), 4, multiply));
	if (truthy(rt.fv(f, "anchored", live(victim)))) {
		knockback = 0;
	}
	damage = multiply(live(power), 14);
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(victim)])))) {
		yield* g.srcCall(f, "mobknockback", live(victim), live(power), live(direction));
		return 0;
	}
	if (truthy(rt.sv(f, "anchored"))) {
		knockback = 0;
	}
	yield* g.callName(f, live(victim), "visible_message", [fmt("<span class='warning'>＀ is sent flying by the impact!</span>", [rt.fv(f, "name", live(victim))])]);
	target = rt.getStep(f, live(victim), 0);
	i = null;
	rt.forRange(f, 0, 1, live(knockback), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		target = rt.getStep(f, live(target), live(direction));
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, divide(live(knockback), 3), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		target = rt.getStep(f, live(target), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")]));
	}
	rt.endFor(f, 0);
	if (truthy(live(knockback))) {
		yield* g.callName(f, live(victim), "throw_at", [live(target), live(knockback), rt.fv(f, "rating", rt.sv(f, "part_manip"))]);
	}
	if (!truthy((rt.istype(live(victim), T("/obj")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (O = live(victim)), "take_damage", [live(damage)]);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/losecontrol  (code/modules/clothing/spacesuits/flightsuit.dm:609)  may sleep
rt.def("/obj/item/device/flightpack/proc/losecontrol", function* losecontrol(f: Frame, knockdown: Value, move: Value) {
	f.vars = () => [knockdown, move];
	if (live(knockdown) === null) {
		knockdown = 0;
	}
	if (live(move) === null) {
		move = 1;
	}
	if (!truthy(live(move))) {
		rt.setSv(f, "momentum_x", 0);
		rt.setSv(f, "momentum_y", 0);
		yield* g.srcCall(f, "calculate_momentum_speed");
	}
	yield* g.srcCall(f, "usermessage", "Warning: Control system not responding. Deactivating!", 3);
	yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [fmt("<span class='warning'>＀'s flight suit abruptly shuts off and they lose control!</span>", [rt.sv(f, "wearer")])]);
	if (truthy(rt.sv(f, "wearer"))) {
		if (truthy(live(move))) {
			while (!isEqual(rt.sv(f, "momentum_x"), 0) || !isEqual(rt.sv(f, "momentum_y"), 0)) {
				yield* g.call(f, P("/proc/sleep"), null, [2]);
				yield* g.call(f, P("/proc/step"), null, [rt.sv(f, "wearer"), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
				yield* g.srcCall(f, "momentum_decay");
				yield* g.srcCall(f, "adjust_momentum", 0, 0, 10);
			}
		}
		yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [fmt("<span class='warning'>＀'s flight suit crashes into the ground!</span>", [rt.sv(f, "wearer")])]);
		if (truthy(live(knockdown))) {
			yield* g.callName(f, rt.sv(f, "wearer"), "Knockdown", [80]);
		}
	}
	rt.setSv(f, "momentum_x", 0);
	rt.setSv(f, "momentum_y", 0);
	if (!truthy(rt.sv(f, "flight"))) return f.dot;
	yield* g.srcCall(f, "disable_flight", 0);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/enable_flight  (code/modules/clothing/spacesuits/flightsuit.dm:631)  may sleep
rt.def("/obj/item/device/flightpack/proc/enable_flight", function* enable_flight(f: Frame, forced: Value) {
	f.vars = () => [forced];
	if (live(forced) === null) {
		forced = 0;
	}
	if (!truthy(rt.sv(f, "suit"))) {
		yield* g.srcCall(f, "usermessage", "Warning: Flightpack not linked to compatible flight-suit mount!", 2);
	}
	if (truthy(rt.sv(f, "disabled"))) {
		yield* g.srcCall(f, "usermessage", "Internal systems recalibrating. Unable to safely proceed.", 2);
	}
	(rt.modField(f, rt.sv(f, "wearer"), "movement_type", 2, rt.bitOr));
	(rt.modField(f, rt.sv(f, "wearer"), "pass_flags", rt.sv(f, "flight_passflags"), rt.bitOr));
	yield* g.srcCall(f, "usermessage", "ENGAGING FLIGHT ENGINES.");
	yield* g.srcCall(f, "update_slowdown");
	rt.setFv(f, "floating", rt.sv(f, "wearer"), 1);
	yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [fmt("<font color='blue' size='2'>＀'s flight engines activate as they lift into the air!</font>", [rt.sv(f, "wearer")])]);
	rt.setSv(f, "flight", 1);
	if (truthy(rt.fv(f, "shoes", rt.sv(f, "suit")))) {
		yield* g.callName(f, rt.fv(f, "shoes", rt.sv(f, "suit")), "toggle", [1]);
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.callName(f, rt.sv(f, "ion_trail"), "start", []);
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/disable_flight  (code/modules/clothing/spacesuits/flightsuit.dm:650)  may sleep
rt.def("/obj/item/device/flightpack/proc/disable_flight", function* disable_flight(f: Frame, forced: Value) {
	let _T: Value = null;
	f.vars = () => [forced, _T];
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(live(forced))) {
		yield* g.callSrc(f, "losecontrol", ["knockdown", 1], rt.Args.Named);
		return 1;
	}
	if (rt.le(rt.sv(f, "momentum_speed"), 1)) {
		rt.setSv(f, "momentum_x", 0);
		rt.setSv(f, "momentum_y", 0);
		yield* g.srcCall(f, "usermessage", "DISENGAGING FLIGHT ENGINES.");
		yield* g.srcCall(f, "update_slowdown");
		rt.setFv(f, "floating", rt.sv(f, "wearer"), 0);
		yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [fmt("<font color='blue' size='2'>＀ drops to the ground as their flight engines cut out!</font>", [rt.sv(f, "wearer")])]);
		yield* g.callName(f, rt.sv(f, "ion_trail"), "stop", []);
		(rt.modField(f, rt.sv(f, "wearer"), "movement_type", 16777213, rt.bitAnd));
		(rt.modField(f, rt.sv(f, "wearer"), "pass_flags", rt.op(f, "BitNot", [], [rt.sv(f, "flight_passflags")]), rt.bitAnd));
		rt.setSv(f, "flight", 0);
		if (truthy(rt.fv(f, "shoes", rt.sv(f, "suit")))) {
			yield* g.callName(f, rt.fv(f, "shoes", rt.sv(f, "suit")), "toggle", [0]);
		}
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "wearer"))])))) {
			yield* g.callName(f, (_T = rt.fv(f, "loc", rt.sv(f, "wearer"))), "Entered", [live(f.src)]);
		}
	} else {
		if (truthy(rt.sv(f, "override_safe"))) {
			yield* g.srcCall(f, "disable_flight", 1);
			return 1;
		}
		yield* g.srcCall(f, "usermessage", "Warning: Velocity too high to safely disengage. Retry to confirm emergency shutoff.", 2);
		rt.setSv(f, "override_safe", 1);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/device/flightpack/proc/enable_safe")])), 50]);
		return 0;
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/dropped  (code/modules/clothing/spacesuits/flightsuit.dm:684)  may sleep
rt.def("/obj/item/device/flightpack/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["wearer"] });

// /obj/item/device/flightpack/proc/item_action_slot_check  (code/modules/clothing/spacesuits/flightsuit.dm:687)
rt.def("/obj/item/device/flightpack/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (!isEqual(live(slot), 1024)) return f.dot;
	return 1;
});

// /obj/item/device/flightpack/proc/equipped  (code/modules/clothing/spacesuits/flightsuit.dm:691)  may sleep
rt.def("/obj/item/device/flightpack/proc/equipped", function* equipped(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.setSv(f, "wearer", live(f.args[0]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/device/flightpack/proc/calculate_momentum_speed  (code/modules/clothing/spacesuits/flightsuit.dm:696)
rt.def("/obj/item/device/flightpack/proc/calculate_momentum_speed", function calculate_momentum_speed(f: Frame) {
	if (rt.ge(rt.op(f, "Abs", [], [rt.sv(f, "momentum_x")]), multiply(rt.sv(f, "momentum_crash_coeff"), rt.sv(f, "momentum_max")))) {
		rt.setSv(f, "momentum_speed_x", 3);
	} else {
		if (rt.ge(rt.op(f, "Abs", [], [rt.sv(f, "momentum_x")]), multiply(rt.sv(f, "momentum_impact_coeff"), rt.sv(f, "momentum_max")))) {
			rt.setSv(f, "momentum_speed_x", 2);
		} else {
			if (rt.ge(rt.op(f, "Abs", [], [rt.sv(f, "momentum_x")]), multiply(rt.sv(f, "momentum_drift_coeff"), rt.sv(f, "momentum_max")))) {
				rt.setSv(f, "momentum_speed_x", 1);
			} else {
				rt.setSv(f, "momentum_speed_x", 0);
			}
		}
	}
	if (rt.ge(rt.op(f, "Abs", [], [rt.sv(f, "momentum_y")]), multiply(rt.sv(f, "momentum_crash_coeff"), rt.sv(f, "momentum_max")))) {
		rt.setSv(f, "momentum_speed_y", 3);
	} else {
		if (rt.ge(rt.op(f, "Abs", [], [rt.sv(f, "momentum_y")]), multiply(rt.sv(f, "momentum_impact_coeff"), rt.sv(f, "momentum_max")))) {
			rt.setSv(f, "momentum_speed_y", 2);
		} else {
			if (rt.ge(rt.op(f, "Abs", [], [rt.sv(f, "momentum_y")]), multiply(rt.sv(f, "momentum_drift_coeff"), rt.sv(f, "momentum_max")))) {
				rt.setSv(f, "momentum_speed_y", 1);
			} else {
				rt.setSv(f, "momentum_speed_y", 0);
			}
		}
	}
	rt.setSv(f, "momentum_speed", rt.call(f, P("/proc/max"), null, [rt.sv(f, "momentum_speed_x"), rt.sv(f, "momentum_speed_y")]));
	return f.dot;
});

// /obj/item/device/flightpack/proc/item_action_slot_check  (code/modules/clothing/spacesuits/flightsuit.dm:715)
rt.def("/obj/item/device/flightpack/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (!isEqual(live(slot), 1)) return f.dot;
	return 1;
});

// /obj/item/device/flightpack/proc/enable_stabilizers  (code/modules/clothing/spacesuits/flightsuit.dm:719)
rt.def("/obj/item/device/flightpack/proc/enable_stabilizers", function enable_stabilizers(f: Frame) {
	rt.callSrc(f, "usermessage", ["Activating automatic stabilization controller and enabling maneuvering assistance."]);
	rt.setSv(f, "stabilizer", 1);
	return f.dot;
});

// /obj/item/device/flightpack/proc/disable_stabilizers  (code/modules/clothing/spacesuits/flightsuit.dm:725)
rt.def("/obj/item/device/flightpack/proc/disable_stabilizers", function disable_stabilizers(f: Frame) {
	if (truthy(rt.sv(f, "wearer"))) {
		if (truthy(rt.sv(f, "brake"))) {
			rt.callSrc(f, "disable_airbrake", []);
		}
		rt.callSrc(f, "usermessage", ["Deactivating stabilization controllers!", 2]);
	}
	rt.setSv(f, "stabilizer", 0);
	return f.dot;
});

// /obj/item/device/flightpack/proc/activate_booster  (code/modules/clothing/spacesuits/flightsuit.dm:730)  may sleep
rt.def("/obj/item/device/flightpack/proc/activate_booster", function* activate_booster(f: Frame) {
	if (!truthy(rt.sv(f, "flight"))) {
		yield* g.srcCall(f, "usermessage", "Error: Engines offline!", 2);
		return 0;
	}
	if (rt.lt(rt.sv(f, "boost_charge"), 5)) {
		yield* g.srcCall(f, "usermessage", "Insufficient charge in boost capacitors to engage.", 2);
		return 0;
	}
	yield* g.srcCall(f, "usermessage", "Boosters engaged!");
	yield* g.callName(f, rt.sv(f, "wearer"), "visible_message", [fmt("<span class='notice'>＀'s flightpack engines flare in intensity as they are rocketed forward by the immense thrust!</span>", [rt.fv(f, "name", rt.sv(f, "wearer"))])]);
	rt.setSv(f, "boost", 1);
	yield* g.srcCall(f, "update_slowdown");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/deactivate_booster  (code/modules/clothing/spacesuits/flightsuit.dm:743)  may sleep
rt.def("/obj/item/device/flightpack/proc/deactivate_booster", function* deactivate_booster(f: Frame) {
	yield* g.srcCall(f, "usermessage", "Boosters disengaged!");
	rt.setSv(f, "boost", 0);
	yield* g.srcCall(f, "update_slowdown");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/flightpack/proc/enable_airbrake  (code/modules/clothing/spacesuits/flightsuit.dm:750)
rt.def("/obj/item/device/flightpack/proc/enable_airbrake", function enable_airbrake(f: Frame) {
	if (truthy(rt.sv(f, "wearer"))) {
		if (!truthy(rt.sv(f, "stabilizer"))) {
			rt.callSrc(f, "enable_stabilizers", []);
			rt.callSrc(f, "usermessage", ["Stabilizers activated!"]);
		}
		rt.callSrc(f, "usermessage", ["Airbrakes extended!"]);
	}
	rt.setSv(f, "brake", 1);
	rt.callSrc(f, "update_slowdown", []);
	return f.dot;
});

// /obj/item/device/flightpack/proc/disable_airbrake  (code/modules/clothing/spacesuits/flightsuit.dm:759)
rt.def("/obj/item/device/flightpack/proc/disable_airbrake", function disable_airbrake(f: Frame) {
	if (truthy(rt.sv(f, "wearer"))) {
		rt.callSrc(f, "usermessage", ["Airbrakes retracted!"]);
	}
	rt.setSv(f, "brake", 0);
	rt.callSrc(f, "update_slowdown", []);
	return f.dot;
});

// /obj/item/device/flightpack/proc/on_mob_move  (code/modules/clothing/spacesuits/flightsuit.dm:764)
rt.def("/obj/item/device/flightpack/proc/on_mob_move", function on_mob_move(f: Frame, dir: Value, mob: Value) {
	rt.callSrc(f, "wearer_movement", [live(dir)]);
	return f.dot;
});

// /obj/item/device/flightpack/proc/relink_suit  (code/modules/clothing/spacesuits/flightsuit.dm:767)
rt.def("/obj/item/device/flightpack/proc/relink_suit", function relink_suit(f: Frame, F: Value) {
	if ((truthy(rt.sv(f, "suit")) && isEqual(rt.sv(f, "suit"), live(F)))) {
		return 0;
	} else {
		rt.callSrc(f, "delink_suit", []);
	}
	if (truthy((rt.istype(live(F), T("/obj/item/clothing/suit/space/hardsuit/flightsuit")) ? 1 : 0))) {
		rt.setSv(f, "suit", live(F));
		rt.setFv(f, "pack", rt.sv(f, "suit"), live(f.src));
	} else {
		rt.setSv(f, "suit", null);
	}
	return f.dot;
});

// /obj/item/device/flightpack/proc/delink_suit  (code/modules/clothing/spacesuits/flightsuit.dm:779)
rt.def("/obj/item/device/flightpack/proc/delink_suit", function delink_suit(f: Frame) {
	if (truthy(rt.sv(f, "suit"))) {
		if ((truthy(rt.fv(f, "pack", rt.sv(f, "suit"))) && isEqual(rt.fv(f, "pack", rt.sv(f, "suit")), live(f.src)))) {
			rt.setFv(f, "pack", rt.sv(f, "suit"), null);
		}
	}
	rt.setSv(f, "suit", null);
	return f.dot;
});

// /obj/item/device/flightpack/proc/usermessage  (code/modules/clothing/spacesuits/flightsuit.dm:784)
rt.def("/obj/item/device/flightpack/proc/usermessage", function usermessage(f: Frame, message: Value, urgency: Value) {
	f.vars = () => [urgency];
	if (live(urgency) === null) {
		urgency = 0;
	}
	if (isEqual(live(urgency), 0)) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "wearer"), fmt("＀|<span class='boldnotice'>＀</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(message)])]);
	}
	if (isEqual(live(urgency), 1)) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "wearer"), fmt("＀|<span class='warning'>＀</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(message)])]);
	}
	if (isEqual(live(urgency), 2)) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "wearer"), fmt("＀|<span class='boldwarning'>＀</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(message)])]);
	}
	if (!isEqual(live(urgency), 3)) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "wearer"), fmt("＀|<span class='userdanger'>＀</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(message)])]);
	return f.dot;
});

// /obj/item/device/flightpack/proc/attackby  (code/modules/clothing/spacesuits/flightsuit.dm:794)  may sleep
rt.def("/obj/item/device/flightpack/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if ((truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		rt.setSv(f, "wearer", live(f.args[1]));
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts")) ? 1 : 0))) {
		if (truthy((rt.istype((S = live(f.args[0])), T("/obj/item/weapon/stock_parts/manipulator")) ? 1 : 0))) {
			yield* g.srcCall(f, "usermessage", fmt("＀ has been sucessfully installed into systems.", [live(f.args[0])]));
			if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				if (truthy(rt.sv(f, "part_manip"))) {
					yield* g.callName(f, rt.sv(f, "part_manip"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
					rt.setSv(f, "part_manip", null);
				}
				rt.setSv(f, "part_manip", live(f.args[0]));
			}
		}
		if (truthy((rt.istype(live(S), T("/obj/item/weapon/stock_parts/scanning_module")) ? 1 : 0))) {
			yield* g.srcCall(f, "usermessage", fmt("＀ has been sucessfully installed into systems.", [live(f.args[0])]));
			if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				if (truthy(rt.sv(f, "part_scan"))) {
					yield* g.callName(f, rt.sv(f, "part_scan"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
					rt.setSv(f, "part_scan", null);
				}
				rt.setSv(f, "part_scan", live(f.args[0]));
			}
		}
		if (truthy((rt.istype(live(S), T("/obj/item/weapon/stock_parts/micro_laser")) ? 1 : 0))) {
			yield* g.srcCall(f, "usermessage", fmt("＀ has been sucessfully installed into systems.", [live(f.args[0])]));
			if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				if (truthy(rt.sv(f, "part_laser"))) {
					yield* g.callName(f, rt.sv(f, "part_laser"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
					rt.setSv(f, "part_laser", null);
				}
				rt.setSv(f, "part_laser", live(f.args[0]));
			}
		}
		if (truthy((rt.istype(live(S), T("/obj/item/weapon/stock_parts/matter_bin")) ? 1 : 0))) {
			yield* g.srcCall(f, "usermessage", fmt("＀ has been sucessfully installed into systems.", [live(f.args[0])]));
			if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				if (truthy(rt.sv(f, "part_bin"))) {
					yield* g.callName(f, rt.sv(f, "part_bin"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
					rt.setSv(f, "part_bin", null);
				}
				rt.setSv(f, "part_bin", live(f.args[0]));
			}
		}
		if (truthy((rt.istype(live(S), T("/obj/item/weapon/stock_parts/capacitor")) ? 1 : 0))) {
			yield* g.srcCall(f, "usermessage", fmt("＀ has been sucessfully installed into systems.", [live(f.args[0])]));
			if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				if (truthy(rt.sv(f, "part_cap"))) {
					yield* g.callName(f, rt.sv(f, "part_cap"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
					rt.setSv(f, "part_cap", null);
				}
				rt.setSv(f, "part_cap", live(f.args[0]));
			}
		}
	}
	yield* g.srcCall(f, "update_parts");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /mob/living/carbon/proc/get_flightpack  (code/modules/clothing/spacesuits/flightsuit.dm:842)
rt.def("/mob/living/carbon/proc/get_flightpack", function get_flightpack(f: Frame) {
	let F: Value = null;
	f.vars = () => [F];
	if (truthy((rt.istype((F = rt.sv(f, "back")), T("/obj/item/device/flightpack")) ? 1 : 0))) {
		return live(F);
	} else {
		return 0;
	}
	return f.dot;
});

rt.type(8512, "/obj/item/clothing/shoes/flightshoes", "/obj/item/clothing/shoes", {
	suit: null,
	pack: null,
	wearer: null,
	active: 0,
	name: "flight shoes",
	desc: "A pair of specialized boots that contain stabilizers and sensors necessary for flight gear to work.",
	icon_state: "flightshoes",
	item_state: "flightshoes_mob",
	resistance_flags: 34,
});

// /obj/item/clothing/shoes/flightshoes/proc/Destroy  (code/modules/clothing/spacesuits/flightsuit.dm:867)  may sleep
rt.def("/obj/item/clothing/shoes/flightshoes/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "suit"))) {
		rt.setFv(f, "shoes", rt.sv(f, "suit"), null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/shoes/flightshoes/proc/toggle  (code/modules/clothing/spacesuits/flightsuit.dm:872)
rt.def("/obj/item/clothing/shoes/flightshoes/proc/toggle", function toggle(f: Frame, toggle: Value) {
	if (!truthy(rt.sv(f, "suit"))) return f.dot;
	rt.setSv(f, "active", live(toggle));
	if (truthy(rt.sv(f, "active"))) {
		(rt.modField(f, live(f.src), "flags", 1024, rt.bitOr));
	}
	if (truthy(rt.sv(f, "active"))) return f.dot;
	(rt.modField(f, live(f.src), "flags", 16776191, rt.bitAnd));
	return f.dot;
});

// /obj/item/clothing/shoes/flightshoes/proc/dropped  (code/modules/clothing/spacesuits/flightsuit.dm:879)  may sleep
rt.def("/obj/item/clothing/shoes/flightshoes/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["wearer"] });

// /obj/item/clothing/shoes/flightshoes/proc/item_action_slot_check  (code/modules/clothing/spacesuits/flightsuit.dm:882)
rt.def("/obj/item/clothing/shoes/flightshoes/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (!isEqual(live(slot), 12)) return f.dot;
	return 1;
});

// /obj/item/clothing/shoes/flightshoes/proc/delink_suit  (code/modules/clothing/spacesuits/flightsuit.dm:887)
rt.def("/obj/item/clothing/shoes/flightshoes/proc/delink_suit", function delink_suit(f: Frame) {
	if (truthy(rt.sv(f, "suit"))) {
		if ((truthy(rt.fv(f, "shoes", rt.sv(f, "suit"))) && isEqual(rt.fv(f, "shoes", rt.sv(f, "suit")), live(f.src)))) {
			rt.setFv(f, "shoes", rt.sv(f, "suit"), null);
		}
	}
	rt.setSv(f, "suit", null);
	return f.dot;
});

// /obj/item/clothing/shoes/flightshoes/proc/relink_suit  (code/modules/clothing/spacesuits/flightsuit.dm:892)
rt.def("/obj/item/clothing/shoes/flightshoes/proc/relink_suit", function relink_suit(f: Frame, F: Value) {
	if ((truthy(rt.sv(f, "suit")) && isEqual(rt.sv(f, "suit"), live(F)))) {
		return 0;
	} else {
		rt.callSrc(f, "delink_suit", []);
	}
	if (truthy((rt.istype(live(F), T("/obj/item/clothing/suit/space/hardsuit/flightsuit")) ? 1 : 0))) {
		rt.setSv(f, "suit", live(F));
		rt.setFv(f, "shoes", rt.sv(f, "suit"), live(f.src));
	} else {
		rt.setSv(f, "suit", null);
	}
	return f.dot;
});

rt.type(7704, "/obj/item/clothing/suit/space/hardsuit/flightsuit", "/obj/item/clothing/suit/space/hardsuit", {
	locked_strip_delay: 80,
	pack: null,
	shoes: null,
	user: null,
	deployedpack: 0,
	deployedshoes: 0,
	locked: 0,
	flightpack: null,
	flight: 0,
	maint_panel: 0,
	name: "flight suit",
	desc: "An advanced suit that allows the wearer flight via two high powered miniature jet engines on a deployable back-mounted unit.",
	icon_state: "flightsuit",
	item_state: "flightsuit",
	strip_delay: 30,
	w_class: 4,
	resistance_flags: 34,
	jetpack: null,
	allowed: null,
	actions_types: null,
	armor: null,
	max_heat_protection_temperature: 30000,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/flightsuit"),
});

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/<init>  (code/modules/clothing/spacesuits/flightsuit.dm:924)
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/gun"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs")));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/flightsuit/toggle_helmet"), T("/datum/action/item_action/flightsuit/toggle_boots"), T("/datum/action/item_action/flightsuit/toggle_flightpack"), T("/datum/action/item_action/flightsuit/lock_suit")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 20, "laser", 20, "energy", 10, "bomb", 30, "bio", 100, "rad", 75, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7705, "/obj/item/clothing/suit/space/hardsuit/flightsuit/full", "/obj/item/clothing/suit/space/hardsuit/flightsuit", {});

// /obj/item/clothing/suit/space/hardsuit/flightsuit/full/proc/New  (code/modules/clothing/spacesuits/flightsuit.dm:931)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/full/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "makepack");
	yield* g.srcCall(f, "makeshoes");
	yield* g.srcCall(f, "resync");
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/usermessage  (code/modules/clothing/spacesuits/flightsuit.dm:937)
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/usermessage", function usermessage(f: Frame, message: Value, urgency: Value) {
	f.vars = () => [urgency];
	if (live(urgency) === null) {
		urgency = 0;
	}
	if (!truthy(live(urgency))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "user"), fmt("＀<span class='notice'>|＀</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(message)])]);
	} else {
		if (isEqual(live(urgency), 1)) {
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "user"), fmt("＀<span class='warning'>|＀</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(message)])]);
		} else {
			if (!isEqual(live(urgency), 2)) return f.dot;
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "user"), fmt("＀<span class='userdanger'>|＀</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(message)])]);
		}
	}
	return f.dot;
});

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/examine  (code/modules/clothing/spacesuits/flightsuit.dm:945)
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [$0, $1, $2, $3];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "locked"))) {
		$1 = "LOCKED";
	} else {
		$1 = "UNLOCKED";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='boldnotice'>SUIT: ＀</span>", [$1])]);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "deployedpack"))) {
		$1 = "ENGAGED";
	} else {
		$1 = "DISENGAGED";
	}
	if (truthy(rt.sv(f, "deployedshoes"))) {
		$2 = "ENGAGED";
	} else {
		$2 = "DISENGAGED";
	}
	if (truthy(rt.sv(f, "suittoggled"))) {
		$3 = "ENGAGED";
	} else {
		$3 = "DISENGAGED";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='boldnotice'>FLIGHTPACK: ＀ FLIGHTSHOES : ＀ HELMET : ＀</span>", [$1, $2, $3])]);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "maint_panel"))) {
		$1 = "OPEN";
	} else {
		$1 = "CLOSED";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='boldnotice'>Its maintainence panel is ＀</span>", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/Destroy  (code/modules/clothing/spacesuits/flightsuit.dm:951)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "dropped");
	if (truthy(rt.sv(f, "pack"))) {
		yield* g.callName(f, rt.sv(f, "pack"), "delink_suit", []);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "pack")]);
	}
	if (truthy(rt.sv(f, "shoes"))) {
		rt.setFv(f, "pack", rt.sv(f, "shoes"), null);
		rt.setFv(f, "suit", rt.sv(f, "shoes"), null);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "shoes")]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/resync  (code/modules/clothing/spacesuits/flightsuit.dm:963)
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/resync", function resync(f: Frame) {
	if (truthy(rt.sv(f, "pack"))) {
		rt.callName(f, rt.sv(f, "pack"), "relink_suit", [live(f.src)]);
	}
	if (truthy(rt.sv(f, "user"))) {
		if (truthy(rt.sv(f, "pack"))) {
			rt.setFv(f, "wearer", rt.sv(f, "pack"), rt.sv(f, "user"));
		}
		if (truthy(rt.sv(f, "shoes"))) {
			rt.setFv(f, "wearer", rt.sv(f, "shoes"), rt.sv(f, "user"));
		}
	} else {
		if (truthy(rt.sv(f, "pack"))) {
			rt.setFv(f, "wearer", rt.sv(f, "pack"), null);
		}
		if (truthy(rt.sv(f, "shoes"))) {
			rt.setFv(f, "wearer", rt.sv(f, "shoes"), null);
		}
	}
	if (!truthy(rt.sv(f, "shoes"))) return f.dot;
	rt.callName(f, rt.sv(f, "shoes"), "relink_suit", [live(f.src)]);
	return f.dot;
});

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attack_hand  (code/modules/clothing/spacesuits/flightsuit.dm:978)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attack_hand", function* attack_hand(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(f.args[0]);
		if ((isEqual(live(f.src), rt.fv(f, "wear_suit", live(H))) && truthy(rt.sv(f, "locked")))) {
			yield* g.srcCall(f, "usermessage", "You can not take a locked hardsuit off! Unlock it first!", 1);
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/ui_action_click  (code/modules/clothing/spacesuits/flightsuit.dm:986)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/ui_action_click", function* ui_action_click(f: Frame, owner: Value, action: Value) {
	f.vars = () => [owner, action];
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/flightsuit/lock_suit")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "locked"))) {
			yield* g.srcCall(f, "lock_suit", live(owner));
		} else {
			yield* g.srcCall(f, "unlock_suit", live(owner));
		}
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/flightsuit/toggle_flightpack")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "deployedpack"))) {
			yield* g.srcCall(f, "extend_flightpack");
		} else {
			yield* g.srcCall(f, "retract_flightpack");
		}
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/flightsuit/toggle_boots")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "deployedshoes"))) {
			yield* g.srcCall(f, "extend_flightshoes");
		} else {
			yield* g.srcCall(f, "retract_flightshoes");
		}
	}
	if (!truthy((rt.istype(live(action), T("/datum/action/item_action/flightsuit/toggle_helmet")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "ToggleHelmet");
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/dropped  (code/modules/clothing/spacesuits/flightsuit.dm:1006)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/dropped", function* dropped(f: Frame) {
	if (truthy(rt.sv(f, "deployedpack"))) {
		yield* g.srcCall(f, "retract_flightpack", 1);
	}
	if (truthy(rt.sv(f, "deployedshoes"))) {
		yield* g.srcCall(f, "retract_flightshoes", 1);
	}
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.srcCall(f, "unlock_suit", null);
	}
	if (truthy(rt.sv(f, "user"))) {
		rt.setSv(f, "user", null);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/ToggleHelmet  (code/modules/clothing/spacesuits/flightsuit.dm:1016)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/ToggleHelmet", function* ToggleHelmet(f: Frame) {
	if (!truthy(rt.sv(f, "suittoggled"))) {
		if (!truthy(rt.sv(f, "locked"))) {
			yield* g.srcCall(f, "usermessage", "You must lock your suit before engaging the helmet!", 1);
			return 0;
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/lock_suit  (code/modules/clothing/spacesuits/flightsuit.dm:1023)
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/lock_suit", function lock_suit(f: Frame, wearer: Value) {
	rt.setSv(f, "user", live(wearer));
	rt.callName(f, rt.sv(f, "user"), "visible_message", [fmt("<span class='notice'>＀'s flight suit locks around them, powered buckles and straps automatically adjusting to their body!</span>", [live(wearer)])]);
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/rped.ogg"), 65, 1]);
	rt.callSrc(f, "resync", []);
	rt.setSv(f, "strip_delay", rt.sv(f, "locked_strip_delay"));
	rt.setSv(f, "locked", 1);
	return 1;
});

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/unlock_suit  (code/modules/clothing/spacesuits/flightsuit.dm:1033)
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/unlock_suit", function unlock_suit(f: Frame, wearer: Value) {
	if (truthy(rt.sv(f, "suittoggled"))) {
		rt.callSrc(f, "usermessage", ["You must retract the helmet before unlocking your suit!", 1]);
		return 0;
	}
	if ((truthy(rt.sv(f, "pack")) && truthy(rt.fv(f, "flight", rt.sv(f, "pack"))))) {
		rt.callSrc(f, "usermessage", ["You must shut off the flight-pack before unlocking your suit!", 1]);
		return 0;
	}
	if (truthy(rt.sv(f, "deployedpack"))) {
		rt.callSrc(f, "usermessage", ["Your flightpack must be fully retracted first!", 1]);
		return 0;
	}
	if (truthy(rt.sv(f, "deployedshoes"))) {
		rt.callSrc(f, "usermessage", ["Your flight shoes must be fully retracted first!", 1]);
		return 0;
	}
	if (truthy(live(wearer))) {
		rt.callName(f, rt.sv(f, "user"), "visible_message", [fmt("<span class='notice'>＀'s flight suit detaches from their body, becoming nothing more then a bulky metal skeleton.</span>", [live(wearer)])]);
	}
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/rped.ogg"), 65, 1]);
	rt.callSrc(f, "resync", []);
	rt.setSv(f, "strip_delay", rt.initial(f, live(f.src), "strip_delay"));
	rt.setSv(f, "locked", 0);
	return 1;
});

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/extend_flightpack  (code/modules/clothing/spacesuits/flightsuit.dm:1053)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/extend_flightpack", function* extend_flightpack(f: Frame, forced: Value) {
	f.vars = () => [forced];
	if (live(forced) === null) {
		forced = 0;
	}
	if (!truthy(rt.sv(f, "pack"))) {
		yield* g.srcCall(f, "usermessage", "There is no attached flightpack!", 1);
		return 0;
	}
	if (truthy(rt.sv(f, "deployedpack"))) {
		yield* g.srcCall(f, "retract_flightpack");
	}
	if (!truthy(rt.sv(f, "locked"))) {
		yield* g.srcCall(f, "usermessage", "You must lock your flight suit first before deploying anything!", 1);
		return 0;
	}
	if (truthy((rt.istype(rt.sv(f, "user"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(rt.fv(f, "back", rt.sv(f, "user")))) {
			yield* g.srcCall(f, "usermessage", "You're already wearing something on your back!", 1);
			return 0;
		}
		yield* g.callName(f, rt.sv(f, "user"), "equip_to_slot_if_possible", [rt.sv(f, "pack"), 1, 0, 0, 1]);
		(rt.modField(f, rt.sv(f, "pack"), "flags", 2, rt.bitOr));
		yield* g.srcCall(f, "resync");
		yield* g.callName(f, rt.sv(f, "user"), "visible_message", [fmt("<span class='notice'>A ＀ extends from ＀'s ＀ and clamps to their back!</span>", [rt.fv(f, "name", rt.sv(f, "pack")), rt.sv(f, "user"), rt.sv(f, "name")])]);
		yield* g.callName(f, rt.sv(f, "user"), "update_inv_wear_suit", []);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1]);
	rt.setSv(f, "deployedpack", 1);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/retract_flightpack  (code/modules/clothing/spacesuits/flightsuit.dm:1074)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/retract_flightpack", function* retract_flightpack(f: Frame, forced: Value) {
	f.vars = () => [forced];
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy((rt.istype(rt.sv(f, "user"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy(rt.fv(f, "flight", rt.sv(f, "pack"))) && !truthy(live(forced)))) {
			yield* g.srcCall(f, "usermessage", "You must disable the engines before retracting the flightpack!", 1);
			return 0;
		}
		if ((truthy(rt.fv(f, "flight", rt.sv(f, "pack"))) && truthy(live(forced)))) {
			yield* g.callName(f, rt.sv(f, "pack"), "disable_flight", [1]);
		}
		(rt.modField(f, rt.sv(f, "pack"), "flags", 16777213, rt.bitAnd));
		yield* g.srcCall(f, "resync");
		if (truthy(rt.sv(f, "user"))) {
			yield* g.callName(f, rt.sv(f, "user"), "transferItemToLoc", [rt.sv(f, "pack"), live(f.src), 1]);
			yield* g.callName(f, rt.sv(f, "user"), "update_inv_wear_suit", []);
			yield* g.callName(f, rt.sv(f, "user"), "visible_message", [fmt("<span class='notice'>＀'s ＀ detaches from their back and retracts into their ＀!</span>", [rt.sv(f, "user"), rt.fv(f, "name", rt.sv(f, "pack")), live(f.src)])]);
		}
	}
	rt.setFv(f, "loc", rt.sv(f, "pack"), live(f.src));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1]);
	rt.setSv(f, "deployedpack", 0);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/extend_flightshoes  (code/modules/clothing/spacesuits/flightsuit.dm:1091)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/extend_flightshoes", function* extend_flightshoes(f: Frame, forced: Value) {
	f.vars = () => [forced];
	if (live(forced) === null) {
		forced = 0;
	}
	if (!truthy(rt.sv(f, "shoes"))) {
		yield* g.srcCall(f, "usermessage", "Flight shoes are not installed!", 1);
		return 0;
	}
	if (truthy(rt.sv(f, "deployedshoes"))) {
		yield* g.srcCall(f, "retract_flightshoes");
	}
	if (!truthy(rt.sv(f, "locked"))) {
		yield* g.srcCall(f, "usermessage", "You must lock your flight suit first before deploying anything!", 1);
		return 0;
	}
	if (truthy((rt.istype(rt.sv(f, "user"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(rt.fv(f, "shoes", rt.sv(f, "user")))) {
			yield* g.srcCall(f, "usermessage", "You're already wearing something on your feet!", 1);
			return 0;
		}
		yield* g.callName(f, rt.sv(f, "user"), "equip_to_slot_if_possible", [rt.sv(f, "shoes"), 12, 0, 0, 1]);
		(rt.modField(f, rt.sv(f, "shoes"), "flags", 2, rt.bitOr));
		yield* g.callName(f, rt.sv(f, "user"), "visible_message", [fmt("<span class='notice'>＀'s ＀ extends a pair of ＀ over their feet!</span>", [rt.sv(f, "user"), rt.sv(f, "name"), rt.fv(f, "name", rt.sv(f, "shoes"))])]);
		yield* g.callName(f, rt.sv(f, "user"), "update_inv_wear_suit", []);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1]);
	rt.setSv(f, "deployedshoes", 1);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/retract_flightshoes  (code/modules/clothing/spacesuits/flightsuit.dm:1111)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/retract_flightshoes", function* retract_flightshoes(f: Frame, forced: Value) {
	f.vars = () => [forced];
	if (live(forced) === null) {
		forced = 0;
	}
	(rt.modField(f, rt.sv(f, "shoes"), "flags", 16777213, rt.bitAnd));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1]);
	if (truthy(rt.sv(f, "user"))) {
		yield* g.callName(f, rt.sv(f, "user"), "transferItemToLoc", [rt.sv(f, "shoes"), live(f.src), 1]);
		yield* g.callName(f, rt.sv(f, "user"), "update_inv_wear_suit", []);
		yield* g.callName(f, rt.sv(f, "user"), "visible_message", [fmt("<span class='notice'>＀'s ＀ retracts back into their ＀!</span>", [rt.sv(f, "user"), rt.fv(f, "name", rt.sv(f, "shoes")), rt.sv(f, "name")])]);
	}
	rt.setFv(f, "loc", rt.sv(f, "shoes"), live(f.src));
	rt.setSv(f, "deployedshoes", 0);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/makepack  (code/modules/clothing/spacesuits/flightsuit.dm:1121)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/makepack", function* makepack(f: Frame) {
	if (truthy(rt.sv(f, "pack"))) return f.dot;
	rt.setSv(f, "pack", (yield* g.new_(f, T("/obj/item/device/flightpack/full"), [live(f.src)])));
	yield* g.callName(f, rt.sv(f, "pack"), "relink_suit", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/makeshoes  (code/modules/clothing/spacesuits/flightsuit.dm:1126)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/makeshoes", function* makeshoes(f: Frame) {
	if (truthy(rt.sv(f, "shoes"))) return f.dot;
	rt.setSv(f, "shoes", (yield* g.new_(f, T("/obj/item/clothing/shoes/flightshoes"), [live(f.src)])));
	rt.setFv(f, "pack", rt.sv(f, "shoes"), rt.sv(f, "pack"));
	rt.setFv(f, "suit", rt.sv(f, "shoes"), live(f.src));
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/equipped  (code/modules/clothing/spacesuits/flightsuit.dm:1132)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/equipped", function* equipped(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.setSv(f, "user", live(f.args[0]));
	}
	if (!isEqual(live(f.args[1]), 13)) {
		if (truthy(rt.sv(f, "deployedpack"))) {
			yield* g.srcCall(f, "retract_flightpack", 1);
		}
		if (truthy(rt.sv(f, "deployedshoes"))) {
			yield* g.srcCall(f, "retract_flightshoes", 1);
		}
		if (truthy(rt.sv(f, "locked"))) {
			yield* g.srcCall(f, "unlock_suit", rt.sv(f, "user"));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "slot"] });

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/detach_pack  (code/modules/clothing/spacesuits/flightsuit.dm:1144)
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/detach_pack", function detach_pack(f: Frame) {
	rt.callName(f, rt.sv(f, "pack"), "delink_suit", []);
	rt.setFv(f, "loc", rt.sv(f, "pack"), rt.getStep(f, live(f.src), 0));
	rt.setSv(f, "pack", null);
	rt.callSrc(f, "usermessage", ["You detach the flightpack."]);
	return f.dot;
});

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attach_pack  (code/modules/clothing/spacesuits/flightsuit.dm:1150)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attach_pack", function* attach_pack(f: Frame, F: Value) {
	f.vars = () => [F];
	yield* g.callName(f, live(F), "forceMove", [live(f.src)]);
	rt.setSv(f, "pack", live(F));
	yield* g.callName(f, rt.sv(f, "pack"), "relink_suit", [live(f.src)]);
	yield* g.srcCall(f, "usermessage", "You attach and fasten the flightpack.");
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/detach_shoes  (code/modules/clothing/spacesuits/flightsuit.dm:1156)
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/detach_shoes", function detach_shoes(f: Frame) {
	rt.callName(f, rt.sv(f, "shoes"), "delink_suit", []);
	rt.setFv(f, "loc", rt.sv(f, "shoes"), rt.getStep(f, live(f.src), 0));
	rt.setSv(f, "shoes", null);
	rt.callSrc(f, "usermessage", ["You detach the flight shoes."]);
	return f.dot;
});

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attach_shoes  (code/modules/clothing/spacesuits/flightsuit.dm:1162)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attach_shoes", function* attach_shoes(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "forceMove", [live(f.src)]);
	rt.setSv(f, "shoes", live(S));
	yield* g.callName(f, rt.sv(f, "shoes"), "relink_suit", [live(f.src)]);
	yield* g.srcCall(f, "usermessage", "You attach and fasten a pair of flight shoes.");
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attackby  (code/modules/clothing/spacesuits/flightsuit.dm:1168)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attackby", function* attackby(f: Frame) {
	let inputlist: Value = null, input: Value = null, F: Value = null, addmsg: Value = null, addmsglist: Value = null, S: Value = null;
	let $0: any;
	f.vars = () => [inputlist, input, F, addmsg, addmsglist, S, $0];
	rt.setSv(f, "user", live(f.args[1]));
	if (isEqual(live(f.src), (yield* g.callName(f, rt.sv(f, "user"), "get_item_by_slot", [13])))) {
		yield* g.srcCall(f, "usermessage", "You can not perform any service without taking the suit off!", 1);
		return 0;
	}
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.srcCall(f, "usermessage", "You can not perform any service while the suit is locked!", 1);
		return 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "maint_panel"))) {
			rt.setSv(f, "maint_panel", 1);
		} else {
			rt.setSv(f, "maint_panel", 0);
		}
		if (truthy(rt.sv(f, "maint_panel"))) {
			$0 = "open";
		} else {
			$0 = "close";
		}
		yield* g.srcCall(f, "usermessage", fmt("You ＀ the maintainence panel.", [$0]));
	}
	if (!truthy(rt.sv(f, "maint_panel"))) {
		yield* g.srcCall(f, "usermessage", "The maintainence panel is closed!", 1);
		return 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		inputlist = rt.list();
		if (truthy(rt.sv(f, "pack"))) {
			inputlist = rt.modify(live(inputlist), "Pack", add);
		}
		if (truthy(rt.sv(f, "shoes"))) {
			inputlist = rt.modify(live(inputlist), "Shoes", add);
		}
		if (!truthy(rt.len(f, live(inputlist)))) {
			yield* g.srcCall(f, "usermessage", "There is nothing inside the flightsuit to remove!", 1);
			return 0;
		}
		input = (yield* g.op(f, "Prompt", [1], [null, "Removing module", "What to remove?", rt.sv(f, "user"), rt.list("Pack", "Shoes")]));
		if ((truthy(rt.sv(f, "pack")) && isEqual(live(input), "Pack"))) {
			if (truthy(rt.fv(f, "flight", rt.sv(f, "pack")))) {
				yield* g.srcCall(f, "usermessage", "You can not pry off an active flightpack!", 1);
				return 0;
			}
			if (truthy(rt.sv(f, "deployedpack"))) {
				yield* g.srcCall(f, "usermessage", "Disengage the flightpack first!", 1);
				return 0;
			}
			yield* g.srcCall(f, "detach_pack");
		}
		if ((truthy(rt.sv(f, "shoes")) && isEqual(live(input), "Shoes"))) {
			if (truthy(rt.sv(f, "deployedshoes"))) {
				yield* g.srcCall(f, "usermessage", "Disengage the shoes first!", 1);
				return 0;
			}
			yield* g.srcCall(f, "detach_shoes");
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/flightpack")) ? 1 : 0))) {
		F = live(f.args[0]);
		if (truthy(rt.sv(f, "pack"))) {
			yield* g.srcCall(f, "usermessage", fmt("＀ already has a flightpack installed!", [live(f.src)]), 1);
			return 0;
		}
		if (!truthy(rt.fv(f, "assembled", live(F)))) {
			addmsg = " It is missing a ";
			addmsglist = rt.list();
			if (!truthy(rt.fv(f, "part_manip", live(F)))) {
				addmsglist = rt.modify(live(addmsglist), "manipulator", add);
			}
			if (!truthy(rt.fv(f, "part_cap", live(F)))) {
				addmsglist = rt.modify(live(addmsglist), "capacitor", add);
			}
			if (!truthy(rt.fv(f, "part_scan", live(F)))) {
				addmsglist = rt.modify(live(addmsglist), "scanning module", add);
			}
			if (!truthy(rt.fv(f, "part_laser", live(F)))) {
				addmsglist = rt.modify(live(addmsglist), "micro-laser", add);
			}
			if (!truthy(rt.fv(f, "part_bin", live(F)))) {
				addmsglist = rt.modify(live(addmsglist), "matter bin", add);
			}
			yield* g.srcCall(f, "usermessage", fmt("The flightpack you are trying to install is not fully assembled and operational!＀.", [(addmsg = rt.modify(live(addmsg), (yield* g.call(f, P("/proc/english_list"), null, [live(addmsglist)])), add))]), 1);
			return 0;
		}
		if (truthy((yield* g.callName(f, rt.sv(f, "user"), "temporarilyRemoveItemFromInventory", [live(F)])))) {
			yield* g.srcCall(f, "attach_pack", live(F));
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/shoes/flightshoes")) ? 1 : 0))) {
		S = live(f.args[0]);
		if (truthy(rt.sv(f, "shoes"))) {
			yield* g.srcCall(f, "usermessage", "There are already shoes installed!", 1);
			return 0;
		}
		if (truthy((yield* g.callName(f, rt.sv(f, "user"), "temporarilyRemoveItemFromInventory", [live(S)])))) {
			yield* g.srcCall(f, "attach_shoes", live(S));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "wearer", "params"] });

rt.type(7937, "/obj/item/clothing/head/helmet/space/hardsuit/flightsuit", "/obj/item/clothing/head/helmet/space/hardsuit", {
	datahuds: null,
	zoom_range: 14,
	zoom: 0,
	light_color: "#30ffff",
	name: "flight helmet",
	desc: "A sealed helmet attached to a flight suit for EVA usage scenerios. Its visor contains an information uplink HUD.",
	icon_state: "flighthelmet",
	item_state: "flighthelmet",
	item_color: "flight",
	resistance_flags: 34,
	brightness_on: 7,
	armor: null,
	max_heat_protection_temperature: 30000,
	actions_types: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/<init>  (code/modules/clothing/spacesuits/flightsuit.dm:1249)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "datahuds", rt.list(2, 4, 5));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 20, "laser", 20, "energy", 10, "bomb", 30, "bio", 100, "rad", 75, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_helmet_light"), T("/datum/action/item_action/flightpack/zoom")));
	return f.dot;
});

// /obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/equipped  (code/modules/clothing/spacesuits/flightsuit.dm:1257)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/equipped", function* equipped(f: Frame) {
	let hudtype: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [hudtype, H, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	hudtype = null;
	rt.forList(f, 0, rt.sv(f, "datahuds"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hudtype = $e;
		yield* g.callName(f, (H = rt.index(rt.gl("huds"), live(hudtype))), "add_hud_to", [live(f.args[0])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["wearer", "slot"] });

// /obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/dropped  (code/modules/clothing/spacesuits/flightsuit.dm:1263)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/dropped", function* dropped(f: Frame) {
	let hudtype: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [hudtype, H, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	hudtype = null;
	rt.forList(f, 0, rt.sv(f, "datahuds"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hudtype = $e;
		yield* g.callName(f, (H = rt.index(rt.gl("huds"), live(hudtype))), "remove_hud_from", [live(f.args[0])]);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "zoom"))) return f.dot;
	yield* g.srcCall(f, "toggle_zoom", live(f.args[0]), 1);
	return f.dot;
}, true, { args: ["wearer"] });

// /obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/ui_action_click  (code/modules/clothing/spacesuits/flightsuit.dm:1271)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/ui_action_click", function* ui_action_click(f: Frame) {
	if (truthy((rt.istype(live(f.args[1]), T("/datum/action/item_action/flightpack/zoom")) ? 1 : 0))) {
		yield* g.srcCall(f, "toggle_zoom", live(f.args[0]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["owner", "action"] });

// /obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/toggle_zoom  (code/modules/clothing/spacesuits/flightsuit.dm:1276)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/toggle_zoom", function* toggle_zoom(f: Frame, user: Value, force_off: Value) {
	f.vars = () => [user, force_off];
	if (live(force_off) === null) {
		force_off = 0;
	}
	if ((truthy(rt.sv(f, "zoom")) || truthy(live(force_off)))) {
		yield* g.callName(f, rt.fv(f, "client", live(user)), "change_view", [(yield* g.callName(f, rt.fv(f, "client", live(user)), "default_view", []))]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldnotice'>Disabling smart zooming image enhancement...</span>"]);
		rt.setSv(f, "zoom", 0);
		return 0;
	} else {
		yield* g.callName(f, rt.fv(f, "client", live(user)), "change_view", [rt.sv(f, "zoom_range")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldnotice'>Enabling smart zooming image enhancement!</span>"]);
		rt.setSv(f, "zoom", 1);
		return 1;
	}
	return f.dot;
}, true);
