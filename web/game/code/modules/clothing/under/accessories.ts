// Based on /tg/station's code/modules/clothing/under/accessories.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, subtract, fmt } = rt;


rt.type(8626, "/obj/item/clothing/accessory", "/obj/item/clothing", {
	above_suit: 0,
	minimize_when_attached: 1,
	name: "Accessory",
	desc: "Something has gone wrong!",
	icon: rt.rsc("icons/obj/clothing/accessories.dmi"),
	icon_state: "plasma",
	item_state: "",
	item_color: "plasma",
	slot_flags: 0,
	w_class: 2,
});

// accessories.dm:15
rt.def("/obj/item/clothing/accessory/proc/attach", function attach(f: Frame, U: Value, user: Value) {
	let armor_type: Value = null;
	if (this.pockets) {
		if (U.pockets) {
			return 0;
		}
		this.pockets.loc = U;
		U.pockets = this.pockets;
	}
	U.attached_accessory = this;
	this.loc = U;
	this.layer = -1;
	this.plane = -32767;
	if (this.minimize_when_attached) {
		this.transform *= 0.5;
		this.pixel_x += 8;
		this.pixel_y -= 8;
	}
	U.add_overlay(this);
	for (armor_type of each(this.armor)) {
		rt.modAt(U.armor, armor_type, rt.index(this.armor, armor_type), add);
	}
	if (rt.istype(user, T("/mob/living"))) {
		this.on_uniform_equip(U, user);
	}
	return 1;
});

// accessories.dm:41
rt.def("/obj/item/clothing/accessory/proc/detach", function detach(f: Frame, U: Value, user: Value) {
	let armor_type: Value = null;
	if (this.pockets && this.pockets == U.pockets) {
		this.pockets.loc = this;
		U.pockets = null;
	}
	for (armor_type of each(this.armor)) {
		(rt.modAt(U.armor, armor_type, rt.index(this.armor, armor_type), subtract));
	}
	if (rt.istype(user, T("/mob/living"))) {
		this.on_uniform_dropped(U, user);
	}
	if (this.minimize_when_attached) {
		this.transform *= 2;
		this.pixel_x -= 8;
		this.pixel_y += 8;
	}
	this.layer = rt.initial(f, this, "layer");
	this.plane = rt.initial(f, this, "plane");
	U.cut_overlays();
	U.attached_accessory = null;
	U.accessory_overlay = null;
	return f.dot;
});

// accessories.dm:68
rt.def("/obj/item/clothing/accessory/proc/AltClick", function AltClick(f: Frame) {
	let $2: any;
	if (!rt.initial(f, this, "above_suit")) return f.dot;
	this.above_suit = (!this.above_suit ? 1 : 0);
	let $0: any = f.usr;
	let $1: any = this;
	if (this.above_suit) {

		$2 = "above";
	} else {
		$2 = "below";
	}
	to_chat($0, fmt("＄！ will be worn ＀ your suit.", [$1, $2]));
	return f.dot;
});

// accessories.dm:73
rt.def("/obj/item/clothing/accessory/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, fmt("<span class='notice'>＄！ can be attached to a uniform. Alt-click to remove it once attached.</span>", [this]));
	if (!rt.initial(f, this, "above_suit")) return f.dot;
	to_chat(user, fmt("<span class='notice'>＄！ can be worn above or below your suit. Alt-click to toggle.</span>", [this]));
	return f.dot;
}, false);

rt.type(8629, "/obj/item/clothing/accessory/medal", "/obj/item/clothing/accessory", {
	medaltype: "medal",
	commended: 0,
	name: "bronze medal",
	desc: "A bronze medal.",
	icon_state: "bronze",
	item_color: "bronze",
	materials: null,
	resistance_flags: 2,
});

// accessories.dm:103
rt.def("/obj/item/clothing/accessory/medal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 1000]);
	return f.dot;
});

// accessories.dm:110
rt.def("/obj/item/clothing/accessory/medal/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let U: Value = null, delay: Value = null, input: Value = null;
	if (rt.istype(M, T("/mob/living/carbon/human")) && user.a_intent == "help") {
		if (M.wear_suit) {
			if (rt.bitAnd(M.wear_suit.flags_inv, 4)) {
				to_chat(user, "<span class='warning'>Medals can only be pinned on jumpsuits.</span>");
				return f.dot;
			}
		}
		if (M.w_uniform) {
			U = M.w_uniform;
			delay = 20;
			if (user == M) {
				delay = 0;
			} else {
				user.visible_message(`${user} is trying to pin ${this} on ${M}'s chest.`, `<span class='notice'>You try to pin ${this} on ${M}'s chest.</span>`);
			}
			if (!this.commended && user != M) {
				input = (yield* stripped_input(user, "Please input a reason for this commendation, it will be recorded by Nanotrasen.", null, "", 140));
			}
			if (yield* do_after(user, delay, { target: M })) {
				if (yield* U.attach_accessory(this, user, 0)) {
					if (user == M) {
						to_chat(user, `<span class='notice'>You attach ${this} to ${U}.</span>`);
					} else {
						user.visible_message(fmt("＀ pins ％！ on ＀'s chest.", [user, this, M]), fmt("<span class='notice'>You pin ％！ on ＀'s chest.</span>", [this, M]));
						if (input) {
							GLOB.commendations += `${user.real_name} awarded <b>${M.real_name}</b> the <font color='blue'>${this.name}</font>! \n- ${input}`;
							this.commended = 1;
							log_game(`<b>${key_name(M)}</b> was given the following commendation by <b>${key_name(user)}</b>: ${input}`);
							message_admins(`<b>${key_name(M)}</b> was given the following commendation by <b>${key_name(user)}</b>: ${input}`);
						}
					}
				}
			}
		} else {
			to_chat(user, "<span class='warning'>Medals can only be pinned on jumpsuits!</span>");
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(8632, "/obj/item/clothing/accessory/medal/silver", "/obj/item/clothing/accessory/medal", {
	medaltype: "medal-silver",
	name: "silver medal",
	desc: "A silver medal.",
	icon_state: "silver",
	item_color: "silver",
	materials: null,
});

// accessories.dm:160
rt.def("/obj/item/clothing/accessory/medal/silver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$silver", 1000]);
	return f.dot;
});

rt.type(8635, "/obj/item/clothing/accessory/medal/gold", "/obj/item/clothing/accessory/medal", {
	medaltype: "medal-gold",
	name: "gold medal",
	desc: "A prestigious golden medal.",
	icon_state: "gold",
	item_color: "gold",
	materials: null,
});

// accessories.dm:176
rt.def("/obj/item/clothing/accessory/medal/gold/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$gold", 1000]);
	return f.dot;
});

rt.type(8638, "/obj/item/clothing/accessory/medal/plasma", "/obj/item/clothing/accessory/medal", {
	medaltype: "medal-plasma",
	name: "plasma medal",
	desc: "An eccentric medal made of plasma.",
	icon_state: "plasma",
	item_color: "plasma",
	armor: null,
	materials: null,
});

// accessories.dm:193
rt.def("/obj/item/clothing/accessory/medal/plasma/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", -10, "acid", 0]);
	this.materials = rt.alist(f, ["$plasma", 1000]);
	return f.dot;
});

// accessories.dm:197
rt.def("/obj/item/clothing/accessory/medal/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	this.atmos_spawn_air(`plasma=20;TEMP=${exposed_temperature}`);
	this.visible_message(fmt("<span class='danger'> ＄！ bursts into flame!</span>", [this]), `<span class='userdanger'>Your ${this} bursts into flame!</span>`);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(8648, "/obj/item/clothing/accessory/lawyers_badge", "/obj/item/clothing/accessory", {
	name: "attorney's badge",
	desc: "Fills you with the conviction of JUSTICE. Lawyers tend to want to show it to everyone they meet.",
	icon_state: "lawyerbadge",
	item_color: "lawyerbadge",
});

// accessories.dm:269
rt.def("/obj/item/clothing/accessory/lawyers_badge/proc/on_uniform_equip", function on_uniform_equip(f: Frame, U: Value, user: Value) {
	let L: Value = null;
	if (!(L = user)) return f.dot;
	L.bubble_icon = "lawyer";
	return f.dot;
});

// accessories.dm:274
rt.def("/obj/item/clothing/accessory/lawyers_badge/proc/on_uniform_dropped", function on_uniform_dropped(f: Frame, U: Value, user: Value) {
	let L: Value = null;
	if (!(L = user)) return f.dot;
	L.bubble_icon = rt.initial(f, L, "bubble_icon");
	return f.dot;
});

rt.type(8652, "/obj/item/clothing/accessory/talisman", "/obj/item/clothing/accessory", {
	name: "bone talisman",
	desc: "A hunter's talisman, some say the old gods smile on those who wear it.",
	icon_state: "talisman",
	item_color: "talisman",
	armor: null,
});

// accessories.dm:304
rt.def("/obj/item/clothing/accessory/talisman/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 5, "bullet", 5, "laser", 5, "energy", 5, "bomb", 20, "bio", 20, "rad", 5, "fire", 0, "acid", 25]);
	return f.dot;
});

rt.type(8653, "/obj/item/clothing/accessory/skullcodpiece", "/obj/item/clothing/accessory", {
	above_suit: 1,
	name: "skull codpiece",
	desc: "A skull shaped ornament, intended to protect the important things in life.",
	icon_state: "skull",
	item_color: "skull",
	armor: null,
});

// accessories.dm:313
rt.def("/obj/item/clothing/accessory/skullcodpiece/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 5, "bullet", 5, "laser", 5, "energy", 5, "bomb", 20, "bio", 20, "rad", 5, "fire", 0, "acid", 25]);
	return f.dot;
});
