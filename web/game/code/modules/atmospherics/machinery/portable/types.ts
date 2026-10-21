// Types declared in code/modules/atmospherics/machinery/portable that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(10690, "/obj/machinery/portable_atmospherics/canister/nitrogen", "/obj/machinery/portable_atmospherics/canister", {
	gas_type: "n2",
	name: "n2 canister",
	desc: "Nitrogen gas. Reportedly useful for something.",
	icon_state: "red",
});
rt.type(10691, "/obj/machinery/portable_atmospherics/canister/oxygen", "/obj/machinery/portable_atmospherics/canister", {
	gas_type: "o2",
	name: "o2 canister",
	desc: "Oxygen. Necessary for human life.",
	icon_state: "blue",
});
rt.type(10692, "/obj/machinery/portable_atmospherics/canister/carbon_dioxide", "/obj/machinery/portable_atmospherics/canister", {
	gas_type: "co2",
	name: "co2 canister",
	desc: "Carbon dioxide. What the fuck is carbon dioxide?",
	icon_state: "black",
});
rt.type(10693, "/obj/machinery/portable_atmospherics/canister/toxins", "/obj/machinery/portable_atmospherics/canister", {
	gas_type: "plasma",
	name: "plasma canister",
	desc: "Plasma gas. The reason YOU are here. Highly toxic.",
	icon_state: "orange",
});
rt.type(10694, "/obj/machinery/portable_atmospherics/canister/agent_b", "/obj/machinery/portable_atmospherics/canister", {
	gas_type: "agent_b",
	name: "agent b canister",
	desc: "Oxygen Agent B. You're not quite sure what it does.",
});
rt.type(10695, "/obj/machinery/portable_atmospherics/canister/bz", "/obj/machinery/portable_atmospherics/canister", {
	gas_type: "bz",
	name: "BZ canister",
	desc: "BZ, a powerful hallucinogenic nerve agent.",
	icon_state: "purple",
});
rt.type(10696, "/obj/machinery/portable_atmospherics/canister/nitrous_oxide", "/obj/machinery/portable_atmospherics/canister", {
	gas_type: "n2o",
	name: "n2o canister",
	desc: "Nitrous oxide gas. Known to cause drowsiness.",
	icon_state: "redws",
});
rt.type(10698, "/obj/machinery/portable_atmospherics/canister/freon", "/obj/machinery/portable_atmospherics/canister", {
	gas_type: "freon",
	starter_temp: 120,
	name: "freon canister",
	desc: "Freon. Great for the atmosphere!",
	icon_state: "freon",
});
rt.type(10699, "/obj/machinery/portable_atmospherics/canister/water_vapor", "/obj/machinery/portable_atmospherics/canister", {
	gas_type: "water_vapor",
	filled: 1,
	name: "water vapor canister",
	desc: "Water Vapor. We get it, you vape.",
	icon_state: "water_vapor",
});
rt.type(10700, "/obj/machinery/portable_atmospherics/canister/proto", "/obj/machinery/portable_atmospherics/canister", {
	name: "prototype canister",
});
rt.type(10701, "/obj/machinery/portable_atmospherics/canister/proto/default", "/obj/machinery/portable_atmospherics/canister/proto", {
	temperature_resistance: 2273.15,
	can_max_release_pressure: 3039.75,
	can_min_release_pressure: 3.3774998,
	prototype: 1,
	name: "prototype canister",
	desc: "The best way to fix an atmospheric emergency... or the best way to introduce one.",
	icon_state: "proto",
	volume: 5000,
	obj_integrity: 300,
	max_integrity: 300,
});
rt.type(10702, "/obj/machinery/portable_atmospherics/canister/proto/default/oxygen", "/obj/machinery/portable_atmospherics/canister/proto/default", {
	gas_type: "o2",
	filled: 1,
	release_pressure: 202.65,
	name: "prototype canister",
	desc: "A prototype canister for a prototype bike, what could go wrong?",
	icon_state: "proto",
});
rt.type(10706, "/obj/machinery/portable_atmospherics/scrubber/huge/movable", "/obj/machinery/portable_atmospherics/scrubber/huge", {
	movable: 1,
});
