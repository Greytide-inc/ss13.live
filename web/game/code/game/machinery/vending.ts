// From code/game/machinery/vending.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10639, "/obj/machinery/vending", "/obj/machinery", {
	active: 1,
	vend_ready: 1,
	products: null,
	contraband: null,
	premium: null,
	product_slogans: "",
	product_ads: "",
	product_records: null,
	hidden_records: null,
	coin_records: null,
	slogan_list: null,
	small_ads: null,
	vend_reply: null,
	last_reply: 0,
	last_slogan: 0,
	slogan_delay: 6000,
	icon_vend: null,
	icon_deny: null,
	seconds_electrified: 0,
	shoot_inventory: 0,
	shoot_inventory_chance: 2,
	shut_up: 0,
	extended_inventory: 0,
	scan_id: 1,
	coin: null,
	bill: null,
	dish_quants: null,
	refill_canister: null,
	refill_count: 3,
	anchored: 1,
	verb_say: "beeps",
	verb_ask: "beeps",
	verb_exclaim: "beeps",
	name: "１Vendomat",
	desc: "A generic vending machine.",
	icon: rt.rsc("icons/obj/vending.dmi"),
	icon_state: "generic",
	layer: 2.9,
	density: 1,
	obj_integrity: 300,
	max_integrity: 300,
	integrity_failure: 100,
	armor: null,
});

// /obj/machinery/vending/proc/<init>  (code/game/machinery/vending.dm:32)
rt.def("/obj/machinery/vending/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.list());
	$0 = $0;
	rt.setSv(f, "contraband", rt.list());
	$0 = $0;
	rt.setSv(f, "premium", rt.list());
	$0 = $0;
	rt.setSv(f, "product_records", rt.list());
	$0 = $0;
	rt.setSv(f, "hidden_records", rt.list());
	$0 = $0;
	rt.setSv(f, "coin_records", rt.list());
	$0 = $0;
	rt.setSv(f, "slogan_list", rt.list());
	$0 = $0;
	rt.setSv(f, "small_ads", rt.list());
	$0 = $0;
	rt.setSv(f, "dish_quants", rt.list());
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 70]));
	return f.dot;
});

// /obj/machinery/vending/proc/Initialize  (code/game/machinery/vending.dm:64)  may sleep
rt.def("/obj/machinery/vending/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/vending"), [live(f.src)])));
	if (truthy(rt.sv(f, "refill_canister"))) {
		yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/vendor"), [null]))), "apply_default_parts", [live(f.src)]);
	} else {
		yield* g.srcCall(f, "build_inventory", rt.sv(f, "products"));
		yield* g.srcCall(f, "build_inventory", rt.sv(f, "contraband"), 1);
		yield* g.srcCall(f, "build_inventory", rt.sv(f, "premium"), 0, 1);
	}
	rt.setSv(f, "slogan_list", (yield* g.call(f, P("/proc/splittext"), null, [rt.sv(f, "product_slogans"), ";"])));
	rt.setSv(f, "last_slogan", add(rt.worldTime(f), (yield* g.call(f, P("/proc/rand"), null, [0, rt.sv(f, "slogan_delay")]))));
	yield* g.srcCall(f, "power_change");
	return f.dot;
}, true);

rt.type(6733, "/obj/item/weapon/circuitboard/machine/vendor", "/obj/item/weapon/circuitboard/machine", {
	names_paths: null,
	name: "Booze-O-Mat Vendor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/vending/boozeomat"),
	origin_tech: "programming=1",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/vendor/proc/<init>  (code/game/machinery/vending.dm:85)
rt.def("/obj/item/weapon/circuitboard/machine/vendor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/vending_refill/boozeomat"), 3]));
	$0 = $0;
	rt.setSv(f, "names_paths", rt.alist(f, [T("/obj/machinery/vending/boozeomat"), "Booze-O-Mat", T("/obj/machinery/vending/coffee"), "Solar's Best Hot Drinks", T("/obj/machinery/vending/snack"), "Getmore Chocolate Corp", T("/obj/machinery/vending/cola"), "Robust Softdrinks", T("/obj/machinery/vending/cigarette"), "ShadyCigs Deluxe", T("/obj/machinery/vending/autodrobe"), "AutoDrobe", T("/obj/machinery/vending/clothing"), "ClothesMate", T("/obj/machinery/vending/medical"), "NanoMed Plus", T("/obj/machinery/vending/wallmed"), "NanoMed"]));
	return f.dot;
});

// /obj/item/weapon/circuitboard/machine/vendor/proc/attackby  (code/game/machinery/vending.dm:99)  may sleep
rt.def("/obj/item/weapon/circuitboard/machine/vendor/proc/attackby", function* attackby(f: Frame) {
	let position: Value = null, typepath: Value = null;
	let $0: any;
	f.vars = () => [position, typepath, $0];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual((position = (yield* g.callName(f, rt.sv(f, "names_paths"), "Find", [rt.sv(f, "build_path")]))), rt.len(f, rt.sv(f, "names_paths")))) {
			$0 = 1;
		} else {
			$0 = add(live(position), 1);
		}
		position = $0;
		typepath = rt.index(rt.sv(f, "names_paths"), live(position));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You set the board to \"＀\".</span>", [rt.index(rt.sv(f, "names_paths"), live(typepath))])]);
		yield* g.srcCall(f, "set_type", live(typepath));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/circuitboard/machine/vendor/proc/set_type  (code/game/machinery/vending.dm:110)
rt.def("/obj/item/weapon/circuitboard/machine/vendor/proc/set_type", function set_type(f: Frame, typepath: Value) {
	rt.setSv(f, "build_path", live(typepath));
	rt.setSv(f, "name", fmt("＀ Vendor (Machine Board)", [rt.index(rt.sv(f, "names_paths"), rt.sv(f, "build_path"))]));
	rt.setSv(f, "req_components", rt.alist(f, [rt.initial(f, live(typepath), "refill_canister"), rt.initial(f, live(typepath), "refill_count")]));
	return f.dot;
});

// /obj/item/weapon/circuitboard/machine/vendor/proc/apply_default_parts  (code/game/machinery/vending.dm:115)  may sleep
rt.def("/obj/item/weapon/circuitboard/machine/vendor/proc/apply_default_parts", function* apply_default_parts(f: Frame) {
	let typepath: Value = null;
	let $e: any;
	f.vars = () => [typepath, $e];
	typepath = null;
	rt.forList(f, 0, rt.sv(f, "names_paths"));
	while (($e = rt.next(f, 0)) !== undefined) {
		typepath = $e;
		if (truthy(rt.op(f, "IsType", [], [live(f.args[0]), live(typepath)]))) {
			yield* g.srcCall(f, "set_type", live(typepath));
			break;
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /obj/machinery/vending/proc/Destroy  (code/game/machinery/vending.dm:122)  may sleep
rt.def("/obj/machinery/vending/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "coin")]);
	rt.setSv(f, "coin", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "bill")]);
	rt.setSv(f, "bill", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(10640, "/obj/machinery/vending/snack", "/obj/machinery/vending", {
	chef_compartment_access: "28",
	product_slogans: "Try our new nougat bar!;Twice the calories for half the price!",
	product_ads: "The healthiest!;Award-winning chocolate bars!;Mmm! So good!;Oh my god it's so juicy!;Have a snack.;Snacks are good for you!;Have some more Getmore!;Best quality snacks straight from mars.;We love chocolate!;Try our new jerky!",
	products: null,
	contraband: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/snack"),
	name: "１Getmore Chocolate Corp",
	desc: "A snack machine courtesy of the Getmore Chocolate Corporation, based out of Mars.",
	icon_state: "snack",
});

// /obj/machinery/vending/snack/proc/Destroy  (code/game/machinery/vending.dm:128)  may sleep
rt.def("/obj/machinery/vending/snack/proc/Destroy", function* Destroy(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	S = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/reagent_containers/food/snacks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.setFv(f, "loc", live(S), rt.getStep(f, live(f.src), 0));
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/vending/proc/RefreshParts  (code/game/machinery/vending.dm:136)  may sleep
rt.def("/obj/machinery/vending/proc/RefreshParts", function* RefreshParts(f: Frame) {
	let VR: Value = null;
	let $e: any;
	f.vars = () => [VR, $e];
	if (!truthy(rt.sv(f, "component_parts"))) return f.dot;
	rt.setSv(f, "product_records", rt.list());
	rt.setSv(f, "hidden_records", rt.list());
	rt.setSv(f, "coin_records", rt.list());
	yield* g.callSrc(f, "build_inventory", [null, rt.sv(f, "products"), "start_empty", 1], rt.Args.Named);
	yield* g.callSrc(f, "build_inventory", [null, rt.sv(f, "contraband"), null, 1, "start_empty", 1], rt.Args.Named);
	yield* g.callSrc(f, "build_inventory", [null, rt.sv(f, "premium"), null, 0, null, 1, "start_empty", 1], rt.Args.Named);
	VR = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/vending_refill"));
	while (($e = rt.next(f, 0)) !== undefined) {
		VR = $e;
		yield* g.srcCall(f, "refill_inventory", live(VR), rt.sv(f, "product_records"), 1);
		yield* g.srcCall(f, "refill_inventory", live(VR), rt.sv(f, "coin_records"), 3);
		yield* g.srcCall(f, "refill_inventory", live(VR), rt.sv(f, "hidden_records"), 2);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/vending/proc/deconstruct  (code/game/machinery/vending.dm:149)  may sleep
rt.def("/obj/machinery/vending/proc/deconstruct", function* deconstruct(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (!truthy(rt.sv(f, "refill_canister"))) {
		if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
			yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 3]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["disassembled"] });

// /obj/machinery/vending/proc/obj_break  (code/game/machinery/vending.dm:157)  may sleep
rt.def("/obj/machinery/vending/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	let dump_amount: Value = null, R: Value = null, dump_path: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [damage_flag, dump_amount, R, dump_path, O, $e];
	if (!(!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	dump_amount = 0;
	R = null;
	rt.forList(f, 0, rt.sv(f, "product_records"), T("/datum/data/vending_product"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (rt.le(rt.fv(f, "amount", live(R)), 0)) {
			continue;
		}
		if (!truthy((dump_path = rt.fv(f, "product_path", live(R))))) {
			continue;
		}
		while (rt.gt(rt.fv(f, "amount", live(R)), 0)) {
			yield* g.call(f, P("/proc/step"), null, [(O = (yield* g.new_(f, live(dump_path), [rt.sv(f, "loc")]))), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")])]);
			(rt.modField(f, live(R), "amount", 5, subtract));
			dump_amount = rt.inc(live(dump_amount), 1);
		}
		if (rt.gt(live(dump_amount), 15)) {
			break;
		}
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.setSv(f, "icon_state", fmt("＀-broken", [rt.initial(f, live(f.src), "icon_state")]));
	return f.dot;
}, true);

// /obj/machinery/vending/proc/build_inventory  (code/game/machinery/vending.dm:177)  may sleep
rt.def("/obj/machinery/vending/proc/build_inventory", function* build_inventory(f: Frame, productlist: Value, hidden: Value, req_coin: Value, start_empty: Value) {
	let typepath: Value = null, amount: Value = null, temp: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [productlist, hidden, req_coin, start_empty, typepath, amount, temp, R, $e];
	if (live(hidden) === null) {
		hidden = 0;
	}
	if (live(req_coin) === null) {
		req_coin = 0;
	}
	if (live(start_empty) === null) {
		start_empty = null;
	}
	typepath = null;
	rt.forList(f, 0, live(productlist));
	while (($e = rt.next(f, 0)) !== undefined) {
		typepath = $e;
		if ((amount = rt.index(live(productlist), live(typepath))) === null) {
			amount = 0;
		}
		temp = (yield* g.new_(f, live(typepath), [null]));
		rt.setFv(f, "product_name", (R = (yield* g.new_(f, T("/datum/data/vending_product"), []))), rt.initial(f, live(temp), "name"));
		rt.setFv(f, "product_path", live(R), live(typepath));
		if (!truthy(live(start_empty))) {
			rt.setFv(f, "amount", live(R), live(amount));
		}
		rt.setFv(f, "max_amount", live(R), live(amount));
		rt.setFv(f, "display_color", live(R), rt.op(f, "PickUnweighted", [3], ["red", "blue", "green"]));
		if (truthy(live(hidden))) {
			rt.modSrcVar(f, "hidden_records", live(R), add);
		} else {
			if (truthy(live(req_coin))) {
				rt.modSrcVar(f, "coin_records", live(R), add);
			} else {
				rt.modSrcVar(f, "product_records", live(R), add);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/vending/proc/refill_inventory  (code/game/machinery/vending.dm:202)
rt.def("/obj/machinery/vending/proc/refill_inventory", function refill_inventory(f: Frame, refill: Value, machine: Value, charge_type: Value) {
	let total: Value = null, to_restock: Value = null, machine_content: Value = null, tmp_charges: Value = null, machine_content_3: Value = null, restock: Value = null;
	let $e: any;
	f.vars = () => [charge_type, total, to_restock, machine_content, tmp_charges, machine_content_3, restock, $e];
	if (live(charge_type) === null) {
		charge_type = 1;
	}
	total = 0;
	to_restock = 0;
	machine_content = null;
	rt.forList(f, 0, live(machine), T("/datum/data/vending_product"));
	while (($e = rt.next(f, 0)) !== undefined) {
		machine_content = $e;
		if ((isEqual(rt.fv(f, "amount", live(machine_content)), 0) && rt.gt(rt.index(rt.fv(f, "charges", live(refill)), live(charge_type)), 0))) {
			rt.incField(f, live(machine_content), "amount", 1, true);
			rt.incAt(rt.fv(f, "charges", live(refill)), live(charge_type), -1, true);
			total = rt.inc(live(total), 1);
		}
		to_restock = rt.modify(live(to_restock), subtract(rt.fv(f, "max_amount", live(machine_content)), rt.fv(f, "amount", live(machine_content))), add);
	}
	rt.endFor(f, 0);
	if (rt.le(live(to_restock), rt.index(rt.fv(f, "charges", live(refill)), live(charge_type)))) {
		machine_content = null;
		rt.forList(f, 0, live(machine), T("/datum/data/vending_product"));
		while (($e = rt.next(f, 0)) !== undefined) {
			machine_content = $e;
			rt.setFv(f, "amount", live(machine_content), rt.fv(f, "max_amount", live(machine_content)));
		}
		rt.endFor(f, 0);
		(rt.modAt(rt.fv(f, "charges", live(refill)), live(charge_type), live(to_restock), subtract));
		total = rt.modify(live(total), live(to_restock), add);
	} else {
		tmp_charges = rt.index(rt.fv(f, "charges", live(refill)), live(charge_type));
		machine_content_3 = null;
		rt.forList(f, 0, live(machine), T("/datum/data/vending_product"));
		while (($e = rt.next(f, 0)) !== undefined) {
			machine_content_3 = $e;
			if (isEqual(rt.index(rt.fv(f, "charges", live(refill)), live(charge_type)), 0)) {
				break;
			}
			if (rt.gt((restock = rt.call(f, P("/proc/Ceiling"), null, [multiply(divide(subtract(rt.fv(f, "max_amount", live(machine_content_3)), rt.fv(f, "amount", live(machine_content_3))), live(to_restock)), live(tmp_charges))])), rt.index(rt.fv(f, "charges", live(refill)), live(charge_type)))) {
				restock = rt.index(rt.fv(f, "charges", live(refill)), live(charge_type));
			}
			rt.modField(f, live(machine_content_3), "amount", live(restock), add);
			(rt.modAt(rt.fv(f, "charges", live(refill)), live(charge_type), live(restock), subtract));
			total = rt.modify(live(total), live(restock), add);
		}
		rt.endFor(f, 0);
	}
	return live(total);
});

// /obj/machinery/vending/snack/proc/attackby  (code/game/machinery/vending.dm:227)  may sleep
rt.def("/obj/machinery/vending/snack/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, _T: Value = null, loaded: Value = null, denied_items: Value = null, S_3: Value = null;
	let $e: any;
	f.vars = () => [S, _T, loaded, denied_items, S_3, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0))) {
		if (!truthy((yield* g.srcCall(f, "compartment_access_check", live(f.args[1]))))) {
			return live(f.dot);
		}
		if (!truthy(rt.gv(f, "junkiness", (S = live(f.args[0]))))) {
			if (!truthy((yield* g.srcCall(f, "iscompartmentfull", live(f.args[1]))))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.setFv(f, "loc", live(f.args[0]), live(f.src));
				yield* g.srcCall(f, "food_load", live(f.args[0]));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ into ＀'s chef compartment.</span>", [live(f.args[0]), live(f.src)])]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀'s chef compartment does not accept junk food.</span>", [live(f.src)])]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/tray")) ? 1 : 0))) {
			if (!truthy((yield* g.srcCall(f, "compartment_access_check", live(f.args[1]))))) {
				return live(f.dot);
			}
			_T = live(f.args[0]);
			loaded = 0;
			denied_items = 0;
			S_3 = null;
			rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/obj/item/weapon/reagent_containers/food/snacks"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S_3 = $e;
				if (truthy((yield* g.srcCall(f, "iscompartmentfull", live(f.args[1]))))) {
					break;
				}
				if (!truthy(rt.fv(f, "junkiness", live(S_3)))) {
					yield* g.callName(f, live(_T), "remove_from_storage", [live(S_3), live(f.src)]);
					yield* g.srcCall(f, "food_load", live(S_3));
					loaded = rt.inc(live(loaded), 1);
				} else {
					denied_items = rt.inc(live(denied_items), 1);
				}
			}
			rt.endFor(f, 0);
			if (truthy(live(denied_items))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ refuses some items.</span>", [live(f.src)])]);
			}
			if (truthy(live(loaded))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ dishes into ＀'s chef compartment.</span>", [live(loaded), live(f.src)])]);
			}
			yield* g.srcCall(f, "updateUsrDialog");
			return live(f.dot);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/vending/snack/proc/compartment_access_check  (code/game/machinery/vending.dm:267)
rt.def("/obj/machinery/vending/snack/proc/compartment_access_check", function compartment_access_check(f: Frame, user: Value) {
	rt.setSv(f, "req_access_txt", rt.sv(f, "chef_compartment_access"));
	if (((!truthy(rt.callSrc(f, "allowed", [live(user)])) && !truthy(rt.sv(f, "emagged"))) && truthy(rt.sv(f, "scan_id")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀'s chef compartment blinks red: Access denied.</span>", [live(f.src)])]);
		rt.setSv(f, "req_access_txt", "0");
		return 0;
	}
	rt.setSv(f, "req_access_txt", "0");
	return 1;
});

// /obj/machinery/vending/snack/proc/iscompartmentfull  (code/game/machinery/vending.dm:276)
rt.def("/obj/machinery/vending/snack/proc/iscompartmentfull", function iscompartmentfull(f: Frame, user: Value) {
	if (rt.ge(rt.len(f, rt.sv(f, "contents")), 30)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀'s chef compartment is full.</span>", [live(f.src)])]);
		return 1;
	}
	return 0;
});

// /obj/machinery/vending/snack/proc/food_load  (code/game/machinery/vending.dm:282)  may sleep
rt.def("/obj/machinery/vending/snack/proc/food_load", function* food_load(f: Frame, S: Value) {
	f.vars = () => [S];
	if (truthy(rt.index(rt.sv(f, "dish_quants"), rt.fv(f, "name", live(S))))) {
		rt.incAt(rt.sv(f, "dish_quants"), rt.fv(f, "name", live(S)), 1, true);
	} else {
		rt.setAt(rt.sv(f, "dish_quants"), rt.fv(f, "name", live(S)), 1);
	}
	yield* g.call(f, P("/proc/sortList"), null, [rt.sv(f, "dish_quants")]);
	return f.dot;
}, true);

// /obj/machinery/vending/proc/attackby  (code/game/machinery/vending.dm:290)  may sleep
rt.def("/obj/machinery/vending/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, canister: Value = null, transfered: Value = null;
	let $0: any, $1: any;
	f.vars = () => [S, canister, transfered, $0, $1];
	if (truthy(rt.sv(f, "panel_open"))) {
		if (truthy((yield* g.callSrc(f, "default_unfasten_wrench", [null, live(f.args[1]), null, live(f.args[0]), "time", 60], rt.Args.Named)))) {
			return live(f.dot);
		}
	}
	if (truthy(rt.sv(f, "component_parts"))) {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "anchored"))) {
			rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "panel_open"))) {
				$1 = "open";
			} else {
				$1 = "close";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the maintenance panel.</span>", [$1])]);
			yield* g.srcCall(f, "cut_overlays");
			if (truthy(rt.sv(f, "panel_open"))) {
				yield* g.srcCall(f, "add_overlay", fmt("＀-panel", [rt.initial(f, live(f.src), "icon_state")]));
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.srcCall(f, "updateUsrDialog");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You must first secure ＀.</span>", [live(f.src)])]);
		}
		return live(f.dot);
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)))) {
			if (truthy(rt.sv(f, "panel_open"))) {
				yield* g.srcCall(f, "attack_hand", live(f.args[1]));
			}
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/coin")) ? 1 : 0))) {
				if (truthy(rt.sv(f, "coin"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ already has ＀ inserted</span>", [live(f.src), rt.sv(f, "coin")])]);
					return live(f.dot);
				}
				if (truthy(rt.sv(f, "bill"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ already has ＀ inserted</span>", [live(f.src), rt.sv(f, "bill")])]);
					return live(f.dot);
				}
				if (!truthy(rt.len(f, rt.sv(f, "premium")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ doesn't have a coin slot.</span>", [live(f.src)])]);
					return live(f.dot);
				}
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.setFv(f, "loc", live(f.args[0]), live(f.src));
				rt.setSv(f, "coin", live(f.args[0]));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
				return live(f.dot);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/spacecash")) ? 1 : 0))) {
					if (truthy(rt.sv(f, "coin"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ already has ＀ inserted</span>", [live(f.src), rt.sv(f, "coin")])]);
						return live(f.dot);
					}
					if (truthy(rt.sv(f, "bill"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ already has ＀ inserted</span>", [live(f.src), rt.sv(f, "bill")])]);
						return live(f.dot);
					}
					S = live(f.args[0]);
					if (!truthy(rt.len(f, rt.sv(f, "premium")))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ doesn't have a bill slot.</span>", [live(f.src)])]);
						return live(f.dot);
					}
					yield* g.callName(f, live(S), "use", [1]);
					rt.setSv(f, "bill", (yield* g.new_(f, rt.fv(f, "type", live(S)), [live(f.src), 1])));
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
					return live(f.dot);
				} else {
					if ((truthy(rt.op(f, "IsType", [], [live(f.args[0]), rt.sv(f, "refill_canister")])) && rt.sv(f, "refill_canister") !== null)) {
						if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>It does nothing.</span>"]);
						} else {
							if (truthy(rt.sv(f, "panel_open"))) {
								if (isEqual(rt.index(rt.gv(f, "charges", (canister = live(f.args[0]))), 1), 0)) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>This ＀ is empty!</span>", [rt.fv(f, "name", live(canister))])]);
								} else {
									transfered = (yield* g.srcCall(f, "refill_inventory", live(canister), rt.sv(f, "product_records"), 1));
									transfered = rt.modify(live(transfered), (yield* g.srcCall(f, "refill_inventory", live(canister), rt.sv(f, "coin_records"), 3)), add);
									if (truthy((transfered = rt.modify(live(transfered), (yield* g.srcCall(f, "refill_inventory", live(canister), rt.sv(f, "hidden_records"), 2)), add)))) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You loaded ＀ items in ％！.</span>", [live(transfered), rt.sv(f, "name")])]);
									} else {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>The ＀ is fully stocked.</span>", [rt.sv(f, "name")])]);
									}
								}
								return live(f.dot);
							} else {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You should probably unscrew the service panel first.</span>"]);
							}
						}
					} else {
						return (yield* g.callSuper(f, [], rt.Args.Same));
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/vending/proc/on_deconstruction  (code/game/machinery/vending.dm:369)
rt.def("/obj/machinery/vending/proc/on_deconstruction", function on_deconstruction(f: Frame) {
	let product_list: Value = null, i: Value = null, machine_content: Value = null, safety: Value = null, VR: Value = null;
	let $e: any;
	f.vars = () => [product_list, i, machine_content, safety, VR, $e];
	product_list = rt.list(rt.sv(f, "product_records"), rt.sv(f, "hidden_records"), rt.sv(f, "coin_records"));
	i = null;
	i = 1;
	while (rt.le(live(i), 3)) {
		machine_content = null;
		rt.forList(f, 0, rt.index(live(product_list), live(i)), T("/datum/data/vending_product"));
		while (($e = rt.next(f, 0)) !== undefined) {
			machine_content = $e;
			while (!isEqual(rt.fv(f, "amount", live(machine_content)), 0)) {
				safety = 0;
				VR = null;
				rt.forList(f, 1, rt.sv(f, "component_parts"), T("/obj/item/weapon/vending_refill"));
				while (($e = rt.next(f, 1)) !== undefined) {
					VR = $e;
					safety = rt.inc(live(safety), 1);
					if (rt.lt(rt.index(rt.fv(f, "charges", live(VR)), live(i)), rt.index(rt.fv(f, "init_charges", live(VR)), live(i)))) {
						rt.incAt(rt.fv(f, "charges", live(VR)), live(i), 1, true);
						rt.incField(f, live(machine_content), "amount", -1, true);
						if (!truthy(rt.fv(f, "amount", live(machine_content)))) {
							break;
						}
					} else {
						safety = rt.inc(live(safety), -1);
					}
				}
				rt.endFor(f, 1);
				if (rt.le(live(safety), 0)) {
					break;
				}
			}
		}
		rt.endFor(f, 0);
		i = rt.inc(live(i), 1);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/machinery/vending/proc/emag_act  (code/game/machinery/vending.dm:387)
rt.def("/obj/machinery/vending/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "emagged", 1);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You short out the product lock on ＀.</span>", [live(f.src)])]);
	return f.dot;
});

// /obj/machinery/vending/proc/attack_ai  (code/game/machinery/vending.dm:392)  may sleep
rt.def("/obj/machinery/vending/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/vending/proc/attack_hand  (code/game/machinery/vending.dm:395)  may sleep
// tg_js: opens the `vending` tgui window instead of a /datum/browser popup (the HTML builder is gone).
rt.def("/obj/machinery/vending/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.sv(f, "panel_open")) && !truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
		return (yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(user)]));
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	if ((truthy(rt.sv(f, "seconds_electrified")) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 2)))) {
		if (truthy((yield* g.srcCall(f, "shock", live(user), 100)))) {
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/vending/proc/ui_interact  (tg_js, after modern tg's vending.dm)  may sleep
rt.def("/obj/machinery/vending/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "vending", rt.sv(f, "name"), 450, 500, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/vending/proc/ui_data  (tg_js)  may sleep
// products / hidden / premium are lists of {name, amount, color, ref}; hidden only with extended_inventory,
// premium only with a coin or bill inside. dishes are the snack machine's chef food compartment.
rt.def("/obj/machinery/vending/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, R: Value = null, O: Value = null, E: Value = null, products: Value = null, hidden: Value = null, premium: Value = null, dishes: Value = null;
	let $e: any;
	f.vars = () => [user, data, R, O, E, products, hidden, premium, dishes, $e];
	data = rt.list();
	products = rt.list();
	hidden = rt.list();
	premium = rt.list();
	dishes = rt.list();
	const has_money = truthy(rt.sv(f, "coin")) || truthy(rt.sv(f, "bill"));
	for (const [recs, out, show] of [["product_records", products, true], ["hidden_records", hidden, truthy(rt.sv(f, "extended_inventory"))], ["coin_records", premium, has_money]]) {
		if (!show) continue;
		R = null;
		rt.forList(f, 0, rt.sv(f, recs), T("/datum/data/vending_product"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			E = rt.list();
			rt.setAt(live(E), "name", (yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "product_name", live(R))])));
			rt.setAt(live(E), "amount", rt.fv(f, "amount", live(R)));
			rt.setAt(live(E), "color", rt.fv(f, "display_color", live(R)));
			rt.setAt(live(E), "id", fmt("＃", [live(R)]));
			rt.modify(live(out), rt.list(live(E)), add);
		}
		rt.endFor(f, 0);
	}
	rt.setAt(live(data), "products", live(products));
	rt.setAt(live(data), "hidden", live(hidden));
	rt.setAt(live(data), "premium", live(premium));
	rt.setAt(live(data), "has_premium", (rt.gt(rt.len(f, rt.sv(f, "premium")), 0) ? 1 : 0));
	rt.setAt(live(data), "coin", truthy(rt.sv(f, "coin")) ? fmt("＀", [rt.sv(f, "coin")]) : null);
	rt.setAt(live(data), "bill", truthy(rt.sv(f, "bill")) ? fmt("＀", [rt.sv(f, "bill")]) : null);
	rt.setAt(live(data), "has_money", has_money ? 1 : 0);
	rt.setAt(live(data), "is_snack", truthy((rt.istype(live(f.src), T("/obj/machinery/vending/snack")) ? 1 : 0)) ? 1 : 0);
	if (truthy(rt.at(live(data), "is_snack"))) {
		O = null;
		rt.forList(f, 0, rt.sv(f, "dish_quants"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			if (rt.gt(rt.index(rt.sv(f, "dish_quants"), live(O)), 0)) {
				E = rt.list();
				rt.setAt(live(E), "name", (yield* g.call(f, P("/proc/capitalize"), null, [live(O)])));
				rt.setAt(live(E), "key", live(O));
				rt.setAt(live(E), "amount", rt.index(rt.sv(f, "dish_quants"), live(O)));
				rt.modify(live(dishes), rt.list(live(E)), add);
			}
		}
		rt.endFor(f, 0);
	}
	rt.setAt(live(data), "dishes", live(dishes));
	return live(data);
}, true);

// /obj/machinery/vending/proc/ui_act  (tg_js)  may sleep
// The window's buttons go through the old Topic, so every vend check stays in one place.
rt.def("/obj/machinery/vending/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	f.vars = () => [action, params, ui, state];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (action === "vend") {
		yield* g.srcCall(f, "Topic", "", rt.alist(f, ["vend", rt.at(live(params), "id")]));
	} else if (action === "remove_coin") {
		yield* g.srcCall(f, "Topic", "", rt.alist(f, ["remove_coin", 1]));
	} else if (action === "dispense") {
		yield* g.srcCall(f, "Topic", "", rt.alist(f, ["dispense", rt.at(live(params), "key")]));
	} else {
		return 0;
	}
	yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// /obj/machinery/vending/proc/Topic  (code/game/machinery/vending.dm:453)  may sleep
rt.def("/obj/machinery/vending/proc/Topic", function* Topic(f: Frame) {
	let R: Value = null, N: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [R, N, O, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
		if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			if (!(truthy(rt.gv(f, "module", (R = live(f.usr)))) && truthy((rt.istype(rt.fv(f, "module", live(R)), T("/obj/item/weapon/robot_module/butler")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>The vending machine refuses to interface with you, as you are not in its target demographic!</span>"]);
				return live(f.dot);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>The vending machine refuses to interface with you, as you are not in its target demographic!</span>"]);
			return live(f.dot);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "remove_coin"))) {
		if (!(truthy(rt.sv(f, "coin")) || truthy(rt.sv(f, "bill")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>There is no money in this machine.</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "coin"))) {
			if (!truthy((yield* g.callName(f, live(f.usr), "get_active_held_item", [])))) {
				yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "coin")]);
			} else {
				yield* g.callName(f, rt.sv(f, "coin"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You remove ＀ from ＀.</span>", [rt.sv(f, "coin"), live(f.src)])]);
			rt.setSv(f, "coin", null);
		}
		if (truthy(rt.sv(f, "bill"))) {
			if (!truthy((yield* g.callName(f, live(f.usr), "get_active_held_item", [])))) {
				yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "bill")]);
			} else {
				yield* g.callName(f, rt.sv(f, "bill"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You remove ＀ from ＀.</span>", [rt.sv(f, "bill"), live(f.src)])]);
			rt.setSv(f, "bill", null);
		}
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if ((truthy(rt.at(live(f.args[1]), "dispense")) && truthy(rt.sv(f, "vend_ready")))) {
		N = rt.at(live(f.args[1]), "dispense");
		if (rt.le(rt.index(rt.sv(f, "dish_quants"), live(N)), 0)) {
			return live(f.dot);
		}
		rt.setSv(f, "vend_ready", 0);
		yield* g.srcCall(f, "use_power", 5);
		rt.setAt(rt.sv(f, "dish_quants"), live(N), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.index(rt.sv(f, "dish_quants"), live(N)), 1), 0])));
		O = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			if (isEqual(rt.fv(f, "name", live(O)), live(N))) {
				rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(f.src)));
				break;
			}
		}
		rt.endFor(f, 0);
		rt.setSv(f, "vend_ready", 1);
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	}
	if ((truthy(rt.at(live(f.args[1]), "vend")) && truthy(rt.sv(f, "vend_ready")))) {
		if (truthy(rt.sv(f, "panel_open"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>The vending machine cannot dispense products while its service panel is open!</span>"]);
			return live(f.dot);
		}
		if (((!truthy((yield* g.srcCall(f, "allowed", live(f.usr)))) && !truthy(rt.sv(f, "emagged"))) && truthy(rt.sv(f, "scan_id")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Access denied.</span>"]);
			yield* g.call(f, P("/proc/flick"), null, [rt.sv(f, "icon_deny"), live(f.src)]);
			return live(f.dot);
		}
		rt.setSv(f, "vend_ready", 0);
		if (((!truthy((R = rt.locateIn(f, rt.at(live(f.args[1]), "vend"), rt.world()))) || !truthy((rt.istype(live(R), T("/datum/data/vending_product")) ? 1 : 0))) || !truthy(rt.fv(f, "product_path", live(R))))) {
			rt.setSv(f, "vend_ready", 1);
			return live(f.dot);
		}
		if (truthy((rt.isIn(f, live(R), rt.sv(f, "hidden_records")) ? 1 : 0))) {
			if (!truthy(rt.sv(f, "extended_inventory"))) {
				rt.setSv(f, "vend_ready", 1);
				return live(f.dot);
			}
		} else {
			if (truthy((rt.isIn(f, live(R), rt.sv(f, "coin_records")) ? 1 : 0))) {
				if (!(truthy(rt.sv(f, "coin")) || truthy(rt.sv(f, "bill")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You need to insert money to get this item!</span>"]);
					rt.setSv(f, "vend_ready", 1);
					return live(f.dot);
				}
				if ((truthy(rt.sv(f, "coin")) && truthy(rt.fv(f, "string_attached", rt.sv(f, "coin"))))) {
					if (truthy(rt.op(f, "Prob", [], [50]))) {
						if (truthy((yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "coin")])))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You successfully pull ＀ out before ＀ could swallow it.</span>", [rt.sv(f, "coin"), live(f.src)])]);
							rt.setSv(f, "coin", null);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You couldn't pull ＀ out because your hands are full!</span>", [rt.sv(f, "coin")])]);
							yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "coin")]);
							rt.setSv(f, "coin", null);
						}
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You weren't able to pull ＀ out fast enough, the machine ate it, string and all!</span>", [rt.sv(f, "coin")])]);
						yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "coin")]);
						rt.setSv(f, "coin", null);
					}
				} else {
					yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "coin")]);
					rt.setSv(f, "coin", null);
					yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "bill")]);
					rt.setSv(f, "bill", null);
				}
			} else {
				if (!truthy((rt.isIn(f, live(R), rt.sv(f, "product_records")) ? 1 : 0))) {
					rt.setSv(f, "vend_ready", 1);
					yield* g.call(f, P("/proc/message_admins"), null, [fmt("Vending machine exploit attempted by ＀!", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr), rt.fv(f, "client", live(f.usr))]))])]);
					return live(f.dot);
				}
			}
		}
		if (rt.le(rt.fv(f, "amount", live(R)), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Sold out.</span>"]);
			rt.setSv(f, "vend_ready", 1);
			return live(f.dot);
		} else {
			rt.incField(f, live(R), "amount", -1, true);
		}
		if ((rt.le(add(rt.sv(f, "last_reply"), 200), rt.worldTime(f)) && truthy(rt.sv(f, "vend_reply")))) {
			yield* g.srcCall(f, "speak", rt.sv(f, "vend_reply"));
			rt.setSv(f, "last_reply", rt.worldTime(f));
		}
		yield* g.srcCall(f, "use_power", 5);
		if (truthy(rt.sv(f, "icon_vend"))) {
			yield* g.call(f, P("/proc/flick"), null, [rt.sv(f, "icon_vend"), live(f.src)]);
		}
		yield* g.new_(f, rt.fv(f, "product_path", live(R)), [rt.getStep(f, live(f.src), 0)]);
		rt.setSv(f, "vend_ready", 1);
		return live(f.dot);
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	} else {
		if ((truthy(rt.at(live(f.args[1]), "togglevoice")) && truthy(rt.sv(f, "panel_open")))) {
			rt.setSv(f, "shut_up", (!truthy(rt.sv(f, "shut_up")) ? 1 : 0));
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/vending/proc/process  (code/game/machinery/vending.dm:579)  may sleep
rt.def("/obj/machinery/vending/proc/process", function* process(f: Frame) {
	let slogan: Value = null;
	f.vars = () => [slogan];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "active"))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "seconds_electrified"), 0)) {
		rt.incSrcVar(f, "seconds_electrified", -1, true);
	}
	if ((((rt.le(add(rt.sv(f, "last_slogan"), rt.sv(f, "slogan_delay")), rt.worldTime(f)) && rt.gt(rt.len(f, rt.sv(f, "slogan_list")), 0)) && !truthy(rt.sv(f, "shut_up"))) && truthy(rt.op(f, "Prob", [], [5])))) {
		yield* g.srcCall(f, "speak", (slogan = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "slogan_list")])));
		rt.setSv(f, "last_slogan", rt.worldTime(f));
	}
	if (!(truthy(rt.sv(f, "shoot_inventory")) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "shoot_inventory_chance")])))) return f.dot;
	yield* g.srcCall(f, "throw_item");
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/vending/proc/speak  (code/game/machinery/vending.dm:598)  may sleep
rt.def("/obj/machinery/vending/proc/speak", function* speak(f: Frame, message: Value) {
	f.vars = () => [message];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy(live(message))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "say", live(message));
	return f.dot;
}, true);

// /obj/machinery/vending/proc/power_change  (code/game/machinery/vending.dm:606)
rt.def("/obj/machinery/vending/proc/power_change", function power_change(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.setSv(f, "icon_state", fmt("＀-broken", [rt.initial(f, live(f.src), "icon_state")]));
	} else {
		if (truthy(rt.callSrc(f, "powered", []))) {
			rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
			(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		} else {
			rt.setSv(f, "icon_state", fmt("＀-off", [rt.initial(f, live(f.src), "icon_state")]));
			(rt.modSrcVar(f, "stat", 2, rt.bitOr));
		}
	}
	return f.dot;
});

// /obj/machinery/vending/proc/throw_item  (code/game/machinery/vending.dm:620)  may sleep
rt.def("/obj/machinery/vending/proc/throw_item", function* throw_item(f: Frame) {
	let throw_item: Value = null, target: Value = null, R: Value = null, dump_path: Value = null;
	let $e: any;
	f.vars = () => [throw_item, target, R, dump_path, $e];
	throw_item = null;
	if (!truthy((target = rt.locateIn(f, T("/mob/living"), (yield* g.call(f, P("/proc/view"), null, [7, live(f.src)])))))) {
		return 0;
	}
	R = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/shuffle"), null, [rt.sv(f, "product_records")])), T("/datum/data/vending_product"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (rt.le(rt.fv(f, "amount", live(R)), 0)) {
			continue;
		}
		if (!truthy((dump_path = rt.fv(f, "product_path", live(R))))) {
			continue;
		}
		rt.incField(f, live(R), "amount", -1, true);
		throw_item = (yield* g.new_(f, live(dump_path), [rt.sv(f, "loc")]));
		break;
	}
	rt.endFor(f, 0);
	if (!truthy(live(throw_item))) {
		return 0;
	}
	yield* g.srcCall(f, "pre_throw", live(throw_item));
	yield* g.callName(f, live(throw_item), "throw_at", [live(target), 16, 3]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ launches ＀ at ＀!</span>", [live(f.src), live(throw_item), live(target)]));
	return 1;
}, true);

// /obj/machinery/vending/proc/shock  (code/game/machinery/vending.dm:648)  may sleep
rt.def("/obj/machinery/vending/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	let check_range: Value = null;
	f.vars = () => [user, prb, check_range];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return 0;
	}
	if (!truthy(rt.op(f, "Prob", [], [live(prb)]))) {
		return 0;
	}
	yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
	check_range = 1;
	if (truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(user), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), live(f.src), 0.699999988079071, live(check_range)])))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

rt.type(10646, "/obj/machinery/vending/boozeomat", "/obj/machinery/vending", {
	icon_deny: "boozeomat-deny",
	products: null,
	contraband: null,
	product_slogans: "I hope nobody asks me for a bloody cup o' tea...;Alcohol is humanity's friend. Would you abandon a friend?;Quite delighted to serve you!;Is nobody thirsty on this station?",
	product_ads: "Drink up!;Booze is good for you!;Alcohol is humanity's best friend.;Quite delighted to serve you!;Care for a nice, cold beer?;Nothing cures you like booze!;Have a sip!;Have a drink!;Have a beer!;Beer is good for you!;Only the finest alcohol!;Best quality booze since 2053!;Award-winning wine!;Maximum alcohol!;Man loves beer.;A toast for progress!",
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/boozeomat"),
	name: "１Booze-O-Mat",
	desc: "A technological marvel, supposedly able to mix just the mixture you'd like to drink the moment you ask for one.",
	icon_state: "boozeomat",
	req_access_txt: "25",
});

// /obj/machinery/vending/boozeomat/proc/<init>  (code/game/machinery/vending.dm:692)
rt.def("/obj/machinery/vending/boozeomat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/bottle/gin"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/tequila"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/vermouth"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/rum"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/wine"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/cognac"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/kahlua"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/hcider"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/grappa"), 5, T("/obj/item/weapon/reagent_containers/food/drinks/ale"), 6, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/orangejuice"), 4, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/tomatojuice"), 4, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/limejuice"), 4, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/cream"), 4, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/tonic"), 8, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/cola"), 8, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/sodawater"), 15, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), 30, T("/obj/item/weapon/reagent_containers/food/drinks/ice"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass"), 12, T("/obj/item/weapon/reagent_containers/food/drinks/flask"), 3]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/mug/tea"), 12]));
	return f.dot;
});

rt.type(10647, "/obj/machinery/vending/assist", "/obj/machinery/vending", {
	products: null,
	contraband: null,
	product_ads: "Only the finest!;Have some tools.;The most robust equipment.;The finest gear in space!",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/assist/proc/<init>  (code/game/machinery/vending.dm:712)
rt.def("/obj/machinery/vending/assist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/device/assembly/prox_sensor"), 5, T("/obj/item/device/assembly/igniter"), 3, T("/obj/item/device/assembly/signaler"), 4, T("/obj/item/weapon/wirecutters"), 1, T("/obj/item/weapon/cartridge/signal"), 4]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/device/assembly/timer"), 2, T("/obj/item/device/assembly/voice"), 2, T("/obj/item/device/assembly/health"), 2]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10648, "/obj/machinery/vending/coffee", "/obj/machinery/vending", {
	product_ads: "Have a drink!;Drink up!;It's good for you!;Would you like a hot joe?;I'd kill for some coffee!;The best beans in the galaxy.;Only the finest brew for you.;Mmmm. Nothing like a coffee.;I like coffee, don't you?;Coffee helps you work!;Try some tea.;We hope you like the best!;Try our new chocolate!;Admin conspiracies",
	icon_vend: "coffee-vend",
	products: null,
	contraband: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/coffee"),
	name: "１Solar's Best Hot Drinks",
	desc: "A vending machine which dispenses hot drinks.",
	icon_state: "coffee",
});

// /obj/machinery/vending/coffee/proc/<init>  (code/game/machinery/vending.dm:725)
rt.def("/obj/machinery/vending/coffee/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/coffee"), 25, T("/obj/item/weapon/reagent_containers/food/drinks/mug/tea"), 25, T("/obj/item/weapon/reagent_containers/food/drinks/mug/coco"), 25]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/ice"), 12]));
	return f.dot;
});

// /obj/machinery/vending/snack/proc/<init>  (code/game/machinery/vending.dm:735)
rt.def("/obj/machinery/vending/snack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/candy"), 6, T("/obj/item/weapon/reagent_containers/food/drinks/dry_ramen"), 6, T("/obj/item/weapon/reagent_containers/food/snacks/chips"), 6, T("/obj/item/weapon/reagent_containers/food/snacks/sosjerky"), 6, T("/obj/item/weapon/reagent_containers/food/snacks/no_raisin"), 6, T("/obj/item/weapon/reagent_containers/food/snacks/spacetwinkie"), 6, T("/obj/item/weapon/reagent_containers/food/snacks/cheesiehonkers"), 6]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/syndicake"), 6]));
	return f.dot;
});

rt.type(10641, "/obj/machinery/vending/snack/random", "/obj/machinery/vending/snack", {
	name: "１Random Snackies",
	desc: "Uh oh!",
});

// /obj/machinery/vending/snack/random/proc/Initialize  (code/game/machinery/vending.dm:747)  may sleep
rt.def("/obj/machinery/vending/snack/random/proc/Initialize", function* Initialize(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	_T = rt.op(f, "PickUnweighted", [1], [subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/machinery/vending/snack")])), T("/obj/machinery/vending/snack")), T("/obj/machinery/vending/snack/random"))]);
	yield* g.new_(f, live(_T), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10649, "/obj/machinery/vending/sustenance", "/obj/machinery/vending", {
	product_slogans: "Enjoy your meal.;Enough calories to support strenuous labor.",
	product_ads: "Sufficiently healthy.;Efficiently produced tofu!;Mmm! So good!;Have a meal.;You need food to live!;Have some more candy corn!;Try our new ice cups!",
	products: null,
	contraband: null,
	name: "１Sustenance Vendor",
	desc: "A vending machine which vends food, as required by section 47-C of the NT's Prisoner Ethical Treatment Agreement.",
	icon_state: "sustenance",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/sustenance/proc/<init>  (code/game/machinery/vending.dm:770)
rt.def("/obj/machinery/vending/sustenance/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/tofu"), 24, T("/obj/item/weapon/reagent_containers/food/drinks/ice"), 12, T("/obj/item/weapon/reagent_containers/food/snacks/candy_corn"), 6, T("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle"), 10]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/kitchen/knife"), 6, T("/obj/item/weapon/reagent_containers/food/drinks/coffee"), 12, T("/obj/item/weapon/tank/internals/emergency_oxygen"), 6, T("/obj/item/clothing/mask/breath"), 6]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10650, "/obj/machinery/vending/cola", "/obj/machinery/vending", {
	product_slogans: "Robust Softdrinks: More robust than a toolbox to the head!",
	product_ads: "Refreshing!;Hope you're thirsty!;Over 1 million drinks sold!;Thirsty? Why not cola?;Please, have a drink!;Drink up!;The best drinks in space.",
	products: null,
	contraband: null,
	premium: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/cola"),
	name: "１Robust Softdrinks",
	desc: "A softdrink vendor provided by Robust Industries, LLC.",
	icon_state: "Cola_Machine",
});

// /obj/machinery/vending/cola/proc/<init>  (code/game/machinery/vending.dm:787)
rt.def("/obj/machinery/vending/cola/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/cola"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_mountain_wind"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/dr_gibb"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/starkist"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_up"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/pwr_game"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime"), 10, T("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle"), 10]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/thirteenloko"), 6, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/shamblers"), 6]));
	$0 = $0;
	rt.setSv(f, "premium", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/nuka_cola"), 1, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/air"), 1]));
	return f.dot;
});

rt.type(10651, "/obj/machinery/vending/cola/random", "/obj/machinery/vending/cola", {
	name: "１Random Drinkies",
	desc: "Uh oh!",
});

// /obj/machinery/vending/cola/random/proc/Initialize  (code/game/machinery/vending.dm:800)  may sleep
rt.def("/obj/machinery/vending/cola/random/proc/Initialize", function* Initialize(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	_T = rt.op(f, "PickUnweighted", [1], [subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/machinery/vending/cola")])), T("/obj/machinery/vending/cola")), T("/obj/machinery/vending/cola/random"))]);
	yield* g.new_(f, live(_T), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10659, "/obj/machinery/vending/cola/shamblers", "/obj/machinery/vending/cola", {
	products: null,
	product_slogans: "~Shake me up some of that Shambler's Juice!~",
	product_ads: "Refreshing!;Jyrbv dv lg jfdv fw kyrk Jyrdscvi'j Alztv!;Over 1 trillion souls drank!;Thirsty? Nyp efk uizeb kyv uribevjj?;Kyv Jyrdscvi uizebj kyv ezxyk!;Drink up!;Krjkp.",
	name: "１Shambler's Vendor",
	desc: "~Shake me up some of that Shambler's Juice!~",
	icon_state: "shamblers_juice",
});

// /obj/machinery/vending/cola/shamblers/proc/<init>  (code/game/machinery/vending.dm:842)
rt.def("/obj/machinery/vending/cola/shamblers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/cola"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_mountain_wind"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/dr_gibb"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/starkist"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_up"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/pwr_game"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime"), 10, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/shamblers"), 10]));
	return f.dot;
});

rt.type(10660, "/obj/machinery/vending/cart", "/obj/machinery/vending", {
	product_slogans: "Carts to go!",
	icon_deny: "cart-deny",
	products: null,
	name: "１PTech",
	desc: "Cartridges for PDAs",
	icon_state: "cart",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/cart/proc/<init>  (code/game/machinery/vending.dm:857)
rt.def("/obj/machinery/vending/cart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/cartridge/medical"), 10, T("/obj/item/weapon/cartridge/engineering"), 10, T("/obj/item/weapon/cartridge/security"), 10, T("/obj/item/weapon/cartridge/janitor"), 10, T("/obj/item/weapon/cartridge/signal/toxins"), 10, T("/obj/item/device/pda/heads"), 10, T("/obj/item/weapon/cartridge/captain"), 3, T("/obj/item/weapon/cartridge/quartermaster"), 10]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10661, "/obj/machinery/vending/liberationstation", "/obj/machinery/vending", {
	product_slogans: "Liberation Station: Your one-stop shop for all things second ammendment!;Be a patriot today, pick up a gun!;Quality weapons for cheap prices!;Better dead than red!",
	product_ads: "Float like an astronaut, sting like a bullet!;Express your second ammendment today!;Guns don't kill people, but you can!;Who needs responsibilities when you have guns?",
	vend_reply: "Remember the name: Liberation Station!",
	products: null,
	premium: null,
	contraband: null,
	name: "１Liberation Station",
	desc: "An overwhelming amount of <b>ancient patriotism</b> washes over you just by looking at the machine.",
	icon_state: "liberationstation",
	req_access_txt: "1",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/liberationstation/proc/<init>  (code/game/machinery/vending.dm:871)
rt.def("/obj/machinery/vending/liberationstation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/gold"), 2, T("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/camo"), 2, T("/obj/item/weapon/gun/ballistic/automatic/pistol/m1911"), 2, T("/obj/item/weapon/gun/ballistic/automatic/proto/unrestricted"), 2, T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat"), 2, T("/obj/item/weapon/gun/ballistic/automatic/gyropistol"), 1, T("/obj/item/weapon/gun/ballistic/shotgun"), 2, T("/obj/item/weapon/gun/ballistic/automatic/ar"), 2]));
	$0 = $0;
	rt.setSv(f, "premium", rt.alist(f, [T("/obj/item/ammo_box/magazine/smgm9mm"), 2, T("/obj/item/ammo_box/magazine/m50"), 4, T("/obj/item/ammo_box/magazine/m45"), 2, T("/obj/item/ammo_box/magazine/m75"), 2]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/clothing/under/patriotsuit"), 1, T("/obj/item/weapon/bedsheet/patriot"), 3]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10662, "/obj/machinery/vending/cigarette", "/obj/machinery/vending", {
	product_slogans: "Space cigs taste good like a cigarette should.;I'd rather toolbox than switch.;Smoke!;Don't believe the reports - smoke today!",
	product_ads: "Probably not bad for you!;Don't believe the scientists!;It's good for you!;Don't quit, buy more!;Smoke!;Nicotine heaven.;Best cigarettes since 2150.;Award-winning cigs.",
	products: null,
	contraband: null,
	premium: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/cigarette"),
	name: "１ShadyCigs Deluxe",
	desc: "If you want to get cancer, might as well do it in style.",
	icon_state: "cigs",
});

// /obj/machinery/vending/cigarette/proc/<init>  (code/game/machinery/vending.dm:886)
rt.def("/obj/machinery/vending/cigarette/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/storage/fancy/cigarettes"), 5, T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_uplift"), 3, T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_robust"), 3, T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_carp"), 3, T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_midori"), 3, T("/obj/item/weapon/storage/box/matches"), 10, T("/obj/item/weapon/lighter/greyscale"), 4, T("/obj/item/weapon/storage/fancy/rollingpapers"), 5]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/lighter"), 3, T("/obj/item/clothing/mask/vape"), 5]));
	$0 = $0;
	rt.setSv(f, "premium", rt.alist(f, [T("/obj/item/weapon/storage/fancy/cigarettes/cigpack_robustgold"), 3, T("/obj/item/weapon/storage/fancy/cigarettes/cigars"), 1, T("/obj/item/weapon/storage/fancy/cigarettes/cigars/havana"), 1, T("/obj/item/weapon/storage/fancy/cigarettes/cigars/cohiba"), 1]));
	return f.dot;
});

// /obj/machinery/vending/cigarette/proc/pre_throw  (code/game/machinery/vending.dm:900)
rt.def("/obj/machinery/vending/cigarette/proc/pre_throw", function pre_throw(f: Frame, I: Value) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy((rt.istype(live(I), T("/obj/item/weapon/lighter")) ? 1 : 0))) return f.dot;
	rt.callName(f, (L = live(I)), "set_lit", [1]);
	return f.dot;
});

rt.type(10663, "/obj/machinery/vending/medical", "/obj/machinery/vending", {
	icon_deny: "med-deny",
	product_ads: "Go save some lives!;The best stuff for your medbay.;Only the finest tools.;Natural chemicals!;This stuff saves lives.;Don't you want some?;Ping!",
	products: null,
	contraband: null,
	premium: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/medical"),
	name: "１NanoMed Plus",
	desc: "Medical drug dispenser.",
	icon_state: "med",
	req_access_txt: "5",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/medical/proc/<init>  (code/game/machinery/vending.dm:911)
rt.def("/obj/machinery/vending/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/reagent_containers/syringe"), 12, T("/obj/item/weapon/reagent_containers/dropper"), 3, T("/obj/item/stack/medical/gauze"), 8, T("/obj/item/weapon/reagent_containers/pill/patch/styptic"), 5, T("/obj/item/weapon/reagent_containers/pill/insulin"), 10, T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), 5, T("/obj/item/weapon/reagent_containers/glass/bottle/charcoal"), 4, T("/obj/item/weapon/reagent_containers/spray/medical/sterilizer"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/epinephrine"), 4, T("/obj/item/weapon/reagent_containers/glass/bottle/morphine"), 4, T("/obj/item/weapon/reagent_containers/glass/bottle/salglu_solution"), 3, T("/obj/item/weapon/reagent_containers/glass/bottle/toxin"), 3, T("/obj/item/weapon/reagent_containers/syringe/antiviral"), 6, T("/obj/item/weapon/reagent_containers/pill/salbutamol"), 2, T("/obj/item/device/healthanalyzer"), 4, T("/obj/item/device/sensor_device"), 2]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/reagent_containers/pill/tox"), 3, T("/obj/item/weapon/reagent_containers/pill/morphine"), 4, T("/obj/item/weapon/reagent_containers/pill/charcoal"), 6]));
	$0 = $0;
	rt.setSv(f, "premium", rt.alist(f, [T("/obj/item/weapon/storage/box/hug/medical"), 1, T("/obj/item/weapon/reagent_containers/hypospray/medipen"), 3, T("/obj/item/weapon/storage/belt/medical"), 3, T("/obj/item/weapon/wrench/medical"), 1]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10664, "/obj/machinery/vending/plasmaresearch", "/obj/machinery/vending", {
	products: null,
	contraband: null,
	name: "１Toximate 3000",
	desc: "All the fine parts you need in one vending machine!",
});

// /obj/machinery/vending/plasmaresearch/proc/<init>  (code/game/machinery/vending.dm:925)
rt.def("/obj/machinery/vending/plasmaresearch/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/clothing/under/rank/scientist"), 6, T("/obj/item/clothing/suit/bio_suit"), 6, T("/obj/item/clothing/head/bio_hood"), 6, T("/obj/item/device/transfer_valve"), 6, T("/obj/item/device/assembly/timer"), 6, T("/obj/item/device/assembly/signaler"), 6, T("/obj/item/device/assembly/prox_sensor"), 6, T("/obj/item/device/assembly/igniter"), 6]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/device/assembly/health"), 3]));
	return f.dot;
});

rt.type(10665, "/obj/machinery/vending/wallmed", "/obj/machinery/vending", {
	icon_deny: "wallmed-deny",
	products: null,
	contraband: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/medical"),
	refill_count: 1,
	name: "１NanoMed",
	desc: "Wall-mounted Medical Equipment dispenser.",
	icon_state: "wallmed",
	density: 0,
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/wallmed/proc/<init>  (code/game/machinery/vending.dm:936)
rt.def("/obj/machinery/vending/wallmed/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/reagent_containers/syringe"), 3, T("/obj/item/weapon/reagent_containers/pill/patch/styptic"), 5, T("/obj/item/weapon/reagent_containers/pill/patch/silver_sulf"), 5, T("/obj/item/weapon/reagent_containers/pill/charcoal"), 2, T("/obj/item/weapon/reagent_containers/spray/medical/sterilizer"), 1]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/reagent_containers/pill/tox"), 2, T("/obj/item/weapon/reagent_containers/pill/morphine"), 2]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10666, "/obj/machinery/vending/security", "/obj/machinery/vending", {
	product_ads: "Crack capitalist skulls!;Beat some heads in!;Don't forget - harm is good!;Your weapons are right here.;Handcuffs!;Freeze, scumbag!;Don't tase me bro!;Tase them, bro.;Why not have a donut?",
	icon_deny: "sec-deny",
	products: null,
	contraband: null,
	premium: null,
	name: "１SecTech",
	desc: "A security equipment vendor",
	icon_state: "sec",
	req_access_txt: "1",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/security/proc/<init>  (code/game/machinery/vending.dm:952)
rt.def("/obj/machinery/vending/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/restraints/handcuffs"), 8, T("/obj/item/weapon/restraints/handcuffs/cable/zipties"), 10, T("/obj/item/weapon/grenade/flashbang"), 4, T("/obj/item/device/assembly/flash/handheld"), 5, T("/obj/item/weapon/reagent_containers/food/snacks/donut"), 12, T("/obj/item/weapon/storage/box/evidence"), 6, T("/obj/item/device/flashlight/seclite"), 4, T("/obj/item/weapon/restraints/legcuffs/bola/energy"), 7]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/clothing/glasses/sunglasses"), 2, T("/obj/item/weapon/storage/fancy/donut_box"), 2]));
	$0 = $0;
	rt.setSv(f, "premium", rt.alist(f, [T("/obj/item/weapon/coin/antagtoken"), 1]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

// /obj/machinery/vending/security/proc/pre_throw  (code/game/machinery/vending.dm:960)  may sleep
rt.def("/obj/machinery/vending/security/proc/pre_throw", function* pre_throw(f: Frame, I: Value) {
	let G: Value = null, F: Value = null;
	f.vars = () => [I, G, F];
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/grenade")) ? 1 : 0))) {
		yield* g.callName(f, (G = live(I)), "preprime", []);
	} else {
		if (!truthy((rt.istype(live(I), T("/obj/item/device/flashlight")) ? 1 : 0))) return f.dot;
		rt.setFv(f, "on", (F = live(I)), 1);
		yield* g.callName(f, live(F), "update_brightness", []);
	}
	return f.dot;
}, true);

rt.type(10667, "/obj/machinery/vending/hydronutrients", "/obj/machinery/vending", {
	product_slogans: "Aren't you glad you don't have to fertilize the natural way?;Now with 50% less stink!;Plants are people too!",
	product_ads: "We like plants!;Don't you want some?;The greenest thumbs ever.;We like big plants.;Soft soil...",
	icon_deny: "nutri-deny",
	products: null,
	contraband: null,
	name: "１NutriMax",
	desc: "A plant nutrients vendor.",
	icon_state: "nutri",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/hydronutrients/proc/<init>  (code/game/machinery/vending.dm:975)
rt.def("/obj/machinery/vending/hydronutrients/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/ez"), 30, T("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/l4z"), 20, T("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/rh"), 10, T("/obj/item/weapon/reagent_containers/spray/pestspray"), 20, T("/obj/item/weapon/reagent_containers/syringe"), 5, T("/obj/item/weapon/storage/bag/plants"), 5, T("/obj/item/weapon/cultivator"), 3, T("/obj/item/weapon/shovel/spade"), 3, T("/obj/item/device/plant_analyzer"), 4]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bottle/ammonia"), 10, T("/obj/item/weapon/reagent_containers/glass/bottle/diethylamine"), 5]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10668, "/obj/machinery/vending/hydroseeds", "/obj/machinery/vending", {
	product_slogans: "THIS'S WHERE TH' SEEDS LIVE! GIT YOU SOME!;Hands down the best seed selection on the station!;Also certain mushroom varieties available, more for experts! Get certified today!",
	product_ads: "We like plants!;Grow some crops!;Grow, baby, growww!;Aw h'yeah son!",
	products: null,
	contraband: null,
	premium: null,
	name: "１MegaSeed Servitor",
	desc: "When you need seeds fast!",
	icon_state: "seeds",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/hydroseeds/proc/<init>  (code/game/machinery/vending.dm:987)
rt.def("/obj/machinery/vending/hydroseeds/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/seeds/ambrosia"), 3, T("/obj/item/seeds/apple"), 3, T("/obj/item/seeds/banana"), 3, T("/obj/item/seeds/berry"), 3, T("/obj/item/seeds/cabbage"), 3, T("/obj/item/seeds/carrot"), 3, T("/obj/item/seeds/cherry"), 3, T("/obj/item/seeds/chanter"), 3, T("/obj/item/seeds/chili"), 3, T("/obj/item/seeds/cocoapod"), 3, T("/obj/item/seeds/coffee"), 3, T("/obj/item/seeds/corn"), 3, T("/obj/item/seeds/eggplant"), 3, T("/obj/item/seeds/grape"), 3, T("/obj/item/seeds/grass"), 3, T("/obj/item/seeds/lemon"), 3, T("/obj/item/seeds/lime"), 3, T("/obj/item/seeds/onion"), 3, T("/obj/item/seeds/orange"), 3, T("/obj/item/seeds/potato"), 3, T("/obj/item/seeds/poppy"), 3, T("/obj/item/seeds/pumpkin"), 3, T("/obj/item/seeds/replicapod"), 3, T("/obj/item/seeds/wheat/rice"), 3, T("/obj/item/seeds/soya"), 3, T("/obj/item/seeds/sunflower"), 3, T("/obj/item/seeds/tea"), 3, T("/obj/item/seeds/tobacco"), 3, T("/obj/item/seeds/tomato"), 3, T("/obj/item/seeds/tower"), 3, T("/obj/item/seeds/watermelon"), 3, T("/obj/item/seeds/wheat"), 3, T("/obj/item/seeds/whitebeet"), 3]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/seeds/amanita"), 2, T("/obj/item/seeds/glowshroom"), 2, T("/obj/item/seeds/liberty"), 2, T("/obj/item/seeds/nettle"), 2, T("/obj/item/seeds/plump"), 2, T("/obj/item/seeds/reishi"), 2, T("/obj/item/seeds/cannabis"), 3, T("/obj/item/seeds/starthistle"), 2, T("/obj/item/seeds/random"), 2]));
	$0 = $0;
	rt.setSv(f, "premium", rt.alist(f, [T("/obj/item/weapon/reagent_containers/spray/waterflower"), 1]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10669, "/obj/machinery/vending/magivend", "/obj/machinery/vending", {
	product_slogans: "Sling spells the proper way with MagiVend!;Be your own Houdini! Use MagiVend!",
	vend_reply: "Have an enchanted evening!",
	product_ads: "FJKLFJSD;AJKFLBJAKL;1234 LOONIES LOL!;>MFW;Kill them fuckers!;GET DAT FUKKEN DISK;HONK!;EI NATH;Destroy the station!;Admin conspiracies since forever!;Space-time bending hardware!",
	products: null,
	contraband: null,
	name: "１MagiVend",
	desc: "A magic vending machine.",
	icon_state: "MagiVend",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/magivend/proc/<init>  (code/game/machinery/vending.dm:1009)
rt.def("/obj/machinery/vending/magivend/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/clothing/head/wizard"), 1, T("/obj/item/clothing/suit/wizrobe"), 1, T("/obj/item/clothing/head/wizard/red"), 1, T("/obj/item/clothing/suit/wizrobe/red"), 1, T("/obj/item/clothing/head/wizard/yellow"), 1, T("/obj/item/clothing/suit/wizrobe/yellow"), 1, T("/obj/item/clothing/shoes/sandal/magic"), 1, T("/obj/item/weapon/staff"), 2]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/bottle/wizarditis"), 1]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10670, "/obj/machinery/vending/autodrobe", "/obj/machinery/vending", {
	icon_deny: "theater-deny",
	product_slogans: "Dress for success!;Suited and booted!;It's show time!;Why leave style up to fate? Use AutoDrobe!",
	vend_reply: "Thank you for using AutoDrobe!",
	products: null,
	contraband: null,
	premium: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/autodrobe"),
	name: "１AutoDrobe",
	desc: "A vending machine for costumes.",
	icon_state: "theater",
	req_access_txt: "46",
});

// /obj/machinery/vending/autodrobe/proc/<init>  (code/game/machinery/vending.dm:1022)
rt.def("/obj/machinery/vending/autodrobe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/clothing/suit/chickensuit"), 1, T("/obj/item/clothing/head/chicken"), 1, T("/obj/item/clothing/under/gladiator"), 1, T("/obj/item/clothing/head/helmet/gladiator"), 1, T("/obj/item/clothing/under/gimmick/rank/captain/suit"), 1, T("/obj/item/clothing/head/flatcap"), 1, T("/obj/item/clothing/suit/toggle/labcoat/mad"), 1, T("/obj/item/clothing/shoes/jackboots"), 1, T("/obj/item/clothing/under/schoolgirl"), 1, T("/obj/item/clothing/under/schoolgirl/red"), 1, T("/obj/item/clothing/under/schoolgirl/green"), 1, T("/obj/item/clothing/under/schoolgirl/orange"), 1, T("/obj/item/clothing/head/kitty"), 1, T("/obj/item/clothing/under/skirt/black"), 1, T("/obj/item/clothing/head/beret"), 1, T("/obj/item/clothing/accessory/waistcoat"), 1, T("/obj/item/clothing/under/suit_jacket"), 1, T("/obj/item/clothing/head/that"), 1, T("/obj/item/clothing/under/kilt"), 1, T("/obj/item/clothing/head/beret"), 1, T("/obj/item/clothing/accessory/waistcoat"), 1, T("/obj/item/clothing/glasses/monocle"), 1, T("/obj/item/clothing/head/bowler"), 1, T("/obj/item/weapon/cane"), 1, T("/obj/item/clothing/under/sl_suit"), 1, T("/obj/item/clothing/mask/fakemoustache"), 1, T("/obj/item/clothing/suit/bio_suit/plaguedoctorsuit"), 1, T("/obj/item/clothing/head/plaguedoctorhat"), 1, T("/obj/item/clothing/mask/gas/plaguedoctor"), 1, T("/obj/item/clothing/suit/toggle/owlwings"), 1, T("/obj/item/clothing/under/owl"), 1, T("/obj/item/clothing/mask/gas/owl_mask"), 1, T("/obj/item/clothing/suit/toggle/owlwings/griffinwings"), 1, T("/obj/item/clothing/under/griffin"), 1, T("/obj/item/clothing/shoes/griffin"), 1, T("/obj/item/clothing/head/griffin"), 1, T("/obj/item/clothing/suit/apron"), 1, T("/obj/item/clothing/under/waiter"), 1, T("/obj/item/clothing/suit/jacket/miljacket"), 1, T("/obj/item/clothing/under/pirate"), 1, T("/obj/item/clothing/suit/pirate"), 1, T("/obj/item/clothing/head/pirate"), 1, T("/obj/item/clothing/head/bandana"), 1, T("/obj/item/clothing/head/bandana"), 1, T("/obj/item/clothing/under/soviet"), 1, T("/obj/item/clothing/head/ushanka"), 1, T("/obj/item/clothing/suit/imperium_monk"), 1, T("/obj/item/clothing/mask/gas/cyborg"), 1, T("/obj/item/clothing/suit/holidaypriest"), 1, T("/obj/item/clothing/head/wizard/marisa/fake"), 1, T("/obj/item/clothing/suit/wizrobe/marisa/fake"), 1, T("/obj/item/clothing/under/sundress"), 1, T("/obj/item/clothing/head/witchwig"), 1, T("/obj/item/weapon/staff/broom"), 1, T("/obj/item/clothing/suit/wizrobe/fake"), 1, T("/obj/item/clothing/head/wizard/fake"), 1, T("/obj/item/weapon/staff"), 3, T("/obj/item/clothing/mask/gas/sexyclown"), 1, T("/obj/item/clothing/under/rank/clown/sexy"), 1, T("/obj/item/clothing/mask/gas/sexymime"), 1, T("/obj/item/clothing/under/sexymime"), 1, T("/obj/item/clothing/mask/rat/bat"), 1, T("/obj/item/clothing/mask/rat/bee"), 1, T("/obj/item/clothing/mask/rat/bear"), 1, T("/obj/item/clothing/mask/rat/raven"), 1, T("/obj/item/clothing/mask/rat/jackal"), 1, T("/obj/item/clothing/mask/rat/fox"), 1, T("/obj/item/clothing/mask/rat/tribal"), 1, T("/obj/item/clothing/mask/rat"), 1, T("/obj/item/clothing/suit/apron/overalls"), 1, T("/obj/item/clothing/head/rabbitears"), 1, T("/obj/item/clothing/head/sombrero"), 1, T("/obj/item/clothing/head/sombrero/green"), 1, T("/obj/item/clothing/suit/poncho"), 1, T("/obj/item/clothing/suit/poncho/green"), 1, T("/obj/item/clothing/suit/poncho/red"), 1, T("/obj/item/clothing/under/maid"), 1, T("/obj/item/clothing/under/janimaid"), 1, T("/obj/item/clothing/glasses/cold"), 1, T("/obj/item/clothing/glasses/heat"), 1, T("/obj/item/clothing/suit/whitedress"), 1, T("/obj/item/clothing/under/jester"), 1, T("/obj/item/clothing/head/jester"), 1, T("/obj/item/clothing/under/villain"), 1, T("/obj/item/clothing/shoes/singery"), 1, T("/obj/item/clothing/under/singery"), 1, T("/obj/item/clothing/shoes/singerb"), 1, T("/obj/item/clothing/under/singerb"), 1, T("/obj/item/clothing/suit/hooded/carp_costume"), 1, T("/obj/item/clothing/suit/hooded/ian_costume"), 1, T("/obj/item/clothing/suit/hooded/bee_costume"), 1, T("/obj/item/clothing/suit/snowman"), 1, T("/obj/item/clothing/head/snowman"), 1, T("/obj/item/clothing/mask/joy"), 1, T("/obj/item/clothing/head/cueball"), 1, T("/obj/item/clothing/under/scratch"), 1, T("/obj/item/clothing/under/sailor"), 1]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/clothing/suit/judgerobe"), 1, T("/obj/item/clothing/head/powdered_wig"), 1, T("/obj/item/weapon/gun/magic/wand"), 2, T("/obj/item/clothing/glasses/sunglasses/garb"), 2, T("/obj/item/clothing/glasses/sunglasses/blindfold"), 1, T("/obj/item/clothing/mask/muzzle"), 2]));
	$0 = $0;
	rt.setSv(f, "premium", rt.alist(f, [T("/obj/item/clothing/suit/pirate/captain"), 2, T("/obj/item/clothing/head/pirate/captain"), 2, T("/obj/item/clothing/head/helmet/roman"), 1, T("/obj/item/clothing/head/helmet/roman/legionaire"), 1, T("/obj/item/clothing/under/roman"), 1, T("/obj/item/clothing/shoes/roman"), 1, T("/obj/item/weapon/shield/riot/roman"), 1, T("/obj/item/weapon/skub"), 1]));
	return f.dot;
});

rt.type(10671, "/obj/machinery/vending/dinnerware", "/obj/machinery/vending", {
	product_ads: "Mm, food stuffs!;Food and food accessories.;Get your plates!;You like forks?;I like forks.;Woo, utensils.;You don't really need these...",
	products: null,
	contraband: null,
	name: "１Plasteel Chef's Dinnerware Vendor",
	desc: "A kitchen and restaurant equipment vendor",
	icon_state: "dinnerware",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/dinnerware/proc/<init>  (code/game/machinery/vending.dm:1064)
rt.def("/obj/machinery/vending/dinnerware/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/storage/bag/tray"), 8, T("/obj/item/weapon/kitchen/fork"), 6, T("/obj/item/weapon/kitchen/knife"), 6, T("/obj/item/weapon/kitchen/rollingpin"), 2, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), 8, T("/obj/item/clothing/suit/apron/chef"), 2, T("/obj/item/weapon/reagent_containers/food/condiment/pack/ketchup"), 5, T("/obj/item/weapon/reagent_containers/food/condiment/pack/hotsauce"), 5, T("/obj/item/weapon/reagent_containers/food/condiment/saltshaker"), 5, T("/obj/item/weapon/reagent_containers/food/condiment/peppermill"), 5, T("/obj/item/weapon/reagent_containers/glass/bowl"), 20]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/kitchen/rollingpin"), 2, T("/obj/item/weapon/kitchen/knife/butcher"), 2]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10672, "/obj/machinery/vending/sovietsoda", "/obj/machinery/vending", {
	product_ads: "For Tsar and Country.;Have you fulfilled your nutrition quota today?;Very nice!;We are simple people, for this is all we eat.;If there is a person, there is a problem. If there is no person, then there is no problem.",
	products: null,
	contraband: null,
	name: "１BODA",
	desc: "Old sweet water vending machine",
	icon_state: "sovietsoda",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/sovietsoda/proc/<init>  (code/game/machinery/vending.dm:1074)
rt.def("/obj/machinery/vending/sovietsoda/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/soda"), 30]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/cola"), 20]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10673, "/obj/machinery/vending/tool", "/obj/machinery/vending", {
	icon_deny: "tool-deny",
	products: null,
	contraband: null,
	premium: null,
	name: "１YouTool",
	desc: "Tools for tools.",
	icon_state: "tool",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/tool/proc/<init>  (code/game/machinery/vending.dm:1085)
rt.def("/obj/machinery/vending/tool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/stack/cable_coil/random"), 10, T("/obj/item/weapon/crowbar"), 5, T("/obj/item/weapon/weldingtool"), 3, T("/obj/item/weapon/wirecutters"), 5, T("/obj/item/weapon/wrench"), 5, T("/obj/item/device/analyzer"), 5, T("/obj/item/device/t_scanner"), 5, T("/obj/item/weapon/screwdriver"), 5, T("/obj/item/device/flashlight/glowstick"), 3, T("/obj/item/device/flashlight/glowstick/red"), 3, T("/obj/item/device/flashlight"), 5]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/weldingtool/hugetank"), 2, T("/obj/item/clothing/gloves/color/fyellow"), 2]));
	$0 = $0;
	rt.setSv(f, "premium", rt.alist(f, [T("/obj/item/clothing/gloves/color/yellow"), 1]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 70]));
	return f.dot;
});

rt.type(10674, "/obj/machinery/vending/engivend", "/obj/machinery/vending", {
	icon_deny: "engivend-deny",
	products: null,
	contraband: null,
	premium: null,
	name: "１Engi-Vend",
	desc: "Spare tool vending. What? Did you expect some witty description?",
	icon_state: "engivend",
	req_access_txt: "11",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/engivend/proc/<init>  (code/game/machinery/vending.dm:1111)
rt.def("/obj/machinery/vending/engivend/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/clothing/glasses/meson/engine"), 2, T("/obj/item/device/multitool"), 4, T("/obj/item/weapon/electronics/airlock"), 10, T("/obj/item/weapon/electronics/apc"), 10, T("/obj/item/weapon/electronics/airalarm"), 10, T("/obj/item/weapon/stock_parts/cell/high"), 10, T("/obj/item/weapon/construction/rcd/loaded"), 3, T("/obj/item/device/geiger_counter"), 5]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/stock_parts/cell/potato"), 3]));
	$0 = $0;
	rt.setSv(f, "premium", rt.alist(f, [T("/obj/item/weapon/storage/belt/utility"), 3]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10675, "/obj/machinery/vending/engineering", "/obj/machinery/vending", {
	icon_deny: "engi-deny",
	products: null,
	name: "１Robco Tool Maker",
	desc: "Everything you need for do-it-yourself station repair.",
	icon_state: "engi",
	req_access_txt: "11",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/engineering/proc/<init>  (code/game/machinery/vending.dm:1124)
rt.def("/obj/machinery/vending/engineering/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/clothing/under/rank/chief_engineer"), 4, T("/obj/item/clothing/under/rank/engineer"), 4, T("/obj/item/clothing/shoes/sneakers/orange"), 4, T("/obj/item/clothing/head/hardhat"), 4, T("/obj/item/weapon/storage/belt/utility"), 4, T("/obj/item/clothing/glasses/meson/engine"), 4, T("/obj/item/clothing/gloves/color/yellow"), 4, T("/obj/item/weapon/screwdriver"), 12, T("/obj/item/weapon/crowbar"), 12, T("/obj/item/weapon/wirecutters"), 12, T("/obj/item/device/multitool"), 12, T("/obj/item/weapon/wrench"), 12, T("/obj/item/device/t_scanner"), 12, T("/obj/item/weapon/stock_parts/cell"), 8, T("/obj/item/weapon/weldingtool"), 8, T("/obj/item/clothing/head/welding"), 8, T("/obj/item/weapon/light/tube"), 10, T("/obj/item/clothing/suit/fire"), 4, T("/obj/item/weapon/stock_parts/scanning_module"), 5, T("/obj/item/weapon/stock_parts/micro_laser"), 5, T("/obj/item/weapon/stock_parts/matter_bin"), 5, T("/obj/item/weapon/stock_parts/manipulator"), 5, T("/obj/item/weapon/stock_parts/console_screen"), 5]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10676, "/obj/machinery/vending/robotics", "/obj/machinery/vending", {
	icon_deny: "robotics-deny",
	products: null,
	name: "１Robotech Deluxe",
	desc: "All the tools you need to create your own robot army.",
	icon_state: "robotics",
	req_access_txt: "29",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/robotics/proc/<init>  (code/game/machinery/vending.dm:1140)
rt.def("/obj/machinery/vending/robotics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/clothing/suit/toggle/labcoat"), 4, T("/obj/item/clothing/under/rank/roboticist"), 4, T("/obj/item/stack/cable_coil"), 4, T("/obj/item/device/assembly/flash/handheld"), 4, T("/obj/item/weapon/stock_parts/cell/high"), 12, T("/obj/item/device/assembly/prox_sensor"), 3, T("/obj/item/device/assembly/signaler"), 3, T("/obj/item/device/healthanalyzer"), 3, T("/obj/item/weapon/scalpel"), 2, T("/obj/item/weapon/circular_saw"), 2, T("/obj/item/weapon/tank/internals/anesthetic"), 2, T("/obj/item/clothing/mask/breath/medical"), 5, T("/obj/item/weapon/screwdriver"), 5, T("/obj/item/weapon/crowbar"), 5]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

rt.type(10677, "/obj/machinery/vending/clothing", "/obj/machinery/vending", {
	product_slogans: "Dress for success!;Prepare to look swagalicious!;Look at all this free swag!;Why leave style up to fate? Use the ClothesMate!",
	vend_reply: "Thank you for using the ClothesMate!",
	products: null,
	contraband: null,
	premium: null,
	refill_canister: rt.typePath("/obj/item/weapon/vending_refill/clothing"),
	name: "ClothesMate",
	desc: "A vending machine for clothing.",
	icon_state: "clothes",
});

// /obj/machinery/vending/clothing/proc/<init>  (code/game/machinery/vending.dm:1154)
rt.def("/obj/machinery/vending/clothing/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/clothing/head/that"), 2, T("/obj/item/clothing/head/fedora"), 1, T("/obj/item/clothing/glasses/monocle"), 1, T("/obj/item/clothing/suit/jacket"), 2, T("/obj/item/clothing/suit/jacket/puffer/vest"), 2, T("/obj/item/clothing/suit/jacket/puffer"), 2, T("/obj/item/clothing/under/suit_jacket/navy"), 1, T("/obj/item/clothing/under/suit_jacket/really_black"), 1, T("/obj/item/clothing/under/suit_jacket/burgundy"), 1, T("/obj/item/clothing/under/suit_jacket/charcoal"), 1, T("/obj/item/clothing/under/suit_jacket/white"), 1, T("/obj/item/clothing/under/kilt"), 1, T("/obj/item/clothing/under/overalls"), 1, T("/obj/item/clothing/under/sl_suit"), 1, T("/obj/item/clothing/under/pants/jeans"), 3, T("/obj/item/clothing/under/pants/classicjeans"), 2, T("/obj/item/clothing/under/pants/camo"), 1, T("/obj/item/clothing/under/pants/blackjeans"), 2, T("/obj/item/clothing/under/pants/khaki"), 2, T("/obj/item/clothing/under/pants/white"), 2, T("/obj/item/clothing/under/pants/red"), 1, T("/obj/item/clothing/under/pants/black"), 2, T("/obj/item/clothing/under/pants/tan"), 2, T("/obj/item/clothing/under/pants/track"), 1, T("/obj/item/clothing/suit/jacket/miljacket"), 1, T("/obj/item/clothing/neck/tie/blue"), 1, T("/obj/item/clothing/neck/tie/red"), 1, T("/obj/item/clothing/neck/tie/black"), 1, T("/obj/item/clothing/neck/tie/horrible"), 1, T("/obj/item/clothing/neck/scarf/red"), 1, T("/obj/item/clothing/neck/scarf/green"), 1, T("/obj/item/clothing/neck/scarf/darkblue"), 1, T("/obj/item/clothing/neck/scarf/purple"), 1, T("/obj/item/clothing/neck/scarf/yellow"), 1, T("/obj/item/clothing/neck/scarf/orange"), 1, T("/obj/item/clothing/neck/scarf/cyan"), 1, T("/obj/item/clothing/neck/scarf"), 1, T("/obj/item/clothing/neck/scarf/black"), 1, T("/obj/item/clothing/neck/scarf/zebra"), 1, T("/obj/item/clothing/neck/scarf/christmas"), 1, T("/obj/item/clothing/neck/stripedredscarf"), 1, T("/obj/item/clothing/neck/stripedbluescarf"), 1, T("/obj/item/clothing/neck/stripedgreenscarf"), 1, T("/obj/item/clothing/accessory/waistcoat"), 1, T("/obj/item/clothing/under/skirt/black"), 1, T("/obj/item/clothing/under/skirt/blue"), 1, T("/obj/item/clothing/under/skirt/red"), 1, T("/obj/item/clothing/under/skirt/purple"), 1, T("/obj/item/clothing/under/sundress"), 2, T("/obj/item/clothing/under/stripeddress"), 1, T("/obj/item/clothing/under/sailordress"), 1, T("/obj/item/clothing/under/redeveninggown"), 1, T("/obj/item/clothing/under/blacktango"), 1, T("/obj/item/clothing/under/plaid_skirt"), 1, T("/obj/item/clothing/under/plaid_skirt/blue"), 1, T("/obj/item/clothing/under/plaid_skirt/purple"), 1, T("/obj/item/clothing/under/plaid_skirt/green"), 1, T("/obj/item/clothing/glasses/regular"), 1, T("/obj/item/clothing/glasses/regular/jamjar"), 1, T("/obj/item/clothing/head/sombrero"), 1, T("/obj/item/clothing/suit/poncho"), 1, T("/obj/item/clothing/suit/ianshirt"), 1, T("/obj/item/clothing/shoes/laceup"), 2, T("/obj/item/clothing/shoes/sneakers/black"), 4, T("/obj/item/clothing/shoes/sandal"), 1, T("/obj/item/clothing/gloves/fingerless"), 2, T("/obj/item/clothing/glasses/orange"), 1, T("/obj/item/clothing/glasses/red"), 1, T("/obj/item/weapon/storage/belt/fannypack"), 1, T("/obj/item/weapon/storage/belt/fannypack/blue"), 1, T("/obj/item/weapon/storage/belt/fannypack/red"), 1, T("/obj/item/clothing/suit/jacket/letterman"), 2, T("/obj/item/clothing/head/beanie"), 1, T("/obj/item/clothing/head/beanie/black"), 1, T("/obj/item/clothing/head/beanie/red"), 1, T("/obj/item/clothing/head/beanie/green"), 1, T("/obj/item/clothing/head/beanie/darkblue"), 1, T("/obj/item/clothing/head/beanie/purple"), 1, T("/obj/item/clothing/head/beanie/yellow"), 1, T("/obj/item/clothing/head/beanie/orange"), 1, T("/obj/item/clothing/head/beanie/cyan"), 1, T("/obj/item/clothing/head/beanie/christmas"), 1, T("/obj/item/clothing/head/beanie/striped"), 1, T("/obj/item/clothing/head/beanie/stripedred"), 1, T("/obj/item/clothing/head/beanie/stripedblue"), 1, T("/obj/item/clothing/head/beanie/stripedgreen"), 1, T("/obj/item/clothing/suit/jacket/letterman_red"), 1]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/clothing/under/syndicate/tacticool"), 1, T("/obj/item/clothing/mask/balaclava"), 1, T("/obj/item/clothing/head/ushanka"), 1, T("/obj/item/clothing/under/soviet"), 1, T("/obj/item/weapon/storage/belt/fannypack/black"), 2, T("/obj/item/clothing/suit/jacket/letterman_syndie"), 1, T("/obj/item/clothing/under/jabroni"), 1, T("/obj/item/clothing/suit/vapeshirt"), 1, T("/obj/item/clothing/under/geisha"), 1]));
	$0 = $0;
	rt.setSv(f, "premium", rt.alist(f, [T("/obj/item/clothing/under/suit_jacket/checkered"), 1, T("/obj/item/clothing/head/mailman"), 1, T("/obj/item/clothing/under/rank/mailman"), 1, T("/obj/item/clothing/suit/jacket/leather"), 1, T("/obj/item/clothing/suit/jacket/leather/overcoat"), 1, T("/obj/item/clothing/under/pants/mustangjeans"), 1, T("/obj/item/clothing/neck/necklace/dope"), 3, T("/obj/item/clothing/suit/jacket/letterman_nanotrasen"), 1]));
	return f.dot;
});

rt.type(10678, "/obj/machinery/vending/toyliberationstation", "/obj/machinery/vending", {
	product_slogans: "Get your cool toys today!;Trigger a valid hunter today!;Quality toy weapons for cheap prices!;Give them to HoPs for all access!;Give them to HoS to get perma briged!",
	product_ads: "Feel robust with your toys!;Express your inner child today!;Toy weapons don't kill people, but valid hunters do!;Who needs responsibilities when you have toy weapons?;Make your next murder FUN!",
	vend_reply: "Come back for more!",
	products: null,
	contraband: null,
	name: "１Syndicate Donksoft Toy Vendor",
	desc: "A ages 8 and up approved vendor that dispenses toys. If you were to find the right wires, you can unlock the adult mode setting!",
	icon_state: "syndi",
	req_access_txt: "1",
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/vending/toyliberationstation/proc/<init>  (code/game/machinery/vending.dm:1191)
rt.def("/obj/machinery/vending/toyliberationstation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "products", rt.alist(f, [T("/obj/item/weapon/gun/ballistic/automatic/toy/unrestricted"), 10, T("/obj/item/weapon/gun/ballistic/automatic/toy/pistol/unrestricted"), 10, T("/obj/item/weapon/gun/ballistic/shotgun/toy/unrestricted"), 10, T("/obj/item/toy/sword"), 10, T("/obj/item/ammo_box/foambox"), 20, T("/obj/item/toy/foamblade"), 10, T("/obj/item/toy/syndicateballoon"), 10, T("/obj/item/clothing/suit/syndicatefake"), 5, T("/obj/item/clothing/head/syndicatefake"), 5]));
	$0 = $0;
	rt.setSv(f, "contraband", rt.alist(f, [T("/obj/item/weapon/gun/ballistic/shotgun/toy/crossbow"), 10, T("/obj/item/weapon/gun/ballistic/automatic/c20r/toy/unrestricted"), 10, T("/obj/item/weapon/gun/ballistic/automatic/l6_saw/toy/unrestricted"), 10, T("/obj/item/ammo_box/foambox/riot"), 20, T("/obj/item/toy/katana"), 10, T("/obj/item/weapon/twohanded/dualsaber/toy"), 5, T("/obj/item/toy/cards/deck/syndicate"), 10]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});
