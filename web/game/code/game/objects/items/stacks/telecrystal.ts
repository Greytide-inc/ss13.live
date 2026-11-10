// Based on /tg/station's code/game/objects/items/stacks/telecrystal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9105, "/obj/item/stack/telecrystal", "/obj/item/stack", {
	singular_name: "telecrystal",
	max_amount: 50,
	flags: 4,
	name: "telecrystal",
	desc: "It seems to be pulsing with suspiciously enticing energies.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "telecrystal",
	w_class: 1,
	origin_tech: "materials=6;syndicate=1",
});

// telecrystal.dm:13
rt.def("/obj/item/stack/telecrystal/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let I: Value = null;
	if (target != user) return f.dot;
	for (I of each(target, T("/obj/item/weapon/implant/uplink"))) {
		if (I && I.imp_in) {
			I.hidden_uplink.telecrystals += this.amount;
			yield* this.use(this.amount);
			to_chat(user, `<span class='notice'>You press ${this} onto yourself and charge your hidden uplink.</span>`);
		}
	}
	return f.dot;
}, true);

// telecrystal.dm:21
rt.def("/obj/item/stack/telecrystal/proc/afterattack", function* afterattack(f: Frame, I: Value, user: Value, proximity: Value) {
	let cart: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item")) && I.hidden_uplink && I.hidden_uplink.active) {
		I.hidden_uplink.telecrystals += this.amount;
		yield* this.use(this.amount);
		to_chat(user, `<span class='notice'>You slot ${this} into the ${I} and charge its internal uplink.</span>`);
	} else {
		if (!rt.istype(I, T("/obj/item/weapon/cartridge/virus/frame"))) return f.dot;
		if (!(cart = I).charges) {
			to_chat(user, `<span class='notice'>The ${cart} is out of charges, it's refusing to accept the ${this}</span>`);
			return f.dot;
		}
		cart.telecrystals += this.amount;
		yield* this.use(this.amount);
		to_chat(user, `<span class='notice'>You slot ${this} into the ${cart}.  The next time it's used, it will also give telecrystals</span>`);
	}
	return f.dot;
}, true);
