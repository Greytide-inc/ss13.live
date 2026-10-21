// From code/game/objects/structures/transit_tubes/transit_tube_pod.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12927, "/obj/structure/transit_tube_pod", "/obj/structure", {
	moving: 0,
	air_contents: null,
	anchored: 1,
	icon: rt.rsc("icons/obj/atmospherics/pipes/transit_tube.dmi"),
	icon_state: "pod",
	animate_movement: 1,
	density: 1,
	layer: 2.9,
});

// /obj/structure/transit_tube_pod/proc/<init>  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:9)
rt.def("/obj/structure/transit_tube_pod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "air_contents", rt.new_(f, T("/datum/gas_mixture"), []));
	return f.dot;
});

// /obj/structure/transit_tube_pod/proc/New  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:13)  may sleep
rt.def("/obj/structure/transit_tube_pod/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gases", ["o2", "n2"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "o2"), 1, 43.67319107055664);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "n2"), 1, 82.14720153808594);
	rt.setFv(f, "temperature", rt.sv(f, "air_contents"), 293.1499938964844);
	return f.dot;
}, true, { args: ["loc"] });

// /obj/structure/transit_tube_pod/proc/Destroy  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:21)  may sleep
rt.def("/obj/structure/transit_tube_pod/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "empty_pod");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/transit_tube_pod/proc/update_icon  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:25)
rt.def("/obj/structure/transit_tube_pod/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.len(f, rt.sv(f, "contents")))) {
		rt.setSv(f, "icon_state", "pod_occupied");
	} else {
		rt.setSv(f, "icon_state", "pod");
	}
	return f.dot;
});

// /obj/structure/transit_tube_pod/proc/attackby  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:31)  may sleep
rt.def("/obj/structure/transit_tube_pod/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "moving"))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if (truthy(rt.len(f, rt.sv(f, "contents")))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ empties ％！.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You empty ％！.</span>", [live(f.src)])]);
				yield* g.srcCall(f, "empty_pod");
			} else {
				yield* g.srcCall(f, "deconstruct", 1, live(f.args[1]));
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/transit_tube_pod/proc/deconstruct  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:43)  may sleep
rt.def("/obj/structure/transit_tube_pod/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value, user: Value) {
	let location: Value = null, R: Value = null;
	f.vars = () => [disassembled, user, location, R];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		location = rt.getStep(f, live(f.src), 0);
		if (truthy(live(user))) {
			location = rt.fv(f, "loc", live(user));
			yield* g.srcCall(f, "add_fingerprint", live(user));
			yield* g.callName(f, live(user), "visible_message", [fmt("＀ removes ＀.", [live(user), live(f.src)]), fmt("<span class='notice'>You remove ＀.</span>", [live(f.src)])]);
		}
		yield* g.srcCall(f, "transfer_fingerprints_to", (R = (yield* g.new_(f, T("/obj/structure/c_transit_tube_pod"), [live(location)]))));
		yield* g.callName(f, live(R), "setDir", [rt.sv(f, "dir")]);
		yield* g.srcCall(f, "empty_pod", live(location));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/transit_tube_pod/proc/ex_act  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:56)  may sleep
rt.def("/obj/structure/transit_tube_pod/proc/ex_act", function* ex_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	yield* g.srcCall(f, "empty_pod");
	return f.dot;
}, true, { args: ["severity", "target"], waitfor: false });

// /obj/structure/transit_tube_pod/proc/contents_explosion  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:61)
rt.def("/obj/structure/transit_tube_pod/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	AM = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		rt.callName(f, live(AM), "ex_act", [live(severity), live(target)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/structure/transit_tube_pod/proc/singularity_pull  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:65)  may sleep
rt.def("/obj/structure/transit_tube_pod/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 9)) return f.dot;
	yield* g.srcCall(f, "deconstruct", 0);
	return f.dot;
}, true);

// /obj/structure/transit_tube_pod/proc/container_resist  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:69)  may sleep
rt.def("/obj/structure/transit_tube_pod/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "moving"))) return f.dot;
	yield* g.callName(f, live(user), "changeNext_move", [100]);
	rt.setFv(f, "last_special", live(user), add(rt.worldTime(f), 100));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start trying to escape from the pod...</span>"]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 600, "target", live(f.src)], rt.Args.Named)))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You manage to open the pod.</span>"]);
	yield* g.srcCall(f, "empty_pod");
	return f.dot;
}, true);

// /obj/structure/transit_tube_pod/proc/empty_pod  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:78)  may sleep
rt.def("/obj/structure/transit_tube_pod/proc/empty_pod", function* empty_pod(f: Frame, location: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [location, M, $e];
	if (!truthy(live(location))) {
		location = rt.getStep(f, live(f.src), 0);
	}
	M = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "forceMove", [live(location)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/transit_tube_pod/proc/Process_Spacemove  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:86)
rt.def("/obj/structure/transit_tube_pod/proc/Process_Spacemove", function Process_Spacemove(f: Frame) {
	if (truthy(rt.sv(f, "moving"))) {
		return 1;
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
});

// /obj/structure/transit_tube_pod/proc/follow_tube  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:102)  may sleep
rt.def("/obj/structure/transit_tube_pod/proc/follow_tube", function* follow_tube(f: Frame) {
	let current_tube: Value = null, next_dir: Value = null, next_loc: Value = null, last_delay: Value = null, exit_delay: Value = null, tube: Value = null, TT: Value = null;
	let $e: any;
	f.vars = () => [current_tube, next_dir, next_loc, last_delay, exit_delay, tube, TT, $e];
	if (truthy(rt.sv(f, "moving"))) {
		return live(f.dot);
	}
	rt.setSv(f, "moving", 1);
	current_tube = null;
	next_dir = null;
	next_loc = null;
	last_delay = 0;
	exit_delay = null;
	tube = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/transit_tube"));
	while (($e = rt.next(f, 0)) !== undefined) {
		tube = $e;
		if (truthy((yield* g.callName(f, live(tube), "has_exit", [rt.sv(f, "dir")])))) {
			current_tube = live(tube);
			break;
		}
	}
	rt.endFor(f, 0);
	while (truthy(live(current_tube))) {
		if (!truthy((next_dir = (yield* g.callName(f, live(current_tube), "get_exit", [rt.sv(f, "dir")]))))) {
			break;
		}
		last_delay = rt.modify(live(last_delay), (exit_delay = (yield* g.callName(f, live(current_tube), "exit_delay", [live(f.src), rt.sv(f, "dir")]))), add);
		yield* g.call(f, P("/proc/sleep"), null, [live(exit_delay)]);
		next_loc = rt.getStep(f, rt.sv(f, "loc"), live(next_dir));
		current_tube = null;
		tube = null;
		rt.forList(f, 0, live(next_loc), T("/obj/structure/transit_tube"));
		while (($e = rt.next(f, 0)) !== undefined) {
			tube = $e;
			if (truthy((yield* g.callName(f, live(tube), "has_entrance", [live(next_dir)])))) {
				current_tube = live(tube);
				break;
			}
		}
		rt.endFor(f, 0);
		if (live(current_tube) === null) {
			yield* g.srcCall(f, "setDir", live(next_dir));
			yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "loc"), rt.sv(f, "dir")), rt.sv(f, "dir"));
			break;
		}
		yield* g.call(f, P("/proc/sleep"), null, [(last_delay = (yield* g.callName(f, live(current_tube), "enter_delay", [live(f.src), live(next_dir)])))]);
		yield* g.srcCall(f, "setDir", live(next_dir));
		rt.setSv(f, "loc", live(next_loc));
		rt.setSv(f, "density", rt.fv(f, "density", live(current_tube)));
		if ((truthy(live(current_tube)) && truthy((yield* g.callName(f, live(current_tube), "should_stop_pod", [live(f.src), live(next_dir)]))))) {
			yield* g.callName(f, live(current_tube), "pod_stopped", [live(f.src), rt.sv(f, "dir")]);
			break;
		}
	}
	rt.setSv(f, "density", 1);
	rt.setSv(f, "moving", 0);
	if (!(!truthy((TT = rt.locateIn(f, T("/obj/structure/transit_tube"), rt.sv(f, "loc")))) || (!truthy((rt.isIn(f, rt.sv(f, "dir"), rt.fv(f, "tube_dirs", live(TT))) ? 1 : 0)) && !truthy((rt.isIn(f, (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180])), rt.fv(f, "tube_dirs", live(TT))) ? 1 : 0))))) return f.dot;
	yield* g.srcCall(f, "deconstruct", 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/transit_tube_pod/proc/assume_air  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:152)
rt.def("/obj/structure/transit_tube_pod/proc/assume_air", function assume_air(f: Frame, giver: Value) {
	return rt.callName(f, rt.sv(f, "air_contents"), "merge", [live(giver)]);
});

// /obj/structure/transit_tube_pod/proc/remove_air  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:155)  may sleep
rt.def("/obj/structure/transit_tube_pod/proc/remove_air", function* remove_air(f: Frame, amount: Value) {
	f.vars = () => [amount];
	return (yield* g.callName(f, rt.sv(f, "air_contents"), "remove", [live(amount)]));
}, true);

// /obj/structure/transit_tube_pod/proc/relaymove  (code/game/objects/structures/transit_tubes/transit_tube_pod.dm:158)  may sleep
rt.def("/obj/structure/transit_tube_pod/proc/relaymove", function* relaymove(f: Frame, mob: Value, direction: Value) {
	let station: Value = null, TT: Value = null;
	let $e: any;
	f.vars = () => [mob, direction, station, TT, $e];
	if (!(truthy((rt.istype(live(mob), T("/mob")) ? 1 : 0)) && truthy(rt.fv(f, "client", live(mob))))) return f.dot;
	if (truthy(rt.sv(f, "moving"))) return f.dot;
	station = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/transit_tube/station"));
	while (($e = rt.next(f, 0)) !== undefined) {
		station = $e;
		if (!truthy(rt.fv(f, "pod_moving", live(station)))) {
			if (isEqual(live(direction), (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "boarding_dir", live(station)), 180])))) {
				if (isEqual(rt.fv(f, "open_status", live(station)), 0)) {
					yield* g.callName(f, live(mob), "forceMove", [rt.sv(f, "loc")]);
					yield* g.srcCall(f, "update_icon");
				} else {
					yield* g.callName(f, live(station), "open_animation", []);
				}
			} else {
				if (truthy((rt.isIn(f, live(direction), rt.fv(f, "tube_dirs", live(station))) ? 1 : 0))) {
					yield* g.srcCall(f, "setDir", live(direction));
					yield* g.callName(f, live(station), "launch_pod", []);
				}
			}
		}
		return live(f.dot);
	}
	rt.endFor(f, 0);
	TT = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/transit_tube"));
	while (($e = rt.next(f, 0)) !== undefined) {
		TT = $e;
		if (truthy((rt.isIn(f, rt.sv(f, "dir"), rt.fv(f, "tube_dirs", live(TT))) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, live(TT), "has_exit", [live(direction)])))) {
				yield* g.srcCall(f, "setDir", live(direction));
				return live(f.dot);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
