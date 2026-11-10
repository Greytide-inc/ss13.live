// Based on /tg/station's code/modules/atmospherics/machinery/components/unary_devices/tank.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10591, "/obj/machinery/atmospherics/components/unary/tank", "/obj/machinery/atmospherics/components/unary", {
	volume: 10000,
	gas_type: 0,
	icon: rt.rsc("icons/obj/atmospherics/pipes/pressure_tank.dmi"),
	icon_state: "generic",
	name: "pressure tank",
	desc: "A large vessel containing pressurized gas.",
	obj_integrity: 800,
	max_integrity: 800,
	density: 1,
	layer: 3.3,
});

// tank.dm:15
rt.def("/obj/machinery/atmospherics/components/unary/tank/proc/New", function* New(f: Frame) {
	let air_contents: Value = null;
	yield* parent_proc();
	(air_contents = rt.index(this.airs, 1)).volume = this.volume;
	air_contents.temperature = T20C;
	if (!this.gas_type) return f.dot;
	air_contents.assert_gas(this.gas_type);
	rt.setAt(rt.index(air_contents.gases, this.gas_type), 1, 2533.125 * air_contents.volume / (8.31 * air_contents.temperature));
	this.name = `${this.name} (${rt.index(rt.index(rt.index(air_contents.gases, this.gas_type), 3), 2)})`;
	return f.dot;
}, true);

rt.type(10597, "/obj/machinery/atmospherics/components/unary/tank/air", "/obj/machinery/atmospherics/components/unary/tank", {
	icon_state: "grey",
	name: "pressure tank (Air)",
});

// tank.dm:48
rt.def("/obj/machinery/atmospherics/components/unary/tank/air/proc/New", function* New(f: Frame) {
	let air_contents: Value = null;
	yield* parent_proc();
	(air_contents = rt.index(this.airs, 1)).assert_gases("o2", "n2");
	rt.setAt(rt.index(air_contents.gases, "o2"), 1, 2533.125 * air_contents.volume / (8.31 * air_contents.temperature) * 0.2);
	rt.setAt(rt.index(air_contents.gases, "n2"), 1, 2533.125 * air_contents.volume / (8.31 * air_contents.temperature) * 0.8);
	return f.dot;
}, true);
