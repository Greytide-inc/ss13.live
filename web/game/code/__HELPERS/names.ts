// Based on /tg/station's code/__HELPERS/names.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// names.dm:4
rt.def("/proc/lizard_name", function lizard_name(f: Frame, gender: Value) {
	if (gender == "male") {
		return `${pick(GLOB.lizard_names_male)}-${pick(GLOB.lizard_names_male)}`;
	}
	return `${pick(GLOB.lizard_names_female)}-${pick(GLOB.lizard_names_female)}`;
});

// names.dm:10
rt.def("/proc/plasmaman_name", function plasmaman_name(f: Frame) {
	return fmt("＀ ３！", [pick(GLOB.plasmaman_names), rand(1, 99)]);
});

// names.dm:17
rt.def("/proc/church_name", function church_name(f: Frame) {
	if (GLOB.church_name) {
		return GLOB.church_name;
	}
	let name: Value = "";
	name += pick("Holy", "United", "First", "Second", "Last");
	if (prob(20)) {
		name += " Space";
	}
	name += " " + pick("Church", "Cathedral", "Body", "Worshippers", "Movement", "Witnesses");
	return (name += ` of ${religion_name()}`);
});

// names.dm:29
rt.def("/datum/controller/global_vars/proc/InitGlobalcommand_name", function InitGlobalcommand_name(f: Frame) {
	GLOB.command_name = null;
	this.gvars_datum_init_order += "command_name";
	return f.dot;
});

// names.dm:34
rt.def("/proc/command_name", function command_name(f: Frame) {
	let name: Value = null;
	if (GLOB.command_name) {
		return GLOB.command_name;
	}
	GLOB.command_name = (name = "Central Command");
	return name;
});

// names.dm:41
rt.def("/proc/change_command_name", function change_command_name(f: Frame, name: Value) {
	GLOB.command_name = name;
	return name;
});

// names.dm:50
rt.def("/proc/religion_name", function religion_name(f: Frame) {
	if (GLOB.religion_name) {
		return GLOB.religion_name;
	}
	let name: Value = "";
	name += pick("bee", "science", "edu", "captain", "assistant", "monkey", "alien", "space", "unit", "sprocket", "gadget", "bomb", "revolution", "beyond", "station", "goon", "robot", "ivor", "hobnob");
	return capitalize((name += pick("ism", "ia", "ology", "istism", "ites", "ick", "ian", "ity")));
});

// names.dm:58
rt.def("/proc/station_name", function station_name(f: Frame) {
	let newname: Value = null;
	if (!GLOB.station_name) {
		if (GLOB.config && GLOB.config.station_name) {
			newname = GLOB.config.station_name;
		} else {
			newname = new_station_name();
		}
		set_station_name(newname);
	}
	return GLOB.station_name;
});

// names.dm:70
rt.def("/proc/set_station_name", function set_station_name(f: Frame, newname: Value) {
	GLOB.station_name = newname;
	if (GLOB.config && GLOB.config.server_name) {
		rt.world().name = `${GLOB.config.server_name}${GLOB.config.server_name == GLOB.station_name ? "" : `: ${GLOB.station_name}`}`;
	} else {
		rt.world().name = GLOB.station_name;
	}
	return f.dot;
});

// names.dm:79
rt.def("/proc/new_station_name", function new_station_name(f: Frame) {
	let holiday_name: Value = null, holiday: Value = null;
	let $e: any;
	let random: Value = rand(1, 5);
	let name: Value = "";
	let new_station_name: Value = "";
	if (prob(10)) {
		new_station_name = (name = pick(GLOB.station_prefixes)) + " ";
		name = "";
	}
	for (holiday_name of each(GLOB.SSevents.holidays)) {
		if (holiday_name == "Friday the 13th") {
			random = 13;
		}
		name = (holiday = rt.index(GLOB.SSevents.holidays, holiday_name)).getStationPrefix();
	}
	if (!name) {
		name = pick(GLOB.station_names);
	}
	if (name) {
		new_station_name += name + " ";
	}
	new_station_name += (name = pick(GLOB.station_suffixes)) + " ";
	if (random === 1) {
		new_station_name += `${rand(1, 99)}`;
	} else if (random === 2) {
		new_station_name += pick(GLOB.greek_letters);
	} else if (random === 3) {
		new_station_name += fmt("３！", [rand(1, 99)]);
	} else if (random === 4) {
		new_station_name += pick(GLOB.phonetic_alphabet);
	} else if (random === 5) {
		new_station_name += pick(GLOB.numbers_as_words);
	} else if (random === 13) {
		new_station_name += pick("13", "XIII", "Thirteen");
	}
	return new_station_name;
});

// names.dm:126
rt.def("/proc/syndicate_name", function syndicate_name(f: Frame) {
	if (GLOB.syndicate_name) {
		return GLOB.syndicate_name;
	}
	let name: Value = "";
	name += pick("Clandestine", "Prima", "Blue", "Zero-G", "Max", "Blasto", "Waffle", "North", "Omni", "Newton", "Cyber", "Bonk", "Gene", "Gib");
	if (prob(80)) {
		name += " ";
		if (prob(60)) {
			name += pick("Syndicate", "Consortium", "Collective", "Corporation", "Group", "Holdings", "Biotech", "Industries", "Systems", "Products", "Chemicals", "Enterprises", "Family", "Creations", "International", "Intergalactic", "Interplanetary", "Foundation", "Positronics", "Hive");
		} else {
			name += pick("Syndi", "Corp", "Bio", "System", "Prod", "Chem", "Inter", "Hive");
			name += pick("", "-");
			name += pick("Tech", "Sun", "Co", "Tek", "X", "Inc", "Code");
		}
	} else {
		name += pick("-", "*", "");
		name += pick("Tech", "Sun", "Co", "Tek", "X", "Inc", "Gen", "Star", "Dyne", "Code", "Hive");
	}
	GLOB.syndicate_name = name;
	return name;
});

// names.dm:153
rt.def("/datum/controller/global_vars/proc/InitGlobalsyndicate_code_phrase", function InitGlobalsyndicate_code_phrase(f: Frame) {
	GLOB.syndicate_code_phrase = null;
	this.gvars_datum_init_order += "syndicate_code_phrase";
	return f.dot;
});

// names.dm:154
rt.def("/datum/controller/global_vars/proc/InitGlobalsyndicate_code_response", function InitGlobalsyndicate_code_response(f: Frame) {
	GLOB.syndicate_code_response = null;
	this.gvars_datum_init_order += "syndicate_code_response";
	return f.dot;
});

// names.dm:172
rt.def("/proc/generate_code_phrase", function generate_code_phrase(f: Frame, return_list: Value) {
	let t: Value = null, new_name: Value = null;
	let $e: any;
	return_list ??= 0;
	if (!return_list) {
		f.dot = "";
	} else {
		f.dot = list();
	}
	let words: Value = rt.op(f, "PickWeighted", [4], [50, 2, 200, 3, 50, 4, 25, 5]);
	let safety: Value = list(1, 2, 3);
	let nouns: Value = strings("ion_laws.json", "ionabstract");
	let objects: Value = strings("ion_laws.json", "ionobjects");
	let adjectives: Value = strings("ion_laws.json", "ionadjectives");
	let threats: Value = strings("ion_laws.json", "ionthreats");
	let foods: Value = strings("ion_laws.json", "ionfood");
	let drinks: Value = strings("ion_laws.json", "iondrinks");
	let locations: Value = rt.len(f, GLOB.teleportlocs) ? GLOB.teleportlocs : drinks;
	let names: Value = list();
	for (t of each(GLOB.data_core.general, T("/datum/data/record"))) {
		names += rt.index(t.fields, "name");
	}
	let maxwords: Value = words;
	words;
	while (words > 0) {
		if (words == 1 && rt.isIn(f, 1, safety) && rt.isIn(f, 2, safety)) {
			safety = list(pick(1, 2));
		} else if (words == 1 && maxwords == 2) {
			safety = list(3);
		}
		const chosen = pick(safety);
		if (chosen === 1) {
			const die = rand(1, 2);
			if (die === 1) {
				if (rt.len(f, names) && prob(70)) {
					f.dot += pick(names);
				} else if (prob(10)) {
					f.dot += pick(lizard_name("male"), lizard_name("female"));
				} else {
					new_name = pick(pick(GLOB.first_names_male, GLOB.first_names_female));
					new_name += " ";
					f.dot += (new_name += pick(GLOB.last_names));
				}
			} else if (die === 2) {
				f.dot += pick(get_all_jobs());
			}
			safety -= 1;
		} else if (chosen === 2) {
			const die = rand(1, 3);
			if (die === 1) {
				f.dot += lowertext(pick(drinks));
			} else if (die === 2) {
				f.dot += lowertext(pick(foods));
			} else if (die === 3) {
				f.dot += lowertext(pick(locations));
			}
			safety -= 2;
		} else if (chosen === 3) {
			const die = rand(1, 4);
			if (die === 1) {
				f.dot += lowertext(pick(nouns));
			} else if (die === 2) {
				f.dot += lowertext(pick(objects));
			} else if (die === 3) {
				f.dot += lowertext(pick(adjectives));
			} else if (die === 4) {
				f.dot += lowertext(pick(threats));
			}
		}
		if (!return_list) {
			if (words == 1) {
				f.dot += ".";
			} else {
				f.dot += ", ";
			}
		}
		words--;
	}
	return f.dot;
});
