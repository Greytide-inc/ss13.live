// From code/modules/modular_computers/hardware/network_card.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/computer_hardware/network_card/proc/diagnostics  (code/modules/modular_computers/hardware/network_card.dm:16)
rt.def("/obj/item/weapon/computer_hardware/network_card/proc/diagnostics", function diagnostics(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("NIX Unique ID: ＀", [rt.sv(f, "identification_id")])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("NIX User Tag: ＀", [rt.sv(f, "identification_string")])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "Supported protocols:"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "511.m SFS (Subspace) - Standard Frequency Spread"]);
	if (truthy(rt.sv(f, "long_range"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "511.n WFS/HB (Subspace) - Wide Frequency Spread/High Bandiwdth"]);
	}
	if (!truthy(rt.sv(f, "ethernet"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "OpenEth (Physical Connection) - Physical network connection port"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/computer_hardware/network_card/proc/New  (code/modules/modular_computers/hardware/network_card.dm:27)  may sleep
rt.def("/obj/item/weapon/computer_hardware/network_card/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "identification_id", rt.incGl("ntnet_card_uid", 1, true));
	return f.dot;
}, true, { args: ["l"] });

// /obj/item/weapon/computer_hardware/network_card/proc/get_network_tag  (code/modules/modular_computers/hardware/network_card.dm:32)
rt.def("/obj/item/weapon/computer_hardware/network_card/proc/get_network_tag", function get_network_tag(f: Frame) {
	return fmt("＀ (NID ＀)", [rt.sv(f, "identification_string"), rt.sv(f, "identification_id")]);
});

// /obj/item/weapon/computer_hardware/network_card/proc/get_signal  (code/modules/modular_computers/hardware/network_card.dm:36)
rt.def("/obj/item/weapon/computer_hardware/network_card/proc/get_signal", function get_signal(f: Frame, specific_action: Value) {
	let _T: Value = null;
	f.vars = () => [specific_action, _T];
	if (live(specific_action) === null) {
		specific_action = 0;
	}
	if (!truthy(rt.sv(f, "holder"))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "check_functionality", []))) {
		return 0;
	}
	if (truthy(rt.sv(f, "ethernet"))) {
		return 3;
	}
	if ((!truthy(rt.gl("ntnet_global")) || !truthy(rt.callName(f, rt.gl("ntnet_global"), "check_function", [live(specific_action)])))) {
		return 0;
	}
	if (truthy(rt.sv(f, "holder"))) {
		if (((truthy((_T = rt.getStep(f, rt.sv(f, "holder"), 0))) && truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0))) && (isEqual(rt.fv(f, "z", live(_T)), 2) || isEqual(rt.fv(f, "z", live(_T)), 5)))) {
			if (truthy(rt.sv(f, "long_range"))) {
				return 2;
			} else {
				return 1;
			}
		}
	}
	if (truthy(rt.sv(f, "long_range"))) {
		return 1;
	}
	return 0;
});
