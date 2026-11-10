// Based on /tg/station's code/game/machinery/doors/alarmlock.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// alarmlock.dm:15
rt.def("/obj/machinery/door/airlock/alarmlock/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_connection = (yield* new_(T("/datum/radio_frequency")));
	return f.dot;
}, true);

// alarmlock.dm:20
rt.def("/obj/machinery/door/airlock/alarmlock/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.air_frequency);
	}
	this.air_connection = null;
	return (yield* parent_proc());
}, true);

// alarmlock.dm:25
rt.def("/obj/machinery/door/airlock/alarmlock/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* GLOB.SSradio.remove_object(this, this.air_frequency);
	this.air_connection = GLOB.SSradio.add_object(this, this.air_frequency, GLOB.RADIO_TO_AIRALARM);
	yield* this.open();
	return f.dot;
}, true);

// alarmlock.dm:31
rt.def("/obj/machinery/door/airlock/alarmlock/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	yield* parent_proc();
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	let alarm_area: Value = rt.index(signal.data, "zone");
	let alert: Value = rt.index(signal.data, "alert");
	let our_area: Value = get_area(this);
	if (alarm_area != our_area.name) return f.dot;
	if (alert === "severe") {
		this.autoclose = 1;
		yield* this.close();
	} else if (alert === "minor" || alert === "clear") {
		this.autoclose = 0;
		yield* this.open();
	}
	return f.dot;
}, true);
