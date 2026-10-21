// From code/datums/wires/explosive.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1065, "/datum/wires/explosive", "/datum/wires", {});

// /datum/wires/explosive/proc/New  (code/datums/wires/explosive.dm:2)
rt.def("/datum/wires/explosive/proc/New", function New(f: Frame) {
	rt.callSrc(f, "add_duds", [2]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/explosive/proc/on_pulse  (code/datums/wires/explosive.dm:6)  may sleep
rt.def("/datum/wires/explosive/proc/on_pulse", function* on_pulse(f: Frame, index: Value) {
	f.vars = () => [index];
	yield* g.srcCall(f, "explode");
	return f.dot;
}, true);

// /datum/wires/explosive/proc/on_cut  (code/datums/wires/explosive.dm:9)  may sleep
rt.def("/datum/wires/explosive/proc/on_cut", function* on_cut(f: Frame, index: Value, mend: Value) {
	f.vars = () => [index, mend];
	yield* g.srcCall(f, "explode");
	return f.dot;
}, true);

rt.type(1066, "/datum/wires/explosive/c4", "/datum/wires/explosive", {
	holder_type: rt.typePath("/obj/item/weapon/grenade/plastic/c4"),
	randomize: 1,
});

// /datum/wires/explosive/c4/proc/interactable  (code/datums/wires/explosive.dm:20)
rt.def("/datum/wires/explosive/c4/proc/interactable", function interactable(f: Frame, user: Value) {
	let _P: Value = null;
	f.vars = () => [_P];
	if (!truthy(rt.gv(f, "open_panel", (_P = rt.sv(f, "holder"))))) return f.dot;
	return 1;
});

// /datum/wires/explosive/c4/proc/explode  (code/datums/wires/explosive.dm:25)  may sleep
rt.def("/datum/wires/explosive/c4/proc/explode", function* explode(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	yield* g.callName(f, (_P = rt.sv(f, "holder")), "explode", []);
	return f.dot;
}, true);

rt.type(1067, "/datum/wires/explosive/pizza", "/datum/wires/explosive", {
	holder_type: rt.typePath("/obj/item/pizzabox"),
	randomize: 1,
});

// /datum/wires/explosive/pizza/proc/New  (code/datums/wires/explosive.dm:34)
rt.def("/datum/wires/explosive/pizza/proc/New", function New(f: Frame) {
	rt.setSv(f, "wires", rt.list("Disarm"));
	rt.callSrc(f, "add_duds", [3]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["holder"] });

// /datum/wires/explosive/pizza/proc/interactable  (code/datums/wires/explosive.dm:41)
rt.def("/datum/wires/explosive/pizza/proc/interactable", function interactable(f: Frame, user: Value) {
	let _P: Value = null;
	f.vars = () => [_P];
	if (!(truthy(rt.gv(f, "open", (_P = rt.sv(f, "holder")))) && truthy(rt.fv(f, "bomb", live(_P))))) return f.dot;
	return 1;
});

// /datum/wires/explosive/pizza/proc/get_status  (code/datums/wires/explosive.dm:46)
rt.def("/datum/wires/explosive/pizza/proc/get_status", function get_status(f: Frame) {
	let _P: Value = null, status: Value = null;
	let $0: any;
	f.vars = () => [_P, status, $0];
	_P = rt.sv(f, "holder");
	status = rt.list();
	if (truthy(rt.fv(f, "bomb_active", live(_P)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	status = rt.modify(live(status), fmt("The red light is ＀.", [$0]), add);
	if (truthy(rt.fv(f, "bomb_defused", live(_P)))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	return (status = rt.modify(live(status), fmt("The green light is ＀.", [$0]), add));
});

// /datum/wires/explosive/pizza/proc/on_pulse  (code/datums/wires/explosive.dm:53)  may sleep
rt.def("/datum/wires/explosive/pizza/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let _P: Value = null;
	let $0: any;
	f.vars = () => [wire, _P, $0];
	_P = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Disarm") {
		rt.setFv(f, "bomb_defused", live(_P), (!truthy(rt.fv(f, "bomb_defused", live(_P))) ? 1 : 0));
	} else {
		yield* g.srcCall(f, "explode");
	}
	return f.dot;
}, true);

// /datum/wires/explosive/pizza/proc/on_cut  (code/datums/wires/explosive.dm:61)  may sleep
rt.def("/datum/wires/explosive/pizza/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let _P: Value = null;
	let $0: any;
	f.vars = () => [wire, mend, _P, $0];
	_P = rt.sv(f, "holder");
	$0 = live(wire);
	if ($0 === "Disarm") {
		if (truthy(live(mend))) return f.dot;
		rt.setFv(f, "bomb_defused", live(_P), 1);
	} else {
		if ((!truthy(live(mend)) && !truthy(rt.fv(f, "bomb_defused", live(_P))))) {
			yield* g.srcCall(f, "explode");
		}
	}
	return f.dot;
}, true);

// /datum/wires/explosive/pizza/proc/explode  (code/datums/wires/explosive.dm:71)  may sleep
rt.def("/datum/wires/explosive/pizza/proc/explode", function* explode(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	yield* g.callName(f, rt.gv(f, "bomb", (_P = rt.sv(f, "holder"))), "detonate", []);
	return f.dot;
}, true);

rt.type(1068, "/datum/wires/explosive/gibtonite", "/datum/wires/explosive", {
	holder_type: rt.typePath("/obj/item/weapon/twohanded/required/gibtonite"),
});

// /datum/wires/explosive/gibtonite/proc/explode  (code/datums/wires/explosive.dm:79)  may sleep
rt.def("/datum/wires/explosive/gibtonite/proc/explode", function* explode(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	yield* g.callName(f, (_P = rt.sv(f, "holder")), "GibtoniteReaction", [null, 2]);
	return f.dot;
}, true);
