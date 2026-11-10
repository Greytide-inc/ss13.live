// Based on /tg/station's code/modules/modular_computers/NTNet/NTNet_relay.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10964, "/obj/machinery/ntnet_relay", "/obj/machinery", {
	NTNet: null,
	enabled: 1,
	dos_failure: 0,
	dos_sources: null,
	dos_overload: 0,
	dos_capacity: 500,
	dos_dissipate: 1,
	use_power: 2,
	active_power_usage: 10000,
	idle_power_usage: 100,
	anchored: 1,
	name: "NTNet Quantum Relay",
	desc: "A very complex router and transmitter capable of connecting electronic devices together. Looks fragile.",
	icon: rt.rsc("icons/obj/machines/telecomms.dmi"),
	icon_state: "bus",
	density: 1,
});

// NTNet_relay.dm:15
rt.def("/obj/machinery/ntnet_relay/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.dos_sources = list();
	return f.dot;
});

// NTNet_relay.dm:25
rt.def("/obj/machinery/ntnet_relay/proc/is_operational", function is_operational(f: Frame) {
	if (rt.bitAnd(this.stat, 19)) {
		return 0;
	}
	if (this.dos_failure) {
		return 0;
	}
	if (!this.enabled) {
		return 0;
	}
	return 1;
});

// NTNet_relay.dm:34
rt.def("/obj/machinery/ntnet_relay/proc/update_icon", function update_icon(f: Frame) {
	if (this.is_operational()) {
		this.icon_state = "bus";
	} else {
		this.icon_state = "bus_off";
	}
	return f.dot;
});

// NTNet_relay.dm:40
rt.def("/obj/machinery/ntnet_relay/proc/process", function process(f: Frame) {
	if (this.is_operational()) {
		this.use_power = 2;
	} else {
		this.use_power = 1;
	}
	this.update_icon();
	if (this.dos_overload) {
		this.dos_overload = max(0, this.dos_overload - this.dos_dissipate);
	}
	if (this.dos_overload > this.dos_capacity && !this.dos_failure) {
		this.dos_failure = 1;
		this.update_icon();
		GLOB.ntnet_global.add_log("Quantum relay switched from normal operation mode to overload recovery mode.");
	}
	if (this.dos_overload == 0 && this.dos_failure) {
		this.dos_failure = 0;
		this.update_icon();
		GLOB.ntnet_global.add_log("Quantum relay switched from overload recovery mode to normal operation mode.");
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// NTNet_relay.dm:64
rt.def("/obj/machinery/ntnet_relay/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "ntnet_relay", "NTNet Quantum Relay", 500, 300, master_ui, state))).open();
	return f.dot;
}, true);

// NTNet_relay.dm:72
rt.def("/obj/machinery/ntnet_relay/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	rt.setAt((data = list()), "enabled", this.enabled);
	rt.setAt(data, "dos_capacity", this.dos_capacity);
	rt.setAt(data, "dos_overload", this.dos_overload);
	rt.setAt(data, "dos_crashed", this.dos_failure);
	return data;
});

// NTNet_relay.dm:81
rt.def("/obj/machinery/ntnet_relay/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let $0: any, $1: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "restart") {
		this.dos_overload = 0;
		this.dos_failure = 0;
		yield* this.update_icon();
		yield* GLOB.ntnet_global.add_log("Quantum relay manually restarted from overload recovery mode to normal operation mode.");
	} else if (action === "toggle") {
		this.enabled = (!this.enabled ? 1 : 0);
		$0 = GLOB.ntnet_global;
		if (this.enabled) {
			$1 = "enabled";
		} else {
			$1 = "disabled";
		}
		yield* $0.add_log(`Quantum relay manually ${$1}.`);
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// NTNet_relay.dm:96
rt.def("/obj/machinery/ntnet_relay/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// NTNet_relay.dm:99
rt.def("/obj/machinery/ntnet_relay/proc/New", function* New(f: Frame) {
	let B: Value = null;
	this.uid = GLOB.gl_uid;
	GLOB.gl_uid++;
	this.component_parts = list();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/ntnet_relay"), null))).apply_default_parts(this);
	if (GLOB.ntnet_global) {
		GLOB.ntnet_global.relays.Add(this);
		this.NTNet = GLOB.ntnet_global;
		yield* GLOB.ntnet_global.add_log(`New quantum relay activated. Current amount of linked relays: ${rt.len(f, this.NTNet.relays)}`);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// NTNet_relay.dm:113
rt.def("/obj/machinery/ntnet_relay/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	if (GLOB.ntnet_global) {
		yield* GLOB.ntnet_global.relays.Remove(this);
		yield* GLOB.ntnet_global.add_log(`Quantum relay connection severed. Current amount of linked relays: ${rt.len(f, this.NTNet.relays)}`);
		this.NTNet = null;
	}
	for (D of each(this.dos_sources, T("/datum/computer_file/program/ntnet_dos"))) {
		D.target = null;
		D.error = "Connection to quantum relay severed";
	}
	return (yield* parent_proc());
}, true);

rt.type(6763, "/obj/item/weapon/circuitboard/machine/ntnet_relay", "/obj/item/weapon/circuitboard/machine", {
	name: "NTNet Relay (Machine Board)",
	build_path: rt.typePath("/obj/machinery/ntnet_relay"),
	origin_tech: "programming=3;bluespace=3;magnets=2",
	req_components: null,
});

// NTNet_relay.dm:127
rt.def("/obj/item/weapon/circuitboard/machine/ntnet_relay/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/subspace/filter"), 1]);
	return f.dot;
});
