// Based on /tg/station's code/datums/antagonists/datum_internal_affairs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(908, "/datum/antagonist/traitor/human/internal_affairs", "/datum/antagonist/traitor/human", {
	syndicate: 0,
	last_man_standing: 0,
	targets_stolen: null,
	name: "Internal Affairs Agent",
	employer: "Nanotrasen",
	special_role: "internal affairs agent",
	base_datum_custom: rt.typePath("/datum/antagonist/traitor/internal_affairs/custom"),
});

// datum_internal_affairs.dm:44
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/transfer_important_variables", function transfer_important_variables(f: Frame, other: Value) {
	parent_proc(other);
	other.syndicate = this.syndicate;
	other.last_man_standing = this.last_man_standing;
	other.targets_stolen = this.targets_stolen;
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

// datum_internal_affairs.dm:50
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/transfer_important_variables", function transfer_important_variables(f: Frame, other: Value) {
	parent_proc(other);
	other.syndicate = this.syndicate;
	other.last_man_standing = this.last_man_standing;
	other.targets_stolen = this.targets_stolen;
	return f.dot;
});

// datum_internal_affairs.dm:56
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/give_pinpointer", function* give_pinpointer(f: Frame) {
	if (!(this.owner && this.owner.current)) return f.dot;
	yield* this.owner.current.apply_status_effect(T("/datum/status_effect/agent_pinpointer"));
	return f.dot;
}, true);

// datum_internal_affairs.dm:60
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/apply_innate_effects", function* apply_innate_effects(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(this.owner && this.owner.current)) return f.dot;
	yield* this.give_pinpointer(this.owner.current);
	return f.dot;
}, true);

// datum_internal_affairs.dm:65
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/remove_innate_effects", function* remove_innate_effects(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(this.owner && this.owner.current)) return f.dot;
	yield* this.owner.current.remove_status_effect(T("/datum/status_effect/agent_pinpointer"));
	return f.dot;
}, true);

// datum_internal_affairs.dm:74
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/on_gain", function* on_gain(f: Frame) {
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSprocessing.processing += this;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// datum_internal_affairs.dm:77
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/on_removal", function* on_removal(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSprocessing.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// datum_internal_affairs.dm:80
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/process", function process(f: Frame) {
	this.iaa_process();
	return f.dot;
}, false, { waitfor: false });

// datum_internal_affairs.dm:83
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/on_gain", function* on_gain(f: Frame) {
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSprocessing.processing += this;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// datum_internal_affairs.dm:86
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/on_removal", function* on_removal(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSprocessing.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// datum_internal_affairs.dm:89
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/process", function process(f: Frame) {
	this.iaa_process();
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

// datum_internal_affairs.dm:106
rt.def("/datum/status_effect/agent_pinpointer/proc/point_to_target", function point_to_target(f: Frame) {
	if (!this.scan_target) {
		this.linked_alert.icon_state = "pinonnull";
		return f.dot;
	}
	let here: Value = rt.getStep(f, this.owner, 0);
	let there: Value = rt.getStep(f, this.scan_target, 0);
	if (here.z != there.z) {
		this.linked_alert.icon_state = "pinonnull";
		return f.dot;
	}
	if (get_dist_euclidian(here, there) <= this.minimum_range + rand(0, PINPOINTER_EXTRA_RANDOM_RANGE)) {
		this.linked_alert.icon_state = "pinondirect";
	} else {
		this.linked_alert.setDir(rt.getDir(f, here, there));
		const dist = get_dist(here, there);
		if (rt.inRange(dist, 1, 8)) {
			this.linked_alert.icon_state = "pinonclose";
		} else if (rt.inRange(dist, 9, 16)) {
			this.linked_alert.icon_state = "pinonmedium";
		} else if (rt.inRange(dist, 16, 1e+31)) {
			this.linked_alert.icon_state = "pinonfar";
		}
	}
	return f.dot;
});

// datum_internal_affairs.dm:129
rt.def("/datum/status_effect/agent_pinpointer/proc/scan_for_target", function scan_for_target(f: Frame) {
	let objective_: Value = null, objective: Value = null, current: Value = null;
	this.scan_target = null;
	if (!this.owner) return f.dot;
	if (!this.owner.mind) return f.dot;
	if (!this.owner.mind.objectives) return f.dot;
	for (objective_ of each(this.owner.mind.objectives, T("/datum/objective"))) {
		if (!is_internal_objective(objective_)) {
			continue;
		}
		objective = objective_;
		if (!((current = objective.target.current) && current.stat != 2)) break;
		this.scan_target = current;
		break;
	}
	return f.dot;
});

// datum_internal_affairs.dm:141
rt.def("/datum/status_effect/agent_pinpointer/proc/tick", function* tick(f: Frame) {
	if (!this.owner) {
		yield* qdel(this);
		return f.dot;
	}
	this.scan_for_target();
	this.point_to_target();
	return f.dot;
}, true);

// datum_internal_affairs.dm:149
rt.def("/proc/is_internal_objective", function is_internal_objective(f: Frame, O: Value) {
	return ((rt.istype(O, T("/datum/objective/assassinate/internal")) ? 1 : 0) || (rt.istype(O, T("/datum/objective/destroy/internal")) ? 1 : 0));
});

// datum_internal_affairs.dm:152
rt.def("/datum/antagonist/traitor/proc/replace_escape_objective", function replace_escape_objective(f: Frame) {
	let objective_: Value = null, martyr_objective: Value = null;
	if (!this.owner || !this.owner.objectives) {
		return f.dot;
	}
	for (objective_ of each(this.owner.objectives)) {
		if (!(rt.istype(objective_, T("/datum/objective/escape")) || rt.istype(objective_, T("/datum/objective/survive")))) {
			continue;
		}
		this.remove_objective(objective_);
	}
	(martyr_objective = new_(T("/datum/objective/martyr"))).owner = this.owner;
	this.add_objective(martyr_objective);
	return f.dot;
});

// datum_internal_affairs.dm:164
rt.def("/datum/antagonist/traitor/proc/reinstate_escape_objective", function reinstate_escape_objective(f: Frame) {
	let objective_: Value = null;
	if (!this.owner || !this.owner.objectives) {
		return f.dot;
	}
	for (objective_ of each(this.owner.objectives)) {
		if (!rt.istype(objective_, T("/datum/objective/martyr"))) {
			continue;
		}
		this.remove_objective(objective_);
	}
	return f.dot;
});

// datum_internal_affairs.dm:172
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/reinstate_escape_objective", function reinstate_escape_objective(f: Frame) {
	let escape_objective: Value = null;
	parent_proc();
	(escape_objective = new_(T("/datum/objective/escape"))).owner = this.owner;
	this.add_objective(escape_objective);
	return f.dot;
});

// datum_internal_affairs.dm:178
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/reinstate_escape_objective", function reinstate_escape_objective(f: Frame) {
	let survive_objective: Value = null;
	parent_proc();
	(survive_objective = new_(T("/datum/objective/survive"))).owner = this.owner;
	this.add_objective(survive_objective);
	return f.dot;
});

// datum_internal_affairs.dm:184
rt.def("/datum/antagonist/traitor/proc/steal_targets", function steal_targets(f: Frame, victim: Value) {
	let objective_: Value = null, objective: Value = null, new_objective: Value = null, status_text: Value = null;
	let $0: any, $e: any;
	let _this: Value = this;
	if (!this.owner.current || this.owner.current.stat == 2) {
		return f.dot;
	}
	to_chat(this.owner.current, `<span class='userdanger'> Target eliminated: ${victim.name}</span>`);
	for (objective_ of each(victim.objectives)) {
		if (rt.istype(objective_, T("/datum/objective/assassinate/internal"))) {
			if ((objective = objective_).target == this.owner) {
				continue;
			}
			if (_this.targets_stolen.Find(objective.target) == 0) {
				(new_objective = new_(T("/datum/objective/assassinate/internal"))).owner = this.owner;
				new_objective.target = objective.target;
				new_objective.update_explanation_text();
				this.add_objective(new_objective);
				_this.targets_stolen += objective.target;
				if (objective.check_completion()) {
					$0 = "neutralised";
				} else {
					$0 = "active";
				}
				status_text = $0;
				to_chat(this.owner.current, `<span class='userdanger'> New target added to database: ${objective.target.name} (${status_text}) </span>`);
			}
		} else if (rt.istype(objective_, T("/datum/objective/destroy/internal"))) {
			objective = objective_;
			new_objective = new_(T("/datum/objective/destroy/internal"));
			if (objective.target == this.owner) {
				continue;
			}
			if (_this.targets_stolen.Find(objective.target) == 0) {
				new_objective.owner = this.owner;
				new_objective.target = objective.target;
				new_objective.update_explanation_text();
				this.add_objective(new_objective);
				_this.targets_stolen += objective.target;
				if (objective.check_completion()) {
					$0 = "neutralised";
				} else {
					$0 = "active";
				}
				status_text = $0;
				to_chat(this.owner.current, `<span class='userdanger'> New target added to database: ${objective.target.name} (${status_text}) </span>`);
			}
		}
	}
	_this.last_man_standing = 1;
	objective_ = null;
	for (objective_ of each(this.owner.objectives)) {
		if (!is_internal_objective(objective_)) {
			continue;
		}
		if (!(objective = objective_).check_completion()) {
			_this.last_man_standing = 0;
			return f.dot;
		}
	}
	if (!_this.last_man_standing) return f.dot;
	if (_this.syndicate) {
		to_chat(this.owner.current, "<span class='userdanger'> All the loyalist agents are dead, and no more is required of you. Die a glorious death, agent. </span>");
	} else {
		to_chat(this.owner.current, "<span class='userdanger'> All the other agents are dead, and you're the last loose end. Stage a Syndicate terrorist attack to cover up for today's events. You no longer have any limits on collateral damage.</span>");
	}
	this.replace_escape_objective(this.owner);
	return f.dot;
});

// datum_internal_affairs.dm:232
rt.def("/datum/antagonist/traitor/proc/iaa_process", function iaa_process(f: Frame) {
	let objective_: Value = null, objective: Value = null, fail_msg: Value = null;
	let _this: Value = this;
	if (!(this.owner && this.owner.current && this.owner.current.stat != 2)) return f.dot;
	for (objective_ of each(this.owner.objectives)) {
		if (!is_internal_objective(objective_)) {
			continue;
		}
		if (!(objective = objective_).target) {
			continue;
		}
		if (objective.check_completion()) {
			if (objective.stolen) {
				continue;
			}
			this.steal_targets(objective.target);
			objective.stolen = 1;
		} else if (objective.stolen) {
			fail_msg = `<span class='userdanger'>Your sensors tell you that ${objective.target.current.real_name}, one of the targets you were meant to have killed, pulled one over on you, and is still alive - do the job properly this time! </span>`;
			if (_this.last_man_standing) {
				if (_this.syndicate) {
					fail_msg += "<span class='userdanger'> You no longer have permission to die. </span>";
				} else {
					fail_msg += "<span class='userdanger'> The truth could still slip out!</font><B><font size=5 color=red> Cease any terrorist actions as soon as possible, unneeded property damage or loss of employee life will lead to your contract being terminated.</span>";
				}
				this.reinstate_escape_objective(this.owner);
				_this.last_man_standing = 0;
			}
			to_chat(this.owner.current, fail_msg);
			objective.stolen = 0;
		}
	}
	return f.dot;
});

// datum_internal_affairs.dm:260
rt.def("/datum/antagonist/traitor/proc/forge_iaa_objectives", function* forge_iaa_objectives(f: Frame) {
	let target_mind: Value = null, destroy_objective: Value = null, kill_objective: Value = null;
	let _this: Value = this;
	if (rt.len(f, GLOB.SSticker.mode.target_list) && rt.index(GLOB.SSticker.mode.target_list, this.owner)) {
		if (rt.istype((target_mind = rt.index(GLOB.SSticker.mode.target_list, this.owner)).current, T("/mob/living/silicon"))) {
			(destroy_objective = (yield* new_(T("/datum/objective/destroy/internal")))).owner = this.owner;
			destroy_objective.target = target_mind;
			destroy_objective.update_explanation_text();
		} else {
			(kill_objective = (yield* new_(T("/datum/objective/assassinate/internal")))).owner = this.owner;
			kill_objective.target = target_mind;
			kill_objective.update_explanation_text();
			this.add_objective(kill_objective);
		}
		if (prob(PROB_ACTUAL_TRAITOR)) {
			this.employer = "The Syndicate";
			this.owner.special_role = "Syndicate External Affairs Agent";
			this.special_role = "Syndicate External Affairs Agent";
			_this.syndicate = 1;
			yield* this.forge_single_objective();
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// datum_internal_affairs.dm:290
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/forge_traitor_objectives", function* forge_traitor_objectives(f: Frame) {
	let escape_objective: Value = null;
	yield* this.forge_iaa_objectives();
	(escape_objective = (yield* new_(T("/datum/objective/escape")))).owner = this.owner;
	this.add_objective(escape_objective);
	return f.dot;
}, true);

// datum_internal_affairs.dm:296
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/forge_traitor_objectives", function* forge_traitor_objectives(f: Frame) {
	let survive_objective: Value = null;
	yield* this.forge_iaa_objectives();
	(survive_objective = (yield* new_(T("/datum/objective/survive")))).owner = this.owner;
	this.add_objective(survive_objective);
	return f.dot;
}, true);

// datum_internal_affairs.dm:302
rt.def("/datum/antagonist/traitor/proc/greet_iaa", function greet_iaa(f: Frame) {
	let _this: Value = this;
	let crime: Value = pick("distribution of contraband", "unauthorized erotic action on duty", "embezzlement", "piloting under the influence", "dereliction of duty", "syndicate collaboration", "mutiny", "multiple homicides", "corporate espionage", "recieving bribes", "malpractice", "worship of prohbited life forms", "possession of profane texts", "murder", "arson", "insulting their manager", "grand theft", "conspiracy", "attempting to unionize", "vandalism", "gross incompetence");
	to_chat(this.owner.current, `<span class='userdanger'>You are the ${this.special_role}.</span>`);
	if (_this.syndicate) {
		to_chat(this.owner.current, `<span class='userdanger'>Your target has been framed for ${crime}, and you have been tasked with eliminating them to prevent them defending themselves in court.</span>`);
		to_chat(this.owner.current, "<B><font size=5 color=red>Any damage you cause will be a further embarrassment to Nanotrasen, so you have no limits on collateral damage.</font></B>");
		to_chat(this.owner.current, "<span class='userdanger'> You have been provided with a standard uplink to accomplish your task. </span>");
	} else {
		to_chat(this.owner.current, `<span class='userdanger'>Your target is suspected of ${crime}, and you have been tasked with eliminating them by any means necessary to avoid a costly and embarrassing public trial.</span>`);
		to_chat(this.owner.current, "<B><font size=5 color=red>While you have a license to kill, unneeded property damage or loss of employee life will lead to your contract being terminated.</font></B>");
		to_chat(this.owner.current, "<span class='userdanger'>For the sake of plausible deniability, you have been equipped with an array of captured Syndicate weaponry available via uplink.</span>");
	}
	to_chat(this.owner.current, "<span class='userdanger'>Finally, watch your back. Your target has friends in high places, and intel suggests someone may have taken out a contract of their own to protect them.</span>");
	this.owner.announce_objectives();
	return f.dot;
});

// datum_internal_affairs.dm:319
rt.def("/datum/antagonist/traitor/AI/internal_affairs/proc/greet", function greet(f: Frame) {
	this.greet_iaa();
	return f.dot;
});

// datum_internal_affairs.dm:321
rt.def("/datum/antagonist/traitor/human/internal_affairs/proc/greet", function greet(f: Frame) {
	this.greet_iaa();
	return f.dot;
});
