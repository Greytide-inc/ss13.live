// Based on /tg/station's code/modules/admin/verbs/massmodvar.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// massmodvar.dm:8
rt.def("/client/proc/cmd_mass_modify_object_variables", function* cmd_mass_modify_object_variables(f: Frame, A: Value, var_name: Value) {
	let method: Value = 0;
	if (!check_rights(1024)) {
		return f.dot;
	}
	if (A && A.type) {
		method = (yield* this.vv_subtype_prompt(A.type));
	}
	yield* this.massmodify_variables(A, var_name, method);
	return f.dot;
}, true, { verb: { name: "Mass Edit Variables", category: "Debug", desc: "(target) Edit all instances of a target item's variables" }, argTypes: [{ path: "/atom" }, {  }] });

// massmodvar.dm:18
rt.def("/client/proc/massmodify_variables", function* massmodify_variables(f: Frame, O: Value, var_name: Value, method: Value) {
	let names: Value = null, V: Value = null, _default: Value = null, prompt: Value = null, dir_text: Value = null, _class: Value = null, items: Value = null, thing: Value = null, D: Value = null, varsvars: Value = null, pre_processing: Value = null, unique: Value = null, V_12: Value = null, items_12: Value = null, thing_13: Value = null, D_14: Value = null, V_15: Value = null, many: Value = null, type: Value = null, items_11: Value = null, thing_12: Value = null, D_13: Value = null, count: Value = null;
	let $e: any;
	var_name ??= "";
	method ??= 0;
	if (!check_rights(1024)) {
		return f.dot;
	}
	if (!rt.istype(O, T("/datum"))) {
		return f.dot;
	}
	let variable: Value = "";
	if (!var_name) {
		names = list();
		for (V of each(O.vars)) {
			names += V;
		}
		names = (yield* sortList(names));
		variable = (yield* g.op(f, "Prompt", [1], [null, null, "Var", "Which var?", names]));
	} else {
		variable = var_name;
	}
	if (!variable || !O.can_vv_get(variable)) {
		return f.dot;
	}
	let var_value: Value = rt.index(O.vars, variable);
	if (rt.isIn(f, variable, GLOB.VVckey_edit)) {
		to_chat(this, "It's forbidden to mass-modify ckeys. It'll crash everyone's client you dummy.");
		return f.dot;
	}
	if (rt.isIn(f, variable, GLOB.VVlocked)) {
		if (!check_rights(32)) {
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
	let value: Value = (yield* this.vv_get_value({ default_class: _default }));
	let new_value: Value = rt.at(value, "value");
	if (!(_class = rt.at(value, "class")) || (!new_value ? 1 : 0) === null && _class != "NULL") {
		return f.dot;
	}
	if (_class == "Mutiline Text") {
		_class = "Text";
	}
	if (rt.at(value, "type")) {
		_class = "New Custom Typepath";
	}
	let original_name: Value = `${O}`;
	let rejected: Value = 0;
	let accepted: Value = 0;
	if (_class === "Restore to Default") {
		to_chat(this, "Finding items...");
		items = (yield* get_all_of_type(O.type, method));
		to_chat(this, `Changing ${rt.len(f, items)} items...`);
		for (thing of each(items)) {
			if (!thing) {
				continue;
			}
			if ((yield* (D = thing).vv_edit_var(variable, rt.initial(f, D.vars, variable))) != 0) {
				accepted++;
			} else {
				rejected++;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (_class === "Text") {
		varsvars = (yield* this.vv_parse_text(O, new_value));
		pre_processing = new_value;
		if (varsvars && rt.len(f, varsvars)) {
			if ((unique = (yield* alert(f.usr, "Process vars unique to each instance, or same for all?", "Variable Association", "Unique", "Same"))) == "Unique") {
				unique = 1;
			} else {
				unique = 0;
				for (V_12 of each(varsvars)) {
					new_value = replacetext(new_value, `[${V_12}]`, `${rt.index(O.vars, V_12)}`);
				}
			}
		}
		to_chat(this, "Finding items...");
		items_12 = (yield* get_all_of_type(O.type, method));
		to_chat(this, `Changing ${rt.len(f, items_12)} items...`);
		for (thing_13 of each(items_12)) {
			if (!thing_13) {
				continue;
			}
			D_14 = thing_13;
			if (unique) {
				new_value = pre_processing;
				V_15 = null;
				for (V_15 of each(varsvars)) {
					new_value = replacetext(new_value, `[${V_15}]`, `${rt.index(D_14.vars, V_15)}`);
				}
			}
			if ((yield* D_14.vv_edit_var(variable, new_value)) != 0) {
				accepted++;
			} else {
				rejected++;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (_class === "New Custom Typepath") {
		if ((many = (yield* alert(this, `Create only one ${rt.at(value, "type")} and assign each or a new one for each thing`, "How Many", "One", "Many", "Cancel"))) == "Cancel") {
			return f.dot;
		}
		if (many == "Many") {
			many = 1;
		} else {
			many = 0;
		}
		type = rt.at(value, "type");
		to_chat(this, "Finding items...");
		items_11 = (yield* get_all_of_type(O.type, method));
		to_chat(this, `Changing ${rt.len(f, items_11)} items...`);
		for (thing_12 of each(items_11)) {
			if (!thing_12) {
				continue;
			}
			D_13 = thing_12;
			if (many && !new_value) {
				new_value = (yield* new_(type));
			}
			if ((yield* D_13.vv_edit_var(variable, new_value)) != 0) {
				accepted++;
			} else {
				rejected++;
			}
			new_value = null;
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else {
		to_chat(this, "Finding items...");
		items = (yield* get_all_of_type(O.type, method));
		to_chat(this, `Changing ${rt.len(f, items)} items...`);
		thing = null;
		for (thing of each(items)) {
			if (!thing) {
				continue;
			}
			if ((yield* (D = thing).vv_edit_var(variable, new_value)) != 0) {
				accepted++;
			} else {
				rejected++;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	}
	if (!(count = rejected + accepted)) {
		to_chat(this, "No objects found");
		return f.dot;
	}
	if (!accepted) {
		to_chat(this, "Every object rejected your edit");
		return f.dot;
	}
	if (rejected) {
		to_chat(this, `${rejected} out of ${count} objects rejected your edit`);
	}
	log_world(`### MassVarEdit by ${this}: ${O.type} (A/R ${accepted}/${rejected}) ${variable}=${html_encode(`${rt.index(O.vars, variable)}`)}(${list2params(value)})`);
	log_admin(`${key_name(this)} mass modified ${original_name}'s ${variable} to ${rt.index(O.vars, variable)} (${accepted} objects modified)`);
	message_admins(`${key_name_admin(this)} mass modified ${original_name}'s ${variable} to ${rt.index(O.vars, variable)} (${accepted} objects modified)`);
	return f.dot;
}, true);

// massmodvar.dm:202
rt.def("/proc/get_all_of_type", function* get_all_of_type(f: Frame, _T: Value, subtypes: Value) {
	let typecache: Value = null, thing: Value = null;
	let $e: any;
	subtypes ??= 1;
	rt.setAt((typecache = list()), _T, 1);
	if (subtypes) {
		typecache = typecacheof(typecache);
	}
	f.dot = list();
	if (ispath(_T, T("/mob"))) {
		for (thing of each(GLOB.mob_list, T("/mob"))) {
			if (rt.index(typecache, thing.type)) {
				f.dot += thing;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(_T, T("/obj/machinery/door"))) {
		thing = null;
		for (thing of each(GLOB.airlocks, T("/obj/machinery/door"))) {
			if (rt.index(typecache, thing.type)) {
				f.dot += thing;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(_T, T("/obj/machinery"))) {
		thing = null;
		for (thing of each(GLOB.machines, T("/obj/machinery"))) {
			if (rt.index(typecache, thing.type)) {
				f.dot += thing;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(_T, T("/obj"))) {
		thing = null;
		for (thing of each(rt.world(), T("/obj"))) {
			if (rt.index(typecache, thing.type)) {
				f.dot += thing;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(_T, T("/atom/movable"))) {
		thing = null;
		for (thing of each(rt.world(), T("/atom/movable"))) {
			if (rt.index(typecache, thing.type)) {
				f.dot += thing;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(_T, T("/turf"))) {
		thing = null;
		for (thing of each(rt.world(), T("/turf"))) {
			if (rt.index(typecache, thing.type)) {
				f.dot += thing;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(_T, T("/atom"))) {
		thing = null;
		for (thing of each(rt.world(), T("/atom"))) {
			if (rt.index(typecache, thing.type)) {
				f.dot += thing;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(_T, T("/client"))) {
		thing = null;
		for (thing of each(GLOB.clients, T("/client"))) {
			if (rt.index(typecache, T("/client"))) {
				f.dot += thing;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(_T, T("/datum"))) {
		thing = null;
		rt.op(f, "CreateTypeEnumerator", [0], [T("/datum")], false);
		thing;
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			if (rt.index(typecache, thing.type)) {
				f.dot += thing;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
		rt.endFor(f, 0);
	} else {
		thing = null;
		for (thing of each(rt.world(), T("/datum"))) {
			if (rt.index(typecache, thing.type)) {
				f.dot += thing;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	}
	return f.dot;
}, true);
