// Based on /tg/station's code/__HELPERS/_lists.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add } = rt;


// _lists.dm:15
rt.def("/proc/english_list", function english_list(f: Frame, input: Value, nothing_text: Value, and_text: Value, comma_text: Value, final_comma_text: Value) {
	let total: Value = null;
	nothing_text ??= "nothing";
	and_text ??= " and ";
	comma_text ??= ", ";
	final_comma_text ??= "";
	if (!(total = rt.len(f, input))) {
		return `${nothing_text}`;
	}
	if (total == 1) {
		return `${rt.index(input, 1)}`;
	}
	if (total == 2) {
		return `${rt.index(input, 1)}${and_text}${rt.index(input, 2)}`;
	}
	let output: Value = "";
	let index: Value = 1;
	while (index < total) {
		if (index == total - 1) {
			comma_text = final_comma_text;
		}
		output += `${rt.index(input, index)}${comma_text}`;
		index++;
	}
	return `${output}${and_text}${rt.index(input, index)}`;
});

// _lists.dm:35
rt.def("/proc/listgetindex", function listgetindex(f: Frame, L: Value, index: Value) {
	if (rt.istype(L, T("/list"))) {
		if (isnum(index) && IsInteger(index)) {
			if (IsInRange(index, 1, rt.len(f, L))) {
				return rt.index(L, index);
			}
		} else if (rt.isIn(f, index, L)) {
			return rt.index(L, index);
		}
	}
	return f.dot;
});

// _lists.dm:45
rt.def("/proc/safepick", function safepick(f: Frame, L: Value) {
	if (!(rt.istype(L, T("/list")) && rt.len(f, L))) return f.dot;
	return pick(L);
});

// _lists.dm:50
rt.def("/proc/isemptylist", function isemptylist(f: Frame, L: Value) {
	if (!rt.len(f, L)) {
		return 1;
	}
	return 0;
});

// _lists.dm:56
rt.def("/proc/is_type_in_list", function is_type_in_list(f: Frame, A: Value, L: Value) {
	let type: Value = null;
	if (!L || !rt.len(f, L) || !A) {
		return 0;
	}
	for (type of each(L)) {
		if (rt.op(f, "IsType", [], [A, type])) {
			return 1;
		}
	}
	return 0;
});

// _lists.dm:65
rt.def("/proc/is_type_in_typecache", function is_type_in_typecache(f: Frame, A: Value, L: Value) {
	if (!L || !rt.len(f, L) || !A) {
		return 0;
	}
	if (ispath(A)) {
		f.dot = rt.index(L, A);
	} else {
		f.dot = rt.index(L, A.type);
	}
	return f.dot;
});

// _lists.dm:93
rt.def("/proc/typecache_filter_list", function typecache_filter_list(f: Frame, atoms: Value, typecache: Value) {
	let thing: Value = null, A: Value = null;
	f.dot = list();
	for (thing of each(atoms)) {
		A = thing;
		if (rt.index(typecache, A.type)) {
			f.dot += A;
		}
	}
	return f.dot;
});

// _lists.dm:101
rt.def("/proc/typecacheof", function typecacheof(f: Frame, path: Value, ignore_root_path: Value, only_root_path: Value) {
	let types: Value = null, L: Value = null, _T: Value = null, pathlist: Value = null, _P: Value = null, _T_3: Value = null;
	let $e: any;
	only_root_path ??= 0;
	if (ispath(path)) {
		types = list();
		if (only_root_path) {
			types = list(path);
		} else {
			types = ignore_root_path ? typesof(path) - path : typesof(path);
		}
		L = list();
		for (_T of each(types)) {
			rt.setAt(L, _T, 1);
		}
		return L;
	} else {
		if (!rt.istype(path, T("/list"))) return f.dot;
		pathlist = path;
		L = list();
		if (ignore_root_path) {
			for (_P of each(pathlist)) {
				_T_3 = null;
				for (_T_3 of each(typesof(_P) - _P)) {
					rt.setAt(L, _T_3, 1);
				}
			}
		} else {
			_P = null;
			for (_P of each(pathlist)) {
				if (only_root_path) {
					rt.setAt(L, _P, 1);
				} else {
					_T_3 = null;
					for (_T_3 of each(typesof(_P))) {
						rt.setAt(L, _T_3, 1);
					}
				}
			}
		}
		return L;
	}
});

// _lists.dm:129
rt.def("/proc/clearlist", function clearlist(f: Frame, list: Value) {
	if (rt.istype(list, T("/list"))) {
		list.len = 0;
	}
	return f.dot;
});

// _lists.dm:137
rt.def("/proc/listclearnulls", function listclearnulls(f: Frame, L: Value) {
	let N: Value = null;
	let start_len: Value = rt.len(f, L);
	L -= (N = new_(T("/list"), start_len));
	return (rt.len(f, L) < start_len ? 1 : 0);
});

// _lists.dm:147
rt.def("/proc/difflist", function difflist(f: Frame, first: Value, second: Value, skiprep: Value) {
	let e: Value = null;
	skiprep ??= 0;
	if (!rt.istype(first, T("/list")) || !rt.istype(second, T("/list"))) {
		return f.dot;
	}
	let result: Value = new_(T("/list"));
	if (skiprep) {
		for (e of each(first)) {
			if (!rt.isIn(f, e, result) && !rt.isIn(f, e, second)) {
				result += e;
			}
		}
	} else {
		result = first - second;
	}
	return result;
});

// _lists.dm:177
rt.def("/proc/pickweight", function pickweight(f: Frame, L: Value) {
	let item: Value = null;
	let total: Value = 0;
	for (item of each(L)) {
		if (!rt.index(L, item)) {
			rt.setAt(L, item, 1);
		}
		total += rt.index(L, item);
	}
	total = rand(1, total);
	for (item of each(L)) {
		total -= rt.index(L, item);
		if (total <= 0) {
			return item;
		}
	}
	return null;
});

// _lists.dm:192
rt.def("/proc/pick_n_take", function pick_n_take(f: Frame, L: Value) {
	if (!rt.len(f, L)) return f.dot;
	let picked: Value = rand(1, rt.len(f, L));
	f.dot = rt.index(L, picked);
	L.Cut(picked, picked + 1);
	return f.dot;
});

// _lists.dm:199
rt.def("/proc/pop", function pop(f: Frame, L: Value) {
	if (!rt.len(f, L)) return f.dot;
	f.dot = rt.index(L, rt.len(f, L));
	L.len--;
	return f.dot;
});

// _lists.dm:204
rt.def("/proc/popleft", function popleft(f: Frame, L: Value) {
	if (!rt.len(f, L)) return f.dot;
	f.dot = rt.index(L, 1);
	L.Cut(1, 2);
	return f.dot;
});

// _lists.dm:217
rt.def("/proc/next_list_item", function next_list_item(f: Frame, item: Value, L: Value) {
	let i: Value = null;
	if ((i = L.Find(item)) == rt.len(f, L)) {
		i = 1;
	} else {
		i++;
	}
	return rt.index(L, i);
});

// _lists.dm:227
rt.def("/proc/previous_list_item", function previous_list_item(f: Frame, item: Value, L: Value) {
	let i: Value = null;
	if ((i = L.Find(item)) == 1) {
		i = rt.len(f, L);
	} else {
		i--;
	}
	return rt.index(L, i);
});

// _lists.dm:236
rt.def("/proc/shuffle", function shuffle(f: Frame, L: Value) {
	if (!L) {
		return f.dot;
	}
	L = L.Copy();
	let i: Value = 1;
	while (i < rt.len(f, L)) {
		L.Swap(i, rand(i, rt.len(f, L)));
		i++;
	}
	return L;
});

// _lists.dm:247
rt.def("/proc/shuffle_inplace", function shuffle_inplace(f: Frame, L: Value) {
	if (!L) {
		return f.dot;
	}
	let i: Value = 1;
	while (i < rt.len(f, L)) {
		L.Swap(i, rand(i, rt.len(f, L)));
		i++;
	}
	return f.dot;
});

// _lists.dm:255
rt.def("/proc/uniqueList", function uniqueList(f: Frame, L: Value) {
	let i: Value = null;
	f.dot = list();
	for (i of each(L)) {
		(f.dot = rt.modify(f.dot, i, rt.bitOr));
	}
	return f.dot;
});

// _lists.dm:261
rt.def("/proc/uniqueList_inplace", function uniqueList_inplace(f: Frame, L: Value) {
	let key: Value = null;
	let temp: Value = L.Copy();
	L.len = 0;
	for (key of each(temp)) {
		if (isnum(key)) {
			(L = rt.modify(L, key, rt.bitOr));
		} else {
			rt.setAt(L, key, rt.index(temp, key));
		}
	}
	return f.dot;
});

// _lists.dm:271
rt.def("/proc/sortKey", function* sortKey(f: Frame, L: Value, order: Value) {
	let $1: any;
	order ??= 1;
	let $0: any = L;
	if (order >= 0) {
		$1 = P("/proc/cmp_ckey_asc");
	} else {
		$1 = P("/proc/cmp_ckey_dsc");
	}
	return (yield* sortTim($0, $1));
}, true);

// _lists.dm:275
rt.def("/proc/sortRecord", function* sortRecord(f: Frame, L: Value, field: Value, order: Value) {
	let $1: any;
	field ??= "name";
	order ??= 1;
	GLOB.cmp_field = field;
	let $0: any = L;
	if (order >= 0) {
		$1 = P("/proc/cmp_records_asc");
	} else {
		$1 = P("/proc/cmp_records_dsc");
	}
	return (yield* sortTim($0, $1));
}, true);

// _lists.dm:280
rt.def("/proc/sortList", function* sortList(f: Frame, L: Value, cmp: Value) {
	cmp ??= P("/proc/cmp_text_asc");
	return (yield* sortTim((yield* L.Copy()), cmp));
}, true);

// _lists.dm:284
rt.def("/proc/sortNames", function* sortNames(f: Frame, L: Value, order: Value) {
	let $1: any;
	order ??= 1;
	let $0: any = L;
	if (order >= 0) {
		$1 = P("/proc/cmp_name_asc");
	} else {
		$1 = P("/proc/cmp_name_dsc");
	}
	return (yield* sortTim($0, $1));
}, true);

// _lists.dm:309
rt.def("/proc/count_by_type", function count_by_type(f: Frame, L: Value, type: Value) {
	let _T: Value = null;
	let i: Value = 0;
	for (_T of each(L)) {
		if (rt.op(f, "IsType", [], [_T, type])) {
			i++;
		}
	}
	return i;
});

// _lists.dm:315
rt.def("/proc/find_record", function find_record(f: Frame, field: Value, value: Value, L: Value) {
	let R: Value = null;
	for (R of each(L, T("/datum/data/record"))) {
		if (rt.index(R.fields, field) == value) {
			return R;
		}
	}
	return f.dot;
});

// _lists.dm:327
rt.def("/proc/moveElement", function moveElement(f: Frame, L: Value, fromIndex: Value, toIndex: Value) {
	if (fromIndex == toIndex || fromIndex + 1 == toIndex) {
		return f.dot;
	}
	if (fromIndex > toIndex) {
		fromIndex++;
	}
	L.Insert(toIndex, null);
	L.Swap(fromIndex, toIndex);
	L.Cut(fromIndex, fromIndex + 1);
	return f.dot;
});

// _lists.dm:341
rt.def("/proc/moveRange", function moveRange(f: Frame, L: Value, fromIndex: Value, toIndex: Value, len: Value) {
	let i: Value = null;
	len ??= 1;
	let distance: Value = rt.op(f, "Abs", [], [toIndex - fromIndex]);
	if (len >= distance) {
		if (fromIndex <= toIndex) {
			return f.dot;
		}
		fromIndex += len;
		i = 0;
		while (i < distance) {
			L.Insert(fromIndex, null);
			L.Swap(fromIndex, toIndex);
			L.Cut(toIndex, toIndex + 1);
			i++;
		}
	} else {
		if (fromIndex > toIndex) {
			fromIndex += len;
		}
		i = 0;
		while (i < len) {
			L.Insert(toIndex, null);
			L.Swap(fromIndex, toIndex);
			L.Cut(fromIndex, fromIndex + 1);
			i++;
		}
	}
	return f.dot;
});

// _lists.dm:386
rt.def("/proc/reverseRange", function reverseRange(f: Frame, L: Value, start: Value, end: Value) {
	let $t: any;
	start ??= 1;
	end ??= 0;
	if (rt.len(f, L)) {
		start = start % rt.len(f, L);
		end = end % (rt.len(f, L) + 1);
		if (start <= 0) {
			start += rt.len(f, L);
		}
		if (end <= 0) {
			end += rt.len(f, L) + 1;
		}
		end--;
		while (start < end) {
			L.Swap(($t = start, start = rt.inc($t, 1), $t), ($t = end, end = rt.inc($t, -1), $t));
		}
	}
	return L;
});

// _lists.dm:413
rt.def("/proc/removeNullsFromList", function removeNullsFromList(f: Frame, L: Value) {
	while (L.Remove(null)) {
	}
	return L;
});

// _lists.dm:420
rt.def("/proc/deepCopyList", function deepCopyList(f: Frame, l: Value) {
	let i: Value = null;
	let $e: any;
	if (!rt.istype(l, T("/list"))) {
		return l;
	}
	f.dot = l.Copy();
	rt.forRange(f, 0, 1, rt.len(f, l), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (rt.istype(rt.index(f.dot, i), T("/list"))) {
			rt.setAt(f.dot, i, rt.callSelf(f, [rt.index(f.dot, i)]));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// _lists.dm:430
rt.def("/proc/avoid_assoc_duplicate_keys", function avoid_assoc_duplicate_keys(f: Frame, input_key: Value, used_key_list: Value) {
	if (!input_key || !rt.istype(used_key_list, T("/list"))) {
		return f.dot;
	}
	if (rt.index(used_key_list, input_key)) {
		rt.incAt(used_key_list, input_key, 1, true);
		input_key = `${input_key} (${rt.index(used_key_list, input_key)})`;
	} else {
		rt.setAt(used_key_list, input_key, 1);
	}
	return input_key;
});

// _lists.dm:446
rt.def("/proc/flatten_list", function flatten_list(f: Frame, key_list: Value) {
	let key: Value = null;
	if (!rt.istype(key_list, T("/list"))) {
		return null;
	}
	f.dot = list();
	for (key of each(key_list)) {
		(f.dot = rt.modify(f.dot, rt.index(key_list, key), rt.bitOr));
	}
	return f.dot;
});

// _lists.dm:470
rt.def("/proc/counterlist_scale", function counterlist_scale(f: Frame, L: Value, scalar: Value) {
	let key: Value = null;
	let out: Value = list();
	for (key of each(L)) {
		rt.setAt(out, key, rt.index(L, key) * scalar);
	}
	f.dot = out;
	return f.dot;
});

// _lists.dm:477
rt.def("/proc/counterlist_sum", function counterlist_sum(f: Frame, L: Value) {
	let key: Value = null;
	f.dot = 0;
	for (key of each(L)) {
		f.dot += rt.index(L, key);
	}
	return f.dot;
});

// _lists.dm:481
rt.def("/proc/counterlist_normalise", function counterlist_normalise(f: Frame, L: Value) {
	let avg: Value = null;
	if ((avg = counterlist_sum(L)) != 0) {
		f.dot = counterlist_scale(L, 1 / avg);
	} else {
		f.dot = L;
	}
	return f.dot;
});

// _lists.dm:488
rt.def("/proc/counterlist_combine", function counterlist_combine(f: Frame, L1: Value, L2: Value) {
	let key: Value = null, other_value: Value = null;
	for (key of each(L2)) {
		other_value = rt.index(L2, key);
		if (rt.isIn(f, key, L1)) {
			rt.modAt(L1, key, other_value, add);
		} else {
			rt.setAt(L1, key, other_value);
		}
	}
	return f.dot;
});
