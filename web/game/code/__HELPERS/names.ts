// From code/__HELPERS/names.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/lizard_name  (code/__HELPERS/names.dm:4)
rt.def("/proc/lizard_name", function lizard_name(f: Frame, gender: Value) {
	if (isEqual(live(gender), "male")) {
		return fmt("＀-＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("lizard_names_male")]), rt.op(f, "PickUnweighted", [1], [rt.gl("lizard_names_male")])]);
	}
	return fmt("＀-＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("lizard_names_female")]), rt.op(f, "PickUnweighted", [1], [rt.gl("lizard_names_female")])]);
});

// /proc/plasmaman_name  (code/__HELPERS/names.dm:10)
rt.def("/proc/plasmaman_name", function plasmaman_name(f: Frame) {
	return fmt("＀ ３！", [rt.op(f, "PickUnweighted", [1], [rt.gl("plasmaman_names")]), rt.call(f, P("/proc/rand"), null, [1, 99])]);
});

// /proc/church_name  (code/__HELPERS/names.dm:17)
rt.def("/proc/church_name", function church_name(f: Frame) {
	let name: Value = null;
	f.vars = () => [name];
	if (truthy(rt.gl("church_name"))) {
		return rt.gl("church_name");
	}
	name = "";
	name = rt.modify(live(name), rt.op(f, "PickUnweighted", [5], ["Holy", "United", "First", "Second", "Last"]), add);
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		name = rt.modify(live(name), " Space", add);
	}
	name = rt.modify(live(name), add(" ", rt.op(f, "PickUnweighted", [6], ["Church", "Cathedral", "Body", "Worshippers", "Movement", "Witnesses"])), add);
	return (name = rt.modify(live(name), fmt(" of ＀", [rt.call(f, P("/proc/religion_name"), null, [])]), add));
});

// /datum/controller/global_vars/proc/InitGlobalcommand_name  (code/__HELPERS/names.dm:29)
rt.def("/datum/controller/global_vars/proc/InitGlobalcommand_name", function InitGlobalcommand_name(f: Frame) {
	rt.setGl("command_name", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "command_name", add);
	return f.dot;
});

// /proc/command_name  (code/__HELPERS/names.dm:34)
rt.def("/proc/command_name", function command_name(f: Frame) {
	let name: Value = null;
	f.vars = () => [name];
	if (truthy(rt.gl("command_name"))) {
		return rt.gl("command_name");
	}
	rt.setGl("command_name", (name = "Central Command"));
	return live(name);
});

// /proc/change_command_name  (code/__HELPERS/names.dm:41)
rt.def("/proc/change_command_name", function change_command_name(f: Frame, name: Value) {
	rt.setGl("command_name", live(name));
	return live(name);
});

// /proc/religion_name  (code/__HELPERS/names.dm:50)
rt.def("/proc/religion_name", function religion_name(f: Frame) {
	let name: Value = null;
	f.vars = () => [name];
	if (truthy(rt.gl("religion_name"))) {
		return rt.gl("religion_name");
	}
	name = "";
	name = rt.modify(live(name), rt.op(f, "PickUnweighted", [19], ["bee", "science", "edu", "captain", "assistant", "monkey", "alien", "space", "unit", "sprocket", "gadget", "bomb", "revolution", "beyond", "station", "goon", "robot", "ivor", "hobnob"]), add);
	return rt.call(f, P("/proc/capitalize"), null, [(name = rt.modify(live(name), rt.op(f, "PickUnweighted", [8], ["ism", "ia", "ology", "istism", "ites", "ick", "ian", "ity"]), add))]);
});

// /proc/station_name  (code/__HELPERS/names.dm:58)
rt.def("/proc/station_name", function station_name(f: Frame) {
	let newname: Value = null;
	f.vars = () => [newname];
	if (!truthy(rt.gl("station_name"))) {
		newname = null;
		if ((truthy(rt.gl("config")) && truthy(rt.fv(f, "station_name", rt.gl("config"))))) {
			newname = rt.fv(f, "station_name", rt.gl("config"));
		} else {
			newname = rt.call(f, P("/proc/new_station_name"), null, []);
		}
		rt.call(f, P("/proc/set_station_name"), null, [live(newname)]);
	}
	return rt.gl("station_name");
});

// /proc/set_station_name  (code/__HELPERS/names.dm:70)
rt.def("/proc/set_station_name", function set_station_name(f: Frame, newname: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.setGl("station_name", live(newname));
	if ((truthy(rt.gl("config")) && truthy(rt.fv(f, "server_name", rt.gl("config"))))) {
		$0 = rt.world();
		$1 = rt.fv(f, "server_name", rt.gl("config"));
		if (isEqual(rt.fv(f, "server_name", rt.gl("config")), rt.gl("station_name"))) {
			$2 = "";
		} else {
			$2 = fmt(": ＀", [rt.gl("station_name")]);
		}
		rt.setFv(f, "name", $0, fmt("＀＀", [$1, $2]));
	} else {
		rt.setFv(f, "name", rt.world(), rt.gl("station_name"));
	}
	return f.dot;
});

// /proc/new_station_name  (code/__HELPERS/names.dm:79)
rt.def("/proc/new_station_name", function new_station_name(f: Frame) {
	let random: Value = null, name: Value = null, new_station_name: Value = null, holiday_name: Value = null, holiday: Value = null;
	let $0: any, $e: any;
	f.vars = () => [random, name, new_station_name, holiday_name, holiday, $0, $e];
	random = rt.call(f, P("/proc/rand"), null, [1, 5]);
	name = "";
	new_station_name = "";
	if (truthy(rt.op(f, "Prob", [], [10]))) {
		new_station_name = add((name = rt.op(f, "PickUnweighted", [1], [rt.gl("station_prefixes")])), " ");
		name = "";
	}
	holiday_name = null;
	rt.forList(f, 0, rt.fv(f, "holidays", rt.gl("SSevents")));
	while (($e = rt.next(f, 0)) !== undefined) {
		holiday_name = $e;
		if (isEqual(live(holiday_name), "Friday the 13th")) {
			random = 13;
		}
		name = rt.callName(f, (holiday = rt.index(rt.fv(f, "holidays", rt.gl("SSevents")), live(holiday_name))), "getStationPrefix", []);
	}
	rt.endFor(f, 0);
	if (!truthy(live(name))) {
		name = rt.op(f, "PickUnweighted", [1], [rt.gl("station_names")]);
	}
	if (truthy(live(name))) {
		new_station_name = rt.modify(live(new_station_name), add(live(name), " "), add);
	}
	new_station_name = rt.modify(live(new_station_name), add((name = rt.op(f, "PickUnweighted", [1], [rt.gl("station_suffixes")])), " "), add);
	$0 = live(random);
	if ($0 === 1) {
		new_station_name = rt.modify(live(new_station_name), fmt("＀", [rt.call(f, P("/proc/rand"), null, [1, 99])]), add);
	} else if ($0 === 2) {
		new_station_name = rt.modify(live(new_station_name), rt.op(f, "PickUnweighted", [1], [rt.gl("greek_letters")]), add);
	} else if ($0 === 3) {
		new_station_name = rt.modify(live(new_station_name), fmt("３！", [rt.call(f, P("/proc/rand"), null, [1, 99])]), add);
	} else if ($0 === 4) {
		new_station_name = rt.modify(live(new_station_name), rt.op(f, "PickUnweighted", [1], [rt.gl("phonetic_alphabet")]), add);
	} else if ($0 === 5) {
		new_station_name = rt.modify(live(new_station_name), rt.op(f, "PickUnweighted", [1], [rt.gl("numbers_as_words")]), add);
	} else if ($0 === 13) {
		new_station_name = rt.modify(live(new_station_name), rt.op(f, "PickUnweighted", [3], ["13", "XIII", "Thirteen"]), add);
	}
	return live(new_station_name);
});

// /proc/syndicate_name  (code/__HELPERS/names.dm:126)
rt.def("/proc/syndicate_name", function syndicate_name(f: Frame) {
	let name: Value = null;
	f.vars = () => [name];
	if (truthy(rt.gl("syndicate_name"))) {
		return rt.gl("syndicate_name");
	}
	name = "";
	name = rt.modify(live(name), rt.op(f, "PickUnweighted", [14], ["Clandestine", "Prima", "Blue", "Zero-G", "Max", "Blasto", "Waffle", "North", "Omni", "Newton", "Cyber", "Bonk", "Gene", "Gib"]), add);
	if (truthy(rt.op(f, "Prob", [], [80]))) {
		name = rt.modify(live(name), " ", add);
		if (truthy(rt.op(f, "Prob", [], [60]))) {
			name = rt.modify(live(name), rt.op(f, "PickUnweighted", [20], ["Syndicate", "Consortium", "Collective", "Corporation", "Group", "Holdings", "Biotech", "Industries", "Systems", "Products", "Chemicals", "Enterprises", "Family", "Creations", "International", "Intergalactic", "Interplanetary", "Foundation", "Positronics", "Hive"]), add);
		} else {
			name = rt.modify(live(name), rt.op(f, "PickUnweighted", [8], ["Syndi", "Corp", "Bio", "System", "Prod", "Chem", "Inter", "Hive"]), add);
			name = rt.modify(live(name), rt.op(f, "PickUnweighted", [2], ["", "-"]), add);
			name = rt.modify(live(name), rt.op(f, "PickUnweighted", [7], ["Tech", "Sun", "Co", "Tek", "X", "Inc", "Code"]), add);
		}
	} else {
		name = rt.modify(live(name), rt.op(f, "PickUnweighted", [3], ["-", "*", ""]), add);
		name = rt.modify(live(name), rt.op(f, "PickUnweighted", [11], ["Tech", "Sun", "Co", "Tek", "X", "Inc", "Gen", "Star", "Dyne", "Code", "Hive"]), add);
	}
	rt.setGl("syndicate_name", live(name));
	return live(name);
});

// /datum/controller/global_vars/proc/InitGlobalsyndicate_code_phrase  (code/__HELPERS/names.dm:153)
rt.def("/datum/controller/global_vars/proc/InitGlobalsyndicate_code_phrase", function InitGlobalsyndicate_code_phrase(f: Frame) {
	rt.setGl("syndicate_code_phrase", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "syndicate_code_phrase", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsyndicate_code_response  (code/__HELPERS/names.dm:154)
rt.def("/datum/controller/global_vars/proc/InitGlobalsyndicate_code_response", function InitGlobalsyndicate_code_response(f: Frame) {
	rt.setGl("syndicate_code_response", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "syndicate_code_response", add);
	return f.dot;
});

// /proc/generate_code_phrase  (code/__HELPERS/names.dm:172)
rt.def("/proc/generate_code_phrase", function generate_code_phrase(f: Frame, return_list: Value) {
	let words: Value = null, safety: Value = null, nouns: Value = null, objects: Value = null, adjectives: Value = null, threats: Value = null, foods: Value = null, drinks: Value = null, locations: Value = null, names: Value = null, t: Value = null, maxwords: Value = null, new_name: Value = null;
	let $0: any, $e: any;
	f.vars = () => [return_list, words, safety, nouns, objects, adjectives, threats, foods, drinks, locations, names, t, maxwords, new_name, $0, $e];
	if (live(return_list) === null) {
		return_list = 0;
	}
	if (!truthy(live(return_list))) {
		f.dot = "";
	} else {
		f.dot = rt.list();
	}
	words = rt.op(f, "PickWeighted", [4], [50, 2, 200, 3, 50, 4, 25, 5]);
	safety = rt.list(1, 2, 3);
	nouns = rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionabstract"]);
	objects = rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionobjects"]);
	adjectives = rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionadjectives"]);
	threats = rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionthreats"]);
	foods = rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionfood"]);
	drinks = rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "iondrinks"]);
	if (truthy(rt.len(f, rt.gl("teleportlocs")))) {
		$0 = rt.gl("teleportlocs");
	} else {
		$0 = live(drinks);
	}
	locations = $0;
	names = rt.list();
	t = null;
	rt.forList(f, 0, rt.fv(f, "general", rt.gl("data_core")), T("/datum/data/record"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		names = rt.modify(live(names), rt.index(rt.fv(f, "fields", live(t)), "name"), add);
	}
	rt.endFor(f, 0);
	maxwords = live(words);
	live(words);
	while (rt.gt(live(words), 0)) {
		if (((isEqual(live(words), 1) && truthy((rt.isIn(f, 1, live(safety)) ? 1 : 0))) && truthy((rt.isIn(f, 2, live(safety)) ? 1 : 0)))) {
			safety = rt.list(rt.op(f, "PickUnweighted", [2], [1, 2]));
		} else {
			if ((isEqual(live(words), 1) && isEqual(live(maxwords), 2))) {
				safety = rt.list(3);
			}
		}
		$0 = rt.op(f, "PickUnweighted", [1], [live(safety)]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
			if ($0 === 1) {
				if ((truthy(rt.len(f, live(names))) && truthy(rt.op(f, "Prob", [], [70])))) {
					f.dot = rt.modify(live(f.dot), rt.op(f, "PickUnweighted", [1], [live(names)]), add);
				} else {
					if (truthy(rt.op(f, "Prob", [], [10]))) {
						f.dot = rt.modify(live(f.dot), rt.op(f, "PickUnweighted", [2], [rt.call(f, P("/proc/lizard_name"), null, ["male"]), rt.call(f, P("/proc/lizard_name"), null, ["female"])]), add);
					} else {
						new_name = rt.op(f, "PickUnweighted", [1], [rt.op(f, "PickUnweighted", [2], [rt.gl("first_names_male"), rt.gl("first_names_female")])]);
						new_name = rt.modify(live(new_name), " ", add);
						f.dot = rt.modify(live(f.dot), (new_name = rt.modify(live(new_name), rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")]), add)), add);
					}
				}
			} else if ($0 === 2) {
				f.dot = rt.modify(live(f.dot), rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/get_all_jobs"), null, [])]), add);
			}
			(safety = rt.modify(live(safety), 1, subtract));
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
			if ($0 === 1) {
				f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/lowertext"), null, [rt.op(f, "PickUnweighted", [1], [live(drinks)])]), add);
			} else if ($0 === 2) {
				f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/lowertext"), null, [rt.op(f, "PickUnweighted", [1], [live(foods)])]), add);
			} else if ($0 === 3) {
				f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/lowertext"), null, [rt.op(f, "PickUnweighted", [1], [live(locations)])]), add);
			}
			(safety = rt.modify(live(safety), 2, subtract));
		} else if ($0 === 3) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/lowertext"), null, [rt.op(f, "PickUnweighted", [1], [live(nouns)])]), add);
			} else if ($0 === 2) {
				f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/lowertext"), null, [rt.op(f, "PickUnweighted", [1], [live(objects)])]), add);
			} else if ($0 === 3) {
				f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/lowertext"), null, [rt.op(f, "PickUnweighted", [1], [live(adjectives)])]), add);
			} else if ($0 === 4) {
				f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/lowertext"), null, [rt.op(f, "PickUnweighted", [1], [live(threats)])]), add);
			}
		}
		if (!truthy(live(return_list))) {
			if (isEqual(live(words), 1)) {
				f.dot = rt.modify(live(f.dot), ".", add);
			} else {
				f.dot = rt.modify(live(f.dot), ", ", add);
			}
		}
		words = rt.inc(live(words), -1);
	}
	return f.dot;
});
