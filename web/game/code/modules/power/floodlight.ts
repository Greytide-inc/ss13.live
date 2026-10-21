// From code/modules/power/floodlight.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12975, "/obj/structure/floodlight_frame", "/obj/structure", {
	state: 3,
	name: "floodlight frame",
	desc: "A bare metal frame looking vaguely like a floodlight. Requires wrenching down.",
	max_integrity: 100,
	obj_integrity: 100,
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "floodlight_c1",
	density: 1,
});

// /obj/structure/floodlight_frame/proc/attackby  (code/modules/power/floodlight.dm:13)  may sleep
rt.def("/obj/structure/floodlight_frame/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && isEqual(rt.sv(f, "state"), 3))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You secure the ＀.</span>", [live(f.src)])]);
		rt.setSv(f, "anchored", 1);
		rt.setSv(f, "state", 0);
		rt.setSv(f, "desc", "A bare metal frame looking vaguely like a floodlight. Requires wiring.");
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0)) && isEqual(rt.sv(f, "state"), 0))) {
			if (truthy((yield* g.callName(f, (S = live(f.args[0])), "use", [5])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You wire the ＀.</span>", [live(f.src)])]);
				rt.setSv(f, "name", fmt("wired ＀", [rt.sv(f, "name")]));
				rt.setSv(f, "desc", "A bare metal frame looking vaguely like a floodlight. Requires securing with a screwdriver.");
				rt.setSv(f, "icon_state", "floodlight_c2");
				rt.setSv(f, "state", 2);
			}
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/light/tube")) ? 1 : 0)) && isEqual(rt.sv(f, "state"), 1))) {
				if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0])])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put lights in the ＀.</span>", [live(f.src)])]);
					yield* g.new_(f, T("/obj/machinery/power/floodlight"), [rt.fv(f, "loc", live(f.src))]);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				}
			} else {
				if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && isEqual(rt.sv(f, "state"), 2))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You fasten the wiring and electronics in ＀.</span>", [live(f.src)])]);
					rt.setSv(f, "name", fmt("secured ＀", [rt.sv(f, "name")]));
					rt.setSv(f, "desc", "A bare metal frame that looks like a floodlight. Requires light tubes.");
					rt.setSv(f, "icon_state", "floodlight_c3");
					rt.setSv(f, "state", 1);
				} else {
					yield* g.callSuper(f, [], rt.Args.Same);
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

rt.type(10311, "/obj/machinery/power/floodlight", "/obj/machinery/power", {
	light_setting_list: null,
	light_power_coefficient: 300,
	setting: 1,
	anchored: 1,
	light_power: 1.75,
	name: "floodlight",
	desc: "A pole with powerful mounted lights on it. Due to its high power draw, it must be powered by a direct connection to a wire node.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "floodlight",
	density: 1,
	idle_power_usage: 100,
	active_power_usage: 1000,
});

// /obj/machinery/power/floodlight/proc/process  (code/modules/power/floodlight.dm:55)
rt.def("/obj/machinery/power/floodlight/proc/process", function process(f: Frame) {
	if (truthy(rt.callSrc(f, "avail", [rt.sv(f, "active_power_usage")]))) {
		rt.callSrc(f, "add_load", [rt.sv(f, "active_power_usage")]);
	} else {
		rt.callSrc(f, "change_setting", [1]);
	}
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/power/floodlight/proc/change_setting  (code/modules/power/floodlight.dm:61)
rt.def("/obj/machinery/power/floodlight/proc/change_setting", function change_setting(f: Frame, val: Value, user: Value) {
	let setting_text: Value = null;
	let $0: any;
	f.vars = () => [setting_text, $0];
	if ((rt.lt(live(val), 1) || rt.gt(live(val), rt.len(f, rt.sv(f, "light_setting_list"))))) {
		return live(f.dot);
	}
	rt.setSv(f, "active_power_usage", rt.index(rt.sv(f, "light_setting_list"), live(val)));
	if (!truthy(rt.callSrc(f, "avail", [rt.sv(f, "active_power_usage")]))) {
		return rt.callSrc(f, "change_setting", [subtract(live(val), 1)]);
	}
	rt.setSv(f, "setting", live(val));
	rt.callSrc(f, "set_light", [rt.index(rt.sv(f, "light_setting_list"), live(val))]);
	setting_text = "";
	if (rt.gt(live(val), 1)) {
		rt.setSv(f, "icon_state", fmt("＀_on", [rt.initial(f, live(f.src), "icon_state")]));
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	}
	$0 = live(val);
	if ($0 === 1) {
		setting_text = "OFF";
	} else if ($0 === 2) {
		setting_text = "low power";
	} else if ($0 === 3) {
		setting_text = "standard lighting";
	} else if ($0 === 4) {
		setting_text = "high power";
	}
	if (!truthy(live(user))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("You set the ＀ to ＀.", [live(f.src), live(setting_text)])]);
	return f.dot;
});

// /obj/machinery/power/floodlight/proc/attackby  (code/modules/power/floodlight.dm:86)  may sleep
rt.def("/obj/machinery/power/floodlight/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.callSrc(f, "default_unfasten_wrench", [null, live(f.args[1]), null, live(f.args[0]), "time", 20], rt.Args.Named);
		yield* g.srcCall(f, "change_setting", 1);
		if (truthy(rt.sv(f, "anchored"))) {
			yield* g.srcCall(f, "connect_to_network");
		} else {
			yield* g.srcCall(f, "disconnect_from_network");
		}
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/power/floodlight/proc/attack_hand  (code/modules/power/floodlight.dm:97)  may sleep
rt.def("/obj/machinery/power/floodlight/proc/attack_hand", function* attack_hand(f: Frame) {
	let current: Value = null;
	f.vars = () => [current];
	if (isEqual((current = rt.sv(f, "setting")), 1)) {
		current = rt.len(f, rt.sv(f, "light_setting_list"));
	} else {
		current = rt.inc(live(current), -1);
	}
	yield* g.srcCall(f, "change_setting", live(current), live(f.args[0]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/power/floodlight/proc/attack_ai  (code/modules/power/floodlight.dm:106)  may sleep
rt.def("/obj/machinery/power/floodlight/proc/attack_ai", function* attack_ai(f: Frame) {
	yield* g.srcCall(f, "attack_hand", live(f.args[0]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });
