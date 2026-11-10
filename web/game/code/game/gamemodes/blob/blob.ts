// Based on /tg/station's code/game/gamemodes/blob/blob.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// blob.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalblobs", function InitGlobalblobs(f: Frame) {
	GLOB.blobs = list();
	this.gvars_datum_init_order += "blobs";
	return f.dot;
});

// blob.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalblob_cores", function InitGlobalblob_cores(f: Frame) {
	GLOB.blob_cores = list();
	this.gvars_datum_init_order += "blob_cores";
	return f.dot;
});

// blob.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobaloverminds", function InitGlobaloverminds(f: Frame) {
	GLOB.overminds = list();
	this.gvars_datum_init_order += "overminds";
	return f.dot;
});

// blob.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalblob_nodes", function InitGlobalblob_nodes(f: Frame) {
	GLOB.blob_nodes = list();
	this.gvars_datum_init_order += "blob_nodes";
	return f.dot;
});

// blob.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalblobs_legit", function InitGlobalblobs_legit(f: Frame) {
	GLOB.blobs_legit = list();
	this.gvars_datum_init_order += "blobs_legit";
	return f.dot;
});

rt.type(1082, "/datum/game_mode/blob", "/datum/game_mode", {
	message_sent: 0,
	cores_to_spawn: 1,
	players_per_core: 25,
	blob_point_rate: 3,
	blob_base_starting_points: 80,
	blobwincount: 250,
	messagedelay_low: 2400,
	messagedelay_high: 3600,
	blob_overminds: null,
	name: "blob",
	config_tag: "blob",
	antag_flag: "blob",
	required_players: 25,
	required_enemies: 1,
	recommended_enemies: 1,
	round_ends_with_antag_death: 1,
	announce_span: "green",
	announce_text: "Dangerous gelatinous organisms are spreading throughout the station!\n<span class='green'>Blobs</span>: Consume the station and spread as far as you can.\n<span class='notice'>Crew</span>: Fight back the blobs and minimize station damage.",
});

// blob.dm:40
rt.def("/datum/game_mode/blob/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.blob_overminds = list();
	return f.dot;
});

// blob.dm:43
rt.def("/datum/game_mode/blob/proc/pre_setup", function pre_setup(f: Frame) {
	let blob: Value = null;
	this.cores_to_spawn = max(round(this.num_players() / this.players_per_core, 1), 1);
	let win_multiplier: Value = 1 + 0.1 * this.cores_to_spawn;
	this.blobwincount = rt.initial(f, this, "blobwincount") * this.cores_to_spawn * win_multiplier;
	let j: Value = 0;
	while (j < this.cores_to_spawn) {
		if (!rt.len(f, this.antag_candidates)) {
			break;
		}
		this.blob_overminds += (blob = pick(this.antag_candidates));
		blob.assigned_role = "Blob";
		blob.special_role = "Blob";
		log_game(`${blob.key} (ckey) has been selected as a Blob`);
		this.antag_candidates -= blob;
		j++;
	}
	if (!rt.len(f, this.blob_overminds)) {
		return 0;
	}
	return 1;
});

// blob.dm:72
rt.def("/datum/game_mode/blob/proc/show_message", function show_message(f: Frame, message: Value) {
	let blob: Value = null;
	for (blob of each(this.blob_overminds, T("/datum/mind"))) {
		to_chat(blob.current, message);
	}
	return f.dot;
});

// blob.dm:78
rt.def("/datum/game_mode/blob/proc/post_setup", function* post_setup(f: Frame) {
	let blob: Value = null, B: Value = null, _T: Value = null, B_0: Value = null, message_delay: Value = null;
	for (blob of each(this.blob_overminds, T("/datum/mind"))) {
		(B = (yield* blob.current.become_overmind(1, round(this.blob_base_starting_points / rt.len(f, this.blob_overminds))))).mind.name = B.name;
		_T = pick(GLOB.blobstart);
		B.loc = _T;
		B.base_point_rate = this.blob_point_rate;
	}
	yield* GLOB.SSshuttle.registerHostileEnvironment(this);
	if (B_0 = rt.locateIn(f, T("/datum/round_event_control/blob"), GLOB.SSevents.control)) {
		B_0.max_occurrences = 0;
	}
	f.dot = (yield* parent_proc());
	yield* sleep((message_delay = rand(this.messagedelay_low, this.messagedelay_high)));
	yield* this.send_intercept(1);
	this.message_sent = 1;
	yield* sleep(24000);
	if (this.replacementmode) return f.dot;
	yield* this.send_intercept(2);
	return f.dot;
}, true, { waitfor: false });
