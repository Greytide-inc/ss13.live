// Based on /tg/station's code/modules/power/tesla/coil.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10332, "/obj/machinery/power/tesla_coil", "/obj/machinery/power", {
	power_loss: 2,
	input_power_multiplier: 1,
	zap_cooldown: 100,
	last_zap: 0,
	anchored: 0,
	can_buckle: 1,
	buckle_lying: 0,
	buckle_requires_restraints: 1,
	name: "tesla coil",
	desc: "For the union!",
	icon: rt.rsc("icons/obj/tesla_engine/tesla_coil.dmi"),
	icon_state: "coil0",
	density: 1,
});

// coil.dm:20
rt.def("/obj/machinery/power/tesla_coil/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/tesla_coil"), null))).apply_default_parts(this);
	this.wires = (yield* new_(T("/datum/wires/tesla_coil"), this));
	return f.dot;
}, true);

rt.type(6773, "/obj/item/weapon/circuitboard/machine/tesla_coil", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Tesla Coil (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/tesla_coil"),
	origin_tech: "programming=3;magnets=3;powerstorage=3",
});

// coil.dm:29
rt.def("/obj/item/weapon/circuitboard/machine/tesla_coil/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 1]);
	return f.dot;
});

// coil.dm:34
rt.def("/obj/machinery/power/tesla_coil/proc/RefreshParts", function RefreshParts(f: Frame) {
	let C: Value = null;
	let power_multiplier: Value = 0;
	this.zap_cooldown = 100;
	for (C of each(this.component_parts, T("/obj/item/weapon/stock_parts/capacitor"))) {
		power_multiplier += C.rating;
		this.zap_cooldown -= C.rating * 20;
	}
	this.input_power_multiplier = power_multiplier;
	return f.dot;
});

// coil.dm:40
rt.def("/obj/machinery/power/tesla_coil/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* parent_proc());
	if (f.dot != SUCCESSFUL_UNFASTEN) return f.dot;
	if (this.panel_open) {
		this.icon_state = `coil_open${this.anchored}`;
	} else {
		this.icon_state = `coil${this.anchored}`;
	}
	if (this.anchored) {
		yield* this.connect_to_network();
	} else {
		yield* this.disconnect_from_network();
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// coil.dm:52
rt.def("/obj/machinery/power/tesla_coil/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, `coil_open${this.anchored}`, `coil${this.anchored}`, W)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, W)) {
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, W)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(W)) {
		return f.dot;
	}
	if (is_wire_tool(W) && this.panel_open) {
		yield* this.wires.interact(user);
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// coil.dm:71
rt.def("/obj/machinery/power/tesla_coil/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.a_intent == "grab" && (yield* this.user_buckle_mob(user.pulling, user, { check_loc: 0 }))) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// coil.dm:76
rt.def("/obj/machinery/power/tesla_coil/proc/tesla_act", function* tesla_act(f: Frame, power: Value) {
	let power_produced: Value = null;
	if (this.anchored && !this.panel_open) {
		this.being_shocked = 1;
		this.add_avail((power_produced = this.powernet ? power / this.power_loss : power) * this.input_power_multiplier);
		flick("coilhit", this);
		yield* playsound(this.loc, rt.rsc("sound/magic/lightningshock.ogg"), 100, 1, { extrarange: 5 });
		yield* tesla_zap(this, 5, power_produced);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/proc/reset_shocked"))), 10);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// coil.dm:90
rt.def("/obj/machinery/power/tesla_coil/proc/zap", function* zap(f: Frame) {
	let coeff: Value = null, power: Value = null;
	if (this.last_zap + this.zap_cooldown > rt.worldTime(f) || !this.powernet) {
		return 0;
	}
	this.last_zap = rt.worldTime(f);
	coeff = max((coeff = 20 - (this.input_power_multiplier - 1) * 3), 10);
	this.add_load((power = this.powernet.avail / 2));
	yield* playsound(this.loc, rt.rsc("sound/magic/lightningshock.ogg"), 100, 1, { extrarange: 5 });
	yield* tesla_zap(this, 10, power / (coeff / 2));
	return f.dot;
}, true);

rt.type(10333, "/obj/machinery/power/grounding_rod", "/obj/machinery/power", {
	anchored: 0,
	can_buckle: 1,
	buckle_lying: 0,
	buckle_requires_restraints: 1,
	name: "grounding rod",
	desc: "Keep an area from being fried from Edison's Bane.",
	icon: rt.rsc("icons/obj/tesla_engine/tesla_coil.dmi"),
	icon_state: "grounding_rod0",
	density: 1,
});

// coil.dm:113
rt.def("/obj/machinery/power/grounding_rod/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/grounding_rod"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6774, "/obj/item/weapon/circuitboard/machine/grounding_rod", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Grounding Rod (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/grounding_rod"),
	origin_tech: "programming=3;powerstorage=3;magnets=3;plasmatech=2",
});

// coil.dm:121
rt.def("/obj/item/weapon/circuitboard/machine/grounding_rod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 1]);
	return f.dot;
});

// coil.dm:124
rt.def("/obj/machinery/power/grounding_rod/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* parent_proc());
	if (f.dot != SUCCESSFUL_UNFASTEN) return f.dot;
	if (this.panel_open) {
		this.icon_state = `grounding_rod_open${this.anchored}`;
	} else {
		this.icon_state = `grounding_rod${this.anchored}`;
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// coil.dm:132
rt.def("/obj/machinery/power/grounding_rod/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, `grounding_rod_open${this.anchored}`, `grounding_rod${this.anchored}`, W)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, W)) {
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, W)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(W)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// coil.dm:147
rt.def("/obj/machinery/power/grounding_rod/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.a_intent == "grab" && (yield* this.user_buckle_mob(user.pulling, user, { check_loc: 0 }))) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// coil.dm:152
rt.def("/obj/machinery/power/grounding_rod/proc/tesla_act", function* tesla_act(f: Frame, power: Value) {
	if (this.anchored && !this.panel_open) {
		flick("grounding_rodhit", this);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
