// From code/modules/shuttle/ferry.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10395, "/obj/machinery/computer/shuttle/ferry", "/obj/machinery/computer/shuttle", {
	aiControlDisabled: 1,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/ferry"),
	shuttleId: "ferry",
	possible_destinations: "ferry_home;ferry_away",
	name: "transport ferry console",
	req_access: null,
});

// /obj/machinery/computer/shuttle/ferry/proc/<init>  (code/modules/shuttle/ferry.dm:6)
rt.def("/obj/machinery/computer/shuttle/ferry/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(101));
	return f.dot;
});

// /obj/machinery/computer/shuttle/ferry/proc/canAIControl  (code/modules/shuttle/ferry.dm:11)
rt.def("/obj/machinery/computer/shuttle/ferry/proc/canAIControl", function canAIControl(f: Frame, user: Value) {
	return (!isEqual(rt.sv(f, "aiControlDisabled"), 1) ? 1 : 0);
});

// /obj/machinery/computer/shuttle/ferry/proc/attack_ai  (code/modules/shuttle/ferry.dm:14)
rt.def("/obj/machinery/computer/shuttle/ferry/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	if (truthy(rt.callName(f, live(f.src), "canAIControl", [live(user)]))) return f.dot;
	return live(f.dot);
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

// /obj/machinery/computer/shuttle/ferry/request/proc/<init>  (code/modules/shuttle/ferry.dm:23)
rt.def("/obj/machinery/computer/shuttle/ferry/request/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(101));
	return f.dot;
});

// /obj/machinery/computer/shuttle/ferry/request/proc/Topic  (code/modules/shuttle/ferry.dm:27)  may sleep
rt.def("/obj/machinery/computer/shuttle/ferry/request/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.at(live(f.args[1]), "request"))) return f.dot;
	if ((truthy(rt.sv(f, "last_request")) && rt.gt(add(rt.sv(f, "last_request"), rt.sv(f, "cooldown")), rt.worldTime(f)))) {
		return live(f.dot);
	}
	rt.setSv(f, "last_request", rt.worldTime(f));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Your request has been recieved by Centcom.</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), fmt("<b>FERRY: <font color='blue'>＀ (<A HREF='?_src_=holder;secrets=moveferry'>Move Ferry</a>)</b> is requesting to move the transport ferry to Centcom.</font>", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])])])]);
	return f.dot;
}, true, { args: ["href", "href_list"] });
