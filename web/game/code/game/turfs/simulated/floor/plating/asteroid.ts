// From code/game/turfs/simulated/floor/plating/asteroid.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4508, "/turf/open/floor/plating/asteroid", "/turf/open/floor/plating", {
	environment_type: "asteroid",
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid"),
	dug: 0,
	floor_variance: 20,
	sand_type: rt.typePath("/obj/item/weapon/ore/glass"),
	name: "asteroid sand",
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid"),
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "asteroid",
	icon_plating: "asteroid",
});

// /turf/open/floor/plating/asteroid/proc/Initialize  (code/game/turfs/simulated/floor/plating/asteroid.dm:19)  may sleep
rt.def("/turf/open/floor/plating/asteroid/proc/Initialize", function* Initialize(f: Frame) {
	let proper_name: Value = null;
	f.vars = () => [proper_name];
	proper_name = rt.sv(f, "name");
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", live(proper_name));
	if (!truthy(rt.op(f, "Prob", [], [rt.sv(f, "floor_variance")]))) return f.dot;
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "environment_type"), (yield* g.call(f, P("/proc/rand"), null, [0, 12]))]));
	return f.dot;
}, true);

// /turf/open/floor/plating/asteroid/proc/ex_act  (code/game/turfs/simulated/floor/plating/asteroid.dm:29)  may sleep
rt.def("/turf/open/floor/plating/asteroid/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	yield* g.srcCall(f, "contents_explosion", live(severity), live(target));
	$0 = live(severity);
	if ($0 === 3) {
		return live(f.dot);
	} else if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			yield* g.callName(f, live(f.src), "gets_dug", []);
		}
	} else if ($0 === 1) {
		yield* g.callName(f, live(f.src), "gets_dug", []);
	}
	return f.dot;
}, true, { waitfor: false });

// /turf/open/floor/plating/asteroid/proc/attackby  (code/game/turfs/simulated/floor/plating/asteroid.dm:41)  may sleep
rt.def("/turf/open/floor/plating/asteroid/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let digging_speed: Value = null, S: Value = null, _P: Value = null, _T: Value = null, O: Value = null, Z: Value = null, _T_2: Value = null, L: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [W, user, params, digging_speed, S, _P, _T, O, Z, _T_2, L, F, $e];
	if ((!truthy(live(W)) || !truthy(live(user)))) {
		return 0;
	}
	digging_speed = 0;
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/shovel")) ? 1 : 0))) {
		digging_speed = rt.gv(f, "digspeed", (S = live(W)));
	} else {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/pickaxe")) ? 1 : 0))) {
			digging_speed = rt.gv(f, "digspeed", (_P = live(W)));
		}
	}
	if (truthy(live(digging_speed))) {
		if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.fv(f, "loc", live(user)))])))) {
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "dug"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This area has already been dug!</span>"]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start digging...</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/shovel_dig.ogg"), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, live(digging_speed), "target", live(f.src)], rt.Args.Named)))) {
			if (truthy((rt.istype(live(f.src), T("/turf/open/floor/plating/asteroid")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You dig a hole.</span>"]);
				yield* g.srcCall(f, "gets_dug");
			}
		}
	}
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/storage/bag/ore")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "collection_mode", (S = live(W))), 1)) {
			O = null;
			rt.forList(f, 0, rt.fv(f, "contents", live(f.src)), T("/obj/item/weapon/ore"));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				yield* g.callName(f, live(O), "attackby", [live(W), live(user)]);
				return live(f.dot);
			}
			rt.endFor(f, 0);
		}
	}
	if (!truthy((rt.istype(live(W), T("/obj/item/stack/tile")) ? 1 : 0))) return f.dot;
	if (!truthy((yield* g.callName(f, (Z = live(W)), "use", [1])))) {
		return live(f.dot);
	}
	_T_2 = (yield* g.srcCall(f, "ChangeTurf", rt.fv(f, "turf_type", live(Z))));
	if (truthy((rt.istype(live(Z), T("/obj/item/stack/tile/light")) ? 1 : 0))) {
		L = live(Z);
		rt.setFv(f, "state", (F = live(_T_2)), rt.fv(f, "state", live(L)));
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/genhit.ogg"), 50, 1]);
	return f.dot;
}, true);

// /turf/open/floor/plating/asteroid/proc/gets_dug  (code/game/turfs/simulated/floor/plating/asteroid.dm:89)  may sleep
rt.def("/turf/open/floor/plating/asteroid/proc/gets_dug", function* gets_dug(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (truthy(rt.sv(f, "dug"))) {
		return live(f.dot);
	}
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, rt.sv(f, "sand_type"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "dug", 1);
	rt.setSv(f, "icon_plating", fmt("＀_dug", [rt.sv(f, "environment_type")]));
	rt.setSv(f, "icon_state", fmt("＀_dug", [rt.sv(f, "environment_type")]));
	rt.setSv(f, "slowdown", 0);
	return live(f.dot);
}, true);

rt.type(4509, "/turf/open/floor/plating/asteroid/basalt", "/turf/open/floor/plating/asteroid", {
	environment_type: "basalt",
	floor_variance: 15,
	name: "volcanic floor",
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/basalt"),
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "basalt",
	icon_plating: "basalt",
	sand_type: rt.typePath("/obj/item/weapon/ore/glass/basalt"),
});

// /turf/open/floor/plating/asteroid/basalt/proc/Initialize  (code/game/turfs/simulated/floor/plating/asteroid.dm:121)  may sleep
rt.def("/turf/open/floor/plating/asteroid/basalt/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/set_basalt_light"), null, [live(f.src)]);
	return f.dot;
}, true);

// /proc/set_basalt_light  (code/game/turfs/simulated/floor/plating/asteroid.dm:125)
rt.def("/proc/set_basalt_light", function set_basalt_light(f: Frame, B: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "icon_state", live(B));
	if ($0 === "basalt1" || $0 === "basalt2" || $0 === "basalt3") {
		rt.callName(f, live(B), "set_light", [2, 0.6000000238418579, "#C48A18"]);
	} else if ($0 === "basalt5" || $0 === "basalt9") {
		rt.callName(f, live(B), "set_light", [1.399999976158142, 0.6000000238418579, "#C48A18"]);
	}
	return f.dot;
});

// /turf/open/floor/plating/asteroid/basalt/proc/gets_dug  (code/game/turfs/simulated/floor/plating/asteroid.dm:132)  may sleep
rt.def("/turf/open/floor/plating/asteroid/basalt/proc/gets_dug", function* gets_dug(f: Frame) {
	if (!truthy(rt.sv(f, "dug"))) {
		yield* g.srcCall(f, "set_light", 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(4516, "/turf/open/floor/plating/asteroid/airless/cave/volcanic", "/turf/open/floor/plating/asteroid/airless/cave", {
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	mob_spawn_list: null,
	data_having_type: rt.typePath("/turf/open/floor/plating/asteroid/airless/cave/volcanic/has_data"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});

// /turf/open/floor/plating/asteroid/airless/cave/volcanic/proc/<init>  (code/game/turfs/simulated/floor/plating/asteroid.dm:172)
rt.def("/turf/open/floor/plating/asteroid/airless/cave/volcanic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mob_spawn_list", rt.alist(f, [T("/mob/living/simple_animal/hostile/asteroid/goliath/beast"), 50, T("/mob/living/simple_animal/hostile/spawner/lavaland/goliath"), 3, T("/mob/living/simple_animal/hostile/asteroid/basilisk/watcher"), 40, T("/mob/living/simple_animal/hostile/spawner/lavaland"), 2, T("/mob/living/simple_animal/hostile/asteroid/hivelord/legion"), 30, T("/mob/living/simple_animal/hostile/spawner/lavaland/legion"), 3, "bluh bluh huge boss", 6, T("/mob/living/simple_animal/hostile/asteroid/goldgrub"), 10]));
	return f.dot;
});

rt.type(4514, "/turf/open/floor/plating/asteroid/airless/cave", "/turf/open/floor/plating/asteroid/airless", {
	length: 100,
	mob_spawn_list: null,
	megafauna_spawn_list: null,
	flora_spawn_list: null,
	sanity: 1,
	forward_cave_dir: 1,
	backward_cave_dir: 2,
	going_backwards: 1,
	has_data: 0,
	data_having_type: rt.typePath("/turf/open/floor/plating/asteroid/airless/cave/has_data"),
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/airless"),
});

// /turf/open/floor/plating/asteroid/airless/cave/proc/Initialize  (code/game/turfs/simulated/floor/plating/asteroid.dm:185)  may sleep
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/Initialize", function* Initialize(f: Frame) {
	if (!truthy(rt.sv(f, "mob_spawn_list"))) {
		rt.setSv(f, "mob_spawn_list", rt.alist(f, [T("/mob/living/simple_animal/hostile/asteroid/goldgrub"), 1, T("/mob/living/simple_animal/hostile/asteroid/goliath"), 5, T("/mob/living/simple_animal/hostile/asteroid/basilisk"), 4, T("/mob/living/simple_animal/hostile/asteroid/hivelord"), 3]));
	}
	if (!truthy(rt.sv(f, "megafauna_spawn_list"))) {
		rt.setSv(f, "megafauna_spawn_list", rt.alist(f, [T("/mob/living/simple_animal/hostile/megafauna/dragon"), 4, T("/mob/living/simple_animal/hostile/megafauna/colossus"), 2, T("/mob/living/simple_animal/hostile/megafauna/bubblegum"), 6]));
	}
	if (!truthy(rt.sv(f, "flora_spawn_list"))) {
		rt.setSv(f, "flora_spawn_list", rt.alist(f, [T("/obj/structure/flora/ash/leaf_shroom"), 2, T("/obj/structure/flora/ash/cap_shroom"), 2, T("/obj/structure/flora/ash/stem_shroom"), 2, T("/obj/structure/flora/ash/cacti"), 1, T("/obj/structure/flora/ash/tall_shroom"), 2]));
	}
	if (!truthy(rt.sv(f, "has_data"))) {
		yield* g.srcCall(f, "produce_tunnel_from_data");
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true);

// /turf/open/floor/plating/asteroid/airless/cave/proc/get_cave_data  (code/game/turfs/simulated/floor/plating/asteroid.dm:199)
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/get_cave_data", function get_cave_data(f: Frame, set_length: Value, exclude_dir: Value) {
	f.vars = () => [exclude_dir];
	if (live(exclude_dir) === null) {
		exclude_dir = -1;
	}
	if (!truthy(live(set_length))) {
		rt.setSv(f, "length", rt.call(f, P("/proc/rand"), null, [25, 50]));
	} else {
		rt.setSv(f, "length", live(set_length));
	}
	rt.setSv(f, "forward_cave_dir", rt.op(f, "PickUnweighted", [1], [subtract(rt.gl("alldirs"), live(exclude_dir))]));
	rt.setSv(f, "backward_cave_dir", rt.call(f, P("/proc/angle2dir"), null, [add(rt.call(f, P("/proc/dir2angle"), null, [rt.sv(f, "forward_cave_dir")]), 180)]));
	return f.dot;
});

// /turf/open/floor/plating/asteroid/airless/cave/proc/produce_tunnel_from_data  (code/game/turfs/simulated/floor/plating/asteroid.dm:210)  may sleep
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/produce_tunnel_from_data", function* produce_tunnel_from_data(f: Frame, tunnel_length: Value, excluded_dir: Value) {
	f.vars = () => [tunnel_length, excluded_dir];
	if (live(excluded_dir) === null) {
		excluded_dir = -1;
	}
	yield* g.srcCall(f, "get_cave_data", live(tunnel_length), live(excluded_dir));
	yield* g.srcCall(f, "make_tunnel", rt.sv(f, "forward_cave_dir"));
	if (truthy(rt.sv(f, "going_backwards"))) {
		yield* g.srcCall(f, "make_tunnel", rt.sv(f, "backward_cave_dir"));
	}
	yield* g.srcCall(f, "SpawnFloor", live(f.src));
	return f.dot;
}, true);

// /turf/open/floor/plating/asteroid/airless/cave/proc/make_tunnel  (code/game/turfs/simulated/floor/plating/asteroid.dm:219)  may sleep
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/make_tunnel", function* make_tunnel(f: Frame, dir: Value) {
	let tunnel: Value = null, next_angle: Value = null, i: Value = null, L: Value = null, edge_angle: Value = null, edge: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [dir, tunnel, next_angle, i, L, edge_angle, edge, C, $e];
	tunnel = live(f.src);
	next_angle = rt.op(f, "PickUnweighted", [2], [45, -45]);
	i = null;
	i = 0;
	while (rt.lt(live(i), rt.sv(f, "length"))) {
		if (!truthy(rt.sv(f, "sanity"))) {
			break;
		}
		L = rt.list(45);
		if (truthy((yield* g.call(f, P("/proc/IsOdd"), null, [(yield* g.call(f, P("/proc/dir2angle"), null, [live(dir)]))])))) {
			L = rt.modify(live(L), -45, add);
		}
		edge_angle = null;
		rt.forList(f, 0, live(L));
		while (($e = rt.next(f, 0)) !== undefined) {
			edge_angle = $e;
			if (truthy((rt.istype((edge = rt.getStep(f, live(tunnel), (yield* g.call(f, P("/proc/angle2dir"), null, [add((yield* g.call(f, P("/proc/dir2angle"), null, [live(dir)])), live(edge_angle))])))), T("/turf/closed/mineral")) ? 1 : 0))) {
				yield* g.srcCall(f, "SpawnFloor", live(edge));
			}
		}
		rt.endFor(f, 0);
		if (!truthy(rt.sv(f, "sanity"))) {
			break;
		}
		if (truthy((rt.istype((tunnel = rt.getStep(f, live(tunnel), live(dir))), T("/turf/closed/mineral")) ? 1 : 0))) {
			if ((rt.gt(live(i), 3) && truthy(rt.op(f, "Prob", [], [20])))) {
				rt.setFv(f, "going_backwards", (C = (yield* g.callName(f, live(tunnel), "ChangeTurf", [rt.sv(f, "data_having_type"), 0, 1]))), 0);
				yield* g.callName(f, live(C), "produce_tunnel_from_data", [(yield* g.call(f, P("/proc/rand"), null, [10, 15])), live(dir)]);
			} else {
				yield* g.srcCall(f, "SpawnFloor", live(tunnel));
			}
		} else {
			break;
		}
		if ((rt.gt(live(i), 2) && truthy(rt.op(f, "Prob", [], [33])))) {
			next_angle = rt.neg(live(next_angle));
			yield* g.srcCall(f, "setDir", add((yield* g.call(f, P("/proc/angle2dir"), null, [(yield* g.call(f, P("/proc/dir2angle"), null, [live(dir)]))])), live(next_angle)));
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

// /turf/open/floor/plating/asteroid/airless/cave/proc/SpawnFloor  (code/game/turfs/simulated/floor/plating/asteroid.dm:261)  may sleep
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/SpawnFloor", function* SpawnFloor(f: Frame, _T: Value) {
	let S: Value = null, NT: Value = null;
	let $e: any;
	f.vars = () => [_T, S, NT, $e];
	S = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(f.src)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(f.src)), 1), 1])), rt.fv(f, "z", live(f.src))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(f.src)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(f.src)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(f.src)))])));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if ((((!truthy((NT = live(S))) || truthy((rt.istype(live(NT), T("/turf/open/space")) ? 1 : 0))) || truthy((rt.istype(rt.fv(f, "loc", live(NT)), T("/area/mine/explored")) ? 1 : 0))) || truthy((rt.istype(rt.fv(f, "loc", live(NT)), T("/area/lavaland/surface/outdoors/explored")) ? 1 : 0)))) {
			rt.setSv(f, "sanity", 0);
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "sanity"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "SpawnFlora", live(_T));
	yield* g.srcCall(f, "SpawnMonster", live(_T));
	yield* g.callName(f, live(_T), "ChangeTurf", [rt.sv(f, "turf_type"), 0, 1]);
	return f.dot;
}, true);

// /turf/open/floor/plating/asteroid/airless/cave/proc/SpawnMonster  (code/game/turfs/simulated/floor/plating/asteroid.dm:274)  may sleep
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/SpawnMonster", function* SpawnMonster(f: Frame, _T: Value) {
	let randumb: Value = null, maybe_boss: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [_T, randumb, maybe_boss, H, $e];
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		if ((truthy((rt.istype(rt.sv(f, "loc"), T("/area/mine/explored")) ? 1 : 0)) || !truthy((rt.istype(rt.sv(f, "loc"), T("/area/lavaland/surface/outdoors/unexplored")) ? 1 : 0)))) {
			return live(f.dot);
		}
		randumb = (yield* g.call(f, P("/proc/pickweight"), null, [rt.sv(f, "mob_spawn_list")]));
		while (isEqual(live(randumb), "bluh bluh huge boss")) {
			if (truthy((rt.istype(rt.sv(f, "loc"), T("/area/lavaland/surface/outdoors/unexplored/danger")) ? 1 : 0))) {
				maybe_boss = (yield* g.call(f, P("/proc/pickweight"), null, [rt.sv(f, "megafauna_spawn_list")]));
				if (truthy(rt.index(rt.sv(f, "megafauna_spawn_list"), live(maybe_boss)))) {
					randumb = live(maybe_boss);
					if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(maybe_boss), T("/mob/living/simple_animal/hostile/megafauna/bubblegum")])))) {
						rt.setAt(rt.sv(f, "megafauna_spawn_list"), live(maybe_boss), 0);
					}
				}
			} else {
				randumb = (yield* g.call(f, P("/proc/pickweight"), null, [rt.sv(f, "mob_spawn_list")]));
			}
		}
		H = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [12, live(_T)])), T("/mob/living/simple_animal/hostile"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			if (((truthy((yield* g.call(f, P("/proc/ispath"), null, [live(randumb), T("/mob/living/simple_animal/hostile/megafauna")]))) || truthy((rt.istype(live(H), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(H)])), 7))) {
				return live(f.dot);
			}
			if ((truthy((yield* g.call(f, P("/proc/ispath"), null, [live(randumb), T("/mob/living/simple_animal/hostile/asteroid")]))) || truthy((rt.istype(live(H), T("/mob/living/simple_animal/hostile/asteroid")) ? 1 : 0)))) {
				return live(f.dot);
			}
			if (((truthy((yield* g.call(f, P("/proc/ispath"), null, [live(randumb), T("/mob/living/simple_animal/hostile/spawner/lavaland")]))) || truthy((rt.istype(live(H), T("/mob/living/simple_animal/hostile/spawner/lavaland")) ? 1 : 0))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(H)])), 2))) {
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
		yield* g.new_(f, live(randumb), [live(_T)]);
	}
	return live(f.dot);
}, true);

// /turf/open/floor/plating/asteroid/airless/cave/proc/SpawnFlora  (code/game/turfs/simulated/floor/plating/asteroid.dm:303)  may sleep
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/SpawnFlora", function* SpawnFlora(f: Frame, _T: Value) {
	let randumb: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [_T, randumb, F, $e];
	if (!truthy(rt.op(f, "Prob", [], [12]))) return f.dot;
	if ((truthy((rt.istype(rt.sv(f, "loc"), T("/area/mine/explored")) ? 1 : 0)) || truthy((rt.istype(rt.sv(f, "loc"), T("/area/lavaland/surface/outdoors/explored")) ? 1 : 0)))) {
		return live(f.dot);
	}
	randumb = (yield* g.call(f, P("/proc/pickweight"), null, [rt.sv(f, "flora_spawn_list")]));
	F = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [4, live(_T)])), T("/obj/structure/flora/ash"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if (!truthy(rt.op(f, "IsType", [], [live(F), live(randumb)]))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.new_(f, live(randumb), [live(_T)]);
	return f.dot;
}, true);
