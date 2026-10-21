// From code/game/machinery/status_display.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10829, "/obj/machinery/status_display", "/obj/machinery", {
	mode: 1,
	picture_state: null,
	message1: "",
	message2: "",
	index1: null,
	index2: null,
	frequency: 1435,
	supply_display: 0,
	shuttle_id: null,
	friendc: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 10,
	icon: rt.rsc("icons/obj/status_display.dmi"),
	icon_state: "frame",
	name: "status display",
	density: 0,
	maptext_height: 26,
	maptext_width: 32,
});

// /obj/machinery/status_display/proc/Initialize  (code/game/machinery/status_display.dm:48)  may sleep
rt.def("/obj/machinery/status_display/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.gl("ai_status_displays"), "Add", [live(f.src)]);
	yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency")]);
	return f.dot;
}, true);

// /obj/machinery/status_display/proc/Destroy  (code/game/machinery/status_display.dm:54)  may sleep
rt.def("/obj/machinery/status_display/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	yield* g.callName(f, rt.gl("ai_status_displays"), "Remove", [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/status_display/proc/process  (code/game/machinery/status_display.dm:61)
rt.def("/obj/machinery/status_display/proc/process", function process(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.callSrc(f, "remove_display", []);
		return live(f.dot);
	}
	rt.callSrc(f, "update", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/status_display/proc/emp_act  (code/game/machinery/status_display.dm:67)  may sleep
rt.def("/obj/machinery/status_display/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		yield* g.callSuper(f, [live(severity)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "set_picture", "ai_bsod");
	yield* g.callSuper(f, [live(severity)]);
	return f.dot;
}, true);

// /obj/machinery/status_display/proc/update  (code/game/machinery/status_display.dm:76)
rt.def("/obj/machinery/status_display/proc/update", function update(f: Frame) {
	let line1: Value = null, line2: Value = null, message1_len: Value = null, message2_len: Value = null;
	let $0: any;
	f.vars = () => [line1, line2, message1_len, message2_len, $0];
	if ((truthy(rt.sv(f, "friendc")) && !isEqual(rt.sv(f, "mode"), 4))) {
		rt.callSrc(f, "set_picture", ["ai_friend"]);
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		rt.callSrc(f, "remove_display", []);
	} else if ($0 === 1) {
		rt.callSrc(f, "display_shuttle_status", []);
	} else if ($0 === 2) {
		line1 = null;
		line2 = null;
		if (!truthy(rt.sv(f, "index1"))) {
			line1 = rt.sv(f, "message1");
		} else {
			line1 = rt.call(f, P("/proc/copytext"), null, [add(add(rt.sv(f, "message1"), "|"), rt.sv(f, "message1")), rt.sv(f, "index1"), add(rt.sv(f, "index1"), 5)]);
			message1_len = rt.length(rt.sv(f, "message1"));
			if (rt.gt((rt.modSrcVar(f, "index1", 2, add)), live(message1_len))) {
				(rt.modSrcVar(f, "index1", live(message1_len), subtract));
			}
		}
		if (!truthy(rt.sv(f, "index2"))) {
			line2 = rt.sv(f, "message2");
		} else {
			line2 = rt.call(f, P("/proc/copytext"), null, [add(add(rt.sv(f, "message2"), "|"), rt.sv(f, "message2")), rt.sv(f, "index2"), add(rt.sv(f, "index2"), 5)]);
			message2_len = rt.length(rt.sv(f, "message2"));
			if (rt.gt((rt.modSrcVar(f, "index2", 2, add)), live(message2_len))) {
				(rt.modSrcVar(f, "index2", live(message2_len), subtract));
			}
		}
		rt.callSrc(f, "update_display", [live(line1), live(line2)]);
	} else if ($0 === 4) {
		line1 = null;
		line2 = null;
		if (isEqual(rt.gv(f, "mode", rt.fv(f, "supply", rt.gl("SSshuttle"))), "idle")) {
			if (isEqual(rt.gv(f, "z", rt.fv(f, "supply", rt.gl("SSshuttle"))), 2)) {
				line1 = "CARGO";
				line2 = "Docked";
			}
		} else {
			line1 = "CARGO";
			if (rt.gt(rt.call(f, P("/proc/lentext"), null, [(line2 = rt.callName(f, rt.fv(f, "supply", rt.gl("SSshuttle")), "getTimerStr", []))]), 5)) {
				line2 = "Error";
			}
		}
		rt.callSrc(f, "update_display", [live(line1), live(line2)]);
	} else if ($0 === 5) {
		rt.callSrc(f, "display_shuttle_status", []);
	}
	return f.dot;
});

// /obj/machinery/status_display/proc/examine  (code/game/machinery/status_display.dm:125)
rt.def("/obj/machinery/status_display/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "mode");
	if ($0 === 1 || $0 === 2 || $0 === 4 || $0 === 5) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("The display says:<br>\t<xmp>＀</xmp><br>\t<xmp>＀</xmp>", [rt.sv(f, "message1"), rt.sv(f, "message2")])]);
	}
	if (!(isEqual(rt.sv(f, "mode"), 1) && truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Current Shuttle: ＀", [rt.gv(f, "name", rt.fv(f, "emergency", rt.gl("SSshuttle")))])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/status_display/proc/set_message  (code/game/machinery/status_display.dm:135)
rt.def("/obj/machinery/status_display/proc/set_message", function set_message(f: Frame, m1: Value, m2: Value) {
	if (truthy(live(m1))) {
		rt.setSv(f, "index1", (rt.gt(rt.length(live(m1)), 5) ? 1 : 0));
		rt.setSv(f, "message1", live(m1));
	} else {
		rt.setSv(f, "message1", "");
		rt.setSv(f, "index1", 0);
	}
	if (truthy(live(m2))) {
		rt.setSv(f, "index2", (rt.gt(rt.length(live(m2)), 5) ? 1 : 0));
		rt.setSv(f, "message2", live(m2));
	} else {
		rt.setSv(f, "message2", "");
		rt.setSv(f, "index2", 0);
	}
	return f.dot;
});

// /obj/machinery/status_display/proc/set_picture  (code/game/machinery/status_display.dm:149)
rt.def("/obj/machinery/status_display/proc/set_picture", function set_picture(f: Frame, state: Value) {
	rt.setSv(f, "picture_state", live(state));
	rt.callSrc(f, "remove_display", []);
	rt.callSrc(f, "add_overlay", [rt.sv(f, "picture_state")]);
	return f.dot;
});

// /obj/machinery/status_display/proc/update_display  (code/game/machinery/status_display.dm:154)
rt.def("/obj/machinery/status_display/proc/update_display", function update_display(f: Frame, line1: Value, line2: Value) {
	let new_text: Value = null;
	f.vars = () => [new_text];
	new_text = fmt("<div style=\"font-size:＀;color:＀;font:'＀';text-align:center;\" valign=\"top\">＀<br>＀</div>", ["5pt", "#09f", "Arial Black", live(line1), live(line2)]);
	if (isEqual(rt.sv(f, "maptext"), live(new_text))) return f.dot;
	rt.setSv(f, "maptext", live(new_text));
	return f.dot;
});

// /obj/machinery/status_display/proc/remove_display  (code/game/machinery/status_display.dm:159)
rt.def("/obj/machinery/status_display/proc/remove_display", function remove_display(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "maptext"))) return f.dot;
	rt.setSv(f, "maptext", "");
	return f.dot;
});

// /obj/machinery/status_display/proc/display_shuttle_status  (code/game/machinery/status_display.dm:166)
rt.def("/obj/machinery/status_display/proc/display_shuttle_status", function display_shuttle_status(f: Frame) {
	let shuttle: Value = null, line1: Value = null, line2: Value = null;
	f.vars = () => [shuttle, line1, line2];
	shuttle = null;
	if (isEqual(rt.sv(f, "mode"), 1)) {
		shuttle = rt.fv(f, "emergency", rt.gl("SSshuttle"));
	} else {
		shuttle = rt.callName(f, rt.gl("SSshuttle"), "getShuttle", [rt.sv(f, "shuttle_id")]);
	}
	if (!truthy(live(shuttle))) {
		rt.callSrc(f, "update_display", ["shutl?", ""]);
	} else {
		if (truthy(rt.fv(f, "timer", live(shuttle)))) {
			line1 = fmt("-＀-", [rt.callName(f, live(shuttle), "getModeStr", [])]);
			if (rt.gt(rt.length((line2 = rt.callName(f, live(shuttle), "getTimerStr", []))), 5)) {
				line2 = "Error!";
			}
			rt.callSrc(f, "update_display", [live(line1), live(line2)]);
		} else {
			rt.callSrc(f, "remove_display", []);
		}
	}
	return f.dot;
});

// /obj/machinery/status_display/proc/receive_signal  (code/game/machinery/status_display.dm:188)
rt.def("/obj/machinery/status_display/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "supply_display"))) {
		rt.setSv(f, "mode", 4);
		return live(f.dot);
	}
	$0 = rt.index(rt.fv(f, "data", live(signal)), "command");
	if ($0 === "blank") {
		rt.setSv(f, "mode", 0);
	} else if ($0 === "shuttle") {
		rt.setSv(f, "mode", 1);
	} else if ($0 === "message") {
		rt.setSv(f, "mode", 2);
		rt.callSrc(f, "set_message", [rt.index(rt.fv(f, "data", live(signal)), "msg1"), rt.index(rt.fv(f, "data", live(signal)), "msg2")]);
	} else if ($0 === "alert") {
		rt.setSv(f, "mode", 3);
		rt.callSrc(f, "set_picture", [rt.index(rt.fv(f, "data", live(signal)), "picture_state")]);
	}
	return f.dot;
});

rt.type(10830, "/obj/machinery/ai_status_display", "/obj/machinery", {
	mode: 0,
	picture_state: null,
	emotion: "Neutral",
	anchored: 1,
	icon: rt.rsc("icons/obj/status_display.dmi"),
	desc: "A small screen which the AI can use to present itself.",
	icon_state: "frame",
	name: "１AI display",
	density: 0,
});

// /obj/machinery/ai_status_display/proc/Initialize  (code/game/machinery/status_display.dm:217)  may sleep
rt.def("/obj/machinery/ai_status_display/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.gl("ai_status_displays"), "Add", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/ai_status_display/proc/Destroy  (code/game/machinery/status_display.dm:221)  may sleep
rt.def("/obj/machinery/ai_status_display/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.gl("ai_status_displays"), "Remove", [live(f.src)]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/ai_status_display/proc/attack_ai  (code/game/machinery/status_display.dm:225)  may sleep
rt.def("/obj/machinery/ai_status_display/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(user), "ai_statuschange", []);
	return f.dot;
}, true);

// /obj/machinery/ai_status_display/proc/process  (code/game/machinery/status_display.dm:229)
rt.def("/obj/machinery/ai_status_display/proc/process", function process(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.callSrc(f, "cut_overlays", []);
		return live(f.dot);
	}
	rt.callSrc(f, "update", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/ai_status_display/proc/emp_act  (code/game/machinery/status_display.dm:236)  may sleep
rt.def("/obj/machinery/ai_status_display/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		yield* g.callSuper(f, [live(severity)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "set_picture", "ai_bsod");
	yield* g.callSuper(f, [live(severity)]);
	return f.dot;
}, true);

// /obj/machinery/ai_status_display/proc/update  (code/game/machinery/status_display.dm:244)
rt.def("/obj/machinery/ai_status_display/proc/update", function update(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (isEqual(rt.sv(f, "mode"), 0)) {
		rt.callSrc(f, "cut_overlays", []);
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "mode"), 1)) {
		$0 = rt.sv(f, "emotion");
		if ($0 === "Very Happy") {
			rt.callSrc(f, "set_picture", ["ai_veryhappy"]);
		} else if ($0 === "Happy") {
			rt.callSrc(f, "set_picture", ["ai_happy"]);
		} else if ($0 === "Neutral") {
			rt.callSrc(f, "set_picture", ["ai_neutral"]);
		} else if ($0 === "Unsure") {
			rt.callSrc(f, "set_picture", ["ai_unsure"]);
		} else if ($0 === "Confused") {
			rt.callSrc(f, "set_picture", ["ai_confused"]);
		} else if ($0 === "Sad") {
			rt.callSrc(f, "set_picture", ["ai_sad"]);
		} else if ($0 === "BSOD") {
			rt.callSrc(f, "set_picture", ["ai_bsod"]);
		} else if ($0 === "Blank") {
			rt.callSrc(f, "set_picture", ["ai_off"]);
		} else if ($0 === "Problems?") {
			rt.callSrc(f, "set_picture", ["ai_trollface"]);
		} else if ($0 === "Awesome") {
			rt.callSrc(f, "set_picture", ["ai_awesome"]);
		} else if ($0 === "Dorfy") {
			rt.callSrc(f, "set_picture", ["ai_urist"]);
		} else if ($0 === "Facepalm") {
			rt.callSrc(f, "set_picture", ["ai_facepalm"]);
		} else if ($0 === "Friend Computer") {
			rt.callSrc(f, "set_picture", ["ai_friend"]);
		} else if ($0 === "Blue Glow") {
			rt.callSrc(f, "set_picture", ["ai_sal"]);
		} else if ($0 === "Red Glow") {
			rt.callSrc(f, "set_picture", ["ai_hal"]);
		}
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "mode"), 2)) return f.dot;
	rt.callSrc(f, "set_picture", ["ai_bsod"]);
	return live(f.dot);
});

// /obj/machinery/ai_status_display/proc/set_picture  (code/game/machinery/status_display.dm:289)
rt.def("/obj/machinery/ai_status_display/proc/set_picture", function set_picture(f: Frame, state: Value) {
	rt.setSv(f, "picture_state", live(state));
	rt.callSrc(f, "cut_overlays", []);
	rt.callSrc(f, "add_overlay", [rt.sv(f, "picture_state")]);
	return f.dot;
});
