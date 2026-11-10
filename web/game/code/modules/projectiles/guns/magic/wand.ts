// Based on /tg/station's code/modules/projectiles/guns/magic/wand.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5113, "/obj/item/weapon/gun/magic/wand", "/obj/item/weapon/gun/magic", {
	variable_charges: 1,
	name: "wand of nothing",
	desc: "It's not just a stick, it's a MAGIC stick!",
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic"),
	icon_state: "nothingwand",
	item_state: "wand",
	w_class: 2,
	can_charge: 0,
	max_charges: 100,
});

// wand.dm:13
rt.def("/obj/item/weapon/gun/magic/wand/proc/Initialize", function* Initialize(f: Frame) {
	if (prob(75) && this.variable_charges) {
		if (prob(33)) {
			this.max_charges = Ceiling(this.max_charges / 3);
		} else {
			this.max_charges = Ceiling(this.max_charges / 2);
		}
	}
	return (yield* parent_proc());
}, true);

// wand.dm:21
rt.def("/obj/item/weapon/gun/magic/wand/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, fmt("Has ＀ charge５ remaining.", [this.charges]));
	return f.dot;
}, false);

// wand.dm:25
rt.def("/obj/item/weapon/gun/magic/wand/proc/update_icon", function update_icon(f: Frame) {
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.charges ? "" : "-drained"}`;
	return f.dot;
});

// wand.dm:28
rt.def("/obj/item/weapon/gun/magic/wand/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	if (target == user) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// wand.dm:33
rt.def("/obj/item/weapon/gun/magic/wand/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value) {
	let A: Value = null;
	if (!this.charges) {
		this.shoot_with_empty_chamber(user);
		return f.dot;
	}
	if (target == user) {
		if (this.no_den_usage) {
			if (rt.istype((A = get_area(user)), T("/area/wizard_station"))) {
				to_chat(user, `<span class='warning'>You know better than to violate the security of The Den, best wait until you leave to use ${this}.<span>`);
				return f.dot;
			} else {
				this.no_den_usage = 0;
			}
		}
		yield* this.zap_self(user);
	} else {
		yield* parent_proc();
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// wand.dm:51
rt.def("/obj/item/weapon/gun/magic/wand/proc/zap_self", function zap_self(f: Frame, user: Value) {
	user.visible_message(`<span class='danger'>${user} zaps ${user.p_them()}self with ${this}.</span>`);
	playsound(user, this.fire_sound, 50, 1);
	user.log_message(`zapped ${user.p_them()}self with a <b>${this}</b>`, "Attack log");
	return f.dot;
});

rt.type(5118, "/obj/item/weapon/gun/magic/wand/death", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of death",
	desc: "This deadly wand overwhelms the victim's body with pure energy, slaying them without fail.",
	fire_sound: rt.rsc("sound/magic/wandodeath.ogg"),
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/death"),
	icon_state: "deathwand",
	max_charges: 3,
});

// wand.dm:69
rt.def("/obj/item/weapon/gun/magic/wand/death/proc/zap_self", function* zap_self(f: Frame, user: Value) {
	yield* parent_proc();
	to_chat(user, `<span class='warning'>You irradiate yourself with pure energy! ${pick("Do not pass go. Do not collect 200 zorkmids.", "You feel more confident in your spell casting skills.", "You Die...", "Do you want your possessions identified?")}</span>`);
	yield* user.adjustOxyLoss(500);
	this.charges--;
	return f.dot;
}, true);

rt.type(5116, "/obj/item/weapon/gun/magic/wand/resurrection", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of healing",
	desc: "This wand uses healing magics to heal and revive. They are rarely utilized within the Wizard Federation for some reason.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/heal"),
	fire_sound: rt.rsc("sound/magic/staff_healing.ogg"),
	icon_state: "revivewand",
	max_charges: 10,
});

// wand.dm:90
rt.def("/obj/item/weapon/gun/magic/wand/resurrection/proc/zap_self", function* zap_self(f: Frame, user: Value) {
	let C: Value = null;
	yield* user.revive({ full_heal: 1 });
	if (rt.istype(user, T("/mob/living/carbon"))) {
		yield* (C = user).regenerate_limbs();
		yield* C.regenerate_organs();
	}
	to_chat(user, "<span class='notice'>You feel great!</span>");
	this.charges--;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5119, "/obj/item/weapon/gun/magic/wand/polymorph", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of polymorph",
	desc: "This wand is attuned to chaos and will radically alter the victim's form.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/change"),
	icon_state: "polywand",
	fire_sound: rt.rsc("sound/magic/staff_change.ogg"),
	max_charges: 10,
});

// wand.dm:112
rt.def("/obj/item/weapon/gun/magic/wand/polymorph/proc/zap_self", function* zap_self(f: Frame, user: Value) {
	yield* parent_proc();
	yield* wabbajack(user);
	this.charges--;
	return f.dot;
}, true);

rt.type(5120, "/obj/item/weapon/gun/magic/wand/teleport", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of teleportation",
	desc: "This wand will wrench targets through space and time to move them somewhere else.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/teleport"),
	fire_sound: rt.rsc("sound/magic/wand_teleport.ogg"),
	icon_state: "telewand",
	max_charges: 10,
	no_den_usage: 1,
});

// wand.dm:130
rt.def("/obj/item/weapon/gun/magic/wand/teleport/proc/zap_self", function* zap_self(f: Frame, user: Value) {
	let smoke: Value = null;
	if (yield* do_teleport(user, user, 10)) {
		yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(3, user.loc);
		yield* smoke.start();
		this.charges--;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5121, "/obj/item/weapon/gun/magic/wand/door", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of door creation",
	desc: "This particular wand can create doors in any wall for the unscrupulous wizard who shuns teleportation magics.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/door"),
	icon_state: "doorwand",
	fire_sound: rt.rsc("sound/magic/staff_door.ogg"),
	max_charges: 20,
	no_den_usage: 1,
});

// wand.dm:151
rt.def("/obj/item/weapon/gun/magic/wand/door/proc/zap_self", function zap_self(f: Frame, user: Value) {
	to_chat(user, "<span class='notice'>You feel vaguely more open with your feelings.</span>");
	this.charges--;
	parent_proc();
	return f.dot;
}, false);

rt.type(5114, "/obj/item/weapon/gun/magic/wand/fireball", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of fireball",
	desc: "This wand shoots scorching balls of fire that explode into destructive flames.",
	fire_sound: rt.rsc("sound/magic/fireball.ogg"),
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/fireball"),
	icon_state: "firewand",
	max_charges: 8,
});

// wand.dm:168
rt.def("/obj/item/weapon/gun/magic/wand/fireball/proc/zap_self", function zap_self(f: Frame, user: Value) {
	parent_proc();
	explosion(user.loc, -1, 0, 2, 3, 0, { flame_range: 2 });
	this.charges--;
	return f.dot;
}, false);
