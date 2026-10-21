// From code/modules/mob/living/simple_animal/guardian/types/lightning.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/simple_animal/hostile/guardian/beam/proc/<init>  (code/modules/mob/living/simple_animal/guardian/types/lightning.dm:19)
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "enemychains", rt.list());
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.699999988079071, "fire", 0.699999988079071, "tox", 0.699999988079071, "clone", 0.699999988079071, "stamina", 0, "oxy", 0.699999988079071]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/beam/proc/AttackingTarget  (code/modules/mob/living/simple_animal/guardian/types/lightning.dm:23)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let chain: Value = null, B: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [chain, B, C, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(((truthy(live(f.dot)) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) && !isEqual(rt.sv(f, "target"), live(f.src))) && !isEqual(rt.sv(f, "target"), rt.sv(f, "summoner")))) return f.dot;
	yield* g.srcCall(f, "cleardeletedchains");
	chain = null;
	rt.forList(f, 0, rt.sv(f, "enemychains"));
	while (($e = rt.next(f, 0)) !== undefined) {
		chain = $e;
		if (isEqual(rt.gv(f, "target", (B = live(chain))), rt.sv(f, "target"))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.len(f, rt.sv(f, "enemychains")), 2)) {
		yield* g.call(f, P("/proc/qdel"), null, [(C = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "enemychains")]))]);
		(rt.modSrcVar(f, "enemychains", live(C), subtract));
	}
	rt.modSrcVar(f, "enemychains", (yield* g.callSrc(f, "Beam", [null, rt.sv(f, "target"), null, fmt("lightning＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 12]))]), "time", 70, "maxdistance", 7, "beam_type", T("/obj/effect/ebeam/chain")], rt.Args.Named)), add);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/beam/proc/Destroy  (code/modules/mob/living/simple_animal/guardian/types/lightning.dm:37)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "removechains");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/guardian/beam/proc/Manifest  (code/modules/mob/living/simple_animal/guardian/types/lightning.dm:41)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/Manifest", function* Manifest(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (truthy(rt.sv(f, "summoner"))) {
		rt.setSv(f, "summonerchain", (yield* g.callSrc(f, "Beam", [null, rt.sv(f, "summoner"), null, fmt("lightning＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 12]))]), "time", 9.999999848243207e+30, "maxdistance", 9.999999848243207e+30, "beam_type", T("/obj/effect/ebeam/chain")], rt.Args.Named)));
	}
	while (!isEqual(rt.sv(f, "loc"), rt.sv(f, "summoner"))) {
		if (rt.gt(rt.sv(f, "successfulshocks"), 5)) {
			rt.setSv(f, "successfulshocks", 0);
		}
		if (truthy((yield* g.srcCall(f, "shockallchains")))) {
			rt.incSrcVar(f, "successfulshocks", 1, true);
		}
		yield* g.call(f, P("/proc/sleep"), null, [3]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/beam/proc/Recall  (code/modules/mob/living/simple_animal/guardian/types/lightning.dm:53)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/Recall", function* Recall(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "removechains");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/beam/proc/cleardeletedchains  (code/modules/mob/living/simple_animal/guardian/types/lightning.dm:58)
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/cleardeletedchains", function cleardeletedchains(f: Frame) {
	let chain: Value = null, cd: Value = null;
	let $e: any;
	f.vars = () => [chain, cd, $e];
	if ((truthy(rt.sv(f, "summonerchain")) && (!truthy(rt.sv(f, "summonerchain")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "summonerchain")))))) {
		rt.setSv(f, "summonerchain", null);
	}
	if (!truthy(rt.len(f, rt.sv(f, "enemychains")))) return f.dot;
	chain = null;
	rt.forList(f, 0, rt.sv(f, "enemychains"));
	while (($e = rt.next(f, 0)) !== undefined) {
		chain = $e;
		cd = live(chain);
		if ((!truthy(live(chain)) || (!truthy(live(cd)) || truthy(rt.fv(f, "gc_destroyed", live(cd)))))) {
			(rt.modSrcVar(f, "enemychains", live(chain), subtract));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/beam/proc/shockallchains  (code/modules/mob/living/simple_animal/guardian/types/lightning.dm:68)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/shockallchains", function* shockallchains(f: Frame) {
	let chain: Value = null;
	let $e: any;
	f.vars = () => [chain, $e];
	f.dot = 0;
	yield* g.srcCall(f, "cleardeletedchains");
	if (truthy(rt.sv(f, "summoner"))) {
		if (!truthy(rt.sv(f, "summonerchain"))) {
			rt.setSv(f, "summonerchain", (yield* g.callSrc(f, "Beam", [null, rt.sv(f, "summoner"), null, fmt("lightning＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 12]))]), "time", 9.999999848243207e+30, "maxdistance", 9.999999848243207e+30, "beam_type", T("/obj/effect/ebeam/chain")], rt.Args.Named)));
		}
		f.dot = rt.modify(live(f.dot), (yield* g.srcCall(f, "chainshock", rt.sv(f, "summonerchain"))), add);
	}
	if (!truthy(rt.len(f, rt.sv(f, "enemychains")))) return f.dot;
	chain = null;
	rt.forList(f, 0, rt.sv(f, "enemychains"));
	while (($e = rt.next(f, 0)) !== undefined) {
		chain = $e;
		f.dot = rt.modify(live(f.dot), (yield* g.srcCall(f, "chainshock", live(chain))), add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/beam/proc/removechains  (code/modules/mob/living/simple_animal/guardian/types/lightning.dm:79)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/removechains", function* removechains(f: Frame) {
	let chain: Value = null;
	let $e: any;
	f.vars = () => [chain, $e];
	if (truthy(rt.sv(f, "summonerchain"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "summonerchain")]);
		rt.setSv(f, "summonerchain", null);
	}
	if (!truthy(rt.len(f, rt.sv(f, "enemychains")))) return f.dot;
	chain = null;
	rt.forList(f, 0, rt.sv(f, "enemychains"));
	while (($e = rt.next(f, 0)) !== undefined) {
		chain = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(chain)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "enemychains", rt.list());
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/beam/proc/chainshock  (code/modules/mob/living/simple_animal/guardian/types/lightning.dm:88)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/beam/proc/chainshock", function* chainshock(f: Frame, B: Value) {
	let turfs: Value = null, E: Value = null, chainpart: Value = null, _T: Value = null, TU: Value = null, turf: Value = null, _T_2: Value = null, L: Value = null, C: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [B, turfs, E, chainpart, _T, TU, turf, _T_2, L, C, H, $e];
	f.dot = 0;
	turfs = rt.list();
	E = null;
	rt.forList(f, 0, rt.fv(f, "elements", live(B)));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		if ((((truthy((chainpart = live(E))) && truthy(rt.fv(f, "x", live(chainpart)))) && truthy(rt.fv(f, "y", live(chainpart)))) && truthy(rt.fv(f, "z", live(chainpart))))) {
			(turfs = rt.modify(live(turfs), (_T = (yield* g.call(f, P("/proc/get_turf_pixel"), null, [live(chainpart)]))), rt.bitOr));
			if ((!isEqual(live(_T), rt.getStep(f, rt.fv(f, "origin", live(B)), 0)) && !isEqual(live(_T), rt.getStep(f, rt.fv(f, "target", live(B)), 0)))) {
				TU = null;
				rt.forList(f, 1, (yield* g.call(f, P("/proc/circlerange"), null, [live(_T), 1])), T("/turf"));
				while (($e = rt.next(f, 1)) !== undefined) {
					TU = $e;
					(turfs = rt.modify(live(turfs), live(TU), rt.bitOr));
				}
				rt.endFor(f, 1);
			}
		}
	}
	rt.endFor(f, 0);
	turf = null;
	rt.forList(f, 0, live(turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		turf = $e;
		_T_2 = live(turf);
		L = null;
		rt.forList(f, 1, live(_T_2), T("/mob/living"));
		while (($e = rt.next(f, 1)) !== undefined) {
			L = $e;
			if (((!isEqual(rt.fv(f, "stat", live(L)), 2) && !isEqual(live(L), live(f.src))) && !isEqual(live(L), rt.sv(f, "summoner")))) {
				if (truthy((yield* g.srcCall(f, "hasmatchingsummoner", live(L))))) {
					continue;
				}
				if (rt.gt(rt.sv(f, "successfulshocks"), 4)) {
					if (truthy((rt.istype(live(L), T("/mob/living/carbon")) ? 1 : 0))) {
						if (truthy((rt.istype((C = live(L)), T("/mob/living/carbon/human")) ? 1 : 0))) {
							yield* g.callName(f, (H = live(C)), "electrocution_animation", [20]);
						}
						rt.modField(f, live(C), "jitteriness", 1000, add);
						yield* g.callName(f, live(C), "do_jitter_animation", [rt.sv(f, "jitteriness")]);
						rt.modField(f, live(C), "stuttering", 1, add);
						rt.spawnTail(f, 20, "/mob/living/simple_animal/hostile/guardian/beam/proc/chainshock: spawn at modules/mob/living/simple_animal/guardian/types/lightning.dm:112", B, turfs, E, chainpart, _T, TU, turf, _T_2, L, C, H);
					}
					yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ was shocked by the lightning chain!</span>", [live(L)]), "<span class='userdanger'>You are shocked by the lightning chain!</span>", "<span class='italics'>You hear a heavy electrical crack.</span>"]);
				}
				yield* g.callName(f, live(L), "adjustFireLoss", [1.2000000476837158]);
				f.dot = 1;
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// a spawn(20) body of /mob/living/simple_animal/hostile/guardian/beam/proc/chainshock, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/hostile/guardian/beam/proc/chainshock: spawn at modules/mob/living/simple_animal/guardian/types/lightning.dm:112", function* (f: Frame, B: Value, turfs: Value, E: Value, chainpart: Value, _T: Value, TU: Value, turf: Value, _T_2: Value, L: Value, C: Value, H: Value) {
	f.vars = () => [B, turfs, E, chainpart, _T, TU, turf, _T_2, L, C, H];
	if (truthy(live(C))) {
		rt.setFv(f, "jitteriness", live(C), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "jitteriness", live(C)), 990), 10])));
	}
	return null;
});
