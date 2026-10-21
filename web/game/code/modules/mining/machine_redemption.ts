// From code/modules/mining/machine_redemption.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10931, "/obj/machinery/mineral/ore_redemption", "/obj/machinery/mineral", {
	inserted_id: null,
	points: 0,
	ore_pickup_rate: 15,
	sheet_per_ore: 1,
	point_upgrade: 1,
	ore_values: null,
	message_sent: 0,
	ore_buffer: null,
	materials: null,
	files: null,
	inserted_disk: null,
	req_access_reclaim: 54,
	anchored: 1,
	input_dir: 1,
	output_dir: 2,
	speed_process: 1,
	name: "ore redemption machine",
	desc: "A machine that accepts ore and instantly transforms it into workable material sheets. Points for ore are generated based on type and can be redeemed at a mining equipment vendor.",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "ore_redemption",
	density: 1,
	req_access: null,
});

// /obj/machinery/mineral/ore_redemption/proc/<init>  (code/modules/mining/machine_redemption.dm:20)
rt.def("/obj/machinery/mineral/ore_redemption/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ore_values", rt.alist(f, ["$glass", 1, "$metal", 1, "$plasma", 15, "$silver", 16, "$gold", 18, "$titanium", 30, "$uranium", 30, "$diamond", 50, "$bluespace", 50, "$bananium", 60]));
	$0 = $0;
	rt.setSv(f, "ore_buffer", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(64));
	return f.dot;
});

// /obj/machinery/mineral/ore_redemption/proc/Initialize  (code/modules/mining/machine_redemption.dm:29)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/ore_redemption"), []))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "materials", (yield* g.new_(f, T("/datum/material_container"), [live(f.src), rt.list("$metal", "$glass", "$silver", "$gold", "$diamond", "$plasma", "$uranium", "$bananium", "$titanium", "$bluespace"), 9.999999848243207e+30])));
	rt.setSv(f, "files", (yield* g.new_(f, T("/datum/research/smelter"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/machinery/mineral/ore_redemption/proc/Destroy  (code/modules/mining/machine_redemption.dm:36)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "materials")]);
	rt.setSv(f, "materials", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "files")]);
	rt.setSv(f, "files", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(6760, "/obj/item/weapon/circuitboard/machine/ore_redemption", "/obj/item/weapon/circuitboard/machine", {
	name: "Ore Redemption (Machine Board)",
	build_path: rt.typePath("/obj/machinery/mineral/ore_redemption"),
	origin_tech: "programming=1;engineering=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/ore_redemption/proc/<init>  (code/modules/mining/machine_redemption.dm:44)
rt.def("/obj/item/weapon/circuitboard/machine/ore_redemption/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/device/assembly/igniter"), 1]));
	return f.dot;
});

// /obj/machinery/mineral/ore_redemption/proc/RefreshParts  (code/modules/mining/machine_redemption.dm:55)
rt.def("/obj/machinery/mineral/ore_redemption/proc/RefreshParts", function RefreshParts(f: Frame) {
	let ore_pickup_rate_temp: Value = null, point_upgrade_temp: Value = null, sheet_per_ore_temp: Value = null, B: Value = null, M: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [ore_pickup_rate_temp, point_upgrade_temp, sheet_per_ore_temp, B, M, L, $e];
	ore_pickup_rate_temp = 15;
	point_upgrade_temp = 1;
	sheet_per_ore_temp = 1;
	B = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		sheet_per_ore_temp = add(0.6499999761581421, multiply(0.3499999940395355, rt.fv(f, "rating", live(B))));
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		ore_pickup_rate_temp = multiply(15, rt.fv(f, "rating", live(M)));
	}
	rt.endFor(f, 0);
	L = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/micro_laser"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		point_upgrade_temp = add(0.6499999761581421, multiply(0.3499999940395355, rt.fv(f, "rating", live(L))));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "ore_pickup_rate", live(ore_pickup_rate_temp));
	rt.setSv(f, "point_upgrade", live(point_upgrade_temp));
	rt.setSv(f, "sheet_per_ore", live(sheet_per_ore_temp));
	return f.dot;
});

// /obj/machinery/mineral/ore_redemption/proc/smelt_ore  (code/modules/mining/machine_redemption.dm:67)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/smelt_ore", function* smelt_ore(f: Frame, O: Value) {
	let material_amount: Value = null;
	f.vars = () => [O, material_amount];
	(rt.modSrcVar(f, "ore_buffer", live(O), subtract));
	if ((truthy(live(O)) && truthy(rt.fv(f, "refined_type", live(O))))) {
		rt.modSrcVar(f, "points", multiply(rt.fv(f, "points", live(O)), rt.sv(f, "point_upgrade")), add);
	}
	if (!truthy((material_amount = (yield* g.callName(f, rt.sv(f, "materials"), "get_item_material_amount", [live(O)]))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	} else {
		if (!truthy((yield* g.callName(f, rt.sv(f, "materials"), "has_space", [multiply(live(material_amount), rt.sv(f, "sheet_per_ore"))])))) {
			yield* g.srcCall(f, "unload_mineral", live(O));
		} else {
			yield* g.callName(f, rt.sv(f, "materials"), "insert_item", [live(O), rt.sv(f, "sheet_per_ore")]);
			yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		}
	}
	return f.dot;
}, true);

// /obj/machinery/mineral/ore_redemption/proc/can_smelt_alloy  (code/modules/mining/machine_redemption.dm:85)
rt.def("/obj/machinery/mineral/ore_redemption/proc/can_smelt_alloy", function can_smelt_alloy(f: Frame, D: Value) {
	let build_amount: Value = null, mat_id: Value = null, M: Value = null, redemption_mat: Value = null, smeltable_sheets: Value = null;
	let $e: any;
	f.vars = () => [build_amount, mat_id, M, redemption_mat, smeltable_sheets, $e];
	if (truthy(rt.getLen(f, rt.fv(f, "make_reagents", live(D))))) {
		return 0;
	}
	build_amount = 0;
	mat_id = null;
	rt.forList(f, 0, rt.fv(f, "materials", live(D)));
	while (($e = rt.next(f, 0)) !== undefined) {
		mat_id = $e;
		M = rt.index(rt.fv(f, "materials", live(D)), live(mat_id));
		redemption_mat = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), live(mat_id));
		if ((!truthy(live(M)) || !truthy(live(redemption_mat)))) {
			return 0;
		}
		if (!truthy((smeltable_sheets = rt.call(f, P("/proc/Floor"), null, [divide(rt.fv(f, "amount", live(redemption_mat)), live(M))])))) {
			return 0;
		}
		if (!truthy(live(build_amount))) {
			build_amount = live(smeltable_sheets);
		}
		build_amount = rt.call(f, P("/proc/min"), null, [live(build_amount), live(smeltable_sheets)]);
	}
	rt.endFor(f, 0);
	return live(build_amount);
});

// /obj/machinery/mineral/ore_redemption/proc/process_ores  (code/modules/mining/machine_redemption.dm:111)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/process_ores", function* process_ores(f: Frame, ores_to_process: Value) {
	let current_amount: Value = null, ore: Value = null;
	let $e: any;
	f.vars = () => [ores_to_process, current_amount, ore, $e];
	current_amount = 0;
	ore = null;
	rt.forList(f, 0, live(ores_to_process));
	while (($e = rt.next(f, 0)) !== undefined) {
		ore = $e;
		if (rt.ge(live(current_amount), rt.sv(f, "ore_pickup_rate"))) {
			break;
		}
		yield* g.srcCall(f, "smelt_ore", live(ore));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/mineral/ore_redemption/proc/send_console_message  (code/modules/mining/machine_redemption.dm:117)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/send_console_message", function* send_console_message(f: Frame) {
	let A: Value = null, msg: Value = null, has_minerals: Value = null, mat_id: Value = null, M: Value = null, mineral_amount: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [A, msg, has_minerals, mat_id, M, mineral_amount, D, $e];
	if (!isEqual(rt.sv(f, "z"), 2)) {
		return live(f.dot);
	}
	rt.setSv(f, "message_sent", 1);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	msg = fmt("Now available in ＀:<br>", [live(A)]);
	has_minerals = 0;
	mat_id = null;
	rt.forList(f, 0, rt.fv(f, "materials", rt.sv(f, "materials")));
	while (($e = rt.next(f, 0)) !== undefined) {
		mat_id = $e;
		M = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), live(mat_id));
		if (truthy((mineral_amount = divide(rt.fv(f, "amount", live(M)), 2000)))) {
			has_minerals = 1;
		}
		msg = rt.modify(live(msg), fmt("＀: ＀ sheets<br>", [(yield* g.call(f, P("/proc/capitalize"), null, [rt.fv(f, "name", live(M))])), live(mineral_amount)]), add);
	}
	rt.endFor(f, 0);
	if (!truthy(live(has_minerals))) {
		return live(f.dot);
	}
	D = null;
	rt.forList(f, 0, rt.gl("allConsoles"), T("/obj/machinery/requests_console"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (truthy(rt.fv(f, "receive_ore_updates", live(D)))) {
			yield* g.callName(f, live(D), "createmessage", ["Ore Redemption Machine", "New minerals available!", live(msg), 1, 0]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/mineral/ore_redemption/proc/process  (code/modules/mining/machine_redemption.dm:140)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/process", function* process(f: Frame) {
	let input: Value = null, OB: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [input, OB, O, $e];
	if ((truthy(rt.sv(f, "panel_open")) || !truthy((yield* g.srcCall(f, "powered"))))) {
		return live(f.dot);
	}
	input = rt.getStep(f, live(f.src), rt.sv(f, "input_dir"));
	if (truthy((OB = rt.locateIn(f, T("/obj/structure/ore_box"), live(input))))) {
		input = live(OB);
	}
	O = null;
	rt.forList(f, 0, live(input), T("/obj/item/weapon/ore"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((!truthy(live(O)) || truthy(rt.fv(f, "gc_destroyed", live(O))))) {
			continue;
		}
		(rt.modSrcVar(f, "ore_buffer", live(O), rt.bitOr));
		yield* g.callName(f, live(O), "forceMove", [live(f.src)]);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.length(rt.sv(f, "ore_buffer")))) {
		rt.setSv(f, "message_sent", 0);
		yield* g.srcCall(f, "process_ores", rt.sv(f, "ore_buffer"));
	} else {
		if (truthy(rt.sv(f, "message_sent"))) return f.dot;
		yield* g.srcCall(f, "send_console_message");
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/mineral/ore_redemption/proc/attackby  (code/modules/mining/machine_redemption.dm:161)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/attackby", function* attackby(f: Frame) {
	let I: Value = null, S: Value = null, inserted: Value = null;
	f.vars = () => [I, S, inserted];
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		yield* g.callName(f, rt.sv(f, "materials"), "retrieve_all", []);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "ore_redemption-open", "ore_redemption", live(f.args[0]))))) {
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "powered")))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		if ((truthy((rt.istype((I = (yield* g.callName(f, live(f.args[1]), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0)) && !truthy((rt.istype(rt.sv(f, "inserted_id"), T("/obj/item/weapon/card/id")) ? 1 : 0)))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
			rt.setSv(f, "inserted_id", live(I));
			yield* g.srcCall(f, "interact", live(f.args[1]));
		}
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0)) && truthy(rt.sv(f, "panel_open")))) {
		rt.setSv(f, "input_dir", (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "input_dir"), -90])));
		rt.setSv(f, "output_dir", (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "output_dir"), -90])));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You change ＀'s I/O settings, setting the input to ＀ and the output to ＀.</span>", [live(f.src), (yield* g.call(f, P("/proc/dir2text"), null, [rt.sv(f, "input_dir")])), (yield* g.call(f, P("/proc/dir2text"), null, [rt.sv(f, "output_dir")]))])]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/disk/design_disk")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
			rt.setSv(f, "inserted_disk", live(f.args[0]));
			return 1;
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet")) ? 1 : 0))) {
		S = live(f.args[0]);
		inserted = (yield* g.callName(f, rt.sv(f, "materials"), "insert_stack", [live(S), rt.fv(f, "amount", live(S))]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ ＀ sheets to ％！.</span>", [live(inserted), live(S), live(f.src)])]);
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/mineral/ore_redemption/proc/on_deconstruction  (code/modules/mining/machine_redemption.dm:206)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* g.callName(f, rt.sv(f, "materials"), "retrieve_all", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/mineral/ore_redemption/proc/attack_hand  (code/modules/mining/machine_redemption.dm:210)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/mineral/ore_redemption/proc/ui_interact  (code/modules/mining/machine_redemption.dm:215)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "ore_redemption_machine", "Ore Redemption Machine", 440, 550, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/mineral/ore_redemption/proc/ui_data  (code/modules/mining/machine_redemption.dm:221)
rt.def("/obj/machinery/mineral/ore_redemption/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, mat_id: Value = null, M: Value = null, sheet_amount: Value = null, v: Value = null, D: Value = null, index: Value = null, thisdesign: Value = null;
	let $0: any, $e: any;
	f.vars = () => [data, mat_id, M, sheet_amount, v, D, index, thisdesign, $0, $e];
	rt.setAt((data = rt.list()), "unclaimedPoints", rt.sv(f, "points"));
	if (truthy(rt.sv(f, "inserted_id"))) {
		rt.setAt(live(data), "hasID", 1);
		rt.setAt(live(data), "claimedPoints", rt.fv(f, "mining_points", rt.sv(f, "inserted_id")));
	}
	rt.setAt(live(data), "materials", rt.list());
	mat_id = null;
	rt.forList(f, 0, rt.fv(f, "materials", rt.sv(f, "materials")));
	while (($e = rt.next(f, 0)) !== undefined) {
		mat_id = $e;
		M = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), live(mat_id));
		if (truthy(rt.fv(f, "amount", live(M)))) {
			$0 = divide(rt.fv(f, "amount", live(M)), 2000);
		} else {
			$0 = "0";
		}
		sheet_amount = $0;
		rt.modAt(live(data), "materials", rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(M)), "id", rt.fv(f, "id", live(M)), "amount", live(sheet_amount), "value", multiply(rt.index(rt.sv(f, "ore_values"), rt.fv(f, "id", live(M))), rt.sv(f, "point_upgrade"))])), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "alloys", rt.list());
	v = null;
	rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v));
		rt.modAt(live(data), "alloys", rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(D)), "id", rt.fv(f, "id", live(D)), "amount", rt.callSrc(f, "can_smelt_alloy", [live(D)])])), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "diskDesigns", rt.list());
	if (truthy(rt.sv(f, "inserted_disk"))) {
		rt.setAt(live(data), "hasDisk", 1);
		if (truthy(rt.getLen(f, rt.fv(f, "blueprints", rt.sv(f, "inserted_disk"))))) {
			index = 1;
			thisdesign = null;
			rt.forList(f, 0, rt.fv(f, "blueprints", rt.sv(f, "inserted_disk")), T("/datum/design"));
			while (($e = rt.next(f, 0)) !== undefined) {
				thisdesign = $e;
				if (truthy(live(thisdesign))) {
					rt.modAt(live(data), "diskDesigns", rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(thisdesign)), "index", live(index), "canupload", rt.bitAnd(rt.fv(f, "build_type", live(thisdesign)), 128)])), add);
				}
				index = rt.inc(live(index), 1);
			}
			rt.endFor(f, 0);
		}
	}
	return live(data);
});

// /obj/machinery/mineral/ore_redemption/proc/ui_act  (code/modules/mining/machine_redemption.dm:249)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/ui_act", function* ui_act(f: Frame) {
	let I: Value = null, out: Value = null, mat_id: Value = null, mat: Value = null, stored_amount: Value = null, desired: Value = null, sheets_to_remove: Value = null, disk: Value = null, n: Value = null, alloy_id: Value = null, alloy: Value = null, smelt_amount: Value = null, desired_3: Value = null, amount: Value = null, output: Value = null, produced_alloy: Value = null, output_3: Value = null;
	let $0: any;
	f.vars = () => [I, out, mat_id, mat, stored_amount, desired, sheets_to_remove, disk, n, alloy_id, alloy, smelt_amount, desired_3, amount, output, produced_alloy, output_3, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "Eject") {
		if (!truthy(rt.sv(f, "inserted_id"))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "inserted_id")]);
		rt.setSv(f, "inserted_id", null);
		return 1;
	} else if ($0 === "Insert") {
		if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
			if (!truthy((yield* g.callName(f, live(f.usr), "transferItemToLoc", [live(I), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setSv(f, "inserted_id", live(I));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Not a valid ID!</span>"]);
		}
		return 1;
	} else if ($0 === "Claim") {
		if (truthy(rt.sv(f, "inserted_id"))) {
			rt.modField(f, rt.sv(f, "inserted_id"), "mining_points", rt.sv(f, "points"), add);
			rt.setSv(f, "points", 0);
		}
		return 1;
	} else if ($0 === "Release") {
		if ((truthy((yield* g.srcCall(f, "check_access", rt.sv(f, "inserted_id")))) || truthy((yield* g.srcCall(f, "allowed", live(f.usr)))))) {
			out = rt.getStep(f, live(f.src), rt.sv(f, "output_dir"));
			if (isEqual(rt.at(live(f.args[1]), "id"), "all")) {
				yield* g.callName(f, rt.sv(f, "materials"), "retrieve_all", [live(out)]);
			} else {
				mat_id = rt.at(live(f.args[1]), "id");
				if (!truthy(rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), live(mat_id)))) {
					return live(f.dot);
				}
				mat = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), live(mat_id));
				if (!truthy((stored_amount = divide(rt.fv(f, "amount", live(mat)), 2000)))) {
					return live(f.dot);
				}
				desired = 0;
				if (truthy(rt.at(live(f.args[1]), "sheets"))) {
					desired = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "sheets")]));
				} else {
					desired = (yield* g.op(f, "Prompt", [33], [null, 1, "How many sheets would you like to smelt?", "How many sheets?", null]));
				}
				sheets_to_remove = (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/min"), null, [live(desired), 50, live(stored_amount)]))]));
				yield* g.callName(f, rt.sv(f, "materials"), "retrieve_sheets", [live(sheets_to_remove), live(mat_id), live(out)]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Required access not found.</span>"]);
		}
		return 1;
	} else if ($0 === "diskInsert") {
		if (truthy((rt.istype((disk = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/disk/design_disk")) ? 1 : 0))) {
			if (!truthy((yield* g.callName(f, live(f.usr), "transferItemToLoc", [live(disk), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setSv(f, "inserted_disk", live(disk));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Not a valid Design Disk!</span>"]);
		}
		return 1;
	} else if ($0 === "diskEject") {
		if (truthy(rt.sv(f, "inserted_disk"))) {
			yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "inserted_disk")]);
			rt.setSv(f, "inserted_disk", null);
		}
		return 1;
	} else if ($0 === "diskUpload") {
		n = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "design")]));
		if (((truthy(rt.sv(f, "inserted_disk")) && truthy(rt.fv(f, "blueprints", rt.sv(f, "inserted_disk")))) && truthy(rt.index(rt.fv(f, "blueprints", rt.sv(f, "inserted_disk")), live(n))))) {
			yield* g.callName(f, rt.sv(f, "files"), "AddDesign2Known", [rt.index(rt.fv(f, "blueprints", rt.sv(f, "inserted_disk")), live(n))]);
		}
		return 1;
	} else if ($0 === "Smelt") {
		alloy_id = rt.at(live(f.args[1]), "id");
		alloy = (yield* g.callName(f, rt.sv(f, "files"), "FindDesignByID", [live(alloy_id)]));
		if (((truthy((yield* g.srcCall(f, "check_access", rt.sv(f, "inserted_id")))) || truthy((yield* g.srcCall(f, "allowed", live(f.usr))))) && truthy(live(alloy)))) {
			smelt_amount = (yield* g.srcCall(f, "can_smelt_alloy", live(alloy)));
			desired_3 = 0;
			if (truthy(rt.at(live(f.args[1]), "sheets"))) {
				desired_3 = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "sheets")]));
			} else {
				desired_3 = (yield* g.op(f, "Prompt", [33], [null, 1, "How many sheets would you like to smelt?", "How many sheets?", null]));
			}
			amount = (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/min"), null, [live(desired_3), 50, live(smelt_amount)]))]));
			yield* g.callName(f, rt.sv(f, "materials"), "use_amount", [rt.fv(f, "materials", live(alloy)), live(amount)]);
			if (truthy((rt.istype((output = (yield* g.new_(f, rt.fv(f, "build_path", live(alloy)), [live(f.src)]))), T("/obj/item/stack/sheet")) ? 1 : 0))) {
				rt.setFv(f, "amount", (produced_alloy = live(output)), live(amount));
				yield* g.srcCall(f, "unload_mineral", live(produced_alloy));
			} else {
				yield* g.srcCall(f, "unload_mineral", live(output));
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Required access not found.</span>"]);
		}
		return 1;
	} else if ($0 === "SmeltAll") {
		alloy_id = rt.at(live(f.args[1]), "id");
		alloy = (yield* g.callName(f, rt.sv(f, "files"), "FindDesignByID", [live(alloy_id)]));
		if (((truthy((yield* g.srcCall(f, "check_access", rt.sv(f, "inserted_id")))) || truthy((yield* g.srcCall(f, "allowed", live(f.usr))))) && truthy(live(alloy)))) {
			smelt_amount = (yield* g.srcCall(f, "can_smelt_alloy", live(alloy)));
			while (rt.gt(live(smelt_amount), 0)) {
				yield* g.callName(f, rt.sv(f, "materials"), "use_amount", [rt.fv(f, "materials", live(alloy))]);
				smelt_amount = rt.inc(live(smelt_amount), -1);
				yield* g.srcCall(f, "unload_mineral", (output_3 = (yield* g.new_(f, rt.fv(f, "build_path", live(alloy)), [live(f.src)]))));
				if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
					yield* g.call(f, P("/proc/stoplag"), null, []);
				}
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Required access not found.</span>"]);
		}
		return 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/mineral/ore_redemption/proc/ex_act  (code/modules/mining/machine_redemption.dm:357)  may sleep
rt.def("/obj/machinery/mineral/ore_redemption/proc/ex_act", function* ex_act(f: Frame) {
	yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity", "target"], waitfor: false });

// /obj/machinery/mineral/ore_redemption/proc/power_change  (code/modules/mining/machine_redemption.dm:361)
rt.def("/obj/machinery/mineral/ore_redemption/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/mineral/ore_redemption/proc/update_icon  (code/modules/mining/machine_redemption.dm:365)
rt.def("/obj/machinery/mineral/ore_redemption/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.callSrc(f, "powered", []))) {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	} else {
		rt.setSv(f, "icon_state", fmt("＀-off", [rt.initial(f, live(f.src), "icon_state")]));
	}
	return live(f.dot);
});
