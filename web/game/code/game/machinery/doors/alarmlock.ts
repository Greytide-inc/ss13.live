// From code/game/machinery/doors/alarmlock.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10264, "/obj/machinery/door/airlock/alarmlock", "/obj/machinery/door/airlock", {
	air_connection: null,
	air_frequency: 1437,
	overlays_file: rt.rsc("icons/obj/doors/airlocks/station2/overlays.dmi"),
	name: "glass alarm airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station2/glass.dmi"),
	opacity: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_glass"),
	glass: 1,
	autoclose: 0,
});

// /obj/machinery/door/airlock/alarmlock/proc/New  (code/game/machinery/doors/alarmlock.dm:15)  may sleep
rt.def("/obj/machinery/door/airlock/alarmlock/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "air_connection", (yield* g.new_(f, T("/datum/radio_frequency"), [])));
	return f.dot;
}, true);

// /obj/machinery/door/airlock/alarmlock/proc/Destroy  (code/game/machinery/doors/alarmlock.dm:20)  may sleep
rt.def("/obj/machinery/door/airlock/alarmlock/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "air_frequency")]);
	}
	rt.setSv(f, "air_connection", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/door/airlock/alarmlock/proc/Initialize  (code/game/machinery/doors/alarmlock.dm:25)  may sleep
rt.def("/obj/machinery/door/airlock/alarmlock/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "air_frequency")]);
	rt.setSv(f, "air_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "air_frequency"), rt.gl("RADIO_TO_AIRALARM")])));
	yield* g.srcCall(f, "open");
	return f.dot;
}, true);

// /obj/machinery/door/airlock/alarmlock/proc/receive_signal  (code/game/machinery/doors/alarmlock.dm:31)  may sleep
rt.def("/obj/machinery/door/airlock/alarmlock/proc/receive_signal", function* receive_signal(f: Frame) {
	let alarm_area: Value = null, alert: Value = null, our_area: Value = null;
	let $0: any;
	f.vars = () => [alarm_area, alert, our_area, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	alarm_area = rt.index(rt.fv(f, "data", live(f.args[0])), "zone");
	alert = rt.index(rt.fv(f, "data", live(f.args[0])), "alert");
	our_area = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	if (!isEqual(live(alarm_area), rt.fv(f, "name", live(our_area)))) return f.dot;
	$0 = live(alert);
	if ($0 === "severe") {
		rt.setSv(f, "autoclose", 1);
		yield* g.srcCall(f, "close");
	} else if ($0 === "minor" || $0 === "clear") {
		rt.setSv(f, "autoclose", 0);
		yield* g.srcCall(f, "open");
	}
	return f.dot;
}, true, { args: ["signal"] });
