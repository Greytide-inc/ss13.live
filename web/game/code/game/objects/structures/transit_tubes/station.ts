// From code/game/objects/structures/transit_tubes/station.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12899, "/obj/structure/transit_tube/station", "/obj/structure/transit_tube", {
	open_status: 2,
	pod_moving: 0,
	cooldown_delay: 50,
	launch_cooldown: 0,
	reverse_launch: 0,
	base_icon: "station0",
	boarding_dir: null,
	OPEN_DURATION: 6,
	CLOSE_DURATION: 6,
	name: "station tube station",
	icon_state: "closed_station0",
	exit_delay: 1,
	enter_delay: 2,
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/station"),
}, { const: ["OPEN_DURATION","CLOSE_DURATION"] });

// /obj/structure/transit_tube/station/proc/New  (code/game/objects/structures/transit_tubes/station.dm:25)  may sleep
rt.def("/obj/structure/transit_tube/station/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/structure/transit_tube/station/proc/Destroy  (code/game/objects/structures/transit_tubes/station.dm:29)  may sleep
rt.def("/obj/structure/transit_tube/station/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/transit_tube/station/proc/Bumped  (code/game/objects/structures/transit_tubes/station.dm:36)  may sleep
rt.def("/obj/structure/transit_tube/station/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let pod: Value = null;
	let $e: any;
	f.vars = () => [AM, pod, $e];
	if (!(((!truthy(rt.sv(f, "pod_moving")) && isEqual(rt.sv(f, "open_status"), 0)) && truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) && isEqual(rt.fv(f, "dir", live(AM)), rt.sv(f, "boarding_dir")))) return f.dot;
	pod = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/transit_tube_pod"));
	while (($e = rt.next(f, 0)) !== undefined) {
		pod = $e;
		if (!truthy(rt.fv(f, "moving", live(pod)))) {
			yield* g.callName(f, live(AM), "forceMove", [live(pod)]);
			yield* g.callName(f, live(pod), "update_icon", []);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/transit_tube/station/proc/MouseDrop_T  (code/game/objects/structures/transit_tubes/station.dm:46)  may sleep
rt.def("/obj/structure/transit_tube/station/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, R: Value, user: Value) {
	let pod: Value = null, TP: Value = null;
	let $e: any;
	f.vars = () => [R, user, pod, TP, $e];
	if (((!truthy(rt.fv(f, "canmove", live(user))) || truthy(rt.fv(f, "stat", live(user)))) || truthy((yield* g.callName(f, live(user), "restrained", []))))) {
		return live(f.dot);
	}
	if (((!truthy((rt.istype(live(R), T("/obj/structure/c_transit_tube_pod")) ? 1 : 0)) || rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(f.src)])), 1)) || rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(R)])), 1))) {
		return live(f.dot);
	}
	pod = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/transit_tube_pod"));
	while (($e = rt.next(f, 0)) !== undefined) {
		pod = $e;
		return live(f.dot);
	}
	rt.endFor(f, 0);
	TP = (yield* g.new_(f, T("/obj/structure/transit_tube_pod"), [rt.sv(f, "loc")]));
	yield* g.callName(f, live(R), "transfer_fingerprints_to", [live(TP)]);
	yield* g.callName(f, live(TP), "add_fingerprint", [live(user)]);
	yield* g.callName(f, live(TP), "setDir", [(yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(f.src)), -90]))]);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ inserts ＀.", [live(user), live(R)]), fmt("<span class='notice'>You insert ＀.</span>", [live(R)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
	return f.dot;
}, true);

// /obj/structure/transit_tube/station/proc/attack_hand  (code/game/objects/structures/transit_tubes/station.dm:61)  may sleep
rt.def("/obj/structure/transit_tube/station/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let GM: Value = null, pod: Value = null, pod_0: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [user, GM, pod, pod_0, AM, $e];
	if (truthy(rt.sv(f, "pod_moving"))) return f.dot;
	if (((truthy(rt.fv(f, "pulling", live(user))) && isEqual(rt.fv(f, "a_intent", live(user)), "grab")) && truthy((rt.istype(rt.fv(f, "pulling", live(user)), T("/mob/living")) ? 1 : 0)))) {
		if (isEqual(rt.sv(f, "open_status"), 0)) {
			GM = rt.fv(f, "pulling", live(user));
			if (rt.ge(rt.fv(f, "grab_state", live(user)), 1)) {
				if ((truthy(rt.fv(f, "buckled", live(GM))) || truthy((yield* g.callName(f, live(GM), "has_buckled_mobs", []))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is attached to something!</span>", [live(GM)])]);
					return live(f.dot);
				}
				pod = null;
				rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/transit_tube_pod"));
				if (($e = rt.next(f, 0)) !== undefined) {
					pod = $e;
					yield* g.callName(f, live(pod), "visible_message", [fmt("<span class='warning'>＀ starts putting ＀ into the ＀!</span>", [live(user), live(GM), live(pod)])]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 15, "target", live(f.src)], rt.Args.Named)))) {
						if ((((((isEqual(rt.sv(f, "open_status"), 0) && truthy(live(GM))) && rt.ge(rt.fv(f, "grab_state", live(user)), 1)) && isEqual(rt.fv(f, "pulling", live(user)), live(GM))) && !truthy(rt.fv(f, "buckled", live(GM)))) && !truthy((yield* g.callName(f, live(GM), "has_buckled_mobs", []))))) {
							yield* g.callName(f, live(GM), "Knockdown", [100]);
							yield* g.callName(f, live(f.src), "Bumped", [live(GM)]);
						}
					}
				}
				rt.endFor(f, 0);
			}
		}
	} else {
		pod_0 = null;
		rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/transit_tube_pod"));
		if (($e = rt.next(f, 0)) !== undefined) {
			pod_0 = $e;
			if ((!truthy(rt.fv(f, "moving", live(pod_0))) && truthy((rt.isIn(f, rt.fv(f, "dir", live(pod_0)), rt.sv(f, "tube_dirs")) ? 1 : 0)))) {
				if (isEqual(rt.sv(f, "open_status"), 2)) {
					yield* g.srcCall(f, "open_animation");
				} else {
					if (isEqual(rt.sv(f, "open_status"), 0)) {
						if ((truthy(rt.getLen(f, rt.fv(f, "contents", live(pod_0)))) && !isEqual(rt.fv(f, "loc", live(user)), live(pod_0)))) {
							yield* g.callName(f, live(user), "visible_message", [fmt("＀ starts emptying ＀'s contents onto the floor.", [live(user), live(pod_0)]), fmt("<span class='notice'>You start emptying ＀'s contents onto the floor...</span>", [live(pod_0)])]);
							if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 10, "target", live(f.src)], rt.Args.Named)))) {
								if ((truthy(live(pod_0)) && isEqual(rt.fv(f, "loc", live(pod_0)), rt.sv(f, "loc")))) {
									AM = null;
									rt.forList(f, 1, live(pod_0), T("/atom/movable"));
									while (($e = rt.next(f, 1)) !== undefined) {
										AM = $e;
										yield* g.callName(f, live(AM), "forceMove", [rt.getStep(f, live(user), 0)]);
									}
									rt.endFor(f, 1);
								}
							}
						} else {
							yield* g.srcCall(f, "close_animation");
						}
					}
				}
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /obj/structure/transit_tube/station/proc/attackby  (code/game/objects/structures/transit_tubes/station.dm:96)  may sleep
rt.def("/obj/structure/transit_tube/station/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		_P = null;
		rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/transit_tube_pod"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			yield* g.callName(f, live(_P), "deconstruct", [0, live(f.args[1])]);
		}
		rt.endFor(f, 0);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/transit_tube/station/proc/open_animation  (code/game/objects/structures/transit_tubes/station.dm:103)
rt.def("/obj/structure/transit_tube/station/proc/open_animation", function open_animation(f: Frame) {
	if (!isEqual(rt.sv(f, "open_status"), 2)) return f.dot;
	rt.setSv(f, "icon_state", fmt("opening_＀", [rt.sv(f, "base_icon")]));
	rt.setSv(f, "open_status", 1);
	rt.spawnTail(f, 6, "/obj/structure/transit_tube/station/proc/open_animation: spawn at game/objects/structures/transit_tubes/station.dm:106");
	return f.dot;
});

// a spawn(6) body of /obj/structure/transit_tube/station/proc/open_animation, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/transit_tube/station/proc/open_animation: spawn at game/objects/structures/transit_tubes/station.dm:106", function* (f: Frame) {
	if (isEqual(rt.sv(f, "open_status"), 1)) {
		rt.setSv(f, "icon_state", fmt("open_＀", [rt.sv(f, "base_icon")]));
		rt.setSv(f, "open_status", 0);
	}
	return null;
});

// /obj/structure/transit_tube/station/proc/close_animation  (code/game/objects/structures/transit_tubes/station.dm:113)
rt.def("/obj/structure/transit_tube/station/proc/close_animation", function close_animation(f: Frame) {
	if (!isEqual(rt.sv(f, "open_status"), 0)) return f.dot;
	rt.setSv(f, "icon_state", fmt("closing_＀", [rt.sv(f, "base_icon")]));
	rt.setSv(f, "open_status", 3);
	rt.spawnTail(f, 6, "/obj/structure/transit_tube/station/proc/close_animation: spawn at game/objects/structures/transit_tubes/station.dm:116");
	return f.dot;
});

// a spawn(6) body of /obj/structure/transit_tube/station/proc/close_animation, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/transit_tube/station/proc/close_animation: spawn at game/objects/structures/transit_tubes/station.dm:116", function* (f: Frame) {
	if (isEqual(rt.sv(f, "open_status"), 3)) {
		rt.setSv(f, "icon_state", fmt("closed_＀", [rt.sv(f, "base_icon")]));
		rt.setSv(f, "open_status", 2);
	}
	return null;
});

// /obj/structure/transit_tube/station/proc/launch_pod  (code/game/objects/structures/transit_tubes/station.dm:123)  may sleep
rt.def("/obj/structure/transit_tube/station/proc/launch_pod", function* launch_pod(f: Frame) {
	let pod: Value = null;
	let $e: any;
	f.vars = () => [pod, $e];
	if (rt.ge(rt.sv(f, "launch_cooldown"), rt.worldTime(f))) {
		return live(f.dot);
	}
	pod = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/transit_tube_pod"));
	while (($e = rt.next(f, 0)) !== undefined) {
		pod = $e;
		if (!truthy(rt.fv(f, "moving", live(pod)))) {
			rt.setSv(f, "pod_moving", 1);
			yield* g.srcCall(f, "close_animation");
			yield* g.call(f, P("/proc/sleep"), null, [8]);
			if (((isEqual(rt.sv(f, "open_status"), 2) && truthy(live(pod))) && isEqual(rt.fv(f, "loc", live(pod)), rt.sv(f, "loc")))) {
				yield* g.callName(f, live(pod), "follow_tube", []);
			}
			rt.setSv(f, "pod_moving", 0);
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /obj/structure/transit_tube/station/proc/process  (code/game/objects/structures/transit_tubes/station.dm:137)  may sleep
rt.def("/obj/structure/transit_tube/station/proc/process", function* process(f: Frame) {
	if (truthy(rt.sv(f, "pod_moving"))) return f.dot;
	yield* g.srcCall(f, "launch_pod");
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/transit_tube/station/proc/pod_stopped  (code/game/objects/structures/transit_tubes/station.dm:142)
rt.def("/obj/structure/transit_tube/station/proc/pod_stopped", function pod_stopped(f: Frame, pod: Value, from_dir: Value) {
	rt.setSv(f, "pod_moving", 1);
	rt.spawnTail(f, 5, "/obj/structure/transit_tube/station/proc/pod_stopped: spawn at game/objects/structures/transit_tubes/station.dm:142", pod, from_dir);
	return f.dot;
});

// a spawn(5) body of /obj/structure/transit_tube/station/proc/pod_stopped, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/transit_tube/station/proc/pod_stopped: spawn at game/objects/structures/transit_tubes/station.dm:142", function* (f: Frame, pod: Value, from_dir: Value) {
	f.vars = () => [pod, from_dir];
	if (truthy(rt.sv(f, "reverse_launch"))) {
		yield* g.callName(f, live(pod), "setDir", [rt.index(rt.sv(f, "tube_dirs"), 1)]);
	}
	rt.setSv(f, "launch_cooldown", add(rt.worldTime(f), rt.sv(f, "cooldown_delay")));
	yield* g.srcCall(f, "open_animation");
	yield* g.call(f, P("/proc/sleep"), null, [8]);
	rt.setSv(f, "pod_moving", 0);
	if (!(!truthy(live(pod)) || truthy(rt.fv(f, "gc_destroyed", live(pod))))) {
		yield* g.callName(f, rt.fv(f, "air_contents", live(pod)), "share", [(yield* g.callName(f, rt.sv(f, "loc"), "return_air", []))]);
	}
	return null;
});

// /obj/structure/transit_tube/station/proc/init_tube_dirs  (code/game/objects/structures/transit_tubes/station.dm:153)
rt.def("/obj/structure/transit_tube/station/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "tube_dirs", rt.list(4, 8));
	} else if ($0 === 2) {
		rt.setSv(f, "tube_dirs", rt.list(4, 8));
	} else if ($0 === 4) {
		rt.setSv(f, "tube_dirs", rt.list(1, 2));
	} else if ($0 === 8) {
		rt.setSv(f, "tube_dirs", rt.list(1, 2));
	}
	rt.setSv(f, "boarding_dir", rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]));
	return f.dot;
});

rt.type(12900, "/obj/structure/transit_tube/station/flipped", "/obj/structure/transit_tube/station", {
	base_icon: "station1",
	icon_state: "closed_station1",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/station/flipped"),
});

// /obj/structure/transit_tube/station/flipped/proc/init_tube_dirs  (code/game/objects/structures/transit_tubes/station.dm:171)
rt.def("/obj/structure/transit_tube/station/flipped/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "boarding_dir", rt.sv(f, "dir"));
	return f.dot;
});

rt.type(12901, "/obj/structure/transit_tube/station/reverse", "/obj/structure/transit_tube/station", {
	reverse_launch: 1,
	base_icon: "terminus0",
	icon_state: "closed_terminus0",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/station/reverse"),
});

// /obj/structure/transit_tube/station/reverse/proc/init_tube_dirs  (code/game/objects/structures/transit_tubes/station.dm:183)
rt.def("/obj/structure/transit_tube/station/reverse/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "tube_dirs", rt.list(4));
	} else if ($0 === 2) {
		rt.setSv(f, "tube_dirs", rt.list(8));
	} else if ($0 === 4) {
		rt.setSv(f, "tube_dirs", rt.list(2));
	} else if ($0 === 8) {
		rt.setSv(f, "tube_dirs", rt.list(1));
	}
	rt.setSv(f, "boarding_dir", rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]));
	return f.dot;
});

rt.type(12902, "/obj/structure/transit_tube/station/reverse/flipped", "/obj/structure/transit_tube/station/reverse", {
	base_icon: "terminus1",
	icon_state: "closed_terminus1",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/station/reverse/flipped"),
});

// /obj/structure/transit_tube/station/reverse/flipped/proc/init_tube_dirs  (code/game/objects/structures/transit_tubes/station.dm:200)
rt.def("/obj/structure/transit_tube/station/reverse/flipped/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "boarding_dir", rt.sv(f, "dir"));
	return f.dot;
});
