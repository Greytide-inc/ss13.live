// Based on /tg/station's code/modules/power/antimatter/control.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10327, "/obj/machinery/power/am_control_unit", "/obj/machinery/power", {
	linked_shielding: null,
	linked_cores: null,
	fueljar: null,
	update_shield_icons: 0,
	stability: 100,
	exploding: 0,
	active: 0,
	fuel_injection: 2,
	shield_icon_delay: 0,
	reported_core_efficiency: 0,
	power_cycle: 0,
	power_cycle_delay: 4,
	stored_core_stability: 0,
	stored_core_stability_delay: 0,
	stored_power: 0,
	anchored: 0,
	name: "antimatter control unit",
	desc: "This device injects antimatter into connected shielding units, the more antimatter injected the more power produced.  Wrench the device to set it up.",
	icon: rt.rsc("icons/obj/machines/antimatter.dmi"),
	icon_state: "control",
	density: 1,
	use_power: 1,
	idle_power_usage: 100,
	active_power_usage: 1000,
});

// control.dm:33
rt.def("/obj/machinery/power/am_control_unit/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.linked_shielding = list();
	this.linked_cores = list();
	return f.dot;
}, true);

// control.dm:39
rt.def("/obj/machinery/power/am_control_unit/proc/Destroy", function* Destroy(f: Frame) {
	let AMS: Value = null;
	for (AMS of each(this.linked_shielding, T("/obj/machinery/am_shielding"))) {
		AMS.control_unit = null;
		yield* qdel(AMS);
	}
	yield* qdel(this.fueljar);
	this.fueljar = null;
	return (yield* parent_proc());
}, true);

// control.dm:49
rt.def("/obj/machinery/power/am_control_unit/proc/process", function* process(f: Frame) {
	if (this.exploding) {
		yield* explosion(rt.getStep(f, this, 0), 8, 12, 18, 12);
		if (this) {
			yield* qdel(this);
		}
	}
	if (this.update_shield_icons && !this.shield_icon_delay) {
		this.check_shield_icons();
		this.update_shield_icons = 0;
	}
	if (rt.bitAnd(this.stat, 3) || !this.active) {
		return f.dot;
	}
	if (!this.fueljar) {
		yield* this.toggle_power();
		playsound(this.loc, rt.rsc("sound/machines/buzz-two.ogg"), 50, 0);
		return f.dot;
	}
	this.add_avail(this.stored_power);
	this.power_cycle++;
	if (this.power_cycle >= this.power_cycle_delay) {
		yield* this.produce_power();
		this.power_cycle = 0;
	}
	return f.dot;
}, true, { waitfor: false });

// control.dm:76
rt.def("/obj/machinery/power/am_control_unit/proc/produce_power", function* produce_power(f: Frame) {
	let core_power: Value = null, fuel: Value = null, AMS: Value = null;
	playsound(this.loc, rt.rsc("sound/effects/bang.ogg"), 25, 1);
	if ((core_power = this.reported_core_efficiency) <= 0) {
		return 0;
	}
	let core_damage: Value = 0;
	this.stored_power = (fuel = this.fueljar.usefuel(this.fuel_injection)) / core_power * fuel * 200000;
	if (fuel > 2 * core_power) {
		if (prob(50)) {
			core_damage = 1;
		}
		if (fuel - core_power > 5) {
			core_damage = 5;
		}
		if (fuel - core_power > 10) {
			core_damage = 20;
		}
		if (core_damage == 0) {
			return f.dot;
		}
		for (AMS of each(this.linked_cores, T("/obj/machinery/am_shielding"))) {
			AMS.stability -= core_damage;
			yield* AMS.check_stability(1);
		}
		playsound(this.loc, rt.rsc("sound/effects/bang.ogg"), 50, 1);
	}
	return f.dot;
}, true);

// control.dm:102
rt.def("/obj/machinery/power/am_control_unit/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (severity === 1) {
		if (this.active) {
			yield* this.toggle_power();
		}
		this.stability -= rand(15, 30);
	} else if (severity === 2) {
		if (this.active) {
			yield* this.toggle_power();
		}
		this.stability -= rand(10, 20);
	}
	yield* parent_proc();
	return 0;
}, true);

// control.dm:116
rt.def("/obj/machinery/power/am_control_unit/proc/blob_act", function* blob_act(f: Frame) {
	let AMS: Value = null;
	this.stability -= 20;
	if (prob(100 - this.stability)) {
		for (AMS of each(this.linked_shielding, T("/obj/machinery/am_shielding"))) {
			yield* AMS.blob_act();
		}
		yield* qdel(this);
		return f.dot;
	}
	yield* this.check_stability();
	return f.dot;
}, true);

// control.dm:127
rt.def("/obj/machinery/power/am_control_unit/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	this.stability -= 80 - severity * 20;
	yield* this.check_stability();
	return f.dot;
}, true, { waitfor: false });

// control.dm:133
rt.def("/obj/machinery/power/am_control_unit/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	f.dot = (yield* parent_proc());
	if (Proj.flag == "bullet") return f.dot;
	this.stability -= Proj.force;
	yield* this.check_stability();
	return f.dot;
}, true);

// control.dm:140
rt.def("/obj/machinery/power/am_control_unit/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	if (rt.bitAnd(this.stat, 2)) {
		if (this.active) {
			this.toggle_power(1);
		} else {
			this.use_power = 0;
		}
	} else if (!this.stat && this.anchored) {
		this.use_power = 1;
	}
	return f.dot;
});

// control.dm:155
rt.def("/obj/machinery/power/am_control_unit/proc/update_icon", function update_icon(f: Frame) {
	if (this.active) {
		this.icon_state = "control_on";
	} else {
		this.icon_state = "control";
	}
	return f.dot;
});

// control.dm:161
rt.def("/obj/machinery/power/am_control_unit/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (!this.anchored) {
			playsound(this.loc, W.usesound, 75, 1);
			user.visible_message(`${user.name} secures the ${this.name} to the floor.`, "<span class='notice'>You secure the anchor bolts to the floor.</span>", "<span class='italics'>You hear a ratchet.</span>");
			this.anchored = 1;
			yield* this.connect_to_network();
		} else if ((!rt.len(f, this.linked_shielding) ? 1 : 0) > 0) {
			playsound(this.loc, W.usesound, 75, 1);
			user.visible_message(`${user.name} unsecures the ${this.name}.`, "<span class='notice'>You remove the anchor bolts.</span>", "<span class='italics'>You hear a ratchet.</span>");
			this.anchored = 0;
			yield* this.disconnect_from_network();
		} else {
			to_chat(user, `<span class='warning'>Once bolted and linked to a shielding unit it the ${this.name} is unable to be moved!</span>`);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/am_containment"))) {
		if (this.fueljar) {
			to_chat(user, `<span class='warning'>There is already a ${this.fueljar} inside!</span>`);
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(W, this))) {
			return f.dot;
		}
		this.fueljar = W;
		user.visible_message(`${user.name} loads an ${W.name} into the ${this.name}.`, `<span class='notice'>You load an ${W.name}.</span>`, "<span class='italics'>You hear a thunk.</span>");
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// control.dm:195
rt.def("/obj/machinery/power/am_control_unit/proc/take_damage", function* take_damage(f: Frame, damage: Value, damage_type: Value, sound_effect: Value) {
	damage_type ??= "brute";
	sound_effect ??= 1;
	if (damage_type === "brute") {
		if (sound_effect) {
			if (damage) {
				playsound(this.loc, rt.rsc("sound/weapons/smash.ogg"), 50, 1);
			} else {
				playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
			}
		}
	} else if (damage_type === "fire") {
		if (sound_effect) {
			playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
		}
	} else {
		return f.dot;
	}
	if (!(damage >= 20)) return f.dot;
	this.stability -= damage / 2;
	yield* this.check_stability();
	return f.dot;
}, true);

// control.dm:213
rt.def("/obj/machinery/power/am_control_unit/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.anchored) return f.dot;
	yield* this.interact(user);
	return f.dot;
}, true);

// control.dm:216
rt.def("/obj/machinery/power/am_control_unit/proc/add_shielding", function add_shielding(f: Frame, AMS: Value, AMS_linking: Value) {
	AMS_linking ??= 0;
	if (!rt.istype(AMS, T("/obj/machinery/am_shielding"))) {
		return 0;
	}
	if (!this.anchored) {
		return 0;
	}
	if (!AMS_linking && !AMS.link_control(this)) {
		return 0;
	}
	this.linked_shielding.Add(AMS);
	this.update_shield_icons = 1;
	return 1;
});

// control.dm:228
rt.def("/obj/machinery/power/am_control_unit/proc/remove_shielding", function remove_shielding(f: Frame, AMS: Value) {
	if (!rt.istype(AMS, T("/obj/machinery/am_shielding"))) {
		return 0;
	}
	this.linked_shielding.Remove(AMS);
	this.update_shield_icons = 2;
	if (this.active) {
		this.toggle_power();
	}
	return 1;
});

// control.dm:238
rt.def("/obj/machinery/power/am_control_unit/proc/check_stability", function* check_stability(f: Frame) {
	if (this.stability <= 0) {
		yield* qdel(this);
	}
	return f.dot;
}, true);

// control.dm:244
rt.def("/obj/machinery/power/am_control_unit/proc/toggle_power", function toggle_power(f: Frame, powerfail: Value) {
	powerfail ??= 0;
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		this.use_power = 2;
		this.visible_message(`The ${this.name} starts up.`);
	} else {
		this.use_power = (!powerfail ? 1 : 0);
		this.visible_message(`The ${this.name} shuts down.`);
	}
	this.update_icon();
	return f.dot;
});

// control.dm:259
rt.def("/obj/machinery/power/am_control_unit/proc/check_shield_icons", function check_shield_icons(f: Frame) {
	let AMS: Value = null;
	if (this.shield_icon_delay) {
		return f.dot;
	}
	this.shield_icon_delay = 1;
	if (this.update_shield_icons == 2) {
		for (AMS of each(this.linked_shielding, T("/obj/machinery/am_shielding"))) {
			if (AMS.processing) {
				AMS.shutdown_core();
			}
			AMS.control_unit = null;
			rt.spawnTail(f, 10, "/obj/machinery/power/am_control_unit/proc/check_shield_icons: spawn at modules/power/antimatter/control.dm:264", AMS);
		}
		this.linked_shielding = list();
	} else {
		AMS = null;
		for (AMS of each(this.linked_shielding, T("/obj/machinery/am_shielding"))) {
			AMS.update_icon();
		}
	}
	rt.spawnTail(f, 20, "/obj/machinery/power/am_control_unit/proc/check_shield_icons: spawn at modules/power/antimatter/control.dm:271", AMS);
	return f.dot;
});

// a spawn(20) body of /obj/machinery/power/am_control_unit/proc/check_shield_icons, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/power/am_control_unit/proc/check_shield_icons: spawn at modules/power/antimatter/control.dm:271", function* (f: Frame, AMS: Value) {
	this.shield_icon_delay = 0;
	return null;
});

// a spawn(10) body of /obj/machinery/power/am_control_unit/proc/check_shield_icons, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/power/am_control_unit/proc/check_shield_icons: spawn at modules/power/antimatter/control.dm:264", function* (f: Frame, AMS: Value) {
	yield* AMS.controllerscan();
	return null;
});

// control.dm:277
rt.def("/obj/machinery/power/am_control_unit/proc/check_core_stability", function check_core_stability(f: Frame) {
	let AMS: Value = null;
	if (this.stored_core_stability_delay || rt.len(f, this.linked_cores) <= 0) {
		return f.dot;
	}
	this.stored_core_stability_delay = 1;
	this.stored_core_stability = 0;
	for (AMS of each(this.linked_cores, T("/obj/machinery/am_shielding"))) {
		this.stored_core_stability += AMS.stability;
	}
	this.stored_core_stability /= rt.len(f, this.linked_cores);
	rt.spawnTail(f, 40, "/obj/machinery/power/am_control_unit/proc/check_core_stability: spawn at modules/power/antimatter/control.dm:284", AMS);
	return f.dot;
});

// a spawn(40) body of /obj/machinery/power/am_control_unit/proc/check_core_stability, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/power/am_control_unit/proc/check_core_stability: spawn at modules/power/antimatter/control.dm:284", function* (f: Frame, AMS: Value) {
	this.stored_core_stability_delay = 0;
	return null;
});

// control.dm:290
rt.def("/obj/machinery/power/am_control_unit/proc/interact", function* interact(f: Frame, user: Value) {
	if (get_dist(this, user) > 1 || rt.bitAnd(this.stat, 3)) {
		if (!rt.istype(user, T("/mob/living/silicon/ai"))) {
			yield* user.unset_machine();
			rt.op(f, "Browse", [], [user, null, "window=AMcontrol"], false);
			return f.dot;
		}
	}
	yield* user.set_machine(this);
	let dat: Value = "";
	dat += "AntiMatter Control Panel<BR>";
	dat += fmt("<A href='?src=＃;close=1'>Close</A><BR>", [this]);
	dat += fmt("<A href='?src=＃;refresh=1'>Refresh</A><BR>", [this]);
	dat += fmt("<A href='?src=＃;refreshicons=1'>Force Shielding Update</A><BR><BR>", [this]);
	dat += `Status: ${this.active ? "Injecting" : "Standby"} <BR>`;
	dat += fmt("<A href='?src=＃;togglestatus=1'>Toggle Status</A><BR>", [this]);
	dat += `Stability: ${this.stability}%<BR>`;
	dat += `Reactor parts: ${rt.len(f, this.linked_shielding)}<BR>`;
	dat += `Cores: ${rt.len(f, this.linked_cores)}<BR><BR>`;
	dat += `-Current Efficiency: ${this.reported_core_efficiency}<BR>`;
	dat += fmt("-Average Stability: ＀ <A href='?src=＃;refreshstability=1'>(update)</A><BR>", [this.stored_core_stability, this]);
	dat += `Last Produced: ${this.stored_power}<BR>`;
	dat += "Fuel: ";
	if (!this.fueljar) {
		dat += "<BR>No fuel receptacle detected.";
	} else {
		dat += fmt("<A href='?src=＃;ejectjar=1'>Eject</A><BR>", [this]);
		dat += `- ${this.fueljar.fuel}/${this.fueljar.fuel_max} Units<BR>`;
		dat += `- Injecting: ${this.fuel_injection} units<BR>`;
		dat += fmt("- <A href='?src=＃;strengthdown=1'>--</A>|<A href='?src=＃;strengthup=1'>++</A><BR><BR>", [this, this]);
	}
	rt.op(f, "Browse", [], [user, dat, "window=AMcontrol;size=420x500"], false);
	onclose(user, "AMcontrol");
	return f.dot;
}, true);

// control.dm:329
rt.def("/obj/machinery/power/am_control_unit/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=AMcontrol"], false);
		yield* f.usr.unset_machine();
		return f.dot;
	}
	if (rt.at(href_list, "togglestatus")) {
		yield* this.toggle_power();
	}
	if (rt.at(href_list, "refreshicons")) {
		this.update_shield_icons = 1;
	}
	if (rt.at(href_list, "ejectjar")) {
		if (this.fueljar) {
			this.fueljar.loc = this.loc;
			this.fueljar = null;
		}
	}
	if (rt.at(href_list, "strengthup")) {
		this.fuel_injection++;
	}
	if (rt.at(href_list, "strengthdown")) {
		this.fuel_injection--;
		if (this.fuel_injection < 0) {
			this.fuel_injection = 0;
		}
	}
	if (rt.at(href_list, "refreshstability")) {
		this.check_core_stability();
	}
	yield* this.updateDialog();
	return f.dot;
}, true);
