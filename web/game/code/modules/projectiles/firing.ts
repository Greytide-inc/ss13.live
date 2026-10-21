// From code/modules/projectiles/firing.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/ammo_casing/proc/fire_casing  (code/modules/projectiles/firing.dm:2)  may sleep
rt.def("/obj/item/ammo_casing/proc/fire_casing", function* fire_casing(f: Frame, target: Value, user: Value, params: Value, distro: Value, quiet: Value, zone_override: Value, spread: Value) {
	let i: Value = null, targloc: Value = null;
	f.vars = () => [target, user, params, distro, quiet, zone_override, spread, i, targloc];
	distro = rt.modify(live(distro), rt.sv(f, "variance"), add);
	i = null;
	i = (yield* g.call(f, P("/proc/max"), null, [1, rt.sv(f, "pellets")]));
	while (rt.gt(live(i), 0)) {
		targloc = rt.getStep(f, live(target), 0);
		yield* g.srcCall(f, "ready_proj", live(target), live(user), live(quiet), live(zone_override));
		if (truthy(live(distro))) {
			if (truthy(rt.sv(f, "randomspread"))) {
				spread = (yield* g.call(f, P("/proc/round"), null, [multiply(subtract((yield* g.call(f, P("/proc/rand"), null, [])), 0.5), live(distro))]));
			} else {
				spread = (yield* g.call(f, P("/proc/round"), null, [multiply(subtract(divide(live(i), rt.sv(f, "pellets")), 0.5), live(distro))]));
			}
		}
		if (!truthy((yield* g.srcCall(f, "throw_proj", live(target), live(targloc), live(user), live(params), live(spread))))) {
			return 0;
		}
		if (rt.gt(live(i), 1)) {
			yield* g.srcCall(f, "newshot");
		}
		i = rt.inc(live(i), -1);
	}
	if (truthy(rt.sv(f, "click_cooldown_override"))) {
		yield* g.callName(f, live(user), "changeNext_move", [rt.sv(f, "click_cooldown_override")]);
	} else {
		yield* g.callName(f, live(user), "changeNext_move", [4]);
	}
	yield* g.callName(f, live(user), "newtonian_move", [rt.getDir(f, live(target), live(user))]);
	yield* g.srcCall(f, "update_icon");
	return 1;
}, true);

// /obj/item/ammo_casing/proc/ready_proj  (code/modules/projectiles/firing.dm:24)  may sleep
rt.def("/obj/item/ammo_casing/proc/ready_proj", function* ready_proj(f: Frame, target: Value, user: Value, quiet: Value, zone_override: Value) {
	f.vars = () => [target, user, quiet, zone_override];
	if (!truthy(rt.sv(f, "BB"))) {
		return live(f.dot);
	}
	rt.setFv(f, "original", rt.sv(f, "BB"), live(target));
	rt.setFv(f, "firer", rt.sv(f, "BB"), live(user));
	if (truthy(live(zone_override))) {
		rt.setFv(f, "def_zone", rt.sv(f, "BB"), live(zone_override));
	} else {
		rt.setFv(f, "def_zone", rt.sv(f, "BB"), rt.fv(f, "zone_selected", live(user)));
	}
	rt.setFv(f, "suppressed", rt.sv(f, "BB"), live(quiet));
	if (!(truthy(rt.sv(f, "reagents")) && truthy(rt.fv(f, "reagents", rt.sv(f, "BB"))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [rt.sv(f, "BB"), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "reagents")]);
	return f.dot;
}, true);

// /obj/item/ammo_casing/proc/throw_proj  (code/modules/projectiles/firing.dm:39)  may sleep
rt.def("/obj/item/ammo_casing/proc/throw_proj", function* throw_proj(f: Frame, target: Value, targloc: Value, user: Value, params: Value, spread: Value) {
	let curloc: Value = null, firing_dir: Value = null, direct_target: Value = null;
	f.vars = () => [target, targloc, user, params, spread, curloc, firing_dir, direct_target];
	curloc = rt.getStep(f, live(user), 0);
	if (((!truthy((rt.istype(live(targloc), T("/turf")) ? 1 : 0)) || !truthy((rt.istype(live(curloc), T("/turf")) ? 1 : 0))) || !truthy(rt.sv(f, "BB")))) {
		return 0;
	}
	firing_dir = null;
	if (truthy(rt.fv(f, "firer", rt.sv(f, "BB")))) {
		firing_dir = rt.gv(f, "dir", rt.fv(f, "firer", rt.sv(f, "BB")));
	}
	if ((!truthy(rt.fv(f, "suppressed", rt.sv(f, "BB"))) && truthy(rt.sv(f, "firing_effect_type")))) {
		yield* g.new_(f, rt.sv(f, "firing_effect_type"), [rt.getStep(f, live(f.src), 0), live(firing_dir)]);
	}
	direct_target = null;
	if (isEqual(live(targloc), live(curloc))) {
		if (truthy(live(target))) {
			direct_target = live(target);
		}
	}
	if (!truthy(live(direct_target))) {
		yield* g.callName(f, rt.sv(f, "BB"), "preparePixelProjectile", [live(target), live(targloc), live(user), live(params), live(spread)]);
	}
	yield* g.callName(f, rt.sv(f, "BB"), "fire", [null, live(direct_target)]);
	rt.setSv(f, "BB", null);
	return 1;
}, true);

// /obj/item/ammo_casing/proc/spread  (code/modules/projectiles/firing.dm:60)
rt.def("/obj/item/ammo_casing/proc/spread", function spread(f: Frame, target: Value, current: Value, distro: Value) {
	let dx: Value = null, dy: Value = null;
	f.vars = () => [dx, dy];
	dx = rt.op(f, "Abs", [], [subtract(rt.fv(f, "x", live(target)), rt.fv(f, "x", live(current)))]);
	dy = rt.op(f, "Abs", [], [subtract(rt.fv(f, "y", live(target)), rt.fv(f, "y", live(current)))]);
	return rt.locate(add(rt.fv(f, "x", live(target)), rt.call(f, P("/proc/round"), null, [divide(multiply(rt.call(f, P("/proc/gaussian"), null, [0, live(distro)]), add(live(dy), 2)), 8), 1])), add(rt.fv(f, "y", live(target)), rt.call(f, P("/proc/round"), null, [divide(multiply(rt.call(f, P("/proc/gaussian"), null, [0, live(distro)]), add(live(dx), 2)), 8), 1])), rt.fv(f, "z", live(target)));
});
