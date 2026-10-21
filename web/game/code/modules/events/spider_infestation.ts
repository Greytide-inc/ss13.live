// From code/modules/events/spider_infestation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(322, "/datum/round_event/spider_infestation", "/datum/round_event", {
	spawncount: 1,
	announceWhen: 400,
});

// /datum/round_event/spider_infestation/proc/setup  (code/modules/events/spider_infestation.dm:15)
rt.def("/datum/round_event/spider_infestation/proc/setup", function setup(f: Frame) {
	rt.setSv(f, "announceWhen", rt.call(f, P("/proc/rand"), null, [rt.sv(f, "announceWhen"), add(rt.sv(f, "announceWhen"), 50)]));
	rt.setSv(f, "spawncount", rt.call(f, P("/proc/rand"), null, [5, 8]));
	return f.dot;
});

// /datum/round_event/spider_infestation/proc/announce  (code/modules/events/spider_infestation.dm:19)  may sleep
rt.def("/datum/round_event/spider_infestation/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Unidentified lifesigns detected coming aboard ＀. Secure any exterior access, including ducting and ventilation.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Lifesign Alert", rt.rsc("sound/ai/aliens.ogg")]);
	return f.dot;
}, true);

// /datum/round_event/spider_infestation/proc/start  (code/modules/events/spider_infestation.dm:23)  may sleep
rt.def("/datum/round_event/spider_infestation/proc/start", function* start(f: Frame) {
	let vents: Value = null, temp_vent: Value = null, temp_vent_parent: Value = null, vent: Value = null, spawn_type: Value = null;
	let $e: any;
	f.vars = () => [vents, temp_vent, temp_vent_parent, vent, spawn_type, $e];
	vents = rt.list();
	temp_vent = null;
	rt.forList(f, 0, rt.world(), T("/obj/machinery/atmospherics/components/unary/vent_pump"));
	while (($e = rt.next(f, 0)) !== undefined) {
		temp_vent = $e;
		if ((isEqual(rt.gv(f, "z", rt.fv(f, "loc", live(temp_vent))), 2) && !truthy(rt.fv(f, "welded", live(temp_vent))))) {
			if (rt.gt(rt.getLen(f, rt.gv(f, "other_atmosmch", (temp_vent_parent = rt.index(rt.fv(f, "parents", live(temp_vent)), 1)))), 20)) {
				vents = rt.modify(live(vents), live(temp_vent), add);
			}
		}
	}
	rt.endFor(f, 0);
	while (rt.ge(rt.sv(f, "spawncount"), 1) && truthy(rt.len(f, live(vents)))) {
		vent = rt.op(f, "PickUnweighted", [1], [live(vents)]);
		spawn_type = T("/obj/structure/spider/spiderling");
		if (truthy(rt.op(f, "Prob", [], [66]))) {
			spawn_type = T("/obj/structure/spider/spiderling/nurse");
		}
		yield* g.call(f, P("/proc/spawn_atom_to_turf"), null, [live(spawn_type), live(vent), 1, 0]);
		(vents = rt.modify(live(vents), live(vent), subtract));
		rt.incSrcVar(f, "spawncount", -1, true);
	}
	return f.dot;
}, true);
