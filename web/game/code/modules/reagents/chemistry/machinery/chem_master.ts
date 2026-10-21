// From code/modules/reagents/chemistry/machinery/chem_master.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10979, "/obj/machinery/chem_master", "/obj/machinery", {
	beaker: null,
	bottle: null,
	mode: 1,
	condi: 0,
	screen: "home",
	analyzeVars: null,
	useramount: 30,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 20,
	name: "ChemMaster 3000",
	desc: "Used to seperate chemicals and distribute them in a variety of forms.",
	density: 1,
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "mixer0",
	resistance_flags: 34,
	layer: 2.9,
});

// /obj/machinery/chem_master/proc/<init>  (code/modules/reagents/chemistry/machinery/chem_master.dm:16)
rt.def("/obj/machinery/chem_master/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "analyzeVars", rt.op(f, "CreateMultidimensionalList", [1], [0]));
	return f.dot;
});

// /obj/machinery/chem_master/proc/Initialize  (code/modules/reagents/chemistry/machinery/chem_master.dm:21)  may sleep
rt.def("/obj/machinery/chem_master/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.srcCall(f, "create_reagents", 100);
	yield* g.srcCall(f, "add_overlay", "waitlight");
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/chem_master"), [null]))), "apply_default_parts", [live(f.src)]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(6777, "/obj/item/weapon/circuitboard/machine/chem_master", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "ChemMaster 3000 (Machine Board)",
	build_path: rt.typePath("/obj/machinery/chem_master"),
	origin_tech: "materials=3;programming=2;biotech=3",
});

// /obj/item/weapon/circuitboard/machine/chem_master/proc/<init>  (code/modules/reagents/chemistry/machinery/chem_master.dm:31)
rt.def("/obj/item/weapon/circuitboard/machine/chem_master/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/beaker"), 2, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]));
	return f.dot;
});

// /obj/item/weapon/circuitboard/machine/chem_master/proc/attackby  (code/modules/reagents/chemistry/machinery/chem_master.dm:37)  may sleep
rt.def("/obj/item/weapon/circuitboard/machine/chem_master/proc/attackby", function* attackby(f: Frame) {
	let new_name: Value = null, new_path: Value = null;
	f.vars = () => [new_name, new_path];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		new_name = "ChemMaster";
		new_path = T("/obj/machinery/chem_master");
		if (isEqual(rt.sv(f, "build_path"), T("/obj/machinery/chem_master"))) {
			new_name = "CondiMaster";
			new_path = T("/obj/machinery/chem_master/condimaster");
		}
		rt.setSv(f, "build_path", live(new_path));
		rt.setSv(f, "name", fmt("＀ 3000 (Machine Board)", [live(new_name)]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You change the circuit board setting to \"＀\".</span>", [live(new_name)])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/chem_master/proc/RefreshParts  (code/modules/reagents/chemistry/machinery/chem_master.dm:52)
rt.def("/obj/machinery/chem_master/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [B, $e];
	rt.setFv(f, "maximum_volume", rt.sv(f, "reagents"), 0);
	B = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/reagent_containers/glass/beaker"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		rt.modField(f, rt.sv(f, "reagents"), "maximum_volume", rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(B))), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/chem_master/proc/ex_act  (code/modules/reagents/chemistry/machinery/chem_master.dm:57)
rt.def("/obj/machinery/chem_master/proc/ex_act", function ex_act(f: Frame) {
	if (!rt.lt(live(f.args[0]), 3)) return f.dot;
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["severity", "target"], waitfor: false });

// /obj/machinery/chem_master/proc/contents_explosion  (code/modules/reagents/chemistry/machinery/chem_master.dm:61)
rt.def("/obj/machinery/chem_master/proc/contents_explosion", function contents_explosion(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "beaker"))) {
		rt.callName(f, rt.sv(f, "beaker"), "ex_act", [live(f.args[0]), live(f.args[1])]);
	}
	if (!truthy(rt.sv(f, "bottle"))) return f.dot;
	rt.callName(f, rt.sv(f, "bottle"), "ex_act", [live(f.args[0]), live(f.args[1])]);
	return f.dot;
}, false, { args: ["severity", "target"] });

// /obj/machinery/chem_master/proc/handle_atom_del  (code/modules/reagents/chemistry/machinery/chem_master.dm:68)  may sleep
rt.def("/obj/machinery/chem_master/proc/handle_atom_del", function* handle_atom_del(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(live(f.args[0]), rt.sv(f, "beaker"))) {
		rt.setSv(f, "beaker", null);
		yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
		rt.setSv(f, "icon_state", "mixer0");
	} else {
		if (!isEqual(live(f.args[0]), rt.sv(f, "bottle"))) return f.dot;
		rt.setSv(f, "bottle", null);
	}
	return f.dot;
}, true, { args: ["A"] });

// /obj/machinery/chem_master/proc/blob_act  (code/modules/reagents/chemistry/machinery/chem_master.dm:78)  may sleep
rt.def("/obj/machinery/chem_master/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/chem_master/proc/power_change  (code/modules/reagents/chemistry/machinery/chem_master.dm:82)
rt.def("/obj/machinery/chem_master/proc/power_change", function power_change(f: Frame) {
	if (truthy(rt.callSrc(f, "powered", []))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		rt.spawnTail(f, rt.call(f, P("/proc/rand"), null, [0, 15]), "/obj/machinery/chem_master/proc/power_change: spawn at modules/reagents/chemistry/machinery/chem_master.dm:83");
	}
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [0, 15])) body of /obj/machinery/chem_master/proc/power_change, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/chem_master/proc/power_change: spawn at modules/reagents/chemistry/machinery/chem_master.dm:83", function* (f: Frame) {
	(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	return null;
});

// /obj/machinery/chem_master/proc/attackby  (code/modules/reagents/chemistry/machinery/chem_master.dm:89)  may sleep
rt.def("/obj/machinery/chem_master/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "mixer0_nopower", "mixer0", live(f.args[0]))))) {
		if (truthy(rt.sv(f, "beaker"))) {
			rt.setFv(f, "loc", rt.sv(f, "beaker"), rt.fv(f, "loc", live(f.src)));
			rt.setSv(f, "beaker", null);
			yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
		}
		if (truthy(rt.sv(f, "bottle"))) {
			rt.setFv(f, "loc", rt.sv(f, "bottle"), rt.fv(f, "loc", live(f.src)));
			rt.setSv(f, "bottle", null);
		}
		return live(f.dot);
	} else {
		if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
			return live(f.dot);
		} else {
			if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
				return live(f.dot);
			}
		}
	}
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers")) ? 1 : 0)) && truthy(rt.bitAnd(rt.fv(f, "container_type", live(f.args[0])), 4096)))) {
		f.dot = 1;
		if (truthy(rt.sv(f, "panel_open"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't use the ＀ while its panel is opened!</span>", [rt.fv(f, "name", live(f.src))])]);
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "beaker"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>A container is already loaded in the machine!</span>"]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setSv(f, "beaker", live(f.args[0]));
		rt.setFv(f, "loc", rt.sv(f, "beaker"), live(f.src));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the beaker to the machine.</span>"]);
		yield* g.callName(f, live(f.src), "updateUsrDialog", []);
		rt.setSv(f, "icon_state", "mixer1");
	} else {
		if ((!truthy(rt.sv(f, "condi")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/pill_bottle")) ? 1 : 0)))) {
			if (truthy(rt.sv(f, "bottle"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>A pill bottle is already loaded into the machine!</span>"]);
				return live(f.dot);
			}
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.setSv(f, "bottle", live(f.args[0]));
			rt.setFv(f, "loc", rt.sv(f, "bottle"), live(f.src));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the pill bottle into the dispenser slot.</span>"]);
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/chem_master/proc/ui_interact  (code/modules/reagents/chemistry/machinery/chem_master.dm:141)  may sleep
rt.def("/obj/machinery/chem_master/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "chem_master", rt.sv(f, "name"), 500, 550, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/chem_master/proc/ui_data  (code/modules/reagents/chemistry/machinery/chem_master.dm:148)
rt.def("/obj/machinery/chem_master/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, beakerContents: Value = null, R: Value = null, bufferContents: Value = null, N: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [data, beakerContents, R, bufferContents, N, $0, $1, $2, $e];
	$0 = (data = rt.list());
	$1 = "isBeakerLoaded";
	if (truthy(rt.sv(f, "beaker"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "beakerCurrentVolume";
	if (truthy(rt.sv(f, "beaker"))) {
		$2 = rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker")));
	} else {
		$2 = null;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "beakerMaxVolume";
	if (truthy(rt.sv(f, "beaker"))) {
		$2 = rt.fv(f, "volume", rt.sv(f, "beaker"));
	} else {
		$2 = null;
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "mode", rt.sv(f, "mode"));
	rt.setAt(live(data), "condi", rt.sv(f, "condi"));
	rt.setAt(live(data), "screen", rt.sv(f, "screen"));
	rt.setAt(live(data), "analyzeVars", rt.sv(f, "analyzeVars"));
	$0 = live(data);
	$1 = "isPillBottleLoaded";
	if (truthy(rt.sv(f, "bottle"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	if (truthy(rt.sv(f, "bottle"))) {
		rt.setAt(live(data), "pillBotContent", rt.getLen(f, rt.fv(f, "contents", rt.sv(f, "bottle"))));
		rt.setAt(live(data), "pillBotMaxContent", rt.fv(f, "storage_slots", rt.sv(f, "bottle")));
	}
	beakerContents = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	if (truthy(rt.sv(f, "beaker"))) {
		R = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker"))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			rt.callName(f, live(beakerContents), "Add", [rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(R)), "id", rt.fv(f, "id", live(R)), "volume", rt.fv(f, "volume", live(R))]))]);
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "beakerContents", live(beakerContents));
	}
	bufferContents = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		N = null;
		rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			N = $e;
			rt.callName(f, live(bufferContents), "Add", [rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(N)), "id", rt.fv(f, "id", live(N)), "volume", rt.fv(f, "volume", live(N))]))]);
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "bufferContents", live(bufferContents));
	}
	return live(data);
});

// /obj/machinery/chem_master/proc/ui_act  (code/modules/reagents/chemistry/machinery/chem_master.dm:179)  may sleep
rt.def("/obj/machinery/chem_master/proc/ui_act", function* ui_act(f: Frame) {
	let id: Value = null, amount: Value = null, many: Value = null, vol_each: Value = null, name: Value = null, _P: Value = null, i: Value = null, name_1: Value = null, _P_2: Value = null, amount_full: Value = null, vol_part: Value = null, R: Value = null, state: Value = null, _T: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [id, amount, many, vol_each, name, _P, i, name_1, _P_2, amount_full, vol_part, R, state, _T, $0, $1, $2, $3];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "eject") {
		if (truthy(rt.sv(f, "beaker"))) {
			rt.setFv(f, "loc", rt.sv(f, "beaker"), rt.fv(f, "loc", live(f.src)));
			rt.setSv(f, "beaker", null);
			yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
			rt.setSv(f, "icon_state", "mixer0");
			f.dot = 1;
		}
	} else if ($0 === "ejectp") {
		if (truthy(rt.sv(f, "bottle"))) {
			rt.setFv(f, "loc", rt.sv(f, "bottle"), rt.fv(f, "loc", live(f.src)));
			rt.setSv(f, "bottle", null);
			f.dot = 1;
		}
	} else if ($0 === "transferToBuffer") {
		if (truthy(rt.sv(f, "beaker"))) {
			id = rt.at(live(f.args[1]), "id");
			if (rt.gt((amount = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "amount")]))), 0)) {
				yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "trans_id_to", [live(f.src), live(id), live(amount)]);
				f.dot = 1;
			} else {
				if (isEqual(live(amount), -1)) {
					rt.setSv(f, "useramount", (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "useramount"), rt.sv(f, "name"), "Enter the Amount you want to transfer:", null])));
					if (rt.gt(rt.sv(f, "useramount"), 0)) {
						yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "trans_id_to", [live(f.src), live(id), rt.sv(f, "useramount")]);
						f.dot = 1;
					}
				}
			}
		}
	} else if ($0 === "transferFromBuffer") {
		id = rt.at(live(f.args[1]), "id");
		if (rt.gt((amount = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "amount")]))), 0)) {
			if (truthy(rt.sv(f, "mode"))) {
				yield* g.callName(f, rt.sv(f, "reagents"), "trans_id_to", [rt.sv(f, "beaker"), live(id), live(amount)]);
				f.dot = 1;
			} else {
				yield* g.callName(f, rt.sv(f, "reagents"), "remove_reagent", [live(id), live(amount)]);
				f.dot = 1;
			}
		}
	} else if ($0 === "toggleMode") {
		rt.setSv(f, "mode", (!truthy(rt.sv(f, "mode")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "createPill") {
		many = rt.at(live(f.args[1]), "many");
		if (isEqual(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 0)) {
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "condi"))) {
			amount = 1;
			vol_each = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "total_volume", rt.sv(f, "reagents")), 50]));
			if (truthy((yield* g.call(f, P("/proc/text2num"), null, [live(many)])))) {
				if (!truthy((amount = (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [33], [live(amount), "How many pills?", "Max 10. Buffer content will be split evenly.", live(f.usr), null]))])), 10]))]))))) {
					return live(f.dot);
				}
				vol_each = (yield* g.call(f, P("/proc/min"), null, [divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), live(amount)), 50]));
			}
			if (((((!truthy((name = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Name:", "Name your pill!", fmt("＀ (＀u)", [(yield* g.callName(f, rt.sv(f, "reagents"), "get_master_reagent_name", [])), live(vol_each)]), 42])))) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) || !truthy(live(f.src))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || !truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named))))) {
				return live(f.dot);
			}
			_P = null;
			i = null;
			i = 0;
			while (rt.lt(live(i), live(amount))) {
				if ((truthy(rt.sv(f, "bottle")) && rt.lt(rt.getLen(f, rt.fv(f, "contents", rt.sv(f, "bottle"))), rt.fv(f, "storage_slots", rt.sv(f, "bottle"))))) {
					_P = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill"), [rt.sv(f, "bottle")]));
				} else {
					_P = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill"), [rt.fv(f, "loc", live(f.src))]));
				}
				rt.setFv(f, "name", live(_P), (yield* g.call(f, P("/proc/trim"), null, [fmt("＀ pill", [live(name)])])));
				rt.setFv(f, "pixel_x", live(_P), (yield* g.call(f, P("/proc/rand"), null, [-7, 7])));
				rt.setFv(f, "pixel_y", live(_P), (yield* g.call(f, P("/proc/rand"), null, [-7, 7])));
				yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(_P), live(vol_each)]);
				i = rt.inc(live(i), 1);
			}
		} else {
			if (((((!truthy((name_1 = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Name:", "Name your pack!", (yield* g.callName(f, rt.sv(f, "reagents"), "get_master_reagent_name", [])), 42])))) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) || !truthy(live(f.src))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || !truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named))))) {
				return live(f.dot);
			}
			rt.setFv(f, "originalname", (_P_2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/condiment/pack"), [rt.fv(f, "loc", live(f.src))]))), live(name_1));
			rt.setFv(f, "name", live(_P_2), (yield* g.call(f, P("/proc/trim"), null, [fmt("＀ pack", [live(name_1)])])));
			rt.setFv(f, "desc", live(_P_2), fmt("A small condiment pack. The label says it contains ＀.", [live(name_1)]));
			yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(_P_2), 10]);
		}
		f.dot = 1;
	} else if ($0 === "createPatch") {
		many = rt.at(live(f.args[1]), "many");
		if (isEqual(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 0)) {
			return live(f.dot);
		}
		amount = 1;
		vol_each = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "total_volume", rt.sv(f, "reagents")), 40]));
		if (truthy((yield* g.call(f, P("/proc/text2num"), null, [live(many)])))) {
			if (!truthy((amount = (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [33], [live(amount), "How many patches?", "Max 10. Buffer content will be split evenly.", live(f.usr), null]))])), 10]))]))))) {
				return live(f.dot);
			}
			vol_each = (yield* g.call(f, P("/proc/min"), null, [divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), live(amount)), 40]));
		}
		if (((((!truthy((name = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Name:", "Name your patch!", fmt("＀ (＀u)", [(yield* g.callName(f, rt.sv(f, "reagents"), "get_master_reagent_name", [])), live(vol_each)]), 42])))) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) || !truthy(live(f.src))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || !truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named))))) {
			return live(f.dot);
		}
		_P = null;
		i = null;
		i = 0;
		while (rt.lt(live(i), live(amount))) {
			rt.setFv(f, "name", (_P = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/pill/patch"), [rt.fv(f, "loc", live(f.src))]))), (yield* g.call(f, P("/proc/trim"), null, [fmt("＀ patch", [live(name)])])));
			rt.setFv(f, "pixel_x", live(_P), (yield* g.call(f, P("/proc/rand"), null, [-7, 7])));
			rt.setFv(f, "pixel_y", live(_P), (yield* g.call(f, P("/proc/rand"), null, [-7, 7])));
			yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(_P), live(vol_each)]);
			i = rt.inc(live(i), 1);
		}
		f.dot = 1;
	} else if ($0 === "createBottle") {
		many = rt.at(live(f.args[1]), "many");
		if (isEqual(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 0)) {
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "condi"))) {
			$0 = live(f.usr);
			$1 = "Name:";
			$2 = "Name your bottle!";
			if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
				$3 = (yield* g.callName(f, rt.sv(f, "reagents"), "get_master_reagent_name", []));
			} else {
				$3 = " ";
			}
			if (((((!truthy((name_1 = (yield* g.call(f, P("/proc/stripped_input"), null, [$0, $1, $2, $3, 42])))) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) || !truthy(live(f.src))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || !truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named))))) {
				return live(f.dot);
			}
			rt.setFv(f, "originalname", (_P_2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/condiment"), [rt.fv(f, "loc", live(f.src))]))), live(name_1));
			rt.setFv(f, "name", live(_P_2), (yield* g.call(f, P("/proc/trim"), null, [fmt("＀ bottle", [live(name_1)])])));
			yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(_P_2), rt.fv(f, "volume", live(_P_2))]);
		} else {
			amount_full = 0;
			vol_part = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "total_volume", rt.sv(f, "reagents")), 30]));
			if (truthy((yield* g.call(f, P("/proc/text2num"), null, [live(many)])))) {
				amount_full = (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 30)]));
				vol_part = rt.modulus(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 30);
			}
			$0 = live(f.usr);
			$1 = "Name:";
			$2 = "Name your bottle!";
			if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
				$3 = (yield* g.callName(f, rt.sv(f, "reagents"), "get_master_reagent_name", []));
			} else {
				$3 = " ";
			}
			if (((((!truthy((name = (yield* g.call(f, P("/proc/stripped_input"), null, [$0, $1, $2, $3, 42])))) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) || !truthy(live(f.src))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || !truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named))))) {
				return live(f.dot);
			}
			_P = null;
			i = null;
			i = 0;
			while (rt.lt(live(i), live(amount_full))) {
				rt.setFv(f, "pixel_x", (_P = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle"), [rt.fv(f, "loc", live(f.src))]))), (yield* g.call(f, P("/proc/rand"), null, [-7, 7])));
				rt.setFv(f, "pixel_y", live(_P), (yield* g.call(f, P("/proc/rand"), null, [-7, 7])));
				rt.setFv(f, "name", live(_P), (yield* g.call(f, P("/proc/trim"), null, [fmt("＀ bottle", [live(name)])])));
				yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(_P), 30]);
				i = rt.inc(live(i), 1);
			}
			if (truthy(live(vol_part))) {
				rt.setFv(f, "name", (_P = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle"), [rt.fv(f, "loc", live(f.src))]))), (yield* g.call(f, P("/proc/trim"), null, [fmt("＀ bottle", [live(name)])])));
				yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(_P), live(vol_part)]);
			}
		}
		f.dot = 1;
	} else if ($0 === "analyze") {
		if (truthy((R = rt.index(rt.gl("chemical_reagents_list"), rt.at(live(f.args[1]), "id"))))) {
			state = "Unknown";
			if (isEqual(rt.initial(f, live(R), "reagent_state"), 1)) {
				state = "Solid";
			} else {
				if (isEqual(rt.initial(f, live(R), "reagent_state"), 2)) {
					state = "Liquid";
				} else {
					if (isEqual(rt.initial(f, live(R), "reagent_state"), 3)) {
						state = "Gas";
					}
				}
			}
			_P_2 = 3;
			_T = multiply(rt.initial(f, live(R), "metabolization_rate"), 20);
			rt.setSv(f, "analyzeVars", rt.alist(f, ["name", rt.initial(f, live(R), "name"), "state", live(state), "color", rt.initial(f, live(R), "color"), "description", rt.initial(f, live(R), "description"), "metaRate", live(_T), "overD", rt.initial(f, live(R), "overdose_threshold"), "addicD", rt.initial(f, live(R), "addiction_threshold")]));
			rt.setSv(f, "screen", "analyze");
			return live(f.dot);
		}
	} else if ($0 === "goScreen") {
		rt.setSv(f, "screen", rt.at(live(f.args[1]), "screen"));
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/chem_master/proc/isgoodnumber  (code/modules/reagents/chemistry/machinery/chem_master.dm:347)
rt.def("/obj/machinery/chem_master/proc/isgoodnumber", function isgoodnumber(f: Frame, num: Value) {
	f.vars = () => [num];
	if (truthy(rt.call(f, P("/proc/isnum"), null, [live(num)]))) {
		if (rt.gt(live(num), 200)) {
			num = 200;
		} else {
			if (rt.lt(live(num), 0)) {
				num = 0;
			} else {
				num = rt.call(f, P("/proc/round"), null, [live(num)]);
			}
		}
		return live(num);
	} else {
		return 0;
	}
	return f.dot;
});
