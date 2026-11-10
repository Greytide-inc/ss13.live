// Based on /tg/station's code/__HELPERS/mobs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// mobs.dm:5
rt.def("/proc/random_blood_type", function random_blood_type(f: Frame) {
	return rt.op(f, "PickWeighted", [8], [4, "O-", 36, "O+", 3, "A-", 28, "A+", 1, "B-", 20, "B+", 1, "AB-", 5, "AB+"]);
});

// mobs.dm:8
rt.def("/proc/random_eye_color", function random_eye_color(f: Frame) {
	const result = rt.op(f, "PickWeighted", [7], [20, "brown", 20, "hazel", 20, "grey", 15, "blue", 15, "green", 1, "amber", 1, "albino"]);
	if (result === "brown") {
		return "630";
	} else if (result === "hazel") {
		return "542";
	} else if (result === "grey") {
		return pick("666", "777", "888", "999", "aaa", "bbb", "ccc");
	} else if (result === "blue") {
		return "36c";
	} else if (result === "green") {
		return "060";
	} else if (result === "amber") {
		return "fc0";
	} else if (result === "albino") {
		return pick("c", "d", "e", "f") + pick("0", "1", "2", "3", "4", "5", "6", "7", "8", "9") + pick("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
	} else {
		return "000";
	}
});

// mobs.dm:27
rt.def("/proc/random_underwear", function* random_underwear(f: Frame, gender: Value) {
	if (!rt.len(f, GLOB.underwear_list)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/underwear"), GLOB.underwear_list, GLOB.underwear_m, GLOB.underwear_f);
	}
	if (gender === "male") {
		return pick(GLOB.underwear_m);
	} else if (gender === "female") {
		return pick(GLOB.underwear_f);
	} else {
		return pick(GLOB.underwear_list);
	}
}, true);

// mobs.dm:38
rt.def("/proc/random_undershirt", function* random_undershirt(f: Frame, gender: Value) {
	if (!rt.len(f, GLOB.undershirt_list)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/undershirt"), GLOB.undershirt_list, GLOB.undershirt_m, GLOB.undershirt_f);
	}
	if (gender === "male") {
		return pick(GLOB.undershirt_m);
	} else if (gender === "female") {
		return pick(GLOB.undershirt_f);
	} else {
		return pick(GLOB.undershirt_list);
	}
}, true);

// mobs.dm:49
rt.def("/proc/random_socks", function* random_socks(f: Frame) {
	if (!rt.len(f, GLOB.socks_list)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/socks"), GLOB.socks_list);
	}
	return pick(GLOB.socks_list);
}, true);

// mobs.dm:54
rt.def("/proc/random_features", function* random_features(f: Frame) {
	if (!rt.len(f, GLOB.tails_list_human)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/tails/human"), GLOB.tails_list_human);
	}
	if (!rt.len(f, GLOB.tails_list_lizard)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/tails/lizard"), GLOB.tails_list_lizard);
	}
	if (!rt.len(f, GLOB.snouts_list)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/snouts"), GLOB.snouts_list);
	}
	if (!rt.len(f, GLOB.horns_list)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/horns"), GLOB.horns_list);
	}
	if (!rt.len(f, GLOB.ears_list)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/ears"), GLOB.horns_list);
	}
	if (!rt.len(f, GLOB.frills_list)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/frills"), GLOB.frills_list);
	}
	if (!rt.len(f, GLOB.spines_list)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/spines"), GLOB.spines_list);
	}
	if (!rt.len(f, GLOB.legs_list)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/legs"), GLOB.legs_list);
	}
	if (!rt.len(f, GLOB.body_markings_list)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/body_markings"), GLOB.body_markings_list);
	}
	if (!rt.len(f, GLOB.wings_list)) {
		yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/wings"), GLOB.wings_list);
	}
	return rt.alist(f, ["mcolor", pick("FFFFFF", "7F7F7F", "7FFF7F", "7F7FFF", "FF7F7F", "7FFFFF", "FF7FFF", "FFFF7F"), "tail_lizard", pick(GLOB.tails_list_lizard), "tail_human", "None", "wings", "None", "snout", pick(GLOB.snouts_list), "horns", pick(GLOB.horns_list), "ears", "None", "frills", pick(GLOB.frills_list), "spines", pick(GLOB.spines_list), "body_markings", pick(GLOB.body_markings_list), "legs", "Normal Legs"]);
}, true);

// mobs.dm:79
rt.def("/proc/random_hair_style", function random_hair_style(f: Frame, gender: Value) {
	if (gender === "male") {
		return pick(GLOB.hair_styles_male_list);
	} else if (gender === "female") {
		return pick(GLOB.hair_styles_female_list);
	} else {
		return pick(GLOB.hair_styles_list);
	}
});

// mobs.dm:88
rt.def("/proc/random_facial_hair_style", function random_facial_hair_style(f: Frame, gender: Value) {
	if (gender === "male") {
		return pick(GLOB.facial_hair_styles_male_list);
	} else if (gender === "female") {
		return pick(GLOB.facial_hair_styles_female_list);
	} else {
		return pick(GLOB.facial_hair_styles_list);
	}
});

// mobs.dm:97
rt.def("/proc/random_unique_name", function random_unique_name(f: Frame, gender: Value, attempts_to_find_unique_name: Value) {
	attempts_to_find_unique_name ??= 10;
	let i: Value = 1;
	while (i <= attempts_to_find_unique_name) {
		if (gender == "female") {
			f.dot = capitalize(pick(GLOB.first_names_female)) + " " + capitalize(pick(GLOB.last_names));
		} else {
			f.dot = capitalize(pick(GLOB.first_names_male)) + " " + capitalize(pick(GLOB.last_names));
		}
		if (i != attempts_to_find_unique_name && !findname(f.dot)) {
			break;
		}
		i++;
	}
	return f.dot;
});

// mobs.dm:107
rt.def("/proc/random_unique_lizard_name", function random_unique_lizard_name(f: Frame, gender: Value, attempts_to_find_unique_name: Value) {
	attempts_to_find_unique_name ??= 10;
	let i: Value = 1;
	while (i <= attempts_to_find_unique_name) {
		f.dot = capitalize(lizard_name(gender));
		if (i != attempts_to_find_unique_name && !findname(f.dot)) {
			break;
		}
		i++;
	}
	return f.dot;
});

// mobs.dm:114
rt.def("/proc/random_unique_plasmaman_name", function random_unique_plasmaman_name(f: Frame, attempts_to_find_unique_name: Value) {
	attempts_to_find_unique_name ??= 10;
	let i: Value = 1;
	while (i <= attempts_to_find_unique_name) {
		f.dot = capitalize(plasmaman_name());
		if (i != attempts_to_find_unique_name && !findname(f.dot)) {
			break;
		}
		i++;
	}
	return f.dot;
});

// mobs.dm:121
rt.def("/proc/random_skin_tone", function random_skin_tone(f: Frame) {
	return pick(GLOB.skin_tones);
});

// mobs.dm:123
rt.def("/datum/controller/global_vars/proc/InitGlobalskin_tones", function InitGlobalskin_tones(f: Frame) {
	GLOB.skin_tones = list("albino", "caucasian1", "caucasian2", "caucasian3", "latino", "mediterranean", "asian1", "asian2", "arab", "indian", "african1", "african2");
	this.gvars_datum_init_order += "skin_tones";
	return f.dot;
});

// mobs.dm:138
rt.def("/datum/controller/global_vars/proc/InitGlobalspecies_list", function InitGlobalspecies_list(f: Frame) {
	GLOB.species_list = list();
	this.gvars_datum_init_order += "species_list";
	return f.dot;
});

// mobs.dm:139
rt.def("/datum/controller/global_vars/proc/InitGlobalroundstart_species", function InitGlobalroundstart_species(f: Frame) {
	GLOB.roundstart_species = list();
	this.gvars_datum_init_order += "roundstart_species";
	return f.dot;
});

// mobs.dm:174
rt.def("/proc/add_logs", function add_logs(f: Frame, user: Value, target: Value, what_done: Value, object: Value, addition: Value) {
	let living_target: Value = null, message: Value = null;
	let attack_location: Value = rt.getStep(f, target, 0);
	let is_mob_user: Value = (user && rt.index(GLOB.typecache_mob, user.type));
	let is_mob_target: Value = (target && rt.index(GLOB.typecache_mob, target.type));
	if (target && rt.istype(target, T("/mob/living"))) {
		living_target = target;
	}
	let hp: Value = " ";
	if (living_target) {
		hp = `(NEWHP: ${living_target.health})`;
	}
	let starget: Value = "NON-EXISTENT SUBJECT";
	if (target) {
		if (is_mob_target && target.ckey) {
			starget = `${target.name}(${target.ckey})`;
		} else {
			starget = `${target.name}`;
		}
	}
	let ssource: Value = "NON-EXISTENT USER";
	if (user) {
		if (is_mob_user && user.ckey) {
			ssource = `${user.name}(${user.ckey})`;
		} else {
			ssource = `${user.name}`;
		}
	}
	let sobject: Value = "";
	if (object) {
		sobject = `${object}`;
	}
	let sattackloc: Value = "";
	if (attack_location) {
		sattackloc = `(${attack_location.x},${attack_location.y},${attack_location.z})`;
	}
	if (is_mob_user) {
		message = `<font color='red'>has ${what_done} ${starget} with ${sobject}${addition} ${hp} ${sattackloc}</font>`;
		user.log_message(message, "Attack log");
	}
	if (is_mob_target) {
		message = `<font color='orange'>has been ${what_done} by ${ssource} with ${sobject}${addition} ${hp} ${sattackloc}</font>`;
		target.log_message(message, "Attack log");
	}
	log_attack(`${ssource} ${what_done} ${starget} with ${sobject}${addition} ${hp} ${sattackloc}`);
	return f.dot;
});

// mobs.dm:222
rt.def("/proc/do_mob", function* do_mob(f: Frame, user: Value, target: Value, time: Value, uninterruptible: Value, progress: Value, extra_checks: Value) {
	let progbar: Value = null;
	time ??= 30;
	uninterruptible ??= 0;
	progress ??= 1;
	if (!user || !target) {
		return 0;
	}
	let user_loc: Value = user.loc;
	let drifting: Value = 0;
	if (!(yield* user.Process_Spacemove(0)) && user.inertia_dir) {
		drifting = 1;
	}
	let target_loc: Value = target.loc;
	let holding: Value = user.get_active_held_item();
	if (progress) {
		progbar = (yield* new_(T("/datum/progressbar"), user, time, target));
	}
	let endtime: Value = rt.worldTime(f) + time;
	let starttime: Value = rt.worldTime(f);
	f.dot = 1;
	while (rt.worldTime(f) < endtime) {
		yield* stoplag();
		if (progress) {
			yield* progbar.update(rt.worldTime(f) - starttime);
		}
		if (!user || user.gc_destroyed || !target || target.gc_destroyed) {
			f.dot = 0;
			break;
		}
		if (uninterruptible) {
			continue;
		}
		if (drifting && !user.inertia_dir) {
			drifting = 0;
			user_loc = user.loc;
		}
		if (!drifting && user.loc != user_loc || target.loc != target_loc || user.get_active_held_item() != holding || user.incapacitated() || user.lying || extra_checks && !(yield* extra_checks.Invoke())) {
			f.dot = 0;
			break;
		}
	}
	if (!progress) return f.dot;
	yield* qdel(progbar);
	return f.dot;
}, true);

// mobs.dm:263
rt.def("/mob/proc/break_do_after_checks", function break_do_after_checks(f: Frame, checked_health: Value, check_clicks: Value) {
	if (check_clicks && this.next_move > rt.worldTime(f)) {
		return 0;
	}
	return 1;
}, false, { argTypes: [{ path: "/list" }, {  }] });

// mobs.dm:269
rt.def("/mob/living/proc/break_do_after_checks", function break_do_after_checks(f: Frame, checked_health: Value, check_clicks: Value) {
	if (rt.istype(checked_health, T("/list"))) {
		if (this.health < rt.at(checked_health, "health")) {
			return 0;
		}
		rt.setAt(checked_health, "health", this.health);
	}
	return parent_proc();
}, false);

// mobs.dm:276
rt.def("/proc/do_after", function* do_after(f: Frame, user: Value, delay: Value, needhand: Value, target: Value, progress: Value, extra_checks: Value) {
	let Tloc: Value = null, progbar: Value = null;
	needhand ??= 1;
	progress ??= 1;
	if (!user) {
		return 0;
	}
	if (target) {
		Tloc = target.loc;
	}
	let Uloc: Value = user.loc;
	let drifting: Value = 0;
	if (!(yield* user.Process_Spacemove(0)) && user.inertia_dir) {
		drifting = 1;
	}
	let holding: Value = user.get_active_held_item();
	let holdingnull: Value = 1;
	if (holding) {
		holdingnull = 0;
	}
	if (progress) {
		progbar = (yield* new_(T("/datum/progressbar"), user, delay, target));
	}
	let endtime: Value = rt.worldTime(f) + delay;
	let starttime: Value = rt.worldTime(f);
	f.dot = 1;
	while (rt.worldTime(f) < endtime) {
		yield* stoplag();
		if (progress) {
			yield* progbar.update(rt.worldTime(f) - starttime);
		}
		if (drifting && !user.inertia_dir) {
			drifting = 0;
			Uloc = user.loc;
		}
		if (!user || user.gc_destroyed || user.stat || user.IsKnockdown() || user.IsStun() || !drifting && user.loc != Uloc || extra_checks && !(yield* extra_checks.Invoke())) {
			f.dot = 0;
			break;
		}
		if (!(!Tloc || Tloc.gc_destroyed) && (!target || target.gc_destroyed || Tloc != target.loc)) {
			if ((Uloc != Tloc || Tloc != user) && !drifting) {
				f.dot = 0;
				break;
			}
		}
		if (needhand) {
			if (!holdingnull) {
				if (!holding) {
					f.dot = 0;
					break;
				}
			}
			if (user.get_active_held_item() != holding) {
				f.dot = 0;
				break;
			}
		}
	}
	if (!progress) return f.dot;
	yield* qdel(progbar);
	return f.dot;
}, true);

// mobs.dm:333
rt.def("/proc/do_after_mob", function* do_after_mob(f: Frame, user: Value, targets: Value, time: Value, uninterruptible: Value, progress: Value, extra_checks: Value) {
	let target: Value = null, progbar: Value = null, target_7: Value = null;
	time ??= 30;
	uninterruptible ??= 0;
	progress ??= 1;
	if (!user || !targets) {
		return 0;
	}
	if (!rt.istype(targets, T("/list"))) {
		targets = list(targets);
	}
	let user_loc: Value = user.loc;
	let drifting: Value = 0;
	if (!(yield* user.Process_Spacemove(0)) && user.inertia_dir) {
		drifting = 1;
	}
	let originalloc: Value = list();
	for (target of each(targets, T("/atom"))) {
		rt.setAt(originalloc, target, target.loc);
	}
	let holding: Value = user.get_active_held_item();
	if (progress) {
		progbar = (yield* new_(T("/datum/progressbar"), user, time, rt.index(targets, 1)));
	}
	let endtime: Value = rt.worldTime(f) + time;
	let starttime: Value = rt.worldTime(f);
	f.dot = 1;
	loop67: while (true) {
		if (!(rt.worldTime(f) < endtime)) break;
		yield* sleep(1);
		if (progress) {
			yield* progbar.update(rt.worldTime(f) - starttime);
		}
		if (!user || user.gc_destroyed || !targets) {
			f.dot = 0;
			break;
		}
		if (uninterruptible) {
			continue;
		}
		if (drifting && !user.inertia_dir) {
			drifting = 0;
			user_loc = user.loc;
		}
		target_7 = null;
		for (target_7 of each(targets, T("/atom"))) {
			if (!drifting && user_loc != user.loc || !target_7 || target_7.gc_destroyed || rt.index(originalloc, target_7) != target_7.loc || user.get_active_held_item() != holding || user.incapacitated() || user.lying || extra_checks && !(yield* extra_checks.Invoke())) {
				f.dot = 0;
				break loop67;
			}
		}
	}
	if (!progbar) return f.dot;
	yield* qdel(progbar);
	return f.dot;
}, true);

// mobs.dm:379
rt.def("/proc/is_species", function is_species(f: Frame, A: Value, species_datum: Value) {
	let H: Value = null;
	f.dot = 0;
	if (!rt.istype(A, T("/mob/living/carbon/human"))) return f.dot;
	if (!((H = A).dna && rt.op(f, "IsType", [], [H.dna.species, species_datum]))) return f.dot;
	f.dot = 1;
	return f.dot;
});

// mobs.dm:385
rt.def("/proc/spawn_atom_to_turf", function* spawn_atom_to_turf(f: Frame, spawn_type: Value, target: Value, amount: Value, admin_spawn: Value) {
	let _T: Value = null, j: Value = null, X: Value = null;
	let $e: any;
	admin_spawn ??= 0;
	if (!(_T = rt.getStep(f, target, 0))) {
		CRASH(`attempt to spawn atom type: ${spawn_type} in nullspace`);
	}
	rt.forRange(f, 0, 1, amount, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		j = $e;
		(X = (yield* new_(spawn_type, _T))).admin_spawned = admin_spawn;
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// mobs.dm:394
rt.def("/proc/spawn_and_random_walk", function* spawn_and_random_walk(f: Frame, spawn_type: Value, target: Value, amount: Value, walk_chance: Value, max_walk: Value, always_max_walk: Value, admin_spawn: Value) {
	let j: Value = null, X: Value = null, i: Value = null;
	let $e: any;
	walk_chance ??= 100;
	max_walk ??= 3;
	always_max_walk ??= 0;
	admin_spawn ??= 0;
	let _T: Value = rt.getStep(f, target, 0);
	let step_count: Value = 0;
	if (!_T) {
		CRASH(`attempt to spawn atom type: ${spawn_type} in nullspace`);
	}
	rt.forRange(f, 0, 1, amount, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		j = $e;
		(X = (yield* new_(spawn_type, _T))).admin_spawned = admin_spawn;
		if (always_max_walk || prob(walk_chance)) {
			if (always_max_walk) {
				step_count = max_walk;
			} else {
				step_count = rand(1, max_walk);
			}
			i = null;
			rt.forRange(f, 1, 1, step_count, 1);
			while (($e = rt.next(f, 1)) !== undefined) {
				i = $e;
				yield* step(X, pick(1, 2, 4, 8));
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// mobs.dm:413
rt.def("/proc/deadchat_broadcast", function* deadchat_broadcast(f: Frame, message: Value, follow_target: Value, turf_target: Value, speaker_key: Value, message_type: Value) {
	let M: Value = null, prefs: Value = null, adminoverride: Value = null, rendered_message: Value = null, F: Value = null, turf_link: Value = null;
	let $e: any;
	message_type ??= "regular-deadchat";
	for (M of each(GLOB.player_list, T("/mob"))) {
		prefs = null;
		if (M.client && M.client.prefs) {
			prefs = M.client.prefs;
		} else {
			prefs = (yield* new_(T("/datum/preferences")));
		}
		adminoverride = 0;
		if (M.client && M.client.holder && rt.bitAnd(prefs.chat_toggles, 2)) {
			adminoverride = 1;
		}
		if (rt.istype(M, T("/mob/dead/new_player")) && !adminoverride) {
			continue;
		}
		if (M.stat != 2 && !adminoverride) {
			continue;
		}
		if (rt.isIn(f, (speaker_key && speaker_key), prefs.ignoring)) {
			continue;
		}
		if (message_type === "deathrattle") {
			if (rt.bitAnd(prefs.toggles, 4096)) {
				continue;
			}
		} else if (message_type === "arrivalrattle") {
			if (rt.bitAnd(prefs.toggles, 8192)) {
				continue;
			}
		}
		if (rt.istype(M, T("/mob/dead/observer"))) {
			rendered_message = message;
			if (follow_target) {
				F = null;
				if (turf_target) {
					F = fmt("<a href=?src=＃;follow=＃;x=＀;y=＀;z=＀>(F)</a>", [M, follow_target, turf_target.x, turf_target.y, turf_target.z]);
				} else {
					F = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, follow_target]);
				}
				rendered_message = `${F} ${message}`;
			} else if (turf_target) {
				rendered_message = `${(turf_link = fmt("<a href=?src=＃;x=＀;y=＀;z=＀>(T)</a>", [M, turf_target.x, turf_target.y, turf_target.z]))} ${message}`;
			}
			to_chat(M, rendered_message);
		} else {
			to_chat(M, message);
		}
	}
	return f.dot;
}, true);
