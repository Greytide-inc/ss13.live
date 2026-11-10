// Based on /tg/station's code/game/objects/items/devices/laserpointer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9254, "/obj/item/device/laser_pointer", "/obj/item/device", {
	pointer_icon_state: null,
	pointer_loc: null,
	energy: 5,
	max_energy: 5,
	effectchance: 33,
	recharging: 0,
	recharge_locked: 0,
	diode: null,
	flags: 68,
	name: "laser pointer",
	desc: "Don't shine it in your eyes!",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "pointer",
	item_state: "pen",
	slot_flags: 512,
	materials: null,
	w_class: 2,
	origin_tech: "combat=1;magnets=2",
});

// laserpointer.dm:10
rt.def("/obj/item/device/laser_pointer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 500, "$glass", 500]);
	return f.dot;
});

// laserpointer.dm:32
rt.def("/obj/item/device/laser_pointer/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.diode = (yield* new_(T("/obj/item/weapon/stock_parts/micro_laser"), this));
	if (this.pointer_icon_state) return f.dot;
	this.pointer_icon_state = pick("red_laser", "green_laser", "blue_laser", "purple_laser");
	return f.dot;
}, true);

rt.type(9259, "/obj/item/device/laser_pointer/upgraded", "/obj/item/device/laser_pointer", {});

// laserpointer.dm:38
rt.def("/obj/item/device/laser_pointer/upgraded/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.diode = (yield* new_(T("/obj/item/weapon/stock_parts/micro_laser/ultra")));
	return f.dot;
}, true);

// laserpointer.dm:42
rt.def("/obj/item/device/laser_pointer/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		if (!this.diode) {
			if (!(yield* user.transferItemToLoc(W, this))) {
				return f.dot;
			}
			this.diode = W;
			to_chat(user, `<span class='notice'>You install a ${this.diode.name} in ${this}.</span>`);
		} else {
			to_chat(user, `<span class='notice'>${this} already has a diode installed.</span>`);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.diode) {
			to_chat(user, fmt("<span class='notice'>You remove the ＀ from ％！.</span>", [this.diode.name, this]));
			this.diode.loc = rt.getStep(f, this.loc, 0);
			this.diode = null;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// laserpointer.dm:60
rt.def("/obj/item/device/laser_pointer/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	yield* this.laser_act(target, user, params);
	return f.dot;
}, true);

// laserpointer.dm:63
rt.def("/obj/item/device/laser_pointer/proc/laser_act", function* laser_act(f: Frame, target: Value, user: Value, params: Value) {
	let H: Value = null, outmsg: Value = null, C: Value = null, severity: Value = null, S: Value = null, click_params: Value = null;
	if (!rt.isIn(f, user, viewers(7, target))) {
		return f.dot;
	}
	if (!this.diode) {
		to_chat(user, `<span class='notice'>You point ${this} at ${target}, but nothing happens!</span>`);
		return f.dot;
	}
	if (!user.IsAdvancedToolUser()) {
		to_chat(user, "<span class='warning'>You don't have the dexterity to do this!</span>");
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if ((H = user).dna.check_mutation("Hulk") || rt.isIn(f, NOGUNS, H.dna.species.species_traits)) {
			to_chat(user, "<span class='warning'>Your fingers can't press the button!</span>");
			return f.dot;
		}
	}
	yield* this.add_fingerprint(user);
	if (this.recharge_locked) {
		to_chat(user, `<span class='notice'>You point ${this} at ${target}, but it's still charging.</span>`);
		return f.dot;
	}
	let targloc: Value = rt.getStep(f, target, 0);
	if (rt.istype(target, T("/mob/living/carbon"))) {
		C = target;
		if (user.zone_selected == "eyes") {
			add_logs(user, C, "shone in the eyes", this);
			severity = 1;
			if (prob(33)) {
				severity = 2;
			} else if (prob(50)) {
				severity = 0;
			}
			if (prob(this.effectchance * this.diode.rating) && (yield* C.flash_act(severity))) {
				outmsg = `<span class='notice'>You blind ${C} by shining ${this} in their eyes.</span>`;
			} else {
				outmsg = `<span class='warning'>You fail to blind ${C} by shining ${this} at their eyes!</span>`;
			}
		}
	} else if (rt.istype(target, T("/mob/living/silicon/robot"))) {
		S = target;
		if (prob(this.effectchance * this.diode.rating)) {
			yield* S.flash_act({ affect_silicon: 1 });
			yield* S.Knockdown(rand(100, 200));
			to_chat(S, "<span class='danger'>Your sensors were overloaded by a laser!</span>");
			outmsg = `<span class='notice'>You overload ${S} by shining ${this} at their sensors.</span>`;
			add_logs(user, S, "shone in the sensors", this);
		} else {
			outmsg = `<span class='warning'>You fail to overload ${S} by shining ${this} at their sensors!</span>`;
		}
	} else if (rt.istype(target, T("/obj/machinery/camera"))) {
		C = target;
		if (prob(this.effectchance * this.diode.rating)) {
			yield* C.emp_act(1);
			outmsg = `<span class='notice'>You hit the lens of ${C} with ${this}, temporarily disabling the camera!</span>`;
			add_logs(user, C, "EMPed", this);
		} else {
			outmsg = `<span class='warning'>You miss the lens of ${C} with ${this}!</span>`;
		}
	}
	this.icon_state = `pointer_${this.pointer_icon_state}`;
	let I: Value = image(rt.rsc("icons/obj/projectiles.dmi"), targloc, this.pointer_icon_state, 10);
	if (click_params = params2list(params)) {
		if (rt.at(click_params, "icon-x")) {
			I.pixel_x = text2num(rt.at(click_params, "icon-x")) - 16;
		}
		if (rt.at(click_params, "icon-y")) {
			I.pixel_y = text2num(rt.at(click_params, "icon-y")) - 16;
		}
	} else {
		I.pixel_x = target.pixel_x + rand(-5, 5);
		I.pixel_y = target.pixel_y + rand(-5, 5);
	}
	if (outmsg) {
		to_chat(user, outmsg);
	} else {
		to_chat(user, `<span class='info'>You point ${this} at ${target}.</span>`);
	}
	this.energy -= 1;
	if (this.energy <= this.max_energy) {
		if (!this.recharging) {
			this.recharging = 1;
			if (!this.isprocessing) {
				this.isprocessing = 1;
				GLOB.SSobj.processing += this;
			}
		}
		if (this.energy <= 0) {
			to_chat(user, `<span class='warning'>${this}'s battery is overused, it needs time to recharge!</span>`);
			this.recharge_locked = 1;
		}
	}
	yield* flick_overlay_view(I, targloc, 10);
	this.icon_state = "pointer";
	return f.dot;
}, true);

// laserpointer.dm:159
rt.def("/obj/item/device/laser_pointer/proc/process", function process(f: Frame) {
	if (!prob(20 - this.recharge_locked * 5)) return f.dot;
	if (!((this.energy += 1) >= this.max_energy)) return f.dot;
	this.energy = this.max_energy;
	this.recharging = 0;
	this.recharge_locked = 0;
	parent_proc();
	return f.dot;
}, false, { waitfor: false });
