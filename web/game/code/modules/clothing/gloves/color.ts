// Based on /tg/station's code/modules/clothing/gloves/color.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7665, "/obj/item/clothing/gloves/color/fyellow", "/obj/item/clothing/gloves/color", {
	desc: "These gloves are cheap knockoffs of the coveted ones - no way this can end badly.",
	name: "budget insulated gloves",
	icon_state: "yellow",
	item_state: "ygloves",
	siemens_coefficient: 1,
	permeability_coefficient: 0.05,
	item_color: "yellow",
	resistance_flags: 0,
});

// color.dm:22
rt.def("/obj/item/clothing/gloves/color/fyellow/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.siemens_coefficient = pick(0, 0.5, 0.5, 0.5, 0.5, 0.75, 1.5);
	return f.dot;
}, true);

rt.type(7666, "/obj/item/clothing/gloves/color/black", "/obj/item/clothing/gloves/color", {
	can_be_cut: 1,
	desc: "These gloves are fire-resistant.",
	name: "black gloves",
	icon_state: "black",
	item_state: "blackgloves",
	item_color: "black",
	cold_protection: 1536,
	min_cold_protection_temperature: 2,
	heat_protection: 1536,
	max_heat_protection_temperature: 1500,
	resistance_flags: 0,
});

// color.dm:45
rt.def("/obj/item/clothing/gloves/color/black/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
		if (this.can_be_cut && this.icon_state == rt.initial(f, this, "icon_state")) {
			to_chat(user, `<span class='notice'>You snip the fingertips off of ${this}.</span>`);
			playsound(user.loc, W.usesound, rand(10, 50), 1);
			yield* new_(T("/obj/item/clothing/gloves/fingerless"), user.loc);
			yield* qdel(this);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7683, "/obj/item/clothing/gloves/color/captain", "/obj/item/clothing/gloves/color", {
	desc: "Regal blue gloves, with a nice gold trim. Swanky.",
	name: "captain's gloves",
	icon_state: "captain",
	item_state: "egloves",
	item_color: "captain",
	siemens_coefficient: 0,
	permeability_coefficient: 0.05,
	cold_protection: 1536,
	min_cold_protection_temperature: 2,
	heat_protection: 1536,
	max_heat_protection_temperature: 1500,
	strip_delay: 60,
	armor: null,
});

// color.dm:149
rt.def("/obj/item/clothing/gloves/color/captain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 70, "acid", 50]);
	return f.dot;
});

rt.type(7688, "/obj/item/clothing/gloves/color/random", "/obj/item/clothing/gloves/color", {
	name: "random gloves",
	desc: "These gloves are supposed to be a random color...",
	icon_state: "white",
	item_state: "wgloves",
	item_color: "mime",
});

// color.dm:188
rt.def("/obj/item/clothing/gloves/color/random/proc/New", function* New(f: Frame) {
	let selected: Value = null;
	yield* parent_proc();
	let gloves: Value = rt.alist(f, [T("/obj/item/clothing/gloves/color/orange"), 1, T("/obj/item/clothing/gloves/color/red"), 1, T("/obj/item/clothing/gloves/color/blue"), 1, T("/obj/item/clothing/gloves/color/purple"), 1, T("/obj/item/clothing/gloves/color/green"), 1, T("/obj/item/clothing/gloves/color/grey"), 1, T("/obj/item/clothing/gloves/color/light_brown"), 1, T("/obj/item/clothing/gloves/color/brown"), 1]);
	this.name = rt.initial(f, (selected = pick(gloves)), "name");
	this.desc = rt.initial(f, selected, "desc");
	this.icon_state = rt.initial(f, selected, "icon_state");
	this.item_state = rt.initial(f, selected, "item_state");
	this.item_color = rt.initial(f, selected, "item_color");
	return f.dot;
}, true);
