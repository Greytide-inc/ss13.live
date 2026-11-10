// Based on /tg/station's code/modules/food_and_drinks/food/snacks/meat.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6206, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", "/obj/item/weapon/reagent_containers/food/snacks/meat", {
	dried_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/sosjerky/healthy"),
	bitesize: 3,
	slices_num: 3,
	filling_color: "#FF0000",
	tastes: null,
	name: "meat",
	desc: "A slab of meat",
	icon_state: "meat",
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain"),
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain"),
});

// meat.dm:16
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 3]);
	return f.dot;
});

// meat.dm:19
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/proc/initialize_slice", function* initialize_slice(f: Frame, slice: Value, reagents_per_slice: Value) {
	let filling: Value = null;
	yield* parent_proc();
	(filling = mutable_appearance(this.icon, "rawcutlet_coloration")).color = this.filling_color;
	slice.add_overlay(filling);
	slice.filling_color = this.filling_color;
	slice.name = `raw ${this.name} cutlet`;
	slice.meat_type = this.name;
	return f.dot;
}, true);

// meat.dm:28
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/proc/initialize_cooked_food", function* initialize_cooked_food(f: Frame, S: Value, cooking_efficiency: Value) {
	yield* parent_proc();
	S.name = `${this.name} steak`;
	return f.dot;
}, true);

rt.type(6207, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", {
	tastes: null,
	name: " meat",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human"),
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain/human"),
});

// meat.dm:38
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["tender meat", 1]);
	return f.dot;
});

// meat.dm:41
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/proc/initialize_slice", function* initialize_slice(f: Frame, slice: Value, reagents_per_slice: Value) {
	yield* parent_proc();
	slice.subjectname = this.subjectname;
	slice.subjectjob = this.subjectjob;
	if (this.subjectname) {
		slice.name = `raw ${this.subjectname} cutlet`;
	} else {
		if (!this.subjectjob) return f.dot;
		slice.name = `raw ${this.subjectjob} cutlet`;
	}
	return f.dot;
}, true);

// meat.dm:50
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/proc/initialize_cooked_food", function* initialize_cooked_food(f: Frame, S: Value, cooking_efficiency: Value) {
	yield* parent_proc();
	S.subjectname = this.subjectname;
	S.subjectjob = this.subjectjob;
	if (this.subjectname) {
		S.name = `${this.subjectname} meatsteak`;
	} else {
		if (!this.subjectjob) return f.dot;
		S.name = `${this.subjectjob} meatsteak`;
	}
	return f.dot;
}, true);

rt.type(6209, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/slime", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#00FFFF",
	tastes: null,
	icon_state: "slimemeat",
	desc: "Because jello wasn't offensive enough to vegans.",
	list_reagents: null,
});

// meat.dm:64
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/slime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["slime", 1, "jelly", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 3, "slimejelly", 3]);
	return f.dot;
});

rt.type(6210, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/golem", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#A9A9A9",
	tastes: null,
	icon_state: "golemmeat",
	desc: "Edible rocks, welcome to the future.",
	list_reagents: null,
});

// meat.dm:71
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/golem/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["rock", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 3, "iron", 3]);
	return f.dot;
});

rt.type(6212, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/lizard", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#6B8E23",
	tastes: null,
	icon_state: "lizardmeat",
	desc: "Delicious dino damage",
});

// meat.dm:82
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/lizard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 4, "scales", 1]);
	return f.dot;
});

rt.type(6213, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/plant", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#E9967A",
	tastes: null,
	icon_state: "plantmeat",
	desc: "All the joys of healthy eating with all the fun of cannibalism.",
});

// meat.dm:88
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/plant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["salad", 1, "wood", 1]);
	return f.dot;
});

rt.type(6214, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/shadow", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#202020",
	tastes: null,
	icon_state: "shadowmeat",
	desc: "Ow, the edge",
});

// meat.dm:94
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/shadow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["darkness", 1, "meat", 1]);
	return f.dot;
});

rt.type(6215, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/fly", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	tastes: null,
	icon_state: "flymeat",
	desc: "Nothing says tasty like maggot filled radioactive mutant flesh.",
	list_reagents: null,
});

// meat.dm:100
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/fly/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["maggots", 1, "the inside of a reactor", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 3, "uranium", 3]);
	return f.dot;
});

rt.type(6216, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/skeleton", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#F0F0F0",
	tastes: null,
	slice_path: null,
	name: "-bone",
	icon_state: "skeletonmeat",
	desc: "There's a point where this needs to stop, and clearly we have passed it.",
});

// meat.dm:107
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/skeleton/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["bone", 1]);
	return f.dot;
});

rt.type(6217, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/zombie", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#6B8E23",
	tastes: null,
	name: " meat (rotten)",
	icon_state: "lizardmeat",
	desc: "Halfway to becoming fertilizer for your garden.",
});

// meat.dm:115
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/zombie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["brains", 1, "meat", 1]);
	return f.dot;
});

rt.type(6221, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", {
	tastes: null,
	name: "corgi meat",
	desc: "Tastes like... well you know...",
});

// meat.dm:136
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 4, "a fondness for wearing hats", 1]);
	return f.dot;
});

rt.type(6223, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/killertomato", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", {
	filling_color: "#FF0000",
	tastes: null,
	name: "killer tomato meat",
	desc: "A slice from a huge tomato.",
	icon_state: "tomatomeat",
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/killertomato"),
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/killertomato"),
});

// meat.dm:150
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/killertomato/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["tomato", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 2]);
	return f.dot;
});

rt.type(6224, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/bear", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", {
	filling_color: "#FFB6C1",
	tastes: null,
	name: "bear meat",
	desc: "A very manly slab of meat.",
	icon_state: "bearmeat",
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/bear"),
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/bear"),
});

// meat.dm:160
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/bear/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1, "salmon", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 12, "morphine", 5, "vitamin", 2]);
	return f.dot;
});

rt.type(6225, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", {
	bitesize: 4,
	filling_color: "#32CD32",
	tastes: null,
	name: "xeno meat",
	desc: "A slab of meat",
	icon_state: "xenomeat",
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/xeno"),
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/xeno"),
});

// meat.dm:172
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1, "acid", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 3, "vitamin", 1]);
	return f.dot;
});

rt.type(6226, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/spider", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", {
	filling_color: "#7CFC00",
	tastes: null,
	name: "spider meat",
	desc: "A slab of spider meat.",
	icon_state: "spidermeat",
	list_reagents: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/spider"),
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/spider"),
});

// meat.dm:182
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/spider/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["cobwebs", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 3, "toxin", 3, "vitamin", 1]);
	return f.dot;
});

rt.type(6227, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/goliath", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", {
	tastes: null,
	name: "goliath meat",
	desc: "A slab of goliath meat. It's not very edible now, but it cooks great in lava.",
	list_reagents: null,
	icon_state: "goliathmeat",
});

// meat.dm:190
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/goliath/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 3, "toxin", 5]);
	return f.dot;
});

// meat.dm:193
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/goliath/proc/burn", function* burn(f: Frame) {
	this.visible_message(`${this} finishes cooking!`);
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/goliath"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6228, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/meatwheat", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", {
	filling_color: "#960000",
	bitesize: 4,
	tastes: null,
	name: "meatwheat clump",
	desc: "This doesn't look like meat, but your standards aren't <i>that</i> high to begin with.",
	list_reagents: null,
	icon_state: "meatwheat_clump",
});

// meat.dm:204
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/meatwheat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1, "wheat", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 3, "vitamin", 2, "blood", 5]);
	return f.dot;
});

rt.type(6229, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawbacon", "/obj/item/weapon/reagent_containers/food/snacks/meat", {
	bitesize: 2,
	filling_color: "#B22222",
	tastes: null,
	name: "raw piece of bacon",
	desc: "A raw piece of bacon.",
	icon_state: "bacon",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/bacon"),
	list_reagents: null,
});

// meat.dm:214
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawbacon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["bacon", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 1]);
	return f.dot;
});

rt.type(6230, "/obj/item/weapon/reagent_containers/food/snacks/meat/bacon", "/obj/item/weapon/reagent_containers/food/snacks/meat", {
	bonus_reagents: null,
	filling_color: "#854817",
	tastes: null,
	name: "piece of bacon",
	desc: "A delicious piece of bacon.",
	icon_state: "baconcooked",
	list_reagents: null,
});

// meat.dm:221
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/bacon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 1]);
	this.tastes = rt.alist(f, ["bacon", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 2]);
	return f.dot;
});

rt.type(6231, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak", "/obj/item/weapon/reagent_containers/food/snacks/meat", {
	bonus_reagents: null,
	filling_color: "#B22222",
	tastes: null,
	name: "steak",
	desc: "A piece of hot spicy meat.",
	icon_state: "meatsteak",
	list_reagents: null,
	trash: rt.typePath("/obj/item/trash/plate"),
});

// meat.dm:233
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 2, "vitamin", 1]);
	this.tastes = rt.alist(f, ["meat", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 5]);
	return f.dot;
});

rt.type(6233, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human", "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain", {
	tastes: null,
});

// meat.dm:241
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["tender meat", 1]);
	return f.dot;
});

rt.type(6234, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/killertomato", "/obj/item/weapon/reagent_containers/food/snacks/meat/steak", {
	tastes: null,
	name: "killer tomato steak",
});

// meat.dm:245
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/killertomato/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["tomato", 1]);
	return f.dot;
});

rt.type(6235, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/bear", "/obj/item/weapon/reagent_containers/food/snacks/meat/steak", {
	tastes: null,
	name: "bear steak",
});

// meat.dm:249
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/bear/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1, "salmon", 1]);
	return f.dot;
});

rt.type(6236, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/xeno", "/obj/item/weapon/reagent_containers/food/snacks/meat/steak", {
	tastes: null,
	name: "xeno steak",
});

// meat.dm:253
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/xeno/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1, "acid", 1]);
	return f.dot;
});

rt.type(6237, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/spider", "/obj/item/weapon/reagent_containers/food/snacks/meat/steak", {
	tastes: null,
	name: "spider steak",
});

// meat.dm:257
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/spider/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["cobwebs", 1]);
	return f.dot;
});

rt.type(6238, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/goliath", "/obj/item/weapon/reagent_containers/food/snacks/meat/steak", {
	trash: null,
	tastes: null,
	name: "goliath steak",
	desc: "A delicious, lava cooked steak.",
	resistance_flags: 3,
	icon_state: "goliathsteak",
});

// meat.dm:265
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/goliath/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1, "rock", 1]);
	return f.dot;
});

rt.type(6239, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet", "/obj/item/weapon/reagent_containers/food/snacks/meat", {
	meat_type: "meat",
	bitesize: 2,
	filling_color: "#B22222",
	tastes: null,
	name: "raw cutlet",
	desc: "A raw meat cutlet.",
	icon_state: "rawcutlet",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/plain"),
	list_reagents: null,
});

// meat.dm:279
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 1]);
	return f.dot;
});

// meat.dm:283
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/proc/initialize_cooked_food", function* initialize_cooked_food(f: Frame, S: Value, cooking_efficiency: Value) {
	yield* parent_proc();
	S.name = `${this.meat_type} cutlet`;
	return f.dot;
}, true);

rt.type(6241, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain/human", "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain", {
	tastes: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/plain/human"),
});

// meat.dm:291
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain/human/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["tender meat", 1]);
	return f.dot;
});

// meat.dm:294
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain/human/proc/initialize_cooked_food", function* initialize_cooked_food(f: Frame, S: Value, cooking_efficiency: Value) {
	yield* parent_proc();
	if (this.subjectname) {
		S.name = `${this.subjectname} ${rt.initial(f, S, "name")}`;
	} else {
		if (!this.subjectjob) return f.dot;
		S.name = `${this.subjectjob} ${rt.initial(f, S, "name")}`;
	}
	return f.dot;
}, true);

rt.type(6242, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/killertomato", "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet", {
	tastes: null,
	name: "raw killer tomato cutlet",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/killertomato"),
});

// meat.dm:303
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/killertomato/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["tomato", 1]);
	return f.dot;
});

rt.type(6243, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/bear", "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet", {
	tastes: null,
	name: "raw bear cutlet",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/bear"),
});

// meat.dm:308
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/bear/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1, "salmon", 1]);
	return f.dot;
});

rt.type(6244, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/xeno", "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet", {
	tastes: null,
	name: "raw xeno cutlet",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/xeno"),
});

// meat.dm:313
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/xeno/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1, "acid", 1]);
	return f.dot;
});

rt.type(6245, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/spider", "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet", {
	tastes: null,
	name: "raw spider cutlet",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/spider"),
});

// meat.dm:318
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/spider/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["cobwebs", 1]);
	return f.dot;
});

rt.type(6246, "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet", "/obj/item/weapon/reagent_containers/food/snacks/meat", {
	bitesize: 2,
	bonus_reagents: null,
	filling_color: "#B22222",
	tastes: null,
	name: "cutlet",
	desc: "A cooked meat cutlet.",
	icon_state: "cutlet",
	list_reagents: null,
});

// meat.dm:328
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bonus_reagents = rt.alist(f, ["nutriment", 1, "vitamin", 1]);
	this.tastes = rt.alist(f, ["meat", 1]);
	this.list_reagents = rt.alist(f, ["nutriment", 2]);
	return f.dot;
});

rt.type(6248, "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/plain/human", "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/plain", {
	tastes: null,
});

// meat.dm:335
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/plain/human/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["tender meat", 1]);
	return f.dot;
});

rt.type(6249, "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/killertomato", "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet", {
	tastes: null,
	name: "killer tomato cutlet",
});

// meat.dm:339
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/killertomato/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["tomato", 1]);
	return f.dot;
});

rt.type(6250, "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/bear", "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet", {
	tastes: null,
	name: "bear cutlet",
});

// meat.dm:343
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/bear/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1, "salmon", 1]);
	return f.dot;
});

rt.type(6251, "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/xeno", "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet", {
	tastes: null,
	name: "xeno cutlet",
});

// meat.dm:347
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/xeno/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["meat", 1, "acid", 1]);
	return f.dot;
});

rt.type(6252, "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/spider", "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet", {
	tastes: null,
	name: "spider cutlet",
});

// meat.dm:351
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/spider/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tastes = rt.alist(f, ["cobwebs", 1]);
	return f.dot;
});
