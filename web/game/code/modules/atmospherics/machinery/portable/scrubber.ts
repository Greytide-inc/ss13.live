// From code/modules/atmospherics/machinery/portable/scrubber.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10704, "/obj/machinery/portable_atmospherics/scrubber", "/obj/machinery/portable_atmospherics", {
	on: 0,
	volume_rate: 1000,
	scrubbing: null,
	volume: 1000,
	name: "portable air scrubber",
	icon_state: "pscrubber:0",
	density: 1,
});

// /obj/machinery/portable_atmospherics/scrubber/proc/Destroy  (code/modules/atmospherics/machinery/portable/scrubber.dm:13)  may sleep
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "assume_air", [rt.sv(f, "air_contents")]);
	yield* g.srcCall(f, "air_update_turf");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/portable_atmospherics/scrubber/proc/update_icon  (code/modules/atmospherics/machinery/portable/scrubber.dm:19)
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("pscrubber:＀", [rt.sv(f, "on")]));
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "holding"))) {
		rt.callSrc(f, "add_overlay", ["scrubber-open"]);
	}
	if (!truthy(rt.sv(f, "connected_port"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["scrubber-connector"]);
	return f.dot;
});

// /obj/machinery/portable_atmospherics/scrubber/proc/process_atmos  (code/modules/atmospherics/machinery/portable/scrubber.dm:28)  may sleep
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/process_atmos", function* process_atmos(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "holding"))) {
		yield* g.srcCall(f, "scrub", rt.fv(f, "air_contents", rt.sv(f, "holding")));
	} else {
		yield* g.srcCall(f, "scrub", (yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "return_air", [])));
	}
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/scrubber/proc/scrub  (code/modules/atmospherics/machinery/portable/scrubber.dm:39)  may sleep
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/scrub", function* scrub(f: Frame, mixture: Value) {
	let transfer_moles: Value = null, filtering: Value = null, filtered: Value = null, gas: Value = null;
	let $e: any;
	f.vars = () => [mixture, transfer_moles, filtering, filtered, gas, $e];
	transfer_moles = multiply((yield* g.call(f, P("/proc/min"), null, [1, divide(rt.sv(f, "volume_rate"), rt.fv(f, "volume", live(mixture)))])), (yield* g.callName(f, live(mixture), "total_moles", [])));
	filtering = (yield* g.callName(f, live(mixture), "remove", [live(transfer_moles)]));
	filtered = (yield* g.new_(f, T("/datum/gas_mixture"), []));
	if (!truthy(live(filtering))) {
		return live(f.dot);
	}
	rt.setFv(f, "temperature", live(filtered), rt.fv(f, "temperature", live(filtering)));
	gas = null;
	rt.forList(f, 0, rt.bitAnd(rt.fv(f, "gases", live(filtering)), rt.sv(f, "scrubbing")));
	while (($e = rt.next(f, 0)) !== undefined) {
		gas = $e;
		yield* g.callName(f, live(filtered), "add_gas", [live(gas)]);
		rt.setAt(rt.index(rt.fv(f, "gases", live(filtered)), live(gas)), 1, rt.index(rt.index(rt.fv(f, "gases", live(filtering)), live(gas)), 1));
		rt.setAt(rt.index(rt.fv(f, "gases", live(filtering)), live(gas)), 1, 0);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(filtering), "garbage_collect", []);
	yield* g.callName(f, rt.sv(f, "air_contents"), "merge", [live(filtered)]);
	yield* g.callName(f, live(mixture), "merge", [live(filtering)]);
	if (truthy(rt.sv(f, "holding"))) return f.dot;
	yield* g.srcCall(f, "air_update_turf");
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/scrubber/proc/emp_act  (code/modules/atmospherics/machinery/portable/scrubber.dm:59)  may sleep
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/emp_act", function* emp_act(f: Frame) {
	if (truthy((yield* g.srcCall(f, "is_operational")))) {
		if (truthy(rt.op(f, "Prob", [], [divide(50, live(f.args[0]))]))) {
			rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		}
		yield* g.srcCall(f, "update_icon");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/portable_atmospherics/scrubber/proc/ui_interact  (code/modules/atmospherics/machinery/portable/scrubber.dm:67)  may sleep
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
		state = rt.gl("physical_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "portable_scrubber", rt.sv(f, "name"), 420, 335, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/scrubber/proc/ui_data  (code/modules/atmospherics/machinery/portable/scrubber.dm:73)
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, $0, $1, $2];
	rt.setAt((data = rt.list()), "on", rt.sv(f, "on"));
	$0 = live(data);
	$1 = "connected";
	if (truthy(rt.sv(f, "connected_port"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "pressure";
	if (truthy(rt.callName(f, rt.sv(f, "air_contents"), "return_pressure", []))) {
		$2 = rt.callName(f, rt.sv(f, "air_contents"), "return_pressure", []);
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, rt.call(f, P("/proc/round"), null, [$2]));
	if (truthy(rt.sv(f, "holding"))) {
		rt.setAt(live(data), "holding", rt.list());
		rt.setAt(rt.at(live(data), "holding"), "name", rt.fv(f, "name", rt.sv(f, "holding")));
		rt.setAt(rt.at(live(data), "holding"), "pressure", rt.call(f, P("/proc/round"), null, [rt.callName(f, rt.fv(f, "air_contents", rt.sv(f, "holding")), "return_pressure", [])]));
	}
	return live(data);
});

// /obj/machinery/portable_atmospherics/scrubber/proc/ui_act  (code/modules/atmospherics/machinery/portable/scrubber.dm:85)  may sleep
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "power") {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "eject") {
		if (truthy(rt.sv(f, "holding"))) {
			rt.setFv(f, "loc", rt.sv(f, "holding"), rt.getStep(f, live(f.src), 0));
			rt.setSv(f, "holding", null);
			f.dot = 1;
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });

rt.type(10705, "/obj/machinery/portable_atmospherics/scrubber/huge", "/obj/machinery/portable_atmospherics/scrubber", {
	movable: 0,
	anchored: 1,
	volume_rate: 1500,
	volume: 50000,
	name: "huge air scrubber",
	icon_state: "scrubber:0",
	active_power_usage: 500,
	idle_power_usage: 10,
});

// /obj/machinery/portable_atmospherics/scrubber/huge/proc/update_icon  (code/modules/atmospherics/machinery/portable/scrubber.dm:114)
rt.def("/obj/machinery/portable_atmospherics/scrubber/huge/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("scrubber:＀", [rt.sv(f, "on")]));
	return f.dot;
});

// /obj/machinery/portable_atmospherics/scrubber/huge/proc/process_atmos  (code/modules/atmospherics/machinery/portable/scrubber.dm:117)  may sleep
rt.def("/obj/machinery/portable_atmospherics/scrubber/huge/proc/process_atmos", function* process_atmos(f: Frame) {
	let _T: Value = null, AT: Value = null;
	let $0: any, $e: any;
	f.vars = () => [_T, AT, $0, $e];
	if (((!truthy(rt.sv(f, "anchored")) && !truthy(rt.sv(f, "movable"))) || !truthy((yield* g.srcCall(f, "is_operational"))))) {
		rt.setSv(f, "on", 0);
		yield* g.srcCall(f, "update_icon");
	}
	if (truthy(rt.sv(f, "on"))) {
		$0 = 2;
	} else {
		$0 = 1;
	}
	rt.setSv(f, "use_power", $0);
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "holding"))) return f.dot;
	_T = rt.getStep(f, live(f.src), 0);
	AT = null;
	rt.forList(f, 0, (yield* g.callName(f, live(_T), "GetAtmosAdjacentTurfs", ["alldir", 1], rt.Args.Named)), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AT = $e;
		yield* g.srcCall(f, "scrub", (yield* g.callName(f, live(AT), "return_air", [])));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/scrubber/huge/proc/attackby  (code/modules/atmospherics/machinery/portable/scrubber.dm:131)  may sleep
rt.def("/obj/machinery/portable_atmospherics/scrubber/huge/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		if (!truthy(rt.sv(f, "movable"))) {
			rt.setSv(f, "on", 0);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user"] });
