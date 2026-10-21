// From code/modules/admin/topic.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/admins/proc/Topic  (code/modules/admin/topic.dm:2)  may sleep
rt.def("/datum/admins/proc/Topic", function* Topic(f: Frame) {
	let ahelp_ref: Value = null, AH: Value = null, strength: Value = null, E: Value = null, event: Value = null, prompt: Value = null, adminckey: Value = null, playerckey: Value = null, page: Value = null, banedit: Value = null, banid: Value = null, bantype: Value = null, banckey: Value = null, banip: Value = null, bancid: Value = null, banduration: Value = null, banjob: Value = null, banreason: Value = null, playermob: Value = null, M: Value = null, timer: Value = null, ratio: Value = null, M_0: Value = null, delmob: Value = null, banfolder: Value = null, key: Value = null, reason: Value = null, banfolder_1: Value = null, reason2: Value = null, temp: Value = null, minutes: Value = null, banned_key: Value = null, duration: Value = null, mins: Value = null, reason_1: Value = null, dat: Value = null, counter: Value = null, jobPos: Value = null, isbanned_dept: Value = null, joblist: Value = null, jobPos_2: Value = null, notbannedlist: Value = null, job: Value = null, mins_3: Value = null, reason_4: Value = null, msg: Value = null, job_6: Value = null, reason_3: Value = null, msg_4: Value = null, job_5: Value = null, msg_3: Value = null, job_4: Value = null, reason_5: Value = null, target_ckey: Value = null, message_id: Value = null, target: Value = null, query_get_message_edits: Value = null, edit_log: Value = null, mins_1: Value = null, reason_2: Value = null, AH_4: Value = null, msg_2: Value = null, AH_3: Value = null, dat_0: Value = null, mode: Value = null, H: Value = null, Mo: Value = null, speech: Value = null, NP: Value = null, L: Value = null, I: Value = null, observer: Value = null, L_0: Value = null, AM: Value = null, C: Value = null, A: Value = null, x: Value = null, y: Value = null, z: Value = null, C_3: Value = null, location_description: Value = null, special_role_description: Value = null, health_description: Value = null, gender_description: Value = null, _T: Value = null, L_6: Value = null, status: Value = null, Add: Value = null, job_1: Value = null, Remove: Value = null, Unlimit: Value = null, Limit: Value = null, cookie: Value = null, input: Value = null, charter: Value = null, H_1: Value = null, loc: Value = null, dirty_paths: Value = null, paths: Value = null, dirty_path: Value = null, path: Value = null, offset: Value = null, number: Value = null, X: Value = null, Y: Value = null, Z: Value = null, tmp_dir: Value = null, obj_dir: Value = null, obj_name: Value = null, target_11: Value = null, where: Value = null, path_13: Value = null, i: Value = null, O: Value = null, N: Value = null, M_16: Value = null, L_16: Value = null, I_17: Value = null, R: Value = null, check: Value = null, FC: Value = null, choice: Value = null, available_channels: Value = null, F: Value = null, NEWSCASTER: Value = null, already_wanted: Value = null, input_param: Value = null, choice_0: Value = null, FC_0: Value = null, MSG: Value = null, FM: Value = null, FM_0: Value = null, afkonly: Value = null, listkicked: Value = null, strkicked: Value = null, name: Value = null, O_0: Value = null, code: Value = null, SD: Value = null, type_choices: Value = null, picked: Value = null, G: Value = null, newname: Value = null, description: Value = null, error_viewer: Value = null, C_0: Value = null, thing_to_check: Value = null, dat_2: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2, $0, $1, $2, $3, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!isEqual(rt.fv(f, "client", live(f.usr)), rt.fv(f, "owner", live(f.src))) || !truthy((yield* g.call(f, P("/proc/check_rights"), null, [0]))))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has attempted to override the admin panel!", [rt.fv(f, "key", live(f.usr))])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ tried to use the admin panel without authorization.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "ahelp"))) {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
			return live(f.dot);
		}
		ahelp_ref = rt.at(live(f.args[1]), "ahelp");
		if (truthy((AH = rt.locateIn(f, live(ahelp_ref), rt.world())))) {
			yield* g.callName(f, live(AH), "Action", [rt.at(live(f.args[1]), "ahelp_action")]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Ticket ＀ has been deleted!", [live(ahelp_ref)])]);
		}
	} else {
		if (truthy(rt.at(live(f.args[1]), "ahelp_tickets"))) {
			yield* g.callName(f, rt.gl("ahelp_tickets"), "BrowseTickets", [(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "ahelp_tickets")]))]);
		} else {
			if (truthy(rt.at(live(f.args[1]), "stickyban"))) {
				yield* g.srcCall(f, "stickyban", rt.at(live(f.args[1]), "stickyban"), live(f.args[1]));
			} else {
				if (truthy(rt.at(live(f.args[1]), "makeAntag"))) {
					if (!truthy(rt.fv(f, "mode", rt.gl("SSticker")))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Not until the round starts!</span>"]);
						return live(f.dot);
					}
					$0 = rt.at(live(f.args[1]), "makeAntag");
					if ($0 === "traitors") {
						if (truthy((yield* g.callName(f, live(f.src), "makeTraitors", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created traitors.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created traitors.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to create traitors. Unfortunately, there were no candidates available.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed to create traitors.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					} else if ($0 === "changelings") {
						if (truthy((yield* g.callName(f, live(f.src), "makeChanglings", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created changelings.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created changelings.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to create changelings. Unfortunately, there were no candidates available.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed to create changelings.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					} else if ($0 === "revs") {
						if (truthy((yield* g.callName(f, live(f.src), "makeRevs", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ started a revolution.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ started a revolution.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to start a revolution. Unfortunately, there were no candidates available.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed to start a revolution.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					} else if ($0 === "cult") {
						if (truthy((yield* g.callName(f, live(f.src), "makeCult", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ started a cult.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ started a cult.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to start a cult. Unfortunately, there were no candidates available.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed to start a cult.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					} else if ($0 === "wizard") {
						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ is creating a wizard...", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						if (truthy((yield* g.callName(f, live(f.src), "makeWizard", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created a wizard.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created a wizard.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to create a wizard. Unfortunately, there were no candidates available.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed to create a wizard.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					} else if ($0 === "nukeops") {
						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ is creating a nuke team...", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						if (truthy((yield* g.callName(f, live(f.src), "makeNukeTeam", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created a nuke team.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created a nuke team.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to create a nuke team. Unfortunately, there were not enough candidates available.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed to create a nuke team.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					} else if ($0 === "ninja") {
						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ spawned a ninja.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ spawned a ninja.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						yield* g.callName(f, live(f.src), "makeSpaceNinja", []);
					} else if ($0 === "aliens") {
						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ started an alien infestation.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ started an alien infestation.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						yield* g.callName(f, live(f.src), "makeAliens", []);
					} else if ($0 === "deathsquad") {
						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ is creating a death squad...", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						if (truthy((yield* g.callName(f, live(f.src), "makeDeathsquad", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created a death squad.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created a death squad.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to create a death squad. Unfortunately, there were not enough candidates available.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed to create a death squad.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					} else if ($0 === "blob") {
						if (!truthy((strength = (yield* g.op(f, "Prompt", [33], [null, 1, "Set Resource Rate", "Set Blob Resource Gain Rate", null]))))) {
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ spawned a blob with base resource gain ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(strength)])]);
						yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ spawned a blob with base resource gain ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(strength)])]);
						yield* g.new_(f, T("/datum/round_event/ghost_role/blob"), [1, live(strength)]);
					} else if ($0 === "gangs") {
						if (truthy((yield* g.callName(f, live(f.src), "makeGangsters", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created gangs.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created gangs.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to create gangs. Unfortunately, there were not enough candidates available.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed create gangs.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					} else if ($0 === "centcom") {
						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ is creating a Centcom response team...", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						if (truthy((yield* g.callName(f, live(f.src), "makeEmergencyresponseteam", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created a Centcom response team.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created a Centcom response team.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to create a Centcom response team. Unfortunately, there were not enough candidates available.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed to create a Centcom response team.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					} else if ($0 === "abductors") {
						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ is creating an abductor team...", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						if (truthy((yield* g.callName(f, live(f.src), "makeAbductorTeam", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created an abductor team.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created an abductor team.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to create an abductor team. Unfortunatly there were not enough candidates available.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed to create an abductor team.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					} else if ($0 === "clockcult") {
						if (truthy((yield* g.callName(f, live(f.src), "makeClockCult", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ started a clockwork cult.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ started a clockwork cult.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to start a clockwork cult. Unfortunately, there were no candidates available.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed to start a clockwork cult.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					} else if ($0 === "revenant") {
						if (truthy((yield* g.callName(f, live(f.src), "makeRevenant", [])))) {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created a revenant.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created a revenant.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						} else {
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ tried to create a revenant. Unfortunately, there were no candidates available.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ failed to create a revenant.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
						}
					}
				} else {
					if (truthy(rt.at(live(f.args[1]), "forceevent"))) {
						if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
							return live(f.dot);
						}
						if (truthy((E = rt.locateIn(f, rt.at(live(f.args[1]), "forceevent"), rt.fv(f, "control", rt.gl("SSevents")))))) {
							if (rt.gt(rt.gv(f, "announceWhen", (event = (yield* g.callName(f, live(E), "runEvent", [])))), 0)) {
								rt.setFv(f, "processing", live(event), 0);
								$0 = (prompt = (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Would you like to alert the crew?", "Alert", "Yes", "No", "Cancel"])));
								if ($0 === "Cancel") {
									yield* g.callName(f, live(event), "kill", []);
									return live(f.dot);
								} else if ($0 === "No") {
									rt.setFv(f, "announceWhen", live(event), -1);
								}
								rt.setFv(f, "processing", live(event), 1);
							}
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has triggered an event. (＀)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.fv(f, "name", live(E))])]);
							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has triggered an event. (＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "name", live(E))])]);
						}
						return live(f.dot);
					} else {
						if (truthy(rt.at(live(f.args[1]), "call_shuttle"))) {
							if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
								return live(f.dot);
							}
							$0 = rt.at(live(f.args[1]), "call_shuttle");
							if ($0 === "1") {
								if ((((truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "idle")) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall")) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call"))) {
									return live(f.dot);
								}
								yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "request", []);
								yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ called the Emergency Shuttle.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
								yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ called the Emergency Shuttle to the station.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
							} else if ($0 === "2") {
								if ((((truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "idle")) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall")) && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call"))) {
									return live(f.dot);
								}
								$0 = rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle")));
								if ($0 === "call") {
									yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "cancel", []);
									yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ sent the Emergency Shuttle back.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
									yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ sent the Emergency Shuttle back.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
								} else {
									yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "cancel", []);
									yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ called the Emergency Shuttle.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
									yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ called the Emergency Shuttle to the station.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
								}
							}
							rt.setAt(live(f.args[1]), "secrets", "check_antagonist");
						} else {
							if (truthy(rt.at(live(f.args[1]), "edit_shuttle_time"))) {
								if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [16])))) {
									return live(f.dot);
								}
								if (!truthy((timer = (yield* g.op(f, "Prompt", [33], [null, (yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", [])), "Edit Shuttle Timeleft", "Enter new shuttle duration (seconds):", null]))))) {
									return live(f.dot);
								}
								yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "setTimer", [multiply(live(timer), 10)]);
								yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ edited the Emergency Shuttle's timeleft to ＀ seconds.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(timer)])]);
								yield* g.call(f, P("/proc/minor_announce"), null, [fmt("The emergency shuttle will reach its destination in ＀ minutes.", [(yield* g.call(f, P("/proc/round"), null, [(yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", [600]))]))])]);
								yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ edited the Emergency Shuttle's timeleft to ＀ seconds.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(timer)])]);
								rt.setAt(live(f.args[1]), "secrets", "check_antagonist");
							} else {
								if (truthy(rt.at(live(f.args[1]), "trigger_centcom_recall"))) {
									if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
										return live(f.dot);
									}
									yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "trigger_centcom_recall", []);
								} else {
									if (truthy(rt.at(live(f.args[1]), "toggle_continuous"))) {
										if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
											return live(f.dot);
										}
										if (!truthy(rt.index(rt.fv(f, "continuous", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")))))) {
											rt.setAt(rt.fv(f, "continuous", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), 1);
										} else {
											rt.setAt(rt.fv(f, "continuous", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), 0);
										}
										$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
										if (truthy(rt.index(rt.fv(f, "continuous", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")))))) {
											$1 = "continue if all antagonists die";
										} else {
											$1 = "end with the antagonists";
										}
										yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ toggled the round to ＀.</span>", [$0, $1])]);
										yield* g.srcCall(f, "check_antagonists");
									} else {
										if (truthy(rt.at(live(f.args[1]), "toggle_midround_antag"))) {
											if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
												return live(f.dot);
											}
											if (!truthy(rt.index(rt.fv(f, "midround_antag", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")))))) {
												rt.setAt(rt.fv(f, "midround_antag", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), 1);
											} else {
												rt.setAt(rt.fv(f, "midround_antag", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), 0);
											}
											$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
											if (truthy(rt.index(rt.fv(f, "midround_antag", rt.gl("config")), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")))))) {
												$1 = "use";
											} else {
												$1 = "skip";
											}
											yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ toggled the round to ＀ the midround antag system.</span>", [$0, $1])]);
											yield* g.srcCall(f, "check_antagonists");
										} else {
											if (truthy(rt.at(live(f.args[1]), "alter_midround_time_limit"))) {
												if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
													return live(f.dot);
												}
												if (!truthy((timer = (yield* g.op(f, "Prompt", [33], [null, rt.fv(f, "midround_antag_time_check", rt.gl("config")), null, "Enter new maximum time", null]))))) {
													return live(f.dot);
												}
												rt.setFv(f, "midround_antag_time_check", rt.gl("config"), live(timer));
												yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ edited the maximum midround antagonist time to ＀ minutes.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(timer)])]);
												yield* g.srcCall(f, "check_antagonists");
											} else {
												if (truthy(rt.at(live(f.args[1]), "alter_midround_life_limit"))) {
													if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
														return live(f.dot);
													}
													if (truthy((ratio = (yield* g.op(f, "Prompt", [32], [null, multiply(rt.fv(f, "midround_antag_life_check", rt.gl("config")), 100), null, "Enter new life ratio", null]))))) {
														rt.setFv(f, "midround_antag_life_check", rt.gl("config"), divide(live(ratio), 100));
													}
													yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ edited the midround antagonist living crew ratio to ＀% alive.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(ratio)])]);
													yield* g.srcCall(f, "check_antagonists");
												} else {
													if (truthy(rt.at(live(f.args[1]), "toggle_noncontinuous_behavior"))) {
														if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
															return live(f.dot);
														}
														if (!truthy(rt.gv(f, "round_ends_with_antag_death", rt.fv(f, "mode", rt.gl("SSticker"))))) {
															rt.setFv(f, "round_ends_with_antag_death", rt.fv(f, "mode", rt.gl("SSticker")), 1);
														} else {
															rt.setFv(f, "round_ends_with_antag_death", rt.fv(f, "mode", rt.gl("SSticker")), 0);
														}
														$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
														if (truthy(rt.gv(f, "round_ends_with_antag_death", rt.fv(f, "mode", rt.gl("SSticker"))))) {
															$1 = "end the round";
														} else {
															$1 = "continue as extended";
														}
														yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ edited the midround antagonist system to ＀ upon failure.", [$0, $1])]);
														yield* g.srcCall(f, "check_antagonists");
													} else {
														if (truthy(rt.at(live(f.args[1]), "delay_round_end"))) {
															if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [16])))) {
																return live(f.dot);
															}
															rt.setFv(f, "delay_end", rt.gl("SSticker"), (!truthy(rt.fv(f, "delay_end", rt.gl("SSticker"))) ? 1 : 0));
															$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]));
															if (truthy(rt.fv(f, "delay_end", rt.gl("SSticker")))) {
																$1 = "delayed the round end";
															} else {
																$1 = "has made the round end normally";
															}
															yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ ＀.", [$0, $1])]);
															$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]));
															if (truthy(rt.fv(f, "delay_end", rt.gl("SSticker")))) {
																$1 = "delayed the round end";
															} else {
																$1 = "has made the round end normally";
															}
															yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ ＀.</span>", [$0, $1])]);
															rt.setAt(live(f.args[1]), "secrets", "check_antagonist");
														} else {
															if (truthy(rt.at(live(f.args[1]), "end_round"))) {
																if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																	return live(f.dot);
																}
																yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ is considering ending the round.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
																if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "This will end the round, are you SURE you want to do this?", "Confirmation", "Yes", "No"])), "Yes")) {
																	if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Final Confirmation: End the round NOW?", "Confirmation", "Yes", "No"])), "Yes")) {
																		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has ended the round.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
																		rt.setFv(f, "force_ending", rt.gl("SSticker"), 1);
																		return live(f.dot);
																	} else {
																		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ decided against ending the round.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
																	}
																} else {
																	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ decided against ending the round.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
																}
															} else {
																if (truthy(rt.at(live(f.args[1]), "simplemake"))) {
																	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																		return live(f.dot);
																	}
																	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [(M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "mob"), rt.world()))])))) {
																		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob."]);
																		return live(f.dot);
																	}
																	delmob = 0;
																	$0 = (yield* g.call(f, P("/proc/alert"), null, ["Delete old mob?", "Message", "Yes", "No", "Cancel"]));
																	if ($0 === "Cancel") {
																		return live(f.dot);
																	} else if ($0 === "Yes") {
																		delmob = 1;
																	}
																	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has used rudimentary transformation on ＀. Transforming to ＀.; deletemob=＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M_0)])), rt.at(live(f.args[1]), "simplemake"), live(delmob)])]);
																	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has used rudimentary transformation on ＀. Transforming to ＀.; deletemob=＀</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M_0)])), rt.at(live(f.args[1]), "simplemake"), live(delmob)])]);
																	$0 = rt.at(live(f.args[1]), "simplemake");
																	if ($0 === "observer") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/dead/observer"), null, null, live(delmob)]);
																	} else if ($0 === "drone") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/carbon/alien/humanoid/drone"), null, null, live(delmob)]);
																	} else if ($0 === "hunter") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/carbon/alien/humanoid/hunter"), null, null, live(delmob)]);
																	} else if ($0 === "queen") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/carbon/alien/humanoid/royal/queen"), null, null, live(delmob)]);
																	} else if ($0 === "praetorian") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/carbon/alien/humanoid/royal/praetorian"), null, null, live(delmob)]);
																	} else if ($0 === "sentinel") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/carbon/alien/humanoid/sentinel"), null, null, live(delmob)]);
																	} else if ($0 === "larva") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/carbon/alien/larva"), null, null, live(delmob)]);
																	} else if ($0 === "human") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/carbon/human"), null, null, live(delmob)]);
																	} else if ($0 === "slime") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/slime"), null, null, live(delmob)]);
																	} else if ($0 === "monkey") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/carbon/monkey"), null, null, live(delmob)]);
																	} else if ($0 === "robot") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/silicon/robot"), null, null, live(delmob)]);
																	} else if ($0 === "cat") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/pet/cat"), null, null, live(delmob)]);
																	} else if ($0 === "runtime") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/pet/cat/Runtime"), null, null, live(delmob)]);
																	} else if ($0 === "corgi") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/pet/dog/corgi"), null, null, live(delmob)]);
																	} else if ($0 === "ian") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/pet/dog/corgi/Ian"), null, null, live(delmob)]);
																	} else if ($0 === "pug") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/pet/dog/pug"), null, null, live(delmob)]);
																	} else if ($0 === "crab") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/crab"), null, null, live(delmob)]);
																	} else if ($0 === "coffee") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/crab/Coffee"), null, null, live(delmob)]);
																	} else if ($0 === "parrot") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/parrot"), null, null, live(delmob)]);
																	} else if ($0 === "polyparrot") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/parrot/Poly"), null, null, live(delmob)]);
																	} else if ($0 === "constructarmored") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/hostile/construct/armored"), null, null, live(delmob)]);
																	} else if ($0 === "constructbuilder") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/hostile/construct/builder"), null, null, live(delmob)]);
																	} else if ($0 === "constructwraith") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/hostile/construct/wraith"), null, null, live(delmob)]);
																	} else if ($0 === "shade") {
																		yield* g.callName(f, live(M_0), "change_mob_type", [T("/mob/living/simple_animal/shade"), null, null, live(delmob)]);
																	}
																} else {
																	if (truthy(rt.at(live(f.args[1]), "unbanf"))) {
																		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4])))) {
																			return live(f.dot);
																		}
																		banfolder = rt.at(live(f.args[1]), "unbanf");
																		rt.setFv(f, "cd", rt.gl("Banlist"), fmt("/base/＀", [live(banfolder)]));
																		key = rt.at(rt.gl("Banlist"), "key");
																		if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), fmt("Are you sure you want to unban ＀?", [live(key)]), "Confirmation", "Yes", "No"])), "Yes")) {
																			if (truthy((yield* g.call(f, P("/proc/RemoveBan"), null, [live(banfolder)])))) {
																				yield* g.srcCall(f, "unbanpanel");
																			} else {
																				yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "This ban has already been lifted / does not exist.", "Error", "Ok"]);
																				yield* g.srcCall(f, "unbanpanel");
																			}
																		}
																	} else {
																		if (truthy(rt.at(live(f.args[1]), "unbane"))) {
																			if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4])))) {
																				return live(f.dot);
																			}
																			yield* g.call(f, P("/proc/UpdateTime"), null, []);
																			reason = null;
																			banfolder_1 = rt.at(live(f.args[1]), "unbane");
																			rt.setFv(f, "cd", rt.gl("Banlist"), fmt("/base/＀", [live(banfolder_1)]));
																			reason2 = rt.at(rt.gl("Banlist"), "reason");
																			temp = rt.at(rt.gl("Banlist"), "temp");
																			minutes = rt.at(rt.gl("Banlist"), "minutes");
																			banned_key = rt.at(rt.gl("Banlist"), "key");
																			rt.setFv(f, "cd", rt.gl("Banlist"), "/base");
																			duration = null;
																			$0 = (yield* g.call(f, P("/proc/alert"), null, ["Temporary Ban?", null, "Yes", "No"]));
																			if ($0 === "Yes") {
																				temp = 1;
																				mins = 0;
																				if (rt.gt(live(minutes), rt.gl("CMinutes"))) {
																					mins = subtract(live(minutes), rt.gl("CMinutes"));
																				}
																				if (truthy(live(mins))) {
																					$0 = live(mins);
																				} else {
																					$0 = 1440;
																				}
																				if (rt.le((mins = (yield* g.op(f, "Prompt", [33], [$0, "Ban time", "How long (in minutes)? (Default: 1440)", live(f.usr), null]))), 0)) {
																					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>＀ is not a valid duration.</span>", [live(mins)])]);
																					return live(f.dot);
																				}
																				duration = (yield* g.call(f, P("/proc/GetExp"), null, [(minutes = add(rt.gl("CMinutes"), live(mins)))]));
																				if (!truthy((reason = (yield* g.op(f, "Prompt", [65], [live(reason2), "Reason", "Please State Reason.", live(f.usr), null]))))) {
																					return live(f.dot);
																				}
																			} else if ($0 === "No") {
																				temp = 0;
																				duration = "Perma";
																				if (!truthy((reason = (yield* g.op(f, "Prompt", [65], [live(reason2), "Reason", "Please State Reason.", live(f.usr), null]))))) {
																					return live(f.dot);
																				}
																			}
																			yield* g.call(f, P("/proc/log_admin_private"), null, [fmt("＀ edited ＀'s ban. Reason: ＀ Duration: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(banned_key), live(reason), live(duration)])]);
																			yield* g.call(f, P("/proc/ban_unban_log_save"), null, [fmt("＀ edited ＀'s ban. Reason: ＀ Duration: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(banned_key), live(reason), live(duration)])]);
																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ edited ＀'s ban. Reason: ＀ Duration: ＀</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(banned_key), live(reason), live(duration)])]);
																			rt.setFv(f, "cd", rt.gl("Banlist"), fmt("/base/＀", [live(banfolder_1)]));
																			rt.op(f, "OutputReference", [rt.R.index], [rt.gl("Banlist"), "reason", live(reason)], false);
																			rt.op(f, "OutputReference", [rt.R.index], [rt.gl("Banlist"), "temp", live(temp)], false);
																			rt.op(f, "OutputReference", [rt.R.index], [rt.gl("Banlist"), "minutes", live(minutes)], false);
																			rt.op(f, "OutputReference", [rt.R.index], [rt.gl("Banlist"), "bannedby", rt.fv(f, "ckey", live(f.usr))], false);
																			rt.setFv(f, "cd", rt.gl("Banlist"), "/base");
																			yield* g.srcCall(f, "unbanpanel");
																		} else {
																			if (truthy(rt.at(live(f.args[1]), "boot2"))) {
																				if (truthy((yield* g.call(f, P("/proc/ismob"), null, [(M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "boot2"), rt.world()))])))) {
																					if (!truthy((yield* g.call(f, P("/proc/check_if_greater_rights_than"), null, [rt.fv(f, "client", live(M_0))])))) {
																						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Error: They have more rights than you do.</span>"]);
																						return live(f.dot);
																					}
																					$0 = live(M_0);
																					if (truthy(rt.gv(f, "fakekey", rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
																						$1 = "an Administrator";
																					} else {
																						$1 = fmt("＀", [rt.gv(f, "ckey", rt.fv(f, "client", live(f.usr)))]);
																					}
																					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='danger'>You have been kicked from the server by ＀.</span>", [$1])]);
																					yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ kicked ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M_0)]))])]);
																					yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ kicked ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M_0)]))])]);
																					yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "client", live(M_0))]);
																				}
																			} else {
																				if (truthy(rt.at(live(f.args[1]), "newban"))) {
																					if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4])))) {
																						return live(f.dot);
																					}
																					if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [(M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "newban"), rt.world()))])))) {
																						return live(f.dot);
																					}
																					if ((truthy(rt.fv(f, "client", live(M_0))) && truthy(rt.gv(f, "holder", rt.fv(f, "client", live(M_0)))))) {
																						return live(f.dot);
																					}
																					$0 = (yield* g.call(f, P("/proc/alert"), null, ["Temporary Ban?", null, "Yes", "No", "Cancel"]));
																					if ($0 === "Yes") {
																						if (rt.le((mins_1 = (yield* g.op(f, "Prompt", [33], [1440, "Ban time", "How long (in minutes)?", live(f.usr), null]))), 0)) {
																							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>＀ is not a valid duration.</span>", [live(mins_1)])]);
																							return live(f.dot);
																						}
																						if (!truthy((reason_2 = (yield* g.op(f, "Prompt", [65], [null, "Reason", "Please State Reason.", live(f.usr), null]))))) {
																							return live(f.dot);
																						}
																						yield* g.call(f, P("/proc/AddBan"), null, [rt.fv(f, "ckey", live(M_0)), rt.fv(f, "computer_id", live(M_0)), live(reason_2), rt.fv(f, "ckey", live(f.usr)), 1, live(mins_1)]);
																						yield* g.call(f, P("/proc/ban_unban_log_save"), null, [fmt("＀ has banned ＀. - Reason: ＀ - This will be removed in ＀ minutes.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M_0)])), live(reason_2), live(mins_1)])]);
																						yield* g.call(f, P("/proc/to_chat"), null, [live(M_0), fmt("<span class='boldannounce'><BIG>You have been banned by ＀.\nReason: ＀</BIG></span>", [rt.gv(f, "ckey", rt.fv(f, "client", live(f.usr))), live(reason_2)])]);
																						yield* g.call(f, P("/proc/to_chat"), null, [live(M_0), fmt("<span class='danger'>This is a temporary ban, it will be removed in ＀ minutes.</span>", [live(mins_1)])]);
																						if (truthy(rt.fv(f, "banappeals", rt.gl("config")))) {
																							yield* g.call(f, P("/proc/to_chat"), null, [live(M_0), fmt("<span class='danger'>To try to resolve this matter head to ＀</span>", [rt.fv(f, "banappeals", rt.gl("config"))])]);
																						} else {
																							yield* g.call(f, P("/proc/to_chat"), null, [live(M_0), "<span class='danger'>No ban appeals URL has been set.</span>"]);
																						}
																						yield* g.call(f, P("/proc/log_admin_private"), null, [fmt("＀ has banned ＀.\nReason: ＀\nThis will be removed in ＀ minutes.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "ckey", live(M_0)), (yield* g.call(f, P("/proc/key_name"), null, [live(M_0)])), live(mins_1)])]);
																						yield* g.call(f, P("/proc/message_admins"), null, [(msg_3 = fmt("<span class='adminnotice'>＀ has banned ＀.\nReason: ＀\nThis will be removed in ＀ minutes.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M_0)])), live(reason_2), live(mins_1)]))]);
																						if (truthy(rt.fv(f, "client", live(M_0)))) {
																							$0 = rt.gv(f, "current_ticket", rt.fv(f, "client", live(M_0)));
																						} else {
																							$0 = null;
																						}
																						if (truthy((AH_4 = $0))) {
																							yield* g.callName(f, live(AH_4), "Resolve", []);
																						}
																						yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "client", live(M_0))]);
																					} else if ($0 === "No") {
																						if (!truthy((reason_1 = (yield* g.op(f, "Prompt", [65], [null, "Reason", "Please State Reason.", live(f.usr), null]))))) {
																							return live(f.dot);
																						}
																						$0 = (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "IP ban?", null, "Yes", "No", "Cancel"]));
																						if ($0 === "Cancel") {
																							return live(f.dot);
																						} else if ($0 === "Yes") {
																							yield* g.call(f, P("/proc/AddBan"), null, [rt.fv(f, "ckey", live(M_0)), rt.fv(f, "computer_id", live(M_0)), live(reason_1), rt.fv(f, "ckey", live(f.usr)), 0, 0, rt.fv(f, "lastKnownIP", live(M_0))]);
																						} else if ($0 === "No") {
																							yield* g.call(f, P("/proc/AddBan"), null, [rt.fv(f, "ckey", live(M_0)), rt.fv(f, "computer_id", live(M_0)), live(reason_1), rt.fv(f, "ckey", live(f.usr)), 0, 0]);
																						}
																						yield* g.call(f, P("/proc/to_chat"), null, [live(M_0), fmt("<span class='boldannounce'><BIG>You have been banned by ＀.\nReason: ＀</BIG></span>", [rt.gv(f, "ckey", rt.fv(f, "client", live(f.usr))), live(reason_1)])]);
																						yield* g.call(f, P("/proc/to_chat"), null, [live(M_0), "<span class='danger'>This is a permanent ban.</span>"]);
																						if (truthy(rt.fv(f, "banappeals", rt.gl("config")))) {
																							yield* g.call(f, P("/proc/to_chat"), null, [live(M_0), fmt("<span class='danger'>To try to resolve this matter head to ＀</span>", [rt.fv(f, "banappeals", rt.gl("config"))])]);
																						} else {
																							yield* g.call(f, P("/proc/to_chat"), null, [live(M_0), "<span class='danger'>No ban appeals URL has been set.</span>"]);
																						}
																						yield* g.call(f, P("/proc/ban_unban_log_save"), null, [fmt("＀ has permabanned ＀. - Reason: ＀ - This is a permanent ban.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M_0)])), live(reason_1)])]);
																						yield* g.call(f, P("/proc/log_admin_private"), null, [fmt("＀ has banned ＀.\nReason: ＀\nThis is a permanent ban.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M_0)])), live(reason_1)])]);
																						yield* g.call(f, P("/proc/message_admins"), null, [(msg_2 = fmt("<span class='adminnotice'>＀ has banned ＀.\nReason: ＀\nThis is a permanent ban.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M_0)])), live(reason_1)]))]);
																						if (truthy(rt.fv(f, "client", live(M_0)))) {
																							$0 = rt.gv(f, "current_ticket", rt.fv(f, "client", live(M_0)));
																						} else {
																							$0 = null;
																						}
																						if (truthy((AH_3 = $0))) {
																							yield* g.callName(f, live(AH_3), "Resolve", []);
																						}
																						yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "client", live(M_0))]);
																					} else if ($0 === "Cancel") {
																						return live(f.dot);
																					}
																				} else {
																					if (truthy(rt.at(live(f.args[1]), "mute"))) {
																						if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																							return live(f.dot);
																						}
																						yield* g.call(f, P("/proc/cmd_admin_mute"), null, [rt.at(live(f.args[1]), "mute"), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "mute_type")]))]);
																					} else {
																						if (truthy(rt.at(live(f.args[1]), "c_mode"))) {
																							if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																								return live(f.dot);
																							}
																							if (truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
																								return (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "The game has already started.", null, null, null, null]));
																							}
																							dat_0 = "<B>What mode do you wish to play?</B><HR>";
																							mode = null;
																							rt.forList(f, 0, rt.fv(f, "modes", rt.gl("config")));
																							while (($e = rt.next(f, 0)) !== undefined) {
																								mode = $e;
																								dat_0 = rt.modify(live(dat_0), fmt("<A href='?src=＃;c_mode2=＀'>＀</A><br>", [live(f.src), live(mode), rt.index(rt.fv(f, "mode_names", rt.gl("config")), live(mode))]), add);
																							}
																							rt.endFor(f, 0);
																							dat_0 = rt.modify(live(dat_0), fmt("<A href='?src=＃;c_mode2=secret'>Secret</A><br>", [live(f.src)]), add);
																							dat_0 = rt.modify(live(dat_0), fmt("<A href='?src=＃;c_mode2=random'>Random</A><br>", [live(f.src)]), add);
																							dat_0 = rt.modify(live(dat_0), fmt("Now: ＀", [rt.gl("master_mode")]), add);
																							rt.op(f, "Browse", [], [live(f.usr), live(dat_0), "window=c_mode"], false);
																						} else {
																							if (truthy(rt.at(live(f.args[1]), "f_secret"))) {
																								if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																									return live(f.dot);
																								}
																								if (truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
																									return (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "The game has already started.", null, null, null, null]));
																								}
																								if (!isEqual(rt.gl("master_mode"), "secret")) {
																									return (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "The game mode has to be secret!", null, null, null, null]));
																								}
																								dat_0 = "<B>What game mode do you want to force secret to be? Use this if you want to change the game mode, but want the players to believe it's secret. This will only work if the current game mode is secret.</B><HR>";
																								mode = null;
																								rt.forList(f, 0, rt.fv(f, "modes", rt.gl("config")));
																								while (($e = rt.next(f, 0)) !== undefined) {
																									mode = $e;
																									dat_0 = rt.modify(live(dat_0), fmt("<A href='?src=＃;f_secret2=＀'>＀</A><br>", [live(f.src), live(mode), rt.index(rt.fv(f, "mode_names", rt.gl("config")), live(mode))]), add);
																								}
																								rt.endFor(f, 0);
																								dat_0 = rt.modify(live(dat_0), fmt("<A href='?src=＃;f_secret2=secret'>Random (default)</A><br>", [live(f.src)]), add);
																								dat_0 = rt.modify(live(dat_0), fmt("Now: ＀", [rt.gl("secret_force_mode")]), add);
																								rt.op(f, "Browse", [], [live(f.usr), live(dat_0), "window=f_secret"], false);
																							} else {
																								if (truthy(rt.at(live(f.args[1]), "c_mode2"))) {
																									if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [18])))) {
																										return live(f.dot);
																									}
																									if (truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
																										return (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "The game has already started.", null, null, null, null]));
																									}
																									rt.setGl("master_mode", rt.at(live(f.args[1]), "c_mode2"));
																									yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ set the mode as ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.gl("master_mode")])]);
																									yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ set the mode as ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.gl("master_mode")])]);
																									yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='adminnotice'><b>The mode is now: ＀</b></span>", [rt.gl("master_mode")])]);
																									yield* g.srcCall(f, "Game");
																									yield* g.callName(f, rt.gl("SSticker"), "save_mode", [rt.gl("master_mode")]);
																									yield* g.callSelf(f, [live(f.args[0]), rt.alist(f, ["c_mode", 1])]);
																								} else {
																									if (truthy(rt.at(live(f.args[1]), "f_secret2"))) {
																										if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [18])))) {
																											return live(f.dot);
																										}
																										if (truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
																											return (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "The game has already started.", null, null, null, null]));
																										}
																										if (!isEqual(rt.gl("master_mode"), "secret")) {
																											return (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "The game mode has to be secret!", null, null, null, null]));
																										}
																										rt.setGl("secret_force_mode", rt.at(live(f.args[1]), "f_secret2"));
																										yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ set the forced secret mode as ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.gl("secret_force_mode")])]);
																										yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ set the forced secret mode as ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.gl("secret_force_mode")])]);
																										yield* g.srcCall(f, "Game");
																										yield* g.callSelf(f, [live(f.args[0]), rt.alist(f, ["f_secret", 1])]);
																									} else {
																										if (truthy(rt.at(live(f.args[1]), "monkeyone"))) {
																											if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																												return live(f.dot);
																											}
																											if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(f.args[1]), "monkeyone"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																												yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/human."]);
																												return live(f.dot);
																											}
																											yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ attempting to monkeyize ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(H)]))])]);
																											yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ attempting to monkeyize ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(H)]))])]);
																											yield* g.callName(f, live(H), "monkeyize", []);
																										} else {
																											if (truthy(rt.at(live(f.args[1]), "humanone"))) {
																												if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																													return live(f.dot);
																												}
																												if (!truthy((rt.istype((Mo = rt.locateIn(f, rt.at(live(f.args[1]), "humanone"), rt.world())), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
																													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/monkey."]);
																													return live(f.dot);
																												}
																												yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ attempting to humanize ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(Mo)]))])]);
																												yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ attempting to humanize ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(Mo)]))])]);
																												yield* g.callName(f, live(Mo), "humanize", []);
																											} else {
																												if (truthy(rt.at(live(f.args[1]), "corgione"))) {
																													if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																														return live(f.dot);
																													}
																													if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(f.args[1]), "corgione"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																														yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/human."]);
																														return live(f.dot);
																													}
																													yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ attempting to corgize ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(H)]))])]);
																													yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ attempting to corgize ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(H)]))])]);
																													yield* g.callName(f, live(H), "corgize", []);
																												} else {
																													if (truthy(rt.at(live(f.args[1]), "forcespeech"))) {
																														if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
																															return live(f.dot);
																														}
																														if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [(M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "forcespeech"), rt.world()))])))) {
																															yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "this can only be used on instances of type /mob."]);
																														}
																														if (!truthy((speech = (yield* g.op(f, "Prompt", [2], [null, "", "Force speech", fmt("What will ＀ say?.", [(yield* g.call(f, P("/proc/key_name"), null, [live(M_0)]))]), null]))))) {
																															return live(f.dot);
																														}
																														yield* g.callName(f, live(M_0), "say", [live(speech)]);
																														speech = (yield* g.call(f, P("/proc/sanitize"), null, [live(speech)]));
																														yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ forced ＀ to say: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M_0)])), live(speech)])]);
																														yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ forced ＀ to say: ＀</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M_0)])), live(speech)])]);
																													} else {
																														if (truthy(rt.at(live(f.args[1]), "sendtoprison"))) {
																															if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																return live(f.dot);
																															}
																															if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [(M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "sendtoprison"), rt.world()))])))) {
																																yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob."]);
																																return live(f.dot);
																															}
																															if (truthy((rt.istype(live(M_0), T("/mob/living/silicon/ai")) ? 1 : 0))) {
																																yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This cannot be used on instances of type /mob/living/silicon/ai."]);
																																return live(f.dot);
																															}
																															if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), fmt("Send ＀ to Prison?", [(yield* g.call(f, P("/proc/key_name"), null, [live(M_0)]))]), "Message", "Yes", "No"])), "Yes")) {
																																return live(f.dot);
																															}
																															rt.setFv(f, "loc", live(M_0), rt.op(f, "PickUnweighted", [1], [rt.gl("prisonwarp")]));
																															yield* g.call(f, P("/proc/to_chat"), null, [live(M_0), "<span class='adminnotice'>You have been sent to Prison!</span>"]);
																															yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has sent ＀ to Prison!", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M_0)]))])]);
																															yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has sent ＀ Prison!", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M_0)]))])]);
																														} else {
																															if (truthy(rt.at(live(f.args[1]), "sendbacktolobby"))) {
																																if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																	return live(f.dot);
																																}
																																if (!truthy((rt.istype((M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "sendbacktolobby"), rt.world())), T("/mob/dead/observer")) ? 1 : 0))) {
																																	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You can only send ghost players back to the Lobby.</span>"]);
																																	return live(f.dot);
																																}
																																if (!truthy(rt.fv(f, "client", live(M_0)))) {
																																	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ doesn't seem to have an active client.</span>", [live(M_0)])]);
																																	return live(f.dot);
																																}
																																if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), fmt("Send ＀ back to Lobby?", [(yield* g.call(f, P("/proc/key_name"), null, [live(M_0)]))]), "Message", "Yes", "No"])), "Yes")) {
																																	return live(f.dot);
																																}
																																yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has sent ＀ back to the Lobby.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M_0)]))])]);
																																yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has sent ＀ back to the Lobby.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M_0)]))])]);
																																rt.setFv(f, "ckey", (NP = (yield* g.new_(f, T("/mob/dead/new_player"), []))), rt.fv(f, "ckey", live(M_0)));
																																yield* g.call(f, P("/proc/qdel"), null, [live(M_0)]);
																															} else {
																																if (truthy(rt.at(live(f.args[1]), "tdome1"))) {
																																	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
																																		return live(f.dot);
																																	}
																																	if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Confirm?", "Message", "Yes", "No"])), "Yes")) {
																																		return live(f.dot);
																																	}
																																	if (!truthy((rt.istype((M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "tdome1"), rt.world())), T("/mob/living")) ? 1 : 0))) {
																																		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living."]);
																																		return live(f.dot);
																																	}
																																	if (truthy((rt.istype(live(M_0), T("/mob/living/silicon/ai")) ? 1 : 0))) {
																																		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This cannot be used on instances of type /mob/living/silicon/ai."]);
																																		return live(f.dot);
																																	}
																																	L = live(M_0);
																																	I = null;
																																	rt.forList(f, 0, live(L), T("/obj/item"));
																																	while (($e = rt.next(f, 0)) !== undefined) {
																																		I = $e;
																																		yield* g.callName(f, live(L), "dropItemToGround", [live(I), 1]);
																																	}
																																	rt.endFor(f, 0);
																																	yield* g.callName(f, live(L), "Unconscious", [100]);
																																	yield* g.call(f, P("/proc/sleep"), null, [5]);
																																	yield* g.callName(f, live(L), "forceMove", [rt.op(f, "PickUnweighted", [1], [rt.gl("tdome1")])]);
																																	rt.spawnTail(f, 50, "/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1351", ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2);
																																	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has sent ＀ to the thunderdome. (Team 1)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(L)]))])]);
																																	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has sent ＀ to the thunderdome. (Team 1)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(L)]))])]);
																																} else {
																																	if (truthy(rt.at(live(f.args[1]), "tdome2"))) {
																																		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
																																			return live(f.dot);
																																		}
																																		if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Confirm?", "Message", "Yes", "No"])), "Yes")) {
																																			return live(f.dot);
																																		}
																																		if (!truthy((rt.istype((M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "tdome2"), rt.world())), T("/mob/living")) ? 1 : 0))) {
																																			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living."]);
																																			return live(f.dot);
																																		}
																																		if (truthy((rt.istype(live(M_0), T("/mob/living/silicon/ai")) ? 1 : 0))) {
																																			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This cannot be used on instances of type /mob/living/silicon/ai."]);
																																			return live(f.dot);
																																		}
																																		L = live(M_0);
																																		I = null;
																																		rt.forList(f, 0, live(L), T("/obj/item"));
																																		while (($e = rt.next(f, 0)) !== undefined) {
																																			I = $e;
																																			yield* g.callName(f, live(L), "dropItemToGround", [live(I), 1]);
																																		}
																																		rt.endFor(f, 0);
																																		yield* g.callName(f, live(L), "Unconscious", [100]);
																																		yield* g.call(f, P("/proc/sleep"), null, [5]);
																																		yield* g.callName(f, live(L), "forceMove", [rt.op(f, "PickUnweighted", [1], [rt.gl("tdome2")])]);
																																		rt.spawnTail(f, 50, "/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1378", ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2);
																																		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has sent ＀ to the thunderdome. (Team 2)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(L)]))])]);
																																		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has sent ＀ to the thunderdome. (Team 2)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(L)]))])]);
																																	} else {
																																		if (truthy(rt.at(live(f.args[1]), "tdomeadmin"))) {
																																			if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
																																				return live(f.dot);
																																			}
																																			if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Confirm?", "Message", "Yes", "No"])), "Yes")) {
																																				return live(f.dot);
																																			}
																																			if (!truthy((rt.istype((M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "tdomeadmin"), rt.world())), T("/mob/living")) ? 1 : 0))) {
																																				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living."]);
																																				return live(f.dot);
																																			}
																																			if (truthy((rt.istype(live(M_0), T("/mob/living/silicon/ai")) ? 1 : 0))) {
																																				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This cannot be used on instances of type /mob/living/silicon/ai."]);
																																				return live(f.dot);
																																			}
																																			yield* g.callName(f, (L = live(M_0)), "Unconscious", [100]);
																																			yield* g.call(f, P("/proc/sleep"), null, [5]);
																																			yield* g.callName(f, live(L), "forceMove", [rt.op(f, "PickUnweighted", [1], [rt.gl("tdomeadmin")])]);
																																			rt.spawnTail(f, 50, "/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1402", ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2);
																																			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has sent ＀ to the thunderdome. (Admin.)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(L)]))])]);
																																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has sent ＀ to the thunderdome. (Admin.)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(L)]))])]);
																																		} else {
																																			if (truthy(rt.at(live(f.args[1]), "tdomeobserve"))) {
																																				if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
																																					return live(f.dot);
																																				}
																																				if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Confirm?", "Message", "Yes", "No"])), "Yes")) {
																																					return live(f.dot);
																																				}
																																				if (!truthy((rt.istype((M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "tdomeobserve"), rt.world())), T("/mob/living")) ? 1 : 0))) {
																																					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living."]);
																																					return live(f.dot);
																																				}
																																				if (truthy((rt.istype(live(M_0), T("/mob/living/silicon/ai")) ? 1 : 0))) {
																																					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This cannot be used on instances of type /mob/living/silicon/ai."]);
																																					return live(f.dot);
																																				}
																																				L = live(M_0);
																																				I = null;
																																				rt.forList(f, 0, live(L), T("/obj/item"));
																																				while (($e = rt.next(f, 0)) !== undefined) {
																																					I = $e;
																																					yield* g.callName(f, live(L), "dropItemToGround", [live(I), 1]);
																																				}
																																				rt.endFor(f, 0);
																																				if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																					yield* g.callName(f, (observer = live(L)), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/suit_jacket"), [live(observer)])), 14]);
																																					yield* g.callName(f, live(observer), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(observer)])), 12]);
																																				}
																																				yield* g.callName(f, live(L), "Unconscious", [100]);
																																				yield* g.call(f, P("/proc/sleep"), null, [5]);
																																				yield* g.callName(f, live(L), "forceMove", [rt.op(f, "PickUnweighted", [1], [rt.gl("tdomeobserve")])]);
																																				rt.spawnTail(f, 50, "/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1433", ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2);
																																				yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has sent ＀ to the thunderdome. (Observer.)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(L)]))])]);
																																				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has sent ＀ to the thunderdome. (Observer.)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(L)]))])]);
																																			} else {
																																				if (truthy(rt.at(live(f.args[1]), "revive"))) {
																																					if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																						return live(f.dot);
																																					}
																																					if (!truthy((rt.istype((L_0 = rt.locateIn(f, rt.at(live(f.args[1]), "revive"), rt.world())), T("/mob/living")) ? 1 : 0))) {
																																						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living."]);
																																						return live(f.dot);
																																					}
																																					yield* g.callName(f, live(L_0), "revive", ["full_heal", 1, "admin_revive", 1], rt.Args.Named);
																																					yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='danger'>Admin ＀ healed / revived ＀!</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(L_0)]))])]);
																																					yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ healed / Revived ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(L_0)]))])]);
																																				} else {
																																					if (truthy(rt.at(live(f.args[1]), "makeai"))) {
																																						if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																							return live(f.dot);
																																						}
																																						if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(f.args[1]), "makeai"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/human."]);
																																							return live(f.dot);
																																						}
																																						yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='danger'>Admin ＀ AIized ＀!</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(H)]))])]);
																																						yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ AIized ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(H)]))])]);
																																						yield* g.callName(f, live(H), "AIize", []);
																																					} else {
																																						if (truthy(rt.at(live(f.args[1]), "makealien"))) {
																																							if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																								return live(f.dot);
																																							}
																																							if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(f.args[1]), "makealien"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/human."]);
																																								return live(f.dot);
																																							}
																																							yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "cmd_admin_alienize", [live(H)]);
																																						} else {
																																							if (truthy(rt.at(live(f.args[1]), "makeslime"))) {
																																								if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																									return live(f.dot);
																																								}
																																								if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(f.args[1]), "makeslime"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/human."]);
																																									return live(f.dot);
																																								}
																																								yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "cmd_admin_slimeize", [live(H)]);
																																							} else {
																																								if (truthy(rt.at(live(f.args[1]), "makeblob"))) {
																																									if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																										return live(f.dot);
																																									}
																																									if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(f.args[1]), "makeblob"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																										yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/human."]);
																																										return live(f.dot);
																																									}
																																									yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "cmd_admin_blobize", [live(H)]);
																																								} else {
																																									if (truthy(rt.at(live(f.args[1]), "makerobot"))) {
																																										if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																											return live(f.dot);
																																										}
																																										if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(f.args[1]), "makerobot"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																											yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/human."]);
																																											return live(f.dot);
																																										}
																																										yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "cmd_admin_robotize", [live(H)]);
																																									} else {
																																										if (truthy(rt.at(live(f.args[1]), "makeanimal"))) {
																																											if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																												return live(f.dot);
																																											}
																																											if (truthy((rt.istype((M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "makeanimal"), rt.world())), T("/mob/dead/new_player")) ? 1 : 0))) {
																																												yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This cannot be used on instances of type /mob/dead/new_player."]);
																																												return live(f.dot);
																																											}
																																											yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "cmd_admin_animalize", [live(M_0)]);
																																										} else {
																																											if (truthy(rt.at(live(f.args[1]), "adminplayeropts"))) {
																																												yield* g.srcCall(f, "show_player_panel", (M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "adminplayeropts"), rt.world())));
																																											} else {
																																												if (truthy(rt.at(live(f.args[1]), "adminplayerobservefollow"))) {
																																													if ((!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/check_rights"), null, [2]))))) {
																																														return live(f.dot);
																																													}
																																													AM = rt.locateIn(f, rt.at(live(f.args[1]), "adminplayerobservefollow"), rt.world());
																																													C = rt.fv(f, "client", live(f.usr));
																																													if (!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) {
																																														yield* g.callName(f, live(C), "admin_ghost", []);
																																													}
																																													yield* g.callName(f, (A = rt.fv(f, "mob", live(C))), "ManualFollow", [live(AM)]);
																																												} else {
																																													if (truthy(rt.at(live(f.args[1]), "adminplayerobservecoodjump"))) {
																																														if ((!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/check_rights"), null, [2]))))) {
																																															return live(f.dot);
																																														}
																																														x = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "X")]));
																																														y = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "Y")]));
																																														z = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "Z")]));
																																														C_3 = rt.fv(f, "client", live(f.usr));
																																														if (!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) {
																																															yield* g.callName(f, live(C_3), "admin_ghost", []);
																																														}
																																														yield* g.call(f, P("/proc/sleep"), null, [2]);
																																														yield* g.callName(f, live(C_3), "jumptocoord", [live(x), live(y), live(z)]);
																																													} else {
																																														if (truthy(rt.at(live(f.args[1]), "adminchecklaws"))) {
																																															yield* g.srcCall(f, "output_ai_laws");
																																														} else {
																																															if (truthy(rt.at(live(f.args[1]), "admincheckdevilinfo"))) {
																																																yield* g.srcCall(f, "output_devil_info", (M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "admincheckdevilinfo"), rt.world())));
																																															} else {
																																																if (truthy(rt.at(live(f.args[1]), "adminmoreinfo"))) {
																																																	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [(M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "adminmoreinfo"), rt.gl("mob_list")))])))) {
																																																		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob."]);
																																																		return live(f.dot);
																																																	}
																																																	location_description = "";
																																																	special_role_description = "";
																																																	health_description = "";
																																																	gender_description = "";
																																																	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.getStep(f, live(M_0), 0))])))) {
																																																		if (truthy((yield* g.call(f, P("/proc/isarea"), null, [rt.fv(f, "loc", live(_T))])))) {
																																																			if (isEqual(rt.fv(f, "loc", live(M_0)), live(_T))) {
																																																				$0 = "at coordinates ";
																																																			} else {
																																																				$0 = fmt("in ＀ at coordinates ", [rt.fv(f, "loc", live(M_0))]);
																																																			}
																																																			location_description = fmt("(＀ ＀, ＀, ＀ in area <b>＀</b>)", [$0, rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T)), rt.fv(f, "loc", live(_T))]);
																																																		} else {
																																																			if (isEqual(rt.fv(f, "loc", live(M_0)), live(_T))) {
																																																				$0 = "at coordinates ";
																																																			} else {
																																																				$0 = fmt("in ＀ at coordinates ", [rt.fv(f, "loc", live(M_0))]);
																																																			}
																																																			location_description = fmt("(＀ ＀, ＀, ＀)", [$0, rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]);
																																																		}
																																																	}
																																																	if (truthy(rt.fv(f, "mind", live(M_0)))) {
																																																		special_role_description = fmt("Role: <b>＀</b>; Antagonist: <font color='red'><b>＀</b></font>", [rt.gv(f, "assigned_role", rt.fv(f, "mind", live(M_0))), rt.gv(f, "special_role", rt.fv(f, "mind", live(M_0)))]);
																																																	} else {
																																																		special_role_description = "Role: <i>Mind datum missing</i> Antagonist: <i>Mind datum missing</i>";
																																																	}
																																																	if (truthy((rt.istype(live(M_0), T("/mob/living")) ? 1 : 0))) {
																																																		L_6 = live(M_0);
																																																		status = null;
																																																		$0 = rt.fv(f, "stat", live(M_0));
																																																		if ($0 === 0) {
																																																			status = "Alive";
																																																		} else if ($0 === 1) {
																																																			status = "<font color='orange'><b>Unconscious</b></font>";
																																																		} else if ($0 === 2) {
																																																			status = "<font color='red'><b>Dead</b></font>";
																																																		}
																																																		health_description = fmt("Status = ＀", [live(status)]);
																																																		health_description = rt.modify(live(health_description), fmt("<BR>Oxy: ＀ - Tox: ＀ - Fire: ＀ - Brute: ＀ - Clone: ＀ - Brain: ＀ - Stamina: ＀", [(yield* g.callName(f, live(L_6), "getOxyLoss", [])), (yield* g.callName(f, live(L_6), "getToxLoss", [])), (yield* g.callName(f, live(L_6), "getFireLoss", [])), (yield* g.callName(f, live(L_6), "getBruteLoss", [])), (yield* g.callName(f, live(L_6), "getCloneLoss", [])), (yield* g.callName(f, live(L_6), "getBrainLoss", [])), (yield* g.callName(f, live(L_6), "getStaminaLoss", []))]), add);
																																																	} else {
																																																		health_description = "This mob type has no health to speak of.";
																																																	}
																																																	$0 = rt.fv(f, "gender", live(M_0));
																																																	if ($0 === "male" || $0 === "female") {
																																																		gender_description = fmt("＀", [rt.fv(f, "gender", live(M_0))]);
																																																	} else {
																																																		gender_description = fmt("<font color='red'><b>＀</b></font>", [rt.fv(f, "gender", live(M_0))]);
																																																	}
																																																	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(f.src)), fmt("<b>Info about ＀:</b> ", [rt.fv(f, "name", live(M_0))])]);
																																																	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(f.src)), fmt("Mob type = ＀; Gender = ＀ Damage = ＀", [rt.fv(f, "type", live(M_0)), live(gender_description), live(health_description)])]);
																																																	$0 = rt.fv(f, "owner", live(f.src));
																																																	$1 = rt.fv(f, "name", live(M_0));
																																																	$2 = rt.fv(f, "real_name", live(M_0));
																																																	if (truthy(rt.fv(f, "mind", live(M_0)))) {
																																																		$3 = fmt("＀", [rt.gv(f, "name", rt.fv(f, "mind", live(M_0)))]);
																																																	} else {
																																																		$3 = "";
																																																	}
																																																	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("Name = <b>＀</b>; Real_name = ＀; Mind_name = ＀; Key = <b>＀</b>;", [$1, $2, $3, rt.fv(f, "key", live(M_0))])]);
																																																	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(f.src)), fmt("Location = ＀;", [live(location_description)])]);
																																																	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(f.src)), fmt("＀", [live(special_role_description)])]);
																																																	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(f.src)), fmt("＀ ＀ ＀ ＀ ＀ ＀ ＀ ＀", [fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(M_0)]), fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [live(M_0)]), fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [live(M_0)]), fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [live(M_0)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(M_0)]), fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [live(M_0)]), fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [live(M_0)]), fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [live(M_0)])])]);
																																																} else {
																																																	if (truthy(rt.at(live(f.args[1]), "addjobslot"))) {
																																																		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																			return live(f.dot);
																																																		}
																																																		Add = rt.at(live(f.args[1]), "addjobslot");
																																																		job_1 = null;
																																																		rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
																																																		while (($e = rt.next(f, 0)) !== undefined) {
																																																			job_1 = $e;
																																																			if (isEqual(rt.fv(f, "title", live(job_1)), live(Add))) {
																																																				rt.modField(f, live(job_1), "total_positions", 1, add);
																																																				break;
																																																			}
																																																		}
																																																		rt.endFor(f, 0);
																																																		yield* g.callName(f, live(f.src), "manage_free_slots", []);
																																																	} else {
																																																		if (truthy(rt.at(live(f.args[1]), "removejobslot"))) {
																																																			if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																				return live(f.dot);
																																																			}
																																																			Remove = rt.at(live(f.args[1]), "removejobslot");
																																																			job_1 = null;
																																																			rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
																																																			while (($e = rt.next(f, 0)) !== undefined) {
																																																				job_1 = $e;
																																																				if ((isEqual(rt.fv(f, "title", live(job_1)), live(Remove)) && rt.gt(subtract(rt.fv(f, "total_positions", live(job_1)), rt.fv(f, "current_positions", live(job_1))), 0))) {
																																																					(rt.modField(f, live(job_1), "total_positions", 1, subtract));
																																																					break;
																																																				}
																																																			}
																																																			rt.endFor(f, 0);
																																																			yield* g.callName(f, live(f.src), "manage_free_slots", []);
																																																		} else {
																																																			if (truthy(rt.at(live(f.args[1]), "unlimitjobslot"))) {
																																																				if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																					return live(f.dot);
																																																				}
																																																				Unlimit = rt.at(live(f.args[1]), "unlimitjobslot");
																																																				job_1 = null;
																																																				rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
																																																				while (($e = rt.next(f, 0)) !== undefined) {
																																																					job_1 = $e;
																																																					if (isEqual(rt.fv(f, "title", live(job_1)), live(Unlimit))) {
																																																						rt.setFv(f, "total_positions", live(job_1), -1);
																																																						break;
																																																					}
																																																				}
																																																				rt.endFor(f, 0);
																																																				yield* g.callName(f, live(f.src), "manage_free_slots", []);
																																																			} else {
																																																				if (truthy(rt.at(live(f.args[1]), "limitjobslot"))) {
																																																					if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																						return live(f.dot);
																																																					}
																																																					Limit = rt.at(live(f.args[1]), "limitjobslot");
																																																					job_1 = null;
																																																					rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
																																																					while (($e = rt.next(f, 0)) !== undefined) {
																																																						job_1 = $e;
																																																						if (isEqual(rt.fv(f, "title", live(job_1)), live(Limit))) {
																																																							rt.setFv(f, "total_positions", live(job_1), rt.fv(f, "current_positions", live(job_1)));
																																																							break;
																																																						}
																																																					}
																																																					rt.endFor(f, 0);
																																																					yield* g.callName(f, live(f.src), "manage_free_slots", []);
																																																				} else {
																																																					if (truthy(rt.at(live(f.args[1]), "adminspawncookie"))) {
																																																						if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [10])))) {
																																																							return live(f.dot);
																																																						}
																																																						if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(f.args[1]), "adminspawncookie"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																																							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/human."]);
																																																							return live(f.dot);
																																																						}
																																																						cookie = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/cookie"), [live(H)]));
																																																						if (truthy((yield* g.callName(f, live(H), "put_in_hands", [live(cookie)])))) {
																																																							yield* g.callName(f, live(H), "update_inv_hands", []);
																																																						} else {
																																																							yield* g.call(f, P("/proc/qdel"), null, [live(cookie)]);
																																																							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has their hands full, so they did not receive their cookie, spawned by ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(H)])), (yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "owner", live(f.src))]))])]);
																																																							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has their hands full, so they did not receive their cookie, spawned by ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(H)])), (yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "owner", live(f.src))]))])]);
																																																							return live(f.dot);
																																																						}
																																																						yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ got their cookie, spawned by ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(H)])), (yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "owner", live(f.src))]))])]);
																																																						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ got their cookie, spawned by ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(H)])), (yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "owner", live(f.src))]))])]);
																																																						yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='adminnotice'>Your prayers have been answered!! You received the <b>best cookie</b>!</span>"]);
																																																						rt.op(f, "Output", [], [live(H), rt.rsc("sound/effects/pray_chaplain.ogg")], false);
																																																					} else {
																																																						if (truthy(rt.at(live(f.args[1]), "adminsmite"))) {
																																																							if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [10])))) {
																																																								return live(f.dot);
																																																							}
																																																							if ((!truthy((H = rt.locateIn(f, rt.at(live(f.args[1]), "adminsmite"), rt.gl("mob_list")))) || !truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0)))) {
																																																								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/human"]);
																																																								return live(f.dot);
																																																							}
																																																							yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "smite", [live(H)]);
																																																						} else {
																																																							if (truthy(rt.at(live(f.args[1]), "CentcommReply"))) {
																																																								if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(f.args[1]), "CentcommReply"), rt.gl("mob_list"))), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																																									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/human"]);
																																																									return live(f.dot);
																																																								}
																																																								if (!truthy((rt.istype(rt.fv(f, "ears", live(H)), T("/obj/item/device/radio/headset")) ? 1 : 0))) {
																																																									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The person you are trying to contact is not wearing a headset."]);
																																																									return live(f.dot);
																																																								}
																																																								yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has started answering ＀'s Centcomm request.", [rt.fv(f, "owner", live(f.src)), (yield* g.call(f, P("/proc/key_name"), null, [live(H)]))])]);
																																																								if (!truthy((input = (yield* g.op(f, "Prompt", [2], ["", "Outgoing message from Centcom", fmt("Please enter a message to reply to ＀ via their headset.", [(yield* g.call(f, P("/proc/key_name"), null, [live(H)]))]), rt.fv(f, "owner", live(f.src)), null]))))) {
																																																									yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ decided not to answer ＀'s Centcomm request.", [rt.fv(f, "owner", live(f.src)), (yield* g.call(f, P("/proc/key_name"), null, [live(H)]))])]);
																																																									return live(f.dot);
																																																								}
																																																								yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(f.src)), fmt("You sent ＀ to ＀ via a secure channel.", [live(input), live(H)])]);
																																																								yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ replied to ＀'s Centcom message with the message ＀.", [rt.fv(f, "owner", live(f.src)), (yield* g.call(f, P("/proc/key_name"), null, [live(H)])), live(input)])]);
																																																								yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ replied to ＀'s Centcom message with: \"＀\"", [rt.fv(f, "owner", live(f.src)), (yield* g.call(f, P("/proc/key_name"), null, [live(H)])), live(input)])]);
																																																								yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("You hear something crackle in your ears for a moment before a voice speaks.  \"Please stand by for a message from Central Command.  Message as follows. ＀.  Message ends.\"", [live(input)])]);
																																																							} else {
																																																								if (truthy(rt.at(live(f.args[1]), "SyndicateReply"))) {
																																																									if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(f.args[1]), "SyndicateReply"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																																										yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob/living/carbon/human."]);
																																																										return live(f.dot);
																																																									}
																																																									if (!truthy((rt.istype(rt.fv(f, "ears", live(H)), T("/obj/item/device/radio/headset")) ? 1 : 0))) {
																																																										yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The person you are trying to contact is not wearing a headset."]);
																																																										return live(f.dot);
																																																									}
																																																									yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has started answering ＀'s syndicate request.", [rt.fv(f, "owner", live(f.src)), (yield* g.call(f, P("/proc/key_name"), null, [live(H)]))])]);
																																																									if (!truthy((input = (yield* g.op(f, "Prompt", [2], ["", "Outgoing message from The Syndicate", fmt("Please enter a message to reply to ＀ via their headset.", [(yield* g.call(f, P("/proc/key_name"), null, [live(H)]))]), rt.fv(f, "owner", live(f.src)), null]))))) {
																																																										yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ decided not to answer ＀'s syndicate request.", [rt.fv(f, "owner", live(f.src)), (yield* g.call(f, P("/proc/key_name"), null, [live(H)]))])]);
																																																										return live(f.dot);
																																																									}
																																																									yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "owner", live(f.src)), fmt("You sent ＀ to ＀ via a secure channel.", [live(input), live(H)])]);
																																																									yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ replied to ＀'s Syndicate message with the message ＀.", [rt.fv(f, "owner", live(f.src)), (yield* g.call(f, P("/proc/key_name"), null, [live(H)])), live(input)])]);
																																																									yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ replied to ＀'s Syndicate message with: \"＀\"", [rt.fv(f, "owner", live(f.src)), (yield* g.call(f, P("/proc/key_name"), null, [live(H)])), live(input)])]);
																																																									yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("You hear something crackle in your ears for a moment before a voice speaks.  \"Please stand by for a message from your benefactor.  Message as follows, agent. ＀.  Message ends.\"", [live(input)])]);
																																																								} else {
																																																									if (truthy(rt.at(live(f.args[1]), "reject_custom_name"))) {
																																																										if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																											return live(f.dot);
																																																										}
																																																										if (truthy((rt.istype((charter = rt.locateIn(f, rt.at(live(f.args[1]), "reject_custom_name"), rt.world())), T("/obj/item/weapon/station_charter")) ? 1 : 0))) {
																																																											yield* g.callName(f, live(charter), "reject_proposed", [live(f.usr)]);
																																																										}
																																																									} else {
																																																										if (truthy(rt.at(live(f.args[1]), "jumpto"))) {
																																																											if ((!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/check_rights"), null, [2]))))) {
																																																												return live(f.dot);
																																																											}
																																																											M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "jumpto"), rt.world());
																																																											yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "jumptomob", [live(M_0)]);
																																																										} else {
																																																											if (truthy(rt.at(live(f.args[1]), "getmob"))) {
																																																												if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																													return live(f.dot);
																																																												}
																																																												if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Confirm?", "Message", "Yes", "No"])), "Yes")) {
																																																													return live(f.dot);
																																																												}
																																																												M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "getmob"), rt.world());
																																																												yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "Getmob", [live(M_0)]);
																																																											} else {
																																																												if (truthy(rt.at(live(f.args[1]), "sendmob"))) {
																																																													if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																														return live(f.dot);
																																																													}
																																																													M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "sendmob"), rt.world());
																																																													yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "sendmob", [live(M_0)]);
																																																												} else {
																																																													if (truthy(rt.at(live(f.args[1]), "narrateto"))) {
																																																														if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																															return live(f.dot);
																																																														}
																																																														M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "narrateto"), rt.world());
																																																														yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "cmd_admin_direct_narrate", [live(M_0)]);
																																																													} else {
																																																														if (truthy(rt.at(live(f.args[1]), "subtlemessage"))) {
																																																															if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																																return live(f.dot);
																																																															}
																																																															M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "subtlemessage"), rt.world());
																																																															yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "cmd_admin_subtle_message", [live(M_0)]);
																																																														} else {
																																																															if (truthy(rt.at(live(f.args[1]), "individuallog"))) {
																																																																if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																																	return live(f.dot);
																																																																}
																																																																if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [(M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "individuallog"), rt.gl("mob_list")))])))) {
																																																																	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob."]);
																																																																	return live(f.dot);
																																																																}
																																																																yield* g.call(f, P("/proc/show_individual_logging_panel"), null, [live(M_0), rt.at(live(f.args[1]), "log_type")]);
																																																															} else {
																																																																if (truthy(rt.at(live(f.args[1]), "languagemenu"))) {
																																																																	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																																		return live(f.dot);
																																																																	}
																																																																	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [(M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "languagemenu"), rt.gl("mob_list")))])))) {
																																																																		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob."]);
																																																																		return live(f.dot);
																																																																	}
																																																																	yield* g.callName(f, (H_1 = (yield* g.callName(f, live(M_0), "get_language_holder", []))), "open_language_menu", [live(f.usr)]);
																																																																} else {
																																																																	if (truthy(rt.at(live(f.args[1]), "traitor"))) {
																																																																		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																																			return live(f.dot);
																																																																		}
																																																																		if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
																																																																			yield* g.call(f, P("/proc/alert"), null, ["The game hasn't started yet!"]);
																																																																			return live(f.dot);
																																																																		}
																																																																		if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [(M_0 = rt.locateIn(f, rt.at(live(f.args[1]), "traitor"), rt.world()))])))) {
																																																																			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob."]);
																																																																			return live(f.dot);
																																																																		}
																																																																		yield* g.srcCall(f, "show_traitor_panel", live(M_0));
																																																																	} else {
																																																																		if (truthy(rt.at(live(f.args[1]), "create_object"))) {
																																																																			if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																																																				return live(f.dot);
																																																																			}
																																																																			return (yield* g.srcCall(f, "create_object", live(f.usr)));
																																																																		}
																																																																		if (truthy(rt.at(live(f.args[1]), "quick_create_object"))) {
																																																																			if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																																																				return live(f.dot);
																																																																			}
																																																																			return (yield* g.srcCall(f, "quick_create_object", live(f.usr)));
																																																																		}
																																																																		if (truthy(rt.at(live(f.args[1]), "create_turf"))) {
																																																																			if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																																																				return live(f.dot);
																																																																			}
																																																																			return (yield* g.srcCall(f, "create_turf", live(f.usr)));
																																																																		}
																																																																		if (truthy(rt.at(live(f.args[1]), "create_mob"))) {
																																																																			if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																																																				return live(f.dot);
																																																																			}
																																																																			return (yield* g.srcCall(f, "create_mob", live(f.usr)));
																																																																		}
																																																																		if (truthy(rt.at(live(f.args[1]), "dupe_marked_datum"))) {
																																																																			if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																																																				return live(f.dot);
																																																																			}
																																																																			return (yield* g.call(f, P("/proc/DuplicateObject"), null, [null, rt.sv(f, "marked_datum"), "perfectcopy", 1, "newloc", rt.getStep(f, live(f.usr), 0)], rt.Args.Named));
																																																																		}
																																																																		if (truthy(rt.at(live(f.args[1]), "object_list"))) {
																																																																			if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																																																				return live(f.dot);
																																																																			}
																																																																			loc = rt.fv(f, "loc", live(f.usr));
																																																																			dirty_paths = null;
																																																																			if (truthy((yield* g.call(f, P("/proc/istext"), null, [rt.at(live(f.args[1]), "object_list")])))) {
																																																																				dirty_paths = rt.list(rt.at(live(f.args[1]), "object_list"));
																																																																			} else {
																																																																				if (truthy((rt.istype(rt.at(live(f.args[1]), "object_list"), T("/list")) ? 1 : 0))) {
																																																																					dirty_paths = rt.at(live(f.args[1]), "object_list");
																																																																				}
																																																																			}
																																																																			paths = rt.list();
																																																																			dirty_path = null;
																																																																			rt.forList(f, 0, live(dirty_paths));
																																																																			while (($e = rt.next(f, 0)) !== undefined) {
																																																																				dirty_path = $e;
																																																																				if (!truthy((path = (yield* g.call(f, P("/proc/text2path"), null, [live(dirty_path)]))))) {
																																																																					continue;
																																																																				}
																																																																				if (((!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(path), T("/obj")]))) && !truthy((yield* g.call(f, P("/proc/ispath"), null, [live(path), T("/turf")])))) && !truthy((yield* g.call(f, P("/proc/ispath"), null, [live(path), T("/mob")]))))) {
																																																																					continue;
																																																																				}
																																																																				paths = rt.modify(live(paths), live(path), add);
																																																																			}
																																																																			rt.endFor(f, 0);
																																																																			if (!truthy(live(paths))) {
																																																																				yield* g.call(f, P("/proc/alert"), null, ["The path list you sent is empty."]);
																																																																				return live(f.dot);
																																																																			}
																																																																			if (rt.gt(rt.length(live(paths)), 5)) {
																																																																				yield* g.call(f, P("/proc/alert"), null, ["Select fewer object types, (max 5)."]);
																																																																				return live(f.dot);
																																																																			}
																																																																			offset = (yield* g.call(f, P("/proc/splittext"), null, [rt.at(live(f.args[1]), "offset"), ","]));
																																																																			number = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "object_count")])), 100]))]));
																																																																			if (rt.gt(rt.len(f, live(offset)), 0)) {
																																																																				$0 = (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(offset), 1)]));
																																																																			} else {
																																																																				$0 = 0;
																																																																			}
																																																																			X = $0;
																																																																			if (rt.gt(rt.len(f, live(offset)), 1)) {
																																																																				$0 = (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(offset), 2)]));
																																																																			} else {
																																																																				$0 = 0;
																																																																			}
																																																																			Y = $0;
																																																																			if (rt.gt(rt.len(f, live(offset)), 2)) {
																																																																				$0 = (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(offset), 3)]));
																																																																			} else {
																																																																				$0 = 0;
																																																																			}
																																																																			Z = $0;
																																																																			tmp_dir = rt.at(live(f.args[1]), "object_dir");
																																																																			if (truthy(live(tmp_dir))) {
																																																																				$0 = (yield* g.call(f, P("/proc/text2num"), null, [live(tmp_dir)]));
																																																																			} else {
																																																																				$0 = 2;
																																																																			}
																																																																			if ((!truthy((obj_dir = $0)) || !truthy((rt.isIn(f, live(obj_dir), rt.list(1, 2, 4, 8, 5, 6, 9, 10)) ? 1 : 0)))) {
																																																																				obj_dir = 2;
																																																																			}
																																																																			obj_name = (yield* g.call(f, P("/proc/sanitize"), null, [rt.at(live(f.args[1]), "object_name")]));
																																																																			target_11 = null;
																																																																			if (!truthy((rt.isIn(f, (where = rt.at(live(f.args[1]), "object_where")), rt.list("onfloor", "inhand", "inmarked")) ? 1 : 0))) {
																																																																				where = "onfloor";
																																																																			}
																																																																			$0 = live(where);
																																																																			if ($0 === "inhand") {
																																																																				if ((!truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0)) && !truthy((rt.istype(live(f.usr), T("/mob/living/silicon/robot")) ? 1 : 0)))) {
																																																																					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Can only spawn in hand when you're a carbon mob or cyborg."]);
																																																																					where = "onfloor";
																																																																				}
																																																																				target_11 = live(f.usr);
																																																																			} else if ($0 === "onfloor") {
																																																																				$0 = rt.at(live(f.args[1]), "offset_type");
																																																																				if ($0 === "absolute") {
																																																																					target_11 = rt.locate(add(0, live(X)), add(0, live(Y)), add(0, live(Z)));
																																																																				} else if ($0 === "relative") {
																																																																					target_11 = rt.locate(add(rt.fv(f, "x", live(loc)), live(X)), add(rt.fv(f, "y", live(loc)), live(Y)), add(rt.fv(f, "z", live(loc)), live(Z)));
																																																																				}
																																																																			} else if ($0 === "inmarked") {
																																																																				if (!truthy(rt.sv(f, "marked_datum"))) {
																																																																					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "You don't have any object marked. Abandoning spawn."]);
																																																																					return live(f.dot);
																																																																				} else {
																																																																					if (!truthy((rt.istype(rt.sv(f, "marked_datum"), T("/atom")) ? 1 : 0))) {
																																																																						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The object you have marked cannot be used as a target. Target must be of type /atom. Abandoning spawn."]);
																																																																						return live(f.dot);
																																																																					} else {
																																																																						target_11 = rt.sv(f, "marked_datum");
																																																																					}
																																																																				}
																																																																			}
																																																																			if (truthy(live(target_11))) {
																																																																				path_13 = null;
																																																																				rt.forList(f, 0, live(paths));
																																																																				while (($e = rt.next(f, 0)) !== undefined) {
																																																																					path_13 = $e;
																																																																					i = null;
																																																																					i = 0;
																																																																					while (rt.lt(live(i), live(number))) {
																																																																						if (truthy((rt.isIn(f, live(path_13), (yield* g.call(f, P("/proc/typesof"), null, [T("/turf")]))) ? 1 : 0))) {
																																																																							O = live(target_11);
																																																																							if ((truthy((N = (yield* g.callName(f, live(O), "ChangeTurf", [live(path_13)])))) && truthy(live(obj_name)))) {
																																																																								rt.setFv(f, "name", live(N), live(obj_name));
																																																																							}
																																																																						} else {
																																																																							if (truthy((O = (yield* g.new_(f, live(path_13), [live(target_11)]))))) {
																																																																								rt.setFv(f, "admin_spawned", live(O), 1);
																																																																								yield* g.callName(f, live(O), "setDir", [live(obj_dir)]);
																																																																								if (truthy(live(obj_name))) {
																																																																									rt.setFv(f, "name", live(O), live(obj_name));
																																																																									if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(O)])))) {
																																																																										rt.setFv(f, "real_name", (M_16 = live(O)), live(obj_name));
																																																																									}
																																																																								}
																																																																								if (((isEqual(live(where), "inhand") && truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) && truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0)))) {
																																																																									L_16 = live(f.usr);
																																																																									I_17 = live(O);
																																																																									yield* g.callName(f, live(L_16), "put_in_hands", [live(I_17)]);
																																																																									if (truthy((rt.istype(live(L_16), T("/mob/living/silicon/robot")) ? 1 : 0))) {
																																																																										if (truthy(rt.gv(f, "module", (R = live(L_16))))) {
																																																																											yield* g.callName(f, rt.fv(f, "module", live(R)), "add_module", [live(I_17), 1, 1]);
																																																																											yield* g.callName(f, live(R), "activate_module", [live(I_17)]);
																																																																										}
																																																																									}
																																																																								}
																																																																							}
																																																																						}
																																																																						i = rt.inc(live(i), 1);
																																																																					}
																																																																				}
																																																																				rt.endFor(f, 0);
																																																																			}
																																																																			if (isEqual(live(number), 1)) {
																																																																				yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created a ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/english_list"), null, [live(paths)]))])]);
																																																																				path_13 = null;
																																																																				rt.forList(f, 0, live(paths));
																																																																				while (($e = rt.next(f, 0)) !== undefined) {
																																																																					path_13 = $e;
																																																																					if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(path_13), T("/mob")])))) {
																																																																						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created a ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/english_list"), null, [live(paths)]))])]);
																																																																						break;
																																																																					}
																																																																				}
																																																																				rt.endFor(f, 0);
																																																																			} else {
																																																																				yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created ＀ea ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(number), (yield* g.call(f, P("/proc/english_list"), null, [live(paths)]))])]);
																																																																				path_13 = null;
																																																																				rt.forList(f, 0, live(paths));
																																																																				while (($e = rt.next(f, 0)) !== undefined) {
																																																																					path_13 = $e;
																																																																					if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(path_13), T("/mob")])))) {
																																																																						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created ＀ea ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(number), (yield* g.call(f, P("/proc/english_list"), null, [live(paths)]))])]);
																																																																						break;
																																																																					}
																																																																				}
																																																																				rt.endFor(f, 0);
																																																																			}
																																																																			return live(f.dot);
																																																																		} else {
																																																																			if (truthy(rt.at(live(f.args[1]), "secrets"))) {
																																																																				yield* g.srcCall(f, "Secrets_topic", rt.at(live(f.args[1]), "secrets"), live(f.args[1]));
																																																																			} else {
																																																																				if (truthy(rt.at(live(f.args[1]), "ac_view_wanted"))) {
																																																																					rt.setFv(f, "admincaster_screen", live(f.src), 18);
																																																																					yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																				} else {
																																																																					if (truthy(rt.at(live(f.args[1]), "ac_set_channel_name"))) {
																																																																						rt.setFv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src)), (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Provide a Feed Channel Name.", "Network Channel Handler", ""])));
																																																																						while (isEqual((yield* g.call(f, P("/proc/findtext"), null, [rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), " "])), 1)) {
																																																																							rt.setFv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src)), (yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), 2, add((yield* g.call(f, P("/proc/lentext"), null, [rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src)))])), 1)])));
																																																																						}
																																																																						yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																					} else {
																																																																						if (truthy(rt.at(live(f.args[1]), "ac_set_channel_lock"))) {
																																																																							rt.setFv(f, "locked", rt.fv(f, "admincaster_feed_channel", live(f.src)), (!truthy(rt.gv(f, "locked", rt.fv(f, "admincaster_feed_channel", live(f.src)))) ? 1 : 0));
																																																																							yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																						} else {
																																																																							if (truthy(rt.at(live(f.args[1]), "ac_submit_new_channel"))) {
																																																																								check = 0;
																																																																								FC = null;
																																																																								rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
																																																																								while (($e = rt.next(f, 0)) !== undefined) {
																																																																									FC = $e;
																																																																									if (isEqual(rt.fv(f, "channel_name", live(FC)), rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))))) {
																																																																										check = 1;
																																																																										break;
																																																																									}
																																																																								}
																																																																								rt.endFor(f, 0);
																																																																								if (((isEqual(rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), "") || isEqual(rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), "[REDACTED]")) || truthy(live(check)))) {
																																																																									rt.setFv(f, "admincaster_screen", live(f.src), 7);
																																																																								} else {
																																																																									if (isEqual((choice = (yield* g.call(f, P("/proc/alert"), null, ["Please confirm Feed channel creation.", "Network Channel Handler", "Confirm", "Cancel"]))), "Confirm")) {
																																																																										yield* g.callName(f, rt.gl("news_network"), "CreateFeedChannel", [rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), rt.fv(f, "admin_signature", live(f.src)), rt.gv(f, "locked", rt.fv(f, "admincaster_feed_channel", live(f.src))), 1]);
																																																																										yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created command feed channel: ＀!", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src)))])]);
																																																																										rt.setFv(f, "admincaster_screen", live(f.src), 5);
																																																																									}
																																																																								}
																																																																								yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																							} else {
																																																																								if (truthy(rt.at(live(f.args[1]), "ac_set_channel_receiving"))) {
																																																																									available_channels = rt.list();
																																																																									F = null;
																																																																									rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
																																																																									while (($e = rt.next(f, 0)) !== undefined) {
																																																																										F = $e;
																																																																										available_channels = rt.modify(live(available_channels), rt.fv(f, "channel_name", live(F)), add);
																																																																									}
																																																																									rt.endFor(f, 0);
																																																																									rt.setFv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src)), (yield* g.call(f, P("/proc/adminscrub"), null, [(yield* g.op(f, "Prompt", [0], [null, "Network Channel Handler", "Choose receiving Feed Channel.", live(f.usr), live(available_channels)]))])));
																																																																									yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																								} else {
																																																																									if (truthy(rt.at(live(f.args[1]), "ac_set_new_message"))) {
																																																																										rt.setFv(f, "body", rt.fv(f, "admincaster_feed_message", live(f.src)), (yield* g.call(f, P("/proc/adminscrub"), null, [(yield* g.op(f, "Prompt", [2], ["", "Network Channel Handler", "Write your Feed story.", live(f.usr), null]))])));
																																																																										while (isEqual((yield* g.call(f, P("/proc/findtext"), null, [(yield* g.callName(f, rt.fv(f, "admincaster_feed_message", live(f.src)), "returnBody", [-1])), " "])), 1)) {
																																																																											rt.setFv(f, "body", rt.fv(f, "admincaster_feed_message", live(f.src)), (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.callName(f, rt.fv(f, "admincaster_feed_message", live(f.src)), "returnBody", [-1])), 2, add((yield* g.call(f, P("/proc/lentext"), null, [(yield* g.callName(f, rt.fv(f, "admincaster_feed_message", live(f.src)), "returnBody", [-1]))])), 1)])));
																																																																										}
																																																																										yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																									} else {
																																																																										if (truthy(rt.at(live(f.args[1]), "ac_submit_new_message"))) {
																																																																											if (((isEqual((yield* g.callName(f, rt.fv(f, "admincaster_feed_message", live(f.src)), "returnBody", [-1])), "") || isEqual((yield* g.callName(f, rt.fv(f, "admincaster_feed_message", live(f.src)), "returnBody", [-1])), "[REDACTED]")) || isEqual(rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), ""))) {
																																																																												rt.setFv(f, "admincaster_screen", live(f.src), 6);
																																																																											} else {
																																																																												yield* g.callName(f, rt.gl("news_network"), "SubmitArticle", [(yield* g.callName(f, rt.fv(f, "admincaster_feed_message", live(f.src)), "returnBody", [-1])), rt.fv(f, "admin_signature", live(f.src)), rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src))), null, 1]);
																																																																												rt.setFv(f, "admincaster_screen", live(f.src), 4);
																																																																											}
																																																																											NEWSCASTER = null;
																																																																											rt.forList(f, 0, rt.gl("allCasters"), T("/obj/machinery/newscaster"));
																																																																											while (($e = rt.next(f, 0)) !== undefined) {
																																																																												NEWSCASTER = $e;
																																																																												yield* g.callName(f, live(NEWSCASTER), "newsAlert", [rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src)))]);
																																																																											}
																																																																											rt.endFor(f, 0);
																																																																											yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ submitted a feed story to channel: ＀!", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.gv(f, "channel_name", rt.fv(f, "admincaster_feed_channel", live(f.src)))])]);
																																																																											yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																										} else {
																																																																											if (truthy(rt.at(live(f.args[1]), "ac_create_channel"))) {
																																																																												rt.setFv(f, "admincaster_screen", live(f.src), 2);
																																																																												yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																											} else {
																																																																												if (truthy(rt.at(live(f.args[1]), "ac_create_feed_story"))) {
																																																																													rt.setFv(f, "admincaster_screen", live(f.src), 3);
																																																																													yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																												} else {
																																																																													if (truthy(rt.at(live(f.args[1]), "ac_menu_censor_story"))) {
																																																																														rt.setFv(f, "admincaster_screen", live(f.src), 10);
																																																																														yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																													} else {
																																																																														if (truthy(rt.at(live(f.args[1]), "ac_menu_censor_channel"))) {
																																																																															rt.setFv(f, "admincaster_screen", live(f.src), 11);
																																																																															yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																														} else {
																																																																															if (truthy(rt.at(live(f.args[1]), "ac_menu_wanted"))) {
																																																																																already_wanted = 0;
																																																																																if (truthy(rt.gv(f, "active", rt.fv(f, "wanted_issue", rt.gl("news_network"))))) {
																																																																																	already_wanted = 1;
																																																																																}
																																																																																if (truthy(live(already_wanted))) {
																																																																																	rt.setFv(f, "criminal", rt.fv(f, "admincaster_wanted_message", live(f.src)), rt.gv(f, "criminal", rt.fv(f, "wanted_issue", rt.gl("news_network"))));
																																																																																	rt.setFv(f, "body", rt.fv(f, "admincaster_wanted_message", live(f.src)), rt.gv(f, "body", rt.fv(f, "wanted_issue", rt.gl("news_network"))));
																																																																																}
																																																																																rt.setFv(f, "admincaster_screen", live(f.src), 14);
																																																																																yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																															} else {
																																																																																if (truthy(rt.at(live(f.args[1]), "ac_set_wanted_name"))) {
																																																																																	rt.setFv(f, "criminal", rt.fv(f, "admincaster_wanted_message", live(f.src)), (yield* g.call(f, P("/proc/adminscrub"), null, [(yield* g.op(f, "Prompt", [2], ["", "Network Security Handler", "Provide the name of the Wanted person.", live(f.usr), null]))])));
																																																																																	while (isEqual((yield* g.call(f, P("/proc/findtext"), null, [rt.gv(f, "criminal", rt.fv(f, "admincaster_wanted_message", live(f.src))), " "])), 1)) {
																																																																																		rt.setFv(f, "criminal", rt.fv(f, "admincaster_wanted_message", live(f.src)), (yield* g.call(f, P("/proc/copytext"), null, [rt.fv(f, "criminal", rt.sv(f, "admincaster_wanted_message")), 2, add((yield* g.call(f, P("/proc/lentext"), null, [rt.fv(f, "criminal", rt.sv(f, "admincaster_wanted_message"))])), 1)])));
																																																																																	}
																																																																																	yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																} else {
																																																																																	if (truthy(rt.at(live(f.args[1]), "ac_set_wanted_desc"))) {
																																																																																		rt.setFv(f, "body", rt.fv(f, "admincaster_wanted_message", live(f.src)), (yield* g.call(f, P("/proc/adminscrub"), null, [(yield* g.op(f, "Prompt", [2], ["", "Network Security Handler", "Provide the a description of the Wanted person and any other details you deem important.", live(f.usr), null]))])));
																																																																																		while (isEqual((yield* g.call(f, P("/proc/findtext"), null, [rt.gv(f, "body", rt.fv(f, "admincaster_wanted_message", live(f.src))), " "])), 1)) {
																																																																																			rt.setFv(f, "body", rt.fv(f, "admincaster_wanted_message", live(f.src)), (yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "body", rt.fv(f, "admincaster_wanted_message", live(f.src))), 2, add((yield* g.call(f, P("/proc/lentext"), null, [rt.gv(f, "body", rt.fv(f, "admincaster_wanted_message", live(f.src)))])), 1)])));
																																																																																		}
																																																																																		yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																	} else {
																																																																																		if (truthy(rt.at(live(f.args[1]), "ac_submit_wanted"))) {
																																																																																			input_param = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "ac_submit_wanted")]));
																																																																																			if ((isEqual(rt.gv(f, "criminal", rt.fv(f, "admincaster_wanted_message", live(f.src))), "") || isEqual(rt.gv(f, "body", rt.fv(f, "admincaster_wanted_message", live(f.src))), ""))) {
																																																																																				rt.setFv(f, "admincaster_screen", live(f.src), 16);
																																																																																			} else {
																																																																																				if (isEqual(live(input_param), 1)) {
																																																																																					$0 = "creation.";
																																																																																				} else {
																																																																																					$0 = "edit.";
																																																																																				}
																																																																																				if (isEqual((choice = (yield* g.call(f, P("/proc/alert"), null, [fmt("Please confirm Wanted Issue ＀", [$0]), "Network Security Handler", "Confirm", "Cancel"]))), "Confirm")) {
																																																																																					if (isEqual(live(input_param), 1)) {
																																																																																						yield* g.callName(f, rt.gl("news_network"), "submitWanted", [rt.fv(f, "criminal", rt.sv(f, "admincaster_wanted_message")), rt.fv(f, "body", rt.sv(f, "admincaster_wanted_message")), rt.sv(f, "admin_signature"), null, 1, 1]);
																																																																																						rt.setFv(f, "admincaster_screen", live(f.src), 15);
																																																																																					} else {
																																																																																						yield* g.callName(f, rt.gl("news_network"), "submitWanted", [rt.fv(f, "criminal", rt.sv(f, "admincaster_wanted_message")), rt.fv(f, "body", rt.sv(f, "admincaster_wanted_message")), rt.sv(f, "admin_signature")]);
																																																																																						rt.setFv(f, "admincaster_screen", live(f.src), 19);
																																																																																					}
																																																																																					yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ issued a Station-wide Wanted Notification for ＀!", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.gv(f, "criminal", rt.fv(f, "admincaster_wanted_message", live(f.src)))])]);
																																																																																				}
																																																																																			}
																																																																																			yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																		} else {
																																																																																			if (truthy(rt.at(live(f.args[1]), "ac_cancel_wanted"))) {
																																																																																				if (isEqual((choice_0 = (yield* g.call(f, P("/proc/alert"), null, ["Please confirm Wanted Issue removal.", "Network Security Handler", "Confirm", "Cancel"]))), "Confirm")) {
																																																																																					yield* g.callName(f, rt.gl("news_network"), "deleteWanted", []);
																																																																																					rt.setFv(f, "admincaster_screen", live(f.src), 17);
																																																																																				}
																																																																																				yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																			} else {
																																																																																				if (truthy(rt.at(live(f.args[1]), "ac_censor_channel_author"))) {
																																																																																					yield* g.callName(f, (FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "ac_censor_channel_author"), rt.world())), "toggleCensorAuthor", []);
																																																																																					yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																				} else {
																																																																																					if (truthy(rt.at(live(f.args[1]), "ac_censor_channel_story_author"))) {
																																																																																						yield* g.callName(f, (MSG = rt.locateIn(f, rt.at(live(f.args[1]), "ac_censor_channel_story_author"), rt.world())), "toggleCensorAuthor", []);
																																																																																						yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																					} else {
																																																																																						if (truthy(rt.at(live(f.args[1]), "ac_censor_channel_story_body"))) {
																																																																																							yield* g.callName(f, (MSG = rt.locateIn(f, rt.at(live(f.args[1]), "ac_censor_channel_story_body"), rt.world())), "toggleCensorBody", []);
																																																																																							yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																						} else {
																																																																																							if (truthy(rt.at(live(f.args[1]), "ac_pick_d_notice"))) {
																																																																																								FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "ac_pick_d_notice"), rt.world());
																																																																																								rt.setFv(f, "admincaster_feed_channel", live(f.src), live(FC_0));
																																																																																								rt.setFv(f, "admincaster_screen", live(f.src), 13);
																																																																																								yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																							} else {
																																																																																								if (truthy(rt.at(live(f.args[1]), "ac_toggle_d_notice"))) {
																																																																																									yield* g.callName(f, (FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "ac_toggle_d_notice"), rt.world())), "toggleCensorDclass", []);
																																																																																									yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																								} else {
																																																																																									if (truthy(rt.at(live(f.args[1]), "ac_view"))) {
																																																																																										rt.setFv(f, "admincaster_screen", live(f.src), 1);
																																																																																										yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																									} else {
																																																																																										if (truthy(rt.at(live(f.args[1]), "ac_setScreen"))) {
																																																																																											rt.setFv(f, "admincaster_screen", live(f.src), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "ac_setScreen")])));
																																																																																											if (isEqual(rt.fv(f, "admincaster_screen", live(f.src)), 0)) {
																																																																																												if (truthy(rt.fv(f, "admincaster_feed_channel", live(f.src)))) {
																																																																																													rt.setFv(f, "admincaster_feed_channel", live(f.src), (yield* g.new_(f, T("/datum/newscaster/feed_channel"), [])));
																																																																																												}
																																																																																												if (truthy(rt.fv(f, "admincaster_feed_message", live(f.src)))) {
																																																																																													rt.setFv(f, "admincaster_feed_message", live(f.src), (yield* g.new_(f, T("/datum/newscaster/feed_message"), [])));
																																																																																												}
																																																																																												if (truthy(rt.sv(f, "admincaster_wanted_message"))) {
																																																																																													rt.setSv(f, "admincaster_wanted_message", (yield* g.new_(f, T("/datum/newscaster/wanted_message"), [])));
																																																																																												}
																																																																																											}
																																																																																											yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																										} else {
																																																																																											if (truthy(rt.at(live(f.args[1]), "ac_show_channel"))) {
																																																																																												FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "ac_show_channel"), rt.world());
																																																																																												rt.setFv(f, "admincaster_feed_channel", live(f.src), live(FC_0));
																																																																																												rt.setFv(f, "admincaster_screen", live(f.src), 9);
																																																																																												yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																											} else {
																																																																																												if (truthy(rt.at(live(f.args[1]), "ac_pick_censor_channel"))) {
																																																																																													FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "ac_pick_censor_channel"), rt.world());
																																																																																													rt.setFv(f, "admincaster_feed_channel", live(f.src), live(FC_0));
																																																																																													rt.setFv(f, "admincaster_screen", live(f.src), 12);
																																																																																													yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																												} else {
																																																																																													if (truthy(rt.at(live(f.args[1]), "ac_refresh"))) {
																																																																																														yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																													} else {
																																																																																														if (truthy(rt.at(live(f.args[1]), "ac_set_signature"))) {
																																																																																															rt.setFv(f, "admin_signature", live(f.src), (yield* g.call(f, P("/proc/adminscrub"), null, [(yield* g.op(f, "Prompt", [2], ["", "Network Identity Handler", "Provide your desired signature.", live(f.usr), null]))])));
																																																																																															yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																														} else {
																																																																																															if (truthy(rt.at(live(f.args[1]), "ac_del_comment"))) {
																																																																																																FC_0 = rt.locateIn(f, rt.at(live(f.args[1]), "ac_del_comment"), rt.world());
																																																																																																(rt.modField(f, (FM = rt.locateIn(f, rt.at(live(f.args[1]), "ac_del_comment_msg"), rt.world())), "comments", live(FC_0), subtract));
																																																																																																yield* g.call(f, P("/proc/qdel"), null, [live(FC_0)]);
																																																																																																yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																															} else {
																																																																																																if (truthy(rt.at(live(f.args[1]), "ac_lock_comment"))) {
																																																																																																	(rt.modField(f, (FM_0 = rt.locateIn(f, rt.at(live(f.args[1]), "ac_lock_comment"), rt.world())), "locked", 1, rt.bitXor));
																																																																																																	yield* g.callName(f, live(f.src), "access_news_network", []);
																																																																																																} else {
																																																																																																	if (truthy(rt.at(live(f.args[1]), "check_antagonist"))) {
																																																																																																		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																																																																			return live(f.dot);
																																																																																																		}
																																																																																																		yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "check_antagonists", []);
																																																																																																	} else {
																																																																																																		if (truthy(rt.at(live(f.args[1]), "kick_all_from_lobby"))) {
																																																																																																			if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																																																																				return live(f.dot);
																																																																																																			}
																																																																																																			if (truthy((yield* g.callName(f, rt.gl("SSticker"), "IsRoundInProgress", [])))) {
																																																																																																				if (truthy((afkonly = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "afkonly")]))))) {
																																																																																																					$0 = "AFK";
																																																																																																				} else {
																																																																																																					$0 = "";
																																																																																																				}
																																																																																																				if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [fmt("Are you sure you want to kick all ＀ clients from the lobby??", [$0]), "Message", "Yes", "Cancel"])), "Yes")) {
																																																																																																					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Kick clients from lobby aborted"]);
																																																																																																					return live(f.dot);
																																																																																																				}
																																																																																																				if (truthy(rt.gv(f, "fakekey", rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
																																																																																																					$0 = "an Administrator";
																																																																																																				} else {
																																																																																																					$0 = fmt("＀", [rt.gv(f, "ckey", rt.fv(f, "client", live(f.usr)))]);
																																																																																																				}
																																																																																																				listkicked = (yield* g.call(f, P("/proc/kick_clients_in_lobby"), null, [fmt("<span class='danger'>You were kicked from the lobby by ＀.</span>", [$0]), live(afkonly)]));
																																																																																																				strkicked = "";
																																																																																																				name = null;
																																																																																																				rt.forList(f, 0, live(listkicked));
																																																																																																				while (($e = rt.next(f, 0)) !== undefined) {
																																																																																																					name = $e;
																																																																																																					strkicked = rt.modify(live(strkicked), fmt("＀, ", [live(name)]), add);
																																																																																																				}
																																																																																																				rt.endFor(f, 0);
																																																																																																				$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
																																																																																																				if (truthy(live(afkonly))) {
																																																																																																					$1 = "all AFK";
																																																																																																				} else {
																																																																																																					$1 = "all";
																																																																																																				}
																																																																																																				$2 = rt.length(live(listkicked));
																																																																																																				if (truthy(live(strkicked))) {
																																																																																																					$3 = live(strkicked);
																																																																																																				} else {
																																																																																																					$3 = "--";
																																																																																																				}
																																																																																																				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has kicked ＀ clients from the lobby. ＀ clients kicked: ＀", [$0, $1, $2, $3])]);
																																																																																																				$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]));
																																																																																																				if (truthy(live(afkonly))) {
																																																																																																					$1 = "all AFK";
																																																																																																				} else {
																																																																																																					$1 = "all";
																																																																																																				}
																																																																																																				$2 = rt.length(live(listkicked));
																																																																																																				if (truthy(live(strkicked))) {
																																																																																																					$3 = live(strkicked);
																																																																																																				} else {
																																																																																																					$3 = "--";
																																																																																																				}
																																																																																																				yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has kicked ＀ clients from the lobby. ＀ clients kicked: ＀", [$0, $1, $2, $3])]);
																																																																																																			} else {
																																																																																																				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "You may only use this when the game is running."]);
																																																																																																			}
																																																																																																		} else {
																																																																																																			if (truthy(rt.at(live(f.args[1]), "create_outfit"))) {
																																																																																																				if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																																																																					return live(f.dot);
																																																																																																				}
																																																																																																				rt.setFv(f, "name", (O_0 = (yield* g.new_(f, T("/datum/outfit"), []))), rt.at(live(f.args[1]), "outfit_name"));
																																																																																																				rt.setFv(f, "uniform", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_uniform")])));
																																																																																																				rt.setFv(f, "shoes", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_shoes")])));
																																																																																																				rt.setFv(f, "gloves", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_gloves")])));
																																																																																																				rt.setFv(f, "suit", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_suit")])));
																																																																																																				rt.setFv(f, "head", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_head")])));
																																																																																																				rt.setFv(f, "back", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_back")])));
																																																																																																				rt.setFv(f, "mask", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_mask")])));
																																																																																																				rt.setFv(f, "glasses", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_glasses")])));
																																																																																																				rt.setFv(f, "r_hand", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_r_hand")])));
																																																																																																				rt.setFv(f, "l_hand", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_l_hand")])));
																																																																																																				rt.setFv(f, "suit_store", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_s_store")])));
																																																																																																				rt.setFv(f, "l_pocket", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_l_pocket")])));
																																																																																																				rt.setFv(f, "r_pocket", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_r_pocket")])));
																																																																																																				rt.setFv(f, "id", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_id")])));
																																																																																																				rt.setFv(f, "belt", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_belt")])));
																																																																																																				rt.setFv(f, "ears", live(O_0), (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "outfit_ears")])));
																																																																																																				yield* g.callName(f, rt.gl("custom_outfits"), "Add", [live(O_0)]);
																																																																																																				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created \"＀\" outfit!", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "name", live(O_0))])]);
																																																																																																			} else {
																																																																																																				if (truthy(rt.at(live(f.args[1]), "set_selfdestruct_code"))) {
																																																																																																					if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																																																																						return live(f.dot);
																																																																																																					}
																																																																																																					code = (yield* g.call(f, P("/proc/random_nukecode"), null, []));
																																																																																																					SD = null;
																																																																																																					rt.forList(f, 0, rt.gl("nuke_list"), T("/obj/machinery/nuclearbomb/selfdestruct"));
																																																																																																					while (($e = rt.next(f, 0)) !== undefined) {
																																																																																																						SD = $e;
																																																																																																						rt.setFv(f, "r_code", live(SD), live(code));
																																																																																																					}
																																																																																																					rt.endFor(f, 0);
																																																																																																					yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has set the self-destruct code to \"＀\".", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(code)])]);
																																																																																																				} else {
																																																																																																					if (truthy(rt.at(live(f.args[1]), "add_station_goal"))) {
																																																																																																						if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																																																																																																							return live(f.dot);
																																																																																																						}
																																																																																																						type_choices = (yield* g.call(f, P("/proc/typesof"), null, [T("/datum/station_goal")]));
																																																																																																						if (!truthy((picked = (yield* g.op(f, "Prompt", [0], [null, null, null, "Choose goal type", rt.bitOr(live(type_choices), null)]))))) {
																																																																																																							return live(f.dot);
																																																																																																						}
																																																																																																						G = (yield* g.new_(f, live(picked), []));
																																																																																																						if (isEqual(live(picked), T("/datum/station_goal"))) {
																																																																																																							if (!truthy((newname = (yield* g.op(f, "Prompt", [3], [null, null, null, "Enter goal name:", null]))))) {
																																																																																																								return live(f.dot);
																																																																																																							}
																																																																																																							rt.setFv(f, "name", live(G), live(newname));
																																																																																																							if (!truthy((description = (yield* g.op(f, "Prompt", [65], [null, null, null, "Enter centcom message contents:", null]))))) {
																																																																																																								return live(f.dot);
																																																																																																							}
																																																																																																							rt.setFv(f, "report_message", live(G), live(description));
																																																																																																						}
																																																																																																						yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ created \"＀\" station goal.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "name", live(G))])]);
																																																																																																						rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "station_goals", live(G), add);
																																																																																																						yield* g.srcCall(f, "modify_goals");
																																																																																																					} else {
																																																																																																						if (truthy(rt.at(live(f.args[1]), "viewruntime"))) {
																																																																																																							if (!truthy((rt.istype((error_viewer = rt.locateIn(f, rt.at(live(f.args[1]), "viewruntime"), rt.world())), T("/datum/error_viewer")) ? 1 : 0))) {
																																																																																																								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>That runtime viewer no longer exists.</span>"]);
																																																																																																								return live(f.dot);
																																																																																																							}
																																																																																																							if (truthy(rt.at(live(f.args[1]), "viewruntime_backto"))) {
																																																																																																								yield* g.callName(f, live(error_viewer), "show_to", [rt.sv(f, "owner"), rt.locateIn(f, rt.at(live(f.args[1]), "viewruntime_backto"), rt.world()), rt.at(live(f.args[1]), "viewruntime_linear")]);
																																																																																																							} else {
																																																																																																								yield* g.callName(f, live(error_viewer), "show_to", [rt.sv(f, "owner"), null, rt.at(live(f.args[1]), "viewruntime_linear")]);
																																																																																																							}
																																																																																																						} else {
																																																																																																							if (!truthy(rt.at(live(f.args[1]), "showrelatedacc"))) return f.dot;
																																																																																																							C_0 = rt.locateIn(f, rt.at(live(f.args[1]), "client"), rt.gl("clients"));
																																																																																																							thing_to_check = null;
																																																																																																							if (isEqual(rt.at(live(f.args[1]), "showrelatedacc"), "cid")) {
																																																																																																								thing_to_check = rt.fv(f, "related_accounts_cid", live(C_0));
																																																																																																							} else {
																																																																																																								thing_to_check = rt.fv(f, "related_accounts_ip", live(C_0));
																																																																																																							}
																																																																																																							thing_to_check = (yield* g.call(f, P("/proc/splittext"), null, [live(thing_to_check), ", "]));
																																																																																																							dat_2 = rt.list(fmt("Related accounts by ＀:", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.at(live(f.args[1]), "showrelatedacc")]))]));
																																																																																																							dat_2 = rt.modify(live(dat_2), live(thing_to_check), add);
																																																																																																							rt.op(f, "Browse", [], [live(f.usr), (yield* g.callName(f, live(dat_2), "Join", ["<br>"])), fmt("window=related_＀;size=420x300", [live(C_0)])], false);
																																																																																																						}
																																																																																																					}
																																																																																																				}
																																																																																																			}
																																																																																																		}
																																																																																																	}
																																																																																																}
																																																																																															}
																																																																																														}
																																																																																													}
																																																																																												}
																																																																																											}
																																																																																										}
																																																																																									}
																																																																																								}
																																																																																							}
																																																																																						}
																																																																																					}
																																																																																				}
																																																																																			}
																																																																																		}
																																																																																	}
																																																																																}
																																																																															}
																																																																														}
																																																																													}
																																																																												}
																																																																											}
																																																																										}
																																																																									}
																																																																								}
																																																																							}
																																																																						}
																																																																					}
																																																																				}
																																																																			}
																																																																		}
																																																																	}
																																																																}
																																																															}
																																																														}
																																																													}
																																																												}
																																																											}
																																																										}
																																																									}
																																																								}
																																																							}
																																																						}
																																																					}
																																																				}
																																																			}
																																																		}
																																																	}
																																																}
																																															}
																																														}
																																													}
																																												}
																																											}
																																										}
																																									}
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// a spawn(50) body of /datum/admins/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1433", function* (f: Frame, ahelp_ref: Value, AH: Value, strength: Value, E: Value, event: Value, prompt: Value, adminckey: Value, playerckey: Value, page: Value, banedit: Value, banid: Value, bantype: Value, banckey: Value, banip: Value, bancid: Value, banduration: Value, banjob: Value, banreason: Value, playermob: Value, M: Value, timer: Value, ratio: Value, M_0: Value, delmob: Value, banfolder: Value, key: Value, reason: Value, banfolder_1: Value, reason2: Value, temp: Value, minutes: Value, banned_key: Value, duration: Value, mins: Value, reason_1: Value, dat: Value, counter: Value, jobPos: Value, isbanned_dept: Value, joblist: Value, jobPos_2: Value, notbannedlist: Value, job: Value, mins_3: Value, reason_4: Value, msg: Value, job_6: Value, reason_3: Value, msg_4: Value, job_5: Value, msg_3: Value, job_4: Value, reason_5: Value, target_ckey: Value, message_id: Value, target: Value, query_get_message_edits: Value, edit_log: Value, mins_1: Value, reason_2: Value, AH_4: Value, msg_2: Value, AH_3: Value, dat_0: Value, mode: Value, H: Value, Mo: Value, speech: Value, NP: Value, L: Value, I: Value, observer: Value, L_0: Value, AM: Value, C: Value, A: Value, x: Value, y: Value, z: Value, C_3: Value, location_description: Value, special_role_description: Value, health_description: Value, gender_description: Value, _T: Value, L_6: Value, status: Value, Add: Value, job_1: Value, Remove: Value, Unlimit: Value, Limit: Value, cookie: Value, input: Value, charter: Value, H_1: Value, loc: Value, dirty_paths: Value, paths: Value, dirty_path: Value, path: Value, offset: Value, number: Value, X: Value, Y: Value, Z: Value, tmp_dir: Value, obj_dir: Value, obj_name: Value, target_11: Value, where: Value, path_13: Value, i: Value, O: Value, N: Value, M_16: Value, L_16: Value, I_17: Value, R: Value, check: Value, FC: Value, choice: Value, available_channels: Value, F: Value, NEWSCASTER: Value, already_wanted: Value, input_param: Value, choice_0: Value, FC_0: Value, MSG: Value, FM: Value, FM_0: Value, afkonly: Value, listkicked: Value, strkicked: Value, name: Value, O_0: Value, code: Value, SD: Value, type_choices: Value, picked: Value, G: Value, newname: Value, description: Value, error_viewer: Value, C_0: Value, thing_to_check: Value, dat_2: Value) {
	f.vars = () => [ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2];
	yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='adminnotice'>You have been sent to the Thunderdome.</span>"]);
	return null;
});

// a spawn(50) body of /datum/admins/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1402", function* (f: Frame, ahelp_ref: Value, AH: Value, strength: Value, E: Value, event: Value, prompt: Value, adminckey: Value, playerckey: Value, page: Value, banedit: Value, banid: Value, bantype: Value, banckey: Value, banip: Value, bancid: Value, banduration: Value, banjob: Value, banreason: Value, playermob: Value, M: Value, timer: Value, ratio: Value, M_0: Value, delmob: Value, banfolder: Value, key: Value, reason: Value, banfolder_1: Value, reason2: Value, temp: Value, minutes: Value, banned_key: Value, duration: Value, mins: Value, reason_1: Value, dat: Value, counter: Value, jobPos: Value, isbanned_dept: Value, joblist: Value, jobPos_2: Value, notbannedlist: Value, job: Value, mins_3: Value, reason_4: Value, msg: Value, job_6: Value, reason_3: Value, msg_4: Value, job_5: Value, msg_3: Value, job_4: Value, reason_5: Value, target_ckey: Value, message_id: Value, target: Value, query_get_message_edits: Value, edit_log: Value, mins_1: Value, reason_2: Value, AH_4: Value, msg_2: Value, AH_3: Value, dat_0: Value, mode: Value, H: Value, Mo: Value, speech: Value, NP: Value, L: Value, I: Value, observer: Value, L_0: Value, AM: Value, C: Value, A: Value, x: Value, y: Value, z: Value, C_3: Value, location_description: Value, special_role_description: Value, health_description: Value, gender_description: Value, _T: Value, L_6: Value, status: Value, Add: Value, job_1: Value, Remove: Value, Unlimit: Value, Limit: Value, cookie: Value, input: Value, charter: Value, H_1: Value, loc: Value, dirty_paths: Value, paths: Value, dirty_path: Value, path: Value, offset: Value, number: Value, X: Value, Y: Value, Z: Value, tmp_dir: Value, obj_dir: Value, obj_name: Value, target_11: Value, where: Value, path_13: Value, i: Value, O: Value, N: Value, M_16: Value, L_16: Value, I_17: Value, R: Value, check: Value, FC: Value, choice: Value, available_channels: Value, F: Value, NEWSCASTER: Value, already_wanted: Value, input_param: Value, choice_0: Value, FC_0: Value, MSG: Value, FM: Value, FM_0: Value, afkonly: Value, listkicked: Value, strkicked: Value, name: Value, O_0: Value, code: Value, SD: Value, type_choices: Value, picked: Value, G: Value, newname: Value, description: Value, error_viewer: Value, C_0: Value, thing_to_check: Value, dat_2: Value) {
	f.vars = () => [ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2];
	yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='adminnotice'>You have been sent to the Thunderdome.</span>"]);
	return null;
});

// a spawn(50) body of /datum/admins/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1378", function* (f: Frame, ahelp_ref: Value, AH: Value, strength: Value, E: Value, event: Value, prompt: Value, adminckey: Value, playerckey: Value, page: Value, banedit: Value, banid: Value, bantype: Value, banckey: Value, banip: Value, bancid: Value, banduration: Value, banjob: Value, banreason: Value, playermob: Value, M: Value, timer: Value, ratio: Value, M_0: Value, delmob: Value, banfolder: Value, key: Value, reason: Value, banfolder_1: Value, reason2: Value, temp: Value, minutes: Value, banned_key: Value, duration: Value, mins: Value, reason_1: Value, dat: Value, counter: Value, jobPos: Value, isbanned_dept: Value, joblist: Value, jobPos_2: Value, notbannedlist: Value, job: Value, mins_3: Value, reason_4: Value, msg: Value, job_6: Value, reason_3: Value, msg_4: Value, job_5: Value, msg_3: Value, job_4: Value, reason_5: Value, target_ckey: Value, message_id: Value, target: Value, query_get_message_edits: Value, edit_log: Value, mins_1: Value, reason_2: Value, AH_4: Value, msg_2: Value, AH_3: Value, dat_0: Value, mode: Value, H: Value, Mo: Value, speech: Value, NP: Value, L: Value, I: Value, observer: Value, L_0: Value, AM: Value, C: Value, A: Value, x: Value, y: Value, z: Value, C_3: Value, location_description: Value, special_role_description: Value, health_description: Value, gender_description: Value, _T: Value, L_6: Value, status: Value, Add: Value, job_1: Value, Remove: Value, Unlimit: Value, Limit: Value, cookie: Value, input: Value, charter: Value, H_1: Value, loc: Value, dirty_paths: Value, paths: Value, dirty_path: Value, path: Value, offset: Value, number: Value, X: Value, Y: Value, Z: Value, tmp_dir: Value, obj_dir: Value, obj_name: Value, target_11: Value, where: Value, path_13: Value, i: Value, O: Value, N: Value, M_16: Value, L_16: Value, I_17: Value, R: Value, check: Value, FC: Value, choice: Value, available_channels: Value, F: Value, NEWSCASTER: Value, already_wanted: Value, input_param: Value, choice_0: Value, FC_0: Value, MSG: Value, FM: Value, FM_0: Value, afkonly: Value, listkicked: Value, strkicked: Value, name: Value, O_0: Value, code: Value, SD: Value, type_choices: Value, picked: Value, G: Value, newname: Value, description: Value, error_viewer: Value, C_0: Value, thing_to_check: Value, dat_2: Value) {
	f.vars = () => [ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2];
	yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='adminnotice'>You have been sent to the Thunderdome.</span>"]);
	return null;
});

// a spawn(50) body of /datum/admins/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/Topic: spawn at modules/admin/topic.dm:1351", function* (f: Frame, ahelp_ref: Value, AH: Value, strength: Value, E: Value, event: Value, prompt: Value, adminckey: Value, playerckey: Value, page: Value, banedit: Value, banid: Value, bantype: Value, banckey: Value, banip: Value, bancid: Value, banduration: Value, banjob: Value, banreason: Value, playermob: Value, M: Value, timer: Value, ratio: Value, M_0: Value, delmob: Value, banfolder: Value, key: Value, reason: Value, banfolder_1: Value, reason2: Value, temp: Value, minutes: Value, banned_key: Value, duration: Value, mins: Value, reason_1: Value, dat: Value, counter: Value, jobPos: Value, isbanned_dept: Value, joblist: Value, jobPos_2: Value, notbannedlist: Value, job: Value, mins_3: Value, reason_4: Value, msg: Value, job_6: Value, reason_3: Value, msg_4: Value, job_5: Value, msg_3: Value, job_4: Value, reason_5: Value, target_ckey: Value, message_id: Value, target: Value, query_get_message_edits: Value, edit_log: Value, mins_1: Value, reason_2: Value, AH_4: Value, msg_2: Value, AH_3: Value, dat_0: Value, mode: Value, H: Value, Mo: Value, speech: Value, NP: Value, L: Value, I: Value, observer: Value, L_0: Value, AM: Value, C: Value, A: Value, x: Value, y: Value, z: Value, C_3: Value, location_description: Value, special_role_description: Value, health_description: Value, gender_description: Value, _T: Value, L_6: Value, status: Value, Add: Value, job_1: Value, Remove: Value, Unlimit: Value, Limit: Value, cookie: Value, input: Value, charter: Value, H_1: Value, loc: Value, dirty_paths: Value, paths: Value, dirty_path: Value, path: Value, offset: Value, number: Value, X: Value, Y: Value, Z: Value, tmp_dir: Value, obj_dir: Value, obj_name: Value, target_11: Value, where: Value, path_13: Value, i: Value, O: Value, N: Value, M_16: Value, L_16: Value, I_17: Value, R: Value, check: Value, FC: Value, choice: Value, available_channels: Value, F: Value, NEWSCASTER: Value, already_wanted: Value, input_param: Value, choice_0: Value, FC_0: Value, MSG: Value, FM: Value, FM_0: Value, afkonly: Value, listkicked: Value, strkicked: Value, name: Value, O_0: Value, code: Value, SD: Value, type_choices: Value, picked: Value, G: Value, newname: Value, description: Value, error_viewer: Value, C_0: Value, thing_to_check: Value, dat_2: Value) {
	f.vars = () => [ahelp_ref, AH, strength, E, event, prompt, adminckey, playerckey, page, banedit, banid, bantype, banckey, banip, bancid, banduration, banjob, banreason, playermob, M, timer, ratio, M_0, delmob, banfolder, key, reason, banfolder_1, reason2, temp, minutes, banned_key, duration, mins, reason_1, dat, counter, jobPos, isbanned_dept, joblist, jobPos_2, notbannedlist, job, mins_3, reason_4, msg, job_6, reason_3, msg_4, job_5, msg_3, job_4, reason_5, target_ckey, message_id, target, query_get_message_edits, edit_log, mins_1, reason_2, AH_4, msg_2, AH_3, dat_0, mode, H, Mo, speech, NP, L, I, observer, L_0, AM, C, A, x, y, z, C_3, location_description, special_role_description, health_description, gender_description, _T, L_6, status, Add, job_1, Remove, Unlimit, Limit, cookie, input, charter, H_1, loc, dirty_paths, paths, dirty_path, path, offset, number, X, Y, Z, tmp_dir, obj_dir, obj_name, target_11, where, path_13, i, O, N, M_16, L_16, I_17, R, check, FC, choice, available_channels, F, NEWSCASTER, already_wanted, input_param, choice_0, FC_0, MSG, FM, FM_0, afkonly, listkicked, strkicked, name, O_0, code, SD, type_choices, picked, G, newname, description, error_viewer, C_0, thing_to_check, dat_2];
	yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='adminnotice'>You have been sent to the Thunderdome.</span>"]);
	return null;
});
