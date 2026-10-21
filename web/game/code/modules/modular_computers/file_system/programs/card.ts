// From code/modules/modular_computers/file_system/programs/card.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4162, "/datum/computer_file/program/card_mod", "/datum/computer_file/program", {
	mod_mode: 1,
	is_centcom: 0,
	show_assignments: 0,
	minor: 0,
	authenticated: 0,
	reg_ids: null,
	region_access: null,
	head_subordinates: null,
	target_dept: 0,
	change_position_cooldown: 30,
	blacklisted: null,
	max_relative_positions: 30,
	opened_positions: null,
	filename: "cardmod",
	filedesc: "ID Card Modification",
	program_icon_state: "id",
	extended_desc: "Program for programming employee ID cards to access parts of the station.",
	requires_ntnet: 0,
	size: 8,
	tgui_id: "ntos_card",
	ui_x: 600,
	ui_y: 700,
	transfer_access: 19,
});

// /datum/computer_file/program/card_mod/proc/<init>  (code/modules/modular_computers/file_system/programs/card.dm:18)
rt.def("/datum/computer_file/program/card_mod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reg_ids", rt.list());
	rt.setSv(f, "blacklisted", rt.list("AI", "Assistant", "Cyborg", "Captain", "Head of Personnel", "Head of Security", "Chief Engineer", "Research Director", "Chief Medical Officer"));
	$0 = $0;
	rt.setSv(f, "opened_positions", rt.list());
	return f.dot;
});

// /datum/computer_file/program/card_mod/proc/New  (code/modules/modular_computers/file_system/programs/card.dm:43)  may sleep
rt.def("/datum/computer_file/program/card_mod/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/computer_file/program/card_mod/proc/SetConfigCooldown")])), 0]);
	return f.dot;
}, true);

// /datum/computer_file/program/card_mod/proc/event_idremoved  (code/modules/modular_computers/file_system/programs/card.dm:50)
rt.def("/datum/computer_file/program/card_mod/proc/event_idremoved", function event_idremoved(f: Frame, background: Value, slot: Value) {
	if (!(!truthy(live(slot)) || isEqual(live(slot), 2))) return f.dot;
	rt.setSv(f, "minor", 0);
	rt.setSv(f, "authenticated", 0);
	rt.setSv(f, "head_subordinates", null);
	rt.setSv(f, "region_access", null);
	return f.dot;
});

// /datum/computer_file/program/card_mod/proc/job_blacklisted  (code/modules/modular_computers/file_system/programs/card.dm:58)
rt.def("/datum/computer_file/program/card_mod/proc/job_blacklisted", function job_blacklisted(f: Frame, jobtitle: Value) {
	return (rt.isIn(f, live(jobtitle), rt.sv(f, "blacklisted")) ? 1 : 0);
});

// /datum/computer_file/program/card_mod/proc/can_open_job  (code/modules/modular_computers/file_system/programs/card.dm:64)
rt.def("/datum/computer_file/program/card_mod/proc/can_open_job", function can_open_job(f: Frame, job: Value) {
	let delta: Value = null;
	f.vars = () => [delta];
	if (truthy(live(job))) {
		if (!truthy(rt.callSrc(f, "job_blacklisted", [rt.fv(f, "title", live(job))]))) {
			if (rt.le(rt.fv(f, "total_positions", live(job)), multiply(rt.len(f, rt.gl("player_list")), divide(rt.sv(f, "max_relative_positions"), 100)))) {
				delta = subtract(divide(rt.worldTime(f), 10), rt.gl("time_last_changed_position"));
				if ((rt.lt(rt.sv(f, "change_position_cooldown"), live(delta)) || rt.lt(rt.index(rt.sv(f, "opened_positions"), rt.fv(f, "title", live(job))), 0))) {
					return 1;
				}
				return -2;
			}
			return 0;
		}
	}
	return 0;
});

// /datum/computer_file/program/card_mod/proc/can_close_job  (code/modules/modular_computers/file_system/programs/card.dm:76)
rt.def("/datum/computer_file/program/card_mod/proc/can_close_job", function can_close_job(f: Frame, job: Value) {
	let delta: Value = null;
	f.vars = () => [delta];
	if (truthy(live(job))) {
		if (!truthy(rt.callSrc(f, "job_blacklisted", [rt.fv(f, "title", live(job))]))) {
			if (rt.gt(rt.fv(f, "total_positions", live(job)), rt.fv(f, "current_positions", live(job)))) {
				delta = subtract(divide(rt.worldTime(f), 10), rt.gl("time_last_changed_position"));
				if ((rt.lt(rt.sv(f, "change_position_cooldown"), live(delta)) || rt.gt(rt.index(rt.sv(f, "opened_positions"), rt.fv(f, "title", live(job))), 0))) {
					return 1;
				}
				return -2;
			}
			return 0;
		}
	}
	return 0;
});

// /datum/computer_file/program/card_mod/proc/format_jobs  (code/modules/modular_computers/file_system/programs/card.dm:86)
rt.def("/datum/computer_file/program/card_mod/proc/format_jobs", function format_jobs(f: Frame, jobs: Value) {
	let card_slot: Value = null, id_card: Value = null, formatted: Value = null, job: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	f.vars = () => [card_slot, id_card, formatted, job, $0, $1, $2, $3, $4, $e];
	card_slot = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "CARD");
	id_card = rt.fv(f, "stored_card", live(card_slot));
	formatted = rt.list();
	job = null;
	rt.forList(f, 0, live(jobs));
	while (($e = rt.next(f, 0)) !== undefined) {
		job = $e;
		$0 = live(formatted);
		$1 = "display_name";
		$2 = rt.call(f, P("/proc/replacetext"), null, [live(job), "&nbsp", " "]);
		$3 = "target_rank";
		if ((truthy(live(id_card)) && truthy(rt.fv(f, "assignment", live(id_card))))) {
			$4 = rt.fv(f, "assignment", live(id_card));
		} else {
			$4 = "Unassigned";
		}
		rt.callName(f, $0, "Add", [rt.list(rt.alist(f, [$1, $2, $3, $4, "job", live(job)]))]);
	}
	rt.endFor(f, 0);
	return live(formatted);
});

// /datum/computer_file/program/card_mod/proc/ui_act  (code/modules/modular_computers/file_system/programs/card.dm:98)  may sleep
rt.def("/datum/computer_file/program/card_mod/proc/ui_act", function* ui_act(f: Frame) {
	let card_slot: Value = null, printer: Value = null, user_id_card: Value = null, user: Value = null, id_card: Value = null, auth_card: Value = null, h: Value = null, contents: Value = null, known_access_rights: Value = null, A: Value = null, select: Value = null, I: Value = null, temp_name: Value = null, t1: Value = null, temp_t: Value = null, access: Value = null, jobdatum: Value = null, jobtype: Value = null, J: Value = null, access_type: Value = null, access_allowed: Value = null, edit_job_target: Value = null, j: Value = null, regsel: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [card_slot, printer, user_id_card, user, id_card, auth_card, h, contents, known_access_rights, A, select, I, temp_name, t1, temp_t, access, jobdatum, jobtype, J, access_type, access_allowed, edit_job_target, j, regsel, $0, $1, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	card_slot = null;
	printer = null;
	if (truthy(rt.sv(f, "computer"))) {
		card_slot = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "CARD");
		printer = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "PRINT");
		if (!truthy(live(card_slot))) {
			return live(f.dot);
		}
	}
	user_id_card = null;
	user = live(f.usr);
	id_card = rt.fv(f, "stored_card", live(card_slot));
	if (truthy((auth_card = rt.fv(f, "stored_card2", live(card_slot))))) {
		user_id_card = live(auth_card);
	} else {
		if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
			user_id_card = (yield* g.callName(f, (h = live(user)), "get_idcard", []));
		}
	}
	$0 = live(f.args[0]);
	if ($0 === "PRG_switchm") {
		if (isEqual(rt.at(live(f.args[1]), "target"), "mod")) {
			rt.setSv(f, "mod_mode", 1);
		} else {
			if (isEqual(rt.at(live(f.args[1]), "target"), "manifest")) {
				rt.setSv(f, "mod_mode", 0);
			} else {
				if (isEqual(rt.at(live(f.args[1]), "target"), "manage")) {
					rt.setSv(f, "mod_mode", 2);
				}
			}
		}
	} else if ($0 === "PRG_togglea") {
		if (truthy(rt.sv(f, "show_assignments"))) {
			rt.setSv(f, "show_assignments", 0);
		} else {
			rt.setSv(f, "show_assignments", 1);
		}
	} else if ($0 === "PRG_print") {
		if ((truthy(rt.sv(f, "computer")) && truthy(live(printer)))) {
			if (truthy(rt.sv(f, "mod_mode"))) {
				if (truthy((yield* g.srcCall(f, "authorized")))) {
					if ((truthy(live(user_id_card)) && truthy(rt.fv(f, "registered_name", live(user_id_card))))) {
						$0 = rt.fv(f, "registered_name", live(user_id_card));
					} else {
						$0 = "Unknown";
					}
					if (truthy(rt.fv(f, "registered_name", live(id_card)))) {
						$1 = rt.fv(f, "registered_name", live(id_card));
					} else {
						$1 = "Unregistered";
					}
					contents = fmt("<h4>Access Report</h4>\n\t\t\t\t\t\t\t\t\t<u>Prepared By:</u> ＀<br>\n\t\t\t\t\t\t\t\t\t<u>For:</u> ＀<br>\n\t\t\t\t\t\t\t\t\t<hr>\n\t\t\t\t\t\t\t\t\t<u>Assignment:</u> ＀<br>\n\t\t\t\t\t\t\t\t\t<u>Access:</u><br>\n\t\t\t\t\t\t\t\t", [$0, $1, rt.fv(f, "assignment", live(id_card))]);
					known_access_rights = (yield* g.call(f, P("/proc/get_all_accesses"), null, []));
					A = null;
					rt.forList(f, 0, rt.fv(f, "access", live(id_card)));
					while (($e = rt.next(f, 0)) !== undefined) {
						A = $e;
						if (truthy((rt.isIn(f, live(A), live(known_access_rights)) ? 1 : 0))) {
							contents = rt.modify(live(contents), fmt("  ＀", [(yield* g.call(f, P("/proc/get_access_desc"), null, [live(A)]))]), add);
						}
					}
					rt.endFor(f, 0);
					if (!truthy((yield* g.callName(f, live(printer), "print_text", [live(contents), "access report"])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Hardware error: Printer was unable to print the file. It may be out of paper.</span>"]);
						return live(f.dot);
					} else {
						yield* g.callName(f, rt.sv(f, "computer"), "visible_message", [fmt("<span class='notice'>＄！ prints out paper.</span>", [rt.sv(f, "computer")])]);
					}
				}
			} else {
				if (truthy(rt.gl("data_core"))) {
					$0 = (yield* g.callName(f, rt.gl("data_core"), "get_manifest", [0]));
				} else {
					$0 = "";
				}
				contents = fmt("<h4>Crew Manifest</h4>\n\t\t\t\t\t\t\t\t\t<br>\n\t\t\t\t\t\t\t\t\t＀\n\t\t\t\t\t\t\t\t\t", [$0]);
				if (!truthy((yield* g.callName(f, live(printer), "print_text", [live(contents), fmt("crew manifest (＀)", [(yield* g.call(f, P("/proc/worldtime2text"), null, []))])])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Hardware error: Printer was unable to print the file. It may be out of paper.</span>"]);
					return live(f.dot);
				} else {
					yield* g.callName(f, rt.sv(f, "computer"), "visible_message", [fmt("<span class='notice'>＄！ prints out paper.</span>", [rt.sv(f, "computer")])]);
				}
			}
		}
	} else if ($0 === "PRG_eject") {
		if ((truthy(rt.sv(f, "computer")) && truthy(live(card_slot)))) {
			$0 = (select = rt.at(live(f.args[1]), "target"));
			if ($0 === "id") {
				if (truthy(live(id_card))) {
					yield* g.callName(f, rt.gl("data_core"), "manifest_modify", [rt.fv(f, "registered_name", live(id_card)), rt.fv(f, "assignment", live(id_card))]);
					yield* g.callName(f, live(card_slot), "try_eject", [1, live(user)]);
				} else {
					if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
						if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
							return live(f.dot);
						}
						yield* g.callName(f, live(I), "forceMove", [rt.sv(f, "computer")]);
						rt.setFv(f, "stored_card", live(card_slot), live(I));
					}
				}
			} else if ($0 === "auth") {
				if (truthy(live(auth_card))) {
					if (truthy(live(id_card))) {
						yield* g.callName(f, rt.gl("data_core"), "manifest_modify", [rt.fv(f, "registered_name", live(id_card)), rt.fv(f, "assignment", live(id_card))]);
					}
					rt.setSv(f, "head_subordinates", null);
					rt.setSv(f, "region_access", null);
					rt.setSv(f, "authenticated", 0);
					rt.setSv(f, "minor", 0);
					yield* g.callName(f, live(card_slot), "try_eject", [2, live(user)]);
				} else {
					if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
						if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
							return live(f.dot);
						}
						yield* g.callName(f, live(I), "forceMove", [rt.sv(f, "computer")]);
						rt.setFv(f, "stored_card2", live(card_slot), live(I));
					}
				}
			}
		}
	} else if ($0 === "PRG_terminate") {
		if ((truthy(rt.sv(f, "computer")) && (truthy((rt.isIn(f, rt.fv(f, "assignment", live(id_card)), rt.sv(f, "head_subordinates")) ? 1 : 0)) || isEqual(rt.fv(f, "assignment", live(id_card)), "Assistant")))) {
			rt.setFv(f, "assignment", live(id_card), "Unassigned");
			yield* g.srcCall(f, "remove_nt_access", live(id_card));
		}
	} else if ($0 === "PRG_edit") {
		if ((truthy(rt.sv(f, "computer")) && truthy((yield* g.srcCall(f, "authorized"))))) {
			if (truthy(rt.at(live(f.args[1]), "name"))) {
				if (truthy((temp_name = (yield* g.call(f, P("/proc/reject_bad_name"), null, [(yield* g.op(f, "Prompt", [2], [null, rt.fv(f, "registered_name", live(id_card)), "Name", "Enter name.", null]))]))))) {
					rt.setFv(f, "registered_name", live(id_card), live(temp_name));
				} else {
					yield* g.callName(f, rt.sv(f, "computer"), "visible_message", [fmt("<span class='notice'>＀ buzzes rudely.</span>", [rt.sv(f, "computer")])]);
				}
			}
		}
	} else if ($0 === "PRG_assign") {
		if (((truthy(rt.sv(f, "computer")) && truthy((yield* g.srcCall(f, "authorized")))) && truthy(live(id_card)))) {
			if (isEqual((t1 = rt.at(live(f.args[1]), "assign_target")), "Custom")) {
				if (truthy((temp_t = (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [2], [null, rt.fv(f, "assignment", live(id_card)), "Assignment", "Enter a custom job assignment.", null])), 45]))))) {
					rt.setFv(f, "assignment", live(id_card), live(temp_t));
				}
			} else {
				access = rt.list();
				if (truthy(rt.sv(f, "is_centcom"))) {
					access = (yield* g.call(f, P("/proc/get_centcom_access"), null, [live(t1)]));
				} else {
					jobdatum = null;
					jobtype = null;
					rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [T("/datum/job")])));
					while (($e = rt.next(f, 0)) !== undefined) {
						jobtype = $e;
						if (isEqual((yield* g.call(f, P("/proc/ckey"), null, [rt.gv(f, "title", (J = (yield* g.new_(f, live(jobtype), []))))])), (yield* g.call(f, P("/proc/ckey"), null, [live(t1)])))) {
							jobdatum = live(J);
							break;
						}
					}
					rt.endFor(f, 0);
					if (!truthy(live(jobdatum))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>No log exists for this job: ＀</span>", [live(t1)])]);
						return live(f.dot);
					}
					access = (yield* g.callName(f, live(jobdatum), "get_access", []));
				}
				yield* g.srcCall(f, "remove_nt_access", live(id_card));
				yield* g.srcCall(f, "apply_access", live(id_card), live(access));
				rt.setFv(f, "assignment", live(id_card), live(t1));
			}
		}
	} else if ($0 === "PRG_access") {
		if (((truthy(rt.at(live(f.args[1]), "allowed")) && truthy(rt.sv(f, "computer"))) && truthy((yield* g.srcCall(f, "authorized"))))) {
			access_type = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "access_target")]));
			access_allowed = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "allowed")]));
			$0 = live(access_type);
			if (truthy(rt.sv(f, "is_centcom"))) {
				$1 = (yield* g.call(f, P("/proc/get_all_centcom_access"), null, []));
			} else {
				$1 = (yield* g.call(f, P("/proc/get_all_accesses"), null, []));
			}
			if (truthy((rt.isIn(f, $0, $1) ? 1 : 0))) {
				(rt.modField(f, live(id_card), "access", live(access_type), subtract));
				if (!truthy(live(access_allowed))) {
					rt.modField(f, live(id_card), "access", live(access_type), add);
				}
			}
		}
	} else if ($0 === "PRG_open_job") {
		edit_job_target = rt.at(live(f.args[1]), "target");
		if (!truthy((j = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", [live(edit_job_target)]))))) {
			return 0;
		}
		if (!isEqual((yield* g.srcCall(f, "can_open_job", live(j))), 1)) {
			return 0;
		}
		if (rt.ge(rt.index(rt.sv(f, "opened_positions"), live(edit_job_target)), 0)) {
			rt.setGl("time_last_changed_position", divide(rt.worldTime(f), 10));
		}
		rt.incField(f, live(j), "total_positions", 1, true);
		rt.incAt(rt.sv(f, "opened_positions"), live(edit_job_target), 1, true);
	} else if ($0 === "PRG_close_job") {
		edit_job_target = rt.at(live(f.args[1]), "target");
		if (!truthy((j = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", [live(edit_job_target)]))))) {
			return 0;
		}
		if (!isEqual((yield* g.srcCall(f, "can_close_job", live(j))), 1)) {
			return 0;
		}
		if (rt.le(rt.index(rt.sv(f, "opened_positions"), live(edit_job_target)), 0)) {
			rt.setGl("time_last_changed_position", divide(rt.worldTime(f), 10));
		}
		rt.incField(f, live(j), "total_positions", -1, true);
		rt.incAt(rt.sv(f, "opened_positions"), live(edit_job_target), -1, true);
	} else if ($0 === "PRG_regsel") {
		if (!truthy(rt.sv(f, "reg_ids"))) {
			rt.setSv(f, "reg_ids", rt.list());
		}
		if (truthy((rt.isIn(f, (regsel = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "region")]))), rt.sv(f, "reg_ids")) ? 1 : 0))) {
			(rt.modSrcVar(f, "reg_ids", live(regsel), subtract));
		} else {
			rt.modSrcVar(f, "reg_ids", live(regsel), add);
		}
	}
	if (truthy(live(id_card))) {
		rt.setFv(f, "name", live(id_card), fmt("＀'s ID Card (＀)", [rt.fv(f, "registered_name", live(id_card)), rt.fv(f, "assignment", live(id_card))]));
	}
	return 1;
}, true, { args: ["action", "params"] });

// /datum/computer_file/program/card_mod/proc/remove_nt_access  (code/modules/modular_computers/file_system/programs/card.dm:289)
rt.def("/datum/computer_file/program/card_mod/proc/remove_nt_access", function remove_nt_access(f: Frame, id_card: Value) {
	(rt.modField(f, live(id_card), "access", rt.call(f, P("/proc/get_all_accesses"), null, []), subtract));
	(rt.modField(f, live(id_card), "access", rt.call(f, P("/proc/get_all_centcom_access"), null, []), subtract));
	return f.dot;
});

// /datum/computer_file/program/card_mod/proc/apply_access  (code/modules/modular_computers/file_system/programs/card.dm:293)
rt.def("/datum/computer_file/program/card_mod/proc/apply_access", function apply_access(f: Frame, id_card: Value, accesses: Value) {
	(rt.modField(f, live(id_card), "access", live(accesses), rt.bitOr));
	return f.dot;
});

// /datum/computer_file/program/card_mod/proc/ui_data  (code/modules/modular_computers/file_system/programs/card.dm:297)  may sleep
rt.def("/datum/computer_file/program/card_mod/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, card_slot: Value = null, printer: Value = null, authed: Value = null, auth_card: Value = null, pos: Value = null, job: Value = null, status_open: Value = null, status_close: Value = null, crew: Value = null, t: Value = null, id_card: Value = null, all_centcom_access: Value = null, access: Value = null, regions: Value = null, i: Value = null, accesses: Value = null, access_8: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $9: any, $10: any, $e: any;
	f.vars = () => [user, data, card_slot, printer, authed, auth_card, pos, job, status_open, status_close, crew, t, id_card, all_centcom_access, access, regions, i, accesses, access_8, $0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $e];
	data = (yield* g.srcCall(f, "get_header_data"));
	card_slot = null;
	printer = null;
	if (truthy(rt.sv(f, "computer"))) {
		card_slot = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "CARD");
		printer = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "PRINT");
	}
	rt.setAt(live(data), "mmode", rt.sv(f, "mod_mode"));
	authed = 0;
	if (truthy(rt.sv(f, "computer"))) {
		if (truthy(live(card_slot))) {
			auth_card = rt.fv(f, "stored_card2", live(card_slot));
			$0 = live(data);
			$1 = "auth_name";
			if (truthy(live(auth_card))) {
				$2 = (yield* g.call(f, P("/proc/strip_html_simple"), null, [rt.fv(f, "name", live(auth_card))]));
			} else {
				$2 = "-----";
			}
			rt.setAt($0, $1, $2);
			authed = (yield* g.srcCall(f, "authorized"));
		}
	}
	if (isEqual(rt.sv(f, "mod_mode"), 2)) {
		rt.setAt(live(data), "slots", rt.list());
		pos = rt.list();
		job = null;
		rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
		while (($e = rt.next(f, 0)) !== undefined) {
			job = $e;
			if (truthy((rt.isIn(f, rt.fv(f, "title", live(job)), rt.sv(f, "blacklisted")) ? 1 : 0))) {
				continue;
			}
			status_open = (yield* g.srcCall(f, "build_manage", live(job), 1));
			status_close = (yield* g.srcCall(f, "build_manage", live(job), 0));
			$0 = live(pos);
			$1 = "title";
			$2 = rt.fv(f, "title", live(job));
			$3 = "current";
			$4 = rt.fv(f, "current_positions", live(job));
			$5 = "total";
			$6 = rt.fv(f, "total_positions", live(job));
			$7 = "status_open";
			if ((truthy(live(authed)) && !truthy(rt.sv(f, "minor")))) {
				$8 = rt.at(live(status_open), "enable");
			} else {
				$8 = 0;
			}
			$9 = "status_close";
			if ((truthy(live(authed)) && !truthy(rt.sv(f, "minor")))) {
				$10 = rt.at(live(status_close), "enable");
			} else {
				$10 = 0;
			}
			yield* g.callName(f, $0, "Add", [rt.list(rt.alist(f, [$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, "desc_open", rt.at(live(status_open), "desc"), "desc_close", rt.at(live(status_close), "desc")]))]);
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "slots", live(pos));
	}
	rt.setAt(live(data), "src", fmt("＃", [live(f.src)]));
	rt.setAt(live(data), "station_name", (yield* g.call(f, P("/proc/station_name"), null, [])));
	if (!truthy(rt.sv(f, "mod_mode"))) {
		rt.setAt(live(data), "manifest", rt.list());
		crew = rt.list();
		t = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/sortRecord"), null, [rt.fv(f, "general", rt.gl("data_core"))])), T("/datum/data/record"));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			yield* g.callName(f, live(crew), "Add", [rt.list(rt.alist(f, ["name", rt.index(rt.fv(f, "fields", live(t)), "name"), "rank", rt.index(rt.fv(f, "fields", live(t)), "rank")]))]);
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "manifest", live(crew));
	}
	rt.setAt(live(data), "assignments", rt.sv(f, "show_assignments"));
	if (truthy(rt.sv(f, "computer"))) {
		rt.setAt(live(data), "have_id_slot", (truthy(live(card_slot)) ? 1 : 0));
		rt.setAt(live(data), "have_printer", (truthy(live(printer)) ? 1 : 0));
		if ((!truthy(live(card_slot)) && isEqual(rt.sv(f, "mod_mode"), 1))) {
			rt.setSv(f, "mod_mode", 0);
		}
	} else {
		rt.setAt(live(data), "have_id_slot", 0);
		rt.setAt(live(data), "have_printer", 0);
	}
	rt.setAt(live(data), "centcom_access", rt.sv(f, "is_centcom"));
	rt.setAt(live(data), "authenticated", live(authed));
	if ((isEqual(rt.sv(f, "mod_mode"), 1) && truthy(rt.sv(f, "computer")))) {
		if (truthy(live(card_slot))) {
			id_card = rt.fv(f, "stored_card", live(card_slot));
			rt.setAt(live(data), "has_id", (truthy(live(id_card)) ? 1 : 0));
			$0 = live(data);
			$1 = "id_rank";
			if ((truthy(live(id_card)) && truthy(rt.fv(f, "assignment", live(id_card))))) {
				$2 = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "assignment", live(id_card))]));
			} else {
				$2 = "Unassigned";
			}
			rt.setAt($0, $1, $2);
			$0 = live(data);
			$1 = "id_owner";
			if ((truthy(live(id_card)) && truthy(rt.fv(f, "registered_name", live(id_card))))) {
				$2 = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "registered_name", live(id_card))]));
			} else {
				$2 = "-----";
			}
			rt.setAt($0, $1, $2);
			$0 = live(data);
			$1 = "id_name";
			if (truthy(live(id_card))) {
				$2 = (yield* g.call(f, P("/proc/strip_html_simple"), null, [rt.fv(f, "name", live(id_card))]));
			} else {
				$2 = "-----";
			}
			rt.setAt($0, $1, $2);
			if (truthy(rt.sv(f, "show_assignments"))) {
				rt.setAt(live(data), "engineering_jobs", (yield* g.srcCall(f, "format_jobs", rt.gl("engineering_positions"))));
				rt.setAt(live(data), "medical_jobs", (yield* g.srcCall(f, "format_jobs", rt.gl("medical_positions"))));
				rt.setAt(live(data), "science_jobs", (yield* g.srcCall(f, "format_jobs", rt.gl("science_positions"))));
				rt.setAt(live(data), "security_jobs", (yield* g.srcCall(f, "format_jobs", rt.gl("security_positions"))));
				rt.setAt(live(data), "cargo_jobs", (yield* g.srcCall(f, "format_jobs", rt.gl("supply_positions"))));
				rt.setAt(live(data), "civilian_jobs", (yield* g.srcCall(f, "format_jobs", rt.gl("civilian_positions"))));
				rt.setAt(live(data), "centcom_jobs", (yield* g.srcCall(f, "format_jobs", (yield* g.call(f, P("/proc/get_all_centcom_jobs"), null, [])))));
			}
		}
		if (truthy(rt.fv(f, "stored_card", live(card_slot)))) {
			id_card = rt.fv(f, "stored_card", live(card_slot));
			if (truthy(rt.sv(f, "is_centcom"))) {
				all_centcom_access = rt.list();
				access = null;
				rt.forList(f, 0, (yield* g.call(f, P("/proc/get_all_centcom_access"), null, [])));
				while (($e = rt.next(f, 0)) !== undefined) {
					access = $e;
					$0 = live(all_centcom_access);
					$1 = "desc";
					$2 = (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/get_centcom_access_desc"), null, [live(access)])), "&nbsp", " "]));
					$3 = "ref";
					$4 = live(access);
					$5 = "allowed";
					if (truthy((rt.isIn(f, live(access), rt.fv(f, "access", live(id_card))) ? 1 : 0))) {
						$6 = 1;
					} else {
						$6 = 0;
					}
					yield* g.callName(f, $0, "Add", [rt.list(rt.alist(f, [$1, $2, $3, $4, $5, $6]))]);
				}
				rt.endFor(f, 0);
				rt.setAt(live(data), "all_centcom_access", live(all_centcom_access));
			} else {
				regions = rt.list();
				i = null;
				i = 1;
				while (rt.le(live(i), 7)) {
					if (!((truthy(rt.sv(f, "minor")) || truthy(rt.sv(f, "target_dept"))) && !truthy((rt.isIn(f, live(i), rt.sv(f, "region_access")) ? 1 : 0)))) {
						accesses = rt.list();
						if (truthy((rt.isIn(f, live(i), rt.sv(f, "reg_ids")) ? 1 : 0))) {
							access_8 = null;
							rt.forList(f, 0, (yield* g.call(f, P("/proc/get_region_accesses"), null, [live(i)])));
							while (($e = rt.next(f, 0)) !== undefined) {
								access_8 = $e;
								if (truthy((yield* g.call(f, P("/proc/get_access_desc"), null, [live(access_8)])))) {
									$0 = live(accesses);
									$1 = "desc";
									$2 = (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/get_access_desc"), null, [live(access_8)])), "&nbsp", " "]));
									$3 = "ref";
									$4 = live(access_8);
									$5 = "allowed";
									if (truthy((rt.isIn(f, live(access_8), rt.fv(f, "access", live(id_card))) ? 1 : 0))) {
										$6 = 1;
									} else {
										$6 = 0;
									}
									yield* g.callName(f, $0, "Add", [rt.list(rt.alist(f, [$1, $2, $3, $4, $5, $6]))]);
								}
							}
							rt.endFor(f, 0);
						}
						$0 = live(regions);
						$1 = "name";
						$2 = (yield* g.call(f, P("/proc/get_region_accesses_name"), null, [live(i)]));
						$3 = "regid";
						$4 = live(i);
						$5 = "selected";
						if (truthy((rt.isIn(f, live(i), rt.sv(f, "reg_ids")) ? 1 : 0))) {
							$6 = 1;
						} else {
							$6 = null;
						}
						yield* g.callName(f, $0, "Add", [rt.list(rt.alist(f, [$1, $2, $3, $4, $5, $6, "accesses", live(accesses)]))]);
					}
					i = rt.inc(live(i), 1);
				}
				rt.setAt(live(data), "regions", live(regions));
			}
		}
	}
	$0 = live(data);
	$1 = "minor";
	if ((truthy(rt.sv(f, "target_dept")) || truthy(rt.sv(f, "minor")))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	return live(data);
}, true);

// /datum/computer_file/program/card_mod/proc/build_manage  (code/modules/modular_computers/file_system/programs/card.dm:423)
rt.def("/datum/computer_file/program/card_mod/proc/build_manage", function build_manage(f: Frame, job: Value, open: Value) {
	let out: Value = null, can_change: Value = null, enable: Value = null, time_to_wait: Value = null, mins: Value = null, seconds: Value = null;
	let $0: any, $1: any;
	f.vars = () => [open, out, can_change, enable, time_to_wait, mins, seconds, $0, $1];
	if (live(open) === null) {
		open = 0;
	}
	out = "Denied";
	can_change = 0;
	if (truthy(live(open))) {
		can_change = rt.callSrc(f, "can_open_job", [live(job)]);
	} else {
		can_change = rt.callSrc(f, "can_close_job", [live(job)]);
	}
	enable = 0;
	if (isEqual(live(can_change), 1)) {
		if (truthy(live(open))) {
			$0 = "Open Position";
		} else {
			$0 = "Close Position";
		}
		out = fmt("＀", [$0]);
		enable = 1;
	} else {
		if (isEqual(live(can_change), -2)) {
			time_to_wait = rt.call(f, P("/proc/round"), null, [subtract(rt.sv(f, "change_position_cooldown"), subtract(divide(rt.worldTime(f), 10), rt.gl("time_last_changed_position"))), 1]);
			mins = rt.call(f, P("/proc/round"), null, [divide(live(time_to_wait), 60)]);
			seconds = subtract(live(time_to_wait), multiply(60, live(mins)));
			$0 = live(mins);
			if (rt.lt(live(seconds), 10)) {
				$1 = fmt("0＀", [live(seconds)]);
			} else {
				$1 = fmt("＀", [live(seconds)]);
			}
			out = fmt("Cooldown ongoing: ＀:＀", [$0, $1]);
		} else {
			out = "Denied";
		}
	}
	return rt.alist(f, ["enable", live(enable), "desc", live(out)]);
});

// /datum/computer_file/program/card_mod/proc/authorized  (code/modules/modular_computers/file_system/programs/card.dm:445)
rt.def("/datum/computer_file/program/card_mod/proc/authorized", function authorized(f: Frame) {
	let card_slot: Value = null, auth_card: Value = null;
	f.vars = () => [card_slot, auth_card];
	if ((!truthy(rt.sv(f, "authenticated")) && truthy(rt.sv(f, "computer")))) {
		if (truthy((card_slot = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "CARD")))) {
			if (truthy((auth_card = rt.fv(f, "stored_card2", live(card_slot))))) {
				rt.setSv(f, "region_access", rt.list());
				if (truthy((rt.isIn(f, 15, rt.callName(f, live(auth_card), "GetAccess", [])) ? 1 : 0))) {
					rt.setSv(f, "minor", 0);
					rt.setSv(f, "authenticated", 1);
					return 1;
				} else {
					if ((truthy((rt.isIn(f, 57, rt.fv(f, "access", live(auth_card))) ? 1 : 0)) && (isEqual(rt.sv(f, "target_dept"), 1) || !truthy(rt.sv(f, "target_dept"))))) {
						(rt.modSrcVar(f, "region_access", 1, rt.bitOr));
						(rt.modSrcVar(f, "region_access", 6, rt.bitOr));
						rt.callSrc(f, "get_subordinates", ["Head of Personnel"]);
					}
					if ((truthy((rt.isIn(f, 58, rt.fv(f, "access", live(auth_card))) ? 1 : 0)) && (isEqual(rt.sv(f, "target_dept"), 2) || !truthy(rt.sv(f, "target_dept"))))) {
						(rt.modSrcVar(f, "region_access", 2, rt.bitOr));
						rt.callSrc(f, "get_subordinates", ["Head of Security"]);
					}
					if ((truthy((rt.isIn(f, 40, rt.fv(f, "access", live(auth_card))) ? 1 : 0)) && (isEqual(rt.sv(f, "target_dept"), 3) || !truthy(rt.sv(f, "target_dept"))))) {
						(rt.modSrcVar(f, "region_access", 3, rt.bitOr));
						rt.callSrc(f, "get_subordinates", ["Chief Medical Officer"]);
					}
					if ((truthy((rt.isIn(f, 30, rt.fv(f, "access", live(auth_card))) ? 1 : 0)) && (isEqual(rt.sv(f, "target_dept"), 4) || !truthy(rt.sv(f, "target_dept"))))) {
						(rt.modSrcVar(f, "region_access", 4, rt.bitOr));
						rt.callSrc(f, "get_subordinates", ["Research Director"]);
					}
					if ((truthy((rt.isIn(f, 56, rt.fv(f, "access", live(auth_card))) ? 1 : 0)) && (isEqual(rt.sv(f, "target_dept"), 5) || !truthy(rt.sv(f, "target_dept"))))) {
						(rt.modSrcVar(f, "region_access", 5, rt.bitOr));
						rt.callSrc(f, "get_subordinates", ["Chief Engineer"]);
					}
					if (truthy(rt.len(f, rt.sv(f, "region_access")))) {
						rt.setSv(f, "minor", 1);
						rt.setSv(f, "authenticated", 1);
						return 1;
					}
				}
			}
		}
	} else {
		return rt.sv(f, "authenticated");
	}
	return f.dot;
});

// /datum/computer_file/program/card_mod/proc/get_subordinates  (code/modules/modular_computers/file_system/programs/card.dm:480)
rt.def("/datum/computer_file/program/card_mod/proc/get_subordinates", function get_subordinates(f: Frame, rank: Value) {
	let job: Value = null;
	let $e: any;
	f.vars = () => [job, $e];
	rt.setSv(f, "head_subordinates", rt.list());
	job = null;
	rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
	while (($e = rt.next(f, 0)) !== undefined) {
		job = $e;
		if (truthy((rt.isIn(f, live(rank), rt.fv(f, "department_head", live(job))) ? 1 : 0))) {
			rt.modSrcVar(f, "head_subordinates", rt.fv(f, "title", live(job)), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
