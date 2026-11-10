// Based on /tg/station's code/modules/projectiles/gun.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5110, "/obj/item/weapon/gun", "/obj/item/weapon", {
	automatic: 0,
	fire_sound: "gunshot",
	suppressed: 0,
	can_suppress: 0,
	can_unsuppress: 1,
	recoil: 0,
	clumsy_check: 1,
	chambered: null,
	trigger_guard: 1,
	sawn_desc: null,
	sawn_state: 0,
	burst_size: 1,
	fire_delay: 0,
	firing_burst: 0,
	semicd: 0,
	weapon_weight: 1,
	spread: 0,
	randomspread: 1,
	gun_light: null,
	can_flashlight: 0,
	bayonet: null,
	can_bayonet: 0,
	alight: null,
	upgrades: null,
	ammo_x_offset: 0,
	ammo_y_offset: 0,
	flight_x_offset: 0,
	flight_y_offset: 0,
	knife_x_offset: 0,
	knife_y_offset: 0,
	zoomable: 0,
	zoomed: 0,
	zoom_amt: 3,
	zoom_out_amt: 0,
	azoom: null,
	pin: rt.typePath("/obj/item/device/firing_pin"),
	flags: 64,
	throw_speed: 3,
	throw_range: 5,
	name: "gun",
	desc: "It's a gun. It's pretty terrible, though.",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "detective",
	item_state: "gun",
	slot_flags: 512,
	materials: null,
	w_class: 3,
	throwforce: 5,
	force: 5,
	origin_tech: "combat=1",
	needs_permit: 1,
	unique_rename: 0,
	attack_verb: null,
	lefthand_file: rt.rsc("icons/mob/inhands/guns_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/guns_righthand.dmi"),
});

// gun.dm:52
rt.def("/obj/item/weapon/gun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.upgrades = list();
	this.materials = rt.alist(f, ["$metal", 2000]);
	this.attack_verb = list("struck", "hit", "bashed");
	return f.dot;
});

// gun.dm:69
rt.def("/obj/item/weapon/gun/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.pin) {
		this.pin = (yield* new_(this.pin, this));
	}
	if (this.gun_light) {
		this.alight = (yield* new_(T("/datum/action/item_action/toggle_gunlight"), this));
	}
	yield* this.build_zooming();
	return f.dot;
}, true);

// gun.dm:78
rt.def("/obj/item/weapon/gun/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value) {
	let G: Value = null;
	yield* parent_proc();
	if (!(G = rt.locateIn(f, T("/obj/item/weapon/gun"), this.contents))) return f.dot;
	G.loc = this.loc;
	yield* qdel(G.pin);
	G.pin = null;
	this.visible_message(`${G} can now fit a new pin, but the old one was destroyed in the process.`, null, null, 3);
	yield* qdel(this);
	return f.dot;
}, true);

// gun.dm:88
rt.def("/obj/item/weapon/gun/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.pin) {
		to_chat(user, `It has ${this.pin} installed.`);
	} else {
		to_chat(user, "It doesn't have a firing pin installed, and won't fire.");
	}
	return f.dot;
}, false);

// gun.dm:106
rt.def("/obj/item/weapon/gun/proc/shoot_with_empty_chamber", function shoot_with_empty_chamber(f: Frame, user: Value) {
	to_chat(user, "<span class='danger'>*click*</span>");
	playsound(user, rt.rsc("sound/weapons/empty.ogg"), 100, 1);
	return f.dot;
});

// gun.dm:112
rt.def("/obj/item/weapon/gun/proc/shoot_live_shot", function shoot_live_shot(f: Frame, user: Value, pointblank: Value, pbtarget: Value, message: Value) {
	pointblank ??= 0;
	message ??= 1;
	if (this.recoil) {
		shake_camera(user, this.recoil + 1, this.recoil);
	}
	if (this.suppressed) {
		playsound(user, this.fire_sound, 10, 1);
	} else {
		playsound(user, this.fire_sound, 50, 1);
		if (!message) return f.dot;
		if (pointblank) {
			user.visible_message(`<span class='danger'>${user} fires ${this} point blank at ${pbtarget}!</span>`, null, null, 3);
		} else {
			user.visible_message(`<span class='danger'>${user} fires ${this}!</span>`, null, null, 3);
		}
	}
	return f.dot;
});

// gun.dm:125
rt.def("/obj/item/weapon/gun/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let O: Value = null;
	for (O of each(this.contents, T("/obj"))) {
		yield* O.emp_act(severity);
	}
	return f.dot;
}, true);

// gun.dm:133
rt.def("/obj/item/weapon/gun/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	let L: Value = null, shot_leg: Value = null, H: Value = null, G: Value = null;
	if (this.firing_burst) {
		return f.dot;
	}
	if (flag) {
		if (rt.isIn(f, target, user.contents)) {
			return f.dot;
		}
		if (!ismob(target) || user.a_intent == "harm") {
			return f.dot;
		}
		if (target == user && user.zone_selected != "mouth") {
			return f.dot;
		}
	}
	if (rt.istype(user, T("/mob/living"))) {
		if (!(yield* this.can_trigger_gun((L = user)))) {
			return f.dot;
		}
	}
	if (!this.can_shoot()) {
		this.shoot_with_empty_chamber(user);
		return f.dot;
	}
	if (flag) {
		if (user.zone_selected == "mouth") {
			yield* this.handle_suicide(user, target, params);
			return f.dot;
		}
	}
	if (this.clumsy_check) {
		if (rt.istype(user, T("/mob/living"))) {
			if (rt.bitAnd(user.disabilities, 256) && prob(40)) {
				to_chat(user, `<span class='userdanger'>You shoot yourself in the foot with ${this}!</span>`);
				shot_leg = pick("l_leg", "r_leg");
				yield* this.process_fire(user, user, 0, params, { zone_override: shot_leg });
				yield* user.drop_item();
				return f.dot;
			}
		}
	}
	if (this.weapon_weight == 3 && user.get_inactive_held_item()) {
		to_chat(user, `<span class='userdanger'>You need both hands free to fire ${this}!</span>`);
		return f.dot;
	}
	let bonus_spread: Value = 0;
	let loop_counter: Value = 0;
	if (rt.istype(user, T("/mob/living/carbon/human")) && user.a_intent == "harm") {
		H = user;
		for (G of each(H.held_items, T("/obj/item/weapon/gun"))) {
			if (G == this || G.weapon_weight >= 2) {
				continue;
			}
			if (yield* G.can_trigger_gun(user)) {
				bonus_spread += 24 * G.weapon_weight;
				loop_counter++;
				yield* addtimer((yield* new_(T("/datum/callback"), G, P("/obj/item/weapon/gun/proc/process_fire"), target, user, 1, params, null, bonus_spread)), loop_counter);
			}
		}
	}
	yield* this.process_fire(target, user, 1, params, null, bonus_spread);
	return f.dot;
}, true);

// gun.dm:188
rt.def("/obj/item/weapon/gun/proc/can_trigger_gun", function* can_trigger_gun(f: Frame, user: Value) {
	if (!(yield* this.handle_pins(user)) || !user.can_use_guns(this)) {
		return 0;
	}
	return 1;
}, true);

// gun.dm:195
rt.def("/obj/item/weapon/gun/proc/handle_pins", function* handle_pins(f: Frame, user: Value) {
	if (this.pin) {
		if (this.pin.pin_auth(user) || this.pin.emagged) {
			return 1;
		} else {
			yield* this.pin.auth_fail(user);
			return 0;
		}
	} else {
		to_chat(user, `<span class='warning'>${this}'s trigger is locked. This weapon doesn't have a firing pin installed!</span>`);
	}
	return 0;
}, true);

// gun.dm:208
rt.def("/obj/item/weapon/gun/proc/process_fire", function* process_fire(f: Frame, target: Value, user: Value, message: Value, params: Value, zone_override: Value, bonus_spread: Value) {
	let i: Value = null;
	let $e: any;
	message ??= 1;
	bonus_spread ??= 0;
	yield* this.add_fingerprint(user);
	if (this.semicd) {
		return f.dot;
	}
	let sprd: Value = 0;
	let randomized_gun_spread: Value = 0;
	let rand_spr: Value = rand();
	if (this.spread) {
		randomized_gun_spread = rand(0, this.spread);
	}
	let randomized_bonus_spread: Value = rand(0, bonus_spread);
	if (this.burst_size > 1) {
		this.firing_burst = 1;
		rt.forRange(f, 0, 1, this.burst_size, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!user) {
				break;
			}
			if (!rt.istype(user, T("/mob/living/silicon"))) {
				if (i > 1 && !user.is_holding(this)) {
					break;
				}
			}
			if (this.chambered && this.chambered.BB) {
				if (this.randomspread) {
					sprd = round((rand() - 0.5) * DUALWIELD_PENALTY_EXTRA_MULTIPLIER * (randomized_gun_spread + randomized_bonus_spread));
				} else {
					sprd = round((rand_spr / this.burst_size * i - (0.5 + rand_spr * 0.25)) * (randomized_gun_spread + randomized_bonus_spread));
				}
				if (!(yield* this.chambered.fire_casing(target, user, params, null, this.suppressed, zone_override, sprd))) {
					this.shoot_with_empty_chamber(user);
					break;
				}
				if (get_dist(user, target) <= 1) {
					yield* this.shoot_live_shot(user, 1, target, message);
				} else {
					yield* this.shoot_live_shot(user, 0, target, message);
				}
			} else {
				this.shoot_with_empty_chamber(user);
				break;
			}
			yield* this.process_chamber();
			yield* this.update_icon();
			yield* sleep(this.fire_delay);
		}
		rt.endFor(f, 0);
		this.firing_burst = 0;
	} else {
		if (this.chambered) {
			sprd = round((rand() - 0.5) * DUALWIELD_PENALTY_EXTRA_MULTIPLIER * (randomized_gun_spread + randomized_bonus_spread));
			if (!(yield* this.chambered.fire_casing(target, user, params, null, this.suppressed, zone_override, sprd))) {
				this.shoot_with_empty_chamber(user);
				return f.dot;
			} else if (get_dist(user, target) <= 1) {
				yield* this.shoot_live_shot(user, 1, target, message);
			} else {
				yield* this.shoot_live_shot(user, 0, target, message);
			}
		} else {
			this.shoot_with_empty_chamber(user);
			return f.dot;
		}
		yield* this.process_chamber();
		yield* this.update_icon();
		this.semicd = 1;
		rt.spawnTail(f, this.fire_delay, "/obj/item/weapon/gun/proc/process_fire: spawn at modules/projectiles/gun.dm:266", target, user, message, params, zone_override, bonus_spread, sprd, randomized_gun_spread, rand_spr, randomized_bonus_spread, i);
	}
	if (user) {
		yield* user.update_inv_hands();
	}
	return 1;
}, true, { argTypes: [{ type: 28, path: "/atom" }, { type: 12, path: "/mob/living" }, {  }, {  }, {  }, {  }] });

// a spawn(rt.srcVarI(f, $ic[58])) body of /obj/item/weapon/gun/proc/process_fire, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/gun/proc/process_fire: spawn at modules/projectiles/gun.dm:266", function* (f: Frame, target: Value, user: Value, message: Value, params: Value, zone_override: Value, bonus_spread: Value, sprd: Value, randomized_gun_spread: Value, rand_spr: Value, randomized_bonus_spread: Value, i: Value) {
	this.semicd = 0;
	return null;
});

// gun.dm:275
rt.def("/obj/item/weapon/gun/proc/update_icon", function update_icon(f: Frame) {
	let state: Value = null, flashlight_overlay: Value = null, knife_overlay: Value = null;
	parent_proc();
	this.cut_overlays();
	if (this.gun_light && this.can_flashlight) {
		state = `flight${this.gun_light.on ? "_on" : ""}`;
		if (rt.isIn(f, this.gun_light.icon_state, icon_states(rt.rsc("icons/obj/guns/flashlights.dmi")))) {
			state = this.gun_light.icon_state;
		}
		(flashlight_overlay = mutable_appearance(rt.rsc("icons/obj/guns/flashlights.dmi"), state)).pixel_x = this.flight_x_offset;
		flashlight_overlay.pixel_y = this.flight_y_offset;
		this.add_overlay(flashlight_overlay);
	}
	if (!(this.bayonet && this.can_bayonet)) return f.dot;
	state = "bayonet";
	if (rt.isIn(f, this.bayonet.icon_state, icon_states(rt.rsc("icons/obj/guns/bayonets.dmi")))) {
		state = this.bayonet.icon_state;
	}
	(knife_overlay = mutable_appearance(rt.rsc("icons/obj/guns/bayonets.dmi"), state)).pixel_x = this.knife_x_offset;
	knife_overlay.pixel_y = this.knife_y_offset;
	this.add_overlay(knife_overlay);
	return f.dot;
});

// gun.dm:295
rt.def("/obj/item/weapon/gun/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (user.a_intent == "harm") {
		if (this.bayonet) {
			yield* M.attackby(this.bayonet, user);
			return f.dot;
		} else {
			return (yield* parent_proc());
		}
	}
	return f.dot;
}, true);

// gun.dm:304
rt.def("/obj/item/weapon/gun/proc/attack_obj", function* attack_obj(f: Frame, O: Value, user: Value) {
	if (user.a_intent == "harm") {
		if (this.bayonet) {
			yield* O.attackby(this.bayonet, user);
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// gun.dm:311
rt.def("/obj/item/weapon/gun/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null, K: Value = null;
	if (user.a_intent == "harm") {
		return (yield* parent_proc());
	}
	if (rt.istype(I, T("/obj/item/device/flashlight/seclite"))) {
		if (!this.can_flashlight) {
			return (yield* parent_proc());
		}
		S = I;
		if (!this.gun_light) {
			if (!(yield* user.transferItemToLoc(I, this))) {
				return f.dot;
			}
			to_chat(user, fmt("<span class='notice'>You click ％！ into place on ％！.</span>", [S, this]));
			if (S.on) {
				this.set_light(0);
			}
			this.gun_light = S;
			yield* this.update_icon();
			yield* this.update_gunlight(user);
			this.alight = (yield* new_(T("/datum/action/item_action/toggle_gunlight"), this));
			if (this.loc == user) {
				yield* this.alight.Grant(user);
			}
		}
	} else if (rt.istype(I, T("/obj/item/weapon/kitchen/knife"))) {
		if (!this.can_bayonet) {
			return (yield* parent_proc());
		}
		K = I;
		if (!this.bayonet) {
			if (!(yield* user.transferItemToLoc(I, this))) {
				return f.dot;
			}
			to_chat(user, fmt("<span class='notice'>You attach ％！ to the front of ％！.</span>", [K, this]));
			this.bayonet = K;
			yield* this.update_icon();
		}
	} else if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (this.gun_light) {
			S = this.gun_light;
			to_chat(user, fmt("<span class='notice'>You unscrew the seclite from ％！.</span>", [this]));
			this.gun_light = null;
			yield* S.forceMove(rt.getStep(f, user, 0));
			yield* this.update_gunlight(user);
			S.update_brightness(user);
			yield* this.update_icon();
			yield* qdel(this.alight);
			this.alight = null;
		}
		if (this.bayonet) {
			yield* (K = this.bayonet).forceMove(rt.getStep(f, user, 0));
			this.bayonet = null;
			yield* this.update_icon();
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// gun.dm:358
rt.def("/obj/item/weapon/gun/proc/toggle_gunlight", function* toggle_gunlight(f: Frame) {
	if (!this.gun_light) {
		return f.dot;
	}
	let user: Value = f.usr;
	this.gun_light.on = (!this.gun_light.on ? 1 : 0);
	let $0: any = user;
	to_chat($0, `<span class='notice'>You toggle the gunlight ${this.gun_light.on ? "on" : "off"}.</span>`);
	playsound(user, rt.rsc("sound/weapons/empty.ogg"), 100, 1);
	yield* this.update_gunlight(user);
	return f.dot;
}, true);

// gun.dm:371
rt.def("/obj/item/weapon/gun/proc/update_gunlight", function* update_gunlight(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	if (this.gun_light) {
		if (this.gun_light.on) {
			this.set_light(this.gun_light.brightness_on);
		} else {
			this.set_light(0);
		}
		yield* this.update_icon();
	} else {
		this.set_light(0);
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// gun.dm:384
rt.def("/obj/item/weapon/gun/proc/pickup", function* pickup(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.azoom) {
		yield* this.azoom.Grant(user);
	}
	if (!this.alight) return f.dot;
	yield* this.alight.Grant(user);
	return f.dot;
}, true);

// gun.dm:391
rt.def("/obj/item/weapon/gun/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	yield* this.zoom(user, 0);
	if (this.azoom) {
		yield* this.azoom.Remove(user);
	}
	if (!this.alight) return f.dot;
	yield* this.alight.Remove(user);
	return f.dot;
}, true);

// gun.dm:399
rt.def("/obj/item/weapon/gun/proc/handle_suicide", function* handle_suicide(f: Frame, user: Value, target: Value, params: Value) {
	if (!rt.istype(user, T("/mob/living/carbon/human")) || !rt.istype(target, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (this.semicd) {
		return f.dot;
	}
	if (user == target) {
		target.visible_message(`<span class='warning'>${user} sticks ${this} in ${user.p_their()} mouth, ready to pull the trigger...</span>`, `<span class='userdanger'>You stick ${this} in your mouth, ready to pull the trigger...</span>`);
	} else {
		target.visible_message(`<span class='warning'>${user} points ${this} at ${target}'s head, ready to pull the trigger...</span>`, `<span class='userdanger'>${user} points ${this} at your head, ready to pull the trigger...</span>`);
	}
	this.semicd = 1;
	if (!(yield* do_mob(user, target, 120)) || user.zone_selected != "mouth") {
		if (user) {
			if (user == target) {
				user.visible_message(`<span class='notice'>${user} decided not to shoot.</span>`);
			} else if (target && target.Adjacent(user)) {
				target.visible_message(`<span class='notice'>${user} has decided to spare ${target}</span>`, `<span class='notice'>${user} has decided to spare your life!</span>`);
			}
		}
		this.semicd = 0;
		return f.dot;
	}
	this.semicd = 0;
	target.visible_message(`<span class='warning'>${user} pulls the trigger!</span>`, `<span class='userdanger'>${user} pulls the trigger!</span>`);
	if (this.chambered && this.chambered.BB) {
		this.chambered.BB.damage *= 5;
	}
	yield* this.process_fire(target, user, 1, params);
	return f.dot;
}, true);

// gun.dm:434
rt.def("/obj/item/weapon/gun/proc/unlock", function* unlock(f: Frame) {
	if (this.pin) {
		yield* qdel(this.pin);
	}
	this.pin = (yield* new_(T("/obj/item/device/firing_pin")));
	return f.dot;
}, true);

rt.type(270, "/datum/action/toggle_scope_zoom", "/datum/action", {
	gun: null,
	name: "Toggle Scope",
	check_flags: 15,
	button_icon_state: "sniper_zoom",
});

// gun.dm:448
rt.def("/datum/action/toggle_scope_zoom/proc/Trigger", function* Trigger(f: Frame) {
	yield* this.gun.zoom(this.owner);
	return f.dot;
}, true);

// gun.dm:451
rt.def("/datum/action/toggle_scope_zoom/proc/IsAvailable", function* IsAvailable(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(!f.dot && this.gun)) return f.dot;
	yield* this.gun.zoom(this.owner, 0);
	return f.dot;
}, true);

// gun.dm:456
rt.def("/datum/action/toggle_scope_zoom/proc/Remove", function* Remove(f: Frame, L: Value) {
	yield* this.gun.zoom(L, 0);
	yield* parent_proc();
	return f.dot;
}, true);

// gun.dm:461
rt.def("/obj/item/weapon/gun/proc/zoom", function* zoom(f: Frame, user: Value, forced_zoom: Value) {
	let _x: Value = null, _y: Value = null;
	if (!user || !user.client) {
		return f.dot;
	}
	if (forced_zoom === 0) {
		this.zoomed = 0;
	} else if (forced_zoom === 1) {
		this.zoomed = 1;
	} else {
		this.zoomed = (!this.zoomed ? 1 : 0);
	}
	if (this.zoomed) {
		_x = 0;
		_y = 0;
		if (user.dir === 1) {
			_y = this.zoom_amt;
		} else if (user.dir === 4) {
			_x = this.zoom_amt;
		} else if (user.dir === 2) {
			_y = -this.zoom_amt;
		} else if (user.dir === 8) {
			_x = -this.zoom_amt;
		}
		yield* user.client.change_view(this.zoom_out_amt);
		user.client.pixel_x = rt.world().icon_size * _x;
		user.client.pixel_y = rt.world().icon_size * _y;
	} else {
		yield* user.client.change_view(user.client.default_view());
		user.client.pixel_x = 0;
		user.client.pixel_y = 0;
	}
	return this.zoomed;
}, true);

// gun.dm:500
rt.def("/obj/item/weapon/gun/proc/build_zooming", function* build_zooming(f: Frame) {
	if (this.azoom) {
		return f.dot;
	}
	if (!this.zoomable) return f.dot;
	this.azoom = (yield* new_(T("/datum/action/toggle_scope_zoom")));
	this.azoom.gun = this;
	return f.dot;
}, true);
