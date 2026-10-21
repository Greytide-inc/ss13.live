// From code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10895, "/obj/machinery/icecream_vat", "/obj/machinery", {
	product_types: null,
	dispense_flavour: 1,
	flavour_name: "vanilla",
	anchored: 0,
	use_power: 0,
	container_type: 4096,
	name: "ice cream vat",
	desc: "Ding-aling ding dong. Get your Nanotrasen-approved ice cream!",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "icecream_vat",
	density: 1,
	layer: 2.9,
	obj_integrity: 300,
	max_integrity: 300,
});

// /obj/machinery/icecream_vat/proc/<init>  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:17)
rt.def("/obj/machinery/icecream_vat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "product_types", rt.list());
	return f.dot;
});

// /obj/machinery/icecream_vat/proc/get_ingredient_list  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:25)
rt.def("/obj/machinery/icecream_vat/proc/get_ingredient_list", function get_ingredient_list(f: Frame, type: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(type);
	if ($0 === 2) {
		return rt.list("milk", "ice", "cocoa");
	} else if ($0 === 3) {
		return rt.list("milk", "ice", "berryjuice");
	} else if ($0 === 4) {
		return rt.list("milk", "ice", "singulo");
	} else if ($0 === 5) {
		return rt.list("flour", "sugar");
	} else if ($0 === 6) {
		return rt.list("flour", "sugar", "cocoa");
	} else {
		return rt.list("milk", "ice");
	}
	return f.dot;
});

// /obj/machinery/icecream_vat/proc/get_flavour_name  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:41)
rt.def("/obj/machinery/icecream_vat/proc/get_flavour_name", function get_flavour_name(f: Frame, flavour_type: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(flavour_type);
	if ($0 === 2) {
		return "chocolate";
	} else if ($0 === 3) {
		return "strawberry";
	} else if ($0 === 4) {
		return "blue";
	} else if ($0 === 5) {
		return "waffle";
	} else if ($0 === 6) {
		return "chocolate";
	} else {
		return "vanilla";
	}
	return f.dot;
});

// /obj/machinery/icecream_vat/proc/New  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:57)  may sleep
rt.def("/obj/machinery/icecream_vat/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	while (rt.lt(rt.len(f, rt.sv(f, "product_types")), 6)) {
		yield* g.callName(f, rt.sv(f, "product_types"), "Add", [5]);
	}
	yield* g.srcCall(f, "create_reagents");
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [0]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["milk", 5]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["flour", 5]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["sugar", 5]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["ice", 5]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["cocoa", 5]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["berryjuice", 5]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["singulo", 5]);
	return f.dot;
}, true);

// /obj/machinery/icecream_vat/proc/attack_hand  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:71)  may sleep
rt.def("/obj/machinery/icecream_vat/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/icecream_vat/proc/interact  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:76)  may sleep
rt.def("/obj/machinery/icecream_vat/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, R: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, R, popup, $e];
	dat = null;
	dat = rt.modify(live(dat), "<b>ICE CREAM</b><br><div class='statusDisplay'>", add);
	dat = rt.modify(live(dat), fmt("<b>Dispensing: ＀ icecream </b> <br><br>", [rt.sv(f, "flavour_name")]), add);
	dat = rt.modify(live(dat), fmt("<b>Vanilla ice cream:</b> <a href='?src=＃;select=＀'><b>Select</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ scoops left. (Ingredients: milk, ice)<br>", [live(f.src), 1, live(f.src), 1, live(f.src), 1, rt.index(rt.sv(f, "product_types"), 1)]), add);
	dat = rt.modify(live(dat), fmt("<b>Strawberry ice cream:</b> <a href='?src=＃;select=＀'><b>Select</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ dollops left. (Ingredients: milk, ice, berry juice)<br>", [live(f.src), 3, live(f.src), 3, live(f.src), 3, rt.index(rt.sv(f, "product_types"), 3)]), add);
	dat = rt.modify(live(dat), fmt("<b>Chocolate ice cream:</b> <a href='?src=＃;select=＀'><b>Select</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ dollops left. (Ingredients: milk, ice, coco powder)<br>", [live(f.src), 2, live(f.src), 2, live(f.src), 2, rt.index(rt.sv(f, "product_types"), 2)]), add);
	dat = rt.modify(live(dat), fmt("<b>Blue ice cream:</b> <a href='?src=＃;select=＀'><b>Select</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ dollops left. (Ingredients: milk, ice, singulo)<br></div>", [live(f.src), 4, live(f.src), 4, live(f.src), 4, rt.index(rt.sv(f, "product_types"), 4)]), add);
	dat = rt.modify(live(dat), "<br><b>CONES</b><br><div class='statusDisplay'>", add);
	dat = rt.modify(live(dat), fmt("<b>Waffle cones:</b> <a href='?src=＃;cone=＀'><b>Dispense</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ cones left. (Ingredients: flour, sugar)<br>", [live(f.src), 5, live(f.src), 5, live(f.src), 5, rt.index(rt.sv(f, "product_types"), 5)]), add);
	dat = rt.modify(live(dat), fmt("<b>Chocolate cones:</b> <a href='?src=＃;cone=＀'><b>Dispense</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ cones left. (Ingredients: flour, sugar, coco powder)<br></div>", [live(f.src), 6, live(f.src), 6, live(f.src), 6, rt.index(rt.sv(f, "product_types"), 6)]), add);
	dat = rt.modify(live(dat), "<br>", add);
	dat = rt.modify(live(dat), "<b>VAT CONTENT</b><br>", add);
	R = null;
	rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		dat = rt.modify(live(dat), fmt("＀: ＀", [rt.fv(f, "name", live(R)), rt.fv(f, "volume", live(R))]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;disposeI=＀'>Purge</A><BR>", [live(f.src), rt.fv(f, "id", live(R))]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;refresh=1'>Refresh</a> <a href='?src=＃;close=1'>Close</a>", [live(f.src), live(f.src)]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "icecreamvat", "Icecream Vat", 700, 500, live(f.src)]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/icecream_vat/proc/attackby  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:97)  may sleep
rt.def("/obj/machinery/icecream_vat/proc/attackby", function* attackby(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/icecream")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "ice_creamed", (I = live(f.args[0]))))) {
			if (rt.gt(rt.index(rt.sv(f, "product_types"), rt.sv(f, "dispense_flavour")), 0)) {
				yield* g.callName(f, live(f.src), "visible_message", [fmt("＀ <span class='info'>＀ scoops delicious ＀ ice cream into ＀.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)])), live(f.args[1]), rt.sv(f, "flavour_name"), live(I)])]);
				(rt.modAt(rt.sv(f, "product_types"), rt.sv(f, "dispense_flavour"), 1, subtract));
				yield* g.callName(f, live(I), "add_ice_cream", [rt.sv(f, "flavour_name")]);
				if (rt.lt(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(I))), 10)) {
					yield* g.callName(f, rt.fv(f, "reagents", live(I)), "add_reagent", ["sugar", subtract(10, rt.gv(f, "total_volume", rt.fv(f, "reagents", live(I))))]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is not enough ice cream left!</span>"]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ already has ice cream in it.</span>", [live(f.args[0])])]);
		}
		return 1;
	} else {
		if (truthy((yield* g.callName(f, live(f.args[0]), "is_open_container", [])))) {
			return live(f.dot);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/icecream_vat/proc/make  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:119)  may sleep
rt.def("/obj/machinery/icecream_vat/proc/make", function* make(f: Frame, user: Value, make_type: Value, amount: Value) {
	let R: Value = null, flavour: Value = null;
	let $e: any;
	f.vars = () => [user, make_type, amount, R, flavour, $e];
	R = null;
	rt.forList(f, 0, (yield* g.srcCall(f, "get_ingredient_list", live(make_type))));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", [live(R), live(amount)])))) {
			continue;
		}
		amount = 0;
		break;
	}
	rt.endFor(f, 0);
	if (truthy(live(amount))) {
		R = null;
		rt.forList(f, 0, (yield* g.srcCall(f, "get_ingredient_list", live(make_type))));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			yield* g.callName(f, rt.sv(f, "reagents"), "remove_reagent", [live(R), live(amount)]);
		}
		rt.endFor(f, 0);
		rt.modAt(rt.sv(f, "product_types"), live(make_type), live(amount), add);
		flavour = (yield* g.srcCall(f, "get_flavour_name", live(make_type)));
		if (rt.gt(live(make_type), 4)) {
			yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='info'>＀ cooks up some ＀ cones.</span>", [live(user), live(flavour)])]);
		} else {
			yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='info'>＀ whips up some ＀ icecream.</span>", [live(user), live(flavour)])]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't have the ingredients to make this!</span>"]);
	}
	return f.dot;
}, true);

// /obj/machinery/icecream_vat/proc/Topic  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:137)  may sleep
rt.def("/obj/machinery/icecream_vat/proc/Topic", function* Topic(f: Frame) {
	let dispense_cone: Value = null, cone_name: Value = null, I: Value = null, amount: Value = null, C: Value = null;
	f.vars = () => [dispense_cone, cone_name, I, amount, C];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "select"))) {
		rt.setSv(f, "dispense_flavour", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "select")])));
		rt.setSv(f, "flavour_name", (yield* g.srcCall(f, "get_flavour_name", rt.sv(f, "dispense_flavour"))));
		yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='notice'>＀ sets ＀ to dispense ＀ flavoured ice cream.</span>", [live(f.usr), live(f.src), rt.sv(f, "flavour_name")])]);
	}
	if (truthy(rt.at(live(f.args[1]), "cone"))) {
		dispense_cone = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "cone")]));
		cone_name = (yield* g.srcCall(f, "get_flavour_name", live(dispense_cone)));
		if (rt.ge(rt.index(rt.sv(f, "product_types"), live(dispense_cone)), 1)) {
			(rt.modAt(rt.sv(f, "product_types"), live(dispense_cone), 1, subtract));
			yield* g.callName(f, (I = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/icecream"), [rt.fv(f, "loc", live(f.src))]))), "set_cone_type", [live(cone_name)]);
			yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='info'>＀ dispenses a crunchy ＀ cone from ＀.</span>", [live(f.usr), live(cone_name), live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>There are no ＀ cones left!</span>", [live(cone_name)])]);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "make"))) {
		amount = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "amount")]));
		C = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "make")]));
		yield* g.srcCall(f, "make", live(f.usr), live(C), live(amount));
	}
	if (truthy(rt.at(live(f.args[1]), "disposeI"))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "del_reagent", [rt.at(live(f.args[1]), "disposeI")]);
	}
	yield* g.srcCall(f, "updateDialog");
	if (truthy(rt.at(live(f.args[1]), "refresh"))) {
		yield* g.srcCall(f, "updateDialog");
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		rt.op(f, "Browse", [], [live(f.usr), null, "window=icecreamvat"], false);
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

rt.type(6253, "/obj/item/weapon/reagent_containers/food/snacks/icecream", "/obj/item/weapon/reagent_containers/food/snacks", {
	ice_creamed: 0,
	cone_type: null,
	bitesize: 3,
	name: "ice cream cone",
	desc: "Delicious waffle cone, but no ice cream.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "icecream_cone_waffle",
});

// /obj/item/weapon/reagent_containers/food/snacks/icecream/proc/Initialize  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:183)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/icecream/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "create_reagents", 20);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["nutriment", 4]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/icecream/proc/set_cone_type  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:188)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/icecream/proc/set_cone_type", function* set_cone_type(f: Frame, cone_name: Value) {
	let $0: any;
	f.vars = () => [cone_name, $0];
	rt.setSv(f, "cone_type", live(cone_name));
	rt.setSv(f, "icon_state", fmt("icecream_cone_＀", [live(cone_name)]));
	$0 = rt.sv(f, "cone_type");
	if ($0 === "waffle") {
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["nutriment", 1]);
	} else if ($0 === "chocolate") {
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["cocoa", 1]);
	}
	rt.setSv(f, "desc", fmt("Delicious ＀ cone, but no ice cream.", [live(cone_name)]));
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/icecream/proc/add_ice_cream  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:200)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/icecream/proc/add_ice_cream", function* add_ice_cream(f: Frame, flavour_name: Value) {
	let $0: any;
	f.vars = () => [flavour_name, $0];
	rt.setSv(f, "name", fmt("＀ icecream", [live(flavour_name)]));
	yield* g.callName(f, live(f.src), "add_overlay", [fmt("icecream_＀", [live(flavour_name)])]);
	$0 = live(flavour_name);
	if ($0 === "vanilla") {
		rt.setSv(f, "desc", fmt("A delicious ＀ cone filled with vanilla ice cream. All the other ice creams take content from it.", [rt.sv(f, "cone_type")]));
	} else if ($0 === "chocolate") {
		rt.setSv(f, "desc", fmt("A delicious ＀ cone filled with chocolate ice cream. Surprisingly, made with real cocoa.", [rt.sv(f, "cone_type")]));
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["cocoa", 2]);
	} else if ($0 === "strawberry") {
		rt.setSv(f, "desc", fmt("A delicious ＀ cone filled with strawberry ice cream. Definitely not made with real strawberries.", [rt.sv(f, "cone_type")]));
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["berryjuice", 2]);
	} else if ($0 === "blue") {
		rt.setSv(f, "desc", fmt("A delicious ＀ cone filled with blue ice cream. Made with real... blue?", [rt.sv(f, "cone_type")]));
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["singulo", 2]);
	} else if ($0 === "mob") {
		rt.setSv(f, "desc", fmt("A suspicious ＀ cone filled with bright red ice cream. That's probably not strawberry...", [rt.sv(f, "cone_type")]));
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["liquidgibs", 2]);
	}
	rt.setSv(f, "ice_creamed", 1);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/icecream/proc/add_mob_flavor  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:220)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/icecream/proc/add_mob_flavor", function* add_mob_flavor(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.srcCall(f, "add_ice_cream", "mob");
	rt.setSv(f, "name", fmt("＀ icecream", [rt.fv(f, "name", live(M))]));
	return f.dot;
}, true);

// /obj/machinery/icecream_vat/proc/deconstruct  (code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm:224)  may sleep
rt.def("/obj/machinery/icecream_vat/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
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
