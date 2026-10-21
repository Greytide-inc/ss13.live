// From code/modules/surgery/bodyparts/robot_bodyparts.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10171, "/obj/item/bodypart/chest/robot", "/obj/item/bodypart/chest", {
	wired: 0,
	cell: null,
	item_state: "buildpipe",
	flags: 64,
	status: 2,
	name: "cyborg torso",
	desc: "A heavily reinforced case containing cyborg logic boards, with space for a standard power cell.",
	icon: rt.rsc("icons/obj/robot_parts.dmi"),
	icon_state: "borg_chest",
});

// /obj/item/bodypart/chest/robot/proc/attackby  (code/modules/surgery/bodyparts/robot_bodyparts.dm:59)  may sleep
rt.def("/obj/item/bodypart/chest/robot/proc/attackby", function* attackby(f: Frame) {
	let coil: Value = null;
	f.vars = () => [coil];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
		if (truthy(rt.fv(f, "cell", live(f.src)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You have already inserted a cell!</span>"]);
			return live(f.dot);
		} else {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setFv(f, "cell", live(f.src), live(f.args[0]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You insert the cell.</span>"]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
			if (truthy(rt.fv(f, "wired", live(f.src)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You have already inserted wire!</span>"]);
				return live(f.dot);
			}
			if (truthy((yield* g.callName(f, (coil = live(f.args[0])), "use", [1])))) {
				rt.setFv(f, "wired", live(f.src), 1);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You insert the wire.</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one length of coil to wire it!</span>"]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/bodypart/chest/robot/proc/Destroy  (code/modules/surgery/bodyparts/robot_bodyparts.dm:83)  may sleep
rt.def("/obj/item/bodypart/chest/robot/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "cell"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cell")]);
		rt.setSv(f, "cell", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/bodypart/chest/robot/proc/drop_organs  (code/modules/surgery/bodyparts/robot_bodyparts.dm:90)  may sleep
rt.def("/obj/item/bodypart/chest/robot/proc/drop_organs", function* drop_organs(f: Frame) {
	if (truthy(rt.sv(f, "wired"))) {
		yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.fv(f, "loc", live(f.args[0])), 1]);
	}
	if (truthy(rt.sv(f, "cell"))) {
		yield* g.callName(f, rt.sv(f, "cell"), "forceMove", [rt.fv(f, "loc", live(f.args[0]))]);
		rt.setSv(f, "cell", null);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(10203, "/obj/item/bodypart/head/robot", "/obj/item/bodypart/head", {
	flash1: null,
	flash2: null,
	item_state: "buildpipe",
	flags: 64,
	status: 2,
	name: "cyborg head",
	desc: "A standard reinforced braincase, with spine-plugged neural socket and sensor gimbals.",
	icon: rt.rsc("icons/obj/robot_parts.dmi"),
	icon_state: "borg_head",
});

// /obj/item/bodypart/head/robot/proc/attackby  (code/modules/surgery/bodyparts/robot_bodyparts.dm:111)  may sleep
rt.def("/obj/item/bodypart/head/robot/proc/attackby", function* attackby(f: Frame) {
	let F: Value = null;
	f.vars = () => [F];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/flash/handheld")) ? 1 : 0))) {
		F = live(f.args[0]);
		if ((truthy(rt.fv(f, "flash1", live(f.src))) && truthy(rt.fv(f, "flash2", live(f.src))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You have already inserted the eyes!</span>"]);
			return live(f.dot);
		} else {
			if (truthy(rt.fv(f, "crit_fail", live(F)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't use a broken flash!</span>"]);
				return live(f.dot);
			} else {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(F), live(f.src)])))) {
					return live(f.dot);
				}
				if (truthy(rt.fv(f, "flash1", live(f.src)))) {
					rt.setFv(f, "flash2", live(f.src), live(F));
				} else {
					rt.setFv(f, "flash1", live(f.src), live(F));
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You insert the flash into the eye socket.</span>"]);
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			if ((truthy(rt.sv(f, "flash1")) || truthy(rt.sv(f, "flash2")))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You remove the flash from ＀.</span>", [live(f.src)])]);
				if (truthy(rt.sv(f, "flash1"))) {
					yield* g.callName(f, rt.sv(f, "flash1"), "forceMove", [rt.fv(f, "loc", live(f.args[1]))]);
					rt.setSv(f, "flash1", null);
				}
				if (truthy(rt.sv(f, "flash2"))) {
					yield* g.callName(f, rt.sv(f, "flash2"), "forceMove", [rt.fv(f, "loc", live(f.args[1]))]);
					rt.setSv(f, "flash2", null);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There are no flash to remove from ＀.</span>", [live(f.src)])]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/bodypart/head/robot/proc/Destroy  (code/modules/surgery/bodyparts/robot_bodyparts.dm:145)  may sleep
rt.def("/obj/item/bodypart/head/robot/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "flash1"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "flash1")]);
		rt.setSv(f, "flash1", null);
	}
	if (truthy(rt.sv(f, "flash2"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "flash2")]);
		rt.setSv(f, "flash2", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/bodypart/head/robot/proc/drop_organs  (code/modules/surgery/bodyparts/robot_bodyparts.dm:155)  may sleep
rt.def("/obj/item/bodypart/head/robot/proc/drop_organs", function* drop_organs(f: Frame) {
	if (truthy(rt.sv(f, "flash1"))) {
		yield* g.callName(f, rt.sv(f, "flash1"), "forceMove", [rt.fv(f, "loc", live(f.args[0]))]);
		rt.setSv(f, "flash1", null);
	}
	if (truthy(rt.sv(f, "flash2"))) {
		yield* g.callName(f, rt.sv(f, "flash2"), "forceMove", [rt.fv(f, "loc", live(f.args[0]))]);
		rt.setSv(f, "flash2", null);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });
