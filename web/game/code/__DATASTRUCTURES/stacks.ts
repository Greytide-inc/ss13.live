// From code/__DATASTRUCTURES/stacks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6, "/datum/stack", "/datum", {
	stack: null,
	max_elements: 0,
});

// /datum/stack/proc/<init>  (code/__DATASTRUCTURES/stacks.dm:2)
rt.def("/datum/stack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stack", rt.list());
	return f.dot;
});

// /datum/stack/proc/New  (code/__DATASTRUCTURES/stacks.dm:6)
rt.def("/datum/stack/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[0]))) {
		rt.setSv(f, "stack", rt.callName(f, live(f.args[0]), "Copy", []));
	}
	if (!truthy(live(f.args[1]))) return f.dot;
	rt.setSv(f, "max_elements", live(f.args[1]));
	return f.dot;
}, false, { args: ["elements", "max"] });

// /datum/stack/proc/Pop  (code/__DATASTRUCTURES/stacks.dm:13)
rt.def("/datum/stack/proc/Pop", function Pop(f: Frame) {
	if (truthy(rt.callSrc(f, "is_empty", []))) {
		return null;
	}
	f.dot = rt.index(rt.sv(f, "stack"), rt.len(f, rt.sv(f, "stack")));
	rt.callName(f, rt.sv(f, "stack"), "Cut", [rt.len(f, rt.sv(f, "stack")), 0]);
	return f.dot;
});

// /datum/stack/proc/Push  (code/__DATASTRUCTURES/stacks.dm:19)
rt.def("/datum/stack/proc/Push", function Push(f: Frame, element: Value) {
	if ((truthy(rt.sv(f, "max_elements")) && rt.gt(add(rt.len(f, rt.sv(f, "stack")), 1), rt.sv(f, "max_elements")))) {
		return null;
	}
	rt.modSrcVar(f, "stack", live(element), add);
	return f.dot;
});

// /datum/stack/proc/Top  (code/__DATASTRUCTURES/stacks.dm:24)
rt.def("/datum/stack/proc/Top", function Top(f: Frame) {
	if (truthy(rt.callSrc(f, "is_empty", []))) {
		return null;
	}
	f.dot = rt.index(rt.sv(f, "stack"), rt.len(f, rt.sv(f, "stack")));
	return f.dot;
});

// /datum/stack/proc/is_empty  (code/__DATASTRUCTURES/stacks.dm:29)
rt.def("/datum/stack/proc/is_empty", function is_empty(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.len(f, rt.sv(f, "stack")))) {
		$0 = 0;
	} else {
		$0 = 1;
	}
	f.dot = $0;
	return f.dot;
});

// /datum/stack/proc/RotateLeft  (code/__DATASTRUCTURES/stacks.dm:33)
rt.def("/datum/stack/proc/RotateLeft", function RotateLeft(f: Frame) {
	if (truthy(rt.callSrc(f, "is_empty", []))) {
		return 0;
	}
	f.dot = rt.index(rt.sv(f, "stack"), 1);
	rt.callName(f, rt.sv(f, "stack"), "Cut", [1, 2]);
	rt.callSrc(f, "Push", [live(f.dot)]);
	return f.dot;
});

// /datum/stack/proc/RotateRight  (code/__DATASTRUCTURES/stacks.dm:41)
rt.def("/datum/stack/proc/RotateRight", function RotateRight(f: Frame) {
	if (truthy(rt.callSrc(f, "is_empty", []))) {
		return 0;
	}
	f.dot = rt.index(rt.sv(f, "stack"), rt.len(f, rt.sv(f, "stack")));
	rt.callName(f, rt.sv(f, "stack"), "Cut", [rt.len(f, rt.sv(f, "stack")), 0]);
	rt.callName(f, rt.sv(f, "stack"), "Insert", [1, live(f.dot)]);
	return f.dot;
});

// /datum/stack/proc/Copy  (code/__DATASTRUCTURES/stacks.dm:49)
rt.def("/datum/stack/proc/Copy", function Copy(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setFv(f, "stack", (S = rt.new_(f, T("/datum/stack"), [])), rt.callName(f, rt.sv(f, "stack"), "Copy", []));
	rt.setFv(f, "max_elements", live(S), rt.sv(f, "max_elements"));
	return live(S);
});

// /datum/stack/proc/Clear  (code/__DATASTRUCTURES/stacks.dm:56)
rt.def("/datum/stack/proc/Clear", function Clear(f: Frame) {
	rt.callName(f, rt.sv(f, "stack"), "Cut", []);
	return f.dot;
});
