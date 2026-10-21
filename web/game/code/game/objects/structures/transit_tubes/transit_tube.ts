// From code/game/objects/structures/transit_tubes/transit_tube.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12898, "/obj/structure/transit_tube", "/obj/structure", {
	tube_dirs: null,
	exit_delay: 1,
	enter_delay: 0,
	tube_construction: rt.typePath("/obj/structure/c_transit_tube"),
	anchored: 1,
	climbable: 1,
	name: "transit tube",
	icon: rt.rsc("icons/obj/atmospherics/pipes/transit_tube.dmi"),
	icon_state: "straight",
	density: 1,
	layer: 2.95,
});

// /obj/structure/transit_tube/proc/CanPass  (code/game/objects/structures/transit_tubes/transit_tube.dm:16)
rt.def("/obj/structure/transit_tube/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value) {
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [2])))) {
		return 1;
	}
	return (!truthy(rt.sv(f, "density")) ? 1 : 0);
});

// /obj/structure/transit_tube/proc/New  (code/game/objects/structures/transit_tubes/transit_tube.dm:21)  may sleep
rt.def("/obj/structure/transit_tube/proc/New", function* New(f: Frame, loc: Value, newdirection: Value) {
	f.vars = () => [loc, newdirection];
	yield* g.callSuper(f, [live(loc)]);
	if (truthy(live(newdirection))) {
		yield* g.srcCall(f, "setDir", live(newdirection));
	}
	yield* g.srcCall(f, "init_tube_dirs");
	yield* g.srcCall(f, "generate_tube_overlays");
	return f.dot;
}, true);

// /obj/structure/transit_tube/proc/Destroy  (code/game/objects/structures/transit_tubes/transit_tube.dm:28)  may sleep
rt.def("/obj/structure/transit_tube/proc/Destroy", function* Destroy(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	_P = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/transit_tube_pod"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		yield* g.callName(f, live(_P), "deconstruct", [0]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/transit_tube/proc/singularity_pull  (code/game/objects/structures/transit_tubes/transit_tube.dm:33)  may sleep
rt.def("/obj/structure/transit_tube/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 9)) return f.dot;
	yield* g.srcCall(f, "deconstruct", 0);
	return f.dot;
}, true);

// /obj/structure/transit_tube/proc/attackby  (code/game/objects/structures/transit_tubes/transit_tube.dm:37)  may sleep
rt.def("/obj/structure/transit_tube/proc/attackby", function* attackby(f: Frame) {
	let pod: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [pod, R, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "tube_construction"))) {
			pod = null;
			rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/obj/structure/transit_tube_pod"));
			while (($e = rt.next(f, 0)) !== undefined) {
				pod = $e;
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Remove the pod first!</span>"]);
				return live(f.dot);
			}
			rt.endFor(f, 0);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to deattach ％！.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start to deattach the ＀...</span>", [rt.sv(f, "name")])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(35, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You deattach the ＀.</span>", [rt.sv(f, "name")])]);
				yield* g.callName(f, (R = (yield* g.new_(f, rt.sv(f, "tube_construction"), [rt.sv(f, "loc")]))), "setDir", [rt.sv(f, "dir")]);
				yield* g.srcCall(f, "transfer_fingerprints_to", live(R));
				yield* g.callName(f, live(R), "add_fingerprint", [live(f.args[1])]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			pod = null;
			rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/obj/structure/transit_tube_pod"));
			while (($e = rt.next(f, 0)) !== undefined) {
				pod = $e;
				yield* g.callName(f, live(pod), "attackby", [live(f.args[0]), live(f.args[1])]);
			}
			rt.endFor(f, 0);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/transit_tube/proc/has_entrance  (code/game/objects/structures/transit_tubes/transit_tube.dm:67)
rt.def("/obj/structure/transit_tube/proc/has_entrance", function has_entrance(f: Frame, from_dir: Value) {
	let direction: Value = null;
	let $e: any;
	f.vars = () => [from_dir, direction, $e];
	from_dir = rt.call(f, P("/proc/turn"), null, [live(from_dir), 180]);
	direction = null;
	rt.forList(f, 0, rt.sv(f, "tube_dirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (isEqual(live(direction), live(from_dir))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /obj/structure/transit_tube/proc/has_exit  (code/game/objects/structures/transit_tubes/transit_tube.dm:78)
rt.def("/obj/structure/transit_tube/proc/has_exit", function has_exit(f: Frame, in_dir: Value) {
	let direction: Value = null;
	let $e: any;
	f.vars = () => [direction, $e];
	direction = null;
	rt.forList(f, 0, rt.sv(f, "tube_dirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (isEqual(live(direction), live(in_dir))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /obj/structure/transit_tube/proc/get_exit  (code/game/objects/structures/transit_tubes/transit_tube.dm:90)
rt.def("/obj/structure/transit_tube/proc/get_exit", function get_exit(f: Frame, in_dir: Value) {
	let near_dir: Value = null, in_dir_cw: Value = null, in_dir_ccw: Value = null, direction: Value = null;
	let $e: any;
	f.vars = () => [near_dir, in_dir_cw, in_dir_ccw, direction, $e];
	near_dir = 0;
	in_dir_cw = rt.call(f, P("/proc/turn"), null, [live(in_dir), -45]);
	in_dir_ccw = rt.call(f, P("/proc/turn"), null, [live(in_dir), 45]);
	direction = null;
	rt.forList(f, 0, rt.sv(f, "tube_dirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (isEqual(live(direction), live(in_dir))) {
			return live(direction);
		} else {
			if (isEqual(live(direction), live(in_dir_cw))) {
				near_dir = live(direction);
			} else {
				if (isEqual(live(direction), live(in_dir_ccw))) {
					near_dir = live(direction);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return live(near_dir);
});

// /obj/structure/transit_tube/proc/init_tube_dirs  (code/game/objects/structures/transit_tubes/transit_tube.dm:119)
rt.def("/obj/structure/transit_tube/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "tube_dirs", rt.list(1, 2));
	} else if ($0 === 2) {
		rt.setSv(f, "tube_dirs", rt.list(1, 2));
	} else if ($0 === 4) {
		rt.setSv(f, "tube_dirs", rt.list(4, 8));
	} else if ($0 === 8) {
		rt.setSv(f, "tube_dirs", rt.list(4, 8));
	}
	return f.dot;
});

// /obj/structure/transit_tube/proc/generate_tube_overlays  (code/game/objects/structures/transit_tubes/transit_tube.dm:131)
rt.def("/obj/structure/transit_tube/proc/generate_tube_overlays", function generate_tube_overlays(f: Frame) {
	let direction: Value = null;
	let $e: any;
	f.vars = () => [direction, $e];
	direction = null;
	rt.forList(f, 0, rt.sv(f, "tube_dirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (truthy((rt.isIn(f, live(direction), rt.gl("diagonals")) ? 1 : 0))) {
			if (truthy(rt.bitAnd(live(direction), 1))) {
				rt.callSrc(f, "create_tube_overlay", [rt.bitXor(live(direction), 3), 1]);
				if (truthy(rt.bitAnd(live(direction), 4))) {
					rt.callSrc(f, "create_tube_overlay", [rt.bitXor(live(direction), 12), 4]);
				} else {
					rt.callSrc(f, "create_tube_overlay", [rt.bitXor(live(direction), 12), 8]);
				}
			}
		} else {
			rt.callSrc(f, "create_tube_overlay", [live(direction)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/structure/transit_tube/proc/create_tube_overlay  (code/game/objects/structures/transit_tubes/transit_tube.dm:146)
rt.def("/obj/structure/transit_tube/proc/create_tube_overlay", function create_tube_overlay(f: Frame, direction: Value, shift_dir: Value) {
	let tube_overlay: Value = null;
	let $0: any;
	f.vars = () => [tube_overlay, $0];
	tube_overlay = rt.new_(f, T("/image"), ["dir", live(direction)], rt.Args.Named);
	if (truthy(live(shift_dir))) {
		rt.setFv(f, "icon_state", live(tube_overlay), "decorative_diag");
		$0 = live(shift_dir);
		if ($0 === 1) {
			rt.setFv(f, "pixel_y", live(tube_overlay), 32);
		} else if ($0 === 2) {
			rt.setFv(f, "pixel_y", live(tube_overlay), -32);
		} else if ($0 === 4) {
			rt.setFv(f, "pixel_x", live(tube_overlay), 32);
		} else if ($0 === 8) {
			rt.setFv(f, "pixel_x", live(tube_overlay), -32);
		}
	} else {
		rt.setFv(f, "icon_state", live(tube_overlay), "decorative");
	}
	rt.callSrc(f, "add_overlay", [live(tube_overlay)]);
	return f.dot;
});

rt.type(12904, "/obj/structure/transit_tube/diagonal", "/obj/structure/transit_tube", {
	icon_state: "diagonal",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/diagonal"),
});

// /obj/structure/transit_tube/diagonal/proc/init_tube_dirs  (code/game/objects/structures/transit_tubes/transit_tube.dm:175)
rt.def("/obj/structure/transit_tube/diagonal/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "tube_dirs", rt.list(5, 10));
	} else if ($0 === 2) {
		rt.setSv(f, "tube_dirs", rt.list(5, 10));
	} else if ($0 === 4) {
		rt.setSv(f, "tube_dirs", rt.list(9, 6));
	} else if ($0 === 8) {
		rt.setSv(f, "tube_dirs", rt.list(9, 6));
	}
	return f.dot;
});

rt.type(12908, "/obj/structure/transit_tube/curved", "/obj/structure/transit_tube", {
	icon_state: "curved0",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/curved"),
});

// /obj/structure/transit_tube/curved/proc/init_tube_dirs  (code/game/objects/structures/transit_tubes/transit_tube.dm:204)
rt.def("/obj/structure/transit_tube/curved/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "tube_dirs", rt.list(1, 10));
	} else if ($0 === 2) {
		rt.setSv(f, "tube_dirs", rt.list(2, 5));
	} else if ($0 === 4) {
		rt.setSv(f, "tube_dirs", rt.list(4, 9));
	} else if ($0 === 8) {
		rt.setSv(f, "tube_dirs", rt.list(6, 8));
	}
	return f.dot;
});

rt.type(12909, "/obj/structure/transit_tube/curved/flipped", "/obj/structure/transit_tube/curved", {
	icon_state: "curved1",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/curved/flipped"),
});

// /obj/structure/transit_tube/curved/flipped/proc/init_tube_dirs  (code/game/objects/structures/transit_tubes/transit_tube.dm:219)
rt.def("/obj/structure/transit_tube/curved/flipped/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "tube_dirs", rt.list(1, 6));
	} else if ($0 === 2) {
		rt.setSv(f, "tube_dirs", rt.list(2, 9));
	} else if ($0 === 4) {
		rt.setSv(f, "tube_dirs", rt.list(4, 10));
	} else if ($0 === 8) {
		rt.setSv(f, "tube_dirs", rt.list(5, 8));
	}
	return f.dot;
});

rt.type(12910, "/obj/structure/transit_tube/junction", "/obj/structure/transit_tube", {
	icon_state: "junction0",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/junction"),
});

// /obj/structure/transit_tube/junction/proc/init_tube_dirs  (code/game/objects/structures/transit_tubes/transit_tube.dm:235)
rt.def("/obj/structure/transit_tube/junction/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "tube_dirs", rt.list(1, 6, 10));
	} else if ($0 === 2) {
		rt.setSv(f, "tube_dirs", rt.list(2, 9, 5));
	} else if ($0 === 4) {
		rt.setSv(f, "tube_dirs", rt.list(4, 10, 9));
	} else if ($0 === 8) {
		rt.setSv(f, "tube_dirs", rt.list(8, 5, 6));
	}
	return f.dot;
});

rt.type(12911, "/obj/structure/transit_tube/junction/flipped", "/obj/structure/transit_tube/junction", {
	icon_state: "junction1",
	tube_construction: rt.typePath("/obj/structure/c_transit_tube/junction/flipped"),
});

// /obj/structure/transit_tube/junction/flipped/proc/init_tube_dirs  (code/game/objects/structures/transit_tubes/transit_tube.dm:250)
rt.def("/obj/structure/transit_tube/junction/flipped/proc/init_tube_dirs", function init_tube_dirs(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "tube_dirs", rt.list(1, 10, 6));
	} else if ($0 === 2) {
		rt.setSv(f, "tube_dirs", rt.list(2, 5, 9));
	} else if ($0 === 4) {
		rt.setSv(f, "tube_dirs", rt.list(4, 9, 10));
	} else if ($0 === 8) {
		rt.setSv(f, "tube_dirs", rt.list(8, 6, 5));
	}
	return f.dot;
});
