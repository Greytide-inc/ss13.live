// From code/datums/verbs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(868, "/datum/verbs", "/datum", {
	name: null,
	children: null,
	parent: null,
	verblist: null,
	abstract: 0,
});

// /datum/verbs/proc/GetList  (code/datums/verbs.dm:10)
rt.def("/datum/verbs/proc/GetList", function GetList(f: Frame) {
	rt.call(f, P("/proc/CRASH"), null, [fmt("Abstract verblist for ＀", [rt.sv(f, "type")])]);
	return f.dot;
});

// /datum/verbs/proc/New  (code/datums/verbs.dm:18)  may sleep
rt.def("/datum/verbs/proc/New", function* New(f: Frame) {
	let mainlist: Value = null, ourentry: Value = null, parent: Value = null;
	f.vars = () => [mainlist, ourentry, parent];
	mainlist = (yield* g.srcCall(f, "GetList"));
	ourentry = rt.index(live(mainlist), rt.sv(f, "type"));
	rt.setSv(f, "children", rt.list());
	rt.setSv(f, "verblist", rt.list());
	if (truthy(live(ourentry))) {
		if (!truthy((rt.istype(live(ourentry), T("/list")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			yield* g.call(f, P("/proc/CRASH"), null, [fmt("Verb double load: ＀", [rt.sv(f, "type")])]);
		}
		yield* g.srcCall(f, "Add_children", live(ourentry));
	}
	rt.setAt(live(mainlist), rt.sv(f, "type"), live(f.src));
	yield* g.srcCall(f, "Load_verbs", rt.sv(f, "type"), (yield* g.call(f, P("/proc/typesof"), null, [fmt("＀/verb", [rt.sv(f, "type")])])));
	if (!truthy((parent = rt.index(live(mainlist), rt.sv(f, "parent_type"))))) {
		rt.setAt(live(mainlist), rt.sv(f, "parent_type"), rt.list(live(f.src)));
	} else {
		if (truthy((rt.istype(live(parent), T("/list")) ? 1 : 0))) {
			parent = rt.modify(live(parent), live(f.src), add);
		} else {
			yield* g.callName(f, live(parent), "Add_children", [rt.list(live(f.src))]);
		}
	}
	return f.dot;
}, true);

// /datum/verbs/proc/Set_parent  (code/datums/verbs.dm:41)
rt.def("/datum/verbs/proc/Set_parent", function Set_parent(f: Frame, _parent: Value) {
	let verblistoftypes: Value = null, thing: Value = null, verbparenttype: Value = null;
	let $e: any;
	f.vars = () => [verblistoftypes, thing, verbparenttype, $e];
	rt.setSv(f, "parent", live(_parent));
	if (!truthy(rt.sv(f, "abstract"))) return f.dot;
	rt.callName(f, rt.sv(f, "parent"), "Add_children", [rt.sv(f, "children")]);
	verblistoftypes = rt.list();
	thing = null;
	rt.forList(f, 0, rt.sv(f, "verblist"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy(rt.index(live(verblistoftypes), rt.index(rt.sv(f, "verblist"), live(thing))))) {
			rt.setAt(live(verblistoftypes), rt.index(rt.sv(f, "verblist"), live(thing)), rt.list());
		}
		rt.modAt(live(verblistoftypes), rt.index(rt.sv(f, "verblist"), live(thing)), live(thing), add);
	}
	rt.endFor(f, 0);
	verbparenttype = null;
	rt.forList(f, 0, live(verblistoftypes));
	while (($e = rt.next(f, 0)) !== undefined) {
		verbparenttype = $e;
		rt.callName(f, rt.sv(f, "parent"), "Load_verbs", [live(verbparenttype), rt.index(live(verblistoftypes), live(verbparenttype))]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/verbs/proc/Add_children  (code/datums/verbs.dm:52)
rt.def("/datum/verbs/proc/Add_children", function Add_children(f: Frame, kids: Value) {
	let thing: Value = null, item: Value = null;
	let $e: any;
	f.vars = () => [thing, item, $e];
	if ((truthy(rt.sv(f, "abstract")) && truthy(rt.sv(f, "parent")))) {
		rt.callName(f, rt.sv(f, "parent"), "Add_children", [live(kids)]);
		return live(f.dot);
	}
	thing = null;
	rt.forList(f, 0, live(kids));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		rt.callName(f, (item = live(thing)), "Set_parent", [live(f.src)]);
		if (!truthy(rt.fv(f, "abstract", live(item)))) {
			rt.modSrcVar(f, "children", live(item), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/verbs/proc/Load_verbs  (code/datums/verbs.dm:63)
rt.def("/datum/verbs/proc/Load_verbs", function Load_verbs(f: Frame, verb_parent_type: Value, verbs: Value) {
	let verbpath: Value = null;
	let $e: any;
	f.vars = () => [verbpath, $e];
	if ((truthy(rt.sv(f, "abstract")) && truthy(rt.sv(f, "parent")))) {
		rt.callName(f, rt.sv(f, "parent"), "Load_verbs", [live(verb_parent_type), live(verbs)]);
		return live(f.dot);
	}
	verbpath = null;
	rt.forList(f, 0, live(verbs));
	while (($e = rt.next(f, 0)) !== undefined) {
		verbpath = $e;
		rt.setAt(rt.sv(f, "verblist"), live(verbpath), live(verb_parent_type));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/verbs/proc/Generate_list  (code/datums/verbs.dm:71)
rt.def("/datum/verbs/proc/Generate_list", function Generate_list(f: Frame) {
	let thing: Value = null, child: Value = null, childlist: Value = null, childname: Value = null, tree: Value = null, verbpath: Value = null, entry: Value = null;
	let $e: any;
	f.vars = () => [thing, child, childlist, childname, tree, verbpath, entry, $e];
	f.dot = rt.list();
	if (truthy(rt.length(rt.sv(f, "children")))) {
		thing = null;
		rt.forList(f, 0, rt.sv(f, "children"));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			child = live(thing);
			if (truthy((childlist = rt.callName(f, live(child), "Generate_list", [f.argsList], rt.Args.List)))) {
				if (isEqual((childname = fmt("＀", [live(child)])), fmt("＀", [rt.fv(f, "type", live(child))]))) {
					childname = rt.index((tree = rt.call(f, P("/proc/splittext"), null, [live(childname), "/"])), rt.len(f, live(tree)));
				}
				rt.setAt(live(f.dot), rt.fv(f, "type", live(child)), fmt("parent=＀;name=＀", [rt.call(f, P("/proc/url_encode"), null, [rt.sv(f, "type")]), rt.call(f, P("/proc/url_encode"), null, [live(childname)])]));
				f.dot = rt.modify(live(f.dot), live(childlist), add);
			}
		}
		rt.endFor(f, 0);
	}
	thing = null;
	rt.forList(f, 0, rt.sv(f, "verblist"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy((verbpath = live(thing)))) {
			rt.call(f, P("/proc/stack_trace"), null, [fmt("Bad VERB in ＀ verblist: ＀", [rt.sv(f, "type"), rt.call(f, P("/proc/english_list"), null, [rt.sv(f, "verblist")])])]);
		}
		rt.setAt((entry = rt.list()), "parent", fmt("＀", [rt.sv(f, "type")]));
		rt.setAt(live(entry), "name", rt.fv(f, "desc", live(verbpath)));
		if (isEqual(rt.call(f, P("/proc/copytext"), null, [rt.fv(f, "name", live(verbpath)), 1, 2]), "@")) {
			rt.setAt(live(entry), "command", rt.call(f, P("/proc/copytext"), null, [rt.fv(f, "name", live(verbpath)), 2]));
		} else {
			rt.setAt(live(entry), "command", rt.call(f, P("/proc/replacetext"), null, [rt.fv(f, "name", live(verbpath)), " ", "-"]));
		}
		rt.setAt(live(f.dot), live(verbpath), rt.callSrc(f, "HandleVerb", [add(rt.list(live(entry), live(verbpath)), f.argsList)], rt.Args.List));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /world/proc/LoadVerbs  (code/datums/verbs.dm:99)  may sleep
rt.def("/world/proc/LoadVerbs", function* LoadVerbs(f: Frame, verb_type: Value) {
	let typepath: Value = null;
	let $e: any;
	f.vars = () => [verb_type, typepath, $e];
	if ((!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(verb_type), T("/datum/verbs")]))) || isEqual(live(verb_type), T("/datum/verbs")))) {
		yield* g.call(f, P("/proc/CRASH"), null, [fmt("Invalid verb_type: ＀", [live(verb_type)])]);
	}
	typepath = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [live(verb_type)])), live(verb_type)));
	while (($e = rt.next(f, 0)) !== undefined) {
		typepath = $e;
		yield* g.new_(f, live(typepath), []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
