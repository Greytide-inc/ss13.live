// Based on /tg/station's code/modules/clothing/head/hardhat.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8102, "/obj/item/clothing/head/hardhat", "/obj/item/clothing/head", {
	brightness_on: 4,
	on: 0,
	name: "hard hat",
	desc: "A piece of headgear used in dangerous working conditions to protect the head. Comes with a built-in flashlight.",
	icon_state: "hardhat0_yellow",
	item_state: "hardhat0_yellow",
	item_color: "yellow",
	armor: null,
	flags_inv: 0,
	actions_types: null,
	resistance_flags: 2,
	dog_fashion: rt.typePath("/datum/dog_fashion/head"),
});

// hardhat.dm:9
rt.def("/obj/item/clothing/head/hardhat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 15, "bullet", 5, "laser", 20, "energy", 10, "bomb", 20, "bio", 10, "rad", 20, "fire", 100, "acid", 50]);

	this.actions_types = list(T("/datum/action/item_action/toggle_helmet_light"));
	return f.dot;
});

// hardhat.dm:17
rt.def("/obj/item/clothing/head/hardhat/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	this.on = (!this.on ? 1 : 0);
	this.icon_state = `hardhat${this.on}_${this.item_color}`;
	this.item_state = `hardhat${this.on}_${this.item_color}`;
	yield* user.update_inv_head();
	if (this.on) {
		yield* this.turn_on(user);
	} else {
		yield* this.turn_off(user);
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// hardhat.dm:31
rt.def("/obj/item/clothing/head/hardhat/proc/turn_on", function turn_on(f: Frame, user: Value) {
	this.set_light(this.brightness_on);
	return f.dot;
});

// hardhat.dm:34
rt.def("/obj/item/clothing/head/hardhat/proc/turn_off", function turn_off(f: Frame, user: Value) {
	this.set_light(0);
	return f.dot;
});
