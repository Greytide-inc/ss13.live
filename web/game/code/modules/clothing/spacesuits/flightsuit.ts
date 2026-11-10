// Based on /tg/station's code/modules/clothing/spacesuits/flightsuit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


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

// flightsuit.dm:20
rt.def("/obj/item/device/flightpack/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/flightpack/toggle_flight"), T("/datum/action/item_action/flightpack/engage_boosters"), T("/datum/action/item_action/flightpack/toggle_stabilizers"), T("/datum/action/item_action/flightpack/change_power"), T("/datum/action/item_action/flightpack/toggle_airbrake"));
	this.armor = rt.alist(f, ["melee", 20, "bullet", 20, "laser", 20, "energy", 10, "bomb", 30, "bio", 100, "rad", 75, "fire", 100, "acid", 75]);
	return f.dot;
});

// flightsuit.dm:110
rt.def("/obj/item/device/flightpack/proc/Initialize", function* Initialize(f: Frame) {
	this.ion_trail = (yield* new_(T("/datum/effect_system/trail_follow/ion/flight")));
	yield* this.ion_trail.set_up(this);
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSflightpacks.processing += this;
	}
	this.update_parts();
	this.sync_processing(GLOB.SSflightpacks);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9390, "/obj/item/device/flightpack/full", "/obj/item/device/flightpack", {});

// flightsuit.dm:118
rt.def("/obj/item/device/flightpack/full/proc/Initialize", function* Initialize(f: Frame) {
	this.part_manip = (yield* new_(T("/obj/item/weapon/stock_parts/manipulator/pico"), this));
	this.part_scan = (yield* new_(T("/obj/item/weapon/stock_parts/scanning_module/phasic"), this));
	this.part_cap = (yield* new_(T("/obj/item/weapon/stock_parts/capacitor/super"), this));
	this.part_laser = (yield* new_(T("/obj/item/weapon/stock_parts/micro_laser/ultra"), this));
	this.part_bin = (yield* new_(T("/obj/item/weapon/stock_parts/matter_bin/super"), this));
	this.assembled = 1;
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:128
rt.def("/obj/item/device/flightpack/proc/sync_processing", function sync_processing(f: Frame, FPS: Value) {
	this.processing_mode = FPS.flightsuit_processing;
	if (this.processing_mode != 0) return f.dot;
	this.momentum_x = 0;
	this.momentum_y = 0;
	this.momentum_speed_x = 0;
	this.momentum_speed_y = 0;
	this.momentum_speed = 0;
	this.boost_charge = 0;
	this.boost = 0;
	this.update_slowdown();
	return f.dot;
});

// flightsuit.dm:139
rt.def("/obj/item/device/flightpack/proc/update_parts", function update_parts(f: Frame) {
	this.boost_chargerate = rt.initial(f, this, "boost_chargerate");
	this.boost_drain = rt.initial(f, this, "boost_drain");
	this.powersetting_high = rt.initial(f, this, "powersetting_high");
	this.emp_disable_threshold = rt.initial(f, this, "emp_disable_threshold");
	this.crash_disable_threshold = rt.initial(f, this, "crash_disable_threshold");
	this.stabilizer_decay_amount = rt.initial(f, this, "stabilizer_decay_amount");
	this.airbrake_decay_amount = rt.initial(f, this, "airbrake_decay_amount");
	let manip: Value = 0;
	let scan: Value = 0;
	let cap: Value = 0;
	let laser: Value = 0;
	let bin: Value = 0;
	this.assembled = 0;
	if (this.part_manip && this.part_scan && this.part_cap && this.part_laser && this.part_bin) {
		manip = this.part_manip.rating;
		scan = this.part_scan.rating;
		cap = this.part_cap.rating;
		laser = this.part_laser.rating;
		bin = this.part_bin.rating;
		this.assembled = 1;
	}
	this.boost_chargerate *= cap;
	this.boost_drain -= manip;
	this.powersetting_high = max(0, min(laser, 3));
	this.emp_disable_threshold = bin * 1.25;
	this.crash_disable_threshold = bin * 2;
	this.stabilizer_decay_amount = scan * 3.5;
	this.airbrake_decay_amount = manip * 8;
	this.crash_dampening = bin;
	return f.dot;
});

// flightsuit.dm:170
rt.def("/obj/item/device/flightpack/proc/Destroy", function* Destroy(f: Frame) {
	if (this.suit) {
		this.delink_suit();
	}
	yield* qdel(this.part_manip);
	yield* qdel(this.part_scan);
	yield* qdel(this.part_cap);
	yield* qdel(this.part_laser);
	yield* qdel(this.part_bin);
	this.isprocessing = 0;
	GLOB.SSflightpacks.processing -= this;
	this.part_manip = null;
	this.part_scan = null;
	this.part_cap = null;
	this.part_laser = null;
	this.part_bin = null;
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:186
rt.def("/obj/item/device/flightpack/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	let damage: Value = 0;
	if (severity == 1) {
		damage = this.emp_strong_damage;
	} else {
		damage = this.emp_weak_damage;
	}
	if (this.emp_damage <= this.emp_disable_threshold * 1.5) {
		this.emp_damage += damage;
	}
	to_chat(this.wearer, "<span class='userdanger'>Flightpack: BZZZZZZZZZZZT</span>");
	to_chat(this.wearer, `<span class='warning'>Flightpack: WARNING: Class ${severity} EMP detected! Circuit damage at ${100 / this.emp_disable_threshold * this.emp_damage}!</span>`);
	return f.dot;
});

// flightsuit.dm:197
rt.def("/obj/item/device/flightpack/proc/ui_action_click", function* ui_action_click(f: Frame, owner: Value, action: Value) {
	if (this.wearer != owner) {
		this.wearer = owner;
	}
	if (!this.suit) {
		this.usermessage("The flightpack will not work without being attached to a suit first!");
		return 0;
	}
	if (rt.istype(action, T("/datum/action/item_action/flightpack/toggle_flight"))) {
		if (!this.flight) {
			yield* this.enable_flight();
		} else {
			yield* this.disable_flight();
		}
	}
	if (rt.istype(action, T("/datum/action/item_action/flightpack/engage_boosters"))) {
		if (!this.boost) {
			yield* this.activate_booster();
		} else {
			yield* this.deactivate_booster();
		}
	}
	if (rt.istype(action, T("/datum/action/item_action/flightpack/toggle_stabilizers"))) {
		if (!this.stabilizer) {
			this.enable_stabilizers();
		} else {
			this.disable_stabilizers();
		}
	}
	if (rt.istype(action, T("/datum/action/item_action/flightpack/change_power"))) {
		this.cycle_power();
	}
	if (!rt.istype(action, T("/datum/action/item_action/flightpack/toggle_airbrake"))) return f.dot;
	if (!this.brake) {
		this.enable_airbrake();
	} else {
		this.disable_airbrake();
	}
	return f.dot;
}, true);

// flightsuit.dm:227
rt.def("/obj/item/device/flightpack/proc/adjust_momentum", function adjust_momentum(f: Frame, amountx: Value, amounty: Value, reduce_amount_total: Value) {
	reduce_amount_total ??= 0;
	if (reduce_amount_total != 0) {
		if (this.momentum_x > 0) {
			this.momentum_x = max(0, min(this.momentum_x - reduce_amount_total, this.momentum_max));
		} else if (this.momentum_x < 0) {
			this.momentum_x = max(-this.momentum_max, min(this.momentum_x + reduce_amount_total, 0));
		}
		if (this.momentum_y > 0) {
			this.momentum_y = max(0, min(this.momentum_y - reduce_amount_total, this.momentum_max));
		} else if (this.momentum_y < 0) {
			this.momentum_y = max(-this.momentum_max, min(this.momentum_y + reduce_amount_total, 0));
		}
	}
	this.momentum_x = max(-this.momentum_max, min(this.momentum_x + amountx, this.momentum_max));
	this.momentum_y = max(-this.momentum_max, min(this.momentum_y + amounty, this.momentum_max));
	this.calculate_momentum_speed();
	return f.dot;
});

// flightsuit.dm:242
rt.def("/obj/item/device/flightpack/proc/wearer_movement", function wearer_movement(f: Frame, dir: Value) {
	if (!this.flight) {
		return f.dot;
	}
	let momentum_increment: Value = this.momentum_gain;
	if (this.boost) {
		momentum_increment = this.boost_power;
	}
	if (this.brake) {
		momentum_increment = 0;
	}
	if (!this.gravity && !this.pressure) {
		momentum_increment -= 10;
	}
	if (dir === 1) {
		this.adjust_momentum(0, momentum_increment);
	} else if (dir === 2) {
		this.adjust_momentum(0, -momentum_increment);
	} else if (dir === 4) {
		this.adjust_momentum(momentum_increment, 0);
	} else if (dir === 8) {
		this.adjust_momentum(-momentum_increment, 0);
	}
	return f.dot;
});

// flightsuit.dm:263
rt.def("/obj/item/device/flightpack/proc/momentum_drift", function* momentum_drift(f: Frame) {
	let i: Value = null, oldturf: Value = null;
	let $e: any;
	if (!this.flight) {
		return 0;
	}
	if (this.wearer.pulling) {
		this.dragging_through = this.wearer.pulling;
	} else if (this.dragging_through) {
		this.dragging_through = null;
	}
	let drift_dir_x: Value = 0;
	let drift_dir_y: Value = 0;
	if (this.momentum_x > 0) {
		drift_dir_x = 4;
	}
	if (this.momentum_x < 0) {
		drift_dir_x = 8;
	}
	if (this.momentum_y > 0) {
		drift_dir_y = 1;
	}
	if (this.momentum_y < 0) {
		drift_dir_y = 2;
	}
	if (this.momentum_speed == 0) {
		return 0;
	}
	if (!this.suit) return f.dot;
	if (!this.wearer) return f.dot;
	if (!this.wearer.canmove) {
		yield* this.losecontrol();
	}
	this.momentum_decay();
	rt.forRange(f, 0, 1, this.momentum_speed, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		oldturf = rt.getStep(f, this.wearer, 0);
		if (this.momentum_speed_x >= i) {
			yield* step(this.wearer, drift_dir_x);
		}
		if (this.momentum_speed_y >= i) {
			yield* step(this.wearer, drift_dir_y);
		}
		if (this.dragging_through && oldturf) {
			yield* this.dragging_through.forceMove(oldturf);
			this.wearer.pulling = this.dragging_through;
		}
		yield* sleep(1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// flightsuit.dm:300
rt.def("/obj/item/device/flightpack/proc/momentum_decay", function momentum_decay(f: Frame) {
	if (this.brake) {
		this.adjust_momentum(0, 0, this.airbrake_decay_amount);
	}
	if (this.gravity) {
		this.adjust_momentum(0, 0, this.gravity_decay_amount);
	}
	if (this.stabilizer) {
		this.adjust_momentum(0, 0, this.stabilizer_decay_amount);
	}
	if (this.pressure) {
		this.adjust_momentum(0, 0, this.pressure_decay_amount);
	}
	this.adjust_momentum(0, 0, this.momentum_passive_loss);
	return f.dot;
});

// flightsuit.dm:313
rt.def("/obj/item/device/flightpack/proc/check_conditions", function* check_conditions(f: Frame) {
	let _T: Value = null, gas: Value = null, envpressure: Value = null;
	if (this.suit) {
		if (this.wearer) {
			if (this.wearer.has_gravity()) {
				this.gravity = 1;
			} else {
				this.gravity = 0;
			}
			_T = rt.getStep(f, this.wearer, 0);
			gas = _T.return_air();
			if ((envpressure = gas.return_pressure()) >= this.pressure_threshold) {
				this.pressure = 1;
			} else {
				this.pressure = 0;
			}
		}
	}
	if (this.flight) {
		if (!this.assembled) {
			yield* this.disable_flight(1);
		}
		if (!this.suit) {
			yield* this.disable_flight(1);
		}
		if (!this.wearer) {
			yield* this.disable_flight(1);
		}
	}
	if (!this.pressure && this.brake) {
		this.brake = 0;
		this.usermessage("Airbrakes deactivated due to lack of pressure!", 2);
	}
	if (this.suit.deployedshoes) return f.dot;
	if (!(this.brake || this.stabilizer)) return f.dot;
	this.brake = 0;
	this.stabilizer = 0;
	this.usermessage("Warning: Sensor data is not being received from flight shoes. Stabilizers and airbrake modules OFFLINE!", 2);
	return f.dot;
}, true);

// flightsuit.dm:341
rt.def("/obj/item/device/flightpack/proc/update_slowdown", function update_slowdown(f: Frame) {
	if (!this.flight) {
		this.suit.slowdown = this.slowdown_ground;
		return f.dot;
	} else {
		this.suit.slowdown = this.slowdown_air;
	}
	return f.dot;
});

// flightsuit.dm:348
rt.def("/obj/item/device/flightpack/proc/process", function* process(f: Frame) {
	if (!this.suit || this.processing_mode == 0) {
		return 0;
	}
	yield* this.check_conditions();
	this.calculate_momentum_speed();
	yield* this.momentum_drift();
	yield* this.handle_boost();
	yield* this.handle_damage();
	return f.dot;
}, true, { waitfor: false });

// flightsuit.dm:358
rt.def("/obj/item/device/flightpack/proc/handle_damage", function* handle_damage(f: Frame) {
	if (this.crash_damage) {
		this.crash_damage = max(0, min(this.crash_damage - this.crash_heal_amount, this.crash_disable_threshold * 10));
		if (this.crash_damage >= this.crash_disable_threshold) {
			this.crash_disabled = 1;
		}
		if (this.crash_disabled && this.crash_damage <= 1) {
			this.crash_disabled = 0;
			this.crash_disable_message = 0;
			this.usermessage("Gyroscopic sensors recalibrated. Flight systems re-enabled.");
		}
	}
	if (this.emp_damage) {
		this.emp_damage = max(0, min(this.emp_damage - this.emp_heal_amount, this.emp_disable_threshold * 10));
		if (this.emp_damage >= this.emp_disable_threshold) {
			this.emp_disabled = 1;
		}
		if (this.emp_disabled && this.emp_damage <= 0.5) {
			this.emp_disabled = 0;
			this.emp_disable_message = 0;
			this.usermessage("Electromagnetic deflection system re-activated. Flight systems re-enabled.");
		}
	}
	this.disabled = this.crash_disabled + this.emp_disabled;
	if (!this.disabled) return f.dot;
	if (this.crash_disabled && !this.crash_disable_message) {
		this.usermessage("Internal gyroscopes scrambled from excessive impacts.", 2);
		this.usermessage("Deactivating to recalibrate flight systems!", 2);
		this.crash_disable_message = 1;
	}
	if (this.emp_disabled && !this.emp_disable_message) {
		this.usermessage("Electromagnetic deflectors overloaded. Short circuit detected in internal systems!", 1);
		this.usermessage("Deactivating to prevent fatal power overload!", 2);
		this.emp_disable_message = 1;
	}
	if (!this.flight) return f.dot;
	yield* this.disable_flight(1);
	return f.dot;
}, true);

// flightsuit.dm:387
rt.def("/obj/item/device/flightpack/proc/update_icon", function* update_icon(f: Frame) {
	if (!this.flight) {
		this.icon_state = rt.initial(f, this, "icon_state");
		this.item_state = rt.initial(f, this, "item_state");
	}
	if (this.flight) {
		this.icon_state = this.icon_state_active;
		this.item_state = this.item_state_active;
		if (this.boost) {
			this.icon_state = this.icon_state_boost;
			this.item_state = this.item_state_boost;
		}
	}
	if (this.wearer) {
		yield* this.wearer.update_inv_wear_suit();
		this.wearer.update_inv_back();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:403
rt.def("/obj/item/device/flightpack/proc/handle_boost", function* handle_boost(f: Frame) {
	if (this.boost) {
		this.boost_charge = max(0, min(this.boost_charge - this.boost_drain, this.boost_maxcharge));
		if (this.boost_charge < 1) {
			yield* this.deactivate_booster();
		}
	}
	if (!(this.boost_charge < this.boost_maxcharge)) return f.dot;
	this.boost_charge = max(0, min(this.boost_charge + this.boost_chargerate, this.boost_maxcharge));
	return f.dot;
}, true);

// flightsuit.dm:410
rt.def("/obj/item/device/flightpack/proc/cycle_power", function cycle_power(f: Frame) {
	if (this.powersetting < this.powersetting_high) {
		this.powersetting++;
	} else {
		this.powersetting = 1;
	}
	this.momentum_gain = this.powersetting * 10;
	this.usermessage(`Engine output set to ${this.momentum_gain}.`);
	this.momentum_drift_coeff = this.momentum_gain * (this.drift_tolerance * 1.1) / this.momentum_max;
	return f.dot;
});

// flightsuit.dm:419
rt.def("/obj/item/device/flightpack/proc/crash_damage", function* crash_damage(f: Frame, density: Value, anchored: Value, speed: Value, victim_name: Value) {
	let crashmessagesrc: Value = `<span class='userdanger'>${this.wearer} violently crashes into ${victim_name}, `;
	let userdamage: Value = 10;
	userdamage -= this.stabilizer * 3;
	userdamage -= this.part_bin.rating;
	userdamage -= this.part_scan.rating;
	userdamage -= this.part_manip.rating;
	userdamage += anchored * 2;
	userdamage += this.boost * 2;
	if ((userdamage += speed * 2) < 0) {
		userdamage = 0;
	}
	if (userdamage) {
		crashmessagesrc += "that really must have hurt!";
	} else {
		crashmessagesrc += `but luckily ${this.wearer}'s impact was absorbed by their suit's stabilizers!</span>`;
	}
	yield* this.wearer.adjustBruteLoss(userdamage);
	this.usermessage("WARNING: Stabilizers taking damage!", 2);
	this.wearer.visible_message(crashmessagesrc);
	this.crash_damage = max(0, min(this.crash_damage + this.crash_damage_high, this.crash_disable_threshold * 1.5));
	return f.dot;
}, true);

// flightsuit.dm:440
rt.def("/obj/item/device/flightpack/proc/userknockback", function* userknockback(f: Frame, density: Value, anchored: Value, speed: Value, dir: Value) {
	let angle: Value = dir2angle(dir);
	if ((angle += 180) > 360) {
		angle -= 360;
	}
	dir = angle2dir(angle);
	let target: Value = get_edge_target_turf(rt.getStep(f, this.wearer, 0), dir);
	yield* this.wearer.throw_at(target, speed + density + anchored, 2, this.wearer);
	this.wearer.visible_message(`${this.wearer} is knocked flying by the impact!`);
	return f.dot;
}, true);

// flightsuit.dm:450
rt.def("/obj/item/device/flightpack/proc/flight_impact", function* flight_impact(f: Frame, unmovablevictim: Value, crashdir: Value) {
	let L: Value = null, S: Value = null, D: Value = null, victim: Value = null;
	if (unmovablevictim == this.wearer || this.crashing || this.processing_mode == 0) {
		return 0;
	}
	this.crashing = 1;
	let crashpower: Value = 0;
	if (crashdir == 1 || crashdir == 2) {
		crashpower = this.momentum_speed_y;
	} else if (crashdir == 4 || crashdir == 8) {
		crashpower = this.momentum_speed_x;
	}
	if (!this.flight) {
		this.crashing = 0;
		return 0;
	}
	if (this.boost) {
		crashpower = 3;
	}
	if (!crashpower) {
		this.crashing = 0;
		return 0;
	}
	let density: Value = 0;
	let anchored: Value = 1;
	let damage: Value = 0;
	if (ismob(unmovablevictim)) {
		if ((L = unmovablevictim).throwing || L.pulledby == this.wearer) {
			this.crashing = 0;
			return 0;
		}
		if (L.buckled) {
			this.wearer.visible_message(`<span class='warning'>${this.wearer} reflexively flies over ${L}!</span>`);
			yield* this.wearer.forceMove(rt.getStep(f, L, 0));
			this.crashing = 0;
			return 0;
		}
		yield* this.suit.user.forceMove(rt.getStep(f, unmovablevictim, 0));
		this.crashing = 0;
		yield* this.mobknockback(L, crashpower, crashdir);
		damage = 0;
		density = 1;
		anchored = 0;
	} else if (rt.istype(unmovablevictim, T("/obj/structure/grille"))) {
		if (crashpower > 1) {
			yield* this.crash_grille((S = unmovablevictim));
		}
		this.crashing = 0;
		return 0;
	} else if (rt.istype(unmovablevictim, T("/obj/machinery/door")) && !rt.istype(unmovablevictim, T("/obj/machinery/door/poddoor"))) {
		if (!(yield* this.airlock_hit((D = unmovablevictim)))) {
			this.crashing = 0;
			return 0;
		} else if (this.momentum_speed < 3) {
			this.crashing = 0;
			return 0;
		}
		damage = 1;
		anchored = 1;
		density = 0;
	} else if (rt.istype(unmovablevictim, T("/obj/structure/mineral_door"))) {
		yield* this.door_hit((D = unmovablevictim));
		this.crashing = 0;
		return 0;
	} else if (rt.istype(unmovablevictim, T("/turf/closed"))) {
		if (crashpower < 3) {
			this.crashing = 0;
			return 0;
		}
		damage = 1;
		density = 1;
		anchored = 1;
	} else if (rt.istype(unmovablevictim, T("/atom/movable"))) {
		victim = unmovablevictim;
		if (crashpower < 3 || victim.throwing) {
			this.crashing = 0;
			return 0;
		}
		density = victim.density;
		anchored = victim.anchored;
		yield* this.victimknockback(victim, crashpower, crashdir);
		if (anchored) {
			damage = 1;
		}
	}
	if (damage) {
		yield* this.crash_damage(density, anchored, this.momentum_speed, unmovablevictim.name);
		yield* this.userknockback(density, anchored, this.momentum_speed, this.dir);
		yield* this.losecontrol({ knockdown: 0, move: 0 });
	}
	this.crashing = 0;
	return f.dot;
}, true);

// flightsuit.dm:532
rt.def("/obj/item/device/flightpack/proc/door_hit", function* door_hit(f: Frame, door: Value) {
	rt.spawnTail(f, 0, "/obj/item/device/flightpack/proc/door_hit: spawn at modules/clothing/spacesuits/flightsuit.dm:532", door);
	yield* this.wearer.forceMove(rt.getStep(f, door, 0));
	if (this.dragging_through) {
		yield* this.dragging_through.forceMove(rt.getStep(f, door, 0));
		this.wearer.pulling = this.dragging_through;
	}
	this.wearer.visible_message(`<span class='boldnotice'>${this.wearer} rolls to their sides and slips past ${door}!</span>`);
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/device/flightpack/proc/door_hit, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/flightpack/proc/door_hit: spawn at modules/clothing/spacesuits/flightsuit.dm:532", function* (f: Frame, door: Value) {
	yield* door.Open();
	return null;
});

// flightsuit.dm:541
rt.def("/obj/item/device/flightpack/proc/crash_grille", function* crash_grille(f: Frame, target: Value) {
	yield* target.hitby(this.wearer);
	yield* target.take_damage(60, "brute", "melee", 1);
	if (!(yield* this.wearer.Move(target.loc))) return f.dot;
	this.wearer.visible_message(`<span class='warning'>${this.wearer} smashes straight past ${target}!</span>`);
	return f.dot;
}, true);

// flightsuit.dm:548
rt.def("/obj/item/device/flightpack/proc/airlock_hit", function* airlock_hit(f: Frame, A: Value) {
	let target: Value = null;
	let pass: Value = 0;
	if (A.density) {
		pass += A.locked;
		pass += A.stat;
		pass += A.emagged;
		pass += A.welded;
		if (A.requiresID()) {
			if (!(yield* A.allowed(this.wearer)) && !A.emergency) {
				pass += 1;
			}
		}
	} else {
		return pass;
	}
	if (!pass) {
		rt.spawnTail(f, 0, "/obj/item/device/flightpack/proc/airlock_hit: spawn at modules/clothing/spacesuits/flightsuit.dm:559", A, pass, target);
		this.wearer.visible_message(`<span class='warning'>${this.wearer} rolls sideways and slips past ${A}</span>`);
		target = rt.getStep(f, A, 0);
		if (rt.istype(A, T("/obj/machinery/door/window")) && rt.getStep(f, this.wearer, 0) == rt.getStep(f, A, 0)) {
			target = rt.getStep(f, A, A.dir);
		}
		yield* this.wearer.forceMove(target);
		if (this.dragging_through) {
			yield* this.dragging_through.forceMove(target);
			this.wearer.pulling = this.dragging_through;
		}
	}
	return pass;
}, true);

// a spawn(0) body of /obj/item/device/flightpack/proc/airlock_hit, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/flightpack/proc/airlock_hit: spawn at modules/clothing/spacesuits/flightsuit.dm:559", function* (f: Frame, A: Value, pass: Value, target: Value) {
	yield* A.open();
	return null;
});

// flightsuit.dm:573
rt.def("/obj/item/device/flightpack/proc/mobknockback", function* mobknockback(f: Frame, victim: Value, power: Value, direction: Value) {
	if (!ismob(victim)) {
		return 0;
	}
	yield* this.wearer.forceMove(rt.getStep(f, victim, 0));
	this.wearer.visible_message(`<span class='notice'>${this.wearer} flies over ${victim}!</span>`);
	return f.dot;
}, true);

// flightsuit.dm:579
rt.def("/obj/item/device/flightpack/proc/victimknockback", function* victimknockback(f: Frame, victim: Value, power: Value, direction: Value) {
	let i: Value = null, O: Value = null;
	let $e: any;
	if (!victim) {
		return 0;
	}
	let knockback: Value = 0;
	let damage: Value = 0;
	knockback -= this.density * 2;
	knockback += power;
	knockback += this.part_manip.rating / 2;
	knockback += this.part_bin.rating / 2;
	knockback *= 4;
	if (victim.anchored) {
		knockback = 0;
	}
	damage = power * 14;
	if (ismob(victim)) {
		yield* this.mobknockback(victim, power, direction);
		return 0;
	}
	if (this.anchored) {
		knockback = 0;
	}
	victim.visible_message(`<span class='warning'>${victim.name} is sent flying by the impact!</span>`);
	let target: Value = rt.getStep(f, victim, 0);
	rt.forRange(f, 0, 1, knockback, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		target = rt.getStep(f, target, direction);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, knockback / 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		target = rt.getStep(f, target, pick(GLOB.alldirs));
	}
	rt.endFor(f, 0);
	if (knockback) {
		yield* victim.throw_at(target, knockback, this.part_manip.rating);
	}
	if (!rt.istype(victim, T("/obj"))) return f.dot;
	yield* (O = victim).take_damage(damage);
	return f.dot;
}, true);

// flightsuit.dm:609
rt.def("/obj/item/device/flightpack/proc/losecontrol", function* losecontrol(f: Frame, knockdown: Value, move: Value) {
	knockdown ??= 0;
	move ??= 1;
	if (!move) {
		this.momentum_x = 0;
		this.momentum_y = 0;
		this.calculate_momentum_speed();
	}
	this.usermessage("Warning: Control system not responding. Deactivating!", 3);
	this.wearer.visible_message(`<span class='warning'>${this.wearer}'s flight suit abruptly shuts off and they lose control!</span>`);
	if (this.wearer) {
		if (move) {
			while (this.momentum_x != 0 || this.momentum_y != 0) {
				yield* sleep(2);
				yield* step(this.wearer, pick(GLOB.cardinal));
				this.momentum_decay();
				this.adjust_momentum(0, 0, 10);
			}
		}
		this.wearer.visible_message(`<span class='warning'>${this.wearer}'s flight suit crashes into the ground!</span>`);
		if (knockdown) {
			yield* this.wearer.Knockdown(80);
		}
	}
	this.momentum_x = 0;
	this.momentum_y = 0;
	if (!this.flight) return f.dot;
	yield* this.disable_flight(0);
	return f.dot;
}, true);

// flightsuit.dm:631
rt.def("/obj/item/device/flightpack/proc/enable_flight", function* enable_flight(f: Frame, forced: Value) {
	forced ??= 0;
	if (!this.suit) {
		this.usermessage("Warning: Flightpack not linked to compatible flight-suit mount!", 2);
	}
	if (this.disabled) {
		this.usermessage("Internal systems recalibrating. Unable to safely proceed.", 2);
	}
	(rt.modField(f, this.wearer, "movement_type", 2, rt.bitOr));
	(rt.modField(f, this.wearer, "pass_flags", this.flight_passflags, rt.bitOr));
	this.usermessage("ENGAGING FLIGHT ENGINES.");
	this.update_slowdown();
	this.wearer.floating = 1;
	this.wearer.visible_message(`<font color='blue' size='2'>${this.wearer}'s flight engines activate as they lift into the air!</font>`);
	this.flight = 1;
	if (this.suit.shoes) {
		yield* this.suit.shoes.toggle(1);
	}
	yield* this.update_icon();
	yield* this.ion_trail.start();
	return f.dot;
}, true);

// flightsuit.dm:650
rt.def("/obj/item/device/flightpack/proc/disable_flight", function* disable_flight(f: Frame, forced: Value) {
	let _T: Value = null;
	forced ??= 0;
	if (forced) {
		yield* this.losecontrol({ knockdown: 1 });
		return 1;
	}
	if (this.momentum_speed <= 1) {
		this.momentum_x = 0;
		this.momentum_y = 0;
		this.usermessage("DISENGAGING FLIGHT ENGINES.");
		this.update_slowdown();
		this.wearer.floating = 0;
		this.wearer.visible_message(`<font color='blue' size='2'>${this.wearer} drops to the ground as their flight engines cut out!</font>`);
		yield* this.ion_trail.stop();
		(rt.modField(f, this.wearer, "movement_type", 16777213, rt.bitAnd));
		(rt.modField(f, this.wearer, "pass_flags", rt.op(f, "BitNot", [], [this.flight_passflags]), rt.bitAnd));
		this.flight = 0;
		if (this.suit.shoes) {
			yield* this.suit.shoes.toggle(0);
		}
		if (isturf(this.wearer.loc)) {
			yield* (_T = this.wearer.loc).Entered(this);
		}
	} else {
		if (this.override_safe) {
			yield* this.disable_flight(1);
			return 1;
		}
		this.usermessage("Warning: Velocity too high to safely disengage. Retry to confirm emergency shutoff.", 2);
		this.override_safe = 1;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/device/flightpack/proc/enable_safe"))), 50);
		return 0;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// flightsuit.dm:684
rt.def("/obj/item/device/flightpack/proc/dropped", function* dropped(f: Frame, wearer: Value) {
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:687
rt.def("/obj/item/device/flightpack/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (slot != SLOT_BACK) return f.dot;
	return 1;
});

// flightsuit.dm:691
rt.def("/obj/item/device/flightpack/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		this.wearer = user;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:696
rt.def("/obj/item/device/flightpack/proc/calculate_momentum_speed", function calculate_momentum_speed(f: Frame) {
	if (rt.op(f, "Abs", [], [this.momentum_x]) >= this.momentum_crash_coeff * this.momentum_max) {
		this.momentum_speed_x = 3;
	} else if (rt.op(f, "Abs", [], [this.momentum_x]) >= this.momentum_impact_coeff * this.momentum_max) {
		this.momentum_speed_x = 2;
	} else if (rt.op(f, "Abs", [], [this.momentum_x]) >= this.momentum_drift_coeff * this.momentum_max) {
		this.momentum_speed_x = 1;
	} else {
		this.momentum_speed_x = 0;
	}
	if (rt.op(f, "Abs", [], [this.momentum_y]) >= this.momentum_crash_coeff * this.momentum_max) {
		this.momentum_speed_y = 3;
	} else if (rt.op(f, "Abs", [], [this.momentum_y]) >= this.momentum_impact_coeff * this.momentum_max) {
		this.momentum_speed_y = 2;
	} else if (rt.op(f, "Abs", [], [this.momentum_y]) >= this.momentum_drift_coeff * this.momentum_max) {
		this.momentum_speed_y = 1;
	} else {
		this.momentum_speed_y = 0;
	}
	this.momentum_speed = max(this.momentum_speed_x, this.momentum_speed_y);
	return f.dot;
});

// flightsuit.dm:715
rt.def("/obj/item/device/flightpack/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (slot != 1) return f.dot;
	return 1;
});

// flightsuit.dm:719
rt.def("/obj/item/device/flightpack/proc/enable_stabilizers", function enable_stabilizers(f: Frame) {
	this.usermessage("Activating automatic stabilization controller and enabling maneuvering assistance.");
	this.stabilizer = 1;
	return f.dot;
});

// flightsuit.dm:725
rt.def("/obj/item/device/flightpack/proc/disable_stabilizers", function disable_stabilizers(f: Frame) {
	if (this.wearer) {
		if (this.brake) {
			this.disable_airbrake();
		}
		this.usermessage("Deactivating stabilization controllers!", 2);
	}
	this.stabilizer = 0;
	return f.dot;
});

// flightsuit.dm:730
rt.def("/obj/item/device/flightpack/proc/activate_booster", function* activate_booster(f: Frame) {
	if (!this.flight) {
		this.usermessage("Error: Engines offline!", 2);
		return 0;
	}
	if (this.boost_charge < 5) {
		this.usermessage("Insufficient charge in boost capacitors to engage.", 2);
		return 0;
	}
	this.usermessage("Boosters engaged!");
	this.wearer.visible_message(`<span class='notice'>${this.wearer.name}'s flightpack engines flare in intensity as they are rocketed forward by the immense thrust!</span>`);
	this.boost = 1;
	this.update_slowdown();
	yield* this.update_icon();
	return f.dot;
}, true);

// flightsuit.dm:743
rt.def("/obj/item/device/flightpack/proc/deactivate_booster", function* deactivate_booster(f: Frame) {
	this.usermessage("Boosters disengaged!");
	this.boost = 0;
	this.update_slowdown();
	yield* this.update_icon();
	return f.dot;
}, true);

// flightsuit.dm:750
rt.def("/obj/item/device/flightpack/proc/enable_airbrake", function enable_airbrake(f: Frame) {
	if (this.wearer) {
		if (!this.stabilizer) {
			this.enable_stabilizers();
			this.usermessage("Stabilizers activated!");
		}
		this.usermessage("Airbrakes extended!");
	}
	this.brake = 1;
	this.update_slowdown();
	return f.dot;
});

// flightsuit.dm:759
rt.def("/obj/item/device/flightpack/proc/disable_airbrake", function disable_airbrake(f: Frame) {
	if (this.wearer) {
		this.usermessage("Airbrakes retracted!");
	}
	this.brake = 0;
	this.update_slowdown();
	return f.dot;
});

// flightsuit.dm:764
rt.def("/obj/item/device/flightpack/proc/on_mob_move", function on_mob_move(f: Frame, dir: Value, mob: Value) {
	this.wearer_movement(dir);
	return f.dot;
});

// flightsuit.dm:767
rt.def("/obj/item/device/flightpack/proc/relink_suit", function relink_suit(f: Frame, F: Value) {
	if (this.suit && this.suit == F) {
		return 0;
	} else {
		this.delink_suit();
	}
	if (rt.istype(F, T("/obj/item/clothing/suit/space/hardsuit/flightsuit"))) {
		this.suit = F;
		this.suit.pack = this;
	} else {
		this.suit = null;
	}
	return f.dot;
});

// flightsuit.dm:779
rt.def("/obj/item/device/flightpack/proc/delink_suit", function delink_suit(f: Frame) {
	if (this.suit) {
		if (this.suit.pack && this.suit.pack == this) {
			this.suit.pack = null;
		}
	}
	this.suit = null;
	return f.dot;
});

// flightsuit.dm:784
rt.def("/obj/item/device/flightpack/proc/usermessage", function usermessage(f: Frame, message: Value, urgency: Value) {
	urgency ??= 0;
	if (urgency == 0) {
		to_chat(this.wearer, `${bicon(this)}|<span class='boldnotice'>${message}</span>`);
	}
	if (urgency == 1) {
		to_chat(this.wearer, `${bicon(this)}|<span class='warning'>${message}</span>`);
	}
	if (urgency == 2) {
		to_chat(this.wearer, `${bicon(this)}|<span class='boldwarning'>${message}</span>`);
	}
	if (urgency != 3) return f.dot;
	to_chat(this.wearer, `${bicon(this)}|<span class='userdanger'>${message}</span>`);
	return f.dot;
});

// flightsuit.dm:794
rt.def("/obj/item/device/flightpack/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null;
	if (rt.istype(user, T("/mob/living/carbon/human")) && !rt.istype(this.loc, T("/mob/living/carbon/human"))) {
		this.wearer = user;
	}
	if (rt.istype(I, T("/obj/item/weapon/stock_parts"))) {
		if (rt.istype((S = I), T("/obj/item/weapon/stock_parts/manipulator"))) {
			this.usermessage(`${I} has been sucessfully installed into systems.`);
			if (yield* user.transferItemToLoc(I, this)) {
				if (this.part_manip) {
					yield* this.part_manip.forceMove(rt.getStep(f, this, 0));
					this.part_manip = null;
				}
				this.part_manip = I;
			}
		}
		if (rt.istype(S, T("/obj/item/weapon/stock_parts/scanning_module"))) {
			this.usermessage(`${I} has been sucessfully installed into systems.`);
			if (yield* user.transferItemToLoc(I, this)) {
				if (this.part_scan) {
					yield* this.part_scan.forceMove(rt.getStep(f, this, 0));
					this.part_scan = null;
				}
				this.part_scan = I;
			}
		}
		if (rt.istype(S, T("/obj/item/weapon/stock_parts/micro_laser"))) {
			this.usermessage(`${I} has been sucessfully installed into systems.`);
			if (yield* user.transferItemToLoc(I, this)) {
				if (this.part_laser) {
					yield* this.part_laser.forceMove(rt.getStep(f, this, 0));
					this.part_laser = null;
				}
				this.part_laser = I;
			}
		}
		if (rt.istype(S, T("/obj/item/weapon/stock_parts/matter_bin"))) {
			this.usermessage(`${I} has been sucessfully installed into systems.`);
			if (yield* user.transferItemToLoc(I, this)) {
				if (this.part_bin) {
					yield* this.part_bin.forceMove(rt.getStep(f, this, 0));
					this.part_bin = null;
				}
				this.part_bin = I;
			}
		}
		if (rt.istype(S, T("/obj/item/weapon/stock_parts/capacitor"))) {
			this.usermessage(`${I} has been sucessfully installed into systems.`);
			if (yield* user.transferItemToLoc(I, this)) {
				if (this.part_cap) {
					yield* this.part_cap.forceMove(rt.getStep(f, this, 0));
					this.part_cap = null;
				}
				this.part_cap = I;
			}
		}
	}
	this.update_parts();
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:842
rt.def("/mob/living/carbon/proc/get_flightpack", function get_flightpack(f: Frame) {
	let F: Value = null;
	if (rt.istype((F = this.back), T("/obj/item/device/flightpack"))) {
		return F;
	} else {
		return 0;
	}
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

// flightsuit.dm:867
rt.def("/obj/item/clothing/shoes/flightshoes/proc/Destroy", function* Destroy(f: Frame) {
	if (this.suit) {
		this.suit.shoes = null;
	}
	return (yield* parent_proc());
}, true);

// flightsuit.dm:872
rt.def("/obj/item/clothing/shoes/flightshoes/proc/toggle", function toggle(f: Frame, toggle: Value) {
	if (!this.suit) return f.dot;
	this.active = toggle;
	if (this.active) {
		(rt.modField(f, this, "flags", 1024, rt.bitOr));
	}
	if (this.active) return f.dot;
	(rt.modField(f, this, "flags", 16776191, rt.bitAnd));
	return f.dot;
});

// flightsuit.dm:879
rt.def("/obj/item/clothing/shoes/flightshoes/proc/dropped", function* dropped(f: Frame, wearer: Value) {
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:882
rt.def("/obj/item/clothing/shoes/flightshoes/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (slot != slot_shoes) return f.dot;
	return 1;
});

// flightsuit.dm:887
rt.def("/obj/item/clothing/shoes/flightshoes/proc/delink_suit", function delink_suit(f: Frame) {
	if (this.suit) {
		if (this.suit.shoes && this.suit.shoes == this) {
			this.suit.shoes = null;
		}
	}
	this.suit = null;
	return f.dot;
});

// flightsuit.dm:892
rt.def("/obj/item/clothing/shoes/flightshoes/proc/relink_suit", function relink_suit(f: Frame, F: Value) {
	if (this.suit && this.suit == F) {
		return 0;
	} else {
		this.delink_suit();
	}
	if (rt.istype(F, T("/obj/item/clothing/suit/space/hardsuit/flightsuit"))) {
		this.suit = F;
		this.suit.shoes = this;
	} else {
		this.suit = null;
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

// flightsuit.dm:924
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/gun"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"));

	this.actions_types = list(T("/datum/action/item_action/flightsuit/toggle_helmet"), T("/datum/action/item_action/flightsuit/toggle_boots"), T("/datum/action/item_action/flightsuit/toggle_flightpack"), T("/datum/action/item_action/flightsuit/lock_suit"));
	this.armor = rt.alist(f, ["melee", 20, "bullet", 20, "laser", 20, "energy", 10, "bomb", 30, "bio", 100, "rad", 75, "fire", 100, "acid", 100]);
	return f.dot;
});

rt.type(7705, "/obj/item/clothing/suit/space/hardsuit/flightsuit/full", "/obj/item/clothing/suit/space/hardsuit/flightsuit", {});

// flightsuit.dm:931
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/full/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.makepack();
	yield* this.makeshoes();
	this.resync();
	return f.dot;
}, true);

// flightsuit.dm:937
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/usermessage", function usermessage(f: Frame, message: Value, urgency: Value) {
	urgency ??= 0;
	if (!urgency) {
		to_chat(this.user, `${bicon(this)}<span class='notice'>|${message}</span>`);
	} else if (urgency == 1) {
		to_chat(this.user, `${bicon(this)}<span class='warning'>|${message}</span>`);
	} else {
		if (urgency != 2) return f.dot;
		to_chat(this.user, `${bicon(this)}<span class='userdanger'>|${message}</span>`);
	}
	return f.dot;
});

// flightsuit.dm:945
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/examine", function examine(f: Frame, user: Value) {
	let $1: any, $2: any, $3: any;
	parent_proc();
	let $0: any = user;
	if (this.locked) {
		$1 = "LOCKED";
	} else {
		$1 = "UNLOCKED";
	}
	to_chat($0, `<span class='boldnotice'>SUIT: ${$1}</span>`);
	$0 = user;
	if (this.deployedpack) {
		$1 = "ENGAGED";
	} else {
		$1 = "DISENGAGED";
	}
	if (this.deployedshoes) {
		$2 = "ENGAGED";
	} else {
		$2 = "DISENGAGED";
	}
	if (this.suittoggled) {
		$3 = "ENGAGED";
	} else {
		$3 = "DISENGAGED";
	}
	to_chat($0, `<span class='boldnotice'>FLIGHTPACK: ${$1} FLIGHTSHOES : ${$2} HELMET : ${$3}</span>`);
	to_chat(user, `<span class='boldnotice'>Its maintainence panel is ${this.maint_panel ? "OPEN" : "CLOSED"}</span>`);
	return f.dot;
}, false);

// flightsuit.dm:951
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.dropped();
	if (this.pack) {
		this.pack.delink_suit();
		yield* qdel(this.pack);
	}
	if (this.shoes) {
		this.shoes.pack = null;
		this.shoes.suit = null;
		yield* qdel(this.shoes);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:963
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/resync", function resync(f: Frame) {
	if (this.pack) {
		this.pack.relink_suit(this);
	}
	if (this.user) {
		if (this.pack) {
			this.pack.wearer = this.user;
		}
		if (this.shoes) {
			this.shoes.wearer = this.user;
		}
	} else {
		if (this.pack) {
			this.pack.wearer = null;
		}
		if (this.shoes) {
			this.shoes.wearer = null;
		}
	}
	if (!this.shoes) return f.dot;
	this.shoes.relink_suit(this);
	return f.dot;
});

// flightsuit.dm:978
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = null;
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		H = user;
		if (this == H.wear_suit && this.locked) {
			this.usermessage("You can not take a locked hardsuit off! Unlock it first!", 1);
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:986
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/ui_action_click", function* ui_action_click(f: Frame, owner: Value, action: Value) {
	if (rt.istype(action, T("/datum/action/item_action/flightsuit/lock_suit"))) {
		if (!this.locked) {
			yield* this.lock_suit(owner);
		} else {
			this.unlock_suit(owner);
		}
	}
	if (rt.istype(action, T("/datum/action/item_action/flightsuit/toggle_flightpack"))) {
		if (!this.deployedpack) {
			yield* this.extend_flightpack();
		} else {
			yield* this.retract_flightpack();
		}
	}
	if (rt.istype(action, T("/datum/action/item_action/flightsuit/toggle_boots"))) {
		if (!this.deployedshoes) {
			yield* this.extend_flightshoes();
		} else {
			yield* this.retract_flightshoes();
		}
	}
	if (!rt.istype(action, T("/datum/action/item_action/flightsuit/toggle_helmet"))) return f.dot;
	yield* this.ToggleHelmet();
	return f.dot;
}, true);

// flightsuit.dm:1006
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/dropped", function* dropped(f: Frame) {
	if (this.deployedpack) {
		yield* this.retract_flightpack(1);
	}
	if (this.deployedshoes) {
		yield* this.retract_flightshoes(1);
	}
	if (this.locked) {
		this.unlock_suit(null);
	}
	if (this.user) {
		this.user = null;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:1016
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/ToggleHelmet", function* ToggleHelmet(f: Frame) {
	if (!this.suittoggled) {
		if (!this.locked) {
			this.usermessage("You must lock your suit before engaging the helmet!", 1);
			return 0;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:1023
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/lock_suit", function lock_suit(f: Frame, wearer: Value) {
	this.user = wearer;
	this.user.visible_message(`<span class='notice'>${wearer}'s flight suit locks around them, powered buckles and straps automatically adjusting to their body!</span>`);
	playsound(this.loc, rt.rsc("sound/items/rped.ogg"), 65, 1);
	this.resync();
	this.strip_delay = this.locked_strip_delay;
	this.locked = 1;
	return 1;
});

// flightsuit.dm:1033
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/unlock_suit", function unlock_suit(f: Frame, wearer: Value) {
	if (this.suittoggled) {
		this.usermessage("You must retract the helmet before unlocking your suit!", 1);
		return 0;
	}
	if (this.pack && this.pack.flight) {
		this.usermessage("You must shut off the flight-pack before unlocking your suit!", 1);
		return 0;
	}
	if (this.deployedpack) {
		this.usermessage("Your flightpack must be fully retracted first!", 1);
		return 0;
	}
	if (this.deployedshoes) {
		this.usermessage("Your flight shoes must be fully retracted first!", 1);
		return 0;
	}
	if (wearer) {
		this.user.visible_message(`<span class='notice'>${wearer}'s flight suit detaches from their body, becoming nothing more then a bulky metal skeleton.</span>`);
	}
	playsound(this.loc, rt.rsc("sound/items/rped.ogg"), 65, 1);
	this.resync();
	this.strip_delay = rt.initial(f, this, "strip_delay");
	this.locked = 0;
	return 1;
});

// flightsuit.dm:1053
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/extend_flightpack", function* extend_flightpack(f: Frame, forced: Value) {
	forced ??= 0;
	if (!this.pack) {
		this.usermessage("There is no attached flightpack!", slot_back);
		return 0;
	}
	if (this.deployedpack) {
		yield* this.retract_flightpack();
	}
	if (!this.locked) {
		this.usermessage("You must lock your flight suit first before deploying anything!", slot_back);
		return 0;
	}
	if (rt.istype(this.user, T("/mob/living/carbon/human"))) {
		if (this.user.back) {
			this.usermessage("You're already wearing something on your back!", slot_back);
			return 0;
		}
		yield* this.user.equip_to_slot_if_possible(this.pack, slot_back, 0, 0, 1);
		(rt.modField(f, this.pack, "flags", NODROP, rt.bitOr));
		this.resync();
		this.user.visible_message(`<span class='notice'>A ${this.pack.name} extends from ${this.user}'s ${this.name} and clamps to their back!</span>`);
		yield* this.user.update_inv_wear_suit();
	}
	playsound(this.loc, rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1);
	this.deployedpack = 1;
	return f.dot;
}, true);

// flightsuit.dm:1074
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/retract_flightpack", function* retract_flightpack(f: Frame, forced: Value) {
	forced ??= 0;
	if (rt.istype(this.user, T("/mob/living/carbon/human"))) {
		if (this.pack.flight && !forced) {
			this.usermessage("You must disable the engines before retracting the flightpack!", 1);
			return 0;
		}
		if (this.pack.flight && forced) {
			yield* this.pack.disable_flight(1);
		}
		(rt.modField(f, this.pack, "flags", 16777213, rt.bitAnd));
		this.resync();
		if (this.user) {
			yield* this.user.transferItemToLoc(this.pack, this, 1);
			yield* this.user.update_inv_wear_suit();
			this.user.visible_message(`<span class='notice'>${this.user}'s ${this.pack.name} detaches from their back and retracts into their ${this}!</span>`);
		}
	}
	this.pack.loc = this;
	playsound(this.loc, rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1);
	this.deployedpack = 0;
	return f.dot;
}, true);

// flightsuit.dm:1091
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/extend_flightshoes", function* extend_flightshoes(f: Frame, forced: Value) {
	forced ??= 0;
	if (!this.shoes) {
		this.usermessage("Flight shoes are not installed!", 1);
		return 0;
	}
	if (this.deployedshoes) {
		yield* this.retract_flightshoes();
	}
	if (!this.locked) {
		this.usermessage("You must lock your flight suit first before deploying anything!", 1);
		return 0;
	}
	if (rt.istype(this.user, T("/mob/living/carbon/human"))) {
		if (this.user.shoes) {
			this.usermessage("You're already wearing something on your feet!", 1);
			return 0;
		}
		yield* this.user.equip_to_slot_if_possible(this.shoes, slot_shoes, 0, 0, 1);
		(rt.modField(f, this.shoes, "flags", NODROP, rt.bitOr));
		this.user.visible_message(`<span class='notice'>${this.user}'s ${this.name} extends a pair of ${this.shoes.name} over their feet!</span>`);
		yield* this.user.update_inv_wear_suit();
	}
	playsound(this.loc, rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1);
	this.deployedshoes = 1;
	return f.dot;
}, true);

// flightsuit.dm:1111
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/retract_flightshoes", function* retract_flightshoes(f: Frame, forced: Value) {
	forced ??= 0;
	(rt.modField(f, this.shoes, "flags", 16777213, rt.bitAnd));
	playsound(this.loc, rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1);
	if (this.user) {
		yield* this.user.transferItemToLoc(this.shoes, this, 1);
		yield* this.user.update_inv_wear_suit();
		this.user.visible_message(`<span class='notice'>${this.user}'s ${this.shoes.name} retracts back into their ${this.name}!</span>`);
	}
	this.shoes.loc = this;
	this.deployedshoes = 0;
	return f.dot;
}, true);

// flightsuit.dm:1121
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/makepack", function* makepack(f: Frame) {
	if (this.pack) return f.dot;
	this.pack = (yield* new_(T("/obj/item/device/flightpack/full"), this));
	this.pack.relink_suit(this);
	return f.dot;
}, true);

// flightsuit.dm:1126
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/makeshoes", function* makeshoes(f: Frame) {
	if (this.shoes) return f.dot;
	this.shoes = (yield* new_(T("/obj/item/clothing/shoes/flightshoes"), this));
	this.shoes.pack = this.pack;
	this.shoes.suit = this;
	return f.dot;
}, true);

// flightsuit.dm:1132
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/equipped", function* equipped(f: Frame, M: Value, slot: Value) {
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		this.user = M;
	}
	if (slot != slot_wear_suit) {
		if (this.deployedpack) {
			yield* this.retract_flightpack(1);
		}
		if (this.deployedshoes) {
			yield* this.retract_flightshoes(1);
		}
		if (this.locked) {
			this.unlock_suit(this.user);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// flightsuit.dm:1144
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/detach_pack", function detach_pack(f: Frame) {
	this.pack.delink_suit();
	this.pack.loc = rt.getStep(f, this, 0);
	this.pack = null;
	this.usermessage("You detach the flightpack.");
	return f.dot;
});

// flightsuit.dm:1150
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attach_pack", function* attach_pack(f: Frame, F: Value) {
	yield* F.forceMove(this);
	this.pack = F;
	this.pack.relink_suit(this);
	this.usermessage("You attach and fasten the flightpack.");
	return f.dot;
}, true);

// flightsuit.dm:1156
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/detach_shoes", function detach_shoes(f: Frame) {
	this.shoes.delink_suit();
	this.shoes.loc = rt.getStep(f, this, 0);
	this.shoes = null;
	this.usermessage("You detach the flight shoes.");
	return f.dot;
});

// flightsuit.dm:1162
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attach_shoes", function* attach_shoes(f: Frame, S: Value) {
	yield* S.forceMove(this);
	this.shoes = S;
	this.shoes.relink_suit(this);
	this.usermessage("You attach and fasten a pair of flight shoes.");
	return f.dot;
}, true);

// flightsuit.dm:1168
rt.def("/obj/item/clothing/suit/space/hardsuit/flightsuit/proc/attackby", function* attackby(f: Frame, I: Value, wearer: Value, params: Value) {
	let inputlist: Value = null, input: Value = null, F: Value = null, addmsg: Value = null, addmsglist: Value = null, S: Value = null;
	this.user = wearer;
	if (this == this.user.get_item_by_slot(slot_wear_suit)) {
		this.usermessage("You can not perform any service without taking the suit off!", 1);
		return 0;
	}
	if (this.locked) {
		this.usermessage("You can not perform any service while the suit is locked!", 1);
		return 0;
	}
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (!this.maint_panel) {
			this.maint_panel = 1;
		} else {
			this.maint_panel = 0;
		}
		this.usermessage(`You ${this.maint_panel ? "open" : "close"} the maintainence panel.`);
	}
	if (!this.maint_panel) {
		this.usermessage("The maintainence panel is closed!", 1);
		return 0;
	}
	if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		inputlist = list();
		if (this.pack) {
			inputlist += "Pack";
		}
		if (this.shoes) {
			inputlist += "Shoes";
		}
		if (!rt.len(f, inputlist)) {
			this.usermessage("There is nothing inside the flightsuit to remove!", 1);
			return 0;
		}
		input = (yield* g.op(f, "Prompt", [1], [null, "Removing module", "What to remove?", this.user, list("Pack", "Shoes")]));
		if (this.pack && input == "Pack") {
			if (this.pack.flight) {
				this.usermessage("You can not pry off an active flightpack!", 1);
				return 0;
			}
			if (this.deployedpack) {
				this.usermessage("Disengage the flightpack first!", 1);
				return 0;
			}
			this.detach_pack();
		}
		if (this.shoes && input == "Shoes") {
			if (this.deployedshoes) {
				this.usermessage("Disengage the shoes first!", 1);
				return 0;
			}
			this.detach_shoes();
		}
	}
	if (rt.istype(I, T("/obj/item/device/flightpack"))) {
		F = I;
		if (this.pack) {
			this.usermessage(`${this} already has a flightpack installed!`, 1);
			return 0;
		}
		if (!F.assembled) {
			addmsg = " It is missing a ";
			addmsglist = list();
			if (!F.part_manip) {
				addmsglist += "manipulator";
			}
			if (!F.part_cap) {
				addmsglist += "capacitor";
			}
			if (!F.part_scan) {
				addmsglist += "scanning module";
			}
			if (!F.part_laser) {
				addmsglist += "micro-laser";
			}
			if (!F.part_bin) {
				addmsglist += "matter bin";
			}
			this.usermessage(`The flightpack you are trying to install is not fully assembled and operational!${(addmsg += english_list(addmsglist))}.`, 1);
			return 0;
		}
		if (yield* this.user.temporarilyRemoveItemFromInventory(F)) {
			yield* this.attach_pack(F);
		}
	}
	if (rt.istype(I, T("/obj/item/clothing/shoes/flightshoes"))) {
		S = I;
		if (this.shoes) {
			this.usermessage("There are already shoes installed!", 1);
			return 0;
		}
		if (yield* this.user.temporarilyRemoveItemFromInventory(S)) {
			yield* this.attach_shoes(S);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// flightsuit.dm:1249
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.datahuds = list(2, 4, 5);
	this.armor = rt.alist(f, ["melee", 20, "bullet", 20, "laser", 20, "energy", 10, "bomb", 30, "bio", 100, "rad", 75, "fire", 100, "acid", 100]);

	this.actions_types = list(T("/datum/action/item_action/toggle_helmet_light"), T("/datum/action/item_action/flightpack/zoom"));
	return f.dot;
});

// flightsuit.dm:1257
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/equipped", function* equipped(f: Frame, wearer: Value, slot: Value) {
	let hudtype: Value = null, H: Value = null;
	yield* parent_proc();
	for (hudtype of each(this.datahuds)) {
		(H = rt.index(GLOB.huds, hudtype)).add_hud_to(wearer);
	}
	return f.dot;
}, true);

// flightsuit.dm:1263
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/dropped", function* dropped(f: Frame, wearer: Value) {
	let hudtype: Value = null, H: Value = null;
	yield* parent_proc();
	for (hudtype of each(this.datahuds)) {
		(H = rt.index(GLOB.huds, hudtype)).remove_hud_from(wearer);
	}
	if (!this.zoom) return f.dot;
	yield* this.toggle_zoom(wearer, 1);
	return f.dot;
}, true);

// flightsuit.dm:1271
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/ui_action_click", function* ui_action_click(f: Frame, owner: Value, action: Value) {
	if (rt.istype(action, T("/datum/action/item_action/flightpack/zoom"))) {
		yield* this.toggle_zoom(owner);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// flightsuit.dm:1276
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/flightsuit/proc/toggle_zoom", function* toggle_zoom(f: Frame, user: Value, force_off: Value) {
	force_off ??= 0;
	if (this.zoom || force_off) {
		yield* user.client.change_view(user.client.default_view());
		to_chat(user, "<span class='boldnotice'>Disabling smart zooming image enhancement...</span>");
		this.zoom = 0;
		return 0;
	} else {
		yield* user.client.change_view(this.zoom_range);
		to_chat(user, "<span class='boldnotice'>Enabling smart zooming image enhancement!</span>");
		this.zoom = 1;
		return 1;
	}
}, true);
