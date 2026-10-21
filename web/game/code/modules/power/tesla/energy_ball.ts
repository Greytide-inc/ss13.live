// From code/modules/power/tesla/energy_ball.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalblacklisted_tesla_types  (code/modules/power/tesla/energy_ball.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalblacklisted_tesla_types", function InitGlobalblacklisted_tesla_types(f: Frame) {
	rt.setGl("blacklisted_tesla_types", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/machinery/atmospherics"), T("/obj/machinery/power/emitter"), T("/obj/machinery/field/generator"), T("/mob/living/simple_animal"), T("/obj/machinery/particle_accelerator/control_box"), T("/obj/structure/particle_accelerator/fuel_chamber"), T("/obj/structure/particle_accelerator/particle_emitter/center"), T("/obj/structure/particle_accelerator/particle_emitter/left"), T("/obj/structure/particle_accelerator/particle_emitter/right"), T("/obj/structure/particle_accelerator/power_box"), T("/obj/structure/particle_accelerator/end_cap"), T("/obj/machinery/field/containment"), T("/obj/structure/disposalpipe"), T("/obj/structure/sign"), T("/obj/machinery/gateway"), T("/obj/structure/lattice"), T("/obj/structure/grille"), T("/obj/machinery/the_singularitygen/tesla"))]));
	rt.modSrcVar(f, "gvars_datum_init_order", "blacklisted_tesla_types", add);
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

// /obj/singularity/energy_ball/proc/<init>  (code/modules/power/tesla/energy_ball.dm:38)
rt.def("/obj/singularity/energy_ball/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "orbiting_balls", rt.list());
	return f.dot;
});

// /obj/singularity/energy_ball/proc/Initialize  (code/modules/power/tesla/energy_ball.dm:44)
rt.def("/obj/singularity/energy_ball/proc/Initialize", function Initialize(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 50;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[2]))) return f.dot;
	rt.callSrc(f, "set_light", [10, 7, "#EEEEFF"]);
	return f.dot;
}, false, { args: ["mapload", "starting_energy", "is_miniball"] });

// /obj/singularity/energy_ball/proc/Destroy  (code/modules/power/tesla/energy_ball.dm:52)  may sleep
rt.def("/obj/singularity/energy_ball/proc/Destroy", function* Destroy(f: Frame) {
	let EB: Value = null, ball: Value = null, EB_1: Value = null;
	let $e: any;
	f.vars = () => [EB, ball, EB_1, $e];
	if ((truthy(rt.sv(f, "orbiting")) && truthy((rt.istype(rt.fv(f, "orbiting", rt.sv(f, "orbiting")), T("/obj/singularity/energy_ball")) ? 1 : 0)))) {
		(rt.modField(f, (EB = rt.fv(f, "orbiting", rt.sv(f, "orbiting"))), "orbiting_balls", live(f.src), subtract));
	}
	ball = null;
	rt.forList(f, 0, rt.sv(f, "orbiting_balls"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ball = $e;
		yield* g.call(f, P("/proc/qdel"), null, [(EB_1 = live(ball))]);
	}
	rt.endFor(f, 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/singularity/energy_ball/proc/admin_investigate_setup  (code/modules/power/tesla/energy_ball.dm:63)
rt.def("/obj/singularity/energy_ball/proc/admin_investigate_setup", function admin_investigate_setup(f: Frame) {
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/singularity/energy_ball")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/singularity/energy_ball/proc/process  (code/modules/power/tesla/energy_ball.dm:68)  may sleep
rt.def("/obj/singularity/energy_ball/proc/process", function* process(f: Frame) {
	let ball: Value = null, range: Value = null;
	let $e: any;
	f.vars = () => [ball, range, $e];
	if (!truthy(rt.sv(f, "orbiting"))) {
		yield* g.srcCall(f, "handle_energy");
		yield* g.srcCall(f, "move_the_basket_ball", add(4, multiply(rt.len(f, rt.sv(f, "orbiting_balls")), 1.5)));
		yield* g.call(f, P("/proc/playsound"), null, [null, rt.fv(f, "loc", live(f.src)), null, rt.rsc("sound/magic/lightningbolt.ogg"), null, 100, null, 1, "extrarange", 30], rt.Args.Named);
		rt.setSv(f, "pixel_x", 0);
		rt.setSv(f, "pixel_y", 0);
		yield* g.srcCall(f, "setDir", (yield* g.call(f, P("/proc/tesla_zap"), null, [live(f.src), 7, 1738260, 1])));
		rt.setSv(f, "pixel_x", -32);
		rt.setSv(f, "pixel_y", -32);
		ball = null;
		rt.forList(f, 0, rt.sv(f, "orbiting_balls"));
		while (($e = rt.next(f, 0)) !== undefined) {
			ball = $e;
			range = (yield* g.call(f, P("/proc/rand"), null, [1, (yield* g.call(f, P("/proc/max"), null, [3, (yield* g.call(f, P("/proc/min"), null, [rt.len(f, rt.sv(f, "orbiting_balls")), 7]))]))]));
			yield* g.call(f, P("/proc/tesla_zap"), null, [live(ball), live(range), multiply(124161.4296875, live(range)), 1]);
		}
		rt.endFor(f, 0);
	} else {
		rt.setSv(f, "energy", 0);
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/singularity/energy_ball/proc/examine  (code/modules/power/tesla/energy_ball.dm:89)
rt.def("/obj/singularity/energy_ball/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.len(f, rt.sv(f, "orbiting_balls")))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("The amount of orbiting mini-balls is ＀.", [rt.len(f, rt.sv(f, "orbiting_balls"))])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/singularity/energy_ball/proc/move_the_basket_ball  (code/modules/power/tesla/energy_ball.dm:96)  may sleep
rt.def("/obj/singularity/energy_ball/proc/move_the_basket_ball", function* move_the_basket_ball(f: Frame, move_amount: Value) {
	let first_move: Value = null, i: Value = null, move_dir: Value = null, _T: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [move_amount, first_move, i, move_dir, _T, C, $e];
	first_move = rt.sv(f, "dir");
	i = null;
	rt.forRange(f, 0, 0, live(move_amount), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		move_dir = rt.op(f, "PickUnweighted", [1], [add(rt.gl("alldirs"), live(first_move))]);
		if ((truthy(rt.sv(f, "target")) && truthy(rt.op(f, "Prob", [], [60])))) {
			move_dir = rt.getDir(f, live(f.src), rt.sv(f, "target"));
		}
		if (truthy((yield* g.srcCall(f, "can_move", (_T = rt.getStep(f, live(f.src), live(move_dir))))))) {
			yield* g.srcCall(f, "forceMove", live(_T));
			yield* g.srcCall(f, "setDir", live(move_dir));
			C = null;
			rt.forList(f, 1, rt.sv(f, "loc"), T("/mob/living/carbon"));
			while (($e = rt.next(f, 1)) !== undefined) {
				C = $e;
				yield* g.srcCall(f, "dust_mobs", live(C));
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/singularity/energy_ball/proc/handle_energy  (code/modules/power/tesla/energy_ball.dm:110)  may sleep
rt.def("/obj/singularity/energy_ball/proc/handle_energy", function* handle_energy(f: Frame) {
	let Orchiectomy_target: Value = null;
	f.vars = () => [Orchiectomy_target];
	if (rt.ge(rt.sv(f, "energy"), rt.sv(f, "energy_to_raise"))) {
		rt.setSv(f, "energy_to_lower", subtract(rt.sv(f, "energy_to_raise"), 20));
		rt.setSv(f, "energy_to_raise", multiply(rt.sv(f, "energy_to_raise"), 1.25));
		yield* g.call(f, P("/proc/playsound"), null, [null, rt.fv(f, "loc", live(f.src)), null, rt.rsc("sound/magic/lightning_chargeup.ogg"), null, 100, null, 1, "extrarange", 30], rt.Args.Named);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/singularity/energy_ball/proc/new_mini_ball")])), 100]);
	} else {
		if ((rt.lt(rt.sv(f, "energy"), rt.sv(f, "energy_to_lower")) && truthy(rt.len(f, rt.sv(f, "orbiting_balls"))))) {
			rt.setSv(f, "energy_to_raise", divide(rt.sv(f, "energy_to_raise"), 1.25));
			rt.setSv(f, "energy_to_lower", subtract(divide(rt.sv(f, "energy_to_raise"), 1.25), 20));
			yield* g.call(f, P("/proc/qdel"), null, [(Orchiectomy_target = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "orbiting_balls")]))]);
		} else {
			if (!truthy(rt.len(f, rt.sv(f, "orbiting_balls")))) return f.dot;
			yield* g.srcCall(f, "dissipate");
		}
	}
	return f.dot;
}, true);

// /obj/singularity/energy_ball/proc/new_mini_ball  (code/modules/power/tesla/energy_ball.dm:128)  may sleep
rt.def("/obj/singularity/energy_ball/proc/new_mini_ball", function* new_mini_ball(f: Frame) {
	let EB: Value = null, I: Value = null, orbitsize: Value = null;
	f.vars = () => [EB, I, orbitsize];
	if (!truthy(rt.sv(f, "loc"))) {
		return live(f.dot);
	}
	(rt.modField(f, (EB = (yield* g.new_(f, T("/obj/singularity/energy_ball"), [rt.sv(f, "loc"), 0, 1]))), "transform", rt.op(f, "PickUnweighted", [5], [0.30000001192092896, 0.4000000059604645, 0.5, 0.6000000238418579, 0.699999988079071]), multiply));
	I = (yield* g.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]));
	(orbitsize = rt.modify(live(orbitsize), multiply(divide((orbitsize = multiply(add((yield* g.callName(f, live(I), "Width", [])), (yield* g.callName(f, live(I), "Height", []))), rt.op(f, "PickUnweighted", [5], [0.4000000059604645, 0.5, 0.6000000238418579, 0.699999988079071, 0.800000011920929]))), rt.fv(f, "icon_size", rt.world())), multiply(rt.fv(f, "icon_size", rt.world()), 0.25)), subtract));
	yield* g.callName(f, live(EB), "orbit", [live(f.src), live(orbitsize), rt.op(f, "PickUnweighted", [2], [0, 1]), (yield* g.call(f, P("/proc/rand"), null, [10, 25])), rt.op(f, "PickUnweighted", [5], [3, 4, 5, 6, 36])]);
	return f.dot;
}, true);

// /obj/singularity/energy_ball/proc/Bump  (code/modules/power/tesla/energy_ball.dm:142)  may sleep
rt.def("/obj/singularity/energy_ball/proc/Bump", function* Bump(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.srcCall(f, "dust_mobs", live(A));
	return f.dot;
}, true);

// /obj/singularity/energy_ball/proc/Bumped  (code/modules/power/tesla/energy_ball.dm:145)  may sleep
rt.def("/obj/singularity/energy_ball/proc/Bumped", function* Bumped(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.srcCall(f, "dust_mobs", live(A));
	return f.dot;
}, true);

// /obj/singularity/energy_ball/proc/orbit  (code/modules/power/tesla/energy_ball.dm:148)  may sleep
rt.def("/obj/singularity/energy_ball/proc/orbit", function* orbit(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/singularity/energy_ball")) ? 1 : 0))) {
		rt.modField(f, live(f.args[0]), "orbiting_balls", live(f.src), add);
		(rt.modGl("poi_list", live(f.src), subtract));
		rt.setFv(f, "dissipate_strength", live(f.args[0]), rt.getLen(f, rt.fv(f, "orbiting_balls", live(f.args[0]))));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["target"] });

// /obj/singularity/energy_ball/proc/stop_orbit  (code/modules/power/tesla/energy_ball.dm:155)  may sleep
rt.def("/obj/singularity/energy_ball/proc/stop_orbit", function* stop_orbit(f: Frame) {
	let orbitingball: Value = null;
	f.vars = () => [orbitingball];
	if ((truthy(rt.sv(f, "orbiting")) && truthy((rt.istype(rt.fv(f, "orbiting", rt.sv(f, "orbiting")), T("/obj/singularity/energy_ball")) ? 1 : 0)))) {
		(rt.modField(f, (orbitingball = rt.fv(f, "orbiting", rt.sv(f, "orbiting"))), "orbiting_balls", live(f.src), subtract));
		rt.setFv(f, "dissipate_strength", live(orbitingball), rt.getLen(f, rt.fv(f, "orbiting_balls", live(orbitingball))));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(!truthy(rt.sv(f, "loc")) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/singularity/energy_ball/proc/dust_mobs  (code/modules/power/tesla/energy_ball.dm:165)  may sleep
rt.def("/obj/singularity/energy_ball/proc/dust_mobs", function* dust_mobs(f: Frame, A: Value) {
	let GR: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [A, GR, C, $e];
	if (!truthy((rt.istype(live(A), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	GR = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [live(f.src), 2])), T("/obj/machinery/power/grounding_rod"));
	while (($e = rt.next(f, 0)) !== undefined) {
		GR = $e;
		if (truthy(rt.fv(f, "anchored", live(GR)))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (C = live(A)), "dust", []);
	return f.dot;
}, true);

// /proc/tesla_zap  (code/modules/power/tesla/energy_ball.dm:175)  may sleep
rt.def("/proc/tesla_zap", function* tesla_zap(f: Frame, source: Value, zap_range: Value, power: Value, explosive: Value, stun_mobs: Value) {
	let closest_dist: Value = null, closest_atom: Value = null, closest_tesla_coil: Value = null, closest_grounding_rod: Value = null, closest_mob: Value = null, closest_machine: Value = null, closest_structure: Value = null, closest_blob: Value = null, A: Value = null, dist: Value = null, C: Value = null, L: Value = null, M: Value = null, dist_10: Value = null, B: Value = null, S: Value = null, zapdir: Value = null, shock_damage: Value = null;
	let $0: any, $e: any;
	f.vars = () => [source, zap_range, power, explosive, stun_mobs, closest_dist, closest_atom, closest_tesla_coil, closest_grounding_rod, closest_mob, closest_machine, closest_structure, closest_blob, A, dist, C, L, M, dist_10, B, S, zapdir, shock_damage, $0, $e];
	if (live(zap_range) === null) {
		zap_range = 3;
	}
	if (live(explosive) === null) {
		explosive = 0;
	}
	if (live(stun_mobs) === null) {
		stun_mobs = 1;
	}
	f.dot = rt.fv(f, "dir", live(source));
	if (rt.lt(live(power), 1000)) {
		return live(f.dot);
	}
	closest_dist = 0;
	closest_atom = null;
	closest_tesla_coil = null;
	closest_grounding_rod = null;
	closest_mob = null;
	closest_machine = null;
	closest_structure = null;
	closest_blob = null;
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [live(source), add(live(zap_range), 2)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.istype(live(A), T("/obj/machinery/power/tesla_coil")) ? 1 : 0))) {
			dist = (yield* g.call(f, P("/proc/get_dist"), null, [live(source), live(A)]));
			C = live(A);
			if (((rt.le(live(dist), live(zap_range)) && (rt.lt(live(dist), live(closest_dist)) || !truthy(live(closest_tesla_coil)))) && !truthy(rt.fv(f, "being_shocked", live(C))))) {
				closest_dist = live(dist);
				closest_tesla_coil = live(C);
				closest_atom = live(C);
			}
		} else {
			if (truthy(live(closest_tesla_coil))) {
				continue;
			}
			if (truthy((rt.istype(live(A), T("/obj/machinery/power/grounding_rod")) ? 1 : 0))) {
				if ((rt.le((dist = subtract((yield* g.call(f, P("/proc/get_dist"), null, [live(source), live(A)])), 2)), live(zap_range)) && (rt.lt(live(dist), live(closest_dist)) || !truthy(live(closest_grounding_rod))))) {
					closest_grounding_rod = live(A);
					closest_atom = live(A);
					closest_dist = live(dist);
				}
			} else {
				if ((truthy(live(closest_grounding_rod)) || truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(A), rt.gl("blacklisted_tesla_types")]))))) {
					continue;
				}
				if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
					dist = (yield* g.call(f, P("/proc/get_dist"), null, [live(source), live(A)]));
					L = live(A);
					$0 = (((rt.le(live(dist), live(zap_range)) ? 1 : 0) && ((rt.lt(live(dist), live(closest_dist)) ? 1 : 0) || (!truthy(live(closest_mob)) ? 1 : 0))) && (!isEqual(rt.fv(f, "stat", live(L)), 2) ? 1 : 0));
					if (truthy($0)) {
						if (truthy(rt.fv(f, "secondary_flags", live(L)))) {
							$0 = rt.index(rt.fv(f, "secondary_flags", live(L)), "tesla_ignore");
						} else {
							$0 = 0;
						}
						$0 = (!truthy($0) ? 1 : 0);
					}
					if (truthy($0)) {
						closest_mob = live(L);
						closest_atom = live(A);
						closest_dist = live(dist);
					}
				} else {
					if (truthy(live(closest_mob))) {
						continue;
					}
					if (truthy((rt.istype(live(A), T("/obj/machinery")) ? 1 : 0))) {
						M = live(A);
						if (((rt.le((dist_10 = (yield* g.call(f, P("/proc/get_dist"), null, [live(source), live(A)]))), live(zap_range)) && (rt.lt(live(dist_10), live(closest_dist)) || !truthy(live(closest_machine)))) && !truthy(rt.fv(f, "being_shocked", live(M))))) {
							closest_machine = live(M);
							closest_atom = live(A);
							closest_dist = live(dist_10);
						}
					} else {
						if (truthy(live(closest_mob))) {
							continue;
						}
						if (truthy((rt.istype(live(A), T("/obj/structure/blob")) ? 1 : 0))) {
							B = live(A);
							if (((rt.le((dist_10 = (yield* g.call(f, P("/proc/get_dist"), null, [live(source), live(A)]))), live(zap_range)) && (rt.lt(live(dist_10), live(closest_dist)) || !truthy(live(closest_tesla_coil)))) && !truthy(rt.fv(f, "being_shocked", live(B))))) {
								closest_blob = live(B);
								closest_atom = live(A);
								closest_dist = live(dist_10);
							}
						} else {
							if (truthy(live(closest_blob))) {
								continue;
							}
							if (truthy((rt.istype(live(A), T("/obj/structure")) ? 1 : 0))) {
								S = live(A);
								if (((rt.le((dist_10 = (yield* g.call(f, P("/proc/get_dist"), null, [live(source), live(A)]))), live(zap_range)) && (rt.lt(live(dist_10), live(closest_dist)) || !truthy(live(closest_tesla_coil)))) && !truthy(rt.fv(f, "being_shocked", live(S))))) {
									closest_structure = live(S);
									closest_atom = live(A);
									closest_dist = live(dist_10);
								}
							}
						}
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(closest_atom))) {
		yield* g.callName(f, live(source), "Beam", [null, live(closest_atom), "icon_state", fmt("lightning＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 12]))]), "time", 5, "maxdistance", 9.999999848243207e+30], rt.Args.Named);
		if (truthy((zapdir = rt.getDir(f, live(source), live(closest_atom))))) {
			f.dot = live(zapdir);
		}
	}
	if (truthy(live(closest_tesla_coil))) {
		yield* g.callName(f, live(closest_tesla_coil), "tesla_act", [live(power), live(explosive), live(stun_mobs)]);
	} else {
		if (truthy(live(closest_grounding_rod))) {
			yield* g.callName(f, live(closest_grounding_rod), "tesla_act", [live(power), live(explosive), live(stun_mobs)]);
		} else {
			if (truthy(live(closest_mob))) {
				shock_damage = add((yield* g.call(f, P("/proc/max"), null, [10, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [divide(live(power), 400)])), 90]))])), (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
				yield* g.callName(f, live(closest_mob), "electrocute_act", [null, live(shock_damage), null, live(source), null, 1, "tesla_shock", 1, "stun", live(stun_mobs)], rt.Args.Named);
				if (truthy((rt.istype(live(closest_mob), T("/mob/living/silicon")) ? 1 : 0))) {
					S = live(closest_mob);
					if (truthy(live(stun_mobs))) {
						yield* g.callName(f, live(S), "emp_act", [2]);
					}
					yield* g.call(f, P("/proc/tesla_zap"), null, [live(S), 7, divide(live(power), 1.5), live(explosive), live(stun_mobs)]);
				} else {
					yield* g.call(f, P("/proc/tesla_zap"), null, [live(closest_mob), 5, divide(live(power), 1.5), live(explosive), live(stun_mobs)]);
				}
			} else {
				if (truthy(live(closest_machine))) {
					yield* g.callName(f, live(closest_machine), "tesla_act", [live(power), live(explosive), live(stun_mobs)]);
				} else {
					if (truthy(live(closest_blob))) {
						yield* g.callName(f, live(closest_blob), "tesla_act", [live(power), live(explosive), live(stun_mobs)]);
					} else {
						if (!truthy(live(closest_structure))) return f.dot;
						yield* g.callName(f, live(closest_structure), "tesla_act", [live(power), live(explosive), live(stun_mobs)]);
					}
				}
			}
		}
	}
	return f.dot;
}, true);
