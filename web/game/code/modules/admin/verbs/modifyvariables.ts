// Based on /tg/station's code/modules/admin/verbs/modifyvariables.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// modifyvariables.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalVVlocked", function InitGlobalVVlocked(f: Frame) {
	GLOB.VVlocked = list("vars", "var_edited", "client", "virus", "viruses", "cuffed", "last_eaten", "unlock_content", "force_ending");
	this.gvars_datum_init_order += "VVlocked";
	return f.dot;
});

// modifyvariables.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalVVlocked", function InitGlobalVVlocked(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "VVlocked";
	return f.dot;
});

// modifyvariables.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalVVicon_edit_lock", function InitGlobalVVicon_edit_lock(f: Frame) {
	GLOB.VVicon_edit_lock = list("icon", "icon_state", "overlays", "underlays", "resize");
	this.gvars_datum_init_order += "VVicon_edit_lock";
	return f.dot;
});

// modifyvariables.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalVVicon_edit_lock", function InitGlobalVVicon_edit_lock(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "VVicon_edit_lock";
	return f.dot;
});

// modifyvariables.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalVVckey_edit", function InitGlobalVVckey_edit(f: Frame) {
	GLOB.VVckey_edit = list("key", "ckey");
	this.gvars_datum_init_order += "VVckey_edit";
	return f.dot;
});

// modifyvariables.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalVVckey_edit", function InitGlobalVVckey_edit(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "VVckey_edit";
	return f.dot;
});

// modifyvariables.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalVVpixelmovement", function InitGlobalVVpixelmovement(f: Frame) {
	GLOB.VVpixelmovement = list("step_x", "step_y", "bound_height", "bound_width", "bound_x", "bound_y");
	this.gvars_datum_init_order += "VVpixelmovement";
	return f.dot;
});

// modifyvariables.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalVVpixelmovement", function InitGlobalVVpixelmovement(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "VVpixelmovement";
	return f.dot;
});

// modifyvariables.dm:12
rt.def("/client/proc/vv_get_class", function vv_get_class(f: Frame, var_value: Value) {
	if (var_value === null) {
		f.dot = "NULL";
	} else if (isnum(var_value)) {
		f.dot = "Number";
	} else if (istext(var_value)) {
		if (findtext(var_value, "\n")) {
			f.dot = "Mutiline Text";
		} else {
			f.dot = "Text";
		}
	} else if (isicon(var_value)) {
		f.dot = "Icon";
	} else if (ismob(var_value)) {
		f.dot = "Mob Reference";
	} else if (isloc(var_value)) {
		f.dot = "Atom Reference";
	} else if (rt.istype(var_value, T("/client"))) {
		f.dot = "Client";
	} else if (rt.istype(var_value, T("/datum"))) {
		f.dot = "Datum Reference";
	} else if (ispath(var_value)) {
		if (ispath(var_value, T("/atom"))) {
			f.dot = "Atom Typepath";
		} else if (ispath(var_value, T("/datum"))) {
			f.dot = "Datum Typepath";
		} else {
			f.dot = "Custom Typepath";
		}
	} else if (rt.istype(var_value, T("/list"))) {
		f.dot = "List";
	} else if (isfile(var_value)) {
		f.dot = "File";
	} else {
		f.dot = "NULL";
	}
	return f.dot;
});

// modifyvariables.dm:56
rt.def("/client/proc/vv_get_value", function* vv_get_value(f: Frame, _class: Value, default_class: Value, current_value: Value, restricted_classes: Value, extra_classes: Value, classes: Value) {
	let type: Value = null, error: Value = null, subtypes: Value = null, things: Value = null, value: Value = null;
	f.dot = rt.alist(f, ["class", _class, "value", null]);
	if (!_class) {
		if (!classes) {
			classes = list("Number", "Text", "Mutiline Text", "Icon", "Atom Reference", "Datum Reference", "Mob Reference", "Client", "Atom Typepath", "Datum Typepath", "Custom Typepath", "File", "New Atom", "New Datum", "New Custom Typepath", "New List", "NULL", "Restore to Default");
		}
		if (this.holder && this.holder.marked_datum && !rt.isIn(f, "Marked Datum", restricted_classes)) {
			classes += `${"Marked Datum"} (${this.holder.marked_datum.type})`;
		}
		if (restricted_classes) {
			classes -= restricted_classes;
		}
		if (extra_classes) {
			classes += extra_classes;
		}
		rt.setAt(f.dot, "class", (yield* g.op(f, "Prompt", [1], [default_class, "Variable Type", "What kind of data?", this, classes])));
		if (this.holder && this.holder.marked_datum && rt.at(f.dot, "class") == `${"Marked Datum"} (${this.holder.marked_datum.type})`) {
			rt.setAt(f.dot, "class", "Marked Datum");
		}
	}
	const item = rt.at(f.dot, "class");
	if (item === "Text") {
		rt.setAt(f.dot, "value", (yield* g.op(f, "Prompt", [3], [null, current_value, "Text", "Enter new text:", null])));
		if (rt.at(f.dot, "value") === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
	} else if (item === "Mutiline Text") {
		rt.setAt(f.dot, "value", (yield* g.op(f, "Prompt", [65], [null, current_value, "Text", "Enter new text:", null])));
		if (rt.at(f.dot, "value") === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
	} else if (item === "Number") {
		rt.setAt(f.dot, "value", (yield* g.op(f, "Prompt", [33], [null, current_value, "Num", "Enter new number:", null])));
		if (rt.at(f.dot, "value") === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
	} else if (item === "Atom Typepath") {
		rt.setAt(f.dot, "value", (yield* pick_closest_path(0)));
		if (rt.at(f.dot, "value") === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
	} else if (item === "Datum Typepath") {
		rt.setAt(f.dot, "value", (yield* pick_closest_path(0, (yield* get_fancy_list_of_datum_types()))));
		if (rt.at(f.dot, "value") === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
	} else if (item === "Custom Typepath") {
		type = current_value;
		error = "";
		while (true) {
			if (!(type = (yield* g.op(f, "Prompt", [3], [null, type, "Type", `Enter type:${error}`, null])))) {
				break;
			}
			type = text2path(type);
			error = "\nType not found, Please try again";
			if (type) break;
		}
		if (!type) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
		rt.setAt(f.dot, "value", type);
	} else if (item === "Atom Reference") {
		type = (yield* pick_closest_path(0));
		if ((subtypes = (yield* this.vv_subtype_prompt(type))) === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
		things = (yield* this.vv_reference_list(type, subtypes));
		if (!(value = (yield* g.op(f, "Prompt", [1], [null, current_value, "Reference", "Select reference:", things])))) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
		rt.setAt(f.dot, "value", rt.index(things, value));
	} else if (item === "Datum Reference") {
		type = (yield* pick_closest_path(0, (yield* get_fancy_list_of_datum_types())));
		if ((subtypes = (yield* this.vv_subtype_prompt(type))) === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
		things = (yield* this.vv_reference_list(type, subtypes));
		if (!(value = (yield* g.op(f, "Prompt", [1], [null, current_value, "Reference", "Select reference:", things])))) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
		rt.setAt(f.dot, "value", rt.index(things, value));
	} else if (item === "Mob Reference") {
		type = (yield* pick_closest_path(0, make_types_fancy(typesof(T("/mob")))));
		if ((subtypes = (yield* this.vv_subtype_prompt(type))) === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
		things = (yield* this.vv_reference_list(type, subtypes));
		if (!(value = (yield* g.op(f, "Prompt", [1], [null, current_value, "Reference", "Select reference:", things])))) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
		rt.setAt(f.dot, "value", rt.index(things, value));
	} else if (item === "Client") {
		rt.setAt(f.dot, "value", (yield* g.op(f, "Prompt", [1], [null, current_value, "Reference", "Select reference:", GLOB.clients])));
		if (rt.at(f.dot, "value") === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
	} else if (item === "File") {
		rt.setAt(f.dot, "value", (yield* g.op(f, "Prompt", [513], [null, null, "File", "Pick file:", null])));
		if (rt.at(f.dot, "value") === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
	} else if (item === "Icon") {
		rt.setAt(f.dot, "value", (yield* g.op(f, "Prompt", [4097], [null, null, "Icon", "Pick icon:", null])));
		if (rt.at(f.dot, "value") === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
	} else if (item === "Marked Datum") {
		rt.setAt(f.dot, "value", this.holder.marked_datum);
		if (rt.at(f.dot, "value") === null) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
	} else if (item === "New Atom") {
		if (!(type = (yield* pick_closest_path(0)))) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
		rt.setAt(f.dot, "type", type);
		rt.setAt(f.dot, "value", (yield* new_(type)));
	} else if (item === "New Datum") {
		if (!(type = (yield* pick_closest_path(0, (yield* get_fancy_list_of_datum_types()))))) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
		rt.setAt(f.dot, "type", type);
		rt.setAt(f.dot, "value", (yield* new_(type)));
	} else if (item === "New Custom Typepath") {
		type = current_value;
		error = "";
		while (true) {
			if (!(type = (yield* g.op(f, "Prompt", [3], [null, type, "Type", `Enter type:${error}`, null])))) {
				break;
			}
			type = text2path(type);
			error = "\nType not found, Please try again";
			if (type) break;
		}
		if (!type) {
			rt.setAt(f.dot, "class", null);
			return f.dot;
		}
		rt.setAt(f.dot, "type", type);
		rt.setAt(f.dot, "value", (yield* new_(type)));
	} else if (item === "New List") {
		rt.setAt(f.dot, "value", list());
		rt.setAt(f.dot, "type", T("/list"));
	}
	return f.dot;
}, true);

// modifyvariables.dm:248
rt.def("/client/proc/vv_parse_text", function* vv_parse_text(f: Frame, O: Value, new_var: Value) {
	let process_vars: Value = null;
	if (!(O && findtext(new_var, "["))) return f.dot;
	if ((process_vars = (yield* alert(f.usr, "[] detected in string, process as variables?", "Process Variables?", "Yes", "No"))) != "Yes") return f.dot;
	f.dot = string2listofvars(new_var, O);
	return f.dot;
}, true);

// modifyvariables.dm:258
rt.def("/client/proc/vv_subtype_prompt", function* vv_subtype_prompt(f: Frame, type: Value) {
	let subtypes: Value = null;
	if (!ispath(type)) {
		return f.dot;
	}
	if (!(subtypes = typesof(type) - type) || !rt.len(f, subtypes)) {
		return 0;
	}
	if (!(subtypes && rt.len(f, subtypes))) return f.dot;
	const subject = (yield* alert("Strict object type detection?", "Type detection", "Strictly this type", "This type and subtypes", "Cancel"));
	if (subject === "Strictly this type") {
		return 0;
	} else if (subject === "This type and subtypes") {
		return 1;
	} else {
		return f.dot;
	}
}, true);

// modifyvariables.dm:273
rt.def("/client/proc/vv_reference_list", function* vv_reference_list(f: Frame, type: Value, subtypes: Value) {
	let fancytype: Value = null, thing: Value = null, D: Value = null, fancytype_6: Value = null, shorttype: Value = null;
	f.dot = list();
	let types: Value = list(type);
	if (subtypes) {
		types = typesof(type);
	}
	let fancytypes: Value = make_types_fancy(types);
	for (fancytype of each(fancytypes)) {
		rt.setAt(types, rt.index(fancytypes, fancytype), fancytype);
	}
	let things: Value = (yield* get_all_of_type(type, subtypes));
	let i: Value = 0;
	for (thing of each(things)) {
		D = thing;
		i++;
		if (findtext((fancytype_6 = rt.index(types, D.type)), rt.index(types, type))) {
			fancytype_6 = copytext(fancytype_6, lentext(rt.index(types, type)) + 1);
		}
		if (lentext((shorttype = copytext(`${D.type}`, lentext(`${type}`) + 1))) > lentext(fancytype_6)) {
			shorttype = fancytype_6;
		}
		if (!lentext(shorttype)) {
			shorttype = "/";
		}
		rt.setAt(f.dot, fmt("＀(＀)＃#＀", [D, shorttype, D, i]), D);
	}
	return f.dot;
}, true);

// modifyvariables.dm:306
rt.def("/client/proc/mod_list_add_ass", function* mod_list_add_ass(f: Frame, O: Value) {
	let _class: Value = null, varsvars: Value = null, V: Value = null;
	let L: Value = (yield* this.vv_get_value({ restricted_classes: list("Restore to Default") }));
	if (!(_class = rt.at(L, "class"))) {
		return f.dot;
	}
	let var_value: Value = rt.at(L, "value");
	if (_class == "Text" || _class == "Mutiline Text") {
		varsvars = (yield* this.vv_parse_text(O, var_value));
		for (V of each(varsvars)) {
			var_value = replacetext(var_value, `[${V}]`, `${rt.index(O.vars, V)}`);
		}
	}
	return var_value;
}, true);

// modifyvariables.dm:321
rt.def("/client/proc/mod_list_add", function* mod_list_add(f: Frame, L: Value, O: Value, original_name: Value, objectvar: Value) {
	let _class: Value = null, varsvars: Value = null, V: Value = null;
	let $e: any;
	let LL: Value = (yield* this.vv_get_value({ restricted_classes: list("Restore to Default") }));
	if (!(_class = rt.at(LL, "class"))) {
		return f.dot;
	}
	let var_value: Value = rt.at(LL, "value");
	if (_class == "Text" || _class == "Mutiline Text") {
		varsvars = (yield* this.vv_parse_text(O, var_value));
		for (V of each(varsvars)) {
			var_value = replacetext(var_value, `[${V}]`, `${rt.index(O.vars, V)}`);
		}
	}
	if (O) {
		L = (yield* L.Copy());
	}
	L += var_value;
	if ((yield* alert("Would you like to associate a value with the list entry?", null, "Yes", "No")) === "Yes") {
		rt.setAt(L, var_value, (yield* this.mod_list_add_ass(O)));
	}
	if (O) {
		if ((yield* O.vv_edit_var(objectvar, L)) == 0) {
			to_chat(this, "Your edit was rejected by the object.");
			return f.dot;
		}
	}
	let $0: any = this;
	log_world(`### ListVarEdit by ${$0}: ${O ? O.type : "/list"} ${objectvar}: ADDED=${var_value}`);
	log_admin(`${key_name(this)} modified ${original_name}'s ${objectvar}: ADDED=${var_value}`);
	message_admins(`${key_name_admin(this)} modified ${original_name}'s ${objectvar}: ADDED=${var_value}`);
	return f.dot;
}, true);

// modifyvariables.dm:349
rt.def("/client/proc/mod_list", function* mod_list(f: Frame, L: Value, O: Value, original_name: Value, objectvar: Value, index: Value, autodetect_class: Value) {
	let confirm: Value = null, i: Value = null, key: Value = null, value: Value = null, variable: Value = null, assoc_key: Value = null, prompt: Value = null, variable_5: Value = null, dir_text: Value = null, original_var: Value = null, _class: Value = null, LL: Value = null, varsvars: Value = null, V: Value = null;
	let $0: any, $e: any;
	autodetect_class ??= 0;
	if (!check_rights(1024)) {
		return f.dot;
	}
	if (!rt.istype(L, T("/list"))) {
		to_chat(this, "Not a List.");
		return f.dot;
	}
	if (rt.len(f, L) > 1000) {
		if ((confirm = (yield* alert(this, "The list you're trying to edit is very long, continuing may crash the server.", "Warning", "Continue", "Abort"))) != "Continue") {
			return f.dot;
		}
	}
	let names: Value = list();
	rt.forRange(f, 0, 1, rt.len(f, L), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		key = rt.index(L, i);
		value = null;
		if (lentext(fmt("＃", [L])) <= 10) {
			$0 = "TYPEID_NULL";
		} else {
			$0 = copytext(fmt("＃", [L]), 4, lentext(fmt("＃", [L])) - 6);
		}
		if ($0 == "f" && !isnum(key)) {
			value = rt.index(L, key);
		}
		value ??= "null";
		rt.setAt(names, `#${i} ${key} = ${value}`, i);
	}
	rt.endFor(f, 0);
	if (!index) {
		if ((variable = (yield* g.op(f, "Prompt", [1], [null, null, "Var", "Which var?", names + "(ADD VAR)" + "(CLEAR NULLS)" + "(CLEAR DUPES)" + "(SHUFFLE)"]))) === null) {
			return f.dot;
		}
		if (variable == "(ADD VAR)") {
			yield* this.mod_list_add(L, O, original_name, objectvar);
			return f.dot;
		}
		if (variable == "(CLEAR NULLS)") {
			listclearnulls((L = (yield* L.Copy())));
			if (!(yield* O.vv_edit_var(objectvar, L))) {
				to_chat(this, "Your edit was rejected by the object.");
				return f.dot;
			}
			log_world(`### ListVarEdit by ${this}: ${O.type} ${objectvar}: CLEAR NULLS`);
			log_admin(`${key_name(this)} modified ${original_name}'s ${objectvar}: CLEAR NULLS`);
			message_admins(`${key_name_admin(this)} modified ${original_name}'s list ${objectvar}: CLEAR NULLS`);
			return f.dot;
		}
		if (variable == "(CLEAR DUPES)") {
			L = uniqueList(L);
			if (!(yield* O.vv_edit_var(objectvar, L))) {
				to_chat(this, "Your edit was rejected by the object.");
				return f.dot;
			}
			log_world(`### ListVarEdit by ${this}: ${O.type} ${objectvar}: CLEAR DUPES`);
			log_admin(`${key_name(this)} modified ${original_name}'s ${objectvar}: CLEAR DUPES`);
			message_admins(`${key_name_admin(this)} modified ${original_name}'s list ${objectvar}: CLEAR DUPES`);
			return f.dot;
		}
		if (variable == "(SHUFFLE)") {
			L = shuffle(L);
			if (!(yield* O.vv_edit_var(objectvar, L))) {
				to_chat(this, "Your edit was rejected by the object.");
				return f.dot;
			}
			log_world(`### ListVarEdit by ${this}: ${O.type} ${objectvar}: SHUFFLE`);
			log_admin(`${key_name(this)} modified ${original_name}'s ${objectvar}: SHUFFLE`);
			message_admins(`${key_name_admin(this)} modified ${original_name}'s list ${objectvar}: SHUFFLE`);
			return f.dot;
		}
		index = rt.index(names, variable);
	}
	if (index === null) {
		return f.dot;
	}
	let assoc: Value = 0;
	if ((prompt = (yield* alert(this, "Do you want to edit the key or it's assigned value?", "Associated List", "Key", "Assigned Value", "Cancel"))) == "Cancel") {
		return f.dot;
	}
	if (prompt == "Assigned Value") {
		assoc = 1;
		assoc_key = rt.index(L, index);
	}
	if (assoc) {
		variable_5 = rt.index(L, assoc_key);
	} else {
		variable_5 = rt.index(L, index);
	}
	let _default: Value = this.vv_get_class(variable_5);
	to_chat(this, `Variable appears to be <b>${uppertext(_default)}</b>.`);
	to_chat(this, `Variable contains: ${rt.index(L, index)}`);
	if (_default == "Number") {
		dir_text = "";
		if (this.dir < 0 && this.dir < 16) {
			if (rt.bitAnd(this.dir, 1)) {
				dir_text += "NORTH";
			}
			if (rt.bitAnd(this.dir, 2)) {
				dir_text += "SOUTH";
			}
			if (rt.bitAnd(this.dir, 4)) {
				dir_text += "EAST";
			}
			if (rt.bitAnd(this.dir, 8)) {
				dir_text += "WEST";
			}
		}
		if (dir_text) {
			to_chat(f.usr, `If a direction, direction is: ${dir_text}`);
		}
	}
	if (assoc) {
		original_var = rt.index(L, assoc_key);
	} else {
		original_var = rt.index(L, index);
	}
	if (O) {
		L = (yield* L.Copy());
	}
	if (autodetect_class) {
		if (_default == "Text") {
			_default = "Mutiline Text";
		}
		_class = _default;
	}
	if (!(_class = rt.index((LL = (yield* this.vv_get_value({ default_class: _default, current_value: original_var, restricted_classes: list("Restore to Default"), extra_classes: list("List", "DELETE FROM LIST") }))), "class"))) {
		return f.dot;
	}
	let new_var: Value = rt.at(LL, "value");
	if (_class == "Mutiline Text") {
		_class = "Text";
	}
	if (_class === "List") {
		yield* this.mod_list(variable_5, O, original_name, objectvar);
	} else if (_class === "DELETE FROM LIST") {
		L.Cut(index, index + 1);
		if (O) {
			if (yield* O.vv_edit_var(objectvar, L)) {
				to_chat(this, "Your edit was rejected by the object.");
				return f.dot;
			}
		}
		log_world(`### ListVarEdit by ${this}: ${O.type} ${objectvar}: REMOVED=${html_encode(`${original_var}`)}`);
		log_admin(`${key_name(this)} modified ${original_name}'s ${objectvar}: REMOVED=${original_var}`);
		message_admins(`${key_name_admin(this)} modified ${original_name}'s ${objectvar}: REMOVED=${original_var}`);
		return f.dot;
	} else if (_class === "Text") {
		varsvars = (yield* this.vv_parse_text(O, new_var));
		for (V of each(varsvars)) {
			new_var = replacetext(new_var, `[${V}]`, `${rt.index(O.vars, V)}`);
		}
	}
	if (assoc) {
		rt.setAt(L, assoc_key, new_var);
	} else {
		rt.setAt(L, index, new_var);
	}
	if (O) {
		if ((yield* O.vv_edit_var(objectvar, L)) == 0) {
			to_chat(this, "Your edit was rejected by the object.");
			return f.dot;
		}
	}
	log_world(`### ListVarEdit by ${this}: ${O ? O.type : "/list"} ${objectvar}: ${original_var}=${new_var}`);
	log_admin(`${key_name(this)} modified ${original_name}'s ${objectvar}: ${original_var}=${new_var}`);
	message_admins(`${key_name_admin(this)} modified ${original_name}'s varlist ${objectvar}: ${original_var}=${new_var}`);
	return f.dot;
}, true);

// modifyvariables.dm:508
rt.def("/client/proc/modify_variables", function* modify_variables(f: Frame, O: Value, param_var_name: Value, autodetect_class: Value) {
	let _class: Value = null, variable: Value = null, names: Value = null, V: Value = null, prompt: Value = null, _default: Value = null, dir_text: Value = null, value: Value = null, varsvars: Value = null, V_8: Value = null, msg: Value = null;
	let $e: any;
	autodetect_class ??= 0;
	if (!check_rights(1024)) {
		return f.dot;
	}
	if (param_var_name) {
		if (rt.isIn(f, (!param_var_name ? 1 : 0), O.vars)) {
			to_chat(this, `A variable with this name (${param_var_name}) doesn't exist in this datum (${O})`);
			return f.dot;
		}
		variable = param_var_name;
	} else {
		names = list();
		for (V of each(O.vars)) {
			names += V;
		}
		names = (yield* sortList(names));
		if (!(variable = (yield* g.op(f, "Prompt", [1], [null, null, "Var", "Which var?", names])))) {
			return f.dot;
		}
	}
	if (!O.can_vv_get(variable)) {
		return f.dot;
	}
	let var_value: Value = rt.index(O.vars, variable);
	if (rt.isIn(f, variable, GLOB.VVlocked)) {
		if (!check_rights(32)) {
			return f.dot;
		}
	}
	if (rt.isIn(f, variable, GLOB.VVckey_edit)) {
		if (!check_rights(4128)) {
			return f.dot;
		}
	}
	if (rt.isIn(f, variable, GLOB.VVicon_edit_lock)) {
		if (!check_rights(40)) {
			return f.dot;
		}
	}
	if (rt.isIn(f, variable, GLOB.VVpixelmovement)) {
		if (!check_rights(32)) {
			return f.dot;
		}
		if ((prompt = (yield* alert(this, "Editing this var may irreparably break tile gliding for the rest of the round. THIS CAN'T BE UNDONE", "DANGER", "ABORT ", "Continue", " ABORT"))) != "Continue") {
			return f.dot;
		}
	}
	if ((_default = this.vv_get_class(var_value)) === null) {
		to_chat(this, "Unable to determine variable type.");
	} else {
		to_chat(this, `Variable appears to be <b>${uppertext(_default)}</b>.`);
	}
	to_chat(this, `Variable contains: ${var_value}`);
	if (_default == "Number") {
		dir_text = "";
		if (this.dir < 0 && this.dir < 16) {
			if (rt.bitAnd(this.dir, 1)) {
				dir_text += "NORTH";
			}
			if (rt.bitAnd(this.dir, 2)) {
				dir_text += "SOUTH";
			}
			if (rt.bitAnd(this.dir, 4)) {
				dir_text += "EAST";
			}
			if (rt.bitAnd(this.dir, 8)) {
				dir_text += "WEST";
			}
		}
		if (dir_text) {
			to_chat(this, `If a direction, direction is: ${dir_text}`);
		}
	}
	if (autodetect_class && _default != "NULL") {
		if (_default == "Text") {
			_default = "Mutiline Text";
		}
		_class = _default;
	}
	if (!(_class = rt.index((value = (yield* this.vv_get_value(_class, _default, var_value, { extra_classes: list("List") }))), "class"))) {
		return f.dot;
	}
	let var_new: Value = rt.at(value, "value");
	if (_class == "Mutiline Text") {
		_class = "Text";
	}
	let original_name: Value = `${O}`;
	if (_class === "List") {
		if (!rt.istype(var_value, T("/list"))) {
			yield* this.mod_list(list(), O, original_name, variable);
		}
		yield* this.mod_list(var_value, O, original_name, variable);
		return f.dot;
	} else if (_class === "Restore to Default") {
		var_new = rt.initial(f, O.vars, variable);
	} else if (_class === "Text") {
		varsvars = (yield* this.vv_parse_text(O, var_new));
		for (V_8 of each(varsvars)) {
			var_new = replacetext(var_new, `[${V_8}]`, `${rt.index(O.vars, V_8)}`);
		}
	}
	if ((yield* O.vv_edit_var(variable, var_new)) == 0) {
		to_chat(this, "Your edit was rejected by the object.");
		return f.dot;
	}
	log_world(`### VarEdit by ${this}: ${O.type} ${variable}=${html_encode(`${var_new}`)}`);
	log_admin(`${key_name(this)} modified ${original_name}'s ${variable} to ${var_new}`);
	message_admins((msg = `${key_name_admin(this)} modified ${original_name}'s ${variable} to ${var_new}`));
	admin_ticket_log(O, msg);
	return f.dot;
}, true);
