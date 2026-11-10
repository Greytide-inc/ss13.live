// Based on /tg/station's code/modules/mining/equipment/kinetic_crusher.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5632, "/obj/item/weapon/twohanded/required/kinetic_crusher", "/obj/item/weapon/twohanded/required", {
	trophies: null,
	charged: 1,
	charge_time: 15,
	force_unwielded: 20,
	force_wielded: 20,
	throw_speed: 4,
	light_range: 5,
	light_power: 1,
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "mining_hammer1",
	item_state: "mining_hammer1",
	name: "proto-kinetic crusher",
	desc: "An early design of the proto-kinetic accelerator, it is little more than an combination of various mining tools cobbled together, forming a high-tech club. While it is an effective mining tool, it did little to aid any but the most skilled and/or suicidal miners against local fauna.",
	force: 20,
	w_class: 4,
	slot_flags: 1024,
	throwforce: 5,
	armour_penetration: 10,
	materials: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	sharpness: 1,
});

// kinetic_crusher.dm:23
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.trophies = list();
	this.materials = rt.alist(f, ["$metal", 1150, "$glass", 2075]);
	this.attack_verb = list("smashed", "crushed", "cleaved", "chopped", "pulped");
	return f.dot;
});

// kinetic_crusher.dm:28
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	if (this.trophies) {
		for (I of each(this.trophies)) {
			yield* qdel(I);
		}
		this.trophies.Cut();
	}
	return (yield* parent_proc());
}, true);

// kinetic_crusher.dm:32
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/examine", function examine(f: Frame, user: Value) {
	let t: Value = null, _T: Value = null;
	parent_proc();
	to_chat(user, "<span class='notice'>Mark a large creature with the destabilizing force, then hit them in melee to do <b>50</b> damage.</span>");
	to_chat(user, "<span class='notice'>Does <b>80</b> damage if the target is backstabbed, instead of <b>50</b>.</span>");
	for (t of each(this.trophies)) {
		_T = t;
		to_chat(user, fmt("<span class='notice'>It has ＇！ attached, which cause ＀.</span>", [_T, _T.effect_desc()]));
	}
	return f.dot;
}, false);

// kinetic_crusher.dm:40
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/attackby", function* attackby(f: Frame, A: Value, user: Value) {
	let t: Value = null, _T: Value = null, _T_0: Value = null;
	if (rt.istype(A, T("/obj/item/weapon/crowbar"))) {
		if (rt.length(this.trophies)) {
			to_chat(user, `<span class='notice'>You remove ${this}'s trophies.</span>`);
			playsound(this.loc, A.usesound, 100, 1);
			for (t of each(this.trophies)) {
				yield* (_T = t).remove_from(this, user);
			}
		} else {
			to_chat(user, `<span class='warning'>There are no trophies on ${this}.</span>`);
		}
	} else if (rt.istype(A, T("/obj/item/crusher_trophy"))) {
		yield* (_T_0 = A).add_to(this, user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// kinetic_crusher.dm:56
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let t: Value = null, _T: Value = null;
	let C: Value = target.has_status_effect(T("/datum/status_effect/crusher_damage"));
	let target_health: Value = target.health;
	yield* parent_proc();
	for (t of each(this.trophies)) {
		if (!(!target || target.gc_destroyed)) {
			yield* (_T = t).on_melee_hit(target, user);
		}
	}
	if (!(!(!C || C.gc_destroyed) && !(!target || target.gc_destroyed))) return f.dot;
	C.total_damage += target_health - target.health;
	return f.dot;
}, true);

// kinetic_crusher.dm:67
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let proj_turf: Value = null, D: Value = null, t: Value = null, _T: Value = null, CM: Value = null, t_4: Value = null, _T_5: Value = null;
	if (!proximity_flag && this.charged) {
		if (!isturf((proj_turf = user.loc))) {
			return f.dot;
		}
		D = (yield* new_(T("/obj/item/projectile/destabilizer"), proj_turf));
		for (t of each(this.trophies)) {
			(_T = t).on_projectile_fire(D, user);
		}
		yield* D.preparePixelProjectile(target, rt.getStep(f, target, 0), user);
		D.firer = user;
		D.hammer_synced = this;
		playsound(user, rt.rsc("sound/weapons/plasma_cutter.ogg"), 100, 1);
		yield* D.fire();
		this.charged = 0;
		this.icon_state = "mining_hammer1_uncharged";
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/Recharge"))), this.charge_time);
		return f.dot;
	}
	if (!(proximity_flag && rt.istype(target, T("/mob/living")))) return f.dot;
	let L: Value = target;
	if (!(CM = L.has_status_effect(T("/datum/status_effect/crusher_mark"))) || CM.hammer_synced != this || !(yield* L.remove_status_effect(T("/datum/status_effect/crusher_mark")))) {
		return f.dot;
	}
	let C: Value = L.has_status_effect(T("/datum/status_effect/crusher_damage"));
	let target_health: Value = L.health;
	for (t_4 of each(this.trophies)) {
		yield* (_T_5 = t_4).on_mark_detonation(target, user);
	}
	if (!L || L.gc_destroyed) return f.dot;
	if (!(!C || C.gc_destroyed)) {
		C.total_damage += target_health - L.health;
	}
	yield* new_(T("/obj/effect/temp_visual/kinetic_blast"), rt.getStep(f, L, 0));
	let backstab_dir: Value = rt.getDir(f, user, L);
	let def_check: Value = (yield* L.getarmor({ type: "bomb" }));
	if (rt.bitAnd(user.dir, backstab_dir) && rt.bitAnd(L.dir, backstab_dir)) {
		if (!(!C || C.gc_destroyed)) {
			C.total_damage += 80;
		}
		yield* L.apply_damage(80, "brute", { blocked: def_check });
		playsound(user, rt.rsc("sound/weapons/kenetic_accel.ogg"), 100, 1);
	} else {
		if (!(!C || C.gc_destroyed)) {
			C.total_damage += 50;
		}
		yield* L.apply_damage(50, "brute", { blocked: def_check });
	}
	return f.dot;
}, true);

// kinetic_crusher.dm:111
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/Recharge", function Recharge(f: Frame) {
	if (this.charged) return f.dot;
	this.charged = 1;
	this.icon_state = "mining_hammer1";
	playsound(this.loc, rt.rsc("sound/weapons/kenetic_reload.ogg"), 60, 1);
	return f.dot;
});

rt.type(8890, "/obj/item/projectile/destabilizer", "/obj/item/projectile", {
	hammer_synced: null,
	name: "destabilizing force",
	icon_state: "pulse1",
	nodamage: 1,
	damage: 0,
	damage_type: "brute",
	flag: "bomb",
	range: 6,
	log_override: 1,
});

// kinetic_crusher.dm:130
rt.def("/obj/item/projectile/destabilizer/proc/Destroy", function* Destroy(f: Frame) {
	this.hammer_synced = null;
	return (yield* parent_proc());
}, true);

// kinetic_crusher.dm:133
rt.def("/obj/item/projectile/destabilizer/proc/on_hit", function* on_hit(f: Frame) {
	let L: Value = null, had_effect: Value = null, CM: Value = null, t: Value = null, _T: Value = null, target_turf: Value = null, M: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (rt.istype(f.args[0], T("/mob/living"))) {
		L = f.args[0];
		had_effect = L.has_status_effect(T("/datum/status_effect/crusher_mark"));
		CM = (yield* L.apply_status_effect(T("/datum/status_effect/crusher_mark"), this.hammer_synced));
		if (this.hammer_synced) {
			for (t of each(this.hammer_synced.trophies)) {
				(_T = t).on_mark_application(f.args[0], CM, had_effect);
			}
		}
	}
	if (rt.istype((target_turf = rt.getStep(f, f.args[0], 0)), T("/turf/closed/mineral"))) {
		yield* new_(T("/obj/effect/temp_visual/kinetic_blast"), (M = target_turf));
		yield* M.gets_drilled(this.firer);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(10105, "/obj/item/crusher_trophy", "/obj/item", {
	bonus_value: 10,
	denied_type: rt.typePath("/obj/item/crusher_trophy"),
	name: "tail spike",
	desc: "A strange spike with no usage.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "tail_spike",
});

// Empty in tg.
rt.def("/obj/item/crusher_trophy/proc/on_melee_hit", undefined, false, { args: ["target", "user"] });

// Empty in tg.
rt.def("/obj/item/crusher_trophy/proc/on_projectile_fire", undefined, false, { args: ["marker", "user"] });

// Empty in tg.
rt.def("/obj/item/crusher_trophy/proc/on_mark_application", undefined, false, { args: ["target", "mark", "had_mark"] });

// Empty in tg.
rt.def("/obj/item/crusher_trophy/proc/on_mark_detonation", undefined, false, { args: ["target", "user"] });

// kinetic_crusher.dm:158
rt.def("/obj/item/crusher_trophy/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>Causes ${this.effect_desc()} when attached to a kinetic crusher.</span>`);
	return f.dot;
}, false);

// kinetic_crusher.dm:162
rt.def("/obj/item/crusher_trophy/proc/effect_desc", function effect_desc(f: Frame) {
	return "errors";
});

// kinetic_crusher.dm:165
rt.def("/obj/item/crusher_trophy/proc/attackby", function* attackby(f: Frame, A: Value, user: Value) {
	if (rt.istype(A, T("/obj/item/weapon/twohanded/required/kinetic_crusher"))) {
		yield* this.add_to(A, user);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// kinetic_crusher.dm:171
rt.def("/obj/item/crusher_trophy/proc/add_to", function* add_to(f: Frame, H: Value, user: Value) {
	let t: Value = null, _T: Value = null;
	for (t of each(H.trophies)) {
		if (rt.op(f, "IsType", [], [(_T = t), this.denied_type]) || rt.op(f, "IsType", [], [this, _T.denied_type])) {
			to_chat(user, `<span class='warning'>You can't seem to attach ${this} to ${H}. Maybe remove a few trophies?</span>`);
			return 0;
		}
	}
	if (!(yield* user.transferItemToLoc(this, H))) {
		return f.dot;
	}
	H.trophies += this;
	to_chat(user, `<span class='notice'>You attach ${this} to ${H}.</span>`);
	return 1;
}, true);

// kinetic_crusher.dm:183
rt.def("/obj/item/crusher_trophy/proc/remove_from", function* remove_from(f: Frame, H: Value, user: Value) {
	yield* this.forceMove(rt.getStep(f, H, 0));
	H.trophies -= this;
	return 1;
}, true);

rt.type(10106, "/obj/item/crusher_trophy/goliath_tentacle", "/obj/item/crusher_trophy", {
	missing_health_ratio: 0.1,
	missing_health_desc: 10,
	denied_type: rt.typePath("/obj/item/crusher_trophy/goliath_tentacle"),
	bonus_value: 2,
	name: "goliath tentacle",
	desc: "A sliced-off goliath tentacle. Suitable as a trophy for a kinetic crusher.",
	icon_state: "goliath_tentacle",
});

// kinetic_crusher.dm:203
rt.def("/obj/item/crusher_trophy/goliath_tentacle/proc/effect_desc", function effect_desc(f: Frame) {
	return `mark detonation to do <b>${this.bonus_value}</b> more damage for every <b>${this.missing_health_desc}</b> health you are missing`;
});

// kinetic_crusher.dm:206
rt.def("/obj/item/crusher_trophy/goliath_tentacle/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	let missing_health: Value = user.health - user.maxHealth;
	missing_health *= this.missing_health_ratio;
	missing_health *= this.bonus_value;
	if (!(missing_health > 0)) return f.dot;
	yield* target.adjustBruteLoss(missing_health);
	return f.dot;
}, true);

rt.type(10107, "/obj/item/crusher_trophy/watcher_wing", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/watcher_wing"),
	bonus_value: 8,
	name: "watcher wing",
	desc: "A wing ripped from a watcher. Suitable as a trophy for a kinetic crusher.",
	icon_state: "watcher_wing",
});

// kinetic_crusher.dm:221
rt.def("/obj/item/crusher_trophy/watcher_wing/proc/effect_desc", function effect_desc(f: Frame) {
	let $1: any;
	let $0: any = this.bonus_value * 0.1;
	if (this.bonus_value * 0.1 == 1) {
		$1 = "";
	} else {
		$1 = "s";
	}
	return `mark detonation to prevent certain creatures from using certain attacks for <b>${$0}</b> second${$1}`;
});

// kinetic_crusher.dm:224
rt.def("/obj/item/crusher_trophy/watcher_wing/proc/on_mark_detonation", function on_mark_detonation(f: Frame, target: Value, user: Value) {
	let H: Value = null;
	if (!rt.istype(target, T("/mob/living/simple_animal/hostile"))) return f.dot;
	if (!(H = target).ranged) return f.dot;
	if (H.ranged_cooldown_time >= rt.worldTime(f)) {
		H.ranged_cooldown_time += this.bonus_value;
	} else {
		H.ranged_cooldown_time = this.bonus_value + rt.worldTime(f);
	}
	return f.dot;
});

rt.type(10108, "/obj/item/crusher_trophy/legion_skull", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/legion_skull"),
	bonus_value: 3,
	name: "legion skull",
	desc: "A dead and lifeless legion skull. Suitable as a trophy for a kinetic crusher.",
	icon_state: "legion_skull",
});

// kinetic_crusher.dm:241
rt.def("/obj/item/crusher_trophy/legion_skull/proc/effect_desc", function effect_desc(f: Frame) {
	let $0: any = this.bonus_value * 0.1;
	return `a kinetic crusher to recharge <b>${$0}</b> second${this.bonus_value * 0.1 == 1 ? "" : "s"} faster`;
});

// kinetic_crusher.dm:244
rt.def("/obj/item/crusher_trophy/legion_skull/proc/add_to", function* add_to(f: Frame, H: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	H.charge_time -= this.bonus_value;
	return f.dot;
}, true);

// kinetic_crusher.dm:249
rt.def("/obj/item/crusher_trophy/legion_skull/proc/remove_from", function* remove_from(f: Frame, H: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	H.charge_time += this.bonus_value;
	return f.dot;
}, true);

rt.type(10109, "/obj/item/crusher_trophy/miner_eye", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/miner_eye"),
	name: "eye of a blood-drunk hunter",
	desc: "Its pupil is collapsed and turned to mush. Suitable as a trophy for a kinetic crusher.",
	icon_state: "hunter_eye",
});

// kinetic_crusher.dm:261
rt.def("/obj/item/crusher_trophy/miner_eye/proc/effect_desc", function effect_desc(f: Frame) {
	return "mark detonation to grant stun immunity and <b>90%</b> damage reduction for <b>1</b> second";
});

// kinetic_crusher.dm:264
rt.def("/obj/item/crusher_trophy/miner_eye/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	yield* user.apply_status_effect(T("/datum/status_effect/blooddrunk"));
	return f.dot;
}, true);

rt.type(10110, "/obj/item/crusher_trophy/tail_spike", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/tail_spike"),
	bonus_value: 5,
	desc: "A spike taken from a ash drake's tail. Suitable as a trophy for a kinetic crusher.",
});

// kinetic_crusher.dm:273
rt.def("/obj/item/crusher_trophy/tail_spike/proc/effect_desc", function effect_desc(f: Frame) {
	return `mark detonation to do <b>${this.bonus_value}</b> damage to nearby creatures and push them back`;
});

// kinetic_crusher.dm:276
rt.def("/obj/item/crusher_trophy/tail_spike/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	let L: Value = null;
	for (L of each(oview(2, user), T("/mob/living"))) {
		if (L.stat == 2) {
			continue;
		}
		playsound(L, rt.rsc("sound/magic/fireball.ogg"), 20, 1);
		yield* new_(T("/obj/effect/temp_visual/fire"), L.loc);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/crusher_trophy/tail_spike/proc/pushback"), L, user)), 1);
		yield* L.adjustBruteLoss(this.bonus_value);
	}
	return f.dot;
}, true);

// kinetic_crusher.dm:285
rt.def("/obj/item/crusher_trophy/tail_spike/proc/pushback", function* pushback(f: Frame, target: Value, user: Value) {
	if (!(!target.anchored || rt.istype(target, T("/mob/living/simple_animal/hostile/megafauna")))) return f.dot;
	yield* step(target, rt.getDir(f, user, target));
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }, { type: 8, path: "/mob/living" }] });

rt.type(10111, "/obj/item/crusher_trophy/demon_claws", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/demon_claws"),
	bonus_value: 10,
	name: "demon claws",
	desc: "A set of blood-drenched claws from a massive demon's hand. Suitable as a trophy for a kinetic crusher.",
	icon_state: "demon_claws",
	gender: "plural",
}, { global: { damage_heal_order: 743 } });

// kinetic_crusher.dm:299
rt.def("/obj/item/crusher_trophy/demon_claws/proc/effect_desc", function effect_desc(f: Frame) {
	return `melee hits to do <b>${this.bonus_value * 0.2}</b> more damage and heal you for <b>${this.bonus_value * 0.1}</b>; this effect is increased by <b>500%</b> during mark detonation`;
});

// kinetic_crusher.dm:302
rt.def("/obj/item/crusher_trophy/demon_claws/proc/add_to", function* add_to(f: Frame, H: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	H.force += this.bonus_value * 0.2;
	H.force_unwielded += this.bonus_value * 0.2;
	H.force_wielded += this.bonus_value * 0.2;
	return f.dot;
}, true);

// kinetic_crusher.dm:309
rt.def("/obj/item/crusher_trophy/demon_claws/proc/remove_from", function* remove_from(f: Frame, H: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	H.force -= this.bonus_value * 0.2;
	H.force_unwielded -= this.bonus_value * 0.2;
	H.force_wielded -= this.bonus_value * 0.2;
	return f.dot;
}, true);

// kinetic_crusher.dm:316
rt.def("/obj/item/crusher_trophy/demon_claws/proc/on_melee_hit", function* on_melee_hit(f: Frame, target: Value, user: Value) {
	yield* user.heal_ordered_damage(this.bonus_value * 0.1, rt.gl("damage_heal_order#5"));
	return f.dot;
}, true);

// kinetic_crusher.dm:319
rt.def("/obj/item/crusher_trophy/demon_claws/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	yield* target.adjustBruteLoss(this.bonus_value * 0.8);
	yield* user.heal_ordered_damage(this.bonus_value * 0.4, rt.gl("damage_heal_order#5"));
	return f.dot;
}, true);

rt.type(10112, "/obj/item/crusher_trophy/blaster_tubes", "/obj/item/crusher_trophy", {
	deadly_shot: 0,
	denied_type: rt.typePath("/obj/item/crusher_trophy/blaster_tubes"),
	bonus_value: 15,
	name: "blaster tubes",
	desc: "The blaster tubes from a colossus's arm. Suitable as a trophy for a kinetic crusher.",
	icon_state: "blaster_tubes",
	gender: "plural",
});

// kinetic_crusher.dm:333
rt.def("/obj/item/crusher_trophy/blaster_tubes/proc/effect_desc", function effect_desc(f: Frame) {
	return `mark detonation to make the next destabilizer shot deal <b>${this.bonus_value}</b> damage but move slower`;
});

// kinetic_crusher.dm:337
rt.def("/obj/item/crusher_trophy/blaster_tubes/proc/on_projectile_fire", function on_projectile_fire(f: Frame, marker: Value, user: Value) {
	if (!this.deadly_shot) return f.dot;
	marker.name = `deadly ${marker.name}`;
	marker.icon_state = "chronobolt";
	marker.damage = this.bonus_value;
	marker.nodamage = 0;
	marker.speed = 2;
	this.deadly_shot = 0;
	return f.dot;
});

// kinetic_crusher.dm:346
rt.def("/obj/item/crusher_trophy/blaster_tubes/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	this.deadly_shot = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/crusher_trophy/blaster_tubes/proc/reset_deadly_shot"))), 300, 2);
	return f.dot;
}, true);

rt.type(10113, "/obj/item/crusher_trophy/vortex_talisman", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/vortex_talisman"),
	name: "vortex talisman",
	desc: "A glowing trinket that was originally the Hierophant's beacon. Suitable as a trophy for a kinetic crusher.",
	icon_state: "vortex_talisman",
});

// kinetic_crusher.dm:359
rt.def("/obj/item/crusher_trophy/vortex_talisman/proc/effect_desc", function effect_desc(f: Frame) {
	return "mark detonation to create a barrier you can pass";
});

// kinetic_crusher.dm:362
rt.def("/obj/item/crusher_trophy/vortex_talisman/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	let _T: Value = null, otherT: Value = null;
	yield* new_(T("/obj/effect/temp_visual/hierophant/wall/crusher"), (_T = rt.getStep(f, user, 0)), user);
	if (otherT = rt.getStep(f, _T, turn(user.dir, 90))) {
		yield* new_(T("/obj/effect/temp_visual/hierophant/wall/crusher"), otherT, user);
	}
	if (!(otherT = rt.getStep(f, _T, turn(user.dir, -90)))) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/hierophant/wall/crusher"), otherT, user);
	return f.dot;
}, true);
