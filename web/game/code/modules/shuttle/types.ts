// Types declared in code/modules/shuttle that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(10390, "/obj/machinery/computer/shuttle/monastery_shuttle", "/obj/machinery/computer/shuttle", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/shuttle/monastery_shuttle"),
	name: "monastery shuttle console",
	desc: "Used to control the monastery shuttle.",
	shuttleId: "pod1",
	possible_destinations: "monastery_shuttle_asteroid;monastery_shuttle_station",
	no_destination_swap: 1,
});
rt.type(10398, "/obj/machinery/computer/shuttle/syndicate/recall", "/obj/machinery/computer/shuttle/syndicate", {
	possible_destinations: "syndicate_away",
	name: "syndicate shuttle recall terminal",
});
rt.type(10400, "/obj/machinery/computer/shuttle/white_ship", "/obj/machinery/computer/shuttle", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/white_ship"),
	shuttleId: "whiteship",
	possible_destinations: "whiteship_away;whiteship_home;whiteship_z4;whiteship_lavaland",
	name: "White Ship Console",
	desc: "Used to control the White Ship.",
});
rt.type(12192, "/obj/structure/table/abductor/wabbajack/left", "/obj/structure/table/abductor/wabbajack", {
	desc: "You sleep so it may wake.",
});
rt.type(12193, "/obj/structure/table/abductor/wabbajack/right", "/obj/structure/table/abductor/wabbajack", {
	desc: "It wakes so you may sleep.",
});
rt.type(13045, "/obj/docking_port/mobile/auxillary_base", "/obj/docking_port/mobile", {
	name: "auxillary base",
	id: "colony_drop",
	dheight: 4,
	dwidth: 4,
	width: 9,
	height: 9,
});
