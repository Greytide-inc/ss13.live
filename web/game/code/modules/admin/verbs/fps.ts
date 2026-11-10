// Based on /tg/station's code/modules/admin/verbs/fps.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g } = rt;


// fps.dm:7
rt.def("/client/proc/set_server_fps", function* set_server_fps(f: Frame) {
	let new_fps: Value = null, msg: Value = null;
	if (!check_rights(32)) {
		return f.dot;
	}
	if ((new_fps = round((yield* g.op(f, "Prompt", [33], [null, rt.world().fps, "FPS", `Sets game frames-per-second. Can potentially break the game (default: ${GLOB.config.fps})`, null])))) <= 0) {
		to_chat(this, "<span class='danger'>Error: set_server_fps(): Invalid world.fps value. No changes made.</span>");
		return f.dot;
	}
	if (new_fps > GLOB.config.fps * 1.5) {
		if ((yield* alert(this, `You are setting fps to a high value:\n\t${new_fps} frames-per-second\n\tconfig.fps = ${GLOB.config.fps}`, "Warning!", "Confirm", "ABORT-ABORT-ABORT")) != "Confirm") {
			return f.dot;
		}
	}
	log_admin((msg = `${key_name(this)} has modified world.fps to ${new_fps}`), 0);
	message_admins(msg, 0);
	rt.world().fps = new_fps;
	return f.dot;
}, true, { verb: { name: "Set Server FPS", category: "Debug", desc: "Sets game speed in frames-per-second. Can potentially break the game" } });
