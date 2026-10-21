// From code/datums/wires/airlock.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1060, "/datum/wires/airlock", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/door/airlock"),
	proper_name: "Airlock",
});

// /datum/wires/airlock/proc/New  (code/datums/wires/airlock.dm:16)
rt.def("/datum/wires/airlock/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Main Power 1", "Main Power 2", "Auxiliary Power 1", "Auxiliary Power 2", "Open", "Bolts", "ID Scan", "AI Connection", "High Voltage Ground", "Safety", "Timing", "Bolt Lights", "High Voltage Circuit 1", "High Voltage Circuit 2"));
	rt.callSrc(f, "add_duds", [2]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/airlock/proc/interactable  (code/datums/wires/airlock.dm:20)  may sleep
rt.def("/datum/wires/airlock/proc/interactable", function* interactable(f: Frame, user: Value) {
	let A: Value = null;
	f.vars = () => [user, A];
	A = rt.sv(f, "holder");
	if (((!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) && truthy((yield* g.callName(f, live(A), "isElectrified", [])))) && truthy((yield* g.callName(f, live(A), "shock", [live(user), 100]))))) {
		return 0;
	}
	if (!truthy(rt.fv(f, "panel_open", live(A)))) return f.dot;
	return 1;
}, true);

// /datum/wires/airlock/proc/get_status  (code/datums/wires/airlock.dm:27)
rt.def("/datum/wires/airlock/proc/get_status", function get_status(f: Frame) {
	let A: Value = null, status: Value = null;
	let $0: any;
	f.vars = () => [A, status, $0];
	A = rt.sv(f, "holder");
	status = rt.list();
	if (truthy(rt.fv(f, "locked", live(A)))) {
		$0 = "have fallen!";
	} else {
		$0 = "look up.";
	}
	status = rt.modify(live(status), fmt("The door bolts ＀", [$0]), add);
	if (truthy(rt.callName(f, live(A), "hasPower", []))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	status = rt.modify(live(status), fmt("The test light is ＀.", [$0]), add);
	if ((truthy(rt.fv(f, "aiControlDisabled", live(A))) || truthy(rt.fv(f, "emagged", live(A))))) {
		$0 = "off";
	} else {
		$0 = "on";
	}
	status = rt.modify(live(status), fmt("The AI connection light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "safe", live(A)))) {
		$0 = "off";
	} else {
		$0 = "on";
	}
	status = rt.modify(live(status), fmt("The check wiring light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "autoclose", live(A)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	status = rt.modify(live(status), fmt("The timer is powered ＀.", [$0]), add);
	if (truthy(rt.fv(f, "normalspeed", live(A)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	status = rt.modify(live(status), fmt("The speed light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "emergency", live(A)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	return (status = rt.modify(live(status), fmt("The emergency light is ＀.", [$0]), add));
});

// /datum/wires/airlock/proc/on_pulse  (code/datums/wires/airlock.dm:40)  may sleep
rt.def("/datum/wires/airlock/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [wire, A, $0];
	A = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Main Power 1" || $0 === "Main Power 2") {
		yield* g.callName(f, live(A), "loseMainPower", []);
	} else if ($0 === "Auxiliary Power 1" || $0 === "Auxiliary Power 2") {
		yield* g.callName(f, live(A), "loseBackupPower", []);
	} else if ($0 === "Open") {
		if (truthy(rt.fv(f, "emagged", live(A)))) {
			return live(f.dot);
		}
		if ((!truthy((yield* g.callName(f, live(A), "requiresID", []))) || truthy((yield* g.callName(f, live(A), "check_access", [null]))))) {
			if (truthy(rt.fv(f, "density", live(A)))) {
				yield* g.callName(f, live(A), "open", []);
			} else {
				yield* g.callName(f, live(A), "close", []);
			}
		}
	} else if ($0 === "Bolts") {
		if (!truthy(rt.fv(f, "locked", live(A)))) {
			yield* g.callName(f, live(A), "bolt", []);
			yield* g.callName(f, live(A), "audible_message", ["<span class='italics'>You hear a click from the bottom of the door.</span>", null, 1]);
		} else {
			if (truthy((yield* g.callName(f, live(A), "hasPower", [])))) {
				yield* g.callName(f, live(A), "unbolt", []);
				yield* g.callName(f, live(A), "audible_message", ["<span class='italics'>You hear a click from the bottom of the door.</span>", null, 1]);
			}
		}
		yield* g.callName(f, live(A), "update_icon", []);
	} else if ($0 === "ID Scan") {
		if ((truthy((yield* g.callName(f, live(A), "hasPower", []))) && truthy(rt.fv(f, "density", live(A))))) {
			yield* g.callName(f, live(A), "do_animate", ["deny"]);
			if (truthy(rt.fv(f, "emergency", live(A)))) {
				rt.setFv(f, "emergency", live(A), 0);
				yield* g.callName(f, live(A), "update_icon", []);
			}
		}
	} else if ($0 === "AI Connection") {
		if (isEqual(rt.fv(f, "aiControlDisabled", live(A)), 0)) {
			rt.setFv(f, "aiControlDisabled", live(A), 1);
		} else {
			if (isEqual(rt.fv(f, "aiControlDisabled", live(A)), -1)) {
				rt.setFv(f, "aiControlDisabled", live(A), 2);
			}
		}
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		if (truthy(live(A))) {
			if (isEqual(rt.fv(f, "aiControlDisabled", live(A)), 1)) {
				rt.setFv(f, "aiControlDisabled", live(A), 0);
			} else {
				if (isEqual(rt.fv(f, "aiControlDisabled", live(A)), 2)) {
					rt.setFv(f, "aiControlDisabled", live(A), -1);
				}
			}
		}
	} else if ($0 === "High Voltage Ground") {
		if (!truthy(rt.fv(f, "secondsElectrified", live(A)))) {
			yield* g.callName(f, live(A), "set_electrified", [30]);
			if (truthy(live(f.usr))) {
				rt.modField(f, live(A), "shockedby", fmt("[＀]＀(ckey:＀)", [(yield* g.call(f, P("/proc/time_stamp"), null, [])), live(f.usr), rt.fv(f, "ckey", live(f.usr))]), add);
			}
			yield* g.call(f, P("/proc/add_logs"), null, [live(f.usr), live(A), "electrified"]);
			yield* g.call(f, P("/proc/sleep"), null, [10]);
			if (truthy(live(A))) {
				while (rt.gt(rt.fv(f, "secondsElectrified", live(A)), 0)) {
					(rt.modField(f, live(A), "secondsElectrified", 1, subtract));
					if (rt.lt(rt.fv(f, "secondsElectrified", live(A)), 0)) {
						yield* g.callName(f, live(A), "set_electrified", [0]);
					}
					yield* g.call(f, P("/proc/sleep"), null, [10]);
				}
			}
		}
	} else if ($0 === "Safety") {
		rt.setFv(f, "safe", live(A), (!truthy(rt.fv(f, "safe", live(A))) ? 1 : 0));
		if (!truthy(rt.fv(f, "density", live(A)))) {
			yield* g.callName(f, live(A), "close", []);
		}
	} else if ($0 === "Timing") {
		rt.setFv(f, "normalspeed", live(A), (!truthy(rt.fv(f, "normalspeed", live(A))) ? 1 : 0));
	} else if ($0 === "Bolt Lights") {
		rt.setFv(f, "lights", live(A), (!truthy(rt.fv(f, "lights", live(A))) ? 1 : 0));
		yield* g.callName(f, live(A), "update_icon", []);
	}
	return f.dot;
}, true, { waitfor: false });

// /datum/wires/airlock/proc/on_cut  (code/datums/wires/airlock.dm:104)  may sleep
rt.def("/datum/wires/airlock/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [wire, mend, A, $0];
	A = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Main Power 1" || $0 === "Main Power 2") {
		if (((truthy(live(mend)) && !truthy((yield* g.srcCall(f, "is_cut", "Main Power 1")))) && !truthy((yield* g.srcCall(f, "is_cut", "Main Power 2"))))) {
			yield* g.callName(f, live(A), "regainMainPower", []);
			if (truthy(live(f.usr))) {
				yield* g.callName(f, live(A), "shock", [live(f.usr), 50]);
			}
		} else {
			yield* g.callName(f, live(A), "loseMainPower", []);
			if (truthy(live(f.usr))) {
				yield* g.callName(f, live(A), "shock", [live(f.usr), 50]);
			}
		}
	} else if ($0 === "Auxiliary Power 1" || $0 === "Auxiliary Power 2") {
		if (((truthy(live(mend)) && !truthy((yield* g.srcCall(f, "is_cut", "Auxiliary Power 1")))) && !truthy((yield* g.srcCall(f, "is_cut", "Auxiliary Power 2"))))) {
			yield* g.callName(f, live(A), "regainBackupPower", []);
			if (truthy(live(f.usr))) {
				yield* g.callName(f, live(A), "shock", [live(f.usr), 50]);
			}
		} else {
			yield* g.callName(f, live(A), "loseBackupPower", []);
			if (truthy(live(f.usr))) {
				yield* g.callName(f, live(A), "shock", [live(f.usr), 50]);
			}
		}
	} else if ($0 === "Bolts") {
		if (!truthy(live(mend))) {
			yield* g.callName(f, live(A), "bolt", []);
		}
	} else if ($0 === "AI Connection") {
		if (truthy(live(mend))) {
			if (isEqual(rt.fv(f, "aiControlDisabled", live(A)), 1)) {
				rt.setFv(f, "aiControlDisabled", live(A), 0);
			} else {
				if (isEqual(rt.fv(f, "aiControlDisabled", live(A)), 2)) {
					rt.setFv(f, "aiControlDisabled", live(A), -1);
				}
			}
		} else {
			if (isEqual(rt.fv(f, "aiControlDisabled", live(A)), 0)) {
				rt.setFv(f, "aiControlDisabled", live(A), 1);
			} else {
				if (isEqual(rt.fv(f, "aiControlDisabled", live(A)), -1)) {
					rt.setFv(f, "aiControlDisabled", live(A), 2);
				}
			}
		}
	} else if ($0 === "High Voltage Ground") {
		if (truthy(live(mend))) {
			if (truthy(rt.fv(f, "secondsElectrified", live(A)))) {
				yield* g.callName(f, live(A), "set_electrified", [0]);
			}
		} else {
			if (!isEqual(rt.fv(f, "secondsElectrified", live(A)), -1)) {
				yield* g.callName(f, live(A), "set_electrified", [-1]);
				if (truthy(live(f.usr))) {
					rt.modField(f, live(A), "shockedby", fmt("[＀]＀(ckey:＀)", [(yield* g.call(f, P("/proc/time_stamp"), null, [])), live(f.usr), rt.fv(f, "ckey", live(f.usr))]), add);
				}
				yield* g.call(f, P("/proc/add_logs"), null, [live(f.usr), live(A), "electrified"]);
			}
		}
	} else if ($0 === "Safety") {
		rt.setFv(f, "safe", live(A), live(mend));
	} else if ($0 === "Timing") {
		rt.setFv(f, "autoclose", live(A), live(mend));
		if ((truthy(rt.fv(f, "autoclose", live(A))) && !truthy(rt.fv(f, "density", live(A))))) {
			yield* g.callName(f, live(A), "close", []);
		}
	} else if ($0 === "Bolt Lights") {
		rt.setFv(f, "lights", live(A), live(mend));
		yield* g.callName(f, live(A), "update_icon", []);
	} else if ($0 === "High Voltage Circuit 1" || $0 === "High Voltage Circuit 2") {
		yield* g.callName(f, live(A), "shock", [live(f.usr), 50]);
	}
	return f.dot;
}, true);
