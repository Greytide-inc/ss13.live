// Based on /tg/station's code/modules/shuttle/syndicate.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10397, "/obj/machinery/computer/shuttle/syndicate", "/obj/machinery/computer/shuttle", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/syndicate_shuttle"),
	icon_screen: "syndishuttle",
	icon_keyboard: "syndie_key",
	light_color: "#FA8282",
	shuttleId: "syndicate",
	possible_destinations: "syndicate_away;syndicate_z5;syndicate_ne;syndicate_nw;syndicate_n;syndicate_se;syndicate_sw;syndicate_s",
	name: "syndicate shuttle terminal",
	req_access: null,
	resistance_flags: 99,
});

// syndicate.dm:9
rt.def("/obj/machinery/computer/shuttle/syndicate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(150);
	return f.dot;
});

// syndicate.dm:20
rt.def("/obj/machinery/computer/shuttle/syndicate/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let board: Value = null;
	if (rt.at(href_list, "move")) {
		if ((board = this.circuit).challenge && rt.worldTime(f) < SYNDICATE_CHALLENGE_TIMER) {
			to_chat(f.usr, `<span class='warning'>You've issued a combat challenge to the station! You've got to give them at least ${round((SYNDICATE_CHALLENGE_TIMER - rt.worldTime(f)) / 10 / 60)} more minutes to allow them to prepare.</span>`);
			return 0;
		}
		board.moved = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(6853, "/obj/item/weapon/circuitboard/computer/syndicate_shuttle", "/obj/item/weapon/circuitboard/computer", {
	challenge: 0,
	moved: 0,
	name: "Syndicate Shuttle (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/shuttle/syndicate"),
});

// syndicate.dm:35
rt.def("/obj/item/weapon/circuitboard/computer/syndicate_shuttle/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.syndicate_shuttle_boards += this;
	return f.dot;
}, true);

// syndicate.dm:39
rt.def("/obj/item/weapon/circuitboard/computer/syndicate_shuttle/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.syndicate_shuttle_boards -= this;
	return (yield* parent_proc());
}, true);

rt.type(10399, "/obj/machinery/computer/shuttle/syndicate/drop_pod", "/obj/machinery/computer/shuttle/syndicate", {
	light_color: "#6496FA",
	shuttleId: "steel_rain",
	possible_destinations: null,
	clockwork: 1,
	name: "syndicate assault pod control",
	icon: rt.rsc("icons/obj/terminals.dmi"),
	icon_state: "dorm_available",
	req_access: null,
});

// syndicate.dm:47
rt.def("/obj/machinery/computer/shuttle/syndicate/drop_pod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(150);
	return f.dot;
});

// syndicate.dm:53
rt.def("/obj/machinery/computer/shuttle/syndicate/drop_pod/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (rt.at(href_list, "move")) {
		if (this.z != ZLEVEL_CENTCOM) {
			to_chat(f.usr, "<span class='warning'>Pods are one way!</span>");
			return 0;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);
