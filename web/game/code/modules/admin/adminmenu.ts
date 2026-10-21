// From code/modules/admin/adminmenu.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(870, "/datum/verbs/menu/Admin", "/datum/verbs/menu", {});

// /datum/verbs/menu/Admin/proc/Generate_list  (code/modules/admin/adminmenu.dm:2)
rt.def("/datum/verbs/menu/Admin/proc/Generate_list", function Generate_list(f: Frame) {
	if (!truthy(rt.fv(f, "holder", live(f.args[0])))) return f.dot;
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["C"] });

// /datum/verbs/menu/Admin/verb/playerpanel  (code/modules/admin/adminmenu.dm:9)  may sleep
rt.def("/datum/verbs/menu/Admin/verb/playerpanel", function* playerpanel(f: Frame) {
	if (!truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) return f.dot;
	yield* g.callName(f, rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))), "player_panel_new", []);
	return f.dot;
}, true, { verb: { name: "Player Panel", category: "Admin", desc: "Player Panel" } });
