// Based on /tg/station's code/game/gamemodes/sandbox/airlock_maker.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// airlock_maker.dm:11
rt.def("/obj/structure/door_assembly/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* parent_proc();
	if (!this.maker) return f.dot;
	yield* this.maker.interact();
	return f.dot;
}, true);

rt.type(1433, "/datum/airlock_maker", "/datum", {
	linked: null,
	access_used: null,
	require_all: 1,
	paintjob: "none",
	glassdoor: 0,
	doorname: "airlock",
});

// airlock_maker.dm:27
rt.def("/datum/airlock_maker/proc/New", function* New(f: Frame, target_loc: Value) {
	this.linked = (yield* new_(T("/obj/structure/door_assembly"), target_loc));
	this.linked.maker = this;
	this.linked.anchored = 0;
	this.access_used = list();
	yield* this.interact();
	return f.dot;
}, true);

// airlock_maker.dm:35
rt.def("/datum/airlock_maker/proc/linkpretty", function linkpretty(f: Frame, href: Value, desc: Value, active: Value) {
	if (!desc) {
		desc = rt.index(GLOB.defaults, active + 1);
	}
	if (active) {
		return fmt("<a href='?src=＃;＀'><b>＀</b></a>", [this, href, desc]);
	}
	return fmt("<a href='?src=＃;＀'><i>＀</i></a>", [this, href, desc]);
});

// airlock_maker.dm:43
rt.def("/datum/airlock_maker/proc/interact", function interact(f: Frame) {
	let access: Value = null, option: Value = null;
	let leftcolumn: Value = list();
	let rightcolumn: Value = list();
	leftcolumn += "<u><b>Required Access</b></u>";
	for (access of each(get_all_accesses())) {
		leftcolumn += this.linkpretty(`access=${access}`, get_access_desc(access), (rt.isIn(f, access, this.access_used) ? 1 : 0));
	}
	leftcolumn += `Require all listed accesses: ${this.linkpretty("reqall", null, this.require_all)}`;
	rightcolumn += "<u><b>Paintjob</b></u>";
	for (option of each(list("none", "engineering", "atmos", "security", "command", "medical", "research", "mining", "maintenance", "external", "highsecurity"))) {
		rightcolumn += this.linkpretty(`paint=${option}`, option, (option == this.paintjob ? 1 : 0));
	}
	rightcolumn += "Glass door: " + this.linkpretty("glass", null, this.glassdoor) + "<br><br>";
	let length: Value = max(rt.len(f, leftcolumn), rt.len(f, rightcolumn));
	let dat: Value = "You may move the model airlock around.  A new airlock will be built in its space when you click done, below.<hr><br>";
	dat += fmt("<a href='?src=＃;rename'>Door name</a>: \"＀\"", [this, this.doorname]);
	dat += "<table>";
	let i: Value = 1;
	while (i <= length) {
		dat += "<tr><td>";
		if (i <= rt.len(f, leftcolumn)) {
			dat += rt.index(leftcolumn, i);
		}
		dat += "</td><td>";
		if (i <= rt.len(f, rightcolumn)) {
			dat += rt.index(rightcolumn, i);
		}
		dat += "</td></tr>";
		i++;
	}
	dat += fmt("</table><hr><a href='?src=＃;done'>Finalize Airlock Construction</a> | <a href='?src=＃;cancel'>Cancel and Destroy Airlock</a>", [this, this]);
	rt.op(f, "Browse", [], [f.usr, dat, "window=airlockmaker"], false);
	return f.dot;
});

// airlock_maker.dm:72
rt.def("/datum/airlock_maker/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let newname: Value = null, value: Value = null, t_loc: Value = null, target_type: Value = null, final: Value = null, D: Value = null;
	if (!f.usr) {
		return f.dot;
	}
	if (!this || !this.linked || !this.linked.loc) {
		rt.op(f, "Browse", [], [f.usr, null, "window=airlockmaker"], false);
		return f.dot;
	}
	if (rt.isIn(f, "rename", href_list)) {
		if (newname = (yield* stripped_input(f.usr, "New airlock name:", "Name the airlock", this.doorname))) {
			this.doorname = newname;
		}
	}
	if (rt.isIn(f, "access", href_list)) {
		(rt.modSrcVar(f, "access_used", (value = text2num(rt.at(href_list, "access"))), rt.bitXor));
	}
	if (rt.isIn(f, "reqall", href_list)) {
		this.require_all = (!this.require_all ? 1 : 0);
	}
	if (rt.isIn(f, "paint", href_list)) {
		this.paintjob = rt.at(href_list, "paint");
	}
	if (rt.isIn(f, "glass", href_list)) {
		this.glassdoor = (!this.glassdoor ? 1 : 0);
	}
	if (rt.isIn(f, "cancel", href_list)) {
		rt.op(f, "Browse", [], [f.usr, null, "window=airlockmaker"], false);
		yield* qdel(this.linked);
		yield* qdel(this);
		return f.dot;
	}
	if (rt.isIn(f, "done", href_list)) {
		rt.op(f, "Browse", [], [f.usr, null, "window=airlockmaker"], false);
		t_loc = this.linked.loc;
		yield* qdel(this.linked);
		if (!rt.istype(t_loc, T("/turf"))) {
			return f.dot;
		}
		target_type = "/obj/machinery/door/airlock";
		if (this.glassdoor) {
			if (this.paintjob != "none") {
				if (rt.isIn(f, this.paintjob, list("external", "highsecurity", "maintenance"))) {
					target_type += `/${this.paintjob}`;
				} else {
					target_type += `/glass_${this.paintjob}`;
				}
			} else {
				target_type += "/glass";
			}
		} else if (this.paintjob != "none") {
			target_type += `/${this.paintjob}`;
		}
		if (!(target_type = text2path((final = target_type)))) {
			to_chat(f.usr, `Didn't work, contact Sayu with this: ${final}`);
			rt.op(f, "Browse", [], [f.usr, null, "window=airlockmaker"], false);
			return f.dot;
		}
		(D = (yield* new_(target_type, t_loc))).name = this.doorname;
		if (rt.len(f, this.access_used) == 0) {
			D.req_access = null;
			D.req_one_access = null;
		} else if (this.require_all) {
			D.req_access = (yield* this.access_used.Copy());
			D.req_one_access = null;
		} else {
			D.req_access = null;
			D.req_one_access = (yield* this.access_used.Copy());
		}
		return f.dot;
	}
	yield* this.interact();
	return f.dot;
}, true);
