// Based on /tg/station's code/modules/hydroponics/grown/tomato.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10081, "/obj/item/seeds/tomato", "/obj/item/seeds", {
	species: "tomato",
	plantname: "Tomato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"),
	maturation: 8,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_grow: "tomato-grow",
	icon_dead: "tomato-dead",
	genes: null,
	reagents_add: null,
	name: "pack of tomato seeds",
	desc: "These seeds grow into tomato plants.",
	icon_state: "seed-tomato",
	mutatelist: null,
});

// tomato.dm:13
rt.def("/obj/item/seeds/tomato/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/squash"), T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["vitamin", 0.04, "nutriment", 0.1]);

	this.mutatelist = list(T("/obj/item/seeds/tomato/blue"), T("/obj/item/seeds/tomato/blood"), T("/obj/item/seeds/tomato/killer"));
	return f.dot;
});

rt.type(10082, "/obj/item/seeds/tomato/blood", "/obj/item/seeds/tomato", {
	species: "bloodtomato",
	plantname: "Blood-Tomato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/blood"),
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of blood-tomato seeds",
	desc: "These seeds grow into blood-tomato plants.",
	icon_state: "seed-bloodtomato",
});

// tomato.dm:34
rt.def("/obj/item/seeds/tomato/blood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["blood", 0.2, "vitamin", 0.04, "nutriment", 0.1]);
	return f.dot;
});

rt.type(10083, "/obj/item/seeds/tomato/blue", "/obj/item/seeds/tomato", {
	species: "bluetomato",
	plantname: "Blue-Tomato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/blue"),
	yield: 2,
	icon_grow: "bluetomato-grow",
	genes: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of blue-tomato seeds",
	desc: "These seeds grow into blue-tomato plants.",
	icon_state: "seed-bluetomato",
	mutatelist: null,
});

// tomato.dm:59
rt.def("/obj/item/seeds/tomato/blue/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/slip"), T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["lube", 0.2, "vitamin", 0.04, "nutriment", 0.1]);

	this.mutatelist = list(T("/obj/item/seeds/tomato/blue/bluespace"));
	return f.dot;
});

rt.type(10084, "/obj/item/seeds/tomato/blue/bluespace", "/obj/item/seeds/tomato/blue", {
	species: "bluespacetomato",
	plantname: "Bluespace Tomato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/blue/bluespace"),
	yield: 2,
	mutatelist: null,
	genes: null,
	reagents_add: null,
	rarity: 50,
	name: "pack of bluespace tomato seeds",
	desc: "These seeds grow into bluespace tomato plants.",
	icon_state: "seed-bluespacetomato",
});

// tomato.dm:81
rt.def("/obj/item/seeds/tomato/blue/bluespace/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();

	this.genes = list(T("/datum/plant_gene/trait/squash"), T("/datum/plant_gene/trait/slip"), T("/datum/plant_gene/trait/teleport"), T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["lube", 0.2, "bluespace", 0.2, "vitamin", 0.04, "nutriment", 0.1]);
	return f.dot;
});

rt.type(10085, "/obj/item/seeds/tomato/killer", "/obj/item/seeds/tomato", {
	species: "killertomato",
	plantname: "Killer-Tomato Plants",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer"),
	yield: 2,
	genes: null,
	growthstages: 2,
	icon_grow: "killertomato-grow",
	icon_harvest: "killertomato-harvest",
	icon_dead: "killertomato-dead",
	mutatelist: null,
	rarity: 30,
	name: "pack of killer-tomato seeds",
	desc: "These seeds grow into killer-tomato plants.",
	icon_state: "seed-killertomato",
});

// tomato.dm:103
rt.def("/obj/item/seeds/tomato/killer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/squash"));

	this.mutatelist = list();
	return f.dot;
});

rt.type(6348, "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer", "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato", {
	awakening: 0,
	filling_color: "#FF0000",
	seed: rt.typePath("/obj/item/seeds/tomato/killer"),
	name: "killer-tomato",
	desc: "I say to-mah-to, you say tom-mae-to... OH GOD IT'S EATING MY LEGS!!",
	icon_state: "killertomato",
	origin_tech: "biotech=4;combat=5",
});

// tomato.dm:122
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack", function* attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	if (this.awakening) {
		to_chat(user, "<span class='warning'>The tomato is twitching and shaking, preventing you from eating it.</span>");
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// tomato.dm:127
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let K: Value = null;
	if (this.awakening || rt.istype(user.loc, T("/turf/open/space"))) {
		return f.dot;
	}
	to_chat(user, "<span class='notice'>You begin to awaken the Killer Tomato...</span>");
	this.awakening = 1;
	rt.spawnTail(f, 30, "/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack_self: spawn at modules/hydroponics/grown/tomato.dm:132", user, K);
	return f.dot;
});

// a spawn(30) body of /obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato/killer/proc/attack_self: spawn at modules/hydroponics/grown/tomato.dm:132", function* (f: Frame, user: Value, K: Value) {
	if (!(!this || this.gc_destroyed)) {
		(K = (yield* new_(T("/mob/living/simple_animal/hostile/killertomato"), rt.getStep(f, this.loc, 0)))).maxHealth += round(this.seed.endurance / 3);
		K.melee_damage_lower += round(this.seed.potency / 10);
		K.melee_damage_upper += round(this.seed.potency / 10);
		K.move_to_delay -= round(this.seed.production / 50);
		K.health = K.maxHealth;
		K.visible_message("<span class='notice'>The Killer Tomato growls as it suddenly awakens.</span>");
		yield* qdel(this);
	}
	return null;
});
