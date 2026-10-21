// From code/modules/modular_computers/NTNet/NTNet_relay.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/ntnet_relay/proc/<init>  (code/modules/modular_computers/NTNet/NTNet_relay.dm:15)
rt.def("/obj/machinery/ntnet_relay/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "dos_sources", rt.list());
	return f.dot;
});

// /obj/machinery/ntnet_relay/proc/is_operational  (code/modules/modular_computers/NTNet/NTNet_relay.dm:25)
rt.def("/obj/machinery/ntnet_relay/proc/is_operational", function is_operational(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 19))) {
		return 0;
	}
	if (truthy(rt.sv(f, "dos_failure"))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "enabled"))) {
		return 0;
	}
	return 1;
});

// /obj/machinery/ntnet_relay/proc/update_icon  (code/modules/modular_computers/NTNet/NTNet_relay.dm:34)
rt.def("/obj/machinery/ntnet_relay/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.callSrc(f, "is_operational", []))) {
		rt.setSv(f, "icon_state", "bus");
	} else {
		rt.setSv(f, "icon_state", "bus_off");
	}
	return f.dot;
});

// /obj/machinery/ntnet_relay/proc/process  (code/modules/modular_computers/NTNet/NTNet_relay.dm:40)
rt.def("/obj/machinery/ntnet_relay/proc/process", function process(f: Frame) {
	if (truthy(rt.callSrc(f, "is_operational", []))) {
		rt.setSv(f, "use_power", 2);
	} else {
		rt.setSv(f, "use_power", 1);
	}
	rt.callSrc(f, "update_icon", []);
	if (truthy(rt.sv(f, "dos_overload"))) {
		rt.setSv(f, "dos_overload", rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "dos_overload"), rt.sv(f, "dos_dissipate"))]));
	}
	if ((rt.gt(rt.sv(f, "dos_overload"), rt.sv(f, "dos_capacity")) && !truthy(rt.sv(f, "dos_failure")))) {
		rt.setSv(f, "dos_failure", 1);
		rt.callSrc(f, "update_icon", []);
		rt.callName(f, rt.gl("ntnet_global"), "add_log", ["Quantum relay switched from normal operation mode to overload recovery mode."]);
	}
	if ((isEqual(rt.sv(f, "dos_overload"), 0) && truthy(rt.sv(f, "dos_failure")))) {
		rt.setSv(f, "dos_failure", 0);
		rt.callSrc(f, "update_icon", []);
		rt.callName(f, rt.gl("ntnet_global"), "add_log", ["Quantum relay switched from overload recovery mode to normal operation mode."]);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/ntnet_relay/proc/ui_interact  (code/modules/modular_computers/NTNet/NTNet_relay.dm:64)  may sleep
rt.def("/obj/machinery/ntnet_relay/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "ntnet_relay", "NTNet Quantum Relay", 500, 300, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/ntnet_relay/proc/ui_data  (code/modules/modular_computers/NTNet/NTNet_relay.dm:72)
rt.def("/obj/machinery/ntnet_relay/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "enabled", rt.sv(f, "enabled"));
	rt.setAt(live(data), "dos_capacity", rt.sv(f, "dos_capacity"));
	rt.setAt(live(data), "dos_overload", rt.sv(f, "dos_overload"));
	rt.setAt(live(data), "dos_crashed", rt.sv(f, "dos_failure"));
	return live(data);
});

// /obj/machinery/ntnet_relay/proc/ui_act  (code/modules/modular_computers/NTNet/NTNet_relay.dm:81)  may sleep
rt.def("/obj/machinery/ntnet_relay/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "restart") {
		rt.setSv(f, "dos_overload", 0);
		rt.setSv(f, "dos_failure", 0);
		yield* g.srcCall(f, "update_icon");
		yield* g.callName(f, rt.gl("ntnet_global"), "add_log", ["Quantum relay manually restarted from overload recovery mode to normal operation mode."]);
	} else if ($0 === "toggle") {
		rt.setSv(f, "enabled", (!truthy(rt.sv(f, "enabled")) ? 1 : 0));
		$0 = rt.gl("ntnet_global");
		if (truthy(rt.sv(f, "enabled"))) {
			$1 = "enabled";
		} else {
			$1 = "disabled";
		}
		yield* g.callName(f, $0, "add_log", [fmt("Quantum relay manually ＀.", [$1])]);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/ntnet_relay/proc/attack_hand  (code/modules/modular_computers/NTNet/NTNet_relay.dm:96)  may sleep
rt.def("/obj/machinery/ntnet_relay/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/ntnet_relay/proc/New  (code/modules/modular_computers/NTNet/NTNet_relay.dm:99)  may sleep
rt.def("/obj/machinery/ntnet_relay/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	rt.setSv(f, "uid", rt.gl("gl_uid"));
	rt.incGl("gl_uid", 1, true);
	rt.setSv(f, "component_parts", rt.list());
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/ntnet_relay"), [null]))), "apply_default_parts", [live(f.src)]);
	if (truthy(rt.gl("ntnet_global"))) {
		yield* g.callName(f, rt.fv(f, "relays", rt.gl("ntnet_global")), "Add", [live(f.src)]);
		rt.setSv(f, "NTNet", rt.gl("ntnet_global"));
		yield* g.callName(f, rt.gl("ntnet_global"), "add_log", [fmt("New quantum relay activated. Current amount of linked relays: ＀", [rt.getLen(f, rt.fv(f, "relays", rt.sv(f, "NTNet")))])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/ntnet_relay/proc/Destroy  (code/modules/modular_computers/NTNet/NTNet_relay.dm:113)  may sleep
rt.def("/obj/machinery/ntnet_relay/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	if (truthy(rt.gl("ntnet_global"))) {
		yield* g.callName(f, rt.fv(f, "relays", rt.gl("ntnet_global")), "Remove", [live(f.src)]);
		yield* g.callName(f, rt.gl("ntnet_global"), "add_log", [fmt("Quantum relay connection severed. Current amount of linked relays: ＀", [rt.getLen(f, rt.fv(f, "relays", rt.sv(f, "NTNet")))])]);
		rt.setSv(f, "NTNet", null);
	}
	D = null;
	rt.forList(f, 0, rt.sv(f, "dos_sources"), T("/datum/computer_file/program/ntnet_dos"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		rt.setFv(f, "target", live(D), null);
		rt.setFv(f, "error", live(D), "Connection to quantum relay severed");
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(6763, "/obj/item/weapon/circuitboard/machine/ntnet_relay", "/obj/item/weapon/circuitboard/machine", {
	name: "NTNet Relay (Machine Board)",
	build_path: rt.typePath("/obj/machinery/ntnet_relay"),
	origin_tech: "programming=3;bluespace=3;magnets=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/ntnet_relay/proc/<init>  (code/modules/modular_computers/NTNet/NTNet_relay.dm:127)
rt.def("/obj/item/weapon/circuitboard/machine/ntnet_relay/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/subspace/filter"), 1]));
	return f.dot;
});
