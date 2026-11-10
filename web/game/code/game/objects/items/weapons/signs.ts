// Based on /tg/station's code/game/objects/items/weapons/signs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7344, "/obj/item/weapon/picket_sign", "/obj/item/weapon", {
	label: "",
	last_wave: 0,
	icon_state: "picket",
	name: "blank picket sign",
	desc: "It's blank",
	force: 5,
	w_class: 4,
	attack_verb: null,
	resistance_flags: 4,
});

// signs.dm:14
rt.def("/obj/item/weapon/picket_sign/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let txt: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/pen")) || rt.istype(W, T("/obj/item/toy/crayon"))) {
		if (txt = (yield* stripped_input(user, "What would you like to write on the sign?", "Sign Label", null, 30))) {
			this.label = txt;
			this.name = `${this.label} sign`;
			this.desc = `It reads: ${this.label}`;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// signs.dm:24
rt.def("/obj/item/weapon/picket_sign/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!(this.last_wave + 20 < rt.worldTime(f))) return f.dot;
	this.last_wave = rt.worldTime(f);
	if (this.label) {
		user.visible_message(fmt("<span class='warning'>＀ waves around ％\"！\" sign.</span>", [user, this.label]));
	} else {
		user.visible_message(`<span class='warning'>${user} waves around blank sign.</span>`);
	}
	user.changeNext_move(8);
	return f.dot;
});

rt.type(1536, "/datum/crafting_recipe/picket_sign", "/datum/crafting_recipe", {
	name: "Picket Sign",
	result: rt.typePath("/obj/item/weapon/picket_sign"),
	reqs: null,
	time: 80,
	category: "Misc",
});

// signs.dm:35
rt.def("/datum/crafting_recipe/picket_sign/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reqs = rt.alist(f, [T("/obj/item/stack/rods"), 1, T("/obj/item/stack/sheet/cardboard"), 2]);
	return f.dot;
});
