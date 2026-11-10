// Based on /tg/station's code/game/objects/structures/manned_turret.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10877, "/obj/machinery/manned_turret", "/obj/machinery", {
	view_range: 10,
	cooldown: 0,
	projectile_type: rt.typePath("/obj/item/projectile/bullet/weakbullet3"),
	rate_of_fire: 1,
	number_of_shots: 40,
	cooldown_duration: 90,
	target: null,
	target_turf: null,
	warned: 0,
	calculated_projectile_vars: null,
	can_buckle: 1,
	buckle_lying: 0,
	name: "machine gun turret",
	desc: "While the trigger is held down, this gun will redistribute recoil to allow its user to easily shift targets.",
	icon: rt.rsc("icons/obj/turrets.dmi"),
	icon_state: "machinegun",
	density: 1,
	max_integrity: 100,
	obj_integrity: 100,
	layer: 4.1,
});

// manned_turret.dm:28
rt.def("/obj/machinery/manned_turret/proc/Destroy", function* Destroy(f: Frame) {
	this.target = null;
	this.target_turf = null;
	yield* parent_proc();
	return f.dot;
}, true);

// manned_turret.dm:33
rt.def("/obj/machinery/manned_turret/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	let I: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	playsound(this, rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1);
	for (I of each(f.args[0].held_items, T("/obj/item"))) {
		if (rt.istype(I, T("/obj/item/gun_control"))) {
			yield* qdel(I);
		}
	}
	if (rt.istype(f.args[0], T("/mob/living"))) {
		f.args[0].pixel_x = 0;
		f.args[0].pixel_y = 0;
		if (f.args[0].client) {
			yield* f.args[0].client.change_view(f.args[0].client.default_view());
		}
	}
	this.anchored = 0;
	f.dot = (yield* parent_proc());
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	return f.dot;
}, true, { args: ["buckled_mob", "force"] });

// manned_turret.dm:47
rt.def("/obj/machinery/manned_turret/proc/user_buckle_mob", function* user_buckle_mob(f: Frame, M: Value, user: Value) {
	let V: Value = null, I: Value = null, TC: Value = null;
	if (user.incapacitated() || !rt.istype(user, T("/mob/living/carbon"))) {
		return f.dot;
	}
	yield* M.forceMove(rt.getStep(f, this, 0));
	f.dot = (yield* parent_proc());
	if (!f.dot) {
		return f.dot;
	}
	for (V of each(M.held_items)) {
		if (rt.istype((I = V), T("/obj/item"))) {
			if (yield* M.dropItemToGround(I)) {
				TC = (yield* new_(T("/obj/item/gun_control"), this));
				yield* M.put_in_hands(TC);
			}
		} else {
			TC = (yield* new_(T("/obj/item/gun_control"), this));
			yield* M.put_in_hands(TC);
		}
	}
	M.pixel_y = 14;
	this.layer = ABOVE_MOB_LAYER;
	yield* this.setDir(2);
	playsound(this, rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1);
	this.anchored = 1;
	if (M.client) {
		yield* M.client.change_view(this.view_range);
	}
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSfastprocess.processing += this;
	return f.dot;
}, true);

// manned_turret.dm:72
rt.def("/obj/machinery/manned_turret/proc/process", function* process(f: Frame) {
	if (!rt.length(this.buckled_mobs)) {
		return PROCESS_KILL;
	}
	yield* this.update_positioning();
	return f.dot;
}, true, { waitfor: false });

// manned_turret.dm:77
rt.def("/obj/machinery/manned_turret/proc/update_positioning", function* update_positioning(f: Frame) {
	let controller: Value = null, C: Value = null, _T: Value = null;
	if (!rt.istype((controller = rt.index(this.buckled_mobs, 1)), T("/mob/living"))) {
		return f.dot;
	}
	if (!(C = controller.client)) return f.dot;
	let A: Value = C.mouseObject;
	if (!rt.istype((_T = rt.getStep(f, A, 0)), T("/turf"))) return f.dot;
	yield* this.direction_track(controller, _T);
	this.calculated_projectile_vars = calculate_projectile_angle_and_pixel_offsets(controller, C.mouseParams);
	return f.dot;
}, true);

// manned_turret.dm:89
rt.def("/obj/machinery/manned_turret/proc/direction_track", function* direction_track(f: Frame, user: Value, targeted: Value) {
	if (user.stat != 0) {
		return f.dot;
	}
	yield* this.setDir(rt.getDir(f, this, targeted));
	yield* user.setDir(this.dir);
	if (this.dir === 1) {
		this.layer = BELOW_MOB_LAYER;
		user.pixel_x = 0;
		user.pixel_y = -14;
	} else if (this.dir === 5) {
		this.layer = BELOW_MOB_LAYER;
		user.pixel_x = -8;
		user.pixel_y = -4;
	} else if (this.dir === 4) {
		this.layer = ABOVE_MOB_LAYER;
		user.pixel_x = -14;
		user.pixel_y = 0;
	} else if (this.dir === 6) {
		this.layer = BELOW_MOB_LAYER;
		user.pixel_x = -8;
		user.pixel_y = 4;
	} else if (this.dir === 2) {
		this.layer = ABOVE_MOB_LAYER;
		user.pixel_x = 0;
		user.pixel_y = 14;
	} else if (this.dir === 10) {
		this.layer = BELOW_MOB_LAYER;
		user.pixel_x = 8;
		user.pixel_y = 4;
	} else if (this.dir === 8) {
		this.layer = ABOVE_MOB_LAYER;
		user.pixel_x = 14;
		user.pixel_y = 0;
	} else if (this.dir === 9) {
		this.layer = BELOW_MOB_LAYER;
		user.pixel_x = 8;
		user.pixel_y = -4;
	}
	return f.dot;
}, true);

// manned_turret.dm:128
rt.def("/obj/machinery/manned_turret/proc/checkfire", function* checkfire(f: Frame, targeted_atom: Value, user: Value) {
	this.target = targeted_atom;
	if (this.target == user || this.target == rt.getStep(f, this, 0)) {
		return f.dot;
	}
	if (rt.worldTime(f) < this.cooldown) {
		if (!this.warned && rt.worldTime(f) > this.cooldown - this.cooldown_duration + this.rate_of_fire * this.number_of_shots) {
			this.warned = 1;
			playsound(this, rt.rsc("sound/weapons/sear.ogg"), 100, 1);
		}
		return f.dot;
	} else {
		this.cooldown = rt.worldTime(f) + this.cooldown_duration;
		this.warned = 0;
		yield* this.volley(user);
	}
	return f.dot;
}, true);

// manned_turret.dm:142
rt.def("/obj/machinery/manned_turret/proc/volley", function* volley(f: Frame, user: Value) {
	let i: Value = null;
	let $e: any;
	this.target_turf = rt.getStep(f, this.target, 0);
	rt.forRange(f, 0, 1, this.number_of_shots, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/manned_turret/proc/fire_helper"), user)), i * this.rate_of_fire);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// manned_turret.dm:147
rt.def("/obj/machinery/manned_turret/proc/fire_helper", function* fire_helper(f: Frame, user: Value) {
	let _P: Value = null;
	yield* this.update_positioning();
	let targets_from: Value = rt.getStep(f, this, 0);
	if (!this.target || this.target.gc_destroyed) {
		this.target = this.target_turf;
	}
	(_P = (yield* new_(this.projectile_type, targets_from))).current = targets_from;
	_P.starting = targets_from;
	_P.firer = user;
	_P.original = this.target;
	playsound(this, rt.rsc("sound/weapons/gunshot_smg.ogg"), 75, 1);
	_P.xo = this.target.x - targets_from.x;
	_P.yo = this.target.y - targets_from.y;
	_P.Angle = rt.index(this.calculated_projectile_vars, 1) + rand(-9, 9);
	_P.p_x = rt.index(this.calculated_projectile_vars, 2);
	_P.p_y = rt.index(this.calculated_projectile_vars, 3);
	yield* _P.fire();
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

rt.type(10878, "/obj/machinery/manned_turret/ultimate", "/obj/machinery/manned_turret", {
	view_range: 12,
	projectile_type: rt.typePath("/obj/item/projectile/bullet/weakbullet3"),
	name: "Infinity Gun",
});

// manned_turret.dm:170
rt.def("/obj/machinery/manned_turret/ultimate/proc/checkfire", function* checkfire(f: Frame, targeted_atom: Value, user: Value) {
	this.target = targeted_atom;
	if (this.target == user || this.target == rt.getStep(f, this, 0)) {
		return f.dot;
	}
	this.target_turf = rt.getStep(f, this.target, 0);
	yield* this.fire_helper(user);
	return f.dot;
}, true);

rt.type(9873, "/obj/item/gun_control", "/obj/item", {
	turret: null,
	w_class: 5,
	flags: 16518,
	name: "turret controls",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "offhand",
	resistance_flags: 50,
});

// manned_turret.dm:186
rt.def("/obj/item/gun_control/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.turret = this.loc;
	if (rt.istype(this.turret, T("/obj/machinery/manned_turret"))) return f.dot;
	return 2;
}, true);

// manned_turret.dm:193
rt.def("/obj/item/gun_control/proc/Destroy", function* Destroy(f: Frame) {
	this.turret = null;
	yield* parent_proc();
	return f.dot;
}, true);

// manned_turret.dm:199
rt.def("/obj/item/gun_control/proc/attack_obj", function* attack_obj(f: Frame, O: Value, user: Value) {
	user.changeNext_move(8);
	yield* O.attacked_by(this, user);
	return f.dot;
}, true);

// manned_turret.dm:205
rt.def("/obj/item/gun_control/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	user.lastattacked = M;
	M.lastattacker = user;
	yield* M.attacked_by(this, user);
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// manned_turret.dm:209
rt.def("/obj/item/gun_control/proc/afterattack", function* afterattack(f: Frame, targeted_atom: Value, user: Value, flag: Value, params: Value) {
	let E: Value = null;
	yield* parent_proc();
	(E = user.buckled).calculated_projectile_vars = calculate_projectile_angle_and_pixel_offsets(user, params);
	yield* E.direction_track(user, targeted_atom);
	yield* E.checkfire(targeted_atom, user);
	return f.dot;
}, true);
