// From code/modules/events/wizard/fakeexplosion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(339, "/datum/round_event/wizard/fake_explosion", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/fake_explosion/proc/start  (code/modules/events/wizard/fakeexplosion.dm:9)  may sleep
rt.def("/datum/round_event/wizard/fake_explosion/proc/start", function* start(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.op(f, "Output", [], [live(M), rt.rsc("sound/machines/alarm.ogg")], false);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.gl("SSticker"), P("/datum/controller/subsystem/ticker/proc/station_explosion_cinematic"), 1, "fake"])), 100]);
	return f.dot;
}, true);
