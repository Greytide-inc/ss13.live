// Based on /tg/station's interface/menu.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// menu.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalmenulist", function InitGlobalmenulist(f: Frame) {
	GLOB.menulist = list();
	this.gvars_datum_init_order += "menulist";
	return f.dot;
});

rt.type(869, "/datum/verbs/menu", "/datum/verbs", {
	checkbox: 0,
	default: null,
});

// menu.dm:20
rt.def("/datum/verbs/menu/proc/HandleVerb", function HandleVerb(f: Frame, entry: Value, verbpath: Value, C: Value) {
	let true_checkbox: Value = null, checkedverb: Value = null;
	let verb_true_parent: Value = rt.index(GLOB.menulist, rt.index(this.verblist, verbpath));
	if ((true_checkbox = verb_true_parent.checkbox) != CHECKBOX_NONE) {
		checkedverb = verb_true_parent.Get_checked(C);
		if (true_checkbox == 1) {
			if (verbpath == checkedverb) {
				rt.setAt(entry, "is-checked", 1);
			} else {
				rt.setAt(entry, "is-checked", CHECKBOX_NONE);
			}
		} else if (true_checkbox == CHECKBOX_TOGGLE) {
			rt.setAt(entry, "is-checked", checkedverb);
		}
		rt.setAt(entry, "command", `.updatemenuchecked "${verb_true_parent.type}" "${verbpath}"\n${rt.at(entry, "command")}`);
		rt.setAt(entry, "can-check", CHECKBOX_GROUP);
		rt.setAt(entry, "group", `${verb_true_parent.type}`);
	}
	return list2params(entry);
});

// menu.dm:38
rt.def("/datum/verbs/menu/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return ((rt.index(C.prefs.menuoptions, this.type) || this.default) || 0);
});

// menu.dm:44
rt.def("/datum/verbs/menu/proc/Set_checked", function Set_checked(f: Frame, C: Value, verbpath: Value) {
	let checked: Value = null;
	if (this.checkbox == CHECKBOX_GROUP) {
		rt.setAt(C.prefs.menuoptions, this.type, verbpath);
		C.prefs.save_preferences();
	} else {
		if (this.checkbox != CHECKBOX_TOGGLE) return f.dot;
		checked = this.Get_checked(C);
		rt.setAt(C.prefs.menuoptions, this.type, (!checked ? 1 : 0));
		C.prefs.save_preferences();
		winset(C, `${verbpath}`, `is-checked = ${(!checked ? 1 : 0)}`);
	}
	return f.dot;
});

// menu.dm:55
rt.def("/client/verb/updatemenuchecked", function updatemenuchecked(f: Frame, menutype: Value, verbpath: Value) {
	let M: Value = null;
	menutype = text2path(menutype);
	verbpath = text2path(verbpath);
	if (!menutype || !verbpath) {
		return f.dot;
	}
	if (!(M = rt.index(GLOB.menulist, menutype))) {
		return f.dot;
	}
	if (!rt.isIn(f, verbpath, typesof(`${menutype}/verb`))) {
		return f.dot;
	}
	M.Set_checked(this, verbpath);
	return f.dot;
}, false, { verb: { name: ".updatemenuchecked" }, argTypes: [{ type: 2 }, { type: 2 }] });

rt.type(892, "/datum/verbs/menu/Icon", "/datum/verbs/menu", {});

// menu.dm:68
rt.def("/datum/verbs/menu/Icon/proc/Load_checked", function Load_checked(f: Frame, C: Value) {
	let verbpath: Value = null;
	if (!(verbpath = this.Get_checked(C)) || !rt.isIn(f, verbpath, typesof(`${this.type}/verb`))) {
		return f.dot;
	}
	if (copytext(verbpath.name, 1, 2) == "@") {
		winset(C, null, list2params(rt.alist(f, ["command", copytext(verbpath.name, 2)])));
	} else {
		winset(C, null, list2params(rt.alist(f, ["command", replacetext(verbpath.name, " ", "-")])));
	}
	return f.dot;
});
