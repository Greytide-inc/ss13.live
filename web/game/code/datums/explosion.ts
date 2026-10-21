// From code/datums/explosion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalexplosions  (code/datums/explosion.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalexplosions", function InitGlobalexplosions(f: Frame) {
	rt.setGl("explosions", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "explosions", add);
	return f.dot;
});

// /proc/explosion  (code/datums/explosion.dm:8)  may sleep
rt.def("/proc/explosion", function* explosion(f: Frame, epicenter: Value, devastation_range: Value, heavy_impact_range: Value, light_impact_range: Value, flash_range: Value, adminlog: Value, ignorecap: Value, flame_range: Value, silent: Value, smoke: Value) {
	f.vars = () => [adminlog, ignorecap, flame_range, silent, smoke];
	if (live(adminlog) === null) {
		adminlog = 1;
	}
	if (live(ignorecap) === null) {
		ignorecap = 0;
	}
	if (live(flame_range) === null) {
		flame_range = 0;
	}
	if (live(silent) === null) {
		silent = 0;
	}
	if (live(smoke) === null) {
		smoke = 0;
	}
	// A generator because /datum/explosion/New sleeps (stoplag) on big or busy blasts; a plain proc's new can't sleep.
	// (The admin drop-bomb verb crashed the page here, 2026-10-06.)
	return (yield* g.new_(f, T("/datum/explosion"), [live(epicenter), live(devastation_range), live(heavy_impact_range), live(light_impact_range), live(flash_range), live(adminlog), live(ignorecap), live(flame_range), live(silent), live(smoke)]));
}, true, { argTypes: [{ path: "/atom" }, {  }, {  }, {  }, {  }, {  }, {  }, {  }, {  }, {  }] });

rt.type(545, "/datum/explosion", "/datum", {
	explosion_id: null,
	started_at: null,
	running: 1,
	stopped: 0,
}, { global: { id_counter: 635 } });

// /datum/explosion/proc/New  (code/datums/explosion.dm:38)  may sleep
rt.def("/datum/explosion/proc/New", function* New(f: Frame, epicenter: Value, devastation_range: Value, heavy_impact_range: Value, light_impact_range: Value, flash_range: Value, adminlog: Value, ignorecap: Value, flame_range: Value, silent: Value, smoke: Value) {
	let id: Value = null, orig_dev_range: Value = null, orig_heavy_range: Value = null, orig_light_range: Value = null, max_range: Value = null, far_dist: Value = null, x0: Value = null, y0: Value = null, z0: Value = null, frequency: Value = null, ex_sound: Value = null, M: Value = null, M_turf: Value = null, dist: Value = null, far_volume: Value = null, postponeCycles: Value = null, E: Value = null, L: Value = null, exploded_this_tick: Value = null, affected_turfs: Value = null, reactionary: Value = null, cached_exp_block: Value = null, iteration: Value = null, affTurfLen: Value = null, expBlockLen: Value = null, TI: Value = null, _T: Value = null, init_dist: Value = null, dist_20: Value = null, Trajectory: Value = null, flame_dist: Value = null, throw_dist: Value = null, throw_dir: Value = null, I: Value = null, throw_range: Value = null, throw_at: Value = null, break_condition: Value = null, circumference: Value = null, Unexplode: Value = null, UnexplodeT: Value = null, Unexplode_17: Value = null, UnexplodeT_18: Value = null, took: Value = null, array: Value = null, A: Value = null, seen_turfs: Value = null, flung: Value = null, near: Value = null, C: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	f.vars = () => [epicenter, devastation_range, heavy_impact_range, light_impact_range, flash_range, adminlog, ignorecap, flame_range, silent, smoke, id, orig_dev_range, orig_heavy_range, orig_light_range, max_range, far_dist, x0, y0, z0, frequency, ex_sound, M, M_turf, dist, far_volume, postponeCycles, E, L, exploded_this_tick, affected_turfs, reactionary, cached_exp_block, iteration, affTurfLen, expBlockLen, TI, _T, init_dist, dist_20, Trajectory, flame_dist, throw_dist, throw_dir, I, throw_range, throw_at, break_condition, circumference, Unexplode, UnexplodeT, Unexplode_17, UnexplodeT_18, took, array, A, seen_turfs, flung, near, C, $0, $1, $2, $3, $4, $5, $e];
	rt.setSv(f, "explosion_id", (id = rt.incGl("id_counter", 1, false)));
	if (!truthy((epicenter = rt.getStep(f, live(epicenter), 0)))) {
		return live(f.dot);
	}
	rt.modGl("explosions", live(f.src), add);
	if (live(flame_range) === null) {
		flame_range = live(light_impact_range);
	}
	if (live(flash_range) === null) {
		flash_range = live(devastation_range);
	}
	orig_dev_range = live(devastation_range);
	orig_heavy_range = live(heavy_impact_range);
	orig_light_range = live(light_impact_range);
	if ((!truthy(live(ignorecap)) && !isEqual(rt.fv(f, "z", live(epicenter)), 5))) {
		devastation_range = (yield* g.call(f, P("/proc/min"), null, [rt.gl("MAX_EX_DEVESTATION_RANGE"), live(devastation_range)]));
		heavy_impact_range = (yield* g.call(f, P("/proc/min"), null, [rt.gl("MAX_EX_HEAVY_RANGE"), live(heavy_impact_range)]));
		light_impact_range = (yield* g.call(f, P("/proc/min"), null, [rt.gl("MAX_EX_LIGHT_RANGE"), live(light_impact_range)]));
		flash_range = (yield* g.call(f, P("/proc/min"), null, [rt.gl("MAX_EX_FLASH_RANGE"), live(flash_range)]));
		flame_range = (yield* g.call(f, P("/proc/min"), null, [rt.gl("MAX_EX_FLAME_RANGE"), live(flame_range)]));
	}
	yield* g.call(f, P("/proc/stoplag"), null, []);
	if (!truthy(rt.sv(f, "running"))) {
		rt.setSv(f, "stopped", 2);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	rt.setSv(f, "started_at", add($0, multiply($1, $2)));
	max_range = (yield* g.call(f, P("/proc/max"), null, [live(devastation_range), live(heavy_impact_range), live(light_impact_range), live(flame_range)]));
	if (truthy(live(adminlog))) {
		$0 = live(devastation_range);
		$1 = live(heavy_impact_range);
		$2 = live(light_impact_range);
		$3 = live(flame_range);
		$4 = (yield* g.call(f, P("/proc/get_area"), null, [live(epicenter)]));
		if (truthy(live(epicenter))) {
			$5 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(epicenter)), rt.fv(f, "y", live(epicenter)), rt.fv(f, "z", live(epicenter))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(epicenter)), rt.fv(f, "y", live(epicenter)), rt.fv(f, "z", live(epicenter))])]);
		} else {
			$5 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Explosion with size (＀, ＀, ＀, ＀) in area: ＀ ＀", [$0, $1, $2, $3, $4, fmt("＀", [$5])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Explosion with size (＀, ＀, ＀, ＀) in area ＀ (＀,＀,＀)", [live(devastation_range), live(heavy_impact_range), live(light_impact_range), live(flame_range), rt.gv(f, "name", rt.fv(f, "loc", live(epicenter))), rt.fv(f, "x", live(epicenter)), rt.fv(f, "y", live(epicenter)), rt.fv(f, "z", live(epicenter))])]);
	}
	far_dist = 0;
	far_dist = rt.modify(live(far_dist), multiply(live(heavy_impact_range), 5), add);
	far_dist = rt.modify(live(far_dist), multiply(live(devastation_range), 20), add);
	x0 = rt.fv(f, "x", live(epicenter));
	y0 = rt.fv(f, "y", live(epicenter));
	z0 = rt.fv(f, "z", live(epicenter));
	if (!truthy(live(silent))) {
		frequency = (yield* g.call(f, P("/proc/get_rand_frequency"), null, []));
		ex_sound = (yield* g.call(f, P("/proc/get_sfx"), null, ["explosion"]));
		M = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if ((truthy((M_turf = rt.getStep(f, live(M), 0))) && isEqual(rt.fv(f, "z", live(M_turf)), live(z0)))) {
				if (rt.le((dist = (yield* g.call(f, P("/proc/get_dist"), null, [live(M_turf), live(epicenter)]))), (yield* g.call(f, P("/proc/round"), null, [subtract(add(live(max_range), rt.fv(f, "view", rt.world())), 2), 1])))) {
					yield* g.callName(f, live(M), "playsound_local", [null, live(epicenter), null, live(ex_sound), null, 100, null, 1, null, live(frequency), "falloff", 5], rt.Args.Named);
				} else {
					if (rt.le(live(dist), live(far_dist))) {
						far_volume = (yield* g.call(f, P("/proc/max"), null, [30, (yield* g.call(f, P("/proc/min"), null, [live(far_dist), 50]))]));
						if (rt.le(live(dist), multiply(live(far_dist), 0.5))) {
							$0 = 50;
						} else {
							$0 = 0;
						}
						far_volume = rt.modify(live(far_volume), $0, add);
						yield* g.callName(f, live(M), "playsound_local", [null, live(epicenter), null, rt.rsc("sound/effects/explosionfar.ogg"), null, live(far_volume), null, 1, null, live(frequency), "falloff", 5], rt.Args.Named);
					}
				}
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
				if (!truthy(rt.sv(f, "running"))) {
					rt.setSv(f, "stopped", 2);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					return live(f.dot);
				}
			}
		}
		rt.endFor(f, 0);
	}
	postponeCycles = (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [divide(live(devastation_range), 8)])), 1]));
	yield* g.callName(f, rt.gl("SSlighting"), "postpone", [live(postponeCycles)]);
	yield* g.callName(f, rt.gl("SSmachines"), "postpone", [live(postponeCycles)]);
	if (rt.gt(live(heavy_impact_range), 1)) {
		E = null;
		if (truthy(live(smoke))) {
			E = (yield* g.new_(f, T("/datum/effect_system/explosion/smoke"), []));
		} else {
			E = (yield* g.new_(f, T("/datum/effect_system/explosion"), []));
		}
		yield* g.callName(f, live(E), "set_up", [live(epicenter)]);
		yield* g.callName(f, live(E), "start", []);
	}
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
		if (!truthy(rt.sv(f, "running"))) {
			rt.setSv(f, "stopped", 2);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	}
	if (truthy(live(flash_range))) {
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [live(flash_range), live(epicenter)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			yield* g.callName(f, live(L), "flash_act", []);
		}
		rt.endFor(f, 0);
	}
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
		if (!truthy(rt.sv(f, "running"))) {
			rt.setSv(f, "stopped", 2);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	}
	exploded_this_tick = rt.list();
	// stress-throw: where the players are looking from (every client's eye, several may be connected): items flung from tiles near one of
	// them fly for real (throw_at); the rest of the blast's items are moved to where the flight would end in one go (blast_fling).
	seen_turfs = rt.list();
	flung = rt.list();
	C = null;
	rt.forList(f, 1, rt.gl("clients"));
	while (($e = rt.next(f, 1)) !== undefined) {
		C = $e;
		near = rt.getStep(f, rt.fv(f, "eye", live(C)) || rt.fv(f, "mob", live(C)), 0);
		if (near) seen_turfs = rt.modify(live(seen_turfs), live(near), add);
	}
	rt.endFor(f, 1);
	affected_turfs = (yield* g.srcCall(f, "GatherSpiralTurfs", live(max_range), live(epicenter)));
	reactionary = rt.fv(f, "reactionary_explosions", rt.gl("config"));
	cached_exp_block = null;
	if (truthy(live(reactionary))) {
		cached_exp_block = (yield* g.srcCall(f, "CaculateExplosionBlock", live(affected_turfs)));
	}
	iteration = 0;
	affTurfLen = rt.len(f, live(affected_turfs));
	expBlockLen = rt.len(f, live(cached_exp_block));
	TI = null;
	// atmos-pipeq: pipes broken by the blast rebuild their neighbours' pipelines once at the end (flush_pipe_rebuilds below), not
	// once per broken pipe (each rebuild walks the whole pipe network and stores its air again). Back on after every stoplag, as
	// singularity eat does (another pass may have finished and turned it off). TG_PIPE_BATCH=0 turns it off.
	if (rt.gl("pipe_rebuild_defer") === null && truthy(rt.call(f, P("/proc/pipe_batch_on"), null, []))) rt.setGl("pipe_rebuild_defer", rt.list());
	rt.forList(f, 0, live(affected_turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		TI = $e;
		_T = live(TI);
		iteration = rt.inc(live(iteration), 1);
		init_dist = (yield* g.call(f, P("/proc/cheap_hypotenuse"), null, [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), live(x0), live(y0)]));
		dist_20 = live(init_dist);
		if (truthy(live(reactionary))) {
			Trajectory = live(_T);
			while (!isEqual(live(Trajectory), live(epicenter))) {
				Trajectory = (yield* g.call(f, P("/proc/get_step_towards"), null, [live(Trajectory), live(epicenter)]));
				dist_20 = rt.modify(live(dist_20), rt.index(live(cached_exp_block), live(Trajectory)), add);
			}
		}
		flame_dist = (rt.lt(live(dist_20), live(flame_range)) ? 1 : 0);
		throw_dist = live(dist_20);
		if (rt.lt(live(dist_20), live(devastation_range))) {
			dist_20 = 1;
		} else {
			if (rt.lt(live(dist_20), live(heavy_impact_range))) {
				dist_20 = 2;
			} else {
				if (rt.lt(live(dist_20), live(light_impact_range))) {
					dist_20 = 3;
				} else {
					dist_20 = 0;
				}
			}
		}
		if ((((truthy(live(flame_dist)) && truthy(rt.op(f, "Prob", [], [40]))) && !truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) && !truthy(rt.fv(f, "density", live(_T))))) {
			yield* g.new_(f, T("/obj/effect/hotspot"), [live(_T)]);
		}
		if (rt.gt(live(dist_20), 0)) {
			rt.setFv(f, "explosion_level", live(_T), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "explosion_level", live(_T)), live(dist_20)])));
			rt.setFv(f, "explosion_id", live(_T), live(id));
			yield* g.callName(f, live(_T), "ex_act", [live(dist_20)]);
			exploded_this_tick = rt.modify(live(exploded_this_tick), live(_T), add);
		}
		throw_dir = rt.getDir(f, live(epicenter), live(_T));
		I = null;
		near = 0;
		rt.forList(f, 1, live(seen_turfs));
		while (($e = rt.next(f, 1)) !== undefined) {
			if (rt.fv(f, "z", live($e)) === rt.fv(f, "z", live(_T)) && Math.abs(rt.fv(f, "x", live($e)) - rt.fv(f, "x", live(_T))) <= 15 && Math.abs(rt.fv(f, "y", live($e)) - rt.fv(f, "y", live(_T))) <= 15) {
				near = 1;
			}
		}
		rt.endFor(f, 1);
		rt.forList(f, 1, live(_T), T("/obj/item"));
		while (($e = rt.next(f, 1)) !== undefined) {
			I = $e;
			if (!truthy(rt.fv(f, "anchored", live(I))) && (rt.index(live(flung), live(I)) === null || truthy(rt.call(f, P("/proc/blast_throw_old"), null, [])))) { // stress-throw: an item already flung by this blast stays where it landed
				if (rt.index(live(flung), live(I)) === null && truthy(rt.call(f, P("/proc/stress_counts_on"), null, []))) rt.call(f, P("/proc/stress_count"), null, ["blast_unique_items", 1]);
				rt.setAt(live(flung), live(I), 1);
				throw_range = (yield* g.call(f, P("/proc/rand"), null, [live(throw_dist), live(max_range)]));
				throw_at = (yield* g.call(f, P("/proc/get_ranged_target_turf"), null, [live(I), live(throw_dir), live(throw_range)]));
				if (near || truthy(rt.call(f, P("/proc/blast_throw_old"), null, []))) {
					if (truthy(rt.call(f, P("/proc/stress_counts_on"), null, []))) { rt.call(f, P("/proc/stress_count"), null, ["blast_thrown", 1]); rt.call(f, P("/proc/stress_count"), null, ["blast_range_sum", throw_range]); }
					rt.setFv(f, "throw_speed", live(I), 4);
					rt.setGl("blast_throw_epi", live(epicenter));
					yield* g.callName(f, live(I), "throw_at", [live(throw_at), live(throw_range), 4]);
					rt.setGl("blast_throw_epi", null);
				} else {
					yield* g.callName(f, live(I), "blast_fling", [live(throw_at), live(throw_range), live(epicenter)]);
				}
			}
		}
		rt.endFor(f, 1);
		break_condition = null;
		if (truthy(live(reactionary))) {
			break_condition = ((isEqual(live(iteration), live(expBlockLen)) ? 1 : 0) && (rt.lt(live(iteration), live(affTurfLen)) ? 1 : 0));
		} else {
			break_condition = ((isEqual(live(iteration), live(affTurfLen)) ? 1 : 0) && (!truthy(rt.sv(f, "stopped")) ? 1 : 0));
		}
		if ((truthy(live(break_condition)) || rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
			if (!truthy(rt.sv(f, "running"))) {
				break;
			}
			affTurfLen = rt.len(f, live(affected_turfs));
			expBlockLen = rt.len(f, live(cached_exp_block));
			if (truthy(live(break_condition))) {
				if (truthy(live(reactionary))) {
					while (!(rt.lt(live(iteration), live(affTurfLen)) || !truthy(rt.sv(f, "running")))) {
						yield* g.call(f, P("/proc/stoplag"), null, []);
					}
				} else {
					while (!(rt.lt(live(iteration), live(expBlockLen)) || truthy(rt.sv(f, "stopped")))) {
						yield* g.call(f, P("/proc/stoplag"), null, []);
					}
				}
				if (!truthy(rt.sv(f, "running"))) {
					break;
				}
				affTurfLen = rt.len(f, live(affected_turfs));
				expBlockLen = rt.len(f, live(cached_exp_block));
			}
			circumference = multiply(multiply(3.1414999961853027, add(live(init_dist), 4)), 2);
			if (rt.gt(rt.len(f, live(exploded_this_tick)), live(circumference))) {
				Unexplode = null;
				rt.forList(f, 1, live(exploded_this_tick));
				while (($e = rt.next(f, 1)) !== undefined) {
					Unexplode = $e;
					rt.setFv(f, "explosion_level", (UnexplodeT = live(Unexplode)), 0);
				}
				rt.endFor(f, 1);
				yield* g.callName(f, live(exploded_this_tick), "Cut", []);
			}
			if (rt.gl("pipe_rebuild_defer") === null && truthy(rt.call(f, P("/proc/pipe_batch_on"), null, []))) rt.setGl("pipe_rebuild_defer", rt.list());
		}
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []);
	rt.setGl("pipe_rebuild_defer", null);
	Unexplode_17 = null;
	rt.forList(f, 0, live(exploded_this_tick));
	while (($e = rt.next(f, 0)) !== undefined) {
		Unexplode_17 = $e;
		rt.setFv(f, "explosion_level", (UnexplodeT_18 = live(Unexplode_17)), 0);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(exploded_this_tick), "Cut", []);
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	took = divide(subtract(add($0, multiply($1, $2)), rt.sv(f, "started_at")), 10);
	if (truthy(rt.gl("Debug2"))) {
		yield* g.call(f, P("/proc/log_world"), null, [fmt("## DEBUG: Explosion(＀,＀,＀)(d＀,h＀,l＀): Took ＀ seconds.", [live(x0), live(y0), live(z0), live(devastation_range), live(heavy_impact_range), live(light_impact_range), live(took)])]);
	}
	if (truthy(rt.sv(f, "running"))) {
		array = null;
		rt.forList(f, 0, rt.gl("doppler_arrays"));
		while (($e = rt.next(f, 0)) !== undefined) {
			array = $e;
			yield* g.callName(f, (A = live(array)), "sense_explosion", [live(epicenter), live(devastation_range), live(heavy_impact_range), live(light_impact_range), live(took), live(orig_dev_range), live(orig_heavy_range), live(orig_light_range)]);
		}
		rt.endFor(f, 0);
	}
	rt.incSrcVar(f, "stopped", 1, false);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /datum/explosion/proc/GatherSpiralTurfs  (code/datums/explosion.dm:267)  may sleep
rt.def("/datum/explosion/proc/GatherSpiralTurfs", function* GatherSpiralTurfs(f: Frame, range: Value, epicenter: Value) {
	f.vars = () => [range, epicenter];
	f.dot = rt.list();
	yield* g.call(f, P("/proc/spiral_range_turfs"), null, [null, live(range), null, live(epicenter), "outlist", live(f.dot), "tick_checked", 1], rt.Args.Named);
	rt.incSrcVar(f, "stopped", 1, false);
	return f.dot;
}, true, { waitfor: false });

// /datum/explosion/proc/CaculateExplosionBlock  (code/datums/explosion.dm:274)  may sleep
rt.def("/datum/explosion/proc/CaculateExplosionBlock", function* CaculateExplosionBlock(f: Frame, affected_turfs: Value) {
	let processed: Value = null, I: Value = null, _T: Value = null, current_exp_block: Value = null, O: Value = null, the_block: Value = null;
	let $0: any, $e: any;
	f.vars = () => [affected_turfs, processed, I, _T, current_exp_block, O, the_block, $0, $e];
	f.dot = rt.list();
	processed = 0;
	while (!truthy(rt.sv(f, "stopped")) && truthy(rt.sv(f, "running"))) {
		I = null;
		rt.forRange(f, 0, add(live(processed), 1), rt.len(f, live(affected_turfs)), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			_T = rt.index(live(affected_turfs), live(I));
			if (truthy(rt.fv(f, "density", live(_T)))) {
				$0 = rt.fv(f, "explosion_block", live(_T));
			} else {
				$0 = 0;
			}
			current_exp_block = $0;
			O = null;
			rt.forList(f, 1, live(_T), T("/obj"));
			while (($e = rt.next(f, 1)) !== undefined) {
				O = $e;
				if (isEqual((the_block = rt.fv(f, "explosion_block", live(O))), -1)) {
					$0 = (yield* g.callName(f, live(O), "GetExplosionBlock", []));
				} else {
					$0 = live(the_block);
				}
				current_exp_block = rt.modify(live(current_exp_block), $0, add);
			}
			rt.endFor(f, 1);
			rt.setAt(live(f.dot), live(_T), live(current_exp_block));
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				break;
			}
		}
		rt.endFor(f, 0);
		processed = live(I);
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	return f.dot;
}, true, { waitfor: false });

// /datum/explosion/proc/Destroy  (code/datums/explosion.dm:296)  may sleep
rt.def("/datum/explosion/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "running", 0);
	if (rt.lt(rt.sv(f, "stopped"), 2)) {
		return 2;
	}
	(rt.modGl("explosions", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /client/proc/check_bomb_impacts  (code/datums/explosion.dm:305)  may sleep
rt.def("/client/proc/check_bomb_impacts", function* check_bomb_impacts(f: Frame) {
	let newmode: Value = null, epicenter: Value = null, dev: Value = null, heavy: Value = null, light: Value = null, choices: Value = null, choice: Value = null, max_range: Value = null, x0: Value = null, y0: Value = null, wipe_colours: Value = null, _T: Value = null, dist: Value = null, TT: Value = null, O: Value = null, the_block: Value = null;
	let $0: any, $e: any;
	f.vars = () => [newmode, epicenter, dev, heavy, light, choices, choice, max_range, x0, y0, wipe_colours, _T, dist, TT, O, the_block, $0, $e];
	newmode = (yield* g.call(f, P("/proc/alert"), null, ["Use reactionary explosions?", "Check Bomb Impact", "Yes", "No"]));
	if (!truthy((epicenter = rt.getStep(f, rt.sv(f, "mob"), 0)))) {
		return live(f.dot);
	}
	dev = 0;
	heavy = 0;
	light = 0;
	choices = rt.list("Small Bomb", "Medium Bomb", "Big Bomb", "Custom Bomb");
	$0 = (choice = (yield* g.op(f, "Prompt", [0], [null, null, null, "Bomb Size?", live(choices)])));
	if (isEqual($0, null)) {
		return 0;
	} else if ($0 === "Small Bomb") {
		dev = 1;
		heavy = 2;
		light = 3;
	} else if ($0 === "Medium Bomb") {
		dev = 2;
		heavy = 3;
		light = 4;
	} else if ($0 === "Big Bomb") {
		dev = 3;
		heavy = 5;
		light = 7;
	} else if ($0 === "Custom Bomb") {
		dev = (yield* g.op(f, "Prompt", [32], [null, null, null, "Devestation range (Tiles):", null]));
		heavy = (yield* g.op(f, "Prompt", [32], [null, null, null, "Heavy impact range (Tiles):", null]));
		light = (yield* g.op(f, "Prompt", [32], [null, null, null, "Light impact range (Tiles):", null]));
	}
	max_range = (yield* g.call(f, P("/proc/max"), null, [live(dev), live(heavy), live(light)]));
	x0 = rt.fv(f, "x", live(epicenter));
	y0 = rt.fv(f, "y", live(epicenter));
	wipe_colours = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/spiral_range_turfs"), null, [live(max_range), live(epicenter)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		wipe_colours = rt.modify(live(wipe_colours), live(_T), add);
		dist = (yield* g.call(f, P("/proc/cheap_hypotenuse"), null, [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), live(x0), live(y0)]));
		if (isEqual(live(newmode), "Yes")) {
			TT = live(_T);
			while (!isEqual(live(TT), live(epicenter))) {
				if (truthy(rt.gv(f, "density", (TT = (yield* g.call(f, P("/proc/get_step_towards"), null, [live(TT), live(epicenter)])))))) {
					dist = rt.modify(live(dist), rt.fv(f, "explosion_block", live(TT)), add);
				}
				O = null;
				rt.forList(f, 1, live(_T), T("/obj"));
				while (($e = rt.next(f, 1)) !== undefined) {
					O = $e;
					if (isEqual((the_block = rt.fv(f, "explosion_block", live(O))), -1)) {
						$0 = (yield* g.callName(f, live(O), "GetExplosionBlock", []));
					} else {
						$0 = live(the_block);
					}
					dist = rt.modify(live(dist), $0, add);
				}
				rt.endFor(f, 1);
			}
		}
		if (rt.lt(live(dist), live(dev))) {
			rt.setFv(f, "color", live(_T), "red");
			rt.setFv(f, "maptext", live(_T), "Dev");
		} else {
			if (rt.lt(live(dist), live(heavy))) {
				rt.setFv(f, "color", live(_T), "yellow");
				rt.setFv(f, "maptext", live(_T), "Heavy");
			} else {
				if (rt.lt(live(dist), live(light))) {
					rt.setFv(f, "color", live(_T), "blue");
					rt.setFv(f, "maptext", live(_T), "Light");
				} else {
					continue;
				}
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [100]);
	_T = null;
	rt.forList(f, 0, live(wipe_colours), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.setFv(f, "color", live(_T), null);
		rt.setFv(f, "maptext", live(_T), "");
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { name: "Check Bomb Impact", category: "Debug" } });

// /proc/dyn_explosion  (code/datums/explosion.dm:372)
rt.def("/proc/dyn_explosion", function dyn_explosion(f: Frame, epicenter: Value, power: Value, flash_range: Value, adminlog: Value, ignorecap: Value, flame_range: Value, silent: Value, smoke: Value) {
	let range: Value = null;
	f.vars = () => [adminlog, ignorecap, flame_range, silent, smoke, range];
	if (live(adminlog) === null) {
		adminlog = 1;
	}
	if (live(ignorecap) === null) {
		ignorecap = 1;
	}
	if (live(flame_range) === null) {
		flame_range = 0;
	}
	if (live(silent) === null) {
		silent = 0;
	}
	if (live(smoke) === null) {
		smoke = 1;
	}
	if (!truthy(live(power))) {
		return live(f.dot);
	}
	range = 0;
	range = rt.call(f, P("/proc/round"), null, [rt.power(multiply(2, live(power)), rt.gl("DYN_EX_SCALE"))]);
	rt.call(f, P("/proc/explosion"), null, [live(epicenter), rt.call(f, P("/proc/round"), null, [multiply(live(range), 0.25)]), rt.call(f, P("/proc/round"), null, [multiply(live(range), 0.5)]), rt.call(f, P("/proc/round"), null, [live(range)]), multiply(live(flash_range), live(range)), live(adminlog), live(ignorecap), multiply(live(flame_range), live(range)), live(silent), live(smoke)]);
	return f.dot;
});
