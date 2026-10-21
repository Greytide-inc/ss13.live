// From code/game/objects/effects/spiders.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12459, "/obj/structure/spider", "/obj/structure", {
	anchored: 1,
	name: "web",
	icon: rt.rsc("icons/effects/effects.dmi"),
	desc: "it's stringy and sticky",
	density: 0,
	obj_integrity: 15,
});

// /obj/structure/spider/proc/play_attack_sound  (code/game/objects/effects/spiders.dm:13)
rt.def("/obj/structure/spider/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	f.vars = () => [damage_type, damage_flag];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	if (!isEqual(live(damage_type), "fire")) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	return f.dot;
});

// /obj/structure/spider/proc/run_obj_armor  (code/game/objects/effects/spiders.dm:18)
rt.def("/obj/structure/spider/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (isEqual(live(f.args[2]), "melee")) {
		$0 = live(f.args[1]);
		if ($0 === "fire") {
			(f.args[0] = rt.modify(live(f.args[0]), 2, multiply));
		} else if ($0 === "brute") {
			(f.args[0] = rt.modify(live(f.args[0]), 0.25, multiply));
		}
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// /obj/structure/spider/proc/temperature_expose  (code/game/objects/effects/spiders.dm:27)  may sleep
rt.def("/obj/structure/spider/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "take_damage", 5, "fire", 0, 0);
	return f.dot;
}, true);

rt.type(12462, "/obj/structure/spider/stickyweb", "/obj/structure/spider", {
	icon_state: "stickyweb1",
});

// /obj/structure/spider/stickyweb/proc/Initialize  (code/game/objects/effects/spiders.dm:34)
rt.def("/obj/structure/spider/stickyweb/proc/Initialize", function Initialize(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		rt.setSv(f, "icon_state", "stickyweb2");
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/structure/spider/stickyweb/proc/CanPass  (code/game/objects/effects/spiders.dm:39)
rt.def("/obj/structure/spider/stickyweb/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	if (truthy((rt.istype(live(mover), T("/mob/living/simple_animal/hostile/poison/giant_spider")) ? 1 : 0))) {
		return 1;
	} else {
		if (truthy((rt.istype(live(mover), T("/mob/living")) ? 1 : 0))) {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				rt.call(f, P("/proc/to_chat"), null, [live(mover), fmt("<span class='danger'>You get stuck in ％！ for a moment.</span>", [live(f.src)])]);
				return 0;
			}
		} else {
			if (truthy((rt.istype(live(mover), T("/obj/item/projectile")) ? 1 : 0))) {
				return rt.op(f, "Prob", [], [30]);
			}
		}
	}
	return 1;
});

rt.type(12463, "/obj/structure/spider/eggcluster", "/obj/structure/spider", {
	amount_grown: 0,
	player_spiders: 0,
	poison_type: "toxin",
	poison_per_bite: 5,
	faction: null,
	name: "egg cluster",
	desc: "They seem to pulse slightly with an inner life",
	icon_state: "eggs",
});

// /obj/structure/spider/eggcluster/proc/<init>  (code/game/objects/effects/spiders.dm:58)
rt.def("/obj/structure/spider/eggcluster/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("spiders"));
	return f.dot;
});

// /obj/structure/spider/eggcluster/proc/Initialize  (code/game/objects/effects/spiders.dm:61)
rt.def("/obj/structure/spider/eggcluster/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "pixel_x", rt.call(f, P("/proc/rand"), null, [3, -3]));
	rt.setSv(f, "pixel_y", rt.call(f, P("/proc/rand"), null, [3, -3]));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/structure/spider/eggcluster/proc/process  (code/game/objects/effects/spiders.dm:67)  may sleep
rt.def("/obj/structure/spider/eggcluster/proc/process", function* process(f: Frame) {
	let num: Value = null, i: Value = null, S: Value = null;
	f.vars = () => [num, i, S];
	if (!rt.ge((rt.modSrcVar(f, "amount_grown", (yield* g.call(f, P("/proc/rand"), null, [0, 2])), add)), 100)) return f.dot;
	num = (yield* g.call(f, P("/proc/rand"), null, [3, 12]));
	i = null;
	i = 0;
	while (rt.lt(live(i), live(num))) {
		rt.setFv(f, "poison_type", (S = (yield* g.new_(f, T("/obj/structure/spider/spiderling"), [rt.fv(f, "loc", live(f.src))]))), rt.sv(f, "poison_type"));
		rt.setFv(f, "poison_per_bite", live(S), rt.sv(f, "poison_per_bite"));
		rt.setFv(f, "faction", live(S), (yield* g.callName(f, rt.sv(f, "faction"), "Copy", [])));
		if (truthy(rt.sv(f, "player_spiders"))) {
			rt.setFv(f, "player_spiders", live(S), 1);
		}
		i = rt.inc(live(i), 1);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

rt.type(12464, "/obj/structure/spider/spiderling", "/obj/structure/spider", {
	amount_grown: 0,
	grow_as: null,
	entry_vent: null,
	travelling_in_vent: 0,
	player_spiders: 0,
	poison_type: "toxin",
	poison_per_bite: 5,
	faction: null,
	anchored: 0,
	name: "spiderling",
	desc: "It never stays still for long.",
	icon_state: "spiderling",
	layer: 2.75,
	obj_integrity: 3,
});

// /obj/structure/spider/spiderling/proc/<init>  (code/game/objects/effects/spiders.dm:93)
rt.def("/obj/structure/spider/spiderling/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("spiders"));
	return f.dot;
});

// /obj/structure/spider/spiderling/proc/Initialize  (code/game/objects/effects/spiders.dm:96)
rt.def("/obj/structure/spider/spiderling/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "pixel_x", rt.call(f, P("/proc/rand"), null, [6, -6]));
	rt.setSv(f, "pixel_y", rt.call(f, P("/proc/rand"), null, [6, -6]));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/structure/spider/spiderling/proc/Bump  (code/game/objects/effects/spiders.dm:108)  may sleep
rt.def("/obj/structure/spider/spiderling/proc/Bump", function* Bump(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/structure/table")) ? 1 : 0))) {
		rt.setFv(f, "loc", live(f.src), rt.fv(f, "loc", live(f.args[0])));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/spider/spiderling/proc/process  (code/game/objects/effects/spiders.dm:115)  may sleep
rt.def("/obj/structure/spider/spiderling/proc/process", function* process(f: Frame) {
	let vents: Value = null, entry_vent_parent: Value = null, temp_vent: Value = null, exit_vent: Value = null, travel_time: Value = null, new_area: Value = null, nearby: Value = null, target_atom: Value = null, v: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [vents, entry_vent_parent, temp_vent, exit_vent, travel_time, new_area, nearby, target_atom, v, S, $e];
	if (truthy(rt.sv(f, "travelling_in_vent"))) {
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
			rt.setSv(f, "travelling_in_vent", 0);
			rt.setSv(f, "entry_vent", null);
		}
	} else {
		if (truthy(rt.sv(f, "entry_vent"))) {
			if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "entry_vent")])), 1)) {
				vents = rt.list();
				entry_vent_parent = rt.index(rt.fv(f, "parents", rt.sv(f, "entry_vent")), 1);
				temp_vent = null;
				rt.forList(f, 0, rt.fv(f, "other_atmosmch", live(entry_vent_parent)), T("/obj/machinery/atmospherics/components/unary/vent_pump"));
				while (($e = rt.next(f, 0)) !== undefined) {
					temp_vent = $e;
					yield* g.callName(f, live(vents), "Add", [live(temp_vent)]);
				}
				rt.endFor(f, 0);
				if (!truthy(rt.len(f, live(vents)))) {
					rt.setSv(f, "entry_vent", null);
					return live(f.dot);
				}
				exit_vent = rt.op(f, "PickUnweighted", [1], [live(vents)]);
				if (truthy(rt.op(f, "Prob", [], [50]))) {
					yield* g.srcCall(f, "visible_message", fmt("<B>＀ scrambles into the ventillation ducts!</B>", [live(f.src)]), "<span class='italics'>You hear something scampering through the ventilation ducts.</span>");
				}
				rt.spawnTail(f, (yield* g.call(f, P("/proc/rand"), null, [20, 60])), "/obj/structure/spider/spiderling/proc/process: spawn at game/objects/effects/spiders.dm:129", vents, entry_vent_parent, temp_vent, exit_vent, travel_time, new_area, nearby, target_atom, v, S);
			}
		} else {
			if (truthy(rt.op(f, "Prob", [], [33]))) {
				if (truthy(rt.getLen(f, (nearby = (yield* g.call(f, P("/proc/oview"), null, [10, live(f.src)])))))) {
					target_atom = rt.op(f, "PickUnweighted", [1], [live(nearby)]);
					yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), live(target_atom)]);
					if (truthy(rt.op(f, "Prob", [], [40]))) {
						yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='notice'>＄！ skitters＀.</span>", [live(f.src), rt.op(f, "PickUnweighted", [3], [" away", " around", ""])])]);
					}
				}
			} else {
				if (truthy(rt.op(f, "Prob", [], [10]))) {
					v = null;
					rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [7, live(f.src)])), T("/obj/machinery/atmospherics/components/unary/vent_pump"));
					while (($e = rt.next(f, 0)) !== undefined) {
						v = $e;
						if (!truthy(rt.fv(f, "welded", live(v)))) {
							rt.setSv(f, "entry_vent", live(v));
							yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), rt.sv(f, "entry_vent"), 1]);
							break;
						}
					}
					rt.endFor(f, 0);
				}
			}
		}
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) return f.dot;
	if (!rt.ge((rt.modSrcVar(f, "amount_grown", (yield* g.call(f, P("/proc/rand"), null, [0, 2])), add)), 100)) return f.dot;
	if (!truthy(rt.sv(f, "grow_as"))) {
		rt.setSv(f, "grow_as", rt.op(f, "PickUnweighted", [3], [T("/mob/living/simple_animal/hostile/poison/giant_spider"), T("/mob/living/simple_animal/hostile/poison/giant_spider/hunter"), T("/mob/living/simple_animal/hostile/poison/giant_spider/nurse")]));
	}
	rt.setFv(f, "poison_per_bite", (S = (yield* g.new_(f, rt.sv(f, "grow_as"), [rt.fv(f, "loc", live(f.src))]))), rt.sv(f, "poison_per_bite"));
	rt.setFv(f, "poison_type", live(S), rt.sv(f, "poison_type"));
	rt.setFv(f, "faction", live(S), (yield* g.callName(f, rt.sv(f, "faction"), "Copy", [])));
	if (truthy(rt.sv(f, "player_spiders"))) {
		rt.setFv(f, "playable_spider", live(S), 1);
		yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("Spider ＀ can be controlled", [rt.fv(f, "name", live(S))]), null, null, "enter_link", fmt("<a href=?src=＃;activate=1>(Click to play)</a>", [live(S)]), "source", live(S), "action", "attack"], rt.Args.Named);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// a spawn((yield* g.call(f, P("/proc/rand"), null, [20, 60]))) body of /obj/structure/spider/spiderling/proc/process, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/spider/spiderling/proc/process: spawn at game/objects/effects/spiders.dm:129", function* (f: Frame, vents: Value, entry_vent_parent: Value, temp_vent: Value, exit_vent: Value, travel_time: Value, new_area: Value, nearby: Value, target_atom: Value, v: Value, S: Value) {
	f.vars = () => [vents, entry_vent_parent, temp_vent, exit_vent, travel_time, new_area, nearby, target_atom, v, S];
	rt.setSv(f, "loc", live(exit_vent));
	rt.spawnTail(f, (travel_time = (yield* g.call(f, P("/proc/round"), null, [divide((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "loc"), rt.fv(f, "loc", live(exit_vent))])), 2)]))), "/obj/structure/spider/spiderling/proc/process: spawn at game/objects/effects/spiders.dm:134", vents, entry_vent_parent, temp_vent, exit_vent, travel_time, new_area, nearby, target_atom, v, S);
	return null;
});

// a spawn((travel_time = (yield* g.call(f, P("/proc/round"), null, [divide((yield* g.call(f, P("/proc/get_dist"), null, [rt.srcVarI(f, $ic[35]), rt.fieldI(f, live(exit_vent), $ic[36])])), 2)])))) body of /obj/structure/spider/spiderling/proc/process, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/spider/spiderling/proc/process: spawn at game/objects/effects/spiders.dm:134", function* (f: Frame, vents: Value, entry_vent_parent: Value, temp_vent: Value, exit_vent: Value, travel_time: Value, new_area: Value, nearby: Value, target_atom: Value, v: Value, S: Value) {
	f.vars = () => [vents, entry_vent_parent, temp_vent, exit_vent, travel_time, new_area, nearby, target_atom, v, S];
	if ((!truthy(live(exit_vent)) || truthy(rt.fv(f, "welded", live(exit_vent))))) {
		rt.setSv(f, "loc", rt.sv(f, "entry_vent"));
		rt.setSv(f, "entry_vent", null);
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.srcCall(f, "audible_message", "<span class='italics'>You hear something scampering through the ventilation ducts.</span>");
	}
	yield* g.call(f, P("/proc/sleep"), null, [live(travel_time)]);
	if ((!truthy(live(exit_vent)) || truthy(rt.fv(f, "welded", live(exit_vent))))) {
		rt.setSv(f, "loc", rt.sv(f, "entry_vent"));
		rt.setSv(f, "entry_vent", null);
		return live(f.dot);
	}
	rt.setSv(f, "loc", rt.fv(f, "loc", live(exit_vent)));
	rt.setSv(f, "entry_vent", null);
	if (truthy((new_area = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "loc")]))))) {
		yield* g.callName(f, live(new_area), "Entered", [live(f.src)]);
	}
	return null;
});

rt.type(12460, "/obj/structure/spider/cocoon", "/obj/structure/spider", {
	name: "cocoon",
	desc: "Something wrapped in silky spider web",
	icon_state: "cocoon1",
	obj_integrity: 60,
});

// /obj/structure/spider/cocoon/proc/Initialize  (code/game/objects/effects/spiders.dm:194)
rt.def("/obj/structure/spider/cocoon/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", rt.op(f, "PickUnweighted", [3], ["cocoon1", "cocoon2", "cocoon3"]));
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/structure/spider/cocoon/proc/container_resist  (code/game/objects/effects/spiders.dm:199)  may sleep
rt.def("/obj/structure/spider/cocoon/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	let breakout_time: Value = null;
	f.vars = () => [user, breakout_time];
	breakout_time = 1;
	yield* g.callName(f, live(user), "changeNext_move", [100]);
	rt.setFv(f, "last_special", live(user), add(rt.worldTime(f), 100));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You struggle against the tight bonds... (This will take about ＀ minutes.)</span>", [live(breakout_time)])]);
	yield* g.srcCall(f, "visible_message", fmt("You see something struggling and writhing in ％！!", [live(f.src)]));
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(multiply(live(breakout_time), 60), 10), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	if (((!truthy(live(user)) || !isEqual(rt.fv(f, "stat", live(user)), 0)) || !isEqual(rt.fv(f, "loc", live(user)), live(f.src)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/spider/cocoon/proc/Destroy  (code/game/objects/effects/spiders.dm:211)  may sleep
rt.def("/obj/structure/spider/cocoon/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [_T, A, $e];
	_T = rt.getStep(f, live(f.src), 0);
	yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'>＄！ splits open.</span>", [live(f.src)])]);
	A = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "forceMove", [live(_T)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
