// Based on /tg/station's code/modules/food_and_drinks/food/snacks/dough.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6196, "/obj/item/weapon/reagent_containers/food/snacks/dough", "/obj/item/weapon/reagent_containers/food/snacks", {
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/bread/plain"),
	tastes: null,
	name: "dough",
	desc: "A piece of dough.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "dough",
	list_reagents: null,
	w_class: 3,
});

// dough.dm:13
rt.def("/obj/item/weapon/reagent_containers/food/snacks/dough/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["dough", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 6]);
	return f.dot;
});

// dough.dm:18
rt.def("/obj/item/weapon/reagent_containers/food/snacks/dough/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/kitchen/rollingpin"))) {
		if (isturf(this.loc)) {
			yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/flatdough"), this.loc);
			to_chat(user, `<span class='notice'>You flatten ${this}.</span>`);
			yield* qdel(this);
		} else {
			to_chat(user, `<span class='warning'>You need to put ${this} on a surface to roll it out!</span>`);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(6197, "/obj/item/weapon/reagent_containers/food/snacks/flatdough", "/obj/item/weapon/reagent_containers/food/snacks", {
	slices_num: 3,
	tastes: null,
	name: "flat dough",
	desc: "A flattened dough.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "flat dough",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/doughslice"),
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pizzabread"),
	list_reagents: null,
	w_class: 3,
});

// dough.dm:40
rt.def("/obj/item/weapon/reagent_containers/food/snacks/flatdough/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["dough", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 6]);
	return f.dot;
});

rt.type(6198, "/obj/item/weapon/reagent_containers/food/snacks/pizzabread", "/obj/item/weapon/reagent_containers/food/snacks", {
	custom_food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/customizable/pizza"),
	tastes: null,
	name: "pizza bread",
	desc: "Add ingredients to make a pizza",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "pizzabread",
	list_reagents: null,
	w_class: 3,
});

// dough.dm:50
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pizzabread/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["bread", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 7]);
	return f.dot;
});

rt.type(6199, "/obj/item/weapon/reagent_containers/food/snacks/doughslice", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#CD853F",
	tastes: null,
	name: "dough slice",
	desc: "A slice of dough. Can be cooked into a bun.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "doughslice",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/bun"),
});

// dough.dm:60
rt.def("/obj/item/weapon/reagent_containers/food/snacks/doughslice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["dough", 1]);
	return f.dot;
});

rt.type(6200, "/obj/item/weapon/reagent_containers/food/snacks/bun", "/obj/item/weapon/reagent_containers/food/snacks", {
	custom_food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/customizable/burger"),
	filling_color: "#CD853F",
	tastes: null,
	name: "bun",
	desc: "A base for any self-respecting burger.",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "bun",
	list_reagents: null,
});

// dough.dm:71
rt.def("/obj/item/weapon/reagent_containers/food/snacks/bun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["bun", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 1]);
	return f.dot;
});

rt.type(6201, "/obj/item/weapon/reagent_containers/food/snacks/cakebatter", "/obj/item/weapon/reagent_containers/food/snacks", {
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/store/cake/plain"),
	tastes: null,
	name: "cake batter",
	desc: "Cook it to get a cake.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "cakebatter",
	list_reagents: null,
	w_class: 3,
});

// dough.dm:81
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakebatter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["batter", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 9]);
	return f.dot;
});

// dough.dm:85
rt.def("/obj/item/weapon/reagent_containers/food/snacks/cakebatter/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/kitchen/rollingpin"))) {
		if (isturf(this.loc)) {
			yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/piedough"), this.loc);
			to_chat(user, `<span class='notice'>You flatten ${this}.</span>`);
			yield* qdel(this);
		} else {
			to_chat(user, `<span class='warning'>You need to put ${this} on a surface to roll it out!</span>`);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(6202, "/obj/item/weapon/reagent_containers/food/snacks/piedough", "/obj/item/weapon/reagent_containers/food/snacks", {
	slices_num: 3,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pie/plain"),
	tastes: null,
	name: "pie dough",
	desc: "Cook it to get a pie.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "piedough",
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/rawpastrybase"),
	list_reagents: null,
	w_class: 3,
});

// dough.dm:105
rt.def("/obj/item/weapon/reagent_containers/food/snacks/piedough/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["dough", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 9]);
	return f.dot;
});

rt.type(6203, "/obj/item/weapon/reagent_containers/food/snacks/rawpastrybase", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#CD853F",
	tastes: null,
	name: "raw pastry base",
	desc: "Must be cooked before use.",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "rawpastrybase",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/pastrybase"),
	list_reagents: null,
});

// dough.dm:115
rt.def("/obj/item/weapon/reagent_containers/food/snacks/rawpastrybase/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["raw pastry", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 1]);
	return f.dot;
});

rt.type(6204, "/obj/item/weapon/reagent_containers/food/snacks/pastrybase", "/obj/item/weapon/reagent_containers/food/snacks", {
	filling_color: "#CD853F",
	tastes: null,
	name: "pastry base",
	desc: "A base for any self-respecting pastry",
	icon: rt.rsc("icons/obj/food/food_ingredients.dmi"),
	icon_state: "pastrybase",
	list_reagents: null,
});

// dough.dm:124
rt.def("/obj/item/weapon/reagent_containers/food/snacks/pastrybase/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["pastry", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 1]);
	return f.dot;
});
