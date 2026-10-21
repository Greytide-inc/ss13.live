// From code/modules/events/spacevine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(321, "/datum/round_event/spacevine", "/datum/round_event", {});

// /datum/round_event/spacevine/proc/start  (code/modules/events/spacevine.dm:9)  may sleep
rt.def("/datum/round_event/spacevine/proc/start", function* start(f: Frame) {
	let turfs: Value = null, SV: Value = null, A: Value = null, F: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [turfs, SV, A, F, _T, $e];
	turfs = rt.list();
	SV = (yield* g.new_(f, T("/obj/structure/spacevine"), []));
	A = null;
	rt.forList(f, 0, rt.world(), T("/area/hallway"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		F = null;
		rt.forList(f, 1, live(A), T("/turf"));
		while (($e = rt.next(f, 1)) !== undefined) {
			F = $e;
			if (truthy((yield* g.callName(f, live(F), "Enter", [live(SV)])))) {
				turfs = rt.modify(live(turfs), live(F), add);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(SV)]);
	if (!truthy(rt.len(f, live(turfs)))) return f.dot;
	yield* g.new_(f, T("/datum/spacevine_controller"), [(_T = rt.op(f, "PickUnweighted", [1], [live(turfs)]))]);
	return f.dot;
}, true);

rt.type(2297, "/datum/spacevine_mutation", "/datum", {
	name: "",
	severity: 1,
	hue: null,
	quality: null,
});

// /datum/spacevine_mutation/proc/add_mutation_to_vinepiece  (code/modules/events/spacevine.dm:32)
rt.def("/datum/spacevine_mutation/proc/add_mutation_to_vinepiece", function add_mutation_to_vinepiece(f: Frame, holder: Value) {
	(rt.modField(f, live(holder), "mutations", live(f.src), rt.bitOr));
	rt.callName(f, live(holder), "add_atom_colour", [rt.sv(f, "hue"), 4]);
	return f.dot;
});

// /datum/spacevine_mutation/proc/on_hit  (code/modules/events/spacevine.dm:51)
rt.def("/datum/spacevine_mutation/proc/on_hit", function on_hit(f: Frame, holder: Value, hitter: Value, I: Value, expected_damage: Value) {
	f.dot = live(expected_damage);
	return f.dot;
});

rt.type(2298, "/datum/spacevine_mutation/space_covering", "/datum/spacevine_mutation", {
	name: "space protective",
	hue: "#aa77aa",
	quality: 1,
}, { global: { coverable_turfs: 660 } });

// /datum/spacevine_mutation/space_covering/proc/New  (code/modules/events/spacevine.dm:81)
rt.def("/datum/spacevine_mutation/space_covering/proc/New", function New(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.gl("coverable_turfs"))) return f.dot;
	rt.setGl("coverable_turfs", subtract(rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/turf/open/space"))]), T("/turf/open/space/transit")));
	return f.dot;
});

// /datum/spacevine_mutation/space_covering/proc/on_grow  (code/modules/events/spacevine.dm:86)  may sleep
rt.def("/datum/spacevine_mutation/space_covering/proc/on_grow", function* on_grow(f: Frame, holder: Value) {
	f.vars = () => [holder];
	yield* g.srcCall(f, "process_mutation", live(holder));
	return f.dot;
}, true);

// /datum/spacevine_mutation/space_covering/proc/process_mutation  (code/modules/events/spacevine.dm:89)  may sleep
rt.def("/datum/spacevine_mutation/space_covering/proc/process_mutation", function* process_mutation(f: Frame, holder: Value) {
	let _T: Value = null, currtype: Value = null;
	f.vars = () => [holder, _T, currtype];
	if (!truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [(_T = rt.getStep(f, live(holder), 0)), rt.gl("coverable_turfs")])))) return f.dot;
	currtype = rt.fv(f, "type", live(_T));
	yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/open/floor/vines")]);
	rt.setFv(f, "baseturf", live(_T), live(currtype));
	return f.dot;
}, true);

// /datum/spacevine_mutation/space_covering/proc/on_death  (code/modules/events/spacevine.dm:96)  may sleep
rt.def("/datum/spacevine_mutation/space_covering/proc/on_death", function* on_death(f: Frame, holder: Value) {
	let _T: Value = null;
	f.vars = () => [holder, _T];
	if (!truthy((rt.istype((_T = rt.getStep(f, live(holder), 0)), T("/turf/open/floor/vines")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(_T), "ChangeTurf", [rt.fv(f, "baseturf", live(_T))]);
	return f.dot;
}, true);

rt.type(2299, "/datum/spacevine_mutation/bluespace", "/datum/spacevine_mutation", {
	name: "bluespace",
	hue: "#3333ff",
	quality: 3,
});

// /datum/spacevine_mutation/bluespace/proc/on_spread  (code/modules/events/spacevine.dm:106)  may sleep
rt.def("/datum/spacevine_mutation/bluespace/proc/on_spread", function* on_spread(f: Frame, holder: Value, target: Value) {
	f.vars = () => [holder, target];
	if (!(rt.gt(rt.fv(f, "energy", live(holder)), 1) && !truthy(rt.locateIn(f, T("/obj/structure/spacevine"), live(target))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "master", live(holder)), "spawn_spacevine_piece", [live(target), live(holder)]);
	return f.dot;
}, true);

rt.type(2300, "/datum/spacevine_mutation/light", "/datum/spacevine_mutation", {
	name: "light",
	hue: "#ffff00",
	quality: 1,
	severity: 4,
});

// /datum/spacevine_mutation/light/proc/on_grow  (code/modules/events/spacevine.dm:116)
rt.def("/datum/spacevine_mutation/light/proc/on_grow", function on_grow(f: Frame, holder: Value) {
	if (!truthy(rt.fv(f, "energy", live(holder)))) return f.dot;
	rt.callName(f, live(holder), "set_light", [rt.sv(f, "severity"), 0.30000001192092896]);
	return f.dot;
});

rt.type(2301, "/datum/spacevine_mutation/toxicity", "/datum/spacevine_mutation", {
	name: "toxic",
	hue: "#ff00ff",
	severity: 10,
	quality: 2,
});

// /datum/spacevine_mutation/toxicity/proc/on_cross  (code/modules/events/spacevine.dm:126)  may sleep
rt.def("/datum/spacevine_mutation/toxicity/proc/on_cross", function* on_cross(f: Frame, holder: Value, crosser: Value) {
	f.vars = () => [holder, crosser];
	if (truthy((rt.istype(live(crosser), T("/mob/living/silicon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!((truthy(rt.op(f, "Prob", [], [rt.sv(f, "severity")])) && truthy((rt.istype(live(crosser), T("/mob/living")) ? 1 : 0))) && !truthy((yield* g.call(f, P("/proc/isvineimmune"), null, [live(crosser)]))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(crosser), "<span class='alert'>You accidently touch the vine and feel a strange sensation.</span>"]);
	yield* g.callName(f, live(crosser), "adjustToxLoss", [5]);
	return f.dot;
}, true);

// /datum/spacevine_mutation/toxicity/proc/on_eat  (code/modules/events/spacevine.dm:133)  may sleep
rt.def("/datum/spacevine_mutation/toxicity/proc/on_eat", function* on_eat(f: Frame, holder: Value, eater: Value) {
	f.vars = () => [holder, eater];
	if (truthy((yield* g.call(f, P("/proc/isvineimmune"), null, [live(eater)])))) return f.dot;
	yield* g.callName(f, live(eater), "adjustToxLoss", [5]);
	return f.dot;
}, true);

rt.type(2302, "/datum/spacevine_mutation/explosive", "/datum/spacevine_mutation", {
	name: "explosive",
	hue: "#ff0000",
	quality: 2,
	severity: 2,
});

// /datum/spacevine_mutation/explosive/proc/on_explosion  (code/modules/events/spacevine.dm:143)  may sleep
rt.def("/datum/spacevine_mutation/explosive/proc/on_explosion", function* on_explosion(f: Frame, explosion_severity: Value, target: Value, holder: Value) {
	f.vars = () => [explosion_severity, target, holder];
	if (rt.lt(live(explosion_severity), 3)) {
		yield* g.call(f, P("/proc/qdel"), null, [live(holder)]);
	} else {
		f.dot = 1;
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(holder)])), 5, 8]);
	}
	return f.dot;
}, true);

// /datum/spacevine_mutation/explosive/proc/on_death  (code/modules/events/spacevine.dm:150)
rt.def("/datum/spacevine_mutation/explosive/proc/on_death", function on_death(f: Frame, holder: Value, hitter: Value, I: Value) {
	rt.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(holder)), 0, 0, rt.sv(f, "severity"), 0, 0]);
	return f.dot;
});

rt.type(2303, "/datum/spacevine_mutation/fire_proof", "/datum/spacevine_mutation", {
	name: "fire proof",
	hue: "#ff8888",
	quality: 3,
});

// /datum/spacevine_mutation/fire_proof/proc/on_hit  (code/modules/events/spacevine.dm:161)
rt.def("/datum/spacevine_mutation/fire_proof/proc/on_hit", function on_hit(f: Frame, holder: Value, hitter: Value, I: Value, expected_damage: Value) {
	if ((truthy(live(I)) && isEqual(rt.fv(f, "damtype", live(I)), "fire"))) {
		f.dot = 0;
	} else {
		f.dot = live(expected_damage);
	}
	return f.dot;
});

rt.type(2304, "/datum/spacevine_mutation/vine_eating", "/datum/spacevine_mutation", {
	name: "vine eating",
	hue: "#ff7700",
	quality: 3,
});

// /datum/spacevine_mutation/vine_eating/proc/on_spread  (code/modules/events/spacevine.dm:172)  may sleep
rt.def("/datum/spacevine_mutation/vine_eating/proc/on_spread", function* on_spread(f: Frame, holder: Value, target: Value) {
	let prey: Value = null;
	f.vars = () => [holder, target, prey];
	if (!(truthy((prey = rt.locateIn(f, T("/obj/structure/spacevine"), live(target)))) && !truthy((yield* g.callName(f, rt.fv(f, "mutations", live(prey)), "Find", [live(f.src)]))))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(prey)]);
	return f.dot;
}, true);

rt.type(2305, "/datum/spacevine_mutation/aggressive_spread", "/datum/spacevine_mutation", {
	name: "aggressive spreading",
	hue: "#333333",
	severity: 3,
	quality: 2,
});

// /datum/spacevine_mutation/aggressive_spread/proc/on_spread  (code/modules/events/spacevine.dm:183)
rt.def("/datum/spacevine_mutation/aggressive_spread/proc/on_spread", function on_spread(f: Frame, holder: Value, target: Value) {
	rt.callName(f, live(target), "ex_act", [rt.sv(f, "severity"), null, live(f.src)]);
	return f.dot;
});

// /datum/spacevine_mutation/aggressive_spread/proc/on_buckle  (code/modules/events/spacevine.dm:186)
rt.def("/datum/spacevine_mutation/aggressive_spread/proc/on_buckle", function on_buckle(f: Frame, holder: Value, buckled: Value) {
	rt.callName(f, live(buckled), "ex_act", [rt.sv(f, "severity"), null, live(f.src)]);
	return f.dot;
});

rt.type(2306, "/datum/spacevine_mutation/transparency", "/datum/spacevine_mutation", {
	name: "transparent",
	hue: "",
	quality: 1,
});

// /datum/spacevine_mutation/transparency/proc/on_grow  (code/modules/events/spacevine.dm:194)
rt.def("/datum/spacevine_mutation/transparency/proc/on_grow", function on_grow(f: Frame, holder: Value) {
	rt.callName(f, live(holder), "set_opacity", [0]);
	rt.setFv(f, "alpha", live(holder), 125);
	return f.dot;
});

rt.type(2307, "/datum/spacevine_mutation/oxy_eater", "/datum/spacevine_mutation", {
	name: "oxygen consuming",
	hue: "#ffff88",
	severity: 3,
	quality: 2,
});

// /datum/spacevine_mutation/oxy_eater/proc/process_mutation  (code/modules/events/spacevine.dm:205)
rt.def("/datum/spacevine_mutation/oxy_eater/proc/process_mutation", function process_mutation(f: Frame, holder: Value) {
	let _T: Value = null, GM: Value = null;
	f.vars = () => [_T, GM];
	if (!truthy((rt.istype((_T = rt.fv(f, "loc", live(holder))), T("/turf/open/floor")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.index(rt.gv(f, "gases", (GM = rt.fv(f, "air", live(_T)))), "o2"))) {
		return live(f.dot);
	}
	(rt.modAt(rt.index(rt.fv(f, "gases", live(GM)), "o2"), 1, multiply(rt.sv(f, "severity"), rt.fv(f, "energy", live(holder))), subtract));
	rt.callName(f, live(GM), "garbage_collect", []);
	return f.dot;
});

rt.type(2308, "/datum/spacevine_mutation/nitro_eater", "/datum/spacevine_mutation", {
	name: "nitrogen consuming",
	hue: "#8888ff",
	severity: 3,
	quality: 2,
});

// /datum/spacevine_mutation/nitro_eater/proc/process_mutation  (code/modules/events/spacevine.dm:220)
rt.def("/datum/spacevine_mutation/nitro_eater/proc/process_mutation", function process_mutation(f: Frame, holder: Value) {
	let _T: Value = null, GM: Value = null;
	f.vars = () => [_T, GM];
	if (!truthy((rt.istype((_T = rt.fv(f, "loc", live(holder))), T("/turf/open/floor")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.index(rt.gv(f, "gases", (GM = rt.fv(f, "air", live(_T)))), "n2"))) {
		return live(f.dot);
	}
	(rt.modAt(rt.index(rt.fv(f, "gases", live(GM)), "n2"), 1, multiply(rt.sv(f, "severity"), rt.fv(f, "energy", live(holder))), subtract));
	rt.callName(f, live(GM), "garbage_collect", []);
	return f.dot;
});

rt.type(2309, "/datum/spacevine_mutation/carbondioxide_eater", "/datum/spacevine_mutation", {
	name: "CO2 consuming",
	hue: "#00ffff",
	severity: 3,
	quality: 1,
});

// /datum/spacevine_mutation/carbondioxide_eater/proc/process_mutation  (code/modules/events/spacevine.dm:235)
rt.def("/datum/spacevine_mutation/carbondioxide_eater/proc/process_mutation", function process_mutation(f: Frame, holder: Value) {
	let _T: Value = null, GM: Value = null;
	f.vars = () => [_T, GM];
	if (!truthy((rt.istype((_T = rt.fv(f, "loc", live(holder))), T("/turf/open/floor")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.index(rt.gv(f, "gases", (GM = rt.fv(f, "air", live(_T)))), "co2"))) {
		return live(f.dot);
	}
	(rt.modAt(rt.index(rt.fv(f, "gases", live(GM)), "co2"), 1, multiply(rt.sv(f, "severity"), rt.fv(f, "energy", live(holder))), subtract));
	rt.callName(f, live(GM), "garbage_collect", []);
	return f.dot;
});

rt.type(2310, "/datum/spacevine_mutation/plasma_eater", "/datum/spacevine_mutation", {
	name: "toxins consuming",
	hue: "#ffbbff",
	severity: 3,
	quality: 1,
});

// /datum/spacevine_mutation/plasma_eater/proc/process_mutation  (code/modules/events/spacevine.dm:250)
rt.def("/datum/spacevine_mutation/plasma_eater/proc/process_mutation", function process_mutation(f: Frame, holder: Value) {
	let _T: Value = null, GM: Value = null;
	f.vars = () => [_T, GM];
	if (!truthy((rt.istype((_T = rt.fv(f, "loc", live(holder))), T("/turf/open/floor")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.index(rt.gv(f, "gases", (GM = rt.fv(f, "air", live(_T)))), "plasma"))) {
		return live(f.dot);
	}
	(rt.modAt(rt.index(rt.fv(f, "gases", live(GM)), "plasma"), 1, multiply(rt.sv(f, "severity"), rt.fv(f, "energy", live(holder))), subtract));
	rt.callName(f, live(GM), "garbage_collect", []);
	return f.dot;
});

rt.type(2311, "/datum/spacevine_mutation/thorns", "/datum/spacevine_mutation", {
	name: "thorny",
	hue: "#666666",
	severity: 10,
	quality: 2,
});

// /datum/spacevine_mutation/thorns/proc/on_cross  (code/modules/events/spacevine.dm:264)  may sleep
rt.def("/datum/spacevine_mutation/thorns/proc/on_cross", function* on_cross(f: Frame, holder: Value, crosser: Value) {
	let M: Value = null;
	f.vars = () => [holder, crosser, M];
	if (!((truthy(rt.op(f, "Prob", [], [rt.sv(f, "severity")])) && truthy((rt.istype(live(crosser), T("/mob/living")) ? 1 : 0))) && !truthy((yield* g.call(f, P("/proc/isvineimmune"), null, [live(holder)]))))) return f.dot;
	yield* g.callName(f, (M = live(crosser)), "adjustBruteLoss", [5]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='alert'>You cut yourself on the thorny vines.</span>"]);
	return f.dot;
}, true);

// /datum/spacevine_mutation/thorns/proc/on_hit  (code/modules/events/spacevine.dm:270)  may sleep
rt.def("/datum/spacevine_mutation/thorns/proc/on_hit", function* on_hit(f: Frame, holder: Value, hitter: Value, I: Value, expected_damage: Value) {
	let M: Value = null;
	f.vars = () => [holder, hitter, I, expected_damage, M];
	if (((truthy(rt.op(f, "Prob", [], [rt.sv(f, "severity")])) && truthy((rt.istype(live(hitter), T("/mob/living")) ? 1 : 0))) && !truthy((yield* g.call(f, P("/proc/isvineimmune"), null, [live(holder)]))))) {
		yield* g.callName(f, (M = live(hitter)), "adjustBruteLoss", [5]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='alert'>You cut yourself on the thorny vines.</span>"]);
	}
	f.dot = live(expected_damage);
	return f.dot;
}, true);

rt.type(2312, "/datum/spacevine_mutation/woodening", "/datum/spacevine_mutation", {
	name: "hardened",
	hue: "#997700",
	quality: 2,
});

// /datum/spacevine_mutation/woodening/proc/on_grow  (code/modules/events/spacevine.dm:282)
rt.def("/datum/spacevine_mutation/woodening/proc/on_grow", function on_grow(f: Frame, holder: Value) {
	if (truthy(rt.fv(f, "energy", live(holder)))) {
		rt.setFv(f, "density", live(holder), 1);
	}
	rt.setFv(f, "max_integrity", live(holder), 100);
	rt.setFv(f, "obj_integrity", live(holder), rt.fv(f, "max_integrity", live(holder)));
	return f.dot;
});

// /datum/spacevine_mutation/woodening/proc/on_hit  (code/modules/events/spacevine.dm:288)
rt.def("/datum/spacevine_mutation/woodening/proc/on_hit", function on_hit(f: Frame, holder: Value, hitter: Value, I: Value, expected_damage: Value) {
	if (truthy(rt.callName(f, live(I), "is_sharp", []))) {
		f.dot = multiply(live(expected_damage), 0.5);
	} else {
		f.dot = live(expected_damage);
	}
	return f.dot;
});

rt.type(2313, "/datum/spacevine_mutation/flowering", "/datum/spacevine_mutation", {
	name: "flowering",
	hue: "#0A480D",
	quality: 2,
	severity: 10,
});

// /datum/spacevine_mutation/flowering/proc/on_grow  (code/modules/events/spacevine.dm:300)  may sleep
rt.def("/datum/spacevine_mutation/flowering/proc/on_grow", function* on_grow(f: Frame, holder: Value) {
	f.vars = () => [holder];
	if (!((isEqual(rt.fv(f, "energy", live(holder)), 2) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "severity")]))) && !truthy(rt.locateIn(f, T("/obj/structure/alien/resin/flower_bud_enemy"), (yield* g.call(f, P("/proc/range"), null, [5, live(holder)])))))) return f.dot;
	yield* g.new_(f, T("/obj/structure/alien/resin/flower_bud_enemy"), [rt.getStep(f, live(holder), 0)]);
	return f.dot;
}, true);

// /datum/spacevine_mutation/flowering/proc/on_cross  (code/modules/events/spacevine.dm:304)  may sleep
rt.def("/datum/spacevine_mutation/flowering/proc/on_cross", function* on_cross(f: Frame, holder: Value, crosser: Value) {
	f.vars = () => [holder, crosser];
	if (!truthy(rt.op(f, "Prob", [], [25]))) return f.dot;
	yield* g.callName(f, live(holder), "entangle", [live(crosser)]);
	return f.dot;
}, true);

rt.type(12936, "/obj/structure/spacevine", "/obj/structure", {
	energy: 0,
	master: null,
	mutations: null,
	anchored: 1,
	pass_flags: 5,
	name: "space vines",
	desc: "An extremely expansionistic species of vine.",
	icon: rt.rsc("icons/effects/spacevines.dmi"),
	icon_state: "Light1",
	density: 0,
	layer: 4.8,
	mouse_opacity: 2,
	obj_integrity: 50,
	max_integrity: 50,
});

// /obj/structure/spacevine/proc/<init>  (code/modules/events/spacevine.dm:323)
rt.def("/obj/structure/spacevine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutations", rt.list());
	return f.dot;
});

// /obj/structure/spacevine/proc/Initialize  (code/modules/events/spacevine.dm:326)
rt.def("/obj/structure/spacevine/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "add_atom_colour", ["#ffffff", 4]);
	return f.dot;
});

// /obj/structure/spacevine/proc/examine  (code/modules/events/spacevine.dm:330)
rt.def("/obj/structure/spacevine/proc/examine", function examine(f: Frame) {
	let text: Value = null, A: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [text, A, SM, $e];
	rt.callSuper(f, [], rt.Args.Same);
	text = "This one is a";
	if (truthy(rt.len(f, rt.sv(f, "mutations")))) {
		A = null;
		rt.forList(f, 0, rt.sv(f, "mutations"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			text = rt.modify(live(text), fmt(" ＀", [rt.gv(f, "name", (SM = live(A)))]), add);
		}
		rt.endFor(f, 0);
	} else {
		text = rt.modify(live(text), " normal", add);
	}
	text = rt.modify(live(text), " vine.", add);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), live(text)]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/spacevine/proc/Destroy  (code/modules/events/spacevine.dm:342)  may sleep
rt.def("/obj/structure/spacevine/proc/Destroy", function* Destroy(f: Frame) {
	let SM: Value = null;
	let $e: any;
	f.vars = () => [SM, $e];
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		yield* g.callName(f, live(SM), "on_death", [live(f.src)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "master"))) {
		yield* g.callName(f, rt.sv(f, "master"), "VineDestroyed", [live(f.src)]);
	}
	rt.setSv(f, "mutations", rt.list());
	yield* g.srcCall(f, "set_opacity", 0);
	if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
		yield* g.callSrc(f, "unbuckle_all_mobs", ["force", 1], rt.Args.Named);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/spacevine/proc/on_chem_effect  (code/modules/events/spacevine.dm:354)  may sleep
rt.def("/obj/structure/spacevine/proc/on_chem_effect", function* on_chem_effect(f: Frame, R: Value) {
	let override: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [R, override, SM, $e];
	override = 0;
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		override = rt.modify(live(override), (yield* g.callName(f, live(SM), "on_chem", [live(f.src), live(R)])), add);
	}
	rt.endFor(f, 0);
	if (!(!truthy(live(override)) && truthy((rt.istype(live(R), T("/datum/reagent/toxin/plantbgone")) ? 1 : 0)))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/spacevine/proc/eat  (code/modules/events/spacevine.dm:362)  may sleep
rt.def("/obj/structure/spacevine/proc/eat", function* eat(f: Frame, eater: Value) {
	let override: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [eater, override, SM, $e];
	override = 0;
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		override = rt.modify(live(override), (yield* g.callName(f, live(SM), "on_eat", [live(f.src), live(eater)])), add);
	}
	rt.endFor(f, 0);
	if (truthy(live(override))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/spacevine/proc/attackby  (code/modules/events/spacevine.dm:369)  may sleep
rt.def("/obj/structure/spacevine/proc/attackby", function* attackby(f: Frame) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [B, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/scythe")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
		B = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, live(f.src)])), T("/obj/structure/spacevine"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			yield* g.callName(f, live(B), "take_damage", [multiply(rt.fv(f, "force", live(f.args[0])), 4), "brute", "melee", 1]);
		}
		rt.endFor(f, 0);
		return live(f.dot);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/spacevine/proc/attacked_by  (code/modules/events/spacevine.dm:380)  may sleep
rt.def("/obj/structure/spacevine/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	let damage_dealt: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [I, user, damage_dealt, SM, $e];
	damage_dealt = rt.fv(f, "force", live(I));
	if (truthy((yield* g.callName(f, live(I), "is_sharp", [])))) {
		(damage_dealt = rt.modify(live(damage_dealt), 4, multiply));
	}
	if (isEqual(rt.fv(f, "damtype", live(I)), "fire")) {
		(damage_dealt = rt.modify(live(damage_dealt), 4, multiply));
	}
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		damage_dealt = (yield* g.callName(f, live(SM), "on_hit", [live(f.src), live(user), live(I), live(damage_dealt)]));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "take_damage", live(damage_dealt), rt.fv(f, "damtype", live(I)), "melee", 1);
	return f.dot;
}, true);

// /obj/structure/spacevine/proc/play_attack_sound  (code/modules/events/spacevine.dm:390)
rt.def("/obj/structure/spacevine/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
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
			rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/slash.ogg"), 50, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/structure/spacevine/proc/Crossed  (code/modules/events/spacevine.dm:400)  may sleep
rt.def("/obj/structure/spacevine/proc/Crossed", function* Crossed(f: Frame, crosser: Value) {
	let SM: Value = null;
	let $e: any;
	f.vars = () => [crosser, SM, $e];
	if (!truthy((rt.istype(live(crosser), T("/mob/living")) ? 1 : 0))) return f.dot;
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		yield* g.callName(f, live(SM), "on_cross", [live(f.src), live(crosser)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/spacevine/proc/attack_hand  (code/modules/events/spacevine.dm:405)  may sleep
rt.def("/obj/structure/spacevine/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let SM: Value = null;
	let $e: any;
	f.vars = () => [user, SM, $e];
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		yield* g.callName(f, live(SM), "on_hit", [live(f.src), live(user)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "user_unbuckle_mob", live(user), live(user));
	return f.dot;
}, true);

// /obj/structure/spacevine/proc/attack_paw  (code/modules/events/spacevine.dm:411)  may sleep
rt.def("/obj/structure/spacevine/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	let SM: Value = null;
	let $e: any;
	f.vars = () => [user, SM, $e];
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		yield* g.callName(f, live(SM), "on_hit", [live(f.src), live(user)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "user_unbuckle_mob", live(user), live(user));
	return f.dot;
}, true);

// /obj/structure/spacevine/proc/attack_alien  (code/modules/events/spacevine.dm:416)  may sleep
rt.def("/obj/structure/spacevine/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "eat", live(user));
	return f.dot;
}, true);

rt.type(2314, "/datum/spacevine_controller", "/datum", {
	vines: null,
	growth_queue: null,
	spread_multiplier: 5,
	spread_cap: 30,
	vine_mutations_list: null,
	mutativeness: 1,
});

// /datum/spacevine_controller/proc/New  (code/modules/events/spacevine.dm:427)  may sleep
rt.def("/datum/spacevine_controller/proc/New", function* New(f: Frame, location: Value, muts: Value, potency: Value, production: Value) {
	f.vars = () => [location, muts, potency, production];
	rt.setSv(f, "vines", rt.list());
	rt.setSv(f, "growth_queue", rt.list());
	yield* g.srcCall(f, "spawn_spacevine_piece", live(location), null, live(muts));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	rt.setSv(f, "vine_mutations_list", rt.list());
	yield* g.call(f, P("/proc/init_subtypes"), null, [T("/datum/spacevine_mutation"), rt.sv(f, "vine_mutations_list")]);
	if (live(potency) !== null) {
		rt.setSv(f, "mutativeness", divide(live(potency), 10));
	}
	if (live(production) === null) return f.dot;
	(rt.modSrcVar(f, "spread_cap", divide(live(production), 5), multiply));
	(rt.modSrcVar(f, "spread_multiplier", divide(live(production), 5), divide));
	return f.dot;
}, true);

// /datum/spacevine_controller/proc/vv_get_dropdown  (code/modules/events/spacevine.dm:440)
rt.def("/datum/spacevine_controller/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setAt((f.dot = rt.modify(live(f.dot), "---", add)), "Delete Vines", fmt("?_src_=＃;purge_vines=1", [live(f.src)]));
	return f.dot;
});

// /datum/spacevine_controller/proc/Topic  (code/modules/events/spacevine.dm:445)  may sleep
rt.def("/datum/spacevine_controller/proc/Topic", function* Topic(f: Frame) {
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || !truthy((yield* g.call(f, P("/proc/check_rights"), null, [2, 0]))))) {
		return live(f.dot);
	}
	if (!truthy(rt.at(live(f.args[1]), "purge_vines"))) return f.dot;
	if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Are you sure you want to delete this spacevine cluster?", "Delete Vines", "Yes", "No"])), "Yes")) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "DeleteVines");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /datum/spacevine_controller/proc/DeleteVines  (code/modules/events/spacevine.dm:454)  may sleep
rt.def("/datum/spacevine_controller/proc/DeleteVines", function* DeleteVines(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (!truthy(rt.sv(f, "vines"))) return f.dot;
	I = null;
	rt.forList(f, 0, rt.sv(f, "vines"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "vines"), "Cut", []);
	return f.dot;
}, true);

// /datum/spacevine_controller/proc/Destroy  (code/modules/events/spacevine.dm:457)  may sleep
rt.def("/datum/spacevine_controller/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/spacevine_controller/proc/spawn_spacevine_piece  (code/modules/events/spacevine.dm:461)  may sleep
rt.def("/datum/spacevine_controller/proc/spawn_spacevine_piece", function* spawn_spacevine_piece(f: Frame, location: Value, parent: Value, muts: Value) {
	let SV: Value = null, M: Value = null, parentcolor: Value = null, randmut: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [location, parent, muts, SV, M, parentcolor, randmut, SM, $e];
	rt.modSrcVar(f, "growth_queue", (SV = (yield* g.new_(f, T("/obj/structure/spacevine"), [live(location)]))), add);
	rt.modSrcVar(f, "vines", live(SV), add);
	rt.setFv(f, "master", live(SV), live(f.src));
	if ((truthy(live(muts)) && truthy(rt.len(f, live(muts))))) {
		M = null;
		rt.forList(f, 0, live(muts), T("/datum/spacevine_mutation"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.callName(f, live(M), "add_mutation_to_vinepiece", [live(SV)]);
		}
		rt.endFor(f, 0);
		return live(f.dot);
	}
	if (truthy(live(parent))) {
		(rt.modField(f, live(SV), "mutations", rt.fv(f, "mutations", live(parent)), rt.bitOr));
		parentcolor = rt.index(rt.fv(f, "atom_colours", live(parent)), 4);
		yield* g.callName(f, live(SV), "add_atom_colour", [live(parentcolor), 4]);
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "mutativeness")]))) {
			yield* g.callName(f, (randmut = rt.op(f, "PickUnweighted", [1], [subtract(rt.sv(f, "vine_mutations_list"), rt.fv(f, "mutations", live(SV)))])), "add_mutation_to_vinepiece", [live(SV)]);
		}
	}
	SM = null;
	rt.forList(f, 0, rt.fv(f, "mutations", live(SV)), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		yield* g.callName(f, live(SM), "on_birth", [live(SV)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(location), "Entered", [live(SV)]);
	return f.dot;
}, true);

// /datum/spacevine_controller/proc/VineDestroyed  (code/modules/events/spacevine.dm:482)  may sleep
rt.def("/datum/spacevine_controller/proc/VineDestroyed", function* VineDestroyed(f: Frame, S: Value) {
	let KZ: Value = null;
	f.vars = () => [S, KZ];
	rt.setFv(f, "master", live(S), null);
	(rt.modSrcVar(f, "vines", live(S), subtract));
	(rt.modSrcVar(f, "growth_queue", live(S), subtract));
	if (truthy(rt.len(f, rt.sv(f, "vines")))) return f.dot;
	(rt.modField(f, (KZ = (yield* g.new_(f, T("/obj/item/seeds/kudzu"), [rt.fv(f, "loc", live(S))]))), "mutations", rt.fv(f, "mutations", live(S)), rt.bitOr));
	yield* g.callName(f, live(KZ), "set_potency", [multiply(rt.sv(f, "mutativeness"), 10)]);
	yield* g.callName(f, live(KZ), "set_production", [multiply(divide(rt.sv(f, "spread_cap"), rt.initial(f, live(f.src), "spread_cap")), 5)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/spacevine_controller/proc/process  (code/modules/events/spacevine.dm:493)  may sleep
rt.def("/datum/spacevine_controller/proc/process", function* process(f: Frame) {
	let length: Value = null, i: Value = null, queue_end: Value = null, SV: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [length, i, queue_end, SV, SM, $e];
	if (!truthy(rt.length(rt.sv(f, "vines")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "growth_queue"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	length = 0;
	length = (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "spread_cap"), (yield* g.call(f, P("/proc/max"), null, [1, divide(rt.len(f, rt.sv(f, "vines")), rt.sv(f, "spread_multiplier"))]))]));
	i = 0;
	queue_end = rt.list();
	SV = null;
	rt.forList(f, 0, rt.sv(f, "growth_queue"), T("/obj/structure/spacevine"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SV = $e;
		if ((!truthy(live(SV)) || truthy(rt.fv(f, "gc_destroyed", live(SV))))) {
			continue;
		}
		i = rt.inc(live(i), 1);
		queue_end = rt.modify(live(queue_end), live(SV), add);
		(rt.modSrcVar(f, "growth_queue", live(SV), subtract));
		SM = null;
		rt.forList(f, 1, rt.fv(f, "mutations", live(SV)), T("/datum/spacevine_mutation"));
		while (($e = rt.next(f, 1)) !== undefined) {
			SM = $e;
			yield* g.callName(f, live(SM), "process_mutation", [live(SV)]);
		}
		rt.endFor(f, 1);
		if (rt.lt(rt.fv(f, "energy", live(SV)), 2)) {
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, live(SV), "grow", []);
			}
		} else {
			yield* g.callName(f, live(SV), "entangle_mob", []);
		}
		yield* g.callName(f, live(SV), "spread", []);
		if (rt.ge(live(i), live(length))) {
			break;
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "growth_queue", add(rt.sv(f, "growth_queue"), live(queue_end)));
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/spacevine/proc/grow  (code/modules/events/spacevine.dm:528)  may sleep
rt.def("/obj/structure/spacevine/proc/grow", function* grow(f: Frame) {
	let SM: Value = null;
	let $e: any;
	f.vars = () => [SM, $e];
	if (!truthy(rt.sv(f, "energy"))) {
		rt.setFv(f, "icon_state", live(f.src), rt.op(f, "PickUnweighted", [3], ["Med1", "Med2", "Med3"]));
		rt.setSv(f, "energy", 1);
		yield* g.srcCall(f, "set_opacity", 1);
	} else {
		rt.setFv(f, "icon_state", live(f.src), rt.op(f, "PickUnweighted", [3], ["Hvy1", "Hvy2", "Hvy3"]));
		rt.setSv(f, "energy", 2);
	}
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		yield* g.callName(f, live(SM), "on_grow", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/spacevine/proc/entangle_mob  (code/modules/events/spacevine.dm:540)  may sleep
rt.def("/obj/structure/spacevine/proc/entangle_mob", function* entangle_mob(f: Frame) {
	let V: Value = null;
	let $e: any;
	f.vars = () => [V, $e];
	if (!(!truthy((yield* g.srcCall(f, "has_buckled_mobs"))) && truthy(rt.op(f, "Prob", [], [25])))) return f.dot;
	V = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		yield* g.srcCall(f, "entangle", live(V));
		if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/spacevine/proc/entangle  (code/modules/events/spacevine.dm:548)  may sleep
rt.def("/obj/structure/spacevine/proc/entangle", function* entangle(f: Frame, V: Value) {
	let SM: Value = null;
	let $e: any;
	f.vars = () => [V, SM, $e];
	if ((!truthy(live(V)) || truthy((yield* g.call(f, P("/proc/isvineimmune"), null, [live(V)]))))) {
		return live(f.dot);
	}
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		yield* g.callName(f, live(SM), "on_buckle", [live(f.src), live(V)]);
	}
	rt.endFor(f, 0);
	if (!(!isEqual(rt.fv(f, "stat", live(V)), 2) && !isEqual(rt.fv(f, "buckled", live(V)), live(f.src)))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(V), fmt("<span class='danger'>The vines ＀ around you!</span>", [rt.op(f, "PickUnweighted", [3], ["wind", "tangle", "tighten"])])]);
	yield* g.srcCall(f, "buckle_mob", live(V), 1);
	return f.dot;
}, true);

// /obj/structure/spacevine/proc/spread  (code/modules/events/spacevine.dm:557)  may sleep
rt.def("/obj/structure/spacevine/proc/spread", function* spread(f: Frame) {
	let direction: Value = null, stepturf: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [direction, stepturf, SM, $e];
	direction = rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]);
	stepturf = rt.getStep(f, live(f.src), live(direction));
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		yield* g.callName(f, live(SM), "on_spread", [live(f.src), live(stepturf)]);
		stepturf = rt.getStep(f, live(f.src), live(direction));
	}
	rt.endFor(f, 0);
	if (truthy(rt.locateIn(f, T("/obj/structure/spacevine"), live(stepturf)))) return f.dot;
	if (!truthy((yield* g.callName(f, live(stepturf), "Enter", [live(f.src)])))) return f.dot;
	if (!truthy(rt.sv(f, "master"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "master"), "spawn_spacevine_piece", [live(stepturf), live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/spacevine/proc/ex_act  (code/modules/events/spacevine.dm:568)  may sleep
rt.def("/obj/structure/spacevine/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let i: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [severity, target, i, SM, $e];
	if (truthy(rt.op(f, "IsType", [], [live(target), rt.sv(f, "type")]))) {
		return live(f.dot);
	}
	i = null;
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		i = rt.modify(live(i), (yield* g.callName(f, live(SM), "on_explosion", [live(severity), live(target), live(f.src)])), add);
	}
	rt.endFor(f, 0);
	if (!(!truthy(live(i)) && truthy(rt.op(f, "Prob", [], [divide(100, live(severity))])))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/spacevine/proc/temperature_expose  (code/modules/events/spacevine.dm:578)  may sleep
rt.def("/obj/structure/spacevine/proc/temperature_expose", function* temperature_expose(f: Frame, _null: Value, temp: Value, volume: Value) {
	let override: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [_null, temp, volume, override, SM, $e];
	override = 0;
	SM = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/spacevine_mutation"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		override = rt.modify(live(override), (yield* g.callName(f, live(SM), "process_temperature", [live(f.src), live(temp), live(volume)])), add);
	}
	rt.endFor(f, 0);
	if (truthy(live(override))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/spacevine/proc/CanPass  (code/modules/events/spacevine.dm:584)
rt.def("/obj/structure/spacevine/proc/CanPass", function CanPass(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (truthy(rt.call(f, P("/proc/isvineimmune"), null, [live(f.args[0])]))) {
		f.dot = 1;
	} else {
		f.dot = rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["mover", "target", "height"] });

// /proc/isvineimmune  (code/modules/events/spacevine.dm:591)
rt.def("/proc/isvineimmune", function isvineimmune(f: Frame, A: Value) {
	let M: Value = null;
	f.vars = () => [M];
	f.dot = 0;
	if (!truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) return f.dot;
	M = live(A);
	if (!(truthy((rt.isIn(f, "vines", rt.fv(f, "faction", live(M))) ? 1 : 0)) || truthy((rt.isIn(f, "plants", rt.fv(f, "faction", live(M))) ? 1 : 0)))) return f.dot;
	f.dot = 1;
	return f.dot;
});
