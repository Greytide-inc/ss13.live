// From code/modules/food_and_drinks/food/condiment.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6358, "/obj/item/weapon/reagent_containers/food/condiment", "/obj/item/weapon/reagent_containers/food", {
	possible_states: null,
	originalname: "condiment",
	container_type: 4096,
	name: "condiment container",
	desc: "Just your average condiment container.",
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "emptycondiment",
	possible_transfer_amounts: null,
	volume: 50,
});

// /obj/item/weapon/reagent_containers/food/condiment/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:17)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_states", rt.alist(f, ["ketchup", rt.list("ketchup", "ketchup bottle", "You feel more American already."), "capsaicin", rt.list("hotsauce", "hotsauce bottle", "You can almost TASTE the stomach ulcers now!"), "enzyme", rt.list("enzyme", "universal enzyme bottle", "Used in cooking various dishes"), "soysauce", rt.list("soysauce", "soy sauce bottle", "A salty soy-based flavoring"), "frostoil", rt.list("coldsauce", "coldsauce bottle", "Leaves the tongue numb in it's passage"), "sodiumchloride", rt.list("saltshakersmall", "salt shaker", "Salt. From space oceans, presumably"), "blackpepper", rt.list("peppermillsmall", "pepper mill", "Often used to flavor food or make people sneeze"), "cornoil", rt.list("oliveoil", "corn oil bottle", "A delicious oil used in cooking. Made from corn"), "sugar", rt.list("emptycondiment", "sugar bottle", "Tasty spacey sugar!"), "mayonnaise", rt.list("mayonnaise", "mayonnaise jar", "An oily condiment made from egg yolks.")]));
	rt.setSv(f, "possible_transfer_amounts", rt.list(1, 5, 10, 15, 20, 25, 30, 50));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/condiment/proc/attack  (code/modules/food_and_drinks/food/condiment.dm:32)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/condiment/proc/attack", function* attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	let fraction: Value = null;
	f.vars = () => [M, user, def_zone, fraction];
	if ((!truthy(rt.sv(f, "reagents")) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>None of ＀ left, oh no!</span>", [live(f.src)])]);
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "canconsume", live(M), live(user))))) {
		return 0;
	}
	if (isEqual(live(M), live(user))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='notice'>You swallow some of contents of ％！.</span>", [live(f.src)])]);
	} else {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ attempts to feed ＀ from ＀.</span>", [live(user), live(M), live(f.src)])]);
		if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(M)])))) {
			return live(f.dot);
		}
		if ((!truthy(rt.sv(f, "reagents")) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ feeds ＀ from ＀.</span>", [live(user), live(M), live(f.src)])]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "fed", (yield* g.srcCall(f, "reagentlist", live(f.src)))]);
	}
	fraction = (yield* g.call(f, P("/proc/min"), null, [divide(10, rt.fv(f, "total_volume", rt.sv(f, "reagents"))), 1]));
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(M), 2, live(fraction)]);
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(M), 10]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(M)), rt.rsc("sound/items/drink.ogg"), (yield* g.call(f, P("/proc/rand"), null, [10, 50])), 1]);
	return 1;
}, true);

// /obj/item/weapon/reagent_containers/food/condiment/proc/afterattack  (code/modules/food_and_drinks/food/condiment.dm:57)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/condiment/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let trans: Value = null;
	f.vars = () => [target, user, proximity, trans];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/obj/structure/reagent_dispensers")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(target)])]);
			return live(f.dot);
		}
		if (rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is full!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		trans = (yield* g.callName(f, rt.fv(f, "reagents", live(target)), "trans_to", [live(f.src), rt.sv(f, "amount_per_transfer_from_this")]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You fill ＀ with ＀ units of the contents of ＀.</span>", [live(f.src), live(trans), live(target)])]);
	} else {
		if (!(truthy((yield* g.callName(f, live(target), "is_open_container", []))) || truthy((rt.istype(live(target), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0)))) return f.dot;
		if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(target))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>you can't add anymore to ＀!</span>", [live(target)])]);
			return live(f.dot);
		}
		trans = (yield* g.callName(f, rt.fv(f, "reagents", live(f.src)), "trans_to", [live(target), rt.sv(f, "amount_per_transfer_from_this")]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You transfer ＀ units of the condiment to ＀.</span>", [live(trans), live(target)])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/condiment/proc/on_reagent_change  (code/modules/food_and_drinks/food/condiment.dm:83)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	let main_reagent: Value = null, temp_list: Value = null;
	f.vars = () => [main_reagent, temp_list];
	if (!truthy(rt.len(f, rt.sv(f, "possible_states")))) {
		return live(f.dot);
	}
	if (rt.gt(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents"))), 0)) {
		if (truthy((rt.isIn(f, (main_reagent = rt.callName(f, rt.sv(f, "reagents"), "get_master_reagent_id", [])), rt.sv(f, "possible_states")) ? 1 : 0))) {
			rt.setSv(f, "icon_state", rt.index((temp_list = rt.index(rt.sv(f, "possible_states"), live(main_reagent))), 1));
			rt.setSv(f, "name", rt.index(live(temp_list), 2));
			rt.setSv(f, "desc", rt.index(live(temp_list), 3));
		} else {
			rt.setSv(f, "name", fmt("＀ bottle", [rt.sv(f, "originalname")]));
			main_reagent = rt.callName(f, rt.sv(f, "reagents"), "get_master_reagent_name", []);
			if (isEqual(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents"))), 1)) {
				rt.setSv(f, "desc", fmt("Looks like it is ＀, but you are not sure.", [rt.call(f, P("/proc/lowertext"), null, [live(main_reagent)])]));
			} else {
				rt.setSv(f, "desc", fmt("A mixture of various condiments. ＀ is one of them.", [rt.call(f, P("/proc/lowertext"), null, [live(main_reagent)])]));
			}
			rt.setSv(f, "icon_state", "mixedcondiments");
		}
	} else {
		rt.setSv(f, "icon_state", "emptycondiment");
		rt.setSv(f, "name", "condiment bottle");
		rt.setSv(f, "desc", "An empty condiment bottle.");
		return live(f.dot);
	}
	return f.dot;
});

rt.type(6359, "/obj/item/weapon/reagent_containers/food/condiment/enzyme", "/obj/item/weapon/reagent_containers/food/condiment", {
	name: "universal enzyme",
	desc: "Used in cooking various dishes.",
	icon_state: "enzyme",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/enzyme/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:111)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/enzyme/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["enzyme", 50]));
	return f.dot;
});

rt.type(6360, "/obj/item/weapon/reagent_containers/food/condiment/sugar", "/obj/item/weapon/reagent_containers/food/condiment", {
	name: "sugar bottle",
	desc: "Tasty spacey sugar!",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/sugar/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:116)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/sugar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sugar", 50]));
	return f.dot;
});

rt.type(6361, "/obj/item/weapon/reagent_containers/food/condiment/saltshaker", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "salt shaker",
	desc: "Salt. From space oceans, presumably.",
	icon_state: "saltshakersmall",
	possible_transfer_amounts: null,
	amount_per_transfer_from_this: 1,
	volume: 20,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:126)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_states", rt.list());
	rt.setSv(f, "possible_transfer_amounts", rt.list(1, 20));
	rt.setSv(f, "list_reagents", rt.alist(f, ["sodiumchloride", 20]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/on_reagent_change  (code/modules/food_and_drinks/food/condiment.dm:129)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (isEqual(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents"))), 0)) {
		rt.setSv(f, "icon_state", "emptyshaker");
	} else {
		rt.setSv(f, "icon_state", "saltshakersmall");
	}
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/suicide_act  (code/modules/food_and_drinks/food/condiment.dm:135)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	let newname: Value = null;
	f.vars = () => [newname];
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ begins to swap forms with the salt shaker! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_theyre", [])])]);
	newname = fmt("＀", [rt.sv(f, "name")]);
	rt.setSv(f, "name", fmt("＀", [rt.fv(f, "name", live(user))]));
	rt.setFv(f, "name", live(user), live(newname));
	rt.setFv(f, "real_name", live(user), live(newname));
	rt.setSv(f, "desc", "Salt. From dead crew, presumably.");
	return 4;
});

// /obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/afterattack  (code/modules/food_and_drinks/food/condiment.dm:144)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/afterattack", function* afterattack(f: Frame) {
	if (!truthy(live(f.args[2]))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])])))) {
		if (!truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["sodiumchloride", 2])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You don't have enough salt to make a pile!</span>"]);
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ shakes some salt onto ＀.</span>", [live(f.args[1]), live(f.args[0])]), fmt("<span class='notice'>You shake some salt onto ＀.</span>", [live(f.args[0])])]);
		yield* g.callName(f, rt.sv(f, "reagents"), "remove_reagent", ["sodiumchloride", 2]);
		yield* g.new_(f, T("/obj/effect/decal/cleanable/salt"), [live(f.args[0])]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });

rt.type(6362, "/obj/item/weapon/reagent_containers/food/condiment/peppermill", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "pepper mill",
	desc: "Often used to flavor food or make people sneeze.",
	icon_state: "peppermillsmall",
	possible_transfer_amounts: null,
	amount_per_transfer_from_this: 1,
	volume: 20,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/peppermill/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:164)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/peppermill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_states", rt.list());
	rt.setSv(f, "possible_transfer_amounts", rt.list(1, 20));
	rt.setSv(f, "list_reagents", rt.alist(f, ["blackpepper", 20]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/condiment/peppermill/proc/on_reagent_change  (code/modules/food_and_drinks/food/condiment.dm:167)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/peppermill/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (isEqual(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents"))), 0)) {
		rt.setSv(f, "icon_state", "emptyshaker");
	} else {
		rt.setSv(f, "icon_state", "peppermillsmall");
	}
	return f.dot;
});

rt.type(6363, "/obj/item/weapon/reagent_containers/food/condiment/milk", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "space milk",
	desc: "It's milk. White and nutritious goodness!",
	icon_state: "milk",
	item_state: "carton",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/milk/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:178)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/milk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_states", rt.list());
	rt.setSv(f, "list_reagents", rt.alist(f, ["milk", 50]));
	return f.dot;
});

rt.type(6364, "/obj/item/weapon/reagent_containers/food/condiment/flour", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "flour sack",
	desc: "A big bag of flour. Good for baking!",
	icon_state: "flour",
	item_state: "flour",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/flour/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:186)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/flour/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_states", rt.list());
	rt.setSv(f, "list_reagents", rt.alist(f, ["flour", 30]));
	return f.dot;
});

rt.type(6365, "/obj/item/weapon/reagent_containers/food/condiment/soymilk", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "soy milk",
	desc: "It's soy milk. White and nutritious goodness!",
	icon_state: "soymilk",
	item_state: "carton",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/soymilk/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:194)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/soymilk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_states", rt.list());
	rt.setSv(f, "list_reagents", rt.alist(f, ["soymilk", 50]));
	return f.dot;
});

rt.type(6366, "/obj/item/weapon/reagent_containers/food/condiment/rice", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "rice sack",
	desc: "A big bag of rice. Good for cooking!",
	icon_state: "rice",
	item_state: "flour",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/rice/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:202)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/rice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_states", rt.list());
	rt.setSv(f, "list_reagents", rt.alist(f, ["rice", 30]));
	return f.dot;
});

rt.type(6367, "/obj/item/weapon/reagent_containers/food/condiment/soysauce", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "soy sauce",
	desc: "A salty soy-based flavoring.",
	icon_state: "soysauce",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/soysauce/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:209)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/soysauce/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_states", rt.list());
	rt.setSv(f, "list_reagents", rt.alist(f, ["soysauce", 50]));
	return f.dot;
});

rt.type(6368, "/obj/item/weapon/reagent_containers/food/condiment/mayonnaise", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "mayonnaise",
	desc: "An oily condiment made from egg yolks.",
	icon_state: "mayonnaise",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/mayonnaise/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:216)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/mayonnaise/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_states", rt.list());
	rt.setSv(f, "list_reagents", rt.alist(f, ["mayonnaise", 50]));
	return f.dot;
});

rt.type(6369, "/obj/item/weapon/reagent_containers/food/condiment/pack", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "condiment pack",
	desc: "A small plastic pack with condiments to put on your food",
	icon_state: "condi_empty",
	volume: 10,
	amount_per_transfer_from_this: 10,
	possible_transfer_amounts: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/pack/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:229)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/pack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_states", rt.alist(f, ["ketchup", rt.list("condi_ketchup", "Ketchup", "You feel more American already."), "capsaicin", rt.list("condi_hotsauce", "Hotsauce", "You can almost TASTE the stomach ulcers now!"), "soysauce", rt.list("condi_soysauce", "Soy Sauce", "A salty soy-based flavoring"), "frostoil", rt.list("condi_frostoil", "Coldsauce", "Leaves the tongue numb in it's passage"), "sodiumchloride", rt.list("condi_salt", "Salt Shaker", "Salt. From space oceans, presumably"), "blackpepper", rt.list("condi_pepper", "Pepper Mill", "Often used to flavor food or make people sneeze"), "cornoil", rt.list("condi_cornoil", "Corn Oil", "A delicious oil used in cooking. Made from corn"), "sugar", rt.list("condi_sugar", "Sugar", "Tasty spacey sugar!")]));
	$0 = $0;
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/condiment/pack/proc/afterattack  (code/modules/food_and_drinks/food/condiment.dm:235)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/condiment/pack/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	f.vars = () => [target, user, proximity];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(target), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You tear open ＀, but there's nothing in it.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(target))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You tear open ＀, but ＀ is stacked so high that it just drips off!</span>", [live(f.src), live(target)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You tear open ＀ above ＀ and the condiments drip onto it.</span>", [live(f.src), live(target)])]);
		yield* g.callName(f, rt.fv(f, "reagents", live(f.src)), "trans_to", [live(target), rt.sv(f, "amount_per_transfer_from_this")]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/condiment/pack/proc/on_reagent_change  (code/modules/food_and_drinks/food/condiment.dm:253)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/pack/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	let main_reagent: Value = null, temp_list: Value = null;
	f.vars = () => [main_reagent, temp_list];
	if (rt.gt(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents"))), 0)) {
		if (truthy((rt.isIn(f, (main_reagent = rt.callName(f, rt.sv(f, "reagents"), "get_master_reagent_id", [])), rt.sv(f, "possible_states")) ? 1 : 0))) {
			rt.setSv(f, "icon_state", rt.index((temp_list = rt.index(rt.sv(f, "possible_states"), live(main_reagent))), 1));
			rt.setSv(f, "desc", rt.index(live(temp_list), 3));
		} else {
			rt.setSv(f, "icon_state", "condi_mixed");
			rt.setSv(f, "desc", fmt("A small condiment pack. The label says it contains ＀", [rt.sv(f, "originalname")]));
		}
	} else {
		rt.setSv(f, "icon_state", "condi_empty");
		rt.setSv(f, "desc", "A small condiment pack. It is empty.");
	}
	return f.dot;
});

rt.type(6370, "/obj/item/weapon/reagent_containers/food/condiment/pack/ketchup", "/obj/item/weapon/reagent_containers/food/condiment/pack", {
	originalname: "ketchup",
	name: "ketchup pack",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/pack/ketchup/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:270)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/pack/ketchup/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["ketchup", 10]));
	return f.dot;
});

rt.type(6371, "/obj/item/weapon/reagent_containers/food/condiment/pack/hotsauce", "/obj/item/weapon/reagent_containers/food/condiment/pack", {
	originalname: "hotsauce",
	name: "hotsauce pack",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/condiment/pack/hotsauce/proc/<init>  (code/modules/food_and_drinks/food/condiment.dm:276)
rt.def("/obj/item/weapon/reagent_containers/food/condiment/pack/hotsauce/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["capsaicin", 10]));
	return f.dot;
});
