// Based on /tg/station's code/game/machinery/computer/atmos_control.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add } = rt;


rt.type(10858, "/obj/machinery/air_sensor", "/obj/machinery", {
	on: 1,
	id_tag: null,
	frequency: 1441,
	radio_connection: null,
	anchored: 1,
	name: "gas sensor",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "gsensor1",
});

// atmos_control.dm:18
rt.def("/obj/machinery/air_sensor/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `gsensor${this.on}`;
	return f.dot;
});

// atmos_control.dm:22
rt.def("/obj/machinery/air_sensor/proc/process_atmos", function* process_atmos(f: Frame) {
	let total_moles: Value = null, gas_id: Value = null, gas_name: Value = null;
	if (!this.on) return f.dot;
	let signal: Value = (yield* new_(T("/datum/signal")));
	let air_sample: Value = this.return_air();
	signal.transmission_method = 1;
	signal.data = rt.alist(f, ["sigtype", "status", "id_tag", this.id_tag, "timestamp", rt.worldTime(f), "pressure", air_sample.return_pressure(), "temperature", air_sample.temperature, "gases", list()]);
	if (total_moles = air_sample.total_moles()) {
		for (gas_id of each(air_sample.gases)) {
			gas_name = rt.index(rt.index(rt.index(air_sample.gases, gas_id), 3), 2);
			rt.setAt(rt.index(signal.data, "gases"), gas_name, rt.index(rt.index(air_sample.gases, gas_id), 1) / total_moles * 100);
		}
	}
	yield* this.radio_connection.post_signal(this, signal, { filter: GLOB.RADIO_ATMOSIA });
	return f.dot;
}, true);

// atmos_control.dm:44
rt.def("/obj/machinery/air_sensor/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency, GLOB.RADIO_ATMOSIA);
	return f.dot;
}, true);

// atmos_control.dm:49
rt.def("/obj/machinery/air_sensor/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	GLOB.SSair.atmos_machinery += this;
	yield* this.set_frequency(this.frequency);
	return f.dot;
}, true);

// atmos_control.dm:54
rt.def("/obj/machinery/air_sensor/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSair.atmos_machinery -= this;
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);

rt.type(10368, "/obj/machinery/computer/atmos_control", "/obj/machinery/computer", {
	frequency: 1441,
	sensors: null,
	sensor_information: null,
	radio_connection: null,
	light_color: "#7DE1E1",
	name: "Atmospherics Monitoring",
	desc: "Used to monitor the station's atmospherics sensors.",
	icon_screen: "tank",
	icon_keyboard: "atmos_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/atmos_control"),
});

// atmos_control.dm:71
rt.def("/obj/machinery/computer/atmos_control/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.sensors = rt.alist(f, ["n2_sensor", "Nitrogen Tank", "o2_sensor", "Oxygen Tank", "co2_sensor", "Carbon Dioxide Tank", "tox_sensor", "Plasma Tank", "n2o_sensor", "Nitrous Oxide Tank", "air_sensor", "Mixed Air Tank", "mix_sensor", "Mix Tank", "distro_meter", "Distribution Loop", "waste_meter", "Waste Loop"]);

	this.sensor_information = list();
	return f.dot;
});

// atmos_control.dm:88
rt.def("/obj/machinery/computer/atmos_control/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.set_frequency(this.frequency);
	return f.dot;
}, true);

// atmos_control.dm:93
rt.def("/obj/machinery/computer/atmos_control/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);

// atmos_control.dm:98
rt.def("/obj/machinery/computer/atmos_control/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "atmos_control", this.name, 400, 925, master_ui, state))).open();
	return f.dot;
}, true);

// atmos_control.dm:104
rt.def("/obj/machinery/computer/atmos_control/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, id_tag: Value = null, long_name: Value = null, info: Value = null;
	rt.setAt((data = list()), "sensors", list());
	for (id_tag of each(this.sensors)) {
		long_name = rt.index(this.sensors, id_tag);
		if (!(info = rt.index(this.sensor_information, id_tag))) {
			continue;
		}
		rt.modAt(data, "sensors", list(rt.alist(f, ["id_tag", id_tag, "long_name", sanitize(long_name), "pressure", rt.at(info, "pressure"), "temperature", rt.at(info, "temperature"), "gases", rt.at(info, "gases")])), add);
	}
	return data;
});

// atmos_control.dm:122
rt.def("/obj/machinery/computer/atmos_control/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	let id_tag: Value = null;
	if (!signal || signal.encryption) {
		return f.dot;
	}
	if (!(id_tag = rt.index(signal.data, "id_tag")) || !this.sensors.Find(id_tag)) {
		return f.dot;
	}
	rt.setAt(this.sensor_information, id_tag, signal.data);
	return f.dot;
});

// atmos_control.dm:132
rt.def("/obj/machinery/computer/atmos_control/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency, GLOB.RADIO_ATMOSIA);
	return f.dot;
}, true);

rt.type(10369, "/obj/machinery/computer/atmos_control/tank", "/obj/machinery/computer/atmos_control", {
	input_tag: null,
	output_tag: null,
	input_info: null,
	output_info: null,
	frequency: 1441,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/atmos_control/tank"),
});

// atmos_control.dm:151
rt.def("/obj/machinery/computer/atmos_control/tank/proc/reconnect", function* reconnect(f: Frame, user: Value) {
	let U: Value = null, text: Value = null, new_devices: Value = null, U_5: Value = null, text_6: Value = null, U_4: Value = null;
	let IO: Value = list();
	let freq: Value = GLOB.SSradio.return_frequency(1441);
	let devices: Value = rt.index(freq.devices, "_default");
	for (U of each(devices, T("/obj/machinery/atmospherics/components/unary/vent_pump"))) {
		(IO = rt.modify(IO, rt.index((text = splittext(U.id_tag, "_")), 1), rt.bitOr));
	}
	U = null;
	for (U of each(devices, T("/obj/machinery/atmospherics/components/unary/outlet_injector"))) {
		(IO = rt.modify(IO, rt.index((text = splittext(U.id, "_")), 1), rt.bitOr));
	}
	if (!rt.len(f, IO)) {
		to_chat(user, "<span class='alert'>No machinery detected.</span>");
	}
	let S: Value = (yield* g.op(f, "Prompt", [0], [null, rt.index(IO, 1), "Selection", "Select the device set: ", IO]));
	if (this) {
		this.input_tag = `${S}_in`;
		this.output_tag = `${S}_out`;
		this.name = `${uppertext(S)} Supply Control`;
		new_devices = rt.index(freq.devices, "4");
		for (U_5 of each(new_devices, T("/obj/machinery/air_sensor"))) {
			if (rt.index((text_6 = splittext(U_5.id_tag, "_")), 1) == S) {
				this.sensors = rt.alist(f, [`${S}_sensor`, "Tank"]);
				break;
			}
		}
	}
	for (U_4 of each(devices, T("/obj/machinery/atmospherics/components/unary/outlet_injector"))) {
		yield* U_4.broadcast_status();
	}
	U_4 = null;
	for (U_4 of each(devices, T("/obj/machinery/atmospherics/components/unary/vent_pump"))) {
		yield* U_4.broadcast_status();
	}
	return f.dot;
}, true);

// atmos_control.dm:181
rt.def("/obj/machinery/computer/atmos_control/tank/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "atmos_control", this.name, 500, 305, master_ui, state))).open();
	return f.dot;
}, true);

// atmos_control.dm:187
rt.def("/obj/machinery/computer/atmos_control/tank/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	rt.setAt((data = parent_proc()), "tank", 1);
	let $0: any = data;
	let $1: any = "inputting";
	rt.setAt($0, $1, this.input_info ? rt.at(this.input_info, "power") : 0);
	rt.setAt(data, "inputRate", this.input_info ? rt.at(this.input_info, "volume_rate") : 0);
	rt.setAt(data, "outputting", this.output_info ? rt.at(this.output_info, "power") : 0);
	rt.setAt(data, "outputPressure", this.output_info ? rt.at(this.output_info, "internal") : 0);
	return data;
}, false);

// atmos_control.dm:197
rt.def("/obj/machinery/computer/atmos_control/tank/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let signal: Value = null, target: Value = null;
	let $0: any, $1: any;
	if ((yield* parent_proc()) || !this.radio_connection) {
		return f.dot;
	}
	(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
	signal.source = this;
	signal.data = rt.alist(f, ["sigtype", "command"]);
	if (action === "reconnect") {
		yield* this.reconnect(f.usr);
		f.dot = 1;
	} else if (action === "input") {
		signal.data += rt.alist(f, ["tag", this.input_tag, "power_toggle", 1]);
		f.dot = 1;
	} else if (action === "output") {
		signal.data += rt.alist(f, ["tag", this.output_tag, "power_toggle", 1]);
		f.dot = 1;
	} else if (action === "pressure") {
		$0 = null;
		if (this.output_info) {
			$1 = rt.at(this.output_info, "internal");
		} else {
			$1 = 0;
		}
		if ((target = (yield* g.op(f, "Prompt", [33], [$0, $1, this.name, "New target pressure:", null]))) !== null && !(yield* parent_proc())) {
			target = max(0, min(target, 5066.25));
			signal.data += rt.alist(f, ["tag", this.output_tag, "set_internal_pressure", target]);
			f.dot = 1;
		}
	}
	yield* this.radio_connection.post_signal(this, signal, { filter: GLOB.RADIO_ATMOSIA });
	return f.dot;
}, true);

// atmos_control.dm:222
rt.def("/obj/machinery/computer/atmos_control/tank/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	if (!signal || signal.encryption) {
		return f.dot;
	}
	let id_tag: Value = rt.index(signal.data, "tag");
	if (this.input_tag == id_tag) {
		this.input_info = signal.data;
	} else if (this.output_tag == id_tag) {
		this.output_info = signal.data;
	} else {
		parent_proc(signal);
	}
	return f.dot;
});
