// From code/modules/shuttle/computer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10389, "/obj/machinery/computer/shuttle", "/obj/machinery/computer", {
	shuttleId: null,
	possible_destinations: "",
	admin_controlled: null,
	no_destination_swap: 0,
	icon_screen: "shuttle",
	icon_keyboard: "tech_key",
	light_color: "#7DE1E1",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/shuttle"),
	name: "Shuttle Console",
	req_access: null,
});

// /obj/machinery/computer/shuttle/proc/<init>  (code/modules/shuttle/computer.dm:6)
rt.def("/obj/machinery/computer/shuttle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list());
	return f.dot;
});

// /obj/machinery/computer/shuttle/proc/Initialize  (code/modules/shuttle/computer.dm:14)  may sleep
rt.def("/obj/machinery/computer/shuttle/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[1]), T("/obj/item/weapon/circuitboard/computer/shuttle")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "possible_destinations", rt.fv(f, "possible_destinations", live(f.args[1])));
	rt.setSv(f, "shuttleId", rt.fv(f, "shuttleId", live(f.args[1])));
	return f.dot;
}, true, { args: ["mapload", "C"] });

// /obj/machinery/computer/shuttle/proc/attack_hand  (code/modules/shuttle/computer.dm:20)  may sleep
rt.def("/obj/machinery/computer/shuttle/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let options: Value = null, M: Value = null, dat: Value = null, destination_found: Value = null, S: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [user, options, M, dat, destination_found, S, popup, $0, $1, $2, $e];
	if (truthy((yield* g.callSuper(f, [live(user)])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	options = (yield* g.call(f, P("/proc/params2list"), null, [rt.sv(f, "possible_destinations")]));
	M = (yield* g.callName(f, rt.gl("SSshuttle"), "getShuttle", [rt.sv(f, "shuttleId")]));
	if (truthy(live(M))) {
		$0 = (yield* g.callName(f, live(M), "getStatusText", []));
	} else {
		$0 = "*Missing*";
	}
	dat = fmt("Status: ＀<br><br>", [$0]);
	if (truthy(live(M))) {
		destination_found = null;
		S = null;
		rt.forList(f, 0, rt.fv(f, "stationary", rt.gl("SSshuttle")), T("/obj/docking_port/stationary"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if (!truthy((yield* g.callName(f, live(options), "Find", [rt.fv(f, "id", live(S))])))) {
				continue;
			}
			if (!truthy((yield* g.callName(f, live(M), "check_dock", [live(S)])))) {
				continue;
			}
			destination_found = 1;
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;move=＀'>Send to ＀</A><br>", [live(f.src), rt.fv(f, "id", live(S)), rt.fv(f, "name", live(S))]), add);
		}
		rt.endFor(f, 0);
		if (!truthy(live(destination_found))) {
			dat = rt.modify(live(dat), "<B>Shuttle Locked</B><br>", add);
			if (truthy(rt.sv(f, "admin_controlled"))) {
				dat = rt.modify(live(dat), "Authorized personnel only<br>", add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;request=1]'>Request Authorization</A><br>", [live(f.src)]), add);
			}
		}
	}
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;mach_close=computer'>Close</a>", [live(user)]), add);
	$0 = live(user);
	$1 = "computer";
	if (truthy(live(M))) {
		$2 = rt.fv(f, "name", live(M));
	} else {
		$2 = "shuttle";
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [$0, $1, $2, 300, 200]))), "set_content", [fmt("<center>＀</center>", [live(dat)])]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.usr), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/shuttle/proc/Topic  (code/modules/shuttle/computer.dm:49)  may sleep
rt.def("/obj/machinery/computer/shuttle/proc/Topic", function* Topic(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	if (!truthy((yield* g.srcCall(f, "allowed", live(f.usr))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Access denied.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.at(live(f.args[1]), "move"))) return f.dot;
	if (isEqual(rt.gv(f, "launch_status", (M = (yield* g.callName(f, rt.gl("SSshuttle"), "getShuttle", [rt.sv(f, "shuttleId")])))), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You've already escaped. Never going back to that place again!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "no_destination_swap"))) {
		if (!isEqual(rt.fv(f, "mode", live(M)), "idle")) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Shuttle already in transit.</span>"]);
			return live(f.dot);
		}
	}
	$0 = (yield* g.callName(f, rt.gl("SSshuttle"), "moveShuttle", [rt.sv(f, "shuttleId"), rt.at(live(f.args[1]), "move"), 1]));
	if ($0 === 0) {
		yield* g.srcCall(f, "say", "Shuttle departing. Please stand away from the doors.");
	} else if ($0 === 1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Invalid shuttle requested.</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Unable to comply.</span>"]);
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/shuttle/proc/emag_act  (code/modules/shuttle/computer.dm:75)
rt.def("/obj/machinery/computer/shuttle/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setFv(f, "req_access", live(f.src), rt.list());
	rt.setSv(f, "emagged", 1);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You fried the consoles ID checking system.</span>"]);
	return f.dot;
});
