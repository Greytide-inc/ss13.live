// From code/modules/admin/verbs/fps.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/set_server_fps  (code/modules/admin/verbs/fps.dm:7)  may sleep
rt.def("/client/proc/set_server_fps", function* set_server_fps(f: Frame) {
	let new_fps: Value = null, msg: Value = null;
	f.vars = () => [new_fps, msg];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32])))) {
		return live(f.dot);
	}
	if (rt.le((new_fps = (yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [33], [null, rt.fv(f, "fps", rt.world()), "FPS", fmt("Sets game frames-per-second. Can potentially break the game (default: ＀)", [rt.fv(f, "fps", rt.gl("config"))]), null]))]))), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Error: set_server_fps(): Invalid world.fps value. No changes made.</span>"]);
		return live(f.dot);
	}
	if (rt.gt(live(new_fps), multiply(rt.fv(f, "fps", rt.gl("config")), 1.5))) {
		if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.src), fmt("You are setting fps to a high value:\n\t＀ frames-per-second\n\tconfig.fps = ＀", [live(new_fps), rt.fv(f, "fps", rt.gl("config"))]), "Warning!", "Confirm", "ABORT-ABORT-ABORT"])), "Confirm")) {
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/log_admin"), null, [(msg = fmt("＀ has modified world.fps to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(new_fps)])), 0]);
	yield* g.call(f, P("/proc/message_admins"), null, [live(msg), 0]);
	rt.setFv(f, "fps", rt.world(), live(new_fps));
	return f.dot;
}, true, { verb: { name: "Set Server FPS", category: "Debug", desc: "Sets game speed in frames-per-second. Can potentially break the game" } });
