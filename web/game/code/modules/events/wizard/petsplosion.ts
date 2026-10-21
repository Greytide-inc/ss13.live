// From code/modules/events/wizard/petsplosion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1371, "/datum/round_event_control/wizard/petsplosion", "/datum/round_event_control/wizard", {
	mobs_to_dupe: 0,
	name: "Petsplosion",
	weight: 2,
	typepath: rt.typePath("/datum/round_event/wizard/petsplosion"),
	max_occurrences: 1,
	earliest_start: 0,
});

// /datum/round_event_control/wizard/petsplosion/proc/preRunEvent  (code/modules/events/wizard/petsplosion.dm:10)  may sleep
rt.def("/datum/round_event_control/wizard/petsplosion/proc/preRunEvent", function* preRunEvent(f: Frame) {
	let F: Value = null;
	let $e: any;
	f.vars = () => [F, $e];
	F = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/simple_animal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if ((!truthy((rt.istype(live(F), T("/mob/living/simple_animal/hostile")) ? 1 : 0)) && isEqual(rt.fv(f, "z", live(F)), 2))) {
			rt.incSrcVar(f, "mobs_to_dupe", 1, true);
		}
	}
	rt.endFor(f, 0);
	if ((rt.gt(rt.sv(f, "mobs_to_dupe"), 100) || !truthy(rt.sv(f, "mobs_to_dupe")))) {
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(347, "/datum/round_event/wizard/petsplosion", "/datum/round_event/wizard", {
	countdown: 0,
	mobs_duped: 0,
	endWhen: 61,
});

// /datum/round_event/wizard/petsplosion/proc/tick  (code/modules/events/wizard/petsplosion.dm:24)  may sleep
rt.def("/datum/round_event/wizard/petsplosion/proc/tick", function* tick(f: Frame) {
	let F: Value = null;
	let $e: any;
	f.vars = () => [F, $e];
	if (!rt.ge(rt.sv(f, "activeFor"), multiply(30, rt.sv(f, "countdown")))) return f.dot;
	rt.modSrcVar(f, "countdown", 1, add);
	F = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/simple_animal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if ((!truthy((rt.istype(live(F), T("/mob/living/simple_animal/hostile")) ? 1 : 0)) && isEqual(rt.fv(f, "z", live(F)), 2))) {
			yield* g.new_(f, rt.fv(f, "type", live(F)), [rt.fv(f, "loc", live(F))]);
			rt.incSrcVar(f, "mobs_duped", 1, true);
			if (rt.gt(rt.sv(f, "mobs_duped"), 400)) {
				yield* g.srcCall(f, "kill");
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
