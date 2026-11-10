// Based on /tg/station's code/modules/events/wizard/fakeexplosion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(339, "/datum/round_event/wizard/fake_explosion", "/datum/round_event/wizard", {});

// fakeexplosion.dm:9
rt.def("/datum/round_event/wizard/fake_explosion/proc/start", function* start(f: Frame) {
	let M: Value = null;
	for (M of each(GLOB.player_list, T("/mob"))) {
		rt.op(f, "Output", [], [M, rt.rsc("sound/machines/alarm.ogg")], false);
	}
	yield* addtimer((yield* new_(T("/datum/callback"), GLOB.SSticker, P("/datum/controller/subsystem/ticker/proc/station_explosion_cinematic"), 1, "fake")), 100);
	return f.dot;
}, true);
