// Based on /tg/station's code/game/objects/items/weapons/paint.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(7320, "/obj/item/weapon/paint/anycolor", "/obj/item/weapon/paint", {
	gender: "plural",
	name: "any color",
	icon_state: "paint_neutral",
});

// paint.dm:60
rt.def("/obj/item/weapon/paint/anycolor/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let t1: Value = (yield* g.op(f, "Prompt", [0], [null, "Locking Computer", "Please select a color:", user, list("red", "blue", "green", "yellow", "violet", "black", "white")]));
	if (user.get_active_held_item() != this || user.stat || user.restrained()) {
		return f.dot;
	}
	if (t1 === "red") {
		this.item_color = "C73232";
	} else if (t1 === "blue") {
		this.item_color = "5998FF";
	} else if (t1 === "green") {
		this.item_color = "2A9C3B";
	} else if (t1 === "yellow") {
		this.item_color = "CFB52B";
	} else if (t1 === "violet") {
		this.item_color = "AE4CCD";
	} else if (t1 === "white") {
		this.item_color = "FFFFFF";
	} else if (t1 === "black") {
		this.item_color = "333333";
	}
	this.icon_state = `paint_${t1}`;
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

rt.type(7312, "/obj/item/weapon/paint", "/obj/item/weapon", {
	paintleft: 10,
	gender: "plural",
	name: "paint",
	desc: "Used to recolor floors and walls. Can be removed by the janitor.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "paint_neutral",
	item_color: "FFFFFF",
	item_state: "paintcan",
	w_class: 3,
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
});

// paint.dm:83
rt.def("/obj/item/weapon/paint/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (this.paintleft <= 0) {
		this.icon_state = "paint_empty";
		return f.dot;
	}
	if (!rt.istype(target, T("/turf")) || rt.istype(target, T("/turf/open/space"))) {
		return f.dot;
	}
	let newcolor: Value = "#" + this.item_color;
	target.add_atom_colour(newcolor, WASHABLE_COLOUR_PRIORITY);
	return f.dot;
});

rt.type(7321, "/obj/item/weapon/paint/paint_remover", "/obj/item/weapon/paint", {
	gender: "plural",
	name: "paint remover",
	desc: "Used to remove color from floors and walls.",
	icon_state: "paint_neutral",
});

// paint.dm:99
rt.def("/obj/item/weapon/paint/paint_remover/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (!(rt.istype(target, T("/turf")) && target.color != rt.initial(f, target, "color"))) return f.dot;
	target.remove_atom_colour(WASHABLE_COLOUR_PRIORITY);
	return f.dot;
});
