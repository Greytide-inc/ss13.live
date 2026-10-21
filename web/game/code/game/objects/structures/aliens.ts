// From code/game/objects/structures/aliens.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12710, "/obj/structure/alien", "/obj/structure", {
	icon: rt.rsc("icons/mob/alien.dmi"),
	obj_integrity: 100,
	max_integrity: 100,
});

// /obj/structure/alien/proc/run_obj_armor  (code/game/objects/structures/aliens.dm:16)
rt.def("/obj/structure/alien/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (isEqual(live(f.args[2]), "melee")) {
		$0 = live(f.args[1]);
		if ($0 === "brute") {
			(f.args[0] = rt.modify(live(f.args[0]), 0.25, multiply));
		} else if ($0 === "fire") {
			(f.args[0] = rt.modify(live(f.args[0]), 2, multiply));
		}
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// /obj/structure/alien/proc/play_attack_sound  (code/game/objects/structures/aliens.dm:25)
rt.def("/obj/structure/alien/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
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
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/attackblob.ogg"), 100, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
		}
	} else if ($0 === "fire") {
		if (!truthy(live(damage_amount))) return f.dot;
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

rt.type(12711, "/obj/structure/alien/gelpod", "/obj/structure/alien", {
	name: "gelatinous mound",
	desc: "A mound of jelly-like substance encasing something inside.",
	icon: rt.rsc("icons/obj/fluff.dmi"),
	icon_state: "gelmound",
});

// /obj/structure/alien/gelpod/proc/deconstruct  (code/game/objects/structures/aliens.dm:46)  may sleep
rt.def("/obj/structure/alien/gelpod/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/effect/mob_spawn/human/corpse/damaged"), [rt.getStep(f, live(f.src), 0)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12712, "/obj/structure/alien/resin", "/obj/structure/alien", {
	resintype: null,
	anchored: 1,
	canSmoothWith: null,
	smooth: 1,
	CanAtmosPass: -2,
	name: "resin",
	desc: "Looks like some kind of thick resin.",
	icon: rt.rsc("icons/obj/smooth_structures/alien/resin_wall.dmi"),
	icon_state: "resin",
	density: 1,
	opacity: 1,
	obj_integrity: 200,
	max_integrity: 200,
});

// /obj/structure/alien/resin/proc/<init>  (code/game/objects/structures/aliens.dm:61)
rt.def("/obj/structure/alien/resin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/alien/resin")));
	return f.dot;
});

// /obj/structure/alien/resin/proc/New  (code/game/objects/structures/aliens.dm:70)  may sleep
rt.def("/obj/structure/alien/resin/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "air_update_turf", 1);
	return f.dot;
}, true, { args: ["location"] });

// /obj/structure/alien/resin/proc/Move  (code/game/objects/structures/aliens.dm:74)  may sleep
rt.def("/obj/structure/alien/resin/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.sv(f, "loc");
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "move_update_air", live(_T));
	return f.dot;
}, true);

rt.type(12713, "/obj/structure/alien/resin/wall", "/obj/structure/alien/resin", {
	resintype: "wall",
	name: "resin wall",
	desc: "Thick resin solidified into a wall.",
	icon: rt.rsc("icons/obj/smooth_structures/alien/resin_wall.dmi"),
	icon_state: "wall0",
	canSmoothWith: null,
});

// /obj/structure/alien/resin/wall/proc/<init>  (code/game/objects/structures/aliens.dm:84)
rt.def("/obj/structure/alien/resin/wall/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/alien/resin/wall"), T("/obj/structure/alien/resin/membrane")));
	return f.dot;
});

rt.type(12714, "/obj/structure/alien/resin/membrane", "/obj/structure/alien/resin", {
	resintype: "membrane",
	canSmoothWith: null,
	name: "resin membrane",
	desc: "Resin just thin enough to let light pass through.",
	icon: rt.rsc("icons/obj/smooth_structures/alien/resin_membrane.dmi"),
	icon_state: "membrane0",
	opacity: 0,
	obj_integrity: 160,
	max_integrity: 160,
});

// /obj/structure/alien/resin/membrane/proc/<init>  (code/game/objects/structures/aliens.dm:98)
rt.def("/obj/structure/alien/resin/membrane/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/alien/resin/wall"), T("/obj/structure/alien/resin/membrane")));
	return f.dot;
});

// /obj/structure/alien/resin/proc/attack_paw  (code/game/objects/structures/aliens.dm:101)  may sleep
rt.def("/obj/structure/alien/resin/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/alien/resin/proc/CanPass  (code/game/objects/structures/aliens.dm:105)
rt.def("/obj/structure/alien/resin/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	return (!truthy(rt.sv(f, "density")) ? 1 : 0);
});

rt.type(12716, "/obj/structure/alien/weeds", "/obj/structure/alien", {
	last_expand: 0,
	growth_cooldown_low: 150,
	growth_cooldown_high: 200,
	anchored: 1,
	canSmoothWith: null,
	smooth: 2,
	gender: "plural",
	name: "resin floor",
	desc: "A thick resin surface covers the floor.",
	density: 0,
	layer: 2,
	icon_state: "weeds",
	obj_integrity: 15,
	max_integrity: 15,
}, { global: { blacklisted_turfs: 800 } });

// /obj/structure/alien/weeds/proc/<init>  (code/game/objects/structures/aliens.dm:124)
rt.def("/obj/structure/alien/weeds/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/alien/weeds"), T("/turf/closed/wall")));
	return f.dot;
});

// /obj/structure/alien/weeds/proc/Initialize  (code/game/objects/structures/aliens.dm:134)
rt.def("/obj/structure/alien/weeds/proc/Initialize", function Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "pixel_x", -4);
	rt.setSv(f, "pixel_y", -4);
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.gl("blacklisted_turfs#2"))) {
		rt.setGl("blacklisted_turfs#2", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/turf/open/space"), T("/turf/open/chasm"), T("/turf/open/floor/plating/lava"))]));
	}
	rt.setSv(f, "last_expand", add(rt.worldTime(f), rt.call(f, P("/proc/rand"), null, [rt.sv(f, "growth_cooldown_low"), rt.sv(f, "growth_cooldown_high")])));
	if (!isEqual(rt.sv(f, "icon"), rt.initial(f, live(f.src), "icon"))) return f.dot;
	$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
	if ($0 === 1) {
		rt.setSv(f, "icon", rt.rsc("icons/obj/smooth_structures/alien/weeds1.dmi"));
	} else if ($0 === 2) {
		rt.setSv(f, "icon", rt.rsc("icons/obj/smooth_structures/alien/weeds2.dmi"));
	} else if ($0 === 3) {
		rt.setSv(f, "icon", rt.rsc("icons/obj/smooth_structures/alien/weeds3.dmi"));
	}
	return f.dot;
});

// /obj/structure/alien/weeds/proc/expand  (code/game/objects/structures/aliens.dm:154)  may sleep
rt.def("/obj/structure/alien/weeds/proc/expand", function* expand(f: Frame) {
	let U: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [U, _T, $e];
	if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [(U = rt.getStep(f, live(f.src), 0)), rt.gl("blacklisted_turfs#2")])))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 0;
	}
	_T = null;
	rt.forList(f, 0, (yield* g.callName(f, live(U), "GetAtmosAdjacentTurfs", [])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.locateIn(f, T("/obj/structure/alien/weeds"), live(_T)))) {
			continue;
		}
		if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(_T), rt.gl("blacklisted_turfs#2")])))) {
			continue;
		}
		yield* g.new_(f, T("/obj/structure/alien/weeds"), [live(_T)]);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /obj/structure/alien/weeds/proc/temperature_expose  (code/game/objects/structures/aliens.dm:170)  may sleep
rt.def("/obj/structure/alien/weeds/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "take_damage", 5, "fire", 0, 0);
	return f.dot;
}, true);

rt.type(12717, "/obj/structure/alien/weeds/node", "/obj/structure/alien/weeds", {
	lon_range: 4,
	node_range: 3,
	light_color: "#6496FA",
	light_power: 0.5,
	name: "glowing resin",
	desc: "Blue bioluminescence shines from beneath the surface.",
	icon_state: "weednode",
});

// /obj/structure/alien/weeds/node/proc/Initialize  (code/game/objects/structures/aliens.dm:184)  may sleep
rt.def("/obj/structure/alien/weeds/node/proc/Initialize", function* Initialize(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	rt.setSv(f, "icon", rt.rsc("icons/obj/smooth_structures/alien/weednode.dmi"));
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_light", rt.sv(f, "lon_range"));
	if ((truthy((W = rt.locateIn(f, T("/obj/structure/alien/weeds"), rt.sv(f, "loc")))) && !isEqual(live(W), live(f.src)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
	}
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/structure/alien/weeds/node/proc/Destroy  (code/game/objects/structures/aliens.dm:193)  may sleep
rt.def("/obj/structure/alien/weeds/node/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/alien/weeds/node/proc/process  (code/game/objects/structures/aliens.dm:197)  may sleep
rt.def("/obj/structure/alien/weeds/node/proc/process", function* process(f: Frame) {
	let W: Value = null;
	let $e: any;
	f.vars = () => [W, $e];
	W = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "node_range"), live(f.src)])), T("/obj/structure/alien/weeds"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		if (rt.le(rt.fv(f, "last_expand", live(W)), rt.worldTime(f))) {
			if (truthy((yield* g.callName(f, live(W), "expand", [])))) {
				rt.setFv(f, "last_expand", live(W), add(rt.worldTime(f), (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "growth_cooldown_low"), rt.sv(f, "growth_cooldown_high")]))));
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

rt.type(12718, "/obj/structure/alien/egg", "/obj/structure/alien", {
	base_icon: "egg",
	status: "growing",
	child: null,
	anchored: 1,
	name: "egg",
	desc: "A large mottled egg.",
	icon_state: "egg_growing",
	density: 0,
	obj_integrity: 100,
	max_integrity: 100,
	integrity_failure: 5,
	layer: 4,
});

// /obj/structure/alien/egg/proc/Initialize  (code/game/objects/structures/aliens.dm:231)  may sleep
rt.def("/obj/structure/alien/egg/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	if ((isEqual(rt.sv(f, "status"), "growing") || isEqual(rt.sv(f, "status"), "grown"))) {
		rt.setSv(f, "child", (yield* g.new_(f, T("/obj/item/clothing/mask/facehugger"), [live(f.src)])));
	}
	if (isEqual(rt.sv(f, "status"), "growing")) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/alien/egg/proc/Grow")])), (yield* g.call(f, P("/proc/rand"), null, [900, 1500]))]);
	}
	$0 = live(f.src);
	if (isEqual(rt.sv(f, "status"), "grown")) {
		$1 = 1;
	} else {
		$1 = 0;
	}
	rt.setSv(f, "proximity_monitor", (yield* g.new_(f, T("/datum/proximity_monitor"), [$0, $1])));
	if (!isEqual(rt.sv(f, "status"), "burst")) return f.dot;
	rt.setSv(f, "obj_integrity", rt.sv(f, "integrity_failure"));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/structure/alien/egg/proc/update_icon  (code/game/objects/structures/aliens.dm:242)
rt.def("/obj/structure/alien/egg/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "status");
	if ($0 === "growing") {
		rt.setSv(f, "icon_state", fmt("＀_growing", [rt.sv(f, "base_icon")]));
	} else if ($0 === "grown") {
		rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "base_icon")]));
	} else if ($0 === "burst") {
		rt.setSv(f, "icon_state", fmt("＀_hatched", [rt.sv(f, "base_icon")]));
	}
	return f.dot;
});

// /obj/structure/alien/egg/proc/attack_paw  (code/game/objects/structures/aliens.dm:252)  may sleep
rt.def("/obj/structure/alien/egg/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	f.dot = (yield* g.srcCall(f, "attack_hand", live(user)));
	return f.dot;
}, true);

// /obj/structure/alien/egg/proc/attack_alien  (code/game/objects/structures/aliens.dm:255)  may sleep
rt.def("/obj/structure/alien/egg/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	f.dot = (yield* g.srcCall(f, "attack_hand", live(user)));
	return f.dot;
}, true);

// /obj/structure/alien/egg/proc/attack_hand  (code/game/objects/structures/aliens.dm:258)  may sleep
rt.def("/obj/structure/alien/egg/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [user, $0];
	if (truthy((yield* g.callName(f, live(user), "getorgan", [T("/obj/item/organ/alien/plasmavessel")])))) {
		$0 = rt.sv(f, "status");
		if ($0 === "burst") {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You clear the hatched egg.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/attackblob.ogg"), 100, 1]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		} else if ($0 === "growing") {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The child is not developed yet.</span>"]);
			return live(f.dot);
		} else if ($0 === "grown") {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You retrieve the child.</span>"]);
			yield* g.callSrc(f, "Burst", ["kill", 0], rt.Args.Named);
			return live(f.dot);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>It feels slimy.</span>"]);
		yield* g.callName(f, live(user), "changeNext_move", [8]);
	}
	return f.dot;
}, true);

// /obj/structure/alien/egg/proc/Grow  (code/game/objects/structures/aliens.dm:278)  may sleep
rt.def("/obj/structure/alien/egg/proc/Grow", function* Grow(f: Frame) {
	rt.setSv(f, "status", "grown");
	yield* g.srcCall(f, "update_icon");
	yield* g.callName(f, rt.sv(f, "proximity_monitor"), "SetRange", [1]);
	return f.dot;
}, true);

// /obj/structure/alien/egg/proc/Burst  (code/game/objects/structures/aliens.dm:284)  may sleep
rt.def("/obj/structure/alien/egg/proc/Burst", function* Burst(f: Frame, kill: Value) {
	f.vars = () => [kill];
	if (live(kill) === null) {
		kill = 1;
	}
	if (!(isEqual(rt.sv(f, "status"), "grown") || isEqual(rt.sv(f, "status"), "growing"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "proximity_monitor"), "SetRange", [0]);
	rt.setSv(f, "status", "burst");
	yield* g.srcCall(f, "update_icon");
	yield* g.call(f, P("/proc/flick"), null, ["egg_opening", live(f.src)]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/alien/egg/proc/finish_bursting"), live(kill)])), 15]);
	return f.dot;
}, true);

// /obj/structure/alien/egg/proc/finish_bursting  (code/game/objects/structures/aliens.dm:293)  may sleep
rt.def("/obj/structure/alien/egg/proc/finish_bursting", function* finish_bursting(f: Frame, kill: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [kill, M, $e];
	if (live(kill) === null) {
		kill = 1;
	}
	if (!truthy(rt.sv(f, "child"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "child"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	if (!truthy((rt.istype(rt.sv(f, "child"), T("/obj/item/clothing/mask/facehugger")) ? 1 : 0))) return f.dot;
	if (truthy(live(kill))) {
		yield* g.callName(f, rt.sv(f, "child"), "Die", []);
	} else {
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (truthy((yield* g.call(f, P("/proc/CanHug"), null, [live(M)])))) {
				yield* g.callName(f, rt.sv(f, "child"), "Leap", [live(M)]);
				break;
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /obj/structure/alien/egg/proc/obj_break  (code/game/objects/structures/aliens.dm:305)  may sleep
rt.def("/obj/structure/alien/egg/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) return f.dot;
	if (isEqual(rt.sv(f, "status"), "burst")) return f.dot;
	yield* g.callSrc(f, "Burst", ["kill", 1], rt.Args.Named);
	return f.dot;
}, true);

// /obj/structure/alien/egg/proc/temperature_expose  (code/game/objects/structures/aliens.dm:310)  may sleep
rt.def("/obj/structure/alien/egg/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), 500)) return f.dot;
	yield* g.srcCall(f, "take_damage", 5, "fire", 0, 0);
	return f.dot;
}, true);

// /obj/structure/alien/egg/proc/HasProximity  (code/game/objects/structures/aliens.dm:315)  may sleep
rt.def("/obj/structure/alien/egg/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	let C: Value = null;
	f.vars = () => [AM, C];
	if (!isEqual(rt.sv(f, "status"), "grown")) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/CanHug"), null, [live(AM)])))) {
		return live(f.dot);
	}
	if ((isEqual(rt.gv(f, "stat", (C = live(AM))), 0) && truthy((yield* g.callName(f, live(C), "getorgan", [T("/obj/item/organ/body_egg/alien_embryo")]))))) {
		return live(f.dot);
	}
	yield* g.callSrc(f, "Burst", ["kill", 0], rt.Args.Named);
	return f.dot;
}, true);
