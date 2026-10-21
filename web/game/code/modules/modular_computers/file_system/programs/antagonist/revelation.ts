// From code/modules/modular_computers/file_system/programs/antagonist/revelation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4172, "/datum/computer_file/program/revelation", "/datum/computer_file/program", {
	armed: 0,
	filename: "revelation",
	filedesc: "Revelation",
	program_icon_state: "hostile",
	extended_desc: "This virus can destroy hard drive of system it is executed on. It may be obfuscated to look like another non-malicious program. Once armed, it will destroy the system upon next execution.",
	size: 13,
	requires_ntnet: 0,
	available_on_ntnet: 0,
	available_on_syndinet: 1,
	tgui_id: "ntos_revelation",
	ui_style: "syndicate",
	ui_x: 400,
	ui_y: 250,
});

// /datum/computer_file/program/revelation/proc/run_program  (code/modules/modular_computers/file_system/programs/antagonist/revelation.dm:18)  may sleep
rt.def("/datum/computer_file/program/revelation/proc/run_program", function* run_program(f: Frame, user: Value) {
	f.vars = () => [user];
	f.dot = (yield* g.callSuper(f, [live(user)]));
	if (!truthy(rt.sv(f, "armed"))) return f.dot;
	yield* g.srcCall(f, "activate");
	return f.dot;
}, true);

// /datum/computer_file/program/revelation/proc/activate  (code/modules/modular_computers/file_system/programs/antagonist/revelation.dm:24)  may sleep
rt.def("/datum/computer_file/program/revelation/proc/activate", function* activate(f: Frame) {
	let hard_drive: Value = null, battery_module: Value = null, recharger: Value = null, spark_system: Value = null;
	f.vars = () => [hard_drive, battery_module, recharger, spark_system];
	if (!truthy(rt.sv(f, "computer"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "computer"), "visible_message", [fmt("<span class='notice'>＄！'s screen brightly flashes and loud electrical buzzing is heard.</span>", [rt.sv(f, "computer")])]);
	rt.setFv(f, "enabled", rt.sv(f, "computer"), 0);
	yield* g.callName(f, rt.sv(f, "computer"), "update_icon", []);
	hard_drive = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "HDD");
	battery_module = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "CELL");
	recharger = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "CHARGE");
	yield* g.call(f, P("/proc/qdel"), null, [live(hard_drive)]);
	yield* g.callName(f, rt.sv(f, "computer"), "take_damage", [25, "brute", 0, 0]);
	if ((truthy(live(battery_module)) && truthy(rt.op(f, "Prob", [], [25])))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(battery_module)]);
		yield* g.callName(f, rt.sv(f, "computer"), "visible_message", [fmt("<span class='notice'>＄！'s battery explodes in rain of sparks.</span>", [rt.sv(f, "computer")])]);
		yield* g.callName(f, (spark_system = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "start", []);
	}
	if (!(truthy(live(recharger)) && truthy(rt.op(f, "Prob", [], [50])))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(recharger)]);
	yield* g.callName(f, rt.sv(f, "computer"), "visible_message", [fmt("<span class='notice'>＄！'s recharger explodes in rain of sparks.</span>", [rt.sv(f, "computer")])]);
	yield* g.callName(f, (spark_system = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "start", []);
	return f.dot;
}, true);

// /datum/computer_file/program/revelation/proc/ui_act  (code/modules/modular_computers/file_system/programs/antagonist/revelation.dm:46)  may sleep
rt.def("/datum/computer_file/program/revelation/proc/ui_act", function* ui_act(f: Frame) {
	let user: Value = null, newname: Value = null;
	let $0: any;
	f.vars = () => [user, newname, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	$0 = live(f.args[0]);
	if ($0 === "PRG_arm") {
		rt.setSv(f, "armed", (!truthy(rt.sv(f, "armed")) ? 1 : 0));
	} else if ($0 === "PRG_activate") {
		yield* g.srcCall(f, "activate");
	} else if ($0 === "PRG_obfuscate") {
		user = live(f.usr);
		if (!truthy((newname = (yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], [null, null, "Enter new program name: ", live(user), null]))]))))) {
			return live(f.dot);
		}
		rt.setSv(f, "filedesc", live(newname));
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /datum/computer_file/program/revelation/proc/clone  (code/modules/modular_computers/file_system/programs/antagonist/revelation.dm:62)  may sleep
rt.def("/datum/computer_file/program/revelation/proc/clone", function* clone(f: Frame) {
	let temp: Value = null;
	f.vars = () => [temp];
	rt.setFv(f, "armed", (temp = (yield* g.callSuper(f, [], rt.Args.Same))), rt.sv(f, "armed"));
	return live(temp);
}, true);

// /datum/computer_file/program/revelation/proc/ui_data  (code/modules/modular_computers/file_system/programs/antagonist/revelation.dm:67)
rt.def("/datum/computer_file/program/revelation/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.callSrc(f, "get_header_data", [])), "armed", rt.sv(f, "armed"));
	return live(data);
});
