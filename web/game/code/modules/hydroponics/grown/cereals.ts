// Based on /tg/station's code/modules/hydroponics/grown/cereals.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10012, "/obj/item/seeds/wheat", "/obj/item/seeds", {
	species: "wheat",
	plantname: "Wheat Stalks",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/wheat"),
	production: 1,
	yield: 4,
	potency: 15,
	icon_dead: "wheat-dead",
	reagents_add: null,
	name: "pack of wheat seeds",
	desc: "These may, or may not, grow into wheat.",
	icon_state: "seed-wheat",
	mutatelist: null,
});

// cereals.dm:14
rt.def("/obj/item/seeds/wheat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_add = rt.alist(f, ["nutriment", 0.04]);

	this.mutatelist = list(T("/obj/item/seeds/wheat/oat"), T("/obj/item/seeds/wheat/meat"));
	return f.dot;
});

rt.type(10013, "/obj/item/seeds/wheat/oat", "/obj/item/seeds/wheat", {
	species: "oat",
	plantname: "Oat Stalks",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/oat"),
	mutatelist: null,
	name: "pack of oat seeds",
	desc: "These may, or may not, grow into oat.",
	icon_state: "seed-oat",
});

// cereals.dm:33
rt.def("/obj/item/seeds/wheat/oat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	return f.dot;
});

rt.type(10014, "/obj/item/seeds/wheat/rice", "/obj/item/seeds/wheat", {
	species: "rice",
	plantname: "Rice Stalks",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/rice"),
	mutatelist: null,
	growthstages: 3,
	name: "pack of rice seeds",
	desc: "These may, or may not, grow into rice.",
	icon_state: "seed-rice",
});

// cereals.dm:52
rt.def("/obj/item/seeds/wheat/rice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	return f.dot;
});

rt.type(10015, "/obj/item/seeds/wheat/meat", "/obj/item/seeds/wheat", {
	species: "meatwheat",
	plantname: "Meatwheat",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/meatwheat"),
	mutatelist: null,
	name: "pack of meatwheat seeds",
	desc: "If you ever wanted to drive a vegetarian to insanity, here's how.",
	icon_state: "seed-meatwheat",
});

// cereals.dm:72
rt.def("/obj/item/seeds/wheat/meat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	return f.dot;
});

rt.type(6289, "/obj/item/weapon/reagent_containers/food/snacks/grown/meatwheat", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#960000",
	bitesize_mod: 2,
	name: "meatwheat",
	desc: "Some blood-drenched wheat stalks. You can crush them into what passes for meat if you squint hard enough.",
	icon_state: "meatwheat",
	gender: "plural",
	seed: rt.typePath("/obj/item/seeds/wheat/meat"),
});

// cereals.dm:84
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/meatwheat/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	user.visible_message(`<span class='notice'>${user} crushes ${this} into meat.</span>`, `<span class='notice'>You crush ${this} into something that resembles meat.</span>`);
	playsound(user, rt.rsc("sound/effects/blobattack.ogg"), 50, 1);
	let M: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/meatwheat"), rt.getStep(f, user, 0)));
	yield* user.drop_item();
	yield* qdel(this);
	yield* user.put_in_hands(M);
	return 1;
}, true);
