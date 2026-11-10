// Based on /tg/station's code/game/gamemodes/cult/cult.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// cult.dm:7
rt.def("/proc/iscultist", function iscultist(f: Frame, M: Value) {
	return (((rt.istype(M, T("/mob/living")) ? 1 : 0) && M.mind) && M.mind.has_antag_datum(T("/datum/antagonist/cult")));
});

// cult.dm:10
rt.def("/proc/is_sacrifice_target", function is_sacrifice_target(f: Frame, mind: Value) {
	if (mind == GLOB.sac_mind) {
		return 1;
	}
	return 0;
});

// cult.dm:15
rt.def("/proc/is_convertable_to_cult", function is_convertable_to_cult(f: Frame, M: Value) {
	if (!rt.istype(M, T("/mob/living"))) {
		return 0;
	}
	if (M.mind) {
		if (rt.istype(M, T("/mob/living/carbon/human")) && rt.isIn(f, M.mind.assigned_role, list("Captain", "Chaplain"))) {
			return 0;
		}
		if (is_sacrifice_target(M.mind)) {
			return 0;
		}
		if (M.mind.enslaved_to && !iscultist(M.mind.enslaved_to)) {
			return 0;
		}
	} else {
		return 0;
	}
	if (M.isloyal() || rt.istype(M, T("/mob/living/silicon")) || rt.istype(M, T("/mob/living/simple_animal/bot")) || rt.istype(M, T("/mob/living/simple_animal/drone")) || is_servant_of_ratvar(M)) {
		return 0;
	}
	return 1;
});

rt.type(1088, "/datum/game_mode/cult", "/datum/game_mode", {
	finished: 0,
	acolytes_needed: 10,
	acolytes_survived: 0,
	cultists_to_cult: null,
	name: "cult",
	config_tag: "cult",
	antag_flag: "cultist",
	restricted_jobs: null,
	protected_jobs: null,
	required_players: 24,
	required_enemies: 4,
	recommended_enemies: 4,
	announce_span: "cult",
	announce_text: "Some crew members are trying to start a cult to Nar-Sie!\n<span class='cult'>Cultists</span>: Carry out Nar-Sie's will.\n<span class='notice'>Crew</span>: Prevent the cult from expanding and drive it out.",
});

// cult.dm:35
rt.def("/datum/game_mode/cult/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_jobs = list("Chaplain", "AI", "Cyborg", "Security Officer", "Warden", "Detective", "Head of Security", "Captain", "Head of Personnel");

	this.protected_jobs = list();

	this.cultists_to_cult = list();
	return f.dot;
});

// cult.dm:55
rt.def("/datum/game_mode/cult/proc/pre_setup", function pre_setup(f: Frame) {
	let cultists_number: Value = null, cultist: Value = null;
	let $e: any;
	this.cult_objectives += "sacrifice";
	if (GLOB.config.protect_roles_from_antagonist) {
		this.restricted_jobs += this.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		this.restricted_jobs += "Assistant";
	}
	this.recommended_enemies = 3 + round(this.num_players() / 15);
	rt.forRange(f, 0, 1, this.recommended_enemies, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		cultists_number = $e;
		if (!rt.len(f, this.antag_candidates)) {
			break;
		}
		this.antag_candidates -= (cultist = pick(this.antag_candidates));
		this.cultists_to_cult += cultist;
		cultist.special_role = "Cultist";
		cultist.restricted_roles = this.restricted_jobs;
		log_game(`${cultist.key} (ckey) has been selected as a cultist`);
	}
	rt.endFor(f, 0);
	return (rt.len(f, this.cultists_to_cult) >= this.required_enemies ? 1 : 0);
});

// cult.dm:81
rt.def("/datum/game_mode/cult/proc/post_setup", function* post_setup(f: Frame) {
	let possible_targets: Value = null, player: Value = null, sacjob: Value = null, sacface: Value = null, reshape: Value = null, summon: Value = null, cult_mind: Value = null;
	this.modePlayer += this.cultists_to_cult;
	if (rt.isIn(f, "sacrifice", this.cult_objectives)) {
		if (!rt.len(f, (possible_targets = this.get_unconvertables()))) {
			message_admins("Cult Sacrifice: Could not find unconvertable target, checking for convertable target.");
			for (player of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
				if (player.mind && !rt.isIn(f, player.mind, this.cultists_to_cult)) {
					possible_targets += player.mind;
				}
			}
		}
		if (rt.len(f, possible_targets) > 0) {
			GLOB.sac_mind = pick(possible_targets);
			if (!GLOB.sac_mind) {
				message_admins("Cult Sacrifice: ERROR -  Null target chosen!");
			} else {
				sacjob = (yield* GLOB.SSjob.GetJob(GLOB.sac_mind.assigned_role));
				sacface = GLOB.sac_mind.current.client.prefs;
				(reshape = (yield* get_flat_human_icon(null, sacjob, sacface))).Shift(2, 4);
				reshape.Shift(4, 1);
				reshape.Crop(7, 4, 26, 31);
				reshape.Crop(-5, -3, 26, 30);
				GLOB.sac_image = reshape;
			}
		} else {
			message_admins("Cult Sacrifice: Could not find unconvertable or convertable target. WELP!");
		}
	}
	if (!rt.len(f, GLOB.summon_spots)) {
		while (rt.len(f, GLOB.summon_spots) < SUMMON_POSSIBILITIES) {
			if ((summon = pick(GLOB.sortedAreas - GLOB.summon_spots)).z == ZLEVEL_STATION && summon.valid_territory) {
				GLOB.summon_spots += summon;
			}
		}
	}
	this.cult_objectives += "eldergod";
	for (cult_mind of each(this.cultists_to_cult, T("/datum/mind"))) {
		yield* this.equip_cultist(cult_mind.current);
		this.update_cult_icons_added(cult_mind);
		to_chat(cult_mind.current, "<span class='userdanger'>You are a member of the cult!</span>");
		yield* cult_mind.current.playsound_local(rt.getStep(f, cult_mind.current, 0), rt.rsc("sound/ambience/antag/bloodcult.ogg"), 100, 0, { pressure_affected: 0 });
		yield* this.add_cultist(cult_mind, 0);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// cult.dm:120
rt.def("/datum/game_mode/proc/equip_cultist", function* equip_cultist(f: Frame, mob: Value, tome: Value) {
	tome ??= 0;
	if (!rt.istype(mob, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (mob.mind) {
		if (mob.mind.assigned_role == "Clown") {
			to_chat(mob, "Your training has allowed you to overcome your clownish nature, allowing you to wield weapons without harming yourself.");
			yield* mob.dna.remove_mutation("Clumsiness");
		}
	}
	if (tome) {
		f.dot += (yield* this.cult_give_item(T("/obj/item/weapon/tome"), mob));
	} else {
		f.dot += (yield* this.cult_give_item(T("/obj/item/weapon/paper/talisman/supply"), mob));
	}
	to_chat(mob, "These will help you start the cult on this station. Use them well, and remember - you are not the only one.</span>");
	return f.dot;
}, true);

// cult.dm:134
rt.def("/datum/game_mode/proc/cult_give_item", function* cult_give_item(f: Frame, item_path: Value, mob: Value) {
	let where: Value = null, B: Value = null;
	let slots: Value = rt.alist(f, ["backpack", slot_in_backpack, "left pocket", slot_l_store, "right pocket", slot_r_store]);
	let _T: Value = (yield* new_(item_path, mob));
	let item_name: Value = rt.initial(f, item_path, "name");
	if (!(where = (yield* mob.equip_in_one_of_slots(_T, slots)))) {
		to_chat(mob, `<span class='userdanger'>Unfortunately, you weren't able to get a ${item_name}. This is very bad and you should adminhelp immediately (press F1).</span>`);
		return 0;
	} else {
		to_chat(mob, `<span class='danger'>You have a ${item_name} in your ${where}.`);
		if (where == "backpack") {
			yield* (B = mob.back).orient2hud(mob);
			yield* B.show_to(mob);
		}
		return 1;
	}
}, true);

// cult.dm:155
rt.def("/datum/game_mode/proc/add_cultist", function* add_cultist(f: Frame, cult_mind: Value, stun: Value) {
	if (!rt.istype(cult_mind, T("/datum/mind"))) {
		return 0;
	}
	if (!(yield* cult_mind.add_antag_datum(T("/datum/antagonist/cult")))) return f.dot;
	if (stun) {
		yield* cult_mind.current.Unconscious(100);
	}
	return 1;
}, true);

// cult.dm:163
rt.def("/datum/game_mode/proc/remove_cultist", function* remove_cultist(f: Frame, cult_mind: Value, silent: Value, stun: Value) {
	let cult_datum: Value = null;
	if (!cult_mind.current) return f.dot;
	if (!(cult_datum = cult_mind.has_antag_datum(T("/datum/antagonist/cult")))) {
		return 0;
	}
	cult_datum.silent = silent;
	yield* cult_datum.on_removal();
	if (stun) {
		yield* cult_mind.current.Unconscious(100);
	}
	return 1;
}, true);

// cult.dm:174
rt.def("/datum/game_mode/proc/update_cult_icons_added", function update_cult_icons_added(f: Frame, cult_mind: Value) {
	let culthud: Value = null;
	(culthud = rt.index(GLOB.huds, ANTAG_HUD_CULT)).join_hud(cult_mind.current);
	this.set_antag_hud(cult_mind.current, "cult");
	return f.dot;
});

// cult.dm:179
rt.def("/datum/game_mode/proc/update_cult_icons_removed", function update_cult_icons_removed(f: Frame, cult_mind: Value) {
	let culthud: Value = null;
	(culthud = rt.index(GLOB.huds, ANTAG_HUD_CULT)).leave_hud(cult_mind.current);
	this.set_antag_hud(cult_mind.current, null);
	return f.dot;
});

// cult.dm:184
rt.def("/datum/game_mode/cult/proc/get_unconvertables", function get_unconvertables(f: Frame) {
	let player: Value = null;
	let ucs: Value = list();
	for (player of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
		if (player.mind && !is_convertable_to_cult(player) && !rt.isIn(f, player.mind, this.cultists_to_cult)) {
			ucs += player.mind;
		}
	}
	return ucs;
});

// cult.dm:192
rt.def("/datum/game_mode/cult/proc/check_cult_victory", function check_cult_victory(f: Frame) {
	let cult_fail: Value = 0;
	if (this.cult_objectives.Find("survive")) {
		cult_fail += this.check_survive();
	}
	if (this.cult_objectives.Find("eldergod")) {
		cult_fail += this.eldergod;
	}
	if (this.cult_objectives.Find("sacrifice")) {
		if (GLOB.sac_mind && !GLOB.sac_complete) {
			cult_fail++;
		}
	}
	return cult_fail;
});

// cult.dm:204
rt.def("/datum/game_mode/cult/proc/check_survive", function check_survive(f: Frame) {
	let cult_mind: Value = null;
	let acolytes_survived: Value = 0;
	for (cult_mind of each(this.cult, T("/datum/mind"))) {
		if (cult_mind.current && cult_mind.current.stat != 2) {
			if (cult_mind.current.onCentcom() || cult_mind.current.onSyndieBase()) {
				acolytes_survived++;
			}
		}
	}
	if (acolytes_survived >= this.acolytes_needed) {
		return 0;
	} else {
		return 1;
	}
});

// cult.dm:216
rt.def("/datum/game_mode/cult/proc/declare_completion", function declare_completion(f: Frame) {
	let obj_count: Value = null, explanation: Value = null;
	if (!this.check_cult_victory()) {
		GLOB.SSticker.mode_result = "win - cult win";
		to_chat(rt.world(), "<span class='greentext'>The cult has succeeded! Nar-sie has snuffed out another torch in the void!</span>");
	} else {
		GLOB.SSticker.mode_result = "loss - staff stopped the cult";
		to_chat(rt.world(), "<span class='redtext'>The staff managed to stop the cult! Dark words and heresy are no match for Nanotrasen's finest!</span>");
	}
	let text: Value = "";
	if (rt.len(f, this.cult_objectives)) {
		text += "<br><b>The cultists' objectives were:</b>";
		obj_count = 1;
		while (obj_count <= rt.len(f, this.cult_objectives)) {
			explanation = null;
			const item = rt.index(this.cult_objectives, obj_count);
			if (item === "survive") {
				if (!this.check_survive()) {
					explanation = `Make sure at least ${this.acolytes_needed} acolytes escape on the shuttle. (${this.acolytes_survived} escaped) <span class='greenannounce'>Success!</span>`;
					GLOB.SSticker.news_report = CULT_ESCAPE;
				} else {
					explanation = `Make sure at least ${this.acolytes_needed} acolytes escape on the shuttle. (${this.acolytes_survived} escaped) <span class='boldannounce'>Fail.</span>`;
					GLOB.SSticker.news_report = CULT_FAILURE;
				}
			} else if (item === "sacrifice") {
				if (GLOB.sac_complete) {
					explanation = `Sacrifice ${GLOB.sac_mind}, the ${GLOB.sac_mind.assigned_role}. <span class='greenannounce'>Success!</span>`;
				} else {
					explanation = `Sacrifice ${GLOB.sac_mind}, the ${GLOB.sac_mind.assigned_role}. <span class='boldannounce'>Fail.</span>`;
				}
			} else if (item === "eldergod") {
				if (!this.eldergod) {
					explanation = `Summon Nar-Sie. The summoning can only be accomplished in ${english_list(GLOB.summon_spots)}.<span class='greenannounce'>Success!</span>`;
					GLOB.SSticker.news_report = CULT_SUMMON;
				} else {
					explanation = `Summon Nar-Sie. The summoning can only be accomplished in ${english_list(GLOB.summon_spots)}<span class='boldannounce'>Fail.</span>`;
					GLOB.SSticker.news_report = CULT_FAILURE;
				}
			}
			text += `<br><B>Objective #${obj_count}</B>: ${explanation}`;
			obj_count++;
		}
	}
	to_chat(rt.world(), text);
	parent_proc();
	return 1;
});

// cult.dm:263
rt.def("/datum/game_mode/proc/datum_cult_completion", function datum_cult_completion(f: Frame) {
	let obj_count: Value = null, explanation: Value = null;
	let $e: any;
	let text: Value = "";
	let cult_fail: Value = 0;
	cult_fail += this.eldergod;
	if (!GLOB.sac_complete) {
		cult_fail++;
	}
	if (!cult_fail) {
		GLOB.SSticker.mode_result = "win - cult win";
		to_chat(rt.world(), "<span class='greentext'>The cult has succeeded! Nar-sie has snuffed out another torch in the void!</span>");
	} else {
		GLOB.SSticker.mode_result = "loss - staff stopped the cult";
		to_chat(rt.world(), "<span class='redtext'>The staff managed to stop the cult! Dark words and heresy are no match for Nanotrasen's finest!</span>");
	}
	if (rt.len(f, this.cult_objectives)) {
		text += "<br><b>The cultists' objectives were:</b>";
		rt.forRange(f, 0, 1, 2, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			obj_count = $e;
			explanation = null;
			const item = rt.index(this.cult_objectives, obj_count);
			if (item === "sacrifice") {
				if (GLOB.sac_mind) {
					if (GLOB.sac_complete) {
						explanation = `Sacrifice ${GLOB.sac_mind}, the ${GLOB.sac_mind.assigned_role}. <span class='greenannounce'>Success!</span>`;
					} else {
						explanation = `Sacrifice ${GLOB.sac_mind}, the ${GLOB.sac_mind.assigned_role}. <span class='boldannounce'>Fail.</span>`;
					}
				}
			} else if (item === "eldergod") {
				if (!this.eldergod) {
					explanation = "Summon Nar-Sie. <span class='greenannounce'>Success!</span>";
					GLOB.SSticker.news_report = CULT_SUMMON;
				} else {
					explanation = "Summon Nar-Sie. <span class='boldannounce'>Fail.</span>";
					GLOB.SSticker.news_report = CULT_FAILURE;
				}
			}
			text += `<br><B>Objective #${obj_count}</B>: ${explanation}`;
		}
		rt.endFor(f, 0);
	}
	to_chat(rt.world(), text);
	return f.dot;
});
