// From code/modules/hydroponics/biogenerator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10920, "/obj/machinery/biogenerator", "/obj/machinery", {
	processing: 0,
	beaker: null,
	points: 0,
	menustat: "menu",
	efficiency: 0,
	productivity: 0,
	max_items: 40,
	files: null,
	show_categories: null,
	timesFiveCategories: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 40,
	name: "biogenerator",
	desc: "Converts plants into biomass, which can be used to construct useful items.",
	icon: rt.rsc("icons/obj/biogenerator.dmi"),
	icon_state: "biogen-empty",
	density: 1,
});

// /obj/machinery/biogenerator/proc/New  (code/modules/hydroponics/biogenerator.dm:22)  may sleep
rt.def("/obj/machinery/biogenerator/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "files", (yield* g.new_(f, T("/datum/research/biogenerator"), [live(f.src)])));
	yield* g.srcCall(f, "create_reagents", 1000);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/biogenerator"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/biogenerator/proc/Destroy  (code/modules/hydroponics/biogenerator.dm:30)  may sleep
rt.def("/obj/machinery/biogenerator/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "beaker"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "beaker")]);
		rt.setSv(f, "beaker", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/biogenerator/proc/contents_explosion  (code/modules/hydroponics/biogenerator.dm:35)
rt.def("/obj/machinery/biogenerator/proc/contents_explosion", function contents_explosion(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	rt.callName(f, rt.sv(f, "beaker"), "ex_act", [live(f.args[0]), live(f.args[1])]);
	return f.dot;
}, false, { args: ["severity", "target"] });

// /obj/machinery/biogenerator/proc/handle_atom_del  (code/modules/hydroponics/biogenerator.dm:40)  may sleep
rt.def("/obj/machinery/biogenerator/proc/handle_atom_del", function* handle_atom_del(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(live(f.args[0]), rt.sv(f, "beaker"))) return f.dot;
	rt.setSv(f, "beaker", null);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["A"] });

rt.type(6755, "/obj/item/weapon/circuitboard/machine/biogenerator", "/obj/item/weapon/circuitboard/machine", {
	name: "Biogenerator (Machine Board)",
	build_path: rt.typePath("/obj/machinery/biogenerator"),
	origin_tech: "programming=2;biotech=3;materials=3",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/biogenerator/proc/<init>  (code/modules/hydroponics/biogenerator.dm:50)
rt.def("/obj/item/weapon/circuitboard/machine/biogenerator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]));
	return f.dot;
});

// /obj/machinery/biogenerator/proc/RefreshParts  (code/modules/hydroponics/biogenerator.dm:60)
rt.def("/obj/machinery/biogenerator/proc/RefreshParts", function RefreshParts(f: Frame) {
	let E: Value = null, _P: Value = null, max_storage: Value = null, B: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [E, _P, max_storage, B, M, $e];
	E = 0;
	_P = 0;
	max_storage = 40;
	B = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		_P = rt.modify(live(_P), rt.fv(f, "rating", live(B)), add);
		max_storage = multiply(40, rt.fv(f, "rating", live(B)));
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		E = rt.modify(live(E), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "efficiency", live(E));
	rt.setSv(f, "productivity", live(_P));
	rt.setSv(f, "max_items", live(max_storage));
	return f.dot;
});

// /obj/machinery/biogenerator/proc/on_reagent_change  (code/modules/hydroponics/biogenerator.dm:70)
rt.def("/obj/machinery/biogenerator/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/biogenerator/proc/update_icon  (code/modules/hydroponics/biogenerator.dm:74)
rt.def("/obj/machinery/biogenerator/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "panel_open"))) {
		rt.setSv(f, "icon_state", "biogen-empty-o");
	} else {
		if (!truthy(rt.fv(f, "beaker", live(f.src)))) {
			rt.setSv(f, "icon_state", "biogen-empty");
		} else {
			if (!truthy(rt.fv(f, "processing", live(f.src)))) {
				rt.setSv(f, "icon_state", "biogen-stand");
			} else {
				rt.setSv(f, "icon_state", "biogen-work");
			}
		}
	}
	return live(f.dot);
});

// /obj/machinery/biogenerator/proc/attackby  (code/modules/hydroponics/biogenerator.dm:84)  may sleep
rt.def("/obj/machinery/biogenerator/proc/attackby", function* attackby(f: Frame) {
	let B: Value = null, PB: Value = null, i: Value = null, G: Value = null, i_0: Value = null, G_1: Value = null, D: Value = null, B_1: Value = null;
	let $e: any;
	f.vars = () => [B, PB, i, G, i_0, G_1, D, B_1, $e];
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.sv(f, "processing"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The biogenerator is currently processing.</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "biogen-empty-o", "biogen-empty", live(f.args[0]))))) {
		if (truthy(rt.sv(f, "beaker"))) {
			rt.setFv(f, "loc", (B = rt.sv(f, "beaker")), rt.sv(f, "loc"));
			rt.setSv(f, "beaker", null);
		}
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0))) {
		f.dot = 1;
		if (!truthy(rt.sv(f, "panel_open"))) {
			if (truthy(rt.sv(f, "beaker"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>A container is already loaded into the machine.</span>"]);
			} else {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.setFv(f, "loc", live(f.args[0]), live(f.src));
				rt.setSv(f, "beaker", live(f.args[0]));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the container to the machine.</span>"]);
				yield* g.srcCall(f, "update_icon");
				yield* g.srcCall(f, "updateUsrDialog");
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Close the maintenance panel first.</span>"]);
		}
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/plants")) ? 1 : 0))) {
			PB = live(f.args[0]);
			i = 0;
			G = null;
			rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/reagent_containers/food/snacks/grown"));
			while (($e = rt.next(f, 0)) !== undefined) {
				G = $e;
				i = rt.inc(live(i), 1);
			}
			rt.endFor(f, 0);
			if (rt.ge(live(i), rt.sv(f, "max_items"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The biogenerator is already full! Activate it.</span>"]);
			} else {
				G = null;
				rt.forList(f, 0, rt.fv(f, "contents", live(PB)), T("/obj/item/weapon/reagent_containers/food/snacks/grown"));
				while (($e = rt.next(f, 0)) !== undefined) {
					G = $e;
					if (rt.ge(live(i), rt.sv(f, "max_items"))) {
						break;
					}
					yield* g.callName(f, live(PB), "remove_from_storage", [live(G), live(f.src)]);
					i = rt.inc(live(i), 1);
				}
				rt.endFor(f, 0);
				if (rt.lt(live(i), rt.sv(f, "max_items"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='info'>You empty the plant bag into the biogenerator.</span>"]);
				} else {
					if (isEqual(rt.getLen(f, rt.fv(f, "contents", live(PB))), 0)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='info'>You empty the plant bag into the biogenerator, filling it to its capacity.</span>"]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='info'>You fill the biogenerator to its capacity.</span>"]);
					}
				}
			}
			return 1;
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/grown")) ? 1 : 0))) {
				i_0 = 0;
				G_1 = null;
				rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/reagent_containers/food/snacks/grown"));
				while (($e = rt.next(f, 0)) !== undefined) {
					G_1 = $e;
					i_0 = rt.inc(live(i_0), 1);
				}
				rt.endFor(f, 0);
				if (rt.ge(live(i_0), rt.sv(f, "max_items"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The biogenerator is full! Activate it.</span>"]);
				} else {
					if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='info'>You put ＀ in ＀</span>", [rt.fv(f, "name", live(f.args[0])), rt.fv(f, "name", live(f.src))])]);
					}
				}
				return 1;
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/disk/design_disk")) ? 1 : 0))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ begins to load ％！ in ％！...", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("You begin to load a design from ％！...", [live(f.args[0])]), "You hear the chatter of a floppy drive."]);
					rt.setSv(f, "processing", 1);
					D = live(f.args[0]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 10, "target", live(f.src)], rt.Args.Named)))) {
						B_1 = null;
						rt.forList(f, 0, rt.fv(f, "blueprints", live(D)));
						while (($e = rt.next(f, 0)) !== undefined) {
							B_1 = $e;
							if (truthy(live(B_1))) {
								yield* g.callName(f, rt.sv(f, "files"), "AddDesign2Known", [live(B_1)]);
							}
						}
						rt.endFor(f, 0);
					}
					rt.setSv(f, "processing", 0);
					return 1;
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You cannot put this in ＀!</span>", [rt.fv(f, "name", live(f.src))])]);
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/biogenerator/proc/interact  (code/modules/hydroponics/biogenerator.dm:169)  may sleep
rt.def("/obj/machinery/biogenerator/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, categories: Value = null, V: Value = null, D: Value = null, C: Value = null, cat: Value = null, V_3: Value = null, D_4: Value = null, popup: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, dat, categories, V, D, C, cat, V_3, D_4, popup, $0, $e];
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) || truthy(rt.sv(f, "panel_open")))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = null;
	if (truthy(rt.sv(f, "processing"))) {
		dat = rt.modify(live(dat), "<div class='statusDisplay'>Biogenerator is processing! Please wait...</div><BR>", add);
	} else {
		$0 = rt.sv(f, "menustat");
		if ($0 === "nopoints") {
			dat = rt.modify(live(dat), "<div class='statusDisplay'>You do not have enough biomass to create products.<BR>Please, put growns into reactor and activate it.</div>", add);
			rt.setSv(f, "menustat", "menu");
		} else if ($0 === "complete") {
			dat = rt.modify(live(dat), "<div class='statusDisplay'>Operation complete.</div>", add);
			rt.setSv(f, "menustat", "menu");
		} else if ($0 === "void") {
			dat = rt.modify(live(dat), "<div class='statusDisplay'>Error: No growns inside.<BR>Please, put growns into reactor.</div>", add);
			rt.setSv(f, "menustat", "menu");
		} else if ($0 === "nobeakerspace") {
			dat = rt.modify(live(dat), "<div class='statusDisplay'>Not enough space left in container. Unable to create product.</div>", add);
			rt.setSv(f, "menustat", "menu");
		}
		if (truthy(rt.sv(f, "beaker"))) {
			categories = (yield* g.callName(f, rt.sv(f, "show_categories"), "Copy", []));
			V = null;
			rt.forList(f, 0, live(categories));
			while (($e = rt.next(f, 0)) !== undefined) {
				V = $e;
				rt.setAt(live(categories), live(V), rt.list());
			}
			rt.endFor(f, 0);
			V = null;
			rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
			while (($e = rt.next(f, 0)) !== undefined) {
				V = $e;
				D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(V));
				C = null;
				rt.forList(f, 1, live(categories));
				while (($e = rt.next(f, 1)) !== undefined) {
					C = $e;
					if (truthy((rt.isIn(f, live(C), rt.fv(f, "category", live(D))) ? 1 : 0))) {
						rt.modAt(live(categories), live(C), live(D), add);
					}
				}
				rt.endFor(f, 1);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), fmt("<div class='statusDisplay'>Biomass: ＀ units.</div><BR>", [rt.sv(f, "points")]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;activate=1'>Activate</A><A href='?src=＃;detach=1'>Detach Container</A>", [live(f.src), live(f.src)]), add);
			cat = null;
			rt.forList(f, 0, live(categories));
			while (($e = rt.next(f, 0)) !== undefined) {
				cat = $e;
				dat = rt.modify(live(dat), fmt("<h3>＀:</h3>", [live(cat)]), add);
				dat = rt.modify(live(dat), "<div class='statusDisplay'>", add);
				V_3 = null;
				rt.forList(f, 1, rt.index(live(categories), live(cat)));
				while (($e = rt.next(f, 1)) !== undefined) {
					V_3 = $e;
					dat = rt.modify(live(dat), fmt("＀: <A href='?src=＃;create=＃;amount=1'>Make</A>", [rt.gv(f, "name", (D_4 = live(V_3))), live(f.src), live(D_4)]), add);
					if (truthy((rt.isIn(f, live(cat), rt.sv(f, "timesFiveCategories")) ? 1 : 0))) {
						dat = rt.modify(live(dat), fmt("<A href='?src=＃;create=＃;amount=5'>x5</A>", [live(f.src), live(D_4)]), add);
					}
					if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.fv(f, "build_path", live(D_4)), T("/obj/item/stack")])))) {
						dat = rt.modify(live(dat), fmt("<A href='?src=＃;create=＃;amount=10'>x10</A>", [live(f.src), live(D_4)]), add);
					}
					dat = rt.modify(live(dat), fmt("(＀)<br>", [divide(rt.index(rt.fv(f, "materials", live(D_4)), "$biomass"), rt.sv(f, "efficiency"))]), add);
				}
				rt.endFor(f, 1);
				dat = rt.modify(live(dat), "</div>", add);
			}
			rt.endFor(f, 0);
		} else {
			dat = rt.modify(live(dat), "<div class='statusDisplay'>No container inside, please insert container.</div>", add);
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "biogen", rt.sv(f, "name"), 350, 520]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/biogenerator/proc/attack_hand  (code/modules/hydroponics/biogenerator.dm:222)  may sleep
rt.def("/obj/machinery/biogenerator/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/biogenerator/proc/activate  (code/modules/hydroponics/biogenerator.dm:225)  may sleep
rt.def("/obj/machinery/biogenerator/proc/activate", function* activate(f: Frame) {
	let S: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [S, I, $e];
	if (!isEqual(rt.fv(f, "stat", live(f.usr)), 0)) {
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "stat", live(f.src)), 0)) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "processing"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>The biogenerator is in the process of working.</span>"]);
		return live(f.dot);
	}
	S = 0;
	I = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/reagent_containers/food/snacks/grown"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		S = rt.modify(live(S), 5, add);
		if (rt.lt((yield* g.callName(f, rt.fv(f, "reagents", live(I)), "get_reagent_amount", ["nutriment"])), 0.10000000149011612)) {
			rt.modSrcVar(f, "points", multiply(1, rt.sv(f, "productivity")), add);
		} else {
			rt.modSrcVar(f, "points", multiply(multiply((yield* g.callName(f, rt.fv(f, "reagents", live(I)), "get_reagent_amount", ["nutriment"])), 10), rt.sv(f, "productivity")), add);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	rt.endFor(f, 0);
	if (truthy(live(S))) {
		rt.setSv(f, "processing", 1);
		yield* g.srcCall(f, "update_icon");
		yield* g.srcCall(f, "updateUsrDialog");
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/blender.ogg"), 50, 1]);
		yield* g.srcCall(f, "use_power", multiply(live(S), 30));
		yield* g.call(f, P("/proc/sleep"), null, [add(live(S), divide(15, rt.sv(f, "productivity")))]);
		rt.setSv(f, "processing", 0);
		yield* g.srcCall(f, "update_icon");
	} else {
		rt.setSv(f, "menustat", "void");
	}
	return live(f.dot);
}, true);

// /obj/machinery/biogenerator/proc/check_cost  (code/modules/hydroponics/biogenerator.dm:253)  may sleep
rt.def("/obj/machinery/biogenerator/proc/check_cost", function* check_cost(f: Frame, materials: Value, multiplier: Value, remove_points: Value) {
	f.vars = () => [materials, multiplier, remove_points];
	if (live(multiplier) === null) {
		multiplier = 1;
	}
	if (live(remove_points) === null) {
		remove_points = 1;
	}
	if ((!isEqual(rt.len(f, live(materials)), 1) || !isEqual(rt.index(live(materials), 1), "$biomass"))) {
		return 0;
	}
	if (rt.gt(divide(multiply(rt.at(live(materials), "$biomass"), live(multiplier)), rt.sv(f, "efficiency")), rt.sv(f, "points"))) {
		rt.setSv(f, "menustat", "nopoints");
		return 0;
	} else {
		if (truthy(live(remove_points))) {
			(rt.modSrcVar(f, "points", divide(multiply(rt.at(live(materials), "$biomass"), live(multiplier)), rt.sv(f, "efficiency")), subtract));
		}
		yield* g.srcCall(f, "update_icon");
		yield* g.srcCall(f, "updateUsrDialog");
		return 1;
	}
	return f.dot;
}, true);

// /obj/machinery/biogenerator/proc/check_container_volume  (code/modules/hydroponics/biogenerator.dm:267)
rt.def("/obj/machinery/biogenerator/proc/check_container_volume", function check_container_volume(f: Frame, reagents: Value, multiplier: Value) {
	let sum_reagents: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [multiplier, sum_reagents, R, $e];
	if (live(multiplier) === null) {
		multiplier = 1;
	}
	sum_reagents = 0;
	R = null;
	rt.forList(f, 0, live(reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		sum_reagents = rt.modify(live(sum_reagents), rt.index(live(reagents), live(R)), add);
	}
	rt.endFor(f, 0);
	(sum_reagents = rt.modify(live(sum_reagents), live(multiplier), multiply));
	if (rt.gt(add(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), live(sum_reagents)), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
		rt.setSv(f, "menustat", "nobeakerspace");
		return 0;
	}
	return 1;
});

// /obj/machinery/biogenerator/proc/create_product  (code/modules/hydroponics/biogenerator.dm:278)  may sleep
rt.def("/obj/machinery/biogenerator/proc/create_product", function* create_product(f: Frame, D: Value, amount: Value) {
	let product: Value = null, R: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [D, amount, product, R, i, $e];
	if ((!truthy(rt.sv(f, "beaker")) || !truthy(rt.sv(f, "loc")))) {
		return 0;
	}
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.fv(f, "build_path", live(D)), T("/obj/item/stack")])))) {
		if (!truthy((yield* g.srcCall(f, "check_container_volume", rt.fv(f, "make_reagents", live(D)), live(amount))))) {
			return 0;
		}
		if (!truthy((yield* g.srcCall(f, "check_cost", rt.fv(f, "materials", live(D)), live(amount))))) {
			return 0;
		}
		rt.setFv(f, "amount", (product = (yield* g.new_(f, rt.fv(f, "build_path", live(D)), [rt.sv(f, "loc")]))), live(amount));
		R = null;
		rt.forList(f, 0, rt.fv(f, "make_reagents", live(D)));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", [live(R), multiply(rt.index(rt.fv(f, "make_reagents", live(D)), live(R)), live(amount))]);
		}
		rt.endFor(f, 0);
	} else {
		i = live(amount);
		while (rt.gt(live(i), 0)) {
			if (!truthy((yield* g.srcCall(f, "check_container_volume", rt.fv(f, "make_reagents", live(D)))))) {
				return live(f.dot);
			}
			if (!truthy((yield* g.srcCall(f, "check_cost", rt.fv(f, "materials", live(D)))))) {
				return live(f.dot);
			}
			if (truthy(rt.fv(f, "build_path", live(D)))) {
				yield* g.new_(f, rt.fv(f, "build_path", live(D)), [rt.sv(f, "loc")]);
			}
			R = null;
			rt.forList(f, 0, rt.fv(f, "make_reagents", live(D)));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", [live(R), rt.index(rt.fv(f, "make_reagents", live(D)), live(R))]);
			}
			rt.endFor(f, 0);
			f.dot = 1;
			i = rt.inc(live(i), -1);
		}
	}
	rt.setSv(f, "menustat", "complete");
	yield* g.srcCall(f, "update_icon");
	return live(f.dot);
}, true);

// /obj/machinery/biogenerator/proc/detach  (code/modules/hydroponics/biogenerator.dm:311)
rt.def("/obj/machinery/biogenerator/proc/detach", function detach(f: Frame) {
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	rt.setFv(f, "loc", rt.sv(f, "beaker"), rt.fv(f, "loc", live(f.src)));
	rt.setSv(f, "beaker", null);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/biogenerator/proc/Topic  (code/modules/hydroponics/biogenerator.dm:316)  may sleep
rt.def("/obj/machinery/biogenerator/proc/Topic", function* Topic(f: Frame) {
	let amount: Value = null, D: Value = null;
	f.vars = () => [amount, D];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || truthy(rt.sv(f, "panel_open")))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "activate"))) {
		yield* g.srcCall(f, "activate");
		yield* g.srcCall(f, "updateUsrDialog");
	} else {
		if (truthy(rt.at(live(f.args[1]), "detach"))) {
			yield* g.srcCall(f, "detach");
			yield* g.srcCall(f, "updateUsrDialog");
		} else {
			if (truthy(rt.at(live(f.args[1]), "create"))) {
				amount = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "amount")]));
				yield* g.srcCall(f, "create_product", (D = rt.locateIn(f, rt.at(live(f.args[1]), "create"), rt.world())), live(amount));
				yield* g.srcCall(f, "updateUsrDialog");
			} else {
				if (!truthy(rt.at(live(f.args[1]), "menu"))) return f.dot;
				rt.setSv(f, "menustat", "menu");
				yield* g.srcCall(f, "updateUsrDialog");
			}
		}
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });
