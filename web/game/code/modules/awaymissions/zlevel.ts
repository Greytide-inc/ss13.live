// From code/modules/awaymissions/zlevel.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalpotentialRandomZlevels  (code/modules/awaymissions/zlevel.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalpotentialRandomZlevels", function InitGlobalpotentialRandomZlevels(f: Frame) {
	rt.setGl("potentialRandomZlevels", rt.call(f, P("/proc/generateMapList"), null, ["filename", "config/awaymissionconfig.txt"], rt.Args.Named));
	rt.modSrcVar(f, "gvars_datum_init_order", "potentialRandomZlevels", add);
	return f.dot;
});

// /proc/createRandomZlevel  (code/modules/awaymissions/zlevel.dm:5)  may sleep
rt.def("/proc/createRandomZlevel", function* createRandomZlevel(f: Frame) {
	let map: Value = null;
	f.vars = () => [map];
	if (truthy(rt.len(f, rt.gl("awaydestinations")))) {
		return live(f.dot);
	}
	if (!(truthy(rt.gl("potentialRandomZlevels")) && truthy(rt.len(f, rt.gl("potentialRandomZlevels"))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Loading away mission...</span>"]);
	yield* g.call(f, P("/proc/load_new_z_level"), null, [(map = rt.op(f, "PickUnweighted", [1], [rt.gl("potentialRandomZlevels")]))]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Away mission loaded.</span>"]);
	return f.dot;
}, true);

rt.type(11519, "/obj/effect/landmark/awaystart", "/obj/effect/landmark", {
	name: "away mission spawn",
	desc: "Randomly picked away mission spawn points",
});

// /obj/effect/landmark/awaystart/proc/New  (code/modules/awaymissions/zlevel.dm:26)  may sleep
rt.def("/obj/effect/landmark/awaystart/proc/New", function* New(f: Frame) {
	rt.modGl("awaydestinations", live(f.src), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/effect/landmark/awaystart/proc/Destroy  (code/modules/awaymissions/zlevel.dm:30)  may sleep
rt.def("/obj/effect/landmark/awaystart/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("awaydestinations", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /proc/generateMapList  (code/modules/awaymissions/zlevel.dm:34)
rt.def("/proc/generateMapList", function generateMapList(f: Frame, filename: Value) {
	let potentialMaps: Value = null, Lines: Value = null, t: Value = null, pos: Value = null, name: Value = null;
	let $e: any;
	f.vars = () => [potentialMaps, Lines, t, pos, name, $e];
	potentialMaps = rt.list();
	if (!truthy(rt.getLen(f, (Lines = rt.callName(f, rt.world(), "file2list", [live(filename)]))))) {
		return live(f.dot);
	}
	t = null;
	rt.forList(f, 0, live(Lines));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if (!truthy(live(t))) {
			continue;
		}
		if (isEqual(rt.length((t = rt.call(f, P("/proc/trim"), null, [live(t)]))), 0)) {
			continue;
		}
		if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(t), 1, 2]), "#")) {
			continue;
		}
		pos = rt.call(f, P("/proc/findtext"), null, [live(t), " "]);
		name = null;
		if (truthy(live(pos))) {
			name = rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/copytext"), null, [live(t), 1, live(pos)])]);
		} else {
			name = rt.call(f, P("/proc/lowertext"), null, [live(t)]);
		}
		if (!truthy(live(name))) {
			continue;
		}
		rt.callName(f, live(potentialMaps), "Add", [live(t)]);
	}
	rt.endFor(f, 0);
	return live(potentialMaps);
});
