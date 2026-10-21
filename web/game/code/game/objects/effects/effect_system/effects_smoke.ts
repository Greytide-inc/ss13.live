// From code/game/objects/effects/effect_system/effects_smoke.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11925, "/obj/effect/particle_effect/smoke", "/obj/effect/particle_effect", {
	amount: 4,
	lifetime: 5,
	opaque: 1,
	anchored: 1,
	name: "smoke",
	icon: rt.rsc("icons/effects/96x96.dmi"),
	icon_state: "smoke",
	pixel_x: -32,
	pixel_y: -32,
	opacity: 0,
	layer: 5,
	mouse_opacity: 0,
	animate_movement: 0,
});

// /obj/effect/particle_effect/smoke/proc/fade_out  (code/game/objects/effects/effect_system/effects_smoke.dm:22)  may sleep
rt.def("/obj/effect/particle_effect/smoke/proc/fade_out", function* fade_out(f: Frame, frames: Value) {
	let step: Value = null, i: Value = null;
	f.vars = () => [frames, step, i];
	if (live(frames) === null) {
		frames = 16;
	}
	if (isEqual(rt.sv(f, "alpha"), 0)) {
		return live(f.dot);
	}
	if (isEqual(live(frames), 0)) {
		frames = 1;
	}
	step = divide(rt.sv(f, "alpha"), live(frames));
	i = null;
	i = 0;
	while (rt.lt(live(i), live(frames))) {
		(rt.modSrcVar(f, "alpha", live(step), subtract));
		if (rt.lt(rt.sv(f, "alpha"), 160)) {
			yield* g.srcCall(f, "set_opacity", 0);
		}
		yield* g.call(f, P("/proc/stoplag"), null, []);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

// /obj/effect/particle_effect/smoke/proc/New  (code/game/objects/effects/effect_system/effects_smoke.dm:34)  may sleep
rt.def("/obj/effect/particle_effect/smoke/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", 500);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/effect/particle_effect/smoke/proc/Destroy  (code/game/objects/effects/effect_system/effects_smoke.dm:40)  may sleep
rt.def("/obj/effect/particle_effect/smoke/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/particle_effect/smoke/proc/kill_smoke  (code/game/objects/effects/effect_system/effects_smoke.dm:44)  may sleep
rt.def("/obj/effect/particle_effect/smoke/proc/kill_smoke", function* kill_smoke(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/particle_effect/smoke/proc/fade_out")]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 10, 8]);
	return f.dot;
}, true);

// /obj/effect/particle_effect/smoke/proc/process  (code/game/objects/effects/effect_system/effects_smoke.dm:49)  may sleep
rt.def("/obj/effect/particle_effect/smoke/proc/process", function* process(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	rt.incSrcVar(f, "lifetime", -1, true);
	if (rt.lt(rt.sv(f, "lifetime"), 1)) {
		yield* g.srcCall(f, "kill_smoke");
		return 0;
	}
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [0, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.srcCall(f, "smoke_mob", live(L));
	}
	rt.endFor(f, 0);
	return 1;
}, true, { waitfor: false });

// /obj/effect/particle_effect/smoke/proc/smoke_mob  (code/game/objects/effects/effect_system/effects_smoke.dm:58)  may sleep
rt.def("/obj/effect/particle_effect/smoke/proc/smoke_mob", function* smoke_mob(f: Frame, C: Value) {
	f.vars = () => [C];
	if (!truthy((rt.istype(live(C), T("/mob/living/carbon")) ? 1 : 0))) {
		return 0;
	}
	if (rt.lt(rt.sv(f, "lifetime"), 1)) {
		return 0;
	}
	if ((rt.fv(f, "internal", live(C)) !== null || truthy((yield* g.callName(f, live(C), "has_smoke_protection", []))))) {
		return 0;
	}
	if (truthy(rt.fv(f, "smoke_delay", live(C)))) {
		return 0;
	}
	rt.incField(f, live(C), "smoke_delay", 1, true);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/particle_effect/smoke/proc/remove_smoke_delay"), live(C)])), 10]);
	return 1;
}, true);

// /obj/effect/particle_effect/smoke/proc/remove_smoke_delay  (code/game/objects/effects/effect_system/effects_smoke.dm:72)
rt.def("/obj/effect/particle_effect/smoke/proc/remove_smoke_delay", function remove_smoke_delay(f: Frame, C: Value) {
	if (!truthy(live(C))) return f.dot;
	rt.setFv(f, "smoke_delay", live(C), 0);
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob/living/carbon" }] });

// /obj/effect/particle_effect/smoke/proc/spread_smoke  (code/game/objects/effects/effect_system/effects_smoke.dm:75)  may sleep
rt.def("/obj/effect/particle_effect/smoke/proc/spread_smoke", function* spread_smoke(f: Frame) {
	let t_loc: Value = null, newsmokes: Value = null, _T: Value = null, foundsmoke: Value = null, L: Value = null, S: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [t_loc, newsmokes, _T, foundsmoke, L, S, SM, $e];
	if (!truthy((t_loc = rt.getStep(f, live(f.src), 0)))) {
		return live(f.dot);
	}
	newsmokes = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.callName(f, live(t_loc), "GetAtmosAdjacentTurfs", [])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((foundsmoke = rt.locateIn(f, T("/obj/effect/particle_effect/smoke"), live(_T))))) {
			continue;
		}
		L = null;
		rt.forList(f, 1, live(_T), T("/mob/living"));
		while (($e = rt.next(f, 1)) !== undefined) {
			L = $e;
			yield* g.srcCall(f, "smoke_mob", live(L));
		}
		rt.endFor(f, 1);
		S = (yield* g.new_(f, rt.sv(f, "type"), [live(_T)]));
		yield* g.callName(f, rt.sv(f, "reagents"), "copy_to", [live(S), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
		yield* g.callName(f, live(S), "setDir", [rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
		rt.setFv(f, "amount", live(S), subtract(rt.sv(f, "amount"), 1));
		yield* g.callName(f, live(S), "add_atom_colour", [rt.sv(f, "color"), 4]);
		rt.setFv(f, "lifetime", live(S), rt.sv(f, "lifetime"));
		if (rt.gt(rt.fv(f, "amount", live(S)), 0)) {
			if (truthy(rt.sv(f, "opaque"))) {
				yield* g.callName(f, live(S), "set_opacity", [1]);
			}
			yield* g.callName(f, live(newsmokes), "Add", [live(S)]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(newsmokes)))) return f.dot;
	rt.spawnTail(f, 1, "/obj/effect/particle_effect/smoke/proc/spread_smoke: spawn at game/objects/effects/effect_system/effects_smoke.dm:97", t_loc, newsmokes, _T, foundsmoke, L, S, SM);
	return f.dot;
}, true);

// a spawn(1) body of /obj/effect/particle_effect/smoke/proc/spread_smoke, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/particle_effect/smoke/proc/spread_smoke: spawn at game/objects/effects/effect_system/effects_smoke.dm:97", function* (f: Frame, t_loc: Value, newsmokes: Value, _T: Value, foundsmoke: Value, L: Value, S: Value, SM: Value) {
	let $e: any;
	f.vars = () => [t_loc, newsmokes, _T, foundsmoke, L, S, SM, $e];
	SM = null;
	rt.forList(f, 0, live(newsmokes), T("/obj/effect/particle_effect/smoke"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		yield* g.callName(f, live(SM), "spread_smoke", []);
	}
	rt.endFor(f, 0);
	return null;
});

rt.type(1521, "/datum/effect_system/smoke_spread", "/datum/effect_system", {
	amount: 10,
	effect_type: rt.typePath("/obj/effect/particle_effect/smoke"),
});

// /datum/effect_system/smoke_spread/proc/set_up  (code/game/objects/effects/effect_system/effects_smoke.dm:107)
rt.def("/datum/effect_system/smoke_spread/proc/set_up", function set_up(f: Frame, radius: Value, loca: Value) {
	f.vars = () => [radius];
	if (live(radius) === null) {
		radius = 5;
	}
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(loca)]))) {
		rt.setSv(f, "location", live(loca));
	} else {
		rt.setSv(f, "location", rt.getStep(f, live(loca), 0));
	}
	rt.setSv(f, "amount", live(radius));
	return f.dot;
});

// /datum/effect_system/smoke_spread/proc/start  (code/game/objects/effects/effect_system/effects_smoke.dm:115)  may sleep
rt.def("/datum/effect_system/smoke_spread/proc/start", function* start(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy(rt.sv(f, "holder"))) {
		rt.setSv(f, "location", rt.getStep(f, rt.sv(f, "holder"), 0));
	}
	rt.setFv(f, "amount", (S = (yield* g.new_(f, rt.sv(f, "effect_type"), [rt.sv(f, "location")]))), rt.sv(f, "amount"));
	if (!truthy(rt.fv(f, "amount", live(S)))) return f.dot;
	yield* g.callName(f, live(S), "spread_smoke", []);
	return f.dot;
}, true);

rt.type(11926, "/obj/effect/particle_effect/smoke/bad", "/obj/effect/particle_effect/smoke", {
	lifetime: 8,
});

// /obj/effect/particle_effect/smoke/bad/proc/smoke_mob  (code/game/objects/effects/effect_system/effects_smoke.dm:130)  may sleep
rt.def("/obj/effect/particle_effect/smoke/bad/proc/smoke_mob", function* smoke_mob(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "drop_item", []);
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [1]);
	yield* g.callName(f, live(f.args[0]), "emote", ["cough"]);
	return 1;
}, true, { args: ["M"] });

// /obj/effect/particle_effect/smoke/bad/proc/CanPass  (code/game/objects/effects/effect_system/effects_smoke.dm:137)
rt.def("/obj/effect/particle_effect/smoke/bad/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let B: Value = null;
	f.vars = () => [height, B];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	if (truthy((rt.istype(live(mover), T("/obj/item/projectile/beam")) ? 1 : 0))) {
		rt.setFv(f, "damage", (B = live(mover)), divide(rt.fv(f, "damage", live(B)), 2));
	}
	return 1;
});

rt.type(1523, "/datum/effect_system/smoke_spread/freezing", "/datum/effect_system/smoke_spread", {
	blast: 0,
	effect_type: rt.typePath("/obj/effect/particle_effect/smoke/freezing"),
});

// /datum/effect_system/smoke_spread/freezing/proc/Chilled  (code/game/objects/effects/effect_system/effects_smoke.dm:162)  may sleep
rt.def("/datum/effect_system/smoke_spread/freezing/proc/Chilled", function* Chilled(f: Frame, A: Value) {
	let _T: Value = null, G: Value = null, H: Value = null, G_gases: Value = null, U: Value = null, L: Value = null, Item: Value = null;
	let $e: any;
	f.vars = () => [A, _T, G, H, G_gases, U, L, Item, $e];
	if (!truthy((rt.istype(live(A), T("/turf/open")) ? 1 : 0))) return f.dot;
	if (truthy(rt.gv(f, "air", (_T = live(A))))) {
		G = rt.fv(f, "air", live(_T));
		if (rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(_T), rt.sv(f, "location")])), 2)) {
			rt.setFv(f, "temperature", live(G), 2);
		}
		yield* g.callName(f, live(_T), "air_update_turf", []);
		H = null;
		rt.forList(f, 0, live(_T), T("/obj/effect/hotspot"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
			if (truthy(rt.index((G_gases = rt.fv(f, "gases", live(G))), "plasma"))) {
				yield* g.callName(f, live(G), "assert_gas", ["n2"]);
				rt.modAt(rt.at(live(G_gases), "n2"), 1, rt.index(rt.at(live(G_gases), "plasma"), 1), add);
				rt.setAt(rt.at(live(G_gases), "plasma"), 1, 0);
				yield* g.callName(f, live(G), "garbage_collect", []);
			}
		}
		rt.endFor(f, 0);
	}
	U = null;
	rt.forList(f, 0, live(_T), T("/obj/machinery/atmospherics/components/unary"));
	while (($e = rt.next(f, 0)) !== undefined) {
		U = $e;
		if ((rt.fv(f, "welded", live(U)) !== null && !truthy(rt.fv(f, "welded", live(U))))) {
			rt.setFv(f, "welded", live(U), 1);
			yield* g.callName(f, live(U), "update_icon", []);
			yield* g.callName(f, live(U), "visible_message", [fmt("<span class='danger'>＀ was frozen shut!</span>", [live(U)])]);
		}
	}
	rt.endFor(f, 0);
	L = null;
	rt.forList(f, 0, live(_T), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.callName(f, live(L), "ExtinguishMob", []);
	}
	rt.endFor(f, 0);
	Item = null;
	rt.forList(f, 0, live(_T), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Item = $e;
		yield* g.callName(f, live(Item), "extinguish", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/effect_system/smoke_spread/freezing/proc/set_up  (code/game/objects/effects/effect_system/effects_smoke.dm:188)
rt.def("/datum/effect_system/smoke_spread/freezing/proc/set_up", function set_up(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 5;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "blast", live(f.args[2]));
	return f.dot;
}, false, { args: ["radius", "loca", "blasting"] });

// /datum/effect_system/smoke_spread/freezing/proc/start  (code/game/objects/effects/effect_system/effects_smoke.dm:193)  may sleep
rt.def("/datum/effect_system/smoke_spread/freezing/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (truthy(rt.sv(f, "blast"))) {
		_T = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", rt.sv(f, "location")), 2), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", rt.sv(f, "location")), 2), 1])), rt.fv(f, "z", rt.sv(f, "location"))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", rt.sv(f, "location")), 2), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", rt.sv(f, "location")), 2), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", rt.sv(f, "location")))])), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			yield* g.srcCall(f, "Chilled", live(_T));
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(11928, "/obj/effect/particle_effect/smoke/sleeping", "/obj/effect/particle_effect/smoke", {
	lifetime: 10,
	color: "#9C3636",
});

// /obj/effect/particle_effect/smoke/sleeping/proc/smoke_mob  (code/game/objects/effects/effect_system/effects_smoke.dm:208)  may sleep
rt.def("/obj/effect/particle_effect/smoke/sleeping/proc/smoke_mob", function* smoke_mob(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "drop_item", []);
	yield* g.callName(f, live(f.args[0]), "Sleeping", [200]);
	yield* g.callName(f, live(f.args[0]), "emote", ["cough"]);
	return 1;
}, true, { args: ["M"] });

rt.type(11929, "/obj/effect/particle_effect/smoke/chem", "/obj/effect/particle_effect/smoke", {
	lifetime: 10,
});

// /obj/effect/particle_effect/smoke/chem/proc/process  (code/game/objects/effects/effect_system/effects_smoke.dm:226)  may sleep
rt.def("/obj/effect/particle_effect/smoke/chem/proc/process", function* process(f: Frame) {
	let _T: Value = null, fraction: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [_T, fraction, AM, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	_T = rt.getStep(f, live(f.src), 0);
	fraction = divide(1, rt.initial(f, live(f.src), "lifetime"));
	AM = null;
	rt.forList(f, 0, live(_T), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if (isEqual(rt.fv(f, "type", live(AM)), rt.fv(f, "type", live(f.src)))) {
			continue;
		}
		if ((truthy(rt.fv(f, "intact", live(_T))) && isEqual(rt.fv(f, "level", live(AM)), 1))) {
			continue;
		}
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(AM), 1, live(fraction)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(_T), 1, live(fraction)]);
	return 1;
}, true, { waitfor: false });

// /obj/effect/particle_effect/smoke/chem/proc/smoke_mob  (code/game/objects/effects/effect_system/effects_smoke.dm:240)  may sleep
rt.def("/obj/effect/particle_effect/smoke/chem/proc/smoke_mob", function* smoke_mob(f: Frame, M: Value) {
	let C: Value = null, fraction: Value = null;
	f.vars = () => [M, C, fraction];
	if (rt.lt(rt.sv(f, "lifetime"), 1)) {
		return 0;
	}
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		return 0;
	}
	if ((rt.gv(f, "internal", (C = live(M))) !== null || truthy((yield* g.callName(f, live(C), "has_smoke_protection", []))))) {
		return 0;
	}
	fraction = divide(1, rt.initial(f, live(f.src), "lifetime"));
	yield* g.callName(f, rt.sv(f, "reagents"), "copy_to", [live(C), multiply(live(fraction), rt.fv(f, "total_volume", rt.sv(f, "reagents")))]);
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(M), 2, live(fraction)]);
	return 1;
}, true);

rt.type(1525, "/datum/effect_system/smoke_spread/chem", "/datum/effect_system/smoke_spread", {
	chemholder: null,
	effect_type: rt.typePath("/obj/effect/particle_effect/smoke/chem"),
});

// /datum/effect_system/smoke_spread/chem/proc/New  (code/game/objects/effects/effect_system/effects_smoke.dm:259)  may sleep
rt.def("/datum/effect_system/smoke_spread/chem/proc/New", function* New(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chemholder", (yield* g.new_(f, T("/obj"), [])));
	R = (yield* g.new_(f, T("/datum/reagents"), [500]));
	rt.setFv(f, "reagents", rt.sv(f, "chemholder"), live(R));
	rt.setFv(f, "my_atom", live(R), rt.sv(f, "chemholder"));
	return f.dot;
}, true);

// /datum/effect_system/smoke_spread/chem/proc/Destroy  (code/game/objects/effects/effect_system/effects_smoke.dm:266)  may sleep
rt.def("/datum/effect_system/smoke_spread/chem/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "chemholder")]);
	rt.setSv(f, "chemholder", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/effect_system/smoke_spread/chem/proc/set_up  (code/game/objects/effects/effect_system/effects_smoke.dm:271)  may sleep
rt.def("/datum/effect_system/smoke_spread/chem/proc/set_up", function* set_up(f: Frame, carry: Value, radius: Value, loca: Value, silent: Value) {
	let contained: Value = null, reagent: Value = null, A: Value = null, where: Value = null, whereLink: Value = null, M: Value = null, more: Value = null;
	let $e: any;
	f.vars = () => [carry, radius, loca, silent, contained, reagent, A, where, whereLink, M, more, $e];
	if (live(carry) === null) {
		carry = null;
	}
	if (live(radius) === null) {
		radius = 1;
	}
	if (live(silent) === null) {
		silent = 0;
	}
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(loca)])))) {
		rt.setSv(f, "location", live(loca));
	} else {
		rt.setSv(f, "location", rt.getStep(f, live(loca), 0));
	}
	rt.setSv(f, "amount", live(radius));
	yield* g.callName(f, live(carry), "copy_to", [rt.sv(f, "chemholder"), multiply(4, rt.fv(f, "total_volume", live(carry)))]);
	if (truthy(live(silent))) return f.dot;
	contained = "";
	reagent = null;
	rt.forList(f, 0, rt.fv(f, "reagent_list", live(carry)));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		contained = rt.modify(live(contained), fmt(" ＀ ", [live(reagent)]), add);
	}
	rt.endFor(f, 0);
	if (truthy(live(contained))) {
		contained = fmt("[＀]", [live(contained)]);
	}
	A = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "location")]));
	where = fmt("＀ | ＀, ＀", [rt.fv(f, "name", live(A)), rt.fv(f, "x", rt.sv(f, "location")), rt.fv(f, "y", rt.sv(f, "location"))]);
	whereLink = fmt("<A HREF='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>＀</a>", [rt.fv(f, "x", rt.sv(f, "location")), rt.fv(f, "y", rt.sv(f, "location")), rt.fv(f, "z", rt.sv(f, "location")), live(where)]);
	if (truthy(rt.gv(f, "fingerprintslast", rt.fv(f, "my_atom", live(carry))))) {
		M = (yield* g.call(f, P("/proc/get_mob_by_key"), null, [rt.gv(f, "fingerprintslast", rt.fv(f, "my_atom", live(carry)))]));
		more = "";
		if (truthy(live(M))) {
			more = fmt("(<A HREF='?_src_=holder;adminmoreinfo=＃'>?</a>) (<A HREF='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>) ", [live(M), live(M)]);
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Smoke: (＀)＀. Key: ＀＀.", [live(whereLink), live(contained), rt.gv(f, "fingerprintslast", rt.fv(f, "my_atom", live(carry))), live(more)]), 0, 1]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("A chemical smoke reaction has taken place in (＀)＀. Last associated key is ＀.", [live(where), live(contained), rt.gv(f, "fingerprintslast", rt.fv(f, "my_atom", live(carry)))])]);
	} else {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Smoke: (＀)＀. No associated key.", [live(whereLink), live(contained)]), 0, 1]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("A chemical smoke reaction has taken place in (＀)＀. No associated key.", [live(where), live(contained)])]);
	}
	return f.dot;
}, true);

// /datum/effect_system/smoke_spread/chem/proc/start  (code/game/objects/effects/effect_system/effects_smoke.dm:302)  may sleep
rt.def("/datum/effect_system/smoke_spread/chem/proc/start", function* start(f: Frame) {
	let mixcolor: Value = null, S: Value = null;
	f.vars = () => [mixcolor, S];
	mixcolor = (yield* g.call(f, P("/proc/mix_color_from_reagents"), null, [rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "chemholder")))]));
	if (truthy(rt.sv(f, "holder"))) {
		rt.setSv(f, "location", rt.getStep(f, rt.sv(f, "holder"), 0));
	}
	S = (yield* g.new_(f, rt.sv(f, "effect_type"), [rt.sv(f, "location")]));
	if (rt.gt(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "chemholder"))), 1)) {
		yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "chemholder")), "copy_to", [live(S), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "chemholder")))]);
	}
	if (truthy(live(mixcolor))) {
		yield* g.callName(f, live(S), "add_atom_colour", [live(mixcolor), 4]);
	}
	rt.setFv(f, "amount", live(S), rt.sv(f, "amount"));
	if (!truthy(rt.fv(f, "amount", live(S)))) return f.dot;
	yield* g.callName(f, live(S), "spread_smoke", []);
	return f.dot;
}, true);
