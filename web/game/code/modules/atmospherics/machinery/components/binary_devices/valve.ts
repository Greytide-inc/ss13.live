// From code/modules/atmospherics/machinery/components/binary_devices/valve.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10570, "/obj/machinery/atmospherics/components/binary/valve", "/obj/machinery/atmospherics/components/binary", {
	frequency: 0,
	id: null,
	open: 0,
	valve_type: "m",
	can_unwrench: 1,
	icon_state: "mvalve_map",
	name: "manual valve",
	desc: "A pipe valve",
});

// /obj/machinery/atmospherics/components/binary/valve/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/binary_devices/valve.dm:22)
rt.def("/obj/machinery/atmospherics/components/binary/valve/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame, animation: Value) {
	let $0: any, $1: any;
	f.vars = () => [animation, $0, $1];
	if (live(animation) === null) {
		animation = 0;
	}
	rt.callSrc(f, "normalize_dir", []);
	if (truthy(live(animation))) {
		rt.call(f, P("/proc/flick"), null, [fmt("＀valve_＀＀", [rt.sv(f, "valve_type"), rt.sv(f, "open"), (!truthy(rt.sv(f, "open")) ? 1 : 0)]), live(f.src)]);
	}
	$0 = rt.sv(f, "valve_type");
	if (truthy(rt.sv(f, "open"))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.setSv(f, "icon_state", fmt("＀valve_＀", [$0, $1]));
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/valve/proc/open  (code/modules/atmospherics/machinery/components/binary_devices/valve.dm:29)
rt.def("/obj/machinery/atmospherics/components/binary/valve/proc/open", function open(f: Frame) {
	let parent1: Value = null;
	let $0: any;
	f.vars = () => [parent1, $0];
	rt.setSv(f, "open", 1);
	rt.callSrc(f, "update_icon_nopipes", []);
	rt.callSrc(f, "update_parents", []);
	rt.callName(f, (parent1 = rt.index(rt.sv(f, "parents"), 1)), "reconcile_air", []);
	if (truthy(live(f.usr))) {
		$0 = rt.call(f, P("/proc/key_name"), null, [live(f.usr)]);
	} else {
		$0 = "a remote signal";
	}
	rt.callSrc(f, "investigate_log", [fmt("was opened by ＀", [$0]), "atmos"]);
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/valve/proc/close  (code/modules/atmospherics/machinery/components/binary_devices/valve.dm:37)
rt.def("/obj/machinery/atmospherics/components/binary/valve/proc/close", function close(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "open", 0);
	rt.callSrc(f, "update_icon_nopipes", []);
	if (truthy(live(f.usr))) {
		$0 = rt.call(f, P("/proc/key_name"), null, [live(f.usr)]);
	} else {
		$0 = "a remote signal";
	}
	rt.callSrc(f, "investigate_log", [fmt("was closed by ＀", [$0]), "atmos"]);
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/valve/proc/normalize_dir  (code/modules/atmospherics/machinery/components/binary_devices/valve.dm:41)
rt.def("/obj/machinery/atmospherics/components/binary/valve/proc/normalize_dir", function normalize_dir(f: Frame) {
	if (isEqual(rt.sv(f, "dir"), 2)) {
		rt.callSrc(f, "setDir", [1]);
	} else {
		if (!isEqual(rt.sv(f, "dir"), 8)) return f.dot;
		rt.callSrc(f, "setDir", [4]);
	}
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/valve/proc/attack_hand  (code/modules/atmospherics/machinery/components/binary_devices/valve.dm:50)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/valve/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.srcCall(f, "update_icon_nopipes", 1);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	if (truthy(rt.sv(f, "open"))) {
		yield* g.srcCall(f, "close");
		return live(f.dot);
	}
	yield* g.srcCall(f, "open");
	return f.dot;
}, true);

rt.type(10572, "/obj/machinery/atmospherics/components/binary/valve/digital", "/obj/machinery/atmospherics/components/binary/valve", {
	valve_type: "d",
	name: "digital valve",
	desc: "A digitally controlled valve.",
	icon_state: "dvalve_map",
});

// /obj/machinery/atmospherics/components/binary/valve/digital/proc/attack_ai  (code/modules/atmospherics/machinery/components/binary_devices/valve.dm:65)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/valve/digital/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/atmospherics/components/binary/valve/digital/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/binary_devices/valve.dm:68)
rt.def("/obj/machinery/atmospherics/components/binary/valve/digital/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.callSrc(f, "normalize_dir", []);
		rt.setSv(f, "icon_state", "dvalve_nopower");
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["animation"] });
