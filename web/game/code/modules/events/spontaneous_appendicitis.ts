// From code/modules/events/spontaneous_appendicitis.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(323, "/datum/round_event/spontaneous_appendicitis", "/datum/round_event", {});

// /datum/round_event/spontaneous_appendicitis/proc/start  (code/modules/events/spontaneous_appendicitis.dm:10)  may sleep
rt.def("/datum/round_event/spontaneous_appendicitis/proc/start", function* start(f: Frame) {
	let H: Value = null, foundAlready: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [H, foundAlready, D, $e];
	H = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/shuffle"), null, [rt.gl("living_mob_list")])), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		foundAlready = 0;
		D = null;
		rt.forList(f, 1, rt.fv(f, "viruses", live(H)), T("/datum/disease"));
		while (($e = rt.next(f, 1)) !== undefined) {
			D = $e;
			foundAlready = 1;
		}
		rt.endFor(f, 1);
		if ((isEqual(rt.fv(f, "stat", live(H)), 2) || truthy(live(foundAlready)))) {
			continue;
		}
		D = (yield* g.new_(f, T("/datum/disease/appendicitis"), []));
		yield* g.callName(f, live(H), "ForceContractDisease", [live(D)]);
		break;
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
