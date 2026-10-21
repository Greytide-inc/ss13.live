// From code/game/machinery/mass_driver.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10806, "/obj/machinery/mass_driver", "/obj/machinery", {
	power: 1,
	code: 1,
	id: 1,
	drive_range: 50,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 50,
	name: "mass driver",
	desc: "The finest in spring-loaded piston toy technology, now on a space station near you.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "mass_driver",
});

// /obj/machinery/mass_driver/proc/drive  (code/game/machinery/mass_driver.dm:17)  may sleep
rt.def("/obj/machinery/mass_driver/proc/drive", function* drive(f: Frame, amount: Value) {
	let O_limit: Value = null, target: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [amount, O_limit, target, O, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "use_power", 500);
	O_limit = null;
	target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), rt.sv(f, "dir")]));
	O = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((!truthy(rt.fv(f, "anchored", live(O))) || truthy((rt.istype(live(O), T("/obj/mecha")) ? 1 : 0)))) {
			O_limit = rt.inc(live(O_limit), 1);
			if (rt.ge(live(O_limit), 20)) {
				yield* g.srcCall(f, "audible_message", fmt("<span class='notice'>＀ lets out a screech, it doesn't seem to be able to handle the load.</span>", [live(f.src)]));
				break;
			}
			yield* g.srcCall(f, "use_power", 500);
			yield* g.callName(f, live(O), "throw_at", [live(target), multiply(rt.sv(f, "drive_range"), rt.sv(f, "power")), rt.sv(f, "power")]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/flick"), null, ["mass_driver1", live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/mass_driver/proc/emp_act  (code/game/machinery/mass_driver.dm:34)  may sleep
rt.def("/obj/machinery/mass_driver/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "drive");
	yield* g.callSuper(f, [live(severity)]);
	return f.dot;
}, true);
