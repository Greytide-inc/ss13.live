// From code/modules/food_and_drinks/drinks/drinks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5801, "/obj/item/weapon/reagent_containers/food/drinks", "/obj/item/weapon/reagent_containers/food", {
	gulp_size: 5,
	container_type: 4096,
	name: "drink",
	desc: "yummy",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: null,
	possible_transfer_amounts: null,
	volume: 50,
	resistance_flags: 0,
});

// /obj/item/weapon/reagent_containers/food/drinks/proc/New  (code/modules/food_and_drinks/drinks/drinks.dm:16)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/drinks/proc/on_reagent_change  (code/modules/food_and_drinks/drinks/drinks.dm:21)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (rt.lt(rt.sv(f, "gulp_size"), 5)) {
		rt.setSv(f, "gulp_size", 5);
	} else {
		rt.setSv(f, "gulp_size", rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 5)]), 5]));
	}
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/drinks/proc/attack  (code/modules/food_and_drinks/drinks/drinks.dm:26)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/proc/attack", function* attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	let fraction: Value = null;
	f.vars = () => [M, user, def_zone, fraction];
	if ((!truthy(rt.sv(f, "reagents")) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(f.src)])]);
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "canconsume", live(M), live(user))))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "is_open_container")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀'s lid hasn't been opened!</span>", [live(f.src)])]);
		return 0;
	}
	if (isEqual(live(M), live(user))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='notice'>You swallow a gulp of ＀.</span>", [live(f.src)])]);
	} else {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ attempts to feed the contents of ＀ to ＀.</span>", [live(user), live(f.src), live(M)]), fmt("<span class='userdanger'>＀ attempts to feed the contents of ＀ to ＀.</span>", [live(user), live(f.src), live(M)])]);
		if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(M)])))) {
			return live(f.dot);
		}
		if ((!truthy(rt.sv(f, "reagents")) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ feeds the contents of ＀ to ＀.</span>", [live(user), live(f.src), live(M)]), fmt("<span class='userdanger'>＀ feeds the contents of ＀ to ＀.</span>", [live(user), live(f.src), live(M)])]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "fed", (yield* g.srcCall(f, "reagentlist", live(f.src)))]);
	}
	fraction = (yield* g.call(f, P("/proc/min"), null, [divide(rt.sv(f, "gulp_size"), rt.fv(f, "total_volume", rt.sv(f, "reagents"))), 1]));
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(M), 2, live(fraction)]);
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(M), rt.sv(f, "gulp_size")]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(M)), rt.rsc("sound/items/drink.ogg"), (yield* g.call(f, P("/proc/rand"), null, [10, 50])), 1]);
	return 1;
}, true);

// /obj/item/weapon/reagent_containers/food/drinks/proc/afterattack  (code/modules/food_and_drinks/drinks/drinks.dm:55)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let trans: Value = null, refill: Value = null, trans_1: Value = null, bro: Value = null;
	f.vars = () => [target, user, proximity, trans, refill, trans_1, bro];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/obj/structure/reagent_dispensers")) ? 1 : 0))) {
		if (!truthy((yield* g.srcCall(f, "is_open_container")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀'s tab isn't open!</span>", [live(target)])]);
			return live(f.dot);
		}
		if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty.</span>", [live(target)])]);
			return live(f.dot);
		}
		if (rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is full.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		trans = (yield* g.callName(f, rt.fv(f, "reagents", live(target)), "trans_to", [live(f.src), rt.sv(f, "amount_per_transfer_from_this")]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You fill ＀ with ＀ units of the contents of ＀.</span>", [live(f.src), live(trans), live(target)])]);
	} else {
		if (!truthy((yield* g.callName(f, live(target), "is_open_container", [])))) return f.dot;
		if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(target))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is full.</span>", [live(target)])]);
			return live(f.dot);
		}
		refill = (yield* g.callName(f, rt.sv(f, "reagents"), "get_master_reagent_id", []));
		trans_1 = (yield* g.callName(f, rt.fv(f, "reagents", live(f.src)), "trans_to", [live(target), rt.sv(f, "amount_per_transfer_from_this")]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You transfer ＀ units of the solution to ＀.</span>", [live(trans_1), live(target)])]);
		if (!truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) return f.dot;
		yield* g.callName(f, rt.gv(f, "cell", (bro = live(user))), "use", [30]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "reagents"), P("/datum/reagents/proc/add_reagent"), live(refill), live(trans_1)])), 600]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/drinks/proc/attackby  (code/modules/food_and_drinks/drinks/drinks.dm:91)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/proc/attackby", function* attackby(f: Frame) {
	let added_heat: Value = null;
	f.vars = () => [added_heat];
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_hot", [])))) {
		added_heat = divide((yield* g.callName(f, live(f.args[0]), "is_hot", [])), 100);
		if (truthy(rt.sv(f, "reagents"))) {
			rt.modField(f, rt.sv(f, "reagents"), "chem_temp", live(added_heat), add);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You heat ＀ with ＀.</span>", [live(f.src), live(f.args[0])])]);
			yield* g.callName(f, rt.sv(f, "reagents"), "handle_reactions", []);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(5843, "/obj/item/weapon/reagent_containers/food/drinks/trophy", "/obj/item/weapon/reagent_containers/food/drinks", {
	flags: 64,
	container_type: 4096,
	name: "pewter cup",
	desc: "Everyone gets a trophy.",
	icon_state: "pewter_cup",
	w_class: 1,
	force: 1,
	throwforce: 1,
	amount_per_transfer_from_this: 5,
	materials: null,
	possible_transfer_amounts: null,
	volume: 5,
	spillable: 1,
	resistance_flags: 2,
});

// /obj/item/weapon/reagent_containers/food/drinks/trophy/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:117)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/trophy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100]));
	$0 = $0;
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	return f.dot;
});

rt.type(5844, "/obj/item/weapon/reagent_containers/food/drinks/trophy/gold_cup", "/obj/item/weapon/reagent_containers/food/drinks/trophy", {
	name: "gold cup",
	desc: "You're winner!",
	icon_state: "golden_cup",
	w_class: 4,
	force: 14,
	throwforce: 10,
	amount_per_transfer_from_this: 20,
	materials: null,
	volume: 150,
});

// /obj/item/weapon/reagent_containers/food/drinks/trophy/gold_cup/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:133)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/trophy/gold_cup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 1000]));
	return f.dot;
});

rt.type(5845, "/obj/item/weapon/reagent_containers/food/drinks/trophy/silver_cup", "/obj/item/weapon/reagent_containers/food/drinks/trophy", {
	name: "silver cup",
	desc: "Best loser!",
	icon_state: "silver_cup",
	w_class: 3,
	force: 10,
	throwforce: 8,
	amount_per_transfer_from_this: 15,
	materials: null,
	volume: 100,
});

// /obj/item/weapon/reagent_containers/food/drinks/trophy/silver_cup/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:144)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/trophy/silver_cup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$silver", 800]));
	return f.dot;
});

rt.type(5846, "/obj/item/weapon/reagent_containers/food/drinks/trophy/bronze_cup", "/obj/item/weapon/reagent_containers/food/drinks/trophy", {
	name: "bronze cup",
	desc: "At least you ranked!",
	icon_state: "bronze_cup",
	w_class: 2,
	force: 5,
	throwforce: 4,
	amount_per_transfer_from_this: 10,
	materials: null,
	volume: 25,
});

// /obj/item/weapon/reagent_containers/food/drinks/trophy/bronze_cup/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:156)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/trophy/bronze_cup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400]));
	return f.dot;
});

rt.type(5847, "/obj/item/weapon/reagent_containers/food/drinks/coffee", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "Robust Coffee",
	desc: "Careful, the beverage you're about to enjoy is extremely hot.",
	icon_state: "coffee",
	list_reagents: null,
	spillable: 1,
});

// /obj/item/weapon/reagent_containers/food/drinks/coffee/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:168)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/coffee/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["coffee", 30]));
	return f.dot;
});

rt.type(5848, "/obj/item/weapon/reagent_containers/food/drinks/ice", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "Ice Cup",
	desc: "Careful, cold ice, do not chew.",
	icon_state: "coffee",
	list_reagents: null,
	spillable: 1,
});

// /obj/item/weapon/reagent_containers/food/drinks/ice/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:175)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/ice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["ice", 30]));
	return f.dot;
});

rt.type(5849, "/obj/item/weapon/reagent_containers/food/drinks/mug", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "mug",
	desc: "A drink served in a classy mug.",
	icon_state: "tea",
	item_state: "coffee",
	spillable: 1,
});

// /obj/item/weapon/reagent_containers/food/drinks/mug/proc/on_reagent_change  (code/modules/food_and_drinks/drinks/drinks.dm:186)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/mug/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		rt.setSv(f, "icon_state", "tea");
	} else {
		rt.setSv(f, "icon_state", "tea_empty");
	}
	return f.dot;
});

rt.type(5850, "/obj/item/weapon/reagent_containers/food/drinks/mug/tea", "/obj/item/weapon/reagent_containers/food/drinks/mug", {
	name: "Duke Purple Tea",
	desc: "An insult to Duke Purple is an insult to the Space Queen! Any proper gentleman will fight you, if you sully this tea.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/mug/tea/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:194)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/mug/tea/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["tea", 30]));
	return f.dot;
});

rt.type(5851, "/obj/item/weapon/reagent_containers/food/drinks/mug/coco", "/obj/item/weapon/reagent_containers/food/drinks/mug", {
	name: "Dutch Hot Coco",
	desc: "Made in Space South America.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/mug/coco/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:199)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/mug/coco/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["hot_coco", 30, "sugar", 5]));
	return f.dot;
});

rt.type(5852, "/obj/item/weapon/reagent_containers/food/drinks/dry_ramen", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "Cup Ramen",
	desc: "Just add 10ml of water, self heats! A taste that reminds you of your school years.",
	icon_state: "ramen",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/dry_ramen/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:205)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/dry_ramen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["dry_ramen", 30]));
	return f.dot;
});

rt.type(5853, "/obj/item/weapon/reagent_containers/food/drinks/beer", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "Space Beer",
	desc: "Beer. In space.",
	icon_state: "beer",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/beer/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:211)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/beer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["beer", 30]));
	return f.dot;
});

rt.type(5854, "/obj/item/weapon/reagent_containers/food/drinks/ale", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "Magm-Ale",
	desc: "A true dorf's drink of choice.",
	icon_state: "alebottle",
	item_state: "beer",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/ale/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:218)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/ale/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["ale", 30]));
	return f.dot;
});

rt.type(5855, "/obj/item/weapon/reagent_containers/food/drinks/sillycup", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "paper cup",
	desc: "A paper water cup.",
	icon_state: "water_cup_e",
	possible_transfer_amounts: null,
	volume: 10,
	spillable: 1,
});

// /obj/item/weapon/reagent_containers/food/drinks/sillycup/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:224)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/sillycup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/drinks/sillycup/proc/on_reagent_change  (code/modules/food_and_drinks/drinks/drinks.dm:229)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/sillycup/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		rt.setSv(f, "icon_state", "water_cup");
	} else {
		rt.setSv(f, "icon_state", "water_cup_e");
	}
	return f.dot;
});

rt.type(5856, "/obj/item/weapon/reagent_containers/food/drinks/sillycup/smallcarton", "/obj/item/weapon/reagent_containers/food/drinks/sillycup", {
	name: "small carton",
	desc: "A small carton, intended for holding drinks.",
	icon_state: "juicebox",
	volume: 15,
});

// /obj/item/weapon/reagent_containers/food/drinks/sillycup/smallcarton/proc/on_reagent_change  (code/modules/food_and_drinks/drinks/drinks.dm:241)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/sillycup/smallcarton/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents"))))) {
		$0 = rt.callName(f, rt.sv(f, "reagents"), "get_master_reagent_id", []);
		if ($0 === "orangejuice") {
			rt.setSv(f, "icon_state", "orangebox");
			rt.setSv(f, "name", "orange juice box");
			rt.setSv(f, "desc", "A great source of vitamins. Stay healthy!");
		} else if ($0 === "milk") {
			rt.setSv(f, "icon_state", "milkbox");
			rt.setSv(f, "name", "carton of milk");
			rt.setSv(f, "desc", "An excellent source of calcium for growing space explorers.");
		} else if ($0 === "applejuice") {
			rt.setSv(f, "icon_state", "juicebox");
			rt.setSv(f, "name", "apple juice box");
			rt.setSv(f, "desc", "Sweet apple juice. Don't be late for school!");
		} else if ($0 === "grapejuice") {
			rt.setSv(f, "icon_state", "grapebox");
			rt.setSv(f, "name", "grape juice box");
			rt.setSv(f, "desc", "Tasty grape juice in a fun little container. Non-alcoholic!");
		} else if ($0 === "chocolate_milk") {
			rt.setSv(f, "icon_state", "chocolatebox");
			rt.setSv(f, "name", "carton of chocolate milk");
			rt.setSv(f, "desc", "Milk for cool kids!");
		} else if ($0 === "eggnog") {
			rt.setSv(f, "icon_state", "nog2");
			rt.setSv(f, "name", "carton of eggnog");
			rt.setSv(f, "desc", "For enjoying the most wonderful time of the year.");
		}
	} else {
		rt.setSv(f, "icon_state", "juicebox");
		rt.setSv(f, "name", "small carton");
		rt.setSv(f, "desc", "A small carton, intended for holding drinks.");
	}
	return f.dot;
});

rt.type(5857, "/obj/item/weapon/reagent_containers/food/drinks/shaker", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "shaker",
	desc: "A metal shaker to mix drinks in.",
	icon_state: "shaker",
	materials: null,
	amount_per_transfer_from_this: 10,
	volume: 100,
});

// /obj/item/weapon/reagent_containers/food/drinks/shaker/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:283)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/shaker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1500]));
	return f.dot;
});

rt.type(5858, "/obj/item/weapon/reagent_containers/food/drinks/flask", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "flask",
	desc: "Every good spaceman knows it's a good idea to bring along a couple of pints of whiskey wherever they go.",
	icon_state: "flask",
	materials: null,
	volume: 60,
});

// /obj/item/weapon/reagent_containers/food/drinks/flask/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:291)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/flask/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 250]));
	return f.dot;
});

rt.type(5859, "/obj/item/weapon/reagent_containers/food/drinks/flask/gold", "/obj/item/weapon/reagent_containers/food/drinks/flask", {
	name: "captain's flask",
	desc: "A gold flask belonging to the captain.",
	icon_state: "flask_gold",
	materials: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/flask/gold/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:298)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/flask/gold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 500]));
	return f.dot;
});

rt.type(5860, "/obj/item/weapon/reagent_containers/food/drinks/flask/det", "/obj/item/weapon/reagent_containers/food/drinks/flask", {
	name: "detective's flask",
	desc: "The detective's only true friend.",
	icon_state: "detflask",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/flask/det/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:304)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/flask/det/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["hearty_punch", 30]));
	return f.dot;
});

rt.type(5829, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", "/obj/item/weapon/reagent_containers/food/drinks", {
	container_type: 0,
	name: "soda can",
	spillable: 0,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/proc/attack  (code/modules/food_and_drinks/drinks/drinks.dm:333)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/proc/attack", function* attack(f: Frame) {
	let crushed_can: Value = null;
	f.vars = () => [crushed_can];
	if ((((isEqual(live(f.args[0]), live(f.args[1])) && !truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(f.src))))) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) && isEqual(rt.fv(f, "zone_selected", live(f.args[1])), "head"))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ crushes the can of ＀ on ＀ forehead!</span>", [live(f.args[1]), live(f.src), (yield* g.callName(f, live(f.args[1]), "p_their", []))]), fmt("<span class='notice'>You crush the can of ＀ on your forehead.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[1])), rt.rsc("sound/weapons/pierce.ogg"), (yield* g.call(f, P("/proc/rand"), null, [10, 50])), 1]);
		rt.setFv(f, "icon_state", (crushed_can = (yield* g.new_(f, T("/obj/item/trash/can"), [rt.fv(f, "loc", live(f.args[1]))]))), rt.sv(f, "icon_state"));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/proc/attack_self  (code/modules/food_and_drinks/drinks/drinks.dm:343)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/proc/attack_self", function attack_self(f: Frame) {
	if (!truthy(rt.callSrc(f, "is_open_container", []))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("You pull back the tab of ％！ with a satisfying pop.", [live(f.src)])]);
		rt.setSv(f, "container_type", 4096);
		rt.call(f, P("/proc/playsound"), null, [live(f.src), "can_open", 50, 1]);
		rt.setSv(f, "spillable", 1);
		return live(f.dot);
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user"] });

rt.type(5831, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/cola", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Space Cola",
	desc: "Cola. in space.",
	icon_state: "cola",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/cola/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:355)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/cola/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["cola", 30]));
	return f.dot;
});

rt.type(5832, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/tonic", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "T-Borg's Tonic Water",
	desc: "Quinine tastes funny, but at least it'll keep that Space Malaria away.",
	icon_state: "tonic",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/tonic/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:361)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/tonic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["tonic", 50]));
	return f.dot;
});

rt.type(5833, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/sodawater", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Soda Water",
	desc: "A can of soda water. Why not make a scotch and soda?",
	icon_state: "sodawater",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/sodawater/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:367)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/sodawater/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sodawater", 50]));
	return f.dot;
});

rt.type(5834, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Orange Soda",
	desc: "You wanted ORANGE. It gave you Lemon Lime.",
	icon_state: "lemon-lime",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:373)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["lemon_lime", 30]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime/proc/New  (code/modules/food_and_drinks/drinks/drinks.dm:376)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", "Lemon-Lime Soda");
	return f.dot;
}, true);

rt.type(5835, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_up", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Space-Up!",
	desc: "Tastes like a hull breach in your mouth.",
	icon_state: "space-up",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_up/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:383)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_up/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["space_up", 30]));
	return f.dot;
});

rt.type(5836, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/starkist", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Star-kist",
	desc: "The taste of a star in liquid form. And, a bit of tuna...?",
	icon_state: "starkist",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/starkist/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:389)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/starkist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["cola", 15, "orangejuice", 15]));
	return f.dot;
});

rt.type(5837, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_mountain_wind", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Space Mountain Wind",
	desc: "Blows right through you like a space wind.",
	icon_state: "space_mountain_wind",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_mountain_wind/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:395)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_mountain_wind/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["spacemountainwind", 30]));
	return f.dot;
});

rt.type(5838, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/thirteenloko", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Thirteen Loko",
	desc: "The CMO has advised crew members that consumption of Thirteen Loko may result in seizures, blindness, drunkeness, or even death. Please Drink Responsibly.",
	icon_state: "thirteen_loko",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/thirteenloko/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:401)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/thirteenloko/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["thirteenloko", 30]));
	return f.dot;
});

rt.type(5839, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/dr_gibb", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Dr. Gibb",
	desc: "A delicious mixture of 42 different flavors.",
	icon_state: "dr_gibb",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/dr_gibb/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:407)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/dr_gibb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["dr_gibb", 30]));
	return f.dot;
});

rt.type(5840, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/pwr_game", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Pwr Game",
	desc: "The only drink with the PWR that true gamers crave.",
	icon_state: "purple_can",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/pwr_game/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:413)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/pwr_game/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["pwr_game", 30]));
	return f.dot;
});

rt.type(5841, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/shamblers", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Shambler's Juice",
	desc: "~Shake me up some of that Shambler's Juice!~",
	icon_state: "shamblers",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/shamblers/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:419)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/shamblers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["shamblers", 30]));
	return f.dot;
});

rt.type(5842, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/air", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Canned Air",
	desc: "There is no air shortage. Do not drink.",
	icon_state: "air",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/air/proc/<init>  (code/modules/food_and_drinks/drinks/drinks.dm:425)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/air/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nitrogen", 24, "oxygen", 6]));
	return f.dot;
});
