// From code/modules/spells/spell_types/projectile.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11295, "/obj/effect/proc_holder/spell/targeted/projectile", "/obj/effect/proc_holder/spell/targeted", {
	proj_icon: rt.rsc("icons/obj/projectiles.dmi"),
	proj_icon_state: "spell",
	proj_name: "a spell projectile",
	proj_trail: 0,
	proj_trail_lifespan: 0,
	proj_trail_icon: rt.rsc("icons/obj/wizard.dmi"),
	proj_trail_icon_state: "trail",
	proj_type: "/obj/effect/proc_holder/spell/targeted",
	proj_lingering: 0,
	proj_homing: 1,
	proj_insubstantial: 0,
	proj_trigger_range: 0,
	proj_lifespan: 15,
	proj_step_delay: 1,
	name: "Projectile",
	desc: "This spell summons projectiles which try to hit the targets.",
});

// /obj/effect/proc_holder/spell/targeted/projectile/proc/cast  (code/modules/spells/spell_types/projectile.dm:26)
rt.def("/obj/effect/proc_holder/spell/targeted/projectile/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, projectile: Value = null, projectile_type: Value = null, current_loc: Value = null, i: Value = null, trail: Value = null;
	let $e: any;
	f.vars = () => [user, target, projectile, projectile_type, current_loc, i, trail, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	rt.callSrc(f, "playMagSound", []);
	target = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		rt.spawnTail(f, 0, "/obj/effect/proc_holder/spell/targeted/projectile/proc/cast: spawn at modules/spells/spell_types/projectile.dm:28", targets, user, target, projectile, projectile_type, current_loc, i, trail);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// a spawn(0) body of /obj/effect/proc_holder/spell/targeted/projectile/proc/cast, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/proc_holder/spell/targeted/projectile/proc/cast: spawn at modules/spells/spell_types/projectile.dm:28", function* (f: Frame, targets: Value, user: Value, target: Value, projectile: Value, projectile_type: Value, current_loc: Value, i: Value, trail: Value) {
	f.vars = () => [targets, user, target, projectile, projectile_type, current_loc, i, trail];
	projectile = null;
	if (truthy((yield* g.call(f, P("/proc/istext"), null, [rt.sv(f, "proj_type")])))) {
		projectile_type = (yield* g.call(f, P("/proc/text2path"), null, [rt.sv(f, "proj_type")]));
		projectile = (yield* g.new_(f, live(projectile_type), [live(user)]));
	}
	if (truthy((rt.istype(rt.sv(f, "proj_type"), T("/obj/effect/proc_holder/spell")) ? 1 : 0))) {
		rt.modField(f, (projectile = (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/trigger"), [live(user)]))), "linked_spells", rt.sv(f, "proj_type"), add);
	}
	rt.setFv(f, "icon", live(projectile), rt.sv(f, "proj_icon"));
	rt.setFv(f, "icon_state", live(projectile), rt.sv(f, "proj_icon_state"));
	yield* g.callName(f, live(projectile), "setDir", [rt.getDir(f, live(target), live(projectile))]);
	rt.setFv(f, "name", live(projectile), rt.sv(f, "proj_name"));
	current_loc = rt.fv(f, "loc", live(user));
	rt.setFv(f, "loc", live(projectile), live(current_loc));
	i = null;
	i = 0;
	while (rt.lt(live(i), rt.sv(f, "proj_lifespan"))) {
		if (!truthy(live(projectile))) {
			break;
		}
		if (truthy(rt.sv(f, "proj_homing"))) {
			if (truthy(rt.sv(f, "proj_insubstantial"))) {
				yield* g.callName(f, live(projectile), "setDir", [rt.getDir(f, live(projectile), live(target))]);
				rt.setFv(f, "loc", live(projectile), (yield* g.call(f, P("/proc/get_step_to"), null, [live(projectile), live(target)])));
			} else {
				yield* g.call(f, P("/proc/step_to"), null, [live(projectile), live(target)]);
			}
		} else {
			if (truthy(rt.sv(f, "proj_insubstantial"))) {
				rt.setFv(f, "loc", live(projectile), rt.getStep(f, live(projectile), rt.sv(f, "dir")));
			} else {
				yield* g.call(f, P("/proc/step"), null, [live(projectile), rt.sv(f, "dir")]);
			}
		}
		if (!truthy(live(projectile))) {
			break;
		}
		if ((!truthy(live(target)) || (!truthy(rt.sv(f, "proj_lingering")) && isEqual(rt.fv(f, "loc", live(projectile)), live(current_loc))))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(projectile)]);
			break;
		}
		if ((truthy(rt.sv(f, "proj_trail")) && truthy(live(projectile)))) {
			rt.spawnTail(f, 0, "/obj/effect/proc_holder/spell/targeted/projectile/proc/cast: spawn at modules/spells/spell_types/projectile.dm:69", targets, user, target, projectile, projectile_type, current_loc, i, trail);
		}
		if (truthy((rt.isIn(f, rt.fv(f, "loc", live(projectile)), (yield* g.call(f, P("/proc/range"), null, [rt.fv(f, "loc", live(target)), rt.sv(f, "proj_trigger_range")]))) ? 1 : 0))) {
			yield* g.callName(f, live(projectile), "perform", [null, rt.list(live(target)), "user", live(user)], rt.Args.Named);
			break;
		}
		current_loc = rt.fv(f, "loc", live(projectile));
		yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "proj_step_delay")]);
		i = rt.inc(live(i), 1);
	}
	if (truthy(live(projectile))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(projectile)]);
	}
	return null;
});

// a spawn(0) body of /obj/effect/proc_holder/spell/targeted/projectile/proc/cast, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/proc_holder/spell/targeted/projectile/proc/cast: spawn at modules/spells/spell_types/projectile.dm:69", function* (f: Frame, targets: Value, user: Value, target: Value, projectile: Value, projectile_type: Value, current_loc: Value, i: Value, trail: Value) {
	f.vars = () => [targets, user, target, projectile, projectile_type, current_loc, i, trail];
	if (truthy(live(projectile))) {
		rt.setFv(f, "icon", (trail = (yield* g.new_(f, T("/obj/effect/overlay"), [rt.fv(f, "loc", live(projectile))]))), rt.sv(f, "proj_trail_icon"));
		rt.setFv(f, "icon_state", live(trail), rt.sv(f, "proj_trail_icon_state"));
		rt.setFv(f, "density", live(trail), 0);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(trail)])), rt.sv(f, "proj_trail_lifespan"), 8]);
	}
	return null;
});
