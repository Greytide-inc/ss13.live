// From code/modules/jobs/job_types/silicon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2773, "/datum/job/ai", "/datum/job", {
	title: "AI",
	flag: 512,
	department_flag: 1,
	faction: "Station",
	total_positions: 0,
	spawn_positions: 1,
	selection_color: "#ccffcc",
	supervisors: "your laws",
	req_admin_notify: 1,
});

// /datum/job/ai/proc/equip  (code/modules/jobs/job_types/silicon.dm:17)  may sleep
rt.def("/datum/job/ai/proc/equip", function* equip(f: Frame, H: Value) {
	f.vars = () => [H];
	return (yield* g.callName(f, live(H), "AIize", [0]));
}, true);

// /datum/job/ai/proc/after_spawn  (code/modules/jobs/job_types/silicon.dm:20)  may sleep
rt.def("/datum/job/ai/proc/after_spawn", function* after_spawn(f: Frame, AI: Value, M: Value) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [AI, M, R, $e];
	yield* g.callName(f, live(AI), "rename_self", ["ai", rt.fv(f, "client", live(M))]);
	if (!isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 2)) return f.dot;
	R = null;
	rt.forList(f, 0, rt.gl("silicon_mobs"), T("/mob/living/silicon/robot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (!truthy(rt.fv(f, "connected_ai", live(R)))) {
			yield* g.callName(f, live(R), "TryConnectToAI", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/job/ai/proc/config_check  (code/modules/jobs/job_types/silicon.dm:30)
rt.def("/datum/job/ai/proc/config_check", function config_check(f: Frame) {
	if ((truthy(rt.gl("config")) && truthy(rt.fv(f, "allow_ai", rt.gl("config"))))) {
		return 1;
	}
	return 0;
});

rt.type(2774, "/datum/job/cyborg", "/datum/job", {
	title: "Cyborg",
	flag: 1024,
	department_flag: 1,
	faction: "Station",
	total_positions: 0,
	spawn_positions: 1,
	supervisors: "your laws and the AI",
	selection_color: "#ddffdd",
});

// /datum/job/cyborg/proc/equip  (code/modules/jobs/job_types/silicon.dm:49)  may sleep
rt.def("/datum/job/cyborg/proc/equip", function* equip(f: Frame, H: Value) {
	f.vars = () => [H];
	return (yield* g.callName(f, live(H), "Robotize", [0, 0]));
}, true);

// /datum/job/cyborg/proc/after_spawn  (code/modules/jobs/job_types/silicon.dm:52)  may sleep
rt.def("/datum/job/cyborg/proc/after_spawn", function* after_spawn(f: Frame, R: Value, M: Value) {
	f.vars = () => [R, M];
	if (!truthy(rt.fv(f, "rename_cyborg", rt.gl("config")))) return f.dot;
	yield* g.callName(f, live(R), "rename_self", ["cyborg", rt.fv(f, "client", live(M))]);
	return f.dot;
}, true);
