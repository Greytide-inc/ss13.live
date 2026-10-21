// From code/game/objects/structures/window.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12207, "/obj/structure/window", "/obj/structure", {
	ini_dir: null,
	state: 0,
	reinf: 0,
	heat_resistance: 800,
	decon_speed: 30,
	wtype: "glass",
	fulltile: 0,
	glass_type: rt.typePath("/obj/item/stack/sheet/glass"),
	glass_amount: 1,
	crack_overlay: null,
	debris: null,
	real_explosion_block: null,
	breaksound: "shatter",
	hitsound: rt.rsc("sound/effects/glasshit.ogg"),
	pressure_resistance: 405.3,
	anchored: 1,
	flags: 512,
	can_be_unanchored: 1,
	CanAtmosPass: -1,
	name: "window",
	desc: "A window.",
	icon_state: "window",
	density: 1,
	layer: 3.2,
	max_integrity: 25,
	obj_integrity: 25,
	resistance_flags: 32,
	armor: null,
});

// /obj/structure/window/proc/<init>  (code/game/objects/structures/window.dm:22)
rt.def("/obj/structure/window/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "debris", rt.list());
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 100]));
	return f.dot;
});

// /obj/structure/window/proc/examine  (code/game/objects/structures/window.dm:32)
rt.def("/obj/structure/window/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "reinf"))) {
		if ((truthy(rt.sv(f, "anchored")) && isEqual(rt.sv(f, "state"), 2))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The window is <b>screwed</b> to the frame.</span>"]);
		} else {
			if ((truthy(rt.sv(f, "anchored")) && isEqual(rt.sv(f, "state"), 1))) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The window is <i>unscrewed</i> but <b>pried</b> into the frame.</span>"]);
			} else {
				if ((truthy(rt.sv(f, "anchored")) && isEqual(rt.sv(f, "state"), 0))) {
					rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The window is out of the frame, but could be <i>pried</i> in. It is <b>screwed</b> to the floor.</span>"]);
				} else {
					if (!truthy(rt.sv(f, "anchored"))) {
						rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The window is <i>unscrewed</i> from the floor, and could be deconstructed by <b>wrenching</b>.</span>"]);
					}
				}
			}
		}
	} else {
		if (truthy(rt.sv(f, "anchored"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The window is <b>screwed</b> to the floor.</span>"]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The window is <i>unscrewed</i> from the floor, and could be deconstructed by <b>wrenching</b>.</span>"]);
		}
	}
	if (truthy(rt.sv(f, "anchored"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Alt-click to rotate it clockwise.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/window/proc/Initialize  (code/game/objects/structures/window.dm:52)  may sleep
rt.def("/obj/structure/window/proc/Initialize", function* Initialize(f: Frame) {
	let shards: Value = null, rods: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [shards, rods, i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
	if (truthy(live(f.args[1]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
	}
	if ((truthy(rt.sv(f, "reinf")) && truthy(rt.sv(f, "anchored")))) {
		rt.setSv(f, "state", 2);
	}
	rt.setSv(f, "ini_dir", rt.sv(f, "dir"));
	yield* g.srcCall(f, "air_update_turf", 1);
	shards = 1;
	if (truthy(rt.sv(f, "fulltile"))) {
		shards = rt.inc(live(shards), 1);
		yield* g.srcCall(f, "setDir");
	}
	rods = 0;
	if (truthy(rt.sv(f, "reinf"))) {
		rods = rt.inc(live(rods), 1);
		if (truthy(rt.sv(f, "fulltile"))) {
			rods = rt.inc(live(rods), 1);
		}
	}
	i = null;
	rt.forRange(f, 0, 1, live(shards), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "debris", (yield* g.new_(f, T("/obj/item/weapon/shard"), [live(f.src)])), add);
	}
	rt.endFor(f, 0);
	if (truthy(live(rods))) {
		rt.modSrcVar(f, "debris", (yield* g.new_(f, T("/obj/item/stack/rods"), [live(f.src), live(rods)])), add);
	}
	rt.setSv(f, "real_explosion_block", rt.sv(f, "explosion_block"));
	rt.setSv(f, "explosion_block", -1);
	return f.dot;
}, true, { args: ["mapload", "direct"] });

// /obj/structure/window/proc/rcd_vals  (code/game/objects/structures/window.dm:84)
rt.def("/obj/structure/window/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "mode", live(the_rcd));
	if ($0 === 3) {
		return rt.alist(f, ["mode", 3, "delay", 20, "cost", 5]);
	}
	return 0;
});

// /obj/structure/window/proc/rcd_act  (code/game/objects/structures/window.dm:90)  may sleep
rt.def("/obj/structure/window/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value) {
	let $0: any;
	f.vars = () => [user, the_rcd, $0];
	$0 = rt.fv(f, "mode", live(the_rcd));
	if ($0 === 3) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You deconstruct the window.</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	}
	return 0;
}, true);

// /obj/structure/window/proc/narsie_act  (code/game/objects/structures/window.dm:98)
rt.def("/obj/structure/window/proc/narsie_act", function narsie_act(f: Frame) {
	let shard: Value = null;
	let $e: any;
	f.vars = () => [shard, $e];
	rt.callSrc(f, "add_atom_colour", ["#7D1919", 4]);
	shard = null;
	rt.forList(f, 0, rt.sv(f, "debris"), T("/obj/item/weapon/shard"));
	while (($e = rt.next(f, 0)) !== undefined) {
		shard = $e;
		rt.callName(f, live(shard), "add_atom_colour", ["#7D1919", 4]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/structure/window/proc/ratvar_act  (code/game/objects/structures/window.dm:103)  may sleep
rt.def("/obj/structure/window/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (!truthy(rt.sv(f, "fulltile"))) {
		yield* g.new_(f, T("/obj/structure/window/reinforced/clockwork"), [rt.getStep(f, live(f.src), 0), rt.sv(f, "dir")]);
	} else {
		yield* g.new_(f, T("/obj/structure/window/reinforced/clockwork/fulltile"), [rt.getStep(f, live(f.src), 0)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/window/proc/singularity_pull  (code/game/objects/structures/window.dm:110)  may sleep
rt.def("/obj/structure/window/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 9)) return f.dot;
	yield* g.srcCall(f, "deconstruct", 0);
	return f.dot;
}, true);

// /obj/structure/window/proc/setDir  (code/game/objects/structures/window.dm:114)
rt.def("/obj/structure/window/proc/setDir", function setDir(f: Frame) {
	if (!truthy(rt.sv(f, "fulltile"))) {
		rt.callSuper(f, [], rt.Args.Same);
	} else {
		rt.callSuper(f, [5]);
	}
	return f.dot;
}, false, { args: ["direct"] });

// /obj/structure/window/proc/CanPass  (code/game/objects/structures/window.dm:120)
rt.def("/obj/structure/window/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let W: Value = null;
	f.vars = () => [height, W];
	if (live(height) === null) {
		height = 0;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [2])))) {
		return 1;
	}
	if (isEqual(rt.sv(f, "dir"), 5)) {
		return 0;
	}
	if (isEqual(rt.getDir(f, rt.sv(f, "loc"), live(target)), rt.sv(f, "dir"))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	if (truthy((rt.istype(live(mover), T("/obj/structure/window")) ? 1 : 0))) {
		W = live(mover);
		if (!truthy(rt.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), rt.fv(f, "ini_dir", live(W))]))) {
			return 0;
		}
	} else {
		if (truthy((rt.istype(live(mover), T("/obj/structure/windoor_assembly")) ? 1 : 0))) {
			W = live(mover);
			if (!truthy(rt.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), rt.fv(f, "ini_dir", live(W))]))) {
				return 0;
			}
		} else {
			if ((truthy((rt.istype(live(mover), T("/obj/machinery/door/window")) ? 1 : 0)) && !truthy(rt.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), rt.fv(f, "dir", live(mover))])))) {
				return 0;
			}
		}
	}
	return 1;
});

// /obj/structure/window/proc/CheckExit  (code/game/objects/structures/window.dm:139)
rt.def("/obj/structure/window/proc/CheckExit", function CheckExit(f: Frame, O: Value, target: Value) {
	if ((truthy((rt.istype(live(O), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(O), "checkpass", [2])))) {
		return 1;
	}
	if (isEqual(rt.getDir(f, rt.fv(f, "loc", live(O)), live(target)), rt.sv(f, "dir"))) {
		return 0;
	}
	return 1;
});

// /obj/structure/window/proc/attack_tk  (code/game/objects/structures/window.dm:146)  may sleep
rt.def("/obj/structure/window/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>Something knocks on ＀.</span>", [live(f.src)])]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/glassknock.ogg"), 50, 1]);
	return f.dot;
}, true);

// /obj/structure/window/proc/attack_hulk  (code/game/objects/structures/window.dm:152)  may sleep
rt.def("/obj/structure/window/proc/attack_hulk", function* attack_hulk(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy((yield* g.srcCall(f, "can_be_reached", live(f.args[0]))))) {
		return 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["user", "does_attack_animation"] });

// /obj/structure/window/proc/attack_hand  (code/game/objects/structures/window.dm:157)  may sleep
rt.def("/obj/structure/window/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.srcCall(f, "can_be_reached", live(user))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ knocks on ＀.", [live(user), live(f.src)])]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/glassknock.ogg"), 50, 1]);
	return f.dot;
}, true);

// /obj/structure/window/proc/attack_paw  (code/game/objects/structures/window.dm:165)  may sleep
rt.def("/obj/structure/window/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/window/proc/attack_generic  (code/game/objects/structures/window.dm:169)  may sleep
rt.def("/obj/structure/window/proc/attack_generic", function* attack_generic(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = "brute";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if (!truthy((yield* g.srcCall(f, "can_be_reached", live(f.args[0]))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user", "damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// /obj/structure/window/proc/attackby  (code/game/objects/structures/window.dm:174)  may sleep
rt.def("/obj/structure/window/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, G: Value = null;
	let $0: any, $1: any;
	f.vars = () => [WT, G, $0, $1];
	if (!truthy((yield* g.srcCall(f, "can_be_reached", live(f.args[1]))))) {
		return 1;
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help"))) {
		WT = live(f.args[0]);
		if (rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))) {
			if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin repairing ＀...</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(WT)), 40, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
					yield* g.srcCall(f, "update_nearby_icons");
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You repair ＀.</span>", [live(f.src)])]);
				}
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is already in good condition!</span>", [live(f.src)])]);
		}
		return live(f.dot);
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
			if (truthy(rt.sv(f, "reinf"))) {
				if ((isEqual(rt.sv(f, "state"), 2) || isEqual(rt.sv(f, "state"), 1))) {
					$0 = live(f.args[1]);
					if (isEqual(rt.sv(f, "state"), 2)) {
						$1 = "unscrew the window from";
					} else {
						$1 = "screw the window to";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You begin to ＀ the frame...</span>", [$1])]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(rt.sv(f, "decon_speed"), rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/window/proc/check_state_and_anchored"), rt.sv(f, "state"), rt.sv(f, "anchored")]))], rt.Args.Named)))) {
						if (isEqual(rt.sv(f, "state"), 1)) {
							$0 = 2;
						} else {
							$0 = 1;
						}
						rt.setSv(f, "state", $0);
						$0 = live(f.args[1]);
						if (isEqual(rt.sv(f, "state"), 1)) {
							$1 = "unfasten the window from";
						} else {
							$1 = "fasten the window to";
						}
						yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the frame.</span>", [$1])]);
					}
				} else {
					if (isEqual(rt.sv(f, "state"), 0)) {
						$0 = live(f.args[1]);
						if (truthy(rt.sv(f, "anchored"))) {
							$1 = "unscrew the frame from";
						} else {
							$1 = "screw the frame to";
						}
						yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You begin to ＀ the floor...</span>", [$1])]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(rt.sv(f, "decon_speed"), rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/window/proc/check_state_and_anchored"), rt.sv(f, "state"), rt.sv(f, "anchored")]))], rt.Args.Named)))) {
							rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
							yield* g.srcCall(f, "update_nearby_icons");
							$0 = live(f.args[1]);
							if (truthy(rt.sv(f, "anchored"))) {
								$1 = "fasten the frame to";
							} else {
								$1 = "unfasten the frame from";
							}
							yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the floor.</span>", [$1])]);
						}
					}
				}
			} else {
				$0 = live(f.args[1]);
				if (truthy(rt.sv(f, "anchored"))) {
					$1 = "unscrew the window from";
				} else {
					$1 = "screw the window to";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You begin to ＀ the floor...</span>", [$1])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(rt.sv(f, "decon_speed"), rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/window/proc/check_anchored"), rt.sv(f, "anchored")]))], rt.Args.Named)))) {
					rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
					yield* g.srcCall(f, "update_nearby_icons");
					$0 = live(f.args[1]);
					if (truthy(rt.sv(f, "anchored"))) {
						$1 = "fasten the window to";
					} else {
						$1 = "unfasten the window from";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the floor.</span>", [$1])]);
				}
			}
			return live(f.dot);
		} else {
			if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)) && truthy(rt.sv(f, "reinf"))) && (isEqual(rt.sv(f, "state"), 0) || isEqual(rt.sv(f, "state"), 1)))) {
				$0 = live(f.args[1]);
				if (isEqual(rt.sv(f, "state"), 0)) {
					$1 = "into";
				} else {
					$1 = "out of";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You begin to lever the window ＀ the frame...</span>", [$1])]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(rt.sv(f, "decon_speed"), rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/window/proc/check_state_and_anchored"), rt.sv(f, "state"), rt.sv(f, "anchored")]))], rt.Args.Named)))) {
					if (isEqual(rt.sv(f, "state"), 0)) {
						$0 = 1;
					} else {
						$0 = 0;
					}
					rt.setSv(f, "state", $0);
					$0 = live(f.args[1]);
					if (isEqual(rt.sv(f, "state"), 1)) {
						$1 = "into";
					} else {
						$1 = "out of";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You pry the window ＀ the frame.</span>", [$1])]);
				}
				return live(f.dot);
			} else {
				if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.sv(f, "anchored")))) {
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'> You begin to disassemble ＀...</span>", [live(f.src)])]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(rt.sv(f, "decon_speed"), rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/window/proc/check_state_and_anchored"), rt.sv(f, "state"), rt.sv(f, "anchored")]))], rt.Args.Named)))) {
						yield* g.callName(f, (G = (yield* g.new_(f, rt.sv(f, "glass_type"), [rt.fv(f, "loc", live(f.args[1])), rt.sv(f, "glass_amount")]))), "add_fingerprint", [live(f.args[1])]);
						yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You successfully disassemble ＀.</span>", [live(f.src)])]);
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					}
					return live(f.dot);
				}
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/structure/window/proc/check_state  (code/game/objects/structures/window.dm:238)
rt.def("/obj/structure/window/proc/check_state", function check_state(f: Frame, checked_state: Value) {
	if (!isEqual(rt.sv(f, "state"), live(checked_state))) return f.dot;
	return 1;
});

// /obj/structure/window/proc/check_anchored  (code/game/objects/structures/window.dm:242)
rt.def("/obj/structure/window/proc/check_anchored", function check_anchored(f: Frame, checked_anchored: Value) {
	if (!isEqual(rt.sv(f, "anchored"), live(checked_anchored))) return f.dot;
	return 1;
});

// /obj/structure/window/proc/check_state_and_anchored  (code/game/objects/structures/window.dm:246)
rt.def("/obj/structure/window/proc/check_state_and_anchored", function check_state_and_anchored(f: Frame, checked_state: Value, checked_anchored: Value) {
	return (rt.callSrc(f, "check_state", [live(checked_state)]) && rt.callSrc(f, "check_anchored", [live(checked_anchored)]));
});

// /obj/structure/window/proc/mech_melee_attack  (code/game/objects/structures/window.dm:249)  may sleep
rt.def("/obj/structure/window/proc/mech_melee_attack", function* mech_melee_attack(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "can_be_reached")))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /obj/structure/window/proc/can_be_reached  (code/game/objects/structures/window.dm:254)  may sleep
rt.def("/obj/structure/window/proc/can_be_reached", function* can_be_reached(f: Frame, user: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [user, O, $e];
	if (!truthy(rt.sv(f, "fulltile"))) {
		if (truthy(rt.bitAnd(rt.getDir(f, live(user), live(f.src)), rt.sv(f, "dir")))) {
			O = null;
			rt.forList(f, 0, rt.sv(f, "loc"), T("/obj"));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				if (!truthy((yield* g.callName(f, live(O), "CanPass", [live(user), rt.fv(f, "loc", live(user)), 1])))) {
					return 0;
				}
			}
			rt.endFor(f, 0);
		}
	}
	return 1;
}, true);

// /obj/structure/window/proc/take_damage  (code/game/objects/structures/window.dm:262)  may sleep
rt.def("/obj/structure/window/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "update_nearby_icons");
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// /obj/structure/window/proc/play_attack_sound  (code/game/objects/structures/window.dm:267)
rt.def("/obj/structure/window/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(live(damage_amount))) {
			rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "hitsound"), 75, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/structure/window/proc/deconstruct  (code/game/objects/structures/window.dm:278)  may sleep
rt.def("/obj/structure/window/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null, i: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [disassembled, _T, i, I, $e];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	if (!truthy(live(disassembled))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "breaksound"), 70, 1]);
		_T = rt.sv(f, "loc");
		if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
			i = null;
			rt.forList(f, 0, rt.sv(f, "debris"));
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				rt.setFv(f, "loc", (I = live(i)), live(_T));
				yield* g.srcCall(f, "transfer_fingerprints_to", live(I));
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.srcCall(f, "update_nearby_icons");
	return f.dot;
}, true);

// /obj/structure/window/verb/rotate  (code/game/objects/structures/window.dm:296)  may sleep
rt.def("/obj/structure/window/verb/rotate", function* rotate(f: Frame) {
	let target_dir: Value = null;
	f.vars = () => [target_dir];
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anchored"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ cannot be rotated while it is fastened to the floor!</span>", [live(f.src)])]);
		return 0;
	}
	target_dir = (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 90]));
	if (!truthy((yield* g.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), live(target_dir)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ cannot be rotated in that direction!</span>", [live(f.src)])]);
		return 0;
	}
	yield* g.srcCall(f, "setDir", live(target_dir));
	yield* g.srcCall(f, "air_update_turf", 1);
	rt.setSv(f, "ini_dir", rt.sv(f, "dir"));
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return 1;
}, true, { verb: { name: "Rotate Window Counter-Clockwise", category: "Object", src: 3, range: 1 } });

// /obj/structure/window/verb/revrotate  (code/game/objects/structures/window.dm:320)  may sleep
rt.def("/obj/structure/window/verb/revrotate", function* revrotate(f: Frame) {
	let target_dir: Value = null;
	f.vars = () => [target_dir];
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anchored"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ cannot be rotated while it is fastened to the floor!</span>", [live(f.src)])]);
		return 0;
	}
	target_dir = (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 270]));
	if (!truthy((yield* g.call(f, P("/proc/valid_window_location"), null, [rt.sv(f, "loc"), live(target_dir)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ cannot be rotated in that direction!</span>", [live(f.src)])]);
		return 0;
	}
	yield* g.srcCall(f, "setDir", live(target_dir));
	yield* g.srcCall(f, "air_update_turf", 1);
	rt.setSv(f, "ini_dir", rt.sv(f, "dir"));
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return 1;
}, true, { verb: { name: "Rotate Window Clockwise", category: "Object", src: 3, range: 1 } });

// /obj/structure/window/proc/AltClick  (code/game/objects/structures/window.dm:340)  may sleep
rt.def("/obj/structure/window/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) {
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "revrotate");
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/window/proc/Destroy  (code/game/objects/structures/window.dm:351)  may sleep
rt.def("/obj/structure/window/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "density", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	yield* g.srcCall(f, "update_nearby_icons");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/window/proc/Move  (code/game/objects/structures/window.dm:357)  may sleep
rt.def("/obj/structure/window/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.sv(f, "loc");
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "setDir", rt.sv(f, "ini_dir"));
	yield* g.srcCall(f, "move_update_air", live(_T));
	return f.dot;
}, true);

// /obj/structure/window/proc/CanAtmosPass  (code/game/objects/structures/window.dm:363)
rt.def("/obj/structure/window/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	if (isEqual(rt.getDir(f, rt.sv(f, "loc"), live(_T)), rt.sv(f, "dir"))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	if (isEqual(rt.sv(f, "dir"), 5)) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	return 1;
});

// /obj/structure/window/proc/update_nearby_icons  (code/game/objects/structures/window.dm:371)
rt.def("/obj/structure/window/proc/update_nearby_icons", function update_nearby_icons(f: Frame) {
	rt.callSrc(f, "update_icon", []);
	if (!truthy(rt.sv(f, "smooth"))) return f.dot;
	rt.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
	return f.dot;
});

// /obj/structure/window/proc/update_icon  (code/game/objects/structures/window.dm:377)
rt.def("/obj/structure/window/proc/update_icon", function update_icon(f: Frame) {
	let ratio: Value = null;
	f.vars = () => [ratio];
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	if (!truthy(rt.sv(f, "fulltile"))) {
		return live(f.dot);
	}
	ratio = multiply(rt.call(f, P("/proc/Ceiling"), null, [multiply((ratio = divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))), 4)]), 25);
	if (truthy(rt.sv(f, "smooth"))) {
		rt.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
	}
	rt.callSrc(f, "cut_overlay", [rt.sv(f, "crack_overlay")]);
	if (rt.gt(live(ratio), 75)) {
		return live(f.dot);
	}
	rt.setSv(f, "crack_overlay", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/structures.dmi"), fmt("damage＀", [live(ratio)]), rt.neg(add(rt.sv(f, "layer"), 0.10000000149011612))]));
	rt.callSrc(f, "add_overlay", [rt.sv(f, "crack_overlay")]);
	return f.dot;
});

// /obj/structure/window/proc/temperature_expose  (code/game/objects/structures/window.dm:395)  may sleep
rt.def("/obj/structure/window/proc/temperature_expose", function* temperature_expose(f: Frame) {
	if (rt.gt(live(f.args[1]), add(273.1499938964844, rt.sv(f, "heat_resistance")))) {
		yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/round"), null, [divide(live(f.args[2]), 100)])), "fire", 0, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["air", "exposed_temperature", "exposed_volume"] });

// /obj/structure/window/proc/CanAStarPass  (code/game/objects/structures/window.dm:403)
rt.def("/obj/structure/window/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, to_dir: Value) {
	if (!truthy(rt.sv(f, "density"))) {
		return 1;
	}
	if ((isEqual(rt.sv(f, "dir"), 5) || isEqual(rt.sv(f, "dir"), live(to_dir)))) {
		return 0;
	}
	return 1;
});

// /obj/structure/window/proc/GetExplosionBlock  (code/game/objects/structures/window.dm:411)
rt.def("/obj/structure/window/proc/GetExplosionBlock", function GetExplosionBlock(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if ((truthy(rt.sv(f, "reinf")) && truthy(rt.sv(f, "fulltile")))) {
		$0 = rt.sv(f, "real_explosion_block");
	} else {
		$0 = 0;
	}
	return $0;
});

rt.type(12208, "/obj/structure/window/reinforced", "/obj/structure/window", {
	explosion_block: 1,
	name: "reinforced window",
	desc: "A window that is reinforced with metal rods.",
	icon_state: "rwindow",
	reinf: 1,
	heat_resistance: 1600,
	armor: null,
	max_integrity: 50,
	glass_type: rt.typePath("/obj/item/stack/sheet/rglass"),
});

// /obj/structure/window/reinforced/proc/<init>  (code/game/objects/structures/window.dm:422)
rt.def("/obj/structure/window/reinforced/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 0, "laser", 0, "energy", 0, "bomb", 25, "bio", 100, "rad", 100, "fire", 80, "acid", 100]));
	return f.dot;
});

rt.type(12224, "/obj/structure/window/fulltile", "/obj/structure/window", {
	fulltile: 1,
	flags: 32768,
	smooth: 1,
	canSmoothWith: null,
	glass_amount: 2,
	icon: rt.rsc("icons/obj/smooth_structures/window.dmi"),
	icon_state: "window",
	dir: 5,
	max_integrity: 50,
});

// /obj/structure/window/fulltile/proc/<init>  (code/game/objects/structures/window.dm:454)
rt.def("/obj/structure/window/fulltile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/highpressure/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile")));
	return f.dot;
});

rt.type(12219, "/obj/structure/window/reinforced/fulltile", "/obj/structure/window/reinforced", {
	flags: 32768,
	smooth: 1,
	level: 3,
	icon: rt.rsc("icons/obj/smooth_structures/reinforced_window.dmi"),
	icon_state: "r_window",
	dir: 5,
	max_integrity: 100,
	fulltile: 1,
	canSmoothWith: null,
	glass_amount: 2,
});

// /obj/structure/window/reinforced/fulltile/proc/<init>  (code/game/objects/structures/window.dm:469)
rt.def("/obj/structure/window/reinforced/fulltile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/highpressure/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile")));
	return f.dot;
});

rt.type(12218, "/obj/structure/window/reinforced/highpressure/fulltile", "/obj/structure/window/reinforced/highpressure", {
	flags: 32768,
	smooth: 1,
	level: 3,
	icon: rt.rsc("icons/obj/smooth_structures/reinforced_window.dmi"),
	icon_state: "r_window",
	dir: 5,
	max_integrity: 1000,
	fulltile: 1,
	canSmoothWith: null,
	glass_amount: 2,
});

// /obj/structure/window/reinforced/highpressure/fulltile/proc/<init>  (code/game/objects/structures/window.dm:481)
rt.def("/obj/structure/window/reinforced/highpressure/fulltile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/highpressure/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile")));
	return f.dot;
});

rt.type(12216, "/obj/structure/window/reinforced/tinted/fulltile", "/obj/structure/window/reinforced/tinted", {
	flags: 32768,
	smooth: 1,
	level: 3,
	icon: rt.rsc("icons/obj/smooth_structures/tinted_window.dmi"),
	icon_state: "tinted_window",
	dir: 5,
	fulltile: 1,
	canSmoothWith: null,
	glass_amount: 2,
});

// /obj/structure/window/reinforced/tinted/fulltile/proc/<init>  (code/game/objects/structures/window.dm:495)
rt.def("/obj/structure/window/reinforced/tinted/fulltile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/highpressure/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile")));
	return f.dot;
});

rt.type(12221, "/obj/structure/window/reinforced/fulltile/ice", "/obj/structure/window/reinforced/fulltile", {
	level: 3,
	icon: rt.rsc("icons/obj/smooth_structures/rice_window.dmi"),
	icon_state: "ice_window",
	max_integrity: 150,
	canSmoothWith: null,
	glass_amount: 2,
});

// /obj/structure/window/reinforced/fulltile/ice/proc/<init>  (code/game/objects/structures/window.dm:503)
rt.def("/obj/structure/window/reinforced/fulltile/ice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/window/fulltile"), T("/obj/structure/window/reinforced/fulltile"), T("/obj/structure/window/reinforced/tinted/fulltile"), T("/obj/structure/window/reinforced/fulltile/ice")));
	return f.dot;
});

rt.type(12226, "/obj/structure/window/shuttle", "/obj/structure/window", {
	wtype: "shuttle",
	fulltile: 1,
	flags: 32768,
	reinf: 1,
	heat_resistance: 1600,
	smooth: 1,
	canSmoothWith: null,
	explosion_block: 1,
	level: 3,
	glass_type: rt.typePath("/obj/item/stack/sheet/rglass"),
	glass_amount: 2,
	name: "shuttle window",
	desc: "A reinforced, air-locked pod window.",
	icon: rt.rsc("icons/obj/smooth_structures/shuttle_window.dmi"),
	icon_state: "shuttle_window",
	dir: 5,
	max_integrity: 100,
	armor: null,
});

// /obj/structure/window/shuttle/proc/<init>  (code/game/objects/structures/window.dm:519)
rt.def("/obj/structure/window/shuttle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 0, "laser", 0, "energy", 0, "bomb", 25, "bio", 100, "rad", 100, "fire", 80, "acid", 100]));
	return f.dot;
});

// /obj/structure/window/shuttle/proc/narsie_act  (code/game/objects/structures/window.dm:528)
rt.def("/obj/structure/window/shuttle/proc/narsie_act", function narsie_act(f: Frame) {
	rt.callSrc(f, "add_atom_colour", ["#3C3434", 4]);
	return f.dot;
});

rt.type(12209, "/obj/structure/window/reinforced/clockwork", "/obj/structure/window/reinforced", {
	made_glow: 0,
	explosion_block: 2,
	name: "brass window",
	desc: "A paper-thin pane of translucent yet reinforced brass.",
	icon: rt.rsc("icons/obj/smooth_structures/clockwork_window.dmi"),
	icon_state: "clockwork_window_single",
	resistance_flags: 34,
	max_integrity: 80,
	armor: null,
	decon_speed: 40,
	glass_type: rt.typePath("/obj/item/stack/tile/brass"),
	glass_amount: 1,
	reinf: 0,
});

// /obj/structure/window/reinforced/clockwork/proc/<init>  (code/game/objects/structures/window.dm:540)
rt.def("/obj/structure/window/reinforced/clockwork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 60, "bullet", 25, "laser", 0, "energy", 0, "bomb", 25, "bio", 100, "rad", 100, "fire", 80, "acid", 100]));
	return f.dot;
});

// /obj/structure/window/reinforced/clockwork/proc/Initialize  (code/game/objects/structures/window.dm:551)  may sleep
rt.def("/obj/structure/window/reinforced/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null, amount_of_gears: Value = null, i: Value = null;
	let $0: any, $e: any;
	f.vars = () => [I, amount_of_gears, i, $0, $e];
	if (truthy(rt.sv(f, "fulltile"))) {
		rt.setSv(f, "made_glow", 1);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "debris"))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "debris"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "debris"), "Cut", []);
	}
	amount_of_gears = 2;
	if (truthy(rt.sv(f, "fulltile"))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/window"), [rt.getStep(f, live(f.src), 0)]);
		amount_of_gears = 4;
	}
	i = null;
	rt.forRange(f, 0, 1, live(amount_of_gears), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "debris", (yield* g.new_(f, T("/obj/item/clockwork/alloy_shards/medium/gear_bit"), [])), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "fulltile"))) {
		$0 = 2;
	} else {
		$0 = 1;
	}
	yield* g.call(f, P("/proc/change_construction_value"), null, [$0]);
	return f.dot;
}, true, { args: ["mapload", "direct"] });

// /obj/structure/window/reinforced/clockwork/proc/setDir  (code/game/objects/structures/window.dm:562)  may sleep
rt.def("/obj/structure/window/reinforced/clockwork/proc/setDir", function* setDir(f: Frame) {
	let E: Value = null;
	f.vars = () => [E];
	if (!truthy(rt.sv(f, "made_glow"))) {
		yield* g.callName(f, (E = (yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/window/single"), [rt.getStep(f, live(f.src), 0)]))), "setDir", [live(f.args[0])]);
		rt.setSv(f, "made_glow", 1);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["direct"] });

// /obj/structure/window/reinforced/clockwork/proc/Destroy  (code/game/objects/structures/window.dm:569)  may sleep
rt.def("/obj/structure/window/reinforced/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "fulltile"))) {
		$0 = -2;
	} else {
		$0 = -1;
	}
	yield* g.call(f, P("/proc/change_construction_value"), null, [$0]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/window/reinforced/clockwork/proc/ratvar_act  (code/game/objects/structures/window.dm:574)
rt.def("/obj/structure/window/reinforced/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (!truthy(rt.gl("ratvar_awakens"))) return f.dot;
	rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/structure/window/reinforced/clockwork/proc/narsie_act  (code/game/objects/structures/window.dm:578)  may sleep
rt.def("/obj/structure/window/reinforced/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/rand"), null, [25, 75])), "brute");
	if (!truthy(live(f.src))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#960000");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);

rt.type(12229, "/obj/structure/window/paperframe", "/obj/structure/window", {
	fulltile: 1,
	flags: 32768,
	smooth: 1,
	glass_amount: 2,
	glass_type: rt.typePath("/obj/item/stack/sheet/paperframes"),
	heat_resistance: 233,
	decon_speed: 10,
	CanAtmosPass: 1,
	breaksound: rt.rsc("sound/items/poster_ripped.ogg"),
	hitsound: rt.rsc("sound/weapons/slashmiss.ogg"),
	name: "paper frame",
	desc: "A fragile separator made of thin wood and paper.",
	icon: rt.rsc("icons/obj/smooth_structures/paperframes.dmi"),
	icon_state: "frame",
	dir: 5,
	opacity: 1,
	max_integrity: 15,
	obj_integrity: 15,
	canSmoothWith: null,
	resistance_flags: 4,
	armor: null,
}, { global: { torn: 795, paper: 796 } });

// /obj/structure/window/paperframe/proc/<init>  (code/game/objects/structures/window.dm:614)
rt.def("/obj/structure/window/paperframe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/window/paperframe"), T("/obj/structure/mineral_door/paperframe")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

// /obj/structure/window/paperframe/proc/Initialize  (code/game/objects/structures/window.dm:628)  may sleep
rt.def("/obj/structure/window/paperframe/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null, papers: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [I, papers, i, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "debris"))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "debris"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "debris"), "Cut", []);
	}
	papers = (yield* g.call(f, P("/proc/rand"), null, [1, 4]));
	rt.modSrcVar(f, "debris", (yield* g.new_(f, T("/obj/item/stack/sheet/mineral/wood"), [])), add);
	i = null;
	rt.forRange(f, 0, 1, live(papers), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "debris", (yield* g.new_(f, T("/obj/item/weapon/paper/natural"), [])), add);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/window/paperframe/proc/attack_hand  (code/game/objects/structures/window.dm:637)  may sleep
rt.def("/obj/structure/window/paperframe/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (!isEqual(rt.fv(f, "a_intent", live(user)), "harm")) {
		yield* g.callName(f, live(user), "changeNext_move", [8]);
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ knocks on ＀.", [live(user), live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "pageturn", 50, 1]);
	} else {
		yield* g.srcCall(f, "take_damage", 4, "brute", "melee", 0);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "hitsound"), 50, 1]);
		if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ tears a hole in ＀.</span>", [live(user), live(f.src)])]);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true);

// /obj/structure/window/paperframe/proc/update_icon  (code/game/objects/structures/window.dm:650)
rt.def("/obj/structure/window/paperframe/proc/update_icon", function update_icon(f: Frame) {
	if (rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))) {
		rt.callSrc(f, "cut_overlay", [rt.gl("paper")]);
		rt.callSrc(f, "add_overlay", [rt.gl("torn")]);
		rt.callSrc(f, "set_opacity", [0]);
	} else {
		rt.callSrc(f, "cut_overlay", [rt.gl("torn")]);
		rt.callSrc(f, "add_overlay", [rt.gl("paper")]);
		rt.callSrc(f, "set_opacity", [1]);
	}
	rt.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
	return f.dot;
});

// /obj/structure/window/paperframe/proc/attackby  (code/game/objects/structures/window.dm:662)  may sleep
rt.def("/obj/structure/window/paperframe/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_hot", [])))) {
		yield* g.srcCall(f, "fire_act", (yield* g.callName(f, live(f.args[0]), "is_hot", [])));
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper")) ? 1 : 0)) && rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to patch the holes in ％！.", [live(f.args[1]), live(f.src)])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
			rt.setSv(f, "obj_integrity", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "obj_integrity"), 4), rt.sv(f, "max_integrity")])));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ patches some of the holes in ％！.", [live(f.args[1]), live(f.src)])]);
			if (isEqual(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))) {
				yield* g.srcCall(f, "update_icon");
			}
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["W", "user"] });
