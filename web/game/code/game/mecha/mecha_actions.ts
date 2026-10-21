// From code/game/mecha/mecha_actions.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/mecha/proc/GrantActions  (code/game/mecha/mecha_actions.dm:5)  may sleep
rt.def("/obj/mecha/proc/GrantActions", function* GrantActions(f: Frame, user: Value, human_occupant: Value) {
	f.vars = () => [user, human_occupant];
	if (live(human_occupant) === null) {
		human_occupant = 0;
	}
	if (truthy(live(human_occupant))) {
		yield* g.callName(f, rt.sv(f, "eject_action"), "Grant", [live(user), live(f.src)]);
	}
	yield* g.callName(f, rt.sv(f, "internals_action"), "Grant", [live(user), live(f.src)]);
	yield* g.callName(f, rt.sv(f, "cycle_action"), "Grant", [live(user), live(f.src)]);
	yield* g.callName(f, rt.sv(f, "lights_action"), "Grant", [live(user), live(f.src)]);
	yield* g.callName(f, rt.sv(f, "stats_action"), "Grant", [live(user), live(f.src)]);
	yield* g.callName(f, rt.sv(f, "strafing_action"), "Grant", [live(user), live(f.src)]);
	return f.dot;
}, true);

// /obj/mecha/proc/RemoveActions  (code/game/mecha/mecha_actions.dm:15)  may sleep
rt.def("/obj/mecha/proc/RemoveActions", function* RemoveActions(f: Frame, user: Value, human_occupant: Value) {
	f.vars = () => [user, human_occupant];
	if (live(human_occupant) === null) {
		human_occupant = 0;
	}
	if (truthy(live(human_occupant))) {
		yield* g.callName(f, rt.sv(f, "eject_action"), "Remove", [live(user)]);
	}
	yield* g.callName(f, rt.sv(f, "internals_action"), "Remove", [live(user)]);
	yield* g.callName(f, rt.sv(f, "cycle_action"), "Remove", [live(user)]);
	yield* g.callName(f, rt.sv(f, "lights_action"), "Remove", [live(user)]);
	yield* g.callName(f, rt.sv(f, "stats_action"), "Remove", [live(user)]);
	yield* g.callName(f, rt.sv(f, "strafing_action"), "Remove", [live(user)]);
	return f.dot;
}, true);

rt.type(123, "/datum/action/innate/mecha", "/datum/action/innate", {
	chassis: null,
	check_flags: 11,
});

// /datum/action/innate/mecha/proc/Grant  (code/game/mecha/mecha_actions.dm:29)  may sleep
rt.def("/datum/action/innate/mecha/proc/Grant", function* Grant(f: Frame) {
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "chassis", live(f.args[1]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["L", "M"] });

// /datum/action/innate/mecha/proc/Destroy  (code/game/mecha/mecha_actions.dm:34)  may sleep
rt.def("/datum/action/innate/mecha/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "chassis", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(124, "/datum/action/innate/mecha/mech_eject", "/datum/action/innate/mecha", {
	name: "Eject From Mech",
	button_icon_state: "mech_eject",
});

// /datum/action/innate/mecha/mech_eject/proc/Activate  (code/game/mecha/mecha_actions.dm:41)  may sleep
rt.def("/datum/action/innate/mecha/mech_eject/proc/Activate", function* Activate(f: Frame) {
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "chassis")) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "chassis"), "go_out", []);
	return f.dot;
}, true);

rt.type(125, "/datum/action/innate/mecha/mech_toggle_internals", "/datum/action/innate/mecha", {
	name: "Toggle Internal Airtank Usage",
	button_icon_state: "mech_internals_off",
});

// /datum/action/innate/mecha/mech_toggle_internals/proc/Activate  (code/game/mecha/mecha_actions.dm:53)  may sleep
rt.def("/datum/action/innate/mecha/mech_toggle_internals/proc/Activate", function* Activate(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	rt.setFv(f, "use_internal_tank", rt.sv(f, "chassis"), (!truthy(rt.fv(f, "use_internal_tank", rt.sv(f, "chassis"))) ? 1 : 0));
	if (truthy(rt.fv(f, "use_internal_tank", rt.sv(f, "chassis")))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	rt.setSv(f, "button_icon_state", fmt("mech_internals_＀", [$0]));
	$0 = rt.sv(f, "chassis");
	if (truthy(rt.fv(f, "use_internal_tank", rt.sv(f, "chassis")))) {
		$1 = "internal airtank";
	} else {
		$1 = "environment";
	}
	yield* g.callName(f, $0, "occupant_message", [fmt("Now taking air from ＀.", [$1])]);
	$0 = rt.sv(f, "chassis");
	if (truthy(rt.fv(f, "use_internal_tank", rt.sv(f, "chassis")))) {
		$1 = "internal airtank";
	} else {
		$1 = "environment";
	}
	yield* g.callName(f, $0, "log_message", [fmt("Now taking air from ＀.", [$1])]);
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true);

rt.type(126, "/datum/action/innate/mecha/mech_cycle_equip", "/datum/action/innate/mecha", {
	name: "Cycle Equipment",
	button_icon_state: "mech_cycle_equip_off",
});

// /datum/action/innate/mecha/mech_cycle_equip/proc/Activate  (code/game/mecha/mecha_actions.dm:66)  may sleep
rt.def("/datum/action/innate/mecha/mech_cycle_equip/proc/Activate", function* Activate(f: Frame) {
	let available_equipment: Value = null, M: Value = null, number: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [available_equipment, M, number, A, $e];
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	available_equipment = rt.list();
	M = null;
	rt.forList(f, 0, rt.fv(f, "equipment", rt.sv(f, "chassis")), T("/obj/item/mecha_parts/mecha_equipment"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "selectable", live(M)))) {
			available_equipment = rt.modify(live(available_equipment), live(M), add);
		}
	}
	rt.endFor(f, 0);
	if (isEqual(rt.len(f, live(available_equipment)), 0)) {
		yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", ["No equipment available."]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "selected", rt.sv(f, "chassis")))) {
		rt.setFv(f, "selected", rt.sv(f, "chassis"), rt.index(live(available_equipment), 1));
		yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", [fmt("You select ＀", [rt.fv(f, "selected", rt.sv(f, "chassis"))])]);
		yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", "eq_list", (yield* g.callName(f, rt.sv(f, "chassis"), "get_equipment_list", []))]);
		rt.setSv(f, "button_icon_state", "mech_cycle_equip_on");
		yield* g.srcCall(f, "UpdateButtonIcon");
		return live(f.dot);
	}
	number = 0;
	A = null;
	rt.forList(f, 0, live(available_equipment));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		number = rt.inc(live(number), 1);
		if (isEqual(live(A), rt.fv(f, "selected", rt.sv(f, "chassis")))) {
			if (isEqual(rt.len(f, live(available_equipment)), live(number))) {
				rt.setFv(f, "selected", rt.sv(f, "chassis"), null);
				yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", ["You switch to no equipment"]);
				rt.setSv(f, "button_icon_state", "mech_cycle_equip_off");
			} else {
				rt.setFv(f, "selected", rt.sv(f, "chassis"), rt.index(live(available_equipment), add(live(number), 1)));
				yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", [fmt("You switch to ＀", [rt.fv(f, "selected", rt.sv(f, "chassis"))])]);
				rt.setSv(f, "button_icon_state", "mech_cycle_equip_on");
			}
			yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", "eq_list", (yield* g.callName(f, rt.sv(f, "chassis"), "get_equipment_list", []))]);
			yield* g.srcCall(f, "UpdateButtonIcon");
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(127, "/datum/action/innate/mecha/mech_toggle_lights", "/datum/action/innate/mecha", {
	name: "Toggle Lights",
	button_icon_state: "mech_lights_off",
});

// /datum/action/innate/mecha/mech_toggle_lights/proc/Activate  (code/game/mecha/mecha_actions.dm:106)  may sleep
rt.def("/datum/action/innate/mecha/mech_toggle_lights/proc/Activate", function* Activate(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	rt.setFv(f, "lights", rt.sv(f, "chassis"), (!truthy(rt.fv(f, "lights", rt.sv(f, "chassis"))) ? 1 : 0));
	if (truthy(rt.fv(f, "lights", rt.sv(f, "chassis")))) {
		yield* g.callName(f, rt.sv(f, "chassis"), "set_light", [rt.fv(f, "lights_power", rt.sv(f, "chassis"))]);
		rt.setSv(f, "button_icon_state", "mech_lights_on");
	} else {
		yield* g.callName(f, rt.sv(f, "chassis"), "set_light", [rt.neg(rt.fv(f, "lights_power", rt.sv(f, "chassis")))]);
		rt.setSv(f, "button_icon_state", "mech_lights_off");
	}
	$0 = rt.sv(f, "chassis");
	if (truthy(rt.fv(f, "lights", rt.sv(f, "chassis")))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	yield* g.callName(f, $0, "occupant_message", [fmt("Toggled lights ＀.", [$1])]);
	$0 = rt.sv(f, "chassis");
	if (truthy(rt.fv(f, "lights", rt.sv(f, "chassis")))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	yield* g.callName(f, $0, "log_message", [fmt("Toggled lights ＀.", [$1])]);
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true);

rt.type(128, "/datum/action/innate/mecha/mech_view_stats", "/datum/action/innate/mecha", {
	name: "View Stats",
	button_icon_state: "mech_view_stats",
});

// /datum/action/innate/mecha/mech_view_stats/proc/Activate  (code/game/mecha/mecha_actions.dm:124)
rt.def("/datum/action/innate/mecha/mech_view_stats/proc/Activate", function Activate(f: Frame) {
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	rt.op(f, "Browse", [], [rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.callName(f, rt.sv(f, "chassis"), "get_stats_html", []), "window=exosuit"], false);
	return f.dot;
});

rt.type(129, "/datum/action/innate/mecha/strafe", "/datum/action/innate/mecha", {
	name: "Toggle Strafing",
	button_icon_state: "strafe",
});

// /datum/action/innate/mecha/strafe/proc/Activate  (code/game/mecha/mecha_actions.dm:134)  may sleep
rt.def("/datum/action/innate/mecha/strafe/proc/Activate", function* Activate(f: Frame) {
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "chassis"), "toggle_strafe", []);
	return f.dot;
}, true);

// /obj/mecha/proc/AltClick  (code/game/mecha/mecha_actions.dm:140)  may sleep
rt.def("/obj/mecha/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!isEqual(live(user), rt.sv(f, "occupant"))) return f.dot;
	yield* g.srcCall(f, "toggle_strafe");
	return f.dot;
}, true);

// /obj/mecha/proc/toggle_strafe  (code/game/mecha/mecha_actions.dm:144)  may sleep
rt.def("/obj/mecha/proc/toggle_strafe", function* toggle_strafe(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "strafe", (!truthy(rt.sv(f, "strafe")) ? 1 : 0));
	if (truthy(rt.sv(f, "strafe"))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	yield* g.srcCall(f, "occupant_message", fmt("Toggled strafing mode ＀.", [$0]));
	if (truthy(rt.sv(f, "strafe"))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	yield* g.srcCall(f, "log_message", fmt("Toggled strafing mode ＀.", [$0]));
	yield* g.callName(f, rt.sv(f, "strafing_action"), "UpdateButtonIcon", []);
	return f.dot;
}, true);

rt.type(130, "/datum/action/innate/mecha/mech_toggle_thrusters", "/datum/action/innate/mecha", {
	name: "Toggle Thrusters",
	button_icon_state: "mech_thrusters_off",
});

// /datum/action/innate/mecha/mech_toggle_thrusters/proc/Activate  (code/game/mecha/mecha_actions.dm:158)
rt.def("/datum/action/innate/mecha/mech_toggle_thrusters/proc/Activate", function Activate(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	if (!rt.gt(rt.callName(f, rt.sv(f, "chassis"), "get_charge", []), 0)) return f.dot;
	rt.setFv(f, "thrusters_active", rt.sv(f, "chassis"), (!truthy(rt.fv(f, "thrusters_active", rt.sv(f, "chassis"))) ? 1 : 0));
	if (truthy(rt.fv(f, "thrusters_active", rt.sv(f, "chassis")))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	rt.setSv(f, "button_icon_state", fmt("mech_thrusters_＀", [$0]));
	rt.callName(f, rt.sv(f, "chassis"), "log_message", ["Toggled thrusters."]);
	$0 = rt.sv(f, "chassis");
	if (truthy(rt.fv(f, "thrusters_active", rt.sv(f, "chassis")))) {
		$1 = "blue";
	} else {
		$1 = "red";
	}
	if (truthy(rt.fv(f, "thrusters_active", rt.sv(f, "chassis")))) {
		$2 = "en";
	} else {
		$2 = "dis";
	}
	rt.callName(f, $0, "occupant_message", [fmt("<font color='＀'>Thrusters ＀abled.", [$1, $2])]);
	return f.dot;
});

rt.type(131, "/datum/action/innate/mecha/mech_defence_mode", "/datum/action/innate/mecha", {
	name: "Toggle Defence Mode",
	button_icon_state: "mech_defense_mode_off",
});

// /datum/action/innate/mecha/mech_defence_mode/proc/Activate  (code/game/mecha/mecha_actions.dm:172)  may sleep
rt.def("/datum/action/innate/mecha/mech_defence_mode/proc/Activate", function* Activate(f: Frame, forced_state: Value) {
	let $0: any;
	f.vars = () => [forced_state, $0];
	if (live(forced_state) === null) {
		forced_state = null;
	}
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	if (live(forced_state) !== null) {
		rt.setFv(f, "defence_mode", rt.sv(f, "chassis"), live(forced_state));
	} else {
		rt.setFv(f, "defence_mode", rt.sv(f, "chassis"), (!truthy(rt.fv(f, "defence_mode", rt.sv(f, "chassis"))) ? 1 : 0));
	}
	if (truthy(rt.fv(f, "defence_mode", rt.sv(f, "chassis")))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	rt.setSv(f, "button_icon_state", fmt("mech_defense_mode_＀", [$0]));
	if (truthy(rt.fv(f, "defence_mode", rt.sv(f, "chassis")))) {
		rt.setFv(f, "deflect_chance", rt.sv(f, "chassis"), rt.fv(f, "defence_mode_deflect_chance", rt.sv(f, "chassis")));
		yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", [fmt("<span class='notice'>You enable ＀ defence mode.</span>", [rt.sv(f, "chassis")])]);
	} else {
		rt.setFv(f, "deflect_chance", rt.sv(f, "chassis"), rt.initial(f, rt.sv(f, "chassis"), "deflect_chance"));
		yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", [fmt("<span class='danger'>You disable ＀ defence mode.</span>", [rt.sv(f, "chassis")])]);
	}
	yield* g.callName(f, rt.sv(f, "chassis"), "log_message", ["Toggled defence mode."]);
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true);

rt.type(132, "/datum/action/innate/mecha/mech_overload_mode", "/datum/action/innate/mecha", {
	name: "Toggle leg actuators overload",
	button_icon_state: "mech_overload_off",
});

// /datum/action/innate/mecha/mech_overload_mode/proc/Activate  (code/game/mecha/mecha_actions.dm:193)  may sleep
rt.def("/datum/action/innate/mecha/mech_overload_mode/proc/Activate", function* Activate(f: Frame, forced_state: Value) {
	let $0: any;
	f.vars = () => [forced_state, $0];
	if (live(forced_state) === null) {
		forced_state = null;
	}
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	if (live(forced_state) !== null) {
		rt.setFv(f, "leg_overload_mode", rt.sv(f, "chassis"), live(forced_state));
	} else {
		rt.setFv(f, "leg_overload_mode", rt.sv(f, "chassis"), (!truthy(rt.fv(f, "leg_overload_mode", rt.sv(f, "chassis"))) ? 1 : 0));
	}
	if (truthy(rt.fv(f, "leg_overload_mode", rt.sv(f, "chassis")))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	rt.setSv(f, "button_icon_state", fmt("mech_overload_＀", [$0]));
	yield* g.callName(f, rt.sv(f, "chassis"), "log_message", ["Toggled leg actuators overload."]);
	if (truthy(rt.fv(f, "leg_overload_mode", rt.sv(f, "chassis")))) {
		rt.setFv(f, "leg_overload_mode", rt.sv(f, "chassis"), 1);
		rt.setFv(f, "bumpsmash", rt.sv(f, "chassis"), 1);
		rt.setFv(f, "step_in", rt.sv(f, "chassis"), (yield* g.call(f, P("/proc/min"), null, [1, (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "step_in", rt.sv(f, "chassis")), 2)]))])));
		rt.setFv(f, "step_energy_drain", rt.sv(f, "chassis"), multiply(rt.fv(f, "step_energy_drain", rt.sv(f, "chassis")), rt.fv(f, "leg_overload_coeff", rt.sv(f, "chassis"))));
		yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", ["<span class='danger'>You enable leg actuators overload.</span>"]);
	} else {
		rt.setFv(f, "leg_overload_mode", rt.sv(f, "chassis"), 0);
		rt.setFv(f, "bumpsmash", rt.sv(f, "chassis"), 0);
		rt.setFv(f, "step_in", rt.sv(f, "chassis"), rt.initial(f, rt.sv(f, "chassis"), "step_in"));
		rt.setFv(f, "step_energy_drain", rt.sv(f, "chassis"), rt.initial(f, rt.sv(f, "chassis"), "step_energy_drain"));
		yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", ["<span class='notice'>You disable leg actuators overload.</span>"]);
	}
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true);

rt.type(133, "/datum/action/innate/mecha/mech_smoke", "/datum/action/innate/mecha", {
	name: "Smoke",
	button_icon_state: "mech_smoke",
});

// /datum/action/innate/mecha/mech_smoke/proc/Activate  (code/game/mecha/mecha_actions.dm:220)  may sleep
rt.def("/datum/action/innate/mecha/mech_smoke/proc/Activate", function* Activate(f: Frame) {
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	if (!(truthy(rt.fv(f, "smoke_ready", rt.sv(f, "chassis"))) && rt.gt(rt.fv(f, "smoke", rt.sv(f, "chassis")), 0))) return f.dot;
	yield* g.callName(f, rt.fv(f, "smoke_system", rt.sv(f, "chassis")), "start", []);
	rt.incField(f, rt.sv(f, "chassis"), "smoke", -1, true);
	rt.setFv(f, "smoke_ready", rt.sv(f, "chassis"), 0);
	rt.spawnTail(f, rt.fv(f, "smoke_cooldown", rt.sv(f, "chassis")), "/datum/action/innate/mecha/mech_smoke/proc/Activate: spawn at game/mecha/mecha_actions.dm:225");
	return f.dot;
}, true);

// a spawn(rt.fieldI(f, rt.srcVarI(f, $ic[224]), $ic[225])) body of /datum/action/innate/mecha/mech_smoke/proc/Activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/action/innate/mecha/mech_smoke/proc/Activate: spawn at game/mecha/mecha_actions.dm:225", function* (f: Frame) {
	rt.setFv(f, "smoke_ready", rt.sv(f, "chassis"), 1);
	return null;
});

rt.type(134, "/datum/action/innate/mecha/mech_zoom", "/datum/action/innate/mecha", {
	name: "Zoom",
	button_icon_state: "mech_zoom_off",
});

// /datum/action/innate/mecha/mech_zoom/proc/Activate  (code/game/mecha/mecha_actions.dm:235)  may sleep
rt.def("/datum/action/innate/mecha/mech_zoom/proc/Activate", function* Activate(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "client", rt.sv(f, "owner")))) return f.dot;
	rt.setFv(f, "zoom_mode", rt.sv(f, "chassis"), (!truthy(rt.fv(f, "zoom_mode", rt.sv(f, "chassis"))) ? 1 : 0));
	if (truthy(rt.fv(f, "zoom_mode", rt.sv(f, "chassis")))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	rt.setSv(f, "button_icon_state", fmt("mech_zoom_＀", [$0]));
	yield* g.callName(f, rt.sv(f, "chassis"), "log_message", ["Toggled zoom mode."]);
	$0 = rt.sv(f, "chassis");
	if (truthy(rt.fv(f, "zoom_mode", rt.sv(f, "chassis")))) {
		$1 = "blue";
	} else {
		$1 = "red";
	}
	if (truthy(rt.fv(f, "zoom_mode", rt.sv(f, "chassis")))) {
		$2 = "en";
	} else {
		$2 = "dis";
	}
	yield* g.callName(f, $0, "occupant_message", [fmt("<font color='＀'>Zoom mode ＀abled.</font>", [$1, $2])]);
	if (truthy(rt.fv(f, "zoom_mode", rt.sv(f, "chassis")))) {
		yield* g.callName(f, rt.fv(f, "client", rt.sv(f, "owner")), "change_view", [12]);
		rt.op(f, "OutputReference", [rt.R.srcVar("owner")], [(yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/mecha/imag_enh.ogg"), "volume", 50], rt.Args.Named))], false);
	} else {
		yield* g.callName(f, rt.fv(f, "client", rt.sv(f, "owner")), "change_view", [(yield* g.callName(f, rt.fv(f, "client", rt.sv(f, "owner")), "default_view", []))]);
	}
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true);

rt.type(135, "/datum/action/innate/mecha/mech_switch_damtype", "/datum/action/innate/mecha", {
	name: "Reconfigure arm microtool arrays",
	button_icon_state: "mech_damtype_brute",
});

// /datum/action/innate/mecha/mech_switch_damtype/proc/Activate  (code/game/mecha/mecha_actions.dm:254)  may sleep
rt.def("/datum/action/innate/mecha/mech_switch_damtype/proc/Activate", function* Activate(f: Frame) {
	let new_damtype: Value = null;
	let $0: any;
	f.vars = () => [new_damtype, $0];
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	new_damtype = null;
	$0 = rt.fv(f, "damtype", rt.sv(f, "chassis"));
	if ($0 === "tox") {
		new_damtype = "brute";
		yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", ["Your exosuit's hands form into fists."]);
	} else if ($0 === "brute") {
		new_damtype = "fire";
		yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", ["A torch tip extends from your exosuit's hand, glowing red."]);
	} else if ($0 === "fire") {
		new_damtype = "tox";
		yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", ["A bone-chillingly thick plasteel needle protracts from the exosuit's palm."]);
	}
	rt.setFv(f, "damtype", rt.sv(f, "chassis"), live(new_damtype));
	rt.setSv(f, "button_icon_state", fmt("mech_damtype_＀", [live(new_damtype)]));
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1]);
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true);

rt.type(136, "/datum/action/innate/mecha/mech_toggle_phasing", "/datum/action/innate/mecha", {
	name: "Toggle Phasing",
	button_icon_state: "mech_phasing_off",
});

// /datum/action/innate/mecha/mech_toggle_phasing/proc/Activate  (code/game/mecha/mecha_actions.dm:277)  may sleep
rt.def("/datum/action/innate/mecha/mech_toggle_phasing/proc/Activate", function* Activate(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (((!truthy(rt.sv(f, "owner")) || !truthy(rt.sv(f, "chassis"))) || !isEqual(rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.sv(f, "owner")))) {
		return live(f.dot);
	}
	rt.setFv(f, "phasing", rt.sv(f, "chassis"), (!truthy(rt.fv(f, "phasing", rt.sv(f, "chassis"))) ? 1 : 0));
	if (truthy(rt.fv(f, "phasing", rt.sv(f, "chassis")))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	rt.setSv(f, "button_icon_state", fmt("mech_phasing_＀", [$0]));
	$0 = rt.sv(f, "chassis");
	if (truthy(rt.fv(f, "phasing", rt.sv(f, "chassis")))) {
		$1 = "#00f\">En";
	} else {
		$1 = "#f00\">Dis";
	}
	yield* g.callName(f, $0, "occupant_message", [fmt("<font color=\"＀abled phasing.</font>", [$1])]);
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true);
