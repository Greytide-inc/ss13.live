// From code/modules/jobs/job_types/assistant.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/job/assistant/proc/<init>  (code/modules/jobs/job_types/assistant.dm:13)
rt.def("/datum/job/assistant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access", rt.list());
	$0 = $0;
	rt.setSv(f, "minimal_access", rt.list());
	return f.dot;
});

// /datum/job/assistant/proc/get_access  (code/modules/jobs/job_types/assistant.dm:19)
rt.def("/datum/job/assistant/proc/get_access", function get_access(f: Frame) {
	if ((truthy(rt.bitAnd(rt.fv(f, "jobs_have_maint_access", rt.gl("config")), 1)) || !truthy(rt.fv(f, "jobs_have_minimal_access", rt.gl("config"))))) {
		f.dot = rt.callSuper(f, [], rt.Args.Same);
		(f.dot = rt.modify(live(f.dot), rt.list(12), rt.bitOr));
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
});

// /datum/job/assistant/proc/config_check  (code/modules/jobs/job_types/assistant.dm:26)
rt.def("/datum/job/assistant/proc/config_check", function config_check(f: Frame) {
	if ((truthy(rt.gl("config")) && !isEqual(rt.fv(f, "assistant_cap", rt.gl("config")), 0))) {
		rt.setSv(f, "total_positions", rt.fv(f, "assistant_cap", rt.gl("config")));
		rt.setSv(f, "spawn_positions", rt.fv(f, "assistant_cap", rt.gl("config")));
		return 1;
	}
	return 0;
});

rt.type(683, "/datum/outfit/job/assistant", "/datum/outfit/job", {
	name: "Assistant",
	jobtype: rt.typePath("/datum/job/assistant"),
});

// /datum/outfit/job/assistant/proc/pre_equip  (code/modules/jobs/job_types/assistant.dm:38)
rt.def("/datum/outfit/job/assistant/proc/pre_equip", function pre_equip(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "grey_assistants", rt.gl("config")))) {
		rt.setSv(f, "uniform", T("/obj/item/clothing/under/color/grey"));
	} else {
		rt.setSv(f, "uniform", T("/obj/item/clothing/under/color/random"));
	}
	return f.dot;
}, false, { args: ["H"] });
