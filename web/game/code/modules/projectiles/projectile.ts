// Based on /tg/station's code/modules/projectiles/projectile.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


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

// projectile.dm:22
rt.def("/obj/item/projectile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.permutated = list();
	return f.dot;
});

// projectile.dm:59
rt.def("/obj/item/projectile/proc/New", function* New(f: Frame) {
	this.permutated = list();
	return (yield* parent_proc());
}, true);

// projectile.dm:63
rt.def("/obj/item/projectile/proc/Range", function* Range(f: Frame) {
	this.range--;
	if (!(this.range <= 0 && this.loc)) return f.dot;
	yield* this.on_range();
	return f.dot;
}, true);

// projectile.dm:68
rt.def("/obj/item/projectile/proc/on_range", function* on_range(f: Frame) {
	yield* qdel(this);
	return f.dot;
}, true);

// projectile.dm:76
rt.def("/mob/living/carbon/proc/check_limb_hit", function check_limb_hit(f: Frame, hit_zone: Value) {
	if (this.get_bodypart(hit_zone)) {
		return hit_zone;
	} else {
		return "chest";
	}
});

// projectile.dm:85
rt.def("/obj/item/projectile/proc/on_hit", function* on_hit(f: Frame, target: Value, blocked: Value) {
	let L: Value = null, splatter_dir: Value = null, organ_hit_text: Value = null, limb_hit: Value = null, volume: Value = null, reagent_note: Value = null, R: Value = null;
	blocked ??= 0;
	let target_loca: Value = rt.getStep(f, target, 0);
	if (!rt.istype(target, T("/mob/living"))) {
		if (this.impact_effect_type) {
			yield* new_(this.impact_effect_type, target_loca, target, this);
		}
		return 0;
	}
	if ((L = target).buckled && ismob(L.buckled)) {
		L = L.buckled;
	}
	if (blocked != 100) {
		if (this.damage && L.blood_volume && this.damage_type == "brute") {
			splatter_dir = this.dir;
			if (this.starting) {
				splatter_dir = rt.getDir(f, this.starting, target_loca);
			}
			if (rt.istype(L, T("/mob/living/carbon/alien"))) {
				yield* new_(T("/obj/effect/temp_visual/dir_setting/bloodsplatter/xenosplatter"), target_loca, splatter_dir);
			} else {
				yield* new_(T("/obj/effect/temp_visual/dir_setting/bloodsplatter"), target_loca, splatter_dir);
			}
			if (prob(33)) {
				yield* L.add_splatter_floor(target_loca);
			}
		} else if (this.impact_effect_type) {
			yield* new_(this.impact_effect_type, target_loca, target, this);
		}
		organ_hit_text = "";
		if (limb_hit = L.check_limb_hit(this.def_zone)) {
			organ_hit_text = fmt(" in ％！", [parse_zone(limb_hit)]);
		}
		if (this.suppressed) {
			playsound(this.loc, this.hitsound, 5, 1, -1);
			to_chat(L, fmt("<span class='userdanger'>You're shot by ＇！＀!</span>", [this, organ_hit_text]));
		} else {
			if (this.hitsound) {
				volume = this.vol_by_damage();
				playsound(this.loc, this.hitsound, volume, 1, -1);
			}
			L.visible_message(fmt("<span class='danger'>＀ is hit by ＇！＀!</span>", [L, this, organ_hit_text]), fmt("<span class='userdanger'>＀ is hit by ＇！＀!</span>", [L, this, organ_hit_text]), null, 3);
		}
		yield* L.on_hit(this);
	}
	if (this.reagents && this.reagents.reagent_list) {
		reagent_note = " REAGENTS:";
		for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
			reagent_note += R.id + " (";
			reagent_note += num2text(R.volume) + ") ";
		}
	}
	add_logs(this.firer, L, "shot", this, reagent_note);
	return (yield* L.apply_effects(this.stun, this.knockdown, this.unconscious, this.irradiate, this.slur, this.stutter, this.eyeblur, this.drowsy, blocked, this.stamina, this.jitter));
}, true);

// projectile.dm:133
rt.def("/obj/item/projectile/proc/vol_by_damage", function vol_by_damage(f: Frame) {
	if (this.damage) {
		return max(30, min(this.damage * 0.67, 100));
	}
	return 50;
});

// projectile.dm:139
rt.def("/obj/item/projectile/proc/Bump", function* Bump(f: Frame, A: Value, yes: Value) {
	let volume: Value = null, permutation: Value = null, mobs_list: Value = null, L: Value = null, picked_mob: Value = null;
	if (!yes) {
		return f.dot;
	}
	if (this.check_ricochet() && this.check_ricochet_flag(A) && this.ricochets < this.ricochets_max) {
		this.ricochets++;
		if (A.handle_ricochet(this)) {
			this.ignore_source_check = 1;
			return 0;
		}
	}
	if (this.firer && !this.ignore_source_check) {
		if (A == this.firer || A == this.firer.loc && rt.istype(A, T("/obj/mecha"))) {
			this.loc = A.loc;
			return 0;
		}
	}
	let distance: Value = get_dist(rt.getStep(f, A, 0), this.starting);
	this.def_zone = ran_zone(this.def_zone, max(100 - 7 * distance, 5));
	if (isturf(A) && this.hitsound_wall) {
		volume = max(0, min(this.vol_by_damage() + 20, 100));
		if (this.suppressed) {
			volume = 5;
		}
		playsound(this.loc, this.hitsound_wall, volume, 1, -1);
	}
	let target_turf: Value = rt.getStep(f, A, 0);
	if (!(yield* this.prehit(A))) {
		return 0;
	}
	if ((permutation = (yield* A.bullet_act(this, this.def_zone))) == -1 || this.forcedodge) {
		this.loc = target_turf;
		if (A) {
			this.permutated.Add(A);
		}
		return 0;
	} else if (A && A.density && !ismob(A) && !rt.bitAnd(A.flags, ON_BORDER)) {
		mobs_list = list();
		for (L of each(target_turf, T("/mob/living"))) {
			mobs_list += L;
		}
		if (rt.len(f, mobs_list)) {
			if (!(yield* this.prehit((picked_mob = pick(mobs_list))))) {
				return 0;
			}
			yield* picked_mob.bullet_act(this, this.def_zone);
		}
	}
	yield* qdel(this);
	return 1;
}, true);

// projectile.dm:184
rt.def("/obj/item/projectile/proc/check_ricochet", function check_ricochet(f: Frame) {
	if (prob(this.ricochet_chance)) {
		return 1;
	}
	return 0;
});

// projectile.dm:189
rt.def("/obj/item/projectile/proc/check_ricochet_flag", function check_ricochet_flag(f: Frame, A: Value) {
	if (rt.bitAnd(A.flags, CHECK_RICOCHET)) {
		return 1;
	}
	return 0;
});

// projectile.dm:197
rt.def("/obj/item/projectile/proc/fire", function* fire(f: Frame, setAngle: Value, direct_target: Value) {
	let next_run: Value = null, M: Value = null, Pixel_x: Value = null, Pixel_y: Value = null, pixel_x_offset: Value = null, pixel_y_offset: Value = null, new_x: Value = null, new_y: Value = null, delay: Value = null;
	if (!this.log_override && this.firer && this.original) {
		add_logs(this.firer, this.original, "fired at", this, ` ${get_area(this)}`);
	}
	if (direct_target) {
		yield* this.prehit(direct_target);
		yield* direct_target.bullet_act(this, this.def_zone);
		yield* qdel(this);
		return f.dot;
	}
	if (setAngle) {
		this.Angle = setAngle;
	}
	let old_pixel_x: Value = this.pixel_x;
	let old_pixel_y: Value = this.pixel_y;
	if (!this.legacy) {
		next_run = rt.worldTime(f);
		while (this.loc) {
			if (this.paused) {
				next_run = rt.worldTime(f);
				yield* sleep(1);
				continue;
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
			Pixel_x = round(rt.op(f, "Sin", [], [this.Angle]) + 16 * rt.op(f, "Sin", [], [this.Angle]) * 2, 1);
			Pixel_y = round(rt.op(f, "Cos", [], [this.Angle]) + 16 * rt.op(f, "Cos", [], [this.Angle]) * 2, 1);
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
			if (delay > 0) {
				yield* sleep(delay);
			}
		}
	} else {
		while (this.loc) {
			if (!this.paused) {
				if (!this.current || this.loc == this.current) {
					this.current = rt.locate(max(1, min(this.x + this.xo, rt.world().maxx)), max(1, min(this.y + this.yo, rt.world().maxy)), this.z);
				}
				yield* step_towards(this, this.current);
				if (this.original && this.original.layer >= 2.75 || ismob(this.original)) {
					if (this.loc == rt.getStep(f, this.original, 0)) {
						if (!rt.isIn(f, this.original, this.permutated)) {
							yield* this.Bump(this.original, 1);
						}
					}
				}
				yield* this.Range();
			}
			yield* sleep(GLOB.config.run_speed * 0.9);
		}
	}
	return f.dot;
}, true, { waitfor: false });

// projectile.dm:288
rt.def("/obj/item/projectile/proc/preparePixelProjectile", function* preparePixelProjectile(f: Frame, target: Value, targloc: Value, user: Value, params: Value, spread: Value) {
	let calculated: Value = null;
	let curloc: Value = rt.getStep(f, user, 0);
	yield* this.forceMove(rt.getStep(f, user, 0));
	this.starting = rt.getStep(f, user, 0);
	this.current = curloc;
	this.yo = targloc.y - curloc.y;
	this.xo = targloc.x - curloc.x;
	this.Angle = rt.index((calculated = calculate_projectile_angle_and_pixel_offsets(user, params)), 1);
	this.p_x = rt.index(calculated, 2);
	this.p_y = rt.index(calculated, 3);
	if (!spread) return f.dot;
	rt.modField(f, this, "Angle", spread, add);
	return f.dot;
}, true);

// projectile.dm:304
rt.def("/proc/calculate_projectile_angle_and_pixel_offsets", function calculate_projectile_angle_and_pixel_offsets(f: Frame, user: Value, params: Value) {
	let screen_loc_params: Value = null, screen_loc_X: Value = null, screen_loc_Y: Value = null, x: Value = null, y: Value = null, screenview: Value = null, ox: Value = null, oy: Value = null;
	let mouse_control: Value = params2list(params);
	let p_x: Value = 0;
	let p_y: Value = 0;
	let angle: Value = 0;
	if (rt.at(mouse_control, "icon-x")) {
		p_x = text2num(rt.at(mouse_control, "icon-x"));
	}
	if (rt.at(mouse_control, "icon-y")) {
		p_y = text2num(rt.at(mouse_control, "icon-y"));
	}
	if (rt.at(mouse_control, "screen-loc")) {
		screen_loc_params = splittext(rt.at(mouse_control, "screen-loc"), ",");
		screen_loc_X = splittext(rt.index(screen_loc_params, 1), ":");
		screen_loc_Y = splittext(rt.index(screen_loc_params, 2), ":");
		x = text2num(rt.index(screen_loc_X, 1)) * 32 + text2num(rt.index(screen_loc_X, 2)) - 32;
		y = text2num(rt.index(screen_loc_Y, 1)) * 32 + text2num(rt.index(screen_loc_Y, 2)) - 32;
		screenview = getviewsize(user.client.view);
		ox = round(rt.index(screenview, 1) * rt.world().icon_size / 2) - user.client.pixel_x;
		oy = round(rt.index(screenview, 2) * rt.world().icon_size / 2) - user.client.pixel_y;
		angle = Atan2(y - oy, x - ox);
	}
	return list(angle, p_x, p_y);
});

// projectile.dm:336
rt.def("/obj/item/projectile/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	yield* parent_proc();
	if (!(rt.istype(AM, T("/mob/living")) && AM.density && !this.checkpass(16))) return f.dot;
	yield* this.Bump(AM, 1);
	return f.dot;
}, true);

// projectile.dm:341
rt.def("/obj/item/projectile/proc/Destroy", function* Destroy(f: Frame) {
	return (yield* parent_proc());
}, true);
