// From code/modules/food_and_drinks/food/snacks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5870, "/obj/item/weapon/reagent_containers/food/snacks", "/obj/item/weapon/reagent_containers/food", {
	bitesize: 2,
	bitecount: 0,
	trash: null,
	slice_path: null,
	slices_num: null,
	eatverb: null,
	dried_type: null,
	dry: 0,
	cooked_type: null,
	filling_color: "#FFFFFF",
	custom_food_type: null,
	junkiness: 0,
	bonus_reagents: null,
	customfoodfilling: 1,
	tastes: null,
	name: "snack",
	desc: "Yummy.",
	icon: rt.rsc("icons/obj/food/food.dmi"),
	icon_state: null,
	unique_rename: 1,
});

// /obj/item/weapon/reagent_containers/food/snacks/proc/add_initial_reagents  (code/modules/food_and_drinks/food/snacks.dm:26)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/add_initial_reagents", function* add_initial_reagents(f: Frame) {
	let rid: Value = null, amount: Value = null;
	let $e: any;
	f.vars = () => [rid, amount, $e];
	if ((truthy(rt.sv(f, "tastes")) && truthy(rt.len(f, rt.sv(f, "tastes"))))) {
		if (truthy(rt.sv(f, "list_reagents"))) {
			rid = null;
			rt.forList(f, 0, rt.sv(f, "list_reagents"));
			while (($e = rt.next(f, 0)) !== undefined) {
				rid = $e;
				amount = rt.index(rt.sv(f, "list_reagents"), live(rid));
				if ((isEqual(live(rid), "nutriment") || isEqual(live(rid), "vitamin"))) {
					yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [live(rid), live(amount), (yield* g.callName(f, rt.sv(f, "tastes"), "Copy", []))]);
				} else {
					yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [live(rid), live(amount)]);
				}
			}
			rt.endFor(f, 0);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/proc/On_Consume  (code/modules/food_and_drinks/food/snacks.dm:38)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/On_Consume", function* On_Consume(f: Frame) {
	let trash_item: Value = null;
	f.vars = () => [trash_item];
	if (!truthy(live(f.usr))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) return f.dot;
	trash_item = (yield* g.srcCall(f, "generate_trash", live(f.usr)));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.callName(f, live(f.usr), "put_in_hands", [live(trash_item)]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/proc/attack  (code/modules/food_and_drinks/food/snacks.dm:51)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/attack", function* attack(f: Frame) {
	let fullness: Value = null, C: Value = null, fraction: Value = null;
	let $e: any;
	f.vars = () => [fullness, C, fraction, $e];
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy(rt.sv(f, "eatverb"))) {
		rt.setSv(f, "eatverb", rt.op(f, "PickUnweighted", [6], ["bite", "chew", "nibble", "gnaw", "gobble", "chomp"]));
	}
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>None of ＀ left, oh no!</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		if (!truthy((yield* g.srcCall(f, "canconsume", live(f.args[0]), live(f.args[1]))))) {
			return 0;
		}
		fullness = add(rt.fv(f, "nutrition", live(f.args[0])), 10);
		C = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(f.args[0]))), T("/datum/reagent/consumable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			fullness = rt.modify(live(fullness), divide(multiply(rt.fv(f, "nutriment_factor", live(C)), rt.fv(f, "volume", live(C))), rt.fv(f, "metabolization_rate", live(C))), add);
		}
		rt.endFor(f, 0);
		if (isEqual(live(f.args[0]), live(f.args[1]))) {
			if (((truthy(rt.sv(f, "junkiness")) && rt.lt(rt.fv(f, "satiety", live(f.args[0])), -150)) && rt.gt(rt.fv(f, "nutrition", live(f.args[0])), 200))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You don't feel like eating any more junk food at the moment.</span>"]);
				return 0;
			} else {
				if (rt.le(live(fullness), 50)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You hungrily ＀ some of ％！ and gobble it down!</span>", [rt.sv(f, "eatverb"), live(f.src)])]);
				} else {
					if ((rt.gt(live(fullness), 50) && rt.lt(live(fullness), 150))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You hungrily begin to ＀ ％！.</span>", [rt.sv(f, "eatverb"), live(f.src)])]);
					} else {
						if ((rt.gt(live(fullness), 150) && rt.lt(live(fullness), 500))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You ＀ ％！.</span>", [rt.sv(f, "eatverb"), live(f.src)])]);
						} else {
							if ((rt.gt(live(fullness), 500) && rt.lt(live(fullness), 600))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You unwillingly ＀ a bit of ％！.</span>", [rt.sv(f, "eatverb"), live(f.src)])]);
							} else {
								if (rt.gt(live(fullness), multiply(600, add(1, divide(rt.fv(f, "overeatduration", live(f.args[0])), 2000))))) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You cannot force any more of ％！ to go down your throat!</span>", [live(f.src)])]);
									return 0;
								}
							}
						}
					}
				}
			}
		} else {
			if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/brain")) ? 1 : 0))) {
				if (rt.le(live(fullness), multiply(600, add(1, divide(rt.fv(f, "overeatduration", live(f.args[0])), 1000))))) {
					yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ attempts to feed ＀ ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ attempts to feed ＀ ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)])]);
				} else {
					yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ cannot force any more of ＀ down ＀'s throat!</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='warning'>＀ cannot force any more of ＀ down ＀'s throat!</span>", [live(f.args[1]), live(f.src), live(f.args[0])])]);
					return 0;
				}
				if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.args[1]), live(f.args[0])])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "fed", (yield* g.srcCall(f, "reagentlist", live(f.src)))]);
				yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ forces ＀ to eat ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ forces ＀ to eat ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ doesn't seem to have a mouth!</span>", [live(f.args[0])])]);
				return live(f.dot);
			}
		}
		if (truthy(rt.sv(f, "reagents"))) {
			if (rt.gt(rt.fv(f, "satiety", live(f.args[0])), -200)) {
				(rt.modField(f, live(f.args[0]), "satiety", rt.sv(f, "junkiness"), subtract));
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[0])), rt.rsc("sound/items/eatfood.ogg"), (yield* g.call(f, P("/proc/rand"), null, [10, 50])), 1]);
			if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
				fraction = (yield* g.call(f, P("/proc/min"), null, [divide(rt.sv(f, "bitesize"), rt.fv(f, "total_volume", rt.sv(f, "reagents"))), 1]));
				yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(f.args[0]), 2, live(fraction)]);
				yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(f.args[0]), rt.sv(f, "bitesize")]);
				rt.incSrcVar(f, "bitecount", 1, true);
				yield* g.srcCall(f, "On_Consume");
			}
			return 1;
		}
	}
	return 0;
}, true, { args: ["M", "user", "def_zone"] });

// /obj/item/weapon/reagent_containers/food/snacks/proc/examine  (code/modules/food_and_drinks/food/snacks.dm:123)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.sv(f, "bitecount"), 0)) {
		return live(f.dot);
	} else {
		if (isEqual(rt.sv(f, "bitecount"), 1)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ was bitten by someone!", [live(f.src)])]);
		} else {
			if (rt.le(rt.sv(f, "bitecount"), 3)) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ was bitten ＀ times!", [live(f.src), rt.sv(f, "bitecount")])]);
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ was bitten multiple times!", [live(f.src)])]);
			}
		}
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/reagent_containers/food/snacks/proc/attackby  (code/modules/food_and_drinks/food/snacks.dm:135)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, C: Value = null, sharp: Value = null;
	f.vars = () => [S, C, sharp];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage")) ? 1 : 0))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0))) {
		S = live(f.args[0]);
		if ((truthy(rt.sv(f, "custom_food_type")) && truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "custom_food_type")]))))) {
			if (rt.gt(rt.fv(f, "w_class", live(S)), 2)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is too big for ＀!</span>", [live(S), live(f.src)])]);
				return 0;
			}
			if ((((!truthy(rt.fv(f, "customfoodfilling", live(S))) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/customizable")) ? 1 : 0))) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/custom")) ? 1 : 0))) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/custom")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ can't be filled with ＀!</span>", [live(f.src), live(S)])]);
				return 0;
			}
			if (rt.ge(rt.len(f, rt.sv(f, "contents")), 20)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't add more ingredients to ＀!</span>", [live(f.src)])]);
				return 0;
			}
			yield* g.callName(f, (C = (yield* g.new_(f, rt.sv(f, "custom_food_type"), [rt.getStep(f, live(f.src), 0)]))), "initialize_custom_food", [live(f.src), live(S), live(f.args[1])]);
			return 0;
		}
	}
	if (truthy((sharp = (yield* g.callName(f, live(f.args[0]), "is_sharp", []))))) {
		if (truthy((yield* g.srcCall(f, "slice", live(sharp), live(f.args[0]), live(f.args[1]))))) {
			return 1;
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/reagent_containers/food/snacks/proc/CheckParts  (code/modules/food_and_drinks/food/snacks.dm:162)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/CheckParts", function* CheckParts(f: Frame) {
	let RC: Value = null, A: Value = null, B: Value = null, r_id: Value = null, amount: Value = null;
	let $e: any;
	f.vars = () => [RC, A, B, r_id, amount, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
	RC = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/reagent_containers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RC = $e;
		yield* g.callName(f, rt.fv(f, "reagents", live(RC)), "trans_to", [rt.sv(f, "reagents"), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(RC)))]);
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype(live(f.args[1]), T("/datum/crafting_recipe/food")) ? 1 : 0))) {
		A = null;
		rt.forList(f, 0, rt.sv(f, "contents"));
		loop23: while (true) {
			if (($e = rt.next(f, 0)) === undefined) break;
			A = $e;
			B = null;
			rt.forList(f, 1, rt.fv(f, "real_parts", live(f.args[1])));
			while (($e = rt.next(f, 1)) !== undefined) {
				B = $e;
				if (truthy(rt.op(f, "IsType", [], [live(A), live(B)]))) {
					continue loop23;
				}
			}
			rt.endFor(f, 1);
			yield* g.call(f, P("/proc/qdel"), null, [live(A)]);
		}
		rt.endFor(f, 0);
	}
	if (!(truthy(rt.sv(f, "bonus_reagents")) && truthy(rt.len(f, rt.sv(f, "bonus_reagents"))))) return f.dot;
	r_id = null;
	rt.forList(f, 0, rt.sv(f, "bonus_reagents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		r_id = $e;
		amount = rt.index(rt.sv(f, "bonus_reagents"), live(r_id));
		if ((isEqual(live(r_id), "nutriment") || isEqual(live(r_id), "vitamin"))) {
			yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [live(r_id), live(amount), rt.sv(f, "tastes")]);
		} else {
			yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [live(r_id), live(amount)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["parts_list", "R"] });

// /obj/item/weapon/reagent_containers/food/snacks/proc/slice  (code/modules/food_and_drinks/food/snacks.dm:184)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/slice", function* slice(f: Frame, accuracy: Value, W: Value, user: Value) {
	let slices_lost: Value = null, reagents_per_slice: Value = null, i: Value = null, slice: Value = null;
	let $e: any;
	f.vars = () => [accuracy, W, user, slices_lost, reagents_per_slice, i, slice, $e];
	if (((rt.le(rt.sv(f, "slices_num"), 0) || !truthy(rt.sv(f, "slices_num"))) || !truthy(rt.sv(f, "slice_path")))) {
		return 0;
	}
	if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))]))) || ((!truthy(rt.locateIn(f, T("/obj/structure/table"), rt.fv(f, "loc", live(f.src)))) && !truthy(rt.locateIn(f, T("/obj/structure/table/optable"), rt.fv(f, "loc", live(f.src))))) && !truthy(rt.locateIn(f, T("/obj/item/weapon/storage/bag/tray"), rt.fv(f, "loc", live(f.src))))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot slice ＀ here! You need a table or at least a tray.</span>", [live(f.src)])]);
		return 0;
	}
	slices_lost = 0;
	if (rt.ge(live(accuracy), 2)) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ slices ＀.", [live(user), live(f.src)]), fmt("<span class='notice'>You slice ＀.</span>", [live(f.src)])]);
	} else {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ inaccurately slices ＀ with ＀!", [live(user), live(f.src), live(W)]), fmt("<span class='notice'>You inaccurately slice ＀ with your ＀!</span>", [live(f.src), live(W)])]);
		slices_lost = (yield* g.call(f, P("/proc/rand"), null, [1, (yield* g.call(f, P("/proc/min"), null, [1, (yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "slices_num"), 2)]))]))]));
	}
	reagents_per_slice = divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "slices_num"));
	i = null;
	rt.forRange(f, 0, 1, subtract(rt.sv(f, "slices_num"), live(slices_lost)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.srcCall(f, "initialize_slice", (slice = (yield* g.new_(f, rt.sv(f, "slice_path"), [rt.sv(f, "loc")]))), live(reagents_per_slice));
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 1;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/proc/initialize_slice  (code/modules/food_and_drinks/food/snacks.dm:217)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/initialize_slice", function* initialize_slice(f: Frame, slice: Value, reagents_per_slice: Value) {
	f.vars = () => [slice, reagents_per_slice];
	yield* g.callName(f, live(slice), "create_reagents", [rt.fv(f, "volume", live(slice))]);
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(slice), live(reagents_per_slice)]);
	if (!isEqual(rt.sv(f, "name"), rt.initial(f, live(f.src), "name"))) {
		rt.setFv(f, "name", live(slice), fmt("slice of ＀", [rt.sv(f, "name")]));
	}
	if (isEqual(rt.sv(f, "desc"), rt.initial(f, live(f.src), "desc"))) return f.dot;
	rt.setFv(f, "desc", live(slice), fmt("＀", [rt.sv(f, "desc")]));
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/proc/generate_trash  (code/modules/food_and_drinks/food/snacks.dm:226)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/generate_trash", function* generate_trash(f: Frame, location: Value) {
	let trash_item: Value = null;
	f.vars = () => [location, trash_item];
	if (!truthy(rt.sv(f, "trash"))) return f.dot;
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "trash"), T("/obj/item")])))) {
		f.dot = (yield* g.new_(f, rt.sv(f, "trash"), [live(location)]));
		rt.setSv(f, "trash", null);
		return live(f.dot);
	} else {
		if (!truthy((rt.istype(rt.sv(f, "trash"), T("/obj/item")) ? 1 : 0))) return f.dot;
		yield* g.callName(f, (trash_item = rt.sv(f, "trash")), "forceMove", [live(location)]);
		f.dot = rt.sv(f, "trash");
		rt.setSv(f, "trash", null);
		return live(f.dot);
	}
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/proc/update_overlays  (code/modules/food_and_drinks/food/snacks.dm:238)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/update_overlays", function update_overlays(f: Frame, S: Value) {
	let filling: Value = null;
	f.vars = () => [filling];
	rt.callSrc(f, "cut_overlays", []);
	filling = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), fmt("＀_filling", [rt.initial(f, live(f.src), "icon_state")])]);
	if (isEqual(rt.fv(f, "filling_color", live(S)), "#FFFFFF")) {
		rt.setFv(f, "color", live(filling), rt.op(f, "PickUnweighted", [4], ["#FF0000", "#0000FF", "#008000", "#FFFF00"]));
	} else {
		rt.setFv(f, "color", live(filling), rt.fv(f, "filling_color", live(S)));
	}
	rt.callSrc(f, "add_overlay", [live(filling)]);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/proc/initialize_cooked_food  (code/modules/food_and_drinks/food/snacks.dm:249)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/initialize_cooked_food", function* initialize_cooked_food(f: Frame, S: Value, cooking_efficiency: Value) {
	let r_id: Value = null, amount: Value = null;
	let $e: any;
	f.vars = () => [S, cooking_efficiency, r_id, amount, $e];
	if (live(cooking_efficiency) === null) {
		cooking_efficiency = 1;
	}
	yield* g.callName(f, live(S), "create_reagents", [rt.fv(f, "volume", live(S))]);
	if (truthy(rt.sv(f, "reagents"))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(S), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
	}
	if (!(truthy(rt.fv(f, "bonus_reagents", live(S))) && truthy(rt.getLen(f, rt.fv(f, "bonus_reagents", live(S)))))) return f.dot;
	r_id = null;
	rt.forList(f, 0, rt.fv(f, "bonus_reagents", live(S)));
	while (($e = rt.next(f, 0)) !== undefined) {
		r_id = $e;
		amount = multiply(rt.index(rt.fv(f, "bonus_reagents", live(S)), live(r_id)), live(cooking_efficiency));
		if ((isEqual(live(r_id), "nutriment") || isEqual(live(r_id), "vitamin"))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(S)), "add_reagent", [live(r_id), live(amount), rt.sv(f, "tastes")]);
		} else {
			yield* g.callName(f, rt.fv(f, "reagents", live(S)), "add_reagent", [live(r_id), live(amount)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/proc/microwave_act  (code/modules/food_and_drinks/food/snacks.dm:262)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/microwave_act", function* microwave_act(f: Frame, M: Value) {
	let S: Value = null;
	f.vars = () => [M, S];
	if (truthy(rt.sv(f, "cooked_type"))) {
		S = (yield* g.new_(f, rt.sv(f, "cooked_type"), [rt.getStep(f, live(f.src), 0)]));
		if (truthy(live(M))) {
			yield* g.srcCall(f, "initialize_cooked_food", live(S), rt.fv(f, "efficiency", live(M)));
		} else {
			yield* g.srcCall(f, "initialize_cooked_food", live(S), 1);
		}
	} else {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/badrecipe"), [live(f.src)]);
		if ((truthy(live(M)) && rt.lt(rt.fv(f, "dirty", live(M)), 100))) {
			rt.incField(f, live(M), "dirty", 1, true);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/proc/Destroy  (code/modules/food_and_drinks/food/snacks.dm:276)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/Destroy", function* Destroy(f: Frame) {
	let something: Value = null;
	let $e: any;
	f.vars = () => [something, $e];
	if (truthy(rt.sv(f, "contents"))) {
		something = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			something = $e;
			rt.setFv(f, "loc", live(something), rt.getStep(f, live(f.src), 0));
		}
		rt.endFor(f, 0);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/proc/attack_animal  (code/modules/food_and_drinks/food/snacks.dm:281)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	let L: Value = null, sattisfaction_text: Value = null;
	f.vars = () => [M, L, sattisfaction_text];
	if (!truthy((rt.istype(live(M), T("/mob/living/simple_animal")) ? 1 : 0))) return f.dot;
	if (!truthy((rt.istype(live(M), T("/mob/living/simple_animal/pet/dog/corgi")) ? 1 : 0))) return f.dot;
	L = live(M);
	if ((isEqual(rt.sv(f, "bitecount"), 0) || truthy(rt.op(f, "Prob", [], [50])))) {
		yield* g.callName(f, live(M), "emote", ["me", 1, fmt("nibbles away at ％！", [live(f.src)])]);
	}
	rt.incSrcVar(f, "bitecount", 1, true);
	yield* g.callName(f, live(L), "taste", [rt.sv(f, "reagents")]);
	if (!rt.ge(rt.sv(f, "bitecount"), 5)) return f.dot;
	if (truthy((sattisfaction_text = rt.op(f, "PickUnweighted", [4], ["burps from enjoyment", "yaps for more", "woofs twice", fmt("looks at the area where ％！ was", [live(f.src)])])))) {
		yield* g.callName(f, live(M), "emote", ["me", 1, fmt("＀", [live(sattisfaction_text)])]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(5886, "/obj/item/weapon/reagent_containers/food/snacks/store", "/obj/item/weapon/reagent_containers/food/snacks", {
	stored_item: 0,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/food/snacks/store/proc/attackby  (code/modules/food_and_drinks/food/snacks.dm:333)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.bitAnd((rt.le(rt.fv(f, "w_class", live(f.args[0])), 2) ? 1 : 0), (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0)) ? 1 : 0)))) return f.dot;
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_sharp", [])))) {
		return 0;
	}
	if (truthy(rt.sv(f, "stored_item"))) {
		return 0;
	}
	if (!truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon")) ? 1 : 0))) {
		return 0;
	}
	if (rt.ge(rt.len(f, rt.sv(f, "contents")), 20)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is full.</span>", [live(f.src)])]);
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You slip ＀ inside ＀.</span>", [live(f.args[0]), live(f.src)])]);
	yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)]);
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	rt.modSrcVar(f, "contents", live(f.args[0]), add);
	rt.setSv(f, "stored_item", 1);
	return 1;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/reagent_containers/food/snacks/proc/MouseDrop  (code/modules/food_and_drinks/food/snacks.dm:352)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/MouseDrop", function* MouseDrop(f: Frame) {
	let _T: Value = null, TB: Value = null;
	f.vars = () => [_T, TB];
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy((TB = rt.locateIn(f, T("/obj/structure/table"), live(_T))))) {
		yield* g.callName(f, live(TB), "MouseDrop", [live(f.args[0])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["over"] });
