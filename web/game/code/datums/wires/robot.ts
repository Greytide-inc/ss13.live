// From code/datums/wires/robot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1074, "/datum/wires/robot", "/datum/wires", {
	holder_type: rt.typePath("/mob/living/silicon/robot"),
	randomize: 1,
});

// /datum/wires/robot/proc/New  (code/datums/wires/robot.dm:11)
rt.def("/datum/wires/robot/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("AI Connection", "Camera", "AI Law Synchronization", "Lockdown", "Reset Module"));
	rt.callSrc(f, "add_duds", [2]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/robot/proc/interactable  (code/datums/wires/robot.dm:15)
rt.def("/datum/wires/robot/proc/interactable", function interactable(f: Frame, user: Value) {
	let R: Value = null;
	f.vars = () => [R];
	if (!truthy(rt.gv(f, "wiresexposed", (R = rt.sv(f, "holder"))))) return f.dot;
	return 1;
});

// /datum/wires/robot/proc/get_status  (code/datums/wires/robot.dm:20)
rt.def("/datum/wires/robot/proc/get_status", function get_status(f: Frame) {
	let R: Value = null, status: Value = null;
	let $0: any;
	f.vars = () => [R, status, $0];
	R = rt.sv(f, "holder");
	status = rt.list();
	if (truthy(rt.fv(f, "lawupdate", live(R)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	status = rt.modify(live(status), fmt("The law sync module is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "connected_ai", live(R)))) {
		$0 = rt.gv(f, "name", rt.fv(f, "connected_ai", live(R)));
	} else {
		$0 = "NULL";
	}
	status = rt.modify(live(status), fmt("The intelligence link display shows ＀.", [$0]), add);
	if ((rt.fv(f, "camera", live(R)) !== null && truthy(rt.gv(f, "status", rt.fv(f, "camera", live(R)))))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	status = rt.modify(live(status), fmt("The camera light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "lockcharge", live(R)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	status = rt.modify(live(status), fmt("The lockdown indicator is ＀.", [$0]), add);
	if (truthy(rt.callName(f, live(R), "has_module", []))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	return (status = rt.modify(live(status), fmt("The reset module hardware light is ＀.", [$0]), add));
});

// /datum/wires/robot/proc/on_pulse  (code/datums/wires/robot.dm:30)  may sleep
rt.def("/datum/wires/robot/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let R: Value = null, new_ai: Value = null;
	let $0: any;
	f.vars = () => [wire, R, new_ai, $0];
	R = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "AI Connection") {
		if (!truthy(rt.fv(f, "emagged", live(R)))) {
			if ((truthy((new_ai = (yield* g.call(f, P("/proc/select_active_ai"), null, [live(R)])))) && !isEqual(live(new_ai), rt.fv(f, "connected_ai", live(R))))) {
				rt.setFv(f, "connected_ai", live(R), live(new_ai));
				if (truthy(rt.fv(f, "shell", live(R)))) {
					yield* g.callName(f, live(R), "undeploy", []);
					yield* g.callName(f, live(R), "notify_ai", [4]);
				} else {
					yield* g.callName(f, live(R), "notify_ai", [1]);
				}
			}
		}
	} else if ($0 === "Camera") {
		if ((rt.fv(f, "camera", live(R)) !== null && !truthy(rt.fv(f, "scrambledcodes", live(R))))) {
			yield* g.callName(f, rt.fv(f, "camera", live(R)), "toggle_cam", [live(f.usr), 0]);
			yield* g.callName(f, live(R), "visible_message", [fmt("＀'s camera lense focuses loudly.", [live(R)]), "Your camera lense focuses loudly."]);
		}
	} else if ($0 === "AI Law Synchronization") {
		if (truthy(rt.fv(f, "lawupdate", live(R)))) {
			yield* g.callName(f, live(R), "visible_message", [fmt("＀ gently chimes.", [live(R)]), "LawSync protocol engaged."]);
			yield* g.callName(f, live(R), "lawsync", []);
			yield* g.callName(f, live(R), "show_laws", []);
		}
	} else if ($0 === "Lockdown") {
		yield* g.callName(f, live(R), "SetLockdown", [(!truthy(rt.fv(f, "lockcharge", live(R))) ? 1 : 0)]);
	} else if ($0 === "Reset Module") {
		if (!truthy((yield* g.callName(f, live(R), "has_module", [])))) return f.dot;
		yield* g.callName(f, live(R), "visible_message", [fmt("＀'s module servos twitch.", [live(R)]), "Your module display flickers."]);
	}
	return f.dot;
}, true);

// /datum/wires/robot/proc/on_cut  (code/datums/wires/robot.dm:58)  may sleep
rt.def("/datum/wires/robot/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let R: Value = null;
	let $0: any;
	f.vars = () => [wire, mend, R, $0];
	R = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "AI Connection") {
		if (!truthy(live(mend))) {
			rt.setFv(f, "connected_ai", live(R), null);
			yield* g.callName(f, live(R), "undeploy", []);
		}
	} else if ($0 === "AI Law Synchronization") {
		if (truthy(live(mend))) {
			if (!truthy(rt.fv(f, "emagged", live(R)))) {
				rt.setFv(f, "lawupdate", live(R), 1);
			}
		} else {
			if (!truthy(rt.fv(f, "deployed", live(R)))) {
				rt.setFv(f, "lawupdate", live(R), 0);
			}
		}
	} else if ($0 === "Camera") {
		if ((rt.fv(f, "camera", live(R)) !== null && !truthy(rt.fv(f, "scrambledcodes", live(R))))) {
			rt.setFv(f, "status", rt.fv(f, "camera", live(R)), live(mend));
			yield* g.callName(f, rt.fv(f, "camera", live(R)), "toggle_cam", [live(f.usr), 0]);
			yield* g.callName(f, live(R), "visible_message", [fmt("＀'s camera lense focuses loudly.", [live(R)]), "Your camera lense focuses loudly."]);
		}
	} else if ($0 === "Lockdown") {
		yield* g.callName(f, live(R), "SetLockdown", [(!truthy(live(mend)) ? 1 : 0)]);
	} else if ($0 === "Reset Module") {
		if (!(truthy((yield* g.callName(f, live(R), "has_module", []))) && !truthy(live(mend)))) return f.dot;
		yield* g.callName(f, live(R), "ResetModule", []);
	}
	return f.dot;
}, true);
