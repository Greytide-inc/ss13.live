// Based on /tg/station's code/modules/admin/verbs/SDQL2/SDQL_2.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


// SDQL_2.dm:23
rt.def("/client/proc/SDQL2_query", function* SDQL2_query(f: Frame, query_text: Value) {
	let query_list: Value = null, querys: Value = null, query_tree: Value = null, from_objs: Value = null, select_types: Value = null, objs: Value = null, type: Value = null, e: Value = null, objs_temp: Value = null, d: Value = null, e_15: Value = null, d_13: Value = null, text: Value = null, t: Value = null, a: Value = null, set_list: Value = null, sets: Value = null, temp: Value = null, i: Value = null, v: Value = null;
	let $2: any, $e: any;
	if (!check_rights(32)) {
		message_admins(`<span class='danger'>ERROR: Non-admin ${key_name(f.usr, f.usr.client)} attempted to execute a SDQL query!</span>`);
		log_admin(`Non-admin ${f.usr.ckey}(${f.usr}) attempted to execute a SDQL query!`);
		return 0;
	}
	let query_log: Value = `executed SDQL query: "${query_text}".`;
	message_admins(`${key_name_admin(f.usr)} ${query_log}`);
	log_game((query_log = `${f.usr.ckey}(${f.usr}) ${query_log}`));
	notice(query_log);
	let runtime_tracker: Value = list();
	let runtimes_list: Value = "";
	let runtimes: Value = 0;
	let objs_all: Value = 0;
	let objs_eligible: Value = 0;
	let $0: any = rt.world().timeofday;
	let $1: any = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	let start_time: Value = $0 + $1 * $2;
	if (!query_text || rt.length(query_text) < 1) {
		return f.dot;
	}
	if (!(query_list = SDQL2_tokenize(query_text)) || rt.len(f, query_list) < 1) {
		return f.dot;
	}
	if (!(querys = (yield* SDQL_parse(query_list))) || rt.len(f, querys) < 1) {
		return f.dot;
	}
	for (query_tree of each(querys, T("/list"))) {
		from_objs = list();
		select_types = list();
		const item = rt.index(query_tree, 1);
		if (item === "explain") {
			SDQL_testout(rt.at(query_tree, "explain"));
			return f.dot;
		} else if (item === "call") {
			if (rt.isIn(f, "on", query_tree)) {
				select_types = rt.at(query_tree, "on");
			} else {
				return f.dot;
			}
		} else if (item === "select" || item === "delete" || item === "update") {
			select_types = rt.index(query_tree, rt.index(query_tree, 1));
		}
		from_objs = rt.world().SDQL_from_objs(rt.at(query_tree, "from"));
		objs = list();
		type = null;
		for (type of each(select_types)) {
			rt.tryOpen(f);
			try {
				objs += (yield* SDQL_get_all(type, from_objs));
				rt.tryClose(f);
			} catch ($err) {
				e = rt.catchValue(f, $err);
				runtime_tracker += SDQL_parse_exception(e);
				runtimes++;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
		objs_all = rt.len(f, objs);
		if (rt.isIn(f, "where", query_tree)) {
			objs_temp = objs;
			objs = list();
			d = null;
			for (d of each(objs_temp, T("/datum"))) {
				rt.tryOpen(f);
				try {
					if (SDQL_expression(d, rt.at(query_tree, "where"))) {
						objs += d;
						objs_eligible++;
					}
					rt.tryClose(f);
				} catch ($err) {
					e_15 = rt.catchValue(f, $err);
					runtime_tracker += SDQL_parse_exception(e_15);
					runtimes++;
				}
				if (rt.tickUsage(f) > GLOB.current_ticklimit) {
					yield* stoplag();
				}
			}
		}
		const item_2 = rt.index(query_tree, 1);
		if (item_2 === "call") {
			d_13 = null;
			for (d_13 of each(objs, T("/datum"))) {
				rt.tryOpen(f);
				try {
					yield* rt.world().SDQL_var(d_13, rt.index(rt.at(query_tree, "call"), 1), { source: d_13 });
					rt.tryClose(f);
				} catch ($err) {
					e = rt.catchValue(f, $err);
					runtime_tracker += SDQL_parse_exception(e);
					runtimes++;
				}
				if (rt.tickUsage(f) > GLOB.current_ticklimit) {
					yield* stoplag();
				}
			}
		} else if (item_2 === "delete") {
			d_13 = null;
			for (d_13 of each(objs, T("/datum"))) {
				rt.tryOpen(f);
				try {
					yield* qdel(d_13);
					rt.tryClose(f);
				} catch ($err) {
					e = rt.catchValue(f, $err);
					runtime_tracker += SDQL_parse_exception(e);
					runtimes++;
				}
				if (rt.tickUsage(f) > GLOB.current_ticklimit) {
					yield* stoplag();
				}
			}
		} else if (item_2 === "select") {
			text = "";
			t = null;
			for (t of each(objs, T("/datum"))) {
				rt.tryOpen(f);
				try {
					text += fmt("<A HREF='?_src_=vars;Vars=＃'>＃</A>", [t, t]);
					if (rt.istype(t, T("/atom"))) {
						if ((a = t).x) {
							text += `: ${t} at (${a.x}, ${a.y}, ${a.z})<br>`;
						} else if (a.loc && a.loc.x) {
							text += `: ${t} in ${a.loc} at (${a.loc.x}, ${a.loc.y}, ${a.loc.z})<br>`;
						} else {
							text += `: ${t}<br>`;
						}
					} else {
						text += `: ${t}<br>`;
					}
					rt.tryClose(f);
				} catch ($err) {
					e_15 = rt.catchValue(f, $err);
					runtime_tracker += SDQL_parse_exception(e_15);
					runtimes++;
				}
				if (rt.tickUsage(f) > GLOB.current_ticklimit) {
					yield* stoplag();
				}
			}
			rt.op(f, "Browse", [], [f.usr, text, "window=SDQL-result"], false);
		} else if (item_2 === "update") {
			if (rt.isIn(f, "set", query_tree)) {
				set_list = rt.at(query_tree, "set");
				d = null;
				for (d of each(objs, T("/datum"))) {
					rt.tryOpen(f);
					try {
						sets = null;
						for (sets of each(set_list, T("/list"))) {
							temp = d;
							i = 0;
							v = null;
							for (v of each(sets)) {
								if (++i == rt.len(f, sets)) {
									yield* temp.vv_edit_var(v, SDQL_expression(d, rt.index(set_list, sets)));
									break;
								}
								if (temp.vars.Find(v) && rt.istype(rt.index(temp.vars, v), T("/datum"))) {
									temp = rt.index(temp.vars, v);
								} else {
									break;
								}
							}
						}
						rt.tryClose(f);
					} catch ($err) {
						e_15 = rt.catchValue(f, $err);
						runtime_tracker += SDQL_parse_exception(e_15);
						runtimes++;
					}
					if (rt.tickUsage(f) > GLOB.current_ticklimit) {
						yield* stoplag();
					}
				}
			}
		}
	}
	$0 = rt.world().timeofday;
	$1 = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	let end_time: Value = $0 + $1 * $2;
	end_time -= start_time;
	to_chat(f.usr, `<span class='admin'>SDQL query results: ${query_text}</span>`);
	to_chat(f.usr, `<span class='admin'>SDQL query completed: ${objs_all} objects selected by path, and ${objs_eligible} objects executed on after WHERE filtering if applicable.</span>`);
	to_chat(f.usr, `<span class='admin'>SDQL query took ${end_time / 10} seconds to complete.</span>`);
	if (!runtimes) return f.dot;
	to_chat(f.usr, `<span class='boldwarning'>SDQL query encountered ${runtimes} runtimes!</span>`);
	to_chat(f.usr, "<span class='boldwarning'>Opening runtime tracking window.</span>");
	runtimes_list = runtime_tracker.Join();
	rt.op(f, "Browse", [], [f.usr, runtimes_list, "window=SDQL-runtimes"], false);
	return f.dot;
}, true, { verb: { category: "Debug" }, argTypes: [{ type: 64 }] });

// SDQL_2.dm:174
rt.def("/proc/SDQL_parse_exception", function SDQL_parse_exception(f: Frame, E: Value) {
	let returning: Value = list();
	returning += `Runtime Error: ${E.name}<BR>`;
	returning += `Occured at line ${E.line} file ${E.file}<BR>`;
	return (returning += `Description: ${E.desc}<BR>`);
});

// SDQL_2.dm:181
rt.def("/proc/SDQL_parse", function* SDQL_parse(f: Frame, query_list: Value) {
	let val: Value = null, parsed_tree: Value = null;
	let parser: Value = (yield* new_(T("/datum/SDQL_parser")));
	let querys: Value = list();
	let query_tree: Value = list();
	let pos: Value = 1;
	let querys_pos: Value = 1;
	let do_parse: Value = 0;
	for (val of each(query_list)) {
		if (val == ";") {
			do_parse = 1;
		} else if (pos >= rt.len(f, query_list)) {
			query_tree += val;
			do_parse = 1;
		}
		if (do_parse) {
			parser.query = query_tree;
			parsed_tree = null;
			if (rt.len(f, (parsed_tree = parser.parse())) > 0) {
				querys.len = querys_pos;
				rt.setAt(querys, querys_pos, parsed_tree);
				querys_pos++;
			} else {
				to_chat(f.usr, fmt("<span class='danger'>Parsing error on ＀４ query. Nothing was executed.</span>", [querys_pos]));
				return list();
			}
			query_tree = list();
			do_parse = 0;
		} else {
			query_tree += val;
		}
		pos++;
	}
	yield* qdel(parser);
	return querys;
}, true);

// SDQL_2.dm:218
rt.def("/proc/SDQL_testout", function SDQL_testout(f: Frame, query_tree: Value, indent: Value) {
	let item: Value = null;
	indent ??= 0;
	let spaces: Value = "";
	let s: Value = 0;
	while (s < indent) {
		spaces += "    ";
		s++;
	}
	for (item of each(query_tree)) {
		if (rt.istype(item, T("/list"))) {
			to_chat(f.usr, `${spaces}(`);
			rt.call(f, P("/proc/SDQL_testout"), null, [item, indent + 1]);
			to_chat(f.usr, `${spaces})`);
		} else {
			to_chat(f.usr, `${spaces}${item}`);
		}
		if (!isnum(item) && rt.index(query_tree, item)) {
			if (rt.istype(rt.index(query_tree, item), T("/list"))) {
				to_chat(f.usr, `${spaces}    (`);
				rt.call(f, P("/proc/SDQL_testout"), null, [rt.index(query_tree, item), indent + 2]);
				to_chat(f.usr, `${spaces}    )`);
			} else {
				to_chat(f.usr, `${spaces}    ${rt.index(query_tree, item)}`);
			}
		}
	}
	return f.dot;
});

// SDQL_2.dm:244
rt.def("/world/proc/SDQL_from_objs", function SDQL_from_objs(f: Frame, tree: Value) {
	if (rt.isIn(f, "world", tree)) {
		return this;
	}
	return SDQL_expression(this, tree);
});

// SDQL_2.dm:249
rt.def("/proc/SDQL_get_all", function* SDQL_get_all(f: Frame, type: Value, location: Value) {
	let d: Value = null;
	let $e: any;
	let out: Value = list();
	if (!rt.istype(location, T("/list")) && location != rt.world()) {
		location = list(location);
	}
	type = text2path(type);
	let typecache: Value = typecacheof(type);
	if (ispath(type, T("/mob"))) {
		for (d of each(location, T("/mob"))) {
			if (rt.index(typecache, d.type)) {
				out += d;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(type, T("/turf"))) {
		d = null;
		for (d of each(location, T("/turf"))) {
			if (rt.index(typecache, d.type)) {
				out += d;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(type, T("/obj"))) {
		d = null;
		for (d of each(location, T("/obj"))) {
			if (rt.index(typecache, d.type)) {
				out += d;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(type, T("/area"))) {
		d = null;
		for (d of each(location, T("/area"))) {
			if (rt.index(typecache, d.type)) {
				out += d;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(type, T("/atom"))) {
		d = null;
		for (d of each(location, T("/atom"))) {
			if (rt.index(typecache, d.type)) {
				out += d;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else if (ispath(type, T("/datum"))) {
		if (location == rt.world()) {
			d = null;
			rt.op(f, "CreateTypeEnumerator", [0], [T("/datum")], false);
			d;
			while (($e = rt.next(f, 0)) !== undefined) {
				d = $e;
				if (rt.index(typecache, d.type)) {
					out += d;
				}
				if (rt.tickUsage(f) > GLOB.current_ticklimit) {
					yield* stoplag();
				}
			}
			rt.endFor(f, 0);
		} else {
			d = null;
			for (d of each(location, T("/datum"))) {
				if (rt.index(typecache, d.type)) {
					out += d;
				}
				if (rt.tickUsage(f) > GLOB.current_ticklimit) {
					yield* stoplag();
				}
			}
		}
	}
	return out;
}, true);

// SDQL_2.dm:306
rt.def("/proc/SDQL_expression", function SDQL_expression(f: Frame, object: Value, expression: Value, start: Value) {
	let val: Value = null, op: Value = null, ret: Value = null;
	start ??= 1;
	let result: Value = 0;
	let i: Value = start;
	while (i <= rt.len(f, expression)) {
		op = "";
		if (i > start) {
			op = rt.index(expression, i);
			i++;
		}
		val = rt.index((ret = SDQL_value(object, expression, i)), "val");
		i = rt.at(ret, "i");
		if (op != "") {
			if (op === "+") {
				result = result + val;
			} else if (op === "-") {
				result = result - val;
			} else if (op === "*") {
				result = result * val;
			} else if (op === "/") {
				result = result / val;
			} else if (op === "&") {
				result = rt.bitAnd(result, val);
			} else if (op === "|") {
				result = rt.bitOr(result, val);
			} else if (op === "^") {
				result = rt.bitXor(result, val);
			} else if (op === "=" || op === "==") {
				result = (result == val ? 1 : 0);
			} else if (op === "!=" || op === "<>") {
				result = (result != val ? 1 : 0);
			} else if (op === "<") {
				result = (result < val ? 1 : 0);
			} else if (op === "<=") {
				result = (result <= val ? 1 : 0);
			} else if (op === ">") {
				result = (result > val ? 1 : 0);
			} else if (op === ">=") {
				result = (result >= val ? 1 : 0);
			} else if (op === "and" || op === "&&") {
				result = (result && val);
			} else if (op === "or" || op === "||") {
				result = (result || val);
			} else {
				to_chat(f.usr, `<span class='danger'>SDQL2: Unknown op ${op}</span>`);
				result = null;
			}
		} else {
			result = val;
		}
		i++;
	}
	return result;
});

// SDQL_2.dm:358
rt.def("/proc/SDQL_value", function SDQL_value(f: Frame, object: Value, expression: Value, start: Value) {
	let val: Value = null, ret: Value = null, expressions_list: Value = null, expression_list: Value = null, result: Value = null, assoc: Value = null, dummy: Value = null;
	start ??= 1;
	let i: Value = start;
	if (i > rt.len(f, expression)) {
		return rt.alist(f, ["val", null, "i", i]);
	}
	if (rt.istype(rt.index(expression, i), T("/list"))) {
		val = SDQL_expression(object, rt.index(expression, i));
	} else if (rt.index(expression, i) == "!") {
		val = (!rt.index((ret = rt.call(f, P("/proc/SDQL_value"), null, [object, expression, i + 1])), "val") ? 1 : 0);
		i = rt.at(ret, "i");
	} else if (rt.index(expression, i) == "~") {
		val = rt.op(f, "BitNot", [], [rt.index((ret = rt.call(f, P("/proc/SDQL_value"), null, [object, expression, i + 1])), "val")]);
		i = rt.at(ret, "i");
	} else if (rt.index(expression, i) == "-") {
		val = -rt.index((ret = rt.call(f, P("/proc/SDQL_value"), null, [object, expression, i + 1])), "val");
		i = rt.at(ret, "i");
	} else if (rt.index(expression, i) == "null") {
		val = null;
	} else if (isnum(rt.index(expression, i))) {
		val = rt.index(expression, i);
	} else if (rt.isIn(f, copytext(rt.index(expression, i), 1, 2), list("'", "\""))) {
		val = copytext(rt.index(expression, i), 2, rt.length(rt.index(expression, i)));
	} else if (rt.index(expression, i) == "[") {
		expressions_list = rt.index(expression, ++i);
		val = list();
		for (expression_list of each(expressions_list, T("/list"))) {
			result = SDQL_expression(object, expression_list);
			assoc = null;
			if (rt.index(expressions_list, expression_list) !== null) {
				assoc = SDQL_expression(object, rt.index(expressions_list, expression_list));
			}
			if (assoc !== null) {
				rt.setAt((dummy = list()), result, assoc);
				result = dummy;
			}
			val += result;
		}
	} else {
		val = rt.world().SDQL_var(object, expression, i, object);
		i = rt.len(f, expression);
	}
	return rt.alist(f, ["val", val, "i", i]);
});

// SDQL_2.dm:413
rt.def("/world/proc/SDQL_var", function SDQL_var(f: Frame, object: Value, expression: Value, start: Value, source: Value) {
	let v: Value = null, L: Value = null, index: Value = null;
	start ??= 1;
	let long: Value = (start < rt.len(f, expression) ? 1 : 0);
	if (object == rt.world() && long && rt.index(expression, start + 1) == ".") {
		to_chat(f.usr, "Sorry, but world variables are not supported at the moment.");
		return null;
	}
	if (rt.index(expression, start) == "{" && long) {
		if (lowertext(copytext(rt.index(expression, start + 1), 1, 3)) != "0x") {
			to_chat(f.usr, `<span class='danger'>Invalid pointer syntax: ${rt.index(expression, start + 1)}</span>`);
			return null;
		}
		if (!(v = rt.locateIn(f, `[${rt.index(expression, start + 1)}]`, rt.world()))) {
			to_chat(f.usr, `<span class='danger'>Invalid pointer: ${rt.index(expression, start + 1)}</span>`);
			return null;
		}
		start++;
	} else if ((!long || rt.index(expression, start + 1) == ".") && rt.isIn(f, rt.index(expression, start), object.vars)) {
		if (object.can_vv_get(rt.index(expression, start))) {
			v = rt.index(object.vars, rt.index(expression, start));
		} else {
			v = "SECRET";
		}
	} else if (long && rt.index(expression, start + 1) == ":" && hascall(object, rt.index(expression, start))) {
		v = rt.index(expression, start);
	} else if (!long || rt.index(expression, start + 1) == ".") {
		const item = rt.index(expression, start);
		if (item === "usr") {
			v = f.usr;
		} else if (item === "src") {
			v = source;
		} else if (item === "marked") {
			if (f.usr.client && f.usr.client.holder && f.usr.client.holder.marked_datum) {
				v = f.usr.client.holder.marked_datum;
			} else {
				return null;
			}
		} else if (item === "world") {
			v = rt.world();
		} else if (item === "global") {
			v = GLOB.GLOB;
		} else {
			return null;
		}
	} else if (object == GLOB.GLOB) {
		v = rt.index(expression, start);
	}
	if (long) {
		if (rt.index(expression, start + 1) == ".") {
			return this.SDQL_var(v, rt.index(expression, start + 2), { source: source });
		}
		if (rt.index(expression, start + 1) == ":") {
			return SDQL_function(object, v, rt.index(expression, start + 2), source);
		}
		if (rt.index(expression, start + 1) == "[" && rt.istype(v, T("/list"))) {
			L = v;
			if (isnum((index = SDQL_expression(source, rt.index(expression, start + 2)))) && (!IsInteger(index) || rt.len(f, L) < index)) {
				to_chat(f.usr, `<span class='danger'>Invalid list index: ${index}</span>`);
				return null;
			}
			return rt.index(L, index);
		}
	}
	return v;
});

// SDQL_2.dm:468
rt.def("/proc/SDQL_function", function* SDQL_function(f: Frame, object: Value, procname: Value, _arguments: Value, source: Value) {
	let arg: Value = null;
	let new_args: Value = list();
	for (arg of each(_arguments)) {
		new_args += SDQL_expression(source, arg);
	}
	if (object == GLOB.GLOB) {
		procname = `/proc/${procname}`;
		return (yield* WrapAdminProcCall("some_magic_bullshit", procname, new_args));
	}
	return (yield* WrapAdminProcCall(object, procname, new_args));
}, true, { waitfor: false });

// SDQL_2.dm:480
rt.def("/proc/SDQL2_tokenize", function SDQL2_tokenize(f: Frame, query_text: Value) {
	let char: Value = null, char2: Value = null;
	let whitespace: Value = list(" ", "\n", "\t");
	let single: Value = list("(", ")", ",", "+", "-", ".", ";", "{", "}", "[", "]", ":");
	let multi: Value = rt.alist(f, ["=", list("", "="), "<", list("", "=", ">"), ">", list("", "="), "!", list("", "=")]);
	let word: Value = "";
	let query_list: Value = list();
	let len: Value = rt.length(query_text);
	let i: Value = 1;
	while (i <= len) {
		if (rt.isIn(f, (char = copytext(query_text, i, i + 1)), whitespace)) {
			if (word != "") {
				query_list += word;
				word = "";
			}
		} else if (rt.isIn(f, char, single)) {
			if (word != "") {
				query_list += word;
				word = "";
			}
			query_list += char;
		} else if (rt.isIn(f, char, multi)) {
			if (word != "") {
				query_list += word;
				word = "";
			}
			if (rt.isIn(f, (char2 = copytext(query_text, i + 1, i + 2)), rt.index(multi, char))) {
				query_list += `${char}${char2}`;
				i++;
			} else {
				query_list += char;
			}
		} else if (char == "'") {
			if (word != "") {
				to_chat(f.usr, ` SDQL2: You have an error in your SDQL syntax, unexpected ' in query: "<font color=gray>${query_text}</font>" following "<font color=gray>${word}</font>". Please check your syntax, and try again.`);
				return null;
			}
			word = "'";
			i++;
			while (i <= len) {
				if ((char = copytext(query_text, i, i + 1)) == "'") {
					if (copytext(query_text, i + 1, i + 2) == "'") {
						word += "'";
						i++;
					} else {
						break;
					}
				} else {
					word += char;
				}
				i++;
			}
			if (i > len) {
				to_chat(f.usr, ` SDQL2: You have an error in your SDQL syntax, unmatched ' in query: "<font color=gray>${query_text}</font>". Please check your syntax, and try again.`);
				return null;
			}
			query_list += `${word}'`;
			word = "";
		} else if (char == "\"") {
			if (word != "") {
				to_chat(f.usr, ` SDQL2: You have an error in your SDQL syntax, unexpected " in query: "<font color=gray>${query_text}</font>" following "<font color=gray>${word}</font>". Please check your syntax, and try again.`);
				return null;
			}
			word = "\"";
			i++;
			while (i <= len) {
				if ((char = copytext(query_text, i, i + 1)) == "\"") {
					if (copytext(query_text, i + 1, i + 2) == "'") {
						word += "\"";
						i++;
					} else {
						break;
					}
				} else {
					word += char;
				}
				i++;
			}
			if (i > len) {
				to_chat(f.usr, ` SDQL2: You have an error in your SDQL syntax, unmatched " in query: "<font color=gray>${query_text}</font>". Please check your syntax, and try again.`);
				return null;
			}
			query_list += `${word}"`;
			word = "";
		} else {
			word += char;
		}
		i++;
	}
	if (word != "") {
		query_list += word;
	}
	return query_list;
});
