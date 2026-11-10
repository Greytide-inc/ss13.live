// Based on /tg/station's code/game/mecha/mecha_actions.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// mecha_actions.dm:5
rt.def("/obj/mecha/proc/GrantActions", function* GrantActions(f: Frame, user: Value, human_occupant: Value) {
	human_occupant ??= 0;
	if (human_occupant) {
		yield* this.eject_action.Grant(user, this);
	}
	yield* this.internals_action.Grant(user, this);
	yield* this.cycle_action.Grant(user, this);
	yield* this.lights_action.Grant(user, this);
	yield* this.stats_action.Grant(user, this);
	yield* this.strafing_action.Grant(user, this);
	return f.dot;
}, true);

// mecha_actions.dm:15
rt.def("/obj/mecha/proc/RemoveActions", function* RemoveActions(f: Frame, user: Value, human_occupant: Value) {
	human_occupant ??= 0;
	if (human_occupant) {
		yield* this.eject_action.Remove(user);
	}
	yield* this.internals_action.Remove(user);
	yield* this.cycle_action.Remove(user);
	yield* this.lights_action.Remove(user);
	yield* this.stats_action.Remove(user);
	yield* this.strafing_action.Remove(user);
	return f.dot;
}, true);

rt.type(123, "/datum/action/innate/mecha", "/datum/action/innate", {
	chassis: null,
	check_flags: 11,
});

// mecha_actions.dm:29
rt.def("/datum/action/innate/mecha/proc/Grant", function* Grant(f: Frame, L: Value, M: Value) {
	if (M) {
		this.chassis = M;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mecha_actions.dm:34
rt.def("/datum/action/innate/mecha/proc/Destroy", function* Destroy(f: Frame) {
	this.chassis = null;
	return (yield* parent_proc());
}, true);

rt.type(124, "/datum/action/innate/mecha/mech_eject", "/datum/action/innate/mecha", {
	name: "Eject From Mech",
	button_icon_state: "mech_eject",
});

// mecha_actions.dm:41
rt.def("/datum/action/innate/mecha/mech_eject/proc/Activate", function* Activate(f: Frame) {
	if (!this.owner) {
		return f.dot;
	}
	if (!this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	yield* this.chassis.go_out();
	return f.dot;
}, true);

rt.type(125, "/datum/action/innate/mecha/mech_toggle_internals", "/datum/action/innate/mecha", {
	name: "Toggle Internal Airtank Usage",
	button_icon_state: "mech_internals_off",
});

// mecha_actions.dm:53
rt.def("/datum/action/innate/mecha/mech_toggle_internals/proc/Activate", function* Activate(f: Frame) {
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	this.chassis.use_internal_tank = (!this.chassis.use_internal_tank ? 1 : 0);
	this.button_icon_state = `mech_internals_${this.chassis.use_internal_tank ? "on" : "off"}`;
	this.chassis.occupant_message(`Now taking air from ${this.chassis.use_internal_tank ? "internal airtank" : "environment"}.`);
	this.chassis.log_message(`Now taking air from ${this.chassis.use_internal_tank ? "internal airtank" : "environment"}.`);
	yield* this.UpdateButtonIcon();
	return f.dot;
}, true);

rt.type(126, "/datum/action/innate/mecha/mech_cycle_equip", "/datum/action/innate/mecha", {
	name: "Cycle Equipment",
	button_icon_state: "mech_cycle_equip_off",
});

// mecha_actions.dm:66
rt.def("/datum/action/innate/mecha/mech_cycle_equip/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null, A: Value = null;
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	let available_equipment: Value = list();
	for (M of each(this.chassis.equipment, T("/obj/item/mecha_parts/mecha_equipment"))) {
		if (M.selectable) {
			available_equipment += M;
		}
	}
	if (rt.len(f, available_equipment) == 0) {
		this.chassis.occupant_message("No equipment available.");
		return f.dot;
	}
	if (!this.chassis.selected) {
		this.chassis.selected = rt.index(available_equipment, 1);
		this.chassis.occupant_message(`You select ${this.chassis.selected}`);
		send_byjax(this.chassis.occupant, "exosuit.browser", "eq_list", this.chassis.get_equipment_list());
		this.button_icon_state = "mech_cycle_equip_on";
		yield* this.UpdateButtonIcon();
		return f.dot;
	}
	let number: Value = 0;
	for (A of each(available_equipment)) {
		number++;
		if (A == this.chassis.selected) {
			if (rt.len(f, available_equipment) == number) {
				this.chassis.selected = null;
				this.chassis.occupant_message("You switch to no equipment");
				this.button_icon_state = "mech_cycle_equip_off";
			} else {
				this.chassis.selected = rt.index(available_equipment, number + 1);
				this.chassis.occupant_message(`You switch to ${this.chassis.selected}`);
				this.button_icon_state = "mech_cycle_equip_on";
			}
			send_byjax(this.chassis.occupant, "exosuit.browser", "eq_list", this.chassis.get_equipment_list());
			yield* this.UpdateButtonIcon();
			return f.dot;
		}
	}
	return f.dot;
}, true);

rt.type(127, "/datum/action/innate/mecha/mech_toggle_lights", "/datum/action/innate/mecha", {
	name: "Toggle Lights",
	button_icon_state: "mech_lights_off",
});

// mecha_actions.dm:106
rt.def("/datum/action/innate/mecha/mech_toggle_lights/proc/Activate", function* Activate(f: Frame) {
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	this.chassis.lights = (!this.chassis.lights ? 1 : 0);
	if (this.chassis.lights) {
		this.chassis.set_light(this.chassis.lights_power);
		this.button_icon_state = "mech_lights_on";
	} else {
		this.chassis.set_light(-this.chassis.lights_power);
		this.button_icon_state = "mech_lights_off";
	}
	let $0: any = this.chassis;
	$0.occupant_message(`Toggled lights ${this.chassis.lights ? "on" : "off"}.`);
	this.chassis.log_message(`Toggled lights ${this.chassis.lights ? "on" : "off"}.`);
	yield* this.UpdateButtonIcon();
	return f.dot;
}, true);

rt.type(128, "/datum/action/innate/mecha/mech_view_stats", "/datum/action/innate/mecha", {
	name: "View Stats",
	button_icon_state: "mech_view_stats",
});

// mecha_actions.dm:124
rt.def("/datum/action/innate/mecha/mech_view_stats/proc/Activate", function Activate(f: Frame) {
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	rt.op(f, "Browse", [], [this.chassis.occupant, this.chassis.get_stats_html(), "window=exosuit"], false);
	return f.dot;
});

rt.type(129, "/datum/action/innate/mecha/strafe", "/datum/action/innate/mecha", {
	name: "Toggle Strafing",
	button_icon_state: "strafe",
});

// mecha_actions.dm:134
rt.def("/datum/action/innate/mecha/strafe/proc/Activate", function* Activate(f: Frame) {
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	yield* this.chassis.toggle_strafe();
	return f.dot;
}, true);

// mecha_actions.dm:140
rt.def("/obj/mecha/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	if (user != this.occupant) return f.dot;
	yield* this.toggle_strafe();
	return f.dot;
}, true);

// mecha_actions.dm:144
rt.def("/obj/mecha/proc/toggle_strafe", function* toggle_strafe(f: Frame) {
	this.strafe = (!this.strafe ? 1 : 0);
	this.occupant_message(`Toggled strafing mode ${this.strafe ? "on" : "off"}.`);
	this.log_message(`Toggled strafing mode ${this.strafe ? "on" : "off"}.`);
	yield* this.strafing_action.UpdateButtonIcon();
	return f.dot;
}, true);

rt.type(130, "/datum/action/innate/mecha/mech_toggle_thrusters", "/datum/action/innate/mecha", {
	name: "Toggle Thrusters",
	button_icon_state: "mech_thrusters_off",
});

// mecha_actions.dm:158
rt.def("/datum/action/innate/mecha/mech_toggle_thrusters/proc/Activate", function Activate(f: Frame) {
	let $0: any, $1: any;
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	if (!(this.chassis.get_charge() > 0)) return f.dot;
	this.chassis.thrusters_active = (!this.chassis.thrusters_active ? 1 : 0);
	this.button_icon_state = `mech_thrusters_${this.chassis.thrusters_active ? "on" : "off"}`;
	this.chassis.log_message("Toggled thrusters.");
	$0 = this.chassis;
	if (this.chassis.thrusters_active) {
		$1 = "blue";
	} else {
		$1 = "red";
	}
	$0.occupant_message(`<font color='${$1}'>Thrusters ${this.chassis.thrusters_active ? "en" : "dis"}abled.`);
	return f.dot;
});

rt.type(131, "/datum/action/innate/mecha/mech_defence_mode", "/datum/action/innate/mecha", {
	name: "Toggle Defence Mode",
	button_icon_state: "mech_defense_mode_off",
});

// mecha_actions.dm:172
rt.def("/datum/action/innate/mecha/mech_defence_mode/proc/Activate", function* Activate(f: Frame, forced_state: Value) {
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	if (forced_state !== null) {
		this.chassis.defence_mode = forced_state;
	} else {
		this.chassis.defence_mode = (!this.chassis.defence_mode ? 1 : 0);
	}
	this.button_icon_state = `mech_defense_mode_${this.chassis.defence_mode ? "on" : "off"}`;
	if (this.chassis.defence_mode) {
		this.chassis.deflect_chance = this.chassis.defence_mode_deflect_chance;
		this.chassis.occupant_message(`<span class='notice'>You enable ${this.chassis} defence mode.</span>`);
	} else {
		this.chassis.deflect_chance = rt.initial(f, this.chassis, "deflect_chance");
		this.chassis.occupant_message(`<span class='danger'>You disable ${this.chassis} defence mode.</span>`);
	}
	this.chassis.log_message("Toggled defence mode.");
	yield* this.UpdateButtonIcon();
	return f.dot;
}, true);

rt.type(132, "/datum/action/innate/mecha/mech_overload_mode", "/datum/action/innate/mecha", {
	name: "Toggle leg actuators overload",
	button_icon_state: "mech_overload_off",
});

// mecha_actions.dm:193
rt.def("/datum/action/innate/mecha/mech_overload_mode/proc/Activate", function* Activate(f: Frame, forced_state: Value) {
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	if (forced_state !== null) {
		this.chassis.leg_overload_mode = forced_state;
	} else {
		this.chassis.leg_overload_mode = (!this.chassis.leg_overload_mode ? 1 : 0);
	}
	this.button_icon_state = `mech_overload_${this.chassis.leg_overload_mode ? "on" : "off"}`;
	this.chassis.log_message("Toggled leg actuators overload.");
	if (this.chassis.leg_overload_mode) {
		this.chassis.leg_overload_mode = 1;
		this.chassis.bumpsmash = 1;
		this.chassis.step_in = min(1, round(this.chassis.step_in / 2));
		this.chassis.step_energy_drain = this.chassis.step_energy_drain * this.chassis.leg_overload_coeff;
		this.chassis.occupant_message("<span class='danger'>You enable leg actuators overload.</span>");
	} else {
		this.chassis.leg_overload_mode = 0;
		this.chassis.bumpsmash = 0;
		this.chassis.step_in = rt.initial(f, this.chassis, "step_in");
		this.chassis.step_energy_drain = rt.initial(f, this.chassis, "step_energy_drain");
		this.chassis.occupant_message("<span class='notice'>You disable leg actuators overload.</span>");
	}
	yield* this.UpdateButtonIcon();
	return f.dot;
}, true);

rt.type(133, "/datum/action/innate/mecha/mech_smoke", "/datum/action/innate/mecha", {
	name: "Smoke",
	button_icon_state: "mech_smoke",
});

// mecha_actions.dm:220
rt.def("/datum/action/innate/mecha/mech_smoke/proc/Activate", function* Activate(f: Frame) {
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	if (!(this.chassis.smoke_ready && this.chassis.smoke > 0)) return f.dot;
	yield* this.chassis.smoke_system.start();
	this.chassis.smoke--;
	this.chassis.smoke_ready = 0;
	rt.spawnTail(f, this.chassis.smoke_cooldown, "/datum/action/innate/mecha/mech_smoke/proc/Activate: spawn at game/mecha/mecha_actions.dm:225");
	return f.dot;
}, true);

// a spawn(rt.fieldI(f, rt.srcVarI(f, $ic[224]), $ic[225])) body of /datum/action/innate/mecha/mech_smoke/proc/Activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/action/innate/mecha/mech_smoke/proc/Activate: spawn at game/mecha/mecha_actions.dm:225", function* (f: Frame) {
	this.chassis.smoke_ready = 1;
	return null;
});

rt.type(134, "/datum/action/innate/mecha/mech_zoom", "/datum/action/innate/mecha", {
	name: "Zoom",
	button_icon_state: "mech_zoom_off",
});

// mecha_actions.dm:235
rt.def("/datum/action/innate/mecha/mech_zoom/proc/Activate", function* Activate(f: Frame) {
	let $0: any, $1: any;
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	if (!this.owner.client) return f.dot;
	this.chassis.zoom_mode = (!this.chassis.zoom_mode ? 1 : 0);
	this.button_icon_state = `mech_zoom_${this.chassis.zoom_mode ? "on" : "off"}`;
	this.chassis.log_message("Toggled zoom mode.");
	$0 = this.chassis;
	if (this.chassis.zoom_mode) {
		$1 = "blue";
	} else {
		$1 = "red";
	}
	$0.occupant_message(`<font color='${$1}'>Zoom mode ${this.chassis.zoom_mode ? "en" : "dis"}abled.</font>`);
	if (this.chassis.zoom_mode) {
		yield* this.owner.client.change_view(12);
		rt.op(f, "OutputReference", [rt.R.srcVar("owner")], [(yield* sound(rt.rsc("sound/mecha/imag_enh.ogg"), { volume: 50 }))], false);
	} else {
		yield* this.owner.client.change_view(this.owner.client.default_view());
	}
	yield* this.UpdateButtonIcon();
	return f.dot;
}, true);

rt.type(135, "/datum/action/innate/mecha/mech_switch_damtype", "/datum/action/innate/mecha", {
	name: "Reconfigure arm microtool arrays",
	button_icon_state: "mech_damtype_brute",
});

// mecha_actions.dm:254
rt.def("/datum/action/innate/mecha/mech_switch_damtype/proc/Activate", function* Activate(f: Frame) {
	let new_damtype: Value = null;
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	if (this.chassis.damtype === "tox") {
		new_damtype = "brute";
		this.chassis.occupant_message("Your exosuit's hands form into fists.");
	} else if (this.chassis.damtype === "brute") {
		new_damtype = "fire";
		this.chassis.occupant_message("A torch tip extends from your exosuit's hand, glowing red.");
	} else if (this.chassis.damtype === "fire") {
		new_damtype = "tox";
		this.chassis.occupant_message("A bone-chillingly thick plasteel needle protracts from the exosuit's palm.");
	}
	this.chassis.damtype = new_damtype;
	this.button_icon_state = `mech_damtype_${new_damtype}`;
	playsound(this, rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1);
	yield* this.UpdateButtonIcon();
	return f.dot;
}, true);

rt.type(136, "/datum/action/innate/mecha/mech_toggle_phasing", "/datum/action/innate/mecha", {
	name: "Toggle Phasing",
	button_icon_state: "mech_phasing_off",
});

// mecha_actions.dm:277
rt.def("/datum/action/innate/mecha/mech_toggle_phasing/proc/Activate", function* Activate(f: Frame) {
	if (!this.owner || !this.chassis || this.chassis.occupant != this.owner) {
		return f.dot;
	}
	this.chassis.phasing = (!this.chassis.phasing ? 1 : 0);
	this.button_icon_state = `mech_phasing_${this.chassis.phasing ? "on" : "off"}`;
	this.chassis.occupant_message(`<font color="${this.chassis.phasing ? "#00f\">En" : "#f00\">Dis"}abled phasing.</font>`);
	yield* this.UpdateButtonIcon();
	return f.dot;
}, true);
