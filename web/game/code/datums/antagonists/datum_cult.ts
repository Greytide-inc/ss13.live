// Based on /tg/station's code/datums/antagonists/datum_cult.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(898, "/datum/antagonist/cult", "/datum/antagonist", {
	communion: null,
	vote: null,
});

// datum_cult.dm:4
rt.def("/datum/antagonist/cult/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.communion = (yield* new_(T("/datum/action/innate/cult/comm")));

	this.vote = (yield* new_(T("/datum/action/innate/cult/mastervote")));
	return f.dot;
}, true);

// datum_cult.dm:8
rt.def("/datum/antagonist/cult/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.communion);
	this.communion = null;
	yield* qdel(this.vote);
	this.vote = null;
	return (yield* parent_proc());
}, true);

// datum_cult.dm:13
rt.def("/datum/antagonist/cult/proc/add_objectives", function* add_objectives(f: Frame) {
	let player: Value = null, sacjob: Value = null, sacface: Value = null, reshape: Value = null, summon: Value = null;
	let target_candidates: Value = list();
	for (player of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
		if (player.mind && !player.mind.has_antag_datum(T("/datum/antagonist/cult")) && !is_convertable_to_cult(player) && player != this.owner && player.stat != 2) {
			target_candidates += player.mind;
		}
	}
	if (rt.len(f, target_candidates) == 0) {
		message_admins("Cult Sacrifice: Could not find unconvertable target, checking for convertable target.");
		player = null;
		for (player of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
			if (player.mind && !player.mind.has_antag_datum(T("/datum/antagonist/cult")) && player != this.owner && player.stat != 2) {
				target_candidates += player.mind;
			}
		}
	}
	listclearnulls(target_candidates);
	if (rt.length(target_candidates)) {
		GLOB.sac_mind = pick(target_candidates);
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
		GLOB.sac_complete = 1;
	}
	GLOB.SSticker.mode.cult_objectives += "sacrifice";
	if (!rt.len(f, GLOB.summon_spots)) {
		while (rt.len(f, GLOB.summon_spots) < SUMMON_POSSIBILITIES) {
			if ((summon = pick(GLOB.sortedAreas - GLOB.summon_spots)) && summon.z == ZLEVEL_STATION && summon.valid_territory) {
				GLOB.summon_spots += summon;
			}
		}
	}
	GLOB.SSticker.mode.cult_objectives += "eldergod";
	return f.dot;
}, true);

// datum_cult.dm:49
rt.def("/datum/antagonist/cult/proc/cult_memorization", function cult_memorization(f: Frame, cult_mind: Value) {
	let explanation: Value = null;
	let current: Value = cult_mind.current;
	let obj_count: Value = 1;
	while (obj_count <= rt.len(f, GLOB.SSticker.mode.cult_objectives)) {
		explanation = null;
		const item = rt.index(GLOB.SSticker.mode.cult_objectives, obj_count);
		if (item === "sacrifice") {
			if (GLOB.sac_mind) {
				explanation = `Sacrifice ${GLOB.sac_mind}, the ${GLOB.sac_mind.assigned_role} via invoking a Sacrifice rune with them on it and three acolytes around it.`;
			} else {
				explanation = "The veil has already been weakened here, proceed to the final objective.";
				GLOB.sac_complete = 1;
			}
		} else if (item === "eldergod") {
			explanation = `Summon Nar-Sie by invoking the rune 'Summon Nar-Sie'. <b>The summoning can only be accomplished in ${english_list(GLOB.summon_spots)} - where the veil is weak enough for the ritual to begin.</b>`;
		}
		if (!this.silent) {
			to_chat(current, `<B>Objective #${obj_count}</B>: ${explanation}`);
		}
		cult_mind.memory += `<B>Objective #${obj_count}</B>: ${explanation}<BR>`;
		obj_count++;
	}
	return f.dot;
});

// datum_cult.dm:65
rt.def("/datum/antagonist/cult/proc/can_be_owned", function can_be_owned(f: Frame, new_owner: Value) {
	f.dot = parent_proc();
	if (!f.dot) return f.dot;
	f.dot = is_convertable_to_cult(new_owner.current);
	return f.dot;
}, false);

// datum_cult.dm:70
rt.def("/datum/antagonist/cult/proc/on_gain", function* on_gain(f: Frame) {
	f.dot = (yield* parent_proc());
	let current: Value = this.owner.current;
	if (!rt.length(GLOB.SSticker.mode.cult_objectives)) {
		yield* this.add_objectives();
	}
	GLOB.SSticker.mode.cult += this.owner;
	this.cult_memorization(this.owner);
	if (jobban_isbanned(current, "cultist")) {
		yield* addtimer((yield* new_(T("/datum/callback"), GLOB.SSticker.mode, P("/datum/game_mode/proc/replace_jobbaned_player"), current, "cultist", "cultist")), 0);
	}
	GLOB.SSticker.mode.update_cult_icons_added(this.owner);
	current.log_message("<font color=#960000>Has been converted to the cult of Nar'Sie!</font>", "Attack log");
	if (!(GLOB.blood_target && GLOB.blood_target_image && current.client)) return f.dot;
	current.client.images += GLOB.blood_target_image;
	return f.dot;
}, true);

// datum_cult.dm:84
rt.def("/datum/antagonist/cult/proc/apply_innate_effects", function* apply_innate_effects(f: Frame, mob_override: Value) {
	f.dot = (yield* parent_proc());
	let current: Value = this.owner.current;
	if (mob_override) {
		current = mob_override;
	}
	(rt.modField(f, current, "faction", "cult", rt.bitOr));
	yield* current.grant_language(T("/datum/language/narsie"));
	current.verbs += P("/mob/living/proc/cult_help");
	if (!GLOB.cult_mastered) {
		yield* this.vote.Grant(current);
	}
	yield* this.communion.Grant(current);
	yield* current.throw_alert("bloodsense", T("/obj/screen/alert/bloodsense"));
	return f.dot;
}, true);

// datum_cult.dm:97
rt.def("/datum/antagonist/cult/proc/remove_innate_effects", function* remove_innate_effects(f: Frame, mob_override: Value) {
	f.dot = (yield* parent_proc());
	let current: Value = this.owner.current;
	if (mob_override) {
		current = mob_override;
	}
	current.faction -= "cult";
	yield* current.remove_language(T("/datum/language/narsie"));
	current.verbs -= P("/mob/living/proc/cult_help");
	yield* this.vote.Remove(current);
	yield* this.communion.Remove(current);
	yield* current.clear_alert("bloodsense");
	return f.dot;
}, true);

// datum_cult.dm:109
rt.def("/datum/antagonist/cult/proc/on_removal", function* on_removal(f: Frame) {
	this.owner.wipe_memory();
	GLOB.SSticker.mode.cult -= this.owner;
	GLOB.SSticker.mode.update_cult_icons_removed(this.owner);
	if (!this.silent) {
		to_chat(this.owner.current, "<span class='userdanger'>An unfamiliar white light flashes through your mind, cleansing the taint of the Geometer and all your memories as her servant.</span>");
		this.owner.current.log_message("<font color=#960000>Has renounced the cult of Nar'Sie!</font>", "Attack log");
		this.owner.current.visible_message(`<span class='big'>${this.owner.current} looks like ${this.owner.current.p_they()} just reverted to their old faith!</span>`);
	}
	if (GLOB.blood_target && GLOB.blood_target_image && this.owner.current.client) {
		this.owner.current.client.images -= GLOB.blood_target_image;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(899, "/datum/antagonist/cult/master", "/datum/antagonist/cult", {
	reckoning: null,
	bloodmark: null,
	throwing: null,
});

// datum_cult.dm:121
rt.def("/datum/antagonist/cult/master/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.reckoning = (yield* new_(T("/datum/action/innate/cult/master/finalreck")));

	this.bloodmark = (yield* new_(T("/datum/action/innate/cult/master/cultmark")));

	this.throwing = (yield* new_(T("/datum/action/innate/cult/master/pulse")));
	return f.dot;
}, true);

// datum_cult.dm:126
rt.def("/datum/antagonist/cult/master/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.reckoning);
	this.reckoning = null;
	yield* qdel(this.bloodmark);
	this.bloodmark = null;
	yield* qdel(this.throwing);
	this.throwing = null;
	return (yield* parent_proc());
}, true);

// datum_cult.dm:132
rt.def("/datum/antagonist/cult/master/proc/on_gain", function* on_gain(f: Frame) {
	f.dot = (yield* parent_proc());
	let current: Value = this.owner.current;
	GLOB.SSticker.mode.set_antag_hud(current, "cultmaster");
	return f.dot;
}, true);

// datum_cult.dm:137
rt.def("/datum/antagonist/cult/master/proc/greet", function greet(f: Frame) {
	to_chat(this.owner.current, "<span class='cultlarge'>You are the cult's Master</span>. As the cult's Master, you have a unique title and loud voice when communicating, are capable of marking targets, such as a location or a noncultist, to direct the cult to them, and, finally, you are capable of summoning the entire living cult to your location <b><i>once</i></b>.");
	to_chat(this.owner.current, "Use these abilities to direct the cult to victory at any cost.");
	return f.dot;
});

// datum_cult.dm:142
rt.def("/datum/antagonist/cult/master/proc/apply_innate_effects", function* apply_innate_effects(f: Frame, mob_override: Value) {
	f.dot = (yield* parent_proc());
	let current: Value = this.owner.current;
	if (mob_override) {
		current = mob_override;
	}
	if (!GLOB.reckoning_complete) {
		yield* this.reckoning.Grant(current);
	}
	yield* this.bloodmark.Grant(current);
	yield* this.throwing.Grant(current);
	yield* current.update_action_buttons_icon();
	yield* current.apply_status_effect(T("/datum/status_effect/cult_master"));
	return f.dot;
}, true);

// datum_cult.dm:154
rt.def("/datum/antagonist/cult/master/proc/remove_innate_effects", function* remove_innate_effects(f: Frame, mob_override: Value) {
	f.dot = (yield* parent_proc());
	let current: Value = this.owner.current;
	if (mob_override) {
		current = mob_override;
	}
	yield* this.reckoning.Remove(current);
	yield* this.bloodmark.Remove(current);
	yield* this.throwing.Remove(current);
	yield* current.update_action_buttons_icon();
	yield* current.remove_status_effect(T("/datum/status_effect/cult_master"));
	return f.dot;
}, true);
