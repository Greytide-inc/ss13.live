// From code/modules/admin/verbs/SDQL2/SDQL_2.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/SDQL2_query  (code/modules/admin/verbs/SDQL2/SDQL_2.dm:23)  may sleep
rt.def("/client/proc/SDQL2_query", function* SDQL2_query(f: Frame, query_text: Value) {
	let query_log: Value = null, runtime_tracker: Value = null, runtimes_list: Value = null, runtimes: Value = null, objs_all: Value = null, objs_eligible: Value = null, start_time: Value = null, query_list: Value = null, querys: Value = null, query_tree: Value = null, from_objs: Value = null, select_types: Value = null, objs: Value = null, type: Value = null, e: Value = null, objs_temp: Value = null, d: Value = null, e_15: Value = null, d_13: Value = null, text: Value = null, t: Value = null, a: Value = null, set_list: Value = null, sets: Value = null, temp: Value = null, i: Value = null, v: Value = null, end_time: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [query_text, query_log, runtime_tracker, runtimes_list, runtimes, objs_all, objs_eligible, start_time, query_list, querys, query_tree, from_objs, select_types, objs, type, e, objs_temp, d, e_15, d_13, text, t, a, set_list, sets, temp, i, v, end_time, $0, $1, $2, $e];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32])))) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='danger'>ERROR: Non-admin ＀ attempted to execute a SDQL query!</span>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr), rt.fv(f, "client", live(f.usr))]))])]);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("Non-admin ＀(＀) attempted to execute a SDQL query!", [rt.fv(f, "ckey", live(f.usr)), live(f.usr)])]);
		return 0;
	}
	query_log = fmt("executed SDQL query: \"＀\".", [live(query_text)]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(query_log)])]);
	yield* g.call(f, P("/proc/log_game"), null, [(query_log = fmt("＀(＀) ＀", [rt.fv(f, "ckey", live(f.usr)), live(f.usr), live(query_log)]))]);
	yield* g.call(f, P("/proc/notice"), null, [live(query_log)]);
	runtime_tracker = rt.list();
	runtimes_list = "";
	runtimes = 0;
	objs_all = 0;
	objs_eligible = 0;
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	start_time = add($0, multiply($1, $2));
	if ((!truthy(live(query_text)) || rt.lt(rt.length(live(query_text)), 1))) {
		return live(f.dot);
	}
	if ((!truthy((query_list = (yield* g.call(f, P("/proc/SDQL2_tokenize"), null, [live(query_text)])))) || rt.lt(rt.len(f, live(query_list)), 1))) {
		return live(f.dot);
	}
	if ((!truthy((querys = (yield* g.call(f, P("/proc/SDQL_parse"), null, [live(query_list)])))) || rt.lt(rt.len(f, live(querys)), 1))) {
		return live(f.dot);
	}
	query_tree = null;
	rt.forList(f, 0, live(querys), T("/list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		query_tree = $e;
		from_objs = rt.list();
		select_types = rt.list();
		$0 = rt.index(live(query_tree), 1);
		if ($0 === "explain") {
			yield* g.call(f, P("/proc/SDQL_testout"), null, [rt.at(live(query_tree), "explain")]);
			return live(f.dot);
		} else if ($0 === "call") {
			if (truthy((rt.isIn(f, "on", live(query_tree)) ? 1 : 0))) {
				select_types = rt.at(live(query_tree), "on");
			} else {
				return live(f.dot);
			}
		} else if ($0 === "select" || $0 === "delete" || $0 === "update") {
			select_types = rt.index(live(query_tree), rt.index(live(query_tree), 1));
		}
		from_objs = (yield* g.callName(f, rt.world(), "SDQL_from_objs", [rt.at(live(query_tree), "from")]));
		objs = rt.list();
		type = null;
		rt.forList(f, 1, live(select_types));
		while (($e = rt.next(f, 1)) !== undefined) {
			type = $e;
			rt.tryOpen(f);
			try {
				objs = rt.modify(live(objs), (yield* g.call(f, P("/proc/SDQL_get_all"), null, [live(type), live(from_objs)])), add);
				rt.tryClose(f);
			} catch ($err) {
				e = rt.catchValue(f, $err);
				runtime_tracker = rt.modify(live(runtime_tracker), (yield* g.call(f, P("/proc/SDQL_parse_exception"), null, [live(e)])), add);
				runtimes = rt.inc(live(runtimes), 1);
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 1);
		objs_all = rt.len(f, live(objs));
		if (truthy((rt.isIn(f, "where", live(query_tree)) ? 1 : 0))) {
			objs_temp = live(objs);
			objs = rt.list();
			d = null;
			rt.forList(f, 1, live(objs_temp), T("/datum"));
			while (($e = rt.next(f, 1)) !== undefined) {
				d = $e;
				rt.tryOpen(f);
				try {
					if (truthy((yield* g.call(f, P("/proc/SDQL_expression"), null, [live(d), rt.at(live(query_tree), "where")])))) {
						objs = rt.modify(live(objs), live(d), add);
						objs_eligible = rt.inc(live(objs_eligible), 1);
					}
					rt.tryClose(f);
				} catch ($err) {
					e_15 = rt.catchValue(f, $err);
					runtime_tracker = rt.modify(live(runtime_tracker), (yield* g.call(f, P("/proc/SDQL_parse_exception"), null, [live(e_15)])), add);
					runtimes = rt.inc(live(runtimes), 1);
				}
				if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
					yield* g.call(f, P("/proc/stoplag"), null, []);
				}
			}
			rt.endFor(f, 1);
		}
		$0 = rt.index(live(query_tree), 1);
		if ($0 === "call") {
			d_13 = null;
			rt.forList(f, 1, live(objs), T("/datum"));
			while (($e = rt.next(f, 1)) !== undefined) {
				d_13 = $e;
				rt.tryOpen(f);
				try {
					yield* g.callName(f, rt.world(), "SDQL_var", [null, live(d_13), null, rt.index(rt.at(live(query_tree), "call"), 1), "source", live(d_13)], rt.Args.Named);
					rt.tryClose(f);
				} catch ($err) {
					e = rt.catchValue(f, $err);
					runtime_tracker = rt.modify(live(runtime_tracker), (yield* g.call(f, P("/proc/SDQL_parse_exception"), null, [live(e)])), add);
					runtimes = rt.inc(live(runtimes), 1);
				}
				if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
					yield* g.call(f, P("/proc/stoplag"), null, []);
				}
			}
			rt.endFor(f, 1);
		} else if ($0 === "delete") {
			d_13 = null;
			rt.forList(f, 1, live(objs), T("/datum"));
			while (($e = rt.next(f, 1)) !== undefined) {
				d_13 = $e;
				rt.tryOpen(f);
				try {
					yield* g.call(f, P("/proc/qdel"), null, [live(d_13)]);
					rt.tryClose(f);
				} catch ($err) {
					e = rt.catchValue(f, $err);
					runtime_tracker = rt.modify(live(runtime_tracker), (yield* g.call(f, P("/proc/SDQL_parse_exception"), null, [live(e)])), add);
					runtimes = rt.inc(live(runtimes), 1);
				}
				if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
					yield* g.call(f, P("/proc/stoplag"), null, []);
				}
			}
			rt.endFor(f, 1);
		} else if ($0 === "select") {
			text = "";
			t = null;
			rt.forList(f, 1, live(objs), T("/datum"));
			while (($e = rt.next(f, 1)) !== undefined) {
				t = $e;
				rt.tryOpen(f);
				try {
					text = rt.modify(live(text), fmt("<A HREF='?_src_=vars;Vars=＃'>＃</A>", [live(t), live(t)]), add);
					if (truthy((rt.istype(live(t), T("/atom")) ? 1 : 0))) {
						if (truthy(rt.gv(f, "x", (a = live(t))))) {
							text = rt.modify(live(text), fmt(": ＀ at (＀, ＀, ＀)<br>", [live(t), rt.fv(f, "x", live(a)), rt.fv(f, "y", live(a)), rt.fv(f, "z", live(a))]), add);
						} else {
							if ((truthy(rt.fv(f, "loc", live(a))) && truthy(rt.gv(f, "x", rt.fv(f, "loc", live(a)))))) {
								text = rt.modify(live(text), fmt(": ＀ in ＀ at (＀, ＀, ＀)<br>", [live(t), rt.fv(f, "loc", live(a)), rt.gv(f, "x", rt.fv(f, "loc", live(a))), rt.gv(f, "y", rt.fv(f, "loc", live(a))), rt.gv(f, "z", rt.fv(f, "loc", live(a)))]), add);
							} else {
								text = rt.modify(live(text), fmt(": ＀<br>", [live(t)]), add);
							}
						}
					} else {
						text = rt.modify(live(text), fmt(": ＀<br>", [live(t)]), add);
					}
					rt.tryClose(f);
				} catch ($err) {
					e_15 = rt.catchValue(f, $err);
					runtime_tracker = rt.modify(live(runtime_tracker), (yield* g.call(f, P("/proc/SDQL_parse_exception"), null, [live(e_15)])), add);
					runtimes = rt.inc(live(runtimes), 1);
				}
				if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
					yield* g.call(f, P("/proc/stoplag"), null, []);
				}
			}
			rt.endFor(f, 1);
			rt.op(f, "Browse", [], [live(f.usr), live(text), "window=SDQL-result"], false);
		} else if ($0 === "update") {
			if (truthy((rt.isIn(f, "set", live(query_tree)) ? 1 : 0))) {
				set_list = rt.at(live(query_tree), "set");
				d = null;
				rt.forList(f, 1, live(objs), T("/datum"));
				while (($e = rt.next(f, 1)) !== undefined) {
					d = $e;
					rt.tryOpen(f);
					try {
						sets = null;
						rt.forList(f, 2, live(set_list), T("/list"));
						while (($e = rt.next(f, 2)) !== undefined) {
							sets = $e;
							temp = live(d);
							i = 0;
							v = null;
							rt.forList(f, 3, live(sets));
							while (($e = rt.next(f, 3)) !== undefined) {
								v = $e;
								if (isEqual((i = rt.inc(live(i), 1)), rt.len(f, live(sets)))) {
									yield* g.callName(f, live(temp), "vv_edit_var", [live(v), (yield* g.call(f, P("/proc/SDQL_expression"), null, [live(d), rt.index(live(set_list), live(sets))]))]);
									break;
								}
								if ((truthy((yield* g.callName(f, rt.fv(f, "vars", live(temp)), "Find", [live(v)]))) && truthy((rt.istype(rt.index(rt.fv(f, "vars", live(temp)), live(v)), T("/datum")) ? 1 : 0)))) {
									temp = rt.index(rt.fv(f, "vars", live(temp)), live(v));
								} else {
									break;
								}
							}
							rt.endFor(f, 3);
						}
						rt.endFor(f, 2);
						rt.tryClose(f);
					} catch ($err) {
						e_15 = rt.catchValue(f, $err);
						runtime_tracker = rt.modify(live(runtime_tracker), (yield* g.call(f, P("/proc/SDQL_parse_exception"), null, [live(e_15)])), add);
						runtimes = rt.inc(live(runtimes), 1);
					}
					if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
						yield* g.call(f, P("/proc/stoplag"), null, []);
					}
				}
				rt.endFor(f, 1);
			}
		}
	}
	rt.endFor(f, 0);
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	end_time = add($0, multiply($1, $2));
	(end_time = rt.modify(live(end_time), live(start_time), subtract));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='admin'>SDQL query results: ＀</span>", [live(query_text)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='admin'>SDQL query completed: ＀ objects selected by path, and ＀ objects executed on after WHERE filtering if applicable.</span>", [live(objs_all), live(objs_eligible)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='admin'>SDQL query took ＀ seconds to complete.</span>", [divide(live(end_time), 10)])]);
	if (!truthy(live(runtimes))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='boldwarning'>SDQL query encountered ＀ runtimes!</span>", [live(runtimes)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='boldwarning'>Opening runtime tracking window.</span>"]);
	runtimes_list = (yield* g.callName(f, live(runtime_tracker), "Join", []));
	rt.op(f, "Browse", [], [live(f.usr), live(runtimes_list), "window=SDQL-runtimes"], false);
	return f.dot;
}, true, { verb: { category: "Debug" }, argTypes: [{ type: 64 }] });

// /proc/SDQL_parse_exception  (code/modules/admin/verbs/SDQL2/SDQL_2.dm:174)
rt.def("/proc/SDQL_parse_exception", function SDQL_parse_exception(f: Frame, E: Value) {
	let returning: Value = null;
	f.vars = () => [returning];
	returning = rt.list();
	returning = rt.modify(live(returning), fmt("Runtime Error: ＀<BR>", [rt.fv(f, "name", live(E))]), add);
	returning = rt.modify(live(returning), fmt("Occured at line ＀ file ＀<BR>", [rt.fv(f, "line", live(E)), rt.fv(f, "file", live(E))]), add);
	return (returning = rt.modify(live(returning), fmt("Description: ＀<BR>", [rt.fv(f, "desc", live(E))]), add));
});

// /proc/SDQL_parse  (code/modules/admin/verbs/SDQL2/SDQL_2.dm:181)  may sleep
rt.def("/proc/SDQL_parse", function* SDQL_parse(f: Frame, query_list: Value) {
	let parser: Value = null, querys: Value = null, query_tree: Value = null, pos: Value = null, querys_pos: Value = null, do_parse: Value = null, val: Value = null, parsed_tree: Value = null;
	let $e: any;
	f.vars = () => [query_list, parser, querys, query_tree, pos, querys_pos, do_parse, val, parsed_tree, $e];
	parser = (yield* g.new_(f, T("/datum/SDQL_parser"), []));
	querys = rt.list();
	query_tree = rt.list();
	pos = 1;
	querys_pos = 1;
	do_parse = 0;
	val = null;
	rt.forList(f, 0, live(query_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		val = $e;
		if (isEqual(live(val), ";")) {
			do_parse = 1;
		} else {
			if (rt.ge(live(pos), rt.len(f, live(query_list)))) {
				query_tree = rt.modify(live(query_tree), live(val), add);
				do_parse = 1;
			}
		}
		if (truthy(live(do_parse))) {
			rt.setFv(f, "query", live(parser), live(query_tree));
			parsed_tree = null;
			if (rt.gt(rt.getLen(f, (parsed_tree = (yield* g.callName(f, live(parser), "parse", [])))), 0)) {
				rt.setFv(f, "len", live(querys), live(querys_pos));
				rt.setAt(live(querys), live(querys_pos), live(parsed_tree));
				querys_pos = rt.inc(live(querys_pos), 1);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>Parsing error on ＀４ query. Nothing was executed.</span>", [live(querys_pos)])]);
				return rt.list();
			}
			query_tree = rt.list();
			do_parse = 0;
		} else {
			query_tree = rt.modify(live(query_tree), live(val), add);
		}
		pos = rt.inc(live(pos), 1);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(parser)]);
	return live(querys);
}, true);

// /proc/SDQL_testout  (code/modules/admin/verbs/SDQL2/SDQL_2.dm:218)
rt.def("/proc/SDQL_testout", function SDQL_testout(f: Frame, query_tree: Value, indent: Value) {
	let spaces: Value = null, s: Value = null, item: Value = null;
	let $e: any;
	f.vars = () => [indent, spaces, s, item, $e];
	if (live(indent) === null) {
		indent = 0;
	}
	spaces = "";
	s = null;
	s = 0;
	while (rt.lt(live(s), live(indent))) {
		spaces = rt.modify(live(spaces), "    ", add);
		s = rt.inc(live(s), 1);
	}
	item = null;
	rt.forList(f, 0, live(query_tree));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		if (truthy((rt.istype(live(item), T("/list")) ? 1 : 0))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀(", [live(spaces)])]);
			rt.call(f, P("/proc/SDQL_testout"), null, [live(item), add(live(indent), 1)]);
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀)", [live(spaces)])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀＀", [live(spaces), live(item)])]);
		}
		if ((!truthy(rt.call(f, P("/proc/isnum"), null, [live(item)])) && truthy(rt.index(live(query_tree), live(item))))) {
			if (truthy((rt.istype(rt.index(live(query_tree), live(item)), T("/list")) ? 1 : 0))) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀    (", [live(spaces)])]);
				rt.call(f, P("/proc/SDQL_testout"), null, [rt.index(live(query_tree), live(item)), add(live(indent), 2)]);
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀    )", [live(spaces)])]);
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀    ＀", [live(spaces), rt.index(live(query_tree), live(item))])]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /world/proc/SDQL_from_objs  (code/modules/admin/verbs/SDQL2/SDQL_2.dm:244)
rt.def("/world/proc/SDQL_from_objs", function SDQL_from_objs(f: Frame, tree: Value) {
	if (truthy((rt.isIn(f, "world", live(tree)) ? 1 : 0))) {
		return live(f.src);
	}
	return rt.call(f, P("/proc/SDQL_expression"), null, [live(f.src), live(tree)]);
});

// /proc/SDQL_get_all  (code/modules/admin/verbs/SDQL2/SDQL_2.dm:249)  may sleep
rt.def("/proc/SDQL_get_all", function* SDQL_get_all(f: Frame, type: Value, location: Value) {
	let out: Value = null, typecache: Value = null, d: Value = null;
	let $e: any;
	f.vars = () => [type, location, out, typecache, d, $e];
	out = rt.list();
	if ((!truthy((rt.istype(live(location), T("/list")) ? 1 : 0)) && !isEqual(live(location), rt.world()))) {
		location = rt.list(live(location));
	}
	type = (yield* g.call(f, P("/proc/text2path"), null, [live(type)]));
	typecache = (yield* g.call(f, P("/proc/typecacheof"), null, [live(type)]));
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(type), T("/mob")])))) {
		d = null;
		rt.forList(f, 0, live(location), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			d = $e;
			if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(d))))) {
				out = rt.modify(live(out), live(d), add);
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
	} else {
		if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(type), T("/turf")])))) {
			d = null;
			rt.forList(f, 0, live(location), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				d = $e;
				if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(d))))) {
					out = rt.modify(live(out), live(d), add);
				}
				if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
					yield* g.call(f, P("/proc/stoplag"), null, []);
				}
			}
			rt.endFor(f, 0);
		} else {
			if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(type), T("/obj")])))) {
				d = null;
				rt.forList(f, 0, live(location), T("/obj"));
				while (($e = rt.next(f, 0)) !== undefined) {
					d = $e;
					if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(d))))) {
						out = rt.modify(live(out), live(d), add);
					}
					if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
						yield* g.call(f, P("/proc/stoplag"), null, []);
					}
				}
				rt.endFor(f, 0);
			} else {
				if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(type), T("/area")])))) {
					d = null;
					rt.forList(f, 0, live(location), T("/area"));
					while (($e = rt.next(f, 0)) !== undefined) {
						d = $e;
						if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(d))))) {
							out = rt.modify(live(out), live(d), add);
						}
						if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
							yield* g.call(f, P("/proc/stoplag"), null, []);
						}
					}
					rt.endFor(f, 0);
				} else {
					if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(type), T("/atom")])))) {
						d = null;
						rt.forList(f, 0, live(location), T("/atom"));
						while (($e = rt.next(f, 0)) !== undefined) {
							d = $e;
							if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(d))))) {
								out = rt.modify(live(out), live(d), add);
							}
							if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
								yield* g.call(f, P("/proc/stoplag"), null, []);
							}
						}
						rt.endFor(f, 0);
					} else {
						if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(type), T("/datum")])))) {
							if (isEqual(live(location), rt.world())) {
								d = null;
								rt.op(f, "CreateTypeEnumerator", [0], [T("/datum")], false);
								live(d);
								while (($e = rt.next(f, 0)) !== undefined) {
									d = $e;
									if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(d))))) {
										out = rt.modify(live(out), live(d), add);
									}
									if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
										yield* g.call(f, P("/proc/stoplag"), null, []);
									}
								}
								rt.endFor(f, 0);
							} else {
								d = null;
								rt.forList(f, 0, live(location), T("/datum"));
								while (($e = rt.next(f, 0)) !== undefined) {
									d = $e;
									if (truthy(rt.index(live(typecache), rt.fv(f, "type", live(d))))) {
										out = rt.modify(live(out), live(d), add);
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
	return live(out);
}, true);

// /proc/SDQL_expression  (code/modules/admin/verbs/SDQL2/SDQL_2.dm:306)
rt.def("/proc/SDQL_expression", function SDQL_expression(f: Frame, object: Value, expression: Value, start: Value) {
	let result: Value = null, val: Value = null, i: Value = null, op: Value = null, ret: Value = null;
	let $0: any;
	f.vars = () => [start, result, val, i, op, ret, $0];
	if (live(start) === null) {
		start = 1;
	}
	result = 0;
	val = null;
	i = null;
	i = live(start);
	while (rt.le(live(i), rt.len(f, live(expression)))) {
		op = "";
		if (rt.gt(live(i), live(start))) {
			op = rt.index(live(expression), live(i));
			i = rt.inc(live(i), 1);
		}
		val = rt.index((ret = rt.call(f, P("/proc/SDQL_value"), null, [live(object), live(expression), live(i)])), "val");
		i = rt.at(live(ret), "i");
		if (!isEqual(live(op), "")) {
			$0 = live(op);
			if ($0 === "+") {
				result = add(live(result), live(val));
			} else if ($0 === "-") {
				result = subtract(live(result), live(val));
			} else if ($0 === "*") {
				result = multiply(live(result), live(val));
			} else if ($0 === "/") {
				result = divide(live(result), live(val));
			} else if ($0 === "&") {
				result = rt.bitAnd(live(result), live(val));
			} else if ($0 === "|") {
				result = rt.bitOr(live(result), live(val));
			} else if ($0 === "^") {
				result = rt.bitXor(live(result), live(val));
			} else if ($0 === "=" || $0 === "==") {
				result = (isEqual(live(result), live(val)) ? 1 : 0);
			} else if ($0 === "!=" || $0 === "<>") {
				result = (!isEqual(live(result), live(val)) ? 1 : 0);
			} else if ($0 === "<") {
				result = (rt.lt(live(result), live(val)) ? 1 : 0);
			} else if ($0 === "<=") {
				result = (rt.le(live(result), live(val)) ? 1 : 0);
			} else if ($0 === ">") {
				result = (rt.gt(live(result), live(val)) ? 1 : 0);
			} else if ($0 === ">=") {
				result = (rt.ge(live(result), live(val)) ? 1 : 0);
			} else if ($0 === "and" || $0 === "&&") {
				result = (live(result) && live(val));
			} else if ($0 === "or" || $0 === "||") {
				result = (live(result) || live(val));
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>SDQL2: Unknown op ＀</span>", [live(op)])]);
				result = null;
			}
		} else {
			result = live(val);
		}
		i = rt.inc(live(i), 1);
	}
	return live(result);
});

// /proc/SDQL_value  (code/modules/admin/verbs/SDQL2/SDQL_2.dm:358)
rt.def("/proc/SDQL_value", function SDQL_value(f: Frame, object: Value, expression: Value, start: Value) {
	let i: Value = null, val: Value = null, ret: Value = null, expressions_list: Value = null, expression_list: Value = null, result: Value = null, assoc: Value = null, dummy: Value = null;
	let $e: any;
	f.vars = () => [start, i, val, ret, expressions_list, expression_list, result, assoc, dummy, $e];
	if (live(start) === null) {
		start = 1;
	}
	i = live(start);
	val = null;
	if (rt.gt(live(i), rt.len(f, live(expression)))) {
		return rt.alist(f, ["val", null, "i", live(i)]);
	}
	if (truthy((rt.istype(rt.index(live(expression), live(i)), T("/list")) ? 1 : 0))) {
		val = rt.call(f, P("/proc/SDQL_expression"), null, [live(object), rt.index(live(expression), live(i))]);
	} else {
		if (isEqual(rt.index(live(expression), live(i)), "!")) {
			val = (!truthy(rt.index((ret = rt.call(f, P("/proc/SDQL_value"), null, [live(object), live(expression), add(live(i), 1)])), "val")) ? 1 : 0);
			i = rt.at(live(ret), "i");
		} else {
			if (isEqual(rt.index(live(expression), live(i)), "~")) {
				val = rt.op(f, "BitNot", [], [rt.index((ret = rt.call(f, P("/proc/SDQL_value"), null, [live(object), live(expression), add(live(i), 1)])), "val")]);
				i = rt.at(live(ret), "i");
			} else {
				if (isEqual(rt.index(live(expression), live(i)), "-")) {
					val = rt.neg(rt.index((ret = rt.call(f, P("/proc/SDQL_value"), null, [live(object), live(expression), add(live(i), 1)])), "val"));
					i = rt.at(live(ret), "i");
				} else {
					if (isEqual(rt.index(live(expression), live(i)), "null")) {
						val = null;
					} else {
						if (truthy(rt.call(f, P("/proc/isnum"), null, [rt.index(live(expression), live(i))]))) {
							val = rt.index(live(expression), live(i));
						} else {
							if (truthy((rt.isIn(f, rt.call(f, P("/proc/copytext"), null, [rt.index(live(expression), live(i)), 1, 2]), rt.list("'", "\"")) ? 1 : 0))) {
								val = rt.call(f, P("/proc/copytext"), null, [rt.index(live(expression), live(i)), 2, rt.length(rt.index(live(expression), live(i)))]);
							} else {
								if (isEqual(rt.index(live(expression), live(i)), "[")) {
									expressions_list = rt.index(live(expression), (i = rt.inc(live(i), 1)));
									val = rt.list();
									expression_list = null;
									rt.forList(f, 0, live(expressions_list), T("/list"));
									while (($e = rt.next(f, 0)) !== undefined) {
										expression_list = $e;
										result = rt.call(f, P("/proc/SDQL_expression"), null, [live(object), live(expression_list)]);
										assoc = null;
										if (rt.index(live(expressions_list), live(expression_list)) !== null) {
											assoc = rt.call(f, P("/proc/SDQL_expression"), null, [live(object), rt.index(live(expressions_list), live(expression_list))]);
										}
										if (live(assoc) !== null) {
											rt.setAt((dummy = rt.list()), live(result), live(assoc));
											result = live(dummy);
										}
										val = rt.modify(live(val), live(result), add);
									}
									rt.endFor(f, 0);
								} else {
									val = rt.callName(f, rt.world(), "SDQL_var", [live(object), live(expression), live(i), live(object)]);
									i = rt.len(f, live(expression));
								}
							}
						}
					}
				}
			}
		}
	}
	return rt.alist(f, ["val", live(val), "i", live(i)]);
});

// /world/proc/SDQL_var  (code/modules/admin/verbs/SDQL2/SDQL_2.dm:413)
rt.def("/world/proc/SDQL_var", function SDQL_var(f: Frame, object: Value, expression: Value, start: Value, source: Value) {
	let v: Value = null, long: Value = null, L: Value = null, index: Value = null;
	let $0: any;
	f.vars = () => [start, v, long, L, index, $0];
	if (live(start) === null) {
		start = 1;
	}
	v = null;
	long = (rt.lt(live(start), rt.len(f, live(expression))) ? 1 : 0);
	if (((isEqual(live(object), rt.world()) && truthy(live(long))) && isEqual(rt.index(live(expression), add(live(start), 1)), "."))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "Sorry, but world variables are not supported at the moment."]);
		return null;
	}
	if ((isEqual(rt.index(live(expression), live(start)), "{") && truthy(live(long)))) {
		if (!isEqual(rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/copytext"), null, [rt.index(live(expression), add(live(start), 1)), 1, 3])]), "0x")) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>Invalid pointer syntax: ＀</span>", [rt.index(live(expression), add(live(start), 1))])]);
			return null;
		}
		if (!truthy((v = rt.locateIn(f, fmt("[＀]", [rt.index(live(expression), add(live(start), 1))]), rt.world())))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>Invalid pointer: ＀</span>", [rt.index(live(expression), add(live(start), 1))])]);
			return null;
		}
		start = rt.inc(live(start), 1);
	} else {
		if (((!truthy(live(long)) || isEqual(rt.index(live(expression), add(live(start), 1)), ".")) && truthy((rt.isIn(f, rt.index(live(expression), live(start)), rt.fv(f, "vars", live(object))) ? 1 : 0)))) {
			if (truthy(rt.callName(f, live(object), "can_vv_get", [rt.index(live(expression), live(start))]))) {
				v = rt.index(rt.fv(f, "vars", live(object)), rt.index(live(expression), live(start)));
			} else {
				v = "SECRET";
			}
		} else {
			if (((truthy(live(long)) && isEqual(rt.index(live(expression), add(live(start), 1)), ":")) && truthy(rt.call(f, P("/proc/hascall"), null, [live(object), rt.index(live(expression), live(start))])))) {
				v = rt.index(live(expression), live(start));
			} else {
				if ((!truthy(live(long)) || isEqual(rt.index(live(expression), add(live(start), 1)), "."))) {
					$0 = rt.index(live(expression), live(start));
					if ($0 === "usr") {
						v = live(f.usr);
					} else if ($0 === "src") {
						v = live(source);
					} else if ($0 === "marked") {
						if (((truthy(rt.fv(f, "client", live(f.usr))) && truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) && truthy(rt.gv(f, "marked_datum", rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))))) {
							v = rt.gv(f, "marked_datum", rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))));
						} else {
							return null;
						}
					} else if ($0 === "world") {
						v = rt.world();
					} else if ($0 === "global") {
						v = rt.gl("GLOB");
					} else {
						return null;
					}
				} else {
					if (isEqual(live(object), rt.gl("GLOB"))) {
						v = rt.index(live(expression), live(start));
					}
				}
			}
		}
	}
	if (truthy(live(long))) {
		if (isEqual(rt.index(live(expression), add(live(start), 1)), ".")) {
			return rt.callSrc(f, "SDQL_var", [null, live(v), null, rt.index(live(expression), add(live(start), 2)), "source", live(source)], rt.Args.Named);
		}
		if (isEqual(rt.index(live(expression), add(live(start), 1)), ":")) {
			return rt.call(f, P("/proc/SDQL_function"), null, [live(object), live(v), rt.index(live(expression), add(live(start), 2)), live(source)]);
		}
		if ((isEqual(rt.index(live(expression), add(live(start), 1)), "[") && truthy((rt.istype(live(v), T("/list")) ? 1 : 0)))) {
			L = live(v);
			if ((truthy(rt.call(f, P("/proc/isnum"), null, [(index = rt.call(f, P("/proc/SDQL_expression"), null, [live(source), rt.index(live(expression), add(live(start), 2))]))])) && (!truthy(rt.call(f, P("/proc/IsInteger"), null, [live(index)])) || rt.lt(rt.len(f, live(L)), live(index))))) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>Invalid list index: ＀</span>", [live(index)])]);
				return null;
			}
			return rt.index(live(L), live(index));
		}
	}
	return live(v);
});

// /proc/SDQL_function  (code/modules/admin/verbs/SDQL2/SDQL_2.dm:468)  may sleep
rt.def("/proc/SDQL_function", function* SDQL_function(f: Frame, object: Value, procname: Value, _arguments: Value, source: Value) {
	let new_args: Value = null, arg: Value = null;
	let $e: any;
	f.vars = () => [object, procname, _arguments, source, new_args, arg, $e];
	new_args = rt.list();
	arg = null;
	rt.forList(f, 0, live(_arguments));
	while (($e = rt.next(f, 0)) !== undefined) {
		arg = $e;
		new_args = rt.modify(live(new_args), (yield* g.call(f, P("/proc/SDQL_expression"), null, [live(source), live(arg)])), add);
	}
	rt.endFor(f, 0);
	if (isEqual(live(object), rt.gl("GLOB"))) {
		procname = fmt("/proc/＀", [live(procname)]);
		return (yield* g.call(f, P("/proc/WrapAdminProcCall"), null, ["some_magic_bullshit", live(procname), live(new_args)]));
	}
	return (yield* g.call(f, P("/proc/WrapAdminProcCall"), null, [live(object), live(procname), live(new_args)]));
}, true, { waitfor: false });

// /proc/SDQL2_tokenize  (code/modules/admin/verbs/SDQL2/SDQL_2.dm:480)
rt.def("/proc/SDQL2_tokenize", function SDQL2_tokenize(f: Frame, query_text: Value) {
	let whitespace: Value = null, single: Value = null, multi: Value = null, word: Value = null, query_list: Value = null, len: Value = null, i: Value = null, char: Value = null, char2: Value = null;
	f.vars = () => [whitespace, single, multi, word, query_list, len, i, char, char2];
	whitespace = rt.list(" ", "\n", "\t");
	single = rt.list("(", ")", ",", "+", "-", ".", ";", "{", "}", "[", "]", ":");
	multi = rt.alist(f, ["=", rt.list("", "="), "<", rt.list("", "=", ">"), ">", rt.list("", "="), "!", rt.list("", "=")]);
	word = "";
	query_list = rt.list();
	len = rt.length(live(query_text));
	i = null;
	i = 1;
	while (rt.le(live(i), live(len))) {
		if (truthy((rt.isIn(f, (char = rt.call(f, P("/proc/copytext"), null, [live(query_text), live(i), add(live(i), 1)])), live(whitespace)) ? 1 : 0))) {
			if (!isEqual(live(word), "")) {
				query_list = rt.modify(live(query_list), live(word), add);
				word = "";
			}
		} else {
			if (truthy((rt.isIn(f, live(char), live(single)) ? 1 : 0))) {
				if (!isEqual(live(word), "")) {
					query_list = rt.modify(live(query_list), live(word), add);
					word = "";
				}
				query_list = rt.modify(live(query_list), live(char), add);
			} else {
				if (truthy((rt.isIn(f, live(char), live(multi)) ? 1 : 0))) {
					if (!isEqual(live(word), "")) {
						query_list = rt.modify(live(query_list), live(word), add);
						word = "";
					}
					if (truthy((rt.isIn(f, (char2 = rt.call(f, P("/proc/copytext"), null, [live(query_text), add(live(i), 1), add(live(i), 2)])), rt.index(live(multi), live(char))) ? 1 : 0))) {
						query_list = rt.modify(live(query_list), fmt("＀＀", [live(char), live(char2)]), add);
						i = rt.inc(live(i), 1);
					} else {
						query_list = rt.modify(live(query_list), live(char), add);
					}
				} else {
					if (isEqual(live(char), "'")) {
						if (!isEqual(live(word), "")) {
							rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt(" SDQL2: You have an error in your SDQL syntax, unexpected ' in query: \"<font color=gray>＀</font>\" following \"<font color=gray>＀</font>\". Please check your syntax, and try again.", [live(query_text), live(word)])]);
							return null;
						}
						word = "'";
						i = rt.inc(live(i), 1);
						while (rt.le(live(i), live(len))) {
							if (isEqual((char = rt.call(f, P("/proc/copytext"), null, [live(query_text), live(i), add(live(i), 1)])), "'")) {
								if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(query_text), add(live(i), 1), add(live(i), 2)]), "'")) {
									word = rt.modify(live(word), "'", add);
									i = rt.inc(live(i), 1);
								} else {
									break;
								}
							} else {
								word = rt.modify(live(word), live(char), add);
							}
							i = rt.inc(live(i), 1);
						}
						if (rt.gt(live(i), live(len))) {
							rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt(" SDQL2: You have an error in your SDQL syntax, unmatched ' in query: \"<font color=gray>＀</font>\". Please check your syntax, and try again.", [live(query_text)])]);
							return null;
						}
						query_list = rt.modify(live(query_list), fmt("＀'", [live(word)]), add);
						word = "";
					} else {
						if (isEqual(live(char), "\"")) {
							if (!isEqual(live(word), "")) {
								rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt(" SDQL2: You have an error in your SDQL syntax, unexpected \" in query: \"<font color=gray>＀</font>\" following \"<font color=gray>＀</font>\". Please check your syntax, and try again.", [live(query_text), live(word)])]);
								return null;
							}
							word = "\"";
							i = rt.inc(live(i), 1);
							while (rt.le(live(i), live(len))) {
								if (isEqual((char = rt.call(f, P("/proc/copytext"), null, [live(query_text), live(i), add(live(i), 1)])), "\"")) {
									if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(query_text), add(live(i), 1), add(live(i), 2)]), "'")) {
										word = rt.modify(live(word), "\"", add);
										i = rt.inc(live(i), 1);
									} else {
										break;
									}
								} else {
									word = rt.modify(live(word), live(char), add);
								}
								i = rt.inc(live(i), 1);
							}
							if (rt.gt(live(i), live(len))) {
								rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt(" SDQL2: You have an error in your SDQL syntax, unmatched \" in query: \"<font color=gray>＀</font>\". Please check your syntax, and try again.", [live(query_text)])]);
								return null;
							}
							query_list = rt.modify(live(query_list), fmt("＀\"", [live(word)]), add);
							word = "";
						} else {
							word = rt.modify(live(word), live(char), add);
						}
					}
				}
			}
		}
		i = rt.inc(live(i), 1);
	}
	if (!isEqual(live(word), "")) {
		query_list = rt.modify(live(query_list), live(word), add);
	}
	return live(query_list);
});
