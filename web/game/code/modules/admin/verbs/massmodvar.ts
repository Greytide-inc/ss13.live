// From code/modules/admin/verbs/massmodvar.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/cmd_mass_modify_object_variables  (code/modules/admin/verbs/massmodvar.dm:8)  may sleep
rt.def("/client/proc/cmd_mass_modify_object_variables", function* cmd_mass_modify_object_variables(f: Frame, A: Value, var_name: Value) {
	let method: Value = null;
	f.vars = () => [A, var_name, method];
	method = 0;
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [1024])))) {
		return live(f.dot);
	}
	if ((truthy(live(A)) && truthy(rt.fv(f, "type", live(A))))) {
		method = (yield* g.srcCall(f, "vv_subtype_prompt", rt.fv(f, "type", live(A))));
	}
	yield* g.callName(f, live(f.src), "massmodify_variables", [live(A), live(var_name), live(method)]);
	return f.dot;
}, true, { verb: { name: "Mass Edit Variables", category: "Debug", desc: "(target) Edit all instances of a target item's variables" }, argTypes: [{ path: "/atom" }, {  }] });

// /client/proc/massmodify_variables  (code/modules/admin/verbs/massmodvar.dm:18)  may sleep
rt.def("/client/proc/massmodify_variables", function* massmodify_variables(f: Frame, O: Value, var_name: Value, method: Value) {
	let variable: Value = null, names: Value = null, V: Value = null, _default: Value = null, var_value: Value = null, prompt: Value = null, dir_text: Value = null, value: Value = null, new_value: Value = null, _class: Value = null, original_name: Value = null, rejected: Value = null, accepted: Value = null, items: Value = null, thing: Value = null, D: Value = null, varsvars: Value = null, pre_processing: Value = null, unique: Value = null, V_12: Value = null, items_12: Value = null, thing_13: Value = null, D_14: Value = null, V_15: Value = null, many: Value = null, type: Value = null, items_11: Value = null, thing_12: Value = null, D_13: Value = null, count: Value = null;
	let $0: any, $e: any;
	f.vars = () => [O, var_name, method, variable, names, V, _default, var_value, prompt, dir_text, value, new_value, _class, original_name, rejected, accepted, items, thing, D, varsvars, pre_processing, unique, V_12, items_12, thing_13, D_14, V_15, many, type, items_11, thing_12, D_13, count, $0, $e];
	if (live(var_name) === null) {
		var_name = "";
	}
	if (live(method) === null) {
		method = 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [1024])))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(O), T("/datum")) ? 1 : 0))) {
		return live(f.dot);
	}
	variable = "";
	if (!truthy(live(var_name))) {
		names = rt.list();
		V = null;
		rt.forList(f, 0, rt.fv(f, "vars", live(O)));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			names = rt.modify(live(names), live(V), add);
		}
		rt.endFor(f, 0);
		names = (yield* g.call(f, P("/proc/sortList"), null, [live(names)]));
		variable = (yield* g.op(f, "Prompt", [1], [null, null, "Var", "Which var?", live(names)]));
	} else {
		variable = live(var_name);
	}
	if ((!truthy(live(variable)) || !truthy((yield* g.callName(f, live(O), "can_vv_get", [live(variable)]))))) {
		return live(f.dot);
	}
	_default = null;
	var_value = rt.index(rt.fv(f, "vars", live(O)), live(variable));
	if (truthy((rt.isIn(f, live(variable), rt.gl("VVckey_edit")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "It's forbidden to mass-modify ckeys. It'll crash everyone's client you dummy."]);
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, live(variable), rt.gl("VVlocked")) ? 1 : 0))) {
		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32])))) {
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
	value = (yield* g.callSrc(f, "vv_get_value", ["default_class", live(_default)], rt.Args.Named));
	new_value = rt.at(live(value), "value");
	if ((!truthy((_class = rt.at(live(value), "class"))) || ((!truthy(live(new_value)) ? 1 : 0) === null && !isEqual(live(_class), "NULL")))) {
		return live(f.dot);
	}
	if (isEqual(live(_class), "Mutiline Text")) {
		_class = "Text";
	}
	if (truthy(rt.at(live(value), "type"))) {
		_class = "New Custom Typepath";
	}
	original_name = fmt("＀", [live(O)]);
	rejected = 0;
	accepted = 0;
	$0 = live(_class);
	if ($0 === "Restore to Default") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Finding items..."]);
		items = (yield* g.call(f, P("/proc/get_all_of_type"), null, [rt.fv(f, "type", live(O)), live(method)]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Changing ＀ items...", [rt.len(f, live(items))])]);
		thing = null;
		rt.forList(f, 0, live(items));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			if (!truthy(live(thing))) {
				continue;
			}
			if (!isEqual((yield* g.callName(f, (D = live(thing)), "vv_edit_var", [live(variable), rt.initial(f, rt.fv(f, "vars", live(D)), live(variable))])), 0)) {
				accepted = rt.inc(live(accepted), 1);
			} else {
				rejected = rt.inc(live(rejected), 1);
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	} else if ($0 === "Text") {
		varsvars = (yield* g.srcCall(f, "vv_parse_text", live(O), live(new_value)));
		pre_processing = live(new_value);
		unique = null;
		if ((truthy(live(varsvars)) && truthy(rt.len(f, live(varsvars))))) {
			if (isEqual((unique = (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Process vars unique to each instance, or same for all?", "Variable Association", "Unique", "Same"]))), "Unique")) {
				unique = 1;
			} else {
				unique = 0;
				V_12 = null;
				rt.forList(f, 0, live(varsvars));
				while (($e = rt.next(f, 0)) !== undefined) {
					V_12 = $e;
					new_value = (yield* g.call(f, P("/proc/replacetext"), null, [live(new_value), fmt("[＀]", [live(V_12)]), fmt("＀", [rt.index(rt.fv(f, "vars", live(O)), live(V_12))])]));
				}
				rt.endFor(f, 0);
			}
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Finding items..."]);
		items_12 = (yield* g.call(f, P("/proc/get_all_of_type"), null, [rt.fv(f, "type", live(O)), live(method)]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Changing ＀ items...", [rt.len(f, live(items_12))])]);
		thing_13 = null;
		rt.forList(f, 0, live(items_12));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing_13 = $e;
			if (!truthy(live(thing_13))) {
				continue;
			}
			D_14 = live(thing_13);
			if (truthy(live(unique))) {
				new_value = live(pre_processing);
				V_15 = null;
				rt.forList(f, 1, live(varsvars));
				while (($e = rt.next(f, 1)) !== undefined) {
					V_15 = $e;
					new_value = (yield* g.call(f, P("/proc/replacetext"), null, [live(new_value), fmt("[＀]", [live(V_15)]), fmt("＀", [rt.index(rt.fv(f, "vars", live(D_14)), live(V_15))])]));
				}
				rt.endFor(f, 1);
			}
			if (!isEqual((yield* g.callName(f, live(D_14), "vv_edit_var", [live(variable), live(new_value)])), 0)) {
				accepted = rt.inc(live(accepted), 1);
			} else {
				rejected = rt.inc(live(rejected), 1);
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	} else if ($0 === "New Custom Typepath") {
		if (isEqual((many = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), fmt("Create only one ＀ and assign each or a new one for each thing", [rt.at(live(value), "type")]), "How Many", "One", "Many", "Cancel"]))), "Cancel")) {
			return live(f.dot);
		}
		if (isEqual(live(many), "Many")) {
			many = 1;
		} else {
			many = 0;
		}
		type = rt.at(live(value), "type");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Finding items..."]);
		items_11 = (yield* g.call(f, P("/proc/get_all_of_type"), null, [rt.fv(f, "type", live(O)), live(method)]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Changing ＀ items...", [rt.len(f, live(items_11))])]);
		thing_12 = null;
		rt.forList(f, 0, live(items_11));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing_12 = $e;
			if (!truthy(live(thing_12))) {
				continue;
			}
			D_13 = live(thing_12);
			if ((truthy(live(many)) && !truthy(live(new_value)))) {
				new_value = (yield* g.new_(f, live(type), []));
			}
			if (!isEqual((yield* g.callName(f, live(D_13), "vv_edit_var", [live(variable), live(new_value)])), 0)) {
				accepted = rt.inc(live(accepted), 1);
			} else {
				rejected = rt.inc(live(rejected), 1);
			}
			new_value = null;
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Finding items..."]);
		items = (yield* g.call(f, P("/proc/get_all_of_type"), null, [rt.fv(f, "type", live(O)), live(method)]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Changing ＀ items...", [rt.len(f, live(items))])]);
		thing = null;
		rt.forList(f, 0, live(items));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			if (!truthy(live(thing))) {
				continue;
			}
			if (!isEqual((yield* g.callName(f, (D = live(thing)), "vv_edit_var", [live(variable), live(new_value)])), 0)) {
				accepted = rt.inc(live(accepted), 1);
			} else {
				rejected = rt.inc(live(rejected), 1);
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy((count = add(live(rejected), live(accepted))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "No objects found"]);
		return live(f.dot);
	}
	if (!truthy(live(accepted))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Every object rejected your edit"]);
		return live(f.dot);
	}
	if (truthy(live(rejected))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("＀ out of ＀ objects rejected your edit", [live(rejected), live(count)])]);
	}
	yield* g.call(f, P("/proc/log_world"), null, [fmt("### MassVarEdit by ＀: ＀ (A/R ＀/＀) ＀=＀(＀)", [live(f.src), rt.fv(f, "type", live(O)), live(accepted), live(rejected), live(variable), (yield* g.call(f, P("/proc/html_encode"), null, [fmt("＀", [rt.index(rt.fv(f, "vars", live(O)), live(variable))])])), (yield* g.call(f, P("/proc/list2params"), null, [live(value)]))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ mass modified ＀'s ＀ to ＀ (＀ objects modified)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(original_name), live(variable), rt.index(rt.fv(f, "vars", live(O)), live(variable)), live(accepted)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ mass modified ＀'s ＀ to ＀ (＀ objects modified)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(original_name), live(variable), rt.index(rt.fv(f, "vars", live(O)), live(variable)), live(accepted)])]);
	return f.dot;
}, true);

// /proc/get_all_of_type  (code/modules/admin/verbs/massmodvar.dm:202)  may sleep
rt.def("/proc/get_all_of_type", function* get_all_of_type(f: Frame, _T: Value, subtypes: Value) {
	let typecache: Value = null, thing: Value = null;
	let $e: any;
	f.vars = () => [_T, subtypes, typecache, thing, $e];
	if (live(subtypes) === null) {
		subtypes = 1;
	}
	rt.setAt((typecache = rt.list()), live(_T), 1);
	if (truthy(live(subtypes))) {
		typecache = (yield* g.call(f, P("/proc/typecacheof"), null, [live(typecache)]));
	}
	f.dot = rt.list();
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(_T), T("/mob")])))) {
		thing = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(thing))))) {
				f.dot = rt.modify(live(f.dot), live(thing), add);
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	} else {
		if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(_T), T("/obj/machinery/door")])))) {
			thing = null;
			rt.forList(f, 0, rt.gl("airlocks"), T("/obj/machinery/door"));
			while (($e = rt.next(f, 0)) !== undefined) {
				thing = $e;
				if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(thing))))) {
					f.dot = rt.modify(live(f.dot), live(thing), add);
				}
				if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
					yield* g.call(f, P("/proc/stoplag"), null, []);
				}
			}
			rt.endFor(f, 0);
		} else {
			if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(_T), T("/obj/machinery")])))) {
				thing = null;
				rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery"));
				while (($e = rt.next(f, 0)) !== undefined) {
					thing = $e;
					if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(thing))))) {
						f.dot = rt.modify(live(f.dot), live(thing), add);
					}
					if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
						yield* g.call(f, P("/proc/stoplag"), null, []);
					}
				}
				rt.endFor(f, 0);
			} else {
				if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(_T), T("/obj")])))) {
					thing = null;
					rt.forList(f, 0, rt.world(), T("/obj"));
					while (($e = rt.next(f, 0)) !== undefined) {
						thing = $e;
						if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(thing))))) {
							f.dot = rt.modify(live(f.dot), live(thing), add);
						}
						if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
							yield* g.call(f, P("/proc/stoplag"), null, []);
						}
					}
					rt.endFor(f, 0);
				} else {
					if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(_T), T("/atom/movable")])))) {
						thing = null;
						rt.forList(f, 0, rt.world(), T("/atom/movable"));
						while (($e = rt.next(f, 0)) !== undefined) {
							thing = $e;
							if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(thing))))) {
								f.dot = rt.modify(live(f.dot), live(thing), add);
							}
							if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
								yield* g.call(f, P("/proc/stoplag"), null, []);
							}
						}
						rt.endFor(f, 0);
					} else {
						if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(_T), T("/turf")])))) {
							thing = null;
							rt.forList(f, 0, rt.world(), T("/turf"));
							while (($e = rt.next(f, 0)) !== undefined) {
								thing = $e;
								if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(thing))))) {
									f.dot = rt.modify(live(f.dot), live(thing), add);
								}
								if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
									yield* g.call(f, P("/proc/stoplag"), null, []);
								}
							}
							rt.endFor(f, 0);
						} else {
							if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(_T), T("/atom")])))) {
								thing = null;
								rt.forList(f, 0, rt.world(), T("/atom"));
								while (($e = rt.next(f, 0)) !== undefined) {
									thing = $e;
									if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(thing))))) {
										f.dot = rt.modify(live(f.dot), live(thing), add);
									}
									if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
										yield* g.call(f, P("/proc/stoplag"), null, []);
									}
								}
								rt.endFor(f, 0);
							} else {
								if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(_T), T("/client")])))) {
									thing = null;
									rt.forList(f, 0, rt.gl("clients"), T("/client"));
									while (($e = rt.next(f, 0)) !== undefined) {
										thing = $e;
										if (truthy(rt.index(live(typecache), T("/client")))) {
											f.dot = rt.modify(live(f.dot), live(thing), add);
										}
										if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
											yield* g.call(f, P("/proc/stoplag"), null, []);
										}
									}
									rt.endFor(f, 0);
								} else {
									if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(_T), T("/datum")])))) {
										thing = null;
										rt.op(f, "CreateTypeEnumerator", [0], [T("/datum")], false);
										live(thing);
										while (($e = rt.next(f, 0)) !== undefined) {
											thing = $e;
											if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(thing))))) {
												f.dot = rt.modify(live(f.dot), live(thing), add);
											}
											if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
												yield* g.call(f, P("/proc/stoplag"), null, []);
											}
										}
										rt.endFor(f, 0);
									} else {
										thing = null;
										rt.forList(f, 0, rt.world(), T("/datum"));
										while (($e = rt.next(f, 0)) !== undefined) {
											thing = $e;
											if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(thing))))) {
												f.dot = rt.modify(live(f.dot), live(thing), add);
											}
											if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
												yield* g.call(f, P("/proc/stoplag"), null, []);
											}
										}
										rt.endFor(f, 0);
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
}, true);
