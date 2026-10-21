// From code/datums/antagonists/datum_internal_affairs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(908, "/datum/antagonist/traitor/human/internal_affairs", "/datum/antagonist/traitor/human", {
	syndicate: 0,
	last_man_standing: 0,
	targets_stolen: null,
	name: "Internal Affairs Agent",
	employer: "Nanotrasen",
	special_role: "internal affairs agent",
	base_datum_custom: rt.typePath("/datum/antagonist/traitor/internal_affairs/custom"),
});

// /datum/antagonist/traitor/human/internal_affairs/proc/transfer_important_variables  (code/datums/antagonists/datum_internal_affairs.dm:44)
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/transfer_important_variables", function transfer_important_variables(f: Frame, other: Value) {
	rt.callSuper(f, [live(other)]);
	rt.setFv(f, "syndicate", live(other), rt.sv(f, "syndicate"));
	rt.setFv(f, "last_man_standing", live(other), rt.sv(f, "last_man_standing"));
	rt.setFv(f, "targets_stolen", live(other), rt.sv(f, "targets_stolen"));
	return f.dot;
});

rt.type(904, "/datum/antagonist/traitor/AI/internal_affairs", "/datum/antagonist/traitor/AI", {
	syndicate: 0,
	last_man_standing: 0,
	targets_stolen: null,
	name: "Internal Affairs Agent",
	employer: "Nanotrasen",
	special_role: "internal affairs agent",
	base_datum_custom: rt.typePath("/datum/antagonist/traitor/internal_affairs/custom"),
});

// /datum/antagonist/traitor/AI/internal_affairs/proc/transfer_important_variables  (code/datums/antagonists/datum_internal_affairs.dm:50)
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/transfer_important_variables", function transfer_important_variables(f: Frame, other: Value) {
	rt.callSuper(f, [live(other)]);
	rt.setFv(f, "syndicate", live(other), rt.sv(f, "syndicate"));
	rt.setFv(f, "last_man_standing", live(other), rt.sv(f, "last_man_standing"));
	rt.setFv(f, "targets_stolen", live(other), rt.sv(f, "targets_stolen"));
	return f.dot;
});

// /datum/antagonist/traitor/human/internal_affairs/proc/give_pinpointer  (code/datums/antagonists/datum_internal_affairs.dm:56)  may sleep
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/give_pinpointer", function* give_pinpointer(f: Frame) {
	if (!(truthy(rt.sv(f, "owner")) && truthy(rt.fv(f, "current", rt.sv(f, "owner"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "apply_status_effect", [T("/datum/status_effect/agent_pinpointer")]);
	return f.dot;
}, true);

// /datum/antagonist/traitor/human/internal_affairs/proc/apply_innate_effects  (code/datums/antagonists/datum_internal_affairs.dm:60)  may sleep
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/apply_innate_effects", function* apply_innate_effects(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.sv(f, "owner")) && truthy(rt.fv(f, "current", rt.sv(f, "owner"))))) return f.dot;
	yield* g.srcCall(f, "give_pinpointer", rt.fv(f, "current", rt.sv(f, "owner")));
	return f.dot;
}, true);

// /datum/antagonist/traitor/human/internal_affairs/proc/remove_innate_effects  (code/datums/antagonists/datum_internal_affairs.dm:65)  may sleep
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/remove_innate_effects", function* remove_innate_effects(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.sv(f, "owner")) && truthy(rt.fv(f, "current", rt.sv(f, "owner"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "remove_status_effect", [T("/datum/status_effect/agent_pinpointer")]);
	return f.dot;
}, true);

// /datum/antagonist/traitor/human/internal_affairs/proc/on_gain  (code/datums/antagonists/datum_internal_affairs.dm:74)  may sleep
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/on_gain", function* on_gain(f: Frame) {
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), add);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/antagonist/traitor/human/internal_affairs/proc/on_removal  (code/datums/antagonists/datum_internal_affairs.dm:77)  may sleep
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/on_removal", function* on_removal(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/antagonist/traitor/human/internal_affairs/proc/process  (code/datums/antagonists/datum_internal_affairs.dm:80)
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/process", function process(f: Frame) {
	rt.callSrc(f, "iaa_process", []);
	return f.dot;
}, false, { waitfor: false });

// /datum/antagonist/traitor/AI/internal_affairs/proc/on_gain  (code/datums/antagonists/datum_internal_affairs.dm:83)  may sleep
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/on_gain", function* on_gain(f: Frame) {
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), add);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/antagonist/traitor/AI/internal_affairs/proc/on_removal  (code/datums/antagonists/datum_internal_affairs.dm:86)  may sleep
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/on_removal", function* on_removal(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/antagonist/traitor/AI/internal_affairs/proc/process  (code/datums/antagonists/datum_internal_affairs.dm:89)
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/process", function process(f: Frame) {
	rt.callSrc(f, "iaa_process", []);
	return f.dot;
}, false, { waitfor: false });

rt.type(918, "/datum/status_effect/agent_pinpointer", "/datum/status_effect", {
	minimum_range: 15,
	scan_target: null,
	id: "agent_pinpointer",
	duration: -1,
	tick_interval: 40,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/agent_pinpointer"),
});

// /datum/status_effect/agent_pinpointer/proc/point_to_target  (code/datums/antagonists/datum_internal_affairs.dm:106)
rt.def("/datum/status_effect/agent_pinpointer/proc/point_to_target", function point_to_target(f: Frame) {
	let here: Value = null, there: Value = null;
	let $0: any;
	f.vars = () => [here, there, $0];
	if (!truthy(rt.sv(f, "scan_target"))) {
		rt.setFv(f, "icon_state", rt.sv(f, "linked_alert"), "pinonnull");
		return live(f.dot);
	}
	here = rt.getStep(f, rt.sv(f, "owner"), 0);
	there = rt.getStep(f, rt.sv(f, "scan_target"), 0);
	if (!isEqual(rt.fv(f, "z", live(here)), rt.fv(f, "z", live(there)))) {
		rt.setFv(f, "icon_state", rt.sv(f, "linked_alert"), "pinonnull");
		return live(f.dot);
	}
	if (rt.le(rt.call(f, P("/proc/get_dist_euclidian"), null, [live(here), live(there)]), add(rt.sv(f, "minimum_range"), rt.call(f, P("/proc/rand"), null, [0, 10])))) {
		rt.setFv(f, "icon_state", rt.sv(f, "linked_alert"), "pinondirect");
	} else {
		rt.callName(f, rt.sv(f, "linked_alert"), "setDir", [rt.getDir(f, live(here), live(there))]);
		$0 = rt.call(f, P("/proc/get_dist"), null, [live(here), live(there)]);
		if (rt.inRange($0, 1, 8)) {
			rt.setFv(f, "icon_state", rt.sv(f, "linked_alert"), "pinonclose");
		} else if (rt.inRange($0, 9, 16)) {
			rt.setFv(f, "icon_state", rt.sv(f, "linked_alert"), "pinonmedium");
		} else if (rt.inRange($0, 16, 9.999999848243207e+30)) {
			rt.setFv(f, "icon_state", rt.sv(f, "linked_alert"), "pinonfar");
		}
	}
	return f.dot;
});

// /datum/status_effect/agent_pinpointer/proc/scan_for_target  (code/datums/antagonists/datum_internal_affairs.dm:129)
rt.def("/datum/status_effect/agent_pinpointer/proc/scan_for_target", function scan_for_target(f: Frame) {
	let objective_: Value = null, objective: Value = null, current: Value = null;
	let $e: any;
	f.vars = () => [objective_, objective, current, $e];
	rt.setSv(f, "scan_target", null);
	if (!truthy(rt.sv(f, "owner"))) return f.dot;
	if (!truthy(rt.fv(f, "mind", rt.sv(f, "owner")))) return f.dot;
	if (!truthy(rt.gv(f, "objectives", rt.fv(f, "mind", rt.sv(f, "owner"))))) return f.dot;
	objective_ = null;
	rt.forList(f, 0, rt.gv(f, "objectives", rt.fv(f, "mind", rt.sv(f, "owner"))), T("/datum/objective"));
	while (($e = rt.next(f, 0)) !== undefined) {
		objective_ = $e;
		if (!truthy(rt.call(f, P("/proc/is_internal_objective"), null, [live(objective_)]))) {
			continue;
		}
		objective = live(objective_);
		if (!(truthy((current = rt.gv(f, "current", rt.fv(f, "target", live(objective))))) && !isEqual(rt.fv(f, "stat", live(current)), 2))) break;
		rt.setSv(f, "scan_target", live(current));
		break;
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/status_effect/agent_pinpointer/proc/tick  (code/datums/antagonists/datum_internal_affairs.dm:141)  may sleep
rt.def("/datum/status_effect/agent_pinpointer/proc/tick", function* tick(f: Frame) {
	if (!truthy(rt.sv(f, "owner"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "scan_for_target");
	yield* g.srcCall(f, "point_to_target");
	return f.dot;
}, true);

// /proc/is_internal_objective  (code/datums/antagonists/datum_internal_affairs.dm:149)
rt.def("/proc/is_internal_objective", function is_internal_objective(f: Frame, O: Value) {
	return ((rt.istype(live(O), T("/datum/objective/assassinate/internal")) ? 1 : 0) || (rt.istype(live(O), T("/datum/objective/destroy/internal")) ? 1 : 0));
});

// /datum/antagonist/traitor/proc/replace_escape_objective  (code/datums/antagonists/datum_internal_affairs.dm:152)
rt.def("/datum/antagonist/traitor/proc/replace_escape_objective", function replace_escape_objective(f: Frame) {
	let objective_: Value = null, martyr_objective: Value = null;
	let $e: any;
	f.vars = () => [objective_, martyr_objective, $e];
	if ((!truthy(rt.sv(f, "owner")) || !truthy(rt.fv(f, "objectives", rt.sv(f, "owner"))))) {
		return live(f.dot);
	}
	objective_ = null;
	rt.forList(f, 0, rt.fv(f, "objectives", rt.sv(f, "owner")));
	while (($e = rt.next(f, 0)) !== undefined) {
		objective_ = $e;
		if (!(truthy((rt.istype(live(objective_), T("/datum/objective/escape")) ? 1 : 0)) || truthy((rt.istype(live(objective_), T("/datum/objective/survive")) ? 1 : 0)))) {
			continue;
		}
		rt.callSrc(f, "remove_objective", [live(objective_)]);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "owner", (martyr_objective = rt.new_(f, T("/datum/objective/martyr"), [])), rt.sv(f, "owner"));
	rt.callSrc(f, "add_objective", [live(martyr_objective)]);
	return f.dot;
});

// /datum/antagonist/traitor/proc/reinstate_escape_objective  (code/datums/antagonists/datum_internal_affairs.dm:164)
rt.def("/datum/antagonist/traitor/proc/reinstate_escape_objective", function reinstate_escape_objective(f: Frame) {
	let objective_: Value = null;
	let $e: any;
	f.vars = () => [objective_, $e];
	if ((!truthy(rt.sv(f, "owner")) || !truthy(rt.fv(f, "objectives", rt.sv(f, "owner"))))) {
		return live(f.dot);
	}
	objective_ = null;
	rt.forList(f, 0, rt.fv(f, "objectives", rt.sv(f, "owner")));
	while (($e = rt.next(f, 0)) !== undefined) {
		objective_ = $e;
		if (!truthy((rt.istype(live(objective_), T("/datum/objective/martyr")) ? 1 : 0))) {
			continue;
		}
		rt.callSrc(f, "remove_objective", [live(objective_)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/antagonist/traitor/human/internal_affairs/proc/reinstate_escape_objective  (code/datums/antagonists/datum_internal_affairs.dm:172)
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/reinstate_escape_objective", function reinstate_escape_objective(f: Frame) {
	let escape_objective: Value = null;
	f.vars = () => [escape_objective];
	rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "owner", (escape_objective = rt.new_(f, T("/datum/objective/escape"), [])), rt.sv(f, "owner"));
	rt.callSrc(f, "add_objective", [live(escape_objective)]);
	return f.dot;
});

// /datum/antagonist/traitor/AI/internal_affairs/proc/reinstate_escape_objective  (code/datums/antagonists/datum_internal_affairs.dm:178)
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/reinstate_escape_objective", function reinstate_escape_objective(f: Frame) {
	let survive_objective: Value = null;
	f.vars = () => [survive_objective];
	rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "owner", (survive_objective = rt.new_(f, T("/datum/objective/survive"), [])), rt.sv(f, "owner"));
	rt.callSrc(f, "add_objective", [live(survive_objective)]);
	return f.dot;
});

// /datum/antagonist/traitor/proc/steal_targets  (code/datums/antagonists/datum_internal_affairs.dm:184)
rt.def("/datum/antagonist/traitor/proc/steal_targets", function steal_targets(f: Frame, victim: Value) {
	let _this: Value = null, objective_: Value = null, objective: Value = null, new_objective: Value = null, status_text: Value = null;
	let $0: any, $e: any;
	f.vars = () => [_this, objective_, objective, new_objective, status_text, $0, $e];
	_this = live(f.src);
	if ((!truthy(rt.fv(f, "current", rt.sv(f, "owner"))) || isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "owner"))), 2))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), fmt("<span class='userdanger'> Target eliminated: ＀</span>", [rt.fv(f, "name", live(victim))])]);
	objective_ = null;
	rt.forList(f, 0, rt.fv(f, "objectives", live(victim)));
	while (($e = rt.next(f, 0)) !== undefined) {
		objective_ = $e;
		if (truthy((rt.istype(live(objective_), T("/datum/objective/assassinate/internal")) ? 1 : 0))) {
			if (isEqual(rt.gv(f, "target", (objective = live(objective_))), rt.sv(f, "owner"))) {
				continue;
			}
			if (isEqual(rt.callName(f, rt.fv(f, "targets_stolen", live(_this)), "Find", [rt.fv(f, "target", live(objective))]), 0)) {
				rt.setFv(f, "owner", (new_objective = rt.new_(f, T("/datum/objective/assassinate/internal"), [])), rt.sv(f, "owner"));
				rt.setFv(f, "target", live(new_objective), rt.fv(f, "target", live(objective)));
				rt.callName(f, live(new_objective), "update_explanation_text", []);
				rt.callSrc(f, "add_objective", [live(new_objective)]);
				rt.modField(f, live(_this), "targets_stolen", rt.fv(f, "target", live(objective)), add);
				if (truthy(rt.callName(f, live(objective), "check_completion", []))) {
					$0 = "neutralised";
				} else {
					$0 = "active";
				}
				status_text = $0;
				rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), fmt("<span class='userdanger'> New target added to database: ＀ (＀) </span>", [rt.gv(f, "name", rt.fv(f, "target", live(objective))), live(status_text)])]);
			}
		} else {
			if (truthy((rt.istype(live(objective_), T("/datum/objective/destroy/internal")) ? 1 : 0))) {
				objective = live(objective_);
				new_objective = rt.new_(f, T("/datum/objective/destroy/internal"), []);
				if (isEqual(rt.fv(f, "target", live(objective)), rt.sv(f, "owner"))) {
					continue;
				}
				if (isEqual(rt.callName(f, rt.fv(f, "targets_stolen", live(_this)), "Find", [rt.fv(f, "target", live(objective))]), 0)) {
					rt.setFv(f, "owner", live(new_objective), rt.sv(f, "owner"));
					rt.setFv(f, "target", live(new_objective), rt.fv(f, "target", live(objective)));
					rt.callName(f, live(new_objective), "update_explanation_text", []);
					rt.callSrc(f, "add_objective", [live(new_objective)]);
					rt.modField(f, live(_this), "targets_stolen", rt.fv(f, "target", live(objective)), add);
					if (truthy(rt.callName(f, live(objective), "check_completion", []))) {
						$0 = "neutralised";
					} else {
						$0 = "active";
					}
					status_text = $0;
					rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), fmt("<span class='userdanger'> New target added to database: ＀ (＀) </span>", [rt.gv(f, "name", rt.fv(f, "target", live(objective))), live(status_text)])]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "last_man_standing", live(_this), 1);
	objective_ = null;
	rt.forList(f, 0, rt.fv(f, "objectives", rt.sv(f, "owner")));
	while (($e = rt.next(f, 0)) !== undefined) {
		objective_ = $e;
		if (!truthy(rt.call(f, P("/proc/is_internal_objective"), null, [live(objective_)]))) {
			continue;
		}
		if (!truthy(rt.callName(f, (objective = live(objective_)), "check_completion", []))) {
			rt.setFv(f, "last_man_standing", live(_this), 0);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.fv(f, "last_man_standing", live(_this)))) return f.dot;
	if (truthy(rt.fv(f, "syndicate", live(_this)))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'> All the loyalist agents are dead, and no more is required of you. Die a glorious death, agent. </span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'> All the other agents are dead, and you're the last loose end. Stage a Syndicate terrorist attack to cover up for today's events. You no longer have any limits on collateral damage.</span>"]);
	}
	rt.callSrc(f, "replace_escape_objective", [rt.sv(f, "owner")]);
	return f.dot;
});

// /datum/antagonist/traitor/proc/iaa_process  (code/datums/antagonists/datum_internal_affairs.dm:232)
rt.def("/datum/antagonist/traitor/proc/iaa_process", function iaa_process(f: Frame) {
	let _this: Value = null, objective_: Value = null, objective: Value = null, fail_msg: Value = null;
	let $e: any;
	f.vars = () => [_this, objective_, objective, fail_msg, $e];
	_this = live(f.src);
	if (!((truthy(rt.sv(f, "owner")) && truthy(rt.fv(f, "current", rt.sv(f, "owner")))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "owner"))), 2))) return f.dot;
	objective_ = null;
	rt.forList(f, 0, rt.fv(f, "objectives", rt.sv(f, "owner")));
	while (($e = rt.next(f, 0)) !== undefined) {
		objective_ = $e;
		if (!truthy(rt.call(f, P("/proc/is_internal_objective"), null, [live(objective_)]))) {
			continue;
		}
		if (!truthy(rt.gv(f, "target", (objective = live(objective_))))) {
			continue;
		}
		if (truthy(rt.callName(f, live(objective), "check_completion", []))) {
			if (truthy(rt.fv(f, "stolen", live(objective)))) {
				continue;
			}
			rt.callSrc(f, "steal_targets", [rt.fv(f, "target", live(objective))]);
			rt.setFv(f, "stolen", live(objective), 1);
		} else {
			if (truthy(rt.fv(f, "stolen", live(objective)))) {
				fail_msg = fmt("<span class='userdanger'>Your sensors tell you that ＀, one of the targets you were meant to have killed, pulled one over on you, and is still alive - do the job properly this time! </span>", [rt.gv(f, "real_name", rt.gv(f, "current", rt.fv(f, "target", live(objective))))]);
				if (truthy(rt.fv(f, "last_man_standing", live(_this)))) {
					if (truthy(rt.fv(f, "syndicate", live(_this)))) {
						fail_msg = rt.modify(live(fail_msg), "<span class='userdanger'> You no longer have permission to die. </span>", add);
					} else {
						fail_msg = rt.modify(live(fail_msg), "<span class='userdanger'> The truth could still slip out!</font><B><font size=5 color=red> Cease any terrorist actions as soon as possible, unneeded property damage or loss of employee life will lead to your contract being terminated.</span>", add);
					}
					rt.callSrc(f, "reinstate_escape_objective", [rt.sv(f, "owner")]);
					rt.setFv(f, "last_man_standing", live(_this), 0);
				}
				rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), live(fail_msg)]);
				rt.setFv(f, "stolen", live(objective), 0);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/antagonist/traitor/proc/forge_iaa_objectives  (code/datums/antagonists/datum_internal_affairs.dm:260)  may sleep
rt.def("/datum/antagonist/traitor/proc/forge_iaa_objectives", function* forge_iaa_objectives(f: Frame) {
	let _this: Value = null, target_mind: Value = null, destroy_objective: Value = null, kill_objective: Value = null;
	f.vars = () => [_this, target_mind, destroy_objective, kill_objective];
	_this = live(f.src);
	if ((truthy(rt.getLen(f, rt.gv(f, "target_list", rt.fv(f, "mode", rt.gl("SSticker"))))) && truthy(rt.index(rt.gv(f, "target_list", rt.fv(f, "mode", rt.gl("SSticker"))), rt.sv(f, "owner"))))) {
		if (truthy((rt.istype(rt.gv(f, "current", (target_mind = rt.index(rt.gv(f, "target_list", rt.fv(f, "mode", rt.gl("SSticker"))), rt.sv(f, "owner")))), T("/mob/living/silicon")) ? 1 : 0))) {
			rt.setFv(f, "owner", (destroy_objective = (yield* g.new_(f, T("/datum/objective/destroy/internal"), []))), rt.sv(f, "owner"));
			rt.setFv(f, "target", live(destroy_objective), live(target_mind));
			yield* g.callName(f, live(destroy_objective), "update_explanation_text", []);
		} else {
			rt.setFv(f, "owner", (kill_objective = (yield* g.new_(f, T("/datum/objective/assassinate/internal"), []))), rt.sv(f, "owner"));
			rt.setFv(f, "target", live(kill_objective), live(target_mind));
			yield* g.callName(f, live(kill_objective), "update_explanation_text", []);
			yield* g.srcCall(f, "add_objective", live(kill_objective));
		}
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			rt.setSv(f, "employer", "The Syndicate");
			rt.setFv(f, "special_role", rt.sv(f, "owner"), "Syndicate External Affairs Agent");
			rt.setSv(f, "special_role", "Syndicate External Affairs Agent");
			rt.setFv(f, "syndicate", live(_this), 1);
			yield* g.srcCall(f, "forge_single_objective");
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return live(f.dot);
}, true);

// /datum/antagonist/traitor/human/internal_affairs/proc/forge_traitor_objectives  (code/datums/antagonists/datum_internal_affairs.dm:290)  may sleep
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/forge_traitor_objectives", function* forge_traitor_objectives(f: Frame) {
	let escape_objective: Value = null;
	f.vars = () => [escape_objective];
	yield* g.srcCall(f, "forge_iaa_objectives");
	rt.setFv(f, "owner", (escape_objective = (yield* g.new_(f, T("/datum/objective/escape"), []))), rt.sv(f, "owner"));
	yield* g.srcCall(f, "add_objective", live(escape_objective));
	return f.dot;
}, true);

// /datum/antagonist/traitor/AI/internal_affairs/proc/forge_traitor_objectives  (code/datums/antagonists/datum_internal_affairs.dm:296)  may sleep
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/forge_traitor_objectives", function* forge_traitor_objectives(f: Frame) {
	let survive_objective: Value = null;
	f.vars = () => [survive_objective];
	yield* g.srcCall(f, "forge_iaa_objectives");
	rt.setFv(f, "owner", (survive_objective = (yield* g.new_(f, T("/datum/objective/survive"), []))), rt.sv(f, "owner"));
	yield* g.srcCall(f, "add_objective", live(survive_objective));
	return f.dot;
}, true);

// /datum/antagonist/traitor/proc/greet_iaa  (code/datums/antagonists/datum_internal_affairs.dm:302)
rt.def("/datum/antagonist/traitor/proc/greet_iaa", function greet_iaa(f: Frame) {
	let _this: Value = null, crime: Value = null;
	f.vars = () => [_this, crime];
	_this = live(f.src);
	crime = rt.op(f, "PickUnweighted", [21], ["distribution of contraband", "unauthorized erotic action on duty", "embezzlement", "piloting under the influence", "dereliction of duty", "syndicate collaboration", "mutiny", "multiple homicides", "corporate espionage", "recieving bribes", "malpractice", "worship of prohbited life forms", "possession of profane texts", "murder", "arson", "insulting their manager", "grand theft", "conspiracy", "attempting to unionize", "vandalism", "gross incompetence"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), fmt("<span class='userdanger'>You are the ＀.</span>", [rt.sv(f, "special_role")])]);
	if (truthy(rt.fv(f, "syndicate", live(_this)))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), fmt("<span class='userdanger'>Your target has been framed for ＀, and you have been tasked with eliminating them to prevent them defending themselves in court.</span>", [live(crime)])]);
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<B><font size=5 color=red>Any damage you cause will be a further embarrassment to Nanotrasen, so you have no limits on collateral damage.</font></B>"]);
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'> You have been provided with a standard uplink to accomplish your task. </span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), fmt("<span class='userdanger'>Your target is suspected of ＀, and you have been tasked with eliminating them by any means necessary to avoid a costly and embarrassing public trial.</span>", [live(crime)])]);
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<B><font size=5 color=red>While you have a license to kill, unneeded property damage or loss of employee life will lead to your contract being terminated.</font></B>"]);
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'>For the sake of plausible deniability, you have been equipped with an array of captured Syndicate weaponry available via uplink.</span>"]);
	}
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'>Finally, watch your back. Your target has friends in high places, and intel suggests someone may have taken out a contract of their own to protect them.</span>"]);
	rt.callName(f, rt.sv(f, "owner"), "announce_objectives", []);
	return f.dot;
});

// /datum/antagonist/traitor/AI/internal_affairs/proc/greet  (code/datums/antagonists/datum_internal_affairs.dm:319)
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/greet", function greet(f: Frame) {
	rt.callSrc(f, "greet_iaa", []);
	return f.dot;
});

// /datum/antagonist/traitor/human/internal_affairs/proc/greet  (code/datums/antagonists/datum_internal_affairs.dm:321)
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/greet", function greet(f: Frame) {
	rt.callSrc(f, "greet_iaa", []);
	return f.dot;
});
