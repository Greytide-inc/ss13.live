// Based on /tg/station's code/modules/hydroponics/grown/banana.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9993, "/obj/item/seeds/banana", "/obj/item/seeds", {
	species: "banana",
	plantname: "Banana Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"),
	lifespan: 50,
	endurance: 30,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_fruits.dmi"),
	icon_dead: "banana-dead",
	genes: null,
	reagents_add: null,
	name: "pack of banana seeds",
	desc: "They're seeds that grow into banana trees. When grown, keep away from clown.",
	icon_state: "seed-banana",
	mutatelist: null,
});

// banana.dm:13
rt.def("/obj/item/seeds/banana/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/slip"), T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["banana", 0.1, "potassium", 0.1, "vitamin", 0.04, "nutriment", 0.02]);

	this.mutatelist = list(T("/obj/item/seeds/banana/mime"), T("/obj/item/seeds/banana/bluespace"));
	return f.dot;
});

rt.type(6268, "/obj/item/weapon/reagent_containers/food/snacks/grown/banana", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	filling_color: "#FFFF00",
	bitesize: 5,
	seed: rt.typePath("/obj/item/seeds/banana"),
	name: "banana",
	desc: "It's an excellent prop for a clown.",
	icon_state: "banana",
	item_state: "banana",
	trash: rt.typePath("/obj/item/weapon/grown/bananapeel"),
});

// banana.dm:28
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/banana/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is aiming ${this} at ${user.p_them()}self! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(this.loc, rt.rsc("sound/items/bikehorn.ogg"), 50, 1, -1);
	yield* sleep(25);
	if (!user) {
		return 8;
	}
	yield* user.say("BANG!");
	yield* sleep(25);
	if (!user) {
		return 8;
	}
	user.visible_message(`<B>${user}</B> laughs so hard they begin to suffocate!`);
	return 8;
}, true);

rt.type(7493, "/obj/item/weapon/grown/bananapeel", "/obj/item/weapon/grown", {
	throw_speed: 3,
	throw_range: 7,
	seed: rt.typePath("/obj/item/seeds/banana"),
	name: "banana peel",
	desc: "A peel from a banana.",
	icon_state: "banana_peel",
	item_state: "banana_peel",
	w_class: 1,
	throwforce: 0,
});

// banana.dm:52
rt.def("/obj/item/weapon/grown/bananapeel/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is deliberately slipping on ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(this.loc, rt.rsc("sound/misc/slip.ogg"), 50, 1, -1);
	return 1;
});

rt.type(9994, "/obj/item/seeds/banana/mime", "/obj/item/seeds/banana", {
	species: "mimana",
	plantname: "Mimana Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/banana/mime"),
	growthstages: 4,
	mutatelist: null,
	reagents_add: null,
	rarity: 15,
	name: "pack of mimana seeds",
	desc: "They're seeds that grow into mimana trees. When grown, keep away from mime.",
	icon_state: "seed-mimana",
});

// banana.dm:66
rt.def("/obj/item/seeds/banana/mime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["nothing", 0.1, "mutetoxin", 0.1, "nutriment", 0.02]);
	return f.dot;
});

rt.type(9995, "/obj/item/seeds/banana/bluespace", "/obj/item/seeds/banana", {
	species: "bluespacebanana",
	icon_grow: "banana-grow",
	plantname: "Bluespace Banana Tree",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/banana/bluespace"),
	mutatelist: null,
	genes: null,
	reagents_add: null,
	rarity: 30,
	name: "pack of bluespace banana seeds",
	desc: "They're seeds that grow into bluespace banana trees. When grown, keep away from bluespace clown.",
	icon_state: "seed-banana-blue",
});

// banana.dm:93
rt.def("/obj/item/seeds/banana/bluespace/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();

	this.genes = list(T("/datum/plant_gene/trait/slip"), T("/datum/plant_gene/trait/teleport"), T("/datum/plant_gene/trait/repeated_harvest"));
	this.reagents_add = rt.alist(f, ["bluespace", 0.2, "banana", 0.1, "vitamin", 0.04, "nutriment", 0.02]);
	return f.dot;
});

rt.type(7496, "/obj/item/weapon/grown/bananapeel/specialpeel", "/obj/item/weapon/grown/bananapeel", {
	name: "synthesized banana peel",
	desc: "A synthetic banana peel.",
});

// banana.dm:118
rt.def("/obj/item/weapon/grown/bananapeel/specialpeel/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let carbon: Value = null;
	if (!rt.istype(AM, T("/mob/living/carbon"))) return f.dot;
	if (!(yield* (carbon = AM).slip(40, this, 0))) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);
