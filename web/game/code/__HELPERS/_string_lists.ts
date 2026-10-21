// From code/__HELPERS/_string_lists.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalstring_cache  (code/__HELPERS/_string_lists.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalstring_cache", function InitGlobalstring_cache(f: Frame) {
	rt.setGl("string_cache", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "string_cache", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalstring_filename_current_key  (code/__HELPERS/_string_lists.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalstring_filename_current_key", function InitGlobalstring_filename_current_key(f: Frame) {
	rt.setGl("string_filename_current_key", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "string_filename_current_key", add);
	return f.dot;
});

// /proc/strings_replacement  (code/__HELPERS/_string_lists.dm:10)
rt.def("/proc/strings_replacement", function strings_replacement(f: Frame, filename: Value, key: Value) {
	let response: Value = null, r: Value = null;
	f.vars = () => [response, r];
	rt.call(f, P("/proc/load_strings_file"), null, [live(filename)]);
	if ((truthy((rt.isIn(f, live(filename), rt.gl("string_cache")) ? 1 : 0)) && truthy((rt.isIn(f, live(key), rt.index(rt.gl("string_cache"), live(filename))) ? 1 : 0)))) {
		response = rt.op(f, "PickUnweighted", [1], [rt.index(rt.index(rt.gl("string_cache"), live(filename)), live(key))]);
		return (response = rt.callName(f, (r = rt.call(f, P("/proc/regex"), null, ["@pick\\((\\D+?)\\)", "g"])), "Replace", [live(response), P("/proc/strings_subkey_lookup")]));
	} else {
		rt.call(f, P("/proc/CRASH"), null, [fmt("strings list not found: strings/＀, index=＀", [live(filename), live(key)])]);
	}
	return f.dot;
});

// /proc/strings  (code/__HELPERS/_string_lists.dm:21)
rt.def("/proc/strings", function strings(f: Frame, filename: Value, key: Value) {
	rt.call(f, P("/proc/load_strings_file"), null, [live(filename)]);
	if ((truthy((rt.isIn(f, live(filename), rt.gl("string_cache")) ? 1 : 0)) && truthy((rt.isIn(f, live(key), rt.index(rt.gl("string_cache"), live(filename))) ? 1 : 0)))) {
		return rt.index(rt.index(rt.gl("string_cache"), live(filename)), live(key));
	}
	rt.call(f, P("/proc/CRASH"), null, [fmt("strings list not found: strings/＀, index=＀", [live(filename), live(key)])]);
	return f.dot;
});

// /proc/strings_subkey_lookup  (code/__HELPERS/_string_lists.dm:28)
rt.def("/proc/strings_subkey_lookup", function strings_subkey_lookup(f: Frame, match: Value, group1: Value) {
	return rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, [rt.gl("string_filename_current_key"), live(group1)])]);
});

// /proc/load_strings_file  (code/__HELPERS/_string_lists.dm:31)
rt.def("/proc/load_strings_file", function load_strings_file(f: Frame, filename: Value) {
	rt.setGl("string_filename_current_key", live(filename));
	if (truthy((rt.isIn(f, live(filename), rt.gl("string_cache")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.gl("string_cache"))) {
		rt.setGl("string_cache", rt.new_(f, T("/list"), []));
	}
	if (truthy(rt.call(f, P("/proc/fexists"), null, [fmt("strings/＀", [live(filename)])]))) {
		rt.setAt(rt.gl("string_cache"), live(filename), rt.call(f, P("/proc/json_decode"), null, [rt.call(f, P("/proc/file2text"), null, [fmt("strings/＀", [live(filename)])])]));
	} else {
		rt.call(f, P("/proc/CRASH"), null, [fmt("file not found: strings/＀", [live(filename)])]);
	}
	return f.dot;
});
