// Based on /tg/station's code/modules/atmospherics/machinery/portable/canister.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10689, "/obj/machinery/portable_atmospherics/canister", "/obj/machinery/portable_atmospherics", {
	valve_open: 0,
	pump: null,
	release_log: "",
	filled: 0.5,
	gas_type: "",
	release_pressure: 101.325,
	can_max_release_pressure: 1013.25,
	can_min_release_pressure: 10.1325,
	temperature_resistance: 1273.15,
	starter_temp: null,
	prototype: 0,
	valve_timer: null,
	timer_set: 30,
	default_timer_set: 30,
	minimum_timer_set: 1,
	maximum_timer_set: 300,
	timing: 0,
	restricted: 0,
	update: 0,
	pressure_resistance: 709.27496,
	name: "canister",
	desc: "A canister for the storage of gas.",
	icon_state: "yellow",
	density: 1,
	volume: 1000,
	armor: null,
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 100,
	req_access: null,
}, { global: { label2types: 1055 } });

// canister.dm:20
rt.def("/obj/machinery/portable_atmospherics/canister/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 100, "bomb", 10, "bio", 100, "rad", 100, "fire", 80, "acid", 50]);

	this.req_access = list();
	return f.dot;
});

// canister.dm:53
rt.def("/obj/machinery/portable_atmospherics/canister/proc/interact", function* interact(f: Frame, user: Value) {
	if (!(yield* this.allowed(user))) {
		to_chat(user, "<span class='warning'>Error - Unauthorized User</span>");
		playsound(this, rt.rsc("sound/misc/compiler-failure.ogg"), 50, 1);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// canister.dm:121
rt.def("/obj/machinery/portable_atmospherics/canister/proc/get_time_left", function get_time_left(f: Frame) {
	if (this.timing) {
		f.dot = round(max(0, this.valve_timer - rt.worldTime(f)) / 10, 1);
	} else {
		f.dot = this.timer_set;
	}
	return f.dot;
});

// canister.dm:126
rt.def("/obj/machinery/portable_atmospherics/canister/proc/set_active", function set_active(f: Frame) {
	this.timing = (!this.timing ? 1 : 0);
	if (this.timing) {
		this.valve_timer = rt.worldTime(f) + this.timer_set * 10;
	}
	this.update_icon();
	return f.dot;
});

// canister.dm:160
rt.def("/obj/machinery/portable_atmospherics/canister/proc/New", function* New(f: Frame, loc: Value, existing_mixture: Value) {
	yield* parent_proc();
	if (existing_mixture) {
		this.air_contents.copy_from(existing_mixture);
	} else {
		this.create_gas();
	}
	this.pump = (yield* new_(T("/obj/machinery/atmospherics/components/binary/passive_gate"), this, 0));
	this.pump.on = 1;
	this.pump.stat = 0;
	this.pump.build_network();
	yield* this.update_icon();
	return f.dot;
}, true);

// canister.dm:173
rt.def("/obj/machinery/portable_atmospherics/canister/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.pump);
	this.pump = null;
	return (yield* parent_proc());
}, true);

// canister.dm:179
rt.def("/obj/machinery/portable_atmospherics/canister/proc/create_gas", function create_gas(f: Frame) {
	if (!this.gas_type) return f.dot;
	this.air_contents.add_gas(this.gas_type);
	if (this.starter_temp) {
		this.air_contents.temperature = this.starter_temp;
	}
	rt.setAt(rt.index(this.air_contents.gases, this.gas_type), 1, this.maximum_pressure * this.filled * this.air_contents.volume / (R_IDEAL_GAS_EQUATION * this.air_contents.temperature));
	if (!this.starter_temp) return f.dot;
	this.air_contents.temperature = this.starter_temp;
	return f.dot;
});

rt.type(10697, "/obj/machinery/portable_atmospherics/canister/air", "/obj/machinery/portable_atmospherics/canister", {
	name: "air canister",
	desc: "Pre-mixed air.",
	icon_state: "grey",
});

// canister.dm:186
rt.def("/obj/machinery/portable_atmospherics/canister/air/proc/create_gas", function create_gas(f: Frame) {
	this.air_contents.add_gases("o2", "n2");
	rt.setAt(rt.index(this.air_contents.gases, "o2"), HOLDING, 0.21 * this.maximum_pressure * this.filled * this.air_contents.volume / (R_IDEAL_GAS_EQUATION * this.air_contents.temperature));
	rt.setAt(rt.index(this.air_contents.gases, "n2"), 1, 0.79 * this.maximum_pressure * this.filled * this.air_contents.volume / (8.31 * this.air_contents.temperature));
	return f.dot;
});

// canister.dm:197
rt.def("/obj/machinery/portable_atmospherics/canister/proc/update_icon", function update_icon(f: Frame) {
	let pressure: Value = null;
	if (rt.bitAnd(this.stat, HOLDING)) {
		this.cut_overlays();
		this.icon_state = `${rt.initial(f, this, "icon_state")}-1`;
		return f.dot;
	}
	let last_update: Value = this.update;
	this.update = 0;
	if (this.holding) {
		(rt.modSrcVar(f, "update", HOLDING, rt.bitOr));
	}
	if (this.connected_port) {
		(rt.modSrcVar(f, "update", CONNECTED, rt.bitOr));
	}
	if ((pressure = this.air_contents.return_pressure()) < 10) {
		(rt.modSrcVar(f, "update", EMPTY, rt.bitOr));
	} else if (pressure < 101.325) {
		(rt.modSrcVar(f, "update", 8, rt.bitOr));
	} else if (pressure < 1519.875) {
		(rt.modSrcVar(f, "update", FULL, rt.bitOr));
	} else {
		(rt.modSrcVar(f, "update", DANGER, rt.bitOr));
	}
	if (this.update == last_update) {
		return f.dot;
	}
	this.cut_overlays();
	if (rt.bitAnd(this.update, HOLDING)) {
		this.add_overlay("can-open");
	}
	if (rt.bitAnd(this.update, CONNECTED)) {
		this.add_overlay("can-connector");
	}
	if (rt.bitAnd(this.update, EMPTY)) {
		this.add_overlay("can-o0");
	} else if (rt.bitAnd(this.update, LOW)) {
		this.add_overlay("can-o1");
	} else if (rt.bitAnd(this.update, FULL)) {
		this.add_overlay("can-o2");
	} else {
		if (!rt.bitAnd(this.update, DANGER)) return f.dot;
		this.add_overlay("can-o3");
	}
	return f.dot;
});

// canister.dm:243
rt.def("/obj/machinery/portable_atmospherics/canister/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > this.temperature_resistance)) return f.dot;
	yield* this.take_damage(5, "fire", 0);
	return f.dot;
}, true);

// canister.dm:248
rt.def("/obj/machinery/portable_atmospherics/canister/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (!rt.bitAnd(this.stat, 1)) {
			yield* this.canister_break();
		}
		if (disassembled) {
			yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 10);
		} else {
			yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 5);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// canister.dm:258
rt.def("/obj/machinery/portable_atmospherics/canister/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (user.a_intent != "harm" && rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		WT = W;
		if (rt.bitAnd(this.stat, 1)) {
			if (!(yield* WT.remove_fuel(0, user))) {
				return f.dot;
			}
			playsound(this.loc, WT.usesound, 40, 1);
			to_chat(user, `<span class='notice'>You begin cutting ${this} apart...</span>`);
			if (yield* do_after(user, 30, { target: this })) {
				yield* this.deconstruct(1);
			}
		} else {
			to_chat(user, `<span class='notice'>You cannot slice ${this} apart when it isn't broken.</span>`);
		}
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// canister.dm:274
rt.def("/obj/machinery/portable_atmospherics/canister/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (rt.bitAnd(this.stat, 1) || rt.bitAnd(this.flags, NODECONSTRUCT)) {
		return f.dot;
	}
	yield* this.canister_break();
	return f.dot;
}, true);

// canister.dm:279
rt.def("/obj/machinery/portable_atmospherics/canister/proc/canister_break", function* canister_break(f: Frame) {
	let _T: Value = null;
	yield* this.disconnect();
	let expelled_gas: Value = (yield* this.air_contents.remove(this.air_contents.total_moles()));
	yield* (_T = rt.getStep(f, this, 0)).assume_air(expelled_gas);
	this.air_update_turf();
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.density = 0;
	playsound(this.loc, rt.rsc("sound/effects/spray.ogg"), 10, 1, -3);
	yield* this.update_icon();
	this.investigate_log("was destroyed.", "atmos");
	if (!this.holding) return f.dot;
	yield* this.holding.forceMove(_T);
	this.holding = null;
	return f.dot;
}, true);

// canister.dm:296
rt.def("/obj/machinery/portable_atmospherics/canister/proc/process_atmos", function* process_atmos(f: Frame) {
	yield* parent_proc();
	if (rt.bitAnd(this.stat, 1)) {
		return PROCESS_KILL;
	}
	if (this.timing && this.valve_timer < rt.worldTime(f)) {
		this.valve_open = (!this.valve_open ? 1 : 0);
		this.timing = 0;
	}
	if (!this.valve_open) {
		rt.setAt(this.pump.airs, 1, null);
		rt.setAt(this.pump.airs, 2, null);
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this, 0);
	rt.setAt(this.pump.airs, 1, this.air_contents);
	let $0: any = this.pump.airs;
	let $1: any = 2;
	rt.setAt($0, $1, this.holding ? this.holding.air_contents : _T.return_air());
	this.pump.target_pressure = this.release_pressure;
	yield* this.pump.process_atmos();
	if (!this.holding) {
		this.air_update_turf();
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// canister.dm:319
rt.def("/obj/machinery/portable_atmospherics/canister/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.physical_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "canister", this.name, 420, 405, master_ui, state))).open();
	return f.dot;
}, true);

// canister.dm:325
rt.def("/obj/machinery/portable_atmospherics/canister/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	let $0: any = (data = list());
	let $1: any = "portConnected";
	rt.setAt($0, $1, this.connected_port ? 1 : 0);
	rt.setAt(data, "tankPressure", round(this.air_contents.return_pressure() ? this.air_contents.return_pressure() : 0));
	rt.setAt(data, "releasePressure", round(this.release_pressure ? this.release_pressure : 0));
	rt.setAt(data, "defaultReleasePressure", round(101.325));
	rt.setAt(data, "minReleasePressure", round(this.can_min_release_pressure));
	rt.setAt(data, "maxReleasePressure", round(this.can_max_release_pressure));
	rt.setAt(data, "valveOpen", this.valve_open ? 1 : 0);
	rt.setAt(data, "isPrototype", rt.sv(f, "prototype") ? 1 : 0);
	if (rt.sv(f, "prototype")) {
		rt.setAt(data, "restricted", this.restricted);
		rt.setAt(data, "timing", this.timing);
		rt.setAt(data, "time_left", this.get_time_left());
		rt.setAt(data, "timer_set", this.timer_set);
		rt.setAt(data, "timer_is_not_default", (this.timer_set != this.default_timer_set ? 1 : 0));
		rt.setAt(data, "timer_is_not_min", (this.timer_set != this.minimum_timer_set ? 1 : 0));
		rt.setAt(data, "timer_is_not_max", (this.timer_set != this.maximum_timer_set ? 1 : 0));
	}
	rt.setAt(data, "hasHoldingTank", this.holding ? 1 : 0);
	if (this.holding) {
		rt.setAt(data, "holdingTank", list());
		rt.setAt(rt.at(data, "holdingTank"), "name", this.holding.name);
		rt.setAt(rt.at(data, "holdingTank"), "tankPressure", round(this.holding.air_contents.return_pressure()));
	}
	return data;
});

// canister.dm:352
rt.def("/obj/machinery/portable_atmospherics/canister/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let label: Value = null, newtype: Value = null, replacement: Value = null, pressure: Value = null, logmsg: Value = null, danger: Value = null, id: Value = null, gas: Value = null, name: Value = null, msg: Value = null, change: Value = null, user_input: Value = null, N: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "relabel") {
		if ((label = (yield* g.op(f, "Prompt", [1], [null, null, this.name, "New canister label:", GLOB.label2types]))) && !(yield* parent_proc())) {
			if (newtype = rt.index(GLOB.label2types, label)) {
				this.name = rt.initial(f, (replacement = newtype), "name");
				this.desc = rt.initial(f, replacement, "name");
				this.icon_state = rt.initial(f, replacement, "icon_state");
			}
		}
	} else if (action === "restricted") {
		this.restricted = (!this.restricted ? 1 : 0);
		if (this.restricted) {
			this.req_access = list(10);
		} else {
			this.req_access = list();
			f.dot = 1;
		}
	} else if (action === "pressure") {
		if ((pressure = rt.at(params, "pressure")) == "reset") {
			pressure = 101.325;
			f.dot = 1;
		} else if (pressure == "min") {
			pressure = this.can_min_release_pressure;
			f.dot = 1;
		} else if (pressure == "max") {
			pressure = this.can_max_release_pressure;
			f.dot = 1;
		} else if (pressure == "input") {
			if ((pressure = (yield* g.op(f, "Prompt", [33], [null, this.release_pressure, this.name, `New release pressure (${this.can_min_release_pressure}-${this.can_max_release_pressure} kPa):`, null]))) !== null && !(yield* parent_proc())) {
				f.dot = 1;
			}
		} else if (text2num(pressure) !== null) {
			pressure = text2num(pressure);
			f.dot = 1;
		}
		if (f.dot) {
			this.release_pressure = max(this.can_min_release_pressure, min(round(pressure), this.can_max_release_pressure));
			this.investigate_log(`was set to ${this.release_pressure} kPa by ${key_name(f.usr)}.`, "atmos");
		}
	} else if (action === "valve") {
		this.valve_open = (!this.valve_open ? 1 : 0);
		if (this.valve_open) {
			logmsg = fmt("Valve was <b>opened</b> by ＀, starting a transfer into ％！.<br>", [key_name(f.usr), (this.holding || "air")]);
			if (!this.holding) {
				danger = list();
				for (id of each(this.air_contents.gases)) {
					if (!rt.index(rt.index((gas = rt.index(this.air_contents.gases, id)), 3), 5)) {
						continue;
					}
					if (rt.index(gas, 1) > (rt.index(rt.index(gas, 3), 3) || MOLES_PLASMA_VISIBLE)) {
						rt.setAt(danger, rt.index(rt.index(gas, 3), 2), rt.index(gas, 1));
					}
				}
				if (rt.len(f, danger)) {
					message_admins(`${`${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`} opened a canister that contains the following: ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`);
					log_admin(`${key_name(f.usr)} opened a canister that contains the following at ${`(${this.x},${this.y},${this.z})`}:`);
					for (name of each(danger)) {
						log_admin((msg = `${name}: ${rt.index(danger, name)} moles.`));
						message_admins(msg);
					}
				}
			}
		} else {
			logmsg = fmt("Valve was <b>closed</b> by ＀, stopping the transfer into ％！.<br>", [key_name(f.usr), (this.holding || "air")]);
		}
		this.investigate_log(logmsg, "atmos");
		this.release_log += logmsg;
		f.dot = 1;
	} else if (action === "timer") {
		const subject = (change = rt.at(params, "change"));
		if (subject === "reset") {
			this.timer_set = this.default_timer_set;
		} else if (subject === "decrease") {
			this.timer_set = max(this.minimum_timer_set, this.timer_set - 10);
		} else if (subject === "increase") {
			this.timer_set = min(this.maximum_timer_set, this.timer_set + 10);
		} else if (subject === "input") {
			if (!(user_input = (yield* g.op(f, "Prompt", [33], [null, this.name, "Set time to valve toggle.", f.usr, null])))) {
				return f.dot;
			}
			if (!(N = text2num(user_input))) {
				return f.dot;
			}
			this.timer_set = max(this.minimum_timer_set, min(N, this.maximum_timer_set));
			log_admin(`${key_name(f.usr)} has activated a prototype valve timer`);
			f.dot = 1;
		} else if (subject === "toggle_timer") {
			this.set_active();
		}
	} else if (action === "eject") {
		if (this.holding) {
			if (this.valve_open) {
				this.investigate_log(`${key_name(f.usr)} removed the ${this.holding}, leaving the valve open and transfering into the <span class='boldannounce'>air</span><br>`, "atmos");
			}
			yield* this.holding.forceMove(rt.getStep(f, this, 0));
			this.holding = null;
			f.dot = 1;
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);
