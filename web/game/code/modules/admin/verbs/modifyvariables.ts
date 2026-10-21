// From code/modules/admin/verbs/modifyvariables.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalVVlocked  (code/modules/admin/verbs/modifyvariables.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalVVlocked", function InitGlobalVVlocked(f: Frame) {
	rt.setGl("VVlocked", rt.list("vars", "var_edited", "client", "virus", "viruses", "cuffed", "last_eaten", "unlock_content", "force_ending"));
	rt.modSrcVar(f, "gvars_datum_init_order", "VVlocked", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalVVlocked  (code/modules/admin/verbs/modifyvariables.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalVVlocked", function InitGlobalVVlocked(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "VVlocked", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalVVicon_edit_lock  (code/modules/admin/verbs/modifyvariables.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalVVicon_edit_lock", function InitGlobalVVicon_edit_lock(f: Frame) {
	rt.setGl("VVicon_edit_lock", rt.list("icon", "icon_state", "overlays", "underlays", "resize"));
	rt.modSrcVar(f, "gvars_datum_init_order", "VVicon_edit_lock", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalVVicon_edit_lock  (code/modules/admin/verbs/modifyvariables.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalVVicon_edit_lock", function InitGlobalVVicon_edit_lock(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "VVicon_edit_lock", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalVVckey_edit  (code/modules/admin/verbs/modifyvariables.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalVVckey_edit", function InitGlobalVVckey_edit(f: Frame) {
	rt.setGl("VVckey_edit", rt.list("key", "ckey"));
	rt.modSrcVar(f, "gvars_datum_init_order", "VVckey_edit", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalVVckey_edit  (code/modules/admin/verbs/modifyvariables.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalVVckey_edit", function InitGlobalVVckey_edit(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "VVckey_edit", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalVVpixelmovement  (code/modules/admin/verbs/modifyvariables.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalVVpixelmovement", function InitGlobalVVpixelmovement(f: Frame) {
	rt.setGl("VVpixelmovement", rt.list("step_x", "step_y", "bound_height", "bound_width", "bound_x", "bound_y"));
	rt.modSrcVar(f, "gvars_datum_init_order", "VVpixelmovement", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalVVpixelmovement  (code/modules/admin/verbs/modifyvariables.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalVVpixelmovement", function InitGlobalVVpixelmovement(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "VVpixelmovement", add);
	return f.dot;
});

// /client/proc/vv_get_class  (code/modules/admin/verbs/modifyvariables.dm:12)
rt.def("/client/proc/vv_get_class", function vv_get_class(f: Frame, var_value: Value) {
	if (live(var_value) === null) {
		f.dot = "NULL";
	} else {
		if (truthy(rt.call(f, P("/proc/isnum"), null, [live(var_value)]))) {
			f.dot = "Number";
		} else {
			if (truthy(rt.call(f, P("/proc/istext"), null, [live(var_value)]))) {
				if (truthy(rt.call(f, P("/proc/findtext"), null, [live(var_value), "\n"]))) {
					f.dot = "Mutiline Text";
				} else {
					f.dot = "Text";
				}
			} else {
				if (truthy(rt.call(f, P("/proc/isicon"), null, [live(var_value)]))) {
					f.dot = "Icon";
				} else {
					if (truthy(rt.call(f, P("/proc/ismob"), null, [live(var_value)]))) {
						f.dot = "Mob Reference";
					} else {
						if (truthy(rt.call(f, P("/proc/isloc"), null, [live(var_value)]))) {
							f.dot = "Atom Reference";
						} else {
							if (truthy((rt.istype(live(var_value), T("/client")) ? 1 : 0))) {
								f.dot = "Client";
							} else {
								if (truthy((rt.istype(live(var_value), T("/datum")) ? 1 : 0))) {
									f.dot = "Datum Reference";
								} else {
									if (truthy(rt.call(f, P("/proc/ispath"), null, [live(var_value)]))) {
										if (truthy(rt.call(f, P("/proc/ispath"), null, [live(var_value), T("/atom")]))) {
											f.dot = "Atom Typepath";
										} else {
											if (truthy(rt.call(f, P("/proc/ispath"), null, [live(var_value), T("/datum")]))) {
												f.dot = "Datum Typepath";
											} else {
												f.dot = "Custom Typepath";
											}
										}
									} else {
										if (truthy((rt.istype(live(var_value), T("/list")) ? 1 : 0))) {
											f.dot = "List";
										} else {
											if (truthy(rt.call(f, P("/proc/isfile"), null, [live(var_value)]))) {
												f.dot = "File";
											} else {
												f.dot = "NULL";
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
});

// /client/proc/vv_get_value  (code/modules/admin/verbs/modifyvariables.dm:56)  may sleep
rt.def("/client/proc/vv_get_value", function* vv_get_value(f: Frame, _class: Value, default_class: Value, current_value: Value, restricted_classes: Value, extra_classes: Value, classes: Value) {
	let type: Value = null, error: Value = null, subtypes: Value = null, things: Value = null, value: Value = null;
	let $0: any;
	f.vars = () => [_class, default_class, current_value, restricted_classes, extra_classes, classes, type, error, subtypes, things, value, $0];
	f.dot = rt.alist(f, ["class", live(_class), "value", null]);
	if (!truthy(live(_class))) {
		if (!truthy(live(classes))) {
			classes = rt.list("Number", "Text", "Mutiline Text", "Icon", "Atom Reference", "Datum Reference", "Mob Reference", "Client", "Atom Typepath", "Datum Typepath", "Custom Typepath", "File", "New Atom", "New Datum", "New Custom Typepath", "New List", "NULL", "Restore to Default");
		}
		if (((truthy(rt.sv(f, "holder")) && truthy(rt.fv(f, "marked_datum", rt.sv(f, "holder")))) && !truthy((rt.isIn(f, "Marked Datum", live(restricted_classes)) ? 1 : 0)))) {
			classes = rt.modify(live(classes), fmt("＀ (＀)", ["Marked Datum", rt.gv(f, "type", rt.fv(f, "marked_datum", rt.sv(f, "holder")))]), add);
		}
		if (truthy(live(restricted_classes))) {
			(classes = rt.modify(live(classes), live(restricted_classes), subtract));
		}
		if (truthy(live(extra_classes))) {
			classes = rt.modify(live(classes), live(extra_classes), add);
		}
		rt.setAt(live(f.dot), "class", (yield* g.op(f, "Prompt", [1], [live(default_class), "Variable Type", "What kind of data?", live(f.src), live(classes)])));
		if (((truthy(rt.sv(f, "holder")) && truthy(rt.fv(f, "marked_datum", rt.sv(f, "holder")))) && isEqual(rt.at(live(f.dot), "class"), fmt("＀ (＀)", ["Marked Datum", rt.gv(f, "type", rt.fv(f, "marked_datum", rt.sv(f, "holder")))])))) {
			rt.setAt(live(f.dot), "class", "Marked Datum");
		}
	}
	$0 = rt.at(live(f.dot), "class");
	if ($0 === "Text") {
		rt.setAt(live(f.dot), "value", (yield* g.op(f, "Prompt", [3], [null, live(current_value), "Text", "Enter new text:", null])));
		if (rt.at(live(f.dot), "value") === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
	} else if ($0 === "Mutiline Text") {
		rt.setAt(live(f.dot), "value", (yield* g.op(f, "Prompt", [65], [null, live(current_value), "Text", "Enter new text:", null])));
		if (rt.at(live(f.dot), "value") === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
	} else if ($0 === "Number") {
		rt.setAt(live(f.dot), "value", (yield* g.op(f, "Prompt", [33], [null, live(current_value), "Num", "Enter new number:", null])));
		if (rt.at(live(f.dot), "value") === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
	} else if ($0 === "Atom Typepath") {
		rt.setAt(live(f.dot), "value", (yield* g.call(f, P("/proc/pick_closest_path"), null, [0])));
		if (rt.at(live(f.dot), "value") === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
	} else if ($0 === "Datum Typepath") {
		rt.setAt(live(f.dot), "value", (yield* g.call(f, P("/proc/pick_closest_path"), null, [0, (yield* g.call(f, P("/proc/get_fancy_list_of_datum_types"), null, []))])));
		if (rt.at(live(f.dot), "value") === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
	} else if ($0 === "Custom Typepath") {
		type = live(current_value);
		error = "";
		while (true) {
			if (!truthy((type = (yield* g.op(f, "Prompt", [3], [null, live(type), "Type", fmt("Enter type:＀", [live(error)]), null]))))) {
				break;
			}
			type = (yield* g.call(f, P("/proc/text2path"), null, [live(type)]));
			error = "\nType not found, Please try again";
			if (truthy(live(type))) break;
		}
		if (!truthy(live(type))) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
		rt.setAt(live(f.dot), "value", live(type));
	} else if ($0 === "Atom Reference") {
		type = (yield* g.call(f, P("/proc/pick_closest_path"), null, [0]));
		if ((subtypes = (yield* g.srcCall(f, "vv_subtype_prompt", live(type)))) === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
		things = (yield* g.srcCall(f, "vv_reference_list", live(type), live(subtypes)));
		if (!truthy((value = (yield* g.op(f, "Prompt", [1], [null, live(current_value), "Reference", "Select reference:", live(things)]))))) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
		rt.setAt(live(f.dot), "value", rt.index(live(things), live(value)));
	} else if ($0 === "Datum Reference") {
		type = (yield* g.call(f, P("/proc/pick_closest_path"), null, [0, (yield* g.call(f, P("/proc/get_fancy_list_of_datum_types"), null, []))]));
		if ((subtypes = (yield* g.srcCall(f, "vv_subtype_prompt", live(type)))) === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
		things = (yield* g.srcCall(f, "vv_reference_list", live(type), live(subtypes)));
		if (!truthy((value = (yield* g.op(f, "Prompt", [1], [null, live(current_value), "Reference", "Select reference:", live(things)]))))) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
		rt.setAt(live(f.dot), "value", rt.index(live(things), live(value)));
	} else if ($0 === "Mob Reference") {
		type = (yield* g.call(f, P("/proc/pick_closest_path"), null, [0, (yield* g.call(f, P("/proc/make_types_fancy"), null, [(yield* g.call(f, P("/proc/typesof"), null, [T("/mob")]))]))]));
		if ((subtypes = (yield* g.srcCall(f, "vv_subtype_prompt", live(type)))) === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
		things = (yield* g.srcCall(f, "vv_reference_list", live(type), live(subtypes)));
		if (!truthy((value = (yield* g.op(f, "Prompt", [1], [null, live(current_value), "Reference", "Select reference:", live(things)]))))) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
		rt.setAt(live(f.dot), "value", rt.index(live(things), live(value)));
	} else if ($0 === "Client") {
		rt.setAt(live(f.dot), "value", (yield* g.op(f, "Prompt", [1], [null, live(current_value), "Reference", "Select reference:", rt.gl("clients")])));
		if (rt.at(live(f.dot), "value") === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
	} else if ($0 === "File") {
		rt.setAt(live(f.dot), "value", (yield* g.op(f, "Prompt", [513], [null, null, "File", "Pick file:", null])));
		if (rt.at(live(f.dot), "value") === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
	} else if ($0 === "Icon") {
		rt.setAt(live(f.dot), "value", (yield* g.op(f, "Prompt", [4097], [null, null, "Icon", "Pick icon:", null])));
		if (rt.at(live(f.dot), "value") === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
	} else if ($0 === "Marked Datum") {
		rt.setAt(live(f.dot), "value", rt.fv(f, "marked_datum", rt.sv(f, "holder")));
		if (rt.at(live(f.dot), "value") === null) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
	} else if ($0 === "New Atom") {
		if (!truthy((type = (yield* g.call(f, P("/proc/pick_closest_path"), null, [0]))))) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
		rt.setAt(live(f.dot), "type", live(type));
		rt.setAt(live(f.dot), "value", (yield* g.new_(f, live(type), [])));
	} else if ($0 === "New Datum") {
		if (!truthy((type = (yield* g.call(f, P("/proc/pick_closest_path"), null, [0, (yield* g.call(f, P("/proc/get_fancy_list_of_datum_types"), null, []))]))))) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
		rt.setAt(live(f.dot), "type", live(type));
		rt.setAt(live(f.dot), "value", (yield* g.new_(f, live(type), [])));
	} else if ($0 === "New Custom Typepath") {
		type = live(current_value);
		error = "";
		while (true) {
			if (!truthy((type = (yield* g.op(f, "Prompt", [3], [null, live(type), "Type", fmt("Enter type:＀", [live(error)]), null]))))) {
				break;
			}
			type = (yield* g.call(f, P("/proc/text2path"), null, [live(type)]));
			error = "\nType not found, Please try again";
			if (truthy(live(type))) break;
		}
		if (!truthy(live(type))) {
			rt.setAt(live(f.dot), "class", null);
			return live(f.dot);
		}
		rt.setAt(live(f.dot), "type", live(type));
		rt.setAt(live(f.dot), "value", (yield* g.new_(f, live(type), [])));
	} else if ($0 === "New List") {
		rt.setAt(live(f.dot), "value", rt.list());
		rt.setAt(live(f.dot), "type", T("/list"));
	}
	return f.dot;
}, true);

// /client/proc/vv_parse_text  (code/modules/admin/verbs/modifyvariables.dm:248)  may sleep
rt.def("/client/proc/vv_parse_text", function* vv_parse_text(f: Frame, O: Value, new_var: Value) {
	let process_vars: Value = null;
	f.vars = () => [O, new_var, process_vars];
	if (!(truthy(live(O)) && truthy((yield* g.call(f, P("/proc/findtext"), null, [live(new_var), "["]))))) return f.dot;
	if (!isEqual((process_vars = (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "[] detected in string, process as variables?", "Process Variables?", "Yes", "No"]))), "Yes")) return f.dot;
	f.dot = (yield* g.call(f, P("/proc/string2listofvars"), null, [live(new_var), live(O)]));
	return f.dot;
}, true);

// /client/proc/vv_subtype_prompt  (code/modules/admin/verbs/modifyvariables.dm:258)  may sleep
rt.def("/client/proc/vv_subtype_prompt", function* vv_subtype_prompt(f: Frame, type: Value) {
	let subtypes: Value = null;
	let $0: any;
	f.vars = () => [type, subtypes, $0];
	if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(type)])))) {
		return live(f.dot);
	}
	if ((!truthy((subtypes = subtract((yield* g.call(f, P("/proc/typesof"), null, [live(type)])), live(type)))) || !truthy(rt.len(f, live(subtypes))))) {
		return 0;
	}
	if (!(truthy(live(subtypes)) && truthy(rt.len(f, live(subtypes))))) return f.dot;
	$0 = (yield* g.call(f, P("/proc/alert"), null, ["Strict object type detection?", "Type detection", "Strictly this type", "This type and subtypes", "Cancel"]));
	if ($0 === "Strictly this type") {
		return 0;
	} else if ($0 === "This type and subtypes") {
		return 1;
	} else {
		return live(f.dot);
	}
	return f.dot;
}, true);

// /client/proc/vv_reference_list  (code/modules/admin/verbs/modifyvariables.dm:273)  may sleep
rt.def("/client/proc/vv_reference_list", function* vv_reference_list(f: Frame, type: Value, subtypes: Value) {
	let types: Value = null, fancytypes: Value = null, fancytype: Value = null, things: Value = null, i: Value = null, thing: Value = null, D: Value = null, fancytype_6: Value = null, shorttype: Value = null;
	let $e: any;
	f.vars = () => [type, subtypes, types, fancytypes, fancytype, things, i, thing, D, fancytype_6, shorttype, $e];
	f.dot = rt.list();
	types = rt.list(live(type));
	if (truthy(live(subtypes))) {
		types = (yield* g.call(f, P("/proc/typesof"), null, [live(type)]));
	}
	fancytypes = (yield* g.call(f, P("/proc/make_types_fancy"), null, [live(types)]));
	fancytype = null;
	rt.forList(f, 0, live(fancytypes));
	while (($e = rt.next(f, 0)) !== undefined) {
		fancytype = $e;
		rt.setAt(live(types), rt.index(live(fancytypes), live(fancytype)), live(fancytype));
	}
	rt.endFor(f, 0);
	things = (yield* g.call(f, P("/proc/get_all_of_type"), null, [live(type), live(subtypes)]));
	i = 0;
	thing = null;
	rt.forList(f, 0, live(things));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		D = live(thing);
		i = rt.inc(live(i), 1);
		if (truthy((yield* g.call(f, P("/proc/findtext"), null, [(fancytype_6 = rt.index(live(types), rt.fv(f, "type", live(D)))), rt.index(live(types), live(type))])))) {
			fancytype_6 = (yield* g.call(f, P("/proc/copytext"), null, [live(fancytype_6), add((yield* g.call(f, P("/proc/lentext"), null, [rt.index(live(types), live(type))])), 1)]));
		}
		if (rt.gt((yield* g.call(f, P("/proc/lentext"), null, [(shorttype = (yield* g.call(f, P("/proc/copytext"), null, [fmt("＀", [rt.fv(f, "type", live(D))]), add((yield* g.call(f, P("/proc/lentext"), null, [fmt("＀", [live(type)])])), 1)])))])), (yield* g.call(f, P("/proc/lentext"), null, [live(fancytype_6)])))) {
			shorttype = live(fancytype_6);
		}
		if (!truthy((yield* g.call(f, P("/proc/lentext"), null, [live(shorttype)])))) {
			shorttype = "/";
		}
		rt.setAt(live(f.dot), fmt("＀(＀)＃#＀", [live(D), live(shorttype), live(D), live(i)]), live(D));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /client/proc/mod_list_add_ass  (code/modules/admin/verbs/modifyvariables.dm:306)  may sleep
rt.def("/client/proc/mod_list_add_ass", function* mod_list_add_ass(f: Frame, O: Value) {
	let L: Value = null, _class: Value = null, var_value: Value = null, varsvars: Value = null, V: Value = null;
	let $e: any;
	f.vars = () => [O, L, _class, var_value, varsvars, V, $e];
	L = (yield* g.callSrc(f, "vv_get_value", ["restricted_classes", rt.list("Restore to Default")], rt.Args.Named));
	if (!truthy((_class = rt.at(live(L), "class")))) {
		return live(f.dot);
	}
	var_value = rt.at(live(L), "value");
	if ((isEqual(live(_class), "Text") || isEqual(live(_class), "Mutiline Text"))) {
		varsvars = (yield* g.srcCall(f, "vv_parse_text", live(O), live(var_value)));
		V = null;
		rt.forList(f, 0, live(varsvars));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			var_value = (yield* g.call(f, P("/proc/replacetext"), null, [live(var_value), fmt("[＀]", [live(V)]), fmt("＀", [rt.index(rt.fv(f, "vars", live(O)), live(V))])]));
		}
		rt.endFor(f, 0);
	}
	return live(var_value);
}, true);

// /client/proc/mod_list_add  (code/modules/admin/verbs/modifyvariables.dm:321)  may sleep
rt.def("/client/proc/mod_list_add", function* mod_list_add(f: Frame, L: Value, O: Value, original_name: Value, objectvar: Value) {
	let LL: Value = null, _class: Value = null, var_value: Value = null, varsvars: Value = null, V: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [L, O, original_name, objectvar, LL, _class, var_value, varsvars, V, $0, $1, $e];
	LL = (yield* g.callSrc(f, "vv_get_value", ["restricted_classes", rt.list("Restore to Default")], rt.Args.Named));
	if (!truthy((_class = rt.at(live(LL), "class")))) {
		return live(f.dot);
	}
	var_value = rt.at(live(LL), "value");
	if ((isEqual(live(_class), "Text") || isEqual(live(_class), "Mutiline Text"))) {
		varsvars = (yield* g.srcCall(f, "vv_parse_text", live(O), live(var_value)));
		V = null;
		rt.forList(f, 0, live(varsvars));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			var_value = (yield* g.call(f, P("/proc/replacetext"), null, [live(var_value), fmt("[＀]", [live(V)]), fmt("＀", [rt.index(rt.fv(f, "vars", live(O)), live(V))])]));
		}
		rt.endFor(f, 0);
	}
	if (truthy(live(O))) {
		L = (yield* g.callName(f, live(L), "Copy", []));
	}
	L = rt.modify(live(L), live(var_value), add);
	$0 = (yield* g.call(f, P("/proc/alert"), null, ["Would you like to associate a value with the list entry?", null, "Yes", "No"]));
	if ($0 === "Yes") {
		rt.setAt(live(L), live(var_value), (yield* g.srcCall(f, "mod_list_add_ass", live(O))));
	}
	if (truthy(live(O))) {
		if (isEqual((yield* g.callName(f, live(O), "vv_edit_var", [live(objectvar), live(L)])), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Your edit was rejected by the object."]);
			return live(f.dot);
		}
	}
	$0 = live(f.src);
	if (truthy(live(O))) {
		$1 = rt.fv(f, "type", live(O));
	} else {
		$1 = "/list";
	}
	yield* g.call(f, P("/proc/log_world"), null, [fmt("### ListVarEdit by ＀: ＀ ＀: ADDED=＀", [$0, $1, live(objectvar), live(var_value)])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified ＀'s ＀: ADDED=＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(original_name), live(objectvar), live(var_value)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ modified ＀'s ＀: ADDED=＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(original_name), live(objectvar), live(var_value)])]);
	return f.dot;
}, true);

// /client/proc/mod_list  (code/modules/admin/verbs/modifyvariables.dm:349)  may sleep
rt.def("/client/proc/mod_list", function* mod_list(f: Frame, L: Value, O: Value, original_name: Value, objectvar: Value, index: Value, autodetect_class: Value) {
	let confirm: Value = null, names: Value = null, i: Value = null, key: Value = null, value: Value = null, variable: Value = null, assoc_key: Value = null, assoc: Value = null, prompt: Value = null, _default: Value = null, variable_5: Value = null, dir_text: Value = null, original_var: Value = null, _class: Value = null, LL: Value = null, new_var: Value = null, varsvars: Value = null, V: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [L, O, original_name, objectvar, index, autodetect_class, confirm, names, i, key, value, variable, assoc_key, assoc, prompt, _default, variable_5, dir_text, original_var, _class, LL, new_var, varsvars, V, $0, $1, $e];
	if (live(autodetect_class) === null) {
		autodetect_class = 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [1024])))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(L), T("/list")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Not a List."]);
		return live(f.dot);
	}
	if (rt.gt(rt.len(f, live(L)), 1000)) {
		if (!isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "The list you're trying to edit is very long, continuing may crash the server.", "Warning", "Continue", "Abort"]))), "Continue")) {
			return live(f.dot);
		}
	}
	names = rt.list();
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, live(L)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		key = rt.index(live(L), live(i));
		value = null;
		if (rt.le((yield* g.call(f, P("/proc/lentext"), null, [fmt("＃", [live(L)])])), 10)) {
			$0 = "TYPEID_NULL";
		} else {
			$0 = (yield* g.call(f, P("/proc/copytext"), null, [fmt("＃", [live(L)]), 4, subtract((yield* g.call(f, P("/proc/lentext"), null, [fmt("＃", [live(L)])])), 6)]));
		}
		if ((isEqual($0, "f") && !truthy((yield* g.call(f, P("/proc/isnum"), null, [live(key)]))))) {
			value = rt.index(live(L), live(key));
		}
		if (live(value) === null) {
			value = "null";
		}
		rt.setAt(live(names), fmt("#＀ ＀ = ＀", [live(i), live(key), live(value)]), live(i));
	}
	rt.endFor(f, 0);
	if (!truthy(live(index))) {
		if ((variable = (yield* g.op(f, "Prompt", [1], [null, null, "Var", "Which var?", add(add(add(add(live(names), "(ADD VAR)"), "(CLEAR NULLS)"), "(CLEAR DUPES)"), "(SHUFFLE)")]))) === null) {
			return live(f.dot);
		}
		if (isEqual(live(variable), "(ADD VAR)")) {
			yield* g.srcCall(f, "mod_list_add", live(L), live(O), live(original_name), live(objectvar));
			return live(f.dot);
		}
		if (isEqual(live(variable), "(CLEAR NULLS)")) {
			yield* g.call(f, P("/proc/listclearnulls"), null, [(L = (yield* g.callName(f, live(L), "Copy", [])))]);
			if (!truthy((yield* g.callName(f, live(O), "vv_edit_var", [live(objectvar), live(L)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Your edit was rejected by the object."]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/log_world"), null, [fmt("### ListVarEdit by ＀: ＀ ＀: CLEAR NULLS", [live(f.src), rt.fv(f, "type", live(O)), live(objectvar)])]);
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified ＀'s ＀: CLEAR NULLS", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(original_name), live(objectvar)])]);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ modified ＀'s list ＀: CLEAR NULLS", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(original_name), live(objectvar)])]);
			return live(f.dot);
		}
		if (isEqual(live(variable), "(CLEAR DUPES)")) {
			L = (yield* g.call(f, P("/proc/uniqueList"), null, [live(L)]));
			if (!truthy((yield* g.callName(f, live(O), "vv_edit_var", [live(objectvar), live(L)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Your edit was rejected by the object."]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/log_world"), null, [fmt("### ListVarEdit by ＀: ＀ ＀: CLEAR DUPES", [live(f.src), rt.fv(f, "type", live(O)), live(objectvar)])]);
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified ＀'s ＀: CLEAR DUPES", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(original_name), live(objectvar)])]);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ modified ＀'s list ＀: CLEAR DUPES", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(original_name), live(objectvar)])]);
			return live(f.dot);
		}
		if (isEqual(live(variable), "(SHUFFLE)")) {
			L = (yield* g.call(f, P("/proc/shuffle"), null, [live(L)]));
			if (!truthy((yield* g.callName(f, live(O), "vv_edit_var", [live(objectvar), live(L)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Your edit was rejected by the object."]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/log_world"), null, [fmt("### ListVarEdit by ＀: ＀ ＀: SHUFFLE", [live(f.src), rt.fv(f, "type", live(O)), live(objectvar)])]);
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified ＀'s ＀: SHUFFLE", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(original_name), live(objectvar)])]);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ modified ＀'s list ＀: SHUFFLE", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(original_name), live(objectvar)])]);
			return live(f.dot);
		}
		index = rt.index(live(names), live(variable));
	}
	assoc_key = null;
	if (live(index) === null) {
		return live(f.dot);
	}
	assoc = 0;
	if (isEqual((prompt = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Do you want to edit the key or it's assigned value?", "Associated List", "Key", "Assigned Value", "Cancel"]))), "Cancel")) {
		return live(f.dot);
	}
	if (isEqual(live(prompt), "Assigned Value")) {
		assoc = 1;
		assoc_key = rt.index(live(L), live(index));
	}
	_default = null;
	variable_5 = null;
	if (truthy(live(assoc))) {
		variable_5 = rt.index(live(L), live(assoc_key));
	} else {
		variable_5 = rt.index(live(L), live(index));
	}
	_default = (yield* g.srcCall(f, "vv_get_class", live(variable_5)));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Variable appears to be <b>＀</b>.", [(yield* g.call(f, P("/proc/uppertext"), null, [live(_default)]))])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Variable contains: ＀", [rt.index(live(L), live(index))])]);
	if (isEqual(live(_default), "Number")) {
		dir_text = "";
		if ((rt.lt(rt.sv(f, "dir"), 0) && rt.lt(rt.sv(f, "dir"), 16))) {
			if (truthy(rt.bitAnd(rt.sv(f, "dir"), 1))) {
				dir_text = rt.modify(live(dir_text), "NORTH", add);
			}
			if (truthy(rt.bitAnd(rt.sv(f, "dir"), 2))) {
				dir_text = rt.modify(live(dir_text), "SOUTH", add);
			}
			if (truthy(rt.bitAnd(rt.sv(f, "dir"), 4))) {
				dir_text = rt.modify(live(dir_text), "EAST", add);
			}
			if (truthy(rt.bitAnd(rt.sv(f, "dir"), 8))) {
				dir_text = rt.modify(live(dir_text), "WEST", add);
			}
		}
		if (truthy(live(dir_text))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("If a direction, direction is: ＀", [live(dir_text)])]);
		}
	}
	original_var = null;
	if (truthy(live(assoc))) {
		original_var = rt.index(live(L), live(assoc_key));
	} else {
		original_var = rt.index(live(L), live(index));
	}
	if (truthy(live(O))) {
		L = (yield* g.callName(f, live(L), "Copy", []));
	}
	_class = null;
	if (truthy(live(autodetect_class))) {
		if (isEqual(live(_default), "Text")) {
			_default = "Mutiline Text";
		}
		_class = live(_default);
	}
	if (!truthy((_class = rt.index((LL = (yield* g.callSrc(f, "vv_get_value", ["default_class", live(_default), "current_value", live(original_var), "restricted_classes", rt.list("Restore to Default"), "extra_classes", rt.list("List", "DELETE FROM LIST")], rt.Args.Named))), "class")))) {
		return live(f.dot);
	}
	new_var = rt.at(live(LL), "value");
	if (isEqual(live(_class), "Mutiline Text")) {
		_class = "Text";
	}
	$0 = live(_class);
	if ($0 === "List") {
		yield* g.srcCall(f, "mod_list", live(variable_5), live(O), live(original_name), live(objectvar));
	} else if ($0 === "DELETE FROM LIST") {
		yield* g.callName(f, live(L), "Cut", [live(index), add(live(index), 1)]);
		if (truthy(live(O))) {
			if (truthy((yield* g.callName(f, live(O), "vv_edit_var", [live(objectvar), live(L)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Your edit was rejected by the object."]);
				return live(f.dot);
			}
		}
		yield* g.call(f, P("/proc/log_world"), null, [fmt("### ListVarEdit by ＀: ＀ ＀: REMOVED=＀", [live(f.src), rt.fv(f, "type", live(O)), live(objectvar), (yield* g.call(f, P("/proc/html_encode"), null, [fmt("＀", [live(original_var)])]))])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified ＀'s ＀: REMOVED=＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(original_name), live(objectvar), live(original_var)])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ modified ＀'s ＀: REMOVED=＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(original_name), live(objectvar), live(original_var)])]);
		return live(f.dot);
	} else if ($0 === "Text") {
		varsvars = (yield* g.srcCall(f, "vv_parse_text", live(O), live(new_var)));
		V = null;
		rt.forList(f, 0, live(varsvars));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			new_var = (yield* g.call(f, P("/proc/replacetext"), null, [live(new_var), fmt("[＀]", [live(V)]), fmt("＀", [rt.index(rt.fv(f, "vars", live(O)), live(V))])]));
		}
		rt.endFor(f, 0);
	}
	if (truthy(live(assoc))) {
		rt.setAt(live(L), live(assoc_key), live(new_var));
	} else {
		rt.setAt(live(L), live(index), live(new_var));
	}
	if (truthy(live(O))) {
		if (isEqual((yield* g.callName(f, live(O), "vv_edit_var", [live(objectvar), live(L)])), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Your edit was rejected by the object."]);
			return live(f.dot);
		}
	}
	$0 = live(f.src);
	if (truthy(live(O))) {
		$1 = rt.fv(f, "type", live(O));
	} else {
		$1 = "/list";
	}
	yield* g.call(f, P("/proc/log_world"), null, [fmt("### ListVarEdit by ＀: ＀ ＀: ＀=＀", [$0, $1, live(objectvar), live(original_var), live(new_var)])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified ＀'s ＀: ＀=＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(original_name), live(objectvar), live(original_var), live(new_var)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ modified ＀'s varlist ＀: ＀=＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(original_name), live(objectvar), live(original_var), live(new_var)])]);
	return f.dot;
}, true);

// /client/proc/modify_variables  (code/modules/admin/verbs/modifyvariables.dm:508)  may sleep
rt.def("/client/proc/modify_variables", function* modify_variables(f: Frame, O: Value, param_var_name: Value, autodetect_class: Value) {
	let _class: Value = null, variable: Value = null, var_value: Value = null, names: Value = null, V: Value = null, prompt: Value = null, _default: Value = null, dir_text: Value = null, value: Value = null, var_new: Value = null, original_name: Value = null, varsvars: Value = null, V_8: Value = null, msg: Value = null;
	let $0: any, $e: any;
	f.vars = () => [O, param_var_name, autodetect_class, _class, variable, var_value, names, V, prompt, _default, dir_text, value, var_new, original_name, varsvars, V_8, msg, $0, $e];
	if (live(param_var_name) === null) {
		param_var_name = null;
	}
	if (live(autodetect_class) === null) {
		autodetect_class = 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [1024])))) {
		return live(f.dot);
	}
	_class = null;
	variable = null;
	var_value = null;
	if (truthy(live(param_var_name))) {
		if (truthy((rt.isIn(f, (!truthy(live(param_var_name)) ? 1 : 0), rt.fv(f, "vars", live(O))) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("A variable with this name (＀) doesn't exist in this datum (＀)", [live(param_var_name), live(O)])]);
			return live(f.dot);
		}
		variable = live(param_var_name);
	} else {
		names = rt.list();
		V = null;
		rt.forList(f, 0, rt.fv(f, "vars", live(O)));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			names = rt.modify(live(names), live(V), add);
		}
		rt.endFor(f, 0);
		names = (yield* g.call(f, P("/proc/sortList"), null, [live(names)]));
		if (!truthy((variable = (yield* g.op(f, "Prompt", [1], [null, null, "Var", "Which var?", live(names)]))))) {
			return live(f.dot);
		}
	}
	if (!truthy((yield* g.callName(f, live(O), "can_vv_get", [live(variable)])))) {
		return live(f.dot);
	}
	var_value = rt.index(rt.fv(f, "vars", live(O)), live(variable));
	if (truthy((rt.isIn(f, live(variable), rt.gl("VVlocked")) ? 1 : 0))) {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32])))) {
			return live(f.dot);
		}
	}
	if (truthy((rt.isIn(f, live(variable), rt.gl("VVckey_edit")) ? 1 : 0))) {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4128])))) {
			return live(f.dot);
		}
	}
	if (truthy((rt.isIn(f, live(variable), rt.gl("VVicon_edit_lock")) ? 1 : 0))) {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [40])))) {
			return live(f.dot);
		}
	}
	if (truthy((rt.isIn(f, live(variable), rt.gl("VVpixelmovement")) ? 1 : 0))) {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32])))) {
			return live(f.dot);
		}
		if (!isEqual((prompt = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Editing this var may irreparably break tile gliding for the rest of the round. THIS CAN'T BE UNDONE", "DANGER", "ABORT ", "Continue", " ABORT"]))), "Continue")) {
			return live(f.dot);
		}
	}
	if ((_default = (yield* g.srcCall(f, "vv_get_class", live(var_value)))) === null) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Unable to determine variable type."]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Variable appears to be <b>＀</b>.", [(yield* g.call(f, P("/proc/uppertext"), null, [live(_default)]))])]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Variable contains: ＀", [live(var_value)])]);
	if (isEqual(live(_default), "Number")) {
		dir_text = "";
		if ((rt.lt(rt.sv(f, "dir"), 0) && rt.lt(rt.sv(f, "dir"), 16))) {
			if (truthy(rt.bitAnd(rt.sv(f, "dir"), 1))) {
				dir_text = rt.modify(live(dir_text), "NORTH", add);
			}
			if (truthy(rt.bitAnd(rt.sv(f, "dir"), 2))) {
				dir_text = rt.modify(live(dir_text), "SOUTH", add);
			}
			if (truthy(rt.bitAnd(rt.sv(f, "dir"), 4))) {
				dir_text = rt.modify(live(dir_text), "EAST", add);
			}
			if (truthy(rt.bitAnd(rt.sv(f, "dir"), 8))) {
				dir_text = rt.modify(live(dir_text), "WEST", add);
			}
		}
		if (truthy(live(dir_text))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("If a direction, direction is: ＀", [live(dir_text)])]);
		}
	}
	if ((truthy(live(autodetect_class)) && !isEqual(live(_default), "NULL"))) {
		if (isEqual(live(_default), "Text")) {
			_default = "Mutiline Text";
		}
		_class = live(_default);
	}
	if (!truthy((_class = rt.index((value = (yield* g.callSrc(f, "vv_get_value", [null, live(_class), null, live(_default), null, live(var_value), "extra_classes", rt.list("List")], rt.Args.Named))), "class")))) {
		return live(f.dot);
	}
	var_new = rt.at(live(value), "value");
	if (isEqual(live(_class), "Mutiline Text")) {
		_class = "Text";
	}
	original_name = fmt("＀", [live(O)]);
	$0 = live(_class);
	if ($0 === "List") {
		if (!truthy((rt.istype(live(var_value), T("/list")) ? 1 : 0))) {
			yield* g.srcCall(f, "mod_list", rt.list(), live(O), live(original_name), live(variable));
		}
		yield* g.srcCall(f, "mod_list", live(var_value), live(O), live(original_name), live(variable));
		return live(f.dot);
	} else if ($0 === "Restore to Default") {
		var_new = rt.initial(f, rt.fv(f, "vars", live(O)), live(variable));
	} else if ($0 === "Text") {
		varsvars = (yield* g.srcCall(f, "vv_parse_text", live(O), live(var_new)));
		V_8 = null;
		rt.forList(f, 0, live(varsvars));
		while (($e = rt.next(f, 0)) !== undefined) {
			V_8 = $e;
			var_new = (yield* g.call(f, P("/proc/replacetext"), null, [live(var_new), fmt("[＀]", [live(V_8)]), fmt("＀", [rt.index(rt.fv(f, "vars", live(O)), live(V_8))])]));
		}
		rt.endFor(f, 0);
	}
	if (isEqual((yield* g.callName(f, live(O), "vv_edit_var", [live(variable), live(var_new)])), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Your edit was rejected by the object."]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_world"), null, [fmt("### VarEdit by ＀: ＀ ＀=＀", [live(f.src), rt.fv(f, "type", live(O)), live(variable), (yield* g.call(f, P("/proc/html_encode"), null, [fmt("＀", [live(var_new)])]))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified ＀'s ＀ to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(original_name), live(variable), live(var_new)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("＀ modified ＀'s ＀ to ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(original_name), live(variable), live(var_new)]))]);
	yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(O), live(msg)]);
	return f.dot;
}, true);
