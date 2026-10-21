// From code/__DATASTRUCTURES/priority_queue.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4410, "/PriorityQueue", "/datum", {
	L: null,
	cmp: null,
});

// /PriorityQueue/proc/New  (code/__DATASTRUCTURES/priority_queue.dm:12)
rt.def("/PriorityQueue/proc/New", function New(f: Frame, compare: Value) {
	rt.setSv(f, "L", rt.new_(f, T("/list"), []));
	rt.setSv(f, "cmp", live(compare));
	return f.dot;
});

// /PriorityQueue/proc/IsEmpty  (code/__DATASTRUCTURES/priority_queue.dm:16)
rt.def("/PriorityQueue/proc/IsEmpty", function IsEmpty(f: Frame) {
	return (!truthy(rt.len(f, rt.sv(f, "L"))) ? 1 : 0);
});

// /PriorityQueue/proc/FindElementIndex  (code/__DATASTRUCTURES/priority_queue.dm:24)  may sleep
rt.def("/PriorityQueue/proc/FindElementIndex", function* FindElementIndex(f: Frame, A: Value) {
	let i: Value = null, j: Value = null, mid: Value = null;
	let $0: any;
	f.vars = () => [A, i, j, mid, $0];
	i = 1;
	j = rt.len(f, rt.sv(f, "L"));
	mid = null;
	while (rt.lt(live(i), live(j))) {
		mid = (yield* g.call(f, P("/proc/round"), null, [divide(add(live(i), live(j)), 2)]));
		if (rt.lt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [rt.index(rt.sv(f, "L"), live(mid)), live(A)])), 0)) {
			i = add(live(mid), 1);
		} else {
			j = live(mid);
		}
	}
	if ((isEqual(live(i), 1) || isEqual(live(i), rt.len(f, rt.sv(f, "L"))))) {
		if (rt.gt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [rt.index(rt.sv(f, "L"), live(i)), live(A)])), 0)) {
			$0 = live(i);
		} else {
			$0 = add(live(i), 1);
		}
		return $0;
	}
	return live(i);
}, true);

// /PriorityQueue/proc/Enqueue  (code/__DATASTRUCTURES/priority_queue.dm:41)  may sleep
rt.def("/PriorityQueue/proc/Enqueue", function* Enqueue(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy(rt.len(f, rt.sv(f, "L")))) {
		yield* g.callName(f, rt.sv(f, "L"), "Add", [live(A)]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "L"), "Insert", [(yield* g.srcCall(f, "FindElementIndex", live(A))), live(A)]);
	return f.dot;
}, true);

// /PriorityQueue/proc/Dequeue  (code/__DATASTRUCTURES/priority_queue.dm:49)
rt.def("/PriorityQueue/proc/Dequeue", function Dequeue(f: Frame) {
	if (!truthy(rt.len(f, rt.sv(f, "L")))) {
		return 0;
	}
	f.dot = rt.index(rt.sv(f, "L"), 1);
	rt.callSrc(f, "Remove", [live(f.dot)]);
	return f.dot;
});

// /PriorityQueue/proc/Remove  (code/__DATASTRUCTURES/priority_queue.dm:57)
rt.def("/PriorityQueue/proc/Remove", function Remove(f: Frame, A: Value) {
	return rt.callName(f, rt.sv(f, "L"), "Remove", [live(A)]);
});

// /PriorityQueue/proc/List  (code/__DATASTRUCTURES/priority_queue.dm:61)
rt.def("/PriorityQueue/proc/List", function List(f: Frame) {
	f.dot = rt.callName(f, rt.sv(f, "L"), "Copy", []);
	return f.dot;
});

// /PriorityQueue/proc/Seek  (code/__DATASTRUCTURES/priority_queue.dm:65)
rt.def("/PriorityQueue/proc/Seek", function Seek(f: Frame, A: Value) {
	f.dot = rt.callName(f, rt.sv(f, "L"), "Find", [live(A)]);
	return f.dot;
});

// /PriorityQueue/proc/Get  (code/__DATASTRUCTURES/priority_queue.dm:69)
rt.def("/PriorityQueue/proc/Get", function Get(f: Frame, i: Value) {
	if ((rt.gt(live(i), rt.len(f, rt.sv(f, "L"))) || rt.lt(live(i), 1))) {
		return 0;
	}
	return rt.index(rt.sv(f, "L"), live(i));
});

// /PriorityQueue/proc/ReSort  (code/__DATASTRUCTURES/priority_queue.dm:75)  may sleep
rt.def("/PriorityQueue/proc/ReSort", function* ReSort(f: Frame, A: Value) {
	let i: Value = null;
	f.vars = () => [A, i];
	if (isEqual((i = (yield* g.srcCall(f, "Seek", live(A)))), 0)) {
		return live(f.dot);
	}
	while (rt.lt(live(i), rt.len(f, rt.sv(f, "L"))) && rt.gt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [rt.index(rt.sv(f, "L"), live(i)), rt.index(rt.sv(f, "L"), add(live(i), 1))])), 0)) {
		yield* g.callName(f, rt.sv(f, "L"), "Swap", [live(i), add(live(i), 1)]);
		i = rt.inc(live(i), 1);
	}
	while (rt.gt(live(i), 1) && rt.le((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [rt.index(rt.sv(f, "L"), live(i)), rt.index(rt.sv(f, "L"), subtract(live(i), 1))])), 0)) {
		yield* g.callName(f, rt.sv(f, "L"), "Swap", [live(i), subtract(live(i), 1)]);
		i = rt.inc(live(i), -1);
	}
	return f.dot;
}, true);
