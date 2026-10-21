// From code/game/machinery/embedded_controller/simple_vent_controller.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1504, "/datum/computer/file/embedded_program/simple_vent_controller", "/datum/computer/file/embedded_program", {
	airpump_tag: null,
});

// /datum/computer/file/embedded_program/simple_vent_controller/proc/receive_user_command  (code/game/machinery/embedded_controller/simple_vent_controller.dm:6)  may sleep
rt.def("/datum/computer/file/embedded_program/simple_vent_controller/proc/receive_user_command", function* receive_user_command(f: Frame, command: Value) {
	let signal: Value = null;
	let $0: any;
	f.vars = () => [command, signal, $0];
	$0 = live(command);
	if ($0 === "vent_inactive") {
		rt.setFv(f, "data", (signal = (yield* g.new_(f, T("/datum/signal"), []))), rt.alist(f, ["tag", rt.sv(f, "airpump_tag"), "sigtype", "command"]));
		rt.setAt(rt.fv(f, "data", live(signal)), "power", 0);
		yield* g.srcCall(f, "post_signal", live(signal));
	} else if ($0 === "vent_pump") {
		rt.setFv(f, "data", (signal = (yield* g.new_(f, T("/datum/signal"), []))), rt.alist(f, ["tag", rt.sv(f, "airpump_tag"), "sigtype", "command"]));
		rt.setAt(rt.fv(f, "data", live(signal)), "stabalize", 1);
		rt.setAt(rt.fv(f, "data", live(signal)), "power", 1);
		yield* g.srcCall(f, "post_signal", live(signal));
	} else if ($0 === "vent_clear") {
		rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
		rt.setFv(f, "data", live(signal), rt.alist(f, ["tag", rt.sv(f, "airpump_tag"), "sigtype", "command"]));
		rt.setAt(rt.fv(f, "data", live(signal)), "purge", 1);
		rt.setAt(rt.fv(f, "data", live(signal)), "power", 1);
		yield* g.srcCall(f, "post_signal", live(signal));
	}
	return f.dot;
}, true);

rt.type(10866, "/obj/machinery/embedded_controller/radio/simple_vent_controller", "/obj/machinery/embedded_controller/radio", {
	airpump_tag: null,
	frequency: 1229,
	power_channel: 3,
	icon: rt.rsc("icons/obj/airlock_machines.dmi"),
	icon_state: "airlock_control_standby",
	name: "vent controller",
	density: 0,
});

// /obj/machinery/embedded_controller/radio/simple_vent_controller/proc/Initialize  (code/game/machinery/embedded_controller/simple_vent_controller.dm:55)  may sleep
rt.def("/obj/machinery/embedded_controller/radio/simple_vent_controller/proc/Initialize", function* Initialize(f: Frame) {
	let new_prog: Value = null;
	f.vars = () => [new_prog];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	rt.setFv(f, "airpump_tag", (new_prog = (yield* g.new_(f, T("/datum/computer/file/embedded_program/simple_vent_controller"), []))), rt.sv(f, "airpump_tag"));
	rt.setFv(f, "master", live(new_prog), live(f.src));
	rt.setSv(f, "program", live(new_prog));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/embedded_controller/radio/simple_vent_controller/proc/update_icon  (code/game/machinery/embedded_controller/simple_vent_controller.dm:66)
rt.def("/obj/machinery/embedded_controller/radio/simple_vent_controller/proc/update_icon", function update_icon(f: Frame) {
	if ((truthy(rt.sv(f, "on")) && truthy(rt.sv(f, "program")))) {
		rt.setSv(f, "icon_state", "airlock_control_standby");
	} else {
		rt.setSv(f, "icon_state", "airlock_control_off");
	}
	return f.dot;
});

// /obj/machinery/embedded_controller/radio/simple_vent_controller/proc/return_text  (code/game/machinery/embedded_controller/simple_vent_controller.dm:74)
rt.def("/obj/machinery/embedded_controller/radio/simple_vent_controller/proc/return_text", function return_text(f: Frame) {
	let state_options: Value = null, output: Value = null;
	f.vars = () => [state_options, output];
	state_options = null;
	state_options = fmt("<A href='?src=＃;command=vent_inactive'>Deactivate Vent</A><BR>\n<A href='?src=＃;command=vent_pump'>Activate Vent / Pump</A><BR>\n<A href='?src=＃;command=vent_clear'>Activate Vent / Clear</A><BR>", [live(f.src), live(f.src), live(f.src)]);
	return (output = fmt("<B>Vent Control Console</B><HR>\n＀<HR>", [live(state_options)]));
});
