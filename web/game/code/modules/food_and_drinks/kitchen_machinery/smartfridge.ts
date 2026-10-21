// From code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10901, "/obj/machinery/smartfridge", "/obj/machinery", {
	max_n_of_items: 1500,
	icon_on: "smartfridge",
	icon_off: "smartfridge-off",
	initial_contents: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 100,
	name: "smartfridge",
	desc: "Keeps cold things cold and hot things cold.",
	icon: rt.rsc("icons/obj/vending.dmi"),
	icon_state: "smartfridge",
	layer: 2.9,
	density: 1,
});

// /obj/machinery/smartfridge/proc/Initialize  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:21)  may sleep
rt.def("/obj/machinery/smartfridge/proc/Initialize", function* Initialize(f: Frame) {
	let typekey: Value = null, amount: Value = null, i: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [typekey, amount, i, B, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents");
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [0]);
	if (truthy((rt.istype(rt.sv(f, "initial_contents"), T("/list")) ? 1 : 0))) {
		typekey = null;
		rt.forList(f, 0, rt.sv(f, "initial_contents"));
		while (($e = rt.next(f, 0)) !== undefined) {
			typekey = $e;
			if ((amount = rt.index(rt.sv(f, "initial_contents"), live(typekey))) === null) {
				amount = 1;
			}
			i = null;
			rt.forRange(f, 1, 1, live(amount), 1);
			while (($e = rt.next(f, 1)) !== undefined) {
				i = $e;
				yield* g.srcCall(f, "load", (yield* g.new_(f, live(typekey), [live(f.src)])));
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/smartfridge"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6754, "/obj/item/weapon/circuitboard/machine/smartfridge", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Smartfridge (Machine Board)",
	build_path: rt.typePath("/obj/machinery/smartfridge"),
	origin_tech: "programming=1",
}, { global: { fridges: 1051 } });

// /obj/item/weapon/circuitboard/machine/smartfridge/proc/<init>  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:40)
rt.def("/obj/item/weapon/circuitboard/machine/smartfridge/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1]));
	return f.dot;
});

// /obj/item/weapon/circuitboard/machine/smartfridge/proc/New  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:51)  may sleep
rt.def("/obj/item/weapon/circuitboard/machine/smartfridge/proc/New", function* New(f: Frame) {
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "build_path", live(f.args[1]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["loc", "new_type"] });

// /obj/item/weapon/circuitboard/machine/smartfridge/proc/attackby  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:55)  may sleep
rt.def("/obj/item/weapon/circuitboard/machine/smartfridge/proc/attackby", function* attackby(f: Frame) {
	let position: Value = null;
	let $0: any;
	f.vars = () => [position, $0];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual((position = (yield* g.callName(f, rt.gl("fridges"), "Find", [rt.sv(f, "build_path"), rt.gl("fridges")]))), rt.len(f, rt.gl("fridges")))) {
			$0 = 1;
		} else {
			$0 = add(live(position), 1);
		}
		position = $0;
		rt.setSv(f, "build_path", rt.index(rt.gl("fridges"), live(position)));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You set the board to ＀.</span>", [rt.index(rt.gl("fridges"), rt.sv(f, "build_path"))])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/circuitboard/machine/smartfridge/proc/examine  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:64)
rt.def("/obj/item/weapon/circuitboard/machine/smartfridge/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='info'>＀ is set to ＀. You can use a screwdriver to reconfigure it.</span>", [live(f.src), rt.index(rt.gl("fridges"), rt.sv(f, "build_path"))])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/smartfridge/proc/RefreshParts  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:68)
rt.def("/obj/machinery/smartfridge/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [B, $e];
	B = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		rt.setSv(f, "max_n_of_items", multiply(1500, rt.fv(f, "rating", live(B))));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/smartfridge/proc/power_change  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:72)
rt.def("/obj/machinery/smartfridge/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/smartfridge/proc/update_icon  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:76)
rt.def("/obj/machinery/smartfridge/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "stat"))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_on"));
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_off"));
	}
	return f.dot;
});

// /obj/machinery/smartfridge/proc/attackby  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:88)  may sleep
rt.def("/obj/machinery/smartfridge/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null, loaded: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [_P, loaded, G, $e];
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "smartfridge_open", "smartfridge", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		yield* g.srcCall(f, "power_change");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "stat"))) {
		if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "max_n_of_items"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is full!</span>", [live(f.src)])]);
			return 0;
		}
		if (truthy((yield* g.srcCall(f, "accept_check", live(f.args[0]))))) {
			yield* g.srcCall(f, "load", live(f.args[0]));
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has added ％！ to ％！.", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You add ％！ to ％！.</span>", [live(f.args[0]), live(f.src)])]);
			yield* g.srcCall(f, "updateUsrDialog");
			return 1;
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag")) ? 1 : 0))) {
			_P = live(f.args[0]);
			loaded = 0;
			G = null;
			rt.forList(f, 0, rt.fv(f, "contents", live(_P)), T("/obj"));
			while (($e = rt.next(f, 0)) !== undefined) {
				G = $e;
				if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "max_n_of_items"))) {
					break;
				}
				if (truthy((yield* g.srcCall(f, "accept_check", live(G))))) {
					yield* g.srcCall(f, "load", live(G));
					loaded = rt.inc(live(loaded), 1);
				}
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "updateUsrDialog");
			if (truthy(live(loaded))) {
				if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "max_n_of_items"))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ loads ％！ with ％！.", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You fill ％！ with ％！.</span>", [live(f.src), live(f.args[0])])]);
				} else {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ loads ％！ with ％！.", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You load ％！ with ％！.</span>", [live(f.src), live(f.args[0])])]);
				}
				if (rt.gt(rt.getLen(f, rt.fv(f, "contents", live(f.args[0]))), 0)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Some items are refused.</span>"]);
				}
				return 1;
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There is nothing in ＀ to put in ＀!</span>", [live(f.args[0]), live(f.src)])]);
				return 0;
			}
		}
	}
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ smartly refuses ＀.</span>", [live(f.src), live(f.args[0])])]);
		yield* g.srcCall(f, "updateUsrDialog");
		return 0;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/smartfridge/proc/accept_check  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:152)
rt.def("/obj/machinery/smartfridge/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (((truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/food/snacks/grown")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/item/seeds")) ? 1 : 0))) || truthy((rt.istype(live(O), T("/obj/item/weapon/grown")) ? 1 : 0)))) {
		return 1;
	}
	return 0;
});

// /obj/machinery/smartfridge/proc/load  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:157)  may sleep
rt.def("/obj/machinery/smartfridge/proc/load", function* load(f: Frame, O: Value) {
	let M: Value = null, S: Value = null;
	f.vars = () => [O, M, S];
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(O))])))) {
		if (!truthy((yield* g.callName(f, (M = rt.fv(f, "loc", live(O))), "transferItemToLoc", [live(O), live(f.src)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [live(O), live(f.src)])]);
			return live(f.dot);
		}
	} else {
		if (truthy((rt.istype(rt.fv(f, "loc", live(O)), T("/obj/item/weapon/storage")) ? 1 : 0))) {
			yield* g.callName(f, (S = rt.fv(f, "loc", live(O))), "remove_from_storage", [live(O), live(f.src)]);
		}
		yield* g.callName(f, live(O), "forceMove", [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/machinery/smartfridge/proc/attack_paw  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:169)  may sleep
rt.def("/obj/machinery/smartfridge/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/smartfridge/proc/attack_hand  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:175)  may sleep
rt.def("/obj/machinery/smartfridge/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/smartfridge/proc/interact  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:186)  may sleep
// tg_js: opens the `smartfridge` tgui window (after modern tg's smartfridge.dm) instead of a hand-built HTML page.
rt.def("/obj/machinery/smartfridge/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "stat"))) {
		return 0;
	}
	yield* g.srcCall(f, "ui_interact", live(user));
	return 1;
}, true);

// /obj/machinery/smartfridge/proc/ui_interact  (tg_js)  may sleep
rt.def("/obj/machinery/smartfridge/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "smartfridge", rt.sv(f, "name"), 440, 550, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/smartfridge/proc/ui_data  (tg_js)  may sleep
// contents: [{name (the key vend sends back), label (capitalized), amount}] grouped by name and sorted like the old page; drying_rack/drying for the rack's toggle.
rt.def("/obj/machinery/smartfridge/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, list: Value = null, E: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [user, data, list, E, O, $e];
	data = rt.list();
	list = rt.list();
	const counts: any = new Map();
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		const nm = String(rt.fv(f, "name", live(O)));
		counts.set(nm, (counts.get(nm) ?? 0) + 1);
	}
	rt.endFor(f, 0);
	for (const nm of [...counts.keys()].sort((x: string, y: string) => x.toLowerCase() < y.toLowerCase() ? -1 : x.toLowerCase() > y.toLowerCase() ? 1 : 0)) {
		E = rt.list();
		rt.setAt(live(E), "name", nm);
		rt.setAt(live(E), "label", nm.charAt(0).toUpperCase() + nm.slice(1));
		rt.setAt(live(E), "amount", counts.get(nm));
		rt.modify(live(list), rt.list(live(E)), add);
	}
	rt.setAt(live(data), "contents", live(list));
	const rack = truthy((rt.istype(live(f.src), T("/obj/machinery/smartfridge/drying_rack")) ? 1 : 0)) ? 1 : 0;
	rt.setAt(live(data), "drying_rack", rack);
	rt.setAt(live(data), "drying", rack && truthy(rt.sv(f, "drying")) ? 1 : 0);
	return live(data);
}, true);

// /obj/machinery/smartfridge/proc/ui_act  (tg_js)  may sleep
// Vending goes through the old Topic (name match, amount) and the rack's toggle through the rack's Topic.
rt.def("/obj/machinery/smartfridge/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	f.vars = () => [action, params, ui, state];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (action === "vend") {
		yield* g.srcCall(f, "Topic", "", rt.alist(f, ["vend", rt.at(live(params), "name"), "amount", fmt("＀", [rt.at(live(params), "amount")])]));
	} else if (action === "dry" && truthy((rt.istype(live(f.src), T("/obj/machinery/smartfridge/drying_rack")) ? 1 : 0))) {
		yield* g.srcCall(f, "Topic", "", rt.alist(f, ["dry", 1]));
	} else {
		return 0;
	}
	yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// /obj/machinery/smartfridge/proc/Topic  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:224)  may sleep
rt.def("/obj/machinery/smartfridge/proc/Topic", function* Topic(f: Frame) {
	let N: Value = null, amount: Value = null, i: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [N, amount, i, O, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1; // tg_js (public server): refused (out of range, no power...); the drying rack's Topic needs to see that
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	N = rt.at(live(f.args[1]), "vend");
	amount = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "amount")]));
	// tg_js (public server): the amount must be a whole number >= 1 and the name text (a fraction such as 0.5 used to vend one item);
	if (typeof live(N) !== "string" || !Number.isInteger(Number(live(amount))) || Number(live(amount)) < 1) {
		yield* g.srcCall(f, "updateUsrDialog");
		return f.dot;
	}
	i = Number(live(amount));
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (rt.le(live(i), 0)) {
			break;
		}
		if (isEqual(rt.fv(f, "name", live(O)), live(N))) {
			rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(f.src)));
			i = rt.inc(live(i), -1);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(10902, "/obj/machinery/smartfridge/drying_rack", "/obj/machinery/smartfridge", {
	drying: 0,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 200,
	icon_on: "drying_rack_on",
	icon_off: "drying_rack",
	name: "drying rack",
	desc: "A wooden contraption, used to dry plant products, food and leather.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "drying_rack_on",
});

// /obj/machinery/smartfridge/drying_rack/proc/RefreshParts  empty
rt.def("/obj/machinery/smartfridge/drying_rack/proc/RefreshParts");

// /obj/machinery/smartfridge/drying_rack/proc/default_deconstruction_screwdriver  empty
rt.def("/obj/machinery/smartfridge/drying_rack/proc/default_deconstruction_screwdriver");

// /obj/machinery/smartfridge/drying_rack/proc/exchange_parts  empty
rt.def("/obj/machinery/smartfridge/drying_rack/proc/exchange_parts");

// /obj/machinery/smartfridge/drying_rack/proc/spawn_frame  empty
rt.def("/obj/machinery/smartfridge/drying_rack/proc/spawn_frame");

// /obj/machinery/smartfridge/drying_rack/proc/New  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:259)  may sleep
rt.def("/obj/machinery/smartfridge/drying_rack/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "component_parts")) && truthy(rt.len(f, rt.sv(f, "component_parts"))))) {
		yield* g.callName(f, rt.sv(f, "component_parts"), "Cut", []);
	}
	rt.setSv(f, "component_parts", null);
	return f.dot;
}, true);

// /obj/machinery/smartfridge/drying_rack/proc/on_deconstruction  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:265)  may sleep
rt.def("/obj/machinery/smartfridge/drying_rack/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/sheet/mineral/wood"), [rt.sv(f, "loc"), 10]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/smartfridge/drying_rack/proc/default_deconstruction_crowbar  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:274)  may sleep
rt.def("/obj/machinery/smartfridge/drying_rack/proc/default_deconstruction_crowbar", function* default_deconstruction_crowbar(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C", "ignore_panel"] });

// /obj/machinery/smartfridge/drying_rack/proc/Topic  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:285)  may sleep
rt.def("/obj/machinery/smartfridge/drying_rack/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) { // tg_js (public server): 2017 tg ignored this and switched the rack from anywhere on the map
		return 1;
	}
	if (truthy(rt.at(live(f.args[1]), "dry"))) {
		yield* g.srcCall(f, "toggle_drying", 0);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/smartfridge/drying_rack/proc/power_change  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:292)
rt.def("/obj/machinery/smartfridge/drying_rack/proc/power_change", function power_change(f: Frame) {
	if ((truthy(rt.callSrc(f, "powered", [])) && truthy(rt.sv(f, "anchored")))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
		rt.callSrc(f, "toggle_drying", [1]);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/smartfridge/drying_rack/proc/load  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:300)  may sleep
rt.def("/obj/machinery/smartfridge/drying_rack/proc/load", function* load(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/smartfridge/drying_rack/proc/update_icon  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:304)
rt.def("/obj/machinery/smartfridge/drying_rack/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "drying"))) {
		rt.callSrc(f, "add_overlay", ["drying_rack_drying"]);
	}
	if (!truthy(rt.len(f, rt.sv(f, "contents")))) return f.dot;
	rt.callSrc(f, "add_overlay", ["drying_rack_filled"]);
	return f.dot;
});

// /obj/machinery/smartfridge/drying_rack/proc/process  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:312)  may sleep
rt.def("/obj/machinery/smartfridge/drying_rack/proc/process", function* process(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "drying"))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "rack_dry")))) return f.dot;
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/smartfridge/drying_rack/proc/accept_check  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:318)
rt.def("/obj/machinery/smartfridge/drying_rack/proc/accept_check", function accept_check(f: Frame, O: Value) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "dried_type", (S = live(O))))) {
			return 1;
		}
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/wetleather")) ? 1 : 0))) {
		return 1;
	}
	return 0;
});

// /obj/machinery/smartfridge/drying_rack/proc/toggle_drying  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:327)
rt.def("/obj/machinery/smartfridge/drying_rack/proc/toggle_drying", function toggle_drying(f: Frame, forceoff: Value) {
	if ((truthy(rt.sv(f, "drying")) || truthy(live(forceoff)))) {
		rt.setSv(f, "drying", 0);
		rt.setSv(f, "use_power", 1);
	} else {
		rt.setSv(f, "drying", 1);
		rt.setSv(f, "use_power", 2);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/smartfridge/drying_rack/proc/rack_dry  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:336)  may sleep
rt.def("/obj/machinery/smartfridge/drying_rack/proc/rack_dry", function* rack_dry(f: Frame) {
	let S: Value = null, dried: Value = null, WL: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [S, dried, WL, L, $e];
	S = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/reagent_containers/food/snacks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.fv(f, "dried_type", live(S)), rt.fv(f, "type", live(S)))) {
			yield* g.callName(f, live(S), "add_atom_colour", ["#ad7257", 4]);
			rt.setFv(f, "dry", live(S), 1);
			rt.setFv(f, "loc", live(S), rt.getStep(f, live(f.src), 0));
		} else {
			dried = rt.fv(f, "dried_type", live(S));
			yield* g.new_(f, live(dried), [rt.fv(f, "loc", live(f.src))]);
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		}
		return 1;
	}
	rt.endFor(f, 0);
	WL = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/stack/sheet/wetleather"));
	while (($e = rt.next(f, 0)) !== undefined) {
		WL = $e;
		rt.setFv(f, "amount", (L = (yield* g.new_(f, T("/obj/item/stack/sheet/leather"), [rt.sv(f, "loc")]))), rt.fv(f, "amount", live(WL)));
		yield* g.call(f, P("/proc/qdel"), null, [live(WL)]);
		return 1;
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /obj/machinery/smartfridge/drying_rack/proc/emp_act  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:354)  may sleep
rt.def("/obj/machinery/smartfridge/drying_rack/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "atmos_spawn_air", "TEMP=1000");
	return f.dot;
}, true, { args: ["severity"] });

rt.type(10903, "/obj/machinery/smartfridge/drinks", "/obj/machinery/smartfridge", {
	name: "drink showcase",
	desc: "A refrigerated storage unit for tasty tasty alcohol.",
});

// /obj/machinery/smartfridge/drinks/proc/accept_check  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:366)
rt.def("/obj/machinery/smartfridge/drinks/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (((!truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers")) ? 1 : 0)) || !truthy(rt.fv(f, "reagents", live(O)))) || !truthy(rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(O))))))) {
		return 0;
	}
	if (!((truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/food/drinks")) ? 1 : 0))) || truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/food/condiment")) ? 1 : 0)))) return f.dot;
	return 1;
});

rt.type(10904, "/obj/machinery/smartfridge/food", "/obj/machinery/smartfridge", {
	desc: "A refrigerated storage unit for food.",
});

// /obj/machinery/smartfridge/food/proc/accept_check  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:378)
rt.def("/obj/machinery/smartfridge/food/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0))) {
		return 1;
	}
	return 0;
});

rt.type(10905, "/obj/machinery/smartfridge/extract", "/obj/machinery/smartfridge", {
	name: "smart slime extract storage",
	desc: "A refrigerated storage unit for slime extracts.",
});

// /obj/machinery/smartfridge/extract/proc/accept_check  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:390)
rt.def("/obj/machinery/smartfridge/extract/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (truthy((rt.istype(live(O), T("/obj/item/slime_extract")) ? 1 : 0))) {
		return 1;
	}
	if (truthy((rt.istype(live(O), T("/obj/item/device/slime_scanner")) ? 1 : 0))) {
		return 1;
	}
	return 0;
});

rt.type(10906, "/obj/machinery/smartfridge/extract/preloaded", "/obj/machinery/smartfridge/extract", {
	initial_contents: null,
});

// /obj/machinery/smartfridge/extract/preloaded/proc/<init>  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:397)
rt.def("/obj/machinery/smartfridge/extract/preloaded/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "initial_contents", rt.alist(f, [T("/obj/item/device/slime_scanner"), 2]));
	return f.dot;
});

rt.type(10907, "/obj/machinery/smartfridge/chemistry", "/obj/machinery/smartfridge", {
	name: "smart chemical storage",
	desc: "A refrigerated storage unit for medicine storage.",
});

// /obj/machinery/smartfridge/chemistry/proc/accept_check  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:407)
rt.def("/obj/machinery/smartfridge/chemistry/proc/accept_check", function accept_check(f: Frame, O: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (truthy((rt.istype(live(O), T("/obj/item/weapon/storage/pill_bottle")) ? 1 : 0))) {
		if (truthy(rt.getLen(f, rt.fv(f, "contents", live(O))))) {
			I = null;
			rt.forList(f, 0, live(O), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				if (!truthy(rt.callSrc(f, "accept_check", [live(I)]))) {
					return 0;
				}
			}
			rt.endFor(f, 0);
			return 1;
		}
		return 0;
	}
	if (!truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/pill")) ? 1 : 0))) {
		return 1;
	}
	if ((!truthy(rt.fv(f, "reagents", live(O))) || !truthy(rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(O))))))) {
		return 0;
	}
	if ((((truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/syringe")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/glass/bottle")) ? 1 : 0))) || truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/glass/beaker")) ? 1 : 0))) || truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/spray")) ? 1 : 0)))) {
		return 1;
	}
	return 0;
});

rt.type(10908, "/obj/machinery/smartfridge/chemistry/preloaded", "/obj/machinery/smartfridge/chemistry", {
	initial_contents: null,
});

// /obj/machinery/smartfridge/chemistry/preloaded/proc/<init>  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:425)
rt.def("/obj/machinery/smartfridge/chemistry/preloaded/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "initial_contents", rt.alist(f, [T("/obj/item/weapon/reagent_containers/pill/epinephrine"), 12, T("/obj/item/weapon/reagent_containers/pill/charcoal"), 5, T("/obj/item/weapon/reagent_containers/glass/bottle/epinephrine"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/charcoal"), 1]));
	return f.dot;
});

rt.type(10910, "/obj/machinery/smartfridge/chemistry/virology/preloaded", "/obj/machinery/smartfridge/chemistry/virology", {
	initial_contents: null,
});

// /obj/machinery/smartfridge/chemistry/virology/preloaded/proc/<init>  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:439)
rt.def("/obj/machinery/smartfridge/chemistry/virology/preloaded/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "initial_contents", rt.alist(f, [T("/obj/item/weapon/reagent_containers/syringe/antiviral"), 4, T("/obj/item/weapon/reagent_containers/glass/bottle/cold"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/flu_virion"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/mutagen"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/plasma"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/synaptizine"), 1]));
	return f.dot;
});

rt.type(10911, "/obj/machinery/smartfridge/disks", "/obj/machinery/smartfridge", {
	name: "disk compartmentalizer",
	desc: "A machine capable of storing a variety of disks. Denoted by most as the DSU (disk storage unit).",
});

// /obj/machinery/smartfridge/disks/proc/accept_check  (code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm:455)
rt.def("/obj/machinery/smartfridge/disks/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (truthy((rt.istype(live(O), T("/obj/item/weapon/disk")) ? 1 : 0))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});
