// From code/_onclick/hud/parallax.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/hud/proc/create_parallax  (code/_onclick/hud/parallax.dm:15)  may sleep
rt.def("/datum/hud/proc/create_parallax", function* create_parallax(f: Frame, viewmob: Value) {
	let screenmob: Value = null, C: Value = null, PM: Value = null;
	f.vars = () => [viewmob, screenmob, C, PM];
	screenmob = (live(viewmob) || rt.sv(f, "mymob"));
	C = rt.fv(f, "client", live(screenmob));
	if (!truthy((yield* g.srcCall(f, "apply_parallax_pref", live(viewmob))))) {
		return live(f.dot);
	}
	if (!truthy(rt.length(rt.fv(f, "parallax_layers_cached", live(C))))) {
		rt.setFv(f, "parallax_layers_cached", live(C), rt.list());
		rt.modField(f, live(C), "parallax_layers_cached", (yield* g.new_(f, T("/obj/screen/parallax_layer/layer_1"), [null, rt.fv(f, "view", live(C))])), add);
		rt.modField(f, live(C), "parallax_layers_cached", (yield* g.new_(f, T("/obj/screen/parallax_layer/layer_2"), [null, rt.fv(f, "view", live(C))])), add);
		rt.modField(f, live(C), "parallax_layers_cached", (yield* g.new_(f, T("/obj/screen/parallax_layer/layer_3"), [null, rt.fv(f, "view", live(C))])), add);
	}
	rt.setFv(f, "parallax_layers", live(C), (yield* g.callName(f, rt.fv(f, "parallax_layers_cached", live(C)), "Copy", [])));
	if (rt.gt(rt.length(rt.fv(f, "parallax_layers", live(C))), rt.fv(f, "parallax_layers_max", live(C)))) {
		rt.setFv(f, "len", rt.fv(f, "parallax_layers", live(C)), rt.fv(f, "parallax_layers_max", live(C)));
	}
	(rt.modField(f, live(C), "screen", rt.fv(f, "parallax_layers", live(C)), rt.bitOr));
	PM = rt.index(rt.gv(f, "plane_masters", rt.fv(f, "hud_used", live(screenmob))), fmt("＀", [-95]));
	if (!isEqual(live(screenmob), rt.sv(f, "mymob"))) {
		(rt.modField(f, live(C), "screen", rt.locateIn(f, T("/obj/screen/plane_master/parallax_white"), rt.fv(f, "screen", live(C))), subtract));
		rt.modField(f, live(C), "screen", live(PM), add);
	}
	rt.setFv(f, "color", live(PM), rt.list(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0));
	return f.dot;
}, true);

// /datum/hud/proc/remove_parallax  (code/_onclick/hud/parallax.dm:46)
rt.def("/datum/hud/proc/remove_parallax", function remove_parallax(f: Frame, viewmob: Value) {
	let screenmob: Value = null, C: Value = null, PM: Value = null;
	f.vars = () => [screenmob, C, PM];
	screenmob = (live(viewmob) || rt.sv(f, "mymob"));
	(rt.modField(f, (C = rt.fv(f, "client", live(screenmob))), "screen", rt.fv(f, "parallax_layers_cached", live(C)), subtract));
	PM = rt.index(rt.gv(f, "plane_masters", rt.fv(f, "hud_used", live(screenmob))), fmt("＀", [-95]));
	if (!isEqual(live(screenmob), rt.sv(f, "mymob"))) {
		(rt.modField(f, live(C), "screen", rt.locateIn(f, T("/obj/screen/plane_master/parallax_white"), rt.fv(f, "screen", live(C))), subtract));
		rt.modField(f, live(C), "screen", live(PM), add);
	}
	rt.setFv(f, "color", live(PM), rt.initial(f, live(PM), "color"));
	rt.setFv(f, "parallax_layers", live(C), null);
	return f.dot;
});

// /datum/hud/proc/apply_parallax_pref  (code/_onclick/hud/parallax.dm:57)
rt.def("/datum/hud/proc/apply_parallax_pref", function apply_parallax_pref(f: Frame, viewmob: Value) {
	let screenmob: Value = null, C: Value = null, pref: Value = null;
	let $0: any;
	f.vars = () => [screenmob, C, pref, $0];
	screenmob = (live(viewmob) || rt.sv(f, "mymob"));
	if (truthy(rt.gv(f, "prefs", (C = rt.fv(f, "client", live(screenmob)))))) {
		if ((pref = rt.gv(f, "parallax", rt.fv(f, "prefs", live(C)))) === null) {
			pref = 0;
			if (rt.lt(rt.fv(f, "byond_version", live(C)), 511)) {
				pref = 3;
			}
		}
		$0 = rt.gv(f, "parallax", rt.fv(f, "prefs", live(C)));
		if ($0 === -1) {
			rt.setFv(f, "parallax_throttle", live(C), 0);
			rt.setFv(f, "parallax_layers_max", live(C), 4);
			return 1;
		} else if ($0 === 1) {
			rt.setFv(f, "parallax_throttle", live(C), 1);
			rt.setFv(f, "parallax_layers_max", live(C), 2);
			return 1;
		} else if ($0 === 2) {
			rt.setFv(f, "parallax_throttle", live(C), 2);
			rt.setFv(f, "parallax_layers_max", live(C), 1);
			return 1;
		} else if ($0 === 3) {
			return 0;
		}
	}
	rt.setFv(f, "parallax_throttle", live(C), rt.fv(f, "tick_lag", rt.world()));
	rt.setFv(f, "parallax_layers_max", live(C), 3);
	return 1;
});

// /datum/hud/proc/update_parallax_pref  (code/_onclick/hud/parallax.dm:89)  may sleep
rt.def("/datum/hud/proc/update_parallax_pref", function* update_parallax_pref(f: Frame, viewmob: Value) {
	f.vars = () => [viewmob];
	yield* g.srcCall(f, "remove_parallax", live(viewmob));
	yield* g.srcCall(f, "create_parallax", live(viewmob));
	return f.dot;
}, true);

// /datum/hud/proc/set_parallax_movedir  (code/_onclick/hud/parallax.dm:96)  may sleep
rt.def("/datum/hud/proc/set_parallax_movedir", function* set_parallax_movedir(f: Frame, new_parallax_movedir: Value, skip_windups: Value) {
	let C: Value = null, animatedir: Value = null, animate_time: Value = null, thing: Value = null, L: Value = null, _T: Value = null, newtransform: Value = null, shortesttimer: Value = null, thing_4: Value = null, L_5: Value = null, _T_6: Value = null, CB: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $e: any;
	f.vars = () => [new_parallax_movedir, skip_windups, C, animatedir, animate_time, thing, L, _T, newtransform, shortesttimer, thing_4, L_5, _T_6, CB, $0, $1, $2, $3, $4, $5, $6, $7, $8, $e];
	f.dot = 0;
	C = rt.fv(f, "client", rt.sv(f, "mymob"));
	if (isEqual(live(new_parallax_movedir), rt.fv(f, "parallax_movedir", live(C)))) {
		return live(f.dot);
	}
	animatedir = live(new_parallax_movedir);
	if (isEqual(live(new_parallax_movedir), 0)) {
		animate_time = 0;
		thing = null;
		rt.forList(f, 0, rt.fv(f, "parallax_layers", live(C)));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			rt.setFv(f, "icon_state", (L = live(thing)), rt.initial(f, live(L), "icon_state"));
			yield* g.callName(f, live(L), "update_o", [rt.fv(f, "view", live(C))]);
			if (rt.gt((_T = divide(25, rt.fv(f, "speed", live(L)))), live(animate_time))) {
				animate_time = live(_T);
			}
		}
		rt.endFor(f, 0);
		rt.setFv(f, "dont_animate_parallax", live(C), add(rt.worldTime(f), (yield* g.call(f, P("/proc/min"), null, [live(animate_time), 25]))));
		animatedir = rt.fv(f, "parallax_movedir", live(C));
	}
	newtransform = null;
	$0 = live(animatedir);
	if ($0 === 1) {
		newtransform = (yield* g.call(f, P("/proc/matrix"), null, [1, 0, 0, 0, 1, 480]));
	} else if ($0 === 2) {
		newtransform = (yield* g.call(f, P("/proc/matrix"), null, [1, 0, 0, 0, 1, -480]));
	} else if ($0 === 4) {
		newtransform = (yield* g.call(f, P("/proc/matrix"), null, [1, 0, 480, 0, 1, 0]));
	} else if ($0 === 8) {
		newtransform = (yield* g.call(f, P("/proc/matrix"), null, [1, 0, -480, 0, 1, 0]));
	}
	shortesttimer = null;
	if (!truthy(live(skip_windups))) {
		thing_4 = null;
		rt.forList(f, 0, rt.fv(f, "parallax_layers", live(C)));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing_4 = $e;
			L_5 = live(thing_4);
			_T_6 = divide(25, rt.fv(f, "speed", live(L_5)));
			if (live(shortesttimer) === null) {
				shortesttimer = live(_T_6);
			}
			if (rt.lt(live(_T_6), live(shortesttimer))) {
				shortesttimer = live(_T_6);
			}
			rt.setFv(f, "transform", live(L_5), live(newtransform));
			$0 = null;
			$1 = live(L_5);
			$2 = "transform";
			$3 = (yield* g.call(f, P("/proc/matrix"), null, []));
			$4 = "time";
			$5 = live(_T_6);
			$6 = "easing";
			$7 = 7;
			if (truthy(live(new_parallax_movedir))) {
				$8 = 64;
			} else {
				$8 = 128;
			}
			rt.op(f, "Animate", [2, 10], [$0, $1, $2, $3, $4, $5, $6, rt.bitOr($7, $8), "flags", 1]);
			if (truthy(live(new_parallax_movedir))) {
				rt.setFv(f, "transform", live(L_5), live(newtransform));
				rt.op(f, "Animate", [2, 4], ["transform", (yield* g.call(f, P("/proc/matrix"), null, [])), "time", live(_T_6)]);
			}
		}
		rt.endFor(f, 0);
	}
	rt.setFv(f, "parallax_movedir", live(C), live(new_parallax_movedir));
	if (truthy(rt.fv(f, "parallax_animate_timer", live(C)))) {
		yield* g.call(f, P("/proc/deltimer"), null, [rt.fv(f, "parallax_animate_timer", live(C))]);
	}
	CB = (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/hud/proc/update_parallax_motionblur"), live(C), live(animatedir), live(new_parallax_movedir), live(newtransform)]));
	if (truthy(live(skip_windups))) {
		yield* g.callName(f, live(CB), "Invoke", []);
	} else {
		rt.setFv(f, "parallax_animate_timer", live(C), (yield* g.call(f, P("/proc/addtimer"), null, [live(CB), (yield* g.call(f, P("/proc/min"), null, [live(shortesttimer), 25])), 12])));
	}
	return f.dot;
}, true);

// /datum/hud/proc/update_parallax_motionblur  (code/_onclick/hud/parallax.dm:149)
rt.def("/datum/hud/proc/update_parallax_motionblur", function update_parallax_motionblur(f: Frame, C: Value, animatedir: Value, new_parallax_movedir: Value, newtransform: Value) {
	let thing: Value = null, L: Value = null, newstate: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [thing, L, newstate, _T, $e];
	rt.setFv(f, "parallax_animate_timer", live(C), 0);
	thing = null;
	rt.forList(f, 0, rt.fv(f, "parallax_layers", live(C)));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		L = live(thing);
		if (!truthy(live(new_parallax_movedir))) {
			rt.op(f, "Animate", [1, 1], [live(L)]);
			continue;
		}
		newstate = rt.initial(f, live(L), "icon_state");
		if (truthy(live(animatedir))) {
			if ((isEqual(live(animatedir), 1) || isEqual(live(animatedir), 2))) {
				newstate = rt.modify(live(newstate), "_vertical", add);
			} else {
				newstate = rt.modify(live(newstate), "_horizontal", add);
			}
		}
		_T = divide(25, rt.fv(f, "speed", live(L)));
		if (truthy((rt.isIn(f, live(newstate), rt.call(f, P("/proc/icon_states"), null, [rt.fv(f, "icon", live(L))])) ? 1 : 0))) {
			rt.setFv(f, "icon_state", live(L), live(newstate));
			rt.callName(f, live(L), "update_o", [rt.fv(f, "view", live(C))]);
		}
		rt.setFv(f, "transform", live(L), live(newtransform));
		rt.op(f, "Animate", [2, 10], [null, live(L), "transform", rt.call(f, P("/proc/matrix"), null, []), "time", live(_T), "loop", -1, "flags", 1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { argTypes: [{ path: "/client" }, {  }, {  }, { path: "/matrix" }] });

// /datum/hud/proc/update_parallax  (code/_onclick/hud/parallax.dm:175)  may sleep
rt.def("/datum/hud/proc/update_parallax", function* update_parallax(f: Frame) {
	let C: Value = null, posobj: Value = null, areaobj: Value = null, force: Value = null, offset_x: Value = null, offset_y: Value = null, last_delay: Value = null, thing: Value = null, L: Value = null, change_x: Value = null, change_y: Value = null;
	let $e: any;
	f.vars = () => [C, posobj, areaobj, force, offset_x, offset_y, last_delay, thing, L, change_x, change_y, $e];
	C = rt.fv(f, "client", rt.sv(f, "mymob"));
	posobj = rt.getStep(f, rt.fv(f, "eye", live(C)), 0);
	// The eye can be off the map for a moment (a brain's Login while its head is still being placed): 2017 tg read
	// null.loc here. Modern tg returns early too.
	if (!truthy(live(posobj))) {
		return null;
	}
	yield* g.srcCall(f, "set_parallax_movedir", rt.gv(f, "parallax_movedir", (areaobj = rt.fv(f, "loc", live(posobj)))), 0);
	force = null;
	if ((!truthy(rt.fv(f, "previous_turf", live(C))) || !isEqual(rt.gv(f, "z", rt.fv(f, "previous_turf", live(C))), rt.fv(f, "z", live(posobj))))) {
		rt.setFv(f, "previous_turf", live(C), live(posobj));
		force = 1;
	}
	if ((!truthy(live(force)) && rt.lt(rt.worldTime(f), add(rt.fv(f, "last_parallax_shift", live(C)), rt.fv(f, "parallax_throttle", live(C)))))) {
		return live(f.dot);
	}
	offset_x = subtract(rt.fv(f, "x", live(posobj)), rt.gv(f, "x", rt.fv(f, "previous_turf", live(C))));
	offset_y = subtract(rt.fv(f, "y", live(posobj)), rt.gv(f, "y", rt.fv(f, "previous_turf", live(C))));
	if (((!truthy(live(offset_x)) && !truthy(live(offset_y))) && !truthy(live(force)))) {
		return live(f.dot);
	}
	last_delay = (yield* g.call(f, P("/proc/min"), null, [(last_delay = subtract(rt.worldTime(f), rt.fv(f, "last_parallax_shift", live(C)))), rt.fv(f, "parallax_throttle", live(C))]));
	rt.setFv(f, "previous_turf", live(C), live(posobj));
	rt.setFv(f, "last_parallax_shift", live(C), rt.worldTime(f));
	thing = null;
	rt.forList(f, 0, rt.fv(f, "parallax_layers", live(C)));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!isEqual(rt.gv(f, "view_sized", (L = live(thing))), rt.fv(f, "view", live(C)))) {
			yield* g.callName(f, live(L), "update_o", [rt.fv(f, "view", live(C))]);
		}
		change_x = multiply(live(offset_x), rt.fv(f, "speed", live(L)));
		(rt.modField(f, live(L), "offset_x", live(change_x), subtract));
		change_y = multiply(live(offset_y), rt.fv(f, "speed", live(L)));
		(rt.modField(f, live(L), "offset_y", live(change_y), subtract));
		if (rt.gt(rt.fv(f, "offset_x", live(L)), 240)) {
			(rt.modField(f, live(L), "offset_x", 480, subtract));
		}
		if (rt.lt(rt.fv(f, "offset_x", live(L)), -240)) {
			rt.modField(f, live(L), "offset_x", 480, add);
		}
		if (rt.gt(rt.fv(f, "offset_y", live(L)), 240)) {
			(rt.modField(f, live(L), "offset_y", 480, subtract));
		}
		if (rt.lt(rt.fv(f, "offset_y", live(L)), -240)) {
			rt.modField(f, live(L), "offset_y", 480, add);
		}
		if ((((((!truthy(rt.fv(f, "parallax_movedir", live(areaobj))) && rt.le(rt.fv(f, "dont_animate_parallax", live(C)), rt.worldTime(f))) && (truthy(live(offset_x)) || truthy(live(offset_y)))) && rt.le(rt.op(f, "Abs", [], [live(offset_x)]), (yield* g.call(f, P("/proc/max"), null, [add(divide(rt.fv(f, "parallax_throttle", live(C)), rt.fv(f, "tick_lag", rt.world())), 1), 1])))) && rt.le(rt.op(f, "Abs", [], [live(offset_y)]), (yield* g.call(f, P("/proc/max"), null, [add(divide(rt.fv(f, "parallax_throttle", live(C)), rt.fv(f, "tick_lag", rt.world())), 1), 1])))) && (rt.gt((yield* g.call(f, P("/proc/round"), null, [rt.op(f, "Abs", [], [live(change_x)])])), 1) || rt.gt((yield* g.call(f, P("/proc/round"), null, [rt.op(f, "Abs", [], [live(change_y)])])), 1)))) {
			rt.setFv(f, "transform", live(L), (yield* g.call(f, P("/proc/matrix"), null, [1, 0, multiply(live(offset_x), rt.fv(f, "speed", live(L))), 0, 1, multiply(live(offset_y), rt.fv(f, "speed", live(L)))])));
			rt.op(f, "Animate", [2, 6], [null, live(L), "transform", (yield* g.call(f, P("/proc/matrix"), null, [])), "time", live(last_delay)]);
		}
		rt.setFv(f, "screen_loc", live(L), fmt("CENTER-7:＀,CENTER-7:＀", [(yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "offset_x", live(L)), 1])), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "offset_y", live(L)), 1]))]));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /atom/movable/proc/update_parallax_contents  (code/_onclick/hud/parallax.dm:226)  may sleep
rt.def("/atom/movable/proc/update_parallax_contents", function* update_parallax_contents(f: Frame) {
	let thing: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [thing, M, $e];
	if (!truthy(rt.length(rt.sv(f, "client_mobs_in_contents")))) return f.dot;
	thing = null;
	rt.forList(f, 0, rt.sv(f, "client_mobs_in_contents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if ((((truthy((M = live(thing))) && truthy(rt.fv(f, "client", live(M)))) && truthy(rt.fv(f, "hud_used", live(M)))) && truthy(rt.length(rt.gv(f, "parallax_layers", rt.fv(f, "client", live(M))))))) {
			yield* g.callName(f, rt.fv(f, "hud_used", live(M)), "update_parallax", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/proc/update_parallax_teleport  (code/_onclick/hud/parallax.dm:233)  may sleep
rt.def("/mob/proc/update_parallax_teleport", function* update_parallax_teleport(f: Frame) {
	let areaobj: Value = null;
	f.vars = () => [areaobj];
	if (!(((truthy(rt.sv(f, "client")) && truthy(rt.fv(f, "eye", rt.sv(f, "client")))) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.length(rt.fv(f, "parallax_layers", rt.sv(f, "client")))))) return f.dot;
	areaobj = (yield* g.call(f, P("/proc/get_area"), null, [rt.fv(f, "eye", rt.sv(f, "client"))]));
	yield* g.callName(f, rt.sv(f, "hud_used"), "set_parallax_movedir", [rt.fv(f, "parallax_movedir", live(areaobj)), 1]);
	return f.dot;
}, true);

rt.type(11137, "/obj/screen/parallax_layer", "/obj/screen", {
	speed: 1,
	offset_x: 0,
	offset_y: 0,
	view_sized: null,
	icon: rt.rsc("icons/effects/parallax.dmi"),
	blend_mode: 2,
	plane: -90,
	screen_loc: "CENTER-7,CENTER-7",
	mouse_opacity: 0,
});

// /obj/screen/parallax_layer/proc/Initialize  (code/_onclick/hud/parallax.dm:250)
rt.def("/obj/screen/parallax_layer/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[1]))) {
		f.args[1] = rt.fv(f, "view", rt.world());
	}
	rt.callSrc(f, "update_o", [live(f.args[1])]);
	return f.dot;
}, false, { args: ["mapload", "view"] });

// /obj/screen/parallax_layer/proc/update_o  (code/_onclick/hud/parallax.dm:256)
rt.def("/obj/screen/parallax_layer/proc/update_o", function update_o(f: Frame, view: Value) {
	let viewscales: Value = null, countx: Value = null, county: Value = null, new_overlays: Value = null, x: Value = null, y: Value = null, texture_overlay: Value = null;
	let $e: any;
	f.vars = () => [view, viewscales, countx, county, new_overlays, x, y, texture_overlay, $e];
	if (!truthy(live(view))) {
		view = rt.fv(f, "view", rt.world());
	}
	viewscales = rt.call(f, P("/proc/getviewsize"), null, [live(view)]);
	countx = add(rt.call(f, P("/proc/Ceiling"), null, [divide(divide(rt.index(live(viewscales), 1), 2), divide(480, rt.fv(f, "icon_size", rt.world())))]), 1);
	county = add(rt.call(f, P("/proc/Ceiling"), null, [divide(divide(rt.index(live(viewscales), 2), 2), divide(480, rt.fv(f, "icon_size", rt.world())))]), 1);
	new_overlays = rt.new_(f, T("/list"), []);
	x = null;
	rt.forRange(f, 0, rt.neg(live(countx)), live(countx), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		x = $e;
		y = null;
		rt.forRange(f, 1, rt.neg(live(county)), live(county), 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			y = $e;
			if ((isEqual(live(x), 0) && isEqual(live(y), 0))) {
				continue;
			}
			rt.setFv(f, "transform", (texture_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state")])), rt.call(f, P("/proc/matrix"), null, [1, 0, multiply(live(x), 480), 0, 1, multiply(live(y), 480)]));
			new_overlays = rt.modify(live(new_overlays), live(texture_overlay), add);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "cut_overlays", []);
	rt.callSrc(f, "add_overlay", [live(new_overlays)]);
	rt.setSv(f, "view_sized", live(view));
	return f.dot;
});
