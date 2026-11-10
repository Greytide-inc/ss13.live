// Based on /tg/station's code/__HELPERS/_string_lists.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// _string_lists.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalstring_cache", function InitGlobalstring_cache(f: Frame) {
	GLOB.string_cache = null;
	this.gvars_datum_init_order += "string_cache";
	return f.dot;
});

// _string_lists.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalstring_filename_current_key", function InitGlobalstring_filename_current_key(f: Frame) {
	GLOB.string_filename_current_key = null;
	this.gvars_datum_init_order += "string_filename_current_key";
	return f.dot;
});

// _string_lists.dm:10
rt.def("/proc/strings_replacement", function strings_replacement(f: Frame, filename: Value, key: Value) {
	let response: Value = null, r: Value = null;
	load_strings_file(filename);
	if (rt.isIn(f, filename, GLOB.string_cache) && rt.isIn(f, key, rt.index(GLOB.string_cache, filename))) {
		response = pick(rt.index(rt.index(GLOB.string_cache, filename), key));
		return (response = (r = regex("@pick\\((\\D+?)\\)", "g")).Replace(response, P("/proc/strings_subkey_lookup")));
	} else {
		CRASH(`strings list not found: strings/${filename}, index=${key}`);
	}
	return f.dot;
});

// _string_lists.dm:21
rt.def("/proc/strings", function strings(f: Frame, filename: Value, key: Value) {
	load_strings_file(filename);
	if (rt.isIn(f, filename, GLOB.string_cache) && rt.isIn(f, key, rt.index(GLOB.string_cache, filename))) {
		return rt.index(rt.index(GLOB.string_cache, filename), key);
	}
	CRASH(`strings list not found: strings/${filename}, index=${key}`);
	return f.dot;
});

// _string_lists.dm:28
rt.def("/proc/strings_subkey_lookup", function strings_subkey_lookup(f: Frame, match: Value, group1: Value) {
	return pick(strings(GLOB.string_filename_current_key, group1));
});

// _string_lists.dm:31
rt.def("/proc/load_strings_file", function load_strings_file(f: Frame, filename: Value) {
	GLOB.string_filename_current_key = filename;
	if (rt.isIn(f, filename, GLOB.string_cache)) {
		return f.dot;
	}
	if (!GLOB.string_cache) {
		GLOB.string_cache = new_(T("/list"));
	}
	if (fexists(`strings/${filename}`)) {
		rt.setAt(GLOB.string_cache, filename, json_decode(file2text(`strings/${filename}`)));
	} else {
		CRASH(`file not found: strings/${filename}`);
	}
	return f.dot;
});
