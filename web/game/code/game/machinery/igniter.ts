// From code/game/machinery/igniter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10797, "/obj/machinery/igniter", "/obj/machinery", {
	id: null,
	on: 1,
	anchored: 1,
	name: "igniter",
	desc: "It's useful for igniting plasma.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "igniter1",
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 4,
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
	resistance_flags: 2,
});

// /obj/machinery/igniter/proc/<init>  (code/game/machinery/igniter.dm:14)
rt.def("/obj/machinery/igniter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 30, "laser", 70, "energy", 50, "bomb", 20, "bio", 0, "rad", 0, "fire", 100, "acid", 70]));
	return f.dot;
});

// /obj/machinery/igniter/proc/attack_ai  (code/game/machinery/igniter.dm:18)  may sleep
rt.def("/obj/machinery/igniter/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/igniter/proc/attack_paw  (code/game/machinery/igniter.dm:21)  may sleep
rt.def("/obj/machinery/igniter/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/igniter/proc/attack_hand  (code/game/machinery/igniter.dm:24)  may sleep
rt.def("/obj/machinery/igniter/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.args[0]));
	yield* g.srcCall(f, "use_power", 50);
	rt.setFv(f, "on", live(f.src), (!truthy(rt.fv(f, "on", live(f.src))) ? 1 : 0));
	rt.setFv(f, "icon_state", live(f.src), fmt("igniter＀", [rt.fv(f, "on", live(f.src))]));
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/igniter/proc/process  (code/game/machinery/igniter.dm:34)  may sleep
rt.def("/obj/machinery/igniter/proc/process", function* process(f: Frame) {
	let location: Value = null;
	f.vars = () => [location];
	if ((truthy(rt.fv(f, "on", live(f.src))) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 2)))) {
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [(location = rt.fv(f, "loc", live(f.src)))])))) {
			yield* g.callName(f, live(location), "hotspot_expose", [1000, 500, 1]);
		}
	}
	return 1;
}, true, { waitfor: false });

// /obj/machinery/igniter/proc/New  (code/game/machinery/igniter.dm:41)  may sleep
rt.def("/obj/machinery/igniter/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("igniter＀", [rt.sv(f, "on")]));
	return f.dot;
}, true);

// /obj/machinery/igniter/proc/power_change  (code/game/machinery/igniter.dm:45)
rt.def("/obj/machinery/igniter/proc/power_change", function power_change(f: Frame) {
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "icon_state", fmt("igniter＀", [rt.fv(f, "on", live(f.src))]));
	} else {
		rt.setSv(f, "icon_state", "igniter0");
	}
	return f.dot;
});

rt.type(10798, "/obj/machinery/sparker", "/obj/machinery", {
	id: null,
	disable: 0,
	last_spark: 0,
	base_state: "migniter",
	spark_system: null,
	anchored: 1,
	name: "mounted igniter",
	desc: "A wall-mounted ignition device.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "migniter",
	resistance_flags: 2,
});

// /obj/machinery/sparker/proc/New  (code/game/machinery/igniter.dm:66)  may sleep
rt.def("/obj/machinery/sparker/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [2, 1, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "spark_system"), "attach", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/sparker/proc/Destroy  (code/game/machinery/igniter.dm:72)  may sleep
rt.def("/obj/machinery/sparker/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "spark_system")]);
	rt.setSv(f, "spark_system", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/sparker/proc/power_change  (code/game/machinery/igniter.dm:77)
rt.def("/obj/machinery/sparker/proc/power_change", function power_change(f: Frame) {
	if ((truthy(rt.callSrc(f, "powered", [])) && isEqual(rt.sv(f, "disable"), 0))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "base_state")]));
	} else {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitOr));
		rt.setSv(f, "icon_state", fmt("＀-p", [rt.sv(f, "base_state")]));
	}
	return f.dot;
});

// /obj/machinery/sparker/proc/attackby  (code/game/machinery/igniter.dm:87)  may sleep
rt.def("/obj/machinery/sparker/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
		rt.setFv(f, "disable", live(f.src), (!truthy(rt.fv(f, "disable", live(f.src))) ? 1 : 0));
		if (truthy(rt.fv(f, "disable", live(f.src)))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has disabled ％！!", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You disable the connection to ％！.</span>", [live(f.src)])]);
			rt.setSv(f, "icon_state", fmt("＀-d", [rt.sv(f, "base_state")]));
		}
		if (!truthy(rt.fv(f, "disable", live(f.src)))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has reconnected ％！!", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You fix the connection to ％！.</span>", [live(f.src)])]);
			if (truthy((yield* g.callName(f, live(f.src), "powered", [])))) {
				rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "base_state")]));
			} else {
				rt.setSv(f, "icon_state", fmt("＀-p", [rt.sv(f, "base_state")]));
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/sparker/proc/attack_ai  (code/game/machinery/igniter.dm:104)  may sleep
rt.def("/obj/machinery/sparker/proc/attack_ai", function* attack_ai(f: Frame) {
	if (truthy(rt.sv(f, "anchored"))) {
		return (yield* g.callName(f, live(f.src), "ignite", []));
	}
	return live(f.dot);
}, true);

// /obj/machinery/sparker/proc/ignite  (code/game/machinery/igniter.dm:109)  may sleep
rt.def("/obj/machinery/sparker/proc/ignite", function* ignite(f: Frame) {
	let location: Value = null;
	f.vars = () => [location];
	if (!truthy((yield* g.srcCall(f, "powered")))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "disable", live(f.src))) || (truthy(rt.fv(f, "last_spark", live(f.src))) && rt.lt(rt.worldTime(f), add(rt.fv(f, "last_spark", live(f.src)), 50))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/flick"), null, [fmt("＀-spark", [rt.sv(f, "base_state")]), live(f.src)]);
	yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	rt.setSv(f, "last_spark", rt.worldTime(f));
	yield* g.srcCall(f, "use_power", 1000);
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [(location = rt.fv(f, "loc", live(f.src)))])))) {
		yield* g.callName(f, live(location), "hotspot_expose", [1000, 500, 1]);
	}
	return 1;
}, true);

// /obj/machinery/sparker/proc/emp_act  (code/game/machinery/igniter.dm:126)  may sleep
rt.def("/obj/machinery/sparker/proc/emp_act", function* emp_act(f: Frame) {
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		yield* g.srcCall(f, "ignite");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });
