// From code/controllers/subsystem/job.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(24, "/datum/controller/subsystem/job", "/datum/controller/subsystem", {
	occupations: null,
	name_occupations: null,
	type_occupations: null,
	unassigned: null,
	job_debug: null,
	initial_players_to_assign: 0,
	prioritized_jobs: null,
	latejoin_trackers: null,
	name: "Jobs",
	init_order: 15,
	flags: 2,
});

// /datum/controller/subsystem/job/proc/New  (code/controllers/subsystem/job.dm:1)  may sleep
rt.def("/datum/controller/subsystem/job/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSjob"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSjob"), T("/datum/controller/subsystem/job")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSjob")]);
		}
		rt.setGl("SSjob", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/job/proc/<init>  (code/controllers/subsystem/job.dm:6)
rt.def("/datum/controller/subsystem/job/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "occupations", rt.list());
	$0 = $0;
	rt.setSv(f, "name_occupations", rt.list());
	$0 = $0;
	rt.setSv(f, "type_occupations", rt.list());
	$0 = $0;
	rt.setSv(f, "unassigned", rt.list());
	$0 = $0;
	rt.setSv(f, "job_debug", rt.list());
	$0 = $0;
	rt.setSv(f, "prioritized_jobs", rt.list());
	$0 = $0;
	rt.setSv(f, "latejoin_trackers", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/job/proc/Initialize  (code/controllers/subsystem/job.dm:17)  may sleep
rt.def("/datum/controller/subsystem/job/proc/Initialize", function* Initialize(f: Frame) {
	if (!truthy(rt.len(f, rt.sv(f, "occupations")))) {
		yield* g.srcCall(f, "SetupOccupations");
	}
	if (truthy(rt.fv(f, "load_jobs_from_txt", rt.gl("config")))) {
		yield* g.srcCall(f, "LoadJobs");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["timeofday"] });

// /datum/controller/subsystem/job/proc/SetupOccupations  (code/controllers/subsystem/job.dm:25)  may sleep
rt.def("/datum/controller/subsystem/job/proc/SetupOccupations", function* SetupOccupations(f: Frame, faction: Value) {
	let all_jobs: Value = null, J: Value = null, job: Value = null;
	let $e: any;
	f.vars = () => [faction, all_jobs, J, job, $e];
	if (live(faction) === null) {
		faction = "Station";
	}
	rt.setSv(f, "occupations", rt.list());
	if (!truthy(rt.getLen(f, (all_jobs = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/job")])), T("/datum/job")))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Error setting up jobs, no job datums found</span>"]);
		return 0;
	}
	J = null;
	rt.forList(f, 0, live(all_jobs));
	while (($e = rt.next(f, 0)) !== undefined) {
		J = $e;
		if (!truthy((job = (yield* g.new_(f, live(J), []))))) {
			continue;
		}
		if (!isEqual(rt.fv(f, "faction", live(job)), live(faction))) {
			continue;
		}
		if (!truthy((yield* g.callName(f, live(job), "config_check", [])))) {
			continue;
		}
		if (!truthy((yield* g.callName(f, live(job), "map_check", [])))) {
			continue;
		}
		rt.modSrcVar(f, "occupations", live(job), add);
		rt.setAt(rt.sv(f, "name_occupations"), rt.fv(f, "title", live(job)), live(job));
		rt.setAt(rt.sv(f, "type_occupations"), live(J), live(job));
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /datum/controller/subsystem/job/proc/Debug  (code/controllers/subsystem/job.dm:50)
rt.def("/datum/controller/subsystem/job/proc/Debug", function Debug(f: Frame, text: Value) {
	if (!truthy(rt.gl("Debug2"))) {
		return 0;
	}
	rt.callName(f, rt.sv(f, "job_debug"), "Add", [live(text)]);
	return 1;
});

// /datum/controller/subsystem/job/proc/GetJob  (code/controllers/subsystem/job.dm:57)  may sleep
rt.def("/datum/controller/subsystem/job/proc/GetJob", function* GetJob(f: Frame, rank: Value) {
	f.vars = () => [rank];
	if (!truthy(rt.len(f, rt.sv(f, "occupations")))) {
		yield* g.srcCall(f, "SetupOccupations");
	}
	return rt.index(rt.sv(f, "name_occupations"), live(rank));
}, true);

// /datum/controller/subsystem/job/proc/GetJobType  (code/controllers/subsystem/job.dm:62)  may sleep
rt.def("/datum/controller/subsystem/job/proc/GetJobType", function* GetJobType(f: Frame, jobtype: Value) {
	f.vars = () => [jobtype];
	if (!truthy(rt.len(f, rt.sv(f, "occupations")))) {
		yield* g.srcCall(f, "SetupOccupations");
	}
	return rt.index(rt.sv(f, "type_occupations"), live(jobtype));
}, true);

// /datum/controller/subsystem/job/proc/AssignRole  (code/controllers/subsystem/job.dm:67)  may sleep
rt.def("/datum/controller/subsystem/job/proc/AssignRole", function* AssignRole(f: Frame, player: Value, rank: Value, latejoin: Value) {
	let job: Value = null, position_limit: Value = null;
	f.vars = () => [player, rank, latejoin, job, position_limit];
	if (live(latejoin) === null) {
		latejoin = 0;
	}
	yield* g.srcCall(f, "Debug", fmt("Running AR, Player: ＀, Rank: ＀, LJ: ＀", [live(player), live(rank), live(latejoin)]));
	if (((truthy(live(player)) && truthy(rt.fv(f, "mind", live(player)))) && truthy(live(rank)))) {
		if (!truthy((job = (yield* g.srcCall(f, "GetJob", live(rank)))))) {
			return 0;
		}
		if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(player), live(rank)])))) {
			return 0;
		}
		position_limit = rt.fv(f, "total_positions", live(job));
		if (!truthy(live(latejoin))) {
			position_limit = rt.fv(f, "spawn_positions", live(job));
		}
		yield* g.srcCall(f, "Debug", fmt("Player: ＀ is now Rank: ＀, JCP:＀, JPL:＀", [live(player), live(rank), rt.fv(f, "current_positions", live(job)), live(position_limit)]));
		rt.setFv(f, "assigned_role", rt.fv(f, "mind", live(player)), live(rank));
		(rt.modSrcVar(f, "unassigned", live(player), subtract));
		rt.incField(f, live(job), "current_positions", 1, true);
		return 1;
	}
	yield* g.srcCall(f, "Debug", fmt("AR has failed, Player: ＀, Rank: ＀", [live(player), live(rank)]));
	return 0;
}, true);

// /datum/controller/subsystem/job/proc/FindOccupationCandidates  (code/controllers/subsystem/job.dm:89)
rt.def("/datum/controller/subsystem/job/proc/FindOccupationCandidates", function FindOccupationCandidates(f: Frame, job: Value, level: Value, flag: Value) {
	let candidates: Value = null, player: Value = null;
	let $e: any;
	f.vars = () => [candidates, player, $e];
	rt.callSrc(f, "Debug", [fmt("Running FOC, Job: ＀, Level: ＀, Flag: ＀", [live(job), live(level), live(flag)])]);
	candidates = rt.list();
	player = null;
	rt.forList(f, 0, rt.sv(f, "unassigned"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (truthy(rt.call(f, P("/proc/jobban_isbanned"), null, [live(player), rt.fv(f, "title", live(job))]))) {
			rt.callSrc(f, "Debug", [fmt("FOC isbanned failed, Player: ＀", [live(player)])]);
			continue;
		}
		if ((truthy(live(flag)) && !truthy((rt.isIn(f, live(flag), rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(player))))) ? 1 : 0)))) {
			rt.callSrc(f, "Debug", [fmt("FOC flag failed, Player: ＀, Flag: ＀, ", [live(player), live(flag)])]);
			continue;
		}
		if (truthy((rt.isIn(f, (rt.fv(f, "mind", live(player)) && rt.fv(f, "title", live(job))), rt.gv(f, "restricted_roles", rt.fv(f, "mind", live(player)))) ? 1 : 0))) {
			rt.callSrc(f, "Debug", [fmt("FOC incompatible with antagonist role, Player: ＀", [live(player)])]);
			continue;
		}
		if ((truthy(rt.fv(f, "enforce_human_authority", rt.gl("config"))) && !truthy(rt.callName(f, rt.gv(f, "pref_species", rt.gv(f, "prefs", rt.fv(f, "client", live(player)))), "qualifies_for_rank", [rt.fv(f, "title", live(job)), rt.gv(f, "features", rt.gv(f, "prefs", rt.fv(f, "client", live(player))))])))) {
			rt.callSrc(f, "Debug", [fmt("FOC non-human failed, Player: ＀", [live(player)])]);
			continue;
		}
		if (truthy(rt.bitAnd(rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(player))), "GetJobDepartment", [live(job), live(level)]), rt.fv(f, "flag", live(job))))) {
			rt.callSrc(f, "Debug", [fmt("FOC pass, Player: ＀, Level:＀", [live(player), live(level)])]);
			candidates = rt.modify(live(candidates), live(player), add);
		}
	}
	rt.endFor(f, 0);
	return live(candidates);
});

// /datum/controller/subsystem/job/proc/GiveRandomJob  (code/controllers/subsystem/job.dm:113)  may sleep
rt.def("/datum/controller/subsystem/job/proc/GiveRandomJob", function* GiveRandomJob(f: Frame, player: Value) {
	let job: Value = null;
	let $e: any;
	f.vars = () => [player, job, $e];
	yield* g.srcCall(f, "Debug", fmt("GRJ Giving random job, Player: ＀", [live(player)]));
	f.dot = 0;
	job = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/shuffle"), null, [rt.sv(f, "occupations")])), T("/datum/job"));
	while (($e = rt.next(f, 0)) !== undefined) {
		job = $e;
		if (!truthy(live(job))) {
			continue;
		}
		if (truthy(rt.op(f, "IsType", [], [live(job), (yield* g.srcCall(f, "GetJob", "Assistant"))]))) {
			continue;
		}
		if (truthy((rt.isIn(f, rt.fv(f, "title", live(job)), rt.gl("command_positions")) ? 1 : 0))) {
			continue;
		}
		if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(player), rt.fv(f, "title", live(job))])))) {
			yield* g.srcCall(f, "Debug", fmt("GRJ isbanned failed, Player: ＀, Job: ＀", [live(player), rt.fv(f, "title", live(job))]));
			continue;
		}
		if (truthy((rt.isIn(f, (rt.fv(f, "mind", live(player)) && rt.fv(f, "title", live(job))), rt.gv(f, "restricted_roles", rt.fv(f, "mind", live(player)))) ? 1 : 0))) {
			yield* g.srcCall(f, "Debug", fmt("GRJ incompatible with antagonist role, Player: ＀, Job: ＀", [live(player), rt.fv(f, "title", live(job))]));
			continue;
		}
		if ((truthy(rt.fv(f, "enforce_human_authority", rt.gl("config"))) && !truthy((yield* g.callName(f, rt.gv(f, "pref_species", rt.gv(f, "prefs", rt.fv(f, "client", live(player)))), "qualifies_for_rank", [rt.fv(f, "title", live(job)), rt.gv(f, "features", rt.gv(f, "prefs", rt.fv(f, "client", live(player))))]))))) {
			yield* g.srcCall(f, "Debug", fmt("GRJ non-human failed, Player: ＀", [live(player)]));
			continue;
		}
		if ((rt.lt(rt.fv(f, "current_positions", live(job)), rt.fv(f, "spawn_positions", live(job))) || isEqual(rt.fv(f, "spawn_positions", live(job)), -1))) {
			yield* g.srcCall(f, "Debug", fmt("GRJ Random job given, Player: ＀, Job: ＀", [live(player), live(job)]));
			if (truthy((yield* g.srcCall(f, "AssignRole", live(player), rt.fv(f, "title", live(job)))))) {
				return 1;
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/job/proc/ResetOccupations  (code/controllers/subsystem/job.dm:148)  may sleep
rt.def("/datum/controller/subsystem/job/proc/ResetOccupations", function* ResetOccupations(f: Frame) {
	let player: Value = null;
	let $e: any;
	f.vars = () => [player, $e];
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if ((truthy(live(player)) && truthy(rt.fv(f, "mind", live(player))))) {
			rt.setFv(f, "assigned_role", rt.fv(f, "mind", live(player)), null);
			rt.setFv(f, "special_role", rt.fv(f, "mind", live(player)), null);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "SetupOccupations");
	rt.setSv(f, "unassigned", rt.list());
	return live(f.dot);
}, true);

// /datum/controller/subsystem/job/proc/FillHeadPosition  (code/controllers/subsystem/job.dm:161)  may sleep
rt.def("/datum/controller/subsystem/job/proc/FillHeadPosition", function* FillHeadPosition(f: Frame) {
	let level: Value = null, command_position: Value = null, job: Value = null, candidates: Value = null, candidate: Value = null;
	let $e: any;
	f.vars = () => [level, command_position, job, candidates, candidate, $e];
	level = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		level = $e;
		command_position = null;
		rt.forList(f, 1, rt.gl("command_positions"));
		while (($e = rt.next(f, 1)) !== undefined) {
			command_position = $e;
			if (!truthy((job = (yield* g.srcCall(f, "GetJob", live(command_position)))))) {
				continue;
			}
			if ((rt.ge(rt.fv(f, "current_positions", live(job)), rt.fv(f, "total_positions", live(job))) && !isEqual(rt.fv(f, "total_positions", live(job)), -1))) {
				continue;
			}
			if (!truthy(rt.getLen(f, (candidates = (yield* g.srcCall(f, "FindOccupationCandidates", live(job), live(level))))))) {
				continue;
			}
			if (truthy((yield* g.srcCall(f, "AssignRole", (candidate = rt.op(f, "PickUnweighted", [1], [live(candidates)])), live(command_position))))) {
				return 1;
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /datum/controller/subsystem/job/proc/CheckHeadPositions  (code/controllers/subsystem/job.dm:180)  may sleep
rt.def("/datum/controller/subsystem/job/proc/CheckHeadPositions", function* CheckHeadPositions(f: Frame, level: Value) {
	let command_position: Value = null, job: Value = null, candidates: Value = null, candidate: Value = null;
	let $e: any;
	f.vars = () => [level, command_position, job, candidates, candidate, $e];
	command_position = null;
	rt.forList(f, 0, rt.gl("command_positions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		command_position = $e;
		if (!truthy((job = (yield* g.srcCall(f, "GetJob", live(command_position)))))) {
			continue;
		}
		if ((rt.ge(rt.fv(f, "current_positions", live(job)), rt.fv(f, "total_positions", live(job))) && !isEqual(rt.fv(f, "total_positions", live(job)), -1))) {
			continue;
		}
		if (!truthy(rt.getLen(f, (candidates = (yield* g.srcCall(f, "FindOccupationCandidates", live(job), live(level))))))) {
			continue;
		}
		yield* g.srcCall(f, "AssignRole", (candidate = rt.op(f, "PickUnweighted", [1], [live(candidates)])), live(command_position));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/job/proc/FillAIPosition  (code/controllers/subsystem/job.dm:194)  may sleep
rt.def("/datum/controller/subsystem/job/proc/FillAIPosition", function* FillAIPosition(f: Frame) {
	let ai_selected: Value = null, job: Value = null, i: Value = null, level: Value = null, candidates: Value = null, candidate: Value = null;
	let $e: any;
	f.vars = () => [ai_selected, job, i, level, candidates, candidate, $e];
	ai_selected = 0;
	if (!truthy((job = (yield* g.srcCall(f, "GetJob", "AI"))))) {
		return 0;
	}
	i = null;
	i = rt.fv(f, "total_positions", live(job));
	while (rt.gt(live(i), 0)) {
		level = null;
		rt.forRange(f, 0, 1, 3, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			level = $e;
			candidates = rt.list();
			if (truthy(rt.getLen(f, (candidates = (yield* g.srcCall(f, "FindOccupationCandidates", live(job), live(level))))))) {
				if (truthy((yield* g.srcCall(f, "AssignRole", (candidate = rt.op(f, "PickUnweighted", [1], [live(candidates)])), "AI")))) {
					ai_selected = rt.inc(live(ai_selected), 1);
					break;
				}
			}
		}
		rt.endFor(f, 0);
		i = rt.inc(live(i), -1);
	}
	if (truthy(live(ai_selected))) {
		return 1;
	}
	return 0;
}, true);

// /datum/controller/subsystem/job/proc/DivideOccupations  (code/controllers/subsystem/job.dm:217)  may sleep
rt.def("/datum/controller/subsystem/job/proc/DivideOccupations", function* DivideOccupations(f: Frame) {
	let A: Value = null, player: Value = null, assist: Value = null, assistant_candidates: Value = null, player_2: Value = null, shuffledoccupations: Value = null, level: Value = null, player_4: Value = null, job: Value = null, player_3: Value = null;
	let $e: any;
	f.vars = () => [A, player, assist, assistant_candidates, player_2, shuffledoccupations, level, player_4, job, player_3, $e];
	yield* g.srcCall(f, "Debug", "Running DO");
	if (truthy(rt.gl("SSticker"))) {
		A = null;
		rt.forList(f, 0, rt.sv(f, "occupations"), T("/datum/job/ai"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			if (truthy(rt.fv(f, "triai", rt.gl("SSticker")))) {
				rt.setFv(f, "spawn_positions", live(A), 3);
			}
		}
		rt.endFor(f, 0);
	}
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (((isEqual(rt.fv(f, "ready", live(player)), 1) && truthy(rt.fv(f, "mind", live(player)))) && !truthy(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(player)))))) {
			rt.modSrcVar(f, "unassigned", live(player), add);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "initial_players_to_assign", rt.len(f, rt.sv(f, "unassigned")));
	yield* g.srcCall(f, "Debug", fmt("DO, Len: ＀", [rt.len(f, rt.sv(f, "unassigned"))]));
	if (isEqual(rt.len(f, rt.sv(f, "unassigned")), 0)) {
		return 0;
	}
	yield* g.srcCall(f, "setup_officer_positions");
	if (truthy(rt.fv(f, "minimal_access_threshold", rt.gl("config")))) {
		if (rt.gt(rt.fv(f, "minimal_access_threshold", rt.gl("config")), rt.len(f, rt.sv(f, "unassigned")))) {
			rt.setFv(f, "jobs_have_minimal_access", rt.gl("config"), 0);
		} else {
			rt.setFv(f, "jobs_have_minimal_access", rt.gl("config"), 1);
		}
	}
	rt.setSv(f, "unassigned", (yield* g.call(f, P("/proc/shuffle"), null, [rt.sv(f, "unassigned")])));
	yield* g.srcCall(f, "HandleFeedbackGathering");
	yield* g.srcCall(f, "Debug", "DO, Running Assistant Check 1");
	assist = (yield* g.new_(f, T("/datum/job/assistant"), []));
	yield* g.srcCall(f, "Debug", fmt("AC1, Candidates: ＀", [rt.getLen(f, (assistant_candidates = (yield* g.srcCall(f, "FindOccupationCandidates", live(assist), 3))))]));
	player_2 = null;
	rt.forList(f, 0, live(assistant_candidates), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player_2 = $e;
		yield* g.srcCall(f, "Debug", fmt("AC1 pass, Player: ＀", [live(player_2)]));
		yield* g.srcCall(f, "AssignRole", live(player_2), "Assistant");
		(assistant_candidates = rt.modify(live(assistant_candidates), live(player_2), subtract));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "Debug", "DO, AC1 end");
	yield* g.srcCall(f, "Debug", "DO, Running Head Check");
	yield* g.srcCall(f, "FillHeadPosition");
	yield* g.srcCall(f, "Debug", "DO, Head Check end");
	yield* g.srcCall(f, "Debug", "DO, Running AI Check");
	yield* g.srcCall(f, "FillAIPosition");
	yield* g.srcCall(f, "Debug", "DO, AI Check end");
	yield* g.srcCall(f, "Debug", "DO, Running Standard Check");
	shuffledoccupations = (yield* g.call(f, P("/proc/shuffle"), null, [rt.sv(f, "occupations")]));
	level = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		level = $e;
		yield* g.srcCall(f, "CheckHeadPositions", live(level));
		player_4 = null;
		rt.forList(f, 1, rt.sv(f, "unassigned"), T("/mob/dead/new_player"));
		while (($e = rt.next(f, 1)) !== undefined) {
			player_4 = $e;
			if (truthy((yield* g.srcCall(f, "PopcapReached")))) {
				yield* g.srcCall(f, "RejectPlayer", live(player_4));
			}
			job = null;
			rt.forList(f, 2, live(shuffledoccupations), T("/datum/job"));
			while (($e = rt.next(f, 2)) !== undefined) {
				job = $e;
				if (!truthy(live(job))) {
					continue;
				}
				if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(player_4), rt.fv(f, "title", live(job))])))) {
					yield* g.srcCall(f, "Debug", fmt("DO isbanned failed, Player: ＀, Job:＀", [live(player_4), rt.fv(f, "title", live(job))]));
					continue;
				}
				if (truthy((rt.isIn(f, (rt.fv(f, "mind", live(player_4)) && rt.fv(f, "title", live(job))), rt.gv(f, "restricted_roles", rt.fv(f, "mind", live(player_4)))) ? 1 : 0))) {
					yield* g.srcCall(f, "Debug", fmt("DO incompatible with antagonist role, Player: ＀, Job:＀", [live(player_4), rt.fv(f, "title", live(job))]));
					continue;
				}
				if ((truthy(rt.fv(f, "enforce_human_authority", rt.gl("config"))) && !truthy((yield* g.callName(f, rt.gv(f, "pref_species", rt.gv(f, "prefs", rt.fv(f, "client", live(player_4)))), "qualifies_for_rank", [rt.fv(f, "title", live(job)), rt.gv(f, "features", rt.gv(f, "prefs", rt.fv(f, "client", live(player_4))))]))))) {
					yield* g.srcCall(f, "Debug", fmt("DO non-human failed, Player: ＀, Job:＀", [live(player_4), rt.fv(f, "title", live(job))]));
					continue;
				}
				if (truthy(rt.bitAnd((yield* g.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(player_4))), "GetJobDepartment", [live(job), live(level)])), rt.fv(f, "flag", live(job))))) {
					if ((rt.lt(rt.fv(f, "current_positions", live(job)), rt.fv(f, "spawn_positions", live(job))) || isEqual(rt.fv(f, "spawn_positions", live(job)), -1))) {
						yield* g.srcCall(f, "Debug", fmt("DO pass, Player: ＀, Level:＀, Job:＀", [live(player_4), live(level), rt.fv(f, "title", live(job))]));
						yield* g.srcCall(f, "AssignRole", live(player_4), rt.fv(f, "title", live(job)));
						(rt.modSrcVar(f, "unassigned", live(player_4), subtract));
						break;
					}
				}
			}
			rt.endFor(f, 2);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	player_3 = null;
	rt.forList(f, 0, rt.sv(f, "unassigned"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player_3 = $e;
		if (truthy((yield* g.srcCall(f, "PopcapReached")))) {
			yield* g.srcCall(f, "RejectPlayer", live(player_3));
		} else {
			if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(player_3), "Assistant"])))) {
				yield* g.srcCall(f, "GiveRandomJob", live(player_3));
			}
		}
	}
	rt.endFor(f, 0);
	player_3 = null;
	rt.forList(f, 0, rt.sv(f, "unassigned"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player_3 = $e;
		if (truthy((yield* g.srcCall(f, "PopcapReached")))) {
			yield* g.srcCall(f, "RejectPlayer", live(player_3));
		} else {
			if (isEqual(rt.gv(f, "joblessrole", rt.gv(f, "prefs", rt.fv(f, "client", live(player_3)))), 2)) {
				yield* g.srcCall(f, "GiveRandomJob", live(player_3));
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "Debug", "DO, Standard Check end");
	yield* g.srcCall(f, "Debug", "DO, Running AC2");
	player_3 = null;
	rt.forList(f, 0, rt.sv(f, "unassigned"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player_3 = $e;
		if (truthy((yield* g.srcCall(f, "PopcapReached")))) {
			yield* g.srcCall(f, "RejectPlayer", live(player_3));
		}
		if (isEqual(rt.gv(f, "joblessrole", rt.gv(f, "prefs", rt.fv(f, "client", live(player_3)))), 1)) {
			yield* g.srcCall(f, "Debug", fmt("AC2 Assistant located, Player: ＀", [live(player_3)]));
			yield* g.srcCall(f, "AssignRole", live(player_3), "Assistant");
		} else {
			yield* g.srcCall(f, "RejectPlayer", live(player_3));
		}
	}
	rt.endFor(f, 0);
	player_3 = null;
	rt.forList(f, 0, rt.sv(f, "unassigned"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player_3 = $e;
		if (!truthy((yield* g.srcCall(f, "GiveRandomJob", live(player_3))))) {
			yield* g.srcCall(f, "AssignRole", live(player_3), "Assistant");
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /datum/controller/subsystem/job/proc/EquipRank  (code/controllers/subsystem/job.dm:361)  may sleep
rt.def("/datum/controller/subsystem/job/proc/EquipRank", function* EquipRank(f: Frame, M: Value, rank: Value, joined_late: Value) {
	let N: Value = null, H: Value = null, job: Value = null, S: Value = null, sloc: Value = null, new_mob: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [M, rank, joined_late, N, H, job, S, sloc, new_mob, $0, $1, $e];
	if (live(joined_late) === null) {
		joined_late = 0;
	}
	N = null;
	H = null;
	if (!truthy(live(joined_late))) {
		H = rt.gv(f, "new_character", (N = live(M)));
	} else {
		H = live(M);
	}
	job = (yield* g.srcCall(f, "GetJob", live(rank)));
	rt.setFv(f, "job", live(H), live(rank));
	if (!truthy(live(joined_late))) {
		S = null;
		sloc = null;
		rt.forList(f, 0, rt.gl("start_landmarks_list"), T("/obj/effect/landmark/start"));
		while (($e = rt.next(f, 0)) !== undefined) {
			sloc = $e;
			if (!isEqual(rt.fv(f, "name", live(sloc)), live(rank))) {
				S = live(sloc);
				continue;
			}
			if (truthy(rt.locateIn(f, T("/mob/living"), rt.fv(f, "loc", live(sloc))))) {
				continue;
			}
			S = live(sloc);
			break;
		}
		rt.endFor(f, 0);
		if (truthy(live(S))) {
			yield* g.callSrc(f, "SendToAtom", [null, live(H), null, live(S), "buckle", 0], rt.Args.Named);
		}
		if (!truthy(live(S))) {
			yield* g.call(f, P("/proc/log_world"), null, [fmt("Couldn't find a round start spawn point for ＀", [live(rank)])]);
			yield* g.srcCall(f, "SendToLateJoin", live(H));
		}
	}
	if (truthy(rt.fv(f, "mind", live(H)))) {
		rt.setFv(f, "assigned_role", rt.fv(f, "mind", live(H)), live(rank));
	}
	if (truthy(live(job))) {
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [(new_mob = (yield* g.callName(f, live(job), "equip", [live(H)])))])))) {
			H = live(new_mob);
			if (!truthy(live(joined_late))) {
				rt.setFv(f, "new_character", live(N), live(H));
			} else {
				M = live(H);
			}
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<b>You are the ＀.</b>", [live(rank)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<b>As the ＀ you answer directly to ＀. Special circumstances may change this.</b>", [live(rank), rt.fv(f, "supervisors", live(job))])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<b>To speak on your departments radio, use the :h button. To see others, look closely at your headset.</b>"]);
	if (truthy(rt.fv(f, "req_admin_notify", live(job)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<b>You are playing a job that is important for Game Progression. If you have to disconnect, please notify the admins via adminhelp.</b>"]);
	}
	if (truthy(rt.fv(f, "minimal_access_threshold", rt.gl("config")))) {
		$0 = live(M);
		if (truthy(rt.fv(f, "jobs_have_minimal_access", rt.gl("config")))) {
			$1 = "full crew, only your job's necessities";
		} else {
			$1 = "skeleton crew, additional access may";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<FONT color='blue'><B>As this station was initially staffed with a ＀ have been added to your ID card.</B></font>", [$1])]);
	}
	if ((truthy(live(job)) && truthy(live(H)))) {
		yield* g.callName(f, live(job), "after_spawn", [live(H), live(M)]);
	}
	return live(H);
}, true);

// /datum/controller/subsystem/job/proc/setup_officer_positions  (code/controllers/subsystem/job.dm:416)  may sleep
rt.def("/datum/controller/subsystem/job/proc/setup_officer_positions", function* setup_officer_positions(f: Frame) {
	let J: Value = null, officer_positions: Value = null, equip_needed: Value = null, i: Value = null, spawnloc: Value = null;
	f.vars = () => [J, officer_positions, equip_needed, i, spawnloc];
	if (!truthy((J = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", ["Security Officer"]))))) {
		rt.throw_(f, (yield* g.new_(f, T("/exception"), ["setup_officer_positions(): Security officer job is missing", "code/controllers/subsystem/job.dm", 418])));
	}
	if (rt.gt(rt.fv(f, "security_scaling_coeff", rt.gl("config")), 0)) {
		if (rt.gt(rt.fv(f, "spawn_positions", live(J)), 0)) {
			yield* g.srcCall(f, "Debug", fmt("Setting open security officer positions to ＀", [(officer_positions = (yield* g.call(f, P("/proc/min"), null, [12, (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "spawn_positions", live(J)), (yield* g.call(f, P("/proc/round"), null, [divide(rt.len(f, rt.sv(f, "unassigned")), rt.fv(f, "security_scaling_coeff", rt.gl("config")))]))]))])))]));
			rt.setFv(f, "total_positions", live(J), live(officer_positions));
			rt.setFv(f, "spawn_positions", live(J), live(officer_positions));
		}
	}
	if (rt.lt((equip_needed = rt.fv(f, "total_positions", live(J))), 0)) {
		equip_needed = 12;
	}
	i = null;
	i = subtract(live(equip_needed), 5);
	while (rt.gt(live(i), 0)) {
		if (truthy(rt.len(f, rt.gl("secequipment")))) {
			yield* g.new_(f, T("/obj/structure/closet/secure_closet/security/sec"), [(spawnloc = rt.index(rt.gl("secequipment"), 1))]);
			(rt.modGl("secequipment", live(spawnloc), subtract));
		} else {
			break;
		}
		i = rt.inc(live(i), -1);
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/job/proc/LoadJobs  (code/controllers/subsystem/job.dm:441)
rt.def("/datum/controller/subsystem/job/proc/LoadJobs", function LoadJobs(f: Frame) {
	let jobstext: Value = null, J: Value = null, jobs: Value = null;
	let $e: any;
	f.vars = () => [jobstext, J, jobs, $e];
	jobstext = rt.call(f, P("/proc/file2text"), null, ["config/jobs.txt"]);
	J = null;
	rt.forList(f, 0, rt.sv(f, "occupations"), T("/datum/job"));
	while (($e = rt.next(f, 0)) !== undefined) {
		J = $e;
		rt.callName(f, (jobs = rt.new_(f, T("/regex"), [fmt("＀=(-1|\\d+),(-1|\\d+)", [rt.fv(f, "title", live(J))])])), "Find", [live(jobstext)]);
		rt.setFv(f, "total_positions", live(J), rt.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "group", live(jobs)), 1)]));
		rt.setFv(f, "spawn_positions", live(J), rt.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "group", live(jobs)), 2)]));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/controller/subsystem/job/proc/HandleFeedbackGathering  (code/controllers/subsystem/job.dm:449)
rt.def("/datum/controller/subsystem/job/proc/HandleFeedbackGathering", function HandleFeedbackGathering(f: Frame) {
	let job: Value = null, tmp_str: Value = null, level1: Value = null, level2: Value = null, level3: Value = null, level4: Value = null, level5: Value = null, level6: Value = null, player: Value = null;
	let $e: any;
	f.vars = () => [job, tmp_str, level1, level2, level3, level4, level5, level6, player, $e];
	job = null;
	rt.forList(f, 0, rt.sv(f, "occupations"), T("/datum/job"));
	while (($e = rt.next(f, 0)) !== undefined) {
		job = $e;
		tmp_str = fmt("|＀|", [rt.fv(f, "title", live(job))]);
		level1 = 0;
		level2 = 0;
		level3 = 0;
		level4 = 0;
		level5 = 0;
		level6 = 0;
		player = null;
		rt.forList(f, 1, rt.gl("player_list"), T("/mob/dead/new_player"));
		while (($e = rt.next(f, 1)) !== undefined) {
			player = $e;
			if (!((isEqual(rt.fv(f, "ready", live(player)), 1) && truthy(rt.fv(f, "mind", live(player)))) && !truthy(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(player)))))) {
				continue;
			}
			if (truthy(rt.call(f, P("/proc/jobban_isbanned"), null, [live(player), rt.fv(f, "title", live(job))]))) {
				level5 = rt.inc(live(level5), 1);
				continue;
			}
			if (truthy(rt.bitAnd(rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(player))), "GetJobDepartment", [live(job), 1]), rt.fv(f, "flag", live(job))))) {
				level1 = rt.inc(live(level1), 1);
			} else {
				if (truthy(rt.bitAnd(rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(player))), "GetJobDepartment", [live(job), 2]), rt.fv(f, "flag", live(job))))) {
					level2 = rt.inc(live(level2), 1);
				} else {
					if (truthy(rt.bitAnd(rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(player))), "GetJobDepartment", [live(job), 3]), rt.fv(f, "flag", live(job))))) {
						level3 = rt.inc(live(level3), 1);
					} else {
						level4 = rt.inc(live(level4), 1);
					}
				}
			}
		}
		rt.endFor(f, 1);
		tmp_str = rt.modify(live(tmp_str), fmt("HIGH=＀|MEDIUM=＀|LOW=＀|NEVER=＀|BANNED=＀|YOUNG=＀|-", [live(level1), live(level2), live(level3), live(level4), live(level5), live(level6)]), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/controller/subsystem/job/proc/PopcapReached  (code/controllers/subsystem/job.dm:479)
rt.def("/datum/controller/subsystem/job/proc/PopcapReached", function PopcapReached(f: Frame) {
	let relevent_cap: Value = null;
	f.vars = () => [relevent_cap];
	if ((truthy(rt.fv(f, "hard_popcap", rt.gl("config"))) || truthy(rt.fv(f, "extreme_popcap", rt.gl("config"))))) {
		relevent_cap = rt.call(f, P("/proc/max"), null, [rt.fv(f, "hard_popcap", rt.gl("config")), rt.fv(f, "extreme_popcap", rt.gl("config"))]);
		if (rt.ge(subtract(rt.sv(f, "initial_players_to_assign"), rt.len(f, rt.sv(f, "unassigned"))), live(relevent_cap))) {
			return 1;
		}
	}
	return 0;
});

// /datum/controller/subsystem/job/proc/RejectPlayer  (code/controllers/subsystem/job.dm:486)
rt.def("/datum/controller/subsystem/job/proc/RejectPlayer", function RejectPlayer(f: Frame, player: Value) {
	if ((truthy(rt.fv(f, "mind", live(player))) && truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(player)))))) {
		return live(f.dot);
	}
	if (truthy(rt.callSrc(f, "PopcapReached", []))) {
		rt.callSrc(f, "Debug", [fmt("Popcap overflow Check observer located, Player: ＀", [live(player)])]);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(player), "<b>You have failed to qualify for any job you desired.</b>"]);
	(rt.modSrcVar(f, "unassigned", live(player), subtract));
	rt.setFv(f, "ready", live(player), 0);
	return f.dot;
});

// /datum/controller/subsystem/job/proc/Recover  (code/controllers/subsystem/job.dm:498)  may sleep
rt.def("/datum/controller/subsystem/job/proc/Recover", function* Recover(f: Frame) {
	let oldjobs: Value = null, J: Value = null;
	let $e: any;
	f.vars = () => [oldjobs, J, $e];
	oldjobs = rt.fv(f, "occupations", rt.gl("SSjob"));
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	J = null;
	rt.forList(f, 0, live(oldjobs), T("/datum/job"));
	while (($e = rt.next(f, 0)) !== undefined) {
		J = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/datum/controller/subsystem/job/proc/RecoverJob"), live(J)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /datum/controller/subsystem/job/proc/RecoverJob  (code/controllers/subsystem/job.dm:503)  may sleep
rt.def("/datum/controller/subsystem/job/proc/RecoverJob", function* RecoverJob(f: Frame, J: Value) {
	let newjob: Value = null;
	f.vars = () => [J, newjob];
	if (!truthy((rt.istype((newjob = (yield* g.srcCall(f, "GetJob", rt.fv(f, "title", live(J))))), T("/datum/job")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setFv(f, "total_positions", live(newjob), rt.fv(f, "total_positions", live(J)));
	rt.setFv(f, "spawn_positions", live(newjob), rt.fv(f, "spawn_positions", live(J)));
	rt.setFv(f, "current_positions", live(newjob), rt.fv(f, "current_positions", live(J)));
	return f.dot;
}, true, { argTypes: [{ path: "/datum/job" }] });

// /datum/controller/subsystem/job/proc/SendToAtom  (code/controllers/subsystem/job.dm:511)  may sleep
rt.def("/datum/controller/subsystem/job/proc/SendToAtom", function* SendToAtom(f: Frame, M: Value, A: Value, buckle: Value) {
	let C: Value = null;
	f.vars = () => [M, A, buckle, C];
	if (((truthy(live(buckle)) && truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) && truthy((rt.istype(live(A), T("/obj/structure/chair")) ? 1 : 0)))) {
		if (truthy((yield* g.callName(f, (C = live(A)), "buckle_mob", [live(M), 0, 0])))) {
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(M), "forceMove", [rt.getStep(f, live(A), 0)]);
	return f.dot;
}, true);

// /datum/controller/subsystem/job/proc/SendToLateJoin  (code/controllers/subsystem/job.dm:518)  may sleep
rt.def("/datum/controller/subsystem/job/proc/SendToLateJoin", function* SendToLateJoin(f: Frame, M: Value, buckle: Value) {
	let A: Value = null, C: Value = null, avail: Value = null, _T: Value = null, arrivals_turfs: Value = null, _T_2: Value = null, msg: Value = null;
	let $e: any;
	f.vars = () => [M, buckle, A, C, avail, _T, arrivals_turfs, _T_2, msg, $e];
	if (live(buckle) === null) {
		buckle = 1;
	}
	if (truthy(rt.len(f, rt.sv(f, "latejoin_trackers")))) {
		yield* g.srcCall(f, "SendToAtom", live(M), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "latejoin_trackers")]), live(buckle));
	} else {
		if (truthy((A = rt.locateIn(f, T("/area/shuttle/arrival"), rt.gl("sortedAreas"))))) {
			if (truthy((C = rt.locateIn(f, T("/obj/structure/chair"), live(A))))) {
				yield* g.srcCall(f, "SendToAtom", live(M), live(C), live(buckle));
				return live(f.dot);
			} else {
				avail = rt.list();
				_T = null;
				rt.forList(f, 0, live(A), T("/turf"));
				while (($e = rt.next(f, 0)) !== undefined) {
					_T = $e;
					if (!truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T), 1])))) {
						avail = rt.modify(live(avail), live(_T), add);
					}
				}
				rt.endFor(f, 0);
				if (truthy(rt.len(f, live(avail)))) {
					yield* g.srcCall(f, "SendToAtom", live(M), rt.op(f, "PickUnweighted", [1], [live(avail)]), 0);
					return live(f.dot);
				}
			}
		}
		if (truthy(rt.getLen(f, (arrivals_turfs = (yield* g.call(f, P("/proc/shuffle"), null, [(yield* g.call(f, P("/proc/get_area_turfs"), null, [T("/area/shuttle/arrival")]))])))))) {
			_T_2 = null;
			rt.forList(f, 0, live(arrivals_turfs), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T_2 = $e;
				if (!truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T_2), 1])))) {
					yield* g.srcCall(f, "SendToAtom", live(M), live(_T_2), 0);
					return live(f.dot);
				}
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "SendToAtom", live(M), rt.index(live(arrivals_turfs), 1), 0);
		} else {
			yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("Unable to send mob ＀ to late join!", [live(M)]))]);
			yield* g.call(f, P("/proc/CRASH"), null, [live(msg)]);
		}
	}
	return f.dot;
}, true);
