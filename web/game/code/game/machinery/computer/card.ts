// From code/game/machinery/computer/card.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaltime_last_changed_position  (code/game/machinery/computer/card.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobaltime_last_changed_position", function InitGlobaltime_last_changed_position(f: Frame) {
	rt.setGl("time_last_changed_position", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "time_last_changed_position", add);
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

// /obj/machinery/computer/card/proc/<init>  (code/game/machinery/computer/card.dm:45)
rt.def("/obj/machinery/computer/card/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "blacklisted", rt.list("AI", "Assistant", "Cyborg", "Captain", "Head of Personnel", "Head of Security", "Chief Engineer", "Research Director", "Chief Medical Officer"));
	$0 = $0;
	rt.setSv(f, "opened_positions", rt.list());
	rt.setSv(f, "req_one_access", rt.list(19, 15));
	return f.dot;
});

// /obj/machinery/computer/card/proc/Initialize  (code/game/machinery/computer/card.dm:50)  may sleep
rt.def("/obj/machinery/computer/card/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "change_position_cooldown", rt.fv(f, "id_console_jobslot_delay", rt.gl("config")));
	return f.dot;
}, true);

// /obj/machinery/computer/card/proc/attackby  (code/game/machinery/computer/card.dm:54)  may sleep
rt.def("/obj/machinery/computer/card/proc/attackby", function* attackby(f: Frame) {
	let idcard: Value = null;
	f.vars = () => [idcard];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "check_access", (idcard = live(f.args[0])))))) {
			if (!truthy(rt.sv(f, "scan"))) {
				if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.setFv(f, "loc", live(idcard), live(f.src));
				rt.setSv(f, "scan", live(idcard));
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0]);
			} else {
				if (!truthy(rt.sv(f, "modify"))) {
					if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setFv(f, "loc", live(idcard), live(f.src));
					rt.setSv(f, "modify", live(idcard));
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0]);
				}
			}
		} else {
			if (!truthy(rt.sv(f, "modify"))) {
				if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.setFv(f, "loc", live(idcard), live(f.src));
				rt.setSv(f, "modify", live(idcard));
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0]);
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/computer/card/proc/Destroy  (code/game/machinery/computer/card.dm:81)  may sleep
rt.def("/obj/machinery/computer/card/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "scan"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "scan")]);
		rt.setSv(f, "scan", null);
	}
	if (truthy(rt.sv(f, "modify"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "modify")]);
		rt.setSv(f, "modify", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/card/proc/handle_atom_del  (code/game/machinery/computer/card.dm:89)  may sleep
rt.def("/obj/machinery/computer/card/proc/handle_atom_del", function* handle_atom_del(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(live(f.args[0]), rt.sv(f, "scan"))) {
		rt.setSv(f, "scan", null);
		yield* g.srcCall(f, "updateUsrDialog");
	}
	if (!isEqual(live(f.args[0]), rt.sv(f, "modify"))) return f.dot;
	rt.setSv(f, "modify", null);
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["A"] });

// /obj/machinery/computer/card/proc/on_deconstruction  (code/game/machinery/computer/card.dm:99)  may sleep
rt.def("/obj/machinery/computer/card/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	if (truthy(rt.sv(f, "scan"))) {
		yield* g.callName(f, rt.sv(f, "scan"), "forceMove", [rt.sv(f, "loc")]);
		rt.setSv(f, "scan", null);
	}
	if (!truthy(rt.sv(f, "modify"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "modify"), "forceMove", [rt.sv(f, "loc")]);
	rt.setSv(f, "modify", null);
	return f.dot;
}, true);

// /obj/machinery/computer/card/proc/job_blacklisted  (code/game/machinery/computer/card.dm:107)
rt.def("/obj/machinery/computer/card/proc/job_blacklisted", function job_blacklisted(f: Frame, jobtitle: Value) {
	return (rt.isIn(f, live(jobtitle), rt.sv(f, "blacklisted")) ? 1 : 0);
});

// /obj/machinery/computer/card/proc/can_open_job  (code/game/machinery/computer/card.dm:113)
rt.def("/obj/machinery/computer/card/proc/can_open_job", function can_open_job(f: Frame, job: Value) {
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
			return -1;
		}
	}
	return 0;
});

// /obj/machinery/computer/card/proc/can_close_job  (code/game/machinery/computer/card.dm:125)
rt.def("/obj/machinery/computer/card/proc/can_close_job", function can_close_job(f: Frame, job: Value) {
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
			return -1;
		}
	}
	return 0;
});

// /obj/machinery/computer/card/proc/attack_hand  (code/game/machinery/computer/card.dm:135)  may sleep
rt.def("/obj/machinery/computer/card/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, crew: Value = null, t: Value = null, S: Value = null, ID: Value = null, job: Value = null, time_to_wait: Value = null, mins: Value = null, seconds: Value = null, header: Value = null, target_name: Value = null, target_owner: Value = null, target_rank: Value = null, scan_name: Value = null, jobs_all: Value = null, alljobs: Value = null, job_8: Value = null, body: Value = null, carddesc: Value = null, jobs: Value = null, accesses: Value = null, A: Value = null, i: Value = null, A_13: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [dat, crew, t, S, ID, job, time_to_wait, mins, seconds, header, target_name, target_owner, target_rank, scan_name, jobs_all, alljobs, job_8, body, carddesc, jobs, accesses, A, i, A_13, popup, $0, $1, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	dat = null;
	if (!truthy(rt.gl("SSticker"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "mode"), 1)) {
		crew = "";
		t = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/sortRecord"), null, [rt.fv(f, "general", rt.gl("data_core"))])), T("/datum/data/record"));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			crew = rt.modify(live(crew), add(add(add(rt.index(rt.fv(f, "fields", live(t)), "name"), " - "), rt.index(rt.fv(f, "fields", live(t)), "rank")), "<br>"), add);
		}
		rt.endFor(f, 0);
		dat = fmt("<tt><b>Crew Manifest:</b><br>Please use security record computer to modify entries.<br><br>＀<a href='?src=＃;choice=print'>Print</a><br><br><a href='?src=＃;choice=mode;mode_target=0'>Access ID modification console.</a><br></tt>", [live(crew), live(f.src), live(f.src)]);
	} else {
		if (isEqual(rt.sv(f, "mode"), 2)) {
			dat = fmt("<a href='?src=＃;choice=return'>Return</a>", [live(f.src)]);
			dat = rt.modify(live(dat), " || Confirm Identity: ", add);
			S = null;
			if (truthy(rt.sv(f, "scan"))) {
				S = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "name", rt.sv(f, "scan"))]));
			} else {
				S = "--------";
			}
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;choice=scan'>＀</a>", [live(f.src), live(S)]), add);
			dat = rt.modify(live(dat), "<table>", add);
			dat = rt.modify(live(dat), "<tr><td style='width:25%'><b>Job</b></td><td style='width:25%'><b>Slots</b></td><td style='width:25%'><b>Open job</b></td><td style='width:25%'><b>Close job</b><td style='width:25%'><b>Prioritize</b></td></td></tr>", add);
			ID = null;
			if (((truthy(rt.sv(f, "scan")) && truthy((rt.isIn(f, 15, rt.fv(f, "access", rt.sv(f, "scan"))) ? 1 : 0))) && !truthy(rt.sv(f, "target_dept")))) {
				ID = 1;
			} else {
				ID = 0;
			}
			job = null;
			rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
			while (($e = rt.next(f, 0)) !== undefined) {
				job = $e;
				dat = rt.modify(live(dat), "<tr>", add);
				if (truthy((rt.isIn(f, rt.fv(f, "title", live(job)), rt.sv(f, "blacklisted")) ? 1 : 0))) {
					continue;
				}
				dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.fv(f, "title", live(job))]), add);
				dat = rt.modify(live(dat), fmt("<td>＀/＀</td>", [rt.fv(f, "current_positions", live(job)), rt.fv(f, "total_positions", live(job))]), add);
				dat = rt.modify(live(dat), "<td>", add);
				$0 = (yield* g.srcCall(f, "can_open_job", live(job)));
				if ($0 === 1) {
					if (truthy(live(ID))) {
						dat = rt.modify(live(dat), fmt("<a href='?src=＃;choice=make_job_available;job=＀'>Open Position</a><br>", [live(f.src), rt.fv(f, "title", live(job))]), add);
					} else {
						dat = rt.modify(live(dat), "Open Position", add);
					}
				} else if ($0 === -1) {
					dat = rt.modify(live(dat), "Denied", add);
				} else if ($0 === -2) {
					time_to_wait = (yield* g.call(f, P("/proc/round"), null, [subtract(rt.sv(f, "change_position_cooldown"), subtract(divide(rt.worldTime(f), 10), rt.gl("time_last_changed_position"))), 1]));
					mins = (yield* g.call(f, P("/proc/round"), null, [divide(live(time_to_wait), 60)]));
					seconds = subtract(live(time_to_wait), multiply(60, live(mins)));
					$0 = live(mins);
					if (rt.lt(live(seconds), 10)) {
						$1 = fmt("0＀", [live(seconds)]);
					} else {
						$1 = fmt("＀", [live(seconds)]);
					}
					dat = rt.modify(live(dat), fmt("Cooldown ongoing: ＀:＀", [$0, $1]), add);
				} else if ($0 === 0) {
					dat = rt.modify(live(dat), "Denied", add);
				}
				dat = rt.modify(live(dat), "</td><td>", add);
				$0 = (yield* g.srcCall(f, "can_close_job", live(job)));
				if ($0 === 1) {
					if (truthy(live(ID))) {
						dat = rt.modify(live(dat), fmt("<a href='?src=＃;choice=make_job_unavailable;job=＀'>Close Position</a>", [live(f.src), rt.fv(f, "title", live(job))]), add);
					} else {
						dat = rt.modify(live(dat), "Close Position", add);
					}
				} else if ($0 === -1) {
					dat = rt.modify(live(dat), "Denied", add);
				} else if ($0 === -2) {
					time_to_wait = (yield* g.call(f, P("/proc/round"), null, [subtract(rt.sv(f, "change_position_cooldown"), subtract(divide(rt.worldTime(f), 10), rt.gl("time_last_changed_position"))), 1]));
					mins = (yield* g.call(f, P("/proc/round"), null, [divide(live(time_to_wait), 60)]));
					seconds = subtract(live(time_to_wait), multiply(60, live(mins)));
					$0 = live(mins);
					if (rt.lt(live(seconds), 10)) {
						$1 = fmt("0＀", [live(seconds)]);
					} else {
						$1 = fmt("＀", [live(seconds)]);
					}
					dat = rt.modify(live(dat), fmt("Cooldown ongoing: ＀:＀", [$0, $1]), add);
				} else if ($0 === 0) {
					dat = rt.modify(live(dat), "Denied", add);
				}
				dat = rt.modify(live(dat), "</td><td>", add);
				$0 = rt.fv(f, "total_positions", live(job));
				if ($0 === 0) {
					dat = rt.modify(live(dat), "Denied", add);
				} else {
					if (truthy(live(ID))) {
						if (truthy((rt.isIn(f, live(job), rt.fv(f, "prioritized_jobs", rt.gl("SSjob"))) ? 1 : 0))) {
							dat = rt.modify(live(dat), fmt("<a href='?src=＃;choice=prioritize_job;job=＀'>Deprioritize</a>", [live(f.src), rt.fv(f, "title", live(job))]), add);
						} else {
							if (rt.lt(rt.sv(f, "prioritycount"), 5)) {
								dat = rt.modify(live(dat), fmt("<a href='?src=＃;choice=prioritize_job;job=＀'>Prioritize</a>", [live(f.src), rt.fv(f, "title", live(job))]), add);
							} else {
								dat = rt.modify(live(dat), "Denied", add);
							}
						}
					} else {
						dat = rt.modify(live(dat), "Prioritize", add);
					}
				}
				dat = rt.modify(live(dat), "</td></tr>", add);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		} else {
			header = "";
			target_name = null;
			target_owner = null;
			target_rank = null;
			if (truthy(rt.sv(f, "modify"))) {
				target_name = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "name", rt.sv(f, "modify"))]));
			} else {
				target_name = "--------";
			}
			if ((truthy(rt.sv(f, "modify")) && truthy(rt.fv(f, "registered_name", rt.sv(f, "modify"))))) {
				target_owner = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "registered_name", rt.sv(f, "modify"))]));
			} else {
				target_owner = "--------";
			}
			if ((truthy(rt.sv(f, "modify")) && truthy(rt.fv(f, "assignment", rt.sv(f, "modify"))))) {
				target_rank = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "assignment", rt.sv(f, "modify"))]));
			} else {
				target_rank = "Unassigned";
			}
			scan_name = null;
			if (truthy(rt.sv(f, "scan"))) {
				scan_name = (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "name", rt.sv(f, "scan"))]));
			} else {
				scan_name = "--------";
			}
			if (!truthy(rt.sv(f, "authenticated"))) {
				header = rt.modify(live(header), "<br><i>Please insert the cards into the slots</i><br>", add);
				header = rt.modify(live(header), fmt("Target: <a href='?src=＃;choice=modify'>＀</a><br>", [live(f.src), live(target_name)]), add);
				header = rt.modify(live(header), fmt("Confirm Identity: <a href='?src=＃;choice=scan'>＀</a><br>", [live(f.src), live(scan_name)]), add);
			} else {
				header = rt.modify(live(header), "<div align='center'><br>", add);
				header = rt.modify(live(header), fmt("<a href='?src=＃;choice=modify'>Remove ＀</a> || ", [live(f.src), live(target_name)]), add);
				header = rt.modify(live(header), fmt("<a href='?src=＃;choice=scan'>Remove ＀</a> <br> ", [live(f.src), live(scan_name)]), add);
				header = rt.modify(live(header), fmt("<a href='?src=＃;choice=mode;mode_target=1'>Access Crew Manifest</a> <br> ", [live(f.src)]), add);
				header = rt.modify(live(header), fmt("<a href='?src=＃;choice=logout'>Log Out</a></div>", [live(f.src)]), add);
			}
			header = rt.modify(live(header), "<hr>", add);
			jobs_all = "";
			alljobs = rt.list("Unassigned");
			if (truthy((rt.istype(live(f.src), T("/obj/machinery/computer/card/centcom")) ? 1 : 0))) {
				$0 = (yield* g.call(f, P("/proc/get_all_centcom_jobs"), null, []));
			} else {
				$0 = (yield* g.call(f, P("/proc/get_all_jobs"), null, []));
			}
			alljobs = rt.modify(live(alljobs), add($0, "Custom"), add);
			job_8 = null;
			rt.forList(f, 0, live(alljobs));
			while (($e = rt.next(f, 0)) !== undefined) {
				job_8 = $e;
				jobs_all = rt.modify(live(jobs_all), fmt("<a href='?src=＃;choice=assign;assign_target=＀'>＀</a> ", [live(f.src), live(job_8), (yield* g.call(f, P("/proc/replacetext"), null, [live(job_8), " ", "&nbsp"]))]), add);
			}
			rt.endFor(f, 0);
			body = null;
			if ((truthy(rt.sv(f, "authenticated")) && truthy(rt.sv(f, "modify")))) {
				carddesc = "";
				jobs = "";
				if (isEqual(rt.sv(f, "authenticated"), 2)) {
					carddesc = rt.modify(live(carddesc), fmt("<script type=\"text/javascript\">\n\t\t\t\t\t\t\t\t\tfunction markRed(){\n\t\t\t\t\t\t\t\t\t\tvar nameField = document.getElementById('namefield');\n\t\t\t\t\t\t\t\t\t\tnameField.style.backgroundColor = \"#FFDDDD\";\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tfunction markGreen(){\n\t\t\t\t\t\t\t\t\t\tvar nameField = document.getElementById('namefield');\n\t\t\t\t\t\t\t\t\t\tnameField.style.backgroundColor = \"#DDFFDD\";\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tfunction showAll(){\n\t\t\t\t\t\t\t\t\t\tvar allJobsSlot = document.getElementById('alljobsslot');\n\t\t\t\t\t\t\t\t\t\tallJobsSlot.innerHTML = \"<a href='#' onclick='hideAll()'>hide</a><br>\"+ \"＀\";\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tfunction hideAll(){\n\t\t\t\t\t\t\t\t\t\tvar allJobsSlot = document.getElementById('alljobsslot');\n\t\t\t\t\t\t\t\t\t\tallJobsSlot.innerHTML = \"<a href='#' onclick='showAll()'>show</a>\";\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</script>", [live(jobs_all)]), add);
					carddesc = rt.modify(live(carddesc), fmt("<form name='cardcomp' action='?src=＃' method='get'>", [live(f.src)]), add);
					carddesc = rt.modify(live(carddesc), fmt("<input type='hidden' name='src' value='＃'>", [live(f.src)]), add);
					carddesc = rt.modify(live(carddesc), "<input type='hidden' name='choice' value='reg'>", add);
					carddesc = rt.modify(live(carddesc), fmt("<b>registered name:</b> <input type='text' id='namefield' name='reg' value='＀' style='width:250px; background-color:white;' onchange='markRed()'>", [live(target_owner)]), add);
					carddesc = rt.modify(live(carddesc), "<input type='submit' value='Rename' onclick='markGreen()'>", add);
					carddesc = rt.modify(live(carddesc), "</form>", add);
					carddesc = rt.modify(live(carddesc), "<b>Assignment:</b> ", add);
					jobs = rt.modify(live(jobs), fmt("<span id='alljobsslot'><a href='#' onclick='showAll()'>＀</a></span>", [live(target_rank)]), add);
				} else {
					carddesc = rt.modify(live(carddesc), fmt("<b>registered_name:</b> ＀</span>", [live(target_owner)]), add);
					jobs = rt.modify(live(jobs), fmt("<b>Assignment:</b> ＀ (<a href='?src=＃;choice=demote'>Demote</a>)</span>", [live(target_rank), live(f.src)]), add);
				}
				accesses = "";
				if (truthy((rt.istype(live(f.src), T("/obj/machinery/computer/card/centcom")) ? 1 : 0))) {
					accesses = rt.modify(live(accesses), "<h5>Central Command:</h5>", add);
					A = null;
					rt.forList(f, 0, (yield* g.call(f, P("/proc/get_all_centcom_access"), null, [])));
					while (($e = rt.next(f, 0)) !== undefined) {
						A = $e;
						if (truthy((rt.isIn(f, live(A), rt.fv(f, "access", rt.sv(f, "modify"))) ? 1 : 0))) {
							accesses = rt.modify(live(accesses), fmt("<a href='?src=＃;choice=access;access_target=＀;allowed=0'><font color=\"red\">＀</font></a> ", [live(f.src), live(A), (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/get_centcom_access_desc"), null, [live(A)])), " ", "&nbsp"]))]), add);
						} else {
							accesses = rt.modify(live(accesses), fmt("<a href='?src=＃;choice=access;access_target=＀;allowed=1'>＀</a> ", [live(f.src), live(A), (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/get_centcom_access_desc"), null, [live(A)])), " ", "&nbsp"]))]), add);
						}
					}
					rt.endFor(f, 0);
				} else {
					accesses = rt.modify(live(accesses), "<div align='center'><b>Access</b></div>", add);
					accesses = rt.modify(live(accesses), "<table style='width:100%'>", add);
					accesses = rt.modify(live(accesses), "<tr>", add);
					i = null;
					i = 1;
					while (rt.le(live(i), 7)) {
						if (!(isEqual(rt.sv(f, "authenticated"), 1) && !truthy((rt.isIn(f, live(i), rt.sv(f, "region_access")) ? 1 : 0)))) {
							accesses = rt.modify(live(accesses), fmt("<td style='width:14%'><b>＀:</b></td>", [(yield* g.call(f, P("/proc/get_region_accesses_name"), null, [live(i)]))]), add);
						}
						i = rt.inc(live(i), 1);
					}
					accesses = rt.modify(live(accesses), "</tr><tr>", add);
					i = null;
					i = 1;
					while (rt.le(live(i), 7)) {
						if (!(isEqual(rt.sv(f, "authenticated"), 1) && !truthy((rt.isIn(f, live(i), rt.sv(f, "region_access")) ? 1 : 0)))) {
							accesses = rt.modify(live(accesses), "<td style='width:14%' valign='top'>", add);
							A_13 = null;
							rt.forList(f, 0, (yield* g.call(f, P("/proc/get_region_accesses"), null, [live(i)])));
							while (($e = rt.next(f, 0)) !== undefined) {
								A_13 = $e;
								if (truthy((rt.isIn(f, live(A_13), rt.fv(f, "access", rt.sv(f, "modify"))) ? 1 : 0))) {
									accesses = rt.modify(live(accesses), fmt("<a href='?src=＃;choice=access;access_target=＀;allowed=0'><font color=\"red\">＀</font></a> ", [live(f.src), live(A_13), (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/get_access_desc"), null, [live(A_13)])), " ", "&nbsp"]))]), add);
								} else {
									accesses = rt.modify(live(accesses), fmt("<a href='?src=＃;choice=access;access_target=＀;allowed=1'>＀</a> ", [live(f.src), live(A_13), (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/get_access_desc"), null, [live(A_13)])), " ", "&nbsp"]))]), add);
								}
								accesses = rt.modify(live(accesses), "<br>", add);
							}
							rt.endFor(f, 0);
							accesses = rt.modify(live(accesses), "</td>", add);
						}
						i = rt.inc(live(i), 1);
					}
					accesses = rt.modify(live(accesses), "</tr></table>", add);
				}
				body = fmt("＀<br>＀<br><br>＀", [live(carddesc), live(jobs), live(accesses)]);
			} else {
				body = fmt("<a href='?src=＃;choice=auth'>{Log in}</a> <br><hr>", [live(f.src)]);
				body = rt.modify(live(body), fmt("<a href='?src=＃;choice=mode;mode_target=1'>Access Crew Manifest</a>", [live(f.src)]), add);
				if (!truthy(rt.sv(f, "target_dept"))) {
					body = rt.modify(live(body), fmt("<br><hr><a href = '?src=＃;choice=mode;mode_target=2'>Job Management</a>", [live(f.src)]), add);
				}
			}
			dat = fmt("<tt>＀＀<hr><br></tt>", [live(header), live(body)]);
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "id_com", rt.fv(f, "name", live(f.src)), 900, 620]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/card/proc/Topic  (code/game/machinery/computer/card.dm:351)  may sleep
rt.def("/obj/machinery/computer/card/proc/Topic", function* Topic(f: Frame) {
	let I: Value = null, access_type: Value = null, access_allowed: Value = null, t1: Value = null, newJob: Value = null, jobdatum: Value = null, jobtype: Value = null, J: Value = null, t2: Value = null, newName: Value = null, edit_job_target: Value = null, j: Value = null, priority_target: Value = null, priority: Value = null, _P: Value = null, t1_1: Value = null, t: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [I, access_type, access_allowed, t1, newJob, jobdatum, jobtype, J, t2, newName, edit_job_target, j, priority_target, priority, _P, t1_1, t, $0, $1, $2, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	$0 = rt.at(live(f.args[1]), "choice");
	if ($0 === "modify") {
		if (truthy(rt.sv(f, "modify"))) {
			yield* g.callName(f, rt.gl("data_core"), "manifest_modify", [rt.fv(f, "registered_name", rt.sv(f, "modify")), rt.fv(f, "assignment", rt.sv(f, "modify"))]);
			yield* g.callName(f, rt.sv(f, "modify"), "update_label", []);
			rt.setFv(f, "loc", rt.sv(f, "modify"), rt.sv(f, "loc"));
			yield* g.callName(f, rt.sv(f, "modify"), "verb_pickup", []);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0]);
			rt.setSv(f, "modify", null);
			rt.setSv(f, "region_access", null);
			rt.setSv(f, "head_subordinates", null);
		} else {
			if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0]);
				rt.setFv(f, "loc", live(I), live(f.src));
				rt.setSv(f, "modify", live(I));
			}
		}
		rt.setSv(f, "authenticated", 0);
	} else if ($0 === "scan") {
		if (truthy(rt.sv(f, "scan"))) {
			rt.setFv(f, "loc", rt.sv(f, "scan"), rt.fv(f, "loc", live(f.src)));
			yield* g.callName(f, rt.sv(f, "scan"), "verb_pickup", []);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0]);
			rt.setSv(f, "scan", null);
		} else {
			if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0]);
				rt.setFv(f, "loc", live(I), live(f.src));
				rt.setSv(f, "scan", live(I));
			}
		}
		rt.setSv(f, "authenticated", 0);
	} else if ($0 === "auth") {
		if (((!truthy(rt.sv(f, "authenticated")) && (truthy(rt.sv(f, "scan")) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)))) && (truthy(rt.sv(f, "modify")) || truthy(rt.sv(f, "mode"))))) {
			if (truthy((yield* g.srcCall(f, "check_access", rt.sv(f, "scan"))))) {
				rt.setSv(f, "region_access", rt.list());
				rt.setSv(f, "head_subordinates", rt.list());
				if (truthy((rt.isIn(f, 15, rt.fv(f, "access", rt.sv(f, "scan"))) ? 1 : 0))) {
					if (truthy(rt.sv(f, "target_dept"))) {
						rt.setSv(f, "head_subordinates", (yield* g.call(f, P("/proc/get_all_jobs"), null, [])));
						(rt.modSrcVar(f, "region_access", rt.sv(f, "target_dept"), rt.bitOr));
						rt.setSv(f, "authenticated", 1);
					} else {
						rt.setSv(f, "authenticated", 2);
					}
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_on.ogg"), 50, 0]);
				} else {
					if ((truthy((rt.isIn(f, 57, rt.fv(f, "access", rt.sv(f, "scan"))) ? 1 : 0)) && (isEqual(rt.sv(f, "target_dept"), 1) || !truthy(rt.sv(f, "target_dept"))))) {
						(rt.modSrcVar(f, "region_access", 1, rt.bitOr));
						(rt.modSrcVar(f, "region_access", 6, rt.bitOr));
						yield* g.srcCall(f, "get_subordinates", "Head of Personnel");
					}
					if ((truthy((rt.isIn(f, 58, rt.fv(f, "access", rt.sv(f, "scan"))) ? 1 : 0)) && (isEqual(rt.sv(f, "target_dept"), 2) || !truthy(rt.sv(f, "target_dept"))))) {
						(rt.modSrcVar(f, "region_access", 2, rt.bitOr));
						yield* g.srcCall(f, "get_subordinates", "Head of Security");
					}
					if ((truthy((rt.isIn(f, 40, rt.fv(f, "access", rt.sv(f, "scan"))) ? 1 : 0)) && (isEqual(rt.sv(f, "target_dept"), 3) || !truthy(rt.sv(f, "target_dept"))))) {
						(rt.modSrcVar(f, "region_access", 3, rt.bitOr));
						yield* g.srcCall(f, "get_subordinates", "Chief Medical Officer");
					}
					if ((truthy((rt.isIn(f, 30, rt.fv(f, "access", rt.sv(f, "scan"))) ? 1 : 0)) && (isEqual(rt.sv(f, "target_dept"), 4) || !truthy(rt.sv(f, "target_dept"))))) {
						(rt.modSrcVar(f, "region_access", 4, rt.bitOr));
						yield* g.srcCall(f, "get_subordinates", "Research Director");
					}
					if ((truthy((rt.isIn(f, 56, rt.fv(f, "access", rt.sv(f, "scan"))) ? 1 : 0)) && (isEqual(rt.sv(f, "target_dept"), 5) || !truthy(rt.sv(f, "target_dept"))))) {
						(rt.modSrcVar(f, "region_access", 5, rt.bitOr));
						yield* g.srcCall(f, "get_subordinates", "Chief Engineer");
					}
					if (truthy(rt.sv(f, "region_access"))) {
						rt.setSv(f, "authenticated", 1);
					}
				}
			}
		} else {
			if (((!truthy(rt.sv(f, "authenticated")) && truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) && !truthy(rt.sv(f, "modify")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You can't modify an ID without an ID inserted to modify! Once one is in the modify slot on the computer, you can log in.</span>"]);
			}
		}
	} else if ($0 === "logout") {
		rt.setSv(f, "region_access", null);
		rt.setSv(f, "head_subordinates", null);
		rt.setSv(f, "authenticated", 0);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_off.ogg"), 50, 0]);
	} else if ($0 === "access") {
		if (truthy(rt.at(live(f.args[1]), "allowed"))) {
			if (truthy(rt.sv(f, "authenticated"))) {
				access_type = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "access_target")]));
				access_allowed = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "allowed")]));
				$0 = live(access_type);
				if (truthy((rt.istype(live(f.src), T("/obj/machinery/computer/card/centcom")) ? 1 : 0))) {
					$1 = (yield* g.call(f, P("/proc/get_all_centcom_access"), null, []));
				} else {
					$1 = (yield* g.call(f, P("/proc/get_all_accesses"), null, []));
				}
				if (truthy((rt.isIn(f, $0, $1) ? 1 : 0))) {
					(rt.modField(f, rt.sv(f, "modify"), "access", live(access_type), subtract));
					if (isEqual(live(access_allowed), 1)) {
						rt.modField(f, rt.sv(f, "modify"), "access", live(access_type), add);
					}
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "terminal_type", 50, 0]);
				}
			}
		}
	} else if ($0 === "assign") {
		if (isEqual(rt.sv(f, "authenticated"), 2)) {
			if (isEqual((t1 = rt.at(live(f.args[1]), "assign_target")), "Custom")) {
				$0 = null;
				if (truthy(rt.sv(f, "modify"))) {
					$1 = rt.fv(f, "assignment", rt.sv(f, "modify"));
				} else {
					$1 = "Unassigned";
				}
				if (truthy((newJob = (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [2], [$0, $1, "Assignment", "Enter a custom job assignment.", null])), 42]))))) {
					t1 = live(newJob);
				}
			} else {
				if (isEqual(live(t1), "Unassigned")) {
					(rt.modField(f, rt.sv(f, "modify"), "access", (yield* g.call(f, P("/proc/get_all_accesses"), null, [])), subtract));
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
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='error'>No log exists for this job.</span>"]);
						return live(f.dot);
					}
					$0 = rt.sv(f, "modify");
					if (truthy((rt.istype(live(f.src), T("/obj/machinery/computer/card/centcom")) ? 1 : 0))) {
						$1 = (yield* g.call(f, P("/proc/get_centcom_access"), null, [live(t1)]));
					} else {
						$1 = (yield* g.callName(f, live(jobdatum), "get_access", []));
					}
					rt.setFv(f, "access", $0, $1);
				}
			}
			if (truthy(rt.sv(f, "modify"))) {
				rt.setFv(f, "assignment", rt.sv(f, "modify"), live(t1));
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
			}
		}
	} else if ($0 === "demote") {
		if (truthy((rt.isIn(f, rt.fv(f, "assignment", rt.sv(f, "modify")), (rt.sv(f, "head_subordinates") || (isEqual(rt.fv(f, "assignment", rt.sv(f, "modify")), "Assistant") ? 1 : 0))) ? 1 : 0))) {
			rt.setFv(f, "assignment", rt.sv(f, "modify"), "Unassigned");
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='error'>You are not authorized to demote this position.</span>"]);
		}
	} else if ($0 === "reg") {
		if (truthy(rt.sv(f, "authenticated"))) {
			t2 = rt.sv(f, "modify");
			if ((((truthy(rt.sv(f, "authenticated")) && isEqual(rt.sv(f, "modify"), live(t2))) && (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) {
				if (truthy((newName = (yield* g.call(f, P("/proc/reject_bad_name"), null, [rt.at(live(f.args[1]), "reg")]))))) {
					rt.setFv(f, "registered_name", rt.sv(f, "modify"), live(newName));
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='error'>Invalid name entered.</span>"]);
					return live(f.dot);
				}
			}
		}
	} else if ($0 === "mode") {
		rt.setSv(f, "mode", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "mode_target")])));
	} else if ($0 === "return") {
		rt.setSv(f, "mode", 3);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "terminal_type", 25, 0]);
	} else if ($0 === "make_job_available") {
		if (((truthy(rt.sv(f, "scan")) && truthy((rt.isIn(f, 15, rt.fv(f, "access", rt.sv(f, "scan"))) ? 1 : 0))) && !truthy(rt.sv(f, "target_dept")))) {
			edit_job_target = rt.at(live(f.args[1]), "job");
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
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
		}
	} else if ($0 === "make_job_unavailable") {
		if (((truthy(rt.sv(f, "scan")) && truthy((rt.isIn(f, 15, rt.fv(f, "access", rt.sv(f, "scan"))) ? 1 : 0))) && !truthy(rt.sv(f, "target_dept")))) {
			edit_job_target = rt.at(live(f.args[1]), "job");
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
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
		}
	} else if ($0 === "prioritize_job") {
		if (((truthy(rt.sv(f, "scan")) && truthy((rt.isIn(f, 15, rt.fv(f, "access", rt.sv(f, "scan"))) ? 1 : 0))) && !truthy(rt.sv(f, "target_dept")))) {
			priority_target = rt.at(live(f.args[1]), "job");
			if (!truthy((j = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", [live(priority_target)]))))) {
				return 0;
			}
			priority = 1;
			if (truthy((rt.isIn(f, live(j), rt.fv(f, "prioritized_jobs", rt.gl("SSjob"))) ? 1 : 0))) {
				(rt.modField(f, rt.gl("SSjob"), "prioritized_jobs", live(j), subtract));
				rt.incSrcVar(f, "prioritycount", -1, true);
				priority = 0;
			} else {
				rt.modField(f, rt.gl("SSjob"), "prioritized_jobs", live(j), add);
				rt.incSrcVar(f, "prioritycount", 1, true);
			}
			$0 = live(f.usr);
			$1 = rt.fv(f, "title", live(j));
			if (truthy(live(priority))) {
				$2 = "prioritized";
			} else {
				$2 = "unprioritized";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ has been successfully ＀. Potential employees will notice your request.</span>", [$1, $2])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
		}
	} else if ($0 === "print") {
		if (!truthy(rt.sv(f, "printing"))) {
			rt.setSv(f, "printing", 1);
			yield* g.call(f, P("/proc/sleep"), null, [50]);
			_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [rt.sv(f, "loc")]));
			t1_1 = "<B>Crew Manifest:</B><BR>";
			t = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/sortRecord"), null, [rt.fv(f, "general", rt.gl("data_core"))])), T("/datum/data/record"));
			while (($e = rt.next(f, 0)) !== undefined) {
				t = $e;
				t1_1 = rt.modify(live(t1_1), add(add(add(rt.index(rt.fv(f, "fields", live(t)), "name"), " - "), rt.index(rt.fv(f, "fields", live(t)), "rank")), "<br>"), add);
			}
			rt.endFor(f, 0);
			rt.setFv(f, "info", live(_P), live(t1_1));
			rt.setFv(f, "name", live(_P), "paper- 'Crew Manifest'");
			rt.setSv(f, "printing", null);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_insert_disc.ogg"), 50, 0]);
		}
	}
	if (truthy(rt.sv(f, "modify"))) {
		yield* g.callName(f, rt.sv(f, "modify"), "update_label", []);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/card/proc/get_subordinates  (code/game/machinery/computer/card.dm:560)
rt.def("/obj/machinery/computer/card/proc/get_subordinates", function get_subordinates(f: Frame, rank: Value) {
	let job: Value = null;
	let $e: any;
	f.vars = () => [job, $e];
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

rt.type(10371, "/obj/machinery/computer/card/centcom", "/obj/machinery/computer/card", {
	name: "１Centcom identification console",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/card/centcom"),
	req_access: null,
});

// /obj/machinery/computer/card/centcom/proc/<init>  (code/game/machinery/computer/card.dm:567)
rt.def("/obj/machinery/computer/card/centcom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(109));
	return f.dot;
});

rt.type(10372, "/obj/machinery/computer/card/minor", "/obj/machinery/computer/card", {
	name: "department management console",
	desc: "You can use this to change ID's for specific departments.",
	icon_screen: "idminor",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/card/minor"),
});

// /obj/machinery/computer/card/minor/proc/New  (code/game/machinery/computer/card.dm:576)  may sleep
rt.def("/obj/machinery/computer/card/minor/proc/New", function* New(f: Frame) {
	let typed_circuit: Value = null, dept_list: Value = null;
	f.vars = () => [typed_circuit, dept_list];
	yield* g.callSuper(f, [], rt.Args.Same);
	typed_circuit = rt.sv(f, "circuit");
	if (truthy(rt.sv(f, "target_dept"))) {
		rt.setFv(f, "target_dept", live(typed_circuit), rt.sv(f, "target_dept"));
	} else {
		rt.setSv(f, "target_dept", rt.fv(f, "target_dept", live(typed_circuit)));
	}
	rt.setSv(f, "name", fmt("＀ department console", [rt.index((dept_list = rt.list("general", "security", "medical", "science", "engineering")), rt.sv(f, "target_dept"))]));
	return f.dot;
}, true);
