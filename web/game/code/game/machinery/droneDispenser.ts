// Based on /tg/station's code/game/machinery/droneDispenser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10762, "/obj/machinery/droneDispenser", "/obj/machinery", {
	icon_off: "off",
	icon_on: "on",
	icon_recharging: "recharge",
	icon_creating: "make",
	materials: null,
	using_materials: null,
	metal_cost: 1000,
	glass_cost: 1000,
	power_used: 1000,
	mode: "ready",
	timer: null,
	cooldownTime: 1800,
	production_time: 30,
	dispense_type: rt.typePath("/obj/item/drone_shell"),
	maximum_idle: 3,
	work_sound: rt.rsc("sound/items/rped.ogg"),
	create_sound: rt.rsc("sound/items/deconstruct.ogg"),
	recharge_sound: rt.rsc("sound/machines/ping.ogg"),
	begin_create_message: "whirs to life!",
	end_create_message: "dispenses a drone shell.",
	recharge_message: "pings.",
	recharging_text: "It is whirring and clicking. It seems to be recharging.",
	break_message: "lets out a tinny alarm before falling dark.",
	break_sound: rt.rsc("sound/machines/warning-buzzer.ogg"),
	anchored: 1,
	name: "drone shell dispenser",
	desc: "A hefty machine that, when supplied with metal and glass, will periodically create a drone shell. Does not need to be manually operated.",
	icon: rt.rsc("icons/obj/machines/droneDispenser.dmi"),
	icon_state: "on",
	density: 1,
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 80,
});

// droneDispenser.dm:57
rt.def("/obj/machinery/droneDispenser/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.obj_integrity = this.max_integrity;
	this.materials = (yield* new_(T("/datum/material_container"), this, list("$metal", "$glass"), 200000));
	this.using_materials = rt.alist(f, ["$metal", this.metal_cost, "$glass", this.glass_cost]);
	return f.dot;
}, true);

// droneDispenser.dm:65
rt.def("/obj/machinery/droneDispenser/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.materials);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(10764, "/obj/machinery/droneDispenser/preloaded", "/obj/machinery/droneDispenser", {});

// droneDispenser.dm:69
rt.def("/obj/machinery/droneDispenser/preloaded/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.materials.insert_amount(5000);
	return f.dot;
}, true);

rt.type(10765, "/obj/machinery/droneDispenser/syndrone", "/obj/machinery/droneDispenser", {
	dispense_type: rt.typePath("/obj/item/drone_shell/syndrone"),
	cooldownTime: 100,
	end_create_message: "dispenses a suspicious drone shell.",
	name: "syndrone shell dispenser",
	desc: "A suspicious machine that will create Syndicate exterminator drones when supplied with metal and glass. Disgusting.",
});

// droneDispenser.dm:82
rt.def("/obj/machinery/droneDispenser/syndrone/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.materials.insert_amount(25000);
	return f.dot;
}, true);

rt.type(10768, "/obj/machinery/droneDispenser/snowflake/preloaded", "/obj/machinery/droneDispenser/snowflake", {});

// droneDispenser.dm:107
rt.def("/obj/machinery/droneDispenser/snowflake/preloaded/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.materials.insert_amount(10000);
	return f.dot;
}, true);

// droneDispenser.dm:158
rt.def("/obj/machinery/droneDispenser/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.mode == "recharging" && !this.stat && this.recharging_text) {
		to_chat(user, `<span class='warning'>${this.recharging_text}</span>`);
	}
	if (this.metal_cost) {
		to_chat(user, `<span class='notice'>It has ${this.materials.amount("$metal")} units of metal stored.</span>`);
	}
	if (!this.glass_cost) return f.dot;
	to_chat(user, `<span class='notice'>It has ${this.materials.amount("$glass")} units of glass stored.</span>`);
	return f.dot;
}, false);

// droneDispenser.dm:167
rt.def("/obj/machinery/droneDispenser/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	if (this.powered()) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	this.update_icon();
	return f.dot;
});

// droneDispenser.dm:175
rt.def("/obj/machinery/droneDispenser/proc/process", function* process(f: Frame) {
	let A: Value = null;
	yield* parent_proc();
	if (rt.bitAnd(this.stat, 3) || !this.anchored) {
		return f.dot;
	}
	if (!this.materials.has_materials(this.using_materials)) {
		return f.dot;
	}
	if (this.timer > rt.worldTime(f)) {
		return f.dot;
	}
	if (this.mode === "ready") {
		if (this.maximum_idle && this.count_shells() >= this.maximum_idle) {
			return f.dot;
		}
		if (this.begin_create_message) {
			this.visible_message(`<span class='notice'>${this} ${this.begin_create_message}</span>`);
		}
		if (this.work_sound) {
			playsound(this, this.work_sound, 50, 1);
		}
		this.mode = "production";
		this.timer = rt.worldTime(f) + this.production_time;
		yield* this.update_icon();
	} else if (this.mode === "production") {
		this.materials.use_amount(this.using_materials);
		if (this.power_used) {
			yield* this.use_power(this.power_used);
		}
		(A = (yield* new_(this.dispense_type, this.loc))).admin_spawned = this.admin_spawned;
		if (this.create_sound) {
			playsound(this, this.create_sound, 50, 1);
		}
		if (this.end_create_message) {
			this.visible_message(`<span class='notice'>${this} ${this.end_create_message}</span>`);
		}
		this.mode = "recharging";
		this.timer = rt.worldTime(f) + this.cooldownTime;
		yield* this.update_icon();
	} else if (this.mode === "recharging") {
		if (this.recharge_sound) {
			playsound(this, this.recharge_sound, 50, 1);
		}
		if (this.recharge_message) {
			this.visible_message(`<span class='notice'>${this} ${this.recharge_message}</span>`);
		}
		this.mode = "ready";
		yield* this.update_icon();
	}
	return f.dot;
}, true, { waitfor: false });

// droneDispenser.dm:230
rt.def("/obj/machinery/droneDispenser/proc/count_shells", function count_shells(f: Frame) {
	let a: Value = null;
	f.dot = 0;
	for (a of each(this.loc)) {
		if (rt.op(f, "IsType", [], [a, this.dispense_type])) {
			f.dot++;
		}
	}
	return f.dot;
});

// droneDispenser.dm:235
rt.def("/obj/machinery/droneDispenser/proc/update_icon", function update_icon(f: Frame) {
	if (rt.bitAnd(this.stat, 3)) {
		this.icon_state = this.icon_off;
	} else if (this.mode == "recharging") {
		this.icon_state = this.icon_recharging;
	} else if (this.mode == "production") {
		this.icon_state = this.icon_creating;
	} else {
		this.icon_state = this.icon_on;
	}
	return f.dot;
});

// droneDispenser.dm:245
rt.def("/obj/machinery/droneDispenser/proc/attackby", function* attackby(f: Frame, O: Value, user: Value) {
	let sheets: Value = null, used: Value = null, WT: Value = null;
	if (rt.istype(O, T("/obj/item/stack"))) {
		if (!rt.index(O.materials, "$metal") && !rt.index(O.materials, "$glass")) {
			return (yield* parent_proc());
		}
		if (!this.metal_cost && !this.glass_cost) {
			to_chat(user, `<span class='warning'>There isn't a place to insert ${O}!</span>`);
			return f.dot;
		}
		sheets = O;
		if (!user.canUnEquip(sheets)) {
			to_chat(user, `<span class='warning'>${O} is stuck to your hand, you can't get it off!</span>`);
			return f.dot;
		}
		if (used = (yield* this.materials.insert_stack(sheets, sheets.amount))) {
			to_chat(user, `<span class='notice'>You insert ${used} sheet${used > 1 ? "s" : ""} into ${this}.</span>`);
		} else {
			to_chat(user, `<span class='warning'>The ${this} isn't accepting the ${sheets}.</span>`);
		}
	} else if (rt.istype(O, T("/obj/item/weapon/crowbar"))) {
		yield* this.materials.retrieve_all();
		playsound(this.loc, O.usesound, 50, 1);
		to_chat(user, `<span class='notice'>You retrieve the materials from ${this}.</span>`);
	} else if (rt.istype(O, T("/obj/item/weapon/weldingtool"))) {
		if (!rt.bitAnd(this.stat, 1)) {
			to_chat(user, `<span class='warning'>${this} doesn't need repairs.</span>`);
			return f.dot;
		}
		if (!(WT = O).isOn()) {
			return f.dot;
		}
		if (WT.get_fuel() < 1) {
			to_chat(user, "<span class='warning'>You need more fuel to complete this task!</span>");
			return f.dot;
		}
		playsound(this, WT.usesound, 50, 1);
		user.visible_message(`<span class='notice'>${user} begins patching up ${this} with ${WT}.</span>`, `<span class='notice'>You begin restoring the damage to ${this}...</span>`);
		if (!(yield* do_after(user, 40 * O.toolspeed, { target: this }))) {
			return f.dot;
		}
		if (!this || !(yield* WT.remove_fuel(1, user))) {
			return f.dot;
		}
		user.visible_message(`<span class='notice'>${user} fixes ${this}!</span>`, `<span class='notice'>You restore ${this} to operation.</span>`);
		(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
		this.obj_integrity = this.max_integrity;
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// droneDispenser.dm:305
rt.def("/obj/machinery/droneDispenser/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (rt.bitAnd(this.flags, NODECONSTRUCT)) return f.dot;
	if (rt.bitAnd(this.stat, 1)) return f.dot;
	if (this.break_message) {
		this.audible_message(`<span class='warning'>${this} ${this.break_message}</span>`);
	}
	if (this.break_sound) {
		playsound(this, this.break_sound, 50, 1);
	}
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.update_icon();
	return f.dot;
});

// droneDispenser.dm:316
rt.def("/obj/machinery/droneDispenser/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 5);
	}
	yield* qdel(this);
	return f.dot;
}, true);
