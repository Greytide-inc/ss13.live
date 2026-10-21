// From code/game/objects/effects/effect_system/effects_foam.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11919, "/obj/effect/particle_effect/foam", "/obj/effect/particle_effect", {
	amount: 3,
	metal: 0,
	lifetime: 40,
	reagent_divisor: 7,
	anchored: 1,
	name: "foam",
	icon_state: "foam",
	opacity: 0,
	density: 0,
	layer: 4.25,
	mouse_opacity: 0,
	animate_movement: 0,
}, { global: { blacklisted_turfs: 781 } });

// /obj/effect/particle_effect/foam/proc/New  (code/game/objects/effects/effect_system/effects_foam.dm:42)  may sleep
rt.def("/obj/effect/particle_effect/foam/proc/New", function* New(f: Frame, loc: Value) {
	f.vars = () => [loc];
	yield* g.callSuper(f, [live(loc)]);
	yield* g.srcCall(f, "create_reagents", 1000);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/bubbles2.ogg"), 80, 1, -3]);
	return f.dot;
}, true);

// /obj/effect/particle_effect/foam/proc/Destroy  (code/game/objects/effects/effect_system/effects_foam.dm:48)  may sleep
rt.def("/obj/effect/particle_effect/foam/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/particle_effect/foam/proc/kill_foam  (code/game/objects/effects/effect_system/effects_foam.dm:53)  may sleep
rt.def("/obj/effect/particle_effect/foam/proc/kill_foam", function* kill_foam(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	$0 = rt.sv(f, "metal");
	if ($0 === 1) {
		yield* g.new_(f, T("/obj/structure/foamedmetal"), [rt.getStep(f, live(f.src), 0)]);
	} else if ($0 === 2) {
		yield* g.new_(f, T("/obj/structure/foamedmetal/iron"), [rt.getStep(f, live(f.src), 0)]);
	} else if ($0 === 3) {
		yield* g.new_(f, T("/obj/structure/foamedmetal/resin"), [rt.getStep(f, live(f.src), 0)]);
	}
	yield* g.call(f, P("/proc/flick"), null, [fmt("＀-disolve", [rt.sv(f, "icon_state")]), live(f.src)]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 5, 8]);
	return f.dot;
}, true);

// /obj/effect/particle_effect/foam/proc/process  (code/game/objects/effects/effect_system/effects_foam.dm:65)  may sleep
rt.def("/obj/effect/particle_effect/foam/proc/process", function* process(f: Frame) {
	let fraction: Value = null, O: Value = null, _T: Value = null, hit: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [fraction, O, _T, hit, L, $e];
	rt.incSrcVar(f, "lifetime", -1, true);
	if (rt.lt(rt.sv(f, "lifetime"), 1)) {
		yield* g.srcCall(f, "kill_foam");
		return live(f.dot);
	}
	fraction = divide(1, rt.initial(f, live(f.src), "reagent_divisor"));
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [0, live(f.src)])), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (isEqual(rt.fv(f, "type", live(O)), rt.fv(f, "type", live(f.src)))) {
			continue;
		}
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(O))])))) {
			if ((truthy(rt.gv(f, "intact", (_T = rt.fv(f, "loc", live(O))))) && isEqual(rt.fv(f, "level", live(O)), 1))) {
				continue;
			}
		}
		if (truthy(rt.modulus(rt.sv(f, "lifetime"), rt.sv(f, "reagent_divisor")))) {
			yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(O), 3, live(fraction)]);
		}
	}
	rt.endFor(f, 0);
	hit = 0;
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [0, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		hit = rt.modify(live(hit), (yield* g.srcCall(f, "foam_mob", live(L))), add);
	}
	rt.endFor(f, 0);
	if (truthy(live(hit))) {
		rt.incSrcVar(f, "lifetime", 1, true);
	}
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy(rt.modulus(rt.sv(f, "lifetime"), rt.sv(f, "reagent_divisor")))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(_T), 3, live(fraction)]);
	}
	if (rt.lt(rt.incSrcVar(f, "amount", -1, false), 0)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "spread_foam");
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/particle_effect/foam/proc/foam_mob  (code/game/objects/effects/effect_system/effects_foam.dm:94)  may sleep
rt.def("/obj/effect/particle_effect/foam/proc/foam_mob", function* foam_mob(f: Frame, L: Value) {
	let fraction: Value = null;
	f.vars = () => [L, fraction];
	if (rt.lt(rt.sv(f, "lifetime"), 1)) {
		return 0;
	}
	if (!truthy((rt.istype(live(L), T("/mob/living")) ? 1 : 0))) {
		return 0;
	}
	fraction = divide(1, rt.initial(f, live(f.src), "reagent_divisor"));
	if (truthy(rt.modulus(rt.sv(f, "lifetime"), rt.sv(f, "reagent_divisor")))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(L), 3, live(fraction)]);
	}
	rt.incSrcVar(f, "lifetime", -1, true);
	return 1;
}, true);

// /obj/effect/particle_effect/foam/proc/Crossed  (code/game/objects/effects/effect_system/effects_foam.dm:105)  may sleep
rt.def("/obj/effect/particle_effect/foam/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let M: Value = null;
	f.vars = () => [AM, M];
	if (!truthy((rt.istype(live(AM), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (M = live(AM)), "slip", [100, live(f.src)]);
	return f.dot;
}, true);

// /obj/effect/particle_effect/foam/proc/spread_foam  (code/game/objects/effects/effect_system/effects_foam.dm:114)  may sleep
rt.def("/obj/effect/particle_effect/foam/proc/spread_foam", function* spread_foam(f: Frame) {
	let t_loc: Value = null, _T: Value = null, foundfoam: Value = null, L: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [t_loc, _T, foundfoam, L, F, $e];
	t_loc = rt.getStep(f, live(f.src), 0);
	_T = null;
	rt.forList(f, 0, (yield* g.callName(f, live(t_loc), "GetAtmosAdjacentTurfs", [])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((foundfoam = rt.locateIn(f, T("/obj/effect/particle_effect/foam"), live(_T))))) {
			continue;
		}
		if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(_T), rt.gl("blacklisted_turfs")])))) {
			continue;
		}
		L = null;
		rt.forList(f, 1, live(_T), T("/mob/living"));
		while (($e = rt.next(f, 1)) !== undefined) {
			L = $e;
			yield* g.srcCall(f, "foam_mob", live(L));
		}
		rt.endFor(f, 1);
		rt.setFv(f, "amount", (F = (yield* g.new_(f, rt.fv(f, "type", live(f.src)), [live(_T)]))), rt.sv(f, "amount"));
		yield* g.callName(f, rt.sv(f, "reagents"), "copy_to", [live(F), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
		yield* g.callName(f, live(F), "add_atom_colour", [rt.sv(f, "color"), 4]);
		rt.setFv(f, "metal", live(F), rt.sv(f, "metal"));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/particle_effect/foam/proc/temperature_expose  (code/game/objects/effects/effect_system/effects_foam.dm:133)  may sleep
rt.def("/obj/effect/particle_effect/foam/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/max"), null, [0, subtract(live(exposed_temperature), 475)]))]))) return f.dot;
	yield* g.srcCall(f, "kill_foam");
	return f.dot;
}, true);

rt.type(1514, "/datum/effect_system/foam_spread", "/datum/effect_system", {
	amount: 10,
	chemholder: null,
	metal: 0,
	effect_type: rt.typePath("/obj/effect/particle_effect/foam"),
});

// /datum/effect_system/foam_spread/proc/New  (code/game/objects/effects/effect_system/effects_foam.dm:155)  may sleep
rt.def("/datum/effect_system/foam_spread/proc/New", function* New(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chemholder", (yield* g.new_(f, T("/obj"), [])));
	R = (yield* g.new_(f, T("/datum/reagents"), [1000]));
	rt.setFv(f, "reagents", rt.sv(f, "chemholder"), live(R));
	rt.setFv(f, "my_atom", live(R), rt.sv(f, "chemholder"));
	return f.dot;
}, true);

// /datum/effect_system/foam_spread/proc/Destroy  (code/game/objects/effects/effect_system/effects_foam.dm:162)  may sleep
rt.def("/datum/effect_system/foam_spread/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "chemholder")]);
	rt.setSv(f, "chemholder", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/effect_system/foam_spread/proc/set_up  (code/game/objects/effects/effect_system/effects_foam.dm:167)  may sleep
rt.def("/datum/effect_system/foam_spread/proc/set_up", function* set_up(f: Frame, amt: Value, loca: Value, carry: Value) {
	f.vars = () => [amt, loca, carry];
	if (live(amt) === null) {
		amt = 5;
	}
	if (live(carry) === null) {
		carry = null;
	}
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(loca)])))) {
		rt.setSv(f, "location", live(loca));
	} else {
		rt.setSv(f, "location", rt.getStep(f, live(loca), 0));
	}
	rt.setSv(f, "amount", (yield* g.call(f, P("/proc/round"), null, [rt.op(f, "Sqrt", [], [divide(live(amt), 2)]), 1])));
	yield* g.callName(f, live(carry), "copy_to", [rt.sv(f, "chemholder"), multiply(4, rt.fv(f, "total_volume", live(carry)))]);
	return f.dot;
}, true);

rt.type(1515, "/datum/effect_system/foam_spread/metal", "/datum/effect_system/foam_spread", {
	effect_type: rt.typePath("/obj/effect/particle_effect/foam/metal"),
});

// /datum/effect_system/foam_spread/metal/proc/set_up  (code/game/objects/effects/effect_system/effects_foam.dm:176)  may sleep
rt.def("/datum/effect_system/foam_spread/metal/proc/set_up", function* set_up(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 5;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = null;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "metal", live(f.args[3]));
	return f.dot;
}, true, { args: ["amt", "loca", "carry", "metaltype"] });

// /datum/effect_system/foam_spread/proc/start  (code/game/objects/effects/effect_system/effects_foam.dm:180)  may sleep
rt.def("/datum/effect_system/foam_spread/proc/start", function* start(f: Frame) {
	let foundfoam: Value = null, F: Value = null, foamcolor: Value = null;
	f.vars = () => [foundfoam, F, foamcolor];
	if (truthy((foundfoam = rt.locateIn(f, T("/obj/effect/particle_effect/foam"), rt.sv(f, "location"))))) {
		rt.modField(f, live(foundfoam), "amount", rt.sv(f, "amount"), add);
	} else {
		F = (yield* g.new_(f, rt.sv(f, "effect_type"), [rt.sv(f, "location")]));
		foamcolor = (yield* g.call(f, P("/proc/mix_color_from_reagents"), null, [rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "chemholder")))]));
		yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "chemholder")), "copy_to", [live(F), divide(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "chemholder"))), rt.sv(f, "amount"))]);
		yield* g.callName(f, live(F), "add_atom_colour", [live(foamcolor), 4]);
		rt.setFv(f, "amount", live(F), rt.sv(f, "amount"));
		rt.setFv(f, "metal", live(F), rt.sv(f, "metal"));
	}
	return f.dot;
}, true);

rt.type(12704, "/obj/structure/foamedmetal", "/obj/structure", {
	anchored: 1,
	CanAtmosPass: -2,
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "metalfoam",
	density: 1,
	opacity: 1,
	resistance_flags: 34,
	name: "foamed metal",
	desc: "A lightweight foamed metal wall.",
	gender: "plural",
	obj_integrity: 20,
	max_integrity: 20,
});

// /obj/structure/foamedmetal/proc/New  (code/game/objects/effects/effect_system/effects_foam.dm:209)  may sleep
rt.def("/obj/structure/foamedmetal/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "air_update_turf", 1);
	return f.dot;
}, true);

// /obj/structure/foamedmetal/proc/Destroy  (code/game/objects/effects/effect_system/effects_foam.dm:215)  may sleep
rt.def("/obj/structure/foamedmetal/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "density", 0);
	yield* g.srcCall(f, "air_update_turf", 1);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/foamedmetal/proc/Move  (code/game/objects/effects/effect_system/effects_foam.dm:219)  may sleep
rt.def("/obj/structure/foamedmetal/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.sv(f, "loc");
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "move_update_air", live(_T));
	return f.dot;
}, true);

// /obj/structure/foamedmetal/proc/attack_paw  (code/game/objects/effects/effect_system/effects_foam.dm:224)  may sleep
rt.def("/obj/structure/foamedmetal/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/structure/foamedmetal/proc/play_attack_sound  (code/game/objects/effects/effect_system/effects_foam.dm:227)
rt.def("/obj/structure/foamedmetal/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	f.vars = () => [damage_type, damage_flag];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/tap.ogg"), 100, 1]);
	return f.dot;
});

// /obj/structure/foamedmetal/proc/attack_hand  (code/game/objects/effects/effect_system/effects_foam.dm:230)  may sleep
rt.def("/obj/structure/foamedmetal/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "do_attack_animation", [live(f.src), "punch"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You hit ＀ but bounce off it!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/tap.ogg"), 100, 1]);
	return f.dot;
}, true);

// /obj/structure/foamedmetal/proc/CanPass  (code/game/objects/effects/effect_system/effects_foam.dm:236)
rt.def("/obj/structure/foamedmetal/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 1.5;
	}
	return (!truthy(rt.sv(f, "density")) ? 1 : 0);
});

rt.type(12706, "/obj/structure/foamedmetal/resin", "/obj/structure/foamedmetal", {
	name: "ATMOS Resin",
	desc: "A lightweight, transparent resin used to suffocate fires, scrub the air of toxins, and restore the air to a safe temperature",
	opacity: 0,
	icon_state: "atmos_resin",
	alpha: 120,
	obj_integrity: 10,
	max_integrity: 10,
	layer: 4.3,
});

// /obj/structure/foamedmetal/resin/proc/Initialize  (code/game/objects/effects/effect_system/effects_foam.dm:255)  may sleep
rt.def("/obj/structure/foamedmetal/resin/proc/Initialize", function* Initialize(f: Frame) {
	let O: Value = null, G: Value = null, H: Value = null, G_gases: Value = null, I: Value = null, U: Value = null, L: Value = null, Item: Value = null;
	let $e: any;
	f.vars = () => [O, G, H, G_gases, I, U, L, Item, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open")) ? 1 : 0))) return f.dot;
	if (truthy(rt.gv(f, "air", (O = rt.sv(f, "loc"))))) {
		rt.setFv(f, "temperature", (G = rt.fv(f, "air", live(O))), 293.1499938964844);
		H = null;
		rt.forList(f, 0, live(O), T("/obj/effect/hotspot"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
		}
		rt.endFor(f, 0);
		G_gases = rt.fv(f, "gases", live(G));
		I = null;
		rt.forList(f, 0, live(G_gases));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if ((!isEqual(live(I), "o2") && !isEqual(live(I), "n2"))) {
				rt.setAt(rt.index(rt.fv(f, "gases", live(G)), live(I)), 1, 0);
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(G), "garbage_collect", []);
		yield* g.callName(f, live(O), "air_update_turf", []);
	}
	U = null;
	rt.forList(f, 0, live(O), T("/obj/machinery/atmospherics/components/unary"));
	while (($e = rt.next(f, 0)) !== undefined) {
		U = $e;
		if (!truthy(rt.fv(f, "welded", live(U)))) {
			rt.setFv(f, "welded", live(U), 1);
			yield* g.callName(f, live(U), "update_icon", []);
			yield* g.callName(f, live(U), "visible_message", [fmt("<span class='danger'>＀ sealed shut!</span>", [live(U)])]);
		}
	}
	rt.endFor(f, 0);
	L = null;
	rt.forList(f, 0, live(O), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.callName(f, live(L), "ExtinguishMob", []);
	}
	rt.endFor(f, 0);
	Item = null;
	rt.forList(f, 0, live(O), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Item = $e;
		yield* g.callName(f, live(Item), "extinguish", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/foamedmetal/resin/proc/CanPass  (code/game/objects/effects/effect_system/effects_foam.dm:280)
rt.def("/obj/structure/foamedmetal/resin/proc/CanPass", function CanPass(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(f.args[0]), "checkpass", [2])))) {
		return 1;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["mover", "target", "height"] });
