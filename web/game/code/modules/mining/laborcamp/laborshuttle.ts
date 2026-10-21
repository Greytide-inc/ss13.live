// From code/modules/mining/laborcamp/laborshuttle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10392, "/obj/machinery/computer/shuttle/labor", "/obj/machinery/computer/shuttle", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/labor_shuttle"),
	name: "labor shuttle console",
	desc: "Used to call and send the labor camp shuttle.",
	shuttleId: "laborcamp",
	possible_destinations: "laborcamp_home;laborcamp_away",
	req_access: null,
});

// /obj/machinery/computer/shuttle/labor/proc/<init>  (code/modules/mining/laborcamp/laborshuttle.dm:7)
rt.def("/obj/machinery/computer/shuttle/labor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(2));
	return f.dot;
});

rt.type(10393, "/obj/machinery/computer/shuttle/labor/one_way", "/obj/machinery/computer/shuttle/labor", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/labor_shuttle/one_way"),
	name: "prisoner shuttle console",
	desc: "A one-way shuttle console, used to summon the shuttle to the labor camp.",
	possible_destinations: "laborcamp_away",
	req_access: null,
});

// /obj/machinery/computer/shuttle/labor/one_way/proc/<init>  (code/modules/mining/laborcamp/laborshuttle.dm:15)
rt.def("/obj/machinery/computer/shuttle/labor/one_way/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list());
	return f.dot;
});

// /obj/machinery/computer/shuttle/labor/one_way/proc/Topic  (code/modules/mining/laborcamp/laborshuttle.dm:18)  may sleep
rt.def("/obj/machinery/computer/shuttle/labor/one_way/proc/Topic", function* Topic(f: Frame) {
	let M: Value = null, S: Value = null;
	f.vars = () => [M, S];
	if (truthy(rt.at(live(f.args[1]), "move"))) {
		if (!truthy((M = (yield* g.callName(f, rt.gl("SSshuttle"), "getShuttle", ["laborcamp"]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Cannot locate shuttle!</span>"]);
			return 0;
		}
		if ((truthy((S = (yield* g.callName(f, live(M), "get_docked", [])))) && isEqual(rt.fv(f, "name", live(S)), "laborcamp_away"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Shuttle is already at the outpost!</span>"]);
			return 0;
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["href", "href_list"] });
