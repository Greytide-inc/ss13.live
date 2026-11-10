// Based on /tg/station's code/__DATASTRUCTURES/stacks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6, "/datum/stack", "/datum", {
	stack: null,
	max_elements: 0,
});

// stacks.dm:2
rt.def("/datum/stack/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	rt.setSv(f, "stack", list());
	return f.dot;
});

// stacks.dm:6
rt.def("/datum/stack/proc/New", function New(f: Frame, elements: Value, max: Value) {
	parent_proc();
	if (elements) {
		rt.setSv(f, "stack", elements.Copy());
	}
	if (!max) return f.dot;
	this.max_elements = max;
	return f.dot;
}, false);

// stacks.dm:13
rt.def("/datum/stack/proc/Pop", function Pop(f: Frame) {
	if (this.is_empty()) {
		return null;
	}
	f.dot = rt.index(rt.sv(f, "stack"), rt.len(f, rt.sv(f, "stack")));
	rt.sv(f, "stack").Cut(rt.len(f, rt.sv(f, "stack")), 0);
	return f.dot;
});

// stacks.dm:19
rt.def("/datum/stack/proc/Push", function Push(f: Frame, element: Value) {
	if (this.max_elements && rt.len(f, rt.sv(f, "stack")) + 1 > this.max_elements) {
		return null;
	}
	this.stack += element;
	return f.dot;
});

// stacks.dm:24
rt.def("/datum/stack/proc/Top", function Top(f: Frame) {
	if (this.is_empty()) {
		return null;
	}
	f.dot = rt.index(rt.sv(f, "stack"), rt.len(f, rt.sv(f, "stack")));
	return f.dot;
});

// stacks.dm:29
rt.def("/datum/stack/proc/is_empty", function is_empty(f: Frame) {
	f.dot = rt.len(f, rt.sv(f, "stack")) ? 0 : 1;
	return f.dot;
});

// stacks.dm:49
rt.def("/datum/stack/proc/Copy", function Copy(f: Frame) {
	let S: Value = null;
	rt.setFv(f, "stack", (S = new_(T("/datum/stack"))), rt.sv(f, "stack").Copy());
	S.max_elements = this.max_elements;
	return S;
});

// stacks.dm:56
rt.def("/datum/stack/proc/Clear", function Clear(f: Frame) {
	rt.sv(f, "stack").Cut();
	return f.dot;
});
