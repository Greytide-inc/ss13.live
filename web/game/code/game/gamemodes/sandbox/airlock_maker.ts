// From code/game/gamemodes/sandbox/airlock_maker.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/structure/door_assembly/proc/attack_hand  (code/game/gamemodes/sandbox/airlock_maker.dm:11)  may sleep
rt.def("/obj/structure/door_assembly/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "maker"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "maker"), "interact", []);
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

// /datum/airlock_maker/proc/New  (code/game/gamemodes/sandbox/airlock_maker.dm:27)  may sleep
rt.def("/datum/airlock_maker/proc/New", function* New(f: Frame, target_loc: Value) {
	f.vars = () => [target_loc];
	rt.setSv(f, "linked", (yield* g.new_(f, T("/obj/structure/door_assembly"), [live(target_loc)])));
	rt.setFv(f, "maker", rt.sv(f, "linked"), live(f.src));
	rt.setFv(f, "anchored", rt.sv(f, "linked"), 0);
	rt.setSv(f, "access_used", rt.list());
	yield* g.srcCall(f, "interact");
	return f.dot;
}, true);

// /datum/airlock_maker/proc/linkpretty  (code/game/gamemodes/sandbox/airlock_maker.dm:35)
rt.def("/datum/airlock_maker/proc/linkpretty", function linkpretty(f: Frame, href: Value, desc: Value, active: Value) {
	f.vars = () => [desc];
	if (!truthy(live(desc))) {
		desc = rt.index(rt.gl("defaults"), add(live(active), 1));
	}
	if (truthy(live(active))) {
		return fmt("<a href='?src=＃;＀'><b>＀</b></a>", [live(f.src), live(href), live(desc)]);
	}
	return fmt("<a href='?src=＃;＀'><i>＀</i></a>", [live(f.src), live(href), live(desc)]);
});

// /datum/airlock_maker/proc/interact  (code/game/gamemodes/sandbox/airlock_maker.dm:43)
rt.def("/datum/airlock_maker/proc/interact", function interact(f: Frame) {
	let leftcolumn: Value = null, rightcolumn: Value = null, access: Value = null, option: Value = null, length: Value = null, dat: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [leftcolumn, rightcolumn, access, option, length, dat, i, $e];
	leftcolumn = rt.list();
	rightcolumn = rt.list();
	leftcolumn = rt.modify(live(leftcolumn), "<u><b>Required Access</b></u>", add);
	access = null;
	rt.forList(f, 0, rt.call(f, P("/proc/get_all_accesses"), null, []));
	while (($e = rt.next(f, 0)) !== undefined) {
		access = $e;
		leftcolumn = rt.modify(live(leftcolumn), rt.callSrc(f, "linkpretty", [fmt("access=＀", [live(access)]), rt.call(f, P("/proc/get_access_desc"), null, [live(access)]), (rt.isIn(f, live(access), rt.sv(f, "access_used")) ? 1 : 0)]), add);
	}
	rt.endFor(f, 0);
	leftcolumn = rt.modify(live(leftcolumn), fmt("Require all listed accesses: ＀", [rt.callSrc(f, "linkpretty", ["reqall", null, rt.sv(f, "require_all")])]), add);
	rightcolumn = rt.modify(live(rightcolumn), "<u><b>Paintjob</b></u>", add);
	option = null;
	rt.forList(f, 0, rt.list("none", "engineering", "atmos", "security", "command", "medical", "research", "mining", "maintenance", "external", "highsecurity"));
	while (($e = rt.next(f, 0)) !== undefined) {
		option = $e;
		rightcolumn = rt.modify(live(rightcolumn), rt.callSrc(f, "linkpretty", [fmt("paint=＀", [live(option)]), live(option), (isEqual(live(option), rt.sv(f, "paintjob")) ? 1 : 0)]), add);
	}
	rt.endFor(f, 0);
	rightcolumn = rt.modify(live(rightcolumn), add(add("Glass door: ", rt.callSrc(f, "linkpretty", ["glass", null, rt.sv(f, "glassdoor")])), "<br><br>"), add);
	length = rt.call(f, P("/proc/max"), null, [rt.len(f, live(leftcolumn)), rt.len(f, live(rightcolumn))]);
	dat = "You may move the model airlock around.  A new airlock will be built in its space when you click done, below.<hr><br>";
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;rename'>Door name</a>: \"＀\"", [live(f.src), rt.sv(f, "doorname")]), add);
	dat = rt.modify(live(dat), "<table>", add);
	i = null;
	i = 1;
	while (rt.le(live(i), live(length))) {
		dat = rt.modify(live(dat), "<tr><td>", add);
		if (rt.le(live(i), rt.len(f, live(leftcolumn)))) {
			dat = rt.modify(live(dat), rt.index(live(leftcolumn), live(i)), add);
		}
		dat = rt.modify(live(dat), "</td><td>", add);
		if (rt.le(live(i), rt.len(f, live(rightcolumn)))) {
			dat = rt.modify(live(dat), rt.index(live(rightcolumn), live(i)), add);
		}
		dat = rt.modify(live(dat), "</td></tr>", add);
		i = rt.inc(live(i), 1);
	}
	dat = rt.modify(live(dat), fmt("</table><hr><a href='?src=＃;done'>Finalize Airlock Construction</a> | <a href='?src=＃;cancel'>Cancel and Destroy Airlock</a>", [live(f.src), live(f.src)]), add);
	rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=airlockmaker"], false);
	return f.dot;
});

// /datum/airlock_maker/proc/Topic  (code/game/gamemodes/sandbox/airlock_maker.dm:72)  may sleep
rt.def("/datum/airlock_maker/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let newname: Value = null, value: Value = null, t_loc: Value = null, target_type: Value = null, final: Value = null, D: Value = null;
	f.vars = () => [href, href_list, newname, value, t_loc, target_type, final, D];
	if (!truthy(live(f.usr))) {
		return live(f.dot);
	}
	if (((!truthy(live(f.src)) || !truthy(rt.sv(f, "linked"))) || !truthy(rt.fv(f, "loc", rt.sv(f, "linked"))))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=airlockmaker"], false);
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, "rename", live(href_list)) ? 1 : 0))) {
		if (truthy((newname = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "New airlock name:", "Name the airlock", rt.sv(f, "doorname")]))))) {
			rt.setSv(f, "doorname", live(newname));
		}
	}
	if (truthy((rt.isIn(f, "access", live(href_list)) ? 1 : 0))) {
		(rt.modSrcVar(f, "access_used", (value = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "access")]))), rt.bitXor));
	}
	if (truthy((rt.isIn(f, "reqall", live(href_list)) ? 1 : 0))) {
		rt.setSv(f, "require_all", (!truthy(rt.sv(f, "require_all")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "paint", live(href_list)) ? 1 : 0))) {
		rt.setSv(f, "paintjob", rt.at(live(href_list), "paint"));
	}
	if (truthy((rt.isIn(f, "glass", live(href_list)) ? 1 : 0))) {
		rt.setSv(f, "glassdoor", (!truthy(rt.sv(f, "glassdoor")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "cancel", live(href_list)) ? 1 : 0))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=airlockmaker"], false);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "linked")]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, "done", live(href_list)) ? 1 : 0))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=airlockmaker"], false);
		t_loc = rt.fv(f, "loc", rt.sv(f, "linked"));
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "linked")]);
		if (!truthy((rt.istype(live(t_loc), T("/turf")) ? 1 : 0))) {
			return live(f.dot);
		}
		target_type = "/obj/machinery/door/airlock";
		if (truthy(rt.sv(f, "glassdoor"))) {
			if (!isEqual(rt.sv(f, "paintjob"), "none")) {
				if (truthy((rt.isIn(f, rt.sv(f, "paintjob"), rt.list("external", "highsecurity", "maintenance")) ? 1 : 0))) {
					target_type = rt.modify(live(target_type), fmt("/＀", [rt.sv(f, "paintjob")]), add);
				} else {
					target_type = rt.modify(live(target_type), fmt("/glass_＀", [rt.sv(f, "paintjob")]), add);
				}
			} else {
				target_type = rt.modify(live(target_type), "/glass", add);
			}
		} else {
			if (!isEqual(rt.sv(f, "paintjob"), "none")) {
				target_type = rt.modify(live(target_type), fmt("/＀", [rt.sv(f, "paintjob")]), add);
			}
		}
		if (!truthy((target_type = (yield* g.call(f, P("/proc/text2path"), null, [(final = live(target_type))]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Didn't work, contact Sayu with this: ＀", [live(final)])]);
			rt.op(f, "Browse", [], [live(f.usr), null, "window=airlockmaker"], false);
			return live(f.dot);
		}
		rt.setFv(f, "name", (D = (yield* g.new_(f, live(target_type), [live(t_loc)]))), rt.sv(f, "doorname"));
		if (isEqual(rt.len(f, rt.sv(f, "access_used")), 0)) {
			rt.setFv(f, "req_access", live(D), null);
			rt.setFv(f, "req_one_access", live(D), null);
		} else {
			if (truthy(rt.sv(f, "require_all"))) {
				rt.setFv(f, "req_access", live(D), (yield* g.callName(f, rt.sv(f, "access_used"), "Copy", [])));
				rt.setFv(f, "req_one_access", live(D), null);
			} else {
				rt.setFv(f, "req_access", live(D), null);
				rt.setFv(f, "req_one_access", live(D), (yield* g.callName(f, rt.sv(f, "access_used"), "Copy", [])));
			}
		}
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact");
	return f.dot;
}, true);
