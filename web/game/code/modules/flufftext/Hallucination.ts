// From code/modules/flufftext/Hallucination.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/handle_hallucinations  (code/modules/flufftext/Hallucination.dm:31)  may sleep
rt.def("/mob/living/carbon/proc/handle_hallucinations", function* handle_hallucinations(f: Frame) {
	let minor: Value = null, medium: Value = null, major: Value = null, current: Value = null, halpick: Value = null;
	let $0: any;
	f.vars = () => [minor, medium, major, current, halpick, $0];
	if (truthy(rt.sv(f, "handling_hal"))) {
		return live(f.dot);
	}
	minor = rt.alist(f, ["sounds", 25, "bolts_minor", 5, "whispers", 15, "message", 10, "hudscrew", 15]);
	medium = rt.alist(f, ["fake_alert", 15, "items", 10, "items_other", 10, "dangerflash", 10, "bolts", 5, "flood", 5, "husks", 10, "battle", 15, "self_delusion", 10]);
	major = rt.alist(f, ["fake", 20, "death", 10, "xeno", 10, "singulo", 10, "delusion", 20, "koolaid", 10]);
	rt.setSv(f, "handling_hal", 1);
	while (rt.gt(rt.sv(f, "hallucination"), 20)) {
		yield* g.call(f, P("/proc/sleep"), null, [divide((yield* g.call(f, P("/proc/rand"), null, [200, 500])), divide(rt.sv(f, "hallucination"), 25))]);
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			continue;
		}
		current = rt.list();
		$0 = (yield* g.call(f, P("/proc/rand"), null, [100]));
		if (rt.inRange($0, 1, 50)) {
			current = live(minor);
		} else if (rt.inRange($0, 51, 85)) {
			current = live(medium);
		} else if (rt.inRange($0, 86, 100)) {
			current = live(major);
		}
		yield* g.srcCall(f, "hallucinate", (halpick = (yield* g.call(f, P("/proc/pickweight"), null, [live(current)]))));
	}
	rt.setSv(f, "handling_hal", 0);
	return f.dot;
}, true);

rt.type(12050, "/obj/effect/hallucination", "/obj/effect", {
	target: null,
	invisibility: 60,
});

// /obj/effect/hallucination/proc/wake_and_restore  (code/modules/flufftext/Hallucination.dm:61)  may sleep
rt.def("/obj/effect/hallucination/proc/wake_and_restore", function* wake_and_restore(f: Frame) {
	rt.setFv(f, "hal_screwyhud", rt.sv(f, "target"), 0);
	yield* g.callName(f, rt.sv(f, "target"), "SetSleeping", [0]);
	return f.dot;
}, true);

rt.type(12051, "/obj/effect/hallucination/simple", "/obj/effect/hallucination", {
	image_icon: rt.rsc("icons/mob/alien.dmi"),
	image_state: "alienh_pounce",
	px: 0,
	py: 0,
	col_mod: null,
	current_image: null,
	image_layer: 4,
	active: 1,
});

// /obj/effect/hallucination/simple/proc/Initialize  (code/modules/flufftext/Hallucination.dm:75)
rt.def("/obj/effect/hallucination/simple/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", live(f.args[1]));
	rt.setSv(f, "current_image", rt.callSrc(f, "GetImage", []));
	if (!truthy(rt.fv(f, "client", rt.sv(f, "target")))) return f.dot;
	(rt.modField(f, rt.fv(f, "client", rt.sv(f, "target")), "images", rt.sv(f, "current_image"), rt.bitOr));
	return f.dot;
}, false, { args: ["mapload", "T"] });

// /obj/effect/hallucination/simple/proc/GetImage  (code/modules/flufftext/Hallucination.dm:81)
rt.def("/obj/effect/hallucination/simple/proc/GetImage", function GetImage(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	rt.setFv(f, "pixel_x", (I = rt.call(f, P("/proc/image"), null, [null, rt.sv(f, "image_icon"), null, live(f.src), null, rt.sv(f, "image_state"), null, rt.sv(f, "image_layer"), "dir", rt.fv(f, "dir", live(f.src))], rt.Args.Named)), rt.sv(f, "px"));
	rt.setFv(f, "pixel_y", live(I), rt.sv(f, "py"));
	if (truthy(rt.sv(f, "col_mod"))) {
		rt.setFv(f, "color", live(I), rt.sv(f, "col_mod"));
	}
	return live(I);
});

// /obj/effect/hallucination/simple/proc/Show  (code/modules/flufftext/Hallucination.dm:90)
rt.def("/obj/effect/hallucination/simple/proc/Show", function Show(f: Frame, update: Value) {
	f.vars = () => [update];
	if (live(update) === null) {
		update = 1;
	}
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
		rt.callName(f, rt.gv(f, "images", rt.fv(f, "client", rt.sv(f, "target"))), "Remove", [rt.sv(f, "current_image")]);
	}
	if (truthy(live(update))) {
		rt.setSv(f, "current_image", rt.callSrc(f, "GetImage", []));
	}
	if (!truthy(rt.fv(f, "client", rt.sv(f, "target")))) return f.dot;
	(rt.modField(f, rt.fv(f, "client", rt.sv(f, "target")), "images", rt.sv(f, "current_image"), rt.bitOr));
	return f.dot;
});

// /obj/effect/hallucination/simple/proc/update_icon  (code/modules/flufftext/Hallucination.dm:96)
rt.def("/obj/effect/hallucination/simple/proc/update_icon", function update_icon(f: Frame, new_state: Value, new_icon: Value, new_px: Value, new_py: Value) {
	f.vars = () => [new_px, new_py];
	if (live(new_px) === null) {
		new_px = 0;
	}
	if (live(new_py) === null) {
		new_py = 0;
	}
	rt.setSv(f, "image_state", live(new_state));
	if (truthy(live(new_icon))) {
		rt.setSv(f, "image_icon", live(new_icon));
	} else {
		rt.setSv(f, "image_icon", rt.initial(f, live(f.src), "image_icon"));
	}
	rt.setSv(f, "px", live(new_px));
	rt.setSv(f, "py", live(new_py));
	rt.callSrc(f, "Show", []);
	return f.dot;
});

// /obj/effect/hallucination/simple/proc/Moved  (code/modules/flufftext/Hallucination.dm:106)
rt.def("/obj/effect/hallucination/simple/proc/Moved", function Moved(f: Frame, OldLoc: Value, Dir: Value) {
	rt.callSrc(f, "Show", []);
	return f.dot;
});

// /obj/effect/hallucination/simple/proc/Destroy  (code/modules/flufftext/Hallucination.dm:109)  may sleep
rt.def("/obj/effect/hallucination/simple/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
		yield* g.callName(f, rt.gv(f, "images", rt.fv(f, "client", rt.sv(f, "target"))), "Remove", [rt.sv(f, "current_image")]);
	}
	rt.setSv(f, "active", 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(12057, "/obj/effect/hallucination/fake_flood", "/obj/effect/hallucination", {
	flood_images: null,
	flood_turfs: null,
	image_icon: rt.rsc("icons/effects/tile_effects.dmi"),
	image_state: "plasma",
	radius: 0,
	next_expand: 0,
});

// /obj/effect/hallucination/fake_flood/proc/<init>  (code/modules/flufftext/Hallucination.dm:118)
rt.def("/obj/effect/hallucination/fake_flood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "flood_images", rt.list());
	$0 = $0;
	rt.setSv(f, "flood_turfs", rt.list());
	return f.dot;
});

// /obj/effect/hallucination/fake_flood/proc/Initialize  (code/modules/flufftext/Hallucination.dm:126)
rt.def("/obj/effect/hallucination/fake_flood/proc/Initialize", function Initialize(f: Frame) {
	let U: Value = null;
	let $e: any;
	f.vars = () => [U, $e];
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", live(f.args[1]));
	U = null;
	rt.forList(f, 0, rt.call(f, P("/proc/orange"), null, [7, rt.sv(f, "target")]), T("/obj/machinery/atmospherics/components/unary/vent_pump"));
	while (($e = rt.next(f, 0)) !== undefined) {
		U = $e;
		if (!truthy(rt.fv(f, "welded", live(U)))) {
			rt.setFv(f, "loc", live(f.src), rt.fv(f, "loc", live(U)));
			break;
		}
	}
	rt.endFor(f, 0);
	rt.modSrcVar(f, "flood_images", rt.call(f, P("/proc/image"), null, [rt.sv(f, "image_icon"), live(f.src), rt.sv(f, "image_state"), 4]), add);
	rt.modSrcVar(f, "flood_turfs", rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0), add);
	if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
		(rt.modField(f, rt.fv(f, "client", rt.sv(f, "target")), "images", rt.sv(f, "flood_images"), rt.bitOr));
	}
	rt.setSv(f, "next_expand", add(rt.worldTime(f), 20));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, false, { args: ["mapload", "T"] });

// /obj/effect/hallucination/fake_flood/proc/process  (code/modules/flufftext/Hallucination.dm:139)  may sleep
rt.def("/obj/effect/hallucination/fake_flood/proc/process", function* process(f: Frame) {
	if (!rt.le(rt.sv(f, "next_expand"), rt.worldTime(f))) return f.dot;
	rt.incSrcVar(f, "radius", 1, true);
	if (rt.gt(rt.sv(f, "radius"), 10)) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "Expand");
	if ((truthy((rt.isIn(f, rt.getStep(f, rt.sv(f, "target"), 0), rt.sv(f, "flood_turfs")) ? 1 : 0)) && !truthy(rt.fv(f, "internal", rt.sv(f, "target"))))) {
		yield* g.callName(f, rt.sv(f, "target"), "hallucinate", ["fake_alert", "tox_in_air"]);
	}
	rt.setSv(f, "next_expand", add(rt.worldTime(f), 20));
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/hallucination/fake_flood/proc/Expand  (code/modules/flufftext/Hallucination.dm:150)
rt.def("/obj/effect/hallucination/fake_flood/proc/Expand", function Expand(f: Frame) {
	let FT: Value = null, dir: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [FT, dir, _T, $e];
	FT = null;
	rt.forList(f, 0, rt.sv(f, "flood_turfs"), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		FT = $e;
		dir = null;
		rt.forList(f, 1, rt.gl("cardinal"));
		while (($e = rt.next(f, 1)) !== undefined) {
			dir = $e;
			if ((truthy((rt.isIn(f, (_T = rt.getStep(f, live(FT), live(dir))), rt.sv(f, "flood_turfs")) ? 1 : 0)) || !truthy(rt.callName(f, live(FT), "CanAtmosPass", [live(_T)])))) {
				continue;
			}
			rt.modSrcVar(f, "flood_images", rt.call(f, P("/proc/image"), null, [rt.sv(f, "image_icon"), live(_T), rt.sv(f, "image_state"), 4]), add);
			rt.modSrcVar(f, "flood_turfs", live(_T), add);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.fv(f, "client", rt.sv(f, "target")))) return f.dot;
	(rt.modField(f, rt.fv(f, "client", rt.sv(f, "target")), "images", rt.sv(f, "flood_images"), rt.bitOr));
	return f.dot;
});

// /obj/effect/hallucination/fake_flood/proc/Destroy  (code/modules/flufftext/Hallucination.dm:161)  may sleep
rt.def("/obj/effect/hallucination/fake_flood/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "flood_turfs")]);
	rt.setSv(f, "flood_turfs", rt.list());
	if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
		yield* g.callName(f, rt.gv(f, "images", rt.fv(f, "client", rt.sv(f, "target"))), "Remove", [rt.sv(f, "flood_images")]);
	}
	rt.setSv(f, "target", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "flood_images")]);
	rt.setSv(f, "flood_images", rt.list());
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(12052, "/obj/effect/hallucination/simple/xeno", "/obj/effect/hallucination/simple", {
	image_icon: rt.rsc("icons/mob/alien.dmi"),
	image_state: "alienh_pounce",
});

// /obj/effect/hallucination/simple/xeno/proc/Initialize  (code/modules/flufftext/Hallucination.dm:176)
rt.def("/obj/effect/hallucination/simple/xeno/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", fmt("alien hunter (＀)", [rt.call(f, P("/proc/rand"), null, [1, 1000])]));
	return f.dot;
}, false, { args: ["mapload", "T"] });

// /obj/effect/hallucination/simple/xeno/proc/throw_impact  (code/modules/flufftext/Hallucination.dm:180)  may sleep
rt.def("/obj/effect/hallucination/simple/xeno/proc/throw_impact", function* throw_impact(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.srcCall(f, "update_icon", "alienh_pounce");
	if (!(isEqual(live(A), rt.sv(f, "target")) && !isEqual(rt.fv(f, "stat", rt.sv(f, "target")), 2))) return f.dot;
	yield* g.callName(f, rt.sv(f, "target"), "Knockdown", [100]);
	yield* g.callName(f, rt.sv(f, "target"), "visible_message", [fmt("<span class='danger'>＀ flails around wildly.</span>", [rt.sv(f, "target")]), fmt("<span class ='userdanger'>＀ pounces on you!</span>", [rt.sv(f, "name")])]);
	return f.dot;
}, true, { waitfor: false });

rt.type(12058, "/obj/effect/hallucination/xeno_attack", "/obj/effect/hallucination", {
	pump: null,
	xeno: null,
});

// /obj/effect/hallucination/xeno_attack/proc/Initialize  (code/modules/flufftext/Hallucination.dm:191)  may sleep
rt.def("/obj/effect/hallucination/xeno_attack/proc/Initialize", function* Initialize(f: Frame) {
	let U: Value = null, xeno_name: Value = null;
	let $e: any;
	f.vars = () => [U, xeno_name, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", live(f.args[1]));
	U = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [7, rt.sv(f, "target")])), T("/obj/machinery/atmospherics/components/unary/vent_pump"));
	while (($e = rt.next(f, 0)) !== undefined) {
		U = $e;
		if (!truthy(rt.fv(f, "welded", live(U)))) {
			rt.setSv(f, "pump", live(U));
			break;
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "pump"))) {
		rt.setSv(f, "xeno", (yield* g.new_(f, T("/obj/effect/hallucination/simple/xeno"), [rt.fv(f, "loc", rt.sv(f, "pump")), rt.sv(f, "target")])));
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		yield* g.callName(f, rt.sv(f, "xeno"), "update_icon", ["alienh_leap", rt.rsc("icons/mob/alienleap.dmi"), -32, -32]);
		yield* g.callName(f, rt.sv(f, "xeno"), "throw_at", [null, rt.sv(f, "target"), null, 7, null, 1, "spin", 0, "diagonals_first", 1], rt.Args.Named);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		yield* g.callName(f, rt.sv(f, "xeno"), "update_icon", ["alienh_leap", rt.rsc("icons/mob/alienleap.dmi"), -32, -32]);
		yield* g.callName(f, rt.sv(f, "xeno"), "throw_at", [null, rt.sv(f, "pump"), null, 7, null, 1, "spin", 0, "diagonals_first", 1], rt.Args.Named);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		xeno_name = rt.fv(f, "name", rt.sv(f, "xeno"));
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), fmt("<span class='notice'>＀ begins climbing into the ventilation system...</span>", [live(xeno_name)])]);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "xeno")]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), fmt("<span class='notice'>＀ scrambles into the ventilation ducts!</span>", [live(xeno_name)])]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12053, "/obj/effect/hallucination/simple/clown", "/obj/effect/hallucination/simple", {
	image_icon: rt.rsc("icons/mob/animal.dmi"),
	image_state: "clown",
});

// /obj/effect/hallucination/simple/clown/proc/Initialize  (code/modules/flufftext/Hallucination.dm:218)  may sleep
rt.def("/obj/effect/hallucination/simple/clown/proc/Initialize", function* Initialize(f: Frame, mapload: Value, _T: Value, duration: Value) {
	f.vars = () => [mapload, _T, duration];
	yield* g.callSuper(f, [rt.sv(f, "loc"), live(_T)]);
	rt.setSv(f, "name", rt.op(f, "PickUnweighted", [1], [rt.gl("clown_names")]));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), live(duration), 8]);
	return f.dot;
}, true);

rt.type(12059, "/obj/effect/hallucination/oh_yeah", "/obj/effect/hallucination", {
	bubblegum: null,
	fakebroken: null,
	fakerune: null,
});

// /obj/effect/hallucination/oh_yeah/proc/Initialize  (code/modules/flufftext/Hallucination.dm:237)  may sleep
rt.def("/obj/effect/hallucination/oh_yeah/proc/Initialize", function* Initialize(f: Frame) {
	let wall: Value = null, W: Value = null, landing: Value = null, landing_image_turf: Value = null;
	let $e: any;
	f.vars = () => [wall, W, landing, landing_image_turf, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "target", live(f.args[1]));
	wall = null;
	W = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [7, rt.sv(f, "target")])), T("/turf/closed/wall"));
	if (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		wall = live(W);
	}
	rt.endFor(f, 0);
	if (!truthy(live(wall))) {
		return 2;
	}
	rt.setSv(f, "fakebroken", (yield* g.call(f, P("/proc/image"), null, [null, rt.rsc("icons/turf/floors.dmi"), null, live(wall), null, "plating", "layer", 2], rt.Args.Named)));
	landing = rt.getStep(f, rt.sv(f, "target"), 0);
	landing_image_turf = rt.getStep(f, live(landing), 10);
	rt.setSv(f, "fakerune", (yield* g.call(f, P("/proc/image"), null, [null, rt.rsc("icons/effects/96x96.dmi"), null, live(landing_image_turf), null, "landing", "layer", 2.0399999618530273], rt.Args.Named)));
	rt.setFv(f, "override", rt.sv(f, "fakebroken"), 1);
	if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
		(rt.modField(f, rt.fv(f, "client", rt.sv(f, "target")), "images", rt.sv(f, "fakebroken"), rt.bitOr));
		(rt.modField(f, rt.fv(f, "client", rt.sv(f, "target")), "images", rt.sv(f, "fakerune"), rt.bitOr));
	}
	yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [live(wall), rt.rsc("sound/effects/meteorimpact.ogg"), 150, 1]);
	rt.setSv(f, "bubblegum", (yield* g.new_(f, T("/obj/effect/hallucination/simple/bubblegum"), [live(wall), rt.sv(f, "target")])));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/hallucination/oh_yeah/proc/bubble_attack"), live(landing)])), 10]);
	return f.dot;
}, true, { args: ["mapload", "T"] });

// /obj/effect/hallucination/oh_yeah/proc/bubble_attack  (code/modules/flufftext/Hallucination.dm:260)  may sleep
rt.def("/obj/effect/hallucination/oh_yeah/proc/bubble_attack", function* bubble_attack(f: Frame, landing: Value) {
	let charged: Value = null;
	f.vars = () => [landing, charged];
	charged = 0;
	while ((!isEqual(rt.getStep(f, rt.sv(f, "bubblegum"), 0), live(landing)) && truthy(rt.sv(f, "target"))) && !isEqual(rt.fv(f, "stat", rt.sv(f, "target")), 2)) {
		yield* g.callName(f, rt.sv(f, "bubblegum"), "forceMove", [(yield* g.call(f, P("/proc/get_step_towards"), null, [rt.sv(f, "bubblegum"), live(landing)]))]);
		yield* g.callName(f, rt.sv(f, "bubblegum"), "setDir", [rt.getDir(f, rt.sv(f, "bubblegum"), live(landing))]);
		yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [rt.getStep(f, rt.sv(f, "bubblegum"), 0), rt.rsc("sound/effects/meteorimpact.ogg"), 150, 1]);
		yield* g.call(f, P("/proc/shake_camera"), null, [rt.sv(f, "target"), 2, 1]);
		if ((truthy((yield* g.callName(f, rt.sv(f, "bubblegum"), "Adjacent", [rt.sv(f, "target")]))) && !truthy(live(charged)))) {
			charged = 1;
			yield* g.callName(f, rt.sv(f, "target"), "Knockdown", [80]);
			yield* g.callName(f, rt.sv(f, "target"), "adjustStaminaLoss", [40]);
			yield* g.call(f, P("/proc/step_away"), null, [rt.sv(f, "target"), rt.sv(f, "bubblegum")]);
			yield* g.call(f, P("/proc/shake_camera"), null, [rt.sv(f, "target"), 4, 3]);
			yield* g.callName(f, rt.sv(f, "target"), "visible_message", [fmt("<span class='warning'>＀ jumps backwards, falling on the ground!</span>", [rt.sv(f, "target")]), fmt("<span class='userdanger'>＀ slams into you!</span>", [rt.sv(f, "bubblegum")])]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [2]);
	}
	yield* g.call(f, P("/proc/sleep"), null, [30]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

// /obj/effect/hallucination/oh_yeah/proc/Destroy  (code/modules/flufftext/Hallucination.dm:277)  may sleep
rt.def("/obj/effect/hallucination/oh_yeah/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
		yield* g.callName(f, rt.gv(f, "images", rt.fv(f, "client", rt.sv(f, "target"))), "Remove", [rt.sv(f, "fakebroken")]);
		yield* g.callName(f, rt.gv(f, "images", rt.fv(f, "client", rt.sv(f, "target"))), "Remove", [rt.sv(f, "fakerune")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "fakebroken")]);
	rt.setSv(f, "fakebroken", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "fakerune")]);
	rt.setSv(f, "fakerune", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "bubblegum")]);
	rt.setSv(f, "bubblegum", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(12060, "/obj/effect/hallucination/singularity_scare", "/obj/effect/hallucination", {
	s: null,
});

// /obj/effect/hallucination/singularity_scare/proc/Initialize  (code/modules/flufftext/Hallucination.dm:291)  may sleep
rt.def("/obj/effect/hallucination/singularity_scare/proc/Initialize", function* Initialize(f: Frame) {
	let start: Value = null, screen_border: Value = null, i: Value = null;
	f.vars = () => [start, screen_border, i];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", live(f.args[1]));
	start = rt.getStep(f, live(f.args[1]), 0);
	screen_border = rt.op(f, "PickUnweighted", [4], [2, 4, 8, 1]);
	i = null;
	i = 0;
	while (rt.lt(live(i), 11)) {
		start = rt.getStep(f, live(start), live(screen_border));
		i = rt.inc(live(i), 1);
	}
	rt.setSv(f, "s", (yield* g.new_(f, T("/obj/effect/hallucination/simple/singularity"), [live(start), rt.sv(f, "target")])));
	rt.setFv(f, "parent", rt.sv(f, "s"), live(f.src));
	i = null;
	i = 0;
	while (rt.lt(live(i), 11)) {
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		rt.setFv(f, "loc", rt.sv(f, "s"), rt.getStep(f, rt.getStep(f, rt.sv(f, "s"), 0), rt.getDir(f, rt.sv(f, "s"), rt.sv(f, "target"))));
		yield* g.callName(f, rt.sv(f, "s"), "Show", []);
		yield* g.callName(f, rt.sv(f, "s"), "Eat", []);
		i = rt.inc(live(i), 1);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "s")]);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12056, "/obj/effect/hallucination/simple/singularity", "/obj/effect/hallucination/simple", {
	parent: null,
	image_icon: rt.rsc("icons/effects/224x224.dmi"),
	image_state: "singularity_s7",
	image_layer: 11,
	px: -96,
	py: -96,
});

// /obj/effect/hallucination/simple/singularity/proc/Eat  (code/modules/flufftext/Hallucination.dm:315)  may sleep
rt.def("/obj/effect/hallucination/simple/singularity/proc/Eat", function* Eat(f: Frame, OldLoc: Value, Dir: Value) {
	let target_dist: Value = null;
	f.vars = () => [OldLoc, Dir, target_dist];
	if (!rt.le((target_dist = (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")]))), 3)) return f.dot;
	rt.setFv(f, "hal_screwyhud", rt.sv(f, "target"), 1);
	yield* g.callName(f, rt.sv(f, "target"), "SetUnconscious", [160]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "parent"), P("/obj/effect/hallucination/proc/wake_and_restore")])), (yield* g.call(f, P("/proc/rand"), null, [30, 50]))]);
	return f.dot;
}, true);

rt.type(12061, "/obj/effect/hallucination/battle", "/obj/effect/hallucination", {});

// /obj/effect/hallucination/battle/proc/Initialize  (code/modules/flufftext/Hallucination.dm:324)  may sleep
rt.def("/obj/effect/hallucination/battle/proc/Initialize", function* Initialize(f: Frame) {
	let hits: Value = null, i: Value = null;
	let $0: any;
	f.vars = () => [hits, i, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", live(f.args[1]));
	hits = (yield* g.call(f, P("/proc/rand"), null, [3, 6]));
	$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 5]));
	if ($0 === 1) {
		i = null;
		i = 0;
		while (rt.lt(live(i), live(hits))) {
			yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, rt.rsc("sound/weapons/laser.ogg"), 25, 1]);
			if (truthy(rt.op(f, "Prob", [], [75]))) {
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "target"), P("/mob/proc/playsound_local"), null, rt.rsc("sound/weapons/sear.ogg"), 25, 1])), (yield* g.call(f, P("/proc/rand"), null, [10, 20]))]);
			} else {
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "target"), P("/mob/proc/playsound_local"), null, rt.rsc("sound/weapons/effects/searwall.ogg"), 25, 1])), (yield* g.call(f, P("/proc/rand"), null, [10, 20]))]);
			}
			yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [4, 12]))]);
			i = rt.inc(live(i), 1);
		}
		yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, (yield* g.call(f, P("/proc/get_sfx"), null, ["bodyfall"])), 25, 1]);
	} else if ($0 === 2) {
		yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, rt.rsc("sound/weapons/saberon.ogg"), 15, 1]);
		i = null;
		i = 0;
		while (rt.lt(live(i), live(hits))) {
			yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, rt.rsc("sound/weapons/blade1.ogg"), 25, 1]);
			yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [8, 16]))]);
			i = rt.inc(live(i), 1);
		}
		yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, (yield* g.call(f, P("/proc/get_sfx"), null, ["bodyfall"])), 25, 1]);
		yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, rt.rsc("sound/weapons/saberoff.ogg"), 15, 1]);
	} else if ($0 === 3) {
		i = null;
		i = 0;
		while (rt.lt(live(i), live(hits))) {
			yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, (yield* g.call(f, P("/proc/get_sfx"), null, ["gunshot"])), 25]);
			if (truthy(rt.op(f, "Prob", [], [75]))) {
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "target"), P("/mob/proc/playsound_local"), null, rt.rsc("sound/weapons/pierce.ogg"), 25, 1])), (yield* g.call(f, P("/proc/rand"), null, [10, 20]))]);
			} else {
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "target"), P("/mob/proc/playsound_local"), null, "ricochet", 25, 1])), (yield* g.call(f, P("/proc/rand"), null, [10, 20]))]);
			}
			yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [4, 12]))]);
			i = rt.inc(live(i), 1);
		}
		yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, (yield* g.call(f, P("/proc/get_sfx"), null, ["bodyfall"])), 25, 1]);
	} else if ($0 === 4) {
		yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, rt.rsc("sound/weapons/egloves.ogg"), 40, 1]);
		yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, (yield* g.call(f, P("/proc/get_sfx"), null, ["bodyfall"])), 25, 1]);
		yield* g.call(f, P("/proc/sleep"), null, [20]);
		yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, rt.rsc("sound/weapons/cablecuff.ogg"), 15, 1]);
	} else if ($0 === 5) {
		i = null;
		i = 0;
		while (rt.lt(live(i), live(hits))) {
			yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [null, rt.rsc("sound/items/timer.ogg"), 25, 1]);
			yield* g.call(f, P("/proc/sleep"), null, [15]);
			i = rt.inc(live(i), 1);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12062, "/obj/effect/hallucination/items_other", "/obj/effect/hallucination", {});

// /obj/effect/hallucination/items_other/proc/Initialize  (code/modules/flufftext/Hallucination.dm:367)  may sleep
rt.def("/obj/effect/hallucination/items_other/proc/Initialize", function* Initialize(f: Frame) {
	let item: Value = null, image_file: Value = null, A: Value = null, H: Value = null, free_hand: Value = null;
	let $0: any, $e: any;
	f.vars = () => [item, image_file, A, H, free_hand, $0, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", live(f.args[1]));
	item = rt.op(f, "PickUnweighted", [1], [rt.list("esword", "dual_esword", "stunpaper", "clockspear", "ttv", "flash", "armblade")]);
	image_file = null;
	A = null;
	H = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [7, rt.sv(f, "target")])), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (!isEqual(live(H), rt.sv(f, "target"))) {
			if (truthy((free_hand = (yield* g.callName(f, live(H), "get_empty_held_index_for_side", ["side", "left"], rt.Args.Named))))) {
				image_file = rt.rsc("icons/mob/inhands/items_lefthand.dmi");
			} else {
				if (truthy((free_hand = (yield* g.callName(f, live(H), "get_empty_held_index_for_side", ["side", "right"], rt.Args.Named))))) {
					image_file = rt.rsc("icons/mob/inhands/items_righthand.dmi");
				}
			}
			if (truthy(live(image_file))) {
				$0 = live(item);
				if ($0 === "esword") {
					yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [live(H), rt.rsc("sound/weapons/saberon.ogg"), 35, 1]);
					A = (yield* g.call(f, P("/proc/image"), null, [null, live(image_file), null, live(H), null, "swordred", "layer", 4.099999904632568], rt.Args.Named));
				} else if ($0 === "dual_esword") {
					yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [live(H), rt.rsc("sound/weapons/saberon.ogg"), 35, 1]);
					A = (yield* g.call(f, P("/proc/image"), null, [null, live(image_file), null, live(H), null, "dualsaberred1", "layer", 4.099999904632568], rt.Args.Named));
				} else if ($0 === "stunpaper") {
					rt.setFv(f, "color", (A = (yield* g.call(f, P("/proc/image"), null, [null, live(image_file), null, live(H), null, "paper", "layer", 4.099999904632568], rt.Args.Named))), "#ff0000");
				} else if ($0 === "clockspear") {
					A = (yield* g.call(f, P("/proc/image"), null, [null, live(image_file), null, live(H), null, "ratvarian_spear", "layer", 4.099999904632568], rt.Args.Named));
				} else if ($0 === "ttv") {
					A = (yield* g.call(f, P("/proc/image"), null, [null, live(image_file), null, live(H), null, "ttv", "layer", 4.099999904632568], rt.Args.Named));
				} else if ($0 === "flash") {
					A = (yield* g.call(f, P("/proc/image"), null, [null, live(image_file), null, live(H), null, "flashtool", "layer", 4.099999904632568], rt.Args.Named));
				} else if ($0 === "armblade") {
					A = (yield* g.call(f, P("/proc/image"), null, [null, live(image_file), null, live(H), null, "arm_blade", "layer", 4.099999904632568], rt.Args.Named));
				}
				if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
					(rt.modField(f, rt.fv(f, "client", rt.sv(f, "target")), "images", live(A), rt.bitOr));
					yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [150, 250]))]);
					if ((isEqual(live(item), "esword") || isEqual(live(item), "dual_esword"))) {
						yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [live(H), rt.rsc("sound/weapons/saberoff.ogg"), 35, 1]);
					}
					yield* g.callName(f, rt.gv(f, "images", rt.fv(f, "client", rt.sv(f, "target"))), "Remove", [live(A)]);
				}
				break;
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12063, "/obj/effect/hallucination/delusion", "/obj/effect/hallucination", {
	delusions: null,
});

// /obj/effect/hallucination/delusion/proc/<init>  (code/modules/flufftext/Hallucination.dm:410)
rt.def("/obj/effect/hallucination/delusion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "delusions", rt.list());
	return f.dot;
});

// /obj/effect/hallucination/delusion/proc/Initialize  (code/modules/flufftext/Hallucination.dm:413)  may sleep
rt.def("/obj/effect/hallucination/delusion/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null, kind: Value = null, H: Value = null;
	let $0: any, $e: any;
	f.vars = () => [A, kind, H, $0, $e];
	if (live(f.args[2]) === null) {
		f.args[2] = null;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 300;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = null;
	}
	if (live(f.args[6]) === null) {
		f.args[6] = null;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "target", live(f.args[1]));
	A = null;
	if (truthy(live(f.args[2]))) {
		$0 = live(f.args[2]);
	} else {
		$0 = rt.op(f, "PickUnweighted", [6], ["clown", "corgi", "carp", "skeleton", "demon", "zombie"]);
	}
	kind = $0;
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (isEqual(live(H), rt.sv(f, "target"))) {
			continue;
		}
		if ((truthy(live(f.args[4])) && truthy((rt.isIn(f, live(H), (yield* g.call(f, P("/proc/view"), null, [rt.sv(f, "target")]))) ? 1 : 0)))) {
			continue;
		}
		$0 = live(kind);
		if ($0 === "clown") {
			A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/animal.dmi"), live(H), "clown"]));
		} else if ($0 === "carp") {
			A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/animal.dmi"), live(H), "carp"]));
		} else if ($0 === "corgi") {
			A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/pets.dmi"), live(H), "corgi"]));
		} else if ($0 === "skeleton") {
			A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/human.dmi"), live(H), "skeleton"]));
		} else if ($0 === "zombie") {
			A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/human.dmi"), live(H), "zombie"]));
		} else if ($0 === "demon") {
			A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/mob.dmi"), live(H), "daemon"]));
		} else if ($0 === "custom") {
			A = (yield* g.call(f, P("/proc/image"), null, [live(f.args[6]), live(H), live(f.args[5])]));
		}
		rt.setFv(f, "override", live(A), 1);
		if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
			(rt.modSrcVar(f, "delusions", live(A), rt.bitOr));
			(rt.modField(f, rt.fv(f, "client", rt.sv(f, "target")), "images", live(A), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), live(f.args[3]), 8]);
	return f.dot;
}, true, { args: ["mapload", "T", "force_kind", "duration", "skip_nearby", "custom_icon", "custom_icon_file"] });

// /obj/effect/hallucination/delusion/proc/Destroy  (code/modules/flufftext/Hallucination.dm:444)  may sleep
rt.def("/obj/effect/hallucination/delusion/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "delusions"), T("/image"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
			yield* g.callName(f, rt.gv(f, "images", rt.fv(f, "client", rt.sv(f, "target"))), "Remove", [live(I)]);
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(12064, "/obj/effect/hallucination/self_delusion", "/obj/effect/hallucination", {
	delusion: null,
});

// /obj/effect/hallucination/self_delusion/proc/Initialize  (code/modules/flufftext/Hallucination.dm:453)  may sleep
rt.def("/obj/effect/hallucination/self_delusion/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null, kind: Value = null;
	let $0: any;
	f.vars = () => [A, kind, $0];
	if (live(f.args[2]) === null) {
		f.args[2] = null;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 300;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = null;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = null;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", live(f.args[1]));
	A = null;
	if (truthy(live(f.args[2]))) {
		$0 = live(f.args[2]);
	} else {
		$0 = rt.op(f, "PickUnweighted", [7], ["clown", "corgi", "carp", "skeleton", "demon", "zombie", "robot"]);
	}
	$0 = (kind = $0);
	if ($0 === "clown") {
		A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/animal.dmi"), rt.sv(f, "target"), "clown"]));
	} else if ($0 === "carp") {
		A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/animal.dmi"), rt.sv(f, "target"), "carp"]));
	} else if ($0 === "corgi") {
		A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/pets.dmi"), rt.sv(f, "target"), "corgi"]));
	} else if ($0 === "skeleton") {
		A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/human.dmi"), rt.sv(f, "target"), "skeleton"]));
	} else if ($0 === "zombie") {
		A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/human.dmi"), rt.sv(f, "target"), "zombie"]));
	} else if ($0 === "demon") {
		A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/mob.dmi"), rt.sv(f, "target"), "daemon"]));
	} else if ($0 === "robot") {
		A = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/robots.dmi"), rt.sv(f, "target"), "robot"]));
		yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [rt.sv(f, "target"), rt.rsc("sound/voice/liveagain.ogg"), 75, 1]);
	} else if ($0 === "custom") {
		A = (yield* g.call(f, P("/proc/image"), null, [live(f.args[5]), rt.sv(f, "target"), live(f.args[4])]));
	}
	rt.setFv(f, "override", live(A), 1);
	if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), "<span class='italics'>...wabbajack...wabbajack...</span>"]);
		yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [rt.sv(f, "target"), rt.rsc("sound/magic/staff_change.ogg"), 50, 1, -1]);
		rt.setSv(f, "delusion", live(A));
		(rt.modField(f, rt.fv(f, "client", rt.sv(f, "target")), "images", live(A), rt.bitOr));
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), live(f.args[3]), 8]);
	return f.dot;
}, true, { args: ["mapload", "T", "force_kind", "duration", "custom_icon", "custom_icon_file"] });

// /obj/effect/hallucination/self_delusion/proc/Destroy  (code/modules/flufftext/Hallucination.dm:484)  may sleep
rt.def("/obj/effect/hallucination/self_delusion/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
		yield* g.callName(f, rt.gv(f, "images", rt.fv(f, "client", rt.sv(f, "target"))), "Remove", [rt.sv(f, "delusion")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(12065, "/obj/effect/hallucination/fakeattacker", "/obj/effect/hallucination", {});

// /obj/effect/hallucination/fakeattacker/proc/Initialize  (code/modules/flufftext/Hallucination.dm:489)  may sleep
rt.def("/obj/effect/hallucination/fakeattacker/proc/Initialize", function* Initialize(f: Frame) {
	let clone: Value = null, clone_weapon: Value = null, H: Value = null, F: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [clone, clone_weapon, H, F, I, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", live(f.args[1]));
	clone = null;
	clone_weapon = null;
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if ((truthy(rt.fv(f, "stat", live(H))) || truthy(rt.fv(f, "lying", live(H))))) {
			continue;
		}
		clone = live(H);
		break;
	}
	rt.endFor(f, 0);
	if (!truthy(live(clone))) {
		return live(f.dot);
	}
	F = (yield* g.new_(f, T("/obj/effect/fake_attacker"), [rt.getStep(f, rt.sv(f, "target"), 0), rt.sv(f, "target")]));
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(clone)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.locateIn(f, live(I), rt.gl("non_fakeattack_weapons")))) {
			clone_weapon = rt.fv(f, "name", live(I));
			rt.setFv(f, "weap", live(F), live(I));
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "name", live(F), rt.fv(f, "name", live(clone)));
	rt.setFv(f, "my_target", live(F), rt.sv(f, "target"));
	rt.setFv(f, "weapon_name", live(F), live(clone_weapon));
	rt.setFv(f, "left", live(F), (yield* g.call(f, P("/proc/image"), null, [null, live(clone), "dir", 8], rt.Args.Named)));
	rt.setFv(f, "right", live(F), (yield* g.call(f, P("/proc/image"), null, [null, live(clone), "dir", 4], rt.Args.Named)));
	rt.setFv(f, "up", live(F), (yield* g.call(f, P("/proc/image"), null, [null, live(clone), "dir", 1], rt.Args.Named)));
	rt.setFv(f, "down", live(F), (yield* g.call(f, P("/proc/image"), null, [null, live(clone), "dir", 2], rt.Args.Named)));
	yield* g.callName(f, live(F), "updateimage", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12069, "/obj/effect/fake_attacker", "/obj/effect", {
	my_target: null,
	weapon_name: null,
	weap: null,
	stand_icon: null,
	currentimage: null,
	base: null,
	skin_tone: null,
	clone: null,
	left: null,
	right: null,
	up: null,
	collapse: null,
	down: null,
	anchored: 1,
	icon: null,
	icon_state: null,
	name: "",
	desc: "",
	density: 0,
	opacity: 0,
	obj_integrity: 100,
});

// /obj/effect/fake_attacker/proc/attackby  (code/modules/flufftext/Hallucination.dm:563)  may sleep
rt.def("/obj/effect/fake_attacker/proc/attackby", function* attackby(f: Frame, _P: Value, user: Value, params: Value) {
	f.vars = () => [_P, user, params];
	yield* g.call(f, P("/proc/step_away"), null, [live(f.src), rt.sv(f, "my_target"), 2]);
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "do_attack_animation", [live(f.src)]);
	yield* g.callName(f, rt.sv(f, "my_target"), "playsound_local", [live(f.src), rt.fv(f, "hitsound", live(_P)), 1]);
	yield* g.callName(f, rt.sv(f, "my_target"), "visible_message", [fmt("<span class='danger'>＀ flails around wildly.</span>", [rt.sv(f, "my_target")]), fmt("<span class='danger'>＀ has attacked ＀!</span>", [rt.sv(f, "my_target"), live(f.src)])]);
	(rt.modSrcVar(f, "obj_integrity", rt.fv(f, "force", live(_P)), subtract));
	return f.dot;
}, true);

// /obj/effect/fake_attacker/proc/Crossed  (code/modules/flufftext/Hallucination.dm:573)  may sleep
rt.def("/obj/effect/fake_attacker/proc/Crossed", function* Crossed(f: Frame, M: Value, somenumber: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [M, somenumber, O, $e];
	if (!isEqual(live(M), rt.sv(f, "my_target"))) return f.dot;
	yield* g.call(f, P("/proc/step_away"), null, [live(f.src), rt.sv(f, "my_target"), 2]);
	if (!truthy(rt.op(f, "Prob", [], [30]))) return f.dot;
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oviewers"), null, [rt.fv(f, "view", rt.world()), rt.sv(f, "my_target")])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(O), fmt("<span class='danger'>＀ stumbles around.</span>", [rt.sv(f, "my_target")])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/fake_attacker/proc/Initialize  (code/modules/flufftext/Hallucination.dm:580)  may sleep
rt.def("/obj/effect/fake_attacker/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "my_target", live(f.args[1]));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 300, 8]);
	yield* g.call(f, P("/proc/step_away"), null, [live(f.src), rt.sv(f, "my_target"), 2]);
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/effect/fake_attacker/proc/attack_loop")]);
	return f.dot;
}, true, { args: ["mapload", "T"] });

// /obj/effect/fake_attacker/proc/updateimage  (code/modules/flufftext/Hallucination.dm:589)
rt.def("/obj/effect/fake_attacker/proc/updateimage", function updateimage(f: Frame) {
	if (isEqual(rt.fv(f, "dir", live(f.src)), 1)) {
		rt.del(f, rt.fv(f, "currentimage", live(f.src)));
		rt.setFv(f, "currentimage", live(f.src), rt.new_(f, T("/image"), [rt.sv(f, "up"), live(f.src)]));
	} else {
		if (isEqual(rt.fv(f, "dir", live(f.src)), 2)) {
			rt.del(f, rt.fv(f, "currentimage", live(f.src)));
			rt.setFv(f, "currentimage", live(f.src), rt.new_(f, T("/image"), [rt.sv(f, "down"), live(f.src)]));
		} else {
			if (isEqual(rt.fv(f, "dir", live(f.src)), 4)) {
				rt.del(f, rt.fv(f, "currentimage", live(f.src)));
				rt.setFv(f, "currentimage", live(f.src), rt.new_(f, T("/image"), [rt.sv(f, "right"), live(f.src)]));
			} else {
				if (isEqual(rt.fv(f, "dir", live(f.src)), 8)) {
					rt.del(f, rt.fv(f, "currentimage", live(f.src)));
					rt.setFv(f, "currentimage", live(f.src), rt.new_(f, T("/image"), [rt.sv(f, "left"), live(f.src)]));
				}
			}
		}
	}
	rt.op(f, "OutputReference", [rt.R.srcVar("my_target")], [rt.sv(f, "currentimage")], false);
	return f.dot;
});

// /obj/effect/fake_attacker/proc/attack_loop  (code/modules/flufftext/Hallucination.dm:606)  may sleep
rt.def("/obj/effect/fake_attacker/proc/attack_loop", function* attack_loop(f: Frame) {
	while (true) {
		yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [5, 10]))]);
		if ((rt.lt(rt.sv(f, "obj_integrity"), 0) || truthy(rt.fv(f, "stat", rt.sv(f, "my_target"))))) {
			yield* g.srcCall(f, "collapse");
			continue;
		}
		if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "my_target")])), 1)) {
			yield* g.callName(f, live(f.src), "setDir", [rt.getDir(f, live(f.src), rt.sv(f, "my_target"))]);
			yield* g.call(f, P("/proc/step_towards"), null, [live(f.src), rt.sv(f, "my_target")]);
			yield* g.srcCall(f, "updateimage");
		} else {
			if (truthy(rt.op(f, "Prob", [], [15]))) {
				if (truthy(rt.sv(f, "weapon_name"))) {
					yield* g.callName(f, rt.sv(f, "my_target"), "playsound_local", [rt.sv(f, "my_target"), rt.fv(f, "hitsound", rt.sv(f, "weap")), (yield* g.callName(f, rt.sv(f, "weap"), "get_clamped_volume", [])), 1]);
					yield* g.callName(f, rt.sv(f, "my_target"), "show_message", [fmt("<span class='danger'>＀ has attacked ＀ with ＀!</span>", [rt.fv(f, "name", live(f.src)), rt.sv(f, "my_target"), rt.sv(f, "weapon_name")]), 1]);
					rt.modField(f, rt.sv(f, "my_target"), "staminaloss", 30, add);
					if (truthy(rt.op(f, "Prob", [], [20]))) {
						yield* g.callName(f, rt.sv(f, "my_target"), "blur_eyes", [3]);
					}
					if (truthy(rt.op(f, "Prob", [], [33]))) {
						if (!truthy(rt.locateIn(f, T("/obj/effect/overlay"), rt.fv(f, "loc", rt.sv(f, "my_target"))))) {
							yield* g.srcCall(f, "fake_blood", rt.sv(f, "my_target"));
						}
					}
				} else {
					yield* g.callName(f, rt.sv(f, "my_target"), "playsound_local", [rt.sv(f, "my_target"), rt.op(f, "PickUnweighted", [4], [rt.rsc("sound/weapons/punch1.ogg"), rt.rsc("sound/weapons/punch2.ogg"), rt.rsc("sound/weapons/punch3.ogg"), rt.rsc("sound/weapons/punch4.ogg")]), 25, 1, -1]);
					yield* g.callName(f, rt.sv(f, "my_target"), "show_message", [fmt("<span class='userdanger'>＀ has punched ＀!</span>", [rt.fv(f, "name", live(f.src)), rt.sv(f, "my_target")]), 1]);
					rt.modField(f, rt.sv(f, "my_target"), "staminaloss", 30, add);
					if (truthy(rt.op(f, "Prob", [], [33]))) {
						if (!truthy(rt.locateIn(f, T("/obj/effect/overlay"), rt.fv(f, "loc", rt.sv(f, "my_target"))))) {
							yield* g.srcCall(f, "fake_blood", rt.sv(f, "my_target"));
						}
					}
				}
			}
		}
		if (truthy(rt.op(f, "Prob", [], [15]))) {
			yield* g.call(f, P("/proc/step_away"), null, [live(f.src), rt.sv(f, "my_target"), 2]);
		}
	}
	return f.dot;
}, true);

// /obj/effect/fake_attacker/proc/collapse  (code/modules/flufftext/Hallucination.dm:638)  may sleep
rt.def("/obj/effect/fake_attacker/proc/collapse", function* collapse(f: Frame) {
	rt.setSv(f, "collapse", 1);
	yield* g.srcCall(f, "updateimage");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/effect/fake_attacker/proc/fake_blood  (code/modules/flufftext/Hallucination.dm:642)  may sleep
rt.def("/obj/effect/fake_attacker/proc/fake_blood", function* fake_blood(f: Frame, target: Value) {
	let O: Value = null, I: Value = null;
	f.vars = () => [target, O, I];
	rt.setFv(f, "name", (O = (yield* g.new_(f, T("/obj/effect/overlay"), [rt.fv(f, "loc", live(target))]))), "blood");
	rt.op(f, "Output", [], [live(target), (I = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/effects/blood.dmi"), live(O), fmt("floor＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 7]))]), rt.fv(f, "dir", live(O)), 1])))], false);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(O)])), 300, 8]);
	return f.dot;
}, true);

rt.type(12066, "/obj/effect/hallucination/bolts", "/obj/effect/hallucination", {
	doors: null,
});

// /obj/effect/hallucination/bolts/proc/<init>  (code/modules/flufftext/Hallucination.dm:650)
rt.def("/obj/effect/hallucination/bolts/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "doors", rt.list());
	return f.dot;
});

// /obj/effect/hallucination/bolts/proc/Initialize  (code/modules/flufftext/Hallucination.dm:653)  may sleep
rt.def("/obj/effect/hallucination/bolts/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null, count: Value = null, A: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [I, count, A, B, $e];
	if (live(f.args[2]) === null) {
		f.args[2] = -1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", live(f.args[1]));
	I = null;
	count = 0;
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [7, rt.sv(f, "target")])), T("/obj/machinery/door/airlock"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((rt.gt(live(count), live(f.args[2])) && rt.gt(live(f.args[2]), 0))) {
			break;
		}
		count = rt.inc(live(count), 1);
		rt.modSrcVar(f, "doors", (I = (yield* g.call(f, P("/proc/image"), null, [null, rt.fv(f, "overlays_file", live(A)), null, rt.getStep(f, live(A), 0), null, "lights_bolts", "layer", add(rt.fv(f, "layer", live(A)), 0.10000000149011612)], rt.Args.Named))), add);
		if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
			(rt.modField(f, rt.fv(f, "client", rt.sv(f, "target")), "images", live(I), rt.bitOr));
			yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [rt.getStep(f, live(A), 0), rt.rsc("sound/machines/boltsdown.ogg"), 30, 0, 3]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [6, 12]))]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [100]);
	B = null;
	rt.forList(f, 0, rt.sv(f, "doors"), T("/image"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
			yield* g.callName(f, rt.gv(f, "images", rt.fv(f, "client", rt.sv(f, "target"))), "Remove", [live(B)]);
			yield* g.callName(f, rt.sv(f, "target"), "playsound_local", [rt.getStep(f, live(B), 0), rt.rsc("sound/machines/boltsup.ogg"), 30, 0, 3]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [6, 12]))]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload", "T", "door_number"] });

rt.type(12067, "/obj/effect/hallucination/whispers", "/obj/effect/hallucination", {});

// /obj/effect/hallucination/whispers/proc/Initialize  (code/modules/flufftext/Hallucination.dm:678)  may sleep
rt.def("/obj/effect/hallucination/whispers/proc/Initialize", function* Initialize(f: Frame) {
	let speak_messages: Value = null, radio_messages: Value = null, people: Value = null, person: Value = null, understood_language: Value = null, H: Value = null, speech_overlay: Value = null, humans: Value = null, H_6: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $e: any;
	f.vars = () => [speak_messages, radio_messages, people, person, understood_language, H, speech_overlay, humans, H_6, $0, $1, $2, $3, $4, $5, $6, $7, $8, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", live(f.args[1]));
	speak_messages = rt.list("I'm watching you...", fmt("＀!", [(yield* g.callName(f, rt.sv(f, "target"), "first_name", []))]), "Get out!", "Kchck-Chkck? Kchchck!", "Did you hear that?", "What did you do ?", "Why?", "Give me that!", "HELP!!", "EI NATH!!", "RUN!!", "Kill me!", "O bidai nabora se'sma!", fmt("＀", [(yield* g.call(f, P("/proc/text2ratvar"), null, ["Divinity, grant..."]))]));
	$0 = "Xenos!";
	$1 = "Singularity loose!";
	$2 = "Comms down!";
	$3 = "They are arming the nuke!";
	$4 = "They butchered Ian!";
	$5 = "H-help!";
	$6 = rt.op(f, "PickUnweighted", [9], ["Cult", "Wizard", "Ling", "Ops", "Revenant", "Murderer", "Harm", "I hear flashing", "Help"]);
	$7 = rt.op(f, "PickUnweighted", [1], [rt.gl("teleportlocs")]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		$8 = "!";
	} else {
		$8 = "!!";
	}
	radio_messages = rt.list($0, $1, $2, $3, $4, $5, fmt("＀ in ＀＀", [$6, $7, $8]), fmt("Where's ＀?", [(yield* g.callName(f, rt.sv(f, "target"), "first_name", []))]), "Call the shuttle!", "AI rogue!!");
	people = rt.list();
	person = null;
	understood_language = (yield* g.callName(f, rt.sv(f, "target"), "get_random_understood_language", []));
	H = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [rt.sv(f, "target")])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (isEqual(live(H), rt.sv(f, "target"))) {
			continue;
		}
		if (!truthy(live(person))) {
			person = live(H);
		} else {
			if (rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "target"), live(H)])), (yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "target"), live(person)])))) {
				person = live(H);
			}
		}
		people = rt.modify(live(people), live(H), add);
	}
	rt.endFor(f, 0);
	if (truthy(live(person))) {
		speech_overlay = (yield* g.call(f, P("/proc/image"), null, [null, rt.rsc("icons/mob/talk.dmi"), null, live(person), null, "default0", "layer", 4.099999904632568], rt.Args.Named));
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), (yield* g.callName(f, rt.sv(f, "target"), "compose_message", [live(person), live(understood_language), rt.op(f, "PickUnweighted", [1], [live(speak_messages)]), null, (yield* g.callName(f, live(person), "get_spans", []))]))]);
		if (truthy(rt.fv(f, "client", rt.sv(f, "target")))) {
			(rt.modField(f, rt.fv(f, "client", rt.sv(f, "target")), "images", live(speech_overlay), rt.bitOr));
			yield* g.call(f, P("/proc/sleep"), null, [30]);
			yield* g.callName(f, rt.gv(f, "images", rt.fv(f, "client", rt.sv(f, "target"))), "Remove", [live(speech_overlay)]);
		}
	} else {
		humans = rt.list();
		H_6 = null;
		rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H_6 = $e;
			humans = rt.modify(live(humans), live(H_6), add);
		}
		rt.endFor(f, 0);
		person = rt.op(f, "PickUnweighted", [1], [live(humans)]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), (yield* g.callName(f, rt.sv(f, "target"), "compose_message", [live(person), live(understood_language), rt.op(f, "PickUnweighted", [1], [live(radio_messages)]), "1459", (yield* g.callName(f, live(person), "get_spans", []))]))]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12068, "/obj/effect/hallucination/message", "/obj/effect/hallucination", {});

// /obj/effect/hallucination/message/proc/Initialize  (code/modules/flufftext/Hallucination.dm:713)  may sleep
rt.def("/obj/effect/hallucination/message/proc/Initialize", function* Initialize(f: Frame) {
	let chosen: Value = null;
	f.vars = () => [chosen];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", live(f.args[1]));
	chosen = rt.op(f, "PickUnweighted", [11], ["<span class='userdanger'>The light burns you!</span>", "<span class='danger'>You don't feel like yourself.</span>", fmt("<span class='userdanger'>Unknown has punched ＀!</span>", [rt.sv(f, "target")]), "<span class='notice'>You hear something squeezing through the ducts...</span>", "<span class='notice'>You hear a distant scream.</span>", "<span class='notice'>You feel invincible, nothing can hurt you!</span>", "<span class='warning'>You feel a tiny prick!</span>", fmt("<B>＀</B> sneezes.", [rt.sv(f, "target")]), "<span class='warning'>You feel faint.</span>", fmt("<span class='noticealien'>You hear a strange, alien voice in your head...</span>＀", [rt.op(f, "PickUnweighted", [2], ["Hiss", "Ssss"])]), "<span class='notice'>You can see...everything!</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), live(chosen)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload", "T"] });

// /mob/living/carbon/proc/hallucinate  (code/modules/flufftext/Hallucination.dm:731)  may sleep
rt.def("/mob/living/carbon/proc/hallucinate", function* hallucinate(f: Frame, hal_type: Value, specific: Value) {
	let creepyasssounds: Value = null, i: Value = null, alert_type: Value = null, l_hand: Value = null, r_hand: Value = null, l: Value = null, r: Value = null, slots_free: Value = null, H: Value = null, possible_points: Value = null, F: Value = null, target: Value = null, area: Value = null, dead_people: Value = null, G: Value = null, fakemob: Value = null, body: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $e: any;
	f.vars = () => [hal_type, specific, creepyasssounds, i, alert_type, l_hand, r_hand, l, r, slots_free, H, possible_points, F, target, area, dead_people, G, fakemob, body, M, $0, $1, $2, $3, $4, $5, $6, $e];
	$0 = live(hal_type);
	if ($0 === "xeno") {
		yield* g.new_(f, T("/obj/effect/hallucination/xeno_attack"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "singulo") {
		yield* g.new_(f, T("/obj/effect/hallucination/singularity_scare"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "koolaid") {
		yield* g.new_(f, T("/obj/effect/hallucination/oh_yeah"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "battle") {
		yield* g.new_(f, T("/obj/effect/hallucination/battle"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "flood") {
		yield* g.new_(f, T("/obj/effect/hallucination/fake_flood"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "delusion") {
		yield* g.new_(f, T("/obj/effect/hallucination/delusion"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "self_delusion") {
		yield* g.new_(f, T("/obj/effect/hallucination/self_delusion"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "fake") {
		yield* g.new_(f, T("/obj/effect/hallucination/fakeattacker"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "bolts") {
		yield* g.new_(f, T("/obj/effect/hallucination/bolts"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "bolts_minor") {
		yield* g.new_(f, T("/obj/effect/hallucination/bolts"), [rt.fv(f, "loc", live(f.src)), live(f.src), (yield* g.call(f, P("/proc/rand"), null, [1, 2]))]);
	} else if ($0 === "whispers") {
		yield* g.new_(f, T("/obj/effect/hallucination/whispers"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "message") {
		yield* g.new_(f, T("/obj/effect/hallucination/message"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "items_other") {
		yield* g.new_(f, T("/obj/effect/hallucination/items_other"), [rt.fv(f, "loc", live(f.src)), live(f.src)]);
	} else if ($0 === "sounds") {
		$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 20]));
		if ($0 === 1) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/machines/airlock.ogg"), 15, 1);
		} else if ($0 === 2) {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/effects/explosion1.ogg"), 50, 1);
			} else {
				yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/effects/explosion2.ogg"), 50, 1);
			}
		} else if ($0 === 3) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/effects/explosionfar.ogg"), 50, 1);
		} else if ($0 === 4) {
			yield* g.srcCall(f, "playsound_local", null, rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/effects/glassbr1.ogg"), rt.rsc("sound/effects/glassbr2.ogg"), rt.rsc("sound/effects/glassbr3.ogg")]), 50, 1);
		} else if ($0 === 5) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/weapons/ring.ogg"), 35);
			yield* g.call(f, P("/proc/sleep"), null, [15]);
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/weapons/ring.ogg"), 35);
			yield* g.call(f, P("/proc/sleep"), null, [15]);
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/weapons/ring.ogg"), 35);
		} else if ($0 === 6) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/magic/summon_guns.ogg"), 50, 1);
		} else if ($0 === 7) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/machines/alarm.ogg"), 100, 0);
		} else if ($0 === 8) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/voice/bfreeze.ogg"), 35, 0);
		} else if ($0 === 9) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/weapons/gunshot.ogg"), 25, 1);
			rt.spawnTail(f, (yield* g.call(f, P("/proc/rand"), null, [10, 30])), "/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:778", hal_type, specific, creepyasssounds, i, alert_type, l_hand, r_hand, l, r, slots_free, H, possible_points, F, target, area, dead_people, G, fakemob, body, M);
		} else if ($0 === 10) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/effects/pray_chaplain.ogg"), 50);
		} else if ($0 === 11) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/weapons/taser.ogg"), 25, 1);
			rt.spawnTail(f, (yield* g.call(f, P("/proc/rand"), null, [10, 30])), "/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:786", hal_type, specific, creepyasssounds, i, alert_type, l_hand, r_hand, l, r, slots_free, H, possible_points, F, target, area, dead_people, G, fakemob, body, M);
		} else if ($0 === 12) {
			creepyasssounds = rt.list(rt.rsc("sound/effects/ghost.ogg"), rt.rsc("sound/effects/ghost2.ogg"), rt.rsc("sound/effects/heart_beat.ogg"), rt.rsc("sound/effects/screech.ogg"), rt.rsc("sound/hallucinations/behind_you1.ogg"), rt.rsc("sound/hallucinations/behind_you2.ogg"), rt.rsc("sound/hallucinations/far_noise.ogg"), rt.rsc("sound/hallucinations/growl1.ogg"), rt.rsc("sound/hallucinations/growl2.ogg"), rt.rsc("sound/hallucinations/growl3.ogg"), rt.rsc("sound/hallucinations/im_here1.ogg"), rt.rsc("sound/hallucinations/im_here2.ogg"), rt.rsc("sound/hallucinations/i_see_you1.ogg"), rt.rsc("sound/hallucinations/i_see_you2.ogg"), rt.rsc("sound/hallucinations/look_up1.ogg"), rt.rsc("sound/hallucinations/look_up2.ogg"), rt.rsc("sound/hallucinations/over_here1.ogg"), rt.rsc("sound/hallucinations/over_here2.ogg"), rt.rsc("sound/hallucinations/over_here3.ogg"), rt.rsc("sound/hallucinations/turn_around1.ogg"), rt.rsc("sound/hallucinations/turn_around2.ogg"), rt.rsc("sound/hallucinations/veryfar_noise.ogg"), rt.rsc("sound/hallucinations/wail.ogg"));
			yield* g.srcCall(f, "playsound_local", null, rt.op(f, "PickUnweighted", [1], [live(creepyasssounds)]), 50, 1);
		} else if ($0 === 13) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/effects/ratvar_rises.ogg"), 100);
			yield* g.call(f, P("/proc/sleep"), null, [150]);
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/effects/ratvar_reveal.ogg"), 100);
		} else if ($0 === 14) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<h1 class='alert'>Priority Announcement</h1>"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<br><br><span class='alert'>The Emergency Shuttle has docked with the station. You have 3 minutes to board the Emergency Shuttle.</span><br><br>"]);
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/ai/shuttledock.ogg"), 100);
		} else if ($0 === 15) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/items/welder.ogg"), 15, 1);
			yield* g.call(f, P("/proc/sleep"), null, [105]);
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/items/welder2.ogg"), 15, 1);
			yield* g.call(f, P("/proc/sleep"), null, [15]);
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/items/ratchet.ogg"), 15, 1);
		} else if ($0 === 16) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/items/screwdriver.ogg"), 15, 1);
			yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [10, 30]))]);
			i = null;
			i = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
			while (rt.gt(live(i), 0)) {
				yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/weapons/empty.ogg"), 15, 1);
				yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [10, 30]))]);
				i = rt.inc(live(i), -1);
			}
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/machines/airlockforced.ogg"), 15, 1);
		} else if ($0 === 17) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/weapons/saberon.ogg"), 35, 1);
		} else if ($0 === 18) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<h1 class='alert'>Biohazard Alert</h1>"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<br><br><span class='alert'>Confirmed outbreak of level 5 biohazard aboard ＀. All personnel must contain the outbreak.</span><br><br>", [(yield* g.call(f, P("/proc/station_name"), null, []))])]);
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/ai/outbreak5.ogg"));
		} else if ($0 === 19) {
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/magic/lightningbolt.ogg"), 35, 1);
			yield* g.call(f, P("/proc/sleep"), null, [20]);
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/magic/lightningbolt.ogg"), 65, 1);
			yield* g.call(f, P("/proc/sleep"), null, [20]);
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/magic/lightningbolt.ogg"), 100, 1);
		} else if ($0 === 20) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<h1 class='alert'>Anomaly Alert</h1>"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<br><br><span class='alert'>Hostile runtimes detected in all station systems, please deactivate your AI to prevent possible damage to its morality core.</span><br><br>"]);
			yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/ai/aimalf.ogg"), 100);
		}
	} else if ($0 === "hudscrew") {
		rt.setSv(f, "hal_screwyhud", rt.op(f, "PickUnweighted", [4], [0, 1, 2, 3]));
		yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [100, 250]))]);
		rt.setSv(f, "hal_screwyhud", 0);
	} else if ($0 === "fake_alert") {
		alert_type = rt.op(f, "PickUnweighted", [15], ["oxy", "not_enough_tox", "not_enough_co2", "too_much_oxy", "too_much_co2", "tox_in_air", "newlaw", "nutrition", "charge", "weightless", "fire", "locked", "hacked", "temp", "pressure"]);
		if (truthy(live(specific))) {
			alert_type = live(specific);
		}
		$0 = live(alert_type);
		if ($0 === "oxy") {
			yield* g.callSrc(f, "throw_alert", [null, "oxy", null, T("/obj/screen/alert/oxy"), "override", 1], rt.Args.Named);
		} else if ($0 === "not_enough_tox") {
			yield* g.callSrc(f, "throw_alert", [null, "not_enough_tox", null, T("/obj/screen/alert/not_enough_tox"), "override", 1], rt.Args.Named);
		} else if ($0 === "not_enough_co2") {
			yield* g.callSrc(f, "throw_alert", [null, "not_enough_co2", null, T("/obj/screen/alert/not_enough_co2"), "override", 1], rt.Args.Named);
		} else if ($0 === "too_much_oxy") {
			yield* g.callSrc(f, "throw_alert", [null, "too_much_oxy", null, T("/obj/screen/alert/too_much_oxy"), "override", 1], rt.Args.Named);
		} else if ($0 === "too_much_co2") {
			yield* g.callSrc(f, "throw_alert", [null, "too_much_co2", null, T("/obj/screen/alert/too_much_co2"), "override", 1], rt.Args.Named);
		} else if ($0 === "tox_in_air") {
			yield* g.callSrc(f, "throw_alert", [null, "tox_in_air", null, T("/obj/screen/alert/tox_in_air"), "override", 1], rt.Args.Named);
		} else if ($0 === "nutrition") {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.callSrc(f, "throw_alert", [null, "nutrition", null, T("/obj/screen/alert/fat"), "override", 1], rt.Args.Named);
			} else {
				yield* g.callSrc(f, "throw_alert", [null, "nutrition", null, T("/obj/screen/alert/starving"), "override", 1], rt.Args.Named);
			}
		} else if ($0 === "weightless") {
			yield* g.callSrc(f, "throw_alert", [null, "weightless", null, T("/obj/screen/alert/weightless"), "override", 1], rt.Args.Named);
		} else if ($0 === "fire") {
			yield* g.callSrc(f, "throw_alert", [null, "fire", null, T("/obj/screen/alert/fire"), "override", 1], rt.Args.Named);
		} else if ($0 === "temp") {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.callSrc(f, "throw_alert", [null, "temp", null, T("/obj/screen/alert/hot"), null, 3, "override", 1], rt.Args.Named);
			} else {
				yield* g.callSrc(f, "throw_alert", [null, "temp", null, T("/obj/screen/alert/cold"), null, 3, "override", 1], rt.Args.Named);
			}
		} else if ($0 === "pressure") {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.callSrc(f, "throw_alert", [null, "pressure", null, T("/obj/screen/alert/highpressure"), null, 2, "override", 1], rt.Args.Named);
			} else {
				yield* g.callSrc(f, "throw_alert", [null, "pressure", null, T("/obj/screen/alert/lowpressure"), null, 2, "override", 1], rt.Args.Named);
			}
		} else if ($0 === "newlaw") {
			yield* g.callSrc(f, "throw_alert", [null, "newlaw", null, T("/obj/screen/alert/newlaw"), "override", 1], rt.Args.Named);
		} else if ($0 === "locked") {
			yield* g.callSrc(f, "throw_alert", [null, "locked", null, T("/obj/screen/alert/locked"), "override", 1], rt.Args.Named);
		} else if ($0 === "hacked") {
			yield* g.callSrc(f, "throw_alert", [null, "hacked", null, T("/obj/screen/alert/hacked"), "override", 1], rt.Args.Named);
		} else if ($0 === "charge") {
			yield* g.callSrc(f, "throw_alert", [null, "charge", null, T("/obj/screen/alert/emptycell"), "override", 1], rt.Args.Named);
		}
		yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [100, 200]))]);
		yield* g.callSrc(f, "clear_alert", [null, live(alert_type), "clear_override", 1], rt.Args.Named);
	} else if ($0 === "items") {
		if (!truthy(rt.sv(f, "halitem"))) {
			rt.setSv(f, "halitem", (yield* g.new_(f, T("/obj"), [])));
			l_hand = (yield* g.srcCall(f, "get_item_for_held_index", 1));
			r_hand = (yield* g.srcCall(f, "get_item_for_held_index", 2));
			l = (yield* g.call(f, P("/proc/ui_hand_position"), null, [(yield* g.srcCall(f, "get_held_index_of_item", live(l_hand)))]));
			r = (yield* g.call(f, P("/proc/ui_hand_position"), null, [(yield* g.srcCall(f, "get_held_index_of_item", live(r_hand)))]));
			slots_free = rt.list(live(l), live(r));
			if (truthy(live(l_hand))) {
				(slots_free = rt.modify(live(slots_free), live(l), subtract));
			}
			if (truthy(live(r_hand))) {
				(slots_free = rt.modify(live(slots_free), live(r), subtract));
			}
			if (truthy((rt.istype(live(f.src), T("/mob/living/carbon/human")) ? 1 : 0))) {
				if (!truthy(rt.gv(f, "belt", (H = live(f.src))))) {
					slots_free = rt.modify(live(slots_free), "CENTER-3:14,SOUTH:5", add);
				}
				if (!truthy(rt.fv(f, "l_store", live(H)))) {
					slots_free = rt.modify(live(slots_free), "CENTER+1:18,SOUTH:5", add);
				}
				if (!truthy(rt.fv(f, "r_store", live(H)))) {
					slots_free = rt.modify(live(slots_free), "CENTER+2:20,SOUTH:5", add);
				}
			}
			if (truthy(rt.len(f, live(slots_free)))) {
				rt.setFv(f, "screen_loc", rt.sv(f, "halitem"), rt.op(f, "PickUnweighted", [1], [live(slots_free)]));
				rt.setFv(f, "layer", rt.sv(f, "halitem"), 20);
				rt.setFv(f, "plane", rt.sv(f, "halitem"), 20);
				$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 6]));
				if ($0 === 1) {
					rt.setFv(f, "icon", rt.sv(f, "halitem"), rt.rsc("icons/obj/guns/projectile.dmi"));
					rt.setFv(f, "icon_state", rt.sv(f, "halitem"), "revolver");
					rt.setFv(f, "name", rt.sv(f, "halitem"), "Revolver");
				} else if ($0 === 2) {
					rt.setFv(f, "icon", rt.sv(f, "halitem"), rt.rsc("icons/obj/grenade.dmi"));
					rt.setFv(f, "icon_state", rt.sv(f, "halitem"), "plastic-explosive0");
					rt.setFv(f, "name", rt.sv(f, "halitem"), "Mysterious Package");
					if (truthy(rt.op(f, "Prob", [], [25]))) {
						rt.setFv(f, "icon_state", rt.sv(f, "halitem"), "c4small_1");
					}
				} else if ($0 === 3) {
					rt.setFv(f, "icon", rt.sv(f, "halitem"), rt.rsc("icons/obj/weapons.dmi"));
					rt.setFv(f, "icon_state", rt.sv(f, "halitem"), "sword1");
					rt.setFv(f, "name", rt.sv(f, "halitem"), "Sword");
				} else if ($0 === 4) {
					rt.setFv(f, "icon", rt.sv(f, "halitem"), rt.rsc("icons/obj/weapons.dmi"));
					rt.setFv(f, "icon_state", rt.sv(f, "halitem"), "stunbaton");
					rt.setFv(f, "name", rt.sv(f, "halitem"), "Stun Baton");
				} else if ($0 === 5) {
					rt.setFv(f, "icon", rt.sv(f, "halitem"), rt.rsc("icons/obj/card.dmi"));
					rt.setFv(f, "icon_state", rt.sv(f, "halitem"), "emag");
					rt.setFv(f, "name", rt.sv(f, "halitem"), "Cryptographic Sequencer");
				} else if ($0 === 6) {
					rt.setFv(f, "icon", rt.sv(f, "halitem"), rt.rsc("icons/obj/grenade.dmi"));
					rt.setFv(f, "icon_state", rt.sv(f, "halitem"), "flashbang1");
					rt.setFv(f, "name", rt.sv(f, "halitem"), "Flashbang");
				}
				if (truthy(rt.sv(f, "client"))) {
					rt.modField(f, rt.sv(f, "client"), "screen", rt.sv(f, "halitem"), add);
				}
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), rt.sv(f, "halitem")])), (yield* g.call(f, P("/proc/rand"), null, [100, 250])), 8]);
			}
		}
	} else if ($0 === "dangerflash") {
		if (!truthy(rt.sv(f, "halimage"))) {
			possible_points = rt.list();
			F = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(f.src), rt.fv(f, "view", rt.world())])), T("/turf/open/floor"));
			while (($e = rt.next(f, 0)) !== undefined) {
				F = $e;
				possible_points = rt.modify(live(possible_points), live(F), add);
			}
			rt.endFor(f, 0);
			if (truthy(rt.len(f, live(possible_points)))) {
				target = rt.op(f, "PickUnweighted", [1], [live(possible_points)]);
				$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 4]));
				if ($0 === 1) {
					rt.setSv(f, "halimage", (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/turf/space.dmi"), live(target), fmt("＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 25]))]), 2])));
				} else if ($0 === 2) {
					rt.setSv(f, "halimage", (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/turf/floors/lava.dmi"), live(target), "smooth", 2])));
				} else if ($0 === 3) {
					rt.setSv(f, "halimage", (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/turf/floors/chasms.dmi"), live(target), "smooth", 2])));
				} else if ($0 === 4) {
					rt.setSv(f, "halimage", (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/obj/grenade.dmi"), live(target), "plastic-explosive2", 3.009999990463257])));
				}
				if (truthy(rt.sv(f, "client"))) {
					rt.modField(f, rt.sv(f, "client"), "images", rt.sv(f, "halimage"), add);
				}
				yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [40, 60]))]);
				if (truthy(rt.sv(f, "client"))) {
					(rt.modField(f, rt.sv(f, "client"), "images", rt.sv(f, "halimage"), subtract));
				}
				rt.setSv(f, "halimage", null);
			}
		}
	} else if ($0 === "death") {
		rt.setSv(f, "hal_screwyhud", 2);
		yield* g.srcCall(f, "SetUnconscious", 400);
		area = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='deadsay'><b>＀</b> has died at <b>＀</b>.</span>", [rt.fv(f, "name", rt.sv(f, "mind")), rt.fv(f, "name", live(area))])]);
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			dead_people = rt.list();
			G = null;
			rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
			while (($e = rt.next(f, 0)) !== undefined) {
				G = $e;
				dead_people = rt.modify(live(dead_people), live(G), add);
			}
			rt.endFor(f, 0);
			if (truthy((fakemob = rt.op(f, "PickUnweighted", [1], [live(dead_people)])))) {
				yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [30, 60]))]);
				$0 = live(f.src);
				$1 = rt.fv(f, "name", live(fakemob));
				$2 = "rip";
				$3 = fmt("welcome ＀", [(yield* g.srcCall(f, "first_name"))]);
				$4 = "you too?";
				$5 = "is the AI malf?";
				if (truthy(rt.op(f, "Prob", [], [50]))) {
					$6 = " fucking";
				} else {
					$6 = "";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='deadsay'><b>DEAD: ＀</b> says, \"＀\"</span>", [$1, rt.op(f, "PickUnweighted", [5], [$2, $3, $4, $5, fmt("i＀ hate ＀", [$6, rt.op(f, "PickUnweighted", [8], ["blood cult", "clock cult", "revenants", "abductors", "double agents", "viruses", "badmins", "you"])])])])]);
			}
		}
		yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [50, 70]))]);
		rt.setSv(f, "hal_screwyhud", 0);
		yield* g.srcCall(f, "SetSleeping", 0);
	} else if ($0 === "husks") {
		if (truthy(rt.sv(f, "halbody"))) return f.dot;
		possible_points = rt.list();
		F = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(f.src), rt.fv(f, "view", rt.world())])), T("/turf/open/floor"));
		while (($e = rt.next(f, 0)) !== undefined) {
			F = $e;
			possible_points = rt.modify(live(possible_points), live(F), add);
		}
		rt.endFor(f, 0);
		if (!truthy(rt.len(f, live(possible_points)))) return f.dot;
		target = rt.op(f, "PickUnweighted", [1], [live(possible_points)]);
		$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 4]));
		if ($0 === 1) {
			body = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/human.dmi"), live(target), "husk", 2]));
			yield* g.callName(f, (M = (yield* g.call(f, P("/proc/matrix"), null, []))), "Turn", [90]);
			rt.setFv(f, "transform", live(body), live(M));
			rt.setSv(f, "halbody", live(body));
		} else if ($0 === 2 || $0 === 3) {
			rt.setSv(f, "halbody", (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/human.dmi"), live(target), "husk", 2])));
		} else if ($0 === 4) {
			rt.setSv(f, "halbody", (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/alien.dmi"), live(target), "alienother", 2])));
		}
		if (truthy(rt.sv(f, "client"))) {
			rt.modField(f, rt.sv(f, "client"), "images", rt.sv(f, "halbody"), add);
		}
		rt.spawnTail(f, (yield* g.call(f, P("/proc/rand"), null, [30, 50])), "/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:1008", hal_type, specific, creepyasssounds, i, alert_type, l_hand, r_hand, l, r, slots_free, H, possible_points, F, target, area, dead_people, G, fakemob, body, M);
	}
	return f.dot;
}, true, { waitfor: false });

// a spawn((yield* g.call(f, P("/proc/rand"), null, [30, 50]))) body of /mob/living/carbon/proc/hallucinate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:1008", function* (f: Frame, hal_type: Value, specific: Value, creepyasssounds: Value, i: Value, alert_type: Value, l_hand: Value, r_hand: Value, l: Value, r: Value, slots_free: Value, H: Value, possible_points: Value, F: Value, target: Value, area: Value, dead_people: Value, G: Value, fakemob: Value, body: Value, M: Value) {
	f.vars = () => [hal_type, specific, creepyasssounds, i, alert_type, l_hand, r_hand, l, r, slots_free, H, possible_points, F, target, area, dead_people, G, fakemob, body, M];
	if (truthy(rt.sv(f, "client"))) {
		(rt.modField(f, rt.sv(f, "client"), "images", rt.sv(f, "halbody"), subtract));
	}
	rt.setSv(f, "halbody", null);
	return null;
});

// a spawn((yield* g.call(f, P("/proc/rand"), null, [10, 30]))) body of /mob/living/carbon/proc/hallucinate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:786", function* (f: Frame, hal_type: Value, specific: Value, creepyasssounds: Value, i: Value, alert_type: Value, l_hand: Value, r_hand: Value, l: Value, r: Value, slots_free: Value, H: Value, possible_points: Value, F: Value, target: Value, area: Value, dead_people: Value, G: Value, fakemob: Value, body: Value, M: Value) {
	f.vars = () => [hal_type, specific, creepyasssounds, i, alert_type, l_hand, r_hand, l, r, slots_free, H, possible_points, F, target, area, dead_people, G, fakemob, body, M];
	yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/weapons/taser.ogg"), 25, 1);
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [5, 10]))]);
	yield* g.srcCall(f, "playsound_local", null, (yield* g.call(f, P("/proc/sound"), null, [(yield* g.call(f, P("/proc/get_sfx"), null, ["bodyfall"])), 25])), 25, 1);
	return null;
});

// a spawn((yield* g.call(f, P("/proc/rand"), null, [10, 30]))) body of /mob/living/carbon/proc/hallucinate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:778", function* (f: Frame, hal_type: Value, specific: Value, creepyasssounds: Value, i: Value, alert_type: Value, l_hand: Value, r_hand: Value, l: Value, r: Value, slots_free: Value, H: Value, possible_points: Value, F: Value, target: Value, area: Value, dead_people: Value, G: Value, fakemob: Value, body: Value, M: Value) {
	f.vars = () => [hal_type, specific, creepyasssounds, i, alert_type, l_hand, r_hand, l, r, slots_free, H, possible_points, F, target, area, dead_people, G, fakemob, body, M];
	yield* g.srcCall(f, "playsound_local", null, rt.rsc("sound/weapons/gunshot.ogg"), 25, 1);
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [5, 10]))]);
	yield* g.srcCall(f, "playsound_local", null, (yield* g.call(f, P("/proc/sound"), null, [(yield* g.call(f, P("/proc/get_sfx"), null, ["bodyfall"])), 25])), 25, 1);
	return null;
});
