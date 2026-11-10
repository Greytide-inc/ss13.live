// Based on /tg/station's code/modules/clothing/spacesuits/plasmamen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7745, "/obj/item/clothing/suit/space/eva/plasmaman", "/obj/item/clothing/suit/space/eva", {
	next_extinguish: 0,
	extinguish_cooldown: 100,
	extinguishes_left: 10,
	name: "EVA plasma envirosuit",
	desc: "A special plasma containment suit designed to be space-worthy, as well as worn over other clothing. Like it's smaller counterpart, it can automatically extinguish the wearer in a crisis, and holds twice as many charges.",
	allowed: null,
	armor: null,
	resistance_flags: 2,
	icon_state: "plasmaman_suit",
	item_state: "plasmaman_suit",
});

// plasmamen.dm:7
rt.def("/obj/item/clothing/suit/space/eva/plasmaman/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_casing"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/melee/energy/sword"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank"));
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 0, "fire", 100, "acid", 75]);
	return f.dot;
});

// plasmamen.dm:18
rt.def("/obj/item/clothing/suit/space/eva/plasmaman/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>There are ${this.extinguishes_left} extinguisher charges left in this suit.</span>`);
	return f.dot;
}, false);

// plasmamen.dm:23
rt.def("/obj/item/clothing/suit/space/eva/plasmaman/proc/Extinguish", function* Extinguish(f: Frame, H: Value) {
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (!H.fire_stacks) return f.dot;
	if (!this.extinguishes_left) return f.dot;
	if (this.next_extinguish > rt.worldTime(f)) {
		return f.dot;
	}
	this.next_extinguish = rt.worldTime(f) + this.extinguish_cooldown;
	this.extinguishes_left--;
	H.visible_message(`<span class='warning'>${H}'s suit automatically extinguishes them!</span>`, "<span class='warning'>Your suit automatically extinguishes you.</span>");
	yield* H.ExtinguishMob();
	yield* new_(T("/obj/effect/particle_effect/water"), rt.getStep(f, H, 0));
	return f.dot;
}, true);

rt.type(7978, "/obj/item/clothing/head/helmet/space/plasmaman", "/obj/item/clothing/head/helmet/space", {
	brightness_on: 4,
	on: 0,
	name: "plasma envirosuit helmet",
	desc: "A special containment helmet that allows plasma-based lifeforms to exist safely in an oxygenated environment. It is space-worthy, and may be worn in tandem with other EVA gear.",
	icon_state: "plasmaman-helm",
	item_state: "plasmaman-helm",
	strip_delay: 80,
	armor: null,
	resistance_flags: 2,
	actions_types: null,
});

// plasmamen.dm:44
rt.def("/obj/item/clothing/head/helmet/space/plasmaman/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 0, "fire", 100, "acid", 75]);

	this.actions_types = list(T("/datum/action/item_action/toggle_helmet_light"));
	return f.dot;
});

// plasmamen.dm:51
rt.def("/obj/item/clothing/head/helmet/space/plasmaman/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	this.on = (!this.on ? 1 : 0);
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.on ? "-light" : ""}`;
	this.item_state = this.icon_state;
	yield* user.update_inv_head();
	if (this.on) {
		this.set_light(this.brightness_on);
	} else {
		this.set_light(0);
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);
