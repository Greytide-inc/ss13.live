// Based on /tg/station's code/modules/atmospherics/machinery/other/zvent.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10885, "/obj/machinery/zvent", "/obj/machinery", {
	on: 0,
	volume_rate: 800,
	anchored: 1,
	name: "interfloor air transfer system",
	icon: rt.rsc("icons/obj/atmospherics/components/unary_devices.dmi"),
	icon_state: "vent_map",
	density: 0,
});

// zvent.dm:13
rt.def("/obj/machinery/zvent/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.SSair.atmos_machinery += this;
	return f.dot;
}, true);

// zvent.dm:17
rt.def("/obj/machinery/zvent/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSair.atmos_machinery -= this;
	return (yield* parent_proc());
}, true);

// zvent.dm:23
rt.def("/obj/machinery/zvent/proc/process_atmos", function process_atmos(f: Frame) {
	let new_z: Value = null, zturf_conn: Value = null, zvent_conn: Value = null, myturf: Value = null, conn_air: Value = null, my_air: Value = null;
	if (!isturf(this.loc)) return f.dot;
	for (new_z of each(list(-1, 1))) {
		if (rt.istype((zturf_conn = rt.locate(this.x, this.y, this.z + new_z)), T("/turf/open"))) {
			if (rt.istype((zvent_conn = rt.locateIn(f, T("/obj/machinery/zvent"), zturf_conn)), T("/obj/machinery/zvent"))) {
				myturf = this.loc;
				conn_air = zturf_conn.air;
				my_air = myturf.air;
				if (rt.istype(conn_air, T("/datum/gas_mixture")) && rt.istype(my_air, T("/datum/gas_mixture"))) {
					my_air.share(conn_air);
					this.air_update_turf();
				}
			}
		}
	}
	return f.dot;
});
