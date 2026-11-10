// Based on /tg/station's code/modules/admin/verbs/playsound.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// playsound.dm:4
rt.def("/client/proc/play_sound", function* play_sound(f: Frame, S: Value) {
	let admin_sound: Value = null, res: Value = null, M: Value = null;
	let $e: any;
	if (!check_rights(2048)) {
		return f.dot;
	}
	let freq: Value = 1;
	if (GLOB.SSevents.holidays && rt.index(GLOB.SSevents.holidays, "April Fool's Day")) {
		freq = pick(0.5, 0.7, 0.8, 0.85, 0.9, 0.95, 1.1, 1.2, 1.4, 1.6, 2, 2.5);
		to_chat(this, "You feel the Honkmother messing with your song...");
	}
	(admin_sound = (yield* new_(T("/sound")))).file = S;
	admin_sound.priority = 250;
	admin_sound.channel = 1023;
	admin_sound.frequency = freq;
	admin_sound.wait = 1;
	admin_sound.repeat = 0;
	admin_sound.status = 4;
	const subject = (res = (yield* alert(f.usr, "Show the title of this song to the players?", null, "No", "Yes", "Cancel")));
	if (subject === "Yes") {
		to_chat(rt.world(), `<span class='boldannounce'>An admin played: ${S}</span>`);
	} else if (subject === "Cancel") {
		return f.dot;
	}
	log_admin(`${key_name(this)} played sound ${S}`);
	message_admins(`${key_name_admin(this)} played sound ${S}`);
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (rt.bitAnd(M.client.prefs.toggles, 2)) {
			rt.op(f, "Output", [], [M, admin_sound], false);
		}
	}
	return f.dot;
}, true, { verb: { name: "Play Global Sound", category: "Fun" }, argTypes: [{ type: 2048 }] });

// playsound.dm:41
rt.def("/client/proc/play_local_sound", function play_local_sound(f: Frame, S: Value) {
	if (!check_rights(2048)) {
		return f.dot;
	}
	log_admin(`${key_name(this)} played a local sound ${S}`);
	message_admins(`${key_name_admin(this)} played a local sound ${S}`);
	playsound(rt.getStep(f, this.mob, 0), S, 50, 0, 0);
	return f.dot;
}, false, { verb: { name: "Play Local Sound", category: "Fun" }, argTypes: [{ type: 2048 }] });

// playsound.dm:52
rt.def("/client/proc/set_round_end_sound", function set_round_end_sound(f: Frame, S: Value) {
	if (!check_rights(2048)) {
		return f.dot;
	}
	GLOB.SSticker.SetRoundEndSound(S);
	log_admin(`${key_name(this)} set the round end sound to ${S}`);
	message_admins(`${key_name_admin(this)} set the round end sound to ${S}`);
	return f.dot;
}, false, { verb: { name: "Set Round End Sound", category: "Fun" }, argTypes: [{ type: 2048 }] });

// playsound.dm:64
rt.def("/client/proc/stop_sounds", function stop_sounds(f: Frame) {
	let M: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	log_admin(`${key_name(this)} stopped all currently playing sounds.`);
	message_admins(`${key_name_admin(this)} stopped all currently playing sounds.`);
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (M.client) {
			rt.op(f, "Output", [], [M, sound(null)], false);
		}
	}
	return f.dot;
}, false, { verb: { name: "Stop All Playing Sounds", category: "Debug" } });
