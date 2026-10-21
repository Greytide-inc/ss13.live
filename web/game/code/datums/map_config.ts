// From code/datums/map_config.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(566, "/datum/map_config", "/datum", {
	config_filename: "_maps/boxstation.json",
	map_name: "Box Station",
	map_path: "map_files/BoxStation",
	map_file: "BoxStation.dmm",
	minetype: "lavaland",
	transition_config: null,
	defaulted: 1,
	config_max_users: 0,
	config_min_users: 0,
	voteweight: 1,
});

// /datum/map_config/proc/<init>  (code/datums/map_config.dm:14)
rt.def("/datum/map_config/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "transition_config", rt.alist(f, ["CentComm", 1, "Main Station", 2, "Empty Area 1", 2, "Empty Area 2", 2, "Mining Asteroid", 1, "Empty Area 3", 2, "Empty Area 4", 2, "Empty Area 5", 2, "Empty Area 6", 2, "Empty Area 7", 2, "Empty Area 8", 2]));
	return f.dot;
});

// /datum/map_config/proc/New  (code/datums/map_config.dm:34)
rt.def("/datum/map_config/proc/New", function New(f: Frame, filename: Value, default_to_box: Value, delete_after: Value) {
	f.vars = () => [filename];
	if (live(filename) === null) {
		filename = "data/next_map.json";
	}
	if (truthy(live(default_to_box))) {
		return live(f.dot);
	}
	rt.callSrc(f, "LoadConfig", [live(filename)]);
	if (!truthy(live(delete_after))) return f.dot;
	rt.call(f, P("/proc/fdel"), null, [live(filename)]);
	return f.dot;
});

// /datum/map_config/proc/LoadConfig  (code/datums/map_config.dm:39)
rt.def("/datum/map_config/proc/LoadConfig", function LoadConfig(f: Frame, filename: Value) {
	let json: Value = null, jtcl: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [json, jtcl, I, $e];
	if (!truthy(rt.call(f, P("/proc/fexists"), null, [live(filename)]))) {
		rt.call(f, P("/proc/log_world"), null, [fmt("map_config not found: ＀", [live(filename)])]);
		return live(f.dot);
	}
	if (!truthy((json = rt.call(f, P("/proc/file"), null, [live(filename)])))) {
		rt.call(f, P("/proc/log_world"), null, [fmt("Could not open map_config: ＀", [live(filename)])]);
		return live(f.dot);
	}
	if (!truthy((json = rt.call(f, P("/proc/file2text"), null, [live(json)])))) {
		rt.call(f, P("/proc/log_world"), null, [fmt("map_config is not text: ＀", [live(filename)])]);
		return live(f.dot);
	}
	if (!truthy((json = rt.call(f, P("/proc/json_decode"), null, [live(json)])))) {
		rt.call(f, P("/proc/log_world"), null, [fmt("map_config is not json: ＀", [live(filename)])]);
		return live(f.dot);
	}
	if (!truthy(rt.callSrc(f, "ValidateJSON", [live(json)]))) {
		rt.call(f, P("/proc/log_world"), null, [fmt("map_config failed to validate for above reason: ＀", [live(filename)])]);
		return live(f.dot);
	}
	rt.setSv(f, "config_filename", live(filename));
	rt.setSv(f, "map_name", rt.at(live(json), "map_name"));
	rt.setSv(f, "map_path", rt.at(live(json), "map_path"));
	rt.setSv(f, "map_file", rt.at(live(json), "map_file"));
	rt.setSv(f, "minetype", rt.at(live(json), "minetype"));
	if (!isEqual((jtcl = rt.at(live(json), "transition_config")), "default")) {
		rt.callName(f, rt.sv(f, "transition_config"), "Cut", []);
		I = null;
		rt.forList(f, 0, live(jtcl));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.setAt(rt.sv(f, "transition_config"), rt.callSrc(f, "TransitionStringToEnum", [live(I)]), rt.callSrc(f, "TransitionStringToEnum", [rt.index(live(jtcl), live(I))]));
		}
		rt.endFor(f, 0);
	}
	rt.setSv(f, "defaulted", 0);
	return f.dot;
});

// /datum/map_config/proc/ValidateJSON  (code/datums/map_config.dm:82)
rt.def("/datum/map_config/proc/ValidateJSON", function ValidateJSON(f: Frame, json: Value) {
	let path: Value = null, jtcl: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [path, jtcl, I, $e];
	if (!truthy(rt.call(f, P("/proc/istext"), null, [rt.at(live(json), "map_name")]))) {
		rt.call(f, P("/proc/log_world"), null, ["map_namemissing from json!"]);
		return live(f.dot);
	}
	if (!truthy(rt.call(f, P("/proc/istext"), null, [rt.at(live(json), "map_path")]))) {
		rt.call(f, P("/proc/log_world"), null, ["map_pathmissing from json!"]);
		return live(f.dot);
	}
	if (!truthy(rt.call(f, P("/proc/istext"), null, [rt.at(live(json), "map_file")]))) {
		rt.call(f, P("/proc/log_world"), null, ["map_filemissing from json!"]);
		return live(f.dot);
	}
	if (!truthy(rt.call(f, P("/proc/istext"), null, [rt.at(live(json), "minetype")]))) {
		rt.call(f, P("/proc/log_world"), null, ["minetypemissing from json!"]);
		return live(f.dot);
	}
	if (!truthy(rt.call(f, P("/proc/istext"), null, [rt.at(live(json), "transition_config")]))) {
		rt.call(f, P("/proc/log_world"), null, ["transition_configmissing from json!"]);
		return live(f.dot);
	}
	if (!truthy(rt.call(f, P("/proc/fexists"), null, [(path = rt.callSrc(f, "GetFullMapPath", [rt.at(live(json), "map_path"), rt.at(live(json), "map_file")]))]))) {
		rt.call(f, P("/proc/log_world"), null, [fmt("Map file (＀) does not exist!", [live(path)])]);
		return live(f.dot);
	}
	if (!isEqual(rt.at(live(json), "transition_config"), "default")) {
		if (!truthy((rt.istype(rt.at(live(json), "transition_config"), T("/list")) ? 1 : 0))) {
			rt.call(f, P("/proc/log_world"), null, ["transition_config is not a list!"]);
			return live(f.dot);
		}
		jtcl = rt.at(live(json), "transition_config");
		I = null;
		rt.forList(f, 0, live(jtcl));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (rt.callSrc(f, "TransitionStringToEnum", [live(I)]) === null) {
				rt.call(f, P("/proc/log_world"), null, [fmt("Invalid transition_config option: ＀!", [live(I)])]);
			}
			if (rt.callSrc(f, "TransitionStringToEnum", [rt.index(live(jtcl), live(I))]) === null) {
				rt.call(f, P("/proc/log_world"), null, [fmt("Invalid transition_config option: ＀!", [live(I)])]);
			}
		}
		rt.endFor(f, 0);
	}
	return 1;
});

// /datum/map_config/proc/TransitionStringToEnum  (code/datums/map_config.dm:109)
rt.def("/datum/map_config/proc/TransitionStringToEnum", function TransitionStringToEnum(f: Frame, string: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(string);
	if ($0 === "CROSSLINKED") {
		return 2;
	} else if ($0 === "SELFLOOPING") {
		return 1;
	} else if ($0 === "UNAFFECTED") {
		return 0;
	} else if ($0 === "MAIN_STATION") {
		return "Main Station";
	} else if ($0 === "CENTCOMM") {
		return "CentComm";
	} else if ($0 === "MINING") {
		return "Mining Asteroid";
	} else if ($0 === "EMPTY_AREA_1") {
		return "Empty Area 1";
	} else if ($0 === "EMPTY_AREA_2") {
		return "Empty Area 2";
	} else if ($0 === "EMPTY_AREA_3") {
		return "Empty Area 3";
	} else if ($0 === "EMPTY_AREA_4") {
		return "Empty Area 4";
	} else if ($0 === "EMPTY_AREA_5") {
		return "Empty Area 5";
	} else if ($0 === "EMPTY_AREA_6") {
		return "Empty Area 6";
	} else if ($0 === "EMPTY_AREA_7") {
		return "Empty Area 7";
	} else if ($0 === "EMPTY_AREA_8") {
		return "Empty Area 8";
	}
	return f.dot;
});

// /datum/map_config/proc/GetFullMapPath  (code/datums/map_config.dm:140)
rt.def("/datum/map_config/proc/GetFullMapPath", function GetFullMapPath(f: Frame, mp: Value, mf: Value) {
	f.vars = () => [mp, mf];
	if (live(mp) === null) {
		mp = rt.sv(f, "map_path");
	}
	if (live(mf) === null) {
		mf = rt.sv(f, "map_file");
	}
	return fmt("_maps/＀/＀", [live(mp), live(mf)]);
});

// /datum/map_config/proc/MakeNextMap  (code/datums/map_config.dm:143)
rt.def("/datum/map_config/proc/MakeNextMap", function MakeNextMap(f: Frame) {
	return ((isEqual(rt.sv(f, "config_filename"), "data/next_map.json") ? 1 : 0) || rt.call(f, P("/proc/fcopy"), null, [rt.sv(f, "config_filename"), "data/next_map.json"]));
});
