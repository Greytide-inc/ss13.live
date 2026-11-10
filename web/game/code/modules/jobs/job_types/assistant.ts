// Based on /tg/station's code/modules/jobs/job_types/assistant.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2743, "/datum/job/assistant", "/datum/job", {
	title: "Assistant",
	flag: 8192,
	department_flag: 4,
	faction: "Station",
	total_positions: -1,
	spawn_positions: -1,
	supervisors: "absolutely everyone",
	selection_color: "#dddddd",
	access: null,
	minimal_access: null,
	outfit: rt.typePath("/datum/outfit/job/assistant"),
});

// assistant.dm:13
rt.def("/datum/job/assistant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.access = list();

	this.minimal_access = list();
	return f.dot;
});

// assistant.dm:19
rt.def("/datum/job/assistant/proc/get_access", function get_access(f: Frame) {
	if (rt.bitAnd(GLOB.config.jobs_have_maint_access, 1) || !GLOB.config.jobs_have_minimal_access) {
		f.dot = parent_proc();
		(f.dot = rt.modify(f.dot, list(12), rt.bitOr));
	} else {
		return parent_proc();
	}
	return f.dot;
});

// assistant.dm:26
rt.def("/datum/job/assistant/proc/config_check", function config_check(f: Frame) {
	if (GLOB.config && GLOB.config.assistant_cap != 0) {
		this.total_positions = GLOB.config.assistant_cap;
		this.spawn_positions = GLOB.config.assistant_cap;
		return 1;
	}
	return 0;
});

rt.type(683, "/datum/outfit/job/assistant", "/datum/outfit/job", {
	name: "Assistant",
	jobtype: rt.typePath("/datum/job/assistant"),
});

// assistant.dm:38
rt.def("/datum/outfit/job/assistant/proc/pre_equip", function pre_equip(f: Frame, H: Value) {
	parent_proc();
	if (GLOB.config.grey_assistants) {
		this.uniform = T("/obj/item/clothing/under/color/grey");
	} else {
		this.uniform = T("/obj/item/clothing/under/color/random");
	}
	return f.dot;
}, false);
