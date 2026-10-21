// From code/controllers/subsystem/parallax.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(34, "/datum/controller/subsystem/parallax", "/datum/controller/subsystem", {
	currentrun: null,
	name: "Parallax",
	wait: 2,
	flags: 69,
	priority: 65,
	runlevels: 15,
});

// /datum/controller/subsystem/parallax/proc/New  (code/controllers/subsystem/parallax.dm:1)  may sleep
rt.def("/datum/controller/subsystem/parallax/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSparallax"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSparallax"), T("/datum/controller/subsystem/parallax")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSparallax")]);
		}
		rt.setGl("SSparallax", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/parallax/proc/fire  (code/controllers/subsystem/parallax.dm:10)
rt.def("/datum/controller/subsystem/parallax/proc/fire", function fire(f: Frame, resumed: Value) {
	let currentrun: Value = null, C: Value = null, A: Value = null;
	let $0: any;
	f.vars = () => [resumed, currentrun, C, A, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), rt.callName(f, rt.gl("clients"), "Copy", []));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	while (truthy(rt.length(live(currentrun)))) {
		C = rt.index(live(currentrun), rt.len(f, live(currentrun)));
		rt.incField(f, live(currentrun), "len", -1, true);
		if ((!truthy(live(C)) || !truthy(rt.fv(f, "eye", live(C))))) {
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = rt.callSrc(f, "pause", []);
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				return live(f.dot);
			}
			continue;
		}
		if (!truthy((A = rt.fv(f, "eye", live(C))))) {
			return live(f.dot);
		}
		live(A);
		while (truthy(rt.call(f, P("/proc/isloc"), null, [rt.fv(f, "loc", live(A))])) && !truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(A))]))) {
			A = rt.fv(f, "loc", live(A));
		}
		if (!isEqual(live(A), rt.fv(f, "movingmob", live(C)))) {
			if (rt.fv(f, "movingmob", live(C)) !== null) {
				(rt.modField(f, rt.fv(f, "movingmob", live(C)), "client_mobs_in_contents", rt.fv(f, "mob", live(C)), subtract));
				if ((truthy(rt.gv(f, "client_mobs_in_contents", rt.fv(f, "movingmob", live(C)))) && !truthy(rt.getLen(f, rt.gv(f, "client_mobs_in_contents", rt.fv(f, "movingmob", live(C))))))) {
					rt.setFv(f, "client_mobs_in_contents", rt.fv(f, "movingmob", live(C)), null);
				}
			}
			if (!truthy(rt.fv(f, "client_mobs_in_contents", live(A)))) {
				rt.setFv(f, "client_mobs_in_contents", live(A), rt.list());
			}
			rt.modField(f, live(A), "client_mobs_in_contents", rt.fv(f, "mob", live(C)), add);
			rt.setFv(f, "movingmob", live(C), live(A));
		}
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = rt.callSrc(f, "pause", []);
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	currentrun = null;
	return f.dot;
});
