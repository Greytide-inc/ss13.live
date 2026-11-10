// Based on /tg/station's code/game/objects/items/weapons/teleprod.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5664, "/obj/item/weapon/melee/baton/cattleprod/teleprod", "/obj/item/weapon/melee/baton/cattleprod", {
	name: "teleprod",
	desc: "A prod with a bluespace crystal on the end. The crystal doesn't look too fun to touch.",
	w_class: 3,
	icon_state: "teleprod_nocell",
	item_state: "teleprod",
	origin_tech: "combat=2;bluespace=4;materials=3",
	slot_flags: null,
});

// teleprod.dm:11
rt.def("/obj/item/weapon/melee/baton/cattleprod/teleprod/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	yield* parent_proc();
	if (this.status && rt.bitAnd(user.disabilities, 256) && prob(50)) {
		user.visible_message(`<span class='danger'>${user} accidentally hits themself with ${this}!</span>`, `<span class='userdanger'>You accidentally hit yourself with ${this}!</span>`);
		if (yield* do_teleport(user, rt.getStep(f, user, 0), 50)) {
			yield* user.Knockdown(this.stunforce * 3);
			yield* this.deductcharge(this.hitcost);
		} else {
			yield* user.Knockdown(this.stunforce * 3);
			yield* this.deductcharge(this.hitcost / 4);
		}
		return f.dot;
	} else {
		if (!this.status) return f.dot;
		if (!rt.istype(M, T("/mob/living/carbon")) && M.anchored) {
			return f.dot;
		} else {
			yield* do_teleport(M, rt.getStep(f, M, 0), 15);
		}
	}
	return f.dot;
}, true);

// teleprod.dm:30
rt.def("/obj/item/weapon/melee/baton/cattleprod/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/ore/bluespace_crystal"))) {
		if (!this.cell) {
			S = (yield* new_(T("/obj/item/weapon/melee/baton/cattleprod/teleprod")));
			yield* this.remove_item_from_storage(user);
			yield* qdel(this);
			yield* qdel(I);
			yield* user.put_in_hands(S);
			to_chat(user, "<span class='notice'>You place the bluespace crystal firmly into the igniter.</span>");
		} else {
			user.visible_message("<span class='warning'>You can't put the crystal onto the stunprod while it has a power cell installed!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
