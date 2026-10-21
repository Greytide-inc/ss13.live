// From code/modules/food_and_drinks/kitchen_machinery/juicer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10896, "/obj/machinery/juicer", "/obj/machinery", {
	beaker: null,
	anchored: 0,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 100,
	pass_flags: 1,
	name: "juicer",
	desc: "a centrifugal juicer with two speeds: Juice and Separate.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "juicer1",
	layer: 2.9,
	density: 1,
}, { global: { allowed_items: 764 } });

// /obj/machinery/juicer/proc/Initialize  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:33)  may sleep
rt.def("/obj/machinery/juicer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "beaker", (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/large"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/machinery/juicer/proc/update_icon  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:37)
rt.def("/obj/machinery/juicer/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", add("juicer", rt.call(f, P("/proc/num2text"), null, [(rt.sv(f, "beaker") !== null ? 1 : 0)])));
	return live(f.dot);
});

// /obj/machinery/juicer/proc/attackby  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:42)  may sleep
rt.def("/obj/machinery/juicer/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	f.vars = () => [O, user, params];
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(user), live(O))))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass")) ? 1 : 0)))) {
		if (truthy(rt.sv(f, "beaker"))) {
			return 1;
		} else {
			if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(O), live(f.src)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [live(O), live(f.src)])]);
				return 0;
			}
			rt.setSv(f, "beaker", live(O));
			rt.modField(f, live(f.src), "verbs", P("/obj/machinery/juicer/verb/detach"), add);
			yield* g.srcCall(f, "update_icon");
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
			return 0;
		}
	}
	if (!truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(O), rt.gl("allowed_items")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "This object contains no fluid or extractable reagents."]);
		return 1;
	}
	if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(O), live(f.src)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [live(O), live(f.src)])]);
		return 0;
	}
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return 0;
}, true);

// /obj/machinery/juicer/proc/attack_paw  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:67)  may sleep
rt.def("/obj/machinery/juicer/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/juicer/proc/attack_hand  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:73)  may sleep
rt.def("/obj/machinery/juicer/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/juicer/proc/interact  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:79)
rt.def("/obj/machinery/juicer/proc/interact", function interact(f: Frame, user: Value) {
	let is_chamber_empty: Value = null, is_beaker_ready: Value = null, processing_chamber: Value = null, beaker_contents: Value = null, i: Value = null, O: Value = null, dat: Value = null;
	let $e: any;
	f.vars = () => [is_chamber_empty, is_beaker_ready, processing_chamber, beaker_contents, i, O, dat, $e];
	is_chamber_empty = 0;
	is_beaker_ready = 0;
	processing_chamber = "";
	beaker_contents = "";
	i = null;
	rt.forList(f, 0, rt.gl("allowed_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		O = null;
		rt.forList(f, 1, rt.fv(f, "contents", live(f.src)), T("/obj/item"));
		while (($e = rt.next(f, 1)) !== undefined) {
			O = $e;
			if (!truthy(rt.op(f, "IsType", [], [live(O), live(i)]))) {
				continue;
			}
			processing_chamber = rt.modify(live(processing_chamber), fmt("some <B>＀</B><BR>", [live(O)]), add);
			break;
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if (!truthy(live(processing_chamber))) {
		is_chamber_empty = 1;
		processing_chamber = "Nothing.";
	}
	if (!truthy(rt.sv(f, "beaker"))) {
		beaker_contents = fmt("＄！ has no container attached.", [live(f.src)]);
	} else {
		if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
			beaker_contents = fmt("＄！ has an empty ＀ attached.", [live(f.src), rt.sv(f, "beaker")]);
			is_beaker_ready = 1;
		} else {
			if (rt.lt(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
				beaker_contents = fmt("＄！ has a partially filled ＀ attached.", [live(f.src), rt.sv(f, "beaker")]);
				is_beaker_ready = 1;
			} else {
				beaker_contents = fmt("＄！ has a completly filled ＀ attached!", [live(f.src), rt.sv(f, "beaker")]);
			}
		}
	}
	dat = fmt("\n<b>Processing chamber contains:</b><br>\n＀<br>\n＀<hr>\n", [live(processing_chamber), live(beaker_contents)]);
	if (((truthy(live(is_beaker_ready)) && !truthy(live(is_chamber_empty))) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=juice'>Turn on!<BR>", [live(f.src)]), add);
	}
	if (truthy(rt.sv(f, "beaker"))) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=detach'>Detach the container!<BR>", [live(f.src)]), add);
	}
	rt.op(f, "Browse", [], [live(user), fmt("<HEAD><TITLE>Juicer</TITLE></HEAD><TT>＀</TT>", [live(dat)]), "window=juicer"], false);
	rt.call(f, P("/proc/onclose"), null, [live(user), "juicer"]);
	return live(f.dot);
});

// /obj/machinery/juicer/proc/Topic  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:117)  may sleep
rt.def("/obj/machinery/juicer/proc/Topic", function* Topic(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	$0 = rt.at(live(f.args[1]), "action");
	if ($0 === "juice") {
		yield* g.srcCall(f, "juice");
	} else if ($0 === "detach") {
		yield* g.srcCall(f, "detach");
	}
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/juicer/verb/detach  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:133)
rt.def("/obj/machinery/juicer/verb/detach", function detach(f: Frame) {
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "beaker"))) {
		return live(f.dot);
	}
	(rt.modField(f, live(f.src), "verbs", P("/obj/machinery/juicer/verb/detach"), subtract));
	rt.setFv(f, "loc", rt.sv(f, "beaker"), rt.fv(f, "loc", live(f.src)));
	rt.setSv(f, "beaker", null);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { verb: { name: "Detach container from the juicer", category: "Object", src: 3, range: 1 } });

// /obj/machinery/juicer/proc/get_juice_id  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:143)
rt.def("/obj/machinery/juicer/proc/get_juice_id", function get_juice_id(f: Frame, O: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forList(f, 0, rt.gl("allowed_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.op(f, "IsType", [], [live(O), live(i)]))) {
			return rt.index(rt.gl("allowed_items"), live(i));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/juicer/proc/get_juice_amount  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:148)
rt.def("/obj/machinery/juicer/proc/get_juice_amount", function get_juice_amount(f: Frame, O: Value) {
	if ((!truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/food/snacks/grown")) ? 1 : 0)) || !truthy(rt.fv(f, "seed", live(O))))) {
		return 5;
	} else {
		if (isEqual(rt.gv(f, "potency", rt.fv(f, "seed", live(O))), -1)) {
			return 5;
		} else {
			return rt.call(f, P("/proc/round"), null, [multiply(5, rt.op(f, "Sqrt", [], [rt.gv(f, "potency", rt.fv(f, "seed", live(O)))]))]);
		}
	}
	return f.dot;
});

// /obj/machinery/juicer/proc/juice  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:156)  may sleep
rt.def("/obj/machinery/juicer/proc/juice", function* juice(f: Frame) {
	let O: Value = null, r_id: Value = null;
	let $e: any;
	f.vars = () => [O, r_id, $e];
	yield* g.srcCall(f, "power_change");
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "beaker")) || rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker")))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/juicer.ogg"), 50, 1]);
	O = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(f.src)), T("/obj/item/weapon/reagent_containers/food/snacks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		r_id = (yield* g.srcCall(f, "get_juice_id", live(O)));
		yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", [live(r_id), (yield* g.srcCall(f, "get_juice_amount", live(O)))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12279, "/obj/structure/closet/crate/juice", "/obj/structure/closet/crate", {});

// /obj/structure/closet/crate/juice/proc/New  (code/modules/food_and_drinks/kitchen_machinery/juicer.dm:170)  may sleep
rt.def("/obj/structure/closet/crate/juice/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/machinery/juicer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/tomato"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/carrot"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/berries"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/grown/grapes"), [live(f.src)]);
	return f.dot;
}, true);
