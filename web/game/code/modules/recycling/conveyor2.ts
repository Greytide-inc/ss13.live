// From code/modules/recycling/conveyor2.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10919, "/obj/machinery/conveyor/auto", "/obj/machinery/conveyor", {});

// /obj/machinery/conveyor/auto/proc/Initialize  (code/modules/recycling/conveyor2.dm:28)  may sleep
rt.def("/obj/machinery/conveyor/auto/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "operating", 1);
	yield* g.srcCall(f, "update_move_direction");
	return f.dot;
}, true, { args: ["mapload", "newdir"] });

// /obj/machinery/conveyor/auto/proc/update  (code/modules/recycling/conveyor2.dm:33)
rt.def("/obj/machinery/conveyor/auto/proc/update", function update(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.setSv(f, "icon_state", "conveyor-broken");
		rt.setSv(f, "operating", 0);
		return live(f.dot);
	} else {
		if (!truthy(rt.sv(f, "operable"))) {
			rt.setSv(f, "operating", 0);
		} else {
			if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
				rt.setSv(f, "operating", 0);
			} else {
				rt.setSv(f, "operating", 1);
			}
		}
	}
	rt.setSv(f, "icon_state", fmt("conveyor＀", [multiply(rt.sv(f, "operating"), rt.sv(f, "verted"))]));
	return f.dot;
});

rt.type(10916, "/obj/machinery/conveyor", "/obj/machinery", {
	operating: 0,
	operable: 1,
	forwards: null,
	backwards: null,
	movedir: null,
	affecting: null,
	id: "",
	verted: 1,
	anchored: 1,
	speed_process: 1,
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "conveyor0",
	name: "conveyor belt",
	desc: "A conveyor belt.",
});

// /obj/machinery/conveyor/proc/Initialize  (code/modules/recycling/conveyor2.dm:47)  may sleep
rt.def("/obj/machinery/conveyor/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.args[1]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
	}
	yield* g.srcCall(f, "update_move_direction");
	return f.dot;
}, true, { args: ["mapload", "newdir"] });

// /obj/machinery/conveyor/proc/update_move_direction  (code/modules/recycling/conveyor2.dm:53)
rt.def("/obj/machinery/conveyor/proc/update_move_direction", function update_move_direction(f: Frame) {
	let temp: Value = null;
	let $0: any;
	f.vars = () => [temp, $0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "forwards", 1);
		rt.setSv(f, "backwards", 2);
	} else if ($0 === 2) {
		rt.setSv(f, "forwards", 2);
		rt.setSv(f, "backwards", 1);
	} else if ($0 === 4) {
		rt.setSv(f, "forwards", 4);
		rt.setSv(f, "backwards", 8);
	} else if ($0 === 8) {
		rt.setSv(f, "forwards", 8);
		rt.setSv(f, "backwards", 4);
	} else if ($0 === 5) {
		rt.setSv(f, "forwards", 4);
		rt.setSv(f, "backwards", 2);
	} else if ($0 === 9) {
		rt.setSv(f, "forwards", 1);
		rt.setSv(f, "backwards", 4);
	} else if ($0 === 6) {
		rt.setSv(f, "forwards", 2);
		rt.setSv(f, "backwards", 8);
	} else if ($0 === 10) {
		rt.setSv(f, "forwards", 8);
		rt.setSv(f, "backwards", 1);
	}
	if (isEqual(rt.sv(f, "verted"), -1)) {
		temp = rt.sv(f, "forwards");
		rt.setSv(f, "forwards", rt.sv(f, "backwards"));
		rt.setSv(f, "backwards", live(temp));
	}
	if (isEqual(rt.sv(f, "operating"), 1)) {
		rt.setSv(f, "movedir", rt.sv(f, "forwards"));
	} else {
		rt.setSv(f, "movedir", rt.sv(f, "backwards"));
	}
	rt.callSrc(f, "update", []);
	return f.dot;
});

// /obj/machinery/conveyor/proc/update  (code/modules/recycling/conveyor2.dm:89)
rt.def("/obj/machinery/conveyor/proc/update", function update(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.setSv(f, "icon_state", "conveyor-broken");
		rt.setSv(f, "operating", 0);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "operable"))) {
		rt.setSv(f, "operating", 0);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "operating", 0);
	}
	rt.setSv(f, "icon_state", fmt("conveyor＀", [multiply(rt.sv(f, "operating"), rt.sv(f, "verted"))]));
	return f.dot;
});

// /obj/machinery/conveyor/proc/process  (code/modules/recycling/conveyor2.dm:102)  may sleep
rt.def("/obj/machinery/conveyor/proc/process", function* process(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "operating"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "use_power", 100);
	rt.setSv(f, "affecting", subtract(rt.fv(f, "contents", rt.sv(f, "loc")), live(f.src)));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/conveyor/proc/convey"), rt.sv(f, "affecting")])), 1]);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/conveyor/proc/convey  (code/modules/recycling/conveyor2.dm:111)
rt.def("/obj/machinery/conveyor/proc/convey", function convey(f: Frame, affecting: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, live(affecting), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((isEqual(rt.fv(f, "loc", live(A)), rt.sv(f, "loc")) && truthy(rt.callName(f, live(A), "has_gravity", [])))) {
			rt.callName(f, live(A), "ConveyorMove", [rt.sv(f, "movedir")]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { argTypes: [{ path: "/list" }] });

// /obj/machinery/conveyor/proc/attackby  (code/modules/recycling/conveyor2.dm:117)  may sleep
rt.def("/obj/machinery/conveyor/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ struggles to pry up ％！ with ％！.</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You struggle to pry up ％！ with ％！.</span>", [live(f.src), live(f.args[0])])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
				return live(f.dot);
			}
			if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
				rt.setFv(f, "id", (C = (yield* g.new_(f, T("/obj/item/conveyor_construct"), [rt.fv(f, "loc", live(f.src))]))), rt.sv(f, "id"));
				yield* g.srcCall(f, "transfer_fingerprints_to", live(C));
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the conveyor belt.</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.srcCall(f, "setDir", (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -45])));
				yield* g.srcCall(f, "update_move_direction");
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You rotate ＀.</span>", [live(f.src)])]);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
					rt.setSv(f, "verted", multiply(rt.sv(f, "verted"), -1));
					yield* g.srcCall(f, "update_move_direction");
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You reverse ＀'s direction.</span>", [live(f.src)])]);
				}
			} else {
				if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
					if (truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
						rt.setFv(f, "loc", live(f.args[0]), rt.fv(f, "loc", live(f.src)));
					}
				} else {
					return (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/conveyor/proc/attack_hand  (code/modules/recycling/conveyor2.dm:151)  may sleep
rt.def("/obj/machinery/conveyor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "Move_Pulled", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/conveyor/proc/broken  (code/modules/recycling/conveyor2.dm:157)
rt.def("/obj/machinery/conveyor/proc/broken", function broken(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.callSrc(f, "update", []);
	if (truthy((C = rt.locateIn(f, T("/obj/machinery/conveyor"), rt.getStep(f, live(f.src), rt.sv(f, "dir")))))) {
		rt.callName(f, live(C), "set_operable", [rt.sv(f, "dir"), rt.sv(f, "id"), 0]);
	}
	if (!truthy((C = rt.locateIn(f, T("/obj/machinery/conveyor"), rt.getStep(f, live(f.src), rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180])))))) return f.dot;
	rt.callName(f, live(C), "set_operable", [rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]), rt.sv(f, "id"), 0]);
	return f.dot;
});

// /obj/machinery/conveyor/proc/set_operable  (code/modules/recycling/conveyor2.dm:173)
rt.def("/obj/machinery/conveyor/proc/set_operable", function set_operable(f: Frame, stepdir: Value, match_id: Value, op: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (!isEqual(rt.sv(f, "id"), live(match_id))) {
		return live(f.dot);
	}
	rt.setSv(f, "operable", live(op));
	rt.callSrc(f, "update", []);
	if (!truthy((C = rt.locateIn(f, T("/obj/machinery/conveyor"), rt.getStep(f, live(f.src), live(stepdir)))))) return f.dot;
	rt.callName(f, live(C), "set_operable", [live(stepdir), rt.sv(f, "id"), live(op)]);
	return f.dot;
});

// /obj/machinery/conveyor/proc/power_change  (code/modules/recycling/conveyor2.dm:189)
rt.def("/obj/machinery/conveyor/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update", []);
	return f.dot;
});

rt.type(10982, "/obj/machinery/conveyor_switch", "/obj/machinery", {
	position: 0,
	last_pos: -1,
	operated: 1,
	convdir: 0,
	id: "",
	conveyors: null,
	anchored: 1,
	speed_process: 1,
	name: "conveyor switch",
	desc: "A conveyor control switch.",
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "switch-off",
});

// /obj/machinery/conveyor_switch/proc/Initialize  (code/modules/recycling/conveyor2.dm:216)  may sleep
rt.def("/obj/machinery/conveyor_switch/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "id"))) {
		rt.setSv(f, "id", live(f.args[1]));
	}
	yield* g.srcCall(f, "update");
	return 1;
}, true, { args: ["mapload", "newid"] });

// /obj/machinery/conveyor_switch/proc/LateInitialize  (code/modules/recycling/conveyor2.dm:224)
rt.def("/obj/machinery/conveyor_switch/proc/LateInitialize", function LateInitialize(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	rt.setSv(f, "conveyors", rt.list());
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/conveyor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "id", live(C)), rt.sv(f, "id"))) {
			rt.modSrcVar(f, "conveyors", live(C), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/conveyor_switch/proc/update  (code/modules/recycling/conveyor2.dm:232)
rt.def("/obj/machinery/conveyor_switch/proc/update", function update(f: Frame) {
	if (rt.lt(rt.sv(f, "position"), 0)) {
		rt.setSv(f, "icon_state", "switch-rev");
	} else {
		if (rt.gt(rt.sv(f, "position"), 0)) {
			rt.setSv(f, "icon_state", "switch-fwd");
		} else {
			rt.setSv(f, "icon_state", "switch-off");
		}
	}
	return f.dot;
});

// /obj/machinery/conveyor_switch/proc/process  (code/modules/recycling/conveyor2.dm:244)  may sleep
rt.def("/obj/machinery/conveyor_switch/proc/process", function* process(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	if (!truthy(rt.sv(f, "operated"))) {
		return live(f.dot);
	}
	rt.setSv(f, "operated", 0);
	C = null;
	rt.forList(f, 0, rt.sv(f, "conveyors"), T("/obj/machinery/conveyor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		rt.setFv(f, "operating", live(C), rt.sv(f, "position"));
		yield* g.callName(f, live(C), "update_move_direction", []);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/conveyor_switch/proc/attack_hand  (code/modules/recycling/conveyor2.dm:255)  may sleep
rt.def("/obj/machinery/conveyor_switch/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [user, S, $e];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (isEqual(rt.sv(f, "position"), 0)) {
		if (truthy(rt.sv(f, "convdir"))) {
			rt.setSv(f, "position", rt.sv(f, "convdir"));
		} else {
			if (rt.lt(rt.sv(f, "last_pos"), 0)) {
				rt.setSv(f, "position", 1);
				rt.setSv(f, "last_pos", 0);
			} else {
				rt.setSv(f, "position", -1);
				rt.setSv(f, "last_pos", 0);
			}
		}
	} else {
		rt.setSv(f, "last_pos", rt.sv(f, "position"));
		rt.setSv(f, "position", 0);
	}
	rt.setSv(f, "operated", 1);
	yield* g.srcCall(f, "update");
	S = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/conveyor_switch"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.fv(f, "id", live(S)), rt.fv(f, "id", live(f.src)))) {
			rt.setFv(f, "position", live(S), rt.sv(f, "position"));
			yield* g.callName(f, live(S), "update", []);
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/conveyor_switch/proc/attackby  (code/modules/recycling/conveyor2.dm:281)  may sleep
rt.def("/obj/machinery/conveyor_switch/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null;
	f.vars = () => [I, user, params, C];
	if (!truthy((rt.istype(live(I), T("/obj/item/weapon/crowbar")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "id", (C = (yield* g.new_(f, T("/obj/item/conveyor_switch_construct"), [rt.fv(f, "loc", live(f.src))]))), rt.sv(f, "id"));
	yield* g.srcCall(f, "transfer_fingerprints_to", live(C));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You deattach the conveyor switch.</span>"]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10135, "/obj/item/conveyor_construct", "/obj/item", {
	id: "",
	w_class: 4,
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "conveyor0",
	name: "conveyor belt assembly",
	desc: "A conveyor belt assembly.",
});

// /obj/item/conveyor_construct/proc/attackby  (code/modules/recycling/conveyor2.dm:305)  may sleep
rt.def("/obj/item/conveyor_construct/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/conveyor_switch_construct")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You link the switch to the conveyor belt assembly.</span>"]);
	rt.setSv(f, "id", rt.gv(f, "id", (C = live(f.args[0]))));
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/conveyor_construct/proc/afterattack  (code/modules/recycling/conveyor2.dm:312)  may sleep
rt.def("/obj/item/conveyor_construct/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let cdir: Value = null, C: Value = null;
	f.vars = () => [A, user, proximity, cdir, C];
	if ((((!truthy(live(proximity)) || truthy(rt.fv(f, "stat", live(user)))) || !truthy((rt.istype(live(A), T("/turf/open/floor")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/shuttle")) ? 1 : 0)))) {
		return live(f.dot);
	}
	cdir = rt.getDir(f, live(A), live(user));
	if (isEqual(live(A), rt.fv(f, "loc", live(user)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You cannot place a conveyor belt under yourself.</span>"]);
		return live(f.dot);
	}
	rt.setFv(f, "id", (C = (yield* g.new_(f, T("/obj/machinery/conveyor"), [live(A), live(cdir)]))), rt.sv(f, "id"));
	yield* g.srcCall(f, "transfer_fingerprints_to", live(C));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10136, "/obj/item/conveyor_switch_construct", "/obj/item", {
	id: "",
	w_class: 4,
	name: "conveyor switch assembly",
	desc: "A conveyor control switch assembly.",
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "switch-off",
});

// /obj/item/conveyor_switch_construct/proc/Initialize  (code/modules/recycling/conveyor2.dm:332)  may sleep
rt.def("/obj/item/conveyor_switch_construct/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "id", (yield* g.call(f, P("/proc/rand"), null, [])));
	return f.dot;
}, true);

// /obj/item/conveyor_switch_construct/proc/afterattack  (code/modules/recycling/conveyor2.dm:336)  may sleep
rt.def("/obj/item/conveyor_switch_construct/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let found: Value = null, C: Value = null, NC: Value = null;
	let $e: any;
	f.vars = () => [A, user, proximity, found, C, NC, $e];
	if ((((!truthy(live(proximity)) || truthy(rt.fv(f, "stat", live(user)))) || !truthy((rt.istype(live(A), T("/turf/open/floor")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/shuttle")) ? 1 : 0)))) {
		return live(f.dot);
	}
	found = 0;
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [])), T("/obj/machinery/conveyor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "id", live(C)), rt.fv(f, "id", live(f.src)))) {
			found = 1;
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(found))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀<span class=notice>The conveyor switch did not detect any linked conveyor belts in range.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "transfer_fingerprints_to", (NC = (yield* g.new_(f, T("/obj/machinery/conveyor_switch"), [live(A), rt.sv(f, "id")]))));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
