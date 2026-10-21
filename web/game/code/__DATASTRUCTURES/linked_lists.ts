// From code/__DATASTRUCTURES/linked_lists.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4, "/datum/linked_list", "/datum", {
	head: null,
	tail: null,
	node_amt: 0,
});

// /datum/linked_list/proc/IsEmpty  (code/__DATASTRUCTURES/linked_lists.dm:18)
rt.def("/datum/linked_list/proc/IsEmpty", function IsEmpty(f: Frame) {
	f.dot = (rt.le(rt.sv(f, "node_amt"), 0) ? 1 : 0);
	return f.dot;
});

// /datum/linked_list/proc/Add  (code/__DATASTRUCTURES/linked_lists.dm:26)
rt.def("/datum/linked_list/proc/Add", function Add(f: Frame, node: Value, position: Value) {
	let adding: Value = null, location: Value = null, at: Value = null;
	f.vars = () => [adding, location, at];
	adding = null;
	if (truthy((rt.istype(live(node), T("/datum/linked_node")) ? 1 : 0))) {
		adding = live(node);
	} else {
		rt.setFv(f, "value", (adding = rt.new_(f, T("/datum/linked_node"), [])), live(node));
	}
	if ((!truthy(rt.fv(f, "linked_list", live(adding))) || (truthy(rt.fv(f, "linked_list", live(adding))) && !isEqual(rt.fv(f, "linked_list", live(adding)), live(f.src))))) {
		rt.incSrcVar(f, "node_amt", 1, true);
	}
	rt.setFv(f, "linked_list", live(adding), live(f.src));
	if ((truthy(live(position)) && rt.lt(live(position), rt.sv(f, "node_amt")))) {
		if (isEqual(live(position), 1)) {
			if (truthy(rt.sv(f, "head"))) {
				rt.setFv(f, "previous_node", rt.sv(f, "head"), live(adding));
				rt.setFv(f, "next_node", live(adding), rt.sv(f, "head"));
			}
			rt.setSv(f, "head", live(adding));
		} else {
			location = 0;
			at = null;
			while (!isEqual(live(location), live(position)) && rt.le(live(location), rt.sv(f, "node_amt"))) {
				if (truthy(live(at))) {
					if (truthy(rt.fv(f, "next_node", live(at)))) {
						at = rt.fv(f, "next_node", live(at));
					} else {
						break;
					}
				} else {
					at = rt.sv(f, "head");
				}
				location = rt.inc(live(location), 1);
			}
			if ((truthy(live(at)) && truthy(rt.fv(f, "previous_node", live(at))))) {
				rt.setFv(f, "next_node", rt.fv(f, "previous_node", live(at)), live(adding));
				rt.setFv(f, "previous_node", live(adding), rt.fv(f, "previous_node", live(at)));
				rt.setFv(f, "previous_node", live(at), live(adding));
				rt.setFv(f, "next_node", live(adding), live(at));
			}
		}
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "tail"))) {
		rt.setFv(f, "next_node", rt.sv(f, "tail"), live(adding));
		rt.setFv(f, "previous_node", live(adding), rt.sv(f, "tail"));
		if (!truthy(rt.fv(f, "previous_node", rt.sv(f, "tail")))) {
			rt.setSv(f, "head", rt.sv(f, "tail"));
		}
	}
	rt.setSv(f, "tail", live(adding));
	return f.dot;
});

// /datum/linked_list/proc/Remove  (code/__DATASTRUCTURES/linked_lists.dm:81)
rt.def("/datum/linked_list/proc/Remove", function Remove(f: Frame, node: Value) {
	let removing: Value = null, location: Value = null, current_value: Value = null, at: Value = null;
	f.vars = () => [removing, location, current_value, at];
	removing = null;
	if (truthy((rt.istype(live(node), T("/datum/linked_node")) ? 1 : 0))) {
		removing = live(node);
	} else {
		if (isEqual(live(removing), rt.sv(f, "head"))) {
			removing = rt.sv(f, "head");
		} else {
			if (isEqual(live(removing), rt.sv(f, "tail"))) {
				removing = rt.sv(f, "tail");
			} else {
				location = 1;
				current_value = null;
				at = null;
				while (!isEqual(live(current_value), live(node)) && rt.le(live(location), rt.sv(f, "node_amt"))) {
					if (truthy(live(at))) {
						if (truthy(rt.fv(f, "next_node", live(at)))) {
							at = rt.fv(f, "next_node", live(at));
						}
					} else {
						at = rt.sv(f, "head");
					}
					location = rt.inc(live(location), 1);
					if (truthy(live(at))) {
						if (isEqual((current_value = rt.fv(f, "value", live(at))), live(node))) {
							removing = live(at);
							break;
						}
					}
				}
			}
		}
	}
	if (truthy(live(removing))) {
		if (truthy(rt.fv(f, "previous_node", live(removing)))) {
			if (isEqual(live(removing), rt.sv(f, "tail"))) {
				rt.setSv(f, "tail", rt.fv(f, "previous_node", live(removing)));
			}
			if (truthy(rt.fv(f, "next_node", live(removing)))) {
				if (isEqual(live(removing), rt.sv(f, "head"))) {
					rt.setSv(f, "head", rt.fv(f, "next_node", live(removing)));
				}
				rt.setFv(f, "previous_node", rt.fv(f, "next_node", live(removing)), rt.fv(f, "previous_node", live(removing)));
				rt.setFv(f, "next_node", rt.fv(f, "previous_node", live(removing)), rt.fv(f, "next_node", live(removing)));
			} else {
				rt.setFv(f, "next_node", rt.fv(f, "previous_node", live(removing)), null);
			}
		} else {
			if (truthy(rt.fv(f, "next_node", live(removing)))) {
				if (isEqual(live(removing), rt.sv(f, "head"))) {
					rt.setSv(f, "head", rt.fv(f, "next_node", live(removing)));
				}
				rt.setFv(f, "previous_node", rt.fv(f, "next_node", live(removing)), null);
			}
		}
		if (isEqual(live(removing), rt.sv(f, "head"))) {
			rt.setSv(f, "head", null);
		}
		if (isEqual(live(removing), rt.sv(f, "tail"))) {
			rt.setSv(f, "tail", null);
		}
		rt.setFv(f, "next_node", live(removing), null);
		rt.setFv(f, "previous_node", live(removing), null);
		if (isEqual(rt.fv(f, "linked_list", live(removing)), live(f.src))) {
			rt.incSrcVar(f, "node_amt", -1, true);
		}
		rt.setFv(f, "linked_list", live(removing), null);
		return live(removing);
	}
	return 0;
});

// /datum/linked_list/proc/RemoveDelete  (code/__DATASTRUCTURES/linked_lists.dm:142)  may sleep
rt.def("/datum/linked_list/proc/RemoveDelete", function* RemoveDelete(f: Frame, node: Value) {
	let dead: Value = null;
	f.vars = () => [node, dead];
	if (truthy((dead = (yield* g.srcCall(f, "Remove", live(node)))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(dead)]);
		return 1;
	}
	return 0;
}, true);

// /datum/linked_list/proc/Empty  (code/__DATASTRUCTURES/linked_lists.dm:151)  may sleep
rt.def("/datum/linked_list/proc/Empty", function* Empty(f: Frame) {
	let n: Value = null, next: Value = null;
	f.vars = () => [n, next];
	n = rt.sv(f, "head");
	while (truthy(live(n))) {
		next = rt.fv(f, "next_node", live(n));
		yield* g.srcCall(f, "Remove", live(n));
		yield* g.call(f, P("/proc/qdel"), null, [live(n)]);
		n = live(next);
	}
	rt.setSv(f, "node_amt", 0);
	return f.dot;
}, true);

// /datum/linked_list/proc/CheckNodeLinks  (code/__DATASTRUCTURES/linked_lists.dm:162)
rt.def("/datum/linked_list/proc/CheckNodeLinks", function CheckNodeLinks(f: Frame) {
	let n: Value = null;
	f.vars = () => [n];
	n = rt.sv(f, "head");
	while (truthy(live(n))) {
		f.dot = fmt("|＀|", [rt.fv(f, "value", live(n))]);
		if (truthy(rt.fv(f, "previous_node", live(n)))) {
			f.dot = add(fmt("＀<-", [rt.gv(f, "value", rt.fv(f, "previous_node", live(n)))]), live(f.dot));
		}
		if (truthy(rt.fv(f, "next_node", live(n)))) {
			f.dot = rt.modify(live(f.dot), fmt("->＀", [rt.gv(f, "value", rt.fv(f, "next_node", live(n)))]), add);
		}
		n = rt.fv(f, "next_node", live(n));
		f.dot = rt.modify(live(f.dot), "<BR>", add);
	}
	return f.dot;
});

// /datum/linked_list/proc/DrawNodeLinks  (code/__DATASTRUCTURES/linked_lists.dm:174)
rt.def("/datum/linked_list/proc/DrawNodeLinks", function DrawNodeLinks(f: Frame) {
	let n: Value = null;
	f.vars = () => [n];
	f.dot = "|<-";
	n = rt.sv(f, "head");
	while (truthy(live(n))) {
		if (truthy(rt.fv(f, "previous_node", live(n)))) {
			f.dot = rt.modify(live(f.dot), "<-", add);
		}
		f.dot = rt.modify(live(f.dot), fmt("＀", [rt.fv(f, "value", live(n))]), add);
		if (truthy(rt.fv(f, "next_node", live(n)))) {
			f.dot = rt.modify(live(f.dot), "->", add);
		}
		n = rt.fv(f, "next_node", live(n));
	}
	f.dot = rt.modify(live(f.dot), "->|", add);
	return f.dot;
});

// /datum/linked_list/proc/ToList  (code/__DATASTRUCTURES/linked_lists.dm:187)
rt.def("/datum/linked_list/proc/ToList", function ToList(f: Frame) {
	let n: Value = null;
	f.vars = () => [n];
	f.dot = rt.list();
	n = rt.sv(f, "head");
	while (truthy(live(n))) {
		f.dot = rt.modify(live(f.dot), live(n), add);
		n = rt.fv(f, "next_node", live(n));
	}
	return f.dot;
});
