// From code/modules/shuttle/syndicate.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/computer/shuttle/syndicate/proc/<init>  (code/modules/shuttle/syndicate.dm:9)
rt.def("/obj/machinery/computer/shuttle/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(150));
	return f.dot;
});

// /obj/machinery/computer/shuttle/syndicate/proc/Topic  (code/modules/shuttle/syndicate.dm:20)  may sleep
rt.def("/obj/machinery/computer/shuttle/syndicate/proc/Topic", function* Topic(f: Frame) {
	let board: Value = null;
	f.vars = () => [board];
	if (truthy(rt.at(live(f.args[1]), "move"))) {
		if ((truthy(rt.gv(f, "challenge", (board = rt.sv(f, "circuit")))) && rt.lt(rt.worldTime(f), 12000))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You've issued a combat challenge to the station! You've got to give them at least ＀ more minutes to allow them to prepare.</span>", [(yield* g.call(f, P("/proc/round"), null, [divide(divide(subtract(12000, rt.worldTime(f)), 10), 60)]))])]);
			return 0;
		}
		rt.setFv(f, "moved", live(board), 1);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(6853, "/obj/item/weapon/circuitboard/computer/syndicate_shuttle", "/obj/item/weapon/circuitboard/computer", {
	challenge: 0,
	moved: 0,
	name: "Syndicate Shuttle (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/shuttle/syndicate"),
});

// /obj/item/weapon/circuitboard/computer/syndicate_shuttle/proc/Initialize  (code/modules/shuttle/syndicate.dm:35)  may sleep
rt.def("/obj/item/weapon/circuitboard/computer/syndicate_shuttle/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modGl("syndicate_shuttle_boards", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/circuitboard/computer/syndicate_shuttle/proc/Destroy  (code/modules/shuttle/syndicate.dm:39)  may sleep
rt.def("/obj/item/weapon/circuitboard/computer/syndicate_shuttle/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("syndicate_shuttle_boards", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/machinery/computer/shuttle/syndicate/drop_pod/proc/<init>  (code/modules/shuttle/syndicate.dm:47)
rt.def("/obj/machinery/computer/shuttle/syndicate/drop_pod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(150));
	return f.dot;
});

// /obj/machinery/computer/shuttle/syndicate/drop_pod/proc/Topic  (code/modules/shuttle/syndicate.dm:53)  may sleep
rt.def("/obj/machinery/computer/shuttle/syndicate/drop_pod/proc/Topic", function* Topic(f: Frame) {
	if (truthy(rt.at(live(f.args[1]), "move"))) {
		if (!isEqual(rt.sv(f, "z"), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Pods are one way!</span>"]);
			return 0;
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["href", "href_list"] });
