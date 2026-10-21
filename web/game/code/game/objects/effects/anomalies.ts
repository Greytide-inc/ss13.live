// From code/game/objects/effects/anomalies.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11784, "/obj/effect/anomaly", "/obj/effect", {
	movechance: 70,
	aSignal: null,
	impact_area: null,
	lifespan: 990,
	death_time: null,
	countdown_colour: null,
	countdown: null,
	anchored: 1,
	light_range: 3,
	name: "anomaly",
	desc: "A mysterious anomaly, seen commonly only in the region of space that the station orbits...",
	icon_state: "bhole3",
	density: 0,
});

// /obj/effect/anomaly/proc/Initialize  (code/game/objects/effects/anomalies.dm:21)  may sleep
rt.def("/obj/effect/anomaly/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	rt.setSv(f, "impact_area", (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])));
	rt.setSv(f, "aSignal", (yield* g.new_(f, T("/obj/item/device/assembly/signaler/anomaly"), [live(f.src)])));
	rt.setFv(f, "name", rt.sv(f, "aSignal"), fmt("＀ core", [rt.sv(f, "name")]));
	rt.setFv(f, "code", rt.sv(f, "aSignal"), (yield* g.call(f, P("/proc/rand"), null, [1, 100])));
	rt.setFv(f, "frequency", rt.sv(f, "aSignal"), (yield* g.call(f, P("/proc/rand"), null, [1200, 1599])));
	if (truthy((yield* g.call(f, P("/proc/IsMultiple"), null, [rt.fv(f, "frequency", rt.sv(f, "aSignal")), 2])))) {
		rt.incField(f, rt.sv(f, "aSignal"), "frequency", 1, true);
	}
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "lifespan", live(f.args[1]));
	}
	rt.setSv(f, "death_time", add(rt.worldTime(f), rt.sv(f, "lifespan")));
	rt.setSv(f, "countdown", (yield* g.new_(f, T("/obj/effect/countdown/anomaly"), [live(f.src)])));
	if (truthy(rt.sv(f, "countdown_colour"))) {
		rt.setFv(f, "color", rt.sv(f, "countdown"), rt.sv(f, "countdown_colour"));
	}
	yield* g.callName(f, rt.sv(f, "countdown"), "start", []);
	return f.dot;
}, true, { args: ["mapload", "new_lifespan"] });

// /obj/effect/anomaly/proc/process  (code/game/objects/effects/anomalies.dm:43)  may sleep
rt.def("/obj/effect/anomaly/proc/process", function* process(f: Frame) {
	yield* g.srcCall(f, "anomalyEffect");
	if (!rt.lt(rt.sv(f, "death_time"), rt.worldTime(f))) return f.dot;
	if (truthy(rt.sv(f, "loc"))) {
		yield* g.srcCall(f, "detonate");
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/anomaly/proc/Destroy  (code/game/objects/effects/anomalies.dm:50)  may sleep
rt.def("/obj/effect/anomaly/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.gl("poi_list"), "Remove", [live(f.src)]);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "countdown")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/anomaly/proc/anomalyEffect  (code/game/objects/effects/anomalies.dm:56)  may sleep
rt.def("/obj/effect/anomaly/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	if (!truthy(rt.op(f, "Prob", [], [rt.sv(f, "movechance")]))) return f.dot;
	yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")])]);
	return f.dot;
}, true);

// /obj/effect/anomaly/proc/ex_act  (code/game/objects/effects/anomalies.dm:63)  may sleep
rt.def("/obj/effect/anomaly/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	if (!isEqual(live(severity), 1)) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/anomaly/proc/anomalyNeutralize  (code/game/objects/effects/anomalies.dm:67)  may sleep
rt.def("/obj/effect/anomaly/proc/anomalyNeutralize", function* anomalyNeutralize(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	yield* g.new_(f, T("/obj/effect/particle_effect/smoke/bad"), [rt.sv(f, "loc")]);
	O = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(f.src)));
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/effect/anomaly/proc/attackby  (code/game/objects/effects/anomalies.dm:76)
rt.def("/obj/effect/anomaly/proc/attackby", function attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!truthy((rt.istype(live(I), T("/obj/item/device/analyzer")) ? 1 : 0))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Analyzing... ＀'s unstable field is fluctuating along frequency ＀, code ＀.</span>", [live(f.src), rt.call(f, P("/proc/format_frequency"), null, [rt.fv(f, "frequency", rt.sv(f, "aSignal"))]), rt.fv(f, "code", rt.sv(f, "aSignal"))])]);
	return f.dot;
});

rt.type(11785, "/obj/effect/anomaly/grav", "/obj/effect/anomaly", {
	boing: 0,
	name: "gravitational anomaly",
	icon_state: "shield2",
	density: 0,
});

// /obj/effect/anomaly/grav/proc/New  (code/game/objects/effects/anomalies.dm:88)  may sleep
rt.def("/obj/effect/anomaly/grav/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "origin_tech", rt.sv(f, "aSignal"), "magnets=7");
	return f.dot;
}, true);

// /obj/effect/anomaly/grav/proc/anomalyEffect  (code/game/objects/effects/anomalies.dm:92)  may sleep
rt.def("/obj/effect/anomaly/grav/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	let O: Value = null, M: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [O, M, target, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "boing", 1);
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [4, live(f.src)])), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (!truthy(rt.fv(f, "anchored", live(O)))) {
			yield* g.call(f, P("/proc/step_towards"), null, [live(O), live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [0, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.srcCall(f, "gravShock", live(M));
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [4, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/step_towards"), null, [live(M), live(f.src)]);
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [0, live(f.src)])), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (!truthy(rt.fv(f, "anchored", live(O)))) {
			if ((truthy((target = rt.locateIn(f, T("/mob/living"), (yield* g.call(f, P("/proc/view"), null, [4, live(f.src)]))))) && !truthy(rt.fv(f, "stat", live(target))))) {
				yield* g.callName(f, live(O), "throw_at", [live(target), 5, 10]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/anomaly/grav/proc/Crossed  (code/game/objects/effects/anomalies.dm:108)  may sleep
rt.def("/obj/effect/anomaly/grav/proc/Crossed", function* Crossed(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.srcCall(f, "gravShock", live(A));
	return f.dot;
}, true);

// /obj/effect/anomaly/grav/proc/Bump  (code/game/objects/effects/anomalies.dm:111)  may sleep
rt.def("/obj/effect/anomaly/grav/proc/Bump", function* Bump(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.srcCall(f, "gravShock", live(A));
	return f.dot;
}, true);

// /obj/effect/anomaly/grav/proc/Bumped  (code/game/objects/effects/anomalies.dm:114)  may sleep
rt.def("/obj/effect/anomaly/grav/proc/Bumped", function* Bumped(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.srcCall(f, "gravShock", live(A));
	return f.dot;
}, true);

// /obj/effect/anomaly/grav/proc/gravShock  (code/game/objects/effects/anomalies.dm:117)  may sleep
rt.def("/obj/effect/anomaly/grav/proc/gravShock", function* gravShock(f: Frame, A: Value) {
	let target: Value = null;
	f.vars = () => [A, target];
	if (!((truthy(rt.sv(f, "boing")) && truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) && !truthy(rt.fv(f, "stat", live(A))))) return f.dot;
	yield* g.callName(f, live(A), "Knockdown", [40]);
	target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(A), rt.getDir(f, live(f.src), (yield* g.call(f, P("/proc/get_step_away"), null, [live(A), live(f.src)])))]));
	yield* g.callName(f, live(A), "throw_at", [live(target), 5, 1]);
	rt.setSv(f, "boing", 0);
	return f.dot;
}, true);

rt.type(11786, "/obj/effect/anomaly/flux", "/obj/effect/anomaly", {
	canshock: 0,
	shockdamage: 20,
	explosive: 1,
	name: "flux wave anomaly",
	icon_state: "electricity2",
	density: 1,
});

// /obj/effect/anomaly/flux/proc/New  (code/game/objects/effects/anomalies.dm:134)  may sleep
rt.def("/obj/effect/anomaly/flux/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "origin_tech", rt.sv(f, "aSignal"), "powerstorage=7");
	return f.dot;
}, true);

// /obj/effect/anomaly/flux/proc/anomalyEffect  (code/game/objects/effects/anomalies.dm:138)  may sleep
rt.def("/obj/effect/anomaly/flux/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "canshock", 1);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [0, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.srcCall(f, "mobShock", live(M));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/anomaly/flux/proc/Crossed  (code/game/objects/effects/anomalies.dm:144)  may sleep
rt.def("/obj/effect/anomaly/flux/proc/Crossed", function* Crossed(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.srcCall(f, "mobShock", live(M));
	return f.dot;
}, true);

// /obj/effect/anomaly/flux/proc/Bump  (code/game/objects/effects/anomalies.dm:147)  may sleep
rt.def("/obj/effect/anomaly/flux/proc/Bump", function* Bump(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.srcCall(f, "mobShock", live(M));
	return f.dot;
}, true);

// /obj/effect/anomaly/flux/proc/Bumped  (code/game/objects/effects/anomalies.dm:150)  may sleep
rt.def("/obj/effect/anomaly/flux/proc/Bumped", function* Bumped(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.srcCall(f, "mobShock", live(M));
	return f.dot;
}, true);

// /obj/effect/anomaly/flux/proc/mobShock  (code/game/objects/effects/anomalies.dm:153)  may sleep
rt.def("/obj/effect/anomaly/flux/proc/mobShock", function* mobShock(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!(truthy(rt.sv(f, "canshock")) && truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0)))) return f.dot;
	rt.setSv(f, "canshock", 0);
	if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.callName(f, live(M), "electrocute_act", [null, rt.sv(f, "shockdamage"), null, fmt("＀", [rt.sv(f, "name")]), "safety", 1], rt.Args.Named);
			return live(f.dot);
		}
		yield* g.callName(f, live(M), "electrocute_act", [rt.sv(f, "shockdamage"), fmt("＀", [rt.sv(f, "name")])]);
		return live(f.dot);
	} else {
		yield* g.callName(f, live(M), "adjustFireLoss", [rt.sv(f, "shockdamage")]);
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ was shocked by ％！!</span>", [live(M), rt.sv(f, "name")]), "<span class='userdanger'>You feel a powerful shock coursing through your body!</span>", "<span class='italics'>You hear a heavy electrical crack.</span>"]);
	}
	return f.dot;
}, true);

// /obj/effect/anomaly/flux/proc/detonate  (code/game/objects/effects/anomalies.dm:169)  may sleep
rt.def("/obj/effect/anomaly/flux/proc/detonate", function* detonate(f: Frame) {
	if (truthy(rt.sv(f, "explosive"))) {
		yield* g.call(f, P("/proc/explosion"), null, [live(f.src), 1, 4, 16, 18]);
	} else {
		yield* g.new_(f, T("/obj/effect/particle_effect/sparks"), [rt.sv(f, "loc")]);
	}
	return f.dot;
}, true);

rt.type(11787, "/obj/effect/anomaly/bluespace", "/obj/effect/anomaly", {
	name: "bluespace anomaly",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	icon_state: "bluespace",
	density: 1,
});

// /obj/effect/anomaly/bluespace/proc/New  (code/game/objects/effects/anomalies.dm:183)  may sleep
rt.def("/obj/effect/anomaly/bluespace/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "origin_tech", rt.sv(f, "aSignal"), "bluespace=7");
	return f.dot;
}, true);

// /obj/effect/anomaly/bluespace/proc/anomalyEffect  (code/game/objects/effects/anomalies.dm:187)  may sleep
rt.def("/obj/effect/anomaly/bluespace/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/do_teleport"), null, [live(M), rt.locate(rt.fv(f, "x", live(M)), rt.fv(f, "y", live(M)), rt.fv(f, "z", live(M))), 4]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/anomaly/bluespace/proc/Bumped  (code/game/objects/effects/anomalies.dm:192)  may sleep
rt.def("/obj/effect/anomaly/bluespace/proc/Bumped", function* Bumped(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/do_teleport"), null, [live(A), rt.locate(rt.fv(f, "x", live(A)), rt.fv(f, "y", live(A)), rt.fv(f, "z", live(A))), 8]);
	return f.dot;
}, true);

// /obj/effect/anomaly/bluespace/proc/detonate  (code/game/objects/effects/anomalies.dm:196)  may sleep
rt.def("/obj/effect/anomaly/bluespace/proc/detonate", function* detonate(f: Frame) {
	let _T: Value = null, chosen: Value = null, possible: Value = null, W: Value = null, FROM: Value = null, TO: Value = null, flashers: Value = null, C: Value = null, y_distance: Value = null, x_distance: Value = null, A: Value = null, newloc: Value = null, M: Value = null, blueeffect: Value = null;
	let $e: any;
	f.vars = () => [_T, chosen, possible, W, FROM, TO, flashers, C, y_distance, x_distance, A, newloc, M, blueeffect, $e];
	if (!truthy((_T = (yield* g.call(f, P("/proc/safepick"), null, [(yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.sv(f, "impact_area")]))]))))) return f.dot;
	chosen = null;
	possible = rt.list();
	W = null;
	rt.forList(f, 0, rt.gl("teleportbeacons"), T("/obj/item/device/radio/beacon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		possible = rt.modify(live(possible), live(W), add);
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.len(f, live(possible)), 0)) {
		chosen = rt.op(f, "PickUnweighted", [1], [live(possible)]);
	}
	if (!truthy(live(chosen))) return f.dot;
	FROM = live(_T);
	yield* g.call(f, P("/proc/playsound"), null, [(TO = rt.getStep(f, live(chosen), 0)), rt.rsc("sound/effects/phasein.ogg"), 100, 1]);
	yield* g.call(f, P("/proc/priority_announce"), null, ["Massive bluespace translocation detected.", "Anomaly Alert"]);
	flashers = rt.list();
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [live(TO), null])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy((yield* g.callName(f, live(C), "flash_act", [])))) {
			flashers = rt.modify(live(flashers), live(C), add);
		}
	}
	rt.endFor(f, 0);
	y_distance = subtract(rt.fv(f, "y", live(TO)), rt.fv(f, "y", live(FROM)));
	x_distance = subtract(rt.fv(f, "x", live(TO)), rt.fv(f, "x", live(FROM)));
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [12, live(FROM)])), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.istype(live(A), T("/obj/item/device/radio/beacon")) ? 1 : 0))) {
			continue;
		}
		if (truthy(rt.fv(f, "anchored", live(A)))) {
			continue;
		}
		newloc = rt.locate(add(rt.fv(f, "x", live(A)), live(x_distance)), add(rt.fv(f, "y", live(A)), live(y_distance)), rt.fv(f, "z", live(TO)));
		if ((!truthy((yield* g.callName(f, live(A), "Move", [live(newloc)]))) && truthy(live(newloc)))) {
			rt.setFv(f, "loc", live(A), live(newloc));
		}
		rt.spawnTail(f, 0, "/obj/effect/anomaly/bluespace/proc/detonate: spawn at game/objects/effects/anomalies.dm:231", _T, chosen, possible, W, FROM, TO, flashers, C, y_distance, x_distance, A, newloc, M, blueeffect);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// a spawn(0) body of /obj/effect/anomaly/bluespace/proc/detonate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/anomaly/bluespace/proc/detonate: spawn at game/objects/effects/anomalies.dm:231", function* (f: Frame, _T: Value, chosen: Value, possible: Value, W: Value, FROM: Value, TO: Value, flashers: Value, C: Value, y_distance: Value, x_distance: Value, A: Value, newloc: Value, M: Value, blueeffect: Value) {
	f.vars = () => [_T, chosen, possible, W, FROM, TO, flashers, C, y_distance, x_distance, A, newloc, M, blueeffect];
	if ((truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)]))) && !truthy((rt.isIn(f, live(A), live(flashers)) ? 1 : 0)))) {
		if (truthy(rt.gv(f, "client", (M = live(A))))) {
			rt.setFv(f, "screen_loc", (blueeffect = (yield* g.new_(f, T("/obj"), [live(f.src)]))), "WEST,SOUTH to EAST,NORTH");
			rt.setFv(f, "icon", live(blueeffect), rt.rsc("icons/effects/effects.dmi"));
			rt.setFv(f, "icon_state", live(blueeffect), "shieldsparkles");
			rt.setFv(f, "layer", live(blueeffect), 18);
			rt.setFv(f, "plane", live(blueeffect), 18);
			rt.setFv(f, "mouse_opacity", live(blueeffect), 0);
			rt.modField(f, rt.fv(f, "client", live(M)), "screen", live(blueeffect), add);
			yield* g.call(f, P("/proc/sleep"), null, [20]);
			(rt.modField(f, rt.fv(f, "client", live(M)), "screen", live(blueeffect), subtract));
			yield* g.call(f, P("/proc/qdel"), null, [live(blueeffect)]);
		}
	}
	return null;
});

rt.type(11788, "/obj/effect/anomaly/pyro", "/obj/effect/anomaly", {
	ticks: 0,
	name: "pyroclastic anomaly",
	icon_state: "mustard",
});

// /obj/effect/anomaly/pyro/proc/New  (code/game/objects/effects/anomalies.dm:255)  may sleep
rt.def("/obj/effect/anomaly/pyro/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "origin_tech", rt.sv(f, "aSignal"), "plasmatech=7");
	return f.dot;
}, true);

// /obj/effect/anomaly/pyro/proc/anomalyEffect  (code/game/objects/effects/anomalies.dm:259)  may sleep
rt.def("/obj/effect/anomaly/pyro/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.incSrcVar(f, "ticks", 1, true);
	if (rt.lt(rt.sv(f, "ticks"), 5)) {
		return live(f.dot);
	} else {
		rt.setSv(f, "ticks", 0);
	}
	if (!truthy((rt.istype((_T = rt.getStep(f, live(f.src), 0)), T("/turf/open")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(_T), "atmos_spawn_air", ["o2=5;plasma=5;TEMP=1000"]);
	return f.dot;
}, true);

// /obj/effect/anomaly/pyro/proc/detonate  (code/game/objects/effects/anomalies.dm:270)
rt.def("/obj/effect/anomaly/pyro/proc/detonate", function detonate(f: Frame) {
	rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/anomaly/pyro/proc/makepyroslime")]);
	return f.dot;
});

// /obj/effect/anomaly/pyro/proc/makepyroslime  (code/game/objects/effects/anomalies.dm:273)  may sleep
rt.def("/obj/effect/anomaly/pyro/proc/makepyroslime", function* makepyroslime(f: Frame) {
	let _T: Value = null, new_colour: Value = null, S: Value = null;
	f.vars = () => [_T, new_colour, S];
	if (truthy((rt.istype((_T = rt.getStep(f, live(f.src), 0)), T("/turf/open")) ? 1 : 0))) {
		yield* g.callName(f, live(_T), "atmos_spawn_air", ["o2=500;plasma=500;TEMP=1000"]);
	}
	new_colour = rt.op(f, "PickUnweighted", [2], ["red", "orange"]);
	rt.setFv(f, "rabid", (S = (yield* g.new_(f, T("/mob/living/simple_animal/slime"), [live(_T), live(new_colour)]))), 1);
	rt.setFv(f, "amount_grown", live(S), 10);
	yield* g.callName(f, live(S), "Evolve", []);
	yield* g.call(f, P("/proc/offer_control"), null, [live(S)]);
	return f.dot;
}, true);

rt.type(11789, "/obj/effect/anomaly/bhole", "/obj/effect/anomaly", {
	name: "vortex anomaly",
	icon_state: "bhole3",
	desc: "That's a nice station you have there. It'd be a shame if something happened to it.",
});

// /obj/effect/anomaly/bhole/proc/New  (code/game/objects/effects/anomalies.dm:291)  may sleep
rt.def("/obj/effect/anomaly/bhole/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "origin_tech", rt.sv(f, "aSignal"), "engineering=7");
	return f.dot;
}, true);

// /obj/effect/anomaly/bhole/proc/anomalyEffect  (code/game/objects/effects/anomalies.dm:295)  may sleep
rt.def("/obj/effect/anomaly/bhole/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	let O: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [O, target, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "grav", (yield* g.call(f, P("/proc/rand"), null, [0, 3])), (yield* g.call(f, P("/proc/rand"), null, [2, 3])), 50, 25);
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [2, live(f.src)])), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (isEqual(live(O), live(f.src))) {
			return live(f.dot);
		}
		if (!truthy(rt.fv(f, "anchored", live(O)))) {
			if ((truthy((target = rt.locateIn(f, T("/mob/living"), (yield* g.call(f, P("/proc/view"), null, [4, live(f.src)]))))) && !truthy(rt.fv(f, "stat", live(target))))) {
				yield* g.callName(f, live(O), "throw_at", [live(target), 7, 5]);
			}
		} else {
			yield* g.callName(f, live(O), "ex_act", [2]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/anomaly/bhole/proc/grav  (code/game/objects/effects/anomalies.dm:314)  may sleep
rt.def("/obj/effect/anomaly/bhole/proc/grav", function* grav(f: Frame, r: Value, ex_act_force: Value, pull_chance: Value, turf_removal_chance: Value) {
	let t: Value = null;
	f.vars = () => [r, ex_act_force, pull_chance, turf_removal_chance, t];
	t = null;
	t = rt.neg(live(r));
	while (rt.lt(live(t), live(r))) {
		yield* g.srcCall(f, "affect_coord", add(rt.sv(f, "x"), live(t)), subtract(rt.sv(f, "y"), live(r)), live(ex_act_force), live(pull_chance), live(turf_removal_chance));
		yield* g.srcCall(f, "affect_coord", subtract(rt.sv(f, "x"), live(t)), add(rt.sv(f, "y"), live(r)), live(ex_act_force), live(pull_chance), live(turf_removal_chance));
		yield* g.srcCall(f, "affect_coord", add(rt.sv(f, "x"), live(r)), add(rt.sv(f, "y"), live(t)), live(ex_act_force), live(pull_chance), live(turf_removal_chance));
		yield* g.srcCall(f, "affect_coord", subtract(rt.sv(f, "x"), live(r)), subtract(rt.sv(f, "y"), live(t)), live(ex_act_force), live(pull_chance), live(turf_removal_chance));
		t = rt.inc(live(t), 1);
	}
	return f.dot;
}, true);

// /obj/effect/anomaly/bhole/proc/affect_coord  (code/game/objects/effects/anomalies.dm:322)  may sleep
rt.def("/obj/effect/anomaly/bhole/proc/affect_coord", function* affect_coord(f: Frame, x: Value, y: Value, ex_act_force: Value, pull_chance: Value, turf_removal_chance: Value) {
	let _T: Value = null, O: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [x, y, ex_act_force, pull_chance, turf_removal_chance, _T, O, M, $e];
	if ((_T = rt.locate(live(x), live(y), rt.sv(f, "z"))) === null) {
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [live(pull_chance)]))) {
		O = null;
		rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			if (truthy(rt.fv(f, "anchored", live(O)))) {
				yield* g.callName(f, live(O), "ex_act", [live(ex_act_force)]);
			} else {
				yield* g.call(f, P("/proc/step_towards"), null, [live(O), live(f.src)]);
			}
		}
		rt.endFor(f, 0);
		M = null;
		rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.call(f, P("/proc/step_towards"), null, [live(M), live(f.src)]);
		}
		rt.endFor(f, 0);
	}
	if (!(truthy(live(_T)) && truthy(rt.op(f, "Prob", [], [live(turf_removal_chance)])))) return f.dot;
	yield* g.callName(f, live(_T), "ex_act", [live(ex_act_force)]);
	return f.dot;
}, true);
