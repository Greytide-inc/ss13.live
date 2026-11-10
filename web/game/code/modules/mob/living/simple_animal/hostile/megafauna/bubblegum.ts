// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/megafauna/bubblegum.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(5023, "/mob/living/simple_animal/hostile/megafauna/bubblegum", "/mob/living/simple_animal/hostile/megafauna", {
	charging: 0,
	move_to_delay: 10,
	ranged: 1,
	name: "bubblegum",
	desc: "In what passes for a heirarchy among slaughter demons, this one is king.",
	health: 2500,
	maxHealth: 2500,
	attacktext: "rends",
	attack_sound: rt.rsc("sound/magic/demon_attack1.ogg"),
	icon_state: "bubblegum",
	icon_living: "bubblegum",
	icon_dead: "",
	friendly: "stares down",
	icon: rt.rsc("icons/mob/lavaland/96x96megafauna.dmi"),
	speak_emote: null,
	armour_penetration: 40,
	melee_damage_lower: 40,
	melee_damage_upper: 40,
	speed: 1,
	pixel_x: -32,
	del_on_death: 1,
	crusher_loot: null,
	loot: null,
	blood_volume: 2000,
	medal_type: "Bubblegum",
	score_type: "Bubblegum Killed",
	deathmessage: "sinks into a pool of blood, fleeing the battle. You've won, for now... ",
	death_sound: rt.rsc("sound/magic/enter_blood.ogg"),
});

// bubblegum.dm:38
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("gurgles");

	this.crusher_loot = list(T("/obj/structure/closet/crate/necropolis/bubblegum/crusher"));

	this.loot = list(T("/obj/structure/closet/crate/necropolis/bubblegum"));
	return f.dot;
});

// bubblegum.dm:63
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/adjustBruteLoss", function* adjustBruteLoss(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(f.dot > 0 && prob(25))) return f.dot;
	let B: Value = (yield* new_(T("/obj/effect/decal/cleanable/blood/gibs/bubblegum"), this.loc));
	if (prob(40)) {
		yield* step(B, pick(GLOB.cardinal));
	} else {
		yield* B.setDir(pick(GLOB.cardinal));
	}
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// bubblegum.dm:81
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Life", function Life(f: Frame) {
	parent_proc();
	this.move_to_delay = max(5, min(this.health / this.maxHealth * 10, 10));
	return f.dot;
}, false, { waitfor: false });

// bubblegum.dm:85
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/OpenFire", function* OpenFire(f: Frame) {
	this.anger_modifier = max(0, min((this.maxHealth - this.health) / 60, 20));
	if (this.charging) {
		return f.dot;
	}
	this.ranged_cooldown = rt.worldTime(f) + this.ranged_cooldown_time;
	let warped: Value = 0;
	if (!this.try_bloodattack()) {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/blood_spray"));
		if ((warped = (yield* this.blood_warp())) && prob(100 - this.anger_modifier)) {
			return f.dot;
		}
	}
	if (!(prob(90 - this.anger_modifier) || (yield* this.slaughterlings()))) return f.dot;
	if (this.health > this.maxHealth * 0.5) {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge"));
	} else if (prob(70) || warped) {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge"), 2);
	} else {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/warp_charge"));
	}
	return f.dot;
}, true);

// bubblegum.dm:108
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null, bloodspell: Value = null;
	yield* parent_proc();
	for (B of each(GLOB.mob_list, T("/mob/living/simple_animal/hostile/megafauna/bubblegum"))) {
		if (B != this) {
			yield* qdel(this);
			return f.dot;
		}
	}
	yield* this.AddSpell((bloodspell = (yield* new_(T("/obj/effect/proc_holder/spell/bloodcrawl")))));
	if (rt.istype(this.loc, T("/obj/effect/dummy/slaughter"))) {
		bloodspell.phased = 1;
	}
	this.internal = (yield* new_(T("/obj/item/device/gps/internal/bubblegum"), this));
	return f.dot;
}, true);

// bubblegum.dm:120
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/grant_achievement", function grant_achievement(f: Frame, medaltype: Value, scoretype: Value) {
	f.dot = parent_proc();
	if (!f.dot) return f.dot;
	(rt.modField(f, GLOB.SSshuttle, "shuttle_purchase_requirements_met", "bubblegum", rt.bitOr));
	return f.dot;
}, false);

// bubblegum.dm:125
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/do_attack_animation", function* do_attack_animation(f: Frame, A: Value, visual_effect_icon: Value) {
	if (this.charging) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// bubblegum.dm:129
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (this.charging) return f.dot;
	return (yield* parent_proc());
}, true);

// bubblegum.dm:133
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Goto", function Goto(f: Frame, target: Value, delay: Value, minimum_distance: Value) {
	if (this.charging) return f.dot;
	parent_proc();
	return f.dot;
}, false);

// bubblegum.dm:138
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Move", function* Move(f: Frame) {
	if (this.charging) {
		yield* new_(T("/obj/effect/temp_visual/decoy/fading"), this.loc, this);
		yield* this.DestroySurroundings();
	}
	f.dot = (yield* parent_proc());
	if (!this.stat && f.dot) {
		playsound(this, rt.rsc("sound/effects/meteorimpact.ogg"), 200, 1, 2, 1);
	}
	if (!this.charging) return f.dot;
	yield* this.DestroySurroundings();
	return f.dot;
}, true);

// bubblegum.dm:147
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/warp_charge", function* warp_charge(f: Frame) {
	yield* this.blood_warp();
	yield* this.charge();
	return f.dot;
}, true);

// bubblegum.dm:151
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge", function* charge(f: Frame, bonus_charges: Value) {
	let _T: Value = null;
	if (!(_T = rt.getStep(f, this.target, 0)) || _T == this.loc) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/dragon_swoop/bubblegum"), _T);
	this.charging = 1;
	yield* this.DestroySurroundings();
	walk(this, 0);
	yield* this.setDir(rt.getDir(f, this, _T));
	let D: Value = (yield* new_(T("/obj/effect/temp_visual/decoy"), this.loc, this));
	rt.op(f, "Animate", [2, 10], [null, D, "alpha", 0, "color", "#FF0000", "transform", matrix() * 2, "time", 3]);
	yield* sleep(3);
	yield* this.throw_at(_T, get_dist(this, _T), 1, this, 0, { callback: (yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge_end"), bonus_charges)) });
	return f.dot;
}, true);

// bubblegum.dm:166
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/charge_end", function* charge_end(f: Frame, bonus_charges: Value, effects_to_destroy: Value) {
	this.charging = 0;
	this.try_bloodattack();
	if (!this.target) return f.dot;
	if (bonus_charges) {
		bonus_charges--;
		yield* this.charge(bonus_charges);
	} else {
		this.Goto(this.target, this.move_to_delay, this.minimum_distance);
		this.SetRecoveryTime(MEGAFAUNA_DEFAULT_RECOVERY_TIME);
	}
	return f.dot;
}, true, { argTypes: [{  }, { path: "/list" }] });

// bubblegum.dm:178
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/Bump", function* Bump(f: Frame, A: Value) {
	if (this.charging) {
		if (isturf(A) || rt.istype(A, T("/obj")) && A.density) {
			yield* A.ex_act(2);
		}
		yield* this.DestroySurroundings();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// bubblegum.dm:184
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/throw_impact", function* throw_impact(f: Frame, A: Value) {
	let L: Value = null, throwtarget: Value = null;
	if (!this.charging) {
		return (yield* parent_proc());
	}
	if (rt.istype(A, T("/mob/living"))) {
		(L = A).visible_message(`<span class='danger'>${this} slams into ${L}!</span>`, `<span class='userdanger'>${this} slams into you!</span>`);
		yield* L.apply_damage(40, "brute");
		playsound(rt.getStep(f, L, 0), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1);
		shake_camera(L, 4, 3);
		shake_camera(this, 2, 3);
		throwtarget = get_edge_target_turf(this, rt.getDir(f, this, get_step_away(L, this)));
		yield* L.throw_at(throwtarget, 3);
	}
	this.charging = 0;
	return f.dot;
}, true, { waitfor: false });

// bubblegum.dm:201
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/get_mobs_on_blood", function get_mobs_on_blood(f: Frame) {
	let L: Value = null, bloodpool: Value = null;
	let targets: Value = this.ListTargets();
	f.dot = list();
	for (L of each(targets, T("/mob/living"))) {
		if (rt.len(f, (bloodpool = this.get_pools(rt.getStep(f, L, 0), 0))) && (!this.faction_check_mob(L) || L.stat == 2)) {
			f.dot += L;
		}
	}
	return f.dot;
});

// bubblegum.dm:209
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/try_bloodattack", function try_bloodattack(f: Frame) {
	let targets: Value = null;
	if (rt.len(f, (targets = this.get_mobs_on_blood()))) {
		ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/bloodattack"), targets, prob(50));
		return 1;
	}
	return 0;
});

// bubblegum.dm:217
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/bloodattack", function* bloodattack(f: Frame, targets: Value, handedness: Value) {
	let target_two: Value = null, target_two_turf: Value = null, pools: Value = null, poolstwo: Value = null;
	let target_one: Value = pick_n_take(targets);
	let target_one_turf: Value = rt.getStep(f, target_one, 0);
	if (rt.len(f, targets)) {
		target_two = pick_n_take(targets);
		target_two_turf = rt.getStep(f, target_two, 0);
		if (target_two.stat != 0 || prob(10)) {
			yield* this.bloodgrab(target_two_turf, handedness);
		} else {
			yield* this.bloodsmack(target_two_turf, handedness);
		}
	}
	if (target_one) {
		if (rt.len(f, (pools = this.get_pools(rt.getStep(f, target_one, 0), 0)))) {
			if (target_one_turf = rt.getStep(f, target_one, 0)) {
				if (target_one.stat != 0 || prob(10)) {
					yield* this.bloodgrab(target_one_turf, (!handedness ? 1 : 0));
				} else {
					yield* this.bloodsmack(target_one_turf, (!handedness ? 1 : 0));
				}
			}
		}
	}
	if (!(!target_two && target_one)) return f.dot;
	if (!rt.len(f, (poolstwo = this.get_pools(rt.getStep(f, target_one, 0), 0)))) return f.dot;
	if (!(target_one_turf = rt.getStep(f, target_one, 0))) return f.dot;
	if (target_one.stat != 0 || prob(10)) {
		yield* this.bloodgrab(target_one_turf, handedness);
	} else {
		yield* this.bloodsmack(target_one_turf, handedness);
	}
	return f.dot;
}, true, { argTypes: [{ path: "/list" }, {  }] });

// bubblegum.dm:250
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/bloodsmack", function* bloodsmack(f: Frame, _T: Value, handedness: Value) {
	let L: Value = null, limb_to_hit: Value = null;
	if (handedness) {
		yield* new_(T("/obj/effect/temp_visual/bubblegum_hands/rightsmack"), _T);
	} else {
		yield* new_(T("/obj/effect/temp_visual/bubblegum_hands/leftsmack"), _T);
	}
	yield* sleep(2.5);
	for (L of each(_T, T("/mob/living"))) {
		if (!this.faction_check_mob(L)) {
			to_chat(L, `<span class='userdanger'>${this} rends you!</span>`);
			playsound(_T, this.attack_sound, 100, 1, -1);
			limb_to_hit = L.get_bodypart(pick("head", "chest", "r_arm", "l_arm", "r_leg", "l_leg"));
			yield* L.apply_damage(25, "brute", limb_to_hit, L.run_armor_check(limb_to_hit, "melee", null, null, this.armour_penetration));
		}
	}
	yield* sleep(3);
	return f.dot;
}, true);

// bubblegum.dm:264
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/bloodgrab", function* bloodgrab(f: Frame, _T: Value, handedness: Value) {
	let L: Value = null, targetturf: Value = null;
	if (handedness) {
		yield* new_(T("/obj/effect/temp_visual/bubblegum_hands/rightpaw"), _T);
		yield* new_(T("/obj/effect/temp_visual/bubblegum_hands/rightthumb"), _T);
	} else {
		yield* new_(T("/obj/effect/temp_visual/bubblegum_hands/leftpaw"), _T);
		yield* new_(T("/obj/effect/temp_visual/bubblegum_hands/leftthumb"), _T);
	}
	yield* sleep(6);
	for (L of each(_T, T("/mob/living"))) {
		if (!this.faction_check_mob(L)) {
			to_chat(L, `<span class='userdanger'>${this} drags you through the blood!</span>`);
			playsound(_T, rt.rsc("sound/magic/enter_blood.ogg"), 100, 1, -1);
			targetturf = rt.getStep(f, this, this.dir);
			yield* L.forceMove(targetturf);
			playsound(targetturf, rt.rsc("sound/magic/exit_blood.ogg"), 100, 1, -1);
			if (L.stat != 0) {
				yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/megafauna/proc/devour"), L)), 2);
			}
		}
	}
	yield* sleep(1);
	return f.dot;
}, true);

// bubblegum.dm:309
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/blood_warp", function* blood_warp(f: Frame) {
	let can_jaunt: Value = null, pools_to_remove: Value = null, DA: Value = null, found_bloodpool: Value = null;
	if (this.Adjacent(this.target)) {
		return 0;
	}
	if (!rt.len(f, (can_jaunt = this.get_pools(rt.getStep(f, this, 0), 1)))) {
		return 0;
	}
	let pools: Value = this.get_pools(rt.getStep(f, this.target, 0), 2);
	pools -= (pools_to_remove = this.get_pools(rt.getStep(f, this.target, 0), 1));
	if (!rt.len(f, pools)) {
		return 0;
	}
	(DA = (yield* new_(T("/obj/effect/temp_visual/decoy"), this.loc, this))).color = "#FF0000";
	let oldtransform: Value = DA.transform;
	DA.transform = matrix() * 2;
	rt.op(f, "Animate", [2, 10], [null, DA, "alpha", 255, "color", rt.initial(f, DA, "color"), "transform", oldtransform, "time", 3]);
	yield* sleep(3);
	yield* qdel(DA);
	pools = this.get_pools(rt.getStep(f, this.target, 0), 2);
	pools -= (pools_to_remove = this.get_pools(rt.getStep(f, this.target, 0), 1));
	if (rt.len(f, pools)) {
		shuffle_inplace(pools);
		found_bloodpool = pick(pools);
	}
	if (found_bloodpool) {
		this.visible_message(`<span class='danger'>${this} sinks into the blood...</span>`);
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/enter_blood.ogg"), 100, 1, -1);
		yield* this.forceMove(rt.getStep(f, found_bloodpool, 0));
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/exit_blood.ogg"), 100, 1, -1);
		this.visible_message("<span class='danger'>And springs back out!</span>");
		return 1;
	}
	return 0;
}, true);

// bubblegum.dm:346
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/get_pools", function get_pools(f: Frame, _T: Value, range: Value) {
	let nearby: Value = null;
	f.dot = list();
	for (nearby of each(view(_T, range), T("/obj/effect/decal/cleanable"))) {
		if (nearby.can_bloodcrawl_in()) {
			f.dot += nearby;
		}
	}
	return f.dot;
});

// bubblegum.dm:352
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/blood_spray", function* blood_spray(f: Frame) {
	let i: Value = null;
	let $e: any;
	this.visible_message(`<span class='danger'>${this} sprays a stream of gore!</span>`);
	let range: Value = 6 + round(this.anger_modifier * 0.4);
	let previousturf: Value = rt.getStep(f, this, 0);
	let J: Value = previousturf;
	let targetdir: Value = rt.getDir(f, this, this.target);
	if (this.target.loc == this.loc) {
		targetdir = this.dir;
	}
	yield* this.face_atom(this.target);
	yield* new_(T("/obj/effect/decal/cleanable/blood/bubblegum"), J);
	rt.forRange(f, 0, 1, range, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		J = rt.getStep(f, previousturf, targetdir);
		yield* new_(T("/obj/effect/temp_visual/dir_setting/bloodsplatter"), previousturf, rt.getDir(f, previousturf, J));
		playsound(previousturf, rt.rsc("sound/effects/splat.ogg"), 100, 1, -1);
		if (!J || !previousturf.atmos_adjacent_turfs || !rt.index(previousturf.atmos_adjacent_turfs, J)) {
			break;
		}
		yield* new_(T("/obj/effect/decal/cleanable/blood/bubblegum"), J);
		previousturf = J;
		yield* sleep(1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// bubblegum.dm:378
rt.def("/mob/living/simple_animal/hostile/megafauna/bubblegum/proc/slaughterlings", function* slaughterlings(f: Frame) {
	let H: Value = null, B: Value = null;
	this.visible_message(`<span class='danger'>${this} summons a shoal of slaughterlings!</span>`);
	let max_amount: Value = 6;
	for (H of each(this.get_pools(rt.getStep(f, this, 0), 1))) {
		if (!max_amount) {
			break;
		}
		max_amount--;
		yield* new_(T("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/slaughter"), (B = H).loc);
	}
	return max_amount;
}, true);

rt.type(5001, "/mob/living/simple_animal/hostile/asteroid/hivelordbrood/slaughter", "/mob/living/simple_animal/hostile/asteroid/hivelordbrood", {
	name: "slaughterling",
	desc: "Though not yet strong enough to create a true physical form, it's nonetheless determined to murder you.",
	icon_state: "bloodbrood",
	icon_living: "bloodbrood",
	icon_aggro: "bloodbrood",
	attacktext: "pierces",
	color: "#C80000",
	density: 0,
	faction: null,
	weather_immunities: null,
});

// bubblegum.dm:401
rt.def("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/slaughter/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (rt.istype(mover, T("/mob/living/simple_animal/hostile/megafauna/bubblegum"))) {
		return 1;
	}
	return 0;
});
