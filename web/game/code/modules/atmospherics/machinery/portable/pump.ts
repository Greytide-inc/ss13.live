// From code/modules/atmospherics/machinery/portable/pump.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10703, "/obj/machinery/portable_atmospherics/pump", "/obj/machinery/portable_atmospherics", {
	on: 0,
	direction: "out",
	pump: null,
	volume: 1000,
	name: "portable air pump",
	icon_state: "psiphon:0",
	density: 1,
});

// /obj/machinery/portable_atmospherics/pump/proc/Initialize  (code/modules/atmospherics/machinery/portable/pump.dm:19)  may sleep
rt.def("/obj/machinery/portable_atmospherics/pump/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pump", (yield* g.new_(f, T("/obj/machinery/atmospherics/components/binary/pump"), [live(f.src), 0])));
	rt.setFv(f, "on", rt.sv(f, "pump"), 1);
	rt.setFv(f, "stat", rt.sv(f, "pump"), 0);
	yield* g.callName(f, rt.sv(f, "pump"), "build_network", []);
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/pump/proc/Destroy  (code/modules/atmospherics/machinery/portable/pump.dm:26)  may sleep
rt.def("/obj/machinery/portable_atmospherics/pump/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "assume_air", [rt.sv(f, "air_contents")]);
	yield* g.srcCall(f, "air_update_turf");
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "pump")]);
	rt.setSv(f, "pump", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/portable_atmospherics/pump/proc/update_icon  (code/modules/atmospherics/machinery/portable/pump.dm:34)
rt.def("/obj/machinery/portable_atmospherics/pump/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("psiphon:＀", [rt.sv(f, "on")]));
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "holding"))) {
		rt.callSrc(f, "add_overlay", ["siphon-open"]);
	}
	if (!truthy(rt.sv(f, "connected_port"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["siphon-connector"]);
	return f.dot;
});

// /obj/machinery/portable_atmospherics/pump/proc/process_atmos  (code/modules/atmospherics/machinery/portable/pump.dm:43)  may sleep
rt.def("/obj/machinery/portable_atmospherics/pump/proc/process_atmos", function* process_atmos(f: Frame) {
	let _T: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [_T, $0, $1, $2];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "on"))) {
		rt.setAt(rt.fv(f, "airs", rt.sv(f, "pump")), 1, null);
		rt.setAt(rt.fv(f, "airs", rt.sv(f, "pump")), 2, null);
		return live(f.dot);
	}
	_T = rt.getStep(f, live(f.src), 0);
	if (isEqual(rt.sv(f, "direction"), "out")) {
		$0 = rt.fv(f, "airs", rt.sv(f, "pump"));
		$1 = 1;
		if (truthy(rt.sv(f, "holding"))) {
			$2 = rt.fv(f, "air_contents", rt.sv(f, "holding"));
		} else {
			$2 = rt.sv(f, "air_contents");
		}
		rt.setAt($0, $1, $2);
		$0 = rt.fv(f, "airs", rt.sv(f, "pump"));
		$1 = 2;
		if (truthy(rt.sv(f, "holding"))) {
			$2 = rt.sv(f, "air_contents");
		} else {
			$2 = (yield* g.callName(f, live(_T), "return_air", []));
		}
		rt.setAt($0, $1, $2);
	} else {
		$0 = rt.fv(f, "airs", rt.sv(f, "pump"));
		$1 = 1;
		if (truthy(rt.sv(f, "holding"))) {
			$2 = rt.sv(f, "air_contents");
		} else {
			$2 = (yield* g.callName(f, live(_T), "return_air", []));
		}
		rt.setAt($0, $1, $2);
		$0 = rt.fv(f, "airs", rt.sv(f, "pump"));
		$1 = 2;
		if (truthy(rt.sv(f, "holding"))) {
			$2 = rt.fv(f, "air_contents", rt.sv(f, "holding"));
		} else {
			$2 = rt.sv(f, "air_contents");
		}
		rt.setAt($0, $1, $2);
	}
	yield* g.callName(f, rt.sv(f, "pump"), "process_atmos", []);
	if (truthy(rt.sv(f, "holding"))) return f.dot;
	yield* g.srcCall(f, "air_update_turf");
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/pump/proc/emp_act  (code/modules/atmospherics/machinery/portable/pump.dm:62)  may sleep
rt.def("/obj/machinery/portable_atmospherics/pump/proc/emp_act", function* emp_act(f: Frame) {
	if (truthy((yield* g.srcCall(f, "is_operational")))) {
		if (truthy(rt.op(f, "Prob", [], [divide(50, live(f.args[0]))]))) {
			rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		}
		if (truthy(rt.op(f, "Prob", [], [divide(100, live(f.args[0]))]))) {
			rt.setSv(f, "direction", "out");
		}
		rt.setFv(f, "target_pressure", rt.sv(f, "pump"), (yield* g.call(f, P("/proc/rand"), null, [0, 10132.5])));
		yield* g.srcCall(f, "update_icon");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/portable_atmospherics/pump/proc/ui_interact  (code/modules/atmospherics/machinery/portable/pump.dm:74)  may sleep
rt.def("/obj/machinery/portable_atmospherics/pump/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "portable_pump", rt.sv(f, "name"), 420, 415, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/pump/proc/ui_data  (code/modules/atmospherics/machinery/portable/pump.dm:80)
rt.def("/obj/machinery/portable_atmospherics/pump/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, $0, $1, $2];
	rt.setAt((data = rt.list()), "on", rt.sv(f, "on"));
	rt.setAt(live(data), "direction", rt.sv(f, "direction"));
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
	$0 = live(data);
	$1 = "target_pressure";
	if (truthy(rt.fv(f, "target_pressure", rt.sv(f, "pump")))) {
		$2 = rt.fv(f, "target_pressure", rt.sv(f, "pump"));
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, rt.call(f, P("/proc/round"), null, [$2]));
	rt.setAt(live(data), "default_pressure", rt.call(f, P("/proc/round"), null, [101.32499694824219]));
	rt.setAt(live(data), "min_pressure", rt.call(f, P("/proc/round"), null, [10.132499694824219]));
	rt.setAt(live(data), "max_pressure", rt.call(f, P("/proc/round"), null, [1013.25]));
	if (truthy(rt.sv(f, "holding"))) {
		rt.setAt(live(data), "holding", rt.list());
		rt.setAt(rt.at(live(data), "holding"), "name", rt.fv(f, "name", rt.sv(f, "holding")));
		rt.setAt(rt.at(live(data), "holding"), "pressure", rt.call(f, P("/proc/round"), null, [rt.callName(f, rt.fv(f, "air_contents", rt.sv(f, "holding")), "return_pressure", [])]));
	}
	return live(data);
});

// /obj/machinery/portable_atmospherics/pump/proc/ui_act  (code/modules/atmospherics/machinery/portable/pump.dm:97)  may sleep
rt.def("/obj/machinery/portable_atmospherics/pump/proc/ui_act", function* ui_act(f: Frame) {
	let plasma: Value = null, n2o: Value = null, A: Value = null, pressure: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [plasma, n2o, A, pressure, $0, $1, $2, $3];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "power") {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		if ((truthy(rt.sv(f, "on")) && !truthy(rt.sv(f, "holding")))) {
			plasma = rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "plasma");
			if ((truthy((n2o = rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "n2o"))) || truthy(live(plasma)))) {
				A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
				$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]);
				if (truthy(live(n2o))) {
					$1 = "N2O";
				} else {
					$1 = "";
				}
				if ((truthy(live(n2o)) && truthy(live(plasma)))) {
					$2 = " & ";
				} else {
					$2 = "";
				}
				if (truthy(live(plasma))) {
					$3 = "Plasma";
				} else {
					$3 = "";
				}
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ turned on a pump that contains ＀＀＀ at ＀＀", [$0, $1, $2, $3, live(A), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
				$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]));
				if (truthy(live(n2o))) {
					$1 = "N2O";
				} else {
					$1 = "";
				}
				if ((truthy(live(n2o)) && truthy(live(plasma)))) {
					$2 = " & ";
				} else {
					$2 = "";
				}
				if (truthy(live(plasma))) {
					$3 = "Plasma";
				} else {
					$3 = "";
				}
				yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ turned on a pump that contains ＀＀＀ at ＀＀", [$0, $1, $2, $3, live(A), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
			}
		}
		f.dot = 1;
	} else if ($0 === "direction") {
		if (isEqual(rt.sv(f, "direction"), "out")) {
			rt.setSv(f, "direction", "in");
		} else {
			rt.setSv(f, "direction", "out");
		}
		f.dot = 1;
	} else if ($0 === "pressure") {
		if (isEqual((pressure = rt.at(live(f.args[1]), "pressure")), "reset")) {
			pressure = 101.32499694824219;
			f.dot = 1;
		} else {
			if (isEqual(live(pressure), "min")) {
				pressure = 10.132499694824219;
				f.dot = 1;
			} else {
				if (isEqual(live(pressure), "max")) {
					pressure = 1013.25;
					f.dot = 1;
				} else {
					if (isEqual(live(pressure), "input")) {
						if (((pressure = (yield* g.op(f, "Prompt", [33], [null, rt.fv(f, "target_pressure", rt.sv(f, "pump")), rt.sv(f, "name"), fmt("New release pressure (＀-＀ kPa):", [10.132499694824219, 1013.25]), null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
							f.dot = 1;
						}
					} else {
						if ((yield* g.call(f, P("/proc/text2num"), null, [live(pressure)])) !== null) {
							pressure = (yield* g.call(f, P("/proc/text2num"), null, [live(pressure)]));
							f.dot = 1;
						}
					}
				}
			}
		}
		if (truthy(live(f.dot))) {
			rt.setFv(f, "target_pressure", rt.sv(f, "pump"), (yield* g.call(f, P("/proc/max"), null, [10.132499694824219, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [live(pressure)])), 1013.25]))])));
			yield* g.srcCall(f, "investigate_log", fmt("was set to ＀ kPa by ＀.", [rt.fv(f, "target_pressure", rt.sv(f, "pump")), (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
		}
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
