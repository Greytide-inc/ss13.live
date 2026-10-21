// From code/modules/spells/spell_types/turf_teleport.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11340, "/obj/effect/proc_holder/spell/targeted/turf_teleport", "/obj/effect/proc_holder/spell/targeted", {
	inner_tele_radius: 1,
	outer_tele_radius: 2,
	include_space: 0,
	include_dense: 0,
	sound1: rt.rsc("sound/weapons/zapbang.ogg"),
	sound2: rt.rsc("sound/weapons/zapbang.ogg"),
	name: "Turf Teleport",
	desc: "This spell teleports the target to the turf in range.",
	nonabstract_req: 1,
});

// /obj/effect/proc_holder/spell/targeted/turf_teleport/proc/cast  (code/modules/spells/spell_types/turf_teleport.dm:15)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/turf_teleport/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, turfs: Value = null, _T: Value = null, turfs_to_pick_from: Value = null, _T_3: Value = null, picked: Value = null;
	let $e: any;
	f.vars = () => [targets, user, target, turfs, _T, turfs_to_pick_from, _T_3, picked, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.sv(f, "sound1"), 50, 1]);
	target = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		turfs = (yield* g.new_(f, T("/list"), []));
		_T = null;
		rt.forList(f, 1, (yield* g.call(f, P("/proc/range"), null, [live(target), rt.sv(f, "outer_tele_radius")])), T("/turf"));
		while (($e = rt.next(f, 1)) !== undefined) {
			_T = $e;
			if (truthy((rt.isIn(f, live(_T), (yield* g.call(f, P("/proc/range"), null, [live(target), rt.sv(f, "inner_tele_radius")]))) ? 1 : 0))) {
				continue;
			}
			if ((truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)) && !truthy(rt.sv(f, "include_space")))) {
				continue;
			}
			if ((truthy(rt.fv(f, "density", live(_T))) && !truthy(rt.sv(f, "include_dense")))) {
				continue;
			}
			if ((rt.gt(rt.fv(f, "x", live(_T)), subtract(rt.fv(f, "maxx", rt.world()), rt.sv(f, "outer_tele_radius"))) || rt.lt(rt.fv(f, "x", live(_T)), rt.sv(f, "outer_tele_radius")))) {
				continue;
			}
			if ((rt.gt(rt.fv(f, "y", live(_T)), subtract(rt.fv(f, "maxy", rt.world()), rt.sv(f, "outer_tele_radius"))) || rt.lt(rt.fv(f, "y", live(_T)), rt.sv(f, "outer_tele_radius")))) {
				continue;
			}
			turfs = rt.modify(live(turfs), live(_T), add);
		}
		rt.endFor(f, 1);
		if (!truthy(rt.len(f, live(turfs)))) {
			turfs_to_pick_from = rt.list();
			_T_3 = null;
			rt.forList(f, 1, (yield* g.call(f, P("/proc/orange"), null, [live(target), rt.sv(f, "outer_tele_radius")])), T("/turf"));
			while (($e = rt.next(f, 1)) !== undefined) {
				_T_3 = $e;
				if (!truthy((rt.isIn(f, live(_T_3), (yield* g.call(f, P("/proc/orange"), null, [live(target), rt.sv(f, "inner_tele_radius")]))) ? 1 : 0))) {
					turfs_to_pick_from = rt.modify(live(turfs_to_pick_from), live(_T_3), add);
				}
			}
			rt.endFor(f, 1);
			turfs = rt.modify(live(turfs), rt.op(f, "PickUnweighted", [1], [(rt.isIn(f, T("/turf"), live(turfs_to_pick_from)) ? 1 : 0)]), add);
		}
		if ((!truthy((picked = rt.op(f, "PickUnweighted", [1], [live(turfs)]))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [live(picked)]))))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(target), "Move", [live(picked)])))) {
			if (truthy(rt.fv(f, "buckled", live(target)))) {
				yield* g.callName(f, rt.fv(f, "buckled", live(target)), "unbuckle_mob", [null, live(target), "force", 1], rt.Args.Named);
			}
			if (truthy((yield* g.callName(f, live(target), "has_buckled_mobs", [])))) {
				yield* g.callName(f, live(target), "unbuckle_all_mobs", ["force", 1], rt.Args.Named);
			}
			rt.setFv(f, "loc", live(target), live(picked));
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.sv(f, "sound2"), 50, 1]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
