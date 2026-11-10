// Based on /tg/station's code/modules/food_and_drinks/food/snacks_spaghetti.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(6178, "/obj/item/weapon/reagent_containers/food/snacks/spaghetti", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#F0E68C",
	tastes: null,
	name: "spaghetti",
	desc: "Now that's a nic'e pasta!",
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	icon_state: "spaghetti",
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/boiledspaghetti"),
});

// snacks_spaghetti.dm:10
rt.def("/obj/item/weapon/reagent_containers/food/snacks/spaghetti/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["pasta", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 1]);
	return f.dot;
});

rt.type(6179, "/obj/item/weapon/reagent_containers/food/snacks/boiledspaghetti", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	custom_food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/customizable/pasta"),
	filling_color: "#F0E68C",
	tastes: null,
	name: "boiled spaghetti",
	desc: "A plain dish of noodles, this needs more ingredients.",
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	icon_state: "spaghettiboiled",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_spaghetti.dm:18
rt.def("/obj/item/weapon/reagent_containers/food/snacks/boiledspaghetti/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 2]);
	this.tastes = rt.alist(f, ["pasta", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 2, "vitamin", 1]);
	return f.dot;
});

rt.type(6180, "/obj/item/weapon/reagent_containers/food/snacks/pastatomato", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 4,
	bonus_reagents: null,
	filling_color: "#DC143C",
	tastes: null,
	name: "spaghetti",
	desc: "Spaghetti and crushed tomatoes. Just like your abusive father used to make!",
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	icon_state: "pastatomato",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_spaghetti.dm:31
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pastatomato/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "tomatojuice", 10, "vitamin", 4]);
	this.tastes = rt.alist(f, ["pasta", 1, "tomato", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 6, "tomatojuice", 10, "vitamin", 4]);
	return f.dot;
});

rt.type(6181, "/obj/item/weapon/reagent_containers/food/snacks/copypasta", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 4,
	bonus_reagents: null,
	filling_color: "#DC143C",
	tastes: null,
	name: "copypasta",
	desc: "You probably shouldn't try this, you always hear people talking about how bad it is...",
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	icon_state: "copypasta",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_spaghetti.dm:43
rt.def("/obj/item/weapon/reagent_containers/food/snacks/copypasta/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 4]);
	this.tastes = rt.alist(f, ["pasta", 1, "tomato", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 12, "tomatojuice", 20, "vitamin", 8]);
	return f.dot;
});

rt.type(6182, "/obj/item/weapon/reagent_containers/food/snacks/meatballspaghetti", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F0E68C",
	tastes: null,
	name: "spaghetti and meatballs",
	desc: "Now that's a nic'e meatball!",
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	icon_state: "meatballspaghetti",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_spaghetti.dm:54
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meatballspaghetti/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 4]);
	this.tastes = rt.alist(f, ["pasta", 1, "tomato", 1, "meat", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 8, "vitamin", 4]);
	return f.dot;
});

rt.type(6183, "/obj/item/weapon/reagent_containers/food/snacks/spesslaw", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	filling_color: "#F0E68C",
	tastes: null,
	name: "spesslaw",
	desc: "A lawyers favourite.",
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	icon_state: "spesslaw",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_spaghetti.dm:65
rt.def("/obj/item/weapon/reagent_containers/food/snacks/spesslaw/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 6]);
	this.tastes = rt.alist(f, ["pasta", 1, "tomato", 1, "meat", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 8, "vitamin", 6]);
	return f.dot;
});

rt.type(6184, "/obj/item/weapon/reagent_containers/food/snacks/chowmein", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "chow mein",
	desc: "A nice mix of noodles and fried vegetables.",
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	icon_state: "chowmein",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_spaghetti.dm:76
rt.def("/obj/item/weapon/reagent_containers/food/snacks/chowmein/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 3, "vitamin", 4]);
	this.tastes = rt.alist(f, ["noodle", 1, "tomato", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 7, "vitamin", 6]);
	return f.dot;
});

rt.type(6185, "/obj/item/weapon/reagent_containers/food/snacks/beefnoodle", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "beef noodle",
	desc: "Nutritious, beefy and noodly.",
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	icon_state: "beefnoodle",
	trash: rt.typePath("/obj/item/weapon/reagent_containers/glass/bowl"),
});

// snacks_spaghetti.dm:86
rt.def("/obj/item/weapon/reagent_containers/food/snacks/beefnoodle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 5, "vitamin", 6, "liquidgibs", 3]);
	this.tastes = rt.alist(f, ["noodle", 1, "meat", 1]);
	return f.dot;
});

rt.type(6186, "/obj/item/weapon/reagent_containers/food/snacks/butternoodles", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "butter noodles",
	desc: "Noodles covered in savory butter. Simple and slippery, but delicious.",
	icon: rt.rsc("icons/obj/food/pizzaspaghetti.dmi"),
	icon_state: "butternoodles",
	trash: rt.typePath("/obj/item/trash/plate"),
});

// snacks_spaghetti.dm:95
rt.def("/obj/item/weapon/reagent_containers/food/snacks/butternoodles/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 8, "vitamin", 1]);
	this.tastes = rt.alist(f, ["noodle", 1, "butter", 1]);
	return f.dot;
});
