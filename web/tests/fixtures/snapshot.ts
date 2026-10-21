// snapshot.ts - fixture for the snapshot section (tests/engine-sections.ts runSnapshotCheck): the DM tests/dm/snapshot.dm.
// Every sleep inside a loop is a tail (rt.sleepThen / rt.spawnTail): a sleeping generator can't be saved in a snapshot, so the
// loop state travels as the tail's values (plain data in the frame) instead of as JS locals.
import { rt, setG, G } from "./lib.js";
import type { Frame, Value } from "./lib.js";
const { T, P, g, live, add, subtract, isEqual } = rt;

rt.globals([["snap_log", null], ["snap_result", null]]);
rt.globalInit(function (f: Frame) {
	setG("snap_log", rt.list());
	setG("snap_result", null);
});

rt.type("/datum/snapnode", "/datum", { val: 0, next: null, bag: null });

const LOG = (f: Frame, s: Value) => g.callName(f, live(G("snap_log")), "Add", [s]);
const WORLD_TIME = (f: Frame) => rt.get(f, rt.world(), "time");

// snap_worker(n): for(i in 1 to 4) { log; sleep(n) }. The loop counter i is the tail's value.
rt.tail("snap_worker", function* (f: Frame, n: Value, i: Value) {
	yield* LOG(f, rt.fmt("w＀:＀@＀", [n, i, WORLD_TIME(f)]));
	if (rt.lt(i, 4)) return yield* rt.sleepThen(f, n, "snap_worker", [n, add(i, 1)]);
	return null;
});

rt.tail("snap_main", function* (f: Frame, head: Value, r: Value, v: Value, x: Value) {
	yield* LOG(f, rt.fmt("main:＀", [x]));
	if (rt.lt(x, 3)) return yield* rt.sleepThen(f, 2, "snap_main", [head, r, v, add(x, 1)]);
	return yield* rt.sleepThen(f, 1, "snap_list", [head, r, v, 1]);
});

// for(y in list("a", "b", "c")) { sleep(1); log }
const YS = ["a", "b", "c"];
rt.tail("snap_list", function* (f: Frame, head: Value, r: Value, v: Value, i: Value) {
	const y = YS[(i as number) - 1];
	yield* LOG(f, rt.fmt("list:＀:＀", [y, yield* g.call(f, P("/proc/rand"), null, [1, 100])]));
	if (rt.lt(i, 3)) return yield* rt.sleepThen(f, 1, "snap_list", [head, r, v, add(i, 1)]);
	rt.setAt(live(v), "val", 7);
	let sum: Value = 0;
	for (let n = rt.get(f, live(head), "next"); n; n = rt.get(f, live(n), "next")) sum = add(sum, rt.get(f, live(n), "val"));
	const found = rt.locateIn(f, r, null);
	const tagged = rt.locateIn(f, "snaphead", null);
	return yield* rt.sleepThen(f, 5, "snap_done", [head, sum, found, tagged]);
});

rt.tail("snap_done", function* (f: Frame, head: Value, sum: Value, found: Value, tagged: Value) {
	const log = yield* g.call(f, P("/proc/jointext"), null, [G("snap_log"), ","]);
	setG("snap_result", rt.fmt("＀ ＀ ＀ ＀ ＀ ＀", [sum, isEqual(live(found), rt.get(f, live(head), "next")) ? 1 : 0,
		isEqual(live(tagged), live(head)) ? 1 : 0, rt.get(f, live(head), "val"), WORLD_TIME(f), log]));
	return null;
});

rt.def("/proc/snap_run", function* snap_run(f: Frame) {
	const head = yield* g.new_(f, T("/datum/snapnode"), []);
	let cur: Value = head;
	for (let i = 1; i <= 20; i++) {
		rt.set(f, live(cur), "next", yield* g.new_(f, T("/datum/snapnode"), []));
		cur = rt.get(f, live(cur), "next");
		rt.set(f, live(cur), "val", yield* g.call(f, P("/proc/rand"), null, [1, 1000]));
		rt.set(f, live(cur), "bag", rt.alist(f, [rt.fmt("k＀", [i]), cur, null, i]));
	}
	rt.set(f, live(head), "tag", "snaphead");
	const r = rt.fmt("＃", [rt.get(f, live(head), "next")]);
	const v = rt.get(f, live(head), "vars");
	rt.spawnTail(f, 3, "snap_worker", 1, 1);
	rt.spawnTail(f, 1, "snap_worker", 2, 1);
	return yield* rt.sleepThen(f, 2, "snap_main", [head, r, v, 1]);
}, true);
