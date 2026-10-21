// From code/game/objects/effects/spawners/gibspawner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11937, "/obj/effect/gibspawner", "/obj/effect", {
	sparks: 0,
	virusProb: 20,
	gibtypes: null,
	gibamounts: null,
	gibdirections: null,
});

// /obj/effect/gibspawner/proc/<init>  (code/game/objects/effects/spawners/gibspawner.dm:5)
rt.def("/obj/effect/gibspawner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gibtypes", rt.list());
	$0 = $0;
	rt.setSv(f, "gibamounts", rt.list());
	$0 = $0;
	rt.setSv(f, "gibdirections", rt.list());
	return f.dot;
});

// /obj/effect/gibspawner/proc/Initialize  (code/game/objects/effects/spawners/gibspawner.dm:10)  may sleep
rt.def("/obj/effect/gibspawner/proc/Initialize", function* Initialize(f: Frame) {
	let gib: Value = null, s: Value = null, i: Value = null, j: Value = null, gibType: Value = null, digester: Value = null, D: Value = null, viruus: Value = null, directions: Value = null;
	let $e: any;
	f.vars = () => [gib, s, i, j, gibType, digester, D, viruus, directions, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!isEqual(rt.len(f, rt.sv(f, "gibtypes")), rt.len(f, rt.sv(f, "gibamounts"))) || !isEqual(rt.len(f, rt.sv(f, "gibamounts")), rt.len(f, rt.sv(f, "gibdirections"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='danger'>Gib list length mismatch!</span>"]);
		return live(f.dot);
	}
	gib = null;
	if (truthy(rt.sv(f, "sparks"))) {
		yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [2, 1, rt.sv(f, "loc")]);
		yield* g.callName(f, live(s), "start", []);
	}
	i = null;
	i = 1;
	while (rt.le(live(i), rt.len(f, rt.sv(f, "gibtypes")))) {
		if (truthy(rt.index(rt.sv(f, "gibamounts"), live(i)))) {
			j = null;
			j = 1;
			while (rt.le(live(j), rt.index(rt.sv(f, "gibamounts"), live(i)))) {
				gibType = rt.index(rt.sv(f, "gibtypes"), live(i));
				gib = (yield* g.new_(f, live(gibType), [rt.sv(f, "loc")]));
				if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon")) ? 1 : 0))) {
					rt.modField(f, (digester = rt.sv(f, "loc")), "stomach_contents", live(gib), add);
				}
				if ((truthy(live(f.args[1])) && rt.gt(rt.len(f, live(f.args[1])), 0))) {
					D = null;
					rt.forList(f, 0, live(f.args[1]), T("/datum/disease"));
					while (($e = rt.next(f, 0)) !== undefined) {
						D = $e;
						if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "virusProb")]))) {
							viruus = (yield* g.callName(f, live(D), "Copy", [1]));
							rt.modField(f, live(gib), "viruses", live(viruus), add);
							rt.setFv(f, "holder", live(viruus), live(gib));
						}
					}
					rt.endFor(f, 0);
				}
				if (truthy(live(f.args[2]))) {
					rt.setAt(rt.fv(f, "blood_DNA", live(gib)), rt.fv(f, "unique_enzymes", live(f.args[2])), rt.fv(f, "blood_type", live(f.args[2])));
				} else {
					if (truthy((rt.istype(live(f.src), T("/obj/effect/gibspawner/generic")) ? 1 : 0))) {
						rt.setAt(rt.fv(f, "blood_DNA", live(gib)), "Non-human DNA", "A+");
					}
				}
				directions = rt.index(rt.sv(f, "gibdirections"), live(i));
				if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
					if (truthy(rt.len(f, live(directions)))) {
						yield* g.callName(f, live(gib), "streak", [live(directions)]);
					}
				}
				j = rt.inc(live(j), 1);
			}
		}
		i = rt.inc(live(i), 1);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload", "viruses", "MobDNA"] });

rt.type(11938, "/obj/effect/gibspawner/generic", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// /obj/effect/gibspawner/generic/proc/<init>  (code/game/objects/effects/spawners/gibspawner.dm:53)
rt.def("/obj/effect/gibspawner/generic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gibtypes", rt.list(T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs/core")));
	rt.setSv(f, "gibamounts", rt.list(2, 2, 1));
	return f.dot;
});

// /obj/effect/gibspawner/generic/proc/Initialize  (code/game/objects/effects/spawners/gibspawner.dm:57)  may sleep
rt.def("/obj/effect/gibspawner/generic/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/blobattack.ogg"), 40, 1]);
	rt.setSv(f, "gibdirections", rt.list(rt.list(8, 9, 10, 1), rt.list(4, 5, 6, 2), rt.list()));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(11939, "/obj/effect/gibspawner/human", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// /obj/effect/gibspawner/human/proc/<init>  (code/game/objects/effects/spawners/gibspawner.dm:62)
rt.def("/obj/effect/gibspawner/human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gibtypes", rt.list(T("/obj/effect/decal/cleanable/blood/gibs/up"), T("/obj/effect/decal/cleanable/blood/gibs/down"), T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs/body"), T("/obj/effect/decal/cleanable/blood/gibs/limb"), T("/obj/effect/decal/cleanable/blood/gibs/core")));
	rt.setSv(f, "gibamounts", rt.list(1, 1, 1, 1, 1, 1, 1));
	return f.dot;
});

// /obj/effect/gibspawner/human/proc/Initialize  (code/game/objects/effects/spawners/gibspawner.dm:66)  may sleep
rt.def("/obj/effect/gibspawner/human/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/blobattack.ogg"), 50, 1]);
	rt.setSv(f, "gibdirections", rt.list(rt.list(1, 5, 9), rt.list(2, 6, 10), rt.list(8, 9, 10), rt.list(4, 5, 6), rt.gl("alldirs"), rt.gl("alldirs"), rt.list()));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(11940, "/obj/effect/gibspawner/humanbodypartless", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// /obj/effect/gibspawner/humanbodypartless/proc/<init>  (code/game/objects/effects/spawners/gibspawner.dm:72)
rt.def("/obj/effect/gibspawner/humanbodypartless/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gibtypes", rt.list(T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs/core"), T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs/core"), T("/obj/effect/decal/cleanable/blood/gibs"), T("/obj/effect/decal/cleanable/blood/gibs/torso")));
	rt.setSv(f, "gibamounts", rt.list(1, 1, 1, 1, 1, 1));
	return f.dot;
});

// /obj/effect/gibspawner/humanbodypartless/proc/Initialize  (code/game/objects/effects/spawners/gibspawner.dm:76)  may sleep
rt.def("/obj/effect/gibspawner/humanbodypartless/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/blobattack.ogg"), 50, 1]);
	rt.setSv(f, "gibdirections", rt.list(rt.list(1, 5, 9), rt.list(2, 6, 10), rt.list(8, 9, 10), rt.list(4, 5, 6), rt.gl("alldirs"), rt.list()));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(11941, "/obj/effect/gibspawner/xeno", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// /obj/effect/gibspawner/xeno/proc/<init>  (code/game/objects/effects/spawners/gibspawner.dm:82)
rt.def("/obj/effect/gibspawner/xeno/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gibtypes", rt.list(T("/obj/effect/decal/cleanable/xenoblood/xgibs/up"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/down"), T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/body"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/limb"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/core")));
	rt.setSv(f, "gibamounts", rt.list(1, 1, 1, 1, 1, 1, 1));
	return f.dot;
});

// /obj/effect/gibspawner/xeno/proc/Initialize  (code/game/objects/effects/spawners/gibspawner.dm:86)  may sleep
rt.def("/obj/effect/gibspawner/xeno/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/blobattack.ogg"), 60, 1]);
	rt.setSv(f, "gibdirections", rt.list(rt.list(1, 5, 9), rt.list(2, 6, 10), rt.list(8, 9, 10), rt.list(4, 5, 6), rt.gl("alldirs"), rt.gl("alldirs"), rt.list()));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(11942, "/obj/effect/gibspawner/xenobodypartless", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// /obj/effect/gibspawner/xenobodypartless/proc/<init>  (code/game/objects/effects/spawners/gibspawner.dm:92)
rt.def("/obj/effect/gibspawner/xenobodypartless/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gibtypes", rt.list(T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/core"), T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/core"), T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/torso")));
	rt.setSv(f, "gibamounts", rt.list(1, 1, 1, 1, 1, 1));
	return f.dot;
});

// /obj/effect/gibspawner/xenobodypartless/proc/Initialize  (code/game/objects/effects/spawners/gibspawner.dm:97)  may sleep
rt.def("/obj/effect/gibspawner/xenobodypartless/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/blobattack.ogg"), 60, 1]);
	rt.setSv(f, "gibdirections", rt.list(rt.list(1, 5, 9), rt.list(2, 6, 10), rt.list(8, 9, 10), rt.list(4, 5, 6), rt.gl("alldirs"), rt.list()));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(11943, "/obj/effect/gibspawner/larva", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// /obj/effect/gibspawner/larva/proc/<init>  (code/game/objects/effects/spawners/gibspawner.dm:102)
rt.def("/obj/effect/gibspawner/larva/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gibtypes", rt.list(T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva/body"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva/body")));
	rt.setSv(f, "gibamounts", rt.list(1, 1, 1, 1));
	return f.dot;
});

// /obj/effect/gibspawner/larva/proc/Initialize  (code/game/objects/effects/spawners/gibspawner.dm:106)  may sleep
rt.def("/obj/effect/gibspawner/larva/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/blobattack.ogg"), 60, 1]);
	rt.setSv(f, "gibdirections", rt.list(rt.list(1, 5, 9), rt.list(2, 6, 10), rt.list(), rt.gl("alldirs")));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(11944, "/obj/effect/gibspawner/larvabodypartless", "/obj/effect/gibspawner", {
	gibtypes: null,
	gibamounts: null,
});

// /obj/effect/gibspawner/larvabodypartless/proc/<init>  (code/game/objects/effects/spawners/gibspawner.dm:111)
rt.def("/obj/effect/gibspawner/larvabodypartless/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gibtypes", rt.list(T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva"), T("/obj/effect/decal/cleanable/xenoblood/xgibs/larva")));
	rt.setSv(f, "gibamounts", rt.list(1, 1, 1));
	return f.dot;
});

// /obj/effect/gibspawner/larvabodypartless/proc/Initialize  (code/game/objects/effects/spawners/gibspawner.dm:115)  may sleep
rt.def("/obj/effect/gibspawner/larvabodypartless/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/blobattack.ogg"), 60, 1]);
	rt.setSv(f, "gibdirections", rt.list(rt.list(1, 5, 9), rt.list(2, 6, 10), rt.list()));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(11945, "/obj/effect/gibspawner/robot", "/obj/effect/gibspawner", {
	sparks: 1,
	gibtypes: null,
	gibamounts: null,
});

// /obj/effect/gibspawner/robot/proc/<init>  (code/game/objects/effects/spawners/gibspawner.dm:121)
rt.def("/obj/effect/gibspawner/robot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gibtypes", rt.list(T("/obj/effect/decal/cleanable/robot_debris/up"), T("/obj/effect/decal/cleanable/robot_debris/down"), T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/effect/decal/cleanable/robot_debris/limb")));
	rt.setSv(f, "gibamounts", rt.list(1, 1, 1, 1, 1, 1));
	return f.dot;
});

// /obj/effect/gibspawner/robot/proc/Initialize  (code/game/objects/effects/spawners/gibspawner.dm:125)  may sleep
rt.def("/obj/effect/gibspawner/robot/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "gibdirections", rt.list(rt.list(1, 5, 9), rt.list(2, 6, 10), rt.list(8, 9, 10), rt.list(4, 5, 6), rt.gl("alldirs"), rt.gl("alldirs")));
	rt.setAt(rt.sv(f, "gibamounts"), 6, rt.op(f, "PickUnweighted", [3], [0, 1, 2]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
