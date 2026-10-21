// From code/game/machinery/doors/firedoor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10288, "/obj/machinery/door/firedoor", "/obj/machinery/door", {
	nextstate: null,
	boltslocked: 1,
	affecting_areas: null,
	heat_proof: 1,
	glass: 1,
	sub_door: 1,
	explosion_block: 1,
	safe: 0,
	closingLayer: 3.11,
	name: "firelock",
	desc: "Apply crowbar.",
	icon: rt.rsc("icons/obj/doors/doorfireglass.dmi"),
	icon_state: "door_open",
	opacity: 0,
	density: 0,
	obj_integrity: 300,
	max_integrity: 300,
	resistance_flags: 2,
	assemblytype: rt.typePath("/obj/structure/firelock_frame"),
	armor: null,
});

// /obj/machinery/door/firedoor/proc/<init>  (code/game/machinery/doors/firedoor.dm:25)
rt.def("/obj/machinery/door/firedoor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 30, "laser", 20, "energy", 20, "bomb", 10, "bio", 100, "rad", 100, "fire", 95, "acid", 70]));
	return f.dot;
});

// /obj/machinery/door/firedoor/proc/Initialize  (code/game/machinery/doors/firedoor.dm:30)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "CalculateAffectingAreas");
	return f.dot;
}, true);

// /obj/machinery/door/firedoor/proc/examine  (code/game/machinery/doors/firedoor.dm:34)
rt.def("/obj/machinery/door/firedoor/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "density"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It is open, but could be <b>pried</b> closed.</span>"]);
	} else {
		if (!truthy(rt.sv(f, "welded"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It is closed, but could be <i>pried</i> open. Deconstruction would require it to be <b>welded</b> shut.</span>"]);
		} else {
			if (truthy(rt.sv(f, "boltslocked"))) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It is <i>welded</i> shut. The floor bolt have been locked by <b>screws</b>.</span>"]);
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The bolt locks have been <i>unscrewed</i>, but the bolts themselves are still <b>wrenched</b> to the floor.</span>"]);
			}
		}
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/door/firedoor/proc/CalculateAffectingAreas  (code/game/machinery/doors/firedoor.dm:47)
rt.def("/obj/machinery/door/firedoor/proc/CalculateAffectingAreas", function CalculateAffectingAreas(f: Frame) {
	let I: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [I, A, $e];
	rt.callSrc(f, "remove_from_areas", []);
	rt.setSv(f, "affecting_areas", rt.bitOr(rt.call(f, P("/proc/get_adjacent_open_areas"), null, [live(f.src)]), rt.call(f, P("/proc/get_area"), null, [live(f.src)])));
	I = null;
	rt.forList(f, 0, rt.sv(f, "affecting_areas"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.gv(f, "firedoors", (A = live(I))))) {
			rt.setFv(f, "firedoors", live(A), rt.list());
		}
		rt.modField(f, live(A), "firedoors", live(f.src), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/door/firedoor/proc/remove_from_areas  (code/game/machinery/doors/firedoor.dm:62)
rt.def("/obj/machinery/door/firedoor/proc/remove_from_areas", function remove_from_areas(f: Frame) {
	let I: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [I, A, $e];
	if (!truthy(rt.sv(f, "affecting_areas"))) return f.dot;
	I = null;
	rt.forList(f, 0, rt.sv(f, "affecting_areas"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.gv(f, "firedoors", (A = live(I))))) {
			(rt.modField(f, live(A), "firedoors", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "firedoors", live(A))))) {
				rt.setFv(f, "firedoors", live(A), null);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/door/firedoor/proc/Destroy  (code/game/machinery/doors/firedoor.dm:67)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "remove_from_areas");
	yield* g.callName(f, rt.sv(f, "affecting_areas"), "Cut", []);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/door/firedoor/proc/Bumped  (code/game/machinery/doors/firedoor.dm:72)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/Bumped", function* Bumped(f: Frame) {
	if ((truthy(rt.sv(f, "panel_open")) || truthy(rt.sv(f, "operating")))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "density"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return 0;
}, true, { args: ["AM"] });

// /obj/machinery/door/firedoor/proc/power_change  (code/game/machinery/doors/firedoor.dm:80)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/power_change", function* power_change(f: Frame) {
	if (truthy((yield* g.srcCall(f, "powered", rt.sv(f, "power_channel"))))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		yield* g.srcCall(f, "latetoggle");
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	return f.dot;
}, true);

// /obj/machinery/door/firedoor/proc/attack_hand  (code/game/machinery/doors/firedoor.dm:87)
rt.def("/obj/machinery/door/firedoor/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if ((truthy(rt.sv(f, "operating")) || !truthy(rt.sv(f, "density")))) {
		return live(f.dot);
	}
	rt.callName(f, live(user), "changeNext_move", [8]);
	rt.callName(f, live(user), "visible_message", [fmt("＀ bangs on ％！.", [live(user), live(f.src)]), fmt("You bang on ％！.", [live(f.src)])]);
	rt.call(f, P("/proc/playsound"), null, [null, rt.sv(f, "loc"), null, rt.rsc("sound/effects/glassknock.ogg"), null, 10, null, 0, "frequency", 32000], rt.Args.Named);
	return f.dot;
});

// /obj/machinery/door/firedoor/proc/attackby  (code/game/machinery/doors/firedoor.dm:96)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy(rt.sv(f, "operating"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "welded"))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "boltslocked"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>There are screws locking the bolts in place!</span>"]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts undoing ＀'s bolts...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start unfastening ＀'s floor bolts...</span>", [live(f.src)])]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ unfastens ＀'s bolts.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You undo ＀'s floor bolts.</span>", [live(f.src)])]);
			yield* g.srcCall(f, "deconstruct", 1);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			$0 = live(f.args[1]);
			$1 = live(f.args[1]);
			if (truthy(rt.sv(f, "boltslocked"))) {
				$1 = $1;
				$2 = "unlocks";
			} else {
				$2 = "locks";
			}
			$1 = fmt("<span class='notice'>＀ ＀ ＀'s bolts.</span>", [$1, $2, live(f.src)]);
			if (truthy(rt.sv(f, "boltslocked"))) {
				$2 = "unlock";
			} else {
				$2 = "lock";
			}
			yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀ ＀'s floor bolts.</span>", [$2, live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			rt.setSv(f, "boltslocked", (!truthy(rt.sv(f, "boltslocked")) ? 1 : 0));
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["C", "user", "params"] });

// /obj/machinery/door/firedoor/proc/try_to_weld  (code/game/machinery/doors/firedoor.dm:128)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/try_to_weld", function* try_to_weld(f: Frame, W: Value, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [W, user, $0, $1, $2];
	if (!truthy((yield* g.callName(f, live(W), "remove_fuel", [0, live(user)])))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(W)), 50, 1]);
	$0 = live(user);
	$1 = live(user);
	if (truthy(rt.sv(f, "welded"))) {
		$1 = $1;
		$2 = "unwelding";
	} else {
		$2 = "welding";
	}
	yield* g.callName(f, $0, "visible_message", [fmt("<span class='notice'>＀ starts ＀ ＀.</span>", [$1, $2, live(f.src)]), fmt("<span class='notice'>You start welding ＀.</span>", [live(f.src)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(40, rt.fv(f, "toolspeed", live(W))), null, 1, "target", live(f.src)], rt.Args.Named)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(W)), 50, 1]);
	rt.setSv(f, "welded", (!truthy(rt.sv(f, "welded")) ? 1 : 0));
	$0 = live(user);
	$1 = live(user);
	if (truthy(rt.sv(f, "welded"))) {
		$1 = $1;
		$2 = "welds";
	} else {
		$2 = "unwelds";
	}
	$1 = fmt("<span class='danger'>＀ ＀ ＀.</span>", [$1, $2, live(f.src)]);
	if (truthy(rt.sv(f, "welded"))) {
		$2 = "weld";
	} else {
		$2 = "unweld";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, $1, fmt("<span class='notice'>You ＀ ＀.</span>", [$2, live(f.src)])]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/door/firedoor/proc/try_to_crowbar  (code/game/machinery/doors/firedoor.dm:138)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/try_to_crowbar", function* try_to_crowbar(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if ((truthy(rt.sv(f, "welded")) || truthy(rt.sv(f, "operating")))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "density"))) {
		yield* g.srcCall(f, "open");
	} else {
		yield* g.srcCall(f, "close");
	}
	return f.dot;
}, true);

// /obj/machinery/door/firedoor/proc/attack_ai  (code/game/machinery/doors/firedoor.dm:147)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (((truthy(rt.sv(f, "welded")) || truthy(rt.sv(f, "operating"))) || truthy(rt.bitAnd(rt.sv(f, "stat"), 2)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "density"))) {
		yield* g.srcCall(f, "open");
	} else {
		yield* g.srcCall(f, "close");
	}
	return f.dot;
}, true);

// /obj/machinery/door/firedoor/proc/attack_alien  (code/game/machinery/doors/firedoor.dm:156)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (truthy(rt.sv(f, "welded"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ refuses to budge!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "open");
	return f.dot;
}, true);

// /obj/machinery/door/firedoor/proc/do_animate  (code/game/machinery/doors/firedoor.dm:163)
rt.def("/obj/machinery/door/firedoor/proc/do_animate", function do_animate(f: Frame, animation: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(animation);
	if ($0 === "opening") {
		rt.call(f, P("/proc/flick"), null, ["door_opening", live(f.src)]);
	} else if ($0 === "closing") {
		rt.call(f, P("/proc/flick"), null, ["door_closing", live(f.src)]);
	}
	return f.dot;
});

// /obj/machinery/door/firedoor/proc/update_icon  (code/game/machinery/doors/firedoor.dm:170)
rt.def("/obj/machinery/door/firedoor/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "density"))) {
		rt.setSv(f, "icon_state", "door_closed");
		if (truthy(rt.sv(f, "welded"))) {
			rt.callSrc(f, "add_overlay", ["welded"]);
		}
	} else {
		rt.setSv(f, "icon_state", "door_open");
		if (!truthy(rt.sv(f, "welded"))) return f.dot;
		rt.callSrc(f, "add_overlay", ["welded_open"]);
	}
	return f.dot;
});

// /obj/machinery/door/firedoor/proc/open  (code/game/machinery/doors/firedoor.dm:181)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/open", function* open(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "latetoggle");
	return f.dot;
}, true);

// /obj/machinery/door/firedoor/proc/close  (code/game/machinery/doors/firedoor.dm:185)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/close", function* close(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "latetoggle");
	return f.dot;
}, true);

// /obj/machinery/door/firedoor/proc/deconstruct  (code/game/machinery/doors/firedoor.dm:189)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let F: Value = null;
	f.vars = () => [disassembled, F];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		F = (yield* g.new_(f, rt.sv(f, "assemblytype"), [rt.getStep(f, live(f.src), 0)]));
		if (truthy(live(disassembled))) {
			rt.setFv(f, "constructionStep", live(F), 1);
		} else {
			rt.setFv(f, "constructionStep", live(F), 2);
			rt.setFv(f, "obj_integrity", live(F), multiply(rt.fv(f, "max_integrity", live(F)), 0.5));
		}
		yield* g.callName(f, live(F), "update_icon", []);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/door/firedoor/proc/latetoggle  (code/game/machinery/doors/firedoor.dm:201)  may sleep
rt.def("/obj/machinery/door/firedoor/proc/latetoggle", function* latetoggle(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (((truthy(rt.sv(f, "operating")) || truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) || !truthy(rt.sv(f, "nextstate")))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "nextstate");
	if ($0 === 1) {
		rt.setSv(f, "nextstate", null);
		yield* g.srcCall(f, "open");
	} else if ($0 === 2) {
		rt.setSv(f, "nextstate", null);
		yield* g.srcCall(f, "close");
	}
	return f.dot;
}, true);

rt.type(10290, "/obj/machinery/door/firedoor/border_only", "/obj/machinery/door/firedoor", {
	flags: 512,
	CanAtmosPass: -1,
	icon: rt.rsc("icons/obj/doors/edge_Doorfire.dmi"),
});

// /obj/machinery/door/firedoor/border_only/proc/CanPass  (code/game/machinery/doors/firedoor.dm:217)
rt.def("/obj/machinery/door/firedoor/border_only/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [2])))) {
		return 1;
	}
	if (isEqual(rt.getDir(f, rt.sv(f, "loc"), live(target)), rt.sv(f, "dir"))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	return 1;
});

// /obj/machinery/door/firedoor/border_only/proc/CheckExit  (code/game/machinery/doors/firedoor.dm:225)
rt.def("/obj/machinery/door/firedoor/border_only/proc/CheckExit", function CheckExit(f: Frame, mover: Value, target: Value) {
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [2])))) {
		return 1;
	}
	if (isEqual(rt.getDir(f, rt.sv(f, "loc"), live(target)), rt.sv(f, "dir"))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	return 1;
});

// /obj/machinery/door/firedoor/border_only/proc/CanAtmosPass  (code/game/machinery/doors/firedoor.dm:233)
rt.def("/obj/machinery/door/firedoor/border_only/proc/CanAtmosPass", function CanAtmosPass(f: Frame, _T: Value) {
	if (isEqual(rt.getDir(f, rt.sv(f, "loc"), live(_T)), rt.sv(f, "dir"))) {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	return 1;
});

rt.type(12554, "/obj/structure/firelock_frame", "/obj/structure", {
	constructionStep: 4,
	reinforced: 0,
	anchored: 0,
	name: "firelock frame",
	desc: "A partially completed firelock.",
	icon: rt.rsc("icons/obj/doors/doorfire.dmi"),
	icon_state: "frame1",
	density: 1,
});

// /obj/structure/firelock_frame/proc/examine  (code/game/machinery/doors/firedoor.dm:264)
rt.def("/obj/structure/firelock_frame/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "constructionStep");
	if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It is <i>unbolted</i> from the floor. A small <b>loosely connected</b> metal plate is covering the wires.</span>"]);
		if (!truthy(rt.sv(f, "reinforced"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It could be reinforced with plasteel.</span>"]);
		}
	} else if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The maintenance plate has been <i>pried away</i>, and <b>wires</b> are trailing.</span>"]);
	} else if ($0 === 3) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The maintenance panel is missing <i>wires</i> and the circuit board is <b>loosely connected</b>.</span>"]);
	} else if ($0 === 4) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>There are no <i>firelock electronics</i> in the frame. The frame could be <b>cut</b> apart.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/firelock_frame/proc/update_icon  (code/game/machinery/doors/firedoor.dm:278)
rt.def("/obj/structure/firelock_frame/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("frame＀", [rt.sv(f, "constructionStep")]));
	return f.dot;
});

// /obj/structure/firelock_frame/proc/attackby  (code/game/machinery/doors/firedoor.dm:282)  may sleep
rt.def("/obj/structure/firelock_frame/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null, B: Value = null, W: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [_P, B, W, _T, $0];
	$0 = rt.sv(f, "constructionStep");
	if ($0 === 1) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts prying something out from ＀...</span>", [live(f.args[1]), live(f.src)]), "<span class='notice'>You begin prying out the wire cover...</span>"]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			if (!isEqual(rt.sv(f, "constructionStep"), 1)) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ pries out a metal plate from ＀, exposing the wires.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You remove the cover plate from ＀, exposing the wires.</span>", [live(f.src)])]);
			rt.setSv(f, "constructionStep", 2);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			if (truthy(rt.locateIn(f, T("/obj/machinery/door/firedoor"), rt.getStep(f, live(f.src), 0)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There's already a firelock there.</span>"]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts bolting down ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin bolting ＀...</span>", [live(f.src)])]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			if (truthy(rt.locateIn(f, T("/obj/machinery/door/firedoor"), rt.getStep(f, live(f.src), 0)))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ finishes the firelock.</span>", [live(f.args[1])]), "<span class='notice'>You finish the firelock.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			if (truthy(rt.sv(f, "reinforced"))) {
				yield* g.new_(f, T("/obj/machinery/door/firedoor/heavy"), [rt.getStep(f, live(f.src), 0)]);
			} else {
				yield* g.new_(f, T("/obj/machinery/door/firedoor"), [rt.getStep(f, live(f.src), 0)]);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/plasteel")) ? 1 : 0))) {
			_P = live(f.args[0]);
			if (truthy(rt.sv(f, "reinforced"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is already reinforced.</span>", [live(f.src)])]);
				return live(f.dot);
			}
			if (rt.lt((yield* g.callName(f, live(_P), "get_amount", [])), 2)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need more plasteel to reinforce ＀.</span>", [live(f.src)])]);
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ begins reinforcing ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin reinforcing ＀...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 60, "target", live(f.src)], rt.Args.Named)))) {
				if ((((!isEqual(rt.sv(f, "constructionStep"), 1) || truthy(rt.sv(f, "reinforced"))) || rt.lt((yield* g.callName(f, live(_P), "get_amount", [])), 2)) || !truthy(live(_P)))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ reinforces ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You reinforce ＀.</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				yield* g.callName(f, live(_P), "use", [2]);
				rt.setSv(f, "reinforced", 1);
			}
			return live(f.dot);
		}
	} else if ($0 === 2) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts cutting the wires from ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin removing ＀'s wires...</span>", [live(f.src)])]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(60, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			if (!isEqual(rt.sv(f, "constructionStep"), 2)) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ removes the wires from ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You remove the wiring from ＀, exposing the circuit board.</span>", [live(f.src)])]);
			rt.setFv(f, "amount", (B = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, live(f.src), 0)]))), 5);
			rt.setSv(f, "constructionStep", 3);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts prying a metal plate into ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin prying the cover plate back onto ＀...</span>", [live(f.src)])]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(80, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			if (!isEqual(rt.sv(f, "constructionStep"), 2)) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ pries the metal plate into ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You pry ＀'s cover plate into place, hiding the wires.</span>", [live(f.src)])]);
			rt.setSv(f, "constructionStep", 1);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
	} else if ($0 === 3) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ begins removing the circuit board from ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin prying out the circuit board from ＀...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			if (!isEqual(rt.sv(f, "constructionStep"), 3)) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ removes ＀'s circuit board.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You remove the circuit board from ＀.</span>", [live(f.src)])]);
			yield* g.new_(f, T("/obj/item/weapon/electronics/firelock"), [rt.getStep(f, live(f.src), 0)]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			rt.setSv(f, "constructionStep", 4);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
			if (rt.lt((yield* g.callName(f, (B = live(f.args[0])), "get_amount", [])), 5)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need more wires to add wiring to ＀.</span>", [live(f.src)])]);
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ begins wiring ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin adding wires to ＀...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 60, "target", live(f.src)], rt.Args.Named)))) {
				if (((!isEqual(rt.sv(f, "constructionStep"), 3) || rt.lt((yield* g.callName(f, live(B), "get_amount", [])), 5)) || !truthy(live(B)))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ adds wires to ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You wire ＀.</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				yield* g.callName(f, live(B), "use", [5]);
				rt.setSv(f, "constructionStep", 2);
				yield* g.srcCall(f, "update_icon");
			}
			return live(f.dot);
		}
	} else if ($0 === 4) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (W = live(f.args[0])), "remove_fuel", [1, live(f.args[1])])))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(W)), 50, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ begins cutting apart ＀'s frame...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin slicing ＀ apart...</span>", [live(f.src)])]);
				if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(80, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					return live(f.dot);
				}
				if (!isEqual(rt.sv(f, "constructionStep"), 4)) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ cuts apart ＀!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You cut ＀ into metal.</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
				yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [(_T = rt.getStep(f, live(f.src), 0)), 3]);
				if (truthy(rt.sv(f, "reinforced"))) {
					yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [live(_T), 2]);
				}
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/electronics/firelock")) ? 1 : 0))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts adding ＀ to ＀...</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You begin adding a circuit board to ＀...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			if (!isEqual(rt.sv(f, "constructionStep"), 4)) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "drop_item", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ adds a circuit to ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You insert and secure ＀.</span>", [live(f.args[0])])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			rt.setSv(f, "constructionStep", 3);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["C", "user"] });
