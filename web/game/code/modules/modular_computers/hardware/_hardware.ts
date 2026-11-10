// Based on /tg/station's code/modules/modular_computers/hardware/_hardware.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7578, "/obj/item/weapon/computer_hardware", "/obj/item/weapon", {
	holder: null,
	power_usage: 0,
	enabled: 1,
	critical: 0,
	can_install: 1,
	damage: 0,
	max_damage: 100,
	damage_malfunction: 20,
	damage_failure: 50,
	malfunction_probability: 10,
	device_type: null,
	name: "hardware",
	desc: "Unknown Hardware.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "std_mod",
	w_class: 1,
});

// _hardware.dm:24
rt.def("/obj/item/weapon/computer_hardware/proc/New", function* New(f: Frame, L: Value) {
	yield* parent_proc();
	this.pixel_x = rand(-8, 8);
	this.pixel_y = rand(-8, 8);
	return f.dot;
}, true);

// _hardware.dm:30
rt.def("/obj/item/weapon/computer_hardware/proc/Destroy", function* Destroy(f: Frame) {
	if (this.holder) {
		yield* this.holder.uninstall_component(this);
	}
	return (yield* parent_proc());
}, true);

// _hardware.dm:36
rt.def("/obj/item/weapon/computer_hardware/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	let S: Value = null;
	if (rt.istype(I, T("/obj/item/device/multitool"))) {
		to_chat(user, "***** DIAGNOSTICS REPORT *****");
		this.diagnostics(user);
		to_chat(user, "******************************");
		return 1;
	}
	if (rt.istype(I, T("/obj/item/stack/cable_coil"))) {
		S = I;
		if (this.obj_integrity == this.max_integrity) {
			to_chat(user, fmt("<span class='warning'>＄！ doesn't seem to require repairs.</span>", [this]));
			return 1;
		}
		if (yield* S.use(1)) {
			to_chat(user, fmt("<span class='notice'>You patch up ％！ with a bit of ％！.</span>", [this, I]));
			this.obj_integrity = min(this.obj_integrity + 10, this.max_integrity);
		}
		return 1;
	}
	if (yield* this.try_insert(I, user)) {
		return 1;
	}
	return (yield* parent_proc());
}, true);

// _hardware.dm:60
rt.def("/obj/item/weapon/computer_hardware/proc/diagnostics", function diagnostics(f: Frame, user: Value) {
	let $3: any;
	let $0: any = user;
	let $1: any = this.damage;
	let $2: any = this.max_damage;
	if (this.damage > this.damage_failure) {
		$3 = "FAIL";
	} else if (this.damage > this.damage_malfunction) {
		$3 = "WARN";
	} else {
		$3 = "PASS";
	}
	to_chat($0, `Hardware Integrity Test... (Corruption: ${$1}/${$2}) ${$3}`);
	return f.dot;
});

// _hardware.dm:64
rt.def("/obj/item/weapon/computer_hardware/proc/check_functionality", function check_functionality(f: Frame) {
	if (!this.enabled) {
		return 0;
	}
	if (this.damage > this.damage_failure) {
		return 0;
	}
	if (this.damage > this.damage_malfunction) {
		if (prob(this.malfunction_probability)) {
			return 0;
		}
	}
	return 1;
});

// _hardware.dm:77
rt.def("/obj/item/weapon/computer_hardware/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	if (this.damage > this.damage_failure) {
		to_chat(user, "<span class='danger'>It seems to be severely damaged!</span>");
	} else if (this.damage > this.damage_malfunction) {
		to_chat(user, "<span class='warning'>It seems to be damaged!</span>");
	} else {
		if (!this.damage) return f.dot;
		to_chat(user, "<span class='notice'>It seems to be slightly damaged.</span>");
	}
	return f.dot;
}, false);

// _hardware.dm:95
rt.def("/obj/item/weapon/computer_hardware/proc/on_remove", function* on_remove(f: Frame, M: Value, user: Value) {
	yield* this.try_eject({ forced: 1 });
	return f.dot;
}, true);
