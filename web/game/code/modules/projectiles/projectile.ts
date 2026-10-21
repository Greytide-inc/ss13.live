// From code/modules/projectiles/projectile.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8788, "/obj/item/projectile", "/obj/item", {
	hitsound_wall: "",
	def_zone: "",
	firer: null,
	suppressed: 0,
	yo: null,
	xo: null,
	current: null,
	original: null,
	starting: null,
	permutated: null,
	paused: 0,
	p_x: 16,
	p_y: 16,
	speed: 0.8,
	Angle: 0,
	spread: 0,
	legacy: 0,
	ricochets: 0,
	ricochets_max: 2,
	ricochet_chance: 30,
	ignore_source_check: 0,
	damage: 10,
	damage_type: "brute",
	nodamage: 0,
	flag: "bullet",
	projectile_type: rt.typePath("/obj/item/projectile"),
	range: 50,
	stun: 0,
	knockdown: 0,
	unconscious: 0,
	irradiate: 0,
	stutter: 0,
	slur: 0,
	eyeblur: 0,
	drowsy: 0,
	stamina: 0,
	jitter: 0,
	forcedodge: 0,
	dismemberment: 0,
	impact_effect_type: null,
	log_override: 0,
	anchored: 1,
	flags: 128,
	pass_flags: 1,
	name: "projectile",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	icon_state: "bullet",
	density: 0,
	mouse_opacity: 0,
	hitsound: rt.rsc("sound/weapons/pierce.ogg"),
	resistance_flags: 51,
	animate_movement: 0,
});

// /obj/item/projectile/proc/<init>  (code/modules/projectiles/projectile.dm:22)
rt.def("/obj/item/projectile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "permutated", rt.list());
	return f.dot;
});

// /obj/item/projectile/proc/New  (code/modules/projectiles/projectile.dm:59)  may sleep
rt.def("/obj/item/projectile/proc/New", function* New(f: Frame) {
	rt.setSv(f, "permutated", rt.list());
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/projectile/proc/Range  (code/modules/projectiles/projectile.dm:63)  may sleep
rt.def("/obj/item/projectile/proc/Range", function* Range(f: Frame) {
	rt.incSrcVar(f, "range", -1, true);
	if (!(rt.le(rt.sv(f, "range"), 0) && truthy(rt.sv(f, "loc")))) return f.dot;
	yield* g.srcCall(f, "on_range");
	return f.dot;
}, true);

// /obj/item/projectile/proc/on_range  (code/modules/projectiles/projectile.dm:68)  may sleep
rt.def("/obj/item/projectile/proc/on_range", function* on_range(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/check_limb_hit  (code/modules/projectiles/projectile.dm:76)
rt.def("/mob/living/carbon/proc/check_limb_hit", function check_limb_hit(f: Frame, hit_zone: Value) {
	if (truthy(rt.callSrc(f, "get_bodypart", [live(hit_zone)]))) {
		return live(hit_zone);
	} else {
		return "chest";
	}
	return f.dot;
});

// /obj/item/projectile/proc/on_hit  (code/modules/projectiles/projectile.dm:85)  may sleep
rt.def("/obj/item/projectile/proc/on_hit", function* on_hit(f: Frame, target: Value, blocked: Value) {
	let target_loca: Value = null, L: Value = null, splatter_dir: Value = null, organ_hit_text: Value = null, limb_hit: Value = null, volume: Value = null, reagent_note: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [target, blocked, target_loca, L, splatter_dir, organ_hit_text, limb_hit, volume, reagent_note, R, $e];
	if (live(blocked) === null) {
		blocked = 0;
	}
	target_loca = rt.getStep(f, live(target), 0);
	if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "impact_effect_type"))) {
			yield* g.new_(f, rt.sv(f, "impact_effect_type"), [live(target_loca), live(target), live(f.src)]);
		}
		return 0;
	}
	if ((truthy(rt.gv(f, "buckled", (L = live(target)))) && truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "buckled", live(L))]))))) {
		L = rt.fv(f, "buckled", live(L));
	}
	if (!isEqual(live(blocked), 100)) {
		if (((truthy(rt.sv(f, "damage")) && truthy(rt.fv(f, "blood_volume", live(L)))) && isEqual(rt.sv(f, "damage_type"), "brute"))) {
			splatter_dir = rt.sv(f, "dir");
			if (truthy(rt.sv(f, "starting"))) {
				splatter_dir = rt.getDir(f, rt.sv(f, "starting"), live(target_loca));
			}
			if (truthy((rt.istype(live(L), T("/mob/living/carbon/alien")) ? 1 : 0))) {
				yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/bloodsplatter/xenosplatter"), [live(target_loca), live(splatter_dir)]);
			} else {
				yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/bloodsplatter"), [live(target_loca), live(splatter_dir)]);
			}
			if (truthy(rt.op(f, "Prob", [], [33]))) {
				yield* g.callName(f, live(L), "add_splatter_floor", [live(target_loca)]);
			}
		} else {
			if (truthy(rt.sv(f, "impact_effect_type"))) {
				yield* g.new_(f, rt.sv(f, "impact_effect_type"), [live(target_loca), live(target), live(f.src)]);
			}
		}
		organ_hit_text = "";
		if (truthy((limb_hit = (yield* g.callName(f, live(L), "check_limb_hit", [rt.sv(f, "def_zone")]))))) {
			organ_hit_text = fmt(" in ％！", [(yield* g.call(f, P("/proc/parse_zone"), null, [live(limb_hit)]))]);
		}
		if (truthy(rt.sv(f, "suppressed"))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "hitsound"), 5, 1, -1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='userdanger'>You're shot by ＇！＀!</span>", [live(f.src), live(organ_hit_text)])]);
		} else {
			if (truthy(rt.sv(f, "hitsound"))) {
				volume = (yield* g.srcCall(f, "vol_by_damage"));
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "hitsound"), live(volume), 1, -1]);
			}
			yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ is hit by ＇！＀!</span>", [live(L), live(f.src), live(organ_hit_text)]), fmt("<span class='userdanger'>＀ is hit by ＇！＀!</span>", [live(L), live(f.src), live(organ_hit_text)]), null, 3]);
		}
		yield* g.callName(f, live(L), "on_hit", [live(f.src)]);
	}
	reagent_note = null;
	if ((truthy(rt.sv(f, "reagents")) && truthy(rt.fv(f, "reagent_list", rt.sv(f, "reagents"))))) {
		reagent_note = " REAGENTS:";
		R = null;
		rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			reagent_note = rt.modify(live(reagent_note), add(rt.fv(f, "id", live(R)), " ("), add);
			reagent_note = rt.modify(live(reagent_note), add((yield* g.call(f, P("/proc/num2text"), null, [rt.fv(f, "volume", live(R))])), ") "), add);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "firer"), live(L), "shot", live(f.src), live(reagent_note)]);
	return (yield* g.callName(f, live(L), "apply_effects", [rt.sv(f, "stun"), rt.sv(f, "knockdown"), rt.sv(f, "unconscious"), rt.sv(f, "irradiate"), rt.sv(f, "slur"), rt.sv(f, "stutter"), rt.sv(f, "eyeblur"), rt.sv(f, "drowsy"), live(blocked), rt.sv(f, "stamina"), rt.sv(f, "jitter")]));
}, true);

// /obj/item/projectile/proc/vol_by_damage  (code/modules/projectiles/projectile.dm:133)
rt.def("/obj/item/projectile/proc/vol_by_damage", function vol_by_damage(f: Frame) {
	if (truthy(rt.fv(f, "damage", live(f.src)))) {
		return rt.call(f, P("/proc/max"), null, [30, rt.call(f, P("/proc/min"), null, [multiply(rt.fv(f, "damage", live(f.src)), 0.6700000166893005), 100])]);
	}
	return 50;
});

// /obj/item/projectile/proc/Bump  (code/modules/projectiles/projectile.dm:139)  may sleep
rt.def("/obj/item/projectile/proc/Bump", function* Bump(f: Frame, A: Value, yes: Value) {
	let distance: Value = null, volume: Value = null, target_turf: Value = null, permutation: Value = null, mobs_list: Value = null, L: Value = null, picked_mob: Value = null;
	let $e: any;
	f.vars = () => [A, yes, distance, volume, target_turf, permutation, mobs_list, L, picked_mob, $e];
	if (!truthy(live(yes))) {
		return live(f.dot);
	}
	if (((truthy((yield* g.srcCall(f, "check_ricochet"))) && truthy((yield* g.srcCall(f, "check_ricochet_flag", live(A))))) && rt.lt(rt.sv(f, "ricochets"), rt.sv(f, "ricochets_max")))) {
		rt.incSrcVar(f, "ricochets", 1, true);
		if (truthy((yield* g.callName(f, live(A), "handle_ricochet", [live(f.src)])))) {
			rt.setSv(f, "ignore_source_check", 1);
			return 0;
		}
	}
	if ((truthy(rt.sv(f, "firer")) && !truthy(rt.sv(f, "ignore_source_check")))) {
		if ((isEqual(live(A), rt.sv(f, "firer")) || (isEqual(live(A), rt.fv(f, "loc", rt.sv(f, "firer"))) && truthy((rt.istype(live(A), T("/obj/mecha")) ? 1 : 0))))) {
			rt.setSv(f, "loc", rt.fv(f, "loc", live(A)));
			return 0;
		}
	}
	distance = (yield* g.call(f, P("/proc/get_dist"), null, [rt.getStep(f, live(A), 0), rt.sv(f, "starting")]));
	rt.setSv(f, "def_zone", (yield* g.call(f, P("/proc/ran_zone"), null, [rt.sv(f, "def_zone"), (yield* g.call(f, P("/proc/max"), null, [subtract(100, multiply(7, live(distance))), 5]))])));
	if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)]))) && truthy(rt.sv(f, "hitsound_wall")))) {
		volume = (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add((yield* g.srcCall(f, "vol_by_damage")), 20), 100]))]));
		if (truthy(rt.sv(f, "suppressed"))) {
			volume = 5;
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "hitsound_wall"), live(volume), 1, -1]);
	}
	target_turf = rt.getStep(f, live(A), 0);
	if (!truthy((yield* g.srcCall(f, "prehit", live(A))))) {
		return 0;
	}
	if ((isEqual((permutation = (yield* g.callName(f, live(A), "bullet_act", [live(f.src), rt.sv(f, "def_zone")]))), -1) || truthy(rt.sv(f, "forcedodge")))) {
		rt.setSv(f, "loc", live(target_turf));
		if (truthy(live(A))) {
			yield* g.callName(f, rt.sv(f, "permutated"), "Add", [live(A)]);
		}
		return 0;
	} else {
		if ((((truthy(live(A)) && truthy(rt.fv(f, "density", live(A)))) && !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)])))) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(A)), 512)))) {
			mobs_list = rt.list();
			L = null;
			rt.forList(f, 0, live(target_turf), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				L = $e;
				mobs_list = rt.modify(live(mobs_list), live(L), add);
			}
			rt.endFor(f, 0);
			if (truthy(rt.len(f, live(mobs_list)))) {
				if (!truthy((yield* g.srcCall(f, "prehit", (picked_mob = rt.op(f, "PickUnweighted", [1], [live(mobs_list)])))))) {
					return 0;
				}
				yield* g.callName(f, live(picked_mob), "bullet_act", [live(f.src), rt.sv(f, "def_zone")]);
			}
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 1;
}, true);

// /obj/item/projectile/proc/check_ricochet  (code/modules/projectiles/projectile.dm:184)
rt.def("/obj/item/projectile/proc/check_ricochet", function check_ricochet(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "ricochet_chance")]))) {
		return 1;
	}
	return 0;
});

// /obj/item/projectile/proc/check_ricochet_flag  (code/modules/projectiles/projectile.dm:189)
rt.def("/obj/item/projectile/proc/check_ricochet_flag", function check_ricochet_flag(f: Frame, A: Value) {
	if (truthy(rt.bitAnd(rt.fv(f, "flags", live(A)), 32))) {
		return 1;
	}
	return 0;
});

// /obj/item/projectile/proc/fire  (code/modules/projectiles/projectile.dm:197)  may sleep
rt.def("/obj/item/projectile/proc/fire", function* fire(f: Frame, setAngle: Value, direct_target: Value) {
	let old_pixel_x: Value = null, old_pixel_y: Value = null, next_run: Value = null, M: Value = null, Pixel_x: Value = null, Pixel_y: Value = null, pixel_x_offset: Value = null, pixel_y_offset: Value = null, new_x: Value = null, new_y: Value = null, delay: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any;
	f.vars = () => [setAngle, direct_target, old_pixel_x, old_pixel_y, next_run, M, Pixel_x, Pixel_y, pixel_x_offset, pixel_y_offset, new_x, new_y, delay, $0, $1, $2, $3, $4, $5, $6, $7, $8];
	if (((!truthy(rt.sv(f, "log_override")) && truthy(rt.sv(f, "firer"))) && truthy(rt.sv(f, "original")))) {
		yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "firer"), rt.sv(f, "original"), "fired at", live(f.src), fmt(" ＀", [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))])]);
	}
	if (truthy(live(direct_target))) {
		yield* g.srcCall(f, "prehit", live(direct_target));
		yield* g.callName(f, live(direct_target), "bullet_act", [live(f.src), rt.sv(f, "def_zone")]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (truthy(live(setAngle))) {
		rt.setSv(f, "Angle", live(setAngle));
	}
	old_pixel_x = rt.sv(f, "pixel_x");
	old_pixel_y = rt.sv(f, "pixel_y");
	if (!truthy(rt.sv(f, "legacy"))) {
		next_run = rt.worldTime(f);
		while (truthy(rt.sv(f, "loc"))) {
			if (truthy(rt.sv(f, "paused"))) {
				next_run = rt.worldTime(f);
				yield* g.call(f, P("/proc/sleep"), null, [1]);
				continue;
			}
			if ((!truthy(rt.sv(f, "current")) || isEqual(rt.sv(f, "loc"), rt.sv(f, "current")))) {
				rt.setSv(f, "current", rt.locate((yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "x"), rt.sv(f, "xo")), rt.fv(f, "maxx", rt.world())]))])), (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "y"), rt.sv(f, "yo")), rt.fv(f, "maxy", rt.world())]))])), rt.sv(f, "z")));
			}
			if (!truthy(rt.sv(f, "Angle"))) {
				rt.setSv(f, "Angle", (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/Get_Angle"), null, [live(f.src), rt.sv(f, "current")]))])));
			}
			if (truthy(rt.sv(f, "spread"))) {
				rt.modSrcVar(f, "Angle", multiply(subtract((yield* g.call(f, P("/proc/rand"), null, [])), 0.5), rt.sv(f, "spread")), add);
			}
			yield* g.callName(f, (M = (yield* g.new_(f, T("/matrix"), []))), "Turn", [rt.sv(f, "Angle")]);
			rt.setSv(f, "transform", live(M));
			Pixel_x = (yield* g.call(f, P("/proc/round"), null, [add(rt.op(f, "Sin", [], [rt.sv(f, "Angle")]), multiply(multiply(16, rt.op(f, "Sin", [], [rt.sv(f, "Angle")])), 2)), 1]));
			Pixel_y = (yield* g.call(f, P("/proc/round"), null, [add(rt.op(f, "Cos", [], [rt.sv(f, "Angle")]), multiply(multiply(16, rt.op(f, "Cos", [], [rt.sv(f, "Angle")])), 2)), 1]));
			pixel_x_offset = add(live(old_pixel_x), live(Pixel_x));
			pixel_y_offset = add(live(old_pixel_y), live(Pixel_y));
			new_x = rt.sv(f, "x");
			new_y = rt.sv(f, "y");
			while (rt.gt(live(pixel_x_offset), 16)) {
				(pixel_x_offset = rt.modify(live(pixel_x_offset), 32, subtract));
				(old_pixel_x = rt.modify(live(old_pixel_x), 32, subtract));
				new_x = rt.inc(live(new_x), 1);
			}
			while (rt.lt(live(pixel_x_offset), -16)) {
				pixel_x_offset = rt.modify(live(pixel_x_offset), 32, add);
				old_pixel_x = rt.modify(live(old_pixel_x), 32, add);
				new_x = rt.inc(live(new_x), -1);
			}
			while (rt.gt(live(pixel_y_offset), 16)) {
				(pixel_y_offset = rt.modify(live(pixel_y_offset), 32, subtract));
				(old_pixel_y = rt.modify(live(old_pixel_y), 32, subtract));
				new_y = rt.inc(live(new_y), 1);
			}
			while (rt.lt(live(pixel_y_offset), -16)) {
				pixel_y_offset = rt.modify(live(pixel_y_offset), 32, add);
				old_pixel_y = rt.modify(live(old_pixel_y), 32, add);
				new_y = rt.inc(live(new_y), -1);
			}
			rt.setSv(f, "pixel_x", live(old_pixel_x));
			rt.setSv(f, "pixel_y", live(old_pixel_y));
			yield* g.call(f, P("/proc/step_towards"), null, [live(f.src), rt.locate(live(new_x), live(new_y), rt.sv(f, "z"))]);
			next_run = rt.modify(live(next_run), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "tick_lag", rt.world()), rt.sv(f, "speed")])), add);
			if (rt.le((delay = subtract(live(next_run), rt.worldTime(f))), multiply(rt.fv(f, "tick_lag", rt.world()), 2))) {
				rt.setSv(f, "pixel_x", live(pixel_x_offset));
				rt.setSv(f, "pixel_y", live(pixel_y_offset));
			} else {
				$0 = null;
				$1 = live(f.src);
				$2 = "pixel_x";
				$3 = live(pixel_x_offset);
				$4 = "pixel_y";
				$5 = live(pixel_y_offset);
				$6 = "time";
				$7 = 1;
				if (rt.le(live(delay), 3)) {
					$8 = subtract(live(delay), 1);
				} else {
					$8 = live(delay);
				}
				rt.op(f, "Animate", [2, 10], [$0, $1, $2, $3, $4, $5, $6, (yield* g.call(f, P("/proc/max"), null, [$7, $8])), "flags", 1]);
			}
			old_pixel_x = live(pixel_x_offset);
			old_pixel_y = live(pixel_y_offset);
			if (((truthy(rt.sv(f, "original")) && rt.ge(rt.fv(f, "layer", rt.sv(f, "original")), 2.75)) || truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "original")]))))) {
				if (isEqual(rt.sv(f, "loc"), rt.getStep(f, rt.sv(f, "original"), 0))) {
					if (!truthy((rt.isIn(f, rt.sv(f, "original"), rt.sv(f, "permutated")) ? 1 : 0))) {
						yield* g.srcCall(f, "Bump", rt.sv(f, "original"), 1);
					}
				}
			}
			yield* g.srcCall(f, "Range");
			if (rt.gt(live(delay), 0)) {
				yield* g.call(f, P("/proc/sleep"), null, [live(delay)]);
			}
		}
	} else {
		while (truthy(rt.sv(f, "loc"))) {
			if (!truthy(rt.sv(f, "paused"))) {
				if ((!truthy(rt.sv(f, "current")) || isEqual(rt.sv(f, "loc"), rt.sv(f, "current")))) {
					rt.setSv(f, "current", rt.locate((yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "x"), rt.sv(f, "xo")), rt.fv(f, "maxx", rt.world())]))])), (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "y"), rt.sv(f, "yo")), rt.fv(f, "maxy", rt.world())]))])), rt.sv(f, "z")));
				}
				yield* g.call(f, P("/proc/step_towards"), null, [live(f.src), rt.sv(f, "current")]);
				if (((truthy(rt.sv(f, "original")) && rt.ge(rt.fv(f, "layer", rt.sv(f, "original")), 2.75)) || truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "original")]))))) {
					if (isEqual(rt.sv(f, "loc"), rt.getStep(f, rt.sv(f, "original"), 0))) {
						if (!truthy((rt.isIn(f, rt.sv(f, "original"), rt.sv(f, "permutated")) ? 1 : 0))) {
							yield* g.srcCall(f, "Bump", rt.sv(f, "original"), 1);
						}
					}
				}
				yield* g.srcCall(f, "Range");
			}
			yield* g.call(f, P("/proc/sleep"), null, [multiply(rt.fv(f, "run_speed", rt.gl("config")), 0.8999999761581421)]);
		}
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/projectile/proc/preparePixelProjectile  (code/modules/projectiles/projectile.dm:288)  may sleep
rt.def("/obj/item/projectile/proc/preparePixelProjectile", function* preparePixelProjectile(f: Frame, target: Value, targloc: Value, user: Value, params: Value, spread: Value) {
	let curloc: Value = null, calculated: Value = null;
	f.vars = () => [target, targloc, user, params, spread, curloc, calculated];
	curloc = rt.getStep(f, live(user), 0);
	yield* g.srcCall(f, "forceMove", rt.getStep(f, live(user), 0));
	rt.setSv(f, "starting", rt.getStep(f, live(user), 0));
	rt.setSv(f, "current", live(curloc));
	rt.setSv(f, "yo", subtract(rt.fv(f, "y", live(targloc)), rt.fv(f, "y", live(curloc))));
	rt.setSv(f, "xo", subtract(rt.fv(f, "x", live(targloc)), rt.fv(f, "x", live(curloc))));
	rt.setSv(f, "Angle", rt.index((calculated = (yield* g.call(f, P("/proc/calculate_projectile_angle_and_pixel_offsets"), null, [live(user), live(params)]))), 1));
	rt.setSv(f, "p_x", rt.index(live(calculated), 2));
	rt.setSv(f, "p_y", rt.index(live(calculated), 3));
	if (!truthy(live(spread))) return f.dot;
	rt.modField(f, live(f.src), "Angle", live(spread), add);
	return f.dot;
}, true);

// /proc/calculate_projectile_angle_and_pixel_offsets  (code/modules/projectiles/projectile.dm:304)
rt.def("/proc/calculate_projectile_angle_and_pixel_offsets", function calculate_projectile_angle_and_pixel_offsets(f: Frame, user: Value, params: Value) {
	let mouse_control: Value = null, p_x: Value = null, p_y: Value = null, angle: Value = null, screen_loc_params: Value = null, screen_loc_X: Value = null, screen_loc_Y: Value = null, x: Value = null, y: Value = null, screenview: Value = null, ox: Value = null, oy: Value = null;
	f.vars = () => [mouse_control, p_x, p_y, angle, screen_loc_params, screen_loc_X, screen_loc_Y, x, y, screenview, ox, oy];
	mouse_control = rt.call(f, P("/proc/params2list"), null, [live(params)]);
	p_x = 0;
	p_y = 0;
	angle = 0;
	if (truthy(rt.at(live(mouse_control), "icon-x"))) {
		p_x = rt.call(f, P("/proc/text2num"), null, [rt.at(live(mouse_control), "icon-x")]);
	}
	if (truthy(rt.at(live(mouse_control), "icon-y"))) {
		p_y = rt.call(f, P("/proc/text2num"), null, [rt.at(live(mouse_control), "icon-y")]);
	}
	if (truthy(rt.at(live(mouse_control), "screen-loc"))) {
		screen_loc_params = rt.call(f, P("/proc/splittext"), null, [rt.at(live(mouse_control), "screen-loc"), ","]);
		screen_loc_X = rt.call(f, P("/proc/splittext"), null, [rt.index(live(screen_loc_params), 1), ":"]);
		screen_loc_Y = rt.call(f, P("/proc/splittext"), null, [rt.index(live(screen_loc_params), 2), ":"]);
		x = subtract(add(multiply(rt.call(f, P("/proc/text2num"), null, [rt.index(live(screen_loc_X), 1)]), 32), rt.call(f, P("/proc/text2num"), null, [rt.index(live(screen_loc_X), 2)])), 32);
		y = subtract(add(multiply(rt.call(f, P("/proc/text2num"), null, [rt.index(live(screen_loc_Y), 1)]), 32), rt.call(f, P("/proc/text2num"), null, [rt.index(live(screen_loc_Y), 2)])), 32);
		screenview = rt.call(f, P("/proc/getviewsize"), null, [rt.gv(f, "view", rt.fv(f, "client", live(user)))]);
		ox = subtract(rt.call(f, P("/proc/round"), null, [divide(multiply(rt.index(live(screenview), 1), rt.fv(f, "icon_size", rt.world())), 2)]), rt.gv(f, "pixel_x", rt.fv(f, "client", live(user))));
		oy = subtract(rt.call(f, P("/proc/round"), null, [divide(multiply(rt.index(live(screenview), 2), rt.fv(f, "icon_size", rt.world())), 2)]), rt.gv(f, "pixel_y", rt.fv(f, "client", live(user))));
		angle = rt.call(f, P("/proc/Atan2"), null, [subtract(live(y), live(oy)), subtract(live(x), live(ox))]);
	}
	return rt.list(live(angle), live(p_x), live(p_y));
});

// /obj/item/projectile/proc/Crossed  (code/modules/projectiles/projectile.dm:336)  may sleep
rt.def("/obj/item/projectile/proc/Crossed", function* Crossed(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)) && truthy(rt.fv(f, "density", live(f.args[0])))) && !truthy((yield* g.srcCall(f, "checkpass", 16))))) return f.dot;
	yield* g.srcCall(f, "Bump", live(f.args[0]), 1);
	return f.dot;
}, true, { args: ["AM"] });

// /obj/item/projectile/proc/Destroy  (code/modules/projectiles/projectile.dm:341)  may sleep
rt.def("/obj/item/projectile/proc/Destroy", function* Destroy(f: Frame) {
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
