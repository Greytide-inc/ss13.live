// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/retaliate/retaliate.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4933, "/mob/living/simple_animal/hostile/retaliate", "/mob/living/simple_animal/hostile", {
	enemies: null,
});

// retaliate.dm:2
rt.def("/mob/living/simple_animal/hostile/retaliate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.enemies = list();
	return f.dot;
});

// retaliate.dm:5
rt.def("/mob/living/simple_animal/hostile/retaliate/proc/Found", function Found(f: Frame, A: Value) {
	let L: Value = null, M: Value = null;
	if (rt.istype(A, T("/mob/living"))) {
		if (!(L = A).stat) {
			return L;
		} else {
			this.enemies -= L;
		}
	} else {
		if (!rt.istype(A, T("/obj/mecha"))) return f.dot;
		if (!(M = A).occupant) return f.dot;
		return A;
	}
	return f.dot;
});

// retaliate.dm:17
rt.def("/mob/living/simple_animal/hostile/retaliate/proc/ListTargets", function ListTargets(f: Frame) {
	if (!rt.len(f, this.enemies)) {
		return list();
	}
	let see: Value = parent_proc();
	(see = rt.modify(see, this.enemies, rt.bitAnd));
	return see;
});

// retaliate.dm:24
rt.def("/mob/living/simple_animal/hostile/retaliate/proc/Retaliate", function Retaliate(f: Frame) {
	let A: Value = null, M: Value = null, H: Value = null;
	let around: Value = view(this, this.vision_range);
	for (A of each(around, T("/atom/movable"))) {
		if (A == this) {
			continue;
		}
		if (rt.istype(A, T("/mob/living"))) {
			if (this.faction_check_mob((M = A)) && this.attack_same || !this.faction_check_mob(M)) {
				(rt.modSrcVar(f, "enemies", M, rt.bitOr));
			}
		} else if (rt.istype(A, T("/obj/mecha"))) {
			if ((M = A).occupant) {
				(rt.modSrcVar(f, "enemies", M, rt.bitOr));
				(rt.modSrcVar(f, "enemies", M.occupant, rt.bitOr));
			}
		}
	}
	for (H of each(around, T("/mob/living/simple_animal/hostile/retaliate"))) {
		if (this.faction_check_mob(H) && !this.attack_same && !H.attack_same) {
			(rt.modField(f, H, "enemies", this.enemies, rt.bitOr));
		}
	}
	return 0;
});

// retaliate.dm:45
rt.def("/mob/living/simple_animal/hostile/retaliate/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(f.dot > 0 && this.stat == 0)) return f.dot;
	this.Retaliate();
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });
