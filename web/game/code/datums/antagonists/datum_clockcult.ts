// Based on /tg/station's code/datums/antagonists/datum_clockcult.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(896, "/datum/antagonist/clockcult", "/datum/antagonist", {
	hierophant_network: null,
});

// datum_clockcult.dm:3
rt.def("/datum/antagonist/clockcult/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.hierophant_network = (yield* new_(T("/datum/action/innate/hierophant")));
	return f.dot;
}, true);

// datum_clockcult.dm:9
rt.def("/datum/antagonist/clockcult/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.hierophant_network);
	return (yield* parent_proc());
}, true);

// datum_clockcult.dm:13
rt.def("/datum/antagonist/clockcult/proc/can_be_owned", function* can_be_owned(f: Frame, new_owner: Value) {
	let R: Value = null, AI: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (rt.istype(new_owner.current, T("/mob/living/silicon/robot"))) {
		if ((R = new_owner.current).deployed) {
			AI = R.mainframe;
			yield* R.undeploy();
			to_chat(AI, "<span class='userdanger'>Anomaly Detected. Returned to core!</span>");
		}
	}
	f.dot = is_eligible_servant(new_owner.current);
	if (!(!this.silent && new_owner.current)) return f.dot;
	if (f.dot) {
		$0 = new_owner.current;
		if (rt.istype(new_owner.current, T("/mob/living/silicon"))) {
			$1 = "You cannot compute this truth!";
		} else {
			$1 = "Your mind is racing!";
		}
		$2 = pick("ank", "ink", "unk", "ang");
		if (GLOB.ratvar_awakens) {
			$3 = "has been freed from his eternal prison";
		} else {
			$3 = "lies in exile, derelict and forgotten in an unseen realm";
		}
		to_chat($0, `<span class='heavy_brass'>The world before you suddenly glows a brilliant yellow. ${$1} You hear the whooshing steam and cl${$2}ing cogs of a billion billion machines, and all at once it comes to you.<br>Ratvar, the Clockwork Justiciar, ${$3}.</span>`);
		yield* flash_color(new_owner.current, { flash_color: list("#BE8700", "#BE8700", "#BE8700", "#000000"), flash_time: 50 });
	} else {
		new_owner.current.visible_message(`<span class='boldwarning'>${new_owner.current} seems to resist an unseen force!</span>`, null, null, 7, new_owner.current);
		$0 = new_owner.current;
		if (rt.istype(new_owner.current, T("/mob/living/silicon"))) {
			$1 = "You cannot compute this truth!";
		} else {
			$1 = "Your mind is racing!";
		}
		$2 = pick("ank", "ink", "unk", "ang");
		if (GLOB.ratvar_awakens) {
			$3 = ", and it is here.<br>It is too late";
		} else {
			$3 = " in an endless grey void.<br>It cannot be allowed to escape";
		}
		to_chat($0, `<span class='heavy_brass'>The world before you suddenly glows a brilliant yellow. ${$1} You hear the whooshing steam and cl${$2}ing cogs of a billion billion machines, and the sound</span> <span class='boldwarning'>is a meaningless cacophony.</span><br><span class='userdanger'>You see an abomination of rusting parts${$3}.</span>`);
		yield* this.owner.current.playsound_local(rt.getStep(f, this.owner.current, 0), rt.rsc("sound/ambience/antag/clockcultalr.ogg"), 40, 1, { frequency: 100000, pressure_affected: 0 });
		yield* flash_color(new_owner.current, { flash_color: list("#BE8700", "#BE8700", "#BE8700", "#000000"), flash_time: 5 });
	}
	return f.dot;
}, true);

// datum_clockcult.dm:39
rt.def("/datum/antagonist/clockcult/proc/greet", function greet(f: Frame) {
	if (!this.owner.current || this.silent) {
		return f.dot;
	}
	this.owner.current.visible_message(`<span class='heavy_brass'>${this.owner.current}'s eyes glow a blazing yellow!</span>`, null, null, 7, this.owner.current);
	to_chat(this.owner.current, "<span class='heavy_brass'>Assist your new companions in their righteous efforts. Your goal is theirs, and theirs yours. You serve the Clockwork Justiciar above all else. Perform his every whim without hesitation.</span>");
	this.owner.current.playsound_local(rt.getStep(f, this.owner.current, 0), rt.rsc("sound/ambience/antag/clockcultalr.ogg"), 70, 0, { pressure_affected: 0 });
	return f.dot;
});

// datum_clockcult.dm:48
rt.def("/datum/antagonist/clockcult/proc/on_gain", function* on_gain(f: Frame) {
	let R: Value = null;
	let current: Value = this.owner.current;
	GLOB.SSticker.mode.servants_of_ratvar += this.owner;
	GLOB.SSticker.mode.update_servant_icons_added(this.owner);
	if (jobban_isbanned(current, "servant of Ratvar")) {
		yield* addtimer((yield* new_(T("/datum/callback"), GLOB.SSticker.mode, P("/datum/game_mode/proc/replace_jobbaned_player"), current, "servant of Ratvar", "servant of Ratvar")), 0);
	}
	this.owner.special_role = "Servant of Ratvar";
	this.owner.current.log_message("<font color=#BE8700>Has been converted to the cult of Ratvar!</font>", "Attack log");
	if (rt.istype(current, T("/mob/living/silicon"))) {
		if (rt.istype(current, T("/mob/living/silicon/robot")) && !this.silent) {
			if ((R = current).connected_ai && !is_servant_of_ratvar(R.connected_ai)) {
				to_chat(R, "<span class='boldwarning'>You have been desynced from your master AI.<br>In addition, your onboard camera is no longer active and you have gained additional equipment, including a limited clockwork slab.</span>");
			} else {
				to_chat(R, "<span class='boldwarning'>Your onboard camera is no longer active and you have gained additional equipment, including a limited clockwork slab.</span>");
			}
		}
		if (rt.istype(current, T("/mob/living/silicon/ai"))) {
			to_chat(current, "<span class='boldwarning'>You are now able to use your cameras to listen in on conversations, but can no longer speak in anything but Ratvarian.</span>");
		}
		to_chat(current, "<span class='heavy_brass'>You can communicate with other servants by using the Hierophant Network action button in the upper left.</span>");
	} else if (rt.istype(current, T("/mob/living/brain")) || rt.istype(current, T("/mob/living/simple_animal/hostile/clockwork"))) {
		to_chat(current, "<span class='nezbere'>You can communicate with other servants by using the Hierophant Network action button in the upper left.</span>");
	}
	yield* parent_proc();
	to_chat(current, `<b>This is Ratvar's will:</b> ${"Construct the Ark of the Clockwork Justicar and free Ratvar."}`);
	this.owner.memory += `<b>Ratvar's will:</b> ${"Construct the Ark of the Clockwork Justicar and free Ratvar."}<br>`;
	return f.dot;
}, true);

// datum_clockcult.dm:72
rt.def("/datum/antagonist/clockcult/proc/apply_innate_effects", function* apply_innate_effects(f: Frame, mob_override: Value) {
	let S: Value = null, R: Value = null, A: Value = null, AI_frame: Value = null, d: Value = null, R_4: Value = null;
	f.dot = (yield* parent_proc());
	let current: Value = this.owner.current;
	if (rt.istype(mob_override, T("/mob/living"))) {
		current = mob_override;
	}
	GLOB.all_clockwork_mobs += current;
	(rt.modField(f, current, "faction", "ratvar", rt.bitOr));
	yield* current.grant_language(T("/datum/language/ratvar"));
	yield* current.update_action_buttons_icon();
	if (rt.istype(current, T("/mob/living/silicon"))) {
		if (rt.istype((S = current), T("/mob/living/silicon/robot"))) {
			if (!(R = S).shell) {
				yield* R.UnlinkSelf();
			}
			yield* R.module.rebuild_modules();
		} else if (rt.istype(S, T("/mob/living/silicon/ai"))) {
			(A = S).can_be_carded = 0;
			A.requires_power = 2;
			AI_frame = list(mutable_appearance(rt.rsc("icons/mob/clockwork_mobs.dmi"), "aiframe"));
			for (d of each(GLOB.cardinal)) {
				AI_frame += (yield* image(rt.rsc("icons/mob/clockwork_mobs.dmi"), A, `eye${rand(1, 10)}`, { dir: d }));
			}
			A.add_overlay(AI_frame);
			if (!A.lacks_power()) {
				yield* A.ai_restore_power();
			}
			if (A.eyeobj) {
				A.eyeobj.relay_speech = 1;
			}
			for (R_4 of each(A.connected_robots, T("/mob/living/silicon/robot"))) {
				if (R_4.connected_ai == A) {
					yield* add_servant_of_ratvar(R_4);
				}
			}
		}
		S.laws = (yield* new_(T("/datum/ai_laws/ratvar")));
		S.laws.associate(S);
		yield* S.update_icons();
		yield* S.show_laws();
		yield* this.hierophant_network.Grant(S);
		this.hierophant_network.title = "Silicon";
		this.hierophant_network.span_for_name = "nezbere";
		this.hierophant_network.span_for_message = "brass";
	} else if (rt.istype(current, T("/mob/living/brain"))) {
		yield* this.hierophant_network.Grant(current);
		this.hierophant_network.title = "Vessel";
		this.hierophant_network.span_for_name = "nezbere";
		this.hierophant_network.span_for_message = "alloy";
	} else if (rt.istype(current, T("/mob/living/simple_animal/hostile/clockwork"))) {
		yield* this.hierophant_network.Grant(current);
		this.hierophant_network.title = "Construct";
		this.hierophant_network.span_for_name = "nezbere";
		this.hierophant_network.span_for_message = "brass";
	}
	yield* current.throw_alert("clockinfo", T("/obj/screen/alert/clockwork/infodump"));
	if (GLOB.clockwork_gateway_activated) return f.dot;
	yield* current.throw_alert("scripturereq", T("/obj/screen/alert/clockwork/scripture_reqs"));
	return f.dot;
}, true);

// datum_clockcult.dm:126
rt.def("/datum/antagonist/clockcult/proc/remove_innate_effects", function* remove_innate_effects(f: Frame, mob_override: Value) {
	let F: Value = null, S: Value = null, A: Value = null, R: Value = null;
	let current: Value = this.owner.current;
	if (rt.istype(mob_override, T("/mob/living"))) {
		current = mob_override;
	}
	GLOB.all_clockwork_mobs -= current;
	current.faction -= "ratvar";
	yield* current.remove_language(T("/datum/language/ratvar"));
	yield* current.clear_alert("clockinfo");
	yield* current.clear_alert("scripturereq");
	for (F of each(this.owner.current.actions, T("/datum/action/innate/function_call"))) {
		yield* qdel(F);
	}
	if (rt.istype(current, T("/mob/living/silicon"))) {
		if (rt.istype((S = current), T("/mob/living/silicon/ai"))) {
			(A = S).can_be_carded = rt.initial(f, A, "can_be_carded");
			A.requires_power = rt.initial(f, A, "requires_power");
			A.cut_overlays();
		}
		yield* S.make_laws();
		yield* S.update_icons();
		yield* S.show_laws();
	}
	let temp_owner: Value = current;
	yield* parent_proc();
	if (rt.istype(temp_owner, T("/mob/living/silicon/robot"))) {
		yield* (R = temp_owner).module.rebuild_modules();
	}
	if (!temp_owner) return f.dot;
	yield* temp_owner.update_action_buttons_icon();
	return f.dot;
}, true);

// datum_clockcult.dm:154
rt.def("/datum/antagonist/clockcult/proc/on_removal", function* on_removal(f: Frame) {
	GLOB.SSticker.mode.servants_of_ratvar -= this.owner;
	GLOB.SSticker.mode.update_servant_icons_removed(this.owner);
	if (!this.silent) {
		this.owner.current.visible_message(`<span class='big'>${this.owner} seems to have remembered their true allegiance!</span>`, "<span class='userdanger'>A cold, cold darkness flows through your mind, extinguishing the Justiciar's light and all of your memories as his servant.</span>");
	}
	this.owner.current.log_message("<font color=#BE8700>Has renounced the cult of Ratvar!</font>", "Attack log");
	this.owner.wipe_memory();
	this.owner.special_role = null;
	if (rt.istype(this.owner.current, T("/mob/living/silicon/robot"))) {
		to_chat(this.owner.current, "<span class='warning'>Despite your freedom from Ratvar's influence, you are still irreparably damaged and no longer possess certain functions such as AI linking.</span>");
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
