// From code/modules/recycling/disposal-structures.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12987, "/obj/structure/disposalholder", "/obj/structure", {
	gas: null,
	active: 0,
	count: 1000,
	destinationTag: 0,
	tomail: 0,
	hasmob: 0,
	invisibility: 100,
	resistance_flags: 115,
	dir: 0,
});

// /obj/structure/disposalholder/proc/Destroy  (code/modules/recycling/disposal-structures.dm:19)  may sleep
rt.def("/obj/structure/disposalholder/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "gas")]);
	rt.setSv(f, "active", 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/disposalholder/proc/init  (code/modules/recycling/disposal-structures.dm:29)  may sleep
rt.def("/obj/structure/disposalholder/proc/init", function* init(f: Frame, D: Value) {
	let M: Value = null, O: Value = null, M_1: Value = null, AM: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [D, M, O, M_1, AM, _T, $e];
	rt.setSv(f, "gas", rt.fv(f, "air_contents", live(D)));
	M = null;
	rt.forList(f, 0, live(D), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "client", live(M)))) {
			yield* g.callName(f, live(M), "reset_perspective", [live(f.src)]);
		}
		rt.setSv(f, "hasmob", 1);
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, live(D), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy(rt.fv(f, "contents", live(O)))) {
			M_1 = null;
			rt.forList(f, 1, rt.fv(f, "contents", live(O)), T("/mob/living"));
			while (($e = rt.next(f, 1)) !== undefined) {
				M_1 = $e;
				rt.setSv(f, "hasmob", 1);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	AM = null;
	rt.forList(f, 0, live(D), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		rt.setFv(f, "loc", live(AM), live(f.src));
		if ((truthy((rt.istype(live(AM), T("/obj/structure/bigDelivery")) ? 1 : 0)) && !truthy(rt.sv(f, "hasmob")))) {
			_T = live(AM);
			rt.setFv(f, "destinationTag", live(f.src), rt.fv(f, "sortTag", live(_T)));
		}
		if ((truthy((rt.istype(live(AM), T("/obj/item/smallDelivery")) ? 1 : 0)) && !truthy(rt.sv(f, "hasmob")))) {
			_T = live(AM);
			rt.setFv(f, "destinationTag", live(f.src), rt.fv(f, "sortTag", live(_T)));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/disposalholder/proc/start  (code/modules/recycling/disposal-structures.dm:56)  may sleep
rt.def("/obj/structure/disposalholder/proc/start", function* start(f: Frame, D: Value) {
	f.vars = () => [D];
	if (!truthy(rt.fv(f, "trunk", live(D)))) {
		yield* g.callName(f, live(D), "expel", [live(f.src)]);
		return live(f.dot);
	}
	rt.setSv(f, "loc", rt.fv(f, "trunk", live(D)));
	rt.setSv(f, "active", 1);
	yield* g.srcCall(f, "setDir", 32);
	yield* g.srcCall(f, "move");
	return live(f.dot);
}, true);

// /obj/structure/disposalholder/proc/move  (code/modules/recycling/disposal-structures.dm:71)  may sleep
rt.def("/obj/structure/disposalholder/proc/move", function* move(f: Frame) {
	let last: Value = null, curr: Value = null;
	f.vars = () => [last, curr];
	last = null;
	while (truthy(rt.sv(f, "active"))) {
		last = (curr = rt.sv(f, "loc"));
		if ((!truthy((curr = (yield* g.callName(f, live(curr), "transfer", [live(f.src)])))) && truthy(rt.sv(f, "active")))) {
			yield* g.callName(f, live(last), "expel", [live(f.src), rt.sv(f, "loc"), rt.sv(f, "dir")]);
		}
		yield* g.call(f, P("/proc/stoplag"), null, []);
		if (!truthy(rt.incSrcVar(f, "count", -1, true))) {
			rt.setSv(f, "active", 0);
		}
	}
	return live(f.dot);
}, true, { waitfor: false });

// /obj/structure/disposalholder/proc/nextloc  (code/modules/recycling/disposal-structures.dm:84)
rt.def("/obj/structure/disposalholder/proc/nextloc", function nextloc(f: Frame) {
	return rt.getStep(f, rt.sv(f, "loc"), rt.sv(f, "dir"));
});

// /obj/structure/disposalholder/proc/findpipe  (code/modules/recycling/disposal-structures.dm:89)
rt.def("/obj/structure/disposalholder/proc/findpipe", function findpipe(f: Frame, _T: Value) {
	let fdir: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [fdir, _P, $e];
	if (!truthy(live(_T))) {
		return null;
	}
	fdir = rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]);
	_P = null;
	rt.forList(f, 0, live(_T), T("/obj/structure/disposalpipe"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if (truthy(rt.bitAnd(live(fdir), rt.fv(f, "dpdir", live(_P))))) {
			return live(_P);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/structure/disposalholder/proc/merge  (code/modules/recycling/disposal-structures.dm:102)  may sleep
rt.def("/obj/structure/disposalholder/proc/merge", function* merge(f: Frame, other: Value) {
	let AM: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [other, AM, M, $e];
	AM = null;
	rt.forList(f, 0, live(other), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		rt.setFv(f, "loc", live(AM), live(f.src));
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
			yield* g.callName(f, (M = live(AM)), "reset_perspective", [live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(other)]);
	return f.dot;
}, true);

// /obj/structure/disposalholder/proc/relaymove  (code/modules/recycling/disposal-structures.dm:112)
rt.def("/obj/structure/disposalholder/proc/relaymove", function relaymove(f: Frame, user: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (truthy(rt.fv(f, "stat", live(user)))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "loc", live(f.src)))) {
		M = null;
		rt.forList(f, 0, rt.call(f, P("/proc/get_hearers_in_view"), null, [rt.gv(f, "loc", rt.fv(f, "loc", live(f.src)))]), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			rt.callName(f, live(M), "show_message", [fmt("<FONT size=＀>CLONG, clong!</FONT>", [rt.call(f, P("/proc/max"), null, [0, subtract(5, rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(M)]))])]), 2]);
		}
		rt.endFor(f, 0);
	}
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/clang.ogg"), 50, 0, 0]);
	return f.dot;
});

// /obj/structure/disposalholder/proc/vent_gas  (code/modules/recycling/disposal-structures.dm:121)  may sleep
rt.def("/obj/structure/disposalholder/proc/vent_gas", function* vent_gas(f: Frame, _T: Value) {
	f.vars = () => [_T];
	yield* g.callName(f, live(_T), "assume_air", [rt.sv(f, "gas")]);
	yield* g.callName(f, live(_T), "air_update_turf", []);
	return f.dot;
}, true);

rt.type(12517, "/obj/structure/disposalpipe", "/obj/structure", {
	dpdir: 0,
	base_icon_state: null,
	stored: null,
	anchored: 1,
	level: 1,
	icon: rt.rsc("icons/obj/atmospherics/pipes/disposal.dmi"),
	name: "disposal pipe",
	desc: "An underfloor disposal pipe.",
	density: 0,
	on_blueprints: 1,
	dir: 0,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	layer: 2.3,
});

// /obj/structure/disposalpipe/proc/<init>  (code/modules/recycling/disposal-structures.dm:144)
rt.def("/obj/structure/disposalpipe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 10, "laser", 10, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 90, "acid", 30]));
	return f.dot;
});

// /obj/structure/disposalpipe/proc/Initialize  (code/modules/recycling/disposal-structures.dm:151)  may sleep
rt.def("/obj/structure/disposalpipe/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((truthy(live(f.args[1])) && !(!truthy(live(f.args[1])) || truthy(rt.fv(f, "gc_destroyed", live(f.args[1])))))) {
		rt.setSv(f, "base_icon_state", rt.fv(f, "base_state", live(f.args[1])));
		yield* g.srcCall(f, "setDir", rt.fv(f, "dir", live(f.args[1])));
		rt.setSv(f, "dpdir", rt.fv(f, "dpdir", live(f.args[1])));
		rt.setFv(f, "loc", live(f.args[1]), live(f.src));
		rt.setSv(f, "stored", live(f.args[1]));
	} else {
		rt.setSv(f, "base_icon_state", rt.sv(f, "icon_state"));
		rt.setSv(f, "stored", (yield* g.new_(f, T("/obj/structure/disposalconstruct"), [null, live(f.src), "direction", rt.sv(f, "dir")], rt.Args.Named)));
		$0 = rt.sv(f, "base_icon_state");
		if ($0 === "pipe-s") {
			rt.setFv(f, "ptype", rt.sv(f, "stored"), 0);
		} else if ($0 === "pipe-c") {
			rt.setFv(f, "ptype", rt.sv(f, "stored"), 1);
		} else if ($0 === "pipe-j1") {
			rt.setFv(f, "ptype", rt.sv(f, "stored"), 2);
		} else if ($0 === "pipe-j2") {
			rt.setFv(f, "ptype", rt.sv(f, "stored"), 3);
		} else if ($0 === "pipe-y") {
			rt.setFv(f, "ptype", rt.sv(f, "stored"), 4);
		} else if ($0 === "pipe-t") {
			rt.setFv(f, "ptype", rt.sv(f, "stored"), 5);
		} else if ($0 === "pipe-j1s") {
			rt.setFv(f, "ptype", rt.sv(f, "stored"), 9);
		} else if ($0 === "pipe-j2s") {
			rt.setFv(f, "ptype", rt.sv(f, "stored"), 10);
		}
	}
	return f.dot;
}, true, { args: ["mapload", "make_from"] });

// /obj/structure/disposalpipe/proc/Destroy  (code/modules/recycling/disposal-structures.dm:184)  may sleep
rt.def("/obj/structure/disposalpipe/proc/Destroy", function* Destroy(f: Frame) {
	let H: Value = null, _T: Value = null;
	f.vars = () => [H, _T];
	if (truthy((H = rt.locateIn(f, T("/obj/structure/disposalholder"), live(f.src))))) {
		rt.setFv(f, "active", live(H), 0);
		_T = rt.fv(f, "loc", live(f.src));
		yield* g.srcCall(f, "expel", live(H), live(_T), 0);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/disposalpipe/proc/nextdir  (code/modules/recycling/disposal-structures.dm:194)
rt.def("/obj/structure/disposalpipe/proc/nextdir", function nextdir(f: Frame, fromdir: Value) {
	return rt.bitAnd(rt.sv(f, "dpdir"), rt.op(f, "BitNot", [], [rt.call(f, P("/proc/turn"), null, [live(fromdir), 180])]));
});

// /obj/structure/disposalpipe/proc/transfer  (code/modules/recycling/disposal-structures.dm:200)  may sleep
rt.def("/obj/structure/disposalpipe/proc/transfer", function* transfer(f: Frame, H: Value) {
	let nextdir: Value = null;
	f.vars = () => [H, nextdir];
	nextdir = (yield* g.srcCall(f, "nextdir", rt.fv(f, "dir", live(H))));
	return (yield* g.srcCall(f, "transfer_to_dir", live(H), live(nextdir)));
}, true);

// /obj/structure/disposalpipe/proc/transfer_to_dir  (code/modules/recycling/disposal-structures.dm:204)  may sleep
rt.def("/obj/structure/disposalpipe/proc/transfer_to_dir", function* transfer_to_dir(f: Frame, H: Value, nextdir: Value) {
	let _T: Value = null, _P: Value = null, H2: Value = null;
	f.vars = () => [H, nextdir, _T, _P, H2];
	yield* g.callName(f, live(H), "setDir", [live(nextdir)]);
	_T = (yield* g.callName(f, live(H), "nextloc", []));
	if (truthy((_P = (yield* g.callName(f, live(H), "findpipe", [live(_T)]))))) {
		if ((truthy((H2 = rt.locateIn(f, T("/obj/structure/disposalholder"), live(_P)))) && !truthy(rt.fv(f, "active", live(H2))))) {
			yield* g.callName(f, live(H), "merge", [live(H2)]);
		}
		rt.setFv(f, "loc", live(H), live(_P));
		return live(_P);
	} else {
		rt.setFv(f, "loc", live(H), rt.getStep(f, live(f.src), 0));
		return null;
	}
	return f.dot;
}, true);

// /obj/structure/disposalpipe/proc/update  (code/modules/recycling/disposal-structures.dm:223)
rt.def("/obj/structure/disposalpipe/proc/update", function update(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	rt.callSrc(f, "hide", [(rt.gv(f, "intact", (_T = rt.fv(f, "loc", live(f.src)))) && (!truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)) ? 1 : 0))]);
	return f.dot;
});

// /obj/structure/disposalpipe/proc/hide  (code/modules/recycling/disposal-structures.dm:228)
rt.def("/obj/structure/disposalpipe/proc/hide", function hide(f: Frame, intact: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(live(intact))) {
		$0 = 100;
	} else {
		$0 = 0;
	}
	rt.setSv(f, "invisibility", $0);
	rt.callSrc(f, "updateicon", []);
	return f.dot;
});

// /obj/structure/disposalpipe/proc/updateicon  (code/modules/recycling/disposal-structures.dm:237)
rt.def("/obj/structure/disposalpipe/proc/updateicon", function updateicon(f: Frame) {
	if (truthy(rt.sv(f, "invisibility"))) {
		rt.setSv(f, "icon_state", fmt("＀f", [rt.sv(f, "base_icon_state")]));
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "base_icon_state"));
	}
	return live(f.dot);
});

// /obj/structure/disposalpipe/proc/expel  (code/modules/recycling/disposal-structures.dm:253)  may sleep
rt.def("/obj/structure/disposalpipe/proc/expel", function* expel(f: Frame, H: Value, _T: Value, direction: Value) {
	let target: Value = null, eject_range: Value = null, floorturf: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [H, _T, direction, target, eject_range, floorturf, AM, $e];
	target = null;
	eject_range = 5;
	floorturf = null;
	if (truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "floor_tile", (floorturf = live(_T))))) {
			yield* g.new_(f, rt.fv(f, "floor_tile", live(floorturf)), [live(_T)]);
		}
		yield* g.callName(f, live(floorturf), "make_plating", []);
	}
	if (truthy(live(direction))) {
		if (truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) {
			target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(_T), live(direction)]));
		} else {
			target = (yield* g.call(f, P("/proc/get_ranged_target_turf"), null, [live(_T), live(direction), 10]));
		}
		eject_range = 10;
	} else {
		if (truthy(live(floorturf))) {
			target = (yield* g.call(f, P("/proc/get_offset_target_turf"), null, [live(_T), subtract((yield* g.call(f, P("/proc/rand"), null, [5])), (yield* g.call(f, P("/proc/rand"), null, [5]))), subtract((yield* g.call(f, P("/proc/rand"), null, [5])), (yield* g.call(f, P("/proc/rand"), null, [5])))]));
		}
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/hiss.ogg"), 50, 0, 0]);
	AM = null;
	rt.forList(f, 0, live(H), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.callName(f, live(AM), "forceMove", [rt.fv(f, "loc", live(f.src))]);
		yield* g.callName(f, live(AM), "pipe_eject", [live(direction)]);
		if (truthy(live(target))) {
			yield* g.callName(f, live(AM), "throw_at", [live(target), live(eject_range), 1]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(H), "vent_gas", [live(_T)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
	return f.dot;
}, true);

// /obj/structure/disposalpipe/proc/contents_explosion  (code/modules/recycling/disposal-structures.dm:282)
rt.def("/obj/structure/disposalpipe/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((H = rt.locateIn(f, T("/obj/structure/disposalholder"), live(f.src))))) return f.dot;
	rt.callName(f, live(H), "contents_explosion", [live(severity), live(target)]);
	return f.dot;
});

// /obj/structure/disposalpipe/proc/run_obj_armor  (code/modules/recycling/disposal-structures.dm:288)
rt.def("/obj/structure/disposalpipe/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((isEqual(live(f.args[2]), "melee") && rt.lt(live(f.args[0]), 10))) {
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// /obj/structure/disposalpipe/proc/attackby  (code/modules/recycling/disposal-structures.dm:297)  may sleep
rt.def("/obj/structure/disposalpipe/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, W: Value = null;
	f.vars = () => [_T, W];
	if (truthy(rt.gv(f, "intact", (_T = rt.fv(f, "loc", live(f.src)))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		W = live(f.args[0]);
		if (truthy((yield* g.srcCall(f, "can_be_deconstructed", live(f.args[1]))))) {
			if (truthy((yield* g.callName(f, live(W), "remove_fuel", [0, live(f.args[1])])))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder2.ogg"), 100, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start slicing the disposal pipe...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 30, "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(W), "isOn", []))))) {
						return live(f.dot);
					}
					yield* g.srcCall(f, "deconstruct");
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You slice the disposal pipe.</span>"]);
				}
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/disposalpipe/proc/deconstruct  (code/modules/recycling/disposal-structures.dm:320)  may sleep
rt.def("/obj/structure/disposalpipe/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null, D: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [disassembled, _T, D, _P, $e];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(live(disassembled))) {
			if (truthy(rt.sv(f, "stored"))) {
				_T = rt.sv(f, "loc");
				rt.setFv(f, "loc", rt.sv(f, "stored"), live(_T));
				yield* g.srcCall(f, "transfer_fingerprints_to", rt.sv(f, "stored"));
				yield* g.callName(f, rt.sv(f, "stored"), "setDir", [rt.sv(f, "dir")]);
				rt.setFv(f, "density", rt.sv(f, "stored"), 0);
				rt.setFv(f, "anchored", rt.sv(f, "stored"), 1);
				yield* g.callName(f, rt.sv(f, "stored"), "update_icon", []);
			}
		} else {
			D = null;
			rt.forList(f, 0, rt.gl("cardinal"));
			while (($e = rt.next(f, 0)) !== undefined) {
				D = $e;
				if (truthy(rt.bitAnd(live(D), rt.sv(f, "dpdir")))) {
					yield* g.callName(f, (_P = (yield* g.new_(f, T("/obj/structure/disposalpipe/broken"), [rt.fv(f, "loc", live(f.src))]))), "setDir", [live(D)]);
				}
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/disposalpipe/proc/singularity_pull  (code/modules/recycling/disposal-structures.dm:339)  may sleep
rt.def("/obj/structure/disposalpipe/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 9)) return f.dot;
	yield* g.srcCall(f, "deconstruct");
	return f.dot;
}, true);

// /obj/structure/disposalpipe/proc/shuttleRotate  (code/modules/recycling/disposal-structures.dm:344)  may sleep
rt.def("/obj/structure/disposalpipe/proc/shuttleRotate", function* shuttleRotate(f: Frame) {
	let new_dpdir: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [new_dpdir, D, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	new_dpdir = 0;
	D = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (truthy(rt.bitAnd(rt.sv(f, "dpdir"), live(D)))) {
			new_dpdir = rt.bitOr(live(new_dpdir), (yield* g.call(f, P("/proc/angle2dir"), null, [add(live(f.args[0]), (yield* g.call(f, P("/proc/dir2angle"), null, [live(D)])))])));
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "dpdir", live(new_dpdir));
	return f.dot;
}, true, { args: ["rotation"] });

rt.type(12518, "/obj/structure/disposalpipe/segment", "/obj/structure/disposalpipe", {
	icon_state: "pipe-s",
});

// /obj/structure/disposalpipe/segment/proc/Initialize  (code/modules/recycling/disposal-structures.dm:362)  may sleep
rt.def("/obj/structure/disposalpipe/segment/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (isEqual(rt.fv(f, "ptype", rt.sv(f, "stored")), 0)) {
		rt.setSv(f, "dpdir", rt.bitOr(rt.sv(f, "dir"), (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]))));
	} else {
		rt.setSv(f, "dpdir", rt.bitOr(rt.sv(f, "dir"), (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -90]))));
	}
	yield* g.srcCall(f, "update");
	return f.dot;
}, true);

rt.type(12519, "/obj/structure/disposalpipe/junction", "/obj/structure/disposalpipe", {
	icon_state: "pipe-j1",
});

// /obj/structure/disposalpipe/junction/proc/Initialize  (code/modules/recycling/disposal-structures.dm:378)  may sleep
rt.def("/obj/structure/disposalpipe/junction/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	$0 = rt.fv(f, "ptype", rt.sv(f, "stored"));
	if ($0 === 2) {
		rt.setSv(f, "dpdir", rt.bitOr(rt.bitOr(rt.sv(f, "dir"), (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -90]))), (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]))));
	} else if ($0 === 3) {
		rt.setSv(f, "dpdir", rt.bitOr(rt.bitOr(rt.sv(f, "dir"), (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 90]))), (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 180]))));
	} else if ($0 === 4) {
		rt.setSv(f, "dpdir", rt.bitOr(rt.bitOr(rt.sv(f, "dir"), (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 90]))), (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -90]))));
	}
	yield* g.srcCall(f, "update");
	return f.dot;
}, true);

// /obj/structure/disposalpipe/junction/proc/nextdir  (code/modules/recycling/disposal-structures.dm:394)
rt.def("/obj/structure/disposalpipe/junction/proc/nextdir", function nextdir(f: Frame, fromdir: Value) {
	let flipdir: Value = null, mask: Value = null, setbit: Value = null;
	f.vars = () => [flipdir, mask, setbit];
	if (!isEqual((flipdir = rt.call(f, P("/proc/turn"), null, [live(fromdir), 180])), rt.sv(f, "dir"))) {
		return rt.sv(f, "dir");
	} else {
		mask = rt.callSuper(f, [live(fromdir)]);
		setbit = 0;
		if (truthy(rt.bitAnd(live(mask), 1))) {
			setbit = 1;
		} else {
			if (truthy(rt.bitAnd(live(mask), 2))) {
				setbit = 2;
			} else {
				if (truthy(rt.bitAnd(live(mask), 4))) {
					setbit = 4;
				} else {
					setbit = 8;
				}
			}
		}
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			return live(setbit);
		} else {
			return rt.bitAnd(live(mask), rt.op(f, "BitNot", [], [live(setbit)]));
		}
	}
	return f.dot;
});

rt.type(12520, "/obj/structure/disposalpipe/sortjunction", "/obj/structure/disposalpipe", {
	sortType: 0,
	sortTypes: null,
	posdir: 0,
	negdir: 0,
	sortdir: 0,
	desc: "An underfloor disposal pipe with a package sorting mechanism.",
	icon_state: "pipe-j1s",
});

// /obj/structure/disposalpipe/sortjunction/proc/<init>  (code/modules/recycling/disposal-structures.dm:425)
rt.def("/obj/structure/disposalpipe/sortjunction/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "sortTypes", rt.list());
	return f.dot;
});

// /obj/structure/disposalpipe/sortjunction/proc/examine  (code/modules/recycling/disposal-structures.dm:431)
rt.def("/obj/structure/disposalpipe/sortjunction/proc/examine", function examine(f: Frame) {
	let t: Value = null;
	let $e: any;
	f.vars = () => [t, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.gt(rt.len(f, rt.sv(f, "sortTypes")), 0)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It is tagged with the following tags:"]);
		t = null;
		rt.forList(f, 0, rt.sv(f, "sortTypes"));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), rt.index(rt.gl("TAGGERLOCATIONS"), live(t))]);
		}
		rt.endFor(f, 0);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It has no sorting tags set."]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/disposalpipe/sortjunction/proc/updatedir  (code/modules/recycling/disposal-structures.dm:441)
rt.def("/obj/structure/disposalpipe/sortjunction/proc/updatedir", function updatedir(f: Frame) {
	rt.setSv(f, "posdir", rt.sv(f, "dir"));
	rt.setSv(f, "negdir", rt.call(f, P("/proc/turn"), null, [rt.sv(f, "posdir"), 180]));
	if (isEqual(rt.fv(f, "ptype", rt.sv(f, "stored")), 9)) {
		rt.setSv(f, "sortdir", rt.call(f, P("/proc/turn"), null, [rt.sv(f, "posdir"), -90]));
	} else {
		rt.setSv(f, "icon_state", "pipe-j2s");
		rt.setSv(f, "sortdir", rt.call(f, P("/proc/turn"), null, [rt.sv(f, "posdir"), 90]));
	}
	rt.setSv(f, "dpdir", rt.bitOr(rt.bitOr(rt.sv(f, "sortdir"), rt.sv(f, "posdir")), rt.sv(f, "negdir")));
	return f.dot;
});

// /obj/structure/disposalpipe/sortjunction/proc/Initialize  (code/modules/recycling/disposal-structures.dm:453)  may sleep
rt.def("/obj/structure/disposalpipe/sortjunction/proc/Initialize", function* Initialize(f: Frame) {
	let sorts: Value = null, x: Value = null, n: Value = null;
	let $e: any;
	f.vars = () => [sorts, x, n, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "sortType"))) {
		if (truthy((yield* g.call(f, P("/proc/isnum"), null, [rt.sv(f, "sortType")])))) {
			(rt.modSrcVar(f, "sortTypes", rt.sv(f, "sortType"), rt.bitOr));
		} else {
			if (truthy((yield* g.call(f, P("/proc/istext"), null, [rt.sv(f, "sortType")])))) {
				sorts = (yield* g.call(f, P("/proc/splittext"), null, [rt.sv(f, "sortType"), ";"]));
				x = null;
				rt.forList(f, 0, live(sorts));
				while (($e = rt.next(f, 0)) !== undefined) {
					x = $e;
					if (truthy((n = (yield* g.call(f, P("/proc/text2num"), null, [live(x)]))))) {
						(rt.modSrcVar(f, "sortTypes", live(n), rt.bitOr));
					}
				}
				rt.endFor(f, 0);
			}
		}
	}
	yield* g.srcCall(f, "updatedir");
	yield* g.srcCall(f, "update");
	return f.dot;
}, true);

// /obj/structure/disposalpipe/sortjunction/proc/attackby  (code/modules/recycling/disposal-structures.dm:470)  may sleep
rt.def("/obj/structure/disposalpipe/sortjunction/proc/attackby", function* attackby(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/destTagger")) ? 1 : 0))) {
		if (rt.gt(rt.gv(f, "currTag", (O = live(f.args[0]))), 0)) {
			if (truthy((rt.isIn(f, rt.fv(f, "currTag", live(O)), rt.sv(f, "sortTypes")) ? 1 : 0))) {
				(rt.modSrcVar(f, "sortTypes", rt.fv(f, "currTag", live(O)), subtract));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>Removed \"＀\" filter.</span>", [rt.index(rt.gl("TAGGERLOCATIONS"), rt.fv(f, "currTag", live(O)))])]);
			} else {
				(rt.modSrcVar(f, "sortTypes", rt.fv(f, "currTag", live(O)), rt.bitOr));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>Added \"＀\" filter.</span>", [rt.index(rt.gl("TAGGERLOCATIONS"), rt.fv(f, "currTag", live(O)))])]);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/twobeep.ogg"), 100, 1]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/disposalpipe/sortjunction/proc/nextdir  (code/modules/recycling/disposal-structures.dm:492)
rt.def("/obj/structure/disposalpipe/sortjunction/proc/nextdir", function nextdir(f: Frame, fromdir: Value, sortTag: Value) {
	if (!isEqual(live(fromdir), rt.sv(f, "sortdir"))) {
		if (truthy((rt.isIn(f, live(sortTag), rt.sv(f, "sortTypes")) ? 1 : 0))) {
			return rt.sv(f, "sortdir");
		} else {
			return rt.sv(f, "posdir");
		}
	} else {
		return rt.sv(f, "posdir");
	}
	return f.dot;
});

// /obj/structure/disposalpipe/sortjunction/proc/transfer  (code/modules/recycling/disposal-structures.dm:503)  may sleep
rt.def("/obj/structure/disposalpipe/sortjunction/proc/transfer", function* transfer(f: Frame, H: Value) {
	let nextdir: Value = null;
	f.vars = () => [H, nextdir];
	nextdir = (yield* g.srcCall(f, "nextdir", rt.fv(f, "dir", live(H)), rt.fv(f, "destinationTag", live(H))));
	return (yield* g.srcCall(f, "transfer_to_dir", live(H), live(nextdir)));
}, true);

rt.type(12521, "/obj/structure/disposalpipe/wrapsortjunction", "/obj/structure/disposalpipe", {
	posdir: 0,
	negdir: 0,
	sortdir: 0,
	desc: "An underfloor disposal pipe which sorts wrapped and unwrapped objects.",
	icon_state: "pipe-j1s",
});

// /obj/structure/disposalpipe/wrapsortjunction/proc/Initialize  (code/modules/recycling/disposal-structures.dm:516)  may sleep
rt.def("/obj/structure/disposalpipe/wrapsortjunction/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "posdir", rt.sv(f, "dir"));
	if (isEqual(rt.fv(f, "ptype", rt.sv(f, "stored")), 9)) {
		rt.setSv(f, "sortdir", (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "posdir"), -90])));
		rt.setSv(f, "negdir", (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "posdir"), 180])));
	} else {
		rt.setSv(f, "icon_state", "pipe-j2s");
		rt.setSv(f, "sortdir", (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "posdir"), 90])));
		rt.setSv(f, "negdir", (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "posdir"), 180])));
	}
	rt.setSv(f, "dpdir", rt.bitOr(rt.bitOr(rt.sv(f, "sortdir"), rt.sv(f, "posdir")), rt.sv(f, "negdir")));
	yield* g.srcCall(f, "update");
	return f.dot;
}, true);

// /obj/structure/disposalpipe/wrapsortjunction/proc/nextdir  (code/modules/recycling/disposal-structures.dm:536)
rt.def("/obj/structure/disposalpipe/wrapsortjunction/proc/nextdir", function nextdir(f: Frame, fromdir: Value, istomail: Value) {
	if (!isEqual(live(fromdir), rt.sv(f, "sortdir"))) {
		if (truthy(live(istomail))) {
			return rt.sv(f, "sortdir");
		} else {
			return rt.sv(f, "posdir");
		}
	} else {
		return rt.sv(f, "posdir");
	}
	return f.dot;
});

// /obj/structure/disposalpipe/wrapsortjunction/proc/transfer  (code/modules/recycling/disposal-structures.dm:547)  may sleep
rt.def("/obj/structure/disposalpipe/wrapsortjunction/proc/transfer", function* transfer(f: Frame, H: Value) {
	let nextdir: Value = null;
	f.vars = () => [H, nextdir];
	nextdir = (yield* g.srcCall(f, "nextdir", rt.fv(f, "dir", live(H)), rt.fv(f, "tomail", live(H))));
	return (yield* g.srcCall(f, "transfer_to_dir", live(H), live(nextdir)));
}, true);

rt.type(12522, "/obj/structure/disposalpipe/trunk", "/obj/structure/disposalpipe", {
	linked: null,
	icon_state: "pipe-t",
});

// /obj/structure/disposalpipe/trunk/proc/Initialize  (code/modules/recycling/disposal-structures.dm:556)  may sleep
rt.def("/obj/structure/disposalpipe/trunk/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "dpdir", rt.sv(f, "dir"));
	rt.spawnTail(f, 1, "/obj/structure/disposalpipe/trunk/proc/Initialize: spawn at modules/recycling/disposal-structures.dm:558");
	yield* g.srcCall(f, "update");
	return f.dot;
}, true);

// a spawn(1) body of /obj/structure/disposalpipe/trunk/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/disposalpipe/trunk/proc/Initialize: spawn at modules/recycling/disposal-structures.dm:558", function* (f: Frame) {
	yield* g.srcCall(f, "getlinked");
	return null;
});

// /obj/structure/disposalpipe/trunk/proc/Destroy  (code/modules/recycling/disposal-structures.dm:565)  may sleep
rt.def("/obj/structure/disposalpipe/trunk/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	f.vars = () => [D];
	if (truthy(rt.sv(f, "linked"))) {
		if (truthy((rt.istype(rt.sv(f, "linked"), T("/obj/structure/disposaloutlet")) ? 1 : 0))) {
			rt.setFv(f, "trunk", (D = rt.sv(f, "linked")), null);
		} else {
			if (truthy((rt.istype(rt.sv(f, "linked"), T("/obj/machinery/disposal")) ? 1 : 0))) {
				rt.setFv(f, "trunk", (D = rt.sv(f, "linked")), null);
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/disposalpipe/trunk/proc/getlinked  (code/modules/recycling/disposal-structures.dm:575)
rt.def("/obj/structure/disposalpipe/trunk/proc/getlinked", function getlinked(f: Frame) {
	let D: Value = null, O: Value = null;
	f.vars = () => [D, O];
	rt.setSv(f, "linked", null);
	if (truthy((D = rt.locateIn(f, T("/obj/machinery/disposal"), rt.fv(f, "loc", live(f.src)))))) {
		rt.setSv(f, "linked", live(D));
		if (!truthy(rt.fv(f, "trunk", live(D)))) {
			rt.setFv(f, "trunk", live(D), live(f.src));
		}
	}
	if (truthy((O = rt.locateIn(f, T("/obj/structure/disposaloutlet"), rt.fv(f, "loc", live(f.src)))))) {
		rt.setSv(f, "linked", live(O));
	}
	rt.callSrc(f, "update", []);
	return live(f.dot);
});

// /obj/structure/disposalpipe/trunk/proc/can_be_deconstructed  (code/modules/recycling/disposal-structures.dm:590)
rt.def("/obj/structure/disposalpipe/trunk/proc/can_be_deconstructed", function can_be_deconstructed(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "linked"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to deconstruct disposal machinery above this pipe!</span>"]);
	} else {
		f.dot = 1;
	}
	return f.dot;
});

// /obj/structure/disposalpipe/trunk/proc/transfer  (code/modules/recycling/disposal-structures.dm:599)  may sleep
rt.def("/obj/structure/disposalpipe/trunk/proc/transfer", function* transfer(f: Frame) {
	let O: Value = null, D: Value = null;
	f.vars = () => [O, D];
	if (isEqual(rt.fv(f, "dir", live(f.args[0])), 32)) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.sv(f, "linked"))) {
		if ((truthy((rt.istype((O = rt.sv(f, "linked")), T("/obj/structure/disposaloutlet")) ? 1 : 0)) && truthy(live(f.args[0])))) {
			yield* g.callName(f, live(O), "expel", [live(f.args[0])]);
		} else {
			D = rt.sv(f, "linked");
			if (truthy(live(f.args[0]))) {
				yield* g.callName(f, live(D), "expel", [live(f.args[0])]);
			}
		}
	} else {
		if (truthy(live(f.args[0]))) {
			yield* g.callName(f, live(f.src), "expel", [live(f.args[0]), rt.getStep(f, live(f.src), 0), 0]);
		}
	}
	return null;
}, true, { args: ["H"] });

// /obj/structure/disposalpipe/trunk/proc/nextdir  (code/modules/recycling/disposal-structures.dm:616)
rt.def("/obj/structure/disposalpipe/trunk/proc/nextdir", function nextdir(f: Frame, fromdir: Value) {
	if (isEqual(live(fromdir), 32)) {
		return rt.sv(f, "dir");
	} else {
		return 0;
	}
	return f.dot;
});

rt.type(12523, "/obj/structure/disposalpipe/broken", "/obj/structure/disposalpipe", {
	dpdir: 0,
	icon_state: "pipe-b",
	desc: "A broken piece of disposal pipe.",
});

// /obj/structure/disposalpipe/broken/proc/Initialize  (code/modules/recycling/disposal-structures.dm:629)  may sleep
rt.def("/obj/structure/disposalpipe/broken/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update");
	return f.dot;
}, true);

// /obj/structure/disposalpipe/broken/proc/deconstruct  (code/modules/recycling/disposal-structures.dm:635)  may sleep
rt.def("/obj/structure/disposalpipe/broken/proc/deconstruct", function* deconstruct(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12988, "/obj/structure/disposaloutlet", "/obj/structure", {
	active: 0,
	target: null,
	trunk: null,
	stored: null,
	mode: 0,
	start_eject: 0,
	eject_range: 2,
	anchored: 1,
	name: "disposal outlet",
	desc: "An outlet for the pneumatic disposal system.",
	icon: rt.rsc("icons/obj/atmospherics/pipes/disposal.dmi"),
	icon_state: "outlet",
	density: 1,
});

// /obj/structure/disposaloutlet/proc/Initialize  (code/modules/recycling/disposal-structures.dm:653)  may sleep
rt.def("/obj/structure/disposaloutlet/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.args[1]))) {
		yield* g.srcCall(f, "setDir", rt.fv(f, "dir", live(f.args[1])));
		rt.setFv(f, "loc", live(f.args[1]), live(f.src));
		rt.setSv(f, "stored", live(f.args[1]));
	} else {
		rt.setSv(f, "stored", (yield* g.new_(f, T("/obj/structure/disposalconstruct"), [live(f.src), 7, rt.sv(f, "dir")])));
	}
	rt.spawnTail(f, 1, "/obj/structure/disposaloutlet/proc/Initialize: spawn at modules/recycling/disposal-structures.dm:661");
	return f.dot;
}, true, { args: ["mapload", "make_from"] });

// a spawn(1) body of /obj/structure/disposaloutlet/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/disposaloutlet/proc/Initialize: spawn at modules/recycling/disposal-structures.dm:661", function* (f: Frame) {
	rt.setSv(f, "target", (yield* g.call(f, P("/proc/get_ranged_target_turf"), null, [live(f.src), rt.sv(f, "dir"), 10])));
	rt.setSv(f, "trunk", rt.locateIn(f, T("/obj/structure/disposalpipe/trunk"), rt.fv(f, "loc", live(f.src))));
	if (truthy(rt.sv(f, "trunk"))) {
		rt.setFv(f, "linked", rt.sv(f, "trunk"), live(f.src));
	}
	return null;
});

// /obj/structure/disposaloutlet/proc/Destroy  (code/modules/recycling/disposal-structures.dm:670)  may sleep
rt.def("/obj/structure/disposaloutlet/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "trunk"))) {
		rt.setFv(f, "linked", rt.sv(f, "trunk"), null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/disposaloutlet/proc/expel  (code/modules/recycling/disposal-structures.dm:676)  may sleep
rt.def("/obj/structure/disposaloutlet/proc/expel", function* expel(f: Frame, H: Value) {
	let _T: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [H, _T, AM, $e];
	_T = rt.getStep(f, live(f.src), 0);
	yield* g.call(f, P("/proc/flick"), null, ["outlet-open", live(f.src)]);
	if (rt.lt(add(rt.sv(f, "start_eject"), 30), rt.worldTime(f))) {
		rt.setSv(f, "start_eject", rt.worldTime(f));
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/warning-buzzer.ogg"), 50, 0, 0]);
		yield* g.call(f, P("/proc/sleep"), null, [20]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/hiss.ogg"), 50, 0, 0]);
	} else {
		yield* g.call(f, P("/proc/sleep"), null, [20]);
	}
	if (truthy(live(H))) {
		AM = null;
		rt.forList(f, 0, live(H), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			AM = $e;
			yield* g.callName(f, live(AM), "forceMove", [live(_T)]);
			yield* g.callName(f, live(AM), "pipe_eject", [rt.sv(f, "dir")]);
			yield* g.callName(f, live(AM), "throw_at", [rt.sv(f, "target"), rt.sv(f, "eject_range"), 1]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(H), "vent_gas", [live(_T)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
	}
	return live(f.dot);
}, true);

// /obj/structure/disposaloutlet/proc/attackby  (code/modules/recycling/disposal-structures.dm:696)  may sleep
rt.def("/obj/structure/disposaloutlet/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "mode"), 0)) {
			rt.setSv(f, "mode", 1);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the screws around the power connection.</span>"]);
		} else {
			if (isEqual(rt.sv(f, "mode"), 1)) {
				rt.setSv(f, "mode", 0);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You attach the screws around the power connection.</span>"]);
			}
		}
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && isEqual(rt.sv(f, "mode"), 1))) {
			if (truthy((yield* g.callName(f, (W = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder2.ogg"), 100, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start slicing the floorweld off ％！...</span>", [live(f.src)])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(W), "isOn", []))))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You slice the floorweld off ％！.</span>", [live(f.src)])]);
					rt.setFv(f, "loc", rt.sv(f, "stored"), rt.sv(f, "loc"));
					yield* g.callName(f, live(f.src), "transfer_fingerprints_to", [rt.sv(f, "stored")]);
					yield* g.callName(f, rt.sv(f, "stored"), "update_icon", []);
					rt.setFv(f, "anchored", rt.sv(f, "stored"), 0);
					rt.setFv(f, "density", rt.sv(f, "stored"), 1);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				}
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/effect/decal/cleanable/blood/gibs/proc/pipe_eject  (code/modules/recycling/disposal-structures.dm:735)
rt.def("/obj/effect/decal/cleanable/blood/gibs/proc/pipe_eject", function pipe_eject(f: Frame, direction: Value) {
	let dirs: Value = null;
	f.vars = () => [dirs];
	dirs = null;
	if (truthy(live(direction))) {
		dirs = rt.list(live(direction), rt.call(f, P("/proc/turn"), null, [live(direction), -45]), rt.call(f, P("/proc/turn"), null, [live(direction), 45]));
	} else {
		dirs = rt.callName(f, rt.gl("alldirs"), "Copy", []);
	}
	rt.callName(f, live(f.src), "streak", [live(dirs)]);
	return f.dot;
});

rt.type(11704, "/obj/effect/decal/cleanable/robot_debris/gib", "/obj/effect/decal/cleanable/robot_debris", {});

// /obj/effect/decal/cleanable/robot_debris/gib/proc/pipe_eject  (code/modules/recycling/disposal-structures.dm:744)
rt.def("/obj/effect/decal/cleanable/robot_debris/gib/proc/pipe_eject", function pipe_eject(f: Frame, direction: Value) {
	let dirs: Value = null;
	f.vars = () => [dirs];
	dirs = null;
	if (truthy(live(direction))) {
		dirs = rt.list(live(direction), rt.call(f, P("/proc/turn"), null, [live(direction), -45]), rt.call(f, P("/proc/turn"), null, [live(direction), 45]));
	} else {
		dirs = rt.callName(f, rt.gl("alldirs"), "Copy", []);
	}
	rt.callName(f, live(f.src), "streak", [live(dirs)]);
	return f.dot;
});
