// Based on /tg/station's code/modules/admin/topic.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// topic.dm:2
rt.def("/datum/admins/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ahelp_ref: Value = null, AH: Value = null, strength: Value = null, E: Value = null, event: Value = null, prompt: Value = null, adminckey: Value = null, playerckey: Value = null, page: Value = null, banedit: Value = null, banid: Value = null, bantype: Value = null, banckey: Value = null, banip: Value = null, bancid: Value = null, banduration: Value = null, banjob: Value = null, banreason: Value = null, playermob: Value = null, M: Value = null, timer: Value = null, ratio: Value = null, M_0: Value = null, delmob: Value = null, banfolder: Value = null, key: Value = null, reason: Value = null, banfolder_1: Value = null, reason2: Value = null, temp: Value = null, minutes: Value = null, banned_key: Value = null, duration: Value = null, mins: Value = null, reason_1: Value = null, dat: Value = null, counter: Value = null, jobPos: Value = null, isbanned_dept: Value = null, joblist: Value = null, jobPos_2: Value = null, notbannedlist: Value = null, job: Value = null, mins_3: Value = null, reason_4: Value = null, msg: Value = null, job_6: Value = null, reason_3: Value = null, msg_4: Value = null, job_5: Value = null, msg_3: Value = null, job_4: Value = null, reason_5: Value = null, target_ckey: Value = null, message_id: Value = null, target: Value = null, query_get_message_edits: Value = null, edit_log: Value = null, mins_1: Value = null, reason_2: Value = null, AH_4: Value = null, msg_2: Value = null, AH_3: Value = null, dat_0: Value = null, mode: Value = null, H: Value = null, Mo: Value = null, speech: Value = null, NP: Value = null, L: Value = null, I: Value = null, observer: Value = null, L_0: Value = null, AM: Value = null, C: Value = null, A: Value = null, x: Value = null, y: Value = null, z: Value = null, C_3: Value = null, location_description: Value = null, special_role_description: Value = null, health_description: Value = null, gender_description: Value = null, _T: Value = null, L_6: Value = null, status: Value = null, Add: Value = null, job_1: Value = null, Remove: Value = null, Unlimit: Value = null, Limit: Value = null, cookie: Value = null, input: Value = null, charter: Value = null, H_1: Value = null, loc: Value = null, dirty_paths: Value = null, paths: Value = null, dirty_path: Value = null, path: Value = null, offset: Value = null, number: Value = null, X: Value = null, Y: Value = null, Z: Value = null, tmp_dir: Value = null, obj_dir: Value = null, obj_name: Value = null, target_11: Value = null, where: Value = null, path_13: Value = null, i: Value = null, O: Value = null, N: Value = null, M_16: Value = null, L_16: Value = null, I_17: Value = null, R: Value = null, check: Value = null, FC: Value = null, choice: Value = null, available_channels: Value = null, F: Value = null, NEWSCASTER: Value = null, already_wanted: Value = null, input_param: Value = null, choice_0: Value = null, FC_0: Value = null, MSG: Value = null, FM: Value = null, FM_0: Value = null, afkonly: Value = null, listkicked: Value = null, strkicked: Value = null, name: Value = null, O_0: Value = null, code: Value = null, SD: Value = null, type_choices: Value = null, picked: Value = null, G: Value = null, newname: Value = null, description: Value = null, error_viewer: Value = null, C_0: Value = null, thing_to_check: Value = null, dat_2: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	yield* parent_proc();
	if (f.usr.client != this.owner || !check_rights(0)) {
		message_admins(`${f.usr.key} has attempted to override the admin panel!`);
		log_admin(`${key_name(f.usr)} tried to use the admin panel without authorization.`);
		return f.dot;
	}
	if (rt.at(href_list, "ahelp")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		ahelp_ref = rt.at(href_list, "ahelp");
		if (AH = rt.locateIn(f, ahelp_ref, rt.world())) {
			yield* AH.Action(rt.at(href_list, "ahelp_action"));
		} else {
			to_chat(f.usr, `Ticket ${ahelp_ref} has been deleted!`);
		}
	} else if (rt.at(href_list, "ahelp_tickets")) {
		GLOB.ahelp_tickets.BrowseTickets(text2num(rt.at(href_list, "ahelp_tickets")));
	} else if (rt.at(href_list, "stickyban")) {
		yield* this.stickyban(rt.at(href_list, "stickyban"), href_list);
	} else if (rt.at(href_list, "makeAntag")) {
		if (!GLOB.SSticker.mode) {
			to_chat(f.usr, "<span class='danger'>Not until the round starts!</span>");
			return f.dot;
		}
		$0 = rt.at(href_list, "makeAntag");
		if ($0 === "traitors") {
			if (yield* this.makeTraitors()) {
				message_admins(`${key_name_admin(f.usr)} created traitors.`);
				log_admin(`${key_name(f.usr)} created traitors.`);
			} else {
				message_admins(`${key_name_admin(f.usr)} tried to create traitors. Unfortunately, there were no candidates available.`);
				log_admin(`${key_name(f.usr)} failed to create traitors.`);
			}
		} else if ($0 === "changelings") {
			if (yield* this.makeChanglings()) {
				message_admins(`${key_name(f.usr)} created changelings.`);
				log_admin(`${key_name(f.usr)} created changelings.`);
			} else {
				message_admins(`${key_name_admin(f.usr)} tried to create changelings. Unfortunately, there were no candidates available.`);
				log_admin(`${key_name(f.usr)} failed to create changelings.`);
			}
		} else if ($0 === "revs") {
			if (yield* this.makeRevs()) {
				message_admins(`${key_name(f.usr)} started a revolution.`);
				log_admin(`${key_name(f.usr)} started a revolution.`);
			} else {
				message_admins(`${key_name_admin(f.usr)} tried to start a revolution. Unfortunately, there were no candidates available.`);
				log_admin(`${key_name(f.usr)} failed to start a revolution.`);
			}
		} else if ($0 === "cult") {
			if (yield* this.makeCult()) {
				message_admins(`${key_name(f.usr)} started a cult.`);
				log_admin(`${key_name(f.usr)} started a cult.`);
			} else {
				message_admins(`${key_name_admin(f.usr)} tried to start a cult. Unfortunately, there were no candidates available.`);
				log_admin(`${key_name(f.usr)} failed to start a cult.`);
			}
		} else if ($0 === "wizard") {
			message_admins(`${key_name(f.usr)} is creating a wizard...`);
			if (yield* this.makeWizard()) {
				message_admins(`${key_name(f.usr)} created a wizard.`);
				log_admin(`${key_name(f.usr)} created a wizard.`);
			} else {
				message_admins(`${key_name_admin(f.usr)} tried to create a wizard. Unfortunately, there were no candidates available.`);
				log_admin(`${key_name(f.usr)} failed to create a wizard.`);
			}
		} else if ($0 === "nukeops") {
			message_admins(`${key_name(f.usr)} is creating a nuke team...`);
			if (yield* this.makeNukeTeam()) {
				message_admins(`${key_name(f.usr)} created a nuke team.`);
				log_admin(`${key_name(f.usr)} created a nuke team.`);
			} else {
				message_admins(`${key_name_admin(f.usr)} tried to create a nuke team. Unfortunately, there were not enough candidates available.`);
				log_admin(`${key_name(f.usr)} failed to create a nuke team.`);
			}
		} else if ($0 === "ninja") {
			message_admins(`${key_name(f.usr)} spawned a ninja.`);
			log_admin(`${key_name(f.usr)} spawned a ninja.`);
			this.makeSpaceNinja();
		} else if ($0 === "aliens") {
			message_admins(`${key_name(f.usr)} started an alien infestation.`);
			log_admin(`${key_name(f.usr)} started an alien infestation.`);
			this.makeAliens();
		} else if ($0 === "deathsquad") {
			message_admins(`${key_name(f.usr)} is creating a death squad...`);
			if (yield* this.makeDeathsquad()) {
				message_admins(`${key_name(f.usr)} created a death squad.`);
				log_admin(`${key_name(f.usr)} created a death squad.`);
			} else {
				message_admins(`${key_name_admin(f.usr)} tried to create a death squad. Unfortunately, there were not enough candidates available.`);
				log_admin(`${key_name(f.usr)} failed to create a death squad.`);
			}
		} else if ($0 === "blob") {
			if (!(strength = (yield* g.op(f, "Prompt", [33], [null, 1, "Set Resource Rate", "Set Blob Resource Gain Rate", null])))) {
				return f.dot;
			}
			message_admins(`${key_name(f.usr)} spawned a blob with base resource gain ${strength}.`);
			log_admin(`${key_name(f.usr)} spawned a blob with base resource gain ${strength}.`);
			yield* new_(T("/datum/round_event/ghost_role/blob"), 1, strength);
		} else if ($0 === "gangs") {
			if (yield* this.makeGangsters()) {
				message_admins(`${key_name(f.usr)} created gangs.`);
				log_admin(`${key_name(f.usr)} created gangs.`);
			} else {
				message_admins(`${key_name(f.usr)} tried to create gangs. Unfortunately, there were not enough candidates available.`);
				log_admin(`${key_name(f.usr)} failed create gangs.`);
			}
		} else if ($0 === "centcom") {
			message_admins(`${key_name(f.usr)} is creating a Centcom response team...`);
			if (yield* this.makeEmergencyresponseteam()) {
				message_admins(`${key_name(f.usr)} created a Centcom response team.`);
				log_admin(`${key_name(f.usr)} created a Centcom response team.`);
			} else {
				message_admins(`${key_name_admin(f.usr)} tried to create a Centcom response team. Unfortunately, there were not enough candidates available.`);
				log_admin(`${key_name(f.usr)} failed to create a Centcom response team.`);
			}
		} else if ($0 === "abductors") {
			message_admins(`${key_name(f.usr)} is creating an abductor team...`);
			if (this.makeAbductorTeam()) {
				message_admins(`${key_name(f.usr)} created an abductor team.`);
				log_admin(`${key_name(f.usr)} created an abductor team.`);
			} else {
				message_admins(`${key_name_admin(f.usr)} tried to create an abductor team. Unfortunatly there were not enough candidates available.`);
				log_admin(`${key_name(f.usr)} failed to create an abductor team.`);
			}
		} else if ($0 === "clockcult") {
			if (yield* this.makeClockCult()) {
				message_admins(`${key_name(f.usr)} started a clockwork cult.`);
				log_admin(`${key_name(f.usr)} started a clockwork cult.`);
			} else {
				message_admins(`${key_name_admin(f.usr)} tried to start a clockwork cult. Unfortunately, there were no candidates available.`);
				log_admin(`${key_name(f.usr)} failed to start a clockwork cult.`);
			}
		} else if ($0 === "revenant") {
			if (this.makeRevenant()) {
				message_admins(`${key_name(f.usr)} created a revenant.`);
				log_admin(`${key_name(f.usr)} created a revenant.`);
			} else {
				message_admins(`${key_name_admin(f.usr)} tried to create a revenant. Unfortunately, there were no candidates available.`);
				log_admin(`${key_name(f.usr)} failed to create a revenant.`);
			}
		}
	} else if (rt.at(href_list, "forceevent")) {
		if (!check_rights(8)) {
			return f.dot;
		}
		if (E = rt.locateIn(f, rt.at(href_list, "forceevent"), GLOB.SSevents.control)) {
			if ((event = (yield* E.runEvent())).announceWhen > 0) {
				event.processing = 0;
				$0 = (prompt = (yield* alert(f.usr, "Would you like to alert the crew?", "Alert", "Yes", "No", "Cancel")));
				if ($0 === "Cancel") {
					event.kill();
					return f.dot;
				} else if ($0 === "No") {
					event.announceWhen = -1;
				}
				event.processing = 1;
			}
			message_admins(`${key_name_admin(f.usr)} has triggered an event. (${E.name})`);
			log_admin(`${key_name(f.usr)} has triggered an event. (${E.name})`);
		}
		return f.dot;
	} else if (rt.at(href_list, "call_shuttle")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		$0 = rt.at(href_list, "call_shuttle");
		if ($0 === "1") {
			if (GLOB.SSshuttle.emergency && GLOB.SSshuttle.emergency.mode != "idle" && GLOB.SSshuttle.emergency.mode != "recall" && GLOB.SSshuttle.emergency.mode != "call") {
				return f.dot;
			}
			yield* GLOB.SSshuttle.emergency.request();
			log_admin(`${key_name(f.usr)} called the Emergency Shuttle.`);
			message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} called the Emergency Shuttle to the station.</span>`);
		} else if ($0 === "2") {
			if (GLOB.SSshuttle.emergency && GLOB.SSshuttle.emergency.mode != "idle" && GLOB.SSshuttle.emergency.mode != "recall" && GLOB.SSshuttle.emergency.mode != "call") {
				return f.dot;
			}
			$0 = GLOB.SSshuttle.emergency.mode;
			if ($0 === "call") {
				yield* GLOB.SSshuttle.emergency.cancel();
				log_admin(`${key_name(f.usr)} sent the Emergency Shuttle back.`);
				message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} sent the Emergency Shuttle back.</span>`);
			} else {
				yield* GLOB.SSshuttle.emergency.cancel();
				log_admin(`${key_name(f.usr)} called the Emergency Shuttle.`);
				message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} called the Emergency Shuttle to the station.</span>`);
			}
		}
		rt.setAt(href_list, "secrets", "check_antagonist");
	} else if (rt.at(href_list, "edit_shuttle_time")) {
		if (!check_rights(16)) {
			return f.dot;
		}
		if (!(timer = (yield* g.op(f, "Prompt", [33], [null, GLOB.SSshuttle.emergency.timeLeft(), "Edit Shuttle Timeleft", "Enter new shuttle duration (seconds):", null])))) {
			return f.dot;
		}
		GLOB.SSshuttle.emergency.setTimer(timer * 10);
		log_admin(`${key_name(f.usr)} edited the Emergency Shuttle's timeleft to ${timer} seconds.`);
		minor_announce(`The emergency shuttle will reach its destination in ${round(GLOB.SSshuttle.emergency.timeLeft(600))} minutes.`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} edited the Emergency Shuttle's timeleft to ${timer} seconds.</span>`);
		rt.setAt(href_list, "secrets", "check_antagonist");
	} else if (rt.at(href_list, "trigger_centcom_recall")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		yield* f.usr.client.trigger_centcom_recall();
	} else if (rt.at(href_list, "toggle_continuous")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!rt.index(GLOB.config.continuous, GLOB.SSticker.mode.config_tag)) {
			rt.setAt(GLOB.config.continuous, GLOB.SSticker.mode.config_tag, 1);
		} else {
			rt.setAt(GLOB.config.continuous, GLOB.SSticker.mode.config_tag, 0);
		}
		$0 = key_name_admin(f.usr);
		if (rt.index(GLOB.config.continuous, GLOB.SSticker.mode.config_tag)) {
			$1 = "continue if all antagonists die";
		} else {
			$1 = "end with the antagonists";
		}
		message_admins(`<span class='adminnotice'>${$0} toggled the round to ${$1}.</span>`);
		yield* this.check_antagonists();
	} else if (rt.at(href_list, "toggle_midround_antag")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!rt.index(GLOB.config.midround_antag, GLOB.SSticker.mode.config_tag)) {
			rt.setAt(GLOB.config.midround_antag, GLOB.SSticker.mode.config_tag, 1);
		} else {
			rt.setAt(GLOB.config.midround_antag, GLOB.SSticker.mode.config_tag, 0);
		}
		$0 = key_name_admin(f.usr);
		if (rt.index(GLOB.config.midround_antag, GLOB.SSticker.mode.config_tag)) {
			$1 = "use";
		} else {
			$1 = "skip";
		}
		message_admins(`<span class='adminnotice'>${$0} toggled the round to ${$1} the midround antag system.</span>`);
		yield* this.check_antagonists();
	} else if (rt.at(href_list, "alter_midround_time_limit")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!(timer = (yield* g.op(f, "Prompt", [33], [null, GLOB.config.midround_antag_time_check, null, "Enter new maximum time", null])))) {
			return f.dot;
		}
		GLOB.config.midround_antag_time_check = timer;
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} edited the maximum midround antagonist time to ${timer} minutes.</span>`);
		yield* this.check_antagonists();
	} else if (rt.at(href_list, "alter_midround_life_limit")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (ratio = (yield* g.op(f, "Prompt", [32], [null, GLOB.config.midround_antag_life_check * 100, null, "Enter new life ratio", null]))) {
			GLOB.config.midround_antag_life_check = ratio / 100;
		}
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} edited the midround antagonist living crew ratio to ${ratio}% alive.</span>`);
		yield* this.check_antagonists();
	} else if (rt.at(href_list, "toggle_noncontinuous_behavior")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!GLOB.SSticker.mode.round_ends_with_antag_death) {
			GLOB.SSticker.mode.round_ends_with_antag_death = 1;
		} else {
			GLOB.SSticker.mode.round_ends_with_antag_death = 0;
		}
		$0 = key_name_admin(f.usr);
		if (GLOB.SSticker.mode.round_ends_with_antag_death) {
			$1 = "end the round";
		} else {
			$1 = "continue as extended";
		}
		message_admins(`<span class='adminnotice'>${$0} edited the midround antagonist system to ${$1} upon failure.`);
		yield* this.check_antagonists();
	} else if (rt.at(href_list, "delay_round_end")) {
		if (!check_rights(16)) {
			return f.dot;
		}
		GLOB.SSticker.delay_end = (!GLOB.SSticker.delay_end ? 1 : 0);
		$0 = key_name(f.usr);
		if (GLOB.SSticker.delay_end) {
			$1 = "delayed the round end";
		} else {
			$1 = "has made the round end normally";
		}
		log_admin(`${$0} ${$1}.`);
		$0 = key_name(f.usr);
		if (GLOB.SSticker.delay_end) {
			$1 = "delayed the round end";
		} else {
			$1 = "has made the round end normally";
		}
		message_admins(`<span class='adminnotice'>${$0} ${$1}.</span>`);
		rt.setAt(href_list, "secrets", "check_antagonist");
	} else if (rt.at(href_list, "end_round")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} is considering ending the round.</span>`);
		if ((yield* alert(f.usr, "This will end the round, are you SURE you want to do this?", "Confirmation", "Yes", "No")) == "Yes") {
			if ((yield* alert(f.usr, "Final Confirmation: End the round NOW?", "Confirmation", "Yes", "No")) == "Yes") {
				message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} has ended the round.</span>`);
				GLOB.SSticker.force_ending = 1;
				return f.dot;
			} else {
				message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} decided against ending the round.</span>`);
			}
		} else {
			message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} decided against ending the round.</span>`);
		}
	} else if (rt.at(href_list, "simplemake")) {
		if (!check_rights(4096)) {
			return f.dot;
		}
		if (!ismob((M_0 = rt.locateIn(f, rt.at(href_list, "mob"), rt.world())))) {
			to_chat(f.usr, "This can only be used on instances of type /mob.");
			return f.dot;
		}
		delmob = 0;
		$0 = (yield* alert("Delete old mob?", "Message", "Yes", "No", "Cancel"));
		if ($0 === "Cancel") {
			return f.dot;
		} else if ($0 === "Yes") {
			delmob = 1;
		}
		log_admin(`${key_name(f.usr)} has used rudimentary transformation on ${key_name(M_0)}. Transforming to ${rt.at(href_list, "simplemake")}.; deletemob=${delmob}`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} has used rudimentary transformation on ${key_name_admin(M_0)}. Transforming to ${rt.at(href_list, "simplemake")}.; deletemob=${delmob}</span>`);
		$0 = rt.at(href_list, "simplemake");
		if ($0 === "observer") {
			yield* M_0.change_mob_type(T("/mob/dead/observer"), null, null, delmob);
		} else if ($0 === "drone") {
			yield* M_0.change_mob_type(T("/mob/living/carbon/alien/humanoid/drone"), null, null, delmob);
		} else if ($0 === "hunter") {
			yield* M_0.change_mob_type(T("/mob/living/carbon/alien/humanoid/hunter"), null, null, delmob);
		} else if ($0 === "queen") {
			yield* M_0.change_mob_type(T("/mob/living/carbon/alien/humanoid/royal/queen"), null, null, delmob);
		} else if ($0 === "praetorian") {
			yield* M_0.change_mob_type(T("/mob/living/carbon/alien/humanoid/royal/praetorian"), null, null, delmob);
		} else if ($0 === "sentinel") {
			yield* M_0.change_mob_type(T("/mob/living/carbon/alien/humanoid/sentinel"), null, null, delmob);
		} else if ($0 === "larva") {
			yield* M_0.change_mob_type(T("/mob/living/carbon/alien/larva"), null, null, delmob);
		} else if ($0 === "human") {
			yield* M_0.change_mob_type(T("/mob/living/carbon/human"), null, null, delmob);
		} else if ($0 === "slime") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/slime"), null, null, delmob);
		} else if ($0 === "monkey") {
			yield* M_0.change_mob_type(T("/mob/living/carbon/monkey"), null, null, delmob);
		} else if ($0 === "robot") {
			yield* M_0.change_mob_type(T("/mob/living/silicon/robot"), null, null, delmob);
		} else if ($0 === "cat") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/pet/cat"), null, null, delmob);
		} else if ($0 === "runtime") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/pet/cat/Runtime"), null, null, delmob);
		} else if ($0 === "corgi") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/pet/dog/corgi"), null, null, delmob);
		} else if ($0 === "ian") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/pet/dog/corgi/Ian"), null, null, delmob);
		} else if ($0 === "pug") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/pet/dog/pug"), null, null, delmob);
		} else if ($0 === "crab") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/crab"), null, null, delmob);
		} else if ($0 === "coffee") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/crab/Coffee"), null, null, delmob);
		} else if ($0 === "parrot") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/parrot"), null, null, delmob);
		} else if ($0 === "polyparrot") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/parrot/Poly"), null, null, delmob);
		} else if ($0 === "constructarmored") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/hostile/construct/armored"), null, null, delmob);
		} else if ($0 === "constructbuilder") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/hostile/construct/builder"), null, null, delmob);
		} else if ($0 === "constructwraith") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/hostile/construct/wraith"), null, null, delmob);
		} else if ($0 === "shade") {
			yield* M_0.change_mob_type(T("/mob/living/simple_animal/shade"), null, null, delmob);
		}
	} else if (rt.at(href_list, "unbanf")) {
		if (!check_rights(4)) {
			return f.dot;
		}
		banfolder = rt.at(href_list, "unbanf");
		GLOB.Banlist.cd = `/base/${banfolder}`;
		key = rt.at(GLOB.Banlist, "key");
		if ((yield* alert(f.usr, `Are you sure you want to unban ${key}?`, "Confirmation", "Yes", "No")) == "Yes") {
			if (RemoveBan(banfolder)) {
				this.unbanpanel();
			} else {
				yield* alert(f.usr, "This ban has already been lifted / does not exist.", "Error", "Ok");
				this.unbanpanel();
			}
		}
	} else if (rt.at(href_list, "unbane")) {
		if (!check_rights(4)) {
			return f.dot;
		}
		UpdateTime();
		banfolder_1 = rt.at(href_list, "unbane");
		GLOB.Banlist.cd = `/base/${banfolder_1}`;
		reason2 = rt.at(GLOB.Banlist, "reason");
		temp = rt.at(GLOB.Banlist, "temp");
		minutes = rt.at(GLOB.Banlist, "minutes");
		banned_key = rt.at(GLOB.Banlist, "key");
		GLOB.Banlist.cd = "/base";
		$0 = (yield* alert("Temporary Ban?", null, "Yes", "No"));
		if ($0 === "Yes") {
			temp = 1;
			mins = 0;
			if (minutes > GLOB.CMinutes) {
				mins = minutes - GLOB.CMinutes;
			}
			if (mins) {
				$0 = mins;
			} else {
				$0 = 1440;
			}
			if ((mins = (yield* g.op(f, "Prompt", [33], [$0, "Ban time", "How long (in minutes)? (Default: 1440)", f.usr, null]))) <= 0) {
				to_chat(f.usr, `<span class='danger'>${mins} is not a valid duration.</span>`);
				return f.dot;
			}
			duration = GetExp((minutes = GLOB.CMinutes + mins));
			if (!(reason = (yield* g.op(f, "Prompt", [65], [reason2, "Reason", "Please State Reason.", f.usr, null])))) {
				return f.dot;
			}
		} else if ($0 === "No") {
			temp = 0;
			duration = "Perma";
			if (!(reason = (yield* g.op(f, "Prompt", [65], [reason2, "Reason", "Please State Reason.", f.usr, null])))) {
				return f.dot;
			}
		}
		log_admin_private(`${key_name(f.usr)} edited ${banned_key}'s ban. Reason: ${reason} Duration: ${duration}`);
		ban_unban_log_save(`${key_name(f.usr)} edited ${banned_key}'s ban. Reason: ${reason} Duration: ${duration}`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} edited ${banned_key}'s ban. Reason: ${reason} Duration: ${duration}</span>`);
		GLOB.Banlist.cd = `/base/${banfolder_1}`;
		rt.op(f, "OutputReference", [rt.R.index], [GLOB.Banlist, "reason", reason], false);
		rt.op(f, "OutputReference", [rt.R.index], [GLOB.Banlist, "temp", temp], false);
		rt.op(f, "OutputReference", [rt.R.index], [GLOB.Banlist, "minutes", minutes], false);
		rt.op(f, "OutputReference", [rt.R.index], [GLOB.Banlist, "bannedby", f.usr.ckey], false);
		GLOB.Banlist.cd = "/base";
		this.unbanpanel();
	} else if (rt.at(href_list, "boot2")) {
		if (ismob((M_0 = rt.locateIn(f, rt.at(href_list, "boot2"), rt.world())))) {
			if (!check_if_greater_rights_than(M_0.client)) {
				to_chat(f.usr, "<span class='danger'>Error: They have more rights than you do.</span>");
				return f.dot;
			}
			$0 = M_0;
			if (f.usr.client.holder.fakekey) {
				$1 = "an Administrator";
			} else {
				$1 = `${f.usr.client.ckey}`;
			}
			to_chat($0, `<span class='danger'>You have been kicked from the server by ${$1}.</span>`);
			log_admin(`${key_name(f.usr)} kicked ${key_name(M_0)}.`);
			message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} kicked ${key_name_admin(M_0)}.</span>`);
			if (M_0.client) yield* GLOB.SSvote.note_removal(`${(yield* GLOB.SSvote.boot_label(M_0.client))} was kicked by an admin.`, 1); // ss13.live: plans/server-rules.md step 5
			yield* qdel(M_0.client);
		}
	} else if (rt.at(href_list, "newban")) {
		if (!check_rights(4)) {
			return f.dot;
		}
		if (!ismob((M_0 = rt.locateIn(f, rt.at(href_list, "newban"), rt.world())))) {
			return f.dot;
		}
		if (M_0.client && M_0.client.holder) {
			return f.dot;
		}
		$0 = (yield* alert("Temporary Ban?", null, "Yes", "No", "Cancel"));
		if ($0 === "Yes") {
			if ((mins_1 = (yield* g.op(f, "Prompt", [33], [1440, "Ban time", "How long (in minutes)?", f.usr, null]))) <= 0) {
				to_chat(f.usr, `<span class='danger'>${mins_1} is not a valid duration.</span>`);
				return f.dot;
			}
			if (!(reason_2 = (yield* g.op(f, "Prompt", [65], [null, "Reason", "Please State Reason.", f.usr, null])))) {
				return f.dot;
			}
			yield* AddBan(M_0.ckey, M_0.computer_id, reason_2, f.usr.ckey, 1, mins_1);
			ban_unban_log_save(`${key_name(f.usr)} has banned ${key_name(M_0)}. - Reason: ${reason_2} - This will be removed in ${mins_1} minutes.`);
			to_chat(M_0, `<span class='boldannounce'><BIG>You have been banned by ${f.usr.client.ckey}.\nReason: ${reason_2}</BIG></span>`);
			to_chat(M_0, `<span class='danger'>This is a temporary ban, it will be removed in ${mins_1} minutes.</span>`);
			if (GLOB.config.banappeals) {
				to_chat(M_0, `<span class='danger'>To try to resolve this matter head to ${GLOB.config.banappeals}</span>`);
			} else {
				to_chat(M_0, "<span class='danger'>No ban appeals URL has been set.</span>");
			}
			log_admin_private(`${key_name(f.usr)} has banned ${M_0.ckey}.\nReason: ${key_name(M_0)}\nThis will be removed in ${mins_1} minutes.`);
			message_admins((msg_3 = `<span class='adminnotice'>${key_name_admin(f.usr)} has banned ${key_name_admin(M_0)}.\nReason: ${reason_2}\nThis will be removed in ${mins_1} minutes.</span>`));
			if (M_0.client) {
				$0 = M_0.client.current_ticket;
			} else {
				$0 = null;
			}
			if (AH_4 = $0) {
				yield* AH_4.Resolve();
			}
			if (M_0.client) yield* GLOB.SSvote.note_removal(`${(yield* GLOB.SSvote.boot_label(M_0.client))} was banned by an admin for ${mins_1} minutes. Reason: ${reason_2}`, 1); // ss13.live: plans/server-rules.md step 5
			yield* qdel(M_0.client);
		} else if ($0 === "No") {
			if (!(reason_1 = (yield* g.op(f, "Prompt", [65], [null, "Reason", "Please State Reason.", f.usr, null])))) {
				return f.dot;
			}
			$0 = (yield* alert(f.usr, "IP ban?", null, "Yes", "No", "Cancel"));
			if ($0 === "Cancel") {
				return f.dot;
			} else if ($0 === "Yes") {
				yield* AddBan(M_0.ckey, M_0.computer_id, reason_1, f.usr.ckey, 0, 0, M_0.lastKnownIP);
			} else if ($0 === "No") {
				yield* AddBan(M_0.ckey, M_0.computer_id, reason_1, f.usr.ckey, 0, 0);
			}
			to_chat(M_0, `<span class='boldannounce'><BIG>You have been banned by ${f.usr.client.ckey}.\nReason: ${reason_1}</BIG></span>`);
			to_chat(M_0, "<span class='danger'>This is a permanent ban.</span>");
			if (GLOB.config.banappeals) {
				to_chat(M_0, `<span class='danger'>To try to resolve this matter head to ${GLOB.config.banappeals}</span>`);
			} else {
				to_chat(M_0, "<span class='danger'>No ban appeals URL has been set.</span>");
			}
			ban_unban_log_save(`${key_name(f.usr)} has permabanned ${key_name(M_0)}. - Reason: ${reason_1} - This is a permanent ban.`);
			log_admin_private(`${key_name(f.usr)} has banned ${key_name_admin(M_0)}.\nReason: ${reason_1}\nThis is a permanent ban.`);
			message_admins((msg_2 = `<span class='adminnotice'>${key_name_admin(f.usr)} has banned ${key_name_admin(M_0)}.\nReason: ${reason_1}\nThis is a permanent ban.</span>`));
			if (M_0.client) {
				$0 = M_0.client.current_ticket;
			} else {
				$0 = null;
			}
			if (AH_3 = $0) {
				yield* AH_3.Resolve();
			}
			if (M_0.client) yield* GLOB.SSvote.note_removal(`${(yield* GLOB.SSvote.boot_label(M_0.client))} was banned by an admin. Reason: ${reason_1}`, 1); // ss13.live: plans/server-rules.md step 5
			yield* qdel(M_0.client);
		} else if ($0 === "Cancel") {
			return f.dot;
		}
	} else if (rt.at(href_list, "mute")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		cmd_admin_mute(rt.at(href_list, "mute"), text2num(rt.at(href_list, "mute_type")));
	} else if (rt.at(href_list, "c_mode")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (GLOB.SSticker.HasRoundStarted()) {
			return (yield* alert(f.usr, "The game has already started.", null, null, null, null));
		}
		dat_0 = "<B>What mode do you wish to play?</B><HR>";
		for (mode of each(GLOB.config.modes)) {
			dat_0 += fmt("<A href='?src=＃;c_mode2=＀'>＀</A><br>", [this, mode, rt.index(GLOB.config.mode_names, mode)]);
		}
		dat_0 += fmt("<A href='?src=＃;c_mode2=secret'>Secret</A><br>", [this]);
		dat_0 += fmt("<A href='?src=＃;c_mode2=random'>Random</A><br>", [this]);
		dat_0 += `Now: ${GLOB.master_mode}`;
		rt.op(f, "Browse", [], [f.usr, dat_0, "window=c_mode"], false);
	} else if (rt.at(href_list, "f_secret")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (GLOB.SSticker.HasRoundStarted()) {
			return (yield* alert(f.usr, "The game has already started.", null, null, null, null));
		}
		if (GLOB.master_mode != "secret") {
			return (yield* alert(f.usr, "The game mode has to be secret!", null, null, null, null));
		}
		dat_0 = "<B>What game mode do you want to force secret to be? Use this if you want to change the game mode, but want the players to believe it's secret. This will only work if the current game mode is secret.</B><HR>";
		mode = null;
		for (mode of each(GLOB.config.modes)) {
			dat_0 += fmt("<A href='?src=＃;f_secret2=＀'>＀</A><br>", [this, mode, rt.index(GLOB.config.mode_names, mode)]);
		}
		dat_0 += fmt("<A href='?src=＃;f_secret2=secret'>Random (default)</A><br>", [this]);
		dat_0 += `Now: ${GLOB.secret_force_mode}`;
		rt.op(f, "Browse", [], [f.usr, dat_0, "window=f_secret"], false);
	} else if (rt.at(href_list, "c_mode2")) {
		if (!check_rights(18)) {
			return f.dot;
		}
		if (GLOB.SSticker.HasRoundStarted()) {
			return (yield* alert(f.usr, "The game has already started.", null, null, null, null));
		}
		GLOB.master_mode = rt.at(href_list, "c_mode2");
		log_admin(`${key_name(f.usr)} set the mode as ${GLOB.master_mode}.`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} set the mode as ${GLOB.master_mode}.</span>`);
		to_chat(rt.world(), `<span class='adminnotice'><b>The mode is now: ${GLOB.master_mode}</b></span>`);
		this.Game();
		GLOB.SSticker.save_mode(GLOB.master_mode);
		yield* g.callSelf(f, [href, rt.alist(f, ["c_mode", 1])]);
	} else if (rt.at(href_list, "f_secret2")) {
		if (!check_rights(18)) {
			return f.dot;
		}
		if (GLOB.SSticker.HasRoundStarted()) {
			return (yield* alert(f.usr, "The game has already started.", null, null, null, null));
		}
		if (GLOB.master_mode != "secret") {
			return (yield* alert(f.usr, "The game mode has to be secret!", null, null, null, null));
		}
		GLOB.secret_force_mode = rt.at(href_list, "f_secret2");
		log_admin(`${key_name(f.usr)} set the forced secret mode as ${GLOB.secret_force_mode}.`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} set the forced secret mode as ${GLOB.secret_force_mode}.</span>`);
		this.Game();
		yield* g.callSelf(f, [href, rt.alist(f, ["f_secret", 1])]);
	} else if (rt.at(href_list, "monkeyone")) {
		if (!check_rights(4096)) {
			return f.dot;
		}
		if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "monkeyone"), rt.world())), T("/mob/living/carbon/human"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/human.");
			return f.dot;
		}
		log_admin(`${key_name(f.usr)} attempting to monkeyize ${key_name(H)}.`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} attempting to monkeyize ${key_name_admin(H)}.</span>`);
		yield* H.monkeyize();
	} else if (rt.at(href_list, "humanone")) {
		if (!check_rights(4096)) {
			return f.dot;
		}
		if (!rt.istype((Mo = rt.locateIn(f, rt.at(href_list, "humanone"), rt.world())), T("/mob/living/carbon/monkey"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/monkey.");
			return f.dot;
		}
		log_admin(`${key_name(f.usr)} attempting to humanize ${key_name(Mo)}.`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} attempting to humanize ${key_name_admin(Mo)}.</span>`);
		yield* Mo.humanize();
	} else if (rt.at(href_list, "corgione")) {
		if (!check_rights(4096)) {
			return f.dot;
		}
		if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "corgione"), rt.world())), T("/mob/living/carbon/human"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/human.");
			return f.dot;
		}
		log_admin(`${key_name(f.usr)} attempting to corgize ${key_name(H)}.`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} attempting to corgize ${key_name_admin(H)}.</span>`);
		yield* H.corgize();
	} else if (rt.at(href_list, "forcespeech")) {
		if (!check_rights(8)) {
			return f.dot;
		}
		if (!ismob((M_0 = rt.locateIn(f, rt.at(href_list, "forcespeech"), rt.world())))) {
			to_chat(f.usr, "this can only be used on instances of type /mob.");
		}
		if (!(speech = (yield* g.op(f, "Prompt", [2], [null, "", "Force speech", `What will ${key_name(M_0)} say?.`, null])))) {
			return f.dot;
		}
		yield* M_0.say(speech);
		speech = sanitize(speech);
		log_admin(`${key_name(f.usr)} forced ${key_name(M_0)} to say: ${speech}`);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} forced ${key_name_admin(M_0)} to say: ${speech}</span>`);
	} else if (rt.at(href_list, "sendtoprison")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!ismob((M_0 = rt.locateIn(f, rt.at(href_list, "sendtoprison"), rt.world())))) {
			to_chat(f.usr, "This can only be used on instances of type /mob.");
			return f.dot;
		}
		if (rt.istype(M_0, T("/mob/living/silicon/ai"))) {
			to_chat(f.usr, "This cannot be used on instances of type /mob/living/silicon/ai.");
			return f.dot;
		}
		if ((yield* alert(f.usr, `Send ${key_name(M_0)} to Prison?`, "Message", "Yes", "No")) != "Yes") {
			return f.dot;
		}
		M_0.loc = pick(GLOB.prisonwarp);
		to_chat(M_0, "<span class='adminnotice'>You have been sent to Prison!</span>");
		log_admin(`${key_name(f.usr)} has sent ${key_name(M_0)} to Prison!`);
		message_admins(`${key_name_admin(f.usr)} has sent ${key_name_admin(M_0)} Prison!`);
	} else if (rt.at(href_list, "sendbacktolobby")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!rt.istype((M_0 = rt.locateIn(f, rt.at(href_list, "sendbacktolobby"), rt.world())), T("/mob/dead/observer"))) {
			to_chat(f.usr, "<span class='notice'>You can only send ghost players back to the Lobby.</span>");
			return f.dot;
		}
		if (!M_0.client) {
			to_chat(f.usr, `<span class='warning'>${M_0} doesn't seem to have an active client.</span>`);
			return f.dot;
		}
		if ((yield* alert(f.usr, `Send ${key_name(M_0)} back to Lobby?`, "Message", "Yes", "No")) != "Yes") {
			return f.dot;
		}
		log_admin(`${key_name(f.usr)} has sent ${key_name(M_0)} back to the Lobby.`);
		message_admins(`${key_name(f.usr)} has sent ${key_name(M_0)} back to the Lobby.`);
		(NP = (yield* new_(T("/mob/dead/new_player")))).ckey = M_0.ckey;
		yield* qdel(M_0);
	} else if (rt.at(href_list, "tdome1")) {
		if (!check_rights(8)) {
			return f.dot;
		}
		if ((yield* alert(f.usr, "Confirm?", "Message", "Yes", "No")) != "Yes") {
			return f.dot;
		}
		if (!rt.istype((M_0 = rt.locateIn(f, rt.at(href_list, "tdome1"), rt.world())), T("/mob/living"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living.");
			return f.dot;
		}
		if (rt.istype(M_0, T("/mob/living/silicon/ai"))) {
			to_chat(f.usr, "This cannot be used on instances of type /mob/living/silicon/ai.");
			return f.dot;
		}
		L = M_0;
		for (I of each(L, T("/obj/item"))) {
			yield* L.dropItemToGround(I, 1);
		}
		yield* L.Unconscious(100);
		yield* sleep(5);
		yield* L.forceMove(pick(GLOB.tdome1));
		rt.spawnTail(f, 50, "/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1351", ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2);
		log_admin(`${key_name(f.usr)} has sent ${key_name(L)} to the thunderdome. (Team 1)`);
		message_admins(`${key_name_admin(f.usr)} has sent ${key_name_admin(L)} to the thunderdome. (Team 1)`);
	} else if (rt.at(href_list, "tdome2")) {
		if (!check_rights(8)) {
			return f.dot;
		}
		if ((yield* alert(f.usr, "Confirm?", "Message", "Yes", "No")) != "Yes") {
			return f.dot;
		}
		if (!rt.istype((M_0 = rt.locateIn(f, rt.at(href_list, "tdome2"), rt.world())), T("/mob/living"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living.");
			return f.dot;
		}
		if (rt.istype(M_0, T("/mob/living/silicon/ai"))) {
			to_chat(f.usr, "This cannot be used on instances of type /mob/living/silicon/ai.");
			return f.dot;
		}
		L = M_0;
		I = null;
		for (I of each(L, T("/obj/item"))) {
			yield* L.dropItemToGround(I, 1);
		}
		yield* L.Unconscious(100);
		yield* sleep(5);
		yield* L.forceMove(pick(GLOB.tdome2));
		rt.spawnTail(f, 50, "/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1378", ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2);
		log_admin(`${key_name(f.usr)} has sent ${key_name(L)} to the thunderdome. (Team 2)`);
		message_admins(`${key_name_admin(f.usr)} has sent ${key_name_admin(L)} to the thunderdome. (Team 2)`);
	} else if (rt.at(href_list, "tdomeadmin")) {
		if (!check_rights(8)) {
			return f.dot;
		}
		if ((yield* alert(f.usr, "Confirm?", "Message", "Yes", "No")) != "Yes") {
			return f.dot;
		}
		if (!rt.istype((M_0 = rt.locateIn(f, rt.at(href_list, "tdomeadmin"), rt.world())), T("/mob/living"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living.");
			return f.dot;
		}
		if (rt.istype(M_0, T("/mob/living/silicon/ai"))) {
			to_chat(f.usr, "This cannot be used on instances of type /mob/living/silicon/ai.");
			return f.dot;
		}
		yield* (L = M_0).Unconscious(100);
		yield* sleep(5);
		yield* L.forceMove(pick(GLOB.tdomeadmin));
		rt.spawnTail(f, 50, "/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1402", ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2);
		log_admin(`${key_name(f.usr)} has sent ${key_name(L)} to the thunderdome. (Admin.)`);
		message_admins(`${key_name_admin(f.usr)} has sent ${key_name_admin(L)} to the thunderdome. (Admin.)`);
	} else if (rt.at(href_list, "tdomeobserve")) {
		if (!check_rights(8)) {
			return f.dot;
		}
		if ((yield* alert(f.usr, "Confirm?", "Message", "Yes", "No")) != "Yes") {
			return f.dot;
		}
		if (!rt.istype((M_0 = rt.locateIn(f, rt.at(href_list, "tdomeobserve"), rt.world())), T("/mob/living"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living.");
			return f.dot;
		}
		if (rt.istype(M_0, T("/mob/living/silicon/ai"))) {
			to_chat(f.usr, "This cannot be used on instances of type /mob/living/silicon/ai.");
			return f.dot;
		}
		L = M_0;
		I = null;
		for (I of each(L, T("/obj/item"))) {
			yield* L.dropItemToGround(I, 1);
		}
		if (rt.istype(L, T("/mob/living/carbon/human"))) {
			yield* (observer = L).equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/suit_jacket"), observer)), 14);
			yield* observer.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), observer)), 12);
		}
		yield* L.Unconscious(100);
		yield* sleep(5);
		yield* L.forceMove(pick(GLOB.tdomeobserve));
		rt.spawnTail(f, 50, "/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1433", ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2);
		log_admin(`${key_name(f.usr)} has sent ${key_name(L)} to the thunderdome. (Observer.)`);
		message_admins(`${key_name_admin(f.usr)} has sent ${key_name_admin(L)} to the thunderdome. (Observer.)`);
	} else if (rt.at(href_list, "revive")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!rt.istype((L_0 = rt.locateIn(f, rt.at(href_list, "revive"), rt.world())), T("/mob/living"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living.");
			return f.dot;
		}
		yield* L_0.revive({ full_heal: 1, admin_revive: 1 });
		message_admins(`<span class='danger'>Admin ${key_name_admin(f.usr)} healed / revived ${key_name_admin(L_0)}!</span>`);
		log_admin(`${key_name(f.usr)} healed / Revived ${key_name(L_0)}.`);
	} else if (rt.at(href_list, "makeai")) {
		if (!check_rights(4096)) {
			return f.dot;
		}
		if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "makeai"), rt.world())), T("/mob/living/carbon/human"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/human.");
			return f.dot;
		}
		message_admins(`<span class='danger'>Admin ${key_name_admin(f.usr)} AIized ${key_name_admin(H)}!</span>`);
		log_admin(`${key_name(f.usr)} AIized ${key_name(H)}.`);
		yield* H.AIize();
	} else if (rt.at(href_list, "makealien")) {
		if (!check_rights(4096)) {
			return f.dot;
		}
		if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "makealien"), rt.world())), T("/mob/living/carbon/human"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/human.");
			return f.dot;
		}
		yield* f.usr.client.cmd_admin_alienize(H);
	} else if (rt.at(href_list, "makeslime")) {
		if (!check_rights(4096)) {
			return f.dot;
		}
		if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "makeslime"), rt.world())), T("/mob/living/carbon/human"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/human.");
			return f.dot;
		}
		yield* f.usr.client.cmd_admin_slimeize(H);
	} else if (rt.at(href_list, "makeblob")) {
		if (!check_rights(4096)) {
			return f.dot;
		}
		if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "makeblob"), rt.world())), T("/mob/living/carbon/human"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/human.");
			return f.dot;
		}
		yield* f.usr.client.cmd_admin_blobize(H);
	} else if (rt.at(href_list, "makerobot")) {
		if (!check_rights(4096)) {
			return f.dot;
		}
		if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "makerobot"), rt.world())), T("/mob/living/carbon/human"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/human.");
			return f.dot;
		}
		yield* f.usr.client.cmd_admin_robotize(H);
	} else if (rt.at(href_list, "makeanimal")) {
		if (!check_rights(4096)) {
			return f.dot;
		}
		if (rt.istype((M_0 = rt.locateIn(f, rt.at(href_list, "makeanimal"), rt.world())), T("/mob/dead/new_player"))) {
			to_chat(f.usr, "This cannot be used on instances of type /mob/dead/new_player.");
			return f.dot;
		}
		yield* f.usr.client.cmd_admin_animalize(M_0);
	} else if (rt.at(href_list, "adminplayeropts")) {
		this.show_player_panel((M_0 = rt.locateIn(f, rt.at(href_list, "adminplayeropts"), rt.world())));
	} else if (rt.at(href_list, "adminplayerobservefollow")) {
		if (!rt.istype(f.usr, T("/mob/dead/observer")) && !check_rights(2)) {
			return f.dot;
		}
		AM = rt.locateIn(f, rt.at(href_list, "adminplayerobservefollow"), rt.world());
		C = f.usr.client;
		if (!rt.istype(f.usr, T("/mob/dead/observer"))) {
			yield* C.admin_ghost();
		}
		yield* (A = C.mob).ManualFollow(AM);
	} else if (rt.at(href_list, "adminplayerobservecoodjump")) {
		if (!rt.istype(f.usr, T("/mob/dead/observer")) && !check_rights(2)) {
			return f.dot;
		}
		x = text2num(rt.at(href_list, "X"));
		y = text2num(rt.at(href_list, "Y"));
		z = text2num(rt.at(href_list, "Z"));
		C_3 = f.usr.client;
		if (!rt.istype(f.usr, T("/mob/dead/observer"))) {
			yield* C_3.admin_ghost();
		}
		yield* sleep(2);
		C_3.jumptocoord(x, y, z);
	} else if (rt.at(href_list, "adminchecklaws")) {
		this.output_ai_laws();
	} else if (rt.at(href_list, "admincheckdevilinfo")) {
		this.output_devil_info((M_0 = rt.locateIn(f, rt.at(href_list, "admincheckdevilinfo"), rt.world())));
	} else if (rt.at(href_list, "adminmoreinfo")) {
		if (!ismob((M_0 = rt.locateIn(f, rt.at(href_list, "adminmoreinfo"), GLOB.mob_list)))) {
			to_chat(f.usr, "This can only be used on instances of type /mob.");
			return f.dot;
		}
		location_description = "";
		special_role_description = "";
		health_description = "";
		gender_description = "";
		if (isturf((_T = rt.getStep(f, M_0, 0)))) {
			if (isarea(_T.loc)) {
				if (M_0.loc == _T) {
					$0 = "at coordinates ";
				} else {
					$0 = `in ${M_0.loc} at coordinates `;
				}
				location_description = `(${$0} ${_T.x}, ${_T.y}, ${_T.z} in area <b>${_T.loc}</b>)`;
			} else {
				if (M_0.loc == _T) {
					$0 = "at coordinates ";
				} else {
					$0 = `in ${M_0.loc} at coordinates `;
				}
				location_description = `(${$0} ${_T.x}, ${_T.y}, ${_T.z})`;
			}
		}
		if (M_0.mind) {
			special_role_description = `Role: <b>${M_0.mind.assigned_role}</b>; Antagonist: <font color='red'><b>${M_0.mind.special_role}</b></font>`;
		} else {
			special_role_description = "Role: <i>Mind datum missing</i> Antagonist: <i>Mind datum missing</i>";
		}
		if (rt.istype(M_0, T("/mob/living"))) {
			L_6 = M_0;
			$0 = M_0.stat;
			if ($0 === 0) {
				status = "Alive";
			} else if ($0 === 1) {
				status = "<font color='orange'><b>Unconscious</b></font>";
			} else if ($0 === 2) {
				status = "<font color='red'><b>Dead</b></font>";
			}
			health_description = `Status = ${status}`;
			health_description += `<BR>Oxy: ${L_6.getOxyLoss()} - Tox: ${L_6.getToxLoss()} - Fire: ${L_6.getFireLoss()} - Brute: ${L_6.getBruteLoss()} - Clone: ${L_6.getCloneLoss()} - Brain: ${L_6.getBrainLoss()} - Stamina: ${L_6.getStaminaLoss()}`;
		} else {
			health_description = "This mob type has no health to speak of.";
		}
		$0 = M_0.gender;
		if ($0 === "male" || $0 === "female") {
			gender_description = `${M_0.gender}`;
		} else {
			gender_description = `<font color='red'><b>${M_0.gender}</b></font>`;
		}
		to_chat(this.owner, `<b>Info about ${M_0.name}:</b> `);
		to_chat(this.owner, `Mob type = ${M_0.type}; Gender = ${gender_description} Damage = ${health_description}`);
		$0 = this.owner;
		$1 = M_0.name;
		$2 = M_0.real_name;
		if (M_0.mind) {
			$3 = `${M_0.mind.name}`;
		} else {
			$3 = "";
		}
		to_chat($0, `Name = <b>${$1}</b>; Real_name = ${$2}; Mind_name = ${$3}; Key = <b>${M_0.key}</b>;`);
		to_chat(this.owner, `Location = ${location_description};`);
		to_chat(this.owner, `${special_role_description}`);
		to_chat(this.owner, `${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [M_0])} ${fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [M_0])} ${fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [M_0])} ${fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [M_0])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [M_0])} ${fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [M_0])} ${fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [M_0])} ${fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [M_0])}`);
	} else if (rt.at(href_list, "addjobslot")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		Add = rt.at(href_list, "addjobslot");
		for (job_1 of each(GLOB.SSjob.occupations, T("/datum/job"))) {
			if (job_1.title == Add) {
				job_1.total_positions += 1;
				break;
			}
		}
		yield* this.manage_free_slots();
	} else if (rt.at(href_list, "removejobslot")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		Remove = rt.at(href_list, "removejobslot");
		job_1 = null;
		for (job_1 of each(GLOB.SSjob.occupations, T("/datum/job"))) {
			if (job_1.title == Remove && job_1.total_positions - job_1.current_positions > 0) {
				job_1.total_positions -= 1;
				break;
			}
		}
		yield* this.manage_free_slots();
	} else if (rt.at(href_list, "unlimitjobslot")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		Unlimit = rt.at(href_list, "unlimitjobslot");
		job_1 = null;
		for (job_1 of each(GLOB.SSjob.occupations, T("/datum/job"))) {
			if (job_1.title == Unlimit) {
				job_1.total_positions = -1;
				break;
			}
		}
		yield* this.manage_free_slots();
	} else if (rt.at(href_list, "limitjobslot")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		Limit = rt.at(href_list, "limitjobslot");
		job_1 = null;
		for (job_1 of each(GLOB.SSjob.occupations, T("/datum/job"))) {
			if (job_1.title == Limit) {
				job_1.total_positions = job_1.current_positions;
				break;
			}
		}
		yield* this.manage_free_slots();
	} else if (rt.at(href_list, "adminspawncookie")) {
		if (!check_rights(10)) {
			return f.dot;
		}
		if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "adminspawncookie"), rt.world())), T("/mob/living/carbon/human"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/human.");
			return f.dot;
		}
		cookie = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/cookie"), H));
		if (yield* H.put_in_hands(cookie)) {
			yield* H.update_inv_hands();
		} else {
			yield* qdel(cookie);
			log_admin(`${key_name(H)} has their hands full, so they did not receive their cookie, spawned by ${key_name(this.owner)}.`);
			message_admins(`${key_name(H)} has their hands full, so they did not receive their cookie, spawned by ${key_name(this.owner)}.`);
			return f.dot;
		}
		log_admin(`${key_name(H)} got their cookie, spawned by ${key_name(this.owner)}.`);
		message_admins(`${key_name(H)} got their cookie, spawned by ${key_name(this.owner)}.`);
		to_chat(H, "<span class='adminnotice'>Your prayers have been answered!! You received the <b>best cookie</b>!</span>");
		rt.op(f, "Output", [], [H, rt.rsc("sound/effects/pray_chaplain.ogg")], false);
	} else if (rt.at(href_list, "adminsmite")) {
		if (!check_rights(10)) {
			return f.dot;
		}
		if (!(H = rt.locateIn(f, rt.at(href_list, "adminsmite"), GLOB.mob_list)) || !rt.istype(H, T("/mob/living/carbon/human"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/human");
			return f.dot;
		}
		yield* f.usr.client.smite(H);
	} else if (rt.at(href_list, "CentcommReply")) {
		if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "CentcommReply"), GLOB.mob_list)), T("/mob/living/carbon/human"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/human");
			return f.dot;
		}
		if (!rt.istype(H.ears, T("/obj/item/device/radio/headset"))) {
			to_chat(f.usr, "The person you are trying to contact is not wearing a headset.");
			return f.dot;
		}
		message_admins(`${this.owner} has started answering ${key_name(H)}'s Centcomm request.`);
		if (!(input = (yield* g.op(f, "Prompt", [2], ["", "Outgoing message from Centcom", `Please enter a message to reply to ${key_name(H)} via their headset.`, this.owner, null])))) {
			message_admins(`${this.owner} decided not to answer ${key_name(H)}'s Centcomm request.`);
			return f.dot;
		}
		to_chat(this.owner, `You sent ${input} to ${H} via a secure channel.`);
		log_admin(`${this.owner} replied to ${key_name(H)}'s Centcom message with the message ${input}.`);
		message_admins(`${this.owner} replied to ${key_name(H)}'s Centcom message with: "${input}"`);
		to_chat(H, `You hear something crackle in your ears for a moment before a voice speaks.  "Please stand by for a message from Central Command.  Message as follows. ${input}.  Message ends."`);
	} else if (rt.at(href_list, "SyndicateReply")) {
		if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "SyndicateReply"), rt.world())), T("/mob/living/carbon/human"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob/living/carbon/human.");
			return f.dot;
		}
		if (!rt.istype(H.ears, T("/obj/item/device/radio/headset"))) {
			to_chat(f.usr, "The person you are trying to contact is not wearing a headset.");
			return f.dot;
		}
		message_admins(`${this.owner} has started answering ${key_name(H)}'s syndicate request.`);
		if (!(input = (yield* g.op(f, "Prompt", [2], ["", "Outgoing message from The Syndicate", `Please enter a message to reply to ${key_name(H)} via their headset.`, this.owner, null])))) {
			message_admins(`${this.owner} decided not to answer ${key_name(H)}'s syndicate request.`);
			return f.dot;
		}
		to_chat(this.owner, `You sent ${input} to ${H} via a secure channel.`);
		log_admin(`${this.owner} replied to ${key_name(H)}'s Syndicate message with the message ${input}.`);
		message_admins(`${this.owner} replied to ${key_name(H)}'s Syndicate message with: "${input}"`);
		to_chat(H, `You hear something crackle in your ears for a moment before a voice speaks.  "Please stand by for a message from your benefactor.  Message as follows, agent. ${input}.  Message ends."`);
	} else if (rt.at(href_list, "reject_custom_name")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (rt.istype((charter = rt.locateIn(f, rt.at(href_list, "reject_custom_name"), rt.world())), T("/obj/item/weapon/station_charter"))) {
			yield* charter.reject_proposed(f.usr);
		}
	} else if (rt.at(href_list, "jumpto")) {
		if (!rt.istype(f.usr, T("/mob/dead/observer")) && !check_rights(2)) {
			return f.dot;
		}
		M_0 = rt.locateIn(f, rt.at(href_list, "jumpto"), rt.world());
		yield* f.usr.client.jumptomob(M_0);
	} else if (rt.at(href_list, "getmob")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if ((yield* alert(f.usr, "Confirm?", "Message", "Yes", "No")) != "Yes") {
			return f.dot;
		}
		M_0 = rt.locateIn(f, rt.at(href_list, "getmob"), rt.world());
		yield* f.usr.client.Getmob(M_0);
	} else if (rt.at(href_list, "sendmob")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		M_0 = rt.locateIn(f, rt.at(href_list, "sendmob"), rt.world());
		yield* f.usr.client.sendmob(M_0);
	} else if (rt.at(href_list, "narrateto")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		M_0 = rt.locateIn(f, rt.at(href_list, "narrateto"), rt.world());
		yield* f.usr.client.cmd_admin_direct_narrate(M_0);
	} else if (rt.at(href_list, "subtlemessage")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		M_0 = rt.locateIn(f, rt.at(href_list, "subtlemessage"), rt.world());
		yield* f.usr.client.cmd_admin_subtle_message(M_0);
	} else if (rt.at(href_list, "individuallog")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!ismob((M_0 = rt.locateIn(f, rt.at(href_list, "individuallog"), GLOB.mob_list)))) {
			to_chat(f.usr, "This can only be used on instances of type /mob.");
			return f.dot;
		}
		show_individual_logging_panel(M_0, rt.at(href_list, "log_type"));
	} else if (rt.at(href_list, "languagemenu")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!ismob((M_0 = rt.locateIn(f, rt.at(href_list, "languagemenu"), GLOB.mob_list)))) {
			to_chat(f.usr, "This can only be used on instances of type /mob.");
			return f.dot;
		}
		yield* (H_1 = (yield* M_0.get_language_holder())).open_language_menu(f.usr);
	} else if (rt.at(href_list, "traitor")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!GLOB.SSticker.HasRoundStarted()) {
			yield* alert("The game hasn't started yet!");
			return f.dot;
		}
		if (!ismob((M_0 = rt.locateIn(f, rt.at(href_list, "traitor"), rt.world())))) {
			to_chat(f.usr, "This can only be used on instances of type /mob.");
			return f.dot;
		}
		yield* this.show_traitor_panel(M_0);
	} else {
		if (rt.at(href_list, "create_object")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			return this.create_object(f.usr);
		}
		if (rt.at(href_list, "quick_create_object")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			return (yield* this.quick_create_object(f.usr));
		}
		if (rt.at(href_list, "create_turf")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			return this.create_turf(f.usr);
		}
		if (rt.at(href_list, "create_mob")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			return this.create_mob(f.usr);
		}
		if (rt.at(href_list, "dupe_marked_datum")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			return (yield* DuplicateObject(this.marked_datum, { perfectcopy: 1, newloc: rt.getStep(f, f.usr, 0) }));
		}
		if (rt.at(href_list, "object_list")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			loc = f.usr.loc;
			if (istext(rt.at(href_list, "object_list"))) {
				dirty_paths = list(rt.at(href_list, "object_list"));
			} else if (rt.istype(rt.at(href_list, "object_list"), T("/list"))) {
				dirty_paths = rt.at(href_list, "object_list");
			}
			paths = list();
			for (dirty_path of each(dirty_paths)) {
				if (!(path = text2path(dirty_path))) {
					continue;
				}
				if (!ispath(path, T("/obj")) && !ispath(path, T("/turf")) && !ispath(path, T("/mob"))) {
					continue;
				}
				paths += path;
			}
			if (!paths) {
				yield* alert("The path list you sent is empty.");
				return f.dot;
			}
			if (rt.length(paths) > 5) {
				yield* alert("Select fewer object types, (max 5).");
				return f.dot;
			}
			offset = splittext(rt.at(href_list, "offset"), ",");
			number = max(1, min(text2num(rt.at(href_list, "object_count")), 100));
			if (rt.len(f, offset) > 0) {
				$0 = text2num(rt.index(offset, 1));
			} else {
				$0 = 0;
			}
			X = $0;
			if (rt.len(f, offset) > 1) {
				$0 = text2num(rt.index(offset, 2));
			} else {
				$0 = 0;
			}
			Y = $0;
			if (rt.len(f, offset) > 2) {
				$0 = text2num(rt.index(offset, 3));
			} else {
				$0 = 0;
			}
			Z = $0;
			tmp_dir = rt.at(href_list, "object_dir");
			if (tmp_dir) {
				$0 = text2num(tmp_dir);
			} else {
				$0 = 2;
			}
			if (!(obj_dir = $0) || !rt.isIn(f, obj_dir, list(1, 2, 4, 8, 5, 6, 9, 10))) {
				obj_dir = 2;
			}
			obj_name = sanitize(rt.at(href_list, "object_name"));
			if (!rt.isIn(f, (where = rt.at(href_list, "object_where")), list("onfloor", "inhand", "inmarked"))) {
				where = "onfloor";
			}
			$0 = where;
			if ($0 === "inhand") {
				if (!rt.istype(f.usr, T("/mob/living/carbon")) && !rt.istype(f.usr, T("/mob/living/silicon/robot"))) {
					to_chat(f.usr, "Can only spawn in hand when you're a carbon mob or cyborg.");
					where = "onfloor";
				}
				target_11 = f.usr;
			} else if ($0 === "onfloor") {
				$0 = rt.at(href_list, "offset_type");
				if ($0 === "absolute") {
					target_11 = rt.locate(0 + X, 0 + Y, 0 + Z);
				} else if ($0 === "relative") {
					target_11 = rt.locate(loc.x + X, loc.y + Y, loc.z + Z);
				}
			} else if ($0 === "inmarked") {
				if (!this.marked_datum) {
					to_chat(f.usr, "You don't have any object marked. Abandoning spawn.");
					return f.dot;
				} else if (!rt.istype(this.marked_datum, T("/atom"))) {
					to_chat(f.usr, "The object you have marked cannot be used as a target. Target must be of type /atom. Abandoning spawn.");
					return f.dot;
				} else {
					target_11 = this.marked_datum;
				}
			}
			if (target_11) {
				for (path_13 of each(paths)) {
					i = 0;
					while (i < number) {
						if (rt.isIn(f, path_13, typesof(T("/turf")))) {
							O = target_11;
							if ((N = (yield* O.ChangeTurf(path_13))) && obj_name) {
								N.name = obj_name;
							}
						} else if (O = (yield* new_(path_13, target_11))) {
							O.admin_spawned = 1;
							yield* O.setDir(obj_dir);
							if (obj_name) {
								O.name = obj_name;
								if (ismob(O)) {
									(M_16 = O).real_name = obj_name;
								}
							}
							if (where == "inhand" && rt.istype(f.usr, T("/mob/living")) && rt.istype(O, T("/obj/item"))) {
								L_16 = f.usr;
								I_17 = O;
								yield* L_16.put_in_hands(I_17);
								if (rt.istype(L_16, T("/mob/living/silicon/robot"))) {
									if ((R = L_16).module) {
										yield* R.module.add_module(I_17, 1, 1);
										yield* R.activate_module(I_17);
									}
								}
							}
						}
						i++;
					}
				}
			}
			if (number == 1) {
				log_admin(`${key_name(f.usr)} created a ${english_list(paths)}`);
				path_13 = null;
				for (path_13 of each(paths)) {
					if (ispath(path_13, T("/mob"))) {
						message_admins(`${key_name_admin(f.usr)} created a ${english_list(paths)}`);
						break;
					}
				}
			} else {
				log_admin(`${key_name(f.usr)} created ${number}ea ${english_list(paths)}`);
				path_13 = null;
				for (path_13 of each(paths)) {
					if (ispath(path_13, T("/mob"))) {
						message_admins(`${key_name_admin(f.usr)} created ${number}ea ${english_list(paths)}`);
						break;
					}
				}
			}
			return f.dot;
		} else if (rt.at(href_list, "secrets")) {
			yield* this.Secrets_topic(rt.at(href_list, "secrets"), href_list);
		} else if (rt.at(href_list, "ac_view_wanted")) {
			this.admincaster_screen = 18;
			this.access_news_network();
		} else if (rt.at(href_list, "ac_set_channel_name")) {
			this.admincaster_feed_channel.channel_name = (yield* stripped_input(f.usr, "Provide a Feed Channel Name.", "Network Channel Handler", ""));
			while (findtext(this.admincaster_feed_channel.channel_name, " ") == 1) {
				this.admincaster_feed_channel.channel_name = copytext(this.admincaster_feed_channel.channel_name, 2, lentext(this.admincaster_feed_channel.channel_name) + 1);
			}
			this.access_news_network();
		} else if (rt.at(href_list, "ac_set_channel_lock")) {
			this.admincaster_feed_channel.locked = (!this.admincaster_feed_channel.locked ? 1 : 0);
			this.access_news_network();
		} else if (rt.at(href_list, "ac_submit_new_channel")) {
			check = 0;
			for (FC of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
				if (FC.channel_name == this.admincaster_feed_channel.channel_name) {
					check = 1;
					break;
				}
			}
			if (this.admincaster_feed_channel.channel_name == "" || this.admincaster_feed_channel.channel_name == "[REDACTED]" || check) {
				this.admincaster_screen = 7;
			} else if ((choice = (yield* alert("Please confirm Feed channel creation.", "Network Channel Handler", "Confirm", "Cancel"))) == "Confirm") {
				GLOB.news_network.CreateFeedChannel(this.admincaster_feed_channel.channel_name, this.admin_signature, this.admincaster_feed_channel.locked, 1);
				log_admin(`${key_name(f.usr)} created command feed channel: ${this.admincaster_feed_channel.channel_name}!`);
				this.admincaster_screen = 5;
			}
			this.access_news_network();
		} else if (rt.at(href_list, "ac_set_channel_receiving")) {
			available_channels = list();
			for (F of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
				available_channels += F.channel_name;
			}
			this.admincaster_feed_channel.channel_name = adminscrub((yield* g.op(f, "Prompt", [0], [null, "Network Channel Handler", "Choose receiving Feed Channel.", f.usr, available_channels])));
			this.access_news_network();
		} else if (rt.at(href_list, "ac_set_new_message")) {
			this.admincaster_feed_message.body = adminscrub((yield* g.op(f, "Prompt", [2], ["", "Network Channel Handler", "Write your Feed story.", f.usr, null])));
			while (findtext(this.admincaster_feed_message.returnBody(-1), " ") == 1) {
				this.admincaster_feed_message.body = copytext(this.admincaster_feed_message.returnBody(-1), 2, lentext(this.admincaster_feed_message.returnBody(-1)) + 1);
			}
			this.access_news_network();
		} else if (rt.at(href_list, "ac_submit_new_message")) {
			if (this.admincaster_feed_message.returnBody(-1) == "" || this.admincaster_feed_message.returnBody(-1) == "[REDACTED]" || this.admincaster_feed_channel.channel_name == "") {
				this.admincaster_screen = 6;
			} else {
				yield* GLOB.news_network.SubmitArticle(this.admincaster_feed_message.returnBody(-1), this.admin_signature, this.admincaster_feed_channel.channel_name, null, 1);
				this.admincaster_screen = 4;
			}
			for (NEWSCASTER of each(GLOB.allCasters, T("/obj/machinery/newscaster"))) {
				yield* NEWSCASTER.newsAlert(this.admincaster_feed_channel.channel_name);
			}
			log_admin(`${key_name(f.usr)} submitted a feed story to channel: ${this.admincaster_feed_channel.channel_name}!`);
			this.access_news_network();
		} else if (rt.at(href_list, "ac_create_channel")) {
			this.admincaster_screen = 2;
			this.access_news_network();
		} else if (rt.at(href_list, "ac_create_feed_story")) {
			this.admincaster_screen = 3;
			this.access_news_network();
		} else if (rt.at(href_list, "ac_menu_censor_story")) {
			this.admincaster_screen = 10;
			this.access_news_network();
		} else if (rt.at(href_list, "ac_menu_censor_channel")) {
			this.admincaster_screen = 11;
			this.access_news_network();
		} else if (rt.at(href_list, "ac_menu_wanted")) {
			already_wanted = 0;
			if (GLOB.news_network.wanted_issue.active) {
				already_wanted = 1;
			}
			if (already_wanted) {
				this.admincaster_wanted_message.criminal = GLOB.news_network.wanted_issue.criminal;
				this.admincaster_wanted_message.body = GLOB.news_network.wanted_issue.body;
			}
			this.admincaster_screen = 14;
			this.access_news_network();
		} else if (rt.at(href_list, "ac_set_wanted_name")) {
			this.admincaster_wanted_message.criminal = adminscrub((yield* g.op(f, "Prompt", [2], ["", "Network Security Handler", "Provide the name of the Wanted person.", f.usr, null])));
			while (findtext(this.admincaster_wanted_message.criminal, " ") == 1) {
				this.admincaster_wanted_message.criminal = copytext(this.admincaster_wanted_message.criminal, 2, lentext(this.admincaster_wanted_message.criminal) + 1);
			}
			this.access_news_network();
		} else if (rt.at(href_list, "ac_set_wanted_desc")) {
			this.admincaster_wanted_message.body = adminscrub((yield* g.op(f, "Prompt", [2], ["", "Network Security Handler", "Provide the a description of the Wanted person and any other details you deem important.", f.usr, null])));
			while (findtext(this.admincaster_wanted_message.body, " ") == 1) {
				this.admincaster_wanted_message.body = copytext(this.admincaster_wanted_message.body, 2, lentext(this.admincaster_wanted_message.body) + 1);
			}
			this.access_news_network();
		} else if (rt.at(href_list, "ac_submit_wanted")) {
			input_param = text2num(rt.at(href_list, "ac_submit_wanted"));
			if (this.admincaster_wanted_message.criminal == "" || this.admincaster_wanted_message.body == "") {
				this.admincaster_screen = 16;
			} else {
				if (input_param == 1) {
					$0 = "creation.";
				} else {
					$0 = "edit.";
				}
				if ((choice = (yield* alert(`Please confirm Wanted Issue ${$0}`, "Network Security Handler", "Confirm", "Cancel"))) == "Confirm") {
					if (input_param == 1) {
						yield* GLOB.news_network.submitWanted(this.admincaster_wanted_message.criminal, this.admincaster_wanted_message.body, this.admin_signature, null, 1, 1);
						this.admincaster_screen = 15;
					} else {
						yield* GLOB.news_network.submitWanted(this.admincaster_wanted_message.criminal, this.admincaster_wanted_message.body, this.admin_signature);
						this.admincaster_screen = 19;
					}
					log_admin(`${key_name(f.usr)} issued a Station-wide Wanted Notification for ${this.admincaster_wanted_message.criminal}!`);
				}
			}
			this.access_news_network();
		} else if (rt.at(href_list, "ac_cancel_wanted")) {
			if ((choice_0 = (yield* alert("Please confirm Wanted Issue removal.", "Network Security Handler", "Confirm", "Cancel"))) == "Confirm") {
				GLOB.news_network.deleteWanted();
				this.admincaster_screen = 17;
			}
			this.access_news_network();
		} else if (rt.at(href_list, "ac_censor_channel_author")) {
			(FC_0 = rt.locateIn(f, rt.at(href_list, "ac_censor_channel_author"), rt.world())).toggleCensorAuthor();
			this.access_news_network();
		} else if (rt.at(href_list, "ac_censor_channel_story_author")) {
			(MSG = rt.locateIn(f, rt.at(href_list, "ac_censor_channel_story_author"), rt.world())).toggleCensorAuthor();
			this.access_news_network();
		} else if (rt.at(href_list, "ac_censor_channel_story_body")) {
			(MSG = rt.locateIn(f, rt.at(href_list, "ac_censor_channel_story_body"), rt.world())).toggleCensorBody();
			this.access_news_network();
		} else if (rt.at(href_list, "ac_pick_d_notice")) {
			FC_0 = rt.locateIn(f, rt.at(href_list, "ac_pick_d_notice"), rt.world());
			this.admincaster_feed_channel = FC_0;
			this.admincaster_screen = 13;
			this.access_news_network();
		} else if (rt.at(href_list, "ac_toggle_d_notice")) {
			(FC_0 = rt.locateIn(f, rt.at(href_list, "ac_toggle_d_notice"), rt.world())).toggleCensorDclass();
			this.access_news_network();
		} else if (rt.at(href_list, "ac_view")) {
			this.admincaster_screen = 1;
			this.access_news_network();
		} else if (rt.at(href_list, "ac_setScreen")) {
			this.admincaster_screen = text2num(rt.at(href_list, "ac_setScreen"));
			if (this.admincaster_screen == 0) {
				if (this.admincaster_feed_channel) {
					this.admincaster_feed_channel = (yield* new_(T("/datum/newscaster/feed_channel")));
				}
				if (this.admincaster_feed_message) {
					this.admincaster_feed_message = (yield* new_(T("/datum/newscaster/feed_message")));
				}
				if (this.admincaster_wanted_message) {
					this.admincaster_wanted_message = (yield* new_(T("/datum/newscaster/wanted_message")));
				}
			}
			this.access_news_network();
		} else if (rt.at(href_list, "ac_show_channel")) {
			FC_0 = rt.locateIn(f, rt.at(href_list, "ac_show_channel"), rt.world());
			this.admincaster_feed_channel = FC_0;
			this.admincaster_screen = 9;
			this.access_news_network();
		} else if (rt.at(href_list, "ac_pick_censor_channel")) {
			FC_0 = rt.locateIn(f, rt.at(href_list, "ac_pick_censor_channel"), rt.world());
			this.admincaster_feed_channel = FC_0;
			this.admincaster_screen = 12;
			this.access_news_network();
		} else if (rt.at(href_list, "ac_refresh")) {
			this.access_news_network();
		} else if (rt.at(href_list, "ac_set_signature")) {
			this.admin_signature = adminscrub((yield* g.op(f, "Prompt", [2], ["", "Network Identity Handler", "Provide your desired signature.", f.usr, null])));
			this.access_news_network();
		} else if (rt.at(href_list, "ac_del_comment")) {
			FC_0 = rt.locateIn(f, rt.at(href_list, "ac_del_comment"), rt.world());
			(FM = rt.locateIn(f, rt.at(href_list, "ac_del_comment_msg"), rt.world())).comments -= FC_0;
			yield* qdel(FC_0);
			this.access_news_network();
		} else if (rt.at(href_list, "ac_lock_comment")) {
			(rt.modField(f, (FM_0 = rt.locateIn(f, rt.at(href_list, "ac_lock_comment"), rt.world())), "locked", 1, rt.bitXor));
			this.access_news_network();
		} else if (rt.at(href_list, "check_antagonist")) {
			if (!check_rights(2)) {
				return f.dot;
			}
			yield* f.usr.client.check_antagonists();
		} else if (rt.at(href_list, "kick_all_from_lobby")) {
			if (!check_rights(2)) {
				return f.dot;
			}
			if (GLOB.SSticker.IsRoundInProgress()) {
				if (afkonly = text2num(rt.at(href_list, "afkonly"))) {
					$0 = "AFK";
				} else {
					$0 = "";
				}
				if ((yield* alert(`Are you sure you want to kick all ${$0} clients from the lobby??`, "Message", "Yes", "Cancel")) != "Yes") {
					to_chat(f.usr, "Kick clients from lobby aborted");
					return f.dot;
				}
				if (f.usr.client.holder.fakekey) {
					$0 = "an Administrator";
				} else {
					$0 = `${f.usr.client.ckey}`;
				}
				listkicked = (yield* kick_clients_in_lobby(`<span class='danger'>You were kicked from the lobby by ${$0}.</span>`, afkonly));
				strkicked = "";
				for (name of each(listkicked)) {
					strkicked += `${name}, `;
				}
				$0 = key_name_admin(f.usr);
				if (afkonly) {
					$1 = "all AFK";
				} else {
					$1 = "all";
				}
				$2 = rt.length(listkicked);
				if (strkicked) {
					$3 = strkicked;
				} else {
					$3 = "--";
				}
				message_admins(`${$0} has kicked ${$1} clients from the lobby. ${$2} clients kicked: ${$3}`);
				$0 = key_name(f.usr);
				if (afkonly) {
					$1 = "all AFK";
				} else {
					$1 = "all";
				}
				log_admin(`${$0} has kicked ${$1} clients from the lobby. ${rt.length(listkicked)} clients kicked: ${strkicked ? strkicked : "--"}`);
			} else {
				to_chat(f.usr, "You may only use this when the game is running.");
			}
		} else if (rt.at(href_list, "create_outfit")) {
			if (!check_rights(2)) {
				return f.dot;
			}
			(O_0 = (yield* new_(T("/datum/outfit")))).name = rt.at(href_list, "outfit_name");
			O_0.uniform = text2path(rt.at(href_list, "outfit_uniform"));
			O_0.shoes = text2path(rt.at(href_list, "outfit_shoes"));
			O_0.gloves = text2path(rt.at(href_list, "outfit_gloves"));
			O_0.suit = text2path(rt.at(href_list, "outfit_suit"));
			O_0.head = text2path(rt.at(href_list, "outfit_head"));
			O_0.back = text2path(rt.at(href_list, "outfit_back"));
			O_0.mask = text2path(rt.at(href_list, "outfit_mask"));
			O_0.glasses = text2path(rt.at(href_list, "outfit_glasses"));
			O_0.r_hand = text2path(rt.at(href_list, "outfit_r_hand"));
			O_0.l_hand = text2path(rt.at(href_list, "outfit_l_hand"));
			O_0.suit_store = text2path(rt.at(href_list, "outfit_s_store"));
			O_0.l_pocket = text2path(rt.at(href_list, "outfit_l_pocket"));
			O_0.r_pocket = text2path(rt.at(href_list, "outfit_r_pocket"));
			O_0.id = text2path(rt.at(href_list, "outfit_id"));
			O_0.belt = text2path(rt.at(href_list, "outfit_belt"));
			O_0.ears = text2path(rt.at(href_list, "outfit_ears"));
			GLOB.custom_outfits.Add(O_0);
			message_admins(`${key_name(f.usr)} created "${O_0.name}" outfit!`);
		} else if (rt.at(href_list, "set_selfdestruct_code")) {
			if (!check_rights(2)) {
				return f.dot;
			}
			code = random_nukecode();
			for (SD of each(GLOB.nuke_list, T("/obj/machinery/nuclearbomb/selfdestruct"))) {
				SD.r_code = code;
			}
			message_admins(`${key_name_admin(f.usr)} has set the self-destruct code to "${code}".`);
		} else if (rt.at(href_list, "add_station_goal")) {
			if (!check_rights(2)) {
				return f.dot;
			}
			type_choices = typesof(T("/datum/station_goal"));
			if (!(picked = (yield* g.op(f, "Prompt", [0], [null, null, null, "Choose goal type", rt.bitOr(type_choices, null)])))) {
				return f.dot;
			}
			G = (yield* new_(picked));
			if (picked == T("/datum/station_goal")) {
				if (!(newname = (yield* g.op(f, "Prompt", [3], [null, null, null, "Enter goal name:", null])))) {
					return f.dot;
				}
				G.name = newname;
				if (!(description = (yield* g.op(f, "Prompt", [65], [null, null, null, "Enter centcom message contents:", null])))) {
					return f.dot;
				}
				G.report_message = description;
			}
			message_admins(`${key_name(f.usr)} created "${G.name}" station goal.`);
			GLOB.SSticker.mode.station_goals += G;
			this.modify_goals();
		} else if (rt.at(href_list, "viewruntime")) {
			if (!rt.istype((error_viewer = rt.locateIn(f, rt.at(href_list, "viewruntime"), rt.world())), T("/datum/error_viewer"))) {
				to_chat(f.usr, "<span class='warning'>That runtime viewer no longer exists.</span>");
				return f.dot;
			}
			if (rt.at(href_list, "viewruntime_backto")) {
				yield* error_viewer.show_to(this.owner, rt.locateIn(f, rt.at(href_list, "viewruntime_backto"), rt.world()), rt.at(href_list, "viewruntime_linear"));
			} else {
				yield* error_viewer.show_to(this.owner, null, rt.at(href_list, "viewruntime_linear"));
			}
		} else {
			if (!rt.at(href_list, "showrelatedacc")) return f.dot;
			C_0 = rt.locateIn(f, rt.at(href_list, "client"), GLOB.clients);
			if (rt.at(href_list, "showrelatedacc") == "cid") {
				thing_to_check = C_0.related_accounts_cid;
			} else {
				thing_to_check = C_0.related_accounts_ip;
			}
			thing_to_check = splittext(thing_to_check, ", ");
			dat_2 = list(`Related accounts by ${uppertext(rt.at(href_list, "showrelatedacc"))}:`);
			dat_2 += thing_to_check;
			rt.op(f, "Browse", [], [f.usr, dat_2.Join("<br>"), `window=related_${C_0};size=420x300`], false);
		}
	}
	return f.dot;
}, true);

// a spawn(50) body of /datum/admins/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1433", function* (f: Frame, ahelp_ref: Value, AH: Value, strength: Value, E: Value, event: Value, prompt: Value, adminckey: Value, playerckey: Value, page: Value, banedit: Value, banid: Value, bantype: Value, banckey: Value, banip: Value, bancid: Value, banduration: Value, banjob: Value, banreason: Value, playermob: Value, M: Value, timer: Value, ratio: Value, M_0: Value, delmob: Value, banfolder: Value, key: Value, reason: Value, banfolder_1: Value, reason2: Value, temp: Value, minutes: Value, banned_key: Value, duration: Value, mins: Value, reason_1: Value, dat: Value, counter: Value, jobPos: Value, isbanned_dept: Value, joblist: Value, jobPos_2: Value, notbannedlist: Value, job: Value, mins_3: Value, reason_4: Value, msg: Value, job_6: Value, reason_3: Value, msg_4: Value, job_5: Value, msg_3: Value, job_4: Value, reason_5: Value, target_ckey: Value, message_id: Value, target: Value, query_get_message_edits: Value, edit_log: Value, mins_1: Value, reason_2: Value, AH_4: Value, msg_2: Value, AH_3: Value, dat_0: Value, mode: Value, H: Value, Mo: Value, speech: Value, NP: Value, L: Value, I: Value, observer: Value, L_0: Value, AM: Value, C: Value, A: Value, x: Value, y: Value, z: Value, C_3: Value, location_description: Value, special_role_description: Value, health_description: Value, gender_description: Value, _T: Value, L_6: Value, status: Value, Add: Value, job_1: Value, Remove: Value, Unlimit: Value, Limit: Value, cookie: Value, input: Value, charter: Value, H_1: Value, loc: Value, dirty_paths: Value, paths: Value, dirty_path: Value, path: Value, offset: Value, number: Value, X: Value, Y: Value, Z: Value, tmp_dir: Value, obj_dir: Value, obj_name: Value, target_11: Value, where: Value, path_13: Value, i: Value, O: Value, N: Value, M_16: Value, L_16: Value, I_17: Value, R: Value, check: Value, FC: Value, choice: Value, available_channels: Value, F: Value, NEWSCASTER: Value, already_wanted: Value, input_param: Value, choice_0: Value, FC_0: Value, MSG: Value, FM: Value, FM_0: Value, afkonly: Value, listkicked: Value, strkicked: Value, name: Value, O_0: Value, code: Value, SD: Value, type_choices: Value, picked: Value, G: Value, newname: Value, description: Value, error_viewer: Value, C_0: Value, thing_to_check: Value, dat_2: Value) {
	to_chat(L, "<span class='adminnotice'>You have been sent to the Thunderdome.</span>");
	return null;
});

// a spawn(50) body of /datum/admins/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1402", function* (f: Frame, ahelp_ref: Value, AH: Value, strength: Value, E: Value, event: Value, prompt: Value, adminckey: Value, playerckey: Value, page: Value, banedit: Value, banid: Value, bantype: Value, banckey: Value, banip: Value, bancid: Value, banduration: Value, banjob: Value, banreason: Value, playermob: Value, M: Value, timer: Value, ratio: Value, M_0: Value, delmob: Value, banfolder: Value, key: Value, reason: Value, banfolder_1: Value, reason2: Value, temp: Value, minutes: Value, banned_key: Value, duration: Value, mins: Value, reason_1: Value, dat: Value, counter: Value, jobPos: Value, isbanned_dept: Value, joblist: Value, jobPos_2: Value, notbannedlist: Value, job: Value, mins_3: Value, reason_4: Value, msg: Value, job_6: Value, reason_3: Value, msg_4: Value, job_5: Value, msg_3: Value, job_4: Value, reason_5: Value, target_ckey: Value, message_id: Value, target: Value, query_get_message_edits: Value, edit_log: Value, mins_1: Value, reason_2: Value, AH_4: Value, msg_2: Value, AH_3: Value, dat_0: Value, mode: Value, H: Value, Mo: Value, speech: Value, NP: Value, L: Value, I: Value, observer: Value, L_0: Value, AM: Value, C: Value, A: Value, x: Value, y: Value, z: Value, C_3: Value, location_description: Value, special_role_description: Value, health_description: Value, gender_description: Value, _T: Value, L_6: Value, status: Value, Add: Value, job_1: Value, Remove: Value, Unlimit: Value, Limit: Value, cookie: Value, input: Value, charter: Value, H_1: Value, loc: Value, dirty_paths: Value, paths: Value, dirty_path: Value, path: Value, offset: Value, number: Value, X: Value, Y: Value, Z: Value, tmp_dir: Value, obj_dir: Value, obj_name: Value, target_11: Value, where: Value, path_13: Value, i: Value, O: Value, N: Value, M_16: Value, L_16: Value, I_17: Value, R: Value, check: Value, FC: Value, choice: Value, available_channels: Value, F: Value, NEWSCASTER: Value, already_wanted: Value, input_param: Value, choice_0: Value, FC_0: Value, MSG: Value, FM: Value, FM_0: Value, afkonly: Value, listkicked: Value, strkicked: Value, name: Value, O_0: Value, code: Value, SD: Value, type_choices: Value, picked: Value, G: Value, newname: Value, description: Value, error_viewer: Value, C_0: Value, thing_to_check: Value, dat_2: Value) {
	to_chat(L, "<span class='adminnotice'>You have been sent to the Thunderdome.</span>");
	return null;
});

// a spawn(50) body of /datum/admins/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1378", function* (f: Frame, ahelp_ref: Value, AH: Value, strength: Value, E: Value, event: Value, prompt: Value, adminckey: Value, playerckey: Value, page: Value, banedit: Value, banid: Value, bantype: Value, banckey: Value, banip: Value, bancid: Value, banduration: Value, banjob: Value, banreason: Value, playermob: Value, M: Value, timer: Value, ratio: Value, M_0: Value, delmob: Value, banfolder: Value, key: Value, reason: Value, banfolder_1: Value, reason2: Value, temp: Value, minutes: Value, banned_key: Value, duration: Value, mins: Value, reason_1: Value, dat: Value, counter: Value, jobPos: Value, isbanned_dept: Value, joblist: Value, jobPos_2: Value, notbannedlist: Value, job: Value, mins_3: Value, reason_4: Value, msg: Value, job_6: Value, reason_3: Value, msg_4: Value, job_5: Value, msg_3: Value, job_4: Value, reason_5: Value, target_ckey: Value, message_id: Value, target: Value, query_get_message_edits: Value, edit_log: Value, mins_1: Value, reason_2: Value, AH_4: Value, msg_2: Value, AH_3: Value, dat_0: Value, mode: Value, H: Value, Mo: Value, speech: Value, NP: Value, L: Value, I: Value, observer: Value, L_0: Value, AM: Value, C: Value, A: Value, x: Value, y: Value, z: Value, C_3: Value, location_description: Value, special_role_description: Value, health_description: Value, gender_description: Value, _T: Value, L_6: Value, status: Value, Add: Value, job_1: Value, Remove: Value, Unlimit: Value, Limit: Value, cookie: Value, input: Value, charter: Value, H_1: Value, loc: Value, dirty_paths: Value, paths: Value, dirty_path: Value, path: Value, offset: Value, number: Value, X: Value, Y: Value, Z: Value, tmp_dir: Value, obj_dir: Value, obj_name: Value, target_11: Value, where: Value, path_13: Value, i: Value, O: Value, N: Value, M_16: Value, L_16: Value, I_17: Value, R: Value, check: Value, FC: Value, choice: Value, available_channels: Value, F: Value, NEWSCASTER: Value, already_wanted: Value, input_param: Value, choice_0: Value, FC_0: Value, MSG: Value, FM: Value, FM_0: Value, afkonly: Value, listkicked: Value, strkicked: Value, name: Value, O_0: Value, code: Value, SD: Value, type_choices: Value, picked: Value, G: Value, newname: Value, description: Value, error_viewer: Value, C_0: Value, thing_to_check: Value, dat_2: Value) {
	to_chat(L, "<span class='adminnotice'>You have been sent to the Thunderdome.</span>");
	return null;
});

// a spawn(50) body of /datum/admins/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1351", function* (f: Frame, ahelp_ref: Value, AH: Value, strength: Value, E: Value, event: Value, prompt: Value, adminckey: Value, playerckey: Value, page: Value, banedit: Value, banid: Value, bantype: Value, banckey: Value, banip: Value, bancid: Value, banduration: Value, banjob: Value, banreason: Value, playermob: Value, M: Value, timer: Value, ratio: Value, M_0: Value, delmob: Value, banfolder: Value, key: Value, reason: Value, banfolder_1: Value, reason2: Value, temp: Value, minutes: Value, banned_key: Value, duration: Value, mins: Value, reason_1: Value, dat: Value, counter: Value, jobPos: Value, isbanned_dept: Value, joblist: Value, jobPos_2: Value, notbannedlist: Value, job: Value, mins_3: Value, reason_4: Value, msg: Value, job_6: Value, reason_3: Value, msg_4: Value, job_5: Value, msg_3: Value, job_4: Value, reason_5: Value, target_ckey: Value, message_id: Value, target: Value, query_get_message_edits: Value, edit_log: Value, mins_1: Value, reason_2: Value, AH_4: Value, msg_2: Value, AH_3: Value, dat_0: Value, mode: Value, H: Value, Mo: Value, speech: Value, NP: Value, L: Value, I: Value, observer: Value, L_0: Value, AM: Value, C: Value, A: Value, x: Value, y: Value, z: Value, C_3: Value, location_description: Value, special_role_description: Value, health_description: Value, gender_description: Value, _T: Value, L_6: Value, status: Value, Add: Value, job_1: Value, Remove: Value, Unlimit: Value, Limit: Value, cookie: Value, input: Value, charter: Value, H_1: Value, loc: Value, dirty_paths: Value, paths: Value, dirty_path: Value, path: Value, offset: Value, number: Value, X: Value, Y: Value, Z: Value, tmp_dir: Value, obj_dir: Value, obj_name: Value, target_11: Value, where: Value, path_13: Value, i: Value, O: Value, N: Value, M_16: Value, L_16: Value, I_17: Value, R: Value, check: Value, FC: Value, choice: Value, available_channels: Value, F: Value, NEWSCASTER: Value, already_wanted: Value, input_param: Value, choice_0: Value, FC_0: Value, MSG: Value, FM: Value, FM_0: Value, afkonly: Value, listkicked: Value, strkicked: Value, name: Value, O_0: Value, code: Value, SD: Value, type_choices: Value, picked: Value, G: Value, newname: Value, description: Value, error_viewer: Value, C_0: Value, thing_to_check: Value, dat_2: Value) {
	to_chat(L, "<span class='adminnotice'>You have been sent to the Thunderdome.</span>");
	return null;
});
