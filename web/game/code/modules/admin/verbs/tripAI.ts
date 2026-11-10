// Based on /tg/station's code/modules/admin/verbs/tripAI.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// tripAI.dm:5
rt.def("/client/proc/triple_ai", function* triple_ai(f: Frame) {
	let job: Value = null;
	if (GLOB.SSticker.current_state > GAME_STATE_PREGAME) {
		to_chat(f.usr, "This option is currently only usable during pregame. This may change at a later date.");
		return f.dot;
	}
	if (!(job = (yield* GLOB.SSjob.GetJob("AI")))) {
		to_chat(f.usr, "Unable to locate the AI job");
		return f.dot;
	}
	if (GLOB.SSticker.triai) {
		GLOB.SSticker.triai = 0;
		to_chat(f.usr, "Only one AI will be spawned at round start.");
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} has toggled off triple AIs at round start.</span>`);
	} else {
		GLOB.SSticker.triai = 1;
		to_chat(f.usr, "There will be an AI Triumvirate at round start.");
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} has toggled on triple AIs at round start.</span>`);
	}
	return f.dot;
}, true, { verb: { name: "Create AI Triumvirate", category: "Fun" } });
