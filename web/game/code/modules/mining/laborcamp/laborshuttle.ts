// Based on /tg/station's code/modules/mining/laborcamp/laborshuttle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(10392, "/obj/machinery/computer/shuttle/labor", "/obj/machinery/computer/shuttle", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/labor_shuttle"),
	name: "labor shuttle console",
	desc: "Used to call and send the labor camp shuttle.",
	shuttleId: "laborcamp",
	possible_destinations: "laborcamp_home;laborcamp_away",
	req_access: null,
});

// laborshuttle.dm:7
rt.def("/obj/machinery/computer/shuttle/labor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(2);
	return f.dot;
});

rt.type(10393, "/obj/machinery/computer/shuttle/labor/one_way", "/obj/machinery/computer/shuttle/labor", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/labor_shuttle/one_way"),
	name: "prisoner shuttle console",
	desc: "A one-way shuttle console, used to summon the shuttle to the labor camp.",
	possible_destinations: "laborcamp_away",
	req_access: null,
});

// laborshuttle.dm:15
rt.def("/obj/machinery/computer/shuttle/labor/one_way/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list();
	return f.dot;
});

// laborshuttle.dm:18
rt.def("/obj/machinery/computer/shuttle/labor/one_way/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let M: Value = null, S: Value = null;
	if (rt.at(href_list, "move")) {
		if (!(M = GLOB.SSshuttle.getShuttle("laborcamp"))) {
			to_chat(f.usr, "<span class='warning'>Cannot locate shuttle!</span>");
			return 0;
		}
		if ((S = M.get_docked()) && S.name == "laborcamp_away") {
			to_chat(f.usr, "<span class='warning'>Shuttle is already at the outpost!</span>");
			return 0;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);
