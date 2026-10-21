// From code/controllers/subsystem/title.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(49, "/datum/controller/subsystem/title", "/datum/controller/subsystem", {
	file_path: null,
	icon: null,
	previous_icon: null,
	splash_turf: null,
	name: "Title Screen",
	flags: 3,
});

// /datum/controller/subsystem/title/proc/New  (code/controllers/subsystem/title.dm:1)  may sleep
rt.def("/datum/controller/subsystem/title/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SStitle"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SStitle"), T("/datum/controller/subsystem/title")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SStitle")]);
		}
		rt.setGl("SStitle", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/title/proc/PreInit  (code/controllers/subsystem/title.dm:11)
rt.def("/datum/controller/subsystem/title/proc/PreInit", function PreInit(f: Frame) {
	let previous_path: Value = null, provisional_title_screens: Value = null, title_screens: Value = null, use_rare_screens: Value = null, S: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [previous_path, provisional_title_screens, title_screens, use_rare_screens, S, L, $e];
	if ((truthy(rt.sv(f, "file_path")) && truthy(rt.sv(f, "icon")))) {
		return live(f.dot);
	}
	if (truthy(rt.call(f, P("/proc/fexists"), null, ["data/previous_title.dat"]))) {
		if (truthy(rt.call(f, P("/proc/istext"), null, [(previous_path = rt.call(f, P("/proc/file2text"), null, ["data/previous_title.dat"]))]))) {
			rt.setSv(f, "previous_icon", rt.new_(f, T("/icon"), [rt.sv(f, "previous_icon")]));
		}
	}
	rt.call(f, P("/proc/fdel"), null, ["data/previous_title.dat"]);
	provisional_title_screens = rt.call(f, P("/proc/flist"), null, ["config/title_screens/images/"]);
	title_screens = rt.list();
	use_rare_screens = rt.op(f, "Prob", [], [1]);
	S = null;
	rt.forList(f, 0, live(provisional_title_screens));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (((isEqual(rt.getLen(f, (L = rt.call(f, P("/proc/splittext"), null, [live(S), "+"]))), 1) && !isEqual(rt.index(live(L), 1), "blank.png")) || (rt.gt(rt.len(f, live(L)), 1) && ((truthy(live(use_rare_screens)) && isEqual(rt.call(f, P("/proc/lowertext"), null, [rt.index(live(L), 1)]), "rare")) || isEqual(rt.call(f, P("/proc/lowertext"), null, [rt.index(live(L), 1)]), rt.call(f, P("/proc/lowertext"), null, [rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping")))])))))) {
			title_screens = rt.modify(live(title_screens), live(S), add);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.call(f, P("/proc/isemptylist"), null, [live(title_screens)]))) return f.dot;
	if (rt.gt(rt.length(live(title_screens)), 1)) {
		S = null;
		rt.forList(f, 0, live(title_screens));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if ((!isEqual(rt.getLen(f, (L = rt.call(f, P("/proc/splittext"), null, [live(S), "."]))), 2) || !isEqual(rt.index(live(L), 1), "default"))) {
				continue;
			}
			(title_screens = rt.modify(live(title_screens), live(S), subtract));
			break;
		}
		rt.endFor(f, 0);
	}
	rt.setSv(f, "file_path", fmt("config/title_screens/images/＀", [rt.op(f, "PickUnweighted", [1], [live(title_screens)])]));
	rt.setSv(f, "icon", rt.new_(f, T("/icon"), [rt.call(f, P("/proc/fcopy_rsc"), null, [rt.sv(f, "file_path")])]));
	if (!truthy(rt.sv(f, "splash_turf"))) return f.dot;
	rt.setFv(f, "icon", rt.sv(f, "splash_turf"), rt.sv(f, "icon"));
	return f.dot;
});

// /datum/controller/subsystem/title/proc/vv_edit_var  (code/controllers/subsystem/title.dm:46)
rt.def("/datum/controller/subsystem/title/proc/vv_edit_var", function vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	$0 = live(f.args[0]);
	if ($0 === "icon") {
		if (!truthy(rt.sv(f, "splash_turf"))) return f.dot;
		rt.setFv(f, "icon", rt.sv(f, "splash_turf"), rt.sv(f, "icon"));
	}
	return f.dot;
}, false, { args: ["var_name", "var_value"] });

// /datum/controller/subsystem/title/proc/Shutdown  (code/controllers/subsystem/title.dm:55)  may sleep
rt.def("/datum/controller/subsystem/title/proc/Shutdown", function* Shutdown(f: Frame) {
	let F: Value = null, thing: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [F, thing, S, $e];
	if (truthy(rt.sv(f, "file_path"))) {
		F = (yield* g.call(f, P("/proc/file"), null, ["data/previous_title.dat"]));
		rt.op(f, "Output", [], [live(F), rt.sv(f, "file_path")], false);
	}
	thing = null;
	rt.forList(f, 0, rt.gl("clients"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy(live(thing))) {
			continue;
		}
		yield* g.callName(f, (S = (yield* g.new_(f, T("/obj/screen/splash"), [live(thing), 0]))), "Fade", [0, 0]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
