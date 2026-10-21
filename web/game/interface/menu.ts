// From interface/menu.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalmenulist  (interface/menu.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalmenulist", function InitGlobalmenulist(f: Frame) {
	rt.setGl("menulist", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "menulist", add);
	return f.dot;
});

rt.type(869, "/datum/verbs/menu", "/datum/verbs", {
	checkbox: 0,
	default: null,
});

// /datum/verbs/menu/proc/HandleVerb  (interface/menu.dm:20)
rt.def("/datum/verbs/menu/proc/HandleVerb", function HandleVerb(f: Frame, entry: Value, verbpath: Value, C: Value) {
	let verb_true_parent: Value = null, true_checkbox: Value = null, checkedverb: Value = null;
	f.vars = () => [verb_true_parent, true_checkbox, checkedverb];
	verb_true_parent = rt.index(rt.gl("menulist"), rt.index(rt.sv(f, "verblist"), live(verbpath)));
	if (!isEqual((true_checkbox = rt.fv(f, "checkbox", live(verb_true_parent))), 0)) {
		checkedverb = rt.callName(f, live(verb_true_parent), "Get_checked", [live(C)]);
		if (isEqual(live(true_checkbox), 1)) {
			if (isEqual(live(verbpath), live(checkedverb))) {
				rt.setAt(live(entry), "is-checked", 1);
			} else {
				rt.setAt(live(entry), "is-checked", 0);
			}
		} else {
			if (isEqual(live(true_checkbox), 2)) {
				rt.setAt(live(entry), "is-checked", live(checkedverb));
			}
		}
		rt.setAt(live(entry), "command", fmt(".updatemenuchecked \"＀\" \"＀\"\n＀", [rt.fv(f, "type", live(verb_true_parent)), live(verbpath), rt.at(live(entry), "command")]));
		rt.setAt(live(entry), "can-check", 1);
		rt.setAt(live(entry), "group", fmt("＀", [rt.fv(f, "type", live(verb_true_parent))]));
	}
	return rt.call(f, P("/proc/list2params"), null, [live(entry)]);
});

// /datum/verbs/menu/proc/Get_checked  (interface/menu.dm:38)
rt.def("/datum/verbs/menu/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return ((rt.index(rt.gv(f, "menuoptions", rt.fv(f, "prefs", live(C))), rt.sv(f, "type")) || rt.sv(f, "default")) || 0);
});

// /datum/verbs/menu/proc/Set_checked  (interface/menu.dm:44)
rt.def("/datum/verbs/menu/proc/Set_checked", function Set_checked(f: Frame, C: Value, verbpath: Value) {
	let checked: Value = null;
	f.vars = () => [checked];
	if (isEqual(rt.sv(f, "checkbox"), 1)) {
		rt.setAt(rt.gv(f, "menuoptions", rt.fv(f, "prefs", live(C))), rt.sv(f, "type"), live(verbpath));
		rt.callName(f, rt.fv(f, "prefs", live(C)), "save_preferences", []);
	} else {
		if (!isEqual(rt.sv(f, "checkbox"), 2)) return f.dot;
		checked = rt.callSrc(f, "Get_checked", [live(C)]);
		rt.setAt(rt.gv(f, "menuoptions", rt.fv(f, "prefs", live(C))), rt.sv(f, "type"), (!truthy(live(checked)) ? 1 : 0));
		rt.callName(f, rt.fv(f, "prefs", live(C)), "save_preferences", []);
		rt.call(f, P("/proc/winset"), null, [live(C), fmt("＀", [live(verbpath)]), fmt("is-checked = ＀", [(!truthy(live(checked)) ? 1 : 0)])]);
	}
	return f.dot;
});

// /client/verb/updatemenuchecked  (interface/menu.dm:55)
rt.def("/client/verb/updatemenuchecked", function updatemenuchecked(f: Frame, menutype: Value, verbpath: Value) {
	let M: Value = null;
	f.vars = () => [menutype, verbpath, M];
	menutype = rt.call(f, P("/proc/text2path"), null, [live(menutype)]);
	verbpath = rt.call(f, P("/proc/text2path"), null, [live(verbpath)]);
	if ((!truthy(live(menutype)) || !truthy(live(verbpath)))) {
		return live(f.dot);
	}
	if (!truthy((M = rt.index(rt.gl("menulist"), live(menutype))))) {
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, live(verbpath), rt.call(f, P("/proc/typesof"), null, [fmt("＀/verb", [live(menutype)])])) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.callName(f, live(M), "Set_checked", [live(f.src), live(verbpath)]);
	return f.dot;
}, false, { verb: { name: ".updatemenuchecked" }, argTypes: [{ type: 2 }, { type: 2 }] });

rt.type(892, "/datum/verbs/menu/Icon", "/datum/verbs/menu", {});

// /datum/verbs/menu/Icon/proc/Load_checked  (interface/menu.dm:68)
rt.def("/datum/verbs/menu/Icon/proc/Load_checked", function Load_checked(f: Frame, C: Value) {
	let verbpath: Value = null;
	f.vars = () => [verbpath];
	if ((!truthy((verbpath = rt.callSrc(f, "Get_checked", [live(C)]))) || !truthy((rt.isIn(f, live(verbpath), rt.call(f, P("/proc/typesof"), null, [fmt("＀/verb", [rt.sv(f, "type")])])) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (isEqual(rt.call(f, P("/proc/copytext"), null, [rt.fv(f, "name", live(verbpath)), 1, 2]), "@")) {
		rt.call(f, P("/proc/winset"), null, [live(C), null, rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["command", rt.call(f, P("/proc/copytext"), null, [rt.fv(f, "name", live(verbpath)), 2])])])]);
	} else {
		rt.call(f, P("/proc/winset"), null, [live(C), null, rt.call(f, P("/proc/list2params"), null, [rt.alist(f, ["command", rt.call(f, P("/proc/replacetext"), null, [rt.fv(f, "name", live(verbpath)), " ", "-"])])])]);
	}
	return f.dot;
});
