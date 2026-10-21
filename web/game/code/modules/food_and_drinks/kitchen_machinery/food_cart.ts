// From code/modules/food_and_drinks/kitchen_machinery/food_cart.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10892, "/obj/machinery/food_cart", "/obj/machinery", {
	food_stored: 0,
	glasses: 0,
	portion: 10,
	selected_drink: null,
	stored_food: null,
	mixer: null,
	anchored: 0,
	use_power: 0,
	container_type: 4096,
	name: "food cart",
	desc: "New generation hot dog stand.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "foodcart",
	density: 1,
});

// /obj/machinery/food_cart/proc/<init>  (code/modules/food_and_drinks/kitchen_machinery/food_cart.dm:17)
rt.def("/obj/machinery/food_cart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stored_food", rt.list());
	return f.dot;
});

// /obj/machinery/food_cart/proc/New  (code/modules/food_and_drinks/kitchen_machinery/food_cart.dm:22)  may sleep
rt.def("/obj/machinery/food_cart/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", 200);
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [0]);
	rt.setSv(f, "mixer", (yield* g.new_(f, T("/obj/item/weapon/reagent_containers"), [live(f.src), 100])));
	rt.setFv(f, "name", rt.sv(f, "mixer"), "Mixer");
	return f.dot;
}, true);

// /obj/machinery/food_cart/proc/Destroy  (code/modules/food_and_drinks/kitchen_machinery/food_cart.dm:30)  may sleep
rt.def("/obj/machinery/food_cart/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "mixer"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "mixer")]);
		rt.setSv(f, "mixer", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/food_cart/proc/attack_hand  (code/modules/food_and_drinks/kitchen_machinery/food_cart.dm:35)  may sleep
rt.def("/obj/machinery/food_cart/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/food_cart/proc/interact  (code/modules/food_and_drinks/kitchen_machinery/food_cart.dm:40)  may sleep
rt.def("/obj/machinery/food_cart/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, R: Value = null, V: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, R, V, popup, $e];
	dat = null;
	dat = rt.modify(live(dat), "<br><b>STORED INGREDIENTS AND DRINKS</b><br><div class='statusDisplay'>", add);
	dat = rt.modify(live(dat), fmt("Remaining glasses: ＀<br>", [rt.sv(f, "glasses")]), add);
	dat = rt.modify(live(dat), fmt("Portion: <a href='?src=＃;portion=1'>＀</a><br>", [live(f.src), rt.sv(f, "portion")]), add);
	R = null;
	rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		dat = rt.modify(live(dat), fmt("＀: ＀ ", [rt.fv(f, "name", live(R)), rt.fv(f, "volume", live(R))]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;disposeI=＀'>Purge</a>", [live(f.src), rt.fv(f, "id", live(R))]), add);
		if (rt.gt(rt.sv(f, "glasses"), 0)) {
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;pour=＀'>Pour in a glass</a>", [live(f.src), rt.fv(f, "id", live(R))]), add);
		}
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;mix=＀'>Add to the mixer</a><br>", [live(f.src), rt.fv(f, "id", live(R))]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "</div><br><b>MIXER CONTENTS</b><br><div class='statusDisplay'>", add);
	R = null;
	rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "mixer"))), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		dat = rt.modify(live(dat), fmt("＀: ＀ ", [rt.fv(f, "name", live(R)), rt.fv(f, "volume", live(R))]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;transfer=＀'>Transfer back</a>", [live(f.src), rt.fv(f, "id", live(R))]), add);
		if (rt.gt(rt.sv(f, "glasses"), 0)) {
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;m_pour=＀'>Pour in a glass</a>", [live(f.src), rt.fv(f, "id", live(R))]), add);
		}
		dat = rt.modify(live(dat), "<br>", add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "</div><br><b>STORED FOOD</b><br><div class='statusDisplay'>", add);
	V = null;
	rt.forList(f, 0, rt.sv(f, "stored_food"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (rt.gt(rt.index(rt.sv(f, "stored_food"), live(V)), 0)) {
			dat = rt.modify(live(dat), fmt("<b>＀: ＀</b> <a href='?src=＃;dispense=＀'>Dispense</a><br>", [live(V), rt.index(rt.sv(f, "stored_food"), live(V)), live(f.src), live(V)]), add);
		}
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), fmt("</div><br><a href='?src=＃;refresh=1'>Refresh</a> <a href='?src=＃;close=1'>Close</a>", [live(f.src), live(f.src)]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "foodcart", "Food Cart", 500, 350, live(f.src)]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/food_cart/proc/isFull  (code/modules/food_and_drinks/kitchen_machinery/food_cart.dm:67)
rt.def("/obj/machinery/food_cart/proc/isFull", function isFull(f: Frame) {
	return (rt.ge(rt.sv(f, "food_stored"), 30) ? 1 : 0);
});

// /obj/machinery/food_cart/proc/attackby  (code/modules/food_and_drinks/kitchen_machinery/food_cart.dm:70)  may sleep
rt.def("/obj/machinery/food_cart/proc/attackby", function* attackby(f: Frame) {
	let DG: Value = null, S: Value = null, G: Value = null, _T: Value = null, S_1: Value = null;
	let $e: any;
	f.vars = () => [DG, S, G, _T, S_1, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "total_volume", rt.gv(f, "reagents", (DG = live(f.args[0])))))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(DG)]);
			rt.incSrcVar(f, "glasses", 1, true);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>The ＀ accepts the drinking glass, sterilizing it.</span>", [live(f.src)])]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0))) {
			if (truthy((yield* g.srcCall(f, "isFull")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ is at full capacity.</span>", [live(f.src)])]);
			} else {
				S = live(f.args[0]);
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.setFv(f, "loc", live(S), live(f.src));
				if (truthy(rt.index(rt.sv(f, "stored_food"), (yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "name", live(S))]))))) {
					rt.incAt(rt.sv(f, "stored_food"), (yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "name", live(S))])), 1, true);
				} else {
					rt.setAt(rt.sv(f, "stored_food"), (yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "name", live(S))])), 1);
				}
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/glass")) ? 1 : 0))) {
				if (rt.ge((yield* g.callName(f, (G = live(f.args[0])), "get_amount", [])), 1)) {
					yield* g.callName(f, live(G), "use", [1]);
					rt.modSrcVar(f, "glasses", 4, add);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>The ＀ accepts a sheet of glass.</span>", [live(f.src)])]);
				}
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/tray")) ? 1 : 0))) {
					_T = live(f.args[0]);
					S_1 = null;
					rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/obj/item/weapon/reagent_containers/food/snacks"));
					while (($e = rt.next(f, 0)) !== undefined) {
						S_1 = $e;
						if (truthy((yield* g.srcCall(f, "isFull")))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ is at full capacity.</span>", [live(f.src)])]);
							break;
						}
						yield* g.callName(f, live(_T), "remove_from_storage", [live(S_1), live(f.src)]);
						if (truthy(rt.index(rt.sv(f, "stored_food"), (yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "name", live(S_1))]))))) {
							rt.incAt(rt.sv(f, "stored_food"), (yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "name", live(S_1))])), 1, true);
						} else {
							rt.setAt(rt.sv(f, "stored_food"), (yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "name", live(S_1))])), 1);
						}
					}
					rt.endFor(f, 0);
				} else {
					if (truthy((yield* g.callName(f, live(f.args[0]), "is_open_container", [])))) {
						return live(f.dot);
					} else {
						f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "updateDialog");
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/food_cart/proc/Topic  (code/modules/food_and_drinks/kitchen_machinery/food_cart.dm:115)  may sleep
rt.def("/obj/machinery/food_cart/proc/Topic", function* Topic(f: Frame) {
	let O: Value = null, DG: Value = null;
	let $e: any;
	f.vars = () => [O, DG, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "disposeI"))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "del_reagent", [rt.at(live(f.args[1]), "disposeI")]);
	}
	if (truthy(rt.at(live(f.args[1]), "dispense"))) {
		if (rt.le(rt.incAt(rt.sv(f, "stored_food"), rt.at(live(f.args[1]), "dispense"), -1, true), 0)) {
			rt.setAt(rt.sv(f, "stored_food"), rt.at(live(f.args[1]), "dispense"), 0);
		} else {
			O = null;
			rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				if (isEqual((yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "name", live(O))])), rt.at(live(f.args[1]), "dispense"))) {
					rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(f.src)));
					break;
				}
			}
			rt.endFor(f, 0);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "portion"))) {
		rt.setSv(f, "portion", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [(yield* g.op(f, "Prompt", [32], [null, null, null, "How much drink do you want to dispense per glass?", null])), 50]))])));
	}
	if ((truthy(rt.at(live(f.args[1]), "pour")) || truthy(rt.at(live(f.args[1]), "m_pour")))) {
		if (rt.le(rt.incSrcVar(f, "glasses", -1, true), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>There are no glasses left!</span>"]);
			rt.setSv(f, "glasses", 0);
		} else {
			DG = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), [rt.sv(f, "loc")]));
			if (truthy(rt.at(live(f.args[1]), "pour"))) {
				yield* g.callName(f, rt.sv(f, "reagents"), "trans_id_to", [live(DG), rt.at(live(f.args[1]), "pour"), rt.sv(f, "portion")]);
			}
			if (truthy(rt.at(live(f.args[1]), "m_pour"))) {
				yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "mixer")), "trans_id_to", [live(DG), rt.at(live(f.args[1]), "m_pour"), rt.sv(f, "portion")]);
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "mix"))) {
		if (isEqual((yield* g.callName(f, rt.sv(f, "reagents"), "trans_id_to", [rt.sv(f, "mixer"), rt.at(live(f.args[1]), "mix"), rt.sv(f, "portion")])), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>The ＀ is full!</span>", [rt.sv(f, "mixer")])]);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "transfer"))) {
		if (isEqual((yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "mixer")), "trans_id_to", [live(f.src), rt.at(live(f.args[1]), "transfer"), rt.sv(f, "portion")])), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>The ＀ is full!</span>", [live(f.src)])]);
		}
	}
	yield* g.srcCall(f, "updateDialog");
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		rt.op(f, "Browse", [], [live(f.usr), null, "window=foodcart"], false);
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/food_cart/proc/deconstruct  (code/modules/food_and_drinks/kitchen_machinery/food_cart.dm:160)  may sleep
rt.def("/obj/machinery/food_cart/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 4]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
