// From code/modules/mob/dead/observer/logout.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/dead/observer/proc/Logout  (code/modules/mob/dead/observer/logout.dm:3)  may sleep
rt.def("/mob/dead/observer/proc/Logout", function* Logout(f: Frame) {
	let target: Value = null;
	f.vars = () => [target];
	if (truthy(rt.sv(f, "client"))) {
		// tg_js: leaving the ghost (re-entering a body, respawning) puts the zoom back to the normal view size.
		yield* g.callName(f, rt.sv(f, "client"), "zoom_view", [0, 1]);
		(rt.modField(f, rt.sv(f, "client"), "images", add(rt.gl("ghost_images_default"), rt.gl("ghost_images_simple")), subtract));
	}
	if (truthy(rt.sv(f, "observetarget"))) {
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "observetarget")])))) {
			if (truthy(rt.gv(f, "observers", (target = rt.sv(f, "observetarget"))))) {
				(rt.modField(f, live(target), "observers", live(f.src), subtract));
				if ((truthy(rt.fv(f, "observers", live(target))) && !truthy(rt.getLen(f, rt.fv(f, "observers", live(target)))))) {
					rt.setFv(f, "observers", live(target), null);
				}
			}
			rt.setSv(f, "observetarget", null);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.spawnTail(f, 0, "/mob/dead/observer/proc/Logout: spawn at modules/mob/dead/observer/logout.dm:13", target);
	return f.dot;
}, true);

// a spawn(0) body of /mob/dead/observer/proc/Logout, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/dead/observer/proc/Logout: spawn at modules/mob/dead/observer/logout.dm:13", function* (f: Frame, target: Value) {
	f.vars = () => [target];
	if ((truthy(live(f.src)) && !truthy(rt.sv(f, "key")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return null;
});
