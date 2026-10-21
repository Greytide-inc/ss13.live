// From code/game/gamemodes/blob/blob.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalblobs  (code/game/gamemodes/blob/blob.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalblobs", function InitGlobalblobs(f: Frame) {
	rt.setGl("blobs", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "blobs", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalblob_cores  (code/game/gamemodes/blob/blob.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalblob_cores", function InitGlobalblob_cores(f: Frame) {
	rt.setGl("blob_cores", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "blob_cores", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaloverminds  (code/game/gamemodes/blob/blob.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobaloverminds", function InitGlobaloverminds(f: Frame) {
	rt.setGl("overminds", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "overminds", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalblob_nodes  (code/game/gamemodes/blob/blob.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalblob_nodes", function InitGlobalblob_nodes(f: Frame) {
	rt.setGl("blob_nodes", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "blob_nodes", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalblobs_legit  (code/game/gamemodes/blob/blob.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalblobs_legit", function InitGlobalblobs_legit(f: Frame) {
	rt.setGl("blobs_legit", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "blobs_legit", add);
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

// /datum/game_mode/blob/proc/<init>  (code/game/gamemodes/blob/blob.dm:40)
rt.def("/datum/game_mode/blob/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "blob_overminds", rt.list());
	return f.dot;
});

// /datum/game_mode/blob/proc/pre_setup  (code/game/gamemodes/blob/blob.dm:43)
rt.def("/datum/game_mode/blob/proc/pre_setup", function pre_setup(f: Frame) {
	let win_multiplier: Value = null, j: Value = null, blob: Value = null;
	f.vars = () => [win_multiplier, j, blob];
	rt.setSv(f, "cores_to_spawn", rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), rt.sv(f, "players_per_core")), 1]), 1]));
	win_multiplier = add(1, multiply(0.10000000149011612, rt.sv(f, "cores_to_spawn")));
	rt.setSv(f, "blobwincount", multiply(multiply(rt.initial(f, live(f.src), "blobwincount"), rt.sv(f, "cores_to_spawn")), live(win_multiplier)));
	j = null;
	j = 0;
	while (rt.lt(live(j), rt.sv(f, "cores_to_spawn"))) {
		if (!truthy(rt.len(f, rt.sv(f, "antag_candidates")))) {
			break;
		}
		rt.modSrcVar(f, "blob_overminds", (blob = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), add);
		rt.setFv(f, "assigned_role", live(blob), "Blob");
		rt.setFv(f, "special_role", live(blob), "Blob");
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been selected as a Blob", [rt.fv(f, "key", live(blob))])]);
		(rt.modSrcVar(f, "antag_candidates", live(blob), subtract));
		j = rt.inc(live(j), 1);
	}
	if (!truthy(rt.len(f, rt.sv(f, "blob_overminds")))) {
		return 0;
	}
	return 1;
});

// /datum/game_mode/blob/proc/get_blob_candidates  (code/game/gamemodes/blob/blob.dm:64)
rt.def("/datum/game_mode/blob/proc/get_blob_candidates", function get_blob_candidates(f: Frame) {
	let candidates: Value = null, player: Value = null;
	let $e: any;
	f.vars = () => [candidates, player, $e];
	candidates = rt.list();
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (((((!truthy(rt.fv(f, "stat", live(player))) && truthy(rt.fv(f, "mind", live(player)))) && !truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(player))))) && !truthy(rt.call(f, P("/proc/jobban_isbanned"), null, [live(player), "Syndicate"]))) && truthy((rt.isIn(f, "blob", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(player))))) ? 1 : 0)))) {
			candidates = rt.modify(live(candidates), live(player), add);
		}
	}
	rt.endFor(f, 0);
	return live(candidates);
});

// /datum/game_mode/blob/proc/show_message  (code/game/gamemodes/blob/blob.dm:72)
rt.def("/datum/game_mode/blob/proc/show_message", function show_message(f: Frame, message: Value) {
	let blob: Value = null;
	let $e: any;
	f.vars = () => [blob, $e];
	blob = null;
	rt.forList(f, 0, rt.sv(f, "blob_overminds"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		blob = $e;
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(blob)), live(message)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/game_mode/blob/proc/post_setup  (code/game/gamemodes/blob/blob.dm:78)  may sleep
rt.def("/datum/game_mode/blob/proc/post_setup", function* post_setup(f: Frame) {
	let blob: Value = null, B: Value = null, _T: Value = null, B_0: Value = null, message_delay: Value = null;
	let $e: any;
	f.vars = () => [blob, B, _T, B_0, message_delay, $e];
	blob = null;
	rt.forList(f, 0, rt.sv(f, "blob_overminds"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		blob = $e;
		rt.setFv(f, "name", rt.gv(f, "mind", (B = (yield* g.callName(f, rt.fv(f, "current", live(blob)), "become_overmind", [1, (yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "blob_base_starting_points"), rt.len(f, rt.sv(f, "blob_overminds")))]))])))), rt.fv(f, "name", live(B)));
		_T = rt.op(f, "PickUnweighted", [1], [rt.gl("blobstart")]);
		rt.setFv(f, "loc", live(B), live(_T));
		rt.setFv(f, "base_point_rate", live(B), rt.sv(f, "blob_point_rate"));
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.gl("SSshuttle"), "registerHostileEnvironment", [live(f.src)]);
	if (truthy((B_0 = rt.locateIn(f, T("/datum/round_event_control/blob"), rt.fv(f, "control", rt.gl("SSevents")))))) {
		rt.setFv(f, "max_occurrences", live(B_0), 0);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/sleep"), null, [(message_delay = (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "messagedelay_low"), rt.sv(f, "messagedelay_high")])))]);
	yield* g.srcCall(f, "send_intercept", 1);
	rt.setSv(f, "message_sent", 1);
	yield* g.call(f, P("/proc/sleep"), null, [24000]);
	if (truthy(rt.sv(f, "replacementmode"))) return f.dot;
	yield* g.srcCall(f, "send_intercept", 2);
	return f.dot;
}, true, { waitfor: false });
