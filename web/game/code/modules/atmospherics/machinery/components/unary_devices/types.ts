// Types declared in code/modules/atmospherics/machinery/components/unary_devices that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(6746, "/obj/item/weapon/circuitboard/machine/thermomachine/freezer", "/obj/item/weapon/circuitboard/machine/thermomachine", {
	name: "Freezer (Machine Board)",
	build_path: rt.typePath("/obj/machinery/atmospherics/components/unary/thermomachine/freezer"),
});
rt.type(6747, "/obj/item/weapon/circuitboard/machine/thermomachine/heater", "/obj/item/weapon/circuitboard/machine/thermomachine", {
	name: "Heater (Machine Board)",
	build_path: rt.typePath("/obj/machinery/atmospherics/components/unary/thermomachine/heater"),
});
rt.type(10587, "/obj/machinery/atmospherics/components/unary/outlet_injector/on", "/obj/machinery/atmospherics/components/unary/outlet_injector", {
	on: 1,
});
rt.type(10590, "/obj/machinery/atmospherics/components/unary/portables_connector/visible", "/obj/machinery/atmospherics/components/unary/portables_connector", {
	level: 2,
});
rt.type(10592, "/obj/machinery/atmospherics/components/unary/tank/carbon_dioxide", "/obj/machinery/atmospherics/components/unary/tank", {
	gas_type: "co2",
});
rt.type(10593, "/obj/machinery/atmospherics/components/unary/tank/toxins", "/obj/machinery/atmospherics/components/unary/tank", {
	gas_type: "plasma",
	icon_state: "orange",
});
rt.type(10594, "/obj/machinery/atmospherics/components/unary/tank/oxygen_agent_b", "/obj/machinery/atmospherics/components/unary/tank", {
	gas_type: "agent_b",
	icon_state: "orange_2",
});
rt.type(10595, "/obj/machinery/atmospherics/components/unary/tank/oxygen", "/obj/machinery/atmospherics/components/unary/tank", {
	gas_type: "o2",
	icon_state: "blue",
});
rt.type(10596, "/obj/machinery/atmospherics/components/unary/tank/nitrogen", "/obj/machinery/atmospherics/components/unary/tank", {
	gas_type: "n2",
	icon_state: "red",
});
rt.type(10602, "/obj/machinery/atmospherics/components/unary/vent_pump/on", "/obj/machinery/atmospherics/components/unary/vent_pump", {
	on: 1,
	icon_state: "vent_map_on",
});
rt.type(10603, "/obj/machinery/atmospherics/components/unary/vent_pump/siphon", "/obj/machinery/atmospherics/components/unary/vent_pump", {
	pump_direction: 0,
	pressure_checks: 2,
	internal_pressure_bound: 4000,
	external_pressure_bound: 0,
});
rt.type(10604, "/obj/machinery/atmospherics/components/unary/vent_pump/siphon/on", "/obj/machinery/atmospherics/components/unary/vent_pump/siphon", {
	on: 1,
	icon_state: "vent_map_siphon_on",
});
rt.type(10606, "/obj/machinery/atmospherics/components/unary/vent_pump/high_volume/on", "/obj/machinery/atmospherics/components/unary/vent_pump/high_volume", {
	on: 1,
	icon_state: "vent_map_on",
});
rt.type(10607, "/obj/machinery/atmospherics/components/unary/vent_pump/high_volume/siphon", "/obj/machinery/atmospherics/components/unary/vent_pump/high_volume", {
	pump_direction: 0,
	pressure_checks: 2,
	internal_pressure_bound: 2000,
	external_pressure_bound: 0,
});
rt.type(10608, "/obj/machinery/atmospherics/components/unary/vent_pump/high_volume/siphon/on", "/obj/machinery/atmospherics/components/unary/vent_pump/high_volume/siphon", {
	on: 1,
	icon_state: "vent_map_siphon_on",
});
rt.type(10610, "/obj/machinery/atmospherics/components/unary/vent_scrubber/on", "/obj/machinery/atmospherics/components/unary/vent_scrubber", {
	on: 1,
	icon_state: "scrub_map_on",
});
