// From code/game/gamemodes/clock_cult/clock_cult.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/is_servant_of_ratvar  (code/game/gamemodes/clock_cult/clock_cult.dm:49)
rt.def("/proc/is_servant_of_ratvar", function is_servant_of_ratvar(f: Frame, M: Value) {
	return (((rt.istype(live(M), T("/mob/living")) ? 1 : 0) && rt.fv(f, "mind", live(M))) && rt.callName(f, rt.fv(f, "mind", live(M)), "has_antag_datum", [T("/datum/antagonist/clockcult")]));
});

// /proc/is_eligible_servant  (code/game/gamemodes/clock_cult/clock_cult.dm:52)
rt.def("/proc/is_eligible_servant", function is_eligible_servant(f: Frame, M: Value) {
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.fv(f, "mind", live(M)))) {
		if ((truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((rt.isIn(f, rt.gv(f, "assigned_role", rt.fv(f, "mind", live(M))), rt.list("Captain", "Chaplain")) ? 1 : 0)))) {
			return 0;
		}
		if ((truthy(rt.gv(f, "enslaved_to", rt.fv(f, "mind", live(M)))) && !truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.gv(f, "enslaved_to", rt.fv(f, "mind", live(M)))])))) {
			return 0;
		}
	} else {
		return 0;
	}
	if ((((truthy(rt.call(f, P("/proc/iscultist"), null, [live(M)])) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/construct")) ? 1 : 0))) || truthy(rt.callName(f, live(M), "isloyal", []))) || truthy((rt.istype(live(M), T("/mob/living/silicon/pai")) ? 1 : 0)))) {
		return 0;
	}
	if ((((((truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/brain")) ? 1 : 0))) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/guardian")) ? 1 : 0))) || truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/clockwork")) ? 1 : 0))) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/drone/cogscarab")) ? 1 : 0)))) {
		return 1;
	}
	return 0;
});

// /proc/add_servant_of_ratvar  (code/game/gamemodes/clock_cult/clock_cult.dm:68)  may sleep
rt.def("/proc/add_servant_of_ratvar", function* add_servant_of_ratvar(f: Frame, L: Value, silent: Value) {
	let update_type: Value = null;
	f.vars = () => [L, silent, update_type];
	if (live(silent) === null) {
		silent = 0;
	}
	if ((!truthy(live(L)) || !truthy(rt.fv(f, "mind", live(L))))) {
		return live(f.dot);
	}
	update_type = T("/datum/antagonist/clockcult");
	if (truthy(live(silent))) {
		update_type = T("/datum/antagonist/clockcult/silent");
	}
	f.dot = (yield* g.callName(f, rt.fv(f, "mind", live(L)), "add_antag_datum", [live(update_type)]));
	return f.dot;
}, true);

// /proc/remove_servant_of_ratvar  (code/game/gamemodes/clock_cult/clock_cult.dm:76)  may sleep
rt.def("/proc/remove_servant_of_ratvar", function* remove_servant_of_ratvar(f: Frame, L: Value, silent: Value) {
	let clock_datum: Value = null;
	f.vars = () => [L, silent, clock_datum];
	if (live(silent) === null) {
		silent = 0;
	}
	if ((!truthy(live(L)) || !truthy(rt.fv(f, "mind", live(L))))) {
		return live(f.dot);
	}
	if (!truthy((clock_datum = (yield* g.callName(f, rt.fv(f, "mind", live(L)), "has_antag_datum", [T("/datum/antagonist/clockcult")]))))) {
		return 0;
	}
	rt.setFv(f, "silent", live(clock_datum), live(silent));
	yield* g.callName(f, live(clock_datum), "on_removal", []);
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

// /datum/game_mode/clockwork_cult/proc/<init>  (code/game/gamemodes/clock_cult/clock_cult.dm:107)
rt.def("/datum/game_mode/clockwork_cult/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "protected_jobs", rt.list("AI", "Cyborg", "Security Officer", "Warden", "Detective", "Head of Security", "Captain"));
	rt.setSv(f, "restricted_jobs", rt.list("Chaplain", "Captain"));
	$0 = $0;
	rt.setSv(f, "servants_to_serve", rt.list());
	return f.dot;
});

// /datum/game_mode/clockwork_cult/proc/pre_setup  (code/game/gamemodes/clock_cult/clock_cult.dm:111)
rt.def("/datum/game_mode/clockwork_cult/proc/pre_setup", function pre_setup(f: Frame) {
	let starter_servants: Value = null, number_players: Value = null, servant: Value = null;
	f.vars = () => [starter_servants, number_players, servant];
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", rt.sv(f, "protected_jobs"), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", "Assistant", add);
	}
	starter_servants = 3;
	rt.setSv(f, "roundstart_player_count", (number_players = rt.callSrc(f, "num_players", [])));
	if (rt.gt(live(number_players), 30)) {
		(number_players = rt.modify(live(number_players), 30, subtract));
		starter_servants = rt.modify(live(starter_servants), rt.call(f, P("/proc/round"), null, [divide(live(number_players), 15)]), add);
	}
	while (truthy(live(starter_servants))) {
		rt.modSrcVar(f, "servants_to_serve", (servant = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), add);
		(rt.modSrcVar(f, "antag_candidates", live(servant), subtract));
		rt.modSrcVar(f, "modePlayer", live(servant), add);
		rt.setFv(f, "special_role", live(servant), "Servant of Ratvar");
		rt.setFv(f, "restricted_roles", live(servant), rt.sv(f, "restricted_jobs"));
		starter_servants = rt.inc(live(starter_servants), -1);
	}
	return 1;
});

// /datum/game_mode/clockwork_cult/proc/post_setup  (code/game/gamemodes/clock_cult/clock_cult.dm:132)  may sleep
rt.def("/datum/game_mode/clockwork_cult/proc/post_setup", function* post_setup(f: Frame) {
	let S: Value = null, servant: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [S, servant, L, $e];
	S = null;
	rt.forList(f, 0, rt.sv(f, "servants_to_serve"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was made an initial servant of Ratvar", [rt.gv(f, "key", (servant = live(S)))])]);
		yield* g.srcCall(f, "greet_servant", (L = rt.fv(f, "current", live(servant))));
		yield* g.srcCall(f, "equip_servant", live(L));
		yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [live(L), 1]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return 1;
}, true);

// /datum/game_mode/clockwork_cult/proc/greet_servant  (code/game/gamemodes/clock_cult/clock_cult.dm:143)
rt.def("/datum/game_mode/clockwork_cult/proc/greet_servant", function greet_servant(f: Frame, M: Value) {
	let greeting_text: Value = null;
	f.vars = () => [greeting_text];
	if (!truthy(live(M))) {
		return 0;
	}
	greeting_text = "<br><b><span class='large_brass'>You are a servant of Ratvar, the Clockwork Justiciar.</span>\nRusting eternally in the Celestial Derelict, Ratvar has formed a covenant of mortals, with you as one of its members. As one of the Justiciar's servants, you are to work to the best of your ability to assist in completion of His agenda. You may not know the specifics of how to do so, but luckily you have a vessel to help you learn.</b>";
	rt.call(f, P("/proc/to_chat"), null, [live(M), live(greeting_text)]);
	rt.callName(f, live(M), "playsound_local", [null, rt.getStep(f, live(M), 0), null, rt.rsc("sound/ambience/antag/clockcultalr.ogg"), null, 100, null, 0, "pressure_affected", 0], rt.Args.Named);
	return 1;
});

// /datum/game_mode/proc/equip_servant  (code/game/gamemodes/clock_cult/clock_cult.dm:153)  may sleep
rt.def("/datum/game_mode/proc/equip_servant", function* equip_servant(f: Frame, L: Value) {
	let S: Value = null, slot: Value = null, slots: Value = null, H: Value = null;
	f.vars = () => [L, S, slot, slots, H];
	if ((!truthy(live(L)) || !truthy((rt.istype(live(L), T("/mob/living")) ? 1 : 0)))) {
		return 0;
	}
	S = (yield* g.new_(f, T("/obj/item/clockwork/slab/starter"), [null]));
	slot = "At your feet";
	slots = rt.alist(f, ["In your left pocket", 15, "In your right pocket", 16, "In your backpack", 18, "On your belt", 5]);
	if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (isEqual((slot = (yield* g.callName(f, (H = live(L)), "equip_in_one_of_slots", [live(S), live(slots)]))), "In your backpack")) {
			slot = fmt("In your ＀", [rt.gv(f, "name", rt.fv(f, "back", live(H)))]);
		}
	}
	if (isEqual(live(slot), "At your feet")) {
		if (!truthy((yield* g.callName(f, live(S), "forceMove", [rt.getStep(f, live(L), 0)])))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		}
	}
	if ((truthy(live(S)) && !(!truthy(live(S)) || truthy(rt.fv(f, "gc_destroyed", live(S)))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<b>＀ is a link to the halls of Reebe and your master. You may use it to perform many tasks, but also become oriented with the workings of Ratvar and how to best complete your tasks. This clockwork slab will be instrumental in your triumph. Remember: you can speak discreetly with your fellow servants by using the <span class='brass'>Hierophant Network</span> action button, and you can find a concise tutorial by using the slab in-hand and selecting Recollection.</b>", [live(slot)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<i>Alternatively, check out the wiki page at </i><b>https://tgstation13.org/wiki/Clockwork_Cult</b><i>, which contains additional information.</i>"]);
		return 1;
	}
	return 0;
}, true);

// /datum/game_mode/clockwork_cult/proc/check_clockwork_victory  (code/game/gamemodes/clock_cult/clock_cult.dm:176)
rt.def("/datum/game_mode/clockwork_cult/proc/check_clockwork_victory", function check_clockwork_victory(f: Frame) {
	if (truthy(rt.gl("clockwork_gateway_activated"))) {
		rt.setFv(f, "news_report", rt.gl("SSticker"), 23);
		if (truthy(rt.gl("ratvar_awakens"))) {
			rt.setFv(f, "news_report", rt.gl("SSticker"), 21);
			return 1;
		}
	} else {
		rt.setFv(f, "news_report", rt.gl("SSticker"), 12);
	}
	return 0;
});

// /datum/game_mode/clockwork_cult/proc/declare_completion  (code/game/gamemodes/clock_cult/clock_cult.dm:185)
rt.def("/datum/game_mode/clockwork_cult/proc/declare_completion", function declare_completion(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	return 0;
});

// /datum/game_mode/proc/auto_declare_completion_clockwork_cult  (code/game/gamemodes/clock_cult/clock_cult.dm:189)
rt.def("/datum/game_mode/proc/auto_declare_completion_clockwork_cult", function auto_declare_completion_clockwork_cult(f: Frame) {
	let text: Value = null, C: Value = null, half_victory: Value = null, G: Value = null, i: Value = null, M: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [text, C, half_victory, G, i, M, $0, $1, $e];
	text = "";
	if (truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/clockwork_cult")) ? 1 : 0))) {
		if (truthy(rt.callName(f, (C = rt.fv(f, "mode", rt.gl("SSticker"))), "check_clockwork_victory", []))) {
			text = rt.modify(live(text), "<span class='large_brass'><b>Ratvar's servants have succeeded in fulfilling His goals!</b></span>", add);
			rt.setFv(f, "mode_result", rt.gl("SSticker"), "win - servants completed their objective (summon ratvar)");
		} else {
			half_victory = 0;
			if (truthy((G = rt.locateIn(f, T("/obj/structure/destructible/clockwork/massive/celestial_gateway"), rt.gl("all_clockwork_objects"))))) {
				half_victory = 1;
			}
			if (truthy(live(half_victory))) {
				text = rt.modify(live(text), "<span class='large_brass'><b>The crew escaped before Ratvar could rise, but the gateway was successfully constructed!</b></span>", add);
				rt.setFv(f, "mode_result", rt.gl("SSticker"), "halfwin - servants constructed the gateway but their objective was not completed (summon ratvar)");
			} else {
				text = rt.modify(live(text), "<span class='userdanger'>Ratvar's servants have failed!</span>", add);
				rt.setFv(f, "mode_result", rt.gl("SSticker"), "loss - servants failed their objective (summon ratvar)");
			}
		}
		text = rt.modify(live(text), fmt("<br><b>The servants' objective was:</b> <br>＀", ["Construct the Ark of the Clockwork Justicar and free Ratvar."]), add);
		text = rt.modify(live(text), fmt("<br>Ratvar's servants had <b>＀</b> Tinkerer's Caches.", [rt.gl("clockwork_caches")]), add);
		text = rt.modify(live(text), fmt("<br><b>Construction Value(CV)</b> was: <b>＀</b>", [rt.gl("clockwork_construction_value")]), add);
		i = null;
		rt.forList(f, 0, rt.fv(f, "scripture_states", rt.gl("SSticker")));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!isEqual(live(i), "Driver")) {
				$0 = live(i);
				if (truthy(rt.index(rt.fv(f, "scripture_states", rt.gl("SSticker")), live(i)))) {
					$1 = "UN";
				} else {
					$1 = "";
				}
				text = rt.modify(live(text), fmt("<br><b>＀ scripture</b> was: <b>＀LOCKED</b>", [$0, $1]), add);
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.len(f, rt.sv(f, "servants_of_ratvar")))) {
		text = rt.modify(live(text), "<br><b>Ratvar's servants were:</b>", add);
		M = null;
		rt.forList(f, 0, rt.sv(f, "servants_of_ratvar"), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			text = rt.modify(live(text), rt.callSrc(f, "printplayer", [live(M)]), add);
		}
		rt.endFor(f, 0);
	}
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	return f.dot;
});

// /datum/game_mode/proc/update_servant_icons_added  (code/game/gamemodes/clock_cult/clock_cult.dm:220)
rt.def("/datum/game_mode/proc/update_servant_icons_added", function update_servant_icons_added(f: Frame, M: Value) {
	let A: Value = null;
	f.vars = () => [A];
	rt.callName(f, (A = rt.index(rt.gl("huds"), 18)), "join_hud", [rt.fv(f, "current", live(M))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(M)), "clockwork"]);
	return f.dot;
});

// /datum/game_mode/proc/update_servant_icons_removed  (code/game/gamemodes/clock_cult/clock_cult.dm:225)
rt.def("/datum/game_mode/proc/update_servant_icons_removed", function update_servant_icons_removed(f: Frame, M: Value) {
	let A: Value = null;
	f.vars = () => [A];
	rt.callName(f, (A = rt.index(rt.gl("huds"), 18)), "leave_hud", [rt.fv(f, "current", live(M))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(M)), null]);
	return f.dot;
});
