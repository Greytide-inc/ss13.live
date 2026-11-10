// Based on /tg/station's code/modules/jobs/job_types/silicon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// silicon.dm:17
rt.def("/datum/job/ai/proc/equip", function* equip(f: Frame, H: Value) {
	return (yield* H.AIize(0));
}, true);

// silicon.dm:20
rt.def("/datum/job/ai/proc/after_spawn", function* after_spawn(f: Frame, AI: Value, M: Value) {
	let R: Value = null;
	yield* AI.rename_self("ai", M.client);
	if (GLOB.SSticker.current_state != GAME_STATE_SETTING_UP) return f.dot;
	for (R of each(GLOB.silicon_mobs, T("/mob/living/silicon/robot"))) {
		if (!R.connected_ai) {
			yield* R.TryConnectToAI();
		}
	}
	return f.dot;
}, true);

// silicon.dm:30
rt.def("/datum/job/ai/proc/config_check", function config_check(f: Frame) {
	if (GLOB.config && GLOB.config.allow_ai) {
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

// silicon.dm:49
rt.def("/datum/job/cyborg/proc/equip", function* equip(f: Frame, H: Value) {
	return (yield* H.Robotize(0, 0));
}, true);

// silicon.dm:52
rt.def("/datum/job/cyborg/proc/after_spawn", function* after_spawn(f: Frame, R: Value, M: Value) {
	if (!GLOB.config.rename_cyborg) return f.dot;
	yield* R.rename_self("cyborg", M.client);
	return f.dot;
}, true);
