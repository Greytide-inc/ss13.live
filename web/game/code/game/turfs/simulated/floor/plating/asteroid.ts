// Based on /tg/station's code/game/turfs/simulated/floor/plating/asteroid.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// asteroid.dm:19
rt.def("/turf/open/floor/plating/asteroid/proc/Initialize", function* Initialize(f: Frame) {
	let proper_name: Value = this.name;
	yield* parent_proc();
	this.name = proper_name;
	if (!prob(this.floor_variance)) return f.dot;
	this.icon_state = `${this.environment_type}${rand(0, 12)}`;
	return f.dot;
}, true);

// asteroid.dm:29
rt.def("/turf/open/floor/plating/asteroid/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* this.contents_explosion(severity, target);
	if (severity === 3) {
		return f.dot;
	} else if (severity === 2) {
		if (prob(20)) {
			yield* this.gets_dug();
		}
	} else if (severity === 1) {
		yield* this.gets_dug();
	}
	return f.dot;
}, true, { waitfor: false });

// asteroid.dm:41
rt.def("/turf/open/floor/plating/asteroid/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let S: Value = null, _P: Value = null, _T: Value = null, O: Value = null, Z: Value = null, L: Value = null, F: Value = null;
	if (!W || !user) {
		return 0;
	}
	let digging_speed: Value = 0;
	if (rt.istype(W, T("/obj/item/weapon/shovel"))) {
		digging_speed = (S = W).digspeed;
	} else if (rt.istype(W, T("/obj/item/weapon/pickaxe"))) {
		digging_speed = (_P = W).digspeed;
	}
	if (digging_speed) {
		if (!isturf((_T = user.loc))) {
			return f.dot;
		}
		if (this.dug) {
			to_chat(user, "<span class='warning'>This area has already been dug!</span>");
			return f.dot;
		}
		to_chat(user, "<span class='notice'>You start digging...</span>");
		playsound(this, rt.rsc("sound/effects/shovel_dig.ogg"), 50, 1);
		if (yield* do_after(user, digging_speed, { target: this })) {
			if (rt.istype(this, T("/turf/open/floor/plating/asteroid"))) {
				to_chat(user, "<span class='notice'>You dig a hole.</span>");
				yield* this.gets_dug();
			}
		}
	}
	if (rt.istype(W, T("/obj/item/weapon/storage/bag/ore"))) {
		if ((S = W).collection_mode == 1) {
			for (O of each(this.contents, T("/obj/item/weapon/ore"))) {
				yield* O.attackby(W, user);
				return f.dot;
			}
		}
	}
	if (!rt.istype(W, T("/obj/item/stack/tile"))) return f.dot;
	if (!(yield* (Z = W).use(1))) {
		return f.dot;
	}
	let _T_2: Value = (yield* this.ChangeTurf(Z.turf_type));
	if (rt.istype(Z, T("/obj/item/stack/tile/light"))) {
		L = Z;
		(F = _T_2).state = L.state;
	}
	playsound(this, rt.rsc("sound/weapons/genhit.ogg"), 50, 1);
	return f.dot;
}, true);

// asteroid.dm:89
rt.def("/turf/open/floor/plating/asteroid/proc/gets_dug", function* gets_dug(f: Frame) {
	let i: Value = null;
	let $e: any;
	if (this.dug) {
		return f.dot;
	}
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(this.sand_type, this);
	}
	rt.endFor(f, 0);
	this.dug = 1;
	this.icon_plating = `${this.environment_type}_dug`;
	this.icon_state = `${this.environment_type}_dug`;
	this.slowdown = 0;
	return f.dot;
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

// asteroid.dm:121
rt.def("/turf/open/floor/plating/asteroid/basalt/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	set_basalt_light(this);
	return f.dot;
}, true);

// asteroid.dm:125
rt.def("/proc/set_basalt_light", function set_basalt_light(f: Frame, B: Value) {
	if (B.icon_state === "basalt1" || B.icon_state === "basalt2" || B.icon_state === "basalt3") {
		B.set_light(2, 0.6, "#C48A18");
	} else if (B.icon_state === "basalt5" || B.icon_state === "basalt9") {
		B.set_light(1.4, 0.6, "#C48A18");
	}
	return f.dot;
});

// asteroid.dm:132
rt.def("/turf/open/floor/plating/asteroid/basalt/proc/gets_dug", function* gets_dug(f: Frame) {
	if (!this.dug) {
		this.set_light(0);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4516, "/turf/open/floor/plating/asteroid/airless/cave/volcanic", "/turf/open/floor/plating/asteroid/airless/cave", {
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	mob_spawn_list: null,
	data_having_type: rt.typePath("/turf/open/floor/plating/asteroid/airless/cave/volcanic/has_data"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});

// asteroid.dm:172
rt.def("/turf/open/floor/plating/asteroid/airless/cave/volcanic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_spawn_list = rt.alist(f, [T("/mob/living/simple_animal/hostile/asteroid/goliath/beast"), 50, T("/mob/living/simple_animal/hostile/spawner/lavaland/goliath"), 3, T("/mob/living/simple_animal/hostile/asteroid/basilisk/watcher"), 40, T("/mob/living/simple_animal/hostile/spawner/lavaland"), 2, T("/mob/living/simple_animal/hostile/asteroid/hivelord/legion"), 30, T("/mob/living/simple_animal/hostile/spawner/lavaland/legion"), 3, "bluh bluh huge boss", 6, T("/mob/living/simple_animal/hostile/asteroid/goldgrub"), 10]);
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

// asteroid.dm:185
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/Initialize", function* Initialize(f: Frame) {
	if (!this.mob_spawn_list) {
		this.mob_spawn_list = rt.alist(f, [T("/mob/living/simple_animal/hostile/asteroid/goldgrub"), 1, T("/mob/living/simple_animal/hostile/asteroid/goliath"), 5, T("/mob/living/simple_animal/hostile/asteroid/basilisk"), 4, T("/mob/living/simple_animal/hostile/asteroid/hivelord"), 3]);
	}
	if (!this.megafauna_spawn_list) {
		this.megafauna_spawn_list = rt.alist(f, [T("/mob/living/simple_animal/hostile/megafauna/dragon"), 4, T("/mob/living/simple_animal/hostile/megafauna/colossus"), 2, T("/mob/living/simple_animal/hostile/megafauna/bubblegum"), SPAWN_BUBBLEGUM]);
	}
	if (!this.flora_spawn_list) {
		this.flora_spawn_list = rt.alist(f, [T("/obj/structure/flora/ash/leaf_shroom"), 2, T("/obj/structure/flora/ash/cap_shroom"), 2, T("/obj/structure/flora/ash/stem_shroom"), 2, T("/obj/structure/flora/ash/cacti"), 1, T("/obj/structure/flora/ash/tall_shroom"), 2]);
	}
	if (!this.has_data) {
		yield* this.produce_tunnel_from_data();
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// asteroid.dm:199
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/get_cave_data", function get_cave_data(f: Frame, set_length: Value, exclude_dir: Value) {
	exclude_dir ??= -1;
	if (!set_length) {
		rt.setSv(f, "length", rand(25, 50));
	} else {
		rt.setSv(f, "length", set_length);
	}
	this.forward_cave_dir = pick(GLOB.alldirs - exclude_dir);
	this.backward_cave_dir = angle2dir(dir2angle(this.forward_cave_dir) + 180);
	return f.dot;
});

// asteroid.dm:210
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/produce_tunnel_from_data", function* produce_tunnel_from_data(f: Frame, tunnel_length: Value, excluded_dir: Value) {
	excluded_dir ??= -1;
	this.get_cave_data(tunnel_length, excluded_dir);
	yield* this.make_tunnel(this.forward_cave_dir);
	if (this.going_backwards) {
		yield* this.make_tunnel(this.backward_cave_dir);
	}
	yield* this.SpawnFloor(this);
	return f.dot;
}, true);

// asteroid.dm:219
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/make_tunnel", function* make_tunnel(f: Frame, dir: Value) {
	let L: Value = null, edge_angle: Value = null, edge: Value = null, C: Value = null;
	let tunnel: Value = this;
	let next_angle: Value = pick(45, -45);
	let i: Value = 0;
	while (i < rt.sv(f, "length")) {
		if (!this.sanity) {
			break;
		}
		L = list(45);
		if (IsOdd(dir2angle(dir))) {
			L += -45;
		}
		edge_angle = null;
		for (edge_angle of each(L)) {
			if (rt.istype((edge = rt.getStep(f, tunnel, angle2dir(dir2angle(dir) + edge_angle))), T("/turf/closed/mineral"))) {
				yield* this.SpawnFloor(edge);
			}
		}
		if (!this.sanity) {
			break;
		}
		if (rt.istype((tunnel = rt.getStep(f, tunnel, dir)), T("/turf/closed/mineral"))) {
			if (i > 3 && prob(20)) {
				(C = (yield* tunnel.ChangeTurf(this.data_having_type, 0, 1))).going_backwards = 0;
				yield* C.produce_tunnel_from_data(rand(10, 15), dir);
			} else {
				yield* this.SpawnFloor(tunnel);
			}
		} else {
			break;
		}
		if (i > 2 && prob(33)) {
			next_angle = -next_angle;
			yield* this.setDir(angle2dir(dir2angle(dir)) + next_angle);
		}
		i++;
	}
	return f.dot;
}, true);

// asteroid.dm:261
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/SpawnFloor", function* SpawnFloor(f: Frame, _T: Value) {
	let S: Value = null, NT: Value = null;
	for (S of each(block(rt.locate(max(this.x - 1, 1), max(this.y - 1, 1), this.z), rt.locate(min(this.x + 1, rt.world().maxx), min(this.y + 1, rt.world().maxy), this.z)))) {
		if (!(NT = S) || rt.istype(NT, T("/turf/open/space")) || rt.istype(NT.loc, T("/area/mine/explored")) || rt.istype(NT.loc, T("/area/lavaland/surface/outdoors/explored"))) {
			this.sanity = 0;
			break;
		}
	}
	if (!this.sanity) {
		// tg's bug: a starter tile that can't dig stayed a cave, which never ran Initialize, so no air and runtimes at world start.
		if (_T == this) {
			yield* _T.ChangeTurf(this.turf_type, 0, 1);
		}
		return f.dot;
	}
	yield* this.SpawnFlora(_T);
	yield* this.SpawnMonster(_T);
	yield* _T.ChangeTurf(this.turf_type, 0, 1);
	return f.dot;
}, true);

// asteroid.dm:274
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/SpawnMonster", function* SpawnMonster(f: Frame, _T: Value) {
	let randumb: Value = null, maybe_boss: Value = null, H: Value = null;
	if (prob(30)) {
		if (rt.istype(this.loc, T("/area/mine/explored")) || !rt.istype(this.loc, T("/area/lavaland/surface/outdoors/unexplored"))) {
			return f.dot;
		}
		randumb = pickweight(this.mob_spawn_list);
		while (randumb == "bluh bluh huge boss") {
			if (rt.istype(this.loc, T("/area/lavaland/surface/outdoors/unexplored/danger"))) {
				maybe_boss = pickweight(this.megafauna_spawn_list);
				if (rt.index(this.megafauna_spawn_list, maybe_boss)) {
					randumb = maybe_boss;
					if (ispath(maybe_boss, T("/mob/living/simple_animal/hostile/megafauna/bubblegum"))) {
						rt.setAt(this.megafauna_spawn_list, maybe_boss, 0);
					}
				}
			} else {
				randumb = pickweight(this.mob_spawn_list);
			}
		}
		for (H of each(urange(12, _T), T("/mob/living/simple_animal/hostile"))) {
			if ((ispath(randumb, T("/mob/living/simple_animal/hostile/megafauna")) || rt.istype(H, T("/mob/living/simple_animal/hostile/megafauna"))) && get_dist(this, H) <= 7) {
				return f.dot;
			}
			if (ispath(randumb, T("/mob/living/simple_animal/hostile/asteroid")) || rt.istype(H, T("/mob/living/simple_animal/hostile/asteroid"))) {
				return f.dot;
			}
			if ((ispath(randumb, T("/mob/living/simple_animal/hostile/spawner/lavaland")) || rt.istype(H, T("/mob/living/simple_animal/hostile/spawner/lavaland"))) && get_dist(this, H) <= 2) {
				return f.dot;
			}
		}
		yield* new_(randumb, _T);
	}
	return f.dot;
}, true);

// asteroid.dm:303
rt.def("/turf/open/floor/plating/asteroid/airless/cave/proc/SpawnFlora", function* SpawnFlora(f: Frame, _T: Value) {
	let F: Value = null;
	if (!prob(12)) return f.dot;
	if (rt.istype(this.loc, T("/area/mine/explored")) || rt.istype(this.loc, T("/area/lavaland/surface/outdoors/explored"))) {
		return f.dot;
	}
	let randumb: Value = pickweight(this.flora_spawn_list);
	for (F of each(range(4, _T), T("/obj/structure/flora/ash"))) {
		if (!rt.op(f, "IsType", [], [F, randumb])) {
			return f.dot;
		}
	}
	yield* new_(randumb, _T);
	return f.dot;
}, true);
