// Based on /tg/station's code/__DATASTRUCTURES/heap.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(3, "/Heap", "/datum", {
	L: null,
	cmp: null,
});

// heap.dm:11
rt.def("/Heap/proc/New", function New(f: Frame, compare: Value) {
	this.L = new_(T("/list"));
	this.cmp = compare;
	return f.dot;
});

// heap.dm:15
rt.def("/Heap/proc/IsEmpty", function IsEmpty(f: Frame) {
	return (!rt.len(f, this.L) ? 1 : 0);
});

// heap.dm:20
rt.def("/Heap/proc/Insert", function* Insert(f: Frame, A: Value) {
	this.L.Add(A);
	yield* this.Swim(rt.len(f, this.L));
	return f.dot;
}, true);

// heap.dm:26
rt.def("/Heap/proc/Pop", function* Pop(f: Frame) {
	if (!rt.len(f, this.L)) {
		return 0;
	}
	f.dot = rt.index(this.L, 1);
	rt.setAt(this.L, 1, rt.index(this.L, rt.len(f, this.L)));
	this.L.Cut(rt.len(f, this.L));
	yield* this.Sink(1);
	return f.dot;
}, true);

// heap.dm:37
rt.def("/Heap/proc/Swim", function* Swim(f: Frame, index: Value) {
	let parent: Value = round(index * 0.5);
	while (parent > 0 && (yield* g.callDyn(f, this.cmp, undefined, [rt.index(this.L, index), rt.index(this.L, parent)])) > 0) {
		this.L.Swap(index, parent);
		parent = round((index = parent) * 0.5);
	}
	return f.dot;
}, true);

// heap.dm:46
rt.def("/Heap/proc/Sink", function* Sink(f: Frame, index: Value) {
	let g_child: Value = (yield* this.GetGreaterChild(index));
	while (g_child > 0 && (yield* g.callDyn(f, this.cmp, undefined, [rt.index(this.L, index), rt.index(this.L, g_child)])) < 0) {
		this.L.Swap(index, g_child);
		g_child = (yield* this.GetGreaterChild((index = g_child)));
	}
	return f.dot;
}, true);

// heap.dm:56
rt.def("/Heap/proc/GetGreaterChild", function* GetGreaterChild(f: Frame, index: Value) {
	if (index * 2 > rt.len(f, this.L)) {
		return 0;
	}
	if (index * 2 + 1 > rt.len(f, this.L)) {
		return index * 2;
	}
	if ((yield* g.callDyn(f, this.cmp, undefined, [rt.index(this.L, index * 2), rt.index(this.L, index * 2 + 1)])) < 0) {
		return index * 2 + 1;
	}
	return index * 2;
}, true);

// heap.dm:69
rt.def("/Heap/proc/ReSort", function* ReSort(f: Frame, A: Value) {
	let index: Value = null;
	yield* this.Swim((index = this.L.Find(A)));
	yield* this.Sink(index);
	return f.dot;
}, true);

// heap.dm:75
rt.def("/Heap/proc/List", function List(f: Frame) {
	f.dot = this.L.Copy();
	return f.dot;
});
