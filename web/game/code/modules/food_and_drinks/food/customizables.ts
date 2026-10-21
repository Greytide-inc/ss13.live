// From code/modules/food_and_drinks/food/customizables.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5875, "/obj/item/weapon/reagent_containers/food/snacks/customizable", "/obj/item/weapon/reagent_containers/food/snacks", {
	ingMax: 12,
	ingredients: null,
	ingredients_placement: 1,
	customname: "custom",
	bitesize: 4,
	w_class: 2,
	volume: 80,
	unique_rename: 1,
});

// /obj/item/weapon/reagent_containers/food/snacks/customizable/proc/<init>  (code/modules/food_and_drinks/food/customizables.dm:21)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ingredients", rt.list());
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/customizable/proc/examine  (code/modules/food_and_drinks/food/customizables.dm:26)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/examine", function examine(f: Frame) {
	let ingredients_listed: Value = null, ING: Value = null, size: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [ingredients_listed, ING, size, $0, $1, $e];
	rt.callSuper(f, [], rt.Args.Same);
	ingredients_listed = "";
	ING = null;
	rt.forList(f, 0, rt.sv(f, "ingredients"), T("/obj/item/weapon/reagent_containers/food/snacks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ING = $e;
		ingredients_listed = rt.modify(live(ingredients_listed), fmt("＀, ", [rt.fv(f, "name", live(ING))]), add);
	}
	rt.endFor(f, 0);
	size = "standard";
	if (rt.lt(rt.len(f, rt.sv(f, "ingredients")), 2)) {
		size = "small";
	}
	if (rt.gt(rt.len(f, rt.sv(f, "ingredients")), 5)) {
		size = "big";
	}
	if (rt.gt(rt.len(f, rt.sv(f, "ingredients")), 8)) {
		size = "monster";
	}
	$0 = live(f.args[0]);
	if (truthy(rt.len(f, rt.sv(f, "ingredients")))) {
		$1 = fmt("＀", [live(ingredients_listed)]);
	} else {
		$1 = "no ingredient, ";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("It contains ＀making a ＀-sized ＀.", [$1, live(size), rt.initial(f, live(f.src), "name")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/reagent_containers/food/snacks/customizable/proc/attackby  (code/modules/food_and_drinks/food/customizables.dm:40)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if ((!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/customizable")) ? 1 : 0)) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0)))) {
		S = live(f.args[0]);
		if (rt.gt(rt.fv(f, "w_class", live(f.args[0])), 2)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ingredient is too big for ＀!</span>", [live(f.src)])]);
		} else {
			if ((rt.ge(rt.len(f, rt.sv(f, "ingredients")), rt.sv(f, "ingMax")) || rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "volume")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't add more ingredients to ＀!</span>", [live(f.src)])]);
			} else {
				if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/custom")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/custom")) ? 1 : 0)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Adding ＀ to ＀ would make a mess.</span>", [rt.fv(f, "name", live(f.args[0])), live(f.src)])]);
				} else {
					if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
						return live(f.dot);
					}
					if (truthy(rt.fv(f, "trash", live(S)))) {
						yield* g.callName(f, live(S), "generate_trash", [rt.getStep(f, live(f.args[1]), 0)]);
					}
					rt.modSrcVar(f, "ingredients", live(S), add);
					yield* g.srcCall(f, "mix_filling_color", live(S));
					yield* g.callName(f, rt.fv(f, "reagents", live(S)), "trans_to", [live(f.src), (yield* g.call(f, P("/proc/min"), null, [rt.gv(f, "total_volume", rt.fv(f, "reagents", live(S))), 15]))]);
					yield* g.srcCall(f, "update_overlays", live(S));
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add the ＀ to the ＀.</span>", [rt.fv(f, "name", live(f.args[0])), rt.sv(f, "name")])]);
					yield* g.srcCall(f, "update_name", live(S));
				}
			}
		}
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/reagent_containers/food/snacks/customizable/proc/update_name  (code/modules/food_and_drinks/food/customizables.dm:63)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/update_name", function update_name(f: Frame, S: Value) {
	let I: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [I, M, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "ingredients"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.op(f, "IsType", [], [live(S), rt.fv(f, "type", live(I))]))) {
			rt.setSv(f, "customname", "custom");
			break;
		}
	}
	rt.endFor(f, 0);
	if (isEqual(rt.len(f, rt.sv(f, "ingredients")), 1)) {
		if (truthy((rt.istype(live(S), T("/obj/item/weapon/reagent_containers/food/snacks/meat")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "subjectname", (M = live(S))))) {
				rt.setSv(f, "customname", fmt("＀", [rt.fv(f, "subjectname", live(M))]));
			} else {
				if (truthy(rt.fv(f, "subjectjob", live(M)))) {
					rt.setSv(f, "customname", fmt("＀", [rt.fv(f, "subjectjob", live(M))]));
				} else {
					rt.setSv(f, "customname", rt.fv(f, "name", live(S)));
				}
			}
		} else {
			rt.setSv(f, "customname", rt.fv(f, "name", live(S)));
		}
	}
	rt.setSv(f, "name", fmt("＀ ＀", [rt.sv(f, "customname"), rt.initial(f, live(f.src), "name")]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/customizable/proc/initialize_custom_food  (code/modules/food_and_drinks/food/customizables.dm:81)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/initialize_custom_food", function* initialize_custom_food(f: Frame, BASE: Value, I: Value, user: Value) {
	let RC: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [BASE, I, user, RC, O, $e];
	if (truthy((rt.istype(live(BASE), T("/obj/item/weapon/reagent_containers")) ? 1 : 0))) {
		yield* g.callName(f, rt.gv(f, "reagents", (RC = live(BASE))), "trans_to", [live(f.src), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(RC)))]);
	}
	O = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(BASE)), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.modSrcVar(f, "contents", live(O), add);
	}
	rt.endFor(f, 0);
	if ((truthy(live(I)) && truthy(live(user)))) {
		yield* g.srcCall(f, "attackby", live(I), live(user));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(BASE)]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/customizable/proc/mix_filling_color  (code/modules/food_and_drinks/food/customizables.dm:91)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/mix_filling_color", function mix_filling_color(f: Frame, S: Value) {
	let rgbcolor: Value = null, customcolor: Value = null, ingcolor: Value = null;
	f.vars = () => [rgbcolor, customcolor, ingcolor];
	if (isEqual(rt.len(f, rt.sv(f, "ingredients")), 1)) {
		rt.setSv(f, "filling_color", rt.fv(f, "filling_color", live(S)));
	} else {
		rgbcolor = rt.list(0, 0, 0, 0);
		customcolor = rt.call(f, P("/proc/GetColors"), null, [rt.sv(f, "filling_color")]);
		ingcolor = rt.call(f, P("/proc/GetColors"), null, [rt.fv(f, "filling_color", live(S))]);
		rt.setAt(live(rgbcolor), 1, divide(add(rt.index(live(customcolor), 1), rt.index(live(ingcolor), 1)), 2));
		rt.setAt(live(rgbcolor), 2, divide(add(rt.index(live(customcolor), 2), rt.index(live(ingcolor), 2)), 2));
		rt.setAt(live(rgbcolor), 3, divide(add(rt.index(live(customcolor), 3), rt.index(live(ingcolor), 3)), 2));
		rt.setAt(live(rgbcolor), 4, divide(add(rt.index(live(customcolor), 4), rt.index(live(ingcolor), 4)), 2));
		rt.setSv(f, "filling_color", rt.op(f, "Rgb", [1, 4], [rt.index(live(rgbcolor), 1), rt.index(live(rgbcolor), 2), rt.index(live(rgbcolor), 3), rt.index(live(rgbcolor), 4)]));
	}
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/customizable/proc/update_overlays  (code/modules/food_and_drinks/food/customizables.dm:104)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/update_overlays", function update_overlays(f: Frame, S: Value) {
	let filling: Value = null, TOP: Value = null;
	let $0: any;
	f.vars = () => [filling, TOP, $0];
	filling = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), fmt("＀_filling", [rt.initial(f, live(f.src), "icon_state")])]);
	if (isEqual(rt.fv(f, "filling_color", live(S)), "#FFFFFF")) {
		rt.setFv(f, "color", live(filling), rt.op(f, "PickUnweighted", [4], ["#FF0000", "#0000FF", "#008000", "#FFFF00"]));
	} else {
		rt.setFv(f, "color", live(filling), rt.fv(f, "filling_color", live(S)));
	}
	$0 = rt.sv(f, "ingredients_placement");
	if ($0 === 2) {
		rt.setFv(f, "pixel_x", live(filling), rt.call(f, P("/proc/rand"), null, [-1, 1]));
		rt.setFv(f, "pixel_y", live(filling), rt.call(f, P("/proc/rand"), null, [-1, 1]));
	} else if ($0 === 3) {
		rt.setFv(f, "pixel_x", live(filling), rt.call(f, P("/proc/rand"), null, [-1, 1]));
		rt.setFv(f, "pixel_y", live(filling), subtract(multiply(2, rt.len(f, rt.sv(f, "ingredients"))), 1));
	} else if ($0 === 4) {
		rt.setFv(f, "pixel_x", live(filling), rt.call(f, P("/proc/rand"), null, [-1, 1]));
		rt.setFv(f, "pixel_y", live(filling), subtract(multiply(2, rt.len(f, rt.sv(f, "ingredients"))), 1));
		if (truthy(rt.sv(f, "our_overlays"))) {
			rt.callName(f, rt.sv(f, "our_overlays"), "Cut", [rt.len(f, rt.sv(f, "ingredients"))]);
		}
		rt.setFv(f, "pixel_y", (TOP = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), fmt("＀_top", [rt.sv(f, "icon_state")])])), add(multiply(2, rt.len(f, rt.sv(f, "ingredients"))), 3));
		rt.callSrc(f, "add_overlay", [live(filling)]);
		rt.callSrc(f, "add_overlay", [live(TOP)]);
		return live(f.dot);
	} else if ($0 === 1) {
		rt.callSrc(f, "cut_overlays", []);
		rt.setFv(f, "color", live(filling), rt.sv(f, "filling_color"));
	} else if ($0 === 5) {
		rt.setFv(f, "pixel_x", live(filling), (rt.setFv(f, "pixel_y", live(filling), rt.call(f, P("/proc/rand"), null, [-8, 3]))));
	}
	rt.callSrc(f, "add_overlay", [live(filling)]);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/customizable/proc/initialize_slice  (code/modules/food_and_drinks/food/customizables.dm:137)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/initialize_slice", function* initialize_slice(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "filling_color", live(f.args[0]), rt.sv(f, "filling_color"));
	yield* g.callName(f, live(f.args[0]), "update_overlays", [live(f.src)]);
	return f.dot;
}, true, { args: ["slice", "reagents_per_slice"] });

// /obj/item/weapon/reagent_containers/food/snacks/customizable/proc/Destroy  (code/modules/food_and_drinks/food/customizables.dm:143)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/Destroy", function* Destroy(f: Frame) {
	let $e: any;
	f.vars = () => [$e];
	rt.forList(f, 0, rt.sv(f, "ingredients"));
	while (($e = rt.next(f, 0)) !== undefined) {
		f.dot = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(f.dot)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(5879, "/obj/item/weapon/reagent_containers/food/snacks/customizable/kebab", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	ingredients_placement: 5,
	ingMax: 6,
	name: "kebab",
	desc: "Delicious food on a stick.",
	trash: rt.typePath("/obj/item/stack/rods"),
	list_reagents: null,
	icon_state: "rod",
});

// /obj/item/weapon/reagent_containers/food/snacks/customizable/kebab/proc/<init>  (code/modules/food_and_drinks/food/customizables.dm:186)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/kebab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 1]));
	return f.dot;
});

rt.type(5884, "/obj/item/weapon/reagent_containers/food/snacks/customizable/sandwich", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	finished: 0,
	ingredients_placement: 3,
	name: "toast",
	desc: "A timeless classic.",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "breadslice",
});

// /obj/item/weapon/reagent_containers/food/snacks/customizable/sandwich/proc/initialize_custom_food  (code/modules/food_and_drinks/food/customizables.dm:237)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/sandwich/proc/initialize_custom_food", function* initialize_custom_food(f: Frame) {
	rt.setSv(f, "icon_state", rt.fv(f, "icon_state", live(f.args[0])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["BASE", "I", "user"] });

// /obj/item/weapon/reagent_containers/food/snacks/customizable/sandwich/proc/attackby  (code/modules/food_and_drinks/food/customizables.dm:240)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/sandwich/proc/attackby", function* attackby(f: Frame) {
	let BS: Value = null, TOP: Value = null, filling: Value = null;
	f.vars = () => [BS, TOP, filling];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/breadslice")) ? 1 : 0))) {
		BS = live(f.args[0]);
		if (truthy(rt.sv(f, "finished"))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You finish the ＀.</span>", [rt.fv(f, "name", live(f.src))])]);
		rt.setSv(f, "finished", 1);
		rt.setSv(f, "name", fmt("＀ sandwich", [rt.sv(f, "customname")]));
		yield* g.callName(f, rt.fv(f, "reagents", live(BS)), "trans_to", [live(f.src), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(BS)))]);
		rt.setSv(f, "ingMax", rt.len(f, rt.sv(f, "ingredients")));
		rt.setFv(f, "pixel_y", (TOP = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), fmt("＀", [rt.fv(f, "icon_state", live(BS))])]))), add(multiply(2, rt.len(f, rt.sv(f, "ingredients"))), 3));
		yield* g.srcCall(f, "add_overlay", live(TOP));
		if (truthy((rt.istype(live(BS), T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/custom")) ? 1 : 0))) {
			rt.setFv(f, "color", (filling = (yield* g.new_(f, T("/mutable_appearance"), [rt.sv(f, "icon"), fmt("＀_filling", [rt.initial(f, live(BS), "icon_state")])]))), rt.fv(f, "filling_color", live(BS)));
			rt.setFv(f, "pixel_y", live(filling), add(multiply(2, rt.len(f, rt.sv(f, "ingredients"))), 3));
			yield* g.srcCall(f, "add_overlay", live(filling));
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(BS)]);
		return live(f.dot);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(5885, "/obj/item/weapon/reagent_containers/food/snacks/customizable/soup", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	ingMax: 8,
	name: "soup",
	desc: "A bowl with liquid and... stuff in it.",
	trash: rt.typePath("/obj/item/weapon/reagent_containers/glass/bowl"),
	icon: rt.rsc("icons/obj/food/soupsalad.dmi"),
	icon_state: "wishsoup",
});

// /obj/item/weapon/reagent_containers/food/snacks/customizable/soup/proc/New  (code/modules/food_and_drinks/food/customizables.dm:272)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/soup/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "eatverb", rt.op(f, "PickUnweighted", [5], ["slurp", "sip", "suck", "inhale", "drink"]));
	return f.dot;
}, true);

rt.type(6392, "/obj/item/weapon/reagent_containers/glass/bowl", "/obj/item/weapon/reagent_containers/glass", {
	container_type: 4096,
	name: "bowl",
	desc: "A simple bowl, used for soups and salads.",
	icon: rt.rsc("icons/obj/food/soupsalad.dmi"),
	icon_state: "bowl",
	materials: null,
	w_class: 3,
});

// /obj/item/weapon/reagent_containers/glass/bowl/proc/<init>  (code/modules/food_and_drinks/food/customizables.dm:287)
rt.def("/obj/item/weapon/reagent_containers/glass/bowl/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 500]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/bowl/proc/attackby  (code/modules/food_and_drinks/food/customizables.dm:291)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bowl/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, A: Value = null;
	f.vars = () => [S, A];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0))) {
		S = live(f.args[0]);
		if (rt.gt(rt.fv(f, "w_class", live(f.args[0])), 2)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ingredient is too big for ＀!</span>", [live(f.src)])]);
		} else {
			if (rt.ge(rt.len(f, rt.sv(f, "contents")), 20)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't add more ingredients to ＀!</span>", [live(f.src)])]);
			} else {
				if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["water", 10])))) {
					yield* g.callName(f, (A = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/customizable/soup"), [rt.getStep(f, live(f.src), 0)]))), "initialize_custom_food", [live(f.src), live(S), live(f.args[1])]);
				} else {
					yield* g.callName(f, (A = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/customizable/salad"), [rt.getStep(f, live(f.src), 0)]))), "initialize_custom_food", [live(f.src), live(S), live(f.args[1])]);
				}
			}
		}
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return live(f.dot);
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/reagent_containers/glass/bowl/proc/on_reagent_change  (code/modules/food_and_drinks/food/customizables.dm:308)
rt.def("/obj/item/weapon/reagent_containers/glass/bowl/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/bowl/proc/update_icon  (code/modules/food_and_drinks/food/customizables.dm:312)
rt.def("/obj/item/weapon/reagent_containers/glass/bowl/proc/update_icon", function update_icon(f: Frame) {
	let filling: Value = null;
	f.vars = () => [filling];
	rt.callSrc(f, "cut_overlays", []);
	if ((truthy(rt.sv(f, "reagents")) && truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) {
		rt.setFv(f, "color", (filling = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/food/soupsalad.dmi"), "fullbowl"])), rt.call(f, P("/proc/mix_color_from_reagents"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]));
		rt.callSrc(f, "add_overlay", [live(filling)]);
	} else {
		rt.setSv(f, "icon_state", "bowl");
	}
	return f.dot;
});
