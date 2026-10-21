// From code/modules/reagents/chemistry/machinery/chem_dispenser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10679, "/obj/machinery/chem_dispenser", "/obj/machinery", {
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell/high"),
	cell: null,
	powerefficiency: 0.01,
	amount: 30,
	recharged: 0,
	recharge_delay: 5,
	beaker_overlay: null,
	beaker: null,
	dispensable_reagents: null,
	emagged_reagents: null,
	anchored: 1,
	name: "chem dispenser",
	desc: "Creates and dispenses chemicals.",
	density: 1,
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "dispenser",
	use_power: 1,
	idle_power_usage: 40,
	interact_offline: 1,
	resistance_flags: 34,
});

// /obj/machinery/chem_dispenser/proc/Initialize  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:57)  may sleep
rt.def("/obj/machinery/chem_dispenser/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "cell", (yield* g.new_(f, rt.sv(f, "cell_type"), [])));
	yield* g.srcCall(f, "recharge");
	rt.setSv(f, "dispensable_reagents", (yield* g.call(f, P("/proc/sortList"), null, [rt.sv(f, "dispensable_reagents")])));
	return f.dot;
}, true);

// /obj/machinery/chem_dispenser/proc/process  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:64)  may sleep
rt.def("/obj/machinery/chem_dispenser/proc/process", function* process(f: Frame) {
	if (rt.lt(rt.sv(f, "recharged"), 0)) {
		yield* g.srcCall(f, "recharge");
		rt.setSv(f, "recharged", rt.sv(f, "recharge_delay"));
	} else {
		(rt.modSrcVar(f, "recharged", 1, subtract));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/chem_dispenser/proc/recharge  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:71)  may sleep
rt.def("/obj/machinery/chem_dispenser/proc/recharge", function* recharge(f: Frame) {
	let usedpower: Value = null;
	f.vars = () => [usedpower];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy((usedpower = (yield* g.callName(f, rt.sv(f, "cell"), "give", [divide(1, rt.sv(f, "powerefficiency"))]))))) return f.dot;
	yield* g.srcCall(f, "use_power", 2500);
	return f.dot;
}, true);

// /obj/machinery/chem_dispenser/proc/emag_act  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:78)
rt.def("/obj/machinery/chem_dispenser/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ has no functional safeties to emag.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You short out ％！'s safeties.</span>", [live(f.src)])]);
	(rt.modSrcVar(f, "dispensable_reagents", rt.sv(f, "emagged_reagents"), rt.bitOr));
	rt.setSv(f, "emagged", 1);
	return f.dot;
});

// /obj/machinery/chem_dispenser/proc/ex_act  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:85)
rt.def("/obj/machinery/chem_dispenser/proc/ex_act", function ex_act(f: Frame) {
	if (!rt.lt(live(f.args[0]), 3)) return f.dot;
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["severity", "target"], waitfor: false });

// /obj/machinery/chem_dispenser/proc/contents_explosion  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:89)
rt.def("/obj/machinery/chem_dispenser/proc/contents_explosion", function contents_explosion(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	rt.callName(f, rt.sv(f, "beaker"), "ex_act", [live(f.args[0]), live(f.args[1])]);
	return f.dot;
}, false, { args: ["severity", "target"] });

// /obj/machinery/chem_dispenser/proc/handle_atom_del  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:94)  may sleep
rt.def("/obj/machinery/chem_dispenser/proc/handle_atom_del", function* handle_atom_del(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(live(f.args[0]), rt.sv(f, "beaker"))) return f.dot;
	rt.setSv(f, "beaker", null);
	yield* g.srcCall(f, "cut_overlays");
	return f.dot;
}, true, { args: ["A"] });

// /obj/machinery/chem_dispenser/proc/ui_interact  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:101)  may sleep
rt.def("/obj/machinery/chem_dispenser/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "chem_dispenser", rt.sv(f, "name"), 550, 550, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/chem_dispenser/proc/ui_data  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:107)
rt.def("/obj/machinery/chem_dispenser/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, beakerContents: Value = null, beakerCurrentVolume: Value = null, R: Value = null, chemicals: Value = null, re: Value = null, temp: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [data, beakerContents, beakerCurrentVolume, R, chemicals, re, temp, $0, $1, $2, $e];
	rt.setAt((data = rt.list()), "amount", rt.sv(f, "amount"));
	$0 = live(data);
	$1 = "energy";
	if (truthy(rt.fv(f, "charge", rt.sv(f, "cell")))) {
		$2 = multiply(rt.fv(f, "charge", rt.sv(f, "cell")), rt.sv(f, "powerefficiency"));
	} else {
		$2 = "0";
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "maxEnergy", multiply(rt.fv(f, "maxcharge", rt.sv(f, "cell")), rt.sv(f, "powerefficiency")));
	$0 = live(data);
	$1 = "isBeakerLoaded";
	if (truthy(rt.sv(f, "beaker"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	beakerContents = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	beakerCurrentVolume = 0;
	if (((truthy(rt.sv(f, "beaker")) && truthy(rt.fv(f, "reagents", rt.sv(f, "beaker")))) && truthy(rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker"))))))) {
		R = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker"))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			rt.callName(f, live(beakerContents), "Add", [rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(R)), "volume", rt.fv(f, "volume", live(R))]))]);
			beakerCurrentVolume = rt.modify(live(beakerCurrentVolume), rt.fv(f, "volume", live(R)), add);
		}
		rt.endFor(f, 0);
	}
	rt.setAt(live(data), "beakerContents", live(beakerContents));
	if (truthy(rt.sv(f, "beaker"))) {
		rt.setAt(live(data), "beakerCurrentVolume", live(beakerCurrentVolume));
		rt.setAt(live(data), "beakerMaxVolume", rt.fv(f, "volume", rt.sv(f, "beaker")));
		rt.setAt(live(data), "beakerTransferAmounts", rt.fv(f, "possible_transfer_amounts", rt.sv(f, "beaker")));
	} else {
		rt.setAt(live(data), "beakerCurrentVolume", null);
		rt.setAt(live(data), "beakerMaxVolume", null);
		rt.setAt(live(data), "beakerTransferAmounts", null);
	}
	chemicals = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	re = null;
	rt.forList(f, 0, rt.sv(f, "dispensable_reagents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		re = $e;
		if (truthy((temp = rt.index(rt.gl("chemical_reagents_list"), live(re))))) {
			rt.callName(f, live(chemicals), "Add", [rt.list(rt.alist(f, ["title", rt.fv(f, "name", live(temp)), "id", rt.fv(f, "id", live(temp))]))]);
		}
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "chemicals", live(chemicals));
	return live(data);
});

// /obj/machinery/chem_dispenser/proc/ui_act  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:139)  may sleep
rt.def("/obj/machinery/chem_dispenser/proc/ui_act", function* ui_act(f: Frame) {
	let target: Value = null, reagent: Value = null, R: Value = null, free: Value = null, actual: Value = null, amount: Value = null;
	let $0: any;
	f.vars = () => [target, reagent, R, free, actual, amount, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "amount") {
		if (truthy((rt.isIn(f, (target = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "target")]))), rt.fv(f, "possible_transfer_amounts", rt.sv(f, "beaker"))) ? 1 : 0))) {
			rt.setSv(f, "amount", live(target));
			f.dot = 1;
		}
	} else if ($0 === "dispense") {
		reagent = rt.at(live(f.args[1]), "reagent");
		if ((truthy(rt.sv(f, "beaker")) && truthy((yield* g.callName(f, rt.sv(f, "dispensable_reagents"), "Find", [live(reagent)]))))) {
			R = rt.fv(f, "reagents", rt.sv(f, "beaker"));
			free = subtract(rt.fv(f, "maximum_volume", live(R)), rt.fv(f, "total_volume", live(R)));
			actual = (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "amount"), multiply(multiply(rt.fv(f, "charge", rt.sv(f, "cell")), rt.sv(f, "powerefficiency")), 10), live(free)]));
			yield* g.callName(f, live(R), "add_reagent", [live(reagent), live(actual)]);
			yield* g.callName(f, rt.sv(f, "cell"), "use", [divide(divide(live(actual), 10), rt.sv(f, "powerefficiency"))]);
			f.dot = 1;
		}
	} else if ($0 === "remove") {
		amount = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "amount")]));
		if (truthy((rt.isIn(f, (rt.sv(f, "beaker") && live(amount)), rt.fv(f, "possible_transfer_amounts", rt.sv(f, "beaker"))) ? 1 : 0))) {
			yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "remove_all", [live(amount)]);
			f.dot = 1;
		}
	} else if ($0 === "eject") {
		if (!truthy(rt.sv(f, "beaker"))) return f.dot;
		yield* g.callName(f, rt.sv(f, "beaker"), "forceMove", [rt.sv(f, "loc")]);
		rt.setSv(f, "beaker", null);
		yield* g.srcCall(f, "cut_overlays");
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/chem_dispenser/proc/attackby  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:170)  may sleep
rt.def("/obj/machinery/chem_dispenser/proc/attackby", function* attackby(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers")) ? 1 : 0)) && truthy(rt.bitAnd(rt.fv(f, "container_type", live(f.args[0])), 4096)))) {
		B = live(f.args[0]);
		f.dot = 1;
		if (truthy(rt.sv(f, "beaker"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>A container is already loaded into the machine!</span>"]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setSv(f, "beaker", live(B));
		rt.setFv(f, "loc", rt.sv(f, "beaker"), live(f.src));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ％！ to the machine.</span>", [live(B)])]);
		rt.setSv(f, "beaker_overlay", (rt.sv(f, "beaker_overlay") || (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "disp_beaker"]))));
		rt.setFv(f, "pixel_x", rt.sv(f, "beaker_overlay"), (yield* g.call(f, P("/proc/rand"), null, [-10, 5])));
		yield* g.srcCall(f, "add_overlay", rt.sv(f, "beaker_overlay"));
	} else {
		if ((!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm") && !truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/emag")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't load ％！ into the machine!</span>", [live(f.args[0])])]);
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/chem_dispenser/proc/emp_act  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:200)  may sleep
rt.def("/obj/machinery/chem_dispenser/proc/emp_act", function* emp_act(f: Frame) {
	let R: Value = null, total: Value = null, Q: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [R, total, Q, i, $e];
	R = rt.list();
	total = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/rand"), null, [7, 15])), (yield* g.call(f, P("/proc/Floor"), null, [multiply(rt.fv(f, "charge", rt.sv(f, "cell")), rt.sv(f, "powerefficiency"))]))]));
	Q = (yield* g.new_(f, T("/datum/reagents"), [multiply(live(total), 10)]));
	if ((truthy(rt.sv(f, "beaker")) && truthy(rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
		R = rt.modify(live(R), rt.fv(f, "reagents", rt.sv(f, "beaker")), add);
	}
	i = null;
	rt.forRange(f, 0, 1, live(total), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.callName(f, live(Q), "add_reagent", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "dispensable_reagents")]), 10]);
	}
	rt.endFor(f, 0);
	R = rt.modify(live(R), live(Q), add);
	yield* g.call(f, P("/proc/chem_splash"), null, [rt.getStep(f, live(f.src), 0), 3, live(R)]);
	if ((truthy(rt.sv(f, "beaker")) && truthy(rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
		yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "remove_all", []);
	}
	yield* g.callName(f, rt.sv(f, "cell"), "use", [divide(live(total), rt.sv(f, "powerefficiency"))]);
	yield* g.callName(f, rt.sv(f, "cell"), "emp_act", []);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'> The ＀ malfunctions, spraying chemicals everywhere!</span>", [live(f.src)]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

rt.type(10680, "/obj/machinery/chem_dispenser/constructable", "/obj/machinery/chem_dispenser", {
	dispensable_reagent_tiers: null,
	powerefficiency: 0.001,
	amount: 5,
	recharge_delay: 30,
	dispensable_reagents: null,
	name: "portable chem dispenser",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "minidispenser",
});

// /obj/machinery/chem_dispenser/constructable/proc/<init>  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:223)
rt.def("/obj/machinery/chem_dispenser/constructable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "dispensable_reagents", rt.list());
	rt.setSv(f, "dispensable_reagent_tiers", rt.list(rt.list("hydrogen", "oxygen", "silicon", "phosphorus", "sulfur", "carbon", "nitrogen", "water"), rt.list("lithium", "sugar", "sacid", "copper", "mercury", "sodium", "iodine", "bromine"), rt.list("ethanol", "chlorine", "potassium", "aluminium", "radium", "fluorine", "iron", "welding_fuel", "silver", "stable_plasma"), rt.list("oil", "ash", "acetone", "saltpetre", "ammonia", "diethylamine")));
	return f.dot;
});

// /obj/machinery/chem_dispenser/constructable/proc/Initialize  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:268)  may sleep
rt.def("/obj/machinery/chem_dispenser/constructable/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/chem_dispenser"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6775, "/obj/item/weapon/circuitboard/machine/chem_dispenser", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	def_components: null,
	name: "Portable Chem Dispenser (Machine Board)",
	build_path: rt.typePath("/obj/machinery/chem_dispenser/constructable"),
	origin_tech: "materials=4;programming=4;plasmatech=4;biotech=3",
});

// /obj/item/weapon/circuitboard/machine/chem_dispenser/proc/<init>  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:276)
rt.def("/obj/item/weapon/circuitboard/machine/chem_dispenser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 2, T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/weapon/stock_parts/cell"), 1]));
	$0 = $0;
	rt.setSv(f, "def_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/cell"), T("/obj/item/weapon/stock_parts/cell/high")]));
	return f.dot;
});

// /obj/machinery/chem_dispenser/constructable/proc/RefreshParts  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:287)  may sleep
rt.def("/obj/machinery/chem_dispenser/constructable/proc/RefreshParts", function* RefreshParts(f: Frame) {
	let time: Value = null, i: Value = null, _P: Value = null, M: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [time, i, _P, M, C, $e];
	time = 0;
	i = null;
	_P = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/cell"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		rt.setSv(f, "cell", live(_P));
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		time = rt.modify(live(time), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	C = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/capacitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		time = rt.modify(live(time), rt.fv(f, "rating", live(C)), add);
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "recharge_delay", divide(live(time), 2), divide));
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		i = 1;
		while (rt.le(live(i), rt.fv(f, "rating", live(M)))) {
			(rt.modSrcVar(f, "dispensable_reagents", rt.index(rt.sv(f, "dispensable_reagent_tiers"), live(i)), rt.bitOr));
			i = rt.inc(live(i), 1);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "dispensable_reagents", (yield* g.call(f, P("/proc/sortList"), null, [rt.sv(f, "dispensable_reagents")])));
	return f.dot;
}, true);

// /obj/machinery/chem_dispenser/constructable/proc/attackby  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:300)  may sleep
rt.def("/obj/machinery/chem_dispenser/constructable/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "minidispenser-o", "minidispenser", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

rt.type(10683, "/obj/machinery/chem_dispenser/mutagen", "/obj/machinery/chem_dispenser", {
	dispensable_reagents: null,
	emagged_reagents: null,
	name: "mutagen dispenser",
	desc: "Creates and dispenses mutagen.",
});

// /obj/machinery/chem_dispenser/mutagen/proc/<init>  (code/modules/reagents/chemistry/machinery/chem_dispenser.dm:385)
rt.def("/obj/machinery/chem_dispenser/mutagen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "dispensable_reagents", rt.list("mutagen"));
	$0 = $0;
	rt.setSv(f, "emagged_reagents", rt.list("plasma"));
	return f.dot;
});
