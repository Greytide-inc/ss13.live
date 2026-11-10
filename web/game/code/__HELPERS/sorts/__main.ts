// Based on /tg/station's code/__HELPERS/sorts/__main.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add } = rt;


// __main.dm:12
rt.def("/datum/controller/global_vars/proc/InitGlobalsortInstance", function InitGlobalsortInstance(f: Frame) {
	GLOB.sortInstance = new_(T("/datum/sortInstance"));
	this.gvars_datum_init_order += "sortInstance";
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

// __main.dm:31
rt.def("/datum/sortInstance/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.runBases = list();

	this.runLens = list();
	return f.dot;
});

// __main.dm:36
rt.def("/datum/sortInstance/proc/timSort", function* timSort(f: Frame, start: Value, end: Value) {
	let remaining: Value = null, initRunLen: Value = null, runLen: Value = null, force: Value = null;
	this.runBases.Cut();
	this.runLens.Cut();
	if ((remaining = end - start) < MIN_MERGE) {
		initRunLen = (yield* this.countRunAndMakeAscending(start, end));
		yield* this.binarySort(start, end, start + initRunLen);
		return f.dot;
	}
	let minRun: Value = this.minRunLength(remaining);
	while (true) {
		if ((runLen = (yield* this.countRunAndMakeAscending(start, end))) < minRun) {
			force = remaining <= minRun ? remaining : minRun;
			yield* this.binarySort(start, start + force, start + runLen);
			runLen = force;
		}
		this.runBases.Add(start);
		this.runLens.Add(runLen);
		yield* this.mergeCollapse();
		start += runLen;
		remaining -= runLen;
		if (!(remaining > 0)) break;
	}
	yield* this.mergeForceCollapse();
	this.minGallop = MIN_GALLOP;
	return this.L;
}, true);

// __main.dm:102
rt.def("/datum/sortInstance/proc/binarySort", function* binarySort(f: Frame, lo: Value, hi: Value, start: Value) {
	let pivot: Value = null, left: Value = null, right: Value = null, mid: Value = null;
	let $0: any;
	if (start <= lo) {
		start = lo + 1;
	}
	while (start < hi) {
		if (this.associative) {
			$0 = rt.index(this.L, rt.index(this.L, start));
		} else {
			$0 = rt.index(this.L, start);
		}
		pivot = $0;
		left = lo;
		right = start;
		while (left < right) {
			mid = rt.shiftRight(left + right, 1);
			if (this.associative) {
				$0 = rt.index(this.L, rt.index(this.L, mid));
			} else {
				$0 = rt.index(this.L, mid);
			}
			if ((yield* g.callDyn(f, this.cmp, undefined, [$0, pivot])) > 0) {
				right = mid;
			} else {
				left = mid + 1;
			}
		}
		moveElement(this.L, start, left);
		start++;
	}
	return f.dot;
}, true);

// __main.dm:140
rt.def("/datum/sortInstance/proc/countRunAndMakeAscending", function* countRunAndMakeAscending(f: Frame, lo: Value, hi: Value) {
	let runHi: Value = null, current: Value = null;
	let $0: any, $t: any;
	if ((runHi = lo + 1) >= hi) {
		return 1;
	}
	if (this.associative) {
		$0 = rt.index(this.L, rt.index(this.L, lo));
	} else {
		$0 = rt.index(this.L, lo);
	}
	let last: Value = $0;
	if (this.associative) {
		$0 = rt.index(this.L, rt.index(this.L, ($t = runHi, runHi = rt.inc($t, 1), $t)));
	} else {
		$0 = rt.index(this.L, ($t = runHi, runHi = rt.inc($t, 1), $t));
	}
	if ((yield* g.callDyn(f, this.cmp, undefined, [(current = $0), last])) < 0) {
		while (runHi < hi) {
			last = current;
			if (this.associative) {
				$0 = rt.index(this.L, rt.index(this.L, runHi));
			} else {
				$0 = rt.index(this.L, runHi);
			}
			if ((yield* g.callDyn(f, this.cmp, undefined, [(current = $0), last])) >= 0) {
				break;
			}
			runHi++;
		}
		reverseRange(this.L, lo, runHi);
	} else {
		while (runHi < hi) {
			last = current;
			if (this.associative) {
				$0 = rt.index(this.L, rt.index(this.L, runHi));
			} else {
				$0 = rt.index(this.L, runHi);
			}
			if ((yield* g.callDyn(f, this.cmp, undefined, [(current = $0), last])) < 0) {
				break;
			}
			runHi++;
		}
	}
	return runHi - lo;
}, true);

// __main.dm:170
rt.def("/datum/sortInstance/proc/minRunLength", function minRunLength(f: Frame, n: Value) {
	let r: Value = 0;
	while (n >= MIN_MERGE) {
		(r = rt.modify(r, rt.bitAnd(n, 1), rt.bitOr));
		(n = rt.modify(n, 1, rt.shiftRight));
	}
	return n + r;
});

// __main.dm:181
rt.def("/datum/sortInstance/proc/mergeCollapse", function* mergeCollapse(f: Frame) {
	let n: Value = null;
	while (rt.len(f, this.runBases) >= 2) {
		if ((n = rt.len(f, this.runBases) - 1) > 1 && rt.index(this.runLens, n - 1) <= rt.index(this.runLens, n) + rt.index(this.runLens, n + 1)) {
			if (rt.index(this.runLens, n - 1) < rt.index(this.runLens, n + 1)) {
				n--;
			}
			yield* this.mergeAt(n);
		} else if (rt.index(this.runLens, n) <= rt.index(this.runLens, n + 1)) {
			yield* this.mergeAt(n);
		} else {
			break;
		}
	}
	return f.dot;
}, true);

// __main.dm:196
rt.def("/datum/sortInstance/proc/mergeForceCollapse", function* mergeForceCollapse(f: Frame) {
	let n: Value = null;
	while (rt.len(f, this.runBases) >= 2) {
		if ((n = rt.len(f, this.runBases) - 1) > 1 && rt.index(this.runLens, n - 1) < rt.index(this.runLens, n + 1)) {
			n--;
		}
		yield* this.mergeAt(n);
	}
	return f.dot;
}, true);

// __main.dm:211
rt.def("/datum/sortInstance/proc/mergeAt", function* mergeAt(f: Frame, i: Value) {
	let k: Value = null;
	let $0: any;
	let base1: Value = rt.index(this.runBases, i);
	let base2: Value = rt.index(this.runBases, i + 1);
	let len1: Value = rt.index(this.runLens, i);
	let len2: Value = rt.index(this.runLens, i + 1);
	rt.modAt(this.runLens, i, rt.index(this.runLens, i + 1), add);
	this.runLens.Cut(i + 1, i + 2);
	this.runBases.Cut(i + 1, i + 2);
	if (this.associative) {
		$0 = rt.index(this.L, rt.index(this.L, base2));
	} else {
		$0 = rt.index(this.L, base2);
	}
	base1 += (k = (yield* this.gallopRight($0, base1, len1, 0)));
	len1 -= k;
	if (len1 == 0) {
		return f.dot;
	}
	if (this.associative) {
		$0 = rt.index(this.L, rt.index(this.L, base1 + len1 - 1));
	} else {
		$0 = rt.index(this.L, base1 + len1 - 1);
	}
	if ((len2 = (yield* this.gallopLeft($0, base2, len2, len2 - 1))) == 0) {
		return f.dot;
	}
	if (len1 <= len2) {
		yield* this.mergeLo(base1, len1, base2, len2);
	} else {
		yield* this.mergeHi(base1, len1, base2, len2);
	}
	return f.dot;
}, true);

// __main.dm:265
rt.def("/datum/sortInstance/proc/gallopLeft", function* gallopLeft(f: Frame, key: Value, base: Value, len: Value, hint: Value) {
	let maxOffset: Value = null, temp: Value = null, m: Value = null;
	let $1: any;
	let lastOffset: Value = 0;
	let offset: Value = 1;
	let $0: any = key;
	if (this.associative) {
		$1 = rt.index(this.L, rt.index(this.L, base + hint));
	} else {
		$1 = rt.index(this.L, base + hint);
	}
	if ((yield* g.callDyn(f, this.cmp, undefined, [$0, $1])) > 0) {
		maxOffset = len - hint;
		while (true) {
			$0 = (offset < maxOffset ? 1 : 0);
			if ($0) {
				$0 = key;
				if (this.associative) {
					$1 = rt.index(this.L, rt.index(this.L, base + hint + offset));
				} else {
					$1 = rt.index(this.L, base + hint + offset);
				}
				$0 = ((yield* g.callDyn(f, this.cmp, undefined, [$0, $1])) > 0 ? 1 : 0);
			}
			if (!$0) break;
			lastOffset = offset;
			offset = rt.shiftLeft(offset, 1) + 1;
		}
		if (offset > maxOffset) {
			offset = maxOffset;
		}
		lastOffset += hint;
		offset += hint;
	} else {
		maxOffset = hint + 1;
		while (true) {
			$0 = (offset < maxOffset ? 1 : 0);
			if ($0) {
				$0 = key;
				if (this.associative) {
					$1 = rt.index(this.L, rt.index(this.L, base + hint - offset));
				} else {
					$1 = rt.index(this.L, base + hint - offset);
				}
				$0 = ((yield* g.callDyn(f, this.cmp, undefined, [$0, $1])) <= 0 ? 1 : 0);
			}
			if (!$0) break;
			lastOffset = offset;
			offset = rt.shiftLeft(offset, 1) + 1;
		}
		if (offset > maxOffset) {
			offset = maxOffset;
		}
		temp = lastOffset;
		lastOffset = hint - offset;
		offset = hint - temp;
	}
	lastOffset++;
	while (lastOffset < offset) {
		m = lastOffset + rt.shiftRight(offset - lastOffset, 1);
		$0 = key;
		if (this.associative) {
			$1 = rt.index(this.L, rt.index(this.L, base + m));
		} else {
			$1 = rt.index(this.L, base + m);
		}
		if ((yield* g.callDyn(f, this.cmp, undefined, [$0, $1])) > 0) {
			lastOffset = m + 1;
		} else {
			offset = m;
		}
	}
	return offset;
}, true);

// __main.dm:324
rt.def("/datum/sortInstance/proc/gallopRight", function* gallopRight(f: Frame, key: Value, base: Value, len: Value, hint: Value) {
	let maxOffset: Value = null, temp: Value = null, m: Value = null;
	let $1: any;
	let offset: Value = 1;
	let lastOffset: Value = 0;
	let $0: any = key;
	if (this.associative) {
		$1 = rt.index(this.L, rt.index(this.L, base + hint));
	} else {
		$1 = rt.index(this.L, base + hint);
	}
	if ((yield* g.callDyn(f, this.cmp, undefined, [$0, $1])) < 0) {
		maxOffset = hint + 1;
		while (true) {
			$0 = (offset < maxOffset ? 1 : 0);
			if ($0) {
				$0 = key;
				if (this.associative) {
					$1 = rt.index(this.L, rt.index(this.L, base + hint - offset));
				} else {
					$1 = rt.index(this.L, base + hint - offset);
				}
				$0 = ((yield* g.callDyn(f, this.cmp, undefined, [$0, $1])) < 0 ? 1 : 0);
			}
			if (!$0) break;
			lastOffset = offset;
			offset = rt.shiftLeft(offset, 1) + 1;
		}
		if (offset > maxOffset) {
			offset = maxOffset;
		}
		temp = lastOffset;
		lastOffset = hint - offset;
		offset = hint - temp;
	} else {
		maxOffset = len - hint;
		while (true) {
			$0 = (offset < maxOffset ? 1 : 0);
			if ($0) {
				$0 = key;
				if (this.associative) {
					$1 = rt.index(this.L, rt.index(this.L, base + hint + offset));
				} else {
					$1 = rt.index(this.L, base + hint + offset);
				}
				$0 = ((yield* g.callDyn(f, this.cmp, undefined, [$0, $1])) >= 0 ? 1 : 0);
			}
			if (!$0) break;
			lastOffset = offset;
			offset = rt.shiftLeft(offset, 1) + 1;
		}
		if (offset > maxOffset) {
			offset = maxOffset;
		}
		lastOffset += hint;
		offset += hint;
	}
	lastOffset++;
	while (lastOffset < offset) {
		m = lastOffset + rt.shiftRight(offset - lastOffset, 1);
		$0 = key;
		if (this.associative) {
			$1 = rt.index(this.L, rt.index(this.L, base + m));
		} else {
			$1 = rt.index(this.L, base + m);
		}
		if ((yield* g.callDyn(f, this.cmp, undefined, [$0, $1])) < 0) {
			offset = m;
		} else {
			lastOffset = m + 1;
		}
	}
	return offset;
}, true);

// __main.dm:374
rt.def("/datum/sortInstance/proc/mergeLo", function* mergeLo(f: Frame, base1: Value, len1: Value, base2: Value, len2: Value) {
	let count1: Value = null, count2: Value = null;
	let $0: any, $1: any, $t: any;
	let cursor1: Value = base1;
	let cursor2: Value = base2;
	if (len2 == 1) {
		moveElement(this.L, cursor2, cursor1);
		return f.dot;
	}
	if (len1 == 1) {
		moveElement(this.L, cursor1, cursor2 + len2);
		return f.dot;
	}
	moveElement(this.L, ($t = cursor2, cursor2 = rt.inc($t, 1), $t), ($t = cursor1, cursor1 = rt.inc($t, 1), $t));
	len2--;
	loop28: while (true) {
		count1 = 0;
		count2 = 0;
		while (true) {
			if (this.associative) {
				$0 = rt.index(this.L, rt.index(this.L, cursor2));
			} else {
				$0 = rt.index(this.L, cursor2);
			}
			if (this.associative) {
				$1 = rt.index(this.L, rt.index(this.L, cursor1));
			} else {
				$1 = rt.index(this.L, cursor1);
			}
			if ((yield* g.callDyn(f, this.cmp, undefined, [$0, $1])) < 0) {
				moveElement(this.L, ($t = cursor2, cursor2 = rt.inc($t, 1), $t), ($t = cursor1, cursor1 = rt.inc($t, 1), $t));
				len2--;
				count2++;
				count1 = 0;
				if (len2 == 0) {
					break loop28;
				}
			} else {
				cursor1++;
				count1++;
				count2 = 0;
				if (--len1 == 1) {
					break loop28;
				}
			}
			if (!(rt.bitOr(count1, count2) < this.minGallop)) break;
		}
		while (true) {
			if (this.associative) {
				$0 = rt.index(this.L, rt.index(this.L, cursor2));
			} else {
				$0 = rt.index(this.L, cursor2);
			}
			if (count1 = (yield* this.gallopRight($0, cursor1, len1, 0))) {
				cursor1 += count1;
				len1 -= count1;
				if (len1 <= 1) {
					break loop28;
				}
			}
			moveElement(this.L, cursor2, cursor1);
			cursor2++;
			cursor1++;
			if (--len2 == 0) {
				break loop28;
			}
			if (this.associative) {
				$0 = rt.index(this.L, rt.index(this.L, cursor1));
			} else {
				$0 = rt.index(this.L, cursor1);
			}
			if (count2 = (yield* this.gallopLeft($0, cursor2, len2, 0))) {
				moveRange(this.L, cursor2, cursor1, count2);
				cursor2 += count2;
				cursor1 += count2;
				len2 -= count2;
				if (len2 == 0) {
					break loop28;
				}
			}
			cursor1++;
			if (--len1 == 1) {
				break loop28;
			}
			--this.minGallop;
			if (!(rt.bitOr(count1, count2) > MIN_GALLOP)) break;
		}
		if (this.minGallop < 0) {
			this.minGallop = 0;
		}
		this.minGallop += 2;
	}
	if (len1 != 1) return f.dot;
	moveElement(this.L, cursor1, cursor2 + len2);
	return f.dot;
}, true);

// __main.dm:476
rt.def("/datum/sortInstance/proc/mergeHi", function* mergeHi(f: Frame, base1: Value, len1: Value, base2: Value, len2: Value) {
	let count1: Value = null, count2: Value = null;
	let $0: any, $1: any, $t: any;
	let cursor1: Value = base1 + len1 - 1;
	let cursor2: Value = base2 + len2 - 1;
	if (len2 == 1) {
		moveElement(this.L, base2, base1);
		return f.dot;
	}
	if (len1 == 1) {
		moveElement(this.L, base1, cursor2 + 1);
		return f.dot;
	}
	moveElement(this.L, ($t = cursor1, cursor1 = rt.inc($t, -1), $t), ($t = cursor2, cursor2 = rt.inc($t, -1), $t) + 1);
	len1--;
	loop37: while (true) {
		count1 = 0;
		count2 = 0;
		while (true) {
			if (this.associative) {
				$0 = rt.index(this.L, rt.index(this.L, cursor2));
			} else {
				$0 = rt.index(this.L, cursor2);
			}
			if (this.associative) {
				$1 = rt.index(this.L, rt.index(this.L, cursor1));
			} else {
				$1 = rt.index(this.L, cursor1);
			}
			if ((yield* g.callDyn(f, this.cmp, undefined, [$0, $1])) < 0) {
				moveElement(this.L, ($t = cursor1, cursor1 = rt.inc($t, -1), $t), ($t = cursor2, cursor2 = rt.inc($t, -1), $t) + 1);
				len1--;
				count1++;
				count2 = 0;
				if (len1 == 0) {
					break loop37;
				}
			} else {
				cursor2--;
				len2--;
				count2++;
				count1 = 0;
				if (len2 == 1) {
					break loop37;
				}
			}
			if (!(rt.bitOr(count1, count2) < this.minGallop)) break;
		}
		while (true) {
			$0 = len1;
			if (this.associative) {
				$1 = rt.index(this.L, rt.index(this.L, cursor2));
			} else {
				$1 = rt.index(this.L, cursor2);
			}
			if (count1 = $0 - (yield* this.gallopRight($1, base1, len1, len1 - 1))) {
				cursor1 -= count1;
				moveRange(this.L, cursor1 + 1, cursor2 + 1, count1);
				cursor2 -= count1;
				len1 -= count1;
				if (len1 == 0) {
					break loop37;
				}
			}
			cursor2--;
			if (--len2 == 1) {
				break loop37;
			}
			$0 = len2;
			if (this.associative) {
				$1 = rt.index(this.L, rt.index(this.L, cursor1));
			} else {
				$1 = rt.index(this.L, cursor1);
			}
			if (count2 = $0 - (yield* this.gallopLeft($1, cursor1 + 1, len2, len2 - 1))) {
				cursor2 -= count2;
				len2 -= count2;
				if (len2 <= 1) {
					break loop37;
				}
			}
			moveElement(this.L, ($t = cursor1, cursor1 = rt.inc($t, -1), $t), ($t = cursor2, cursor2 = rt.inc($t, -1), $t) + 1);
			len1--;
			if (len1 == 0) {
				break loop37;
			}
			--this.minGallop;
			if (!(rt.bitOr(count1, count2) > MIN_GALLOP)) break;
		}
		if (this.minGallop < 0) {
			this.minGallop = 0;
		}
		this.minGallop += 2;
	}
	if (len2 != 1) return f.dot;
	cursor1 -= len1;
	moveRange(this.L, cursor1 + 1, cursor2 + 1, len1);
	return f.dot;
}, true);
