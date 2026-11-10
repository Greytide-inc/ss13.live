// Based on /tg/station's code/modules/clothing/shoes/colour.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8481, "/obj/item/clothing/shoes/sneakers/orange", "/obj/item/clothing/shoes/sneakers", {
	name: "orange shoes",
	icon_state: "orange",
	item_color: "orange",
});

// colour.dm:90
rt.def("/obj/item/clothing/shoes/sneakers/orange/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.chained) {
		this.chained = null;
		this.slowdown = SHOES_SLOWDOWN;
		yield* new_(T("/obj/item/weapon/restraints/handcuffs"), user.loc);
		this.icon_state = "orange";
	}
	return f.dot;
}, true);

// colour.dm:98
rt.def("/obj/item/clothing/shoes/sneakers/orange/proc/attackby", function* attackby(f: Frame, H: Value, loc: Value, params: Value) {
	yield* parent_proc();
	if (H.type == T("/obj/item/weapon/restraints/handcuffs") && !this.chained) {
		yield* qdel(H);
		this.chained = 1;
		this.slowdown = 15;
		this.icon_state = "orange1";
	}
	return f.dot;
}, true);

// colour.dm:108
rt.def("/obj/item/clothing/shoes/sneakers/orange/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let C: Value = null;
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if ((C = user).shoes == this && this.chained == 1) {
			to_chat(user, "<span class='warning'>You need help taking these off!</span>");
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);
