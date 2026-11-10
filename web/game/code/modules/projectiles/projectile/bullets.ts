// Based on /tg/station's code/modules/projectiles/projectile/bullets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(8808, "/obj/item/projectile/bullet/pellet", "/obj/item/projectile/bullet", {
	name: "pellet",
	damage: 12.5,
});

// bullets.dm:39
rt.def("/obj/item/projectile/bullet/pellet/proc/Range", function* Range(f: Frame) {
	yield* parent_proc();
	if (!((this.damage += -0.75) < 0)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(8809, "/obj/item/projectile/bullet/pellet/weak", "/obj/item/projectile/bullet/pellet", {
	damage: 6,
});

// bullets.dm:48
rt.def("/obj/item/projectile/bullet/pellet/weak/proc/New", function* New(f: Frame) {
	this.range = rand(1, 8);
	yield* parent_proc();
	return f.dot;
}, true);

// bullets.dm:52
rt.def("/obj/item/projectile/bullet/pellet/weak/proc/on_range", function* on_range(f: Frame) {
	yield* do_sparks(1, 1, this);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8810, "/obj/item/projectile/bullet/pellet/overload", "/obj/item/projectile/bullet/pellet", {
	damage: 3,
});

// bullets.dm:59
rt.def("/obj/item/projectile/bullet/pellet/overload/proc/New", function* New(f: Frame) {
	this.range = rand(1, 10);
	yield* parent_proc();
	return f.dot;
}, true);

// bullets.dm:63
rt.def("/obj/item/projectile/bullet/pellet/overload/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* explosion(f.args[0], 0, 0, 2);
	return f.dot;
}, true, { args: ["target", "blocked"] });

// bullets.dm:67
rt.def("/obj/item/projectile/bullet/pellet/overload/proc/on_range", function* on_range(f: Frame) {
	yield* explosion(this, 0, 0, 2);
	yield* do_sparks(3, 1, this);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8816, "/obj/item/projectile/bullet/midbullet3/fire", "/obj/item/projectile/bullet/midbullet3", {});

// bullets.dm:91
rt.def("/obj/item/projectile/bullet/midbullet3/fire/proc/on_hit", function* on_hit(f: Frame, target: Value, blocked: Value) {
	let M: Value = null;
	blocked ??= 0;
	if (!(yield* parent_proc(target, blocked))) return f.dot;
	yield* (M = target).adjust_fire_stacks(1);
	yield* M.IgniteMob();
	return f.dot;
}, true);

rt.type(8803, "/obj/item/projectile/bullet/incendiary", "/obj/item/projectile/bullet", {});

// bullets.dm:114
rt.def("/obj/item/projectile/bullet/incendiary/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!rt.istype(f.args[0], T("/mob/living/carbon"))) return f.dot;
	yield* (M = f.args[0]).adjust_fire_stacks(4);
	yield* M.IgniteMob();
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8805, "/obj/item/projectile/bullet/incendiary/shell", "/obj/item/projectile/bullet/incendiary", {
	name: "incendiary slug",
	damage: 20,
});

// bullets.dm:126
rt.def("/obj/item/projectile/bullet/incendiary/shell/proc/Move", function* Move(f: Frame) {
	let location: Value = null;
	yield* parent_proc();
	if (!(location = rt.getStep(f, this, 0))) return f.dot;
	yield* new_(T("/obj/effect/hotspot"), location);
	yield* location.hotspot_expose(700, 50, 1);
	return f.dot;
}, true);

rt.type(8822, "/obj/item/projectile/bullet/honker", "/obj/item/projectile/bullet", {
	damage: 0,
	knockdown: 60,
	forcedodge: 1,
	nodamage: 1,
	hitsound: rt.rsc("sound/items/bikehorn.ogg"),
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	icon_state: "banana",
	range: 200,
});

// bullets.dm:160
rt.def("/obj/item/projectile/bullet/honker/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.SpinAnimation();
	return f.dot;
}, true);

rt.type(8820, "/obj/item/projectile/bullet/meteorshot", "/obj/item/projectile/bullet", {
	name: "meteor",
	icon: rt.rsc("icons/obj/meteor.dmi"),
	icon_state: "dust",
	damage: 30,
	knockdown: 160,
	hitsound: rt.rsc("sound/effects/meteorimpact.ogg"),
});

// bullets.dm:164
rt.def("/obj/item/projectile/bullet/meteorshot/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!rt.istype(f.args[0], T("/atom/movable"))) return f.dot;
	let M: Value = f.args[0];
	let throw_target: Value = get_edge_target_turf(M, rt.getDir(f, this, get_step_away(M, this)));
	yield* M.throw_at(throw_target, 3, 2);
	return f.dot;
}, true, { args: ["target", "blocked"] });

// bullets.dm:171
rt.def("/obj/item/projectile/bullet/meteorshot/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.SpinAnimation();
	return f.dot;
}, true);

rt.type(8823, "/obj/item/projectile/bullet/mime", "/obj/item/projectile/bullet", {
	damage: 20,
});

// bullets.dm:179
rt.def("/obj/item/projectile/bullet/mime/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!rt.istype(f.args[0], T("/mob/living/carbon"))) return f.dot;
	(M = f.args[0]).silent = max(M.silent, 10);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8824, "/obj/item/projectile/bullet/dart", "/obj/item/projectile/bullet", {
	piercing: 0,
	name: "dart",
	icon_state: "cbbolt",
	damage: 6,
});

// bullets.dm:192
rt.def("/obj/item/projectile/bullet/dart/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(50);
	this.reagents.set_reacting(0);
	return f.dot;
}, true);

// bullets.dm:197
rt.def("/obj/item/projectile/bullet/dart/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon"))) {
		M = f.args[0];
		if (f.args[1] != 100) {
			if (yield* M.can_inject(null, 0, this.def_zone, this.piercing)) {
				yield* parent_proc();
				yield* this.reagents.reaction(M, INJECT);
				yield* this.reagents.trans_to(M, this.reagents.total_volume);
				return 1;
			} else {
				f.args[1] = 100;
				f.args[0].visible_message(fmt("<span class='danger'>＄！ was deflected!</span>", [this]), fmt("<span class='userdanger'>You were protected against ％！!</span>", [this]));
			}
		}
	}
	yield* parent_proc(f.args[0], f.args[1]);
	this.reagents.set_reacting(1);
	yield* this.reagents.handle_reactions();
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8825, "/obj/item/projectile/bullet/dart/metalfoam", "/obj/item/projectile/bullet/dart", {});

// bullets.dm:216
rt.def("/obj/item/projectile/bullet/dart/metalfoam/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.reagents.add_reagent("aluminium", 15);
	yield* this.reagents.add_reagent("foaming_agent", 5);
	yield* this.reagents.add_reagent("facid", 5);
	return f.dot;
}, true);

rt.type(8827, "/obj/item/projectile/bullet/neurotoxin", "/obj/item/projectile/bullet", {
	name: "neurotoxin spit",
	icon_state: "neurotoxin",
	damage: 5,
	damage_type: "tox",
	knockdown: 100,
});

// bullets.dm:234
rt.def("/obj/item/projectile/bullet/neurotoxin/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon/alien"))) {
		this.knockdown = 0;
		this.nodamage = 1;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8828, "/obj/item/projectile/bullet/dnainjector", "/obj/item/projectile/bullet", {
	injector: null,
	name: "１DNA injector",
	icon_state: "syringeproj",
});

// bullets.dm:245
rt.def("/obj/item/projectile/bullet/dnainjector/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon"))) {
		M = f.args[0];
		if (f.args[1] != 100) {
			if (yield* M.can_inject(null, 0, this.def_zone, 0)) {
				if (yield* this.injector.inject(M, this.firer)) {
					yield* qdel(this.injector);
					this.injector = null;
					return 1;
				}
			} else {
				f.args[1] = 100;
				f.args[0].visible_message(fmt("<span class='danger'>＄！ was deflected!</span>", [this]), fmt("<span class='userdanger'>You were protected against ％！!</span>", [this]));
			}
		}
	}
	return (yield* parent_proc());
}, true, { args: ["target", "blocked"] });

// bullets.dm:259
rt.def("/obj/item/projectile/bullet/dnainjector/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.injector);
	this.injector = null;
	return (yield* parent_proc());
}, true);

rt.type(8829, "/obj/item/projectile/bullet/sniper", "/obj/item/projectile/bullet", {
	breakthings: 1,
	speed: 0,
	damage: 70,
	knockdown: 100,
	dismemberment: 50,
	armour_penetration: 50,
});

// bullets.dm:273
rt.def("/obj/item/projectile/bullet/sniper/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[1] != 100 && !ismob(f.args[0]) && this.breakthings) {
		yield* f.args[0].ex_act(rand(1, 2));
	}
	return (yield* parent_proc());
}, true, { args: ["target", "blocked"] });

rt.type(8831, "/obj/item/projectile/bullet/sniper/gang/sleeper", "/obj/item/projectile/bullet/sniper/gang", {
	breakthings: 0,
	nodamage: 1,
	knockdown: 0,
	dismemberment: 0,
});

// bullets.dm:290
rt.def("/obj/item/projectile/bullet/sniper/gang/sleeper/proc/on_hit", function* on_hit(f: Frame, target: Value, blocked: Value) {
	let L: Value = null;
	blocked ??= 0;
	if (blocked != 100 && rt.istype(target, T("/mob/living"))) {
		yield* (L = target).blur_eyes(8);
		if (L.staminaloss >= 40) {
			yield* L.Sleeping(400);
		} else {
			yield* L.adjustStaminaLoss(55);
		}
	}
	return 1;
}, true);

rt.type(8832, "/obj/item/projectile/bullet/sniper/soporific", "/obj/item/projectile/bullet/sniper", {
	breakthings: 0,
	armour_penetration: 0,
	nodamage: 1,
	dismemberment: 0,
	knockdown: 0,
});

// bullets.dm:307
rt.def("/obj/item/projectile/bullet/sniper/soporific/proc/on_hit", function* on_hit(f: Frame) {
	let L: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[1] != 100 && rt.istype(f.args[0], T("/mob/living"))) {
		yield* (L = f.args[0]).Sleeping(400);
	}
	return (yield* parent_proc());
}, true, { args: ["target", "blocked"] });

rt.type(8833, "/obj/item/projectile/bullet/sniper/haemorrhage", "/obj/item/projectile/bullet/sniper", {
	breakthings: 0,
	armour_penetration: 15,
	damage: 15,
	dismemberment: 0,
	knockdown: 0,
});

// bullets.dm:321
rt.def("/obj/item/projectile/bullet/sniper/haemorrhage/proc/on_hit", function* on_hit(f: Frame) {
	let C: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[1] != 100 && rt.istype(f.args[0], T("/mob/living/carbon"))) {
		yield* (C = f.args[0]).bleed(100);
	}
	return (yield* parent_proc());
}, true, { args: ["target", "blocked"] });

rt.type(8836, "/obj/item/projectile/bullet/saw/bleeding", "/obj/item/projectile/bullet/saw", {
	damage: 20,
	armour_penetration: 0,
});

// bullets.dm:350
rt.def("/obj/item/projectile/bullet/saw/bleeding/proc/on_hit", function* on_hit(f: Frame) {
	let C: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(f.args[1] != 100 && rt.istype(f.args[0], T("/mob/living/carbon")))) return f.dot;
	yield* (C = f.args[0]).bleed(35);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8839, "/obj/item/projectile/bullet/saw/incen", "/obj/item/projectile/bullet/saw", {
	damage: 7,
	armour_penetration: 0,
});

// bullets.dm:368
rt.def("/obj/item/projectile/bullet/saw/incen/proc/Move", function* Move(f: Frame) {
	let location: Value = null;
	yield* parent_proc();
	if (!(location = rt.getStep(f, this, 0))) return f.dot;
	yield* new_(T("/obj/effect/hotspot"), location);
	yield* location.hotspot_expose(700, 50, 1);
	return f.dot;
}, true);

// bullets.dm:375
rt.def("/obj/item/projectile/bullet/saw/incen/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!rt.istype(f.args[0], T("/mob/living/carbon"))) return f.dot;
	yield* (M = f.args[0]).adjust_fire_stacks(3);
	yield* M.IgniteMob();
	return f.dot;
}, true, { args: ["target", "blocked"] });
