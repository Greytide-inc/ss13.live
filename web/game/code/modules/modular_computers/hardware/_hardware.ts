// From code/modules/modular_computers/hardware/_hardware.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7578, "/obj/item/weapon/computer_hardware", "/obj/item/weapon", {
	holder: null,
	power_usage: 0,
	enabled: 1,
	critical: 0,
	can_install: 1,
	damage: 0,
	max_damage: 100,
	damage_malfunction: 20,
	damage_failure: 50,
	malfunction_probability: 10,
	device_type: null,
	name: "hardware",
	desc: "Unknown Hardware.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "std_mod",
	w_class: 1,
});

// /obj/item/weapon/computer_hardware/proc/New  (code/modules/modular_computers/hardware/_hardware.dm:24)  may sleep
rt.def("/obj/item/weapon/computer_hardware/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-8, 8])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-8, 8])));
	return f.dot;
}, true, { args: ["L"] });

// /obj/item/weapon/computer_hardware/proc/Destroy  (code/modules/modular_computers/hardware/_hardware.dm:30)  may sleep
rt.def("/obj/item/weapon/computer_hardware/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "holder"))) {
		yield* g.callName(f, rt.sv(f, "holder"), "uninstall_component", [live(f.src)]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/computer_hardware/proc/attackby  (code/modules/modular_computers/hardware/_hardware.dm:36)  may sleep
rt.def("/obj/item/weapon/computer_hardware/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "***** DIAGNOSTICS REPORT *****"]);
		yield* g.srcCall(f, "diagnostics", live(f.args[1]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "******************************"]);
		return 1;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
		S = live(f.args[0]);
		if (isEqual(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ doesn't seem to require repairs.</span>", [live(f.src)])]);
			return 1;
		}
		if (truthy((yield* g.callName(f, live(S), "use", [1])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You patch up ％！ with a bit of ％！.</span>", [live(f.src), live(f.args[0])])]);
			rt.setSv(f, "obj_integrity", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "obj_integrity"), 10), rt.sv(f, "max_integrity")])));
		}
		return 1;
	}
	if (truthy((yield* g.srcCall(f, "try_insert", live(f.args[0]), live(f.args[1]))))) {
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user"] });

// /obj/item/weapon/computer_hardware/proc/diagnostics  (code/modules/modular_computers/hardware/_hardware.dm:60)
rt.def("/obj/item/weapon/computer_hardware/proc/diagnostics", function diagnostics(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [$0, $1, $2, $3];
	$0 = live(user);
	$1 = rt.sv(f, "damage");
	$2 = rt.sv(f, "max_damage");
	if (rt.gt(rt.sv(f, "damage"), rt.sv(f, "damage_failure"))) {
		$3 = "FAIL";
	} else {
		if (rt.gt(rt.sv(f, "damage"), rt.sv(f, "damage_malfunction"))) {
			$3 = "WARN";
		} else {
			$3 = "PASS";
		}
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("Hardware Integrity Test... (Corruption: ＀/＀) ＀", [$1, $2, $3])]);
	return f.dot;
});

// /obj/item/weapon/computer_hardware/proc/check_functionality  (code/modules/modular_computers/hardware/_hardware.dm:64)
rt.def("/obj/item/weapon/computer_hardware/proc/check_functionality", function check_functionality(f: Frame) {
	if (!truthy(rt.sv(f, "enabled"))) {
		return 0;
	}
	if (rt.gt(rt.sv(f, "damage"), rt.sv(f, "damage_failure"))) {
		return 0;
	}
	if (rt.gt(rt.sv(f, "damage"), rt.sv(f, "damage_malfunction"))) {
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "malfunction_probability")]))) {
			return 0;
		}
	}
	return 1;
});

// /obj/item/weapon/computer_hardware/proc/examine  (code/modules/modular_computers/hardware/_hardware.dm:77)
rt.def("/obj/item/weapon/computer_hardware/proc/examine", function examine(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (rt.gt(rt.sv(f, "damage"), rt.sv(f, "damage_failure"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>It seems to be severely damaged!</span>"]);
	} else {
		if (rt.gt(rt.sv(f, "damage"), rt.sv(f, "damage_malfunction"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It seems to be damaged!</span>"]);
		} else {
			if (!truthy(rt.sv(f, "damage"))) return f.dot;
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It seems to be slightly damaged.</span>"]);
		}
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/computer_hardware/proc/on_remove  (code/modules/modular_computers/hardware/_hardware.dm:95)  may sleep
rt.def("/obj/item/weapon/computer_hardware/proc/on_remove", function* on_remove(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	if (live(user) === null) {
		user = null;
	}
	yield* g.callSrc(f, "try_eject", ["forced", 1], rt.Args.Named);
	return f.dot;
}, true);
