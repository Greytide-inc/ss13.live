// Based on /tg/station's code/game/machinery/computer/card.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// card.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobaltime_last_changed_position", function InitGlobaltime_last_changed_position(f: Frame) {
	GLOB.time_last_changed_position = 0;
	this.gvars_datum_init_order += "time_last_changed_position";
	return f.dot;
});

rt.type(10370, "/obj/machinery/computer/card", "/obj/machinery/computer", {
	scan: null,
	modify: null,
	authenticated: 0,
	mode: 0,
	printing: null,
	region_access: null,
	head_subordinates: null,
	target_dept: 0,
	prioritycount: 0,
	change_position_cooldown: 30,
	blacklisted: null,
	max_relative_positions: 30,
	opened_positions: null,
	light_color: "#6496FA",
	name: "identification console",
	desc: "You can use this to manage jobs and ID access.",
	icon_screen: "id",
	icon_keyboard: "id_key",
	req_one_access: null,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/card"),
});

// card.dm:45
rt.def("/obj/machinery/computer/card/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.blacklisted = list("AI", "Assistant", "Cyborg", "Captain", "Head of Personnel", "Head of Security", "Chief Engineer", "Research Director", "Chief Medical Officer");

	this.opened_positions = list();
	this.req_one_access = list(19, 15);
	return f.dot;
});

// card.dm:50
rt.def("/obj/machinery/computer/card/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.change_position_cooldown = GLOB.config.id_console_jobslot_delay;
	return f.dot;
}, true);

// card.dm:54
rt.def("/obj/machinery/computer/card/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let idcard: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/card/id"))) {
		if (this.check_access((idcard = O))) {
			if (!this.scan) {
				if (!(yield* f.usr.drop_item())) {
					return f.dot;
				}
				idcard.loc = this;
				this.scan = idcard;
				playsound(this, rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0);
			} else if (!this.modify) {
				if (!(yield* f.usr.drop_item())) {
					return f.dot;
				}
				idcard.loc = this;
				this.modify = idcard;
				playsound(this, rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0);
			}
		} else if (!this.modify) {
			if (!(yield* f.usr.drop_item())) {
				return f.dot;
			}
			idcard.loc = this;
			this.modify = idcard;
			playsound(this, rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// card.dm:81
rt.def("/obj/machinery/computer/card/proc/Destroy", function* Destroy(f: Frame) {
	if (this.scan) {
		yield* qdel(this.scan);
		this.scan = null;
	}
	if (this.modify) {
		yield* qdel(this.modify);
		this.modify = null;
	}
	return (yield* parent_proc());
}, true);

// card.dm:89
rt.def("/obj/machinery/computer/card/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	yield* parent_proc();
	if (A == this.scan) {
		this.scan = null;
		yield* this.updateUsrDialog();
	}
	if (A != this.modify) return f.dot;
	this.modify = null;
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// card.dm:99
rt.def("/obj/machinery/computer/card/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	if (this.scan) {
		yield* this.scan.forceMove(this.loc);
		this.scan = null;
	}
	if (!this.modify) return f.dot;
	yield* this.modify.forceMove(this.loc);
	this.modify = null;
	return f.dot;
}, true);

// card.dm:107
rt.def("/obj/machinery/computer/card/proc/job_blacklisted", function job_blacklisted(f: Frame, jobtitle: Value) {
	return (rt.isIn(f, jobtitle, this.blacklisted) ? 1 : 0);
});

// card.dm:113
rt.def("/obj/machinery/computer/card/proc/can_open_job", function can_open_job(f: Frame, job: Value) {
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
			return -1;
		}
	}
	return 0;
});

// card.dm:125
rt.def("/obj/machinery/computer/card/proc/can_close_job", function can_close_job(f: Frame, job: Value) {
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
			return -1;
		}
	}
	return 0;
});

// card.dm:135
rt.def("/obj/machinery/computer/card/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, crew: Value = null, t: Value = null, S: Value = null, ID: Value = null, job: Value = null, time_to_wait: Value = null, mins: Value = null, seconds: Value = null, header: Value = null, target_name: Value = null, target_owner: Value = null, target_rank: Value = null, scan_name: Value = null, jobs_all: Value = null, alljobs: Value = null, job_8: Value = null, body: Value = null, carddesc: Value = null, jobs: Value = null, accesses: Value = null, A: Value = null, i: Value = null, A_13: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* user.set_machine(this);
	if (!GLOB.SSticker) {
		return f.dot;
	}
	if (this.mode == 1) {
		crew = "";
		for (t of each((yield* sortRecord(GLOB.data_core.general)), T("/datum/data/record"))) {
			crew += rt.index(t.fields, "name") + " - " + rt.index(t.fields, "rank") + "<br>";
		}
		dat = fmt("<tt><b>Crew Manifest:</b><br>Please use security record computer to modify entries.<br><br>＀<a href='?src=＃;choice=print'>Print</a><br><br><a href='?src=＃;choice=mode;mode_target=0'>Access ID modification console.</a><br></tt>", [crew, this, this]);
	} else if (this.mode == 2) {
		dat = fmt("<a href='?src=＃;choice=return'>Return</a>", [this]);
		dat += " || Confirm Identity: ";
		if (this.scan) {
			S = html_encode(this.scan.name);
		} else {
			S = "--------";
		}
		dat += fmt("<a href='?src=＃;choice=scan'>＀</a>", [this, S]);
		dat += "<table>";
		dat += "<tr><td style='width:25%'><b>Job</b></td><td style='width:25%'><b>Slots</b></td><td style='width:25%'><b>Open job</b></td><td style='width:25%'><b>Close job</b><td style='width:25%'><b>Prioritize</b></td></td></tr>";
		if (this.scan && rt.isIn(f, 15, this.scan.access) && !this.target_dept) {
			ID = 1;
		} else {
			ID = 0;
		}
		for (job of each(GLOB.SSjob.occupations, T("/datum/job"))) {
			dat += "<tr>";
			if (rt.isIn(f, job.title, this.blacklisted)) {
				continue;
			}
			dat += `<td>${job.title}</td>`;
			dat += `<td>${job.current_positions}/${job.total_positions}</td>`;
			dat += "<td>";
			$0 = this.can_open_job(job);
			if ($0 === 1) {
				if (ID) {
					dat += fmt("<a href='?src=＃;choice=make_job_available;job=＀'>Open Position</a><br>", [this, job.title]);
				} else {
					dat += "Open Position";
				}
			} else if ($0 === -1) {
				dat += "Denied";
			} else if ($0 === -2) {
				time_to_wait = round(this.change_position_cooldown - (rt.worldTime(f) / 10 - GLOB.time_last_changed_position), 1);
				mins = round(time_to_wait / 60);
				seconds = time_to_wait - 60 * mins;
				$0 = mins;
				if (seconds < 10) {
					$1 = `0${seconds}`;
				} else {
					$1 = `${seconds}`;
				}
				dat += `Cooldown ongoing: ${$0}:${$1}`;
			} else if ($0 === 0) {
				dat += "Denied";
			}
			dat += "</td><td>";
			$0 = this.can_close_job(job);
			if ($0 === 1) {
				if (ID) {
					dat += fmt("<a href='?src=＃;choice=make_job_unavailable;job=＀'>Close Position</a>", [this, job.title]);
				} else {
					dat += "Close Position";
				}
			} else if ($0 === -1) {
				dat += "Denied";
			} else if ($0 === -2) {
				time_to_wait = round(this.change_position_cooldown - (rt.worldTime(f) / 10 - GLOB.time_last_changed_position), 1);
				mins = round(time_to_wait / 60);
				seconds = time_to_wait - 60 * mins;
				$0 = mins;
				if (seconds < 10) {
					$1 = `0${seconds}`;
				} else {
					$1 = `${seconds}`;
				}
				dat += `Cooldown ongoing: ${$0}:${$1}`;
			} else if ($0 === 0) {
				dat += "Denied";
			}
			dat += "</td><td>";
			$0 = job.total_positions;
			if ($0 === 0) {
				dat += "Denied";
			} else if (ID) {
				if (rt.isIn(f, job, GLOB.SSjob.prioritized_jobs)) {
					dat += fmt("<a href='?src=＃;choice=prioritize_job;job=＀'>Deprioritize</a>", [this, job.title]);
				} else if (this.prioritycount < 5) {
					dat += fmt("<a href='?src=＃;choice=prioritize_job;job=＀'>Prioritize</a>", [this, job.title]);
				} else {
					dat += "Denied";
				}
			} else {
				dat += "Prioritize";
			}
			dat += "</td></tr>";
		}
		dat += "</table>";
	} else {
		header = "";
		if (this.modify) {
			target_name = html_encode(this.modify.name);
		} else {
			target_name = "--------";
		}
		if (this.modify && this.modify.registered_name) {
			target_owner = html_encode(this.modify.registered_name);
		} else {
			target_owner = "--------";
		}
		if (this.modify && this.modify.assignment) {
			target_rank = html_encode(this.modify.assignment);
		} else {
			target_rank = "Unassigned";
		}
		if (this.scan) {
			scan_name = html_encode(this.scan.name);
		} else {
			scan_name = "--------";
		}
		if (!this.authenticated) {
			header += "<br><i>Please insert the cards into the slots</i><br>";
			header += fmt("Target: <a href='?src=＃;choice=modify'>＀</a><br>", [this, target_name]);
			header += fmt("Confirm Identity: <a href='?src=＃;choice=scan'>＀</a><br>", [this, scan_name]);
		} else {
			header += "<div align='center'><br>";
			header += fmt("<a href='?src=＃;choice=modify'>Remove ＀</a> || ", [this, target_name]);
			header += fmt("<a href='?src=＃;choice=scan'>Remove ＀</a> <br> ", [this, scan_name]);
			header += fmt("<a href='?src=＃;choice=mode;mode_target=1'>Access Crew Manifest</a> <br> ", [this]);
			header += fmt("<a href='?src=＃;choice=logout'>Log Out</a></div>", [this]);
		}
		header += "<hr>";
		jobs_all = "";
		alljobs = list("Unassigned");
		if (rt.istype(this, T("/obj/machinery/computer/card/centcom"))) {
			$0 = get_all_centcom_jobs();
		} else {
			$0 = get_all_jobs();
		}
		alljobs += $0 + "Custom";
		for (job_8 of each(alljobs)) {
			jobs_all += fmt("<a href='?src=＃;choice=assign;assign_target=＀'>＀</a> ", [this, job_8, replacetext(job_8, " ", "&nbsp")]);
		}
		if (this.authenticated && this.modify) {
			carddesc = "";
			jobs = "";
			if (this.authenticated == 2) {
				carddesc += `<script type="text/javascript">\n\t\t\t\t\t\t\t\t\tfunction markRed(){\n\t\t\t\t\t\t\t\t\t\tvar nameField = document.getElementById('namefield');\n\t\t\t\t\t\t\t\t\t\tnameField.style.backgroundColor = "#FFDDDD";\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tfunction markGreen(){\n\t\t\t\t\t\t\t\t\t\tvar nameField = document.getElementById('namefield');\n\t\t\t\t\t\t\t\t\t\tnameField.style.backgroundColor = "#DDFFDD";\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tfunction showAll(){\n\t\t\t\t\t\t\t\t\t\tvar allJobsSlot = document.getElementById('alljobsslot');\n\t\t\t\t\t\t\t\t\t\tallJobsSlot.innerHTML = "<a href='#' onclick='hideAll()'>hide</a><br>"+ "${jobs_all}";\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tfunction hideAll(){\n\t\t\t\t\t\t\t\t\t\tvar allJobsSlot = document.getElementById('alljobsslot');\n\t\t\t\t\t\t\t\t\t\tallJobsSlot.innerHTML = "<a href='#' onclick='showAll()'>show</a>";\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</script>`;
				carddesc += fmt("<form name='cardcomp' action='?src=＃' method='get'>", [this]);
				carddesc += fmt("<input type='hidden' name='src' value='＃'>", [this]);
				carddesc += "<input type='hidden' name='choice' value='reg'>";
				carddesc += `<b>registered name:</b> <input type='text' id='namefield' name='reg' value='${target_owner}' style='width:250px; background-color:white;' onchange='markRed()'>`;
				carddesc += "<input type='submit' value='Rename' onclick='markGreen()'>";
				carddesc += "</form>";
				carddesc += "<b>Assignment:</b> ";
				jobs += `<span id='alljobsslot'><a href='#' onclick='showAll()'>${target_rank}</a></span>`;
			} else {
				carddesc += `<b>registered_name:</b> ${target_owner}</span>`;
				jobs += fmt("<b>Assignment:</b> ＀ (<a href='?src=＃;choice=demote'>Demote</a>)</span>", [target_rank, this]);
			}
			accesses = "";
			if (rt.istype(this, T("/obj/machinery/computer/card/centcom"))) {
				accesses += "<h5>Central Command:</h5>";
				for (A of each(get_all_centcom_access())) {
					if (rt.isIn(f, A, this.modify.access)) {
						accesses += fmt("<a href='?src=＃;choice=access;access_target=＀;allowed=0'><font color=\"red\">＀</font></a> ", [this, A, replacetext(get_centcom_access_desc(A), " ", "&nbsp")]);
					} else {
						accesses += fmt("<a href='?src=＃;choice=access;access_target=＀;allowed=1'>＀</a> ", [this, A, replacetext(get_centcom_access_desc(A), " ", "&nbsp")]);
					}
				}
			} else {
				accesses += "<div align='center'><b>Access</b></div>";
				accesses += "<table style='width:100%'>";
				accesses += "<tr>";
				i = 1;
				while (i <= 7) {
					if (!(this.authenticated == 1 && !rt.isIn(f, i, this.region_access))) {
						accesses += `<td style='width:14%'><b>${get_region_accesses_name(i)}:</b></td>`;
					}
					i++;
				}
				accesses += "</tr><tr>";
				i = 1;
				while (i <= 7) {
					if (!(this.authenticated == 1 && !rt.isIn(f, i, this.region_access))) {
						accesses += "<td style='width:14%' valign='top'>";
						A_13 = null;
						for (A_13 of each(get_region_accesses(i))) {
							if (rt.isIn(f, A_13, this.modify.access)) {
								accesses += fmt("<a href='?src=＃;choice=access;access_target=＀;allowed=0'><font color=\"red\">＀</font></a> ", [this, A_13, replacetext(get_access_desc(A_13), " ", "&nbsp")]);
							} else {
								accesses += fmt("<a href='?src=＃;choice=access;access_target=＀;allowed=1'>＀</a> ", [this, A_13, replacetext(get_access_desc(A_13), " ", "&nbsp")]);
							}
							accesses += "<br>";
						}
						accesses += "</td>";
					}
					i++;
				}
				accesses += "</tr></table>";
			}
			body = `${carddesc}<br>${jobs}<br><br>${accesses}`;
		} else {
			body = fmt("<a href='?src=＃;choice=auth'>{Log in}</a> <br><hr>", [this]);
			body += fmt("<a href='?src=＃;choice=mode;mode_target=1'>Access Crew Manifest</a>", [this]);
			if (!this.target_dept) {
				body += fmt("<br><hr><a href = '?src=＃;choice=mode;mode_target=2'>Job Management</a>", [this]);
			}
		}
		dat = `<tt>${header}${body}<hr><br></tt>`;
	}
	(popup = (yield* new_(T("/datum/browser"), user, "id_com", this.name, 900, 620))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// card.dm:351
rt.def("/obj/machinery/computer/card/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let I: Value = null, access_type: Value = null, access_allowed: Value = null, t1: Value = null, newJob: Value = null, jobdatum: Value = null, jobtype: Value = null, J: Value = null, t2: Value = null, newName: Value = null, edit_job_target: Value = null, j: Value = null, priority_target: Value = null, priority: Value = null, _P: Value = null, t1_1: Value = null, t: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	const item = rt.at(href_list, "choice");
	if (item === "modify") {
		if (this.modify) {
			GLOB.data_core.manifest_modify(this.modify.registered_name, this.modify.assignment);
			this.modify.update_label();
			this.modify.loc = this.loc;
			yield* this.modify.verb_pickup();
			playsound(this, rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0);
			this.modify = null;
			this.region_access = null;
			this.head_subordinates = null;
		} else if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id"))) {
			if (!(yield* f.usr.drop_item())) {
				return f.dot;
			}
			playsound(this, rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0);
			I.loc = this;
			this.modify = I;
		}
		this.authenticated = 0;
	} else if (item === "scan") {
		if (this.scan) {
			this.scan.loc = this.loc;
			yield* this.scan.verb_pickup();
			playsound(this, rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0);
			this.scan = null;
		} else if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id"))) {
			if (!(yield* f.usr.drop_item())) {
				return f.dot;
			}
			playsound(this, rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0);
			I.loc = this;
			this.scan = I;
		}
		this.authenticated = 0;
	} else if (item === "auth") {
		if (!this.authenticated && (this.scan || rt.istype(f.usr, T("/mob/living/silicon"))) && (this.modify || this.mode)) {
			if (this.check_access(this.scan)) {
				this.region_access = list();
				this.head_subordinates = list();
				if (rt.isIn(f, 15, this.scan.access)) {
					if (this.target_dept) {
						this.head_subordinates = get_all_jobs();
						(rt.modSrcVar(f, "region_access", this.target_dept, rt.bitOr));
						this.authenticated = 1;
					} else {
						this.authenticated = 2;
					}
					playsound(this, rt.rsc("sound/machines/terminal_on.ogg"), 50, 0);
				} else {
					if (rt.isIn(f, 57, this.scan.access) && (this.target_dept == 1 || !this.target_dept)) {
						(rt.modSrcVar(f, "region_access", 1, rt.bitOr));
						(rt.modSrcVar(f, "region_access", 6, rt.bitOr));
						this.get_subordinates("Head of Personnel");
					}
					if (rt.isIn(f, 58, this.scan.access) && (this.target_dept == 2 || !this.target_dept)) {
						(rt.modSrcVar(f, "region_access", 2, rt.bitOr));
						this.get_subordinates("Head of Security");
					}
					if (rt.isIn(f, 40, this.scan.access) && (this.target_dept == 3 || !this.target_dept)) {
						(rt.modSrcVar(f, "region_access", 3, rt.bitOr));
						this.get_subordinates("Chief Medical Officer");
					}
					if (rt.isIn(f, 30, this.scan.access) && (this.target_dept == 4 || !this.target_dept)) {
						(rt.modSrcVar(f, "region_access", 4, rt.bitOr));
						this.get_subordinates("Research Director");
					}
					if (rt.isIn(f, 56, this.scan.access) && (this.target_dept == 5 || !this.target_dept)) {
						(rt.modSrcVar(f, "region_access", 5, rt.bitOr));
						this.get_subordinates("Chief Engineer");
					}
					if (this.region_access) {
						this.authenticated = 1;
					}
				}
			}
		} else if (!this.authenticated && rt.istype(f.usr, T("/mob/living/silicon")) && !this.modify) {
			to_chat(f.usr, "<span class='warning'>You can't modify an ID without an ID inserted to modify! Once one is in the modify slot on the computer, you can log in.</span>");
		}
	} else if (item === "logout") {
		this.region_access = null;
		this.head_subordinates = null;
		this.authenticated = 0;
		playsound(this, rt.rsc("sound/machines/terminal_off.ogg"), 50, 0);
	} else if (item === "access") {
		if (rt.at(href_list, "allowed")) {
			if (this.authenticated) {
				access_type = text2num(rt.at(href_list, "access_target"));
				access_allowed = text2num(rt.at(href_list, "allowed"));
				$0 = access_type;
				if (rt.istype(this, T("/obj/machinery/computer/card/centcom"))) {
					$1 = get_all_centcom_access();
				} else {
					$1 = get_all_accesses();
				}
				if (rt.isIn(f, $0, $1)) {
					this.modify.access -= access_type;
					if (access_allowed == 1) {
						this.modify.access += access_type;
					}
					playsound(this, "terminal_type", 50, 0);
				}
			}
		}
	} else if (item === "assign") {
		if (this.authenticated == 2) {
			if ((t1 = rt.at(href_list, "assign_target")) == "Custom") {
				$0 = null;
				if (this.modify) {
					$1 = this.modify.assignment;
				} else {
					$1 = "Unassigned";
				}
				if (newJob = reject_bad_text((yield* g.op(f, "Prompt", [2], [$0, $1, "Assignment", "Enter a custom job assignment.", null])), 42)) {
					t1 = newJob;
				}
			} else if (t1 == "Unassigned") {
				this.modify.access -= get_all_accesses();
			} else {
				for (jobtype of each(typesof(T("/datum/job")))) {
					if (ckey((J = (yield* new_(jobtype))).title) == ckey(t1)) {
						jobdatum = J;
						break;
					}
				}
				if (!jobdatum) {
					to_chat(f.usr, "<span class='error'>No log exists for this job.</span>");
					return f.dot;
				}
				$0 = this.modify;
				if (rt.istype(this, T("/obj/machinery/computer/card/centcom"))) {
					$1 = get_centcom_access(t1);
				} else {
					$1 = jobdatum.get_access();
				}
				$0.access = $1;
			}
			if (this.modify) {
				this.modify.assignment = t1;
				playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
			}
		}
	} else if (item === "demote") {
		if (rt.isIn(f, this.modify.assignment, (this.head_subordinates || (this.modify.assignment == "Assistant" ? 1 : 0)))) {
			this.modify.assignment = "Unassigned";
			playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		} else {
			to_chat(f.usr, "<span class='error'>You are not authorized to demote this position.</span>");
		}
	} else if (item === "reg") {
		if (this.authenticated) {
			t2 = this.modify;
			if (this.authenticated && this.modify == t2 && (get_dist(this, f.usr) <= 1 || rt.istype(f.usr, T("/mob/living/silicon"))) && isturf(this.loc)) {
				if (newName = reject_bad_name(rt.at(href_list, "reg"))) {
					this.modify.registered_name = newName;
					playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
				} else {
					to_chat(f.usr, "<span class='error'>Invalid name entered.</span>");
					return f.dot;
				}
			}
		}
	} else if (item === "mode") {
		this.mode = text2num(rt.at(href_list, "mode_target"));
	} else if (item === "return") {
		this.mode = 3;
		playsound(this, "terminal_type", 25, 0);
	} else if (item === "make_job_available") {
		if (this.scan && rt.isIn(f, 15, this.scan.access) && !this.target_dept) {
			edit_job_target = rt.at(href_list, "job");
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
			playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		}
	} else if (item === "make_job_unavailable") {
		if (this.scan && rt.isIn(f, 15, this.scan.access) && !this.target_dept) {
			edit_job_target = rt.at(href_list, "job");
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
			playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
		}
	} else if (item === "prioritize_job") {
		if (this.scan && rt.isIn(f, 15, this.scan.access) && !this.target_dept) {
			priority_target = rt.at(href_list, "job");
			if (!(j = (yield* GLOB.SSjob.GetJob(priority_target)))) {
				return 0;
			}
			priority = 1;
			if (rt.isIn(f, j, GLOB.SSjob.prioritized_jobs)) {
				GLOB.SSjob.prioritized_jobs -= j;
				this.prioritycount--;
				priority = 0;
			} else {
				GLOB.SSjob.prioritized_jobs += j;
				this.prioritycount++;
			}
			$0 = f.usr;
			$1 = j.title;
			if (priority) {
				$2 = "prioritized";
			} else {
				$2 = "unprioritized";
			}
			to_chat($0, `<span class='notice'>${$1} has been successfully ${$2}. Potential employees will notice your request.</span>`);
			playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		}
	} else if (item === "print") {
		if (!this.printing) {
			this.printing = 1;
			yield* sleep(50);
			_P = (yield* new_(T("/obj/item/weapon/paper"), this.loc));
			t1_1 = "<B>Crew Manifest:</B><BR>";
			for (t of each((yield* sortRecord(GLOB.data_core.general)), T("/datum/data/record"))) {
				t1_1 += rt.index(t.fields, "name") + " - " + rt.index(t.fields, "rank") + "<br>";
			}
			_P.info = t1_1;
			_P.name = "paper- 'Crew Manifest'";
			this.printing = null;
			playsound(this, rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0);
		}
	}
	if (this.modify) {
		this.modify.update_label();
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// card.dm:560
rt.def("/obj/machinery/computer/card/proc/get_subordinates", function get_subordinates(f: Frame, rank: Value) {
	let job: Value = null;
	for (job of each(GLOB.SSjob.occupations, T("/datum/job"))) {
		if (rt.isIn(f, rank, job.department_head)) {
			this.head_subordinates += job.title;
		}
	}
	return f.dot;
});

rt.type(10371, "/obj/machinery/computer/card/centcom", "/obj/machinery/computer/card", {
	name: "１Centcom identification console",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/card/centcom"),
	req_access: null,
});

// card.dm:567
rt.def("/obj/machinery/computer/card/centcom/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(109);
	return f.dot;
});

rt.type(10372, "/obj/machinery/computer/card/minor", "/obj/machinery/computer/card", {
	name: "department management console",
	desc: "You can use this to change ID's for specific departments.",
	icon_screen: "idminor",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/card/minor"),
});

// card.dm:576
rt.def("/obj/machinery/computer/card/minor/proc/New", function* New(f: Frame) {
	let dept_list: Value = null;
	yield* parent_proc();
	let typed_circuit: Value = this.circuit;
	if (this.target_dept) {
		typed_circuit.target_dept = this.target_dept;
	} else {
		this.target_dept = typed_circuit.target_dept;
	}
	this.name = `${rt.index((dept_list = list("general", "security", "medical", "science", "engineering")), this.target_dept)} department console`;
	return f.dot;
}, true);
