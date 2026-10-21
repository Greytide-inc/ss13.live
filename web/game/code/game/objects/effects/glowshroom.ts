// From code/game/objects/effects/glowshroom.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12700, "/obj/structure/glowshroom", "/obj/structure", {
	delay: 1200,
	floor: 0,
	generation: 1,
	spreadIntoAdjacentChance: 60,
	myseed: rt.typePath("/obj/item/seeds/glowshroom"),
	anchored: 1,
	name: "glowshroom",
	desc: "Mycena Bregprox, a species of mushroom that glows in the dark.",
	opacity: 0,
	density: 0,
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "glowshroom",
	layer: 2.08,
	obj_integrity: 30,
	max_integrity: 30,
}, { global: { blacklisted_glowshroom_turfs: 799 } });

// /obj/structure/glowshroom/proc/examine  (code/game/objects/effects/glowshroom.dm:39)
rt.def("/obj/structure/glowshroom/proc/examine", function examine(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("This is a ＀４ generation ＀!", [rt.sv(f, "generation"), rt.sv(f, "name")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/glowshroom/proc/Destroy  (code/game/objects/effects/glowshroom.dm:44)  may sleep
rt.def("/obj/structure/glowshroom/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "myseed"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "myseed")]);
		rt.setSv(f, "myseed", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/glowshroom/proc/New  (code/game/objects/effects/glowshroom.dm:48)  may sleep
rt.def("/obj/structure/glowshroom/proc/New", function* New(f: Frame) {
	let G: Value = null, base_icon_state: Value = null;
	let $0: any;
	f.vars = () => [G, base_icon_state, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "myseed", (yield* g.callName(f, live(f.args[1]), "Copy", [])));
		yield* g.callName(f, rt.sv(f, "myseed"), "forceMove", [live(f.src)]);
	} else {
		rt.setSv(f, "myseed", (yield* g.new_(f, rt.sv(f, "myseed"), [live(f.src)])));
	}
	if (truthy(live(f.args[2]))) {
		yield* g.callName(f, rt.sv(f, "myseed"), "adjust_potency", [(yield* g.call(f, P("/proc/rand"), null, [-3, 6]))]);
		yield* g.callName(f, rt.sv(f, "myseed"), "adjust_yield", [(yield* g.call(f, P("/proc/rand"), null, [-1, 2]))]);
		yield* g.callName(f, rt.sv(f, "myseed"), "adjust_production", [(yield* g.call(f, P("/proc/rand"), null, [-3, 6]))]);
		yield* g.callName(f, rt.sv(f, "myseed"), "adjust_endurance", [(yield* g.call(f, P("/proc/rand"), null, [-3, 6]))]);
	}
	rt.setSv(f, "delay", subtract(rt.sv(f, "delay"), multiply(rt.fv(f, "production", rt.sv(f, "myseed")), 100)));
	rt.setSv(f, "obj_integrity", rt.fv(f, "endurance", rt.sv(f, "myseed")));
	rt.setSv(f, "max_integrity", rt.fv(f, "endurance", rt.sv(f, "myseed")));
	if (truthy((yield* g.callName(f, rt.sv(f, "myseed"), "get_gene", [T("/datum/plant_gene/trait/glow")])))) {
		yield* g.srcCall(f, "set_light", (yield* g.callName(f, (G = (yield* g.callName(f, rt.sv(f, "myseed"), "get_gene", [T("/datum/plant_gene/trait/glow")]))), "glow_range", [rt.sv(f, "myseed")])), (yield* g.callName(f, live(G), "glow_power", [rt.sv(f, "myseed")])), rt.fv(f, "glow_color", live(G)));
	}
	yield* g.srcCall(f, "setDir", (yield* g.srcCall(f, "CalcDir")));
	base_icon_state = rt.initial(f, live(f.src), "icon_state");
	if (!truthy(rt.sv(f, "floor"))) {
		$0 = rt.sv(f, "dir");
		if ($0 === 1) {
			rt.setSv(f, "pixel_y", 32);
		} else if ($0 === 2) {
			rt.setSv(f, "pixel_y", -32);
		} else if ($0 === 4) {
			rt.setSv(f, "pixel_x", 32);
		} else if ($0 === 8) {
			rt.setSv(f, "pixel_x", -32);
		}
		rt.setSv(f, "icon_state", fmt("＀＀", [live(base_icon_state), (yield* g.call(f, P("/proc/rand"), null, [1, 3]))]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀f", [live(base_icon_state)]));
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/glowshroom/proc/Spread")])), rt.sv(f, "delay")]);
	return f.dot;
}, true, { args: ["loc", "newseed", "mutate_stats"] });

// /obj/structure/glowshroom/proc/Spread  (code/game/objects/effects/glowshroom.dm:84)  may sleep
rt.def("/obj/structure/glowshroom/proc/Spread", function* Spread(f: Frame) {
	let ownturf: Value = null, shrooms_planted: Value = null, i: Value = null, possibleLocs: Value = null, spreadsIntoAdjacent: Value = null, earth: Value = null, newLoc: Value = null, shroomCount: Value = null, placeCount: Value = null, shroom: Value = null, wallDir: Value = null, isWall: Value = null, child: Value = null;
	let $e: any;
	f.vars = () => [ownturf, shrooms_planted, i, possibleLocs, spreadsIntoAdjacent, earth, newLoc, shroomCount, placeCount, shroom, wallDir, isWall, child, $e];
	ownturf = rt.getStep(f, live(f.src), 0);
	shrooms_planted = 0;
	i = null;
	rt.forRange(f, 0, 1, rt.fv(f, "yield", rt.sv(f, "myseed")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.op(f, "Prob", [], [multiply(divide(1, multiply(rt.sv(f, "generation"), rt.sv(f, "generation"))), 100)]))) {
			possibleLocs = rt.list();
			spreadsIntoAdjacent = 0;
			if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "spreadIntoAdjacentChance")]))) {
				spreadsIntoAdjacent = 1;
			}
			earth = null;
			rt.forList(f, 1, (yield* g.call(f, P("/proc/view"), null, [3, live(f.src)])), T("/turf/open/floor"));
			while (($e = rt.next(f, 1)) !== undefined) {
				earth = $e;
				if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(earth), rt.gl("blacklisted_glowshroom_turfs")])))) {
					continue;
				}
				if (!truthy((yield* g.callName(f, live(ownturf), "CanAtmosPass", [live(earth)])))) {
					continue;
				}
				if ((truthy(live(spreadsIntoAdjacent)) || !truthy(rt.locateIn(f, T("/obj/structure/glowshroom"), (yield* g.call(f, P("/proc/view"), null, [1, live(earth)])))))) {
					possibleLocs = rt.modify(live(possibleLocs), live(earth), add);
				}
				if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
					yield* g.call(f, P("/proc/stoplag"), null, []);
				}
			}
			rt.endFor(f, 1);
			if (!truthy(rt.len(f, live(possibleLocs)))) {
				break;
			}
			newLoc = rt.op(f, "PickUnweighted", [1], [live(possibleLocs)]);
			shroomCount = 0;
			placeCount = 1;
			shroom = null;
			rt.forList(f, 1, live(newLoc), T("/obj/structure/glowshroom"));
			while (($e = rt.next(f, 1)) !== undefined) {
				shroom = $e;
				shroomCount = rt.inc(live(shroomCount), 1);
			}
			rt.endFor(f, 1);
			wallDir = null;
			rt.forList(f, 1, rt.gl("cardinal"));
			while (($e = rt.next(f, 1)) !== undefined) {
				wallDir = $e;
				if (truthy(rt.gv(f, "density", (isWall = rt.getStep(f, live(newLoc), live(wallDir)))))) {
					placeCount = rt.inc(live(placeCount), 1);
				}
			}
			rt.endFor(f, 1);
			if (rt.ge(live(shroomCount), live(placeCount))) {
				continue;
			}
			rt.setFv(f, "generation", (child = (yield* g.new_(f, rt.sv(f, "type"), [live(newLoc), rt.sv(f, "myseed"), 1]))), add(rt.sv(f, "generation"), 1));
			shrooms_planted = rt.inc(live(shrooms_planted), 1);
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		} else {
			shrooms_planted = rt.inc(live(shrooms_planted), 1);
		}
	}
	rt.endFor(f, 0);
	if (!rt.lt(live(shrooms_planted), rt.fv(f, "yield", rt.sv(f, "myseed")))) return f.dot;
	(rt.modField(f, rt.sv(f, "myseed"), "yield", live(shrooms_planted), subtract));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/glowshroom/proc/Spread")])), rt.sv(f, "delay")]);
	return f.dot;
}, true);

// /obj/structure/glowshroom/proc/CalcDir  (code/game/objects/effects/glowshroom.dm:133)
rt.def("/obj/structure/glowshroom/proc/CalcDir", function CalcDir(f: Frame, location: Value) {
	let direction: Value = null, wallDir: Value = null, newTurf: Value = null, shroom: Value = null, dirList: Value = null, i: Value = null, newDir: Value = null;
	let $e: any;
	f.vars = () => [location, direction, wallDir, newTurf, shroom, dirList, i, newDir, $e];
	if (live(location) === null) {
		location = rt.sv(f, "loc");
	}
	direction = 16;
	wallDir = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		wallDir = $e;
		if (truthy(rt.gv(f, "density", (newTurf = rt.getStep(f, live(location), live(wallDir)))))) {
			(direction = rt.modify(live(direction), live(wallDir), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	shroom = null;
	rt.forList(f, 0, live(location), T("/obj/structure/glowshroom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		shroom = $e;
		if (isEqual(live(shroom), live(f.src))) {
			continue;
		}
		if (truthy(rt.fv(f, "floor", live(shroom)))) {
			(direction = rt.modify(live(direction), 16777199, rt.bitAnd));
		} else {
			(direction = rt.modify(live(direction), rt.op(f, "BitNot", [], [rt.fv(f, "dir", live(shroom))]), rt.bitAnd));
		}
	}
	rt.endFor(f, 0);
	dirList = rt.list();
	i = null;
	i = 1;
	while (rt.le(live(i), 16)) {
		if (truthy(rt.bitAnd(live(direction), live(i)))) {
			dirList = rt.modify(live(dirList), live(i), add);
		}
		(i = rt.modify(live(i), 1, rt.shiftLeft));
	}
	if (truthy(rt.len(f, live(dirList)))) {
		if (isEqual((newDir = rt.op(f, "PickUnweighted", [1], [live(dirList)])), 16)) {
			rt.setSv(f, "floor", 1);
			newDir = 1;
		}
		return live(newDir);
	}
	rt.setSv(f, "floor", 1);
	return 1;
});

// /obj/structure/glowshroom/proc/play_attack_sound  (code/game/objects/effects/glowshroom.dm:163)
rt.def("/obj/structure/glowshroom/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	f.vars = () => [damage_type, damage_flag];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	if (!(isEqual(live(damage_type), "fire") && truthy(live(damage_amount)))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	return f.dot;
});

// /obj/structure/glowshroom/proc/temperature_expose  (code/game/objects/effects/glowshroom.dm:167)  may sleep
rt.def("/obj/structure/glowshroom/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "take_damage", 5, "fire", 0, 0);
	return f.dot;
}, true);

// /obj/structure/glowshroom/proc/acid_act  (code/game/objects/effects/glowshroom.dm:172)  may sleep
rt.def("/obj/structure/glowshroom/proc/acid_act", function* acid_act(f: Frame, acidpwr: Value, acid_volume: Value) {
	let I: Value = null;
	f.vars = () => [acidpwr, acid_volume, I];
	f.dot = 1;
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ melts away!</span>", [live(f.src)]));
	rt.setFv(f, "desc", (I = (yield* g.new_(f, T("/obj/effect/decal/cleanable/molten_object"), [rt.getStep(f, live(f.src), 0)]))), fmt("Looks like this was ＇！ some time ago.", [live(f.src)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
