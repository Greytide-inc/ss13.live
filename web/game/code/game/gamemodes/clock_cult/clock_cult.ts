// Based on /tg/station's code/game/gamemodes/clock_cult/clock_cult.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// clock_cult.dm:49
rt.def("/proc/is_servant_of_ratvar", function is_servant_of_ratvar(f: Frame, M: Value) {
	return (((rt.istype(M, T("/mob/living")) ? 1 : 0) && M.mind) && M.mind.has_antag_datum(T("/datum/antagonist/clockcult")));
});

// clock_cult.dm:52
rt.def("/proc/is_eligible_servant", function is_eligible_servant(f: Frame, M: Value) {
	if (!rt.istype(M, T("/mob/living"))) {
		return 0;
	}
	if (M.mind) {
		if (rt.istype(M, T("/mob/living/carbon/human")) && rt.isIn(f, M.mind.assigned_role, list("Captain", "Chaplain"))) {
			return 0;
		}
		if (M.mind.enslaved_to && !is_servant_of_ratvar(M.mind.enslaved_to)) {
			return 0;
		}
	} else {
		return 0;
	}
	if (iscultist(M) || rt.istype(M, T("/mob/living/simple_animal/hostile/construct")) || M.isloyal() || rt.istype(M, T("/mob/living/silicon/pai"))) {
		return 0;
	}
	if (rt.istype(M, T("/mob/living/carbon/human")) || rt.istype(M, T("/mob/living/brain")) || rt.istype(M, T("/mob/living/simple_animal/hostile/guardian")) || rt.istype(M, T("/mob/living/silicon")) || rt.istype(M, T("/mob/living/simple_animal/hostile/clockwork")) || rt.istype(M, T("/mob/living/simple_animal/drone/cogscarab"))) {
		return 1;
	}
	return 0;
});

// clock_cult.dm:68
rt.def("/proc/add_servant_of_ratvar", function* add_servant_of_ratvar(f: Frame, L: Value, silent: Value) {
	silent ??= 0;
	if (!L || !L.mind) {
		return f.dot;
	}
	let update_type: Value = T("/datum/antagonist/clockcult");
	if (silent) {
		update_type = T("/datum/antagonist/clockcult/silent");
	}
	f.dot = (yield* L.mind.add_antag_datum(update_type));
	return f.dot;
}, true);

// clock_cult.dm:76
rt.def("/proc/remove_servant_of_ratvar", function* remove_servant_of_ratvar(f: Frame, L: Value, silent: Value) {
	let clock_datum: Value = null;
	silent ??= 0;
	if (!L || !L.mind) {
		return f.dot;
	}
	if (!(clock_datum = L.mind.has_antag_datum(T("/datum/antagonist/clockcult")))) {
		return 0;
	}
	clock_datum.silent = silent;
	yield* clock_datum.on_removal();
	return 1;
}, true);

rt.type(1087, "/datum/game_mode/clockwork_cult", "/datum/game_mode", {
	servants_to_serve: null,
	roundstart_player_count: null,
	name: "clockwork cult",
	config_tag: "clockwork_cult",
	antag_flag: "servant of Ratvar",
	required_players: 24,
	required_enemies: 3,
	recommended_enemies: 3,
	protected_jobs: null,
	restricted_jobs: null,
	announce_span: "brass",
	announce_text: "Servants of Ratvar are trying to summon the Justiciar!\n<span class='brass'>Servants</span>: Take over the station and summon Ratvar.\n<span class='notice'>Crew</span>: Stop the servants before they can summon the Clockwork Justiciar.",
});

// clock_cult.dm:107
rt.def("/datum/game_mode/clockwork_cult/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.protected_jobs = list("AI", "Cyborg", "Security Officer", "Warden", "Detective", "Head of Security", "Captain");
	this.restricted_jobs = list("Chaplain", "Captain");

	this.servants_to_serve = list();
	return f.dot;
});

// clock_cult.dm:111
rt.def("/datum/game_mode/clockwork_cult/proc/pre_setup", function pre_setup(f: Frame) {
	let number_players: Value = null, servant: Value = null;
	if (GLOB.config.protect_roles_from_antagonist) {
		this.restricted_jobs += this.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		this.restricted_jobs += "Assistant";
	}
	let starter_servants: Value = 3;
	this.roundstart_player_count = (number_players = this.num_players());
	if (number_players > 30) {
		number_players -= 30;
		starter_servants += round(number_players / 15);
	}
	while (starter_servants) {
		this.servants_to_serve += (servant = pick(this.antag_candidates));
		this.antag_candidates -= servant;
		this.modePlayer += servant;
		servant.special_role = "Servant of Ratvar";
		servant.restricted_roles = this.restricted_jobs;
		starter_servants--;
	}
	return 1;
});

// clock_cult.dm:132
rt.def("/datum/game_mode/clockwork_cult/proc/post_setup", function* post_setup(f: Frame) {
	let S: Value = null, servant: Value = null, L: Value = null;
	for (S of each(this.servants_to_serve)) {
		log_game(`${(servant = S).key} was made an initial servant of Ratvar`);
		this.greet_servant((L = servant.current));
		yield* this.equip_servant(L);
		yield* add_servant_of_ratvar(L, 1);
	}
	yield* parent_proc();
	return 1;
}, true);

// clock_cult.dm:143
rt.def("/datum/game_mode/clockwork_cult/proc/greet_servant", function greet_servant(f: Frame, M: Value) {
	if (!M) {
		return 0;
	}
	let greeting_text: Value = "<br><b><span class='large_brass'>You are a servant of Ratvar, the Clockwork Justiciar.</span>\nRusting eternally in the Celestial Derelict, Ratvar has formed a covenant of mortals, with you as one of its members. As one of the Justiciar's servants, you are to work to the best of your ability to assist in completion of His agenda. You may not know the specifics of how to do so, but luckily you have a vessel to help you learn.</b>";
	to_chat(M, greeting_text);
	M.playsound_local(rt.getStep(f, M, 0), rt.rsc("sound/ambience/antag/clockcultalr.ogg"), 100, 0, { pressure_affected: 0 });
	return 1;
});

// clock_cult.dm:153
rt.def("/datum/game_mode/proc/equip_servant", function* equip_servant(f: Frame, L: Value) {
	let H: Value = null;
	if (!L || !rt.istype(L, T("/mob/living"))) {
		return 0;
	}
	let S: Value = (yield* new_(T("/obj/item/clockwork/slab/starter"), null));
	let slot: Value = "At your feet";
	let slots: Value = rt.alist(f, ["In your left pocket", slot_l_store, "In your right pocket", slot_r_store, "In your backpack", slot_in_backpack, "On your belt", slot_belt]);
	if (rt.istype(L, T("/mob/living/carbon/human"))) {
		if ((slot = (yield* (H = L).equip_in_one_of_slots(S, slots))) == "In your backpack") {
			slot = `In your ${H.back.name}`;
		}
	}
	if (slot == "At your feet") {
		if (!(yield* S.forceMove(rt.getStep(f, L, 0)))) {
			yield* qdel(S);
		}
	}
	if (S && !(!S || S.gc_destroyed)) {
		to_chat(L, `<b>${slot} is a link to the halls of Reebe and your master. You may use it to perform many tasks, but also become oriented with the workings of Ratvar and how to best complete your tasks. This clockwork slab will be instrumental in your triumph. Remember: you can speak discreetly with your fellow servants by using the <span class='brass'>Hierophant Network</span> action button, and you can find a concise tutorial by using the slab in-hand and selecting Recollection.</b>`);
		to_chat(L, "<i>Alternatively, check out the wiki page at </i><b>https://tgstation13.org/wiki/Clockwork_Cult</b><i>, which contains additional information.</i>");
		return 1;
	}
	return 0;
}, true);

// clock_cult.dm:176
rt.def("/datum/game_mode/clockwork_cult/proc/check_clockwork_victory", function check_clockwork_victory(f: Frame) {
	if (GLOB.clockwork_gateway_activated) {
		GLOB.SSticker.news_report = CLOCK_PROSELYTIZATION;
		if (GLOB.ratvar_awakens) {
			GLOB.SSticker.news_report = CLOCK_SUMMON;
			return 1;
		}
	} else {
		GLOB.SSticker.news_report = 12;
	}
	return 0;
});

// clock_cult.dm:185
rt.def("/datum/game_mode/clockwork_cult/proc/declare_completion", function declare_completion(f: Frame) {
	parent_proc();
	return 0;
});

// clock_cult.dm:189
rt.def("/datum/game_mode/proc/auto_declare_completion_clockwork_cult", function auto_declare_completion_clockwork_cult(f: Frame) {
	let C: Value = null, half_victory: Value = null, G: Value = null, i: Value = null, M: Value = null;
	let $e: any;
	let text: Value = "";
	if (rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/clockwork_cult"))) {
		if ((C = GLOB.SSticker.mode).check_clockwork_victory()) {
			text += "<span class='large_brass'><b>Ratvar's servants have succeeded in fulfilling His goals!</b></span>";
			GLOB.SSticker.mode_result = "win - servants completed their objective (summon ratvar)";
		} else {
			half_victory = 0;
			if (G = rt.locateIn(f, T("/obj/structure/destructible/clockwork/massive/celestial_gateway"), GLOB.all_clockwork_objects)) {
				half_victory = 1;
			}
			if (half_victory) {
				text += "<span class='large_brass'><b>The crew escaped before Ratvar could rise, but the gateway was successfully constructed!</b></span>";
				GLOB.SSticker.mode_result = "halfwin - servants constructed the gateway but their objective was not completed (summon ratvar)";
			} else {
				text += "<span class='userdanger'>Ratvar's servants have failed!</span>";
				GLOB.SSticker.mode_result = "loss - servants failed their objective (summon ratvar)";
			}
		}
		text += `<br><b>The servants' objective was:</b> <br>${"Construct the Ark of the Clockwork Justicar and free Ratvar."}`;
		text += `<br>Ratvar's servants had <b>${GLOB.clockwork_caches}</b> Tinkerer's Caches.`;
		text += `<br><b>Construction Value(CV)</b> was: <b>${GLOB.clockwork_construction_value}</b>`;
		for (i of each(GLOB.SSticker.scripture_states)) {
			if (i != "Driver") {
				text += `<br><b>${i} scripture</b> was: <b>${rt.index(GLOB.SSticker.scripture_states, i) ? "UN" : ""}LOCKED</b>`;
			}
		}
	}
	if (rt.len(f, this.servants_of_ratvar)) {
		text += "<br><b>Ratvar's servants were:</b>";
		for (M of each(this.servants_of_ratvar, T("/datum/mind"))) {
			text += this.printplayer(M);
		}
	}
	to_chat(rt.world(), text);
	return f.dot;
});

// clock_cult.dm:220
rt.def("/datum/game_mode/proc/update_servant_icons_added", function update_servant_icons_added(f: Frame, M: Value) {
	let A: Value = null;
	(A = rt.index(GLOB.huds, ANTAG_HUD_CLOCKWORK)).join_hud(M.current);
	this.set_antag_hud(M.current, "clockwork");
	return f.dot;
});

// clock_cult.dm:225
rt.def("/datum/game_mode/proc/update_servant_icons_removed", function update_servant_icons_removed(f: Frame, M: Value) {
	let A: Value = null;
	(A = rt.index(GLOB.huds, ANTAG_HUD_CLOCKWORK)).leave_hud(M.current);
	this.set_antag_hud(M.current, null);
	return f.dot;
});
