// Based on /tg/station's code/modules/atmospherics/machinery/other/meter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10883, "/obj/machinery/meter", "/obj/machinery", {
	target: null,
	frequency: 0,
	id_tag: null,
	anchored: 1,
	power_channel: 3,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 4,
	name: "gas flow meter",
	desc: "It measures something.",
	icon: rt.rsc("icons/obj/meter.dmi"),
	icon_state: "meterX",
	obj_integrity: 150,
	max_integrity: 150,
	armor: null,
});

// meter.dm:16
rt.def("/obj/machinery/meter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 40, "acid", 0]);
	return f.dot;
});

// meter.dm:20
rt.def("/obj/machinery/meter/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	GLOB.SSair.atmos_machinery += this;
	if (this.target) return f.dot;
	this.target = rt.locateIn(f, T("/obj/machinery/atmospherics/pipe"), this.loc);
	return f.dot;
}, true);

// meter.dm:26
rt.def("/obj/machinery/meter/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSair.atmos_machinery -= this;
	this.target = null;
	return (yield* parent_proc());
}, true);

// meter.dm:31
rt.def("/obj/machinery/meter/proc/process_atmos", function* process_atmos(f: Frame) {
	let environment: Value = null, env_pressure: Value = null, val: Value = null, radio_connection: Value = null, signal: Value = null;
	if (!this.target) {
		this.icon_state = "meterX";
		return 0;
	}
	if (rt.bitAnd(this.stat, 3)) {
		this.icon_state = "meter0";
		return 0;
	}
	yield* this.use_power(5);
	if (!(environment = this.target.return_air())) {
		this.icon_state = "meterX";
		return 0;
	}
	if ((env_pressure = environment.return_pressure()) <= 15.1987505) {
		this.icon_state = "meter0";
	} else if (env_pressure <= 182.385) {
		this.icon_state = `meter1_${(val = round(env_pressure / 30.397501 + 0.5))}`;
	} else if (env_pressure <= 3039.75) {
		this.icon_state = `meter2_${(val = round(env_pressure / 506.625 - 0.35) + 1)}`;
	} else if (env_pressure <= 5978.175) {
		this.icon_state = `meter3_${(val = round(env_pressure / 506.625 - 6) + 1)}`;
	} else {
		this.icon_state = "meter4";
	}
	if (!this.frequency) return f.dot;
	if (!(radio_connection = GLOB.SSradio.return_frequency(this.frequency))) {
		return f.dot;
	}
	(signal = (yield* new_(T("/datum/signal")))).source = this;
	signal.transmission_method = 1;
	signal.data = rt.alist(f, ["id_tag", this.id_tag, "device", "AM", "pressure", round(env_pressure), "sigtype", "status"]);
	yield* radio_connection.post_signal(this, signal);
	return f.dot;
}, true);

// meter.dm:79
rt.def("/obj/machinery/meter/proc/status", function status(f: Frame) {
	let environment: Value = null;
	let t: Value = "";
	if (this.target) {
		if (environment = this.target.return_air()) {
			t += `The pressure gauge reads ${round(environment.return_pressure(), 0.01)} kPa; ${round(environment.temperature, 0.01)} K (${round(environment.temperature - T0C, 0.01)}&deg;C)`;
		} else {
			t += "The sensor error light is blinking.";
		}
	} else {
		t += "The connect error light is blinking.";
	}
	return t;
});

// meter.dm:91
rt.def("/obj/machinery/meter/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, this.status());
	return f.dot;
}, false);

// meter.dm:96
rt.def("/obj/machinery/meter/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		playsound(this.loc, W.usesound, 50, 1);
		to_chat(user, fmt("<span class='notice'>You begin to unfasten ％！...</span>", [this]));
		if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
			user.visible_message(fmt("＀ unfastens ％！.", [user, this]), fmt("<span class='notice'>You unfasten ％！.</span>", [this]), "<span class='italics'>You hear ratchet.</span>");
			yield* new_(T("/obj/item/pipe_meter"), this.loc);
			yield* qdel(this);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// meter.dm:110
rt.def("/obj/machinery/meter/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return this.attack_hand(user);
});

// meter.dm:113
rt.def("/obj/machinery/meter/proc/attack_paw", function attack_paw(f: Frame, user: Value) {
	return this.attack_hand(user);
});

// meter.dm:117
rt.def("/obj/machinery/meter/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		return 1;
	} else {
		to_chat(f.usr, this.status());
		return 1;
	}
});

// meter.dm:124
rt.def("/obj/machinery/meter/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FIVE)) return f.dot;
	yield* new_(T("/obj/item/pipe_meter"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10884, "/obj/machinery/meter/turf", "/obj/machinery/meter", {});

// meter.dm:133
rt.def("/obj/machinery/meter/turf/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.target = this.loc;
	return f.dot;
}, true);
