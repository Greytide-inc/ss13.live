// From code/modules/food_and_drinks/food/snacks/meat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:16)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/proc/initialize_slice  (code/modules/food_and_drinks/food/snacks/meat.dm:19)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/proc/initialize_slice", function* initialize_slice(f: Frame) {
	let filling: Value = null;
	f.vars = () => [filling];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "color", (filling = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "rawcutlet_coloration"]))), rt.sv(f, "filling_color"));
	yield* g.callName(f, live(f.args[0]), "add_overlay", [live(filling)]);
	rt.setFv(f, "filling_color", live(f.args[0]), rt.sv(f, "filling_color"));
	rt.setFv(f, "name", live(f.args[0]), fmt("raw ＀ cutlet", [rt.sv(f, "name")]));
	rt.setFv(f, "meat_type", live(f.args[0]), rt.sv(f, "name"));
	return f.dot;
}, true, { args: ["slice", "reagents_per_slice"] });

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/proc/initialize_cooked_food  (code/modules/food_and_drinks/food/snacks/meat.dm:28)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/proc/initialize_cooked_food", function* initialize_cooked_food(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "name", live(f.args[0]), fmt("＀ steak", [rt.sv(f, "name")]));
	return f.dot;
}, true, { args: ["S", "cooking_efficiency"] });

rt.type(6207, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", {
	tastes: null,
	name: " meat",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human"),
	slice_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain/human"),
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:38)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["tender meat", 1]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/proc/initialize_slice  (code/modules/food_and_drinks/food/snacks/meat.dm:41)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/proc/initialize_slice", function* initialize_slice(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "subjectname", live(f.args[0]), rt.sv(f, "subjectname"));
	rt.setFv(f, "subjectjob", live(f.args[0]), rt.sv(f, "subjectjob"));
	if (truthy(rt.sv(f, "subjectname"))) {
		rt.setFv(f, "name", live(f.args[0]), fmt("raw ＀ cutlet", [rt.sv(f, "subjectname")]));
	} else {
		if (!truthy(rt.sv(f, "subjectjob"))) return f.dot;
		rt.setFv(f, "name", live(f.args[0]), fmt("raw ＀ cutlet", [rt.sv(f, "subjectjob")]));
	}
	return f.dot;
}, true, { args: ["slice", "reagents_per_slice"] });

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/proc/initialize_cooked_food  (code/modules/food_and_drinks/food/snacks/meat.dm:50)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/proc/initialize_cooked_food", function* initialize_cooked_food(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "subjectname", live(f.args[0]), rt.sv(f, "subjectname"));
	rt.setFv(f, "subjectjob", live(f.args[0]), rt.sv(f, "subjectjob"));
	if (truthy(rt.sv(f, "subjectname"))) {
		rt.setFv(f, "name", live(f.args[0]), fmt("＀ meatsteak", [rt.sv(f, "subjectname")]));
	} else {
		if (!truthy(rt.sv(f, "subjectjob"))) return f.dot;
		rt.setFv(f, "name", live(f.args[0]), fmt("＀ meatsteak", [rt.sv(f, "subjectjob")]));
	}
	return f.dot;
}, true, { args: ["S", "cooking_efficiency"] });

rt.type(6209, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/slime", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#00FFFF",
	tastes: null,
	icon_state: "slimemeat",
	desc: "Because jello wasn't offensive enough to vegans.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/slime/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:64)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["slime", 1, "jelly", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "slimejelly", 3]));
	return f.dot;
});

rt.type(6210, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/golem", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#A9A9A9",
	tastes: null,
	icon_state: "golemmeat",
	desc: "Edible rocks, welcome to the future.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/golem/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:71)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/golem/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["rock", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "iron", 3]));
	return f.dot;
});

rt.type(6212, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/lizard", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#6B8E23",
	tastes: null,
	icon_state: "lizardmeat",
	desc: "Delicious dino damage",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/lizard/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:82)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/lizard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 4, "scales", 1]));
	return f.dot;
});

rt.type(6213, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/plant", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#E9967A",
	tastes: null,
	icon_state: "plantmeat",
	desc: "All the joys of healthy eating with all the fun of cannibalism.",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/plant/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:88)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/plant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["salad", 1, "wood", 1]));
	return f.dot;
});

rt.type(6214, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/shadow", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#202020",
	tastes: null,
	icon_state: "shadowmeat",
	desc: "Ow, the edge",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/shadow/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:94)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/shadow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["darkness", 1, "meat", 1]));
	return f.dot;
});

rt.type(6215, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/fly", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	tastes: null,
	icon_state: "flymeat",
	desc: "Nothing says tasty like maggot filled radioactive mutant flesh.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/fly/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:100)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/fly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["maggots", 1, "the inside of a reactor", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "uranium", 3]));
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/skeleton/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:107)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/skeleton/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["bone", 1]));
	return f.dot;
});

rt.type(6217, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/zombie", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant", {
	filling_color: "#6B8E23",
	tastes: null,
	name: " meat (rotten)",
	icon_state: "lizardmeat",
	desc: "Halfway to becoming fertilizer for your garden.",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/zombie/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:115)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/zombie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["brains", 1, "meat", 1]));
	return f.dot;
});

rt.type(6221, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", {
	tastes: null,
	name: "corgi meat",
	desc: "Tastes like... well you know...",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:136)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 4, "a fondness for wearing hats", 1]));
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/killertomato/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:150)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/killertomato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["tomato", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2]));
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/bear/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:160)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/bear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "salmon", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 12, "morphine", 5, "vitamin", 2]));
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:172)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "acid", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 1]));
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/spider/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:182)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/spider/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cobwebs", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "toxin", 3, "vitamin", 1]));
	return f.dot;
});

rt.type(6227, "/obj/item/weapon/reagent_containers/food/snacks/meat/slab/goliath", "/obj/item/weapon/reagent_containers/food/snacks/meat/slab", {
	tastes: null,
	name: "goliath meat",
	desc: "A slab of goliath meat. It's not very edible now, but it cooks great in lava.",
	list_reagents: null,
	icon_state: "goliathmeat",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/goliath/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:190)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/goliath/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "toxin", 5]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/goliath/proc/burn  (code/modules/food_and_drinks/food/snacks/meat.dm:193)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/goliath/proc/burn", function* burn(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("＀ finishes cooking!", [live(f.src)]));
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/goliath"), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/slab/meatwheat/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:204)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/meatwheat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "wheat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "vitamin", 2, "blood", 5]));
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/rawbacon/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:214)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawbacon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["bacon", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1]));
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/bacon/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:221)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/bacon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["bacon", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2]));
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/steak/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:233)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 2, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5]));
	return f.dot;
});

rt.type(6233, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human", "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain", {
	tastes: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:241)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/plain/human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["tender meat", 1]));
	return f.dot;
});

rt.type(6234, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/killertomato", "/obj/item/weapon/reagent_containers/food/snacks/meat/steak", {
	tastes: null,
	name: "killer tomato steak",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/steak/killertomato/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:245)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/killertomato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["tomato", 1]));
	return f.dot;
});

rt.type(6235, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/bear", "/obj/item/weapon/reagent_containers/food/snacks/meat/steak", {
	tastes: null,
	name: "bear steak",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/steak/bear/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:249)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/bear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "salmon", 1]));
	return f.dot;
});

rt.type(6236, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/xeno", "/obj/item/weapon/reagent_containers/food/snacks/meat/steak", {
	tastes: null,
	name: "xeno steak",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/steak/xeno/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:253)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/xeno/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "acid", 1]));
	return f.dot;
});

rt.type(6237, "/obj/item/weapon/reagent_containers/food/snacks/meat/steak/spider", "/obj/item/weapon/reagent_containers/food/snacks/meat/steak", {
	tastes: null,
	name: "spider steak",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/steak/spider/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:257)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/spider/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cobwebs", 1]));
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/steak/goliath/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:265)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/steak/goliath/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "rock", 1]));
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:279)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/proc/initialize_cooked_food  (code/modules/food_and_drinks/food/snacks/meat.dm:283)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/proc/initialize_cooked_food", function* initialize_cooked_food(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "name", live(f.args[0]), fmt("＀ cutlet", [rt.sv(f, "meat_type")]));
	return f.dot;
}, true, { args: ["S", "cooking_efficiency"] });

rt.type(6241, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain/human", "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain", {
	tastes: null,
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/plain/human"),
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain/human/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:291)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain/human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["tender meat", 1]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain/human/proc/initialize_cooked_food  (code/modules/food_and_drinks/food/snacks/meat.dm:294)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/plain/human/proc/initialize_cooked_food", function* initialize_cooked_food(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "subjectname"))) {
		rt.setFv(f, "name", live(f.args[0]), fmt("＀ ＀", [rt.sv(f, "subjectname"), rt.initial(f, live(f.args[0]), "name")]));
	} else {
		if (!truthy(rt.sv(f, "subjectjob"))) return f.dot;
		rt.setFv(f, "name", live(f.args[0]), fmt("＀ ＀", [rt.sv(f, "subjectjob"), rt.initial(f, live(f.args[0]), "name")]));
	}
	return f.dot;
}, true, { args: ["S", "cooking_efficiency"] });

rt.type(6242, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/killertomato", "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet", {
	tastes: null,
	name: "raw killer tomato cutlet",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/killertomato"),
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/killertomato/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:303)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/killertomato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["tomato", 1]));
	return f.dot;
});

rt.type(6243, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/bear", "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet", {
	tastes: null,
	name: "raw bear cutlet",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/bear"),
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/bear/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:308)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/bear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "salmon", 1]));
	return f.dot;
});

rt.type(6244, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/xeno", "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet", {
	tastes: null,
	name: "raw xeno cutlet",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/xeno"),
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/xeno/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:313)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/xeno/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "acid", 1]));
	return f.dot;
});

rt.type(6245, "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/spider", "/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet", {
	tastes: null,
	name: "raw spider cutlet",
	cooked_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/spider"),
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/spider/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:318)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/rawcutlet/spider/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cobwebs", 1]));
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

// /obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:328)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bonus_reagents", rt.alist(f, ["nutriment", 1, "vitamin", 1]));
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 2]));
	return f.dot;
});

rt.type(6248, "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/plain/human", "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/plain", {
	tastes: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/plain/human/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:335)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/plain/human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["tender meat", 1]));
	return f.dot;
});

rt.type(6249, "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/killertomato", "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet", {
	tastes: null,
	name: "killer tomato cutlet",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/killertomato/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:339)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/killertomato/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["tomato", 1]));
	return f.dot;
});

rt.type(6250, "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/bear", "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet", {
	tastes: null,
	name: "bear cutlet",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/bear/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:343)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/bear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "salmon", 1]));
	return f.dot;
});

rt.type(6251, "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/xeno", "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet", {
	tastes: null,
	name: "xeno cutlet",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/xeno/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:347)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/xeno/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["meat", 1, "acid", 1]));
	return f.dot;
});

rt.type(6252, "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/spider", "/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet", {
	tastes: null,
	name: "spider cutlet",
});

// /obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/spider/proc/<init>  (code/modules/food_and_drinks/food/snacks/meat.dm:351)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/meat/cutlet/spider/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tastes", rt.alist(f, ["cobwebs", 1]));
	return f.dot;
});
