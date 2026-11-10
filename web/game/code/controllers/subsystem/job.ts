// Based on /tg/station's code/controllers/subsystem/job.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// job.dm:1
rt.def("/datum/controller/subsystem/job/proc/New", function* New(f: Frame) {
	if (GLOB.SSjob != this) {
		if (rt.istype(GLOB.SSjob, T("/datum/controller/subsystem/job"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSjob);
		}
		GLOB.SSjob = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// job.dm:6
rt.def("/datum/controller/subsystem/job/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.occupations = list();

	this.name_occupations = list();

	this.type_occupations = list();

	this.unassigned = list();

	this.job_debug = list();

	this.prioritized_jobs = list();

	this.latejoin_trackers = list();
	return f.dot;
});

// job.dm:17
rt.def("/datum/controller/subsystem/job/proc/Initialize", function* Initialize(f: Frame, timeofday: Value) {
	if (!rt.len(f, this.occupations)) {
		yield* this.SetupOccupations();
	}
	if (GLOB.config.load_jobs_from_txt) {
		this.LoadJobs();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// job.dm:25
rt.def("/datum/controller/subsystem/job/proc/SetupOccupations", function* SetupOccupations(f: Frame, faction: Value) {
	let all_jobs: Value = null, J: Value = null, job: Value = null;
	faction ??= "Station";
	this.occupations = list();
	if (!rt.len(f, (all_jobs = typesof(T("/datum/job")) - T("/datum/job")))) {
		to_chat(rt.world(), "<span class='boldannounce'>Error setting up jobs, no job datums found</span>");
		return 0;
	}
	for (J of each(all_jobs)) {
		if (!(job = (yield* new_(J)))) {
			continue;
		}
		if (job.faction != faction) {
			continue;
		}
		if (!job.config_check()) {
			continue;
		}
		if (!job.map_check()) {
			continue;
		}
		this.occupations += job;
		rt.setAt(this.name_occupations, job.title, job);
		rt.setAt(this.type_occupations, J, job);
	}
	return 1;
}, true);

// job.dm:50
rt.def("/datum/controller/subsystem/job/proc/Debug", function Debug(f: Frame, text: Value) {
	if (!GLOB.Debug2) {
		return 0;
	}
	this.job_debug.Add(text);
	return 1;
});

// job.dm:57
rt.def("/datum/controller/subsystem/job/proc/GetJob", function* GetJob(f: Frame, rank: Value) {
	if (!rt.len(f, this.occupations)) {
		yield* this.SetupOccupations();
	}
	return rt.index(this.name_occupations, rank);
}, true);

// job.dm:62
rt.def("/datum/controller/subsystem/job/proc/GetJobType", function* GetJobType(f: Frame, jobtype: Value) {
	if (!rt.len(f, this.occupations)) {
		yield* this.SetupOccupations();
	}
	return rt.index(this.type_occupations, jobtype);
}, true);

// job.dm:67
rt.def("/datum/controller/subsystem/job/proc/AssignRole", function* AssignRole(f: Frame, player: Value, rank: Value, latejoin: Value) {
	let job: Value = null, position_limit: Value = null;
	latejoin ??= 0;
	this.Debug(`Running AR, Player: ${player}, Rank: ${rank}, LJ: ${latejoin}`);
	if (player && player.mind && rank) {
		if (!(job = (yield* this.GetJob(rank)))) {
			return 0;
		}
		if (jobban_isbanned(player, rank)) {
			return 0;
		}
		position_limit = job.total_positions;
		if (!latejoin) {
			position_limit = job.spawn_positions;
		}
		this.Debug(`Player: ${player} is now Rank: ${rank}, JCP:${job.current_positions}, JPL:${position_limit}`);
		player.mind.assigned_role = rank;
		this.unassigned -= player;
		job.current_positions++;
		return 1;
	}
	this.Debug(`AR has failed, Player: ${player}, Rank: ${rank}`);
	return 0;
}, true);

// job.dm:89
rt.def("/datum/controller/subsystem/job/proc/FindOccupationCandidates", function FindOccupationCandidates(f: Frame, job: Value, level: Value, flag: Value) {
	let player: Value = null;
	this.Debug(`Running FOC, Job: ${job}, Level: ${level}, Flag: ${flag}`);
	let candidates: Value = list();
	for (player of each(this.unassigned, T("/mob/dead/new_player"))) {
		if (jobban_isbanned(player, job.title)) {
			this.Debug(`FOC isbanned failed, Player: ${player}`);
			continue;
		}
		if (flag && !rt.isIn(f, flag, player.client.prefs.be_special)) {
			this.Debug(`FOC flag failed, Player: ${player}, Flag: ${flag}, `);
			continue;
		}
		if (rt.isIn(f, (player.mind && job.title), player.mind.restricted_roles)) {
			this.Debug(`FOC incompatible with antagonist role, Player: ${player}`);
			continue;
		}
		if (GLOB.config.enforce_human_authority && !player.client.prefs.pref_species.qualifies_for_rank(job.title, player.client.prefs.features)) {
			this.Debug(`FOC non-human failed, Player: ${player}`);
			continue;
		}
		if (rt.bitAnd(player.client.prefs.GetJobDepartment(job, level), job.flag)) {
			this.Debug(`FOC pass, Player: ${player}, Level:${level}`);
			candidates += player;
		}
	}
	return candidates;
});

// job.dm:113
rt.def("/datum/controller/subsystem/job/proc/GiveRandomJob", function* GiveRandomJob(f: Frame, player: Value) {
	let job: Value = null;
	this.Debug(`GRJ Giving random job, Player: ${player}`);
	f.dot = 0;
	for (job of each(shuffle(this.occupations), T("/datum/job"))) {
		if (!job) {
			continue;
		}
		if (rt.op(f, "IsType", [], [job, (yield* this.GetJob("Assistant"))])) {
			continue;
		}
		if (rt.isIn(f, job.title, GLOB.command_positions)) {
			continue;
		}
		if (jobban_isbanned(player, job.title)) {
			this.Debug(`GRJ isbanned failed, Player: ${player}, Job: ${job.title}`);
			continue;
		}
		if (rt.isIn(f, (player.mind && job.title), player.mind.restricted_roles)) {
			this.Debug(`GRJ incompatible with antagonist role, Player: ${player}, Job: ${job.title}`);
			continue;
		}
		if (GLOB.config.enforce_human_authority && !player.client.prefs.pref_species.qualifies_for_rank(job.title, player.client.prefs.features)) {
			this.Debug(`GRJ non-human failed, Player: ${player}`);
			continue;
		}
		if (job.current_positions < job.spawn_positions || job.spawn_positions == -1) {
			this.Debug(`GRJ Random job given, Player: ${player}, Job: ${job}`);
			if (yield* this.AssignRole(player, job.title)) {
				return 1;
			}
		}
	}
	return f.dot;
}, true);

// job.dm:148
rt.def("/datum/controller/subsystem/job/proc/ResetOccupations", function* ResetOccupations(f: Frame) {
	let player: Value = null;
	for (player of each(GLOB.player_list, T("/mob/dead/new_player"))) {
		if (player && player.mind) {
			player.mind.assigned_role = null;
			player.mind.special_role = null;
		}
	}
	yield* this.SetupOccupations();
	this.unassigned = list();
	return f.dot;
}, true);

// job.dm:161
rt.def("/datum/controller/subsystem/job/proc/FillHeadPosition", function* FillHeadPosition(f: Frame) {
	let level: Value = null, command_position: Value = null, job: Value = null, candidates: Value = null, candidate: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		level = $e;
		command_position = null;
		for (command_position of each(GLOB.command_positions)) {
			if (!(job = (yield* this.GetJob(command_position)))) {
				continue;
			}
			if (job.current_positions >= job.total_positions && job.total_positions != -1) {
				continue;
			}
			if (!rt.len(f, (candidates = this.FindOccupationCandidates(job, level)))) {
				continue;
			}
			if (yield* this.AssignRole((candidate = pick(candidates)), command_position)) {
				return 1;
			}
		}
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// job.dm:180
rt.def("/datum/controller/subsystem/job/proc/CheckHeadPositions", function* CheckHeadPositions(f: Frame, level: Value) {
	let command_position: Value = null, job: Value = null, candidates: Value = null, candidate: Value = null;
	for (command_position of each(GLOB.command_positions)) {
		if (!(job = (yield* this.GetJob(command_position)))) {
			continue;
		}
		if (job.current_positions >= job.total_positions && job.total_positions != -1) {
			continue;
		}
		if (!rt.len(f, (candidates = this.FindOccupationCandidates(job, level)))) {
			continue;
		}
		yield* this.AssignRole((candidate = pick(candidates)), command_position);
	}
	return f.dot;
}, true);

// job.dm:194
rt.def("/datum/controller/subsystem/job/proc/FillAIPosition", function* FillAIPosition(f: Frame) {
	let job: Value = null, level: Value = null, candidates: Value = null, candidate: Value = null;
	let $e: any;
	let ai_selected: Value = 0;
	if (!(job = (yield* this.GetJob("AI")))) {
		return 0;
	}
	let i: Value = job.total_positions;
	while (i > 0) {
		level = null;
		rt.forRange(f, 0, 1, 3, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			level = $e;
			candidates = list();
			if (rt.len(f, (candidates = this.FindOccupationCandidates(job, level)))) {
				if (yield* this.AssignRole((candidate = pick(candidates)), "AI")) {
					ai_selected++;
					break;
				}
			}
		}
		rt.endFor(f, 0);
		i--;
	}
	if (ai_selected) {
		return 1;
	}
	return 0;
}, true);

// job.dm:217
rt.def("/datum/controller/subsystem/job/proc/DivideOccupations", function* DivideOccupations(f: Frame) {
	let A: Value = null, player: Value = null, assistant_candidates: Value = null, player_2: Value = null, level: Value = null, player_4: Value = null, job: Value = null, player_3: Value = null;
	let $e: any;
	this.Debug("Running DO");
	if (GLOB.SSticker) {
		for (A of each(this.occupations, T("/datum/job/ai"))) {
			if (GLOB.SSticker.triai) {
				A.spawn_positions = 3;
			}
		}
	}
	for (player of each(GLOB.player_list, T("/mob/dead/new_player"))) {
		if (player.ready == 1 && player.mind && !player.mind.assigned_role) {
			this.unassigned += player;
		}
	}
	this.initial_players_to_assign = rt.len(f, this.unassigned);
	this.Debug(`DO, Len: ${rt.len(f, this.unassigned)}`);
	if (rt.len(f, this.unassigned) == 0) {
		return 0;
	}
	yield* this.setup_officer_positions();
	if (GLOB.config.minimal_access_threshold) {
		if (GLOB.config.minimal_access_threshold > rt.len(f, this.unassigned)) {
			GLOB.config.jobs_have_minimal_access = 0;
		} else {
			GLOB.config.jobs_have_minimal_access = 1;
		}
	}
	this.unassigned = shuffle(this.unassigned);
	this.HandleFeedbackGathering();
	this.Debug("DO, Running Assistant Check 1");
	let assist: Value = (yield* new_(T("/datum/job/assistant")));
	this.Debug(`AC1, Candidates: ${rt.len(f, (assistant_candidates = this.FindOccupationCandidates(assist, 3)))}`);
	for (player_2 of each(assistant_candidates, T("/mob/dead/new_player"))) {
		this.Debug(`AC1 pass, Player: ${player_2}`);
		yield* this.AssignRole(player_2, "Assistant");
		assistant_candidates -= player_2;
	}
	this.Debug("DO, AC1 end");
	this.Debug("DO, Running Head Check");
	yield* this.FillHeadPosition();
	this.Debug("DO, Head Check end");
	this.Debug("DO, Running AI Check");
	yield* this.FillAIPosition();
	this.Debug("DO, AI Check end");
	this.Debug("DO, Running Standard Check");
	let shuffledoccupations: Value = shuffle(this.occupations);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		level = $e;
		yield* this.CheckHeadPositions(level);
		player_4 = null;
		for (player_4 of each(this.unassigned, T("/mob/dead/new_player"))) {
			if (this.PopcapReached()) {
				this.RejectPlayer(player_4);
			}
			job = null;
			for (job of each(shuffledoccupations, T("/datum/job"))) {
				if (!job) {
					continue;
				}
				if (jobban_isbanned(player_4, job.title)) {
					this.Debug(`DO isbanned failed, Player: ${player_4}, Job:${job.title}`);
					continue;
				}
				if (rt.isIn(f, (player_4.mind && job.title), player_4.mind.restricted_roles)) {
					this.Debug(`DO incompatible with antagonist role, Player: ${player_4}, Job:${job.title}`);
					continue;
				}
				if (GLOB.config.enforce_human_authority && !player_4.client.prefs.pref_species.qualifies_for_rank(job.title, player_4.client.prefs.features)) {
					this.Debug(`DO non-human failed, Player: ${player_4}, Job:${job.title}`);
					continue;
				}
				if (rt.bitAnd(player_4.client.prefs.GetJobDepartment(job, level), job.flag)) {
					if (job.current_positions < job.spawn_positions || job.spawn_positions == -1) {
						this.Debug(`DO pass, Player: ${player_4}, Level:${level}, Job:${job.title}`);
						yield* this.AssignRole(player_4, job.title);
						this.unassigned -= player_4;
						break;
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	for (player_3 of each(this.unassigned, T("/mob/dead/new_player"))) {
		if (this.PopcapReached()) {
			this.RejectPlayer(player_3);
		} else if (jobban_isbanned(player_3, "Assistant")) {
			yield* this.GiveRandomJob(player_3);
		}
	}
	player_3 = null;
	for (player_3 of each(this.unassigned, T("/mob/dead/new_player"))) {
		if (this.PopcapReached()) {
			this.RejectPlayer(player_3);
		} else if (player_3.client.prefs.joblessrole == 2) {
			yield* this.GiveRandomJob(player_3);
		}
	}
	this.Debug("DO, Standard Check end");
	this.Debug("DO, Running AC2");
	player_3 = null;
	for (player_3 of each(this.unassigned, T("/mob/dead/new_player"))) {
		if (this.PopcapReached()) {
			this.RejectPlayer(player_3);
		}
		if (player_3.client.prefs.joblessrole == 1) {
			this.Debug(`AC2 Assistant located, Player: ${player_3}`);
			yield* this.AssignRole(player_3, "Assistant");
		} else {
			this.RejectPlayer(player_3);
		}
	}
	player_3 = null;
	for (player_3 of each(this.unassigned, T("/mob/dead/new_player"))) {
		if (!(yield* this.GiveRandomJob(player_3))) {
			yield* this.AssignRole(player_3, "Assistant");
		}
	}
	return 1;
}, true);

// job.dm:361
rt.def("/datum/controller/subsystem/job/proc/EquipRank", function* EquipRank(f: Frame, M: Value, rank: Value, joined_late: Value) {
	let N: Value = null, H: Value = null, S: Value = null, sloc: Value = null, new_mob: Value = null;
	let $0: any, $1: any, $e: any;
	joined_late ??= 0;
	if (!joined_late) {
		H = (N = M).new_character;
	} else {
		H = M;
	}
	let job: Value = (yield* this.GetJob(rank));
	H.job = rank;
	if (!joined_late) {
		for (sloc of each(GLOB.start_landmarks_list, T("/obj/effect/landmark/start"))) {
			if (sloc.name != rank) {
				S = sloc;
				continue;
			}
			if (rt.locateIn(f, T("/mob/living"), sloc.loc)) {
				continue;
			}
			S = sloc;
			break;
		}
		if (S) {
			yield* this.SendToAtom(H, S, { buckle: 0 });
		}
		if (!S) {
			log_world(`Couldn't find a round start spawn point for ${rank}`);
			yield* this.SendToLateJoin(H);
		}
	}
	if (H.mind) {
		H.mind.assigned_role = rank;
	}
	if (job) {
		if (ismob((new_mob = (yield* job.equip(H))))) {
			H = new_mob;
			if (!joined_late) {
				N.new_character = H;
			} else {
				M = H;
			}
		}
	}
	to_chat(M, `<b>You are the ${rank}.</b>`);
	to_chat(M, `<b>As the ${rank} you answer directly to ${job.supervisors}. Special circumstances may change this.</b>`);
	to_chat(M, "<b>To speak on your departments radio, use the :h button. To see others, look closely at your headset.</b>");
	if (job.req_admin_notify) {
		to_chat(M, "<b>You are playing a job that is important for Game Progression. If you have to disconnect, please notify the admins via adminhelp.</b>");
	}
	if (GLOB.config.minimal_access_threshold) {
		$0 = M;
		if (GLOB.config.jobs_have_minimal_access) {
			$1 = "full crew, only your job's necessities";
		} else {
			$1 = "skeleton crew, additional access may";
		}
		to_chat($0, `<FONT color='blue'><B>As this station was initially staffed with a ${$1} have been added to your ID card.</B></font>`);
	}
	if (job && H) {
		yield* job.after_spawn(H, M);
	}
	// tg_js: in creative mode (src/vm/creative-map.ts) players can't be hurt: tg's admin Godmode flag (GODMODE), on from the start
	if (H && is_creative()) {
		rt.modField(f, H, "status_flags", 4096, rt.bitOr);
	}
	return H;
}, true);

// job.dm:416
rt.def("/datum/controller/subsystem/job/proc/setup_officer_positions", function* setup_officer_positions(f: Frame) {
	let J: Value = null, officer_positions: Value = null, equip_needed: Value = null, spawnloc: Value = null;
	if (!(J = (yield* GLOB.SSjob.GetJob("Security Officer")))) {
		rt.throw_(f, (yield* new_(T("/exception"), "setup_officer_positions(): Security officer job is missing", "code/controllers/subsystem/job.dm", 418)));
	}
	if (GLOB.config.security_scaling_coeff > 0) {
		if (J.spawn_positions > 0) {
			this.Debug(`Setting open security officer positions to ${(officer_positions = min(12, max(J.spawn_positions, round(rt.len(f, this.unassigned) / GLOB.config.security_scaling_coeff))))}`);
			J.total_positions = officer_positions;
			J.spawn_positions = officer_positions;
		}
	}
	if ((equip_needed = J.total_positions) < 0) {
		equip_needed = 12;
	}
	let i: Value = equip_needed - 5;
	while (i > 0) {
		if (rt.len(f, GLOB.secequipment)) {
			yield* new_(T("/obj/structure/closet/secure_closet/security/sec"), (spawnloc = rt.index(GLOB.secequipment, 1)));
			GLOB.secequipment -= spawnloc;
		} else {
			break;
		}
		i--;
	}
	return f.dot;
}, true);

// job.dm:441
rt.def("/datum/controller/subsystem/job/proc/LoadJobs", function LoadJobs(f: Frame) {
	let J: Value = null, jobs: Value = null;
	let jobstext: Value = file2text("config/jobs.txt");
	for (J of each(this.occupations, T("/datum/job"))) {
		(jobs = new_(T("/regex"), `${J.title}=(-1|\\d+),(-1|\\d+)`)).Find(jobstext);
		J.total_positions = text2num(rt.index(jobs.group, 1));
		J.spawn_positions = text2num(rt.index(jobs.group, 2));
	}
	return f.dot;
});

// job.dm:449
rt.def("/datum/controller/subsystem/job/proc/HandleFeedbackGathering", function HandleFeedbackGathering(f: Frame) {
	let job: Value = null, tmp_str: Value = null, level1: Value = null, level2: Value = null, level3: Value = null, level4: Value = null, level5: Value = null, level6: Value = null, player: Value = null;
	for (job of each(this.occupations, T("/datum/job"))) {
		tmp_str = `|${job.title}|`;
		level1 = 0;
		level2 = 0;
		level3 = 0;
		level4 = 0;
		level5 = 0;
		level6 = 0;
		player = null;
		for (player of each(GLOB.player_list, T("/mob/dead/new_player"))) {
			if (!(player.ready == 1 && player.mind && !player.mind.assigned_role)) {
				continue;
			}
			if (jobban_isbanned(player, job.title)) {
				level5++;
				continue;
			}
			if (rt.bitAnd(player.client.prefs.GetJobDepartment(job, 1), job.flag)) {
				level1++;
			} else if (rt.bitAnd(player.client.prefs.GetJobDepartment(job, 2), job.flag)) {
				level2++;
			} else if (rt.bitAnd(player.client.prefs.GetJobDepartment(job, 3), job.flag)) {
				level3++;
			} else {
				level4++;
			}
		}
		tmp_str += `HIGH=${level1}|MEDIUM=${level2}|LOW=${level3}|NEVER=${level4}|BANNED=${level5}|YOUNG=${level6}|-`;
	}
	return f.dot;
});

// job.dm:479
rt.def("/datum/controller/subsystem/job/proc/PopcapReached", function PopcapReached(f: Frame) {
	let relevent_cap: Value = null;
	if (GLOB.config.hard_popcap || GLOB.config.extreme_popcap) {
		relevent_cap = max(GLOB.config.hard_popcap, GLOB.config.extreme_popcap);
		if (this.initial_players_to_assign - rt.len(f, this.unassigned) >= relevent_cap) {
			return 1;
		}
	}
	return 0;
});

// job.dm:486
rt.def("/datum/controller/subsystem/job/proc/RejectPlayer", function RejectPlayer(f: Frame, player: Value) {
	if (player.mind && player.mind.special_role) {
		return f.dot;
	}
	if (this.PopcapReached()) {
		this.Debug(`Popcap overflow Check observer located, Player: ${player}`);
	}
	to_chat(player, "<b>You have failed to qualify for any job you desired.</b>");
	this.unassigned -= player;
	player.ready = PLAYER_NOT_READY;
	return f.dot;
});

// job.dm:498
rt.def("/datum/controller/subsystem/job/proc/Recover", function* Recover(f: Frame) {
	let J: Value = null;
	let oldjobs: Value = GLOB.SSjob.occupations;
	yield* sleep(20);
	for (J of each(oldjobs, T("/datum/job"))) {
		yield* ImmediateInvokeAsync(this, P("/datum/controller/subsystem/job/proc/RecoverJob"), J);
	}
	return f.dot;
}, true, { waitfor: false });

// job.dm:503
rt.def("/datum/controller/subsystem/job/proc/RecoverJob", function* RecoverJob(f: Frame, J: Value) {
	let newjob: Value = null;
	if (!rt.istype((newjob = (yield* this.GetJob(J.title))), T("/datum/job"))) {
		return f.dot;
	}
	newjob.total_positions = J.total_positions;
	newjob.spawn_positions = J.spawn_positions;
	newjob.current_positions = J.current_positions;
	return f.dot;
}, true, { argTypes: [{ path: "/datum/job" }] });

// job.dm:511
rt.def("/datum/controller/subsystem/job/proc/SendToAtom", function* SendToAtom(f: Frame, M: Value, A: Value, buckle: Value) {
	let C: Value = null;
	if (buckle && rt.istype(M, T("/mob/living")) && rt.istype(A, T("/obj/structure/chair"))) {
		if (yield* (C = A).buckle_mob(M, 0, 0)) {
			return f.dot;
		}
	}
	yield* M.forceMove(rt.getStep(f, A, 0));
	return f.dot;
}, true);

// job.dm:518
rt.def("/datum/controller/subsystem/job/proc/SendToLateJoin", function* SendToLateJoin(f: Frame, M: Value, buckle: Value) {
	let A: Value = null, C: Value = null, avail: Value = null, _T: Value = null, arrivals_turfs: Value = null, _T_2: Value = null, msg: Value = null;
	buckle ??= 1;
	if (rt.len(f, this.latejoin_trackers)) {
		yield* this.SendToAtom(M, pick(this.latejoin_trackers), buckle);
	} else {
		if (A = rt.locateIn(f, T("/area/shuttle/arrival"), GLOB.sortedAreas)) {
			if (C = rt.locateIn(f, T("/obj/structure/chair"), A)) {
				yield* this.SendToAtom(M, C, buckle);
				return f.dot;
			} else {
				avail = list();
				for (_T of each(A, T("/turf"))) {
					if (!is_blocked_turf(_T, 1)) {
						avail += _T;
					}
				}
				if (rt.len(f, avail)) {
					yield* this.SendToAtom(M, pick(avail), 0);
					return f.dot;
				}
			}
		}
		if (rt.len(f, (arrivals_turfs = shuffle(get_area_turfs(T("/area/shuttle/arrival")))))) {
			for (_T_2 of each(arrivals_turfs, T("/turf"))) {
				if (!is_blocked_turf(_T_2, 1)) {
					yield* this.SendToAtom(M, _T_2, 0);
					return f.dot;
				}
			}
			yield* this.SendToAtom(M, rt.index(arrivals_turfs, 1), 0);
		} else {
			message_admins((msg = `Unable to send mob ${M} to late join!`));
			CRASH(msg);
		}
	}
	return f.dot;
}, true);
