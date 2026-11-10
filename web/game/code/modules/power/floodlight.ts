// Based on /tg/station's code/modules/power/floodlight.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12975, "/obj/structure/floodlight_frame", "/obj/structure", {
	state: 3,
	name: "floodlight frame",
	desc: "A bare metal frame looking vaguely like a floodlight. Requires wrenching down.",
	max_integrity: 100,
	obj_integrity: 100,
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "floodlight_c1",
	density: 1,
});

// floodlight.dm:13
rt.def("/obj/structure/floodlight_frame/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let S: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/wrench")) && this.state == FLOODLIGHT_NEEDS_WRENCHING) {
		to_chat(user, `<span class='notice'>You secure the ${this}.</span>`);
		this.anchored = 1;
		this.state = FLOODLIGHT_NEEDS_WIRES;
		this.desc = "A bare metal frame looking vaguely like a floodlight. Requires wiring.";
	} else if (rt.istype(O, T("/obj/item/stack/cable_coil")) && this.state == FLOODLIGHT_NEEDS_WIRES) {
		if (yield* (S = O).use(5)) {
			to_chat(user, `<span class='notice'>You wire the ${this}.</span>`);
			this.name = `wired ${this.name}`;
			this.desc = "A bare metal frame looking vaguely like a floodlight. Requires securing with a screwdriver.";
			this.icon_state = "floodlight_c2";
			this.state = FLOODLIGHT_NEEDS_SECURING;
		}
	} else if (rt.istype(O, T("/obj/item/weapon/light/tube")) && this.state == FLOODLIGHT_NEEDS_LIGHTS) {
		if (yield* user.transferItemToLoc(O)) {
			to_chat(user, `<span class='notice'>You put lights in the ${this}.</span>`);
			yield* new_(T("/obj/machinery/power/floodlight"), this.loc);
			yield* qdel(this);
		}
	} else if (rt.istype(O, T("/obj/item/weapon/screwdriver")) && this.state == FLOODLIGHT_NEEDS_SECURING) {
		to_chat(user, `<span class='notice'>You fasten the wiring and electronics in ${this}.</span>`);
		this.name = `secured ${this.name}`;
		this.desc = "A bare metal frame that looks like a floodlight. Requires light tubes.";
		this.icon_state = "floodlight_c3";
		this.state = FLOODLIGHT_NEEDS_LIGHTS;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(10311, "/obj/machinery/power/floodlight", "/obj/machinery/power", {
	light_setting_list: null,
	light_power_coefficient: 300,
	setting: 1,
	anchored: 1,
	light_power: 1.75,
	name: "floodlight",
	desc: "A pole with powerful mounted lights on it. Due to its high power draw, it must be powered by a direct connection to a wire node.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "floodlight",
	density: 1,
	idle_power_usage: 100,
	active_power_usage: 1000,
});

// floodlight.dm:55
rt.def("/obj/machinery/power/floodlight/proc/process", function process(f: Frame) {
	if (this.avail(this.active_power_usage)) {
		this.add_load(this.active_power_usage);
	} else {
		this.change_setting(1);
	}
	return f.dot;
}, false, { waitfor: false });

// floodlight.dm:61
rt.def("/obj/machinery/power/floodlight/proc/change_setting", function change_setting(f: Frame, val: Value, user: Value) {
	if (val < 1 || val > rt.len(f, this.light_setting_list)) {
		return f.dot;
	}
	this.active_power_usage = rt.index(this.light_setting_list, val);
	if (!this.avail(this.active_power_usage)) {
		return this.change_setting(val - 1);
	}
	this.setting = val;
	this.set_light(rt.index(this.light_setting_list, val));
	let setting_text: Value = "";
	if (val > 1) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}_on`;
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
	}
	if (val === 1) {
		setting_text = "OFF";
	} else if (val === 2) {
		setting_text = "low power";
	} else if (val === 3) {
		setting_text = "standard lighting";
	} else if (val === 4) {
		setting_text = "high power";
	}
	if (!user) return f.dot;
	to_chat(user, `You set the ${this} to ${setting_text}.`);
	return f.dot;
});

// floodlight.dm:86
rt.def("/obj/machinery/power/floodlight/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/wrench"))) {
		yield* this.default_unfasten_wrench(user, O, { time: 20 });
		this.change_setting(1);
		if (this.anchored) {
			yield* this.connect_to_network();
		} else {
			yield* this.disconnect_from_network();
		}
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// floodlight.dm:97
rt.def("/obj/machinery/power/floodlight/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let current: Value = null;
	if ((current = this.setting) == 1) {
		current = rt.len(f, this.light_setting_list);
	} else {
		current--;
	}
	this.change_setting(current, user);
	yield* parent_proc();
	return f.dot;
}, true);

// floodlight.dm:106
rt.def("/obj/machinery/power/floodlight/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	yield* parent_proc();
	return f.dot;
}, true);
