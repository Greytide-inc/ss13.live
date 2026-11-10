// Based on /tg/station's code/modules/awaymissions/capture_the_flag.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5643, "/obj/item/weapon/twohanded/ctf", "/obj/item/weapon/twohanded", {
	team: "white",
	reset_cooldown: 0,
	reset: null,
	reset_path: rt.typePath("/obj/effect/ctf/flag_reset"),
	throw_speed: 0,
	throw_range: 1,
	anchored: 1,
	name: "banner",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "banner",
	item_state: "banner",
	desc: "A banner with Nanotrasen's logo on it.",
	slowdown: 2,
	force: 200,
	armour_penetration: 1000,
	resistance_flags: 64,
});

// capture_the_flag.dm:31
rt.def("/obj/item/weapon/twohanded/ctf/proc/Destroy", function* Destroy(f: Frame) {
	if (this.reset) {
		yield* qdel(this.reset);
		this.reset = null;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// capture_the_flag.dm:36
rt.def("/obj/item/weapon/twohanded/ctf/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "slows_while_in_hand", 1);
	if (this.reset) return f.dot;
	this.reset = (yield* new_(this.reset_path, rt.getStep(f, this, 0)));
	return f.dot;
}, true);

// capture_the_flag.dm:42
rt.def("/obj/item/weapon/twohanded/ctf/proc/process", function* process(f: Frame) {
	let M: Value = null, mob_area: Value = null;
	if (!(rt.worldTime(f) > this.reset_cooldown)) return f.dot;
	yield* this.forceMove(rt.getStep(f, this.reset, 0));
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (rt.istype((mob_area = get_area(M)), T("/area/ctf"))) {
			to_chat(M, fmt("<span class='userdanger'>＄！ has been returned to base!</span>", [this]));
		}
	}
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
}, true, { waitfor: false });

// capture_the_flag.dm:51
rt.def("/obj/item/weapon/twohanded/ctf/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let M: Value = null, mob_area: Value = null;
	if (!is_ctf_target(user)) {
		to_chat(user, "Non players shouldn't be moving the flag!");
		return f.dot;
	}
	if (rt.isIn(f, this.team, user.faction)) {
		to_chat(user, "You can't move your own flag!");
		return f.dot;
	}
	if (this.loc == user) {
		if (!(yield* user.dropItemToGround(this))) {
			return f.dot;
		}
	}
	this.anchored = 0;
	yield* this.pickup(user);
	if (!(yield* user.put_in_active_hand(this))) {
		yield* this.dropped(user);
		return f.dot;
	}
	user.anchored = 1;
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (rt.istype((mob_area = get_area(M)), T("/area/ctf"))) {
			to_chat(M, fmt("<span class='userdanger'>＄！ has been taken!</span>", [this]));
		}
	}
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
}, true);

// capture_the_flag.dm:73
rt.def("/obj/item/weapon/twohanded/ctf/proc/dropped", function* dropped(f: Frame, user: Value) {
	let M: Value = null, mob_area: Value = null;
	yield* parent_proc();
	user.anchored = 0;
	this.reset_cooldown = rt.worldTime(f) + 200;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (rt.istype((mob_area = get_area(M)), T("/area/ctf"))) {
			to_chat(M, fmt("<span class='userdanger'>＄！ has been dropped!</span>", [this]));
		}
	}
	this.anchored = 1;
	return f.dot;
}, true);

// capture_the_flag.dm:122
rt.def("/proc/toggle_all_ctf", function* toggle_all_ctf(f: Frame, user: Value) {
	let CTF: Value = null;
	let $e: any;
	let ctf_enabled: Value = 0;
	for (CTF of each(GLOB.machines, T("/obj/machinery/capture_the_flag"))) {
		ctf_enabled = (yield* CTF.toggle_ctf());
	}
	let $0: any = key_name_admin(user);
	message_admins(`${$0} has ${ctf_enabled ? "enabled" : "disabled"} CTF!`);
	if (ctf_enabled) {
		$0 = "enabled";
	} else {
		$0 = "disabled";
	}
	yield* notify_ghosts(`CTF has been ${$0}!`, rt.rsc("sound/effects/ghost2.ogg"));
	return f.dot;
}, true);

rt.type(10887, "/obj/machinery/capture_the_flag", "/obj/machinery", {
	team: "white",
	points: 0,
	points_to_win: 3,
	respawn_cooldown: 150,
	control_points: 0,
	control_points_to_win: 180,
	team_members: null,
	spawned_mobs: null,
	recently_dead_ckeys: null,
	ctf_enabled: 0,
	ctf_gear: rt.typePath("/datum/outfit/ctf"),
	instagib_gear: rt.typePath("/datum/outfit/ctf/instagib"),
	dead_barricades: null,
	anchored: 1,
	name: "CTF Controller",
	desc: "Used for running friendly games of capture the flag.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "syndbeacon",
	resistance_flags: 64,
}, { global: { ctf_object_typecache: 762, arena_reset: 763 } });

// capture_the_flag.dm:142
rt.def("/obj/machinery/capture_the_flag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.team_members = list();

	this.spawned_mobs = list();

	this.recently_dead_ckeys = list();

	this.dead_barricades = list();
	return f.dot;
});

// capture_the_flag.dm:155
rt.def("/obj/machinery/capture_the_flag/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (!GLOB.ctf_object_typecache) {
		GLOB.ctf_object_typecache = typecacheof(list(T("/turf"), T("/mob"), T("/area"), T("/obj/machinery"), T("/obj/structure"), T("/obj/effect/ctf"), T("/obj/item/weapon/twohanded/ctf")));
	}
	(rt.modGl("poi_list", this, rt.bitOr));
	return f.dot;
}, true);

// capture_the_flag.dm:169
rt.def("/obj/machinery/capture_the_flag/proc/Destroy", function* Destroy(f: Frame) {
	yield* GLOB.poi_list.Remove(this);
	yield* parent_proc();
	return f.dot;
}, true);

// capture_the_flag.dm:173
rt.def("/obj/machinery/capture_the_flag/proc/process", function* process(f: Frame) {
	let i: Value = null, M: Value = null;
	for (i of each(this.spawned_mobs)) {
		if (!i) {
			this.spawned_mobs -= i;
			continue;
		}
		if ((M = i).InCritical() || M.stat == 2) {
			yield* this.ctf_dust_old(M);
		} else {
			yield* M.adjustBruteLoss(-5);
			yield* M.adjustFireLoss(-5);
		}
	}
	return f.dot;
}, true, { waitfor: false });

// capture_the_flag.dm:202
rt.def("/obj/machinery/capture_the_flag/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let response: Value = null, new_team_member: Value = null, CTF: Value = null;
	if (this.ctf_enabled == 0) {
		if (user.client && user.client.holder) {
			if ((response = (yield* alert("Enable CTF?", "CTF", "Yes", "No"))) == "Yes") {
				yield* toggle_all_ctf(user);
			}
		}
		return f.dot;
	}
	if (!GLOB.SSticker.HasRoundStarted()) {
		return f.dot;
	}
	if (rt.isIn(f, user.ckey, this.team_members)) {
		if (rt.isIn(f, user.ckey, this.recently_dead_ckeys)) {
			to_chat(user, `It must be more than ${this.respawn_cooldown / 10} seconds from your last death to respawn!`);
			return f.dot;
		}
		new_team_member = user.client;
		if (user.mind && user.mind.current) {
			yield* this.ctf_dust_old(user.mind.current);
		}
		yield* this.spawn_team_member(new_team_member);
		return f.dot;
	}
	for (CTF of each(GLOB.machines, T("/obj/machinery/capture_the_flag"))) {
		if (CTF == this || CTF.ctf_enabled == 0) {
			continue;
		}
		if (rt.isIn(f, user.ckey, CTF.team_members)) {
			to_chat(user, "No switching teams while the round is going!");
			return f.dot;
		}
		if (rt.len(f, CTF.team_members) < rt.len(f, this.team_members)) {
			to_chat(user, `${this.team} has more team members than ${CTF.team}. Try joining ${CTF.team} to even things up.`);
			return f.dot;
		}
	}
	(rt.modSrcVar(f, "team_members", user.ckey, rt.bitOr));
	new_team_member = user.client;
	if (user.mind && user.mind.current) {
		yield* this.ctf_dust_old(user.mind.current);
	}
	yield* this.spawn_team_member(new_team_member);
	return f.dot;
}, true);

// capture_the_flag.dm:237
rt.def("/obj/machinery/capture_the_flag/proc/ctf_dust_old", function* ctf_dust_old(f: Frame, body: Value) {
	let _T: Value = null;
	if (!(rt.istype(body, T("/mob/living")) && rt.isIn(f, this.team, body.faction))) return f.dot;
	yield* new_(T("/obj/effect/ctf/ammo"), (_T = rt.getStep(f, body, 0)));
	this.recently_dead_ckeys += body.ckey;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/capture_the_flag/proc/clear_cooldown"), body.ckey)), this.respawn_cooldown, 1);
	yield* body.dust();
	return f.dot;
}, true);

// capture_the_flag.dm:245
rt.def("/obj/machinery/capture_the_flag/proc/clear_cooldown", function clear_cooldown(f: Frame, ckey: Value) {
	this.recently_dead_ckeys -= ckey;
	return f.dot;
});

// capture_the_flag.dm:248
rt.def("/obj/machinery/capture_the_flag/proc/spawn_team_member", function* spawn_team_member(f: Frame, new_team_member: Value) {
	let M: Value = (yield* new_(T("/mob/living/carbon/human"), rt.getStep(f, this, 0)));
	yield* new_team_member.prefs.copy_to(M);
	yield* M.set_species(T("/datum/species/synth"));
	M.key = new_team_member.key;
	M.faction += this.team;
	yield* M.equipOutfit(this.ctf_gear);
	this.spawned_mobs += M;
	return f.dot;
}, true);

// capture_the_flag.dm:257
rt.def("/obj/machinery/capture_the_flag/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	if (!rt.at(href_list, "join")) return f.dot;
	if (!rt.istype((ghost = f.usr), T("/mob/dead/observer"))) return f.dot;
	yield* this.attack_ghost(ghost);
	return f.dot;
}, true);

// capture_the_flag.dm:263
rt.def("/obj/machinery/capture_the_flag/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let flag: Value = null, M: Value = null, mob_area: Value = null;
	if (!rt.istype(I, T("/obj/item/weapon/twohanded/ctf"))) return f.dot;
	if ((flag = I).team != this.team) {
		yield* user.transferItemToLoc(flag, rt.getStep(f, flag.reset, 0), 1);
		this.points++;
		for (M of each(GLOB.player_list, T("/mob"))) {
			if (rt.istype((mob_area = get_area(M)), T("/area/ctf"))) {
				to_chat(M, fmt("<span class='userdanger'>＀ has captured ％！, scoring a point for ＀ team! They now have ＀/＀ points!</span>", [user.real_name, flag, this.team, this.points, this.points_to_win]));
			}
		}
	}
	if (!(this.points >= this.points_to_win)) return f.dot;
	yield* this.victory();
	return f.dot;
}, true);

// capture_the_flag.dm:276
rt.def("/obj/machinery/capture_the_flag/proc/victory", function* victory(f: Frame) {
	let M: Value = null, mob_area: Value = null, W: Value = null, control: Value = null, CTF: Value = null;
	for (M of each(GLOB.mob_list, T("/mob"))) {
		if (rt.istype((mob_area = get_area(M)), T("/area/ctf"))) {
			to_chat(M, `<span class='narsie'>${this.team} team wins!</span>`);
			to_chat(M, "<span class='userdanger'>The game has been reset! Teams have been cleared. The machines will be active again in 30 seconds.</span>");
			W = null;
			for (W of each(M, T("/obj/item/weapon/twohanded/ctf"))) {
				yield* M.dropItemToGround(W);
			}
			yield* M.dust();
		}
	}
	for (control of each(GLOB.machines, T("/obj/machinery/control_point"))) {
		control.icon_state = "dominator";
		control.controlling = null;
	}
	for (CTF of each(GLOB.machines, T("/obj/machinery/capture_the_flag"))) {
		if (CTF.ctf_enabled == 1) {
			CTF.points = 0;
			CTF.control_points = 0;
			CTF.ctf_enabled = 0;
			CTF.team_members = list();
			GLOB.arena_reset = 0;
			yield* addtimer((yield* new_(T("/datum/callback"), CTF, P("/obj/machinery/capture_the_flag/proc/start_ctf"))), 300);
		}
	}
	return f.dot;
}, true);

// capture_the_flag.dm:297
rt.def("/obj/machinery/capture_the_flag/proc/toggle_ctf", function* toggle_ctf(f: Frame) {
	if (!this.ctf_enabled) {
		yield* this.start_ctf();
		f.dot = 1;
	} else {
		yield* this.stop_ctf();
		f.dot = 0;
	}
	return f.dot;
}, true);

// capture_the_flag.dm:306
rt.def("/obj/machinery/capture_the_flag/proc/start_ctf", function* start_ctf(f: Frame) {
	let d: Value = null, D: Value = null;
	let $e: any;
	this.ctf_enabled = 1;
	// ss13.live: the arena's energy cannons fire only during a game (emitter Initialize turns them off)
	rt.forList(f, 1, GLOB.machines, T("/obj/machinery/power/emitter/energycannon"));
	while (($e = rt.next(f, 1)) !== undefined) {
		if (rt.istype(get_area($e), T("/area/ctf"))) $e.active = 1;
	}
	rt.endFor(f, 1);
	rt.forList(f, 0, this.dead_barricades);
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		yield* (D = d).respawn();
	}
	rt.endFor(f, 0);
	this.dead_barricades.Cut();
	yield* notify_ghosts(`${this.name} has been activated!`, { enter_link: fmt("<a href=?src=＃;join=1>(Click to join the ＀ team!)</a> or click on the controller directly!", [this, this.team]), source: this, action: "attack" });
	if (GLOB.arena_reset) return f.dot;
	yield* this.reset_the_arena();
	GLOB.arena_reset = 1;
	return f.dot;
}, true);

// capture_the_flag.dm:319
rt.def("/obj/machinery/capture_the_flag/proc/reset_the_arena", function* reset_the_arena(f: Frame) {
	let atm: Value = null, S: Value = null;
	let A: Value = get_area(this);
	for (atm of each(A)) {
		if (!is_type_in_typecache(atm, GLOB.ctf_object_typecache)) {
			yield* qdel(atm);
		}
		if (rt.istype(atm, T("/obj/structure"))) {
			(S = atm).obj_integrity = S.max_integrity;
		}
	}
	return f.dot;
}, true);

// capture_the_flag.dm:330
rt.def("/obj/machinery/capture_the_flag/proc/stop_ctf", function* stop_ctf(f: Frame) {
	let i: Value = null, M: Value = null;
	let $e: any;
	this.ctf_enabled = 0;
	GLOB.arena_reset = 0;
	let A: Value = get_area(this);
	for (i of each(GLOB.mob_list)) {
		M = i;
		if (get_area(A) == A && rt.isIn(f, M.ckey, this.team_members)) {
			yield* M.dust();
		}
	}
	this.team_members.Cut();
	this.spawned_mobs.Cut();
	this.recently_dead_ckeys.Cut();
	// ss13.live: the arena's energy cannons fire only during a game (emitter Initialize turns them off)
	rt.forList(f, 1, GLOB.machines, T("/obj/machinery/power/emitter/energycannon"));
	while (($e = rt.next(f, 1)) !== undefined) {
		if (rt.istype(get_area($e), T("/area/ctf"))) $e.active = 0;
	}
	rt.endFor(f, 1);
	return f.dot;
}, true);

rt.type(5205, "/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf", "/obj/item/weapon/gun/ballistic/automatic/pistol/deagle", {
	desc: "This looks like it could really hurt in melee.",
	force: 75,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m50/ctf"),
});

// capture_the_flag.dm:357
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf/proc/floor_vanish"))), 1);
	return f.dot;
}, true);

// capture_the_flag.dm:361
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf/proc/floor_vanish", function* floor_vanish(f: Frame) {
	if (!isturf(this.loc)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(8798, "/obj/item/projectile/bullet/ctf", "/obj/item/projectile/bullet", {
	damage: 0,
});

// capture_the_flag.dm:374
rt.def("/obj/item/projectile/bullet/ctf/proc/prehit", function prehit(f: Frame, target: Value) {
	if (is_ctf_target(target)) {
		this.damage = 60;
	}
	f.dot = parent_proc();
	return f.dot;
}, false);

rt.type(5212, "/obj/item/weapon/gun/ballistic/automatic/laser/ctf", "/obj/item/weapon/gun/ballistic/automatic/laser", {
	desc: "This looks like it could really hurt in melee.",
	force: 50,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf"),
});

// capture_the_flag.dm:384
rt.def("/obj/item/weapon/gun/ballistic/automatic/laser/ctf/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/gun/ballistic/automatic/laser/ctf/proc/floor_vanish"))), 1);
	return f.dot;
}, true);

// capture_the_flag.dm:388
rt.def("/obj/item/weapon/gun/ballistic/automatic/laser/ctf/proc/floor_vanish", function* floor_vanish(f: Frame) {
	if (!isturf(this.loc)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9889, "/obj/item/ammo_box/magazine/recharge/ctf", "/obj/item/ammo_box/magazine/recharge", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/laser/ctf"),
});

// capture_the_flag.dm:395
rt.def("/obj/item/ammo_box/magazine/recharge/ctf/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/ammo_box/magazine/recharge/ctf/proc/floor_vanish"))), 1);
	return f.dot;
}, true);

// capture_the_flag.dm:399
rt.def("/obj/item/ammo_box/magazine/recharge/ctf/proc/floor_vanish", function* floor_vanish(f: Frame) {
	if (!isturf(this.loc)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(8863, "/obj/item/projectile/beam/ctf", "/obj/item/projectile/beam", {
	damage: 0,
	icon_state: "omnilaser",
});

// capture_the_flag.dm:410
rt.def("/obj/item/projectile/beam/ctf/proc/prehit", function prehit(f: Frame, target: Value) {
	if (is_ctf_target(target)) {
		this.damage = 150;
	}
	f.dot = parent_proc();
	return f.dot;
}, false);

// capture_the_flag.dm:416
rt.def("/proc/is_ctf_target", function is_ctf_target(f: Frame, target: Value) {
	let H: Value = null;
	f.dot = 0;
	if (rt.istype(target, T("/obj/structure/barricade/security/ctf"))) {
		f.dot = 1;
	}
	if (!rt.istype(target, T("/mob/living/carbon/human"))) return f.dot;
	if (!rt.istype((H = target).wear_suit, T("/obj/item/clothing/suit/space/hardsuit/shielded/ctf"))) return f.dot;
	f.dot = 1;
	return f.dot;
});

rt.type(631, "/datum/outfit/ctf", "/datum/outfit", {
	name: "CTF",
	toggle_helmet: 0,
	ears: rt.typePath("/obj/item/device/radio/headset"),
	uniform: rt.typePath("/obj/item/clothing/under/syndicate"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/shielded/ctf"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	id: rt.typePath("/obj/item/weapon/card/id/syndicate"),
	belt: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf"),
	l_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf"),
	r_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf"),
	r_hand: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/laser/ctf"),
});

// capture_the_flag.dm:470
rt.def("/datum/outfit/ctf/proc/post_equip", function post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let W: Value = null, i: Value = null, I: Value = null;
	visualsOnly ??= 0;
	if (visualsOnly) {
		return f.dot;
	}
	let no_drops: Value = list();
	no_drops += (W = H.wear_id);
	W.registered_name = H.real_name;
	W.update_label(W.registered_name, W.assignment);
	no_drops += H.get_item_by_slot(slot_gloves);
	no_drops += H.get_item_by_slot(slot_shoes);
	no_drops += H.get_item_by_slot(slot_w_uniform);
	no_drops += H.get_item_by_slot(slot_ears);
	for (i of each(no_drops)) {
		(rt.modField(f, (I = i), "flags", NODROP, rt.bitOr));
	}
	return f.dot;
});

rt.type(633, "/datum/outfit/ctf/red", "/datum/outfit/ctf", {
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/shielded/ctf/red"),
	r_hand: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/laser/ctf/red"),
	l_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf/red"),
	r_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf/red"),
});

// capture_the_flag.dm:510
rt.def("/datum/outfit/ctf/red/proc/post_equip", function post_equip(f: Frame, H: Value) {
	let R: Value = null;
	parent_proc();
	(R = H.ears).set_frequency(1215);
	R.freqlock = 1;
	R.independent = 1;
	H.dna.species.stunmod = 0;
	return f.dot;
}, false);

rt.type(635, "/datum/outfit/ctf/blue", "/datum/outfit/ctf", {
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/shielded/ctf/blue"),
	r_hand: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/laser/ctf/blue"),
	l_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf/blue"),
	r_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf/blue"),
});

// capture_the_flag.dm:518
rt.def("/datum/outfit/ctf/blue/proc/post_equip", function post_equip(f: Frame, H: Value) {
	let R: Value = null;
	parent_proc();
	(R = H.ears).set_frequency(1217);
	R.freqlock = 1;
	R.independent = 1;
	H.dna.species.stunmod = 0;
	return f.dot;
}, false);

rt.type(12887, "/obj/structure/trap/ctf", "/obj/structure/trap", {
	team: "white",
	time_between_triggers: 1,
	anchored: 1,
	name: "Spawn protection",
	desc: "Stay outta the enemy spawn!",
	icon_state: "trap",
	resistance_flags: 64,
	alpha: 255,
});

// capture_the_flag.dm:541
rt.def("/obj/structure/trap/ctf/proc/trap_effect", function* trap_effect(f: Frame, L: Value) {
	if (!is_ctf_target(L)) {
		return f.dot;
	}
	if (rt.isIn(f, this.team, L.faction)) return f.dot;
	to_chat(L, "<span class='danger'><B>Stay out of the enemy spawn!</B></span>");
	yield* L.death();
	return f.dot;
}, true);

rt.type(12548, "/obj/structure/barricade/security/ctf", "/obj/structure/barricade/security", {
	deploy_time: 0,
	deploy_message: 0,
	name: "barrier",
	desc: "A barrier. Provides cover in fire fights.",
});

// capture_the_flag.dm:562
rt.def("/obj/structure/barricade/security/ctf/proc/make_debris", function* make_debris(f: Frame) {
	yield* new_(T("/obj/effect/ctf/dead_barricade"), rt.getStep(f, this, 0));
	return f.dot;
}, true);

rt.type(12044, "/obj/effect/ctf/ammo", "/obj/effect/ctf", {
	name: "ammo pickup",
	desc: "You like revenge, right? Everybody likes revenge! Well, let's go get some!",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "at_shield1",
	layer: 4.1,
	alpha: 255,
	invisibility: 0,
});

// capture_the_flag.dm:582
rt.def("/obj/effect/ctf/ammo/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), AMMO_DROP_LIFETIME, 8);
	return f.dot;
}, true);

// capture_the_flag.dm:586
rt.def("/obj/effect/ctf/ammo/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	yield* this.reload(AM);
	return f.dot;
}, true);

// capture_the_flag.dm:589
rt.def("/obj/effect/ctf/ammo/proc/Bump", function* Bump(f: Frame, AM: Value) {
	yield* this.reload(AM);
	return f.dot;
}, true);

// capture_the_flag.dm:592
rt.def("/obj/effect/ctf/ammo/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	yield* this.reload(AM);
	return f.dot;
}, true);

// capture_the_flag.dm:595
rt.def("/obj/effect/ctf/ammo/proc/reload", function* reload(f: Frame, M: Value) {
	let CTF: Value = null, outfit: Value = null, O: Value = null, G: Value = null;
	if (!rt.istype(M, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	for (CTF of each(GLOB.machines, T("/obj/machinery/capture_the_flag"))) {
		if (rt.isIn(f, M, CTF.spawned_mobs)) {
			outfit = CTF.ctf_gear;
			O = (yield* new_(outfit));
			G = null;
			for (G of each(M, T("/obj/item/weapon/gun"))) {
				yield* qdel(G);
			}
			yield* O.equip(M);
			to_chat(M, "<span class='notice'>Ammunition reloaded!</span>");
			playsound(rt.getStep(f, M, 0), rt.rsc("sound/weapons/shotgunpump.ogg"), 50, 1, -1);
			yield* qdel(this);
			break;
		}
	}
	return f.dot;
}, true);

rt.type(12045, "/obj/effect/ctf/dead_barricade", "/obj/effect/ctf", {
	name: "dead barrier",
	desc: "It provided cover in fire fights. And now it's gone.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "barrier0",
});

// capture_the_flag.dm:616
rt.def("/obj/effect/ctf/dead_barricade/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	let CTF: Value = null;
	parent_proc();
	for (CTF of each(GLOB.machines, T("/obj/machinery/capture_the_flag"))) {
		CTF.dead_barricades += this;
	}
	return f.dot;
}, false);

// capture_the_flag.dm:621
rt.def("/obj/effect/ctf/dead_barricade/proc/respawn", function* respawn(f: Frame) {
	if (!this || this.gc_destroyed) return f.dot;
	yield* new_(T("/obj/structure/barricade/security/ctf"), rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10890, "/obj/machinery/control_point", "/obj/machinery", {
	controlling: null,
	team: "none",
	point_rate: 1,
	anchored: 1,
	name: "control point",
	desc: "You should capture this.",
	icon: rt.rsc("icons/obj/machines/dominator.dmi"),
	icon_state: "dominator",
	resistance_flags: 64,
});

// capture_the_flag.dm:642
rt.def("/obj/machinery/control_point/proc/process", function* process(f: Frame) {
	if (!this.controlling) return f.dot;
	this.controlling.control_points += this.point_rate;
	if (!(this.controlling.control_points >= this.controlling.control_points_to_win)) return f.dot;
	yield* this.controlling.victory();
	return f.dot;
}, true, { waitfor: false });

// capture_the_flag.dm:646
rt.def("/obj/machinery/control_point/proc/attackby", function* attackby(f: Frame, user: Value, params: Value) {
	yield* this.capture(user);
	return f.dot;
}, true);

// capture_the_flag.dm:649
rt.def("/obj/machinery/control_point/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.capture(user);
	return f.dot;
}, true);

// capture_the_flag.dm:652
rt.def("/obj/machinery/control_point/proc/capture", function* capture(f: Frame, user: Value) {
	let CTF: Value = null, M: Value = null, mob_area: Value = null;
	if (!(yield* do_after(user, 30, { target: this }))) return f.dot;
	for (CTF of each(GLOB.machines, T("/obj/machinery/capture_the_flag"))) {
		if (CTF.ctf_enabled && rt.isIn(f, user.ckey, CTF.team_members)) {
			this.controlling = CTF;
			this.icon_state = `dominator-${CTF.team}`;
			M = null;
			for (M of each(GLOB.player_list, T("/mob"))) {
				if (rt.istype((mob_area = get_area(M)), T("/area/ctf"))) {
					to_chat(M, fmt("<span class='userdanger'>＀ has captured ％！, claiming it for ＀! Go take it back!</span>", [user.real_name, this, CTF.team]));
				}
			}
			break;
		}
	}
	return f.dot;
}, true);
