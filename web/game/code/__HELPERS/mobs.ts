// From code/__HELPERS/mobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/random_blood_type  (code/__HELPERS/mobs.dm:5)
rt.def("/proc/random_blood_type", function random_blood_type(f: Frame) {
	return rt.op(f, "PickWeighted", [8], [4, "O-", 36, "O+", 3, "A-", 28, "A+", 1, "B-", 20, "B+", 1, "AB-", 5, "AB+"]);
});

// /proc/random_eye_color  (code/__HELPERS/mobs.dm:8)
rt.def("/proc/random_eye_color", function random_eye_color(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.op(f, "PickWeighted", [7], [20, "brown", 20, "hazel", 20, "grey", 15, "blue", 15, "green", 1, "amber", 1, "albino"]);
	if ($0 === "brown") {
		return "630";
	} else if ($0 === "hazel") {
		return "542";
	} else if ($0 === "grey") {
		return rt.op(f, "PickUnweighted", [7], ["666", "777", "888", "999", "aaa", "bbb", "ccc"]);
	} else if ($0 === "blue") {
		return "36c";
	} else if ($0 === "green") {
		return "060";
	} else if ($0 === "amber") {
		return "fc0";
	} else if ($0 === "albino") {
		return add(add(rt.op(f, "PickUnweighted", [4], ["c", "d", "e", "f"]), rt.op(f, "PickUnweighted", [10], ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])), rt.op(f, "PickUnweighted", [10], ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]));
	} else {
		return "000";
	}
	return f.dot;
});

// /proc/random_underwear  (code/__HELPERS/mobs.dm:27)  may sleep
rt.def("/proc/random_underwear", function* random_underwear(f: Frame, gender: Value) {
	let $0: any;
	f.vars = () => [gender, $0];
	if (!truthy(rt.len(f, rt.gl("underwear_list")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/underwear"), rt.gl("underwear_list"), rt.gl("underwear_m"), rt.gl("underwear_f")]);
	}
	$0 = live(gender);
	if ($0 === "male") {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("underwear_m")]);
	} else if ($0 === "female") {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("underwear_f")]);
	} else {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("underwear_list")]);
	}
	return f.dot;
}, true);

// /proc/random_undershirt  (code/__HELPERS/mobs.dm:38)  may sleep
rt.def("/proc/random_undershirt", function* random_undershirt(f: Frame, gender: Value) {
	let $0: any;
	f.vars = () => [gender, $0];
	if (!truthy(rt.len(f, rt.gl("undershirt_list")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/undershirt"), rt.gl("undershirt_list"), rt.gl("undershirt_m"), rt.gl("undershirt_f")]);
	}
	$0 = live(gender);
	if ($0 === "male") {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("undershirt_m")]);
	} else if ($0 === "female") {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("undershirt_f")]);
	} else {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("undershirt_list")]);
	}
	return f.dot;
}, true);

// /proc/random_socks  (code/__HELPERS/mobs.dm:49)  may sleep
rt.def("/proc/random_socks", function* random_socks(f: Frame) {
	if (!truthy(rt.len(f, rt.gl("socks_list")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/socks"), rt.gl("socks_list")]);
	}
	return rt.op(f, "PickUnweighted", [1], [rt.gl("socks_list")]);
}, true);

// /proc/random_features  (code/__HELPERS/mobs.dm:54)  may sleep
rt.def("/proc/random_features", function* random_features(f: Frame) {
	if (!truthy(rt.len(f, rt.gl("tails_list_human")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/tails/human"), rt.gl("tails_list_human")]);
	}
	if (!truthy(rt.len(f, rt.gl("tails_list_lizard")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/tails/lizard"), rt.gl("tails_list_lizard")]);
	}
	if (!truthy(rt.len(f, rt.gl("snouts_list")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/snouts"), rt.gl("snouts_list")]);
	}
	if (!truthy(rt.len(f, rt.gl("horns_list")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/horns"), rt.gl("horns_list")]);
	}
	if (!truthy(rt.len(f, rt.gl("ears_list")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/ears"), rt.gl("horns_list")]);
	}
	if (!truthy(rt.len(f, rt.gl("frills_list")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/frills"), rt.gl("frills_list")]);
	}
	if (!truthy(rt.len(f, rt.gl("spines_list")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/spines"), rt.gl("spines_list")]);
	}
	if (!truthy(rt.len(f, rt.gl("legs_list")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/legs"), rt.gl("legs_list")]);
	}
	if (!truthy(rt.len(f, rt.gl("body_markings_list")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/body_markings"), rt.gl("body_markings_list")]);
	}
	if (!truthy(rt.len(f, rt.gl("wings_list")))) {
		yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/wings"), rt.gl("wings_list")]);
	}
	return rt.alist(f, ["mcolor", rt.op(f, "PickUnweighted", [8], ["FFFFFF", "7F7F7F", "7FFF7F", "7F7FFF", "FF7F7F", "7FFFFF", "FF7FFF", "FFFF7F"]), "tail_lizard", rt.op(f, "PickUnweighted", [1], [rt.gl("tails_list_lizard")]), "tail_human", "None", "wings", "None", "snout", rt.op(f, "PickUnweighted", [1], [rt.gl("snouts_list")]), "horns", rt.op(f, "PickUnweighted", [1], [rt.gl("horns_list")]), "ears", "None", "frills", rt.op(f, "PickUnweighted", [1], [rt.gl("frills_list")]), "spines", rt.op(f, "PickUnweighted", [1], [rt.gl("spines_list")]), "body_markings", rt.op(f, "PickUnweighted", [1], [rt.gl("body_markings_list")]), "legs", "Normal Legs"]);
}, true);

// /proc/random_hair_style  (code/__HELPERS/mobs.dm:79)
rt.def("/proc/random_hair_style", function random_hair_style(f: Frame, gender: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(gender);
	if ($0 === "male") {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("hair_styles_male_list")]);
	} else if ($0 === "female") {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("hair_styles_female_list")]);
	} else {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("hair_styles_list")]);
	}
	return f.dot;
});

// /proc/random_facial_hair_style  (code/__HELPERS/mobs.dm:88)
rt.def("/proc/random_facial_hair_style", function random_facial_hair_style(f: Frame, gender: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(gender);
	if ($0 === "male") {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("facial_hair_styles_male_list")]);
	} else if ($0 === "female") {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("facial_hair_styles_female_list")]);
	} else {
		return rt.op(f, "PickUnweighted", [1], [rt.gl("facial_hair_styles_list")]);
	}
	return f.dot;
});

// /proc/random_unique_name  (code/__HELPERS/mobs.dm:97)
rt.def("/proc/random_unique_name", function random_unique_name(f: Frame, gender: Value, attempts_to_find_unique_name: Value) {
	let i: Value = null;
	f.vars = () => [attempts_to_find_unique_name, i];
	if (live(attempts_to_find_unique_name) === null) {
		attempts_to_find_unique_name = 10;
	}
	i = null;
	i = 1;
	while (rt.le(live(i), live(attempts_to_find_unique_name))) {
		if (isEqual(live(gender), "female")) {
			f.dot = add(add(rt.call(f, P("/proc/capitalize"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_female")])]), " "), rt.call(f, P("/proc/capitalize"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]));
		} else {
			f.dot = add(add(rt.call(f, P("/proc/capitalize"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")])]), " "), rt.call(f, P("/proc/capitalize"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]));
		}
		if ((!isEqual(live(i), live(attempts_to_find_unique_name)) && !truthy(rt.call(f, P("/proc/findname"), null, [live(f.dot)])))) {
			break;
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
});

// /proc/random_unique_lizard_name  (code/__HELPERS/mobs.dm:107)
rt.def("/proc/random_unique_lizard_name", function random_unique_lizard_name(f: Frame, gender: Value, attempts_to_find_unique_name: Value) {
	let i: Value = null;
	f.vars = () => [attempts_to_find_unique_name, i];
	if (live(attempts_to_find_unique_name) === null) {
		attempts_to_find_unique_name = 10;
	}
	i = null;
	i = 1;
	while (rt.le(live(i), live(attempts_to_find_unique_name))) {
		f.dot = rt.call(f, P("/proc/capitalize"), null, [rt.call(f, P("/proc/lizard_name"), null, [live(gender)])]);
		if ((!isEqual(live(i), live(attempts_to_find_unique_name)) && !truthy(rt.call(f, P("/proc/findname"), null, [live(f.dot)])))) {
			break;
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
});

// /proc/random_unique_plasmaman_name  (code/__HELPERS/mobs.dm:114)
rt.def("/proc/random_unique_plasmaman_name", function random_unique_plasmaman_name(f: Frame, attempts_to_find_unique_name: Value) {
	let i: Value = null;
	f.vars = () => [attempts_to_find_unique_name, i];
	if (live(attempts_to_find_unique_name) === null) {
		attempts_to_find_unique_name = 10;
	}
	i = null;
	i = 1;
	while (rt.le(live(i), live(attempts_to_find_unique_name))) {
		f.dot = rt.call(f, P("/proc/capitalize"), null, [rt.call(f, P("/proc/plasmaman_name"), null, [])]);
		if ((!isEqual(live(i), live(attempts_to_find_unique_name)) && !truthy(rt.call(f, P("/proc/findname"), null, [live(f.dot)])))) {
			break;
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
});

// /proc/random_skin_tone  (code/__HELPERS/mobs.dm:121)
rt.def("/proc/random_skin_tone", function random_skin_tone(f: Frame) {
	return rt.op(f, "PickUnweighted", [1], [rt.gl("skin_tones")]);
});

// /datum/controller/global_vars/proc/InitGlobalskin_tones  (code/__HELPERS/mobs.dm:123)
rt.def("/datum/controller/global_vars/proc/InitGlobalskin_tones", function InitGlobalskin_tones(f: Frame) {
	rt.setGl("skin_tones", rt.list("albino", "caucasian1", "caucasian2", "caucasian3", "latino", "mediterranean", "asian1", "asian2", "arab", "indian", "african1", "african2"));
	rt.modSrcVar(f, "gvars_datum_init_order", "skin_tones", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalspecies_list  (code/__HELPERS/mobs.dm:138)
rt.def("/datum/controller/global_vars/proc/InitGlobalspecies_list", function InitGlobalspecies_list(f: Frame) {
	rt.setGl("species_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "species_list", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalroundstart_species  (code/__HELPERS/mobs.dm:139)
rt.def("/datum/controller/global_vars/proc/InitGlobalroundstart_species", function InitGlobalroundstart_species(f: Frame) {
	rt.setGl("roundstart_species", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "roundstart_species", add);
	return f.dot;
});

// /proc/age2agedescription  (code/__HELPERS/mobs.dm:142)
rt.def("/proc/age2agedescription", function age2agedescription(f: Frame, age: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(age);
	if (rt.inRange($0, 0, 1)) {
		return "infant";
	} else if (rt.inRange($0, 1, 3)) {
		return "toddler";
	} else if (rt.inRange($0, 3, 13)) {
		return "child";
	} else if (rt.inRange($0, 13, 19)) {
		return "teenager";
	} else if (rt.inRange($0, 19, 30)) {
		return "young adult";
	} else if (rt.inRange($0, 30, 45)) {
		return "adult";
	} else if (rt.inRange($0, 45, 60)) {
		return "middle-aged";
	} else if (rt.inRange($0, 60, 70)) {
		return "aging";
	} else if (rt.inRange($0, 70, 9.999999848243207e+30)) {
		return "elderly";
	} else {
		return "unknown";
	}
	return f.dot;
});

// /proc/add_logs  (code/__HELPERS/mobs.dm:174)
rt.def("/proc/add_logs", function add_logs(f: Frame, user: Value, target: Value, what_done: Value, object: Value, addition: Value) {
	let attack_location: Value = null, is_mob_user: Value = null, is_mob_target: Value = null, living_target: Value = null, hp: Value = null, starget: Value = null, ssource: Value = null, sobject: Value = null, sattackloc: Value = null, message: Value = null;
	f.vars = () => [object, addition, attack_location, is_mob_user, is_mob_target, living_target, hp, starget, ssource, sobject, sattackloc, message];
	if (live(object) === null) {
		object = null;
	}
	if (live(addition) === null) {
		addition = null;
	}
	attack_location = rt.getStep(f, live(target), 0);
	is_mob_user = (live(user) && rt.index(rt.gl("typecache_mob"), rt.fv(f, "type", live(user))));
	is_mob_target = (live(target) && rt.index(rt.gl("typecache_mob"), rt.fv(f, "type", live(target))));
	living_target = null;
	if ((truthy(live(target)) && truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0)))) {
		living_target = live(target);
	}
	hp = " ";
	if (truthy(live(living_target))) {
		hp = fmt("(NEWHP: ＀)", [rt.fv(f, "health", live(living_target))]);
	}
	starget = "NON-EXISTENT SUBJECT";
	if (truthy(live(target))) {
		if ((truthy(live(is_mob_target)) && truthy(rt.fv(f, "ckey", live(target))))) {
			starget = fmt("＀(＀)", [rt.fv(f, "name", live(target)), rt.fv(f, "ckey", live(target))]);
		} else {
			starget = fmt("＀", [rt.fv(f, "name", live(target))]);
		}
	}
	ssource = "NON-EXISTENT USER";
	if (truthy(live(user))) {
		if ((truthy(live(is_mob_user)) && truthy(rt.fv(f, "ckey", live(user))))) {
			ssource = fmt("＀(＀)", [rt.fv(f, "name", live(user)), rt.fv(f, "ckey", live(user))]);
		} else {
			ssource = fmt("＀", [rt.fv(f, "name", live(user))]);
		}
	}
	sobject = "";
	if (truthy(live(object))) {
		sobject = fmt("＀", [live(object)]);
	}
	sattackloc = "";
	if (truthy(live(attack_location))) {
		sattackloc = fmt("(＀,＀,＀)", [rt.fv(f, "x", live(attack_location)), rt.fv(f, "y", live(attack_location)), rt.fv(f, "z", live(attack_location))]);
	}
	if (truthy(live(is_mob_user))) {
		message = fmt("<font color='red'>has ＀ ＀ with ＀＀ ＀ ＀</font>", [live(what_done), live(starget), live(sobject), live(addition), live(hp), live(sattackloc)]);
		rt.callName(f, live(user), "log_message", [live(message), "Attack log"]);
	}
	if (truthy(live(is_mob_target))) {
		message = fmt("<font color='orange'>has been ＀ by ＀ with ＀＀ ＀ ＀</font>", [live(what_done), live(ssource), live(sobject), live(addition), live(hp), live(sattackloc)]);
		rt.callName(f, live(target), "log_message", [live(message), "Attack log"]);
	}
	rt.call(f, P("/proc/log_attack"), null, [fmt("＀ ＀ ＀ with ＀＀ ＀ ＀", [live(ssource), live(what_done), live(starget), live(sobject), live(addition), live(hp), live(sattackloc)])]);
	return f.dot;
});

// /proc/do_mob  (code/__HELPERS/mobs.dm:222)  may sleep
rt.def("/proc/do_mob", function* do_mob(f: Frame, user: Value, target: Value, time: Value, uninterruptible: Value, progress: Value, extra_checks: Value) {
	let user_loc: Value = null, drifting: Value = null, target_loc: Value = null, holding: Value = null, progbar: Value = null, endtime: Value = null, starttime: Value = null;
	f.vars = () => [user, target, time, uninterruptible, progress, extra_checks, user_loc, drifting, target_loc, holding, progbar, endtime, starttime];
	if (live(time) === null) {
		time = 30;
	}
	if (live(uninterruptible) === null) {
		uninterruptible = 0;
	}
	if (live(progress) === null) {
		progress = 1;
	}
	if (live(extra_checks) === null) {
		extra_checks = null;
	}
	if ((!truthy(live(user)) || !truthy(live(target)))) {
		return 0;
	}
	user_loc = rt.fv(f, "loc", live(user));
	drifting = 0;
	if ((!truthy((yield* g.callName(f, live(user), "Process_Spacemove", [0]))) && truthy(rt.fv(f, "inertia_dir", live(user))))) {
		drifting = 1;
	}
	target_loc = rt.fv(f, "loc", live(target));
	holding = (yield* g.callName(f, live(user), "get_active_held_item", []));
	progbar = null;
	if (truthy(live(progress))) {
		progbar = (yield* g.new_(f, T("/datum/progressbar"), [live(user), live(time), live(target)]));
	}
	endtime = add(rt.worldTime(f), live(time));
	starttime = rt.worldTime(f);
	f.dot = 1;
	while (rt.lt(rt.worldTime(f), live(endtime))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
		if (truthy(live(progress))) {
			yield* g.callName(f, live(progbar), "update", [subtract(rt.worldTime(f), live(starttime))]);
		}
		if (((!truthy(live(user)) || truthy(rt.fv(f, "gc_destroyed", live(user)))) || (!truthy(live(target)) || truthy(rt.fv(f, "gc_destroyed", live(target)))))) {
			f.dot = 0;
			break;
		}
		if (truthy(live(uninterruptible))) {
			continue;
		}
		if ((truthy(live(drifting)) && !truthy(rt.fv(f, "inertia_dir", live(user))))) {
			drifting = 0;
			user_loc = rt.fv(f, "loc", live(user));
		}
		if (((((((!truthy(live(drifting)) && !isEqual(rt.fv(f, "loc", live(user)), live(user_loc))) || !isEqual(rt.fv(f, "loc", live(target)), live(target_loc))) || !isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(holding))) || truthy((yield* g.callName(f, live(user), "incapacitated", [])))) || truthy(rt.fv(f, "lying", live(user)))) || (truthy(live(extra_checks)) && !truthy((yield* g.callName(f, live(extra_checks), "Invoke", [])))))) {
			f.dot = 0;
			break;
		}
	}
	if (!truthy(live(progress))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(progbar)]);
	return f.dot;
}, true);

// /mob/proc/break_do_after_checks  (code/__HELPERS/mobs.dm:263)
rt.def("/mob/proc/break_do_after_checks", function break_do_after_checks(f: Frame, checked_health: Value, check_clicks: Value) {
	if ((truthy(live(check_clicks)) && rt.gt(rt.sv(f, "next_move"), rt.worldTime(f)))) {
		return 0;
	}
	return 1;
}, false, { argTypes: [{ path: "/list" }, {  }] });

// /mob/living/proc/break_do_after_checks  (code/__HELPERS/mobs.dm:269)
rt.def("/mob/living/proc/break_do_after_checks", function break_do_after_checks(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/list")) ? 1 : 0))) {
		if (rt.lt(rt.sv(f, "health"), rt.at(live(f.args[0]), "health"))) {
			return 0;
		}
		rt.setAt(live(f.args[0]), "health", rt.sv(f, "health"));
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["checked_health", "check_clicks"] });

// /proc/do_after  (code/__HELPERS/mobs.dm:276)  may sleep
rt.def("/proc/do_after", function* do_after(f: Frame, user: Value, delay: Value, needhand: Value, target: Value, progress: Value, extra_checks: Value) {
	let Tloc: Value = null, Uloc: Value = null, drifting: Value = null, holding: Value = null, holdingnull: Value = null, progbar: Value = null, endtime: Value = null, starttime: Value = null;
	f.vars = () => [user, delay, needhand, target, progress, extra_checks, Tloc, Uloc, drifting, holding, holdingnull, progbar, endtime, starttime];
	if (live(needhand) === null) {
		needhand = 1;
	}
	if (live(target) === null) {
		target = null;
	}
	if (live(progress) === null) {
		progress = 1;
	}
	if (live(extra_checks) === null) {
		extra_checks = null;
	}
	if (!truthy(live(user))) {
		return 0;
	}
	Tloc = null;
	if (truthy(live(target))) {
		Tloc = rt.fv(f, "loc", live(target));
	}
	Uloc = rt.fv(f, "loc", live(user));
	drifting = 0;
	if ((!truthy((yield* g.callName(f, live(user), "Process_Spacemove", [0]))) && truthy(rt.fv(f, "inertia_dir", live(user))))) {
		drifting = 1;
	}
	holding = (yield* g.callName(f, live(user), "get_active_held_item", []));
	holdingnull = 1;
	if (truthy(live(holding))) {
		holdingnull = 0;
	}
	progbar = null;
	if (truthy(live(progress))) {
		progbar = (yield* g.new_(f, T("/datum/progressbar"), [live(user), live(delay), live(target)]));
	}
	endtime = add(rt.worldTime(f), live(delay));
	starttime = rt.worldTime(f);
	f.dot = 1;
	while (rt.lt(rt.worldTime(f), live(endtime))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
		if (truthy(live(progress))) {
			yield* g.callName(f, live(progbar), "update", [subtract(rt.worldTime(f), live(starttime))]);
		}
		if ((truthy(live(drifting)) && !truthy(rt.fv(f, "inertia_dir", live(user))))) {
			drifting = 0;
			Uloc = rt.fv(f, "loc", live(user));
		}
		if (((((((!truthy(live(user)) || truthy(rt.fv(f, "gc_destroyed", live(user)))) || truthy(rt.fv(f, "stat", live(user)))) || truthy((yield* g.callName(f, live(user), "IsKnockdown", [])))) || truthy((yield* g.callName(f, live(user), "IsStun", [])))) || (!truthy(live(drifting)) && !isEqual(rt.fv(f, "loc", live(user)), live(Uloc)))) || (truthy(live(extra_checks)) && !truthy((yield* g.callName(f, live(extra_checks), "Invoke", [])))))) {
			f.dot = 0;
			break;
		}
		if ((!(!truthy(live(Tloc)) || truthy(rt.fv(f, "gc_destroyed", live(Tloc)))) && ((!truthy(live(target)) || truthy(rt.fv(f, "gc_destroyed", live(target)))) || !isEqual(live(Tloc), rt.fv(f, "loc", live(target)))))) {
			if (((!isEqual(live(Uloc), live(Tloc)) || !isEqual(live(Tloc), live(user))) && !truthy(live(drifting)))) {
				f.dot = 0;
				break;
			}
		}
		if (truthy(live(needhand))) {
			if (!truthy(live(holdingnull))) {
				if (!truthy(live(holding))) {
					f.dot = 0;
					break;
				}
			}
			if (!isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(holding))) {
				f.dot = 0;
				break;
			}
		}
	}
	if (!truthy(live(progress))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(progbar)]);
	return f.dot;
}, true);

// /proc/do_after_mob  (code/__HELPERS/mobs.dm:333)  may sleep
rt.def("/proc/do_after_mob", function* do_after_mob(f: Frame, user: Value, targets: Value, time: Value, uninterruptible: Value, progress: Value, extra_checks: Value) {
	let user_loc: Value = null, drifting: Value = null, originalloc: Value = null, target: Value = null, holding: Value = null, progbar: Value = null, endtime: Value = null, starttime: Value = null, target_7: Value = null;
	let $e: any;
	f.vars = () => [user, targets, time, uninterruptible, progress, extra_checks, user_loc, drifting, originalloc, target, holding, progbar, endtime, starttime, target_7, $e];
	if (live(time) === null) {
		time = 30;
	}
	if (live(uninterruptible) === null) {
		uninterruptible = 0;
	}
	if (live(progress) === null) {
		progress = 1;
	}
	if ((!truthy(live(user)) || !truthy(live(targets)))) {
		return 0;
	}
	if (!truthy((rt.istype(live(targets), T("/list")) ? 1 : 0))) {
		targets = rt.list(live(targets));
	}
	user_loc = rt.fv(f, "loc", live(user));
	drifting = 0;
	if ((!truthy((yield* g.callName(f, live(user), "Process_Spacemove", [0]))) && truthy(rt.fv(f, "inertia_dir", live(user))))) {
		drifting = 1;
	}
	originalloc = rt.list();
	target = null;
	rt.forList(f, 0, live(targets), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		rt.setAt(live(originalloc), live(target), rt.fv(f, "loc", live(target)));
	}
	rt.endFor(f, 0);
	holding = (yield* g.callName(f, live(user), "get_active_held_item", []));
	progbar = null;
	if (truthy(live(progress))) {
		progbar = (yield* g.new_(f, T("/datum/progressbar"), [live(user), live(time), rt.index(live(targets), 1)]));
	}
	endtime = add(rt.worldTime(f), live(time));
	starttime = rt.worldTime(f);
	f.dot = 1;
	loop67: while (true) {
		if (!rt.lt(rt.worldTime(f), live(endtime))) break;
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		if (truthy(live(progress))) {
			yield* g.callName(f, live(progbar), "update", [subtract(rt.worldTime(f), live(starttime))]);
		}
		if (((!truthy(live(user)) || truthy(rt.fv(f, "gc_destroyed", live(user)))) || !truthy(live(targets)))) {
			f.dot = 0;
			break;
		}
		if (truthy(live(uninterruptible))) {
			continue;
		}
		if ((truthy(live(drifting)) && !truthy(rt.fv(f, "inertia_dir", live(user))))) {
			drifting = 0;
			user_loc = rt.fv(f, "loc", live(user));
		}
		target_7 = null;
		rt.forList(f, 0, live(targets), T("/atom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			target_7 = $e;
			if ((((((((!truthy(live(drifting)) && !isEqual(live(user_loc), rt.fv(f, "loc", live(user)))) || (!truthy(live(target_7)) || truthy(rt.fv(f, "gc_destroyed", live(target_7))))) || !isEqual(rt.index(live(originalloc), live(target_7)), rt.fv(f, "loc", live(target_7)))) || !isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(holding))) || truthy((yield* g.callName(f, live(user), "incapacitated", [])))) || truthy(rt.fv(f, "lying", live(user)))) || (truthy(live(extra_checks)) && !truthy((yield* g.callName(f, live(extra_checks), "Invoke", [])))))) {
				f.dot = 0;
				break loop67;
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(live(progbar))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(progbar)]);
	return f.dot;
}, true);

// /proc/is_species  (code/__HELPERS/mobs.dm:379)
rt.def("/proc/is_species", function is_species(f: Frame, A: Value, species_datum: Value) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = 0;
	if (!truthy((rt.istype(live(A), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!(truthy(rt.gv(f, "dna", (H = live(A)))) && truthy(rt.op(f, "IsType", [], [rt.gv(f, "species", rt.fv(f, "dna", live(H))), live(species_datum)])))) return f.dot;
	f.dot = 1;
	return f.dot;
});

// /proc/spawn_atom_to_turf  (code/__HELPERS/mobs.dm:385)  may sleep
rt.def("/proc/spawn_atom_to_turf", function* spawn_atom_to_turf(f: Frame, spawn_type: Value, target: Value, amount: Value, admin_spawn: Value) {
	let _T: Value = null, j: Value = null, X: Value = null;
	let $e: any;
	f.vars = () => [spawn_type, target, amount, admin_spawn, _T, j, X, $e];
	if (live(admin_spawn) === null) {
		admin_spawn = 0;
	}
	if (!truthy((_T = rt.getStep(f, live(target), 0)))) {
		yield* g.call(f, P("/proc/CRASH"), null, [fmt("attempt to spawn atom type: ＀ in nullspace", [live(spawn_type)])]);
	}
	j = null;
	rt.forRange(f, 0, 1, live(amount), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		j = $e;
		rt.setFv(f, "admin_spawned", (X = (yield* g.new_(f, live(spawn_type), [live(_T)]))), live(admin_spawn));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/spawn_and_random_walk  (code/__HELPERS/mobs.dm:394)  may sleep
rt.def("/proc/spawn_and_random_walk", function* spawn_and_random_walk(f: Frame, spawn_type: Value, target: Value, amount: Value, walk_chance: Value, max_walk: Value, always_max_walk: Value, admin_spawn: Value) {
	let _T: Value = null, step_count: Value = null, j: Value = null, X: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [spawn_type, target, amount, walk_chance, max_walk, always_max_walk, admin_spawn, _T, step_count, j, X, i, $e];
	if (live(walk_chance) === null) {
		walk_chance = 100;
	}
	if (live(max_walk) === null) {
		max_walk = 3;
	}
	if (live(always_max_walk) === null) {
		always_max_walk = 0;
	}
	if (live(admin_spawn) === null) {
		admin_spawn = 0;
	}
	_T = rt.getStep(f, live(target), 0);
	step_count = 0;
	if (!truthy(live(_T))) {
		yield* g.call(f, P("/proc/CRASH"), null, [fmt("attempt to spawn atom type: ＀ in nullspace", [live(spawn_type)])]);
	}
	j = null;
	rt.forRange(f, 0, 1, live(amount), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		j = $e;
		rt.setFv(f, "admin_spawned", (X = (yield* g.new_(f, live(spawn_type), [live(_T)]))), live(admin_spawn));
		if ((truthy(live(always_max_walk)) || truthy(rt.op(f, "Prob", [], [live(walk_chance)])))) {
			if (truthy(live(always_max_walk))) {
				step_count = live(max_walk);
			} else {
				step_count = (yield* g.call(f, P("/proc/rand"), null, [1, live(max_walk)]));
			}
			i = null;
			rt.forRange(f, 1, 1, live(step_count), 1);
			while (($e = rt.next(f, 1)) !== undefined) {
				i = $e;
				yield* g.call(f, P("/proc/step"), null, [live(X), rt.op(f, "PickUnweighted", [4], [1, 2, 4, 8])]);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/deadchat_broadcast  (code/__HELPERS/mobs.dm:413)  may sleep
rt.def("/proc/deadchat_broadcast", function* deadchat_broadcast(f: Frame, message: Value, follow_target: Value, turf_target: Value, speaker_key: Value, message_type: Value) {
	let M: Value = null, prefs: Value = null, adminoverride: Value = null, rendered_message: Value = null, F: Value = null, turf_link: Value = null;
	let $0: any, $e: any;
	f.vars = () => [message, follow_target, turf_target, speaker_key, message_type, M, prefs, adminoverride, rendered_message, F, turf_link, $0, $e];
	if (live(follow_target) === null) {
		follow_target = null;
	}
	if (live(turf_target) === null) {
		turf_target = null;
	}
	if (live(speaker_key) === null) {
		speaker_key = null;
	}
	if (live(message_type) === null) {
		message_type = "regular-deadchat";
	}
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		prefs = null;
		if ((truthy(rt.fv(f, "client", live(M))) && truthy(rt.gv(f, "prefs", rt.fv(f, "client", live(M)))))) {
			prefs = rt.gv(f, "prefs", rt.fv(f, "client", live(M)));
		} else {
			prefs = (yield* g.new_(f, T("/datum/preferences"), []));
		}
		adminoverride = 0;
		if (((truthy(rt.fv(f, "client", live(M))) && truthy(rt.gv(f, "holder", rt.fv(f, "client", live(M))))) && truthy(rt.bitAnd(rt.fv(f, "chat_toggles", live(prefs)), 2)))) {
			adminoverride = 1;
		}
		if ((truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0)) && !truthy(live(adminoverride)))) {
			continue;
		}
		if ((!isEqual(rt.fv(f, "stat", live(M)), 2) && !truthy(live(adminoverride)))) {
			continue;
		}
		if (truthy((rt.isIn(f, (live(speaker_key) && live(speaker_key)), rt.fv(f, "ignoring", live(prefs))) ? 1 : 0))) {
			continue;
		}
		$0 = live(message_type);
		if ($0 === "deathrattle") {
			if (truthy(rt.bitAnd(rt.fv(f, "toggles", live(prefs)), 4096))) {
				continue;
			}
		} else if ($0 === "arrivalrattle") {
			if (truthy(rt.bitAnd(rt.fv(f, "toggles", live(prefs)), 8192))) {
				continue;
			}
		}
		if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
			rendered_message = live(message);
			if (truthy(live(follow_target))) {
				F = null;
				if (truthy(live(turf_target))) {
					F = fmt("<a href=?src=＃;follow=＃;x=＀;y=＀;z=＀>(F)</a>", [live(M), live(follow_target), rt.fv(f, "x", live(turf_target)), rt.fv(f, "y", live(turf_target)), rt.fv(f, "z", live(turf_target))]);
				} else {
					F = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(follow_target)]);
				}
				rendered_message = fmt("＀ ＀", [live(F), live(message)]);
			} else {
				if (truthy(live(turf_target))) {
					rendered_message = fmt("＀ ＀", [(turf_link = fmt("<a href=?src=＃;x=＀;y=＀;z=＀>(T)</a>", [live(M), rt.fv(f, "x", live(turf_target)), rt.fv(f, "y", live(turf_target)), rt.fv(f, "z", live(turf_target))])), live(message)]);
				}
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), live(rendered_message)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), live(message)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
