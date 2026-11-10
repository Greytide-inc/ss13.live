// Based on /tg/station's code/game/machinery/embedded_controller/airlock_controller.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// airlock_controller.dm:21
rt.def("/datum/computer/file/embedded_program/airlock_controller/proc/receive_signal", function receive_signal(f: Frame, signal: Value, receive_method: Value, receive_param: Value) {
	let receive_tag: Value = null;
	if (!(receive_tag = rt.index(signal.data, "tag"))) {
		return f.dot;
	}
	if (receive_tag == this.sensor_tag) {
		if (rt.index(signal.data, "pressure")) {
			this.sensor_pressure = text2num(rt.index(signal.data, "pressure"));
		}
	} else if (receive_tag == this.exterior_door_tag) {
		rt.setAt(this.memory, "exterior_status", rt.index(signal.data, "door_status"));
	} else if (receive_tag == this.interior_door_tag) {
		rt.setAt(this.memory, "interior_status", rt.index(signal.data, "door_status"));
	} else if (receive_tag == this.airpump_tag) {
		if (rt.index(signal.data, "power")) {
			rt.setAt(this.memory, "pump_status", rt.index(signal.data, "direction"));
		} else {
			rt.setAt(this.memory, "pump_status", "off");
		}
	} else {
		if (receive_tag != this.id_tag) return f.dot;
		if (rt.index(signal.data, "command") === "cycle") {
			if (this.state < 0) {
				this.target_state = 2;
			} else {
				this.target_state = -2;
			}
		}
	}
	return f.dot;
});

// airlock_controller.dm:49
rt.def("/datum/computer/file/embedded_program/airlock_controller/proc/receive_user_command", function receive_user_command(f: Frame, command: Value) {
	if (command === "cycle_closed") {
		this.target_state = 0;
	} else if (command === "cycle_exterior") {
		this.target_state = 2;
	} else if (command === "cycle_interior") {
		this.target_state = -2;
	} else if (command === "abort") {
		this.target_state = 0;
	}
	return f.dot;
});

// airlock_controller.dm:63
rt.def("/datum/computer/file/embedded_program/airlock_controller/proc/process", function* process(f: Frame) {
	let signal: Value = null, target_pressure: Value = null, signal_2: Value = null;
	let process_again: Value = 1;
	while (process_again) {
		process_again = 0;
		if (this.state === -2) {
			if (this.target_state > this.state) {
				if (rt.at(this.memory, "interior_status") == "closed") {
					this.state = 0;
					process_again = 1;
				} else {
					rt.setAt((signal = (yield* new_(T("/datum/signal")))).data, "tag", this.interior_door_tag);
					rt.setAt(signal.data, "command", "secure_close");
					yield* this.post_signal(signal);
				}
			} else if (rt.at(this.memory, "pump_status") != "off") {
				(signal = (yield* new_(T("/datum/signal")))).data = rt.alist(f, ["tag", this.airpump_tag, "power", 0, "sigtype", "command"]);
				yield* this.post_signal(signal);
			}
		} else if (this.state === -1) {
			if (this.target_state < this.state) {
				if (this.sensor_pressure >= 96.25874) {
					if (rt.at(this.memory, "interior_status") == "open") {
						this.state = -2;
						process_again = 1;
					} else {
						rt.setAt((signal = (yield* new_(T("/datum/signal")))).data, "tag", this.interior_door_tag);
						rt.setAt(signal.data, "command", "secure_open");
						yield* this.post_signal(signal);
					}
				} else {
					(signal = (yield* new_(T("/datum/signal")))).data = rt.alist(f, ["tag", this.airpump_tag, "sigtype", "command"]);
					if (rt.at(this.memory, "pump_status") == "siphon") {
						rt.setAt(signal.data, "stabalize", 1);
					} else if (rt.at(this.memory, "pump_status") != "release") {
						rt.setAt(signal.data, "power", 1);
					}
					yield* this.post_signal(signal);
				}
			} else if (this.target_state > this.state) {
				this.state = 0;
				process_again = 1;
			}
		} else if (this.state === 0) {
			if (this.target_state > this.state) {
				if (rt.at(this.memory, "interior_status") == "closed") {
					this.state = 1;
					process_again = 1;
				} else {
					rt.setAt((signal = (yield* new_(T("/datum/signal")))).data, "tag", this.interior_door_tag);
					rt.setAt(signal.data, "command", "secure_close");
					yield* this.post_signal(signal);
				}
			} else if (this.target_state < this.state) {
				if (rt.at(this.memory, "exterior_status") == "closed") {
					this.state = -1;
					process_again = 1;
				} else {
					rt.setAt((signal = (yield* new_(T("/datum/signal")))).data, "tag", this.exterior_door_tag);
					rt.setAt(signal.data, "command", "secure_close");
					yield* this.post_signal(signal);
				}
			} else if (rt.at(this.memory, "pump_status") != "off") {
				(signal = (yield* new_(T("/datum/signal")))).data = rt.alist(f, ["tag", this.airpump_tag, "power", 0, "sigtype", "command"]);
				yield* this.post_signal(signal);
			}
		} else if (this.state === 1) {
			target_pressure = 5.06625;
			if (this.sanitize_external) {
				target_pressure = 1.01325;
			}
			if (this.sensor_pressure <= target_pressure) {
				if (this.target_state > this.state) {
					if (rt.at(this.memory, "exterior_status") == "open") {
						this.state = 2;
					} else {
						rt.setAt((signal_2 = (yield* new_(T("/datum/signal")))).data, "tag", this.exterior_door_tag);
						rt.setAt(signal_2.data, "command", "secure_open");
						yield* this.post_signal(signal_2);
					}
				} else if (this.target_state < this.state) {
					this.state = 0;
					process_again = 1;
				}
			} else if (this.target_state < this.state && !this.sanitize_external) {
				this.state = 0;
				process_again = 1;
			} else {
				(signal_2 = (yield* new_(T("/datum/signal")))).transmission_method = 1;
				signal_2.data = rt.alist(f, ["tag", this.airpump_tag, "sigtype", "command"]);
				if (rt.at(this.memory, "pump_status") == "release") {
					rt.setAt(signal_2.data, "purge", 1);
				} else if (rt.at(this.memory, "pump_status") != "siphon") {
					rt.setAt(signal_2.data, "power", 1);
				}
				yield* this.post_signal(signal_2);
			}
		} else if (this.state === 2) {
			if (this.target_state < this.state) {
				if (rt.at(this.memory, "exterior_status") == "closed") {
					if (this.sanitize_external) {
						this.state = 1;
						process_again = 1;
					} else {
						this.state = 0;
						process_again = 1;
					}
				} else {
					rt.setAt((signal = (yield* new_(T("/datum/signal")))).data, "tag", this.exterior_door_tag);
					rt.setAt(signal.data, "command", "secure_close");
					yield* this.post_signal(signal);
				}
			} else if (rt.at(this.memory, "pump_status") != "off") {
				(signal = (yield* new_(T("/datum/signal")))).data = rt.alist(f, ["tag", this.airpump_tag, "power", 0, "sigtype", "command"]);
				yield* this.post_signal(signal);
			}
		}
	}
	rt.setAt(this.memory, "sensor_pressure", this.sensor_pressure);
	rt.setAt(this.memory, "processing", (this.state != this.target_state ? 1 : 0));
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

// airlock_controller.dm:223
rt.def("/obj/machinery/embedded_controller/radio/airlock_controller/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let new_prog: Value = null;
	yield* parent_proc();
	if (!mapload) {
		return f.dot;
	}
	(new_prog = (yield* new_(T("/datum/computer/file/embedded_program/airlock_controller")))).id_tag = this.id_tag;
	new_prog.exterior_door_tag = this.exterior_door_tag;
	new_prog.interior_door_tag = this.interior_door_tag;
	new_prog.airpump_tag = this.airpump_tag;
	new_prog.sensor_tag = this.sensor_tag;
	new_prog.sanitize_external = this.sanitize_external;
	new_prog.master = this;
	this.program = new_prog;
	return f.dot;
}, true);

// airlock_controller.dm:240
rt.def("/obj/machinery/embedded_controller/radio/airlock_controller/proc/update_icon", function update_icon(f: Frame) {
	if (this.on && this.program) {
		if (rt.index(this.program.memory, "processing")) {
			this.icon_state = "airlock_control_process";
		} else {
			this.icon_state = "airlock_control_standby";
		}
	} else {
		this.icon_state = "airlock_control_off";
	}
	return f.dot;
});

// airlock_controller.dm:253
rt.def("/obj/machinery/embedded_controller/radio/airlock_controller/proc/return_text", function return_text(f: Frame) {
	let state_options: Value = null, output: Value = null;
	let $0: any;
	let state: Value = 0;
	let sensor_pressure: Value = "----";
	let exterior_status: Value = "----";
	let interior_status: Value = "----";
	let pump_status: Value = "----";
	let current_status: Value = "Inactive<BR>&nbsp;";
	if (this.program) {
		state = this.program.state;
		if (rt.index(this.program.memory, "sensor_pressure")) {
			$0 = rt.index(this.program.memory, "sensor_pressure");
		} else {
			$0 = "----";
		}
		sensor_pressure = $0;
		if (rt.index(this.program.memory, "exterior_status")) {
			$0 = rt.index(this.program.memory, "exterior_status");
		} else {
			$0 = "----";
		}
		exterior_status = $0;
		if (rt.index(this.program.memory, "interior_status")) {
			$0 = rt.index(this.program.memory, "interior_status");
		} else {
			$0 = "----";
		}
		interior_status = $0;
		pump_status = rt.index(this.program.memory, "pump_status") ? rt.index(this.program.memory, "pump_status") : "----";
	}
	if (state === -2) {
		state_options = fmt("<A href='?src=＃;command=cycle_closed'>Close Interior Airlock</A><BR>\n<A href='?src=＃;command=cycle_exterior'>Cycle to Exterior Airlock</A><BR>", [this, this]);
		current_status = "Interior Airlock Open<BR><span class='good'>Chamber Pressurized</span>";
	} else if (state === -1) {
		state_options = fmt("<A href='?src=＃;command=abort'>Abort Cycling</A><BR>", [this]);
		current_status = "Cycling to Interior Airlock<BR><span class='average'>Chamber Pressurizing</span>";
	} else if (state === 0) {
		state_options = fmt("<A href='?src=＃;command=cycle_interior'>Open Interior Airlock</A><BR>\n<A href='?src=＃;command=cycle_exterior'>Open Exterior Airlock</A><BR>", [this, this]);
	} else if (state === 1) {
		state_options = fmt("<A href='?src=＃;command=abort'>Abort Cycling</A><BR>", [this]);
		current_status = "Cycling to Exterior Airlock<BR><span class='average'>Chamber Depressurizing</span>";
	} else if (state === 2) {
		state_options = fmt("<A href='?src=＃;command=cycle_interior'>Cycle to Interior Airlock</A><BR>\n<A href='?src=＃;command=cycle_closed'>Close Exterior Airlock</A><BR>", [this, this]);
		current_status = "Exterior Airlock Open<BR><span class='bad'>Chamber Depressurized</span>";
	}
	return (output = `<h3>Airlock Status</h3>\n<div class='statusDisplay'>\n<div class='line'><div class='statusLabel'>Current Status:</div><div class='statusValue'>${current_status}</div></div>\n<div class='line'>&nbsp;</div>\n<div class='line'><div class='statusLabel'>> Chamber Pressure:</div><div class='statusValue'>${sensor_pressure} kPa</div></div>\n<div class='line'><div class='statusLabel'>> Control Pump:</div><div class='statusValue'>${pump_status}</div></div>\n<div class='line'><div class='statusLabel'>> Interior Door:</div><div class='statusValue'>${interior_status}</div></div>\n<div class='line'><div class='statusLabel'>> Exterior Door:</div><div class='statusValue'>${exterior_status}</div></div>\n</div>\n${state_options}`);
});
