// From code/modules/mining/machine_stacking.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10932, "/obj/machinery/mineral/stacking_unit_console", "/obj/machinery/mineral", {
	machine: null,
	machinedir: 6,
	anchored: 1,
	speed_process: 1,
	name: "stacking machine console",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "console",
	density: 0,
});

// /obj/machinery/mineral/stacking_unit_console/proc/Initialize  (code/modules/mining/machine_stacking.dm:14)  may sleep
rt.def("/obj/machinery/mineral/stacking_unit_console/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "machine", rt.locateIn(f, T("/obj/machinery/mineral/stacking_machine"), rt.getStep(f, live(f.src), rt.sv(f, "machinedir"))));
	if (truthy(rt.sv(f, "machine"))) {
		rt.setFv(f, "CONSOLE", rt.sv(f, "machine"), live(f.src));
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/machinery/mineral/stacking_unit_console/proc/attack_hand  (code/modules/mining/machine_stacking.dm:26)
rt.def("/obj/machinery/mineral/stacking_unit_console/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	let s: Value = null, dat: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [s, dat, O, $e];
	s = null;
	dat = null;
	dat = rt.modify(live(dat), "<b>Stacking unit console</b><br><br>", add);
	O = null;
	rt.forList(f, 0, rt.fv(f, "stack_list", rt.sv(f, "machine")));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (rt.gt(rt.gv(f, "amount", (s = rt.index(rt.fv(f, "stack_list", rt.sv(f, "machine")), live(O)))), 0)) {
			dat = rt.modify(live(dat), fmt("＀: ＀ <A href='?src=＃;release=＀'>Release</A><br>", [rt.call(f, P("/proc/capitalize"), null, [rt.fv(f, "name", live(s))]), rt.fv(f, "amount", live(s)), live(f.src), rt.fv(f, "type", live(s))]), add);
		}
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), fmt("<br>Stacking: ＀<br><br>", [rt.fv(f, "stack_amt", rt.sv(f, "machine"))]), add);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=console_stacking_machine"], false);
	return live(f.dot);
});

// /obj/machinery/mineral/stacking_unit_console/proc/Topic  (code/modules/mining/machine_stacking.dm:40)  may sleep
rt.def("/obj/machinery/mineral/stacking_unit_console/proc/Topic", function* Topic(f: Frame) {
	let inp: Value = null, out: Value = null;
	f.vars = () => [inp, out];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	if (truthy(rt.at(live(f.args[1]), "release"))) {
		if (!truthy((rt.isIn(f, (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "release")])), rt.fv(f, "stack_list", rt.sv(f, "machine"))) ? 1 : 0))) {
			return live(f.dot);
		}
		inp = rt.index(rt.fv(f, "stack_list", rt.sv(f, "machine")), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "release")])));
		rt.setFv(f, "amount", (out = (yield* g.new_(f, rt.fv(f, "type", live(inp)), []))), rt.fv(f, "amount", live(inp)));
		rt.setFv(f, "amount", live(inp), 0);
		yield* g.callName(f, rt.sv(f, "machine"), "unload_mineral", [live(out)]);
	}
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

rt.type(10933, "/obj/machinery/mineral/stacking_machine", "/obj/machinery/mineral", {
	CONSOLE: null,
	stk_types: null,
	stk_amt: null,
	stack_list: null,
	stack_amt: 50,
	anchored: 1,
	input_dir: 4,
	output_dir: 8,
	name: "stacking machine",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "stacker",
	density: 1,
});

// /obj/machinery/mineral/stacking_machine/proc/<init>  (code/modules/mining/machine_stacking.dm:66)
rt.def("/obj/machinery/mineral/stacking_machine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stk_types", rt.list());
	$0 = $0;
	rt.setSv(f, "stk_amt", rt.list());
	$0 = $0;
	rt.setSv(f, "stack_list", rt.op(f, "CreateMultidimensionalList", [1], [0]));
	return f.dot;
});

// /obj/machinery/mineral/stacking_machine/proc/Initialize  (code/modules/mining/machine_stacking.dm:74)  may sleep
rt.def("/obj/machinery/mineral/stacking_machine/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "proximity_monitor", (yield* g.new_(f, T("/datum/proximity_monitor"), [live(f.src), 1])));
	return f.dot;
}, true);

// /obj/machinery/mineral/stacking_machine/proc/HasProximity  (code/modules/mining/machine_stacking.dm:78)  may sleep
rt.def("/obj/machinery/mineral/stacking_machine/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (!(truthy((rt.istype(live(AM), T("/obj/item/stack/sheet")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(AM)), rt.getStep(f, live(f.src), rt.sv(f, "input_dir"))))) return f.dot;
	yield* g.srcCall(f, "process_sheet", live(AM));
	return f.dot;
}, true);

// /obj/machinery/mineral/stacking_machine/proc/process_sheet  (code/modules/mining/machine_stacking.dm:82)  may sleep
rt.def("/obj/machinery/mineral/stacking_machine/proc/process_sheet", function* process_sheet(f: Frame, inp: Value) {
	let s: Value = null, storage: Value = null, out: Value = null;
	f.vars = () => [inp, s, storage, out];
	if (!truthy((rt.isIn(f, rt.fv(f, "type", live(inp)), rt.sv(f, "stack_list")) ? 1 : 0))) {
		rt.setFv(f, "amount", (s = (yield* g.new_(f, rt.fv(f, "type", live(inp)), [live(f.src), 0]))), 0);
		rt.setAt(rt.sv(f, "stack_list"), rt.fv(f, "type", live(inp)), live(s));
	}
	rt.modField(f, (storage = rt.index(rt.sv(f, "stack_list"), rt.fv(f, "type", live(inp)))), "amount", rt.fv(f, "amount", live(inp)), add);
	rt.setFv(f, "loc", live(inp), null);
	while (rt.gt(rt.fv(f, "amount", live(storage)), rt.sv(f, "stack_amt"))) {
		rt.setFv(f, "amount", (out = (yield* g.new_(f, rt.fv(f, "type", live(inp)), []))), rt.sv(f, "stack_amt"));
		yield* g.srcCall(f, "unload_mineral", live(out));
		(rt.modField(f, live(storage), "amount", rt.sv(f, "stack_amt"), subtract));
	}
	return f.dot;
}, true);
