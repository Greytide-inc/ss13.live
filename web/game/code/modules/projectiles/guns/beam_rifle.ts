// Based on /tg/station's code/modules/projectiles/guns/beam_rifle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5165, "/obj/item/weapon/gun/energy/beam_rifle", "/obj/item/weapon/gun/energy", {
	hipfire_inaccuracy: 2,
	hipfire_recoil: 10,
	scoped_inaccuracy: 0,
	scoped_recoil: 3,
	scoped: 0,
	noscope: 0,
	aiming: 0,
	aiming_time: 7,
	aiming_time_fire_threshold: 2,
	aiming_time_left: 7,
	aiming_time_increase_user_movement: 3,
	scoped_slow: 1,
	aiming_time_increase_angle_multiplier: 0.6,
	lastangle: 0,
	current_user: null,
	current_tracers: null,
	structure_piercing: 2,
	structure_bleed_coeff: 0.7,
	wall_pierce_amount: 0,
	wall_devastate: 0,
	aoe_structure_range: 1,
	aoe_structure_damage: 50,
	aoe_fire_range: 2,
	aoe_fire_chance: 40,
	aoe_mob_range: 1,
	aoe_mob_damage: 30,
	impact_structure_damage: 60,
	projectile_damage: 30,
	projectile_stun: 0,
	projectile_setting_pierce: 1,
	delay: 65,
	lastfire: 0,
	canMouseDown: 1,
	name: "particle acceleration rifle",
	desc: "An energy-based anti material marksman rifle that uses highly charged particle beams moving at extreme velocities to decimate whatever is unfortunate enough to be targetted by one. <span class='boldnotice'>Hold down left click while scoped to aim, when weapon is fully aimed (Tracer goes from red to green as it charges), release to fire. Moving while aiming or changing where you're pointing at while aiming will delay the aiming process depending on how much you changed.</span>",
	icon: rt.rsc("icons/obj/guns/energy.dmi"),
	icon_state: "esniper",
	item_state: "esniper",
	fire_sound: rt.rsc("sound/weapons/beam_sniper.ogg"),
	slot_flags: 1024,
	force: 15,
	materials: null,
	origin_tech: "",
	recoil: 5,
	ammo_x_offset: 3,
	ammo_y_offset: 3,
	modifystate: 0,
	zoomable: 1,
	zoom_amt: 17,
	zoom_out_amt: 20,
	weapon_weight: 3,
	w_class: 4,
	ammo_type: null,
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell/beam_rifle"),
	pin: null,
}, { global: { charged_overlay: 1047, drained_overlay: 1048 } });

// beam_rifle.dm:44
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.current_tracers = list();

	this.materials = list();

	this.ammo_type = list(T("/obj/item/ammo_casing/energy/beam_rifle/hitscan"));
	return f.dot;
});

// beam_rifle.dm:78
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	let primary_ammo: Value = rt.index(this.ammo_type, 1);
	if (this.cell.charge > primary_ammo.e_cost) {
		this.add_overlay(GLOB.charged_overlay);
	} else {
		this.add_overlay(GLOB.drained_overlay);
	}
	return f.dot;
});

// beam_rifle.dm:86
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $2: any;
	this.projectile_setting_pierce = (!this.projectile_setting_pierce ? 1 : 0);
	let $0: any = user;
	let $1: any = this;
	if (this.projectile_setting_pierce) {

		$2 = "pierce";
	} else {
		$2 = "impact";
	}
	to_chat($0, fmt("<span class='boldnotice'>You set ％！ to ＀ mode.</span>", [$1, $2]));
	return f.dot;
});

// beam_rifle.dm:91
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/update_slowdown", function update_slowdown(f: Frame) {
	if (this.scoped) {
		this.slowdown = this.scoped_slow;
	} else {
		this.slowdown = rt.initial(f, this, "slowdown");
	}
	return f.dot;
});

// beam_rifle.dm:96
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSfastprocess.processing += this;
	return f.dot;
}, true);

// beam_rifle.dm:100
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	yield* parent_proc();
	return f.dot;
}, true);

// beam_rifle.dm:104
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/zoom", function* zoom(f: Frame, user: Value, forced_zoom: Value) {
	f.dot = (yield* parent_proc());
	this.scope(user, f.dot);
	return f.dot;
}, true);

// beam_rifle.dm:109
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/scope", function scope(f: Frame, user: Value, forced: Value) {
	let scoping: Value = null;
	if (forced === 1) {
		scoping = 1;
	} else if (forced === 0) {
		scoping = 0;
	} else {
		scoping = (!this.scoped ? 1 : 0);
	}
	if (scoping) {
		this.spread = this.scoped_inaccuracy;
		this.recoil = this.scoped_recoil;
		this.scoped = 1;
		rt.op(f, "Output", [], [user, `<span class='boldnotice'>You bring your ${this} up and use its scope...</span>`], false);
	} else {
		this.spread = this.hipfire_inaccuracy;
		this.recoil = this.hipfire_recoil;
		this.scoped = 0;
		rt.op(f, "Output", [], [user, `<span class='boldnotice'>You lower your ${this}.</span>`], false);
	}
	this.update_slowdown();
	return f.dot;
});

// beam_rifle.dm:129
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/can_trigger_gun", function* can_trigger_gun(f: Frame, user: Value) {
	if (!this.scoped && !this.noscope) {
		rt.op(f, "Output", [], [user, "<span class='userdanger'>This beam rifle can only be used while scoped!</span>"], false);
		return 0;
	}
	f.dot = (yield* parent_proc(user));
	return f.dot;
}, true);

// beam_rifle.dm:136
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	this.chambered = null;
	yield* this.recharge_newshot();
	return f.dot;
}, true);

// beam_rifle.dm:139
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/aiming_beam", function* aiming_beam(f: Frame) {
	let A: Value = null, _T: Value = null, _P: Value = null, percent: Value = null;
	if (!rt.istype((A = this.current_user.client.mouseObject), T("/atom")) || !A.loc) {
		return f.dot;
	}
	if (!rt.istype((_T = rt.getStep(f, this.current_user.client.mouseObject, 0)), T("/turf"))) {
		return f.dot;
	}
	(_P = (yield* new_(T("/obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam")))).gun = this;
	_P.wall_pierce_amount = this.wall_pierce_amount;
	_P.structure_pierce_amount = this.structure_piercing;
	_P.do_pierce = this.projectile_setting_pierce;
	yield* _P.preparePixelProjectile(this.current_user.client.mouseObject, _T, this.current_user, this.current_user.client.mouseParams, 0);
	if (this.aiming_time) {
		percent = 100 / this.aiming_time * this.aiming_time_left;
		_P.color = rt.op(f, "Rgb", [1, 3], [255 * percent, 255 * ((100 - percent) / 100), 0]);
	} else {
		_P.color = "#00ff00";
	}
	yield* this.clear_tracers();
	yield* _P.fire();
	return f.dot;
}, true);

// beam_rifle.dm:160
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/clear_tracers", function* clear_tracers(f: Frame) {
	let I: Value = null, PB: Value = null;
	for (I of each(this.current_tracers)) {
		this.current_tracers -= I;
		yield* qdel((PB = I));
	}
	return f.dot;
}, true);

// beam_rifle.dm:166
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/terminate_aiming", function* terminate_aiming(f: Frame) {
	this.stop_aiming();
	yield* this.clear_tracers();
	return f.dot;
}, true);

// beam_rifle.dm:170
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/process", function* process(f: Frame) {
	if (!this.aiming) {
		return f.dot;
	}
	if (!rt.istype(this.current_user, T("/mob")) || !isturf(this.current_user.loc) || !rt.isIn(f, this, this.current_user.held_items) || this.current_user.incapacitated()) {
		yield* this.terminate_aiming();
		return f.dot;
	}
	if (this.aiming_time_left > 0) {
		this.aiming_time_left--;
	}
	yield* this.aiming_beam();
	yield* this.process_aim();
	return f.dot;
}, true, { waitfor: false });

// beam_rifle.dm:181
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/process_aim", function* process_aim(f: Frame) {
	let difference: Value = null;
	let $0: any;
	if (!this.current_user.client.mouseParams) return f.dot;
	let mouse_control: Value = params2list(this.current_user.client.mouseParams);
	if (isturf(this.current_user.client.mouseLocation)) {
		yield* this.current_user.face_atom(this.current_user.client.mouseLocation);
	}
	if (!rt.at(mouse_control, "screen-loc")) return f.dot;
	let screen_loc_params: Value = splittext(rt.at(mouse_control, "screen-loc"), ",");
	let screen_loc_X: Value = splittext(rt.index(screen_loc_params, 1), ":");
	let screen_loc_Y: Value = splittext(rt.index(screen_loc_params, 2), ":");
	let x: Value = text2num(rt.index(screen_loc_X, 1)) * 32 + text2num(rt.index(screen_loc_X, 2)) - 32;
	let y: Value = text2num(rt.index(screen_loc_Y, 1)) * 32 + text2num(rt.index(screen_loc_Y, 2)) - 32;
	let screenview: Value = getviewsize(this.current_user.client.view);
	let ox: Value = round(rt.index(screenview, 1) * rt.world().icon_size / 2) - this.current_user.client.pixel_x;
	let oy: Value = round(rt.index(screenview, 2) * rt.world().icon_size / 2) - this.current_user.client.pixel_y;
	if (Atan2(y - oy, x - ox) % 360 + (Atan2(y - oy, x - ox) - round(Atan2(y - oy, x - ox), 1)) > 0) {
		$0 = Atan2(y - oy, x - ox) % 360 + (Atan2(y - oy, x - ox) - round(Atan2(y - oy, x - ox), 1));
	} else {
		$0 = Atan2(y - oy, x - ox) % 360 + (Atan2(y - oy, x - ox) - round(Atan2(y - oy, x - ox), 1)) + 360;
	}
	let angle: Value = $0;
	this.delay_penalty((difference = rt.op(f, "Abs", [], [this.lastangle - angle])) * this.aiming_time_increase_angle_multiplier);
	this.lastangle = angle;
	return f.dot;
}, true);

// beam_rifle.dm:200
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/on_mob_move", function on_mob_move(f: Frame) {
	this.delay_penalty(this.aiming_time_increase_user_movement);
	return f.dot;
});

// beam_rifle.dm:203
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/start_aiming", function start_aiming(f: Frame) {
	this.aiming_time_left = this.aiming_time;
	this.aiming = 1;
	return f.dot;
});

// beam_rifle.dm:207
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/stop_aiming", function stop_aiming(f: Frame) {
	this.aiming_time_left = this.aiming_time;
	this.aiming = 0;
	return f.dot;
});

// beam_rifle.dm:211
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/onMouseDrag", function onMouseDrag(f: Frame, src_object: Value, over_object: Value, src_location: Value, over_location: Value, params: Value, mob: Value) {
	this.current_user = mob;
	return f.dot;
});

// beam_rifle.dm:214
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/onMouseDown", function onMouseDown(f: Frame, object: Value, location: Value, params: Value, mob: Value) {
	this.start_aiming();
	this.current_user = mob;
	return f.dot;
});

// beam_rifle.dm:218
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/onMouseUp", function* onMouseUp(f: Frame, object: Value, location: Value, params: Value, M: Value) {
	yield* this.process_aim();
	if (this.aiming_time_left <= this.aiming_time_fire_threshold) {
		this.sync_ammo();
		yield* this.afterattack(M.client.mouseObject, M, 0, M.client.mouseParams, { passthrough: 1 });
	}
	this.stop_aiming();
	yield* this.clear_tracers();
	return f.dot;
}, true);

// beam_rifle.dm:226
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/afterattack", function* afterattack(f: Frame) {
	if (f.args[4] === null) {
		f.args[4] = 0;
	}
	if (!f.args[4] && this.aiming_time > this.aiming_time_fire_threshold) {
		return f.dot;
	}
	if (this.lastfire > rt.worldTime(f) + this.delay) {
		return f.dot;
	}
	this.lastfire = rt.worldTime(f);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["target", "user", "flag", "params", "passthrough"] });

// beam_rifle.dm:234
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/sync_ammo", function sync_ammo(f: Frame) {
	let AC: Value = null;
	for (AC of each(this.contents, T("/obj/item/ammo_casing/energy/beam_rifle"))) {
		AC.sync_stats();
	}
	return f.dot;
});

// beam_rifle.dm:238
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/delay_penalty", function delay_penalty(f: Frame, amount: Value) {
	this.aiming_time_left = max(0, min(this.aiming_time_left + amount, this.aiming_time));
	return f.dot;
});

rt.type(8731, "/obj/item/ammo_casing/energy/beam_rifle", "/obj/item/ammo_casing/energy", {
	wall_pierce_amount: 0,
	wall_devastate: 0,
	aoe_structure_range: 1,
	aoe_structure_damage: 30,
	aoe_fire_range: 2,
	aoe_fire_chance: 66,
	aoe_mob_range: 1,
	aoe_mob_damage: 20,
	impact_structure_damage: 50,
	projectile_damage: 40,
	projectile_stun: 0,
	structure_piercing: 2,
	structure_bleed_coeff: 0.7,
	do_pierce: 1,
	host: null,
	name: "particle acceleration lens",
	desc: "Don't look into barrel!",
});

// beam_rifle.dm:260
rt.def("/obj/item/ammo_casing/energy/beam_rifle/proc/sync_stats", function sync_stats(f: Frame) {
	let BR: Value = null;
	if (!rt.istype((BR = this.loc), T("/obj/item/weapon/gun/energy/beam_rifle"))) {
		stack_trace("Beam rifle syncing error");
	}
	this.host = BR;
	this.do_pierce = BR.projectile_setting_pierce;
	this.wall_pierce_amount = BR.wall_pierce_amount;
	this.wall_devastate = BR.wall_devastate;
	this.aoe_structure_range = BR.aoe_structure_range;
	this.aoe_structure_damage = BR.aoe_structure_damage;
	this.aoe_fire_range = BR.aoe_fire_range;
	this.aoe_fire_chance = BR.aoe_fire_chance;
	this.aoe_mob_range = BR.aoe_mob_range;
	this.aoe_mob_damage = BR.aoe_mob_damage;
	this.impact_structure_damage = BR.impact_structure_damage;
	this.projectile_damage = BR.projectile_damage;
	this.projectile_stun = BR.projectile_stun;
	this.delay = BR.delay;
	this.structure_piercing = BR.structure_piercing;
	this.structure_bleed_coeff = BR.structure_bleed_coeff;
	return f.dot;
});

// beam_rifle.dm:281
rt.def("/obj/item/ammo_casing/energy/beam_rifle/proc/ready_proj", function* ready_proj(f: Frame, target: Value, user: Value, quiet: Value, zone_override: Value) {
	let HS_BB: Value = null;
	f.dot = (yield* parent_proc(target, user, quiet, zone_override));
	if (!rt.istype((HS_BB = this.BB), T("/obj/item/projectile/beam/beam_rifle/hitscan"))) {
		return f.dot;
	}
	HS_BB.impact_direct_damage = this.projectile_damage;
	HS_BB.stun = this.projectile_stun;
	HS_BB.impact_structure_damage = this.impact_structure_damage;
	HS_BB.aoe_mob_damage = this.aoe_mob_damage;
	HS_BB.aoe_mob_range = max(0, min(this.aoe_mob_range, 15));
	HS_BB.aoe_fire_chance = this.aoe_fire_chance;
	HS_BB.aoe_fire_range = this.aoe_fire_range;
	HS_BB.aoe_structure_damage = this.aoe_structure_damage;
	HS_BB.aoe_structure_range = max(0, min(this.aoe_structure_range, 15));
	HS_BB.wall_devastate = this.wall_devastate;
	HS_BB.wall_pierce_amount = this.wall_pierce_amount;
	HS_BB.structure_pierce_amount = this.structure_piercing;
	HS_BB.structure_bleed_coeff = this.structure_bleed_coeff;
	HS_BB.do_pierce = this.do_pierce;
	HS_BB.gun = this.host;
	return f.dot;
}, true);

rt.type(8866, "/obj/item/projectile/beam/beam_rifle", "/obj/item/projectile/beam", {
	gun: null,
	structure_pierce_amount: 0,
	structure_bleed_coeff: 0,
	structure_pierce: 0,
	do_pierce: 1,
	wall_pierce_amount: 0,
	wall_pierce: 0,
	wall_devastate: 0,
	aoe_structure_range: 0,
	aoe_structure_damage: 0,
	aoe_fire_range: 0,
	aoe_fire_chance: 0,
	aoe_mob_range: 0,
	aoe_mob_damage: 0,
	impact_structure_damage: 0,
	impact_direct_damage: 0,
	cached: null,
	name: "particle beam",
	icon: "",
	hitsound: rt.rsc("sound/effects/explosion3.ogg"),
	damage: 0,
	damage_type: "fire",
	flag: "energy",
	range: 150,
	jitter: 10,
});

// beam_rifle.dm:336
rt.def("/obj/item/projectile/beam/beam_rifle/proc/AOE", function* AOE(f: Frame, epicenter: Value) {
	let L: Value = null, _T: Value = null, O: Value = null;
	if (!epicenter) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/explosion/fast"), epicenter);
	for (L of each(range(this.aoe_mob_range, epicenter), T("/mob/living"))) {
		yield* L.adjustFireLoss(this.aoe_mob_damage);
		to_chat(L, fmt("<span class='userdanger'>＄！ sears you!</span>", [this]));
	}
	for (_T of each(range(this.aoe_fire_range, epicenter), T("/turf"))) {
		if (prob(this.aoe_fire_chance)) {
			yield* new_(T("/obj/effect/hotspot"), _T);
		}
	}
	for (O of each(range(this.aoe_structure_range, epicenter), T("/obj"))) {
		if (!rt.istype(O, T("/obj/item"))) {
			if (O.level == 1) {
				continue;
			}
			yield* O.take_damage(this.aoe_structure_damage * this.get_damage_coeff(O), "fire", "laser", 0);
		}
	}
	return f.dot;
}, true, { waitfor: false });

// beam_rifle.dm:352
rt.def("/obj/item/projectile/beam/beam_rifle/proc/check_pierce", function* check_pierce(f: Frame, target: Value) {
	let AM: Value = null, O: Value = null;
	if (!this.do_pierce) {
		return 0;
	}
	if (rt.istype(target, T("/turf/closed"))) {
		if (this.wall_pierce++ < this.wall_pierce_amount) {
			this.loc = target;
			if (prob(this.wall_devastate)) {
				yield* target.ex_act(2);
			}
			return 1;
		}
	}
	if (rt.istype(target, T("/atom/movable"))) {
		if ((AM = target).density && !(yield* AM.CanPass(this, rt.getStep(f, target, 0))) && !ismob(AM)) {
			if (this.structure_pierce++ < this.structure_pierce_amount) {
				if (rt.istype(AM, T("/obj"))) {
					yield* (O = AM).take_damage((this.impact_structure_damage + this.aoe_structure_damage) * this.structure_bleed_coeff * this.get_damage_coeff(AM), "fire", "energy", 0);
				}
				this.loc = rt.getStep(f, AM, 0);
				return 1;
			}
		}
	}
	return 0;
}, true);

// beam_rifle.dm:372
rt.def("/obj/item/projectile/beam/beam_rifle/proc/get_damage_coeff", function get_damage_coeff(f: Frame, target: Value) {
	if (rt.istype(target, T("/obj/machinery/door"))) {
		return 0.4;
	}
	if (rt.istype(target, T("/obj/structure/window"))) {
		return 0.5;
	}
	return 1;
});

// beam_rifle.dm:379
rt.def("/obj/item/projectile/beam/beam_rifle/proc/handle_impact", function* handle_impact(f: Frame, target: Value) {
	let O: Value = null, L: Value = null;
	if (rt.istype(target, T("/obj"))) {
		yield* (O = target).take_damage(this.impact_structure_damage * this.get_damage_coeff(target), "fire", "laser", 0);
	}
	if (!rt.istype(target, T("/mob/living"))) return f.dot;
	yield* (L = target).adjustFireLoss(this.impact_direct_damage);
	yield* L.emote("scream");
	return f.dot;
}, true);

// beam_rifle.dm:389
rt.def("/obj/item/projectile/beam/beam_rifle/proc/handle_hit", function* handle_hit(f: Frame, target: Value) {
	if (!this.cached && !(!target || target.gc_destroyed)) {
		this.cached = rt.getStep(f, target, 0);
	}
	if (this.nodamage) {
		return 0;
	}
	playsound(this.cached, rt.rsc("sound/effects/explosion3.ogg"), 100, 1);
	yield* this.AOE(this.cached);
	if (!target || target.gc_destroyed) return f.dot;
	yield* this.handle_impact(target);
	return f.dot;
}, true, { waitfor: false });

// beam_rifle.dm:399
rt.def("/obj/item/projectile/beam/beam_rifle/proc/Bump", function* Bump(f: Frame, target: Value, yes: Value) {
	if (yield* this.check_pierce(target)) {
		this.permutated += target;
		return 0;
	}
	if (!(!target || target.gc_destroyed)) {
		this.cached = rt.getStep(f, target, 0);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// beam_rifle.dm:407
rt.def("/obj/item/projectile/beam/beam_rifle/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!(!f.args[0] || f.args[0].gc_destroyed)) {
		this.cached = rt.getStep(f, f.args[0], 0);
	}
	yield* this.handle_hit(f.args[0]);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8867, "/obj/item/projectile/beam/beam_rifle/hitscan", "/obj/item/projectile/beam/beam_rifle", {
	tracer_type: rt.typePath("/obj/effect/temp_visual/projectile_beam/tracer"),
	icon_state: "",
});

// beam_rifle.dm:418
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/proc/fire", function* fire(f: Frame, setAngle: Value, direct_target: Value) {
	let M: Value = null, Pixel_x: Value = null, Pixel_y: Value = null, pixel_x_offset: Value = null, pixel_y_offset: Value = null, new_x: Value = null, new_y: Value = null, delay: Value = null;
	if (!this.log_override && this.firer && this.original) {
		add_logs(this.firer, this.original, "fired at", this, ` ${get_area(this)}`);
	}
	if (setAngle) {
		this.Angle = setAngle;
	}
	let next_run: Value = rt.worldTime(f);
	let old_pixel_x: Value = this.pixel_x;
	let old_pixel_y: Value = this.pixel_y;
	let safety: Value = 0;
	while (this.loc) {
		if (++safety > this.range * 3) {
			return f.dot;
		}
		if (!this.current || this.loc == this.current) {
			this.current = rt.locate(max(1, min(this.x + this.xo, rt.world().maxx)), max(1, min(this.y + this.yo, rt.world().maxy)), this.z);
		}
		if (!this.Angle) {
			this.Angle = round(Get_Angle(this, this.current));
		}
		if (this.spread) {
			this.Angle += (rand() - 0.5) * this.spread;
		}
		(M = (yield* new_(T("/matrix")))).Turn(this.Angle);
		this.transform = M;
		Pixel_x = rt.op(f, "Sin", [], [this.Angle]) + 16 * rt.op(f, "Sin", [], [this.Angle]) * 2;
		Pixel_y = rt.op(f, "Cos", [], [this.Angle]) + 16 * rt.op(f, "Cos", [], [this.Angle]) * 2;
		pixel_x_offset = old_pixel_x + Pixel_x;
		pixel_y_offset = old_pixel_y + Pixel_y;
		new_x = this.x;
		new_y = this.y;
		while (pixel_x_offset > 16) {
			pixel_x_offset -= 32;
			old_pixel_x -= 32;
			new_x++;
		}
		while (pixel_x_offset < -16) {
			pixel_x_offset += 32;
			old_pixel_x += 32;
			new_x--;
		}
		while (pixel_y_offset > 16) {
			pixel_y_offset -= 32;
			old_pixel_y -= 32;
			new_y++;
		}
		while (pixel_y_offset < -16) {
			pixel_y_offset += 32;
			old_pixel_y += 32;
			new_y--;
		}
		this.pixel_x = old_pixel_x;
		this.pixel_y = old_pixel_y;
		yield* step_towards(this, rt.locate(new_x, new_y, this.z));
		next_run += max(rt.world().tick_lag, this.speed);
		if ((delay = next_run - rt.worldTime(f)) <= rt.world().tick_lag * 2) {
			this.pixel_x = pixel_x_offset;
			this.pixel_y = pixel_y_offset;
		} else {
			rt.op(f, "Animate", [2, 10], [null, this, "pixel_x", pixel_x_offset, "pixel_y", pixel_y_offset, "time", max(1, delay <= 3 ? delay - 1 : delay), "flags", 1]);
		}
		old_pixel_x = pixel_x_offset;
		old_pixel_y = pixel_y_offset;
		if (this.original && this.original.layer >= 2.75 || ismob(this.original)) {
			if (this.loc == rt.getStep(f, this.original, 0)) {
				if (!rt.isIn(f, this.original, this.permutated)) {
					yield* this.Bump(this.original, 1);
				}
			}
		}
		yield* this.Range();
	}
	return f.dot;
}, true, { waitfor: false });

// beam_rifle.dm:479
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/proc/Range", function* Range(f: Frame) {
	yield* this.spawn_tracer_effect();
	if (!(!(!this || this.gc_destroyed) && this.loc)) return f.dot;
	this.cached = rt.getStep(f, this, 0);
	return f.dot;
}, true);

// beam_rifle.dm:484
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/proc/spawn_tracer_effect", function* spawn_tracer_effect(f: Frame) {
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), (yield* new_(this.tracer_type, this.loc, { time: 5, angle_override: this.Angle, p_x: this.pixel_x, p_y: this.pixel_y, color_override: this.color })))), 5, 8);
	return f.dot;
}, true);

rt.type(8868, "/obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam", "/obj/item/projectile/beam/beam_rifle/hitscan", {
	tracer_type: rt.typePath("/obj/effect/temp_visual/projectile_beam/tracer/aiming"),
	name: "aiming beam",
	hitsound: null,
	hitsound_wall: null,
	nodamage: 1,
	damage: 0,
});

// beam_rifle.dm:495
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam/proc/prehit", function* prehit(f: Frame, target: Value) {
	yield* qdel(this);
	return 0;
}, true);

// beam_rifle.dm:499
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam/proc/on_hit", function* on_hit(f: Frame) {
	yield* qdel(this);
	return 0;
}, true);

// beam_rifle.dm:503
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam/proc/spawn_tracer_effect", function* spawn_tracer_effect(f: Frame) {
	let _T: Value = (yield* new_(this.tracer_type, this.loc, { time: 5, angle_override: this.Angle, p_x: this.pixel_x, p_y: this.pixel_y, color_override: this.color }));
	if (!(rt.istype(this.gun, T("/obj/item/weapon/gun/energy/beam_rifle")) && rt.istype(_T, T("/obj/effect/temp_visual/projectile_beam")))) return f.dot;
	rt.setAt(this.gun.current_tracers, _T, 1);
	return f.dot;
}, true);

rt.type(11691, "/obj/effect/temp_visual/projectile_beam", "/obj/effect/temp_visual", {
	anchored: 1,
	duration: 5,
	randomdir: 0,
	light_power: 1,
	light_range: 2,
	light_color: "#00ffff",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	layer: 4.1,
});

// beam_rifle.dm:518
rt.def("/obj/effect/temp_visual/projectile_beam/proc/New", function* New(f: Frame) {
	let look: Value = null, M: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 5;
	}
	this.duration = f.args[0];
	(look = (yield* new_(T("/mutable_appearance"), this))).pixel_x = f.args[2];
	look.pixel_y = f.args[3];
	if (f.args[4]) {
		look.color = f.args[4];
	}
	(M = (yield* new_(T("/matrix")))).Turn(f.args[1]);
	look.transform = M;
	this.appearance = look;
	yield* parent_proc();
	return f.dot;
}, true, { args: ["time", "angle_override", "p_x", "p_y", "color_override"] });
