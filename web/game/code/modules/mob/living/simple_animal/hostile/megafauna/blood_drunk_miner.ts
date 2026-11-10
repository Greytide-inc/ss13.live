// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(5022, "/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner", "/mob/living/simple_animal/hostile/megafauna", {
	miner_saw: null,
	time_until_next_transform: null,
	dashing: 0,
	dash_cooldown: 15,
	light_color: "#E4C7C5",
	move_to_delay: 3,
	projectilesound: rt.rsc("sound/weapons/kenetic_accel.ogg"),
	ranged: 1,
	stat_attack: 1,
	name: "blood-drunk miner",
	desc: "A miner destined to wander forever, engaged in an endless hunt.",
	health: 900,
	maxHealth: 900,
	icon_state: "miner",
	icon_living: "miner",
	icon: rt.rsc("icons/mob/broadMobs.dmi"),
	movement_type: 1,
	speak_emote: null,
	speed: 1,
	projectiletype: rt.typePath("/obj/item/projectile/kinetic/miner"),
	pixel_x: -16,
	crusher_loot: null,
	loot: null,
	wander: 0,
	del_on_death: 1,
	blood_volume: 560,
	medal_type: "Blood-drunk Miner",
	deathmessage: "falls to the ground, decaying into glowing particles.",
	death_sound: "bodyfall",
});

// blood_drunk_miner.dm:33
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("roars");

	this.crusher_loot = list(T("/obj/item/weapon/melee/transforming/cleaving_saw"), T("/obj/item/weapon/gun/energy/kinetic_accelerator"), T("/obj/item/crusher_trophy/miner_eye"));

	this.loot = list(T("/obj/item/weapon/melee/transforming/cleaving_saw"), T("/obj/item/weapon/gun/energy/kinetic_accelerator"));
	return f.dot;
});

rt.type(5694, "/obj/item/weapon/melee/transforming/cleaving_saw/miner", "/obj/item/weapon/melee/transforming/cleaving_saw", {
	force_on: 10,
	force: 6,
});

// blood_drunk_miner.dm:59
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/miner/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let new_knockdown: Value = null;
	let target_knockdown_amount: Value = target.AmountKnockdown();
	yield* parent_proc();
	if ((new_knockdown = target.AmountKnockdown()) == target_knockdown_amount) return f.dot;
	yield* target.SetKnockdown(max(target_knockdown_amount, 6), { ignore_canknockdown: 1 });
	return f.dot;
}, true);

// blood_drunk_miner.dm:72
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.internal = (yield* new_(T("/obj/item/device/gps/internal/miner"), this));
	this.miner_saw = (yield* new_(T("/obj/item/weapon/melee/transforming/cleaving_saw/miner"), this));
	return f.dot;
}, true);

// blood_drunk_miner.dm:77
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	let adjustment_amount: Value = f.args[0] * 0.15;
	if (rt.worldTime(f) + adjustment_amount > this.next_move) {
		this.changeNext_move(adjustment_amount);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// blood_drunk_miner.dm:83
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/death", function* death(f: Frame) {
	if (this.health > 0) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/dir_setting/miner_death"), this.loc, this.dir);
	return (yield* parent_proc());
}, true);

// blood_drunk_miner.dm:89
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/Move", function* Move(f: Frame, newloc: Value) {
	if (this.dashing || newloc && newloc.z == this.z && (rt.istype(newloc, T("/turf/open/floor/plating/lava")) || rt.istype(newloc, T("/turf/open/chasm")))) {
		return 0;
	}
	return (yield* parent_proc());
}, true);

// blood_drunk_miner.dm:94
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (yield* this.dash()) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true, { waitfor: false });

// blood_drunk_miner.dm:99
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null;
	if (!this.target || this.target.gc_destroyed) {
		return f.dot;
	}
	if (this.next_move > rt.worldTime(f) || !this.Adjacent(this.target)) {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/quick_attack_loop"));
		return f.dot;
	}
	yield* this.face_atom(this.target);
	if (rt.istype(this.target, T("/mob/living"))) {
		if ((L = this.target).stat == 2) {
			this.visible_message(`<span class='danger'>${this} butchers ${L}!</span>`, `<span class='userdanger'>You butcher ${L}, restoring your health!</span>`);
			if (this.z != 2 && !this.client) {
				yield* this.adjustBruteLoss(-L.maxHealth / 2);
			}
			yield* L.gib();
			return 1;
		}
	}
	this.changeNext_move(8);
	yield* this.miner_saw.melee_attack_chain(this, this.target);
	yield* this.transform_weapon();
	yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/quick_attack_loop"));
	if (prob(10)) {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/dash"));
	}
	return 1;
}, true);

// blood_drunk_miner.dm:123
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if (!f.args[2]) {
		f.args[2] = this.miner_saw;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });

// blood_drunk_miner.dm:128
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/GiveTarget", function* GiveTarget(f: Frame, new_target: Value) {
	let targets_the_same: Value = (new_target == this.target ? 1 : 0);
	f.dot = (yield* parent_proc());
	if (!(f.dot && this.target && !targets_the_same)) return f.dot;
	this.wander = 1;
	yield* this.transform_weapon();
	yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/quick_attack_loop"));
	return f.dot;
}, true);

// blood_drunk_miner.dm:136
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/OpenFire", function* OpenFire(f: Frame) {
	this.Goto(this.target, this.move_to_delay, this.minimum_distance);
	if (get_dist(this, this.target) >= 4 && rt.worldTime(f) >= this.dash_cooldown) {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/dash"), this.target);
	} else if (this.next_move <= rt.worldTime(f)) {
		this.visible_message(`<span class='danger'>${this} fires the proto-kinetic accelerator!</span>`);
		yield* new_(T("/obj/effect/temp_visual/dir_setting/firing_effect"), this.loc, this.dir);
		yield* this.face_atom(this.target);
		yield* this.Shoot(this.target);
		this.changeNext_move(4);
	}
	yield* this.transform_weapon();
	return f.dot;
}, true);

// blood_drunk_miner.dm:148
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/quick_attack_loop", function* quick_attack_loop(f: Frame) {
	if (this.next_move <= rt.worldTime(f)) {
		yield* sleep(1);
		yield* g.callSelf(f, []);
		return f.dot;
	}
	yield* sleep((this.next_move - rt.worldTime(f)) * 1.5);
	if (!this.target || this.target.gc_destroyed) {
		return f.dot;
	}
	if (this.dashing || this.next_move > rt.worldTime(f) || !this.Adjacent(this.target)) {
		if (this.dashing && this.next_move <= rt.worldTime(f)) {
			this.next_move = rt.worldTime(f) + 1;
		}
		yield* g.callSelf(f, []);
		return f.dot;
	}
	yield* this.AttackingTarget();
	return f.dot;
}, true);

// blood_drunk_miner.dm:163
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/dash", function* dash(f: Frame, dash_target: Value) {
	let O: Value = null, turf_dist_to_target: Value = null, valid: Value = null, _T: Value = null, target_turf: Value = null, closest_dist: Value = null, t: Value = null;
	if (rt.worldTime(f) < this.dash_cooldown) {
		return f.dot;
	}
	this.dash_cooldown = rt.worldTime(f) + rt.initial(f, this, "dash_cooldown");
	let accessable_turfs: Value = list();
	let self_dist_to_target: Value = 0;
	let own_turf: Value = rt.getStep(f, this, 0);
	if (!(!this.target || this.target.gc_destroyed)) {
		self_dist_to_target += get_dist(dash_target, own_turf);
	}
	for (O of each(block(rt.locate(max(own_turf.x - 4, 1), max(own_turf.y - 4, 1), own_turf.z), rt.locate(min(own_turf.x + 4, rt.world().maxx), min(own_turf.y + 4, rt.world().maxy), own_turf.z)), T("/turf/open"))) {
		turf_dist_to_target = 0;
		if (!(!dash_target || dash_target.gc_destroyed)) {
			turf_dist_to_target += get_dist(dash_target, O);
		}
		if (get_dist(this, O) >= MINER_DASH_RANGE && turf_dist_to_target <= self_dist_to_target && !rt.istype(O, T("/turf/open/floor/plating/lava")) && !rt.istype(O, T("/turf/open/chasm")) && (!dash_target || dash_target.gc_destroyed || !O.Adjacent(dash_target))) {
			valid = 1;
			_T = null;
			for (_T of each(getline(own_turf, O), T("/turf"))) {
				if (is_blocked_turf(_T, 1)) {
					valid = 0;
					continue;
				}
			}
			if (valid) {
				rt.setAt(accessable_turfs, O, turf_dist_to_target);
			}
		}
	}
	if (!rt.length(accessable_turfs)) {
		return f.dot;
	}
	if (!(!this.target || this.target.gc_destroyed)) {
		closest_dist = MINER_DASH_RANGE;
		for (t of each(accessable_turfs)) {
			if (rt.index(accessable_turfs, t) < closest_dist) {
				closest_dist = rt.index(accessable_turfs, t);
			}
		}
		t = null;
		for (t of each(accessable_turfs)) {
			rt.setAt(accessable_turfs, t, (rt.index(accessable_turfs, t) - closest_dist) * 10);
		}
		target_turf = pickweight(accessable_turfs);
	} else {
		target_turf = pick(accessable_turfs);
	}
	let step_back_turf: Value = rt.getStep(f, target_turf, get_cardinal_dir(target_turf, own_turf));
	let step_forward_turf: Value = rt.getStep(f, own_turf, get_cardinal_dir(own_turf, target_turf));
	yield* new_(T("/obj/effect/temp_visual/small_smoke/halfsecond"), step_back_turf);
	yield* new_(T("/obj/effect/temp_visual/small_smoke/halfsecond"), step_forward_turf);
	let D: Value = (yield* new_(T("/obj/effect/temp_visual/decoy/fading/halfsecond"), own_turf, this));
	yield* this.forceMove(step_back_turf);
	playsound(own_turf, rt.rsc("sound/weapons/punchmiss.ogg"), 40, 1, -1);
	this.dashing = 1;
	this.alpha = 0;
	rt.op(f, "Animate", [2, 6], [null, this, "alpha", 255, "time", 5]);
	yield* sleep(2);
	yield* D.forceMove(step_forward_turf);
	yield* this.forceMove(target_turf);
	playsound(target_turf, rt.rsc("sound/weapons/punchmiss.ogg"), 40, 1, -1);
	yield* sleep(1);
	this.dashing = 0;
	return 1;
}, true, { argTypes: [{ path: "/atom" }] });

// blood_drunk_miner.dm:216
rt.def("/mob/living/simple_animal/hostile/megafauna/blood_drunk_miner/proc/transform_weapon", function* transform_weapon(f: Frame) {
	if (!(this.time_until_next_transform <= rt.worldTime(f))) return f.dot;
	this.miner_saw.transform_cooldown = 0;
	yield* this.miner_saw.transform_weapon(this, 1);
	this.icon_state = `miner${this.miner_saw.active ? "_transformed" : ""}`;
	this.icon_living = `miner${this.miner_saw.active ? "_transformed" : ""}`;
	this.time_until_next_transform = rt.worldTime(f) + rand(50, 100);
	return f.dot;
}, true);

rt.type(11618, "/obj/effect/temp_visual/dir_setting/miner_death", "/obj/effect/temp_visual/dir_setting", {
	icon_state: "miner_death",
	duration: 10,
});

// blood_drunk_miner.dm:228
rt.def("/obj/effect/temp_visual/dir_setting/miner_death/proc/Initialize", function* Initialize(f: Frame, mapload: Value, set_dir: Value) {
	f.dot = (yield* parent_proc());
	yield* ImmediateInvokeAsync(this, P("/obj/effect/temp_visual/dir_setting/miner_death/proc/fade_out"));
	return f.dot;
}, true);

// blood_drunk_miner.dm:232
rt.def("/obj/effect/temp_visual/dir_setting/miner_death/proc/fade_out", function* fade_out(f: Frame) {
	let M: Value = null;
	(M = (yield* new_(T("/matrix")))).Turn(pick(90, 270));
	let final_dir: Value = this.dir;
	if (rt.bitAnd(this.dir, 12)) {
		final_dir = pick(1, 2);
	}
	rt.op(f, "Animate", [2, 12], [null, this, "transform", M, "pixel_y", -6, "dir", final_dir, "time", 2, "easing", 192]);
	yield* sleep(2);
	rt.op(f, "Animate", [2, 10], [null, this, "color", list("#A7A19E", "#A7A19E", "#A7A19E", list(0, 0, 0)), "time", 8, "easing", 64, "flags", 4]);
	yield* sleep(2);
	rt.op(f, "Animate", [2, 10], [null, this, "alpha", 0, "time", 6, "easing", 128, "flags", 4]);
	return f.dot;
}, true);
