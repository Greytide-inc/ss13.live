// Based on /tg/station's code/game/objects/effects/spawners/gibspawner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11937, "/obj/effect/gibspawner", "/obj/effect", {
	sparks: 0,
	virusProb: 20,
	gibtypes: null,
	gibamounts: null,
	gibdirections: null,
});

// gibspawner.dm:5
rt.def("/obj/effect/gibspawner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gibtypes = list();

	this.gibamounts = list();

	this.gibdirections = list();
	return f.dot;
});

// gibspawner.dm:10
rt.def("/obj/effect/gibspawner/proc/Initialize", function* Initialize(f: Frame, mapload: Value, viruses: Value, MobDNA: Value) {
	let gib: Value = null, s: Value = null, j: Value = null, gibType: Value = null, digester: Value = null, D: Value = null, viruus: Value = null, directions: Value = null;
	yield* parent_proc();
	if (rt.len(f, this.gibtypes) != rt.len(f, this.gibamounts) || rt.len(f, this.gibamounts) != rt.len(f, this.gibdirections)) {
		to_chat(rt.world(), "<span class='danger'>Gib list length mismatch!</span>");
		return f.dot;
	}
	if (this.sparks) {
		yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(2, 1, this.loc);
		yield* s.start();
	}
	let i: Value = 1;
	while (i <= rt.len(f, this.gibtypes)) {
		if (rt.index(this.gibamounts, i)) {
			j = 1;
			while (j <= rt.index(this.gibamounts, i)) {
				gibType = rt.index(this.gibtypes, i);
				gib = (yield* new_(gibType, this.loc));
				if (rt.istype(this.loc, T("/mob/living/carbon"))) {
					(digester = this.loc).stomach_contents += gib;
				}
				if (viruses && rt.len(f, viruses) > 0) {
					D = null;
					for (D of each(viruses, T("/datum/disease"))) {
						if (prob(this.virusProb)) {
							viruus = (yield* D.Copy(1));
							gib.viruses += viruus;
							viruus.holder = gib;
						}
					}
				}
				if (MobDNA) {
					rt.setAt(gib.blood_DNA, MobDNA.unique_enzymes, MobDNA.blood_type);
				} else if (rt.istype(this, T("/obj/effect/gibspawner/generic"))) {
					rt.setAt(gib.blood_DNA, "Non-human DNA", "A+");
				}
				directions = rt.index(this.gibdirections, i);
				if (isturf(this.loc)) {
					if (rt.len(f, directions)) {
						yield* gib.streak(directions);
					}
				}
				j++;
			}
		}
		i++;
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11938, "/obj/effect/gibspawner/generic", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// gibspawner.dm:53
rt.def("/obj/effect/gibspawner/generic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gibtypes = list(T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs/core"));
	this.gibamounts = list(2, 2, 1);
	return f.dot;
});

// gibspawner.dm:57
rt.def("/obj/effect/gibspawner/generic/proc/Initialize", function* Initialize(f: Frame) {
	playsound(this, rt.rsc("sound/effects/blobattack.ogg"), 40, 1);
	this.gibdirections = list(list(8, 9, 10, 1), list(4, 5, 6, 2), list());
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11939, "/obj/effect/gibspawner/human", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// gibspawner.dm:62
rt.def("/obj/effect/gibspawner/human/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gibtypes = list(T("/obj/effect/decal/cleanable/blood/gibs/up"), T("/obj/effect/decal/cleanable/blood/gibs/down"), T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs/body"), T("/obj/effect/decal/cleanable/blood/gibs/limb"), T("/obj/effect/decal/cleanable/blood/gibs/core"));
	this.gibamounts = list(1, 1, 1, 1, 1, 1, 1);
	return f.dot;
});

// gibspawner.dm:66
rt.def("/obj/effect/gibspawner/human/proc/Initialize", function* Initialize(f: Frame) {
	playsound(this, rt.rsc("sound/effects/blobattack.ogg"), 50, 1);
	this.gibdirections = list(list(1, 5, 9), list(2, 6, 10), list(8, 9, 10), list(4, 5, 6), GLOB.alldirs, GLOB.alldirs, list());
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11940, "/obj/effect/gibspawner/humanbodypartless", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// gibspawner.dm:72
rt.def("/obj/effect/gibspawner/humanbodypartless/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gibtypes = list(T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs/core"), T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs/core"), T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs/torso"));
	this.gibamounts = list(1, 1, 1, 1, 1, 1);
	return f.dot;
});

// gibspawner.dm:76
rt.def("/obj/effect/gibspawner/humanbodypartless/proc/Initialize", function* Initialize(f: Frame) {
	playsound(this, rt.rsc("sound/effects/blobattack.ogg"), 50, 1);
	this.gibdirections = list(list(1, 5, 9), list(2, 6, 10), list(8, 9, 10), list(4, 5, 6), GLOB.alldirs, list());
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11941, "/obj/effect/gibspawner/xeno", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// gibspawner.dm:82
rt.def("/obj/effect/gibspawner/xeno/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gibtypes = list(T("/obj/effect/decal/cleanable/xenoblood/xgibs/up"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/down"), T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/body"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/limb"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/core"));
	this.gibamounts = list(1, 1, 1, 1, 1, 1, 1);
	return f.dot;
});

// gibspawner.dm:86
rt.def("/obj/effect/gibspawner/xeno/proc/Initialize", function* Initialize(f: Frame) {
	playsound(this, rt.rsc("sound/effects/blobattack.ogg"), 60, 1);
	this.gibdirections = list(list(1, 5, 9), list(2, 6, 10), list(8, 9, 10), list(4, 5, 6), GLOB.alldirs, GLOB.alldirs, list());
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11942, "/obj/effect/gibspawner/xenobodypartless", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// gibspawner.dm:92
rt.def("/obj/effect/gibspawner/xenobodypartless/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gibtypes = list(T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/core"), T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/core"), T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/torso"));
	this.gibamounts = list(1, 1, 1, 1, 1, 1);
	return f.dot;
});

// gibspawner.dm:97
rt.def("/obj/effect/gibspawner/xenobodypartless/proc/Initialize", function* Initialize(f: Frame) {
	playsound(this, rt.rsc("sound/effects/blobattack.ogg"), 60, 1);
	this.gibdirections = list(list(1, 5, 9), list(2, 6, 10), list(8, 9, 10), list(4, 5, 6), GLOB.alldirs, list());
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11943, "/obj/effect/gibspawner/larva", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// gibspawner.dm:102
rt.def("/obj/effect/gibspawner/larva/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gibtypes = list(T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva/body"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva/body"));
	this.gibamounts = list(1, 1, 1, 1);
	return f.dot;
});

// gibspawner.dm:106
rt.def("/obj/effect/gibspawner/larva/proc/Initialize", function* Initialize(f: Frame) {
	playsound(this, rt.rsc("sound/effects/blobattack.ogg"), 60, 1);
	this.gibdirections = list(list(1, 5, 9), list(2, 6, 10), list(), GLOB.alldirs);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11944, "/obj/effect/gibspawner/larvabodypartless", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// gibspawner.dm:111
rt.def("/obj/effect/gibspawner/larvabodypartless/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gibtypes = list(T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva"));
	this.gibamounts = list(1, 1, 1);
	return f.dot;
});

// gibspawner.dm:115
rt.def("/obj/effect/gibspawner/larvabodypartless/proc/Initialize", function* Initialize(f: Frame) {
	playsound(this, rt.rsc("sound/effects/blobattack.ogg"), 60, 1);
	this.gibdirections = list(list(1, 5, 9), list(2, 6, 10), list());
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11945, "/obj/effect/gibspawner/robot", "/obj/effect/gibspawner", {
	sparks: 1,
	gibtypes: null,
	gibamounts: null,
});

// gibspawner.dm:121
rt.def("/obj/effect/gibspawner/robot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gibtypes = list(T("/obj/effect/decal/cleanable/robot_debris/up"), T("/obj/effect/decal/cleanable/robot_debris/down"), T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/effect/decal/cleanable/robot_debris/limb"));
	this.gibamounts = list(1, 1, 1, 1, 1, 1);
	return f.dot;
});

// gibspawner.dm:125
rt.def("/obj/effect/gibspawner/robot/proc/Initialize", function* Initialize(f: Frame) {
	this.gibdirections = list(list(1, 5, 9), list(2, 6, 10), list(8, 9, 10), list(4, 5, 6), GLOB.alldirs, GLOB.alldirs);
	rt.setAt(this.gibamounts, 6, pick(0, 1, 2));
	yield* parent_proc();
	return f.dot;
}, true);
