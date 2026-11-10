// Based on /tg/station's code/datums/map_config.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// map_config.dm:14
rt.def("/datum/map_config/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.transition_config = rt.alist(f, ["CentComm", 1, "Main Station", 2, "Empty Area 1", 2, "Empty Area 2", 2, "Mining Asteroid", 1, "Empty Area 3", 2, "Empty Area 4", 2, "Empty Area 5", 2, "Empty Area 6", 2, "Empty Area 7", 2, "Empty Area 8", 2]);
	return f.dot;
});

// map_config.dm:34
rt.def("/datum/map_config/proc/New", function New(f: Frame, filename: Value, default_to_box: Value, delete_after: Value) {
	filename ??= "data/next_map.json";
	if (default_to_box) {
		return f.dot;
	}
	this.LoadConfig(filename);
	if (!delete_after) return f.dot;
	fdel(filename);
	return f.dot;
});

// map_config.dm:39
rt.def("/datum/map_config/proc/LoadConfig", function LoadConfig(f: Frame, filename: Value) {
	let json: Value = null, jtcl: Value = null, I: Value = null;
	if (!fexists(filename)) {
		log_world(`map_config not found: ${filename}`);
		return f.dot;
	}
	if (!(json = file(filename))) {
		log_world(`Could not open map_config: ${filename}`);
		return f.dot;
	}
	if (!(json = file2text(json))) {
		log_world(`map_config is not text: ${filename}`);
		return f.dot;
	}
	if (!(json = json_decode(json))) {
		log_world(`map_config is not json: ${filename}`);
		return f.dot;
	}
	if (!this.ValidateJSON(json)) {
		log_world(`map_config failed to validate for above reason: ${filename}`);
		return f.dot;
	}
	this.config_filename = filename;
	this.map_name = rt.at(json, "map_name");
	this.map_path = rt.at(json, "map_path");
	this.map_file = rt.at(json, "map_file");
	this.minetype = rt.at(json, "minetype");
	if ((jtcl = rt.at(json, "transition_config")) != "default") {
		this.transition_config.Cut();
		for (I of each(jtcl)) {
			rt.setAt(this.transition_config, this.TransitionStringToEnum(I), this.TransitionStringToEnum(rt.index(jtcl, I)));
		}
	}
	this.defaulted = 0;
	return f.dot;
});

// map_config.dm:82
rt.def("/datum/map_config/proc/ValidateJSON", function ValidateJSON(f: Frame, json: Value) {
	let path: Value = null, jtcl: Value = null, I: Value = null;
	if (!istext(rt.at(json, "map_name"))) {
		log_world("map_namemissing from json!");
		return f.dot;
	}
	if (!istext(rt.at(json, "map_path"))) {
		log_world("map_pathmissing from json!");
		return f.dot;
	}
	if (!istext(rt.at(json, "map_file"))) {
		log_world("map_filemissing from json!");
		return f.dot;
	}
	if (!istext(rt.at(json, "minetype"))) {
		log_world("minetypemissing from json!");
		return f.dot;
	}
	if (!istext(rt.at(json, "transition_config"))) {
		log_world("transition_configmissing from json!");
		return f.dot;
	}
	if (!fexists((path = this.GetFullMapPath(rt.at(json, "map_path"), rt.at(json, "map_file"))))) {
		log_world(`Map file (${path}) does not exist!`);
		return f.dot;
	}
	if (rt.at(json, "transition_config") != "default") {
		if (!rt.istype(rt.at(json, "transition_config"), T("/list"))) {
			log_world("transition_config is not a list!");
			return f.dot;
		}
		jtcl = rt.at(json, "transition_config");
		for (I of each(jtcl)) {
			if (this.TransitionStringToEnum(I) === null) {
				log_world(`Invalid transition_config option: ${I}!`);
			}
			if (this.TransitionStringToEnum(rt.index(jtcl, I)) === null) {
				log_world(`Invalid transition_config option: ${I}!`);
			}
		}
	}
	return 1;
});

// map_config.dm:109
rt.def("/datum/map_config/proc/TransitionStringToEnum", function TransitionStringToEnum(f: Frame, string: Value) {
	if (string === "CROSSLINKED") {
		return 2;
	} else if (string === "SELFLOOPING") {
		return SELFLOOPING;
	} else if (string === "UNAFFECTED") {
		return 0;
	} else if (string === "MAIN_STATION") {
		return "Main Station";
	} else if (string === "CENTCOMM") {
		return "CentComm";
	} else if (string === "MINING") {
		return "Mining Asteroid";
	} else if (string === "EMPTY_AREA_1") {
		return "Empty Area 1";
	} else if (string === "EMPTY_AREA_2") {
		return "Empty Area 2";
	} else if (string === "EMPTY_AREA_3") {
		return "Empty Area 3";
	} else if (string === "EMPTY_AREA_4") {
		return "Empty Area 4";
	} else if (string === "EMPTY_AREA_5") {
		return "Empty Area 5";
	} else if (string === "EMPTY_AREA_6") {
		return "Empty Area 6";
	} else if (string === "EMPTY_AREA_7") {
		return "Empty Area 7";
	} else if (string === "EMPTY_AREA_8") {
		return "Empty Area 8";
	}
	return f.dot;
});

// map_config.dm:140
rt.def("/datum/map_config/proc/GetFullMapPath", function GetFullMapPath(f: Frame, mp: Value, mf: Value) {
	mp ??= this.map_path;
	mf ??= this.map_file;
	return `_maps/${mp}/${mf}`;
});

// map_config.dm:143
rt.def("/datum/map_config/proc/MakeNextMap", function MakeNextMap(f: Frame) {
	return ((this.config_filename == "data/next_map.json" ? 1 : 0) || fcopy(this.config_filename, "data/next_map.json"));
});
