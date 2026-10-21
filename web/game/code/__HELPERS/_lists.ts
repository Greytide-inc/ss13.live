// From code/__HELPERS/_lists.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/english_list  (code/__HELPERS/_lists.dm:15)
rt.def("/proc/english_list", function english_list(f: Frame, input: Value, nothing_text: Value, and_text: Value, comma_text: Value, final_comma_text: Value) {
	let total: Value = null, output: Value = null, index: Value = null;
	f.vars = () => [nothing_text, and_text, comma_text, final_comma_text, total, output, index];
	if (live(nothing_text) === null) {
		nothing_text = "nothing";
	}
	if (live(and_text) === null) {
		and_text = " and ";
	}
	if (live(comma_text) === null) {
		comma_text = ", ";
	}
	if (live(final_comma_text) === null) {
		final_comma_text = "";
	}
	if (!truthy((total = rt.len(f, live(input))))) {
		return fmt("＀", [live(nothing_text)]);
	}
	if (isEqual(live(total), 1)) {
		return fmt("＀", [rt.index(live(input), 1)]);
	}
	if (isEqual(live(total), 2)) {
		return fmt("＀＀＀", [rt.index(live(input), 1), live(and_text), rt.index(live(input), 2)]);
	}
	output = "";
	index = 1;
	while (rt.lt(live(index), live(total))) {
		if (isEqual(live(index), subtract(live(total), 1))) {
			comma_text = live(final_comma_text);
		}
		output = rt.modify(live(output), fmt("＀＀", [rt.index(live(input), live(index)), live(comma_text)]), add);
		index = rt.inc(live(index), 1);
	}
	return fmt("＀＀＀", [live(output), live(and_text), rt.index(live(input), live(index))]);
});

// /proc/listgetindex  (code/__HELPERS/_lists.dm:35)
rt.def("/proc/listgetindex", function listgetindex(f: Frame, L: Value, index: Value) {
	if (truthy((rt.istype(live(L), T("/list")) ? 1 : 0))) {
		if ((truthy(rt.call(f, P("/proc/isnum"), null, [live(index)])) && truthy(rt.call(f, P("/proc/IsInteger"), null, [live(index)])))) {
			if (truthy(rt.call(f, P("/proc/IsInRange"), null, [live(index), 1, rt.len(f, live(L))]))) {
				return rt.index(live(L), live(index));
			}
		} else {
			if (truthy((rt.isIn(f, live(index), live(L)) ? 1 : 0))) {
				return rt.index(live(L), live(index));
			}
		}
	}
	return live(f.dot);
});

// /proc/safepick  (code/__HELPERS/_lists.dm:45)
rt.def("/proc/safepick", function safepick(f: Frame, L: Value) {
	if (!(truthy((rt.istype(live(L), T("/list")) ? 1 : 0)) && truthy(rt.len(f, live(L))))) return f.dot;
	return rt.op(f, "PickUnweighted", [1], [live(L)]);
});

// /proc/isemptylist  (code/__HELPERS/_lists.dm:50)
rt.def("/proc/isemptylist", function isemptylist(f: Frame, L: Value) {
	if (!truthy(rt.len(f, live(L)))) {
		return 1;
	}
	return 0;
});

// /proc/is_type_in_list  (code/__HELPERS/_lists.dm:56)
rt.def("/proc/is_type_in_list", function is_type_in_list(f: Frame, A: Value, L: Value) {
	let type: Value = null;
	let $e: any;
	f.vars = () => [type, $e];
	if (((!truthy(live(L)) || !truthy(rt.len(f, live(L)))) || !truthy(live(A)))) {
		return 0;
	}
	type = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		type = $e;
		if (truthy(rt.op(f, "IsType", [], [live(A), live(type)]))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /proc/is_type_in_typecache  (code/__HELPERS/_lists.dm:65)
rt.def("/proc/is_type_in_typecache", function is_type_in_typecache(f: Frame, A: Value, L: Value) {
	if (((!truthy(live(L)) || !truthy(rt.len(f, live(L)))) || !truthy(live(A)))) {
		return 0;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(A)]))) {
		f.dot = rt.index(live(L), live(A));
	} else {
		f.dot = rt.index(live(L), rt.fv(f, "type", live(A)));
	}
	return f.dot;
});

// /proc/is_string_in_list  (code/__HELPERS/_lists.dm:75)
rt.def("/proc/is_string_in_list", function is_string_in_list(f: Frame, string: Value, L: Value) {
	let V: Value = null;
	let $e: any;
	f.vars = () => [V, $e];
	if (((!truthy(live(L)) || !truthy(rt.len(f, live(L)))) || !truthy(live(string)))) {
		return live(f.dot);
	}
	V = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (isEqual(live(string), live(V))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /proc/remove_strings_from_list  (code/__HELPERS/_lists.dm:84)
rt.def("/proc/remove_strings_from_list", function remove_strings_from_list(f: Frame, string: Value, L: Value) {
	let V: Value = null;
	let $e: any;
	f.vars = () => [L, V, $e];
	if (((!truthy(live(L)) || !truthy(rt.len(f, live(L)))) || !truthy(live(string)))) {
		return live(f.dot);
	}
	V = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (isEqual(live(V), live(string))) {
			(L = rt.modify(live(L), live(V), subtract));
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /proc/typecache_filter_list  (code/__HELPERS/_lists.dm:93)
rt.def("/proc/typecache_filter_list", function typecache_filter_list(f: Frame, atoms: Value, typecache: Value) {
	let thing: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [thing, A, $e];
	f.dot = rt.list();
	thing = null;
	rt.forList(f, 0, live(atoms));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		A = live(thing);
		if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(A))))) {
			f.dot = rt.modify(live(f.dot), live(A), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/typecacheof  (code/__HELPERS/_lists.dm:101)
rt.def("/proc/typecacheof", function typecacheof(f: Frame, path: Value, ignore_root_path: Value, only_root_path: Value) {
	let types: Value = null, L: Value = null, _T: Value = null, pathlist: Value = null, _P: Value = null, _T_3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [only_root_path, types, L, _T, pathlist, _P, _T_3, $0, $e];
	if (live(only_root_path) === null) {
		only_root_path = 0;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(path)]))) {
		types = rt.list();
		if (truthy(live(only_root_path))) {
			types = rt.list(live(path));
		} else {
			if (truthy(live(ignore_root_path))) {
				$0 = subtract(rt.call(f, P("/proc/typesof"), null, [live(path)]), live(path));
			} else {
				$0 = rt.call(f, P("/proc/typesof"), null, [live(path)]);
			}
			types = $0;
		}
		L = rt.list();
		_T = null;
		rt.forList(f, 0, live(types));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			rt.setAt(live(L), live(_T), 1);
		}
		rt.endFor(f, 0);
		return live(L);
	} else {
		if (!truthy((rt.istype(live(path), T("/list")) ? 1 : 0))) return f.dot;
		pathlist = live(path);
		L = rt.list();
		if (truthy(live(ignore_root_path))) {
			_P = null;
			rt.forList(f, 0, live(pathlist));
			while (($e = rt.next(f, 0)) !== undefined) {
				_P = $e;
				_T_3 = null;
				rt.forList(f, 1, subtract(rt.call(f, P("/proc/typesof"), null, [live(_P)]), live(_P)));
				while (($e = rt.next(f, 1)) !== undefined) {
					_T_3 = $e;
					rt.setAt(live(L), live(_T_3), 1);
				}
				rt.endFor(f, 1);
			}
			rt.endFor(f, 0);
		} else {
			_P = null;
			rt.forList(f, 0, live(pathlist));
			while (($e = rt.next(f, 0)) !== undefined) {
				_P = $e;
				if (truthy(live(only_root_path))) {
					rt.setAt(live(L), live(_P), 1);
				} else {
					_T_3 = null;
					rt.forList(f, 1, rt.call(f, P("/proc/typesof"), null, [live(_P)]));
					while (($e = rt.next(f, 1)) !== undefined) {
						_T_3 = $e;
						rt.setAt(live(L), live(_T_3), 1);
					}
					rt.endFor(f, 1);
				}
			}
			rt.endFor(f, 0);
		}
		return live(L);
	}
	return f.dot;
});

// /proc/clearlist  (code/__HELPERS/_lists.dm:129)
rt.def("/proc/clearlist", function clearlist(f: Frame, list: Value) {
	if (truthy((rt.istype(live(list), T("/list")) ? 1 : 0))) {
		rt.setFv(f, "len", live(list), 0);
	}
	return live(f.dot);
});

// /proc/listclearnulls  (code/__HELPERS/_lists.dm:137)
rt.def("/proc/listclearnulls", function listclearnulls(f: Frame, L: Value) {
	let start_len: Value = null, N: Value = null;
	f.vars = () => [L, start_len, N];
	start_len = rt.len(f, live(L));
	(L = rt.modify(live(L), (N = rt.new_(f, T("/list"), [live(start_len)])), subtract));
	return (rt.lt(rt.len(f, live(L)), live(start_len)) ? 1 : 0);
});

// /proc/difflist  (code/__HELPERS/_lists.dm:147)
rt.def("/proc/difflist", function difflist(f: Frame, first: Value, second: Value, skiprep: Value) {
	let result: Value = null, e: Value = null;
	let $e: any;
	f.vars = () => [skiprep, result, e, $e];
	if (live(skiprep) === null) {
		skiprep = 0;
	}
	if ((!truthy((rt.istype(live(first), T("/list")) ? 1 : 0)) || !truthy((rt.istype(live(second), T("/list")) ? 1 : 0)))) {
		return live(f.dot);
	}
	result = rt.new_(f, T("/list"), []);
	if (truthy(live(skiprep))) {
		e = null;
		rt.forList(f, 0, live(first));
		while (($e = rt.next(f, 0)) !== undefined) {
			e = $e;
			if ((!truthy((rt.isIn(f, live(e), live(result)) ? 1 : 0)) && !truthy((rt.isIn(f, live(e), live(second)) ? 1 : 0)))) {
				result = rt.modify(live(result), live(e), add);
			}
		}
		rt.endFor(f, 0);
	} else {
		result = subtract(live(first), live(second));
	}
	return live(result);
});

// /proc/uniquemergelist  (code/__HELPERS/_lists.dm:164)
rt.def("/proc/uniquemergelist", function uniquemergelist(f: Frame, first: Value, second: Value, skiprep: Value) {
	let result: Value = null;
	f.vars = () => [skiprep, result];
	if (live(skiprep) === null) {
		skiprep = 0;
	}
	if ((!truthy((rt.istype(live(first), T("/list")) ? 1 : 0)) || !truthy((rt.istype(live(second), T("/list")) ? 1 : 0)))) {
		return live(f.dot);
	}
	result = rt.new_(f, T("/list"), []);
	if (truthy(live(skiprep))) {
		result = add(rt.call(f, P("/proc/difflist"), null, [live(first), live(second), live(skiprep)]), rt.call(f, P("/proc/difflist"), null, [live(second), live(first), live(skiprep)]));
	} else {
		result = rt.bitXor(live(first), live(second));
	}
	return live(result);
});

// /proc/pickweight  (code/__HELPERS/_lists.dm:177)
rt.def("/proc/pickweight", function pickweight(f: Frame, L: Value) {
	let total: Value = null, item: Value = null;
	let $e: any;
	f.vars = () => [total, item, $e];
	total = 0;
	item = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		if (!truthy(rt.index(live(L), live(item)))) {
			rt.setAt(live(L), live(item), 1);
		}
		total = rt.modify(live(total), rt.index(live(L), live(item)), add);
	}
	rt.endFor(f, 0);
	total = rt.call(f, P("/proc/rand"), null, [1, live(total)]);
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		(total = rt.modify(live(total), rt.index(live(L), live(item)), subtract));
		if (rt.le(live(total), 0)) {
			return live(item);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /proc/pick_n_take  (code/__HELPERS/_lists.dm:192)
rt.def("/proc/pick_n_take", function pick_n_take(f: Frame, L: Value) {
	let picked: Value = null;
	f.vars = () => [picked];
	if (!truthy(rt.len(f, live(L)))) return f.dot;
	picked = rt.call(f, P("/proc/rand"), null, [1, rt.len(f, live(L))]);
	f.dot = rt.index(live(L), live(picked));
	rt.callName(f, live(L), "Cut", [live(picked), add(live(picked), 1)]);
	return f.dot;
});

// /proc/pop  (code/__HELPERS/_lists.dm:199)
rt.def("/proc/pop", function pop(f: Frame, L: Value) {
	if (!truthy(rt.len(f, live(L)))) return f.dot;
	f.dot = rt.index(live(L), rt.len(f, live(L)));
	rt.incField(f, live(L), "len", -1, true);
	return f.dot;
});

// /proc/popleft  (code/__HELPERS/_lists.dm:204)
rt.def("/proc/popleft", function popleft(f: Frame, L: Value) {
	if (!truthy(rt.len(f, live(L)))) return f.dot;
	f.dot = rt.index(live(L), 1);
	rt.callName(f, live(L), "Cut", [1, 2]);
	return f.dot;
});

// /proc/sorted_insert  (code/__HELPERS/_lists.dm:210)  may sleep
rt.def("/proc/sorted_insert", function* sorted_insert(f: Frame, L: Value, thing: Value, comparator: Value) {
	let pos: Value = null;
	f.vars = () => [L, thing, comparator, pos];
	pos = rt.len(f, live(L));
	while (rt.gt(live(pos), 0) && rt.gt((yield* g.callDyn(f, live(comparator), undefined, [live(thing), rt.index(live(L), live(pos))])), 0)) {
		pos = rt.inc(live(pos), -1);
	}
	yield* g.callName(f, live(L), "Insert", [add(live(pos), 1), live(thing)]);
	return f.dot;
}, true);

// /proc/next_list_item  (code/__HELPERS/_lists.dm:217)
rt.def("/proc/next_list_item", function next_list_item(f: Frame, item: Value, L: Value) {
	let i: Value = null;
	f.vars = () => [i];
	i = null;
	if (isEqual((i = rt.callName(f, live(L), "Find", [live(item)])), rt.len(f, live(L)))) {
		i = 1;
	} else {
		i = rt.inc(live(i), 1);
	}
	return rt.index(live(L), live(i));
});

// /proc/previous_list_item  (code/__HELPERS/_lists.dm:227)
rt.def("/proc/previous_list_item", function previous_list_item(f: Frame, item: Value, L: Value) {
	let i: Value = null;
	f.vars = () => [i];
	i = null;
	if (isEqual((i = rt.callName(f, live(L), "Find", [live(item)])), 1)) {
		i = rt.len(f, live(L));
	} else {
		i = rt.inc(live(i), -1);
	}
	return rt.index(live(L), live(i));
});

// /proc/shuffle  (code/__HELPERS/_lists.dm:236)
rt.def("/proc/shuffle", function shuffle(f: Frame, L: Value) {
	let i: Value = null;
	f.vars = () => [L, i];
	if (!truthy(live(L))) {
		return live(f.dot);
	}
	L = rt.callName(f, live(L), "Copy", []);
	i = null;
	i = 1;
	while (rt.lt(live(i), rt.len(f, live(L)))) {
		rt.callName(f, live(L), "Swap", [live(i), rt.call(f, P("/proc/rand"), null, [live(i), rt.len(f, live(L))])]);
		i = rt.inc(live(i), 1);
	}
	return live(L);
});

// /proc/shuffle_inplace  (code/__HELPERS/_lists.dm:247)
rt.def("/proc/shuffle_inplace", function shuffle_inplace(f: Frame, L: Value) {
	let i: Value = null;
	f.vars = () => [i];
	if (!truthy(live(L))) {
		return live(f.dot);
	}
	i = null;
	i = 1;
	while (rt.lt(live(i), rt.len(f, live(L)))) {
		rt.callName(f, live(L), "Swap", [live(i), rt.call(f, P("/proc/rand"), null, [live(i), rt.len(f, live(L))])]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
});

// /proc/uniqueList  (code/__HELPERS/_lists.dm:255)
rt.def("/proc/uniqueList", function uniqueList(f: Frame, L: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	f.dot = rt.list();
	i = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(f.dot = rt.modify(live(f.dot), live(i), rt.bitOr));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/uniqueList_inplace  (code/__HELPERS/_lists.dm:261)
rt.def("/proc/uniqueList_inplace", function uniqueList_inplace(f: Frame, L: Value) {
	let temp: Value = null, key: Value = null;
	let $e: any;
	f.vars = () => [L, temp, key, $e];
	temp = rt.callName(f, live(L), "Copy", []);
	rt.setFv(f, "len", live(L), 0);
	key = null;
	rt.forList(f, 0, live(temp));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		if (truthy(rt.call(f, P("/proc/isnum"), null, [live(key)]))) {
			(L = rt.modify(live(L), live(key), rt.bitOr));
		} else {
			rt.setAt(live(L), live(key), rt.index(live(temp), live(key)));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/sortKey  (code/__HELPERS/_lists.dm:271)  may sleep
rt.def("/proc/sortKey", function* sortKey(f: Frame, L: Value, order: Value) {
	let $0: any, $1: any;
	f.vars = () => [L, order, $0, $1];
	if (live(order) === null) {
		order = 1;
	}
	$0 = live(L);
	if (rt.ge(live(order), 0)) {
		$1 = P("/proc/cmp_ckey_asc");
	} else {
		$1 = P("/proc/cmp_ckey_dsc");
	}
	return (yield* g.call(f, P("/proc/sortTim"), null, [$0, $1]));
}, true);

// /proc/sortRecord  (code/__HELPERS/_lists.dm:275)  may sleep
rt.def("/proc/sortRecord", function* sortRecord(f: Frame, L: Value, field: Value, order: Value) {
	let $0: any, $1: any;
	f.vars = () => [L, field, order, $0, $1];
	if (live(field) === null) {
		field = "name";
	}
	if (live(order) === null) {
		order = 1;
	}
	rt.setGl("cmp_field", live(field));
	$0 = live(L);
	if (rt.ge(live(order), 0)) {
		$1 = P("/proc/cmp_records_asc");
	} else {
		$1 = P("/proc/cmp_records_dsc");
	}
	return (yield* g.call(f, P("/proc/sortTim"), null, [$0, $1]));
}, true);

// /proc/sortList  (code/__HELPERS/_lists.dm:280)  may sleep
rt.def("/proc/sortList", function* sortList(f: Frame, L: Value, cmp: Value) {
	f.vars = () => [L, cmp];
	if (live(cmp) === null) {
		cmp = P("/proc/cmp_text_asc");
	}
	return (yield* g.call(f, P("/proc/sortTim"), null, [(yield* g.callName(f, live(L), "Copy", [])), live(cmp)]));
}, true);

// /proc/sortNames  (code/__HELPERS/_lists.dm:284)  may sleep
rt.def("/proc/sortNames", function* sortNames(f: Frame, L: Value, order: Value) {
	let $0: any, $1: any;
	f.vars = () => [L, order, $0, $1];
	if (live(order) === null) {
		order = 1;
	}
	$0 = live(L);
	if (rt.ge(live(order), 0)) {
		$1 = P("/proc/cmp_name_asc");
	} else {
		$1 = P("/proc/cmp_name_dsc");
	}
	return (yield* g.call(f, P("/proc/sortTim"), null, [$0, $1]));
}, true);

// /proc/bitfield2list  (code/__HELPERS/_lists.dm:289)
rt.def("/proc/bitfield2list", function bitfield2list(f: Frame, bitfield: Value, wordlist: Value) {
	let r: Value = null, max: Value = null, bit: Value = null, i: Value = null, bit_1: Value = null;
	f.vars = () => [bitfield, r, max, bit, i, bit_1];
	if (live(bitfield) === null) {
		bitfield = 0;
	}
	r = rt.list();
	if (truthy((rt.istype(live(wordlist), T("/list")) ? 1 : 0))) {
		max = rt.call(f, P("/proc/min"), null, [rt.len(f, live(wordlist)), 16]);
		bit = 1;
		i = null;
		i = 1;
		while (rt.le(live(i), live(max))) {
			if (truthy(rt.bitAnd(live(bitfield), live(bit)))) {
				r = rt.modify(live(r), rt.index(live(wordlist), live(i)), add);
			}
			bit = rt.shiftLeft(live(bit), 1);
			i = rt.inc(live(i), 1);
		}
	} else {
		bit_1 = null;
		bit_1 = 1;
		while (rt.le(live(bit_1), 65535)) {
			if (truthy(rt.bitAnd(live(bitfield), live(bit_1)))) {
				r = rt.modify(live(r), live(bit_1), add);
			}
			bit_1 = rt.shiftLeft(live(bit_1), 1);
		}
	}
	return live(r);
});

// /proc/count_by_type  (code/__HELPERS/_lists.dm:309)
rt.def("/proc/count_by_type", function count_by_type(f: Frame, L: Value, type: Value) {
	let i: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [i, _T, $e];
	i = 0;
	_T = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.op(f, "IsType", [], [live(_T), live(type)]))) {
			i = rt.inc(live(i), 1);
		}
	}
	rt.endFor(f, 0);
	return live(i);
});

// /proc/find_record  (code/__HELPERS/_lists.dm:315)
rt.def("/proc/find_record", function find_record(f: Frame, field: Value, value: Value, L: Value) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	R = null;
	rt.forList(f, 0, live(L), T("/datum/data/record"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (isEqual(rt.index(rt.fv(f, "fields", live(R)), live(field)), live(value))) {
			return live(R);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/moveElement  (code/__HELPERS/_lists.dm:327)
rt.def("/proc/moveElement", function moveElement(f: Frame, L: Value, fromIndex: Value, toIndex: Value) {
	f.vars = () => [fromIndex];
	if ((isEqual(live(fromIndex), live(toIndex)) || isEqual(add(live(fromIndex), 1), live(toIndex)))) {
		return live(f.dot);
	}
	if (rt.gt(live(fromIndex), live(toIndex))) {
		fromIndex = rt.inc(live(fromIndex), 1);
	}
	rt.callName(f, live(L), "Insert", [live(toIndex), null]);
	rt.callName(f, live(L), "Swap", [live(fromIndex), live(toIndex)]);
	rt.callName(f, live(L), "Cut", [live(fromIndex), add(live(fromIndex), 1)]);
	return f.dot;
});

// /proc/moveRange  (code/__HELPERS/_lists.dm:341)
rt.def("/proc/moveRange", function moveRange(f: Frame, L: Value, fromIndex: Value, toIndex: Value, len: Value) {
	let distance: Value = null, i: Value = null;
	f.vars = () => [fromIndex, len, distance, i];
	if (live(len) === null) {
		len = 1;
	}
	distance = rt.op(f, "Abs", [], [subtract(live(toIndex), live(fromIndex))]);
	if (rt.ge(live(len), live(distance))) {
		if (rt.le(live(fromIndex), live(toIndex))) {
			return live(f.dot);
		}
		fromIndex = rt.modify(live(fromIndex), live(len), add);
		i = null;
		i = 0;
		while (rt.lt(live(i), live(distance))) {
			rt.callName(f, live(L), "Insert", [live(fromIndex), null]);
			rt.callName(f, live(L), "Swap", [live(fromIndex), live(toIndex)]);
			rt.callName(f, live(L), "Cut", [live(toIndex), add(live(toIndex), 1)]);
			i = rt.inc(live(i), 1);
		}
	} else {
		if (rt.gt(live(fromIndex), live(toIndex))) {
			fromIndex = rt.modify(live(fromIndex), live(len), add);
		}
		i = null;
		i = 0;
		while (rt.lt(live(i), live(len))) {
			rt.callName(f, live(L), "Insert", [live(toIndex), null]);
			rt.callName(f, live(L), "Swap", [live(fromIndex), live(toIndex)]);
			rt.callName(f, live(L), "Cut", [live(fromIndex), add(live(fromIndex), 1)]);
			i = rt.inc(live(i), 1);
		}
	}
	return f.dot;
});

// /proc/swapRange  (code/__HELPERS/_lists.dm:364)
rt.def("/proc/swapRange", function swapRange(f: Frame, L: Value, fromIndex: Value, toIndex: Value, len: Value) {
	let distance: Value = null, i: Value = null, a: Value = null;
	let $t: any;
	f.vars = () => [fromIndex, toIndex, len, distance, i, a, $t];
	if (live(len) === null) {
		len = 1;
	}
	distance = rt.op(f, "Abs", [], [subtract(live(toIndex), live(fromIndex))]);
	if (rt.gt(live(len), live(distance))) {
		if (rt.lt(live(fromIndex), live(toIndex))) {
			toIndex = rt.modify(live(toIndex), live(len), add);
		} else {
			fromIndex = rt.modify(live(fromIndex), live(len), add);
		}
		i = null;
		i = 0;
		while (rt.lt(live(i), live(distance))) {
			rt.callName(f, live(L), "Insert", [live(fromIndex), null]);
			rt.callName(f, live(L), "Swap", [live(fromIndex), live(toIndex)]);
			rt.callName(f, live(L), "Cut", [live(toIndex), add(live(toIndex), 1)]);
			i = rt.inc(live(i), 1);
		}
	} else {
		if (rt.gt(live(toIndex), live(fromIndex))) {
			a = live(toIndex);
			toIndex = live(fromIndex);
			fromIndex = live(a);
		}
		i = null;
		i = 0;
		while (rt.lt(live(i), live(len))) {
			rt.callName(f, live(L), "Swap", [($t = live(fromIndex), fromIndex = rt.inc($t, 1), $t), ($t = live(toIndex), toIndex = rt.inc($t, 1), $t)]);
			i = rt.inc(live(i), 1);
		}
	}
	return f.dot;
});

// /proc/reverseRange  (code/__HELPERS/_lists.dm:386)
rt.def("/proc/reverseRange", function reverseRange(f: Frame, L: Value, start: Value, end: Value) {
	let $t: any;
	f.vars = () => [start, end, $t];
	if (live(start) === null) {
		start = 1;
	}
	if (live(end) === null) {
		end = 0;
	}
	if (truthy(rt.len(f, live(L)))) {
		start = rt.modulus(live(start), rt.len(f, live(L)));
		end = rt.modulus(live(end), add(rt.len(f, live(L)), 1));
		if (rt.le(live(start), 0)) {
			start = rt.modify(live(start), rt.len(f, live(L)), add);
		}
		if (rt.le(live(end), 0)) {
			end = rt.modify(live(end), add(rt.len(f, live(L)), 1), add);
		}
		end = rt.inc(live(end), -1);
		while (rt.lt(live(start), live(end))) {
			rt.callName(f, live(L), "Swap", [($t = live(start), start = rt.inc($t, 1), $t), ($t = live(end), end = rt.inc($t, -1), $t)]);
		}
	}
	return live(L);
});

// /proc/getElementByVar  (code/__HELPERS/_lists.dm:405)
rt.def("/proc/getElementByVar", function getElementByVar(f: Frame, L: Value, varname: Value, value: Value) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [varname, D, $e];
	varname = fmt("＀", [live(varname)]);
	D = null;
	rt.forList(f, 0, live(L), T("/datum"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (truthy(rt.callName(f, rt.fv(f, "vars", live(D)), "Find", [live(varname)]))) {
			if (isEqual(rt.index(rt.fv(f, "vars", live(D)), live(varname)), live(value))) {
				return live(D);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/removeNullsFromList  (code/__HELPERS/_lists.dm:413)
rt.def("/proc/removeNullsFromList", function removeNullsFromList(f: Frame, L: Value) {
	while (truthy(rt.callName(f, live(L), "Remove", [null]))) {
	}
	return live(L);
});

// /proc/deepCopyList  (code/__HELPERS/_lists.dm:420)
rt.def("/proc/deepCopyList", function deepCopyList(f: Frame, l: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (!truthy((rt.istype(live(l), T("/list")) ? 1 : 0))) {
		return live(l);
	}
	f.dot = rt.callName(f, live(l), "Copy", []);
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, live(l)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy((rt.istype(rt.index(live(f.dot), live(i)), T("/list")) ? 1 : 0))) {
			rt.setAt(live(f.dot), live(i), rt.callSelf(f, [rt.index(live(f.dot), live(i))]));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/avoid_assoc_duplicate_keys  (code/__HELPERS/_lists.dm:430)
rt.def("/proc/avoid_assoc_duplicate_keys", function avoid_assoc_duplicate_keys(f: Frame, input_key: Value, used_key_list: Value) {
	f.vars = () => [input_key];
	if ((!truthy(live(input_key)) || !truthy((rt.istype(live(used_key_list), T("/list")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (truthy(rt.index(live(used_key_list), live(input_key)))) {
		rt.incAt(live(used_key_list), live(input_key), 1, true);
		input_key = fmt("＀ (＀)", [live(input_key), rt.index(live(used_key_list), live(input_key))]);
	} else {
		rt.setAt(live(used_key_list), live(input_key), 1);
	}
	return live(input_key);
});

// /proc/flatten_list  (code/__HELPERS/_lists.dm:446)
rt.def("/proc/flatten_list", function flatten_list(f: Frame, key_list: Value) {
	let key: Value = null;
	let $e: any;
	f.vars = () => [key, $e];
	if (!truthy((rt.istype(live(key_list), T("/list")) ? 1 : 0))) {
		return null;
	}
	f.dot = rt.list();
	key = null;
	rt.forList(f, 0, live(key_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		(f.dot = rt.modify(live(f.dot), rt.index(live(key_list), live(key)), rt.bitOr));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/counterlist_scale  (code/__HELPERS/_lists.dm:470)
rt.def("/proc/counterlist_scale", function counterlist_scale(f: Frame, L: Value, scalar: Value) {
	let out: Value = null, key: Value = null;
	let $e: any;
	f.vars = () => [out, key, $e];
	out = rt.list();
	key = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		rt.setAt(live(out), live(key), multiply(rt.index(live(L), live(key)), live(scalar)));
	}
	rt.endFor(f, 0);
	f.dot = live(out);
	return f.dot;
});

// /proc/counterlist_sum  (code/__HELPERS/_lists.dm:477)
rt.def("/proc/counterlist_sum", function counterlist_sum(f: Frame, L: Value) {
	let key: Value = null;
	let $e: any;
	f.vars = () => [key, $e];
	f.dot = 0;
	key = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		f.dot = rt.modify(live(f.dot), rt.index(live(L), live(key)), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/counterlist_normalise  (code/__HELPERS/_lists.dm:481)
rt.def("/proc/counterlist_normalise", function counterlist_normalise(f: Frame, L: Value) {
	let avg: Value = null;
	f.vars = () => [avg];
	if (!isEqual((avg = rt.call(f, P("/proc/counterlist_sum"), null, [live(L)])), 0)) {
		f.dot = rt.call(f, P("/proc/counterlist_scale"), null, [live(L), divide(1, live(avg))]);
	} else {
		f.dot = live(L);
	}
	return f.dot;
});

// /proc/counterlist_combine  (code/__HELPERS/_lists.dm:488)
rt.def("/proc/counterlist_combine", function counterlist_combine(f: Frame, L1: Value, L2: Value) {
	let key: Value = null, other_value: Value = null;
	let $e: any;
	f.vars = () => [key, other_value, $e];
	key = null;
	rt.forList(f, 0, live(L2));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		other_value = rt.index(live(L2), live(key));
		if (truthy((rt.isIn(f, live(key), live(L1)) ? 1 : 0))) {
			rt.modAt(live(L1), live(key), live(other_value), add);
		} else {
			rt.setAt(live(L1), live(key), live(other_value));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
