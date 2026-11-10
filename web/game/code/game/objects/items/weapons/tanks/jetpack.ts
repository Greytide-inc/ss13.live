// Based on /tg/station's code/game/objects/items/weapons/tanks/jetpack.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7447, "/obj/item/weapon/tank/jetpack", "/obj/item/weapon/tank", {
	gas_type: "o2",
	on: 0,
	stabilizers: 0,
	full_speed: 1,
	ion_trail: null,
	name: "jetpack (empty)",
	desc: "A tank of compressed gas for use as propulsion in zero-gravity areas. Use with caution.",
	icon_state: "jetpack",
	item_state: "jetpack",
	w_class: 4,
	distribute_pressure: 21.278248,
	actions_types: null,
});

// jetpack.dm:8
rt.def("/obj/item/weapon/tank/jetpack/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/set_internals"), T("/datum/action/item_action/toggle_jetpack"), T("/datum/action/item_action/jetpack_stabilization"));
	return f.dot;
});

// jetpack.dm:16
rt.def("/obj/item/weapon/tank/jetpack/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.gas_type) {
		this.air_contents.assert_gas(this.gas_type);
		rt.setAt(rt.index(this.air_contents.gases, this.gas_type), 1, 607.94995 * this.volume / 2436.0767);
	}
	this.ion_trail = (yield* new_(T("/datum/effect_system/trail_follow/ion")));
	yield* this.ion_trail.set_up(this);
	return f.dot;
}, true);

// jetpack.dm:25
rt.def("/obj/item/weapon/tank/jetpack/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	if (rt.istype(action, T("/datum/action/item_action/toggle_jetpack"))) {
		yield* this.cycle(user);
	} else if (rt.istype(action, T("/datum/action/item_action/jetpack_stabilization"))) {
		if (this.on) {
			this.stabilizers = (!this.stabilizers ? 1 : 0);
			to_chat(user, `<span class='notice'>You turn the jetpack stabilization ${this.stabilizers ? "on" : "off"}.</span>`);
		}
	} else {
		yield* this.toggle_internals(user);
	}
	return f.dot;
}, true);

// jetpack.dm:36
rt.def("/obj/item/weapon/tank/jetpack/proc/cycle", function* cycle(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	if (user.incapacitated()) {
		return f.dot;
	}
	if (!this.on) {
		yield* this.turn_on();
		to_chat(user, "<span class='notice'>You turn the jetpack on.</span>");
	} else {
		yield* this.turn_off();
		to_chat(user, "<span class='notice'>You turn the jetpack off.</span>");
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// jetpack.dm:52
rt.def("/obj/item/weapon/tank/jetpack/proc/turn_on", function* turn_on(f: Frame) {
	this.on = 1;
	this.icon_state = `${rt.initial(f, this, "icon_state")}-on`;
	yield* this.ion_trail.start();
	return f.dot;
}, true);

// jetpack.dm:58
rt.def("/obj/item/weapon/tank/jetpack/proc/turn_off", function turn_off(f: Frame) {
	this.on = 0;
	this.stabilizers = 0;
	this.icon_state = rt.initial(f, this, "icon_state");
	this.ion_trail.stop();
	return f.dot;
});

// jetpack.dm:62
rt.def("/obj/item/weapon/tank/jetpack/proc/allow_thrust", function* allow_thrust(f: Frame, num: Value, user: Value) {
	let removed: Value = null, _T: Value = null;
	if (!this.on) {
		return f.dot;
	}
	if (num < 0.005 || this.air_contents.total_moles() < num) {
		yield* this.turn_off();
		return f.dot;
	}
	if ((removed = (yield* this.air_contents.remove(num))).total_moles() < 0.005) {
		yield* this.turn_off();
		return f.dot;
	}
	yield* (_T = rt.getStep(f, user, 0)).assume_air(removed);
	return 1;
}, true);

// jetpack.dm:79
rt.def("/obj/item/weapon/tank/jetpack/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let H: Value = null;
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		yield* (H = user).forcesay("WHAT THE FUCK IS CARBON DIOXIDE?");
		H.visible_message(`<span class='suicide'>${user} is suffocating ${user.p_them()}self with ${this}! It looks like ${user.p_they()} didn't read what that jetpack says!</span>`);
		return 8;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(7454, "/obj/item/weapon/tank/jetpack/suit", "/obj/item/weapon/tank/jetpack", {
	temp_air_contents: null,
	tank: null,
	gas_type: null,
	full_speed: 0,
	name: "hardsuit jetpack upgrade",
	desc: "A modular, compact set of thrusters designed to integrate with a hardsuit. It is fueled by a tank inserted into the suit's storage compartment.",
	origin_tech: "materials=4;magnets=4;engineering=5",
	icon_state: "jetpack-mining",
	item_state: "jetpack-black",
	w_class: 3,
	actions_types: null,
	volume: 1,
	slot_flags: null,
});

// jetpack.dm:139
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_jetpack"), T("/datum/action/item_action/jetpack_stabilization"));
	return f.dot;
});

// jetpack.dm:148
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	this.temp_air_contents = this.air_contents;
	return f.dot;
}, true);

// jetpack.dm:156
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/cycle", function* cycle(f: Frame, user: Value) {
	let H: Value = null;
	if (!rt.istype(this.loc, T("/obj/item/clothing/suit/space/hardsuit"))) {
		to_chat(user, fmt("<span class='warning'>＄！ must be connected to a hardsuit!</span>", [this]));
		return f.dot;
	}
	if (!rt.istype((H = user).s_store, T("/obj/item/weapon/tank/internals"))) {
		to_chat(user, "<span class='warning'>You need a tank in your suit storage!</span>");
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// jetpack.dm:167
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/turn_on", function* turn_on(f: Frame) {
	let H: Value = null;
	if (!rt.istype(this.loc, T("/obj/item/clothing/suit/space/hardsuit")) || !rt.istype(this.loc.loc, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	this.tank = (H = this.loc.loc).s_store;
	this.air_contents = this.tank.air_contents;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// jetpack.dm:177
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/turn_off", function turn_off(f: Frame) {
	this.tank = null;
	this.air_contents = this.temp_air_contents;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	parent_proc();
	return f.dot;
});

// jetpack.dm:182
rt.def("/obj/item/weapon/tank/jetpack/suit/proc/process", function process(f: Frame) {
	if (!rt.istype(this.loc, T("/obj/item/clothing/suit/space/hardsuit")) || !rt.istype(this.loc.loc, T("/mob/living/carbon/human"))) {
		this.turn_off();
		return f.dot;
	}
	let H: Value = this.loc.loc;
	if (!this.tank || this.tank != H.s_store) {
		this.turn_off();
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// jetpack.dm:200
rt.def("/mob/living/carbon/proc/get_jetpack", function get_jetpack(f: Frame) {
	let J: Value = null;
	if (!rt.istype((J = this.back), T("/obj/item/weapon/tank/jetpack"))) return f.dot;
	return J;
});

// jetpack.dm:205
rt.def("/mob/living/carbon/human/proc/get_jetpack", function get_jetpack(f: Frame) {
	let J: Value = null, C: Value = null;
	if (!rt.istype((J = parent_proc()), T("/obj/item/weapon/tank/jetpack")) && rt.istype(this.wear_suit, T("/obj/item/clothing/suit/space/hardsuit"))) {
		J = (C = this.wear_suit).jetpack;
	}
	return J;
});
