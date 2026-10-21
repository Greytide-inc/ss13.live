// From code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1842, "/datum/SDQL_parser", "/datum", {
	query_type: null,
	error: 0,
	query: null,
	tree: null,
	select_functions: null,
	boolean_operators: null,
	unary_operators: null,
	binary_operators: null,
	comparitors: null,
});

// /datum/SDQL_parser/proc/<init>  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:54)
rt.def("/datum/SDQL_parser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "select_functions", rt.list("count"));
	rt.setSv(f, "boolean_operators", rt.list("and", "or", "&&", "||"));
	rt.setSv(f, "unary_operators", rt.list("!", "-", "~"));
	rt.setSv(f, "binary_operators", rt.list("+", "-", "/", "*", "&", "|", "^"));
	rt.setSv(f, "comparitors", rt.list("=", "==", "!=", "<>", "<", "<=", ">", ">="));
	return f.dot;
});

// /datum/SDQL_parser/proc/New  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:61)
rt.def("/datum/SDQL_parser/proc/New", function New(f: Frame, query_list: Value) {
	rt.setSv(f, "query", live(query_list));
	return f.dot;
});

// /datum/SDQL_parser/proc/parse_error  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:65)
rt.def("/datum/SDQL_parser/proc/parse_error", function parse_error(f: Frame, error_message: Value) {
	rt.setSv(f, "error", 1);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>SQDL2 Parsing Error: ＀</span>", [live(error_message)])]);
	return add(rt.len(f, rt.sv(f, "query")), 1);
});

// /datum/SDQL_parser/proc/parse  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:69)
rt.def("/datum/SDQL_parser/proc/parse", function parse(f: Frame) {
	rt.setSv(f, "tree", rt.list());
	rt.callSrc(f, "query", [1, rt.sv(f, "tree")]);
	if (truthy(rt.sv(f, "error"))) {
		return rt.list();
	}
	return rt.sv(f, "tree");
});

// /datum/SDQL_parser/proc/token  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:78)
rt.def("/datum/SDQL_parser/proc/token", function token(f: Frame, i: Value) {
	if (rt.le(live(i), rt.len(f, rt.sv(f, "query")))) {
		return rt.index(rt.sv(f, "query"), live(i));
	}
	return null;
});

// /datum/SDQL_parser/proc/tokens  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:85)
rt.def("/datum/SDQL_parser/proc/tokens", function tokens(f: Frame, i: Value, num: Value) {
	if (rt.le(add(live(i), live(num)), rt.len(f, rt.sv(f, "query")))) {
		return rt.callName(f, rt.sv(f, "query"), "Copy", [live(i), add(live(i), live(num))]);
	}
	return null;
});

// /datum/SDQL_parser/proc/tokenl  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:92)
rt.def("/datum/SDQL_parser/proc/tokenl", function tokenl(f: Frame, i: Value) {
	return rt.call(f, P("/proc/lowertext"), null, [rt.callSrc(f, "token", [live(i)])]);
});

// /datum/SDQL_parser/proc/query  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:97)
rt.def("/datum/SDQL_parser/proc/query", function query(f: Frame, i: Value, node: Value) {
	let $0: any;
	f.vars = () => [node, $0];
	rt.setSv(f, "query_type", rt.callSrc(f, "tokenl", [live(i)]));
	$0 = rt.sv(f, "query_type");
	if ($0 === "select") {
		rt.callSrc(f, "select_query", [live(i), live(node)]);
	} else if ($0 === "delete") {
		rt.callSrc(f, "delete_query", [live(i), live(node)]);
	} else if ($0 === "update") {
		rt.callSrc(f, "update_query", [live(i), live(node)]);
	} else if ($0 === "call") {
		rt.callSrc(f, "call_query", [live(i), live(node)]);
	} else if ($0 === "explain") {
		rt.setAt((node = rt.modify(live(node), "explain", add)), "explain", rt.list());
		rt.callSrc(f, "query", [add(live(i), 1), rt.at(live(node), "explain")]);
	}
	return f.dot;
});

// /datum/SDQL_parser/proc/select_query  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:115)
rt.def("/datum/SDQL_parser/proc/select_query", function select_query(f: Frame, i: Value, node: Value) {
	let select: Value = null;
	f.vars = () => [i, node, select];
	select = rt.list();
	i = rt.callSrc(f, "select_list", [add(live(i), 1), live(select)]);
	rt.setAt((node = rt.modify(live(node), "select", add)), "select", live(select));
	rt.callSrc(f, "selectors", [live(i), live(node)]);
	return live(i);
});

// /datum/SDQL_parser/proc/delete_query  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:124)
rt.def("/datum/SDQL_parser/proc/delete_query", function delete_query(f: Frame, i: Value, node: Value) {
	let select: Value = null;
	f.vars = () => [i, node, select];
	select = rt.list();
	i = rt.callSrc(f, "select_list", [add(live(i), 1), live(select)]);
	rt.setAt((node = rt.modify(live(node), "delete", add)), "delete", live(select));
	rt.callSrc(f, "selectors", [live(i), live(node)]);
	return live(i);
});

// /datum/SDQL_parser/proc/update_query  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:133)
rt.def("/datum/SDQL_parser/proc/update_query", function update_query(f: Frame, i: Value, node: Value) {
	let select: Value = null, set_assignments: Value = null;
	f.vars = () => [i, node, select, set_assignments];
	select = rt.list();
	i = rt.callSrc(f, "select_list", [add(live(i), 1), live(select)]);
	rt.setAt((node = rt.modify(live(node), "update", add)), "update", live(select));
	if (!isEqual(rt.callSrc(f, "tokenl", [live(i)]), "set")) {
		i = rt.callSrc(f, "parse_error", ["UPDATE has misplaced SET"]);
	}
	set_assignments = rt.list();
	i = rt.callSrc(f, "assignments", [add(live(i), 1), live(set_assignments)]);
	rt.setAt((node = rt.modify(live(node), "set", add)), "set", live(set_assignments));
	rt.callSrc(f, "selectors", [live(i), live(node)]);
	return live(i);
});

// /datum/SDQL_parser/proc/call_query  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:148)
rt.def("/datum/SDQL_parser/proc/call_query", function call_query(f: Frame, i: Value, node: Value) {
	let func: Value = null, select: Value = null;
	f.vars = () => [i, node, func, select];
	func = rt.list();
	i = rt.callSrc(f, "variable", [add(live(i), 1), live(func)]);
	rt.setAt((node = rt.modify(live(node), "call", add)), "call", live(func));
	if (!isEqual(rt.callSrc(f, "tokenl", [live(i)]), "on")) {
		return live(i);
	}
	select = rt.list();
	i = rt.callSrc(f, "select_list", [add(live(i), 1), live(select)]);
	rt.setAt((node = rt.modify(live(node), "on", add)), "on", live(select));
	rt.callSrc(f, "selectors", [live(i), live(node)]);
	return live(i);
});

// /datum/SDQL_parser/proc/select_list  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:163)
rt.def("/datum/SDQL_parser/proc/select_list", function select_list(f: Frame, i: Value, node: Value) {
	f.vars = () => [i];
	if (isEqual(rt.callSrc(f, "token", [(i = rt.callSrc(f, "select_item", [live(i), live(node)]))]), ",")) {
		i = rt.callSrc(f, "select_list", [add(live(i), 1), live(node)]);
	}
	return live(i);
});

// /datum/SDQL_parser/proc/assignments  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:170)
rt.def("/datum/SDQL_parser/proc/assignments", function assignments(f: Frame, i: Value, node: Value) {
	f.vars = () => [i];
	if (isEqual(rt.callSrc(f, "token", [(i = rt.callSrc(f, "assignment", [live(i), live(node)]))]), ",")) {
		i = rt.callSrc(f, "assignments", [add(live(i), 1), live(node)]);
	}
	return live(i);
});

// /datum/SDQL_parser/proc/select_item  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:177)
rt.def("/datum/SDQL_parser/proc/select_item", function select_item(f: Frame, i: Value, node: Value) {
	f.vars = () => [i, node];
	if (isEqual(rt.callSrc(f, "token", [live(i)]), "*")) {
		node = rt.modify(live(node), "*", add);
		i = rt.inc(live(i), 1);
	} else {
		if (truthy((rt.isIn(f, rt.callSrc(f, "tokenl", [live(i)]), rt.sv(f, "select_functions")) ? 1 : 0))) {
			i = rt.callSrc(f, "select_function", [live(i), live(node)]);
		} else {
			i = rt.callSrc(f, "object_type", [live(i), live(node)]);
		}
	}
	return live(i);
});

// /datum/SDQL_parser/proc/selectors  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:188)
rt.def("/datum/SDQL_parser/proc/selectors", function selectors(f: Frame, i: Value, node: Value) {
	let tok: Value = null, from: Value = null, where: Value = null;
	f.vars = () => [i, tok, from, where];
	blk48: {
		while (true) {
			if (!truthy(rt.callSrc(f, "token", [live(i)]))) break blk48;
			if (truthy((rt.isIn(f, (tok = rt.callSrc(f, "tokenl", [live(i)])), rt.list("from", "in")) ? 1 : 0))) {
				from = rt.list();
				i = rt.callSrc(f, "from_item", [add(live(i), 1), live(from)]);
				rt.setAt(live(node), "from", live(from));
				continue;
			}
			if (!isEqual(live(tok), "where")) break;
			where = rt.list();
			i = rt.callSrc(f, "bool_expression", [add(live(i), 1), live(where)]);
			rt.setAt(live(node), "where", live(where));
		}
		rt.callSrc(f, "parse_error", [fmt("Expected either FROM, IN or WHERE token, found ＀ instead.", [rt.callSrc(f, "token", [live(i)])])]);
		return add(live(i), 1);
	}
	if (!truthy(rt.callName(f, live(node), "Find", ["from"]))) {
		rt.setAt(live(node), "from", rt.list("world"));
	}
	return live(i);
});

// /datum/SDQL_parser/proc/from_item  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:208)
rt.def("/datum/SDQL_parser/proc/from_item", function from_item(f: Frame, i: Value, node: Value) {
	f.vars = () => [i, node];
	if (isEqual(rt.callSrc(f, "token", [live(i)]), "world")) {
		node = rt.modify(live(node), "world", add);
		i = rt.inc(live(i), 1);
	} else {
		i = rt.callSrc(f, "expression", [live(i), live(node)]);
	}
	return live(i);
});

// /datum/SDQL_parser/proc/bool_expression  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:217)
rt.def("/datum/SDQL_parser/proc/bool_expression", function bool_expression(f: Frame, i: Value, node: Value) {
	let bool: Value = null;
	f.vars = () => [i, bool];
	bool = rt.list();
	i = rt.callSrc(f, "expression", [live(i), live(bool)]);
	rt.setAt(live(node), rt.incField(f, live(node), "len", 1, false), live(bool));
	if (truthy((rt.isIn(f, rt.callSrc(f, "tokenl", [live(i)]), rt.sv(f, "boolean_operators")) ? 1 : 0))) {
		i = rt.callSrc(f, "bool_expression", [(i = rt.callSrc(f, "bool_operator", [live(i), live(node)])), live(node)]);
	}
	return live(i);
});

// /datum/SDQL_parser/proc/assignment  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:227)
rt.def("/datum/SDQL_parser/proc/assignment", function assignment(f: Frame, i: Value, node: Value, assignment_list: Value) {
	let exp_list: Value = null;
	f.vars = () => [i, assignment_list, exp_list];
	if (live(assignment_list) === null) {
		assignment_list = rt.list();
	}
	assignment_list = rt.modify(live(assignment_list), rt.callSrc(f, "token", [live(i)]), add);
	if (isEqual(rt.callSrc(f, "token", [add(live(i), 1)]), ".")) {
		i = rt.callSrc(f, "assignment", [add(live(i), 2), live(node), live(assignment_list)]);
	} else {
		if (isEqual(rt.callSrc(f, "token", [add(live(i), 1)]), "=")) {
			exp_list = rt.list();
			rt.setAt(live(node), live(assignment_list), live(exp_list));
			i = rt.callSrc(f, "expression", [add(live(i), 2), live(exp_list)]);
		} else {
			rt.callSrc(f, "parse_error", ["Assignment expected, but no = found"]);
		}
	}
	return live(i);
});

// /datum/SDQL_parser/proc/variable  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:240)
rt.def("/datum/SDQL_parser/proc/variable", function variable(f: Frame, i: Value, node: Value) {
	let L: Value = null, _arguments: Value = null, expression: Value = null;
	f.vars = () => [i, L, _arguments, expression];
	L = rt.list(rt.callSrc(f, "token", [live(i)]));
	rt.setAt(live(node), rt.incField(f, live(node), "len", 1, false), live(L));
	if (isEqual(rt.callSrc(f, "token", [live(i)]), "{")) {
		L = rt.modify(live(L), rt.callSrc(f, "token", [add(live(i), 1)]), add);
		if (!isEqual(rt.callSrc(f, "token", [(i = rt.modify(live(i), 2, add))]), "}")) {
			rt.callSrc(f, "parse_error", ["Missing } at end of pointer."]);
		}
	}
	if (isEqual(rt.callSrc(f, "token", [add(live(i), 1)]), ".")) {
		L = rt.modify(live(L), ".", add);
		i = rt.callSrc(f, "variable", [add(live(i), 2), live(L)]);
	} else {
		if (isEqual(rt.callSrc(f, "token", [add(live(i), 1)]), "(")) {
			_arguments = rt.list();
			i = rt.callSrc(f, "call_function", [live(i), null, live(_arguments)]);
			rt.setAt((L = rt.modify(live(L), ":", add)), rt.incField(f, live(L), "len", 1, false), live(_arguments));
		} else {
			if (isEqual(rt.callSrc(f, "token", [add(live(i), 1)]), "[")) {
				expression = rt.list();
				if (!isEqual(rt.callSrc(f, "token", [(i = rt.callSrc(f, "expression", [add(live(i), 2), live(expression)]))]), "]")) {
					rt.callSrc(f, "parse_error", ["Missing ] at the end of list access."]);
				}
				rt.setAt((L = rt.modify(live(L), "[", add)), rt.incField(f, live(L), "len", 1, false), live(expression));
				i = rt.inc(live(i), 1);
			} else {
				i = rt.inc(live(i), 1);
			}
		}
	}
	return live(i);
});

// /datum/SDQL_parser/proc/array  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:269)
rt.def("/datum/SDQL_parser/proc/array", function array(f: Frame, i: Value, node: Value) {
	let expression_list: Value = null, temp_expression_list: Value = null, tok: Value = null;
	f.vars = () => [i, node, expression_list, temp_expression_list, tok];
	if (!isEqual(rt.call(f, P("/proc/copytext"), null, [rt.callSrc(f, "token", [live(i)]), 1, 2]), "[")) {
		rt.callSrc(f, "parse_error", [fmt("Expected an array but found '＀'", [rt.callSrc(f, "token", [live(i)])])]);
		return add(live(i), 1);
	}
	node = rt.modify(live(node), rt.callSrc(f, "token", [live(i)]), add);
	expression_list = rt.list();
	i = rt.inc(live(i), 1);
	if (!isEqual(rt.callSrc(f, "token", [live(i)]), "]")) {
		temp_expression_list = rt.list();
		tok = null;
		while (true) {
			blk99: {
				if ((isEqual((tok = rt.callSrc(f, "token", [live(i)])), ",") || isEqual(live(tok), ":"))) {
					if (live(temp_expression_list) === null) {
						rt.callSrc(f, "parse_error", ["Found ',' or ':' without expression in an array."]);
						return add(live(i), 1);
					}
					rt.setAt(live(expression_list), rt.incField(f, live(expression_list), "len", 1, false), live(temp_expression_list));
					temp_expression_list = null;
					if (isEqual(live(tok), ":")) {
						temp_expression_list = rt.list();
						i = rt.callSrc(f, "expression", [add(live(i), 1), live(temp_expression_list)]);
						rt.setAt(live(expression_list), rt.index(live(expression_list), rt.len(f, live(expression_list))), live(temp_expression_list));
						temp_expression_list = null;
						if (!isEqual((tok = rt.callSrc(f, "token", [live(i)])), ",")) {
							if (isEqual(live(tok), "]")) {
								break;
							}
							rt.callSrc(f, "parse_error", [fmt("Expected ',' or ']' after array assoc value, but found '＀'", [rt.callSrc(f, "token", [live(i)])])]);
							return live(i);
						}
						i = rt.inc(live(i), 1);
						break blk99;
					}
				}
				temp_expression_list = rt.list();
				i = rt.callSrc(f, "expression", [live(i), live(temp_expression_list)]);
			}
			if (!(truthy(rt.callSrc(f, "token", [live(i)])) && !isEqual(rt.callSrc(f, "token", [live(i)]), "]"))) break;
		}
		if (truthy(live(temp_expression_list))) {
			rt.setAt(live(expression_list), rt.incField(f, live(expression_list), "len", 1, false), live(temp_expression_list));
		}
	}
	rt.setAt(live(node), rt.incField(f, live(node), "len", 1, false), live(expression_list));
	return add(live(i), 1);
});

// /datum/SDQL_parser/proc/object_type  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:309)
rt.def("/datum/SDQL_parser/proc/object_type", function object_type(f: Frame, i: Value, node: Value) {
	f.vars = () => [i, node];
	if (isEqual(rt.call(f, P("/proc/copytext"), null, [rt.callSrc(f, "token", [live(i)]), 1, 2]), "/")) {
		node = rt.modify(live(node), rt.callSrc(f, "token", [live(i)]), add);
	} else {
		i = rt.callSrc(f, "string", [live(i), live(node)]);
	}
	return add(live(i), 1);
});

// /datum/SDQL_parser/proc/comparitor  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:317)
rt.def("/datum/SDQL_parser/proc/comparitor", function comparitor(f: Frame, i: Value, node: Value) {
	f.vars = () => [node];
	if (truthy((rt.isIn(f, rt.callSrc(f, "token", [live(i)]), rt.list("=", "==", "!=", "<>", "<", "<=", ">", ">=")) ? 1 : 0))) {
		node = rt.modify(live(node), rt.callSrc(f, "token", [live(i)]), add);
	} else {
		rt.callSrc(f, "parse_error", [fmt("Unknown comparitor ＀", [rt.callSrc(f, "token", [live(i)])])]);
	}
	return add(live(i), 1);
});

// /datum/SDQL_parser/proc/bool_operator  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:325)
rt.def("/datum/SDQL_parser/proc/bool_operator", function bool_operator(f: Frame, i: Value, node: Value) {
	f.vars = () => [node];
	if (truthy((rt.isIn(f, rt.callSrc(f, "tokenl", [live(i)]), rt.list("and", "or", "&&", "||")) ? 1 : 0))) {
		node = rt.modify(live(node), rt.callSrc(f, "token", [live(i)]), add);
	} else {
		rt.callSrc(f, "parse_error", [fmt("Unknown comparitor ＀", [rt.callSrc(f, "token", [live(i)])])]);
	}
	return add(live(i), 1);
});

// /datum/SDQL_parser/proc/string  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:333)
rt.def("/datum/SDQL_parser/proc/string", function string(f: Frame, i: Value, node: Value) {
	f.vars = () => [node];
	if (truthy((rt.isIn(f, rt.call(f, P("/proc/copytext"), null, [rt.callSrc(f, "token", [live(i)]), 1, 2]), rt.list("'", "\"")) ? 1 : 0))) {
		node = rt.modify(live(node), rt.call(f, P("/proc/copytext"), null, [rt.callSrc(f, "token", [live(i)]), 2, -1]), add);
	} else {
		rt.callSrc(f, "parse_error", [fmt("Expected string but found '＀'", [rt.callSrc(f, "token", [live(i)])])]);
	}
	return add(live(i), 1);
});

// /datum/SDQL_parser/proc/call_function  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:341)
rt.def("/datum/SDQL_parser/proc/call_function", function call_function(f: Frame, i: Value, node: Value, _arguments: Value) {
	let procname: Value = null, expression_list_temp: Value = null;
	let $t: any;
	f.vars = () => [i, node, procname, expression_list_temp, $t];
	if (truthy(rt.length(rt.callSrc(f, "tokenl", [live(i)])))) {
		procname = "";
		if ((isEqual(rt.callSrc(f, "token", [live(i)]), "global") && isEqual(rt.callSrc(f, "token", [add(live(i), 1)]), "."))) {
			i = rt.modify(live(i), 2, add);
			procname = "global.";
		}
		node = rt.modify(live(node), add(live(procname), rt.callSrc(f, "token", [($t = live(i), i = rt.inc($t, 1), $t)])), add);
		if (!isEqual(rt.callSrc(f, "token", [live(i)]), "(")) {
			rt.callSrc(f, "parse_error", [fmt("Expected ( but found '＀'", [rt.callSrc(f, "token", [live(i)])])]);
		} else {
			if (!isEqual(rt.callSrc(f, "token", [add(live(i), 1)]), ")")) {
				expression_list_temp = rt.list();
				while (true) {
					if (isEqual(rt.callSrc(f, "token", [(i = rt.callSrc(f, "expression", [add(live(i), 1), live(expression_list_temp)]))]), ",")) {
						rt.setAt(live(_arguments), rt.incField(f, live(_arguments), "len", 1, false), live(expression_list_temp));
						expression_list_temp = rt.list();
					}
					if (!(truthy(rt.callSrc(f, "token", [live(i)])) && !isEqual(rt.callSrc(f, "token", [live(i)]), ")"))) break;
				}
				rt.setAt(live(_arguments), rt.incField(f, live(_arguments), "len", 1, false), live(expression_list_temp));
			} else {
				i = rt.inc(live(i), 1);
			}
		}
	} else {
		rt.callSrc(f, "parse_error", ["Expected a function but found nothing"]);
	}
	return add(live(i), 1);
});

// /datum/SDQL_parser/proc/select_function  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:367)
rt.def("/datum/SDQL_parser/proc/select_function", function select_function(f: Frame, i: Value, node: Value) {
	rt.callSrc(f, "parse_error", ["Sorry, function calls aren't available yet"]);
	return live(i);
});

// /datum/SDQL_parser/proc/expression  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:372)
rt.def("/datum/SDQL_parser/proc/expression", function expression(f: Frame, i: Value, node: Value) {
	let expr: Value = null, rhs: Value = null;
	f.vars = () => [i, expr, rhs];
	if (truthy((rt.isIn(f, rt.callSrc(f, "token", [live(i)]), rt.sv(f, "unary_operators")) ? 1 : 0))) {
		i = rt.callSrc(f, "unary_expression", [live(i), live(node)]);
	} else {
		if (isEqual(rt.callSrc(f, "token", [live(i)]), "(")) {
			expr = rt.list();
			if (!isEqual(rt.callSrc(f, "token", [(i = rt.callSrc(f, "expression", [add(live(i), 1), live(expr)]))]), ")")) {
				rt.callSrc(f, "parse_error", ["Missing ) at end of expression."]);
			} else {
				i = rt.inc(live(i), 1);
			}
			rt.setAt(live(node), rt.incField(f, live(node), "len", 1, false), live(expr));
		} else {
			i = rt.callSrc(f, "value", [live(i), live(node)]);
		}
	}
	if (truthy((rt.isIn(f, rt.callSrc(f, "token", [live(i)]), rt.sv(f, "binary_operators")) ? 1 : 0))) {
		i = rt.callSrc(f, "expression", [(i = rt.callSrc(f, "binary_operator", [live(i), live(node)])), live(node)]);
	} else {
		if (truthy((rt.isIn(f, rt.callSrc(f, "token", [live(i)]), rt.sv(f, "comparitors")) ? 1 : 0))) {
			i = rt.callSrc(f, "binary_operator", [live(i), live(node)]);
			rhs = rt.list();
			i = rt.callSrc(f, "expression", [live(i), live(rhs)]);
			rt.setAt(live(node), rt.incField(f, live(node), "len", 1, false), live(rhs));
		}
	}
	return live(i);
});

// /datum/SDQL_parser/proc/unary_expression  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:396)
rt.def("/datum/SDQL_parser/proc/unary_expression", function unary_expression(f: Frame, i: Value, node: Value) {
	let unary_exp: Value = null, expr: Value = null;
	f.vars = () => [i, unary_exp, expr];
	if (truthy((rt.isIn(f, rt.callSrc(f, "token", [live(i)]), rt.sv(f, "unary_operators")) ? 1 : 0))) {
		unary_exp = rt.list();
		unary_exp = rt.modify(live(unary_exp), rt.callSrc(f, "token", [live(i)]), add);
		i = rt.inc(live(i), 1);
		if (truthy((rt.isIn(f, rt.callSrc(f, "token", [live(i)]), rt.sv(f, "unary_operators")) ? 1 : 0))) {
			i = rt.callSrc(f, "unary_expression", [live(i), live(unary_exp)]);
		} else {
			if (isEqual(rt.callSrc(f, "token", [live(i)]), "(")) {
				expr = rt.list();
				if (!isEqual(rt.callSrc(f, "token", [(i = rt.callSrc(f, "expression", [add(live(i), 1), live(expr)]))]), ")")) {
					rt.callSrc(f, "parse_error", ["Missing ) at end of expression."]);
				} else {
					i = rt.inc(live(i), 1);
				}
				rt.setAt(live(unary_exp), rt.incField(f, live(unary_exp), "len", 1, false), live(expr));
			} else {
				i = rt.callSrc(f, "value", [live(i), live(unary_exp)]);
			}
		}
		rt.setAt(live(node), rt.incField(f, live(node), "len", 1, false), live(unary_exp));
	} else {
		rt.callSrc(f, "parse_error", [fmt("Expected unary operator but found '＀'", [rt.callSrc(f, "token", [live(i)])])]);
	}
	return live(i);
});

// /datum/SDQL_parser/proc/binary_operator  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:419)
rt.def("/datum/SDQL_parser/proc/binary_operator", function binary_operator(f: Frame, i: Value, node: Value) {
	f.vars = () => [node];
	if (truthy((rt.isIn(f, rt.callSrc(f, "token", [live(i)]), add(rt.sv(f, "binary_operators"), rt.sv(f, "comparitors"))) ? 1 : 0))) {
		node = rt.modify(live(node), rt.callSrc(f, "token", [live(i)]), add);
	} else {
		rt.callSrc(f, "parse_error", [fmt("Unknown binary operator ＀", [rt.callSrc(f, "token", [live(i)])])]);
	}
	return add(live(i), 1);
});

// /datum/SDQL_parser/proc/value  (code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm:427)
rt.def("/datum/SDQL_parser/proc/value", function value(f: Frame, i: Value, node: Value) {
	f.vars = () => [i, node];
	if (isEqual(rt.callSrc(f, "token", [live(i)]), "null")) {
		node = rt.modify(live(node), "null", add);
		i = rt.inc(live(i), 1);
	} else {
		if ((isEqual(rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/copytext"), null, [rt.callSrc(f, "token", [live(i)]), 1, 3])]), "0x") && truthy(rt.call(f, P("/proc/isnum"), null, [rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [rt.callSrc(f, "token", [live(i)]), 3])])])))) {
			node = rt.modify(live(node), rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [rt.callSrc(f, "token", [live(i)]), 3])]), add);
			i = rt.inc(live(i), 1);
		} else {
			if (truthy(rt.call(f, P("/proc/isnum"), null, [rt.call(f, P("/proc/text2num"), null, [rt.callSrc(f, "token", [live(i)])])]))) {
				node = rt.modify(live(node), rt.call(f, P("/proc/text2num"), null, [rt.callSrc(f, "token", [live(i)])]), add);
				i = rt.inc(live(i), 1);
			} else {
				if (truthy((rt.isIn(f, rt.call(f, P("/proc/copytext"), null, [rt.callSrc(f, "token", [live(i)]), 1, 2]), rt.list("'", "\"")) ? 1 : 0))) {
					i = rt.callSrc(f, "string", [live(i), live(node)]);
				} else {
					if (isEqual(rt.call(f, P("/proc/copytext"), null, [rt.callSrc(f, "token", [live(i)]), 1, 2]), "[")) {
						i = rt.callSrc(f, "array", [live(i), live(node)]);
					} else {
						i = rt.callSrc(f, "variable", [live(i), live(node)]);
					}
				}
			}
		}
	}
	return live(i);
});
