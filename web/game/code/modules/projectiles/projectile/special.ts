// Based on /tg/station's code/modules/projectiles/projectile/special.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8916, "/obj/item/projectile/ion", "/obj/item/projectile", {
	damage: 0,
	damage_type: "fire",
	nodamage: 1,
	flag: "energy",
	name: "ion bolt",
	icon_state: "ion",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/ion"),
});

// special.dm:12
rt.def("/obj/item/projectile/ion/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* empulse(f.args[0], 1, 1);
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8917, "/obj/item/projectile/ion/weak", "/obj/item/projectile/ion", {});

// special.dm:20
rt.def("/obj/item/projectile/ion/weak/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* empulse(f.args[0], 0, 0);
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8840, "/obj/item/projectile/bullet/gyro", "/obj/item/projectile/bullet", {
	name: "explosive bolt",
	icon_state: "bolter",
	damage: 50,
});

// special.dm:31
rt.def("/obj/item/projectile/bullet/gyro/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* explosion(f.args[0], -1, 0, 2);
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8841, "/obj/item/projectile/bullet/a40mm", "/obj/item/projectile/bullet", {
	name: "40mm grenade",
	desc: "USE A WEEL GUN",
	icon_state: "bolter",
	damage: 60,
});

// special.dm:42
rt.def("/obj/item/projectile/bullet/a40mm/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* explosion(f.args[0], -1, 0, 2, 1, 0, { flame_range: 3 });
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8842, "/obj/item/projectile/bullet/a84mm", "/obj/item/projectile/bullet", {
	anti_armour_damage: 200,
	name: "anti-armour rocket",
	desc: "USE A WEEL GUN",
	icon_state: "atrocket",
	damage: 80,
	armour_penetration: 100,
	dismemberment: 100,
});

// special.dm:56
rt.def("/obj/item/projectile/bullet/a84mm/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null, S: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* explosion(f.args[0], -1, 1, 3, 1, 0, { flame_range: 4 });
	if (rt.istype(f.args[0], T("/obj/mecha"))) {
		yield* (M = f.args[0]).take_damage(this.anti_armour_damage);
	}
	if (rt.istype(f.args[0], T("/mob/living/silicon"))) {
		yield* (S = f.args[0]).take_overall_damage(this.anti_armour_damage * 0.75, this.anti_armour_damage * 0.25);
	}
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8843, "/obj/item/projectile/bullet/srmrocket", "/obj/item/projectile/bullet", {
	name: "SRM-8 Rocket",
	desc: "Boom",
	icon_state: "missile",
	damage: 30,
});

// special.dm:74
rt.def("/obj/item/projectile/bullet/srmrocket/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!rt.istype(f.args[0], T("/mob/living"))) {
		yield* explosion(f.args[0], 0, 1, 2, 4);
	} else {
		yield* explosion(f.args[0], 0, 0, 2, 4);
	}
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8899, "/obj/item/projectile/temp", "/obj/item/projectile", {
	temperature: 100,
	name: "freeze beam",
	icon_state: "ice_2",
	damage: 0,
	damage_type: "fire",
	nodamage: 1,
	flag: "energy",
});

// special.dm:92
rt.def("/obj/item/projectile/temp/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (rt.istype(f.args[0], T("/mob/living"))) {
		(M = f.args[0]).bodytemperature = this.temperature;
	}
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8918, "/obj/item/projectile/meteor", "/obj/item/projectile", {
	damage: 0,
	damage_type: "brute",
	nodamage: 1,
	flag: "bullet",
	name: "meteor",
	icon: rt.rsc("icons/obj/meteor.dmi"),
	icon_state: "small1",
});

// special.dm:112
rt.def("/obj/item/projectile/meteor/proc/Bump", function* Bump(f: Frame, A: Value, yes: Value) {
	let M: Value = null;
	if (!yes) {
		return f.dot;
	}
	if (A == this.firer) {
		this.loc = A.loc;
		return f.dot;
	}
	yield* A.ex_act(2);
	playsound(this.loc, rt.rsc("sound/effects/meteorimpact.ogg"), 40, 1);
	for (M of each(urange(10, this), T("/mob"))) {
		if (!M.stat) {
			shake_camera(M, 3, 1);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(8860, "/obj/item/projectile/energy/floramut", "/obj/item/projectile/energy", {
	name: "alpha somatoray",
	icon_state: "energy",
	damage: 0,
	damage_type: "tox",
	nodamage: 1,
	flag: "energy",
});

// special.dm:133
rt.def("/obj/item/projectile/energy/floramut/proc/on_hit", function* on_hit(f: Frame) {
	let C: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!rt.istype(f.args[0], T("/mob/living/carbon"))) return f.dot;
	if ((C = f.args[0]).dna.species.id != "pod") return f.dot;
	yield* C.randmuti();
	yield* C.randmut();
	yield* C.updateappearance();
	yield* C.domutcheck();
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8887, "/obj/item/projectile/beam/mindflayer", "/obj/item/projectile/beam", {
	name: "flayer ray",
});

// special.dm:154
rt.def("/obj/item/projectile/beam/mindflayer/proc/on_hit", function* on_hit(f: Frame) {
	let M: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!rt.istype(f.args[0], T("/mob/living/carbon/human"))) return f.dot;
	yield* (M = f.args[0]).adjustBrainLoss(20);
	M.hallucination += 20;
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8716, "/obj/item/ammo_casing/energy/wormhole", "/obj/item/ammo_casing/energy", {
	gun: null,
	e_cost: 0,
	select_name: "blue",
	projectile_type: rt.typePath("/obj/item/projectile/beam/wormhole"),
	fire_sound: rt.rsc("sound/weapons/pulse3.ogg"),
});

// special.dm:177
rt.def("/obj/item/ammo_casing/energy/wormhole/proc/New", function New(f: Frame, wh: Value) {
	this.gun = wh;
	return f.dot;
});

rt.type(8888, "/obj/item/projectile/beam/wormhole", "/obj/item/projectile/beam", {
	gun: null,
	name: "bluespace beam",
	icon_state: "spark",
	hitsound: "sparks",
	damage: 3,
	color: "#33CCFF",
});

// special.dm:180
rt.def("/obj/item/projectile/beam/wormhole/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	let portal_destination: Value = null;
	if (ismob(target)) {
		portal_destination = pick(orange(6, this));
		yield* do_teleport(target, portal_destination);
		return (yield* parent_proc());
	}
	if (!this.gun) {
		yield* qdel(this);
	}
	yield* this.gun.create_portal(this, rt.getStep(f, this, 0));
	return f.dot;
}, true);

rt.type(8844, "/obj/item/projectile/bullet/frag12", "/obj/item/projectile/bullet", {
	name: "explosive slug",
	damage: 25,
	knockdown: 50,
});

// special.dm:194
rt.def("/obj/item/projectile/bullet/frag12/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* explosion(f.args[0], -1, 0, 1);
	return 1;
}, true, { args: ["target", "blocked"] });

rt.type(8919, "/obj/item/projectile/plasma", "/obj/item/projectile", {
	mine_range: 3,
	damage_type: "brute",
	damage: 5,
	range: 4,
	dismemberment: 20,
	name: "plasma blast",
	icon_state: "plasmacutter",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/purple_laser"),
});

// special.dm:209
rt.def("/obj/item/projectile/plasma/proc/Initialize", function* Initialize(f: Frame) {
	let proj_turf: Value = null, environment: Value = null, pressure: Value = null;
	f.dot = (yield* parent_proc());
	if (!isturf((proj_turf = rt.getStep(f, this, 0)))) {
		return f.dot;
	}
	if (!(environment = proj_turf.return_air())) return f.dot;
	if (!((pressure = environment.return_pressure()) < 60)) return f.dot;
	this.name = `full strength ${this.name}`;
	this.damage *= 4;
	return f.dot;
}, true);

// special.dm:221
rt.def("/obj/item/projectile/plasma/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	let M: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.istype(target, T("/turf/closed/mineral"))) return f.dot;
	yield* (M = target).gets_drilled(this.firer);
	if (this.mine_range) {
		this.mine_range--;
		this.range++;
	}
	if (!(this.range > 0)) return f.dot;
	return -1;
}, true);

rt.type(8923, "/obj/item/projectile/gravityrepulse", "/obj/item/projectile", {
	T: null,
	power: 4,
	thrown_items: null,
	damage: 0,
	damage_type: "brute",
	nodamage: 1,
	name: "repulsion bolt",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "chronofield",
	hitsound: rt.rsc("sound/weapons/wave.ogg"),
	color: "#33CCFF",
});

// special.dm:260
rt.def("/obj/item/projectile/gravityrepulse/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.thrown_items = list();
	return f.dot;
});

// special.dm:263
rt.def("/obj/item/projectile/gravityrepulse/proc/Initialize", function* Initialize(f: Frame) {
	let C: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.istype((C = this.loc), T("/obj/item/ammo_casing/energy/gravityrepulse"))) return f.dot;
	this.power = min(C.gun.power, 15);
	return f.dot;
}, true);

// special.dm:269
rt.def("/obj/item/projectile/gravityrepulse/proc/on_hit", function* on_hit(f: Frame) {
	let A: Value = null, throwtarget: Value = null, F: Value = null;
	f.dot = (yield* parent_proc());
	this.T = rt.getStep(f, this, 0);
	for (A of each(range(this.T, this.power), T("/atom/movable"))) {
		if (A == this || this.firer && A == this.firer || A.anchored || rt.index(this.thrown_items, A)) {
			continue;
		}
		throwtarget = get_edge_target_turf(this, rt.getDir(f, this, get_step_away(A, this)));
		yield* A.throw_at(throwtarget, this.power + 1, 1);
		rt.setAt(this.thrown_items, A, A);
	}
	for (F of each(range(this.T, this.power), T("/turf"))) {
		yield* new_(T("/obj/effect/temp_visual/gravpush"), F);
	}
	return f.dot;
}, true);

rt.type(8924, "/obj/item/projectile/gravityattract", "/obj/item/projectile", {
	T: null,
	power: 4,
	thrown_items: null,
	damage: 0,
	damage_type: "brute",
	nodamage: 1,
	name: "attraction bolt",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "chronofield",
	hitsound: rt.rsc("sound/weapons/wave.ogg"),
	color: "#FF6600",
});

// special.dm:291
rt.def("/obj/item/projectile/gravityattract/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.thrown_items = list();
	return f.dot;
});

// special.dm:294
rt.def("/obj/item/projectile/gravityattract/proc/Initialize", function* Initialize(f: Frame) {
	let C: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.istype((C = this.loc), T("/obj/item/ammo_casing/energy/gravityattract"))) return f.dot;
	this.power = min(C.gun.power, 15);
	return f.dot;
}, true);

// special.dm:300
rt.def("/obj/item/projectile/gravityattract/proc/on_hit", function* on_hit(f: Frame) {
	let A: Value = null, F: Value = null;
	f.dot = (yield* parent_proc());
	this.T = rt.getStep(f, this, 0);
	for (A of each(range(this.T, this.power), T("/atom/movable"))) {
		if (A == this || this.firer && A == this.firer || A.anchored || rt.index(this.thrown_items, A)) {
			continue;
		}
		yield* A.throw_at(this.T, this.power + 1, 1);
		rt.setAt(this.thrown_items, A, A);
	}
	for (F of each(range(this.T, this.power), T("/turf"))) {
		yield* new_(T("/obj/effect/temp_visual/gravpush"), F);
	}
	return f.dot;
}, true);

rt.type(8925, "/obj/item/projectile/gravitychaos", "/obj/item/projectile", {
	T: null,
	power: 4,
	thrown_items: null,
	damage: 0,
	damage_type: "brute",
	nodamage: 1,
	name: "gravitational blast",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "chronofield",
	hitsound: rt.rsc("sound/weapons/wave.ogg"),
	color: "#101010",
});

// special.dm:321
rt.def("/obj/item/projectile/gravitychaos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.thrown_items = list();
	return f.dot;
});

// special.dm:324
rt.def("/obj/item/projectile/gravitychaos/proc/Initialize", function* Initialize(f: Frame) {
	let C: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.istype((C = this.loc), T("/obj/item/ammo_casing/energy/gravitychaos"))) return f.dot;
	this.power = min(C.gun.power, 15);
	return f.dot;
}, true);

// special.dm:330
rt.def("/obj/item/projectile/gravitychaos/proc/on_hit", function* on_hit(f: Frame) {
	let A: Value = null, Z: Value = null;
	f.dot = (yield* parent_proc());
	this.T = rt.getStep(f, this, 0);
	for (A of each(range(this.T, this.power), T("/atom/movable"))) {
		if (A == this || this.firer && A == this.firer || A.anchored || rt.index(this.thrown_items, A)) {
			continue;
		}
		yield* A.throw_at(get_edge_target_turf(A, pick(GLOB.cardinal)), this.power + 1, 1);
		rt.setAt(this.thrown_items, A, A);
	}
	for (Z of each(range(this.T, this.power), T("/turf"))) {
		yield* new_(T("/obj/effect/temp_visual/gravpush"), Z);
	}
	return f.dot;
}, true);
