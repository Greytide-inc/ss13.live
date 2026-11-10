// Based on /tg/station's code/modules/projectiles/guns/energy.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5131, "/obj/item/weapon/gun/energy", "/obj/item/weapon/gun", {
	cell: null,
	modifystate: 0,
	select: 1,
	can_charge: 1,
	automatic_charge_overlays: 1,
	charge_sections: 4,
	shaded_charge: 0,
	selfcharge: 0,
	charge_tick: 0,
	charge_delay: 4,
	use_cyborg_cell: 0,
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell"),
	ammo_type: null,
	icon_state: "energy",
	name: "energy gun",
	desc: "A basic energy-based gun.",
	icon: rt.rsc("icons/obj/guns/energy.dmi"),
	ammo_x_offset: 2,
});

// energy.dm:10
rt.def("/obj/item/weapon/gun/energy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy"));
	return f.dot;
});

// energy.dm:23
rt.def("/obj/item/weapon/gun/energy/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.cell.use(round(this.cell.charge / severity));
	this.chambered = null;
	yield* this.recharge_newshot();
	yield* this.update_icon();
	return f.dot;
}, true);

// energy.dm:32
rt.def("/obj/item/weapon/gun/energy/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.cell_type) {
		this.cell = (yield* new_(this.cell_type, this));
	} else {
		this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell"), this));
	}
	yield* this.cell.give(this.cell.maxcharge);
	yield* this.update_ammo_types();
	yield* this.recharge_newshot(1);
	if (this.selfcharge) {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// energy.dm:46
rt.def("/obj/item/weapon/gun/energy/proc/update_ammo_types", function* update_ammo_types(f: Frame) {
	let shot: Value = null, shottype: Value = null;
	let i: Value = 1;
	while (i <= rt.len(f, this.ammo_type)) {
		shottype = rt.index(this.ammo_type, i);
		shot = (yield* new_(shottype, this));
		rt.setAt(this.ammo_type, i, shot);
		i++;
	}
	this.fire_sound = (shot = rt.index(this.ammo_type, this.select)).fire_sound;
	this.fire_delay = shot.delay;
	return f.dot;
}, true);

// energy.dm:55
rt.def("/obj/item/weapon/gun/energy/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.cell);
	this.cell = null;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// energy.dm:61
rt.def("/obj/item/weapon/gun/energy/proc/process", function* process(f: Frame) {
	if (!this.selfcharge) return f.dot;
	this.charge_tick++;
	if (this.charge_tick < this.charge_delay) {
		return f.dot;
	}
	this.charge_tick = 0;
	if (!this.cell) {
		return f.dot;
	}
	yield* this.cell.give(100);
	if (!this.chambered) {
		yield* this.recharge_newshot(1);
	}
	yield* this.update_icon();
	return f.dot;
}, true, { waitfor: false });

// energy.dm:73
rt.def("/obj/item/weapon/gun/energy/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!(rt.len(f, this.ammo_type) > 1)) return f.dot;
	yield* this.select_fire(user);
	yield* this.update_icon();
	return f.dot;
}, true);

// energy.dm:78
rt.def("/obj/item/weapon/gun/energy/proc/can_shoot", function can_shoot(f: Frame) {
	let shot: Value = rt.index(this.ammo_type, this.select);
	return (this.cell.charge >= shot.e_cost ? 1 : 0);
});

// energy.dm:82
rt.def("/obj/item/weapon/gun/energy/proc/recharge_newshot", function* recharge_newshot(f: Frame, no_cyborg_drain: Value) {
	let R: Value = null, shot: Value = null;
	if (!this.ammo_type || !this.cell) {
		return f.dot;
	}
	if (this.use_cyborg_cell && !no_cyborg_drain) {
		if (rt.istype(this.loc, T("/mob/living/silicon/robot"))) {
			if ((R = this.loc).cell) {
				shot = rt.index(this.ammo_type, this.select);
				if (yield* R.cell.use(shot.e_cost)) {
					yield* this.cell.give(shot.e_cost);
				}
			}
		}
	}
	if (this.chambered) return f.dot;
	let AC: Value = rt.index(this.ammo_type, this.select);
	if (!(this.cell.charge >= AC.e_cost)) return f.dot;
	this.chambered = AC;
	if (this.chambered.BB) return f.dot;
	yield* this.chambered.newshot();
	return f.dot;
}, true);

// energy.dm:99
rt.def("/obj/item/weapon/gun/energy/proc/process_chamber", function* process_chamber(f: Frame) {
	let shot: Value = null;
	if (this.chambered && !this.chambered.BB) {
		shot = this.chambered;
		yield* this.cell.use(shot.e_cost);
	}
	this.chambered = null;
	yield* this.recharge_newshot();
	return f.dot;
}, true);

// energy.dm:106
rt.def("/obj/item/weapon/gun/energy/proc/select_fire", function* select_fire(f: Frame, user: Value) {
	let shot: Value = null;
	this.select++;
	if (this.select > rt.len(f, this.ammo_type)) {
		this.select = 1;
	}
	this.fire_sound = (shot = rt.index(this.ammo_type, this.select)).fire_sound;
	this.fire_delay = shot.delay;
	if (shot.select_name) {
		to_chat(user, `<span class='notice'>${this} is now set to ${shot.select_name}.</span>`);
	}
	this.chambered = null;
	yield* this.recharge_newshot(1);
	yield* this.update_icon();
	return f.dot;
}, true);

// energy.dm:120
rt.def("/obj/item/weapon/gun/energy/proc/update_icon", function update_icon(f: Frame) {
	let itemState: Value = null, charge_overlay: Value = null, i: Value = null;
	parent_proc();
	if (!this.automatic_charge_overlays) {
		return f.dot;
	}
	let ratio: Value = Ceiling(this.cell.charge / this.cell.maxcharge * this.charge_sections);
	let shot: Value = rt.index(this.ammo_type, this.select);
	let iconState: Value = `${this.icon_state}_charge`;
	if (!rt.initial(f, this, "item_state")) {
		itemState = this.icon_state;
	}
	if (this.modifystate) {
		this.add_overlay(`${this.icon_state}_${shot.select_name}`);
		iconState += `_${shot.select_name}`;
		if (itemState) {
			itemState += `${shot.select_name}`;
		}
	}
	if (this.cell.charge < shot.e_cost) {
		this.add_overlay(`${this.icon_state}_empty`);
	} else if (!this.shaded_charge) {
		charge_overlay = mutable_appearance(this.icon, iconState);
		i = ratio;
		while (i >= 1) {
			charge_overlay.pixel_x = this.ammo_x_offset * (i - 1);
			charge_overlay.pixel_y = this.ammo_y_offset * (i - 1);
			this.add_overlay(charge_overlay);
			i--;
		}
	} else {
		this.add_overlay(`${this.icon_state}_charge${ratio}`);
	}
	if (!itemState) return f.dot;
	this.item_state = (itemState += `${ratio}`);
	return f.dot;
});

// energy.dm:150
rt.def("/obj/item/weapon/gun/energy/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* this.toggle_gunlight();
	return f.dot;
}, true);

// energy.dm:153
rt.def("/obj/item/weapon/gun/energy/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let shot: Value = null;
	if (this.can_shoot() && (yield* this.can_trigger_gun(user))) {
		user.visible_message(`<span class='suicide'>${user} is putting the barrel of ${this} in ${user.p_their()} mouth.  It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
		yield* sleep(25);
		if (user.is_holding(this)) {
			user.visible_message(`<span class='suicide'>${user} melts ${user.p_their()} face off with ${this}!</span>`);
			playsound(this.loc, this.fire_sound, 50, 1, -1);
			shot = rt.index(this.ammo_type, this.select);
			yield* this.cell.use(shot.e_cost);
			yield* this.update_icon();
			return 2;
		} else {
			user.visible_message(`<span class='suicide'>${user} panics and starts choking to death!</span>`);
			return 8;
		}
	} else {
		user.visible_message(`<span class='suicide'>${user} is pretending to blow ${user.p_their()} brains out with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</b></span>`);
		playsound(this.loc, rt.rsc("sound/weapons/empty.ogg"), 50, 1, -1);
		return 8;
	}
}, true);

// energy.dm:173
rt.def("/obj/item/weapon/gun/energy/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	if (var_name === "selfcharge") {
		if (var_value) {
			if (!this.isprocessing) {
				this.isprocessing = 1;
				GLOB.SSobj.processing += this;
			}
		} else {
			this.isprocessing = 0;
			GLOB.SSobj.processing -= this;
		}
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// energy.dm:183
rt.def("/obj/item/weapon/gun/energy/proc/ignition_effect", function* ignition_effect(f: Frame, A: Value, user: Value) {
	let E: Value = null, BB: Value = null;
	if (!this.can_shoot() || !rt.index(this.ammo_type, this.select)) {
		this.shoot_with_empty_chamber();
		f.dot = "";
	} else {
		E = rt.index(this.ammo_type, this.select);
		if (!(BB = E.BB)) {
			f.dot = "";
		} else if (BB.nodamage || !BB.damage || BB.damage_type == "stamina") {
			user.visible_message(`<span class='danger'>${user} tries to light their ${A.name} with ${this}, but it doesn't do anything. Dumbass.</span>`);
			playsound(user, E.fire_sound, 50, 1);
			playsound(user, BB.hitsound, 50, 1);
			yield* this.cell.use(E.e_cost);
			f.dot = "";
		} else if (BB.damage_type != "fire") {
			user.visible_message(`<span class='danger'>${user} tries to light their ${A.name} with ${this}, but only succeeds in utterly destroying it. Dumbass.</span>`);
			playsound(user, E.fire_sound, 50, 1);
			playsound(user, BB.hitsound, 50, 1);
			yield* this.cell.use(E.e_cost);
			yield* qdel(A);
			f.dot = "";
		} else {
			playsound(user, E.fire_sound, 50, 1);
			playsound(user, BB.hitsound, 50, 1);
			yield* this.cell.use(E.e_cost);
			f.dot = `<span class='danger'>${user} casually lights their ${A.name} with ${this}. Damn.</span>`;
		}
	}
	return f.dot;
}, true);
