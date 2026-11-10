// Based on /tg/station's code/modules/projectiles/projectile/energy.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(8848, "/obj/item/projectile/energy/electrode", "/obj/item/projectile/energy", {
	name: "electrode",
	icon_state: "spark",
	color: "#FFFF00",
	nodamage: 1,
	knockdown: 100,
	stutter: 5,
	jitter: 20,
	hitsound: rt.rsc("sound/weapons/taserhit.ogg"),
	range: 7,
});

// energy.dm:23
rt.def("/obj/item/projectile/energy/electrode/proc/on_hit", function* on_hit(f: Frame) {
	let C: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!ismob(f.args[0]) || f.args[1] >= 100) {
		yield* do_sparks(1, 1, this);
	} else {
		if (!rt.istype(f.args[0], T("/mob/living/carbon"))) return f.dot;
		if ((C = f.args[0]).dna && C.dna.check_mutation("Hulk")) {
			yield* C.say(pick(";RAAAAAAAARGH!", ";HNNNNNNNNNGGGGGGH!", ";GWAAAAAAAARRRHHH!", "NNNNNNNNGGGGGGGGHH!", ";AAAAAAARRRGH!"));
		} else {
			if (!rt.bitAnd(C.status_flags, 2)) return f.dot;
			yield* addtimer((yield* new_(T("/datum/callback"), C, P("/mob/living/proc/do_jitter_animation"), this.jitter)), 5);
		}
	}
	return f.dot;
}, true, { args: ["target", "blocked"] });

// energy.dm:34
rt.def("/obj/item/projectile/energy/electrode/proc/on_range", function* on_range(f: Frame) {
	yield* do_sparks(1, 1, this);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8849, "/obj/item/projectile/energy/net", "/obj/item/projectile/energy", {
	name: "energy netting",
	icon_state: "e_netting",
	damage: 10,
	damage_type: "stamina",
	hitsound: rt.rsc("sound/weapons/taserhit.ogg"),
	range: 10,
});

// energy.dm:46
rt.def("/obj/item/projectile/energy/net/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.SpinAnimation();
	return f.dot;
}, true);

// energy.dm:50
rt.def("/obj/item/projectile/energy/net/proc/on_hit", function* on_hit(f: Frame) {
	let Tloc: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (rt.istype(f.args[0], T("/mob/living"))) {
		Tloc = rt.getStep(f, f.args[0], 0);
		if (!rt.locateIn(f, T("/obj/effect/nettingportal"), Tloc)) {
			yield* new_(T("/obj/effect/nettingportal"), Tloc);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["target", "blocked"] });

// energy.dm:57
rt.def("/obj/item/projectile/energy/net/proc/on_range", function* on_range(f: Frame) {
	yield* do_sparks(1, 1, this);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(12094, "/obj/effect/nettingportal", "/obj/effect", {
	light_range: 3,
	anchored: 1,
	name: "DRAGnet teleportation field",
	desc: "A field of bluespace energy, locking on to teleport a target.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "dragnetfield",
});

// energy.dm:69
rt.def("/obj/effect/nettingportal/proc/Initialize", function* Initialize(f: Frame) {
	let teletarget: Value = null, com: Value = null;
	f.dot = (yield* parent_proc());
	for (com of each(GLOB.machines, T("/obj/machinery/computer/teleporter"))) {
		if (com.target) {
			if (com.power_station && com.power_station.teleporter_hub && com.power_station.engaged) {
				teletarget = com.target;
			}
		}
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/nettingportal/proc/pop"), teletarget)), 30);
	return f.dot;
}, true);

// energy.dm:80
rt.def("/obj/effect/nettingportal/proc/pop", function* pop(f: Frame, teletarget: Value) {
	let L: Value = null;
	if (teletarget) {
		for (L of each(rt.getStep(f, this, 0), T("/mob/living"))) {
			yield* do_teleport(L, teletarget, 2);
		}
	} else {
		L = null;
		for (L of each(rt.getStep(f, this, 0), T("/mob/living"))) {
			yield* do_teleport(L, L, 15);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(8850, "/obj/item/projectile/energy/trap", "/obj/item/projectile/energy", {
	name: "energy snare",
	icon_state: "e_snare",
	nodamage: 1,
	knockdown: 20,
	hitsound: rt.rsc("sound/weapons/taserhit.ogg"),
	range: 4,
});

// energy.dm:98
rt.def("/obj/item/projectile/energy/trap/proc/on_hit", function* on_hit(f: Frame) {
	let B: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!ismob(f.args[0]) || f.args[1] >= 100) {
		yield* new_(T("/obj/item/weapon/restraints/legcuffs/beartrap/energy"), rt.getStep(f, this.loc, 0));
	} else if (rt.istype(f.args[0], T("/mob/living/carbon"))) {
		yield* (B = (yield* new_(T("/obj/item/weapon/restraints/legcuffs/beartrap/energy"), rt.getStep(f, f.args[0], 0)))).Crossed(f.args[0]);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["target", "blocked"] });

// energy.dm:106
rt.def("/obj/item/projectile/energy/trap/proc/on_range", function* on_range(f: Frame) {
	yield* new_(T("/obj/item/weapon/restraints/legcuffs/beartrap/energy"), this.loc);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8851, "/obj/item/projectile/energy/trap/cyborg", "/obj/item/projectile/energy/trap", {
	name: "Energy Bola",
	icon_state: "e_snare",
	nodamage: 1,
	knockdown: 0,
	hitsound: rt.rsc("sound/weapons/taserhit.ogg"),
	range: 10,
});

// energy.dm:118
rt.def("/obj/item/projectile/energy/trap/cyborg/proc/on_hit", function* on_hit(f: Frame) {
	let B: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!ismob(f.args[0]) || f.args[1] >= 100) {
		yield* do_sparks(1, 1, this);
		yield* qdel(this);
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon"))) {
		yield* (B = (yield* new_(T("/obj/item/weapon/restraints/legcuffs/beartrap/energy/cyborg"), rt.getStep(f, f.args[0], 0)))).Crossed(f.args[0]);
	}
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 10, 8);
	yield* parent_proc();
	return f.dot;
}, true, { args: ["target", "blocked"] });

// energy.dm:128
rt.def("/obj/item/projectile/energy/trap/cyborg/proc/on_range", function* on_range(f: Frame) {
	yield* do_sparks(1, 1, this);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(8857, "/obj/item/projectile/energy/tesla", "/obj/item/projectile/energy", {
	chain: null,
	name: "tesla bolt",
	icon_state: "tesla_projectile",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/blue_laser"),
});

// energy.dm:171
rt.def("/obj/item/projectile/energy/tesla/proc/fire", function* fire(f: Frame, setAngle: Value) {
	if (this.firer) {
		this.chain = (yield* this.firer.Beam(this, { icon_state: `lightning${rand(1, 12)}`, time: 1e+31, maxdistance: 1e+31 }));
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// energy.dm:175
rt.def("/obj/item/projectile/energy/tesla/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.chain);
	return (yield* parent_proc());
}, true);

rt.type(8858, "/obj/item/projectile/energy/tesla/revolver", "/obj/item/projectile/energy/tesla", {
	name: "energy orb",
});

// energy.dm:182
rt.def("/obj/item/projectile/energy/tesla/revolver/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	f.dot = (yield* parent_proc());
	if (rt.istype(target, T("/mob/living"))) {
		yield* tesla_zap(target, 3, 10000);
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(8859, "/obj/item/projectile/energy/tesla/cannon", "/obj/item/projectile/energy/tesla", {
	name: "tesla orb",
});

// energy.dm:191
rt.def("/obj/item/projectile/energy/tesla/cannon/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	f.dot = (yield* parent_proc());
	yield* tesla_zap(target, 3, 10000, { explosive: 0, stun_mobs: 0 });
	yield* qdel(this);
	return f.dot;
}, true);
