// Based on /tg/station's code/datums/riding.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(739, "/datum/riding", "/datum", {
	next_vehicle_move: 0,
	vehicle_move_delay: 2,
	keytype: null,
	ridden: null,
	slowed: 0,
	slowvalue: 1,
});

// riding.dm:11
rt.def("/datum/riding/proc/New", function New(f: Frame, _ridden: Value) {
	this.ridden = _ridden;
	return f.dot;
});

// riding.dm:15
rt.def("/datum/riding/proc/Destroy", function* Destroy(f: Frame) {
	this.ridden = null;
	return (yield* parent_proc());
}, true);

// riding.dm:18
rt.def("/datum/riding/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if (this.ridden.dir != 1) {
		this.ridden.layer = ABOVE_MOB_LAYER;
	} else {
		this.ridden.layer = 3;
	}
	return f.dot;
});

// riding.dm:24
rt.def("/datum/riding/proc/on_vehicle_move", function* on_vehicle_move(f: Frame) {
	let M: Value = null;
	for (M of each(this.ridden.buckled_mobs, T("/mob/living"))) {
		yield* this.ride_check(M);
	}
	yield* this.handle_vehicle_offsets();
	this.handle_vehicle_layer();
	return f.dot;
}, true);

// riding.dm:33
rt.def("/datum/riding/proc/force_dismount", function* force_dismount(f: Frame, M: Value) {
	yield* this.ridden.unbuckle_mob(M);
	return f.dot;
}, true);

// riding.dm:36
rt.def("/datum/riding/proc/handle_vehicle_offsets", function* handle_vehicle_offsets(f: Frame) {
	let m: Value = null, buckled_mob: Value = null, offsets: Value = null, rider_dir: Value = null, offsetdir: Value = null, diroffsets: Value = null;
	let $e: any;
	let ridden_dir: Value = `${this.ridden.dir}`;
	let passindex: Value = 0;
	if (!this.ridden.has_buckled_mobs()) return f.dot;
	rt.forList(f, 0, this.ridden.buckled_mobs);
	loop10: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		m = $e;
		passindex++;
		buckled_mob = m;
		offsets = this.get_offsets(passindex);
		rider_dir = this.get_rider_dir(passindex);
		yield* buckled_mob.setDir(rider_dir);
		offsetdir = null;
		for (offsetdir of each(offsets)) {
			if (offsetdir == ridden_dir) {
				diroffsets = rt.index(offsets, offsetdir);
				buckled_mob.pixel_x = rt.index(diroffsets, 1);
				if (rt.len(f, diroffsets) >= 2) {
					buckled_mob.pixel_y = rt.index(diroffsets, 2);
				}
				if (rt.len(f, diroffsets) == 3) {
					buckled_mob.layer = rt.index(diroffsets, 3);
				}
				continue loop10;
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// riding.dm:59
rt.def("/datum/riding/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [`${1}`, list(0, 0), `${2}`, list(0, 0), `${4}`, list(0, 0), `${8}`, list(0, 0)]);
});

// riding.dm:64
rt.def("/datum/riding/proc/get_rider_dir", function get_rider_dir(f: Frame, pass_index: Value) {
	return this.ridden.dir;
});

// riding.dm:69
rt.def("/datum/riding/proc/keycheck", function keycheck(f: Frame, user: Value) {
	if (this.keytype) {
		if (user.is_holding_item_of_type(this.keytype)) {
			return 1;
		}
	} else {
		return 1;
	}
	return 0;
});

// riding.dm:77
rt.def("/datum/riding/proc/restore_position", function* restore_position(f: Frame, buckled_mob: Value) {
	if (!rt.istype(buckled_mob, T("/mob/living"))) return f.dot;
	buckled_mob.pixel_x = 0;
	buckled_mob.pixel_y = 0;
	if (!buckled_mob.client) return f.dot;
	yield* buckled_mob.client.change_view(buckled_mob.client.default_view());
	return f.dot;
}, true);

// riding.dm:85
rt.def("/datum/riding/proc/handle_ride", function* handle_ride(f: Frame, user: Value, direction: Value) {
	if (user.incapacitated()) {
		yield* this.Unbuckle(user);
		return f.dot;
	}
	if (rt.worldTime(f) < this.next_vehicle_move) {
		return f.dot;
	}
	this.next_vehicle_move = rt.worldTime(f) + this.vehicle_move_delay;
	if (this.keycheck(user)) {
		if (!(yield* this.Process_Spacemove(direction)) || !isturf(this.ridden.loc)) {
			return f.dot;
		}
		this.ridden.glide_size = max(1, min(32 / max(this.vehicle_move_delay / rt.world().tick_lag, 1), 32));
		yield* step(this.ridden, direction);
		this.handle_vehicle_layer();
		yield* this.handle_vehicle_offsets();
	} else {
		to_chat(user, fmt("<span class='notice'>You'll need the keys in one of your hands to drive ％！.</span>", [this.ridden.name]));
	}
	return f.dot;
}, true);

// riding.dm:104
rt.def("/datum/riding/proc/Unbuckle", function* Unbuckle(f: Frame, M: Value) {
	yield* addtimer((yield* new_(T("/datum/callback"), this.ridden, P("/atom/movable/proc/unbuckle_mob"), M)), 0, 1);
	return f.dot;
}, true);

// riding.dm:107
rt.def("/datum/riding/proc/Process_Spacemove", function Process_Spacemove(f: Frame, direction: Value) {
	if (this.ridden.has_gravity()) {
		return 1;
	}
	return 0;
});

rt.type(743, "/datum/riding/atv", "/datum/riding", {
	vehicle_move_delay: 1,
	keytype: rt.typePath("/obj/item/key"),
});

// riding.dm:122
rt.def("/datum/riding/atv/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [`${1}`, list(0, 4), `${2}`, list(0, 4), `${4}`, list(0, 4), `${8}`, list(0, 4)]);
});

// riding.dm:126
rt.def("/datum/riding/atv/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if (this.ridden.dir == 2) {
		this.ridden.layer = ABOVE_MOB_LAYER;
	} else {
		this.ridden.layer = 3;
	}
	return f.dot;
});

rt.type(744, "/datum/riding/atv/turret", "/datum/riding/atv", {
	turret: null,
});

// riding.dm:135
rt.def("/datum/riding/atv/turret/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if (this.ridden.dir == 2) {
		this.ridden.layer = ABOVE_MOB_LAYER;
	} else {
		this.ridden.layer = 3;
	}
	if (!this.turret) return f.dot;
	if (this.ridden.dir == 1) {
		this.turret.layer = ABOVE_MOB_LAYER;
	} else {
		this.turret.layer = 3;
	}
	return f.dot;
});

// riding.dm:148
rt.def("/datum/riding/atv/turret/proc/handle_vehicle_offsets", function* handle_vehicle_offsets(f: Frame) {
	yield* parent_proc();
	if (!this.turret) return f.dot;
	yield* this.turret.forceMove(rt.getStep(f, this.ridden, 0));
	if (this.ridden.dir === 1) {
		this.turret.pixel_x = 0;
		this.turret.pixel_y = 4;
	} else if (this.ridden.dir === 4) {
		this.turret.pixel_x = -12;
		this.turret.pixel_y = 4;
	} else if (this.ridden.dir === 2) {
		this.turret.pixel_x = 0;
		this.turret.pixel_y = 4;
	} else if (this.ridden.dir === 8) {
		this.turret.pixel_x = 12;
		this.turret.pixel_y = 4;
	}
	return f.dot;
}, true);

rt.type(745, "/datum/riding/janicart", "/datum/riding", {
	keytype: rt.typePath("/obj/item/key/janitor"),
});

// riding.dm:172
rt.def("/datum/riding/janicart/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [`${1}`, list(0, 4), `${2}`, list(0, 7), `${4}`, list(-12, 7), `${8}`, list(12, 7)]);
});

rt.type(746, "/datum/riding/scooter", "/datum/riding", {});

// riding.dm:176
rt.def("/datum/riding/scooter/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if (this.ridden.dir == 2) {
		this.ridden.layer = ABOVE_MOB_LAYER;
	} else {
		this.ridden.layer = 3;
	}
	return f.dot;
});

// riding.dm:182
rt.def("/datum/riding/scooter/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [`${1}`, list(0), `${2}`, list(-2), `${4}`, list(0), `${8}`, list(2)]);
});

// riding.dm:185
rt.def("/datum/riding/scooter/proc/handle_vehicle_offsets", function* handle_vehicle_offsets(f: Frame) {
	let m: Value = null, buckled_mob: Value = null;
	yield* parent_proc();
	if (!this.ridden.has_buckled_mobs()) return f.dot;
	for (m of each(this.ridden.buckled_mobs)) {
		if ((buckled_mob = m).get_num_legs() > 0) {
			buckled_mob.pixel_y = 5;
		} else {
			buckled_mob.pixel_y = -4;
		}
	}
	return f.dot;
}, true);

// riding.dm:195
rt.def("/datum/riding/proc/account_limbs", function account_limbs(f: Frame, M: Value) {
	if (M.get_num_legs() < 2 && !this.slowed) {
		this.vehicle_move_delay = this.vehicle_move_delay + this.slowvalue;
		this.slowed = 1;
	} else {
		if (!this.slowed) return f.dot;
		this.vehicle_move_delay = this.vehicle_move_delay - this.slowvalue;
		this.slowed = 0;
	}
	return f.dot;
});

rt.type(748, "/datum/riding/secway", "/datum/riding", {
	keytype: rt.typePath("/obj/item/key/security"),
});

// riding.dm:211
rt.def("/datum/riding/secway/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [`${1}`, list(0, 4), `${2}`, list(0, 4), `${4}`, list(0, 4), `${8}`, list(0, 4)]);
});

rt.type(749, "/datum/riding/bicycle", "/datum/riding", {
	keytype: null,
	vehicle_move_delay: 0,
});

// riding.dm:219
rt.def("/datum/riding/bicycle/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [`${1}`, list(0, 4), `${2}`, list(0, 4), `${4}`, list(0, 4), `${8}`, list(0, 4)]);
});

rt.type(741, "/datum/riding/space/speedbike", "/datum/riding/space", {
	keytype: null,
	vehicle_move_delay: 0,
});

// riding.dm:227
rt.def("/datum/riding/space/speedbike/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if (this.ridden.dir === 1 || this.ridden.dir === 2) {
		this.ridden.pixel_x = -16;
		this.ridden.pixel_y = -16;
	} else if (this.ridden.dir === 4 || this.ridden.dir === 8) {
		this.ridden.pixel_x = -18;
		this.ridden.pixel_y = 0;
	}
	return f.dot;
});

// riding.dm:236
rt.def("/datum/riding/space/speedbike/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [`${1}`, list(0, -8), `${2}`, list(0, 4), `${4}`, list(-10, 5), `${8}`, list(10, 5)]);
});

rt.type(742, "/datum/riding/space/speedwagon", "/datum/riding/space", {
	vehicle_move_delay: 0,
});

// riding.dm:244
rt.def("/datum/riding/space/speedwagon/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	this.ridden.layer = BELOW_MOB_LAYER;
	return f.dot;
});

// riding.dm:247
rt.def("/datum/riding/space/speedwagon/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	if (pass_index === 1) {
		return rt.alist(f, [`${1}`, list(-10, -4), `${2}`, list(16, 3), `${4}`, list(-4, 30), `${8}`, list(4, -3)]);
	} else if (pass_index === 2) {
		return rt.alist(f, [`${1}`, list(19, -5, 4), `${2}`, list(-13, 3, 4), `${4}`, list(-4, -3, 4.1), `${8}`, list(4, 28, 3.9)]);
	} else if (pass_index === 3) {
		return rt.alist(f, [`${1}`, list(-10, -18, 4.2), `${2}`, list(16, 25, 3.9), `${4}`, list(-22, 30), `${8}`, list(22, -3, 4.1)]);
	} else if (pass_index === 4) {
		return rt.alist(f, [`${1}`, list(19, -18, 4.2), `${2}`, list(-13, 25, 3.9), `${4}`, list(-22, 3, 3.9), `${8}`, list(22, 28)]);
	}
	return f.dot;
});

rt.type(750, "/datum/riding/boat", "/datum/riding", {
	keytype: rt.typePath("/obj/item/weapon/oar"),
});

// riding.dm:262
rt.def("/datum/riding/boat/proc/handle_ride", function* handle_ride(f: Frame, user: Value, direction: Value) {
	let next: Value = rt.getStep(f, this.ridden, direction);
	let current: Value = rt.getStep(f, this.ridden, 0);
	if (rt.istype(next, T("/turf/open/floor/plating/lava")) || rt.istype(current, T("/turf/open/floor/plating/lava"))) {
		yield* parent_proc();
	} else {
		to_chat(user, "Boats don't go on land!");
		return 0;
	}
	return f.dot;
}, true);

rt.type(751, "/datum/riding/boat/dragon", "/datum/riding/boat", {
	keytype: null,
	vehicle_move_delay: 1,
});

// riding.dm:276
rt.def("/datum/riding/boat/dragon/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [`${1}`, list(1, 2), `${2}`, list(1, 2), `${4}`, list(1, 2), `${8}`, list(1, 2)]);
});

rt.type(752, "/datum/riding/animal", "/datum/riding", {
	keytype: null,
});

// riding.dm:284
rt.def("/datum/riding/animal/proc/handle_ride", function* handle_ride(f: Frame, user: Value, direction: Value) {
	if (user.incapacitated()) {
		yield* this.Unbuckle(user);
		return f.dot;
	}
	if (rt.worldTime(f) < this.next_vehicle_move) {
		return f.dot;
	}
	this.next_vehicle_move = rt.worldTime(f) + this.vehicle_move_delay;
	if (this.keycheck(user)) {
		if (!isturf(this.ridden.loc)) {
			return f.dot;
		}
		yield* step(this.ridden, direction);
		this.handle_vehicle_layer();
		yield* this.handle_vehicle_offsets();
	} else {
		to_chat(user, `<span class='notice'>You'll need something  to guide the ${this.ridden.name}.</span>`);
	}
	return f.dot;
}, true);

rt.type(753, "/datum/riding/human", "/datum/riding", {
	keytype: null,
});

// riding.dm:307
rt.def("/datum/riding/human/proc/ride_check", function* ride_check(f: Frame, M: Value) {
	let H: Value = this.ridden;
	if (M.incapacitated(0, 1) || H.incapacitated(0, 1)) {
		M.visible_message(`<span class='warning'>${M} falls off ${this.ridden}!</span>`);
		yield* this.Unbuckle(M);
		return 0;
	}
	if (M.restrained(1)) {
		M.visible_message(`<span class='warning'>${M} can't hang onto ${this.ridden} with their hands cuffed!</span>`);
		yield* this.Unbuckle(M);
		return 0;
	}
	if (H.pulling != M) return f.dot;
	yield* H.stop_pulling();
	return f.dot;
}, true);

// riding.dm:320
rt.def("/datum/riding/human/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [`${1}`, list(0, 6), `${2}`, list(0, 6), `${4}`, list(-6, 4), `${8}`, list(6, 4)]);
});

// riding.dm:324
rt.def("/datum/riding/human/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if (this.ridden.buckled_mobs && rt.len(f, this.ridden.buckled_mobs)) {
		if (this.ridden.dir == 2) {
			this.ridden.layer = ABOVE_MOB_LAYER;
		} else {
			this.ridden.layer = 3;
		}
	} else {
		this.ridden.layer = 4;
	}
	return f.dot;
});

// riding.dm:333
rt.def("/datum/riding/human/proc/force_dismount", function* force_dismount(f: Frame, user: Value) {
	yield* this.ridden.unbuckle_mob(user);
	yield* user.Knockdown(60);
	user.visible_message(`<span class='warning'>${this.ridden} pushes ${user} off of them!</span>`);
	return f.dot;
}, true);

rt.type(754, "/datum/riding/cyborg", "/datum/riding", {
	keytype: null,
});

// riding.dm:341
rt.def("/datum/riding/cyborg/proc/ride_check", function* ride_check(f: Frame, user: Value) {
	let kick: Value = null, R: Value = null, carbonuser: Value = null;
	if (user.incapacitated()) {
		kick = 1;
		if (rt.istype(this.ridden, T("/mob/living/silicon/robot"))) {
			if ((R = this.ridden).module && R.module.ride_allow_incapacitated) {
				kick = 0;
			}
		}
		if (kick) {
			to_chat(user, `<span class='userdanger'>You fall off of ${this.ridden}!</span>`);
			yield* this.Unbuckle(user);
			return f.dot;
		}
	}
	if (!rt.istype(user, T("/mob/living/carbon"))) return f.dot;
	if ((carbonuser = user).get_num_arms()) return f.dot;
	yield* this.Unbuckle(user);
	to_chat(user, `<span class='userdanger'>You can't grab onto ${this.ridden} with no hands!</span>`);
	return f.dot;
}, true);

// riding.dm:359
rt.def("/datum/riding/cyborg/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if (this.ridden.buckled_mobs && rt.len(f, this.ridden.buckled_mobs)) {
		if (this.ridden.dir == 2) {
			this.ridden.layer = ABOVE_MOB_LAYER;
		} else {
			this.ridden.layer = 3;
		}
	} else {
		this.ridden.layer = 4;
	}
	return f.dot;
});

// riding.dm:368
rt.def("/datum/riding/cyborg/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [`${1}`, list(0, 4), `${2}`, list(0, 4), `${4}`, list(-6, 3), `${8}`, list(6, 3)]);
});

// riding.dm:371
rt.def("/datum/riding/cyborg/proc/handle_vehicle_offsets", function* handle_vehicle_offsets(f: Frame) {
	let M: Value = null, R: Value = null;
	if (!this.ridden.has_buckled_mobs()) return f.dot;
	for (M of each(this.ridden.buckled_mobs, T("/mob/living"))) {
		yield* M.setDir(this.ridden.dir);
		if (rt.istype(this.ridden, T("/mob/living/silicon/robot"))) {
			if (rt.istype((R = this.ridden).module, T("/obj/item/weapon/robot_module"))) {
				M.pixel_x = rt.index(R.module.ride_offset_x, dir2text(this.ridden.dir));
				M.pixel_y = rt.index(R.module.ride_offset_y, dir2text(this.ridden.dir));
			}
		} else {
			yield* parent_proc();
		}
	}
	return f.dot;
}, true);

// riding.dm:383
rt.def("/datum/riding/cyborg/proc/force_dismount", function* force_dismount(f: Frame, M: Value) {
	yield* this.ridden.unbuckle_mob(M);
	let target: Value = get_edge_target_turf(this.ridden, this.ridden.dir);
	let targetm: Value = rt.getStep(f, rt.getStep(f, this.ridden, 0), this.ridden.dir);
	yield* M.Move(targetm);
	M.visible_message(`<span class='warning'>${M} is thrown clear of ${this.ridden}!</span>`);
	yield* M.throw_at(target, 14, 5, this.ridden);
	yield* M.Knockdown(60);
	return f.dot;
}, true);

// riding.dm:393
rt.def("/datum/riding/proc/equip_buckle_inhands", function* equip_buckle_inhands(f: Frame, user: Value, amount_required: Value) {
	let inhand: Value = null;
	amount_required ??= 1;
	let amount_equipped: Value = 0;
	let amount_needed: Value = amount_required;
	while (amount_needed > 0) {
		(inhand = (yield* new_(T("/obj/item/riding_offhand"), user))).rider = user;
		inhand.ridden = this.ridden;
		if (yield* user.put_in_hands(inhand, 1)) {
			amount_equipped++;
		} else {
			break;
		}
		amount_needed--;
	}
	if (amount_equipped >= amount_required) {
		return 1;
	} else {
		yield* this.unequip_buckle_inhands(user);
		return 0;
	}
}, true);

// riding.dm:408
rt.def("/datum/riding/proc/unequip_buckle_inhands", function* unequip_buckle_inhands(f: Frame, user: Value) {
	let O: Value = null;
	for (O of each(user.contents, T("/obj/item/riding_offhand"))) {
		if (O.ridden != this.ridden) {
			CRASH("RIDING OFFHAND ON WRONG MOB");
			continue;
		}
		if (O.selfdeleting) {
			continue;
		}
		yield* qdel(O);
	}
	return 1;
}, true);

rt.type(7651, "/obj/item/riding_offhand", "/obj/item", {
	rider: null,
	ridden: null,
	selfdeleting: 0,
	flags: 16516,
	name: "offhand",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "offhand",
	w_class: 5,
	resistance_flags: 115,
});

// riding.dm:431
rt.def("/obj/item/riding_offhand/proc/dropped", function* dropped(f: Frame) {
	this.selfdeleting = 1;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// riding.dm:434
rt.def("/obj/item/riding_offhand/proc/equipped", function* equipped(f: Frame) {
	if (this.loc != this.rider) {
		this.selfdeleting = 1;
		yield* qdel(this);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// riding.dm:441
rt.def("/obj/item/riding_offhand/proc/Destroy", function* Destroy(f: Frame) {
	if (this.selfdeleting) {
		if (rt.isIn(f, this.rider, this.ridden.buckled_mobs)) {
			yield* this.ridden.unbuckle_mob(this.rider);
		}
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
