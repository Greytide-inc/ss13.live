// Based on /tg/station's code/modules/admin/verbs/maprotation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g } = rt;


// maprotation.dm:4
rt.def("/client/proc/forcerandomrotate", function* forcerandomrotate(f: Frame) {
	let rotate: Value = null;
	if ((rotate = (yield* alert("Force a random map rotation to trigger?", "Rotate map?", "Yes", "Cancel"))) != "Yes") {
		return f.dot;
	}
	message_admins(`${key_name_admin(f.usr)} is forcing a random map rotation.`);
	log_admin(`${key_name(f.usr)} is forcing a random map rotation.`);
	GLOB.SSticker.maprotatechecked = 1;
	GLOB.SSmapping.maprotate();
	return f.dot;
}, true, { verb: { name: "Trigger Random Map Rotation", category: "Server" } });

// maprotation.dm:15
rt.def("/client/proc/adminchangemap", function* adminchangemap(f: Frame) {
	let map: Value = null, VM: Value = null, mapname: Value = null, chosenmap: Value = null;
	let maprotatechoices: Value = list();
	for (map of each(GLOB.config.maplist)) {
		VM = rt.index(GLOB.config.maplist, map);
		mapname = VM.map_name;
		if (VM == GLOB.config.defaultmap) {
			mapname += " (Default)";
		}
		if (VM.config_min_users > 0 || VM.config_max_users > 0) {
			mapname += " [";
			if (VM.config_min_users > 0) {
				mapname += `${VM.config_min_users}`;
			} else {
				mapname += "0";
			}
			mapname += "-";
			if (VM.config_max_users > 0) {
				mapname += `${VM.config_max_users}`;
			} else {
				mapname += "inf";
			}
			mapname += "]";
		}
		rt.setAt(maprotatechoices, mapname, VM);
	}
	if (!(chosenmap = (yield* g.op(f, "Prompt", [1], [null, null, "Change Map", "Choose a map to change to", maprotatechoices])))) {
		return f.dot;
	}
	GLOB.SSticker.maprotatechecked = 1;
	VM = rt.index(maprotatechoices, chosenmap);
	message_admins(`${key_name_admin(f.usr)} is changing the map to ${VM.map_name}`);
	log_admin(`${key_name(f.usr)} is changing the map to ${VM.map_name}`);
	if (GLOB.SSmapping.changemap(VM) != 0) return f.dot;
	message_admins(`${key_name_admin(f.usr)} has changed the map to ${VM.map_name}`);
	return f.dot;
}, true, { verb: { name: "Change Map", category: "Server" } });
