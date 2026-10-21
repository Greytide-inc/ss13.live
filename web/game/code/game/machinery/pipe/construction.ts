// From code/game/machinery/pipe/construction.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9554, "/obj/item/pipe", "/obj/item", {
	pipe_type: 0,
	pipename: null,
	flipped: 0,
	is_bent: 0,
	level: 2,
	name: "pipe",
	desc: "A pipe",
	force: 7,
	throwforce: 7,
	icon: rt.rsc("icons/obj/atmospherics/pipes/pipe_item.dmi"),
	icon_state: "simple",
	item_state: "buildpipe",
	w_class: 3,
}, { global: { pipe_types: 1052 } });

// /obj/item/pipe/proc/examine  (code/game/machinery/pipe/construction.dm:51)
rt.def("/obj/item/pipe/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Alt-click to rotate it clockwise.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/pipe/proc/New  (code/game/machinery/pipe/construction.dm:55)  may sleep
rt.def("/obj/item/pipe/proc/New", function* New(f: Frame) {
	let _P: Value = null, triP: Value = null;
	let $e: any;
	f.vars = () => [_P, triP, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[3]))) {
		yield* g.callName(f, live(f.src), "setDir", [rt.fv(f, "dir", live(f.args[3]))]);
		rt.setFv(f, "pipename", live(f.src), rt.fv(f, "name", live(f.args[3])));
		yield* g.srcCall(f, "add_atom_colour", rt.fv(f, "color", live(f.args[3])), 4);
		if (truthy((rt.isIn(f, rt.fv(f, "type", live(f.args[3])), rt.gl("pipe_types")) ? 1 : 0))) {
			rt.setFv(f, "pipe_type", live(f.src), rt.fv(f, "type", live(f.args[3])));
		} else {
			_P = null;
			rt.forList(f, 0, rt.gl("pipe_types"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_P = $e;
				if (truthy(rt.op(f, "IsType", [], [live(f.args[3]), live(_P)]))) {
					rt.setFv(f, "pipe_type", live(f.src), live(_P));
					break;
				}
			}
			rt.endFor(f, 0);
		}
		if ((truthy((rt.istype((triP = live(f.args[3])), T("/obj/machinery/atmospherics/components/trinary")) ? 1 : 0)) && truthy(rt.fv(f, "flipped", live(triP))))) {
			rt.setFv(f, "flipped", live(f.src), 1);
			yield* g.callName(f, live(f.src), "setDir", [(yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(f.src)), -45]))]);
		}
	} else {
		rt.setFv(f, "pipe_type", live(f.src), live(f.args[1]));
		yield* g.callName(f, live(f.src), "setDir", [live(f.args[2])]);
	}
	if (truthy((rt.isIn(f, rt.fv(f, "dir", live(f.src)), rt.gl("diagonals")) ? 1 : 0))) {
		rt.setSv(f, "is_bent", 1);
	}
	yield* g.srcCall(f, "update");
	rt.setFv(f, "pixel_x", live(f.src), (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setFv(f, "pixel_y", live(f.src), (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	return f.dot;
}, true, { args: ["loc", "pipe_type", "dir", "make_from"] });

// /datum/controller/global_vars/proc/InitGlobalpipeID2State  (code/game/machinery/pipe/construction.dm:85)
rt.def("/datum/controller/global_vars/proc/InitGlobalpipeID2State", function InitGlobalpipeID2State(f: Frame) {
	rt.setGl("pipeID2State", rt.alist(f, [fmt("＀", [T("/obj/machinery/atmospherics/pipe/simple")]), "simple", fmt("＀", [T("/obj/machinery/atmospherics/pipe/manifold")]), "manifold", fmt("＀", [T("/obj/machinery/atmospherics/pipe/manifold4w")]), "manifold4w", fmt("＀", [T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple")]), "he", fmt("＀", [T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold")]), "he_manifold", fmt("＀", [T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w")]), "he_manifold4w", fmt("＀", [T("/obj/machinery/atmospherics/pipe/heat_exchanging/junction")]), "junction", fmt("＀", [T("/obj/machinery/atmospherics/components/unary/portables_connector")]), "connector", fmt("＀", [T("/obj/machinery/atmospherics/components/unary/vent_pump")]), "uvent", fmt("＀", [T("/obj/machinery/atmospherics/components/unary/vent_scrubber")]), "scrubber", fmt("＀", [T("/obj/machinery/atmospherics/components/unary/outlet_injector")]), "injector", fmt("＀", [T("/obj/machinery/atmospherics/components/unary/heat_exchanger")]), "heunary", fmt("＀", [T("/obj/machinery/atmospherics/components/binary/pump")]), "pump", fmt("＀", [T("/obj/machinery/atmospherics/components/binary/passive_gate")]), "passivegate", fmt("＀", [T("/obj/machinery/atmospherics/components/binary/volume_pump")]), "volumepump", fmt("＀", [T("/obj/machinery/atmospherics/components/binary/valve")]), "mvalve", fmt("＀", [T("/obj/machinery/atmospherics/components/binary/valve/digital")]), "dvalve", fmt("＀", [T("/obj/machinery/atmospherics/components/trinary/filter")]), "filter", fmt("＀", [T("/obj/machinery/atmospherics/components/trinary/mixer")]), "mixer"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "pipeID2State", add);
	return f.dot;
});

// /obj/item/pipe/proc/update  (code/game/machinery/pipe/construction.dm:111)
rt.def("/obj/item/pipe/proc/update", function update(f: Frame) {
	let nlist: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [nlist, $0, $1, $2];
	$0 = (nlist = rt.alist(f, [fmt("＀", [T("/obj/machinery/atmospherics/pipe/simple")]), "pipe", fmt("＀_b", [T("/obj/machinery/atmospherics/pipe/simple")]), "bent pipe", fmt("＀", [T("/obj/machinery/atmospherics/pipe/manifold")]), "manifold", fmt("＀", [T("/obj/machinery/atmospherics/pipe/manifold4w")]), "4-way manifold", fmt("＀", [T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple")]), "h/e pipe", fmt("＀_b", [T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple")]), "bent h/e pipe", fmt("＀", [T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold")]), "h/e manifold", fmt("＀", [T("/obj/machinery/atmospherics/pipe/heat_exchanging/manifold4w")]), "h/e 4-way manifold", fmt("＀", [T("/obj/machinery/atmospherics/pipe/heat_exchanging/junction")]), "junction", fmt("＀", [T("/obj/machinery/atmospherics/components/unary/portables_connector")]), "connector", fmt("＀", [T("/obj/machinery/atmospherics/components/unary/vent_pump")]), "vent", fmt("＀", [T("/obj/machinery/atmospherics/components/unary/vent_scrubber")]), "scrubber", fmt("＀", [T("/obj/machinery/atmospherics/components/unary/outlet_injector")]), "injector", fmt("＀", [T("/obj/machinery/atmospherics/components/unary/heat_exchanger")]), "heat exchanger", fmt("＀", [T("/obj/machinery/atmospherics/components/binary/pump")]), "pump", fmt("＀", [T("/obj/machinery/atmospherics/components/binary/passive_gate")]), "passive gate", fmt("＀", [T("/obj/machinery/atmospherics/components/binary/volume_pump")]), "volume pump", fmt("＀", [T("/obj/machinery/atmospherics/components/binary/valve")]), "manual valve", fmt("＀", [T("/obj/machinery/atmospherics/components/binary/valve/digital")]), "digital valve", fmt("＀", [T("/obj/machinery/atmospherics/components/trinary/filter")]), "gas filter", fmt("＀", [T("/obj/machinery/atmospherics/components/trinary/mixer")]), "gas mixer"]));
	$1 = rt.sv(f, "pipe_type");
	if (truthy(rt.sv(f, "is_bent"))) {
		$2 = "_b";
	} else {
		$2 = "";
	}
	rt.setSv(f, "name", add(rt.index($0, fmt("＀＀", [$1, $2])), " fitting"));
	rt.setSv(f, "icon_state", rt.index(rt.gl("pipeID2State"), fmt("＀", [rt.sv(f, "pipe_type")])));
	return f.dot;
});

// /obj/item/pipe/verb/rotate  (code/game/machinery/pipe/construction.dm:148)
rt.def("/obj/item/pipe/verb/rotate", function rotate(f: Frame) {
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || truthy(rt.callName(f, live(f.usr), "restrained", []))) || !truthy(rt.fv(f, "canmove", live(f.usr))))) {
		return live(f.dot);
	}
	rt.callName(f, live(f.src), "setDir", [rt.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(f.src)), -90])]);
	rt.callSrc(f, "fixdir", []);
	return live(f.dot);
}, false, { verb: { name: "Rotate Pipe", category: "Object", src: 1, range: 1 } });

// /obj/item/pipe/verb/flip  (code/game/machinery/pipe/construction.dm:162)
rt.def("/obj/item/pipe/verb/flip", function flip(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || truthy(rt.callName(f, live(f.usr), "restrained", []))) || !truthy(rt.fv(f, "canmove", live(f.usr))))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, rt.sv(f, "pipe_type"), rt.list(T("/obj/machinery/atmospherics/components/trinary/filter"), T("/obj/machinery/atmospherics/components/trinary/mixer"))) ? 1 : 0))) {
		$0 = live(f.src);
		if (truthy(rt.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(f.src)), rt.sv(f, "flipped")]))) {
			$1 = 45;
		} else {
			$1 = -45;
		}
		rt.callName(f, $0, "setDir", [$1]);
		rt.setSv(f, "flipped", (!truthy(rt.sv(f, "flipped")) ? 1 : 0));
		return live(f.dot);
	}
	rt.callName(f, live(f.src), "setDir", [rt.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(f.src)), -180])]);
	rt.callSrc(f, "fixdir", []);
	return live(f.dot);
}, false, { verb: { name: "Flip Pipe", category: "Object", src: 1, range: 1 } });

// /obj/item/pipe/proc/AltClick  (code/game/machinery/pipe/construction.dm:177)  may sleep
rt.def("/obj/item/pipe/proc/AltClick", function* AltClick(f: Frame) {
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

// /obj/item/pipe/proc/Move  (code/game/machinery/pipe/construction.dm:187)  may sleep
rt.def("/obj/item/pipe/proc/Move", function* Move(f: Frame) {
	let old_dir: Value = null;
	f.vars = () => [old_dir];
	old_dir = rt.sv(f, "dir");
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "setDir", live(old_dir));
	return f.dot;
}, true);

// /obj/item/pipe/proc/unflip  (code/game/machinery/pipe/construction.dm:192)
rt.def("/obj/item/pipe/proc/unflip", function unflip(f: Frame, direction: Value) {
	if (truthy((rt.isIn(f, live(direction), rt.gl("diagonals")) ? 1 : 0))) {
		return rt.call(f, P("/proc/turn"), null, [live(direction), 45]);
	}
	return live(direction);
});

// /obj/item/pipe/proc/fixdir  (code/game/machinery/pipe/construction.dm:199)
rt.def("/obj/item/pipe/proc/fixdir", function fixdir(f: Frame) {
	if (!(truthy((rt.isIn(f, rt.sv(f, "pipe_type"), rt.list(T("/obj/machinery/atmospherics/pipe/simple"), T("/obj/machinery/atmospherics/pipe/heat_exchanging/simple"), T("/obj/machinery/atmospherics/components/binary/valve"), T("/obj/machinery/atmospherics/components/binary/valve/digital"))) ? 1 : 0)) && !truthy(rt.sv(f, "is_bent")))) return f.dot;
	if (isEqual(rt.sv(f, "dir"), 2)) {
		rt.callSrc(f, "setDir", [1]);
	} else {
		if (!isEqual(rt.sv(f, "dir"), 8)) return f.dot;
		rt.callSrc(f, "setDir", [4]);
	}
	return f.dot;
});

// /obj/item/pipe/proc/attack_self  (code/game/machinery/pipe/construction.dm:206)
rt.def("/obj/item/pipe/proc/attack_self", function attack_self(f: Frame, user: Value) {
	return rt.callSrc(f, "rotate", []);
});

// /obj/item/pipe/proc/attackby  (code/game/machinery/pipe/construction.dm:209)  may sleep
rt.def("/obj/item/pipe/proc/attackby", function* attackby(f: Frame) {
	let A: Value = null, M: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [A, M, _T, $e];
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))])))) {
		return 1;
	}
	yield* g.srcCall(f, "fixdir");
	if (truthy((rt.isIn(f, rt.sv(f, "pipe_type"), rt.list(T("/obj/machinery/atmospherics/components/trinary/mixer"), T("/obj/machinery/atmospherics/components/trinary/filter"))) ? 1 : 0))) {
		yield* g.srcCall(f, "setDir", (yield* g.srcCall(f, "unflip", rt.sv(f, "dir"))));
	}
	yield* g.callName(f, (A = (yield* g.new_(f, rt.sv(f, "pipe_type"), [rt.fv(f, "loc", live(f.src))]))), "setDir", [rt.fv(f, "dir", live(f.src))]);
	yield* g.callName(f, live(A), "SetInitDirections", []);
	M = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/obj/machinery/atmospherics"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(live(M), live(A))) {
			continue;
		}
		if (truthy(rt.bitAnd((yield* g.callName(f, live(M), "GetInitDirections", [])), (yield* g.callName(f, live(A), "GetInitDirections", []))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a pipe at that location!</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(A)]);
			return 1;
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "pipename"))) {
		rt.setFv(f, "name", live(A), rt.sv(f, "pipename"));
	}
	if (truthy((rt.istype((_T = live(A)), T("/obj/machinery/atmospherics/components/trinary")) ? 1 : 0))) {
		rt.setFv(f, "flipped", live(_T), rt.sv(f, "flipped"));
	}
	yield* g.callName(f, live(A), "on_construction", [rt.sv(f, "pipe_type"), rt.sv(f, "color")]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ fastens ％！.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You fasten ％！.</span>", [live(f.src)]), "<span class='italics'>You hear ratchet.</span>"]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/pipe/proc/suicide_act  (code/game/machinery/pipe/construction.dm:248)  may sleep
rt.def("/obj/item/pipe/proc/suicide_act", function* suicide_act(f: Frame) {
	let C: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [C, i, $e];
	if (truthy((rt.isIn(f, rt.sv(f, "pipe_type"), rt.list(T("/obj/machinery/atmospherics/components/binary/pump"), T("/obj/machinery/atmospherics/components/binary/passive_gate"), T("/obj/machinery/atmospherics/components/binary/volume_pump"))) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='suicide'>＀ shoves the ＀ in ＀ mouth and turns it on!  It looks like ＀ trying to commit suicide!</span>", [live(f.args[0]), live(f.src), (yield* g.callName(f, live(f.args[0]), "p_their", [])), (yield* g.callName(f, live(f.args[0]), "p_theyre", []))])]);
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
			C = live(f.args[0]);
			i = null;
			rt.forRange(f, 0, 1, 20, 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				yield* g.callName(f, live(C), "vomit", [0, 1, 0, 4, 0]);
				if (truthy(rt.op(f, "Prob", [], [20]))) {
					yield* g.callName(f, live(C), "spew_organ", []);
				}
				yield* g.call(f, P("/proc/sleep"), null, [5]);
			}
			rt.endFor(f, 0);
			rt.setFv(f, "blood_volume", live(C), 0);
		}
		return 9;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

rt.type(9555, "/obj/item/pipe_meter", "/obj/item", {
	name: "meter",
	desc: "A meter that can be laid on pipes",
	icon: rt.rsc("icons/obj/atmospherics/pipes/pipe_item.dmi"),
	icon_state: "meter",
	item_state: "buildpipe",
	w_class: 4,
});

// /obj/item/pipe_meter/proc/attackby  (code/game/machinery/pipe/construction.dm:271)  may sleep
rt.def("/obj/item/pipe_meter/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy(rt.locateIn(f, T("/obj/machinery/atmospherics/pipe"), rt.fv(f, "loc", live(f.src))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to fasten it to a pipe!</span>"]);
		return 1;
	}
	yield* g.new_(f, T("/obj/machinery/meter"), [rt.fv(f, "loc", live(f.src))]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You fasten the meter to the pipe.</span>"]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["W", "user", "params"] });
