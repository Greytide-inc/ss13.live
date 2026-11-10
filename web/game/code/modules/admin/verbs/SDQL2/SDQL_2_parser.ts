// Based on /tg/station's code/modules/admin/verbs/SDQL2/SDQL_2_parser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// SDQL_2_parser.dm:54
rt.def("/datum/SDQL_parser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.select_functions = list("count");
	this.boolean_operators = list("and", "or", "&&", "||");
	this.unary_operators = list("!", "-", "~");
	this.binary_operators = list("+", "-", "/", "*", "&", "|", "^");
	this.comparitors = list("=", "==", "!=", "<>", "<", "<=", ">", ">=");
	return f.dot;
});

// SDQL_2_parser.dm:61
rt.def("/datum/SDQL_parser/proc/New", function New(f: Frame, query_list: Value) {
	this.query = query_list;
	return f.dot;
});

// SDQL_2_parser.dm:65
rt.def("/datum/SDQL_parser/proc/parse_error", function parse_error(f: Frame, error_message: Value) {
	this.error = 1;
	to_chat(f.usr, `<span class='danger'>SQDL2 Parsing Error: ${error_message}</span>`);
	return rt.len(f, this.query) + 1;
});

// SDQL_2_parser.dm:69
rt.def("/datum/SDQL_parser/proc/parse", function parse(f: Frame) {
	this.tree = list();
	this.query(1, this.tree);
	if (this.error) {
		return list();
	}
	return this.tree;
});

// SDQL_2_parser.dm:78
rt.def("/datum/SDQL_parser/proc/token", function token(f: Frame, i: Value) {
	if (i <= rt.len(f, this.query)) {
		return rt.index(this.query, i);
	}
	return null;
});

// SDQL_2_parser.dm:85
rt.def("/datum/SDQL_parser/proc/tokens", function tokens(f: Frame, i: Value, num: Value) {
	if (i + num <= rt.len(f, this.query)) {
		return this.query.Copy(i, i + num);
	}
	return null;
});

// SDQL_2_parser.dm:92
rt.def("/datum/SDQL_parser/proc/tokenl", function tokenl(f: Frame, i: Value) {
	return lowertext(this.token(i));
});

// SDQL_2_parser.dm:97
rt.def("/datum/SDQL_parser/proc/query", function query(f: Frame, i: Value, node: Value) {
	this.query_type = this.tokenl(i);
	if (this.query_type === "select") {
		this.select_query(i, node);
	} else if (this.query_type === "delete") {
		this.delete_query(i, node);
	} else if (this.query_type === "update") {
		this.update_query(i, node);
	} else if (this.query_type === "call") {
		this.call_query(i, node);
	} else if (this.query_type === "explain") {
		rt.setAt((node += "explain"), "explain", list());
		this.query(i + 1, rt.at(node, "explain"));
	}
	return f.dot;
});

// SDQL_2_parser.dm:115
rt.def("/datum/SDQL_parser/proc/select_query", function select_query(f: Frame, i: Value, node: Value) {
	let select: Value = list();
	i = this.select_list(i + 1, select);
	rt.setAt((node += "select"), "select", select);
	this.selectors(i, node);
	return i;
});

// SDQL_2_parser.dm:124
rt.def("/datum/SDQL_parser/proc/delete_query", function delete_query(f: Frame, i: Value, node: Value) {
	let select: Value = list();
	i = this.select_list(i + 1, select);
	rt.setAt((node += "delete"), "delete", select);
	this.selectors(i, node);
	return i;
});

// SDQL_2_parser.dm:133
rt.def("/datum/SDQL_parser/proc/update_query", function update_query(f: Frame, i: Value, node: Value) {
	let select: Value = list();
	i = this.select_list(i + 1, select);
	rt.setAt((node += "update"), "update", select);
	if (this.tokenl(i) != "set") {
		i = this.parse_error("UPDATE has misplaced SET");
	}
	let set_assignments: Value = list();
	i = this.assignments(i + 1, set_assignments);
	rt.setAt((node += "set"), "set", set_assignments);
	this.selectors(i, node);
	return i;
});

// SDQL_2_parser.dm:148
rt.def("/datum/SDQL_parser/proc/call_query", function call_query(f: Frame, i: Value, node: Value) {
	let func: Value = list();
	i = this.variable(i + 1, func);
	rt.setAt((node += "call"), "call", func);
	if (this.tokenl(i) != "on") {
		return i;
	}
	let select: Value = list();
	i = this.select_list(i + 1, select);
	rt.setAt((node += "on"), "on", select);
	this.selectors(i, node);
	return i;
});

// SDQL_2_parser.dm:163
rt.def("/datum/SDQL_parser/proc/select_list", function select_list(f: Frame, i: Value, node: Value) {
	if (this.token((i = this.select_item(i, node))) == ",") {
		i = this.select_list(i + 1, node);
	}
	return i;
});

// SDQL_2_parser.dm:170
rt.def("/datum/SDQL_parser/proc/assignments", function assignments(f: Frame, i: Value, node: Value) {
	if (this.token((i = this.assignment(i, node))) == ",") {
		i = this.assignments(i + 1, node);
	}
	return i;
});

// SDQL_2_parser.dm:177
rt.def("/datum/SDQL_parser/proc/select_item", function select_item(f: Frame, i: Value, node: Value) {
	if (this.token(i) == "*") {
		node += "*";
		i++;
	} else if (rt.isIn(f, this.tokenl(i), this.select_functions)) {
		i = this.select_function(i, node);
	} else {
		i = this.object_type(i, node);
	}
	return i;
});

// SDQL_2_parser.dm:188
rt.def("/datum/SDQL_parser/proc/selectors", function selectors(f: Frame, i: Value, node: Value) {
	let tok: Value = null, from: Value = null, where: Value = null;
	blk48: {
		while (true) {
			if (!this.token(i)) break blk48;
			if (rt.isIn(f, (tok = this.tokenl(i)), list("from", "in"))) {
				from = list();
				i = this.from_item(i + 1, from);
				rt.setAt(node, "from", from);
				continue;
			}
			if (tok != "where") break;
			where = list();
			i = this.bool_expression(i + 1, where);
			rt.setAt(node, "where", where);
		}
		this.parse_error(`Expected either FROM, IN or WHERE token, found ${this.token(i)} instead.`);
		return i + 1;
	}
	if (!node.Find("from")) {
		rt.setAt(node, "from", list("world"));
	}
	return i;
});

// SDQL_2_parser.dm:208
rt.def("/datum/SDQL_parser/proc/from_item", function from_item(f: Frame, i: Value, node: Value) {
	if (this.token(i) == "world") {
		node += "world";
		i++;
	} else {
		i = this.expression(i, node);
	}
	return i;
});

// SDQL_2_parser.dm:217
rt.def("/datum/SDQL_parser/proc/bool_expression", function bool_expression(f: Frame, i: Value, node: Value) {
	let bool: Value = list();
	i = this.expression(i, bool);
	rt.setAt(node, ++node.len, bool);
	if (rt.isIn(f, this.tokenl(i), this.boolean_operators)) {
		i = this.bool_expression((i = this.bool_operator(i, node)), node);
	}
	return i;
});

// SDQL_2_parser.dm:227
rt.def("/datum/SDQL_parser/proc/assignment", function assignment(f: Frame, i: Value, node: Value, assignment_list: Value) {
	let exp_list: Value = null;
	assignment_list ??= list();
	assignment_list += this.token(i);
	if (this.token(i + 1) == ".") {
		i = this.assignment(i + 2, node, assignment_list);
	} else if (this.token(i + 1) == "=") {
		exp_list = list();
		rt.setAt(node, assignment_list, exp_list);
		i = this.expression(i + 2, exp_list);
	} else {
		this.parse_error("Assignment expected, but no = found");
	}
	return i;
});

// SDQL_2_parser.dm:240
rt.def("/datum/SDQL_parser/proc/variable", function variable(f: Frame, i: Value, node: Value) {
	let _arguments: Value = null, expression: Value = null;
	let L: Value = list(this.token(i));
	rt.setAt(node, ++node.len, L);
	if (this.token(i) == "{") {
		L += this.token(i + 1);
		if (this.token((i += 2)) != "}") {
			this.parse_error("Missing } at end of pointer.");
		}
	}
	if (this.token(i + 1) == ".") {
		L += ".";
		i = this.variable(i + 2, L);
	} else if (this.token(i + 1) == "(") {
		_arguments = list();
		i = this.call_function(i, null, _arguments);
		rt.setAt((L += ":"), ++L.len, _arguments);
	} else if (this.token(i + 1) == "[") {
		expression = list();
		if (this.token((i = this.expression(i + 2, expression))) != "]") {
			this.parse_error("Missing ] at the end of list access.");
		}
		rt.setAt((L += "["), ++L.len, expression);
		i++;
	} else {
		i++;
	}
	return i;
});

// SDQL_2_parser.dm:269
rt.def("/datum/SDQL_parser/proc/array", function array(f: Frame, i: Value, node: Value) {
	let temp_expression_list: Value = null, tok: Value = null;
	if (copytext(this.token(i), 1, 2) != "[") {
		this.parse_error(`Expected an array but found '${this.token(i)}'`);
		return i + 1;
	}
	node += this.token(i);
	let expression_list: Value = list();
	i++;
	if (this.token(i) != "]") {
		temp_expression_list = list();
		while (true) {
			blk99: {
				if ((tok = this.token(i)) == "," || tok == ":") {
					if (temp_expression_list === null) {
						this.parse_error("Found ',' or ':' without expression in an array.");
						return i + 1;
					}
					rt.setAt(expression_list, ++expression_list.len, temp_expression_list);
					temp_expression_list = null;
					if (tok == ":") {
						temp_expression_list = list();
						i = this.expression(i + 1, temp_expression_list);
						rt.setAt(expression_list, rt.index(expression_list, rt.len(f, expression_list)), temp_expression_list);
						temp_expression_list = null;
						if ((tok = this.token(i)) != ",") {
							if (tok == "]") {
								break;
							}
							this.parse_error(`Expected ',' or ']' after array assoc value, but found '${this.token(i)}'`);
							return i;
						}
						i++;
						break blk99;
					}
				}
				temp_expression_list = list();
				i = this.expression(i, temp_expression_list);
			}
			if (!(this.token(i) && this.token(i) != "]")) break;
		}
		if (temp_expression_list) {
			rt.setAt(expression_list, ++expression_list.len, temp_expression_list);
		}
	}
	rt.setAt(node, ++node.len, expression_list);
	return i + 1;
});

// SDQL_2_parser.dm:309
rt.def("/datum/SDQL_parser/proc/object_type", function object_type(f: Frame, i: Value, node: Value) {
	if (copytext(this.token(i), 1, 2) == "/") {
		node += this.token(i);
	} else {
		i = this.string(i, node);
	}
	return i + 1;
});

// SDQL_2_parser.dm:317
rt.def("/datum/SDQL_parser/proc/comparitor", function comparitor(f: Frame, i: Value, node: Value) {
	if (rt.isIn(f, this.token(i), list("=", "==", "!=", "<>", "<", "<=", ">", ">="))) {
		node += this.token(i);
	} else {
		this.parse_error(`Unknown comparitor ${this.token(i)}`);
	}
	return i + 1;
});

// SDQL_2_parser.dm:325
rt.def("/datum/SDQL_parser/proc/bool_operator", function bool_operator(f: Frame, i: Value, node: Value) {
	if (rt.isIn(f, this.tokenl(i), list("and", "or", "&&", "||"))) {
		node += this.token(i);
	} else {
		this.parse_error(`Unknown comparitor ${this.token(i)}`);
	}
	return i + 1;
});

// SDQL_2_parser.dm:333
rt.def("/datum/SDQL_parser/proc/string", function string(f: Frame, i: Value, node: Value) {
	if (rt.isIn(f, copytext(this.token(i), 1, 2), list("'", "\""))) {
		node += copytext(this.token(i), 2, -1);
	} else {
		this.parse_error(`Expected string but found '${this.token(i)}'`);
	}
	return i + 1;
});

// SDQL_2_parser.dm:341
rt.def("/datum/SDQL_parser/proc/call_function", function call_function(f: Frame, i: Value, node: Value, _arguments: Value) {
	let procname: Value = null, expression_list_temp: Value = null;
	let $t: any;
	if (rt.length(this.tokenl(i))) {
		procname = "";
		if (this.token(i) == "global" && this.token(i + 1) == ".") {
			i += 2;
			procname = "global.";
		}
		node += procname + this.token(($t = i, i = rt.inc($t, 1), $t));
		if (this.token(i) != "(") {
			this.parse_error(`Expected ( but found '${this.token(i)}'`);
		} else if (this.token(i + 1) != ")") {
			expression_list_temp = list();
			while (true) {
				if (this.token((i = this.expression(i + 1, expression_list_temp))) == ",") {
					rt.setAt(_arguments, ++_arguments.len, expression_list_temp);
					expression_list_temp = list();
				}
				if (!(this.token(i) && this.token(i) != ")")) break;
			}
			rt.setAt(_arguments, ++_arguments.len, expression_list_temp);
		} else {
			i++;
		}
	} else {
		this.parse_error("Expected a function but found nothing");
	}
	return i + 1;
});

// SDQL_2_parser.dm:367
rt.def("/datum/SDQL_parser/proc/select_function", function select_function(f: Frame, i: Value, node: Value) {
	this.parse_error("Sorry, function calls aren't available yet");
	return i;
});

// SDQL_2_parser.dm:372
rt.def("/datum/SDQL_parser/proc/expression", function expression(f: Frame, i: Value, node: Value) {
	let expr: Value = null, rhs: Value = null;
	if (rt.isIn(f, this.token(i), this.unary_operators)) {
		i = this.unary_expression(i, node);
	} else if (this.token(i) == "(") {
		expr = list();
		if (this.token((i = this.expression(i + 1, expr))) != ")") {
			this.parse_error("Missing ) at end of expression.");
		} else {
			i++;
		}
		rt.setAt(node, ++node.len, expr);
	} else {
		i = this.value(i, node);
	}
	if (rt.isIn(f, this.token(i), this.binary_operators)) {
		i = this.expression((i = this.binary_operator(i, node)), node);
	} else if (rt.isIn(f, this.token(i), this.comparitors)) {
		i = this.binary_operator(i, node);
		rhs = list();
		i = this.expression(i, rhs);
		rt.setAt(node, ++node.len, rhs);
	}
	return i;
});

// SDQL_2_parser.dm:396
rt.def("/datum/SDQL_parser/proc/unary_expression", function unary_expression(f: Frame, i: Value, node: Value) {
	let unary_exp: Value = null, expr: Value = null;
	if (rt.isIn(f, this.token(i), this.unary_operators)) {
		unary_exp = list();
		unary_exp += this.token(i);
		i++;
		if (rt.isIn(f, this.token(i), this.unary_operators)) {
			i = this.unary_expression(i, unary_exp);
		} else if (this.token(i) == "(") {
			expr = list();
			if (this.token((i = this.expression(i + 1, expr))) != ")") {
				this.parse_error("Missing ) at end of expression.");
			} else {
				i++;
			}
			rt.setAt(unary_exp, ++unary_exp.len, expr);
		} else {
			i = this.value(i, unary_exp);
		}
		rt.setAt(node, ++node.len, unary_exp);
	} else {
		this.parse_error(`Expected unary operator but found '${this.token(i)}'`);
	}
	return i;
});

// SDQL_2_parser.dm:419
rt.def("/datum/SDQL_parser/proc/binary_operator", function binary_operator(f: Frame, i: Value, node: Value) {
	if (rt.isIn(f, this.token(i), this.binary_operators + this.comparitors)) {
		node += this.token(i);
	} else {
		this.parse_error(`Unknown binary operator ${this.token(i)}`);
	}
	return i + 1;
});

// SDQL_2_parser.dm:427
rt.def("/datum/SDQL_parser/proc/value", function value(f: Frame, i: Value, node: Value) {
	if (this.token(i) == "null") {
		node += "null";
		i++;
	} else if (lowertext(copytext(this.token(i), 1, 3)) == "0x" && isnum(hex2num(copytext(this.token(i), 3)))) {
		node += hex2num(copytext(this.token(i), 3));
		i++;
	} else if (isnum(text2num(this.token(i)))) {
		node += text2num(this.token(i));
		i++;
	} else if (rt.isIn(f, copytext(this.token(i), 1, 2), list("'", "\""))) {
		i = this.string(i, node);
	} else if (copytext(this.token(i), 1, 2) == "[") {
		i = this.array(i, node);
	} else {
		i = this.variable(i, node);
	}
	return i;
});
