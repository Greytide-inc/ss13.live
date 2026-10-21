// From code/datums/antagonists/datum_clockcult.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(896, "/datum/antagonist/clockcult", "/datum/antagonist", {
	hierophant_network: null,
});

// /datum/antagonist/clockcult/proc/<init>  (code/datums/antagonists/datum_clockcult.dm:3)  may sleep
rt.def("/datum/antagonist/clockcult/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "hierophant_network", (yield* g.new_(f, T("/datum/action/innate/hierophant"), [])));
	return f.dot;
}, true);

// /datum/antagonist/clockcult/proc/Destroy  (code/datums/antagonists/datum_clockcult.dm:9)  may sleep
rt.def("/datum/antagonist/clockcult/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "hierophant_network")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/antagonist/clockcult/proc/can_be_owned  (code/datums/antagonists/datum_clockcult.dm:13)  may sleep
rt.def("/datum/antagonist/clockcult/proc/can_be_owned", function* can_be_owned(f: Frame) {
	let R: Value = null, AI: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [R, AI, $0, $1, $2, $3];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (truthy((rt.istype(rt.fv(f, "current", live(f.args[0])), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "deployed", (R = rt.fv(f, "current", live(f.args[0])))))) {
			AI = rt.fv(f, "mainframe", live(R));
			yield* g.callName(f, live(R), "undeploy", []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(AI), "<span class='userdanger'>Anomaly Detected. Returned to core!</span>"]);
		}
	}
	f.dot = (yield* g.call(f, P("/proc/is_eligible_servant"), null, [rt.fv(f, "current", live(f.args[0]))]));
	if (!(!truthy(rt.sv(f, "silent")) && truthy(rt.fv(f, "current", live(f.args[0]))))) return f.dot;
	if (truthy(live(f.dot))) {
		$0 = rt.fv(f, "current", live(f.args[0]));
		if (truthy((rt.istype(rt.fv(f, "current", live(f.args[0])), T("/mob/living/silicon")) ? 1 : 0))) {
			$1 = "You cannot compute this truth!";
		} else {
			$1 = "Your mind is racing!";
		}
		$2 = rt.op(f, "PickUnweighted", [4], ["ank", "ink", "unk", "ang"]);
		if (truthy(rt.gl("ratvar_awakens"))) {
			$3 = "has been freed from his eternal prison";
		} else {
			$3 = "lies in exile, derelict and forgotten in an unseen realm";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='heavy_brass'>The world before you suddenly glows a brilliant yellow. ＀ You hear the whooshing steam and cl＀ing cogs of a billion billion machines, and all at once it comes to you.<br>Ratvar, the Clockwork Justiciar, ＀.</span>", [$1, $2, $3])]);
		yield* g.call(f, P("/proc/flash_color"), null, [null, rt.fv(f, "current", live(f.args[0])), "flash_color", rt.list("#BE8700", "#BE8700", "#BE8700", "#000000"), "flash_time", 50], rt.Args.Named);
	} else {
		yield* g.callName(f, rt.fv(f, "current", live(f.args[0])), "visible_message", [fmt("<span class='boldwarning'>＀ seems to resist an unseen force!</span>", [rt.fv(f, "current", live(f.args[0]))]), null, null, 7, rt.fv(f, "current", live(f.args[0]))]);
		$0 = rt.fv(f, "current", live(f.args[0]));
		if (truthy((rt.istype(rt.fv(f, "current", live(f.args[0])), T("/mob/living/silicon")) ? 1 : 0))) {
			$1 = "You cannot compute this truth!";
		} else {
			$1 = "Your mind is racing!";
		}
		$2 = rt.op(f, "PickUnweighted", [4], ["ank", "ink", "unk", "ang"]);
		if (truthy(rt.gl("ratvar_awakens"))) {
			$3 = ", and it is here.<br>It is too late";
		} else {
			$3 = " in an endless grey void.<br>It cannot be allowed to escape";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='heavy_brass'>The world before you suddenly glows a brilliant yellow. ＀ You hear the whooshing steam and cl＀ing cogs of a billion billion machines, and the sound</span> <span class='boldwarning'>is a meaningless cacophony.</span><br><span class='userdanger'>You see an abomination of rusting parts＀.</span>", [$1, $2, $3])]);
		yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "playsound_local", [null, rt.getStep(f, rt.fv(f, "current", rt.sv(f, "owner")), 0), null, rt.rsc("sound/ambience/antag/clockcultalr.ogg"), null, 40, null, 1, "frequency", 100000, "pressure_affected", 0], rt.Args.Named);
		yield* g.call(f, P("/proc/flash_color"), null, [null, rt.fv(f, "current", live(f.args[0])), "flash_color", rt.list("#BE8700", "#BE8700", "#BE8700", "#000000"), "flash_time", 5], rt.Args.Named);
	}
	return f.dot;
}, true, { args: ["new_owner"] });

// /datum/antagonist/clockcult/proc/greet  (code/datums/antagonists/datum_clockcult.dm:39)
rt.def("/datum/antagonist/clockcult/proc/greet", function greet(f: Frame) {
	if ((!truthy(rt.fv(f, "current", rt.sv(f, "owner"))) || truthy(rt.sv(f, "silent")))) {
		return live(f.dot);
	}
	rt.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "visible_message", [fmt("<span class='heavy_brass'>＀'s eyes glow a blazing yellow!</span>", [rt.fv(f, "current", rt.sv(f, "owner"))]), null, null, 7, rt.fv(f, "current", rt.sv(f, "owner"))]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='heavy_brass'>Assist your new companions in their righteous efforts. Your goal is theirs, and theirs yours. You serve the Clockwork Justiciar above all else. Perform his every whim without hesitation.</span>"]);
	rt.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "playsound_local", [null, rt.getStep(f, rt.fv(f, "current", rt.sv(f, "owner")), 0), null, rt.rsc("sound/ambience/antag/clockcultalr.ogg"), null, 70, null, 0, "pressure_affected", 0], rt.Args.Named);
	return f.dot;
});

// /datum/antagonist/clockcult/proc/on_gain  (code/datums/antagonists/datum_clockcult.dm:48)  may sleep
rt.def("/datum/antagonist/clockcult/proc/on_gain", function* on_gain(f: Frame) {
	let current: Value = null, R: Value = null;
	f.vars = () => [current, R];
	current = rt.fv(f, "current", rt.sv(f, "owner"));
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "servants_of_ratvar", rt.sv(f, "owner"), add);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_servant_icons_added", [rt.sv(f, "owner")]);
	if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(current), "servant of Ratvar"])))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.fv(f, "mode", rt.gl("SSticker")), P("/datum/game_mode/proc/replace_jobbaned_player"), live(current), "servant of Ratvar", "servant of Ratvar"])), 0]);
	}
	rt.setFv(f, "special_role", rt.sv(f, "owner"), "Servant of Ratvar");
	yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "log_message", ["<font color=#BE8700>Has been converted to the cult of Ratvar!</font>", "Attack log"]);
	if (truthy((rt.istype(live(current), T("/mob/living/silicon")) ? 1 : 0))) {
		if ((truthy((rt.istype(live(current), T("/mob/living/silicon/robot")) ? 1 : 0)) && !truthy(rt.sv(f, "silent")))) {
			if ((truthy(rt.gv(f, "connected_ai", (R = live(current)))) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.fv(f, "connected_ai", live(R))]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(R), "<span class='boldwarning'>You have been desynced from your master AI.<br>In addition, your onboard camera is no longer active and you have gained additional equipment, including a limited clockwork slab.</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(R), "<span class='boldwarning'>Your onboard camera is no longer active and you have gained additional equipment, including a limited clockwork slab.</span>"]);
			}
		}
		if (truthy((rt.istype(live(current), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(current), "<span class='boldwarning'>You are now able to use your cameras to listen in on conversations, but can no longer speak in anything but Ratvarian.</span>"]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(current), "<span class='heavy_brass'>You can communicate with other servants by using the Hierophant Network action button in the upper left.</span>"]);
	} else {
		if ((truthy((rt.istype(live(current), T("/mob/living/brain")) ? 1 : 0)) || truthy((rt.istype(live(current), T("/mob/living/simple_animal/hostile/clockwork")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(current), "<span class='nezbere'>You can communicate with other servants by using the Hierophant Network action button in the upper left.</span>"]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(current), fmt("<b>This is Ratvar's will:</b> ＀", ["Construct the Ark of the Clockwork Justicar and free Ratvar."])]);
	rt.modField(f, rt.sv(f, "owner"), "memory", fmt("<b>Ratvar's will:</b> ＀<br>", ["Construct the Ark of the Clockwork Justicar and free Ratvar."]), add);
	return f.dot;
}, true);

// /datum/antagonist/clockcult/proc/apply_innate_effects  (code/datums/antagonists/datum_clockcult.dm:72)  may sleep
rt.def("/datum/antagonist/clockcult/proc/apply_innate_effects", function* apply_innate_effects(f: Frame) {
	let current: Value = null, S: Value = null, R: Value = null, A: Value = null, AI_frame: Value = null, d: Value = null, R_4: Value = null;
	let $e: any;
	f.vars = () => [current, S, R, A, AI_frame, d, R_4, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	current = rt.fv(f, "current", rt.sv(f, "owner"));
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		current = live(f.args[0]);
	}
	rt.modGl("all_clockwork_mobs", live(current), add);
	(rt.modField(f, live(current), "faction", "ratvar", rt.bitOr));
	yield* g.callName(f, live(current), "grant_language", [T("/datum/language/ratvar")]);
	yield* g.callName(f, live(current), "update_action_buttons_icon", []);
	if (truthy((rt.istype(live(current), T("/mob/living/silicon")) ? 1 : 0))) {
		if (truthy((rt.istype((S = live(current)), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "shell", (R = live(S))))) {
				yield* g.callName(f, live(R), "UnlinkSelf", []);
			}
			yield* g.callName(f, rt.fv(f, "module", live(R)), "rebuild_modules", []);
		} else {
			if (truthy((rt.istype(live(S), T("/mob/living/silicon/ai")) ? 1 : 0))) {
				rt.setFv(f, "can_be_carded", (A = live(S)), 0);
				rt.setFv(f, "requires_power", live(A), 2);
				AI_frame = rt.list((yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/clockwork_mobs.dmi"), "aiframe"])));
				d = null;
				rt.forList(f, 0, rt.gl("cardinal"));
				while (($e = rt.next(f, 0)) !== undefined) {
					d = $e;
					AI_frame = rt.modify(live(AI_frame), (yield* g.call(f, P("/proc/image"), null, [null, rt.rsc("icons/mob/clockwork_mobs.dmi"), null, live(A), null, fmt("eye＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 10]))]), "dir", live(d)], rt.Args.Named)), add);
				}
				rt.endFor(f, 0);
				yield* g.callName(f, live(A), "add_overlay", [live(AI_frame)]);
				if (!truthy((yield* g.callName(f, live(A), "lacks_power", [])))) {
					yield* g.callName(f, live(A), "ai_restore_power", []);
				}
				if (truthy(rt.fv(f, "eyeobj", live(A)))) {
					rt.setFv(f, "relay_speech", rt.fv(f, "eyeobj", live(A)), 1);
				}
				R_4 = null;
				rt.forList(f, 0, rt.fv(f, "connected_robots", live(A)), T("/mob/living/silicon/robot"));
				while (($e = rt.next(f, 0)) !== undefined) {
					R_4 = $e;
					if (isEqual(rt.fv(f, "connected_ai", live(R_4)), live(A))) {
						yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [live(R_4)]);
					}
				}
				rt.endFor(f, 0);
			}
		}
		rt.setFv(f, "laws", live(S), (yield* g.new_(f, T("/datum/ai_laws/ratvar"), [])));
		yield* g.callName(f, rt.fv(f, "laws", live(S)), "associate", [live(S)]);
		yield* g.callName(f, live(S), "update_icons", []);
		yield* g.callName(f, live(S), "show_laws", []);
		yield* g.callName(f, rt.sv(f, "hierophant_network"), "Grant", [live(S)]);
		rt.setFv(f, "title", rt.sv(f, "hierophant_network"), "Silicon");
		rt.setFv(f, "span_for_name", rt.sv(f, "hierophant_network"), "nezbere");
		rt.setFv(f, "span_for_message", rt.sv(f, "hierophant_network"), "brass");
	} else {
		if (truthy((rt.istype(live(current), T("/mob/living/brain")) ? 1 : 0))) {
			yield* g.callName(f, rt.sv(f, "hierophant_network"), "Grant", [live(current)]);
			rt.setFv(f, "title", rt.sv(f, "hierophant_network"), "Vessel");
			rt.setFv(f, "span_for_name", rt.sv(f, "hierophant_network"), "nezbere");
			rt.setFv(f, "span_for_message", rt.sv(f, "hierophant_network"), "alloy");
		} else {
			if (truthy((rt.istype(live(current), T("/mob/living/simple_animal/hostile/clockwork")) ? 1 : 0))) {
				yield* g.callName(f, rt.sv(f, "hierophant_network"), "Grant", [live(current)]);
				rt.setFv(f, "title", rt.sv(f, "hierophant_network"), "Construct");
				rt.setFv(f, "span_for_name", rt.sv(f, "hierophant_network"), "nezbere");
				rt.setFv(f, "span_for_message", rt.sv(f, "hierophant_network"), "brass");
			}
		}
	}
	yield* g.callName(f, live(current), "throw_alert", ["clockinfo", T("/obj/screen/alert/clockwork/infodump")]);
	if (truthy(rt.gl("clockwork_gateway_activated"))) return f.dot;
	yield* g.callName(f, live(current), "throw_alert", ["scripturereq", T("/obj/screen/alert/clockwork/scripture_reqs")]);
	return f.dot;
}, true, { args: ["mob_override"] });

// /datum/antagonist/clockcult/proc/remove_innate_effects  (code/datums/antagonists/datum_clockcult.dm:126)  may sleep
rt.def("/datum/antagonist/clockcult/proc/remove_innate_effects", function* remove_innate_effects(f: Frame) {
	let current: Value = null, F: Value = null, S: Value = null, A: Value = null, temp_owner: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [current, F, S, A, temp_owner, R, $e];
	current = rt.fv(f, "current", rt.sv(f, "owner"));
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		current = live(f.args[0]);
	}
	(rt.modGl("all_clockwork_mobs", live(current), subtract));
	(rt.modField(f, live(current), "faction", "ratvar", subtract));
	yield* g.callName(f, live(current), "remove_language", [T("/datum/language/ratvar")]);
	yield* g.callName(f, live(current), "clear_alert", ["clockinfo"]);
	yield* g.callName(f, live(current), "clear_alert", ["scripturereq"]);
	F = null;
	rt.forList(f, 0, rt.gv(f, "actions", rt.fv(f, "current", rt.sv(f, "owner"))), T("/datum/action/innate/function_call"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(F)]);
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype(live(current), T("/mob/living/silicon")) ? 1 : 0))) {
		if (truthy((rt.istype((S = live(current)), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			rt.setFv(f, "can_be_carded", (A = live(S)), rt.initial(f, live(A), "can_be_carded"));
			rt.setFv(f, "requires_power", live(A), rt.initial(f, live(A), "requires_power"));
			yield* g.callName(f, live(A), "cut_overlays", []);
		}
		yield* g.callName(f, live(S), "make_laws", []);
		yield* g.callName(f, live(S), "update_icons", []);
		yield* g.callName(f, live(S), "show_laws", []);
	}
	temp_owner = live(current);
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(temp_owner), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		yield* g.callName(f, rt.gv(f, "module", (R = live(temp_owner))), "rebuild_modules", []);
	}
	if (!truthy(live(temp_owner))) return f.dot;
	yield* g.callName(f, live(temp_owner), "update_action_buttons_icon", []);
	return f.dot;
}, true, { args: ["mob_override"] });

// /datum/antagonist/clockcult/proc/on_removal  (code/datums/antagonists/datum_clockcult.dm:154)  may sleep
rt.def("/datum/antagonist/clockcult/proc/on_removal", function* on_removal(f: Frame) {
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "servants_of_ratvar", rt.sv(f, "owner"), subtract));
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_servant_icons_removed", [rt.sv(f, "owner")]);
	if (!truthy(rt.sv(f, "silent"))) {
		yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "visible_message", [fmt("<span class='big'>＀ seems to have remembered their true allegiance!</span>", [rt.sv(f, "owner")]), "<span class='userdanger'>A cold, cold darkness flows through your mind, extinguishing the Justiciar's light and all of your memories as his servant.</span>"]);
	}
	yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "log_message", ["<font color=#BE8700>Has renounced the cult of Ratvar!</font>", "Attack log"]);
	yield* g.callName(f, rt.sv(f, "owner"), "wipe_memory", []);
	rt.setFv(f, "special_role", rt.sv(f, "owner"), null);
	if (truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='warning'>Despite your freedom from Ratvar's influence, you are still irreparably damaged and no longer possess certain functions such as AI linking.</span>"]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);
