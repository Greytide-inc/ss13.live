// From code/datums/wires/mulebot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1069, "/datum/wires/mulebot", "/datum/wires", {
	holder_type: rt.typePath("/mob/living/simple_animal/bot/mulebot"),
	randomize: 1,
});

// /datum/wires/mulebot/proc/New  (code/datums/wires/mulebot.dm:12)
rt.def("/datum/wires/mulebot/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Main Power 1", "Main Power 2", "Avoidance", "Load Check", "Motor 1", "Motor 2", "Recieve", "Transmit", "Beacon"));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/mulebot/proc/interactable  (code/datums/wires/mulebot.dm:15)
rt.def("/datum/wires/mulebot/proc/interactable", function interactable(f: Frame, user: Value) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy(rt.gv(f, "open", (M = rt.sv(f, "holder"))))) return f.dot;
	return 1;
});

// /datum/wires/mulebot/proc/on_pulse  (code/datums/wires/mulebot.dm:20)
rt.def("/datum/wires/mulebot/proc/on_pulse", function on_pulse(f: Frame, wire: Value) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	M = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Main Power 1" || $0 === "Main Power 2") {
		rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ The charge light flickers.</span>", [rt.call(f, P("/proc/bicon"), null, [live(M)])])]);
	} else if ($0 === "Avoidance") {
		rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ The external warning lights flash briefly.</span>", [rt.call(f, P("/proc/bicon"), null, [live(M)])])]);
	} else if ($0 === "Load Check") {
		rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ The load platform clunks.</span>", [rt.call(f, P("/proc/bicon"), null, [live(M)])])]);
	} else if ($0 === "Motor 1" || $0 === "Motor 2") {
		rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ The drive motor whines briefly.</span>", [rt.call(f, P("/proc/bicon"), null, [live(M)])])]);
	} else {
		rt.callName(f, rt.sv(f, "holder"), "visible_message", [fmt("<span class='notice'>＀ You hear a radio crackle.</span>", [rt.call(f, P("/proc/bicon"), null, [live(M)])])]);
	}
	return f.dot;
});
