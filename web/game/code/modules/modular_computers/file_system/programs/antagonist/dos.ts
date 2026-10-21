// From code/modules/modular_computers/file_system/programs/antagonist/dos.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4171, "/datum/computer_file/program/ntnet_dos", "/datum/computer_file/program", {
	target: null,
	dos_speed: 0,
	error: "",
	executed: 0,
	filename: "ntn_dos",
	filedesc: "DoS Traffic Generator",
	program_icon_state: "hostile",
	extended_desc: "This advanced script can perform denial of service attacks against NTNet quantum relays. The system administrator will probably notice this. Multiple devices can run this program together against same relay for increased effect",
	size: 20,
	requires_ntnet: 1,
	available_on_ntnet: 0,
	available_on_syndinet: 1,
	tgui_id: "ntos_net_dos",
	ui_style: "syndicate",
	ui_x: 400,
	ui_y: 250,
});

// /datum/computer_file/program/ntnet_dos/proc/process_tick  (code/modules/modular_computers/file_system/programs/antagonist/dos.dm:22)
rt.def("/datum/computer_file/program/ntnet_dos/proc/process_tick", function process_tick(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "dos_speed", 0);
	$0 = rt.sv(f, "ntnet_status");
	if ($0 === 1) {
		rt.setSv(f, "dos_speed", 5);
	} else if ($0 === 2) {
		rt.setSv(f, "dos_speed", 10);
	} else if ($0 === 3) {
		rt.setSv(f, "dos_speed", 20);
	}
	if (!(truthy(rt.sv(f, "target")) && truthy(rt.sv(f, "executed")))) return f.dot;
	rt.modField(f, rt.sv(f, "target"), "dos_overload", rt.sv(f, "dos_speed"), add);
	if (truthy(rt.callName(f, rt.sv(f, "target"), "is_operational", []))) return f.dot;
	rt.callName(f, rt.fv(f, "dos_sources", rt.sv(f, "target")), "Remove", [live(f.src)]);
	rt.setSv(f, "target", null);
	rt.setSv(f, "error", "Connection to destination relay lost.");
	return f.dot;
});

// /datum/computer_file/program/ntnet_dos/proc/kill_program  (code/modules/modular_computers/file_system/programs/antagonist/dos.dm:38)
rt.def("/datum/computer_file/program/ntnet_dos/proc/kill_program", function kill_program(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy(rt.sv(f, "target"))) {
		rt.callName(f, rt.fv(f, "dos_sources", rt.sv(f, "target")), "Remove", [live(f.src)]);
	}
	rt.setSv(f, "target", null);
	rt.setSv(f, "executed", 0);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["forced"] });

// /datum/computer_file/program/ntnet_dos/proc/ui_act  (code/modules/modular_computers/file_system/programs/antagonist/dos.dm:45)  may sleep
rt.def("/datum/computer_file/program/ntnet_dos/proc/ui_act", function* ui_act(f: Frame) {
	let R: Value = null, network_card: Value = null;
	let $0: any, $e: any;
	f.vars = () => [R, network_card, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	$0 = live(f.args[0]);
	if ($0 === "PRG_target_relay") {
		R = null;
		rt.forList(f, 0, rt.fv(f, "relays", rt.gl("ntnet_global")), T("/obj/machinery/ntnet_relay"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			if (isEqual(fmt("＀", [rt.fv(f, "uid", live(R))]), rt.at(live(f.args[1]), "targid"))) {
				rt.setSv(f, "target", live(R));
			}
		}
		rt.endFor(f, 0);
		return 1;
	} else if ($0 === "PRG_reset") {
		if (truthy(rt.sv(f, "target"))) {
			yield* g.callName(f, rt.fv(f, "dos_sources", rt.sv(f, "target")), "Remove", [live(f.src)]);
			rt.setSv(f, "target", null);
		}
		rt.setSv(f, "executed", 0);
		rt.setSv(f, "error", "");
		return 1;
	} else if ($0 === "PRG_execute") {
		if (truthy(rt.sv(f, "target"))) {
			rt.setSv(f, "executed", 1);
			yield* g.callName(f, rt.fv(f, "dos_sources", rt.sv(f, "target")), "Add", [live(f.src)]);
			if (truthy(rt.fv(f, "intrusion_detection_enabled", rt.gl("ntnet_global")))) {
				network_card = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "NET");
				yield* g.callName(f, rt.gl("ntnet_global"), "add_log", [fmt("IDS WARNING - Excess traffic flood targeting relay ＀ detected from device: ＀", [rt.fv(f, "uid", rt.sv(f, "target")), (yield* g.callName(f, live(network_card), "get_network_tag", []))])]);
				rt.setFv(f, "intrusion_detection_alarm", rt.gl("ntnet_global"), 1);
			}
		}
		return 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /datum/computer_file/program/ntnet_dos/proc/ui_data  (code/modules/modular_computers/file_system/programs/antagonist/dos.dm:71)
rt.def("/datum/computer_file/program/ntnet_dos/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, percentage: Value = null, j: Value = null, string: Value = null, i: Value = null, R: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [data, percentage, j, string, i, R, $0, $1, $2, $e];
	if (!truthy(rt.gl("ntnet_global"))) {
		return live(f.dot);
	}
	data = rt.list();
	data = rt.callSrc(f, "get_header_data", []);
	if (truthy(rt.sv(f, "error"))) {
		rt.setAt(live(data), "error", rt.sv(f, "error"));
	} else {
		if ((truthy(rt.sv(f, "target")) && truthy(rt.sv(f, "executed")))) {
			rt.setAt(live(data), "target", 1);
			rt.setAt(live(data), "speed", rt.sv(f, "dos_speed"));
			percentage = divide(multiply(rt.fv(f, "dos_overload", rt.sv(f, "target")), 100), rt.fv(f, "dos_capacity", rt.sv(f, "target")));
			rt.setAt(live(data), "dos_strings", rt.list());
			j = null;
			live(j);
			while (rt.lt(live(j), 10)) {
				string = "";
				i = null;
				live(i);
				while (rt.lt(live(i), 20)) {
					string = fmt("＀＀", [live(string), rt.op(f, "Prob", [], [live(percentage)])]);
					i = rt.inc(live(i), 1);
				}
				rt.modAt(live(data), "dos_strings", rt.list(rt.alist(f, ["nums", live(string)])), add);
				j = rt.inc(live(j), 1);
			}
		} else {
			rt.setAt(live(data), "relays", rt.list());
			R = null;
			rt.forList(f, 0, rt.fv(f, "relays", rt.gl("ntnet_global")), T("/obj/machinery/ntnet_relay"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				rt.modAt(live(data), "relays", rt.list(rt.alist(f, ["id", rt.fv(f, "uid", live(R))])), add);
			}
			rt.endFor(f, 0);
			$0 = live(data);
			$1 = "focus";
			if (truthy(rt.sv(f, "target"))) {
				$2 = rt.fv(f, "uid", rt.sv(f, "target"));
			} else {
				$2 = null;
			}
			rt.setAt($0, $1, $2);
		}
	}
	return live(data);
});
