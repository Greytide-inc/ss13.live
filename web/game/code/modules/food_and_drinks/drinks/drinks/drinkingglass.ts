// From code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5863, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "drinking glass",
	desc: "Your standard drinking glass.",
	icon_state: "glass_empty",
	amount_per_transfer_from_this: 10,
	volume: 50,
	materials: null,
	obj_integrity: 20,
	max_integrity: 20,
	spillable: 1,
	resistance_flags: 32,
	unique_rename: 1,
});

// /obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm:9)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 500]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/on_reagent_change  (code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm:17)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	let R: Value = null, reagent_overlay: Value = null;
	f.vars = () => [R, reagent_overlay];
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents"))))) {
		rt.setSv(f, "name", rt.gv(f, "glass_name", (R = rt.callName(f, rt.sv(f, "reagents"), "get_master_reagent", []))));
		rt.setSv(f, "desc", rt.fv(f, "glass_desc", live(R)));
		if (truthy(rt.fv(f, "glass_icon_state", live(R)))) {
			rt.setSv(f, "icon_state", rt.fv(f, "glass_icon_state", live(R)));
		} else {
			rt.setFv(f, "color", (reagent_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "glassoverlay"])), rt.call(f, P("/proc/mix_color_from_reagents"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]));
			rt.callSrc(f, "add_overlay", [live(reagent_overlay)]);
		}
	} else {
		rt.setSv(f, "icon_state", "glass_empty");
		rt.setSv(f, "name", "drinking glass");
		rt.setSv(f, "desc", "Your standard drinking glass.");
	}
	return f.dot;
});

rt.type(5864, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass", "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass", {
	gulp_size: 15,
	name: "shot glass",
	desc: "A shot glass - the universal symbol for bad decisions.",
	icon_state: "shotglass",
	amount_per_transfer_from_this: 15,
	possible_transfer_amounts: null,
	volume: 15,
	materials: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm:46)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 100]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass/proc/on_reagent_change  (code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm:51)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	let largest_reagent: Value = null, shot_overlay: Value = null;
	f.vars = () => [largest_reagent, shot_overlay];
	rt.callSrc(f, "cut_overlays", []);
	if (rt.lt(rt.sv(f, "gulp_size"), 15)) {
		rt.setSv(f, "gulp_size", 15);
	} else {
		rt.setSv(f, "gulp_size", rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 15)]), 15]));
	}
	if (rt.gt(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents"))), 0)) {
		largest_reagent = rt.callName(f, rt.sv(f, "reagents"), "get_master_reagent", []);
		rt.setSv(f, "name", "filled shot glass");
		rt.setSv(f, "desc", "The challenge is not taking as many as you can, but guessing what it is before you pass out.");
		if (truthy(rt.fv(f, "shot_glass_icon_state", live(largest_reagent)))) {
			rt.setSv(f, "icon_state", rt.fv(f, "shot_glass_icon_state", live(largest_reagent)));
		} else {
			rt.setSv(f, "icon_state", "shotglassclear");
			rt.setFv(f, "color", (shot_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "shotglassoverlay"])), rt.call(f, P("/proc/mix_color_from_reagents"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]));
			rt.callSrc(f, "add_overlay", [live(shot_overlay)]);
		}
	} else {
		rt.setSv(f, "icon_state", "shotglass");
		rt.setSv(f, "name", "shot glass");
		rt.setSv(f, "desc", "A shot glass - the universal symbol for bad decisions.");
		return live(f.dot);
	}
	return f.dot;
});

rt.type(5865, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled", "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass", {});

// /obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/proc/New  (code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm:79)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "on_reagent_change");
	return f.dot;
}, true);

rt.type(5866, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/soda", "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled", {
	name: "Soda Water",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/soda/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm:84)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/soda/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sodawater", 50]));
	return f.dot;
});

rt.type(5867, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/cola", "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled", {
	name: "Space Cola",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/cola/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm:88)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/cola/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["cola", 50]));
	return f.dot;
});

rt.type(5868, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/nuka_cola", "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled", {
	name: "Nuka Cola",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/nuka_cola/proc/<init>  (code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm:92)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/nuka_cola/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nuka_cola", 50]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/attackby  (code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm:95)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/attackby", function* attackby(f: Frame) {
	let E: Value = null;
	f.vars = () => [E];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/egg")) ? 1 : 0))) {
		E = live(f.args[0]);
		if (truthy(rt.sv(f, "reagents"))) {
			if (rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ is full.</span>", [live(f.src)])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You break ＀ in ＀.</span>", [live(E), live(f.src)])]);
				yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["eggyolk", 5]);
				yield* g.call(f, P("/proc/qdel"), null, [live(E)]);
			}
			return live(f.dot);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/attack  (code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm:109)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/attack", function* attack(f: Frame) {
	if ((((isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm") && truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) && truthy(rt.fv(f, "reagents", live(f.args[0])))) && truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ splashes the contents of ＀ onto ＀!</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='userdanger'>＀ splashes the contents of ＀ onto ＀!</span>", [live(f.args[1]), live(f.src), live(f.args[0])])]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "splashed", live(f.src)]);
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(f.args[0]), 1]);
		yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/afterattack  (code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm:119)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/afterattack", function* afterattack(f: Frame) {
	if ((!truthy(live(f.args[2])) || !truthy((yield* g.callSrc(f, "check_allowed_items", [null, live(f.args[0]), "target_self", 1], rt.Args.Named))))) {
		return live(f.dot);
	} else {
		if ((truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm"))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ splashes the contents of ＀ onto ＀!</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You splash the contents of ＀ onto ＀.</span>", [live(f.src), live(f.args[0])])]);
			yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(f.args[0]), 1]);
			yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });
