// From code/modules/projectiles/projectile/energy.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/projectile/energy/electrode/proc/on_hit  (code/modules/projectiles/projectile/energy.dm:23)  may sleep
rt.def("/obj/item/projectile/energy/electrode/proc/on_hit", function* on_hit(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])]))) || rt.ge(live(f.args[1]), 100))) {
		yield* g.call(f, P("/proc/do_sparks"), null, [1, 1, live(f.src)]);
	} else {
		if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
		if ((truthy(rt.gv(f, "dna", (C = live(f.args[0])))) && truthy((yield* g.callName(f, rt.fv(f, "dna", live(C)), "check_mutation", ["Hulk"]))))) {
			yield* g.callName(f, live(C), "say", [rt.op(f, "PickUnweighted", [5], [";RAAAAAAAARGH!", ";HNNNNNNNNNGGGGGGH!", ";GWAAAAAAAARRRHHH!", "NNNNNNNNGGGGGGGGHH!", ";AAAAAAARRRGH!"])]);
		} else {
			if (!truthy(rt.bitAnd(rt.fv(f, "status_flags", live(C)), 2))) return f.dot;
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(C), P("/mob/living/proc/do_jitter_animation"), rt.sv(f, "jitter")])), 5]);
		}
	}
	return f.dot;
}, true, { args: ["target", "blocked"] });

// /obj/item/projectile/energy/electrode/proc/on_range  (code/modules/projectiles/projectile/energy.dm:34)  may sleep
rt.def("/obj/item/projectile/energy/electrode/proc/on_range", function* on_range(f: Frame) {
	yield* g.call(f, P("/proc/do_sparks"), null, [1, 1, live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
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

// /obj/item/projectile/energy/net/proc/Initialize  (code/modules/projectiles/projectile/energy.dm:46)  may sleep
rt.def("/obj/item/projectile/energy/net/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "SpinAnimation");
	return f.dot;
}, true);

// /obj/item/projectile/energy/net/proc/on_hit  (code/modules/projectiles/projectile/energy.dm:50)  may sleep
rt.def("/obj/item/projectile/energy/net/proc/on_hit", function* on_hit(f: Frame) {
	let Tloc: Value = null;
	f.vars = () => [Tloc];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		Tloc = rt.getStep(f, live(f.args[0]), 0);
		if (!truthy(rt.locateIn(f, T("/obj/effect/nettingportal"), live(Tloc)))) {
			yield* g.new_(f, T("/obj/effect/nettingportal"), [live(Tloc)]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "blocked"] });

// /obj/item/projectile/energy/net/proc/on_range  (code/modules/projectiles/projectile/energy.dm:57)  may sleep
rt.def("/obj/item/projectile/energy/net/proc/on_range", function* on_range(f: Frame) {
	yield* g.call(f, P("/proc/do_sparks"), null, [1, 1, live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
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

// /obj/effect/nettingportal/proc/Initialize  (code/modules/projectiles/projectile/energy.dm:69)  may sleep
rt.def("/obj/effect/nettingportal/proc/Initialize", function* Initialize(f: Frame) {
	let teletarget: Value = null, com: Value = null;
	let $e: any;
	f.vars = () => [teletarget, com, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	teletarget = null;
	com = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/teleporter"));
	while (($e = rt.next(f, 0)) !== undefined) {
		com = $e;
		if (truthy(rt.fv(f, "target", live(com)))) {
			if (((truthy(rt.fv(f, "power_station", live(com))) && truthy(rt.gv(f, "teleporter_hub", rt.fv(f, "power_station", live(com))))) && truthy(rt.gv(f, "engaged", rt.fv(f, "power_station", live(com)))))) {
				teletarget = rt.fv(f, "target", live(com));
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/nettingportal/proc/pop"), live(teletarget)])), 30]);
	return f.dot;
}, true);

// /obj/effect/nettingportal/proc/pop  (code/modules/projectiles/projectile/energy.dm:80)  may sleep
rt.def("/obj/effect/nettingportal/proc/pop", function* pop(f: Frame, teletarget: Value) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [teletarget, L, $e];
	if (truthy(live(teletarget))) {
		L = null;
		rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			yield* g.call(f, P("/proc/do_teleport"), null, [live(L), live(teletarget), 2]);
		}
		rt.endFor(f, 0);
	} else {
		L = null;
		rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			yield* g.call(f, P("/proc/do_teleport"), null, [live(L), live(L), 15]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
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

// /obj/item/projectile/energy/trap/proc/on_hit  (code/modules/projectiles/projectile/energy.dm:98)  may sleep
rt.def("/obj/item/projectile/energy/trap/proc/on_hit", function* on_hit(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])]))) || rt.ge(live(f.args[1]), 100))) {
		yield* g.new_(f, T("/obj/item/weapon/restraints/legcuffs/beartrap/energy"), [rt.getStep(f, rt.sv(f, "loc"), 0)]);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
			yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/restraints/legcuffs/beartrap/energy"), [rt.getStep(f, live(f.args[0]), 0)]))), "Crossed", [live(f.args[0])]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "blocked"] });

// /obj/item/projectile/energy/trap/proc/on_range  (code/modules/projectiles/projectile/energy.dm:106)  may sleep
rt.def("/obj/item/projectile/energy/trap/proc/on_range", function* on_range(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/restraints/legcuffs/beartrap/energy"), [rt.sv(f, "loc")]);
	yield* g.callSuper(f, [], rt.Args.Same);
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

// /obj/item/projectile/energy/trap/cyborg/proc/on_hit  (code/modules/projectiles/projectile/energy.dm:118)  may sleep
rt.def("/obj/item/projectile/energy/trap/cyborg/proc/on_hit", function* on_hit(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])]))) || rt.ge(live(f.args[1]), 100))) {
		yield* g.call(f, P("/proc/do_sparks"), null, [1, 1, live(f.src)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/restraints/legcuffs/beartrap/energy/cyborg"), [rt.getStep(f, live(f.args[0]), 0)]))), "Crossed", [live(f.args[0])]);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 10, 8]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "blocked"] });

// /obj/item/projectile/energy/trap/cyborg/proc/on_range  (code/modules/projectiles/projectile/energy.dm:128)  may sleep
rt.def("/obj/item/projectile/energy/trap/cyborg/proc/on_range", function* on_range(f: Frame) {
	yield* g.call(f, P("/proc/do_sparks"), null, [1, 1, live(f.src)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(8857, "/obj/item/projectile/energy/tesla", "/obj/item/projectile/energy", {
	chain: null,
	name: "tesla bolt",
	icon_state: "tesla_projectile",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/blue_laser"),
});

// /obj/item/projectile/energy/tesla/proc/fire  (code/modules/projectiles/projectile/energy.dm:171)  may sleep
rt.def("/obj/item/projectile/energy/tesla/proc/fire", function* fire(f: Frame) {
	if (truthy(rt.sv(f, "firer"))) {
		rt.setSv(f, "chain", (yield* g.callName(f, rt.sv(f, "firer"), "Beam", [null, live(f.src), "icon_state", fmt("lightning＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 12]))]), "time", 9.999999848243207e+30, "maxdistance", 9.999999848243207e+30], rt.Args.Named)));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["setAngle"], waitfor: false });

// /obj/item/projectile/energy/tesla/proc/Destroy  (code/modules/projectiles/projectile/energy.dm:175)  may sleep
rt.def("/obj/item/projectile/energy/tesla/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "chain")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(8858, "/obj/item/projectile/energy/tesla/revolver", "/obj/item/projectile/energy/tesla", {
	name: "energy orb",
});

// /obj/item/projectile/energy/tesla/revolver/proc/on_hit  (code/modules/projectiles/projectile/energy.dm:182)  may sleep
rt.def("/obj/item/projectile/energy/tesla/revolver/proc/on_hit", function* on_hit(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/tesla_zap"), null, [live(f.args[0]), 3, 10000]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["target"] });

rt.type(8859, "/obj/item/projectile/energy/tesla/cannon", "/obj/item/projectile/energy/tesla", {
	name: "tesla orb",
});

// /obj/item/projectile/energy/tesla/cannon/proc/on_hit  (code/modules/projectiles/projectile/energy.dm:191)  may sleep
rt.def("/obj/item/projectile/energy/tesla/cannon/proc/on_hit", function* on_hit(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/tesla_zap"), null, [null, live(f.args[0]), null, 3, null, 10000, "explosive", 0, "stun_mobs", 0], rt.Args.Named);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["target"] });
