// From code/modules/vehicles/bicycle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13062, "/obj/vehicle/bicycle", "/obj/vehicle", {
	easter_egg_chance: 1,
	name: "bicycle",
	desc: "Keep away from electricity.",
	icon_state: "bicycle",
}, { global: { bike_music: 810 } });

// /obj/vehicle/bicycle/proc/Initialize  (code/modules/vehicles/bicycle.dm:11)
rt.def("/obj/vehicle/bicycle/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "riding_datum", rt.new_(f, T("/datum/riding/bicycle"), []));
	return f.dot;
});

// /obj/vehicle/bicycle/proc/buckle_mob  (code/modules/vehicles/bicycle.dm:15)  may sleep
rt.def("/obj/vehicle/bicycle/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if ((truthy(rt.op(f, "Prob", [], [rt.sv(f, "easter_egg_chance")])) || (truthy(rt.fv(f, "holidays", rt.gl("SSevents"))) && truthy(rt.index(rt.fv(f, "holidays", rt.gl("SSevents")), "April Fool's Day"))))) {
		rt.op(f, "Output", [], [live(f.args[0]), (yield* g.call(f, P("/proc/sound"), null, [null, rt.op(f, "PickUnweighted", [1], [rt.gl("bike_music")]), "repeat", 1, "wait", 0, "volume", 80, "channel", 42], rt.Args.Named))], false);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// /obj/vehicle/bicycle/proc/unbuckle_mob  (code/modules/vehicles/bicycle.dm:21)  may sleep
rt.def("/obj/vehicle/bicycle/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy(live(f.args[0]))) {
		rt.op(f, "Output", [], [live(f.args[0]), (yield* g.call(f, P("/proc/sound"), null, [null, null, "repeat", 0, "wait", 0, "volume", 80, "channel", 42], rt.Args.Named))], false);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["buckled_mob", "force"] });

// /obj/vehicle/bicycle/proc/tesla_act  (code/modules/vehicles/bicycle.dm:25)  may sleep
rt.def("/obj/vehicle/bicycle/proc/tesla_act", function* tesla_act(f: Frame) {
	let m: Value = null;
	let $e: any;
	f.vars = () => [m, $e];
	rt.setSv(f, "name", "fried bicycle");
	rt.setSv(f, "desc", "Well spent.");
	rt.setSv(f, "riding_datum", null);
	rt.setSv(f, "color", "#3f1704");
	m = null;
	rt.forList(f, 0, rt.sv(f, "buckled_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		yield* g.srcCall(f, "unbuckle_mob", live(m), 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
