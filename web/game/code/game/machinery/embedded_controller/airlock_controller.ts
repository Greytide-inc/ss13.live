// From code/game/machinery/embedded_controller/airlock_controller.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1503, "/datum/computer/file/embedded_program/airlock_controller", "/datum/computer/file/embedded_program", {
	id_tag: null,
	exterior_door_tag: null,
	interior_door_tag: null,
	airpump_tag: null,
	sensor_tag: null,
	sanitize_external: null,
	target_state: 0,
	sensor_pressure: null,
	state: 0,
});

// /datum/computer/file/embedded_program/airlock_controller/proc/receive_signal  (code/game/machinery/embedded_controller/airlock_controller.dm:21)
rt.def("/datum/computer/file/embedded_program/airlock_controller/proc/receive_signal", function receive_signal(f: Frame, signal: Value, receive_method: Value, receive_param: Value) {
	let receive_tag: Value = null;
	let $0: any;
	f.vars = () => [receive_tag, $0];
	if (!truthy((receive_tag = rt.index(rt.fv(f, "data", live(signal)), "tag")))) {
		return live(f.dot);
	}
	if (isEqual(live(receive_tag), rt.sv(f, "sensor_tag"))) {
		if (truthy(rt.index(rt.fv(f, "data", live(signal)), "pressure"))) {
			rt.setSv(f, "sensor_pressure", rt.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "pressure")]));
		}
	} else {
		if (isEqual(live(receive_tag), rt.sv(f, "exterior_door_tag"))) {
			rt.setAt(rt.sv(f, "memory"), "exterior_status", rt.index(rt.fv(f, "data", live(signal)), "door_status"));
		} else {
			if (isEqual(live(receive_tag), rt.sv(f, "interior_door_tag"))) {
				rt.setAt(rt.sv(f, "memory"), "interior_status", rt.index(rt.fv(f, "data", live(signal)), "door_status"));
			} else {
				if (isEqual(live(receive_tag), rt.sv(f, "airpump_tag"))) {
					if (truthy(rt.index(rt.fv(f, "data", live(signal)), "power"))) {
						rt.setAt(rt.sv(f, "memory"), "pump_status", rt.index(rt.fv(f, "data", live(signal)), "direction"));
					} else {
						rt.setAt(rt.sv(f, "memory"), "pump_status", "off");
					}
				} else {
					if (!isEqual(live(receive_tag), rt.sv(f, "id_tag"))) return f.dot;
					$0 = rt.index(rt.fv(f, "data", live(signal)), "command");
					if ($0 === "cycle") {
						if (rt.lt(rt.sv(f, "state"), 0)) {
							rt.setSv(f, "target_state", 2);
						} else {
							rt.setSv(f, "target_state", -2);
						}
					}
				}
			}
		}
	}
	return f.dot;
});

// /datum/computer/file/embedded_program/airlock_controller/proc/receive_user_command  (code/game/machinery/embedded_controller/airlock_controller.dm:49)
rt.def("/datum/computer/file/embedded_program/airlock_controller/proc/receive_user_command", function receive_user_command(f: Frame, command: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(command);
	if ($0 === "cycle_closed") {
		rt.setSv(f, "target_state", 0);
	} else if ($0 === "cycle_exterior") {
		rt.setSv(f, "target_state", 2);
	} else if ($0 === "cycle_interior") {
		rt.setSv(f, "target_state", -2);
	} else if ($0 === "abort") {
		rt.setSv(f, "target_state", 0);
	}
	return f.dot;
});

// /datum/computer/file/embedded_program/airlock_controller/proc/process  (code/game/machinery/embedded_controller/airlock_controller.dm:63)  may sleep
rt.def("/datum/computer/file/embedded_program/airlock_controller/proc/process", function* process(f: Frame) {
	let process_again: Value = null, signal: Value = null, target_pressure: Value = null, signal_2: Value = null;
	let $0: any;
	f.vars = () => [process_again, signal, target_pressure, signal_2, $0];
	process_again = 1;
	while (truthy(live(process_again))) {
		process_again = 0;
		$0 = rt.sv(f, "state");
		if ($0 === -2) {
			if (rt.gt(rt.sv(f, "target_state"), rt.sv(f, "state"))) {
				if (isEqual(rt.at(rt.sv(f, "memory"), "interior_status"), "closed")) {
					rt.setSv(f, "state", 0);
					process_again = 1;
				} else {
					rt.setAt(rt.gv(f, "data", (signal = (yield* g.new_(f, T("/datum/signal"), [])))), "tag", rt.sv(f, "interior_door_tag"));
					rt.setAt(rt.fv(f, "data", live(signal)), "command", "secure_close");
					yield* g.srcCall(f, "post_signal", live(signal));
				}
			} else {
				if (!isEqual(rt.at(rt.sv(f, "memory"), "pump_status"), "off")) {
					rt.setFv(f, "data", (signal = (yield* g.new_(f, T("/datum/signal"), []))), rt.alist(f, ["tag", rt.sv(f, "airpump_tag"), "power", 0, "sigtype", "command"]));
					yield* g.srcCall(f, "post_signal", live(signal));
				}
			}
		} else if ($0 === -1) {
			if (rt.lt(rt.sv(f, "target_state"), rt.sv(f, "state"))) {
				if (rt.ge(rt.sv(f, "sensor_pressure"), 96.25874328613281)) {
					if (isEqual(rt.at(rt.sv(f, "memory"), "interior_status"), "open")) {
						rt.setSv(f, "state", -2);
						process_again = 1;
					} else {
						rt.setAt(rt.gv(f, "data", (signal = (yield* g.new_(f, T("/datum/signal"), [])))), "tag", rt.sv(f, "interior_door_tag"));
						rt.setAt(rt.fv(f, "data", live(signal)), "command", "secure_open");
						yield* g.srcCall(f, "post_signal", live(signal));
					}
				} else {
					rt.setFv(f, "data", (signal = (yield* g.new_(f, T("/datum/signal"), []))), rt.alist(f, ["tag", rt.sv(f, "airpump_tag"), "sigtype", "command"]));
					if (isEqual(rt.at(rt.sv(f, "memory"), "pump_status"), "siphon")) {
						rt.setAt(rt.fv(f, "data", live(signal)), "stabalize", 1);
					} else {
						if (!isEqual(rt.at(rt.sv(f, "memory"), "pump_status"), "release")) {
							rt.setAt(rt.fv(f, "data", live(signal)), "power", 1);
						}
					}
					yield* g.srcCall(f, "post_signal", live(signal));
				}
			} else {
				if (rt.gt(rt.sv(f, "target_state"), rt.sv(f, "state"))) {
					rt.setSv(f, "state", 0);
					process_again = 1;
				}
			}
		} else if ($0 === 0) {
			if (rt.gt(rt.sv(f, "target_state"), rt.sv(f, "state"))) {
				if (isEqual(rt.at(rt.sv(f, "memory"), "interior_status"), "closed")) {
					rt.setSv(f, "state", 1);
					process_again = 1;
				} else {
					rt.setAt(rt.gv(f, "data", (signal = (yield* g.new_(f, T("/datum/signal"), [])))), "tag", rt.sv(f, "interior_door_tag"));
					rt.setAt(rt.fv(f, "data", live(signal)), "command", "secure_close");
					yield* g.srcCall(f, "post_signal", live(signal));
				}
			} else {
				if (rt.lt(rt.sv(f, "target_state"), rt.sv(f, "state"))) {
					if (isEqual(rt.at(rt.sv(f, "memory"), "exterior_status"), "closed")) {
						rt.setSv(f, "state", -1);
						process_again = 1;
					} else {
						rt.setAt(rt.gv(f, "data", (signal = (yield* g.new_(f, T("/datum/signal"), [])))), "tag", rt.sv(f, "exterior_door_tag"));
						rt.setAt(rt.fv(f, "data", live(signal)), "command", "secure_close");
						yield* g.srcCall(f, "post_signal", live(signal));
					}
				} else {
					if (!isEqual(rt.at(rt.sv(f, "memory"), "pump_status"), "off")) {
						rt.setFv(f, "data", (signal = (yield* g.new_(f, T("/datum/signal"), []))), rt.alist(f, ["tag", rt.sv(f, "airpump_tag"), "power", 0, "sigtype", "command"]));
						yield* g.srcCall(f, "post_signal", live(signal));
					}
				}
			}
		} else if ($0 === 1) {
			target_pressure = 5.066249847412109;
			if (truthy(rt.sv(f, "sanitize_external"))) {
				target_pressure = 1.0132499933242798;
			}
			if (rt.le(rt.sv(f, "sensor_pressure"), live(target_pressure))) {
				if (rt.gt(rt.sv(f, "target_state"), rt.sv(f, "state"))) {
					if (isEqual(rt.at(rt.sv(f, "memory"), "exterior_status"), "open")) {
						rt.setSv(f, "state", 2);
					} else {
						rt.setAt(rt.gv(f, "data", (signal_2 = (yield* g.new_(f, T("/datum/signal"), [])))), "tag", rt.sv(f, "exterior_door_tag"));
						rt.setAt(rt.fv(f, "data", live(signal_2)), "command", "secure_open");
						yield* g.srcCall(f, "post_signal", live(signal_2));
					}
				} else {
					if (rt.lt(rt.sv(f, "target_state"), rt.sv(f, "state"))) {
						rt.setSv(f, "state", 0);
						process_again = 1;
					}
				}
			} else {
				if ((rt.lt(rt.sv(f, "target_state"), rt.sv(f, "state")) && !truthy(rt.sv(f, "sanitize_external")))) {
					rt.setSv(f, "state", 0);
					process_again = 1;
				} else {
					rt.setFv(f, "transmission_method", (signal_2 = (yield* g.new_(f, T("/datum/signal"), []))), 1);
					rt.setFv(f, "data", live(signal_2), rt.alist(f, ["tag", rt.sv(f, "airpump_tag"), "sigtype", "command"]));
					if (isEqual(rt.at(rt.sv(f, "memory"), "pump_status"), "release")) {
						rt.setAt(rt.fv(f, "data", live(signal_2)), "purge", 1);
					} else {
						if (!isEqual(rt.at(rt.sv(f, "memory"), "pump_status"), "siphon")) {
							rt.setAt(rt.fv(f, "data", live(signal_2)), "power", 1);
						}
					}
					yield* g.srcCall(f, "post_signal", live(signal_2));
				}
			}
		} else if ($0 === 2) {
			if (rt.lt(rt.sv(f, "target_state"), rt.sv(f, "state"))) {
				if (isEqual(rt.at(rt.sv(f, "memory"), "exterior_status"), "closed")) {
					if (truthy(rt.sv(f, "sanitize_external"))) {
						rt.setSv(f, "state", 1);
						process_again = 1;
					} else {
						rt.setSv(f, "state", 0);
						process_again = 1;
					}
				} else {
					rt.setAt(rt.gv(f, "data", (signal = (yield* g.new_(f, T("/datum/signal"), [])))), "tag", rt.sv(f, "exterior_door_tag"));
					rt.setAt(rt.fv(f, "data", live(signal)), "command", "secure_close");
					yield* g.srcCall(f, "post_signal", live(signal));
				}
			} else {
				if (!isEqual(rt.at(rt.sv(f, "memory"), "pump_status"), "off")) {
					rt.setFv(f, "data", (signal = (yield* g.new_(f, T("/datum/signal"), []))), rt.alist(f, ["tag", rt.sv(f, "airpump_tag"), "power", 0, "sigtype", "command"]));
					yield* g.srcCall(f, "post_signal", live(signal));
				}
			}
		}
	}
	rt.setAt(rt.sv(f, "memory"), "sensor_pressure", rt.sv(f, "sensor_pressure"));
	rt.setAt(rt.sv(f, "memory"), "processing", (!isEqual(rt.sv(f, "state"), rt.sv(f, "target_state")) ? 1 : 0));
	return 1;
}, true, { waitfor: false });

rt.type(10865, "/obj/machinery/embedded_controller/radio/airlock_controller", "/obj/machinery/embedded_controller/radio", {
	id_tag: null,
	exterior_door_tag: null,
	interior_door_tag: null,
	airpump_tag: null,
	sensor_tag: null,
	sanitize_external: null,
	power_channel: 3,
	icon: rt.rsc("icons/obj/airlock_machines.dmi"),
	icon_state: "airlock_control_standby",
	name: "airlock console",
	density: 0,
	frequency: 1449,
});

// /obj/machinery/embedded_controller/radio/airlock_controller/proc/Initialize  (code/game/machinery/embedded_controller/airlock_controller.dm:223)  may sleep
rt.def("/obj/machinery/embedded_controller/radio/airlock_controller/proc/Initialize", function* Initialize(f: Frame) {
	let new_prog: Value = null;
	f.vars = () => [new_prog];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	rt.setFv(f, "id_tag", (new_prog = (yield* g.new_(f, T("/datum/computer/file/embedded_program/airlock_controller"), []))), rt.sv(f, "id_tag"));
	rt.setFv(f, "exterior_door_tag", live(new_prog), rt.sv(f, "exterior_door_tag"));
	rt.setFv(f, "interior_door_tag", live(new_prog), rt.sv(f, "interior_door_tag"));
	rt.setFv(f, "airpump_tag", live(new_prog), rt.sv(f, "airpump_tag"));
	rt.setFv(f, "sensor_tag", live(new_prog), rt.sv(f, "sensor_tag"));
	rt.setFv(f, "sanitize_external", live(new_prog), rt.sv(f, "sanitize_external"));
	rt.setFv(f, "master", live(new_prog), live(f.src));
	rt.setSv(f, "program", live(new_prog));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/embedded_controller/radio/airlock_controller/proc/update_icon  (code/game/machinery/embedded_controller/airlock_controller.dm:240)
rt.def("/obj/machinery/embedded_controller/radio/airlock_controller/proc/update_icon", function update_icon(f: Frame) {
	if ((truthy(rt.sv(f, "on")) && truthy(rt.sv(f, "program")))) {
		if (truthy(rt.index(rt.fv(f, "memory", rt.sv(f, "program")), "processing"))) {
			rt.setSv(f, "icon_state", "airlock_control_process");
		} else {
			rt.setSv(f, "icon_state", "airlock_control_standby");
		}
	} else {
		rt.setSv(f, "icon_state", "airlock_control_off");
	}
	return f.dot;
});

// /obj/machinery/embedded_controller/radio/airlock_controller/proc/return_text  (code/game/machinery/embedded_controller/airlock_controller.dm:253)
rt.def("/obj/machinery/embedded_controller/radio/airlock_controller/proc/return_text", function return_text(f: Frame) {
	let state_options: Value = null, state: Value = null, sensor_pressure: Value = null, exterior_status: Value = null, interior_status: Value = null, pump_status: Value = null, current_status: Value = null, output: Value = null;
	let $0: any;
	f.vars = () => [state_options, state, sensor_pressure, exterior_status, interior_status, pump_status, current_status, output, $0];
	state_options = null;
	state = 0;
	sensor_pressure = "----";
	exterior_status = "----";
	interior_status = "----";
	pump_status = "----";
	current_status = "Inactive<BR>&nbsp;";
	if (truthy(rt.sv(f, "program"))) {
		state = rt.fv(f, "state", rt.sv(f, "program"));
		if (truthy(rt.index(rt.fv(f, "memory", rt.sv(f, "program")), "sensor_pressure"))) {
			$0 = rt.index(rt.fv(f, "memory", rt.sv(f, "program")), "sensor_pressure");
		} else {
			$0 = "----";
		}
		sensor_pressure = $0;
		if (truthy(rt.index(rt.fv(f, "memory", rt.sv(f, "program")), "exterior_status"))) {
			$0 = rt.index(rt.fv(f, "memory", rt.sv(f, "program")), "exterior_status");
		} else {
			$0 = "----";
		}
		exterior_status = $0;
		if (truthy(rt.index(rt.fv(f, "memory", rt.sv(f, "program")), "interior_status"))) {
			$0 = rt.index(rt.fv(f, "memory", rt.sv(f, "program")), "interior_status");
		} else {
			$0 = "----";
		}
		interior_status = $0;
		if (truthy(rt.index(rt.fv(f, "memory", rt.sv(f, "program")), "pump_status"))) {
			$0 = rt.index(rt.fv(f, "memory", rt.sv(f, "program")), "pump_status");
		} else {
			$0 = "----";
		}
		pump_status = $0;
	}
	$0 = live(state);
	if ($0 === -2) {
		state_options = fmt("<A href='?src=＃;command=cycle_closed'>Close Interior Airlock</A><BR>\n<A href='?src=＃;command=cycle_exterior'>Cycle to Exterior Airlock</A><BR>", [live(f.src), live(f.src)]);
		current_status = "Interior Airlock Open<BR><span class='good'>Chamber Pressurized</span>";
	} else if ($0 === -1) {
		state_options = fmt("<A href='?src=＃;command=abort'>Abort Cycling</A><BR>", [live(f.src)]);
		current_status = "Cycling to Interior Airlock<BR><span class='average'>Chamber Pressurizing</span>";
	} else if ($0 === 0) {
		state_options = fmt("<A href='?src=＃;command=cycle_interior'>Open Interior Airlock</A><BR>\n<A href='?src=＃;command=cycle_exterior'>Open Exterior Airlock</A><BR>", [live(f.src), live(f.src)]);
	} else if ($0 === 1) {
		state_options = fmt("<A href='?src=＃;command=abort'>Abort Cycling</A><BR>", [live(f.src)]);
		current_status = "Cycling to Exterior Airlock<BR><span class='average'>Chamber Depressurizing</span>";
	} else if ($0 === 2) {
		state_options = fmt("<A href='?src=＃;command=cycle_interior'>Cycle to Interior Airlock</A><BR>\n<A href='?src=＃;command=cycle_closed'>Close Exterior Airlock</A><BR>", [live(f.src), live(f.src)]);
		current_status = "Exterior Airlock Open<BR><span class='bad'>Chamber Depressurized</span>";
	}
	return (output = fmt("<h3>Airlock Status</h3>\n<div class='statusDisplay'>\n<div class='line'><div class='statusLabel'>Current Status:</div><div class='statusValue'>＀</div></div>\n<div class='line'>&nbsp;</div>\n<div class='line'><div class='statusLabel'>> Chamber Pressure:</div><div class='statusValue'>＀ kPa</div></div>\n<div class='line'><div class='statusLabel'>> Control Pump:</div><div class='statusValue'>＀</div></div>\n<div class='line'><div class='statusLabel'>> Interior Door:</div><div class='statusValue'>＀</div></div>\n<div class='line'><div class='statusLabel'>> Exterior Door:</div><div class='statusValue'>＀</div></div>\n</div>\n＀", [live(current_status), live(sensor_pressure), live(pump_status), live(interior_status), live(exterior_status), live(state_options)]));
	return f.dot;
});
