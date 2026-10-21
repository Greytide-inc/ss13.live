// From code/modules/research/destructive_analyzer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10971, "/obj/machinery/r_n_d/destructive_analyzer", "/obj/machinery/r_n_d", {
	decon_mod: 0,
	name: "destructive analyzer",
	desc: "Learn science by destroying things!",
	icon_state: "d_analyzer",
});

// /obj/machinery/r_n_d/destructive_analyzer/proc/Initialize  (code/modules/research/destructive_analyzer.dm:17)  may sleep
rt.def("/obj/machinery/r_n_d/destructive_analyzer/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/destructive_analyzer"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6780, "/obj/item/weapon/circuitboard/machine/destructive_analyzer", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Destructive Analyzer (Machine Board)",
	build_path: rt.typePath("/obj/machinery/r_n_d/destructive_analyzer"),
	origin_tech: "magnets=2;engineering=2;programming=2",
});

// /obj/item/weapon/circuitboard/machine/destructive_analyzer/proc/<init>  (code/modules/research/destructive_analyzer.dm:25)
rt.def("/obj/item/weapon/circuitboard/machine/destructive_analyzer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/scanning_module"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1]));
	return f.dot;
});

// /obj/machinery/r_n_d/destructive_analyzer/proc/RefreshParts  (code/modules/research/destructive_analyzer.dm:32)
rt.def("/obj/machinery/r_n_d/destructive_analyzer/proc/RefreshParts", function RefreshParts(f: Frame) {
	let _T: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [_T, S, $e];
	_T = 0;
	S = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		_T = rt.modify(live(_T), rt.fv(f, "rating", live(S)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "decon_mod", live(_T));
	return f.dot;
});

// /obj/machinery/r_n_d/destructive_analyzer/proc/ConvertReqString2List  (code/modules/research/destructive_analyzer.dm:38)
rt.def("/obj/machinery/r_n_d/destructive_analyzer/proc/ConvertReqString2List", function ConvertReqString2List(f: Frame, source_list: Value) {
	let temp_list: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [temp_list, O, $e];
	temp_list = rt.call(f, P("/proc/params2list"), null, [live(source_list)]);
	O = null;
	rt.forList(f, 0, live(temp_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setAt(live(temp_list), live(O), rt.call(f, P("/proc/text2num"), null, [rt.index(live(temp_list), live(O))]));
	}
	rt.endFor(f, 0);
	return live(temp_list);
});

// /obj/machinery/r_n_d/destructive_analyzer/proc/disconnect_console  (code/modules/research/destructive_analyzer.dm:44)
rt.def("/obj/machinery/r_n_d/destructive_analyzer/proc/disconnect_console", function disconnect_console(f: Frame) {
	rt.setFv(f, "linked_destroy", rt.sv(f, "linked_console"), null);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/machinery/r_n_d/destructive_analyzer/proc/Insert_Item  (code/modules/research/destructive_analyzer.dm:48)  may sleep
rt.def("/obj/machinery/r_n_d/destructive_analyzer/proc/Insert_Item", function* Insert_Item(f: Frame, O: Value, user: Value) {
	let temp_tech: Value = null;
	f.vars = () => [O, user, temp_tech];
	if (isEqual(rt.fv(f, "a_intent", live(user)), "harm")) return f.dot;
	f.dot = 1;
	if (!truthy((yield* g.srcCall(f, "is_insertion_ready", live(user))))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "origin_tech", live(O)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This doesn't seem to have a tech origin!</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.getLen(f, (temp_tech = (yield* g.srcCall(f, "ConvertReqString2List", rt.fv(f, "origin_tech", live(O)))))), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You cannot deconstruct this item!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it in the ＀!</span>", [live(O), rt.fv(f, "name", live(f.src))])]);
		return live(f.dot);
	}
	rt.setSv(f, "busy", 1);
	rt.setSv(f, "loaded_item", live(O));
	yield* g.callName(f, live(O), "forceMove", [live(f.src)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You add the ＀ to the ＀!</span>", [rt.fv(f, "name", live(O)), rt.fv(f, "name", live(f.src))])]);
	yield* g.call(f, P("/proc/flick"), null, ["d_analyzer_la", live(f.src)]);
	rt.spawnTail(f, 10, "/obj/machinery/r_n_d/destructive_analyzer/proc/Insert_Item: spawn at modules/research/destructive_analyzer.dm:67", O, user, temp_tech);
	return f.dot;
}, true);

// a spawn(10) body of /obj/machinery/r_n_d/destructive_analyzer/proc/Insert_Item, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/r_n_d/destructive_analyzer/proc/Insert_Item: spawn at modules/research/destructive_analyzer.dm:67", function* (f: Frame, O: Value, user: Value, temp_tech: Value) {
	f.vars = () => [O, user, temp_tech];
	rt.setSv(f, "icon_state", "d_analyzer_l");
	rt.setSv(f, "busy", 0);
	return null;
});
