// From code/game/turfs/simulated/dirtystation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /turf/open/floor/proc/MakeDirty  (code/game/turfs/simulated/dirtystation.dm:11)  may sleep
rt.def("/turf/open/floor/proc/MakeDirty", function* MakeDirty(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy(rt.op(f, "Prob", [], [66]))) {
		return live(f.dot);
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 4))) {
		return live(f.dot);
	}
	if (truthy(rt.locateIn(f, T("/obj/structure/grille"), rt.sv(f, "contents")))) {
		return live(f.dot);
	}
	if ((truthy((A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])))) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(A)), 4)))) {
		return live(f.dot);
	}
	if ((((((((truthy((rt.istype(live(A), T("/area/science/test_area")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/area/mine/production")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/mine/living_quarters")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/mine/north_outpost")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/mine/west_outpost")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/wreck")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/derelict")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/djstation")) ? 1 : 0)))) {
		yield* g.new_(f, T("/obj/effect/decal/cleanable/dirt"), [live(f.src)]);
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [80]))) {
		return live(f.dot);
	}
	if ((((((truthy((rt.istype(live(A), T("/area/engine")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/area/crew_quarters/heads/chief")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/assembly")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/science/robotics")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/maintenance")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/construction")) ? 1 : 0)))) {
		if (truthy(rt.op(f, "Prob", [], [3]))) {
			yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/old"), [live(f.src)]);
		} else {
			if (truthy(rt.op(f, "Prob", [], [35]))) {
				if (truthy(rt.op(f, "Prob", [], [4]))) {
					yield* g.new_(f, T("/obj/effect/decal/cleanable/robot_debris/old"), [live(f.src)]);
				} else {
					yield* g.new_(f, T("/obj/effect/decal/cleanable/oil"), [live(f.src)]);
				}
			} else {
				yield* g.new_(f, T("/obj/effect/decal/cleanable/dirt"), [live(f.src)]);
			}
		}
		return live(f.dot);
	}
	if (truthy((rt.istype(live(A), T("/area/crew_quarters/toilet")) ? 1 : 0))) {
		if (truthy(rt.op(f, "Prob", [], [40]))) {
			if (truthy(rt.op(f, "Prob", [], [90]))) {
				yield* g.new_(f, T("/obj/effect/decal/cleanable/vomit/old"), [live(f.src)]);
			} else {
				yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/old"), [live(f.src)]);
			}
		}
		return live(f.dot);
	}
	if (truthy((rt.istype(live(A), T("/area/quartermaster")) ? 1 : 0))) {
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			yield* g.new_(f, T("/obj/effect/decal/cleanable/oil"), [live(f.src)]);
		}
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [75]))) {
		return live(f.dot);
	}
	if ((((truthy((rt.istype(live(A), T("/area/ai_monitored/turret_protected")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/area/prison")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/security")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/area/crew_quarters/heads/hos")) ? 1 : 0)))) {
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			if (truthy(rt.op(f, "Prob", [], [5]))) {
				yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/gibs/old"), [live(f.src)]);
			} else {
				yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/old"), [live(f.src)]);
			}
		}
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(A), T("/area/crew_quarters/kitchen")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/area/crew_quarters/cafeteria")) ? 1 : 0)))) {
		if (truthy(rt.op(f, "Prob", [], [60]))) {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.new_(f, T("/obj/effect/decal/cleanable/egg_smudge"), [live(f.src)]);
			} else {
				yield* g.new_(f, T("/obj/effect/decal/cleanable/flour"), [live(f.src)]);
			}
		}
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(A), T("/area/medical")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/area/crew_quarters/heads/cmo")) ? 1 : 0)))) {
		if (truthy(rt.op(f, "Prob", [], [66]))) {
			if (truthy(rt.op(f, "Prob", [], [5]))) {
				yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/gibs/old"), [live(f.src)]);
			} else {
				yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/old"), [live(f.src)]);
			}
		} else {
			if (truthy(rt.op(f, "Prob", [], [30]))) {
				if (truthy((rt.istype(live(A), T("/area/medical/morgue")) ? 1 : 0))) {
					yield* g.new_(f, T("/obj/item/weapon/ectoplasm"), [live(f.src)]);
				} else {
					yield* g.new_(f, T("/obj/effect/decal/cleanable/vomit/old"), [live(f.src)]);
				}
			}
		}
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(A), T("/area/science")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/area/crew_quarters/heads/hor")) ? 1 : 0)))) {
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			yield* g.new_(f, T("/obj/effect/decal/cleanable/greenglow"), [live(f.src)]);
		}
		return live(f.dot);
	}
	return 1;
}, true);
