// Based on /tg/station's code/modules/atmospherics/machinery/components/unary_devices/portables_connector.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// portables_connector.dm:13
rt.def("/obj/machinery/atmospherics/components/unary/portables_connector/proc/New", function* New(f: Frame) {
	let air_contents: Value = null;
	yield* parent_proc();
	(air_contents = rt.index(this.airs, 1)).volume = 0;
	return f.dot;
}, true);

// portables_connector.dm:22
rt.def("/obj/machinery/atmospherics/components/unary/portables_connector/proc/process_atmos", function process_atmos(f: Frame) {
	if (!this.connected_device) {
		return f.dot;
	}
	this.update_parents();
	return f.dot;
});

// portables_connector.dm:28
rt.def("/obj/machinery/atmospherics/components/unary/portables_connector/proc/Destroy", function* Destroy(f: Frame) {
	if (this.connected_device) {
		yield* this.connected_device.disconnect();
	}
	return (yield* parent_proc());
}, true);

// portables_connector.dm:32
rt.def("/obj/machinery/atmospherics/components/unary/portables_connector/proc/can_unwrench", function can_unwrench(f: Frame, user: Value) {
	if (!parent_proc()) return f.dot;
	if (this.connected_device) {
		to_chat(user, `<span class='warning'>You cannot unwrench ${this}, detach ${this.connected_device} first!</span>`);
	} else {
		return 1;
	}
	return f.dot;
}, false);

// portables_connector.dm:39
rt.def("/obj/machinery/atmospherics/components/unary/portables_connector/proc/portableConnectorReturnAir", function portableConnectorReturnAir(f: Frame) {
	return this.connected_device.portableConnectorReturnAir();
});
