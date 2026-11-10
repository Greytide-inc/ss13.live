// Based on /tg/station's code/modules/modular_computers/file_system/programs/card.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


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

// card.dm:18
rt.def("/datum/computer_file/program/card_mod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reg_ids = list();
	this.blacklisted = list("AI", "Assistant", "Cyborg", "Captain", "Head of Personnel", "Head of Security", "Chief Engineer", "Research Director", "Chief Medical Officer");

	this.opened_positions = list();
	return f.dot;
});

// card.dm:43
rt.def("/datum/computer_file/program/card_mod/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/computer_file/program/card_mod/proc/SetConfigCooldown"))), 0);
	return f.dot;
}, true);

// card.dm:50
rt.def("/datum/computer_file/program/card_mod/proc/event_idremoved", function event_idremoved(f: Frame, background: Value, slot: Value) {
	if (!(!slot || slot == 2)) return f.dot;
	this.minor = 0;
	this.authenticated = 0;
	this.head_subordinates = null;
	this.region_access = null;
	return f.dot;
});

// card.dm:58
rt.def("/datum/computer_file/program/card_mod/proc/job_blacklisted", function job_blacklisted(f: Frame, jobtitle: Value) {
	return (rt.isIn(f, jobtitle, this.blacklisted) ? 1 : 0);
});

// card.dm:64
rt.def("/datum/computer_file/program/card_mod/proc/can_open_job", function can_open_job(f: Frame, job: Value) {
	let delta: Value = null;
	if (job) {
		if (!this.job_blacklisted(job.title)) {
			if (job.total_positions <= rt.len(f, GLOB.player_list) * (this.max_relative_positions / 100)) {
				delta = rt.worldTime(f) / 10 - GLOB.time_last_changed_position;
				if (this.change_position_cooldown < delta || rt.index(this.opened_positions, job.title) < 0) {
					return 1;
				}
				return -2;
			}
			return 0;
		}
	}
	return 0;
});

// card.dm:76
rt.def("/datum/computer_file/program/card_mod/proc/can_close_job", function can_close_job(f: Frame, job: Value) {
	let delta: Value = null;
	if (job) {
		if (!this.job_blacklisted(job.title)) {
			if (job.total_positions > job.current_positions) {
				delta = rt.worldTime(f) / 10 - GLOB.time_last_changed_position;
				if (this.change_position_cooldown < delta || rt.index(this.opened_positions, job.title) > 0) {
					return 1;
				}
				return -2;
			}
			return 0;
		}
	}
	return 0;
});

// card.dm:86
rt.def("/datum/computer_file/program/card_mod/proc/format_jobs", function format_jobs(f: Frame, jobs: Value) {
	let job: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	let card_slot: Value = rt.index(this.computer.all_components, "CARD");
	let id_card: Value = card_slot.stored_card;
	let formatted: Value = list();
	for (job of each(jobs)) {
		$0 = formatted;
		$1 = "display_name";
		$2 = replacetext(job, "&nbsp", " ");
		$3 = "target_rank";
		if (id_card && id_card.assignment) {
			$4 = id_card.assignment;
		} else {
			$4 = "Unassigned";
		}
		$0.Add(list(rt.alist(f, [$1, $2, $3, $4, "job", job])));
	}
	return formatted;
});

// card.dm:98
rt.def("/datum/computer_file/program/card_mod/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let card_slot: Value = null, printer: Value = null, user_id_card: Value = null, auth_card: Value = null, h: Value = null, contents: Value = null, known_access_rights: Value = null, A: Value = null, select: Value = null, I: Value = null, temp_name: Value = null, t1: Value = null, temp_t: Value = null, access: Value = null, jobdatum: Value = null, jobtype: Value = null, J: Value = null, access_type: Value = null, access_allowed: Value = null, edit_job_target: Value = null, j: Value = null, regsel: Value = null;
	let $1: any, $e: any;
	if (yield* parent_proc()) {
		return 1;
	}
	if (this.computer) {
		card_slot = rt.index(this.computer.all_components, "CARD");
		printer = rt.index(this.computer.all_components, "PRINT");
		if (!card_slot) {
			return f.dot;
		}
	}
	let user: Value = f.usr;
	let id_card: Value = card_slot.stored_card;
	if (auth_card = card_slot.stored_card2) {
		user_id_card = auth_card;
	} else if (rt.istype(user, T("/mob/living/carbon/human"))) {
		user_id_card = (h = user).get_idcard();
	}
	let $0: any = action;
	if ($0 === "PRG_switchm") {
		if (rt.at(params, "target") == "mod") {
			this.mod_mode = 1;
		} else if (rt.at(params, "target") == "manifest") {
			this.mod_mode = 0;
		} else if (rt.at(params, "target") == "manage") {
			this.mod_mode = 2;
		}
	} else if ($0 === "PRG_togglea") {
		if (this.show_assignments) {
			this.show_assignments = 0;
		} else {
			this.show_assignments = 1;
		}
	} else if ($0 === "PRG_print") {
		if (this.computer && printer) {
			if (this.mod_mode) {
				if (this.authorized()) {
					if (user_id_card && user_id_card.registered_name) {
						$0 = user_id_card.registered_name;
					} else {
						$0 = "Unknown";
					}
					if (id_card.registered_name) {
						$1 = id_card.registered_name;
					} else {
						$1 = "Unregistered";
					}
					contents = `<h4>Access Report</h4>\n\t\t\t\t\t\t\t\t\t<u>Prepared By:</u> ${$0}<br>\n\t\t\t\t\t\t\t\t\t<u>For:</u> ${$1}<br>\n\t\t\t\t\t\t\t\t\t<hr>\n\t\t\t\t\t\t\t\t\t<u>Assignment:</u> ${id_card.assignment}<br>\n\t\t\t\t\t\t\t\t\t<u>Access:</u><br>\n\t\t\t\t\t\t\t\t`;
					known_access_rights = get_all_accesses();
					for (A of each(id_card.access)) {
						if (rt.isIn(f, A, known_access_rights)) {
							contents += `  ${get_access_desc(A)}`;
						}
					}
					if (!(yield* printer.print_text(contents, "access report"))) {
						to_chat(f.usr, "<span class='notice'>Hardware error: Printer was unable to print the file. It may be out of paper.</span>");
						return f.dot;
					} else {
						this.computer.visible_message(fmt("<span class='notice'>＄！ prints out paper.</span>", [this.computer]));
					}
				}
			} else {
				if (GLOB.data_core) {
					$0 = GLOB.data_core.get_manifest(0);
				} else {
					$0 = "";
				}
				contents = `<h4>Crew Manifest</h4>\n\t\t\t\t\t\t\t\t\t<br>\n\t\t\t\t\t\t\t\t\t${$0}\n\t\t\t\t\t\t\t\t\t`;
				if (!(yield* printer.print_text(contents, `crew manifest (${worldtime2text()})`))) {
					to_chat(f.usr, "<span class='notice'>Hardware error: Printer was unable to print the file. It may be out of paper.</span>");
					return f.dot;
				} else {
					this.computer.visible_message(fmt("<span class='notice'>＄！ prints out paper.</span>", [this.computer]));
				}
			}
		}
	} else if ($0 === "PRG_eject") {
		if (this.computer && card_slot) {
			$0 = (select = rt.at(params, "target"));
			if ($0 === "id") {
				if (id_card) {
					GLOB.data_core.manifest_modify(id_card.registered_name, id_card.assignment);
					yield* card_slot.try_eject(1, user);
				} else if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id"))) {
					if (!(yield* f.usr.drop_item())) {
						return f.dot;
					}
					yield* I.forceMove(this.computer);
					card_slot.stored_card = I;
				}
			} else if ($0 === "auth") {
				if (auth_card) {
					if (id_card) {
						GLOB.data_core.manifest_modify(id_card.registered_name, id_card.assignment);
					}
					this.head_subordinates = null;
					this.region_access = null;
					this.authenticated = 0;
					this.minor = 0;
					yield* card_slot.try_eject(2, user);
				} else if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id"))) {
					if (!(yield* f.usr.drop_item())) {
						return f.dot;
					}
					yield* I.forceMove(this.computer);
					card_slot.stored_card2 = I;
				}
			}
		}
	} else if ($0 === "PRG_terminate") {
		if (this.computer && (rt.isIn(f, id_card.assignment, this.head_subordinates) || id_card.assignment == "Assistant")) {
			id_card.assignment = "Unassigned";
			this.remove_nt_access(id_card);
		}
	} else if ($0 === "PRG_edit") {
		if (this.computer && this.authorized()) {
			if (rt.at(params, "name")) {
				if (temp_name = reject_bad_name((yield* g.op(f, "Prompt", [2], [null, id_card.registered_name, "Name", "Enter name.", null])))) {
					id_card.registered_name = temp_name;
				} else {
					this.computer.visible_message(`<span class='notice'>${this.computer} buzzes rudely.</span>`);
				}
			}
		}
	} else if ($0 === "PRG_assign") {
		if (this.computer && this.authorized() && id_card) {
			if ((t1 = rt.at(params, "assign_target")) == "Custom") {
				if (temp_t = reject_bad_text((yield* g.op(f, "Prompt", [2], [null, id_card.assignment, "Assignment", "Enter a custom job assignment.", null])), 45)) {
					id_card.assignment = temp_t;
				}
			} else {
				access = list();
				if (this.is_centcom) {
					access = get_centcom_access(t1);
				} else {
					for (jobtype of each(typesof(T("/datum/job")))) {
						if (ckey((J = (yield* new_(jobtype))).title) == ckey(t1)) {
							jobdatum = J;
							break;
						}
					}
					if (!jobdatum) {
						to_chat(f.usr, `<span class='warning'>No log exists for this job: ${t1}</span>`);
						return f.dot;
					}
					access = jobdatum.get_access();
				}
				this.remove_nt_access(id_card);
				this.apply_access(id_card, access);
				id_card.assignment = t1;
			}
		}
	} else if ($0 === "PRG_access") {
		if (rt.at(params, "allowed") && this.computer && this.authorized()) {
			access_type = text2num(rt.at(params, "access_target"));
			access_allowed = text2num(rt.at(params, "allowed"));
			$0 = access_type;
			if (rt.isIn(f, $0, this.is_centcom ? get_all_centcom_access() : get_all_accesses())) {
				id_card.access -= access_type;
				if (!access_allowed) {
					id_card.access += access_type;
				}
			}
		}
	} else if ($0 === "PRG_open_job") {
		edit_job_target = rt.at(params, "target");
		if (!(j = (yield* GLOB.SSjob.GetJob(edit_job_target)))) {
			return 0;
		}
		if (this.can_open_job(j) != 1) {
			return 0;
		}
		if (rt.index(this.opened_positions, edit_job_target) >= 0) {
			GLOB.time_last_changed_position = rt.worldTime(f) / 10;
		}
		j.total_positions++;
		rt.incAt(this.opened_positions, edit_job_target, 1, true);
	} else if ($0 === "PRG_close_job") {
		edit_job_target = rt.at(params, "target");
		if (!(j = (yield* GLOB.SSjob.GetJob(edit_job_target)))) {
			return 0;
		}
		if (this.can_close_job(j) != 1) {
			return 0;
		}
		if (rt.index(this.opened_positions, edit_job_target) <= 0) {
			GLOB.time_last_changed_position = rt.worldTime(f) / 10;
		}
		j.total_positions--;
		rt.incAt(this.opened_positions, edit_job_target, -1, true);
	} else if ($0 === "PRG_regsel") {
		if (!this.reg_ids) {
			this.reg_ids = list();
		}
		if (rt.isIn(f, (regsel = text2num(rt.at(params, "region"))), this.reg_ids)) {
			this.reg_ids -= regsel;
		} else {
			this.reg_ids += regsel;
		}
	}
	if (id_card) {
		id_card.name = `${id_card.registered_name}'s ID Card (${id_card.assignment})`;
	}
	return 1;
}, true);

// card.dm:289
rt.def("/datum/computer_file/program/card_mod/proc/remove_nt_access", function remove_nt_access(f: Frame, id_card: Value) {
	id_card.access -= get_all_accesses();
	id_card.access -= get_all_centcom_access();
	return f.dot;
});

// card.dm:293
rt.def("/datum/computer_file/program/card_mod/proc/apply_access", function apply_access(f: Frame, id_card: Value, accesses: Value) {
	(rt.modField(f, id_card, "access", accesses, rt.bitOr));
	return f.dot;
});

// card.dm:297
rt.def("/datum/computer_file/program/card_mod/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let card_slot: Value = null, printer: Value = null, auth_card: Value = null, pos: Value = null, job: Value = null, status_open: Value = null, status_close: Value = null, crew: Value = null, t: Value = null, id_card: Value = null, all_centcom_access: Value = null, access: Value = null, regions: Value = null, i: Value = null, accesses: Value = null, access_8: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $9: any, $10: any, $e: any;
	let data: Value = this.get_header_data();
	if (this.computer) {
		card_slot = rt.index(this.computer.all_components, "CARD");
		printer = rt.index(this.computer.all_components, "PRINT");
	}
	rt.setAt(data, "mmode", this.mod_mode);
	let authed: Value = 0;
	if (this.computer) {
		if (card_slot) {
			auth_card = card_slot.stored_card2;
			rt.setAt(data, "auth_name", auth_card ? strip_html_simple(auth_card.name) : "-----");
			authed = this.authorized();
		}
	}
	if (this.mod_mode == 2) {
		rt.setAt(data, "slots", list());
		pos = list();
		for (job of each(GLOB.SSjob.occupations, T("/datum/job"))) {
			if (rt.isIn(f, job.title, this.blacklisted)) {
				continue;
			}
			status_open = this.build_manage(job, 1);
			status_close = this.build_manage(job, 0);
			$0 = pos;
			$1 = "title";
			$2 = job.title;
			$3 = "current";
			$4 = job.current_positions;
			$5 = "total";
			$6 = job.total_positions;
			$7 = "status_open";
			if (authed && !this.minor) {
				$8 = rt.at(status_open, "enable");
			} else {
				$8 = 0;
			}
			$9 = "status_close";
			if (authed && !this.minor) {
				$10 = rt.at(status_close, "enable");
			} else {
				$10 = 0;
			}
			$0.Add(list(rt.alist(f, [$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, "desc_open", rt.at(status_open, "desc"), "desc_close", rt.at(status_close, "desc")])));
		}
		rt.setAt(data, "slots", pos);
	}
	rt.setAt(data, "src", fmt("＃", [this]));
	rt.setAt(data, "station_name", station_name());
	if (!this.mod_mode) {
		rt.setAt(data, "manifest", list());
		crew = list();
		for (t of each((yield* sortRecord(GLOB.data_core.general)), T("/datum/data/record"))) {
			crew.Add(list(rt.alist(f, ["name", rt.index(t.fields, "name"), "rank", rt.index(t.fields, "rank")])));
		}
		rt.setAt(data, "manifest", crew);
	}
	rt.setAt(data, "assignments", this.show_assignments);
	if (this.computer) {
		rt.setAt(data, "have_id_slot", (card_slot ? 1 : 0));
		rt.setAt(data, "have_printer", (printer ? 1 : 0));
		if (!card_slot && this.mod_mode == 1) {
			this.mod_mode = 0;
		}
	} else {
		rt.setAt(data, "have_id_slot", 0);
		rt.setAt(data, "have_printer", 0);
	}
	rt.setAt(data, "centcom_access", this.is_centcom);
	rt.setAt(data, "authenticated", authed);
	if (this.mod_mode == 1 && this.computer) {
		if (card_slot) {
			id_card = card_slot.stored_card;
			rt.setAt(data, "has_id", (id_card ? 1 : 0));
			rt.setAt(data, "id_rank", id_card && id_card.assignment ? html_encode(id_card.assignment) : "Unassigned");
			rt.setAt(data, "id_owner", id_card && id_card.registered_name ? html_encode(id_card.registered_name) : "-----");
			rt.setAt(data, "id_name", id_card ? strip_html_simple(id_card.name) : "-----");
			if (this.show_assignments) {
				rt.setAt(data, "engineering_jobs", this.format_jobs(GLOB.engineering_positions));
				rt.setAt(data, "medical_jobs", this.format_jobs(GLOB.medical_positions));
				rt.setAt(data, "science_jobs", this.format_jobs(GLOB.science_positions));
				rt.setAt(data, "security_jobs", this.format_jobs(GLOB.security_positions));
				rt.setAt(data, "cargo_jobs", this.format_jobs(GLOB.supply_positions));
				rt.setAt(data, "civilian_jobs", this.format_jobs(GLOB.civilian_positions));
				rt.setAt(data, "centcom_jobs", this.format_jobs(get_all_centcom_jobs()));
			}
		}
		if (card_slot.stored_card) {
			id_card = card_slot.stored_card;
			if (this.is_centcom) {
				all_centcom_access = list();
				for (access of each(get_all_centcom_access())) {
					$0 = all_centcom_access;
					$1 = "desc";
					$2 = replacetext(get_centcom_access_desc(access), "&nbsp", " ");
					$3 = "ref";
					$4 = access;
					$5 = "allowed";
					if (rt.isIn(f, access, id_card.access)) {
						$6 = 1;
					} else {
						$6 = 0;
					}
					$0.Add(list(rt.alist(f, [$1, $2, $3, $4, $5, $6])));
				}
				rt.setAt(data, "all_centcom_access", all_centcom_access);
			} else {
				regions = list();
				i = 1;
				while (i <= 7) {
					if (!((this.minor || this.target_dept) && !rt.isIn(f, i, this.region_access))) {
						accesses = list();
						if (rt.isIn(f, i, this.reg_ids)) {
							access_8 = null;
							for (access_8 of each(get_region_accesses(i))) {
								if (get_access_desc(access_8)) {
									$0 = accesses;
									$1 = "desc";
									$2 = replacetext(get_access_desc(access_8), "&nbsp", " ");
									$3 = "ref";
									$4 = access_8;
									$5 = "allowed";
									if (rt.isIn(f, access_8, id_card.access)) {
										$6 = 1;
									} else {
										$6 = 0;
									}
									$0.Add(list(rt.alist(f, [$1, $2, $3, $4, $5, $6])));
								}
							}
						}
						$0 = regions;
						$1 = "name";
						$2 = get_region_accesses_name(i);
						$3 = "regid";
						$4 = i;
						$5 = "selected";
						if (rt.isIn(f, i, this.reg_ids)) {
							$6 = 1;
						} else {
							$6 = null;
						}
						$0.Add(list(rt.alist(f, [$1, $2, $3, $4, $5, $6, "accesses", accesses])));
					}
					i++;
				}
				rt.setAt(data, "regions", regions);
			}
		}
	}
	rt.setAt(data, "minor", this.target_dept || this.minor ? 1 : 0);
	return data;
}, true);

// card.dm:423
rt.def("/datum/computer_file/program/card_mod/proc/build_manage", function build_manage(f: Frame, job: Value, open: Value) {
	let time_to_wait: Value = null, mins: Value = null, seconds: Value = null;
	open ??= 0;
	let out: Value = "Denied";
	let can_change: Value = 0;
	if (open) {
		can_change = this.can_open_job(job);
	} else {
		can_change = this.can_close_job(job);
	}
	let enable: Value = 0;
	if (can_change == 1) {
		out = `${open ? "Open Position" : "Close Position"}`;
		enable = 1;
	} else if (can_change == -2) {
		time_to_wait = round(this.change_position_cooldown - (rt.worldTime(f) / 10 - GLOB.time_last_changed_position), 1);
		mins = round(time_to_wait / 60);
		seconds = time_to_wait - 60 * mins;
		out = `Cooldown ongoing: ${mins}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
	} else {
		out = "Denied";
	}
	return rt.alist(f, ["enable", enable, "desc", out]);
});

// card.dm:445
rt.def("/datum/computer_file/program/card_mod/proc/authorized", function authorized(f: Frame) {
	let card_slot: Value = null, auth_card: Value = null;
	if (!this.authenticated && this.computer) {
		if (card_slot = rt.index(this.computer.all_components, "CARD")) {
			if (auth_card = card_slot.stored_card2) {
				this.region_access = list();
				if (rt.isIn(f, 15, auth_card.GetAccess())) {
					this.minor = 0;
					this.authenticated = 1;
					return 1;
				} else {
					if (rt.isIn(f, 57, auth_card.access) && (this.target_dept == 1 || !this.target_dept)) {
						(rt.modSrcVar(f, "region_access", 1, rt.bitOr));
						(rt.modSrcVar(f, "region_access", 6, rt.bitOr));
						this.get_subordinates("Head of Personnel");
					}
					if (rt.isIn(f, 58, auth_card.access) && (this.target_dept == 2 || !this.target_dept)) {
						(rt.modSrcVar(f, "region_access", 2, rt.bitOr));
						this.get_subordinates("Head of Security");
					}
					if (rt.isIn(f, 40, auth_card.access) && (this.target_dept == 3 || !this.target_dept)) {
						(rt.modSrcVar(f, "region_access", 3, rt.bitOr));
						this.get_subordinates("Chief Medical Officer");
					}
					if (rt.isIn(f, 30, auth_card.access) && (this.target_dept == 4 || !this.target_dept)) {
						(rt.modSrcVar(f, "region_access", 4, rt.bitOr));
						this.get_subordinates("Research Director");
					}
					if (rt.isIn(f, 56, auth_card.access) && (this.target_dept == 5 || !this.target_dept)) {
						(rt.modSrcVar(f, "region_access", 5, rt.bitOr));
						this.get_subordinates("Chief Engineer");
					}
					if (rt.len(f, this.region_access)) {
						this.minor = 1;
						this.authenticated = 1;
						return 1;
					}
				}
			}
		}
	} else {
		return this.authenticated;
	}
	return f.dot;
});

// card.dm:480
rt.def("/datum/computer_file/program/card_mod/proc/get_subordinates", function get_subordinates(f: Frame, rank: Value) {
	let job: Value = null;
	this.head_subordinates = list();
	for (job of each(GLOB.SSjob.occupations, T("/datum/job"))) {
		if (rt.isIn(f, rank, job.department_head)) {
			this.head_subordinates += job.title;
		}
	}
	return f.dot;
});
