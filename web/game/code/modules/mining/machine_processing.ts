// From code/modules/mining/machine_processing.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10929, "/obj/machinery/mineral/processing_unit_console", "/obj/machinery/mineral", {
	machine: null,
	machinedir: 4,
	anchored: 1,
	speed_process: 1,
	name: "production machine console",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "console",
	density: 1,
});

// /obj/machinery/mineral/processing_unit_console/proc/Initialize  (code/modules/mining/machine_processing.dm:16)  may sleep
rt.def("/obj/machinery/mineral/processing_unit_console/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "machine", rt.locateIn(f, T("/obj/machinery/mineral/processing_unit"), rt.getStep(f, live(f.src), rt.sv(f, "machinedir"))));
	if (truthy(rt.sv(f, "machine"))) {
		rt.setFv(f, "CONSOLE", rt.sv(f, "machine"), live(f.src));
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/machinery/mineral/processing_unit_console/proc/attack_hand  (code/modules/mining/machine_processing.dm:25)  may sleep
rt.def("/obj/machinery/mineral/processing_unit_console/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	f.vars = () => [user, dat, popup];
	if (!truthy(rt.sv(f, "machine"))) {
		return live(f.dot);
	}
	dat = (yield* g.callName(f, rt.sv(f, "machine"), "get_machine_data", []));
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "processing", "Smelting Console", 300, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/mineral/processing_unit_console/proc/Topic  (code/modules/mining/machine_processing.dm:35)  may sleep
rt.def("/obj/machinery/mineral/processing_unit_console/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	if (truthy(rt.at(live(f.args[1]), "material"))) {
		rt.setFv(f, "selected_material", rt.sv(f, "machine"), rt.at(live(f.args[1]), "material"));
		rt.setFv(f, "selected_alloy", rt.sv(f, "machine"), null);
	}
	if (truthy(rt.at(live(f.args[1]), "alloy"))) {
		rt.setFv(f, "selected_material", rt.sv(f, "machine"), null);
		rt.setFv(f, "selected_alloy", rt.sv(f, "machine"), rt.at(live(f.args[1]), "alloy"));
	}
	if (truthy(rt.at(live(f.args[1]), "set_on"))) {
		rt.setFv(f, "on", rt.sv(f, "machine"), (isEqual(rt.at(live(f.args[1]), "set_on"), "on") ? 1 : 0));
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/mineral/processing_unit_console/proc/Destroy  (code/modules/mining/machine_processing.dm:56)  may sleep
rt.def("/obj/machinery/mineral/processing_unit_console/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "machine", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(10930, "/obj/machinery/mineral/processing_unit", "/obj/machinery/mineral", {
	CONSOLE: null,
	materials: null,
	on: 0,
	selected_material: "$metal",
	selected_alloy: null,
	files: null,
	anchored: 1,
	name: "furnace",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "furnace",
	density: 1,
});

// /obj/machinery/mineral/processing_unit/proc/Initialize  (code/modules/mining/machine_processing.dm:76)  may sleep
rt.def("/obj/machinery/mineral/processing_unit/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "proximity_monitor", (yield* g.new_(f, T("/datum/proximity_monitor"), [live(f.src), 1])));
	rt.setSv(f, "materials", (yield* g.new_(f, T("/datum/material_container"), [live(f.src), rt.list("$metal", "$glass", "$silver", "$gold", "$diamond", "$plasma", "$uranium", "$bananium", "$titanium", "$bluespace"), 9.999999848243207e+30])));
	rt.setSv(f, "files", (yield* g.new_(f, T("/datum/research/smelter"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/machinery/mineral/processing_unit/proc/Destroy  (code/modules/mining/machine_processing.dm:83)  may sleep
rt.def("/obj/machinery/mineral/processing_unit/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "CONSOLE", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "materials")]);
	rt.setSv(f, "materials", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "files")]);
	rt.setSv(f, "files", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/mineral/processing_unit/proc/HasProximity  (code/modules/mining/machine_processing.dm:88)  may sleep
rt.def("/obj/machinery/mineral/processing_unit/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (!(truthy((rt.istype(live(AM), T("/obj/item/weapon/ore")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(AM)), rt.getStep(f, live(f.src), rt.sv(f, "input_dir"))))) return f.dot;
	yield* g.srcCall(f, "process_ore", live(AM));
	return f.dot;
}, true);

// /obj/machinery/mineral/processing_unit/proc/process_ore  (code/modules/mining/machine_processing.dm:92)  may sleep
rt.def("/obj/machinery/mineral/processing_unit/proc/process_ore", function* process_ore(f: Frame, O: Value) {
	let material_amount: Value = null;
	f.vars = () => [O, material_amount];
	material_amount = (yield* g.callName(f, rt.sv(f, "materials"), "get_item_material_amount", [live(O)]));
	if (!truthy((yield* g.callName(f, rt.sv(f, "materials"), "has_space", [live(material_amount)])))) {
		yield* g.srcCall(f, "unload_mineral", live(O));
	} else {
		yield* g.callName(f, rt.sv(f, "materials"), "insert_item", [live(O)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		if (!truthy(rt.sv(f, "CONSOLE"))) return f.dot;
		yield* g.callName(f, rt.sv(f, "CONSOLE"), "updateUsrDialog", []);
	}
	return f.dot;
}, true);

// /obj/machinery/mineral/processing_unit/proc/get_machine_data  (code/modules/mining/machine_processing.dm:102)
rt.def("/obj/machinery/mineral/processing_unit/proc/get_machine_data", function get_machine_data(f: Frame) {
	let dat: Value = null, mat_id: Value = null, M: Value = null, v: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [dat, mat_id, M, v, D, $e];
	dat = "<b>Smelter control console</b><br><br>";
	mat_id = null;
	rt.forList(f, 0, rt.fv(f, "materials", rt.sv(f, "materials")));
	while (($e = rt.next(f, 0)) !== undefined) {
		mat_id = $e;
		dat = rt.modify(live(dat), fmt("<span class=\"res_name\">＀: </span>＀ cm&sup3;", [rt.gv(f, "name", (M = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), live(mat_id)))), rt.fv(f, "amount", live(M))]), add);
		if (isEqual(rt.sv(f, "selected_material"), live(mat_id))) {
			dat = rt.modify(live(dat), " <i>Smelting</i>", add);
		} else {
			dat = rt.modify(live(dat), fmt(" <A href='?src=＃;material=＀'><b>Not Smelting</b></A> ", [rt.sv(f, "CONSOLE"), live(mat_id)]), add);
		}
		dat = rt.modify(live(dat), "<br>", add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "<br><br>", add);
	dat = rt.modify(live(dat), "<b>Smelt Alloys</b><br>", add);
	v = null;
	rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		dat = rt.modify(live(dat), fmt("<span class=\"res_name\">＀ ", [rt.gv(f, "name", (D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v))))]), add);
		if (isEqual(rt.sv(f, "selected_alloy"), rt.fv(f, "id", live(D)))) {
			dat = rt.modify(live(dat), " <i>Smelting</i>", add);
		} else {
			dat = rt.modify(live(dat), fmt(" <A href='?src=＃;alloy=＀'><b>Not Smelting</b></A> ", [rt.sv(f, "CONSOLE"), rt.fv(f, "id", live(D))]), add);
		}
		dat = rt.modify(live(dat), "<br>", add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "<br><br>", add);
	dat = rt.modify(live(dat), "Machine is currently ", add);
	if (truthy(rt.sv(f, "on"))) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;set_on=off'>On</A> ", [rt.sv(f, "CONSOLE")]), add);
	} else {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;set_on=on'>Off</A> ", [rt.sv(f, "CONSOLE")]), add);
	}
	return live(dat);
});

// /obj/machinery/mineral/processing_unit/proc/process  (code/modules/mining/machine_processing.dm:137)  may sleep
rt.def("/obj/machinery/mineral/processing_unit/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "on"))) return f.dot;
	if (truthy(rt.sv(f, "selected_material"))) {
		yield* g.srcCall(f, "smelt_ore");
	} else {
		if (truthy(rt.sv(f, "selected_alloy"))) {
			yield* g.srcCall(f, "smelt_alloy");
		}
	}
	if (!truthy(rt.sv(f, "CONSOLE"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "CONSOLE"), "updateUsrDialog", []);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/mineral/processing_unit/proc/smelt_ore  (code/modules/mining/machine_processing.dm:168)  may sleep
rt.def("/obj/machinery/mineral/processing_unit/proc/smelt_ore", function* smelt_ore(f: Frame) {
	let mat: Value = null, sheets_to_remove: Value = null, out: Value = null;
	let $0: any;
	f.vars = () => [mat, sheets_to_remove, out, $0];
	if (!truthy((mat = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), rt.sv(f, "selected_material"))))) return f.dot;
	if (rt.ge(rt.fv(f, "amount", live(mat)), 20000)) {
		$0 = 10;
	} else {
		$0 = (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "amount", live(mat)), 2000)]));
	}
	if (!truthy((sheets_to_remove = $0))) {
		rt.setSv(f, "on", 0);
	} else {
		out = rt.getStep(f, live(f.src), rt.sv(f, "output_dir"));
		yield* g.callName(f, rt.sv(f, "materials"), "retrieve_sheets", [live(sheets_to_remove), rt.sv(f, "selected_material"), live(out)]);
	}
	return f.dot;
}, true);

// /obj/machinery/mineral/processing_unit/proc/smelt_alloy  (code/modules/mining/machine_processing.dm:179)  may sleep
rt.def("/obj/machinery/mineral/processing_unit/proc/smelt_alloy", function* smelt_alloy(f: Frame) {
	let alloy: Value = null, amount: Value = null;
	f.vars = () => [alloy, amount];
	if (!truthy((alloy = (yield* g.callName(f, rt.sv(f, "files"), "FindDesignByID", [rt.sv(f, "selected_alloy")]))))) {
		rt.setSv(f, "on", 0);
		return live(f.dot);
	}
	if (!truthy((amount = (yield* g.srcCall(f, "can_smelt", live(alloy)))))) {
		rt.setSv(f, "on", 0);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "materials"), "use_amount", [rt.fv(f, "materials", live(alloy)), live(amount)]);
	yield* g.srcCall(f, "generate_mineral", rt.fv(f, "build_path", live(alloy)));
	return f.dot;
}, true);

// /obj/machinery/mineral/processing_unit/proc/can_smelt  (code/modules/mining/machine_processing.dm:195)
rt.def("/obj/machinery/mineral/processing_unit/proc/can_smelt", function can_smelt(f: Frame, D: Value) {
	let build_amount: Value = null, mat_id: Value = null, M: Value = null, smelter_mat: Value = null;
	let $e: any;
	f.vars = () => [build_amount, mat_id, M, smelter_mat, $e];
	if (truthy(rt.getLen(f, rt.fv(f, "make_reagents", live(D))))) {
		return 0;
	}
	build_amount = 10;
	mat_id = null;
	rt.forList(f, 0, rt.fv(f, "materials", live(D)));
	while (($e = rt.next(f, 0)) !== undefined) {
		mat_id = $e;
		M = rt.index(rt.fv(f, "materials", live(D)), live(mat_id));
		smelter_mat = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), live(mat_id));
		if ((!truthy(live(M)) || !truthy(live(smelter_mat)))) {
			return 0;
		}
		build_amount = rt.call(f, P("/proc/min"), null, [live(build_amount), rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "amount", live(smelter_mat)), live(M))])]);
	}
	rt.endFor(f, 0);
	return live(build_amount);
});

// /obj/machinery/mineral/processing_unit/proc/generate_mineral  (code/modules/mining/machine_processing.dm:213)  may sleep
rt.def("/obj/machinery/mineral/processing_unit/proc/generate_mineral", function* generate_mineral(f: Frame, _P: Value) {
	let O: Value = null;
	f.vars = () => [_P, O];
	yield* g.srcCall(f, "unload_mineral", (O = (yield* g.new_(f, live(_P), [live(f.src)]))));
	return f.dot;
}, true);

// /obj/machinery/mineral/processing_unit/proc/on_deconstruction  (code/modules/mining/machine_processing.dm:217)  may sleep
rt.def("/obj/machinery/mineral/processing_unit/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* g.callName(f, rt.sv(f, "materials"), "retrieve_all", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
