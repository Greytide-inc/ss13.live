// Based on /tg/station's code/modules/food_and_drinks/food/snacks_sandwichtoast.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(6142, "/obj/item/weapon/reagent_containers/food/snacks/sandwich", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "sandwich",
	desc: "A grand creation of meat, cheese, bread, and several leaves of lettuce! Arthur Dent would be proud.",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "sandwich",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/toastedsandwich"),
});

// snacks_sandwichtoast.dm:7
rt.def("/obj/item/weapon/reagent_containers/food/snacks/sandwich/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 1]);
	this.tastes = rt.alist(f, ["meat", 2, "cheese", 1, "bread", 2, "lettuce", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 6, "vitamin", 1]);
	return f.dot;
});

rt.type(6143, "/obj/item/weapon/reagent_containers/food/snacks/toastedsandwich", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "toasted sandwich",
	desc: "Now if you only had a pepper bar.",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "toastedsandwich",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_sandwichtoast.dm:18
rt.def("/obj/item/weapon/reagent_containers/food/snacks/toastedsandwich/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "carbon", 2]);
	this.tastes = rt.alist(f, ["toast", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 6, "carbon", 2]);
	return f.dot;
});

rt.type(6144, "/obj/item/weapon/reagent_containers/food/snacks/grilledcheese", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "grilled cheese sandwich",
	desc: "Goes great with Tomato soup!",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "toastedsandwich",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_sandwichtoast.dm:28
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grilledcheese/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 1]);
	this.tastes = rt.alist(f, ["toast", 1, "cheese", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 7, "vitamin", 1]);
	return f.dot;
});

rt.type(6145, "/obj/item/weapon/reagent_containers/food/snacks/jellysandwich", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 3,
	tastes: null,
	name: "jelly sandwich",
	desc: "You wish you had some peanut butter to go with this...",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "jellysandwich",
	trash: rt.typePath("/obj/item/trash/plate"),
});

// snacks_sandwichtoast.dm:39
rt.def("/obj/item/weapon/reagent_containers/food/snacks/jellysandwich/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["bread", 1, "jelly", 1]);
	return f.dot;
});

rt.type(6146, "/obj/item/weapon/reagent_containers/food/snacks/jellysandwich/slime", "/obj/item/weapon/reagent_containers/food/snacks/jellysandwich", {
	bonus_reagents: null,
	list_reagents: null,
});

// snacks_sandwichtoast.dm:42
rt.def("/obj/item/weapon/reagent_containers/food/snacks/jellysandwich/slime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["slimejelly", 5, "vitamin", 2]);
	this.list_reagents = rt.alist(f, ["nutriment", 2, "slimejelly", 5, "vitamin", 2]);
	return f.dot;
});

rt.type(6147, "/obj/item/weapon/reagent_containers/food/snacks/jellysandwich/cherry", "/obj/item/weapon/reagent_containers/food/snacks/jellysandwich", {
	bonus_reagents: null,
	list_reagents: null,
});

// snacks_sandwichtoast.dm:46
rt.def("/obj/item/weapon/reagent_containers/food/snacks/jellysandwich/cherry/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["cherryjelly", 5, "vitamin", 2]);
	this.list_reagents = rt.alist(f, ["nutriment", 2, "cherryjelly", 5, "vitamin", 2]);
	return f.dot;
});

rt.type(6148, "/obj/item/weapon/reagent_containers/food/snacks/icecreamsandwich", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "icecream sandwich",
	desc: "Portable Ice-cream in its own packaging.",
	icon: rt.rsc("icons/obj/food/food.dmi"),
	icon_state: "icecreamsandwich",
	list_reagents: null,
});

// snacks_sandwichtoast.dm:54
rt.def("/obj/item/weapon/reagent_containers/food/snacks/icecreamsandwich/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "ice", 2]);
	this.tastes = rt.alist(f, ["ice cream", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 2, "ice", 2]);
	return f.dot;
});

rt.type(6149, "/obj/item/weapon/reagent_containers/food/snacks/notasandwich", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "not-a-sandwich",
	desc: "Something seems to be wrong with this, you can't quite figure what. Maybe it's his moustache.",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "notasandwich",
	trash: rt.typePath("/obj/item/trash/plate"),
	list_reagents: null,
});

// snacks_sandwichtoast.dm:64
rt.def("/obj/item/weapon/reagent_containers/food/snacks/notasandwich/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["vitamin", 6]);
	this.tastes = rt.alist(f, ["nothing suspicious", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 6, "vitamin", 6]);
	return f.dot;
});

rt.type(6150, "/obj/item/weapon/reagent_containers/food/snacks/jelliedtoast", "/obj/item/weapon/reagent_containers/food/snacks", {
	bitesize: 3,
	tastes: null,
	name: "jellied toast",
	desc: "A slice of toast covered with delicious jam.",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "jellytoast",
	trash: rt.typePath("/obj/item/trash/plate"),
});

// snacks_sandwichtoast.dm:75
rt.def("/obj/item/weapon/reagent_containers/food/snacks/jelliedtoast/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["toast", 1, "jelly", 1]);
	return f.dot;
});

rt.type(6151, "/obj/item/weapon/reagent_containers/food/snacks/jelliedtoast/cherry", "/obj/item/weapon/reagent_containers/food/snacks/jelliedtoast", {
	bonus_reagents: null,
	list_reagents: null,
});

// snacks_sandwichtoast.dm:78
rt.def("/obj/item/weapon/reagent_containers/food/snacks/jelliedtoast/cherry/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["cherryjelly", 5, "vitamin", 2]);
	this.list_reagents = rt.alist(f, ["nutriment", 1, "cherryjelly", 5, "vitamin", 2]);
	return f.dot;
});

rt.type(6152, "/obj/item/weapon/reagent_containers/food/snacks/jelliedtoast/slime", "/obj/item/weapon/reagent_containers/food/snacks/jelliedtoast", {
	bonus_reagents: null,
	list_reagents: null,
});

// snacks_sandwichtoast.dm:82
rt.def("/obj/item/weapon/reagent_containers/food/snacks/jelliedtoast/slime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["slimejelly", 5, "vitamin", 2]);
	this.list_reagents = rt.alist(f, ["nutriment", 1, "slimejelly", 5, "vitamin", 2]);
	return f.dot;
});

rt.type(6153, "/obj/item/weapon/reagent_containers/food/snacks/twobread", "/obj/item/weapon/reagent_containers/food/snacks", {
	bonus_reagents: null,
	tastes: null,
	name: "two bread",
	desc: "This seems awfully bitter.",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "twobread",
	list_reagents: null,
});

// snacks_sandwichtoast.dm:90
rt.def("/obj/item/weapon/reagent_containers/food/snacks/twobread/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 2]);
	this.tastes = rt.alist(f, ["bread", 2]);
	this.list_reagents = rt.alist(f, ["nutriment", 2, "vitamin", 2]);
	return f.dot;
});
