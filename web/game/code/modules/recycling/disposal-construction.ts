// From code/modules/recycling/disposal-construction.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12986, "/obj/structure/disposalconstruct", "/obj/structure", {
	ptype: 0,
	dpdir: 0,
	base_state: "pipe-s",
	anchored: 0,
	pressure_resistance: 506.625,
	level: 2,
	name: "disposal pipe segment",
	desc: "A huge pipe segment used for constructing disposal systems.",
	icon: rt.rsc("icons/obj/atmospherics/pipes/disposal.dmi"),
	icon_state: "conpipe-s",
	density: 0,
	obj_integrity: 200,
	max_integrity: 200,
});

// /obj/structure/disposalconstruct/proc/examine  (code/modules/recycling/disposal-construction.dm:22)
rt.def("/obj/structure/disposalconstruct/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Alt-click to rotate it clockwise.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/disposalconstruct/proc/New  (code/modules/recycling/disposal-construction.dm:26)  may sleep
rt.def("/obj/structure/disposalconstruct/proc/New", function* New(f: Frame, loc: Value, pipe_type: Value, direction: Value) {
	f.vars = () => [loc, pipe_type, direction];
	if (live(direction) === null) {
		direction = 1;
	}
	yield* g.callSuper(f, [live(loc)]);
	if (truthy(live(pipe_type))) {
		rt.setSv(f, "ptype", live(pipe_type));
	}
	yield* g.srcCall(f, "setDir", live(direction));
	return f.dot;
}, true);

// /obj/structure/disposalconstruct/proc/update_icon  (code/modules/recycling/disposal-construction.dm:33)
rt.def("/obj/structure/disposalconstruct/proc/update_icon", function update_icon(f: Frame) {
	let flip: Value = null, left: Value = null, right: Value = null;
	let $0: any;
	f.vars = () => [flip, left, right, $0];
	flip = rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]);
	left = rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 90]);
	right = rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -90]);
	$0 = rt.sv(f, "ptype");
	if ($0 === 0) {
		rt.setSv(f, "base_state", "pipe-s");
		rt.setSv(f, "dpdir", rt.bitOr(rt.sv(f, "dir"), live(flip)));
	} else if ($0 === 1) {
		rt.setSv(f, "base_state", "pipe-c");
		rt.setSv(f, "dpdir", rt.bitOr(rt.sv(f, "dir"), live(right)));
	} else if ($0 === 2) {
		rt.setSv(f, "base_state", "pipe-j1");
		rt.setSv(f, "dpdir", rt.bitOr(rt.bitOr(rt.sv(f, "dir"), live(right)), live(flip)));
	} else if ($0 === 3) {
		rt.setSv(f, "base_state", "pipe-j2");
		rt.setSv(f, "dpdir", rt.bitOr(rt.bitOr(rt.sv(f, "dir"), live(left)), live(flip)));
	} else if ($0 === 4) {
		rt.setSv(f, "base_state", "pipe-y");
		rt.setSv(f, "dpdir", rt.bitOr(rt.bitOr(rt.sv(f, "dir"), live(left)), live(right)));
	} else if ($0 === 5) {
		rt.setSv(f, "base_state", "pipe-t");
		rt.setSv(f, "dpdir", rt.sv(f, "dir"));
	} else if ($0 === 6) {
		if (truthy(rt.sv(f, "anchored"))) {
			rt.setSv(f, "base_state", "disposal");
		} else {
			rt.setSv(f, "base_state", "condisposal");
		}
	} else if ($0 === 7) {
		rt.setSv(f, "base_state", "outlet");
		rt.setSv(f, "dpdir", rt.sv(f, "dir"));
	} else if ($0 === 8) {
		rt.setSv(f, "base_state", "intake");
		rt.setSv(f, "dpdir", rt.sv(f, "dir"));
	} else if ($0 === 9) {
		rt.setSv(f, "base_state", "pipe-j1s");
		rt.setSv(f, "dpdir", rt.bitOr(rt.bitOr(rt.sv(f, "dir"), live(right)), live(flip)));
	} else if ($0 === 10) {
		rt.setSv(f, "base_state", "pipe-j2s");
		rt.setSv(f, "dpdir", rt.bitOr(rt.bitOr(rt.sv(f, "dir"), live(left)), live(flip)));
	}
	if (truthy(rt.callSrc(f, "is_pipe", []))) {
		rt.setSv(f, "icon_state", fmt("con＀", [rt.sv(f, "base_state")]));
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "base_state"));
	}
	if (truthy(rt.sv(f, "invisibility"))) {
		$0 = 0;
	} else {
		$0 = 255;
	}
	rt.setSv(f, "alpha", $0);
	return f.dot;
});

// /obj/structure/disposalconstruct/proc/hide  (code/modules/recycling/disposal-construction.dm:91)
rt.def("/obj/structure/disposalconstruct/proc/hide", function hide(f: Frame, intact: Value) {
	let $0: any;
	f.vars = () => [$0];
	if ((truthy(live(intact)) && isEqual(rt.sv(f, "level"), 1))) {
		$0 = 100;
	} else {
		$0 = 0;
	}
	rt.setSv(f, "invisibility", $0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/structure/disposalconstruct/verb/rotate  (code/modules/recycling/disposal-construction.dm:101)
rt.def("/obj/structure/disposalconstruct/verb/rotate", function rotate(f: Frame) {
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anchored"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You must unfasten the pipe before rotating it!</span>"]);
		return live(f.dot);
	}
	rt.callSrc(f, "setDir", [rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -90])]);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { verb: { name: "Rotate Pipe", category: "Object", src: 1, range: 1 } });

// /obj/structure/disposalconstruct/proc/AltClick  (code/modules/recycling/disposal-construction.dm:112)  may sleep
rt.def("/obj/structure/disposalconstruct/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) {
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "rotate");
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/disposalconstruct/verb/flip  (code/modules/recycling/disposal-construction.dm:125)
rt.def("/obj/structure/disposalconstruct/verb/flip", function flip(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anchored"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You must unfasten the pipe before flipping it!</span>"]);
		return live(f.dot);
	}
	rt.callSrc(f, "setDir", [rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180])]);
	$0 = rt.sv(f, "ptype");
	if ($0 === 2) {
		rt.setSv(f, "ptype", 3);
	} else if ($0 === 3) {
		rt.setSv(f, "ptype", 2);
	} else if ($0 === 9) {
		rt.setSv(f, "ptype", 10);
	} else if ($0 === 10) {
		rt.setSv(f, "ptype", 9);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { verb: { name: "Flip Pipe", category: "Object", src: 1, range: 1 } });

// /obj/structure/disposalconstruct/proc/dpipetype  (code/modules/recycling/disposal-construction.dm:147)
rt.def("/obj/structure/disposalconstruct/proc/dpipetype", function dpipetype(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "ptype");
	if ($0 === 0 || $0 === 1) {
		return T("/obj/structure/disposalpipe/segment");
	} else if ($0 === 2 || $0 === 3 || $0 === 4) {
		return T("/obj/structure/disposalpipe/junction");
	} else if ($0 === 5) {
		return T("/obj/structure/disposalpipe/trunk");
	} else if ($0 === 6) {
		return T("/obj/machinery/disposal/bin");
	} else if ($0 === 7) {
		return T("/obj/structure/disposaloutlet");
	} else if ($0 === 8) {
		return T("/obj/machinery/disposal/deliveryChute");
	} else if ($0 === 9 || $0 === 10) {
		return T("/obj/structure/disposalpipe/sortjunction");
	}
	return live(f.dot);
});

// /obj/structure/disposalconstruct/proc/attackby  (code/modules/recycling/disposal-construction.dm:171)  may sleep
rt.def("/obj/structure/disposalconstruct/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let nicetype: Value = null, ispipe: Value = null, _T: Value = null, CP: Value = null, pdir: Value = null, W: Value = null, pipetype: Value = null, _P: Value = null, SortP: Value = null, B: Value = null, _P_5: Value = null;
	let $0: any;
	f.vars = () => [I, user, params, nicetype, ispipe, _T, CP, pdir, W, pipetype, _P, SortP, B, _P_5, $0];
	nicetype = "pipe";
	ispipe = (yield* g.srcCall(f, "is_pipe"));
	yield* g.srcCall(f, "add_fingerprint", live(user));
	$0 = rt.sv(f, "ptype");
	if ($0 === 6) {
		nicetype = "disposal bin";
	} else if ($0 === 7) {
		nicetype = "disposal outlet";
	} else if ($0 === 8) {
		nicetype = "delivery chute";
	} else if ($0 === 9 || $0 === 10) {
		nicetype = "sorting pipe";
	} else {
		nicetype = "pipe";
	}
	if ((truthy(rt.gv(f, "intact", (_T = rt.sv(f, "loc")))) && truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can only attach the ＀ if the floor plating is removed!</span>", [live(nicetype)])]);
		return live(f.dot);
	}
	if ((!truthy(live(ispipe)) && truthy((rt.istype(live(_T), T("/turf/closed/wall")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't build ＀s on walls, only disposal pipes!</span>", [live(nicetype)])]);
		return live(f.dot);
	}
	CP = rt.locateIn(f, T("/obj/structure/disposalpipe"), live(_T));
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "anchored"))) {
			rt.setSv(f, "anchored", 0);
			if (truthy(live(ispipe))) {
				rt.setSv(f, "level", 2);
			}
			rt.setSv(f, "density", 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You detach the ＀ from the underfloor.</span>", [live(nicetype)])]);
		} else {
			if (!truthy((yield* g.srcCall(f, "is_pipe")))) {
				if (truthy(live(CP))) {
					if (!truthy((rt.istype(live(CP), T("/obj/structure/disposalpipe/trunk")) ? 1 : 0))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ requires a trunk underneath it in order to work!</span>", [live(nicetype)])]);
						return live(f.dot);
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ requires a trunk underneath it in order to work!</span>", [live(nicetype)])]);
					return live(f.dot);
				}
			} else {
				if (truthy(live(CP))) {
					yield* g.srcCall(f, "update_icon");
					pdir = rt.fv(f, "dpdir", live(CP));
					if (truthy((rt.istype(live(CP), T("/obj/structure/disposalpipe/broken")) ? 1 : 0))) {
						pdir = rt.fv(f, "dir", live(CP));
					}
					if (truthy(rt.bitAnd(live(pdir), rt.sv(f, "dpdir")))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>There is already a ＀ at that location!</span>", [live(nicetype)])]);
						return live(f.dot);
					}
				}
			}
			rt.setSv(f, "anchored", 1);
			if (truthy(live(ispipe))) {
				rt.setSv(f, "level", 1);
			}
			rt.setSv(f, "density", 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You attach the ＀ to the underfloor.</span>", [live(nicetype)])]);
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(I)), 100, 1]);
		yield* g.srcCall(f, "update_icon");
	} else {
		if (!truthy((rt.istype(live(I), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) return f.dot;
		if (truthy(rt.sv(f, "anchored"))) {
			if (truthy((yield* g.callName(f, (W = live(I)), "remove_fuel", [0, live(user)])))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 100, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You start welding the ＀ in place...</span>", [live(nicetype)])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(8, rt.fv(f, "toolspeed", live(I))), "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(rt.sv(f, "loc")) || !truthy((yield* g.callName(f, live(W), "isOn", []))))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The ＀ has been welded in place.</span>", [live(nicetype)])]);
					yield* g.srcCall(f, "update_icon");
					if (truthy(live(ispipe))) {
						pipetype = (yield* g.srcCall(f, "dpipetype"));
						yield* g.callName(f, (_P = (yield* g.new_(f, live(pipetype), [rt.sv(f, "loc"), live(f.src)]))), "updateicon", []);
						yield* g.srcCall(f, "transfer_fingerprints_to", live(_P));
						if ((isEqual(rt.sv(f, "ptype"), 9) || isEqual(rt.sv(f, "ptype"), 10))) {
							yield* g.callName(f, (SortP = live(_P)), "updatedir", []);
						}
					} else {
						if (isEqual(rt.sv(f, "ptype"), 6)) {
							rt.setFv(f, "pressure_charging", (B = (yield* g.new_(f, T("/obj/machinery/disposal/bin"), [rt.sv(f, "loc"), live(f.src)]))), 0);
							yield* g.srcCall(f, "transfer_fingerprints_to", live(B));
						} else {
							if (isEqual(rt.sv(f, "ptype"), 7)) {
								yield* g.srcCall(f, "transfer_fingerprints_to", (_P_5 = (yield* g.new_(f, T("/obj/structure/disposaloutlet"), [rt.sv(f, "loc"), live(f.src)]))));
							} else {
								if (isEqual(rt.sv(f, "ptype"), 8)) {
									yield* g.srcCall(f, "transfer_fingerprints_to", (_P_5 = (yield* g.new_(f, T("/obj/machinery/disposal/deliveryChute"), [rt.sv(f, "loc"), live(f.src)]))));
								}
							}
						}
					}
					return live(f.dot);
				}
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to attach it to the plating first!</span>"]);
			return live(f.dot);
		}
	}
	return f.dot;
}, true);

// /obj/structure/disposalconstruct/proc/is_pipe  (code/modules/recycling/disposal-construction.dm:271)
rt.def("/obj/structure/disposalconstruct/proc/is_pipe", function is_pipe(f: Frame) {
	return (!(rt.ge(rt.sv(f, "ptype"), 6) && rt.le(rt.sv(f, "ptype"), 8)) ? 1 : 0);
});

// /obj/structure/disposalconstruct/proc/can_place  (code/modules/recycling/disposal-construction.dm:275)
rt.def("/obj/structure/disposalconstruct/proc/can_place", function can_place(f: Frame) {
	let DC: Value = null;
	let $e: any;
	f.vars = () => [DC, $e];
	if (truthy(rt.callSrc(f, "is_pipe", []))) {
		return 1;
	}
	DC = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/obj/structure/disposalconstruct"));
	while (($e = rt.next(f, 0)) !== undefined) {
		DC = $e;
		if (isEqual(live(DC), live(f.src))) {
			continue;
		}
		if (!truthy(rt.callName(f, live(DC), "is_pipe", []))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});
