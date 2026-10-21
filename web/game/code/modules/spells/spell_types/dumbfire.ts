// From code/modules/spells/spell_types/dumbfire.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11383, "/obj/effect/proc_holder/spell/dumbfire", "/obj/effect/proc_holder/spell", {
	projectile_type: "",
	activate_on_collision: 1,
	proj_icon: rt.rsc("icons/obj/projectiles.dmi"),
	proj_icon_state: "spell",
	proj_name: "a spell projectile",
	proj_trail: 0,
	proj_trail_lifespan: 0,
	proj_trail_icon: rt.rsc("icons/obj/wizard.dmi"),
	proj_trail_icon_state: "trail",
	proj_type: "/obj/effect/proc_holder/spell",
	proj_insubstantial: 0,
	proj_trigger_range: 1,
	proj_lifespan: 100,
	proj_step_delay: 1,
});

// /obj/effect/proc_holder/spell/dumbfire/proc/choose_targets  (code/modules/spells/spell_types/dumbfire.dm:25)  may sleep
rt.def("/obj/effect/proc_holder/spell/dumbfire/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	let _T: Value = null, i: Value = null, new_turf: Value = null;
	f.vars = () => [user, _T, i, new_turf];
	if (live(user) === null) {
		user = live(f.usr);
	}
	_T = rt.getStep(f, live(user), 0);
	i = null;
	i = 1;
	while (rt.lt(live(i), rt.sv(f, "range"))) {
		if (truthy(rt.gv(f, "density", (new_turf = rt.getStep(f, live(_T), rt.fv(f, "dir", live(user))))))) {
			break;
		}
		_T = live(new_turf);
		i = rt.inc(live(i), 1);
	}
	yield* g.callSrc(f, "perform", [null, rt.list(live(_T)), "user", live(user)], rt.Args.Named);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/dumbfire/proc/cast  (code/modules/spells/spell_types/dumbfire.dm:34)
rt.def("/obj/effect/proc_holder/spell/dumbfire/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, projectile: Value = null, projectile_type: Value = null, current_loc: Value = null, i: Value = null, L: Value = null, trail: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [user, target, projectile, projectile_type, current_loc, i, L, trail, M, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	rt.callSrc(f, "playMagSound", []);
	target = null;
	rt.forList(f, 0, live(targets), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		rt.spawnTail(f, 0, "/obj/effect/proc_holder/spell/dumbfire/proc/cast: spawn at modules/spells/spell_types/dumbfire.dm:36", targets, user, target, projectile, projectile_type, current_loc, i, L, trail, M);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// a spawn(0) body of /obj/effect/proc_holder/spell/dumbfire/proc/cast, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/proc_holder/spell/dumbfire/proc/cast: spawn at modules/spells/spell_types/dumbfire.dm:36", function* (f: Frame, targets: Value, user: Value, target: Value, projectile: Value, projectile_type: Value, current_loc: Value, i: Value, L: Value, trail: Value, M: Value) {
	f.vars = () => [targets, user, target, projectile, projectile_type, current_loc, i, L, trail, M];
	projectile = null;
	if (truthy((yield* g.call(f, P("/proc/istext"), null, [rt.sv(f, "proj_type")])))) {
		projectile_type = (yield* g.call(f, P("/proc/text2path"), null, [rt.sv(f, "proj_type")]));
		projectile = (yield* g.new_(f, live(projectile_type), [live(user)]));
	} else {
		if (truthy((rt.istype(rt.sv(f, "proj_type"), T("/obj/effect/proc_holder/spell")) ? 1 : 0))) {
			rt.modField(f, (projectile = (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/trigger"), [live(user)]))), "linked_spells", rt.sv(f, "proj_type"), add);
		} else {
			projectile = (yield* g.new_(f, rt.sv(f, "proj_type"), [live(user)]));
		}
	}
	rt.setFv(f, "icon", live(projectile), rt.sv(f, "proj_icon"));
	rt.setFv(f, "icon_state", live(projectile), rt.sv(f, "proj_icon_state"));
	yield* g.callName(f, live(projectile), "setDir", [rt.getDir(f, live(projectile), live(target))]);
	rt.setFv(f, "name", live(projectile), rt.sv(f, "proj_name"));
	current_loc = rt.fv(f, "loc", live(user));
	rt.setFv(f, "loc", live(projectile), live(current_loc));
	i = null;
	i = 0;
	while (rt.lt(live(i), rt.sv(f, "proj_lifespan"))) {
		if (!truthy(live(projectile))) {
			break;
		}
		if (truthy(rt.sv(f, "proj_insubstantial"))) {
			rt.setFv(f, "loc", live(projectile), rt.getStep(f, live(projectile), rt.fv(f, "dir", live(projectile))));
		} else {
			yield* g.call(f, P("/proc/step"), null, [live(projectile), rt.fv(f, "dir", live(projectile))]);
		}
		if ((isEqual(rt.fv(f, "loc", live(projectile)), live(current_loc)) || isEqual(live(i), rt.sv(f, "proj_lifespan")))) {
			yield* g.callName(f, live(projectile), "cast", [null, live(current_loc), "user", live(user)], rt.Args.Named);
			break;
		}
		if ((truthy((L = rt.locateIn(f, T("/mob/living"), subtract((yield* g.call(f, P("/proc/range"), null, [live(projectile), rt.sv(f, "proj_trigger_range")])), live(user))))) && !isEqual(rt.fv(f, "stat", live(L)), 2))) {
			yield* g.callName(f, live(projectile), "cast", [null, rt.fv(f, "loc", live(L)), "user", live(user)], rt.Args.Named);
			break;
		}
		if ((truthy(rt.sv(f, "proj_trail")) && truthy(live(projectile)))) {
			rt.spawnTail(f, 0, "/obj/effect/proc_holder/spell/dumbfire/proc/cast: spawn at modules/spells/spell_types/dumbfire.dm:74", targets, user, target, projectile, projectile_type, current_loc, i, L, trail, M);
		}
		current_loc = rt.fv(f, "loc", live(projectile));
		yield* g.callName(f, (M = (yield* g.new_(f, T("/matrix"), []))), "Turn", [(yield* g.call(f, P("/proc/dir2angle"), null, [rt.fv(f, "dir", live(projectile))]))]);
		rt.setFv(f, "transform", live(projectile), live(M));
		yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "proj_step_delay")]);
		i = rt.inc(live(i), 1);
	}
	if (truthy(live(projectile))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(projectile)]);
	}
	return null;
});

// a spawn(0) body of /obj/effect/proc_holder/spell/dumbfire/proc/cast, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/proc_holder/spell/dumbfire/proc/cast: spawn at modules/spells/spell_types/dumbfire.dm:74", function* (f: Frame, targets: Value, user: Value, target: Value, projectile: Value, projectile_type: Value, current_loc: Value, i: Value, L: Value, trail: Value, M: Value) {
	f.vars = () => [targets, user, target, projectile, projectile_type, current_loc, i, L, trail, M];
	if (truthy(live(projectile))) {
		rt.setFv(f, "icon", (trail = (yield* g.new_(f, T("/obj/effect/overlay"), [rt.fv(f, "loc", live(projectile))]))), rt.sv(f, "proj_trail_icon"));
		rt.setFv(f, "icon_state", live(trail), rt.sv(f, "proj_trail_icon_state"));
		rt.setFv(f, "density", live(trail), 0);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(trail)])), rt.sv(f, "proj_trail_lifespan"), 8]);
	}
	return null;
});
