// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/types/dextrous.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4875, "/mob/living/simple_animal/hostile/guardian/dextrous", "/mob/living/simple_animal/hostile/guardian", {
	internal_storage: null,
	playstyle_string: "<span class='holoparasite'>As a <b>dextrous</b> type you can hold items, store an item within yourself, and have medium damage resistance, but do low damage on attacks. Recalling and leashing will force you to drop unstored items!</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Drone, a dextrous master of construction and repair.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Dextrous combat modules loaded. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! You caught one! It can hold stuff in its fins, sort of.</span>",
	melee_damage_lower: 10,
	melee_damage_upper: 10,
	damage_coeff: null,
	dextrous: 1,
	environment_target_typecache: null,
});

// dextrous.dm:5
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.damage_coeff = rt.alist(f, ["brute", 0.75, "fire", 0.75, "tox", 0.75, "clone", 0.75, "stamina", 0, "oxy", 0.75]);

	this.environment_target_typecache = list(T("/obj/machinery/door/window"), T("/obj/structure/window"), T("/obj/structure/closet"), T("/obj/structure/table"), T("/obj/structure/grille"), T("/obj/structure/rack"), T("/obj/structure/barricade"), T("/obj/machinery/camera"));
	return f.dot;
});

// dextrous.dm:23
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/death", function* death(f: Frame, gibbed: Value) {
	yield* parent_proc();
	if (!this.internal_storage) return f.dot;
	yield* this.dropItemToGround(this.internal_storage);
	return f.dot;
}, true);

// dextrous.dm:29
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/examine", function examine(f: Frame, user: Value) {
	let msg: Value = null, I: Value = null;
	let $0: any, $1: any, $e: any;
	if (this.dextrous) {
		msg = fmt("<span class='info'>*---------*\nThis is ＀ ＇<b>！</b>!\n", [bicon(this), this]);
		msg += `${this.desc}\n`;
		for (I of each(this.held_items, T("/obj/item"))) {
			if (!rt.bitAnd(I.flags, ABSTRACT)) {
				if (I.blood_DNA) {
					$0 = bicon(I);
					if (I.gender == "plural") {
						$1 = "some";
					} else {
						$1 = "a";
					}
					msg += `<span class='warning'>It has ${$0} ${$1} blood-stained ${I.name} in its ${this.get_held_index_name(this.get_held_index_of_item(I))}!</span>\n`;
				} else {
					msg += fmt("It has ＀ ＇！ in its ＀.\n", [bicon(I), I, this.get_held_index_name(this.get_held_index_of_item(I))]);
				}
			}
		}
		if (this.internal_storage && !rt.bitAnd(this.internal_storage.flags, ABSTRACT)) {
			if (this.internal_storage.blood_DNA) {
				$0 = bicon(this.internal_storage);
				if (this.internal_storage.gender == "plural") {
					$1 = "some";
				} else {
					$1 = "a";
				}
				msg += `<span class='warning'>It is holding ${$0} ${$1} blood-stained ${this.internal_storage.name} in its internal storage!</span>\n`;
			} else {
				msg += fmt("It is holding ＀ ＇！ in its internal storage.\n", [bicon(this.internal_storage), this.internal_storage]);
			}
		}
		msg += "*---------*</span>";
		to_chat(user, msg);
	} else {
		parent_proc();
	}
	return f.dot;
}, false);

// dextrous.dm:50
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/Recall", function* Recall(f: Frame, forced: Value) {
	if (!this.summoner || this.loc == this.summoner || this.cooldown > rt.worldTime(f) && !forced) {
		return 0;
	}
	yield* this.drop_all_held_items();
	return (yield* parent_proc());
}, true);

// dextrous.dm:56
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/snapback", function* snapback(f: Frame) {
	if (!(this.summoner && !(get_dist(rt.getStep(f, this.summoner, 0), rt.getStep(f, this, 0)) <= this.range))) return f.dot;
	yield* this.drop_all_held_items();
	yield* parent_proc();
	return f.dot;
}, true);

// dextrous.dm:62
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/doUnEquip", function* doUnEquip(f: Frame, I: Value, force: Value) {
	if (yield* parent_proc()) {
		yield* this.update_inv_hands();
		if (I == this.internal_storage) {
			this.internal_storage = null;
			this.update_inv_internal_storage();
		}
		return 1;
	}
	return 0;
}, true);

// dextrous.dm:71
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/can_equip", function can_equip(f: Frame, I: Value, slot: Value) {
	if (slot === slot_generic_dextrous_storage) {
		if (this.internal_storage) {
			return 0;
		}
		return 1;
	}
	parent_proc();
	return f.dot;
}, false);

// dextrous.dm:79
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/equip_to_slot", function* equip_to_slot(f: Frame, I: Value, slot: Value) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (slot === slot_generic_dextrous_storage) {
		this.internal_storage = I;
		this.update_inv_internal_storage();
	} else {
		to_chat(this, "<span class='danger'>You are trying to equip this item to an unsupported inventory slot. Report this to a coder!</span>");
	}
	return f.dot;
}, true);

// dextrous.dm:96
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/update_inv_internal_storage", function update_inv_internal_storage(f: Frame) {
	if (!(this.internal_storage && this.client && this.hud_used && this.hud_used.hud_shown)) return f.dot;
	this.internal_storage.screen_loc = "CENTER-4:12,SOUTH:5";
	this.client.screen += this.internal_storage;
	return f.dot;
});

// dextrous.dm:101
rt.def("/mob/living/simple_animal/hostile/guardian/dextrous/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	parent_proc();
	this.update_inv_internal_storage();
	return f.dot;
});
