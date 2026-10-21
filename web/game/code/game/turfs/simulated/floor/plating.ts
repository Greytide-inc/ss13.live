// From code/game/turfs/simulated/floor/plating.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4507, "/turf/open/floor/plating", "/turf/open/floor", {
	name: "plating",
	icon_state: "plating",
	intact: 0,
});

// /turf/open/floor/plating/proc/Initialize  (code/game/turfs/simulated/floor/plating.dm:17)  may sleep
rt.def("/turf/open/floor/plating/proc/Initialize", function* Initialize(f: Frame) {
	if (!truthy(rt.sv(f, "broken_states"))) {
		rt.setSv(f, "broken_states", rt.list("platingdmg1", "platingdmg2", "platingdmg3"));
	}
	if (!truthy(rt.sv(f, "burnt_states"))) {
		rt.setSv(f, "burnt_states", rt.list("panelscorched"));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_plating", rt.sv(f, "icon_state"));
	return f.dot;
}, true);

// /turf/open/floor/plating/proc/update_icon  (code/game/turfs/simulated/floor/plating.dm:25)
rt.def("/turf/open/floor/plating/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	if (!(!truthy(rt.sv(f, "broken")) && !truthy(rt.sv(f, "burnt")))) return f.dot;
	rt.setSv(f, "icon_state", rt.sv(f, "icon_plating"));
	return f.dot;
});

// /turf/open/floor/plating/proc/attackby  (code/game/turfs/simulated/floor/plating.dm:31)  may sleep
rt.def("/turf/open/floor/plating/proc/attackby", function* attackby(f: Frame) {
	let R: Value = null, W: Value = null, _T: Value = null, L: Value = null, F: Value = null, welder: Value = null;
	f.vars = () => [R, W, _T, L, F, welder];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/rods")) ? 1 : 0))) {
		if ((truthy(rt.sv(f, "broken")) || truthy(rt.sv(f, "burnt")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Repair the plating first!</span>"]);
			return live(f.dot);
		}
		if (rt.lt((yield* g.callName(f, (R = live(f.args[0])), "get_amount", [])), 2)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two rods to make a reinforced floor!</span>"]);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You begin reinforcing the floor...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 30, "target", live(f.src)], rt.Args.Named)))) {
				if ((rt.ge((yield* g.callName(f, live(R), "get_amount", [])), 2) && !truthy((rt.istype(live(f.src), T("/turf/open/floor/engine")) ? 1 : 0)))) {
					yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/engine"));
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 80, 1]);
					yield* g.callName(f, live(R), "use", [2]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You reinforce the floor.</span>"]);
				}
				return live(f.dot);
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile")) ? 1 : 0))) {
			if ((!truthy(rt.sv(f, "broken")) && !truthy(rt.sv(f, "burnt")))) {
				if (!truthy((yield* g.callName(f, (W = live(f.args[0])), "use", [1])))) {
					return live(f.dot);
				}
				_T = (yield* g.srcCall(f, "ChangeTurf", rt.fv(f, "turf_type", live(W))));
				if (truthy((rt.istype(live(W), T("/obj/item/stack/tile/light")) ? 1 : 0))) {
					L = live(W);
					rt.setFv(f, "state", (F = live(_T)), rt.fv(f, "state", live(L)));
				}
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/genhit.ogg"), 50, 1]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This section is too damaged to support a tile! Use a welder to fix the damage.</span>"]);
			}
		} else {
			if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) return f.dot;
			if (!(truthy((yield* g.callName(f, (welder = live(f.args[0])), "isOn", []))) && (truthy(rt.sv(f, "broken")) || truthy(rt.sv(f, "burnt"))))) return f.dot;
			if (!truthy((yield* g.callName(f, live(welder), "remove_fuel", [0, live(f.args[1])])))) return f.dot;
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>You fix some dents on the broken plating.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(welder)), 80, 1]);
			rt.setSv(f, "icon_state", rt.sv(f, "icon_plating"));
			rt.setSv(f, "burnt", 0);
			rt.setSv(f, "broken", 0);
		}
	}
	return f.dot;
}, true, { args: ["C", "user", "params"] });
