// Based on /tg/station's code/datums/explosion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// explosion.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalexplosions", function InitGlobalexplosions(f: Frame) {
	GLOB.explosions = list();
	this.gvars_datum_init_order += "explosions";
	return f.dot;
});

// explosion.dm:8
rt.def("/proc/explosion", function* explosion(f: Frame, epicenter: Value, devastation_range: Value, heavy_impact_range: Value, light_impact_range: Value, flash_range: Value, adminlog: Value, ignorecap: Value, flame_range: Value, silent: Value, smoke: Value) {
	adminlog ??= 1;
	ignorecap ??= 0;
	flame_range ??= 0;
	silent ??= 0;
	smoke ??= 0;
	// A generator because /datum/explosion/New sleeps (stoplag) on big or busy blasts; a plain proc's new can't sleep.
	// (The admin drop-bomb verb crashed the page here, 2026-10-06.)
	return (yield* new_(T("/datum/explosion"), epicenter, devastation_range, heavy_impact_range, light_impact_range, flash_range, adminlog, ignorecap, flame_range, silent, smoke));
}, true, { argTypes: [{ path: "/atom" }, {  }, {  }, {  }, {  }, {  }, {  }, {  }, {  }, {  }] });

rt.type(545, "/datum/explosion", "/datum", {
	explosion_id: null,
	started_at: null,
	running: 1,
	stopped: 0,
}, { global: { id_counter: 635 } });

// explosion.dm:38
rt.def("/datum/explosion/proc/New", function* New(f: Frame, epicenter: Value, devastation_range: Value, heavy_impact_range: Value, light_impact_range: Value, flash_range: Value, adminlog: Value, ignorecap: Value, flame_range: Value, silent: Value, smoke: Value) {
	let id: Value = null, frequency: Value = null, ex_sound: Value = null, M: Value = null, M_turf: Value = null, dist: Value = null, far_volume: Value = null, E: Value = null, L: Value = null, cached_exp_block: Value = null, TI: Value = null, _T: Value = null, init_dist: Value = null, dist_20: Value = null, Trajectory: Value = null, flame_dist: Value = null, throw_dist: Value = null, throw_dir: Value = null, I: Value = null, throw_range: Value = null, throw_at: Value = null, break_condition: Value = null, circumference: Value = null, Unexplode: Value = null, UnexplodeT: Value = null, Unexplode_17: Value = null, UnexplodeT_18: Value = null, array: Value = null, A: Value = null, near: Value = null, C: Value = null;
	let $2: any, $3: any, $4: any, $5: any, $e: any;
	this.explosion_id = (id = rt.incGl("id_counter", 1, false));
	if (!(epicenter = rt.getStep(f, epicenter, 0))) {
		return f.dot;
	}
	GLOB.explosions += this;
	flame_range ??= light_impact_range;
	flash_range ??= devastation_range;
	let orig_dev_range: Value = devastation_range;
	let orig_heavy_range: Value = heavy_impact_range;
	let orig_light_range: Value = light_impact_range;
	if (!ignorecap && epicenter.z != 5) {
		devastation_range = min(GLOB.MAX_EX_DEVESTATION_RANGE, devastation_range);
		heavy_impact_range = min(GLOB.MAX_EX_HEAVY_RANGE, heavy_impact_range);
		light_impact_range = min(GLOB.MAX_EX_LIGHT_RANGE, light_impact_range);
		flash_range = min(GLOB.MAX_EX_FLASH_RANGE, flash_range);
		flame_range = min(GLOB.MAX_EX_FLAME_RANGE, flame_range);
	}
	yield* stoplag();
	if (!this.running) {
		this.stopped = 2;
		yield* qdel(this);
		return f.dot;
	}
	let $0: any = rt.world().timeofday;
	let $1: any = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	this.started_at = $0 + $1 * $2;
	let max_range: Value = max(devastation_range, heavy_impact_range, light_impact_range, flame_range);
	if (adminlog) {
		$0 = devastation_range;
		$1 = heavy_impact_range;
		$2 = light_impact_range;
		$3 = flame_range;
		$4 = get_area(epicenter);
		if (epicenter) {
			$5 = `${`(${epicenter.x},${epicenter.y},${epicenter.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${epicenter.x};Y=${epicenter.y};Z=${epicenter.z}'>JMP</a>)`}`;
		} else {
			$5 = "nonexistent location";
		}
		message_admins(`Explosion with size (${$0}, ${$1}, ${$2}, ${$3}) in area: ${$4} ${`${$5}`}`);
		log_game(`Explosion with size (${devastation_range}, ${heavy_impact_range}, ${light_impact_range}, ${flame_range}) in area ${epicenter.loc.name} (${epicenter.x},${epicenter.y},${epicenter.z})`);
	}
	let far_dist: Value = 0;
	far_dist += heavy_impact_range * 5;
	far_dist += devastation_range * 20;
	let x0: Value = epicenter.x;
	let y0: Value = epicenter.y;
	let z0: Value = epicenter.z;
	if (!silent) {
		frequency = get_rand_frequency();
		ex_sound = get_sfx("explosion");
		for (M of each(GLOB.player_list, T("/mob"))) {
			if ((M_turf = rt.getStep(f, M, 0)) && M_turf.z == z0) {
				if ((dist = get_dist(M_turf, epicenter)) <= round(max_range + rt.world().view - 2, 1)) {
					yield* M.playsound_local(epicenter, ex_sound, 100, 1, frequency, { falloff: 5 });
				} else if (dist <= far_dist) {
					far_volume = max(30, min(far_dist, 50));
					far_volume += dist <= far_dist * 0.5 ? 50 : 0;
					yield* M.playsound_local(epicenter, rt.rsc("sound/effects/explosionfar.ogg"), far_volume, 1, frequency, { falloff: 5 });
				}
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
				if (!this.running) {
					this.stopped = 2;
					yield* qdel(this);
					return f.dot;
				}
			}
		}
	}
	let postponeCycles: Value = max(round(devastation_range / 8), 1);
	GLOB.SSlighting.postpone(postponeCycles);
	GLOB.SSmachines.postpone(postponeCycles);
	if (heavy_impact_range > 1) {
		if (smoke) {
			E = (yield* new_(T("/datum/effect_system/explosion/smoke")));
		} else {
			E = (yield* new_(T("/datum/effect_system/explosion")));
		}
		yield* E.set_up(epicenter);
		yield* E.start();
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
		if (!this.running) {
			this.stopped = 2;
			yield* qdel(this);
			return f.dot;
		}
	}
	if (flash_range) {
		for (L of each(viewers(flash_range, epicenter), T("/mob/living"))) {
			yield* L.flash_act();
		}
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
		if (!this.running) {
			this.stopped = 2;
			yield* qdel(this);
			return f.dot;
		}
	}
	let exploded_this_tick: Value = list();
	// stress-throw: where the players are looking from (every client's eye, several may be connected): items flung from tiles near one of
	// them fly for real (throw_at); the rest of the blast's items are moved to where the flight would end in one go (blast_fling).
	let seen_turfs: Value = list();
	let flung: Value = list();
	rt.forList(f, 1, GLOB.clients);
	while (($e = rt.next(f, 1)) !== undefined) {
		C = $e;
		near = rt.getStep(f, C.eye || C.mob, 0);
		if (near) seen_turfs += near;
	}
	rt.endFor(f, 1);
	let affected_turfs: Value = (yield* this.GatherSpiralTurfs(max_range, epicenter));
	let reactionary: Value = GLOB.config.reactionary_explosions;
	if (reactionary) {
		cached_exp_block = (yield* this.CaculateExplosionBlock(affected_turfs));
	}
	let iteration: Value = 0;
	let affTurfLen: Value = rt.len(f, affected_turfs);
	let expBlockLen: Value = rt.len(f, cached_exp_block);
	// atmos-pipeq: pipes broken by the blast rebuild their neighbours' pipelines once at the end (flush_pipe_rebuilds below), not
	// once per broken pipe (each rebuild walks the whole pipe network and stores its air again). Back on after every stoplag, as
	// singularity eat does (another pass may have finished and turned it off). TG_PIPE_BATCH=0 turns it off.
	if (GLOB.pipe_rebuild_defer === null && rt.call(f, P("/proc/pipe_batch_on"), null, [])) GLOB.pipe_rebuild_defer = list();
	for (TI of each(affected_turfs)) {
		_T = TI;
		iteration++;
		init_dist = cheap_hypotenuse(_T.x, _T.y, x0, y0);
		dist_20 = init_dist;
		if (reactionary) {
			Trajectory = _T;
			while (Trajectory != epicenter) {
				Trajectory = get_step_towards(Trajectory, epicenter);
				dist_20 += rt.index(cached_exp_block, Trajectory);
			}
		}
		flame_dist = (dist_20 < flame_range ? 1 : 0);
		throw_dist = dist_20;
		if (dist_20 < devastation_range) {
			dist_20 = 1;
		} else if (dist_20 < heavy_impact_range) {
			dist_20 = 2;
		} else if (dist_20 < light_impact_range) {
			dist_20 = 3;
		} else {
			dist_20 = 0;
		}
		if (flame_dist && prob(40) && !rt.istype(_T, T("/turf/open/space")) && !_T.density) {
			yield* new_(T("/obj/effect/hotspot"), _T);
		}
		if (dist_20 > 0) {
			_T.explosion_level = max(_T.explosion_level, dist_20);
			_T.explosion_id = id;
			yield* _T.ex_act(dist_20);
			exploded_this_tick += _T;
		}
		throw_dir = rt.getDir(f, epicenter, _T);
		I = null;
		near = 0;
		rt.forList(f, 1, seen_turfs);
		while (($e = rt.next(f, 1)) !== undefined) {
			if ($e.z === _T.z && Math.abs($e.x - _T.x) <= 15 && Math.abs($e.y - _T.y) <= 15) {
				near = 1;
			}
		}
		rt.endFor(f, 1);
		for (I of each(_T, T("/obj/item"))) {
			if (!I.anchored && (rt.index(flung, I) === null || rt.call(f, P("/proc/blast_throw_old"), null, []))) { // stress-throw: an item already flung by this blast stays where it landed
				if (rt.index(flung, I) === null && rt.call(f, P("/proc/stress_counts_on"), null, [])) rt.call(f, P("/proc/stress_count"), null, ["blast_unique_items", 1]);
				rt.setAt(flung, I, 1);
				throw_range = rand(throw_dist, max_range);
				throw_at = get_ranged_target_turf(I, throw_dir, throw_range);
				if (near || rt.call(f, P("/proc/blast_throw_old"), null, [])) {
					if (rt.call(f, P("/proc/stress_counts_on"), null, [])) { rt.call(f, P("/proc/stress_count"), null, ["blast_thrown", 1]); rt.call(f, P("/proc/stress_count"), null, ["blast_range_sum", throw_range]); }
					I.throw_speed = 4;
					GLOB.blast_throw_epi = epicenter;
					yield* I.throw_at(throw_at, throw_range, 4);
					GLOB.blast_throw_epi = null;
				} else {
					yield* I.blast_fling(throw_at, throw_range, epicenter);
				}
			}
		}
		break_condition = null;
		if (reactionary) {
			break_condition = ((iteration == expBlockLen ? 1 : 0) && (iteration < affTurfLen ? 1 : 0));
		} else {
			break_condition = ((iteration == affTurfLen ? 1 : 0) && (!this.stopped ? 1 : 0));
		}
		if (break_condition || rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
			if (!this.running) {
				break;
			}
			affTurfLen = rt.len(f, affected_turfs);
			expBlockLen = rt.len(f, cached_exp_block);
			if (break_condition) {
				if (reactionary) {
					while (!(iteration < affTurfLen || !this.running)) {
						yield* stoplag();
					}
				} else {
					while (!(iteration < expBlockLen || this.stopped)) {
						yield* stoplag();
					}
				}
				if (!this.running) {
					break;
				}
				affTurfLen = rt.len(f, affected_turfs);
				expBlockLen = rt.len(f, cached_exp_block);
			}
			circumference = 3.1415 * (init_dist + 4) * 2;
			if (rt.len(f, exploded_this_tick) > circumference) {
				Unexplode = null;
				for (Unexplode of each(exploded_this_tick)) {
					(UnexplodeT = Unexplode).explosion_level = 0;
				}
				exploded_this_tick.Cut();
			}
			if (GLOB.pipe_rebuild_defer === null && rt.call(f, P("/proc/pipe_batch_on"), null, [])) GLOB.pipe_rebuild_defer = list();
		}
	}
	rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []);
	GLOB.pipe_rebuild_defer = null;
	for (Unexplode_17 of each(exploded_this_tick)) {
		(UnexplodeT_18 = Unexplode_17).explosion_level = 0;
	}
	exploded_this_tick.Cut();
	$0 = rt.world().timeofday;
	$1 = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	let took: Value = ($0 + $1 * $2 - this.started_at) / 10;
	if (GLOB.Debug2) {
		log_world(`## DEBUG: Explosion(${x0},${y0},${z0})(d${devastation_range},h${heavy_impact_range},l${light_impact_range}): Took ${took} seconds.`);
	}
	if (this.running) {
		for (array of each(GLOB.doppler_arrays)) {
			yield* (A = array).sense_explosion(epicenter, devastation_range, heavy_impact_range, light_impact_range, took, orig_dev_range, orig_heavy_range, orig_light_range);
		}
	}
	++this.stopped;
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// explosion.dm:267
rt.def("/datum/explosion/proc/GatherSpiralTurfs", function* GatherSpiralTurfs(f: Frame, range: Value, epicenter: Value) {
	f.dot = list();
	yield* spiral_range_turfs(range, epicenter, { outlist: f.dot, tick_checked: 1 });
	++this.stopped;
	return f.dot;
}, true, { waitfor: false });

// explosion.dm:274
rt.def("/datum/explosion/proc/CaculateExplosionBlock", function* CaculateExplosionBlock(f: Frame, affected_turfs: Value) {
	let I: Value = null, _T: Value = null, current_exp_block: Value = null, O: Value = null, the_block: Value = null;
	let $0: any, $e: any;
	f.dot = list();
	let processed: Value = 0;
	while (!this.stopped && this.running) {
		I = null;
		rt.forRange(f, 0, processed + 1, rt.len(f, affected_turfs), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			_T = rt.index(affected_turfs, I);
			if (_T.density) {
				$0 = _T.explosion_block;
			} else {
				$0 = 0;
			}
			current_exp_block = $0;
			O = null;
			for (O of each(_T, T("/obj"))) {
				if ((the_block = O.explosion_block) == EXPLOSION_BLOCK_PROC) {
					$0 = O.GetExplosionBlock();
				} else {
					$0 = the_block;
				}
				current_exp_block += $0;
			}
			rt.setAt(f.dot, _T, current_exp_block);
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				break;
			}
		}
		rt.endFor(f, 0);
		processed = I;
		yield* stoplag();
	}
	return f.dot;
}, true, { waitfor: false });

// explosion.dm:296
rt.def("/datum/explosion/proc/Destroy", function* Destroy(f: Frame) {
	this.running = 0;
	if (this.stopped < QDEL_HINT_IWILLGC) {
		return QDEL_HINT_IWILLGC;
	}
	GLOB.explosions -= this;
	return (yield* parent_proc());
}, true);

// explosion.dm:305
rt.def("/client/proc/check_bomb_impacts", function* check_bomb_impacts(f: Frame) {
	let epicenter: Value = null, choice: Value = null, _T: Value = null, dist: Value = null, TT: Value = null, O: Value = null, the_block: Value = null;
	let $e: any;
	let newmode: Value = (yield* alert("Use reactionary explosions?", "Check Bomb Impact", "Yes", "No"));
	if (!(epicenter = rt.getStep(f, this.mob, 0))) {
		return f.dot;
	}
	let dev: Value = 0;
	let heavy: Value = 0;
	let light: Value = 0;
	let choices: Value = list("Small Bomb", "Medium Bomb", "Big Bomb", "Custom Bomb");
	let $0: any = (choice = (yield* g.op(f, "Prompt", [0], [null, null, null, "Bomb Size?", choices])));
	if ($0 == null) {
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
	let max_range: Value = max(dev, heavy, light);
	let x0: Value = epicenter.x;
	let y0: Value = epicenter.y;
	let wipe_colours: Value = list();
	for (_T of each((yield* spiral_range_turfs(max_range, epicenter)), T("/turf"))) {
		wipe_colours += _T;
		dist = cheap_hypotenuse(_T.x, _T.y, x0, y0);
		if (newmode == "Yes") {
			TT = _T;
			while (TT != epicenter) {
				if ((TT = get_step_towards(TT, epicenter)).density) {
					dist += TT.explosion_block;
				}
				O = null;
				for (O of each(_T, T("/obj"))) {
					dist += (the_block = O.explosion_block) == EXPLOSION_BLOCK_PROC ? O.GetExplosionBlock() : the_block;
				}
			}
		}
		if (dist < dev) {
			_T.color = "red";
			_T.maptext = "Dev";
		} else if (dist < heavy) {
			_T.color = "yellow";
			_T.maptext = "Heavy";
		} else if (dist < light) {
			_T.color = "blue";
			_T.maptext = "Light";
		} else {
			continue;
		}
	}
	yield* sleep(100);
	_T = null;
	for (_T of each(wipe_colours, T("/turf"))) {
		_T.color = null;
		_T.maptext = "";
	}
	return f.dot;
}, true, { verb: { name: "Check Bomb Impact", category: "Debug" } });

// explosion.dm:372
rt.def("/proc/dyn_explosion", function dyn_explosion(f: Frame, epicenter: Value, power: Value, flash_range: Value, adminlog: Value, ignorecap: Value, flame_range: Value, silent: Value, smoke: Value) {
	adminlog ??= 1;
	ignorecap ??= 1;
	flame_range ??= 0;
	silent ??= 0;
	smoke ??= 1;
	if (!power) {
		return f.dot;
	}
	let range: Value = round((2 * power) ** GLOB.DYN_EX_SCALE);
	explosion(epicenter, round(range * 0.25), round(range * 0.5), round(range), flash_range * range, adminlog, ignorecap, flame_range * range, silent, smoke);
	return f.dot;
});
