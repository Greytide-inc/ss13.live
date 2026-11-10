// Based on /tg/station's code/modules/projectiles/guns/energy/kinetic_accelerator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(5167, "/obj/item/weapon/gun/energy/kinetic_accelerator", "/obj/item/weapon/gun/energy", {
	overheat_time: 16,
	holds_charge: 0,
	unique_frequency: 0,
	overheat: 0,
	max_mod_capacity: 100,
	modkits: null,
	empty_state: "kineticgun_empty",
	recharge_timerid: null,
	name: "proto-kinetic accelerator",
	desc: "A self recharging, ranged mining tool that does increased damage in low pressure.",
	icon_state: "kineticgun",
	item_state: "kineticgun",
	ammo_type: null,
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell/emproof"),
	needs_permit: 0,
	unique_rename: 1,
	origin_tech: "combat=3;powerstorage=3;engineering=3",
	weapon_weight: 1,
	can_flashlight: 1,
	flight_x_offset: 15,
	flight_y_offset: 9,
	can_bayonet: 1,
	knife_x_offset: 15,
	knife_y_offset: 13,
});

// kinetic_accelerator.dm:24
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modkits = list();

	this.ammo_type = list(T("/obj/item/ammo_casing/energy/kinetic"));
	return f.dot;
});

// kinetic_accelerator.dm:30
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/examine", function examine(f: Frame, user: Value) {
	let A: Value = null, M: Value = null;
	parent_proc();
	if (!this.max_mod_capacity) return f.dot;
	to_chat(user, `<b>${this.get_remaining_mod_capacity()}%</b> mod capacity remaining.`);
	for (A of each(this.get_modkits())) {
		M = A;
		to_chat(user, `<span class='notice'>There is a ${M.name} mod installed, using <b>${M.cost}%</b> capacity.</span>`);
	}
	return f.dot;
}, false);

// kinetic_accelerator.dm:38
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/attackby", function* attackby(f: Frame, A: Value, user: Value) {
	let M: Value = null, MK: Value = null;
	if (rt.istype(A, T("/obj/item/weapon/crowbar"))) {
		if (rt.len(f, this.modkits)) {
			to_chat(user, "<span class='notice'>You pry the modifications out.</span>");
			playsound(this.loc, A.usesound, 100, 1);
			for (M of each(this.modkits, T("/obj/item/borg/upgrade/modkit"))) {
				yield* M.uninstall(this);
			}
		} else {
			to_chat(user, "<span class='notice'>There are no modifications currently installed.</span>");
		}
	} else if (rt.istype(A, T("/obj/item/borg/upgrade/modkit"))) {
		yield* (MK = A).install(this, user);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// kinetic_accelerator.dm:54
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/get_remaining_mod_capacity", function get_remaining_mod_capacity(f: Frame) {
	let A: Value = null, M: Value = null;
	let current_capacity_used: Value = 0;
	for (A of each(this.get_modkits())) {
		current_capacity_used += (M = A).cost;
	}
	return this.max_mod_capacity - current_capacity_used;
});

// kinetic_accelerator.dm:60
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/get_modkits", function get_modkits(f: Frame) {
	let A: Value = null;
	f.dot = list();
	for (A of each(this.modkits)) {
		f.dot += A;
	}
	return f.dot;
});

// kinetic_accelerator.dm:66
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/modify_projectile", function modify_projectile(f: Frame, K: Value) {
	let A: Value = null, M: Value = null;
	K.kinetic_gun = this;
	for (A of each(this.get_modkits())) {
		(M = A).modify_projectile(K);
	}
	return f.dot;
});

// kinetic_accelerator.dm:76
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.holds_charge) return f.dot;
	yield* this.empty();
	return f.dot;
}, true);

// kinetic_accelerator.dm:81
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/shoot_live_shot", function* shoot_live_shot(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.attempt_reload();
	return f.dot;
}, true);

// kinetic_accelerator.dm:85
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/equipped", function* equipped(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (this.can_shoot()) return f.dot;
	yield* this.attempt_reload();
	return f.dot;
}, true);

// kinetic_accelerator.dm:90
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* parent_proc());
	// tg bug fix: a gun deleted inside a bag is "dropped" by the bag after Destroy cleared its timers; a new timer
	// would fire on the dead gun (null.charge runtime).
	if (this.holds_charge || this.gc_destroyed) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/empty_if_not_held"))), 2);
	return f.dot;
}, true);

// kinetic_accelerator.dm:97
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/empty_if_not_held", function* empty_if_not_held(f: Frame) {
	if (ismob(this.loc)) return f.dot;
	yield* this.empty();
	return f.dot;
}, true);

// kinetic_accelerator.dm:101
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/empty", function* empty(f: Frame) {
	yield* this.cell.use(this.cell.charge);
	yield* this.update_icon();
	return f.dot;
}, true);

// kinetic_accelerator.dm:107
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/attempt_reload", function* attempt_reload(f: Frame, recharge_time: Value) {
	let K: Value = null;
	if (this.overheat) {
		return f.dot;
	}
	if (!recharge_time) {
		recharge_time = this.overheat_time;
	}
	this.overheat = 1;
	let carried: Value = 0;
	if (!this.unique_frequency) {
		for (K of each(this.loc.GetAllContents(), T("/obj/item/weapon/gun/energy/kinetic_accelerator"))) {
			carried++;
		}
		carried = max(carried, 1);
	} else {
		carried = 1;
	}
	yield* deltimer(this.recharge_timerid);
	this.recharge_timerid = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/reload"))), recharge_time * carried, 8));
	return f.dot;
}, true);

// kinetic_accelerator.dm:128
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/reload", function* reload(f: Frame) {
	yield* this.cell.give(this.cell.maxcharge);
	yield* this.recharge_newshot(1);
	if (!this.suppressed) {
		playsound(this.loc, rt.rsc("sound/weapons/kenetic_reload.ogg"), 60, 1);
	} else {
		to_chat(this.loc, `<span class='warning'>${this} silently charges up.<span>`);
	}
	yield* this.update_icon();
	this.overheat = 0;
	return f.dot;
}, true);

// kinetic_accelerator.dm:138
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (!(this.empty_state && !this.can_shoot())) return f.dot;
	this.add_overlay(this.empty_state);
	return f.dot;
});

rt.type(8733, "/obj/item/ammo_casing/energy/kinetic", "/obj/item/ammo_casing/energy", {
	select_name: "kinetic",
	e_cost: 500,
	projectile_type: rt.typePath("/obj/item/projectile/kinetic"),
	fire_sound: rt.rsc("sound/weapons/kenetic_accel.ogg"),
});

// kinetic_accelerator.dm:151
rt.def("/obj/item/ammo_casing/energy/kinetic/proc/ready_proj", function* ready_proj(f: Frame) {
	let KA: Value = null;
	if (f.args[3] === null) {
		f.args[3] = "";
	}
	yield* parent_proc();
	if (!(this.loc && rt.istype(this.loc, T("/obj/item/weapon/gun/energy/kinetic_accelerator")))) return f.dot;
	(KA = this.loc).modify_projectile(this.BB);
	return f.dot;
}, true, { args: ["target", "user", "quiet", "zone_override"] });

rt.type(8896, "/obj/item/projectile/kinetic", "/obj/item/projectile", {
	pressure_decrease_active: 0,
	pressure_decrease: 0.25,
	kinetic_gun: null,
	name: "kinetic force",
	icon_state: null,
	damage: 40,
	damage_type: "brute",
	flag: "bomb",
	range: 3,
	log_override: 1,
});

// kinetic_accelerator.dm:172
rt.def("/obj/item/projectile/kinetic/proc/Destroy", function* Destroy(f: Frame) {
	this.kinetic_gun = null;
	return (yield* parent_proc());
}, true);

// kinetic_accelerator.dm:175
rt.def("/obj/item/projectile/kinetic/proc/prehit", function* prehit(f: Frame, target: Value) {
	let target_turf: Value = null, mods: Value = null, M: Value = null, pressure: Value = null;
	if (!isturf((target_turf = rt.getStep(f, target, 0)))) {
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (this.kinetic_gun) {
		mods = this.kinetic_gun.get_modkits();
		for (M of each(mods, T("/obj/item/borg/upgrade/modkit"))) {
			yield* M.projectile_prehit(this, target, this.kinetic_gun);
		}
	}
	let environment: Value = target_turf.return_air();
	if (!((pressure = environment.return_pressure()) > 50)) return f.dot;
	this.name = `weakened ${this.name}`;
	this.damage = this.damage * this.pressure_decrease;
	this.pressure_decrease_active = 1;
	return f.dot;
}, true);

// kinetic_accelerator.dm:192
rt.def("/obj/item/projectile/kinetic/proc/on_range", function* on_range(f: Frame) {
	yield* this.strike_thing();
	yield* parent_proc();
	return f.dot;
}, true);

// kinetic_accelerator.dm:196
rt.def("/obj/item/projectile/kinetic/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	yield* this.strike_thing(target);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// kinetic_accelerator.dm:200
rt.def("/obj/item/projectile/kinetic/proc/strike_thing", function* strike_thing(f: Frame, target: Value) {
	let target_turf: Value = null, mods: Value = null, M: Value = null, M_1: Value = null, K: Value = null;
	if (!(target_turf = rt.getStep(f, target, 0))) {
		target_turf = rt.getStep(f, this, 0);
	}
	if (this.kinetic_gun) {
		mods = this.kinetic_gun.get_modkits();
		for (M of each(mods, T("/obj/item/borg/upgrade/modkit"))) {
			yield* M.projectile_strike_predamage(this, target_turf, target, this.kinetic_gun);
		}
		M = null;
		for (M of each(mods, T("/obj/item/borg/upgrade/modkit"))) {
			yield* M.projectile_strike(this, target_turf, target, this.kinetic_gun);
		}
	}
	if (rt.istype(target_turf, T("/turf/closed/mineral"))) {
		yield* (M_1 = target_turf).gets_drilled(this.firer);
	}
	(K = (yield* new_(T("/obj/effect/temp_visual/kinetic_blast"), target_turf))).color = this.color;
	return f.dot;
}, true);

rt.type(9841, "/obj/item/borg/upgrade/modkit", "/obj/item/borg/upgrade", {
	denied_type: null,
	maximum_of_type: 1,
	cost: 30,
	modifier: 1,
	origin_tech: "programming=2;materials=2;magnets=4",
	w_class: 2,
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/miner"),
	name: "kinetic accelerator modification kit",
	desc: "An upgrade for kinetic accelerators.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "modkit",
});

// Empty in tg.
rt.def("/obj/item/borg/upgrade/modkit/proc/modify_projectile", undefined, false, { args: ["K"] });

// Empty in tg.
rt.def("/obj/item/borg/upgrade/modkit/proc/projectile_prehit", undefined, false, { args: ["K", "target", "KA"] });

// Empty in tg.
rt.def("/obj/item/borg/upgrade/modkit/proc/projectile_strike_predamage", undefined, false, { args: ["K", "target_turf", "target", "KA"] });

// Empty in tg.
rt.def("/obj/item/borg/upgrade/modkit/proc/projectile_strike", undefined, false, { args: ["K", "target_turf", "target", "KA"] });

// kinetic_accelerator.dm:232
rt.def("/obj/item/borg/upgrade/modkit/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>Occupies <b>${this.cost}%</b> of mod capacity.</span>`);
	return f.dot;
}, false);

// kinetic_accelerator.dm:236
rt.def("/obj/item/borg/upgrade/modkit/proc/attackby", function* attackby(f: Frame, A: Value, user: Value) {
	if (rt.istype(A, T("/obj/item/weapon/gun/energy/kinetic_accelerator")) && !rt.istype(user, T("/mob/living/silicon"))) {
		yield* this.install(A, user);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// kinetic_accelerator.dm:242
rt.def("/obj/item/borg/upgrade/modkit/proc/action", function* action(f: Frame, R: Value) {
	let H: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	rt.forList(f, 0, R.module.modules, T("/obj/item/weapon/gun/energy/kinetic_accelerator/cyborg"));
	if (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		return (yield* this.install(H, f.usr));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// kinetic_accelerator.dm:252
rt.def("/obj/item/borg/upgrade/modkit/proc/install", function* install(f: Frame, KA: Value, user: Value) {
	let number_of_denied: Value = null, A: Value = null, M: Value = null;
	f.dot = 1;
	if (this.denied_type) {
		number_of_denied = 0;
		for (A of each(KA.get_modkits())) {
			if (rt.op(f, "IsType", [], [(M = A), this.denied_type])) {
				number_of_denied++;
			}
			if (number_of_denied >= this.maximum_of_type) {
				f.dot = 0;
				break;
			}
		}
	}
	if (KA.get_remaining_mod_capacity() >= this.cost) {
		if (f.dot) {
			if (!(yield* user.transferItemToLoc(this, KA))) {
				return f.dot;
			}
			to_chat(user, "<span class='notice'>You install the modkit.</span>");
			playsound(this.loc, rt.rsc("sound/items/screwdriver.ogg"), 100, 1);
			KA.modkits += this;
		} else {
			to_chat(user, "<span class='notice'>The modkit you're trying to install would conflict with an already installed modkit. Use a crowbar to remove existing modkits.</span>");
		}
	} else {
		to_chat(user, `<span class='notice'>You don't have room(<b>${KA.get_remaining_mod_capacity()}%</b> remaining, ${this.cost}% needed) to install this modkit. Use a crowbar to remove existing modkits.</span>`);
		f.dot = 0;
	}
	return f.dot;
}, true);

// kinetic_accelerator.dm:273
rt.def("/obj/item/borg/upgrade/modkit/proc/uninstall", function* uninstall(f: Frame, KA: Value) {
	yield* this.forceMove(rt.getStep(f, KA, 0));
	KA.modkits -= this;
	return f.dot;
}, true);

rt.type(9844, "/obj/item/borg/upgrade/modkit/cooldown", "/obj/item/borg/upgrade/modkit", {
	modifier: 2.5,
	name: "cooldown decrease",
	desc: "Decreases the cooldown of a kinetic accelerator.",
});

// kinetic_accelerator.dm:313
rt.def("/obj/item/borg/upgrade/modkit/cooldown/proc/install", function* install(f: Frame, KA: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	KA.overheat_time -= this.modifier;
	return f.dot;
}, true);

// kinetic_accelerator.dm:319
rt.def("/obj/item/borg/upgrade/modkit/cooldown/proc/uninstall", function* uninstall(f: Frame, KA: Value) {
	KA.overheat_time += this.modifier;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9846, "/obj/item/borg/upgrade/modkit/aoe", "/obj/item/borg/upgrade/modkit", {
	turf_aoe: 0,
	stats_stolen: 0,
	modifier: 0,
});

// kinetic_accelerator.dm:329
rt.def("/obj/item/borg/upgrade/modkit/aoe/proc/install", function* install(f: Frame, KA: Value, user: Value) {
	let AOE: Value = null;
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	for (AOE of each(KA.modkits, T("/obj/item/borg/upgrade/modkit/aoe"))) {
		if (AOE.stats_stolen || AOE == this) {
			continue;
		}
		this.modifier += AOE.modifier;
		AOE.modifier = 0;
		this.turf_aoe += AOE.turf_aoe;
		AOE.turf_aoe = 0;
		AOE.stats_stolen = 1;
	}
	return f.dot;
}, true);

// kinetic_accelerator.dm:341
rt.def("/obj/item/borg/upgrade/modkit/aoe/proc/uninstall", function* uninstall(f: Frame, KA: Value) {
	yield* parent_proc();
	this.modifier = rt.initial(f, this, "modifier");
	this.turf_aoe = rt.initial(f, this, "turf_aoe");
	this.stats_stolen = 0;
	return f.dot;
}, true);

// kinetic_accelerator.dm:347
rt.def("/obj/item/borg/upgrade/modkit/aoe/proc/modify_projectile", function modify_projectile(f: Frame, K: Value) {
	K.name = "kinetic explosion";
	return f.dot;
});

// kinetic_accelerator.dm:352
rt.def("/obj/item/borg/upgrade/modkit/aoe/proc/projectile_strike", function* projectile_strike(f: Frame, K: Value, target_turf: Value, target: Value, KA: Value) {
	let _T: Value = null, M: Value = null, L: Value = null, armor: Value = null;
	if (this.stats_stolen) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/explosion/fast"), target_turf);
	if (this.turf_aoe) {
		for (_T of each(block(rt.locate(max(target_turf.x - 1, 1), max(target_turf.y - 1, 1), target_turf.z), rt.locate(min(target_turf.x + 1, rt.world().maxx), min(target_turf.y + 1, rt.world().maxy), target_turf.z)) - target_turf)) {
			if (rt.istype(_T, T("/turf/closed/mineral"))) {
				yield* (M = _T).gets_drilled(K.firer);
			}
		}
	}
	if (!this.modifier) return f.dot;
	for (L of each(range(1, target_turf) - K.firer - target, T("/mob/living"))) {
		armor = L.run_armor_check(K.def_zone, K.flag, "", "", K.armour_penetration);
		yield* L.apply_damage(K.damage * this.modifier, K.damage_type, K.def_zone, armor);
		to_chat(L, `<span class='userdanger'>You're struck by a ${K.name}!</span>`);
	}
	return f.dot;
}, true);

rt.type(9845, "/obj/item/borg/upgrade/modkit/cooldown/repeater", "/obj/item/borg/upgrade/modkit/cooldown", {
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/cooldown/repeater"),
	modifier: -14,
	cost: 50,
	name: "rapid repeater",
	desc: "Quarters the kinetic accelerator's cooldown on striking a living target, but greatly increases the base cooldown.",
});

// kinetic_accelerator.dm:391
rt.def("/obj/item/borg/upgrade/modkit/cooldown/repeater/proc/projectile_strike_predamage", function* projectile_strike_predamage(f: Frame, K: Value, target_turf: Value, target: Value, KA: Value) {
	let L: Value = null;
	let valid_repeat: Value = 0;
	if (rt.istype(target, T("/mob/living"))) {
		if ((L = target).stat != 2) {
			valid_repeat = 1;
		}
	}
	if (rt.istype(target_turf, T("/turf/closed/mineral"))) {
		valid_repeat = 1;
	}
	if (!valid_repeat) return f.dot;
	KA.overheat = 0;
	yield* KA.attempt_reload(KA.overheat_time * 0.25);
	return f.dot;
}, true);

rt.type(9850, "/obj/item/borg/upgrade/modkit/lifesteal", "/obj/item/borg/upgrade/modkit", {
	modifier: 2.5,
	cost: 20,
	name: "lifesteal crystal",
	desc: "Causes kinetic accelerator shots to slightly heal the firer on striking a living target.",
	icon_state: "modkit_crystal",
}, { global: { damage_heal_order: 742 } });

// kinetic_accelerator.dm:410
rt.def("/obj/item/borg/upgrade/modkit/lifesteal/proc/projectile_prehit", function* projectile_prehit(f: Frame, K: Value, target: Value, KA: Value) {
	let L: Value = null;
	if (!(rt.istype(target, T("/mob/living")) && rt.istype(K.firer, T("/mob/living")))) return f.dot;
	if ((L = target).stat == 2) {
		return f.dot;
	}
	yield* (L = K.firer).heal_ordered_damage(this.modifier, rt.gl("damage_heal_order#4"));
	return f.dot;
}, true);

rt.type(9851, "/obj/item/borg/upgrade/modkit/resonator_blasts", "/obj/item/borg/upgrade/modkit", {
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/resonator_blasts"),
	cost: 30,
	modifier: 0.25,
	name: "resonator blast",
	desc: "Causes kinetic accelerator shots to leave and detonate resonator blasts.",
});

// kinetic_accelerator.dm:425
rt.def("/obj/item/borg/upgrade/modkit/resonator_blasts/proc/projectile_strike", function* projectile_strike(f: Frame, K: Value, target_turf: Value, target: Value, KA: Value) {
	let R: Value = null;
	if (!(target_turf && !rt.istype(target_turf, T("/turf/closed/mineral")))) return f.dot;
	if (R = rt.locateIn(f, T("/obj/effect/temp_visual/resonance"), target_turf)) {
		R.damage_multiplier = this.modifier;
		yield* R.burst();
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/resonance"), target_turf, K.firer, null, 30);
	return f.dot;
}, true);

rt.type(9852, "/obj/item/borg/upgrade/modkit/bounty", "/obj/item/borg/upgrade/modkit", {
	maximum_bounty: 25,
	bounties_reaped: null,
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/bounty"),
	modifier: 1.25,
	cost: 30,
	name: "death syphon",
	desc: "Killing or assisting in killing a creature permenantly increases your damage against that type of creature.",
});

// kinetic_accelerator.dm:440
rt.def("/obj/item/borg/upgrade/modkit/bounty/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bounties_reaped = list();
	return f.dot;
});

// kinetic_accelerator.dm:443
rt.def("/obj/item/borg/upgrade/modkit/bounty/proc/projectile_prehit", function* projectile_prehit(f: Frame, K: Value, target: Value, KA: Value) {
	let i: Value = null, SM: Value = null;
	if (!rt.istype(target, T("/mob/living"))) return f.dot;
	let L: Value = target;
	let existing_marks: Value = L.has_status_effect_list(T("/datum/status_effect/syphon_mark"));
	for (i of each(existing_marks)) {
		if ((SM = i).reward_target == this) {
			SM.reward_target = null;
			yield* qdel(SM);
		}
	}
	yield* L.apply_status_effect(T("/datum/status_effect/syphon_mark"), this);
	return f.dot;
}, true);

// kinetic_accelerator.dm:454
rt.def("/obj/item/borg/upgrade/modkit/bounty/proc/projectile_strike", function* projectile_strike(f: Frame, K: Value, target_turf: Value, target: Value, KA: Value) {
	if (!rt.istype(target, T("/mob/living"))) return f.dot;
	let L: Value = target;
	if (!rt.index(this.bounties_reaped, L.type)) return f.dot;
	let kill_modifier: Value = 1;
	if (K.pressure_decrease_active) {
		kill_modifier *= K.pressure_decrease;
	}
	let armor: Value = L.run_armor_check(K.def_zone, K.flag, "", "", K.armour_penetration);
	yield* L.apply_damage(rt.index(this.bounties_reaped, L.type) * kill_modifier, K.damage_type, K.def_zone, armor);
	return f.dot;
}, true);

// kinetic_accelerator.dm:465
rt.def("/obj/item/borg/upgrade/modkit/bounty/proc/get_kill", function get_kill(f: Frame, L: Value) {
	let bonus_mod: Value = 1;
	if (rt.istype(L, T("/mob/living/simple_animal/hostile/megafauna"))) {
		bonus_mod = 4;
	}
	if (!rt.index(this.bounties_reaped, L.type)) {
		rt.setAt(this.bounties_reaped, L.type, min(this.modifier * bonus_mod, this.maximum_bounty));
	} else {
		rt.setAt(this.bounties_reaped, L.type, min(rt.index(this.bounties_reaped, L.type) + this.modifier * bonus_mod, this.maximum_bounty));
	}
	return f.dot;
});

rt.type(9853, "/obj/item/borg/upgrade/modkit/indoors", "/obj/item/borg/upgrade/modkit", {
	modifier: 2,
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/indoors"),
	maximum_of_type: 2,
	cost: 35,
	name: "decrease pressure penalty",
	desc: "A syndicate modification kit that increases the damage a kinetic accelerator does in a high pressure environment.",
});

// kinetic_accelerator.dm:482
rt.def("/obj/item/borg/upgrade/modkit/indoors/proc/modify_projectile", function modify_projectile(f: Frame, K: Value) {
	K.pressure_decrease *= this.modifier;
	return f.dot;
});

rt.type(9854, "/obj/item/borg/upgrade/modkit/trigger_guard", "/obj/item/borg/upgrade/modkit", {
	cost: 20,
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/trigger_guard"),
	name: "modified trigger guard",
	desc: "Allows creatures normally incapable of firing guns to operate the weapon when installed.",
});

// kinetic_accelerator.dm:493
rt.def("/obj/item/borg/upgrade/modkit/trigger_guard/proc/install", function* install(f: Frame, KA: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	KA.trigger_guard = -1;
	return f.dot;
}, true);

// kinetic_accelerator.dm:498
rt.def("/obj/item/borg/upgrade/modkit/trigger_guard/proc/uninstall", function* uninstall(f: Frame, KA: Value) {
	KA.trigger_guard = 1;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9855, "/obj/item/borg/upgrade/modkit/chassis_mod", "/obj/item/borg/upgrade/modkit", {
	chassis_icon: "kineticgun_u",
	chassis_name: "super-kinetic accelerator",
	cost: 0,
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/chassis_mod"),
	name: "super chassis",
	desc: "Makes your KA yellow. All the fun of having a more powerful KA without actually having a more powerful KA.",
});

// kinetic_accelerator.dm:513
rt.def("/obj/item/borg/upgrade/modkit/chassis_mod/proc/install", function* install(f: Frame, KA: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	KA.icon_state = this.chassis_icon;
	KA.name = this.chassis_name;
	return f.dot;
}, true);

// kinetic_accelerator.dm:519
rt.def("/obj/item/borg/upgrade/modkit/chassis_mod/proc/uninstall", function* uninstall(f: Frame, KA: Value) {
	KA.icon_state = rt.initial(f, KA, "icon_state");
	KA.name = rt.initial(f, KA, "name");
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9857, "/obj/item/borg/upgrade/modkit/tracer", "/obj/item/borg/upgrade/modkit", {
	bolt_color: "#FFFFFF",
	cost: 0,
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/tracer"),
	name: "white tracer bolts",
	desc: "Causes kinetic accelerator bolts to have a white tracer trail and explosion.",
});

// kinetic_accelerator.dm:537
rt.def("/obj/item/borg/upgrade/modkit/tracer/proc/modify_projectile", function modify_projectile(f: Frame, K: Value) {
	K.icon_state = "ka_tracer";
	K.color = this.bolt_color;
	return f.dot;
});

rt.type(9858, "/obj/item/borg/upgrade/modkit/tracer/adjustable", "/obj/item/borg/upgrade/modkit/tracer", {
	name: "adjustable tracer bolts",
	desc: "Causes kinetic accelerator bolts to have a adjustably-colored tracer trail and explosion. Use in-hand to change color.",
});

// kinetic_accelerator.dm:545
rt.def("/obj/item/borg/upgrade/modkit/tracer/adjustable/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	this.bolt_color = (yield* g.op(f, "Prompt", [256], [null, null, "Choose Color", user, null]));
	return f.dot;
}, true);
