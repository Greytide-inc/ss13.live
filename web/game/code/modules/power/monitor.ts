// From code/modules/power/monitor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10429, "/obj/machinery/computer/monitor", "/obj/machinery/computer", {
	attached: null,
	history: null,
	record_size: 60,
	record_interval: 50,
	next_record: 0,
	icon_screen: "power",
	icon_keyboard: "power_key",
	light_color: "#E1E17D",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/powermonitor"),
	name: "power monitoring console",
	desc: "It monitors power levels across the station.",
	use_power: 2,
	idle_power_usage: 20,
	active_power_usage: 100,
});

// /obj/machinery/computer/monitor/proc/<init>  (code/modules/power/monitor.dm:14)
rt.def("/obj/machinery/computer/monitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "history", rt.list());
	return f.dot;
});

// /obj/machinery/computer/monitor/proc/New  (code/modules/power/monitor.dm:20)  may sleep
rt.def("/obj/machinery/computer/monitor/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "search");
	rt.setAt(rt.sv(f, "history"), "supply", rt.list());
	rt.setAt(rt.sv(f, "history"), "demand", rt.list());
	return f.dot;
}, true);

// /obj/machinery/computer/monitor/proc/process  (code/modules/power/monitor.dm:26)
rt.def("/obj/machinery/computer/monitor/proc/process", function process(f: Frame) {
	if (!truthy(rt.sv(f, "attached"))) {
		rt.setSv(f, "use_power", 1);
		rt.callSrc(f, "search", []);
	} else {
		rt.setSv(f, "use_power", 2);
		rt.callSrc(f, "record", []);
	}
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/computer/monitor/proc/search  (code/modules/power/monitor.dm:34)
rt.def("/obj/machinery/computer/monitor/proc/search", function search(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.getStep(f, live(f.src), 0);
	rt.setSv(f, "attached", rt.locateIn(f, T("/obj/structure/cable"), live(_T)));
	return f.dot;
});

// /obj/machinery/computer/monitor/proc/record  (code/modules/power/monitor.dm:38)
rt.def("/obj/machinery/computer/monitor/proc/record", function record(f: Frame) {
	let supply: Value = null, demand: Value = null;
	f.vars = () => [supply, demand];
	if (!rt.ge(rt.worldTime(f), rt.sv(f, "next_record"))) return f.dot;
	rt.setSv(f, "next_record", add(rt.worldTime(f), rt.sv(f, "record_interval")));
	supply = rt.at(rt.sv(f, "history"), "supply");
	if (truthy(rt.fv(f, "powernet", rt.sv(f, "attached")))) {
		supply = rt.modify(live(supply), rt.gv(f, "viewavail", rt.fv(f, "powernet", rt.sv(f, "attached"))), add);
	}
	if (rt.gt(rt.len(f, live(supply)), rt.sv(f, "record_size"))) {
		rt.callName(f, live(supply), "Cut", [1, 2]);
	}
	demand = rt.at(rt.sv(f, "history"), "demand");
	if (truthy(rt.fv(f, "powernet", rt.sv(f, "attached")))) {
		demand = rt.modify(live(demand), rt.gv(f, "viewload", rt.fv(f, "powernet", rt.sv(f, "attached"))), add);
	}
	if (!rt.gt(rt.len(f, live(demand)), rt.sv(f, "record_size"))) return f.dot;
	rt.callName(f, live(demand), "Cut", [1, 2]);
	return f.dot;
});

// /obj/machinery/computer/monitor/proc/ui_interact  (code/modules/power/monitor.dm:55)  may sleep
rt.def("/obj/machinery/computer/monitor/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "power_monitor", rt.sv(f, "name"), 1200, 1000, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/monitor/proc/ui_data  (code/modules/power/monitor.dm:61)
rt.def("/obj/machinery/computer/monitor/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, term: Value = null, A: Value = null, cell_charge: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [data, term, A, cell_charge, $0, $1, $2, $e];
	rt.setAt((data = rt.list()), "stored", rt.sv(f, "record_size"));
	rt.setAt(live(data), "interval", divide(rt.sv(f, "record_interval"), 10));
	$0 = live(data);
	$1 = "attached";
	if (truthy(rt.sv(f, "attached"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "history", rt.sv(f, "history"));
	rt.setAt(live(data), "areas", rt.list());
	if (truthy(rt.sv(f, "attached"))) {
		rt.setAt(live(data), "supply", rt.gv(f, "viewavail", rt.fv(f, "powernet", rt.sv(f, "attached"))));
		rt.setAt(live(data), "demand", rt.gv(f, "viewload", rt.fv(f, "powernet", rt.sv(f, "attached"))));
		term = null;
		rt.forList(f, 0, rt.gv(f, "nodes", rt.fv(f, "powernet", rt.sv(f, "attached"))), T("/obj/machinery/power/terminal"));
		while (($e = rt.next(f, 0)) !== undefined) {
			term = $e;
			if (truthy((rt.istype((A = rt.fv(f, "master", live(term))), T("/obj/machinery/power/apc")) ? 1 : 0))) {
				cell_charge = null;
				if (!truthy(rt.fv(f, "cell", live(A)))) {
					cell_charge = 0;
				} else {
					cell_charge = rt.callName(f, rt.fv(f, "cell", live(A)), "percent", []);
				}
				rt.modAt(live(data), "areas", rt.list(rt.alist(f, ["name", rt.gv(f, "name", rt.fv(f, "area", live(A))), "charge", live(cell_charge), "load", rt.fv(f, "lastused_total", live(A)), "charging", rt.fv(f, "charging", live(A)), "eqp", rt.fv(f, "equipment", live(A)), "lgt", rt.fv(f, "lighting", live(A)), "env", rt.fv(f, "environ", live(A))])), add);
			}
		}
		rt.endFor(f, 0);
	}
	return live(data);
});
