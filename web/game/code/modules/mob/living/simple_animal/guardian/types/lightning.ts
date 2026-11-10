// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/types/lightning.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4878, "/mob/living/simple_animal/hostile/guardian/beam", "/mob/living/simple_animal/hostile/guardian", {
	summonerchain: null,
	enemychains: null,
	successfulshocks: 0,
	range: 7,
	playstyle_string: "<span class='holoparasite'>As a <b>lightning</b> type, you will apply lightning chains to targets on attack and have a lightning chain to your summoner. Lightning chains will shock anyone near them.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Tesla, a shocking, lethal source of power.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Lightning modules active. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! Caught one! It's a lightning carp! Everyone else goes zap zap.</span>",
	melee_damage_lower: 7,
	melee_damage_upper: 7,
	attacktext: "shocks",
	melee_damage_type: "fire",
	attack_sound: rt.rsc("sound/machines/defib_zap.ogg"),
	damage_coeff: null,
});

// lightning.dm:19
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.enemychains = list();
	this.damage_coeff = rt.alist(f, ["brute", 0.7, "fire", 0.7, "tox", 0.7, "clone", 0.7, "stamina", 0, "oxy", 0.7]);
	return f.dot;
});

// lightning.dm:23
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let chain: Value = null, B: Value = null, C: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(this.target, T("/mob/living")) && this.target != this && this.target != this.summoner)) return f.dot;
	this.cleardeletedchains();
	for (chain of each(this.enemychains)) {
		if ((B = chain).target == this.target) {
			return f.dot;
		}
	}
	if (rt.len(f, this.enemychains) > 2) {
		yield* qdel((C = pick(this.enemychains)));
		this.enemychains -= C;
	}
	this.enemychains += (yield* this.Beam(this.target, `lightning${rand(1, 12)}`, { time: 70, maxdistance: 7, beam_type: T("/obj/effect/ebeam/chain") }));
	return f.dot;
}, true);

// lightning.dm:37
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.removechains();
	return (yield* parent_proc());
}, true);

// lightning.dm:41
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/Manifest", function* Manifest(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (this.summoner) {
		this.summonerchain = (yield* this.Beam(this.summoner, `lightning${rand(1, 12)}`, { time: 1e+31, maxdistance: 1e+31, beam_type: T("/obj/effect/ebeam/chain") }));
	}
	while (this.loc != this.summoner) {
		if (this.successfulshocks > 5) {
			this.successfulshocks = 0;
		}
		if (yield* this.shockallchains()) {
			this.successfulshocks++;
		}
		yield* sleep(3);
	}
	return f.dot;
}, true);

// lightning.dm:53
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/Recall", function* Recall(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.removechains();
	return f.dot;
}, true);

// lightning.dm:58
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/cleardeletedchains", function cleardeletedchains(f: Frame) {
	let chain: Value = null, cd: Value = null;
	if (this.summonerchain && (!this.summonerchain || this.summonerchain.gc_destroyed)) {
		this.summonerchain = null;
	}
	if (!rt.len(f, this.enemychains)) return f.dot;
	for (chain of each(this.enemychains)) {
		cd = chain;
		if (!chain || !cd || cd.gc_destroyed) {
			this.enemychains -= chain;
		}
	}
	return f.dot;
});

// lightning.dm:68
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/shockallchains", function* shockallchains(f: Frame) {
	let chain: Value = null;
	f.dot = 0;
	this.cleardeletedchains();
	if (this.summoner) {
		if (!this.summonerchain) {
			this.summonerchain = (yield* this.Beam(this.summoner, `lightning${rand(1, 12)}`, { time: 1e+31, maxdistance: 1e+31, beam_type: T("/obj/effect/ebeam/chain") }));
		}
		f.dot += (yield* this.chainshock(this.summonerchain));
	}
	if (!rt.len(f, this.enemychains)) return f.dot;
	for (chain of each(this.enemychains)) {
		f.dot += (yield* this.chainshock(chain));
	}
	return f.dot;
}, true);

// lightning.dm:79
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/removechains", function* removechains(f: Frame) {
	let chain: Value = null;
	if (this.summonerchain) {
		yield* qdel(this.summonerchain);
		this.summonerchain = null;
	}
	if (!rt.len(f, this.enemychains)) return f.dot;
	for (chain of each(this.enemychains)) {
		yield* qdel(chain);
	}
	this.enemychains = list();
	return f.dot;
}, true);

// lightning.dm:88
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/chainshock", function* chainshock(f: Frame, B: Value) {
	let E: Value = null, chainpart: Value = null, _T: Value = null, TU: Value = null, turf: Value = null, _T_2: Value = null, L: Value = null, C: Value = null, H: Value = null;
	f.dot = 0;
	let turfs: Value = list();
	for (E of each(B.elements)) {
		if ((chainpart = E) && chainpart.x && chainpart.y && chainpart.z) {
			(turfs = rt.modify(turfs, (_T = get_turf_pixel(chainpart)), rt.bitOr));
			if (_T != rt.getStep(f, B.origin, 0) && _T != rt.getStep(f, B.target, 0)) {
				TU = null;
				for (TU of each(circlerange(_T, 1), T("/turf"))) {
					(turfs = rt.modify(turfs, TU, rt.bitOr));
				}
			}
		}
	}
	for (turf of each(turfs)) {
		_T_2 = turf;
		L = null;
		for (L of each(_T_2, T("/mob/living"))) {
			if (L.stat != 2 && L != this && L != this.summoner) {
				if (this.hasmatchingsummoner(L)) {
					continue;
				}
				if (this.successfulshocks > 4) {
					if (rt.istype(L, T("/mob/living/carbon"))) {
						if (rt.istype((C = L), T("/mob/living/carbon/human"))) {
							yield* (H = C).electrocution_animation(20);
						}
						C.jitteriness += 1000;
						C.do_jitter_animation(this.jitteriness);
						C.stuttering += 1;
						rt.spawnTail(f, 20, "/mob/living/simple_animal/hostile/guardian/beam/proc/chainshock: spawn at modules/mob/living/simple_animal/guardian/types/lightning.dm:112", B, turfs, E, chainpart, _T, TU, turf, _T_2, L, C, H);
					}
					L.visible_message(`<span class='danger'>${L} was shocked by the lightning chain!</span>`, "<span class='userdanger'>You are shocked by the lightning chain!</span>", "<span class='italics'>You hear a heavy electrical crack.</span>");
				}
				yield* L.adjustFireLoss(1.2);
				f.dot = 1;
			}
		}
	}
	return f.dot;
}, true);

// a spawn(20) body of /mob/living/simple_animal/hostile/guardian/beam/proc/chainshock, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/hostile/guardian/beam/proc/chainshock: spawn at modules/mob/living/simple_animal/guardian/types/lightning.dm:112", function* (f: Frame, B: Value, turfs: Value, E: Value, chainpart: Value, _T: Value, TU: Value, turf: Value, _T_2: Value, L: Value, C: Value, H: Value) {
	if (C) {
		C.jitteriness = max(C.jitteriness - 990, 10);
	}
	return null;
});
