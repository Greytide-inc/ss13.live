// From code/modules/admin/verbs/maprotation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/forcerandomrotate  (code/modules/admin/verbs/maprotation.dm:4)  may sleep
rt.def("/client/proc/forcerandomrotate", function* forcerandomrotate(f: Frame) {
	let rotate: Value = null;
	f.vars = () => [rotate];
	if (!isEqual((rotate = (yield* g.call(f, P("/proc/alert"), null, ["Force a random map rotation to trigger?", "Rotate map?", "Yes", "Cancel"]))), "Yes")) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ is forcing a random map rotation.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ is forcing a random map rotation.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	rt.setFv(f, "maprotatechecked", rt.gl("SSticker"), 1);
	yield* g.callName(f, rt.gl("SSmapping"), "maprotate", []);
	return f.dot;
}, true, { verb: { name: "Trigger Random Map Rotation", category: "Server" } });

// /client/proc/adminchangemap  (code/modules/admin/verbs/maprotation.dm:15)  may sleep
rt.def("/client/proc/adminchangemap", function* adminchangemap(f: Frame) {
	let maprotatechoices: Value = null, map: Value = null, VM: Value = null, mapname: Value = null, chosenmap: Value = null;
	let $e: any;
	f.vars = () => [maprotatechoices, map, VM, mapname, chosenmap, $e];
	maprotatechoices = rt.list();
	map = null;
	rt.forList(f, 0, rt.fv(f, "maplist", rt.gl("config")));
	while (($e = rt.next(f, 0)) !== undefined) {
		map = $e;
		VM = rt.index(rt.fv(f, "maplist", rt.gl("config")), live(map));
		mapname = rt.fv(f, "map_name", live(VM));
		if (isEqual(live(VM), rt.fv(f, "defaultmap", rt.gl("config")))) {
			mapname = rt.modify(live(mapname), " (Default)", add);
		}
		if ((rt.gt(rt.fv(f, "config_min_users", live(VM)), 0) || rt.gt(rt.fv(f, "config_max_users", live(VM)), 0))) {
			mapname = rt.modify(live(mapname), " [", add);
			if (rt.gt(rt.fv(f, "config_min_users", live(VM)), 0)) {
				mapname = rt.modify(live(mapname), fmt("＀", [rt.fv(f, "config_min_users", live(VM))]), add);
			} else {
				mapname = rt.modify(live(mapname), "0", add);
			}
			mapname = rt.modify(live(mapname), "-", add);
			if (rt.gt(rt.fv(f, "config_max_users", live(VM)), 0)) {
				mapname = rt.modify(live(mapname), fmt("＀", [rt.fv(f, "config_max_users", live(VM))]), add);
			} else {
				mapname = rt.modify(live(mapname), "inf", add);
			}
			mapname = rt.modify(live(mapname), "]", add);
		}
		rt.setAt(live(maprotatechoices), live(mapname), live(VM));
	}
	rt.endFor(f, 0);
	if (!truthy((chosenmap = (yield* g.op(f, "Prompt", [1], [null, null, "Change Map", "Choose a map to change to", live(maprotatechoices)]))))) {
		return live(f.dot);
	}
	rt.setFv(f, "maprotatechecked", rt.gl("SSticker"), 1);
	VM = rt.index(live(maprotatechoices), live(chosenmap));
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ is changing the map to ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.fv(f, "map_name", live(VM))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ is changing the map to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "map_name", live(VM))])]);
	if (!isEqual((yield* g.callName(f, rt.gl("SSmapping"), "changemap", [live(VM)])), 0)) return f.dot;
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has changed the map to ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.fv(f, "map_name", live(VM))])]);
	return f.dot;
}, true, { verb: { name: "Change Map", category: "Server" } });
