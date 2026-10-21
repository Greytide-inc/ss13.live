// From code/modules/power/tesla/coil.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10332, "/obj/machinery/power/tesla_coil", "/obj/machinery/power", {
	power_loss: 2,
	input_power_multiplier: 1,
	zap_cooldown: 100,
	last_zap: 0,
	anchored: 0,
	can_buckle: 1,
	buckle_lying: 0,
	buckle_requires_restraints: 1,
	name: "tesla coil",
	desc: "For the union!",
	icon: rt.rsc("icons/obj/tesla_engine/tesla_coil.dmi"),
	icon_state: "coil0",
	density: 1,
});

// /obj/machinery/power/tesla_coil/proc/New  (code/modules/power/tesla/coil.dm:20)  may sleep
rt.def("/obj/machinery/power/tesla_coil/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/tesla_coil"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/tesla_coil"), [live(f.src)])));
	return f.dot;
}, true);

rt.type(6773, "/obj/item/weapon/circuitboard/machine/tesla_coil", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Tesla Coil (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/tesla_coil"),
	origin_tech: "programming=3;magnets=3;powerstorage=3",
});

// /obj/item/weapon/circuitboard/machine/tesla_coil/proc/<init>  (code/modules/power/tesla/coil.dm:29)
rt.def("/obj/item/weapon/circuitboard/machine/tesla_coil/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 1]));
	return f.dot;
});

// /obj/machinery/power/tesla_coil/proc/RefreshParts  (code/modules/power/tesla/coil.dm:34)
rt.def("/obj/machinery/power/tesla_coil/proc/RefreshParts", function RefreshParts(f: Frame) {
	let power_multiplier: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [power_multiplier, C, $e];
	power_multiplier = 0;
	rt.setSv(f, "zap_cooldown", 100);
	C = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/capacitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		power_multiplier = rt.modify(live(power_multiplier), rt.fv(f, "rating", live(C)), add);
		(rt.modSrcVar(f, "zap_cooldown", multiply(rt.fv(f, "rating", live(C)), 20), subtract));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "input_power_multiplier", live(power_multiplier));
	return f.dot;
});

// /obj/machinery/power/tesla_coil/proc/default_unfasten_wrench  (code/modules/power/tesla/coil.dm:40)  may sleep
rt.def("/obj/machinery/power/tesla_coil/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(live(f.dot), 2)) return f.dot;
	if (truthy(rt.sv(f, "panel_open"))) {
		rt.setSv(f, "icon_state", fmt("coil_open＀", [rt.sv(f, "anchored")]));
	} else {
		rt.setSv(f, "icon_state", fmt("coil＀", [rt.sv(f, "anchored")]));
	}
	if (truthy(rt.sv(f, "anchored"))) {
		yield* g.srcCall(f, "connect_to_network");
	} else {
		yield* g.srcCall(f, "disconnect_from_network");
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// /obj/machinery/power/tesla_coil/proc/attackby  (code/modules/power/tesla/coil.dm:52)  may sleep
rt.def("/obj/machinery/power/tesla_coil/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), fmt("coil_open＀", [rt.sv(f, "anchored")]), fmt("coil＀", [rt.sv(f, "anchored")]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	if ((truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])]))) && truthy(rt.sv(f, "panel_open")))) {
		yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[1])]);
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/power/tesla_coil/proc/attack_hand  (code/modules/power/tesla/coil.dm:71)  may sleep
rt.def("/obj/machinery/power/tesla_coil/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "grab") && truthy((yield* g.callSrc(f, "user_buckle_mob", [null, rt.fv(f, "pulling", live(f.args[0])), null, live(f.args[0]), "check_loc", 0], rt.Args.Named))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/power/tesla_coil/proc/tesla_act  (code/modules/power/tesla/coil.dm:76)  may sleep
rt.def("/obj/machinery/power/tesla_coil/proc/tesla_act", function* tesla_act(f: Frame) {
	let power_produced: Value = null;
	let $0: any;
	f.vars = () => [power_produced, $0];
	if ((truthy(rt.sv(f, "anchored")) && !truthy(rt.sv(f, "panel_open")))) {
		rt.setSv(f, "being_shocked", 1);
		if (truthy(rt.sv(f, "powernet"))) {
			$0 = divide(live(f.args[0]), rt.sv(f, "power_loss"));
		} else {
			$0 = live(f.args[0]);
		}
		yield* g.srcCall(f, "add_avail", multiply((power_produced = $0), rt.sv(f, "input_power_multiplier")));
		yield* g.call(f, P("/proc/flick"), null, ["coilhit", live(f.src)]);
		yield* g.call(f, P("/proc/playsound"), null, [null, rt.fv(f, "loc", live(f.src)), null, rt.rsc("sound/magic/lightningshock.ogg"), null, 100, null, 1, "extrarange", 5], rt.Args.Named);
		yield* g.call(f, P("/proc/tesla_zap"), null, [live(f.src), 5, live(power_produced)]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/proc/reset_shocked")])), 10]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["power"] });

// /obj/machinery/power/tesla_coil/proc/zap  (code/modules/power/tesla/coil.dm:90)  may sleep
rt.def("/obj/machinery/power/tesla_coil/proc/zap", function* zap(f: Frame) {
	let coeff: Value = null, power: Value = null;
	f.vars = () => [coeff, power];
	if ((rt.gt(add(rt.sv(f, "last_zap"), rt.sv(f, "zap_cooldown")), rt.worldTime(f)) || !truthy(rt.sv(f, "powernet")))) {
		return 0;
	}
	rt.setSv(f, "last_zap", rt.worldTime(f));
	coeff = (yield* g.call(f, P("/proc/max"), null, [(coeff = subtract(20, multiply(subtract(rt.sv(f, "input_power_multiplier"), 1), 3))), 10]));
	yield* g.srcCall(f, "add_load", (power = divide(rt.fv(f, "avail", rt.sv(f, "powernet")), 2)));
	yield* g.call(f, P("/proc/playsound"), null, [null, rt.fv(f, "loc", live(f.src)), null, rt.rsc("sound/magic/lightningshock.ogg"), null, 100, null, 1, "extrarange", 5], rt.Args.Named);
	yield* g.call(f, P("/proc/tesla_zap"), null, [live(f.src), 10, divide(live(power), divide(live(coeff), 2))]);
	return f.dot;
}, true);

rt.type(10333, "/obj/machinery/power/grounding_rod", "/obj/machinery/power", {
	anchored: 0,
	can_buckle: 1,
	buckle_lying: 0,
	buckle_requires_restraints: 1,
	name: "grounding rod",
	desc: "Keep an area from being fried from Edison's Bane.",
	icon: rt.rsc("icons/obj/tesla_engine/tesla_coil.dmi"),
	icon_state: "grounding_rod0",
	density: 1,
});

// /obj/machinery/power/grounding_rod/proc/New  (code/modules/power/tesla/coil.dm:113)  may sleep
rt.def("/obj/machinery/power/grounding_rod/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/grounding_rod"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6774, "/obj/item/weapon/circuitboard/machine/grounding_rod", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Grounding Rod (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/grounding_rod"),
	origin_tech: "programming=3;powerstorage=3;magnets=3;plasmatech=2",
});

// /obj/item/weapon/circuitboard/machine/grounding_rod/proc/<init>  (code/modules/power/tesla/coil.dm:121)
rt.def("/obj/item/weapon/circuitboard/machine/grounding_rod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 1]));
	return f.dot;
});

// /obj/machinery/power/grounding_rod/proc/default_unfasten_wrench  (code/modules/power/tesla/coil.dm:124)  may sleep
rt.def("/obj/machinery/power/grounding_rod/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(live(f.dot), 2)) return f.dot;
	if (truthy(rt.sv(f, "panel_open"))) {
		rt.setSv(f, "icon_state", fmt("grounding_rod_open＀", [rt.sv(f, "anchored")]));
	} else {
		rt.setSv(f, "icon_state", fmt("grounding_rod＀", [rt.sv(f, "anchored")]));
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// /obj/machinery/power/grounding_rod/proc/attackby  (code/modules/power/tesla/coil.dm:132)  may sleep
rt.def("/obj/machinery/power/grounding_rod/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), fmt("grounding_rod_open＀", [rt.sv(f, "anchored")]), fmt("grounding_rod＀", [rt.sv(f, "anchored")]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/power/grounding_rod/proc/attack_hand  (code/modules/power/tesla/coil.dm:147)  may sleep
rt.def("/obj/machinery/power/grounding_rod/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "grab") && truthy((yield* g.callSrc(f, "user_buckle_mob", [null, rt.fv(f, "pulling", live(f.args[0])), null, live(f.args[0]), "check_loc", 0], rt.Args.Named))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/power/grounding_rod/proc/tesla_act  (code/modules/power/tesla/coil.dm:152)  may sleep
rt.def("/obj/machinery/power/grounding_rod/proc/tesla_act", function* tesla_act(f: Frame) {
	if ((truthy(rt.sv(f, "anchored")) && !truthy(rt.sv(f, "panel_open")))) {
		yield* g.call(f, P("/proc/flick"), null, ["grounding_rodhit", live(f.src)]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["power"] });
