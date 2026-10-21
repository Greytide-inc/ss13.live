// From code/game/machinery/Beacon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10777, "/obj/machinery/bluespace_beacon", "/obj/machinery", {
	Beacon: null,
	level: 1,
	anchored: 1,
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "floor_beaconf",
	name: "bluespace gigabeacon",
	desc: "A device that draws power from bluespace and creates a permanent tracking beacon.",
	layer: 2.5,
	use_power: 1,
	idle_power_usage: 0,
});

// /obj/machinery/bluespace_beacon/proc/New  (code/game/machinery/Beacon.dm:15)  may sleep
rt.def("/obj/machinery/bluespace_beacon/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	_T = rt.sv(f, "loc");
	rt.setSv(f, "Beacon", (yield* g.new_(f, T("/obj/item/device/radio/beacon"), [])));
	rt.setFv(f, "invisibility", rt.sv(f, "Beacon"), 100);
	rt.setFv(f, "loc", rt.sv(f, "Beacon"), live(_T));
	yield* g.srcCall(f, "hide", rt.fv(f, "intact", live(_T)));
	return f.dot;
}, true);

// /obj/machinery/bluespace_beacon/proc/Destroy  (code/game/machinery/Beacon.dm:25)  may sleep
rt.def("/obj/machinery/bluespace_beacon/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "Beacon"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "Beacon")]);
	}
	rt.setSv(f, "Beacon", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/bluespace_beacon/proc/hide  (code/game/machinery/Beacon.dm:31)
rt.def("/obj/machinery/bluespace_beacon/proc/hide", function hide(f: Frame, intact: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(live(intact))) {
		$0 = 100;
	} else {
		$0 = 0;
	}
	rt.setSv(f, "invisibility", $0);
	rt.callSrc(f, "updateicon", []);
	return f.dot;
});

// /obj/machinery/bluespace_beacon/proc/updateicon  (code/game/machinery/Beacon.dm:36)
rt.def("/obj/machinery/bluespace_beacon/proc/updateicon", function updateicon(f: Frame) {
	let state: Value = null;
	f.vars = () => [state];
	state = "floor_beacon";
	if (truthy(rt.sv(f, "invisibility"))) {
		rt.setSv(f, "icon_state", fmt("＀f", [live(state)]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀", [live(state)]));
	}
	return f.dot;
});

// /obj/machinery/bluespace_beacon/proc/process  (code/game/machinery/Beacon.dm:45)  may sleep
rt.def("/obj/machinery/bluespace_beacon/proc/process", function* process(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy(rt.sv(f, "Beacon"))) {
		_T = rt.sv(f, "loc");
		rt.setSv(f, "Beacon", (yield* g.new_(f, T("/obj/item/device/radio/beacon"), [])));
		rt.setFv(f, "invisibility", rt.sv(f, "Beacon"), 100);
		rt.setFv(f, "loc", rt.sv(f, "Beacon"), live(_T));
	}
	if (truthy(rt.sv(f, "Beacon"))) {
		if (!isEqual(rt.fv(f, "loc", rt.sv(f, "Beacon")), rt.sv(f, "loc"))) {
			rt.setFv(f, "loc", rt.sv(f, "Beacon"), rt.sv(f, "loc"));
		}
	}
	yield* g.srcCall(f, "updateicon");
	return f.dot;
}, true, { waitfor: false });
