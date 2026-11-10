// Based on /tg/station's code/modules/power/tesla/energy_ball.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// energy_ball.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalblacklisted_tesla_types", function InitGlobalblacklisted_tesla_types(f: Frame) {
	GLOB.blacklisted_tesla_types = typecacheof(list(T("/obj/machinery/atmospherics"), T("/obj/machinery/power/emitter"), T("/obj/machinery/field/generator"), T("/mob/living/simple_animal"), T("/obj/machinery/particle_accelerator/control_box"), T("/obj/structure/particle_accelerator/fuel_chamber"), T("/obj/structure/particle_accelerator/particle_emitter/center"), T("/obj/structure/particle_accelerator/particle_emitter/left"), T("/obj/structure/particle_accelerator/particle_emitter/right"), T("/obj/structure/particle_accelerator/power_box"), T("/obj/structure/particle_accelerator/end_cap"), T("/obj/machinery/field/containment"), T("/obj/structure/disposalpipe"), T("/obj/structure/sign"), T("/obj/machinery/gateway"), T("/obj/structure/lattice"), T("/obj/structure/grille"), T("/obj/machinery/the_singularitygen/tesla")));
	this.gvars_datum_init_order += "blacklisted_tesla_types";
	return f.dot;
});

rt.type(13042, "/obj/singularity/energy_ball", "/obj/singularity", {
	orbiting_balls: null,
	produced_power: null,
	energy_to_raise: 32,
	energy_to_lower: -20,
	current_size: 3,
	move_self: 1,
	grav_pull: 0,
	contained: 0,
	energy: 0,
	dissipate: 1,
	dissipate_delay: 5,
	dissipate_strength: 1,
	name: "energy ball",
	desc: "An energy ball.",
	icon: rt.rsc("icons/obj/tesla_engine/energy_ball.dmi"),
	icon_state: "energy_ball",
	pixel_x: -32,
	pixel_y: -32,
	density: 1,
});

// energy_ball.dm:38
rt.def("/obj/singularity/energy_ball/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.orbiting_balls = list();
	return f.dot;
});

// energy_ball.dm:44
rt.def("/obj/singularity/energy_ball/proc/Initialize", function Initialize(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 50;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = parent_proc();
	if (f.args[2]) return f.dot;
	this.set_light(10, 7, "#EEEEFF");
	return f.dot;
}, false, { args: ["mapload", "starting_energy", "is_miniball"] });

// energy_ball.dm:52
rt.def("/obj/singularity/energy_ball/proc/Destroy", function* Destroy(f: Frame) {
	let EB: Value = null, ball: Value = null, EB_1: Value = null;
	if (this.orbiting && rt.istype(this.orbiting.orbiting, T("/obj/singularity/energy_ball"))) {
		(EB = this.orbiting.orbiting).orbiting_balls -= this;
	}
	for (ball of each(this.orbiting_balls)) {
		yield* qdel((EB_1 = ball));
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// energy_ball.dm:63
rt.def("/obj/singularity/energy_ball/proc/admin_investigate_setup", function admin_investigate_setup(f: Frame) {
	if (rt.istype(this.loc, T("/obj/singularity/energy_ball"))) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
});

// energy_ball.dm:68
rt.def("/obj/singularity/energy_ball/proc/process", function* process(f: Frame) {
	let ball: Value = null, range: Value = null;
	if (!this.orbiting) {
		yield* this.handle_energy();
		yield* this.move_the_basket_ball(4 + rt.len(f, this.orbiting_balls) * 1.5);
		yield* playsound(this.loc, rt.rsc("sound/magic/lightningbolt.ogg"), 100, 1, { extrarange: 30 });
		this.pixel_x = 0;
		this.pixel_y = 0;
		yield* this.setDir((yield* tesla_zap(this, 7, TESLA_DEFAULT_POWER, 1)));
		this.pixel_x = -32;
		this.pixel_y = -32;
		for (ball of each(this.orbiting_balls)) {
			range = rand(1, max(3, min(rt.len(f, this.orbiting_balls), 7)));
			yield* tesla_zap(ball, range, 124161.43 * range, 1);
		}
	} else {
		this.energy = 0;
	}
	return f.dot;
}, true, { waitfor: false });

// energy_ball.dm:89
rt.def("/obj/singularity/energy_ball/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!rt.len(f, this.orbiting_balls)) return f.dot;
	to_chat(user, `The amount of orbiting mini-balls is ${rt.len(f, this.orbiting_balls)}.`);
	return f.dot;
}, false);

// energy_ball.dm:96
rt.def("/obj/singularity/energy_ball/proc/move_the_basket_ball", function* move_the_basket_ball(f: Frame, move_amount: Value) {
	let i: Value = null, move_dir: Value = null, _T: Value = null, C: Value = null;
	let $e: any;
	let first_move: Value = this.dir;
	rt.forRange(f, 0, 0, move_amount, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		move_dir = pick(GLOB.alldirs + first_move);
		if (this.target && prob(60)) {
			move_dir = rt.getDir(f, this, this.target);
		}
		if (this.can_move((_T = rt.getStep(f, this, move_dir)))) {
			yield* this.forceMove(_T);
			yield* this.setDir(move_dir);
			C = null;
			for (C of each(this.loc, T("/mob/living/carbon"))) {
				yield* this.dust_mobs(C);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// energy_ball.dm:110
rt.def("/obj/singularity/energy_ball/proc/handle_energy", function* handle_energy(f: Frame) {
	let Orchiectomy_target: Value = null;
	if (this.energy >= this.energy_to_raise) {
		this.energy_to_lower = this.energy_to_raise - 20;
		this.energy_to_raise = this.energy_to_raise * 1.25;
		yield* playsound(this.loc, rt.rsc("sound/magic/lightning_chargeup.ogg"), 100, 1, { extrarange: 30 });
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/singularity/energy_ball/proc/new_mini_ball"))), 100);
	} else if (this.energy < this.energy_to_lower && rt.len(f, this.orbiting_balls)) {
		this.energy_to_raise = this.energy_to_raise / 1.25;
		this.energy_to_lower = this.energy_to_raise / 1.25 - 20;
		yield* qdel((Orchiectomy_target = pick(this.orbiting_balls)));
	} else {
		if (!rt.len(f, this.orbiting_balls)) return f.dot;
		yield* this.dissipate();
	}
	return f.dot;
}, true);

// energy_ball.dm:128
rt.def("/obj/singularity/energy_ball/proc/new_mini_ball", function* new_mini_ball(f: Frame) {
	let EB: Value = null, orbitsize: Value = null;
	if (!this.loc) {
		return f.dot;
	}
	(EB = (yield* new_(T("/obj/singularity/energy_ball"), this.loc, 0, 1))).transform *= pick(0.3, 0.4, 0.5, 0.6, 0.7);
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	orbitsize -= (orbitsize = (I.Width() + I.Height()) * pick(0.4, 0.5, 0.6, 0.7, 0.8)) / rt.world().icon_size * (rt.world().icon_size * 0.25);
	yield* EB.orbit(this, orbitsize, pick(0, 1), rand(10, 25), pick(3, 4, 5, 6, 36));
	return f.dot;
}, true);

// energy_ball.dm:142
rt.def("/obj/singularity/energy_ball/proc/Bump", function* Bump(f: Frame, A: Value) {
	yield* this.dust_mobs(A);
	return f.dot;
}, true);

// energy_ball.dm:145
rt.def("/obj/singularity/energy_ball/proc/Bumped", function* Bumped(f: Frame, A: Value) {
	yield* this.dust_mobs(A);
	return f.dot;
}, true);

// energy_ball.dm:148
rt.def("/obj/singularity/energy_ball/proc/orbit", function* orbit(f: Frame, target: Value) {
	if (rt.istype(target, T("/obj/singularity/energy_ball"))) {
		target.orbiting_balls += this;
		GLOB.poi_list -= this;
		target.dissipate_strength = rt.len(f, target.orbiting_balls);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// energy_ball.dm:155
rt.def("/obj/singularity/energy_ball/proc/stop_orbit", function* stop_orbit(f: Frame) {
	let orbitingball: Value = null;
	if (this.orbiting && rt.istype(this.orbiting.orbiting, T("/obj/singularity/energy_ball"))) {
		(orbitingball = this.orbiting.orbiting).orbiting_balls -= this;
		orbitingball.dissipate_strength = rt.len(f, orbitingball.orbiting_balls);
	}
	yield* parent_proc();
	if (!(!this.loc && !(!this || this.gc_destroyed))) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// energy_ball.dm:165
rt.def("/obj/singularity/energy_ball/proc/dust_mobs", function* dust_mobs(f: Frame, A: Value) {
	let GR: Value = null, C: Value = null;
	if (!rt.istype(A, T("/mob/living/carbon"))) {
		return f.dot;
	}
	for (GR of each(orange(this, 2), T("/obj/machinery/power/grounding_rod"))) {
		if (GR.anchored) {
			return f.dot;
		}
	}
	yield* (C = A).dust();
	return f.dot;
}, true);

// energy_ball.dm:175
rt.def("/proc/tesla_zap", function* tesla_zap(f: Frame, source: Value, zap_range: Value, power: Value, explosive: Value, stun_mobs: Value) {
	let closest_atom: Value = null, closest_tesla_coil: Value = null, closest_grounding_rod: Value = null, closest_mob: Value = null, closest_machine: Value = null, closest_structure: Value = null, closest_blob: Value = null, A: Value = null, dist: Value = null, C: Value = null, L: Value = null, M: Value = null, dist_10: Value = null, B: Value = null, S: Value = null, zapdir: Value = null, shock_damage: Value = null;
	let $0: any, $e: any;
	zap_range ??= 3;
	explosive ??= 0;
	stun_mobs ??= 1;
	f.dot = source.dir;
	if (power < 1000) {
		return f.dot;
	}
	let closest_dist: Value = 0;
	for (A of each(oview(source, zap_range + 2))) {
		if (rt.istype(A, T("/obj/machinery/power/tesla_coil"))) {
			dist = get_dist(source, A);
			C = A;
			if (dist <= zap_range && (dist < closest_dist || !closest_tesla_coil) && !C.being_shocked) {
				closest_dist = dist;
				closest_tesla_coil = C;
				closest_atom = C;
			}
		} else {
			if (closest_tesla_coil) {
				continue;
			}
			if (rt.istype(A, T("/obj/machinery/power/grounding_rod"))) {
				if ((dist = get_dist(source, A) - 2) <= zap_range && (dist < closest_dist || !closest_grounding_rod)) {
					closest_grounding_rod = A;
					closest_atom = A;
					closest_dist = dist;
				}
			} else {
				if (closest_grounding_rod || is_type_in_typecache(A, GLOB.blacklisted_tesla_types)) {
					continue;
				}
				if (rt.istype(A, T("/mob/living"))) {
					dist = get_dist(source, A);
					L = A;
					$0 = (((dist <= zap_range ? 1 : 0) && ((dist < closest_dist ? 1 : 0) || (!closest_mob ? 1 : 0))) && (L.stat != 2 ? 1 : 0));
					if ($0) {
						if (L.secondary_flags) {
							$0 = rt.index(L.secondary_flags, "tesla_ignore");
						} else {
							$0 = 0;
						}
						$0 = (!$0 ? 1 : 0);
					}
					if ($0) {
						closest_mob = L;
						closest_atom = A;
						closest_dist = dist;
					}
				} else {
					if (closest_mob) {
						continue;
					}
					if (rt.istype(A, T("/obj/machinery"))) {
						M = A;
						if ((dist_10 = get_dist(source, A)) <= zap_range && (dist_10 < closest_dist || !closest_machine) && !M.being_shocked) {
							closest_machine = M;
							closest_atom = A;
							closest_dist = dist_10;
						}
					} else {
						if (closest_mob) {
							continue;
						}
						if (rt.istype(A, T("/obj/structure/blob"))) {
							B = A;
							if ((dist_10 = get_dist(source, A)) <= zap_range && (dist_10 < closest_dist || !closest_tesla_coil) && !B.being_shocked) {
								closest_blob = B;
								closest_atom = A;
								closest_dist = dist_10;
							}
						} else {
							if (closest_blob) {
								continue;
							}
							if (rt.istype(A, T("/obj/structure"))) {
								S = A;
								if ((dist_10 = get_dist(source, A)) <= zap_range && (dist_10 < closest_dist || !closest_tesla_coil) && !S.being_shocked) {
									closest_structure = S;
									closest_atom = A;
									closest_dist = dist_10;
								}
							}
						}
					}
				}
			}
		}
	}
	if (closest_atom) {
		yield* source.Beam(closest_atom, { icon_state: `lightning${rand(1, 12)}`, time: 5, maxdistance: 1e+31 });
		if (zapdir = rt.getDir(f, source, closest_atom)) {
			f.dot = zapdir;
		}
	}
	if (closest_tesla_coil) {
		yield* closest_tesla_coil.tesla_act(power, explosive, stun_mobs);
	} else if (closest_grounding_rod) {
		yield* closest_grounding_rod.tesla_act(power, explosive, stun_mobs);
	} else if (closest_mob) {
		shock_damage = max(10, min(round(power / 400), 90)) + rand(-5, 5);
		yield* closest_mob.electrocute_act(shock_damage, source, 1, { tesla_shock: 1, stun: stun_mobs });
		if (rt.istype(closest_mob, T("/mob/living/silicon"))) {
			S = closest_mob;
			if (stun_mobs) {
				yield* S.emp_act(2);
			}
			yield* g.call(f, P("/proc/tesla_zap"), null, [S, 7, power / 1.5, explosive, stun_mobs]);
		} else {
			yield* g.call(f, P("/proc/tesla_zap"), null, [closest_mob, 5, power / 1.5, explosive, stun_mobs]);
		}
	} else if (closest_machine) {
		yield* closest_machine.tesla_act(power, explosive, stun_mobs);
	} else if (closest_blob) {
		yield* closest_blob.tesla_act(power, explosive, stun_mobs);
	} else {
		if (!closest_structure) return f.dot;
		yield* closest_structure.tesla_act(power, explosive, stun_mobs);
	}
	return f.dot;
}, true);
