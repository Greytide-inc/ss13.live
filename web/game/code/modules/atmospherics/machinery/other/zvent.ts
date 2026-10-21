// From code/modules/atmospherics/machinery/other/zvent.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10885, "/obj/machinery/zvent", "/obj/machinery", {
	on: 0,
	volume_rate: 800,
	anchored: 1,
	name: "interfloor air transfer system",
	icon: rt.rsc("icons/obj/atmospherics/components/unary_devices.dmi"),
	icon_state: "vent_map",
	density: 0,
});

// /obj/machinery/zvent/proc/New  (code/modules/atmospherics/machinery/other/zvent.dm:13)  may sleep
rt.def("/obj/machinery/zvent/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), add);
	return f.dot;
}, true);

// /obj/machinery/zvent/proc/Destroy  (code/modules/atmospherics/machinery/other/zvent.dm:17)  may sleep
rt.def("/obj/machinery/zvent/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/zvent/proc/process_atmos  (code/modules/atmospherics/machinery/other/zvent.dm:23)
rt.def("/obj/machinery/zvent/proc/process_atmos", function process_atmos(f: Frame) {
	let new_z: Value = null, zturf_conn: Value = null, zvent_conn: Value = null, myturf: Value = null, conn_air: Value = null, my_air: Value = null;
	let $e: any;
	f.vars = () => [new_z, zturf_conn, zvent_conn, myturf, conn_air, my_air, $e];
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) return f.dot;
	new_z = null;
	rt.forList(f, 0, rt.list(-1, 1));
	while (($e = rt.next(f, 0)) !== undefined) {
		new_z = $e;
		if (truthy((rt.istype((zturf_conn = rt.locate(rt.sv(f, "x"), rt.sv(f, "y"), add(rt.sv(f, "z"), live(new_z)))), T("/turf/open")) ? 1 : 0))) {
			if (truthy((rt.istype((zvent_conn = rt.locateIn(f, T("/obj/machinery/zvent"), live(zturf_conn))), T("/obj/machinery/zvent")) ? 1 : 0))) {
				myturf = rt.sv(f, "loc");
				conn_air = rt.fv(f, "air", live(zturf_conn));
				my_air = rt.fv(f, "air", live(myturf));
				if ((truthy((rt.istype(live(conn_air), T("/datum/gas_mixture")) ? 1 : 0)) && truthy((rt.istype(live(my_air), T("/datum/gas_mixture")) ? 1 : 0)))) {
					rt.callName(f, live(my_air), "share", [live(conn_air)]);
					rt.callSrc(f, "air_update_turf", []);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
