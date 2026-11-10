// Based on /tg/station's code/modules/food_and_drinks/recipes/food_mixtures.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1595, "/datum/crafting_recipe/food", "/datum/crafting_recipe", {
	real_parts: null,
	category: "Foods",
});

// food_mixtures.dm:6
rt.def("/datum/crafting_recipe/food/proc/New", function New(f: Frame) {
	this.real_parts = this.parts.Copy();
	(rt.modSrcVar(f, "parts", this.reqs, rt.bitOr));
	return f.dot;
});

rt.type(2419, "/datum/chemical_reaction/tofu", "/datum/chemical_reaction", {
	name: "Tofu",
	id: "tofu",
	mob_react: 1,
	required_reagents: null,
	required_catalysts: null,
});

// food_mixtures.dm:14
rt.def("/datum/chemical_reaction/tofu/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["soymilk", 10]);
	this.required_catalysts = rt.alist(f, ["enzyme", 5]);
	return f.dot;
});

// food_mixtures.dm:19
rt.def("/datum/chemical_reaction/tofu/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = rt.getStep(f, holder.my_atom, 0);
	let i: Value = 1;
	while (i <= created_volume) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), location);
		i++;
	}
	return f.dot;
}, true);

rt.type(2420, "/datum/chemical_reaction/chocolate_bar", "/datum/chemical_reaction", {
	name: "Chocolate Bar",
	id: "chocolate_bar",
	required_reagents: null,
});

// food_mixtures.dm:27
rt.def("/datum/chemical_reaction/chocolate_bar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["soymilk", 2, "cocoa", 2, "sugar", 2]);
	return f.dot;
});

// food_mixtures.dm:30
rt.def("/datum/chemical_reaction/chocolate_bar/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = rt.getStep(f, holder.my_atom, 0);
	let i: Value = 1;
	while (i <= created_volume) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), location);
		i++;
	}
	return f.dot;
}, true);

rt.type(2421, "/datum/chemical_reaction/chocolate_bar2", "/datum/chemical_reaction", {
	name: "Chocolate Bar",
	id: "chocolate_bar",
	mob_react: 1,
	required_reagents: null,
});

// food_mixtures.dm:39
rt.def("/datum/chemical_reaction/chocolate_bar2/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["chocolate_milk", 4, "sugar", 2]);
	return f.dot;
});

// food_mixtures.dm:43
rt.def("/datum/chemical_reaction/chocolate_bar2/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = rt.getStep(f, holder.my_atom, 0);
	let i: Value = 1;
	while (i <= created_volume) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/chocolatebar"), location);
		i++;
	}
	return f.dot;
}, true);

rt.type(2422, "/datum/chemical_reaction/hot_coco", "/datum/chemical_reaction", {
	name: "Hot Coco",
	id: "hot_coco",
	results: null,
	required_reagents: null,
});

// food_mixtures.dm:51
rt.def("/datum/chemical_reaction/hot_coco/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["hot_coco", 5]);
	this.required_reagents = rt.alist(f, ["water", 5, "cocoa", 1]);
	return f.dot;
});

rt.type(2423, "/datum/chemical_reaction/coffee", "/datum/chemical_reaction", {
	name: "Coffee",
	id: "coffee",
	results: null,
	required_reagents: null,
});

// food_mixtures.dm:57
rt.def("/datum/chemical_reaction/coffee/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["coffee", 5]);
	this.required_reagents = rt.alist(f, ["coffeepowder", 1, "water", 5]);
	return f.dot;
});

rt.type(2424, "/datum/chemical_reaction/tea", "/datum/chemical_reaction", {
	name: "Tea",
	id: "tea",
	results: null,
	required_reagents: null,
});

// food_mixtures.dm:63
rt.def("/datum/chemical_reaction/tea/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["tea", 5]);
	this.required_reagents = rt.alist(f, ["teapowder", 1, "water", 5]);
	return f.dot;
});

rt.type(2425, "/datum/chemical_reaction/soysauce", "/datum/chemical_reaction", {
	name: "Soy Sauce",
	id: "soysauce",
	results: null,
	required_reagents: null,
});

// food_mixtures.dm:69
rt.def("/datum/chemical_reaction/soysauce/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["soysauce", 5]);
	this.required_reagents = rt.alist(f, ["soymilk", 4, "sacid", 1]);
	return f.dot;
});

rt.type(2426, "/datum/chemical_reaction/corn_syrup", "/datum/chemical_reaction", {
	name: "corn_syrup",
	id: "corn_syrup",
	required_temp: 374,
	results: null,
	required_reagents: null,
});

// food_mixtures.dm:75
rt.def("/datum/chemical_reaction/corn_syrup/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["corn_syrup", 5]);
	this.required_reagents = rt.alist(f, ["corn_starch", 1, "sacid", 1]);
	return f.dot;
});

rt.type(2427, "/datum/chemical_reaction/cheesewheel", "/datum/chemical_reaction", {
	name: "Cheesewheel",
	id: "cheesewheel",
	required_reagents: null,
	required_catalysts: null,
});

// food_mixtures.dm:82
rt.def("/datum/chemical_reaction/cheesewheel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["milk", 40]);
	this.required_catalysts = rt.alist(f, ["enzyme", 5]);
	return f.dot;
});

// food_mixtures.dm:86
rt.def("/datum/chemical_reaction/cheesewheel/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = rt.getStep(f, holder.my_atom, 0);
	let i: Value = 1;
	while (i <= created_volume) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/store/cheesewheel"), location);
		i++;
	}
	return f.dot;
}, true);

rt.type(2428, "/datum/chemical_reaction/synthmeat", "/datum/chemical_reaction", {
	name: "synthmeat",
	id: "synthmeat",
	mob_react: 1,
	required_reagents: null,
});

// food_mixtures.dm:93
rt.def("/datum/chemical_reaction/synthmeat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["blood", 5, "cryoxadone", 1]);
	return f.dot;
});

// food_mixtures.dm:97
rt.def("/datum/chemical_reaction/synthmeat/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = rt.getStep(f, holder.my_atom, 0);
	let i: Value = 1;
	while (i <= created_volume) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/synthmeat"), location);
		i++;
	}
	return f.dot;
}, true);

rt.type(2429, "/datum/chemical_reaction/hot_ramen", "/datum/chemical_reaction", {
	name: "Hot Ramen",
	id: "hot_ramen",
	results: null,
	required_reagents: null,
});

// food_mixtures.dm:104
rt.def("/datum/chemical_reaction/hot_ramen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["hot_ramen", 3]);
	this.required_reagents = rt.alist(f, ["water", 1, "dry_ramen", 3]);
	return f.dot;
});

rt.type(2430, "/datum/chemical_reaction/hell_ramen", "/datum/chemical_reaction", {
	name: "Hell Ramen",
	id: "hell_ramen",
	results: null,
	required_reagents: null,
});

// food_mixtures.dm:110
rt.def("/datum/chemical_reaction/hell_ramen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = rt.alist(f, ["hell_ramen", 6]);
	this.required_reagents = rt.alist(f, ["capsaicin", 1, "hot_ramen", 6]);
	return f.dot;
});

rt.type(2431, "/datum/chemical_reaction/imitationcarpmeat", "/datum/chemical_reaction", {
	name: "Imitation Carpmeat",
	id: "imitationcarpmeat",
	required_container: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/tofu"),
	mix_message: "The mixture becomes similar to carp meat.",
	required_reagents: null,
});

// food_mixtures.dm:116
rt.def("/datum/chemical_reaction/imitationcarpmeat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["carpotoxin", 5]);
	return f.dot;
});

// food_mixtures.dm:121
rt.def("/datum/chemical_reaction/imitationcarpmeat/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let location: Value = null;
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/carpmeat/imitation"), (location = rt.getStep(f, holder.my_atom, 0)));
	if (!(holder && holder.my_atom)) return f.dot;
	yield* qdel(holder.my_atom);
	return f.dot;
}, true);

rt.type(2432, "/datum/chemical_reaction/dough", "/datum/chemical_reaction", {
	name: "Dough",
	id: "dough",
	mix_message: "The ingredients form a dough.",
	required_reagents: null,
});

// food_mixtures.dm:129
rt.def("/datum/chemical_reaction/dough/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["water", 10, "flour", 15]);
	return f.dot;
});

// food_mixtures.dm:133
rt.def("/datum/chemical_reaction/dough/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = rt.getStep(f, holder.my_atom, 0);
	let i: Value = 1;
	while (i <= created_volume) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/dough"), location);
		i++;
	}
	return f.dot;
}, true);

rt.type(2433, "/datum/chemical_reaction/cakebatter", "/datum/chemical_reaction", {
	name: "Cake Batter",
	id: "cakebatter",
	mix_message: "The ingredients form a cake batter.",
	required_reagents: null,
});

// food_mixtures.dm:140
rt.def("/datum/chemical_reaction/cakebatter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["eggyolk", 15, "flour", 15, "sugar", 5]);
	return f.dot;
});

// food_mixtures.dm:144
rt.def("/datum/chemical_reaction/cakebatter/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = rt.getStep(f, holder.my_atom, 0);
	let i: Value = 1;
	while (i <= created_volume) {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/cakebatter"), location);
		i++;
	}
	return f.dot;
}, true);

rt.type(2434, "/datum/chemical_reaction/cakebatter/vegan", "/datum/chemical_reaction/cakebatter", {
	id: "vegancakebatter",
	required_reagents: null,
});

// food_mixtures.dm:150
rt.def("/datum/chemical_reaction/cakebatter/vegan/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["soymilk", 15, "flour", 15, "sugar", 5]);
	return f.dot;
});

rt.type(2435, "/datum/chemical_reaction/ricebowl", "/datum/chemical_reaction", {
	name: "Rice Bowl",
	id: "ricebowl",
	required_container: rt.typePath("/obj/item/weapon/reagent_containers/glass/bowl"),
	mix_message: "The rice absorbs the water.",
	required_reagents: null,
});

// food_mixtures.dm:155
rt.def("/datum/chemical_reaction/ricebowl/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_reagents = rt.alist(f, ["rice", 10, "water", 10]);
	return f.dot;
});

// food_mixtures.dm:160
rt.def("/datum/chemical_reaction/ricebowl/proc/on_reaction", function* on_reaction(f: Frame, holder: Value) {
	let location: Value = null;
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/salad/ricebowl"), (location = rt.getStep(f, holder.my_atom, 0)));
	if (!(holder && holder.my_atom)) return f.dot;
	yield* qdel(holder.my_atom);
	return f.dot;
}, true);
