// Based on /tg/station's code/game/machinery/computer/atmos_alert.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


rt.type(10367, "/obj/machinery/computer/atmos_alert", "/obj/machinery/computer", {
	priority_alarms: null,
	minor_alarms: null,
	receive_frequency: 1437,
	radio_connection: null,
	light_color: "#7DE1E1",
	name: "atmospheric alert console",
	desc: "Used to monitor the station's air alarms.",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/atmos_alert"),
	icon_screen: "alert:0",
	icon_keyboard: "atmos_key",
});

// atmos_alert.dm:7
rt.def("/obj/machinery/computer/atmos_alert/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.priority_alarms = list();

	this.minor_alarms = list();
	return f.dot;
});

// atmos_alert.dm:15
rt.def("/obj/machinery/computer/atmos_alert/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.set_frequency(this.receive_frequency);
	return f.dot;
}, true);

// atmos_alert.dm:20
rt.def("/obj/machinery/computer/atmos_alert/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.receive_frequency);
	}
	return (yield* parent_proc());
}, true);

// atmos_alert.dm:25
rt.def("/obj/machinery/computer/atmos_alert/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "atmos_alert", this.name, 350, 300, master_ui, state))).open();
	return f.dot;
}, true);

// atmos_alert.dm:31
rt.def("/obj/machinery/computer/atmos_alert/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, zone: Value = null;
	rt.setAt((data = list()), "priority", list());
	for (zone of each(this.priority_alarms)) {
		rt.modAt(data, "priority", zone, add);
	}
	rt.setAt(data, "minor", list());
	zone = null;
	for (zone of each(this.minor_alarms)) {
		rt.modAt(data, "minor", zone, add);
	}
	return data;
});

// atmos_alert.dm:43
rt.def("/obj/machinery/computer/atmos_alert/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let zone: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "clear") {
		if (rt.isIn(f, (zone = rt.at(params, "zone")), this.priority_alarms)) {
			to_chat(f.usr, `Priority alarm for ${zone} cleared.`);
			this.priority_alarms -= zone;
			f.dot = 1;
		}
		if (rt.isIn(f, zone, this.minor_alarms)) {
			to_chat(f.usr, `Minor alarm for ${zone} cleared.`);
			this.minor_alarms -= zone;
			f.dot = 1;
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// atmos_alert.dm:59
rt.def("/obj/machinery/computer/atmos_alert/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.receive_frequency);
	this.receive_frequency = new_frequency;
	this.radio_connection = GLOB.SSradio.add_object(this, this.receive_frequency, GLOB.RADIO_ATMOSIA);
	return f.dot;
}, true);

// atmos_alert.dm:64
rt.def("/obj/machinery/computer/atmos_alert/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	if (!signal || signal.encryption) {
		return f.dot;
	}
	let zone: Value = rt.index(signal.data, "zone");
	let severity: Value = rt.index(signal.data, "alert");
	if (!zone || !severity) {
		return f.dot;
	}
	this.minor_alarms -= zone;
	this.priority_alarms -= zone;
	if (severity == "severe") {
		this.priority_alarms += zone;
	} else if (severity == "minor") {
		this.minor_alarms += zone;
	}
	this.update_icon();
	return f.dot;
});

// atmos_alert.dm:81
rt.def("/obj/machinery/computer/atmos_alert/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (rt.len(f, this.priority_alarms)) {
		this.add_overlay("alert:2");
	} else {
		if (!rt.len(f, this.minor_alarms)) return f.dot;
		this.add_overlay("alert:1");
	}
	return f.dot;
});
