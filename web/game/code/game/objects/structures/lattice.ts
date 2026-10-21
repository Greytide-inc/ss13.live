// From code/game/objects/structures/lattice.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12234, "/obj/structure/lattice", "/obj/structure", {
	number_of_rods: 1,
	anchored: 1,
	canSmoothWith: null,
	smooth: 2,
	name: "lattice",
	desc: "A lightweight support lattice. These hold our station together.",
	icon: rt.rsc("icons/obj/smooth_structures/lattice.dmi"),
	icon_state: "lattice",
	density: 0,
	armor: null,
	obj_integrity: 50,
	max_integrity: 50,
	layer: 2.2,
});

// /obj/structure/lattice/proc/<init>  (code/game/objects/structures/lattice.dm:13)
rt.def("/obj/structure/lattice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/lattice"), T("/turf/open/floor"), T("/turf/closed/wall"), T("/obj/structure/falsewall")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 50]));
	return f.dot;
});

// /obj/structure/lattice/proc/Initialize  (code/game/objects/structures/lattice.dm:21)  may sleep
rt.def("/obj/structure/lattice/proc/Initialize", function* Initialize(f: Frame) {
	let LAT: Value = null;
	let $e: any;
	f.vars = () => [LAT, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	LAT = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/lattice"));
	while (($e = rt.next(f, 0)) !== undefined) {
		LAT = $e;
		if (!isEqual(live(LAT), live(f.src))) {
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(LAT)])), 0, 8]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/structure/lattice/proc/ratvar_act  (code/game/objects/structures/lattice.dm:30)  may sleep
rt.def("/obj/structure/lattice/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/IsEven"), null, [add(rt.sv(f, "x"), rt.sv(f, "y"))])))) {
		yield* g.new_(f, T("/obj/structure/lattice/clockwork"), [rt.sv(f, "loc")]);
	} else {
		yield* g.new_(f, T("/obj/structure/lattice/clockwork/large"), [rt.sv(f, "loc")]);
	}
	return f.dot;
}, true);

// /obj/structure/lattice/proc/attackby  (code/game/objects/structures/lattice.dm:36)  may sleep
rt.def("/obj/structure/lattice/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	let _T: Value = null;
	f.vars = () => [C, user, params, _T];
	if (truthy((rt.istype(live(C), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Slicing ＀ joints ...</span>", [rt.sv(f, "name")])]);
		yield* g.srcCall(f, "deconstruct");
	} else {
		return (yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "attackby", [live(C), live(user)]));
	}
	return f.dot;
}, true);

// /obj/structure/lattice/proc/deconstruct  (code/game/objects/structures/lattice.dm:44)  may sleep
rt.def("/obj/structure/lattice/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/rods"), [rt.getStep(f, live(f.src), 0), rt.sv(f, "number_of_rods")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/lattice/proc/singularity_pull  (code/game/objects/structures/lattice.dm:49)  may sleep
rt.def("/obj/structure/lattice/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 7)) return f.dot;
	yield* g.srcCall(f, "deconstruct");
	return f.dot;
}, true);

rt.type(12235, "/obj/structure/lattice/clockwork", "/obj/structure/lattice", {
	name: "cog lattice",
	desc: "A lightweight support lattice. These hold the Justicar's station together.",
	icon: rt.rsc("icons/obj/smooth_structures/lattice_clockwork.dmi"),
});

// /obj/structure/lattice/clockwork/proc/Initialize  (code/game/objects/structures/lattice.dm:58)  may sleep
rt.def("/obj/structure/lattice/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "ratvar_act");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/structure/lattice/clockwork/proc/ratvar_act  (code/game/objects/structures/lattice.dm:62)  may sleep
rt.def("/obj/structure/lattice/clockwork/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/IsOdd"), null, [add(rt.sv(f, "x"), rt.sv(f, "y"))])))) return f.dot;
	yield* g.new_(f, T("/obj/structure/lattice/clockwork/large"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

rt.type(12236, "/obj/structure/lattice/clockwork/large", "/obj/structure/lattice/clockwork", {});

// /obj/structure/lattice/clockwork/large/proc/Initialize  (code/game/objects/structures/lattice.dm:66)  may sleep
rt.def("/obj/structure/lattice/clockwork/large/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon", rt.rsc("icons/obj/smooth_structures/lattice_clockwork_large.dmi"));
	rt.setSv(f, "pixel_x", -9);
	rt.setSv(f, "pixel_y", -9);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/structure/lattice/clockwork/large/proc/ratvar_act  (code/game/objects/structures/lattice.dm:72)  may sleep
rt.def("/obj/structure/lattice/clockwork/large/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/IsEven"), null, [add(rt.sv(f, "x"), rt.sv(f, "y"))])))) return f.dot;
	yield* g.new_(f, T("/obj/structure/lattice/clockwork"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

rt.type(12237, "/obj/structure/lattice/catwalk", "/obj/structure/lattice", {
	smooth: 1,
	canSmoothWith: null,
	name: "catwalk",
	desc: "A catwalk for easier EVA maneuvering and cable placement.",
	icon: rt.rsc("icons/obj/smooth_structures/catwalk.dmi"),
	icon_state: "catwalk",
	number_of_rods: 2,
});

// /obj/structure/lattice/catwalk/proc/<init>  (code/game/objects/structures/lattice.dm:82)
rt.def("/obj/structure/lattice/catwalk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", null);
	return f.dot;
});

// /obj/structure/lattice/catwalk/proc/ratvar_act  (code/game/objects/structures/lattice.dm:85)  may sleep
rt.def("/obj/structure/lattice/catwalk/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* g.new_(f, T("/obj/structure/lattice/catwalk/clockwork"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

// /obj/structure/lattice/catwalk/proc/Move  (code/game/objects/structures/lattice.dm:88)  may sleep
rt.def("/obj/structure/lattice/catwalk/proc/Move", function* Move(f: Frame) {
	let _T: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [_T, C, $e];
	_T = rt.sv(f, "loc");
	C = null;
	rt.forList(f, 0, live(_T), T("/obj/structure/cable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "deconstruct", []);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/lattice/catwalk/proc/deconstruct  (code/game/objects/structures/lattice.dm:94)  may sleep
rt.def("/obj/structure/lattice/catwalk/proc/deconstruct", function* deconstruct(f: Frame) {
	let _T: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [_T, C, $e];
	_T = rt.sv(f, "loc");
	C = null;
	rt.forList(f, 0, live(_T), T("/obj/structure/cable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "deconstruct", []);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(12238, "/obj/structure/lattice/catwalk/clockwork", "/obj/structure/lattice/catwalk", {
	name: "clockwork catwalk",
	icon: rt.rsc("icons/obj/smooth_structures/catwalk_clockwork.dmi"),
});

// /obj/structure/lattice/catwalk/clockwork/proc/Initialize  (code/game/objects/structures/lattice.dm:104)  may sleep
rt.def("/obj/structure/lattice/catwalk/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/floor/catwalk"), [rt.sv(f, "loc")]);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/beam/catwalk"), [rt.sv(f, "loc")]);
	return f.dot;
}, true, { args: ["mapload"] });
