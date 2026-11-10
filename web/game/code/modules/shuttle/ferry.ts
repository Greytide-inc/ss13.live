// Based on /tg/station's code/modules/shuttle/ferry.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { fmt } = rt;


rt.type(10395, "/obj/machinery/computer/shuttle/ferry", "/obj/machinery/computer/shuttle", {
	aiControlDisabled: 1,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/ferry"),
	shuttleId: "ferry",
	possible_destinations: "ferry_home;ferry_away",
	name: "transport ferry console",
	req_access: null,
});

// ferry.dm:6
rt.def("/obj/machinery/computer/shuttle/ferry/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(101);
	return f.dot;
});

// ferry.dm:11
rt.def("/obj/machinery/computer/shuttle/ferry/proc/canAIControl", function canAIControl(f: Frame, user: Value) {
	return (this.aiControlDisabled != 1 ? 1 : 0);
});

// ferry.dm:14
rt.def("/obj/machinery/computer/shuttle/ferry/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	if (this.canAIControl(user)) return f.dot;
	return f.dot;
});

rt.type(10396, "/obj/machinery/computer/shuttle/ferry/request", "/obj/machinery/computer/shuttle/ferry", {
	last_request: null,
	cooldown: 600,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/ferry/request"),
	possible_destinations: "ferry_home;ferry_away",
	name: "ferry console",
	req_access: null,
	resistance_flags: 99,
});

// ferry.dm:23
rt.def("/obj/machinery/computer/shuttle/ferry/request/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(101);
	return f.dot;
});

// ferry.dm:27
rt.def("/obj/machinery/computer/shuttle/ferry/request/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (!rt.at(href_list, "request")) return f.dot;
	if (this.last_request && this.last_request + this.cooldown > rt.worldTime(f)) {
		return f.dot;
	}
	this.last_request = rt.worldTime(f);
	to_chat(f.usr, "<span class='notice'>Your request has been recieved by Centcom.</span>");
	to_chat(GLOB.admins, `<b>FERRY: <font color='blue'>${`${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`} (<A HREF='?_src_=holder;secrets=moveferry'>Move Ferry</a>)</b> is requesting to move the transport ferry to Centcom.</font>`);
	return f.dot;
}, true);
