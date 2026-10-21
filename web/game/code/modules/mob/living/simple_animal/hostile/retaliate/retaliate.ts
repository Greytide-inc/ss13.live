// From code/modules/mob/living/simple_animal/hostile/retaliate/retaliate.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4933, "/mob/living/simple_animal/hostile/retaliate", "/mob/living/simple_animal/hostile", {
	enemies: null,
});

// /mob/living/simple_animal/hostile/retaliate/proc/<init>  (code/modules/mob/living/simple_animal/hostile/retaliate/retaliate.dm:2)
rt.def("/mob/living/simple_animal/hostile/retaliate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "enemies", rt.list());
	return f.dot;
});

// /mob/living/simple_animal/hostile/retaliate/proc/Found  (code/modules/mob/living/simple_animal/hostile/retaliate/retaliate.dm:5)
rt.def("/mob/living/simple_animal/hostile/retaliate/proc/Found", function Found(f: Frame, A: Value) {
	let L: Value = null, M: Value = null;
	f.vars = () => [L, M];
	if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "stat", (L = live(A))))) {
			return live(L);
		} else {
			(rt.modSrcVar(f, "enemies", live(L), subtract));
		}
	} else {
		if (!truthy((rt.istype(live(A), T("/obj/mecha")) ? 1 : 0))) return f.dot;
		if (!truthy(rt.gv(f, "occupant", (M = live(A))))) return f.dot;
		return live(A);
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/retaliate/proc/ListTargets  (code/modules/mob/living/simple_animal/hostile/retaliate/retaliate.dm:17)
rt.def("/mob/living/simple_animal/hostile/retaliate/proc/ListTargets", function ListTargets(f: Frame) {
	let see: Value = null;
	f.vars = () => [see];
	if (!truthy(rt.len(f, rt.sv(f, "enemies")))) {
		return rt.list();
	}
	see = rt.callSuper(f, [], rt.Args.Same);
	(see = rt.modify(live(see), rt.sv(f, "enemies"), rt.bitAnd));
	return live(see);
});

// /mob/living/simple_animal/hostile/retaliate/proc/Retaliate  (code/modules/mob/living/simple_animal/hostile/retaliate/retaliate.dm:24)
rt.def("/mob/living/simple_animal/hostile/retaliate/proc/Retaliate", function Retaliate(f: Frame) {
	let around: Value = null, A: Value = null, M: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [around, A, M, H, $e];
	around = rt.call(f, P("/proc/view"), null, [live(f.src), rt.sv(f, "vision_range")]);
	A = null;
	rt.forList(f, 0, live(around), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(live(A), live(f.src))) {
			continue;
		}
		if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
			if (((truthy(rt.callSrc(f, "faction_check_mob", [(M = live(A))])) && truthy(rt.sv(f, "attack_same"))) || !truthy(rt.callSrc(f, "faction_check_mob", [live(M)])))) {
				(rt.modSrcVar(f, "enemies", live(M), rt.bitOr));
			}
		} else {
			if (truthy((rt.istype(live(A), T("/obj/mecha")) ? 1 : 0))) {
				if (truthy(rt.gv(f, "occupant", (M = live(A))))) {
					(rt.modSrcVar(f, "enemies", live(M), rt.bitOr));
					(rt.modSrcVar(f, "enemies", rt.fv(f, "occupant", live(M)), rt.bitOr));
				}
			}
		}
	}
	rt.endFor(f, 0);
	H = null;
	rt.forList(f, 0, live(around), T("/mob/living/simple_animal/hostile/retaliate"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (((truthy(rt.callSrc(f, "faction_check_mob", [live(H)])) && !truthy(rt.sv(f, "attack_same"))) && !truthy(rt.fv(f, "attack_same", live(H))))) {
			(rt.modField(f, live(H), "enemies", rt.sv(f, "enemies"), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /mob/living/simple_animal/hostile/retaliate/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/retaliate/retaliate.dm:45)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(rt.gt(live(f.dot), 0) && isEqual(rt.sv(f, "stat"), 0))) return f.dot;
	yield* g.srcCall(f, "Retaliate");
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });
