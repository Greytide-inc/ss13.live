// Based on /tg/station's code/datums/verbs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


rt.type(868, "/datum/verbs", "/datum", {
	name: null,
	children: null,
	parent: null,
	verblist: null,
	abstract: 0,
});

// verbs.dm:10
rt.def("/datum/verbs/proc/GetList", function GetList(f: Frame) {
	CRASH(`Abstract verblist for ${this.type}`);
	return f.dot;
});

// verbs.dm:18
rt.def("/datum/verbs/proc/New", function* New(f: Frame) {
	let parent: Value = null;
	let mainlist: Value = this.GetList();
	let ourentry: Value = rt.index(mainlist, this.type);
	this.children = list();
	this.verblist = list();
	if (ourentry) {
		if (!rt.istype(ourentry, T("/list"))) {
			yield* qdel(this);
			CRASH(`Verb double load: ${this.type}`);
		}
		this.Add_children(ourentry);
	}
	rt.setAt(mainlist, this.type, this);
	this.Load_verbs(this.type, typesof(`${this.type}/verb`));
	if (!(parent = rt.index(mainlist, this.parent_type))) {
		rt.setAt(mainlist, this.parent_type, list(this));
	} else if (rt.istype(parent, T("/list"))) {
		parent += this;
	} else {
		parent.Add_children(list(this));
	}
	return f.dot;
}, true);

// verbs.dm:41
rt.def("/datum/verbs/proc/Set_parent", function Set_parent(f: Frame, _parent: Value) {
	let thing: Value = null, verbparenttype: Value = null;
	this.parent = _parent;
	if (!this.abstract) return f.dot;
	this.parent.Add_children(this.children);
	let verblistoftypes: Value = list();
	for (thing of each(this.verblist)) {
		if (!rt.index(verblistoftypes, rt.index(this.verblist, thing))) {
			rt.setAt(verblistoftypes, rt.index(this.verblist, thing), list());
		}
		rt.modAt(verblistoftypes, rt.index(this.verblist, thing), thing, add);
	}
	for (verbparenttype of each(verblistoftypes)) {
		this.parent.Load_verbs(verbparenttype, rt.index(verblistoftypes, verbparenttype));
	}
	return f.dot;
});

// verbs.dm:52
rt.def("/datum/verbs/proc/Add_children", function Add_children(f: Frame, kids: Value) {
	let thing: Value = null, item: Value = null;
	if (this.abstract && this.parent) {
		this.parent.Add_children(kids);
		return f.dot;
	}
	for (thing of each(kids)) {
		(item = thing).Set_parent(this);
		if (!item.abstract) {
			this.children += item;
		}
	}
	return f.dot;
});

// verbs.dm:63
rt.def("/datum/verbs/proc/Load_verbs", function Load_verbs(f: Frame, verb_parent_type: Value, verbs: Value) {
	let verbpath: Value = null;
	if (this.abstract && this.parent) {
		this.parent.Load_verbs(verb_parent_type, verbs);
		return f.dot;
	}
	for (verbpath of each(verbs)) {
		rt.setAt(this.verblist, verbpath, verb_parent_type);
	}
	return f.dot;
});

// verbs.dm:71
rt.def("/datum/verbs/proc/Generate_list", function Generate_list(f: Frame) {
	let thing: Value = null, child: Value = null, childlist: Value = null, childname: Value = null, tree: Value = null, verbpath: Value = null, entry: Value = null;
	f.dot = list();
	if (rt.length(this.children)) {
		for (thing of each(this.children)) {
			child = thing;
			if (childlist = rt.callName(f, child, "Generate_list", [f.argsList], rt.Args.List)) {
				if ((childname = `${child}`) == `${child.type}`) {
					childname = rt.index((tree = splittext(childname, "/")), rt.len(f, tree));
				}
				rt.setAt(f.dot, child.type, `parent=${url_encode(this.type)};name=${url_encode(childname)}`);
				f.dot += childlist;
			}
		}
	}
	thing = null;
	for (thing of each(this.verblist)) {
		if (!(verbpath = thing)) {
			stack_trace(`Bad VERB in ${this.type} verblist: ${english_list(this.verblist)}`);
		}
		rt.setAt((entry = list()), "parent", `${this.type}`);
		rt.setAt(entry, "name", verbpath.desc);
		if (copytext(verbpath.name, 1, 2) == "@") {
			rt.setAt(entry, "command", copytext(verbpath.name, 2));
		} else {
			rt.setAt(entry, "command", replacetext(verbpath.name, " ", "-"));
		}
		rt.setAt(f.dot, verbpath, rt.callSrc(f, "HandleVerb", [list(entry, verbpath) + f.argsList], rt.Args.List));
	}
	return f.dot;
});

// verbs.dm:99
rt.def("/world/proc/LoadVerbs", function* LoadVerbs(f: Frame, verb_type: Value) {
	let typepath: Value = null;
	if (!ispath(verb_type, T("/datum/verbs")) || verb_type == T("/datum/verbs")) {
		CRASH(`Invalid verb_type: ${verb_type}`);
	}
	for (typepath of each(typesof(verb_type) - verb_type)) {
		yield* new_(typepath);
	}
	return f.dot;
}, true);
