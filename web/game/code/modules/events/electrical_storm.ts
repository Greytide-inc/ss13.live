// From code/modules/events/electrical_storm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(300, "/datum/round_event/electrical_storm", "/datum/round_event", {
	lightsoutAmount: 1,
	lightsoutRange: 25,
	announceWhen: 1,
});

// /datum/round_event/electrical_storm/proc/announce  (code/modules/events/electrical_storm.dm:15)  may sleep
rt.def("/datum/round_event/electrical_storm/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, ["An electrical storm has been detected in your area, please repair potential electronic overloads.", "Electrical Storm Alert"]);
	return f.dot;
}, true);

// /datum/round_event/electrical_storm/proc/start  (code/modules/events/electrical_storm.dm:19)  may sleep
rt.def("/datum/round_event/electrical_storm/proc/start", function* start(f: Frame) {
	let epicentreList: Value = null, i: Value = null, possibleEpicentres: Value = null, newEpicentre: Value = null, epicentre: Value = null, apc: Value = null;
	let $e: any;
	f.vars = () => [epicentreList, i, possibleEpicentres, newEpicentre, epicentre, apc, $e];
	epicentreList = rt.list();
	i = null;
	i = 1;
	while (rt.le(live(i), rt.sv(f, "lightsoutAmount"))) {
		possibleEpicentres = rt.list();
		newEpicentre = null;
		rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
		while (($e = rt.next(f, 0)) !== undefined) {
			newEpicentre = $e;
			if ((isEqual(rt.fv(f, "name", live(newEpicentre)), "lightsout") && !truthy((rt.isIn(f, live(newEpicentre), live(epicentreList)) ? 1 : 0)))) {
				possibleEpicentres = rt.modify(live(possibleEpicentres), live(newEpicentre), add);
			}
		}
		rt.endFor(f, 0);
		if (truthy(rt.len(f, live(possibleEpicentres)))) {
			epicentreList = rt.modify(live(epicentreList), rt.op(f, "PickUnweighted", [1], [live(possibleEpicentres)]), add);
		} else {
			break;
		}
		i = rt.inc(live(i), 1);
	}
	if (!truthy(rt.len(f, live(epicentreList)))) {
		return live(f.dot);
	}
	epicentre = null;
	rt.forList(f, 0, live(epicentreList), T("/obj/effect/landmark"));
	while (($e = rt.next(f, 0)) !== undefined) {
		epicentre = $e;
		apc = null;
		rt.forList(f, 1, (yield* g.call(f, P("/proc/urange"), null, [rt.sv(f, "lightsoutRange"), live(epicentre)])), T("/obj/machinery/power/apc"));
		while (($e = rt.next(f, 1)) !== undefined) {
			apc = $e;
			yield* g.callName(f, live(apc), "overload_lighting", []);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
