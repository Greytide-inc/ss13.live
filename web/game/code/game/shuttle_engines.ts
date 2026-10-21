// From code/game/shuttle_engines.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12125, "/obj/structure/shuttle", "/obj/structure", {
	name: "shuttle",
	icon: rt.rsc("icons/turf/shuttle.dmi"),
	resistance_flags: 35,
	obj_integrity: 500,
	max_integrity: 500,
	armor: null,
});

// /obj/structure/shuttle/proc/<init>  (code/game/shuttle_engines.dm:12)
rt.def("/obj/structure/shuttle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 70]));
	return f.dot;
});

rt.type(12126, "/obj/structure/shuttle/engine", "/obj/structure/shuttle", {
	engine_power: 1,
	state: 2,
	anchored: 1,
	name: "engine",
	density: 1,
});

// /obj/structure/shuttle/engine/proc/can_be_unfasten_wrench  (code/game/shuttle_engines.dm:23)
rt.def("/obj/structure/shuttle/engine/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame) {
	if (isEqual(rt.sv(f, "state"), 2)) {
		if (!truthy(live(f.args[1]))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ is welded to the floor!</span>", [live(f.src)])]);
		}
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "silent"] });

// /obj/structure/shuttle/engine/proc/default_unfasten_wrench  (code/game/shuttle_engines.dm:30)  may sleep
rt.def("/obj/structure/shuttle/engine/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(live(f.dot), 2)) return f.dot;
	if (truthy(rt.sv(f, "anchored"))) {
		rt.setSv(f, "state", 1);
	} else {
		rt.setSv(f, "state", 0);
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// /obj/structure/shuttle/engine/proc/attackby  (code/game/shuttle_engines.dm:38)  may sleep
rt.def("/obj/structure/shuttle/engine/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	let $0: any;
	f.vars = () => [WT, $0];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			WT = live(f.args[0]);
			$0 = rt.sv(f, "state");
			if ($0 === 0) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ needs to be wrenched to the floor!</span>", [rt.fv(f, "name", live(f.src))])]);
			} else if ($0 === 1) {
				if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to weld the ＀ to the floor.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), fmt("<span class='notice'>You start to weld ％！ to the floor...</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
					if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(200, rt.fv(f, "toolspeed", live(WT))), "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
						rt.setSv(f, "state", 2);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You weld ％！ to the floor.</span>", [live(f.src)])]);
						yield* g.srcCall(f, "alter_engine_power", rt.sv(f, "engine_power"));
					}
				}
			} else if ($0 === 2) {
				if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to cut the ＀ free from the floor.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), fmt("<span class='notice'>You start to cut ％！ free from the floor...</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
					if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(200, rt.fv(f, "toolspeed", live(WT))), "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
						rt.setSv(f, "state", 1);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cut ％！ free from the floor.</span>", [live(f.src)])]);
						yield* g.srcCall(f, "alter_engine_power", rt.neg(rt.sv(f, "engine_power")));
					}
				}
			}
			return live(f.dot);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/shuttle/engine/proc/Destroy  (code/game/shuttle_engines.dm:71)  may sleep
rt.def("/obj/structure/shuttle/engine/proc/Destroy", function* Destroy(f: Frame) {
	if (isEqual(rt.sv(f, "state"), 2)) {
		yield* g.srcCall(f, "alter_engine_power", rt.neg(rt.sv(f, "engine_power")));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/structure/shuttle/engine/proc/alter_engine_power  (code/game/shuttle_engines.dm:77)
rt.def("/obj/structure/shuttle/engine/proc/alter_engine_power", function alter_engine_power(f: Frame, mod: Value) {
	let M: Value = null;
	f.vars = () => [M];
	if (isEqual(live(mod), 0)) {
		return live(f.dot);
	}
	if (!truthy(rt.callName(f, rt.gl("SSshuttle"), "is_in_shuttle_bounds", [live(f.src)]))) return f.dot;
	if (!truthy((M = rt.callName(f, rt.gl("SSshuttle"), "get_containing_shuttle", [live(f.src)])))) return f.dot;
	rt.callName(f, live(M), "alter_engines", [live(mod)]);
	return f.dot;
});
