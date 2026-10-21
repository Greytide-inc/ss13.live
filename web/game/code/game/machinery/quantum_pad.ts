// From code/game/machinery/quantum_pad.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10811, "/obj/machinery/quantumpad", "/obj/machinery", {
	teleport_cooldown: 400,
	teleport_speed: 50,
	last_teleport: null,
	teleporting: 0,
	power_efficiency: 1,
	linked_pad: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 200,
	active_power_usage: 5000,
	name: "quantum pad",
	desc: "A bluespace quantum-linked telepad used for teleporting objects to other quantum pads.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "qpad-idle",
	unique_rename: 1,
});

// /obj/machinery/quantumpad/proc/New  (code/game/machinery/quantum_pad.dm:19)  may sleep
rt.def("/obj/machinery/quantumpad/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/quantumpad"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6725, "/obj/item/weapon/circuitboard/machine/quantumpad", "/obj/item/weapon/circuitboard/machine", {
	name: "Quantum Pad (Machine Board)",
	build_path: rt.typePath("/obj/machinery/quantumpad"),
	origin_tech: "programming=3;engineering=3;plasmatech=3;bluespace=4",
	req_components: null,
	def_components: null,
});

// /obj/item/weapon/circuitboard/machine/quantumpad/proc/<init>  (code/game/machinery/quantum_pad.dm:27)
rt.def("/obj/item/weapon/circuitboard/machine/quantumpad/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 1, T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/stack/cable_coil"), 1]));
	$0 = $0;
	rt.setSv(f, "def_components", rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), T("/obj/item/weapon/ore/bluespace_crystal/artificial")]));
	return f.dot;
});

// /obj/machinery/quantumpad/proc/RefreshParts  (code/game/machinery/quantum_pad.dm:36)
rt.def("/obj/machinery/quantumpad/proc/RefreshParts", function RefreshParts(f: Frame) {
	let E: Value = null, C: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [E, C, M, $e];
	E = 0;
	C = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/capacitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		E = rt.modify(live(E), rt.fv(f, "rating", live(C)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "power_efficiency", live(E));
	E = 0;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		E = rt.modify(live(E), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "teleport_speed", rt.initial(f, live(f.src), "teleport_speed"));
	(rt.modSrcVar(f, "teleport_speed", multiply(live(E), 10), subtract));
	rt.setSv(f, "teleport_cooldown", rt.initial(f, live(f.src), "teleport_cooldown"));
	(rt.modSrcVar(f, "teleport_cooldown", multiply(live(E), 100), subtract));
	return f.dot;
});

// /obj/machinery/quantumpad/proc/attackby  (code/game/machinery/quantum_pad.dm:48)  may sleep
rt.def("/obj/machinery/quantumpad/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "pad-idle-o", "qpad-idle", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
			rt.setFv(f, "buffer", (M = live(f.args[0])), live(f.src));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You save the data in the ＀'s buffer.</span>", [rt.fv(f, "name", live(f.args[0]))])]);
			return 1;
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
			if (truthy((rt.istype(rt.gv(f, "buffer", (M = live(f.args[0]))), T("/obj/machinery/quantumpad")) ? 1 : 0))) {
				rt.setSv(f, "linked_pad", rt.fv(f, "buffer", live(M)));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You link the ＀ to the one in the ＀'s buffer.</span>", [live(f.src), rt.fv(f, "name", live(f.args[0]))])]);
				return 1;
			}
		}
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/quantumpad/proc/attack_hand  (code/game/machinery/quantum_pad.dm:74)  may sleep
rt.def("/obj/machinery/quantumpad/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "panel_open"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The panel must be closed before operating this machine!</span>"]);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "linked_pad")) || (!truthy(rt.sv(f, "linked_pad")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "linked_pad")))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There is no linked pad!</span>"]);
		return live(f.dot);
	}
	if (rt.lt(rt.worldTime(f), add(rt.sv(f, "last_teleport"), rt.sv(f, "teleport_cooldown")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is recharging power. Please wait ＀ seconds.</span>", [live(f.src), (yield* g.call(f, P("/proc/round"), null, [divide(subtract(add(rt.sv(f, "last_teleport"), rt.sv(f, "teleport_cooldown")), rt.worldTime(f)), 10)]))])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "teleporting"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is charging up. Please wait.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "teleporting", rt.sv(f, "linked_pad")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Linked pad is busy. Please wait.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "stat", rt.sv(f, "linked_pad")), 2))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Linked pad is not responding to ping.</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	yield* g.srcCall(f, "doteleport", live(user));
	return live(f.dot);
}, true);

// /obj/machinery/quantumpad/proc/sparks  (code/game/machinery/quantum_pad.dm:101)
rt.def("/obj/machinery/quantumpad/proc/sparks", function sparks(f: Frame) {
	let s: Value = null;
	f.vars = () => [s];
	rt.callName(f, (s = rt.new_(f, T("/datum/effect_system/spark_spread"), [])), "set_up", [5, 1, rt.getStep(f, live(f.src), 0)]);
	rt.callName(f, live(s), "start", []);
	return f.dot;
});

// /obj/machinery/quantumpad/proc/attack_ghost  (code/game/machinery/quantum_pad.dm:107)  may sleep
rt.def("/obj/machinery/quantumpad/proc/attack_ghost", function* attack_ghost(f: Frame, ghost: Value) {
	f.vars = () => [ghost];
	if (!truthy(rt.sv(f, "linked_pad"))) return f.dot;
	yield* g.callName(f, live(ghost), "forceMove", [rt.getStep(f, rt.sv(f, "linked_pad"), 0)]);
	return f.dot;
}, true);

// /obj/machinery/quantumpad/proc/doteleport  (code/game/machinery/quantum_pad.dm:111)
rt.def("/obj/machinery/quantumpad/proc/doteleport", function doteleport(f: Frame, user: Value) {
	let ROI: Value = null, L: Value = null;
	f.vars = () => [ROI, L];
	if (!truthy(rt.sv(f, "linked_pad"))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/weapons/flash.ogg"), 25, 1]);
	rt.setSv(f, "teleporting", 1);
	rt.spawnTail(f, rt.sv(f, "teleport_speed"), "/obj/machinery/quantumpad/proc/doteleport: spawn at game/machinery/quantum_pad.dm:114", user, ROI, L);
	return f.dot;
});

// a spawn(rt.srcVarI(f, $ic[36])) body of /obj/machinery/quantumpad/proc/doteleport, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/quantumpad/proc/doteleport: spawn at game/machinery/quantum_pad.dm:114", function* (f: Frame, user: Value, ROI: Value, L: Value) {
	let $e: any;
	f.vars = () => [user, ROI, L, $e];
	if ((!truthy(live(f.src)) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
		rt.setSv(f, "teleporting", 0);
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is unpowered!</span>", [live(f.src)])]);
		rt.setSv(f, "teleporting", 0);
		return live(f.dot);
	}
	if (((!truthy(rt.sv(f, "linked_pad")) || (!truthy(rt.sv(f, "linked_pad")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "linked_pad"))))) || truthy(rt.bitAnd(rt.fv(f, "stat", rt.sv(f, "linked_pad")), 2)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Linked pad is not responding to ping. Teleport aborted.</span>"]);
		rt.setSv(f, "teleporting", 0);
		return live(f.dot);
	}
	rt.setSv(f, "teleporting", 0);
	rt.setSv(f, "last_teleport", rt.worldTime(f));
	yield* g.srcCall(f, "use_power", divide(10000, rt.sv(f, "power_efficiency")));
	yield* g.srcCall(f, "sparks");
	yield* g.callName(f, rt.sv(f, "linked_pad"), "sparks", []);
	yield* g.call(f, P("/proc/flick"), null, ["qpad-beam", live(f.src)]);
	yield* g.call(f, P("/proc/playsound"), null, [null, rt.getStep(f, live(f.src), 0), null, rt.rsc("sound/weapons/emitter2.ogg"), null, 25, null, 1, "extrarange", 3, "falloff", 5], rt.Args.Named);
	yield* g.call(f, P("/proc/flick"), null, ["qpad-beam", rt.sv(f, "linked_pad")]);
	yield* g.call(f, P("/proc/playsound"), null, [null, rt.getStep(f, rt.sv(f, "linked_pad"), 0), null, rt.rsc("sound/weapons/emitter2.ogg"), null, 25, null, 1, "extrarange", 3, "falloff", 5], rt.Args.Named);
	ROI = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ROI = $e;
		if (truthy(rt.fv(f, "anchored", live(ROI)))) {
			if (truthy((rt.istype(live(ROI), T("/mob/living")) ? 1 : 0))) {
				if (truthy(rt.gv(f, "buckled", (L = live(ROI))))) {
					if (truthy(rt.gv(f, "anchored", rt.fv(f, "buckled", live(L))))) {
						continue;
					}
				} else {
					continue;
				}
			} else {
				if (!truthy((rt.istype(live(ROI), T("/mob/dead/observer")) ? 1 : 0))) {
					continue;
				}
			}
		}
		yield* g.call(f, P("/proc/do_teleport"), null, [live(ROI), rt.getStep(f, rt.sv(f, "linked_pad"), 0)]);
	}
	rt.endFor(f, 0);
	return null;
});
