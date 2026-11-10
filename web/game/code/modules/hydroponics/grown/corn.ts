// Based on /tg/station's code/modules/hydroponics/grown/corn.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10025, "/obj/item/seeds/corn", "/obj/item/seeds", {
	species: "corn",
	plantname: "Corn Stalks",
	product: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/corn"),
	maturation: 8,
	potency: 20,
	growthstages: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_vegetables.dmi"),
	icon_grow: "corn-grow",
	icon_dead: "corn-dead",
	reagents_add: null,
	name: "pack of corn seeds",
	desc: "I don't mean to sound corny...",
	icon_state: "seed-corn",
	mutatelist: null,
});

// corn.dm:16
rt.def("/obj/item/seeds/corn/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_add = rt.alist(f, ["cornoil", 0.2, "vitamin", 0.04, "nutriment", 0.1]);

	this.mutatelist = list(T("/obj/item/seeds/corn/snapcorn"));
	return f.dot;
});

rt.type(7497, "/obj/item/weapon/grown/corncob", "/obj/item/weapon/grown", {
	throw_speed: 3,
	throw_range: 7,
	name: "corn cob",
	desc: "A reminder of meals gone by.",
	icon_state: "corncob",
	item_state: "corncob",
	w_class: 1,
	throwforce: 0,
});

// corn.dm:39
rt.def("/obj/item/weapon/grown/corncob/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (W.is_sharp()) {
		to_chat(user, `<span class='notice'>You use ${W} to fashion a pipe out of the corn cob!</span>`);
		yield* new_(T("/obj/item/clothing/mask/cigarette/pipe/cobpipe"), user.loc);
		yield* qdel(this);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(10026, "/obj/item/seeds/corn/snapcorn", "/obj/item/seeds/corn", {
	species: "snapcorn",
	plantname: "Snapcorn Stalks",
	product: rt.typePath("/obj/item/weapon/grown/snapcorn"),
	mutatelist: null,
	rarity: 10,
	name: "pack of snapcorn seeds",
	desc: "Oh snap!",
	icon_state: "seed-snapcorn",
});

// corn.dm:54
rt.def("/obj/item/seeds/corn/snapcorn/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	return f.dot;
});

rt.type(7498, "/obj/item/weapon/grown/snapcorn", "/obj/item/weapon/grown", {
	snap_pops: 1,
	throw_speed: 3,
	throw_range: 7,
	seed: rt.typePath("/obj/item/seeds/corn/snapcorn"),
	name: "snap corn",
	desc: "A cob with snap pops",
	icon_state: "snapcorn",
	item_state: "corncob",
	w_class: 1,
	throwforce: 0,
});

// corn.dm:70
rt.def("/obj/item/weapon/grown/snapcorn/proc/add_juice", function add_juice(f: Frame) {
	parent_proc();
	this.snap_pops = max(round(this.seed.potency / 8), 1);
	return f.dot;
});

// corn.dm:74
rt.def("/obj/item/weapon/grown/snapcorn/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* parent_proc();
	to_chat(user, "<span class='notice'>You pick a snap pop from the cob.</span>");
	let S: Value = (yield* new_(T("/obj/item/toy/snappop"), user.loc));
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		yield* user.put_in_hands(S);
	}
	this.snap_pops -= 1;
	if (this.snap_pops) return f.dot;
	yield* new_(T("/obj/item/weapon/grown/corncob"), user.loc);
	yield* qdel(this);
	return f.dot;
}, true);
