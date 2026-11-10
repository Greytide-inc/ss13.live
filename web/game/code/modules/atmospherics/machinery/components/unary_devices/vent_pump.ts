// Based on /tg/station's code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10601, "/obj/machinery/atmospherics/components/unary/vent_pump", "/obj/machinery/atmospherics/components/unary", {
	id_tag: null,
	on: 0,
	pump_direction: 1,
	pressure_checks: 1,
	external_pressure_bound: 101.325,
	internal_pressure_bound: 0,
	frequency: 1439,
	radio_connection: null,
	radio_filter_out: null,
	radio_filter_in: null,
	can_unwrench: 1,
	welded: 0,
	level: 1,
	name: "air vent",
	desc: "Has a valve and pump attached to it.",
	icon_state: "vent_map",
	use_power: 1,
	layer: 2.46,
});

// vent_pump.dm:49
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.id_tag) return f.dot;
	this.assign_uid();
	this.id_tag = num2text(this.uid);
	return f.dot;
}, true);

// vent_pump.dm:55
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	(A = get_area(this)).air_vent_names -= this.id_tag;
	A.air_vent_info -= this.id_tag;
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	this.radio_connection = null;
	return (yield* parent_proc());
}, true);

rt.type(10605, "/obj/machinery/atmospherics/components/unary/vent_pump/high_volume", "/obj/machinery/atmospherics/components/unary/vent_pump", {
	name: "large air vent",
	power_channel: 1,
});

// vent_pump.dm:83
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/high_volume/proc/New", function* New(f: Frame) {
	let air_contents: Value = null;
	yield* parent_proc();
	(air_contents = rt.index(this.airs, 1)).volume = 1000;
	return f.dot;
}, true);

// vent_pump.dm:88
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	this.cut_overlays();
	if (this.showpipe) {
		this.add_overlay(this.getpipeimage(this.icon, "vent_cap", this.initialize_directions));
	}
	if (this.welded) {
		this.icon_state = "vent_welded";
		return f.dot;
	}
	if (!rt.index(this.nodes, 1) || !this.on || rt.bitAnd(this.stat, 3)) {
		this.icon_state = "vent_off";
		return f.dot;
	}
	if (rt.bitAnd(this.pump_direction, 1)) {
		this.icon_state = "vent_out";
	} else {
		this.icon_state = "vent_in";
	}
	return f.dot;
});

// vent_pump.dm:106
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/process_atmos", function* process_atmos(f: Frame) {
	let pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null;
	yield* parent_proc();
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!rt.index(this.nodes, 1)) {
		this.on = 0;
	}
	if (!this.on || this.welded) {
		return 0;
	}
	let air_contents: Value = rt.index(this.airs, 1);
	let environment: Value = this.loc.return_air();
	let environment_pressure: Value = environment.return_pressure();
	if (rt.bitAnd(this.pump_direction, 1)) {
		pressure_delta = 10000;
		if (rt.bitAnd(this.pressure_checks, EXT_BOUND)) {
			pressure_delta = min(pressure_delta, this.external_pressure_bound - environment_pressure);
		}
		if (rt.bitAnd(this.pressure_checks, INT_BOUND)) {
			pressure_delta = min(pressure_delta, air_contents.return_pressure() - this.internal_pressure_bound);
		}
		if (pressure_delta > 0) {
			if (air_contents.temperature > 0) {
				transfer_moles = pressure_delta * environment.volume / (air_contents.temperature * R_IDEAL_GAS_EQUATION);
				removed = (yield* air_contents.remove(transfer_moles));
				yield* this.loc.assume_air(removed);
				this.air_update_turf();
			}
		}
	} else {
		pressure_delta = 10000;
		if (rt.bitAnd(this.pressure_checks, EXT_BOUND)) {
			pressure_delta = min(pressure_delta, environment_pressure - this.external_pressure_bound);
		}
		if (rt.bitAnd(this.pressure_checks, INT_BOUND)) {
			pressure_delta = min(pressure_delta, this.internal_pressure_bound - air_contents.return_pressure());
		}
		if (pressure_delta > 0) {
			if (environment.temperature > 0) {
				transfer_moles = pressure_delta * air_contents.volume / (environment.temperature * R_IDEAL_GAS_EQUATION);
				if ((removed = (yield* this.loc.remove_air(transfer_moles))) === null) {
					return f.dot;
				}
				yield* air_contents.merge(removed);
				this.air_update_turf();
			}
		}
	}
	this.update_parents();
	return 1;
}, true);

// vent_pump.dm:159
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	if (!this.frequency) return f.dot;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency, this.radio_filter_in);
	return f.dot;
}, true);

// vent_pump.dm:165
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null, A: Value = null;
	let $12: any;
	if (!this.radio_connection) {
		return 0;
	}
	(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
	signal.source = this;
	let $0: any = signal;
	let $1: any = "tag";
	let $2: any = this.id_tag;
	let $3: any = "frequency";
	let $4: any = this.frequency;
	let $5: any = "device";
	let $6: any = "VP";
	let $7: any = "timestamp";
	let $8: any = rt.worldTime(f);
	let $9: any = "power";
	let $10: any = this.on;
	let $11: any = "direction";
	if (this.pump_direction) {
		$12 = "release";
	} else {
		$12 = "siphon";
	}
	$0.data = rt.alist(f, [$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, "checks", this.pressure_checks, "internal", this.internal_pressure_bound, "external", this.external_pressure_bound, "sigtype", "status"]);
	if (!rt.index((A = get_area(this)).air_vent_names, this.id_tag)) {
		this.name = `ÿ\u0016${A.name} vent pump #${rt.len(f, A.air_vent_names) + 1}`;
		rt.setAt(A.air_vent_names, this.id_tag, this.name);
	}
	rt.setAt(A.air_vent_info, this.id_tag, signal.data);
	yield* this.radio_connection.post_signal(this, signal, this.radio_filter_out);
	return 1;
}, true);

// vent_pump.dm:198
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/atmosinit", function* atmosinit(f: Frame) {
	this.radio_filter_in = this.frequency == 1439 ? GLOB.RADIO_FROM_AIRALARM : null;
	this.radio_filter_out = this.frequency == 1439 ? GLOB.RADIO_TO_AIRALARM : null;
	if (this.frequency) {
		yield* this.set_frequency(this.frequency);
	}
	yield* this.broadcast_status();
	yield* parent_proc();
	return f.dot;
}, true);

// vent_pump.dm:206
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!rt.index(signal.data, "tag") || rt.index(signal.data, "tag") != this.id_tag || rt.index(signal.data, "sigtype") != "command") {
		return 0;
	}
	if (rt.isIn(f, "purge", signal.data)) {
		(rt.modSrcVar(f, "pressure_checks", 16777214, rt.bitAnd));
		this.pump_direction = 0;
	}
	if (rt.isIn(f, "stabalize", signal.data)) {
		(rt.modSrcVar(f, "pressure_checks", 1, rt.bitOr));
		this.pump_direction = 1;
	}
	if (rt.isIn(f, "power", signal.data)) {
		this.on = text2num(rt.index(signal.data, "power"));
	}
	if (rt.isIn(f, "power_toggle", signal.data)) {
		this.on = (!this.on ? 1 : 0);
	}
	if (rt.isIn(f, "checks", signal.data)) {
		this.pressure_checks = text2num(rt.index(signal.data, "checks"));
	}
	if (rt.isIn(f, "checks_toggle", signal.data)) {
		this.pressure_checks = this.pressure_checks ? 0 : NO_BOUND;
	}
	if (rt.isIn(f, "direction", signal.data)) {
		this.pump_direction = text2num(rt.index(signal.data, "direction"));
	}
	if (rt.isIn(f, "set_internal_pressure", signal.data)) {
		this.internal_pressure_bound = max(0, min(text2num(rt.index(signal.data, "set_internal_pressure")), 5066.25));
	}
	if (rt.isIn(f, "set_external_pressure", signal.data)) {
		this.external_pressure_bound = max(0, min(text2num(rt.index(signal.data, "set_external_pressure")), 5066.25));
	}
	if (rt.isIn(f, "reset_external_pressure", signal.data)) {
		this.external_pressure_bound = ONE_ATMOSPHERE;
	}
	if (rt.isIn(f, "adjust_internal_pressure", signal.data)) {
		this.internal_pressure_bound = max(0, min(this.internal_pressure_bound + text2num(rt.index(signal.data, "adjust_internal_pressure")), 5066.25));
	}
	if (rt.isIn(f, "adjust_external_pressure", signal.data)) {
		this.external_pressure_bound = max(0, min(this.external_pressure_bound + text2num(rt.index(signal.data, "adjust_external_pressure")), 5066.25));
	}
	if (rt.isIn(f, "init", signal.data)) {
		this.name = rt.index(signal.data, "init");
		return f.dot;
	}
	if (rt.isIn(f, "status", signal.data)) {
		yield* this.broadcast_status();
		return f.dot;
	}
	yield* this.broadcast_status();
	yield* this.update_icon();
	return f.dot;
}, true);

// vent_pump.dm:264
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		if (yield* (WT = W).remove_fuel(0, user)) {
			playsound(this.loc, WT.usesound, 40, 1);
			to_chat(user, "<span class='notice'>You begin welding the vent...</span>");
			if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
				if (!this || !WT.isOn()) {
					return f.dot;
				}
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
				if (!this.welded) {
					user.visible_message(`${user} welds the vent shut.`, "<span class='notice'>You weld the vent shut.</span>", "<span class='italics'>You hear welding.</span>");
					this.welded = 1;
				} else {
					user.visible_message(`${user} unwelds the vent.`, "<span class='notice'>You unweld the vent.</span>", "<span class='italics'>You hear welding.</span>");
					this.welded = 0;
				}
				yield* this.update_icon();
				this.pipe_vision_img = (yield* image(this, this.loc, { layer: ABOVE_HUD_LAYER, dir: this.dir }));
				this.pipe_vision_img.plane = ABOVE_HUD_PLANE;
			}
			return 0;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// vent_pump.dm:286
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/can_unwrench", function can_unwrench(f: Frame, user: Value) {
	if (!parent_proc()) return f.dot;
	if (!rt.bitAnd(this.stat, 2) && this.on) {
		to_chat(user, `<span class='warning'>You cannot unwrench ${this}, turn it off first!</span>`);
	} else {
		return 1;
	}
	return f.dot;
}, false);

// vent_pump.dm:293
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.welded) return f.dot;
	to_chat(user, "It seems welded shut.");
	return f.dot;
}, false);

// vent_pump.dm:298
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon_nopipes();
	return f.dot;
});

// vent_pump.dm:302
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/can_crawl_through", function can_crawl_through(f: Frame) {
	return (!this.welded ? 1 : 0);
});

// vent_pump.dm:305
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	if (!this.welded || !(yield* do_after(user, 20, { target: this }))) {
		return f.dot;
	}
	user.visible_message(`${user} furiously claws at ${this}!`, "You manage to clear away the stuff blocking the vent", "You hear loud scraping noises.");
	this.welded = 0;
	yield* this.update_icon();
	this.pipe_vision_img = (yield* image(this, this.loc, { layer: ABOVE_HUD_LAYER, dir: this.dir }));
	this.pipe_vision_img.plane = ABOVE_HUD_PLANE;
	playsound(this.loc, rt.rsc("sound/weapons/bladeslice.ogg"), 100, 1);
	return f.dot;
}, true);
