// Based on /tg/station's code/modules/admin/adminmenu.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(870, "/datum/verbs/menu/Admin", "/datum/verbs/menu", {});

// adminmenu.dm:2
rt.def("/datum/verbs/menu/Admin/proc/Generate_list", function Generate_list(f: Frame, C: Value) {
	if (!C.holder) return f.dot;
	f.dot = parent_proc();
	return f.dot;
}, false);

// adminmenu.dm:9
rt.def("/datum/verbs/menu/Admin/verb/playerpanel", function* playerpanel(f: Frame) {
	if (!f.usr.client.holder) return f.dot;
	yield* f.usr.client.holder.player_panel_new();
	return f.dot;
}, true, { verb: { name: "Player Panel", category: "Admin", desc: "Player Panel" } });
