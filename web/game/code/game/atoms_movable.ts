// Based on /tg/station's code/game/atoms_movable.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, truthy, fmt } = rt;


rt.type(4803, "/atom/movable", "/atom", {
	can_be_unanchored: 0,
	last_move: null,
	anchored: 0,
	throwing: null,
	throw_speed: 2,
	throw_range: 7,
	pulledby: null,
	initial_language_holder: rt.typePath("/datum/language_holder"),
	language_holder: null,
	verb_say: "says",
	verb_ask: "asks",
	verb_exclaim: "exclaims",
	verb_whisper: "whispers",
	verb_yell: "yells",
	inertia_dir: 0,
	inertia_last_loc: null,
	inertia_moving: 0,
	inertia_next_move: 0,
	inertia_move_delay: 5,
	pass_flags: 0,
	moving_diagonally: 0,
	client_mobs_in_contents: null,
	acted_explosions: null,
	force_moving: null,
	floating: 0,
	can_buckle: 0,
	buckle_lying: -1,
	buckle_requires_restraints: 0,
	buckled_mobs: null,
	max_buckled_mobs: 1,
	buckle_prevents_pull: 0,
	pressure_resistance: 10,
	last_high_pressure_movement_air_cycle: 0,
	orbiting: null,
	screen_loc: null,
	animate_movement: 1,
	locs: null,
	glide_size: 8,
	step_size: null,
	bound_x: null,
	bound_y: null,
	bound_width: null,
	bound_height: null,
	bounds: null,
	particles: null,
	layer: 3,
	appearance_flags: 768,
}, { tmp: ["bound_x","bound_y","bound_width","bound_height"] });

// atoms_movable.dm:41
rt.def("/atom/movable/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	let _T: Value = null;
	if (rt.isIn(f, var_name, rt.gl("banned_edits#2"))) {
		return 0;
	}
	if (rt.isIn(f, var_name, GLOB.careful_edits) && var_value % rt.world().icon_size != 0) {
		return 0;
	}
	if (var_name === "x") {
		if (_T = rt.locate(var_value, this.y, this.z)) {
			yield* this.forceMove(_T);
			return 1;
		}
		return 0;
	} else if (var_name === "y") {
		if (_T = rt.locate(this.x, var_value, this.z)) {
			yield* this.forceMove(_T);
			return 1;
		}
		return 0;
	} else if (var_name === "z") {
		if (_T = rt.locate(this.x, this.y, var_value)) {
			yield* this.forceMove(_T);
			return 1;
		}
		return 0;
	} else if (var_name === "loc") {
		if (var_value === null || rt.istype(var_value, T("/atom"))) {
			yield* this.forceMove(var_value);
			return 1;
		}
		return 0;
	}
	return (yield* parent_proc());
}, true);

// atoms_movable.dm:72
rt.def("/atom/movable/proc/Move", function* Move(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!this.loc || !f.args[0]) {
		return 0;
	}
	let oldloc: Value = this.loc;
	if (this.loc != f.args[0]) {
		if (!rt.bitAnd(f.args[1], f.args[1] - 1)) {
			f.dot = (yield* parent_proc());
		} else {
			this.moving_diagonally = 1;
			if (rt.bitAnd(f.args[1], 1)) {
				if (rt.bitAnd(f.args[1], 4)) {
					if (yield* step(this, 1)) {
						this.moving_diagonally = 2;
						f.dot = (yield* step(this, 4));
					} else if (yield* step(this, 4)) {
						this.moving_diagonally = 2;
						f.dot = (yield* step(this, 1));
					}
				} else if (rt.bitAnd(f.args[1], 8)) {
					if (yield* step(this, 1)) {
						this.moving_diagonally = 2;
						f.dot = (yield* step(this, 8));
					} else if (yield* step(this, 8)) {
						this.moving_diagonally = 2;
						f.dot = (yield* step(this, 1));
					}
				}
			} else if (rt.bitAnd(f.args[1], 2)) {
				if (rt.bitAnd(f.args[1], 4)) {
					if (yield* step(this, 2)) {
						this.moving_diagonally = 2;
						f.dot = (yield* step(this, 4));
					} else if (yield* step(this, 4)) {
						this.moving_diagonally = 2;
						f.dot = (yield* step(this, 2));
					}
				} else if (rt.bitAnd(f.args[1], 8)) {
					if (yield* step(this, 2)) {
						this.moving_diagonally = 2;
						f.dot = (yield* step(this, 8));
					} else if (yield* step(this, 8)) {
						this.moving_diagonally = 2;
						f.dot = (yield* step(this, 2));
					}
				}
			}
			this.moving_diagonally = 0;
			return f.dot;
		}
	}
	if (!this.loc || this.loc == oldloc && oldloc != f.args[0]) {
		this.last_move = 0;
		return f.dot;
	}
	if (f.dot) {
		yield* this.Moved(oldloc, f.args[1]);
	}
	this.last_move = f.args[1];
	yield* this.setDir(f.args[1]);
	if (!(f.dot && this.has_buckled_mobs() && !(yield* this.handle_buckled_mob_movement(this.loc, f.args[1])))) return f.dot;
	f.dot = 0;
	return f.dot;
}, true, { args: ["newloc", "direct"] });

// atoms_movable.dm:127
rt.def("/atom/movable/proc/Moved", function* Moved(f: Frame, OldLoc: Value, Dir: Value) {
	let thing: Value = null, O: Value = null, proximity_monitor: Value = null;
	if (!this.inertia_moving) {
		this.inertia_next_move = rt.worldTime(f) + this.inertia_move_delay;
		yield* this.newtonian_move(Dir);
	}
	if (rt.length(this.client_mobs_in_contents)) {
		yield* this.update_parallax_contents();
	}
	if (this.orbiters) {
		for (thing of each(this.orbiters)) {
			yield* (O = thing).Check();
		}
	}
	if (this.orbiting) {
		yield* this.orbiting.Check();
	}
	if (rt.bitAnd(this.flags, 2048)) {
		yield* this.clean_on_move();
	}
	if (proximity_monitor = this.proximity_monitor) {
		yield* proximity_monitor.HandleMove();
	}
	return 1;
}, true);

// atoms_movable.dm:150
rt.def("/atom/movable/proc/clean_on_move", function* clean_on_move(f: Frame) {
	let tile: Value = null, A: Value = null, cleaned_item: Value = null, cleaned_human: Value = null;
	if (!isturf((tile = this.loc))) return f.dot;
	tile.clean_blood();
	for (A of each(tile)) {
		if (rt.istype(A, T("/obj/effect/decal/cleanable")) || rt.istype(A, T("/obj/effect/rune"))) {
			yield* qdel(A);
		} else if (rt.istype(A, T("/obj/item"))) {
			(cleaned_item = A).clean_blood();
		} else if (rt.istype(A, T("/mob/living/carbon/human"))) {
			if ((cleaned_human = A).lying) {
				if (cleaned_human.head) {
					cleaned_human.head.clean_blood();
					yield* cleaned_human.update_inv_head();
				}
				if (cleaned_human.wear_suit) {
					cleaned_human.wear_suit.clean_blood();
					yield* cleaned_human.update_inv_wear_suit();
				} else if (cleaned_human.w_uniform) {
					cleaned_human.w_uniform.clean_blood();
					yield* cleaned_human.update_inv_w_uniform();
				}
				if (cleaned_human.shoes) {
					cleaned_human.shoes.clean_blood();
					cleaned_human.update_inv_shoes();
				}
				cleaned_human.clean_blood();
				cleaned_human.wash_cream();
				to_chat(cleaned_human, `<span class='danger'>${this} cleans your face!</span>`);
			}
		}
	}
	return f.dot;
}, true);

// atoms_movable.dm:179
rt.def("/atom/movable/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	let _T: Value = null, currentturf: Value = null, targetturf: Value = null, AM: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	let inform_admins: Value = this.secondary_flags ? rt.index(this.secondary_flags, "inform_admins_on_relocate") : 0;
	let stationloving: Value = this.secondary_flags ? rt.index(this.secondary_flags, "stationloving") : 0;
	if (inform_admins && force) {
		_T = rt.getStep(f, this, 0);
		$0 = this;
		if (_T) {
			$1 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
		} else {
			$1 = "nonexistent location";
		}
		message_admins(`${$0} has been !!force deleted!! in ${`${$1}`}.`);
		log_game(`${this} has been !!force deleted!! in ${`(${_T.x},${_T.y},${_T.z})`}.`);
	}
	if (stationloving && !force) {
		currentturf = rt.getStep(f, this, 0);
		targetturf = (yield* this.relocate());
		log_game(`${this} has been destroyed in ${`(${currentturf.x},${currentturf.y},${currentturf.z})`}. Moving it to ${`(${targetturf.x},${targetturf.y},${targetturf.z})`}.`);
		if (inform_admins) {
			$0 = this;
			if (currentturf) {
				$1 = `${`(${currentturf.x},${currentturf.y},${currentturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${currentturf.x};Y=${currentturf.y};Z=${currentturf.z}'>JMP</a>)`}`;
			} else {
				$1 = "nonexistent location";
			}
			$1 = `${$1}`;
			if (targetturf) {
				$2 = `${`(${targetturf.x},${targetturf.y},${targetturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${targetturf.x};Y=${targetturf.y};Z=${targetturf.z}'>JMP</a>)`}`;
			} else {
				$2 = "nonexistent location";
			}
			message_admins(`${$0} has been destroyed in ${$1}. Moving it to ${`${$2}`}.`);
		}
		return QDEL_HINT_LETMELIVE;
	}
	if (stationloving && force) {
		this.isprocessing = 0;
		GLOB.SSinbounds.processing -= this;
	}
	yield* qdel(this.proximity_monitor);
	this.proximity_monitor = null;
	yield* qdel(this.language_holder);
	this.language_holder = null;
	yield* this.unbuckle_all_mobs({ force: 1 });
	f.dot = (yield* parent_proc());
	if (this.loc) {
		yield* this.loc.handle_atom_del(this);
	}
	for (AM of each(this.contents, T("/atom/movable"))) {
		yield* qdel(AM);
	}
	this.loc = null;
	this.invisibility = INVISIBILITY_ABSTRACT;
	if (!this.pulledby) return f.dot;
	yield* this.pulledby.stop_pulling();
	return f.dot;
}, true);

// BYOND built-in.
rt.def("/atom/movable/proc/Bump", undefined, false, { args: ["Obstacle"] });

// atoms_movable.dm:221
rt.def("/atom/movable/proc/Bump", function* Bump(f: Frame, A: Value, yes: Value) {
	if (!(A && yes)) return f.dot;
	if (this.throwing) {
		yield* this.throwing.hit_atom(A);
		f.dot = 1;
		if (!A || !A || A.gc_destroyed) {
			return f.dot;
		}
	}
	yield* A.Bumped(this);
	return f.dot;
}, true);

// atoms_movable.dm:232
rt.def("/atom/movable/proc/forceMove", function* forceMove(f: Frame, destination: Value) {
	let oldloc: Value = null, same_loc: Value = null, old_area: Value = null, destarea: Value = null, AM: Value = null;
	if (destination) {
		if (this.pulledby) {
			yield* this.pulledby.stop_pulling();
		}
		oldloc = this.loc;
		same_loc = (oldloc == destination ? 1 : 0);
		old_area = get_area(oldloc);
		destarea = get_area(destination);
		if (oldloc && !same_loc) {
			yield* oldloc.Exited(this, destination);
			if (old_area) {
				yield* old_area.Exited(this, destination);
			}
		}
		this.loc = destination;
		if (!same_loc) {
			yield* destination.Entered(this, oldloc);
			if (destarea && old_area != destarea) {
				yield* destarea.Entered(this, oldloc);
			}
			for (AM of each(destination, T("/atom/movable"))) {
				if (AM == this) {
					continue;
				}
				yield* AM.Crossed(this, oldloc);
			}
		}
		yield* this.Moved(oldloc, 0);
		return 1;
	}
	return 0;
}, true);

// atoms_movable.dm:260
rt.def("/mob/living/proc/forceMove", function* forceMove(f: Frame, destination: Value) {
	yield* this.stop_pulling();
	if (this.buckled) {
		yield* this.buckled.unbuckle_mob(this, { force: 1 });
	}
	if (this.has_buckled_mobs()) {
		yield* this.unbuckle_all_mobs({ force: 1 });
	}
	f.dot = (yield* parent_proc());
	if (this.client) {
		yield* this.reset_perspective(destination);
	}
	yield* this.update_canmove();
	return f.dot;
}, true);

// atoms_movable.dm:272
rt.def("/mob/living/brain/proc/forceMove", function* forceMove(f: Frame, destination: Value) {
	if (this.container) {
		return (yield* this.container.forceMove(destination));
	}
	CRASH("Brainmob without container.");
	return f.dot;
}, true);

// atoms_movable.dm:282
rt.def("/atom/movable/proc/Process_Spacemove", function Process_Spacemove(f: Frame, movement_dir: Value) {
	movement_dir ??= 0;
	if (this.has_gravity(this)) {
		return 1;
	}
	if (this.pulledby) {
		return 1;
	}
	if (this.throwing) {
		return 1;
	}
	if (rt.locateIn(f, T("/obj/structure/lattice"), range(1, rt.getStep(f, this, 0)))) {
		return 1;
	}
	return 0;
});

// atoms_movable.dm:298
rt.def("/atom/movable/proc/newtonian_move", function* newtonian_move(f: Frame, direction: Value) {
	if (!this.loc || (yield* this.Process_Spacemove(0))) {
		this.inertia_dir = 0;
		return 0;
	}
	this.inertia_dir = direction;
	if (!direction) {
		return 1;
	}
	this.inertia_last_loc = this.loc;
	rt.setAt(GLOB.SSspacedrift.processing, this, this);
	return 1;
}, true);

// atoms_movable.dm:310
rt.def("/atom/movable/proc/checkpass", function checkpass(f: Frame, passflag: Value) {
	return rt.bitAnd(this.pass_flags, passflag);
});

// atoms_movable.dm:314
rt.def("/atom/movable/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value, throwingdatum: Value) {
	return (yield* hit_atom.hitby(this));
}, true, { waitfor: false });

// atoms_movable.dm:317
rt.def("/atom/movable/proc/hitby", function* hitby(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (!this.anchored && f.args[2]) {
		yield* step(this, f.args[0].dir);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// atoms_movable.dm:322
rt.def("/atom/movable/proc/throw_at", function* throw_at(f: Frame, target: Value, range: Value, speed: Value, thrower: Value, spin: Value, diagonals_first: Value, callback: Value) {
	let user_momentum: Value = null, TT: Value = null, olddist_x: Value = null, olddx: Value = null;
	spin ??= 1;
	diagonals_first ??= 0;
	if (!target || rt.bitAnd(this.flags, 2) || speed <= 0) {
		return f.dot;
	}
	if (this.pulledby) {
		yield* this.pulledby.stop_pulling();
	}
	if (thrower && thrower.last_move && thrower.client && thrower.client.move_delay >= rt.worldTime(f) + rt.world().tick_lag * 2) {
		if (!(user_momentum = (yield* thrower.movement_delay()))) {
			user_momentum = rt.world().tick_lag;
		}
		user_momentum = 1 / user_momentum;
		if (rt.bitAnd(rt.getDir(f, thrower, target), this.last_move)) {

		} else if (rt.bitAnd(rt.getDir(f, target, thrower), this.last_move)) {
			user_momentum = -user_momentum;
		} else {
			user_momentum = 0;
		}
		if (user_momentum) {
			range *= user_momentum / speed + 1;
			if ((speed += user_momentum) <= 0) {
				return f.dot;
			}
		}
	}
	(TT = (yield* new_(T("/datum/thrownthing")))).thrownthing = this;
	TT.target = target;
	TT.target_turf = rt.getStep(f, target, 0);
	TT.init_dir = rt.getDir(f, this, target);
	TT.maxrange = range;
	TT.speed = speed;
	TT.thrower = thrower;
	TT.diagonals_first = diagonals_first;
	TT.callback = callback;
	TT.start_loc = this.loc;
	TT.blast_epi = GLOB.blast_throw_epi;
	GLOB.blast_throw_epi = null;
	let dist_x: Value = rt.op(f, "Abs", [], [target.x - this.x]);
	let dist_y: Value = rt.op(f, "Abs", [], [target.y - this.y]);
	let dx: Value = target.x > this.x ? 4 : 8;
	let dy: Value = target.y > this.y ? 1 : 2;
	if (dist_x == dist_y) {
		TT.pure_diagonal = 1;
	} else if (dist_x <= dist_y) {
		olddist_x = dist_x;
		olddx = dx;
		dist_x = dist_y;
		dist_y = olddist_x;
		dx = dy;
		dy = olddx;
	}
	TT.dist_x = dist_x;
	TT.dist_y = dist_y;
	TT.dx = dx;
	TT.dy = dy;
	TT.diagonal_error = dist_x / 2 - dist_y;
	TT.start_time = rt.worldTime(f);
	if (this.pulledby) {
		yield* this.pulledby.stop_pulling();
	}
	this.throwing = TT;
	this.glide_size = max(1, min(32 / max(1 / speed / rt.world().tick_lag, 1), 32));
	if (spin) {
		this.SpinAnimation(5, 1);
	}
	rt.setAt(GLOB.SSthrowing.processing, this, TT);
	if (GLOB.SSthrowing.state == 3 && rt.length(GLOB.SSthrowing.currentrun)) {
		rt.setAt(GLOB.SSthrowing.currentrun, this, TT);
	}
	yield* TT.tick();
	return f.dot;
}, true);

// /atom/movable/proc/blast_fling  (new, stress-throw)  may sleep
// An explosion's throw for an item nobody is near enough to see: the same path throw_at + thrownthing.tick would walk (same stepping,
// same range), but each step only asks whether the next tile lets the item in (CheckExit of the tile it leaves, CanPass of the tile's
// dense or CanPass-defining atoms and of the turf itself, like turf/Enter), and the item is moved once, to where the flight ends.
// No thrownthing, callback, spin, per-step Move/Entered/Crossed, and nothing is hit at the end (no throw_impact on the thing that
// stopped it). Space drift (newtonian_move) still happens at the end like in thrownthing/finalize.
rt.def("/atom/movable/proc/blast_fling", function* blast_fling(f: Frame, target: Value, range: Value, epi: Value) {
	let step: Value = null, L: Value = null, O: Value = null;
	let $e: any;
	let start: Value = this.loc;
	if (!target || !rt.call(f, P("/proc/isturf"), null, [start])) {
		return 0;
	}
	const counting = truthy(rt.call(f, P("/proc/stress_counts_on"), null, []));
	const tx = target.x, ty = target.y, sx = start.x, sy = start.y;
	let dist_x = Math.abs(tx - sx), dist_y = Math.abs(ty - sy), dx = tx > sx ? 4 : 8, dy = ty > sy ? 1 : 2, pure_diagonal = false;
	if (dist_x === dist_y) {
		pure_diagonal = true;
	} else if (dist_x <= dist_y) {
		const od = dist_x, odx = dx;
		dist_x = dist_y; dist_y = od; dx = dy; dy = odx;
	}
	let err = dist_x / 2 - dist_y;
	const init_dir = rt.getDir(f, start, target), maxd = Math.max(dist_x, dist_y);
	let target_turf: Value = rt.getStep(f, target, 0);
	let cur: Value = start;
	let travelled = 0;
	while (travelled < range) {
		if (cur === target_turf && this.has_gravity(cur)) break;
		step = rt.getStep(f, cur, travelled <= maxd ? rt.getDir(f, cur, target_turf) : init_dir);
		if (!pure_diagonal) {
			if (err >= 0 && maxd - travelled !== 1) step = rt.getStep(f, cur, dx);
			err += err < 0 ? dist_x / 2 : -dist_y;
		}
		if (!step) break;
		let blocked = false;
		if ((L = rt.call(f, P("/proc/hook_list"), null, [cur, 4])) !== null) {
			for (O of each(L, T("/obj"))) {
				if (O !== f.src && !O.CheckExit(this, step)) blocked = true;
			}
		}
		if (!blocked && (L = rt.call(f, P("/proc/hook_list"), null, [step, 5])) !== null) {
			for (O of each(L, T("/atom/movable"))) {
				if (!(yield* O.CanPass(this, cur, 1))) blocked = true;
			}
		}
		if (!blocked && !(yield* step.CanPass(this, step))) blocked = true;
		if (blocked) break;
		cur = step;
		travelled++;
	}
	if (cur !== start) yield* this.Move(cur, rt.getDir(f, start, cur));
	if (counting) {
		rt.call(f, P("/proc/stress_count"), null, ["blast_flung", 1]);
		rt.call(f, P("/proc/stress_count"), null, ["blast_flung_range_sum", range]);
		if (this.loc !== start) rt.call(f, P("/proc/stress_count"), null, ["blast_flung_moved", 1]);
		rt.call(f, P("/proc/stress_count"), null, ["blast_flung_dist_sum", travelled]);
		if (rt.call(f, P("/proc/get_dist"), null, [this.loc, epi]) <= 28) rt.call(f, P("/proc/stress_count"), null, ["blast_flung_end_in_area", 1]);
	}
	yield* this.newtonian_move(init_dir);
	return f.dot;
}, true);

// atoms_movable.dm:400
rt.def("/atom/movable/proc/handle_buckled_mob_movement", function* handle_buckled_mob_movement(f: Frame, newloc: Value, direct: Value) {
	let m: Value = null, buckled_mob: Value = null;
	for (m of each(this.buckled_mobs)) {
		if (!(yield* (buckled_mob = m).Move(newloc, direct))) {
			this.loc = buckled_mob.loc;
			this.last_move = buckled_mob.last_move;
			this.inertia_dir = this.last_move;
			buckled_mob.inertia_dir = this.last_move;
			return 0;
		}
		buckled_mob.glide_size = this.glide_size;
	}
	return 1;
}, true);

// atoms_movable.dm:412
rt.def("/atom/movable/proc/CanPass", function CanPass(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1.5;
	}
	if (rt.isIn(f, f.args[0], this.buckled_mobs)) {
		return 1;
	}
	return parent_proc();
}, false, { args: ["mover", "target", "height"] });

// atoms_movable.dm:419
rt.def("/atom/movable/proc/get_spacemove_backup", function* get_spacemove_backup(f: Frame) {
	let dense_object_backup: Value = null, A: Value = null, turf: Value = null, AM: Value = null;
	for (A of each(orange(1, rt.getStep(f, this, 0)))) {
		if (isarea(A)) {
			continue;
		}
		if (isturf(A)) {
			if (!(turf = A).density) {
				continue;
			}
			return turf;
		} else if (!(yield* (AM = A).CanPass(this)) || AM.density) {
			if (AM.anchored) {
				return AM;
			}
			dense_object_backup = AM;
			break;
		}
	}
	f.dot = dense_object_backup;
	return f.dot;
}, true);

// atoms_movable.dm:442
rt.def("/atom/movable/proc/do_attack_animation", function* do_attack_animation(f: Frame, A: Value, visual_effect_icon: Value, used_item: Value, no_effect: Value, end_pixel_y: Value) {
	let direction: Value = null;
	if (!no_effect && (visual_effect_icon || used_item)) {
		yield* this.do_item_attack_animation(A, visual_effect_icon, used_item);
	}
	if (A == this) {
		return f.dot;
	}
	let pixel_x_diff: Value = 0;
	let pixel_y_diff: Value = 0;
	let final_pixel_y: Value = rt.initial(f, this, "pixel_y");
	if (end_pixel_y) {
		final_pixel_y = end_pixel_y;
	}
	if (rt.bitAnd((direction = rt.getDir(f, this, A)), 1)) {
		pixel_y_diff = 8;
	} else if (rt.bitAnd(direction, 2)) {
		pixel_y_diff = -8;
	}
	if (rt.bitAnd(direction, 4)) {
		pixel_x_diff = 8;
	} else if (rt.bitAnd(direction, 8)) {
		pixel_x_diff = -8;
	}
	rt.op(f, "Animate", [2, 8], [null, this, "pixel_x", this.pixel_x + pixel_x_diff, "pixel_y", this.pixel_y + pixel_y_diff, "time", 2]);
	rt.op(f, "Animate", [2, 6], ["pixel_x", rt.initial(f, this, "pixel_x"), "pixel_y", final_pixel_y, "time", 2]);
	return f.dot;
}, true);

// atoms_movable.dm:470
rt.def("/atom/movable/proc/do_item_attack_animation", function* do_item_attack_animation(f: Frame, A: Value, visual_effect_icon: Value, used_item: Value) {
	let I: Value = null, direction: Value = null;
	if (visual_effect_icon) {
		I = image(rt.rsc("icons/effects/effects.dmi"), A, visual_effect_icon, A.layer + 0.1);
	} else if (used_item) {
		(I = image(used_item.icon, A, used_item.icon_state, A.layer + 0.1)).transform *= 0.75;
		I.appearance_flags = 30;
		if (rt.bitAnd((direction = rt.getDir(f, this, A)), 1)) {
			I.pixel_y = -16;
		} else if (rt.bitAnd(direction, 2)) {
			I.pixel_y = 16;
		}
		if (rt.bitAnd(direction, 4)) {
			I.pixel_x = -16;
		} else if (rt.bitAnd(direction, 8)) {
			I.pixel_x = 16;
		}
		if (!direction) {
			I.pixel_z = 16;
		}
	}
	if (!I) {
		return f.dot;
	}
	yield* flick_overlay(I, GLOB.clients, 5);
	rt.op(f, "Animate", [2, 12], [null, I, "alpha", 175, "pixel_x", 0, "pixel_y", 0, "pixel_z", 0, "time", 3]);
	return f.dot;
}, true);

// atoms_movable.dm:503
rt.def("/atom/movable/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = parent_proc();
	f.dot -= "Jump to";
	rt.setAt(f.dot, "Follow", fmt("?_src_=holder;adminplayerobservefollow=＃", [this]));
	return f.dot;
});

// atoms_movable.dm:508
rt.def("/atom/movable/proc/ex_check", function ex_check(f: Frame, ex_id: Value) {
	if (!ex_id) {
		return 1;
	}
	if (!this.acted_explosions) {
		this.acted_explosions = list();
	}
	if (rt.isIn(f, ex_id, this.acted_explosions)) {
		return 0;
	}
	this.acted_explosions += ex_id;
	return 1;
});

// atoms_movable.dm:519
rt.def("/atom/movable/proc/float", function* float(f: Frame, on: Value) {
	if (this.throwing) {
		return f.dot;
	}
	if (on && !this.floating) {
		rt.op(f, "Animate", [2, 8], [null, this, "pixel_y", this.pixel_y + 2, "time", 10, "loop", -1]);
		yield* sleep(10);
		rt.op(f, "Animate", [2, 8], [null, this, "pixel_y", this.pixel_y - 2, "time", 10, "loop", -1]);
		this.floating = 1;
	} else {
		if (!(!on && this.floating)) return f.dot;
		rt.op(f, "Animate", [2, 6], [null, this, "pixel_y", rt.initial(f, this, "pixel_y"), "time", 10]);
		this.floating = 0;
	}
	return f.dot;
}, true);

// atoms_movable.dm:551
rt.def("/atom/movable/proc/set_stationloving", function set_stationloving(f: Frame, state: Value, inform_admins: Value) {
	inform_admins ??= 0;
	let currently: Value = this.secondary_flags ? rt.index(this.secondary_flags, "stationloving") : 0;
	if (inform_admins) {
		if (!this.secondary_flags) {
			this.secondary_flags = list();
		}
		rt.setAt(this.secondary_flags, "inform_admins_on_relocate", 1);
	} else if (this.secondary_flags) {
		rt.setAt(this.secondary_flags, "inform_admins_on_relocate", null);
	}
	if (state == currently) {
		return f.dot;
	} else if (!state) {
		this.isprocessing = 0;
		GLOB.SSinbounds.processing -= this;
		if (this.secondary_flags) {
			rt.setAt(this.secondary_flags, "stationloving", null);
		}
	} else {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSinbounds.processing += this;
		}
		if (!this.secondary_flags) {
			this.secondary_flags = list();
		}
		rt.setAt(this.secondary_flags, "stationloving", 1);
	}
	return f.dot;
});

// atoms_movable.dm:568
rt.def("/atom/movable/proc/relocate", function* relocate(f: Frame) {
	let targetturf: Value = null, M: Value = null, S: Value = null;
	if (!(targetturf = find_safe_turf(ZLEVEL_STATION))) {
		if (rt.len(f, GLOB.blobstart) > 0) {
			targetturf = rt.getStep(f, pick(GLOB.blobstart), 0);
		} else {
			rt.throw_(f, (yield* new_(T("/exception"), "Unable to find a blobstart landmark", "code/game/atoms_movable.dm", 573)));
		}
	}
	if (ismob(this.loc)) {
		yield* (M = this.loc).transferItemToLoc(this, targetturf, 1);
	} else if (rt.istype(this.loc, T("/obj/item/weapon/storage"))) {
		yield* (S = this.loc).remove_from_storage(this, targetturf);
	} else {
		yield* this.forceMove(targetturf);
	}
	return targetturf;
}, true);

// atoms_movable.dm:587
rt.def("/atom/movable/proc/check_in_bounds", function* check_in_bounds(f: Frame) {
	let currentturf: Value = null, targetturf: Value = null;
	let $0: any, $1: any, $2: any;
	if (this.in_bounds()) {
		return f.dot;
	} else {
		currentturf = rt.getStep(f, this, 0);
		to_chat(get(this, T("/mob")), "<span class='danger'>You can't help but feel that you just lost something back there...</span>");
		targetturf = (yield* this.relocate());
		log_game(`${this} has been moved out of bounds in ${`(${currentturf.x},${currentturf.y},${currentturf.z})`}. Moving it to ${`(${targetturf.x},${targetturf.y},${targetturf.z})`}.`);
		if (!(this.secondary_flags ? rt.index(this.secondary_flags, "inform_admins_on_relocate") : 0)) return f.dot;
		$0 = this;
		if (currentturf) {
			$1 = `${`(${currentturf.x},${currentturf.y},${currentturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${currentturf.x};Y=${currentturf.y};Z=${currentturf.z}'>JMP</a>)`}`;
		} else {
			$1 = "nonexistent location";
		}
		$1 = `${$1}`;
		if (targetturf) {
			$2 = `${`(${targetturf.x},${targetturf.y},${targetturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${targetturf.x};Y=${targetturf.y};Z=${targetturf.z}'>JMP</a>)`}`;
		} else {
			$2 = "nonexistent location";
		}
		message_admins(`${$0} has been moved out of bounds in ${$1}. Moving it to ${`${$2}`}.`);
	}
	return f.dot;
}, true);

// atoms_movable.dm:599
rt.def("/atom/movable/proc/in_bounds", function in_bounds(f: Frame) {
	let currentturf: Value = null;
	f.dot = 0;
	if (!((currentturf = rt.getStep(f, this, 0)) && (currentturf.z == ZLEVEL_CENTCOM || currentturf.z == ZLEVEL_STATION || currentturf.z == ZLEVEL_TRANSIT))) return f.dot;
	f.dot = ZLEVEL_CENTCOM;
	return f.dot;
});

// atoms_movable.dm:607
rt.def("/atom/movable/proc/get_language_holder", function* get_language_holder(f: Frame, shadow: Value) {
	shadow ??= 1;
	if (this.language_holder) {
		return this.language_holder;
	} else {
		this.language_holder = (yield* new_(this.initial_language_holder, this));
		return this.language_holder;
	}
}, true);

// atoms_movable.dm:613
rt.def("/atom/movable/proc/grant_language", function* grant_language(f: Frame, dt: Value) {
	let H: Value = null;
	yield* (H = (yield* this.get_language_holder())).grant_language(dt);
	return f.dot;
}, true);

// atoms_movable.dm:617
rt.def("/atom/movable/proc/grant_all_languages", function* grant_all_languages(f: Frame, omnitongue: Value) {
	let H: Value = null;
	omnitongue ??= 0;
	yield* (H = (yield* this.get_language_holder())).grant_all_languages(omnitongue);
	return f.dot;
}, true);

// atoms_movable.dm:621
rt.def("/atom/movable/proc/get_random_understood_language", function* get_random_understood_language(f: Frame) {
	let H: Value = null;
	f.dot = (yield* (H = (yield* this.get_language_holder())).get_random_understood_language());
	return f.dot;
}, true);

// atoms_movable.dm:625
rt.def("/atom/movable/proc/remove_language", function* remove_language(f: Frame, dt: Value) {
	let H: Value = null;
	yield* (H = (yield* this.get_language_holder())).remove_language(dt);
	return f.dot;
}, true);

// atoms_movable.dm:629
rt.def("/atom/movable/proc/remove_all_languages", function* remove_all_languages(f: Frame) {
	let H: Value = null;
	yield* (H = (yield* this.get_language_holder())).remove_all_languages();
	return f.dot;
}, true);

// atoms_movable.dm:633
rt.def("/atom/movable/proc/has_language", function* has_language(f: Frame, dt: Value) {
	let H: Value = null;
	f.dot = (yield* (H = (yield* this.get_language_holder())).has_language(dt));
	return f.dot;
}, true);

// atoms_movable.dm:637
rt.def("/atom/movable/proc/copy_known_languages_from", function* copy_known_languages_from(f: Frame, thing: Value, replace: Value) {
	let H: Value = null;
	replace ??= 0;
	f.dot = (yield* (H = (yield* this.get_language_holder())).copy_known_languages_from(thing, replace));
	return f.dot;
}, true);

// atoms_movable.dm:646
rt.def("/atom/movable/proc/can_speak_in_language", function* can_speak_in_language(f: Frame, dt: Value) {
	let H: Value = null;
	if (!(yield* (H = (yield* this.get_language_holder())).has_language(dt))) {
		return 0;
	} else if (H.omnitongue) {
		return 1;
	} else if (this.could_speak_in_language(dt) && (!H.only_speaks_language || H.only_speaks_language == dt)) {
		return 1;
	} else {
		return 0;
	}
}, true);

// atoms_movable.dm:660
rt.def("/atom/movable/proc/get_default_language", function* get_default_language(f: Frame) {
	let H: Value = null, chosen_langtype: Value = null, highest_priority: Value = null, lt: Value = null, langtype: Value = null, pri: Value = null;
	if ((H = (yield* this.get_language_holder())).selected_default_language) {
		if (yield* this.can_speak_in_language(H.selected_default_language)) {
			return H.selected_default_language;
		}
		H.selected_default_language = null;
	}
	for (lt of each(H.languages)) {
		if (!(yield* this.can_speak_in_language((langtype = lt)))) {
			continue;
		}
		pri = rt.initial(f, langtype, "default_priority");
		if (!highest_priority || pri > highest_priority) {
			chosen_langtype = langtype;
			highest_priority = pri;
		}
	}
	H.selected_default_language = f.dot;
	f.dot = chosen_langtype;
	return f.dot;
}, true);

// atoms_movable.dm:688
rt.def("/atom/movable/proc/ConveyorMove", function* ConveyorMove(f: Frame, movedir: Value) {
	if (!(!this.anchored && this.has_gravity())) return f.dot;
	yield* step(this, movedir);
	return f.dot;
}, true, { waitfor: false });

// atoms_movable.dm:696
rt.def("/atom/movable/proc/can_be_pulled", function can_be_pulled(f: Frame, user: Value) {
	if (this == user || !isturf(this.loc)) {
		return 0;
	}
	if (this.anchored || this.throwing) {
		return 0;
	}
	return 1;
});
