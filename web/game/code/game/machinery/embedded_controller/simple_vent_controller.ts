// Based on /tg/station's code/game/machinery/embedded_controller/simple_vent_controller.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(1504, "/datum/computer/file/embedded_program/simple_vent_controller", "/datum/computer/file/embedded_program", {
	airpump_tag: null,
});

// simple_vent_controller.dm:6
rt.def("/datum/computer/file/embedded_program/simple_vent_controller/proc/receive_user_command", function* receive_user_command(f: Frame, command: Value) {
	let signal: Value = null;
	if (command === "vent_inactive") {
		(signal = (yield* new_(T("/datum/signal")))).data = rt.alist(f, ["tag", this.airpump_tag, "sigtype", "command"]);
		rt.setAt(signal.data, "power", 0);
		yield* this.post_signal(signal);
	} else if (command === "vent_pump") {
		(signal = (yield* new_(T("/datum/signal")))).data = rt.alist(f, ["tag", this.airpump_tag, "sigtype", "command"]);
		rt.setAt(signal.data, "stabalize", 1);
		rt.setAt(signal.data, "power", 1);
		yield* this.post_signal(signal);
	} else if (command === "vent_clear") {
		(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
		signal.data = rt.alist(f, ["tag", this.airpump_tag, "sigtype", "command"]);
		rt.setAt(signal.data, "purge", 1);
		rt.setAt(signal.data, "power", 1);
		yield* this.post_signal(signal);
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

// simple_vent_controller.dm:55
rt.def("/obj/machinery/embedded_controller/radio/simple_vent_controller/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let new_prog: Value = null;
	yield* parent_proc();
	if (!mapload) {
		return f.dot;
	}
	(new_prog = (yield* new_(T("/datum/computer/file/embedded_program/simple_vent_controller")))).airpump_tag = this.airpump_tag;
	new_prog.master = this;
	this.program = new_prog;
	return f.dot;
}, true);

// simple_vent_controller.dm:66
rt.def("/obj/machinery/embedded_controller/radio/simple_vent_controller/proc/update_icon", function update_icon(f: Frame) {
	if (this.on && this.program) {
		this.icon_state = "airlock_control_standby";
	} else {
		this.icon_state = "airlock_control_off";
	}
	return f.dot;
});

// simple_vent_controller.dm:74
rt.def("/obj/machinery/embedded_controller/radio/simple_vent_controller/proc/return_text", function return_text(f: Frame) {
	let output: Value = null;
	let state_options: Value = fmt("<A href='?src=＃;command=vent_inactive'>Deactivate Vent</A><BR>\n<A href='?src=＃;command=vent_pump'>Activate Vent / Pump</A><BR>\n<A href='?src=＃;command=vent_clear'>Activate Vent / Clear</A><BR>", [this, this, this]);
	return (output = `<B>Vent Control Console</B><HR>\n${state_options}<HR>`);
});
