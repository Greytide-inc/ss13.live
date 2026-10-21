// From code/__HELPERS/sorts/__main.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalsortInstance  (code/__HELPERS/sorts/__main.dm:12)
rt.def("/datum/controller/global_vars/proc/InitGlobalsortInstance", function InitGlobalsortInstance(f: Frame) {
	rt.setGl("sortInstance", rt.new_(f, T("/datum/sortInstance"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "sortInstance", add);
	return f.dot;
});

rt.type(59, "/datum/sortInstance", "/datum", {
	L: null,
	associative: 0,
	minGallop: 7,
	runBases: null,
	runLens: null,
	cmp: rt.procRef("/proc/cmp_numeric_asc"),
});

// /datum/sortInstance/proc/<init>  (code/__HELPERS/sorts/__main.dm:31)
rt.def("/datum/sortInstance/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "runBases", rt.list());
	$0 = $0;
	rt.setSv(f, "runLens", rt.list());
	return f.dot;
});

// /datum/sortInstance/proc/timSort  (code/__HELPERS/sorts/__main.dm:36)  may sleep
rt.def("/datum/sortInstance/proc/timSort", function* timSort(f: Frame, start: Value, end: Value) {
	let remaining: Value = null, initRunLen: Value = null, minRun: Value = null, runLen: Value = null, force: Value = null;
	let $0: any;
	f.vars = () => [start, end, remaining, initRunLen, minRun, runLen, force, $0];
	yield* g.callName(f, rt.sv(f, "runBases"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "runLens"), "Cut", []);
	if (rt.lt((remaining = subtract(live(end), live(start))), 32)) {
		initRunLen = (yield* g.srcCall(f, "countRunAndMakeAscending", live(start), live(end)));
		yield* g.srcCall(f, "binarySort", live(start), live(end), add(live(start), live(initRunLen)));
		return live(f.dot);
	}
	minRun = (yield* g.srcCall(f, "minRunLength", live(remaining)));
	while (true) {
		if (rt.lt((runLen = (yield* g.srcCall(f, "countRunAndMakeAscending", live(start), live(end)))), live(minRun))) {
			if (rt.le(live(remaining), live(minRun))) {
				$0 = live(remaining);
			} else {
				$0 = live(minRun);
			}
			force = $0;
			yield* g.srcCall(f, "binarySort", live(start), add(live(start), live(force)), add(live(start), live(runLen)));
			runLen = live(force);
		}
		yield* g.callName(f, rt.sv(f, "runBases"), "Add", [live(start)]);
		yield* g.callName(f, rt.sv(f, "runLens"), "Add", [live(runLen)]);
		yield* g.srcCall(f, "mergeCollapse");
		start = rt.modify(live(start), live(runLen), add);
		(remaining = rt.modify(live(remaining), live(runLen), subtract));
		if (!rt.gt(live(remaining), 0)) break;
	}
	yield* g.srcCall(f, "mergeForceCollapse");
	rt.setSv(f, "minGallop", 7);
	return rt.sv(f, "L");
}, true);

// /datum/sortInstance/proc/binarySort  (code/__HELPERS/sorts/__main.dm:102)  may sleep
rt.def("/datum/sortInstance/proc/binarySort", function* binarySort(f: Frame, lo: Value, hi: Value, start: Value) {
	let pivot: Value = null, left: Value = null, right: Value = null, mid: Value = null;
	let $0: any;
	f.vars = () => [lo, hi, start, pivot, left, right, mid, $0];
	if (rt.le(live(start), live(lo))) {
		start = add(live(lo), 1);
	}
	while (rt.lt(live(start), live(hi))) {
		if (truthy(rt.sv(f, "associative"))) {
			$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(start)));
		} else {
			$0 = rt.index(rt.sv(f, "L"), live(start));
		}
		pivot = $0;
		left = live(lo);
		right = live(start);
		while (rt.lt(live(left), live(right))) {
			mid = rt.shiftRight(add(live(left), live(right)), 1);
			if (truthy(rt.sv(f, "associative"))) {
				$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(mid)));
			} else {
				$0 = rt.index(rt.sv(f, "L"), live(mid));
			}
			if (rt.gt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [$0, live(pivot)])), 0)) {
				right = live(mid);
			} else {
				left = add(live(mid), 1);
			}
		}
		yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), live(start), live(left)]);
		start = rt.inc(live(start), 1);
	}
	return f.dot;
}, true);

// /datum/sortInstance/proc/countRunAndMakeAscending  (code/__HELPERS/sorts/__main.dm:140)  may sleep
rt.def("/datum/sortInstance/proc/countRunAndMakeAscending", function* countRunAndMakeAscending(f: Frame, lo: Value, hi: Value) {
	let runHi: Value = null, last: Value = null, current: Value = null;
	let $0: any, $t: any;
	f.vars = () => [lo, hi, runHi, last, current, $0, $t];
	if (rt.ge((runHi = add(live(lo), 1)), live(hi))) {
		return 1;
	}
	if (truthy(rt.sv(f, "associative"))) {
		$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(lo)));
	} else {
		$0 = rt.index(rt.sv(f, "L"), live(lo));
	}
	last = $0;
	if (truthy(rt.sv(f, "associative"))) {
		$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), ($t = live(runHi), runHi = rt.inc($t, 1), $t)));
	} else {
		$0 = rt.index(rt.sv(f, "L"), ($t = live(runHi), runHi = rt.inc($t, 1), $t));
	}
	if (rt.lt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [(current = $0), live(last)])), 0)) {
		while (rt.lt(live(runHi), live(hi))) {
			last = live(current);
			if (truthy(rt.sv(f, "associative"))) {
				$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(runHi)));
			} else {
				$0 = rt.index(rt.sv(f, "L"), live(runHi));
			}
			if (rt.ge((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [(current = $0), live(last)])), 0)) {
				break;
			}
			runHi = rt.inc(live(runHi), 1);
		}
		yield* g.call(f, P("/proc/reverseRange"), null, [rt.sv(f, "L"), live(lo), live(runHi)]);
	} else {
		while (rt.lt(live(runHi), live(hi))) {
			last = live(current);
			if (truthy(rt.sv(f, "associative"))) {
				$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(runHi)));
			} else {
				$0 = rt.index(rt.sv(f, "L"), live(runHi));
			}
			if (rt.lt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [(current = $0), live(last)])), 0)) {
				break;
			}
			runHi = rt.inc(live(runHi), 1);
		}
	}
	return subtract(live(runHi), live(lo));
}, true);

// /datum/sortInstance/proc/minRunLength  (code/__HELPERS/sorts/__main.dm:170)
rt.def("/datum/sortInstance/proc/minRunLength", function minRunLength(f: Frame, n: Value) {
	let r: Value = null;
	f.vars = () => [n, r];
	r = 0;
	while (rt.ge(live(n), 32)) {
		(r = rt.modify(live(r), rt.bitAnd(live(n), 1), rt.bitOr));
		(n = rt.modify(live(n), 1, rt.shiftRight));
	}
	return add(live(n), live(r));
});

// /datum/sortInstance/proc/mergeCollapse  (code/__HELPERS/sorts/__main.dm:181)  may sleep
rt.def("/datum/sortInstance/proc/mergeCollapse", function* mergeCollapse(f: Frame) {
	let n: Value = null;
	f.vars = () => [n];
	while (rt.ge(rt.len(f, rt.sv(f, "runBases")), 2)) {
		if ((rt.gt((n = subtract(rt.len(f, rt.sv(f, "runBases")), 1)), 1) && rt.le(rt.index(rt.sv(f, "runLens"), subtract(live(n), 1)), add(rt.index(rt.sv(f, "runLens"), live(n)), rt.index(rt.sv(f, "runLens"), add(live(n), 1)))))) {
			if (rt.lt(rt.index(rt.sv(f, "runLens"), subtract(live(n), 1)), rt.index(rt.sv(f, "runLens"), add(live(n), 1)))) {
				n = rt.inc(live(n), -1);
			}
			yield* g.srcCall(f, "mergeAt", live(n));
		} else {
			if (rt.le(rt.index(rt.sv(f, "runLens"), live(n)), rt.index(rt.sv(f, "runLens"), add(live(n), 1)))) {
				yield* g.srcCall(f, "mergeAt", live(n));
			} else {
				break;
			}
		}
	}
	return f.dot;
}, true);

// /datum/sortInstance/proc/mergeForceCollapse  (code/__HELPERS/sorts/__main.dm:196)  may sleep
rt.def("/datum/sortInstance/proc/mergeForceCollapse", function* mergeForceCollapse(f: Frame) {
	let n: Value = null;
	f.vars = () => [n];
	while (rt.ge(rt.len(f, rt.sv(f, "runBases")), 2)) {
		if ((rt.gt((n = subtract(rt.len(f, rt.sv(f, "runBases")), 1)), 1) && rt.lt(rt.index(rt.sv(f, "runLens"), subtract(live(n), 1)), rt.index(rt.sv(f, "runLens"), add(live(n), 1))))) {
			n = rt.inc(live(n), -1);
		}
		yield* g.srcCall(f, "mergeAt", live(n));
	}
	return f.dot;
}, true);

// /datum/sortInstance/proc/mergeAt  (code/__HELPERS/sorts/__main.dm:211)  may sleep
rt.def("/datum/sortInstance/proc/mergeAt", function* mergeAt(f: Frame, i: Value) {
	let base1: Value = null, base2: Value = null, len1: Value = null, len2: Value = null, k: Value = null;
	let $0: any;
	f.vars = () => [i, base1, base2, len1, len2, k, $0];
	base1 = rt.index(rt.sv(f, "runBases"), live(i));
	base2 = rt.index(rt.sv(f, "runBases"), add(live(i), 1));
	len1 = rt.index(rt.sv(f, "runLens"), live(i));
	len2 = rt.index(rt.sv(f, "runLens"), add(live(i), 1));
	rt.modAt(rt.sv(f, "runLens"), live(i), rt.index(rt.sv(f, "runLens"), add(live(i), 1)), add);
	yield* g.callName(f, rt.sv(f, "runLens"), "Cut", [add(live(i), 1), add(live(i), 2)]);
	yield* g.callName(f, rt.sv(f, "runBases"), "Cut", [add(live(i), 1), add(live(i), 2)]);
	if (truthy(rt.sv(f, "associative"))) {
		$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(base2)));
	} else {
		$0 = rt.index(rt.sv(f, "L"), live(base2));
	}
	base1 = rt.modify(live(base1), (k = (yield* g.srcCall(f, "gallopRight", $0, live(base1), live(len1), 0))), add);
	(len1 = rt.modify(live(len1), live(k), subtract));
	if (isEqual(live(len1), 0)) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "associative"))) {
		$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), subtract(add(live(base1), live(len1)), 1)));
	} else {
		$0 = rt.index(rt.sv(f, "L"), subtract(add(live(base1), live(len1)), 1));
	}
	if (isEqual((len2 = (yield* g.srcCall(f, "gallopLeft", $0, live(base2), live(len2), subtract(live(len2), 1)))), 0)) {
		return live(f.dot);
	}
	if (rt.le(live(len1), live(len2))) {
		yield* g.srcCall(f, "mergeLo", live(base1), live(len1), live(base2), live(len2));
	} else {
		yield* g.srcCall(f, "mergeHi", live(base1), live(len1), live(base2), live(len2));
	}
	return f.dot;
}, true);

// /datum/sortInstance/proc/gallopLeft  (code/__HELPERS/sorts/__main.dm:265)  may sleep
rt.def("/datum/sortInstance/proc/gallopLeft", function* gallopLeft(f: Frame, key: Value, base: Value, len: Value, hint: Value) {
	let lastOffset: Value = null, offset: Value = null, maxOffset: Value = null, temp: Value = null, m: Value = null;
	let $0: any, $1: any;
	f.vars = () => [key, base, len, hint, lastOffset, offset, maxOffset, temp, m, $0, $1];
	lastOffset = 0;
	offset = 1;
	$0 = live(key);
	if (truthy(rt.sv(f, "associative"))) {
		$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), add(live(base), live(hint))));
	} else {
		$1 = rt.index(rt.sv(f, "L"), add(live(base), live(hint)));
	}
	if (rt.gt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [$0, $1])), 0)) {
		maxOffset = subtract(live(len), live(hint));
		while (true) {
			$0 = (rt.lt(live(offset), live(maxOffset)) ? 1 : 0);
			if (truthy($0)) {
				$0 = live(key);
				if (truthy(rt.sv(f, "associative"))) {
					$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), add(add(live(base), live(hint)), live(offset))));
				} else {
					$1 = rt.index(rt.sv(f, "L"), add(add(live(base), live(hint)), live(offset)));
				}
				$0 = (rt.gt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [$0, $1])), 0) ? 1 : 0);
			}
			if (!truthy($0)) break;
			lastOffset = live(offset);
			offset = add(rt.shiftLeft(live(offset), 1), 1);
		}
		if (rt.gt(live(offset), live(maxOffset))) {
			offset = live(maxOffset);
		}
		lastOffset = rt.modify(live(lastOffset), live(hint), add);
		offset = rt.modify(live(offset), live(hint), add);
	} else {
		maxOffset = add(live(hint), 1);
		while (true) {
			$0 = (rt.lt(live(offset), live(maxOffset)) ? 1 : 0);
			if (truthy($0)) {
				$0 = live(key);
				if (truthy(rt.sv(f, "associative"))) {
					$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), subtract(add(live(base), live(hint)), live(offset))));
				} else {
					$1 = rt.index(rt.sv(f, "L"), subtract(add(live(base), live(hint)), live(offset)));
				}
				$0 = (rt.le((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [$0, $1])), 0) ? 1 : 0);
			}
			if (!truthy($0)) break;
			lastOffset = live(offset);
			offset = add(rt.shiftLeft(live(offset), 1), 1);
		}
		if (rt.gt(live(offset), live(maxOffset))) {
			offset = live(maxOffset);
		}
		temp = live(lastOffset);
		lastOffset = subtract(live(hint), live(offset));
		offset = subtract(live(hint), live(temp));
	}
	lastOffset = rt.inc(live(lastOffset), 1);
	while (rt.lt(live(lastOffset), live(offset))) {
		m = add(live(lastOffset), rt.shiftRight(subtract(live(offset), live(lastOffset)), 1));
		$0 = live(key);
		if (truthy(rt.sv(f, "associative"))) {
			$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), add(live(base), live(m))));
		} else {
			$1 = rt.index(rt.sv(f, "L"), add(live(base), live(m)));
		}
		if (rt.gt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [$0, $1])), 0)) {
			lastOffset = add(live(m), 1);
		} else {
			offset = live(m);
		}
	}
	return live(offset);
}, true);

// /datum/sortInstance/proc/gallopRight  (code/__HELPERS/sorts/__main.dm:324)  may sleep
rt.def("/datum/sortInstance/proc/gallopRight", function* gallopRight(f: Frame, key: Value, base: Value, len: Value, hint: Value) {
	let offset: Value = null, lastOffset: Value = null, maxOffset: Value = null, temp: Value = null, m: Value = null;
	let $0: any, $1: any;
	f.vars = () => [key, base, len, hint, offset, lastOffset, maxOffset, temp, m, $0, $1];
	offset = 1;
	lastOffset = 0;
	$0 = live(key);
	if (truthy(rt.sv(f, "associative"))) {
		$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), add(live(base), live(hint))));
	} else {
		$1 = rt.index(rt.sv(f, "L"), add(live(base), live(hint)));
	}
	if (rt.lt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [$0, $1])), 0)) {
		maxOffset = add(live(hint), 1);
		while (true) {
			$0 = (rt.lt(live(offset), live(maxOffset)) ? 1 : 0);
			if (truthy($0)) {
				$0 = live(key);
				if (truthy(rt.sv(f, "associative"))) {
					$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), subtract(add(live(base), live(hint)), live(offset))));
				} else {
					$1 = rt.index(rt.sv(f, "L"), subtract(add(live(base), live(hint)), live(offset)));
				}
				$0 = (rt.lt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [$0, $1])), 0) ? 1 : 0);
			}
			if (!truthy($0)) break;
			lastOffset = live(offset);
			offset = add(rt.shiftLeft(live(offset), 1), 1);
		}
		if (rt.gt(live(offset), live(maxOffset))) {
			offset = live(maxOffset);
		}
		temp = live(lastOffset);
		lastOffset = subtract(live(hint), live(offset));
		offset = subtract(live(hint), live(temp));
	} else {
		maxOffset = subtract(live(len), live(hint));
		while (true) {
			$0 = (rt.lt(live(offset), live(maxOffset)) ? 1 : 0);
			if (truthy($0)) {
				$0 = live(key);
				if (truthy(rt.sv(f, "associative"))) {
					$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), add(add(live(base), live(hint)), live(offset))));
				} else {
					$1 = rt.index(rt.sv(f, "L"), add(add(live(base), live(hint)), live(offset)));
				}
				$0 = (rt.ge((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [$0, $1])), 0) ? 1 : 0);
			}
			if (!truthy($0)) break;
			lastOffset = live(offset);
			offset = add(rt.shiftLeft(live(offset), 1), 1);
		}
		if (rt.gt(live(offset), live(maxOffset))) {
			offset = live(maxOffset);
		}
		lastOffset = rt.modify(live(lastOffset), live(hint), add);
		offset = rt.modify(live(offset), live(hint), add);
	}
	lastOffset = rt.inc(live(lastOffset), 1);
	while (rt.lt(live(lastOffset), live(offset))) {
		m = add(live(lastOffset), rt.shiftRight(subtract(live(offset), live(lastOffset)), 1));
		$0 = live(key);
		if (truthy(rt.sv(f, "associative"))) {
			$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), add(live(base), live(m))));
		} else {
			$1 = rt.index(rt.sv(f, "L"), add(live(base), live(m)));
		}
		if (rt.lt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [$0, $1])), 0)) {
			offset = live(m);
		} else {
			lastOffset = add(live(m), 1);
		}
	}
	return live(offset);
}, true);

// /datum/sortInstance/proc/mergeLo  (code/__HELPERS/sorts/__main.dm:374)  may sleep
rt.def("/datum/sortInstance/proc/mergeLo", function* mergeLo(f: Frame, base1: Value, len1: Value, base2: Value, len2: Value) {
	let cursor1: Value = null, cursor2: Value = null, count1: Value = null, count2: Value = null;
	let $0: any, $1: any, $t: any;
	f.vars = () => [base1, len1, base2, len2, cursor1, cursor2, count1, count2, $0, $1, $t];
	cursor1 = live(base1);
	cursor2 = live(base2);
	if (isEqual(live(len2), 1)) {
		yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), live(cursor2), live(cursor1)]);
		return live(f.dot);
	}
	if (isEqual(live(len1), 1)) {
		yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), live(cursor1), add(live(cursor2), live(len2))]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), ($t = live(cursor2), cursor2 = rt.inc($t, 1), $t), ($t = live(cursor1), cursor1 = rt.inc($t, 1), $t)]);
	len2 = rt.inc(live(len2), -1);
	loop28: while (true) {
		count1 = 0;
		count2 = 0;
		while (true) {
			if (truthy(rt.sv(f, "associative"))) {
				$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor2)));
			} else {
				$0 = rt.index(rt.sv(f, "L"), live(cursor2));
			}
			if (truthy(rt.sv(f, "associative"))) {
				$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor1)));
			} else {
				$1 = rt.index(rt.sv(f, "L"), live(cursor1));
			}
			if (rt.lt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [$0, $1])), 0)) {
				yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), ($t = live(cursor2), cursor2 = rt.inc($t, 1), $t), ($t = live(cursor1), cursor1 = rt.inc($t, 1), $t)]);
				len2 = rt.inc(live(len2), -1);
				count2 = rt.inc(live(count2), 1);
				count1 = 0;
				if (isEqual(live(len2), 0)) {
					break loop28;
				}
			} else {
				cursor1 = rt.inc(live(cursor1), 1);
				count1 = rt.inc(live(count1), 1);
				count2 = 0;
				if (isEqual((len1 = rt.inc(live(len1), -1)), 1)) {
					break loop28;
				}
			}
			if (!rt.lt(rt.bitOr(live(count1), live(count2)), rt.sv(f, "minGallop"))) break;
		}
		while (true) {
			if (truthy(rt.sv(f, "associative"))) {
				$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor2)));
			} else {
				$0 = rt.index(rt.sv(f, "L"), live(cursor2));
			}
			if (truthy((count1 = (yield* g.srcCall(f, "gallopRight", $0, live(cursor1), live(len1), 0))))) {
				cursor1 = rt.modify(live(cursor1), live(count1), add);
				(len1 = rt.modify(live(len1), live(count1), subtract));
				if (rt.le(live(len1), 1)) {
					break loop28;
				}
			}
			yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), live(cursor2), live(cursor1)]);
			cursor2 = rt.inc(live(cursor2), 1);
			cursor1 = rt.inc(live(cursor1), 1);
			if (isEqual((len2 = rt.inc(live(len2), -1)), 0)) {
				break loop28;
			}
			if (truthy(rt.sv(f, "associative"))) {
				$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor1)));
			} else {
				$0 = rt.index(rt.sv(f, "L"), live(cursor1));
			}
			if (truthy((count2 = (yield* g.srcCall(f, "gallopLeft", $0, live(cursor2), live(len2), 0))))) {
				yield* g.call(f, P("/proc/moveRange"), null, [rt.sv(f, "L"), live(cursor2), live(cursor1), live(count2)]);
				cursor2 = rt.modify(live(cursor2), live(count2), add);
				cursor1 = rt.modify(live(cursor1), live(count2), add);
				(len2 = rt.modify(live(len2), live(count2), subtract));
				if (isEqual(live(len2), 0)) {
					break loop28;
				}
			}
			cursor1 = rt.inc(live(cursor1), 1);
			if (isEqual((len1 = rt.inc(live(len1), -1)), 1)) {
				break loop28;
			}
			rt.incSrcVar(f, "minGallop", -1, false);
			if (!rt.gt(rt.bitOr(live(count1), live(count2)), 7)) break;
		}
		if (rt.lt(rt.sv(f, "minGallop"), 0)) {
			rt.setSv(f, "minGallop", 0);
		}
		rt.modSrcVar(f, "minGallop", 2, add);
	}
	if (!isEqual(live(len1), 1)) return f.dot;
	yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), live(cursor1), add(live(cursor2), live(len2))]);
	return f.dot;
}, true);

// /datum/sortInstance/proc/mergeHi  (code/__HELPERS/sorts/__main.dm:476)  may sleep
rt.def("/datum/sortInstance/proc/mergeHi", function* mergeHi(f: Frame, base1: Value, len1: Value, base2: Value, len2: Value) {
	let cursor1: Value = null, cursor2: Value = null, count1: Value = null, count2: Value = null;
	let $0: any, $1: any, $t: any;
	f.vars = () => [base1, len1, base2, len2, cursor1, cursor2, count1, count2, $0, $1, $t];
	cursor1 = subtract(add(live(base1), live(len1)), 1);
	cursor2 = subtract(add(live(base2), live(len2)), 1);
	if (isEqual(live(len2), 1)) {
		yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), live(base2), live(base1)]);
		return live(f.dot);
	}
	if (isEqual(live(len1), 1)) {
		yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), live(base1), add(live(cursor2), 1)]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), ($t = live(cursor1), cursor1 = rt.inc($t, -1), $t), add(($t = live(cursor2), cursor2 = rt.inc($t, -1), $t), 1)]);
	len1 = rt.inc(live(len1), -1);
	loop37: while (true) {
		count1 = 0;
		count2 = 0;
		while (true) {
			if (truthy(rt.sv(f, "associative"))) {
				$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor2)));
			} else {
				$0 = rt.index(rt.sv(f, "L"), live(cursor2));
			}
			if (truthy(rt.sv(f, "associative"))) {
				$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor1)));
			} else {
				$1 = rt.index(rt.sv(f, "L"), live(cursor1));
			}
			if (rt.lt((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [$0, $1])), 0)) {
				yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), ($t = live(cursor1), cursor1 = rt.inc($t, -1), $t), add(($t = live(cursor2), cursor2 = rt.inc($t, -1), $t), 1)]);
				len1 = rt.inc(live(len1), -1);
				count1 = rt.inc(live(count1), 1);
				count2 = 0;
				if (isEqual(live(len1), 0)) {
					break loop37;
				}
			} else {
				cursor2 = rt.inc(live(cursor2), -1);
				len2 = rt.inc(live(len2), -1);
				count2 = rt.inc(live(count2), 1);
				count1 = 0;
				if (isEqual(live(len2), 1)) {
					break loop37;
				}
			}
			if (!rt.lt(rt.bitOr(live(count1), live(count2)), rt.sv(f, "minGallop"))) break;
		}
		while (true) {
			$0 = live(len1);
			if (truthy(rt.sv(f, "associative"))) {
				$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor2)));
			} else {
				$1 = rt.index(rt.sv(f, "L"), live(cursor2));
			}
			if (truthy((count1 = subtract($0, (yield* g.srcCall(f, "gallopRight", $1, live(base1), live(len1), subtract(live(len1), 1))))))) {
				(cursor1 = rt.modify(live(cursor1), live(count1), subtract));
				yield* g.call(f, P("/proc/moveRange"), null, [rt.sv(f, "L"), add(live(cursor1), 1), add(live(cursor2), 1), live(count1)]);
				(cursor2 = rt.modify(live(cursor2), live(count1), subtract));
				(len1 = rt.modify(live(len1), live(count1), subtract));
				if (isEqual(live(len1), 0)) {
					break loop37;
				}
			}
			cursor2 = rt.inc(live(cursor2), -1);
			if (isEqual((len2 = rt.inc(live(len2), -1)), 1)) {
				break loop37;
			}
			$0 = live(len2);
			if (truthy(rt.sv(f, "associative"))) {
				$1 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor1)));
			} else {
				$1 = rt.index(rt.sv(f, "L"), live(cursor1));
			}
			if (truthy((count2 = subtract($0, (yield* g.srcCall(f, "gallopLeft", $1, add(live(cursor1), 1), live(len2), subtract(live(len2), 1))))))) {
				(cursor2 = rt.modify(live(cursor2), live(count2), subtract));
				(len2 = rt.modify(live(len2), live(count2), subtract));
				if (rt.le(live(len2), 1)) {
					break loop37;
				}
			}
			yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), ($t = live(cursor1), cursor1 = rt.inc($t, -1), $t), add(($t = live(cursor2), cursor2 = rt.inc($t, -1), $t), 1)]);
			len1 = rt.inc(live(len1), -1);
			if (isEqual(live(len1), 0)) {
				break loop37;
			}
			rt.incSrcVar(f, "minGallop", -1, false);
			if (!rt.gt(rt.bitOr(live(count1), live(count2)), 7)) break;
		}
		if (rt.lt(rt.sv(f, "minGallop"), 0)) {
			rt.setSv(f, "minGallop", 0);
		}
		rt.modSrcVar(f, "minGallop", 2, add);
	}
	if (!isEqual(live(len2), 1)) return f.dot;
	(cursor1 = rt.modify(live(cursor1), live(len1), subtract));
	yield* g.call(f, P("/proc/moveRange"), null, [rt.sv(f, "L"), add(live(cursor1), 1), add(live(cursor2), 1), live(len1)]);
	return f.dot;
}, true);

// /datum/sortInstance/proc/mergeSort  (code/__HELPERS/sorts/__main.dm:574)  may sleep
rt.def("/datum/sortInstance/proc/mergeSort", function* mergeSort(f: Frame, start: Value, end: Value) {
	let remaining: Value = null, minRun: Value = null, runLen: Value = null, n: Value = null;
	let $0: any;
	f.vars = () => [start, end, remaining, minRun, runLen, n, $0];
	if (rt.lt((remaining = subtract(live(end), live(start))), 32)) {
		yield* g.srcCall(f, "binarySort", live(start), live(end), live(start));
		return live(f.dot);
	}
	minRun = (yield* g.srcCall(f, "minRunLength", live(remaining)));
	while (true) {
		if (rt.le(live(remaining), live(minRun))) {
			$0 = live(remaining);
		} else {
			$0 = live(minRun);
		}
		runLen = $0;
		yield* g.srcCall(f, "binarySort", live(start), add(live(start), live(runLen)), live(start));
		yield* g.callName(f, rt.sv(f, "runBases"), "Add", [live(start)]);
		yield* g.callName(f, rt.sv(f, "runLens"), "Add", [live(runLen)]);
		start = rt.modify(live(start), live(runLen), add);
		(remaining = rt.modify(live(remaining), live(runLen), subtract));
		if (!rt.gt(live(remaining), 0)) break;
	}
	while (rt.ge(rt.len(f, rt.sv(f, "runBases")), 2)) {
		if ((rt.gt((n = subtract(rt.len(f, rt.sv(f, "runBases")), 1)), 1) && rt.le(rt.index(rt.sv(f, "runLens"), subtract(live(n), 1)), add(rt.index(rt.sv(f, "runLens"), live(n)), rt.index(rt.sv(f, "runLens"), add(live(n), 1)))))) {
			if (rt.lt(rt.index(rt.sv(f, "runLens"), subtract(live(n), 1)), rt.index(rt.sv(f, "runLens"), add(live(n), 1)))) {
				n = rt.inc(live(n), -1);
			}
			yield* g.srcCall(f, "mergeAt2", live(n));
		} else {
			if (rt.le(rt.index(rt.sv(f, "runLens"), live(n)), rt.index(rt.sv(f, "runLens"), add(live(n), 1)))) {
				yield* g.srcCall(f, "mergeAt2", live(n));
			} else {
				break;
			}
		}
	}
	while (rt.ge(rt.len(f, rt.sv(f, "runBases")), 2)) {
		if ((rt.gt((n = subtract(rt.len(f, rt.sv(f, "runBases")), 1)), 1) && rt.lt(rt.index(rt.sv(f, "runLens"), subtract(live(n), 1)), rt.index(rt.sv(f, "runLens"), add(live(n), 1))))) {
			n = rt.inc(live(n), -1);
		}
		yield* g.srcCall(f, "mergeAt2", live(n));
	}
	return rt.sv(f, "L");
}, true);

// /datum/sortInstance/proc/mergeAt2  (code/__HELPERS/sorts/__main.dm:619)  may sleep
rt.def("/datum/sortInstance/proc/mergeAt2", function* mergeAt2(f: Frame, i: Value) {
	let cursor1: Value = null, cursor2: Value = null, end1: Value = null, end2: Value = null, val1: Value = null, val2: Value = null;
	let $0: any;
	f.vars = () => [i, cursor1, cursor2, end1, end2, val1, val2, $0];
	cursor1 = rt.index(rt.sv(f, "runBases"), live(i));
	cursor2 = rt.index(rt.sv(f, "runBases"), add(live(i), 1));
	end1 = add(live(cursor1), rt.index(rt.sv(f, "runLens"), live(i)));
	end2 = add(live(cursor2), rt.index(rt.sv(f, "runLens"), add(live(i), 1)));
	if (truthy(rt.sv(f, "associative"))) {
		$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor1)));
	} else {
		$0 = rt.index(rt.sv(f, "L"), live(cursor1));
	}
	val1 = $0;
	if (truthy(rt.sv(f, "associative"))) {
		$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor2)));
	} else {
		$0 = rt.index(rt.sv(f, "L"), live(cursor2));
	}
	val2 = $0;
	while (true) {
		if (rt.le((yield* g.callDyn(f, rt.sv(f, "cmp"), undefined, [live(val1), live(val2)])), 0)) {
			if (rt.ge((cursor1 = rt.inc(live(cursor1), 1)), live(end1))) {
				break;
			}
			if (truthy(rt.sv(f, "associative"))) {
				$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor1)));
			} else {
				$0 = rt.index(rt.sv(f, "L"), live(cursor1));
			}
			val1 = $0;
		} else {
			yield* g.call(f, P("/proc/moveElement"), null, [rt.sv(f, "L"), live(cursor2), live(cursor1)]);
			if (rt.ge((cursor2 = rt.inc(live(cursor2), 1)), live(end2))) {
				break;
			}
			end1 = rt.inc(live(end1), 1);
			cursor1 = rt.inc(live(cursor1), 1);
			if (truthy(rt.sv(f, "associative"))) {
				$0 = rt.index(rt.sv(f, "L"), rt.index(rt.sv(f, "L"), live(cursor2)));
			} else {
				$0 = rt.index(rt.sv(f, "L"), live(cursor2));
			}
			val2 = $0;
		}
	}
	rt.modAt(rt.sv(f, "runLens"), live(i), rt.index(rt.sv(f, "runLens"), add(live(i), 1)), add);
	yield* g.callName(f, rt.sv(f, "runLens"), "Cut", [add(live(i), 1), add(live(i), 2)]);
	yield* g.callName(f, rt.sv(f, "runBases"), "Cut", [add(live(i), 1), add(live(i), 2)]);
	return f.dot;
}, true);
