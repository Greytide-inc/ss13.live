// Based on /tg/station's code/game/mecha/mecha.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


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

// mecha.dm:37
rt.def("/obj/mecha/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.facing_modifiers = rt.alist(f, [1, 1.5, 2, 1, 3, 0.5]);

	this.proc_res = list();

	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));

	this.trackers = list();

	this.operation_req_access = list();

	this.eject_action = (yield* new_(T("/datum/action/innate/mecha/mech_eject")));

	this.internals_action = (yield* new_(T("/datum/action/innate/mecha/mech_toggle_internals")));

	this.cycle_action = (yield* new_(T("/datum/action/innate/mecha/mech_cycle_equip")));

	this.lights_action = (yield* new_(T("/datum/action/innate/mecha/mech_toggle_lights")));

	this.stats_action = (yield* new_(T("/datum/action/innate/mecha/mech_view_stats")));

	this.thrusters_action = (yield* new_(T("/datum/action/innate/mecha/mech_toggle_thrusters")));

	this.defense_action = (yield* new_(T("/datum/action/innate/mecha/mech_defence_mode")));

	this.overload_action = (yield* new_(T("/datum/action/innate/mecha/mech_overload_mode")));

	this.smoke_system = (yield* new_(T("/datum/effect_system/smoke_spread")));

	this.smoke_action = (yield* new_(T("/datum/action/innate/mecha/mech_smoke")));

	this.zoom_action = (yield* new_(T("/datum/action/innate/mecha/mech_zoom")));

	this.switch_damtype_action = (yield* new_(T("/datum/action/innate/mecha/mech_switch_damtype")));

	this.phasing_action = (yield* new_(T("/datum/action/innate/mecha/mech_toggle_phasing")));

	this.strafing_action = (yield* new_(T("/datum/action/innate/mecha/strafe")));
	this.hud_possible = list("8", "10", "11", "13");
	this.armor = rt.alist(f, ["melee", 20, "bullet", 10, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);

	this.log = (yield* new_(T("/list")));
	this.internals_req_access = list(10, 29);

	this.equipment = (yield* new_(T("/list")));
	return f.dot;
}, true);

// mecha.dm:123
rt.def("/obj/mecha/proc/Initialize", function* Initialize(f: Frame) {
	let diag_hud: Value = null;
	f.dot = (yield* parent_proc());
	this.events = (yield* new_(T("/datum/events")));
	this.icon_state += "-open";
	yield* this.add_radio();
	this.add_cabin();
	yield* this.add_airtank();
	yield* this.spark_system.set_up(2, 0, this);
	yield* this.spark_system.attach(this);
	yield* this.smoke_system.set_up(3, this);
	yield* this.smoke_system.attach(this);
	yield* this.add_cell();
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	(rt.modGl("poi_list", this, rt.bitOr));
	this.log_message(`${this.name} created.`);
	GLOB.mechas_list += this;
	yield* this.prepare_huds();
	(diag_hud = rt.index(GLOB.huds, DATA_HUD_DIAGNOSTIC)).add_to_hud(this);
	this.diag_hud_set_mechhealth();
	this.diag_hud_set_mechcell();
	this.diag_hud_set_mechstat();
	this.diag_hud_set_mechtracking();
	return f.dot;
}, true);

// mecha.dm:150
rt.def("/obj/mecha/proc/Destroy", function* Destroy(f: Frame) {
	let AI: Value = null, M: Value = null, WR: Value = null, E: Value = null, E_1: Value = null;
	yield* this.go_out();
	for (M of each(this, T("/mob"))) {
		if (rt.istype(M, T("/mob/living/silicon/ai"))) {
			this.occupant = null;
			AI = M;
		} else {
			yield* M.forceMove(this.loc);
		}
	}
	if (this.wreckage) {
		if (prob(30)) {
			yield* explosion(rt.getStep(f, this, 0), 0, 0, 1, 3);
		}
		WR = (yield* new_(this.wreckage, this.loc, AI));
		for (E of each(this.equipment, T("/obj/item/mecha_parts/mecha_equipment"))) {
			if (E.salvageable && prob(30)) {
				WR.crowbar_salvage += E;
				yield* E.detach(WR);
				E.equip_ready = 1;
			} else {
				yield* E.detach(this.loc);
				yield* qdel(E);
			}
		}
		if (this.cell) {
			WR.crowbar_salvage += this.cell;
			yield* this.cell.forceMove(WR);
			this.cell.charge = rand(0, this.cell.charge);
		}
		if (this.internal_tank) {
			WR.crowbar_salvage += this.internal_tank;
			yield* this.internal_tank.forceMove(WR);
		}
	} else {
		for (E_1 of each(this.equipment, T("/obj/item/mecha_parts/mecha_equipment"))) {
			yield* E_1.detach(this.loc);
			yield* qdel(E_1);
		}
		if (this.cell) {
			yield* qdel(this.cell);
		}
		if (this.internal_tank) {
			yield* qdel(this.internal_tank);
		}
		if (AI) {
			yield* AI.gib();
		}
	}
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	yield* GLOB.poi_list.Remove(this);
	this.equipment.Cut();
	this.cell = null;
	this.internal_tank = null;
	if (this.loc) {
		yield* this.loc.assume_air(this.cabin_air);
		this.air_update_turf();
	} else {
		yield* qdel(this.cabin_air);
	}
	this.cabin_air = null;
	yield* qdel(this.spark_system);
	this.spark_system = null;
	yield* qdel(this.smoke_system);
	this.smoke_system = null;
	GLOB.mechas_list -= this;
	return (yield* parent_proc());
}, true);

// mecha.dm:211
rt.def("/obj/mecha/proc/add_airtank", function* add_airtank(f: Frame) {
	this.internal_tank = (yield* new_(T("/obj/machinery/portable_atmospherics/canister/air"), this));
	return this.internal_tank;
}, true);

// mecha.dm:216
rt.def("/obj/mecha/proc/add_cell", function* add_cell(f: Frame, C: Value) {
	if (C) {
		yield* C.forceMove(this);
		this.cell = C;
		return f.dot;
	}
	this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell"), this));
	this.cell.charge = 15000;
	this.cell.maxcharge = 15000;
	return f.dot;
}, true);

// mecha.dm:224
rt.def("/obj/mecha/proc/add_cabin", function add_cabin(f: Frame) {
	this.cabin_air = new_(T("/datum/gas_mixture"));
	this.cabin_air.temperature = T20C;
	this.cabin_air.volume = 200;
	this.cabin_air.assert_gases("o2", "n2");
	rt.setAt(rt.index(this.cabin_air.gases, "o2"), 1, 0.21 * this.cabin_air.volume / (R_IDEAL_GAS_EQUATION * this.cabin_air.temperature));
	rt.setAt(rt.index(this.cabin_air.gases, "n2"), 1, 0.79 * this.cabin_air.volume / (R_IDEAL_GAS_EQUATION * this.cabin_air.temperature));
	return this.cabin_air;
});

// mecha.dm:233
rt.def("/obj/mecha/proc/add_radio", function* add_radio(f: Frame) {
	this.radio = (yield* new_(T("/obj/item/device/radio/mech"), this));
	this.radio.name = `${this} radio`;
	this.radio.icon = this.icon;
	this.radio.icon_state = this.icon_state;
	this.radio.subspace_transmission = 1;
	return f.dot;
}, true);

// mecha.dm:240
rt.def("/obj/mecha/proc/can_use", function can_use(f: Frame, user: Value) {
	if (user != this.occupant) {
		return 0;
	}
	if (user && ismob(user)) {
		if (!user.incapacitated()) {
			return 1;
		}
	}
	return 0;
});

// mecha.dm:250
rt.def("/obj/mecha/proc/examine", function examine(f: Frame, user: Value) {
	let integrity: Value = null, ME: Value = null;
	let $e: any;
	parent_proc();
	const subject = (integrity = this.obj_integrity * 100 / this.max_integrity);
	if (rt.inRange(subject, 85, 100)) {
		to_chat(user, "It's fully intact.");
	} else if (rt.inRange(subject, 65, 85)) {
		to_chat(user, "It's slightly damaged.");
	} else if (rt.inRange(subject, 45, 65)) {
		to_chat(user, "It's badly damaged.");
	} else if (rt.inRange(subject, 25, 45)) {
		to_chat(user, "It's heavily damaged.");
	} else {
		to_chat(user, "It's falling apart.");
	}
	if (!(this.equipment && rt.len(f, this.equipment))) return f.dot;
	to_chat(user, "It's equipped with:");
	for (ME of each(this.equipment, T("/obj/item/mecha_parts/mecha_equipment"))) {
		to_chat(user, `${bicon(ME)} ${ME}`);
	}
	return f.dot;
}, false);

// mecha.dm:273
rt.def("/obj/mecha/proc/process", function* process(f: Frame) {
	let int_tank_air: Value = null, leaked_gas: Value = null, delta: Value = null, tank_air: Value = null, release_pressure: Value = null, cabin_pressure: Value = null, pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null, t_air: Value = null, removed_7: Value = null, cellcharge: Value = null, integrity: Value = null, actual_loc: Value = null, M: Value = null, lights_energy_drain: Value = null;
	let internal_temp_regulation: Value = 1;
	if (this.internal_damage) {
		if (rt.bitAnd(this.internal_damage, 1)) {
			if (!rt.bitAnd(this.internal_damage, 2) && prob(5)) {
				this.clearInternalDamage(1);
			}
			if (this.internal_tank) {
				if ((int_tank_air = this.internal_tank.return_air()).return_pressure() > this.internal_tank.maximum_pressure && !rt.bitAnd(this.internal_damage, 8)) {
					this.setInternalDamage(8);
				}
				if (int_tank_air && int_tank_air.return_volume() > 0) {
					int_tank_air.temperature = min(6273.15, int_tank_air.temperature + rand(10, 15));
				}
			}
			if (this.cabin_air && this.cabin_air.return_volume() > 0) {
				this.cabin_air.temperature = min(6273.15, this.cabin_air.return_temperature() + rand(10, 15));
				if (this.cabin_air.return_temperature() > this.max_temperature / 2) {
					yield* this.take_damage(4 / round(this.max_temperature / this.cabin_air.return_temperature(), 0.1), "fire", 0, 0);
				}
			}
		}
		if (rt.bitAnd(this.internal_damage, 2)) {
			internal_temp_regulation = 0;
		}
		if (rt.bitAnd(this.internal_damage, 8)) {
			if (this.internal_tank) {
				int_tank_air = this.internal_tank.return_air();
				leaked_gas = (yield* int_tank_air.remove_ratio(0.1));
				if (this.loc) {
					yield* this.loc.assume_air(leaked_gas);
					this.air_update_turf();
				} else {
					yield* qdel(leaked_gas);
				}
			}
		}
		if (rt.bitAnd(this.internal_damage, 4)) {
			if (this.get_charge()) {
				yield* this.spark_system.start();
				this.cell.charge -= min(20, this.cell.charge);
				this.cell.maxcharge -= min(20, this.cell.maxcharge);
			}
		}
	}
	if (internal_temp_regulation) {
		if (this.cabin_air && this.cabin_air.return_volume() > 0) {
			delta = this.cabin_air.temperature - 293.15;
			this.cabin_air.temperature -= max(-10, min(10, round(delta / 4, 0.1)));
		}
	}
	if (this.internal_tank) {
		tank_air = this.internal_tank.return_air();
		release_pressure = this.internal_tank_valve;
		cabin_pressure = this.cabin_air.return_pressure();
		pressure_delta = min(release_pressure - cabin_pressure, (tank_air.return_pressure() - cabin_pressure) / 2);
		transfer_moles = 0;
		if (pressure_delta > 0) {
			if (tank_air.return_temperature() > 0) {
				transfer_moles = pressure_delta * this.cabin_air.return_volume() / (this.cabin_air.return_temperature() * 8.31);
				removed = (yield* tank_air.remove(transfer_moles));
				yield* this.cabin_air.merge(removed);
			}
		} else if (pressure_delta < 0) {
			t_air = this.return_air();
			pressure_delta = cabin_pressure - release_pressure;
			if (t_air) {
				pressure_delta = min(cabin_pressure - t_air.return_pressure(), pressure_delta);
			}
			if (pressure_delta > 0) {
				transfer_moles = pressure_delta * this.cabin_air.return_volume() / (this.cabin_air.return_temperature() * 8.31);
				removed_7 = (yield* this.cabin_air.remove(transfer_moles));
				if (t_air) {
					yield* t_air.merge(removed_7);
				} else {
					yield* qdel(removed_7);
				}
			}
		}
	}
	if (this.occupant) {
		if (this.cell) {
			const subject_2 = (cellcharge = this.cell.charge / this.cell.maxcharge);
			if (rt.inRange(subject_2, 0.75, 1e+31)) {
				yield* this.occupant.clear_alert("charge");
			} else if (rt.inRange(subject_2, 0.5, 0.75)) {
				yield* this.occupant.throw_alert("charge", T("/obj/screen/alert/lowcell"), 1);
			} else if (rt.inRange(subject_2, 0.25, 0.5)) {
				yield* this.occupant.throw_alert("charge", T("/obj/screen/alert/lowcell"), 2);
			} else if (rt.inRange(subject_2, 0.01, 0.25)) {
				yield* this.occupant.throw_alert("charge", T("/obj/screen/alert/lowcell"), 3);
			} else {
				yield* this.occupant.throw_alert("charge", T("/obj/screen/alert/emptycell"));
			}
		}
		const subject = (integrity = this.obj_integrity / this.max_integrity * 100);
		if (rt.inRange(subject, 30, 45)) {
			yield* this.occupant.throw_alert("mech damage", T("/obj/screen/alert/low_mech_integrity"), 1);
		} else if (rt.inRange(subject, 15, 35)) {
			yield* this.occupant.throw_alert("mech damage", T("/obj/screen/alert/low_mech_integrity"), 2);
		} else if (rt.inRange(subject, -1e+31, 15)) {
			yield* this.occupant.throw_alert("mech damage", T("/obj/screen/alert/low_mech_integrity"), 3);
		} else {
			yield* this.occupant.clear_alert("mech damage");
		}
		if (rt.istype((actual_loc = this.occupant.loc), T("/obj/item/device/mmi"))) {
			actual_loc = (M = actual_loc).mecha;
		}
		if (actual_loc != this) {
			yield* this.occupant.clear_alert("charge");
			yield* this.occupant.clear_alert("mech damage");
			yield* this.RemoveActions(this.occupant, { human_occupant: 1 });
			this.occupant = null;
		}
	}
	if (this.lights) {
		yield* this.use_power((lights_energy_drain = 2));
	}
	this.diag_hud_set_mechhealth();
	this.diag_hud_set_mechcell();
	this.diag_hud_set_mechstat();
	this.diag_hud_set_mechtracking();
	return f.dot;
}, true, { waitfor: false });

// mecha.dm:386
rt.def("/obj/mecha/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	if (speaker != this.occupant) return f.dot;
	if (!this.radio.broadcasting) return f.dot;
	yield* this.radio.talk_into(speaker, this.text, null, spans, message_language);
	return f.dot;
}, true);

// mecha.dm:397
rt.def("/obj/mecha/proc/click_action", function* click_action(f: Frame, target: Value, user: Value, params: Value) {
	let dir_to_target: Value = null;
	if (!this.occupant || this.occupant != user) {
		return f.dot;
	}
	if (!rt.locateIn(f, T("/turf"), list(target, target.loc))) {
		return f.dot;
	}
	if (this.phasing) {
		this.occupant_message("Unable to interact with objects while phasing");
		return f.dot;
	}
	if (user.incapacitated()) {
		return f.dot;
	}
	if (this.state) {
		this.occupant_message("<span class='warning'>Maintenance protocols in effect.</span>");
		return f.dot;
	}
	if (!this.get_charge()) {
		return f.dot;
	}
	if (this == target) {
		return f.dot;
	}
	if ((dir_to_target = rt.getDir(f, this, target)) && !rt.bitAnd(dir_to_target, this.dir)) {
		return f.dot;
	}
	if (rt.bitAnd(this.internal_damage, 16)) {
		if (!(target = safepick(view(3, target)))) {
			return f.dot;
		}
	}
	if (!target.Adjacent(this)) {
		if (this.selected && this.selected.is_ranged()) {
			if (yield* this.selected.action(target, params)) {
				yield* this.selected.start_cooldown();
			}
		}
	} else if (this.selected && this.selected.is_melee()) {
		if (yield* this.selected.action(target, params)) {
			yield* this.selected.start_cooldown();
		}
	} else {
		if (rt.bitAnd(this.internal_damage, 16)) {
			target = safepick(oview(1, this));
		}
		if (!this.melee_can_hit || !rt.istype(target, T("/atom"))) {
			return f.dot;
		}
		yield* target.mech_melee_attack(this);
		this.melee_can_hit = 0;
		rt.spawnTail(f, this.melee_cooldown, "/obj/mecha/proc/click_action: spawn at game/mecha/mecha.dm:434", target, user, params, dir_to_target);
	}
	return f.dot;
}, true);

// a spawn(rt.srcVarI(f, $ic[211])) body of /obj/mecha/proc/click_action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/mecha/proc/click_action: spawn at game/mecha/mecha.dm:434", function* (f: Frame, target: Value, user: Value, params: Value, dir_to_target: Value) {
	this.melee_can_hit = 1;
	return null;
});

// mecha.dm:447
rt.def("/obj/mecha/proc/Move", function* Move(f: Frame, newloc: Value, direct: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.events.fireEvent("onMove", rt.getStep(f, this, 0));
	return f.dot;
}, true);

// mecha.dm:452
rt.def("/obj/mecha/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	let backup: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return 1;
	}
	if (this.thrusters_active && f.args[0] && (yield* this.use_power(this.step_energy_drain))) {
		return 1;
	}
	if (!(backup = (yield* this.get_spacemove_backup()))) return f.dot;
	if (rt.istype(backup, T("/atom/movable")) && f.args[0] && !backup.anchored) {
		if (yield* backup.newtonian_move(turn(f.args[0], 180))) {
			if (this.occupant) {
				to_chat(this.occupant, `<span class='info'>You push off of ${backup} to propel yourself.</span>`);
			}
		}
	}
	return 1;
}, true, { args: ["movement_dir"] });

// mecha.dm:467
rt.def("/obj/mecha/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	if (!direction) {
		return f.dot;
	}
	if (user != this.occupant) {
		yield* user.forceMove(rt.getStep(f, this, 0));
		to_chat(user, `<span class='notice'>You climb out from ${this}.</span>`);
		return 0;
	}
	if (this.connected_port) {
		if (rt.worldTime(f) - this.last_message > 20) {
			this.occupant_message("<span class='warning'>Unable to move while connected to the air system port!</span>");
			this.last_message = rt.worldTime(f);
		}
		return 0;
	}
	if (this.state) {
		this.occupant_message("<span class='danger'>Maintenance protocols in effect.</span>");
		return f.dot;
	}
	return (yield* this.domove(direction));
}, true);

// mecha.dm:484
rt.def("/obj/mecha/proc/domove", function* domove(f: Frame, direction: Value) {
	if (!this.can_move) {
		return 0;
	}
	if (!(yield* this.Process_Spacemove(direction))) {
		return 0;
	}
	if (!this.has_charge(this.step_energy_drain)) {
		return 0;
	}
	if (this.defence_mode) {
		if (rt.worldTime(f) - this.last_message > 20) {
			this.occupant_message("<span class='danger'>Unable to move while in defence mode</span>");
			this.last_message = rt.worldTime(f);
		}
		return 0;
	}
	if (this.zoom_mode) {
		if (rt.worldTime(f) - this.last_message > 20) {
			this.occupant_message("Unable to move while in zoom mode.");
			this.last_message = rt.worldTime(f);
		}
		return 0;
	}
	let move_result: Value = 0;
	this.glide_size = max(1, min(32 / max(this.step_in / rt.world().tick_lag, 1), 32));
	if (rt.bitAnd(this.internal_damage, 16)) {
		move_result = (yield* this.mechsteprand());
	} else if (this.dir != direction && !this.strafe) {
		move_result = this.mechturn(direction);
	} else {
		move_result = (yield* this.mechstep(direction));
	}
	if (move_result) {
		yield* this.use_power(this.step_energy_drain);
		this.can_move = 0;
		rt.spawnTail(f, this.step_in, "/obj/mecha/proc/domove: spawn at game/mecha/mecha.dm:512", direction, move_result);
		return 1;
	}
	return 0;
}, true);

// a spawn(rt.srcVarI(f, $ic[246])) body of /obj/mecha/proc/domove, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/mecha/proc/domove: spawn at game/mecha/mecha.dm:512", function* (f: Frame, direction: Value, move_result: Value) {
	this.can_move = 1;
	return null;
});

// mecha.dm:519
rt.def("/obj/mecha/proc/mechturn", function mechturn(f: Frame, direction: Value) {
	this.setDir(direction);
	if (this.turnsound) {
		playsound(this, this.turnsound, 40, 1);
	}
	return 1;
});

// mecha.dm:525
rt.def("/obj/mecha/proc/mechstep", function* mechstep(f: Frame, direction: Value) {
	let current_dir: Value = this.dir;
	let result: Value = (yield* step(this, direction));
	if (this.strafe) {
		yield* this.setDir(current_dir);
	}
	if (result && this.stepsound) {
		playsound(this, this.stepsound, 40, 1);
	}
	return result;
}, true);

// mecha.dm:534
rt.def("/obj/mecha/proc/mechsteprand", function* mechsteprand(f: Frame) {
	let result: Value = null;
	if ((result = (yield* step_rand(this))) && this.stepsound) {
		playsound(this, this.stepsound, 40, 1);
	}
	return result;
}, true);

// mecha.dm:540
rt.def("/obj/mecha/proc/Bump", function* Bump(f: Frame, obstacle: Value, yes: Value) {
	let O: Value = null, M: Value = null;
	if (this.phasing && this.get_charge() >= this.phasing_energy_drain && !this.throwing) {
		rt.spawnTail(f, 0, "/obj/mecha/proc/Bump: spawn at game/mecha/mecha.dm:541", O, M);
	} else {
		if (!yes) return f.dot;
		if (yield* parent_proc()) {
			return f.dot;
		}
		if (this.bumpsmash && this.occupant) {
			if (this.nextsmash < rt.worldTime(f)) {
				yield* obstacle.mech_melee_attack(this);
				if (!obstacle || !obstacle.density) {
					yield* step(this, this.dir);
				}
				this.nextsmash = rt.worldTime(f) + this.smashcooldown;
			}
		}
		if (rt.istype(obstacle, T("/obj"))) {
			if (!(O = obstacle).anchored) {
				yield* step(obstacle, this.dir);
			}
		} else {
			if (!ismob(obstacle)) return f.dot;
			if ((M = obstacle).anchored) return f.dot;
			yield* step(obstacle, this.dir);
		}
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/mecha/proc/Bump, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/mecha/proc/Bump: spawn at game/mecha/mecha.dm:541", function* (f: Frame, O: Value, M: Value) {
	if (this.can_move) {
		this.can_move = 0;
		if (this.phase_state) {
			flick(this.phase_state, this);
		}
		yield* this.forceMove(rt.getStep(f, this, this.dir));
		yield* this.use_power(this.phasing_energy_drain);
		yield* sleep(this.step_in * 3);
		this.can_move = 1;
	}
	return null;
});

// mecha.dm:578
rt.def("/obj/mecha/proc/check_for_internal_damage", function* check_for_internal_damage(f: Frame, possible_int_damage: Value, ignore_threshold: Value) {
	let _T: Value = null, int_dam_flag: Value = null, ME: Value = null;
	if (!rt.istype(possible_int_damage, T("/list")) || isemptylist(possible_int_damage)) {
		return f.dot;
	}
	if (prob(20)) {
		if (ignore_threshold || this.obj_integrity * 100 / this.max_integrity < this.internal_damage_threshold) {
			for (_T of each(possible_int_damage)) {
				if (rt.bitAnd(this.internal_damage, _T)) {
					possible_int_damage -= _T;
				}
			}
			if (int_dam_flag = safepick(possible_int_damage)) {
				this.setInternalDamage(int_dam_flag);
			}
		}
	}
	if (prob(5)) {
		if (ignore_threshold || this.obj_integrity * 100 / this.max_integrity < this.internal_damage_threshold) {
			if (ME = safepick(this.equipment)) {
				yield* qdel(ME);
			}
		}
	}
	return f.dot;
}, true);

// mecha.dm:595
rt.def("/obj/mecha/proc/setInternalDamage", function setInternalDamage(f: Frame, int_dam_flag: Value) {
	(rt.modSrcVar(f, "internal_damage", int_dam_flag, rt.bitOr));
	this.log_append_to_last(`Internal damage of type ${int_dam_flag}.`, 1);
	rt.op(f, "OutputReference", [rt.R.srcVar("occupant")], [sound(rt.rsc("sound/machines/warning-buzzer.ogg"), { wait: 0 })], false);
	this.diag_hud_set_mechstat();
	return f.dot;
});

// mecha.dm:602
rt.def("/obj/mecha/proc/clearInternalDamage", function clearInternalDamage(f: Frame, int_dam_flag: Value) {
	if (rt.bitAnd(this.internal_damage, int_dam_flag)) {
		if (int_dam_flag === 2) {
			this.occupant_message("<span class='boldnotice'>Life support system reactivated.</span>");
		} else if (int_dam_flag === 1) {
			this.occupant_message("<span class='boldnotice'>Internal fire extinquished.</span>");
		} else if (int_dam_flag === 8) {
			this.occupant_message("<span class='boldnotice'>Damaged internal tank has been sealed.</span>");
		}
	}
	(rt.modSrcVar(f, "internal_damage", rt.op(f, "BitNot", [], [int_dam_flag]), rt.bitAnd));
	this.diag_hud_set_mechstat();
	return f.dot;
});

// mecha.dm:618
rt.def("/obj/mecha/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	let B: Value = null, can_control_mech: Value = null, A: Value = null;
	let $e: any;
	if (!rt.istype(user, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	if (user.can_dominate_mechs) {
		this.examine(user);
		rt.forList(f, 0, this.trackers, T("/obj/item/mecha_parts/mecha_tracking"));
		if (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			to_chat(user, "<span class='danger'>Warning: Tracking Beacon detected. Enter at your own risk. Beacon Data:");
			to_chat(user, `${B.get_mecha_info()}`);
		}
		rt.endFor(f, 0);
		to_chat(user, fmt("<a href='?src=＃;ai_take_control=＃'><span class='userdanger'>ASSUME DIRECT CONTROL?</span></a><br>", [user, this]));
	} else {
		this.examine(user);
		if (this.occupant) {
			to_chat(user, "<span class='warning'>This exosuit has a pilot and cannot be controlled.</span>");
			return f.dot;
		}
		can_control_mech = 0;
		rt.forList(f, 0, this.trackers, T("/obj/item/mecha_parts/mecha_tracking/ai_control"));
		if (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			can_control_mech = 1;
			to_chat(user, `<span class='notice'>${bicon(this)} Status of ${this.name}:</span>\n${A.get_mecha_info()}`);
		}
		rt.endFor(f, 0);
		if (!can_control_mech) {
			to_chat(user, "<span class='warning'>You cannot control exosuits without AI control beacons installed.</span>");
			return f.dot;
		}
		to_chat(user, fmt("<a href='?src=＃;ai_take_control=＃'><span class='boldnotice'>Take control of exosuit?</span></a><br>", [user, this]));
	}
	return f.dot;
});

// mecha.dm:645
rt.def("/obj/mecha/proc/transfer_ai", function* transfer_ai(f: Frame) {
	let $0: any, $1: any, $2: any;
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	const subject = f.args[0];
	if (subject === AI_TRANS_TO_CARD) {
		if (!this.state) {
			to_chat(f.args[1], `<span class='warning'>${this.name} must have maintenance protocols active in order to allow a transfer.</span>`);
			return f.dot;
		}
		if (!(f.args[2] = this.occupant) || !rt.istype(this.occupant, T("/mob/living/silicon/ai"))) {
			to_chat(f.args[1], `<span class='warning'>No AI detected in the ${this.name} onboard computer.</span>`);
			return f.dot;
		}
		yield* f.args[2].ai_restore_power();
		f.args[2].control_disabled = 1;
		f.args[2].radio_enabled = 0;
		yield* f.args[2].disconnect_shell();
		yield* this.RemoveActions(f.args[2], 1);
		this.occupant = null;
		yield* f.args[2].forceMove(f.args[3]);
		f.args[3].AI = f.args[2];
		f.args[2].controlled_mech = null;
		f.args[2].remote_control = null;
		this.icon_state = rt.initial(f, this, "icon_state") + "-open";
		to_chat(f.args[2], "You have been downloaded to a mobile storage device. Wireless connection offline.");
		to_chat(f.args[1], `<span class='boldnotice'>Transfer successful</span>: ${f.args[2].name} (${rand(1000, 9999)}.exe) removed from ${this.name} and stored within local memory.`);
	} else if (subject === AI_MECH_HACK) {
		f.args[2].linked_core = (yield* new_(T("/obj/structure/AIcore/deactivated"), f.args[2].loc));
		if (f.args[2].can_dominate_mechs) {
			if (this.occupant) {
				to_chat(f.args[2], "<span class='warning'>Pilot detected! Forced ejection initiated!");
				to_chat(this.occupant, "<span class='danger'>You have been forcibly ejected!</span>");
				yield* this.go_out(1);
			}
		}
		yield* this.ai_enter_mech(f.args[2], f.args[0]);
	} else if (subject === AI_TRANS_FROM_CARD) {
		if (!(f.args[2] = f.args[3].AI)) {
			to_chat(f.args[1], "<span class='warning'>There is no AI currently installed on this device.</span>");
			return f.dot;
		}
		if (f.args[2].deployed_shell) {
			yield* f.args[2].disconnect_shell();
		}
		if (f.args[2].stat || !f.args[2].client) {
			to_chat(f.args[1], `<span class='warning'>${f.args[2].name} is currently unresponsive, and cannot be uploaded.</span>`);
			return f.dot;
		}
		if (this.occupant || this.dna_lock) {
			$0 = f.args[1];
			$1 = this.name;
			if (this.occupant) {

				$2 = "currently occupied";
			} else {
				$2 = "secured with a DNA lock";
			}
			to_chat($0, `<span class='warning'>Access denied. ${$1} is ${$2}.`);
			return f.dot;
		}
		f.args[2].control_disabled = 0;
		f.args[2].radio_enabled = 1;
		to_chat(f.args[1], `<span class='boldnotice'>Transfer successful</span>: ${f.args[2].name} (${rand(1000, 9999)}.exe) installed and executed successfully. Local copy has been removed.`);
		f.args[3].AI = null;
		yield* this.ai_enter_mech(f.args[2], f.args[0]);
	}
	return f.dot;
}, true, { args: ["interaction", "user", "AI", "card"] });

// mecha.dm:702
rt.def("/obj/mecha/proc/ai_enter_mech", function* ai_enter_mech(f: Frame, AI: Value, interaction: Value) {
	let $1: any;
	yield* AI.ai_restore_power();
	yield* AI.forceMove(this);
	this.occupant = AI;
	this.icon_state = rt.initial(f, this, "icon_state");
	playsound(this, rt.rsc("sound/machines/windowdoor.ogg"), 50, 1);
	if (!this.internal_damage) {
		rt.op(f, "OutputReference", [rt.R.srcVar("occupant")], [(yield* sound(rt.rsc("sound/mecha/nominal.ogg"), { volume: 50 }))], false);
	}
	yield* AI.cancel_camera();
	AI.controlled_mech = this;
	AI.remote_control = this;
	AI.canmove = 1;
	AI.can_shunt = 0;
	let $0: any = AI;
	if (AI.can_dominate_mechs) {
		$1 = `<span class='announce'>Takeover of ${this.name} complete! You are now loaded onto the onboard computer. Do not attempt to leave the station sector!</span>`;
	} else {
		$1 = "<span class='notice'>You have been uploaded to a mech's onboard computer.";
	}
	to_chat($0, `${$1}`);
	to_chat(AI, "<span class='reallybig boldnotice'>Use Middle-Mouse to activate mech functions and equipment. Click normally for AI interactions.</span>");
	if (interaction == AI_TRANS_FROM_CARD) {
		yield* this.GrantActions(AI, 0);
	} else {
		yield* this.GrantActions(AI, (!AI.can_dominate_mechs ? 1 : 0));
	}
	return f.dot;
}, true);

// mecha.dm:725
rt.def("/obj/mecha/proc/aimob_enter_mech", function* aimob_enter_mech(f: Frame, pilot_mob: Value) {
	if (!(pilot_mob && pilot_mob.Adjacent(this))) return f.dot;
	if (this.occupant) {
		return f.dot;
	}
	this.icon_state = rt.initial(f, this, "icon_state");
	this.occupant = pilot_mob;
	pilot_mob.mecha = this;
	pilot_mob.loc = this;
	yield* this.GrantActions(pilot_mob);
	return f.dot;
}, true);

// mecha.dm:735
rt.def("/obj/mecha/proc/aimob_exit_mech", function* aimob_exit_mech(f: Frame, pilot_mob: Value) {
	if (this.occupant == pilot_mob) {
		this.occupant = null;
	}
	if (pilot_mob.mecha == this) {
		pilot_mob.mecha = null;
	}
	this.icon_state = `${rt.initial(f, this, "icon_state")}-open`;
	yield* pilot_mob.forceMove(rt.getStep(f, this, 0));
	yield* this.RemoveActions(pilot_mob);
	return f.dot;
}, true);

// mecha.dm:750
rt.def("/obj/mecha/proc/remove_air", function* remove_air(f: Frame, amount: Value) {
	if (this.use_internal_tank) {
		return (yield* this.cabin_air.remove(amount));
	}
	return (yield* parent_proc());
}, true);

// mecha.dm:756
rt.def("/obj/mecha/proc/return_air", function return_air(f: Frame) {
	if (this.use_internal_tank) {
		return this.cabin_air;
	}
	return parent_proc();
});

// mecha.dm:759
rt.def("/obj/mecha/proc/return_pressure", function return_pressure(f: Frame) {
	let t_air: Value = null;
	if (t_air = this.return_air()) {
		f.dot = t_air.return_pressure();
	}
	return f.dot;
});

// mecha.dm:766
rt.def("/obj/mecha/proc/return_temperature", function return_temperature(f: Frame) {
	let t_air: Value = null;
	if (t_air = this.return_air()) {
		f.dot = t_air.return_temperature();
	}
	return f.dot;
});

// mecha.dm:773
rt.def("/obj/mecha/proc/connect", function connect(f: Frame, new_port: Value) {
	let connected_port_parent: Value = null;
	if (this.connected_port || !new_port || new_port.connected_device) {
		return 0;
	}
	if (new_port.loc != this.loc) {
		return 0;
	}
	this.connected_port = new_port;
	this.connected_port.connected_device = this;
	(connected_port_parent = rt.index(this.connected_port.parents, 1)).reconcile_air();
	this.log_message("Connected to gas port.");
	return 1;
});

// mecha.dm:790
rt.def("/obj/mecha/proc/disconnect", function disconnect(f: Frame) {
	if (!this.connected_port) {
		return 0;
	}
	this.connected_port.connected_device = null;
	this.connected_port = null;
	this.log_message("Disconnected from gas port.");
	return 1;
});

// mecha.dm:799
rt.def("/obj/mecha/proc/portableConnectorReturnAir", function portableConnectorReturnAir(f: Frame) {
	return this.internal_tank.return_air();
});

// mecha.dm:803
rt.def("/obj/mecha/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, M: Value, user: Value) {
	let passed: Value = null, C: Value = null;
	if (!user.canUseTopic(this) || user != M) {
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	this.log_message(`${user} tries to move in.`);
	if (this.occupant) {
		to_chat(f.usr, `<span class='warning'>The ${this.name} is already occupied!</span>`);
		this.log_append_to_last("Permission denied.");
		return f.dot;
	}
	if (this.dna_lock) {
		if (user.has_dna()) {
			if ((C = user).dna.unique_enzymes == this.dna_lock) {
				passed = 1;
			}
		}
	} else if (this.operation_allowed(user)) {
		passed = 1;
	}
	if (!passed) {
		to_chat(user, "<span class='warning'>Access denied.</span>");
		this.log_append_to_last("Permission denied.");
		return f.dot;
	}
	if (user.buckled) {
		to_chat(user, "<span class='warning'>You are currently buckled and cannot move.</span>");
		this.log_append_to_last("Permission denied.");
		return f.dot;
	}
	if (user.has_buckled_mobs()) {
		to_chat(user, "<span class='warning'>You can't enter the exosuit with other creatures attached to you!</span>");
		return f.dot;
	}
	this.visible_message(`${user} starts to climb into ${this.name}.`);
	if (yield* do_after(user, 40, { target: this })) {
		if (this.obj_integrity <= 0) {
			to_chat(user, `<span class='warning'>You cannot get in the ${this.name}, it has been destroyed!</span>`);
		} else if (this.occupant) {
			to_chat(user, `<span class='danger'>${this.occupant} was faster! Try better next time, loser.</span>`);
		} else if (user.buckled) {
			to_chat(user, "<span class='warning'>You can't enter the exosuit while buckled.</span>");
		} else if (user.has_buckled_mobs()) {
			to_chat(user, "<span class='warning'>You can't enter the exosuit with other creatures attached to you!</span>");
		} else {
			yield* this.moved_inside(user);
		}
	} else {
		to_chat(user, "<span class='warning'>You stop entering the exosuit!</span>");
	}
	return f.dot;
}, true);

// mecha.dm:850
rt.def("/obj/mecha/proc/moved_inside", function* moved_inside(f: Frame, H: Value) {
	if (rt.isIn(f, ((H && H.client) && H), range(1))) {
		this.occupant = H;
		yield* H.forceMove(this);
		yield* this.add_fingerprint(H);
		yield* this.GrantActions(H, { human_occupant: 1 });
		yield* this.forceMove(this.loc);
		this.log_append_to_last(`${H} moved in as pilot.`);
		this.icon_state = rt.initial(f, this, "icon_state");
		yield* this.setDir(this.dir_in);
		playsound(this, rt.rsc("sound/machines/windowdoor.ogg"), 50, 1);
		if (!this.internal_damage) {
			rt.op(f, "OutputReference", [rt.R.srcVar("occupant")], [(yield* sound(rt.rsc("sound/mecha/nominal.ogg"), { volume: 50 }))], false);
		}
		return 1;
	} else {
		return 0;
	}
}, true);

// mecha.dm:867
rt.def("/obj/mecha/proc/mmi_move_inside", function* mmi_move_inside(f: Frame, mmi_as_oc: Value, user: Value) {
	if (!mmi_as_oc.brainmob || !mmi_as_oc.brainmob.client) {
		to_chat(user, "<span class='warning'>Consciousness matrix not detected!</span>");
		return 0;
	} else if (mmi_as_oc.brainmob.stat) {
		to_chat(user, "<span class='warning'>Beta-rhythm below acceptable level!</span>");
		return 0;
	} else if (this.occupant) {
		to_chat(user, "<span class='warning'>Occupant detected!</span>");
		return 0;
	} else if (this.dna_lock && (!mmi_as_oc.brainmob.stored_dna || this.dna_lock != mmi_as_oc.brainmob.stored_dna.unique_enzymes)) {
		to_chat(user, `<span class='warning'>Access denied. ${this.name} is secured with a DNA lock.</span>`);
		return 0;
	}
	this.visible_message(`<span class='notice'>${user} starts to insert an MMI into ${this.name}.</span>`);
	if (yield* do_after(user, 40, { target: this })) {
		if (!this.occupant) {
			return (yield* this.mmi_moved_inside(mmi_as_oc, user));
		}
		to_chat(user, "<span class='warning'>Occupant detected!</span>");
	} else {
		to_chat(user, "<span class='notice'>You stop inserting the MMI.</span>");
	}
	return 0;
}, true);

// mecha.dm:892
rt.def("/obj/mecha/proc/mmi_moved_inside", function* mmi_moved_inside(f: Frame, mmi_as_oc: Value, user: Value) {
	if (!(this.Adjacent(mmi_as_oc) && this.Adjacent(user))) {
		return 0;
	}
	if (!mmi_as_oc.brainmob || !mmi_as_oc.brainmob.client) {
		to_chat(user, "<span class='notice'>Consciousness matrix not detected!</span>");
		return 0;
	} else if (mmi_as_oc.brainmob.stat) {
		to_chat(user, "<span class='warning'>Beta-rhythm below acceptable level!</span>");
		return 0;
	}
	if (!(yield* user.transferItemToLoc(mmi_as_oc, this))) {
		to_chat(user, fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [mmi_as_oc, this]));
		return 0;
	}
	let brainmob: Value = mmi_as_oc.brainmob;
	mmi_as_oc.mecha = this;
	this.occupant = brainmob;
	yield* brainmob.forceMove(this);
	yield* brainmob.reset_perspective(this);
	brainmob.remote_control = this;
	yield* brainmob.update_canmove();
	this.icon_state = rt.initial(f, this, "icon_state");
	yield* this.update_icon();
	yield* this.setDir(this.dir_in);
	this.log_message(`${mmi_as_oc} moved in as pilot.`);
	if (!this.internal_damage) {
		rt.op(f, "OutputReference", [rt.R.srcVar("occupant")], [(yield* sound(rt.rsc("sound/mecha/nominal.ogg"), { volume: 50 }))], false);
	}
	yield* this.GrantActions(brainmob);
	return 1;
}, true);

// mecha.dm:920
rt.def("/obj/mecha/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	yield* this.go_out();
	return f.dot;
}, true);

// mecha.dm:924
rt.def("/obj/mecha/proc/Exited", function* Exited(f: Frame, M: Value, newloc: Value) {
	if (!(this.occupant && this.occupant == M)) return f.dot;
	yield* this.go_out(1, newloc);
	return f.dot;
}, true);

// mecha.dm:928
rt.def("/obj/mecha/proc/go_out", function* go_out(f: Frame, forced: Value, newloc: Value) {
	let mob_container: Value = null, brain: Value = null, AI: Value = null, mmi: Value = null;
	newloc ??= this.loc;
	if (!this.occupant) {
		return f.dot;
	}
	yield* this.occupant.clear_alert("charge");
	yield* this.occupant.clear_alert("mech damage");
	if (rt.istype(this.occupant, T("/mob/living/carbon/human"))) {
		mob_container = this.occupant;
		yield* this.RemoveActions(this.occupant, { human_occupant: 1 });
	} else if (rt.istype(this.occupant, T("/mob/living/brain"))) {
		yield* this.RemoveActions((brain = this.occupant));
		mob_container = brain.container;
	} else if (rt.istype(this.occupant, T("/mob/living/silicon/ai"))) {
		AI = this.occupant;
		if (forced) {
			yield* this.RemoveActions(this.occupant);
			yield* this.occupant.gib();
			this.occupant = null;
			return f.dot;
		} else {
			if (!AI.linked_core) {
				to_chat(AI, "<span class='userdanger'>Inactive core destroyed. Unable to return.</span>");
				AI.linked_core = null;
				return f.dot;
			}
			to_chat(AI, "<span class='notice'>Returning to core...</span>");
			AI.controlled_mech = null;
			AI.remote_control = null;
			yield* this.RemoveActions(this.occupant, 1);
			mob_container = AI;
			newloc = rt.getStep(f, AI.linked_core, 0);
			yield* qdel(AI.linked_core);
		}
	} else {
		return f.dot;
	}
	let L: Value = this.occupant;
	this.occupant = null;
	if (yield* mob_container.forceMove(newloc)) {
		this.log_message(`${mob_container} moved out.`);
		rt.op(f, "Browse", [], [L, null, "window=exosuit"], false);
		if (rt.istype(mob_container, T("/obj/item/device/mmi"))) {
			if ((mmi = mob_container).brainmob) {
				L.loc = mmi;
				yield* L.reset_perspective();
			}
			mmi.mecha = null;
			yield* mmi.update_icon();
			L.canmove = 0;
		}
		this.icon_state = rt.initial(f, this, "icon_state") + "-open";
		yield* this.setDir(this.dir_in);
	}
	if (!(L && L.client)) return f.dot;
	yield* L.client.change_view(L.client.default_view());
	this.zoom_mode = 0;
	return f.dot;
}, true);

// mecha.dm:987
rt.def("/obj/mecha/proc/operation_allowed", function operation_allowed(f: Frame, M: Value) {
	this.req_access = this.operation_req_access;
	this.req_one_access = list();
	return this.allowed(M);
});

// mecha.dm:992
rt.def("/obj/mecha/proc/internals_access_allowed", function internals_access_allowed(f: Frame, M: Value) {
	this.req_one_access = this.internals_req_access;
	this.req_access = list();
	return this.allowed(M);
});

// mecha.dm:1004
rt.def("/obj/mecha/proc/occupant_message", function occupant_message(f: Frame, message: Value) {
	if (message) {
		if (this.occupant && this.occupant.client) {
			to_chat(this.occupant, `${bicon(this)} ${message}`);
		}
	}
	return f.dot;
});

// mecha.dm:1009
rt.def("/obj/mecha/proc/log_message", function log_message(f: Frame, message: Value, red: Value) {
	let $9: any;
	this.log.len++;
	let $0: any = this.log;
	let $1: any = rt.len(f, this.log);
	let $2: any = "time";
	let $3: any = `${worldtime2text()}`;
	let $4: any = null;
	let $5: any = "date";
	let $6: any = "year";
	let $7: any = `${GLOB.year_integer + 540}`;
	let $8: any = "message";
	if (red) {
		$9 = "<font color='red'>";
	} else {
		$9 = null;
	}
	let $10: any = message;
	rt.setAt($0, $1, rt.alist(f, [$2, $3, $4, $5, $6, $7, $8, `${$9}${$10}${red ? "</font>" : null}`]));
	return rt.len(f, this.log);
});

// mecha.dm:1014
rt.def("/obj/mecha/proc/log_append_to_last", function log_append_to_last(f: Frame, message: Value, red: Value) {
	let last_entry: Value = null;
	let $2: any;
	let $0: any = (last_entry = rt.index(this.log, rt.len(f, this.log)));
	let $1: any = "message";
	if (red) {
		$2 = "<font color='red'>";
	} else {
		$2 = null;
	}
	let $3: any = message;
	rt.modAt($0, $1, `<br>${$2}${$3}${red ? "</font>" : null}`, add);
	return f.dot;
});

// mecha.dm:1018
rt.def("/datum/controller/global_vars/proc/InitGlobalyear", function InitGlobalyear(f: Frame) {
	GLOB.year = time2text(rt.world().realtime, "YYYY");
	this.gvars_datum_init_order += "year";
	return f.dot;
});

// mecha.dm:1019
rt.def("/datum/controller/global_vars/proc/InitGlobalyear_integer", function InitGlobalyear_integer(f: Frame) {
	GLOB.year_integer = text2num(GLOB.year);
	this.gvars_datum_init_order += "year_integer";
	return f.dot;
});

// mecha.dm:1026
rt.def("/obj/mecha/proc/has_charge", function has_charge(f: Frame, amount: Value) {
	return (this.get_charge() >= amount ? 1 : 0);
});

// mecha.dm:1029
rt.def("/obj/mecha/proc/get_charge", function get_charge(f: Frame) {
	let R: Value = null, relay_charge: Value = null;
	for (R of each(this.equipment, T("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay"))) {
		if (relay_charge = R.get_charge()) {
			return relay_charge;
		}
	}
	if (!this.cell) return f.dot;
	return max(0, this.cell.charge);
});

// mecha.dm:1037
rt.def("/obj/mecha/proc/use_power", function* use_power(f: Frame, amount: Value) {
	if (this.get_charge()) {
		yield* this.cell.use(amount);
		return 1;
	}
	return 0;
}, true);

// mecha.dm:1043
rt.def("/obj/mecha/proc/give_power", function* give_power(f: Frame, amount: Value) {
	if (this.get_charge() !== null) {
		yield* this.cell.give(amount);
		return 1;
	}
	return 0;
}, true);

// mecha.dm:1053
rt.def("/obj/mecha/proc/update_remote_sight", function update_remote_sight(f: Frame, user: Value) {
	if (!this.occupant_sight_flags) return f.dot;
	if (user != this.occupant) return f.dot;
	(rt.modField(f, user, "sight", this.occupant_sight_flags, rt.bitOr));
	return f.dot;
});
