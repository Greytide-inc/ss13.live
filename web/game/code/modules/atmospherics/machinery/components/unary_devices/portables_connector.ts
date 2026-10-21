// From code/modules/atmospherics/machinery/components/unary_devices/portables_connector.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10589, "/obj/machinery/atmospherics/components/unary/portables_connector", "/obj/machinery/atmospherics/components/unary", {
	connected_device: null,
	can_unwrench: 1,
	level: 0,
	name: "connector port",
	desc: "For connecting portables devices related to atmospherics control.",
	icon: rt.rsc("icons/obj/atmospherics/components/unary_devices.dmi"),
	icon_state: "connector_map",
	use_power: 0,
	layer: 2.48,
});

// /obj/machinery/atmospherics/components/unary/portables_connector/proc/New  (code/modules/atmospherics/machinery/components/unary_devices/portables_connector.dm:13)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/portables_connector/proc/New", function* New(f: Frame) {
	let air_contents: Value = null;
	f.vars = () => [air_contents];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "volume", (air_contents = rt.index(rt.sv(f, "airs"), 1)), 0);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/portables_connector/proc/process_atmos  (code/modules/atmospherics/machinery/components/unary_devices/portables_connector.dm:22)
rt.def("/obj/machinery/atmospherics/components/unary/portables_connector/proc/process_atmos", function process_atmos(f: Frame) {
	if (!truthy(rt.sv(f, "connected_device"))) {
		return live(f.dot);
	}
	rt.callSrc(f, "update_parents", []);
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/portables_connector/proc/Destroy  (code/modules/atmospherics/machinery/components/unary_devices/portables_connector.dm:28)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/portables_connector/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "connected_device"))) {
		yield* g.callName(f, rt.sv(f, "connected_device"), "disconnect", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/atmospherics/components/unary/portables_connector/proc/can_unwrench  (code/modules/atmospherics/machinery/components/unary_devices/portables_connector.dm:32)
rt.def("/obj/machinery/atmospherics/components/unary/portables_connector/proc/can_unwrench", function can_unwrench(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	if (truthy(rt.sv(f, "connected_device"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You cannot unwrench ＀, detach ＀ first!</span>", [live(f.src), rt.sv(f, "connected_device")])]);
	} else {
		return 1;
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/atmospherics/components/unary/portables_connector/proc/portableConnectorReturnAir  (code/modules/atmospherics/machinery/components/unary_devices/portables_connector.dm:39)
rt.def("/obj/machinery/atmospherics/components/unary/portables_connector/proc/portableConnectorReturnAir", function portableConnectorReturnAir(f: Frame) {
	return rt.callName(f, rt.sv(f, "connected_device"), "portableConnectorReturnAir", []);
});
