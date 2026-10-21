// From code/__DATASTRUCTURES/heap.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3, "/Heap", "/datum", {
	L: null,
	cmp: null,
});

// /Heap/proc/New  (code/__DATASTRUCTURES/heap.dm:11)
rt.def("/Heap/proc/New", function New(f: Frame, compare: Value) {
	rt.setSv(f, "L", rt.new_(f, T("/list"), []));
	rt.setSv(f, "cmp", live(compare));
	return f.dot;
});

// /Heap/proc/IsEmpty  (code/__DATASTRUCTURES/heap.dm:15)
rt.def("/Heap/proc/IsEmpty", function IsEmpty(f: Frame) {
	return (!truthy(rt.len(f, rt.sv(f, "L"))) ? 1 : 0);
});

// /Heap/proc/Insert  (code/__DATASTRUCTURES/heap.dm:20)  may sleep
rt.def("/Heap/proc/Insert", function* Insert(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, rt.sv(f, "L"), "Add", [live(A)]);
	yield* g.srcCall(f, "Swim", rt.len(f, rt.sv(f, "L")));
	return f.dot;
}, true);

// /Heap/proc/Pop  (code/__DATASTRUCTURES/heap.dm:26)  may sleep
rt.def("/Heap/proc/Pop", function* Pop(f: Frame) {
	if (!truthy(rt.len(f, rt.sv(f, "L")))) {
		return 0;
	}
	f.dot = rt.index(rt.sv(f, "L"), 1);
	rt.setAt(rt.sv(f, "L"), 1, rt.index(rt.sv(f, "L"), rt.len(f, rt.sv(f, "L"))));
	yield* g.callName(f, rt.sv(f, "L"), "Cut", [rt.len(f, rt.sv(f, "L"))]);
	yield* g.srcCall(f, "Sink", 1);
	return f.dot;
}, true);

// /Heap/proc/Swim  (code/__DATASTRUCTURES/heap.dm:37)  may sleep
rt.def("/Heap/proc/Swim", function* Swim(f: Frame, index: Value) {
	let parent: Value = null;
	f.vars = () => [index, parent];
	parent = (yield* g.call(f, P("/proc/round"), null, [multiply(live(index), 0.5)]));
	while (rt.gt(live(parent), 0) && rt.gt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [rt.index(rt.sv(f, "L"), live(index)), rt.index(rt.sv(f, "L"), live(parent))])), 0)) {
		yield* g.callName(f, rt.sv(f, "L"), "Swap", [live(index), live(parent)]);
		parent = (yield* g.call(f, P("/proc/round"), null, [multiply((index = live(parent)), 0.5)]));
	}
	return f.dot;
}, true);

// /Heap/proc/Sink  (code/__DATASTRUCTURES/heap.dm:46)  may sleep
rt.def("/Heap/proc/Sink", function* Sink(f: Frame, index: Value) {
	let g_child: Value = null;
	f.vars = () => [index, g_child];
	g_child = (yield* g.srcCall(f, "GetGreaterChild", live(index)));
	while (rt.gt(live(g_child), 0) && rt.lt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [rt.index(rt.sv(f, "L"), live(index)), rt.index(rt.sv(f, "L"), live(g_child))])), 0)) {
		yield* g.callName(f, rt.sv(f, "L"), "Swap", [live(index), live(g_child)]);
		g_child = (yield* g.srcCall(f, "GetGreaterChild", (index = live(g_child))));
	}
	return f.dot;
}, true);

// /Heap/proc/GetGreaterChild  (code/__DATASTRUCTURES/heap.dm:56)  may sleep
rt.def("/Heap/proc/GetGreaterChild", function* GetGreaterChild(f: Frame, index: Value) {
	f.vars = () => [index];
	if (rt.gt(multiply(live(index), 2), rt.len(f, rt.sv(f, "L")))) {
		return 0;
	}
	if (rt.gt(add(multiply(live(index), 2), 1), rt.len(f, rt.sv(f, "L")))) {
		return multiply(live(index), 2);
	}
	if (rt.lt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [rt.index(rt.sv(f, "L"), multiply(live(index), 2)), rt.index(rt.sv(f, "L"), add(multiply(live(index), 2), 1))])), 0)) {
		return add(multiply(live(index), 2), 1);
	}
	return multiply(live(index), 2);
}, true);

// /Heap/proc/ReSort  (code/__DATASTRUCTURES/heap.dm:69)  may sleep
rt.def("/Heap/proc/ReSort", function* ReSort(f: Frame, A: Value) {
	let index: Value = null;
	f.vars = () => [A, index];
	yield* g.srcCall(f, "Swim", (index = (yield* g.callName(f, rt.sv(f, "L"), "Find", [live(A)]))));
	yield* g.srcCall(f, "Sink", live(index));
	return f.dot;
}, true);

// /Heap/proc/List  (code/__DATASTRUCTURES/heap.dm:75)
rt.def("/Heap/proc/List", function List(f: Frame) {
	f.dot = rt.callName(f, rt.sv(f, "L"), "Copy", []);
	return f.dot;
});
