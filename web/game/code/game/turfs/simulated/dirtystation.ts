// Based on /tg/station's code/game/turfs/simulated/dirtystation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// dirtystation.dm:11
rt.def("/turf/open/floor/proc/MakeDirty", function* MakeDirty(f: Frame) {
	let A: Value = null;
	if (prob(66)) {
		return f.dot;
	}
	if (!rt.bitAnd(this.flags, CAN_BE_DIRTY)) {
		return f.dot;
	}
	if (rt.locateIn(f, T("/obj/structure/grille"), this.contents)) {
		return f.dot;
	}
	if ((A = get_area(this)) && !rt.bitAnd(A.flags, CAN_BE_DIRTY)) {
		return f.dot;
	}
	if (rt.istype(A, T("/area/science/test_area")) || rt.istype(A, T("/area/mine/production")) || rt.istype(A, T("/area/mine/living_quarters")) || rt.istype(A, T("/area/mine/north_outpost")) || rt.istype(A, T("/area/mine/west_outpost")) || rt.istype(A, T("/area/wreck")) || rt.istype(A, T("/area/derelict")) || rt.istype(A, T("/area/djstation"))) {
		yield* new_(T("/obj/effect/decal/cleanable/dirt"), this);
		return f.dot;
	}
	if (prob(80)) {
		return f.dot;
	}
	if (rt.istype(A, T("/area/engine")) || rt.istype(A, T("/area/crew_quarters/heads/chief")) || rt.istype(A, T("/area/assembly")) || rt.istype(A, T("/area/science/robotics")) || rt.istype(A, T("/area/maintenance")) || rt.istype(A, T("/area/construction"))) {
		if (prob(3)) {
			yield* new_(T("/obj/effect/decal/cleanable/blood/old"), this);
		} else if (prob(35)) {
			if (prob(4)) {
				yield* new_(T("/obj/effect/decal/cleanable/robot_debris/old"), this);
			} else {
				yield* new_(T("/obj/effect/decal/cleanable/oil"), this);
			}
		} else {
			yield* new_(T("/obj/effect/decal/cleanable/dirt"), this);
		}
		return f.dot;
	}
	if (rt.istype(A, T("/area/crew_quarters/toilet"))) {
		if (prob(40)) {
			if (prob(90)) {
				yield* new_(T("/obj/effect/decal/cleanable/vomit/old"), this);
			} else {
				yield* new_(T("/obj/effect/decal/cleanable/blood/old"), this);
			}
		}
		return f.dot;
	}
	if (rt.istype(A, T("/area/quartermaster"))) {
		if (prob(25)) {
			yield* new_(T("/obj/effect/decal/cleanable/oil"), this);
		}
		return f.dot;
	}
	if (prob(75)) {
		return f.dot;
	}
	if (rt.istype(A, T("/area/ai_monitored/turret_protected")) || rt.istype(A, T("/area/prison")) || rt.istype(A, T("/area/security")) || rt.istype(A, T("/area/crew_quarters/heads/hos"))) {
		if (prob(20)) {
			if (prob(5)) {
				yield* new_(T("/obj/effect/decal/cleanable/blood/gibs/old"), this);
			} else {
				yield* new_(T("/obj/effect/decal/cleanable/blood/old"), this);
			}
		}
		return f.dot;
	}
	if (rt.istype(A, T("/area/crew_quarters/kitchen")) || rt.istype(A, T("/area/crew_quarters/cafeteria"))) {
		if (prob(60)) {
			if (prob(50)) {
				yield* new_(T("/obj/effect/decal/cleanable/egg_smudge"), this);
			} else {
				yield* new_(T("/obj/effect/decal/cleanable/flour"), this);
			}
		}
		return f.dot;
	}
	if (rt.istype(A, T("/area/medical")) || rt.istype(A, T("/area/crew_quarters/heads/cmo"))) {
		if (prob(66)) {
			if (prob(5)) {
				yield* new_(T("/obj/effect/decal/cleanable/blood/gibs/old"), this);
			} else {
				yield* new_(T("/obj/effect/decal/cleanable/blood/old"), this);
			}
		} else if (prob(30)) {
			if (rt.istype(A, T("/area/medical/morgue"))) {
				yield* new_(T("/obj/item/weapon/ectoplasm"), this);
			} else {
				yield* new_(T("/obj/effect/decal/cleanable/vomit/old"), this);
			}
		}
		return f.dot;
	}
	if (rt.istype(A, T("/area/science")) || rt.istype(A, T("/area/crew_quarters/heads/hor"))) {
		if (prob(20)) {
			yield* new_(T("/obj/effect/decal/cleanable/greenglow"), this);
		}
		return f.dot;
	}
	return 1;
}, true);
