// Based on /tg/station's code/game/gamemodes/revolution/revolution.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(1098, "/datum/game_mode/revolution", "/datum/game_mode", {
	finished: 0,
	check_counter: 0,
	max_headrevs: 3,
	heads_to_kill: null,
	name: "revolution",
	config_tag: "revolution",
	antag_flag: "revolutionary",
	restricted_jobs: null,
	required_players: 20,
	required_enemies: 1,
	recommended_enemies: 3,
	announce_span: "danger",
	announce_text: "Some crewmembers are attempting a coup!\n<span class='danger'>Revolutionaries</span>: Expand your cause and overthrow the heads of staff by execution or otherwise.\n<span class='notice'>Crew</span>: Prevent the revolutionaries from taking over the station.",
});

// revolution.dm:31
rt.def("/datum/game_mode/revolution/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_jobs = list("Security Officer", "Warden", "Detective", "AI", "Cyborg", "Captain", "Head of Personnel", "Head of Security", "Chief Engineer", "Research Director", "Chief Medical Officer");

	this.heads_to_kill = list();
	return f.dot;
});

// revolution.dm:37
rt.def("/datum/game_mode/revolution/proc/announce", function announce(f: Frame) {
	to_chat(rt.world(), "<B>The current game mode is - Revolution!</B>");
	to_chat(rt.world(), "<B>Some crewmembers are attempting to start a revolution!<BR>\nRevolutionaries - Kill the Captain, HoP, HoS, CE, RD and CMO. Convert other crewmembers (excluding the heads of staff, and security officers) to your cause by flashing them. Protect your leaders.<BR>\nPersonnel - Protect the heads of staff. Kill the leaders of the revolution, and brainwash the other revolutionaries (by beating them in the head).</B>");
	return f.dot;
});

// revolution.dm:46
rt.def("/datum/game_mode/revolution/proc/pre_setup", function pre_setup(f: Frame) {
	let i: Value = null, lenin: Value = null;
	let $e: any;
	if (GLOB.config.protect_roles_from_antagonist) {
		this.restricted_jobs += this.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		this.restricted_jobs += "Assistant";
	}
	rt.forRange(f, 0, 1, this.max_headrevs, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (rt.len(f, this.antag_candidates) == 0) {
			break;
		}
		this.antag_candidates -= (lenin = pick(this.antag_candidates));
		this.head_revolutionaries += lenin;
		lenin.restricted_roles = this.restricted_jobs;
	}
	rt.endFor(f, 0);
	if (rt.len(f, this.head_revolutionaries) < this.required_enemies) {
		return 0;
	}
	return 1;
});

// revolution.dm:67
rt.def("/datum/game_mode/revolution/proc/post_setup", function* post_setup(f: Frame) {
	let rev_mind: Value = null, newcandidates: Value = null, M: Value = null, lenin: Value = null, Nm: Value = null, trotsky: Value = null, head_mind: Value = null;
	let heads: Value = this.get_living_heads();
	let sec: Value = this.get_living_sec();
	let weighted_score: Value = min(max(round(rt.len(f, heads) - (8 - rt.len(f, sec)) / 3), 1), this.max_headrevs);
	for (rev_mind of each(this.head_revolutionaries, T("/datum/mind"))) {
		if (rt.istype(rev_mind.current, T("/mob/dead/new_player"))) {
			this.head_revolutionaries -= rev_mind;
			if (rt.len(f, (newcandidates = shuffle(this.antag_candidates))) == 0) {
				continue;
			}
			M = null;
			for (M of each(newcandidates)) {
				this.antag_candidates -= (lenin = M);
				newcandidates -= lenin;
				if (rt.istype(lenin.current, T("/mob/dead/new_player"))) {
					continue;
				}
				if (rt.isIn(f, (Nm = lenin.current).job, this.restricted_jobs)) {
					this.antag_candidates += lenin;
					continue;
				}
				this.head_revolutionaries += lenin;
				break;
			}
		}
	}
	while (weighted_score < rt.len(f, this.head_revolutionaries)) {
		this.antag_candidates += (trotsky = pick(this.head_revolutionaries));
		this.head_revolutionaries -= trotsky;
		this.update_rev_icons_removed(trotsky);
	}
	rev_mind = null;
	for (rev_mind of each(this.head_revolutionaries, T("/datum/mind"))) {
		log_game(`${rev_mind.key} (ckey) has been selected as a head rev`);
		head_mind = null;
		for (head_mind of each(heads, T("/datum/mind"))) {
			this.mark_for_death(rev_mind, head_mind);
		}
		rt.spawnTail(f, rand(10, 100), "/datum/game_mode/revolution/proc/post_setup: spawn at game/gamemodes/revolution/revolution.dm:102", heads, sec, weighted_score, rev_mind, newcandidates, M, lenin, Nm, trotsky, head_mind);
	}
	rev_mind = null;
	for (rev_mind of each(this.head_revolutionaries, T("/datum/mind"))) {
		this.greet_revolutionary(rev_mind);
	}
	this.modePlayer += this.head_revolutionaries;
	yield* GLOB.SSshuttle.registerHostileEnvironment(this);
	yield* parent_proc();
	return f.dot;
}, true);

// a spawn((yield* g.call(f, P("/proc/rand"), null, [10, 100]))) body of /datum/game_mode/revolution/proc/post_setup, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/game_mode/revolution/proc/post_setup: spawn at game/gamemodes/revolution/revolution.dm:102", function* (f: Frame, heads: Value, sec: Value, weighted_score: Value, rev_mind: Value, newcandidates: Value, M: Value, lenin: Value, Nm: Value, trotsky: Value, head_mind: Value) {
	yield* this.equip_revolutionary(rev_mind.current);
	return null;
});

// revolution.dm:117
rt.def("/datum/game_mode/revolution/proc/process", function* process(f: Frame) {
	this.check_counter++;
	if (this.check_counter >= 5) {
		if (!this.finished) {
			yield* this.check_heads();
			GLOB.SSticker.mode.check_win();
		}
		this.check_counter = 0;
	}
	return 0;
}, true, { waitfor: false });

// revolution.dm:127
rt.def("/datum/game_mode/proc/forge_revolutionary_objectives", function forge_revolutionary_objectives(f: Frame, rev_mind: Value) {
	let head_mind: Value = null, rev_obj: Value = null;
	let heads: Value = this.get_living_heads();
	for (head_mind of each(heads, T("/datum/mind"))) {
		(rev_obj = new_(T("/datum/objective/mutiny"))).owner = rev_mind;
		rev_obj.target = head_mind;
		rev_obj.explanation_text = `Assassinate or exile ${head_mind.name}, the ${head_mind.assigned_role}.`;
		rev_mind.objectives += rev_obj;
	}
	return f.dot;
});

// revolution.dm:136
rt.def("/datum/game_mode/proc/greet_revolutionary", function greet_revolutionary(f: Frame, rev_mind: Value, you_are: Value) {
	you_are ??= 1;
	this.update_rev_icons_added(rev_mind);
	if (you_are) {
		to_chat(rev_mind.current, "<span class='userdanger'>You are a member of the revolutionaries' leadership!</span>");
	}
	rev_mind.special_role = "Head Revolutionary";
	rev_mind.announce_objectives();
	return f.dot;
});

// revolution.dm:146
rt.def("/datum/game_mode/proc/equip_revolutionary", function* equip_revolutionary(f: Frame, mob: Value) {
	if (!rt.istype(mob, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (mob.mind) {
		if (mob.mind.assigned_role == "Clown") {
			to_chat(mob, "Your training has allowed you to overcome your clownish nature, allowing you to wield weapons without harming yourself.");
			yield* mob.dna.remove_mutation("Clumsiness");
		}
	}
	let _T: Value = (yield* new_(T("/obj/item/device/assembly/flash"), mob));
	let R: Value = (yield* new_(T("/obj/item/toy/crayon/spraycan"), mob));
	let C: Value = (yield* new_(T("/obj/item/clothing/glasses/hud/security/chameleon"), mob));
	let slots: Value = rt.alist(f, ["backpack", slot_in_backpack, "left pocket", slot_l_store, "right pocket", slot_r_store]);
	let where: Value = (yield* mob.equip_in_one_of_slots(_T, slots));
	let where2: Value = (yield* mob.equip_in_one_of_slots(C, slots));
	yield* mob.equip_in_one_of_slots(R, slots);
	if (!where2) {
		to_chat(mob, "The Syndicate were unfortunately unable to get you a chameleon security HUD.");
	} else {
		to_chat(mob, `The chameleon security HUD in your ${where2} will help you keep track of who is mindshield-implanted, and unable to be recruited.`);
	}
	if (!where) {
		to_chat(mob, "The Syndicate were unfortunately unable to get you a flash.");
	} else {
		to_chat(mob, `The flash in your ${where} will help you to persuade the crew to join your cause.`);
		return 1;
	}
	return f.dot;
}, true);

// revolution.dm:183
rt.def("/datum/game_mode/revolution/proc/mark_for_death", function mark_for_death(f: Frame, rev_mind: Value, head_mind: Value) {
	let rev_obj: Value = null;
	(rev_obj = new_(T("/datum/objective/mutiny"))).owner = rev_mind;
	rev_obj.target = head_mind;
	rev_obj.explanation_text = `Assassinate ${head_mind.name}, the ${head_mind.assigned_role}.`;
	rev_mind.objectives += rev_obj;
	this.heads_to_kill += head_mind;
	return f.dot;
});

// revolution.dm:194
rt.def("/datum/game_mode/revolution/proc/check_heads", function* check_heads(f: Frame) {
	let new_heads: Value = null, head_mind: Value = null, rev_mind: Value = null;
	let heads: Value = this.get_all_heads();
	let sec: Value = this.get_all_sec();
	if (rt.len(f, this.heads_to_kill) < rt.len(f, heads)) {
		new_heads = heads - this.heads_to_kill;
		for (head_mind of each(new_heads, T("/datum/mind"))) {
			rev_mind = null;
			for (rev_mind of each(this.head_revolutionaries, T("/datum/mind"))) {
				this.mark_for_death(rev_mind, head_mind);
			}
		}
	}
	if (!(rt.len(f, this.head_revolutionaries) < this.max_headrevs && rt.len(f, this.head_revolutionaries) < round(rt.len(f, heads) - (8 - rt.len(f, sec)) / 3))) return f.dot;
	yield* this.latejoin_headrev();
	return f.dot;
}, true);

// revolution.dm:210
rt.def("/datum/game_mode/revolution/proc/latejoin_headrev", function* latejoin_headrev(f: Frame) {
	let khrushchev: Value = null, stalin: Value = null;
	if (!this.revolutionaries) return f.dot;
	let promotable_revs: Value = list();
	for (khrushchev of each(this.revolutionaries, T("/datum/mind"))) {
		if (khrushchev.current && !khrushchev.current.incapacitated() && !khrushchev.current.restrained() && khrushchev.current.client && khrushchev.current.stat != 2) {
			if (rt.isIn(f, "revolutionary", khrushchev.current.client.prefs.be_special)) {
				promotable_revs += khrushchev;
			}
		}
	}
	if (!rt.len(f, promotable_revs)) return f.dot;
	this.revolutionaries -= (stalin = pick(promotable_revs));
	this.head_revolutionaries += stalin;
	log_game(`${stalin.key} (ckey) has been promoted to a head rev`);
	yield* this.equip_revolutionary(stalin.current);
	this.forge_revolutionary_objectives(stalin);
	this.greet_revolutionary(stalin);
	return f.dot;
}, true);

// revolution.dm:228
rt.def("/datum/game_mode/revolution/proc/check_win", function check_win(f: Frame) {
	if (this.check_rev_victory()) {
		this.finished = 1;
	} else if (this.check_heads_victory()) {
		this.finished = 2;
	}
	return f.dot;
});

// revolution.dm:238
rt.def("/datum/game_mode/revolution/proc/check_finished", function* check_finished(f: Frame) {
	if (rt.index(GLOB.config.continuous, "revolution")) {
		if (this.finished) {
			yield* GLOB.SSshuttle.clearHostileEnvironment(this);
		}
		return (yield* parent_proc());
	}
	if (this.finished != 0) {
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// revolution.dm:251
rt.def("/proc/is_revolutionary", function is_revolutionary(f: Frame, M: Value) {
	return (rt.isIn(f, (((((M && (rt.istype(M, T("/mob")) ? 1 : 0)) && M.mind) && GLOB.SSticker) && GLOB.SSticker.mode) && M.mind), GLOB.SSticker.mode.revolutionaries) ? 1 : 0);
});

// revolution.dm:254
rt.def("/proc/is_head_revolutionary", function is_head_revolutionary(f: Frame, M: Value) {
	return (rt.isIn(f, (((((M && (rt.istype(M, T("/mob")) ? 1 : 0)) && M.mind) && GLOB.SSticker) && GLOB.SSticker.mode) && M.mind), GLOB.SSticker.mode.head_revolutionaries) ? 1 : 0);
});

// revolution.dm:257
rt.def("/proc/is_revolutionary_in_general", function is_revolutionary_in_general(f: Frame, M: Value) {
	return (is_revolutionary(M) || is_head_revolutionary(M));
});

// revolution.dm:260
rt.def("/datum/game_mode/proc/add_revolutionary", function* add_revolutionary(f: Frame, rev_mind: Value) {
	let H: Value = null, carbon_mob: Value = null;
	if (rt.isIn(f, rev_mind.assigned_role, GLOB.command_positions)) {
		return 0;
	}
	if ((H = rev_mind.current).isloyal()) {
		return 0;
	}
	if (rt.isIn(f, rev_mind, this.revolutionaries) || rt.isIn(f, rev_mind, this.head_revolutionaries)) {
		return 0;
	}
	this.revolutionaries += rev_mind;
	if (rt.istype(rev_mind.current, T("/mob/living/carbon"))) {
		(carbon_mob = rev_mind.current).silent = max(carbon_mob.silent, 5);
		yield* carbon_mob.flash_act(1, 1);
	}
	yield* rev_mind.current.Stun(100);
	to_chat(rev_mind.current, "<span class='danger'><FONT size = 3> You are now a revolutionary! Help your cause. Do not harm your fellow freedom fighters. You can identify your comrades by the red \"R\" icons, and your leaders by the blue \"R\" icons. Help them kill the heads to win the revolution!</FONT></span>");
	rev_mind.current.log_message("<font color='red'>Has been converted to the revolution!</font>", "Attack log");
	rev_mind.special_role = "Revolutionary";
	this.update_rev_icons_added(rev_mind);
	if (jobban_isbanned(rev_mind.current, "revolutionary")) {
		yield* ImmediateInvokeAsync(this, P("/datum/game_mode/proc/replace_jobbaned_player"), rev_mind.current, "revolutionary", "revolutionary");
	}
	return 1;
}, true);

// revolution.dm:285
rt.def("/datum/game_mode/proc/remove_revolutionary", function* remove_revolutionary(f: Frame, rev_mind: Value, beingborged: Value) {
	let $0: any, $1: any, $2: any;
	let remove_head: Value = 0;
	if (beingborged && rt.isIn(f, rev_mind, this.head_revolutionaries)) {
		this.head_revolutionaries -= rev_mind;
		remove_head = 1;
	}
	if (!(rt.isIn(f, rev_mind, this.revolutionaries) || remove_head)) return f.dot;
	this.revolutionaries -= rev_mind;
	rev_mind.special_role = null;
	rev_mind.current.log_message("<font color='red'>Has renounced the revolution!</font>", "Attack log");
	if (beingborged) {
		$0 = rev_mind.current;
		$1 = "The frame beeps contentedly, purging the hostile memory engram from the MMI before initalizing it.";
		if (remove_head) {
			$2 = ".";
		} else {
			$2 = " but the name of the one who flashed you.";
		}
		$0.visible_message($1, `<span class='danger'><FONT size = 3>The frame's firmware detects and deletes your neural reprogramming! You remember nothing${$2}</FONT></span>`);
		message_admins(`${`${key_name_admin(rev_mind.current)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rev_mind.current])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rev_mind.current])}`} has been borged while being a ${remove_head ? "leader" : " member"} of the revolution.`);
	} else {
		yield* rev_mind.current.Unconscious(100);
		rev_mind.current.visible_message(`${rev_mind.current} looks like they just remembered their real allegiance!`, "<span class='danger'><FONT size = 3>You have been brainwashed! You are no longer a revolutionary! Your memory is hazy from the time you were a rebel...the only thing you remember is the name of the one who brainwashed you...</FONT></span>");
	}
	this.update_rev_icons_removed(rev_mind);
	return f.dot;
}, true);

// revolution.dm:309
rt.def("/datum/game_mode/proc/update_rev_icons_added", function update_rev_icons_added(f: Frame, rev_mind: Value) {
	let revhud: Value = null;
	(revhud = rt.index(GLOB.huds, ANTAG_HUD_REV)).join_hud(rev_mind.current);
	let $0: any = rev_mind.current;
	this.set_antag_hud($0, rt.isIn(f, rev_mind, this.head_revolutionaries) ? "rev_head" : "rev");
	return f.dot;
});

// revolution.dm:317
rt.def("/datum/game_mode/proc/update_rev_icons_removed", function update_rev_icons_removed(f: Frame, rev_mind: Value) {
	let revhud: Value = null;
	(revhud = rt.index(GLOB.huds, ANTAG_HUD_REV)).leave_hud(rev_mind.current);
	this.set_antag_hud(rev_mind.current, null);
	return f.dot;
});

// revolution.dm:325
rt.def("/datum/game_mode/revolution/proc/check_rev_victory", function check_rev_victory(f: Frame) {
	let rev_mind: Value = null, objective: Value = null;
	for (rev_mind of each(this.head_revolutionaries, T("/datum/mind"))) {
		objective = null;
		for (objective of each(rev_mind.objectives, T("/datum/objective/mutiny"))) {
			if (!objective.check_completion()) {
				return 0;
			}
		}
		return 1;
	}
	return f.dot;
});

// revolution.dm:336
rt.def("/datum/game_mode/revolution/proc/check_heads_victory", function check_heads_victory(f: Frame) {
	let rev_mind: Value = null, _T: Value = null;
	for (rev_mind of each(this.head_revolutionaries, T("/datum/mind"))) {
		_T = rt.getStep(f, rev_mind.current, 0);
		if (rev_mind && rev_mind.current && rev_mind.current.stat != 2 && _T && _T.z == ZLEVEL_STATION) {
			if (rt.istype(rev_mind.current, T("/mob/living/carbon/human"))) {
				return 0;
			}
		}
	}
	return 1;
});

// revolution.dm:347
rt.def("/datum/game_mode/revolution/proc/declare_completion", function declare_completion(f: Frame) {
	if (this.finished == 1) {
		GLOB.SSticker.mode_result = "win - heads killed";
		to_chat(rt.world(), "<span class='redtext'>The heads of staff were killed or exiled! The revolutionaries win!</span>");
		GLOB.SSticker.news_report = REVS_WIN;
	} else if (this.finished == 2) {
		GLOB.SSticker.mode_result = "loss - rev heads killed";
		to_chat(rt.world(), "<span class='redtext'>The heads of staff managed to stop the revolution!</span>");
		GLOB.SSticker.news_report = REVS_LOSE;
	}
	parent_proc();
	return 1;
});

// revolution.dm:362
rt.def("/datum/game_mode/proc/auto_declare_completion_revolution", function auto_declare_completion_revolution(f: Frame) {
	let num_revs: Value = null, num_survivors: Value = null, survivor: Value = null, text: Value = null, headrev: Value = null, text_1: Value = null, rev: Value = null, head: Value = null, target: Value = null;
	let targets: Value = list();
	if (rt.len(f, this.head_revolutionaries) || rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/revolution"))) {
		num_revs = 0;
		num_survivors = 0;
		for (survivor of each(GLOB.living_mob_list, T("/mob/living/carbon"))) {
			if (survivor.ckey) {
				num_survivors++;
				if (survivor.mind) {
					if (rt.isIn(f, survivor.mind, this.head_revolutionaries) || rt.isIn(f, survivor.mind, this.revolutionaries)) {
						num_revs++;
					}
				}
			}
		}
		if (num_survivors) {
			to_chat(rt.world(), `${GLOB.TAB}Command's Approval Rating: <B>${100 - round(num_revs / num_survivors * 100, 0.1)}%</B>`);
		}
		text = "<br><font size=3><b>The head revolutionaries were:</b></font>";
		for (headrev of each(this.head_revolutionaries, T("/datum/mind"))) {
			text += this.printplayer(headrev, 1);
		}
		text += "<br>";
		to_chat(rt.world(), text);
	}
	if (rt.len(f, this.revolutionaries) || rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/revolution"))) {
		text_1 = "<br><font size=3><b>The revolutionaries were:</b></font>";
		for (rev of each(this.revolutionaries, T("/datum/mind"))) {
			text_1 += this.printplayer(rev, 1);
		}
		text_1 += "<br>";
		to_chat(rt.world(), text_1);
	}
	if (!(rt.len(f, this.head_revolutionaries) || rt.len(f, this.revolutionaries) || rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/revolution")))) return f.dot;
	text_1 = "<br><font size=3><b>The heads of staff were:</b></font>";
	let heads: Value = this.get_all_heads();
	for (head of each(heads, T("/datum/mind"))) {
		if (target = (rt.isIn(f, head, targets) ? 1 : 0)) {
			text_1 += "<span class='boldannounce'>Target</span>";
		}
		text_1 += this.printplayer(head, 1);
	}
	text_1 += "<br>";
	to_chat(rt.world(), text_1);
	return f.dot;
});
