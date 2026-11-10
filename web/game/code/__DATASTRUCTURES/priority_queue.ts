// Based on /tg/station's code/__DATASTRUCTURES/priority_queue.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(4410, "/PriorityQueue", "/datum", {
	L: null,
	cmp: null,
});

// priority_queue.dm:12
rt.def("/PriorityQueue/proc/New", function New(f: Frame, compare: Value) {
	this.L = new_(T("/list"));
	this.cmp = compare;
	return f.dot;
});

// priority_queue.dm:16
rt.def("/PriorityQueue/proc/IsEmpty", function IsEmpty(f: Frame) {
	return (!rt.len(f, this.L) ? 1 : 0);
});

// priority_queue.dm:57
rt.def("/PriorityQueue/proc/Remove", function Remove(f: Frame, A: Value) {
	return this.L.Remove(A);
});

// priority_queue.dm:61
rt.def("/PriorityQueue/proc/List", function List(f: Frame) {
	f.dot = this.L.Copy();
	return f.dot;
});

// priority_queue.dm:65
rt.def("/PriorityQueue/proc/Seek", function Seek(f: Frame, A: Value) {
	f.dot = this.L.Find(A);
	return f.dot;
});

// priority_queue.dm:69
rt.def("/PriorityQueue/proc/Get", function Get(f: Frame, i: Value) {
	if (i > rt.len(f, this.L) || i < 1) {
		return 0;
	}
	return rt.index(this.L, i);
});

// priority_queue.dm:75
rt.def("/PriorityQueue/proc/ReSort", function* ReSort(f: Frame, A: Value) {
	let i: Value = null;
	if ((i = this.Seek(A)) == 0) {
		return f.dot;
	}
	while (i < rt.len(f, this.L) && (yield* g.callDyn(f, this.cmp, undefined, [rt.index(this.L, i), rt.index(this.L, i + 1)])) > 0) {
		this.L.Swap(i, i + 1);
		i++;
	}
	while (i > 1 && (yield* g.callDyn(f, this.cmp, undefined, [rt.index(this.L, i), rt.index(this.L, i - 1)])) <= 0) {
		this.L.Swap(i, i - 1);
		i--;
	}
	return f.dot;
}, true);
