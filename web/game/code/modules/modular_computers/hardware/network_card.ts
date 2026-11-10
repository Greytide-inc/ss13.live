// Based on /tg/station's code/modules/modular_computers/hardware/network_card.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7595, "/obj/item/weapon/computer_hardware/network_card", "/obj/item/weapon/computer_hardware", {
	identification_id: null,
	identification_string: "",
	long_range: 0,
	ethernet: 0,
	power_usage: 50,
	malfunction_probability: 1,
	device_type: "NET",
	name: "network card",
	desc: "A basic wireless network card for usage with standard NTNet frequencies.",
	origin_tech: "programming=2;engineering=1",
	icon_state: "radio_mini",
}, { global: { ntnet_card_uid: 733 } });

// network_card.dm:16
rt.def("/obj/item/weapon/computer_hardware/network_card/proc/diagnostics", function diagnostics(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `NIX Unique ID: ${this.identification_id}`);
	to_chat(user, `NIX User Tag: ${this.identification_string}`);
	to_chat(user, "Supported protocols:");
	to_chat(user, "511.m SFS (Subspace) - Standard Frequency Spread");
	if (this.long_range) {
		to_chat(user, "511.n WFS/HB (Subspace) - Wide Frequency Spread/High Bandiwdth");
	}
	if (!this.ethernet) return f.dot;
	to_chat(user, "OpenEth (Physical Connection) - Physical network connection port");
	return f.dot;
}, false);

// network_card.dm:27
rt.def("/obj/item/weapon/computer_hardware/network_card/proc/New", function* New(f: Frame, l: Value) {
	yield* parent_proc();
	this.identification_id = rt.incGl("ntnet_card_uid", 1, true);
	return f.dot;
}, true);

// network_card.dm:32
rt.def("/obj/item/weapon/computer_hardware/network_card/proc/get_network_tag", function get_network_tag(f: Frame) {
	return `${this.identification_string} (NID ${this.identification_id})`;
});

// network_card.dm:36
rt.def("/obj/item/weapon/computer_hardware/network_card/proc/get_signal", function get_signal(f: Frame, specific_action: Value) {
	let _T: Value = null;
	specific_action ??= 0;
	if (!this.holder) {
		return 0;
	}
	if (!this.check_functionality()) {
		return 0;
	}
	if (this.ethernet) {
		return 3;
	}
	if (!GLOB.ntnet_global || !GLOB.ntnet_global.check_function(specific_action)) {
		return 0;
	}
	if (this.holder) {
		if ((_T = rt.getStep(f, this.holder, 0)) && rt.istype(_T, T("/turf")) && (_T.z == ZLEVEL_STATION || _T.z == ZLEVEL_MINING)) {
			if (this.long_range) {
				return 2;
			} else {
				return 1;
			}
		}
	}
	if (this.long_range) {
		return 1;
	}
	return 0;
});
